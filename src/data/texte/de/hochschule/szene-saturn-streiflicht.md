# Szene: Saturn im Streiflicht

Die Kamera umkreist [Saturn](objekt:saturn) in flachem Winkel über der Ekliptik und zeigt, wie
unterschiedlich [die Ringe](thema:ringe) je nach Beleuchtung aussehen: mal als schmales, dunkles
Band im Streiflicht, mal hell aufleuchtend im Gegenlicht. Anders als bei
[Saturns Ringen von der Kante](szene:saturn-ringkante) oder beim [Ringdurchflug](szene:ringdurchflug)
bleibt Saturn hier als Ganzes im Bild; Sonnenstand und Kamerarichtung entscheiden gemeinsam, welches
der beiden Erscheinungsbilder gerade zu sehen ist.

## Was das Bild zeigt

Der Bahntyp `orbit` hält die Kamera auf einer Kugel um Saturns Mittelpunkt
(`render/camera/cinema.ts`): Radius 5 dargestellte Saturnradien (58 232 km) mal Streufaktor, Azimut
wandert mit 0,8°/s um Saturn, die Elevation liegt je Ziehung fest zwischen 1° und 16° (Basiswert 4°,
Streuung additiv −3° bis 12°). Beim Streufaktor 0,85/1,0/1,4 liegt die Kamera 247 486/291 160/
407 624 km entfernt; Saturns Winkeldurchmesser ($2\arcsin(R_\mathrm{S}/d)$, nicht klein gerechnet)
schrumpft dabei von 27,2° auf 16,4°.

Ob der ganze Ring ins Bild passt, entscheidet allein der Abstand: Ihre Innenkante (74 658 km, 1,28
Saturnradien) erreicht als größten Winkelabstand von der Bildmitte $\arcsin(74658/d)$ – 17,6° bei
Faktor 0,85 bis 10,6° bei Faktor 1,4 –, die Außenkante (136 780 km, 2,35 Saturnradien) entsprechend
33,6° bis 19,6°. Gegen die Halbbildhöhe von 25° (Sichtfeld 50°, `KAMERA_FOV_GRAD`) passt die
Außenkante erst ab Faktor 1,11 vollständig hinein; bei gleichverteiltem Streufaktor ragt sie bei
knapp der Hälfte aller Ziehungen (47,6 %) über den Bildrand hinaus.

Wie schräg die Kamera auf die Ringebene blickt, folgt aus Azimut, Elevation und Saturns Pol: Der
Blickwinkel $B=\arcsin(\hat{d}\cdot\hat{n})$ ($\hat{d}$ die Blickrichtung, $\hat{n}$ die Polrichtung,
[Bezugssysteme](thema:bezugssysteme)) liegt bei der Grundeinstellung (Azimut 40°, Elevation 4°) bei
25,1°, über die volle Streuung zwischen −27,1° und 44,1°. Saturns Pol steht dabei 28,1° gegen die
Ekliptiknormale, nicht 26,73°: Jene oft zitierte Zahl misst gegen die eigene, um 2,49° geneigte
Bahn, während die ekliptikale Elevation der Kamera gegen die Ekliptiknormale misst.

Ob die Kamera im Streif- oder im Gegenlicht steht, verrät der Phasenwinkel Sonne–Saturn–Kamera. Bei
der Grundeinstellung (Stand 21.09.2026) beträgt er 149,9° – schon nahe am Gegenlicht –, über den
vollen Azimutkreis reicht er von 1,6° (Vollicht, Azimut 190,5°) bis 173,6° (Azimut 10,5°); mit der
Elevationsstreuung sind bis zu 176,6° erreichbar. Genau in diesem schmalen Azimutfenster liegt die
Kamera geometrisch sogar in Saturns eigenem Kernschatten: Bei Faktor 1 reicht dessen Winkelradius
von Saturn aus gesehen 11,3° (bei Faktor 0,85 13,2°, bei Faktor 1,4 8,1°) – ein reales Raumschiff an
dieser Stelle bekäme, wie Cassini am 15. September 2006, für einige Stunden keine direkte Sonne mehr
zu sehen ([Finsternisse](thema:finsternis)). Über den vollen Streubereich betrifft das je nach
Faktor 2,8 % bis 6,4 % aller Azimut-Ziehungen.

