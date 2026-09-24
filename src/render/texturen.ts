import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import type { QualityTier } from '../store/types';
import type { TexturStufe } from '../data/texturen';

/**
 * Lädt eine Texturstufe. Eigene Schnittstelle, damit Tests ohne Grafikkarte
 * und ohne Netz einen Ersatz einsetzen können.
 */
export interface TexturLader {
  lade(pfad: string): Promise<THREE.Texture>;
}

/**
 * KTX2 (Basis Universal) wird im Worker umgesetzt und bleibt auf der GPU
 * komprimiert (Entwurf Phase 5 §5.2). Die Karten sind beim Kodieren
 * gespiegelt, weil KTX2 kein flipY kennt (scripts/textur-stufe.py).
 */
export function erzeugeKtx2Lader(renderer: THREE.WebGLRenderer): TexturLader {
  const lader = new KTX2Loader()
    .setTranscoderPath(`${import.meta.env.BASE_URL}basis/`)
    .detectSupport(renderer);
  return {
    async lade(pfad) {
      const textur = await lader.loadAsync(pfad);
      textur.colorSpace = THREE.SRGBColorSpace;
      return textur;
    },
  };
}

/**
 * Obergrenze der Texturbreite je Qualitätsstufe (Entwurf Phase 5 §5.4).
 * Zwilling von QUALITY_SETTINGS.textureSize in app/quality.ts, weil render/
 * nicht aus app/ importieren darf; quality.test.ts prüft die Gleichheit.
 */
export const TEXTUR_OBERGRENZE = { low: 1024, medium: 2048, high: 8192 } as const;
/** Nachladen wird höchstens zweimal je Sekunde geprüft. */
export const PRUEF_ABSTAND_MS = 500;
/** Höchstens so viele Nachladevorgänge gleichzeitig; der Start zählt nicht mit. */
export const MAX_NACHLADEN = 2;
/**
 * Eine Kugel zeigt die halbe Kartenbreite über ihren Durchmesser: W/2 Texel
 * je Durchmesser sind volle Auflösung. Der Faktor lädt etwas vorausschauend.
 */
export const VORLAUF = 0.75;

/** `auto` wie `medium`, wie bei den Gürtelteilchen (beltCount). */
export function obergrenzeFuer(tier: QualityTier, maxTextureSize: number): number {
  return Math.min(TEXTUR_OBERGRENZE[tier === 'auto' ? 'medium' : tier], maxTextureSize);
}

/**
 * Kleinste Stufe W mit `durchmesserPx ≤ VORLAUF · W / 2`, höchstens die
 * Obergrenze. `breiten` ist aufsteigend; die erste Stufe gilt immer als
 * erlaubt, weil sie der Start ohnehin lädt.
 */
export function benoetigteStufe(
  durchmesserPx: number, breiten: readonly number[], obergrenze: number,
): number {
  const erlaubt = breiten.filter((b, i) => i === 0 || b <= obergrenze);
  return erlaubt.find((b) => durchmesserPx <= VORLAUF * b / 2) ?? erlaubt[erlaubt.length - 1]!;
}

export interface TexturBedarf {
  readonly id: string;
  /** Dargestellter Durchmesser in Gerätepixeln. */
  readonly durchmesserPx: number;
}

export interface TexturSteuerung {
  /** Lädt die erste Stufe aller Körper der Liste, ohne Mengenbegrenzung. */
  start(): void;
  /**
   * Höchstens alle PRUEF_ABSTAND_MS: fehlende breitere Stufen anfordern, das
   * Kameraziel zuerst, dann nach Durchmesser absteigend. `bedarf` wird nur
   * bei fälliger Prüfung ausgewertet.
   */
  pruefe(jetztMs: number, bedarf: () => readonly TexturBedarf[], zielId: string, obergrenze: number): void;
  /** Geladene Breite je Körper der Liste, 0 = noch keine. */
  stand(): Record<string, number>;
}

/**
 * Nachladen nach Bedarf (Entwurf Phase 5 §5.4). Jede Stufe wird höchstens
 * einmal angefordert: Eine gescheiterte bleibt für diese Sitzung aus, ohne
 * Meldung, und die bisherige steht weiter. Herunterstufen gibt es nicht —
 * `angefordert` wächst nur.
 */
export function erzeugeTexturSteuerung(
  lader: TexturLader,
  liste: Readonly<Record<string, readonly TexturStufe[]>>,
  setze: (id: string, textur: THREE.Texture, breite: number) => void,
): TexturSteuerung {
  const geladen = new Map<string, number>();
  const angefordert = new Map<string, number>();
  const laufend = new Set<string>();
  let letztePruefung = -Infinity;

  function lade(id: string, s: TexturStufe, nachladen: boolean): void {
    angefordert.set(id, Math.max(angefordert.get(id) ?? 0, s.breite));
    if (nachladen) laufend.add(id);
    lader.lade(s.pfad).then(
      (textur) => {
        geladen.set(id, Math.max(geladen.get(id) ?? 0, s.breite));
        setze(id, textur, s.breite);
      },
      () => { /* bisherige Stufe bleibt; kein zweiter Versuch, keine Meldung */ },
    ).finally(() => { if (nachladen) laufend.delete(id); });
  }

  return {
    start() {
      for (const [id, stufen] of Object.entries(liste)) lade(id, stufen[0]!, false);
    },
    pruefe(jetztMs, bedarf, zielId, obergrenze) {
      if (jetztMs - letztePruefung < PRUEF_ABSTAND_MS) return;
      letztePruefung = jetztMs;
      const kandidaten: { id: string; stufe: TexturStufe; durchmesserPx: number }[] = [];
      for (const { id, durchmesserPx } of bedarf()) {
        const stufen = liste[id];
        if (stufen === undefined || laufend.has(id)) continue;
        const breite = benoetigteStufe(durchmesserPx, stufen.map((s) => s.breite), obergrenze);
        if (breite <= (angefordert.get(id) ?? 0)) continue;
        kandidaten.push({ id, stufe: stufen.find((s) => s.breite === breite)!, durchmesserPx });
      }
      kandidaten.sort((a, b) =>
        Number(b.id === zielId) - Number(a.id === zielId) || b.durchmesserPx - a.durchmesserPx);
      for (const k of kandidaten) {
        if (laufend.size >= MAX_NACHLADEN) break;
        lade(k.id, k.stufe, true);
      }
    },
    stand() {
      return Object.fromEntries(Object.keys(liste).map((id) => [id, geladen.get(id) ?? 0]));
    },
  };
}
