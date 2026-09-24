# Gesamtabnahme Phase 5 (Oberfläche, Mobile, Texturen, Musik)

## 1. Umfang

Entwurf `docs/superpowers/specs/2026-09-23-phase5-design.md` (23.09.2026, §1–§8), Fassung von
§6 vom 24.09.2026: keine mitgelieferte Musik mehr, stattdessen spielt Orrery MP3-Dateien, die
der Betreiber der Seite selbst hinterlegt. Phase 5 schließt Phase 4d ab (Tag `v0.5.0`) und
bringt fünf Etappen, jede mit eigenem Plan, eigener Umsetzung und eigenem Abnahmeprotokoll:

| Etappe | Inhalt | Schlusscommit | Protokoll |
|---|---|---|---|
| 5-1 | Oberfläche: einklappbare Seitenleiste, farbige Abschnittsüberschriften, Szenenliste im Kino-Abschnitt, nebenher Musikrecherche | `626dba1` | `docs/phase5-etappe1-abnahme.md` |
| 5-2 | Mobile: Kompaktmodus mit Bögen, grober Zeiger, Bedienziele ≥ 44 px | `afc205d` | `docs/phase5-etappe2-abnahme.md` |
| 5-3 | Texturen bis 8k in Stufen (KTX2), Nachladen nach Bedarf, Ladezeit | `c2d871e` (Textnachführung `f57a655`, Transcoder-Checkout `9a2ef39`) | `docs/phase5-etappe3-abnahme.md` |
| 5-4 | Musik aus Dateien des Betreibers (kein mitgeliefertes Stück) | `1c53656` | `docs/phase5-etappe4-abnahme.md` |
| 5-5 | Abschluss: `ASSETS.md`, Trockenlauf der Veröffentlichung, diese Gesamtabnahme | siehe unten | dieses Protokoll |

Etappe 5-5 selbst: `a2c655f` (ASSETS-Nachweis für Musik, Test auf vollständige Herkunftsangaben)
und `de97203` (Trockenlauf zeigt Dateiliste und Gesamtgröße von `dist/`), dazu der Commit dieses
Protokolls.

## 2. Zahlen der Phase

| Etappe | Testzahl | Hauptchunk |
|---|---:|---:|
| 5-1 | 5174 | 1 456,56 kB |
| 5-2 | 5192 | 1 458,08 kB |
| 5-3 (nach Nacharbeit) | 5235 | 1 523,15 kB |
| 5-4 | 5275 | 1 529,67 kB |
| **Endstand (eigener Lauf, `de97203`)** | **5285** | **1 529,67 kB** |

`npm test`: 116 Testdateien, 5285 Tests bestanden. `npm run build`: Hauptchunk
`index-B7WVnS-w.js` 1 529,67 kB (gzip 423,91 kB), unverändert gegenüber Etappe 5-4 — die beiden
Etappe-5-5-Aufgaben (`ASSETS.md`, Trockenlaufskript) fassen kein gebündeltes Modul an. Die
Grenze steht seit der Entscheidung in Etappe 5-3 bei 1 571,79 kB (nächste Frage an Jens ab
dort); der Endstand liegt rund 42,12 kB darunter, keine neue Frage nötig.

