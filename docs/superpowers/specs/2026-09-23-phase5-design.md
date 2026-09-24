# Phase 5 — Oberfläche, Mobile, Texturen, Musik

Entwurf vom 23.09.2026. Phase 4 ist mit Tag `v0.5.0` abgeschlossen (Hochschultexte,
Gesamtabnahme `docs/phase4d-abnahme.md`, Nachführung `docs/nachfuehrung-4d-abnahme.md`).
Phase 5 schließt mit Tag `v0.6.0`. Die Veröffentlichung auf dem Webspace folgt danach
mit eigener Freigabe und gehört nicht zu dieser Phase.

Phase 5 hat fünf Etappen, jede mit eigenem Plan und eigener Abnahme:

| Etappe | Inhalt | Abschnitt |
|---|---|---|
| 5-1 | Oberfläche: Seitenleiste, Überschriften, Szenenliste; nebenher Musikrecherche | §3 |
| 5-2 | Mobile: Kompaktmodus, Bedienziele, Referenzgerät Galaxy A55 | §4 |
| 5-3 | Texturen bis 8k in Stufen, Nachladen, KTX2, Ladezeit | §5 |
| 5-4 | Musik aus Dateien des Betreibers, nur im Kino oder immer | §6 |
| 5-5 | Abschluss: `ASSETS.md`, Gesamtabnahme, `v0.6.0` | §7 |

## 1. Ausgangslage

- **Oberfläche.** Die linke Spalte ist eine feste Leiste (`w-72`, also 18 rem) in
  `ui/App.tsx` mit Kopfzeile, den Panels Zeit, Maßstab, Kino, Kamera, Anzeige,
  Ansichten und dem Objektbaum. Sie lässt sich nicht einklappen und nicht in der
  Breite ziehen. Die rechte Spalte (Infopanel) kann beides: Reiter zum Öffnen,
  `ui.panels.info`, Breite `ui.info.breiteRem` über den Baustein `ui/info/Griff.tsx`.
  Panelüberschriften (`ui/panels/Panel.tsx`) sind weiße, halbfette Schrift ohne
  farbliche Abhebung.
- **Kino.** `CinemaPanel` zeigt eine Zeile „Aktuelle Szene“. Eine Szenenauswahl gibt
  es nicht. 19 Szenen in `data/scenes.ts`; die Reihenfolge bestimmt
  `sceneIndexFor(nummer, anzahl, seed, shuffle)` in `sim/director.ts`, der Film ist
  aus `nummer`, `seed` und `shuffle` vollständig reproduzierbar.
- **Schmale Bildschirme.** Unter 900 px Breite wird das Infopanel zum Bogen von unten
  (`SCHMAL_ABFRAGE` in `ui/info/konstanten.ts`, Zwilling in `src/index.css`). Die
  linke Leiste bleibt dabei unverändert und überdeckt auf dem Telefon einen großen
  Teil des Bildes. Bedienziele sind für die Maus bemessen.
- **Texturen.** 29 JPEG-Albedokarten und eine Ringtextur (PNG) unter
  `public/textures/`, zusammen 8,5 MB. Zehn Karten in 2048×1024, der Rest in
  1024×512. `render/bodies.ts` lädt jede Karte einmal per `TextureLoader` und misst
  ihr Mittel auf einem Canvas (`texturMittelLinear`) für den Albedo-Faktor.
  `QUALITY_SETTINGS.textureSize` in `app/quality.ts` (1024/2048/8192) wird nirgends
  verwendet.
- **Quellen für 8k**, geprüft am 23.09.2026 durch Herunterladen: Solar System Scope
  liefert echte 8192×4096 nur für Merkur, Venus (Oberfläche), Erde (Tagseite), Mars
  und Mond (JPEG 4,5 bis 15 MB). Die „8k“-Dateien von Sonne, Jupiter und Saturn sind
  4096×2048. Für Uranus und Neptun gibt es keine 8k-Datei (die Adresse liefert eine
  HTML-Seite).
