# Phase 4d Hochschule, Etappe 2 „Fachthemen" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Die sechs Fachthemen (`bezugssysteme`, `gezeiten`, `resonanzen`, `innerer-aufbau`, `photometrie`, `entstehung`) haben Hochschultexte in Deutsch und Englisch mit Belegliste und Fachprüfung; die drei Pilottexte und die Fachthemen verweisen aufeinander, wo es passt. Vorher setzt der Übersetzer Funktionsnamen wie `\sin` mit dem Abstand aus TeX, das Prüfskript wiederholt Abrufe bei vorübergehenden Serverfehlern, und die Quellenkarte `jpl-horizons` zeigt auf das Handbuch (Entscheidungen von Jens vom 17.09.2026, Abnahmeprotokoll 4d-1 §8). Danach **Halt** für die Freigabe von Etappe 4d-3.

**Architektur:** Task 1 bis 2 sind kleine Code-Tasks mit Tests: `texUebersetzer.ts` bekommt nach jedem Funktionsnamen die Funktionsanwendung (U+2061) und dünne Abstände nach der Regel aus TeX; `literaturVergleich.ts` bekommt eine reine, getestete Wiederholungsfunktion, die `pruefe-literatur.ts` um jeden Abruf legt; `quellen.ts` ändert eine Karte. Task 3 bis 8 sind die sechs Texte, **nicht wörtlich im Plan**: Der Umsetzer recherchiert, schreibt und belegt nach Entwurf §6.4, eine Fachprüfung mit frischem Kontext prüft (wie die Pilottexte in 4d-1). Task 9 ergänzt die Verweise zwischen Fachthemen und Pilottexten, ohne deren Wortlaut zu ändern. Task 10 ist die Abnahme nach Entwurf §8.2 samt der aus 4d-1 verschobenen Sichtprüfung des Hinweises „nur Hochschule".

