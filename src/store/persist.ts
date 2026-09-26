import type { AppState } from './types';
import { DEFAULT_STATE } from './index';
import { istPlain, pruefeZustand } from './pruefer';
import type { Plain } from './pruefer';
import { fromShareable, mergePatch, toShareable } from './serialize';
import { SYSTEM_THEMA } from '../data/themen';

/**
 * Drei Verwendungen desselben Diffs (Entwurf §3.1): Der Link lässt
 * Gerätespezifisches und Bedienzustand weg, die Sitzung nimmt alles, eine
 * Ansicht nur die Einstellungen, die man an einen anderen Zeitpunkt
 * mitnehmen will.
 */
export type Profil = 'link' | 'sitzung' | 'ansicht';

const GESTRICHEN: Readonly<Record<Profil, readonly string[]>> = {
  // Breite und Teilung hängen am Bildschirm, das Thema an der Sitzung
  // (Entwurf 4c §4.6); nur das Niveau reist im Link mit. Die Breite der
  // Seitenleiste hängt ebenso am Bildschirm. Der Ton ist eine Vorliebe des
  // Geräts und reist weder im Link noch in Ansichten.
  link: ['quality', 'ui.hidden', 'ui.panels', 'ui.info.breiteRem', 'ui.info.teilung', 'ui.info.thema', 'ui.leiste', 'ton'],
  sitzung: [],
  ansicht: ['time.jd', 'time.paused', 'cinema', 'quality', 'ui', 'ton'],
};

function ohnePfad(obj: Plain, pfad: readonly string[]): Plain {
  const [kopf, ...rest] = pfad;
  if (kopf === undefined || !Object.hasOwn(obj, kopf)) return obj;
  const out: Plain = { ...obj };
  if (rest.length === 0) {
    delete out[kopf];
    return out;
  }
  const kind = out[kopf];
  if (!istPlain(kind)) return out;
  const gekuerzt = ohnePfad(kind, rest);
  // Ein leer gewordener Zweig ist keine Abweichung mehr.
  if (Object.keys(gekuerzt).length === 0) delete out[kopf];
  else out[kopf] = gekuerzt;
  return out;
}

export function filtereProfil(patch: Plain, profil: Profil): Plain {
  return GESTRICHEN[profil].reduce<Plain>((acc, pfad) => ohnePfad(acc, pfad.split('.')), patch);
}

export function patchFuer(state: AppState, profil: Profil): Plain {
  return filtereProfil(toShareable(state), profil);
}

/**
 * Standardzustand, aber Sprache, Qualitätsstufe, die Vorlieben des
 * Infopanels (Niveau, Breite, Teilung), die Breite der Seitenleiste und der
 * Ton des aktuellen Zustands bleiben; ein gewähltes Thema wird durch das
 * Thema Sonnensystem ersetzt wie beim Start ohne Link und Sitzung. Ein
 * aktives Kino beendet der Aufrufer vorher (ui/Kopfzeile.tsx), sonst verwürfe
 * der Themenverfall ein schon gewähltes Sonnensystem.
 */
export function zurueckgesetzt(aktuell: AppState): AppState {
  const s = structuredClone(DEFAULT_STATE);
  s.ui.language = aktuell.ui.language;
  s.quality.tier = aktuell.quality.tier;
  s.ui.leiste = { ...aktuell.ui.leiste };
  s.ton = { ...aktuell.ton };
  // Zurücksetzen führt in die Startansicht und zeigt deshalb wie ein frischer
  // Start das Sonnensystem (Plan 4c-4, Ruling 4).
  s.ui.info = { ...aktuell.ui.info, thema: SYSTEM_THEMA };
  return s;
}

/* ---------- Ablage (localStorage) ---------- */

/** Nur die drei Methoden, die gebraucht werden — so genügt in Tests ein kleiner Fake. */
export type Ablage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const SCHLUESSEL_SITZUNG = 'orrery.sitzung.v1';
export const SCHLUESSEL_MERKEN = 'orrery.sitzungMerken';

