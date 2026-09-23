import { describe, it, expect } from 'vitest';
import css from '../../index.css?raw';
import { GROB_ABFRAGE, SCHMAL_ABFRAGE } from './konstanten';

describe('Medienabfragen und ihre Zwillinge in src/index.css', () => {
  it('Kompaktmodus: Breite unter 900 px oder Höhe unter 500 px', () => {
    expect(SCHMAL_ABFRAGE).toBe('(max-width: 899px), (max-height: 499px)');
    expect(css).toContain(`@media ${SCHMAL_ABFRAGE}`);
  });

  it('grober Zeiger', () => {
    expect(css).toContain(`@media ${GROB_ABFRAGE}`);
  });
});
