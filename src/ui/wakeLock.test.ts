// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestWakeLock, releaseWakeLock } from './wakeLock';

const sentinel = { released: false, release: vi.fn(async () => {}), addEventListener: vi.fn() };

beforeEach(async () => {
  await releaseWakeLock();
  sentinel.release.mockClear();
  Object.defineProperty(navigator, 'wakeLock', {
    configurable: true,
    value: { request: vi.fn(async () => sentinel) },
  });
});

describe('Wake Lock', () => {
  it('fordert genau eine Sperre an', async () => {
    await requestWakeLock();
    await requestWakeLock();
    expect((navigator as unknown as { wakeLock: { request: ReturnType<typeof vi.fn> } })
      .wakeLock.request).toHaveBeenCalledTimes(1);
    await releaseWakeLock();
  });

  it('gibt die Sperre wieder frei', async () => {
    await requestWakeLock();
    await releaseWakeLock();
    expect(sentinel.release).toHaveBeenCalledTimes(1);
  });

  it('gibt eine Sperre frei, die erst nach der Freigabe ankommt', async () => {
    // Kino an und sofort wieder aus: Die Anfrage läuft noch, als die Freigabe kommt.
    const anfrage = requestWakeLock();
    const freigabe = releaseWakeLock();
    await Promise.all([anfrage, freigabe]);
    expect(sentinel.release).toHaveBeenCalledTimes(1);
  });

  it('stellt bei an, aus, an keine zweite Anfrage und behält die Sperre', async () => {
    // So ruft StrictMode den Effekt auf: anfordern, aufräumen, erneut anfordern.
    const erste = requestWakeLock();
    const freigabe = releaseWakeLock();
    const zweite = requestWakeLock();
    await Promise.all([erste, freigabe, zweite]);
    expect((navigator as unknown as { wakeLock: { request: ReturnType<typeof vi.fn> } })
      .wakeLock.request).toHaveBeenCalledTimes(1);
    expect(sentinel.release).not.toHaveBeenCalled();
    await releaseWakeLock();
    expect(sentinel.release).toHaveBeenCalledTimes(1);
  });

  it('läuft ohne Unterstützung im Browser einfach weiter', async () => {
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: undefined });
    // Kein Werfen: Der Kino-Modus funktioniert auch ohne Wake Lock, der
    // Bildschirm geht dann eben irgendwann aus.
    await expect(requestWakeLock()).resolves.toBeUndefined();
    await expect(releaseWakeLock()).resolves.toBeUndefined();
  });
});

describe('Wake Lock nach einer Ablehnung', () => {
  it('fragt nach einer verweigerten Anfrage beim nächsten Mal erneut', async () => {
    const request = vi.fn()
      .mockImplementationOnce(() => { throw new Error('verweigert'); })
      .mockImplementation(async () => sentinel);
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request } });
    await requestWakeLock();
    await requestWakeLock();
    expect(request).toHaveBeenCalledTimes(2);
    await releaseWakeLock();
    expect(sentinel.release).toHaveBeenCalledTimes(1);
  });
});
