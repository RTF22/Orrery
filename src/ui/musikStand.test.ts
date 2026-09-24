import { describe, expect, it } from 'vitest';
import { useMusikStand } from './musikStand';

describe('useMusikStand', () => {
  it('beginnt ohne Musik und ohne laufendes Stück', () => {
    expect(useMusikStand.getState()).toMatchObject({ verfuegbar: false, aktuell: null });
  });
});
