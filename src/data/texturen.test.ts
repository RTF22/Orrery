import { describe, expect, it } from 'vitest';
import { TEXTUREN } from './texturen';
import { bodyIndex } from './index';
import fixture from '../render/__fixtures__/textur-mittel.json';

const ERWARTETE_STUFEN: Record<string, number[]> = {
  mercury: [1024, 2048, 8192], venus: [1024, 2048, 8192], earth: [1024, 2048, 8192],
  mars: [1024, 2048, 8192], moon: [1024, 2048, 8192],
  sun: [1024, 2048, 4096], jupiter: [1024, 2048, 4096], saturn: [1024, 2048, 4096],
  uranus: [1024, 2048], neptune: [1024, 2048],
};
const soll = fixture.mittel as Record<string, number>;

describe('TEXTUREN', () => {
  it('führt genau die 29 Körper mit Sollmittel, jeden im Katalog', () => {
    const ids = Object.keys(TEXTUREN).sort();
    const ausFixture = Object.keys(soll).map((k) => k.split('/')[1]!).sort();
    expect(ids).toEqual(ausFixture);
    expect(ids).toHaveLength(29);
    for (const id of ids) expect(bodyIndex[id], id).toBeDefined();
  });

  it('hat die Stufen aus dem Entwurf §5.1', () => {
    for (const [id, stufen] of Object.entries(TEXTUREN)) {
      expect(stufen.map((s) => s.breite), id).toEqual(ERWARTETE_STUFEN[id] ?? [1024]);
    }
  });

  it('legt jede Stufe unter textures/<koerper>/albedo-<breite>.ktx2 ab, und die Datei existiert', async () => {
    // @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration (wie in src/data/index.test.ts).
    const { existsSync } = await import('node:fs');
    for (const [id, stufen] of Object.entries(TEXTUREN)) {
      for (const s of stufen) {
        expect(s.pfad).toBe(`textures/${id}/albedo-${s.breite}.ktx2`);
        expect(existsSync(`public/${s.pfad}`), s.pfad).toBe(true);
      }
    }
  });

  it('weicht in keiner Stufe mehr als 0,005 vom fachgeprüften Mittel ab', () => {
    for (const [id, stufen] of Object.entries(TEXTUREN)) {
      for (const s of stufen) {
        expect(Math.abs(s.mittel - soll[`textures/${id}/albedo.jpg`]!), `${id} ${s.breite}`)
          .toBeLessThanOrEqual(0.005 + 1e-9);
      }
    }
  });

  it('bleibt mit allen 1k-Stufen zusammen unter 4 MB', async () => {
    // @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration (wie in src/data/index.test.ts).
    const { statSync } = await import('node:fs');
    let summe = 0;
    for (const stufen of Object.values(TEXTUREN)) summe += statSync(`public/${stufen[0]!.pfad}`).size;
    expect(summe).toBeLessThan(4_000_000);
  });

  it('liefert keine Albedo-JPEGs mehr aus', async () => {
    // @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration (wie in src/data/index.test.ts).
    const { existsSync } = await import('node:fs');
    for (const id of Object.keys(TEXTUREN)) {
      expect(existsSync(`public/textures/${id}/albedo.jpg`), id).toBe(false);
    }
  });
});
