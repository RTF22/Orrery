# Entstehungsgeschichte — Überblick und Chronik

Entwurf vom 25.09.2026. Zweiter Schritt der Reihe „Marketing und Präsentation“ nach der
zweisprachigen README (da9cfc7). Orrery entstand in 15 Tagen (11. bis 25.09.2026, 673 Commits,
Tags `v0.1.0` bis `v0.7.2`) vom Ursprungsprompt bis zur Seite unter `https://orrery3d.de`.
Diese Etappe schreibt die Geschichte dieses Wegs auf, für Leser auf GitHub.

Die Texte werben für zwei Dinge zugleich: für Orrery als Werkzeug der
**Wissenschaftskommunikation** und für einen Weg, **deterministisch arbeitende Anwendungen mit
nicht deterministisch arbeitenden Sprachmodellen als Werkzeug** zu bauen. Das zweite ist das
Leitmotiv beider Texte: Ein Sprachmodell liefert auf dieselbe Bitte nicht zweimal dasselbe und
irrt gelegentlich mit Überzeugung; das Ergebnis ist trotzdem reproduzierbar und überprüfbar,
weil jede Behauptung an einer Prüfung vorbei muss, die selbst deterministisch ist.

## 1. Ausgangslage

- **Material:** `docs/ursprungsprompt.md`; Gesamtentwurf und 54 weitere Entwürfe und Pläne in
  `docs/superpowers/`; rund 40 Abnahmeprotokolle `docs/*-abnahme.md` mit Messwerten, Rulings und
  Unschärfen; Git-Log mit Tags; `ASSETS.md`; die lokale Projektanleitung (nicht versioniert)
  als Gedächtnisstütze für Stand und Lehren.
- **README** (da9cfc7): Englisch als Standard, `README.de.md` Deutsch, Lehrinhalt und Quellen
  im Mittelpunkt, Entwicklerteil in `docs/entwicklung.md`.
- **Projektregel:** Produkt- und Herstellername des KI-Assistenten stehen bisher in keiner
  versionierten Datei (Ausnahme: ein Komponistenname).

## 2. Entscheidungen (Jens, 25.09.2026)

- Zwei Dokumente: ein **Überblick** (rund 6 Seiten) und eine **Chronik** (ab 10 Seiten), beide
  auf Deutsch und Englisch.
- Die KI-gestützte Entwicklung wird **offen und mit Produktnamen** beschrieben. Für die vier
  Dateien dieser Etappe gilt deshalb eine Ausnahme von der Wortregel; die lokale
  Projektanleitung vermerkt sie, die Baumkontrolle nimmt die vier Dateien aus. Commit-Texte
  bleiben ohne diese Wörter und ohne Trailer.
- **Repräsentative Screenshots** gehören hinein.
- **Doppelte Werbung** (Nachtrag, Jens): neben der Wissenschaftskommunikation auch die
  Entwicklung deterministischer Anwendungen mit nicht deterministischen Sprachmodellen (siehe
  Einleitung und §4a).

## 3. Dateien

| Datei | Inhalt |
|---|---|
| `docs/entstehung.de.md`, `docs/entstehung.en.md` | Überblick, wechselseitig verlinkt |
| `docs/chronik.de.md`, `docs/chronik.en.md` | Chronik, wechselseitig verlinkt |
| `docs/bilder/entstehung/*.jpg` | Screenshots, je rund 100 bis 250 kB, 1600×900 |

Die README verweist in beiden Sprachen auf den Überblick, der Überblick bei jeder Phase auf den
passenden Abschnitt der Chronik. Deutsch ist die Grundfassung, Englisch die Übersetzung;
Kennzahlen, Daten und Commit-Kürzel sind in beiden Fassungen gleich.

## 3a. Website `/doku/making-of/` (Nachtrag, Jens, 25.09.2026)

Die vier Texte sollen später auch auf der Website abrufbar sein, als Unterverzeichnis mit
Inhaltsverzeichnis und Navigation. Veröffentlicht wird erst mit eigener Freigabe (Deploy wie
bisher von Hand); gebaut wird die Seite in dieser Etappe.

- **Technik:** eigener kleiner Generator `scripts/doku-bauen.ts`, läuft am Ende von
  `npm run build` (nach `vite build`) und schreibt statisches HTML nach `dist/doku/`. Markdown
  wandelt die Bibliothek `marked` (devDependency, nur zur Bauzeit). Kein VitePress: Die Seite
  läuft unter `https://orrery3d.de/` und `https://www.jensfricke.com/Orrery/`, also mit zwei
  Basen; fertige Doku-Systeme verlangen eine feste Basis. Alle Verweise sind relativ.
