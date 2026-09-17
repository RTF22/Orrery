# Phase 4d Hochschule, Etappe 1 „Gerüst und Pilot" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Das Infopanel kann Fachtexte auf Hochschulniveau darstellen (Formeln als MathML, Tabellen, Zitate mit Literaturkarten), ein Prüfskript gleicht den Literaturkatalog mit Crossref und arXiv ab, Dateitests sichern Gliederung, Stand-Zeile, Formeln, Zitate und die Gleichheit der Sprachfassungen, sechs Fachthemen stehen im Katalog, und drei Pilottexte (`thema-bahnelemente`, `objekt-earth`, `szene-mondfinsternis`) liegen in Deutsch und Englisch mit Beleglisten und Fachprüfung vor. Danach **Halt**: Jens prüft die Pilottexte, bevor Etappe 4d-2 beginnt.

**Architektur:** Task 1 bis 3 erweitern den Renderer: `markdownParser.ts` erkennt Formeln und Tabellen, das neue reine Modul `texUebersetzer.ts` übersetzt die TeX-Teilmenge in einen MathML-Datenbaum, `Formel.tsx` und `Markdown.tsx` geben beides aus. Task 4 und 5 bringen den Literaturkatalog `data/literatur.ts` (ohne Importe, damit Node ihn direkt laden kann), das Verweisschema `literatur:`, den Hervorhebungsschlüssel `quelle:`/`literatur:` und die Literaturkarten unter den Quellenkarten. Task 6 ist das Prüfskript mit getesteten Vergleichsfunktionen. Task 7 legt die Fachthemen samt Titeln und Quellenkarten an, Task 8 den Hinweis „nur Hochschule" und macht die Hochschul-Beispiele der Tests unabhängig von echten Dateien. Task 9 ist der Dateitest für Hochschultexte. Task 10 bis 12 sind die Pilottexte, **nicht wörtlich im Plan**: Der Umsetzer recherchiert, schreibt und belegt nach Entwurf §6.4, eine Fachprüfung mit frischem Kontext prüft. Task 13 ist die Abnahme.

**Tech-Stack:** TypeScript 6, React 19, Zustand, Vite, Tailwind, Vitest mit jsdom und Testing Library, Node 24 (führt `.ts`-Skripte ohne Übersetzung aus), MathML Core im Browser, Playwright-MCP und Python 3.12 (Pillow, numpy) für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, maßgeblich §3 (Formeln und Tabellen), §4 (Literatur), §5 (Gestalt der Texte), §6 (Arbeitsweise), §7 Zeile 4d-1, §8.1 (Abnahme). Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll, Beleglisten). Umlaute korrekt. Englisch nur in `src/data/texte/en/`, in `src/ui/i18n/en.ts`, in den `en`-Feldern des Quellenkatalogs und in Originaltiteln des Literaturkatalogs.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungsadresse, keine Werkzeugnamen. Nach jedem Commit die Trailer-Kontrolle aus der lokalen Projektanleitung ausführen (Ergebnis 0). Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben).
- Branch `hochschule-1` (von `master`), **kein Worktree**: Der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `data/` ist reine Daten. `src/data/literatur.ts` importiert **nichts** (auch keine Typen), weil `scripts/pruefe-literatur.ts` sie mit Node direkt lädt und Node nur Importe mit Dateiendung auflöst.
- Keine neue Abhängigkeit in `package.json` (Entwurf §2 Punkt 3); einzig das Skript `literatur:pruefen` kommt dazu.
- GLSL ist nicht betroffen. TeX steht in TS-Zeichenketten: Backslashes in Testdaten doppelt schreiben (`'\\frac{1}{2}'`).
- Texte (Entwurf §5): erste Zeile `# Titel`; Hochschultexte enden mit `*Stand: September 2026*` beziehungsweise `*As of September 2026*` als eigenem Absatz; Körper- und Szenentexte folgen der Gliederung aus §5.1; `literatur:` nur in Hochschultexten; Verweise auf die sechs Fachthemen erst ab 4d-2 (sie haben noch keinen Text, der Dateitest scheitert sonst).
- Recherche (Entwurf §6.1): Zitiert wird nur, was im Task selbst geöffnet wurde, mindestens die Zusammenfassung; nie aus dem Gedächtnis. Jede DOI, arXiv-Nummer und URL vor dem Commit mit `npm run literatur:pruefen -- --nur <kennungen>` prüfen.
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.
- Ein Umsetzer gleichzeitig; Fachprüfer (Task 10 bis 12) dürfen parallel zum nächsten Umsetzer laufen, sie öffnen keinen Browser.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Parser: Formeln im Satz und als Block, Tabellen | `src/ui/info/markdownParser.ts`, `src/ui/info/markdownParser.test.ts` |
| 2 | TeX-Teilmenge → MathML-Datenbaum | `src/ui/info/texUebersetzer.ts`, `src/ui/info/texUebersetzer.test.ts` (neu) |
| 3 | Ausgabe von Formeln und Tabellen | `src/ui/info/Formel.tsx` (neu), `src/ui/info/Markdown.tsx`, `src/ui/info/Markdown.test.tsx` |
| 4 | Literaturkatalog, Verweis `literatur:`, Hervorhebungsschlüssel | `src/data/literatur.ts`, `src/data/literatur.test.ts` (neu), `src/data/verweise.ts`, `src/data/verweise.test.ts`, `src/data/verweise.literatur.test.ts` (neu), `src/ui/info/Markdown.tsx`, `src/ui/info/Markdown.literatur.test.tsx` (neu), `src/ui/info/verweisAusfuehren.ts`, `src/ui/info/verweisAusfuehren.test.ts`, `src/ui/info/Quellenkarten.tsx`, `src/ui/info/Quellenkarten.test.tsx`, `src/ui/info/InfoPanel.tsx` |
| 5 | Literaturkarten im Panel | `src/ui/info/zitate.ts`, `src/ui/info/zitate.test.ts`, `src/ui/info/Literaturkarten.tsx`, `src/ui/info/Literaturkarten.test.tsx`, `src/ui/info/InfoPanel.literatur.test.tsx` (alle neu), `src/ui/info/InfoPanel.tsx`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts`, `src/ui/i18n/i18n.test.ts` |
| 6 | Prüfskript | `scripts/literaturVergleich.ts`, `scripts/literaturVergleich.test.ts`, `scripts/pruefe-literatur.ts` (alle neu), `package.json` |
| 7 | Sechs Fachthemen mit Titeln und Quellenkarten | `src/data/themen.ts`, `src/data/themen.test.ts`, `src/data/quellen.ts`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts` |
| 8 | Hinweis „nur Hochschule", Testbeispiele ohne echte Hochschultexte | `src/ui/info/InfoPanel.tsx`, `src/ui/info/InfoPanel.test.tsx`, `src/ui/info/InfoPanel.hinweise.test.tsx` (neu), `src/ui/info/InfoPanel.laden.test.tsx`, `src/data/texte/index.ts`, `src/data/texte/index.test.ts`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts` |
| 9 | Dateitest für Hochschultexte | `src/data/texte/dateien.test.ts` |
| 10 | Pilot `thema-bahnelemente` | 2 Texte, `docs/belege/hochschule/thema-bahnelemente.md`, `src/data/literatur.ts` |
| 11 | Pilot `objekt-earth` | 2 Texte, `docs/belege/hochschule/objekt-earth.md`, `src/data/literatur.ts` |
| 12 | Pilot `szene-mondfinsternis` | 2 Texte, `docs/belege/hochschule/szene-mondfinsternis.md`, `src/data/literatur.ts` |
| 13 | Abnahme, Entwurfsnachträge, README | `docs/phase4d-etappe1-abnahme.md`, Entwurf §3.4/§5.3/§5.5/§8.1, `README.md` |

**Testzahlen:** Ausgangsstand `master` 2905 Tests. `dateien.test.ts` erzeugt heute je Datei sieben Fälle plus zwei Sammelfälle (252 Dateien, 1766 Fälle). Jeder Task nennt die Zahl seiner neuen Fälle; der Bericht nennt die tatsächliche Gesamtzahl. Weicht sie von Ausgangsstand plus neuen Fällen ab, die Ursache nennen, nicht den Test anpassen.

---

### Task 1: Parser — Formeln im Satz und als Block, Tabellen

**Dateien:**
- Ändern: `src/ui/info/markdownParser.ts`
- Ändern: `src/ui/info/markdownParser.test.ts`

**Schnittstellen:**
- Konsumiert: nichts Neues.
- Produziert (von Task 3, 5, 9 genutzt):
  - `Inline` um `{ typ: 'formel'; tex: string }` erweitert.
  - `export type Ausrichtung = 'links' | 'mitte' | 'rechts'`.
  - `Block` um `{ typ: 'formel'; tex: string }` und `{ typ: 'tabelle'; ausrichtung: Ausrichtung[]; kopf: Inline[][]; zeilen: Inline[][][] }` erweitert.
  - `export function tabellenzellen(zeile: string): string[] | null`.
  - `inlineText` liefert für eine Formel ihren TeX-Quelltext.

- [ ] **Schritt 1: Branch anlegen**

```bash
git checkout -b hochschule-1 master
```

- [ ] **Schritt 2: Tests ans Ende von `src/ui/info/markdownParser.test.ts` anfügen**

Den Import in Zeile 2 ersetzen durch:

```ts
import { inlineText, parseInline, parseMarkdown, tabellenzellen, titelVon } from './markdownParser';
```

Am Dateiende anfügen:

```ts
const formel = (tex: string) => ({ typ: 'formel' as const, tex });

describe('Formeln (Entwurf 4d §3.1)', () => {
  it('erkennt eine Formel im Satz', () => {
    expect(parseInline('Es gilt $a^2$ hier.')).toEqual([text('Es gilt '), formel('a^2'), text(' hier.')]);
    expect(parseInline('$x$')).toEqual([formel('x')]);
  });

  it('folgt der Regel von Pandoc: Leerraum innen am Rand oder Ziffer danach schließen nicht', () => {
    expect(parseInline('kostet 5 $ und 6 $')).toEqual([text('kostet 5 $ und 6 $')]);
    expect(parseInline('$5 und $6')).toEqual([text('$5 und $6')]);
    expect(parseInline('$a$5')).toEqual([text('$a$5')]);
    expect(parseInline('ein $ allein')).toEqual([text('ein $ allein')]);
  });

  it('maskiert \\$ als Dollarzeichen', () => {
    expect(parseInline('Preis \\$5 und \\$6')).toEqual([text('Preis $5 und $6')]);
  });

  it('wertet in Formeln kein Markdown aus, außerhalb schon', () => {
    expect(parseInline('$a*b$ und *k*')).toEqual([
      formel('a*b'), text(' und '), { typ: 'kursiv', kinder: [text('k')] },
    ]);
    expect(parseInline('[Wert $x$](objekt:earth)')).toEqual([
      { typ: 'link', ziel: 'objekt:earth', kinder: [text('Wert '), formel('x')] },
    ]);
  });

  it('macht aus einem Absatz mit $$ am Anfang und Ende eine Blockformel', () => {
    expect(parseMarkdown('Vorher\n\n$$\nT^2 = a^3\n$$\n\nNachher')).toEqual([
      { typ: 'absatz', kinder: [text('Vorher')] },
      { typ: 'formel', tex: 'T^2 = a^3' },
      { typ: 'absatz', kinder: [text('Nachher')] },
    ]);
    expect(parseMarkdown('$$x$$')).toEqual([{ typ: 'formel', tex: 'x' }]);
  });

  it('liefert als Klartext einer Formel ihren Quelltext', () => {
    expect(inlineText([text('a '), formel('x^2')])).toBe('a x^2');
  });
});

describe('Tabellen (Entwurf 4d §3.1)', () => {
  it('zerlegt Zeilen an unmaskierten Strichen und löst \\| danach auf', () => {
    expect(tabellenzellen('| a | b |')).toEqual(['a', 'b']);
    expect(tabellenzellen('| $\\|x\\|$ | c \\| d |')).toEqual(['$|x|$', 'c | d']);
    expect(tabellenzellen('| a | b')).toBeNull();
    expect(tabellenzellen('a | b |')).toBeNull();
    expect(tabellenzellen('| a \\|')).toBeNull();
  });

  it('erkennt Kopf, Ausrichtung und Datenzeilen mit Inline-Elementen', () => {
    const md = '| Größe | Wert | Mitte |\n|:---|---:|:---:|\n| $J_2$ | **1** | x |\n| a \\| b | 2 | y |';
    expect(parseMarkdown(md)).toEqual([{
      typ: 'tabelle',
      ausrichtung: ['links', 'rechts', 'mitte'],
      kopf: [[text('Größe')], [text('Wert')], [text('Mitte')]],
      zeilen: [
        [[formel('J_2')], [{ typ: 'fett', kinder: [text('1')] }], [text('x')]],
        [[text('a | b')], [text('2')], [text('y')]],
      ],
    }]);
  });

  it('schließt einen vorangehenden Absatz und endet an einer Zeile ohne Strich', () => {
    expect(parseMarkdown('Vorher\n| a |\n|---|\n| 1 |\nNachher')).toEqual([
      { typ: 'absatz', kinder: [text('Vorher')] },
      { typ: 'tabelle', ausrichtung: ['links'], kopf: [[text('a')]], zeilen: [[[text('1')]]] },
      { typ: 'absatz', kinder: [text('Nachher')] },
    ]);
  });

  it('macht aus Strichzeilen ohne gültige Form einen eigenen Absatz', () => {
    expect(parseMarkdown('| a | b |\n|---|---|\n| 1 |')).toEqual([
      { typ: 'absatz', kinder: [text('| a | b | |---|---| | 1 |')] },
    ]);
    expect(parseMarkdown('| a | b |\nText')).toEqual([
      { typ: 'absatz', kinder: [text('| a | b |')] },
      { typ: 'absatz', kinder: [text('Text')] },
    ]);
    expect(parseMarkdown('| a |\n|--|\n| 1 |')).toEqual([
      { typ: 'absatz', kinder: [text('| a | |--| | 1 |')] },
    ]);
  });
});
```

- [ ] **Schritt 3: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/info/markdownParser.test.ts`
Expected: FAIL (`tabellenzellen` ist kein Export; Formeln bleiben Text).

- [ ] **Schritt 4: Typen und Kopfkommentar in `src/ui/info/markdownParser.ts` ändern**

Den Kopfkommentar und die Typen (Zeilen 1 bis 18) ersetzen durch:

```ts
/**
 * Markdown-Teilmenge für die Erläuterungstexte (Entwurf 4c §4.2, 4d §3.1):
 * Überschriften # bis ###, Absätze, Listen mit - oder 1., fett, kursiv,
 * Links, Formeln ($…$ im Satz, $$…$$ als Absatz) und Pipe-Tabellen. Alles
 * andere bleibt Klartext, HTML wird nie durchgereicht — deshalb braucht
 * die Ausgabe keine Bereinigung. Zeichenweise Zerlegung statt regulärer
 * Ausdrücke, damit Klammern in Linktexten und Sternchen in Zahlen (5*10)
 * nicht kippen. TeX wird hier nicht übersetzt, nur als Quelle gehalten
 * (texUebersetzer.ts).
 */
export type Inline =
  | { typ: 'text'; text: string }
  | { typ: 'formel'; tex: string }
  | { typ: 'fett'; kinder: Inline[] }
  | { typ: 'kursiv'; kinder: Inline[] }
  | { typ: 'link'; ziel: string; kinder: Inline[] };

export type Ausrichtung = 'links' | 'mitte' | 'rechts';

export type Block =
  | { typ: 'ueberschrift'; ebene: 1 | 2 | 3; kinder: Inline[] }
  | { typ: 'absatz'; kinder: Inline[] }
  | { typ: 'liste'; geordnet: boolean; punkte: Inline[][] }
  | { typ: 'formel'; tex: string }
  | { typ: 'tabelle'; ausrichtung: Ausrichtung[]; kopf: Inline[][]; zeilen: Inline[][][] };
```

- [ ] **Schritt 5: `liesFormel` nach `liesLink` einfügen und `verschmelzen` anpassen**

Direkt nach der Funktion `liesLink` einfügen:

```ts
const LEERRAUM = /\s/;
const ZIFFER = /[0-9]/;

/**
 * Liest ab `start` (ein `$`) eine Formel im Satz nach der Regel von Pandoc:
 * Nach dem öffnenden `$` steht kein Leerraum und kein weiteres `$`, vor dem
 * schließenden kein Leerraum und kein Backslash, danach keine Ziffer. Ohne
 * passendes Ende bleibt das Zeichen Text („kostet 5 $").
 */
function liesFormel(text: string, start: number): { tex: string; ende: number } | null {
  const erstes = text[start + 1];
  if (erstes === undefined || erstes === '$' || LEERRAUM.test(erstes)) return null;
  for (let j = start + 2; j < text.length; j += 1) {
    if (text[j] !== '$') continue;
    const davor = text[j - 1] ?? '';
    if (LEERRAUM.test(davor) || davor === '\\') continue;
    if (ZIFFER.test(text[j + 1] ?? '')) continue;
    return { tex: text.slice(start + 1, j), ende: j + 1 };
  }
  return null;
}
```

In `verschmelzen` den `else`-Zweig ersetzen:

```ts
    } else if (el.typ === 'formel') {
      out.push(el);
    } else {
      out.push({ ...el, kinder: verschmelzen(el.kinder) });
    }
```

- [ ] **Schritt 6: `parseInline` um Maskierung und Formeln ergänzen**

In `parseInline` am Anfang des Schleifenkörpers, direkt nach `const c = text[i]!;`, einfügen:

```ts
    if (c === '\\' && text[i + 1] === '$') {
      puffer += '$';
      i += 2;
      continue;
    }
    if (c === '$') {
      const formel = liesFormel(text, i);
      if (formel !== null) {
        leeren();
        ziel().push({ typ: 'formel', tex: formel.tex });
        i = formel.ende;
        continue;
      }
    }
