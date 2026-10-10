# Abnahme Farbschema und Vorlesen der Doku-Seiten

## 1. Umfang

Entwurf `docs/superpowers/specs/2026-10-10-doku-farbschema-vorlesen-design.md`, Plan
`docs/superpowers/plans/2026-10-10-doku-farbschema-vorlesen.md` (10.10.2026), Branch
`doku-farbschema` (ab `master` `60c0822`, Start `73e0232`). Die Making-of-Seiten unter
`/doku/making-of/` bekommen:

1. **Helle Palette** nach der Systemvorgabe (`prefers-color-scheme`) und einen **Schalter im Kopf**
   (Automatisch, Hell, Dunkel; Wahl im Schlüssel `orrery.doku.farbschema.v1`). Ein Kopfskript setzt
   die Wahl vor dem ersten Bild, damit nichts aufblitzt.
2. **Vorlesen** mit den lokalen Stimmen des Geräts (Web Speech API): Knopf im Kopf, Bedienleiste
   (Pause, Absatz zurück und vor, Tempo, Stopp), Markierung des gelesenen Blocks, Satzzerlegung,
   Start am vom Inhaltsverzeichnis markierten Abschnitt. Ohne lokale Stimme der Seitensprache und ohne
   Skript bleibt der Knopf verborgen.
3. **Hinweis in der Fußzeile** auf die Leseansicht des Browsers, dazu ein Wächtertest für die
   Gliederung der Texte (kein `h1` im Inhalt, keine Sprünge in den Überschriftenebenen).

Kein Text verlässt das Gerät; es gibt keine neuen Anfragen an fremde Server.

## 2. Commits

Aufgaben 1 bis 4: `3a519f6` helle Palette, `287c81b` Farbschalter, `21de49a` Satzzerlegung,
`e7b8411` Vorlesen und Bedienleiste. Aufgabe 5:

| Commit | Inhalt |
|---|---|
| `cf8bd60` | Vorlesen hält die laufende Äußerung in einer Skriptvariablen (Chrome verliert sonst `onend`, wenn der Speicherbereiniger sie vorher einsammelt); vier Randfalltests |
| `97fdea8` | Fußzeilenhinweis auf die Leseansicht (DE/EN), Wächtertest der Gliederung |
| `32093ff` | Kopfzeile wieder 60 px hoch (siehe § 4, Zeilen 1 und 2) |
| `44911aa` | Wächtertest prüft Überschriften wirklich (siehe § 6, Ruling 3) |

Die Wort- und Trailerprüfung laut lokaler Projektanleitung blieb nach jedem Commit ohne Treffer.

## 3. Tests und Prüfungen

- Tests: 5889 vor Aufgabe 5, 5899 danach (152 Dateien, alle grün). Neu: vier Randfälle des
  Vorlesens (Zurück am ersten Block, Vor am letzten Block, Tempo in der Pause, Stimmverlust), der
  Fußzeilentest, der Kopfzeilenhöhentest, vier Gliederungstests.
- `npm run lint`: ohne Meldung. `npx tsc -b --noEmit`: Ausgang 0.
- `npm run build`: grün, Hauptchunk `index-*.js` 1 592,53 kB (unverändert gegenüber `v0.8.0`; die
  Änderungen betreffen nur Skripte der Doku-Seiten, nicht die App).
- Baumprüfung laut lokaler Projektanleitung: ohne Treffer.

## 4. Sichtprüfung (Chromium, Vorschau des Builds, Basis `/Orrery/`)

Pixel per Screenshot (Pillow) am Punkt (5, 200), sonst `getComputedStyle`/`getBoundingClientRect`.

