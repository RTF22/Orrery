# Gesamtabnahme Phase 4d „Hochschule"

## 1. Umfang

Entwurf `docs/superpowers/specs/2026-09-17-phase4d-hochschule-design.md` (17.09.2026).
Akzeptanzkriterium: „Jeder Körper, jede Szene und jedes Thema hat auf dem Hochschul-Tab einen
eigenen Fachtext in Deutsch und Englisch, jede Literaturangabe ist maschinell gegen Crossref
beziehungsweise arXiv und inhaltlich gegen die zitierte Arbeit geprüft." Elf Etappen mit eigenem
Plan, eigenen Commits und eigenem Abnahmeprotokoll:

| Etappe | Inhalt | Endcommit | Protokoll |
|---|---|---|---|
| 4d-1 | Gerüst, Pilottexte (Erde, Bahnelemente, Mondfinsternis) | `f0963a0` | `docs/phase4d-etappe1-abnahme.md` |
| 4d-2 | Sechs Fachthemen der Hochschule | `6438e84` | `docs/phase4d-etappe2-abnahme.md` |
| 4d-3 | Sonne, Mond, Gebundene Rotation, Finsternisse, Tanz des Mondes, Sonnenaufgang | `512ad5b` | `docs/phase4d-etappe3-abnahme.md` |
| 4d-4 | Merkur, Venus, Mars, Phobos, Deimos, Merkurjagd, Phobos-Tiefflug | `bfedacc` | `docs/phase4d-etappe4-abnahme.md` |
| 4d-5 | Jupiter, Io, Europa, Ganymed, Kallisto, Vorbeiflug, Schattenspiel | `df715ff` | `docs/phase4d-etappe5-abnahme.md` |
| 4d-6 | Saturn, Ringe, Titan, Enceladus, vier Szenen | `53a1d63` | `docs/phase4d-etappe6-abnahme.md` |
| 4d-7 | Mimas, Tethys, Dione, Rhea, Iapetus, Iapetus-Szene | `f3d579b` | `docs/phase4d-etappe7-abnahme.md` |
| 4d-8 | Uranus, Achsneigung, fünf Uranusmonde, Szene | `0a8b584` | `docs/phase4d-etappe8-abnahme.md` |
| 4d-9 | Neptun, Triton, Pluto, Charon, drei Szenen | `4e39a04` | `docs/phase4d-etappe9-abnahme.md` |
| 4d-10 | Ceres, Eris, Haumea, Makemake, Zwergplaneten, Kirkwood-Lücken, Ceres-Gürtel | `5bed033` | `docs/phase4d-etappe10-abnahme.md` |
| 4d-11 | Modell, Sonnensystem, Systemblick, strenger Dateitest, Gesamtabnahme | `3d2b0a1`/`3f09b21` | `docs/phase4d-etappe11-abnahme.md` |

Endcommit je Etappe ist der letzte Commit vor dem Plan-Commit der nächsten Etappe (über
`git log <Bereich>` ermittelt; er liegt bei mehreren Etappen nach dem eigentlichen
Abnahme-Commit, weil „Nacharbeit nach der Schlussprüfung" oder „Entscheidungen von Jens" noch
folgten). Nach Etappe 4d-11 kam ein eingeschobener Fix: Commit `33d2812` „Markdown: geordnete
Listenpunkte unterbrechen keinen Absatz" (siehe §6). Diese Gesamtabnahme selbst behebt nichts
(Plan-Ruling 17); sie wertet die Beleglisten aus, zählt die Zahlen der Phase nach, geht in einer
Schleife im Browser über alle 138 Hochschuldateien und führt die offenen Punkte der elf
Etappenprotokolle zusammen.

## 2. Akzeptanzkriterium

### 2.1 Vollständigkeit (Vollständigkeitstest, 390 Dateien)

`src/data/texte/dateien.test.ts` prüft seit Etappe 4d-11 (Task 4) gegen `bodies`, `SCENES` und
`THEMEN` direkt (kein Gymnasialersatz mehr) und erwartet **390 Dateien** (69 Kennungen × 3
Niveaus × 2 Sprachen, abzüglich der sechs Fachthemen, die nur auf Hochschulniveau existieren:
414 − 24 = 390). Rotprobe und Wirksamkeitsprobe von Task 4 bestätigt (`task-4-report.md`); Teil
des vollen `npm test`-Laufs dieser Abnahme (§4 unten, 5150 Tests grün).

### 2.2 Maschinelle Literaturprüfung (Prüfskriptlauf aus der Abnahme der Etappe 11)

