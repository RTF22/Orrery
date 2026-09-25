# Orrery

Interaktive 3D-Simulation des Sonnensystems im Browser. Ein Orrery ist ein
mechanisches Modell der Planetenbewegung, benannt nach dem Earl of Orrery, für den
1704 eines der ersten gebaut wurde. Dieses hier ist digital, rechnet mit echten
Bahnelementen und läuft ohne Server.

Zwei Ansprüche gelten gleichrangig: **Lernwerkzeug** (die Zahlen und Bahnen sind
überprüfbar) und **Showpiece** (die Szene sieht gut aus und läuft flüssig, auch als
Dauerlauf auf einem zweiten Bildschirm). Wo beides kollidiert, rechnet die Simulation
immer physikalisch korrekt, und die Darstellung darf überhöhen. Der Grad der
Überhöhung ist eine Einstellung, kein fester Kompromiss.

## Zwei Modi

- **Explorer:** Bedienoberfläche mit Panels für Zeit, Maßstab, Kamera, Anzeige und
  Katalog. Alles ist einstellbar.
- **Kino:** Oberfläche und Mauszeiger ausgeblendet, echtes Vollbild, Wake Lock,
  automatische Kamerafahrten aus einer kuratierten Szenen-Playlist mit
  prozeduraler Variation.

## Stand

Phase 3 der Roadmap ist abgeschlossen. Enthalten sind:

- Sonne, acht Planeten, Erdmond, rund zwanzig weitere Monde, Zwergplaneten mit
  ihren Systemen, Saturn- und Uranusringe.
- Bahnen analytisch nach Kepler, Positionen gegen JPL-Horizons-Fixtures getestet.
- Asteroiden- und Kuipergürtel als Punktwolken mit Kirkwood-Lücken.
- Schattenwurf mit analytischen Okkludern: Mondschatten auf Planeten, Ringschatten,
  Planetenschatten auf Ringen, Blutmond. Eine Mondfinsternis lässt sich über das
  Datumsfeld nachstellen, die nächste wird automatisch gesucht.
- Zeitsteuerung mit Pause, Tempo, Rückwärtslauf und Datumssprung.
- Getrennte Maßstabsregler für Größe und Abstand mit rastenden Presets.
- Kino-Modus mit Szenen-Playlist, Director und Dauerlauf-Nachweis.
- Englische Oberfläche mit Umschaltung zur Laufzeit (Kopfzeile, Taste L).
- Geteilte Links (`#p=…`), automatische Sitzungswiederherstellung (abschaltbar)
  und Zurücksetzen in der Kopfzeile.
- Benannte Ansichten: speichern, laden, umbenennen, löschen mit Rückgängig, als
  JSON exportieren und importieren.
- Infopanel mit Erläuterungstexten in drei Niveaustufen, Kennzahlen und
  Live-Werten, Verweisen in die Simulation und Quellenkarten (NASA, JPL, ESA,
  Wikipedia).

