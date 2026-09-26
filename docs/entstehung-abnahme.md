# Abnahme Entstehungsgeschichte

## 1. Umfang

Plan `docs/superpowers/plans/2026-09-25-entstehung.md` (25.09.2026, Entwurf
`docs/superpowers/specs/2026-09-25-entstehung-design.md`): eine zweisprachige
Entstehungsgeschichte des Projekts, zugleich als Beleg für zwei Behauptungen gedacht —
Orrery als Werkzeug der Wissenschaftskommunikation, und der beschriebene Arbeitsablauf als
Weg, mit einem nicht deterministisch arbeitenden Sprachmodell eine deterministische,
überprüfbare Anwendung zu bauen.

Vier neue Textdateien: `docs/entstehung.de.md`/`docs/entstehung.en.md` (Überblick) und
`docs/chronik.de.md`/`docs/chronik.en.md` (Chronik, Einzelheiten je Etappe mit Commit-Kürzeln
und Fundstellen). Dazu elf Bilder unter `docs/bilder/entstehung/` (zehn Screenshots und ein
Diagramm), ein Generator `scripts/doku-bauen.ts` mit Vorlage `scripts/doku-vorlage.ts`, der
die vier Texte bei jedem `npm run build` als statische Seiten unter `dist/doku/making-of/`
erzeugt (Sprachwahl nach Browsersprache, Standard Englisch) und alle Verweise prüft, sowie die
Verlinkung aus beiden READMEs und der Entwicklerdoku.

26 Commits auf dem Branch `entstehung` (ab `master` `da9cfc7` bis zu diesem Protokoll
`22583fe`) in 15 Tasks:

1. **Entwurf und Plan** (`602705b`…`cb676af`): Design-Dokument, Implementierungsplan,
   Entscheidung für die Website unter `/doku/making-of/`.
2. **Faktenblatt, Fehlerkatalog, Tokenbilanz** (Tasks 1–3, `621e294`): Zeitleiste,
   Phasengrenzen, Kennzahlen und Entscheidungen je Etappe recherchiert; 37 Fehlerfälle mit
   Fundstelle und fangender Prüfung katalogisiert; Sitzungsprotokolle des Assistenten zu
   Tokenmengen je Tag, Phase und Modell ausgewertet, Diagramm `tokens-je-tag.svg`.
3. **Screenshots** (Task 4, `6281ceb`): zehn Bilder mit Pixelmessung (Helligkeit, Kontrast,
   Differenzbild).
4. **Chronik Deutsch** (Tasks 5–8, `95cf7c7`…`4914aa3`, je mit Nachbesserung): alle 19
   Etappen-Abschnitte, Fehlerkatalog- und Faktenblatt-Fundstelle je Absatz, Anhang Tokenbilanz.
5. **Überblick Deutsch** (Task 9, `677f2ac`, Fachprüfung und Nacharbeit `caf9c6c`): verdichtete
   Fassung mit Kernkapitel (sieben „Maschen“ plus „Was das Netz nicht fing“), Kostenabschnitt,
   Lehren.
6. **Englische Fassung** (Tasks 11–12, `24c0920`…`dd33a85`): Überblick und Chronik übersetzt,
   Zahlenabgleich gegen das Deutsche in beiden Sprachen ohne unerklärte Abweichung.
7. **Doku-Generator und -Vorlage** (Tasks 13–14, `1ecacef`…`b0d63a9`, je mit
   Nachbesserungsrunden): Markdown zu statischen Seiten, Navigation, Sprachwahl,
   Barrierefreiheit, Sichtprüfung Desktop/A55.
8. **Verlinkung und Abnahme** (Task 15, dieses Protokoll): READMEs, Entwicklerdoku, dieses
   Dokument; zwei Stilstellen in `docs/chronik.en.md` aus Ruling 57 nachgezogen.

Die Wort- und Trailerprüfung vor jedem Commit erfolgte wie in der lokalen Projektanleitung
beschrieben, Ergebnis durchgehend `ok`.

## 2. Zahlen

### Texte

| Datei | Wörter (`wc -w`) |
|---|---:|
| `docs/entstehung.de.md` | 2 791 |
| `docs/entstehung.en.md` | 3 269 |
| `docs/chronik.de.md` | 6 327 |
| `docs/chronik.en.md` | 7 177 |

### Bilder (`docs/bilder/entstehung/`)