Repositoryzuwachs der Texturen (Etappe 5-3, siehe `docs/phase5-etappe3-abnahme.md` §3.4): rund
170 MiB durch 47 neue KTX2-Stufen; Jens hat diesen Zuwachs am 24.09.2026 bestätigt („bleibt so").

Die Wort- und Trailerprüfung aus der lokalen Projektanleitung lief für alle Commits und alle
neuen bzw. geänderten Dateien dieser Etappe (siehe auch §3 unten); Ergebnis jeweils 0.

## 3. Veröffentlichungsprobe

`npm run deploy -- --trocken` (Etappe 5-5, Commit `de97203`) baut `dist/` und verbindet
sich nur lesend mit dem Webspace. Ausgeführt wird die Veröffentlichung selbst nicht. Summen aus
dem Trockenlauf, ohne Hostnamen, Benutzer oder Serverpfade:

| Ordner | Dateien | Größe |
|---|---:|---:|
| (Stamm) | 2 | 1,86 kB |
| `assets/` | 394 | 4,79 MB |
| `basis/` | 2 | 584,86 kB |
| `textures/` | 48 | 177,93 MB |
| **Gesamt** | **446** | **183,31 MB** |

Verbindung zum Server: **verbunden**. Zielverzeichnis: **vorhanden**, mit **4 Einträgen**.

Offen bleibt Let's Encrypt in der KAS-Verwaltung (auch nötig für Wake Lock und die Gamepad-API
auf dem Telefon); die eigentliche Veröffentlichung folgt erst nach einer eigenen Freigabe, nicht
mit dieser Phase.

## 4. Rundgang Desktop

Chrome über Playwright, Vite-Server auf Port 5173 (Basis `/Orrery/`, per `curl` als laufend
bestätigt, kein zweiter gestartet). Direkt nach jedem Navigieren
`window.store.setState({ quality: { tier: 'high' } })`.

### 4.1 Oberfläche (5-1)

| Kriterium | Soll | Ist |
|---|---|---|
| Seitenleiste einklappen | nur Reiter sichtbar | `ui.panels.leiste` auf `false` gesetzt, Leiste eingeklappt; wieder auf `true` geöffnet |
| Breite per Griff ziehen | Wert ändert sich innerhalb 14–32 rem | vorher 18 rem, nachher 22 rem (`ui.leiste.breiteRem`) |
| Farbige Abschnittsüberschriften | sichtbar, Panels und Infopanel unterscheidbar | Screenshot bestätigt: „Himmelskörper“ und „Zeit“ (linke Spalte) in Blau, „Szene: Vorbeiflug an Jupiter“ (Infopanel-Kopf) in Türkis — deutlich getrennte Streifen, wie in Etappe 5-1 mit Kontrastmessung ≥ 4,5 : 1 belegt |
| Szenenliste startet Kino ab gewählter Szene | Klick setzt `cinema.running`/`cinema.nummer`, `sceneIndexFor` bestätigt den Index | Klick auf „Merkur auf der Innenbahn“ (Index 5 von 19): `cinema.running` true, `cinema.nummer` 24, `sceneIndexFor(24, 19, seed, shuffle)` = 5 — deckungsgleich |

### 4.2 Kompaktmodus (5-2)

Eigener Kontext (`page.context().browser().newContext(...)`), Viewport 412 × 915 bzw. 915 × 412,
Pixeldichte 2,625, `isMobile`/`hasTouch` true, neue Seite sofort `bringToFront()`.

| Kriterium | Soll | Ist (Hochformat) | Ist (Querformat) |
|---|---|---|---|
| Zwei Reiter unten rechts | vorhanden, beschriftet | `.bogenreiter` mit zwei Schaltflächen „Bedienung“/„Info“ | dieselben zwei Schaltflächen |
| Nur ein Bogen gleichzeitig | Antippen des zweiten Reiters ersetzt den ersten | Bedienung antippen → `data-offen="true"`, nur „Bedienung“ `aria-pressed`; Info antippen → nur „Info“ `aria-pressed`, „Bedienung“ zurück auf `false` | dasselbe Muster bestätigt |
| Denselben Reiter erneut antippen | schließt den Bogen | zweiter Tipp auf „Info“ → `data-offen="false"`, beide `aria-pressed="false"` | nicht erneut geprüft (Verhalten in Etappe 5-2 bereits für beide Formate belegt) |

### 4.3 Texturen (5-3)

Qualitätsstufe `high`, Kamera auf `attached`/`earth` mit `distance: 6500` km (Erde füllt das
Bild). Netzwerkanfragen (`browser_network_requests`, gefiltert auf `earth`/`albedo`):

