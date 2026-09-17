# Bahnresonanzen

Bahnresonanzen verbinden Körper, die denselben Zentralkörper mit mittleren Bewegungen im Verhältnis
kleiner ganzer Zahlen umlaufen ([Peale 1976](literatur:peale-1976)). Wirken die periodischen Störungen
immer wieder an derselben Stelle der Bahn, summieren sie sich oder heben sich gegenseitig auf; so
stabilisieren Resonanzen Bahnen wie die Plutos oder leeren Bereiche wie die Kirkwood-Lücken
([Bahnresonanz](quelle:wikipedia-de-bahnresonanz)). Dieser Text behandelt Mittelbewegungsresonanzen,
die Laplace-Resonanz, Neptun und Pluto, säkulare Resonanzen, den Einfang durch Migration und die
Saturnmonde und ordnet ein, was Orrery davon zeigt. Die Kopplung von Rotation und Umlauf behandelt
[Gezeiten und Roche-Grenze](thema:gezeiten).

## Resonanter Winkel

Umlaufen ein innerer Körper (Index 1) und ein äußerer (Index 2) den Zentralkörper nahe dem
Umlaufzeitverhältnis $P_2/P_1 = p/(p - q)$, beschreibt die Dynamik der resonante Winkel
([Tamayo und Hadden 2025](literatur:tamayo-2025), Gl. 3 und 4)

$$\varphi = p\,\lambda_2 - (p - q)\,\lambda_1 - q\,\varpi$$

mit den mittleren Längen $\lambda$ und der Perizentrumslänge $\varpi$ eines der Körper
([Bahnelemente](thema:bahnelemente)). Die ganze Zahl $q$ ist die Ordnung der Resonanz. Die
Koeffizienten summieren sich zu null, denn eine Drehung des Koordinatensystems darf $\varphi$ nicht
ändern; statt $\varpi$ können auch die Perizentrumslänge des anderen Körpers oder Paare von
Knotenlängen $\Omega$ stehen. Bei einer Konjunktion, $\lambda_1 = \lambda_2$, ist
$\varphi/q = \lambda_1 - \varpi$: Bleibt $\varphi$ fest, finden die Konjunktionen immer am selben Ort
relativ zum Perizentrum statt. Resonanzen höherer Ordnung sind schwächer, weil sich die Wirkungen der
$q$ Konjunktionen je Zyklus teilweise aufheben ([Tamayo und Hadden 2025](literatur:tamayo-2025)).

## Libration, Zirkulation und Resonanzbreite

Nahe der exakten Kommensurabilität verhält sich $\varphi$ in erster Näherung wie ein Pendel
([Murray und Dermott 2000](literatur:murray-2000), Kapitel 8):

$$\ddot{\varphi} = -\omega_0^2 \sin(\varphi - \varphi_0), \quad E = \frac{\dot{\varphi}^2}{2} + \omega_0^2\,[1 - \cos(\varphi - \varphi_0)]$$

Für $E < 2\omega_0^2$ pendelt $\varphi$ um das Zentrum $\varphi_0$ (Libration), für $E > 2\omega_0^2$
läuft es um (Zirkulation); dazwischen liegt die Separatrix. Für eng benachbarte Bahnen fassen Tamayo
und Hadden Frequenz und Breite für alle Resonanzen gleicher Ordnung zusammen
([Tamayo und Hadden 2025](literatur:tamayo-2025), Gl. 8, 10 und 11):

$$\omega_0 = \frac{q\,A_q\,n}{e_\mathrm{c}} \sqrt{\mu\,\tilde{e}^{q}}, \quad \Delta_\mathrm{max} = 3\,A_q \sqrt{\mu\,\tilde{e}^{q}}, \quad \tilde{e} = \frac{e}{e_\mathrm{c}}, \quad e_\mathrm{c} \approx \frac{2q}{3p}$$