- **Ton.** Es gibt keinen Ton und keinen Tonzustand im Store.
- **Qualitätsstufe.** `quality.tier` ist `auto`, `low`, `medium` oder `high`;
  `detectTier` in `app/quality.ts` stuft nur herunter.
- **Persistenz.** Die Sitzung führt den ganzen Zustand. Der Link streicht `quality`,
  `ui.hidden`, `ui.panels` und die Bildschirmmaße des Infopanels; eine Ansicht
  streicht `cinema`, `quality` und `ui` ganz (`store/persist.ts`).

## 2. Entscheidungen (Jens, 23.09.2026)

1. **Umfang:** Oberflächenwünsche, mobile Bedienung, Leistung und Laden, Musik. Die
   Modellbefunde aus den Hochschul-Abnahmen gehören nicht dazu.
2. **Oberfläche:** Die linke Spalte wird einklappbar wie die rechte (Reiter, Breite
   ziehen). Abschnittsüberschriften werden farblich abgesetzt. Die Kinoszenen stehen
   als Liste wie der Objektbaum; ein Klick startet das Kino ab dieser Szene, danach
   läuft die Playlist weiter.
3. **Mobile:** Prüfung in der Emulation und von Hand auf einem Samsung Galaxy A55.
4. **Texturen:** bis 8k für die großen Körper, Stufen 1k/2k/8k, erst niedrig laden
   und dann nachladen, KTX2, Ladezeit messen. Alle erzeugten Stufen kommen ins
   Repository.
5. **Musik:** frei lizenzierte Aufnahmen (weder synthetisiert noch NASA-Klänge),
   CC0 bevorzugt, sonst CC BY. Vier bis sechs Vorschläge, Jens hört und wählt.
   Wiedergabe wahlweise „nur im Kino“ oder „immer“, Standard für neue Besucher
   „nur im Kino“. Stücke lassen sich später ohne Codeänderung nachrüsten (Datei plus
   Listeneintrag).
   *Änderung (Jens, 24.09.2026):* Die Anwendung bringt keine Musik mit. Sie spielt
   MP3-Dateien, die der Betreiber der Seite selbst hinterlegt; Lizenz- und Rechtefragen
   obliegen dem Betreiber (§6).
6. **Reihenfolge:** 5-1 → 5-2 → 5-3 → 5-4 → 5-5. Die Musikrecherche läuft während
   5-1 nebenher, damit Jens vor 5-4 wählen kann.

## 3. Etappe 5-1: Oberfläche

### 3.1 Seitenleiste

Neue Komponente `ui/Seitenleiste.tsx` übernimmt die linke Spalte aus `App.tsx`.

- **Einklappen:** Zustand in `ui.panels.leiste` (fehlend = offen). Eingeklappt bleibt
  wie beim Infopanel ein Reiter am linken Rand, der die Leiste wieder öffnet.
  Kopfzeile und Leiste teilen sich die Spalte; eingeklappt verschwindet beides bis
  auf den Reiter.
- **Breite:** neues Feld `ui.leiste.breiteRem`, Standard 18 rem (heutige Breite),
  Grenzen 14 bis 32 rem. Gezogen wird mit `Griff` an der rechten Kante. `Griff`
  bekommt dafür eine Angabe, an welcher Kante er sitzt, damit Pfeil rechts die
  Leiste verbreitert (beim Infopanel bleibt Pfeil links).
- **Persistenz:** `ui.leiste` reist mit der Sitzung, nicht im Link (in die
  Streichliste `link` aufnehmen) und nicht in Ansichten (dort ist `ui` ohnehin
  gestrichen). `store/pruefer.ts` prüft Typ und Grenzen.
- **Zurücksetzen** behält wie beim Infopanel die Breite.

### 3.2 Überschriften

Ein gemeinsamer Überschriftenstil für `Panel.tsx` und die Kopfzeile des Infopanels:
Akzentfarbe für den Titel und ein schmaler farbiger Streifen, damit sich die
Abschnitte beim Überfliegen trennen. Die Farbe legt der Plan fest. Der Kontrast des
Titels zum tatsächlichen Panelgrund (halbdurchsichtig über dem Weltraum) muss
mindestens 4,5 : 1 betragen, gemessen an Pixeln eines Screenshots, nicht aus den
Tailwind-Werten gerechnet.

