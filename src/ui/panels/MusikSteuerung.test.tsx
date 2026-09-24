// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MusikSteuerung } from './MusikSteuerung';
import { useStore, DEFAULT_STATE } from '../../store';
import { useMusikStand } from '../musikStand';

beforeEach(() => {
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  useMusikStand.setState({ verfuegbar: false, aktuell: null });
});

describe('MusikSteuerung', () => {
  it('zeigt ohne verfügbare Musik nichts', () => {
    const { container } = render(<MusikSteuerung />);
    expect(container.innerHTML).toBe('');
  });

  it('schaltet den Modus um und markiert den gewählten', () => {
    useMusikStand.setState({ verfuegbar: true });
    render(<MusikSteuerung />);
    expect(screen.getByRole('button', { name: 'Nur Kino' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Immer' }));
    expect(useStore.getState().ton.modus).toBe('immer');
    expect(screen.getByRole('button', { name: 'Immer' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Aus' }));
    expect(useStore.getState().ton.modus).toBe('aus');
  });

  it('stellt Lautstärke und Stummschaltung ein', () => {
    useMusikStand.setState({ verfuegbar: true });
    render(<MusikSteuerung />);
    fireEvent.change(screen.getByLabelText('Lautstärke'), { target: { value: '0.25' } });
    expect(useStore.getState().ton.lautstaerke).toBe(0.25);
    fireEvent.click(screen.getByLabelText('Stumm (M)'));
    expect(useStore.getState().ton.stumm).toBe(true);
  });

  it('nennt das laufende Stück mit Titel und Urheber, verlinkt, wenn ein Link da ist', () => {
    useMusikStand.setState({
      verfuegbar: true,
      aktuell: { datei: 'a.mp3', titel: 'Morgen', urheber: 'Jemand', link: 'https://example.org/a' },
    });
    render(<MusikSteuerung />);
    const verweis = screen.getByRole('link', { name: /Morgen — Jemand/ });
    expect(verweis.getAttribute('href')).toBe('https://example.org/a');
    expect(verweis.getAttribute('target')).toBe('_blank');
    expect(verweis.getAttribute('rel')).toContain('noopener');
  });

  it('nennt ohne Titel den Dateinamen und ohne Link keinen Verweis', () => {
    useMusikStand.setState({ verfuegbar: true, aktuell: { datei: 'abend.mp3' } });
    render(<MusikSteuerung />);
    expect(screen.getByText(/abend\.mp3/)).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