Dabei ist $\Delta$ die relative Abweichung des Umlaufzeitverhältnisses vom resonanten Wert, $\mu$ das
Verhältnis der Massensumme beider Körper zur Zentralmasse, $e$ die Exzentrizität (bei zwei massiven
Körpern die relative), $e_\mathrm{c}$ die Exzentrizität, bei der sich die Bahnen kreuzen, und $A_q$ ein
Faktor von 0,845, 0,754 und 0,748 für die Ordnungen 1 bis 3. Die Breite wächst also mit der Wurzel aus
Masse und $e^q$. Das Pendelmodell setzt $e$ als fest voraus und versagt für fast kreisförmige Bahnen;
dort braucht es das zweite Fundamentalmodell der Resonanz. Überlappen benachbarte Resonanzen, wird die
Bewegung chaotisch ([Tamayo und Hadden 2025](literatur:tamayo-2025), Abschnitte 3.2 und 5.6).

Nicht jeder schwingende Winkel bedeutet Libration im strengen Sinn. Unter den Resonanzen der
Satelliten besitzen nur Mimas–Tethys und Titan–Hyperion eine Separatrix, und nur ihre Winkel librieren
mit großen Amplituden, die als Überbleibsel aus der Zeit des Einfangs gelten. Io–Europa, Europa–Ganymed
und Enceladus–Dione liegen dafür zu weit von der exakten Resonanz
([Luan und Goldreich 2017](literatur:luan-2017)). Ihre Winkel schwingen zwar, doch im Phasenraum
umlaufen die Bahnen ein verschobenes Zentrum, ohne von einer Separatrix eingeschlossen zu sein
([Lari und Saillenfest 2024](literatur:lari-2024)).

## Laplace-Resonanz von Io, Europa und Ganymed

[Io](objekt:io), [Europa](objekt:europa) und [Ganymed](objekt:ganymede) erfüllen im zeitlichen
Mittel ([Yoder und Peale 1981](literatur:yoder-1981))

$$n_1 - 3n_2 + 2n_3 = 0, \quad \varphi_\mathrm{L} = \lambda_1 - 3\lambda_2 + 2\lambda_3 = 180^\circ$$

Dazu kommen drei Zweikörperwinkel ([Yoder und Peale 1981](literatur:yoder-1981)):

$$\lambda_1 - 2\lambda_2 + \varpi_1 = 0^\circ, \quad \lambda_1 - 2\lambda_2 + \varpi_2 = 180^\circ, \quad \lambda_2 - 2\lambda_3 + \varpi_2 = 0^\circ$$

Konjunktionen von Io und Europa fallen danach auf Ios Perijovum und Europas Apojovum, Konjunktionen von
Europa und Ganymed auf Europas Perijovum. Weil $\varphi_\mathrm{L}$ bei 180° liegt, stehen nie alle drei
Monde in Konjunktion ([Paita et al. 2018](literatur:paita-2018)). Die Perijoven von Io und Europa
folgen den Konjunktionslinien und laufen rückwärts
([Yoder und Peale 1981](literatur:yoder-1981)):

$$\dot{\varpi}_1 = \dot{\varpi}_2 = -(n_1 - 2n_2) \approx -0{,}7395^\circ\,\mathrm{d}^{-1}$$

Die beiden Differenzen $n_1 - 2n_2$ und $n_2 - 2n_3$ betragen in der Theorie von Brown (1977)
0,7395507361° und 0,7395507301° je Tag ([Paita et al. 2018](literatur:paita-2018)). Die erzwungene
Exzentrizität Ios von 0,0041 speist seine Gezeitenheizung; oberhalb von $e_1 = 0{,}012$ wäre die
Laplace-Beziehung instabil ([Yoder und Peale 1981](literatur:yoder-1981)). Die Ephemeride E5 führt eine
freie Libration von $\varphi_\mathrm{L}$ mit 0,064° Amplitude und 2071 Tagen Periode
([Lieske 1998](literatur:lieske-1998)); eine gefilterte Auswertung der SPICE-Ephemeriden über
100 Jahre ergab bei einer Periode knapp über 2000 Tagen nur etwa 0,02°
([Paita et al. 2018](literatur:paita-2018)). Wie Gezeiten Ios Bahn und Wärmehaushalt heute verändern,
beschreibt [Gezeiten und Roche-Grenze](thema:gezeiten).