### 3.3 Szenenliste

- Die Zeile „Aktuelle Szene“ im `CinemaPanel` entfällt. An ihre Stelle tritt eine
  Liste aller Szenen im Stil des Objektbaums (Schaltflächen, eine je Zeile).
- **Markierung:** ● vor der laufenden Szene (Kino läuft), ○ vor der Szene, bei der
  das Kino beim nächsten Start einsetzen würde (Kino steht). Die markierte Zeile trägt
  `aria-current="true"`.
- **Klick:** Gesucht wird die kleinste Nummer `n ≥ cinema.nummer`, für die
  `sceneIndexFor(n, anzahl, seed, shuffle)` die gewählte Szene liefert. Jede Runde
  von `anzahl` Nummern ist eine Permutation aller Szenen (auch gemischt), die Suche
  endet also spätestens nach `2 · anzahl` Schritten. Dann `nummer = n`,
  `elapsedSec = 0`, Kino läuft. Danach geht die Playlist normal weiter. Kein neues Store-Feld.
- Die reine Suchfunktion liegt neben `startCinema` in `ui/cinemaControl.ts` und wird
  mit und ohne Mischen getestet.

### 3.4 Musikrecherche (nebenher)

Während 5-1 entsteht `docs/phase5-musik-auswahl.md` mit vier bis sechs Vorschlägen:
Titel, Urheber, Lizenz (CC0 oder CC BY 4.0/3.0; keine NC-, ND- oder SA-Stücke),
Quelle mit Link, Dauer, Format, kurze Charakterisierung. Jede Lizenzangabe an der
Quelle geöffnet und geprüft. Jens wählt vor Beginn von 5-4; die Wahl steht danach im
Dokument.

## 4. Etappe 5-2: Mobile

### 4.1 Kompaktmodus

- **Auslöser:** Breite unter 900 px **oder** Höhe unter 500 px. `SCHMAL_ABFRAGE` wird
  dazu auf `(max-width: 899px), (max-height: 499px)` erweitert; der Zwilling in
  `src/index.css` wird mitgeführt. Kein Store-Feld, der Modus folgt allein dem
  Bildschirm.
- **Ein Bogen gleichzeitig:** entweder Bedienung (Inhalt der Seitenleiste) oder Info.
  Zwei Reiter unten rechts schalten um; ein Tipp auf den offenen Reiter schließt den
  Bogen. Ohne offenen Bogen gehört das ganze Bild der Szene.
- **Hochformat:** Bogen von unten, 55 % der Höhe.
- **Querformat:** Bogen von der Seite, volle Höhe, höchstens 24 rem oder 55 % der
  Breite (der kleinere Wert).
- Breitengriffe sind im Kompaktmodus ausgeblendet; die gespeicherten Breiten bleiben
  unberührt und gelten wieder, sobald der Bildschirm breit genug ist.

### 4.2 Grober Zeiger

- Bei `(pointer: coarse)` sind alle Bedienelemente mindestens 44 × 44 px groß
  (Schaltflächen, Reiter, Regler, Zeilen in Objektbaum und Szenenliste).
- Die Kürzelübersicht entfällt bei grobem Zeiger.
- **Qualitätsstufe:** Steht `quality.tier` auf `auto` und gilt Kompaktmodus mit
  grobem Zeiger, beginnt die Einstufung bei `medium` statt `high`; `detectTier`
  stuft wie bisher nur herunter.
- Wake Lock bleibt, wie er ist; auf dem Gerät greift er erst mit HTTPS.

### 4.3 Prüfung

- **Emulation:** Playwright mit 412 × 915 CSS-Pixeln, Pixeldichte 2,625, Touch,
  Hoch- und Querformat. Gemessen werden die Größe aller Bedienziele (≥ 44 px), dass
  sich die Bögen nicht überlappen und dass nichts waagerecht über den Rand ragt.
