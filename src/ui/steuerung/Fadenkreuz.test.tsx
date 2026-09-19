// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Fadenkreuz } from './Fadenkreuz';
import { kreuzSichtbar, kreuzZeichnen, kreuzZeigen, kreuzZuruecksetzen } from './kreuz';

afterEach(() => { kreuzZuruecksetzen(); });

function zeigerBewegung(art: string): void {
  const e = new MouseEvent('pointermove', { bubbles: true });
  Object.defineProperty(e, 'pointerType', { value: art });
  window.dispatchEvent(e);
}

describe('Fadenkreuz', () => {
  it('hängt ein unsichtbares Element ohne Zeigereingaben ein, das die Steuerung zeichnet', () => {
    const { container } = render(<Fadenkreuz />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.display).toBe('none');
    expect(el.className).toContain('pointer-events-none');
    kreuzZeigen();
    kreuzZeichnen({ breite: 800, hoehe: 600 });
    expect(el.style.display).toBe('block');
  });

  it('blendet bei einer Mausbewegung aus, bei einer Berührung nicht', () => {
    render(<Fadenkreuz />);
    kreuzZeigen();
    zeigerBewegung('touch');
    expect(kreuzSichtbar()).toBe(true);
    zeigerBewegung('mouse');
    expect(kreuzSichtbar()).toBe(false);
  });
});
