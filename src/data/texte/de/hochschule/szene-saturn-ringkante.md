# Szene: Saturns Ringe von der Kante

Die Kamera steht fest in der Ekliptik, genau in der Richtung, in der [die Ringe](thema:ringe) diese
Ebene schneiden, und blickt von dort auf [Saturn](objekt:saturn). Weil die Ringe im Modell eine
unendlich dünne Scheibe sind, verschwinden sie an dieser Stelle fast vollständig – wie beim
[Streiflicht](szene:saturn-streiflicht) hängt auch hier alles am Blickwinkel, nur enger begrenzt.

## Was das Bild zeigt

Der Bahntyp `static` hält die Kamera reglos auf einer Kugel um Saturn
(`render/camera/cinema.ts`): Radius 8 dargestellte Saturnradien (58 232 km) mal Streufaktor, Azimut
fest bei 169,53°, Elevation je Ziehung fest zwischen −1,5° und 1,5°. Beim Streufaktor 0,8/1,0/1,5
liegt die Kamera 372 685/465 856/698 784 km entfernt; Saturns Winkeldurchmesser schrumpft dabei von
17,98° auf 9,56°.

Der Azimut 169,53° ist keine willkürliche Zahl: Saturns Pol (`poleVector`, 40,589°/83,537°) liegt
ekliptikal bei Länge 79,53° ([Bezugssysteme](thema:bezugssysteme)); die Ringebene schneidet die
Ekliptik dort, wo die Azimutrichtung senkrecht auf der horizontalen Polprojektion steht, also bei
79,53° ± 90° = 169,53° oder 349,53°. Weil der Pol im Datensatz zeitlich fest ist, gilt dieser Wert
für jeden simulierten Zeitpunkt exakt – eine eigene Nachrechnung trifft die im Katalog hinterlegten
169,53° auf 0,003° genau.

Bei exakt 0° Elevation liegt die Kamera in der Ringebene selbst (Blickwinkel
$B=\arcsin(\hat{d}\cdot\hat{n})<0{,}001^\circ$) – der Ring ist dann, wie im Modell vorgesehen, eine
reine Linie ohne Fläche. Erst die Elevationsstreuung öffnet ihn: Bei ±1,5° ergibt dieselbe Rechnung
$B=\pm1{,}32^\circ$ (die Näherung $B\approx\arcsin(\sin(1{,}5^\circ)\cos i)$ mit $i=28{,}05^\circ$,
der Achsneigung gegen die Ekliptiknormale, trifft das auf 0,001° genau). Die scheinbare Ringdicke – Außendurchmesser
(273 560 km) mal $\sin B$, geteilt durch den Kameraabstand – liegt bei Faktor 1 dann bei
0,78° = 22 Bildpunkten (Annahme: Bildhöhe 1440 px, Sichtfeld 50°, `KAMERA_FOV_GRAD`); bei Faktor 0,8
wächst sie auf 28 Bildpunkte, bei Faktor 1,5 schrumpft sie auf 15. Schon 0,068° Elevation genügen
rechnerisch für einen einzelnen Bildpunkt – vollständig unsichtbar ist der Ring damit nur in einem
verschwindend engen Elevationsfenster um 0°.

Saturns Sonnenhöhe über der Ringebene liegt am 21.09.2026 bei −7,5°
([Ringe](thema:ringe); [Albedo und Helligkeit](thema:photometrie)); die Kante liegt damit auf der
unbeleuchteten Seite des Rings, ein weiterer Grund für wenig zurückkommendes Licht.

In den 6 simulierten Tagen der Szene (30 s bei 0,2 Tagen/s) durchläuft
[Mimas](objekt:mimas) 6,4 Umläufe (Periode 0,942 d), Enceladus 4,4 (1,370 d), Tethys 3,2 (1,888 d),
Dione 2,2 (2,737 d) und Rhea 1,3 (4,518 d); alle fünf ziehen, wie beim realen Vorbild, auf der Linie
der Ringe hin und her. Anders als bei den drei inneren Monden liegt Diones Bahnradius (6,49
Saturnradien) und vor allem Rheas (9,05) in der Größenordnung des Kameraabstands selbst (6,4 bis 12
Radien) – unterhalb von Faktor 1,13 steht die Kamera sogar näher an Saturn als Rhea auf ihrer Bahn.

