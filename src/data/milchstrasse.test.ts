import { describe, expect, it } from 'vitest';
import { MILCHSTRASSE_STUFEN } from './milchstrasse';

describe('MILCHSTRASSE_STUFEN', () => {
  it('führt 1k, 2k und 8k aufsteigend unter textures/milchstrasse/', () => {
    expect(MILCHSTRASSE_STUFEN.map((s) => s.breite)).toEqual([1024, 2048, 8192]);
    for (const s of MILCHSTRASSE_STUFEN) {
      expect(s.pfad).toBe(`textures/milchstrasse/himmel-${s.breite}.ktx2`);
    }
  });

  it('jede Stufe liegt ausgeliefert in public/', async () => {
    // @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration (wie in src/data/index.test.ts).
    const { existsSync } = await import('node:fs');
    for (const s of MILCHSTRASSE_STUFEN) expect(existsSync(`public/${s.pfad}`)).toBe(true);
  });
});
