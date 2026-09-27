import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { de } from '../src/ui/i18n/de';
import { RECHTSSEITEN } from '../src/data/rechtsseiten';

const DATEIEN = ['ASSETS.md', 'ASSETS.de.md'] as const;
const INHALT: Record<(typeof DATEIEN)[number], string> = Object.fromEntries(
  DATEIEN.map((datei) => [datei, readFileSync(datei, 'utf8')]),
) as Record<(typeof DATEIEN)[number], string>;

describe.each(DATEIEN)('%s', (datei) => {
  const assets = INHALT[datei];
  const musikUeberschrift = datei === 'ASSETS.md' ? '## Music' : '## Musik';

  it('nennt jeden ausgelieferten Texturordner', () => {
    const fehlend = readdirSync('public/textures').filter(
      (koerper) => !new RegExp(`(texturen|textures)/${koerper}/`).test(assets),
    );
    expect(fehlend).toEqual([]);
  });

  it('nennt den Basis-Transcoder mit seiner Lizenz', () => {
    expect(assets).toContain('public/basis/basis_transcoder.wasm');
    expect(assets).toContain('Apache License 2.0');
  });

  it('stellt klar, dass Orrery keine Musik mitliefert', () => {
    expect(assets).toMatch(new RegExp(`^${musikUeberschrift}$`, 'm'));
    expect(assets).toContain('public/musik/');
  });
});

