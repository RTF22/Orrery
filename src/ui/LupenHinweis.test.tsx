// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LupenHinweis } from './LupenHinweis';
import { useStore, DEFAULT_STATE } from '../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('LupenHinweis', () => {
  it('erscheint im Himmel bei Lupe über 1 mit gerundetem Faktor', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch', geo: { ...DEFAULT_STATE.camera.geo, lupe: 12.4 } });
    const { rerender } = render(<LupenHinweis />);
    expect(screen.getByText('Größen überhöht (12×)')).toBeTruthy();
    useStore.getState().setCamera({ geo: { ...DEFAULT_STATE.camera.geo, lupe: 1.3 } });
    rerender(<LupenHinweis />);
    expect(screen.getByText('Größen überhöht (1,3×)')).toBeTruthy();
  });
  it('fehlt bei Lupe 1 und außerhalb des Himmels', () => {
    useStore.getState().setCamera({ mode: 'geozentrisch' });
    const { container, rerender } = render(<LupenHinweis />);
    expect(container.textContent).toBe('');
    useStore.getState().setCamera({ mode: 'attached', geo: { ...DEFAULT_STATE.camera.geo, lupe: 12 } });
    rerender(<LupenHinweis />);
    expect(container.textContent).toBe('');
  });
});