- **Handprüfung** auf dem Galaxy A55 über `vite --host` im lokalen Netz: Bogenwechsel,
  Drehen des Geräts, Objektwahl per Tipp, Kino starten und anhalten, Bildrate per
  eigenem rAF-Zähler.

## 5. Etappe 5-3: Texturen und Laden

### 5.1 Stufen je Körper

| Körper | Stufen | Quelle der Höchststufe |
|---|---|---|
| Merkur, Venus, Erde, Mars, Mond | 1k, 2k, 8k | Solar System Scope, 8192×4096 |
| Sonne, Jupiter, Saturn | 1k, 2k, 4k | Solar System Scope, 4096×2048 |
| Uranus, Neptun | 1k, 2k | heutige 2k-Karte |
| Monde, Zwergplaneten | 1k | heutige 1k-Karte |

„Höchststufe“ meint im Folgenden die jeweils letzte Stufe eines Körpers. Die
Ringtextur des Saturn bleibt unverändert ein PNG mit eigenem Lader (`render/rings.ts`);
der Hochschultext `szene-ringdurchflug` nennt ihre 2048 Pixel.

### 5.2 Format und Werkzeugkette

- **KTX2 statt JPEG.** Ein 8k-JPEG belegt entpackt mit Mipmaps rund 170 MB
  Grafikspeicher und wird im Hauptthread dekodiert. KTX2 (Basis Universal) wird im
  Worker umgesetzt und bleibt auf der GPU komprimiert (BC7 rund 43 MB bei 8k).
  Kodierung UASTC oder ETC1S entscheidet die Probe (§5.6) als Ruling.
- **Lader:** `KTX2Loader` aus `three/examples/jsm`, `detectSupport(renderer)` einmal
  beim Aufbau. Der Transcoder (`basis_transcoder.js` und `.wasm`) liegt versioniert
  unter `public/basis/`; ein Test vergleicht ihn byteweise mit der Fassung in
  `node_modules/three`, damit ein three-Update ihn nicht still veralten lässt.
- **Lage und Farbraum:** KTX2 kennt kein `flipY`. Die Karten werden beim Kodieren
  gespiegelt; die Probe prüft die Lage an der Erde. Farbraum sRGB in der Datei,
  `colorSpace = SRGBColorSpace` am Lader.
- **Ablage:** `public/textures/<koerper>/albedo-<breite>.ktx2`, z. B.
  `albedo-1024.ktx2`. Die JPEGs unter `public/textures/` entfallen.
- **Quellen:** Die heutigen JPEGs wandern unverändert nach
  `assets-quellen/texturen/<koerper>/albedo.jpg` (versioniert, nicht ausgeliefert).
  Die neuen 4k- und 8k-Quellen lädt das Bauskript nach einer Liste mit URL und
  SHA-256 in den git-ignorierten Ordner `.cache/texturen/`.
- **Bauskript** `scripts/texturen-bauen.ts`, aufgerufen mit `npm run texturen`:
  Quellen holen und prüfen, auf die Stufen verkleinern (Lanczos), mit KTX-Software
  von Khronos kodieren (Einrichtung per winget, im Skriptkopf dokumentiert), das
  Mittel messen (§5.3) und die Datenliste schreiben. Das Skript läuft von Hand; der
  Build braucht es nicht, weil alle Ergebnisse versioniert sind.
- **Datenliste** `src/data/texturen.ts` (erzeugt, reine Daten): je Körper die Stufen
  mit Breite und Pfad sowie das gemessene Mittel. `appearance.textures.albedo` in
  den Körperdaten entfällt; maßgeblich ist die Datenliste. Körper ohne Eintrag
  behalten ihre Ausweichfarbe wie heute Körper mit leerem Pfad.

### 5.3 Albedo-Faktor

`texturMittelLinear` misst heute das geladene Bild auf einem Canvas; mit komprimierten
Texturen geht das nicht mehr. Das Bauskript misst das Mittel an der 1k-Stufe mit dem
Verfahren von `scripts/textur-mittel.py` (256×128, nach cos(Breite) gewichtet, Pixel
unter 0,005 ausgeschlossen) und schreibt es in die Datenliste. `render/bodies.ts`
liest es dort. Ein Test prüft, dass jedes Mittel um höchstens 0,005 vom
fachgeprüften Wert in `render/__fixtures__/textur-mittel.json` abweicht; eine
größere Abweichung ist ein Fehler der Werkzeugkette, kein neuer Sollwert.

