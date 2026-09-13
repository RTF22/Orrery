// @vitest-environment jsdom
// createRingViews lädt beim Aufbau die Ringtextur über THREE.TextureLoader,
// das dafür ein document braucht. In jsdom wird kein Bild geladen — es bleibt
// die Ersatz- bzw. Profiltextur stehen, und genau die gibt ringTextur zurück.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  ringGeometrieDaten, ringAusrichtung, vorwaertsstreuung,
  ringHelligkeit, ERSATZ_RING_GRAU, createRingViews,
} from './rings';
import { poleVector } from '../sim/frames';
import { pickRadiusUnits } from './bodies';
import { sonnenGeometrie } from './shadows';
import { bodyIndex, getBody } from '../data/index';
import { SCALE_PRESETS } from '../sim/scale';
import { J2000 } from '../sim/time';
import type { LightingSettings } from './lighting';

describe('ringGeometrieDaten', () => {
  const daten = ringGeometrieDaten(2, 5, 64);

  it('legt zwei Punkte je Segmentgrenze an — innen und außen', () => {
    // 65 Segmentgrenzen (0..64, das letzte deckt sich mit dem ersten, damit
    // der Ring ohne Naht schließt), je zwei Punkte (innen/außen), je drei
    // Koordinaten (x, y, z).
    expect(daten.positions.length / 3).toBe(2 * (64 + 1));
  });

  it('hält alle Punkte in der lokalen xy-Ebene', () => {
    for (let i = 2; i < daten.positions.length; i += 3) {
      expect(daten.positions[i]).toBe(0);
    }
  });

  it('trifft Innen- und Außenradius genau', () => {
    // Nachkommastellen hergeleitet, nicht wie im Task-12-Brief mit 10
    // behauptet: `positions` ist laut Signatur ein Float32Array, und
    // float32 hat rund 7 signifikante Dezimalstellen. Für einen Betrag im
    // Bereich 2..5 (Exponent 1..2) liegt der größte Rundungsfehler eines
    // einzelnen Float64-nach-Float32-Rundungsschritts bei 2^(Exponent-24),
    // also rund 1,19·10⁻⁷ (r=2) bzw. 2,38·10⁻⁷ (r=5); hypot() zweier
    // gerundeter Komponenten bleibt in derselben Größenordnung. Numerisch
    // nachgemessen (alle 65 Stützpunkte, r=2 und r=5): größte Abweichung
    // 5,77·10⁻⁸ bzw. 1,45·10⁻⁷. 10 Nachkommastellen (Schwelle 5·10⁻¹¹) sind
    // für ein Float32Array damit unerreichbar; 6 Stellen (Schwelle 5·10⁻⁷)
    // liegen mit gut dreifacher Marge über dem gemessenen Höchstfehler.
    for (let i = 0; i < daten.positions.length; i += 6) {
      const rInnen = Math.hypot(daten.positions[i]!, daten.positions[i + 1]!);
      const rAussen = Math.hypot(daten.positions[i + 3]!, daten.positions[i + 4]!);
      expect(rInnen).toBeCloseTo(2, 6);
      expect(rAussen).toBeCloseTo(5, 6);
    }
  });

  it('legt u radial: 0 an der Innenkante, 1 an der Außenkante', () => {
    for (let i = 0; i < daten.uvs.length; i += 4) {
      expect(daten.uvs[i]).toBeCloseTo(0, 10);
      expect(daten.uvs[i + 2]).toBeCloseTo(1, 10);
    }
  });

  it('bildet je Segment zwei Dreiecke', () => {
    // Pro Segment ein Viereck aus zwei Punktpaaren, aufgeteilt in zwei
    // Dreiecke zu je drei Indizes: 64 Segmente * 2 Dreiecke * 3 Indizes.
    expect(daten.indices.length).toBe(64 * 6);
  });
});

describe('ringAusrichtung', () => {
  it('stellt die Ringebene senkrecht auf den Pol', () => {
    const pol = poleVector(40.589, 83.537); // Saturn
    const normale = new THREE.Vector3(0, 0, 1).applyQuaternion(ringAusrichtung(pol));
    expect(normale.x).toBeCloseTo(pol.x, 10);
    expect(normale.y).toBeCloseTo(pol.y, 10);
    expect(normale.z).toBeCloseTo(pol.z, 10);
  });
});