- **Adressen:**

  | Pfad in `dist/` | Inhalt |
  |---|---|
  | `doku/index.html` | leitet auf `making-of/` weiter (verhindert die 500-Antwort des Servers für fehlende Dateien) |
  | `doku/making-of/index.html` | Sprachwahl: Browsersprache beginnt mit `de` → `de/`, sonst `en/`; ohne JavaScript zwei Links |
  | `doku/making-of/en/index.html`, `…/de/index.html` | Überblick |
  | `doku/making-of/en/chronik.html`, `…/de/chronik.html` | Chronik |
  | `doku/making-of/bilder/…` | Kopie der verwendeten Bilder aus `docs/bilder/` |

- **Gliederung:** eine Seite je Dokument. Kopfzeile mit „Orrery“ (Link zur Simulation),
  Sprachumschalter auf dieselbe Seite der anderen Sprache. Links eine feste Navigation mit
  beiden Dokumenten und dem Inhaltsverzeichnis der aktuellen Seite (Ebenen `##` und `###`),
  der aktuelle Abschnitt beim Lesen hervorgehoben; am Handy (schmaler als 900 px) einklappbar
  über einen Knopf. Inhalt höchstens rund 75 Zeichen breit, Tabellen waagerecht scrollbar,
  Bilder responsiv. Fußzeile mit Lizenzhinweis und Link zum Repository.
- **Sprungmarken:** dieselben `<a id="…">` wie auf GitHub; Verweise `chronik.de.md#x` werden
  zu `chronik.html#x`, `entstehung.de.md` zu `index.html`, Bildpfade auf `../bilder/…`, alle
  anderen Repository-Verweise auf `https://github.com/RTF22/Orrery/blob/master/…`.
- **Optik:** dunkles Thema in den Farben der App, Systemschrift, ausreichender Kontrast;
  kein externes Skript, keine Schriftart von außen, kein Tracking.
- **Suchmaschinen und Teilen:** `lang`, `<title>`, `meta description`, `hreflang`-Verweise
  zwischen den Sprachen, `og:title`, `og:description`, `og:image` (Saturn-Bild, relativ).
- **Wortregel:** Das erzeugte HTML liegt nur in `dist/` (nicht versioniert); Generator,
  Vorlage und Tests enthalten die Wörter nicht (Tests mit eigenen Beispieltexten).
- **Prüfung:** Vitest für Umwandlung, Inhaltsverzeichnis und Verweisumschreibung; nach dem
  Bau prüft ein Test oder Skriptlauf, dass jeder relative Verweis in `dist/doku/` auf eine
  vorhandene Datei und Sprungmarke zeigt. Sichtprüfung per Playwright gegen `vite preview`
  (Desktop 1600×900 und A55 412×915), Messwerte statt Eindrücke.

## 4. Überblick: Gliederung

1. **Die Idee:** Vision aus dem Ursprungsprompt (verlinkt), Interview, Gesamtentwurf.
2. **Zeitleiste:** Tabelle Datum, Meilenstein, Tag, Commits je Tag.
3. **Phasen:** je ein bis zwei Absätze mit Ziel, wichtigsten Entscheidungen, Ergebnis und
   Kennzahlen: 1–3 (Durchstich, Körper, Gürtel und Schatten), 4a–4d (Englisch, Links und
   Ansichten, Infopanel, Hochschultexte), 5 (Oberfläche, Mobile, Texturen, Musik),
   6 (Milchstraße), Info-Karte und Kleinigkeiten.
4. **Arbeitsweise: Mensch und KI:** Rollen (Jens: Richtung, Freigaben, Handprüfungen; der
   Assistent: Entwurf, Plan, Steuerung; Subagenten: Umsetzung und Prüfung, mit möglichst
   kleinen Modellen), der Ablauf Brainstorming → Entwurf → Plan → Umsetzung → Abnahme mit
   Rulings, Pixelmessungen statt Eindrücken, maschinelle Literaturprüfung.
5. **Deterministisch mit einem nicht deterministischen Werkzeug** (Kernkapitel, §4a).
6. **Was es gekostet hat:** Tokenbilanz (§4b).
7. **Lehren:** fünf bis acht, jede mit dem Anlass, aus dem sie entstand.
8. **Weg zur Domain:** privates Repository, öffentlich ab 19.09., Webspace per FTPS, HTTPS,
   `orrery3d.de` mit relativen Pfaden. Keine Zugangsdaten, keine Serverdetails.
9. **Kennzahlen:** Commits, Tests, Texte, Literatur, Bundlegröße, Texturstufen.

## 4a. Kernkapitel: deterministisch mit einem nicht deterministischen Werkzeug