| Datei | Größe |
|---|---:|
| `systemblick.jpg` | 225 728 Bytes |
| `mondfinsternis.jpg` | 191 882 Bytes |
| `guertel.jpg` | 209 062 Bytes |
| `ferne-sonne.jpg` | 261 045 Bytes |
| `explorer.jpg` | 284 439 Bytes |
| `infopanel-hochschule.jpg` | 284 631 Bytes |
| `infokarte.jpg` | 175 014 Bytes |
| `kompakt-handy.jpg` | 65 861 Bytes |
| `alt-v0.1.0.jpg` | 116 247 Bytes |
| `alt-v0.4.0.jpg` | 276 705 Bytes |
| `tokens-je-tag.svg` | 13 063 Bytes |

`explorer.jpg` ist Teil der Bildliste, wird laut Ruling 33 aber in keinem Text verwendet
(Bildplatz in der passenden Etappe bereits durch `alt-v0.4.0.jpg` belegt).

### Tokenbilanz (nur Tokens, keine Beträge; Zeile „Je Modell bis Stichtag“ aus `tokenbilanz.md`
im Ledger, Stichtag Commit `f3807c7`, 25.09.2026)

| Größe | Wert |
|---|---:|
| Antworten insgesamt | 44 895 |
| Eingabe ohne Cache | 152 983 |
| Ausgabe | 42 895 483 |
| Cache-Lesen | 10 413 606 524 |
| Cache-Schreiben | 200 194 976 |
| Gesamt (vier Kategorien) | rund 10,7 Mrd. |
| Anteil Cache-Lesen daran | rund 98 % |
| Anteil Subagentenläufe (alle vier Kategorien) | rund 82,7 % |
| Anteil Antworten auf dem mittleren Modell | rund 65 % |
| Anteil Antworten auf dem größten Modell | rund 23 % |