**Tech-Stack:** TypeScript 6, React 19, Vitest mit jsdom, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP und Python 3.12 (Pillow, numpy) für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §3.3 (Übersetzer), §4.5 (Prüfskript), §5 (Gestalt der Texte, §5.3 Fachthemen), §6 (Arbeitsweise), §7 Zeile 4d-2, §8.1 Nachtrag und §8.2 (Abnahme). Vorlage für Text-Tasks und Abnahme: Plan `docs/superpowers/plans/2026-09-17-phase4d-hochschule-etappe1.md` und Protokoll `docs/phase4d-etappe1-abnahme.md`. Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und in Originaltiteln des Literaturkatalogs.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben). Protokolle, Berichte in versionierten Dateien und Beleglisten nennen die Wort- und Trailerprüfung nur als Verweis auf die lokale Projektanleitung, **nie mit Suchmuster** (sonst stehen die geprüften Wörter selbst im Baum; Befund 4d-1, Commit 7cd5a75).
- Branch `hochschule-2` (von `master`), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (Test in `literatur.test.ts`) und steht alphabetisch nach Kennung (Test).
- Keine neue Abhängigkeit in `package.json`.
- TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben (`'\\sin E'`).
- Texte (Entwurf §5): erste Zeile `# Titel` gleich dem Titel aus `ui/i18n` (`thema.<id>.title`); Hochschultexte enden mit `*Stand: September 2026*` beziehungsweise `*As of September 2026*` als eigenem Absatz (Monat und Jahr des Commits, mit dem der Text fertig wird); `literatur:` nur in Hochschultexten; Richtwert für Themen 1000 bis 2000 Wörter je Fassung (Richtigkeit geht vor Wortzahl).
- Verweise auf Fachthemen nur, wenn das Ziel schon einen Hochschultext hat (die Fachthemen haben keinen Gymnasialtext als Ersatz; der Dateitest „Ziel hat Text im selben Niveau" scheitert sonst). Fehlende Verweise ergänzt Task 9.
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. **Kommentare im Code sind kein Beleg** — Werte aus Code, Datensätzen oder Primärdaten selbst herleiten. Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig; Fachprüfer dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser und ändern nur die Spalte „Prüfung" ihrer Belegliste.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Funktionsnamen mit Funktionsanwendung und Abstand | `src/ui/info/texUebersetzer.ts`, `src/ui/info/texUebersetzer.test.ts`, Entwurf §3.3 (Nachtrag) |
| 2 | Prüfskript wiederholt Abrufe; Quellenkarte `jpl-horizons` | `scripts/literaturVergleich.ts`, `scripts/literaturVergleich.test.ts`, `scripts/pruefe-literatur.ts`, `src/data/quellen.ts`, Entwurf §4.5 (Nachtrag) |
| 3 | Fachthema `bezugssysteme` | 2 Texte, `docs/belege/hochschule/thema-bezugssysteme.md`, `src/data/literatur.ts` |
| 4 | Fachthema `gezeiten` | 2 Texte, `docs/belege/hochschule/thema-gezeiten.md`, `src/data/literatur.ts` |
| 5 | Fachthema `resonanzen` | 2 Texte, `docs/belege/hochschule/thema-resonanzen.md`, `src/data/literatur.ts` |
| 6 | Fachthema `innerer-aufbau` | 2 Texte, `docs/belege/hochschule/thema-innerer-aufbau.md`, `src/data/literatur.ts` |
| 7 | Fachthema `photometrie` | 2 Texte, `docs/belege/hochschule/thema-photometrie.md`, `src/data/literatur.ts` |
| 8 | Fachthema `entstehung` | 2 Texte, `docs/belege/hochschule/thema-entstehung.md`, `src/data/literatur.ts` |
| 9 | Verweise zwischen Fachthemen und Pilottexten | die 12 neuen und die 6 Pilottexte (nur Verweis-Auszeichnung) |
| 10 | Abnahme | `docs/phase4d-etappe2-abnahme.md`, `README.md` |

Texte liegen unter `src/data/texte/<de|en>/hochschule/thema-<kennung>.md`.

**Testzahlen:** Ausgangsstand `master` f0963a0: 3537 Tests. Jeder Task nennt die Zahl seiner neuen Fälle; ein Thementext auf Hochschulniveau erzeugt im Dateitest 10 Fälle (2 Dateien = 20). Der Bericht jedes Tasks nennt die tatsächliche Gesamtzahl nach `npm test` (für die Herleitung im Abnahmeprotokoll). Weicht sie ab, die Ursache nennen, nicht den Test anpassen.

---

### Task 1: Funktionsnamen mit Funktionsanwendung und Abstand

**Dateien:**
- Ändern: `src/ui/info/texUebersetzer.ts` (Typ `Atom`, `einfach`, Großoperator-Atom, Zweig `FUNKTIONEN` in `befehl`, Rückgabe von `liste`; neue Modulfunktionen)
- Ändern: `src/ui/info/texUebersetzer.test.ts` (Fall „setzt Funktionsnamen aufrecht als ein Zeichen" ersetzen, einen Fall ergänzen)
- Ändern: `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` (§3.3, Nachtrag)

**Schnittstellen:**
- Konsumiert: `texNachMathml(tex, block)` und `MathKnoten` aus 4d-1 (unverändert).
- Produziert: Funktionsnamen (`\sin`, `\cos`, `\tan`, `\arcsin`, `\arctan`, `\exp`, `\ln`, `\log`, `\max`, `\min`) erzeugen hinter dem Namen samt Hoch-/Tiefstellung immer `{ tag: 'mo', text: '⁡' }`. Dünner Abstand `{ tag: 'mspace', attribute: { width: '0.1667em' }, kinder: [] }`:
  - **davor**, wenn das vorige Element der Zeile existiert, kein `mspace` ist und kein `mo` außer `)` oder `]`;
  - **danach** (hinter U+2061), wenn ein nächstes Element existiert und es kein `mo` ist.
  Das entspricht TeX (Ord–Op und Op–Ord dünn; Operatoren und Klammern bringen ihren Abstand selbst mit; `\left…\right` ist innen und bekommt den Abstand).

- [ ] **Schritt 1: Tests schreiben**

In `src/ui/info/texUebersetzer.test.ts` den Fall

```ts
  it('setzt Funktionsnamen aufrecht als ein Zeichen', () => {
    expect(zeile('\\sin E')).toEqual([mi('sin'), mi('E')]);
  });
```

ersetzen durch:

```ts
  it('setzt Funktionsnamen mit Funktionsanwendung und dünnem Abstand wie TeX', () => {
    const fa = mo('⁡');
    const sp = el('mspace', [], { width: '0.1667em' });
    expect(zeile('\\sin E')).toEqual([mi('sin'), fa, sp, mi('E')]);
    expect(zeile('e \\sin E')).toEqual([mi('e'), sp, mi('sin'), fa, sp, mi('E')]);
    expect(zeile('\\sin^2 E')).toEqual([el('msup', [mi('sin'), mn('2')]), fa, sp, mi('E')]);
    expect(zeile('\\sin\\cos x')).toEqual([mi('sin'), fa, sp, mi('cos'), fa, sp, mi('x')]);
    expect(zeile('\\sin\\left(x\\right)')).toEqual([
      mi('sin'), fa, sp, el('mrow', [mo('(', STRETCHY), mi('x'), mo(')', STRETCHY)]),
    ]);
    expect(zeile('(x)\\ln y')).toEqual([mo('('), mi('x'), mo(')'), sp, mi('ln'), fa, sp, mi('y')]);
  });

  it('setzt keinen zusätzlichen Abstand neben Operatoren, Klammern, Abständen und am Zeilenende', () => {
    const fa = mo('⁡');
    const sp = el('mspace', [], { width: '0.1667em' });
    expect(zeile('\\sin(x)')).toEqual([mi('sin'), fa, mo('('), mi('x'), mo(')')]);
    expect(zeile('a = \\cos E')).toEqual([mi('a'), mo('='), mi('cos'), fa, sp, mi('E')]);
    expect(zeile('a\\,\\sin E')).toEqual([mi('a'), sp, mi('sin'), fa, sp, mi('E')]);
    expect(zeile('(\\cos E - e)')).toEqual([mo('('), mi('cos'), fa, sp, mi('E'), mo('−'), mi('e'), mo(')')]);
    expect(zeile('\\ln')).toEqual([mi('ln'), fa]);
    expect(zeile('x^{\\sin}')).toEqual([el('msup', [mi('x'), el('mrow', [mi('sin'), fa])])]);
  });
```

Hinweis zum letzten Fall: `{\sin}` ist eine Gruppe mit zwei Kindern (`mi`, `mo`), `zeileAus` macht daraus ein `mrow`.

- [ ] **Schritt 2: Tests laufen lassen, Fehlschlag prüfen**

Run: `npx vitest run src/ui/info/texUebersetzer.test.ts`
Expected: FAIL in beiden neuen Fällen (erwartetes `mo` U+2061 fehlt), alle übrigen Fälle PASS.

- [ ] **Schritt 3: Umsetzen**

In `src/ui/info/texUebersetzer.ts`:

Typ und Hilfen (ersetzen):

```ts
/** Ein Element der Zeile samt Hoch- und Tiefstellung, die erst am Ende gebaut wird. */
interface Atom { basis: MathKnoten; grenzen: boolean; funktion: boolean; unten: MathKnoten | null; oben: MathKnoten | null }

const einfach = (basis: MathKnoten): Atom => ({ basis, grenzen: false, funktion: false, unten: null, oben: null });
```

Direkt darunter neu:

```ts
/** Dünner Abstand wie \, in TeX (3 mu). */
const duenn = (): MathKnoten => ({ tag: 'mspace', attribute: { width: '0.1667em' }, kinder: [] });

const istMo = (k: MathKnoten | undefined): boolean => k !== undefined && 'text' in k && k.tag === 'mo';

/**
 * Funktionsnamen wie in TeX (Entwurf 4d §3.3, Nachtrag 4d-2): hinter dem
 * Namen samt Hoch- und Tiefstellung die unsichtbare Funktionsanwendung
 * U+2061; ein dünner Abstand davor, wenn Gewöhnliches oder eine schließende
 * Klammer vorangeht, und danach, wenn kein Operator folgt. Operatoren und
 * Klammern (mo) bringen ihren Abstand in MathML selbst mit; ein vorhandener
 * mspace wird nicht verdoppelt.
 */
function mitFunktionsabstaenden(atome: readonly Atom[], knoten: readonly MathKnoten[]): MathKnoten[] {
  const zeile: MathKnoten[] = [];
  knoten.forEach((k, i) => {
    const funktion = atome[i]?.funktion === true;
    if (funktion) {
      const vorher = zeile[zeile.length - 1];
      const schliessend = vorher !== undefined && 'text' in vorher && (vorher.text === ')' || vorher.text === ']');
      if (vorher !== undefined && vorher.tag !== 'mspace' && (!istMo(vorher) || schliessend)) zeile.push(duenn());
    }
    zeile.push(k);
    if (funktion) {
      zeile.push({ tag: 'mo', text: '⁡' });
      const danach = knoten[i + 1];
      if (danach !== undefined && !istMo(danach)) zeile.push(duenn());
    }
  });
  return zeile;
}
```

In `liste` die letzte Zeile `return atome.map(bauen);` ersetzen durch:

```ts
      return mitFunktionsabstaenden(atome, atome.map(bauen));
```

In `befehl` die Zeile `if (FUNKTIONEN.has(n)) return einfach({ tag: 'mi', text: n });` ersetzen durch:

```ts
      if (FUNKTIONEN.has(n)) return { ...einfach({ tag: 'mi', text: n }), funktion: true };
```

Im Großoperator-Zweig das Objekt um `funktion: false` ergänzen:

```ts
        return { basis: { tag: 'mo', attribute: { largeop: 'true' }, text: grossoperator }, grenzen: n === 'sum', funktion: false, unten: null, oben: null };
```

- [ ] **Schritt 4: Tests laufen lassen**

Run: `npx vitest run src/ui/info/texUebersetzer.test.ts src/ui/info/Markdown.test.tsx src/data/texte`
Expected: PASS. Neue Fälle: +1 (ein Fall ersetzt, einer neu).

- [ ] **Schritt 5: Nachtrag im Entwurf**

In `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` unter §3.3 nach dem vorhandenen „**Nachtrag (4d-1):**"-Absatz einen Absatz ergänzen:

```md
**Nachtrag (4d-2):** Funktionsnamen (`\sin`, `\cos`, `\tan`, `\arcsin`, `\arctan`, `\exp`,
`\ln`, `\log`, `\max`, `\min`) stehen als `mi` mit nachfolgender Funktionsanwendung
(`<mo>&#x2061;</mo>`, auch für Screenreader). Ein dünner Abstand (0,1667 em) steht davor, wenn
Gewöhnliches oder eine schließende Klammer vorangeht, und danach, wenn kein Operator und keine
Klammer folgt — wie in TeX. So erscheint `M = E - e\sin E` nicht mehr als gedrängtes „e sinE".
```

- [ ] **Schritt 6: Commit**

```bash
git add src/ui/info/texUebersetzer.ts src/ui/info/texUebersetzer.test.ts docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md
git commit -m "Formelsatz: Funktionsnamen mit Funktionsanwendung und Abstand wie TeX"
```

Danach Trailer-Kontrolle (lokale Projektanleitung).

---

### Task 2: Prüfskript wiederholt Abrufe; Quellenkarte `jpl-horizons` auf das Handbuch

**Dateien:**
- Ändern: `scripts/literaturVergleich.ts` (neue Exporte `WIEDERHOLBARE_STATUS`, `mitWiederholung`)
- Ändern: `scripts/literaturVergleich.test.ts` (neuer `describe`)
- Ändern: `scripts/pruefe-literatur.ts` (jeder `fetch` über `mitWiederholung`)
- Ändern: `src/data/quellen.ts` (Eintrag `jpl-horizons`)
- Ändern: Entwurf §4.5 (Nachtrag)

**Schnittstellen:**
- Konsumiert: `ZEITLIMIT_MS`, `KOPF`, `warte` aus `pruefe-literatur.ts` (4d-1).
- Produziert:
  - `export const WIEDERHOLBARE_STATUS: ReadonlySet<number>` = `{502, 503, 504}`.
  - `export async function mitWiederholung<T extends { status: number }>(abruf: () => Promise<T>, warte: (ms: number) => Promise<void>, pausenMs?: readonly number[]): Promise<T>` — Standard `pausenMs` = `[2000, 5000]` (bis zu zwei Wiederholungen). Wiederholt bei Status aus `WIEDERHOLBARE_STATUS` und bei einem Fehler mit `name === 'TimeoutError'` (so meldet `AbortSignal.timeout` den Abbruch); liefert nach der letzten Pause die letzte Antwort beziehungsweise wirft den letzten Fehler. Andere Status (auch 404, 429) und andere Fehler gehen sofort durch.
  - Karte `jpl-horizons`: gleiche Kennung (die Texte verweisen darauf), neue Adresse und Titel.

- [ ] **Schritt 1: Tests schreiben**

In `scripts/literaturVergleich.test.ts` den Import um `mitWiederholung` und `WIEDERHOLBARE_STATUS` ergänzen und am Ende anfügen:

```ts
describe('mitWiederholung', () => {
  /** Liefert der Reihe nach die angegebenen Status oder wirft die angegebenen Fehler. */
  function folge(schritte: readonly (number | Error)[]): { abruf: () => Promise<{ status: number }>; aufrufe: () => number } {
    let n = 0;
    return {
      abruf: () => {
        const s = schritte[Math.min(n, schritte.length - 1)]!;
        n += 1;
        return s instanceof Error ? Promise.reject(s) : Promise.resolve({ status: s });
      },
      aufrufe: () => n,
    };
  }
  const zeitueberschreitung = (): Error => Object.assign(new Error('Zeit abgelaufen'), { name: 'TimeoutError' });

  it('wiederholt bei 502, 503 und 504 mit den angegebenen Pausen und liefert die erste gute Antwort', async () => {
    expect([...WIEDERHOLBARE_STATUS].sort()).toEqual([502, 503, 504]);
    const f = folge([504, 503, 200]);
    const pausen: number[] = [];
    const antwort = await mitWiederholung(f.abruf, async (ms) => { pausen.push(ms); }, [10, 20]);
    expect(antwort.status).toBe(200);
    expect(f.aufrufe()).toBe(3);
    expect(pausen).toEqual([10, 20]);
  });

  it('gibt nach der letzten Wiederholung die letzte Antwort zurück', async () => {
    const f = folge([504]);
    const antwort = await mitWiederholung(f.abruf, async () => {}, [10, 20]);
    expect(antwort.status).toBe(504);
    expect(f.aufrufe()).toBe(3);
  });

  it('wiederholt nicht bei anderen Status', async () => {
    for (const status of [200, 404, 429, 500]) {
      const f = folge([status]);
      expect((await mitWiederholung(f.abruf, async () => {}, [10])).status).toBe(status);
      expect(f.aufrufe()).toBe(1);
    }
  });

  it('wiederholt bei Zeitüberschreitung und wirft zuletzt, andere Fehler sofort', async () => {
    const erholt = folge([zeitueberschreitung(), 200]);
    expect((await mitWiederholung(erholt.abruf, async () => {}, [10])).status).toBe(200);
    expect(erholt.aufrufe()).toBe(2);

    const dauerhaft = folge([zeitueberschreitung()]);
    await expect(mitWiederholung(dauerhaft.abruf, async () => {}, [10])).rejects.toThrow('Zeit abgelaufen');
    expect(dauerhaft.aufrufe()).toBe(2);

    const netz = folge([new TypeError('fetch failed')]);
    await expect(mitWiederholung(netz.abruf, async () => {}, [10])).rejects.toThrow('fetch failed');
    expect(netz.aufrufe()).toBe(1);
  });
});
```

- [ ] **Schritt 2: Tests laufen lassen, Fehlschlag prüfen**

Run: `npx vitest run scripts/literaturVergleich.test.ts`
Expected: FAIL (`mitWiederholung` ist kein Export).

- [ ] **Schritt 3: Umsetzen in `scripts/literaturVergleich.ts`**

Am Ende der Datei anfügen:

```ts
/** Vorübergehende Serverfehler, bei denen ein zweiter Versuch lohnt (ADS antwortet gelegentlich 504). */
export const WIEDERHOLBARE_STATUS: ReadonlySet<number> = new Set([502, 503, 504]);

const istZeitueberschreitung = (e: unknown): boolean =>
  typeof e === 'object' && e !== null && (e as { name?: unknown }).name === 'TimeoutError';

/**
 * Ruft `abruf` auf und wiederholt nach den Pausen aus `pausenMs` bei einem
 * Status aus WIEDERHOLBARE_STATUS oder einer Zeitüberschreitung
 * (Entscheidung Jens, 17.09.2026). Nach der letzten Pause gilt das letzte
 * Ergebnis. `abruf` muss bei jedem Aufruf ein neues Zeitlimit-Signal
 * erzeugen, weil ein abgelaufenes Signal abgelaufen bleibt.
 */
export async function mitWiederholung<T extends { status: number }>(
  abruf: () => Promise<T>,
  warte: (ms: number) => Promise<void>,
  pausenMs: readonly number[] = [2000, 5000],
): Promise<T> {
  for (let versuch = 0; ; versuch += 1) {
    const pause = pausenMs[versuch];
    try {
      const antwort = await abruf();
      if (pause === undefined || !WIEDERHOLBARE_STATUS.has(antwort.status)) return antwort;
    } catch (e) {
      if (pause === undefined || !istZeitueberschreitung(e)) throw e;
    }
    await warte(pause);
  }
}
```

- [ ] **Schritt 4: Tests laufen lassen**

Run: `npx vitest run scripts/literaturVergleich.test.ts`
Expected: PASS. Neue Fälle: +4.

- [ ] **Schritt 5: Abrufe in `scripts/pruefe-literatur.ts` umstellen**

Import um `mitWiederholung` ergänzen. Jeden der vier `fetch`-Aufrufe in eine Funktion ohne Argumente legen, die bei jedem Aufruf ein neues Signal erzeugt, und über `mitWiederholung(…, warte)` aufrufen. Die Eingrenzung von `p.doi` gilt in der Pfeilfunktion nicht mehr, deshalb vorher in eine Konstante legen. Die Crossref-Abfrage wird zu:

```ts
  if (p.doi !== undefined) {
    const doi = p.doi;
    try {
      const antwort = await mitWiederholung(() => fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
        headers: KOPF, signal: AbortSignal.timeout(ZEITLIMIT_MS),
      }), warte);
```

Ebenso die arXiv-Abfrage (`const arxiv = p.arxiv;`) und beide URL-Abrufe (`const url = p.url;`, HEAD und der GET-Ausweich bei 405). Der übrige Ablauf (Befunde, Pausen zwischen Einträgen) bleibt. Im Dateikopf-Kommentar ergänzen: „Vorübergehende Serverfehler (502, 503, 504) und Zeitüberschreitungen wiederholt es bis zu zweimal nach 2 s und 5 s."

- [ ] **Schritt 6: Rauchtest**

Run: `npm run literatur:pruefen -- --nur herald-2014,bouvier-2010`
Expected: `2 ok, 0 Warnungen, 0 Fehler`, Exit 0 (ein vorübergehender 504 darf die Laufzeit verlängern, aber keinen Fehler mehr ergeben). Ausgabe in den Bericht.

- [ ] **Schritt 7: Commit Prüfskript**

```bash
git add scripts/literaturVergleich.ts scripts/literaturVergleich.test.ts scripts/pruefe-literatur.ts
git commit -m "Literaturprüfung: Wiederholung bei vorübergehenden Serverfehlern"
```

- [ ] **Schritt 8: Quellenkarte `jpl-horizons`**

Erst die Adresse prüfen: `curl -s -o /dev/null -w '%{http_code}\n' -L https://ssd.jpl.nasa.gov/horizons/manual.html` → 200 (am 17.09.2026 geprüft). In `src/data/quellen.ts` den Eintrag ändern auf:

```ts
  {
    id: 'jpl-horizons',
    titel: { de: 'JPL Horizons: Handbuch', en: 'JPL Horizons manual' },
    herausgeber: 'JPL', sprache: 'en', art: 'werkzeug',
    url: 'https://ssd.jpl.nasa.gov/horizons/manual.html',
    fuer: ['thema:modell', 'thema:bahnelemente'],
  },
```

Run: `npx vitest run src/data`
Expected: PASS (keine neuen Fälle).

- [ ] **Schritt 9: Nachtrag im Entwurf**

Unter §4.5 einen Absatz ergänzen:

```md
**Nachtrag (4d-2):** Das Skript wiederholt Abrufe bei HTTP 502, 503, 504 und bei
Zeitüberschreitung bis zu zweimal (nach 2 s und 5 s); andere Antworten gelten sofort. Anlass war
die ADS-Adresse eines Eintrags, die gelegentlich 504 meldete.
```

- [ ] **Schritt 10: Commit Karte und Nachtrag**

```bash
git add src/data/quellen.ts docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md
git commit -m "Quellenkarte JPL Horizons zeigt auf das Handbuch"
```

---
## Gemeinsame Vorgaben für Task 3 bis 8 (Fachthemen)

Die Texte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4, mit den drei freigegebenen Pilottexten aus 4d-1 als Maßstab für Tiefe, Ton und Belegdichte (Jens, 17.09.2026). Zielgruppe ist Fachniveau (Master und Forschung). Sorgfalt vor Umfang.

**Ablauf je Task**

1. **Pilot lesen:** `src/data/texte/de/hochschule/thema-bahnelemente.md` (Gliederung eines Themas, Formeln, Tabelle, Abschnitt „Im Modell") und `docs/belege/hochschule/thema-bahnelemente.md` (Form der Belegliste).
2. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für das Thema nutzt oder bewusst weglässt (Dateien nennt der Task). Kommentare sind kein Beleg; Werte selbst aus Code und Datensätzen herleiten, bei Bedarf mit einem Skript im Scratchpad (Vite-SSR aus dem Projektverzeichnis, nicht versioniert).
3. **Recherche** (Entwurf §6.1) mit Websuche und Abruf: Übersichtsartikel, Missionsauswertungen, IAU-/IERS-/JPL-Berichte. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Autoren, Jahr, Titel, Zeitschrift, DOI vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren. Einträge, die schon im Katalog stehen (`src/data/literatur.ts`, etwa `archinal-2018`, `park-2021`, `petit-2010`, `murray-2000`, `tremaine-2009`, `williams-2016`), wiederverwenden statt doppelt anlegen.
4. **Belegliste** `docs/belege/hochschule/thema-<kennung>.md` nach Entwurf §6.2, Spalte „Prüfung" leer:

   ```md
   # Belege: thema-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile; „Beleg" ist `literatur:<id>`, `quelle:<id>`, „Herleitung" (folgt aus Definitionen oder genannten Werten) oder „Nachrechnung am Code: <Datei>". Querverweise zwischen Zeilen („siehe Nr. 12") nach jeder Neunummerierung prüfen.
5. **Katalogeinträge** in `src/data/literatur.ts`, alphabetisch nach Kennung (Test). Autoren „Nachname, I.", höchstens drei, sonst `etAl: true`. `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer. DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen. Jeder neue Eintrag muss im Text zitiert sein (Test „zitiert jeden Eintrag des Literaturkatalogs mindestens einmal").
6. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen unter der Tabelle der Belegliste begründen.
7. **Deutscher Text**, danach die **englische Fassung** mit denselben Zitaten und Formeln:
   - Erste Zeile `# <Titel aus ui/i18n>`; `##`-Abschnitte frei, aber in jedem Thema als letzter Inhaltsabschnitt `## Im Modell` / `## In the model`: was Orrery zum Thema rechnet oder bewusst weglässt, mit Verweis `thema:modell`; Abweichungen des Modells von der Wirklichkeit mit Größenordnung. Wo der Task es verlangt, zusätzlich `## Offene Fragen` / `## Open questions` davor, mit Belegen für beide Seiten jeder Streitfrage.
   - Schluss `*Stand: <Monat> 2026*` / `*As of <Month> 2026*` (Monat des Commits).
   - Formeln nur aus der Teilmenge (Entwurf §3.3 mit beiden Nachträgen): Argumente von `^`, `_`, `\frac` mit mehr als einem Zeichen in `{}` (`\frac{1}{2}`, nicht `\frac12`); `\text{…}` ohne verschachtelte Klammern und in beiden Fassungen **gleich**; Dezimalkomma in deutschen Formeln als `{,}`, in englischen `.`. Fehlt ein Befehl, ist das ein eigener Zwischen-Task (Test in `texUebersetzer.test.ts`, eigener Commit), kein Umweg im Text.
   - Zahlen im Fließtext: gleiche Werte in beiden Fassungen; Tausendertrennung ab fünf Stellen (Deutsch Leerzeichen „25 770", Englisch Komma „25,770"), vierstellige Zahlen ohne Trennung.
   - Kein `$` außerhalb von Formeln (Dateitest).
8. **Verweise:** `objekt:`, `szene:`, `thema:` dürfen auf Kennungen ohne Hochschultext zeigen (Gymnasialtext als Ersatz), **außer** auf Fachthemen ohne Hochschultext (siehe Globale Randbedingungen). Kennungen gegen `src/data/index.ts`, `src/data/scenes.ts` und `src/data/themen.ts` prüfen. Jeder `quelle:`-Verweis braucht eine Karte zur Kennung des Texts (`fuer` in `src/data/quellen.ts`); für jedes Fachthema gibt es schon Karten (Task nennt sie).
9. `npx vitest run src/data src/ui/info` → PASS; `npm test` → Gesamtzahl notieren. Wortzahl beider Fassungen (`wc -w`) im Bericht.
10. **Commit** von Texten, Belegliste und Katalogeinträgen zusammen (Commit-Text im Task).
11. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem Auftrag unten.
12. **Nacharbeit:** Alle Befunde der Klasse Fehler und die **sachlichen** Hinweise (Aussage ungenau oder missverständlich, Beleg stützt nicht wörtlich, Fassungen weichen im Sinn ab, fehlende Belegzeilen) behebt der Umsetzer gebündelt in einem Nacharbeits-Commit, jeden Punkt vorher selbst an Quelle oder Code geprüft. Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger und werden am Ende der Etappe entschieden. In der Belegliste tragen geänderte oder neue Zeilen in „Prüfung" die Markierung `neu nach Fachprüfung (Runde <n>)`; alle anderen Prüfeinträge bleiben. Danach prüft ein Prüfer nur die geänderten Stellen und die markierten Zeilen. Nach der zweiten Nachprüfung gehen verbleibende Hinweise ins Ledger; Fehler werden weiter behoben.
13. Die ausgefüllte Spalte „Prüfung" kommt mit dem letzten Nacharbeits-Commit (oder ohne Nacharbeit mit einem eigenen Commit „Belegliste thema-<kennung>: Fachprüfung abgeschlossen") ins Repository.

**Auftrag an die Fachprüfung (wörtlich, Platzhalter ersetzen)**

> Prüfe die Hochschultexte `src/data/texte/de/hochschule/thema-<kennung>.md` und `src/data/texte/en/hochschule/thema-<kennung>.md` mit der Belegliste `docs/belege/hochschule/thema-<kennung>.md` (Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, §5 und §6.3). Zielgruppe ist Fachniveau (Master und Forschung). Öffne jede zitierte Arbeit selbst (DOI über doi.org oder Crossref, arXiv, ADS), mindestens die Zusammenfassung; verlasse dich nicht auf die Belegliste. Kommentare im Code sind kein Beleg; rechne Aussagen über das Modell am Code selbst nach (Skripte nur im Scratchpad). Prüfe:
> 1. Stützt die zitierte Arbeit die Aussage im Text?
> 2. Stimmen Zahl, Einheit und Unsicherheit mit der Quelle?
> 3. Passen Aussagen über Orrery zum Code (`src/data/`, `src/sim/`, `src/render/`), und erklärt „Im Modell" jede Abweichung?
> 4. Stimmen Dimensionen und Größenordnungen der Formeln?
> 5. Sagt die englische Fassung dasselbe wie die deutsche, einschließlich aller Zahlen?
> 6. Sind Streitfragen als solche dargestellt, mit Belegen für beide Seiten?
>
> Trage je Zeile der Belegliste in „Prüfung" ein: `ok (…)`, `Fehler: …` oder `Hinweis: …`, jeweils sobald die Zeile fertig ist. Nenne außerdem Aussagen im Text, die in der Belegliste fehlen. Ändere keine Texte, keinen Code, keinen anderen Teil der Belegliste; kein Commit, kein Browser, keine Subagenten. Schreibe die Befundliste fortlaufend nach `<Befunddatei>` (Klasse Fehler: sachlich falsch, Beleg stützt nicht, Zahl weicht ab, Fassungen widersprechen sich; Hinweis: Ton, Vollständigkeit, besserer Beleg; je Befund Fundstelle Datei:Zeile beider Fassungen). Rückgabe höchstens 12 Zeilen: Zählung ok/Fehler/Hinweis, Fehler als Einzeiler, Pfad der Befunddatei.

---

### Task 3: Fachthema `bezugssysteme`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-bezugssysteme.md`, `src/data/texte/en/hochschule/thema-bezugssysteme.md`, `docs/belege/hochschule/thema-bezugssysteme.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 (Funktionsnamen), Task 2 (Prüfskript mit Wiederholung).
- Produziert: Hochschultext `thema:bezugssysteme`; danach dürfen weitere Texte darauf verweisen.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Bezugssysteme und Zeitskalen` / `# Reference systems and time scales`. Richtwert 1000 bis 2000 Wörter je Fassung.
- Inhalt mindestens: ICRS und seine Realisierung ICRF3 (Radioquellen, Achsenstabilität, Gaia-CRF als optische Realisierung); Ekliptik und Äquinoktium J2000 gegenüber ICRS (Rahmenversatz, Schiefe); mittleres Äquinoktium des Datums, Präzession und Nutation als Unterschied zum festen Rahmen; Laplace-Ebene der Monde; IAU-Rotationsmodelle (Pol, Nullmeridian W, Epoche) und warum die Erde dort fehlt; Zeitskalen TAI, UTC, UT1, TT, TCB, TDB mit ihren Beziehungen (Schaltsekunden, ΔT, TDB − TT periodisch um rund 1,7 ms); Ephemeriden (DE440/DE441) gegen mittlere Elemente.
- `## Offene Fragen` optional (etwa Anbindung der Gaia-Realisierung an ICRF3, Zukunft der Schaltsekunde).
- `## Im Modell`: welche Zeitskala die Uhr einsetzt und was daraus folgt (UTC als TDB, rund 69 s heute; Befund aus 4d-1), Bezugsebenen der Bahndaten (Ekliptik J2000, Äquatorebene des Mutterkörpers), Pol- und Rotationsdaten, Rahmenversatz ICRF/Ekliptik in `frames.ts`; Erde ohne gültiges IAU-Rotationsmodell (Befund aus 4d-1: Drehphase bei J2000 rund 79,5° neben dem Erdrotationswinkel) — nur beschreiben, wie der Code heute ist, Zahlen selbst nachrechnen.
- Code lesen: `src/sim/time.ts`, `src/sim/frames.ts`, `src/sim/orbit.ts` (`rotationAt`, `elementsAt`), `src/sim/types.ts` (Bezugsebene, Pol, Rotationsphase), `src/data/bodies/earth.ts`, `src/data/bodies/moon.ts`, `src/data/bodies/uranus-monde.ts` (Laplace-Ebene).
- Verweise: `thema:bahnelemente` und `objekt:earth` (haben Hochschultexte), `thema:modell`; Karten zu `thema:bezugssysteme`: `quelle:jpl-ephemeriden`, `quelle:wikipedia-de-icrs`, `quelle:wikipedia-en-icrs`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): Charlot et al. 2020, ICRF3 (*Astronomy & Astrophysics* 644, A159); Gaia Collaboration 2022, Gaia-CRF3 (*A&A* 667, A148); Archinal et al. 2018, IAU-Bericht zu Rotationsmodellen (`archinal-2018`); Petit und Luzum 2010, IERS Conventions (`petit-2010`); Park et al. 2021, DE440/DE441 (`park-2021`); IAU-Resolution B3 (2006) zur TDB; Soffel et al. 2003 zu den IAU-2000-Resolutionen (*Astronomical Journal* 126, 2687).
- Neue Testfälle: 2 Dateien × 10 = 20.

- [ ] **Schritt 1:** Pilot und Code lesen (Gemeinsame Vorgaben 1 und 2).
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler (3 bis 6).
- [ ] **Schritt 3:** Deutscher Text, englische Fassung (7 und 8).
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; `npm test`; Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-bezugssysteme.md src/data/texte/en/hochschule/thema-bezugssysteme.md docs/belege/hochschule/thema-bezugssysteme.md src/data/literatur.ts
git commit -m "Hochschultext Bezugssysteme und Zeitskalen mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit (Gemeinsame Vorgaben 11 bis 13).

---

### Task 4: Fachthema `gezeiten`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-gezeiten.md`, `src/data/texte/en/hochschule/thema-gezeiten.md`, `docs/belege/hochschule/thema-gezeiten.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 3.
- Produziert: Hochschultext `thema:gezeiten`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Gezeiten und Roche-Grenze` / `# Tides and the Roche limit`. Richtwert 1000 bis 2000 Wörter.
- Inhalt mindestens: Gezeitenpotential (Grad 2) und Gezeitenbeschleunigung als Formel; Love-Zahlen k₂ und h₂ (Definition, Messverfahren, Messwerte für Erde, Mond, Mars, Titan mit Unsicherheit als Tabelle); Phasenverzug, Güte Q und k₂/Q, Frequenzabhängigkeit; Bahnentwicklung (Zunahme des Mondabstands aus Mond-Laserentfernungen, Tageslänge; Io und Titan mit schnellerer Migration als klassisch erwartet); Gezeitenheizung (Io, Enceladus) mit der Standardformel für die Dissipation; gebundene Rotation und ihre Zeitskala; Roche-Grenze für starre und flüssige Körper samt Formel und Beispielen (Saturnringe, Phobos).
- `## Offene Fragen` Pflicht: etwa Resonanzsperre gegen konstantes Q bei Riesenplaneten, Q von Jupiter und Saturn, Ursache der Titan-Migration.
- `## Im Modell`: Orrery rechnet keine Gezeitenkräfte; Bahnraten sind lineare Fits (der Mondabstand wächst im Modell nicht); gebundene Rotation steckt in Rotationsphasen und -perioden der Datensätze (am Code zeigen, für welche Monde die Rotationsperiode der Umlaufzeit gleicht); Phobos' Bahnverfall fehlt.
- Code lesen: `src/sim/orbit.ts` (`rotationAt`, `umlaufzeitTage`), `src/data/bodies/moon.ts`, `src/data/bodies/mars-monde.ts`, `src/data/bodies/jupiter-monde.ts`, `src/data/bodies/saturn-monde.ts`, `src/data/bodies/saturn.ts` (Ringe).
- Verweise: `thema:gebundene-rotation`, `thema:ringe`, `objekt:io`, `objekt:enceladus`, `objekt:phobos`, `objekt:moon`, `objekt:earth`, `thema:bezugssysteme`, `thema:modell`; Karten zu `thema:gezeiten`: `quelle:wikipedia-de-roche-grenze`, `quelle:wikipedia-en-roche-limit`, `quelle:wikipedia-en-tidal-heating`, `quelle:wikipedia-de-love-zahlen`.
- Ausgangspunkte (vor Verwendung prüfen): Murray und Dermott, *Solar System Dynamics*, Kap. 4 (`murray-2000`); Williams und Boggs 2016 zur Gezeitenverzögerung des Mondes (`williams-2016`); Lainey et al. 2009, Io-Dissipation aus Astrometrie (*Nature* 459, 957); Lainey et al. 2020, Titan-Migration (*Nature Astronomy* 4, 1053); Fuller, Luan und Quataert 2016, Resonanzsperre (*MNRAS* 458, 3867); Konopliv et al. 2020, Mars k₂ (*Geophysical Research Letters* 47); Iess et al. 2012, Titan k₂ (*Science* 337, 457); Peale, Cassen und Reynolds 1979 (*Science* 203, 892); Black und Mittal 2015 zu Phobos (*Nature Geoscience* 8, 913).
- Neue Testfälle: 20.

- [ ] **Schritt 1:** Pilot und Code lesen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-gezeiten.md src/data/texte/en/hochschule/thema-gezeiten.md docs/belege/hochschule/thema-gezeiten.md src/data/literatur.ts
git commit -m "Hochschultext Gezeiten und Roche-Grenze mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 5: Fachthema `resonanzen`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-resonanzen.md`, `src/data/texte/en/hochschule/thema-resonanzen.md`, `docs/belege/hochschule/thema-resonanzen.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 4.
- Produziert: Hochschultext `thema:resonanzen`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Bahnresonanzen` / `# Orbital resonances`. Richtwert 1000 bis 2000 Wörter.
- Inhalt mindestens: Mittelbewegungsresonanz p:q mit resonantem Winkel als Formel, Libration gegen Zirkulation, Resonanzbreite; Laplace-Resonanz von Io, Europa und Ganymed (Beziehung der mittleren Längen, Librationsamplitude); Neptun–Pluto 3:2 mit Schutz vor nahen Begegnungen und Libration des Perihelarguments; säkulare Resonanzen (ν₆), Kirkwood-Lücken als Mittelbewegungsresonanzen mit Jupiter und Chaos; Resonanzeinfang durch Migration; Saturnmonde (Mimas–Tethys, Enceladus–Dione, Titan–Hyperion) als Tabelle mit Verhältnis und resonantem Winkel.
- `## Offene Fragen` Pflicht: etwa Alter und Entstehung der Laplace-Resonanz, Anteil resonanter Transneptunier als Beleg für Migration.
- `## Im Modell`: Orrery nutzt Kepler-Bahnen mit linearen Raten, keine gegenseitigen Störungen. Am Code nachrechnen und nennen, wie gut die Laplace-Beziehung λ_Io − 3λ_Europa + 2λ_Ganymed = 180° in den Datensätzen heute und über ±100 Jahre erfüllt ist, und ob Pluto–Neptun-Konjunktionen im Modell dem Perihel Plutos ausweichen.
- Code lesen: `src/sim/orbit.ts` (`elementsAt`, `positionAt`), `src/data/bodies/jupiter-monde.ts`, `src/data/bodies/pluto-system.ts`, `src/data/bodies/neptune.ts`, `src/data/bodies/saturn-monde.ts`, `src/sim/belts.ts` (ob der Asteroidengürtel Kirkwood-Lücken zeigt).
- Verweise: `objekt:io`, `objekt:europa`, `objekt:ganymede`, `objekt:pluto`, `objekt:neptune`, `thema:kirkwood-luecken`, `thema:bahnelemente`, `thema:gezeiten`, `thema:modell`; Karten zu `thema:resonanzen`: `quelle:wikipedia-de-bahnresonanz`, `quelle:wikipedia-en-orbital-resonance`.
- Ausgangspunkte (vor Verwendung prüfen): Murray und Dermott, Kap. 8 und 9 (`murray-2000`); Peale 1976, *Annual Review of Astronomy and Astrophysics* 14, 215; Malhotra 1993, *Nature* 365, 819; Cohen und Hubbard 1965, *Astronomical Journal* 70, 10; Williams und Benson 1971, *AJ* 76, 167; Wisdom 1983 zur 3:1-Lücke, *Icarus* 56, 51; Lainey et al. 2009 (siehe Task 4); Nesvorný 2018, *Annual Review of Astronomy and Astrophysics* 56, 137.
- Neue Testfälle: 20.

- [ ] **Schritt 1:** Pilot und Code lesen, Laplace-Beziehung am Code nachrechnen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-resonanzen.md src/data/texte/en/hochschule/thema-resonanzen.md docs/belege/hochschule/thema-resonanzen.md src/data/literatur.ts
git commit -m "Hochschultext Bahnresonanzen mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 6: Fachthema `innerer-aufbau`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-innerer-aufbau.md`, `src/data/texte/en/hochschule/thema-innerer-aufbau.md`, `docs/belege/hochschule/thema-innerer-aufbau.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 5.
- Produziert: Hochschultext `thema:innerer-aufbau`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Innerer Aufbau aus Schwerefeld und Rotation` / `# Interior structure from gravity and rotation`. Richtwert 1000 bis 2000 Wörter.
- Inhalt mindestens: Entwicklung des Schwerepotentials nach Kugelfunktionen, J₂ und höhere Momente; Trägheitsmomentfaktor C/(MR²) und seine Bestimmung (Präzession; Radau-Darwin-Näherung im hydrostatischen Gleichgewicht mit Formel und Gültigkeitsgrenzen); Libration und Schiefe als Maß für den Kern (Merkur, Mond); Love-Zahl k₂ als Randbedingung (Verweis auf `thema:gezeiten`); Seismologie (Erde, Mond, Mars mit InSight) und Ringseismologie bei Saturn; Tabelle C/(MR²) mit Unsicherheit und Verfahren für Erde, Mond, Mars, Merkur, Jupiter, Saturn, Ganymed, Titan; verdünnte Kerne der Riesenplaneten (Juno, Cassini).
- `## Offene Fragen` Pflicht: etwa Größe und Zustand des Marskerns nach InSight, verdünnter Kern Jupiters, Hydrostatik Titans.
- `## Im Modell`: Orrery rechnet kein Inneres und kein Schwerefeld jenseits der Punktmasse; ob die Darstellung Abplattung zeigt, am Code prüfen; Massen und GM-Werte der Datensätze mit Quelle (Befund aus 4d-1: G·M⊙ aus CODATA-G und Masse liegt 45 ppm über dem IAU-Wert).
- Code lesen: `src/data/bodies/*.ts` (Massen, Radien, eventuell Abplattung), `src/render/bodies.ts` (Form der Körper), `src/sim/orbit.ts` (`umlaufzeitTage`: Gravitationskonstante und Massen).
- Verweise: `objekt:earth`, `thema:gezeiten`, `objekt:mars`, `objekt:mercury`, `objekt:jupiter`, `objekt:saturn`, `objekt:moon`, `thema:ringe`, `thema:modell`; Karten zu `thema:innerer-aufbau`: `quelle:wikipedia-de-love-zahlen`, `quelle:wikipedia-en-moment-of-inertia-factor`.
- Ausgangspunkte (vor Verwendung prüfen): Iess et al. 2018, Jupiter-Schwerefeld (*Nature* 555, 220); Wahl et al. 2017, verdünnter Kern (*Geophysical Research Letters* 44, 4649); Stähler et al. 2021, Marskern (*Science* 373, 443); Margot et al. 2012, Merkur (*Journal of Geophysical Research: Planets* 117, E00L09); Williams et al. 2014, Mond aus GRAIL (*JGR Planets* 119, 1546); Mankovich und Fuller 2021, Saturn (*Nature Astronomy* 5, 1103); Iess et al. 2014, Titan (*Science* 344, 78); Chen et al. 2015 zur Erde (`chen-2015`).
- Neue Testfälle: 20.

- [ ] **Schritt 1:** Pilot und Code lesen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-innerer-aufbau.md src/data/texte/en/hochschule/thema-innerer-aufbau.md docs/belege/hochschule/thema-innerer-aufbau.md src/data/literatur.ts
git commit -m "Hochschultext Innerer Aufbau mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 7: Fachthema `photometrie`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-photometrie.md`, `src/data/texte/en/hochschule/thema-photometrie.md`, `docs/belege/hochschule/thema-photometrie.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 6.
- Produziert: Hochschultext `thema:photometrie`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Albedo und Helligkeit` / `# Albedo and brightness`. Richtwert 1000 bis 2000 Wörter.
- Inhalt mindestens: geometrische Albedo p, Phasenintegral q und Bond-Albedo A = p·q als Formeln; Lambert-Kugel (q = 3/2) und Lommel-Seeliger; Phasenfunktion und Oppositionseffekt (Schattenverbergen gegen kohärente Rückstreuung); absolute Helligkeit H und Durchmesser aus H und p als Formel; H-G- und H-G₁-G₂-System; scheinbare Helligkeiten der Planeten; Tabelle p und A für ausgewählte Körper (etwa Erde, Mond, Venus, Jupiter, Enceladus, Iapetus hell und dunkel) mit Quelle; Gleichgewichtstemperatur als Formel.
- `## Offene Fragen` Pflicht: etwa Anteile der Mechanismen im Oppositionseffekt, Bond-Albedo von Jupiter und Saturn nach Neubestimmungen.
- `## Im Modell`: das Albedo-Modell der Darstellung am Code beschreiben (Befund aus 4d-1: Kartenmittel als geometrische Albedo gesetzt, im Wesentlichen lambertsche Streuung mit p = 2A/3, die Erde trifft weder p noch A — selbst nachrechnen), Belichtung und Tonemapping als Grund, warum Bildhelligkeiten keine Messgrößen sind.
- Code lesen: `src/render/albedo.ts`, `src/render/bodies.ts`, `src/render/lighting.ts`, `src/render/exposure.ts`, `src/render/postfx.ts`, Albedo-Werte in `src/data/bodies/*.ts`.
- Verweise: `objekt:earth`, `szene:mondfinsternis`, `objekt:iapetus`, `objekt:enceladus`, `objekt:venus`, `thema:modell`; Karten zu `thema:photometrie`: `quelle:wikipedia-de-albedo`, `quelle:wikipedia-en-geometric-albedo`.
- Ausgangspunkte (vor Verwendung prüfen): Bowell et al. 1989, H-G-System (in *Asteroids II*); Muinonen et al. 2010, H-G₁-G₂ (*Icarus* 209, 542); Mallama und Hilton 2018, Planetenhelligkeiten (*Astronomy and Computing* 25, 10); Hapke, *Theory of Reflectance and Emittance Spectroscopy* (2. Aufl. 2012); Li et al. 2018, Bond-Albedo Jupiters (*Nature Communications* 9, 3709); Stephens et al. 2015 zur Erde (`stephens-2015`); Verbiscer et al. 2007, Enceladus (*Science* 315, 815).
- Neue Testfälle: 20.

- [ ] **Schritt 1:** Pilot und Code lesen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-photometrie.md src/data/texte/en/hochschule/thema-photometrie.md docs/belege/hochschule/thema-photometrie.md src/data/literatur.ts
git commit -m "Hochschultext Albedo und Helligkeit mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 8: Fachthema `entstehung`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-entstehung.md`, `src/data/texte/en/hochschule/thema-entstehung.md`, `docs/belege/hochschule/thema-entstehung.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: Task 1 bis 7.
- Produziert: Hochschultext `thema:entstehung`.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Entstehung des Sonnensystems` / `# Formation of the Solar System`. Richtwert 1000 bis 2000 Wörter.
- Inhalt mindestens: protoplanetare Scheibe (Massen und Lebensdauer aus Beobachtungen, Temperaturprofil) und Schneelinie; Staubwachstum, Driftbarriere, Streaming-Instabilität; Planetesimale und Pebble-Akkretion gegenüber klassischem oligarchischem Wachstum; Riesenplaneten (Kernakkretion, Isolationsmasse); Datierung mit kurzlebigen Nukliden (²⁶Al, ¹⁸²Hf–¹⁸²W), CAI-Nullpunkt (`connelly-2012`, `bouvier-2010`) und Isotopendichotomie (NC/CC) mit Jupiters frühem Wachstum; Migration: Grand Tack und Nizza-Modell samt Varianten (frühe gegen späte Instabilität); Entstehung des Mondes (Verweis auf `objekt:earth`); Zeitleiste als Tabelle.
- `## Offene Fragen` Pflicht: etwa Zeitpunkt der Instabilität der Riesenplaneten, Grand Tack gegen Alternativen, Herkunft des irdischen Wassers — jeweils mit Belegen für beide Seiten.
- `## Im Modell`: Orrery zeigt den heutigen Zustand mit mittleren Elementen und keine Entwicklung über geologische Zeit; Gültigkeitsbereich der Raten (Jahrhunderte) am Code und an der Quelle der Elemente belegen.
- Code lesen: `src/sim/orbit.ts` (Gültigkeit der Raten), `src/data/bodies/*.ts` (Epoche, Quellenangaben), `src/sim/belts.ts`.
- Verweise: `objekt:earth`, `objekt:jupiter`, `thema:resonanzen`, `thema:zwergplaneten`, `thema:kirkwood-luecken`, `thema:bahnelemente`, `thema:modell`; Karten zu `thema:entstehung`: `quelle:wikipedia-de-entstehung-sonnensystem`, `quelle:wikipedia-en-formation-solar-system`.
- Ausgangspunkte (vor Verwendung prüfen): Johansen und Lambrechts 2017, *Annual Review of Earth and Planetary Sciences* 45, 359; Lambrechts und Johansen 2012, *A&A* 544, A32; Youdin und Goodman 2005, *Astrophysical Journal* 620, 459; Tsiganis et al. 2005, *Nature* 435, 459; Walsh et al. 2011, *Nature* 475, 206; Kruijer et al. 2017, *PNAS* 114, 6712; Nesvorný 2018 (siehe Task 5); Andrews 2020, *Annual Review of Astronomy and Astrophysics* 58, 483.
- Neue Testfälle: 20.

- [ ] **Schritt 1:** Pilot und Code lesen.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** Tests, Gesamtzahl, Wortzahlen.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-entstehung.md src/data/texte/en/hochschule/thema-entstehung.md docs/belege/hochschule/thema-entstehung.md src/data/literatur.ts
git commit -m "Hochschultext Entstehung des Sonnensystems mit Belegliste"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit.

---

### Task 9: Verweise zwischen Fachthemen und Pilottexten

**Dateien:**
- Ändern: `src/data/texte/<de|en>/hochschule/thema-{bezugssysteme,gezeiten,resonanzen,innerer-aufbau,photometrie,entstehung}.md`
- Ändern: `src/data/texte/<de|en>/hochschule/{objekt-earth,thema-bahnelemente,szene-mondfinsternis}.md`

**Schnittstellen:**
- Konsumiert: die zwölf Texte aus Task 3 bis 8, die sechs Pilottexte aus 4d-1.
- Produziert: Verweise `thema:<fachthema>` in beide Richtungen, wo der Text das Thema anspricht (Entwurf §7 Zeile 4d-2: „danach bekommt `objekt-earth` seine Verweise"; Plan 4d-1 Ruling 11).

**Vorgaben:**
- **Nur Verweis-Auszeichnung:** Ein vorhandenes Wort oder eine vorhandene Wortgruppe wird zu `[Wortgruppe](thema:<fachthema>)`. Der Wortlaut, die Zitate, die Formeln und die Stand-Zeile bleiben unverändert (die Texte sind fachgeprüft, die Pilottexte von Jens freigegeben). Zeilenumbrüche dürfen sich verschieben.
- Höchstens ein Verweis je Ziel je `##`-Abschnitt, an der ersten passenden Stelle; kein Verweis eines Texts auf sich selbst.
- Deutsche und englische Fassung bekommen dieselben Verweise an den entsprechenden Stellen.
- Mindestens: `objekt-earth` verweist auf `gezeiten` (Gezeitenreibung, Love-Zahlen), `innerer-aufbau` (Trägheitsmoment, Aufbau), `bezugssysteme` (Zeitskalen, Rotation), `photometrie` (Albedo) und `entstehung` (CAI-Alter, Mondentstehung); `thema-bahnelemente` auf `bezugssysteme` und `resonanzen`; jedes Fachthema auf jedes andere Fachthema, das es inhaltlich anspricht. Findet sich in einem Text keine passende Stelle für ein genanntes Ziel, entfällt der Verweis (im Bericht nennen).
- Neue Testfälle: 0.

- [ ] **Schritt 1: Verweise setzen**

Texte lesen, Stellen wählen, Auszeichnung ergänzen (beide Fassungen).

- [ ] **Schritt 2: Wortlaut unverändert nachweisen**

Skript `verweise_pruefen.py` im Scratchpad des Umsetzers (nicht im Projektbaum, nicht versioniert), Aufruf aus dem Projektstamm mit dem Commit vor Task 9 als Argument:

```python
import re, subprocess, sys

FACHTHEMEN = 'bezugssysteme|gezeiten|resonanzen|innerer-aufbau|photometrie|entstehung'
MUSTER = re.compile(r'\[([^\]]*)\]\(thema:(?:' + FACHTHEMEN + r')\)')
basis = sys.argv[1]

def git(*args):
    return subprocess.run(['git', *args], capture_output=True, check=True).stdout.decode('utf-8')

def ohne_verweise(text):
    return ' '.join(MUSTER.sub(r'\1', text).split())

fehler = 0
for datei in git('diff', '--name-only', basis, '--', 'src/data/texte').split():
    alt = git('show', f'{basis}:{datei}')
    with open(datei, encoding='utf-8') as f:
        neu = f.read()
    gleich = ohne_verweise(alt) == ohne_verweise(neu)
    fehler += 0 if gleich else 1
    zahl = len(MUSTER.findall(neu)) - len(MUSTER.findall(alt))
    print(f"{'ok    ' if gleich else 'ANDERS'} +{zahl} Verweise  {datei}")
sys.exit(1 if fehler else 0)
```

Expected: jede geänderte Datei `ok`, Exit 0. Ausgabe in den Bericht.

- [ ] **Schritt 3: Tests**

Run: `npx vitest run src/data src/ui/info`
Expected: PASS (Verweisziele und Niveau werden im Dateitest geprüft). `npm test` → Gesamtzahl unverändert gegenüber Task 8.

- [ ] **Schritt 4: Commit**

```bash
git add src/data/texte/de/hochschule src/data/texte/en/hochschule
git commit -m "Hochschultexte: Verweise zwischen Fachthemen und Pilottexten"
```

Vorher `git status --short` prüfen: nur Dateien unter `src/data/texte/*/hochschule/`.

---

### Task 10: Abnahme

**Dateien:**
- Erstellen: `docs/phase4d-etappe2-abnahme.md`
- Ändern: `README.md`
- Nur lokal, nicht committen: `.playwright-mcp/4d2-*.png`, `.playwright-mcp/messung_sin.py`

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 9; DOM-Attribute `[data-blockformel]`, `[data-formelfehler]`, `[data-verweis]`, `[data-literatur]`, `[data-quelle]`; `aside.info-panel`, `[role="tabpanel"]`, Hinweiszeilen `p.text-amber-300`.
- Produziert: das Abnahmeprotokoll; den Halt für Jens.

- [ ] **Schritt 1: Prüfläufe**

```bash
npm run lint
npm test
npm run build
npm run literatur:pruefen
```

Expected: Lint ohne Befund; alle Tests grün (Gesamtzahl: 3537 + Task 1 (+1) + Task 2 (+4) + Task 3 bis 8 (je +20) = 3662, zuzüglich Tests aus Zwischen-Tasks für neue TeX-Befehle); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße; Größe des Hauptchunks notieren, 4d-1: 1 243,72 kB); Prüfskript über den ganzen Katalog mit 0 Fehlern. Schlusszeilen, die Katalogzahl und die vollständige Ausgabe des Prüfskripts ins Protokoll; jede Warnung begründen.

- [ ] **Schritt 2: Browser vorbereiten**

Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` (200 erwartet, keinen zweiten Server starten). `browser_navigate` auf `http://localhost:5173/Orrery/`, dann `browser_evaluate`:

```js
() => {
  window.store.setState({ quality: { tier: 'high' } });
  const s = window.store.getState();
  s.setCinema({ running: false, pauseOnInput: false });
  s.setTime({ paused: true });
  s.setUi({ hidden: false, language: 'de', panels: { ...s.ui.panels, info: true } });
  s.setInfo({ niveau: 'hochschule', breiteRem: 40, thema: 'bahnelemente' });
  return window.innerWidth;
}
```

- [ ] **Schritt 3: Funktionsnamen messen (Task 1)**

Differenzmessung an der Blockformel `M = E - e \sin E` aus `thema-bahnelemente`, auf die vierfache Schriftgröße vergrößert (Ruling 10). Erste Aufnahme mit den Abständen (`browser_evaluate`):

```js
async () => {
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const finde = () => [...document.querySelectorAll('[data-blockformel]')]
    .find((b) => [...b.querySelectorAll('mi')].map((m) => m.textContent).join(',') === 'M,E,e,sin,E');
  const t0 = performance.now();
  while (performance.now() - t0 < 5000 && !finde()) await warte(50);
  const block = finde();
  if (!block) return null;
  block.style.fontSize = '400%';
  const aside = document.querySelector('aside.info-panel');
  aside.style.backgroundColor = 'rgb(15, 23, 42)';
  aside.style.backdropFilter = 'none';
  block.scrollIntoView({ block: 'center' });
  await document.fonts.ready;
  await warte(300);
  const r = (el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
  const mi = [...block.querySelectorAll('mi')];
  return {
    dpr: devicePixelRatio,
    em: parseFloat(getComputedStyle(block.querySelector('math')).fontSize),
    abstaende: block.querySelectorAll('mspace').length,
    funktionsanwendung: [...block.querySelectorAll('mo')].filter((m) => m.textContent === '\u2061').length,
    block: r(block), E: r(mi[4]),
  };
}
```

Expected: `abstaende` 2, `funktionsanwendung` 1. `browser_take_screenshot` (Ansicht, PNG) nach `.playwright-mcp/4d2-sin-mit.png`. Dann die Abstände in derselben Ladung auf null setzen:

```js
async () => {
  const block = [...document.querySelectorAll('[data-blockformel]')]
    .find((b) => [...b.querySelectorAll('mi')].map((m) => m.textContent).join(',') === 'M,E,e,sin,E');
  block.querySelectorAll('mspace').forEach((m) => m.setAttribute('width', '0'));
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const b = [...block.querySelectorAll('mi')][4].getBoundingClientRect();
  return { E: { x: b.x, y: b.y, w: b.width, h: b.height } };
}
```

`browser_take_screenshot` nach `.playwright-mcp/4d2-sin-ohne.png`. Messskript `.playwright-mcp/messung_sin.py`, Aufruf mit den beiden JSON-Ergebnissen als Argumente:

```python
import json, sys
import numpy as np
from PIL import Image

a = json.loads(sys.argv[1])
b = json.loads(sys.argv[2])
d = a['dpr']

def tintenspalten(datei):
    bild = np.asarray(Image.open(datei).convert('L'), dtype=float)
    y0 = int(a['block']['y'] * d)
    y1 = int((a['block']['y'] + a['block']['h']) * d)
    return (bild[y0:y1] > 128).any(axis=0)

def erste_tinte(spalten, ab):
    for x in range(int(ab), len(spalten)):
        if spalten[x]:
            return x
    return None

mit = erste_tinte(tintenspalten('.playwright-mcp/4d2-sin-mit.png'), a['E']['x'] * d)
ohne = erste_tinte(tintenspalten('.playwright-mcp/4d2-sin-ohne.png'), b['E']['x'] * d)
erwartet = 2 * 0.1667 * a['em'] * d
dom = (a['E']['x'] - b['E']['x']) * d
print('Verschiebung Tinte (px):', mit - ohne, ' DOM (px):', round(dom, 1), ' erwartet (px):', round(erwartet, 1))
```

Kriterien: Tintenverschiebung und DOM-Verschiebung je innerhalb ±15 % von `erwartet`. Werte ins Protokoll. Danach neu laden (`browser_navigate`, `quality.tier`), damit die Stiländerungen nicht in spätere Messungen wirken.

- [ ] **Schritt 4: Hinweis „nur Hochschule" (Entwurf §8.1, Nachtrag)**

```js
async () => {
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const s = window.store.getState();
  const panel = () => document.querySelector('aside.info-panel');
  const hinweise = () => [...panel().querySelectorAll('[role="tabpanel"] p.text-amber-300')].map((p) => p.textContent);
  const soll = {
    de: { titel: 'Gezeiten und Roche-Grenze', hinweis: 'Diesen Text gibt es nur auf Hochschulniveau.' },
    en: { titel: 'Tides and the Roche limit', hinweis: 'This text is only available at university level.' },
  };
  const ergebnis = {};
  for (const language of ['de', 'en']) {
    s.setUi({ language });
    s.setInfo({ thema: 'gezeiten', niveau: 'hochschule' });
    let t0 = performance.now();
    while (performance.now() - t0 < 5000 && panel().querySelector('header h2')?.textContent !== soll[language].titel) await warte(50);
    await warte(300);
    const hochschule = { kopf: panel().querySelector('header h2')?.textContent, hinweise: hinweise() };
    s.setInfo({ niveau: 'gymnasium' });
    t0 = performance.now();
    while (performance.now() - t0 < 5000 && !hinweise().includes(soll[language].hinweis)) await warte(50);
    ergebnis[language] = { hochschule, gymnasium: hinweise(), ms: Math.round(performance.now() - t0) };
  }
  s.setInfo({ niveau: 'hochschule' });
  return ergebnis;
}
```

Kriterien je Sprache: `hochschule.kopf` gleich dem Titel, `hochschule.hinweise` leer, `gymnasium` enthält genau den Hinweis. Dasselbe für ein zweites Fachthema (`photometrie`, Titel „Albedo und Helligkeit" / „Albedo and brightness") wiederholen.

- [ ] **Schritt 5: Rundgang**

Kombinationen: Sprachen `de`, `en` × die sechs Fachthemen, dazu jede in Task 9 geänderte Pilotdatei. Zustand setzen wie in der Abnahme 4d-1 (Thema über `setInfo({ thema })`; Erde über `setInfo({ thema: null })` und `setCamera({ targetId: 'earth', mode: 'free' })`; Szene über `setCinema({ running: true, shuffle: false, nummer: <Index von mondfinsternis in src/data/scenes.ts> })`, `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setUi({ hidden: false })`), auf den Kopfwechsel pollen, dann auswerten:

```js
() => {
  const text = document.querySelector('aside.info-panel [role="tabpanel"]');
  const ids = [...new Set([...text.querySelectorAll('a[data-verweis^="literatur:"]')].map((a) => a.getAttribute('data-verweis').slice('literatur:'.length)))].sort();
  const karten = [...document.querySelectorAll('[data-literatur]')].map((k) => k.getAttribute('data-literatur')).sort();
  return {
    kopf: document.querySelector('aside.info-panel header h2')?.textContent,
    formelfehler: document.querySelectorAll('[data-formelfehler]').length,
    formeln: text.querySelectorAll('math').length,
    tabellen: text.querySelectorAll('[data-tabelle]').length,
    hinweise: [...text.querySelectorAll('p.text-amber-300')].map((p) => p.textContent),
    verweise: [...text.querySelectorAll('[data-verweis]')].map((v) => v.getAttribute('data-verweis')),
    zitateGleichKarten: JSON.stringify(ids) === JSON.stringify(karten),
  };
}
```

Kriterien: `formelfehler` 0; keine Hinweiszeile; `zitateGleichKarten` true. Danach jeden Verweis einzeln per `element.click()` in `browser_evaluate` auslösen (externe `https://`-Ziele nur zählen), die Wirkung prüfen und den Ausgangszustand wiederherstellen:

| Verweisart | erwartete Wirkung |
|---|---|
| `objekt:<id>` | `camera.targetId === '<id>'` nach Ende der Kamerafahrt (1,5 s) |
| `thema:<id>` | `ui.info.thema === '<id>'` |
| `szene:<id>` | `cinema.nummer` gleich dem Index der Szene, `camera.mode === 'cinema'` |
| `quelle:<id>` | `[data-quelle="<id>"]` hat `border-sky-300` |
| `literatur:<id>` | `[data-literatur="<id>"]` hat `border-sky-300` (Klick und Prüfung in **einem** `browser_evaluate`, sonst läuft die Hervorhebung ab; Messlehre 4d-1) |

Ergebnis je Kombination als Tabelle ins Protokoll (Verweise je Art, Treffer, Formeln, Tabellen, Karten).

- [ ] **Schritt 6: Konsole**

`browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren. Die Warnung „Vollbild ohne Nutzergeste" nach einem per Skript ausgelösten `szene:`-Verweis ist ein Artefakt des Skriptklicks (Abnahme 4d-1 §5.5); sie wird nur gezählt, wenn eine Gegenprobe mit `browser_click` auf denselben Verweis sie ebenfalls zeigt.

- [ ] **Schritt 7: Protokoll `docs/phase4d-etappe2-abnahme.md`**

Gliederung:

```md
# Abnahme Phase 4d Etappe 2 „Fachthemen"

## 1. Umfang
(Commits der Etappe mit Kurzhash und Titel, Branch, Plan, Entwurf)

## 2. Lint, Tests, Build
(Schlusszeilen; Testzahl als eine durchgehende Tabelle Task → Zuwachs → Summe mit Quelle; Größe des Hauptchunks gegenüber 4d-1 und Zahl der Katalogeinträge)

## 3. Prüfskript
(vollständige Ausgabe, Begründung jeder Warnung, Wiederholungen bei Serverfehlern falls sichtbar)

## 4. Fachprüfung
| Text | Wörter de/en | Belegzeilen | Zitate | neue Katalogeinträge | Runden | Fehler gefunden/behoben | Hinweise offen (Entscheidung) |

## 5. Sichtprüfung
### 5.1 Funktionsnamen
### 5.2 Hinweis „nur Hochschule"
### 5.3 Rundgang
### 5.4 Konsole

## 6. Rulings der Umsetzung
(jede Zeile des Ledgers mit „Ruling:")

## 7. Bekannte Unschärfen

## 8. Halt: Fragen an Jens
(Hinweise der Fachprüfung, die ins Ledger gingen, mit Vorschlag; Unsicherheiten der Umsetzer)
```

Zahlen im Protokoll aus den Berichten und Befunddateien der Tasks, nicht geschätzt; jede Summe nachrechnen.

- [ ] **Schritt 8: README**

In `README.md` den Absatz

```md
(Tag `v0.4.0`). Phase 4d (Hochschulstufe) läuft: Etappe 1 bringt Formeln
(TeX-Teilmenge als MathML), Tabellen, Zitate mit Literaturkarten, ein
Prüfskript für den Literaturkatalog (`npm run literatur:pruefen`) und drei
Pilottexte (Bahnelemente, Erde, Mondfinsternis). Offen sind die übrigen
Hochschultexte (Etappen 4d-2 bis 4d-11) und Phase 5 (Ambient-Sound,
Qualitätsstufen, Texturkompression, Veröffentlichung).
```

ersetzen durch:

```md
(Tag `v0.4.0`). Phase 4d (Hochschulstufe) läuft: Etappe 1 bringt Formeln
(TeX-Teilmenge als MathML), Tabellen, Zitate mit Literaturkarten, ein
Prüfskript für den Literaturkatalog (`npm run literatur:pruefen`) und drei
Pilottexte (Bahnelemente, Erde, Mondfinsternis); Etappe 2 die sechs
Fachthemen (Bezugssysteme und Zeitskalen, Gezeiten, Bahnresonanzen, innerer
Aufbau, Albedo und Helligkeit, Entstehung des Sonnensystems). Offen sind die
übrigen Hochschultexte (Etappen 4d-3 bis 4d-11) und Phase 5 (Ambient-Sound,
Qualitätsstufen, Texturkompression, Veröffentlichung).
```

- [ ] **Schritt 9: Aufräumen und Commit**

`git status --short`: nur `docs/phase4d-etappe2-abnahme.md` und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm (Screenshots, Skripte löschen).

```bash
git add docs/phase4d-etappe2-abnahme.md README.md
git commit -m "Abnahme 4d Etappe 2: Fachthemen"
```

Danach Trailer- und Wortkontrolle aus der lokalen Projektanleitung.

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe, Paket ohne Texte und Beleglisten, weil diese fachgeprüft sind); Befunde gebündelt nacharbeiten, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-2` nach `master`, Branch löschen, **nicht pushen**.
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8. Etappe 4d-3 beginnt erst nach seiner Freigabe.

## Hinweise für den Controller

- Umsetzer der Text-Tasks (3 bis 8) und Fachprüfer auf dem stärksten Modell; Code-Tasks (1, 2), Task 9, Abnahme und Nachreviews auf dem mittleren. In 4d-1 fand die Fachprüfung in jedem Text echte Fehler; auch Nachprüfungen fanden noch Hinweise.
- Fachprüfer und Umsetzer schreiben Befunde und Berichte fortlaufend in Dateien im Workspace (Ausgabelimits brachen in 4d-1 Agenten ab).
- Fachprüfer laufen parallel zum nächsten Umsetzer; Commits der Prüfspalte erst, wenn kein Umsetzer läuft, und nur mit gezieltem `git add`.

## Rulings

Entscheidungen der Planung (17.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** Die drei Änderungen aus Jens' Entscheidungen zum Protokoll 4d-1 (Funktionsnamen, Wiederholung im Prüfskript, Karte `jpl-horizons`) laufen als Task 1 und 2 vor den Texten, damit die neuen Texte schon mit dem richtigen Formelsatz entstehen und die Prüfläufe nicht an vorübergehenden Serverfehlern scheitern.
2. **Ruling:** Die Abstandsregel für Funktionsnamen vereinfacht TeX: kein zusätzlicher Abstand neben jedem `mo` (auch nicht vor einem Minus nach dem Funktionsnamen, weil `mo` in MathML seinen eigenen Abstand hat), dünner Abstand vor `\left…\right`. Die Funktionsanwendung U+2061 steht immer, auch am Zeilenende.
3. **Ruling:** Das Prüfskript wiederholt nur bei HTTP 502, 503, 504 und Zeitüberschreitung, höchstens zweimal nach 2 s und 5 s; 429, andere Status und Netzfehler gelten sofort (ein falscher DOI soll nicht verzögert werden, Ratenbegrenzung wäre ein eigener Befund).
4. **Ruling:** Die Karte `jpl-horizons` behält Kennung und Art `werkzeug`; nur Titel und Adresse ändern sich, damit die Verweise in den Texten gültig bleiben.
5. **Ruling:** Jedes Fachthema endet mit `## Im Modell` (Entwurf §5.1 lässt Themen frei gegliedert), fünf von sechs zusätzlich mit `## Offene Fragen` (bei `bezugssysteme` optional). Die freigegebenen Pilottexte zeigen, dass beide Abschnitte den Fachtexten Halt geben; die Fachprüfung Punkt 3 und 6 braucht sie.
6. **Ruling:** Verweise auf Fachthemen setzen die Text-Tasks nur, wenn das Ziel schon einen Text hat; Task 9 ergänzt die übrigen in beide Richtungen und in den Pilottexten. Task 9 ändert nur die Verweis-Auszeichnung, nachgewiesen per Skript, und braucht deshalb keine Fachprüfung; die Stand-Zeile bleibt.
7. **Ruling:** Die Nacharbeit nach der Fachprüfung umfasst Fehler und sachliche Hinweise; Hinweise zu Umfang, Stil und Themenwahl gehen ins Ledger. Nach der zweiten Nachprüfung gehen verbleibende Hinweise ins Ledger (in 4d-1 brauchte die Erde drei Runden für Hinweise, die den Text nicht mehr sachlich verbesserten).
8. **Ruling:** Tausendertrennung in neuen Texten ab fünf Stellen (Deutsch Leerzeichen, Englisch Komma); die freigegebenen Pilottexte bleiben unverändert, auch wo sie davon abweichen.
9. **Ruling:** Reihenfolge der Themen: `bezugssysteme` zuerst (Grundlage für Zeitskalen und Ebenen in allen anderen), `entstehung` zuletzt (braucht Resonanzen und Migration).
10. **Ruling:** Frage 12 des Protokolls 4d-1: Pixelmessungen am Formelsatz laufen ab 4d-2 auf vierfacher Schriftgröße und, wo möglich, als Differenzbild in derselben Seitenladung; bei Originalgröße reichte die Auflösung in 4d-1 für das Ringkriterium nicht.
11. **Ruling:** Der Literaturkatalog bleibt im Hauptbundle (Befund M9 der Schlussprüfung 4d-1). Die Abnahme notiert Größe des Hauptchunks und Zahl der Einträge; wächst der Chunk gegenüber 4d-1 um mehr als 50 kB, geht die Frage des faulen Ladens an Jens.
12. **Ruling:** Der Dateitest bekommt weiter keine Ausnahme für ein maskiertes `\$`; braucht ein Text ein sichtbares Dollarzeichen, ist das ein Zwischen-Task mit Test.
13. **Ruling:** Die Etappe geht nach Abnahme und Schlussprüfung per Fast-Forward auf `master` und wird nicht gepusht; Jens gibt danach 4d-3 frei. Änderungswünsche an den Fachthemen kommen als eigene Commits.
