# Szene: Das System von oben

Die Kamera steht weit oberhalb der Ekliptik über der ruhenden [Sonne](objekt:sun), blickt auf sie
herab und umkreist sie langsam, während die Zeit im Zeitraffer läuft. Anders als die Nah- und
Vorbeiflüge der übrigen Kinoszenen zeigt dieser Bahntyp keinen einzelnen Körper, sondern die
Architektur des ganzen [Sonnensystems](thema:sonnensystem) auf einen Blick — mit allen
Vereinfachungen, die ein Modell dafür braucht.

## Was das Bild zeigt

Bahntyp `system` (`src/render/camera/cinema.ts`), Zielkörper die Sonne, Abstandsbasis
`systemRadius`: Der Bezugsradius ist der komprimierte Abstand des äußersten *Planeten*
[Neptun](objekt:neptune) (`AEUSSERSTER_PLANET`, `src/render/camera/cinema.ts`) — Zwergplaneten zählen bewusst nicht mit,
Eris' Bahn reicht mit $e=0{,}438$ und $a=67{,}934\,\mathrm{AU}$ im Aphel auf rund
$97{,}7\,\mathrm{AU}$ (Herleitung aus $a(1+e)$) und würde den Maßstab unverhältnismäßig aufblähen.
Mit Neptuns Halbachse 30,07 AE ([Grenzen des Modells](thema:modell)) ergeben sich die
Systemradien und, bei 1,6-facher Radien mal Streufaktor, folgende Kameraabstände:

| Voreinstellung | Systemradius | Kameraabstand (Faktor 0,85–1,25) |
|---|---|---|
| Realistisch | 30,07 AE | 40,90–60,14 AE (48,11 AE bei Faktor 1, rund 7,20 Milliarden km) |
| Schaubild | 7,71 AE | 10,48–15,41 AE (12,33 AE) |
| Kompakt | 3,90 AE | 5,31–7,80 AE (6,24 AE) |

Die tatsächliche, komprimierte Neptunentfernung schwankt wegen seiner geringen Exzentrizität
($e=0{,}0086$) um höchstens rund 1 % um diesen Halbachsenwert (eigene Nachrechnung mit
`systemRadiusKm`).

Elevation und Streufaktor werden je Szenendurchlauf einmal gezogen und bleiben dann fest, nur der
Azimut dreht mit $0{,}9^\circ/\mathrm{s}$ weiter: Basis $78^\circ$ mit Versatz $-25^\circ$ bis
$+10^\circ$ ergibt eine Elevation zwischen $53^\circ$ und $88^\circ$ (eigene Stichprobe über 5000
Ziehungen: $53{,}0^\circ$ bis $87{,}8^\circ$), der Streufaktor liegt zwischen 0,85 und 1,25; in
60 s dreht die Kamera exakt $54^\circ$ weiter ($0{,}9^\circ/\mathrm{s}\times 60\,\mathrm{s}$).

