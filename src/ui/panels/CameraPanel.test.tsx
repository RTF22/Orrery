// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CameraPanel } from './CameraPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import * as THREE from 'three';
import { createCameraController, letztePose } from '../../render/camera/controller';
import { laenge } from '../../render/camera/flug';
import { formatZahl } from '../format';
import { t } from '../i18n';

/** Ein gerechnetes Bild, damit letztePose() eine gezeigte Lage kennt. */
function einBild(): void {
  const c = createCameraController(new THREE.PerspectiveCamera(50, 1, 0.001, 1e12));
  const s = useStore.getState();
  c.update(s, s.time.jd, 1 / 60, s.scale);
}

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

  it('bietet den Flug an und startet ihn an der gezeigten Lage', () => {
    einBild();
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Flug' }));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('fly');
    expect(camera.fly.refId).toBe('sun');
  });

  it('beendet den Flug über die Blickwinkel in Geheftet um das Ziel', () => {
    einBild();
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Flug' }));
    fireEvent.click(screen.getByRole('button', { name: /Draufsicht/ }));
    const { camera } = useStore.getState();
    expect(camera.mode).toBe('attached');
    expect(camera.targetId).toBe('sun');
    expect(camera.elevation).toBeCloseTo(Math.PI / 2, 3);
  });

  it('zeigt im Flug den Abstand der gezeigten Lage zum Ziel', () => {
    einBild();
    const pose = letztePose()!;
    useStore.getState().setCamera({ distance: 5e9 });
    render(<CameraPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Flug' }));
    // Ziel ist die Sonne im Ursprung.
    expect(screen.getByText(`${formatZahl(laenge(pose.positionKm) / 1e6)} ${t('unit.millionKm')}`)).toBeTruthy();
  });
});
