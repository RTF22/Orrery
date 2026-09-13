# Zielbelichtung und Albedo — Entwurf

**Datum:** 13.09.2026
**Baut auf:** `2026-09-11-sonnensystem-design.md` (Abschnitt 6.2), `render/lighting.ts`
nach der Nachbesserung vom 13.09.2026 (Tagniveau aus der geklemmten Verstärkung),
Befund „Gesamtbelichtung" in `docs/phase3a-abnahme.md`.

---

## 1. Zuschnitt

Ziel ist maximale Sichtbarkeit für den Betrachter bei geringstmöglicher Abweichung
vom Stand der Wissenschaft. Beides zugleich geht, wenn man die Physik der Szene
von der Kamera trennt:

- **Die Szene bleibt physikalisch.** Sonnenlicht fällt mit dem eingestellten
  Exponenten ab (Standard 2), Oberflächen reflektieren nach Lambert, und zwar mit
  ihrer **echten Albedo** aus der Literatur — nicht mit dem Kontrast, den eine
  Kartenmosaik zufällig hat.
- **Die Kamera belichtet auf das Ziel.** Wie eine Raumsondenkamera oder das Auge
  passt sich die Belichtung dem Körper an, der gerade betrachtet wird. Das ist
  keine physikalische Aussage über die Szene, sondern eine über das Messgerät —
  und damit die einzige Stelle, an der Sichtbarkeit erkauft wird, ohne die Physik
  zu verbiegen.

Der bestehende Distanzausgleich (`lightCompensation`, Standard 0,85) bleibt als
bewusst unphysikalischer Regler für Ansichten, in denen viele Körper zugleich zu
sehen sind. Er wird nicht entfernt und nicht umgedeutet.

