// @vitest-environment jsdom
import {
  describe, it, expect, beforeEach, vi,
} from 'vitest';
import * as THREE from 'three';
import {
  apparentRadiusPixels, needsMarker, MARKER_MIN_PIXEL, zeigeLabel, LABEL_MIN_PIXEL_MOND,
  createLabelOverlay, projectToScreen,
} from './labels';
import type { LabelEintrag } from './labels';

describe('apparentRadiusPixels', () => {
  it('halbiert sich bei doppeltem Abstand', () => {
    const nah = apparentRadiusPixels(1, 100, 50, 1080);
    const fern = apparentRadiusPixels(1, 200, 50, 1080);
    expect(fern).toBeCloseTo(nah / 2, 3);
  });

  it('wächst mit der Fensterhöhe', () => {
    expect(apparentRadiusPixels(1, 100, 50, 2160))
      .toBeGreaterThan(apparentRadiusPixels(1, 100, 50, 1080));
  });

  it('macht einen entfernten Mond unsichtbar klein', () => {
    // Erdmond (1737 km) aus 5 AE Entfernung, in Render-Einheiten
    const radius = 1.737;
    const abstand = 5 * 149_597_870.7 / 1000;
    expect(apparentRadiusPixels(radius, abstand, 50, 1080)).toBeLessThan(1);
  });

  it('bleibt bei Abstand null endlich', () => {
    expect(Number.isFinite(apparentRadiusPixels(1, 0, 50, 1080))).toBe(true);
  });
});

describe('needsMarker', () => {
  it('greift unterhalb der Schwelle', () => {
    expect(needsMarker(MARKER_MIN_PIXEL - 0.1)).toBe(true);
    expect(needsMarker(0)).toBe(true);
  });

  it('greift oberhalb der Schwelle nicht', () => {
    expect(needsMarker(MARKER_MIN_PIXEL + 0.1)).toBe(false);
    expect(needsMarker(500)).toBe(false);
  });
});

describe('zeigeLabel', () => {
  it('beschriftet Planeten unabhängig von ihrer Größe', () => {
    expect(zeigeLabel(0.1, false)).toBe(true);
  });

  it('beschriftet einen Mond erst ab der Schwelle', () => {
    expect(zeigeLabel(LABEL_MIN_PIXEL_MOND - 0.1, true)).toBe(false);
    expect(zeigeLabel(LABEL_MIN_PIXEL_MOND + 0.1, true)).toBe(true);
  });

  it('hält die Mondschwelle über der Markerschwelle', () => {
    // Sonst stünden in der Systemschau 20 Mondlabels übereinander — genau
    // der Zustand, den die Schwelle verhindern soll.
    expect(LABEL_MIN_PIXEL_MOND).toBeGreaterThan(MARKER_MIN_PIXEL);
  });
});

