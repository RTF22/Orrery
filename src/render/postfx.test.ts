import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import type { MaterialSicherung } from './postfx';
import {
  bloomStrengthFor, BLOOM_LAYER, verdunkleSzeneAusserBloom, stelleSzeneWieder,
} from './postfx';

describe('bloomStrengthFor', () => {
  it('schaltet Bloom auf niedriger Stufe ganz ab', () => {
    expect(bloomStrengthFor('low')).toBe(0);
  });

  it('steigert die Stärke mit der Qualitätsstufe', () => {
    expect(bloomStrengthFor('high')).toBeGreaterThan(bloomStrengthFor('medium'));
    expect(bloomStrengthFor('medium')).toBeGreaterThan(bloomStrengthFor('low'));
  });

  it('behandelt auto wie mittel', () => {
    expect(bloomStrengthFor('auto')).toBe(bloomStrengthFor('medium'));
  });

  it('nutzt eine eigene Ebene für leuchtende Objekte', () => {
    expect(BLOOM_LAYER).toBe(1);
  });
});

/**
 * Baut eine Szene nach, die alles enthält, was im echten Sonnensystem
 * ebenfalls neben den Körpern steckt: die Sonne (Bloom-Ebene), einen
 * undurchsichtigen Planeten, einen durchsichtigen Ring (analog rings.ts),
 * eine durchsichtige Bahnlinie (analog orbits.ts) und ein durchsichtiges
 * Sternenfeld mit depthWrite: false (analog starfield.ts) — plus eine leere
 * Gruppe ohne Material, wie sie z. B. ein Punktlicht ohne Mesh hinterlässt.
 */
function beispielSzene(): {
  szene: THREE.Scene;
  sonne: THREE.Mesh;
  planet: THREE.Mesh;
  ring: THREE.Mesh;
  bahnlinie: THREE.Line;
  sternenfeld: THREE.Points;
  gruppe: THREE.Group;
} {
  const szene = new THREE.Scene();

  const sonnenMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa });
  const sonne = new THREE.Mesh(new THREE.SphereGeometry(1, 4, 4), sonnenMaterial);
  sonne.layers.enable(BLOOM_LAYER);
  szene.add(sonne);

  const planetMaterial = new THREE.MeshStandardMaterial({ color: 0x2a6fdb });
  const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 4, 4), planetMaterial);
  szene.add(planet);

  const ringMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {},
    vertexShader: 'void main() { gl_Position = vec4(position, 1.0); }',
    fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
  });
  const ring = new THREE.Mesh(new THREE.BufferGeometry(), ringMaterial);
  szene.add(ring);

  const bahnMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.45 });
  const bahnlinie = new THREE.Line(new THREE.BufferGeometry(), bahnMaterial);
  szene.add(bahnlinie);

  const sternenMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {},
    vertexShader: 'void main() { gl_Position = vec4(position, 1.0); gl_PointSize = 1.0; }',
    fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
  });
  const sternenfeld = new THREE.Points(new THREE.BufferGeometry(), sternenMaterial);
  szene.add(sternenfeld);

  // Ein Punktlicht (kein Material) — muss die Traversierung unbeschadet
  // durchlaufen, ohne dass die Verdunklung daran scheitert.
  const gruppe = new THREE.Group();
  szene.add(gruppe);

  return { szene, sonne, planet, ring, bahnlinie, sternenfeld, gruppe };
}