Die Aussage: Nicht das Modell ist verlässlich, sondern das Netz aus Prüfungen um es herum. Das
Kapitel zeigt die Maschen dieses Netzes jeweils mit einem echten Fall aus den Protokollen
(was das Modell falsch lieferte, welche Prüfung es fing, was danach galt):

- **Physik gegen Referenzwerte:** Bahnpositionen gegen JPL-Horizons-Fixtures; die
  Simulation rechnet physikalisch, nur die Darstellung überhöht.
- **Tests als Vertrag:** Zahl der Tests im Verlauf (bis 5 402), `lint`, `tsc`, `build` vor
  jedem „fertig“; die Lehre, dass `npm test` keine Typen prüft.
- **Messen statt Anschauen:** Sichtprüfungen als Pixelwerte, Differenzbilder mit Kontrollbild
  ohne abweichende Pixel, angehaltene Uhr für reproduzierbare Aufnahmen.
- **Belege statt Behauptungen:** 761 Publikationen maschinell gegen Crossref und arXiv geprüft,
  Belegdateien je Hochschultext; „Kommentare im Code sind kein Beleg“; typische
  Modellfehler (Größenordnungen, Zuschreibungen von Zahlen zur falschen Arbeit, erfundene oder
  verwechselte Autoren) und wie die Prüfung sie fand.
- **Menschliche Tore:** Brainstorming, Entwurf, Freigabe, Plan; Rulings statt Rückfragen,
  gesammelt zur Bestätigung; Handprüfungen am echten Gerät.
- **Begrenzte Freiheit:** kleine Tasks je Session, ein Umsetzer gleichzeitig, eine
  Prüfrunde je Text, möglichst kleine Modelle und was geschah, als das kleinste Modell zweimal
  an Regeltreue scheiterte.
- **Determinismus in der App selbst:** reine Funktionen in `sim/`, Kinovariation aus einem
  Startwert, Zeitbereich mit festen Grenzen, Schichten mit einseitiger Abhängigkeit und
  Schichtentests.

Ehrlich bleiben: Das Kapitel nennt auch, was das Netz nicht fing oder erst spät fing (etwa
Baufehler, die erst in einem späteren Task auffielen, oder eine Gesamtabnahme, die irrte), und
die Grenzen des Modells, die im Code bleiben.

## 4b. Kosten in Tokens

Der Überblick bekommt einen Abschnitt „Was es gekostet hat“, die Chronik je Phase eine Zeile
mit dem Verbrauch. Nur Tokens, keine Geldbeträge (Jens, 25.09.2026).

- **Quelle:** die lokalen Sitzungsprotokolle des Assistenten zu diesem Projekt (60
  Hauptsitzungen und 759 Subagentenläufe, 11. bis 25.09.2026). Veröffentlicht werden nur
  Summen, nie Protokollinhalte.
- **Methode:** Jede Antwort des Modells zählt einmal, erkannt an ihrer Nachrichtenkennung; beim
  Streaming steht dieselbe Antwort mehrfach im Protokoll, gezählt wird je Feld der Höchstwert
  (die erste Zeile ist unvollständig, eine Probe ergab sonst für Sonnet 1,9 statt 23,8 Mio.
  Ausgabetokens). Getrennt ausgewiesen: Eingabe ohne Cache, Cache-Schreiben, Cache-Lesen,
  Ausgabe; je Modell, Hauptsitzung gegen Subagenten, je Tag und je Phase (Zuordnung über die
  Zeitstempel und die Zeitleiste des Faktenblatts).
- **Stichtag:** Upload des Domain-Fixes (f3807c7, 25.09.2026). Sitzungen danach (README,
  diese Etappe) stehen getrennt oder entfallen; der Text sagt, welches von beiden.
- **Einordnung:** Probezählung über alle Protokolle: rund 10,4 Mrd. Tokens Cache-Lesen,
  0,2 Mrd. Cache-Schreiben, 43 Mio. Ausgabe, 0,15 Mio. ungecachte Eingabe; Subagenten tragen den
  Großteil, Sonnet vor Opus. Der Text erklärt, warum das Lesen des Kontexts die Summe
  bestimmt und nicht das Schreiben von Code, was die Regeln „kleine Tasks“ und „möglichst kleine
  Modelle“ bewirkten und wie sich die Modellwahl im Verlauf änderte. Die endgültigen Zahlen
  kommen aus der Auswertung in Task 3, nicht aus dieser Probe.
- **Diagramm:** ein Bild Tokens je Tag nach Modell (gestapelt, ohne Cache-Lesen oder mit
  eigener Achse, damit die Ausgabe sichtbar bleibt), als PNG unter `docs/bilder/entstehung/`.