### 5.4 Nachladen nach Bedarf

Neues Modul `render/texturen.ts` mit reinen, getesteten Funktionen und einer kleinen
Warteschlange:

- **Start:** Für alle Körper wird die 1k-Stufe geladen. Bis sie steht, bleibt die
  Ausweichfarbe (wie heute).
- **Bedarf:** `benoetigteStufe(durchmesserPx, stufen, obergrenze)` liefert die
  kleinste Stufe, deren Breite W die Bedingung `durchmesserPx ≤ 0,75 · W / 2`
  erfüllt, höchstens die Obergrenze. Begründung: Eine Kugel zeigt die halbe
  Kartenbreite über ihren Durchmesser, W/2 Texel je Durchmesser sind also die volle
  Auflösung; der Faktor 0,75 lädt etwas vorausschauend.
- **Obergrenze:** aus der Qualitätsstufe, `low` 1024, `medium` und `auto` 2048
  (`auto` wie bei `beltCount`), `high` 8192, zusätzlich höchstens
  `renderer.capabilities.maxTextureSize`. Die Tabelle steht in `render/` und wird
  per Test gegen `QUALITY_SETTINGS.textureSize` in `app/quality.ts` geprüft (wie
  bei den Gürtelteilchen, weil `render/` nicht aus `app/` importieren darf).
- **Prüftakt:** höchstens zweimal je Sekunde aus dem Bildtakt von `render/scene.ts`,
  mit dem ohnehin berechneten Abstand und Radius des Körpers.
- **Warteschlange:** höchstens zwei Ladevorgänge gleichzeitig; das Kameraziel zuerst,
  danach nach Durchmesser absteigend.
- **Tausch:** Ist eine höhere Stufe geladen, ersetzt sie `map` und `emissiveMap`, die
  alte Textur wird freigegeben (`dispose`). Eine geladene Stufe wird nie wieder
  heruntergestuft, auch nicht, wenn die Qualitätsstufe später sinkt.
- **Fehler:** Scheitert eine Stufe, bleibt die bisherige stehen; kein zweiter Versuch
  in dieser Sitzung, keine Meldung.
- **DEV-Abfrage:** `window.texturStand()` liefert je Körper die geladene Breite, für
  Messungen.

### 5.5 Auslieferung

`public/.htaccess` bekommt `AddType image/ktx2 .ktx2` und
`AddType application/wasm .wasm`, einen Tag Cache für `.ktx2` (wie heute für Bilder)
und Kompression für den Transcoder.

### 5.6 Probe und Messungen

- **Probe (erster Task):** 8k-Erde in UASTC (mit Zstandard) und ETC1S kodieren;
  Dateigröße und mittlere Pixelabweichung gegen das Original messen, Lage prüfen.
  Das Ergebnis und die gewählte Kodierung gehen als Ruling in die Abnahme.
- **Bildvergleich:** Die 2k-Stufe (KTX2) gegen das bisherige 2k-JPEG in derselben
  Ladung, Szene mit formatfüllendem Körper; mittlere Abweichung auf der Scheibe
  höchstens 2 von 255. Damit bleiben die Helligkeitsmessungen früherer Phasen gültig.
- **Ladezeit:** per Resource Timing und `texturStand()`, ungedrosselt und mit der
  Chrome-Voreinstellung „Fast 4G“ über CDP (Werte ins Protokoll). Ziele: Die
  1k-Stufen aller Körper wiegen zusammen unter 1,5 MB; unter „Fast 4G“ sind alle
  Körper spätestens 3 s nach dem ersten gerenderten Bild texturiert. Zusätzlich
  gemessen: Zeit bis zur 8k-Erde bei Nahsicht und der längste Einzelbild-Ausreißer
  beim Tausch (eigener rAF-Zähler).