| Nr. | Aufbau | Erwartung | Messwert | Ergebnis |
|---|---|---|---|---|
| 1 | 1400×900, System dunkel, DE | Grund (15, 23, 42); Kopfzeile ≤ 60 px | Grund rgb(15, 23, 42); Kopfzeile 60 px | bestanden (s. u.) |
| 2 | wie 1, System hell | Grund (248, 250, 252); Kopfzeile ≤ 60 px | rgb(248, 250, 252); 60 px | bestanden (s. u.) |
| 3 | wie 1, EN | wie 1, Knopf englisch | rgb(15, 23, 42); 60 px; `aria-label` „Color scheme: automatic (follows the system). Click for light.“ | bestanden |
| 4 | System dunkel, Wahl „hell“ vorab gespeichert | Grund beim Laden hell | `__grund` = rgb(248, 250, 252) | bestanden |
| 5 | System hell, drei Klicks | hell, dunkel, automatisch (hell) | rgb(248, 250, 252), rgb(15, 23, 42), rgb(248, 250, 252) | bestanden |
| 6 | Wahl „dunkel“, Neuladen, Chronik | Grund bleibt dunkel | nach Neuladen rgb(15, 23, 42); auf `de/chronik.html` rgb(15, 23, 42) | bestanden |
| 7 | ohne JavaScript, System hell | Grund hell; beide Knöpfe unsichtbar | rgb(248, 250, 252); `isVisible()` beide false | bestanden |
| 8 | 390×844, Touch, Faktor 2, hell und dunkel | Kopfknöpfe ≥ 44×44; `scrollWidth` ≤ 390 | Farbschalter 44×44, Vorlesen 81,5×44; `scrollWidth` 390 (beide Schemata); Kopfzeile 62,6 px | bestanden |
| 9 | 1400×900, Ersatz-Sprachausgabe, Klick auf „Vorlesen“ | Leiste vollständig im Bild; Markierung hell (219, 233, 241) ± 3, dunkel (28, 46, 67) ± 3 | Leiste x 562–823, y 829–888 im Bild 1400×900; Ersatz erhielt „Wie Orrery entstand“; Markierung hell (219, 233, 241), dunkel (28, 46, 67) | bestanden |
| 10 | wie 9 bei 390×844 | Leiste im Bild, Navigationsknopf frei | Leiste x 65–325, y 773–832 im Bild 390×844; Navigationsknopf x 12–86, y 72–116, keine Überlappung; Markierung hell (219, 233, 241), dunkel (28, 46, 67) | bestanden |
| 11 | echte Stimmen im Prüf-Chromium | Knopf sichtbar genau dann, wenn lokale `de`-Stimme | drei Stimmen, alle `localService`: Microsoft Hedda, Katja, Stefan (de-DE); Knopf sichtbar | bestanden |
| 12 | Leseansicht in Firefox | von Hand | siehe § 5 | offen |

Zeilen 1 und 2 zunächst **abgewichen**: Kopfzeile 60,19 px statt ≤ 60. Ursache: Polster 2 × 0,6 rem
(19,2 px) + Knopf 40 px + Rand 1 px ergaben 60,2 px und überschritten das `min-height: 60px`.
Behoben mit Polster 0,55 rem (`32093ff`, ein Test rechnet die Summe nach); danach 60 px. Alle anderen
Zeilen wurden nach der Änderung neu gemessen.

Die mobile Kopfzeile ist mit 62,6 px höher, weil die Knöpfe an Zeigern mit grober Auflösung 44 px hoch
sind (so gewollt). Der Sprachlink im Kopf ist am Handy nur 17,6×19 px groß; er gehört nicht zu den neuen
Knöpfen (siehe § 7).

## 5. Handprüfung (offen, für Jens)

Jeweils prüfen: Die Wahl des Farbschalters bleibt nach Seitenwechsel (Überblick, Chronik), nach
Sprachwechsel und nach Neustart des Browsers; Vorlesen ist hörbar, die Markierung folgt, Pause, Tempo,
Absatz vor und zurück, Escape und Sprachwechsel beenden es.

| Gerät und Browser | Zu prüfen | Ergebnis |
|---|---|---|
| Firefox mit NoScript, Skript gesperrt | Seite zeigt die Farbe des Systems, keine Knöpfe im Kopf | |
| Firefox mit erlaubtem Skript | Farbschalter, Wahl bleibt; Vorlesen je nach Stimmen des Systems | |
| Firefox, Leseansicht | Der Fußzeilenhinweis stimmt: Die Leseansicht liest vor | |
| Chrome unter Windows | Farbschalter, Vorlesen hörbar, Markierung folgt bis zum Ende eines längeren Abschnitts (prüft die festgehaltene Äußerung) | |
| Edge unter Windows | Nur lokale Stimmen (keine „Natural“-Stimmen); „Laut vorlesen“ der Leseansicht | |
| Galaxy A55, Chrome | Kopfknöpfe gut treffbar, Leiste verdeckt nichts, Vorlesen hörbar | |

