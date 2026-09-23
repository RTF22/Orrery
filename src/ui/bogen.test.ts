import { describe, it, expect, beforeEach } from 'vitest';
import { useBogen } from './bogen';

beforeEach(() => { useBogen.getState().setBogen(null); });

describe('useBogen (Entwurf Phase 5 §4.1)', () => {
  it('startet ohne offenen Bogen', () => {
    expect(useBogen.getState().bogen).toBeNull();
  });

  it('kippen öffnet einen Bogen und schließt ihn beim zweiten Mal', () => {
    useBogen.getState().kippen('info');
    expect(useBogen.getState().bogen).toBe('info');
    useBogen.getState().kippen('info');
    expect(useBogen.getState().bogen).toBeNull();
  });

  it('kippen auf den anderen Bogen ersetzt den offenen — nie zwei gleichzeitig', () => {
    useBogen.getState().kippen('bedienung');
    useBogen.getState().kippen('info');
    expect(useBogen.getState().bogen).toBe('info');
  });
});
