import { describe, expect, it, beforeEach, vi } from 'vitest';
import { installationAbfangen, installieren, useInstallation } from './installation';

function ziel() {
  const hoerer = new Map<string, (e: Event) => void>();
  return {
    addEventListener: (typ: string, f: (e: Event) => void) => { hoerer.set(typ, f); },
    feuere: (typ: string, e: Event) => { hoerer.get(typ)?.(e); },
  };
}

describe('Installation', () => {
  beforeEach(() => { useInstallation.setState({ ereignis: null }); });

  it('fängt beforeinstallprompt ab und unterdrückt die Leiste des Browsers', () => {
    const z = ziel();
    installationAbfangen(z);
    const e = Object.assign(new Event('beforeinstallprompt'), {
      prompt: vi.fn(() => Promise.resolve()),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    });
    const verhindern = vi.spyOn(e, 'preventDefault');
    z.feuere('beforeinstallprompt', e);
    expect(verhindern).toHaveBeenCalled();
    expect(useInstallation.getState().ereignis).toBe(e);
    z.feuere('appinstalled', new Event('appinstalled'));
    expect(useInstallation.getState().ereignis).toBeNull();
  });

  it('installieren ruft prompt genau einmal und vergisst das Ereignis', async () => {
    const prompt = vi.fn(() => Promise.resolve());
    useInstallation.setState({
      ereignis: Object.assign(new Event('beforeinstallprompt'), {
        prompt, userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
      }),
    });
    await installieren();
    await installieren();
    expect(prompt).toHaveBeenCalledOnce();
    expect(useInstallation.getState().ereignis).toBeNull();
  });
});
