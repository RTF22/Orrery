import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  beltAttribute, beltPositionAE, beltHelligkeit, beltTagHelligkeit,
  createBeltViews, BELT_ALBEDO, KUIPERGUERTEL_ALBEDO, HAUPTGUERTEL_KEIM,
} from './belts';
import { generateBelt, HAUPTGUERTEL, GM_SONNE_AE3_TAG2 } from '../sim/belts';
import { positionInParentFrame, AU_KM } from '../sim/orbit';
import { compressDistance } from '../sim/scale';
import type { OrbitElements } from '../sim/types';
import { J2000 } from '../sim/time';
import { bodyLighting, irradianceFactor } from './lighting';
import type { LightingSettings } from './lighting';

const GRAD = 180 / Math.PI;

/**
 * Dasselbe Teilchen als Elementsatz für positionInParentFrame: Diese
 * Funktion rechnet mit Grad, mit der mittleren Länge L = Ω + ω + M0 und in
 * Kilometern. Nur L läuft mit der Zeit — mit derselben mittleren Bewegung
 * n, umgerechnet von Radiant je Tag in Grad je Jahrhundert (36 525 Tage).
 * Alle übrigen Raten sind null: Ein Gürtelteilchen bekommt keine Störungen.
 */
function alsOrbit(
  el: { a: number; e: number; inc: number; node: number; peri: number; m0: number; n: number },
): OrbitElements {
  return {
    frame: 'ecliptic',
    a: el.a, e: el.e,
    i: el.inc * GRAD,
    L: (el.node + el.peri + el.m0) * GRAD,
    lp: (el.node + el.peri) * GRAD,
    node: el.node * GRAD,
    aDot: 0, eDot: 0, iDot: 0, LDot: el.n * GRAD * 36_525, lpDot: 0, nodeDot: 0,
  };
}

