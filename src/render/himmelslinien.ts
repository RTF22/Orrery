import * as THREE from 'three';
import type { BodyIndex } from '../sim/types';
import { geozentrischeRichtung } from '../sim/geozentrisch';
import { EKLIPTIK_SCHIEFE_GRAD } from '../sim/frames';
import { bodyIndex } from '../data/index';

/**
 * Linien der Himmelsansicht (Entwurf geozentrische Sicht §5.1, §5.2):
 * Planetenspuren über die letzten 365 Tage, Ekliptik, Himmelsäquator und
 * Frühlingspunkt. Alles sind Richtungen; die Kamera sitzt konstruktionsbedingt
 * im Render-Ursprung (renderer.ts), deshalb liegen die Punkte fest auf einer
 * Kugel um ihn — wie die Sterne (starfield.ts), aber innerhalb von deren
 * Kugel (10⁹), damit die Linien vor den Sternen und hinter jedem Körper
 * liegen (Neptun steht unter 5·10⁶ Einheiten).
 */
export const HIMMEL_KUGEL_EINHEITEN = 5e8;
export const SPUR_TAGE = 365;
/** Merkur bis Neptun ohne die Erde; die Sonne läuft auf der Ekliptik, der Mond hätte zwölf Schleifen. */
export const SPUR_KOERPER = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const;
/** Deckkraft des jüngsten Spurpunkts; WebGL zeichnet Linien mit 1 px, gestaffelt wird nur die Deckkraft. */
export const SPUR_DECKKRAFT = 0.9;
export const LINIEN_DECKKRAFT = 0.35;
export const KREIS_SEGMENTE = 360;
/** Halbe Armlänge des Kreuzes am Frühlingspunkt, in Grad. */
const FRUEHLINGSPUNKT_HALB_GRAD = 0.75;
const EKLIPTIK_FARBE = 0xd9c27a;
const AEQUATOR_FARBE = 0x6fa8dc;
const GRAD = Math.PI / 180;

/** Richtungen der Tage `tagEnde − SPUR_TAGE … tagEnde`, ältester zuerst, je drei Werte. */
export interface SpurPuffer {
  readonly id: string;
  tagEnde: number | null;
  readonly richtungen: Float64Array;
}

export function spurPuffer(id: string): SpurPuffer {
  return { id, tagEnde: null, richtungen: new Float64Array((SPUR_TAGE + 1) * 3) };
}

/**
 * Führt den Puffer auf den ganzen Tag von `jd` nach und gibt die Zahl der neu
 * gerechneten Tage zurück. Vorwärts um höchstens SPUR_TAGE rückt er als
 * Ringpuffer nach (copyWithin, nur die neuen Tage werden gerechnet);
 * rückwärts oder weiter springend rechnet er alles neu.
 */
export function spurNachfuehren(p: SpurPuffer, jd: number, index: BodyIndex = bodyIndex): number {
  const tag = Math.floor(jd);
  const schritt = p.tagEnde === null ? Infinity : tag - p.tagEnde;
  if (schritt === 0) return 0;
  const neu = schritt > 0 && schritt <= SPUR_TAGE ? schritt : SPUR_TAGE + 1;
  if (neu <= SPUR_TAGE) p.richtungen.copyWithin(0, neu * 3);
  for (let i = SPUR_TAGE + 1 - neu; i <= SPUR_TAGE; i++) {
    const v = geozentrischeRichtung(p.id, index, tag - SPUR_TAGE + i);
    p.richtungen[i * 3] = v.x;
    p.richtungen[i * 3 + 1] = v.y;
    p.richtungen[i * 3 + 2] = v.z;
  }
  p.tagEnde = tag;
  return neu;
}

/**
 * Großkreis auf der Himmelskugel: Punkt (cos t, sin t, 0) einer Ebene, die
 * um die x-Achse (Frühlingspunkt) um `neigungGrad` gegen die Ekliptik
 * geneigt ist. Für den Äquator ist das die Drehung äquatorial → ekliptikal
 * (y' = y·cos ε, z' = −y·sin ε für z = 0); der Himmelsnordpol liegt dann bei
 * (0, sin ε, cos ε).
 */
export function grosskreis(
  neigungGrad: number, segmente = KREIS_SEGMENTE, radius = HIMMEL_KUGEL_EINHEITEN,
): Float32Array {
  const e = neigungGrad * GRAD;
  const out = new Float32Array(segmente * 3);
  for (let i = 0; i < segmente; i++) {
    const t = (2 * Math.PI * i) / segmente;
    out[i * 3] = radius * Math.cos(t);
    out[i * 3 + 1] = radius * Math.sin(t) * Math.cos(e);
    // 0 − …: bei neigungGrad 0 ergibt das +0 statt −0.
    out[i * 3 + 2] = 0 - radius * Math.sin(t) * Math.sin(e);
  }
  return out;
}