Das vertikale Sichtfeld misst $50^\circ$ (`KAMERA_FOV_GRAD`), der Halbwinkel also $25^\circ$. Für
einen Punkt auf einer Kreisbahn vom Radius $\rho$ (in Einheiten des Systemradius) ergibt die
Projektion auf die Bildvertikale bei Kameraabstand $D=1{,}6\cdot f$ (mit $f$ dem Streufaktor) und
Elevation $e$
einen nahseitigen Winkel $\arctan(\rho\sin e/(D-\rho\cos e))$ und einen fernseitigen
$\arctan(\rho\sin e/(D+\rho\cos e))$ (Herleitung, camera.lookAt-Ebene). Für Neptuns
eigene Bahn ($\rho=1$) summieren sich beide je nach Ziehung zu $46{,}8^\circ$ (Elevation $53^\circ$,
Faktor 1,25) bis $72{,}6^\circ$ (Elevation $88^\circ$, Faktor 0,85); weil Nah- und Fernpunkt aber
nicht symmetrisch zur Bildmitte liegen, entscheidet nicht diese Summe, sondern der einzelne
Nahpunktwinkel gegen den Halbwinkel $25^\circ$. Danach aufgelöst ergibt sich eine Passschwelle von
rund 59 % (engste Ziehung) bis 92 % (weiteste Ziehung) des Systemradius, ab der eine Kreisbahn
vollständig im Rahmen bleibt; da Neptuns eigener Bahnradius ($\rho=1$) darüber liegt, passt seine
Bahn in keiner Ziehung vollständig ins Bild. Uranus (64–84 % des Systemradius, je nach
Voreinstellung) liegt damit teils im Bild, teils über dem Rand, die vier inneren Planeten (bis
30,3 % unter „Kompakt", größter Wert Mars) bleiben immer sicher innerhalb.

Als Scheiben lösen sich die inneren Planeten dabei nicht auf: Bei 1440 Bildpunkten Höhe und
Faktor 1 misst die Erde, der größte der vier, unter „Realistisch" 0,0014, unter „Schaubild" 0,267
und unter „Kompakt" 2,11 Bildpunkte Radius (`apparentRadiusPixels`, `src/render/labels.ts`);
selbst bei der nächsten möglichen Ziehung (Faktor 0,85, „Kompakt") bleiben es rund 2,5
Bildpunkte, unter der Schwelle von 3, ab der ein Körper als echte Kugel statt als Ersatzglyphe
erscheint (`MARKER_MIN_PIXEL`). Merkur, Venus und Mars sind noch kleiner — die inneren Planeten
erscheinen hier in jedem Preset und jeder Ziehung nur als Marker.

Ohne eigenes Blickziel belichtet die Kamera auf den Zielkörper der Szene, hier die Sonne
(`blickzielVon`); weil ihr dargestellter Abstand im Ursprung null ist, liefert `targetExposure`
unabhängig von Voreinstellung und Bildreglern exakt $\pi$ (`src/render/lighting.ts`,
`src/render/exposure.ts`) — denselben Bezugswert wie eine Kamera, die bei 1 AE auf eine
Lambert-Fläche mit `brightness = 1` belichtet.

Bei 30 Tagen je Sekunde vergehen in 60 s genau 1800 simulierte Tage, knapp 4,93 Jahre. Aus den
mittleren Bewegungen des Datensatzes (`LDot`, `src/data/bodies/*.ts`) folgen daraus 20,46 Umläufe
für [Merkur](objekt:mercury) (87,97 d), 8,01 für Venus (224,70 d), 4,93 für die
[Erde](objekt:earth) (365,26 d), 2,62 für Mars
(686,98 d), 0,415 für Jupiter (11,86 a), 0,167 für Saturn (29,45 a), 0,059 für Uranus (84,02 a)
und 0,0299 für Neptun (164,79 a) — die Angaben „rund zwanzig", „knapp fünf", „zwei Fünftel" und
„3 %" der Gymnasialfassung dieser Szene treffen die nachgerechneten Werte.

## Hintergrund

Die Umlaufzeiten folgen aus dem dritten Keplerschen Gesetz für das Zweikörperproblem
([Bahnelemente](thema:bahnelemente)):

$$T^2 = \frac{4\pi^2 a^3}{G\,(M_\odot + m)}$$

mit dem nominellen solaren Massenparameter $GM_\odot = 1{,}3271244\cdot10^{20}\,\mathrm{m^3\,s^{-2}}$
nach IAU-Resolution B3 ([Prša et al. 2016](literatur:prsa-2016)). Für eine Kreisbahn folgt daraus
die Bahngeschwindigkeit $v=\sqrt{GM_\odot/a}$: Merkur läuft mit 47,87 km/s, die Erde mit
29,78 km/s und Neptun mit 5,43 km/s — die Gymnasialfassung nennt „knapp 30 km/s" für die Erde und
„gut 5 km/s" für Neptun, beides bestätigt.

Von Norden gesehen umlaufen alle acht Planeten die Sonne im selben, prograden Sinn, ihre
Bahnneigungen gegen die Ekliptik bleiben klein, zwischen $0{,}77^\circ$ (Uranus) und $7{,}00^\circ$
(Merkur) — beides ein Erbe der rotierenden protoplanetaren Scheibe, aus der sie entstanden
([Entstehung des Sonnensystems](thema:entstehung)). Massenverteilung und Architektur, die diese
Draufsicht zusammenfasst, beschreibt [Das Sonnensystem](thema:sonnensystem) im Einzelnen.

Die Sonne selbst ruht in diesem Bild nicht wirklich: Mit den Positionen und Massen aus Orrerys
Datensätzen lag ihr Mittelpunkt 1800 bis 2050 zwischen 0,06 und 2,11 Sonnenradien vom Schwerpunkt
des Sonnensystems entfernt, im Mittel 1,21 Sonnenradien, davon 1,07 allein durch
[Jupiter](objekt:jupiter) verschoben (Zahlen wie [Sonne](objekt:sun)).

## Modellgrenzen

Die Kamera zeigt die Planeten um eine im Ursprung ruhende Sonne, nicht um den tatsächlichen,
wandernden Schwerpunkt (oben, wie [Grenzen des Modells](thema:modell) allgemein beschreibt);
Abstände sind je Voreinstellung unterschiedlich stark gestaucht und Körper vergrößert, nach der
Formel aus „Grenzen des Modells" ([Das Sonnensystem](thema:sonnensystem) nennt die Werte). Der
Systemradius schließt, wie oben hergeleitet, alle Zwergplaneten aus, obwohl mehrere von ihnen den Katalog
verlassen und im Bild theoretisch weiter draußen stünden als Neptun. Asteroiden- und Kuipergürtel
erscheinen, sofern im Sichtkegel, nur als synthetische Punktwolken ohne individuelle Bahnen. Jeder
Körper wird, wie im ganzen Programm, ungestört auf seiner Kepler-Ellipse fortgeschrieben — echte
gegenseitige Störungen der Planeten fehlen ([Bahnelemente](thema:bahnelemente)).

*Stand: September 2026*
