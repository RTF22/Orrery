import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Ohne die globale Testumgebung (`globals: true`) registriert Testing Library
 * ihr Aufräumen nicht selbst — ohne das hier stapeln sich die gerenderten
 * Bäume mehrerer Tests im selben document.
 */
afterEach(() => { cleanup(); });
