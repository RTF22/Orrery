// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScalePanel } from './ScalePanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCALE_PRESETS } from '../../sim/scale';
import { SCENES } from '../../data/scenes';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('ScalePanel', () => {
  it('bietet alle drei Presets an', () => {
    render(<ScalePanel />);
    for (const name of ['Realistisch', 'Schaubild', 'Kompakt']) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  });

  it('merkt sich das gewählte Preset', () => {
    render(<ScalePanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Kompakt' }));
    expect(useStore.getState().scale.preset).toBe('kompakt');
  });

  it('setzt bei realistischem Preset den Exponenten auf 1', async () => {
    render(<ScalePanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Realistisch' }));
    await new Promise((r) => setTimeout(r, 1000)); // Animation abwarten
    expect(useStore.getState().scale.distanceExponent)
      .toBeCloseTo(SCALE_PRESETS.realistisch.distanceExponent, 2);
  });

  it('löst das Preset, sobald ein Regler von Hand bewegt wird', () => {
    render(<ScalePanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Kompakt' }));
    fireEvent.change(screen.getByLabelText(/Körpergröße/), { target: { value: '2' } });
    expect(useStore.getState().scale.preset).toBeNull();
  });

  it('blendet in der Himmelsansicht Presets und Maßstabsregler aus und zeigt nur Grund und Lupe', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch' });
    render(<ScalePanel />);
    expect(screen.queryByRole('button', { name: 'Kompakt' })).toBeNull();
    expect(screen.queryByLabelText('Körpergröße')).toBeNull();
    expect(screen.getByText(/Von der Erde aus gilt der Maßstab/)).toBeTruthy();
    const lupe = screen.getByLabelText('Scheiben vergrößern') as HTMLInputElement;
    fireEvent.change(lupe, { target: { value: '1' } });
    expect(useStore.getState().camera.geo.lupe).toBeCloseTo(50, 6);
    expect(useStore.getState().scale).toEqual(DEFAULT_STATE.scale);
  });

  it('zeigt in einer Himmelsszene des Kinos den Grund, aber keinen Lupenregler', () => {
    const nummer = SCENES.findIndex((s) => s.path === 'himmel');
    useStore.getState().setCinema({ nummer, shuffle: false });
    useStore.getState().setCamera({ mode: 'cinema' });
    render(<ScalePanel />);
    expect(screen.getByText(/Von der Erde aus gilt der Maßstab/)).toBeTruthy();
    expect(screen.queryByLabelText('Scheiben vergrößern')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Kompakt' })).toBeNull();
  });

  it('zeigt nach dem Verlassen des Himmels wieder alle Regler mit dem alten Maßstab', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch' });
    const { rerender } = render(<ScalePanel />);
    useStore.getState().setCamera({ mode: 'attached' });
    rerender(<ScalePanel />);
    expect(screen.getByRole('button', { name: 'Kompakt' })).toBeTruthy();
    expect(screen.queryByLabelText('Scheiben vergrößern')).toBeNull();
  });
});
