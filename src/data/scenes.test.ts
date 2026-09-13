import { describe, it, expect } from 'vitest';
import { SCENES } from './scenes';
import { bodyIndex } from './index';
import { de } from '../ui/i18n/de';
import { t } from '../ui/i18n';
import { positionAt } from '../sim/orbit';
import { J2000 } from '../sim/time';
import { compressDistance, scaledRadius, SCALE_PRESETS } from '../sim/scale';

describe('Szenenkatalog', () => {
  it('erfüllt die Mindestzahl aus den Akzeptanzkriterien', () => {
    expect(SCENES.length).toBeGreaterThanOrEqual(6);
  });

  it('vergibt jede Kennung genau einmal', () => {
    expect(new Set(SCENES.map((s) => s.id)).size).toBe(SCENES.length);
  });

  it('verweist nur auf Körper, die es im Katalog gibt', () => {
    for (const szene of SCENES) {
      expect(bodyIndex, `${szene.id}: ${szene.targetId}`).toHaveProperty(szene.targetId);
      if (szene.lookAtId !== undefined) {
        expect(bodyIndex, `${szene.id}: ${szene.lookAtId}`).toHaveProperty(szene.lookAtId);
      }
    }
  });

  it('hat für jeden Titel einen Sprachschlüssel', () => {
    for (const szene of SCENES) {
      expect(de, `fehlt: ${szene.titleKey}`).toHaveProperty(szene.titleKey);
    }
  });

  it('setzt brauchbare Dauern und Abstände', () => {
    for (const szene of SCENES) {
      expect(szene.durationSec, szene.id).toBeGreaterThan(5);
      expect(szene.durationSec, szene.id).toBeLessThanOrEqual(120);
      expect(szene.params.distanceInRadii, szene.id).toBeGreaterThan(0);
    }
  });

  it('hält die Variationsbereiche in aufsteigender Reihenfolge', () => {
    for (const szene of SCENES) {
      for (const [name, bereich] of Object.entries(szene.variation)) {
        expect(bereich[0], `${szene.id}.${name}`).toBeLessThanOrEqual(bereich[1]!);
      }
    }
  });

  it('lässt den Abstand nie auf null schrumpfen', () => {
    for (const szene of SCENES) {
      expect(szene.variation.distanceFactor[0], szene.id).toBeGreaterThan(0);
    }
  });

  it('nutzt die Systembasis nur für die Systemschau', () => {
    // Die Bezugsgröße gehört zur Pfadart: Ein Vorbeiflug in Vielfachen der
    // Neptunbahn wäre kein Vorbeiflug mehr.
    for (const szene of SCENES) {
      if (szene.distanceBasis === 'systemRadius') expect(szene.path, szene.id).toBe('system');
    }
  });
});

describe('Szenenkatalog — Invarianten über alle Szenen', () => {
  it('führt mindestens 18 Szenen', () => {
    expect(SCENES.length).toBeGreaterThanOrEqual(18);
  });

  it('hat eindeutige IDs und hinterlegte Titel', () => {
    const ids = SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    // t(s.titleKey) !== s.titleKey wäre wirkungslos: t() liefert bei
    // unbekanntem Schlüssel `[key]`, nie den nackten Schlüssel selbst — der
    // Vergleich bestünde also auch für einen fehlenden Eintrag. Geprüft wird
    // stattdessen gegen das Fallback-Klammermuster (wie in data/index.test.ts).
    for (const s of SCENES) expect(t(s.titleKey), s.id).not.toMatch(/^\[.*\]$/);
  });

  it('zeigt nur auf existierende Körper', () => {
    for (const s of SCENES) {
      expect(bodyIndex[s.targetId], s.id).toBeDefined();
      if (s.lookAtId !== undefined) expect(bodyIndex[s.lookAtId], s.id).toBeDefined();
    }
  });

  it('hält Dauer und Parameter in brauchbaren Bereichen', () => {
    for (const s of SCENES) {
      expect(s.durationSec, s.id).toBeGreaterThanOrEqual(20);
      expect(s.durationSec, s.id).toBeLessThanOrEqual(90);
      expect(s.params.distanceInRadii, s.id).toBeGreaterThan(0);
      expect(Math.abs(s.params.elevationDeg), s.id).toBeLessThan(89);
    }
  });

  it('hat wohlgeformte Variationsbereiche', () => {
    for (const s of SCENES) {
      for (const [von, bis] of [s.variation.azimuthDeg, s.variation.elevationDeg, s.variation.distanceFactor]) {
        expect(von, s.id).toBeLessThanOrEqual(bis);
      }
      expect(s.variation.distanceFactor[0], s.id).toBeGreaterThan(0);
    }
  });
});

