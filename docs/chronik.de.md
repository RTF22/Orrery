# Chronik der Entstehung

[English](chronik.en.md) | **Deutsch**

Einen verdichteten Überblick über die gesamte Entstehung bietet
[der Überblick](entstehung.de.md); diese Chronik liefert die Einzelheiten je Etappe — als
Beleg für zwei Behauptungen zugleich: Orrery als Werkzeug der Wissenschaftskommunikation,
und der hier beschriebene Arbeitsablauf als ein Weg, mit einem nicht deterministisch
arbeitenden Sprachmodell eine deterministische, überprüfbare Anwendung zu bauen.

Jede Etappe folgt demselben Aufbau: **Ziel** nennt die Absicht zu Beginn,
**Entscheidungen** die im Entwurf oder von Jens Fricke getroffenen Festlegungen,
**Ergebnis** die am Ende gemessenen Kennzahlen, **Fehler und Korrekturen** die im
Material verzeichneten Fälle samt der Prüfung, die sie fing, und **Tokens** den
Sprachmodell-Verbrauch der Etappe. Die Kürzel in Klammern und unter **Commits** sind
Commits im Repository `RTF22/Orrery` und lassen sich mit `git show <Kürzel>`
nachschlagen. Wo ein Screenshot zur Etappe passt, steht er direkt darunter, mit
Alt-Text.

## Inhalt

