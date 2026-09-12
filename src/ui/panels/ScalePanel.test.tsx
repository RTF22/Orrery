// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScalePanel } from './ScalePanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { SCALE_PRESETS } from '../../sim/scale';

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
});