Übernommen aus `docs/phase4d-etappe11-abnahme.md` §3 (Task 5, voller Katalog, 761 Einträge,
nicht wiederholt): **865 ok, 5 Warnungen, 2 Fehler**. Die 5 Warnungen (`cgpm-2022`,
`greaves-2021`, `korablev-2019`, `mckinnon-2016`, `sanchez-lavega-2011`) sind aus früheren
Etappen bekannte und dort begründete Konsortial-Bylines bzw. Online-Jahre. Von den 2 Fehlern ist
`trujillo-2007` ein seit 4d-10 dokumentierter Falsch-Fehler (`<sub>`-Tag im Crossref-Titel,
Titelvergleich scheitert an Zeilenumbrüchen); `herald-2014` war ein transienter Netzfehler, mit
`--nur herald-2014` nachgeprüft: `1 ok, 0 Warnungen, 0 Fehler`. Kein `429` im Log.

### 2.3 Inhaltliche Prüfung (Auswertung der Beleglisten)

Node-Skript im Scratchpad über alle Dateien unter `docs/belege/hochschule/`. Erste Fassung
zählte Tabellenzellen naiv an jedem `|`-Zeichen und meldete 51 „falsche Zellenzahlen" — die
Ursache waren nach der im Korpus selbst verwendeten Konvention korrekt maskierte `\|` (etwa
`objekt-ariel.md` Zeile 35: „Ariel \| 0,066 \| 46,7° \| 46,6°" als wörtliches Zitat einer
Tabellenzeile aus `thema-gebundene-rotation.md"). Ein zweites Skript trennt Zellen nur an
unmaskierten `|`; danach:

| Kennzahl | Wert |
|---|---|
| Dateien | 69 (eine je Kennung, Namen gleich den Textdateien — Soll erfüllt) |
| Tabellenzeilen insgesamt | 3991 |
| Zeilen mit genau sechs Zellen | 3988 von 3991 (siehe unten) |
| Zeilen mit erkennbarer Nummer in Zelle 1 | 3991 von 3991 |
| Zeilen mit leerer Prüfspalte | 0 |
| Prüfspalte „ok" | 3574 |
| Prüfspalte „neu nach …" | 354 |
| Prüfspalte „Hinweis …" | 58 |
| Prüfspalte „Fehler:" | 2 |
| Prüfspalte sonstiger Wortlaut (gleichwertig zu „neu nach", andere Formulierung) | 3 |

**Drei Zeilen mit technisch unmaskiertem `|` in der Prüfspalte** (nicht in den Zellen 1–5,
sondern im freien Prüftext selbst, als Betragsstriche in Prosa: `objekt-europa.md` Z. 63,
`objekt-io.md` Z. 12, `szene-jupiter-vorbeiflug.md` Z. 15). Inhaltlich sind alle drei Zeilen
vollständig (sechs logische Felder, Prüfurteil „ok"); nur die strikte Tabellensyntax ist an
diesen drei Stellen verletzt, anders als beim korrekt maskierten Vorbild in `objekt-ariel.md`.
Formatierungsbefund, kein Aussagefehler — Ruling und Einzelheiten in §6(d).

**Zwei offene Prüfspalten-Einträge „Fehler:"**, beide ein Befund für §7:

1. `objekt-jupiter.md` Zeile 36 (Etappe 4d-5): Die Prüfspalte hält fest, dass der Originalabstract
   (IOP/PSJ, per WebFetch wörtlich gelesen) für die Westwärtsdrift des Großen Roten Flecks in den
   1980er-Jahren „rund 0,26 Grad pro Tag" nennt, nicht „0,026 Grad pro Tag" — ein Faktor 10. Text
   (DE Z. 117, EN Z. 113) trägt weiterhin **0,026°**. Die Abnahme der Etappe 4d-5 (§8, „Strittige
   Zahl, Großer Roter Fleck") kam über zwei unabhängig gelesene Crossref-Zusammenfassungen zum
   Schluss „so lassen"; die Prüfspalte selbst wurde dabei nie von „Fehler" auf „ok" umgestellt.
   Die beiden Fundstellen widersprechen sich damit bis heute. Siehe §7.
2. `objekt-neptune.md` Zeile 57 (Etappe 4d-9): Die Prüfspalte hält eine Sprachmischung fest
   („Schaubild" statt „Diagram" in der englischen Fassung). Der Text ist inzwischen korrekt
   (`objekt-neptune.md` EN Z. 257: „default 'Diagram' display") — Etappe 4d-9 §4 bestätigt die
   Behebung ausdrücklich („keine offen"). Die Prüfspalte ist hier nur nicht nachgeführt worden;
   kein Sachfehler. Buchhaltungsbefund, kein Handlungsbedarf.

## 3. Zahlen der Phase

### 3.1 Tabelle je Etappe

Testzahl und Hauptchunk sind aus den Etappenprotokollen übernommen (§2 „Lint, Tests, Build",
beim Endcommit nach etwaiger Nacharbeit); ein historischer `npm test`/`npm run build` je
Etappen-Endcommit war nicht durchführbar, weil kein Worktree erlaubt ist und der laufende
Vite-Server den Arbeitsbaum ausliefert (lokale Projektanleitung). Katalog- und Quellenkarten-
Zahlen sind dagegen selbst nachgezählt (`git show <Endcommit>:src/data/{literatur,quellen}.ts |
grep -cE "^\s+id: '"`), unabhängig von den Protokollangaben.

| Etappe | Endcommit | Textdateien | Testzahl | Katalog | Quellenkarten | Hauptchunk |
|---|---|---:|---:|---:|---:|---:|
| 4d-1 | `f0963a0` | 6 | 3537 | 51 | 80 | 1 243,77 kB |
| 4d-2 | `6438e84` | 12 | 3665 | 199 | 80 | 1 282,42 kB |
| 4d-3 | `512ad5b` | 12 | 3968 | 303 | 80 | 1 326,01 kB |
| 4d-4 | `bfedacc` | 14 | 4125 | 372 | 80 | 1 344,77 kB |
| 4d-5 | `df715ff` | 14 | 4279 | 442 | 80 | 1 363,61 kB |
| 4d-6 | `53a1d63` | 18 | 4475 | 531 | 80 | 1 386,97 kB |
| 4d-7 | `f3d579b` | 12 | 4607 | 559 | 82 | 1 395,66 kB |
| 4d-8 | `0a8b584` | 16 | 4781 | 628 | 83 | 1 415,10 kB |
| 4d-9 | `4e39a04` | 14 | 4935 | 680 | 84 | 1 429,46 kB |
| 4d-10 | `5bed033` | 14 | 5086 | 753 | 88 | 1 450,51 kB |
| 4d-11 | `33d2812` | 6 | 5150 | 761 | 91 | 1 453,78 kB |
| **Summe/Endstand** | — | **138** | **5150** | **761** | **91** | **1 453,78 kB** |

Summe der Textdateien 6+12+12+14+14+18+12+16+14+14+6 = **138**, deckungsgleich mit Entwurf §7
(138 Dateien für 69 Kennungen: 35 Körper, 19 Szenen, 15 Themen). Quellenkarten-Ausgangsstand vor
Phase 4d war 66 (Entwurf §1); der Sprung auf 80 in Etappe 4d-1 stammt aus den Quellenkarten der
sechs Fachthemen-Piloten (Plan-Ruling 6). Endstand nach Etappe 4d-11 (Task 5 der Etappe 11,
selbst nachgezählt): 5150 Tests, Katalog 761, Quellenkarten 91, Hauptchunk 1 453,78 kB.

### 3.2 Wortzahlen aller 138 Hochschuldateien

`wc -w` auf allen Dateien unter `src/data/texte/{de,en}/hochschule/`:

| Sprache | Art | Dateien | Wörter | Mittel |
|---|---|---:|---:|---:|
| Deutsch | Körper (`objekt-`) | 35 | 88 654 | 2 532 |
| Deutsch | Szene (`szene-`) | 19 | 17 219 | 906 |
| Deutsch | Thema (`thema-`) | 15 | 45 846 | 3 056 |
| Deutsch | **Summe** | **69** | **151 719** | **2 199** |
| Englisch | Körper (`objekt-`) | 35 | 97 309 | 2 780 |
| Englisch | Szene (`szene-`) | 19 | 19 443 | 1 023 |
| Englisch | Thema (`thema-`) | 15 | 50 467 | 3 364 |
| Englisch | **Summe** | **69** | **167 219** | **2 423** |
| **Gesamt** | — | **138** | **318 938** | **2 311** |

Englische Fassungen sind durchgehend länger als die deutschen (10,2 % im Mittel über alle 138
Dateien), wie in mehreren Etappenprotokollen bei einzelnen Texten schon vermerkt.

### 3.3 Zitate

Literaturkatalog `src/data/literatur.ts`: **761 Einträge** (753 vor Etappe 4d-11 plus 8 Zuwachs
aus Task 2 der Etappe 11, alle acht bereits in §2 der Etappe-11-Abnahme benannt: `bailey-2016`,
`batygin-2016`, `iorio-2012`, `laskar-2009`, `napier-2021`, `ray-2012`, `souami-2012`,
`winn-2015`). Da jeder Katalogeintrag ausschließlich für ein tatsächliches Zitat in einem Text
angelegt wird (kein Vorratseintrag), entspricht die Katalogzahl der Zahl verschiedener Zitate
über den gesamten Hochschulkorpus: **761**.

## 4. Gesamtrundgang

Browser vorbereitet wie in Task 5 (`curl` → 200 auf Port 5173, kein zweiter Server;
`window.store.setState({ quality: { tier: 'high' } })` direkt nach dem Navigieren). Eine
Tabelle mit Kennung, Art, erwartetem Kopf je Sprache (erste Zeile ohne `# `, aus den 138
Textdateien per Node-Skript gelesen) und Szenenindex (aus `src/data/scenes.ts`, Array-Reihenfolge
= `cinema.nummer`) im Scratchpad angelegt, dann je Sprache eine durchgehende Schleife in
`browser_run_code_unsafe` über alle 69 Kennungen.

