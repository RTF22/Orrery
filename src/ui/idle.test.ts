import { describe, it, expect, vi } from 'vitest';
import { createIdleWatcher, IDLE_HIDE_SEC } from './idle';

describe('createIdleWatcher', () => {
  it('meldet Untätigkeit erst nach der Wartezeit', () => {
    const onIdle = vi.fn(); const onActive = vi.fn(); const onTick = vi.fn();
    const w = createIdleWatcher({ onIdle, onActive, onTick });

    w.handleInput(0);
    w.tick((IDLE_HIDE_SEC - 0.5) * 1000);
    expect(onIdle).not.toHaveBeenCalled();

    w.tick((IDLE_HIDE_SEC + 0.5) * 1000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('meldet Untätigkeit nur einmal je Ruhephase', () => {
    const onIdle = vi.fn();
    const w = createIdleWatcher({ onIdle, onActive: vi.fn(), onTick: vi.fn() });
    w.handleInput(0);
    w.tick(10_000);
    w.tick(20_000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('meldet die Rückkehr zur Aktivität', () => {
    const onActive = vi.fn();
    const w = createIdleWatcher({ onIdle: vi.fn(), onActive, onTick: vi.fn() });
    w.handleInput(0);
    w.tick(10_000);
    w.handleInput(10_100);
    expect(onActive).toHaveBeenCalledTimes(1);
  });

  it('reicht jeden Tick weiter, damit der Kino-Modus wieder anlaufen kann', () => {
    const onTick = vi.fn();
    const w = createIdleWatcher({ onIdle: vi.fn(), onActive: vi.fn(), onTick });
    w.tick(1000);
    w.tick(2000);
    expect(onTick).toHaveBeenNthCalledWith(1, 1000);
    expect(onTick).toHaveBeenNthCalledWith(2, 2000);
  });
});