/**
 * Schon der Zugriff auf localStorage kann werfen (SecurityError bei
 * blockierten Cookies); dann gibt es keine Ablage und alle Funktionen unten
 * verhalten sich wie bei leerer Ablage.
 */
export function ablageHolen(): Ablage | null {
  try {
    // Ohne DOM (Tests, Build-Skripte) fehlt die Eigenschaft ganz.
    const g = globalThis as { localStorage?: Ablage };
    return g.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Geprüfter Sitzungs-Patch; null, wenn nichts gespeichert oder der Eintrag beschädigt ist. */
export function sitzungLesen(ablage: Ablage | null): Plain | null {
  try {
    const text = ablage?.getItem(SCHLUESSEL_SITZUNG) ?? null;
    return text === null ? null : pruefeZustand(JSON.parse(text));
  } catch {
    return null;
  }
}

/**
 * `ui.language` steht immer im geschriebenen Patch, auch wenn sie dem
 * Standard `'de'` entspricht. Grund: `patchFuer` bildet nur Abweichungen vom
 * Standard ab; ohne diesen Zusatz enthielte die Sitzung eines Nutzers, der
 * bewusst Deutsch gewählt hat, gar kein `ui.language` — und ein
 * englischsprachiger Browser läse beim nächsten Start wieder Englisch aus
 * `navigator.language`, weil `spracheAus(patch)` dann null ergibt.
 * Als eigene Funktion, damit app/persistenz.ts den Patch vergleichen kann,
 * ohne ihn zu schreiben.
 */
export function sitzungsPatch(state: AppState): Plain {
  const patch = patchFuer(state, 'sitzung');
  patch.ui = { ...(istPlain(patch.ui) ? patch.ui : {}), language: state.ui.language };
  return patch;
}

export function sitzungSchreiben(ablage: Ablage | null, state: AppState): boolean {
  try {
    if (ablage === null) return false;
    ablage.setItem(SCHLUESSEL_SITZUNG, JSON.stringify(sitzungsPatch(state)));
    return true;
  } catch {
    // Voll (QuotaExceededError) oder gesperrt: still, die Anwendung läuft weiter.
    return false;
  }
}

export function sitzungLoeschen(ablage: Ablage | null): void {
  try {
    ablage?.removeItem(SCHLUESSEL_SITZUNG);
  } catch {
    // Gesperrt: nichts zu tun.
  }
}

/** Fehlender Eintrag bedeutet „an" — die Sicherung ist der Normalfall. */
export function sitzungMerkenLesen(ablage: Ablage | null): boolean {
  try {
    return ablage?.getItem(SCHLUESSEL_MERKEN) !== '0';
  } catch {
    return true;
  }
}

export function sitzungMerkenSchreiben(ablage: Ablage | null, an: boolean): void {
  try {
    if (an) ablage?.removeItem(SCHLUESSEL_MERKEN);
    else ablage?.setItem(SCHLUESSEL_MERKEN, '0');
  } catch {
    // Gesperrt: nichts zu tun.
  }
}

/* ---------- Ansichten (Entwurf §3.3, §3.4, §4.5) ---------- */

/** Eine benannte Einstellung; `state` ist ein Patch im Profil `ansicht`. */
export interface Ansicht { name: string; state: Plain }

export type ImportFehler = 'umschlag' | 'leer';

export interface ImportErgebnis {
  liste: Ansicht[];
  /** Kennung statt Text: store/ kennt keine Sprachtabelle, das Panel übersetzt. */
  fehler: ImportFehler | null;
  /** Einträge, die wegen fehlendem Namen oder unbrauchbarem Zustand wegfielen. */
  verworfen: number;
}

export const SCHLUESSEL_ANSICHTEN = 'orrery.ansichten.v1';
export const EXPORT_FORMAT = 'orrery-ansichten';
export const EXPORT_VERSION = 1;
export const EXPORT_DATEINAME = 'orrery-ansichten.json';
/** Längster erlaubter Name; längere Einträge aus Ablage oder Datei fallen weg. */
export const NAME_MAX = 80;

/** Gültiger Name: nichtleerer String nach dem Trimmen, höchstens NAME_MAX Zeichen. */
export function nameBereinigen(roh: unknown): string | null {
  if (typeof roh !== 'string') return null;
  const name = roh.trim();
  return name.length > 0 && name.length <= NAME_MAX ? name : null;
}

/**
 * Erster freier Name: „Mars", sonst „Mars (2)", „Mars (3)" … Der Kandidat
 * bleibt innerhalb von NAME_MAX, damit der Eintrag beim nächsten Lesen nicht
 * wegfällt — ein voller, 80 Zeichen langer Name würde mit angehängtem Suffix
 * sonst die Grenze überschreiten und nameBereinigen läse ihn als null.
 */
export function freierName(name: string, vergeben: ReadonlySet<string>): string {
  if (!vergeben.has(name)) return name;
  for (let n = 2; ; n += 1) {
    const suffix = ` (${n})`;
    const kandidat = name.slice(0, NAME_MAX - suffix.length).trimEnd() + suffix;
    if (!vergeben.has(kandidat)) return kandidat;
  }
}

export function ansichtErstellen(name: string, state: AppState): Ansicht {
  return { name, state: patchFuer(state, 'ansicht') };
}

function holePfad(obj: Plain, pfad: readonly string[]): unknown {
  let aktuell: unknown = obj;
  for (const teil of pfad) {
    if (!istPlain(aktuell) || !Object.hasOwn(aktuell, teil)) return undefined;
    aktuell = aktuell[teil];
  }
  return aktuell;
}

function setzePfad(obj: Plain, pfad: readonly string[], wert: unknown): void {
  const [kopf, ...rest] = pfad;
  if (kopf === undefined) return;
  if (rest.length === 0) { obj[kopf] = wert; return; }
  const kind = obj[kopf];
  const ziel = istPlain(kind) ? kind : {};
  obj[kopf] = ziel;
  setzePfad(ziel, rest, wert);
}

/** Gegenstück zu ohnePfad: Nur die genannten Pfade bleiben. */
function nurPfade(patch: Plain, pfade: readonly string[]): Plain {
  const out: Plain = {};
  for (const pfad of pfade) {
    const teile = pfad.split('.');
    const wert = holePfad(patch, teile);
    if (wert !== undefined) setzePfad(out, teile, wert);
  }
  return out;
}

/**
 * Ansicht laden: Die Einstellungen (Maßstab, Darstellung, Kamera,
 * Sichtbarkeit, Zeitrate) kommen vollständig aus der Ansicht — was sie
 * nicht nennt, steht auf dem Standard. Vom aktuellen Zustand bleiben genau
 * die Zweige, die das Profil `ansicht` streicht: Zeitpunkt, Pause, Kino,
 * Qualität, Oberfläche. Ein Patch kennt keinen Unterschied zwischen
 * „Standardwert" und „nicht enthalten"; würde man die Ansicht nur über den
 * aktuellen Zustand legen, hielte eine Ansicht mit Bahnlinien (Standard)
 * ausgeschaltete Bahnlinien nicht wieder an — siehe Ruling im Plan.
 */
export function ansichtAnwenden(aktuell: AppState, ansicht: Ansicht): AppState {
  const bleibt = nurPfade(toShareable(aktuell), GESTRICHEN.ansicht);
  const neu = fromShareable(mergePatch(bleibt, ansicht.state));
  // Der Kameramodus „Kino" aus einer gespeicherten Ansicht wird als „frei"
  // übernommen (Entscheidung Jens 3, 25.09.2026): store/ kennt cinemaControl
  // aus ui/ nicht (Schichtentest), ein aktives Kino beendet der Aufrufer
  // schon vorher (ui/panels/AnsichtenPanel.tsx, wie zuruecksetzen in
  // ui/Kopfzeile.tsx).
  if (neu.camera.mode === 'cinema') neu.camera = { ...neu.camera, mode: 'free' };
  return neu;
}

/** Einzelner Eintrag aus Ablage oder Datei; null, wenn Name oder Zustand unbrauchbar. */
function ansichtPruefen(roh: unknown): Ansicht | null {
  if (!istPlain(roh)) return null;
  const name = nameBereinigen(roh.name);
  if (name === null || !istPlain(roh.state)) return null;
  return { name, state: filtereProfil(pruefeZustand(roh.state), 'ansicht') };
}

function listePruefen(roh: unknown): { liste: Ansicht[]; verworfen: number } {
  if (!Array.isArray(roh)) return { liste: [], verworfen: 0 };
  const liste: Ansicht[] = [];
  let verworfen = 0;
  for (const eintrag of roh) {
    const ansicht = ansichtPruefen(eintrag);
    if (ansicht === null) verworfen += 1;
    else liste.push(ansicht);
  }
  return { liste, verworfen };
}

/** Geprüfte Liste; Namen sind eindeutig, bei Dubletten zählt der erste Eintrag. */
export function ansichtenLesen(ablage: Ablage | null): Ansicht[] {
  try {
    const text = ablage?.getItem(SCHLUESSEL_ANSICHTEN) ?? null;
    if (text === null) return [];
    const gesehen = new Set<string>();
    const out: Ansicht[] = [];
    for (const ansicht of listePruefen(JSON.parse(text)).liste) {
      if (gesehen.has(ansicht.name)) continue;
      gesehen.add(ansicht.name);
      out.push(ansicht);
    }
    return out;
  } catch {
    return [];
  }
}

export function ansichtenSchreiben(ablage: Ablage | null, liste: readonly Ansicht[]): boolean {
  try {
    if (ablage === null) return false;
    ablage.setItem(SCHLUESSEL_ANSICHTEN, JSON.stringify(liste));
    return true;
  } catch {
    // Voll oder gesperrt: still, die Liste lebt im Panel weiter.
    return false;
  }
}

/** Datei mit Umschlag; eingerückt, damit sie von Hand lesbar bleibt. */
export function ansichtenExportieren(liste: readonly Ansicht[]): string {
  return JSON.stringify({ format: EXPORT_FORMAT, version: EXPORT_VERSION, ansichten: liste }, null, 2);
}

/**
 * Import: Umschlag prüfen, jeden Eintrag prüfen, Namenskonflikte mit
 * Vorhandenem und untereinander per Suffix auflösen. Bei „umschlag" oder
 * „leer" bleibt die vorhandene Liste unverändert.
 */
export function ansichtenImportieren(text: string, vorhandene: readonly Ansicht[]): ImportErgebnis {
  let roh: unknown = null;
  try {
    roh = JSON.parse(text);
  } catch {
    // Bleibt null
  }
  if (!istPlain(roh) || roh.format !== EXPORT_FORMAT || roh.version !== EXPORT_VERSION
      || !Array.isArray(roh.ansichten)) {
    return { liste: [...vorhandene], fehler: 'umschlag', verworfen: 0 };
  }
  const { liste: neue, verworfen } = listePruefen(roh.ansichten);
  if (neue.length === 0) return { liste: [...vorhandene], fehler: 'leer', verworfen };
  const vergeben = new Set(vorhandene.map((a) => a.name));
  const liste = [...vorhandene];
  for (const ansicht of neue) {
    const name = freierName(ansicht.name, vergeben);
    vergeben.add(name);
    liste.push({ name, state: ansicht.state });
  }
  return { liste, fehler: null, verworfen };
}
