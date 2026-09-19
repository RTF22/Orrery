// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimePanel } from './TimePanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { dateToJd } from '../../sim/time';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('TimePanel', () => {
  it('schaltet die Pause um', () => {
    render(<TimePanel />);
    fireEvent.click(screen.getByRole('button', { name: /Pause/ }));
    expect(useStore.getState().time.paused).toBe(true);
  });

  it('kehrt die Zeitrichtung um', () => {
    render(<TimePanel />);
    const vorher = useStore.getState().time.rateDaysPerSec;
    fireEvent.click(screen.getByRole('button', { name: /umkehren/ }));
    expect(useStore.getState().time.rateDaysPerSec).toBe(-vorher);
  });

  it('springt auf die aktuelle Zeit', () => {
    useStore.getState().setTime({ jd: 2400000 });
    render(<TimePanel />);
    fireEvent.click(screen.getByRole('button', { name: /Jetzt/ }));
    expect(Math.abs(useStore.getState().time.jd - dateToJd(new Date()))).toBeLessThan(0.01);
  });

  it('übernimmt ein eingegebenes Datum', () => {
    render(<TimePanel />);
    const feld = screen.getByLabelText(/Datum/) as HTMLInputElement;
    fireEvent.change(feld, { target: { value: '2030-05-17' } });
    const erwartet = dateToJd(new Date(Date.UTC(2030, 4, 17)));
    expect(Math.abs(useStore.getState().time.jd - erwartet)).toBeLessThan(0.5);
  });

  it('warnt außerhalb des Gueltigkeitsfensters', () => {
    useStore.getState().setTime({ jd: dateToJd(new Date(Date.UTC(2200, 0, 1))) });
    render(<TimePanel />);
    expect(screen.getByText(/ungenau/)).toBeTruthy();
  });

  it('begrenzt das Datumsfeld auf das Jahr 9999', () => {
    render(<TimePanel />);
    const feld = screen.getByLabelText(/Datum/) as HTMLInputElement;
    expect(feld.max).toBe('9999-12-31');
  });

  it('übernimmt die Jahre 1 bis 99 wörtlich statt sie ins 20. Jahrhundert zu verschieben', () => {
    render(<TimePanel />);
    const feld = screen.getByLabelText(/Datum/) as HTMLInputElement;
    fireEvent.change(feld, { target: { value: '0050-03-01' } });
    const erwartet = dateToJd((() => {
      const d = new Date(0);
      d.setUTCFullYear(50, 2, 1);
      return d;
    })());
    expect(Math.abs(useStore.getState().time.jd - erwartet)).toBeLessThan(0.5);
  });
});
