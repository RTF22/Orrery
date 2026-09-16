# Phase 4c Infopanel, Etappe 4 „Szenen und Sonnensystem" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Jede der 19 Kinoszenen hat einen Text in Grundschule und Gymnasium, Deutsch und Englisch (`mondfinsternis` liegt seit Etappe 1 vor, es fehlen 18 Szenen, 72 Dateien), und jede Szene zeigt Quellenkarten. Neu auf Wunsch von Jens (16.09.2026): Beim Start und beim Klick auf die Wurzel „Sonnensystem" im Objektbaum zeigt das Infopanel einen Text zum Sonnensystem, der auch den Namen „Orrery" mit Quellenangabe erklärt. Ein Dateitest stellt sicher, dass jeder `objekt:`-, `szene:`- und `thema:`-Verweis auf einen Text im selben Niveau führt. Danach ist Phase 4c inhaltlich komplett (Tag `v0.4.0` erst nach Freigabe).

**Architektur:** Task 1 und 2 sind Prüfungen und Katalogdaten: `src/data/texte/dateien.test.ts` bekommt die Prüfung „Ziel hat Text im selben Niveau" mit einer schrumpfenden Liste ausstehender Szenen und die Prüfung „Quellenverweis hat eine Karte"; Verweisknöpfe tragen `data-verweis`; die Quellen bekommen `szene:`-Einträge. Task 3 legt das neunte Thema `sonnensystem` an (Katalog, Titel, vier Quellen, vier Texte). Task 4 ist die einzige Verhaltensänderung: `startZustand` (Start ohne Link und Sitzung), `zurueckgesetzt`, `fahreZuSystem` setzen das Thema, `fahreZu` verwirft es, und das Infopanel verwirft ein Thema nicht mehr, wenn es im selben Zug wie das Ziel gesetzt wurde. Task 5 bis 8 sind reine Textdateien unter `src/data/texte/<sprache>/<niveau>/szene-<id>.md`; die Texte in diesem Plan sind **wörtlich** zu übernehmen, ein Umsetzer schreibt keine eigenen Sätze. Task 9 ist die Abnahme.

