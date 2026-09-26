import { bodyIndex } from '../data';
import { SCENES } from '../data/scenes';
import { fokusAbstand } from '../sim/scale';
import type { ScaleSettings } from '../sim/scale';
import type { Body } from '../sim/types';
import { dateToJd, jdToDate, imZeitbereich } from '../sim/time';
import { DEFAULT_STATE } from './index';
import { decodePatch, encodePatch, mergePatch } from './serialize';
import { istPlain } from './pruefer';
import type { Plain } from './pruefer';
import { patchFuer } from './persist';
import type { AppState } from './types';

/**
 * Ergebnis der Fragmentauswertung. `patch` ist der zusammengesetzte Zustand
 * aus `p`, `date`, `body` und `lang`; er ist nur dann `null`, wenn kein
 * einziger der bekannten Schlüssel einen gültigen Wert trug — dann verhält
 * sich das Fragment wie ein beschädigter Link und der Aufrufer fällt auf die
 * gemerkte Sitzung zurück. `szeneId` ist die Kennung aus `scene`, wenn sie im
 * Szenenkatalog vorkommt.
 */
export interface FragmentErgebnis {
  patch: Plain | null;
  szeneId: string | null;
}

/**
 * Zerlegt den Fragmentinhalt (ohne führendes „#") in Schlüssel-Wert-Paare.
 * Schlüssel und Wert werden einzeln URL-dekodiert; scheitert das (kaputte
 * Prozent-Folge), bleibt der rohe Text stehen — er fällt dann ohnehin bei der
 * Feldprüfung durch. Bei doppeltem Schlüssel zählt der erste Eintrag, ein
 * Paar ohne „=" gilt als Schlüssel mit leerem Wert.
 */
function paare(inhalt: string): Map<string, string> {
  const ergebnis = new Map<string, string>();
  if (inhalt === '') return ergebnis;
  for (const teil of inhalt.split('&')) {
    if (teil === '') continue;
    const trenner = teil.indexOf('=');
    const rohSchluessel = trenner === -1 ? teil : teil.slice(0, trenner);
    const rohWert = trenner === -1 ? '' : teil.slice(trenner + 1);
    const dekodieren = (roh: string): string => {
      try {
        return decodeURIComponent(roh);
      } catch {
        return roh;
      }
    };
    const schluessel = dekodieren(rohSchluessel);
    if (!ergebnis.has(schluessel)) ergebnis.set(schluessel, dekodieren(rohWert));
  }
  return ergebnis;
}

const DATUM_NUR_TAG = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATUM_MIT_ZEIT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})Z$/;

/**
 * Julianisches Datum aus `date`, oder `null` bei ungültiger Schreibweise,
 * unmöglichem Kalenderdatum oder einem Zeitpunkt außerhalb des Zeitbereichs.
 * Ohne Uhrzeit gilt 12:00 UTC.
 *
 * `Date.UTC` bildet ein einstelliges bis zweistelliges Jahr (0–99) auf
 * 1900–1999 ab (Sprachregel, kein Fehler in der Engine) — für ein Datum wie
 * „0050-06-15" käme so das Jahr 1950 heraus. Die Funktion setzt das Jahr
 * deshalb über `setUTCFullYear`, das diese Abbildung nicht kennt.
 *
 * Ein unmögliches Datum wie „2026-02-30" schriebe JavaScript sonst still auf
 * den 2. März um; das Zurücklesen der gesetzten Felder deckt jede solche
 * Verschiebung auf (Monat, Tag, Stunde oder Minute außerhalb ihres Bereichs
 * wandert in den nächsten bzw. vorigen Kalenderteil und stimmt danach mit der
 * Eingabe nicht mehr überein).
 */
function datumZuJd(wert: string): number | null {
  const nurTag = DATUM_NUR_TAG.exec(wert);
  const mitZeit = nurTag === null ? DATUM_MIT_ZEIT.exec(wert) : null;
  const treffer = nurTag ?? mitZeit;
  if (treffer === null) return null;

  const jahr = Number(treffer[1]);
  const monat = Number(treffer[2]);
  const tag = Number(treffer[3]);
  const stunde = nurTag !== null ? 12 : Number(treffer[4]);
  const minute = nurTag !== null ? 0 : Number(treffer[5]);

  const probe = new Date(0);
  probe.setUTCFullYear(jahr, monat - 1, tag);
  probe.setUTCHours(stunde, minute, 0, 0);
  if (probe.getUTCFullYear() !== jahr || probe.getUTCMonth() !== monat - 1
      || probe.getUTCDate() !== tag || probe.getUTCHours() !== stunde
      || probe.getUTCMinutes() !== minute) {
    return null;
  }

  const jd = dateToJd(probe);
  return imZeitbereich(jd) === jd ? jd : null;
}