```

- [ ] **Schritt 7: Tabellen und Blockformeln in `parseMarkdown`, `inlineText` anpassen**

Den Block von `const UEBERSCHRIFT = …` bis zum Ende von `parseMarkdown` ersetzen durch:

```ts
const UEBERSCHRIFT = /^(#{1,3})\s+(.*\S)\s*$/;
const LISTENPUNKT = /^(-|\d+\.)\s+(.*)$/;
const TRENNZELLE = /^:?-{3,}:?$/;

/**
 * Zerlegt eine Tabellenzeile in Zellen (Entwurf 4d §3.1): Die Zeile beginnt
 * und endet mit `|`; zuerst wird an unmaskierten `|` getrennt, danach wird
 * `\|` zu `|`, auch innerhalb von Formeln. Keine Tabellenzeile: null.
 */
export function tabellenzellen(zeile: string): string[] | null {
  const s = zeile.trim();
  if (s.length < 2 || !s.startsWith('|') || !s.endsWith('|') || s.endsWith('\\|')) return null;
  const inhalt = s.slice(1, -1);
  const zellen: string[] = [];
  let aktuell = '';
  for (let i = 0; i < inhalt.length; i += 1) {
    const c = inhalt[i]!;
    if (c === '\\' && inhalt[i + 1] === '|') {
      aktuell += '|';
      i += 1;
      continue;
    }
    if (c === '|') {
      zellen.push(aktuell.trim());
      aktuell = '';
      continue;
    }
    aktuell += c;
  }
  zellen.push(aktuell.trim());
  return zellen;
}

function ausrichtungen(zellen: readonly string[]): Ausrichtung[] | null {
  if (zellen.length === 0 || !zellen.every((z) => TRENNZELLE.test(z))) return null;
  return zellen.map((z) => (z.startsWith(':') && z.endsWith(':') ? 'mitte' : z.endsWith(':') ? 'rechts' : 'links'));
}

/** Tabelle aus zusammenhängenden |-Zeilen, oder null, wenn die Form nicht stimmt. */
function tabelle(zeilen: readonly string[]): Block | null {
  const [kopfZeile, trennZeile, ...rest] = zeilen;
  if (kopfZeile === undefined || trennZeile === undefined) return null;
  const kopf = tabellenzellen(kopfZeile);
  const trenn = tabellenzellen(trennZeile);
  const ausrichtung = trenn === null ? null : ausrichtungen(trenn);
  if (kopf === null || ausrichtung === null || ausrichtung.length !== kopf.length) return null;
  const daten: string[][] = [];
  for (const zeile of rest) {
    const zellen = tabellenzellen(zeile);
    if (zellen === null || zellen.length !== kopf.length) return null;
    daten.push(zellen);
  }
  return {
    typ: 'tabelle',
    ausrichtung,
    kopf: kopf.map((z) => parseInline(z)),
    zeilen: daten.map((zeile) => zeile.map((z) => parseInline(z))),
  };
}

export function parseMarkdown(text: string): Block[] {
  const bloecke: Block[] = [];
  let absatz: string[] = [];
  let liste: { geordnet: boolean; punkte: string[] } | null = null;

  const absatzSchliessen = (): void => {
    if (absatz.length === 0) return;
    const roh = absatz.join(' ');
    // Blockformel (Entwurf 4d §3.1): ein Absatz, der mit $$ beginnt und endet.
    if (roh.length >= 4 && roh.startsWith('$$') && roh.endsWith('$$')) {
      bloecke.push({ typ: 'formel', tex: roh.slice(2, -2).trim() });
    } else {
      bloecke.push({ typ: 'absatz', kinder: parseInline(roh) });
    }
    absatz = [];
  };
  const listeSchliessen = (): void => {
    if (liste === null) return;
    bloecke.push({ typ: 'liste', geordnet: liste.geordnet, punkte: liste.punkte.map(parseInline) });
    liste = null;
  };

  const zeilen = text.replace(/\r\n?/g, '\n').split('\n');
  for (let n = 0; n < zeilen.length; n += 1) {
    const roh = zeilen[n]!;
    const zeile = roh.trimEnd();
    if (zeile.trim() === '') {
      absatzSchliessen();
      listeSchliessen();
      continue;
    }
    if (zeile.trimStart().startsWith('|')) {
      // Zusammenhängende |-Zeilen bilden eine Tabelle. Stimmt die Form nicht,
      // werden sie ein eigener Absatz, den der Dateitest erkennt.
      absatzSchliessen();
      listeSchliessen();
      const strichzeilen: string[] = [];
      while (n < zeilen.length && (zeilen[n] ?? '').trimStart().startsWith('|')) {
        strichzeilen.push((zeilen[n] ?? '').trim());
        n += 1;
      }
      n -= 1;
      bloecke.push(tabelle(strichzeilen) ?? { typ: 'absatz', kinder: parseInline(strichzeilen.join(' ')) });
      continue;
    }
    const kopf = UEBERSCHRIFT.exec(zeile);
    if (kopf !== null) {
      absatzSchliessen();
      listeSchliessen();
      bloecke.push({ typ: 'ueberschrift', ebene: kopf[1]!.length as 1 | 2 | 3, kinder: parseInline(kopf[2]!) });
      continue;
    }
    const punkt = LISTENPUNKT.exec(zeile);
    if (punkt !== null) {
      absatzSchliessen();
      const geordnet = punkt[1] !== '-';
      if (liste !== null && liste.geordnet !== geordnet) listeSchliessen();
      if (liste === null) liste = { geordnet, punkte: [] };
      liste.punkte.push(punkt[2]!);
      continue;
    }
    // Eingerückte Zeile nach einem Listenpunkt gehört zu ihm.
    if (liste !== null && /^\s/.test(roh)) {
      liste.punkte[liste.punkte.length - 1] += ` ${zeile.trim()}`;
      continue;
    }
    listeSchliessen();
    absatz.push(zeile.trim());
  }
  absatzSchliessen();
  listeSchliessen();
  return bloecke;
}
```

`inlineText` ersetzen durch:

```ts
export function inlineText(kinder: Inline[]): string {
  return kinder.map((k) => (k.typ === 'text' ? k.text : k.typ === 'formel' ? k.tex : inlineText(k.kinder))).join('');
}
```

Hinweis: `listeSchliessen` nutzt `liste.punkte.map(parseInline)` wie bisher; `parseInline` hat genau einen Parameter, der Index von `map` wird ignoriert.

- [ ] **Schritt 8: Tests laufen lassen**

Run: `npx vitest run src/ui/info/markdownParser.test.ts`
Expected: PASS, 10 neue Fälle.

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: Fehler nur in `src/ui/info/Markdown.tsx` — die Funktionen `Inlines` und `Blockknoten` behandeln die neuen Knoten `formel` und `tabelle` noch nicht (TypeScript meldet einen fehlenden Rückgabewert). Schritt 9 schließt das mit Platzhaltern, Task 3 ersetzt sie.

- [ ] **Schritt 9: Übergangsfälle in `Markdown.tsx`, damit der Build grün bleibt**

In `src/ui/info/Markdown.tsx`, Funktion `Inlines`, im `switch` vor `case 'link':` einfügen:

```tsx
          case 'formel': return <code key={i}>{k.tex}</code>;
```

In `Blockknoten` am Ende des `switch` einfügen:

```tsx
    case 'formel':
      return <code>{block.tex}</code>;
    case 'tabelle':
      return <p className="m-0">{block.kopf.length}</p>;
```

Diese Platzhalter ersetzt Task 3 vollständig. Run: `npx tsc --noEmit -p tsconfig.json` → keine Ausgabe; `npx vitest run src/ui/info` → PASS.

- [ ] **Schritt 10: Commit**

```bash
git add src/ui/info/markdownParser.ts src/ui/info/markdownParser.test.ts src/ui/info/Markdown.tsx
git commit -m "Markdown-Parser: Formeln im Satz und als Block, Pipe-Tabellen"
```

---

### Task 2: Übersetzer der TeX-Teilmenge nach MathML

**Dateien:**
- Erstellen: `src/ui/info/texUebersetzer.ts`
- Erstellen: `src/ui/info/texUebersetzer.test.ts`

**Schnittstellen:**
- Konsumiert: nichts.
- Produziert (von Task 3 und 9 genutzt):

```ts
export type MathKnoten =
  | { tag: string; attribute?: Readonly<Record<string, string>>; kinder: readonly MathKnoten[] }
  | { tag: 'mi' | 'mn' | 'mo' | 'mtext'; attribute?: Readonly<Record<string, string>>; text: string };
export type Uebersetzung = { baum: MathKnoten } | { fehler: string; stelle: number };
export function texNachMathml(tex: string, block: boolean): Uebersetzung;
```

Blätter erkennt man an `'text' in knoten`. Fehlertexte (wörtlich, Tests und Dateitest zitieren sie): `Unbekannter Befehl \<name>`, `Zeichen „<z>" gehört nicht zur Teilmenge`, `Offene Klammer {`, `Offene Klammer [`, `Überzählige }`, `^ ohne Basis`, `_ ohne Basis`, `Doppelte Hochstellung`, `Doppelte Tiefstellung`, `Argument fehlt`, `\left ohne \right`, `\right ohne \left`, `Klammer nach \left oder \right erwartet`, `\text ohne {`, `Verschachtelte Klammern in \text`, `Backslash am Ende`, `Leere Formel`.

- [ ] **Schritt 1: Test schreiben — `src/ui/info/texUebersetzer.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { texNachMathml } from './texUebersetzer';
import type { MathKnoten } from './texUebersetzer';

const mi = (text: string, attribute?: Record<string, string>): MathKnoten =>
  (attribute === undefined ? { tag: 'mi', text } : { tag: 'mi', attribute, text });
const mn = (text: string): MathKnoten => ({ tag: 'mn', text });
const mo = (text: string, attribute?: Record<string, string>): MathKnoten =>
  (attribute === undefined ? { tag: 'mo', text } : { tag: 'mo', attribute, text });
const el = (tag: string, kinder: MathKnoten[], attribute?: Record<string, string>): MathKnoten =>
  (attribute === undefined ? { tag, kinder } : { tag, attribute, kinder });
const NORMAL = { mathvariant: 'normal' };
const STRETCHY = { stretchy: 'true' };

/** Kinder der obersten Zeile; wirft bei einem Übersetzungsfehler. */
function zeile(tex: string, block = false): MathKnoten[] {
  const ergebnis = texNachMathml(tex, block);
  if ('fehler' in ergebnis) throw new Error(`${ergebnis.fehler} (Stelle ${ergebnis.stelle})`);
  const wurzel = ergebnis.baum;
  if ('text' in wurzel) throw new Error('Blatt als Wurzel');
  const mrow = wurzel.kinder[0];
  if (mrow === undefined || 'text' in mrow) throw new Error('keine Zeile');
  return [...mrow.kinder];
}

describe('texNachMathml', () => {
  it('baut die Wurzel math mit display und einer Zeile', () => {
    expect(texNachMathml('x', false)).toEqual({
      baum: el('math', [el('mrow', [mi('x')])], { display: 'inline' }),
    });
    expect(texNachMathml('x', true)).toEqual({
      baum: el('math', [el('mrow', [mi('x')])], { display: 'block' }),
    });
  });

  it('übersetzt Buchstaben, Zahlen mit Dezimalkomma oder -punkt und Operatoren', () => {
    expect(zeile('a+2{,}44-b')).toEqual([mi('a'), mo('+'), mn('2,44'), mo('−'), mi('b')]);
    expect(zeile('3.5 = x, y : z')).toEqual([mn('3.5'), mo('='), mi('x'), mo(','), mi('y'), mo(':'), mi('z')]);
    expect(zeile('|x|')).toEqual([mo('|'), mi('x'), mo('|')]);
    expect(zeile('a{,}b')).toEqual([mi('a'), mo(','), mi('b')]);
  });

  it('übersetzt Hoch- und Tiefstellung', () => {
    expect(zeile('x^2')).toEqual([el('msup', [mi('x'), mn('2')])]);
    expect(zeile('M_\\odot')).toEqual([el('msub', [mi('M'), mo('⊙')])]);
    expect(zeile('a_i^{2}')).toEqual([el('msubsup', [mi('a'), mi('i'), mn('2')])]);
    expect(zeile('x^{-1}')).toEqual([el('msup', [mi('x'), el('mrow', [mo('−'), mn('1')])])]);
    expect(zeile('M_\\oplus')).toEqual([el('msub', [mi('M'), mo('⊕')])]);
  });

  it('übersetzt Brüche und Wurzeln', () => {
    expect(zeile('\\frac{a}{b}')).toEqual([el('mfrac', [mi('a'), mi('b')])]);
    expect(zeile('\\sqrt{x}')).toEqual([el('msqrt', [mi('x')])]);
    expect(zeile('\\sqrt[3]{x}')).toEqual([el('mroot', [mi('x'), mn('3')])]);
  });

  it('setzt das dritte Keplersche Gesetz', () => {
    expect(zeile('T^2 = \\frac{4\\pi^2 a^3}{G(M_\\odot + m)}', true)).toEqual([
      el('msup', [mi('T'), mn('2')]),
      mo('='),
      el('mfrac', [
        el('mrow', [mn('4'), el('msup', [mi('π'), mn('2')]), el('msup', [mi('a'), mn('3')])]),
        el('mrow', [mi('G'), mo('('), el('msub', [mi('M'), mo('⊙')]), mo('+'), mi('m'), mo(')')]),
      ]),
    ]);
  });

  it('übersetzt \\left und \\right mit dehnbaren Klammern, der Punkt bleibt leer', () => {
    expect(zeile('\\left( x \\right)')).toEqual([el('mrow', [mo('(', STRETCHY), mi('x'), mo(')', STRETCHY)])]);
    expect(zeile('\\left. x \\right|')).toEqual([el('mrow', [mi('x'), mo('|', STRETCHY)])]);
    expect(zeile('\\left[ x \\right]')).toEqual([el('mrow', [mo('[', STRETCHY), mi('x'), mo(']', STRETCHY)])]);
  });

  it('setzt \\mathrm aufrecht und verbindet Buchstaben, \\text bleibt wörtlich', () => {
    expect(zeile('\\mathrm{d}t')).toEqual([mi('d', NORMAL), mi('t')]);
    expect(zeile('\\mathrm{km}')).toEqual([el('mrow', [mi('km', NORMAL)])]);
    expect(zeile('\\mathrm{s^{-1}}')).toEqual([el('msup', [mi('s', NORMAL), el('mrow', [mo('−'), mn('1')])])]);
    expect(zeile('x\\text{ und }y')).toEqual([mi('x'), { tag: 'mtext', text: ' und ' }, mi('y')]);
  });

  it('übersetzt Akzente', () => {
    expect(zeile('\\dot{a}')).toEqual([el('mover', [mi('a'), mo('˙')], { accent: 'true' })]);
    expect(zeile('\\vec v')).toEqual([el('mover', [mi('v'), mo('→')], { accent: 'true' })]);
    expect(zeile('\\bar{x}\\hat{x}\\tilde{x}\\ddot{x}').map((k) => ('text' in k ? '' : (k.kinder[1] as { text: string }).text)))
      .toEqual(['¯', '^', '~', '¨']);
  });

  it('übersetzt griechische Buchstaben, große aufrecht', () => {
    expect(zeile('\\alpha\\varpi\\varphi\\Omega')).toEqual([mi('α'), mi('ϖ'), mi('φ'), mi('Ω', NORMAL)]);
  });

  it('übersetzt Relationen, Operatoren und Symbole', () => {
    expect(zeile('a \\approx b \\le c \\ll d')).toEqual([mi('a'), mo('≈'), mi('b'), mo('≤'), mi('c'), mo('≪'), mi('d')]);
    expect(zeile('\\pm\\cdot\\times\\sim\\propto\\equiv\\to')).toEqual(
      ['±', '⋅', '×', '∼', '∝', '≡', '→'].map((z) => mo(z)),
    );
    expect(zeile('\\partial\\nabla\\infty')).toEqual([mi('∂'), mi('∇'), mi('∞')]);
    expect(zeile('90^\\circ')).toEqual([el('msup', [mn('90'), mo('∘')])]);
  });

  it('setzt Funktionsnamen aufrecht als ein Zeichen', () => {
    expect(zeile('\\sin E')).toEqual([mi('sin'), mi('E')]);
  });

  it('setzt Summen im Block mit Grenzen darüber und darunter, Integrale immer als Index', () => {
    const summe = mo('∑', { largeop: 'true' });
    expect(zeile('\\sum_{i=1}^{n} x_i', true)).toEqual([
      el('munderover', [summe, el('mrow', [mi('i'), mo('='), mn('1')]), mi('n')]),
      el('msub', [mi('x'), mi('i')]),
    ]);
    expect(zeile('\\sum_{i=1}^{n}')).toEqual([
      el('msubsup', [summe, el('mrow', [mi('i'), mo('='), mn('1')]), mi('n')]),
    ]);
    expect(zeile('\\int_0^1', true)).toEqual([el('msubsup', [mo('∫', { largeop: 'true' }), mn('0'), mn('1')])]);
  });

  it('übersetzt Abstände', () => {
    expect(zeile('a\\,b\\;c\\quad d')).toEqual([
      mi('a'), el('mspace', [], { width: '0.1667em' }), mi('b'), el('mspace', [], { width: '0.2778em' }),
      mi('c'), el('mspace', [], { width: '1em' }), mi('d'),
    ]);
  });

  it('meldet Fehler mit Stelle', () => {
    expect(texNachMathml('\\foo', false)).toEqual({ fehler: 'Unbekannter Befehl \\foo', stelle: 0 });
    expect(texNachMathml('a ! b', false)).toEqual({ fehler: 'Zeichen „!" gehört nicht zur Teilmenge', stelle: 2 });
    expect(texNachMathml('{x', false)).toEqual({ fehler: 'Offene Klammer {', stelle: 0 });
    expect(texNachMathml('x}', false)).toEqual({ fehler: 'Überzählige }', stelle: 1 });
    expect(texNachMathml('^2', false)).toEqual({ fehler: '^ ohne Basis', stelle: 0 });
    expect(texNachMathml('x^', false)).toEqual({ fehler: 'Argument fehlt', stelle: 2 });
    expect(texNachMathml('x^2^3', false)).toEqual({ fehler: 'Doppelte Hochstellung', stelle: 3 });
    expect(texNachMathml('x_1_2', false)).toEqual({ fehler: 'Doppelte Tiefstellung', stelle: 3 });
    expect(texNachMathml('\\right)', false)).toEqual({ fehler: '\\right ohne \\left', stelle: 0 });
    expect(texNachMathml('\\left( x', false)).toEqual({ fehler: '\\left ohne \\right', stelle: 0 });
    expect(texNachMathml('\\left x \\right)', false)).toEqual({ fehler: 'Klammer nach \\left oder \\right erwartet', stelle: 6 });
    expect(texNachMathml('\\sqrt[3{x}', false)).toEqual({ fehler: 'Offene Klammer [', stelle: 5 });
    expect(texNachMathml('\\text{a{b}}', false)).toEqual({ fehler: 'Verschachtelte Klammern in \\text', stelle: 5 });
    expect(texNachMathml('\\text x', false)).toEqual({ fehler: '\\text ohne {', stelle: 0 });
    expect(texNachMathml('x\\', false)).toEqual({ fehler: 'Backslash am Ende', stelle: 1 });
    expect(texNachMathml('  ', false)).toEqual({ fehler: 'Leere Formel', stelle: 0 });
  });
});
```

Der Test hat 14 Fälle. Bewusst ohne Fall: `\frac12` ohne Klammern liest TeX als zwei Argumente `1` und `2`, der Tokenizer hier als eine Zahl `12`. In den Texten stehen Argumente von `\frac`, `^` und `_` mit mehr als einem Zeichen deshalb immer in Klammern.

- [ ] **Schritt 2: Test laufen lassen, er scheitert**

Run: `npx vitest run src/ui/info/texUebersetzer.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 3: `src/ui/info/texUebersetzer.ts` schreiben**

```ts
/**
 * Übersetzer einer TeX-Teilmenge nach MathML (Entwurf 4d §3.3). Das Ergebnis
 * ist ein reiner Datenbaum; Formel.tsx gibt ihn mit createElement aus. Was
 * nicht zur Teilmenge gehört, ist ein Fehler mit Stelle — der Dateitest lässt
 * jeden Text mit einem solchen Fehler durchfallen. Neue Befehle kommen nur
 * dazu, wenn ein Text sie braucht, jeweils mit Test.
 */
export type MathKnoten =
  | { tag: string; attribute?: Readonly<Record<string, string>>; kinder: readonly MathKnoten[] }
  | { tag: 'mi' | 'mn' | 'mo' | 'mtext'; attribute?: Readonly<Record<string, string>>; text: string };

export type Uebersetzung = { baum: MathKnoten } | { fehler: string; stelle: number };

class TexFehler extends Error {
  stelle: number;
  constructor(meldung: string, stelle: number) {
    super(meldung);
    this.stelle = stelle;
  }
}

type Token =
  | { art: 'befehl'; name: string; stelle: number }
  | { art: 'zahl'; text: string; stelle: number }
  | { art: 'buchstabe'; text: string; stelle: number }
  | { art: 'rohtext'; text: string; stelle: number }
  | { art: 'zeichen'; text: string; stelle: number };

const LEERRAUM = /\s/;
const ZIFFER = /[0-9]/;
const BUCHSTABE = /[A-Za-z]/;
const EINZELZEICHEN = new Set(['+', '-', '=', '<', '>', '(', ')', '[', ']', '/', ',', ':', '.', '|', '{', '}', '^', '_']);

const GRIECHISCH: Readonly<Record<string, string>> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ϵ', varepsilon: 'ε', zeta: 'ζ', eta: 'η',
  theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π',
  varpi: 'ϖ', rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'ϕ', varphi: 'φ', chi: 'χ', psi: 'ψ',
  omega: 'ω',
};
const GRIECHISCH_GROSS: Readonly<Record<string, string>> = {
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
};
/** \odot und \oplus wie im astronomischen Satz für Sonne und Erde (M_\odot). */
const OPERATOREN: Readonly<Record<string, string>> = {
  approx: '≈', sim: '∼', simeq: '≃', propto: '∝', le: '≤', leq: '≤', ge: '≥', geq: '≥', ll: '≪', gg: '≫',
  ne: '≠', neq: '≠', equiv: '≡', to: '→', pm: '±', cdot: '⋅', times: '×', circ: '∘', ldots: '…',
  odot: '⊙', oplus: '⊕',
};
const SYMBOLE: Readonly<Record<string, string>> = { partial: '∂', nabla: '∇', infty: '∞' };
const FUNKTIONEN = new Set(['sin', 'cos', 'tan', 'arcsin', 'arctan', 'exp', 'ln', 'log', 'max', 'min']);
const GROSSOPERATOREN: Readonly<Record<string, string>> = { sum: '∑', int: '∫' };
const AKZENTE: Readonly<Record<string, string>> = { dot: '˙', ddot: '¨', bar: '¯', hat: '^', vec: '→', tilde: '~' };
const ABSTAENDE: Readonly<Record<string, string>> = { ',': '0.1667em', ';': '0.2778em', quad: '1em' };

/** Nachschlagen ohne Prototyp-Treffer (\constructor ist kein Befehl). */
const aus = (tabelle: Readonly<Record<string, string>>, name: string): string | undefined =>
  (Object.hasOwn(tabelle, name) ? tabelle[name] : undefined);

function zerlegen(tex: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < tex.length) {
    const c = tex[i]!;
    if (LEERRAUM.test(c)) {
      i += 1;
      continue;
    }
    if (c === '\\') {
      const wort = /^[A-Za-z]+/.exec(tex.slice(i + 1));
      if (wort !== null && wort[0] === 'text') {
        let j = i + 5;
        while (LEERRAUM.test(tex[j] ?? '')) j += 1;
        if (tex[j] !== '{') throw new TexFehler('\\text ohne {', i);
        const zu = tex.indexOf('}', j + 1);
        if (zu < 0) throw new TexFehler('Offene Klammer {', j);
        const inhalt = tex.slice(j + 1, zu);
        if (inhalt.includes('{')) throw new TexFehler('Verschachtelte Klammern in \\text', j);
        tokens.push({ art: 'rohtext', text: inhalt, stelle: i });
        i = zu + 1;
        continue;
      }
      if (wort !== null) {
        tokens.push({ art: 'befehl', name: wort[0], stelle: i });
        i += 1 + wort[0].length;
        continue;
      }
      const zeichen = tex[i + 1];
      if (zeichen === undefined) throw new TexFehler('Backslash am Ende', i);
      tokens.push({ art: 'befehl', name: zeichen, stelle: i });
      i += 2;
      continue;
    }
    if (ZIFFER.test(c)) {
      let j = i;
      let text = '';
      while (j < tex.length) {
        const z = tex[j]!;
        if (ZIFFER.test(z)) {
          text += z;
          j += 1;
        } else if (z === '.' && ZIFFER.test(tex[j + 1] ?? '')) {
          text += '.';
          j += 1;
        } else if (tex.startsWith('{,}', j) && ZIFFER.test(tex[j + 3] ?? '')) {
          text += ',';
          j += 3;
        } else {
          break;
        }
      }
      tokens.push({ art: 'zahl', text, stelle: i });
      i = j;
      continue;
    }
    if (BUCHSTABE.test(c)) {
      tokens.push({ art: 'buchstabe', text: c, stelle: i });
      i += 1;
      continue;
    }
    if (EINZELZEICHEN.has(c)) {
      tokens.push({ art: 'zeichen', text: c, stelle: i });
      i += 1;
      continue;
    }
    throw new TexFehler(`Zeichen „${c}" gehört nicht zur Teilmenge`, i);
  }
  return tokens;
}

/** Ein Element der Zeile samt Hoch- und Tiefstellung, die erst am Ende gebaut wird. */
interface Atom { basis: MathKnoten; grenzen: boolean; unten: MathKnoten | null; oben: MathKnoten | null }

const einfach = (basis: MathKnoten): Atom => ({ basis, grenzen: false, unten: null, oben: null });
const zeileAus = (kinder: MathKnoten[]): MathKnoten => (kinder.length === 1 ? kinder[0]! : { tag: 'mrow', kinder });

/** \mathrm: alle mi aufrecht, benachbarte Buchstaben in einer Zeile zu einem mi. */
function aufrecht(k: MathKnoten): MathKnoten {
  if ('text' in k) return k.tag === 'mi' ? { tag: 'mi', attribute: { mathvariant: 'normal' }, text: k.text } : k;
  const kinder = k.kinder.map(aufrecht);
  if (k.tag !== 'mrow') return { ...k, kinder };
  const verbunden: MathKnoten[] = [];
  for (const kind of kinder) {
    const letztes = verbunden[verbunden.length - 1];
    if (letztes !== undefined && 'text' in letztes && letztes.tag === 'mi' && 'text' in kind && kind.tag === 'mi') {
      verbunden[verbunden.length - 1] = { tag: 'mi', attribute: { mathvariant: 'normal' }, text: letztes.text + kind.text };
    } else {
      verbunden.push(kind);
    }
  }
  return { ...k, kinder: verbunden };
}

