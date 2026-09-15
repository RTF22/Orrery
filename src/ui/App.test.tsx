// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { App } from './App';
import { useStore, DEFAULT_STATE } from '../store';

beforeEach(() => { useStore.getState().replaceAll(structuredClone(DEFAULT_STATE)); });

describe('App', () => {
  it('setzt die Himmelskörper direkt unter die Kopfzeile', () => {
    const { container } = render(<App />);
    const kopfzeile = container.querySelector('header');
    const naechstes = kopfzeile?.nextElementSibling;
    expect(naechstes?.querySelector('button')?.textContent).toContain('Himmelskörper');
  });
});