1. `GET textures/earth/albedo-1024.ktx2` → 200
2. `GET textures/earth/albedo-1024.ktx2` → 200 (zweite Anfrage durch die React-StrictMode-
   Doppelmontage im Entwicklungslauf, bekanntes Verhalten aus Etappe 5-3 §4.2, kein Fehler im
   Build)
3. `GET textures/earth/albedo-8192.ktx2` → 200

Reihenfolge wie gefordert: zuerst die 1k-Stufe, danach eine höhere Stufe der Erde. Nach rund
3,5 s zeigte `texturStand()` für die Erde `8192`, alle 28 übrigen Körper blieben bei `1024`
(kein Übergriff des Nachladens auf Körper außerhalb des Kamerawegs, wie in Etappe 5-3 §4.2
gemessen).

### 4.4 Musik (5-4), lautlos

`public/musik/test-a.mp3` und `test-b.mp3` per
`ffmpeg -f lavfi -i "anullsrc=r=44100:cl=stereo" -t 20 -b:a 128k` erzeugt.
`ffmpeg -i <datei> -af volumedetect -f null -` meldete für beide Dateien `max_volume: -91.0 dB`
(unter der Grenze −90 dB, kein hörbarer Ton). Dazu `public/musik/stuecke.json`:
`[{"datei":"test-a.mp3","titel":"Test A"},{"datei":"test-b.mp3"}]`.

Nach dem Neuladen: Die Musikbedienung im Kino-Abschnitt wurde sichtbar (Umschalter
„Aus/Nur Kino/Immer“, Lautstärkeregler, Kästchen „Stumm (M)“, Zeile „♪ Test A“) — der
Kino-Modus blendet die ganze Oberfläche nach kurzer Ruhe aus (planvorgegebenes Verhalten, siehe
`docs/phase5-etappe4-abnahme.md` und die lokale Projektanleitung zu `pointermove`); nach einer
einzelnen Zeigerbewegung war die Bedienung sofort sichtbar.

Wirkungsprobe des Modus „Nur Kino“: `ton.modus` auf `kino`, Kino stand → `window.musik.stand()`
lieferte `spielt: false`; danach Kino gestartet (`cinema.running: true`) → `spielt: true`.
Nach der Messung: Browser geschlossen, `public/musik/` vollständig gelöscht
(`rm -rf public/musik`).

### 4.5 Konsole

Über den ganzen Rundgang (Oberfläche, Texturen, Musik, jeweils nach jedem Navigieren neu
geprüft): **0 Fehler, 0 Warnungen** — nur der übliche React-DevTools-Hinweis auf Info-Ebene. Die
Anfrage an `musik/stuecke.json`, solange keine Liste vorlag, erzeugte keine Konsolenmeldung
(reine Netzwerkanfrage).

Nach dem Rundgang: Screenshots und Logs aus `.playwright-mcp/` gelöscht, `git status --short`
leer.

## 5. Handprüfung auf dem A55 (Jens)

**Vorbereitung:** Entwicklungsserver beenden, dann im Projektordner `npm run dev -- --host`
starten; die angezeigte Netzwerkadresse (`http://<Rechner-IP>:5173/Orrery/`) auf dem A55 im
selben WLAN öffnen. Für den Ton eigene MP3-Dateien nach `public/musik/` legen und daneben
`public/musik/stuecke.json` anlegen (Beispiel und Pflichtfelder im Abschnitt „Eigene Musik“ der
`README.md`).

