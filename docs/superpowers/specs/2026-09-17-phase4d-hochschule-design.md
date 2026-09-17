# Phase 4d — Hochschule: Fachtexte mit Formeln, Tabellen und Primärliteratur

Entwurf vom 17.09.2026. Grundlage ist der Entwurf 4c (`2026-09-14-phase4c-infopanel-design.md`),
§2 Punkt 4: Die Hochschulstufe hat keine Längenobergrenze („gesamte wissenschaftliche Basis")
und ist deshalb eine eigene Phase. 4c hat den Hochschul-Tab technisch eingebaut, aber nicht
gefüllt, und Formeln sowie Tabellen im Renderer ausdrücklich bis zu dieser Phase zurückgestellt
(4c §10).

Akzeptanzkriterium: **Jeder Körper, jede Szene und jedes Thema hat auf dem Hochschul-Tab einen
eigenen Fachtext in Deutsch und Englisch, jede Literaturangabe ist maschinell gegen Crossref
beziehungsweise arXiv und inhaltlich gegen die zitierte Arbeit geprüft.**

## 1. Ausgangslage

- Der Hochschul-Tab zeigt den Datenblock in Hochschultiefe (`ui/info/datenzeilen.ts`:
  Bahnelemente zur Epoche J2000 samt Raten, Bezugsebene, Polrichtung, geometrische Albedo) und
  darunter den Gymnasialtext mit der Hinweiszeile `info.hochschuleFolgt`.
- Je Niveau gibt es 63 Kennungen: 35 Körper, 19 Szenen, 9 Themen, jeweils in Deutsch und
  Englisch. Hochschultexte existieren nicht.
- Der Renderer (`ui/info/markdownParser.ts`, `Markdown.tsx`) versteht Überschriften `#` bis
  `###`, Absätze, Listen, fett, kursiv und Links; HTML wird nie durchgereicht.
- In keinem vorhandenen Text kommen `$` oder `|` vor; die neue Syntax kollidiert mit nichts.
- Verweisschemata (`data/verweise.ts`): `objekt:`, `szene:`, `thema:`, `quelle:`, `https://`.
  Der Quellenkatalog `data/quellen.ts` hat 66 Einträge, davon 5 der Art `fachartikel`.
- React 19.3 legt die Kinder eines `<math>`-Elements im MathML-Namensraum an
  (`react-dom`, `MATH_NAMESPACE`); `@types/react` kennt die MathML-Elemente nicht als JSX.
- Skripte laufen mit `node scripts/<name>.ts` ohne Übersetzungsschritt (wie `deploy`).

## 2. Entscheidungen (Jens, 17.09.2026)

1. **Zielgruppe Fachniveau** (Master und Forschung): aktuelle Modelle und Streitfragen,
   Messunsicherheiten, Primärliteratur als tragendes Element, Formeln ohne didaktische
   Einführung.
2. **Umfang:** alle 63 Kennungen, dazu sechs neue Fachthemen nur auf Hochschulniveau (§5.3).
   Szenentexte sind kurz.
3. **Formeln** in LaTeX-Schreibweise in den Markdown-Dateien, übersetzt von einem eigenen
   Übersetzer einer Teilmenge nach MathML, das der Browser setzt. Keine neue Abhängigkeit.
4. **Zitierweise** Autor-Jahr mit eigenem Literaturkatalog; auf dem Hochschul-Tab erscheinen
   die zitierten Arbeiten als Karten.
5. **Länge:** feste Gliederung je Art, Länge nach Stoff mit Richtwerten ohne Testgrenze.
6. **Sprachen:** Deutsch und Englisch in jeder Etappe gemeinsam.
7. **Tabellen:** einfache Pipe-Tabellen.
8. **Ansätze:** Übersetzung der Formeln zur Laufzeit durch ein reines Modul (nicht beim Build,
   nicht als MathML in den Dateien); Schnitt der Phase in Gerüst mit Pilottexten, dann
   Fachthemen, dann je Planetensystem Körper samt Szenen (§7).
9. **Tag `v0.5.0`** nach 4d-11; Phase 5 bekommt `v0.6.0`. Phasen- und Versionsnummer laufen ab
   hier auseinander.

## 3. Formeln und Tabellen im Renderer

### 3.1 Schreibweise

- **Formel im Satz:** `$…$`. Ein `$` öffnet nur, wenn das folgende Zeichen kein Leerraum und
  kein `$` ist; es schließt nur, wenn das vorige Zeichen kein Leerraum ist und das folgende
  keine Ziffer (Regel von Pandoc). Ohne passendes schließendes Zeichen bleibt `$` Text. `\$`
  ergibt ein Dollarzeichen. Innerhalb einer Formel wirkt kein Markdown (`*`, `[`).
- **Formel als Block:** ein Absatz, dessen Text ohne Rand-Leerraum mit `$$` beginnt und endet.
  Zeilenumbrüche darin zählen als Leerraum.
- **Tabelle:** Kopfzeile, Trennzeile, Datenzeilen, jede Zeile beginnt und endet mit `|`. Die
  Trennzeile besteht je Spalte aus mindestens drei `-` mit optionalem `:` links, rechts oder
  beidseitig (links, rechts, mittig; ohne `:` links). Zellen enthalten Inline-Elemente
  einschließlich Formeln; `\|` ergibt einen senkrechten Strich. Wie bei GFM wird eine
  Tabellenzeile zuerst an unmaskierten `|` in Zellen zerlegt und `\|` danach zu `|`, auch
  innerhalb von Formeln: Ein Betrag in einer Zelle heißt deshalb `$\|x\|$`, im Fließtext
  `$|x|$`. Die Tabelle endet an einer
  Leerzeile oder einer Zeile ohne führendes `|`. Keine verbundenen Zellen, keine
  Tabellenunterschrift; eine erklärende Zeile steht als Absatz davor.

### 3.2 Parser

`markdownParser.ts` bekommt drei Knoten:

```ts
| { typ: 'formel'; tex: string }                       // Inline
| { typ: 'formel'; tex: string }                       // Block
| { typ: 'tabelle'; ausrichtung: ('links' | 'mitte' | 'rechts')[];
    kopf: Inline[][]; zeilen: Inline[][][] }           // Block
```

Hat eine Datenzeile eine andere Spaltenzahl als die Kopfzeile oder fehlt die Trennzeile, wird
der ganze Abschnitt als Absatz ausgegeben; der Dateitest erkennt das an einem Absatz, dessen
Text mit `|` beginnt (§5.5). Der Parser übersetzt kein TeX; er hält nur die Quelle.

### 3.3 Übersetzer

Reines Modul `ui/info/texUebersetzer.ts` (der Name weicht von der Komponente `Formel.tsx` ab,
weil gleichnamige Dateien auf NTFS kollidieren):

```ts
type MathKnoten =
  | { tag: string; attribute?: Record<string, string>; kinder: MathKnoten[] }
  | { tag: 'mi' | 'mn' | 'mo' | 'mtext'; attribute?: Record<string, string>; text: string };

function texNachMathml(tex: string, block: boolean):
  { baum: MathKnoten } | { fehler: string; stelle: number };
```

Die Wurzel ist `math` mit `display="block"` oder `"inline"` und einem `mrow`. Abbildung:

| TeX | MathML |
|---|---|
| lateinischer Buchstabe | je Buchstabe ein `mi` (kursiv wie in TeX) |
| Ziffernfolge, auch mit `.` oder `{,}` zwischen Ziffern | ein `mn`; `{,}` wird zum Komma |
| `+ = < > ( ) [ ] / , : \|` und `-` | `mo`; `-` wird zu U+2212 |
| `{…}` | `mrow` |
| `x^a`, `x_a`, `x_a^b` | `msup`, `msub`, `msubsup` |
| `\frac{a}{b}` | `mfrac` |
| `\sqrt{a}`, `\sqrt[n]{a}` | `msqrt`, `mroot` |
| `\left( … \right)` mit `( ) [ ] \|` sowie `.` als leerer Seite | `mrow` mit `mo stretchy="true"` |
| `\mathrm{…}` | `mi mathvariant="normal"` (mehrere Buchstaben in einem `mi`) |
| `\text{…}` | `mtext` |
| `\dot \ddot \bar \hat \vec \tilde` | `mover accent="true"` |
| `\alpha … \omega`, `\varpi`, `\varphi`, `\varepsilon`, `\vartheta` | `mi` |
| `\Gamma \Delta \Theta \Lambda \Xi \Pi \Sigma \Phi \Psi \Omega` | `mi mathvariant="normal"` |
| `\approx \sim \simeq \propto \le \ge \ll \gg \ne \equiv \to` | `mo` |
| `\pm \cdot \times \partial \nabla \infty \circ \ldots` | `mo` beziehungsweise `mi` für `\partial`, `\nabla`, `\infty` |
| `\odot`, `\oplus` | `mo` ⊙ (U+2299), ⊕ (U+2295), wie im astronomischen Satz `M_\odot`, `M_\oplus` |
| `\sin \cos \tan \arcsin \arctan \exp \ln \log \max \min` | `mi` mit dem Namen (aufrecht) |
| `\sum`, `\int` mit `_` und `^` | Block: `munderover` beziehungsweise `msubsup`; im Satz: `msubsup` |
| `\,` `\;` `\quad` | `mspace` mit 0,1667 em, 0,2778 em, 1 em |

Jeder andere Befehl, eine offene oder überzählige Klammer, ein `^` oder `_` ohne Argument und
ein `\right` ohne `\left` ergeben `{ fehler, stelle }`. Weitere Befehle kommen nur dazu, wenn
ein Text sie braucht, jeweils als eigener Task mit Test. Gleichungsnummern, `aligned`,
Matrizen und Makros gehören nicht zur Teilmenge.

**Nachtrag (4d-1):** Schreibregeln für die Autoren der Etappen 4d-2 bis 4d-11, damit der
Dateitest keine vermeidbaren Runden verursacht: `\leq`, `\geq` und `\neq` sind Aliase zu `\le`,
`\ge` und `\ne`. `.` und `:` zählen als Operatoren, nicht als Satzzeichen im Fließtext.
`\text{…}` darf keine verschachtelten geschweiften Klammern enthalten. `\mathrm` verbindet
benachbarte Buchstaben nur innerhalb einer Zeile zu einem `mi`, nicht über eine Hoch- oder
Tiefstellung hinweg. Eine Ziffernfolge ist stets ein einziges Argument — es gilt Klammerpflicht,
etwa `\frac{1}{2}` statt `\frac12`.

**Nachtrag (4d-2):** Funktionsnamen (`\sin`, `\cos`, `\tan`, `\arcsin`, `\arctan`, `\exp`,
`\ln`, `\log`, `\max`, `\min`) stehen als `mi` mit nachfolgender Funktionsanwendung
(`<mo>&#x2061;</mo>`, auch für Screenreader). Ein dünner Abstand (0,1667 em) steht davor, wenn
Gewöhnliches oder eine schließende Klammer vorangeht, und danach, wenn kein Operator und keine
Klammer folgt — wie in TeX. So erscheint `M = E - e\sin E` nicht mehr als gedrängtes „e sinE".

### 3.4 Ausgabe

- `Formel.tsx` ruft `texNachMathml` in `useMemo` und gibt den Baum rekursiv mit
  `createElement(tag, attribute, …)` aus; React legt alles unter `math` im MathML-Namensraum an.
- Blockformeln stehen in einem Rahmen mit `overflow-x: auto`, damit breite Formeln in der
  schmalen Spalte waagerecht scrollen statt das Panel zu sprengen.
- Schrift und Farbe kommen vom Browser (`font-family: math`, unter Windows Cambria Math) und
  von der Textfarbe des Panels.
- Tabellen stehen ebenfalls in einem waagerecht scrollbaren Rahmen: `table` mit `thead`,
  `th scope="col"`, Ausrichtung je Spalte, Ziffern gleicher Breite (`tabular-nums`), schmale
  Rahmenlinien in der Farbe der Panel-Trennlinien.

**Nachtrag (4d-1):** Tabellenzellen brechen nicht um (`whitespace-nowrap`); breite Tabellen
scrollen im Rahmen. Messwerttabellen bleiben so lesbar, und erst diese Regel macht die Abnahme
„Tabelle scrollt bei 18 rem" verlässlich messbar.

### 3.5 Fehlerfall

Liefert der Übersetzer einen Fehler, zeigt `Formel.tsx` den TeX-Quelltext als `<code>` mit
`data-formelfehler` und dem Fehlertext als `title`. Der Dateitest übersetzt jede Formel aller
Texte und lässt bei jedem Fehler durchfallen, deshalb erreicht dieser Zustand keine
Auslieferung.

## 4. Literatur

### 4.1 Katalog

`src/data/literatur.ts`, sprachunabhängig, Titel in der Originalsprache der Arbeit:

```ts
interface Publikation {
  id: string;          // Erstautor-Jahr[Suffix], ASCII klein: 'iess-2019', 'park-2021a'
  autoren: string[];   // eins bis drei, Form „Nachname, I." bzw. „de Pater, I."
  etAl: boolean;       // es gibt weitere Autoren
  jahr: number;
  titel: string;
  erschienen: string;  // 'Science 364, eaat2965' bzw. Buch oder Konferenzband
  doi?: string;        // '10.1126/science.aat2965'
  arxiv?: string;      // Form 'JJMM.NNNNN', freier Volltext
  bibcode?: string;    // ADS
  url?: string;        // nur für Berichte und Datensätze ohne DOI
}
```

Jeder Eintrag hat mindestens `doi`, `arxiv` oder `url`. **Hauptadresse** ist
`https://doi.org/<doi>`, ohne DOI `https://arxiv.org/abs/<arxiv>`, sonst `url`. Ein Eintrag
ohne `doi`, aber mit `arxiv` gilt als **Preprint**. Umlaute im Erstautor werden in der Kennung
umschrieben (`gruen-2020`). Das Suffix trennt mehrere Arbeiten desselben Erstautors im selben
Jahr.

### 4.2 Verweis `literatur:`

- `data/verweise.ts`: `Verweis` bekommt `{ art: 'literatur'; publikation: Publikation }`;
  `verweisAufloesen('literatur:<id>')` liefert `null` für unbekannte Kennungen.
- Im Text: `[Iess et al. 2019](literatur:iess-2019)`, auch mehrere hintereinander
  (`[Iess et al. 2019](literatur:iess-2019); [Mankovich und Fuller 2021](literatur:mankovich-2021)`).
- `Markdown.tsx` gibt den Verweis wie `quelle:` als Anker mit der Hauptadresse aus
  (`data-verweis` bleibt): **Linksklick** scrollt das untere Segment zur Literaturkarte und hebt
  sie 1,5 s hervor, **Mittel-, Strg-, Cmd- oder Umschaltklick** öffnet die Hauptadresse im
  neuen Tab.
- Die Hervorhebung in `InfoPanel.tsx` führt dazu den vollen Schlüssel (`quelle:<id>` oder
  `literatur:<id>`) statt nur der Quellenkennung.
- `literatur:` steht nur in Hochschultexten (Dateitest §4.4).

### 4.3 Literaturkarten

- Reines Modul `ui/info/zitate.ts`: `zitierteArbeiten(bloecke: Block[]): Publikation[]`
  sammelt alle `literatur:`-Ziele aus Absätzen, Listen, Überschriften und Tabellenzellen,
  entfernt Doppelte und sortiert nach Nachname des Erstautors (`localeCompare` mit
  `sensitivity: 'base'`), dann Jahr, dann Suffix.
- Komponente `ui/info/Literaturkarten.tsx` unter den Quellenkarten, Gruppenüberschrift
  `quelle.art.literatur` („Literatur" / „References"). Sie erscheint nur, wenn der geladene
  Text ein Hochschultext ist; zeigt der Hochschul-Tab ersatzweise den Gymnasialtext, entfällt
  sie.
- Karte (`article` mit Hervorhebungsrahmen wie bei den Quellenkarten):
  - Zeile 1: Autoren mit Komma getrennt, bei `etAl` gefolgt von „et al.", dann Jahr mit Suffix
    in Klammern: „Iess, L., Militzer, B., Kaspi, Y. et al. (2019)"
  - Zeile 2: Titel
  - Zeile 3: `erschienen`, bei Preprints gefolgt von `literatur.preprint`
  - Zeile 4: Links, jeweils nur wenn das Feld existiert: `literatur.doi` („DOI"),
    `literatur.arxiv` („arXiv (frei)" / „arXiv (open access)"), `literatur.ads` („ADS",
    `https://ui.adsabs.harvard.edu/abs/<bibcode>/abstract`), `literatur.seite` („Seite" /
    „Website"); alle mit `target="_blank"` und `rel="noopener noreferrer"`.
- Neue Sprachschlüssel in `de.ts` und `en.ts` gleichzeitig: `quelle.art.literatur`,
  `literatur.doi`, `literatur.arxiv`, `literatur.ads`, `literatur.seite`,
  `literatur.preprint`.

### 4.4 Dateitests

`data/literatur.test.ts`:

- Kennungen eindeutig, Muster `^[a-z][a-z0-9-]*-\d{4}[a-z]?$`, Jahr in der Kennung gleich
  `jahr`, `jahr` zwischen 1600 und dem laufenden Jahr.
- `autoren` hat eins bis drei nichtleere Einträge, `titel` und `erschienen` sind nicht leer.
- Mindestens eins von `doi`, `arxiv`, `url`; DOI `^10\.\d{4,9}/\S+$`; arXiv neu
  `^\d{4}\.\d{4,5}(v\d+)?$` oder alt `^[a-z-]+(\.[A-Z]{2})?/\d{7}$`; Bibcode 19 Zeichen,
  beginnend mit dem Jahr; `url` mit `https://`.

`data/texte/dateien.test.ts` (liest alle Texte):

- Jedes `literatur:`-Ziel existiert im Katalog.
- Der Linktext enthält den Nachnamen des Erstautors (Teil von `autoren[0]` vor dem ersten
  Komma) und Jahr samt Suffix aus der Kennung. Ein verdrehtes Zitat fällt so auf.
- `literatur:` kommt nur in Dateien unter `hochschule/` vor.
- Jeder Katalogeintrag wird in mindestens einem Text zitiert.

### 4.5 Prüfskript

`scripts/pruefe-literatur.ts`, gestartet mit `npm run literatur:pruefen` (`node
scripts/pruefe-literatur.ts`), nur von Hand, braucht Netz, nicht Teil von `npm test`.

- Für jeden Eintrag mit `doi`: `https://api.crossref.org/works/<doi>`. Verglichen werden
  - Nachname des Erstautors mit `author[0].family`, ohne Diakritika und Groß-/Kleinschreibung;
  - das Jahr mit `published-print`, `published-online` und `issued`: Übereinstimmung mit einem
    davon ist in Ordnung, Abweichung um 1 von allen ist eine **Warnung**, mehr ist ein
    **Fehler**;
  - der Titel: beide Titel ohne Auszeichnungen, Diakritika, Satzzeichen und
    Groß-/Kleinschreibung in Wörter zerlegt; der Anteil gemeinsamer Wörter, bezogen auf jeden
    der beiden Titel, muss jeweils mindestens 0,8 sein, sonst **Fehler**.
- Für jeden Eintrag mit `arxiv`: `https://export.arxiv.org/api/query?id_list=<id>`, Vergleich
  von Titel und Erstautor nach denselben Regeln.
- Einträge nur mit `url`: Abruf mit `HEAD` (bei 405 `GET`), Status unter 400 erwartet.
- Abfragen nacheinander mit 200 ms Pause, Kopfzeile `User-Agent: Orrery-Literaturpruefung`,
  keine E-Mail-Adresse. Nicht erreichbare Dienste zählen als Fehler.
- `--nur <id,id,…>` prüft nur die genannten Einträge (für einen einzelnen Text-Task).
- Ausgabe als Tabelle (Kennung, Art der Prüfung, Ergebnis, Abweichung); Exit-Code 1 bei
  mindestens einem Fehler, Warnungen allein ergeben 0.
- Die reinen Vergleichsfunktionen (Normalisierung, Wortanteil, Jahresregel) liegen in
  `scripts/literaturVergleich.ts` und haben Tests in `npm test`.

**Nachtrag (4d-2):** Das Skript wiederholt Abrufe bei HTTP 502, 503, 504 und bei
Zeitüberschreitung bis zu zweimal (nach 2 s und 5 s); andere Antworten gelten sofort. Anlass war
die ADS-Adresse eines Eintrags, die gelegentlich 504 meldete.

**Nachtrag (4d-1):** Ein abweichender arXiv-Titel ist bei Einträgen mit DOI nur eine Warnung
(veröffentlichte Fassungen tragen oft andere Titel; die DOI-Prüfung sichert den Titel), ohne
DOI ein Fehler. Das Jahr wird gegen arXiv nicht geprüft.

## 5. Gestalt der Texte

### 5.1 Gliederung

Körper- und Szenentexte haben feste `##`-Überschriften in dieser Reihenfolge. Abschnitte ohne
Stoff entfallen, Pflichtabschnitte nie. `###` ist frei. Die erste Zeile bleibt die
`#`-Überschrift mit dem Namen.

**Körper:**

| Nr. | Deutsch | Englisch | Inhalt |
|---|---|---|---|
| 1 | Kenngrößen und Messung | Parameters and measurement | GM, Radius, Form, Schwerefeld, Rotation; Verfahren und Unsicherheiten, gern als Tabelle |
| 2 | Inneres | Interior | |
| 3 | Oberfläche | Surface | entfällt bei Gasplaneten |
| 4 | Atmosphäre und Magnetosphäre | Atmosphere and magnetosphere | bei der Sonne Chromosphäre, Korona, Heliosphäre |
| 5 | Bahn, Rotation und Dynamik | Orbit, rotation and dynamics | |
| 6 | Entstehung und Entwicklung | Formation and evolution | |
| 7 | **Offene Fragen** (Pflicht) | Open questions | |
| 8 | **Im Modell** (Pflicht) | In the model | welche Daten Orrery nutzt (Elementquelle, Bezugsebene, IAU-Rotationsmodell, Albedo), wo das Modell abweicht, Verweis `thema:modell`; weicht ein Messwert im Text vom Datenblock ab, steht hier die Erklärung |

**Szenen:**

| Nr. | Deutsch | Englisch | Inhalt |
|---|---|---|---|
| 1 | Was das Bild zeigt | What the view shows | Blickpunkt, Winkelgrößen, Beleuchtung |
| 2 | Hintergrund | Background | Physik des Gezeigten |
| 3 | **Modellgrenzen** (Pflicht) | Model limitations | |

**Themen** sind frei gegliedert.

### 5.2 Stand und Länge

- Jeder Hochschultext endet mit einem Absatz `*Stand: <Monat> <Jahr>*` beziehungsweise
  `*As of <Month> <Year>*` (etwa `*Stand: September 2026*`, `*As of September 2026*`). Monat
  und Jahr sind die des Commits, mit dem der Text fertig wird; eine inhaltliche Nacharbeit
  setzt sie neu, eine reine Tippfehlerkorrektur nicht.
- Richtwerte ohne Testgrenze: große Körper 1500 bis 2500 Wörter, kleine Monde 600 bis 1000,
  Themen 1000 bis 2000, Szenen 300 bis 600.

### 5.3 Fachthemen

Sechs neue Einträge in `data/themen.ts` mit Titel in `ui/i18n` (`thema.<id>.title`). Texte gibt
es nur auf Hochschulniveau; Grundschul- und Gymnasialtexte dürfen nicht auf sie verweisen (der
bestehende Test „Ziel hat Text im selben Niveau" verhindert das).

| Kennung | Titel Deutsch | Titel Englisch | Kern |
|---|---|---|---|
| `gezeiten` | Gezeiten und Roche-Grenze | Tides and the Roche limit | Love-Zahlen k₂ und h₂, Güte Q, Gezeitenheizung, Bahnentwicklung |
| `resonanzen` | Bahnresonanzen | Orbital resonances | Mittelbewegungs- und säkulare Resonanzen, Laplace-Resonanz, Neptun–Pluto |
| `bezugssysteme` | Bezugssysteme und Zeitskalen | Reference systems and time scales | ICRS/ICRF3, Ekliptik J2000, Laplace-Ebene, IAU-Rotationsmodell, TT/TDB, Ephemeriden gegen mittlere Elemente |
| `innerer-aufbau` | Innerer Aufbau aus Schwerefeld und Rotation | Interior structure from gravity and rotation | J₂, Trägheitsmomentfaktor, Darwin-Radau, Libration, Seismologie |
| `photometrie` | Albedo und Helligkeit | Albedo and brightness | geometrische und Bond-Albedo, Phasenfunktion, Oppositionseffekt, H-G-System |
| `entstehung` | Entstehung des Sonnensystems | Formation of the Solar System | Scheibe, Schneelinie, Pebble-Akkretion, Nizza-Modell, Grand Tack, Datierung |

Der Abdeckungstest in `data/quellen.test.ts` gilt auch für sie: Jedes bekommt in 4d-1 mindestens
eine Quellenkarte aus dem bestehenden Schema (etwa IERS für `bezugssysteme`). Magnetosphären und
Atmosphären bleiben ohne eigenes Thema, bis sich in den Körpertexten zu viel wiederholt.

**Nachtrag (4d-1):** Die Quellenkarten der Fachthemen kommen aus Wikipedia (deutsch und
englisch) und den JPL-Ephemeriden; die IERS-Seiten, die oben als Beispiel dienen, antworteten
am 17.09.2026 unter allen geprüften Adressen mit 404.

### 5.4 Hinweis „nur Hochschule"

Gibt es zu einer Kennung auf dem gewählten Tab keinen Text (auch nicht in Deutsch als Ersatz),
wohl aber einen Hochschultext, zeigt das Panel statt `info.keinText` die Zeile
`info.nurHochschule` („Diesen Text gibt es nur auf Hochschulniveau." / „This text is only
available at university level."). Der Fall tritt praktisch nur bei den Fachthemen nach einem
Tabwechsel auf. Wie die übrigen Hinweise erscheint er erst nach dem Auflösen des faulen Imports
(`frisch`).

### 5.5 Dateitests für Hochschultexte

In `data/texte/dateien.test.ts`, zusätzlich zu den bestehenden Prüfungen (Dateiname, erste
Zeile, Verweise, Quellenverweis hat Karte) und zu §4.4:

1. **Gliederung:** Die `##`-Überschriften von Körper- und Szenentexten stammen aus der Liste
   ihrer Art und Sprache (§5.1), stehen in aufsteigender Reihenfolge ohne Wiederholung, und
   die Pflichtabschnitte fehlen nicht.
2. **Stand:** Der letzte Absatz hat die Form aus §5.2 mit gültigem Monatsnamen der Sprache.
3. **Formeln:** Jede Formel (inline, Block, in Tabellenzellen) übersetzt ohne Fehler.
4. **Tabellen:** Kein Absatz beginnt mit `|`.
5. **Zwillinge:** Zu jedem deutschen Hochschultext gibt es den englischen und umgekehrt. Beide
   haben dieselbe Mehrfachmenge an `literatur:`-Zielen und dieselbe Mehrfachmenge an
   Formelquellen, nachdem `{,}` durch `.` ersetzt wurde. Zahlen im Fließtext vergleicht der
   Test nicht (Datumsformate, Tausendertrennung); das prüft die Fachprüfung (§6.3).
6. **Ziel hat Text im selben Niveau:** Für Hochschultexte genügt bis einschließlich 4d-10 ein
   Gymnasialtext als Ersatz (Konstante `HOCHSCHULE_GYMNASIUM_ERSATZ` im Test, die Anzeige
   hat dafür den Hinweis `info.hochschuleFolgt`). 4d-11 entfernt den Ersatz.

**Nachtrag (4d-1):** Die Formel-, Tabellen- und Zitatprüfung (Punkte 3, 4 sowie die
Zitatprüfung aus §4.4) gelten für alle Textdateien, nicht nur für Hochschultexte — das
verhindert `$`, `|` und `literatur:` schon in Grundschul- und Gymnasialtexten. Der
Zwillingsvergleich (Punkt 5) normiert in Formeln zusätzlich den Leerraum (`T^2 = a^3` gilt als
gleich `T^2=a^3`). Inhalte von `\text{…}` müssen in beiden Sprachfassungen gleich sein, sonst
schlägt der Zwillingsvergleich fehl.

## 6. Arbeitsweise und inhaltliche Prüfung

### 6.1 Recherche

- Fachwissen veraltet schnell, und die Texte sollen den Stand ihres Datums abbilden. Jeder
  Text-Task beginnt deshalb mit einer Websuche nach neueren Übersichtsartikeln und
  Missionsergebnissen, auch wenn der Stoff bekannt scheint.
- Vorrang: Übersichtsartikel (etwa Annual Review of Earth and Planetary Sciences, Space Science
  Reviews, Bände der Space Science Series), Auswertungen der Missionsteams, Berichte der IAU
  (etwa WGCCRE) und des JPL.
- Zitiert wird nur, was im Task tatsächlich geöffnet wurde, mindestens die Zusammenfassung;
  nie aus dem Gedächtnis.
- Preprints (§4.1) sind erlaubt und auf der Karte gekennzeichnet; begutachtete Fassungen haben
  Vorrang, sobald es sie gibt.
- Streitfragen stehen mit beiden Positionen und je einem Beleg im Text und werden nicht
  entschieden, solange die Fachwelt es nicht getan hat.

### 6.2 Belegliste

Je Kennung eine Datei `docs/belege/hochschule/<art>-<kennung>.md` für beide Sprachen:

```md
# Belege: objekt-earth (Hochschule)

| Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
|---|---|---|---|---|---|
| 1 | Trägheitsmomentfaktor der Erde | C/MR² = 0,3307 | literatur:… | Zusammenfassung | |
```

- „Beleg" ist `literatur:<id>`, `quelle:<id>` oder „Datenblock/Datensatz" mit Dateiname.
- „Fundstelle" nennt, wo der Wert steht: Zusammenfassung, Tabelle, Abschnitt oder Seite.
- Jeder Messwert und jede nicht triviale Aussage bekommt eine Zeile. Die Spalte „Prüfung"
  füllt die Fachprüfung.
- Die Datei ist die Übergabe an die Fachprüfung und dient später dem Nachführen der Texte.

### 6.3 Fachprüfung

Nach jedem Text-Task prüft ein Prüfer mit frischem Kontext den deutschen Text, die englische
Fassung und die Belegliste. Prüfer dürfen parallel zum nächsten Umsetzer laufen (sie nutzen
den Browser nicht). Prüfpunkte:

1. Stützt die zitierte Arbeit die Aussage? Der Prüfer öffnet die Zusammenfassung selbst.
2. Stimmen Zahl, Einheit und Unsicherheit mit der Quelle überein?
3. Passen die Angaben zum Datenblock und zu den Daten im Code (`src/data/`), und erklärt
   „Im Modell" jede Abweichung?
4. Stimmen Größenordnungen und Einheiten der Formeln (Dimensionsprobe)?
5. Sagt die englische Fassung dasselbe wie die deutsche, einschließlich aller Zahlen?

Befunde sind **Fehler** (sachlich falsch, Beleg stützt die Aussage nicht, Zahl weicht ab,
Fassungen widersprechen sich) oder **Hinweis** (Ton, Vollständigkeit, besserer Beleg
verfügbar). Ein Task ist erst fertig, wenn kein Fehler mehr offen ist; Nacharbeiten mehrerer
Befunde gehen gebündelt in einen Auftrag und einen Commit. Hinweise gehen ins Ledger und werden
am Ende der Etappe entschieden.

### 6.4 Ablauf eines Text-Tasks

1. Recherche (§6.1).
2. Belegliste und Katalogeinträge in `data/literatur.ts`.
3. Deutscher Text nach §5, danach die englische Fassung.
4. `npm test` und `npm run literatur:pruefen -- --nur <neue Kennungen>`.
5. Commit von Text, Fassung, Belegliste und Katalogeinträgen zusammen (sonst scheitert der
   Test „jeder Eintrag zitiert").
6. Fachprüfung (§6.3), bei Fehlern Nacharbeit mit eigenem Commit.

Weiter gilt: ein Umsetzer gleichzeitig, Rulings statt Rückfragen während eines Plans, jede
Entscheidung ins Ledger und am Ende gesammelt an Jens.

## 7. Etappen

Jede Etappe hat einen eigenen Plan, eigene Commits, ein eigenes Abnahmeprotokoll und braucht die
Freigabe von Jens. Die Zahl nennt die Textdateien (Deutsch und Englisch).

| Etappe | Inhalt | Dateien |
|---|---|---|
| **4d-1 Gerüst und Pilot** | §3, §4, §5.3 (Katalog, Titel, Quellenkarten), §5.4, §5.5; Pilottexte `objekt-earth`, `thema-bahnelemente`, `szene-mondfinsternis` mit Beleglisten | 6 |
| *Halt* | **Jens prüft die Pilottexte** auf Tiefe, Ton und Gliederung; Änderungen gehen als Nachtrag in §5 und gelten für alle weiteren Etappen | – |
| **4d-2 Fachthemen** | die sechs Themen aus §5.3; danach bekommt `objekt-earth` seine Verweise auf sie (vorher schlüge der Test fehl, weil diese Themen keinen Gymnasialtext als Ersatz haben) | 12 |
| **4d-3 Sonne, Erde–Mond** | Sonne, Mond; Themen `finsternis`, `gebundene-rotation`; Szenen `erdaufgang`, `mondtanz` | 12 |
| **4d-4 Innere Planeten** | Merkur, Venus, Mars, Phobos, Deimos; Szenen `merkurjagd`, `phobos-tiefflug` | 14 |
| **4d-5 Jupitersystem** | Jupiter, Io, Europa, Ganymed, Kallisto; Szenen `jupiter-vorbeiflug`, `galileisches-schattenspiel` | 14 |
| **4d-6 Saturn und Ringe** | Saturn, Titan, Enceladus; Thema `ringe`; Szenen `saturn-streiflicht`, `saturn-ringkante`, `ringdurchflug`, `titan-dunst`, `enceladus-hell` | 18 |
| **4d-7 Mittlere Saturnmonde** | Mimas, Tethys, Dione, Rhea, Iapetus; Szene `iapetus-schief` | 12 |
| **4d-8 Uranussystem** | Uranus, Miranda, Ariel, Umbriel, Titania, Oberon; Thema `achsneigung`; Szene `uranus-gekippt` | 16 |
| **4d-9 Neptun, Pluto** | Neptun, Triton, Pluto, Charon; Szenen `triton-rueckwaerts`, `pluto-charon`, `ferne-sonne` | 14 |
| **4d-10 Zwergplaneten** | Ceres, Eris, Haumea, Makemake; Themen `zwergplaneten`, `kirkwood-luecken`; Szene `ceres-guertel` | 14 |
| **4d-11 Abschluss** | Themen `modell`, `sonnensystem`; Szene `systemblick`; Ersatz in §5.5 Punkt 6 entfällt; Gesamtabnahme; Tag `v0.5.0` | 6 |

Zusammen 138 Dateien für 69 Kennungen: 35 Körper, 19 Szenen, 9 bestehende und 6 neue Themen.
Szenen liegen bei ihrem Zielkörper, Themen bei dem System, das sie am stärksten braucht.

**Schnitt innerhalb einer Text-Etappe:** Ein Task ist ein Körper oder ein Thema, Deutsch und
Englisch zusammen, mit eigenem Commit. Kurze Szenen dürfen zu zweit oder zu dritt in einem Task
laufen. Braucht ein Text einen neuen TeX-Befehl, ist das ein eigener Task vor dem Text (§3.3).

## 8. Abnahme

### 8.1 Etappe 4d-1

- **Formelsatz** (Chrome, Pilottext mit Bruch und `M_\odot`): Element-Screenshot der
  Blockformel bei angehaltener Uhr; gemessen werden der Bruchstrich als
  waagerechter Lauf in Textfarbe über mindestens die Breite des Zählers sowie das Zeichen ⊙
  (geschlossener Ring mit gesetztem Mittelpunkt, kein Ersatzkästchen).
- **Tabelle** bei Spaltenbreite 18 rem: `scrollWidth > clientWidth` im Tabellenrahmen, die
  Spaltenbreite des Panels bleibt unverändert (Pixelbreite vor und nach dem Laden gleich).
- **Literatur:** Klick auf einen `literatur:`-Verweis hebt die Karte hervor (DOM-Abfrage) und
  bringt sie in den sichtbaren Bereich; Mittelklick öffnet einen zweiten Tab mit `doi.org`
  (`browser_tabs`). Die Zahl der Karten gleicht der Zahl verschiedener Zitate im Text.
- **Hinweis „nur Hochschule":** Fachthema auf dem Gymnasial-Tab zeigt `info.nurHochschule`.
- **Rundgang** über die sechs Pilotdateien: kein `data-formelfehler`, jeder Verweis führt zum
  Ziel seiner Art (`data-verweis`), Konsole ohne Fehler und Warnungen.
- Lint, Test, Build mit Schlusszeilen; `npm run literatur:pruefen` ohne Fehler.

**Nachtrag (4d-1):** Der Hinweis „nur Hochschule" ist in dieser Etappe nur per Komponententest
geprüft; die Sichtprüfung im Browser folgt in der Abnahme von 4d-2, sobald die Fachthemen
eigene Texte haben.

### 8.2 Text-Etappen 4d-2 bis 4d-11

- Lint, Test, Build mit Schlusszeilen; `npm run literatur:pruefen` über den ganzen Katalog ohne
  Fehler, Warnungen mit Begründung.
- Übersicht der Fachprüfung je Text: Zahl der Belege, gefundene und behobene Fehler, offene
  Hinweise mit Entscheidung.
- Rundgang über alle neuen Texte in beiden Sprachen auf dem Hochschul-Tab: kein
  `data-formelfehler`, Verweise wie in §8.1, Zahl der Literaturkarten gleich der Zahl
  verschiedener Zitate, Konsole sauber. Messlehren aus 4c gelten: auf den Kopfwechsel pollen,
  Hinweise erst nach `frisch` werten, nach einem Kinostart stabilisieren.
- 4d-11 zusätzlich: Rundgang über alle 138 Hochschuldateien und der strenge Dateitest.

## 9. Nicht-Ziele

- Keine Bibliothek für den Formelsatz (KaTeX, Temml, MathJax).
- Keine Gleichungsnummern, keine mehrzeiligen Umgebungen, keine Matrizen, keine Makros.
- Keine Bilder oder Abbildungen in Texten (unverändert aus 4c).
- Keine Literatur auf Grundschul- und Gymnasial-Tab, kein BibTeX-Export, keine eingebetteten
  Volltexte.
- Keine automatische Aktualisierung der Texte oder des Katalogs; das Prüfskript läuft nur von
  Hand.
- Kein maschineller Zahlenvergleich zwischen deutscher und englischer Fassung.
- Keine eigenen Themen für Magnetosphären und Atmosphären.
- Keine Mobilprüfung (bleibt Phase 5).
