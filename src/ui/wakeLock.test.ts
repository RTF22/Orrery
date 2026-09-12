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

  it('läuft ohne Unterstützung im Browser einfach weiter', async () => {
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: undefined });
    // Kein Werfen: Der Kino-Modus funktioniert auch ohne Wake Lock, der
    // Bildschirm geht dann eben irgendwann aus.
    await expect(requestWakeLock()).resolves.toBeUndefined();
    await expect(releaseWakeLock()).resolves.toBeUndefined();
  });
});
