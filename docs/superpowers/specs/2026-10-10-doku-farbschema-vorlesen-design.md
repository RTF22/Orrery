# Doku-Seiten: Farbschema und Vorlesen — Entwurf

Stand 10.10.2026, von Jens im Gespräch freigegeben (Abschnitte 1 und 2). Gilt für die statischen Doku-Seiten
(Making-of „Entstehung“ und „Chronik“, je Deutsch und Englisch), nach der Übernahme auch für die Ereignisseite
`/ereignisse/`. Die 3D-App bleibt unverändert dunkel.

## 1. Ziel

- Die Doku-Seiten folgen ohne eigene Wahl der Hell-/Dunkel-Einstellung des Betriebssystems. Ein Schalter in der
  Kopfzeile erlaubt Hell oder Dunkel und den Weg zurück zur Systemvorgabe; die Wahl bleibt beim Seitenwechsel und
  beim nächsten Besuch erhalten.
- Die Seiten lassen sich mit den lokalen Stimmen des Browsers vorlesen (Vorschlag A). Daneben bleiben sie für die
  Leseansicht und die Vorlesefunktion der Browser gut lesbar (Vorschlag C). Vorab erzeugte Audiodateien
  (Vorschlag B) entfallen.

## 2. Branch und Reihenfolge

- Umsetzung auf einem Branch von `master`, Abschluss per Fast-Forward nach `master`.
- Danach Übernahme nach `finsternisse`; dort bekommt auch die Ereignisseite (`scripts/ereignisse-bauen.ts`,
  `EREIGNISSE_CSS` baut auf `DOKU_CSS` auf) Schalter und Vorlesen. Konflikte in `scripts/doku-vorlage.ts` werden
  von Hand gelöst.
- **Vor dem Deploy** zieht das Domains-Projekt die Datenschutzerklärung nach (Baustein
  `site/src/components/legal/SpeicherOrrery.astro`, Regel aus dessen `docs/handover/orrery.md`: erst Baustein,
  dann ausliefern). Inhalt: der neue Schlüssel aus Abschnitt 3 und ein Satz zur Sprachausgabe (nur lokale Stimmen
  des Geräts, kein Text an fremde Server). Nachgezogen wird dort in einer eigenen Session.

## 3. Farbschema

### Verhalten

- Ohne eigene Wahl gilt `prefers-color-scheme` — auch ohne JavaScript.
- Eine eigene Wahl setzt `data-theme="light"` oder `data-theme="dark"` am `<html>` und überschreibt die
  Systemvorgabe.
- Gespeichert wird unter dem localStorage-Schlüssel `orrery.doku.farbschema.v1` mit dem Wert `hell` oder `dunkel`.
  „Automatisch“ löscht den Schlüssel. Jeder Zugriff liegt in `try/catch`; bei gesperrtem Speicher gilt die Wahl
  nur für die aktuelle Seite.
- Ein kleines Skript im `<head>`, eingebunden vor dem Stylesheet, liest den Schlüssel und setzt `data-theme`,
  damit die Seite nicht erst in der falschen Farbe erscheint.
- `<meta name="theme-color">` gibt es zweimal, je mit `media="(prefers-color-scheme: …)"`; bei eigener Wahl
  passt das Skript den Wert an.
- `color-scheme` folgt dem gewählten Schema (Bildlaufleisten, Formularelemente).

### Knopf

- In der Kopfzeile links neben der Sprachwahl DE/EN, gleiche Höhe, Mindestfläche 44 × 44 px am Touchgerät.
- Symbol zeigt den aktuellen Zustand: ◐ Automatisch, ☀ Hell, ☾ Dunkel. Ein Klick schaltet reihum
  Automatisch → Hell → Dunkel → Automatisch.
- `aria-label` und `title` in der Seitensprache nennen den aktuellen Zustand und die Wirkung des Klicks
  (etwa „Farbschema: automatisch. Klicken für hell.“).
- Ohne JavaScript ausgeblendet (`<noscript>`-Stil, wie beim Navigationsknopf).

### Paletten

Die Farben stehen als Variablen auf `:root` (heute `--bg`, `--text`, `--text-gedaempft`, `--akzent`,
`--akzent-stark`, `--rand`). Die dunkle Palette bleibt unverändert. Die helle:

| Variable | Hell |
|---|---|
| `--bg` | `#f8fafc` |
| `--text` | `#0f172a` |
| `--text-gedaempft` | `#475569` |
| `--akzent` | `#0369a1` |
| `--akzent-stark` | `#0284c7` |
| `--rand` | `rgba(15, 23, 42, 0.14)` |

Anordnung im CSS: dunkle Werte als Grundlage; helle Werte unter `@media (prefers-color-scheme: light)` mit
`:root:not([data-theme="dark"])` und zusätzlich unter `:root[data-theme="light"]`. Alle Text-/Hintergrundpaare
beider Paletten erfüllen WCAG AA (≥ 4,5 : 1 für Fließtext), gemessen per Skript. Feste Farben außerhalb der
Variablen (heute zwölf Hex-/rgba-Stellen in `scripts/doku-vorlage.ts`) werden geprüft und, wo nötig, auf Variablen
umgestellt. Screenshots im Making-of bleiben unverändert.

Die Weiterleitungsseiten (`sprachwahlSeite`, `dokuWurzelSeite`) bekommen keinen Schalter.

## 4. Vorlesen

### Verfügbarkeit