## Neptun und Pluto

[Pluto](objekt:pluto) umläuft die Sonne im Mittel zweimal, während [Neptun](objekt:neptune) sie
dreimal umläuft. Plutos Periheldistanz liegt innerhalb der Neptunbahn, trotzdem kommen sich beide nicht
nahe. Der Winkel

$$\varphi_\mathrm{P} = 3\lambda_\mathrm{P} - 2\lambda_\mathrm{N} - \varpi_\mathrm{P}$$

libriert um 180° mit einer Amplitude von etwa 76° und einer Periode von etwa 19 670 Jahren; in einer
Integration der fünf äußeren Planeten über 120 000 Jahre kamen sich Pluto und Neptun nie näher als
18 AE ([Cohen und Hubbard 1965](literatur:cohen-1965)). Eine Integration über 4,5 Millionen Jahre
bestätigte die Libration mit einer mittleren Periode von 19 951 Jahren und fand zusätzlich, dass Plutos
Perihelargument $\omega$ mit 24° Amplitude und 3,955 Millionen Jahren Periode um 90° libriert; beides
vergrößert den Mindestabstand ([Williams und Benson 1971](literatur:williams-1971)). Weil
$\varphi_\mathrm{P}$ um 180° pendelt, finden Konjunktionen um das Aphel statt, und weil $\omega$ um 90°
pendelt, liegt das Perihel fern der Ekliptik. Die Perihellänge resonanter Objekte pendelt um einen
Punkt 90° von Neptuns mittlerer Länge entfernt, und für stabile Bahnen bleibt die Amplitude von
$\varphi_\mathrm{P}$ unter etwa 90° ([Malhotra 1995](literatur:malhotra-1995)). So sind Pluto und die
übrigen Plutinos durch ihre Phase vor nahen Begegnungen mit Neptun geschützt
([Nesvorný 2018](literatur:nesvorny-2018)).

## Säkulare Resonanzen und Kirkwood-Lücken

Säkulare Resonanzen koppeln nicht die Umläufe, sondern die Präzession von Perihel oder Knoten
([Bahnresonanz](quelle:wikipedia-de-bahnresonanz)). Im Asteroidengürtel ist besonders
$\nu_6 = g - g_6$ wichtig, mit der Frequenz $g$, mit der die Perihellänge des Asteroiden wandert, und
der entsprechenden Frequenz $g_6$ Saturns. Wo $\nu_6$ gegen null geht, wächst die Exzentrizität, bis die
Asteroiden den Mars kreuzen; die Resonanz begrenzt den Gürtel innen bei etwa 2 AE und zur Seite bei etwa
20° Neigung ([Orbital resonance, englische Wikipedia](quelle:wikipedia-en-orbital-resonance)).
Zusammen mit $\nu_{16}$ ($s = s_6$, für die Knoten) liegt sie für geringe Neigungen bei etwa 2 AE
([Nesvorný 2018](literatur:nesvorny-2018)).

Die [Kirkwood-Lücken](thema:kirkwood-luecken) liegen dagegen an Mittelbewegungsresonanzen mit Jupiter,
nach dem dritten Keplerschen Gesetz für $P_\mathrm{J}/P = p/(p - q)$ bei

$$a = a_\mathrm{J} \left( \frac{p - q}{p} \right)^{2/3}$$

