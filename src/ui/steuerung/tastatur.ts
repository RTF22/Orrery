import type { Absicht } from '../../render/camera/flug';
import { istEingabefeld } from '../shortcuts/useShortcuts';

/** Flugtasten nach ihrer Lage auf der Tastatur (Entwurf Flug und Controller §4.4). */
export const FLUGTASTEN = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE'] as const;
export type Flugtaste = (typeof FLUGTASTEN)[number];

export interface Tastenstand {
  /** Gehaltene Flugtasten. */
  gehalten: ReadonlySet<Flugtaste>;
  /** Shift beim letzten Tastenereignis. */
  shift: boolean;
}

export interface Tastatur {
  stand(): Tastenstand;
  loesen(): void;
}

const istFlugtaste = (code: string): code is Flugtaste =>
  (FLUGTASTEN as readonly string[]).includes(code);

/**
 * Merkt sich die gehaltenen Flugtasten; ausgewertet wird je Bild in
 * steuerungTakt (ui/steuerung/anwenden.ts). Erkannt wird nach e.code, damit
 * die Tasten auch auf einer französischen Tastatur an derselben Stelle liegen.
 * Eingabefelder sowie Strg, Alt und Meta bleiben unberührt, damit die
 * Browserkürzel wirken. Verlässt der Fokus das Fenster oder wird die Seite
 * verborgen, sind alle Tasten vergessen — sonst flöge ein „hängendes W" weiter.
 * Lässt man Shift los, bleiben die dabei gehaltenen Tasten gesperrt, bis sie
 * neu gedrückt werden (Nachtrag §13.3).
 */
export function tastaturAnhaengen(fenster: Window = window): Tastatur {
  const gehalten = new Set<Flugtaste>();
  // Beim Loslassen von Shift noch gehaltene Tasten (Nachtrag §13.3): Sie zählen
  // erst nach einem neuen Druck. Wer den Griff Shift+A zuerst an Shift löst,
  // flöge sonst seitwärts davon, statt geheftet zu bleiben.
  const gesperrt = new Set<Flugtaste>();
  let shift = false;

  const shiftSetzen = (neu: boolean): void => {
    if (shift && !neu) {
      for (const t of gehalten) gesperrt.add(t);
      gehalten.clear();
    }
    shift = neu;
  };
  // Eingabefelder sowie Strg, Alt und Meta bleiben unberührt (§4.4) — auch für
  // Shift selbst: sonst sperrt ein Großbuchstabe im Datumsfeld eine gehaltene
  // Flugtaste, und Shift dort schaltete die Kamera ins Drehen.
  const bleibtUnberuehrt = (e: KeyboardEvent): boolean =>
    e.ctrlKey || e.altKey || e.metaKey || istEingabefeld(e.target);
  const onKeyDown = (e: KeyboardEvent): void => {
    if (!bleibtUnberuehrt(e)) shiftSetzen(e.shiftKey);
    if (!istFlugtaste(e.code)) return;
    if (bleibtUnberuehrt(e)) return;
    e.preventDefault();
    if (e.repeat) return;
    gesperrt.delete(e.code);
    gehalten.add(e.code);
  };
  const onKeyUp = (e: KeyboardEvent): void => {
    if (!bleibtUnberuehrt(e)) shiftSetzen(e.shiftKey);
    if (istFlugtaste(e.code)) {
      gehalten.delete(e.code);
      gesperrt.delete(e.code);
    }
  };
  const vergessen = (): void => {
    gehalten.clear();
    gesperrt.clear();
    shift = false;
  };
  const onSichtbarkeit = (): void => {
    if (fenster.document.visibilityState === 'hidden') vergessen();
  };

  // Einfangphase (M3 aus der Schlussprüfung Flug Etappe 1): useShortcuts.ts
  // liest e.defaultPrevented in der Bubble-Phase auf demselben Fenster. Ohne
  // capture entscheidet die Registrierreihenfolge der Effekte, und auf
  // Colemak, Neo 2 oder Bépo lösen Flugtasten (nach e.code) zugleich ein
  // Kürzel (nach e.key) aus. Mit capture läuft dieser Listener immer zuerst.
  fenster.addEventListener('keydown', onKeyDown, { capture: true });
  fenster.addEventListener('keyup', onKeyUp);
  fenster.addEventListener('blur', vergessen);
  fenster.document.addEventListener('visibilitychange', onSichtbarkeit);

  return {
    stand: () => ({ gehalten, shift }),
    loesen: () => {
      fenster.removeEventListener('keydown', onKeyDown, { capture: true });
      fenster.removeEventListener('keyup', onKeyUp);
      fenster.removeEventListener('blur', vergessen);
      fenster.document.removeEventListener('visibilitychange', onSichtbarkeit);
      vergessen();
    },
  };
}

/** Absicht aus den gehaltenen Tasten: vor W − S, seit D − A, hoch E − Q. */
export function tastenAbsicht(gehalten: ReadonlySet<Flugtaste>): Absicht {
  const an = (t: Flugtaste): number => (gehalten.has(t) ? 1 : 0);
  return {
    vor: an('KeyW') - an('KeyS'),
    seit: an('KeyD') - an('KeyA'),
    hoch: an('KeyE') - an('KeyQ'),
  };
}
