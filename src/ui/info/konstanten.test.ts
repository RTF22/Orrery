import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { GROB_ABFRAGE, SCHMAL_ABFRAGE } from './konstanten';

describe('Medienabfragen und ihre Zwillinge in src/index.css', () => {
  const css = readFileSync(new URL('../../index.css', import.meta.url), 'utf8');

  it('Kompaktmodus: Breite unter 900 px oder Höhe unter 500 px', () => {
    expect(SCHMAL_ABFRAGE).toBe('(max-width: 899px), (max-height: 499px)');
    expect(css).toContain(`@media ${SCHMAL_ABFRAGE}`);
  });

  it.todo('grober Zeiger', () => {
    expect(css).toContain(`@media ${GROB_ABFRAGE}`);
  });
});
