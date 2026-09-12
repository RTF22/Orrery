// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CameraPanel } from './CameraPanel';
import { useStore, DEFAULT_STATE } from '../../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('CameraPanel', () => {
  it('bietet die drei Modi an', () => {
    render(<CameraPanel />);
    for (const name of ['Frei', 'Geheftet', 'Verfolgung']) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  });

  it('wechselt den Modus', () => {
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Verfolgung' }));
    expect(useStore.getState().camera.mode).toBe('follow');
  });

  it('setzt die Draufsicht auf die Ekliptik', () => {
    useStore.getState().setCamera({ elevation: 0 });
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Draufsicht/ }));
    expect(useStore.getState().camera.elevation).toBeCloseTo(Math.PI / 2, 3);
  });
});