Befund, der das auslöst (`docs/phase3a-abnahme.md`, Nachtrag „Tagseite ferner
Körper"): Die volle Tagseite der Erde erreicht einen Median von 51 von 255, weil
der Lambert-Anteil des Materials mit 1/π gewichtet wird und die Texturen mittelgrau
sind. Die Enceladus-Karte liegt bei 18 % linearer Reflexion, der Körper selbst
laut Fact Sheet bei rund 100 %.

---

## 2. Entscheidungen aus dem Gespräch

| Frage | Entscheidung | Begründung |
|---|---|---|
| Feste Kamera (auf 1 AE kalibriert) oder Belichtung auf das Ziel? | **Belichtung auf das Ziel** | Maximale Sichtbarkeit bei jedem Körper; der Lichtabfall bleibt echt, nur die Kamera passt sich an. |
| Albedo je Körper als Katalogdatum? | **Ja** | Ohne sie bleibt Enceladus so grau wie der Erdmond; die Helligkeitsverhältnisse zwischen den Körpern sollen der Literatur folgen. |
| Sonne und Sterne mit der Belichtung mitgehen? | **Nein, konstant** | Die Belichtung sitzt auf der Bestrahlungsstärke, nicht im Tonemapping; Sonne, Sterne, Bahnlinien und Bloom bleiben unverändert. Eine auf Pluto belichtete Kamera würde die Sonne ohnehin nur ausbrennen. |
| Zielwechsel gedämpft? | **Ja, rund eine Sekunde** | Kein Helligkeitssprung beim Szenenwechsel im Kino-Modus; entspricht der Adaption des Auges. |

---

## 3. Zielbelichtung

### 3.1 Rechnung

Reine Funktion in `render/lighting.ts`:

```
targetExposure(zielSonnenabstandKm, s) = EXPOSURE_REFERENCE · π / dayLevelRel(ziel)
```

mit `dayLevelRel(ziel) = E_ziel^(1 − c)` (die vorhandene Rechnung aus
`bodyLighting`, ohne `brightness`), `E_ziel = irradianceFactor(zielSonnenabstand)`
und `EXPOSURE_REFERENCE = 1`. Das π hebt den Lambert-Faktor des Materials auf.
Ergebnis: Eine weiße Lambert-Fläche am Zielabstand unter senkrechtem Sonnenlicht
landet bei 1,0 linear, nach ACES bei 232 von 255. Die Reserve bis 255 bleibt für
Eis und Wolken.

Für das Ziel Sonne (und alles im Ursprung) liefert `irradianceFactor` bereits den
Bezugswert 1 — die Belichtung ist dann die einer Kamera bei 1 AE, also der
heutige Zustand mal π. Die Systemschau braucht damit keine Sonderregel: Die
Staffelung der äußeren Planeten bleibt Sache des Distanzausgleichs.

### 3.2 Einbau

Die Belichtung ist ein Faktor auf die Bestrahlungsstärke, nicht auf das
Tonemapping. `scene.ts` bildet je Frame

```
belichtet = { ...state.display, brightness: state.display.brightness · exposure }
```

und reicht dieses Objekt überall dort hin, wo heute `state.display` als
`LightingSettings` ankommt: Punktlicht (`licht.intensity`), Körper
(`bodies.update`), Ringe (`ringe.update`). Nachtseitenfüllung und Ring-`uTag`
gehen damit automatisch mit, weil beide aus `brightness` abgeleitet sind.
Sonne (`MeshBasicMaterial`), Sterne, Bahnlinien und Bloom hängen nicht an
`brightness` und bleiben unverändert.

`lighting.ts` und `bodyLighting` selbst ändern sich nicht; die vorhandenen
Schranken (`lighting.test.ts`, 30 % Tagseite, 5 % Nachtseite) gelten weiter als
relative Prüfung gegenüber `brightness`.

### 3.3 Das Ziel

| Kameramodus | Ziel der Belichtung |
|---|---|
| `free`, `attached`, `follow` | `state.camera.targetId` |
| `cinema` | `scene.lookAtId`, sonst `scene.targetId` der geplanten Szene |

Der Sonnenabstand des Ziels ist der **dargestellte** (`scaledPositionAt`), wie
bei der Beleuchtung der Körper — sonst passte die Belichtung nicht zum Licht, das
die Szene tatsächlich zeigt.

### 3.4 Dämpfung

Der Belichtungsfaktor wird im logarithmischen Raum gedämpft (`smoothDamp` auf
`ln(exposure)`, Zeitkonstante rund 1 s), damit der Übergang zwischen Faktor 3 und
Faktor 300 gleichmäßig wirkt statt erst zu rasen und dann zu kriechen. Der
Dämpfungszustand lebt in `scene.ts` neben der Kamera, nicht im Store — er ist
kein einstellbarer Zustand.

---

## 4. Albedo als Katalogdatum

### 4.1 Feld

`PhysicalData.albedo`: geometrische Albedo, dimensionslos, für alle 35 Körper
(die Sonne trägt das Feld nicht; sie leuchtet selbst). Quellenpflicht wie bei den
Bahnelementen: Quellenkommentar je Datensatz, keine Zahl aus dem Gedächtnis.

Quellen in dieser Reihenfolge:

1. NSSDC Planetary Fact Sheets (`nssdc.gsfc.nasa.gov/planetary/factsheet/`) für
   Planeten, Erdmond, Pluto und Charon — Zeile „Geometric albedo".
2. JPL Solar System Dynamics, „Planetary Satellite Physical Parameters"
   (`ssd.jpl.nasa.gov/sats/phys_par/`) für alle übrigen Monde — Spalte
   „Geometric albedo", mit Quellenkürzel der Tabelle.
3. JPL Small-Body Database (`ssd.jpl.nasa.gov/tools/sbdb_lookup.html`) für Ceres,
   Eris, Haumea und Makemake — Parameter „albedo".

Die geometrische Albedo ist streng genommen die Rückstrahlung bei Phasenwinkel 0
und kann durch den Oppositionseffekt über 1 liegen (Enceladus 1,4 in manchen
Quellen). Sie wird hier als Normalalbedo der Lambert-Fläche verwendet — eine
dokumentierte Vereinfachung, weil das Material weder Oppositionseffekt noch
Phasenfunktion kennt. Werte über 1 werden **nicht** abgeschnitten; das Tonemapping
fängt sie ab.

### 4.2 Normierung beim Laden

`bodies.ts` misst beim Laden jeder Albedo-Textur die mittlere lineare Reflexion
über eine Canvas-Auswertung (verkleinertes Bild genügt, etwa 256 × 128):

- sRGB → linear je Kanal, dann Mittel über die drei Kanäle,
- **breitengradgewichtet** (`cos φ` je Zeile der Rektangularkarte), weil die
  Polzeilen sonst überzählen,
- **ohne Datenlücken**: Pixel unter 0,005 linear zählen nicht mit. Das sind die
  unbelichteten Kartenteile von Pluto und Triton (`ASSETS.md`); die reale
  Albedo-Dichotomie von Iapetus (dunkle Seite Albedo rund 0,05, in der Karte
  etwa 0,05 linear, also zehnmal über der Schwelle) bleibt darüber und zählt mit.

Der **Albedofaktor** `albedo / texturMittel` geht auf `material.color` (zusätzlich
zu `colorGain`) und auf `emissiveIntensity`, damit die Nachtseite derselbe
Bruchteil der Tagseite bleibt. Bis die Textur steht, und für Körper ohne Textur,
wird die Ausweichfarbe so skaliert, dass ihr Mittel der Albedo entspricht.

Erwartungswerte aus der Messung der heutigen Texturen (linear, grau,
breitengradgewichtet, noch ohne Lückenausschluss): Erde 0,14, Enceladus 0,18,
Kallisto 0,03, Pluto 0,14, Saturn 0,58, Mars 0,21. Diese Zahlen sind
Kontrollwerte für die Canvas-Auswertung im Plan, nicht Vorgaben.

### 4.3 Grenzen

Der Albedofaktor wird auf [0,1, 30] geklemmt — als Zahlenwächter gegen eine
Textur, die nach dem Lückenausschluss fast leer ist, nicht als Gestaltung. Ein
Test hält fest, dass kein Körper des Katalogs die Klemme erreicht.

---

## 5. Regler und Standardwerte

| Regler | Bedeutung nach dem Umbau | Standard |
|---|---|---|
| `brightness` | Belichtungskorrektur relativ zur Zielbelichtung (1 = weiß am Ziel ergibt 232) | 1 (unverändert) |
| `lightFalloff` | Abfallexponent | 2 (unverändert) |
| `lightCompensation` | Staffelung zwischen den Körpern einer Ansicht | 0,85, **Messung im Plan**: ob die Systemschau mit einem physikalischeren Wert (etwa 0,7) noch alle Planeten lesbar zeigt — Kriterium Nachtseite Neptun über 12 von 255, Tagseite über 40 |
| `nightFill` | Nachtseitenanteil | 0,25 (unverändert) |

Keine neuen Bedienelemente. Die Serialisierung (`store/serialize.ts`) ändert sich
nicht, weil kein Zustandsfeld hinzukommt.

---

## 6. Prüfung

| Gegenstand | Verfahren |
|---|---|
| `targetExposure` | Reine Funktion: weiße Fläche am Ziel ergibt 1,0 linear (`exposure · dayLevelRel / π = 1`); Ziel im Ursprung ergibt Referenz 1 AE; Ergebnis skaliert nicht mit `brightness` (das kommt separat); bei `c = 1` überall gleich |
| Dämpfung | Reine Funktion: konvergiert gegen das Ziel, monoton, Zeitkonstante eingehalten, im log-Raum symmetrisch für Faktor 10 hoch und 10 runter |
| Albedofaktor | Reine Funktion auf einem Pixelfeld: Breitengradgewichtung (eine helle Polzeile zählt weniger als eine helle Äquatorzeile), Lückenausschluss, Klemme |
| Katalog | Invariante: jeder Körper außer der Sonne hat `albedo` in (0,02; 1,5); Sonne hat keins |
| Renderweg | Bestehende Schranken in `lighting.test.ts` bleiben unverändert grün |
| Sichtprüfung | Pixelmessung wie in der Abnahme 3a, vorher/nachher: Erde (Ozean, Land), Enceladus, Pluto, Systemblick (Neptun Tag- und Nachtseite), Uranusring, Saturnring im Gegenlicht — als Nachtrag in `docs/phase3a-abnahme.md` |

---

## 7. Budget und Risiken

**Renderlast.** Null pro Frame: eine Skalarrechnung und eine Dämpfung. Die
Canvas-Auswertung läuft einmal je Textur beim Laden (30 Bilder à 256 × 128,
zusammen unter 10 ms).

**Risiko Quellen.** Für Haumea und Makemake streuen die Albedowerte in der
Literatur stark (0,5 bis 0,8). Genommen wird der SBDB-Wert mit Angabe der dort
genannten Referenz; die Streuung steht im Quellenkommentar.

**Risiko Überstrahlung.** Enceladus mit Faktor rund 5,6 auf einer Karte mit
hellen Stellen bis 0,4 linear erreicht 2,2 linear — ACES bildet das auf 246 ab,
nicht auf 255. Kein Ausbrennen, aber die Sichtprüfung misst das 99. Perzentil
der Scheibe, nicht nur den Median.

**Risiko Kino-Modus.** Szenen mit `lookAtId` (Erdaufgang, ferne Sonne) belichten
auf den angesehenen Körper; bei „ferne Sonne" ist das die Sonne, also
Referenz 1 AE, und Neptun im Vordergrund bleibt dunkel — das ist die Aussage der
Szene und bleibt so.

---

## 8. Abgrenzung

Bewusst **nicht** Teil dieses Umbaus:

- Belichtung aus dem Bildhistogramm (echte Auto-Exposure); die Belichtung folgt
  dem Ziel, nicht dem Bildinhalt.
- HDR-Ausgabe, Änderungen am Tonemapping oder am Bloom.
- Phasenfunktion, Oppositionseffekt, Specular-Maps (Ozeane), Atmosphären.
- Schattenwurf (Phase 3b).
- Neue Bedienelemente oder Zustandsfelder.

---

## 9. Nächster Schritt

Implementierungsplan nach `superpowers:writing-plans`, in Tasks, die je in einer
Session abschließbar sind: (1) `targetExposure` und Dämpfung als reine Funktionen,
(2) Einbau in `scene.ts`, (3) Albedofeld und Datensätze mit Quellen, (4)
Albedofaktor und Normierung beim Laden, (5) Messung des Distanzausgleichs und
Abnahme-Nachtrag.
