import { describe, expect, it } from 'vitest';
import { dokuWurzelSeite, seite, sprachwahlSeite } from './doku-vorlage.ts';

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
  it('verlinkt die andere Sprache auf dieselbe Seite und setzt hreflang', () => {
    expect(h).toContain('href="../en/chronik.html"');
    expect(h).toMatch(/hreflang="en" href="\.\.\/en\/chronik\.html"/);
  });
  it('führt das Inhaltsverzeichnis mit beiden Ebenen', () => {
    expect(h).toContain('href="#p1"');
    expect(h).toContain('href="#z"');
  });
  it('markiert die aktuelle Seite und verlinkt die Simulation relativ', () => {
    expect(h).toMatch(/href="chronik\.html"[^>]*aria-current="page"/);
    expect(h).toContain('href="../../../index.html"');
  });
  it('lädt nichts von außen', () => {
    expect(h).not.toMatch(/<(script|link)[^>]+(src|href)="https?:/);
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