export function texNachMathml(tex: string, block: boolean): Uebersetzung {
  try {
    const tokens = zerlegen(tex);
    let pos = 0;
    const blick = (): Token | undefined => tokens[pos];
    const istZeichen = (t: Token | undefined, z: string): boolean => t?.art === 'zeichen' && t.text === z;
    const istBefehl = (t: Token | undefined, name: string): boolean => t?.art === 'befehl' && t.name === name;
    const naechstes = (): Token => {
      const t = tokens[pos];
      if (t === undefined) throw new TexFehler('Argument fehlt', tex.length);
      pos += 1;
      return t;
    };

    const bauen = (a: Atom): MathKnoten => {
      const darueber = a.grenzen && block;
      if (a.unten !== null && a.oben !== null) {
        return { tag: darueber ? 'munderover' : 'msubsup', kinder: [a.basis, a.unten, a.oben] };
      }
      if (a.unten !== null) return { tag: darueber ? 'munder' : 'msub', kinder: [a.basis, a.unten] };
      if (a.oben !== null) return { tag: darueber ? 'mover' : 'msup', kinder: [a.basis, a.oben] };
      return a.basis;
    };

    /** Liest bis }, \right, ] (nur wenn `bisEckig`) oder zum Ende; verbraucht das Ende nicht. */
    const liste = (bisEckig: boolean): MathKnoten[] => {
      const atome: Atom[] = [];
      for (;;) {
        const t = blick();
        if (t === undefined || istZeichen(t, '}') || istBefehl(t, 'right') || (bisEckig && istZeichen(t, ']'))) break;
        if (istZeichen(t, '^') || istZeichen(t, '_')) {
          pos += 1;
          const basis = atome[atome.length - 1];
          if (basis === undefined) throw new TexFehler(`${t.art === 'zeichen' ? t.text : ''} ohne Basis`, t.stelle);
          const arg = argument();
          if (istZeichen(t, '^')) {
            if (basis.oben !== null) throw new TexFehler('Doppelte Hochstellung', t.stelle);
            basis.oben = arg;
          } else {
            if (basis.unten !== null) throw new TexFehler('Doppelte Tiefstellung', t.stelle);
            basis.unten = arg;
          }
          continue;
        }
        atome.push(atom());
      }
      return atome.map(bauen);
    };

    const gruppe = (): MathKnoten => {
      const auf = naechstes();
      const kinder = liste(false);
      if (!istZeichen(blick(), '}')) throw new TexFehler('Offene Klammer {', auf.stelle);
      pos += 1;
      return zeileAus(kinder);
    };

    const argument = (): MathKnoten => {
      const t = blick();
      if (t === undefined) throw new TexFehler('Argument fehlt', tex.length);
      if (istZeichen(t, '{')) return gruppe();
      if (istZeichen(t, '}') || istZeichen(t, '^') || istZeichen(t, '_')) throw new TexFehler('Argument fehlt', t.stelle);
      return bauen(atom());
    };

    const klammer = (): MathKnoten[] => {
      const t = blick();
      if (t?.art !== 'zeichen' || !['(', ')', '[', ']', '|', '.'].includes(t.text)) {
        throw new TexFehler('Klammer nach \\left oder \\right erwartet', t?.stelle ?? tex.length);
      }
      pos += 1;
      return t.text === '.' ? [] : [{ tag: 'mo', attribute: { stretchy: 'true' }, text: t.text }];
    };

    const befehl = (t: Token & { art: 'befehl' }): Atom => {
      const n = t.name;
      const klein = aus(GRIECHISCH, n);
      if (klein !== undefined) return einfach({ tag: 'mi', text: klein });
      const gross = aus(GRIECHISCH_GROSS, n);
      if (gross !== undefined) return einfach({ tag: 'mi', attribute: { mathvariant: 'normal' }, text: gross });
      const operator = aus(OPERATOREN, n);
      if (operator !== undefined) return einfach({ tag: 'mo', text: operator });
      const symbol = aus(SYMBOLE, n);
      if (symbol !== undefined) return einfach({ tag: 'mi', text: symbol });
      if (FUNKTIONEN.has(n)) return einfach({ tag: 'mi', text: n });
      const grossoperator = aus(GROSSOPERATOREN, n);
      if (grossoperator !== undefined) {
        return { basis: { tag: 'mo', attribute: { largeop: 'true' }, text: grossoperator }, grenzen: n === 'sum', unten: null, oben: null };
      }
      const abstand = aus(ABSTAENDE, n);
      if (abstand !== undefined) return einfach({ tag: 'mspace', attribute: { width: abstand }, kinder: [] });
      const akzent = aus(AKZENTE, n);
      if (akzent !== undefined) {
        return einfach({ tag: 'mover', attribute: { accent: 'true' }, kinder: [argument(), { tag: 'mo', text: akzent }] });
      }
      switch (n) {
        case 'frac': {
          const zaehler = argument();
          const nenner = argument();
          return einfach({ tag: 'mfrac', kinder: [zaehler, nenner] });
        }
        case 'sqrt': {
          if (istZeichen(blick(), '[')) {
            const auf = naechstes();
            const index = liste(true);
            if (!istZeichen(blick(), ']')) throw new TexFehler('Offene Klammer [', auf.stelle);
            pos += 1;
            return einfach({ tag: 'mroot', kinder: [argument(), zeileAus(index)] });
          }
          return einfach({ tag: 'msqrt', kinder: [argument()] });
        }
        case 'left': {
          const links = klammer();
          const kinder = liste(false);
          if (!istBefehl(blick(), 'right')) throw new TexFehler('\\left ohne \\right', t.stelle);
          pos += 1;
          const rechts = klammer();
          return einfach({ tag: 'mrow', kinder: [...links, ...kinder, ...rechts] });
        }
        case 'right':
          throw new TexFehler('\\right ohne \\left', t.stelle);
        case 'mathrm':
          return einfach(aufrecht(argument()));
        default:
          throw new TexFehler(`Unbekannter Befehl \\${n}`, t.stelle);
      }
    };

    const atom = (): Atom => {
      const t = naechstes();
      switch (t.art) {
        case 'zahl': return einfach({ tag: 'mn', text: t.text });
        case 'buchstabe': return einfach({ tag: 'mi', text: t.text });
        case 'rohtext': return einfach({ tag: 'mtext', text: t.text });
        case 'befehl': return befehl(t);
        case 'zeichen':
          if (t.text === '{') {
            pos -= 1;
            return einfach(gruppe());
          }
          if (t.text === '}') throw new TexFehler('Überzählige }', t.stelle);
          return einfach({ tag: 'mo', text: t.text === '-' ? '−' : t.text });
      }
    };

    const kinder = liste(false);
    const rest = blick();
    if (rest !== undefined) {
      throw new TexFehler(istZeichen(rest, '}') ? 'Überzählige }' : '\\right ohne \\left', rest.stelle);
    }
    if (kinder.length === 0) throw new TexFehler('Leere Formel', 0);
    return { baum: { tag: 'math', attribute: { display: block ? 'block' : 'inline' }, kinder: [{ tag: 'mrow', kinder }] } };
  } catch (fehler) {
    if (fehler instanceof TexFehler) return { fehler: fehler.message, stelle: fehler.stelle };
    throw fehler;
  }
}
```

Hinweise zum Code:
- `\mathrm{km}` liefert `mrow` mit einem `mi` („km"); das ist Absicht (die Gruppe bleibt eine Zeile), der Test erwartet genau das.
- `argument()` ruft für ein einzelnes Token `atom()` auf; `x^\frac{1}{2}` funktioniert deshalb, `x^12` nimmt die ganze Zahl `12` als Hochzahl (anders als TeX). In den Texten Hochzahlen mit mehr als einem Zeichen immer klammern.
- Die Fehlerstelle bei `\sqrt[3{x}` ist 5 (die öffnende eckige Klammer), bei `\left x \right)` die Stelle des `x` (6).

- [ ] **Schritt 4: Test laufen lassen**

Run: `npx vitest run src/ui/info/texUebersetzer.test.ts`
Expected: PASS, 14 Fälle. Scheitert ein Fall an einer Stelle oder einem Fehlertext, zuerst den Code gegen die Liste der Fehlertexte oben prüfen; den Test nur ändern, wenn die erwartete Stelle nachweislich falsch gezählt ist (im Bericht nennen).

- [ ] **Schritt 5: Typcheck und Commit**

Run: `npx tsc --noEmit -p tsconfig.json` → keine Ausgabe.

```bash
git add src/ui/info/texUebersetzer.ts src/ui/info/texUebersetzer.test.ts
git commit -m "Infopanel: Übersetzer einer TeX-Teilmenge in einen MathML-Datenbaum"
```

---

### Task 3: Ausgabe von Formeln und Tabellen

**Dateien:**
- Erstellen: `src/ui/info/Formel.tsx`
- Ändern: `src/ui/info/Markdown.tsx` (Platzhalter aus Task 1 ersetzen)
- Ändern: `src/ui/info/Markdown.test.tsx`

**Schnittstellen:**
- Konsumiert: `texNachMathml`, `MathKnoten` (Task 2); `Block`, `Inline`, `Ausrichtung` (Task 1).
- Produziert: `export function Formel({ tex, block }: { tex: string; block: boolean }): React.JSX.Element`; im DOM `[data-blockformel]` (Rahmen einer Blockformel), `code[data-formelfehler]` (Fehlerfall), `[data-tabelle]` (Rahmen einer Tabelle). Task 13 misst an diesen Attributen.

- [ ] **Schritt 1: Tests in `src/ui/info/Markdown.test.tsx` anfügen** (vor der letzten schließenden Klammer von `describe('Markdown', …)`)

```tsx
  it('setzt Formeln als MathML; Blockformeln scrollen waagerecht, Fehler zeigen den Quelltext', () => {
    const { container } = render(
      <Markdown text={'Es gilt $a^2$.\n\n$$\\frac{1}{2}$$\n\nFalsch: $\\foo$'} onVerweis={() => {}} />,
    );
    const formeln = container.querySelectorAll('math');
    expect(formeln).toHaveLength(2);
    expect(formeln[0]?.namespaceURI).toBe('http://www.w3.org/1998/Math/MathML');
    expect(formeln[0]?.getAttribute('display')).toBe('inline');
    expect(container.querySelector('msup')?.namespaceURI).toBe('http://www.w3.org/1998/Math/MathML');
    const block = container.querySelector('[data-blockformel]');
    expect(block?.className).toContain('overflow-x-auto');
    expect(block?.querySelector('math')?.getAttribute('display')).toBe('block');
    expect(block?.querySelector('mfrac')).not.toBeNull();
    const fehler = container.querySelector('code[data-formelfehler]');
    expect(fehler?.textContent).toBe('\\foo');
    expect(fehler?.getAttribute('data-formelfehler')).toBe('Unbekannter Befehl \\foo');
  });

  it('gibt Tabellen mit Kopf, Ausrichtung und Formeln in Zellen aus', () => {
    const { container } = render(
      <Markdown text={'| Größe | Wert |\n|:---|---:|\n| $J_2$ | 1 |'} onVerweis={() => {}} />,
    );
    expect(screen.getByRole('table')).toBeTruthy();
    const koepfe = screen.getAllByRole('columnheader');
    expect(koepfe.map((k) => k.textContent)).toEqual(['Größe', 'Wert']);
    expect(koepfe[0]?.getAttribute('scope')).toBe('col');
    expect(koepfe[1]?.className).toContain('text-right');
    const zellen = screen.getAllByRole('cell');
    expect(zellen[0]?.querySelector('msub')).not.toBeNull();
    expect(zellen[1]?.className).toContain('whitespace-nowrap');
    expect(container.querySelector('[data-tabelle]')?.className).toContain('overflow-x-auto');
  });
```

- [ ] **Schritt 2: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/info/Markdown.test.tsx`
Expected: FAIL (kein `math`-Element, keine Tabelle).

- [ ] **Schritt 3: `src/ui/info/Formel.tsx` schreiben**

```tsx
import { createElement, useMemo } from 'react';
import type { ReactNode } from 'react';
import { texNachMathml } from './texUebersetzer';
import type { MathKnoten } from './texUebersetzer';

/**
 * Gibt einen Knoten des MathML-Datenbaums aus. React legt alles unterhalb
 * von math im MathML-Namensraum an; die Attribute (display, mathvariant,
 * stretchy, …) gehen unverändert an das Element.
 */
function ausgabe(k: MathKnoten, schluessel: number): ReactNode {
  if ('text' in k) return createElement(k.tag, { key: schluessel, ...k.attribute }, k.text);
  return createElement(k.tag, { key: schluessel, ...k.attribute }, k.kinder.map(ausgabe));
}

/**
 * Eine Formel aus einem Erläuterungstext (Entwurf 4d §3.4). Blockformeln
 * scrollen waagerecht, damit breite Formeln die schmale Spalte nicht
 * sprengen. Übersetzt die Formel nicht, erscheint der TeX-Quelltext; der
 * Dateitest verhindert das in ausgelieferten Texten.
 */
export function Formel({ tex, block }: { tex: string; block: boolean }): React.JSX.Element {
  const ergebnis = useMemo(() => texNachMathml(tex, block), [tex, block]);
  if ('fehler' in ergebnis) {
    return (
      <code data-formelfehler={ergebnis.fehler} title={`${ergebnis.fehler} (Stelle ${ergebnis.stelle})`} className="text-amber-300">
        {tex}
      </code>
    );
  }
  const math = ausgabe(ergebnis.baum, 0);
  return block ? <div data-blockformel className="overflow-x-auto py-1">{math}</div> : <>{math}</>;
}
```

- [ ] **Schritt 4: `src/ui/info/Markdown.tsx` anpassen**

Importe ergänzen (nach `import type { Block, Inline } from './markdownParser';`):

```tsx
import type { Ausrichtung } from './markdownParser';
import { Formel } from './Formel';
```

In `Inlines` den Platzhalter aus Task 1 ersetzen:

```tsx
          case 'formel': return <Formel key={i} tex={k.tex} block={false} />;
```

Vor `function Blockknoten` einfügen:

```tsx
const ZELLE = 'whitespace-nowrap border border-white/15 px-2 py-1';
const AUSRICHTUNG: Record<Ausrichtung, string> = { links: 'text-left', mitte: 'text-center', rechts: 'text-right' };
```

In `Blockknoten` die beiden Platzhalter aus Task 1 ersetzen:

```tsx
    case 'formel':
      return <Formel tex={block.tex} block />;
    case 'tabelle':
      // Zellen brechen nicht um; ist die Tabelle breiter als die Spalte,
      // scrollt der Rahmen (Entwurf 4d §3.4).
      return (
        <div data-tabelle className="overflow-x-auto">
          <table className="border-collapse text-xs tabular-nums">
            <thead>
              <tr>
                {block.kopf.map((zelle, i) => (
                  <th key={i} scope="col" className={`${ZELLE} font-semibold ${AUSRICHTUNG[block.ausrichtung[i] ?? 'links']}`}>
                    <Inlines kinder={zelle} onVerweis={onVerweis} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.zeilen.map((zeile, r) => (
                <tr key={r}>
                  {zeile.map((zelle, i) => (
                    <td key={i} className={`${ZELLE} ${AUSRICHTUNG[block.ausrichtung[i] ?? 'links']}`}>
                      <Inlines kinder={zelle} onVerweis={onVerweis} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
```

- [ ] **Schritt 5: Tests und Typcheck**

Run: `npx vitest run src/ui/info` → PASS (2 neue Fälle).
Run: `npx tsc --noEmit -p tsconfig.json` → keine Ausgabe.

- [ ] **Schritt 6: Commit**

```bash
git add src/ui/info/Formel.tsx src/ui/info/Markdown.tsx src/ui/info/Markdown.test.tsx
git commit -m "Infopanel: Formeln als MathML und Tabellen ausgeben"
```

---

### Task 4: Literaturkatalog, Verweis `literatur:`, Hervorhebungsschlüssel

**Dateien:**
- Erstellen: `src/data/literatur.ts`, `src/data/literatur.test.ts`, `src/data/verweise.literatur.test.ts`, `src/ui/info/Markdown.literatur.test.tsx`
- Ändern: `src/data/verweise.ts`, `src/data/verweise.test.ts`
- Ändern: `src/ui/info/Markdown.tsx` (Funktion `Verweisknoten`)
- Ändern: `src/ui/info/verweisAusfuehren.ts`, `src/ui/info/verweisAusfuehren.test.ts`
- Ändern: `src/ui/info/Quellenkarten.tsx`, `src/ui/info/Quellenkarten.test.tsx`
- Ändern: `src/ui/info/InfoPanel.tsx` (nur Parametername von `hebeHervor`)

**Schnittstellen:**
- Konsumiert: nichts Neues.
- Produziert (von Task 5, 6, 9 bis 12 genutzt), alles aus `src/data/literatur.ts`:

```ts
export interface Publikation {
  id: string; autoren: string[]; etAl: boolean; jahr: number; titel: string; erschienen: string;
  doi?: string; arxiv?: string; bibcode?: string; url?: string;
}
export const LITERATUR: readonly Publikation[];
export function publikationFinden(id: string): Publikation | undefined;
export const doiAdresse: (doi: string) => string;        // https://doi.org/<doi>
export const arxivAdresse: (arxiv: string) => string;    // https://arxiv.org/abs/<arxiv>
export const adsAdresse: (bibcode: string) => string;    // https://ui.adsabs.harvard.edu/abs/<kodiert>/abstract
export function hauptadresse(p: Publikation): string;   // DOI, sonst arXiv, sonst url
export const istPreprint: (p: Publikation) => boolean;  // ohne DOI, mit arXiv
export function erstautorNachname(p: Publikation): string;
export function jahrMitSuffix(p: Publikation): string;  // aus der Kennung: '2021a'
export function autorenzeile(p: Publikation): string;   // 'Muster, A., Beispiel, B. et al.'
```

- `Verweis` in `src/data/verweise.ts` um `{ art: 'literatur'; publikation: Publikation }` erweitert.
- `VerweisWirkung.hebeHervor(schluessel: string)` erhält `quelle:<id>` oder `literatur:<id>`; `Quellenkarten` vergleicht `hervorgehoben` mit `quelle:<id>`.

- [ ] **Schritt 1: `src/data/literatur.test.ts` schreiben**

```ts
import { describe, it, expect } from 'vitest';
import {
  LITERATUR, adsAdresse, autorenzeile, erstautorNachname, hauptadresse, istPreprint, jahrMitSuffix, publikationFinden,
} from './literatur';
import type { Publikation } from './literatur';

const DOI = /^10\.\d{4,9}\/\S+$/;
const ARXIV = /^(\d{4}\.\d{4,5}(v\d+)?|[a-z-]+(\.[A-Z]{2})?\/\d{7})$/;
const KENNUNG = /^[a-z][a-z0-9-]*-(\d{4})[a-z]?$/;

/** Erfundene Testdaten, nicht im Katalog. */
const VOLL: Publikation = {
  id: 'muster-2020a', autoren: ['Muster, A.', 'de Beispiel, B.'], etAl: true, jahr: 2020,
  titel: 'Erfundene Arbeit', erschienen: 'Testzeitschrift 1, 1',
  doi: '10.0000/test.1', arxiv: '2001.00001', bibcode: '2020A&A...1....1M',
};
const PREPRINT: Publikation = {
  id: 'beispiel-2021', autoren: ['Beispiel, B.'], etAl: false, jahr: 2021,
  titel: 'Nur als Preprint', erschienen: 'arXiv', arxiv: '2101.00002',
};
const BERICHT: Publikation = {
  id: 'amt-2019', autoren: ['Amt, A.'], etAl: false, jahr: 2019,
  titel: 'Bericht', erschienen: 'Technischer Bericht', url: 'https://example.org/bericht',
};

describe('Literaturkatalog (Entwurf 4d §4.4)', () => {
  it('hat eindeutige Kennungen im Muster Erstautor-Jahr mit passendem Jahr', () => {
    const ids = LITERATUR.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const diesesJahr = new Date().getFullYear();
    for (const p of LITERATUR) {
      const treffer = KENNUNG.exec(p.id);
      expect(treffer, p.id).not.toBeNull();
      expect(Number(treffer?.[1]), p.id).toBe(p.jahr);
      expect(p.jahr, p.id).toBeGreaterThanOrEqual(1600);
      expect(p.jahr, p.id).toBeLessThanOrEqual(diesesJahr);
    }
  });

  it('hat vollständige Angaben in gültigen Formaten', () => {
    for (const p of LITERATUR) {
      expect(p.autoren.length, p.id).toBeGreaterThanOrEqual(1);
      expect(p.autoren.length, p.id).toBeLessThanOrEqual(3);
      for (const autor of p.autoren) expect(autor, p.id).toMatch(/^\S.*, \S/);
      expect(p.titel.trim().length, p.id).toBeGreaterThan(0);
      expect(p.erschienen.trim().length, p.id).toBeGreaterThan(0);
      expect(p.doi !== undefined || p.arxiv !== undefined || p.url !== undefined, `${p.id}: DOI, arXiv oder URL`).toBe(true);
      if (p.doi !== undefined) expect(p.doi, p.id).toMatch(DOI);
      if (p.arxiv !== undefined) expect(p.arxiv, p.id).toMatch(ARXIV);
      if (p.bibcode !== undefined) {
        expect(p.bibcode, p.id).toHaveLength(19);
        expect(p.bibcode.slice(0, 4), p.id).toBe(String(p.jahr));
      }
      if (p.url !== undefined) expect(p.url, p.id).toMatch(/^https:\/\//);
    }
  });
});

describe('Hilfsfunktionen des Literaturkatalogs', () => {
  it('bildet die Hauptadresse aus DOI, sonst arXiv, sonst URL', () => {
    expect(hauptadresse(VOLL)).toBe('https://doi.org/10.0000/test.1');
    expect(hauptadresse(PREPRINT)).toBe('https://arxiv.org/abs/2101.00002');
    expect(hauptadresse(BERICHT)).toBe('https://example.org/bericht');
  });

  it('erkennt Preprints, Erstautor, Jahr mit Suffix und bildet die Autorenzeile', () => {
    expect(istPreprint(PREPRINT)).toBe(true);
    expect(istPreprint(VOLL)).toBe(false);
    expect(istPreprint(BERICHT)).toBe(false);
    expect(erstautorNachname(VOLL)).toBe('Muster');
    expect(erstautorNachname({ ...VOLL, autoren: ['de Pater, I.'] })).toBe('de Pater');
    expect(jahrMitSuffix(VOLL)).toBe('2020a');
    expect(jahrMitSuffix(PREPRINT)).toBe('2021');
    expect(autorenzeile(VOLL)).toBe('Muster, A., de Beispiel, B. et al.');
    expect(autorenzeile(PREPRINT)).toBe('Beispiel, B.');
  });

  it('kodiert Bibcodes in der ADS-Adresse und findet keine unbekannten Einträge', () => {
    expect(adsAdresse('2020A&A...1....1M')).toBe('https://ui.adsabs.harvard.edu/abs/2020A%26A...1....1M/abstract');
    expect(publikationFinden('gibt-es-nicht-2000')).toBeUndefined();
  });
});
```

