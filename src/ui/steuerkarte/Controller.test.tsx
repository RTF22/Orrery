// @vitest-environment jsdom
import { describe, expect, it, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ControllerBild, BESCHRIFTUNGEN } from './Controller';
import { setSprache } from '../i18n';

describe('ControllerBild', () => {
  afterEach(() => { setSprache('de'); });

  it('beschriftet vierzehn Bedienelemente links und rechts', () => {
    expect(BESCHRIFTUNGEN).toHaveLength(14);
    expect(BESCHRIFTUNGEN.filter((b) => b.seite === 'links')).toHaveLength(7);
    expect(BESCHRIFTUNGEN.filter((b) => b.seite === 'rechts')).toHaveLength(7);
  });

  it('zeichnet die Grafik für Screenreader verborgen und liefert die Belegung als Liste', () => {
    const { container } = render(<ControllerBild />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    const liste = screen.getByRole('list');
    expect(liste.querySelectorAll('li')).toHaveLength(14);
    expect(liste.textContent).toContain('A: zum Objekt fahren');
    expect(liste.textContent).toContain('startet den Flug');
  });

  it('übersetzt die Beschriftungen', () => {
    setSprache('en');
    const { container } = render(<ControllerBild />);
    expect(container.querySelector('svg')?.textContent).toContain('RT: fly forwards');
  });
});