function zweistellig(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Millisekunden des Anfangs der Minute, in der `jd` liegt — Sekunden und
 * Millisekunden werden **abgeschnitten, nicht gerundet** (58,9 s bleiben in
 * ihrer Minute, 12:01:00 genau gehört schon zur nächsten). `formatDatum` und
 * der Minutenvergleich in `fragmentAuswerten` nutzen diese eine Funktion, damit
 * Schreiben und Vergleichen nie auseinanderlaufen können. Die Jahreszahl geht
 * über `setUTCFullYear` (nicht `Date.UTC`) ein, damit ein ein- bis
 * zweistelliges Jahr nicht auf 1900–1999 abgebildet wird (siehe `datumZuJd`).
 */
function minutenAnfangMs(jd: number): number {
  const d = jdToDate(jd);
  const anfang = new Date(0);
  anfang.setUTCFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  anfang.setUTCHours(d.getUTCHours(), d.getUTCMinutes(), 0, 0);
  return anfang.getTime();
}

/** Gegenstück zu `datumZuJd`: `date`-Wert für den Knopf, auf die Minute abgeschnitten. */
function formatDatum(jd: number): string {
  const d = new Date(minutenAnfangMs(jd));
  return `${String(d.getUTCFullYear()).padStart(4, '0')}-${zweistellig(d.getUTCMonth() + 1)}`
    + `-${zweistellig(d.getUTCDate())}T${zweistellig(d.getUTCHours())}:${zweistellig(d.getUTCMinutes())}Z`;
}

function gleicheMinute(jdA: number, jdB: number): boolean {
  return minutenAnfangMs(jdA) === minutenAnfangMs(jdB);
}

/** Wirksame Maßstabseinstellung: `p` überschreibt einzelne Felder des Standards. */
function wirksamerMassstab(grundlage: Plain): ScaleSettings {
  const basis = DEFAULT_STATE.scale;
  const roh = grundlage.scale;
  return istPlain(roh) ? { ...basis, ...roh } as ScaleSettings : basis;
}

/**
 * Kamerapatch für `body`: Ziel und Modus wie beim Klick in der Körperliste
 * (ui/kamerafahrt.ts, `fahreZu`) — geheftet, kein eingefrorener Zeitpunkt,
 * Abstand nach `fokusAbstand` (sim/scale.ts, derselbe Weg wie beim Klick).
 * Azimut und Elevation bleiben unangetastet, genau wie beim Klick. Ein
 * gewähltes Thema verfällt dabei wie beim Klick auch.
 */
function koerperPatch(koerper: Body, massstab: ScaleSettings): Plain {
  return {
    camera: {
      targetId: koerper.id, mode: 'attached', freezeJd: null,
      distance: fokusAbstand(koerper, massstab),
    },
    ui: { info: { thema: null } },
  };
}

/**
 * Wertet ein URL-Fragment mit lesbaren Parametern aus (`p`, `date`, `body`,
 * `scene`, `lang`, Reihenfolge beliebig, unbekannte Schlüssel werden
 * ignoriert). `p` ist die Grundlage; `date` und `body` überschreiben ihre
 * Felder nur, wenn sie vom Zeitpunkt bzw. Körper aus `p` abweichen — stimmen
 * sie überein, bleibt `p` maßgeblich (Kamera, Abstand, Winkel, Uhrstand samt
 * Pause), weil der Knopf (`lesbarerLink`) `date`/`body` immer als lesbares
 * Abbild desselben Zustands daneben legt. `lang` überschreibt immer. Bei
 * gültigem `scene` zählen `date` und `body` nicht, das Kino startet
 * stattdessen mit dieser Szene. Liefert `null`, wenn `hash` gar kein Fragment
 * enthält (kein „#"); enthält es eines, ist `patch` nur dann `null`, wenn
 * kein einziger Schlüssel einen gültigen Wert ergab.
 */
export function fragmentAuswerten(hash: string): FragmentErgebnis | null {
  if (!hash.startsWith('#')) return null;
  const eintraege = paare(hash.slice(1));
  let gueltig = false;

  const pWert = eintraege.get('p');
  const patchGrundlage = pWert === undefined ? null : decodePatch(pWert);
  if (patchGrundlage !== null) gueltig = true;
  const grundlage = patchGrundlage ?? {};

  const szeneWert = eintraege.get('scene');
  const szeneId = szeneWert !== undefined && SCENES.some((s) => s.id === szeneWert) ? szeneWert : null;
  if (szeneId !== null) gueltig = true;

  let overlay: Plain = {};

  if (szeneId === null) {
    const datumWert = eintraege.get('date');
    const jd = datumWert === undefined ? null : datumZuJd(datumWert);
    if (jd !== null) {
      gueltig = true;
      // Der Knopf (lesbarerLink) legt date immer als auf die Minute
      // abgeschnittenen Zeitpunkt von p daneben, damit der Link auch ohne p
      // lesbar bleibt. Fällt date auf dieselbe Minute wie der Zeitpunkt aus
      // der Grundlage, bleibt p maßgeblich — auch für „paused" —, sonst
      // schnitte das abgeschnittene date die Sekunden aus dem gerade erst
      // geteilten, eigenen Link heraus.
      const grundZeit = grundlage.time;
      const basisJd = istPlain(grundZeit) && typeof grundZeit.jd === 'number' ? grundZeit.jd : null;
      if (basisJd === null || !gleicheMinute(basisJd, jd)) {
        overlay = mergePatch(overlay, { time: { jd, paused: true } });
      }
    }

    const koerperWert = eintraege.get('body');
    const koerper = koerperWert === undefined ? undefined : bodyIndex[koerperWert];
    if (koerper !== undefined) {
      gueltig = true;
      // Der Knopf (lesbarerLink) nimmt body immer vom selben Zustand wie p:
      // Ist es derselbe Körper, bleiben Kamera, Abstand und Winkel
      // unangetastet aus p — sonst schnitte ein frisch berechneter
      // Fokusabstand den genauen, gerade erst geteilten Kamerastand ab
      // (dieselbe Überlegung wie bei date). Ohne einen Körper in der
      // Grundlage (kein p, oder p ohne eigenes Ziel) gilt weiter die
      // Fokus-Regel: Kamera frisch auf den Körper ausrichten.
      const grundKamera = grundlage.camera;
      const basisZiel = istPlain(grundKamera) && typeof grundKamera.targetId === 'string'
        ? grundKamera.targetId : null;
      if (basisZiel !== koerper.id) {
        overlay = mergePatch(overlay, koerperPatch(koerper, wirksamerMassstab(grundlage)));
      }
    }
  }

  const spracheWert = eintraege.get('lang');
  if (spracheWert === 'de' || spracheWert === 'en') {
    overlay = mergePatch(overlay, { ui: { language: spracheWert } });
    gueltig = true;
  }

  if (!gueltig) return { patch: null, szeneId: null };
  return { patch: mergePatch(grundlage, overlay), szeneId };
}

/**
 * Lesbarer Link für den Knopf „Link kopieren": `date` (aktueller Zeitpunkt,
 * auf die Minute abgeschnitten), `body` (nur, wenn ein Körper ausgewählt ist —
 * dasselbe Feld, das `fragmentAuswerten` beim Einlesen setzt:
 * `camera.mode === 'attached'`, Kennung aus `camera.targetId`) und `p`
 * (bisheriger Link-Patch, Profil `link`, unverändert). Die Reihenfolge macht
 * den Link von vorn nach hinten lesbar (Zeitpunkt, Körper, genauer Zustand);
 * beim Einlesen ist sie gleichgültig.
 */
export function lesbarerLink(state: AppState, ort: { origin: string; pathname: string }): string {
  const teile = [`date=${formatDatum(state.time.jd)}`];
  if (state.camera.mode === 'attached') teile.push(`body=${state.camera.targetId}`);
  teile.push(`p=${encodePatch(patchFuer(state, 'link'))}`);
  return `${ort.origin}${ort.pathname}#${teile.join('&')}`;
}
