// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { eingebettetErkennen } from './einbettung';

describe('eingebettetErkennen', () => {
  it('gleiches Fenster (self === top): nicht eingebettet', () => {
    const fenster = {};
    expect(eingebettetErkennen({ self: fenster, top: fenster })).toBe(false);
  });

  it('anderes Fenster (self !== top): eingebettet', () => {
    expect(eingebettetErkennen({ self: {}, top: {} })).toBe(true);
  });

  it('wirft der Zugriff auf top (Sandbox ohne allow-same-origin), gilt das als eingebettet', () => {
    const fenster = {
      self: {},
      get top(): unknown { throw new Error('SecurityError'); },
    };
    expect(eingebettetErkennen(fenster)).toBe(true);
  });

  it('echtes window im Testlauf (jsdom, kein iframe): nicht eingebettet', () => {
    expect(eingebettetErkennen(window)).toBe(false);
  });
});
