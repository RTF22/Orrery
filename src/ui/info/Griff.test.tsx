// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Griff } from './Griff';

const breite = (onWert: (w: number) => void, wert = 24) => (
  <Griff
    richtung="senkrecht" wert={wert} min={18} max={60} schritt={1} label="Breite"
    ausVersatz={(start, dx) => start - dx / 16} onWert={onWert}
  />
);

describe('Griff', () => {
  it('ist ein Trenner mit Wert, Grenzen und Ausrichtung', () => {
    render(breite(() => {}));
    const griff = screen.getByRole('separator', { name: 'Breite' });
    expect(griff.getAttribute('aria-orientation')).toBe('vertical');
    expect(griff.getAttribute('aria-valuenow')).toBe('24');
    expect(griff.getAttribute('aria-valuemin')).toBe('18');
    expect(griff.getAttribute('aria-valuemax')).toBe('60');
    expect(griff.tabIndex).toBe(0);
  });

  it('Pfeiltasten ändern den Wert schrittweise innerhalb der Grenzen und schlucken das Ereignis', () => {
    const onWert = vi.fn();
    render(breite(onWert, 59));
    const griff = screen.getByRole('separator');
    const links = fireEvent.keyDown(griff, { key: 'ArrowLeft' });
    expect(links).toBe(false);
    expect(onWert).toHaveBeenLastCalledWith(60);
    fireEvent.keyDown(griff, { key: 'ArrowLeft' });
    expect(onWert).toHaveBeenLastCalledWith(60);
    fireEvent.keyDown(griff, { key: 'ArrowRight' });
    expect(onWert).toHaveBeenLastCalledWith(58);
    fireEvent.keyDown(griff, { key: 'Home' });
    expect(onWert).toHaveBeenLastCalledWith(18);
    fireEvent.keyDown(griff, { key: 'End' });
    expect(onWert).toHaveBeenLastCalledWith(60);
    const fremd = fireEvent.keyDown(griff, { key: 'a' });
    expect(fremd).toBe(true);
  });

  it('Ziehen rechnet den Versatz über ausVersatz um und klemmt an den Grenzen', () => {
    const onWert = vi.fn();
    render(breite(onWert));
    const griff = screen.getByRole('separator');
    fireEvent.pointerDown(griff, { clientX: 400, pointerId: 1, button: 0 });
    fireEvent.pointerMove(griff, { clientX: 368, pointerId: 1 });
    expect(onWert).toHaveBeenLastCalledWith(26);
    fireEvent.pointerMove(griff, { clientX: 2000, pointerId: 1 });
    expect(onWert).toHaveBeenLastCalledWith(18);
    fireEvent.pointerUp(griff, { pointerId: 1 });
    fireEvent.pointerMove(griff, { clientX: 100, pointerId: 1 });
    expect(onWert).toHaveBeenCalledTimes(2);
  });

  it('waagerecht: Pfeil hoch verkleinert, Pfeil runter vergrößert', () => {
    const onWert = vi.fn();
    render(
      <Griff richtung="waagerecht" wert={0.5} min={0.2} max={0.9} schritt={0.05} label="Teilung"
        ausVersatz={(start, dy) => start + dy / 400} onWert={onWert} />,
    );
    const griff = screen.getByRole('separator', { name: 'Teilung' });
    expect(griff.getAttribute('aria-orientation')).toBe('horizontal');
    fireEvent.keyDown(griff, { key: 'ArrowUp' });
    expect(onWert).toHaveBeenLastCalledWith(0.45);
    fireEvent.keyDown(griff, { key: 'ArrowDown' });
    expect(onWert).toHaveBeenLastCalledWith(0.55);
    fireEvent.pointerDown(griff, { clientY: 300, pointerId: 2, button: 0 });
    fireEvent.pointerMove(griff, { clientY: 340, pointerId: 2 });
    expect(onWert).toHaveBeenLastCalledWith(0.6);
  });
});