Die übrigen Antworten liefen auf zwei weiteren Modellfassungen und, für rein mechanische
Bereinigungen, dem bewusst kleinsten Modell (Zuordnung siehe Tabelle „Je Modell bis Stichtag“
in `tokenbilanz.md`, Ledger). Die vollständige Aufschlüsselung nach Tag, Phase und Modell mit
Anzeigenamen steht — als Teil der Ausnahme der Wortregel — im
[Anhang der Chronik](../docs/chronik.de.md#anhang-tokens).

### Tests und Hauptchunk

| Größe | Vorher (`master`/Branchbeginn `cb676af`) | Nachher (`b0d63a9` + Schritt 5) |
|---|---:|---:|
| Tests | 5 402 (127 Testdateien) | 5 435 (129 Testdateien) |
| Hauptchunk | 1 557,08 kB (gzip 430,04 kB) | 1 557,08 kB (gzip 430,04 kB) |

Der Hauptchunk ist unverändert: Die vier Texte, die Bilder und der Doku-Generator laufen
außerhalb des Vite-Bündels (eigener Node-Lauf nach `vite build`, schreibt nach
`dist/doku/making-of/`). Der Testzuwachs (+33) stammt aus `scripts/doku-vorlage.test.ts` und
`scripts/doku-bauen.test.ts` (Tasks 13/14).

## 3. Prüfungen

**Ablauf:** Fachprüfung der Fakten (Task 10) nach dem deutschen Überblick, eine gebündelte
Nacharbeit (Rulings 48–51); danach je eine Prüfrunde für die englische Übersetzung des
Überblicks (Task 11) und für beide Teile der englischen Chronik (Task 12a/12b, 0 Critical/
Important in allen drei Prüfungen); am Generator drei Nachbesserungsrunden (Task 13, Rulings
59/60 zur Inhaltsverzeichnis-Erkennung und zum Zeilenende), an der Vorlage eine
Nachbesserungsrunde (Task 14, Ruling 60a: `white-space: nowrap` auf rechtsbündige Zellen
verengt, behebt eine Desktop-Regression der Zeitleisten-Tabelle im Überblick, ohne die
Tokenbilanz-Tabelle in der Chronik wieder umbrechen zu lassen).

### Schritt 2 (Datenschutz und Wortregel)

```
bash .superpowers/sdd/2026-09-25-entstehung/pruefe.sh
ok
```

### Schritt 3 (Links)

Vorgesehener Befehl (Dateiexistenz und Sprungmarken je Verweis in den sechs Dateien
`README.md`, `README.de.md`, `docs/entstehung.{de,en}.md`, `docs/chronik.{de,en}.md`):
Ausgabe leer, keine `FEHLT`- oder `MARKE FEHLT`-Zeile.

### Zahlenabgleich Deutsch/Englisch (Tasks 11/12a/12b, Ledger `progress.md`)

Befehl je Textpaar:

```
norm() { grep -oE '[0-9][0-9 .,]*[0-9]|[0-9]' "$1" | tr -d ' .,' | sort; }
diff <(norm <Datei DE>) <(norm <Datei EN>)
```

- **Überblick** (Task 11): 0 unerklärte Abweichungen; alle Reste auf das von vornherein
  erwartete Datumsformat zurückgeführt (Deutsch `TT.MM.JJJJ` als eine Ziffernfolge, Englisch
  `TT Monat JJJJ` am Monatsnamen getrennt).
- **Chronik, Teil 1** (Task 12a, Abschnitte `idee` bis `nachfuehrung-4d`): 183 Diff-Zeilen, nach
  aggregierter Gegenzählung je Tokenwert vollständig auf Datumsformat und zwei
  Komma-/Bindestrich-Artefakte des `norm()`-Musters zurückgeführt, kein Zahlenfehler.
- **Chronik, Teil 2** (Task 12b, Abschnitte `phase-5` bis `anhang-tokens`): 63 Diff-Zeilen,
  dieselben zwei Ursachen plus ein neues, gleichartiges Artefakt an einer Zeilenumbruchstelle;
  Abgleich über die ganzen Dateien (237 Diff-Zeilen) bestätigt: keine unerklärte Zeile.

In allen drei Abgleichen wurde keine ausgeschriebene Zahl abweichend wiedergegeben und kein
Wert anders gerundet.

### Sichtprüfung Task 14 (Doku-Seiten, Playwright + Pixelmessung)

Abweichung von der Erwartung: `npx vite preview` liefert die Basis `/Orrery/` (nicht `./`), weil die
Weiche in `vite.config.ts` nur beim tatsächlichen `build`-Kommando greift; alle Messungen
verwenden deshalb `http://localhost:4173/Orrery/doku/making-of/…` (Beleg: `curl` auf beide
Pfade, Preview-Log-Zeile).

| Prüfung | Sollwert | Messwert | Bestanden |
|---|---|---|---|
| Sprachwahl `de-DE` | landet auf `…/de/` | `…/making-of/de/` | ja |
| Sprachwahl `en-US` | landet auf `…/en/` | `…/making-of/en/` | ja |
| Desktop 1600×900, Navigationsbreite | 260–300 px | 280 px | ja |
| Desktop 1600×900, Textspalte | ≤ 72ch | 72,0ch | ja |
| Scrollen zu `#phase-4d` | ToC-Eintrag `aria-current="location"` | gesetzt | ja |
| A55 412×915, Navigation vor Tipp | verborgen | verborgen (Rechteck außerhalb) | ja |
| A55: Knopf „Inhalt“ | sichtbar, ≥ 44 px hoch | 44 px | ja |
| A55: Navigation nach Tipp auf Knopf/Eintrag | sichtbar / wieder zu | erfüllt | ja |
| A55: Seitenbreite (`scrollWidth`) | ≤ 412 | 412 | ja |
| A55: breite Tabelle (Anhang Tokenbilanz) im eigenen Rahmen | scrollt im Rahmen | 473 > 378 | ja |
| Kontrast Text/Grund | Verhältnis ≥ 7 | 16,30 | ja |
| Konsole/Netzwerk | keine Fehler, keine 404 | keine | ja |

Nachbesserungsrunde (Ruling 60a, Important aus der Prüfung): `white-space: nowrap` traf zunächst
auch die Fließtextspalte „Meilenstein“ der Zeitleisten-Tabelle im Überblick (Desktop-Regression);
nach Verengung auf rechtsbündige Zellen (`[align="right"]`, von `marked` bereits für
GFM-Spalten mit `---:` gesetzt) Nachmessung: Zeitleiste Desktop 587=587 (kein Scrollen mehr),
Tokenbilanz-Tabelle A55 weiterhin 457 > 378 (im Rahmen), Seitenbreite 412, Escape schließt die
Navigationsschicht und gibt den Fokus zurück. Drei Minor-Befunde in derselben Runde mitbehoben
(totes `classList.add('js')`, doppelte Konstanten, Escape-Verhalten).

### Eigener Lauf (Schritt 5, heute)

```
npm run lint            # ohne Befund
npx tsc -b --noEmit      # ohne Befund
npm test                 # Test Files 129 passed (129); Tests 5435 passed (5435)
npm run build            # Hauptchunk 1 557,08 kB (gzip 430,04 kB); dist/doku/making-of/{de,en}
                          # erzeugt, pruefeVerweise ohne Befund
```

### Schlussprüfung

Eine abschließende, vom Task-15-Umsetzer unabhängige Prüfung des gesamten Branches
(`da9cfc7`…`22583fe`) kommt zum Ergebnis „bereit zum Zusammenführen nach Handprüfung: ja“;
0 Critical, 1 Important (die Commitzahl in diesem § 1, hier bereits berichtigt), 4 Minor,
geparkt (in § 7 geführt oder dort ergänzt). Alle geprüften Kriterien zu Wortregel,
Datenschutz, Trailer, kaputten Verweisen und dem Zusammenspiel von Generator, Vorlage,
Deploy-Skript und `.htaccess` sind erfüllt.

## 4. Lizenz

Alle elf Bilder sind eigene Aufnahmen der App (Screenshots) beziehungsweise ein eigenes
Diagramm, keine neuen Fremddateien. Gezeigt werden Texturen, deren Herkunft und Lizenz bereits
in `ASSETS.md` dokumentiert ist (Solar System Scope, CC BY 4.0); `ferne-sonne.jpg` zeigt
zusätzlich die Milchstraßenkarte mit Gaia-Datenanteil (CC BY-NC 3.0 IGO, ebenfalls in
`ASSETS.md` sowie `docs/phase6-abnahme.md` dokumentiert). `tokens-je-tag.svg` ist ein selbst
erzeugtes Diagramm ohne Fremdanteil. Keine Lizenzangabe in `ASSETS.md` musste geändert werden.

## 5. Handprüfung (Jens)

| Prüfpunkt | Ergebnis |
|---|---|
| GitHub-Darstellung des Überblicks und der Chronik, Deutsch, hell und dunkel | ohne Befund (Jens, 26.09.2026) |
| GitHub-Darstellung des Überblicks und der Chronik, Englisch, hell und dunkel | ohne Befund (Jens, 26.09.2026) |
| Doku-Seiten lokal (`npx vite preview`) am PC | ohne Befund (Jens, 26.09.2026) |
| Doku-Seiten lokal (`npx vite preview`) am Handy | ohne Befund (Jens, 26.09.2026) |

## 6. Rulings

Rulings aus `progress.md`, in Reihenfolge; Modellnamen umschrieben (mittleres/größtes/kleines
Modell statt Markenname).

1. Tokenbilanz führt je Modell Kennung und Anzeigenamen; die vier Texte (Ausnahme der
   Wortregel) nutzen die Anzeigenamen, das Diagramm den Namen ohne Herstellerpräfix — kostet,
   falls falsch: Namen in den Texten nachziehen.
2. Task 1/2 werden anhand der Ledgerdateien geprüft, nicht per Diff, da kein Commit entsteht —
   kostet, falls falsch: nichts.
3. Die Prüfung der Texttasks 5–12 ist die eine Prüfrunde je Text; die Fachprüfung der Fakten
   folgt gesondert in Task 10 — kostet, falls falsch: Restbefunde fallen erst in Task 10 auf.
4. Abgrenzung „Beginn“/„Ende“ je Phasengrenzen-Kennung: erster Entwurfs-/Plan-Commit bis
   letzter erkennbar zugehöriger Abnahme-/Nacharbeits-Commit — kostet, falls falsch: einzelne
   Ende-Zeitstempel um wenige Commits verschieben.
5. `phase-3a` schließt den eingeschobenen Zwischenschritt „Zielbelichtung und Albedo“ ein, ohne
   eigene Kennung — kostet, falls falsch: eigene Zeile nachtragen.
6. „domain“ umfasst nur die zwei Commits des Domain-Fixes, ohne eigenes Abnahmeprotokoll —
   kostet, falls falsch: Zeile um weitere Commits erweitern.
7. `git tag -l` liefert bei annotierten Tags das Tag-Objekt statt des Commits; Faktenblatt nennt
   in der Spalte „Tag“ den tatsächlichen Commit — kostet, falls falsch: nichts, bereits
   korrigiert.
8. „Gefangen durch: Controller-Prüfung“ für zwei gescheiterte Nachführungs-4d-Läufe vor einer
   förmlichen Fachprüfung — kostet, falls falsch: zwei Zeilen auf „Fachprüfung“ umstellen.
9. „Gefangen durch: Fachprüfung“ verallgemeinert auch für Code-Reviews vor einem Merge — kostet,
   falls falsch: mehrere Zeilen bräuchten eine bislang nicht vorgesehene neue Kategorie.
10. Kategorie „Gefangen durch: Test“ bleibt bei 0 Fällen, kein erfundener Fall ergänzt — kostet,
    falls falsch: eine Textstelle dürfte diese Kategorie nicht mit einer Beispielzahl belegen.
11. Zwei Katalogzeilen, die einen Fehler der Prüfung selbst statt des Text-Umsetzers
    beschreiben, wurden fürs Leitmotiv aufgenommen — kostet, falls falsch: beide Zeilen als
    Sonderfall kennzeichnen oder entfernen.
12. Antworten mit Ortszeit vor Beginn der ersten Phasengrenzen-Zeile zählen zu dieser ersten
    Phase statt zu einer eigenen Vorphase — kostet, falls falsch: 28 Antworten in eine neue
    Zeile davor verschieben.
13. Die Sitzungszählung berücksichtigt nur Protokolldateien mit mindestens einer auswertbaren
    Antwort, nicht jede vorhandene Datei — kostet, falls falsch: Sitzungssummen um zehn Dateien
    erhöhen.
14. Phasenzuordnung der Tokens: Antwort gehört zur zuletzt begonnenen Phase, deren Intervall den
    Zeitpunkt enthält, sonst zur Phase mit dem spätesten Ende davor — kostet, falls falsch: Je-
    Phase-Zeilen neu erzeugen.
15. Die Achsenfarbe im Diagramm bleibt trotz einer zu optimistischen Kontrastangabe im
    Zwischenbericht — kostet, falls falsch: eine Farbzeile im Diagramm.
16. Eine Nacharbeit lief parallel zum Umsetzer der nächsten Task (nur Ledgerdateien, kein
    Browser) — kostet, falls falsch: nichts am Repository.
17. Ein Mondfinsternis-Bild wurde durch direktes Setzen des Datums auf eine gesuchte totale
    Finsternis erzeugt statt durch Ablaufenlassen des Kinos — kostet, falls falsch: Bild mit dem
    ursprünglich vorgesehenen Ablauf neu aufnehmen.
18. Für dasselbe Bild wurde die Helligkeit für die Aufnahme angehoben (danach zurückgesetzt), um
    die Kontrastbedingung zu erfüllen — kostet, falls falsch: Bild bei Standardhelligkeit neu
    aufnehmen.
19. Für zwei Bilder wurde ein von einer früheren Sitzung übernommener Panel-Zustand einmalig auf
    den Store-Standard zurückgesetzt — kostet, falls falsch: nichts am Repository.
20. Ein Bild bleibt unter dem vorgegebenen Größenband, weil die vorgeschriebene Auflösung als
    bindender behandelt wurde als die Qualitätsvorgabe — kostet, falls falsch: Bild mit höherer
    Qualität neu speichern.
21. Ein deutscher Alt-Text übernimmt den englischen Reiternamen wörtlich, weil der Bildinhalt
    selbst englisch ist — kostet, falls falsch: ein Wort.
22. — (nicht vergeben)
23. — (nicht vergeben)
24. *(ersetzt durch Ruling 29)* Tokens-Zeile je Etappe nannte Anteil Subagenten und
    vorherrschendes Modell zunächst projektweit statt je Phase.
25. Entscheidungen aus dem Ursprungsinterview wurden auf die Abschnitte „Die Idee“ und
    „Phase 1“ aufgeteilt, „Phase 2“ verweist zurück — kostet, falls falsch: Zuordnung
    verschieben.
26. Für eine Etappe ohne eigene Kennzahlenzeile im Faktenblatt sagt die Chronik das ausdrücklich,
    statt ersatzweise eine andere Etappe zuzuschreiben — kostet, falls falsch: Kennzahl
    nachtragen, sobald verfügbar.
27. Das Überschriftformat lässt den Tag-Teil weg, wenn eine Etappe keinen eigenen Tag trägt, und
    nennt bei eintägigen Etappen nur ein Datum — kostet, falls falsch: fünf Überschriften
    umformatieren.
28. Der Zwischenschritt „Zielbelichtung und Albedo“ steht mit seinen Commits in einem
    Etappenabschnitt, sein Entscheidungsinhalt mit Verweissatz im nächsten — kostet, falls
    falsch: Entscheidungssatz verschieben.
29. Ersetzt Ruling 24: Die Tokenbilanz führt je Phase Anteil Subagenten und vorherrschendes
    Modell, die Chronik nutzt diese Phasenwerte statt projektweiter — kostet, falls falsch: eine
    Zusatztabelle.
30. Die Texte zitieren aus der Tokenbilanz nur stichtagsfeste Abschnitte, nicht die mit der
    laufenden Sitzung wachsenden — kostet, falls falsch: nichts.
31. Feste Reihenfolge der 19 Chronik-Abschnitte; eingeschobene Etappen stehen nach der Phase, in
    der sie begannen — kostet, falls falsch: Inhaltsverzeichnis umstellen.
32. Ein Fehlerkatalog-Fall wird im Zielabsatz einer eingeschobenen Etappe als „gefangen durch die
    Fachprüfung" genannt, eine spätere Etappe nennt denselben Fall aus Sicht des Fundes — kostet,
    falls falsch: Zielabsatz kürzen, Verweis nur der späteren Etappe überlassen.
33. Ein Bild aus der Bildliste wird in dieser Etappe nicht verwendet, da der einzige erlaubte
    Bildplatz des passenden Abschnitts bereits belegt ist — kostet, falls falsch: Bild
    nachträglich ergänzen.
34. Eine Commit-Reihenfolge in einer Etappen-Commitliste wurde ohne exakte Zeitstempelprüfung
    angenommen — kostet, falls falsch: Reihenfolge vertauschen, ohne Wirkung auf den Fließtext.
35. Prüfungsbefunde zu einer Etappe wurden erst nach Abschluss der nächsten, dieselbe Datei
    ändernden Etappe gebündelt nachgebessert — kostet, falls falsch: eine spätere statt frühere
    Nachbesserung.
36. Eine im Text genannte Fallzahl je Kennung ist eine eigene Zählung dieser Sitzung, keine im
    Material selbst ausgewiesene Summe — kostet, falls falsch: Zahl und Aufteilung neu zählen.
37. Fünf erst durch eine spätere Gesamtabnahme gefundene Fälle werden im ursprünglichen
    Etappenabschnitt nur benannt und auf die Nachführungs-Etappe verwiesen, dort mit Zahlen und
    Commits ausgeführt — kostet, falls falsch: Befunde vollständig verschieben.
38. Ein im Fundstellenzitat genannter Commit wird ausdrücklich dem verworfenen Hilfsbranch
    zugeordnet, nicht der anschließenden erfolgreichen Nacharbeit — kostet, falls falsch: ein
    Kürzel im entsprechenden Abschnitt austauschen.
39. Ein Fehlerkatalog-Fall wurde berichtigt und um einen neuen Fall ergänzt, der die frühere
    unvollständige Zuschreibung selbst beschreibt — kostet, falls falsch: nichts, an Git belegt.
40. Eine Anhang-Tabelle zeigt nur drei Spalten statt vier, um im vorgegebenen Wortband zu
    bleiben; die vierte Angabe steht bereits im Fließtext — kostet, falls falsch: Spalte
    nachtragen, Wortzuwachs steigt dann über das Band.
41. Ein Abschnitt zum Weg zur Domain nennt auch drei zeitlich frühere Meilensteine, nicht nur die
    zwei Commits der engeren Phasengrenzen-Zeile — kostet, falls falsch: drei frühere Commits
    streichen.
42. Zwei Fakten stehen nur in einem Abschnitt, nicht zusätzlich in einem inhaltlich verwandten
    zweiten — kostet, falls falsch: einen Satz im zweiten Abschnitt ergänzen.
43. Ein Alt-Text zum Diagramm übernimmt dessen eigenes `aria-label` wörtlich, keine neue
    Behauptung — kostet, falls falsch: Alt-Text umformulieren.
44. Sieben Fehlerkatalog-Fälle wurden den sieben „Maschen“ des Kernkapitels zugeordnet, entweder
    über eine eindeutige Alleinstellung in einer Kategorie oder inhaltliche Passung — kostet,
    falls falsch: andere Fallnummern vermerken, der Fließtext selbst nennt keine Nummern.
45. Der Kennzahlen-Abschnitt des Überblicks nennt Testzahl und Hauptchunk aus der aktuellsten
    Faktenblatt-Zeile, nicht aus der letzten Etappenzeile, da diese Zeile den auf der Seite
    genannten Stand nach dem Domain-Fix trifft — kostet, falls falsch: Hauptchunk-Wert
    zurücksetzen.
46. Derselbe Abschnitt nennt keine Katalogzahlen zu Körpern, Szenen oder Themen, da keine der
    drei Ledgerdateien dafür eine Fundstelle liefert — kostet, falls falsch: Zahlen ergänzen,
    sobald belegt.
47. Die im Kostenabschnitt genannten Modell- und Gesamtanteile sind eigene Berechnungen dieser
    Sitzung aus der Modelltabelle, keine im Material ausgewiesene Summenzeile — kostet, falls
    falsch: die berechneten Prozentzahlen neu runden oder streichen.
48. Ein Fachprüfungsbefund zu einer fehlenden Fundstelle wurde als fehlender Beleg behandelt,
    nicht als Falschangabe, da die Angabe öffentlich nachprüfbar ist — kostet, falls falsch: ein
    Satz in zwei Dateien.
49. „Keine Prozesssprache“ gilt für Verweise auf unveröffentlichte Arbeitsdateien und
    internen Verfahrensjargon, nicht für Rulings/Tasks als selbst erklärten Gegenstand der
    Entstehungsgeschichte — kostet, falls falsch: Begriffe durch Umschreibungen ersetzen.
50. Belege dürfen in der Nacharbeit nachgetragen werden, wenn die Fundstelle eine versionierte
    Datei, `git log` oder ein geöffnetes Manifest ist; sonst wird die Angabe gestrichen — kostet,
    falls falsch: Nachträge wieder streichen, Texte ändern sich an denselben Stellen.
51. Keine zweite Prüfrunde nach der Nacharbeit einer Texttask (Regel: höchstens eine Prüfrunde je
    Text) — kostet, falls falsch: ein Fehler aus der Nacharbeit fällt erst in einer späteren
    Task oder der Abnahme auf.
52. Ein Reitername der Info-Karte wurde in drei Dateien berichtigt (der tatsächliche Name weicht
    vom Entwurfstitel ab) — kostet, falls falsch: drei Wörter zurücksetzen.
53. Eine Übersetzungs-Task lief wegen ihrer Länge in zwei Aufträgen, die Prüfung des ersten Teils
    parallel zum zweiten Teilschritt, ihre Befunde gingen in dessen Nacharbeit — kostet, falls
    falsch: Befunde eine Runde später eingearbeitet.
54. Bildunterschriften zu bereits im Überblick verwendeten Aufnahmen übernehmen dessen englischen
    Alt-Text wörtlich statt einer im Ledger vorgeschlagenen, leicht abweichenden Fassung —
    kostet, falls falsch: zwei Alt-Texte zurücksetzen.
55. „Nacharbeit“ (Korrekturrunde) wird durchgängig anders übersetzt als „Nachführung“
    (Etappenname), um beide im Englischen unterscheidbar zu halten — kostet, falls falsch: eine
    der beiden Übersetzungen durchgängig ersetzen.
56. Wörtliche Zitate aus deutschen Quellen werden sinngemäß in indirekter Rede ohne
    Anführungszeichen übersetzt, nicht als vermeintlich wörtliches Zitat — kostet, falls falsch:
    drei Stellen zurück in Anführungszeichen setzen, mit dem Risiko, dann fälschlich einen
    wörtlichen deutschen Wortlaut als Englisch auszugeben.
57. Zwei kostengünstige Stilbefunde aus zwei Übersetzungsprüfungen werden erst in dieser Task
    nachgezogen statt in einer eigenen Nacharbeitsrunde — kostet, falls falsch: zwei
    Stilstellen bleiben länger stehen (in dieser Task erledigt, siehe § 1).
58. Relative Verweise auf Dateien oder Ordner unter `docs/`, die nicht in der Umschreibetabelle
    stehen, werden beim Bau zu GitHub-Verweisen, wie die bereits vorgesehenen Fälle — kostet,
    falls falsch: die betroffene Datei müsste als eigene Seite mitgebaut werden.
59. Das Inhaltsverzeichnis der gebauten Seiten bezieht seine Überschriften aus dem
    Markdown-Lexer statt aus einer eigenen Zeilenerkennung, damit beide nie auseinanderlaufen —
    kostet, falls falsch: etwas langsamerer Bau, eine eigene Erkennung bliebe als Alternative.
60. `white-space: nowrap` auf Tabellenzellen verhindert, dass eine breite Tabelle bei schmaler
    Bildschirmbreite in ihren Rahmen umbricht, statt zu scrollen — kostet, falls falsch: schmale
    Handys zeigen mehr abgeschnittenen Zelleninhalt vor dem ersten Scrollen.
60a. Nachbesserung zu Ruling 60: die Regel gilt nur für rechtsbündige Zellen, damit eine
    Fließtextspalte einer anderen Tabelle nicht dieselbe Regression bekommt — behebt eine
    Desktop-Regression, ohne die ursprüngliche Tabelle wieder umbrechen zu lassen.

## 7. Offene Punkte

- Faktenblatt: eine Etappe ohne eigene Kennzahlenzeile, eine weitere ohne Entscheidungsblock
  (Quellen enthalten keinen); im Ledger ggf. mit einem „—“-Hinweis zu ergänzen.
- Fehlerkatalog-Bericht: eine Kennungszahl und eine Kopfzeilenbeschriftung im Ledger-internen
  Bericht ungenau (Fehlerkatalog selbst unbetroffen).
- Diagrammskript (`tokenbilanz.py`): Median bei gerader Anzahl bildet den oberen statt den
  mittleren Wert; eine Prüfsumme vergleicht nur Summen, keine Einzelwerte; ein
  Typprüfungs-Hinweis zu einem möglichen `None`-Wert ohne Laufzeitfehler; Legendenfarbe Gelb
  gegen Weiß im Diagramm mit rund 2,2:1 Kontrast (Kontur, kein Fließtext).
- `mondfinsternis.jpg`: gemessene Standardabweichung liegt mit angehobener Helligkeit knapp über
  der Schwelle (Ruling 18); `kompakt-handy.jpg` bleibt mit rund 64 kB unter dem vorgesehenen
  Größenband von 80–300 kB (Ruling 20).
- `fehlerkatalog.md`: eine Tabellenzeile im Ledger mit einer nicht maskierten Trennlinie
  (Spaltenzählung dort betroffen, kein Zahlenwert in den veröffentlichten Texten).
- **Galaxy A55 vs. A55** (`docs/chronik.de.md`, Abschnitt Info-Karte): Die Fachprüfung schlug die
  knappere Kürzung auf „A55“ vor, im Text steht weiterhin der volle Gerätename mit
  nachgetragener Fundstelle — offen, ob das so bleibt oder gekürzt wird.
- **„Ohne GitHub Pages“**: eine entsprechende Aussage wurde mangels eines belegenden Commits
  ersatzlos aus beiden Texten gestrichen; falls eine solche Entscheidung tatsächlich getroffen
  wurde, könnte sie mit Fundstelle wieder aufgenommen werden.
- Ein Bericht zum deutschen Überblick zählte die Anführungszeichen versehentlich als 12/12 statt
  tatsächlich 11/11 (der Text selbst ist bereits ausbalanciert, nur eine Ungenauigkeit im
  Ledger-Bericht).
- Ein Bericht zu einer Übersetzungs-Task zählte einen Zahlenrest versehentlich zum Datumsformat,
  obwohl es sich um eine korrekt übersetzte ausgeschriebene Zahl handelt (Text selbst
  unbetroffen, nur eine Ungenauigkeit im Ledger-Bericht).
- Eine vierte Stelle, an der ein wörtliches deutsches Zitat in indirekte Rede übersetzt wurde,
  fehlt im entsprechenden Prüfbericht (inhaltlich unbedenklich, im Text selbst korrekt).
- Generator (`scripts/doku-bauen.ts`): Der Bildzweig trennt Anker und Abfragezeichen von
  Bildpfaden nicht ab (führt zu einer rohen Dateisystem-Fehlermeldung statt einer verständlichen,
  kommt in den vier Texten aber nicht vor); rohe `<img>`-Tags werden nicht umgeschrieben (kommen
  in den vier Texten nicht vor, `pruefeVerweise` würde sie laut melden); `tsc` prüft
  `scripts/` nicht mit (vorbestehende Einschränkung, nicht neu durch diese Etappe).

## 8. Fragen an Jens

1. **Handprüfung** (§ 5): GitHub-Darstellung beider Sprachen (hell/dunkel) und die Doku-Seiten
   lokal über `npx vite preview`, an PC und Handy?
2. **Deploy und Website-Adresse:** Nach Freigabe und Deploy trägt ein Nachtrag die Adresse der
   Doku-Seiten (`/doku/making-of/`) in beide READMEs nach, oder bleibt der reine GitHub-Verweis
   bestehen?
3. **Fast-Forward und Push:** Darf der Branch `entstehung` nach `master` vorgespult und gepusht
   werden?
4. **Zeilenenden:** Lokal gilt `core.autocrlf=true`, aber keine `.gitattributes`-Regel hält
   `docs/*.md` auf LF fest; der Generator normalisiert Zeilenenden inzwischen selbst (Task 13).
   Soll trotzdem eine feste `.gitattributes`-Regel für diese Dateien ergänzt werden?

### Entscheidungen (26.09.2026)

1. Handprüfung ohne Befund (Jens), eingetragen in § 5.
2. Deploy durch Jens (26.09.2026); beide READMEs nennen die Live-Adresse der Doku-Seiten (`0cd2207`).
3. Fast-Forward nach `master` und Push freigegeben (Jens).
4. Keine `.gitattributes`-Regel für `docs/*.md` (Jens); der Generator vereinheitlicht die Zeilenenden selbst.
