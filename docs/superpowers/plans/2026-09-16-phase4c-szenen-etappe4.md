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