export interface HimmelsSchalter { spuren: boolean; ekliptik: boolean; aequator: boolean }

export interface HimmelsLinien {
  /** `an`: Himmelsansicht aktiv (store/himmelsansicht.ts). */
  update(an: boolean, jd: number, schalter: HimmelsSchalter): void;
  readonly spuren: ReadonlyMap<string, THREE.Line>;
  readonly ekliptik: THREE.LineLoop;
  readonly aequator: THREE.LineLoop;
  readonly fruehlingspunkt: THREE.LineSegments;
}

function linienMaterial(farbe: number): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({ color: farbe, transparent: true, opacity: LINIEN_DECKKRAFT, depthWrite: false });
}

function vorbereiten<T extends THREE.Object3D>(szene: THREE.Scene, objekt: T, name: string): T {
  objekt.name = name;
  // Punkte weit vom Objektursprung: dieselbe Überlegung wie bei Bahnlinien und Sternen.
  objekt.frustumCulled = false;
  objekt.visible = false;
  szene.add(objekt);
  return objekt;
}

export function createHimmelsLinien(szene: THREE.Scene, index: BodyIndex = bodyIndex): HimmelsLinien {
  const R = HIMMEL_KUGEL_EINHEITEN;
  // 366 Tagespunkte und der Punkt zum genauen jd, damit die Spur am Planeten endet.
  const PUNKTE = SPUR_TAGE + 2;
  const puffer = new Map<string, SpurPuffer>();
  const spuren = new Map<string, THREE.Line>();

  for (const id of SPUR_KOERPER) {
    const geometrie = new THREE.BufferGeometry();
    geometrie.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PUNKTE * 3), 3));
    const farbe = new THREE.Color(index[id]!.appearance.color);
    const farben = new Float32Array(PUNKTE * 4);
    for (let i = 0; i < PUNKTE; i++) {
      farben.set([farbe.r, farbe.g, farbe.b, SPUR_DECKKRAFT * (i / (PUNKTE - 1))], i * 4);
    }
    geometrie.setAttribute('color', new THREE.BufferAttribute(farben, 4));
    const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
    spuren.set(id, vorbereiten(szene, new THREE.Line(geometrie, material), `spur-${id}`));
    puffer.set(id, spurPuffer(id));
  }

  const kreis = (neigung: number, farbe: number, name: string): THREE.LineLoop => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(grosskreis(neigung), 3));
    return vorbereiten(szene, new THREE.LineLoop(g, linienMaterial(farbe)), name);
  };
  const ekliptik = kreis(0, EKLIPTIK_FARBE, 'ekliptik');
  const aequator = kreis(EKLIPTIK_SCHIEFE_GRAD, AEQUATOR_FARBE, 'aequator');

  const a = FRUEHLINGSPUNKT_HALB_GRAD * GRAD;
  const kreuzG = new THREE.BufferGeometry();
  kreuzG.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    R * Math.cos(a), -R * Math.sin(a), 0, R * Math.cos(a), R * Math.sin(a), 0,
    R * Math.cos(a), 0, -R * Math.sin(a), R * Math.cos(a), 0, R * Math.sin(a),
  ]), 3));
  const fruehlingspunkt = vorbereiten(
    szene, new THREE.LineSegments(kreuzG, linienMaterial(AEQUATOR_FARBE)), 'fruehlingspunkt',
  );

  return {
    spuren, ekliptik, aequator, fruehlingspunkt,
    update(an, jd, schalter) {
      const spurenAn = an && schalter.spuren;
      for (const [id, linie] of spuren) {
        linie.visible = spurenAn;
        if (!spurenAn) continue;
        const p = puffer.get(id)!;
        spurNachfuehren(p, jd, index);
        const attr = linie.geometry.getAttribute('position') as THREE.BufferAttribute;
        const ziel = attr.array as Float32Array;
        for (let i = 0; i < (SPUR_TAGE + 1) * 3; i++) ziel[i] = p.richtungen[i]! * R;
        const jetzt = geozentrischeRichtung(id, index, jd);
        ziel.set([jetzt.x * R, jetzt.y * R, jetzt.z * R], (SPUR_TAGE + 1) * 3);
        attr.needsUpdate = true;
      }
      ekliptik.visible = an && schalter.ekliptik;
      aequator.visible = an && schalter.aequator;
      fruehlingspunkt.visible = aequator.visible;
    },
  };
}
