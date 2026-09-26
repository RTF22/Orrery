# Entwicklung und Betrieb

Technische Hinweise zu Orrery: lokale Entwicklung, Veröffentlichung auf dem Webspace,
eigene Musik und Aufbau des Codes. Die Projektbeschreibung steht in der
[README](../README.de.md).

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

Nach dem Vite-Bau führt `npm run build` zusätzlich `scripts/doku-bauen.ts` aus: Das
Skript wandelt die Making-of-Texte (Überblick und Chronik, je Deutsch und Englisch)
in statische Seiten unter `dist/doku/making-of/` um, mit Sprachwahl nach
Browsersprache (Standard Englisch), und prüft anschließend alle Verweise der
gebauten Seiten; dabei schreibt es auch `dist/sitemap.xml`. `public/robots.txt` und
`public/favicon.ico` liegen fest im Projekt und laufen als statische Dateien mit, weil
orrery3d.de für fehlende Dateien 500 statt 404 liefert. Der nächste `npm run deploy`
lädt sie mit dem übrigen `dist/` hoch.

## Veröffentlichung

Die Seite ist rein statisch und liegt unter `https://orrery3d.de` und
`https://www.jensfricke.com/Orrery/`. Der Build nutzt relative Pfade (Vite-Basis `./`),
damit dieselben Dateien an beiden Adressen laufen; der Entwicklungsserver bleibt unter
`/Orrery/`. Hochgeladen wird per FTPS auf den Webspace:

```
cp .env.example .env.local   # Zugangsdaten eintragen (git-ignoriert)
npm run deploy:trocken       # Dateiliste und Größe von dist/, dann nur verbinden und auflisten
npm run deploy               # bauen und dist/ hochladen
```

`scripts/deploy.ts` lädt `dist/` vollständig hoch und entfernt danach in `assets/`
nur die gehashten Bündel, die lokal nicht mehr existieren. Das Zielverzeichnis wird
nie geleert. `public/.htaccess` regelt Kompression und Cache-Dauern auf dem Server.
Das Skript läuft ausschließlich von Hand.

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