describe('beltPositionAE — dieselbe Ekliptik wie die Planeten', () => {
  // Ein Teilchen mit deutlicher Neigung und Exzentrizität: Bei i = 0 oder
  // e = 0 fielen Vorzeichenfehler in der Drehreihenfolge nicht auf.
  const el = {
    a: 2.77, e: 0.28, inc: 0.32, node: 1.9, peri: 0.7, m0: 2.4,
    n: Math.sqrt(GM_SONNE_AE3_TAG2 / 2.77 ** 3),
  };

  it('trifft zur Epoche die Kepler-Lösung aus sim/orbit.ts', () => {
    const soll = positionInParentFrame(alsOrbit(el), J2000);
    const ist = beltPositionAE(el, 0, 1);
    // positionInParentFrame liefert Kilometer, beltPositionAE AE. Die
    // Schranke von 6 Nachkommastellen in AE entspricht rund 150 km — sie
    // deckt den Rest der fünf Newton-Schritte gegen die iterative Lösung
    // aus sim/kepler.ts ab (nachgemessen: unter 1e-12 AE).
    expect(ist.x).toBeCloseTo(soll.x / AU_KM, 6);
    expect(ist.y).toBeCloseTo(soll.y / AU_KM, 6);
    expect(ist.z).toBeCloseTo(soll.z / AU_KM, 6);
  });

  it('läuft mit n rad/Tag weiter — nach einem Umlauf wieder am Start', () => {
    const umlaufTage = (2 * Math.PI) / el.n;
    const start = beltPositionAE(el, 0, 1);
    const nachher = beltPositionAE(el, umlaufTage, 1);
    expect(nachher.x).toBeCloseTo(start.x, 6);
    expect(nachher.y).toBeCloseTo(start.y, 6);
    expect(nachher.z).toBeCloseTo(start.z, 6);
  });

  it('bewegt sich nach einem Vierteljahr merklich weiter', () => {
    const start = beltPositionAE(el, 0, 1);
    const spaeter = beltPositionAE(el, 90, 1);
    const weg = Math.hypot(spaeter.x - start.x, spaeter.y - start.y, spaeter.z - start.z);
    expect(weg).toBeGreaterThan(0.1);
  });

  // Zweites Teilchen am Deckel der Exzentrizitätsverteilung (e = 0,35, siehe
  // sim/belts.ts): Dort ist die Keplergleichung am steifsten, und dort muss
  // sich zeigen, dass fünf Newton-Schritte noch genügen.
  const elRand = {
    a: 3.2, e: 0.35, inc: 0.52, node: 4.7, peri: 5.3, m0: 0.9,
    n: Math.sqrt(GM_SONNE_AE3_TAG2 / 3.2 ** 3),
  };

  it('folgt zu jedem Zeitpunkt der Kepler-Lösung, nicht nur zur Epoche', () => {
    for (const teilchen of [el, elRand]) {
      for (const tage of [37, 400, 3650]) {
        const soll = positionInParentFrame(alsOrbit(teilchen), J2000 + tage);
        const ist = beltPositionAE(teilchen, tage, 1);
        expect(ist.x).toBeCloseTo(soll.x / AU_KM, 6);
        expect(ist.y).toBeCloseTo(soll.y / AU_KM, 6);
        expect(ist.z).toBeCloseTo(soll.z / AU_KM, 6);
      }
    }
  });

  it('komprimiert den Abstand wie compressDistance mit Fixpunkt 1 AE', () => {
    for (const k of [1, 0.6, 0.4]) {
      const roh = beltPositionAE(el, 0, 1);
      const komprimiert = beltPositionAE(el, 0, k);
      const rRoh = Math.hypot(roh.x, roh.y, roh.z);
      const rNeu = Math.hypot(komprimiert.x, komprimiert.y, komprimiert.z);
      expect(rNeu).toBeCloseTo(compressDistance(rRoh * AU_KM, k) / AU_KM, 9);
      // Die Richtung bleibt unangetastet — nur der Betrag ändert sich.
      expect(komprimiert.x / rNeu).toBeCloseTo(roh.x / rRoh, 10);
      expect(komprimiert.y / rNeu).toBeCloseTo(roh.y / rRoh, 10);
      expect(komprimiert.z / rNeu).toBeCloseTo(roh.z / rRoh, 10);
    }
  });

  it('lässt einen Punkt bei 1 AE bei jedem Exponenten liegen', () => {
    const kreis = { a: 1, e: 0, inc: 0, node: 0, peri: 0, m0: 0, n: 0 };
    for (const k of [1, 0.6, 0.4]) {
      const p = beltPositionAE(kreis, 0, k);
      expect(Math.hypot(p.x, p.y, p.z)).toBeCloseTo(1, 9);
    }
  });
});

describe('beltAttribute', () => {
  const elemente = generateBelt(HAUPTGUERTEL, 64, HAUPTGUERTEL_KEIM);
  const { elem1, elem2 } = beltAttribute(elemente);

  it('packt je Teilchen zwei vec4', () => {
    expect(elem1.length).toBe(64 * 4);
    expect(elem2.length).toBe(64 * 4);
  });

  it('legt die Elemente in der vom Shader erwarteten Reihenfolge ab', () => {
    for (let k = 0; k < elemente.count; k++) {
      const i = k * 4;
      expect(elem1[i]).toBe(elemente.a[k]);
      expect(elem1[i + 1]).toBe(elemente.e[k]);
      expect(elem1[i + 2]).toBe(elemente.inc[k]);
      expect(elem1[i + 3]).toBe(elemente.node[k]);
      expect(elem2[i]).toBe(elemente.peri[k]);
      expect(elem2[i + 1]).toBe(elemente.m0[k]);
      expect(elem2[i + 2]).toBe(elemente.n[k]);
      // Die vierte Spur von aElem2 ist Füllung und muss null bleiben.
      expect(elem2[i + 3]).toBe(0);
    }
  });
});

describe('beltTagHelligkeit — derselbe Weg wie bei den Ringen', () => {
  const licht: LightingSettings = {
    brightness: Math.PI, lightFalloff: 2, nightFill: 0.25, lightCompensation: 0.7,
  };

  it('setzt sich aus brightness, colorGain und Distanzfaktor zusammen', () => {
    const abstandKm = 2.7 * AU_KM;
    const erwartet = licht.brightness * bodyLighting(abstandKm, licht).colorGain
      * irradianceFactor(abstandKm, licht.lightFalloff);
    expect(beltTagHelligkeit(2.7, licht)).toBeCloseTo(erwartet, 12);
  });

  it('lässt den Kuipergürtel dunkler als den Hauptgürtel', () => {
    expect(beltTagHelligkeit(43, licht)).toBeLessThan(beltTagHelligkeit(2.7, licht));
  });
});