## 6. Rulings

1. **Kopfknopf „Vorlesen“ behält seine Beschriftung**, der Zustand steht nur in `aria-pressed`
   (gängiges Muster der Zugänglichkeit); der Entwurf § 4 wurde nachgeführt.
2. **Knöpfe ohne Skript** tragen das Attribut `hidden`, statt über einen Stil im `noscript`-Block
   versteckt zu werden; gleichwertig und robuster.
3. **Wächtertest der Gliederung** erhielt zusätzlich die Bedingung „mindestens eine Überschrift“. Der
   erste Wortlaut enthielt durch einen Schreibfehler ein Steuerzeichen statt der Wortgrenze im regulären
   Ausdruck und fand nie eine Überschrift (grün, aber leer); der Lint meldete es. Jetzt prüft er echte
   Ebenen: kein `h1`, keine Sprünge in allen vier Texten.
4. **Äußerung festhalten und Randfalltests** (aus der Prüfung von Aufgabe 4 nach Aufgabe 5 verschoben):
   eine Zeile Code, vier Tests.
5. **Kopfzeilenhöhe:** Polster auf 0,55 rem statt Mindesthöhe zu erhöhen, damit die Kopfzeile am Desktop
   wie vorher 60 px bleibt.
6. **Vorher-Nachher-Bilder** für die Schulung liegen im git-ignorierten Ordner `.praesentation/`
   (gleiche Fälle wie der Vorher-Stand, dazu Schalter „hell“ bei System dunkel und die Leiste beim
   Vorlesen); nichts davon ist versioniert.

## 7. Unschärfen

- Eine Ordnungszahl wie „Phase 5.“ am Satzende trennt keinen Satz (bis zu zwei Stellen gelten als
  Ordnungszahl); selten und folgenlos.
- Die Satzzerlegung erkennt typografische einfache Anführungszeichen und das Auslassungszeichen nicht als
  Satzende; einzelne Buchstaben und Abkürzungen am Satzende trennen nicht.
- Pausenzeichen und Beschriftung stehen sowohl im Markup als auch im Skript (doppelt gepflegt).
- Der Kommentar über `DOKU_CSS` nennt nur das dunkle Thema (16,3:1); der Farbknopf trägt `title` und
  `aria-label` gleichlautend.
- Die Stimmenqualität hängt vom Gerät ab; Edge bietet keine lokalen „Natural“-Stimmen, dort erscheint der
  Knopf nur mit den klassischen Stimmen.
- Der Sprachlink im Kopf ist am Handy 17,6×19 px klein (bestand schon vor dieser Arbeit).
- Ob das Vorlesen im verdeckten Tab pausiert, ließ sich per Playwright nicht auslösen.
- Die Ereignisseiten (`/ereignisse/`) gibt es erst auf dem Branch `finsternisse`; Übernahme siehe § 8.

## 8. Fragen an Jens

1. **Datenschutzerklärung:** Vor dem Deploy zieht das Domains-Projekt die Erklärung nach: neuer Schlüssel
   `orrery.doku.farbschema.v1` im Browserspeicher, Sprachausgabe nur mit lokalen Stimmen des Geräts, kein
   Text an fremde Server. Das geschieht dort in eigener Sitzung, nicht von hier aus; einverstanden?
2. **Freigabe** für den Fast-Forward von `doku-farbschema` nach `master` (kein Push, kein Tag)?
3. **Übernahme nach `finsternisse`:** Die Ereignisseiten haben dort eigene Kopf- und Fußzeilen; Aufgabe 6
   des Plans überträgt Farbschalter, Vorlesen und Fußzeilenhinweis dorthin (Merge). Freigabe?