- **Texte:** grep über `src/data/texte/` nach Auflösungs- und Formatangaben der
  Albedokarten. Eine Aussage, die durch die Stufen falsch würde, geht als Frage an
  Jens; fachgeprüfte Texte werden nicht geändert.

## 6. Etappe 5-4: Musik aus Dateien des Betreibers

Fassung vom 24.09.2026 (Jens): Die Anwendung bringt keine Musik mit. Der Betreiber der
Seite kann eigene MP3-Dateien hinterlegen, die dann abgespielt werden; Lizenz- und
Rechtefragen obliegen ihm. Die Musikrecherche aus 5-1 (`docs/phase5-musik-auswahl.md`)
wird nicht umgesetzt.

### 6.1 Dateien und Liste

- **Ablage:** Dateien im Ordner `musik/` der ausgelieferten Seite, dazu die Liste
  `musik/stuecke.json`: `[{ "datei": "stueck.mp3", "titel": "…", "urheber": "…",
  "link": "https://…" }]`. Pflicht ist nur `datei` (Name relativ zu `musik/`, ohne
  Pfadtrenner); `titel`, `urheber` und `link` sind freiwillig. Eine Liste ist nötig, weil
  eine statische Seite ihren Ordner nicht auflisten kann (`.htaccess`: `Options
  -Indexes`).
- **Laden:** Die Anwendung holt die Liste zur Laufzeit (`fetch`, ohne Cache-Zwang).
  Fehlt sie, ist sie kein gültiges JSON, oder bleibt nach der Prüfung kein Eintrag
  übrig, gibt es keine Musik: keine Bedienung, kein Ton, keine Meldung. Ungültige
  Einträge (kein `datei`, Pfadtrenner, falscher Typ) werden still verworfen.
- **Nichts im Repository:** Weder Liste noch Musikdatei werden versioniert.
  `public/musik/` ist git-ignoriert; legt jemand lokal Dateien dort ab, lädt
  `npm run deploy` sie mit hoch, sie erscheinen aber nie im öffentlichen Repository.
  Weil der Build keine Liste enthält, überschreibt ein Deploy die Liste des
  Betreibers auf dem Webspace nicht; gelöscht wird dort ohnehin nur in `assets/`.
- **Format:** MP3 (spielen alle Zielbrowser, auch Safari und Samsung Internet).
  Lautheit und Bitrate liegen beim Betreiber; die Anwendung gleicht nichts an.
- **Doku:** Ein Abschnitt „Eigene Musik“ in der `README.md` beschreibt Ablage, Liste mit
  Beispiel, Verhalten ohne Liste und den Hinweis, dass Rechte und Lizenzen beim
  Betreiber liegen. `public/.htaccess` bekommt einen Tag Cache für `.mp3` wie für
  Bilder.

### 6.2 Zustand

Neues Store-Feld `ton: { modus: 'aus' | 'kino' | 'immer'; lautstaerke: number;
stumm: boolean }`, Standard `{ modus: 'kino', lautstaerke: 0.5, stumm: false }`.
`stumm` trägt die Taste M, damit der gewählte Modus erhalten bleibt. `ton` reist mit
der Sitzung, nicht im Link und nicht in Ansichten (beide Streichlisten erweitern);
`store/pruefer.ts` prüft Werte und Grenzen. Die geladene Liste ist kein Store-Zustand
der Sitzung; ob Musik verfügbar ist, hält ein kleiner, nicht gespeicherter Zustand
für die Oberfläche.

### 6.3 Wiedergabe

Einstieg `app/musik.ts`, reine Logik daneben in einer eigenen Datei (testbar ohne
Browser):

- **Wann:** `sollSpielen(ton, kinoLaeuft, sichtbar)` ist wahr, wenn nicht stumm, die
  Seite sichtbar ist (`visibilitychange`) und der Modus `immer` ist oder `kino` bei
  laufendem Kino.
- **Technik:** ein `AudioContext`, zwei `HTMLAudioElement`s (`preload="none"`, also
  gestreamt) über je einen `GainNode` an einen gemeinsamen Lautstärke-Knoten. Nur so
  greift die Lautstärke auch auf iOS, wo `audio.volume` nichts bewirkt. Der
  `AudioContext` entsteht erst, wenn die Liste Einträge hat.
