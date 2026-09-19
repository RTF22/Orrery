/**
 * Controller nach der Standardbelegung (Entwurf Flug und Controller §5): reine
 * Auswertung eines Controllerbildes gegen den Vorzustand, dazu ein dünner
 * Leser um navigator.getGamepads(). Die Gamepad-API kennt für Achsen und
 * Tasten keine Ereignisse, nur die Abfrage je Bild (§1, Punkt 4).
 */

/** Tastenindizes der Standardbelegung (W3C Gamepad, mapping „standard"). */
export const PAD = {
  A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, VIEW: 8, MENUE: 9, L3: 10, R3: 11,
  HOCH: 12, RUNTER: 13, LINKS: 14, RECHTS: 15,
} as const;

/** Kreisförmige Totzone der Sticks und Totzone der Trigger (§5.2, §12.1). */
export const STICK_TOTZONE = 0.15;
export const TRIGGER_TOTZONE = 0.05;

/** Was die Auswertung von einem Controller liest; echte Gamepad-Objekte passen darauf. */
export interface PadRoh {
  mapping: string;
  axes: readonly number[];
  buttons: readonly { pressed: boolean; value: number }[];
}

/** Stickausschlag nach Totzone und Kurve; y zählt wie in der API nach unten. */
export interface Stick { x: number; y: number }

export interface PadAbsicht {
  links: Stick;
  rechts: Stick;
  /** RT − LT, jeweils nach der Totzone, in −1 … 1. */
  vor: number;
  lb: boolean;
}

export interface PadBild {
  absicht: PadAbsicht;
  /** Tasten, die in diesem Bild gedrückt wurden (Flanke). */
  flanken: readonly number[];
  /** Stick oder Trigger über der Totzone oder eine Flanke (§5.5). */
  eingabe: boolean;
}

const RUHE: PadAbsicht = { links: { x: 0, y: 0 }, rechts: { x: 0, y: 0 }, vor: 0, lb: false };

/** NaN und fehlende Werte zählen als 0, alles andere wird in min … 1 geklemmt (§7). */
const achse = (v: number | undefined, min: number): number =>
  (v === undefined || Number.isNaN(v) ? 0 : Math.min(Math.max(v, min), 1));

/** Kreisförmige Totzone, danach auf 0 … 1 neu skaliert und quadriert: feine kleine Ausschläge. */
export function stickKurve(xRoh: number | undefined, yRoh: number | undefined): Stick {
  const x = achse(xRoh, -1);
  const y = achse(yRoh, -1);
  const betrag = Math.hypot(x, y);
  if (betrag <= STICK_TOTZONE) return { x: 0, y: 0 };
  const neu = Math.min((betrag - STICK_TOTZONE) / (1 - STICK_TOTZONE), 1);
  const k = (neu * neu) / betrag;
  return { x: x * k, y: y * k };
}

/** Trigger: Totzone, danach linear auf 0 … 1. */
export function triggerWert(roh: number | undefined): number {
  const v = achse(roh, 0);
  return v <= TRIGGER_TOTZONE ? 0 : (v - TRIGGER_TOTZONE) / (1 - TRIGGER_TOTZONE);
}

/**
 * Wertet ein Controllerbild aus. `vorher` sind die gedrückten Tasten des
 * letzten Bildes, null beim ersten Auftauchen: Dann gilt der aktuelle Stand
 * als Vorzustand und das Bild bleibt ohne Wirkung — der Druck, mit dem der
 * Browser den Controller freigibt, löst nichts aus (§5.1).
 */
export function padAuswerten(
  roh: PadRoh, vorher: readonly boolean[] | null,
): { bild: PadBild; gedrueckt: boolean[] } {
  const gedrueckt = roh.buttons.map((b) => b.pressed);
  if (vorher === null) return { bild: { absicht: RUHE, flanken: [], eingabe: false }, gedrueckt };
  const flanken: number[] = [];
  gedrueckt.forEach((an, i) => { if (an && vorher[i] !== true) flanken.push(i); });
  const links = stickKurve(roh.axes[0], roh.axes[1]);
  const rechts = stickKurve(roh.axes[2], roh.axes[3]);
  const rt = triggerWert(roh.buttons[PAD.RT]?.value);
  const lt = triggerWert(roh.buttons[PAD.LT]?.value);
  const bewegt = links.x !== 0 || links.y !== 0 || rechts.x !== 0 || rechts.y !== 0 || rt !== 0 || lt !== 0;
  return {
    bild: {
      absicht: { links, rechts, vor: rt - lt, lb: gedrueckt[PAD.LB] === true },
      flanken,
      eingabe: bewegt || flanken.length > 0,
    },
    gedrueckt,
  };
}

/** Was der Leser aus der Umgebung braucht; im Browser window.isSecureContext und navigator. */
export interface PadUmgebung {
  isSecureContext?: boolean;
  navigator?: { getGamepads?: () => readonly (PadRoh | null)[] };
}

/**
 * Leser des ersten Controllers mit Standardbelegung (§5.1); andere werden
 * übergangen. Ohne sicheren Kontext, ohne getGamepads oder wenn der Aufruf
 * wirft (etwa wegen einer Berechtigungsregel der einbettenden Seite), schaltet
 * er sich einmalig und still ab und liefert fortan null; Tastatur und Maus
 * bleiben. Aufgerufen wird getGamepads als Methode von navigator — Chrome
 * verlangt das.
 */
export function padLeserErstellen(u: PadUmgebung): () => PadRoh | null {
  const nav = u.navigator;
  let aus = u.isSecureContext !== true || typeof nav?.getGamepads !== 'function';
  return () => {
    if (aus || nav?.getGamepads === undefined) return null;
    try {
      for (const p of nav.getGamepads()) if (p !== null && p.mapping === 'standard') return p;
      return null;
    } catch {
      aus = true;
      return null;
    }
  };
}