describe('beltHelligkeit — Teilchen im Ceres-Kino', () => {
  it('trägt den Lambert-Faktor 1/π', () => {
    expect(beltHelligkeit(0.06, Math.PI)).toBeCloseTo(0.06, 12);
  });

  it('hält die dunkle Albedo als Wert fest, nicht als Sichtbarkeitszahl', () => {
    // 0,06 ist die C-Typ-Albedo aus dem Entwurf. Sollte die Sichtprüfung
    // den Gürtel unter der Sichtbarkeitsschwelle messen, wird sie im
    // Entwurf begründet angehoben — nicht die Beleuchtung verändert.
    expect(BELT_ALBEDO).toBe(0.06);
  });

  it('gibt dem Kuipergürtel die gemessene Albedo klassischer KBOs, 0,12', () => {
    // Entwurf, Abschnitt 2: Die Kuiper-Wolke besteht zu 60 % aus kalten
    // klassischen KBOs (Herschel „TNOs are Cool": Albedo ≈ 0,14), zu 25 %
    // aus heißen (≈ 0,085) und zu 15 % aus Plutinos (≈ 0,08); gewichtet
    // ≈ 0,12. Das ist ein Messwert, keine Sichtbarkeitszahl — der
    // Hauptgürtel bleibt bei seinen 0,06.
    expect(KUIPERGUERTEL_ALBEDO).toBe(0.12);
    expect(KUIPERGUERTEL_ALBEDO).toBeGreaterThan(BELT_ALBEDO);
  });
});

