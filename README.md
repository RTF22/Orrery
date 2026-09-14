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

Phase 4a (Englisch, Sprachumschaltung zur Laufzeit) und Phase 4b Etappe 1
(URL-Sharing, Sitzungswiederherstellung, Zurücksetzen) sind abgeschlossen. Offen
sind Phase 4b Etappe 2 (Ansichten speichern, laden, exportieren, importieren),
4c (Infopanel) und Phase 5 (Ambient-Sound, Qualitätsstufen, Texturkompression,
Veröffentlichung).

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

Noch nicht festgelegt. Bis zur Veröffentlichung bleibt das Repository privat, alle
Rechte vorbehalten. Die Texturen unterliegen den in `ASSETS.md` genannten
Lizenzen (überwiegend CC BY 4.0).
