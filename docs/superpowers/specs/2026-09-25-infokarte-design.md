# Info-Karte — Einrichtung als App, Bedienung, Über

Entwurf vom 25.09.2026. Phase 6 ist mit Tag `v0.7.0` abgeschlossen und auf dem Webspace.
Diese kleine Etappe bringt eine Info-Karte als Overlay: Kurzanleitung zur Einrichtung als
App, Bedienung, Verweis auf das Repository und Lizenzinfo. Sie schließt mit Tag `v0.7.1`;
Deploy danach mit eigener Freigabe.

## 1. Ausgangslage

- **Kopfzeile** (`ui/Kopfzeile.tsx`): „Link kopieren“, „Zurücksetzen“, Statusmeldung,
  Sprachschalter. Der Kommentar dort sieht einen Hilfe-Knopf ausdrücklich vor. Im
  Kompaktmodus (`useSchmal`) steht die Kopfzeile im Bogen „Bedienung“ (`ui/Seitenleiste.tsx`).
- **Tastenübersicht:** Taste `?` schaltet `ui.panels.shortcuts`; `App.tsx` zeigt dann
  `Kuerzeluebersicht` (Tastatur, Maus, Controller) in der Seitenleiste, nicht bei grobem Zeiger.
- **Tastenkürzel:** `ui/shortcuts/useShortcuts.ts`, `handleShortcut(taste)` als reine Funktion;
  Escape beendet das Kino.
- **Web-App:** `public/manifest.webmanifest` mit `display: fullscreen`, Symbole, HTTPS auf dem
  Webspace. Kein Service Worker.
- **Flüchtige Zustände** außerhalb von `AppState` gibt es schon: `useBogen` (`ui/bogen.ts`),
  `useMusikStand` (`ui/musikStand.ts`).
- **Ablage:** `ablageHolen()` in `store/persist.ts` liefert `localStorage` oder null; jeder
  Zugriff kann werfen.
- **Lizenzlage** (README, `ASSETS.md`): Code „alle Rechte vorbehalten“; Texturen überwiegend
  CC BY 4.0, Sternkatalog HYG CC BY-SA 4.0, Himmelskarte NASA/GSFC SVS mit Gaia-Anteil
  CC BY-NC 3.0 IGO.
- `package.json` trägt `"version": "0.0.0"`.

## 2. Entscheidungen (Jens, 25.09.2026)

- Die Karte öffnet sich beim allerersten Besuch einmal von selbst, danach nur über ⓘ.
- Keine Links auf Impressum oder Datenschutz.
- Kleine Etappe, Tag `v0.7.1`.
- Weiterführende Links immer in neuem Tab; kein Scrollen in der Karte.
- Bedienung zeigt nur den Block, der zum Eingabegerät passt.

## 3. Aufbau und Verhalten

- **Öffnen:** Knopf ⓘ in der Kopfzeile (zugänglicher Name „Info und Hilfe“ / „Info and
  help“), im Kompaktmodus im Bogen „Bedienung“. Keine neue Taste.
- **Automatisch:** beim Start genau dann, wenn (a) die Ablage kein Merkmal
  `orrery.infokarte.gesehen.v1` trägt, (b) die Adresse kein Fragment `#p=` trug und (c) das
  Kino nach dem Startzustand nicht läuft. Das Merkmal wird beim Schließen gesetzt (nicht beim
  Öffnen), damit ein sofortiges Neuladen die Karte nicht verschluckt. Wirft die Ablage oder
  fehlt sie, öffnet die Karte bei jedem Start (kein Absturz).
- **Zustand:** eigener kleiner Store `useInfoKarte` (`offen`, `reiter`), nicht in `AppState`,
  also nicht in Link, Sitzung, Ansicht; „Zurücksetzen“ berührt ihn nicht.
- **Form:** Dialog (`role="dialog"`, `aria-modal="true"`, beschriftet durch den Titel) mittig
  über abgedunkeltem Hintergrund. Kopf mit „Orrery“ und ✕, darunter drei Reiter
  (`role="tablist"`): „App“, „Bedienung“, „Über“. Startreiter: „App“, wenn der Zeiger grob ist
  und Orrery nicht als App läuft; sonst „Bedienung“. Der Fokus geht beim Öffnen auf den
  aktiven Reiter und kehrt beim Schließen zum auslösenden Element zurück; Tab bleibt in der
  Karte.
- **Schließen:** ✕, Escape, Klick oder Tippen auf den Hintergrund.
- **Tastenkürzel:** Solange die Karte offen ist, liefert `handleShortcut` für jede Taste
  `false` (Escape schließt dann die Karte, nicht das Kino).
- **Sichtbarkeit:** Die Karte wird unabhängig von `ui.hidden` und der Ruhe-Ausblendung im
  Kino gezeichnet (sonst verschwände eine offene Karte mit der Oberfläche).