describe('createBeltViews', () => {
  const licht: LightingSettings = {
    brightness: 1, lightFalloff: 2, nightFill: 0.25, lightCompensation: 0.7,
  };
  const kamera = new THREE.Vector3(0, 0, 0);

  function wolken(scene: THREE.Scene): THREE.Points[] {
    return scene.children.filter((o): o is THREE.Points => o instanceof THREE.Points);
  }

  it('legt je Gürtel eine Punktwolke an, ohne Frustum-Culling', () => {
    const scene = new THREE.Scene();
    createBeltViews(scene);
    expect(wolken(scene)).toHaveLength(2);
    for (const p of wolken(scene)) expect(p.frustumCulled).toBe(false);
  });

  it('zeichnet transparent, ohne Tiefenschreiben und nicht additiv', () => {
    const scene = new THREE.Scene();
    createBeltViews(scene);
    for (const p of wolken(scene)) {
      const m = p.material as THREE.ShaderMaterial;
      expect(m.transparent).toBe(true);
      expect(m.depthWrite).toBe(false);
      // Additiv wäre der Auslöser für das Bloom-Nachbild in dichten
      // Bildbereichen — siehe Kommentar in belts.ts.
      expect(m.blending).toBe(THREE.NormalBlending);
    }
  });

  it('füllt die Attribute mit der Teilchenzahl der Stufe', () => {
    const scene = new THREE.Scene();
    const views = createBeltViews(scene);
    views.update(J2000, 0.6, kamera, 'high', true, licht, 2);
    for (const p of wolken(scene)) {
      expect(p.geometry.getAttribute('aElem1').count).toBe(50_000);
      expect(p.geometry.getAttribute('aElem2').count).toBe(50_000);
      expect(p.geometry.drawRange.count).toBe(50_000);
      expect(p.visible).toBe(true);
    }
  });

  it('füllt die zweite Wolke aus KUIPERGUERTEL, nicht noch einmal aus dem Hauptgürtel', () => {
    const scene = new THREE.Scene();
    const views = createBeltViews(scene);
    views.update(J2000, 0.4, kamera, 'medium', true, licht, 1);
    const [haupt, kuiper] = wolken(scene);

    // Erste Spur von aElem1 ist die große Halbachse in AE (beltAttribute).
    const halbachsen = (p: THREE.Points): number[] => {
      const roh = p.geometry.getAttribute('aElem1').array as Float32Array;
      const a: number[] = [];
      for (let i = 0; i < roh.length; i += 4) a.push(roh[i]!);
      return a;
    };

    const aHaupt = halbachsen(haupt!);
    for (const a of aHaupt) expect(a).toBeGreaterThanOrEqual(2.1);
    for (const a of aHaupt) expect(a).toBeLessThanOrEqual(3.3);

    // Kuipergürtel: klassischer Gürtel mit weichem Rand (38,5 … 48,5 AE)
    // und Plutinos um 39,4 AE — beide Bereiche zusammen 38,4 … 48,5 AE.
    const aKuiper = halbachsen(kuiper!);
    for (const a of aKuiper) expect(a).toBeGreaterThanOrEqual(38.4);
    for (const a of aKuiper) expect(a).toBeLessThanOrEqual(48.5);
    // Die Plutinos sind 15 % der Wolke und liegen als Glocke (σ 0,3 AE) um
    // 39,4 AE; ohne sie wäre die zweite Population verloren gegangen.
    // Rechnung für das Fenster 38,9 … 39,9 AE (= μ ± 1,667σ): davon fallen
    // 90,5 % der Plutinos hinein, also 0,15 · 0,905 = 13,6 % der Wolke.
    // Der klassische Gürtel (85 %, Plateau mit Rampe 38,5 → 39,5 AE) legt
    // 0,82 von 9 Masseeinheiten in dasselbe Fenster, also 0,85 · 9,1 % =
    // 7,7 %. Erwartet sind damit 21,3 %, ohne Plutinos nur 7,7 % — die
    // Schwelle steht deshalb bei 15 % und nicht bei den ursprünglichen
    // 10 %, die vom Wert ohne Plutinos nur 2,3 Prozentpunkte entfernt lagen.
    const plutinoNah = aKuiper.filter((a) => a > 38.9 && a < 39.9).length;
    expect(plutinoNah / aKuiper.length).toBeGreaterThan(0.15);
  });

  it('gibt beiden Wolken dasselbe Material, aber je eine eigene Albedo', () => {
    const scene = new THREE.Scene();
    createBeltViews(scene);
    const [haupt, kuiper] = wolken(scene);
    const mH = haupt!.material as THREE.ShaderMaterial;
    const mK = kuiper!.material as THREE.ShaderMaterial;
    // Derselbe Material-Typ heißt: gleiche Shader — nur die Uniforms
    // unterscheiden sich: uTag am jeweiligen Gürtelabstand und die Albedo
    // der jeweiligen Population (C-Typ im Hauptgürtel, KBOs draußen).
    expect(mK.vertexShader).toBe(mH.vertexShader);
    expect(mK.fragmentShader).toBe(mH.fragmentShader);
    expect(mH.uniforms['uAlbedo']!.value).toBe(BELT_ALBEDO);
    expect(mK.uniforms['uAlbedo']!.value).toBe(KUIPERGUERTEL_ALBEDO);
    // Eigene Uniform-Objekte, sonst zöge ein uTag den anderen mit.
    expect(mK.uniforms).not.toBe(mH.uniforms);
  });

  it('trägt im Shader-Quelltext die logdepthbuf-Includes und die Kernzeilen der Rechnung', () => {
    // Der Shader selbst lässt sich nicht ausführen, sein Quelltext aber
    // lesen. Geprüft werden die Zeilen, deren Fehlen still schiefgeht: die
    // logarithmische Tiefe (ohne sie z-Fighting über 30 Größenordnungen
    // Abstand, sichtbar erst weit draußen), die Abstandskompression und die
    // beiden Zeilen, deren TS-Zwilling beltPositionAE oben nachgemessen
    // wird. Die Konstanten sind nicht exportiert; der Quelltext kommt
    // deshalb aus dem Material der erzeugten Punktwolke.
    const scene = new THREE.Scene();
    createBeltViews(scene);
    const material = wolken(scene)[0]!.material as THREE.ShaderMaterial;

    expect(material.vertexShader).toContain('#include <logdepthbuf_pars_vertex>');
    expect(material.vertexShader).toContain('#include <logdepthbuf_vertex>');
    // Abstandskompression mit Fixpunkt 1 AE (compressDistance, sim/scale.ts).
    expect(material.vertexShader).toContain('pow(r, uK)');
    // Knotendrehung: dieselbe Achsenwahl wie positionInParentFrame und wie
    // die y-Zeile in beltPositionAE.
    expect(material.vertexShader).toContain('sinN * xEbene + cosN * yEbene * cosI');
    // Newton-Schritt der Keplergleichung, wortgleich zum TS-Zwilling.
    expect(material.vertexShader).toContain('E -= (E - e * sin(E) - M) / (1.0 - e * cos(E));');

    expect(material.fragmentShader).toContain('#include <logdepthbuf_pars_fragment>');
    expect(material.fragmentShader).toContain('#include <logdepthbuf_fragment>');
  });

  it('baut die Geometrie nur bei einem Stufenwechsel neu auf', () => {
    const scene = new THREE.Scene();
    const views = createBeltViews(scene);
    views.update(J2000, 0.6, kamera, 'medium', true, licht, 2);
    const ersteGeometrie = wolken(scene).map((p) => p.geometry);
    for (let i = 0; i < 5; i++) {
      views.update(J2000 + i, 0.6, kamera, 'medium', true, licht, 2);
    }
    expect(wolken(scene).map((p) => p.geometry)).toEqual(ersteGeometrie);

    views.update(J2000, 0.6, kamera, 'high', true, licht, 2);
    for (const [i, p] of wolken(scene).entries()) {
      expect(p.geometry).not.toBe(ersteGeometrie[i]);
      expect(p.geometry.getAttribute('aElem1').count).toBe(50_000);
    }
  });

  it('blendet die Wolken bei Stufe „niedrig" aus — dort gibt es keine Teilchen', () => {
    const scene = new THREE.Scene();
    const views = createBeltViews(scene);
    views.update(J2000, 0.6, kamera, 'low', true, licht, 2);
    for (const p of wolken(scene)) {
      expect(p.visible).toBe(false);
      expect(p.geometry.drawRange.count).toBe(0);
    }
  });

  it('blendet die Wolken aus, wenn der Schalter aus ist', () => {
    const scene = new THREE.Scene();
    const views = createBeltViews(scene);
    views.update(J2000, 0.6, kamera, 'high', false, licht, 2);
    for (const p of wolken(scene)) expect(p.visible).toBe(false);
  });

  it('setzt die Uniforms aus Zeit, Maßstab, Kamera und Licht', () => {
    const scene = new THREE.Scene();
    const views = createBeltViews(scene);
    const kameraKm = new THREE.Vector3(AU_KM * 3, 0, AU_KM * 0.5);
    views.update(J2000 + 1234, 0.4, kameraKm, 'medium', true, licht, 1.5);

    const haupt = wolken(scene)[0]!.material as THREE.ShaderMaterial;
    // Tage seit J2000, nie das volle Julianische Datum (float32-Auflösung).
    expect(haupt.uniforms['uTage']!.value).toBe(1234);
    expect(haupt.uniforms['uK']!.value).toBe(0.4);
    expect((haupt.uniforms['uKameraAE']!.value as THREE.Vector3).x).toBeCloseTo(3, 12);
    expect((haupt.uniforms['uKameraAE']!.value as THREE.Vector3).z).toBeCloseTo(0.5, 12);
    expect(haupt.uniforms['uPixelRatio']!.value).toBe(1.5);
    expect(haupt.uniforms['uTag']!.value).toBeCloseTo(beltTagHelligkeit(2.7, licht), 12);
    // Eine Render-Einheit sind 1000 km (units.ts).
    expect(haupt.uniforms['uEinheitenProAE']!.value).toBeCloseTo(AU_KM / 1000, 6);

    const kuiper = wolken(scene)[1]!.material as THREE.ShaderMaterial;
    expect(kuiper.uniforms['uTag']!.value).toBeCloseTo(beltTagHelligkeit(43, licht), 12);
  });

  it('nimmt beim dispose beide Wolken aus der Szene', () => {
    const scene = new THREE.Scene();
    const views = createBeltViews(scene);
    views.update(J2000, 0.6, kamera, 'medium', true, licht, 2);
    views.dispose();
    expect(wolken(scene)).toHaveLength(0);
  });
});