- [ ] **Schritt 2: Test laufen lassen, er scheitert**

Run: `npx vitest run src/data/literatur.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 3: `src/data/literatur.ts` schreiben**

```ts
/**
 * Literaturkatalog der Hochschultexte (Entwurf 4d §4.1). Sprachunabhängig,
 * Titel in der Originalsprache der Arbeit. Ein Text zitiert mit
 * `[Iess et al. 2019](literatur:iess-2019)`; die Karten unter dem Text
 * leiten sich aus diesen Verweisen ab (ui/info/zitate.ts).
 *
 * Diese Datei importiert nichts, auch keine Typen: scripts/pruefe-literatur.ts
 * lädt sie direkt mit Node, und Node löst nur Importe mit Dateiendung auf.
 *
 * Jeder Eintrag ist vor dem Commit mit `npm run literatur:pruefen` gegen
 * Crossref beziehungsweise arXiv geprüft und im Text wörtlich belegt
 * (docs/belege/hochschule/).
 */
export interface Publikation {
  /** Erstautor-Jahr[Suffix], ASCII klein, Umlaute umschrieben: 'iess-2019', 'gruen-2020a'. */
  id: string;
  /** Eins bis drei Autoren in der Form „Nachname, I."; weitere über `etAl`. */
  autoren: string[];
  etAl: boolean;
  jahr: number;
  titel: string;
  /** Zeitschrift mit Band und Seite oder Artikelnummer, Buch oder Konferenzband. */
  erschienen: string;
  doi?: string;
  /** Form 'JJMM.NNNNN' (optional mit Version) oder alte Form 'astro-ph/0101001'. */
  arxiv?: string;
  /** ADS-Bibcode, 19 Zeichen. */
  bibcode?: string;
  /** Nur für Berichte und Datensätze ohne DOI. */
  url?: string;
}

export const LITERATUR: readonly Publikation[] = [];

export function publikationFinden(id: string): Publikation | undefined {
  return LITERATUR.find((p) => p.id === id);
}

export const doiAdresse = (doi: string): string => `https://doi.org/${doi}`;
export const arxivAdresse = (arxiv: string): string => `https://arxiv.org/abs/${arxiv}`;
export const adsAdresse = (bibcode: string): string =>
  `https://ui.adsabs.harvard.edu/abs/${encodeURIComponent(bibcode)}/abstract`;

/** Ziel eines Zitats im Text: DOI, sonst arXiv, sonst die URL. */
export function hauptadresse(p: Publikation): string {
  if (p.doi !== undefined) return doiAdresse(p.doi);
  if (p.arxiv !== undefined) return arxivAdresse(p.arxiv);
  return p.url ?? '';
}

/** Ohne DOI, aber mit arXiv-Nummer: nicht (oder noch nicht) begutachtet erschienen. */
export const istPreprint = (p: Publikation): boolean => p.doi === undefined && p.arxiv !== undefined;

export function erstautorNachname(p: Publikation): string {
  return (p.autoren[0] ?? '').split(',')[0]?.trim() ?? '';
}

/** Jahr samt Suffix aus der Kennung ('park-2021a' → '2021a'); so steht es im Linktext. */
export function jahrMitSuffix(p: Publikation): string {
  return /-(\d{4}[a-z]?)$/.exec(p.id)?.[1] ?? String(p.jahr);
}

export function autorenzeile(p: Publikation): string {
  return `${p.autoren.join(', ')}${p.etAl ? ' et al.' : ''}`;
}
```

- [ ] **Schritt 4: Test laufen lassen**

Run: `npx vitest run src/data/literatur.test.ts`
Expected: PASS, 5 Fälle (die beiden Katalogfälle laufen über einen leeren Katalog; sie greifen ab Task 10).

- [ ] **Schritt 5: Verweis-Tests schreiben**

In `src/data/verweise.test.ts`, Fall „liefert null für unbekannte Kennungen und Schemata", eine Zeile ergänzen:

```ts
    expect(verweisAufloesen('literatur:nope-2000')).toBeNull();
```

Neue Datei `src/data/verweise.literatur.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { verweisAufloesen } from './verweise';

const { ARBEIT } = vi.hoisted(() => ({
  ARBEIT: {
    id: 'muster-2020', autoren: ['Muster, A.'], etAl: false, jahr: 2020,
    titel: 'Erfundene Arbeit für Tests', erschienen: 'Testzeitschrift 1, 1', doi: '10.0000/test.1',
  },
}));

vi.mock('./literatur', async (importOriginal) => {
  const echt = await importOriginal<typeof import('./literatur')>();
  return { ...echt, LITERATUR: [ARBEIT], publikationFinden: (id: string) => (id === ARBEIT.id ? ARBEIT : undefined) };
});

describe('verweisAufloesen mit Literatur', () => {
  it('löst literatur:<id> gegen den Katalog auf', () => {
    expect(verweisAufloesen('literatur:muster-2020')).toEqual({ art: 'literatur', publikation: ARBEIT });
    expect(verweisAufloesen('literatur:muster-2021')).toBeNull();
  });
});
```

Neue Datei `src/ui/info/Markdown.literatur.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Markdown } from './Markdown';

const { ARBEIT } = vi.hoisted(() => ({
  ARBEIT: {
    id: 'muster-2020', autoren: ['Muster, A.'], etAl: false, jahr: 2020,
    titel: 'Erfundene Arbeit für Tests', erschienen: 'Testzeitschrift 1, 1', doi: '10.0000/test.1',
  },
}));

vi.mock('../../data/literatur', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/literatur')>();
  return { ...echt, LITERATUR: [ARBEIT], publikationFinden: (id: string) => (id === ARBEIT.id ? ARBEIT : undefined) };
});

describe('Markdown mit Zitaten', () => {
  it('Zitate sind Anker auf die DOI; Linksklick meldet, Strg-Klick öffnet den Tab', () => {
    const onVerweis = vi.fn();
    render(<Markdown text="Gemessen von [Muster 2020](literatur:muster-2020)." onVerweis={onVerweis} />);
    const anker = screen.getByRole('link', { name: 'Muster 2020' }) as HTMLAnchorElement;
    expect(anker.href).toBe('https://doi.org/10.0000/test.1');
    expect(anker.target).toBe('_blank');
    expect(anker.rel).toContain('noopener');
    expect(anker.getAttribute('data-verweis')).toBe('literatur:muster-2020');
    expect(fireEvent.click(anker)).toBe(false);
    expect(onVerweis).toHaveBeenCalledWith({ art: 'literatur', publikation: ARBEIT });
    expect(fireEvent.click(anker, { ctrlKey: true })).toBe(true);
    expect(onVerweis).toHaveBeenCalledTimes(1);
  });
});
```

In `src/ui/info/verweisAusfuehren.test.ts` den Fall „quelle: meldet die Kennung zur Hervorhebung; extern tut nichts" ersetzen:

```ts
  it('quelle und literatur: melden den Schlüssel zur Hervorhebung; extern tut nichts', () => {
    const hebeHervor = vi.fn();
    verweisAusfuehren({ art: 'quelle', quelle: quelleFinden('nssdc-earth')! }, { hebeHervor });
    expect(hebeHervor).toHaveBeenCalledWith('quelle:nssdc-earth');
    const arbeit = {
      id: 'muster-2020', autoren: ['Muster, A.'], etAl: false, jahr: 2020,
      titel: 'Erfundene Arbeit für Tests', erschienen: 'Testzeitschrift 1, 1', doi: '10.0000/test.1',
    };
    verweisAusfuehren({ art: 'literatur', publikation: arbeit }, { hebeHervor });
    expect(hebeHervor).toHaveBeenLastCalledWith('literatur:muster-2020');
    const vorher = useStore.getState();
    verweisAusfuehren({ art: 'extern', url: 'https://example.org' }, { hebeHervor });
    expect(useStore.getState()).toBe(vorher);
    expect(hebeHervor).toHaveBeenCalledTimes(2);
  });
```

In `src/ui/info/Quellenkarten.test.tsx` den Fall „hebt die gewählte Karte hervor" ersetzen:

```tsx
  it('hebt die gewählte Karte über ihren Schlüssel hervor', () => {
    const { unmount } = render(<Quellenkarten kennung="objekt:earth" hervorgehoben="quelle:nasa-earth" />);
    const karte = screen.getByRole('link', { name: /Erde bei NASA Science/ });
    expect(karte.className).toContain('border-sky-300');
    const andere = screen.getByRole('link', { name: /Erde: Faktenblatt/ });
    expect(andere.className).not.toContain('border-sky-300');
    unmount();
    render(<Quellenkarten kennung="objekt:earth" hervorgehoben="literatur:nasa-earth" />);
    expect(screen.getByRole('link', { name: /Erde bei NASA Science/ }).className).not.toContain('border-sky-300');
  });
```

- [ ] **Schritt 6: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/data/verweise src/ui/info/Markdown.literatur.test.tsx src/ui/info/verweisAusfuehren.test.ts src/ui/info/Quellenkarten.test.tsx`
Expected: FAIL (Schema `literatur` unbekannt, Schlüssel ohne Präfix).

- [ ] **Schritt 7: `src/data/verweise.ts` erweitern**

Importe ergänzen:

```ts
import { publikationFinden } from './literatur';
import type { Publikation } from './literatur';
```

Den Typ `Verweis` ersetzen:

```ts
export type Verweis =
  | { art: 'objekt' | 'szene' | 'thema'; kennung: string }
  | { art: 'quelle'; quelle: Quelle }
  | { art: 'literatur'; publikation: Publikation }
  | { art: 'extern'; url: string };
```

In `verweisAufloesen` nach dem `quelle`-Zweig einfügen:

```ts
  if (art === 'literatur') {
    const publikation = publikationFinden(kennung);
    return publikation === undefined ? null : { art: 'literatur', publikation };
  }
```

- [ ] **Schritt 8: `Markdown.tsx`, `verweisAusfuehren.ts`, `Quellenkarten.tsx`, `InfoPanel.tsx` anpassen**

`src/ui/info/Markdown.tsx`: Import ergänzen `import { hauptadresse } from '../../data/literatur';`. In `Verweisknoten` den Zweig `if (v.art === 'quelle') { … }` ersetzen durch:

```tsx
  if (v.art === 'quelle' || v.art === 'literatur') {
    // Anker mit echter Adresse: Mittelklick öffnet den Tab, Linksklick hebt
    // die Karte hervor (Entwurf 4c §4.3, 4d §4.2).
    const href = v.art === 'quelle' ? v.quelle.url : hauptadresse(v.publikation);
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={VERWEIS_KNOPF}
        data-verweis={ziel}
        onClick={(e) => {
          if (willNeuenTab(e)) return;
          e.preventDefault();
          onVerweis(v);
        }}
      >
        {children}
      </a>
    );
  }
```

`src/ui/info/verweisAusfuehren.ts`: Kommentar und Fall `quelle` ersetzen:

```ts
export interface VerweisWirkung {
  /** Scrollt das untere Segment zur Karte und hebt sie kurz hervor; Schlüssel `quelle:<id>` oder `literatur:<id>`. */
  hebeHervor: (schluessel: string) => void;
}
```

```ts
    case 'quelle':
      wirkung.hebeHervor(`quelle:${v.quelle.id}`);
      return;
    case 'literatur':
      wirkung.hebeHervor(`literatur:${v.publikation.id}`);
      return;
```

`src/ui/info/Quellenkarten.tsx`: Props-Kommentar ändern auf `/** Schlüssel der hervorgehobenen Karte ('quelle:<id>' oder 'literatur:<id>'). */`. Den Effekt ersetzen:

```tsx
  useEffect(() => {
    if (hervorgehoben === null || !hervorgehoben.startsWith('quelle:')) return;
    // jsdom kennt scrollIntoView nicht; im Browser ist es immer da.
    karten.current.get(hervorgehoben.slice('quelle:'.length))?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [hervorgehoben]);
```

und in der Klasse der Karte `hervorgehoben === q.id` durch ``hervorgehoben === `quelle:${q.id}` `` ersetzen.

`src/ui/info/InfoPanel.tsx`: `const hebeHervor = (id: string): void => {` → `const hebeHervor = (schluessel: string): void => {` und darin `setHervorgehoben(id)` → `setHervorgehoben(schluessel)`.

- [ ] **Schritt 9: Tests, Typcheck, Commit**

Run: `npx vitest run src/data src/ui/info` → PASS (neu: 5 in `literatur.test.ts`, 1 in `verweise.literatur.test.ts`, 1 in `Markdown.literatur.test.tsx`; zwei Fälle ersetzt).
Run: `npx tsc --noEmit -p tsconfig.json` → keine Ausgabe.

```bash
git add src/data/literatur.ts src/data/literatur.test.ts src/data/verweise.ts src/data/verweise.test.ts src/data/verweise.literatur.test.ts src/ui/info/Markdown.tsx src/ui/info/Markdown.literatur.test.tsx src/ui/info/verweisAusfuehren.ts src/ui/info/verweisAusfuehren.test.ts src/ui/info/Quellenkarten.tsx src/ui/info/Quellenkarten.test.tsx src/ui/info/InfoPanel.tsx
git commit -m "Literaturkatalog und Verweis literatur:, Hervorhebung über Schlüssel"
```

---

### Task 5: Literaturkarten im Infopanel

**Dateien:**
- Erstellen: `src/ui/info/zitate.ts`, `src/ui/info/zitate.test.ts`, `src/ui/info/Literaturkarten.tsx`, `src/ui/info/Literaturkarten.test.tsx`, `src/ui/info/InfoPanel.literatur.test.tsx`
- Ändern: `src/ui/info/InfoPanel.tsx`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts`, `src/ui/i18n/i18n.test.ts`

**Schnittstellen:**
- Konsumiert: `Block`, `Inline`, `parseMarkdown` (Task 1); `Publikation`, `publikationFinden`, `erstautorNachname`, `jahrMitSuffix`, `autorenzeile`, `istPreprint`, `doiAdresse`, `arxivAdresse`, `adsAdresse` (Task 4).
- Produziert:
  - `zitierteKennungen(bloecke: readonly Block[]): string[]` (Reihenfolge des ersten Auftretens, ohne Doppelte)
  - `sortiereArbeiten(arbeiten: readonly Publikation[]): Publikation[]`
  - `zitierteArbeiten(bloecke: readonly Block[]): Publikation[]`
  - `Literaturkarten({ arbeiten, hervorgehoben })`; im DOM `article[data-literatur="<id>"]`.
  - Sprachschlüssel `quelle.art.literatur`, `literatur.doi`, `literatur.arxiv`, `literatur.ads`, `literatur.seite`, `literatur.preprint`.

- [ ] **Schritt 1: `src/ui/info/zitate.test.ts` schreiben**

```ts
import { describe, it, expect, vi } from 'vitest';
import { parseMarkdown } from './markdownParser';
import { sortiereArbeiten, zitierteArbeiten, zitierteKennungen } from './zitate';

const { ARBEITEN } = vi.hoisted(() => {
  const arbeit = (id: string, autor: string, jahr: number) => ({
    id, autoren: [autor], etAl: false, jahr, titel: `Titel ${id}`, erschienen: 'Test 1, 1', doi: `10.0000/${id}`,
  });
  return {
    ARBEITEN: [
      arbeit('zeta-2019', 'Zeta, Z.', 2019),
      arbeit('mueller-2020b', 'Müller, M.', 2020),
      arbeit('mueller-2020a', 'Müller, M.', 2020),
      arbeit('mueller-2018', 'Müller, M.', 2018),
      arbeit('de-pater-2014', 'de Pater, I.', 2014),
    ],
  };
});

vi.mock('../../data/literatur', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/literatur')>();
  return { ...echt, LITERATUR: ARBEITEN, publikationFinden: (id: string) => ARBEITEN.find((a) => a.id === id) };
});

const MD = [
  '## Abschnitt [Zeta 2019](literatur:zeta-2019)',
  '',
  'Text [Müller 2020b](literatur:mueller-2020b) und **[de Pater et al. 2014](literatur:de-pater-2014)**, [Erde](objekt:earth).',
  '',
  '- [Müller 2020a](literatur:mueller-2020a) und [unbekannt](literatur:nope-1999)',
  '',
  '| Wert | Quelle |',
  '|---|---|',
  '| 1 | [Zeta 2019](literatur:zeta-2019) |',
].join('\n');

describe('zitate', () => {
  it('sammelt Zitate aus Überschriften, Absätzen, Hervorhebungen, Listen und Tabellen, ohne Doppelte', () => {
    expect(zitierteKennungen(parseMarkdown(MD))).toEqual([
      'zeta-2019', 'mueller-2020b', 'de-pater-2014', 'mueller-2020a', 'nope-1999',
    ]);
  });

  it('sortiert nach Erstautor ohne Rücksicht auf Groß- und Kleinschreibung, dann Jahr, dann Suffix', () => {
    expect(sortiereArbeiten(ARBEITEN).map((a) => a.id)).toEqual([
      'de-pater-2014', 'mueller-2018', 'mueller-2020a', 'mueller-2020b', 'zeta-2019',
    ]);
  });

  it('liefert die zitierten Katalogeinträge sortiert und übergeht Unbekanntes', () => {
    expect(zitierteArbeiten(parseMarkdown(MD)).map((a) => a.id)).toEqual([
      'de-pater-2014', 'mueller-2020a', 'mueller-2020b', 'zeta-2019',
    ]);
  });
});
```

- [ ] **Schritt 2: `src/ui/info/Literaturkarten.test.tsx` schreiben**

```tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Literaturkarten } from './Literaturkarten';
import type { Publikation } from '../../data/literatur';
import { setSprache } from '../i18n';

afterEach(() => { setSprache('de'); });

/** Erfundene Testdaten. */
const VOLL: Publikation = {
  id: 'muster-2020a', autoren: ['Muster, A.', 'de Beispiel, B.'], etAl: true, jahr: 2020,
  titel: 'Erfundene Arbeit', erschienen: 'Testzeitschrift 1, 1',
  doi: '10.0000/test.1', arxiv: '2001.00001', bibcode: '2020A&A...1....1M',
};
const PREPRINT: Publikation = {
  id: 'beispiel-2021', autoren: ['Beispiel, B.'], etAl: false, jahr: 2021,
  titel: 'Nur als Preprint', erschienen: 'arXiv', arxiv: '2101.00002',
};