describe('vorwaertsstreuung', () => {
  it('ist maximal, wenn die Sonne genau hinter den Ringen steht', () => {
    // cos = -1: Blickrichtung und Richtung zur Sonne sind entgegengesetzt,
    // das Licht kommt also durch die Ringe auf die Kamera zu.
    expect(vorwaertsstreuung(-1, 0.8, 8)).toBeCloseTo(0.8, 12);
  });

  it('verschwindet, sobald die Sonne vor den Ringen steht', () => {
    expect(vorwaertsstreuung(0, 0.8, 8)).toBe(0);
    expect(vorwaertsstreuung(0.5, 0.8, 8)).toBe(0);
    expect(vorwaertsstreuung(1, 0.8, 8)).toBe(0);
  });

  it('wächst monoton zum Gegenlicht hin', () => {
    const werte = [-0.2, -0.5, -0.8, -1].map((c) => vorwaertsstreuung(c, 1, 8));
    for (let i = 1; i < werte.length; i++) {
      expect(werte[i]!).toBeGreaterThan(werte[i - 1]!);
    }
  });

  it('bündelt den Effekt mit steigender Schärfe enger', () => {
    // Bei halbem Gegenlicht muss ein schärferer Exponent weniger übrig lassen.
    expect(vorwaertsstreuung(-0.5, 1, 16)).toBeLessThan(vorwaertsstreuung(-0.5, 1, 4));
  });

  it('trifft eine konkrete Stützstelle exakt', () => {
    // Nagelt die Formel fest, nicht nur ihre Form (monoton, Nullstellen,
    // Maximum) — die vorherigen Tests würden auch bei einer Formel mit
    // falscher Basis oder falschem Exponenten grün bleiben.
    // Herleitung: -cosWinkel = -(-0,5) = 0,5; pow(0,5; 8) = 1/2^8 = 1/256;
    // staerke = 1 multipliziert nur, ändert also nichts an 1/256.
    expect(vorwaertsstreuung(-0.5, 1, 8)).toBeCloseTo(1 / 256, 12);
  });
});

describe('ringHelligkeit — die Ersatztextur muss sichtbar bleiben', () => {
  // Messwerte aus der Kinoszene `uranus-gekippt` (12.09.2026, Preset
  // Schaubild, Standardbeleuchtung): uTag 0,331, |N·L| 0,508, kein
  // Gegenlicht (V·L > 0), Nachtseitenfüllung 0,25. Mit der alten
  // Ersatztextur RGB 38 (linear 0,0206) ergab das 0,0028 linear — nach
  // ACES-Tonemapping und sRGB weniger als 1 von 255: Der Ring war im Bild
  // nicht vorhanden (Pixelmessung: 0 an jeder Ringposition außerhalb der
  // Planetenscheibe). Unter rund 0,01 linear drückt die ACES-Kurve alles
  // auf Schwarz; die Schwelle 0,02 lässt dazu einen Faktor 2 Luft.
  const uranus = { cosNL: 0.508, cosVL: 0.3, uTag: 0.331, fuellung: 0.25 };
  // 8-Bit-sRGB-Grauwert nach linear — derselbe Weg, den die DataTexture mit
  // colorSpace = SRGBColorSpace beim Sampling nimmt.
  const linear = (grau8: number): number =>
    new THREE.Color().setRGB(grau8 / 255, grau8 / 255, grau8 / 255, THREE.SRGBColorSpace).r;

  it('hebt das Ersatzgrau in der Uranusszene über die Sichtbarkeitsschwelle', () => {
    const albedo = linear(ERSATZ_RING_GRAU);
    const wert = ringHelligkeit(albedo, uranus.cosNL, uranus.cosVL, uranus.uTag, uranus.fuellung);
    expect(wert).toBeGreaterThanOrEqual(0.02);
  });

  it('belegt, dass der alte Wert 38 unter der Schwelle lag', () => {
    const albedoAlt = linear(38);
    const wert = ringHelligkeit(albedoAlt, uranus.cosNL, uranus.cosVL, uranus.uTag, uranus.fuellung);
    expect(wert).toBeLessThan(0.01);
  });

  it('rechnet beidseitig: ein Ring hat keine Rückseite', () => {
    expect(ringHelligkeit(0.5, -0.4, 0.3, 1, 0)).toBeCloseTo(ringHelligkeit(0.5, 0.4, 0.3, 1, 0), 12);
  });

  it('setzt sich aus Direktlicht, Füllung und Streuung zusammen', () => {
    // Stützstelle von Hand: albedo 0,5, |cos| 0,4, uTag 1, Füllung 0,25,
    // Gegenlicht cosVL = -1 (Streuung maximal = RING_STREUUNG 0,85):
    // 0,5 · (0,4/π + 0,25 + 0,85/π)
    const erwartet = 0.5 * (0.4 / Math.PI + 0.25 + 0.85 / Math.PI);
    expect(ringHelligkeit(0.5, 0.4, -1, 1, 0.25)).toBeCloseTo(erwartet, 12);
  });
});

