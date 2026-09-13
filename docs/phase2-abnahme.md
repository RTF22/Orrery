# Phase 2 — Abnahmeprotokoll

**Datum:** 12.09.2026
**Stand:** Zweig `phase-2-kinomodus`
**Prüfumgebung:** Windows 11, Chromium (Playwright, headless), Vite-Entwicklungsserver,
Fenster 1280 × 800, `devicePixelRatio` 1.
Eine Prüfung auf dem Referenz-Laptop unter normalem Desktop-Chrome steht weiterhin aus.

## Automatischer Testlauf

```
npm run lint     → ohne Befund
npx tsc --noEmit → ohne Befund
npm test         → 240 Tests in 39 Dateien, alle grün
npm run build    → erfolgreich
```

## Akzeptanzkriterien

| Kriterium aus dem Entwurf | Nachweis | Ergebnis |
|---|---|---|
| Mindestens 6 Szenen; der Director spielt endlos ohne sichtbaren Bruch | `scenes.test.ts` prüft die Mindestzahl (Katalog hat sieben); 30 Minuten Dauerlauf ohne Eingriff, Szenenwechsel per Sichtprüfung weich | erfüllt |
| Prozedurale Variation reproduzierbar bei gesetztem Zufallskeim | `director.test.ts` (gleicher Keim → identische Pfade, verschiedene Keime → verschiedene), `director.longrun.test.ts` (noch bei Szene 990–999 identisch) | erfüllt |
| UI und Mauszeiger blenden aus, Wake Lock aktiv, echtes Vollbild | siehe Abschnitt „Dauerlauf-Tauglichkeit" | erfüllt, mit einer Einschränkung beim Wake Lock |
| 30 Minuten Dauerlauf ohne messbares Speicherwachstum | Messreihe unten | erfüllt |

## Dauerlaufmessung

31 Messpunkte im Minutenabstand, Kino-Modus durchgehend aktiv, Standardkeim
20260912 mit Mischen.

| Größe | Start | Minute 15 | Minute 30 |
|---|---:|---:|---:|
| JS-Heap | 54,4 MB | 32,4 MB | 35,0 MB |
| Geometrien | 20 | 21 | 21 |
| Texturen | 24 | 25 | 25 |
| Shader-Programme | 16 | 16 | 16 |

Der Heap fällt nach dem Laden auf rund 32 MB und pendelt danach über die
gesamte Laufzeit zwischen 31,5 und 37,9 MB — das ist der Sägezahn der
Speicherbereinigung, kein Trend. Der letzte Wert liegt unter dem ersten.

Geometrie- und Texturzahl steigen ein einziges Mal, zwischen Minute 0 und 2,
um jeweils eins: eine nachgeladene Albedo-Textur. Ab Minute 2 bleiben beide
bis Minute 30 unverändert. Szenenwechsel legen also keine Objekte an — so
gebaut: Die Szenenfolge ist eine reine Funktion der Szenennummer
(`sim/director.ts`), es gibt keine Playlist, die mitwächst.

### Bildrate

20 Sekunden Aufzeichnung über `requestAnimationFrame` bei laufendem Kino-Modus:

| Größe | Wert |
|---|---:|
| Frames | 1 200 |
| Median-Framezeit | 16,70 ms |
| 95. Perzentil | 16,80 ms |
| Maximum | 17,20 ms |

Durchgehend an der Bildsynchronisation, keine Einbrüche — auch nicht über
Szenenwechsel hinweg. Der Kino-Modus kostet damit gegenüber der freien
Navigation aus Phase 1 (Median ebenfalls 16,70 ms) nichts.

**Hinweis zur Messung:** `renderer.info.render.frame` ist als Bildzähler
unbrauchbar. Der Wert stieg um rund 1 020 je Sekunde, weil der Bloom-Composer
je Bild etwa 17 `render()`-Aufrufe absetzt (RenderPass, fünf Mip-Ebenen mit je
zwei Unschärfe-Durchgängen, Composite, Kombination, OutputPass). Gemessen wird
deshalb über `requestAnimationFrame`.

## Dauerlauf-Tauglichkeit

- **Oberfläche und Mauszeiger:** Nach drei Sekunden Ruhe trägt das
  Wurzelelement die Klasse `zeiger-aus`, und die Panels sind nicht mehr im DOM.
  Beides über die vollen 30 Minuten bestätigt, Screenshot zeigt die reine Szene.
- **Echtes Vollbild:** `document.fullscreenElement` war nach dem Start des
  Kino-Modus durchgehend das `HTML`-Element — die Vollbildanforderung im
  Klickpfad greift also.
