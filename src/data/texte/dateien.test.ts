import { describe, it, expect } from 'vitest';
import { textKennungGueltig, verweisAufloesen } from '../verweise';
import { quellenFuer } from '../quellen';
import { LITERATUR, erstautorNachname, jahrMitSuffix, publikationFinden } from '../literatur';
import type { Niveau } from '../themen';
import { inlineText, parseMarkdown } from '../../ui/info/markdownParser';
import type { Block, Inline } from '../../ui/info/markdownParser';
import { texNachMathml } from '../../ui/info/texUebersetzer';

const dateien = import.meta.glob('./*/*/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

const MUSTER = /^\.\/(de|en)\/(grundschule|gymnasium|hochschule)\/(objekt|szene|thema)-([a-z0-9-]+)\.md$/;

/**
 * Weiche Obergrenze zum Richtwert 40–80 Wörter der Grundschule (Entwurf 4c §2
 * Punkt 4, §8). Beim Gymnasium ist die Wortzahl kein Dogma (Entscheidung
 * Jens, 14.09.2026): Maßgeblich ist die korrekte, dem Niveau angepasste
 * Darstellung; 120–180 Wörter bleiben Richtwert ohne Prüfgrenze. Die
 * Hochschule hat nur Richtwerte (Entwurf 4d §5.2).
 */
const WORTGRENZE: Record<Niveau, number> = { grundschule: 110, gymnasium: Infinity, hochschule: Infinity };

/**
 * Bis einschließlich Etappe 4d-10 genügt für Verweise aus Hochschultexten
 * ein Gymnasialtext als Ersatz (Entwurf 4d §5.5 Punkt 6); die Anzeige zeigt
 * ihn mit dem Hinweis info.hochschuleFolgt. Etappe 4d-11 setzt false.
 */
const HOCHSCHULE_GYMNASIUM_ERSATZ = true;

/** Feste Gliederung der Hochschultexte (Entwurf 4d §5.1); `pflicht` sind Stellen in den Listen. */
const GLIEDERUNG: Record<'objekt' | 'szene', { de: readonly string[]; en: readonly string[]; pflicht: readonly number[] }> = {
  objekt: {
    de: [
      'Kenngrößen und Messung', 'Inneres', 'Oberfläche', 'Atmosphäre und Magnetosphäre',
      'Bahn, Rotation und Dynamik', 'Entstehung und Entwicklung', 'Offene Fragen', 'Im Modell',
    ],
    en: [
      'Parameters and measurement', 'Interior', 'Surface', 'Atmosphere and magnetosphere',
      'Orbit, rotation and dynamics', 'Formation and evolution', 'Open questions', 'In the model',
    ],
    pflicht: [6, 7],
  },
  szene: {
    de: ['Was das Bild zeigt', 'Hintergrund', 'Modellgrenzen'],
    en: ['What the view shows', 'Background', 'Model limitations'],
    pflicht: [2],
  },
};

const MONATE = {
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const STAND = {
  de: new RegExp(`^\\*Stand: (${MONATE.de.join('|')}) \\d{4}\\*$`),
  en: new RegExp(`^\\*As of (${MONATE.en.join('|')}) \\d{4}\\*$`),
};

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

/** Alle Inline-Listen eines Blockbaums, auch aus Listen und Tabellenzellen. */
function inlineListen(bloecke: readonly Block[]): Inline[][] {
  return bloecke.flatMap((b): Inline[][] => {
    switch (b.typ) {
      case 'ueberschrift':
      case 'absatz':
        return [b.kinder];
      case 'liste':
        return b.punkte;
      case 'tabelle':
        return [...b.kopf, ...b.zeilen.flat()];
      case 'formel':
        return [];
    }
  });
}

/** Ein Inline-Baum als flache Liste aller Knoten. */
function flach(kinder: readonly Inline[]): Inline[] {
  return kinder.flatMap((k) => (k.typ === 'text' || k.typ === 'formel' ? [k] : [k, ...flach(k.kinder)]));
}

function formeln(bloecke: readonly Block[]): { tex: string; block: boolean }[] {
  return [
    ...bloecke.flatMap((b) => (b.typ === 'formel' ? [{ tex: b.tex, block: true }] : [])),
    ...inlineListen(bloecke).flatMap((liste) => flach(liste))
      .flatMap((k) => (k.typ === 'formel' ? [{ tex: k.tex, block: false }] : [])),
  ];
}

function zitate(bloecke: readonly Block[]): { id: string; linktext: string }[] {
  return inlineListen(bloecke).flatMap((liste) => flach(liste)).flatMap((k) => (
    k.typ === 'link' && k.ziel.startsWith('literatur:')
      ? [{ id: k.ziel.slice('literatur:'.length), linktext: inlineText(k.kinder) }]
      : []
  ));
}

describe('Textdateien', () => {
  const eintraege = Object.entries(dateien);

  it('gibt es', () => {
    expect(eintraege.length).toBeGreaterThanOrEqual(14);
  });

  for (const [pfad, text] of eintraege) {
    describe(pfad, () => {
      const treffer = MUSTER.exec(pfad);
      const [, sprache = 'de', niveau = 'hochschule', art = '', kennung = ''] = treffer ?? [];
      const bloecke = parseMarkdown(text);

      it('folgt dem Namensmuster und nennt eine bekannte Kennung', () => {
        expect(treffer, 'Muster <sprache>/<niveau>/<art>-<kennung>.md').not.toBeNull();
        expect(textKennungGueltig(art, kennung)).toBe(true);
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
        // Formeln dürfen < und > enthalten ($a<b$); sie zählen nicht als HTML.
        const ohneFormeln = formeln(bloecke).reduce((rest, f) => rest.replace(f.tex, ''), text);
        expect(ohneFormeln).not.toMatch(/<[a-zA-Z!/]/);
      });

      it('hält die Wortgrenze des Niveaus', () => {
        expect(woerter(text)).toBeLessThanOrEqual(WORTGRENZE[niveau as Niveau]);
      });

      it('führt Objekt-, Szenen- und Themenverweise auf einen Text im selben Niveau', () => {
        for (const ziel of verweisZiele(text)) {
          const textziel = textZiel(ziel);
          if (textziel === null) continue;
          const pfadZiel = `./${sprache}/${niveau}/${textziel.art}-${textziel.kennung}.md`;
          const ersatz = `./${sprache}/gymnasium/${textziel.art}-${textziel.kennung}.md`;
          const vorhanden = Object.hasOwn(dateien, pfadZiel)
            || (HOCHSCHULE_GYMNASIUM_ERSATZ && niveau === 'hochschule' && Object.hasOwn(dateien, ersatz));
          expect(vorhanden, `Verweis ${ziel}: ${pfadZiel} fehlt`).toBe(true);
        }
      });

      it('zeigt zu jedem Quellenverweis die Karte unter dem Text', () => {
        const karten = quellenFuer(`${art}:${kennung}`).map((q) => q.id);
        for (const ziel of verweisZiele(text)) {
          if (!ziel.startsWith('quelle:')) continue;
          expect(karten, `Verweis ${ziel} ohne Karte`).toContain(ziel.slice('quelle:'.length));
        }
      });

      it('hat nur übersetzbare Formeln und gültige Tabellen', () => {
        const fehler = formeln(bloecke).flatMap(({ tex, block }) => {
          const ergebnis = texNachMathml(tex, block);
          return 'fehler' in ergebnis ? [`${tex}: ${ergebnis.fehler} (Stelle ${ergebnis.stelle})`] : [];
        });
        expect(fehler).toEqual([]);
        const kaputt = bloecke.flatMap((b) => (b.typ === 'absatz' && inlineText(b.kinder).startsWith('|') ? [inlineText(b.kinder)] : []));
        expect(kaputt, 'Strichzeilen ohne gültige Tabellenform').toEqual([]);
      });

      it('zitiert nur Katalogeinträge, nur auf Hochschulniveau, mit Erstautor und Jahr im Linktext', () => {
        for (const { id, linktext } of zitate(bloecke)) {
          expect(niveau, `literatur:${id} steht außerhalb eines Hochschultexts`).toBe('hochschule');
          const arbeit = publikationFinden(id);
          expect(arbeit, `literatur:${id} fehlt im Katalog`).toBeDefined();
          if (arbeit === undefined) continue;
          expect(linktext, `Linktext zu ${id}`).toContain(erstautorNachname(arbeit));
          expect(linktext, `Linktext zu ${id}`).toContain(jahrMitSuffix(arbeit));
        }
      });

      if (niveau === 'hochschule') {
        it('endet mit der Stand-Zeile als eigenem Absatz', () => {
          const zeilen = text.trimEnd().split(/\r?\n/);
          expect(zeilen[zeilen.length - 1]).toMatch(sprache === 'en' ? STAND.en : STAND.de);
          expect((zeilen[zeilen.length - 2] ?? '').trim(), 'Leerzeile vor der Stand-Zeile').toBe('');
        });

        if (art === 'objekt' || art === 'szene') {
          const vorgabe = GLIEDERUNG[art];
          const liste = sprache === 'en' ? vorgabe.en : vorgabe.de;
          it('folgt der Gliederung seiner Art', () => {
            const titel = bloecke.flatMap((b) => (b.typ === 'ueberschrift' && b.ebene === 2 ? [inlineText(b.kinder)] : []));
            const stellen = titel.map((t) => liste.indexOf(t));
            expect(titel.filter((_, i) => (stellen[i] ?? -1) < 0), 'unbekannte Abschnitte').toEqual([]);
            expect(stellen, 'Reihenfolge').toEqual([...stellen].sort((a, b) => a - b));
            expect(new Set(stellen).size, 'Abschnitt doppelt').toBe(stellen.length);
            for (const p of vorgabe.pflicht) expect(stellen, `Pflichtabschnitt „${liste[p] ?? ''}"`).toContain(p);
          });
        }
      }
    });
  }

  it('hat jede Datei in beiden Sprachen', () => {
    const pfade = new Set(Object.keys(dateien));
    for (const pfad of pfade) {
      const partner = pfad.startsWith('./de/') ? pfad.replace('./de/', './en/') : pfad.replace('./en/', './de/');
      expect(pfade.has(partner), `Gegenstück fehlt: ${partner}`).toBe(true);
    }
  });

  it('zitiert jeden Eintrag des Literaturkatalogs mindestens einmal', () => {
    const zitiert = new Set(eintraege.flatMap(([, text]) => zitate(parseMarkdown(text)).map((z) => z.id)));
    expect(LITERATUR.map((p) => p.id).filter((id) => !zitiert.has(id))).toEqual([]);
  });

  it('führt in deutscher und englischer Hochschulfassung dieselben Zitate und Formeln', () => {
    const normiert = (tex: string): string => tex.replaceAll('{,}', '.').replace(/\s+/g, ' ').trim();
    for (const [pfad, text] of eintraege) {
      if (!pfad.startsWith('./de/hochschule/')) continue;
      const englisch = dateien[pfad.replace('./de/', './en/')];
      if (englisch === undefined) continue; // meldet „hat jede Datei in beiden Sprachen"
      const de = parseMarkdown(text);
      const en = parseMarkdown(englisch);
      expect(zitate(en).map((z) => z.id).sort(), `${pfad}: Zitate`).toEqual(zitate(de).map((z) => z.id).sort());
      expect(formeln(en).map((f) => normiert(f.tex)).sort(), `${pfad}: Formeln`).toEqual(formeln(de).map((f) => normiert(f.tex)).sort());
    }
  });
});