- **Links:** Alle externen Links mit `target="_blank" rel="noopener noreferrer"` und einem
  angehängten „↗“ (für Screenreader als „öffnet in neuem Tab“ / „opens in a new tab“).
- **Kein Scrollen:** Jeder Reiter passt ohne Scrollen in die Karte: A55 hoch (412×915 CSS-px),
  A55 quer (915×412), Desktop 1280×720 und 2560×1440, Deutsch und Englisch. Die Karte hat
  `overflow: hidden`; die Messung verlangt `scrollHeight ≤ clientHeight` für den
  Inhaltsbereich. Reicht die Höhe im Querformat nicht, stehen die Reiter dort links neben dem
  Inhalt (Medienabfrage auf geringe Höhe).

## 4. Inhalte

Deutsch und Englisch, knapp. Texte in `ui/i18n/de.ts` und `en.ts` unter `infokarte.*`.

### 4.1 Reiter „App“

- Läuft Orrery als App (`display-mode: fullscreen` oder `standalone`, bzw.
  `navigator.standalone` auf iOS): nur „Orrery läuft als App.“
- Sonst drei Zeilen:
  - Android (Chrome): Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“;
    Start dann im Vollbild vom Symbol.
  - iPhone/iPad (Safari): Teilen □↑ → „Zum Home-Bildschirm“.
  - Desktop (Chrome, Edge): Installationssymbol in der Adressleiste.
- Hat der Browser `beforeinstallprompt` gemeldet, zusätzlich ein Knopf „Jetzt installieren“,
  der den Dialog des Browsers öffnet; nach der Antwort verschwindet er. Das Ereignis wird früh
  in `app/main.tsx` abgefangen (`ui/infokarte/installation.ts`), sonst ist es vor dem ersten
  Rendern vorbei.

### 4.2 Reiter „Bedienung“

- Grober Zeiger (Touch): ein Finger ziehen dreht, zwei Finger zoomen, Tippen auf einen Körper
  fliegt hin; die Reiter „Bedienung“ und „Info“ am Rand öffnen die Bögen.
- Feiner Zeiger: Ziehen dreht, Rad zoomt, Klick auf einen Körper fliegt hin; Tasten
  Leertaste (Zeit an/aus), ←/→ (Tempo), C (Kino), I (Infopanel), H (Oberfläche), F (Vollbild),
  L (Sprache). Darunter ein Knopf „Alle Tastenkürzel und Controller“, der die Karte schließt
  und `ui.panels.shortcuts` öffnet.

### 4.3 Reiter „Über“

- Ein Satz zum Projekt: Orrery zeigt das Sonnensystem physikalisch gerechnet, Körper, Monde
  und Himmel in echter Lage, mit Texten in drei Niveaustufen.
- Link „Quellcode auf GitHub ↗“ → `https://github.com/RTF22/Orrery`.
- „© Jens Fricke. Code: alle Rechte vorbehalten.“
- „Texturen, Sternkatalog und Himmelskarte: Rechte der jeweiligen Urheber (u. a. NASA/JPL,
  NASA/GSFC SVS, ESA/Gaia/DPAC unter CC BY-NC 3.0 IGO) — Übersicht in ASSETS.md ↗“ →
  `https://github.com/RTF22/Orrery/blob/master/ASSETS.md`.
- „Nichtkommerzielles Projekt.“
- Version mit der Versionsnummer aus `package.json`, etwa „Version 0.7.1“ (über `define` in
  `vite.config.ts` als `__ORRERY_VERSION__`); `package.json` bekommt mit den Inhalten
  `"version": "0.7.1"`.

## 5. Prüfung

### 5.1 Tests (jsdom)

- Öffnen über ⓘ, Schließen über ✕, Escape, Hintergrund; Fokus beim Öffnen und Rückgabe.
- Reiterwechsel per Klick und Pfeiltasten; Startreiter je Zeiger und App-Modus.
- Jeder externe Link hat `target="_blank"` und `rel="noopener noreferrer"`.
- Automatisches Öffnen: erster Besuch ja; mit Merkmal nein; mit `#p=` nein; bei laufendem
  Kino nein; werfende Ablage: öffnet, kein Fehler. Merkmal wird beim Schließen gesetzt.
- `handleShortcut` liefert bei offener Karte `false`.
- Installationsknopf nur mit abgefangenem Ereignis; Klick ruft `prompt()` und blendet ihn aus.
- Alle `infokarte.*`-Schlüssel in beiden Sprachen (vorhandener i18n-Test).

### 5.2 Messung im Browser

Playwright, je Viewport und Sprache jeder Reiter: `scrollHeight ≤ clientHeight` des
Inhaltsbereichs, Karte vollständig im Viewport (Rechteck innerhalb), Screenshot je Fall.
Links öffnen einen neuen Tab (Anzahl der Seiten steigt, die Simulation bleibt).

### 5.3 Handprüfung (Jens)