/** Pfad-Zellen der ersten Tabellenspalte, Form `| `pfad` | …`, in Vorkommensreihenfolge. */
function pfadZellen(text: string): string[] {
  return [...text.matchAll(/^\|\s*`([^`]+)`\s*\|/gm)].map((treffer) => treffer[1]);
}

/** Alle URLs des Textes (Markdown-Linkziel oder spitze Klammern), als Menge ohne Reihenfolge. */
function urlMenge(text: string): Set<string> {
  const treffer = [
    ...text.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g),
    ...text.matchAll(/<(https?:\/\/[^>\s]+)>/g),
  ];
  return new Set(treffer.map((t) => t[1]));
}

describe('Gleichlauf der beiden Sprachfassungen', () => {
  const en = INHALT['ASSETS.md'];
  const de = INHALT['ASSETS.de.md'];

  it('gleiche Dateipfade in der ersten Tabellenspalte, gleiche Reihenfolge', () => {
    expect(pfadZellen(en)).toEqual(pfadZellen(de));
  });

  it('gleiche Menge an Quellen-URLs', () => {
    expect(urlMenge(en)).toEqual(urlMenge(de));
  });

  it('jede Fassung verlinkt die andere', () => {
    expect(en).toContain('[Deutsch](ASSETS.de.md)');
    expect(de).toContain('[English](ASSETS.md)');
  });

  it('keine Prozesssprache in einer der Fassungen', () => {
    const prozessWoerter = /\bTask\b|\bEtappe\b|\bRuling\b/;
    expect(en).not.toMatch(prozessWoerter);
    expect(de).not.toMatch(prozessWoerter);
  });
});

describe('public/', () => {
  it('enthält nur belegte Ordner und die Serverkonfiguration', () => {
    // musik/ ist git-ignoriert und gehört dem Betreiber (docs/entwicklung.md „Eigene Musik").
    // robots.txt und favicon.ico kommen statisch mit (orrery3d.de liefert für fehlende
    // Dateien 500 statt 404, siehe scripts/app-symbol.py und docs/entwicklung.md).
    // Die google….html weist den Besitz der Domain für die Google Search Console nach.
    // BingSiteAuth.xml leistet dasselbe für die Bing Webmaster Tools.
    // saturn-ohne-js.webp ist das Hintergrundbild des Hinweises ohne JavaScript (index.html).
    const erlaubt = new Set([
      '.htaccess',
      'basis',
      'textures',
      'musik',
      'symbole',
      'manifest.webmanifest',
      'robots.txt',
      'favicon.ico',
      'google73a5c7151f277813.html',
      'BingSiteAuth.xml',
      'vorschau.png',
      'saturn-ohne-js.webp',
    ]);
    expect(readdirSync('public').filter((name) => !erlaubt.has(name))).toEqual([]);
  });
});

/** Breite und Höhe aus dem IHDR-Block einer PNG-Datei (Bytes 16–23, big-endian). */
function pngMasse(pfad: string): [number, number] {
  const daten = readFileSync(pfad);
  return [daten.readUInt32BE(16), daten.readUInt32BE(20)];
}

describe('Web-App', () => {
  const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8')) as {
    name: string; short_name: string; start_url: string; scope: string; display: string;
    icons: { src: string; sizes: string; type: string; purpose?: string }[];
  };

  it('startet im Vollbild innerhalb der eigenen Basis', () => {
    expect(manifest.display).toBe('fullscreen');
    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
    expect(manifest.short_name).toBe('Orrery');
  });

  it('führt Symbole in 192 und 512 Pixeln, die es gibt und die so groß sind', () => {
    for (const groesse of [192, 512]) {
      const symbol = manifest.icons.find((i) => i.sizes === `${groesse}x${groesse}`);
      expect(symbol?.type).toBe('image/png');
      expect(pngMasse(`public/${symbol!.src}`)).toEqual([groesse, groesse]);
    }
  });

  it('ist in index.html verlinkt und hat einen MIME-Typ auf dem Server', () => {
    expect(readFileSync('index.html', 'utf8')).toContain('<link rel="manifest" href="/manifest.webmanifest"');
    expect(readFileSync('public/.htaccess', 'utf8')).toContain('AddType application/manifest+json .webmanifest');
  });

  it('führt für jede Größe ein maskierbares Symbol', () => {
    for (const groesse of [192, 512]) {
      const symbol = manifest.icons.find(
        (i) => i.sizes === `${groesse}x${groesse}` && i.purpose === 'maskable',
      );
      expect(symbol).toBeDefined();
    }
  });
});

describe('public/.htaccess', () => {
  const regeln = readFileSync('public/.htaccess', 'utf8');

  it('leitet nur orrery3d.de auf die kanonische Adresse um', () => {
    // jensfricke.com/Orrery/ leitet die .htaccess der FTP-Wurzel um (Homepage-Projekt), nicht diese Datei.
    expect(regeln).toMatch(/RewriteCond %\{HTTP_HOST\} \^\(www\\.\)\?orrery3d\\.de\$ \[NC\]/);
    expect(regeln).toContain('RewriteRule ^ https://orrery3d.de%{REQUEST_URI}');
    expect(regeln.match(/^\s*RewriteRule /gm)).toHaveLength(1);
  });
});

describe('Linkvorschau der App', () => {
  const kopf = readFileSync('index.html', 'utf8');

  it('führt Beschreibung und Vorschaubild mit absoluter Adresse', () => {
    expect(kopf).toMatch(/<meta name="description" content="[^"]{50,160}"/);
    expect(kopf).toContain('<meta property="og:url" content="https://orrery3d.de/"');
    expect(kopf).toContain('<meta property="og:image" content="https://orrery3d.de/vorschau.png"');
    expect(kopf).toContain('<meta name="twitter:card" content="summary_large_image"');
  });

  it('führt Titel, Überschrift und Beschreibung wortgleich mit der App', () => {
    expect(kopf).toContain(`<title>${de['app.dokumenttitel']}</title>`);
    expect(kopf).toContain(`<meta name="description" content="${de['app.beschreibung']}"`);
    expect(kopf.match(/<h1[ >]/g)).toHaveLength(1);
    expect(kopf).toContain(`<h1 class="sr-only">${de['app.dokumenttitel']}</h1>`);
    expect(kopf).toContain(`<p class="sr-only">${de['app.beschreibung']}</p>`);
  });

  it('liefert als Vorschaubild dieselbe Datei wie das Repository', () => {
    expect(readFileSync('public/vorschau.png').equals(readFileSync('docs/bilder/social-preview.png'))).toBe(true);
  });
});

describe('Hinweis ohne JavaScript', () => {
  const kopf = readFileSync('index.html', 'utf8');
  const hinweis = kopf.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? '';

  it('erklärt auf Deutsch und Englisch, dass Orrery JavaScript braucht', () => {
    expect(hinweis).toContain('<h2>Orrery braucht JavaScript</h2>');
    expect(hinweis).toContain('<h2>Orrery needs JavaScript</h2>');
    expect(kopf.match(/<h1[ >]/g)).toHaveLength(1);
  });

  it('verlinkt Impressum, Datenschutz und die Doku-Seiten', () => {
    // Dieselben Adressen wie Info-Karte und Doku-Fußzeile (data/rechtsseiten.ts).
    for (const ziel of [
      RECHTSSEITEN.de.impressum, RECHTSSEITEN.de.datenschutz,
      RECHTSSEITEN.en.impressum, RECHTSSEITEN.en.datenschutz,
      'doku/making-of/de/', 'doku/making-of/en/',
    ]) expect(hinweis).toContain(`href="${ziel}"`);
  });

  it('lädt nur eigene Dateien mit relativem Pfad', () => {
    const bilder = [...hinweis.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
    expect(bilder).toEqual(['saturn-ohne-js.webp']);
    for (const bild of bilder) expect(readdirSync('public')).toContain(bild);
    expect(hinweis).not.toMatch(/url\(|@import|<link/);
  });
});