1. [Die Idee](#idee)
2. [Phase 1: Vertikaler Durchstich](#phase-1)
3. [Phase 2: Kino-Modus](#phase-2)
4. [Phase 3a: Katalog-Ausbau und Ringe](#phase-3a)
5. [Phase 3b: Gürtel und Schatten](#phase-3b)
6. [Phase 4a: Englisch und Sprachumschaltung](#phase-4a)
7. [Phase 4b: Persistenz und Ansichten](#phase-4b)
8. [Klickflächen](#klickflaechen)
9. [Phase 4c: Infopanel](#phase-4c)
10. [Zeitbereich](#zeitbereich)
11. [Flug: Tastatur, Maus und Controller](#flug)
12. [Phase 4d: Hochschultexte](#phase-4d)
13. [Nachführung nach Phase 4d](#nachfuehrung-4d)
14. [Phase 5: Oberfläche, Mobile, Texturen, Musik](#phase-5)
15. [Phase 6: Milchstraße](#phase-6)
16. [Info-Karte](#infokarte)
17. [Kleinigkeiten](#kleinigkeiten)
18. [Weg zur Domain](#domain)
19. [Anhang: Tokenbilanz](#anhang-tokens)

<a id="idee"></a>
## Die Idee (11.09.2026)

**Ziel:** Der Ursprungsprompt an den KI-Coding-Assistenten Claude Code (Anthropic)
verlangte ausdrücklich: „starte mit dem brainstorming-Skill und interviewe mich,
bevor du planst oder Code schreibst. Stelle die Fragen einzeln, schlage jeweils eine
begründete Empfehlung vor und fasse am Ende ein Design-Dokument zusammen, das ich
freigebe. Erst danach: Implementierungsplan, dann Umsetzung in kleinen, testbaren
Schritten." (`docs/ursprungsprompt.md`). Dieser Ablauf — Brainstorming, Design-Dokument,
Freigabe, Plan, Umsetzung, Abnahme — zieht sich durch das ganze Projekt. Die dabei
verwendeten Skills stammen aus der Sammlung Superpowers (Plugin von Jesse Vincent).

**Entscheidungen:** Aus dem Interview zum Design-Dokument (Jens Fricke, 11.09.2026):
Orrery soll Lernwerkzeug und Showpiece gleichrangig sein; das Bahnmodell rechnet
analytisch nach Kepler, datengetrieben und gegen Referenzwerte testbar; das Repository
bleibt privat bis zur Fertigstellung, GitHub Pages ist erst zum Abschluss vorgesehen.

**Ergebnis:** Design-Dokument (`docs/superpowers/specs/2026-09-11-sonnensystem-design.md`)
und Ursprungsprompt (`docs/ursprungsprompt.md`) festgehalten, dazu die Entscheidung, das
Repository bis zur Fertigstellung privat zu halten und ohne Deployment. Zwischen dem
ersten und dem letzten dieser beiden Commits vergingen laut Zeitstempel keine drei
Minuten (19:58:18 bis 20:01:07 Uhr) — die 63 dieser Etappe zugeordneten Antworten
liefen also weit überwiegend parallel in Subagenten. Noch kein Code, noch keine Tests.

**Fehler und Korrekturen:** Für diese Etappe verzeichnet der Fehlerkatalog keinen Fall —
es gab noch keinen Code, der hätte scheitern können. Der erste im Katalog verzeichnete
Fall stammt erst aus Phase 4c.

**Tokens:** 230 581 Ausgabe-Tokens, 8 843 552 Cache-Lesen-Tokens in 63 Antworten
(Kennung `idee`). Davon lagen 28 Antworten zeitlich vor dem offiziellen Beginn dieser
Phase und wurden ihr trotzdem zugeordnet, weil die Zeitleiste keine frühere Phase kennt.
Schon am 11.09.2026 liefen dazu 1 Hauptsitzung und 19 Subagentenläufe. Projektweit
entfielen rund 82,7 % aller Tokens auf Subagentenläufe, und rund 65 % aller Antworten
kamen vom insgesamt vorherrschenden Modell Claude Sonnet 5. Die in den folgenden
Abschnitten genannte Dauer je Etappe ist dabei die reine Kalenderzeit zwischen erstem
und letztem zugeordnetem Commit, keine gemessene Auslastung.

**Commits:** `32072ef`, `b9e4283`.

<a id="phase-1"></a>
## Phase 1: Vertikaler Durchstich (11.–12.09.2026, v0.1.0)

**Ziel:** ein lauffähiger, vertikaler Durchstich der Simulation — die vollständige
Kette von Eingabe bis Darstellung einmal durchgängig, bevor der Katalog wächst.

**Entscheidungen:** Aus derselben Interview-Runde stand die Reihenfolge der Umsetzung
fest: Durchstich zuerst, danach der Kino-Modus vorgezogen (noch vor dem
Katalogausbau), dann Katalog, dann Komfort, zuletzt Sound und Politur.

**Ergebnis:** 152 Tests in 27 Testdateien beim Abschluss, Tag `v0.1.0`. Die Etappe
lief vom Abend des 11.09.2026 (`89b0284`, 20:28 Uhr) bis in den frühen Morgen des
12.09.2026 (`bf025fd`, 07:37 Uhr) — rund 11,1 Stunden laut Zeitstempeln. Am Tag ihres
Abschlusses liefen bereits 4 Hauptsitzungen und 62 Subagentenläufe.

![Früher Entwicklungsstand v0.1.0 mit einfacher Oberfläche.](bilder/entstehung/alt-v0.1.0.jpg)

**Fehler und Korrekturen:** Für diese Etappe verzeichnet der Fehlerkatalog keinen Fall.

**Tokens:** 1 187 833 Ausgabe-Tokens, 175 356 549 Cache-Lesen-Tokens in 1 126 Antworten
(Kennung `phase-1`); Subagenten- und Modellanteil wie insgesamt (siehe oben).

**Commits:** `89b0284`, `bf025fd`.

<a id="phase-2"></a>
## Phase 2: Kino-Modus (12.09.2026, v0.2.0)

**Ziel:** ein Kino-Modus mit ausblendbarer Oberfläche, echtem Vollbild und
automatischer Kamerafahrt — laut Interview-Entscheidung vorgezogen vor den
eigentlichen Katalogausbau.

**Entscheidungen:** Für diese Etappe ist im Material kein eigener Entscheidungsblock
verzeichnet; die Reihenfolge — Kino-Modus direkt nach dem Durchstich, vor dem
Katalogausbau — folgt der bereits in der Ideen-Phase getroffenen Priorisierung
(siehe oben).

**Ergebnis:** 240 Tests in 39 Testdateien beim Abschluss, Tag `v0.2.0` (Tag-Commit
`125696f`, per Fast-Forward nach master gesetzt, zeitlich bereits nach dem Beginn von
Phase 3a). Die Etappe selbst lief komplett am Vormittag des 12.09.2026, von `a1d4c5a`
(08:10 Uhr) bis `ff68df5` (09:04 Uhr) — knapp eine Stunde (0,9 Stunden laut
Zeitstempeln).

**Fehler und Korrekturen:** Für diese Etappe verzeichnet der Fehlerkatalog keinen Fall.

**Tokens:** 147 022 Ausgabe-Tokens, 51 721 718 Cache-Lesen-Tokens in 171 Antworten
(Kennung `phase-2`); Subagenten- und Modellanteil wie insgesamt.

**Commits:** `a1d4c5a`, `ff68df5`, `125696f`.

<a id="phase-3a"></a>
## Phase 3a: Katalog-Ausbau und Ringe (12.–13.09.2026)

**Ziel:** den Körperkatalog auf 20 Monde und 5 Zwergplaneten erweitern und Ringe
darstellen.

**Entscheidungen:** Texturen wo verfügbar, sonst eine Ausweichfarbe; als Bezugsebene
dient der Planetenpol als Datum, Mondbahnebene, Ringebene und Achsneigung kommen
jeweils aus einer einzigen Zahl; Ringe sind beleuchtet, beidseitig sichtbar und mit
Vorwärtsstreuung gerechnet. Die Prüftiefe verlangt Invarianten über alle Szenen und
einen Rechennachweis für Stichproben — ein ausdrücklicher Wunsch des Auftraggebers.
Eingeschoben in diese Etappe war außerdem ein Zwischenschritt zu Zielbelichtung und
Albedo (Commits `bc0de15`…`a369f57`); seine inhaltlichen Entscheidungen führt das
Faktenblatt zusammen mit denen von Phase 3b, sie stehen deshalb im folgenden Abschnitt.

**Ergebnis:** 689 Tests in 44 Testdateien (im nächsten Lauf bereits 721), Hauptchunk
1 096,84 kB (gzip 290,66 kB). Im Lauf dieser Etappe wurde das Projekt zudem in
„Orrery" umbenannt. Die Etappe dauerte laut Zeitstempeln rund 22,1 Stunden und reichte
vom 12.09.2026 (67 Commits, der commitreichste Tag der ersten drei Tage) bis in den
13.09.2026 hinein.

**Fehler und Korrekturen:** Auch für diese Etappe verzeichnet der Fehlerkatalog keinen
Fall.

**Tokens:** 4 344 979 Ausgabe-Tokens, 724 412 063 Cache-Lesen-Tokens in 3 851 Antworten
(Kennung `phase-3a`); Subagenten- und Modellanteil wie insgesamt.

**Commits:** `0a69089`, `bc0de15`, `a369f57`, `750bef7`, `6d3409b`.

<a id="phase-3b"></a>
## Phase 3b: Gürtel und Schatten (13.09.2026, v0.3.0)

**Ziel:** einen Asteroidengürtel und echte Schatten mit Finsternissen.

**Entscheidungen:** Der Gürtel läuft als `THREE.Points` mit Bahnrechnung im
Vertex-Shader statt als `InstancedMesh`, weil 50 000 Keplerlösungen je Bild in
JavaScript zu teuer wären. Schatten entstehen über analytische Okkluder statt
Shadow-Maps, wegen der großen Maßstabsspanne, logarithmischer Tiefe und eines exakten
Halbschattens aus Kreisüberlappung. Die Belichtung richtet sich nach dem Kamera-Ziel
statt nach einer festen Kamera, Albedo ist ein Katalogdatum je Körper, Sonne und
Sterne bleiben von der Belichtung unberührt.

**Ergebnis:** Tag `v0.3.0` (Tag-Commit `515f4fe`). Eine eigene Testzahl oder ein
eigener Hauptchunk-Wert für diese Etappe ist im Faktenblatt nicht gesondert
ausgewiesen (die nächste dort verzeichnete Zahl gehört bereits zu Phase 4a). Die
Etappe dauerte laut Zeitstempeln rund 8,7 Stunden, ganz am 13.09.2026 — dem Tag mit
7 Hauptsitzungen und 68 Subagentenläufen, an dem auch Phase 3a endete und Phase 4a
begann. Bis zum Ende dieses dritten Tages waren nach der Zeitleiste bereits 147 der
insgesamt 673 Commits bis zum Projektabschluss entstanden (18 am 11.09., 67 am 12.09.,
62 am 13.09.).

**Fehler und Korrekturen:** Für diese Etappe verzeichnet der Fehlerkatalog ebenfalls
keinen Fall.

**Tokens:** 1 435 858 Ausgabe-Tokens, 204 267 920 Cache-Lesen-Tokens in 1 539 Antworten
(Kennung `phase-3b`); Subagenten- und Modellanteil wie insgesamt.

**Commits:** `d94c497`, `515f4fe`, `69e9998`.
