# Orrery

[English](README.md) | **Deutsch**

Interaktive 3D-Simulation des Sonnensystems im Browser, mit Erläuterungstexten in drei
Niveaustufen und einer belegten wissenschaftlichen Grundlage.

**Live: <https://orrery3d.de>**

![Animierte Ansicht von Saturn mit dem Schatten des Planeten auf den Ringen, dargestellt von Orrery](docs/bilder/orrery-saturn.webp)

Ein Orrery ist ein mechanisches Modell der Planetenbewegung, benannt nach dem Earl of Orrery,
für den 1704 eines der ersten gebaut wurde. Dieses hier ist digital: Es rechnet mit
veröffentlichten Bahnelementen, und seine Positionen sind gegen JPL Horizons getestet. Die
Simulation rechnet immer physikalisch korrekt; nur die Darstellung darf Größen und
Helligkeiten überhöhen, damit kleine und ferne Körper sichtbar bleiben. Wie stark sie
überhöht, ist eine Einstellung am Regler, kein fester Kompromiss.

## Datenquellen

| Datensatz | Quelle | Gültigkeit/Genauigkeit |
|---|---|---|
| Planetenbahnen | JPL Approximate Positions, linear fortgeschrieben | Geprüft 1800 bis 2050; nominelle Längenfehler 15″ bis 600″ |
| Monde | Mittlere Bahnelemente der Monde (JPL SSD) | Keine eigens geführte Laplace-Ebene |
| Zwergplaneten und Pluto-System | Oskulierende Elemente, JPL Small-Body Database | Pluto weicht von DE441 um bis zu 1,4° ab (1800) |
| Rotation und Pole | Feste Rektaszension/Deklination, überwiegend der seit 2015 amtliche Pol (Archinal et al. 2018); Mars behält den Pol von 2009, Uranus/Neptun die Voyager-2-Perioden (1986/1989) | Keine Präzession, keine periodischen Glieder |
| Zeitskalen | Uhr zeigt UTC an, setzt sie unverändert in die Bahnrechnung ein | Gültig Jahr 1 bis 9999; UTC als TDB verwendet |
| Mondfinsternisse | Werden gerechnet, nicht aus Tabellen entnommen; geprüft gegen den NASA-Katalog | Trifft 135 von 143 Kernschattenfinsternissen (1951–2050) |
| Sternkatalog | HYG-Datenbank (Astronexus), Version 4.1, CC BY-SA 4.0 | 5070 Sterne bis Helligkeit 6,0 |
| Milchstraße | NASA SVS „Deep Star Maps 2020“, aus Gaia DR2 | SVS gemeinfrei; Gaia-Anteil CC BY-NC 3.0 IGO |
| Texturen | Solar System Scope (CC BY 4.0) und NASA/USGS Astrogeology (gemeinfrei) | 14 CC-BY-Karten, 15 gemeinfreie Karten |
| Prüfung gegen JPL Horizons | JPL-Horizons-Vektortafel; verglichen werden 8 Planeten und 5 Zwergplaneten, 5 Zeitpunkte 1850–2040 (65 Punkte) | Toleranz bei den Planeten 12 000 bis 9 000 000 km |

Das Thema *Grenzen des Modells* in der App beschreibt die Vereinfachungen des Modells und
beziffert sie, wo möglich; Einzelheiten außerdem in [`ASSETS.md`](ASSETS.md) und
[`docs/belege/hochschule/`](docs/belege/hochschule/).

## Lehrinhalt

Jeder Körper, jede Kinoszene und jedes Thema hat einen Erläuterungstext in drei Stufen, auf
Deutsch und Englisch. Stufe und Sprache lassen sich in der App jederzeit umschalten.

| Stufe | Art der Texte | Daten daneben | Texte |
|---|---|---|---|
| Grundschule | Kurze Texte in einfacher Sprache | Durchmesser, Umlaufzeit, Abstand zur Sonne jetzt | 63 |
| Gymnasium | Zahlen, physikalische Zusammenhänge, Verweise auf verwandte Themen | Dazu Masse, Rotationsperiode, Achsneigung, Exzentrizität, Bahngeschwindigkeit | 63 |
| Hochschule | Gesamte wissenschaftliche Grundlage: Formeln, Tabellen mit Unsicherheiten, Streitfragen mit beiden Seiten, Zitate | Dazu Bahnelemente zur Epoche J2000 samt Raten, Polrichtung, geometrische Albedo | 69 |

