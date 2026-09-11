import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**'],
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
    },
  },
);
