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
    // musik/ ist git-ignoriert und gehört dem Betreiber (README „Eigene Musik").
    const erlaubt = new Set(['.htaccess', 'basis', 'textures', 'musik']);
    expect(readdirSync('public').filter((name) => !erlaubt.has(name))).toEqual([]);
  });
});
