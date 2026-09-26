import { bodyIndex } from '../data';
import { SCENES } from '../data/scenes';
import { scaledRadius } from '../sim/scale';
import type { ScaleSettings } from '../sim/scale';
import type { Body } from '../sim/types';
import { dateToJd, imZeitbereich } from '../sim/time';
import { DEFAULT_STATE } from './index';
import { decodePatch, mergePatch } from './serialize';
import { istPlain } from './pruefer';
import type { Plain } from './pruefer';

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

/** Zwilling von FOKUS_FAKTOR/FOKUS_MIN_KM in ui/kamerafahrt.ts: store/ kennt ui/ nicht. */
const FOKUS_FAKTOR = 8;
const FOKUS_MIN_KM = 1e4;

/** Wirksame Maßstabseinstellung: `p` überschreibt einzelne Felder des Standards. */
function wirksamerMassstab(grundlage: Plain): ScaleSettings {
  const basis = DEFAULT_STATE.scale;
  const roh = grundlage.scale;
  return istPlain(roh) ? { ...basis, ...roh } as ScaleSettings : basis;
}

/**
 * Kamerapatch für `body`: Ziel und Modus wie beim Klick in der Körperliste
 * (ui/kamerafahrt.ts, `fahreZu`) — geheftet, kein eingefrorener Zeitpunkt,
 * Abstand nach Körpergröße. Azimut und Elevation bleiben unangetastet, genau
 * wie beim Klick. Ein gewähltes Thema verfällt dabei wie beim Klick auch.
 */
function koerperPatch(koerper: Body, massstab: ScaleSettings): Plain {
  const distance = Math.max(scaledRadius(koerper, massstab) * FOKUS_FAKTOR, FOKUS_MIN_KM);
  return {
    camera: { targetId: koerper.id, mode: 'attached', freezeJd: null, distance },
    ui: { info: { thema: null } },
  };
}

/**
 * Wertet ein URL-Fragment mit lesbaren Parametern aus (`p`, `date`, `body`,
 * `scene`, `lang`, Reihenfolge beliebig, unbekannte Schlüssel werden
 * ignoriert). `p` ist die Grundlage, `date`/`body`/`lang` überschreiben ihre
 * Felder; bei gültigem `scene` zählen `date` und `body` nicht, das Kino
 * startet stattdessen mit dieser Szene. Liefert `null`, wenn `hash` gar kein
 * Fragment enthält (kein „#"); enthält es eines, ist `patch` nur dann `null`,
 * wenn kein einziger Schlüssel einen gültigen Wert ergab.
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
      overlay = mergePatch(overlay, { time: { jd, paused: true } });
      gueltig = true;
    }

    const koerperWert = eintraege.get('body');
    const koerper = koerperWert === undefined ? undefined : bodyIndex[koerperWert];
    if (koerper !== undefined) {
      overlay = mergePatch(overlay, koerperPatch(koerper, wirksamerMassstab(grundlage)));
      gueltig = true;
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