mit der großen Halbachse Jupiters von 5,203 AE also für 3:1, 5:2, 7:3 und 2:1 bei 2,50, 2,82, 2,96
und 3,28 AE. Diese Resonanzen verstärken die Schwankungen der Exzentrizität
([Nesvorný 2018](literatur:nesvorny-2018)). Warum sie Lücken erzeugen, zeigte Wisdom für 3:1:
Testasteroiden laufen dort bis zu einer Million Jahre mit $e < 0{,}1$ und springen dann auf
$e > 0{,}3$, wo sie den Mars kreuzen können. Die Bewegung ist chaotisch, und der äußere Rand der
chaotischen Zone fällt im Rahmen der Bahnfehler mit dem Rand der beobachteten Lücke zusammen
([Wisdom 1983](literatur:wisdom-1983)). Körper, die in Resonanzen des Hauptgürtels geraten, überleben
dort typischerweise nur wenige Millionen Jahre; die meisten stürzen in die Sonne oder erreichen
jupiterkreuzende Bahnen ([Gladman et al. 1997](literatur:gladman-1997)). Nicht jede Resonanz leert
ihren Bereich: Die Hilda-Asteroiden sitzen in der 3:2-Resonanz ([Nesvorný 2018](literatur:nesvorny-2018)).

## Resonanzeinfang durch Migration

Ein Paar gerät dauerhaft in Resonanz, wenn sich seine Bahnen langsam aufeinander zu bewegen. Für den
Einfang in 2:1 kommt es dabei kaum auf Rate und Form der Migration an, sondern darauf, dass die Bahnen
konvergieren, solange die Migration nicht unvernünftig schnell ist
([Peale und Lee 2002](literatur:peale-2002)). Auch die Resonanzen Mimas–Tethys und Enceladus–Dione
setzen konvergierende Bahnen voraus ([Ćuk et al. 2024](literatur:cuk-2024)). Für die Galileischen
Monde entwarfen Yoder und Peale einen Weg über Gezeiten: Jupiter schiebt Io am schnellsten nach außen,
die ersten beiden Zweikörperwinkel werden mit Wahrscheinlichkeit 1 eingefangen, der dritte und mit ihm
$\varphi_\mathrm{L}$ mit etwa 0,9, und die Dissipation in Io dämpft die Amplituden
([Yoder und Peale 1981](literatur:yoder-1981)).

Für Pluto schlug Malhotra vor, dass Neptun durch Begegnungen mit übrig gebliebenen Planetesimalen nach
außen wanderte, Pluto aus einer fast kreisförmigen Bahn in 3:2 einfing und seine Exzentrizität danach
rasch auf den heutigen neptunkreuzenden Wert trieb ([Malhotra 1993](literatur:malhotra-1993)). Aus
Plutos Bahn folgt so eine Auswanderung Neptuns um mindestens etwa 5 AE
([Malhotra 1995](literatur:malhotra-1995)). Modelle mit glatter Migration sagen aber zu große
resonante Populationen voraus, während der klassische Kuipergürtel zwei- bis viermal so viele Objekte
enthält wie die Plutinos; körnige Migration durch Begegnungen Neptuns mit massiven Planetesimalen erhöht
das Verhältnis nichtresonanter zu resonanter Objekte gegenüber glatter Migration bis etwa auf das
Zehnfache ([Nesvorný und Vokrouhlický 2016](literatur:nesvorny-2016)).

## Resonanzen der Saturnmonde

Drei Paare großer Saturnmonde stehen in Mittelbewegungsresonanz ([Peale 1976](literatur:peale-1976)):