describe('createLabelOverlay — Rang vor Tiefe (Flackern bei Mondüberlappung)', () => {
  // Gemeinsame Kamera für alle Fälle: FOV und Clipping wie in renderer.ts
  // (siehe dortige PerspectiveCamera(50, ..., 0.001, 1e12)), Kamera im
  // Ursprung mit Standardausrichtung (Blick entlang -Z) — genau die
  // Konvention, in der scene.ts renderPos an das Overlay übergibt.
  const FOV = 50;
  const BREITE = 1000;
  const HOEHE = 1000;

  function testKamera(): THREE.PerspectiveCamera {
    const kamera = new THREE.PerspectiveCamera(FOV, BREITE / HOEHE, 0.001, 1e12);
    kamera.position.set(0, 0, 0);
    kamera.updateProjectionMatrix();
    return kamera;
  }

  /**
   * radiusUnits, damit ein Körper in `abstand` Render-Einheiten genau
   * `radiusPixelZiel` Bildschirmpixel misst — Umkehrung von
   * apparentRadiusPixels, damit die Testkörper einen gewünschten Wert
   * relativ zu MARKER_MIN_PIXEL/LABEL_MIN_PIXEL_MOND treffen, statt ihn zu
   * behaupten.
   */
  function radiusFuer(radiusPixelZiel: number, abstand: number): number {
    const sichtbareHoehe = 2 * Math.tan((FOV * Math.PI / 180) / 2) * abstand;
    return (radiusPixelZiel * sichtbareHoehe) / HOEHE;
  }

  /** Baut einen Kandidaten, der direkt vor der Kamera auf der Blickachse
   * steht (x = y = 0) — alle so gebauten Körper projizieren exakt auf
   * denselben Bildschirmpunkt (Bildmitte) und überlappen sich damit
   * garantiert, unabhängig von den konkreten Pixelwerten. */
  function koerper(
    id: string, nameKey: string, istMond: boolean, abstand: number, radiusPixelZiel: number,
  ): LabelEintrag {
    return {
      id,
      nameKey,
      farbe: '#ffffff',
      renderPos: { x: 0, y: 0, z: -abstand },
      radiusUnits: radiusFuer(radiusPixelZiel, abstand),
      sichtbar: true,
      istMond,
    };
  }

  /**
   * Namenstabelle für den Auflöser — von den einzelnen Tests umgesetzt.
   * createLabelOverlay bekommt den Auflöser einmalig beim Aufbau, liest
   * `namen` also erst bei jedem `hole()`/Neubeschriften-Durchlauf aus.
   * Vor jedem Test auf die Standardtabelle zurückgesetzt, damit einzelne
   * Tests (etwa der Sprachwechsel) sie gefahrlos überschreiben können.
   */
  let namen: Record<string, string>;
  beforeEach(() => {
    namen = { 'body.jupiter.name': 'Jupiter', 'body.io.name': 'Io', 'body.europa.name': 'Europa' };
  });

  /** Baut das Overlay in einem DOM-Container auf und erzwingt eine feste
   * Größe — jsdom layoutet nicht wirklich, `clientWidth`/`clientHeight`
   * blieben sonst 0 und apparentRadiusPixels läge dann immer bei 0. */
  function baueOverlay() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const overlay = createLabelOverlay(container, (key) => namen[key] ?? key);
    const wurzel = container.querySelector('.label-overlay') as HTMLElement;
    Object.defineProperty(wurzel, 'clientWidth', { value: BREITE, configurable: true });
    Object.defineProperty(wurzel, 'clientHeight', { value: HOEHE, configurable: true });
    return { overlay, container };
  }

  function wrapperVon(container: HTMLElement, angezeigterName: string): HTMLElement | undefined {
    return Array.from(container.querySelectorAll<HTMLElement>('.koerper-label'))
      .find((w) => w.querySelector('.koerper-name')?.textContent === angezeigterName);
  }

  it(
    'zeigt das Planetenlabel, wenn ein näherer, überlappender Mond ebenfalls ein Label will '
    + '(der gemeldete Fall: Mond zieht vor dem Planeten durch dessen Beschriftung)',
    () => {
      // Jupiter: 1000 Einheiten entfernt, 100 Pixel groß — weit über jeder
      // Schwelle, zeigt sicher Text.
      const jupiter = koerper('jupiter', 'body.jupiter.name', false, 1000, 100);
      // Io: NÄHER als Jupiter (500 < 1000, also kleinere/vordere Tiefe) und
      // mit 50 Pixeln ebenfalls klar über LABEL_MIN_PIXEL_MOND (8) — Io
      // würde bei reiner Tiefensortierung zuerst verarbeitet und Jupiters
      // Platz belegen. Genau dieser Fall soll jetzt nicht mehr passieren.
      const io = koerper('io', 'body.io.name', true, 500, 50);

      const { overlay, container } = baueOverlay();
      const kamera = testKamera();
      // Reihenfolge im Eingabe-Array bewusst Mond-vor-Planet: Die Sortierung
      // im Overlay muss das Ergebnis bestimmen, nicht die Eingabereihenfolge.
      overlay.update([io, jupiter], kamera, true, true, 'de');

      const jupiterKnoten = wrapperVon(container, 'Jupiter');
      expect(jupiterKnoten).toBeTruthy();
      expect(jupiterKnoten?.hidden).toBe(false);
      expect(jupiterKnoten?.querySelector<HTMLElement>('.koerper-name')?.hidden).toBe(false);

      // Io hat in diesem Frame nie einen Platz bekommen — es existiert für
      // Io deshalb noch gar kein DOM-Knoten (hole() wird erst nach der
      // Kollisionsprüfung aufgerufen).
      expect(wrapperVon(container, 'Io')).toBeUndefined();
    },
  );

  it('lässt innerhalb desselben Rangs weiterhin den vorderen Körper gewinnen (Mond gegen Mond)', () => {
    // Beide Monde, beide mit vollem Textlabel (50 Pixel, über der
    // Mondschwelle) — Io ist näher (500 < 800) und muss wie bisher gewinnen.
    const io = koerper('io', 'body.io.name', true, 500, 50);
    const europa = koerper('europa', 'body.europa.name', true, 800, 50);

    const { overlay, container } = baueOverlay();
    overlay.update([europa, io], testKamera(), true, true, 'de');

    const ioKnoten = wrapperVon(container, 'Io');
    expect(ioKnoten).toBeTruthy();
    expect(ioKnoten?.querySelector<HTMLElement>('.koerper-name')?.hidden).toBe(false);
    expect(wrapperVon(container, 'Europa')).toBeUndefined();
  });

  it('lässt eine bloße Mond-Glyphe keine Beschriftung eines anderen Körpers verdrängen', () => {
    // Io zeigt nur eine Glyphe (1 Pixel, unter MARKER_MIN_PIXEL 3 und weit
    // unter der Textschwelle), Europa zeigt volles Text-Label (50 Pixel) —
    // beide am selben Bildpunkt. Io ist näher und würde bei ungefilterter
    // Kollisionsprüfung trotzdem zuerst platziert.
    const io = koerper('io', 'body.io.name', true, 500, 1);
    const europa = koerper('europa', 'body.europa.name', true, 800, 50);

    const { overlay, container } = baueOverlay();
    overlay.update([io, europa], testKamera(), true, true, 'de');

    const ioKnoten = wrapperVon(container, 'Io');
    const europaKnoten = wrapperVon(container, 'Europa');
    expect(ioKnoten).toBeTruthy();
    expect(ioKnoten?.querySelector<HTMLElement>('.koerper-glyphe')?.hidden).toBe(false);
    expect(ioKnoten?.querySelector<HTMLElement>('.koerper-name')?.hidden).toBe(true);
    // Europas Textlabel bleibt trotz der näheren, überlappenden Io-Glyphe
    // sichtbar.
    expect(europaKnoten).toBeTruthy();
    expect(europaKnoten?.querySelector<HTMLElement>('.koerper-name')?.hidden).toBe(false);
  });

  it('lässt zwei bloße Glyphen weiterhin gegenseitig ausweichen', () => {
    // Beide unter MARKER_MIN_PIXEL, beide ohne Text (unter der
    // Mondschwelle) — Io ist näher und muss wie bisher gewinnen.
    const io = koerper('io', 'body.io.name', true, 500, 1);
    const europa = koerper('europa', 'body.europa.name', true, 800, 1);

    const { overlay, container } = baueOverlay();
    overlay.update([europa, io], testKamera(), true, true, 'de');

    const ioKnoten = wrapperVon(container, 'Io');
    expect(ioKnoten).toBeTruthy();
    expect(ioKnoten?.querySelector<HTMLElement>('.koerper-glyphe')?.hidden).toBe(false);
    // Europa hat keinen Platz bekommen — kein DOM-Knoten für sie.
    expect(wrapperVon(container, 'Europa')).toBeUndefined();
  });

  it('beschriftet vorhandene Einträge neu, wenn sich die Sprache ändert', () => {
    namen = { 'body.moon.name': 'Mond' };
    const { overlay, container } = baueOverlay();
    const kamera = testKamera();
    const eintraege = [koerper('moon', 'body.moon.name', false, 10, 20)];
    overlay.update(eintraege, kamera, true, true, 'de');
    expect(wrapperVon(container, 'Mond')).toBeDefined();

    namen = { 'body.moon.name': 'Moon' };
    // Gleiche Sprache: kein Neubeschriften, der Auflöser wird nicht befragt.
    overlay.update(eintraege, kamera, true, true, 'de');
    expect(wrapperVon(container, 'Mond')).toBeDefined();

    overlay.update(eintraege, kamera, true, true, 'en');
    expect(wrapperVon(container, 'Moon')).toBeDefined();
    expect(wrapperVon(container, 'Mond')).toBeUndefined();
  });

  it('zeigt den Namen eines hervorgehobenen Mondes unter der Schwelle, auch ohne Beschriftungen', () => {
    const io = koerper('io', 'body.io.name', true, 1000, 2);
    const { overlay, container } = baueOverlay();
    overlay.update([io], testKamera(), false, false, 'de', 'io');
    const w = wrapperVon(container, 'Io');
    expect(w?.hidden).toBe(false);
    expect(w?.querySelector<HTMLElement>('.koerper-name')?.hidden).toBe(false);
    expect(w?.classList.contains('hervorgehoben')).toBe(true);
    overlay.update([io], testKamera(), false, false, 'de', null);
    expect(wrapperVon(container, 'Io')?.hidden).toBe(true);
  });

  it('setzt den hervorgehobenen Mond vor den überlappenden Planeten', () => {
    const jupiter = koerper('jupiter', 'body.jupiter.name', false, 1000, 100);
    const io = koerper('io', 'body.io.name', true, 500, 50);
    const { overlay, container } = baueOverlay();
    overlay.update([jupiter, io], testKamera(), true, true, 'de', 'io');
    expect(wrapperVon(container, 'Io')?.querySelector<HTMLElement>('.koerper-name')?.hidden).toBe(false);
    expect(wrapperVon(container, 'Jupiter')?.hidden ?? true).toBe(true);
  });

  it('liefert Namensrechtecke aus Ankerpunkt und einmal gemessenem Versatz', () => {
    const rechteck = (left: number, top: number, width: number, height: number) =>
      ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;
    const kamera = testKamera();
    const jupiter = koerper('jupiter', 'body.jupiter.name', false, 1000, 100);
    const p0 = projectToScreen(jupiter.renderPos, kamera, BREITE, HOEHE)!;
    const spion = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('koerper-name') ? rechteck(p0.x + 12, p0.y - 8, 40, 14) : rechteck(0, 0, BREITE, HOEHE);
    });
    const { overlay } = baueOverlay();
    overlay.update([jupiter], kamera, true, true, 'de');
    const [r] = overlay.namensRechtecke();
    expect(r!.id).toBe('jupiter');
    expect(r!.links).toBeCloseTo(p0.x + 12, 9);
    expect(r!.oben).toBeCloseTo(p0.y - 8, 9);
    expect(r!.rechts).toBeCloseTo(p0.x + 52, 9);
    expect(r!.unten).toBeCloseTo(p0.y + 6, 9);

    const messungen = spion.mock.calls.length;
    const verschoben = { ...jupiter, renderPos: { x: 100, y: 0, z: -1000 } };
    overlay.update([verschoben], kamera, true, true, 'de');
    const p1 = projectToScreen(verschoben.renderPos, kamera, BREITE, HOEHE)!;
    expect(overlay.namensRechtecke()[0]!.links).toBeCloseTo(p1.x + 12, 9);
    expect(spion.mock.calls.length).toBe(messungen);

    namen['body.jupiter.name'] = 'Jupiter (EN)';
    overlay.update([verschoben], kamera, true, true, 'en');
    expect(spion.mock.calls.length).toBeGreaterThan(messungen);
    spion.mockRestore();
  });

  it('liefert Trefferscheiben sichtbarer Körper, mit Glyphe mindestens MARKER_MIN_PIXEL', () => {
    const io = koerper('io', 'body.io.name', true, 1000, 1);
    const jupiter = { ...koerper('jupiter', 'body.jupiter.name', false, 2000, 60), sichtbar: false };
    const { overlay } = baueOverlay();
    overlay.update([io, jupiter], testKamera(), true, true, 'de');
    const scheiben = overlay.trefferScheiben();
    expect(scheiben.map((s) => s.id)).toEqual(['io']);
    expect(scheiben[0]!.radiusPx).toBe(MARKER_MIN_PIXEL);
    expect(scheiben[0]!.istMond).toBe(true);
    expect(scheiben[0]!.glyphe).toBe(true);

    // Ohne Marker wird der Radius nicht angehoben: keine Glyphenscheibe.
    overlay.update([io], testKamera(), true, false, 'de');
    const ohneMarker = overlay.trefferScheiben();
    expect(ohneMarker[0]!.radiusPx).toBeCloseTo(1, 6);
    expect(ohneMarker[0]!.glyphe).toBe(false);
  });

  it('misst den Namensversatz erneut, wenn ein sichtbarer Körper zwischen echter Kugel und Ersatzglyphe wechselt', () => {
    // Ein Planet zeigt seinen Namen unabhängig von seiner Größe (zeigeLabel).
    // Bei 1 Pixel liegt er unter MARKER_MIN_PIXEL (3) — ob er trotzdem eine
    // Ersatzglyphe neben dem Namen bekommt, hängt hier allein vom Schalter
    // zeigeMarker ab; Text und Sprache bleiben in beiden Aufrufen gleich.
    const klein = koerper('jupiter', 'body.jupiter.name', false, 1000, 1);
    const { overlay } = baueOverlay();
    const kamera = testKamera();
    const spion = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');

    overlay.update([klein], kamera, true, false, 'de');
    const nachErstem = spion.mock.calls.length;
    expect(nachErstem).toBeGreaterThan(0);

    // Gleicher Zustand erneut: keine neue Messung.
    overlay.update([klein], kamera, true, false, 'de');
    expect(spion.mock.calls.length).toBe(nachErstem);

    // Jetzt mit Ersatzglyphe — der Glyphenzustand wechselt, obwohl Text und
    // Sprache unverändert bleiben: Der abgelegte Versatz gilt nicht mehr.
    overlay.update([klein], kamera, true, true, 'de');
    expect(spion.mock.calls.length).toBeGreaterThan(nachErstem);
    spion.mockRestore();
  });

  it('liefert namensRechtecke nur für Körper mit gezeigtem Namen', () => {
    // Europa bleibt unter der Mondschwelle (8 px) und zeigt deshalb keinen
    // Namen, ist aber sichtbar und groß genug für eine echte Trefferscheibe
    // (über MARKER_MIN_PIXEL) — sie gehört in trefferScheiben(), aber nicht
    // in namensRechtecke().
    const europa = koerper('europa', 'body.europa.name', true, 1000, 5);
    const { overlay } = baueOverlay();
    overlay.update([europa], testKamera(), true, true, 'de');
    expect(overlay.trefferScheiben().map((s) => s.id)).toEqual(['europa']);
    expect(overlay.trefferScheiben()[0]!.glyphe).toBe(false);
    expect(overlay.namensRechtecke()).toEqual([]);
  });
});
