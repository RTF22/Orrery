# Szene: Enceladus im hellen Glanz

Die Kamera umkreist [Enceladus](objekt:enceladus) nah und auf der sonnenzugewandten Seite – dem
Mond mit der höchsten gemessenen Albedo des Sonnensystems, dessen [Gezeitenheizung](thema:gezeiten)
über die Resonanz mit [Dione](objekt:dione) die im Hintergrund erwähnten Fontänen antreibt.
[Saturn](objekt:saturn) füllt im Hintergrund einen großen Teil des Bildes; die Begleitszene
[Titan im Dunst vor Saturn](szene:titan-dunst) zeigt denselben Planeten von einem größeren,
dunkleren Mond aus.

## Was das Bild zeigt

Der Bahntyp `orbit` hält die Kamera auf einer Kugel um Enceladus' Mittelpunkt: Radius 5 dargestellte
Enceladusradien (252 km) mal Streufaktor, Azimut fest bei 225,58° (Streuung ±20°, Rate 1,5°/s, macht
45° über 30 s), Elevation je Ziehung fest zwischen 2° und 18° (Basis 10°, Streuung additiv −8° bis
8°). Bei Streufaktor 0,8/1,0/1,5 liegt Enceladus' eigener Winkeldurchmesser bei 29,0°/23,1°/15,3°.

Der Azimut 225,58° ist die Sonnenrichtung von Saturn aus zur Epoche J2000 – nachgerechnet aus
Saturns Position über `positionAt` ergibt sich Azimut 225,579° und Elevation 2,307°, praktisch genau
der codierte Wert (225,58°/2,31°). Die Parallaxe zwischen „Richtung Saturn→Sonne" und „Richtung
Enceladus→Sonne" liegt bei $\arctan(238420/1{,}37\cdot10^{9})=0{,}01^\circ$ und damit unter jeder
Messgenauigkeit hier. Zur Szenenzeit trifft dieser feste Wert aber nicht mehr: Saturn wandert mit
seiner mittleren Bewegung von $360^\circ/29{,}4464\,\mathrm{a}=12{,}23^\circ$ je Jahr durch seine
Bahn, die eigene Nachrechnung ergibt zwischen J2000 und dem 21. September 2026 (26,72 Jahre) einen
aufgewickelten Versatz von 324,96° – gleichbedeutend mit einem Rest von 35,04°, um den die codierte
Sonnenrichtung der wahren vorauseilt. Daraus wächst der Phasenwinkel Sonne–Enceladus–Kamera an der
Grundeinstellung von 7,7° (Entwurfswert bei J2000, nahezu Vollicht) auf 35,6° (Stand 21.09.2026,
sichtbarer Sichelrand) – siehe „Modellgrenzen".

Saturns eigener Winkeldurchmesser von Enceladus aus beträgt
$2\arcsin(58232/238420)=28{,}3^\circ$, mehr als die Hälfte der Bildhöhe. Weil Enceladus
[gebunden](thema:gebundene-rotation) rotiert und die 30 Sekunden der Szene bei 0,05 Tagen/s 1,5
simulierte Tage sind, das sind 1,095 Umläufe (1,370218 Tage Umlaufzeit), dreht sich auch seine
Saturn zugewandte Seite einmal ganz um die feste Kamerarichtung: Der Winkel zwischen der Richtung
Enceladus→Saturn und der Richtung Enceladus→Kamera reicht über die Szene von 18° bis 165° – die
Kamera sieht also nacheinander praktisch jede Länge der Oberfläche, nicht nur eine feste Hemisphäre.

Weil Enceladus' Bahn (238 420 km) innerhalb der Schattenschwelle
$\arcsin(58232/238420)=14{,}14^\circ$ liegt und die Sonne am 21.09.2026 nur $7{,}54^\circ$ über
Saturns Ringebene steht (dieselbe Zahl wie bei [Ringe](thema:ringe)), quert Enceladus auf einem Bogen
von rund 24° seiner Bahn (6,7 %) Saturns vollen Kernschatten. Die Szene deckt mit 1,095 Umläufen mehr
als einen vollen Kreis ab, trifft diesen Bogen also in jeder Ziehung mindestens einmal – für rund
1,8 s Echtzeit (24° bei 0,05 Tagen/s) verdunkelt sich Enceladus dabei, weil `waehleOkkluder` Saturn
für seine Monde immer als ersten Okkluder einsetzt, dieselbe Geometrie wie bei
[Finsternissen](thema:finsternis) sonst.

## Hintergrund