describe('Literaturkarten', () => {
  it('zeigt nichts ohne zitierte Arbeiten', () => {
    const { container } = render(<Literaturkarten arbeiten={[]} hervorgehoben={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('zeigt Autoren, Jahr, Titel, Erscheinungsort und getrennte Links im neuen Tab', () => {
    render(<Literaturkarten arbeiten={[VOLL]} hervorgehoben={null} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Literatur' })).toBeTruthy();
    expect(screen.getByText('Muster, A., de Beispiel, B. et al. (2020a)')).toBeTruthy();
    expect(screen.getByText('Erfundene Arbeit')).toBeTruthy();
    expect(screen.getByText('Testzeitschrift 1, 1')).toBeTruthy();
    expect((screen.getByRole('link', { name: 'DOI' }) as HTMLAnchorElement).href).toBe('https://doi.org/10.0000/test.1');
    expect((screen.getByRole('link', { name: 'arXiv (frei)' }) as HTMLAnchorElement).href).toBe('https://arxiv.org/abs/2001.00001');
    const ads = screen.getByRole('link', { name: 'ADS' }) as HTMLAnchorElement;
    expect(ads.href).toBe('https://ui.adsabs.harvard.edu/abs/2020A%26A...1....1M/abstract');
    expect(ads.target).toBe('_blank');
    expect(ads.rel).toContain('noopener');
    expect(screen.queryByText(/Preprint/)).toBeNull();
  });

  it('kennzeichnet Preprints und hebt die gewählte Arbeit hervor', () => {
    const { container } = render(<Literaturkarten arbeiten={[VOLL, PREPRINT]} hervorgehoben="literatur:beispiel-2021" />);
    expect(screen.getByText('arXiv · Preprint')).toBeTruthy();
    expect(container.querySelector('[data-literatur="beispiel-2021"]')?.className).toContain('border-sky-300');
    expect(container.querySelector('[data-literatur="muster-2020a"]')?.className).not.toContain('border-sky-300');
  });

  it('beschriftet auf Englisch', () => {
    setSprache('en');
    render(<Literaturkarten arbeiten={[VOLL]} hervorgehoben={null} />);
    expect(screen.getByRole('heading', { level: 3, name: 'References' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'arXiv (open access)' })).toBeTruthy();
  });
});
```

- [ ] **Schritt 3: `src/ui/info/InfoPanel.literatur.test.tsx` schreiben**

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoPanel } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen } from '../kamerafahrt';
import { ladeMitAusweich } from '../../data/texte';

const { ARBEIT } = vi.hoisted(() => ({
  ARBEIT: {
    id: 'muster-2020', autoren: ['Muster, A.'], etAl: false, jahr: 2020,
    titel: 'Erfundene Arbeit für Tests', erschienen: 'Testzeitschrift 1, 1', doi: '10.0000/test.1',
  },
}));

vi.mock('../../data/literatur', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/literatur')>();
  return { ...echt, LITERATUR: [ARBEIT], publikationFinden: (id: string) => (id === ARBEIT.id ? ARBEIT : undefined) };
});
vi.mock('../../data/texte', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/texte')>();
  return { ...echt, ladeMitAusweich: vi.fn() };
});

const TEXT = '# Erde\n\nGemessen von [Muster 2020](literatur:muster-2020).';

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  useStore.getState().setCamera({ targetId: 'earth' });
  useStore.getState().setInfo({ niveau: 'hochschule' });
  setSprache('de');
});

describe('InfoPanel mit Literatur', () => {
  it('zeigt zu einem Hochschultext die zitierten Arbeiten und hebt sie beim Klick hervor', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue({ text: TEXT, niveau: 'hochschule', sprache: 'de' });
    const { container } = render(<InfoPanel />);
    const zitat = await screen.findByRole('link', { name: 'Muster 2020' });
    expect(screen.getByRole('heading', { level: 3, name: 'Literatur' })).toBeTruthy();
    fireEvent.click(zitat);
    expect(container.querySelector('[data-literatur="muster-2020"]')?.className).toContain('border-sky-300');
  });

  it('zeigt zum Gymnasialtext als Ersatz keine Literaturkarten', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue({ text: TEXT, niveau: 'gymnasium', sprache: 'de' });
    render(<InfoPanel />);
    expect(await screen.findByText(/Der Hochschultext folgt/)).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 3, name: 'Literatur' })).toBeNull();
  });
});
```

- [ ] **Schritt 4: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/ui/info/zitate.test.ts src/ui/info/Literaturkarten.test.tsx src/ui/info/InfoPanel.literatur.test.tsx`
Expected: FAIL (Module fehlen).

- [ ] **Schritt 5: `src/ui/info/zitate.ts` schreiben**

```ts
import type { Block, Inline } from './markdownParser';
import { erstautorNachname, jahrMitSuffix, publikationFinden } from '../../data/literatur';
import type { Publikation } from '../../data/literatur';

const PRAEFIX = 'literatur:';

function sammeln(kinder: readonly Inline[], ziel: string[]): void {
  for (const k of kinder) {
    if (k.typ === 'link' && k.ziel.startsWith(PRAEFIX)) ziel.push(k.ziel.slice(PRAEFIX.length));
    if (k.typ === 'fett' || k.typ === 'kursiv' || k.typ === 'link') sammeln(k.kinder, ziel);
  }
}

/** Kennungen aller Zitate in Reihenfolge des ersten Auftretens, ohne Doppelte. */
export function zitierteKennungen(bloecke: readonly Block[]): string[] {
  const ids: string[] = [];
  for (const b of bloecke) {
    switch (b.typ) {
      case 'ueberschrift':
      case 'absatz':
        sammeln(b.kinder, ids);
        break;
      case 'liste':
        for (const punkt of b.punkte) sammeln(punkt, ids);
        break;
      case 'tabelle':
        for (const zeile of [b.kopf, ...b.zeilen]) for (const zelle of zeile) sammeln(zelle, ids);
        break;
      case 'formel':
        break;
    }
  }
  return [...new Set(ids)];
}

/** Alphabetisch nach Erstautor (ohne Rücksicht auf Groß-/Kleinschreibung und Akzente), dann Jahr, dann Suffix. */
export function sortiereArbeiten(arbeiten: readonly Publikation[]): Publikation[] {
  return [...arbeiten].sort((a, b) =>
    erstautorNachname(a).localeCompare(erstautorNachname(b), undefined, { sensitivity: 'base' })
    || a.jahr - b.jahr
    || jahrMitSuffix(a).localeCompare(jahrMitSuffix(b)));
}

/**
 * Die Arbeiten, die ein Text zitiert (Entwurf 4d §4.3). Abgeleitet aus dem
 * Text statt aus einem Feld im Katalog, damit nichts doppelt gepflegt wird.
 * Unbekannte Kennungen fallen weg; der Dateitest verhindert sie.
 */
export function zitierteArbeiten(bloecke: readonly Block[]): Publikation[] {
  return sortiereArbeiten(
    zitierteKennungen(bloecke).flatMap((id) => {
      const p = publikationFinden(id);
      return p === undefined ? [] : [p];
    }),
  );
}
```

- [ ] **Schritt 6: `src/ui/info/Literaturkarten.tsx` schreiben**

```tsx
import { useEffect, useRef } from 'react';
import { adsAdresse, arxivAdresse, autorenzeile, doiAdresse, istPreprint, jahrMitSuffix } from '../../data/literatur';
import type { Publikation } from '../../data/literatur';
import { t } from '../i18n';

interface Props {
  /** Die im Text zitierten Arbeiten, schon sortiert (zitate.ts). */
  arbeiten: readonly Publikation[];
  /** Schlüssel der hervorgehobenen Karte, etwa 'literatur:iess-2019'. */
  hervorgehoben: string | null;
}

const PRAEFIX = 'literatur:';
const LINK = 'text-sky-300 underline decoration-sky-300/50 underline-offset-2 hover:text-sky-200';

/**
 * Literaturkarten unter den Quellenkarten (Entwurf 4d §4.3): nur zu einem
 * Hochschultext und nur mit zitierten Arbeiten. Jeder Link öffnet im neuen
 * Tab, nichts wird eingebettet.
 */
export function Literaturkarten({ arbeiten, hervorgehoben }: Props): React.JSX.Element | null {
  const karten = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    if (hervorgehoben === null || !hervorgehoben.startsWith(PRAEFIX)) return;
    // jsdom kennt scrollIntoView nicht; im Browser ist es immer da.
    karten.current.get(hervorgehoben.slice(PRAEFIX.length))?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [hervorgehoben]);

  if (arbeiten.length === 0) return null;

  const link = (href: string, schluessel: string): React.JSX.Element => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>{t(schluessel)}</a>
  );

  return (
    <section className="mt-2">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">{t('quelle.art.literatur')}</h3>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {arbeiten.map((p) => (
          <li key={p.id}>
            <article
              ref={(el) => {
                if (el === null) karten.current.delete(p.id);
                else karten.current.set(p.id, el);
              }}
              data-literatur={p.id}
              className={`rounded border px-2 py-1 text-xs transition-colors ${
                hervorgehoben === `${PRAEFIX}${p.id}` ? 'border-sky-300/80 bg-sky-400/20' : 'border-white/15'
              }`}
            >
              <p className="m-0">{`${autorenzeile(p)} (${jahrMitSuffix(p)})`}</p>
              <p className="m-0 font-medium">{p.titel}</p>
              <p className="m-0 opacity-70">{istPreprint(p) ? `${p.erschienen} · ${t('literatur.preprint')}` : p.erschienen}</p>
              <p className="m-0 mt-0.5 flex flex-wrap gap-x-3">
                {p.doi !== undefined ? link(doiAdresse(p.doi), 'literatur.doi') : null}
                {p.arxiv !== undefined ? link(arxivAdresse(p.arxiv), 'literatur.arxiv') : null}
                {p.bibcode !== undefined ? link(adsAdresse(p.bibcode), 'literatur.ads') : null}
                {p.url !== undefined ? link(p.url, 'literatur.seite') : null}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Schritt 7: Sprachschlüssel**

`src/ui/i18n/de.ts`, nach `'quelle.art.fachartikel': 'Fachliches',`:

```ts
  'quelle.art.literatur': 'Literatur',
  'literatur.doi': 'DOI',
  'literatur.arxiv': 'arXiv (frei)',
  'literatur.ads': 'ADS',
  'literatur.seite': 'Seite',
  'literatur.preprint': 'Preprint',
```

`src/ui/i18n/en.ts`, an derselben Stelle:

```ts
  'quelle.art.literatur': 'References',
  'literatur.doi': 'DOI',
  'literatur.arxiv': 'arXiv (open access)',
  'literatur.ads': 'ADS',
  'literatur.seite': 'Website',
  'literatur.preprint': 'Preprint',
```

`src/ui/i18n/i18n.test.ts`: In `GLEICH_ERLAUBT` nach `'time.pause',` ergänzen: `'literatur.doi', 'literatur.ads', 'literatur.preprint',`.

- [ ] **Schritt 8: `src/ui/info/InfoPanel.tsx` einbinden**

Importe ergänzen:

```tsx
import { Literaturkarten } from './Literaturkarten';
import { zitierteArbeiten } from './zitate';
```

Nach der Zeile `const text = geladen?.text ?? null;` einfügen:

```tsx
  // Literaturkarten nur zu einem echten Hochschultext, nicht zum
  // Gymnasialtext als Ersatz (Entwurf 4d §4.3). Wie der Textkörper bleiben
  // sie bis zum frischen Stand stehen.
  const arbeiten = useMemo(
    () => (geladen !== null && geladen.niveau === 'hochschule' ? zitierteArbeiten(parseMarkdown(geladen.text)) : []),
    [geladen],
  );
```

Nach `<Quellenkarten kennung={schluessel} hervorgehoben={hervorgehoben} />` einfügen:

```tsx
          <Literaturkarten arbeiten={arbeiten} hervorgehoben={hervorgehoben} />
```

- [ ] **Schritt 9: Tests, Typcheck, Commit**

Run: `npx vitest run src/ui` → PASS (neu: 3 in `zitate.test.ts`, 4 in `Literaturkarten.test.tsx`, 2 in `InfoPanel.literatur.test.tsx`).
Run: `npx tsc --noEmit -p tsconfig.json` → keine Ausgabe.

```bash
git add src/ui/info/zitate.ts src/ui/info/zitate.test.ts src/ui/info/Literaturkarten.tsx src/ui/info/Literaturkarten.test.tsx src/ui/info/InfoPanel.literatur.test.tsx src/ui/info/InfoPanel.tsx src/ui/i18n/de.ts src/ui/i18n/en.ts src/ui/i18n/i18n.test.ts
git commit -m "Infopanel: Literaturkarten zu Hochschultexten"
```

---

### Task 6: Prüfskript für den Literaturkatalog

**Dateien:**
- Erstellen: `scripts/literaturVergleich.ts`, `scripts/literaturVergleich.test.ts`, `scripts/pruefe-literatur.ts`
- Ändern: `package.json` (Skript `literatur:pruefen`)

**Schnittstellen:**
- Konsumiert: `LITERATUR`, `Publikation` aus `src/data/literatur.ts` (Task 4), mit Dateiendung importiert.
- Produziert: `npm run literatur:pruefen [-- --nur id,id]`, Exit-Code 1 bei mindestens einem Fehler. Task 10 bis 13 rufen es auf.

- [ ] **Schritt 1: `scripts/literaturVergleich.test.ts` schreiben**

```ts
import { describe, expect, it } from 'vitest';
import {
  arxivEintragLesen, auswahl, crossrefJahre, jahrUrteil, normalisiere, pruefeArxiv, pruefeCrossref, wortanteil,
} from './literaturVergleich.ts';
import type { Publikation } from '../src/data/literatur.ts';

/** Erfundene Testdaten. */
const P: Publikation = {
  id: 'mueller-2019', autoren: ['Müller, A.'], etAl: true, jahr: 2019,
  titel: 'Measurement and implications of a gravity field', erschienen: 'Test 1, 1', doi: '10.0000/x',
};
const WERK = {
  title: ['Measurement and implications of a <i>gravity</i> field'],
  author: [{ family: 'Müller' }, { family: 'Beispiel' }],
  'published-print': { 'date-parts': [[2019, 6, 14]] },
  issued: { 'date-parts': [[2019]] },
};

describe('normalisiere und wortanteil', () => {
  it('entfernt Auszeichnungen, Diakritika, Satzzeichen und Großschreibung', () => {
    expect(normalisiere('Saturn’s <i>Gravity</i> Field: Müller')).toBe('saturn s gravity field muller');
  });

  it('misst den Anteil gemeinsamer Wörter bezogen auf beide Titel', () => {
    expect(wortanteil('Measurement of Saturn', 'measurement of saturn')).toBe(1);
    expect(wortanteil('A B C D', 'a b c')).toBe(0.75);
    expect(wortanteil('', 'x')).toBe(0);
  });
});

describe('Jahre', () => {
  it('liest Druck-, Online- und Ausgabejahr aus Crossref', () => {
    expect(crossrefJahre(WERK)).toEqual([2019, 2019]);
    expect(crossrefJahre({})).toEqual([]);
  });

  it('urteilt gleich ok, um eins Warnung, sonst Fehler', () => {
    expect(jahrUrteil(2019, [2019, 2020])).toBe('ok');
    expect(jahrUrteil(2019, [2020])).toBe('warnung');
    expect(jahrUrteil(2019, [2021, 2017])).toBe('fehler');
    expect(jahrUrteil(2019, [])).toBe('fehler');
  });
});

describe('pruefeCrossref', () => {
  it('bestätigt Erstautor, Jahr und Titel', () => {
    expect(pruefeCrossref(P, WERK)).toEqual([
      { id: 'mueller-2019', pruefung: 'crossref', urteil: 'ok', text: 'Erstautor, Jahr und Titel stimmen' },
    ]);
  });

  it('meldet abweichenden Erstautor und Titel als Fehler, Jahr um eins als Warnung', () => {
    const befunde = pruefeCrossref(P, {
      ...WERK, author: [{ family: 'Mayer' }], title: ['Something else entirely'], 'published-print': { 'date-parts': [[2020]] }, issued: { 'date-parts': [[2020]] },
    });
    expect(befunde.map((b) => b.urteil)).toEqual(['fehler', 'warnung', 'fehler']);
    expect(befunde[0]?.text).toContain('Mayer');
  });
});

describe('arXiv', () => {
  const XML = [
    '<feed><title>arXiv Query: id_list=2001.00001</title>',
    '<entry><id>http://arxiv.org/abs/2001.00001v1</id><published>2020-01-02T00:00:00Z</published>',
    '<title>Measurement and implications\n  of a gravity field</title>',
    '<author><name>Anna Müller</name></author><author><name>B. Beispiel</name></author></entry></feed>',
  ].join('');

  it('liest Titel, Autoren und Jahr des ersten Eintrags, nicht den Titel des Feeds', () => {
    expect(arxivEintragLesen(XML)).toEqual({
      titel: 'Measurement and implications of a gravity field', autoren: ['Anna Müller', 'B. Beispiel'], jahr: 2020,
    });
    expect(arxivEintragLesen('<feed><title>leer</title></feed>')).toBeNull();
    expect(arxivEintragLesen('<feed><entry><title>Error</title></entry></feed>')).toBeNull();
  });

  it('prüft Erstautor und Titel; abweichender Titel ist bei Einträgen mit DOI nur eine Warnung', () => {
    const eintrag = arxivEintragLesen(XML);
    expect(pruefeArxiv({ ...P, arxiv: '2001.00001' }, eintrag).map((b) => b.urteil)).toEqual(['ok']);
    const anders = { titel: 'A different preprint title here', autoren: ['Anna Müller'], jahr: 2020 };
    expect(pruefeArxiv({ ...P, arxiv: '2001.00001' }, anders).map((b) => b.urteil)).toEqual(['warnung']);
    const preprint: Publikation = { ...P, arxiv: '2001.00001', doi: undefined };
    expect(pruefeArxiv(preprint, anders).map((b) => b.urteil)).toEqual(['fehler']);
    expect(pruefeArxiv({ ...P, arxiv: '2001.00001' }, { ...anders, titel: P.titel, autoren: ['Hans Mayer'] }).map((b) => b.urteil)).toEqual(['fehler']);
    expect(pruefeArxiv({ ...P, arxiv: '2001.00001' }, null)).toEqual([
      { id: 'mueller-2019', pruefung: 'arxiv', urteil: 'fehler', text: 'arXiv 2001.00001 nicht gefunden' },
    ]);
  });
});

describe('auswahl', () => {
  const a = { ...P, id: 'a-2019' };
  const b = { ...P, id: 'b-2020', jahr: 2020 };
  const c = { ...P, id: 'c-2021', jahr: 2021 };

  it('nimmt ohne --nur den ganzen Katalog, sonst die genannten Einträge in Katalogreihenfolge', () => {
    expect(auswahl([], [a, b, c])).toEqual([a, b, c]);
    expect(auswahl(['--nur', 'c-2021, a-2019'], [a, b, c])).toEqual([a, c]);
  });

  it('wirft bei unbekannten Kennungen', () => {
    expect(() => auswahl(['--nur', 'x-1999'], [a, b, c])).toThrow('Unbekannte Kennungen: x-1999');
  });
});
```

- [ ] **Schritt 2: Test laufen lassen, er scheitert**

Run: `npx vitest run scripts/literaturVergleich.test.ts`
Expected: FAIL (Modul fehlt).

- [ ] **Schritt 3: `scripts/literaturVergleich.ts` schreiben**

```ts
/**
 * Reine Vergleichsfunktionen des Literatur-Prüfskripts (Entwurf 4d §4.5).
 * Ohne Netz und ohne Node-APIs, damit sie in npm test laufen; der Abruf
 * steht in pruefe-literatur.ts.
 */
import type { Publikation } from '../src/data/literatur.ts';

export type Urteil = 'ok' | 'warnung' | 'fehler';

export interface Befund {
  id: string;
  pruefung: 'crossref' | 'arxiv' | 'url';
  urteil: Urteil;
  text: string;
}

/** Kleinbuchstaben ohne Auszeichnungen, Diakritika und Satzzeichen, Wörter durch ein Leerzeichen getrennt. */
export function normalisiere(s: string): string {
  return s
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Anteil gemeinsamer Wörter, bezogen auf den Titel mit mehr Wörtern (Minimum beider Anteile). */
export function wortanteil(a: string, b: string): number {
  const wa = new Set(normalisiere(a).split(' ').filter((w) => w !== ''));
  const wb = new Set(normalisiere(b).split(' ').filter((w) => w !== ''));
  if (wa.size === 0 || wb.size === 0) return 0;
  let gemeinsam = 0;
  for (const w of wa) if (wb.has(w)) gemeinsam += 1;
  return Math.min(gemeinsam / wa.size, gemeinsam / wb.size);
}

export function jahrUrteil(jahr: number, jahre: readonly number[]): Urteil {
  if (jahre.length === 0) return 'fehler';
  const abstand = Math.min(...jahre.map((j) => Math.abs(j - jahr)));
  return abstand === 0 ? 'ok' : abstand === 1 ? 'warnung' : 'fehler';
}

export const nachnameVon = (autor: string): string => (autor.split(',')[0] ?? '').trim();

/** Ausschnitt eines Crossref-Datensatzes (message von /works/<doi>). */
export interface CrossrefWerk {
  title?: string[];
  author?: { family?: string; name?: string }[];
  'published-print'?: { 'date-parts'?: number[][] };
  'published-online'?: { 'date-parts'?: number[][] };
  issued?: { 'date-parts'?: number[][] };
}

export function crossrefJahre(w: CrossrefWerk): number[] {
  return [w['published-print'], w['published-online'], w.issued]
    .map((d) => d?.['date-parts']?.[0]?.[0])
    .filter((j): j is number => typeof j === 'number');
}

const MINDESTANTEIL = 0.8;

export function pruefeCrossref(p: Publikation, w: CrossrefWerk): Befund[] {
  const befunde: Befund[] = [];
  const melde = (urteil: Urteil, text: string): void => { befunde.push({ id: p.id, pruefung: 'crossref', urteil, text }); };
  const katalogAutor = p.autoren[0] ?? '';
  const erster = w.author?.[0];
  const family = erster?.family ?? erster?.name ?? '';
  if (normalisiere(family) !== normalisiere(nachnameVon(katalogAutor))) {
    melde('fehler', `Erstautor bei Crossref „${family}", im Katalog „${katalogAutor}"`);
  }
  const jahre = crossrefJahre(w);
  const jahr = jahrUrteil(p.jahr, jahre);
  if (jahr !== 'ok') melde(jahr, `Jahr bei Crossref ${jahre.length > 0 ? jahre.join('/') : 'fehlt'}, im Katalog ${p.jahr}`);
  const titel = w.title?.[0] ?? '';
  const anteil = wortanteil(p.titel, titel);
  if (anteil < MINDESTANTEIL) melde('fehler', `Titel stimmt zu ${Math.round(anteil * 100)} % überein: „${titel}"`);
  if (befunde.length === 0) melde('ok', 'Erstautor, Jahr und Titel stimmen');
  return befunde;
}

export interface ArxivEintrag { titel: string; autoren: string[]; jahr: number | null }

/** Liest den ersten <entry> einer Antwort der arXiv-API (Atom); der Titel des Feeds zählt nicht. */
export function arxivEintragLesen(xml: string): ArxivEintrag | null {
  const eintrag = /<entry>([\s\S]*?)<\/entry>/.exec(xml)?.[1];
  if (eintrag === undefined) return null;
  const titel = /<title>([\s\S]*?)<\/title>/.exec(eintrag)?.[1]?.replace(/\s+/g, ' ').trim();
  if (titel === undefined || titel === 'Error') return null;
  const autoren = [...eintrag.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => (m[1] ?? '').trim());
  const jahr = /<published>(\d{4})/.exec(eintrag)?.[1];
  return { titel, autoren, jahr: jahr === undefined ? null : Number(jahr) };
}

/**
 * Prüft Erstautor und Titel gegen arXiv. Veröffentlichte Fassungen tragen
 * oft einen anderen Titel als der Preprint: Hat der Eintrag eine DOI, ist
 * ein abweichender Titel deshalb nur eine Warnung (die DOI-Prüfung sichert
 * den Titel), ohne DOI ein Fehler.
 */
export function pruefeArxiv(p: Publikation, e: ArxivEintrag | null): Befund[] {
  const melde = (urteil: Urteil, text: string): Befund => ({ id: p.id, pruefung: 'arxiv', urteil, text });
  if (e === null) return [melde('fehler', `arXiv ${p.arxiv ?? ''} nicht gefunden`)];
  const befunde: Befund[] = [];
  const nachname = normalisiere(nachnameVon(p.autoren[0] ?? ''));
  const erster = normalisiere(e.autoren[0] ?? '');
  if (nachname === '' || !(erster === nachname || erster.endsWith(` ${nachname}`))) {
    befunde.push(melde('fehler', `Erstautor bei arXiv „${e.autoren[0] ?? ''}", im Katalog „${p.autoren[0] ?? ''}"`));
  }
  const anteil = wortanteil(p.titel, e.titel);
  if (anteil < MINDESTANTEIL) {
    befunde.push(melde(p.doi === undefined ? 'fehler' : 'warnung', `Titel stimmt zu ${Math.round(anteil * 100)} % überein: „${e.titel}"`));
  }
  if (befunde.length === 0) befunde.push(melde('ok', 'Erstautor und Titel stimmen'));
  return befunde;
}

/** Einträge für den Lauf: ohne --nur alle, sonst die genannten in Katalogreihenfolge. */
export function auswahl(argv: readonly string[], katalog: readonly Publikation[]): Publikation[] {
  const stelle = argv.indexOf('--nur');
  if (stelle < 0) return [...katalog];
  const ids = (argv[stelle + 1] ?? '').split(',').map((s) => s.trim()).filter((s) => s !== '');
  const unbekannt = ids.filter((id) => !katalog.some((p) => p.id === id));
  if (unbekannt.length > 0) throw new Error(`Unbekannte Kennungen: ${unbekannt.join(', ')}`);
  return katalog.filter((p) => ids.includes(p.id));
}
```

- [ ] **Schritt 4: Test laufen lassen**

Run: `npx vitest run scripts/literaturVergleich.test.ts`
Expected: PASS, 10 Fälle.

- [ ] **Schritt 5: `scripts/pruefe-literatur.ts` schreiben**

```ts
/**
 * Prüft den Literaturkatalog gegen Crossref und arXiv (Entwurf 4d §4.5).
 *
 * Aufruf aus dem Projektstamm:
 *   npm run literatur:pruefen                          ganzer Katalog
 *   npm run literatur:pruefen -- --nur iess-2019,x     nur diese Einträge
 *
 * Braucht Netz, läuft nur von Hand, nicht in npm test. Abfragen nacheinander
 * mit Pause, ohne E-Mail-Adresse im Abruf. Exit-Code 1 bei mindestens einem
 * Fehler; Warnungen allein ergeben 0. Die Vergleiche stehen getestet in
 * literaturVergleich.ts.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LITERATUR } from '../src/data/literatur.ts';
import type { Publikation } from '../src/data/literatur.ts';
import { arxivEintragLesen, auswahl, pruefeArxiv, pruefeCrossref } from './literaturVergleich.ts';
import type { Befund, CrossrefWerk, Urteil } from './literaturVergleich.ts';

const KOPF = { 'User-Agent': 'Orrery-Literaturpruefung' };
const PAUSE_MS = 200;

const warte = (ms: number): Promise<void> => new Promise((fertig) => { setTimeout(fertig, ms); });

async function pruefe(p: Publikation): Promise<Befund[]> {
  const befunde: Befund[] = [];
  const fehler = (pruefung: Befund['pruefung'], text: string): Befund => ({ id: p.id, pruefung, urteil: 'fehler', text });

  if (p.doi !== undefined) {
    try {
      const antwort = await fetch(`https://api.crossref.org/works/${encodeURIComponent(p.doi)}`, { headers: KOPF });
      if (!antwort.ok) befunde.push(fehler('crossref', `Crossref antwortet ${antwort.status}`));
      else befunde.push(...pruefeCrossref(p, ((await antwort.json()) as { message: CrossrefWerk }).message));
    } catch (e) {
      befunde.push(fehler('crossref', `nicht erreichbar: ${String(e)}`));
    }
    await warte(PAUSE_MS);
  }

  if (p.arxiv !== undefined) {
    try {
      const antwort = await fetch(`https://export.arxiv.org/api/query?id_list=${encodeURIComponent(p.arxiv)}`, { headers: KOPF });
      if (!antwort.ok) befunde.push(fehler('arxiv', `arXiv antwortet ${antwort.status}`));
      else befunde.push(...pruefeArxiv(p, arxivEintragLesen(await antwort.text())));
    } catch (e) {
      befunde.push(fehler('arxiv', `nicht erreichbar: ${String(e)}`));
    }
    await warte(PAUSE_MS);
  }

  if (p.doi === undefined && p.arxiv === undefined && p.url !== undefined) {
    try {
      let antwort = await fetch(p.url, { method: 'HEAD', headers: KOPF, redirect: 'follow' });
      if (antwort.status === 405) antwort = await fetch(p.url, { headers: KOPF, redirect: 'follow' });
      befunde.push({ id: p.id, pruefung: 'url', urteil: antwort.status < 400 ? 'ok' : 'fehler', text: `HTTP ${antwort.status}` });
    } catch (e) {
      befunde.push(fehler('url', `nicht erreichbar: ${String(e)}`));
    }
    await warte(PAUSE_MS);
  }
  return befunde;
}

async function hauptlauf(): Promise<void> {
  const liste = auswahl(process.argv.slice(2), LITERATUR);
  console.log(`Prüfe ${liste.length} von ${LITERATUR.length} Einträgen`);
  const alle: Befund[] = [];
  for (const p of liste) {
    for (const b of await pruefe(p)) {
      console.log(`${b.urteil.padEnd(8)} ${b.pruefung.padEnd(9)} ${b.id.padEnd(28)} ${b.text}`);
      alle.push(b);
    }
  }
  const zahl = (u: Urteil): number => alle.filter((b) => b.urteil === u).length;
  console.log(`\n${zahl('ok')} ok, ${zahl('warnung')} Warnungen, ${zahl('fehler')} Fehler`);
  if (zahl('fehler') > 0) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  hauptlauf().catch((fehler: unknown) => {
    console.error(fehler instanceof Error ? fehler.message : fehler);
    process.exitCode = 1;
  });
}
```

- [ ] **Schritt 6: Skript in `package.json` eintragen und ausprobieren**

In `"scripts"` nach `"deploy:trocken": …,` einfügen:

```json
    "literatur:pruefen": "node scripts/pruefe-literatur.ts",
```

Run: `npm run literatur:pruefen`
Expected: `Prüfe 0 von 0 Einträgen`, danach `0 ok, 0 Warnungen, 0 Fehler`, Exit-Code 0.

Run: `npm run literatur:pruefen -- --nur x-1999; echo "exit=$?"`
Expected: `Unbekannte Kennungen: x-1999`, `exit=1`.

Funktionsprobe gegen das Netz (nicht committen): In `src/data/literatur.ts` vorübergehend diesen Eintrag in `LITERATUR` setzen, `npm run literatur:pruefen` laufen lassen, Ausgabe in den Bericht, danach den Eintrag wieder entfernen (`git diff src/data/literatur.ts` muss leer sein):

```ts
  {
    id: 'iess-2019', autoren: ['Iess, L.', 'Militzer, B.', 'Kaspi, Y.'], etAl: true, jahr: 2019,
    titel: 'Measurement and implications of Saturn’s gravity field and ring mass',
    erschienen: 'Science 364, eaat2965', doi: '10.1126/science.aat2965',
  },
```

Expected: `ok       crossref  iess-2019 … Erstautor, Jahr und Titel stimmen`, Exit-Code 0. (Crossref lieferte am 17.09.2026 genau diese Angaben; bei der Planung geprüft.)

- [ ] **Schritt 7: Lint, Tests, Commit**

Run: `npx eslint scripts` → keine Befunde. `npx vitest run scripts` → PASS.

```bash
git add scripts/literaturVergleich.ts scripts/literaturVergleich.test.ts scripts/pruefe-literatur.ts package.json
git commit -m "Prüfskript: Literaturkatalog gegen Crossref und arXiv abgleichen"
```

---

### Task 7: Sechs Fachthemen mit Titeln und Quellenkarten

**Dateien:**
- Ändern: `src/data/themen.ts`, `src/data/themen.test.ts`, `src/data/quellen.ts`, `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts`

**Schnittstellen:**
- Konsumiert: nichts Neues.
- Produziert: Themen `gezeiten`, `resonanzen`, `bezugssysteme`, `innerer-aufbau`, `photometrie`, `entstehung` (Entwurf §5.3); Titelschlüssel `thema.<id>.title`; 14 neue Quellen mit `fuer: ['thema:<id>']`. Texte zu diesen Themen gibt es erst ab 4d-2; bis dahin darf kein Text auf sie verweisen.

- [ ] **Schritt 1: Test ändern — `src/data/themen.test.ts`**

Den Fall „kennt drei Niveaus und erkennt Themen" ersetzen:

```ts
  it('kennt drei Niveaus und erkennt Themen, auch die Fachthemen der Hochschule', () => {
    expect(NIVEAUS).toEqual(['grundschule', 'gymnasium', 'hochschule']);
    expect(istThema('modell')).toBe(true);
    expect(istThema('sonnensystem')).toBe(true);
    for (const id of ['gezeiten', 'resonanzen', 'bezugssysteme', 'innerer-aufbau', 'photometrie', 'entstehung']) {
      expect(istThema(id), id).toBe(true);
    }
    expect(THEMEN).toHaveLength(15);
    expect(istThema('gibt-es-nicht')).toBe(false);
  });
```

- [ ] **Schritt 2: Test laufen lassen, er scheitert**

Run: `npx vitest run src/data/themen.test.ts`
Expected: FAIL (`gezeiten` unbekannt).

- [ ] **Schritt 3: Katalog, Titel, Quellen**

`src/data/themen.ts`: In `THEMEN` nach dem Eintrag `sonnensystem` einfügen:

```ts
  // Fachthemen nur auf Hochschulniveau (Entwurf 4d §5.3): Körpertexte
  // verweisen auf sie, statt gemeinsame Physik zu wiederholen.
  { id: 'gezeiten', titleKey: 'thema.gezeiten.title' },
  { id: 'resonanzen', titleKey: 'thema.resonanzen.title' },
  { id: 'bezugssysteme', titleKey: 'thema.bezugssysteme.title' },
  { id: 'innerer-aufbau', titleKey: 'thema.innerer-aufbau.title' },
  { id: 'photometrie', titleKey: 'thema.photometrie.title' },
  { id: 'entstehung', titleKey: 'thema.entstehung.title' },
```

`src/ui/i18n/de.ts`, nach `'thema.sonnensystem.title': 'Das Sonnensystem',`:

```ts
  'thema.gezeiten.title': 'Gezeiten und Roche-Grenze',
  'thema.resonanzen.title': 'Bahnresonanzen',
  'thema.bezugssysteme.title': 'Bezugssysteme und Zeitskalen',
  'thema.innerer-aufbau.title': 'Innerer Aufbau aus Schwerefeld und Rotation',
  'thema.photometrie.title': 'Albedo und Helligkeit',
  'thema.entstehung.title': 'Entstehung des Sonnensystems',
```

`src/ui/i18n/en.ts`, an derselben Stelle:

```ts
  'thema.gezeiten.title': 'Tides and the Roche limit',
  'thema.resonanzen.title': 'Orbital resonances',
  'thema.bezugssysteme.title': 'Reference systems and time scales',
  'thema.innerer-aufbau.title': 'Interior structure from gravity and rotation',
  'thema.photometrie.title': 'Albedo and brightness',
  'thema.entstehung.title': 'Formation of the Solar System',
```

`src/data/quellen.ts`: Vor der schließenden `];` von `QUELLEN` (nach dem Eintrag `jpl-hauptguertel`) einfügen. Alle Adressen antworteten am 17.09.2026 mit HTTP 200; die im Entwurf als Beispiel genannten IERS-Seiten antworteten 404 und fehlen deshalb (Ruling 8).

```ts
  // Fachthemen der Hochschule (Entwurf 4d §5.3)
  {
    id: 'wikipedia-de-roche-grenze',
    titel: { de: 'Roche-Grenze (Wikipedia)', en: 'Roche limit (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Roche-Grenze',
    fuer: ['thema:gezeiten'],
  },
  {
    id: 'wikipedia-en-roche-limit',
    titel: { de: 'Roche-Grenze (englische Wikipedia)', en: 'Roche limit (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Roche_limit',
    fuer: ['thema:gezeiten'],
  },
  {
    id: 'wikipedia-en-tidal-heating',
    titel: { de: 'Gezeitenheizung (englische Wikipedia)', en: 'Tidal heating (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Tidal_heating',
    fuer: ['thema:gezeiten'],
  },
  {
    id: 'wikipedia-de-bahnresonanz',
    titel: { de: 'Bahnresonanz (Wikipedia)', en: 'Orbital resonance (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Bahnresonanz',
    fuer: ['thema:resonanzen'],
  },
  {
    id: 'wikipedia-en-orbital-resonance',
    titel: { de: 'Bahnresonanz (englische Wikipedia)', en: 'Orbital resonance (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Orbital_resonance',
    fuer: ['thema:resonanzen'],
  },
  {
    id: 'jpl-ephemeriden',
    titel: { de: 'Planetare Ephemeriden (JPL SSD)', en: 'Planetary ephemerides (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'werkzeug',
    url: 'https://ssd.jpl.nasa.gov/planets/eph_export.html',
    fuer: ['thema:bezugssysteme'],
  },
  {
    id: 'wikipedia-de-icrs',
    titel: { de: 'International Celestial Reference System (Wikipedia)', en: 'International Celestial Reference System (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/International_Celestial_Reference_System',
    fuer: ['thema:bezugssysteme'],
  },
  {
    id: 'wikipedia-en-icrs',
    titel: { de: 'International Celestial Reference System (englische Wikipedia)', en: 'International Celestial Reference System (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/International_Celestial_Reference_System',
    fuer: ['thema:bezugssysteme'],
  },
  {
    id: 'wikipedia-de-love-zahlen',
    titel: { de: 'Love-Zahlen (Wikipedia)', en: 'Love numbers (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Love-Zahlen',
    fuer: ['thema:innerer-aufbau', 'thema:gezeiten'],
  },
  {
    id: 'wikipedia-en-moment-of-inertia-factor',
    titel: { de: 'Trägheitsmomentfaktor (englische Wikipedia)', en: 'Moment of inertia factor (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Moment_of_inertia_factor',
    fuer: ['thema:innerer-aufbau'],
  },
  {
    id: 'wikipedia-de-albedo',
    titel: { de: 'Albedo (Wikipedia)', en: 'Albedo (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Albedo',
    fuer: ['thema:photometrie'],
  },
  {
    id: 'wikipedia-en-geometric-albedo',
    titel: { de: 'Geometrische Albedo (englische Wikipedia)', en: 'Geometric albedo (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Geometric_albedo',
    fuer: ['thema:photometrie'],
  },
  {
    id: 'wikipedia-de-entstehung-sonnensystem',
    titel: { de: 'Entstehung des Sonnensystems (Wikipedia)', en: 'Formation of the Solar System (German Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'de', art: 'uebersicht',
    url: 'https://de.wikipedia.org/wiki/Entstehung_des_Sonnensystems',
    fuer: ['thema:entstehung'],
  },
  {
    id: 'wikipedia-en-formation-solar-system',
    titel: { de: 'Entstehung und Entwicklung des Sonnensystems (englische Wikipedia)', en: 'Formation and evolution of the Solar System (Wikipedia)' },
    herausgeber: 'Wikipedia', sprache: 'en', art: 'uebersicht',
    url: 'https://en.wikipedia.org/wiki/Formation_and_evolution_of_the_Solar_System',
    fuer: ['thema:entstehung'],
  },
```

- [ ] **Schritt 4: Adressen prüfen**

Run (Git Bash):

```bash
for u in $(sed -n '/Fachthemen der Hochschule/,/^];/p' src/data/quellen.ts | grep -o "https://[^']*"); do printf '%s %s\n' "$(curl -s -o /dev/null -L --max-time 20 -w '%{http_code}' "$u")" "$u"; done
```

Expected: 14 Zeilen, jede beginnt mit `200`. Weicht eine ab, den Eintrag entfernen, das Thema behält mindestens eine andere Karte; im Bericht nennen.

- [ ] **Schritt 5: Tests, Commit**

Run: `npx vitest run src/data src/ui/i18n src/ui/info/aktuellerText.test.ts` → PASS (der Abdeckungstest in `quellen.test.ts` erfasst die neuen Themen automatisch).

```bash
git add src/data/themen.ts src/data/themen.test.ts src/data/quellen.ts src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Themenkatalog: sechs Fachthemen der Hochschule mit Titeln und Quellenkarten"
```

---

### Task 8: Hinweis „nur Hochschule", Testbeispiele ohne echte Hochschultexte

**Befund (Planung, 17.09.2026):** Drei bestehende Tests benutzen die Erde als Beispiel für „kein Hochschultext": `InfoPanel.test.tsx` („Hochschule ohne Text zeigt den Gymnasialtext mit Hinweis"), `data/texte/index.test.ts` (`textVorhanden('de', 'hochschule', erde)` ist `false`, Ausweich auf den Gymnasialtext) und indirekt `InfoPanel.laden.test.tsx` (erwartet „kein Text"; mit dem neuen Hinweis hinge das Ergebnis davon ab, ob es einen Hochschultext zur Erde gibt). Mit Task 11 entsteht dieser Text, und bis 4d-11 bekommt jeder Körper einen. Diese Tests werden deshalb von echten Dateien gelöst: Das Panel über gemockte Lader, `ladeMitAusweich` über einen einspritzbaren Ladeparameter.

**Dateien:**
- Ändern: `src/data/texte/index.ts`, `src/data/texte/index.test.ts`
- Ändern: `src/ui/info/InfoPanel.tsx`, `src/ui/info/InfoPanel.test.tsx`, `src/ui/info/InfoPanel.laden.test.tsx`
- Erstellen: `src/ui/info/InfoPanel.hinweise.test.tsx`
- Ändern: `src/ui/i18n/de.ts`, `src/ui/i18n/en.ts`

**Schnittstellen:**
- Konsumiert: Thema `gezeiten` (Task 7).
- Produziert: `export type TextLader = (sprache: Sprache, niveau: Niveau, k: TextKennung) => Promise<string | null>`; `ladeMitAusweich(sprache, niveau, k, laden: TextLader = ladeText)`; Sprachschlüssel `info.nurHochschule`.

- [ ] **Schritt 1: `src/data/texte/index.test.ts` umstellen**

Importe ergänzen:

```ts
import type { Sprache } from '../quellen';
import type { Niveau } from '../themen';
```

Nach `const erde = …` einfügen:

```ts
const vulcan = { art: 'objekt', kennung: 'vulcan' } as const;
```

Den Fall „kennt vorhandene Dateien synchron und lädt sie asynchron" ersetzen:

```ts
  it('kennt vorhandene Dateien synchron und lädt sie asynchron', async () => {
    expect(alleTextPfade().length).toBeGreaterThanOrEqual(14);
    expect(textVorhanden('de', 'gymnasium', erde)).toBe(true);
    expect(textVorhanden('de', 'gymnasium', vulcan)).toBe(false);
    const text = await ladeText('de', 'gymnasium', erde);
    expect(text?.startsWith('# ')).toBe(true);
    expect(await ladeText('de', 'gymnasium', vulcan)).toBeNull();
    // Zweiter Aufruf kommt aus dem Speicher und ist dieselbe Zeichenkette.
    expect(await ladeText('de', 'gymnasium', erde)).toBe(text);
  });
```

Den Fall „ladeMitAusweich meldet, welches Niveau und welche Sprache es genommen hat" ersetzen:

```ts
  it('ladeMitAusweich meldet, welches Niveau und welche Sprache es genommen hat', async () => {
    const direkt = await ladeMitAusweich('en', 'grundschule', erde);
    expect(direkt?.sprache).toBe('en');
    expect(direkt?.niveau).toBe('grundschule');
    expect(await ladeMitAusweich('de', 'gymnasium', vulcan)).toBeNull();
  });

  it('ladeMitAusweich nimmt den ersten vorhandenen Kandidaten der Ausweichreihenfolge', async () => {
    // Unabhängig von echten Dateien: Bis Etappe 4d-11 bekommt jeder Körper
    // einen Hochschultext, die Erde schon in 4d-1.
    const vorhanden = new Set(['en/gymnasium', 'de/hochschule']);
    const laden = (s: Sprache, n: Niveau): Promise<string | null> =>
      Promise.resolve(vorhanden.has(`${s}/${n}`) ? `# ${s} ${n}` : null);
    expect(await ladeMitAusweich('en', 'hochschule', erde, laden)).toEqual({ text: '# en gymnasium', niveau: 'gymnasium', sprache: 'en' });
    expect(await ladeMitAusweich('de', 'hochschule', erde, laden)).toEqual({ text: '# de hochschule', niveau: 'hochschule', sprache: 'de' });
    expect(await ladeMitAusweich('de', 'grundschule', erde, laden)).toBeNull();
  });
```

- [ ] **Schritt 2: `src/ui/info/InfoPanel.hinweise.test.tsx` schreiben**

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoPanel } from './InfoPanel';
import { useStore, DEFAULT_STATE } from '../../store';
import { setSprache } from '../i18n';
import { fahrtAbbrechen } from '../kamerafahrt';
import { ladeMitAusweich, textVorhanden } from '../../data/texte';

/**
 * Hinweiszeilen unabhängig von echten Textdateien (Entwurf 4d §5.4): Lader
 * und Vorhandensein sind gemockt, damit die Fälle gültig bleiben, während
 * die Etappen 4d-1 bis 4d-11 Hochschultexte ergänzen.
 */
vi.mock('../../data/texte', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/texte')>();
  return { ...echt, ladeMitAusweich: vi.fn(), textVorhanden: vi.fn(() => false) };
});

beforeEach(() => {
  fahrtAbbrechen();
  useStore.getState().replaceAll(structuredClone(DEFAULT_STATE));
  setSprache('de');
  vi.mocked(textVorhanden).mockImplementation(() => false);
});

describe('InfoPanel, Hinweiszeilen', () => {
  it('Hochschule ohne Hochschultext zeigt den Gymnasialtext mit Hinweis und den vollen Datenblock', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue({ text: '# Erde\n\nGymnasialtext zur Erde.', niveau: 'gymnasium', sprache: 'de' });
    useStore.getState().setCamera({ targetId: 'earth' });
    useStore.getState().setInfo({ niveau: 'hochschule' });
    render(<InfoPanel />);
    expect(await screen.findByText(/Der Hochschultext folgt/)).toBeTruthy();
    expect(screen.getByText('Gymnasialtext zur Erde.')).toBeTruthy();
    expect(screen.getByText('Große Halbachse')).toBeTruthy();
  });

  it('ein Thema, das es nur auf Hochschulniveau gibt, zeigt auf dem Gymnasial-Tab „nur Hochschule"', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue(null);
    vi.mocked(textVorhanden).mockImplementation((_s, niveau) => niveau === 'hochschule');
    useStore.getState().setInfo({ thema: 'gezeiten', niveau: 'gymnasium' });
    render(<InfoPanel />);
    expect(await screen.findByText('Diesen Text gibt es nur auf Hochschulniveau.')).toBeTruthy();
    expect(screen.queryByText('Zu diesem Eintrag gibt es noch keinen Text.')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Gezeiten und Roche-Grenze' })).toBeTruthy();
  });

  it('ohne jeden Text bleibt es bei „kein Text"', async () => {
    vi.mocked(ladeMitAusweich).mockResolvedValue(null);
    useStore.getState().setInfo({ thema: 'gezeiten', niveau: 'grundschule' });
    render(<InfoPanel />);
    expect(await screen.findByText('Zu diesem Eintrag gibt es noch keinen Text.')).toBeTruthy();
    expect(screen.queryByText('Diesen Text gibt es nur auf Hochschulniveau.')).toBeNull();
  });
});
```

- [ ] **Schritt 3: Alten Fall entfernen, Ladetest absichern**

`src/ui/info/InfoPanel.test.tsx`: Den Fall „Hochschule ohne Text zeigt den Gymnasialtext mit Hinweis" vollständig löschen (er steht jetzt in `InfoPanel.hinweise.test.tsx`).

`src/ui/info/InfoPanel.laden.test.tsx`: Im `vi.mock` den Rückgabewert ersetzen:

```ts
  return { ...echt, ladeMitAusweich: vi.fn(() => Promise.reject(new Error('Chunk fehlt'))), textVorhanden: vi.fn(() => false) };
```

- [ ] **Schritt 4: Tests laufen lassen, sie scheitern**

Run: `npx vitest run src/data/texte/index.test.ts src/ui/info/InfoPanel.hinweise.test.tsx`
Expected: FAIL (vierter Parameter wird ignoriert; Hinweis „nur Hochschule" fehlt).

- [ ] **Schritt 5: `src/data/texte/index.ts` — Ladeparameter**

Die Funktion `ladeMitAusweich` samt Kommentar davor ersetzen:

```ts
export interface GeladenerText { text: string; niveau: Niveau; sprache: Sprache }

/** Lädt einen Text oder liefert null; einspritzbar, damit Tests nicht von echten Dateien abhängen. */
export type TextLader = (sprache: Sprache, niveau: Niveau, k: TextKennung) => Promise<string | null>;

export async function ladeMitAusweich(
  sprache: Sprache, niveau: Niveau, k: TextKennung, laden: TextLader = ladeText,
): Promise<GeladenerText | null> {
  for (const [s, n] of ausweichKandidaten(sprache, niveau)) {
    const text = await laden(s, n, k);
    if (text !== null) return { text, niveau: n, sprache: s };
  }
  return null;
}
```

(Die Zeile `export interface GeladenerText …` steht heute schon vor der Funktion; sie bleibt einmal erhalten.)

- [ ] **Schritt 6: `src/ui/info/InfoPanel.tsx` — Hinweis**

Import ändern: `import { ladeMitAusweich } from '../../data/texte';` → `import { ladeMitAusweich, textVorhanden } from '../../data/texte';`

Die Zeile `if (frisch && geladen === null) hinweise.push('info.keinText');` ersetzen:

```tsx
  if (frisch && geladen === null) {
    // Gibt es den Text nur auf Hochschulniveau (Fachthemen, Entwurf 4d §5.4),
    // wäre „kein Text" irreführend.
    const nurHochschule = textVorhanden(language, 'hochschule', kennung) || textVorhanden('de', 'hochschule', kennung);
    hinweise.push(nurHochschule ? 'info.nurHochschule' : 'info.keinText');
  }
```

Den Kommentar darüber („Alle drei Hinweise nur für den frischen Stand …") lassen; er gilt weiter.

`src/ui/i18n/de.ts` nach `'info.keinText': …,`:

```ts
  'info.nurHochschule': 'Diesen Text gibt es nur auf Hochschulniveau.',
```

`src/ui/i18n/en.ts` an derselben Stelle:

```ts
  'info.nurHochschule': 'This text is only available at university level.',
```

- [ ] **Schritt 7: Tests, Typcheck, Commit**

Run: `npx vitest run src/data/texte src/ui` → PASS (neu: 1 in `index.test.ts`, 3 in `InfoPanel.hinweise.test.tsx`; 1 Fall aus `InfoPanel.test.tsx` entfernt).
Run: `npx tsc --noEmit -p tsconfig.json` → keine Ausgabe.

```bash
git add src/data/texte/index.ts src/data/texte/index.test.ts src/ui/info/InfoPanel.tsx src/ui/info/InfoPanel.test.tsx src/ui/info/InfoPanel.laden.test.tsx src/ui/info/InfoPanel.hinweise.test.tsx src/ui/i18n/de.ts src/ui/i18n/en.ts
git commit -m "Infopanel: Hinweis „nur Hochschule", Hinweis-Tests unabhängig von echten Hochschultexten"
```

---

### Task 9: Dateitest für Hochschultexte

**Dateien:**
- Ändern: `src/data/texte/dateien.test.ts` (ganze Datei ersetzen)

**Schnittstellen:**
- Konsumiert: `parseMarkdown`, `inlineText`, `Block`, `Inline` (Task 1); `texNachMathml` (Task 2); `LITERATUR`, `publikationFinden`, `erstautorNachname`, `jahrMitSuffix` (Task 4); `verweisAufloesen` mit `literatur:` (Task 4); `quellenFuer`.
- Produziert: Konstante `HOCHSCHULE_GYMNASIUM_ERSATZ = true` (Etappe 4d-11 setzt sie auf `false`); Prüfungen, an denen Task 10 bis 12 gemessen werden.

**Umfang der Prüfungen (Entwurf §4.4, §5.5):**
- Für **jede** Datei (neu): Formeln übersetzbar und keine kaputte Tabelle; Zitate nur auf Hochschulniveau, nur aus dem Katalog, Linktext mit Erstautor und Jahr. Die HTML-Prüfung ignoriert Formeln (`$a<b$`).
- Nur für **Hochschultexte**: Stand-Zeile; Gliederung bei Körpern und Szenen.
- Sammelfälle: jeder Katalogeintrag zitiert; deutsche und englische Hochschulfassung mit derselben Mehrfachmenge an Zitaten und Formeln (Formeln mit `{,}` → `.` und einfachem Leerraum verglichen).
- „Ziel hat Text im selben Niveau": Hochschultexte dürfen bis 4d-10 auf einen Gymnasialtext ausweichen.

- [ ] **Schritt 1: `src/data/texte/dateien.test.ts` ersetzen**

```ts
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
```

- [ ] **Schritt 2: Test laufen lassen**

Run: `npx vitest run src/data/texte/dateien.test.ts`
Expected: PASS, 2272 Fälle (252 Dateien × 9 + 4 Sammelfälle; vorher 1766).

- [ ] **Schritt 3: Gegenprobe mit absichtlich fehlerhaften Hochschultexten (nicht committen)**

Zwei Probedateien anlegen:

`src/data/texte/de/hochschule/objekt-earth.md`:

```md
# Erde

## Inneres

Kern nach [Muster 2020](literatur:muster-2020), Formel $\foo$ und $a<b$.

| a | b |
|---|---|
| 1 |

## Kenngrößen und Messung

Text.
```

`src/data/texte/en/hochschule/objekt-earth.md`:

```md
# Earth

## Open questions

## In the model

Formula $x^2$.

*As of Septembre 2026*
```

Run: `npx vitest run src/data/texte/dateien.test.ts`
Expected: FAIL mit genau diesen Befunden (Reihenfolge egal):
- `de/hochschule/objekt-earth.md`: „enthält nur auflösbare Verweise" (`literatur:muster-2020`), „hat nur übersetzbare Formeln und gültige Tabellen" (`\foo` und Strichzeilen), „zitiert nur Katalogeinträge …" (fehlt im Katalog), „endet mit der Stand-Zeile …", „folgt der Gliederung seiner Art" (Reihenfolge, Pflichtabschnitte).
- `en/hochschule/objekt-earth.md`: „endet mit der Stand-Zeile …" (Monatsname), sonst grün (Gliederung erfüllt).
- Sammelfall „führt in deutscher und englischer Hochschulfassung dieselben Zitate und Formeln".
- **Nicht** fallen dürfen: „enthält kein HTML" (`$a<b$` ist eine Formel) und die Fälle aller anderen Dateien.

Weicht das Ergebnis ab, zuerst den Test gegen Schritt 1 prüfen. Danach beide Probedateien löschen und bestätigen: `git status --short src/data/texte` zeigt nur `dateien.test.ts`.

- [ ] **Schritt 4: Lint, Commit**

Run: `npx eslint src/data/texte/dateien.test.ts` → keine Befunde.

```bash
git add src/data/texte/dateien.test.ts
git commit -m "Dateitest: Formeln, Tabellen, Zitate, Stand-Zeile, Gliederung und Sprachzwillinge der Hochschultexte"
```

---

## Gemeinsame Vorgaben für Task 10 bis 12 (Pilottexte)

Die Pilottexte stehen **nicht** wörtlich im Plan. Sie entstehen im Task nach Entwurf §6.4 und zeigen Jens Tiefe, Ton und Gliederung, bevor Etappe 4d-2 beginnt. Deshalb gilt Sorgfalt vor Umfang.

**Ablauf je Task**

1. **Code lesen**, bevor recherchiert wird: welche Daten und Verfahren Orrery für die Kennung nutzt (Dateien nennt der Task). Werte aus dem Datenblock für den Abschnitt „Im Modell" im Browser ablesen oder aus `src/ui/info/datenzeilen.ts` und den Datensätzen herleiten.
2. **Recherche** (Entwurf §6.1) mit Websuche und Abruf: Übersichtsartikel, Missionsauswertungen, IAU-/IERS-/JPL-Berichte. Nur zitieren, was im Task geöffnet wurde (mindestens die Zusammenfassung). Die im Task genannten Werke sind **Ausgangspunkte**, keine Vorgaben: Jede Angabe (Autoren, Jahr, Titel, DOI) vor der Verwendung an der Quelle prüfen; nicht auffindbare Werke nicht zitieren.
3. **Belegliste** `docs/belege/hochschule/<art>-<kennung>.md` nach Entwurf §6.2 anlegen, Spalte „Prüfung" leer lassen:

   ```md
   # Belege: <art>-<kennung> (Hochschule)

   | Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
   |---|---|---|---|---|---|
   ```

   Jeder Messwert und jede nicht triviale Aussage eine Zeile; „Beleg" ist `literatur:<id>`, `quelle:<id>` oder „Datenblock/Datensatz: <Datei>".
4. **Katalogeinträge** in `src/data/literatur.ts`, in `LITERATUR` alphabetisch nach Kennung. Autoren in der Form „Nachname, I.", höchstens drei, sonst `etAl: true`. `erschienen` mit Zeitschrift, Band und Seite oder Artikelnummer. DOI immer, wenn es eine gibt; `arxiv` nur, wenn die Arbeit dort frei liegt; `bibcode` nur, wenn auf ADS nachgesehen.
5. `npm run literatur:pruefen -- --nur <neue Kennungen>` → **0 Fehler**. Warnungen in der Belegliste unter der Tabelle begründen (etwa „online 2018, Druck 2019").
6. **Deutscher Text** nach Entwurf §5 (Gliederung, Pflichtabschnitte, Stand-Zeile `*Stand: September 2026*`), danach die **englische Fassung** mit denselben Zitaten und Formeln (`{,}` im Deutschen, `.` im Englischen; Überschriften aus Entwurf §5.1). Formeln nur aus der Teilmenge von Task 2; fehlt ein Befehl, ist das ein eigener Zwischen-Task (Test in `texUebersetzer.test.ts`, eigener Commit), nicht ein Umweg im Text. Argumente von `^`, `_` und `\frac` mit mehr als einem Zeichen immer in `{}`.
7. Verweise: keine auf die sechs Fachthemen (erst ab 4d-2). `objekt:`, `szene:`, `thema:` dürfen auf Kennungen ohne Hochschultext zeigen (Gymnasialtext als Ersatz). Jeder `quelle:`-Verweis braucht eine Karte zur Kennung des Texts (`fuer`).
8. `npx vitest run src/data src/ui/info` → PASS. Wortzahl beider Fassungen im Bericht nennen (`wc -w`).
9. **Commit** von Texten, Belegliste und Katalogeinträgen zusammen.
10. **Fachprüfung** (Entwurf §6.3): Der Controller beauftragt einen Prüfer mit frischem Kontext mit dem folgenden Auftrag. Befunde der Klasse Fehler behebt der Umsetzer gebündelt in einem Nacharbeits-Commit; danach prüft derselbe Prüfer nur die geänderten Stellen erneut. Hinweise gehen ins Ledger.

**Auftrag an die Fachprüfung (wörtlich, Platzhalter ersetzen)**

> Prüfe die Hochschultexte `src/data/texte/de/hochschule/<datei>` und `src/data/texte/en/hochschule/<datei>` mit der Belegliste `docs/belege/hochschule/<datei>` (Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md`, §5 und §6.3). Zielgruppe ist Fachniveau (Master und Forschung). Öffne jede zitierte Arbeit selbst (DOI über doi.org oder Crossref, arXiv, ADS), mindestens die Zusammenfassung; verlasse dich nicht auf die Belegliste. Prüfe:
> 1. Stützt die zitierte Arbeit die Aussage im Text?
> 2. Stimmen Zahl, Einheit und Unsicherheit mit der Quelle?
> 3. Passen die Angaben zum Datenblock und zu den Daten im Code (`src/data/`, `src/sim/`, `src/render/`), und erklärt „Im Modell" beziehungsweise „Modellgrenzen" jede Abweichung?
> 4. Stimmen Dimensionen und Größenordnungen der Formeln?
> 5. Sagt die englische Fassung dasselbe wie die deutsche, einschließlich aller Zahlen?
> 6. Sind Streitfragen als solche dargestellt, mit Belegen für beide Seiten?
>
> Trage je Zeile der Belegliste in „Prüfung" ein: `ok`, `Fehler: …` oder `Hinweis: …`. Nenne außerdem Aussagen im Text, die in der Belegliste fehlen. Ändere keine Texte. Liefere eine Liste der Befunde mit Klasse (Fehler: sachlich falsch, Beleg stützt nicht, Zahl weicht ab, Fassungen widersprechen sich; Hinweis: Ton, Vollständigkeit, besserer Beleg) und Fundstelle.

Die ausgefüllte Spalte „Prüfung" kommt mit dem Nacharbeits-Commit (oder, ohne Fehler, mit einem eigenen Commit „Belegliste <kennung>: Fachprüfung") ins Repository.