- **Reihenfolge:** gemischte Folge aller Stücke, keine Wiederholung, bevor alle
  gespielt sind, und nicht dasselbe Stück zweimal hintereinander an der Rundengrenze
  (bei einem einzigen Stück läuft es in Schleife). Unabhängig von den Kinoszenen.
- **Blenden:** Einblenden und Ausblenden 1,5 s bei jedem Wechsel von `sollSpielen`,
  Überblendung 3 s zum nächsten Stück. Ausgeblendet wird pausiert, nicht beendet;
  das Stück läuft beim nächsten Einblenden weiter.
- **Autoplay-Sperre:** Ist der `AudioContext` gesperrt, wird er beim nächsten
  `pointerdown` oder `keydown` fortgesetzt. Kein Hinweis in der Oberfläche.
- **Fehler:** Fehlt eine Datei oder scheitert das Dekodieren, wird das Stück
  übersprungen und in dieser Sitzung nicht erneut versucht; scheitern alle, bleibt es
  still. Keine Meldungen.

### 6.4 Bedienung

Nur sichtbar, wenn Musik verfügbar ist; im Kino-Abschnitt der Seitenleiste (im
Kompaktmodus im Bedienbogen):

- Umschalter „Aus / Nur Kino / Immer“, Lautstärkeregler.
- Zeile „♪ Titel — Urheber“ zum laufenden Stück aus den Angaben der Liste; fehlt der
  Titel, steht der Dateiname. Mit `link` ist die Zeile ein Link (neuer Tab,
  `rel="noopener"`).
- Taste **M** schaltet `stumm` um, wenn Musik verfügbar ist; die Kürzelübersicht nennt
  sie dann. Deutsch und Englisch für alle neuen Texte.

### 6.5 Prüfung

Einheitstests für die Prüfung der Liste, `sollSpielen`, die Mischfolge und die
Blendkurven, der Spieler mit einem nachgebauten `AudioContext`. Im Browser mit einer
Testliste und kurzen, selbst erzeugten Tondateien (ffmpeg-Sinus, nur im Scratchpad
bzw. git-ignoriert): Gain-Werte als Zeitreihe über `performance.now()` (Blenddauer,
Endwert, Überblendung), fortlaufende `currentTime`, und ohne Liste: keine Bedienung,
keine Anfrage außer der Liste. Die Hörprüfung mit eigenen Stücken macht Jens, auch auf
dem A55.

## 7. Etappe 5-5: Abschluss

- `ASSETS.md` vollständig: neue Texturstufen samt Bearbeitung (Verkleinerung,
  KTX2-Kodierung, Spiegelung), verschobene Quell-JPEGs, Basis-Transcoder (Apache 2.0,
  aus three.js). Musik bringt die Anwendung nicht mit (§6).
- `npm run deploy -- --trocken` zeigt Dateiliste und Gesamtgröße; beides kommt ins
  Protokoll. Ausgeführt wird die Veröffentlichung nicht.
- Gesamtabnahme `docs/phase5-abnahme.md`: Zusammenfassung der Etappen, Handprüfung
  auf dem A55 (Oberfläche, Kompaktmodus, Texturen bei mittlerer Qualitätsstufe, Ton),
  gesammelte Rulings und offene Fragen.
- Stand der lokalen Projektanleitung nachführen, Tag `v0.6.0`.

## 8. Querschnitt

### 8.1 Arbeitsweise

- Je Etappe: Plan in `docs/superpowers/plans/`, Umsetzung per
  subagent-driven-development, immer nur ein Umsetzer gleichzeitig, jeder Task endet
  in einem Commit mit grünen Tests. Abnahme in `docs/phase5-etappe<N>-abnahme.md`
  (§6 Rulings, §7 Unschärfen, §8 Fragen an Jens). Danach Fast-Forward nach `master`;
  gepusht wird nach Jens' Ja.