describe('createRingViews.ringTextur', () => {
  it('gibt die gebundene Ringtextur des Ringträgers zurück', () => {
    // Der Körper-Shader (bodies.ts) sampelt genau diese Textur für den
    // Ringschatten — dasselbe Bild, das die Ringscheibe selbst zeichnet.
    const ringe = createRingViews(new THREE.Scene());
    expect(ringe.ringTextur('saturn')).toBeInstanceOf(THREE.Texture);
    ringe.dispose();
  });

  it('gibt für einen Körper ohne Ringe undefined zurück', () => {
    const ringe = createRingViews(new THREE.Scene());
    expect(ringe.ringTextur('earth')).toBeUndefined();
    ringe.dispose();
  });
});

/**
 * Das ShaderMaterial der Ringscheibe eines Körpers. `createRingViews` legt die
 * Meshes nur in der Szene ab und gibt sie nicht heraus; gesucht wird deshalb
 * über die Geometrie — der äußerste Stützpunkt trägt exakt `outerKm` des
 * jeweiligen Ringsystems (siehe ringGeometrieDaten), und die beiden
 * Ringsysteme im Katalog (Saturn, Uranus) unterscheiden sich darin deutlich.
 */
function ringMesh(scene: THREE.Scene, bodyId: string): THREE.Mesh {
  const aussenKm = getBody(bodyId).appearance.rings!.outerKm;
  for (const kind of scene.children) {
    if (!(kind instanceof THREE.Mesh)) continue;
    const pos = kind.geometry.getAttribute('position');
    let groesster = 0;
    for (let i = 0; i < pos.count; i++) {
      groesster = Math.max(groesster, Math.hypot(pos.getX(i), pos.getY(i)));
    }
    if (Math.abs(groesster - aussenKm) < 1) return kind;
  }
  throw new Error(`Keine Ringscheibe für ${bodyId} in der Szene`);
}

function ringMaterial(scene: THREE.Scene, bodyId: string): THREE.ShaderMaterial {
  return ringMesh(scene, bodyId).material as THREE.ShaderMaterial;
}

const RING_LICHT: LightingSettings = {
  brightness: 1, lightFalloff: 2, nightFill: 0.25, lightCompensation: 0.7,
};

/** Ruft update mit dem Standardaufbau der Tests auf; nur `schatten` wechselt. */
function ringeAktualisieren(
  ringe: ReturnType<typeof createRingViews>, schatten: boolean,
): void {
  ringe.update(
    J2000, SCALE_PRESETS.schaubild, new THREE.Vector3(0, 0, 0), {}, RING_LICHT,
    new THREE.Vector3(0, 0, 0), schatten,
  );
}