Phase 4a (Englisch, Sprachumschaltung zur Laufzeit) und Phase 4b (URL-Sharing,
Sitzungswiederherstellung und Zurücksetzen in Etappe 1; benannte Ansichten
speichern, laden, exportieren und importieren in Etappe 2) sind abgeschlossen.
Phase 4c Etappe 1 (Infopanel-Gerüst: Niveaustufen, Datenblock mit Live-Werten,
Quellenkarten, Kamerafahrt), Etappe 2 (Grundschulstufe komplett: 35 Körper
und 8 Themen in Deutsch und Englisch), Etappe 3 (Gymnasialstufe komplett:
35 Körper und 8 Themen in Deutsch und Englisch, 62 Quellen, Achsneigung
im Datenblock gegen die eigene Bahn) und Etappe 4 (alle 19 Kinoszenen mit
Texten in Grundschule und Gymnasium, Deutsch und Englisch; Thema „Das
Sonnensystem" mit Erklärung des Namens Orrery beim Start und an der Wurzel
des Objektbaums; Quellenkarten für alle Szenen) sind abgeschlossen. Phase 4c
ist damit komplett (Tag `v0.4.0`). Phase 4d (Hochschulstufe): Etappe 1 bringt
Formeln (TeX-Teilmenge als MathML), Tabellen, Zitate mit Literaturkarten, ein
Prüfskript für den Literaturkatalog (`npm run literatur:pruefen`) und drei
Pilottexte (Bahnelemente, Erde, Mondfinsternis); Etappe 2 die sechs Fachthemen
(Bezugssysteme und Zeitskalen, Gezeiten, Bahnresonanzen, innerer Aufbau,
Albedo und Helligkeit, Entstehung des Sonnensystems); Etappe 3 Sonne, Mond,
Finsternisse, gebundene Rotation und die Szenen „Der Tanz des Mondes" und
„Sonnenaufgang über dem Erdrand"; Etappe 4 Merkur, Venus, Mars, Phobos,
Deimos und die Szenen „Merkur auf der Innenbahn" und „Tiefflug über
Phobos"; Etappe 5 Jupiter, Io, Europa, Ganymed, Kallisto und die Szenen
„Vorbeiflug an Jupiter" und „Das galileische Schattenspiel"; Etappe 6
Saturn, Titan, Enceladus, das Thema „Ringsysteme" und die Szenen „Saturn
im Streiflicht", „Saturns Ringe von der Kante", „Durchflug durch Saturns
Ringe", „Titan im Dunst vor Saturn" und „Enceladus im hellen Glanz"; Etappe
7 Mimas, Tethys, Dione, Rhea, Iapetus und die Szene „Die geneigte Bahn des
Iapetus"; Etappe 8 Uranus, Miranda, Ariel, Umbriel, Titania, Oberon, das Thema
„Achsneigung" und die Szene „Der liegende Uranus"; Etappe 9 Neptun, Triton,
Pluto, Charon und die Szenen „Tritons rückläufige Bahn", „Von Neptun
zur fernen Sonne" und „Pluto und Charon im Doppel"; Etappe 10 Ceres, Eris,
Haumea, Makemake, die Themen „Zwergplaneten" und „Kirkwood-Lücken" und
die Szene „Ceres im Asteroidengürtel"; Etappe 11 die Themen „Grenzen des
Modells" und „Das Sonnensystem" und die Szene „Das System von oben". Damit
hat jeder Körper, jede Szene und jedes Thema einen Hochschultext in Deutsch
und Englisch; Phase 4d ist abgeschlossen (Tag `v0.5.0`).

Phase 5 ist abgeschlossen (Tag `v0.6.0`): einklappbare Seitenleiste mit
Breitengriff, farbige Abschnittsüberschriften und Szenenliste im Kino-Abschnitt;
Kompaktmodus für Telefone mit Bögen und großen Bedienzielen; Texturen als KTX2 in
Stufen bis 8k, die nach Bedarf nachgeladen werden; Musik aus Dateien des
Betreibers (Abschnitt „Eigene Musik“); installierbare Web-App mit Vollbildstart.
Offen ist die Veröffentlichung.

## Entwicklung

Voraussetzung ist Node 24.

```
npm ci
npm run dev        # Entwicklungsserver unter http://localhost:5173/Orrery/
npm test           # Vitest, einmalig
npm run test:watch
npm run lint       # ESLint
npm run build      # tsc -b && vite build, Ergebnis in dist/
```

Im Entwicklungslauf liegen `window.store`, `window.renderer` und `window.scene`
bereit, damit sich Szenen und Uniforms für Sichtprüfungen ohne Klickweg setzen und
ablesen lassen.

## Veröffentlichung

Die Seite ist rein statisch und liegt später unter `https://www.jensfricke.com/Orrery/`,
passend zur Vite-Basis `/Orrery/`. Hochgeladen wird per FTPS auf den Webspace:

