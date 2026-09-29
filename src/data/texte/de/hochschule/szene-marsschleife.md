# Szene: Marsschleife

Der [Mars](objekt:mars) läuft um seine Opposition eine Zeit lang rückwärts vor den Sternen, weil
die [Erde](objekt:earth) ihn auf der Innenbahn überholt.

## Was das Bild zeigt

Der Beobachter sitzt im Bahnpunkt der Erde, im Datensatz der Erde-Mond-Schwerpunkt, und blickt nach der Blende der ersten 2 s (siehe unten) fest in die Richtung, in der der Mars zur Mitte der Szene steht. Die Erdkugel wird nicht gezeichnet;
der Maßstab ist „Realistisch“, damit Richtungen und Winkelgrößen stimmen. Der senkrechte
Bildwinkel beträgt 30°, bei 16:9 also waagerecht 50,9°. Der Mars misst bei der Opposition 13,8″
und ist bei 1440 Pixel Bildhöhe (75″ je Pixel) nur eine beschriftete Markierung. Er hinterlässt
eine Spur der letzten 365 Tage, einen Stützpunkt je Tag, mit nach hinten auslaufender Deckkraft
(Kästchen „Planetenspuren (1 Jahr)“); dazu kommt die Ekliptik als Großkreis (Kästchen
„Ekliptik“). Beide Kästchen sind standardmäßig an.

Zu Beginn springt die Uhr auf 81 Tage vor die nächste Opposition nach der eingestellten Zeit, das
sind die 30 s bis zur Szenenmitte bei 2,7 Tagen je Sekunde. Gesucht wird die Längenopposition, also
der Vorzeichenwechsel der Längendifferenz zur Gegensonne, in Tagesschritten über 800 Tage, dann
durch Bisektion auf rund 9 s. Für jede Startzeit zwischen den Oppositionen vom 16. Januar 2025
(02:37) und vom 19. Februar 2027 (15:44) ergibt sich Letztere. Alle Zeiten sind Werte der
Modelluhr, die das Modell als TDB verwendet.

Die Opposition 2027 liegt bei 150,39° ekliptikaler Länge und 4,46° Breite in 0,678 AE Abstand. Der
Mars kehrt am 10. Januar um 13:36 bei 160,05° Länge (Breite 3,61°) um und läuft am 1. April um
13:09 bei 140,54° (Breite 3,21°) wieder vorwärts. Die Rückläufigkeit dauert 81,0 Tage und
überstreicht 19,5° Länge. Im nominellen Fenster der Szene, 81 Tage vor bis 81 Tage nach der Opposition, reicht der
Mars von 140,5° bis 160,0° Länge bei 1,8° bis 4,5° Breite. Auch Jupiter steht im Bild, bei rund
137° bis 147° Länge und 0,8° bis 1,1° Breite; seine Opposition liegt im Modell am 11. Februar 2027
um 01:06.

Der Zeitraffer gleitet in den ersten 2 s geometrisch vom Wert der vorigen Szene auf 2,7 Tage je
Sekunde. Die Opposition liegt deshalb nicht genau bei 30 s, sondern bei 30,7 s nach 1 Tag je
Sekunde, bei 23,6 s nach 30 Tagen je Sekunde und bei 31,7 s nach dem kleinsten Wert des Katalogs
(0,0035 Tage je Sekunde). Der Blick richtet sich auf den Mars zu einer Schätzung der Szenenmitte;
sie liegt je nach Vorgänger 4,6 Tage vor bis 17,3 Tage nach der Opposition, die Bildmitte bei
152,2° bis 144,1° Länge; während der Blende wandert der Blick dorthin, bis zu 6,3°. Die Rückläufigkeit bleibt dabei ganz im Bild, und die Szene endet 76 bis
98 Tage nach der Opposition.

## Hintergrund

Aus den Raten der mittleren Länge im Datensatz folgen die Umlaufzeiten
$T_\oplus = 365{,}256\,\mathrm{d}$ und $T_\mathrm{Mars} = 686{,}980\,\mathrm{d}$ und die
synodische Periode

$$\frac{1}{S} = \frac{1}{T_\oplus} - \frac{1}{T_\mathrm{Mars}}, \quad S = 779{,}94\,\mathrm{d}.$$

Die Oppositionen des Modells von 2022 bis 2029 folgen einander in 769,9, 764,5 und 764,7 Tagen,
10 bis 15 Tage unter dem Mittel.