| Paar | Umlaufzeiten | resonanter Winkel | Libration | Beleg |
|---|---|---|---|---|
| [Mimas](objekt:mimas)–[Tethys](objekt:tethys) | 1:2 (4:2) | $4\lambda_\mathrm{Te} - 2\lambda_\mathrm{Mi} - \Omega_\mathrm{Mi} - \Omega_\mathrm{Te}$ | um 0°, Amplitude 95°, Periode 70 Jahre | [Ćuk et al. 2024](literatur:cuk-2024) |
| [Enceladus](objekt:enceladus)–[Dione](objekt:dione) | 1:2 | $2\lambda_\mathrm{Di} - \lambda_\mathrm{En} - \varpi_\mathrm{En}$ | Amplitude unter 1° | [Ćuk et al. 2024](literatur:cuk-2024) |
| [Titan](objekt:titan)–Hyperion | 3:4 | $4\lambda_\mathrm{Hy} - 3\lambda_\mathrm{Ti} - \varpi_\mathrm{Hy}$ | um 180°, Amplitude 36,5°, Periode etwa 640 Tage | [Duriez 1992](literatur:duriez-1992) |

Mimas und Tethys koppeln über ihre Neigungen, die beiden anderen Paare über Exzentrizitäten. Die
Resonanz mit Dione erhält die Exzentrizität von Enceladus und damit seine Gezeitenheizung, die nur bei
anhaltend konvergierenden Bahnen fortbestehen kann; die Resonanz mit Titan schützt Hyperion mit
$e = 0{,}104$ vor nahen Begegnungen ([Ćuk et al. 2024](literatur:cuk-2024)).

## Offene Fragen

- **Alter und Entstehung der Laplace-Resonanz:** Nach Yoder und Peale bauten Gezeiten in Jupiter die
  Resonanzen aus zunächst beliebig verteilten Bahnen auf ([Yoder und Peale 1981](literatur:yoder-1981)).
  Nach Peale und Lee kann die Laplace-Beziehung dagegen schon primordial entstanden sein, durch Migration
  der jungen Monde in der zirkumjovianischen Scheibe ([Peale und Lee 2002](literatur:peale-2002)). Eine
  aktuelle Übersicht nennt Weg und Alter ungeklärt; eine Aufheizung Ganymeds in der Mitte seiner
  Geschichte spräche für eine frühere andere Resonanz und gegen einen primordialen Ursprung
  ([Nimmo et al. 2026](literatur:nimmo-2026)). Heute entfernen sich die drei Monde nach der Astrometrie
  von der exakten Resonanz ([Lainey et al. 2009](literatur:lainey-2009)).
- **Echte Dreikörperresonanz:** Yoder und Peale beschreiben neben $\varphi_\mathrm{L}$ drei
  librierende Zweikörperwinkel ([Yoder und Peale 1981](literatur:yoder-1981)). Eine Analyse der
  Grundfrequenzen findet dagegen für die Paare Io–Europa und Europa–Ganymed keine Separatrix; echte
  Resonanz sei heute nur die Dreikörperresonanz ([Lari und Saillenfest 2024](literatur:lari-2024)).
- **Resonante Transneptunier als Beleg für Migration:** Die Struktur des Kuipergürtels gilt als starkes
  Argument für eine durch Planetesimale getriebene Auswanderung Neptuns
  ([Nesvorný 2018](literatur:nesvorny-2018)), und körnige Migration trifft das beobachtete Verhältnis
  resonanter zu nichtresonanter Objekte ([Nesvorný und Vokrouhlický 2016](literatur:nesvorny-2016)).
  Die fernen Resonanzen jenseits von 2:1 sind aber weit stärker besetzt, als jedes veröffentlichte
  Migrationsmodell vorhersagt, und die Verhältnisse zwischen ihnen passen weitgehend zu instabil
  streuenden Objekten, die zeitweise in Resonanzen haften bleiben
  ([Crompvoets et al. 2022](literatur:crompvoets-2022)).

## Im Modell

- **Keine gegenseitigen Störungen:** Orrery bewegt alle Körper auf Keplerbahnen mit linear
  fortgeschriebenen Elementen ([Bahnelemente](thema:bahnelemente)). Resonanzen erscheinen nur so weit,
  wie die Raten der Datensätze die mittleren Bewegungen treffen; Libration, Einfang und Chaos fehlen.