describe('Szenen — Stichproben', () => {
  it('stellt die Ringkantenszene tatsächlich in die Ringebene', () => {
    const s = SCENES.find((x) => x.id === 'saturn-ringkante')!;
    // WIDERLEGT: Elevation 0 gegen den Standortkörper liegt NICHT
    // automatisch in seiner Äquator-/Ringebene — aufKugel() in
    // render/camera/cinema.ts misst Azimut und Elevation rein ekliptikal,
    // ohne den Zielkörper-Pol zu kennen. Elevation 0 liegt nur an den
    // beiden Knotenazimuten der Ringebene mit der Ekliptik tatsächlich in
    // der Ringebene (hier 169,53°/349,53°, aus Saturns Pol hergeleitet,
    // siehe Kommentar an der Szene selbst) — deshalb prüft dieser Test
    // Azimut und Elevation zusammen, nicht die Elevation allein.
    expect(Math.abs(s.params.elevationDeg)).toBeLessThan(2);
    expect(Math.abs(s.variation.elevationDeg[0])).toBeLessThan(3);
    expect(Math.abs(s.variation.elevationDeg[1])).toBeLessThan(3);
    // Azimut auf dem berechneten Ringebenen-Knoten, mit abgeschalteter
    // Variation — sonst zerstört der Director (er addiert die Variation
    // additiv auf den Basiswert, sim/director.ts) die Ausrichtung bei jedem
    // Abspielen wieder (genau der Rückfall, den dieser Test verhindern soll).
    expect(s.params.azimuthDeg).toBeCloseTo(169.53, 1);
    expect(s.variation.azimuthDeg[0]).toBe(0);
    expect(s.variation.azimuthDeg[1]).toBe(0);
  });

  it('lässt den berechneten Ringebenen-Azimut beim Ringdurchflug stehen', () => {
    const s = SCENES.find((x) => x.id === 'ringdurchflug')!;
    // Derselbe Knoten wie saturn-ringkante (169,53°), derselbe Rückfall:
    // Ohne [0, 0] überschreibt die Variation den berechneten Wert bei jedem
    // Abspielen mit einem Zufallswert über den vollen Kreis.
    expect(s.params.azimuthDeg).toBeCloseTo(169.53, 1);
    expect(s.variation.azimuthDeg[0]).toBe(0);
    expect(s.variation.azimuthDeg[1]).toBe(0);
  });

  it('richtet Uranus-gekippt auf den berechneten Ringebenen-Knoten aus', () => {
    const s = SCENES.find((x) => x.id === 'uranus-gekippt')!;
    // Aus poleVector(257.311, -15.175) (uranus.ts) folgt eine ekliptikale
    // Pollänge von 257,65°; die Ringebene schneidet die Elevation-0-Ebene
    // bei Pollänge ± 90°, hier 167,65°/347,65° (Herleitung am Szenen-
    // Kommentar). Die Streuung muss eng um diesen Wert bleiben — mit vollem
    // Kreis ist "senkrechte Ringe" ein Münzwurf (genau der behobene Fehler).
    expect(s.params.azimuthDeg).toBeCloseTo(167.65, 1);
    expect(Math.abs(s.variation.azimuthDeg[0])).toBeLessThanOrEqual(10);
    expect(Math.abs(s.variation.azimuthDeg[1])).toBeLessThanOrEqual(10);
  });

  it('richtet Enceladus-hell auf die berechnete Sonnenrichtung aus', () => {
    const s = SCENES.find((x) => x.id === 'enceladus-hell')!;
    // Richtung Saturn→Sonne zur Epoche J2000 (aus Saturns Bahnelementen über
    // positionInParentFrame nachgerechnet, siehe Szenen-Kommentar): Azimut
    // 225,58°. Enge Streuung, sonst zeigt die Kamera bei rund der Hälfte
    // der Ziehungen die unbeleuchtete Seite (der behobene Fehler).
    expect(s.params.azimuthDeg).toBeCloseTo(225.58, 1);
    expect(s.variation.azimuthDeg[0]).toBe(-20);
    expect(s.variation.azimuthDeg[1]).toBe(20);
  });

  it('richtet Triton-rückwärts auf die berechnete Sonnenrichtung aus', () => {
    const s = SCENES.find((x) => x.id === 'triton-rueckwaerts')!;
    // Richtung Neptun→Sonne zur Epoche J2000, dieselbe Herleitung wie bei
    // Enceladus (siehe Szenen-Kommentar): Azimut 123,92°.
    expect(s.params.azimuthDeg).toBeCloseTo(123.92, 1);
    expect(Math.abs(s.variation.azimuthDeg[0])).toBeLessThanOrEqual(20);
    expect(Math.abs(s.variation.azimuthDeg[1])).toBeLessThanOrEqual(20);
  });

  it('baut Triton-rückwärts und Iapetus-schief planetenzentriert auf', () => {
    // Rückläufigkeit und Bahnneigung sind Bahn-Eigenschaften und werden nur
    // planetenzentriert sichtbar — beide Szenen zielen deshalb auf den
    // Mutterkörper, nicht mehr auf den Mond selbst (siehe Szenen-Kommentare).
    const triton = SCENES.find((x) => x.id === 'triton-rueckwaerts')!;
    const iapetus = SCENES.find((x) => x.id === 'iapetus-schief')!;
    expect(triton.targetId).toBe('neptune');
    expect(triton.lookAtId).toBeUndefined();
    expect(iapetus.targetId).toBe('saturn');
    expect(iapetus.lookAtId).toBeUndefined();
    // Tritons Bahn muss vollständig ins Bild passen (Ganzkreisdarstellung
    // der Rückläufigkeit) — geprüft am engsten Fall der Abstands-Variation
    // (Faktor 0,8): Halbbildbreite (distanceInRadii * 0,8 * Planetenradius *
    // tan 25°, Kamera-FOV 50°) muss über der großen Halbachse liegen. Beide
    // Seiten skalieren mit demselben Preset-Faktor (sizeScale, sim/scale.ts:
    // Mondversätze UND Körperradius), der reine Radien-Vergleich ist also
    // preset-unabhängig gültig.
    const halbFov = Math.tan((25 * Math.PI) / 180);
    const neptunRadiusKm = 24622;
    const tritonAKm = 354766.0619;
    const halbbildTriton =
      triton.params.distanceInRadii * triton.variation.distanceFactor[0] * neptunRadiusKm * halbFov;
    expect(halbbildTriton).toBeGreaterThan(tritonAKm);
  });

  it('hält Iapetus-schief trotz riesiger Mondbahn lokal bei Saturn', () => {
    // BEFUND (Sichtprüfung): Ein erster Versuch mit distanceInRadii 185
    // (einfache Kugelgeometrie, um Iapetus' 61,19-Saturnradien-Bahn formal
    // vollständig einzuschließen) zeigte den eigentlichen Fehler:
    // sim/scale.ts skaliert Mond-Offsets mit sizeScale, den Sonnenabstand
    // des Planeten dagegen mit der davon unabhängigen Potenzkompression
    // (distanceExponent). Bei 185 lag die Kamera dadurch weiter von Saturn
    // weg als Saturn von der Sonne (143 % von dessen komprimiertem
    // Sonnenabstand) — die Szene zeigte eine Systemübersicht mit Jupiter
    // statt Saturn. Der jetzige Wert (40, per Sichtprüfung gefunden) bleibt
    // deutlich darunter. Dieser Test nagelt die Korrektur fest: Der
    // Kameraabstand zu Saturn darf im Schaubild-Standardpreset einen
    // Bruchteil von Saturns eigenem komprimiertem Sonnenabstand nicht
    // überschreiten — sonst wiederholt sich genau dieser Rückfall.
    const iapetus = SCENES.find((x) => x.id === 'iapetus-schief')!;
    const preset = SCALE_PRESETS.schaubild;
    const saturnHelioKm = (() => {
      const p = positionAt('saturn', bodyIndex, J2000);
      return Math.hypot(p.x, p.y, p.z);
    })();
    const saturnHelioKomprimiert = compressDistance(saturnHelioKm, preset.distanceExponent);
    const saturnRadiusSkaliert = scaledRadius(bodyIndex['saturn']!, preset);
    const kameraAbstandMax =
      iapetus.params.distanceInRadii * iapetus.variation.distanceFactor[1] * saturnRadiusSkaliert;
    // Schranke 40 %: komfortabel über dem tatsächlichen Wert (rund 31 %
    // bei distanceInRadii 40), aber weit unter dem gemessenen 143-%-
    // Fehlschlag von distanceInRadii 185 — ein Rückfall auf diese
    // Größenordnung liefe rot durch.
    expect(kameraAbstandMax).toBeLessThan(0.4 * saturnHelioKomprimiert);
  });

  it('hält Ceres-Gürtel unter Strobe-Schwellen bei der Eigenrotation', () => {
    const s = SCENES.find((x) => x.id === 'ceres-guertel')!;
    // 9,074170 h Rotationsperiode (zwergplaneten.ts); mehr als eine
    // Umdrehung pro Bildsekunde strobt auf einem bildfüllenden Körper.
    const rotationenProSekunde = (s.timeRateDaysPerSec * 24) / 9.074170;
    expect(rotationenProSekunde).toBeLessThan(1);
  });

  it('hält Mondszenen ohne verlässliches lookAt beim direkten Blick auf den Mond', () => {
    // titan-dunst und enceladus-hell zielen absichtlich ohne lookAtId auf
    // den Mond selbst (siehe deren Szenen-Kommentare: ein lookAt auf den
    // Mutterkörper hält den jeweils anderen Körper nicht zuverlässig im
    // Bild) — bislang ungeprüft.
    for (const id of ['titan-dunst', 'enceladus-hell']) {
      const s = SCENES.find((x) => x.id === id)!;
      expect(s.lookAtId, id).toBeUndefined();
    }
  });

  it('hält den Phobos-Tiefflug innerhalb der Marsbahn des Mondes', () => {
    const s = SCENES.find((x) => x.id === 'phobos-tiefflug')!;
    expect(s.targetId).toBe('phobos');
    // Abstand in Phobos-Radien; bei mehr als dem Zehnfachen wäre es kein
    // Tiefflug mehr, sondern eine Totale.
    expect(s.params.distanceInRadii * s.variation.distanceFactor[1]).toBeLessThan(10);
  });

  it('zeigt im Galileischen Schattenspiel genug Zeit für einen Io-Umlauf', () => {
    const s = SCENES.find((x) => x.id === 'galileisches-schattenspiel')!;
    // Io braucht 1,769 Tage; die Szene muss mindestens einen Umlauf zeigen.
    expect(s.durationSec * s.timeRateDaysPerSec).toBeGreaterThan(1.8);
  });

  it('lässt den Ringdurchflug gegen die Sonne laufen', () => {
    const s = SCENES.find((x) => x.id === 'ringdurchflug')!;
    expect(s.path).toBe('flyby');
    expect(s.lookAtId ?? s.targetId).toBe('saturn');
  });
});