| Prüfpunkt | Ergebnis |
|---|---|
| Oberfläche: Seitenleiste ein-/ausklappen, Breite ziehen, farbige Überschriften | |
| Kompaktmodus Hochformat: zwei Reiter, nur ein Bogen gleichzeitig, Bedienziele ≥ 44 px | |
| Kompaktmodus Querformat: dasselbe, Gerät drehen | |
| Texturen bei Qualitätsstufe „mittel“: Schärfe der Erde aus der Nähe | |
| Texturen bei Qualitätsstufe „mittel“: Schärfe des Jupiter aus der Nähe | |
| Texturen: Ladezeit gefühlt (flüssig/spürbare Wartezeit) | |
| Ton mit eigenen Stücken, Modus „Nur Kino“: startet nur mit dem Kino, Lautstärke wirkt | |
| Ton mit eigenen Stücken, Modus „Immer“: spielt auch ohne Kino | |
| Taste M bzw. Kästchen „Stumm“: schaltet zuverlässig | |
| Titelzeile zeigt Titel/Urheber bzw. Dateiname | |
| Überblendung zwischen zwei Stücken hörbar weich (kein Knacken/Sprung) | |
| Verdeckter Tab auf dem A55: Ton blendet aus, beim Zurückkehren wieder ein | |
| Dasselbe für Ton und verdeckten Tab am Desktop (eigener Browser-Tab wechseln) | |

## 6. Rulings der Phase

Je Etappenprotokoll die Zahl der dort verzeichneten Rulings (Abschnitt „Rulings“, gezählt an den
Aufzählungspunkten): Etappe 5-1 sieben, Etappe 5-2 sechs, Etappe 5-3 vierzehn (acht zur
Kodierung und Werkzeugkette, sechs aus den Plan-Vorgaben), Etappe 5-4 fünf. Einzelheiten stehen
im jeweiligen Protokoll.

Rulings dieser Etappe (Plan und Ledger):

- **Ruling (Plan):** Die lokale Übersicht des Trockenlaufs erscheint vor dem Lesen der
  Zugangsdaten aus `.env.local`, damit sie auch ohne diese Datei nutzbar ist. Umgesetzt in
  Task 2 (`de97203`): `hauptlauf()` gibt die Übersicht aus, bevor `.env.local` geladen wird.
- **Ruling (Plan):** Der Tag `v0.6.0` wird lokal gesetzt; gepusht wird er erst zusammen mit
  `master` nach Jens' eigenem Ja (siehe §8).
- **Ledger, Task 2 (kleiner Befund, hier erledigt):** Der Umsetzerbericht zu Task 2 belegte den
  Hauptchunk nicht frisch (das Trockenlaufskript geht selbst nicht ins Bündel). Diese Abnahme
  misst den Endstand deshalb noch einmal selbst (§2): 1 529,67 kB, unverändert gegenüber
  Etappe 5-4.

## 7. Offene Punkte der Phase

Aus den „Bekannte Unschärfen“-Abschnitten (§7) der vier Etappenprotokolle, gebündelt; bereits
innerhalb der Phase behobene oder gegenstandslos gewordene Punkte sind ausgelassen (etwa der
Screenreader-Marker der Szenenliste aus Etappe 5-1, gelöst in Etappe 5-2, oder die
Musikvorschläge aus Etappe 5-1, gegenstandslos durch die Umplanung der Etappe 5-4, siehe §8).

**(a) Tests, die eine Verzweigung nicht einzeln abdecken**

- Kein Test für „schmaler Bildschirm → kein Breitengriff“ (5-1).
- Die Verdrahtung der Qualitäts-Startstufe (`deckeStufe` in `app/loop.ts`) hat keinen eigenen
  Test, nur die Emulationsmessung bestätigt sie indirekt (5-2).
- Grenzwerte der Lautstärke (0/1) und die Modi „aus“/„kino“ sind nicht einzeln getestet (5-4).
- Kein Test für die Beschriftung des laufenden Stücks ohne Urheberangabe (5-4).

**(b) Bedienung und Barrierefreiheit**

- Die Szenenknöpfe tragen `title` statt `aria-label` (unschädlich, der sichtbare Text liefert
  den zugänglichen Namen ohnehin) (5-1).
