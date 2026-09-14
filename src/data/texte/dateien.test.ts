import { describe, it, expect } from 'vitest';
import { textKennungGueltig, verweisAufloesen } from '../verweise';
import type { Niveau } from '../themen';

const dateien = import.meta.glob('./*/*/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

const MUSTER = /^\.\/(de|en)\/(grundschule|gymnasium|hochschule)\/(objekt|szene|thema)-([a-z0-9-]+)\.md$/;

/** Weiche Obergrenzen zu den Richtwerten 40–80 und 120–180 Wörter (Entwurf §2 Punkt 4, §8). */
const WORTGRENZE: Record<Niveau, number> = { grundschule: 110, gymnasium: 240, hochschule: Infinity };

/** Zählt Wörter ohne die Link-Ziele in Klammern. */
function woerter(text: string): number {
  return text.replace(/\]\([^)]*\)/g, ']').split(/\s+/).filter((w) => w.length > 0).length;
}

function verweisZiele(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1] ?? '');
}

describe('Textdateien', () => {
  const eintraege = Object.entries(dateien);

  it('gibt es', () => {
    expect(eintraege.length).toBeGreaterThanOrEqual(14);
  });

  for (const [pfad, text] of eintraege) {
    describe(pfad, () => {
      const treffer = MUSTER.exec(pfad);

      it('folgt dem Namensmuster und nennt eine bekannte Kennung', () => {
        expect(treffer, 'Muster <sprache>/<niveau>/<art>-<kennung>.md').not.toBeNull();
        const [, , , art, kennung] = treffer ?? [];
        expect(textKennungGueltig(art ?? '', kennung ?? '')).toBe(true);
      });

      it('beginnt mit einer Überschrift der Ebene 1', () => {
        expect(text.split(/\r?\n/)[0]).toMatch(/^# \S/);
      });

      it('enthält nur auflösbare Verweise', () => {
        for (const ziel of verweisZiele(text)) {
          expect(verweisAufloesen(ziel), `Verweis ${ziel}`).not.toBeNull();
        }
      });

      it('enthält kein HTML', () => {
        expect(text).not.toMatch(/<[a-zA-Z!/]/);
      });

      it('hält die Wortgrenze des Niveaus', () => {
        const niveau = (treffer?.[2] ?? 'hochschule') as Niveau;
        expect(woerter(text)).toBeLessThanOrEqual(WORTGRENZE[niveau]);
      });
    });
  }

  it('hat jede Datei in beiden Sprachen', () => {
    const pfade = new Set(Object.keys(dateien));
    for (const pfad of pfade) {
      const partner = pfad.startsWith('./de/') ? pfad.replace('./de/', './en/') : pfad.replace('./en/', './de/');
      expect(pfade.has(partner), `Gegenstück fehlt: ${partner}`).toBe(true);
    }
  });
});