---

### Task 10: Pilot `thema-bahnelemente`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/thema-bahnelemente.md`, `src/data/texte/en/hochschule/thema-bahnelemente.md`, `docs/belege/hochschule/thema-bahnelemente.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 9.
- Produziert: den ersten Hochschultext; Task 13 misst an seiner Blockformel (Bruch, `M_\odot`).

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Bahnelemente` und `# Orbital elements` (Titel aus `ui/i18n`). Themen sind frei gegliedert; `##`-Abschnitte sind trotzdem erwünscht. Richtwert 1000 bis 2000 Wörter je Fassung.
- **Pflicht** (Abnahme §8.1): die Blockformel des dritten Keplerschen Gesetzes als eigener Absatz in genau dieser Form: `$$T^2 = \frac{4\pi^2 a^3}{G\,(M_\odot + m)}$$`.
- Inhalt auf Fachniveau, mindestens: Zweikörperproblem und seine Erhaltungsgrößen; klassische Elemente und die JPL-Menge (a, e, I, L, ϖ, Ω) mit den Beziehungen ω = ϖ − Ω und M = L − ϖ; Keplergleichung und ihre numerische Lösung (Konvergenz bei großer Exzentrizität); Übergang in ekliptikale Koordinaten über drei Drehungen; oskulierende gegen mittlere Elemente, säkulare Störungen und lineare Raten je Jahrhundert samt Gültigkeitsbereich; Bezugsrahmen (Ekliptik und Äquinoktium J2000, Zeitskala der Epoche); Singularitäten bei e → 0 und I → 0 und äquinoktiale Elemente; Monde mit Elementen gegen die Laplace-Ebene.
- Code lesen: `src/sim/orbit.ts` (Elemente zur Zeit, Lösung der Keplergleichung: Verfahren, Abbruchgrenze, Iterationszahl aus dem Code übernehmen), `src/sim/kepler.ts`, `src/sim/frames.ts`, die Bahndaten in `src/data/` (Quelle und Bezugsebene je Körper).
- Verweise: `thema:modell`, `objekt:mercury`, `objekt:pluto`, `objekt:earth` sind sinnvoll; `quelle:jpl-approx-pos` und `quelle:jpl-satelliten-bahnen` haben Karten zu `thema:bahnelemente`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen, Gemeinsame Vorgaben Punkt 2): Standish und Williams, Kapitel „Orbital Ephemerides of the Sun, Moon, and Planets" im *Explanatory Supplement to the Astronomical Almanac* (3. Auflage); Murray und Dermott, *Solar System Dynamics* (Cambridge University Press); die Veröffentlichung zu den JPL-Ephemeriden DE440/DE441 im *Astronomical Journal*.
- Neue Testfälle: 2 Dateien × 10 = 20.

