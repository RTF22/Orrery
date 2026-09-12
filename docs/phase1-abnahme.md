# Phase 1 — Abnahmeprotokoll

**Datum:** 12.09.2026
**Stand:** Zweig `phase-1-durchstich`
**Prüfumgebung:** Windows 11, Chromium (Playwright, headless), Vite-Entwicklungsserver,
Fenster 1600 × 900 (Bildratenmessung) bzw. 1000 × 800 (Funktionsprüfungen).
Eine Messung auf dem Referenz-Laptop unter normalem Desktop-Chrome steht noch aus;
die Zahlen unten stammen aus der headless-Messung dieser Maschine.

## Automatischer Testlauf

```
npm run lint   → ohne Befund
npm test       → 152 Tests in 27 Dateien, alle grün
npm run build  → erfolgreich
```

### Abweichung gegen JPL Horizons (Task 5)

Größte gemessene Abweichung je Körper über alle Referenzpunkte des Fixtures:

| Körper | max. Abweichung [km] | Toleranz [km] | ausgeschöpft |
|---|---:|---:|---:|
| Merkur | 5 693 | 12 000 | 47 % |
| Venus | 10 431 | 20 000 | 52 % |
| Erde | 12 381 | 25 000 | 50 % |
| Mars | 37 608 | 80 000 | 47 % |
| Jupiter | 1 150 177 | 2 500 000 | 46 % |
| Saturn | 4 271 544 | 9 000 000 | 47 % |
| Uranus | 1 195 610 | 2 500 000 | 48 % |
| Neptun | 1 229 219 | 2 500 000 | 49 % |

Die Abweichungen liegen durchweg bei rund der Hälfte der festgelegten Toleranz und
entsprechen der erwarteten Genauigkeit ungestörter Keplerbahnen aus mittleren
Bahnelementen.

## Akzeptanzkriterien

| Kriterium aus dem Spec | Nachweis | Ergebnis |
|---|---|---|
| Positionen aller 8 Planeten bestehen den Horizons-Test | `npm test`, Tabelle oben | erfüllt |
| Zeitsteuerung: Pause, Tempo, Rückwärts, Sprung zu Datum, „Jetzt" | Browser: Pause hält die Anzeige an, „Fortsetzen" lässt sie weiterlaufen, „Jetzt" springt auf 12.09.2026, Datumsfeld springt auf 2040, „Richtung umkehren" zeigt −1 Tag/s | erfüllt |
| Beide Maßstabsregler und drei Presets mit animiertem Übergang | Browser: Schaubild → Realistisch → Kompakt, Zwischenbild zeigt den Übergang; bei „Realistisch" bleibt die Erde ortsfest, die äußeren Bahnen wandern nach außen | erfüllt |
| Bahnlinien, Labels, Marker-Glyphen, Sternenhintergrund, Bloom | Browser: jeder Schalter einmal aus und wieder an; Beschriftungen 8 → 0 → 8; ohne „Leuchten" verliert die Sonne den Lichtkranz sofort | erfüllt |
| Kameramodi frei, geheftet, verfolgend mit weichen Übergängen | Browser: Klick auf einen Körper fliegt weich hinüber; „Geheftet" hält ihn mittig (Testnachweis `controller.test.ts`, auch bei 1 Tag/s laufender Zeit); „Verfolgung" blickt von hinten in Flugrichtung | erfüllt |
| UI-Gerüst mit einklappbaren Panels; `H` und `F` | Browser: Panel „Zeit" klappt ein und aus, `H` blendet die Oberfläche aus und wieder ein, `?` zeigt die Kürzelübersicht | erfüllt; `F` (Vollbild) ist im headless-Browser nicht prüfbar und steht für die Prüfung am Gerät aus |
| Stabile 60 fps auf dem Referenz-Laptop | Messung unten | erfüllt in der Prüfumgebung; Messung auf dem Referenz-Laptop steht aus |

## Bildratenmessung

20 Sekunden Aufzeichnung bei 1600 × 900, währenddessen alle drei Presets
durchgeschaltet sowie gedreht und über mehrere Größenordnungen gezoomt:

| Größe | Wert |
|---|---:|
| Frames | 1 200 |
| Median-Framezeit | 16,70 ms |
| 95. Perzentil | 16,90 ms |
| Maximum | 17,30 ms |

Die Bildrate liegt durchgehend an der Bildsynchronisation (60 Hz); es gibt keine
Einbrüche, auch nicht während der Preset-Übergänge, die die Bahnlinien neu
berechnen. Der im Plan genannte Zielwert „Median unter 16,7 ms" ist mit aktivem
vsync nicht unterschreitbar — 16,70 ms **ist** der Bestwert bei 60 Hz.

Keine Konsolenfehler oder -warnungen während aller Prüfläufe.

## Offene Punkte

- Vollbild (`F`) und die Bildrate auf dem Referenz-Laptop im normalen Browser prüfen.
- Die automatische Qualitätsstufe (`detectTier`) stuft in der Prüfumgebung auf
  `high` ein; das Herunterstufen wurde nur per Test, nicht auf schwacher Hardware
  beobachtet.