- `useMedienabfrage` löst im Einhänge-Effekt ein zusätzliches, überflüssiges Rendern aus (5-2).
- `infoOffen(panels, schmal)` bekommt von beiden Aufrufern inzwischen immer `schmal=false`; der
  andere Zweig ist toter Pfad, Aufräumen bei Gelegenheit (5-2).
- Der Gruppenname „Musik“ wiederholt die Abschnittsüberschrift; „Musikmodus“ wäre genauer (5-4).

**(c) Werkzeugkette Texturen**

- Die Lageprüfung (gespiegelt/nicht gespiegelt) deckte nur 3 von 6 Testkodierungen ab, der Mond
  fehlt (5-3).
- Die Typprüfung meldet einzelne Stellen in `scripts/textur-stufe.py`
  (`Image.LANCZOS`/`FLIP_TOP_BOTTOM`, `spec None`); das Skript selbst läuft fehlerfrei (5-3).
- `eslint.config.js` schließt `public/basis/**` (den kopierten Transcoder) von der Prüfung aus;
  im Plan nicht vorgesehen, aber sachlich nötig (5-3).
- `benoetigteStufe` erlaubt rechnerisch eine Stufe 0 auch unterhalb der kleinsten Obergrenze
  1024; praktisch nicht erreichbar (5-3).
- Die Zeit, bis ein Kameraziel nach den Startladungen seine breitere Stufe erhält, streut stark
  (rund 3 bis 5600 ms je nach Prüftakt und belegten Ladeplätzen) — Bestandsverhalten (5-3).

**(d) Musikwiedergabe**

- `link()` akzeptiert `HTTPS://` in Großschreibung ohne eigenen Testfall (5-4).
- Der Stückwechsel an der Rundengrenze der Mischfolge bevorzugt immer Position 1 (leichte,
  harmlose Verzerrung der Zufälligkeit) (5-4).
- `erzeugeFolge`/`mischeRunde` sind ohne eigenen Schutz für eine leere Liste; der Aufrufer fängt
  den Fall vorher ab (5-4).
- Die Element-Listener des Spielers werden in `beenden()` nicht abgemeldet; die Funktion ist
  heute ungenutzt (5-4).
- Messpunkt „verdeckter Tab“ (Ton blendet aus, kehrt beim Zurückkehren wieder ein) ließ sich mit
  den Zugriffswerkzeugen nicht auslösen (kein `visibilitychange` bei einem zweiten, per
  Werkzeug geöffneten Tab) — Prüfung mit echtem Tabwechsel steht aus, siehe §5.

## 8. Fragen an Jens

1. **Ergebnis der Handprüfung** (§5): Bitte die Tabelle ausfüllen und zurückmelden.
2. **Freigabe von Tag und Push:** Darf `v0.6.0` lokal gesetzt und zusammen mit `master`
   gepusht werden?
3. **Stand der früheren Fragen aus den Etappenprotokollen:**
   - Musikauswahl und die Aufnahme des Komponistennamens „Debussy“ aus Etappe 5-1 sind durch
     die Umplanung der Etappe 5-4 (keine mitgelieferte Musik mehr) hinfällig.
   - Die Barrierefreiheit der Szenenliste (Etappe 5-1, Frage 3) ist in Etappe 5-2 erledigt.
   - Die zehn Textfundstellen und der Repositoryzuwachs aus Etappe 5-3 sind am 24.09.2026
     entschieden (Texte angepasst, Zuwachs bleibt so).
   - Die Hörprüfung mit eigenen Stücken und die Prüfung des verdeckten Tabs aus Etappe 5-4
     stehen jetzt in §5 dieses Protokolls.
   - Weiterhin offen: die Frage aus der Nachführung nach Phase 4d, ob ähnlich gelagerte
     mechanische Bereinigungen künftig gleich auf dem mittleren statt dem kleinsten Modell
     starten sollen.

Die Wort- und Trailerprüfung aus der lokalen Projektanleitung lief vor dem Commit auch über
diese Datei (Ergebnis 0), ohne Suchmuster in dieser Datei.
