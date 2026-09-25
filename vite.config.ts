import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import paket from './package.json';

export default defineConfig(({ command }) => ({
  // Der Build nutzt relative Pfade: Dieselben Dateien laufen unter
  // www.jensfricke.com/Orrery/ und in der Wurzel von orrery3d.de. Der
  // Entwicklungsserver bleibt unter /Orrery/ (Sichtprüfungen verweisen darauf).
  base: command === 'build' ? './' : '/Orrery/',
  // Versionsnummer für die Info-Karte (ui/infokarte/version.ts).
  define: { __ORRERY_VERSION__: JSON.stringify(paket.version) },
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    // Räumt nach Komponententests den DOM auf; für die node-Tests folgenlos.
    setupFiles: ['src/test/setup.ts'],
    // Vitest ersetzt CSS-Importe sonst durch einen leeren Text (auch mit
    // ?raw): ui/info/konstanten.test.ts liest src/index.css als Zwillingsprüfung
    // der Medienabfragen und braucht dafür den echten Inhalt.
    css: { include: [/index\.css/] },
  },
}));