- **Wake Lock:** `navigator.wakeLock` ist im Prüfbrowser vorhanden, die Sperre
  wird beim Start angefordert und nach einem Tabwechsel erneut. Ob das System
  sie tatsächlich hält, lässt sich headless nicht abfragen; abgesichert ist das
  Verhalten über `wakeLock.test.ts` (genau eine Sperre, saubere Freigabe,
  kein Fehler ohne API-Unterstützung). **Offen:** Prüfung am Gerät, dass der
  Bildschirmschoner ausbleibt.
- **Eingabe hält an, Ruhe nimmt wieder auf:** Klick in die Szene hält den Film
  an, die Bedienelemente des Kino-Panels und die Tasten `C`/`N` gelten nicht
  als Störung (verifiziert), nach 30 Sekunden Ruhe läuft er weiter.

## Nachtrag: Beleuchtung (12.09.2026)

Der 30-Minuten-Dauerlauf hat einen Befund geliefert, den die Messreihe nicht
erfasst: Planeten erschienen wiederholt **vollständig schwarz**. Ursache waren
drei Punkte, die sich überlagert haben.

1. **Kein Fülllicht.** Die Szene hatte genau eine Lichtquelle, das Punktlicht
   an der Sonne. Die abgewandte Hälfte jedes Körpers bekam damit exakt null —
   kein dunkles Grau, sondern Schwarz. Die Kino-Szenen setzen den Azimut
   unabhängig von der Sonnenrichtung, `ferne-sonne` blickt sogar bewusst von
   Neptun in die Sonne: Ein erheblicher Teil der Einstellungen zeigte genau
   diese unbeleuchtete Hälfte.
2. **Abstandsabfall über vier Größenordnungen.** Bezogen auf die Erde erhielt
   Saturn 6,6 %, Uranus 2,9 %, Neptun 1,7 % der Bestrahlungsstärke — beim
   Preset „Realistisch" Neptun 0,11 %. Auch die Tagseite der äußeren Planeten
   war damit praktisch schwarz.
3. **Doppelte Einfärbung.** Die geladene Albedo-Textur wurde mit der
   Ausweichfarbe des Körpers multipliziert. Bei der Erde (`#2a6fdb`, linear
   0,02 | 0,16 | 0,71) fiel der Rotkanal der Textur auf zwei Prozent.

**Behebung** (`src/render/lighting.ts`, neu): Die Beleuchtung wird pro Körper
aus seinem dargestellten Sonnenabstand berechnet. Ein Distanzausgleich staucht
den Abstandsabfall (`E^(1-c)`, Regler „Distanzausgleich", Standard 0,85), und
ein Fülllicht hebt die Nachtseite auf einen festen Bruchteil der eigenen
Tagseite (Regler „Nachtseite", Standard 0,25). Beides ist bewusst nicht
physikalisch und über die Regler bis auf den physikalischen Fall (0 / 0)
zurückdrehbar. Die Ausweichfarbe weicht Weiß, sobald die Textur steht.

Gemessene Bildpixel (Helligkeitsmaximum der Kanäle, Median über die
Planetenscheibe):

| Einstellung | vorher | nachher |
|---|---:|---:|
| Erde, Nachtseite, Preset Schaubild | 4 | 16 |
| Neptun, Nachtseite, Preset Realistisch | 2 | 17 |

Merkur auf der Tagseite bleibt unverändert durchgezeichnet, der Terminator der
Erde bleibt als helle Sichel deutlich erkennbar. Abgesichert ist das über
`render/lighting.test.ts`: Tagseite jedes Planeten über 30 %, Nachtseite über
5 % der eingestellten Helligkeit — bei jedem der drei Maßstabs-Presets.

## Offene Punkte

- ~~Wake Lock und Vollbild am Gerät im normalen Browser prüfen.~~ Erledigt
  am 13.09.2026, siehe `phase3a-abnahme.md`, Nachtrag „Geräteprüfung".
- ~~Bildrate auf dem Referenz-Laptop messen.~~ Gemessen am 13.09.2026 auf
  einem Desktop (RTX 4060), siehe ebenda; ein Laptop mit integrierter Grafik
  bleibt dort als offener Punkt.
- Die drei Entwurfsszenen mit Galileischen Monden, Marsmonden und Pluto
  brauchen den Katalog aus Phase 3; der Katalog dieses Plans nutzt
  gleichwertige Ersatzszenen (siehe Plan, Abschnitt „Abweichungen vom Entwurf").
