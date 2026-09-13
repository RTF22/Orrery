# Design-Dokument: Phase 3a — Katalog-Ausbau und Ringe

- **Datum:** 2026-09-12
- **Status:** Entwurf zur Freigabe
- **Grundlage:** `docs/superpowers/specs/2026-09-11-sonnensystem-design.md`, Abschnitt 16
  (Roadmap, Phase 3), und das darauf folgende Brainstorming-Interview
- **Vorgänger:** Phase 1 (Durchstich) und Phase 2 (Kino-Modus), beide abgenommen

---

## 1. Zuschnitt

Phase 3 des Hauptentwurfs enthält fünf weitgehend unabhängige Blöcke. Sie werden in
zwei Durchläufe geteilt:

| Durchlauf | Inhalt | Begründung |
|---|---|---|
| **3a (dieses Dokument)** | Monde, Zwergplaneten, Ringe, neue Kinoszenen | Hängt zusammen: Ringe und Monde gehören zu denselben Planeten, beide brauchen die Äquatorebene ihres Mutterkörpers, und die neuen Szenen zeigen beides. |
| **3b (eigener Durchlauf)** | Asteroiden- und Kuipergürtel, Schattenwurf inklusive Ringschatten | Teilt technisch nichts mit 3a: Massen-Instanzierung und Shadow-Maps sind je eigene Renderfragen. |

Jeder Teil bleibt damit in der Größenordnung von Phase 2 und endet mit einem
vorführbaren Ergebnis.

---

## 2. Entscheidungen aus dem Interview

| Thema | Entscheidung | Begründung |
|---|---|---|
| Zuschnitt | Aufteilen in 3a (Körper) und 3b (Umgebung) | Siehe Abschnitt 1. |
| Katalogumfang | 20 Monde + 5 Zwergplaneten, Texturen wo verfügbar | Entwurfsumfang. Wo es keine brauchbare freie Karte gibt, trägt die Ausweichfarbe — seit dem Beleuchtungsumbau ein vollwertiger Weg, kein Notbehelf. |
| Bezugsebene | Planetenpol als Datum, `parentEquator` daraus abgeleitet | Mondbahnebene, Ringebene und Achsneigung stammen aus **einer** Zahl statt aus drei unabhängig gepflegten. |
| Genauigkeit | Geometrie streng, Phase locker | Bahnradius, Neigung und Umlaufzeit sieht man im Bild; eine Phasenabweichung von wenigen Grad nicht. Störungsreihen je Mondsystem wären echter Simulationscode mit eigener Pflegelast. |
| Ringe | Beleuchtet, beidseitig, mit Vorwärtsstreuung | Das Durchleuchten im Gegenlicht ist der Effekt, der Ringe eindrucksvoll macht; er kostet einen kleinen eigenen Shader. |
| Übersicht | Mondgruppen einklappbar, Mondlabels ab Größenschwelle | Hält die Systemschau automatisch aufgeräumt, ohne einen weiteren Regler. |
| Szenen | Ausbau auf rund 18 | Der Director bleibt unangetastet — Szenen sind reine Daten. |
| Prüftiefe | Invarianten über alle Szenen, Rechennachweis für Stichproben | Ausdrückliche Wahl des Auftraggebers. |

---

## 3. Katalog

### 3.1 Umfang

25 neue Körper, zusätzlich zu den zehn vorhandenen:

| System | Körper |
|---|---|
| Mars | Phobos, Deimos |
| Jupiter | Io, Europa, Ganymed, Kallisto |
| Saturn | Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Iapetus |
| Uranus | Miranda, Ariel, Umbriel, Titania, Oberon |
| Neptun | Triton |
| Pluto | Charon |
| Zwergplaneten | Pluto, Ceres, Eris, Haumea, Makemake |

Pluto zählt als Zwergplanet (`kind: 'dwarf'`, `parent: 'sun'`), Charon als sein Mond.
Damit stehen 35 Körper im Katalog — der im Hauptentwurf genannte kuratierte Kern.

### 3.2 Dateiorganisation

