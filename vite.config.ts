import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Pages liegt später in einem Unterpfad — gleich zu Beginn setzen,
  // damit die spätere Veröffentlichung keine Pfadüberraschungen bringt.
  base: '/Orrery/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    // Räumt nach Komponententests den DOM auf; für die node-Tests folgenlos.
    setupFiles: ['src/test/setup.ts'],
  },
});