A55: Karte beim ersten Aufruf (privates Fenster oder gelöschte Websitedaten), Installation
über Knopf bzw. Menü, Start vom Symbol mit „läuft als App“, Links öffnen neuen Tab. Desktop:
ⓘ, Reiter, Escape.

## 6. Aufteilung

| Task | Inhalt |
|---|---|
| 1 | Gerüst: `useInfoKarte`, Dialog mit Reitern (leere Inhalte), Knopf ⓘ, Schließen, Fokus, automatisches Öffnen, Kürzelsperre, Zeichnen unabhängig von `ui.hidden` |
| 2 | Inhalte: drei Reiter in beiden Sprachen, Installationsknopf, App-Erkennung, Version (`package.json` 0.7.1) |
| 3 | Messung „kein Scrollen“ und Abnahmeprotokoll `docs/infokarte-abnahme.md` |
| 4 | Nach Jens' Handprüfung: Nachtrag, README, Tag `v0.7.1`, Push, Deploy |

## 7. Nachtrag: Karte „Steuerung“ und Hilfe-Knopf am Handy (Jens, 25.09.2026)

Aus der Handprüfung: Die Tastenübersicht als Panel am Ende der Seitenleiste stört. Sie wird
eine eigene Karte wie die Info-Karte; am Handy hilft ein kleiner „?“-Knopf.

- **Gemeinsamer Rahmen:** Der Dialog der Info-Karte (Rahmen, Reiter, Fokus, Fokusfalle,
  Schließen über ✕, Escape, Hintergrund) wird zum Baustein `ui/karte/Kartendialog.tsx`;
  Info-Karte und Steuerungskarte nutzen ihn. Verhalten und Prüfkennungen
  (`data-testid="infokarte-…"`) der Info-Karte bleiben gleich.
- **Karte „Steuerung“** (Titel „Steuerung“ / „Controls“) mit den Reitern „Tastatur“ und
  „Controller“, Startreiter „Tastatur“. Eigener flüchtiger Zustand `useSteuerKarte`.
  - „Tastatur“: die bisherige Liste (Taste und Wirkung), M nur mit Musik des Betreibers.
  - „Controller“: selbst gezeichnete, schematische Controllergrafik (SVG, kein fremdes
    Bildmaterial, kein Herstellerlogo) in der Standardbelegung, A/B/X/Y in den üblichen Farben,
    Beschriftungen links und rechts mit Linien zu den Knöpfen: LT, LB (halten: um den Körper
    drehen, RT/LT näher und weiter), Ansicht-Taste, linker Stick (umschauen, startet den Flug),
    Steuerkreuz (↑ Zeit, ← → Tempo, ↓ Laufrichtung); RT, RB, Menü-Taste, Y, B, A, rechter Stick
    (Fadenkreuz, drücken: zur Mitte). X, linker Stick drücken und Mitteltaste bleiben ohne
    Beschriftung. Für Screenreader steht dieselbe Belegung als unsichtbare Liste daneben, die
    Grafik ist `aria-hidden`.
- **Öffnen:** Taste `?` und der Knopf „Alle Tastenkürzel und Controller“ der Info-Karte (schließt
  die Info-Karte). Immer höchstens eine Karte offen; bei offener Karte sind die Tastenkürzel
  gesperrt und die UI-Ebene ist `inert`.
- **Entfällt:** das Panel „Tastenkürzel“ in der Seitenleiste samt `ui.panels.shortcuts` und der
  Scroll-/Fokus-Behelf dafür. Gespeicherte Sitzungen mit diesem Eintrag bleiben harmlos.
- **Hilfe-Knopf am Handy:** Im Kompaktmodus ein runder Knopf „?“ oben rechts (44 × 44 px,
  zugänglicher Name „Info und Hilfe“), öffnet die Info-Karte mit dem Startreiter nach §3. Am
  Desktop bleibt ⓘ in der Kopfzeile.
- **Prüfung:** Tests für beide Öffnungswege, Reiter, Exklusivität, Kürzelsperre, Hilfe-Knopf nur
  im Kompaktmodus. Messung: Steuerungskarte ohne Scrollen bei 1280×720 und 2560×1440, Deutsch und
  Englisch, beide Reiter, mit und ohne Musik; im Reiter „Controller“ liegen alle Beschriftungen
  innerhalb der Grafik und überlappen einander nicht. Hilfe-Knopf auf A55 hoch und quer im Bild,
  ohne Überschneidung mit den Bogenreitern und bei offenem Bogen.

| Task | Inhalt |
|---|---|
| 2b | `Kartendialog`, Karte „Steuerung“ mit Reiter „Tastatur“, Öffnen über `?` und Info-Karte, Panel entfällt, Hilfe-Knopf am Handy |
| 2c | Reiter „Controller“ mit SVG-Grafik und Beschriftungen |
| 3b | Messung der neuen Teile, Protokoll-Nachtrag |