Die Vorwärtsstreuung $s(\gamma)=0{,}85\max(0,-\cos\gamma)^6$ (`vorwaertsstreuung`,
[Ringe](thema:ringe)) folgt demselben Winkel: Bei Azimut 40° liegt sie mit 0,356 schon deutlich über
null, nahe Azimut 10,5° erreicht sie 0,82 – fast ihr Maximum.

In 3,5 simulierten Tagen (35 s bei 0,1 Tagen/s) dreht sich Saturn 7,9-mal um seine Achse
(`rotationPeriodH` 10,656 h).

## Hintergrund

Der Ringschatten auf der Wolkendecke wandert als Jahreszeitenuhr: Am 21.09.2026 steht die Sonne nur
7,5° über der Ringebene, das Schattenband misst 2,2° bis 10,5° Breite; nahe dem Solstitium
(Sonnenhöhe 26,7°) reicht es bis zur Winterpolkappe ([Ringe](thema:ringe)). Cassinis Mosaik „In
Saturn's Shadow" entstand am 15. September 2006 aus 165 Weitwinkelbildern über rund drei Stunden,
während die Sonde selbst zwölf Stunden lang in Saturns Schatten trieb; neben den Hauptringen wurden
darin der schwache G- und E-Ring sichtbar sowie, als blasser Punkt, die Erde
([Photojournal Saturn](quelle:jpl-photojournal-saturn)). Die allgemeine Phasenfunktion der Ringe,
einschließlich eines Oppositionseffekts nahe Phasenwinkel null, behandelt
[Albedo und Helligkeit](thema:photometrie); die hier gezeigte Vorwärtsstreuung geht auf
Mikrometeoroidenstaub zurück. Ihre Sichtbarkeit hängt zusätzlich vom Sonnenstand über der Ringebene
ab: Die radialen „Speichen" des B-Rings, durch elektrostatisch angehobenen Staub erklärt,
verschwanden zwischen 1998 und September 2005 fast vollständig und kehrten erst zurück, als sich die
Ringe der Sonne wieder stärker öffneten ([Mitchell et al. 2006](literatur:mitchell-2006)).

## Modellgrenzen

- **Saturn als Kugel mit System-III-Rotation:** dieselben Werte wie bei [Saturn](objekt:saturn)
  (`rotationPeriodH` 10,656 h, Achsneigung gegen die eigene Bahn 26,730°, Abplattung nicht
  dargestellt).
- **Ring als Scheibe ohne Dicke:** Texturstreifen mit Alphakanal (Innenkante 74 658 km, Außenkante
  136 780 km); Vorwärtsstreuung `RING_STREUUNG` 0,85, `RING_SCHÄRFE` 6, Restlicht im Kugelschatten
  `RING_SCHATTEN_RESTLICHT` 0,3, Ringschatten mit der Deckkraft des Alphakanals (dieselben Zahlen
  wie [Ringe](thema:ringe)); keine Speichen, keine Dicke, kein Oppositionseffekt.
- **Belichtung:** ohne `lookAtId` belichtet die Kamera auf Saturn selbst (`exposureTargetId`,
  `render/exposure.ts`).
- **Zeitraffer:** er gleitet beim Szenenbeginn 2 s lang geometrisch auf 0,1 Tage/s
  (`RATE_BLEND_SEC`); je nach Vorgängerszene ergibt das zwischen 3,4 (Vorgänger `mondfinsternis`,
  0,0035 Tage/s) und 14,0 simulierten Tagen (Vorgänger `systemblick`, 30 Tage/s) statt der
  nominellen 3,5 – entsprechend zwischen 7,6 und 31,6 Saturnumdrehungen. Weitere Vereinfachungen:
  [Grenzen des Modells](thema:modell).

*Stand: September 2026*
