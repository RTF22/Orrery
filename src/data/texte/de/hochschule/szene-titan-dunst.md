# Szene: Titan im Dunst vor Saturn

Die Kamera umkreist [Titan](objekt:titan) einmal fast ganz und zeigt ihn genau so, wie ihn jede
Kamera im sichtbaren Licht zeigen würde: als einheitlich orange Kugel, deren Oberfläche der Dunst
vollständig verbirgt – ähnlich der Wolkendecke der [Venus](objekt:venus), nur dass Titans Schleier
aus Photochemie statt aus Schwefelsäuretröpfchen besteht. [Saturn](objekt:saturn) zieht dabei mit
guter, aber nicht garantierter Chance durchs Bild; die Begleitszene
[Enceladus im hellen Glanz](szene:enceladus-hell) zeigt denselben Planeten aus der Nähe eines
kleineren, helleren Mondes.

## Was das Bild zeigt

Der Bahntyp `orbit` hält die Kamera auf einer Kugel um Titans Mittelpunkt: Radius 7 dargestellte
Titanradien (2575 km) mal Streufaktor, Azimut wandert mit 11°/s, die Elevation liegt je Ziehung fest
zwischen 5° und 25° (Basis 15°, Streuung additiv −10° bis 10°). Bei Streufaktor 0,8/1,0/1,5 liegt die
Kamera 14 420/18 025/27 038 km entfernt; Titans eigener Winkeldurchmesser
($2\arcsin(2575/d)$) schrumpft dabei von 20,6° auf 10,9°.

In 35 s legt der Azimut $11^\circ/\mathrm{s}\cdot 35\,\mathrm{s}=385^\circ$ zurück – mehr als einen vollen
Kreis. Ob Saturn dabei ins Bild gerät, hängt am Winkel zwischen der Blickrichtung Kamera→Titan und
der Richtung Titan→Saturn: Nachgerechnet über acht Bahnphasen, fünf Elevationen, vier Streufaktoren
und acht Azimut-Startwerte (1280 Kombinationen) liegt Saturn im Mittel nur rund 9 % der Szenenzeit im
Sichtfeld (25° Halbwinkel plus Saturns eigener Winkeldurchmesser als Kreis-Näherung an das
50°-Sichtfeld); in 41 % der Kombinationen erscheint er mindestens einmal, in 59 % gar nicht – „mit
guter Chance, aber nicht garantiert" trifft es also eher optimistisch. Saturns eigener
Winkeldurchmesser von Titan aus beträgt, mit der mittleren großen Halbachse (1 221 935 km) gerechnet,
$2\arcsin(58232/1221935)=5{,}46^\circ$; am 21. September 2026 steht Titan nahe seinem bahnfernsten Punkt,
dort nur 5,31°.

Über den vollen Azimutschwenk reicht der Phasenwinkel Sonne–Titan–Kamera von 12,6° (nahe Vollicht)
bis 162,6° (tiefe Sichel nahe Neulicht) – der Terminator wandert dabei einmal über die ganze sichtbare
Scheibe. Die Szene rafft 10,5 simulierte Tage (35 s bei 0,3 Tagen/s), das sind 0,66 Titanumläufe
(237° Bahnwinkel); weil Titan [gebunden](thema:gebundene-rotation) rotiert, dreht er sich um denselben
Winkel um seine eigene Achse.

Von Titan aus erscheinen Saturns Ringe fast exakt von der Kante: Weil Titans Bahn nur 0,36° gegen
Saturns Äquator geneigt ist, liegt die Blickrichtung Titan→Saturn ebenso nah an der Ringebene – am
21. September 2026 bei −0,12°, über den vollen Umlauf zwischen −0,36° und 0,36°. Der Ring selbst
spannte sich, wäre er sichtbar, über rund $2\arctan(136780/1221935)=12{,}8^\circ$ des Himmels auf, als
hauchdünner Strich.

## Hintergrund

Voyager 1 sah Titan im November 1980 als „featureless orange world": Der Dunst verbarg die Oberfläche
vollständig, sichtbar blieben nur ein Nord-Süd-Helligkeitskontrast und eine dunkle Polkappe
([Smith et al. 1981](literatur:smith-1981)). Cassini löste 2004 erstmals eine abgesetzte Dunstschicht
in rund 500 km Höhe auf, 150 bis 200 km höher als die von Voyager beobachtete
([Porco et al. 2005](literatur:porco-2005)); diese Schicht ist nicht ortsfest, sondern folgt Titans
29,5-jährigem Jahreszeitenzyklus: Zwischen 2007 und 2010 sank sie von über 500 auf nur noch 380 km,
weil sich um die Tagundnachtgleiche 2009 die polübergreifende Zirkulationszelle abschwächte
([West et al. 2011](literatur:west-2011)). Sonnenlicht und Saturns Magnetosphäre bauen aus Methan und
Stickstoff in der Hochatmosphäre schrittweise größere organische Moleküle auf, die schließlich als
feste, orangebraune Tholine kondensieren und absinken – Photochemie und Aufbau dieser Schichten fasst
eine aktuelle Übersicht zusammen ([Hörst 2017](literatur:hoerst-2017);
[Nixon 2024](literatur:nixon-2024)). Kleine Teilchen wie die des Dunstes streuen Licht bevorzugt
vorwärts; Cassinis Aufnahmen der Titan-Nachtseite im Gegenlicht zeigen deshalb einen hell
aufleuchtenden Rand, denselben optischen Effekt, den [Albedo und Helligkeit](thema:photometrie) auch
für Saturns Ringe beschreibt. Von der Oberfläche aus stünde Saturn, mit 5,5° Winkeldurchmesser gut
zehnmal so groß wie der Vollmond am Erdhimmel, praktisch unbeweglich über dem Dunst – zu sehen wäre
davon nichts. Die einzigen Bilder, die je durch den Dunst bis zur Oberfläche drangen, stammen von der
Sonde Huygens auf ihrem Abstieg am 14. Januar 2005
([Tomasko et al. 2005](literatur:tomasko-2005)).

## Modellgrenzen

- **Keine Atmosphäre im Renderer:** Titan zeigt eine aus Cassini-RADAR- und Infrarotaufnahmen
  zusammengesetzte Oberflächenkarte (`ASSETS.md`), die real unter dem hier beschriebenen Dunst
  verborgen ist; kein Randleuchten, keine Vorwärtsstreuung – nur Saturns Ring trägt in
  `render/rings.ts` einen solchen Term, Titan als Kugel nicht. Die Albedo 0,22 (die geometrische
  Albedo des realen Dunstes) wird auf diese Oberflächenkarte angewandt, die nicht der Dunst ist.
- **Belichtung:** ohne `lookAtId` belichtet die Kamera auf Titan selbst (`exposureTargetId`,
  `render/exposure.ts`).
- **Saturn:** Kugel ohne Abplattung, Ring als Scheibe ohne Dicke – dieselben Vereinfachungen wie bei
  [Saturn](objekt:saturn) selbst.
- **Zeitraffer:** er gleitet beim Szenenbeginn 2 s lang geometrisch auf 0,3 Tage/s
  (`RATE_BLEND_SEC`).
- **Saturn im Bild:** Der Szenenkommentar nennt es „nicht garantiert" – die eigene Nachrechnung oben
  beziffert das: rund 9 % der Szenenzeit im Mittel, in weniger als der Hälfte der Ziehungen überhaupt
  einmal. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