Bisher gilt: eine Datei je Körper. Für die neuen Körper gilt: **eine Datei je System**
(`data/bodies/jupiter-monde.ts`, `saturn-monde.ts`, `uranus-monde.ts`,
`mars-monde.ts`, `neptun-monde.ts`, `pluto-system.ts`, `zwergplaneten.ts`).
`pluto-system.ts` trägt Pluto **und** Charon, weil beide dieselbe Bezugsebene und
denselben Quellenkommentar teilen; `zwergplaneten.ts` die übrigen vier.

Grund: Die Quelle ist pro System *eine* Tabelle, und die Bezugsebene ist eine
Eigenschaft des Systems, nicht des einzelnen Mondes. Der Quellenkommentar steht damit
einmal statt siebenmal, und `data/index.ts` bekommt sieben statt fünfundzwanzig
Importe. Die zehn bestehenden Dateien bleiben unverändert.

### 3.3 Quellen

- **Bahnelemente der Monde:** JPL Solar System Dynamics, „Planetary Satellite Mean
  Elements" — mittlere Elemente in der Laplace-Ebene des jeweiligen Systems, samt der
  Pollage dieser Ebene. Genau das Format, für das `frame: 'parentEquator'` vorgesehen
  ist.
- **Bahnelemente der Zwergplaneten:** JPL Small-Body Database, heliozentrische
  Elemente zur Epoche J2000 (`frame: 'ecliptic'`, wie die Planeten).
- **Physikalische Daten und Pollagen:** IAU Working Group on Cartographic Coordinates
  and Rotational Elements, jüngster Bericht.
- **Texturen:** Zwergplaneten und Ringe von Solar System Scope (CC BY 4.0, bereits
  belegte Quelle); große Monde aus USGS-Astrogeology-/NASA-Karten (gemeinfrei).

Jeder Datensatz trägt seinen Quellenkommentar mitsamt nachvollziehbarer
Kontrollrechnung — so, wie `data/bodies/moon.ts` es vorgibt. Jede neue Texturdatei
bekommt ihre Zeile in `ASSETS.md`, einschließlich Lizenz und Bearbeitungsvermerk.

---

## 4. Bezugsebenen

### 4.1 Der Pol als Datum

`PhysicalData` bekommt ein neues Feld:

```ts
pole: { raDeg: number; decDeg: number }   // Nordpolrichtung, ICRF/äquatorial J2000
```

Daraus folgen drei Dinge, die heute unverbunden nebeneinanderstehen:

1. Die Drehung von der Äquatorebene des Mutterkörpers in die Ekliptik
   (`frame: 'parentEquator'`).
2. Die Ringebene (Abschnitt 5).
3. Die Achsneigung der gerenderten Kugel.

`axialTiltDeg` wird damit **abgeleitet statt gepflegt**: Es ist der Winkel zwischen
Pol und Ekliptiknormale. Der heutige Renderweg in `render/bodies.ts` kippt die Kugel
nur um den Betrag der Neigung, ohne deren Richtung zu kennen — solange nichts anderes
in derselben Ebene liegt, fällt das nicht auf. Sobald Ringe und Mondbahnen
dazukommen, stünde das ganze System sonst willkürlich verdreht.

### 4.2 Die Sperre in `sim/orbit.ts`

`positionAt` wirft heute bei `frame: 'parentEquator'` (Zeile 77) — eine bewusst
gesetzte Sperre aus Phase 1. Sie wird durch die echte Drehung ersetzt: von der
Äquatorebene des Mutterkörpers (Pol aus 4.1) über das äquatoriale System J2000 in die
Ekliptik J2000 (Schiefe der Ekliptik ε = 23,4392911°).

Die Sperre selbst entfällt nicht ersatzlos: Ein Körper mit `parentEquator`, dessen
Mutterkörper keinen Pol trägt, muss weiterhin scheitern statt still falsch zu
rechnen. Der bestehende Test in `sim/rotation.test.ts` wird entsprechend
umgeschrieben, nicht gelöscht.

### 4.3 Maßstab

