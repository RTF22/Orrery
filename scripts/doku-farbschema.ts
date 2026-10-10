/**
 * Farbschema der Doku-Seiten (Entwurf 2026-10-10 §3): beide Paletten, die Farbvariablen
 * am Anfang von `DOKU_CSS` und die `theme-color`-Angaben im Kopf. Dunkel ist die
 * Grundlage (Herkunft der Werte im Dateikopf von doku-vorlage.ts); hell gilt nach
 * Systemvorgabe (`prefers-color-scheme: light`) oder nach eigener Wahl (`data-theme`
 * am `<html>`, gesetzt vom Schalter).
 */

export interface Palette {
  bg: string;
  text: string;
  textGedaempft: string;
  akzent: string;
  akzentStark: string;
  rand: string;
}

export const PALETTE_DUNKEL: Palette = {
  bg: '#0f172a',
  text: '#f1f5f9',
  textGedaempft: '#cbd5e1',
  akzent: '#7dd3fc',
  akzentStark: '#38bdf8',
  rand: 'rgba(255, 255, 255, 0.14)',
};

/** Tailwind-Standardpalette (slate/sky), Kontraste in doku-farbschema.test.ts. */
export const PALETTE_HELL: Palette = {
  bg: '#f8fafc',
  text: '#0f172a',
  textGedaempft: '#475569',
  akzent: '#0369a1',
  akzentStark: '#0284c7',
  rand: 'rgba(15, 23, 42, 0.14)',
};

function variablen(p: Palette, schema: 'dark' | 'light', einzug: string): string {
  return [
    `--bg: ${p.bg};`,
    `--text: ${p.text};`,
    `--text-gedaempft: ${p.textGedaempft};`,
    `--akzent: ${p.akzent};`,
    `--akzent-stark: ${p.akzentStark};`,
    `--rand: ${p.rand};`,
    `color-scheme: ${schema};`,
  ]
    .map((zeile) => einzug + zeile)
    .join('\n');
}

export const FARBSCHEMA_CSS = `:root {
${variablen(PALETTE_DUNKEL, 'dark', '  ')}
}
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
${variablen(PALETTE_HELL, 'light', '    ')}
  }
}
:root[data-theme="light"] {
${variablen(PALETTE_HELL, 'light', '  ')}
}
`;

/** `theme-color` je Systemschema; bei eigener Wahl passt das Schalterskript beide an. */
export function farbschemaKopf(): string {
  return `<meta name="theme-color" content="${PALETTE_DUNKEL.bg}" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="${PALETTE_HELL.bg}" media="(prefers-color-scheme: light)">`;
}