Enceladus reflektiert bei 0,55 µm $1{,}24 \pm 0{,}01$ des einfallenden Lichts – die höchste
geometrische Albedo, die je im Sonnensystem gemessen wurde
([Buratti et al. 2022](literatur:buratti-2022)). Werte über 1 sind kein Widerspruch: Sie entstehen,
wenn ein Körper nahe Phasenwinkel null mehr Licht in Richtung des Beobachters zurückwirft, als eine
ideal diffuse, ebene Scheibe würde – ein steiler, schmaler Anstieg, den Hubble-Beobachtungen zwischen
0,26° und 6,4° Phasenwinkel zeigten und der am besten zu mäßigem Schattenverbergen mit schmaler
kohärenter Rückstreuung passt ([Verbiscer et al. 2005](literatur:verbiscer-2005)). Die Politur dafür
liefert Enceladus selbst: Seine Fontänen speisen Saturns E-Ring mit feinem Eisstaub, und die
Monde innerhalb dieses Rings tragen im Mittel ähnlich hohe geometrische Albedos, weil ihre
Oberflächen fortlaufend mit demselben frischen Frost bestäubt werden
([Verbiscer et al. 2007](literatur:verbiscer-2007)). Die Fontänen selbst, aus vier parallelen
Bruchzonen am Südpol, entdeckte Cassinis Kamera 2005 in stark rückwärtsbeleuchteten Aufnahmen bei
hohem Phasenwinkel – nur im Gegenlicht werden die feinen, wenige Mikrometer großen Teilchen hell
genug, um sich vom dunklen Himmel abzuheben ([Porco et al. 2006](literatur:porco-2006)). Die Kamera
dieser Szene zeigt davon wenig: Bei Elevationen zwischen 2° und 18° bleibt der Südpol mit seinen
Tigerstreifen meist außerhalb des Bildausschnitts.

## Modellgrenzen

- **Albedo statt Phasenfunktion:** Die Katalogalbedo steht auf 1,0 (das ältere NSSDC-Faktenblatt,
  nicht die neueren 1,24/0,89), die Texturkarte hat im Mittel nur 0,172 linear und wird mit dem
  Faktor 5,80 darauf normiert (gleiche Zahlen wie [Albedo und Helligkeit](thema:photometrie)); einen
  Oppositionseffekt oder eine Rückstreuspitze kennt das Modell nicht, nur Lambertsche Streuung.
- **Gedämpfte Helligkeit, nachgerechnet:** Bei Standardhelligkeit 1 belichtet die Kamera so, dass ein
  Ziel mit voller Albedo im hellsten Bildpunkt linear 1,0 erreicht ($\mathrm{uTag}=\pi$, Formel
  Albedo·uTag/π); nach der three-ACES-Kurve (Faktor $1/0{,}6$, RRTAndODTFit) und sRGB landet das bei
  226 von 255. Das Materialmodell selbst erreicht aber, ohne Glanz und Nachtseitenfüllung
  nachgerechnet, nur die geometrische Albedo $0{,}640\,p$ statt $p$ (Lambert-Kugel mal
  Fresnel-Faktor, dort hergeleitet) – für Enceladus also 0,64 statt
  1,0, was nach derselben Rechnung rund 209 von 255 ergibt. Die „insgesamt gedämpfte Helligkeit", die
  der Szenenkommentar in `scenes.ts` vermerkt, ist damit kein Fehler dieser Szene, sondern derselbe
  Effekt wie bei jedem Körper des Katalogs, nur bei Enceladus wegen seiner ungewöhnlich hohen realen
  Albedo am auffälligsten.
- **Keine Fontänen, kein E-Ring:** Der Renderer zeichnet weder die Wasserdampf-Eis-Fontänen noch den
  von ihnen gespeisten Ring; Enceladus erscheint als ruhige, texturierte Kugel.
- **Belichtung:** ohne `lookAtId` belichtet die Kamera auf Enceladus selbst (`exposureTargetId`,
  `render/exposure.ts`).
- **Saturn und Ring:** Kugel ohne Abplattung, Ring als Scheibe ohne Dicke – dieselben Vereinfachungen
  wie bei [Saturn](objekt:saturn) und [Ringe](thema:ringe).
- **Sonnenrichtung fest aus J2000:** Der Azimut 225,58° ist, wie oben nachgerechnet, seit dem Jahr
  2000 rund 35° hinter der tatsächlichen Sonnenrichtung zurückgeblieben – bei rund 12,2° Drift je
  Jahr eine Abweichung, die mit jedem weiteren Jahrzehnt wächst und den Phasenwinkel der Szene
  entsprechend verändert.
- **Zeitraffer:** er gleitet beim Szenenbeginn 2 s lang geometrisch auf 0,05 Tage/s
  (`RATE_BLEND_SEC`). Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