Unverändert: Der Versatz eines Satelliten zu seinem Mutterkörper skaliert mit
`sizeScale` statt mit der Abstandskompression (`sim/scale.ts`, `isSatellite`). Das
Verhältnis von Planetenradius zu Mondbahn bleibt dadurch bei jedem Preset korrekt —
für Io genauso wie für den Erdmond. Die Kette Sonne → Pluto → Charon ist der erste
Fall mit einem Satelliten eines Nicht-Planeten; die Rekursion in `scaledPositionAt`
trägt ihn bereits.

---

## 5. Ringe

Neues Modul `render/rings.ts`, datengetrieben aus dem bereits vorhandenen Feld
`appearance.rings` (`innerKm`, `outerKm`, `texture`). Keine Änderung an
`render/bodies.ts` außer der Verdrahtung in `render/scene.ts`.

**Geometrie.** Ein eigener Ringpuffer statt `THREE.RingGeometry`, deren UV-Belegung
für radiale Streifentexturen unbrauchbar ist. Gefordert ist
`u = (r − innen) / (außen − innen)`, damit die Textur von innen nach außen läuft.
Ausrichtung aus dem Planetenpol, nicht aus `axialTiltDeg`.

**Material.** Ein kleiner eigener Shader mit drei Termen:

| Term | Wirkung |
|---|---|
| Direkt | Betrag von `N·L`, beidseitig, mal dem Tagniveau aus `render/lighting.ts` |
| Füllung | Nachtseitenanteil, damit die abgewandte Ringfläche lesbar bleibt |
| Vorwärtsstreuung | Phasenfunktion über den Winkel Blickrichtung ↔ Sonnenrichtung |

Die ersten beiden Terme stammen aus derselben Rechnung wie die der Körper; die Ringe
bekommen damit automatisch den Distanzausgleich und werden bei Saturns Abstand nicht
schwarz. Die kamerarelative Sonnenposition liegt in `render/scene.ts` bereits vor (das
Punktlicht braucht sie ohnehin) und geht als Uniform in den Shader.

**Transparenz.** `depthWrite: false`, feste Renderreihenfolge nach dem Planeten,
Alphakanal aus der Textur. Die Ringe bleiben auf der Standardebene, nicht auf der
Bloom-Ebene.

**Nicht in 3a:** Schatten des Planeten auf den Ringen und der Ringe auf dem Planeten.
Beides braucht Shadow-Maps und gehört zu 3b; bis dahin sind die Ringe durchgehend
beleuchtet.

---

## 6. Oberfläche

**Körperbaum.** Je Planet eine einklappbare Mondgruppe, standardmäßig geschlossen.
Der Sichtbarkeitsschalter eines Planeten nimmt seine Monde mit. Der Klappzustand ist
reine Ansichtssache und kommt **nicht** in den serialisierbaren Zustand — sonst
würde jedes Auf- und Zuklappen das geteilte URL-Fragment vergrößern (dieselbe
Überlegung wie bei `visible` in `store/index.ts`).

**Beschriftungen.** Ein Mond bekommt sein Label erst ab einem scheinbaren Radius von
wenigen Pixeln — dieselbe `apparentRadiusPixels`-Rechnung, die schon über die
Ersatzglyphen entscheidet, nur mit einer zweiten Schwelle. Planeten, Zwergplaneten
und die Sonne behalten ihr Label unabhängig von der Größe. Die Systemschau bleibt
damit von selbst aufgeräumt, die Nahaufnahme des Jupitersystems beschriftet sich von
selbst.

**Sprache.** 25 Namens- und Beschreibungsschlüssel in `ui/i18n/de.ts`. Englisch
bleibt Phase 4.

---

## 7. Kinoszenen

Ausbau des Katalogs in `data/scenes.ts` von 7 auf rund 18 Szenen. Der Director
(`sim/director.ts`) und die Szenen-Engine bleiben unverändert — das ist der Punkt,
für den sie so gebaut wurden.

Die drei Szenen, die in Phase 2 mangels Körpern durch Ersatz gefallen sind, kehren
zurück:

- **Galileisches Schattenspiel** — Jupiter von außen, die vier Monde im Zeitraffer;
  die Laplace-Resonanz 1:2:4 von Io, Europa und Ganymed wird als Muster sichtbar.