**Messfalle gefunden und behoben:** Eine erste Messreihe zeigte zahlreiche scheinbar fehlende
`quelle:`-Verweisziele. Ursache: Der Kopf (`h2`) wechselt schneller als der faule Import des
Textinhalts selbst (lokale Projektanleitung: „auf den Kopfwechsel pollen, fauler Import"); eine
Messung direkt nach erfolgreichem Kopf-Poll traf gelegentlich noch den alten Textkörper. Nach
Einbau einer zusätzlichen Nachlaufzeit von 300 ms nach dem Kopf-Poll (über die im Brief genannten
200 ms hinaus) verschwanden alle scheinbaren Fehlbefunde; die Messreihe wurde mit dieser
Nachlaufzeit komplett wiederholt (Ruling, §6 des Berichts).

**Ergebnis (138 Kombinationen, 69 Kennungen × 2 Sprachen):**

| Kriterium | Ergebnis |
|---|---|
| Kopf gefunden (`pollOk`) | 138 von 138 |
| `formelfehler` (`[data-formelfehler]`) | 0 in allen 138 |
| Hinweiszeilen (`p.text-amber-300`) | 0 in allen 138 |
| `zitateGleichKarten` | true in allen 138 |
| `ol`-Elemente im Textkörper | 0 in allen 138 |
| Verweisziele `objekt:`/`szene:`/`thema:` gegen die Kennungslisten | alle gefunden, 0 fehlend |
| Verweisziele `quelle:` gegen `[data-quelle="<id>"]` | alle gefunden, 0 fehlend |

Die Kennungslisten kamen je Sprache einmal per `await import('/Orrery/src/data/index.ts')`
(`bodies`), `…/scenes.ts` (`SCENES`) und `…/themen.ts` (`THEMEN`) in den Browser, nicht aus
`window.store` (das keine Listen führt). Verweiszahlen je Art schwanken erwartungsgemäß stark
zwischen den Texten (`literatur:` zwischen 1 und 91 je Kombination, `math`-Elemente zwischen 3
und 145); keine dieser Schwankungen betrifft ein Kriterium.

**Stichprobe (Ruling 15 des Plans):** Drei Dateien je Sprache, Zufallsauswahl mit festem
Startwert (Mulberry32, Startwert **42**, angewendet auf die 69 Kennungen in Dateisystem-
Reihenfolge): `szene-jupiter-vorbeiflug`, `objekt-titania`, `thema-finsternis`. Dieselben drei
Kennungen in beiden Sprachen geprüft (deckt die Sprachzwillinge ab, ohne die Stichprobe zu
verdoppeln). Statt jedes einzelnen Vorkommens wurde je Datei jedes **unterschiedliche**
Verweisziel einmal geklickt (mehrfach im selben Text wiederholte Verweise auf dasselbe Ziel haben
dieselbe, bereits geprüfte Wirkung; ein Klick auf alle 254 Vorkommen statt der 170
unterschiedlichen Ziele hätte die Sitzung erheblich verlängert, siehe §6 des Berichts für das
Ruling). Wirkung je Art wie in den elf Etappenabnahmen belegt: `objekt:` → `camera.targetId`,
`thema:` → `ui.info.thema`, `szene:` → `cinema.nummer` gleich dem Szenenindex und
`camera.mode==='cinema'`, `quelle:`/`literatur:` → `border-sky-300` auf der Karte.

| Datei | Unterschiedliche Verweisziele | Treffer DE | Treffer EN |
|---|---:|---:|---:|
| `szene-jupiter-vorbeiflug` | 14 | 14/14 | 14/14 |
| `objekt-titania` | 35 | 35/35 | 35/35 |
| `thema-finsternis` | 36 | 36/36 | 36/36 |
| **Summe** | **85** | **85/85** | **85/85** |

**170 von 170 Klicktests trafen.** Eine erste Messrunde ohne ausreichende Wartezeit nach dem
Zurücksetzen auf die Ausgangsdatei zeigte zwei scheinbare Fehlschläge (ein `thema:`- und ein
`szene:`-Verweis in `szene-jupiter-vorbeiflug`); eine unabhängige Gegenprobe mit längerer
Wartezeit (500 ms bzw. 1500 ms statt 150/400 ms) bestätigte beide als korrekt wirkend. Ursache
war ein Fehler im eigenen Messskript (die Wiederherstellungsfunktion für Szenen setzte
`ui.info.thema` nicht wie der echte Klick-Handler in `verweisAusfuehren.ts` auf `null` zurück,
sodass der nächste Klick auf einen `thema:`-Verweis innerhalb der noch „veralteten"
Themenanzeige landete); nach der Berichtigung liefen beide Sprachdurchgänge fehlerfrei durch.

## 5. Konsole

`browser_console_messages` direkt nach dem `browser_navigate` dieser Sitzung (Level `warning`,
ohne `all`, also nur seit dem letzten Navigieren): **0 Fehler, 0 Warnungen** — über den gesamten,
durchgehenden Rundgang (138 Kombinationen, 170 Klicktests, keine Pausen zwischen den
Werkzeugaufrufen). Eine Abfrage mit `all: true` zeigt zusätzlich ältere Einträge aus einer
früheren, pausenreichen Sitzung dieser Maschine (ein `createRoot`-Fehler und rund 120
WebGL-Framebuffer-Warnungen) — dasselbe, bereits in der Abnahme der Etappe 11 (§5.3) als
Dev-Server-Idle-Reconnect-Artefakt eingeordnete Muster, hier durch den eigenen, eng getakteten
Rundgang ohne jede Pause zusätzlich bestätigt: Bei ununterbrochener Interaktion tritt das
Artefakt nicht auf.

## 6. Offene Punkte der Phase

Aus §7 und §8 aller elf Etappenprotokolle und den „Entscheidungen von Jens" je Etappe. Was
entschieden oder erledigt ist, entfällt hier mit Verweis auf die Stelle (Auswahl, nicht
vollständig — Details stehen im jeweiligen Etappenprotokoll): Pilottexte freigegeben (4d-1 §8);
Formelabstand nach Funktionsnamen, `jpl-horizons`-Quellenkarte, Prüfskript-Wiederholung bei
5xx (4d-1 §8, umgesetzt in 4d-2); Messvorlage „relativ statt absolut" bestätigt, Erdalbedo-
Pilot angeglichen, Kepler-Absturz ab Jahr 12 563 durch den Zeitbereich JD 1…9999 behoben,
Brennecka-2010-Titelvergleich verstanden (4d-2 §8); Katalogform „beschreibende Zusätze englisch"
vereinheitlicht (4d-4 Nacharbeit); Gymnasialtext Titan (Ozean-Streitstand) nachgeführt in 4d-7;
Gymnasialtext Iapetus (Wulsthöhe) nachgeführt in 4d-7; `national-academies-2023` auf `-2022`
umgestellt, Push nach 4d-8 (4d-8 §8); Kamera hinter Neptun für `ferne-sonne` umgesetzt,
`thema-achsneigung` „chaotische Schiefe" berichtigt, DE/EN-Verweisasymmetrie Kirkwood behoben
(4d-9/4d-10); geordnete Listenpunkte unterbrechen seit `33d2812` keinen Absatz mehr (20 Zeilen in
18 Dateien betroffen, siehe §1). Alle Wortzahlen über dem Richtwert wurden je Etappe einzeln
angenommen (Richtigkeit vor Wortzahl, Ruling seit 4d-4) und werden hier nicht erneut aufgeführt.

Was offen ist, gruppiert:

### (a) Befunde am Simulationscode und an Datensätzen

- Uhr setzt UTC als TDB ein; Erde im Erde-Mond-Schwerpunkt statt im eigenen Zentrum (4d-1 §7).
- Keplerlöser divergiert bei $e = 0{,}999$ (4d-1 §7, folgenlos bei den heutigen Körpern).
- Erdrotation ohne gültiges IAU-Rotationsmodell (4d-1 §7).
- Mondraten (`moon.ts`) enthalten wahrscheinlich die Präzession, ohne sie unbenannt zu lassen
  (4d-1 §7).
- Keine Abplattung bei Jupiter, Saturn, Neptun (4d-5 §7/§8, 4d-6 §7/§8, 4d-9 §7); Uranus nicht
  gesondert erwähnt, aber vom selben Rendererbefund betroffen.
- Feste Pole (keine periodischen Glieder) bei Triton, Miranda, den übrigen vier Uranusmonden,
  Iapetus (Knotenpräzession um den falschen Pol) (4d-4 §7, 4d-8 §7/§8, 4d-9 §7).
- Uranus-Rotationsperiode −17,24 h (Voyager) gegen Lamy et al. 2025 als neuerer Messwert
  (4d-8 §8, Ruling 23: „bleibt so"); Neptun-Rotationsperiode 16,11 h (Voyager) gegen zwei neuere
  Werte (4d-9 §7/§8, Ruling 23: „bleibt so").
- Pluto im Ursprung seines Systems statt um den Schwerpunkt (2126 km/1,79 Plutoradien Versatz)
  (4d-9 §7, Kernbefund).
- Fehlende kleine Monde: Styx, Nix, Kerberos, Hydra (Pluto); Nereid, Proteus u. a. (Neptun);
  Dysnomia (Eris), Hiʻiaka/Namaka (Haumea), MK 2 (Makemake) (4d-9 §7/§8, 4d-10 §7/§8).
- Deimos-Masse 67 % über der aktuellen GM-Bestimmung, `e=0` im Datensatz gegen gemessene
  0,0002–0,0003 (4d-4 §7/§8).
- Marspol IAU 2009 statt des seit 2018 amtlichen IAU-2015-Pols (4d-4 §7/§8).
- `A_JUPITER_AE = 5,2044` (`sim/belts.ts`) gegen 5,203 AE (`thema-resonanzen`), verschiebt die
  Kirkwood-Lückenlagen geringfügig (4d-10 §7/§8).
- Szene `ferne-sonne`: `nightFill` verdeckt die physikalisch schmale Neptun-Sichel im Bild;
  Sonnenhelligkeit in „realistisch" bleibt unter der Messschwelle (4d-10 §7/§8, zwei offene
  Modellfragen ohne Fehlercharakter).
- Kommentarfehler in `scenes.ts`: `iapetus-schief` behauptet eine „vollständige Bahnellipse" im
  Bild (Frustumtest: 5/72 bis 31/72 Stützpunkte, 4d-7 §7); `galileisches-schattenspiel` sagt
  Kallistos Bahn rage „gelegentlich" über den Bildrand (tatsächlich 52,4 % aller Ziehungen,
  4d-5 §7/§8); `ceres-guertel` nennt ein bei Standardeinstellungen unerreichbares `dayLevel`
  (4d-10 §7).
- `docs/belege/hochschule/objekt-umbriel.md` Zeile 66 trägt weiterhin die von der
  Titania-Fachprüfung gefundene Magnetopausen-Verwechslung (4d-8 §7/§8, bereits in der lokalen
  Projektanleitung vorgemerkt).
- Ringscheibe (`render/rings.ts`) kennt nie einen Mond als Schattenwerfer, nur den Planeten
  selbst (4d-6 §7/§8).
- A-Ring-Außenkante: 136 770 km (PDS) gegen 136 780 km (NSSDC/Code), 10 km Differenz zwischen
  zwei gängigen Referenzen (4d-6 §7/§8).

### (b) Datensatzkommentare mit Fehlzuschreibungen

- `zwergplaneten.ts`-Kommentare: Szakáts et al. mit falschem Jahr/Band (2022/L1 statt
  2023/L3); Haumeas dritte Halbachse 518 statt 514 km; Makemakes Kippwinkelspanne fälschlich
  Hromakina statt Parker zugeschrieben; Makemakes `rotationPeriodH`-Kommentar überzeichnet die
  Aussage von Kiss et al. 2024; Eris'-Massekommentar ohne Zahl für den Dysnomia-Abzug
  (4d-10 §7/§8, alle in den Texten selbst richtiggestellt, Kommentare unverändert).
- `uranus-monde.ts`-Kommentar zu Titanias Kepler-Umlaufzeit nennt die vereinfachte statt der
  tatsächlichen Formel (4d-8 §7).
- Kommentarfehler in `pluto-system.ts`, `time.ts`, `uranus-monde.ts` (UTC/TDB-Verwechslung, aus
  4d-1 §7 wiederholt in der lokalen Projektanleitung).
- **Belegliste `objekt-jupiter.md` Zeile 36 widerspricht der Entscheidung aus 4d-5 §8** (neu in
  dieser Abnahme gefunden, §2.3): Die Prüfspalte hält „Fehler: … richtig 0,26°/Tag" fest, der
  veröffentlichte Text (DE Z. 117, EN Z. 113) trägt weiterhin 0,026°/Tag. Siehe §7.

### (c) Texte, die bei neuen Messungen nachzuführen sind

- Schaltsekunden-Absatz in `thema-bezugssysteme` nach der 28. CGPM (13.–15.10.2026, 4d-2 §8,
  Jens 19.09.2026: „nach der Sitzung nachführen").
- Neuere Pluto-Integrationen (rund 82°/23° statt der zitierten Werte, 4d-2 §8, „für eine
  spätere Etappe vorgemerkt").
- Makemakes Masse beruht auf einem unbegutachteten Vorabdruck (Bamberger 2025); Text kennzeichnet
  das ausdrücklich, nachführen bei begutachteter Fassung (4d-10 §7/§8).
- `national-academies-2022`/Berichtsdatum: bereits erledigt (4d-8, siehe oben).

### (d) Prüfskript und Tests

- `mitWiederholung` fängt keinen `TypeError` (nur HTTP-Fehlercodes), transiente Netzfehler
  brauchen eine manuelle `--nur`-Nachprüfung (durchgehend genutzt, nie behoben).
- Titelvergleich scheitert an Zeilenumbrüchen um `<sub>`-Tags: drei bekannte Fälle
  (`trujillo-2007` 4d-10, `decolibus-2023` 4d-8 — ein dritter, bisher nicht abgedeckter
  Grenzfall mit Leerraum auf beiden Seiten der Tags).
- Test prüft bei manchen Invarianten nur Konstanten, nicht die tatsächliche Verdrahtung
  (`scripts/literaturVergleich.test.ts`, 4d-3 §8, „so belassen, solange kein Netzmock lohnt").
- `literaturVergleich.ts` behandelt Körperschaften ohne Familiennamen bei Crossref nicht robust
  (4d-4 §7, „praxisfern, zurückgestellt").
- **Belegliste `objekt-neptune.md` Zeile 57: „Fehler"-Verdikt nach der Behebung nie auf „ok"
  nachgeführt** (neu in dieser Abnahme gefunden, §2.3, kein Sachfehler).
- Drei Beleglisten-Zeilen mit unmaskiertem `|` in der Prüfspalte selbst (§2.3): `objekt-europa.md`
  Z. 63, `objekt-io.md` Z. 12, `szene-jupiter-vorbeiflug.md` Z. 15 — reine Formatierung.
- Sammelbefund Prozesssprache in 27 Beleglisten früherer Etappen (129 Treffer, davon 127 in
  fachgeprüften, nicht mehr anzufassenden Beleglisten und 2 in einem unveränderten
  Codekommentar seit 4d-1) — in 4d-8 §8 für eine mechanische Bereinigung in 4d-11 vorgesehen,
  in dieser Etappe **nicht** umgesetzt (Etappe 4d-11 enthielt keinen entsprechenden Task).
- `szene-ringdurchflug.md`: ein Zeilennummern-/Zellenformat-Rest wurde bereits in der
  Nacharbeit nach der Abnahme 4d-6 behoben; `thema-ringe.md` Zeile 36 verweist weiterhin
  fälschlich auf „Zeile 60" statt 61 (4d-6 §7/§8, „bei nächster inhaltlicher Berührung").

### (e) Belegfragen hinter Verlagssperren

Durchgängig über alle Etappen: zahlreiche Zeitschriftenartikel (Science/AAAS, Nature,
Wiley/AGU, ScienceDirect, IOPscience) waren nur über Crossref-Metadaten, Sekundärquellen oder
Zusammenfassungen zugänglich, nie am vollständigen, selbst geöffneten Originaltext (Kernaussagen
je Text im jeweiligen Etappenprotokoll §7 einzeln benannt, u. a. 4d-4 bis 4d-10). Namentlich
offen: `thema-achsneigung` — Touma und Wisdom 1993, Dobrovolskis und Harris 1983 ohne
unabhängig geprüftes Zitat (4d-8 §7/§8); `objekt-ceres` — hydrostatische Abweichung und
Apsidendrehung nur über Sekundärquellen (4d-10 §7/§8); `thema-sonnensystem` — Dones, Brasser,
Kaib und Rickman 2015 nirgends erreichbar, nicht zitiert (4d-11 §7); Winn und Fabrycky 2015 ohne
direkten PDF-Zugriff wörtlich verifizierbar, Größenordnung mehrfach bestätigt (4d-11 §7/§8).

### Gymnasialtexte (eigene Gruppe, Regel: Korrektheit vor Wortzahl, kleiner Nachführungs-Task)

- `objekt-titan.md`, `objekt-iapetus.md`: bereits erledigt (4d-7, siehe oben).
- **`szene-uranus-gekippt` (de/en): „2028" für die Nordsommer-Sonnenwende statt der von zwei
  Etappen unabhängig nachgerechneten und bestätigten 11. April 2030 — weiterhin offen** (4d-8
  §8: „vor 4d-9 einschieben oder zurückstellen — Entscheidung bei Jens"; von Jens in 4d-8 auf
  „vor oder mit Etappe 4d-9" terminiert, in 4d-9 und 4d-10 aber **nicht** umgesetzt).
- **`objekt-miranda` (Gymnasium, de/en): Verona Rupes „rund 20 km"/„rund zwölf Minuten" gegen
  den einzigen photogrammetrisch hergeleiteten Wert 5–10 km/6–8,5 Minuten — weiterhin offen**
  (4d-8 §8, dieselbe Terminierung wie oben, nicht umgesetzt).
- **`objekt-titania`/`objekt-oberon` (Gymnasium, de/en): „etwa gleiche Anteile Eis und Gestein"
  trifft nach dem Zwei-Komponenten-Modell des Hochschultexts weder massebezogen noch
  volumenbezogen zu — weiterhin offen**, dieselbe Terminierung (4d-8 §8).
- `thema-modell.md` (Gymnasium, DE, Task 1 der Etappe 4d-11): Zahl „unter 4700 km" für den
  Abstand Erde-Mond-Schwerpunkt–Erdmittelpunkt liegt rund 228 km (knapp 5 %) unter dem
  fachgeprüften Maximalwert 4928 km — **neu in Etappe 4d-11, weiterhin offen** (§8 der Etappe
  11, „als eigenen kleinen Nachführungs-Task vormerken").

## 7. Halt: Fragen an Jens

**Push von `master` und Tag `v0.5.0`** (Plan-Ruling 16 der Etappe 11): Push und Tag erst nach
Jens' eigenem Ja, unabhängig von der Freigabe der Etappe 4d-11 selbst.

**Auswahl aus §6 für die Zeit vor Phase 5** (Vorschlag, keine Vorentscheidung):

1. **Lebendiger Widerspruch GRS-Drift (§6b, `objekt-jupiter.md` Zeile 36):** Die Belegliste hält
   seit der Nacharbeit der Etappe 4d-5 „Fehler: richtig 0,26°/Tag" fest; die Abnahme derselben
   Etappe entschied „0,026°/Tag so lassen" auf Grundlage zweier Crossref-Zusammenfassungen, ohne
   die Prüfspalte anzupassen oder den in der Prüfspalte referenzierten direkten
   IOP/PSJ-Originaltext gegenzulesen. Text und Belegliste widersprechen sich bis heute. Soll der
   IOP/PSJ-Originaltext (bei dieser Abnahme weiterhin per Bot-Sperre nicht einsehbar) in einem
   eigenen kleinen Nachführungs-Task noch einmal geprüft und die Zahl gegebenenfalls auf
   0,26°/Tag berichtigt werden, oder bleibt es bei „so lassen" von 4d-5, und die Prüfspalte wird
   nur auf „ok" nachgeführt?
2. **Vier Gymnasialbefunde aus 4d-8 weiterhin offen** (§6, Gruppe Gymnasialtexte): Uranus-
   Sonnenwende „2028" statt 2030, Miranda-Verona-Rupes-Höhe, Titania/Oberon-„etwa gleiche
   Anteile". Jens hatte nach 4d-8 „vor oder mit Etappe 4d-9" zugesagt; das ist nicht geschehen.
   Sollen diese vier jetzt in einem eigenen kleinen Nachführungs-Task behoben werden (vor oder
   nach Phase 5)?
3. **Neuer Gymnasialbefund aus 4d-11** (`thema-modell.md` DE, „unter 4700 km"): eigener kleiner
   Nachführungs-Task, wie in Etappe 4d-11 §8 vorgeschlagen?
4. **Sammelbefund Prozesssprache in 27 Beleglisten** (§6d): 4d-8 sah eine mechanische Bereinigung
   für 4d-11 vor; sie ist nicht erfolgt. Für eine eigene kleine Aufgabe vor oder in Phase 5
   vormerken?
5. **Formfix `thema-modell.md` DE, `quelle:jpl-satelliten-entdeckung`** (Zeile 113–114, seit
   `33d2812` nicht mehr durch den Markdown-Parser, sondern durch den Zeilenanfang „23. Mai 2023"
   verursacht — der Parser-Fix behebt nur die Listenerkennung, nicht die Verweisstelle selbst,
   siehe Nachtrag in `docs/phase4d-etappe11-abnahme.md` §7): Zeile so umbrechen, dass sie nicht
   mit einer Ziffer gefolgt von Punkt beginnt?
6. **Alle übrigen Code-/Datensatzbefunde aus §6(a)** (keine Abplattung der Riesenplaneten, feste
   Pole, Pluto-Schwerpunkt, fehlende kleine Monde, Kepler-Divergenz bei $e=0{,}999$, UTC/TDB,
   Erde im Baryzentrum u. a.): Diese sind seit mehreren Etappen bewusst zurückgestellte
   Modellgrenzen, in den Texten offengelegt. Bleiben sie bis auf Weiteres zurückgestellt, oder
   soll eine Auswahl davon als Grundlage für Phase 5 dienen?
7. **Drei Beleglisten-Formatierungsbefunde** (§2.3/§6d, unmaskierte `|` in der Prüfspalte
   selbst): keine Handlung nötig oder bei nächster Berührung der jeweiligen Datei mitkorrigieren?

Die Wort- und Trailerprüfung vor dem Commit erfolgte wie in der lokalen Projektanleitung
beschrieben (Ergebnis 0), ohne Suchmuster in dieser Datei.