describe('verdunkleSzeneAusserBloom / stelleSzeneWieder', () => {
  it('lässt das Material der Bloom-Ebene unangetastet', () => {
    const { szene, sonne } = beispielSzene();
    const sonnenMaterialVorher = sonne.material;
    const ersetzt: MaterialSicherung = new Map();
    const ausgeblendet: THREE.Object3D[] = [];

    verdunkleSzeneAusserBloom(szene, ersetzt, ausgeblendet);

    expect(sonne.material).toBe(sonnenMaterialVorher);
    expect(sonne.visible).toBe(true);
    expect(ersetzt.has(sonne)).toBe(false);
  });

  it('schwärzt undurchsichtige Nicht-Bloom-Objekte, statt sie auszublenden', () => {
    const { szene, planet } = beispielSzene();
    const planetMaterialVorher = planet.material;
    const ersetzt: MaterialSicherung = new Map();
    const ausgeblendet: THREE.Object3D[] = [];

    verdunkleSzeneAusserBloom(szene, ersetzt, ausgeblendet);

    expect(planet.visible).toBe(true); // sichtbar, aber schwarz — nicht versteckt
    expect(planet.material).not.toBe(planetMaterialVorher);
    expect((planet.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0x000000);
    expect(ersetzt.get(planet)).toBe(planetMaterialVorher);
  });

  it('blendet durchsichtige Objekte (Ring, Bahnlinie, Sternenfeld) aus, statt sie zu schwärzen', () => {
    const { szene, ring, bahnlinie, sternenfeld } = beispielSzene();
    const ringMaterialVorher = ring.material;
    const bahnMaterialVorher = bahnlinie.material;
    const sternenMaterialVorher = sternenfeld.material;
    const ersetzt: MaterialSicherung = new Map();
    const ausgeblendet: THREE.Object3D[] = [];

    verdunkleSzeneAusserBloom(szene, ersetzt, ausgeblendet);

    // Kein Materialtausch — ihre echte, teils texturbasierte Transparenz
    // (siehe rings.ts) bliebe sonst durch eine feste Deckkraft ersetzt.
    expect(ring.material).toBe(ringMaterialVorher);
    expect(bahnlinie.material).toBe(bahnMaterialVorher);
    expect(sternenfeld.material).toBe(sternenMaterialVorher);
    // Stattdessen schlicht unsichtbar für diesen einen Durchgang.
    expect(ring.visible).toBe(false);
    expect(bahnlinie.visible).toBe(false);
    expect(sternenfeld.visible).toBe(false);
    expect(ersetzt.size).toBe(1); // nur der undurchsichtige Planet wurde geschwärzt
  });

  it('lässt einen bereits vom Nutzer ausgeblendeten Körper danach ausgeblendet', () => {
    const { szene, ring } = beispielSzene();
    ring.visible = false; // z. B. state.visible[bodyId] === false
    const ersetzt: MaterialSicherung = new Map();
    const ausgeblendet: THREE.Object3D[] = [];

    verdunkleSzeneAusserBloom(szene, ersetzt, ausgeblendet);
    expect(ausgeblendet).not.toContain(ring); // wir haben ihn nicht selbst versteckt

    stelleSzeneWieder(ersetzt, ausgeblendet);
    // Fehlerklasse "ein Objekt bleibt nach einem Frame schwarz" — hier
    // spiegelbildlich: ein eigentlich verstecktes Objekt darf nach dem
    // Bloom-Durchgang nicht plötzlich wieder auftauchen.
    expect(ring.visible).toBe(false);
  });

  it('stellt nach stelleSzeneWieder() jedes Material und jede Sichtbarkeit exakt wieder her', () => {
    const { szene, sonne, planet, ring, bahnlinie, sternenfeld } = beispielSzene();
    const vorher = {
      sonne: sonne.material,
      planet: planet.material,
      ring: ring.material,
      bahnlinie: bahnlinie.material,
      sternenfeld: sternenfeld.material,
    };
    const ersetzt: MaterialSicherung = new Map();
    const ausgeblendet: THREE.Object3D[] = [];

    verdunkleSzeneAusserBloom(szene, ersetzt, ausgeblendet);
    stelleSzeneWieder(ersetzt, ausgeblendet);

    expect(sonne.material).toBe(vorher.sonne);
    expect(planet.material).toBe(vorher.planet);
    expect(ring.material).toBe(vorher.ring);
    expect(bahnlinie.material).toBe(vorher.bahnlinie);
    expect(sternenfeld.material).toBe(vorher.sternenfeld);
    expect(sonne.visible).toBe(true);
    expect(planet.visible).toBe(true);
    expect(ring.visible).toBe(true);
    expect(bahnlinie.visible).toBe(true);
    expect(sternenfeld.visible).toBe(true);
    // Beide Sicherungen sind geleert — ein zweiter, versehentlicher Aufruf
    // von stelleSzeneWieder() würde sonst nichts kaputt machen können, aber
    // eine nicht geleerte Map wäre ein Speicherleck über viele Bilder hinweg.
    expect(ersetzt.size).toBe(0);
    expect(ausgeblendet.length).toBe(0);
  });

  it('funktioniert unverändert über mehrere Bilder hinweg (wiederverwendete Sicherung)', () => {
    const { szene, planet, ring } = beispielSzene();
    const planetMaterialVorher = planet.material;
    const ringMaterialVorher = ring.material;
    const ersetzt: MaterialSicherung = new Map();
    const ausgeblendet: THREE.Object3D[] = [];

    for (let bild = 0; bild < 5; bild++) {
      verdunkleSzeneAusserBloom(szene, ersetzt, ausgeblendet);
      expect((planet.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0x000000);
      expect(ring.visible).toBe(false);
      stelleSzeneWieder(ersetzt, ausgeblendet);
      expect(planet.material).toBe(planetMaterialVorher);
      expect(ring.material).toBe(ringMaterialVorher);
      expect(ring.visible).toBe(true);
    }
  });
});