- **Phobos-Tiefflug** — dicht über der Marsoberfläche mitlaufend.
- **Pluto–Charon** — beide umkreisen einen Schwerpunkt außerhalb Plutos; die Szene
  blickt auf das Paar statt auf einen der beiden.

Neu dazu:

- **Ringkante** — Saturn genau in der Ringebene; die Ringe verschwinden zur Linie.
- **Ringdurchflug im Gegenlicht** — zeigt die Vorwärtsstreuung aus Abschnitt 5.
- Titan, Enceladus, Triton, Iapetus, sowie Uranus mit seinen senkrecht stehenden
  Ringen.

---

## 8. Prüfung

| Gegenstand | Verfahren |
|---|---|
| Katalogdaten | Invarianten über **alle** Körper: eindeutige IDs, existierender Mutterkörper, Pol vorhanden wo `parentEquator` genutzt wird, Texturpfad vorhanden oder bewusst leer |
| `parentEquator` | Einheitstests gegen von Hand gerechnete Vektoren (Pol = Ekliptiknormale ⇒ Identität; Pol = Erdpol ⇒ Drehung um ε) |
| Mondbahnen | Fixture aus JPL Horizons, mehrere Epochen über ±50 Jahre: Bahnradius 1 %, Neigung und Umlaufzeit 0,1 %, Position entlang der Bahn 5 % des Bahnumfangs — die lockere Schranke mit Begründung im Testkommentar |
| Ringe | Rein rechnerische Anteile: Geometriebauer (Radien, UV-Verlauf, Ausrichtung am Pol) und Phasenterm der Vorwärtsstreuung als reine Funktion |
| Szenen | Invarianten über alle 18 (existierender Körper, gültige Dauer und Parameter, wohlgeformte Variationsbereiche); Rechennachweis für drei bis vier Stichproben |
| Beleuchtung | Die Schranken aus `render/lighting.test.ts` gelten weiter, nun auch für die neuen Körper |
| Sichtprüfung | Ringe im Gegenlicht, Jupitersystem, Pluto–Charon, Systemschau mit allen 35 Körpern |

Der Shader selbst bleibt Sichtprüfung: Screenshot-basierte Rendering-Tests sind im
Hauptentwurf (Abschnitt 17) ausdrücklich ausgeschlossen.

---

## 9. Budget und Risiken

**Renderlast.** 25 zusätzliche Kugeln sind belanglos (je rund 2000 Dreiecke). Die
Texturen sind der Posten: 1k für Monde und Zwergplaneten statt der 2k der Planeten —
bei Körpern, die selten formatfüllend zu sehen sind, spart das rund zwei Drittel.
Texturzahl und Ladezeit werden im Abnahmeprotokoll **gemessen**, nicht geschätzt.

**Risiko Horizons.** Der Fixture-Test braucht echte Abfragen bei JPL Horizons. Das
Verfahren ist aus Phase 1 dokumentiert (`sim/__fixtures__/README.md`), aber 25 Körper
über mehrere Epochen sind spürbar mehr Abrufe. Klemmt der Dienst, wird die
Fixture-Beschaffung ein eigener Planschritt und blockiert die Datensätze nicht.

**Risiko Texturbeschaffung.** Für kleine Monde (Mimas, Miranda, Umbriel) gibt es
möglicherweise keine brauchbare freie Karte. Dann trägt die Ausweichfarbe; der
Datensatz bleibt vollständig, `ASSETS.md` vermerkt die Lücke.

---

## 10. Abgrenzung

Bewusst **nicht** in 3a:

- Asteroiden- und Kuipergürtel, Schattenwurf jeder Art einschließlich Ringschatten
  (Phase 3b)
- Atmosphärenschimmer
- Presets speichern und laden, URL-Sharing in der Oberfläche, Englisch, Infopanel
  (Phase 4)
- Texturkompression (KTX2), Veröffentlichung (Phase 5)
- Störungsreihen für Mondbahnen (siehe Abschnitt 2, Genauigkeit)

---

## 11. Nächster Schritt

Nach Freigabe dieses Dokuments: Implementierungsplan für Phase 3a über die
`writing-plans`-Fähigkeit, in kleinen, testbaren Schritten.