```
cp .env.example .env.local   # Zugangsdaten eintragen (git-ignoriert)
npm run deploy:trocken       # Dateiliste und Größe von dist/, dann nur verbinden und auflisten
npm run deploy               # bauen und dist/ hochladen
```

`scripts/deploy.ts` lädt `dist/` vollständig hoch und entfernt danach in `assets/`
nur die gehashten Bündel, die lokal nicht mehr existieren. Das Zielverzeichnis wird
nie geleert. `public/.htaccess` regelt Kompression und Cache-Dauern auf dem Server.
Bis zur Fertigstellung wird nicht veröffentlicht; das Skript läuft ausschließlich
von Hand.

## Eigene Musik

Orrery bringt keine Musik mit. Wer die Seite betreibt, kann eigene Stücke hinterlegen:

1. MP3-Dateien in den Ordner `musik/` der ausgelieferten Seite legen (auf dem Webspace
   neben `index.html`; lokal in `public/musik/`, der Ordner ist git-ignoriert und wird
   von `npm run deploy` mit hochgeladen).
2. Daneben die Liste `musik/stuecke.json` anlegen:

   ```json
   [
     { "datei": "morgen.mp3", "titel": "Morgen", "urheber": "Name", "link": "https://example.org" },
     { "datei": "abend.mp3" }
   ]
   ```

   Pflicht ist nur `datei` (Dateiname ohne Ordner); `titel`, `urheber` und `link`
   erscheinen, wenn vorhanden, in der Zeile zum laufenden Stück.

Ohne Liste oder mit leerer Liste zeigt Orrery keine Musikbedienung und bleibt still.
Mit Liste steht im Kino-Abschnitt „Aus / Nur Kino / Immer", ein Lautstärkeregler und
„Stumm (M)". Die Stücke laufen in gemischter Folge. Lautheit und Format der Dateien
gleicht Orrery nicht an.

**Rechte:** Für die hinterlegten Stücke ist allein der Betreiber der Seite
verantwortlich, einschließlich Lizenz, Namensnennung und Nutzungsrechten.

## Aufbau

Vier Schichten mit streng einseitiger Abhängigkeit, jede kennt nur die unter ihr
liegenden:

| Verzeichnis   | Inhalt |
|---------------|--------|
| `src/ui/`     | React-Komponenten, Panels, Tastenkürzel, Sprachdateien |
| `src/store/`  | Zustand-Store, einzige Wahrheitsquelle, serialisierbar |
| `src/render/` | Three.js-Szene, Körper, Ringe, Gürtel, Schatten, Kamera, Nachbearbeitung |
| `src/sim/`    | Kepler-Bahnen, Bezugssysteme, Zeit, Maßstab, Finsternissuche, Director |
| `src/data/`   | Körperkatalog, Kinoszenen, Sternkatalog |
| `src/app/`    | Einstieg, Render-Schleife, Qualitätsstufen, Kino-Steuerung |

Stack: Three.js (imperativ, bewusst ohne react-three-fiber), TypeScript, Vite,
React, Zustand, Tailwind, Vitest.

## Dokumentation

- `docs/ursprungsprompt.md`: der Auftrag, mit dem das Projekt begann.
- `docs/superpowers/specs/`: Design-Dokumente je Phase, beginnend mit dem
  Gesamtentwurf `2026-09-11-sonnensystem-design.md` (Architektur, Roadmap,
  Nicht-Ziele).
- `docs/superpowers/plans/`: Implementierungspläne je Phase.
- `docs/phase*-abnahme.md`: Abnahmeprotokolle mit Messwerten aus den
  Sichtprüfungen.
- `ASSETS.md`: Herkunft und Lizenz aller Texturen.

## Lizenz

Noch nicht festgelegt. Das Repository ist öffentlich einsehbar; solange keine Lizenz
festgelegt ist, bleiben alle Rechte vorbehalten. Die Texturen unterliegen den in `ASSETS.md` genannten
Lizenzen (überwiegend CC BY 4.0).