- **Laplace-Beziehung:** Aus den mittleren Längen der Datensätze, alle im Rahmen des Jupiteräquators und
  zur selben Zeit genommen, ergibt sich $\varphi_\mathrm{L}$ zur Epoche J2000 zu genau 180,0°. Weil
  $n_1 - 3n_2 + 2n_3$ dort −1,05° je Jahrhundert beträgt, sind es am 17. September 2026 179,72°, 1900
  181,05° und 2100 178,95°: nach hundert Jahren rund das Sechzehnfache der Amplitude von E5. Die
  Abweichung liegt innerhalb der Rundung der sechsstelligen Umlaufzeiten, die allein bei Io ±2,1° je
  Jahrhundert zulässt.
- **Perijoven von Io und Europa:** Zur Epoche stehen die drei Zweikörperwinkel bei 0,3°, 180,2° und
  0,2°. Die Datensätze lassen die Perijoven aber mit Perioden von 1,33 und 1,46 Jahren vorwärts laufen
  statt mit $n_1 - 2n_2$ rückwärts; so laufen die Winkel in 243 und 255 Tagen einmal um.
- **Pluto und Neptun:** Zur Epoche ist $\varphi_\mathrm{P} = 242{,}6^\circ$. Das Umlaufzeitverhältnis
  der Datensätze beträgt 1,5116 statt im Mittel 3:2, deshalb nimmt $\varphi_\mathrm{P}$ um 3,35° je
  Jahrhundert ab und läuft in 10 752 Jahren um. Heute weichen die Konjunktionen dem Perihel noch aus:
  1892 stand Pluto bei der mittleren Anomalie 219°, 48,1 AE von der Sonne und 19,4 AE von Neptun
  entfernt, und von 1800 bis 2050 kommen sich beide nicht näher als 19,0 AE. Um 1500 v. Chr. und um
  9200 n. Chr. fallen Konjunktionen dagegen ins Perihel; zwischen 4700 v. Chr. und 20 000 n. Chr.
  beträgt der kleinste Abstand 2,8 AE (Jahr 9734, kurz nach Plutos Perihel). Das Perihelargument steht
  fest bei 113,7°.
- **Saturnmonde:** Der Winkel von Mimas und Tethys liegt zur Epoche bei −61,2° und wandert um 13,3° je
  Jahrhundert, statt in 70 Jahren um 95° zu pendeln. Hyperion fehlt im Katalog.
- **Asteroidengürtel:** Die Punktwolke erhält Kirkwood-Lücken als Einbrüche der Dichte in der großen
  Halbachse bei 4:1, 3:1, 5:2, 7:3 und 2:1, in der Mitte auf 10 %. Unter den 50 000 Teilchen der
  höchsten Qualitätsstufe enthält ein 0,02 AE breiter Streifen um 3:1, 5:2 und 7:3 nur 19, 26 und 34 %
  so viele Teilchen wie im Mittel gleich breite Streifen 0,06 bis 0,10 AE daneben. Nach dem Abstand zur
  Sonne sortiert sind es am 17. September 2026 bei einer mittleren Exzentrizität von 0,125 dagegen 104,
  100 und 106 %: Im Bild sind die Lücken nicht zu sehen. Die Elemente der Teilchen stehen fest, eine
  säkulare Resonanz wie $\nu_6$ gibt es daher nicht.
- **Plutinos:** Die Kuiper-Wolke enthält Plutinos mit großen Halbachsen um 39,4 AE, aber mit
  zufälligen Winkeln; bei der Hälfte der Teilchen um 39,4 AE liegt $\varphi_\mathrm{P}$ zur Epoche
  näher an 0° als an 180°, ein Schutz vor Neptun besteht nicht. Weitere Vereinfachungen:
  [Grenzen des Modells](thema:modell).

*Stand: September 2026*