Die Texte behandeln 35 Körper (Sonne, acht Planeten, fünf Zwergplaneten, 21 Monde), 19
Kinoszenen und 9 übergreifende Themen wie Finsternisse, Ringsysteme, Achsneigung und
Kirkwood-Lücken. Die Hochschulstufe ergänzt sechs Fachthemen: Gezeiten, Bahnresonanzen,
Bezugssysteme und Zeitskalen, innerer Aufbau, Photometrie und die Entstehung des
Sonnensystems.

Ein eigenes Thema, *Grenzen des Modells*, benennt, was Orrery vereinfacht, und beziffert die
Fehler, die daraus folgen, etwa bei der Zeitskala der Bahnrechnung oder den Rotationsmodellen
der Planeten.

## Quellen und Literatur

- **91 Quellenkarten** verbinden die Texte mit öffentlichem Referenzmaterial: NASA (50),
  Wikipedia (23), JPL (11), ESA (4), IAU (1) und zwei weitere. Sie öffnen in einem neuen Tab
  und werden nie eingebettet.
- **761 Fachpublikationen** bilden den Literaturkatalog der Hochschultexte, 737 davon mit DOI.
  Jeder Eintrag wird automatisch gegen Crossref oder arXiv geprüft
  (`npm run literatur:pruefen`).
- **69 Belegdateien** in [`docs/belege/hochschule/`](docs/belege/hochschule/) halten für jeden
  Hochschultext jede Aussage mit Wert, Beleg, Fundstelle und Prüfung fest.

## Funktionen

- Sonne, Planeten, Zwergplaneten und Monde mit den Ringen von Saturn und Uranus,
  Asteroidengürtel mit Kirkwood-Lücken, Kuipergürtel, Sternkatalog und die Milchstraße in
  ihrer wahren Lage.
- Schatten und Finsternisse: Mondschatten auf Planeten, Ringschatten, Blutmond; die Kinoszene
  *Mondfinsternis* springt zur nächsten echten.
- Zeitsteuerung vom 1. Januar des Jahres 1 bis zum 31. Dezember 9999: Pause, Tempo,
  Rückwärtslauf, Datumssprung.
- Getrennte Maßstabsregler für Größe und Abstand.
- Kino-Modus: Vollbild, automatische Kamerafahrten durch 19 kuratierte Szenen.
- Installierbare Web-App; läuft auf dem Handy, mit Tastatur, Maus und Controller.

## Wie es entstand

Orrery entstand in 15 Kalendertagen, vom ersten Prompt bis zur eigenen Domain — gebaut mit
einem KI-Coding-Assistenten, einem nicht deterministisch arbeitenden Werkzeug. Leitmotiv war,
mit diesem Werkzeug trotzdem eine deterministische, überprüfbare Anwendung zu bauen: Tests,
Zahlen und Pixelmessung statt Eindruck. Wie das im Einzelnen ablief, mit allen Zahlen und
Commit-Kürzeln, erzählen der [Überblick](docs/entstehung.de.md) und die ausführliche
[Chronik](docs/chronik.de.md). Beide gibt es auch als Webseiten unter
<https://orrery3d.de/doku/making-of/de/>.

## Lizenz

Code steht unter MIT ([`LICENSE`](LICENSE)), eigene Texte und Bilder unter CC BY-SA 4.0
([`LICENSE-TEXTE.md`](LICENSE-TEXTE.md)). Texturen und die Karte der Milchstraße unterliegen
den in [`ASSETS.md`](ASSETS.md) genannten Lizenzen (überwiegend CC BY 4.0; die
Milchstraßenkarte enthält Gaia-Daten unter CC BY-NC 3.0 IGO).

Entwicklung, Veröffentlichung, eigene Musik und Aufbau des Codes:
[`docs/entwicklung.md`](docs/entwicklung.md).