- **Modelle:** sonnet für Umsetzer mit Logik oder Oberfläche, für Prüfer und
  Abnahmen; haiku nur für rein mechanische Schritte (Datenlisten, `ASSETS.md`-Zeilen);
  opus erst nach zweimaligem Scheitern.
- Vor „fertig“ je Task: `npm run lint`, `npm test`, `npm run build` mit gezeigter
  Ausgabe. Sichtprüfungen in Pixelwerten.

### 8.2 Taskschnitt (Vorschlag, der Plan legt ihn fest)

| Etappe | Tasks |
|---|---|
| 5-1 | Seitenleiste mit Reiter und Breite; Überschriftenstil mit Kontrastmessung; Szenenliste und Suchfunktion; Musikrecherche; Abnahme |
| 5-2 | Kompaktmodus und Bögen; grober Zeiger und Startstufe; Emulationsmessung und Handprüfung; Abnahme |
| 5-3 | Probe und Werkzeugkette; KTX2 und Datenliste mit 1k/2k; Nachladen bis zur Höchststufe; Messung, `ASSETS.md`, Abnahme |
| 5-4 | Liste laden und prüfen, README, Ignore-Eintrag; Store-Feld und Wiedergabe; Bedienung und Taste M; Messung und Abnahme |
| 5-5 | `ASSETS.md`, Trockenlauf, Gesamtabnahme, Tag |

### 8.3 Bündelgröße

Der Hauptchunk steht bei 1 453,78 kB. Übersteigt er 1 503,78 kB (die bestehende
Regel „Frage an Jens ab +50 kB“), entscheidet Jens, ob `KTX2Loader` und die
Musikwiedergabe per dynamischem Import ausgelagert werden. Die Texturen und
Musikdateien selbst zählen nicht zum Bündel. (Stand 24.09.2026: Jens hat den
KTX2Loader im Hauptchunk belassen; nächste Frage ab 1 571,79 kB.)

### 8.4 Fachgeprüfte Texte

Die Hochschultexte nennen Solar System Scope und `ASSETS.md`, aber keine Auflösung
der Albedokarten; die einzige Pixelangabe betrifft die unveränderte Ringtextur.
Phase 5 ändert keinen fachgeprüften Text. Widersprüche gehen an Jens.

## 9. Nicht im Umfang

- Modellbefunde aus den Hochschul-Abnahmen (Erdrotation, Zeitskalen, Schwerpunkte,
  Abplattung, Pole und weitere).
- Die Handprüfung mit dem Xbox-Controller und Wake Lock auf dem Telefon (beide
  brauchen HTTPS, also die Veröffentlichung).
- Herunterstufen von Texturen oder ein Grafikspeicherbudget; höhere Auflösungen für
  Monde, Zwergplaneten, Uranus und Neptun; Normal- und Nachtkarten.
- Kopplung der Musik an Szenen, eigene Klänge je Szene, Tonausgabe außerhalb der
  Musik.
- Die Veröffentlichung auf dem Webspace und Let's Encrypt.

## 10. Risiken

- **Grafikspeicher auf dem A55:** Bei `medium` endet jeder Körper bei 2k, das hält
  den Bedarf klein. Stürzt der Tab trotzdem ab, wird die Startstufe für groben
  Zeiger auf `low` gesenkt (Ruling in 5-2 oder 5-3).
- **Ruckler beim Tausch:** Das Hochladen einer 8k-Textur kann ein Bild kosten.
  Gemessen in 5-3; ein Ausreißer über 100 ms geht als Frage an Jens.
- **Kodierqualität:** ETC1S kann auf feinen Strukturen (Mondkrater) sichtbar
  blocken. Die Probe misst das, bevor alle Stufen kodiert werden.
- **Quellen verschwinden:** Die Pluto-Karte bei Solar System Scope ist schon einmal
  verschwunden. Die Liste mit SHA-256 zeigt eine geänderte Quelle an; die
  versionierten Ergebnisse bleiben davon unberührt.
- **Autoplay:** Browser können auch nach einer Geste stumm bleiben, etwa im
  Stromsparmodus. Dann bleibt es still, die Anwendung läuft weiter.
