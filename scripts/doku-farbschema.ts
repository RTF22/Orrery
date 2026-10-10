/**
 * Farbschema der Doku-Seiten (Entwurf 2026-10-10 §3): beide Paletten, die Farbvariablen
 * am Anfang von `DOKU_CSS` und die `theme-color`-Angaben im Kopf. Dunkel ist die
 * Grundlage (Herkunft der Werte im Dateikopf von doku-vorlage.ts); hell gilt nach
 * Systemvorgabe (`prefers-color-scheme: light`) oder nach eigener Wahl (`data-theme`
 * am `<html>`, gesetzt vom Schalter).
 */

import type { Sprache } from './doku-bauen.ts';

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

export const FARBSCHEMA_SCHLUESSEL = 'orrery.doku.farbschema.v1';

const KNOPF_TEXTE: Record<Sprache, { auto: string; hell: string; dunkel: string }> = {
  de: {
    auto: 'Farbschema: automatisch (wie das System). Klicken für hell.',
    hell: 'Farbschema: hell. Klicken für dunkel.',
    dunkel: 'Farbschema: dunkel. Klicken für automatisch.',
  },
  en: {
    auto: 'Color scheme: automatic (follows the system). Click for light.',
    hell: 'Color scheme: light. Click for dark.',
    dunkel: 'Color scheme: dark. Click for automatic.',
  },
};

/** Knopf für die Kopfzeile; bleibt ohne Skript verborgen (`hidden`), das Schalterskript zeigt ihn. */
export function farbschemaKnopf(sprache: Sprache): string {
  const t = KNOPF_TEXTE[sprache];
  return (
    `<button type="button" class="kopf-knopf farbschema-knopf" id="farbschema-knopf" hidden ` +
    `aria-label="${t.auto}" title="${t.auto}" data-auto="${t.auto}" data-hell="${t.hell}" data-dunkel="${t.dunkel}">` +
    `◐</button>`
  );
}

/**
 * `theme-color` je Systemschema, dahinter ein Kopfskript: Es setzt eine gespeicherte Wahl
 * schon vor dem ersten Zeichnen (der Kopf steht vor dem Stylesheet); bei eigener Wahl passt
 * das Schalterskript beide Angaben an.
 */
export function farbschemaKopf(): string {
  return `<meta name="theme-color" content="${PALETTE_DUNKEL.bg}" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="${PALETTE_HELL.bg}" media="(prefers-color-scheme: light)">
<script>
try {
  var farbschema = localStorage.getItem('${FARBSCHEMA_SCHLUESSEL}');
  if (farbschema === 'hell' || farbschema === 'dunkel') {
    document.documentElement.setAttribute('data-theme', farbschema === 'hell' ? 'light' : 'dark');
  }
} catch (e) {}
</script>`;
}

/** Schalterskript: liest die Wahl, zeigt sie am Knopf und in theme-color, schaltet reihum und speichert. */
export const FARBSCHEMA_SKRIPT = `<script>
(function () {
  var knopf = document.getElementById('farbschema-knopf');
  if (!knopf) return;
  var SCHLUESSEL = '${FARBSCHEMA_SCHLUESSEL}';
  var ZEICHEN = { auto: '\u25D0', hell: '\u2600\uFE0E', dunkel: '\u263E\uFE0E' };
  var FARBE = { hell: '${PALETTE_HELL.bg}', dunkel: '${PALETTE_DUNKEL.bg}' };
  var FOLGE = { auto: 'hell', hell: 'dunkel', dunkel: 'auto' };
  var metas = Array.prototype.slice.call(document.querySelectorAll('meta[name="theme-color"]'));
  var urspruenglich = metas.map(function (m) {
    return { content: m.getAttribute('content'), media: m.getAttribute('media') };
  });
  var wahl = 'auto';

  function lesen() {
    wahl = 'auto';
    try {
      var gespeichert = localStorage.getItem(SCHLUESSEL);
      if (gespeichert === 'hell' || gespeichert === 'dunkel') wahl = gespeichert;
    } catch (e) {}
  }

  function anwenden() {
    var wurzel = document.documentElement;
    if (wahl === 'auto') wurzel.removeAttribute('data-theme');
    else wurzel.setAttribute('data-theme', wahl === 'hell' ? 'light' : 'dark');
    metas.forEach(function (m, i) {
      if (wahl === 'auto') {
        m.setAttribute('content', urspruenglich[i].content);
        if (urspruenglich[i].media) m.setAttribute('media', urspruenglich[i].media);
      } else {
        m.setAttribute('content', FARBE[wahl]);
        m.removeAttribute('media');
      }
    });
    var text = knopf.getAttribute('data-' + wahl);
    knopf.textContent = ZEICHEN[wahl];
    knopf.setAttribute('aria-label', text);
    knopf.setAttribute('title', text);
  }

  knopf.addEventListener('click', function () {
    wahl = FOLGE[wahl];
    try {
      if (wahl === 'auto') localStorage.removeItem(SCHLUESSEL);
      else localStorage.setItem(SCHLUESSEL, wahl);
    } catch (e) {}
    anwenden();
  });
  // Zurück aus dem bfcache und Wahl in einem zweiten Tab: Seite zeigt sonst die alte Farbe.
  window.addEventListener('pageshow', function (ev) {
    if (!ev.persisted) return;
    lesen();
    anwenden();
  });
  window.addEventListener('storage', function (ev) {
    if (ev.key !== null && ev.key !== SCHLUESSEL) return;
    lesen();
    anwenden();
  });
  lesen();
  anwenden();
  knopf.hidden = false;
})();
</script>`;
