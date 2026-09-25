declare const __ORRERY_VERSION__: string | undefined;

/** Aus package.json über define in vite.config.ts; ohne Vite (reine Node-Läufe) leer. */
export const VERSION: string = typeof __ORRERY_VERSION__ === 'string' ? __ORRERY_VERSION__ : '';
