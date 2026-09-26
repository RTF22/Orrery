import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { SEITEN_STAMM, dokuWurzelSeite, seite, sprachwahlSeite } from './doku-vorlage.ts';

const d = {
  sprache: 'de' as const, dokument: 'chronik' as const, titel: 'Chronik <Test>', beschreibung: 'Kurz & gut',
  html: '<h2 id="p1">Eins</h2><h3 id="z">Ziel</h3>',
  toc: [{ ebene: 2 as const, text: 'Eins', id: 'p1' }, { ebene: 3 as const, text: 'Ziel', id: 'z' }],
};

describe('seite', () => {
  const h = seite(d);
  it('setzt Sprache, maskierten Titel und Beschreibung', () => {
    expect(h).toContain('<html lang="de">');
    expect(h).toContain('<title>Chronik &lt;Test&gt; · Orrery</title>');
    expect(h).toContain('content="Kurz &amp; gut"');
  });
  it('verlinkt die andere Sprache auf dieselbe Seite und setzt hreflang absolut', () => {
    expect(h).toContain('href="../en/chronik.html"');
    expect(h).toMatch(/hreflang="en" href="https:\/\/orrery3d\.de\/doku\/making-of\/en\/chronik\.html"/);
  });
  it('führt das Inhaltsverzeichnis mit beiden Ebenen', () => {
    expect(h).toContain('href="#p1"');
    expect(h).toContain('href="#z"');
  });
  it('markiert die aktuelle Seite und verlinkt die Simulation relativ', () => {
    expect(h).toMatch(/href="chronik\.html"[^>]*aria-current="page"/);
    expect(h).toContain('href="../../../index.html"');
  });
  it('setzt Canonical, og:url und og:image absolut', () => {
    expect(h).toContain('<link rel="canonical" href="https://orrery3d.de/doku/making-of/de/chronik.html">');
    expect(h).toContain('<meta property="og:url" content="https://orrery3d.de/doku/making-of/de/chronik.html">');
    expect(h).toContain('<meta property="og:image" content="https://orrery3d.de/doku/making-of/bilder/orrery-saturn.jpg">');
  });
  it('x-default zeigt auf die englische Fassung', () => {
    expect(h).toMatch(/hreflang="x-default" href="https:\/\/orrery3d\.de\/doku\/making-of\/en\/chronik\.html"/);
  });
  it('der sichtbare Sprachumschalter im Kopf bleibt relativ', () => {
    expect(h).toContain('<nav class="sprachwahl"');
    expect(h).toContain('href="../en/chronik.html">EN</a>');
  });
  it('lädt nichts von außen außer Canonical und Alternate', () => {
    expect(h).not.toMatch(/<script[^>]+src="https?:/);
    const linkKennzeichen = [...h.matchAll(/<link\b[^>]*>/g)].map((treffer) => treffer[0]);
    const ladend = linkKennzeichen.filter(
      (tag) => /(?:src|href)="https?:/.test(tag) && !/rel="(canonical|alternate)"/.test(tag),
    );
    expect(ladend).toEqual([]);
  });
});

describe('SEITEN_STAMM stimmt mit den statischen Dateien überein', () => {
  it('robots.txt verweist auf die Sitemap unter der Konstante', () => {
    expect(readFileSync('public/robots.txt', 'utf8')).toContain(`Sitemap: ${SEITEN_STAMM}/sitemap.xml`);
  });
  it('index.html trägt die Canonical-Adresse der Konstante', () => {
    const kopf = readFileSync('index.html', 'utf8');
    expect(kopf).toContain('rel="canonical"');
    expect(kopf).toContain(`href="${SEITEN_STAMM}/"`);
  });
});

describe('Weiterleitungen', () => {
  it('Sprachwahl fällt auf Englisch zurück und bietet Links ohne Skript', () => {
    const h = sprachwahlSeite();
    expect(h).toContain("startsWith('de')");
    expect(h).toContain('href="en/"');
    expect(h).toContain('href="de/"');
  });
  it('Doku-Wurzel leitet auf making-of/', () => {
    expect(dokuWurzelSeite()).toContain('url=making-of/');
  });
});