## Hintergrund

Ringebenendurchgänge der [Erde](objekt:earth) – 1995/96 gleich dreifach, 2009 und zuletzt am 23. März
2025 ([Saturn](objekt:saturn)) – sind seltene Gelegenheiten für die Forschung. 1995/96 nutzte das
Hubble-Weltraumteleskop sie für spektroskopische Sternbedeckungen, die den F-Ring auf 1,2 bis 1,5 km
Dicke eingrenzten und den E-Ring bis auf rund 15 000 km Abstand verfolgten
([Nicholson et al. 1996](literatur:nicholson-1996)). Ringebenendurchgänge boten historisch auch
günstige Bedingungen, um besonders lichtschwache Objekte zu entdecken: 1966 identifizierte Audouin
Dollfus dabei einen zehnten Saturnmond, der sich erst später als zwei Körper auf nahezu identischer
Bahn – Janus und Epimetheus – herausstellte; die widersprüchlichen Beobachtungen mehrerer
vermeintlicher Monde aus dieser Zeit wertete eine spätere Untersuchung erneut aus
([Aksnes und Franklin 1978](literatur:aksnes-1978)). Nahe der Tagundnachtgleiche Saturns im August
2009 warfen senkrechte, bis zu 3,5 km hohe Strukturen am Außenrand des B-Rings erstmals messbare
Schatten – ein Indiz für dort eingebettete, sonst unsichtbar kleine Monde
([Spitale und Porco 2010](literatur:spitale-2010)). Die Bestimmung der Ringdicke selbst stützt sich
auf Kantenhelligkeit und solche Bedeckungen; für die dichten Hauptringe ergibt sich ein Meter- bis
Zehnermeterbereich (gleich [Ringe](thema:ringe), Abschnitt „Teilchen, Dicke und
Selbstgravitationswellen").

## Modellgrenzen

- **Scheibe ohne Dicke:** verschwindet bei exakt 0° Elevation vollständig; real sind die Hauptringe
  nur rund zehn Meter dick, aber nicht null – ein Beobachter an dieser Stelle sähe deshalb, anders
  als im Modell, noch einen hauchdünnen Streifen, dazu den weit dickeren, exzentrischen F-Ring (1,2
  bis 1,5 km) und die bis zu 3,5 km hohen Randstrukturen des B-Rings.
- **Fehlender E- und F-Ring:** nur die Hauptringe (74 658 bis 136 780 km) sind dargestellt.
- **Vorwärtsstreuung, Belichtung:** dieselben Werte wie bei
  [Saturn im Streiflicht](szene:saturn-streiflicht); ohne `lookAtId` belichtet die Kamera auf Saturn
  selbst (`exposureTargetId`).
- **Kein Mondschatten auf dem Ring:** Für die Ringscheibe selbst setzt der Code ausschließlich
  Saturn als möglichen Schattenwerfer an (`render/rings.ts`, `uPlanetOkkluder`; `render/shadows.ts`,
  Entwurf „Ringe: nur der Planet") – keiner der sieben Saturnmonde kann im Modell einen Schatten auf
  den Ring werfen, anders als auf Saturn selbst oder auf andere Monde. Die allgemeine
  Schattenrechnung beschreibt [Finsternisse](thema:finsternis).
- **Feste Ausrichtung ohne Präzession:** `poleVector` ist zeitlich konstant, Saturns reale, sehr
  langsame Poldrift bleibt deshalb im gesamten Zeitbereich der Simulation ohne Wirkung – ein im
  Modell unbeabsichtigter, praktisch aber folgenloser Unterschied zur Wirklichkeit. Weitere
  Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