describe('createRingViews — Planetenschatten auf dem Ring', () => {
  it('näht die Schattenrechnung in den Ring-Fragment-Shader', () => {
    const scene = new THREE.Scene();
    const ringe = createRingViews(scene);
    const { fragmentShader } = ringMaterial(scene, 'saturn');
    expect(fragmentShader).toContain('float sonnenAnteil(');
    expect(fragmentShader).toContain(
      'kugelSchatten(vWeltPos, uPlanetOkkluder, uSonnenRichtung, uSonnenWinkel)',
    );
    // Der Schattenfaktor gehört auf den Direktanteil *und* auf die
    // Nachtseitenfüllung: Ein Ring hat keine Atmosphäre, die den Kernschatten
    // aufhellen könnte (Entwurf §2, Absatz „Ring-Shader", Entscheidung nach
    // der Sichtprüfung Task 4). Allein `streu` bleibt unbeschattet, damit der
    // Ringdurchflug unverändert bleibt.
    expect(fragmentShader).toContain('float direkt = abs(dot(N, L)) * uTag * RECIPROCAL_PI;');
    expect(fragmentShader).toContain('((direkt + uFuellung * uTag) * f + streu)');
    ringe.dispose();
  });

  it('legt die Schatten-Uniforms am Ringmaterial an', () => {
    const scene = new THREE.Scene();
    const ringe = createRingViews(scene);
    const { uniforms } = ringMaterial(scene, 'saturn');
    expect(uniforms['uPlanetOkkluder']!.value).toBeInstanceOf(THREE.Vector4);
    expect(uniforms['uSonnenRichtung']!.value).toBeInstanceOf(THREE.Vector3);
    expect(uniforms['uSonnenWinkel']!.value).toBe(0);
    ringe.dispose();
  });

  it('setzt Saturn selbst als Okkluder seiner Ringe', () => {
    const scene = new THREE.Scene();
    const ringe = createRingViews(scene);
    const { uniforms } = ringMaterial(scene, 'saturn');
    ringeAktualisieren(ringe, true);

    const okkluder = uniforms['uPlanetOkkluder']!.value as THREE.Vector4;
    // w ist der dargestellte Planetenradius in Render-Einheiten — derselbe
    // Wert, mit dem bodies.ts die Saturnkugel skaliert.
    expect(okkluder.w).toBeCloseTo(pickRadiusUnits(getBody('saturn'), SCALE_PRESETS.schaubild), 9);
    // xyz ist die dargestellte Mitte, also die Position der Ringscheibe selbst.
    const mesh = ringMesh(scene, 'saturn');
    expect(okkluder.x).toBeCloseTo(mesh.position.x, 9);
    expect(okkluder.y).toBeCloseTo(mesh.position.y, 9);
    expect(okkluder.z).toBeCloseTo(mesh.position.z, 9);
    ringe.dispose();
  });

  it('nimmt Sonnenrichtung und Sonnenwinkel aus der echten Geometrie', () => {
    const scene = new THREE.Scene();
    const ringe = createRingViews(scene);
    const { uniforms } = ringMaterial(scene, 'saturn');
    ringeAktualisieren(ringe, true);

    const sonne = sonnenGeometrie('saturn', bodyIndex, J2000);
    expect(uniforms['uSonnenWinkel']!.value).toBeCloseTo(sonne.winkelRad, 12);
    const richtung = uniforms['uSonnenRichtung']!.value as THREE.Vector3;
    expect(richtung.x).toBeCloseTo(sonne.richtung.x, 12);
    expect(richtung.y).toBeCloseTo(sonne.richtung.y, 12);
    expect(richtung.z).toBeCloseTo(sonne.richtung.z, 12);
    expect(richtung.length()).toBeCloseTo(1, 12);
    ringe.dispose();
  });

  it('schaltet den Planetenschatten über den Radius ab', () => {
    // Radius 0 macht kugelSchatten für jedes Fragment zu exakt 1 — der
    // Schalter kostet damit keine Neuübersetzung des Materials.
    const scene = new THREE.Scene();
    const ringe = createRingViews(scene);
    const { uniforms } = ringMaterial(scene, 'saturn');
    ringeAktualisieren(ringe, true);
    ringeAktualisieren(ringe, false);
    expect((uniforms['uPlanetOkkluder']!.value as THREE.Vector4).w).toBe(0);
    ringe.dispose();
  });
});