- Knopf „Vorlesen“ / „Read aloud“ in der Kopfzeile neben dem Farbschalter.
- Er erscheint nur, wenn `speechSynthesis` vorhanden ist und mindestens eine Stimme mit `localService === true`
  und passender Sprache (`de` bzw. `en`, Präfixvergleich) gemeldet wird. Stimmen kommen in manchen Browsern erst
  nach `voiceschanged`; bis dahin bleibt der Knopf verborgen.
- Online-Stimmen (`localService === false`, etwa die „Natural“-Stimmen in Edge oder „Google …“ in Chrome) werden
  nie verwendet. Unter den lokalen Stimmen hat die als `default` markierte Vorrang, sonst die erste.

### Was vorgelesen wird

- Inhalt von `main`: Überschriften (`h1`–`h4`), Absätze, Listenpunkte, Zitate — in Dokumentreihenfolge.
- Übersprungen: Tabellen, Code (`pre`), Bilder, das Inhaltsverzeichnis, Kopf- und Fußzeile.
- Start beim Abschnitt, der gerade oben sichtbar ist (dieselbe Ermittlung wie die Markierung im
  Inhaltsverzeichnis); ganz oben beginnt es beim `h1`.

### Ablauf

- Jeder Block wird in Sätze zerlegt und satzweise als `SpeechSynthesisUtterance` gesprochen (Chrome bricht lange
  Äußerungen nach rund 15 s ab). Die Satzzerlegung ist eine reine Funktion, die getestet wird und im Browser-Skript
  wortgleich zum Einsatz kommt; sie trennt an `.`, `!`, `?` mit folgendem Leerraum, nicht aber nach gängigen
  Abkürzungen (z. B., d. h., u. a., Nr., ca., e.g., i.e.) und nicht in Zahlen wie „1.5“ oder Datumsangaben.
- Der gerade gelesene Block erhält eine Markierung (Klasse, Hintergrund in Akzentfarbe mit geringer Deckung, in
  beiden Paletten sichtbar). Liegt er außerhalb des sichtbaren Bereichs, scrollt die Seite ihn in die Mitte —
  bei `prefers-reduced-motion: reduce` ohne Animation.
- Abbruch beim Verlassen der Seite (`pagehide`), also auch beim Sprachwechsel.
- Ein Klick ins Inhaltsverzeichnis während des Vorlesens setzt das Vorlesen beim Ziel fort.

### Bedienleiste

- Erscheint unten fest am Bildschirm, sobald das Vorlesen startet; verschwindet bei Stopp oder am Ende.
- Knöpfe: Pause/Weiter, Absatz zurück, Absatz vor, Stopp, Tempo in drei Stufen (0,8 / 1 / 1,25; zeigt die Stufe
  an, Klick schaltet reihum). Das Tempo wird nicht gespeichert.
- Alle Knöpfe mit Beschriftung in der Seitensprache, Mindestfläche 44 × 44 px; die Leiste ist eine `region` mit
  Namen. Während sie sichtbar ist, bekommt der Seitenfuß unten Platz, damit nichts verdeckt wird.
- Escape stoppt das Vorlesen. Ist am schmalen Bildschirm die Navigationsschublade offen, schließt Escape zuerst die
  Schublade.
- Der Knopf „Vorlesen“ in der Kopfzeile wechselt während des Vorlesens auf „Stopp“ (`aria-pressed`).

### Leseansicht (Vorschlag C)

- Die Seiten behalten eine klare Gliederung (`main` mit genau einem `h1`, Überschriftenhierarchie ohne Sprünge),
  damit die Leseansicht von Firefox und „Laut vorlesen“ in Edge den Text sauber erfassen.
- Die Fußzeile der Doku-Seiten bekommt einen Satz in der Seitensprache: Die Leseansicht des Browsers kann die
  Seite ebenfalls vorlesen.

## 5. Ohne JavaScript

Farbschema nach Systemvorgabe, beide Knöpfe ausgeblendet, keine Bedienleiste. Sonst wie heute.

## 6. Prüfung

- Tests (Vitest) für Vorlage und CSS: beide Paletten, Kopfskript vor dem Stylesheet, Schalter und Vorlese-Knopf in
  beiden Sprachen mit Beschriftung, `noscript` blendet beide aus, Fußzeilensatz in beiden Sprachen.
- Tests der Satzzerlegung mit deutschen und englischen Beispielen (Abkürzungen, Zahlen, Datumsangaben,
  Anführungszeichen).
- Kontrastmessung beider Paletten per Skript (WCAG-Formel).
- Sichtprüfung im Browser mit Pixelwerten: Seite in hell und dunkel (über Systemvorgabe und über den Schalter),
  kein Aufblitzen beim Laden mit gespeicherter Wahl (erster Screenshot nach dem Laden), Desktop und schmale
  Breite.
- Vorlesen im Browser: Knopf erscheint mit lokaler Stimme, Start setzt die Markierung, Stopp entfernt sie;
  Lautstärke 0 in automatischen Prüfungen. Handprüfung mit Ton durch Jens (Firefox und Chrome, A55).
- `npm run lint`, `npx tsc -b --noEmit`, `npm test`, `npm run build`.

## 7. Auswirkung auf jensfricke.com

- Neuer localStorage-Schlüssel `orrery.doku.farbschema.v1` (nur auf den Doku-Seiten).
- Neue Browserfunktion: Sprachausgabe (`speechSynthesis`), nur mit lokalen Stimmen.
- Keine neuen Anfragen an fremde Server, keine Änderung an Domain, `.htaccess` oder Einbettung.