Mit $(x, y)$ als Differenz der Ekliptikkomponenten der Orte von Mars und Erde,
$(\dot x, \dot y)$ als Differenz ihrer Geschwindigkeiten ändert sich die ekliptikale Länge des Mars
von der Erde aus mit

$$\dot\lambda = \frac{x\,\dot y - y\,\dot x}{x^2 + y^2}.$$

Negativ heißt rückläufig; die Stillstände sind die Nullstellen. Für koplanare Kreisbahnen ist die
Rate bei der Opposition
$\dot\lambda = (n_\mathrm{Mars} a_\mathrm{Mars} - n_\oplus a_\oplus)/(a_\mathrm{Mars} - a_\oplus)$.
Mit den Werten des Datensatzes ($n_\oplus = 0{,}9856$° und $n_\mathrm{Mars} = 0{,}5240$° je Tag,
$a_\mathrm{Mars} = 1{,}5237$ AE) sind das $-0{,}357$° je Tag; das Modell rechnet 2027 mit
$-0{,}399$° je Tag. Der Mars steht dann mit 1,665 AE Sonnenabstand nahe seinem Aphel
($a(1+e) = 1{,}666$ AE); die Kreisnäherung trifft nur die Größenordnung.

Die Breite folgt aus der Bahnneigung. Bei kleiner Neigung ist

$$\sin\beta = \frac{r}{\Delta}\,\sin i\,\sin u,$$

mit $r$ als Sonnenabstand des Mars, $\Delta$ als Abstand von der Erde und $u$ als Argument der
Breite (die Erde liegt in der Ebene). Bei der Opposition 2027 liegt der Mars von der Sonne aus
gesehen 1,81° nördlich der Ekliptik; mit $r/\Delta = 2{,}457$ ergibt das 4,46° Breite. Ob die
Rückläufigkeit eine geschlossene Schleife oder ein Zickzack zeichnet, hängt vom Breitenverlauf ab:
2027 steigt die Breite bis zum ersten Stillstand von 2,3° auf 3,6°, erreicht bei der Opposition
4,46° und fällt vom zweiten Stillstand (3,2°) bis zum Szenenende auf 1,8°. Im Modell kreuzt sich
die Bahn nirgends selbst (Polygonzug in Schritten von 0,25 Tagen): Es ist ein Zickzack, kein
geschlossener Knoten.

Die Deutung als Perspektive ist der geschichtliche Kern. Bis zum 2. Jahrhundert, als Ptolemäus
den Almagest verfasste, hatten Astronomen für die Rückläufigkeit Epizykel auf Deferenten
entwickelt. Kopernikus erklärte sie im Commentariolus als bloßen Schein der Erdbewegung, behielt
aber Epizykel auf den Deferenten bei ([Rabin 2023](quelle:sep-copernicus)).

## Modellgrenzen

- **Richtung:** An den fünf Stichtagen der Referenzwerte von JPL Horizons weicht die Richtung des
  Mars um 0,0002° bis 0,0043° ab (bis 16″). Gegen Horizons (geozentrisch, geometrisch, Erde aus DE441,
  [Park et al. 2021](literatur:park-2021)) zwischen November 2026 und Mai 2027
  sind es höchstens 0,0042°; die Stillstände weichen um +0,80 h und −0,94 h ab, die Opposition um 5 s (Horizons: 10. Januar 12:48, 1. April 14:06, 19. Februar 15:44). Jupiter weicht im Bild
  bis 0,036° (131″) ab. Ein Pixel entspricht 75″.
- **Erde-Mond-Schwerpunkt:** Der Beobachter sitzt nicht im Erdmittelpunkt, sondern 4672 km daneben;
  bei der Opposition macht das bis 9,5″ aus.
- **Lichtlaufzeit und Aberration:** Das Modell zeigt geometrische Richtungen. Bei der Opposition
  braucht das Licht 338 s; das verschiebt den Mars um 15″, die jährliche Aberration um 21″, beide
  zusammen in der ganzen Szene höchstens um 9″.
- **Bezugsrahmen:** Ekliptik und Frühlingspunkt sind fest bei J2000, Präzession fehlt. Das mittlere
  Äquinoktium ist bis 19. Februar 2027 nach $p_A = 0{,}02438175\,t + 0{,}00000538691\,t^2$ im
  Bogenmaß, mit $t = 0{,}2714$ Jahrhunderten, um 0,379° (1365″) gewandert
  ([Petit und Luzum 2010](literatur:petit-2010), Gl. 5.44); Koordinaten des Datums lägen um diesen
  Betrag höher, siehe [Bezugssysteme](thema:bezugssysteme).

Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