- [ ] **Schritt 1:** Code lesen (Gemeinsame Vorgaben 1).
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler (Gemeinsame Vorgaben 2 bis 5).
- [ ] **Schritt 3:** Deutscher Text, englische Fassung (Gemeinsame Vorgaben 6 und 7).
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; Wortzahlen notieren.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/thema-bahnelemente.md src/data/texte/en/hochschule/thema-bahnelemente.md docs/belege/hochschule/thema-bahnelemente.md src/data/literatur.ts
git commit -m "Hochschultext Bahnelemente mit Belegliste (Pilot)"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit (Gemeinsame Vorgaben 10), Commit der Belegliste mit ausgefüllter Spalte „Prüfung".

---

### Task 11: Pilot `objekt-earth`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/objekt-earth.md`, `src/data/texte/en/hochschule/objekt-earth.md`, `docs/belege/hochschule/objekt-earth.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 10 (`thema:bahnelemente` hat jetzt einen Hochschultext).
- Produziert: den ersten Körpertext; Task 13 misst an seiner Tabelle und seinen Zitaten.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Erde` und `# Earth`. Gliederung Körper (Entwurf §5.1), alle acht Abschnitte. Richtwert 1500 bis 2500 Wörter je Fassung.
- **Pflicht** (Abnahme §8.1): Im Abschnitt „Kenngrößen und Messung" eine Tabelle mit mindestens vier Spalten, etwa `| Größe | Wert | Unsicherheit | Beleg |`, mit Formeln und `literatur:`-Zitaten in Zellen; mindestens drei Zitate im ganzen Text.
- Inhalt auf Fachniveau, mindestens: GM der Erde, Äquatorradius und Abplattung, J₂ und Trägheitsmomentfaktor mit Verfahren und Unsicherheit; Tageslänge und ihre Schwankungen; Schalenaufbau aus der Seismologie (Kern-Mantel-Grenze, innerer Kern) samt offener Punkte zu leichten Elementen und Alter des inneren Kerns; Plattentektonik knapp; Atmosphäre und Magnetfeld (Dipol, Säkularvariation); Bahn und ihre langperiodischen Änderungen; Entstehung und Mondbildung mit dem Stand der Isotopendebatte; Offene Fragen; Im Modell.
- **Im Modell** muss klären: Gelten die in Orrery genutzten Bahnelemente der Erde für die Erde selbst oder für das Baryzentrum Erde–Mond, und wie behandelt die Simulation das? Welches Rotationsmodell, welche Albedo, welche Bezugsebene nutzt der Datensatz? Weichen Datenblockwerte (Durchmesser, Rotationsperiode, Achsneigung, Exzentrizität) von den Messwerten im Text ab, steht hier die Erklärung.
- Code lesen: Eintrag `earth` in den Datensätzen unter `src/data/`, `src/sim/orbit.ts` (`positionAt`, `achsneigungDeg`, `umlaufzeitTage`), `src/sim/rotation.ts`, `src/ui/info/datenzeilen.ts`.
- Verweise: `objekt:moon`, `thema:bahnelemente`, `thema:modell`, `szene:erdaufgang` sind sinnvoll; `quelle:nssdc-earth` hat eine Karte zu `objekt:earth`. Keine Verweise auf `gezeiten`, `innerer-aufbau`, `bezugssysteme` (4d-2 ergänzt sie).
- Ausgangspunkte der Recherche (vor Verwendung prüfen): IERS Conventions (2010), IERS Technical Note 36; das Referenzerdmodell PREM (Dziewonski und Anderson); Übersichtsarbeiten zum Alter des inneren Kerns und zu leichten Elementen im Kern; Übersichtsarbeiten zur Entstehung des Mondes durch einen Rieseneinschlag.
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Code lesen (Gemeinsame Vorgaben 1).
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; Wortzahlen notieren. Außerdem: `npx vitest run src/ui/info/InfoPanel.test.tsx src/ui/info/InfoPanel.laden.test.tsx src/data/texte/index.test.ts` → PASS (Task 8 hat sie von echten Hochschultexten gelöst; scheitert hier einer, ist das ein Befund zu Task 8).
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/objekt-earth.md src/data/texte/en/hochschule/objekt-earth.md docs/belege/hochschule/objekt-earth.md src/data/literatur.ts
git commit -m "Hochschultext Erde mit Belegliste (Pilot)"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit, Commit der Belegliste mit ausgefüllter Spalte „Prüfung".

---

### Task 12: Pilot `szene-mondfinsternis`

**Dateien:**
- Erstellen: `src/data/texte/de/hochschule/szene-mondfinsternis.md`, `src/data/texte/en/hochschule/szene-mondfinsternis.md`, `docs/belege/hochschule/szene-mondfinsternis.md`
- Ändern: `src/data/literatur.ts`

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 11 (`objekt:earth` hat jetzt einen Hochschultext).
- Produziert: den ersten Szenentext.

