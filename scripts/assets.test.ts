import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';

const assets = readFileSync('ASSETS.md', 'utf8');

describe('ASSETS.md', () => {
  it('nennt jeden ausgelieferten Texturordner', () => {
    const fehlend = readdirSync('public/textures').filter(
      (koerper) => !new RegExp(`(texturen|textures)/${koerper}/`).test(assets),
    );
    expect(fehlend).toEqual([]);
  });

  it('nennt den Basis-Transcoder mit seiner Lizenz', () => {
    expect(assets).toContain('public/basis/basis_transcoder.wasm');
    expect(assets).toContain('Apache License 2.0');
  });

  it('stellt klar, dass Orrery keine Musik mitliefert', () => {
    expect(assets).toMatch(/^## Musik$/m);
    expect(assets).toContain('public/musik/');
  });
});

describe('public/', () => {
  it('enthält nur belegte Ordner und die Serverkonfiguration', () => {
    // musik/ ist git-ignoriert und gehört dem Betreiber (docs/entwicklung.md „Eigene Musik").
    // robots.txt und favicon.ico kommen statisch mit (orrery3d.de liefert für fehlende
    // Dateien 500 statt 404, siehe scripts/app-symbol.py und docs/entwicklung.md).
    // Die google….html weist den Besitz der Domain für die Google Search Console nach.
    const erlaubt = new Set([
      '.htaccess',
      'basis',
      'textures',
      'musik',
      'symbole',
      'manifest.webmanifest',
      'robots.txt',
      'favicon.ico',
      'google73a5c7151f277813.html',
    ]);
    expect(readdirSync('public').filter((name) => !erlaubt.has(name))).toEqual([]);
  });
});

/** Breite und Höhe aus dem IHDR-Block einer PNG-Datei (Bytes 16–23, big-endian). */
function pngMasse(pfad: string): [number, number] {
  const daten = readFileSync(pfad);
  return [daten.readUInt32BE(16), daten.readUInt32BE(20)];
}

describe('Web-App', () => {
  const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8')) as {
    name: string; short_name: string; start_url: string; scope: string; display: string;
    icons: { src: string; sizes: string; type: string; purpose?: string }[];
  };

  it('startet im Vollbild innerhalb der eigenen Basis', () => {
    expect(manifest.display).toBe('fullscreen');
    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
    expect(manifest.short_name).toBe('Orrery');
  });

  it('führt Symbole in 192 und 512 Pixeln, die es gibt und die so groß sind', () => {
    for (const groesse of [192, 512]) {
      const symbol = manifest.icons.find((i) => i.sizes === `${groesse}x${groesse}`);
      expect(symbol?.type).toBe('image/png');
      expect(pngMasse(`public/${symbol!.src}`)).toEqual([groesse, groesse]);
    }
  });

  it('ist in index.html verlinkt und hat einen MIME-Typ auf dem Server', () => {
    expect(readFileSync('index.html', 'utf8')).toContain('<link rel="manifest" href="/manifest.webmanifest"');
    expect(readFileSync('public/.htaccess', 'utf8')).toContain('AddType application/manifest+json .webmanifest');
  });

  it('führt für jede Größe ein maskierbares Symbol', () => {
    for (const groesse of [192, 512]) {
      const symbol = manifest.icons.find(
        (i) => i.sizes === `${groesse}x${groesse}` && i.purpose === 'maskable',
      );
      expect(symbol).toBeDefined();
    }
  });
});