- **Grenzen:** Die Protokolle liegen nur lokal vor und sind nicht gegen eine Abrechnung
  abgeglichen; Zählweise und Stichtag stehen im Text, damit man die Zahlen einordnen kann.

## 5. Chronik

Dieselbe Reihenfolge, gegliedert nach Etappen. Je Etappe: Ziel, Entscheidungen und Rulings,
Messwerte, Fehler und Korrekturen, Commits und Tag. Unter „Fehler und Korrekturen“ steht
jeweils, welche Prüfung den Fehler fing; die Chronik ist damit die Fallsammlung, aus der §4a
seine Beispiele nimmt. Nur was in Git oder den Protokollen steht;
jede Zahl mit ihrer Fundstelle im Faktenblatt (§7).

## 6. Screenshots

- **Heutiger Stand** (Pflicht): sechs bis zehn Bilder, die Merkmale der Phasen zeigen, etwa
  Systemblick, Finsternis mit Schatten, Gürtel mit Kirkwood-Lücken, Infopanel mit
  Hochschultext und Formeln, Kompaktmodus am Handy, Milchstraße, Info-Karte. Aufnahme per
  Playwright am Entwicklungsserver, Bildinhalte an Pixelwerten geprüft (keine leeren oder
  unbeladenen Texturen).
- **Frühe Stände** (Versuch): zwei bis drei Bilder alter Tags (etwa `v0.1.0`, `v0.4.0`), aus
  `git archive` im Scratchpad gebaut und über einen eigenen Port ausgeliefert; kein Worktree im
  Projektverzeichnis. Scheitert der Bau oder kostet er mehr als einen Task, entfällt dieser Teil
  und die Chronik beschreibt die frühen Stände nur im Text.
- Bilder ohne persönliche Daten; die Texturen fallen unter die Lizenzen in `ASSETS.md`.

## 7. Quellen und Prüfung

- **Faktenblatt** im git-ignorierten Ledger: Zeitleiste, Kennzahlen je Tag, Tests und Bundle je
  Tag aus den Protokollen, jede Zeile mit Fundstelle (Commit oder Protokoll mit Abschnitt).
- **Fehlerkatalog** ebenda: Fälle, in denen ein Modell Falsches lieferte, mit Art des Fehlers,
  der Prüfung, die ihn fing, der Korrektur und der Fundstelle; dazu Fälle, die erst spät oder
  von Jens gefunden wurden.
- **Sitzungsprotokolle** des Assistenten liefern Sessions, Subagentenläufe und die
  Tokenbilanz (§4b). Das Auswerteskript liegt im Scratchpad beziehungsweise Ledger, nicht im
  Repository (es liest benutzerlokale Pfade); seine Zählweise beschreibt der Text.
- **Eine Fachprüfung** beider deutschen Texte gegen Git und Protokolle, eine Nacharbeit;
  Restbefunde ins Abnahmeprotokoll.
- **Vor dem Commit:** Links auf existierende Dateien, Baumkontrolle mit der Ausnahme, keine
  Zugangsdaten, `lint`, `tsc`, `test`, `build`.

## 8. Tasks

1. Faktenblatt aus Git und Protokollen.
2. Fehlerkatalog aus den Protokollen (§7 Unschärfen, Nacharbeiten, Lehren).
3. Tokenbilanz aus den Sitzungsprotokollen (§4b) mit Diagramm.
4. Screenshots heutiger Stand; Versuch mit frühen Ständen.
5. Chronik Deutsch, Teil 1: Idee bis Phase 3.
6. Chronik Deutsch, Teil 2: Phasen 4a bis 4c.
7. Chronik Deutsch, Teil 3: Phase 4d und Nachführung.
8. Chronik Deutsch, Teil 4: Phase 5 bis zur Domain.
9. Überblick Deutsch, aus der Chronik verdichtet, mit Kernkapitel §4a und Kosten §4b.
10. Fachprüfung beider deutschen Texte und Nacharbeit.
11. Überblick Englisch.
12. Chronik Englisch (bei Bedarf zwei Tasks).
13. Doku-Generator mit Tests (§3a).
14. Seitenvorlage, Sprachwahl, Sichtprüfung (§3a).
15. Verlinkung aus der README (in beiden Sprachen mit beiden Werbeaussagen), Ausnahme in der
    Baumkontrolle, Abnahmeprotokoll.

Je Task ein Commit; immer nur ein Umsetzer-Subagent; Texte und Prüfung auf Sonnet.
Veröffentlichung: Push nach Freigabe. Die Website `/doku/making-of/` geht erst mit einem eigenen, freigegebenen Deploy online (der nächste `npm run deploy` lädt sie mit hoch).
