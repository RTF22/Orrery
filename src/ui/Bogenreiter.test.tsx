// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Bogenreiter } from './Bogenreiter';
import { useBogen } from './bogen';

afterEach(() => { useBogen.getState().setBogen(null); });

describe('Bogenreiter (Entwurf Phase 5 §4.1)', () => {
  it('hat zwei Reiter, beide zunächst nicht gedrückt', () => {
    render(<Bogenreiter />);
    for (const name of ['Bedienung', 'Info']) {
      expect(screen.getByRole('button', { name }).getAttribute('aria-pressed')).toBe('false');
    }
  });

  it('ein Tipp öffnet, ein zweiter auf denselben Reiter schließt', () => {
    render(<Bogenreiter />);
    fireEvent.click(screen.getByRole('button', { name: 'Bedienung' }));
    expect(useBogen.getState().bogen).toBe('bedienung');
    expect(screen.getByRole('button', { name: 'Bedienung' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Bedienung' }));
    expect(useBogen.getState().bogen).toBeNull();
  });

  it('der andere Reiter ersetzt den offenen Bogen und markiert die Gruppe als offen', () => {
    const { container } = render(<Bogenreiter />);
    fireEvent.click(screen.getByRole('button', { name: 'Bedienung' }));
    fireEvent.click(screen.getByRole('button', { name: 'Info' }));
    expect(useBogen.getState().bogen).toBe('info');
    expect((container.firstElementChild as HTMLElement).getAttribute('data-offen')).toBe('true');
  });
});