**Tech-Stack:** TypeScript, React, Zustand, Vitest mit jsdom und Testing Library, Markdown-Teilmenge des Renderers (Überschrift `#`, Absätze, `-`-Listen, fett, kursiv, Links `[Text](objekt:id|szene:id|thema:id|quelle:id)`), Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md`, maßgeblich §3.3 (was im Panel steht), §4.1 bis §4.5 (Ablage, Markdown, Verweise, Quellen, Themen), §5.1 („Szenen zeigen stattdessen Ziel und Blickpunkt als Objektverweise"), §7 Punkt 4 in der Fassung des Nachtrags vom 14.09.2026 („19 Szenen in beiden Niveaus und Sprachen, dazu der Dateitest ‚Themenziel hat Text im selben Niveau'"), §8 (Tests). Die Ergänzung „Sonnensystem beim Start und an der Wurzel" trägt Task 4 als Nachtrag in §3.3, §4.5 und §7 ein. Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts` und in den `en`-Feldern des Quellenkatalogs.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben).
- Branch `szenen` (von `master`), **kein Worktree**: der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten und darf von `store/`, `ui/` und `app/` gelesen werden. `SYSTEM_THEMA` gehört deshalb nach `src/data/themen.ts`.
- Textlänge (Entwurf §2 Punkt 4 mit Nachtrag): Grundschule 40 bis 80 Wörter Richtwert, harte Prüfgrenze 110 (einschließlich Überschrift); Gymnasium 120 bis 180 Wörter Richtwert ohne Prüfgrenze, sachliche Richtigkeit geht vor.
- Textform (Entwurf §4.2): erste Zeile `# Titel`; Zeilenumbrüche innerhalb eines Absatzes sind erlaubt; kein HTML, keine Bilder, keine Tabellen.
- Überschriften: Grundschul-Szenentexte tragen den Szenentitel aus `ui/i18n` (`scene.*`), Gymnasial-Szenentexte „Szene: " beziehungsweise „Scene: " davor, wie `szene-mondfinsternis.md` seit Etappe 1. Thementexte tragen den Thementitel aus `ui/i18n`.
- Verweise nur auf existierende Ziele: `objekt:<id>` (35 Körper), `szene:<id>` (19 Szenen), `thema:<id>` (8 Themen, ab Task 3 neun), `quelle:<id>` (62 Quellen, ab Task 3 66). Jeder `quelle:`-Verweis braucht eine Karte zum Text (`fuer` enthält die Kennung des Texts); Task 1 prüft das, Task 2 und 3 legen die Karten an. Die Reihenfolge der Tasks ist deshalb bindend.
- Deutsche und englische Fassung sind inhaltlich parallel; Ausnahme ist die Wikipedia-Quelle im Text zum Sonnensystem (Ruling 7).
- Szenentexte beschreiben nur, was die Szene tatsächlich zeigt (Kameraweg und Zeitraffer laut `src/data/scenes.ts`, Texturen laut `ASSETS.md`), und benennen offen, was die Simulation nicht darstellt (Atmosphären, Fontänen, Schwerpunktbewegung).
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Prüfungen „Ziel hat Text", „Quellenverweis hat Karte"; `data-verweis` | `src/data/texte/dateien.test.ts`, `src/ui/info/Markdown.tsx`, `src/ui/info/Markdown.test.tsx` |
| 2 | Quellenkarten für alle Szenen, Abdeckungstest | `src/data/quellen.ts`, `src/data/quellen.test.ts`, Entwurf §4.4 |
| 3 | Thema `sonnensystem`: Katalog, Titel, 4 Quellen, 4 Texte | `src/data/themen.ts`, `src/data/themen.test.ts`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts`, `src/data/quellen.ts`, 4 Texte, Entwurf §4.5 |
| 4 | Start, Wurzel und Zurücksetzen zeigen das Sonnensystem | `src/data/themen.ts`, `src/app/persistenz.ts`, `src/app/persistenz.test.ts`, `src/store/persist.ts`, `src/store/persist.test.ts`, `src/ui/kamerafahrt.ts`, `src/ui/kamerafahrt.test.ts`, `src/ui/info/InfoPanel.tsx`, `src/ui/info/InfoPanel.test.tsx`, Entwurf §3.3, §7 |
| 5 | Szenen erdaufgang, mondtanz, merkurjagd, systemblick, ferne-sonne | 20 Texte, `dateien.test.ts` |
| 6 | Szenen phobos-tiefflug, jupiter-vorbeiflug, galileisches-schattenspiel, pluto-charon | 16 Texte, `dateien.test.ts` |
| 7 | Szenen saturn-streiflicht, saturn-ringkante, ringdurchflug, titan-dunst, enceladus-hell, iapetus-schief | 24 Texte, `dateien.test.ts` |
| 8 | Szenen uranus-gekippt, triton-rueckwaerts, ceres-guertel; `thema-modell` ergänzt; Liste ausstehender Szenen entfernt | 12 Texte neu, 2 geändert, `dateien.test.ts` |
| 9 | Abnahme `docs/phase4c-etappe4-abnahme.md`, `README.md` | 2 |

Texte liegen unter `src/data/texte/de/<niveau>/<art>-<id>.md` und `src/data/texte/en/<niveau>/<art>-<id>.md`. Heute gibt es 176 Textdateien; nach Etappe 4 sind es 252 (4 Thementexte, 72 Szenentexte).

**Testzahlen:** Ausgangsstand `master` 2003 Tests. `dateien.test.ts` erzeugt heute je Datei fünf Fälle plus zwei Sammelfälle (882); nach Task 1 sieben Fälle je Datei plus drei Sammelfälle. Jeder Task nennt die erwartete Gesamtzahl; weicht sie ab, die Ursache im Bericht nennen, nicht den Test anpassen.

**Vorgehen je Text-Task (Task 5 bis 8):** Dateien wörtlich aus dem Plan anlegen → die Kennungen des Tasks aus `AUSSTEHEND` in `src/data/texte/dateien.test.ts` streichen → `npx vitest run src/data/texte` → alle Fälle grün → Commit nur mit `git add src/data/texte` (Task 8 zusätzlich die geänderten Modelltexte). Fällt ein Verweis- oder Kartenfall, die Kennung gegen die Kataloge prüfen, nie den Test ändern.

---

### Task 1: Prüfungen „Ziel hat Text" und „Quellenverweis hat Karte", `data-verweis`

**Befund (Planung, 16.09.2026):** Etappe 3 prüfte „Ziel hat Text im selben Niveau" nur per Shell-Skript; der Testfall ist laut Entwurf §7 Nachtrag Teil von 4c-4. Ein Nachlauf über alle 176 Dateien ergab außerdem: Jeder `quelle:`-Verweis zeigt heute auf eine Quelle, deren Karte unter demselben Text erscheint; ohne Karte bliebe ein Klick wirkungslos (`hebeHervor` findet nichts). Im automatischen Rundgang von Etappe 3 wurden fünf Szenenklicks falsch eingeordnet, weil der Rundgang die Art eines Verweises aus Store-Änderungen erraten musste (Protokoll Etappe 3, Bekannte Unschärfen Punkt 8). Ein Attribut `data-verweis` am Verweisknoten macht die Art im DOM ablesbar.

**Dateien:**
- Ändern: `src/data/texte/dateien.test.ts` (ganze Datei ersetzen, Inhalt unten)
- Ändern: `src/ui/info/Markdown.tsx` (Funktion `Verweisknoten`, drei Elemente)
- Ändern: `src/ui/info/Markdown.test.tsx` (neuer Fall)

**Schnittstellen:**
- Konsumiert: `quellenFuer(kennung: string, bevorzugt?: Sprache | null): Quelle[]` aus `src/data/quellen.ts`; `textKennungGueltig`, `verweisAufloesen` aus `src/data/verweise.ts`.
- Produziert: Konstante `AUSSTEHEND` in `dateien.test.ts` (18 Einträge `szene:<id>`), die Task 5 bis 8 schrittweise leeren; Attribut `data-verweis="<ziel>"` an jedem aufgelösten Verweis (`button` und `a`), auf das Task 9 im Browser zugreift.

- [ ] **Schritt 1: Branch anlegen**

```bash
git checkout -b szenen master
```

- [ ] **Schritt 2: `src/data/texte/dateien.test.ts` ersetzen, zunächst mit leerer Liste**

```ts
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
const AUSSTEHEND: ReadonlySet<string> = new Set<string>([]);

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
```

- [ ] **Schritt 3: Test laufen lassen, er muss fehlschlagen**

Run: `npx vitest run src/data/texte/dateien.test.ts`
Expected: FAIL nur im Fall „führt Objekt-, Szenen- und Themenverweise auf einen Text im selben Niveau", und zwar in den Körper- und Thementexten mit Szenenverweisen (etwa `./de/gymnasium/objekt-mercury.md` mit „Verweis szene:merkurjagd: ./de/gymnasium/szene-merkurjagd.md fehlt"). Verweise auf `szene:mondfinsternis` und alle `objekt:`/`thema:`-Verweise bleiben grün, der Kartenfall ist in allen Dateien grün.

- [ ] **Schritt 4: Liste der ausstehenden Szenen füllen**

In `dateien.test.ts` die Zeile `const AUSSTEHEND: ReadonlySet<string> = new Set<string>([]);` ersetzen durch:

```ts
const AUSSTEHEND: ReadonlySet<string> = new Set<string>([
  // Task 5
  'szene:erdaufgang', 'szene:mondtanz', 'szene:merkurjagd', 'szene:systemblick', 'szene:ferne-sonne',
  // Task 6
  'szene:phobos-tiefflug', 'szene:jupiter-vorbeiflug', 'szene:galileisches-schattenspiel', 'szene:pluto-charon',
  // Task 7
  'szene:saturn-streiflicht', 'szene:saturn-ringkante', 'szene:ringdurchflug',
  'szene:titan-dunst', 'szene:enceladus-hell', 'szene:iapetus-schief',
  // Task 8
  'szene:uranus-gekippt', 'szene:triton-rueckwaerts', 'szene:ceres-guertel',
]);
```

- [ ] **Schritt 5: Test laufen lassen, er muss bestehen**

Run: `npx vitest run src/data/texte/dateien.test.ts`
Expected: PASS, 1235 Fälle (176 × 7 + 3).

- [ ] **Schritt 6: Fehlschlagenden Fall in `src/ui/info/Markdown.test.tsx` schreiben**

Hinter dem Fall „Quellenverweise sind Anker mit der Zieladresse; …" einfügen:

```tsx
  it('trägt das Ziel jedes aufgelösten Verweises als data-verweis, unbekannte Ziele nicht', () => {
    render(
      <Markdown
        text="[Erde](objekt:earth), [Karte](quelle:nssdc-earth), [Seite](https://example.org), [Nichts](objekt:vulcan)."
        onVerweis={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Erde' }).getAttribute('data-verweis')).toBe('objekt:earth');
    expect(screen.getByRole('link', { name: 'Karte' }).getAttribute('data-verweis')).toBe('quelle:nssdc-earth');
    expect(screen.getByRole('link', { name: 'Seite' }).getAttribute('data-verweis')).toBe('https://example.org');
    expect(screen.getByText('Nichts').hasAttribute('data-verweis')).toBe(false);
  });
```

Run: `npx vitest run src/ui/info/Markdown.test.tsx`
Expected: FAIL — `getAttribute('data-verweis')` liefert `null` statt `'objekt:earth'`.

- [ ] **Schritt 7: Attribut in `src/ui/info/Markdown.tsx` setzen**

In `Verweisknoten` an allen drei Elementen das Attribut `data-verweis={ziel}` direkt hinter `className={VERWEIS_KNOPF}` einfügen: am externen Anker (`<a href={v.url} …>`), am Quellenanker (`<a href={v.quelle.url} …>`) und am Knopf (`<button type="button" …>`). Den Kommentar über der Funktion ergänzen:

```tsx
/**
 * Ein Verweis im Text. `data-verweis` trägt das Ziel aus der Datei, damit
 * Rundgänge im Browser die Art eines Verweises ablesen können, statt sie aus
 * Store-Änderungen zu erschließen (Abnahme 4c-3, Bekannte Unschärfen 8).
 */
```

Run: `npx vitest run src/ui/info/Markdown.test.tsx`
Expected: PASS.

- [ ] **Schritt 8: Umfeld prüfen und committen**

Run: `npx vitest run src/data src/ui/info` → PASS. `npm run lint` → ohne Befund. Erwartete Gesamtzahl nach diesem Task: 2357 (2003 + 353 + 1).

```bash
git add src/data/texte/dateien.test.ts src/ui/info/Markdown.tsx src/ui/info/Markdown.test.tsx
git commit -m "Texte: Prüfungen Ziel hat Text im selben Niveau und Quellenverweis hat Karte, data-verweis an Verweisen"
```

---

### Task 2: Quellenkarten für alle Szenen

**Befund (Planung, 16.09.2026):** Nur `mondfinsternis` hat Quellenkarten (fünf). Die übrigen 18 Szenen zeigten im Kino `info.keineQuellen`. Entwurf §4.4 Nachtrag (4c-3) lässt das für Szenen ausdrücklich zu; mit den Szenentexten dieser Etappe verweisen die Texte aber auf Quellen, deren Karten dann fehlen würden (Task 1 prüft das). Es kommen keine neuen Adressen hinzu, nur `szene:`-Einträge in vorhandenen `fuer`-Listen.

**Dateien:**
- Ändern: `src/data/quellen.test.ts` (Fall „bietet jedem Körper und jedem Thema mindestens eine Quelle")
- Ändern: `src/data/quellen.ts` (42 `fuer`-Listen)
- Ändern: `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md` §4.4 (Nachtrag)

**Schnittstellen:**
- Konsumiert: `SCENES` aus `src/data/scenes.ts` (im Test schon importiert).
- Produziert: `quellenFuer('szene:<id>')` liefert für jede der 19 Szenen mindestens eine Quelle. Die Szenentexte in Task 5 bis 8 verweisen nur auf Quellen, die hier ihrer Szene zugeordnet werden.

- [ ] **Schritt 1: Fehlschlagenden Test schreiben**

In `src/data/quellen.test.ts` den Fall `it('bietet jedem Körper und jedem Thema mindestens eine Quelle', …)` ersetzen durch:

```ts
  it('bietet jedem Körper, jedem Thema und jeder Szene mindestens eine Quelle', () => {
    const kennungen = [
      ...Object.keys(bodyIndex).map((id) => `objekt:${id}`),
      ...THEMEN.map((thema) => `thema:${thema.id}`),
      ...SCENES.map((szene) => `szene:${szene.id}`),
    ];
    expect(kennungen.filter((kennung) => quellenFuer(kennung).length === 0)).toEqual([]);
  });
```

- [ ] **Schritt 2: Test laufen lassen, er muss fehlschlagen**

Run: `npx vitest run src/data/quellen.test.ts`
Expected: FAIL — die Liste enthält die 18 Kennungen `szene:erdaufgang` … `szene:ceres-guertel` (alle außer `szene:mondfinsternis`).

- [ ] **Schritt 3: `fuer`-Listen in `src/data/quellen.ts` erweitern**

Je Quelle die `fuer`-Zeile (bei mehrzeiligen Listen den ganzen Block) durch die angegebene Fassung ersetzen. Reihenfolge und übrige Felder bleiben.

| Kennung | neue `fuer`-Liste |
|---|---|
| `nssdc-earth` | `['objekt:earth', 'szene:erdaufgang']` |
| `nssdc-moon` | `['objekt:moon', 'szene:mondfinsternis', 'szene:mondtanz']` |
| `nssdc-saturn` | `['objekt:saturn', 'szene:saturn-streiflicht']` |
| `nssdc-factsheets` | `['thema:modell', 'objekt:sun', 'thema:achsneigung', 'szene:systemblick']` |
| `nssdc-sun` | `['objekt:sun', 'szene:ferne-sonne']` |
| `nssdc-mercury` | `['objekt:mercury', 'szene:merkurjagd']` |
| `nssdc-mars` | `['objekt:mars', 'szene:phobos-tiefflug']` |
| `nssdc-jupiter` | `['objekt:jupiter', 'szene:jupiter-vorbeiflug']` |
| `nssdc-uranus` | `['objekt:uranus', 'szene:uranus-gekippt']` |
| `nssdc-neptune` | `['objekt:neptune', 'szene:ferne-sonne', 'szene:triton-rueckwaerts']` |
| `nssdc-pluto` | `['objekt:pluto', 'szene:pluto-charon']` |
| `nssdc-jupitermonde` | `['objekt:io', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto', 'szene:galileisches-schattenspiel']` |
| `nssdc-saturnmonde` | `['objekt:mimas', 'objekt:enceladus', 'objekt:tethys', 'objekt:dione', 'objekt:rhea', 'objekt:titan', 'objekt:iapetus', 'szene:titan-dunst', 'szene:enceladus-hell', 'szene:iapetus-schief']` |
| `nasa-earth` | `['objekt:earth', 'szene:erdaufgang']` |
| `nasa-saturn` | `['objekt:saturn', 'szene:saturn-ringkante']` |
| `nasa-moon` | `['objekt:moon', 'szene:mondfinsternis', 'szene:mondtanz']` |
| `nasa-cassini` | `['objekt:saturn', 'objekt:titan', 'objekt:enceladus', 'thema:ringe', 'szene:saturn-streiflicht', 'szene:ringdurchflug', 'szene:enceladus-hell']` |
| `esa-cassini-huygens` | `['objekt:saturn', 'objekt:titan', 'szene:titan-dunst']` |
| `esa-erdbeobachtung` | `['objekt:earth', 'szene:erdaufgang']` |
| `nasa-mercury` | `['objekt:mercury', 'szene:merkurjagd']` |
| `nasa-jupiter` | `['objekt:jupiter', 'szene:jupiter-vorbeiflug']` |
| `nasa-uranus` | `['objekt:uranus', 'szene:uranus-gekippt']` |
| `nasa-pluto` | `['objekt:pluto', 'objekt:charon', 'thema:zwergplaneten', 'szene:pluto-charon']` |
| `nasa-ceres` | `['objekt:ceres', 'thema:zwergplaneten', 'szene:ceres-guertel']` |
| `nasa-marsmonde` | `['objekt:phobos', 'objekt:deimos', 'szene:phobos-tiefflug']` |
| `nasa-jupitermonde` | `['objekt:io', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto', 'szene:galileisches-schattenspiel']` |
| `nasa-saturnmonde` | `['objekt:mimas', 'objekt:enceladus', 'objekt:tethys', 'objekt:dione', 'objekt:rhea', 'objekt:titan', 'objekt:iapetus', 'szene:enceladus-hell', 'szene:iapetus-schief']` |
| `nasa-triton` | `['objekt:triton', 'szene:triton-rueckwaerts']` |
| `nasa-gebundene-rotation` | `['thema:gebundene-rotation', 'objekt:moon', 'szene:mondtanz']` |
| `nasa-messenger` | `['objekt:mercury', 'szene:merkurjagd']` |
| `esa-mars-express` | `['objekt:mars', 'objekt:phobos', 'szene:phobos-tiefflug']` |
| `nasa-juno` | `['objekt:jupiter', 'szene:jupiter-vorbeiflug']` |
| `esa-juice` | `['objekt:jupiter', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto', 'szene:galileisches-schattenspiel']` |
| `nasa-new-horizons` | `['objekt:pluto', 'objekt:charon', 'szene:pluto-charon', 'szene:jupiter-vorbeiflug']` |
| `nasa-dawn` | `['objekt:ceres', 'szene:ceres-guertel']` |
| `jpl-photojournal-earth` | `['objekt:earth', 'szene:erdaufgang']` |
| `jpl-photojournal-saturn` | `['objekt:saturn', 'thema:ringe', 'szene:saturn-streiflicht', 'szene:saturn-ringkante', 'szene:ringdurchflug']` |
| `nasa-eyes` | `['objekt:sun', 'objekt:earth', 'objekt:saturn', 'thema:modell', 'szene:systemblick']` |
| `jpl-approx-pos` | `['thema:modell', 'thema:bahnelemente', 'objekt:earth', 'objekt:saturn', 'szene:systemblick']` |
| `pds-rings` | `['objekt:saturn', 'objekt:uranus', 'thema:ringe', 'szene:saturn-ringkante', 'szene:ringdurchflug', 'szene:uranus-gekippt']` |
| `jpl-satelliten-bahnen` | `['thema:bahnelemente', 'thema:modell', 'szene:triton-rueckwaerts', 'szene:iapetus-schief']` |
| `jpl-hauptguertel` | `['thema:kirkwood-luecken', 'objekt:ceres', 'szene:ceres-guertel']` |

`nasa-voyager-2` ist mehrzeilig; den Block ersetzen durch:

```ts
    fuer: [
      'objekt:uranus', 'objekt:neptune', 'objekt:triton',
      'objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon',
      'szene:ferne-sonne', 'szene:jupiter-vorbeiflug', 'szene:uranus-gekippt', 'szene:triton-rueckwaerts',
    ],
```

Lange Listen wie bei `nasa-voyager-2` oder `jpl-satelliten` mehrzeilig schreiben, wenn die Zeile sonst deutlich über die in der Datei üblichen Längen hinausgeht.

- [ ] **Schritt 4: Test laufen lassen, er muss bestehen**

Run: `npx vitest run src/data/quellen.test.ts src/data/texte`
Expected: PASS. Kontrolle, dass keine Körper- oder Themenzuordnung verloren ging: `git diff --stat src/data/quellen.ts` zeigt nur geänderte Zeilen innerhalb von `fuer`, und `git diff src/data/quellen.ts | grep '^-' | grep -o "'objekt:[a-z-]*'\|'thema:[a-z-]*'" | sort | uniq -c` ergibt dieselben Zählungen wie `git diff src/data/quellen.ts | grep '^+' | grep -o "'objekt:[a-z-]*'\|'thema:[a-z-]*'" | sort | uniq -c`.

- [ ] **Schritt 5: Nachtrag im Entwurf §4.4**

Hinter den Absatz „**Nachtrag (4c-3):** …" in `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md` einfügen:

```markdown
**Nachtrag (4c-4):** Mit den Szenentexten bekommt jede Szene Quellenkarten aus dem
vorhandenen Katalog (nur `szene:`-Einträge in `fuer`, keine neuen Adressen); der
Abdeckungstest schließt `info.keineQuellen` jetzt auch für Szenen aus.
```

- [ ] **Schritt 6: Lint und Commit**

`npm run lint` → ohne Befund. Gesamtzahl unverändert 2357.

```bash
git add src/data/quellen.ts src/data/quellen.test.ts docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md
git commit -m "Quellen: Karten für alle Kinoszenen, Abdeckungstest schließt Szenen ein"
```

---

### Task 3: Thema „Sonnensystem" mit Erklärung des Namens „Orrery"

**Auftrag (Jens, 16.09.2026):** „Beim Start und bei der Sicht auf das Sonnensystem (Wurzel beim Himmelskörper-Baum) zeige einen Text zum Sonnensystem an und erkläre auch den Begriff ‚Orrery' mit Quellenangabe." Dieser Task legt Thema, Titel, Quellen und Texte an; Task 4 schaltet die Anzeige.

**Quellenprüfung (16.09.2026):** Science Museum Group, Objekt 1952-73 „Orrery made by John Rowley for the Earl of Orrery", 1712–1713, zeigt die Bewegung von Erde und Mond um die Sonne, Name vermutlich Wortspiel mit „horary", Rowley womöglich angeregt durch ein älteres Gerät von George Graham, Gerät nur mit Sonne, Erde und Mond auch „tellurium" genannt (die Seite antwortet `curl` mit 403 wegen Bot-Schutz, im Browser erreichbar). Wikipedia deutsch „Orrery": Charles Boyle, 4. Earl of Orrery (1674–1731), Rowley ab 1713, deutsche Bezeichnungen Planetarium, Planetenmaschine, Tellurium. Wikipedia englisch „Orrery": Graham und Tompion um 1710, Orreries meist nicht maßstabsgetreu. NASA Science „Solar System": acht Planeten, fünf Zwergplaneten, mehrere hundert Monde. Die Zahlen zur Sonne (4,6 Milliarden Jahre, 99,86 % der Masse) stehen schon im Gymnasialtext `objekt-sun.md`.

**Dateien:**
- Ändern: `src/data/themen.ts` (Eintrag in `THEMEN`), `src/data/themen.test.ts`
- Ändern: `src/ui/i18n/de.ts` und `src/ui/i18n/en.ts` (Titelschlüssel)
- Ändern: `src/data/quellen.ts` (vier neue Einträge)
- Erstellen: `src/data/texte/{de,en}/{grundschule,gymnasium}/thema-sonnensystem.md`
- Ändern: Entwurf §4.5 (Nachtrag)

**Schnittstellen:**
- Konsumiert: `istThema(id)`, `THEMEN` aus `src/data/themen.ts`; Prüfungen aus Task 1.
- Produziert: Thema `sonnensystem` mit `titleKey: 'thema.sonnensystem.title'`; Quellen `nasa-sonnensystem`, `wikipedia-de-orrery`, `wikipedia-en-orrery`, `sciencemuseum-orrery`; die vier Texte. Task 4 und die Szene `systemblick` (Task 5) verweisen auf `thema:sonnensystem`.

- [ ] **Schritt 1: Fehlschlagenden Test schreiben**

In `src/data/themen.test.ts` im Fall `it('kennt drei Niveaus und erkennt Themen', …)` hinter `expect(istThema('modell')).toBe(true);` einfügen:

```ts
    expect(istThema('sonnensystem')).toBe(true);
```

Run: `npx vitest run src/data/themen.test.ts`
Expected: FAIL — `expected false to be true`.

- [ ] **Schritt 2: Thema und Titel anlegen**

`src/data/themen.ts`, in `THEMEN` hinter `{ id: 'modell', titleKey: 'thema.modell.title' },`:

```ts
  { id: 'sonnensystem', titleKey: 'thema.sonnensystem.title' },
```

`src/ui/i18n/de.ts` hinter `'thema.modell.title': 'Grenzen des Modells',`:

```ts
  'thema.sonnensystem.title': 'Das Sonnensystem',
```

`src/ui/i18n/en.ts` hinter `'thema.modell.title': 'Limits of the model',`:

```ts
  'thema.sonnensystem.title': 'The Solar System',
```

Run: `npx vitest run src/data/themen.test.ts src/ui/i18n`
Expected: PASS. (`src/data/quellen.test.ts` fällt jetzt, weil `thema:sonnensystem` noch keine Quelle hat; Schritt 3 behebt das.)

- [ ] **Schritt 3: Vier Quellen in `src/data/quellen.ts`**

Hinter dem Eintrag `wikipedia-en-lunar-eclipse` (Ende des Blocks mit den Wikipedia-Einträgen) einfügen:

```ts
  {
    id: 'wikipedia-de-orrery',
    titel: { de: 'Orrery (Wikipedia)', en: 'Orrery (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Orrery',
    fuer: ['thema:sonnensystem'],
  },
  {
    id: 'wikipedia-en-orrery',
    titel: { de: 'Orrery (englische Wikipedia)', en: 'Orrery (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Orrery',
    fuer: ['thema:sonnensystem'],
  },
```

Hinter dem Eintrag `nasa-dawn` (letzte Übersicht vor `// --- Bildarchive ---`) einfügen:

```ts
  {
    id: 'nasa-sonnensystem',
    titel: { de: 'Sonnensystem bei NASA Science', en: 'Solar System at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/solar-system/',
    fuer: ['thema:sonnensystem', 'szene:systemblick'],
  },
```

Hinter dem Eintrag `jpl-photojournal-saturn` (letztes Bildarchiv vor `// --- Werkzeuge ---`) einfügen:

```ts
  {
    // Sammlungsobjekt 1952-73; die Seite weist Skripte ohne Browserkennung
    // mit 403 ab, im Browser öffnet sie normal (geprüft 16.09.2026).
    id: 'sciencemuseum-orrery',
    titel: {
      de: 'Orrery von John Rowley für den Earl of Orrery (Science Museum Group)',
      en: 'Orrery made by John Rowley for the Earl of Orrery (Science Museum Group)',
    },
    herausgeber: 'sonstige', sprache: 'en', art: 'bildarchiv',
    url: 'https://collection.sciencemuseumgroup.org.uk/objects/co56970/orrery-made-by-john-rowley-for-the-earl-of-orrery',
    fuer: ['thema:sonnensystem'],
  },
```

Run: `npx vitest run src/data/quellen.test.ts`
Expected: PASS.

- [ ] **Schritt 4: Texte anlegen**

`src/data/texte/de/grundschule/thema-sonnensystem.md`:
```markdown
# Das Sonnensystem

In der Mitte steht die [Sonne](objekt:sun). Um sie kreisen acht Planeten: innen die
kleinen Gesteinsplaneten wie die [Erde](objekt:earth), weiter außen die vier Riesen wie
[Jupiter](objekt:jupiter). Dazu kommen Monde, [Zwergplaneten](thema:zwergplaneten) und
unzählige kleine Brocken aus Gestein und Eis.

Dieses Programm heißt Orrery. So nennt man ein Modell des Sonnensystems, in dem
Zahnräder kleine Kugeln um eine Sonne in der Mitte bewegen. Der Name kommt vom Earl of
Orrery, einem Adligen, für den vor gut 300 Jahren so ein Gerät gebaut wurde. Dieses Gerät
steht heute in einem [Museum in London](quelle:sciencemuseum-orrery).
```

`src/data/texte/en/grundschule/thema-sonnensystem.md`:
```markdown
# The Solar System

The [Sun](objekt:sun) sits in the middle. Eight planets travel around it: the small rocky
planets such as the [Earth](objekt:earth) on the inside, the four giants such as
[Jupiter](objekt:jupiter) further out. There are also moons,
[dwarf planets](thema:zwergplaneten) and countless chunks of rock and ice.

This program is called Orrery. That is the name for a model of the Solar System in which
gear wheels move small balls around a Sun. The name comes from the Earl of Orrery, a
nobleman for whom such a device was built over 300 years ago. That device is now kept in
a [museum in London](quelle:sciencemuseum-orrery).
```

`src/data/texte/de/gymnasium/thema-sonnensystem.md`:
```markdown
# Das Sonnensystem

Das Sonnensystem entstand vor rund 4,6 Milliarden Jahren aus einer rotierenden Wolke aus
Gas und Staub. Fast die gesamte Masse sammelte sich in der [Sonne](objekt:sun), die heute
99,86 % davon enthält; aus der flachen Scheibe um sie herum bildeten sich die Planeten.
Deshalb umlaufen alle acht die Sonne im selben Drehsinn und nahezu in derselben Ebene.

Innen liegen die vier Gesteinsplaneten [Merkur](objekt:mercury), [Venus](objekt:venus),
[Erde](objekt:earth) und [Mars](objekt:mars), dahinter der Asteroidengürtel mit dem
[Zwergplaneten](thema:zwergplaneten) [Ceres](objekt:ceres). Weiter außen folgen die
Gasriesen [Jupiter](objekt:jupiter) und [Saturn](objekt:saturn) und die Eisriesen
[Uranus](objekt:uranus) und [Neptun](objekt:neptune). Neptun umläuft die Sonne in 30 AE
Abstand, ihr Licht braucht gut vier Stunden bis zu ihm. Jenseits davon liegt der
Kuipergürtel mit [Pluto](objekt:pluto) und weiteren Zwergplaneten. Die Simulation führt
35 Körper, die Sonne, acht Planeten, 21 Monde und fünf Zwergplaneten, und zeigt die beiden
Gürtel als Punktwolken. Überblick in Bewegung: [Das System von oben](szene:systemblick).

Orrery heißen mechanische Modelle des Sonnensystems, in denen Zahnräder Planetenkugeln so
bewegen, dass ihre Umlaufzeiten im richtigen Verhältnis stehen. Der Name geht auf Charles
Boyle zurück, den vierten Earl of Orrery (1674–1731). Für ihn baute der Londoner
Instrumentenbauer John Rowley um 1713 ein solches Gerät, vermutlich angeregt durch ein
älteres des Uhrmachers George Graham. Rowleys Orrery zeigt nur Sonne, Erde und Mond und
gehört heute dem Science Museum in London
([Sammlungsobjekt](quelle:sciencemuseum-orrery)). Im Deutschen hießen solche Geräte früher
Planetarium oder Planetenmaschine; eines, das nur Sonne, Erde und Mond zeigt, heißt
Tellurium ([Wikipedia](quelle:wikipedia-de-orrery)). Maßstabsgetreu ist praktisch kein
Orrery, die Planeten wären sonst winzige Punkte. Auch dieses Programm vergrößert in der
Voreinstellung „Schaubild" die Körper und staucht die Abstände; anders als ein Räderwerk
berechnet es die Stellungen aber aus [Bahnelementen](thema:bahnelemente)
([Grenzen des Modells](thema:modell)).
```

`src/data/texte/en/gymnasium/thema-sonnensystem.md`:
```markdown
# The Solar System

The Solar System formed about 4.6 billion years ago from a rotating cloud of gas and
dust. Almost all of the mass collected in the [Sun](objekt:sun), which today holds
99.86 % of it; the planets formed from the flat disc around it. That is why all eight
orbit the Sun in the same direction and almost in the same plane.

The four rocky planets [Mercury](objekt:mercury), [Venus](objekt:venus),
[Earth](objekt:earth) and [Mars](objekt:mars) lie on the inside, followed by the asteroid
belt with the [dwarf planet](thema:zwergplaneten) [Ceres](objekt:ceres). Further out come
the gas giants [Jupiter](objekt:jupiter) and [Saturn](objekt:saturn) and the ice giants
[Uranus](objekt:uranus) and [Neptune](objekt:neptune). Neptune orbits the Sun at 30 AU;
sunlight takes just over four hours to reach it. Beyond lies the Kuiper belt with
[Pluto](objekt:pluto) and further dwarf planets. The simulation contains 35 bodies, the
Sun, eight planets, 21 moons and five dwarf planets, and shows the two belts as clouds of
points. Overview in motion: [The Solar System from above](szene:systemblick).

Orreries are mechanical models of the Solar System in which gear wheels move planet globes
so that their orbital periods keep the right proportions. The name goes back to Charles
Boyle, the fourth Earl of Orrery (1674–1731). The London instrument maker John Rowley
built such a device for him around 1713, probably inspired by an older one by the
clockmaker George Graham. Rowley's orrery shows only the Sun, the Earth and the Moon and
belongs to the Science Museum in London today
([collection object](quelle:sciencemuseum-orrery)); a device that shows only these three
is also called a tellurium ([Wikipedia](quelle:wikipedia-en-orrery)). Hardly any orrery
is to scale, or the planets would be tiny dots. This program, too, enlarges the bodies
and compresses the distances in its default setting "Diagram"; unlike a gear train,
however, it calculates the positions from [orbital elements](thema:bahnelemente)
([Limits of the model](thema:modell)).
```

- [ ] **Schritt 5: Nachtrag im Entwurf §4.5**

Hinter den Absatz, der mit „`src/data/themen.ts`: `{ id: string; titleKey: string }[]`." beginnt, einfügen:

```markdown
**Nachtrag (4c-4, Jens 16.09.2026):** Neuntes Thema `sonnensystem` („Das Sonnensystem"):
Überblick über das System und Erklärung des Namens „Orrery" mit Quellen (Science Museum
Group, Wikipedia). Es erscheint beim Start und an der Wurzel des Objektbaums (§3.3).
```

- [ ] **Schritt 6: Tests und Commit**

Run: `npx vitest run src/data src/ui/i18n` → PASS. `npm run lint` → ohne Befund. Erwartete Gesamtzahl: 2385 (2357 + 4 Dateien × 7).

```bash
git add src/data/themen.ts src/data/themen.test.ts src/ui/i18n/de.ts src/ui/i18n/en.ts src/data/quellen.ts src/data/texte docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md
git commit -m "Thema Sonnensystem mit Erklärung des Namens Orrery, vier Quellen"
```

---

### Task 4: Start, Wurzel und Zurücksetzen zeigen das Sonnensystem

**Befund (Planung, 16.09.2026):** Das Panel zeigt ein Thema, solange `ui.info.thema` gesetzt ist (`aktuellerText` in `src/ui/info/aktuellerText.ts`), sonst die laufende Szene, sonst das Kameraziel. Beim Start ist das Ziel die Sonne (`DEFAULT_STATE.camera.targetId`), der Klick auf die Wurzel fährt über `fahreZuSystem` ebenfalls zur Sonne; beides zeigt heute den Sonnentext. Zwei Stellen verhindern, dass ein gesetztes Thema stehen bleibt:
1. Der Effekt in `InfoPanel.tsx` verwirft das Thema, sobald sich die Grundlage (Ziel oder Szene) ändert. `fahreZuSystem` von Mars aus setzt Ziel und Thema zugleich; der Effekt sähe nur den Zielwechsel und löschte das eben gesetzte Thema.
2. `fahreZu('sun')` nach der Systemansicht ändert die Grundlage nicht (Ziel bleibt Sonne); der Effekt greift nicht, das Thema bliebe fälschlich stehen.

Lösung: Der Effekt verwirft ein Thema nur, wenn es beim Grundlagenwechsel **unverändert** blieb; `fahreZu` verwirft das Thema selbst; `fahreZuSystem`, `zurueckgesetzt` und `startZustand` setzen es. Der Standardzustand `DEFAULT_STATE` bleibt unverändert (Thema `null`), damit Tests und Links, die vom Standard ausgehen, weiter das Kameraziel zeigen (Ruling 3).

**Dateien:**
- Ändern: `src/data/themen.ts` (Konstante `SYSTEM_THEMA`)
- Ändern: `src/app/persistenz.ts` (`startZustand`), `src/app/persistenz.test.ts`
- Ändern: `src/store/persist.ts` (`zurueckgesetzt`), `src/store/persist.test.ts`
- Ändern: `src/ui/kamerafahrt.ts` (`fahreZu`, `fahreZuSystem`, `fahre`), `src/ui/kamerafahrt.test.ts`
- Ändern: `src/ui/info/InfoPanel.tsx` (Effekt „Thema verfällt"), `src/ui/info/InfoPanel.test.tsx`
- Ändern: Entwurf §3.3 und §7 (Nachträge)

**Schnittstellen:**
- Konsumiert: Thema `sonnensystem` und dessen Gymnasialtext aus Task 3 (Überschrift „Das Sonnensystem"); `sitzungLesen(ablage): Plain | null`, `sitzungMerkenLesen(ablage)` aus `src/store/persist.ts`; `replaceAll`, `setCamera`, `setInfo` aus dem Store.
- Produziert: `export const SYSTEM_THEMA = 'sonnensystem'` in `src/data/themen.ts`. Verhalten: `startZustand` ohne gültiges Fragment und ohne gelesene Sitzung liefert `ui.info.thema === 'sonnensystem'`; `zurueckgesetzt(s).ui.info.thema === 'sonnensystem'`; nach `fahreZuSystem()` gilt `ui.info.thema === 'sonnensystem'`, nach `fahreZu(id)` gilt `ui.info.thema === null`.

- [ ] **Schritt 1: Fehlschlagende Tests schreiben**

`src/app/persistenz.test.ts`: Den Fall `it('liefert den Standard ohne Fragment und ohne Sitzung', …)` ersetzen durch:

```ts
  it('liefert ohne Fragment und ohne Sitzung den Standard mit dem Thema Sonnensystem', () => {
    const erwartet = structuredClone(DEFAULT_STATE);
    erwartet.ui.info.thema = 'sonnensystem';
    expect(startZustand(umgebung())).toEqual(erwartet);
  });

  it('zeigt das Sonnensystem nicht, wenn ein Link oder eine Sitzung den Start bestimmt', () => {
    const ablage = ablageFake();
    ablage.daten.set(SCHLUESSEL_SITZUNG, JSON.stringify({ camera: { targetId: 'mars' } }));
    expect(startZustand(umgebung({ ablage })).ui.info.thema).toBeNull();
    const link = umgebung({ hash: '#p=' + encodePatch({ camera: { targetId: 'mars' } }) });
    expect(startZustand(link).ui.info.thema).toBeNull();
  });
```

Im Fall `it('ungültiges Fragment ohne Sitzung: Standard, Fragment trotzdem entfernt', …)` die Zeile `expect(startZustand(u)).toEqual(DEFAULT_STATE);` ersetzen durch:

```ts
    const erwartet = structuredClone(DEFAULT_STATE);
    erwartet.ui.info.thema = 'sonnensystem';
    expect(startZustand(u)).toEqual(erwartet);
```

`src/store/persist.test.ts`: Den Fall `it('zurueckgesetzt behält Niveau, Breite und Teilung, löscht das Thema', …)` ersetzen durch:

```ts
  it('zurueckgesetzt behält Niveau, Breite und Teilung und zeigt das Thema Sonnensystem', () => {
    const aktuell = structuredClone(DEFAULT_STATE);
    aktuell.ui.info = { niveau: 'hochschule', breiteRem: 40, teilung: 0.3, thema: 'modell' };
    aktuell.scale.sizeScale = 3;
    const s = zurueckgesetzt(aktuell);
    expect(s.ui.info).toEqual({ niveau: 'hochschule', breiteRem: 40, teilung: 0.3, thema: 'sonnensystem' });
    expect(s.scale.sizeScale).toBe(DEFAULT_STATE.scale.sizeScale);
  });
```

`src/ui/kamerafahrt.test.ts`: Im `describe('fahreZu', …)` als letzten Fall einfügen:

```ts
  it('verwirft ein gewähltes Thema, auch wenn das Ziel gleich bleibt', () => {
    useStore.getState().setInfo({ thema: 'sonnensystem' });
    fahreZu('sun', planer().optionen);
    expect(useStore.getState().camera.targetId).toBe('sun');
    expect(useStore.getState().ui.info.thema).toBeNull();
  });
```

Im `describe('fahreZuSystem', …)` als letzten Fall einfügen:

```ts
  it('setzt das Thema Sonnensystem im selben Zug wie das Ziel', () => {
    useStore.getState().setCamera({ targetId: 'saturn' });
    useStore.getState().setInfo({ thema: 'ringe' });
    const zuege: Array<[string, string | null]> = [];
    const abbestellen = useStore.subscribe((s) => { zuege.push([s.camera.targetId, s.ui.info.thema]); });
    fahreZuSystem(planer().optionen);
    abbestellen();
    expect(useStore.getState().ui.info.thema).toBe('sonnensystem');
    // Kein Zwischenstand, in dem das Ziel schon Sonne ist, das Thema aber noch fehlt.
    expect(zuege.filter(([ziel, thema]) => ziel === 'sun' && thema !== 'sonnensystem')).toEqual([]);
  });
```

`src/ui/info/InfoPanel.test.tsx`: Importe ergänzen:

```tsx
import { fahrtAbbrechen, fahreZuSystem } from '../kamerafahrt';
import { zurueckgesetzt } from '../../store/persist';
```

(die bisherige Zeile `import { fahrtAbbrechen } from '../kamerafahrt';` entfällt). Hinter dem Fall „Themenverweis wechselt den Text; ein Zielwechsel löscht das Thema" einfügen:

```tsx
  it('Wurzel des Objektbaums und Zurücksetzen zeigen das Sonnensystem, obwohl das Ziel wechselt', async () => {
    useStore.getState().setCamera({ targetId: 'mars' });
    render(<InfoPanel />);
    expect(await titel('Mars')).toBeTruthy();
    act(() => { fahreZuSystem(); });
    fahrtAbbrechen();
    expect(useStore.getState().ui.info.thema).toBe('sonnensystem');
    expect(await titel('Das Sonnensystem')).toBeTruthy();
    act(() => { useStore.getState().setCamera({ targetId: 'mars' }); });
    expect(useStore.getState().ui.info.thema).toBeNull();
    expect(await titel('Mars')).toBeTruthy();
    act(() => { useStore.getState().replaceAll(zurueckgesetzt(useStore.getState())); });
    expect(useStore.getState().ui.info.thema).toBe('sonnensystem');
    expect(await titel('Das Sonnensystem')).toBeTruthy();
  });
```

- [ ] **Schritt 2: Tests laufen lassen, sie müssen fehlschlagen**

Run: `npx vitest run src/app/persistenz.test.ts src/store/persist.test.ts src/ui/kamerafahrt.test.ts src/ui/info/InfoPanel.test.tsx`
Expected: FAIL in genau diesen Fällen: persistenz (Standard mit Thema, ungültiges Fragment ohne Sitzung: `thema` ist `null`), persist (`thema` ist `null`), kamerafahrt „verwirft ein gewähltes Thema …" (`'sonnensystem'` statt `null`) und „setzt das Thema Sonnensystem …" (`'ringe'`), InfoPanel „Wurzel des Objektbaums …" (`thema` ist `null` statt `'sonnensystem'`). Der neue persistenz-Fall „zeigt das Sonnensystem nicht …" besteht schon jetzt.

- [ ] **Schritt 3: Konstante in `src/data/themen.ts`**

Hinter dem Array `THEMEN` einfügen:

```ts
/**
 * Thema der Übersicht: Das Infopanel zeigt es beim Start ohne Link und ohne
 * Sitzung, nach „Zurücksetzen" und nach einem Klick auf die Wurzel des
 * Objektbaums (Entwurf 4c §3.3, Nachtrag 4c-4).
 */
export const SYSTEM_THEMA = 'sonnensystem';
```

- [ ] **Schritt 4: `startZustand` in `src/app/persistenz.ts`**

Import ergänzen:

```ts
import { SYSTEM_THEMA } from '../data/themen';
```

Im Rumpf von `startZustand` die Zeilen

```ts
  const patch = dekodiert ?? (sitzungMerkenLesen(u.ablage) ? sitzungLesen(u.ablage) ?? {} : {});
  const state = fromShareable(patch);
  state.ui.language = startSprache(u.navigatorLanguage, spracheAus(patch));
  return state;
```

ersetzen durch:

```ts
  const sitzung = dekodiert === null && sitzungMerkenLesen(u.ablage) ? sitzungLesen(u.ablage) : null;
  const patch = dekodiert ?? sitzung ?? {};
  const state = fromShareable(patch);
  state.ui.language = startSprache(u.navigatorLanguage, spracheAus(patch));
  // Ohne Link und ohne gemerkte Sitzung beginnt die Anwendung mit der
  // Übersicht: Das Infopanel erklärt das Sonnensystem (Jens, 16.09.2026).
  // Ein Link führt kein Thema (Entwurf §4.6) und zeigt deshalb sein Ziel.
  if (dekodiert === null && sitzung === null) state.ui.info.thema = SYSTEM_THEMA;
  return state;
```

Im JSDoc über `startZustand` hinter dem Satz „… ein gültiges (auch ein gültig-leeres) Fragment ersetzt sie in jedem Fall." ergänzen: „Nur der Start aus dem Standard setzt das Thema Sonnensystem."

- [ ] **Schritt 5: `zurueckgesetzt` in `src/store/persist.ts`**

Import ergänzen:

```ts
import { SYSTEM_THEMA } from '../data/themen';
```

Die Zeile `  s.ui.info = { ...aktuell.ui.info, thema: null };` ersetzen durch:

```ts
  // Zurücksetzen führt in die Startansicht und zeigt deshalb wie ein frischer
  // Start das Sonnensystem (Plan 4c-4, Ruling 4).
  s.ui.info = { ...aktuell.ui.info, thema: SYSTEM_THEMA };
```

- [ ] **Schritt 6: Kamerafahrt in `src/ui/kamerafahrt.ts`**

Import ergänzen:

```ts
import { SYSTEM_THEMA } from '../data/themen';
```

`fahreZu`: Aufruf `fahre(id, (_jd, scale) => fokusAbstand(body, scale), null, optionen);` ersetzen durch `fahre(id, (_jd, scale) => fokusAbstand(body, scale), null, null, optionen);` und im JSDoc hinter „Die Kamera wechselt in den Modus Geheftet." ergänzen: „Ein gewähltes Thema verfällt, auch wenn das Ziel gleich bleibt: Der Klick auf die Sonne nach der Systemansicht zeigt den Sonnentext."

`fahreZuSystem`: Aufruf `fahre('sun', (jd, scale) => systemAbstand(jd, scale, seiten), DRAUFSICHT_ELEVATION, optionen);` ersetzen durch `fahre('sun', (jd, scale) => systemAbstand(jd, scale, seiten), DRAUFSICHT_ELEVATION, SYSTEM_THEMA, optionen);` und im JSDoc hinter „Sonst wie `fahreZu`." ergänzen: „Das Infopanel zeigt danach das Thema Sonnensystem (Entwurf 4c §3.3, Nachtrag 4c-4)."

`fahre`: Signatur um den Parameter `thema: string | null` hinter `zielElevation` erweitern:

```ts
function fahre(
  id: string,
  zielAbstand: (jd: number, scale: ScaleSettings) => number,
  zielElevation: number | null,
  thema: string | null,
  optionen: FahrtOptionen,
): void {
```

Im Rumpf die Zeile `  const { camera, scale, time, setCamera } = useStore.getState();` ersetzen durch `  const { camera, scale, time } = useStore.getState();` und den Aufruf

```ts
  setCamera({ targetId: id, mode: 'attached', freezeJd: null });
```

(samt der drei Kommentarzeilen darüber, die bleiben) ersetzen durch:

```ts
  // Ziel und Thema in einem Zug: Das Infopanel verwirft ein Thema nur, wenn
  // die Grundlage wechselt und das Thema dabei gleich bleibt (InfoPanel.tsx).
  useStore.setState((s) => ({
    camera: { ...s.camera, targetId: id, mode: 'attached', freezeJd: null },
    ui: { ...s.ui, info: { ...s.ui.info, thema } },
  }));
```

- [ ] **Schritt 7: Effekt in `src/ui/info/InfoPanel.tsx`**

Den Block

```tsx
  // Ein gewähltes Thema verfällt, sobald Ziel oder Szene wechseln (§3.3).
  const vorigeBasis = useRef(basis);
  useEffect(() => {
    if (vorigeBasis.current === basis) return;
    vorigeBasis.current = basis;
    if (useStore.getState().ui.info.thema !== null) setInfo({ thema: null });
  }, [basis, setInfo]);
```

ersetzen durch:

```tsx
  // Ein gewähltes Thema verfällt, sobald Ziel oder Szene wechseln (§3.3) —
  // außer es wurde im selben Zug gesetzt: Wurzel des Objektbaums und
  // „Zurücksetzen" wechseln das Ziel und zeigen zugleich das Sonnensystem.
  const vorigeBasis = useRef(basis);
  const vorigesThema = useRef(info.thema);
  useEffect(() => {
    const basisGewechselt = vorigeBasis.current !== basis;
    const themaGewechselt = vorigesThema.current !== info.thema;
    vorigeBasis.current = basis;
    vorigesThema.current = info.thema;
    if (basisGewechselt && !themaGewechselt && info.thema !== null) setInfo({ thema: null });
  }, [basis, info.thema, setInfo]);
```

- [ ] **Schritt 8: Tests laufen lassen, sie müssen bestehen**

Run: `npx vitest run src/app src/store src/ui`
Expected: PASS, auch die bestehenden Fälle „Themenverweis wechselt den Text; ein Zielwechsel löscht das Thema" (InfoPanel), die Verweisfälle in `verweisAusfuehren.test.ts` und die Schichtentests.

- [ ] **Schritt 9: Nachträge im Entwurf**

§3.3, hinter dem letzten Punkt der Liste („Bei jedem Textwechsel scrollt das obere Segment nach oben. …"):

```markdown
**Nachtrag (4c-4, Jens 16.09.2026):** Beim Start ohne Link und ohne gemerkte Sitzung,
nach „Zurücksetzen" und nach einem Klick auf die Wurzel „Sonnensystem" im Objektbaum
zeigt das Panel das Thema `sonnensystem`. `startZustand`, `zurueckgesetzt` und
`fahreZuSystem` setzen dazu `ui.info.thema`. Ein Thema, das im selben Zug wie ein neues
Ziel gesetzt wird, bleibt stehen; `fahreZu` verwirft ein Thema auch dann, wenn das Ziel
gleich bleibt (der Klick auf „Sonne" nach der Systemansicht zeigt den Sonnentext). Der
Standardzustand und Links bleiben ohne Thema.
```

§7, hinter dem Nachtrag vom 14.09.2026 (nach Punkt 4 „**4c-4 Szenen:** …"):

```markdown
**Nachtrag (16.09.2026, Jens):** 4c-4 umfasst zusätzlich das Thema `sonnensystem` in
beiden Niveaus und Sprachen samt Anzeige beim Start und an der Wurzel des Objektbaums
(§3.3, §4.5), Quellenkarten für alle Szenen (§4.4) und den Dateitest „Quellenverweis hat
eine Karte".
```

- [ ] **Schritt 10: Lint, Tests, Commit**

`npm run lint` → ohne Befund. `npx vitest run` → PASS, erwartete Gesamtzahl 2389 (2385 + 4: ein neuer persistenz-Fall, zwei kamerafahrt-Fälle, ein InfoPanel-Fall).

```bash
git add src/data/themen.ts src/app/persistenz.ts src/app/persistenz.test.ts src/store/persist.ts src/store/persist.test.ts src/ui/kamerafahrt.ts src/ui/kamerafahrt.test.ts src/ui/info/InfoPanel.tsx src/ui/info/InfoPanel.test.tsx docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md
git commit -m "Infopanel: Sonnensystem beim Start, nach Zurücksetzen und an der Wurzel des Objektbaums"
```

---

### Task 5: Szenen um Erde, Mond, Merkur und das ganze System

**Sachstand (Planung, 16.09.2026, aus `src/data/scenes.ts` und den Datensätzen):**
- `erdaufgang`: Umlaufkamera um die Erde, 2,4 Erdradien (Streuung 0,9 bis 1,3), Elevation 6° (−4 bis +10), Azimut zufällig und 1,2°/s, 40 s bei 0,02 d/s (28,8 min je Sekunde, gut 19 Stunden). Erdtextur ohne Wolken, keine Atmosphäre (`ASSETS.md`). Terminator am Äquator 40 075 km / 24 h ≈ 1 670 km/h.
- `mondtanz`: Umlaufkamera um die Erde, 150 Erdradien, Elevation 55° (30 bis 85), 45 s bei 0,9 d/s = 40,5 Tage. Mond e = 0,0549, a = 384 400 km → 363 300 / 405 500 km; Bahnradius 60,3 Erdradien. Mondabstände skalieren mit `sizeScale` (`src/sim/scale.ts`). Schwerpunkt 4 670 km vom Erdmittelpunkt; die Erde steht im Modell auf dem Erde-Mond-Schwerpunkt der Tabelle.
- `merkurjagd`: Verfolgerkamera, 9 Merkurradien, 30 s bei 2 d/s = 60 Tage = 0,68 Umläufe. Perihel 46,0 Mio. km bei 58,98 km/s, Aphel 69,8 Mio. km bei 38,86 km/s (NSSDC), Mittel 47,4 km/s. Sonne 1/0,3075 = 3,25-fach, 1/0,4667 = 2,14-fach. Winkelgeschwindigkeit im Perihel 6,35°/d gegen Drehung 6,14°/d.
- `systemblick`: Systemkamera, Elevation 78° (53 bis 88, positiv = ekliptikal Nord laut `aufKugel`), Azimut 0,9°/s, 60 s bei 30 d/s = 1 800 Tage = 4,93 Jahre: Merkur 20,5, Erde 4,93, Jupiter 0,42, Neptun 0,030 Umläufe. 30,07 / 0,387 = 77,7. Beide Gürtel sind standardmäßig sichtbar.
- `ferne-sonne`: feste Kamera 12 Neptunradien neben Neptun, Blick zur Sonne. 30,07 AE → 1/904 der Bestrahlungsstärke, Sonnendurchmesser 1 919″ / 30,07 = 64″, Helligkeit −26,74 + 5 lg 30,07 = −19,35 mag, gegen den Vollmond (−12,74 mag) Faktor 10^(0,4 · 6,61) ≈ 440. Im „Schaubild" ist der Sonnenradius 50 · 0,35 = 17,5-fach, der Abstand auf 7,7 AE gestaucht (Scheibe rund 1,2°). Ob Neptun selbst im Bild ist, hängt vom Datum ab; die Texte behaupten es nicht.

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/{grundschule,gymnasium}/szene-{erdaufgang,mondtanz,merkurjagd,systemblick,ferne-sonne}.md`
- Ändern: `src/data/texte/dateien.test.ts` (fünf Einträge aus `AUSSTEHEND` streichen)

**Schnittstellen:**
- Konsumiert: Quellenkarten aus Task 2 (`jpl-photojournal-earth` für `erdaufgang`, `nasa-messenger` für `merkurjagd`, `nasa-eyes` für `systemblick`, `nasa-voyager-2` und `nssdc-neptune` für `ferne-sonne`); Thema `sonnensystem` aus Task 3; Verweise `objekt:earth`, `objekt:sun`, `objekt:moon`, `objekt:mercury`, `objekt:jupiter`, `objekt:neptune`, `thema:achsneigung`, `thema:gebundene-rotation`, `thema:modell`, `thema:bahnelemente`, `szene:mondfinsternis`.
- Produziert: nichts für spätere Tasks.

- [ ] **Schritt 1: Dateien anlegen**

`de/grundschule/szene-erdaufgang.md`:
```markdown
# Sonnenaufgang über dem Erdrand

Die Kamera schwebt hoch über der [Erde](objekt:earth). Die [Sonne](objekt:sun) scheint
immer nur auf eine Hälfte der Erde, dort ist Tag. Auf der anderen Hälfte ist Nacht. Weil
sich die Erde dreht, wandert die Grenze zwischen Tag und Nacht über Länder und Meere. Wo
sie gerade ankommt, geht die Sonne auf. In dieser Szene vergeht in jeder Sekunde fast eine
halbe Stunde, so siehst du die Erde sich drehen.
```

`en/grundschule/szene-erdaufgang.md`:
```markdown
# Sunrise over the limb of the Earth

The camera floats high above the [Earth](objekt:earth). The [Sun](objekt:sun) only ever
shines on one half of the Earth, where it is day. On the other half it is night. Because
the Earth turns, the line between day and night moves across countries and seas. Wherever
it arrives, the Sun is just rising. In this scene almost half an hour passes every second,
so you can watch the Earth turn.
```

`de/gymnasium/szene-erdaufgang.md`:
```markdown
# Szene: Sonnenaufgang über dem Erdrand

Die Kamera umkreist die [Erde](objekt:earth) in zwei bis drei Erdradien Abstand vom
Mittelpunkt, einige tausend Kilometer über der Oberfläche. Die [Sonne](objekt:sun)
beleuchtet stets eine Hälfte der Erde. Die Grenze zwischen Tag- und Nachtseite heißt
Terminator; wer an ihr steht, erlebt gerade Sonnenaufgang oder Sonnenuntergang. Weil sich
die Erde in 24 Stunden einmal dreht, wandert der Terminator am Äquator mit rund 1 670 km/h
nach Westen. Wegen der [Achsneigung](thema:achsneigung) von 23,4° verläuft er nur zu den
Tagundnachtgleichen durch die Pole; zur Sommersonnenwende im Juni liegt das ganze Gebiet
nördlich des Polarkreises auf der Tagseite. Je nach Blickrichtung zeigt die Szene die
Tagseite, die Nachtseite oder den Übergang.

Die Uhr läuft knapp 30 Minuten je Sekunde, die Drehung der Erde wird dadurch sichtbar. Eine
Raumstation in rund 400 km Höhe umrundet die Erde in etwa 90 Minuten und erlebt so rund
16 Sonnenaufgänge am Tag. In Wirklichkeit färbt die Atmosphäre den Übergang und leuchtet
als dünner Saum am Erdrand; die Simulation zeigt die Erde ohne Atmosphäre und ohne Wolken.
Aufnahmen aus dem All: [Photojournal Erde](quelle:jpl-photojournal-earth).
```

`en/gymnasium/szene-erdaufgang.md`:
```markdown
# Scene: Sunrise over the limb of the Earth

The camera circles the [Earth](objekt:earth) at two to three Earth radii from its centre,
several thousand kilometres above the surface. The [Sun](objekt:sun) always lights one
half of the Earth. The boundary between the day side and the night side is called the
terminator; anyone standing on it is experiencing sunrise or sunset. Because the Earth
turns once in 24 hours, the terminator moves westwards at about 1,670 km/h at the equator.
Because of the [axial tilt](thema:achsneigung) of 23.4°, it runs through the poles only at
the equinoxes; at the June solstice the whole region north of the Arctic Circle lies on
the day side. Depending on the viewing direction, the scene shows the day side, the night
side or the transition.

The clock runs at almost 30 minutes per second, which makes the Earth's rotation visible.
A space station about 400 km up circles the Earth in roughly 90 minutes and so sees about
16 sunrises a day. In reality the atmosphere colours the transition and glows as a thin
rim along the limb; the simulation shows the Earth without atmosphere and without clouds.
Pictures from space: [Photojournal Earth](quelle:jpl-photojournal-earth).
```

`de/grundschule/szene-mondtanz.md`:
```markdown
# Der Tanz des Mondes

Hier schaust du von weit oben auf die [Erde](objekt:earth) und den [Mond](objekt:moon).
Die Zeit läuft sehr schnell: In jeder Sekunde vergeht fast ein ganzer Tag. So siehst du,
wie der Mond in knapp einem Monat einmal um die Erde kreist. Dabei zeigt er der Erde immer
dieselbe Seite, das heißt [gebundene Rotation](thema:gebundene-rotation). Die Erde dreht
sich in dieser Zeit etwa 27-mal um sich selbst.
```

`en/grundschule/szene-mondtanz.md`:
```markdown
# The dance of the Moon

Here you look down from high above on the [Earth](objekt:earth) and the
[Moon](objekt:moon). Time runs very fast: almost a whole day passes every second. So you
can see how the Moon circles the Earth once in just under a month. It always shows the
Earth the same side, which is called [tidal locking](thema:gebundene-rotation). In that
time the Earth turns about 27 times.
```

`de/gymnasium/szene-mondtanz.md`:
```markdown
# Szene: Der Tanz des Mondes

Die Szene zeigt [Erde](objekt:earth) und [Mond](objekt:moon) schräg von oben aus rund
150 Erdradien Entfernung. Bei 0,9 Tagen je Sekunde umläuft der Mond die Erde in gut
30 Sekunden einmal. Seine Bahn ist leicht elliptisch (e ≈ 0,055): Der Abstand schwankt
zwischen rund 363 000 km im erdnächsten Punkt, dem Perigäum, und 405 000 km im Apogäum,
und nach dem zweiten Keplerschen Gesetz ist der Mond erdnah schneller als erdfern. Der
Bahnradius beträgt rund 60 Erdradien. Dieses Verhältnis bleibt bei jeder Einstellung der
Maßstabsregler erhalten, weil die Simulation Mondabstände mit demselben Faktor vergrößert
wie die Körper.

Der Mond rotiert [gebunden](thema:gebundene-rotation) und wendet der Erde stets dieselbe
Seite zu. Ein Umlauf gegenüber den Sternen dauert 27,3 Tage, von Vollmond zu Vollmond
vergehen 29,5 Tage. Genau genommen umkreisen beide Körper ihren gemeinsamen Schwerpunkt,
der rund 4 700 km vom Erdmittelpunkt entfernt noch im Erdinneren liegt; die Erde schlingert
also im Monatstakt ein wenig. Die Simulation führt den Mond um die Erde selbst und lässt
diese nicht mitschwingen ([Grenzen des Modells](thema:modell)). Weitere Szene:
[Mondfinsternis](szene:mondfinsternis).
```

`en/gymnasium/szene-mondtanz.md`:
```markdown
# Scene: The dance of the Moon

The scene shows the [Earth](objekt:earth) and the [Moon](objekt:moon) obliquely from above
at a distance of about 150 Earth radii. At 0.9 days per second the Moon orbits the Earth
once in just over 30 seconds. Its orbit is slightly elliptical (e ≈ 0.055): the distance
varies between about 363,000 km at the closest point, perigee, and 405,000 km at apogee,
and by Kepler's second law the Moon moves faster near the Earth than far from it. The
radius of the orbit is about 60 Earth radii. This ratio is kept at every setting of the
scale sliders, because the simulation enlarges the distances of moons by the same factor
as the bodies.

The Moon is [tidally locked](thema:gebundene-rotation) and always turns the same side
towards the Earth. One orbit relative to the stars takes 27.3 days; from full moon to full
moon 29.5 days pass. Strictly speaking, both bodies orbit their common centre of mass,
which lies about 4,700 km from the Earth's centre, still inside the Earth; the Earth
therefore wobbles slightly every month. The simulation moves the Moon around the Earth
itself and does not let the Earth wobble ([Limits of the model](thema:modell)). Another
scene: [Lunar eclipse](szene:mondfinsternis).
```

`de/grundschule/szene-merkurjagd.md`:
```markdown
# Merkur auf der Innenbahn

Die Kamera fliegt hinter [Merkur](objekt:mercury) her. Er ist der Planet, der der
[Sonne](objekt:sun) am nächsten ist, und der schnellste von allen: Für eine Runde um die
Sonne braucht er nur 88 Tage, die [Erde](objekt:earth) braucht ein ganzes Jahr. Seine Bahn
ist nicht ganz rund. Nahe an der Sonne wird er schneller, weiter weg wieder langsamer. In
dieser Szene vergehen in jeder Sekunde zwei Tage.
```

`en/grundschule/szene-merkurjagd.md`:
```markdown
# Mercury on the inner orbit

The camera flies behind [Mercury](objekt:mercury). It is the planet closest to the
[Sun](objekt:sun) and the fastest of all: it needs only 88 days for one lap around the
Sun, while the [Earth](objekt:earth) needs a whole year. Its orbit is not quite round.
Close to the Sun it speeds up, further away it slows down again. In this scene two days
pass every second.
```

`de/gymnasium/szene-merkurjagd.md`:
```markdown
# Szene: Merkur auf der Innenbahn

Die Kamera folgt [Merkur](objekt:mercury) dicht hinter ihm auf seiner Bahn. Bei zwei Tagen
je Sekunde legt er in der Szene gut zwei Drittel eines Umlaufs zurück. Mit durchschnittlich
47 km/s ist Merkur der schnellste Planet. Seine Bahn ist die exzentrischste aller Planeten
(e ≈ 0,21): Im Perihel ist er der [Sonne](objekt:sun) 46 Millionen km nahe und 59 km/s
schnell, im Aphel 70 Millionen km entfernt und nur 39 km/s schnell. Das beschreibt das
zweite Keplersche Gesetz: Die Verbindungslinie zur Sonne überstreicht in gleichen Zeiten
gleiche Flächen.

Von Merkur aus erscheint die Sonne im Perihel gut dreimal, im Aphel gut doppelt so groß wie
von der [Erde](objekt:earth). Merkur dreht sich in 58,6 Tagen einmal, in genau zwei
Dritteln eines Umlaufs. Nahe dem Perihel läuft er einige Tage lang schneller um die Sonne,
als er sich dreht; an manchen Orten bleibt die Sonne deshalb am Himmel stehen, läuft ein
Stück zurück und zieht dann weiter. Mehr zur Bahnform: [Bahnelemente](thema:bahnelemente);
Mission: [MESSENGER](quelle:nasa-messenger).
```

`en/gymnasium/szene-merkurjagd.md`:
```markdown
# Scene: Mercury on the inner orbit

The camera follows [Mercury](objekt:mercury) closely along its orbit. At two days per
second it covers just over two thirds of an orbit during the scene. With an average of
47 km/s, Mercury is the fastest planet. Its orbit is the most eccentric of all the planets
(e ≈ 0.21): at perihelion it comes within 46 million km of the [Sun](objekt:sun) and moves
at 59 km/s, at aphelion it is 70 million km away and moves at only 39 km/s. This is
described by Kepler's second law: the line joining the planet to the Sun sweeps out equal
areas in equal times.

Seen from Mercury, the Sun appears just over three times as large at perihelion and just
over twice as large at aphelion as seen from the [Earth](objekt:earth). Mercury turns once
in 58.6 days, exactly two thirds of an orbit. Near perihelion it moves around the Sun
faster than it turns for a few days; at some places the Sun therefore stops in the sky,
moves back a little and then carries on. More on the shape of orbits:
[orbital elements](thema:bahnelemente); mission: [MESSENGER](quelle:nasa-messenger).
```

`de/grundschule/szene-systemblick.md`:
```markdown
# Das System von oben

Von hoch oben siehst du die Bahnen der Planeten um die [Sonne](objekt:sun). In jeder
Sekunde vergeht ein ganzer Monat. Die inneren Planeten wie [Merkur](objekt:mercury) und
die [Erde](objekt:earth) flitzen herum, die äußeren kriechen: Während die Erde in dieser
Szene fast fünfmal um die Sonne läuft, schafft [Neptun](objekt:neptune) nur ein kleines
Stück seiner Bahn. Alle Planeten kreisen in dieselbe Richtung. Mehr dazu:
[Das Sonnensystem](thema:sonnensystem).
```

`en/grundschule/szene-systemblick.md`:
```markdown
# The Solar System from above

From high above you see the orbits of the planets around the [Sun](objekt:sun). A whole
month passes every second. The inner planets such as [Mercury](objekt:mercury) and the
[Earth](objekt:earth) race around, the outer ones crawl: while the Earth goes around the
Sun almost five times in this scene, [Neptune](objekt:neptune) manages only a small part
of its orbit. All the planets travel in the same direction. More:
[The Solar System](thema:sonnensystem).
```

`de/gymnasium/szene-systemblick.md`:
```markdown
# Szene: Das System von oben

Die Kamera blickt steil von Norden auf die Ebene der Planetenbahnen und dreht sich langsam
um die [Sonne](objekt:sun). Bei 30 Tagen je Sekunde vergehen in der Szene knapp fünf
Jahre. [Merkur](objekt:mercury) umrundet die Sonne in dieser Zeit rund zwanzigmal, die
[Erde](objekt:earth) knapp fünfmal, [Jupiter](objekt:jupiter) schafft zwei Fünftel eines
Umlaufs und [Neptun](objekt:neptune) nur 3 %. Das dritte Keplersche Gesetz fasst das
zusammen: Das Quadrat der Umlaufzeit wächst mit der dritten Potenz der großen Halbachse, in
Jahren und AE gilt T² = a³. Außen sind die Planeten zudem langsamer: Die Erde läuft mit
knapp 30 km/s, Neptun mit gut 5 km/s.

Von Norden gesehen umlaufen alle Planeten die Sonne gegen den Uhrzeigersinn, ein Erbe der
rotierenden Scheibe, aus der sie entstanden. Zwischen Mars und Jupiter liegt der
Asteroidengürtel, jenseits von Neptun der Kuipergürtel; beide zeigt die Simulation als
Punktwolken. Neptun steht knapp 78-mal so weit von der Sonne wie Merkur. Maßstabsgetreu
wären die inneren Bahnen neben seiner kaum zu erkennen; die Voreinstellung „Schaubild"
staucht die Abstände deshalb. Mehr: [Das Sonnensystem](thema:sonnensystem),
[Bahnelemente](thema:bahnelemente); selbst erkunden:
[NASA Eyes on the Solar System](quelle:nasa-eyes).
```

`en/gymnasium/szene-systemblick.md`:
```markdown
# Scene: The Solar System from above

The camera looks steeply down from the north onto the plane of the planetary orbits and
slowly circles the [Sun](objekt:sun). At 30 days per second, almost five years pass
during the scene. In that time [Mercury](objekt:mercury) goes around the Sun about twenty
times, the [Earth](objekt:earth) almost five times, [Jupiter](objekt:jupiter) manages two
fifths of an orbit and [Neptune](objekt:neptune) only 3 %. Kepler's third law sums this
up: the square of the orbital period grows with the cube of the semi-major axis; in years
and AU, T² = a³. The outer planets are also slower: the Earth moves at almost 30 km/s,
Neptune at just over 5 km/s.

Seen from the north, all the planets orbit the Sun anticlockwise, a legacy of the rotating
disc from which they formed. The asteroid belt lies between Mars and Jupiter, the Kuiper
belt beyond Neptune; the simulation shows both as clouds of points. Neptune is almost
78 times as far from the Sun as Mercury. To scale, the inner orbits would hardly be
visible next to Neptune's; the default setting "Diagram" therefore compresses the
distances. More: [The Solar System](thema:sonnensystem),
[orbital elements](thema:bahnelemente); explore yourself:
[NASA Eyes on the Solar System](quelle:nasa-eyes).
```

`de/grundschule/szene-ferne-sonne.md`:
```markdown
# Von Neptun zur fernen Sonne

Die Kamera steht beim [Neptun](objekt:neptune), dem äußersten Planeten, und schaut zurück
zur [Sonne](objekt:sun). Von hier ist die Sonne dreißigmal weiter weg als von der
[Erde](objekt:earth). In Wirklichkeit sähe sie von hier winzig aus, wie ein sehr heller
Stern, und es ist bitterkalt. Ihr Licht ist gut vier Stunden unterwegs, bis es hier
ankommt. Die Simulation zeichnet die Sonne normalerweise größer, damit du sie gut findest.
```

`en/grundschule/szene-ferne-sonne.md`:
```markdown
# From Neptune to the distant Sun

The camera stands next to [Neptune](objekt:neptune), the outermost planet, and looks back
at the [Sun](objekt:sun). From here the Sun is thirty times further away than from the
[Earth](objekt:earth). In reality it would look tiny from here, like a very bright star,
and it is bitterly cold. Its light travels for just over four hours to get here. The
simulation normally draws the Sun larger so that you can find it easily.
```

`de/gymnasium/szene-ferne-sonne.md`:
```markdown
# Szene: Von Neptun zur fernen Sonne

Die Kamera steht nahe [Neptun](objekt:neptune) und blickt zur [Sonne](objekt:sun). Neptun
umläuft sie in 30,1 AE Abstand; ihr Licht braucht gut vier Stunden bis hierher. Weil die
Bestrahlungsstärke mit dem Quadrat des Abstands abnimmt, kommt nur etwa ein Neunhundertstel
dessen an, was die [Erde](objekt:earth) erreicht. Die Sonnenscheibe ist von hier aus gut
eine Bogenminute groß, ein Dreißigstel ihres Anblicks von der Erde, und für das bloße Auge
praktisch ein Punkt. Mit einer scheinbaren Helligkeit von etwa −19 mag wäre sie trotzdem
gut 400-mal so hell wie der Vollmond an unserem Himmel.

Die Voreinstellung „Schaubild" vergrößert die Körper und staucht die Abstände; die Sonne
erscheint deshalb als deutliche Scheibe. Mit „Realistisch" im Panel Maßstab schrumpft sie
zu einem Lichtpunkt, und die Bahnen der inneren Planeten rücken eng an sie heran. Die
Belichtung der Simulation richtet sich nach dem Kameraziel, damit auch ferne Körper
erkennbar bleiben. Bisher hat nur Voyager 2 Neptun besucht, 1989
([Voyager 2](quelle:nasa-voyager-2)); Kennzahlen:
[NSSDC Neptune Fact Sheet](quelle:nssdc-neptune).
```

`en/gymnasium/szene-ferne-sonne.md`:
```markdown
# Scene: From Neptune to the distant Sun

The camera stands near [Neptune](objekt:neptune) and looks towards the [Sun](objekt:sun).
Neptune orbits it at a distance of 30.1 AU; its light takes just over four hours to get
here. Because irradiance falls with the square of the distance, only about 1/900 of what
reaches the [Earth](objekt:earth) arrives here. From here the solar disc is just over one
arcminute across, a thirtieth of its size as seen from the Earth, and practically a point
to the naked eye. With an apparent magnitude of about −19, however, it would still be more
than 400 times as bright as the full Moon in our sky.

The default setting "Diagram" enlarges the bodies and compresses the distances, so the Sun
appears as a clear disc. With "Realistic" in the Scale panel it shrinks to a point of
light, and the orbits of the inner planets move close to it. The simulation sets its
exposure by the camera target so that distant bodies remain visible. So far only
Voyager 2 has visited Neptune, in 1989 ([Voyager 2](quelle:nasa-voyager-2)); key figures:
[NSSDC Neptune Fact Sheet](quelle:nssdc-neptune).
```

- [ ] **Schritt 2: Ausstehende Szenen streichen**

In `src/data/texte/dateien.test.ts` die Zeilen

```ts
  // Task 5
  'szene:erdaufgang', 'szene:mondtanz', 'szene:merkurjagd', 'szene:systemblick', 'szene:ferne-sonne',
```

löschen.

- [ ] **Schritt 3: Tests laufen lassen**

Run: `npx vitest run src/data/texte`
Expected: PASS. Fällt „hält die Wortgrenze des Niveaus", die Datei nicht kürzen, sondern den Befund melden (die Wortzahlen der Grundschultexte sind in der Planung gezählt, alle unter 110).

- [ ] **Schritt 4: Commit**

Erwartete Gesamtzahl: 2529 (2389 + 20 Dateien × 7).

```bash
git add src/data/texte
git commit -m "Szenentexte Grundschule und Gymnasium: Erdaufgang, Mondtanz, Merkurjagd, Systemblick, ferne Sonne"
```

---

### Task 6: Szenen um Mars, Jupiter und Pluto

**Sachstand (Planung, 16.09.2026):**
- `phobos-tiefflug`: Verfolgerkamera 4 Phobosradien (44 km, Streuung 0,8 bis 1,5) hinter Phobos, Blick auf Mars; laut Befund in `scenes.ts` liegt Phobos selbst praktisch immer außerhalb des Bildwinkels. Mars erscheint aus 9 376 km Bahnradius unter 2 · asin(3 389,5 / 9 376) ≈ 42° (Vollmond 0,52°). 25 s bei 0,05 d/s = 30 h = 3,9 Umläufe (7 h 39 min). Die Geometrie hängt nur von Radienverhältnissen ab und gilt in jedem Maßstab.
- `jupiter-vorbeiflug`: gerader Vorbeiflug, nächster Abstand 4 Jupiterradien (3,2 bis 6), Io bei 5,9 Radien. 35 s bei 0,3 d/s = 10,5 d = 252 h, Rotation 9,925 h → 25,4 Drehungen. Jupiter 13,07 km/s. New Horizons 28.02.2007, rund 14 000 km/h (9 000 mph), drei Jahre früher bei Pluto (NASA). Juno seit 04.07.2016 auf polarer Bahn; zum heutigen Stand der Mission sagt der Text nichts.
- `galileisches-schattenspiel`: 55 Jupiterradien, Elevation 55° (45 bis 65), 45 s bei 0,5 d/s = 22,5 d: Io 12,7, Europa 6,3, Ganymed 3,1 Umläufe. Io-Schatten auf Jupiter aus diesem Abstand rund 0,55 px (Abnahme 3b-2); die Szene wird laut Entscheidung Jens nicht weiter verändert. Laplace-Beziehung λ_Io − 3 λ_Europa + 2 λ_Ganymed = 180° schließt eine dreifache Konjunktion aus. Rømer 1676.
- `pluto-charon`: 55 Plutoradien, Azimut auf die Sonnenrichtung zur Epoche J2000 (±20°), 45 s bei 0,3 d/s = 13,5 d = 2,1 Umläufe (6,387 d). Charon 1 212 km, Pluto 2 377 km, Massenverhältnis 0,122; Schwerpunkt 2 126 km vom Plutomittelpunkt, 938 km über der Oberfläche. Das Modell führt Charon um Plutos Mittelpunkt (Befund in `scenes.ts`); Task 8 benennt das in `thema-modell`.

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/{grundschule,gymnasium}/szene-{phobos-tiefflug,jupiter-vorbeiflug,galileisches-schattenspiel,pluto-charon}.md`
- Ändern: `src/data/texte/dateien.test.ts` (vier Einträge aus `AUSSTEHEND` streichen)

**Schnittstellen:**
- Konsumiert: Quellenkarten aus Task 2 (`esa-mars-express`, `nasa-juno`, `nasa-new-horizons`, `nssdc-jupitermonde`, `esa-juice`); Verweise `objekt:phobos`, `objekt:mars`, `objekt:deimos`, `objekt:jupiter`, `objekt:io`, `objekt:europa`, `objekt:ganymede`, `objekt:callisto`, `objekt:earth`, `objekt:pluto`, `objekt:charon`, `thema:zwergplaneten`, `thema:gebundene-rotation`, `thema:modell`.
- Produziert: nichts für spätere Tasks.

- [ ] **Schritt 1: Dateien anlegen**

`de/grundschule/szene-phobos-tiefflug.md`:
```markdown
# Tiefflug über Phobos

Die Kamera fliegt mit dem kleinen Mond [Phobos](objekt:phobos) mit und schaut auf den
[Mars](objekt:mars). Kein anderer Mond kreist so dicht über seinem Planeten. Phobos ist so
schnell, dass er dreimal am Tag um den Mars saust. Deshalb zieht die Marsoberfläche unter
der Kamera vorbei. Phobos selbst siehst du nicht: Die Kamera fliegt dicht hinter ihm und
blickt zur Seite auf den Mars.
```

`en/grundschule/szene-phobos-tiefflug.md`:
```markdown
# Low pass over Phobos

The camera flies along with the small moon [Phobos](objekt:phobos) and looks at
[Mars](objekt:mars). No other moon circles so close above its planet. Phobos is so fast
that it races around Mars three times a day. That is why the surface of Mars moves past
below the camera. You do not see Phobos itself: the camera flies just behind it and looks
sideways at Mars.
```

`de/gymnasium/szene-phobos-tiefflug.md`:
```markdown
# Szene: Tiefflug über Phobos

Die Kamera fliegt wenige Dutzend Kilometer hinter [Phobos](objekt:phobos) auf dessen Bahn
mit und blickt auf den [Mars](objekt:mars). Phobos kreist nur rund 6 000 km über der
Marsoberfläche, näher an seinem Planeten als jeder andere bekannte Mond. Der Mars erscheint
von hier aus rund 40° groß, achtzigmal so breit wie der Vollmond an unserem Himmel, und
füllt einen großen Teil des Bildes. Phobos selbst liegt außerhalb des Bildes, weil die
Kamera quer zur Flugrichtung auf den Planeten schaut.

Ein Umlauf dauert 7 h 39 min, ein Marstag dagegen 24 h 37 min. Phobos überholt also die
Drehung des Mars: Die Oberfläche zieht unter der Kamera entgegen der Flugrichtung weg, und
vom Mars aus gesehen geht Phobos im Westen auf. Bei 1,2 Stunden je Sekunde umrundet er den
Mars in der Szene rund viermal. Weil er innerhalb der synchronen Umlaufbahn kreist, bremsen
ihn die Gezeiten; seine Bahn sinkt um knapp zwei Meter je Jahrhundert, in 30 bis
50 Millionen Jahren wird er zerbrechen oder aufschlagen. Der äußere Mond
[Deimos](objekt:deimos) kreist jenseits dieser Grenze und entfernt sich langsam. Mission:
[Mars Express](quelle:esa-mars-express).
```

`en/gymnasium/szene-phobos-tiefflug.md`:
```markdown
# Scene: Low pass over Phobos

The camera flies a few dozen kilometres behind [Phobos](objekt:phobos) along its orbit and
looks at [Mars](objekt:mars). Phobos circles only about 6,000 km above the Martian
surface, closer to its planet than any other known moon. From here Mars appears about 40°
across, eighty times as wide as the full Moon in our sky, and fills a large part of the
picture. Phobos itself is outside the picture, because the camera looks at the planet at
right angles to the direction of flight.

One orbit takes 7 h 39 min, whereas a Martian day lasts 24 h 37 min. Phobos therefore
overtakes the rotation of Mars: the surface slips away beneath the camera against the
direction of flight, and seen from Mars, Phobos rises in the west. At 1.2 hours per second
it circles Mars about four times during the scene. Because it orbits inside the
synchronous orbit, tides slow it down; its orbit sinks by almost two metres per century,
and in 30 to 50 million years it will break apart or crash. The outer moon
[Deimos](objekt:deimos) orbits beyond this limit and is slowly moving away. Mission:
[Mars Express](quelle:esa-mars-express).
```

`de/grundschule/szene-jupiter-vorbeiflug.md`:
```markdown
# Vorbeiflug an Jupiter

Die Kamera fliegt wie eine Raumsonde an [Jupiter](objekt:jupiter) vorbei. Erst ist der
Riesenplanet klein, dann füllt er einen großen Teil des Bildes, dann wird er wieder
kleiner. Jupiter ist so groß, dass mehr als tausend [Erden](objekt:earth) hineinpassen
würden. Er dreht sich in nur zehn Stunden einmal um sich selbst. Echte Raumsonden fliegen
gern an Jupiter vorbei: Seine Schwerkraft gibt ihnen Schwung für die weite Reise nach
draußen.
```

`en/grundschule/szene-jupiter-vorbeiflug.md`:
```markdown
# Flyby of Jupiter

The camera flies past [Jupiter](objekt:jupiter) like a space probe. At first the giant
planet is small, then it fills a large part of the picture, then it gets smaller again.
Jupiter is so big that more than a thousand [Earths](objekt:earth) would fit inside it.
It turns once in only ten hours. Real space probes like to fly past Jupiter: its gravity
gives them a boost for the long journey further out.
```

`de/gymnasium/szene-jupiter-vorbeiflug.md`:
```markdown
# Szene: Vorbeiflug an Jupiter

Die Kamera zieht auf gerader Linie an [Jupiter](objekt:jupiter) vorbei und kommt ihm dabei
bis auf wenige Jupiterradien nahe, etwa so nah wie der innerste Galileische Mond
[Io](objekt:io). Bei 0,3 Tagen je Sekunde dreht sich der Planet in der Szene rund 25-mal;
seine Rotationsdauer von knapp zehn Stunden ist die kürzeste aller Planeten.

Echte Raumsonden fliegen nicht geradeaus, Jupiters Schwerkraft krümmt ihre Bahn. Bei einem
solchen Vorbeiflug (Swing-by) ist die Geschwindigkeit gegenüber Jupiter danach so groß wie
davor, nur ihre Richtung ändert sich. Weil sich Jupiter selbst mit rund 13 km/s um die
Sonne bewegt, kann die Sonde gegenüber der Sonne dabei Geschwindigkeit gewinnen oder
verlieren. Pioneer 10 und 11, Voyager 1 und 2 und New Horizons nutzten das; New Horizons
wurde 2007 um rund 14 000 km/h schneller und erreichte [Pluto](objekt:pluto) drei Jahre
früher. Allzu nah ist gefährlich: Jupiters Magnetfeld hält Gürtel aus energiereichen
Teilchen fest, deren Strahlung die Elektronik von Sonden schädigt. Die Sonde Juno schwenkte
2016 auf eine Bahn über die Pole ein, die die stärksten Strahlungszonen weitgehend meidet.
Mission: [Juno](quelle:nasa-juno); weitere Sonde: [New Horizons](quelle:nasa-new-horizons).
```

`en/gymnasium/szene-jupiter-vorbeiflug.md`:
```markdown
# Scene: Flyby of Jupiter

The camera moves past [Jupiter](objekt:jupiter) in a straight line and comes within a few
Jupiter radii of it, about as close as the innermost Galilean moon [Io](objekt:io). At
0.3 days per second the planet turns about 25 times during the scene; its rotation period
of just under ten hours is the shortest of all the planets.

Real space probes do not fly straight; Jupiter's gravity bends their path. In such a flyby
(gravity assist) the speed relative to Jupiter is the same afterwards as before, only its
direction changes. Because Jupiter itself moves around the Sun at about 13 km/s, the probe
can gain or lose speed relative to the Sun. Pioneer 10 and 11, Voyager 1 and 2 and New
Horizons made use of this; in 2007 New Horizons became about 14,000 km/h faster and
reached [Pluto](objekt:pluto) three years earlier. Getting too close is dangerous:
Jupiter's magnetic field holds belts of energetic particles whose radiation damages the
electronics of probes. In 2016 the Juno probe entered an orbit over the poles that largely
avoids the strongest radiation zones. Mission: [Juno](quelle:nasa-juno); another probe:
[New Horizons](quelle:nasa-new-horizons).
```

`de/grundschule/szene-galileisches-schattenspiel.md`:
```markdown
# Das galileische Schattenspiel

Hier siehst du [Jupiter](objekt:jupiter) von schräg oben mit seinen vier großen Monden
[Io](objekt:io), [Europa](objekt:europa), [Ganymed](objekt:ganymede) und
[Kallisto](objekt:callisto). Galileo Galilei hat sie vor über 400 Jahren mit einem Fernrohr
entdeckt. Drei der Monde laufen im Takt: Während Ganymed einmal herumläuft, schafft Europa
zwei Runden und Io vier. Zieht ein Mond vor Jupiter vorbei, fällt sein Schatten als dunkler
Punkt auf die Wolken. Von hier aus ist dieser Punkt aber zu klein, um ihn zu sehen.
```

`en/grundschule/szene-galileisches-schattenspiel.md`:
```markdown
# The Galilean shadow play

Here you see [Jupiter](objekt:jupiter) from above at an angle, with its four large moons
[Io](objekt:io), [Europa](objekt:europa), [Ganymede](objekt:ganymede) and
[Callisto](objekt:callisto). Galileo Galilei discovered them with a telescope more than
400 years ago. Three of the moons keep in step: while Ganymede goes around once, Europa
manages two laps and Io four. When a moon passes in front of Jupiter, its shadow falls on
the clouds as a dark dot. From here, though, that dot is too small to see.
```

`de/gymnasium/szene-galileisches-schattenspiel.md`:
```markdown
# Szene: Das galileische Schattenspiel

Die Kamera blickt schräg von oben auf [Jupiter](objekt:jupiter) und die Bahnen der vier
Monde, die Galileo Galilei im Januar 1610 entdeckte: [Io](objekt:io),
[Europa](objekt:europa), [Ganymed](objekt:ganymede) und [Kallisto](objekt:callisto). Bei
0,5 Tagen je Sekunde umläuft Io Jupiter in der Szene gut zwölfmal, Europa sechsmal und
Ganymed dreimal. Die Umlaufzeiten von 1,77, 3,55 und 7,15 Tagen stehen fast genau im
Verhältnis 1:2:4. Diese Laplace-Resonanz ist stabil; sie verhindert, dass alle drei Monde
zugleich auf derselben Seite Jupiters in einer Reihe stehen. Die regelmäßigen Anstöße
halten Ios Bahn leicht elliptisch und heizen ihn durch Gezeitenreibung auf.

Das Schattenspiel zeigt schon ein kleines Fernrohr: Zieht ein Mond vor Jupiter vorbei,
wandert sein Schatten als schwarzer Punkt über die Wolken; tritt ein Mond in Jupiters
Schatten, verschwindet er. Ole Rømer bemerkte 1676, dass die Verfinsterungen von Io je nach
Abstand zwischen Erde und Jupiter früher oder später eintraten, und schloss daraus, dass
sich Licht mit endlicher Geschwindigkeit ausbreitet. Die Simulation berechnet diese
Schatten; aus der Entfernung dieser Szene sind sie aber höchstens einen Bildpunkt groß.
Wer Jupiter anwählt und heranzoomt, kann sie bei einem Durchgang sehen. Kennzahlen:
[Faktenblatt der Jupitermonde](quelle:nssdc-jupitermonde); Mission:
[Juice](quelle:esa-juice).
```

`en/gymnasium/szene-galileisches-schattenspiel.md`:
```markdown
# Scene: The Galilean shadow play

The camera looks down at an angle on [Jupiter](objekt:jupiter) and the orbits of the four
moons that Galileo Galilei discovered in January 1610: [Io](objekt:io),
[Europa](objekt:europa), [Ganymede](objekt:ganymede) and [Callisto](objekt:callisto). At
0.5 days per second, Io orbits Jupiter just over twelve times during the scene, Europa six
times and Ganymede three times. Their orbital periods of 1.77, 3.55 and 7.15 days are
almost exactly in the ratio 1:2:4. This Laplace resonance is stable; it prevents all three
moons from lining up on the same side of Jupiter at the same time. The regular tugs keep
Io's orbit slightly elliptical and heat it through tidal friction.

A small telescope is enough to see the shadow play: when a moon passes in front of
Jupiter, its shadow moves across the clouds as a black dot; when a moon enters Jupiter's
shadow, it disappears. In 1676 Ole Rømer noticed that the eclipses of Io came earlier or
later depending on the distance between the Earth and Jupiter, and concluded that light
travels at a finite speed. The simulation calculates these shadows, but from the distance
of this scene they are at most one pixel in size. If you select Jupiter and zoom in, you
can see them during a transit. Key figures:
[Jovian Satellite Fact Sheet](quelle:nssdc-jupitermonde); mission: [Juice](quelle:esa-juice).
```

`de/grundschule/szene-pluto-charon.md`:
```markdown
# Pluto und Charon im Doppel

[Pluto](objekt:pluto) und sein Mond [Charon](objekt:charon) sind ein ungewöhnliches Paar:
Kein anderer Mond ist im Vergleich zu seinem Himmelskörper so groß, Charon ist halb so
groß wie Pluto. Beide drehen sich im selben Takt, in dem Charon um Pluto kreist. Deshalb
zeigen sie einander immer dieselbe Seite, als hielten sie sich an den Händen. Eigentlich
kreisen beide um einen Punkt zwischen ihnen. Die Simulation vereinfacht das: Hier kreist
Charon um Plutos Mitte.
```

`en/grundschule/szene-pluto-charon.md`:
```markdown
# Pluto and Charon, a double world

[Pluto](objekt:pluto) and its moon [Charon](objekt:charon) are an unusual pair: no other
moon is so large compared with the body it orbits; Charon is half the size of Pluto. Both
turn at the same pace at which Charon circles Pluto. That is why they always show each
other the same side, as if they were holding hands. Actually, both circle a point between
them. The simulation keeps it simple: here Charon circles the middle of Pluto.
```

`de/gymnasium/szene-pluto-charon.md`:
```markdown
# Szene: Pluto und Charon im Doppel

Die Kamera umkreist den [Zwergplaneten](thema:zwergplaneten) [Pluto](objekt:pluto) in so
großem Abstand, dass die ganze Bahn seines Mondes [Charon](objekt:charon) ins Bild passt.
Charon umläuft Pluto in 19 600 km Abstand in 6,4 Tagen; bei 0,3 Tagen je Sekunde sind das
in der Szene gut zwei Umläufe. Beide Körper drehen sich in genau dieser Zeit einmal um sich
selbst und zeigen einander stets dieselbe Seite, eine doppelt
[gebundene Rotation](thema:gebundene-rotation). Die Kamera blickt ungefähr aus Richtung der
Sonne, damit beide beleuchtet sind.

Mit gut der halben Größe und einem Achtel der Masse Plutos ist Charon im Verhältnis zu
seinem Mutterkörper der größte Mond im Sonnensystem. Der gemeinsame Schwerpunkt liegt
deshalb rund 2 100 km vom Mittelpunkt Plutos entfernt, rund 900 km über seiner
Oberfläche. In Wirklichkeit umkreisen beide Körper diesen Punkt; auch Pluto zieht einen
kleinen Kreis. Die Simulation lässt Charon vereinfacht um Plutos Mittelpunkt laufen, wie
alle Monde um ihren Mutterkörper ([Grenzen des Modells](thema:modell)). Die Sonde
New Horizons flog im Juli 2015 an beiden vorbei ([New Horizons](quelle:nasa-new-horizons)).
```

`en/gymnasium/szene-pluto-charon.md`:
```markdown
# Scene: Pluto and Charon, a double world

The camera circles the [dwarf planet](thema:zwergplaneten) [Pluto](objekt:pluto) at such a
distance that the whole orbit of its moon [Charon](objekt:charon) fits into the picture.
Charon orbits Pluto at a distance of 19,600 km in 6.4 days; at 0.3 days per second that
makes just over two orbits during the scene. Both bodies turn once on their axes in exactly
this time and always show each other the same side, a double
[tidal locking](thema:gebundene-rotation). The camera looks roughly from the direction of
the Sun so that both are lit.

At just over half the size and one eighth of the mass of Pluto, Charon is the largest moon
in the Solar System relative to the body it orbits. Their common centre of mass therefore
lies about 2,100 km from Pluto's centre, about 900 km above its surface. In reality both
bodies orbit this point; Pluto, too, moves in a small circle. The simulation simplifies
this and moves Charon around Pluto's centre, as it does with all moons and their parent
bodies ([Limits of the model](thema:modell)). The New Horizons probe flew past both in
July 2015 ([New Horizons](quelle:nasa-new-horizons)).
```

- [ ] **Schritt 2: Ausstehende Szenen streichen**

In `src/data/texte/dateien.test.ts` die Zeilen

```ts
  // Task 6
  'szene:phobos-tiefflug', 'szene:jupiter-vorbeiflug', 'szene:galileisches-schattenspiel', 'szene:pluto-charon',
```

löschen.

- [ ] **Schritt 3: Tests laufen lassen**

Run: `npx vitest run src/data/texte`
Expected: PASS.

- [ ] **Schritt 4: Commit**

Erwartete Gesamtzahl: 2641 (2529 + 16 Dateien × 7).

```bash
git add src/data/texte
git commit -m "Szenentexte Grundschule und Gymnasium: Phobos-Tiefflug, Jupiter-Vorbeiflug, galileisches Schattenspiel, Pluto und Charon"
```

---

### Task 7: Szenen um Saturn

**Sachstand (Planung, 16.09.2026):**
- `saturn-streiflicht`: Umlaufkamera 5 Saturnradien (4 bis 7), Elevation 4° (1 bis 16), Azimut zufällig und 0,8°/s, 35 s bei 0,1 d/s. Ringschatten auf dem Planeten und Planetenschatten auf den Ringen berechnet der Schatten-Shader (Phase 3b); die Vorwärtsstreuung ist laut `render/rings.ts` ein Gestaltungswert. Sonnen-Ringebenendurchgang 06.05.2025, Abstände 13,75 und 15,75 Jahre. Cassini-Aufnahme „In Saturn's Shadow" 2006.
- `saturn-ringkante`: feste Kamera 8 Saturnradien (6,4 bis 12) auf dem Ringebenen-Knoten 169,53°, Elevation 0° (±1,5°). Hauptringe Außenkante 136 780 km (Durchmesser 273 560 km), Innenkante C-Ring 74 658 km, Band 62 000 km ≈ 4,9 Erddurchmesser. Erde durch die Ringebene 23.03.2025, nächster Durchgang 2038. Janus entdeckt am 15.12.1966 während eines Ringebenendurchgangs.
- `ringdurchflug`: gerader Vorbeiflug 2 Saturnradien (1,6 bis 3), Elevation 4° (1 bis 19) am selben Knoten; die Bahn liegt ekliptikal und entfernt sich von der um 28° geneigten Ringebene (Befund in `scenes.ts`). Bahngeschwindigkeit √(GM/r) mit GM = 37 931 187 km³/s²: 22,5 km/s bei 74 658 km, 16,7 km/s bei 136 780 km. Cassini Grand Finale: 22 Durchgänge durch die rund 2 000 km breite Lücke, Ende 15.09.2017 (NASA).
- `titan-dunst`: Umlaufkamera 7 Titanradien, Azimut 11°/s (32,7 s je Umlauf), Saturn laut Befund nicht garantiert im Bild. Titantextur ist ein Nahinfrarot-Mosaik, das den Dunst durchdringt (`ASSETS.md`); eine Atmosphäre wird nicht gezeichnet. Saturn von Titan aus: 120 536 km / 1 221 870 km = 5,65°.
- `enceladus-hell`: Umlaufkamera 5 Enceladusradien auf der Sonnenseite (Azimut aus der Richtung Saturn→Sonne). Fontänen werden nicht gezeichnet; Enceladustextur aus Cassini-Aufnahmen. Rückstrahlung rund 80 % wie im Gymnasialtext `objekt-enceladus.md`; Oberflächentemperatur im Mittel rund 75 K.
- `iapetus-schief`: Umlaufkamera um Saturn, 40 Saturnradien, Elevation 45° (30 bis 60), 30 s bei 3 d/s = 90 d = 1,13 Umläufe (79,33 d). Bahn 3 562 568 km = 61,2 Saturnradien, Titan 1 221 870 km (Faktor 2,9); Neigung 15,47° gegen Saturns Äquator. Cassini entdeckte Iapetus 1671 und sah ihn nur westlich von Saturn.

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/{grundschule,gymnasium}/szene-{saturn-streiflicht,saturn-ringkante,ringdurchflug,titan-dunst,enceladus-hell,iapetus-schief}.md`
- Ändern: `src/data/texte/dateien.test.ts` (sechs Einträge aus `AUSSTEHEND` streichen)

**Schnittstellen:**
- Konsumiert: Quellenkarten aus Task 2 (`nasa-cassini`, `jpl-photojournal-saturn`, `pds-rings`, `esa-cassini-huygens`, `nssdc-saturnmonde`); Verweise `objekt:saturn`, `objekt:sun`, `objekt:titan`, `objekt:enceladus`, `objekt:iapetus`, `thema:ringe`, `thema:gebundene-rotation`.
- Produziert: nichts für spätere Tasks.

- [ ] **Schritt 1: Dateien anlegen**

`de/grundschule/szene-saturn-streiflicht.md`:
```markdown
# Saturn im Streiflicht

Die Kamera kreist nah um den [Saturn](objekt:saturn) und schaut fast von der Seite auf
seine [Ringe](thema:ringe). Die Ringe sind riesig breit, aber hauchdünn. Das Licht der
[Sonne](objekt:sun) fällt schräg auf sie. Oft siehst du deshalb lange Schatten: Der Planet
wirft einen Schatten auf die Ringe, und die Ringe werfen einen Schatten auf den Planeten.
Wie groß die Schatten sind, hängt davon ab, wo Saturn gerade auf seiner Bahn steht.
```

`en/grundschule/szene-saturn-streiflicht.md`:
```markdown
# Saturn in grazing light

The camera circles close to [Saturn](objekt:saturn) and looks at its
[rings](thema:ringe) almost from the side. The rings are hugely wide but wafer-thin.
Light from the [Sun](objekt:sun) falls on them at a slant. That is why you often see long
shadows: the planet casts a shadow on the rings, and the rings cast a shadow on the
planet. How big the shadows are depends on where Saturn is on its orbit at the moment.
```

`de/gymnasium/szene-saturn-streiflicht.md`:
```markdown
# Szene: Saturn im Streiflicht

Die Kamera umkreist [Saturn](objekt:saturn) in rund fünf Saturnradien Abstand, flach über
der Ekliptik. Saturns Äquator und damit die [Ringe](thema:ringe) sind um 26,7° gegen seine
Bahn geneigt. Im Lauf eines Saturnjahres von 29,5 Jahren steht die [Sonne](objekt:sun)
deshalb bis zu 26,7° nördlich oder südlich der Ringebene. Zweimal je Umlauf, im Wechsel
nach knapp 14 und knapp 16 Jahren, steht sie genau in der Ebene; dann streift das Licht
die Ringe nur, und sie werden sehr dunkel. So war es zuletzt am 6. Mai 2025.

Flach einfallendes Licht macht lange Schatten: Die Ringe zeichnen ein dunkles Band auf die
Wolken, und der Planet legt seinen Schatten über die Ringe. Beides berechnet die Simulation
aus der Stellung der Sonne. Im Gegenlicht leuchten feine Staubteilchen der Ringe auf, weil
sie Licht bevorzugt nach vorn streuen; die Simulation deutet diese Vorwärtsstreuung an.
2006 fotografierte die Raumsonde Cassini Saturn aus seinem Schatten heraus mit der Sonne
dahinter, dabei traten sonst kaum sichtbare Staubringe hervor. Welche Ansicht die Szene
zeigt, hängt von Datum und Blickrichtung ab. Mission: [Cassini](quelle:nasa-cassini);
Bilder: [Photojournal Saturn](quelle:jpl-photojournal-saturn).
```

`en/gymnasium/szene-saturn-streiflicht.md`:
```markdown
# Scene: Saturn in grazing light

The camera circles [Saturn](objekt:saturn) at about five Saturn radii, low above the
ecliptic. Saturn's equator, and with it the [rings](thema:ringe), is tilted by 26.7° to its
orbit. Over a Saturnian year of 29.5 years, the [Sun](objekt:sun) therefore stands up to
26.7° north or south of the ring plane. Twice per orbit, alternately after almost 14 and
almost 16 years, it lies exactly in that plane; then the light only grazes the rings and
they become very dark. This last happened on 6 May 2025.

Light at a low angle makes long shadows: the rings draw a dark band on the clouds, and the
planet casts its shadow across the rings. The simulation calculates both from the position
of the Sun. In backlight, fine dust particles in the rings light up because they scatter
light mainly forwards; the simulation hints at this forward scattering. In 2006 the
Cassini probe photographed Saturn from within its shadow with the Sun behind it, and faint
dusty rings that are otherwise hard to see stood out. Which view the scene shows depends
on the date and the viewing direction. Mission: [Cassini](quelle:nasa-cassini); pictures:
[Photojournal Saturn](quelle:jpl-photojournal-saturn).
```

`de/grundschule/szene-saturn-ringkante.md`:
```markdown
# Saturns Ringe von der Kante

Die Kamera steht genau in der Ebene der [Ringe](thema:ringe) des [Saturn](objekt:saturn).
Von der Seite sind die riesigen Ringe fast nicht mehr zu sehen, nur noch ein feiner Strich.
Sie sind so breit wie fast fünf Erden nebeneinander, aber meist nur so dick, wie ein Haus
hoch ist. Von der Erde aus sieht man die Ringe etwa alle 15 Jahre so von der Kante, zuletzt
im Jahr 2025.
```

`en/grundschule/szene-saturn-ringkante.md`:
```markdown
# Saturn's rings edge-on

The camera stands exactly in the plane of the [rings](thema:ringe) of
[Saturn](objekt:saturn). From the side the huge rings almost disappear; only a thin line
is left. They are as wide as almost five Earths side by side, but mostly only as thick as
a house is tall. From the Earth we see the rings edge-on like this about every 15 years,
most recently in 2025.
```

`de/gymnasium/szene-saturn-ringkante.md`:
```markdown
# Szene: Saturns Ringe von der Kante

Die Kamera steht in Saturns Äquatorebene, in der auch die [Ringe](thema:ringe) liegen, und
blickt aus rund acht Saturnradien Abstand auf [Saturn](objekt:saturn). Die Hauptringe
messen über 270 000 km im Durchmesser, sind aber meist nur etwa zehn Meter dick. Von der
Kante gesehen schrumpfen sie deshalb zu einer feinen Linie. Die Kamera sitzt dazu in einer
der beiden Richtungen, in denen die Ringebene die Ekliptik schneidet; schon ein Grad
Abweichung öffnet die Ringe zu einer schmalen Ellipse.

Von der Erde aus sieht man die Ringe zweimal in jedem Saturnjahr genau von der Kante, im
Wechsel nach knapp 14 und knapp 16 Jahren; zuletzt geschah das am 23. März 2025, das
nächste Mal 2038. In kleinen Fernrohren verschwinden sie dann fast ganz. Solche
Gelegenheiten nutzten Astronomen, um lichtschwache Monde zu finden, die sonst im Glanz der
Ringe untergehen; 1966 wurde so Janus entdeckt. Monde, deren Bahnen in der Ringebene
liegen, scheinen auf der Linie der Ringe hin- und herzupendeln. Daten:
[PDS Ring-Moon Systems Node](quelle:pds-rings).
```

`en/gymnasium/szene-saturn-ringkante.md`:
```markdown
# Scene: Saturn's rings edge-on

The camera stands in Saturn's equatorial plane, which also contains the
[rings](thema:ringe), and looks at [Saturn](objekt:saturn) from about eight Saturn radii.
The main rings are more than 270,000 km across but mostly only about ten metres thick.
Seen edge-on, they therefore shrink to a thin line. To achieve this, the camera sits in
one of the two directions in which the ring plane crosses the ecliptic; a deviation of
just one degree opens the rings into a narrow ellipse.

From the Earth the rings are seen exactly edge-on twice in every Saturnian year,
alternately after almost 14 and almost 16 years; this last happened on 23 March 2025, and
the next time will be in 2038. In small telescopes they then almost vanish. Astronomers
used such occasions to find faint moons that are otherwise lost in the glare of the
rings; Janus was discovered this way in 1966. Moons whose orbits lie in the ring plane
seem to swing back and forth along the line of the rings. Data:
[PDS Ring-Moon Systems Node](quelle:pds-rings).
```

`de/grundschule/szene-ringdurchflug.md`:
```markdown
# Durchflug durch Saturns Ringe

Die Kamera fliegt dicht an den [Ringen](thema:ringe) des [Saturn](objekt:saturn) vorbei
und kreuzt dabei ihre Ebene. Die Ringe sind keine feste Scheibe, sondern unzählige
Eisbrocken, vom Staubkorn bis zu mehreren Metern Größe. Jeder Brocken kreist wie ein
winziger Mond um den Saturn. Eine echte Raumsonde würde bei einem Flug mitten durch die
Ringe zerstört. Die Sonde Cassini flog deshalb 2017 durch die Lücke zwischen den Ringen
und dem Planeten.
```

`en/grundschule/szene-ringdurchflug.md`:
```markdown
# Flying through Saturn's rings

The camera flies close past the [rings](thema:ringe) of [Saturn](objekt:saturn) and
crosses their plane. The rings are not a solid disc but countless chunks of ice, from
grains of dust to several metres across. Each chunk circles Saturn like a tiny moon. A
real space probe flying right through the rings would be destroyed. That is why the
Cassini probe flew through the gap between the rings and the planet in 2017.
```

`de/gymnasium/szene-ringdurchflug.md`:
```markdown
# Szene: Durchflug durch Saturns Ringe

Die Kamera zieht auf gerader Linie an [Saturn](objekt:saturn) vorbei, flach über der
Ringebene und rund zwei Saturnradien vom Mittelpunkt entfernt, im Bereich der Hauptringe.
Weil die Fahrt geradeaus führt, die Ringebene aber um 28° gegen die Ekliptik geneigt ist,
kommt sie den [Ringen](thema:ringe) vor allem in der Mitte der Szene nahe.

Jedes Ringteilchen umläuft Saturn auf seiner eigenen Keplerbahn, am Innenrand des C-Rings
mit gut 22 km/s, am Außenrand des A-Rings mit knapp 17 km/s. Benachbarte Teilchen sind
fast gleich schnell und stoßen nur mit Millimetern bis Zentimetern je Sekunde aneinander.
Eine Raumsonde dagegen, die die Ebene mit vielen Kilometern je Sekunde kreuzt, würde schon
von kleinen Brocken zerstört. Echte Sonden querten die Ringebene deshalb außerhalb der
Hauptringe oder in Lücken. Cassini tauchte 2017 in ihrem Großen Finale 22-mal durch den
rund 2 000 km breiten Spalt zwischen dem innersten Ring und dem Planeten, bevor sie am
15. September in Saturns Atmosphäre verglühte.

Im Gegenlicht, wenn Sonne, Ringe und Kamera fast auf einer Linie liegen, hellen feine
Teilchen die Ringe auf; die Simulation deutet diese Vorwärtsstreuung an. Mission:
[Cassini](quelle:nasa-cassini); Daten: [PDS Ring-Moon Systems Node](quelle:pds-rings).
```

`en/gymnasium/szene-ringdurchflug.md`:
```markdown
# Scene: Flying through Saturn's rings

The camera moves past [Saturn](objekt:saturn) in a straight line, low above the ring plane
and about two Saturn radii from the centre, in the region of the main rings. Because the
path is straight while the ring plane is tilted by 28° to the ecliptic, it comes close to
the [rings](thema:ringe) mainly in the middle of the scene.

Every ring particle orbits Saturn on its own Kepler orbit, at just over 22 km/s at the
inner edge of the C ring and at almost 17 km/s at the outer edge of the A ring.
Neighbouring particles move at almost the same speed and bump into each other at only
millimetres to centimetres per second. A space probe crossing the plane at many
kilometres per second, however, would be destroyed even by small chunks. Real probes
therefore crossed the ring plane outside the main rings or through gaps. In its Grand
Finale in 2017, Cassini dived 22 times through the gap of about 2,000 km between the
innermost ring and the planet, before burning up in Saturn's atmosphere on 15 September.

In backlight, when the Sun, the rings and the camera almost line up, fine particles make
the rings brighter; the simulation hints at this forward scattering. Mission:
[Cassini](quelle:nasa-cassini); data: [PDS Ring-Moon Systems Node](quelle:pds-rings).
```

`de/grundschule/szene-titan-dunst.md`:
```markdown
# Titan im Dunst vor Saturn

[Titan](objekt:titan) ist der größte Mond des [Saturn](objekt:saturn) und der einzige Mond
mit einer dicken Lufthülle. Oranger Dunst hüllt ihn ein wie Nebel, von außen sieht man den
Boden nicht. Die Karte in dieser Szene stammt von der Raumsonde Cassini: Mit einer
besonderen Kamera konnte sie durch den Dunst hindurchschauen. Die Kamera kreist um Titan,
und oft zieht dabei Saturn durchs Bild.
```

`en/grundschule/szene-titan-dunst.md`:
```markdown
# Hazy Titan in front of Saturn

[Titan](objekt:titan) is the largest moon of [Saturn](objekt:saturn) and the only moon
with a thick atmosphere. Orange haze wraps it like fog, so from outside you cannot see the
ground. The map in this scene comes from the Cassini space probe: with a special camera it
could look through the haze. The camera circles Titan, and Saturn often passes through the
picture.
```

`de/gymnasium/szene-titan-dunst.md`:
```markdown
# Szene: Titan im Dunst vor Saturn

Die Kamera umkreist [Titan](objekt:titan) in rund sieben Titanradien Abstand und läuft in
gut einer halben Minute einmal ganz um ihn herum, so dass [Saturn](objekt:saturn) mit
etwas Glück durchs Bild zieht. Von Titan aus erscheint Saturn rund 5,7° groß, elfmal so
breit wie der Vollmond an unserem Himmel. Weil Titan [gebunden](thema:gebundene-rotation)
rotiert, steht Saturn von seiner Oberfläche aus fast unbeweglich am Himmel, verborgen
allerdings hinter dem Dunst.

Titans Atmosphäre besteht vor allem aus Stickstoff; am Boden herrscht ein Druck von etwa
1,5 bar. Sonnenlicht zerlegt Methan in der Hochatmosphäre, daraus entstehen organische
Verbindungen, die als orangefarbener Dunst den Mond einhüllen. Im sichtbaren Licht ist
Titan deshalb eine gleichförmige orange Kugel. Die Oberflächenkarte der Simulation stammt
aus Aufnahmen der Raumsonde Cassini im nahen Infrarot, in einem Wellenlängenbereich, in dem
der Dunst durchlässig ist; die Dunsthülle selbst zeichnet die Simulation nicht. Zu den
dunklen Flächen gehören Dünenfelder am Äquator. Am 14. Januar 2005 landete die Sonde
Huygens auf Titan ([Huygens](quelle:esa-cassini-huygens)); Kennzahlen:
[Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde).
```

`en/gymnasium/szene-titan-dunst.md`:
```markdown
# Scene: Hazy Titan in front of Saturn

The camera circles [Titan](objekt:titan) at about seven Titan radii and goes all the way
around it in just over half a minute, so that with a little luck [Saturn](objekt:saturn)
passes through the picture. Seen from Titan, Saturn appears about 5.7° across, eleven
times as wide as the full Moon in our sky. Because Titan is
[tidally locked](thema:gebundene-rotation), Saturn stands almost motionless in the sky
seen from its surface, though hidden behind the haze.

Titan's atmosphere consists mainly of nitrogen; the pressure at the ground is about
1.5 bar. Sunlight breaks up methane in the upper atmosphere, producing organic compounds
that wrap the moon in an orange haze. In visible light Titan is therefore a uniform orange
ball. The surface map in the simulation comes from images taken by the Cassini probe in
the near infrared, in a wavelength range in which the haze is transparent; the simulation
does not draw the haze itself. The dark areas include dune fields near the equator. On
14 January 2005 the Huygens probe landed on Titan ([Huygens](quelle:esa-cassini-huygens));
key figures: [Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde).
```

`de/grundschule/szene-enceladus-hell.md`:
```markdown
# Enceladus im hellen Glanz

[Enceladus](objekt:enceladus) ist ein kleiner Mond des [Saturn](objekt:saturn). Er ist mit
frischem Eis bedeckt, fast wie mit frisch gefallenem Schnee. Deshalb wirft er mehr
Sonnenlicht zurück als fast jeder andere Körper im Sonnensystem. Unter dem Eis liegt ein
Ozean aus salzigem Wasser. Am Südpol spritzen Fontänen aus Wasserdampf und Eis ins All.
Diese Fontänen zeigt die Simulation nicht.
```

`en/grundschule/szene-enceladus-hell.md`:
```markdown
# Enceladus in brilliant light

[Enceladus](objekt:enceladus) is a small moon of [Saturn](objekt:saturn). It is covered
in fresh ice, almost like freshly fallen snow. That is why it reflects more sunlight than
almost any other body in the Solar System. Beneath the ice lies an ocean of salty water.
At the south pole, fountains of water vapour and ice shoot out into space. The simulation
does not show these fountains.
```

`de/gymnasium/szene-enceladus-hell.md`:
```markdown
# Szene: Enceladus im hellen Glanz

Die Kamera umkreist [Enceladus](objekt:enceladus) in rund fünf Enceladusradien Abstand auf
der Seite, die der [Sonne](objekt:sun) zugewandt ist. Der nur 504 km große Mond wirft rund
80 % des einfallenden Sonnenlichts zurück, mehr als jeder andere große Körper im
Sonnensystem; frischer Schnee auf der Erde erreicht ähnliche Werte. Weil er so wenig Licht
aufnimmt, bleibt seine Oberfläche mit rund −200 °C besonders kalt.

Das Eis bleibt frisch, weil Enceladus aktiv ist. Aus Bruchzonen am Südpol, den
Tigerstreifen, schießen Fontänen aus Wasserdampf und Eiskörnern ins All. Ein Teil fällt
als Schnee zurück und überzieht die Oberfläche, der Rest speist Saturns weit ausgedehnten
E-Ring. Die Raumsonde Cassini flog durch die Fontänen und fand darin Salze und organische
Verbindungen, Hinweise auf einen salzigen Ozean unter der Eiskruste. Die Fontänen zeigt die
Simulation nicht; die Oberflächenkarte stammt aus Cassini-Aufnahmen. Mission:
[Cassini](quelle:nasa-cassini); Kennzahlen:
[Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde).
```

`en/gymnasium/szene-enceladus-hell.md`:
```markdown
# Scene: Enceladus in brilliant light

The camera circles [Enceladus](objekt:enceladus) at about five Enceladus radii on the side
facing the [Sun](objekt:sun). The moon, only 504 km across, reflects about 80 % of the
incoming sunlight, more than any other large body in the Solar System; fresh snow on the
Earth reaches similar values. Because it absorbs so little light, its surface stays
especially cold at about −200 °C.

The ice stays fresh because Enceladus is active. Fountains of water vapour and ice grains
shoot into space from fractures near the south pole, the tiger stripes. Some of the
material falls back as snow and coats the surface; the rest feeds Saturn's widely spread
E ring. The Cassini probe flew through the fountains and found salts and organic compounds
in them, signs of a salty ocean beneath the ice crust. The simulation does not show the
fountains; the surface map comes from Cassini images. Mission:
[Cassini](quelle:nasa-cassini); key figures:
[Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde).
```

`de/grundschule/szene-iapetus-schief.md`:
```markdown
# Die geneigte Bahn des Iapetus

Hier siehst du den [Saturn](objekt:saturn) mit seinen [Ringen](thema:ringe) und die weite
Bahn des Mondes [Iapetus](objekt:iapetus). Die meisten großen Saturnmonde kreisen fast
genau in der Ebene der Ringe. Die Bahn von Iapetus ist dagegen schräg gekippt. Iapetus hat
noch eine Besonderheit: Eine Hälfte ist fast schwarz, die andere viel heller.
```

`en/grundschule/szene-iapetus-schief.md`:
```markdown
# The tilted orbit of Iapetus

Here you see [Saturn](objekt:saturn) with its [rings](thema:ringe) and the wide orbit of
the moon [Iapetus](objekt:iapetus). Most of Saturn's large moons circle almost exactly in
the plane of the rings. The orbit of Iapetus, however, is tilted. Iapetus has another
special feature: one half is almost black, the other much brighter.
```

`de/gymnasium/szene-iapetus-schief.md`:
```markdown
# Szene: Die geneigte Bahn des Iapetus

Die Kamera blickt schräg auf [Saturn](objekt:saturn) samt [Ringen](thema:ringe) und auf die
Bahn von [Iapetus](objekt:iapetus). Mit 3,56 Millionen km Radius, gut 61 Saturnradien, ist
sie knapp dreimal so groß wie die Bahn von [Titan](objekt:titan). Bei drei Tagen je Sekunde
durchläuft Iapetus seinen Umlauf von 79 Tagen in der Szene gut einmal. Die inneren großen
Monde kreisen fast genau in Saturns Äquatorebene, in der auch die Ringe liegen; die Bahn
des Iapetus ist um gut 15° dagegen geneigt.

Die Ursache ist sein großer Abstand. Nahe Monde hält Saturns abgeplatteter Äquatorwulst in
der Äquatorebene. Weit draußen zieht die Sonne merklich an der Bahn, und die Ebene, um die
die Bahn langsam kreiselt, die Laplace-Ebene, liegt zwischen Saturns Äquator und seiner
Bahnebene. Giovanni Domenico Cassini entdeckte Iapetus 1671 und bemerkte, dass er nur auf
einer Seite Saturns gut zu sehen war. Heute ist der Grund bekannt: Die in Umlaufrichtung
vordere Hälfte ist fast schwarz, die hintere hell, und weil Iapetus
[gebunden](thema:gebundene-rotation) rotiert, wendet er uns je nach Bahnstellung die eine
oder die andere zu. Kennzahlen: [Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde).
```

`en/gymnasium/szene-iapetus-schief.md`:
```markdown
# Scene: The tilted orbit of Iapetus

The camera looks obliquely at [Saturn](objekt:saturn) with its [rings](thema:ringe) and at
the orbit of [Iapetus](objekt:iapetus). With a radius of 3.56 million km, just over
61 Saturn radii, it is almost three times as large as the orbit of [Titan](objekt:titan).
At three days per second, Iapetus completes its 79-day orbit just over once during the
scene. The large inner moons circle almost exactly in Saturn's equatorial plane, which
also contains the rings; the orbit of Iapetus is tilted by just over 15° against it.

The reason is its great distance. Near moons are held in the equatorial plane by Saturn's
flattened equatorial bulge. Far out, the Sun pulls noticeably on the orbit, and the plane
around which the orbit slowly precesses, the Laplace plane, lies between Saturn's equator
and its orbital plane. Giovanni Domenico Cassini discovered Iapetus in 1671 and noticed
that it could only be seen well on one side of Saturn. Today the reason is known: the
leading hemisphere is almost black and the trailing one bright, and because Iapetus is
[tidally locked](thema:gebundene-rotation), it turns one or the other towards us depending
on its position in its orbit. Key figures:
[Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde).
```

- [ ] **Schritt 2: Ausstehende Szenen streichen**

In `src/data/texte/dateien.test.ts` die Zeilen

```ts
  // Task 7
  'szene:saturn-streiflicht', 'szene:saturn-ringkante', 'szene:ringdurchflug',
  'szene:titan-dunst', 'szene:enceladus-hell', 'szene:iapetus-schief',
```

löschen.

- [ ] **Schritt 3: Tests laufen lassen**

Run: `npx vitest run src/data/texte`
Expected: PASS.

- [ ] **Schritt 4: Commit**

Erwartete Gesamtzahl: 2809 (2641 + 24 Dateien × 7).

```bash
git add src/data/texte
git commit -m "Szenentexte Grundschule und Gymnasium: Saturn im Streiflicht, Ringkante, Ringdurchflug, Titan, Enceladus, Iapetus"
```

---
