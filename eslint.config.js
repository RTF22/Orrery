import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', '.cache/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Schichtengrenze: sim/ und data/ dürfen weder Three.js noch React
    // noch DOM-APIs importieren. Ohne diese Regel erodiert die
    // Architektur beim ersten Zeitdruck.
    files: ['src/sim/**/*.ts', 'src/data/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: ['three', 'three/*', 'react', 'react-*', '@react*'],
      }],
      // no-restricted-imports erfasst nur Modul-Importe — die Browser-Globals
      // sind aber ambient verfügbar und müssen deshalb separat gesperrt werden.
      // Grund: sim/ und data/ müssen in einer reinen Node-Umgebung ohne DOM
      // testbar bleiben.
      'no-restricted-globals': ['error',
        { name: 'document', message: 'sim/ und data/ dürfen nicht auf das DOM zugreifen — sie müssen in einer reinen Node-Umgebung testbar bleiben.' },
        { name: 'window', message: 'sim/ und data/ dürfen nicht auf das DOM zugreifen — sie müssen in einer reinen Node-Umgebung testbar bleiben.' },
        { name: 'navigator', message: 'sim/ und data/ dürfen nicht auf Browser-APIs zugreifen — sie müssen in einer reinen Node-Umgebung testbar bleiben.' },
        { name: 'localStorage', message: 'sim/ und data/ dürfen nicht auf Browser-Speicher-APIs zugreifen — sie müssen in einer reinen Node-Umgebung testbar bleiben.' },
        { name: 'sessionStorage', message: 'sim/ und data/ dürfen nicht auf Browser-Speicher-APIs zugreifen — sie müssen in einer reinen Node-Umgebung testbar bleiben.' },
        { name: 'fetch', message: 'sim/ und data/ dürfen nicht auf Browser-Netzwerk-APIs zugreifen — sie müssen in einer reinen Node-Umgebung testbar bleiben.' },
        { name: 'alert', message: 'sim/ und data/ dürfen nicht auf Browser-Dialog-APIs zugreifen — sie müssen in einer reinen Node-Umgebung testbar bleiben.' },
        { name: 'requestAnimationFrame', message: 'sim/ und data/ dürfen nicht auf Browser-Rendering-APIs zugreifen — sie müssen in einer reinen Node-Umgebung testbar bleiben.' },
      ],
    },
  },
);
