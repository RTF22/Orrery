import { describe, it, expect } from 'vitest';
import { textKennungGueltig, verweisAufloesen } from '../verweise';
import { quellenFuer } from '../quellen';
import type { Niveau } from '../themen';

const dateien = import.meta.glob('./*/*/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

const MUSTER = /^\.\/(de|en)\/(grundschule|gymnasium|hochschule)\/(objekt|szene|thema)-([a-z0-9-]+)\.md$/;

/**
 * Weiche Obergrenze zum Richtwert 40–80 Wörter der Grundschule (Entwurf §2
 * Punkt 4, §8). Beim Gymnasium ist die Wortzahl kein Dogma (Entscheidung
 * Jens, 14.09.2026): Maßgeblich ist die korrekte, dem Niveau angepasste
 * Darstellung; 120–180 Wörter bleiben Richtwert ohne Prüfgrenze.
 */
const WORTGRENZE: Record<Niveau, number> = { grundschule: 110, gymnasium: Infinity, hochschule: Infinity };

/**
 * Szenen, deren Texte Etappe 4c-4 erst schreibt. Verweise auf sie dürfen bis
 * dahin ohne Text bleiben; jede Text-Task streicht ihre Einträge, die letzte
 * entfernt die Liste samt ihrer Prüfung.
 */
const AUSSTEHEND: ReadonlySet<string> = new Set<string>([
  // Task 7
  'szene:saturn-streiflicht', 'szene:saturn-ringkante', 'szene:ringdurchflug',
  'szene:titan-dunst', 'szene:enceladus-hell', 'szene:iapetus-schief',
  // Task 8
  'szene:uranus-gekippt', 'szene:triton-rueckwaerts', 'szene:ceres-guertel',
]);

/** Zählt Wörter ohne die Link-Ziele in Klammern. */
function woerter(text: string): number {
  return text.replace(/\]\([^)]*\)/g, ']').split(/\s+/).filter((w) => w.length > 0).length;
}

function verweisZiele(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1] ?? '');
}

/** Art und Kennung, wenn der Verweis auf einen Text der Sammlung zeigt; sonst null. */
function textZiel(ziel: string): { art: string; kennung: string } | null {
  const treffer = /^(objekt|szene|thema):([a-z0-9-]+)$/.exec(ziel);
  return treffer === null ? null : { art: treffer[1] ?? '', kennung: treffer[2] ?? '' };
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

      it('führt Objekt-, Szenen- und Themenverweise auf einen Text im selben Niveau', () => {
        const [, sprache, niveau] = treffer ?? [];
        for (const ziel of verweisZiele(text)) {
          const textziel = textZiel(ziel);
          if (textziel === null || AUSSTEHEND.has(ziel)) continue;
          const pfadZiel = `./${sprache}/${niveau}/${textziel.art}-${textziel.kennung}.md`;
          expect(Object.hasOwn(dateien, pfadZiel), `Verweis ${ziel}: ${pfadZiel} fehlt`).toBe(true);
        }
      });

      it('zeigt zu jedem Quellenverweis die Karte unter dem Text', () => {
        const [, , , art, kennung] = treffer ?? [];
        const karten = quellenFuer(`${art}:${kennung}`).map((q) => q.id);
        for (const ziel of verweisZiele(text)) {
          if (!ziel.startsWith('quelle:')) continue;
          expect(karten, `Verweis ${ziel} ohne Karte`).toContain(ziel.slice('quelle:'.length));
        }
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

  it('führt als ausstehend nur Szenen, zu denen es noch keinen Text gibt', () => {
    for (const ziel of AUSSTEHEND) {
      const endung = `/${ziel.replace(':', '-')}.md`;
      expect(Object.keys(dateien).filter((pfad) => pfad.endsWith(endung)), ziel).toEqual([]);
    }
  });
});
