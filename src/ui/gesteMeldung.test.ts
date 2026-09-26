import { describe, it, expect, vi } from 'vitest';
import { gesteHinweisAbonnieren, gesteHinweisMelden, istMac } from './gesteMeldung';

describe('gesteHinweisMelden/gesteHinweisAbonnieren', () => {
  it('meldet abonnierten Hörern die Art und lässt sich abbestellen', () => {
    const hoerer = vi.fn();
    const abbestellen = gesteHinweisAbonnieren(hoerer);
    gesteHinweisMelden('rad');
    expect(hoerer).toHaveBeenCalledWith('rad');
    abbestellen();
    gesteHinweisMelden('touch');
    expect(hoerer).toHaveBeenCalledTimes(1);
  });
});

describe('istMac', () => {
  it('erkennt Mac über userAgentData.platform', () => {
    expect(istMac({ userAgentData: { platform: 'macOS' } })).toBe(true);
  });

  it('fällt auf platform zurück, wenn userAgentData fehlt', () => {
    expect(istMac({ platform: 'MacIntel' })).toBe(true);
    expect(istMac({ platform: 'Win32' })).toBe(false);
  });

  it('fällt zuletzt auf userAgent zurück', () => {
    expect(istMac({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)' })).toBe(true);
    expect(istMac({ userAgent: 'Mozilla/5.0 (Windows NT 10.0)' })).toBe(false);
  });

  it('ist ohne jede Angabe kein Mac', () => {
    expect(istMac({})).toBe(false);
  });
});