**Vorgaben (zusätzlich zu den gemeinsamen):**
- Überschriften `# Szene: Mondfinsternis` und `# Scene: Lunar eclipse` (wie die Gymnasialfassungen). Gliederung Szene (Entwurf §5.1): „Was das Bild zeigt", „Hintergrund", „Modellgrenzen" (Pflicht). Richtwert 300 bis 600 Wörter je Fassung.
- **Was das Bild zeigt:** Kameraweg und Zeitraffer genau nach `src/data/scenes.ts` (Eintrag `mondfinsternis`: Bahntyp `sichtlinie`, `distanceInRadii` 4, `elevationDeg` 8, `azimuthRateDegPerSec` 0,4, `durationSec` 45, `timeRateDaysPerSec` 0,0035, Streuung) und dem Sprung auf die nächste Finsternis (`zeitpunkt`); Winkelgröße der Erde vom Blickpunkt aus nachrechnen und nennen.
- **Hintergrund:** Geometrie von Kern- und Halbschatten in Mondentfernung (gern als Formel), Vergrößerung des Erdschattens durch die Atmosphäre, Rötung durch Brechung und Rayleigh-Streuung, Danjon-Skala.
- **Modellgrenzen:** was die Schattenberechnung in `src/render/shadows.ts` und `src/sim/finsternis.ts` tatsächlich tut (Kugeln, Sonnenanteil, Atmosphäre ja oder nein, Farbe im Kernschatten ja oder nein) und wie genau der Zeitpunkt der „nächsten Finsternis" mit den mittleren Elementen ist. Nichts behaupten, was der Code nicht zeigt.
- Verweise: `objekt:moon`, `objekt:earth`, `thema:finsternis` sind sinnvoll; `quelle:nasa-eclipse` hat eine Karte zu `szene:mondfinsternis`.
- Ausgangspunkte der Recherche (vor Verwendung prüfen): NASA-Finsterniskanon von Espenak und Meeus (Five Millennium Canon of Lunar Eclipses); Arbeiten zur Vergrößerung des Erdschattens; Arbeiten zur Helligkeit und Farbe verfinsterter Monde (Danjon-Skala, Einfluss vulkanischer Aerosole).
- Neue Testfälle: 2 Dateien × 11 = 22.

- [ ] **Schritt 1:** Code lesen (Gemeinsame Vorgaben 1), einschließlich `src/sim/finsternis.ts` und `src/render/shadows.ts`.
- [ ] **Schritt 2:** Recherche, Belegliste, Katalogeinträge, Prüfskript ohne Fehler.
- [ ] **Schritt 3:** Deutscher Text, englische Fassung.
- [ ] **Schritt 4:** `npx vitest run src/data src/ui/info` → PASS; Wortzahlen notieren.
- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte/de/hochschule/szene-mondfinsternis.md src/data/texte/en/hochschule/szene-mondfinsternis.md docs/belege/hochschule/szene-mondfinsternis.md src/data/literatur.ts
git commit -m "Hochschultext Szene Mondfinsternis mit Belegliste (Pilot)"
```

- [ ] **Schritt 6:** Fachprüfung und Nacharbeit, Commit der Belegliste mit ausgefüllter Spalte „Prüfung".

---

### Task 13: Abnahme, Entwurfsnachträge, README

**Dateien:**
- Erstellen: `docs/phase4d-etappe1-abnahme.md`
- Ändern: `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` (Nachträge), `README.md`
- Nur lokal, nicht committen: `.playwright-mcp/4d1-*.png`, `.playwright-mcp/messung_formel.py`

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 12; DOM-Attribute `[data-blockformel]`, `[data-tabelle]`, `[data-formelfehler]`, `[data-verweis]`, `[data-literatur]`, `[data-quelle]`; `aside.info-panel`.
- Produziert: das Abnahmeprotokoll; den Halt für Jens.

- [ ] **Schritt 1: Prüfläufe**

```bash
npm run lint
npm test
npm run build
npm run literatur:pruefen
```

Expected: Lint ohne Befund; alle Tests grün (Gesamtzahl notieren: Ausgangsstand 2905 plus die in Task 1 bis 12 genannten neuen Fälle, abzüglich des in Task 8 entfernten); Build erfolgreich (nur der bekannte Hinweis zur Chunkgröße); Prüfskript mit 0 Fehlern. Schlusszeilen und die vollständige Ausgabe des Prüfskripts ins Protokoll.

- [ ] **Schritt 2: Browser vorbereiten**

Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` (erwartet 200, keinen zweiten Server starten). `browser_navigate` auf `http://localhost:5173/Orrery/`, dann `browser_evaluate`:

```js
() => {
  window.store.setState({ quality: { tier: 'high' } });
  const s = window.store.getState();
  s.setCinema({ running: false, pauseOnInput: false });
  s.setTime({ paused: true });
  s.setUi({ hidden: false, language: 'de', panels: { ...s.ui.panels, info: true } });
  s.setInfo({ niveau: 'hochschule', breiteRem: 24, thema: 'bahnelemente' });
  return window.innerWidth;
}
```

- [ ] **Schritt 3: Formelsatz messen (Entwurf §8.1)**

Warten, bis Text und Schrift da sind (`browser_evaluate`):

```js
async () => {
  const t0 = performance.now();
  while (performance.now() - t0 < 5000) {
    const kopf = document.querySelector('aside.info-panel header h2')?.textContent;
    if (kopf === 'Bahnelemente' && document.querySelector('[data-blockformel] mfrac')) {
      await document.fonts.ready;
      return { kopf, ms: Math.round(performance.now() - t0) };
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  return null;
}
```

Die Kepler-Formel in den Blick holen, den Panelhintergrund für die Messung deckend machen (die Szene dahinter würde sonst durch den halbtransparenten Hintergrund mitzählen; im Protokoll vermerken) und die Rechtecke lesen:

```js
() => {
  const kepler = [...document.querySelectorAll('[data-blockformel]')]
    .find((b) => b.querySelector('mfrac') && [...b.querySelectorAll('mo')].some((m) => m.textContent === '⊙'));
  if (!kepler) return null;
  kepler.scrollIntoView({ block: 'center' });
  const aside = document.querySelector('aside.info-panel');
  aside.style.backgroundColor = 'rgb(15, 23, 42)';
  aside.style.backdropFilter = 'none';
  const r = (el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
  const mfrac = kepler.querySelector('mfrac');
  const sonne = [...kepler.querySelectorAll('mo')].find((m) => m.textContent === '⊙');
  return { dpr: devicePixelRatio, mfrac: r(mfrac), zaehler: r(mfrac.children[0]), sonne: r(sonne) };
}
```

`browser_take_screenshot` (Ansicht, PNG) nach `.playwright-mcp/4d1-formel.png`. Messskript `.playwright-mcp/messung_formel.py`, Aufruf mit dem JSON aus dem vorigen Schritt als Argument:

```python
import json, sys, math
import numpy as np
from PIL import Image

m = json.loads(sys.argv[1])
d = m['dpr']
bild = np.asarray(Image.open('.playwright-mcp/4d1-formel.png').convert('L'), dtype=float)

def ausschnitt(r):
    return bild[int(r['y'] * d):int(math.ceil((r['y'] + r['h']) * d)), int(r['x'] * d):int(math.ceil((r['x'] + r['w']) * d))]

# Bruchstrich: längster zusammenhängender heller Lauf einer Zeile im mfrac-Rechteck.
hell = ausschnitt(m['mfrac']) > 128
lauf = 0
for zeile in hell:
    aktuell = 0
    for wert in zeile:
        aktuell = aktuell + 1 if wert else 0
        lauf = max(lauf, aktuell)
print('Bruchstrich (px):', lauf, ' Zählerbreite (px):', round(m['zaehler']['w'] * d, 1))

# Zeichen ⊙: heller Punkt in der Mitte, geschlossener Ring, dunkle Lücke dazwischen.
s = ausschnitt(m['sonne']) > 128
ys, xs = np.nonzero(s)
cy, cx = ys.mean(), xs.mean()
abst = np.hypot(ys - cy, xs - cx)
rmax = abst.max()
ring = abst > 0.6 * rmax
winkel = np.degrees(np.arctan2(ys[ring] - cy, xs[ring] - cx)) % 360
sektoren = len(set((winkel // 10).astype(int)))
punkt = int((abst < 0.2 * rmax).sum())
luecke = int(((abst > 0.3 * rmax) & (abst < 0.5 * rmax)).sum())
print('Ring-Sektoren (von 36):', sektoren, ' Punktpixel:', punkt, ' Lückenpixel:', luecke, ' Radius (px):', round(float(rmax), 1))
```

Kriterien: Bruchstrich ≥ 0,9 × Zählerbreite; Ring-Sektoren ≥ 32; Punktpixel ≥ 1; Lückenpixel = 0. Werte ins Protokoll; ein Ersatzkästchen fiele an Sektoren oder Punkt durch.

- [ ] **Schritt 4: Tabelle bei 18 rem**

```js
async () => {
  const s = window.store.getState();
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const aside = () => document.querySelector('aside.info-panel');
  s.setInfo({ thema: null, breiteRem: 18, niveau: 'gymnasium' });
  s.setCamera({ targetId: 'earth' });
  let t0 = performance.now();
  while (performance.now() - t0 < 5000 && aside()?.querySelector('header h2')?.textContent !== 'Erde') await warte(50);
  await warte(300);
  const vorher = aside().getBoundingClientRect().width;
  s.setInfo({ niveau: 'hochschule' });
  t0 = performance.now();
  while (performance.now() - t0 < 5000 && !document.querySelector('[data-tabelle]')) await warte(50);
  const rahmen = document.querySelector('[data-tabelle]');
  return {
    remPx: parseFloat(getComputedStyle(document.documentElement).fontSize),
    vorher, nachher: aside().getBoundingClientRect().width,
    scrollWidth: rahmen?.scrollWidth, clientWidth: rahmen?.clientWidth,
  };
}
```

Kriterien: `vorher` = `nachher` = 18 × `remPx`; `scrollWidth` > `clientWidth`. Ist die Tabelle des Pilottexts schmaler als die Spalte, `breiteRem` nicht verändern, sondern den Befund als Unschärfe protokollieren und die Scrollbarkeit mit `setInfo({ breiteRem: 18 })` im schmalsten Fenster wiederholen (`browser_resize` auf 900 × 900, oberhalb der Bogengrenze).

- [ ] **Schritt 5: Literaturverweise und Karten (Erde, Hochschule, Deutsch)**

```js
() => {
  const ids = [...new Set([...document.querySelectorAll('a[data-verweis^="literatur:"]')].map((a) => a.getAttribute('data-verweis').slice('literatur:'.length)))].sort();
  const karten = [...document.querySelectorAll('[data-literatur]')].map((k) => k.getAttribute('data-literatur')).sort();
  return { ids, karten, gleich: JSON.stringify(ids) === JSON.stringify(karten) };
}
```

Kriterium: `gleich` ist `true`. Dann `browser_snapshot`, den ersten Zitatlink per `browser_click` anklicken und sofort (`<id>` ersetzen):

```js
async () => {
  const id = '<id>';
  await new Promise((r) => setTimeout(r, 600));
  const karte = document.querySelector(`[data-literatur="${id}"]`);
  const segment = karte.closest('.overflow-y-auto');
  const a = karte.getBoundingClientRect();
  const b = segment.getBoundingClientRect();
  return { hervorgehoben: karte.className.includes('border-sky-300'), sichtbar: a.top >= b.top - 1 && a.bottom <= b.bottom + 1 };
}
```

Kriterium: beide `true`. Danach denselben Link mit `browser_click` und `button: 'middle'`; `browser_tabs` (Liste) zeigt einen zweiten Tab mit einer Adresse auf `doi.org` (oder dem Ziel der Hauptadresse); diesen Tab schließen.

- [ ] **Schritt 6: Rundgang über die sechs Pilotdateien**

Für jede Kombination aus Sprache (`de`, `en`) und Kennung (`thema:bahnelemente`, `objekt:earth`, `szene:mondfinsternis`) den Zustand setzen (`s.setUi({ language })`; Thema über `setInfo({ thema })`; Erde über `setInfo({ thema: null })` und `setCamera({ targetId: 'earth', mode: 'free' })`; Szene wie im Rundgang der Abnahme 4c-4: `setCinema({ running: true, shuffle: false, nummer: <Index von mondfinsternis> })`, `setCamera({ mode: 'cinema' })`, nach Stabilisierung `setCinema({ running: false })`, `setUi({ hidden: false })`), auf den Kopfwechsel pollen und dann auswerten:

```js
() => {
  const text = document.querySelector('aside.info-panel [role="tabpanel"]');
  return {
    kopf: document.querySelector('aside.info-panel header h2')?.textContent,
    formelfehler: document.querySelectorAll('[data-formelfehler]').length,
    formeln: text.querySelectorAll('math').length,
    tabellen: text.querySelectorAll('[data-tabelle]').length,
    hinweise: [...text.querySelectorAll('p.text-amber-300')].map((p) => p.textContent),
    verweise: [...text.querySelectorAll('[data-verweis]')].map((v) => v.getAttribute('data-verweis')),
  };
}
```

Kriterien: `formelfehler` 0; keine Hinweiszeile („folgt", „nicht übersetzt", „kein Text"). Danach jeden Verweis einzeln per `element.click()` in `browser_evaluate` auslösen (externe `https://`-Ziele nur zählen, nicht anklicken), die Wirkung prüfen und den Ausgangszustand wiederherstellen:

| Verweisart | erwartete Wirkung |
|---|---|
| `objekt:<id>` | `camera.targetId === '<id>'` nach Ende der Kamerafahrt (1,5 s) |
| `thema:<id>` | `ui.info.thema === '<id>'` |
| `szene:<id>` | `cinema.nummer` gleich dem Index der Szene, `camera.mode === 'cinema'` |
| `quelle:<id>` | `[data-quelle="<id>"]` hat `border-sky-300` |
| `literatur:<id>` | `[data-literatur="<id>"]` hat `border-sky-300` |

Ergebnis je Datei als Tabelle ins Protokoll (Zahl der Verweise je Art, Zahl der Treffer). `browser_console_messages`: keine Fehler und Warnungen seit dem Navigieren.

- [ ] **Schritt 7: Protokoll `docs/phase4d-etappe1-abnahme.md`**

Gliederung:

```md
# Abnahme Phase 4d Etappe 1 „Gerüst und Pilot"

## 1. Umfang
(Commits der Etappe mit Kurzhash und Titel, Branch, Plan, Entwurf)

## 2. Lint, Tests, Build
(Schlusszeilen, Testzahl mit Herleitung)

## 3. Prüfskript
(vollständige Ausgabe von npm run literatur:pruefen, Begründung jeder Warnung)

## 4. Fachprüfung der Pilottexte
| Text | Wörter de/en | Belege | Zitate | Fehler gefunden | Fehler behoben | Hinweise offen |

## 5. Sichtprüfung
### 5.1 Formelsatz  (Messwerte aus Schritt 3, Kriterien, Hinweis auf deckenden Hintergrund)
### 5.2 Tabelle bei 18 rem
### 5.3 Literaturverweise und Karten
### 5.4 Rundgang
### 5.5 Konsole

## 6. Rulings der Umsetzung
(jede Entscheidung aus dem Ledger mit „Ruling:" gekennzeichnet)

## 7. Bekannte Unschärfen

## 8. Halt: Fragen an Jens zu den Pilottexten
(Tiefe, Ton, Gliederung, Länge, Zitierdichte; konkrete Stellen, an denen der Umsetzer unsicher war)
```

- [ ] **Schritt 8: Entwurfsnachträge**

In `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` am Ende der jeweiligen Abschnitte je einen Absatz „**Nachtrag (4d-1):**" mit dem Inhalt der Rulings 2, 3, 4, 5, 6 und 7 (unten) in der Sache, ohne Verweis auf den Plan:
- §3.4: Tabellenzellen brechen nicht um.
- §4.5: Abweichender arXiv-Titel ist bei Einträgen mit DOI eine Warnung.
- §5.3: Quellenkarten der Fachthemen aus Wikipedia (de/en) und den JPL-Ephemeriden; die IERS-Seiten antworteten am 17.09.2026 mit 404.
- §5.5: Formel-, Tabellen- und Zitatprüfung gelten für alle Textdateien; der Zwillingsvergleich normiert in Formeln zusätzlich den Leerraum.
- §8.1: Der Hinweis „nur Hochschule" ist in 4d-1 nur per Komponententest geprüft; die Sichtprüfung folgt in der Abnahme von 4d-2, wenn die Fachthemen Texte haben.

- [ ] **Schritt 9: README**

In `README.md` den Absatz ab „Phase 4a (Englisch, …" am Ende ersetzen: statt „Phase 4c ist damit inhaltlich komplett; Tag `v0.4.0` folgt nach Freigabe. Offen sind die Hochschulstufe (Phase 4d) und Phase 5 (…)." schreiben:

```md
Phase 4c ist damit komplett (Tag `v0.4.0`). Phase 4d (Hochschulstufe) läuft:
Etappe 1 bringt Formeln (TeX-Teilmenge als MathML), Tabellen, Zitate mit
Literaturkarten, ein Prüfskript für den Literaturkatalog
(`npm run literatur:pruefen`) und drei Pilottexte (Bahnelemente, Erde,
Mondfinsternis). Offen sind die übrigen Hochschultexte (Etappen 4d-2 bis 4d-11)
und Phase 5 (Ambient-Sound, Qualitätsstufen, Texturkompression,
Veröffentlichung).
```

- [ ] **Schritt 10: Aufräumen und Commit**

```bash
git status --short
```

Expected: nur `docs/phase4d-etappe1-abnahme.md`, der Entwurf und `README.md` geändert; keine Dateien unter `.playwright-mcp/` oder im Projektstamm (Screenshots, Skripte) — falls doch, löschen.

```bash
git add docs/phase4d-etappe1-abnahme.md docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md README.md
git commit -m "Abnahme 4d Etappe 1: Gerüst und Pilottexte"
```

---

## Abschluss

1. Letzter Lauf `npm run lint`, `npm test`, `npm run build` auf dem Branch (Ausgabe zeigen).
2. Zweistufige Schlussprüfung nach superpowers:subagent-driven-development (Gesamt-Review über alle Commits der Etappe); Befunde gebündelt nacharbeiten, im Protokoll unter „Nacharbeit nach der Schlussprüfung" festhalten.
3. Abschluss nach superpowers:finishing-a-development-branch: Fast-Forward von `hochschule-1` nach `master`, Branch löschen, **nicht pushen**.
4. **Halt.** Bericht an Jens: Rulings gesammelt, Fragen aus Protokoll §8, Bitte um Durchsicht der drei Pilottexte. Etappe 4d-2 beginnt erst nach seiner Freigabe; Änderungswünsche an den Pilottexten gehen als Nachtrag in Entwurf §5 und als eigene Commits auf `master` beziehungsweise in den Plan 4d-2.

## Rulings

Entscheidungen der Planung (17.09.2026), von Jens noch nicht bestätigt:

1. **Ruling:** Die Pilottexte stehen nicht wörtlich im Plan (anders als in den Plänen 4c-1 bis 4c-4). Sie entstehen im Task nach Recherche mit Belegliste und Fachprüfung, wie Entwurf §6.4 es für Text-Tasks vorsieht; der Plan legt Pflichtinhalte, Code-Stellen und Ausgangspunkte der Recherche fest.
2. **Ruling:** Die Prüfungen „übersetzbare Formeln und gültige Tabellen" und „Zitate nur aus dem Katalog, nur auf Hochschulniveau" laufen für alle Textdateien, nicht nur für Hochschultexte (Entwurf §5.5 nennt Hochschultexte). Sie kosten nichts und verhindern `$`, `|` und `literatur:` in Grundschul- und Gymnasialtexten.
3. **Ruling:** Der Zwillingsvergleich normiert in Formeln außer `{,}` auch den Leerraum (`T^2 = a^3` gleich `T^2=a^3`).
4. **Ruling:** Tabellenzellen brechen nicht um (`whitespace-nowrap`); breite Tabellen scrollen im Rahmen (Entwurf §3.4 nannte nur den scrollbaren Rahmen). Messwerttabellen bleiben so lesbar; ohne diese Regel wäre die Abnahme „Tabelle scrollt bei 18 rem" nicht verlässlich messbar.
5. **Ruling:** Ein abweichender arXiv-Titel ist bei Einträgen mit DOI nur eine Warnung (veröffentlichte Fassungen tragen oft andere Titel; die DOI-Prüfung sichert den Titel), ohne DOI ein Fehler. Das Jahr wird gegen arXiv nicht geprüft.
6. **Ruling:** Quellenkarten der Fachthemen kommen aus Wikipedia (deutsch und englisch) und den JPL-Ephemeriden; die IERS-Seiten, die der Entwurf als Beispiel nennt, antworteten am 17.09.2026 unter allen geprüften Adressen mit 404.
7. **Ruling:** Der Hinweis „nur Hochschule" ist in 4d-1 nur per Komponententest geprüft; die Sichtprüfung folgt in 4d-2, weil die Fachthemen erst dann Texte haben.
8. **Ruling:** `ladeMitAusweich` bekommt einen einspritzbaren Lader, und die Hinweis-Tests des Panels laufen mit gemocktem Lader, weil die bisherigen Beispiele „ohne Hochschultext" die Erde nutzten (Befund Task 8).
9. **Ruling:** Die TeX-Teilmenge enthält zusätzlich die Aliase `\leq`, `\geq`, `\neq` sowie `.` und `:` als Operatoren; `\text` erlaubt keine verschachtelten Klammern; `\mathrm` verbindet benachbarte Buchstaben nur innerhalb einer Zeile; eine Ziffernfolge bleibt ein einziges Argument (anders als TeX, deshalb Klammerpflicht in den Texten).
10. **Ruling:** Pflichtinhalte der Pilottexte (Kepler-Blockformel mit `M_\odot`, Erde-Tabelle mit mindestens vier Spalten) folgen aus der Messbarkeit der Abnahme §8.1.
11. **Ruling:** Keiner der drei Pilottexte verweist auf die Fachthemen (Entwurf §7 sagt das nur für die Erde); 4d-2 ergänzt die Verweise, wo sie passen.
12. **Ruling:** Literaturkarten erscheinen ohne die Bedingung `frisch`, also wie der Textkörper bis zum Laden des neuen Texts; die Hinweiszeilen behalten `frisch`.
13. **Ruling:** Einträge in `LITERATUR` stehen alphabetisch nach Kennung.
14. **Ruling:** Die Etappe geht nach der Abnahme per Fast-Forward auf `master`, bevor Jens die Pilottexte gelesen hat; Änderungen aus seiner Durchsicht kommen als eigene Commits.
