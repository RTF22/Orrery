# Innerer Aufbau aus Schwerefeld und Rotation

Ins Innere eines Planeten sieht niemand. Messbar sind Masse und Radius und damit die mittlere
Dichte, das äußere Schwerefeld, die Drehung des Körpers im Raum, seine Verformung durch Gezeiten
und, wo Seismometer stehen, die Laufzeiten von Wellen. Jede dieser Größen schränkt die
Dichteverteilung auf andere Weise ein; erst zusammen trennen sie Kern, Mantel und Hülle. Dieser Text
behandelt Schwerepotential, den Trägheitsmomentfaktor aus Präzession, Libration und hydrostatischer
Näherung, Love-Zahlen, Seismologie und die verdünnten Kerne der Riesenplaneten und was Orrery davon
abbildet.

## Schwerepotential und Kugelfunktionen

Außerhalb eines Körpers lässt sich das Gravitationspotential nach Kugelfunktionen entwickeln. Die
IERS Conventions schreiben die Entwicklung mit normierten Koeffizienten
([Petit und Luzum 2010](literatur:petit-2010), Gl. 6.1 bis 6.3); mit den unnormierten lautet sie
gleich:

$$V(r, \varphi, \lambda) = \frac{GM}{r} \sum_{n=0}^{\infty} \left( \frac{a}{r} \right)^n \sum_{m=0}^{n} \left[ C_{nm} \cos m\lambda + S_{nm} \sin m\lambda \right] P_{nm}(\sin\varphi)$$

Dabei sind $\varphi$ und $\lambda$ Breite und Länge, $a$ der Bezugsradius, $P_{nm}$ die zugeordneten
Legendre-Funktionen und $C_{00} = 1$. Liegt der Ursprung im Schwerpunkt, verschwinden die Glieder
ersten Grades. Die zonalen Koeffizienten ($m = 0$) führt man mit umgekehrtem Vorzeichen als $J_n$;
mit der Normierung der IERS für $m = 0$ gilt ([Petit und Luzum 2010](literatur:petit-2010), Gl. 6.2b
und 6.3)

$$J_n = -C_{n0} = -\sqrt{2n + 1}\,\bar{C}_{n0}$$

Die Glieder zweiten Grades hängen unmittelbar an den Hauptträgheitsmomenten $A < B < C$
([Margot et al. 2012](literatur:margot-2012)):

$$J_2 = \frac{C - (A + B)/2}{M a^2}, \quad C_{22} = \frac{B - A}{4 M a^2}$$

$J_2$ misst also nur, wie weit das polare Trägheitsmoment das mittlere äquatoriale übertrifft, nicht
$C$ selbst. Um $C$ zu erhalten, braucht es eine zweite, unabhängige Beziehung: die Drehung des
Körpers im Raum oder die Annahme hydrostatischen Gleichgewichts.

Die Koeffizienten stammen aus der Bahnverfolgung von Raumsonden. Für [Jupiter](objekt:jupiter)
ergaben die zehn Schwerefeld-Durchgänge von Juno bis Dezember 2018 beim Bezugsradius 71 492 km
$J_2 = 14696{,}5735 \cdot 10^{-6}$, $J_4 = -586{,}6085 \cdot 10^{-6}$ und
$J_6 = 34{,}2007 \cdot 10^{-6}$, mit Unsicherheiten von einigen $10^{-9}$ (3σ;
[Durante et al. 2020](literatur:durante-2020), Tabelle 2). Ohne innere Strömungen wäre das Feld
eines rotierenden Fluidplaneten achsen- und nord-süd-symmetrisch und von geraden Koeffizienten
beherrscht, die ungefähr wie $q^n$ skalieren; $q$ ist das Verhältnis von Fliehkraft zu Schwere am
Äquator ([Iess et al. 2018](literatur:iess-2018)). Mit $q = 0{,}0892$ für Jupiter
([Militzer und Hubbard 2023](literatur:militzer-2023), Tabelle 1) ergeben die Messwerte
$J_2/q = 0{,}165$, $J_4/q^2 = -0{,}074$ und $J_6/q^3 = 0{,}048$. Die ungeraden Koeffizienten $J_3$,
$J_5$, $J_7$ und $J_9$ messen dagegen, wie tief die Winde der einzelnen Zonen reichen. Juno fand
eine Nord-Süd-Asymmetrie, die Signatur von Strömungen in Atmosphäre und Innerem
([Iess et al. 2018](literatur:iess-2018)); so ist $J_3 = (-0{,}0450 \pm 0{,}0033) \cdot 10^{-6}$
(3σ; [Durante et al. 2020](literatur:durante-2020)). Danach reichen die Winde bei Jupiter rund 3000
km tief, bei [Saturn](objekt:saturn) rund 9000 km; bei Saturn tragen sie etwa 6 % zu $J_6$ bei und
überwiegen ab $J_8$ ([Militzer und Hubbard 2023](literatur:militzer-2023)). Bei den Riesenplaneten
reagiert das Schwerefeld ohnehin vor allem auf die äußeren Schichten und legt die Kerne nur lose
fest ([Mankovich und Fuller 2021](literatur:mankovich-2021)).

## Trägheitsmomentfaktor

Der Trägheitsmomentfaktor $C/(M R^2)$ fasst die radiale Massenverteilung in einer Zahl. Für eine
homogene Kugel ist er 2/5; nimmt die Dichte nach innen zu, sinkt er darunter, und je weiter, desto
stärker sind die dichten Stoffe zur Mitte hin konzentriert
([Trägheitsmomentfaktor (englische Wikipedia)](quelle:wikipedia-en-moment-of-inertia-factor)). Der
Wert hängt am gewählten Radius: Für Riesenplaneten beziehen ihn viele Autoren auf den Äquatorradius
bei 1 bar, andere auf den Volumenradius ([Militzer und Hubbard 2023](literatur:militzer-2023)). Aus
Jupiters 0,26393 beim Äquatorradius werden so 0,2761 beim Volumenradius.

**Präzession.** Sonne und Monde üben auf den Äquatorwulst ein Drehmoment aus, und die Drehachse
präzediert mit einer Rate, die von $H = [C - (A + B)/2]/C$ abhängt. Zusammen mit $J_2$ ergibt sich
$C$; auf diese Weise sind die Werte von Erde und Mars bestimmt
([Margot et al. 2012](literatur:margot-2012)). Für die [Erde](objekt:earth) folgt aus den
Zahlenstandards $J_2 = 1{,}0826359 \cdot 10^{-3}$ und $H = 3{,}273795 \cdot 10^{-3}$
([Petit und Luzum 2010](literatur:petit-2010), Tabelle 1.1) $C/(M a^2) = J_2/H = 0{,}330698$. Beim
[Mars](objekt:mars) ergaben Radiodaten von Pathfinder und den Viking-Landern 1997 eine Präzession
von −7576 ± 35 Millibogensekunden (mas) je Jahr, ein Hinweis auf einen dichten Kern
([Folkner et al. 1997](literatur:folkner-1997)). Die Radioverfolgung des InSight-Landers lieferte
2023 −7598,1 ± 2,2 mas je Jahr und damit einen normierten polaren Trägheitsmomentfaktor von 0,36419
± 0,00011 ([Le Maistre et al. 2023](literatur:le-maistre-2023)). Das Supplement der Arbeit gibt
dafür

$$\frac{C}{M R_\mathrm{e}^2} = -1415393\,\frac{J_2}{\dot{\psi} - \dot{\psi}_\mathrm{g}}$$

mit den Raten in mas je Jahr, der geodätischen Präzession $\dot{\psi}_\mathrm{g}$ von 6,754 mas je
Jahr, $J_2 = 0{,}0019566$ und dem Bezugsradius 3396 km; auf den mittleren Radius von 3389,5 km
bezogen ist das mittlere Trägheitsmoment 0,36428 ± 0,00011
([Le Maistre et al. 2023](literatur:le-maistre-2023), Supplement Abschnitt 5). Bei Jupiter und
Saturn dauert ein Präzessionsumlauf rund 0,5 und 2 Millionen Jahre
([Militzer und Hubbard 2023](literatur:militzer-2023)). Für Saturn gelang die Messung dennoch, aus
Ringbedeckungen, Satellitenbahnen und Beobachtungen, die bis 1891 zurückreichen: 0,2258 ± 0,0025
(1σ, Bezugsradius 60 330 km; [Jacobson 2022](literatur:jacobson-2022), Tabelle 8).

**Radau-Darwin-Näherung.** Für Körper im hydrostatischen Gleichgewicht schätzt die
Radau-Darwin-Näherung den Trägheitsmomentfaktor aus Form, Rotation und Schwerefeld
([Trägheitsmomentfaktor (englische Wikipedia)](quelle:wikipedia-en-moment-of-inertia-factor)); sie
setzt eine eindeutige Beziehung zwischen $J_2$, Rotation und Trägheitsmoment voraus. Hier ist sie
mit der fluiden Love-Zahl $k_\mathrm{f}$ geschrieben, die Form in der Quelle ist gleichwertig
([Militzer und Hubbard 2023](literatur:militzer-2023), Gl. 16):

$$\frac{C}{M a^2} = \frac{2}{3}\left( 1 - \frac{2}{5}\sqrt{\frac{4 - k_\mathrm{f}}{1 + k_\mathrm{f}}} \right), \quad k_\mathrm{f} = \frac{3 J_2}{q}, \quad q = \frac{\omega^2 a^3}{GM}$$

Für die homogene Kugel ist $k_\mathrm{f} = 3/2$, und die Formel gibt genau 2/5. Exakt wird sie im
Grenzfall kleiner Rotation und großer $J_2$, also für nahezu homogene Körper
([Militzer und Hubbard 2023](literatur:militzer-2023)). Ihre Gültigkeit hat Grenzen:

- Sie setzt hydrostatisches Gleichgewicht voraus und bleibt auch dann eine Näherung; selbst für
  einen hydrostatischen Körper gehören zu $J_2$ und $C_{22}$ nicht eindeutig ein Trägheitsmoment
  ([Gomez Casajus et al. 2022](literatur:gomez-casajus-2022)).
- Für Jupiter und Saturn ist sie zu ungenau, weil beide schnell rotieren und ihre Dichte sich im
  Inneren stark ändert ([Militzer und Hubbard 2023](literatur:militzer-2023)). Mit deren $J_2$ und
  $q$ ergibt sie für Jupiter 0,2582, 2,2 % unter dem Modellwert 0,26393, für Saturn 0,2193, 0,5 %
  über dem Modellwert 0,2181.
- Nicht hydrostatische Anteile verfälschen $J_2$. Für Mars ergibt die Formel mit $q = 0{,}00459$ den
  Wert 0,3751, 3,0 % mehr als die Präzession. Form und Schwerefeld des Mars lassen sich erklären,
  wenn er sich auf lange Sicht wie eine Flüssigkeit unter einer festen Schale mit eingebetteten
  Massenanomalien verhält; Schwerefeld und Form haben dann einen nicht hydrostatischen Anteil
  ([Le Maistre et al. 2023](literatur:le-maistre-2023), Supplement Abschnitt 10). Für die Erde liegt
  die Formel mit 0,3315 um 0,25 % über $J_2/H$.
- Bei gebunden rotierenden Monden erzeugen Rotation und Gezeit zusammen $J_2$ und $C_{22}$ im
  hydrostatischen Verhältnis 10/3. Dieses Verhältnis ist notwendig, aber nicht hinreichend für
  hydrostatisches Gleichgewicht ([Durante et al. 2019](literatur:durante-2019)).

**Libration und Schiefe.** Wo sich keine Präzession messen lässt, verrät die Drehung selbst das
Innere. Für [Merkur](objekt:mercury) schlug Peale 1976 vor, vier Größen zu verbinden: $J_2$ und
$C_{22}$ aus dem Schwerefeld, die Schiefe der Drehachse im Cassini-Zustand 1 und die Amplitude der
erzwungenen Libration in Länge. Schiefe und Schwerefeld ergeben $C/(M R^2)$. Das Drehmoment der
Sonne auf die unsymmetrische Figur und damit die Libration sind proportional zu
$(B - A)/C_\mathrm{m}$, wobei $C_\mathrm{m}$ das Trägheitsmoment der äußeren Schale ist, die über
einem flüssigen Kern allein schwingt ([Margot et al. 2012](literatur:margot-2012), Gl. 3):

$$\frac{C_\mathrm{m}}{C} = \frac{4\,C_{22}}{C/(M R^2)} \left( \frac{B - A}{C_\mathrm{m}} \right)^{-1}$$

Radarbeobachtungen an 35 Terminen von 2002 bis 2012 ergaben eine Schiefe von 2,04′ ± 0,08′ und eine
Libration von 38,5″ ± 1,6″, rund 450 m am Äquator, also
$(B - A)/C_\mathrm{m} = (2{,}18 \pm 0{,}09) \cdot 10^{-4}$. Mit $J_2 = 5{,}031 \cdot 10^{-5}$ und
$C_{22} = 0{,}809 \cdot 10^{-5}$ aus MESSENGER folgen $C/(M R^2) = 0{,}346 \pm 0{,}014$ und
$C_\mathrm{m}/C = 0{,}431 \pm 0{,}025$: Nur 43 % des Trägheitsmoments schwingen mit. Ein
Zweischichtmodell mit diesen Werten hat einen Kern von 1998 km Radius, 82 % des Planetenradius
([Margot et al. 2012](literatur:margot-2012)). Die MESSENGER-Radiodaten ergaben später eine mittlere
Schiefe von 1,968′ ± 0,027′ und damit $0{,}333 \pm 0{,}005$ (beides 3σ); die dazu passenden Modelle
haben einen festen inneren Kern mit 0,3 bis 0,7 des Radius des äußeren Kerns
([Genova et al. 2019](literatur:genova-2019)). Margot et al. mahnen zur Vorsicht: Nach einer von
ihnen zitierten Rechnung kann eine nicht achsensymmetrische Kern-Mantel-Grenze Schlüsse auf die
Manteldichte um 10 bis 20 % verschieben.

Beim [Mond](objekt:moon) erfassen die Laserentfernungen auch seine Drehung; ihre Auswertung bestimmt
$(C - A)/B$ und $(B - A)/C$, und mit $J_2$ und $C_{22}$ aus GRAIL ergibt sich das mittlere
Trägheitsmoment des festen Mondes zu $0{,}392728 \pm 0{,}000012$. Dieselben Daten zeigen auch die
Abplattung des flüssigen äußeren Kerns und die Dissipation an seinen festen Grenzen
([Williams et al. 2014](literatur:williams-2014)). Auf den flüssigen Kern sprechen die
Laserentfernungen an, weil Kern und Mantel Drehimpuls austauschen. Ein erweitertes dynamisches
Modell ergab eine Kernabplattung von $(2{,}2 \pm 0{,}6) \cdot 10^{-4}$, die für einen Radius der
Kern-Mantel-Grenze von 381 ± 12 km dem hydrostatischen Wert entspricht; der Kern trüge dann 1,59 bis
1,77 % der Masse ([Viswanathan et al. 2019](literatur:viswanathan-2019)).

Beim Mars sah InSight die Nutation durch eine Resonanz mit der freien Kernnutation verstärkt. Der
Verstärkungsfaktor 0,0615 ± 0,007 hängt vor allem am Kernradius, die Periode von −243 ± 3,3 Tagen
vor allem an der Form des Kerns. Ist der Mantel ganz fest, folgt ein flüssiger Kern von 1835 ± 55 km
Radius und 5955 bis 6290 kg/m³ mittlerer Dichte
([Le Maistre et al. 2023](literatur:le-maistre-2023)).

## Love-Zahl k₂ als Randbedingung

Aus gemessenen Verformungen lässt sich der Dichteverlauf im Erdinneren abschätzen, bei Gasplaneten
gibt vor allem die Abplattung Auskunft ([Love-Zahlen](quelle:wikipedia-de-love-zahlen)). Die
Rotation verformt einen Körper über sehr lange Zeiten, und wie stark, beschreibt die fluide
Love-Zahl $k_\mathrm{f}$ aus der Radau-Darwin-Näherung; die Gezeiten verformen ihn mit ihrer
Periode, und das beschreibt $k_2$ (Definition und Messwerte unter [Gezeiten](thema:gezeiten)).
Weichen beide voneinander ab, verhält sich ein Teil des Körpers bei der Gezeitenperiode nicht wie
eine Flüssigkeit. So entspricht Titans Schwerefeld einem $k_\mathrm{f}$ von rund 1,01, die
Gezeitenantwort aber nur einem $k_2$ von rund 0,62 ([Durante et al. 2019](literatur:durante-2019));
wie groß $k_2$ wirklich ist, ist umstritten (siehe [Gezeiten](thema:gezeiten)).

Beim Mars fließen $k_2 = 0{,}169 \pm 0{,}006$, die Periode der freien Polbewegung (Chandler-Periode)
von 206,9 ± 0,5 Tagen und die Trägheitsmomente aus der Präzession gemeinsam in die Innenmodelle ein;
die Chandler-Periode begrenzt die Rheologie des Mantels, besonders ihre Frequenzabhängigkeit über
lange Perioden ([Konopliv et al. 2020](literatur:konopliv-2020)). Für den Mond passen Dichte,
Trägheitsmoment und $k_2$ zu Modellen mit einem flüssigen äußeren Kern von 200 bis 380 km Radius,
einem festen inneren Kern von 0 bis 280 km und einer Zone niedriger Scherwellengeschwindigkeit tief
im Mantel; der ganze Kern trägt höchstens 1,5 % der Masse
([Williams et al. 2014](literatur:williams-2014)). Jupiters $k_{22} = 0{,}565 \pm 0{,}018$ (3σ)
liegt unter der Vorhersage statischer Innenmodelle für die Gezeit durch Io
([Durante et al. 2020](literatur:durante-2020)); zur Deutung siehe [Gezeiten](thema:gezeiten).

## Seismologie

Auch seismische Modelle nutzen Masse und Trägheitsmoment als Randbedingungen. Das Referenzmodell
PREM der [Erde](objekt:earth) entstand aus rund 1000 Perioden von Eigenschwingungen, 500
zusammengefassten Laufzeiten, 100 Gütefaktoren, Masse und Trägheitsmoment sowie 1,75 Millionen
Laufzeiten von P- und S-Wellen ([Dziewonski und Anderson 1981](literatur:dziewonski-1981)).

Auf dem Mond registrierten die Seismometer der Apollo-Missionen. Eine Neuauswertung mit Verfahren
der Array-Seismologie fand 2011 einen festen inneren und einen flüssigen äußeren Kern unter einer
teilweise geschmolzenen Schicht, dem Volumen nach zu rund 60 % flüssig
([Weber et al. 2011](literatur:weber-2011)). Zwei Auswertungen der Apollo-Daten aus demselben Jahr
ließen die Größe des flüssigen Kerns um ±55 km offen; der Radius aus den Laserentfernungen stimmt
auf 0,3 % mit der einen (Garcia et al. 2011) überein und weicht um 13 % von der anderen (Weber et
al.) ab ([Viswanathan et al. 2019](literatur:viswanathan-2019)).

Auf dem Mars stand mit InSight ein einzelnes Seismometer. Von der Kern-Mantel-Grenze reflektierte
Wellen, zusammen mit geodätischen Daten invertiert, ergaben 2021 einen flüssigen Kern von 1830 ± 40
km Radius und 5,7 bis 6,3 g/cm³ mittlerer Dichte, was viele leichte Elemente im Eisen verlangt
([Stähler et al. 2021](literatur:staehler-2021)).

Bei Saturn dienen die [Ringe](thema:ringe) als Seismometer. Cassini beobachtete bei Sternbedeckungen
im C-Ring Wellen, die von Eigenschwingungen des Planeten angeregt werden, vor allem von
Grundschwingungen (f-Moden), daneben von Schwerewellen (g-Moden). Eine Mode regt die Ringteilchen an
ihrer Lindblad-Resonanz an; die azimutale Ordnung $m$ liest man an der Form der Welle ab. g-Moden
gibt es nur, wo eine Zusammensetzungsschichtung die Konvektion unterdrückt. Mankovich und Fuller
ordneten die Welle W76.44 der g-Mode mit $l = 2$ und $m = -2$ der niedrigsten radialen Ordnung zu.
Zusammen mit $J_2$, $J_4$, $J_6$ und den Frequenzen von drei der vier beobachteten Wellen mit
$m = -2$ verlangt das eine stabil geschichtete Übergangszone zwischen Kern und Hülle bis
$r/R = 0{,}59 \pm 0{,}01$ mit rund 17 Erdmassen Eis und Gestein
([Mankovich und Fuller 2021](literatur:mankovich-2021)).

## Verdünnte Kerne der Riesenplaneten

Herkömmliche Modelle der Riesenplaneten bestehen aus wenigen chemisch einheitlichen Schichten, meist
mit einem scharf begrenzten Kern aus schweren Elementen in der Mitte
([Mankovich und Fuller 2021](literatur:mankovich-2021)). Junos $J_4$ und $J_6$ sind aber dem Betrag
nach kleiner, als solche Modelle mit großem, scharf begrenztem Kern vorhersagen
([Militzer et al. 2022](literatur:militzer-2022)). Schon nach den ersten beiden Umläufen zeigte
sich, dass ein verdünnter Kern hilft, dessen schwere Elemente über 0,3 bis 0,5 des Planetenradius
verteilt sind; je nach Zustandsgleichung enthält er 7 bis 25 Erdmassen schwerer Elemente, und die
tiefe metallische Hülle ist in jedem Fall stärker angereichert als die äußere molekulare
([Wahl et al. 2017](literatur:wahl-2017)). Modelle mit Winden und einer Zustandsgleichung aus
Ab-initio-Rechnungen treffen alle gemessenen Koeffizienten mit einem verdünnten Kern bis 63 % des
Radius, in dem schwere Elemente nur 18 % der Masse ausmachen
([Militzer et al. 2022](literatur:militzer-2022)).

Das Trägheitsmoment Jupiters ist nicht direkt gemessen, der Tabellenwert unten ist eine
Modellrechnung
([Trägheitsmomentfaktor (englische Wikipedia)](quelle:wikipedia-en-moment-of-inertia-factor)).
$J_2$, $J_4$ und $J_6$ legen es nicht eindeutig fest, grenzen es aber auf besser als 1 % ein;
Modelle, die alle Koeffizienten bis $J_{10}$ treffen, ergeben 0,26393 ± 0,00001
([Militzer und Hubbard 2023](literatur:militzer-2023)). Die Präzession der Achse, umgekehrt
proportional zum Trägheitsmoment, sollte sich gegen Ende der Juno-Mission genauer messen lassen
([Durante et al. 2020](literatur:durante-2020)).

## Trägheitsmomentfaktoren im Vergleich

Größen, Radien und Unsicherheiten stehen wie in den Quellen, die σ-Stufe, wo sie genannt ist.
Ganymed hat den kleinsten Wert unter den festen Körpern des Sonnensystems, der Mond ist bis auf
einen kleinen Kern nahezu homogen
([Trägheitsmomentfaktor (englische Wikipedia)](quelle:wikipedia-en-moment-of-inertia-factor)).

| Körper | Wert | Größe und Radius | Verfahren | Beleg |
|---|---|---|---|---|
| Erde | 0,330698 (formal ±0,0000001) | $C/(M a^2)$, $a$ = 6378,1366 km | Präzession ($H$) und $J_2$ | [Petit und Luzum 2010](literatur:petit-2010) |
| Mond | 0,392728 ± 0,000012 | mittleres Trägheitsmoment des festen Mondes | Drehung aus Laserentfernungen, $J_2$ und $C_{22}$ aus GRAIL | [Williams et al. 2014](literatur:williams-2014) |
| Mars | 0,36419 ± 0,00011 | $C/(M a^2)$, $a$ = 3396 km | Präzession aus Radiodaten von InSight und Viking, $J_2$ | [Le Maistre et al. 2023](literatur:le-maistre-2023) |
| Merkur | 0,346 ± 0,014 (1σ); 0,333 ± 0,005 (3σ) | $C/(M R^2)$ | Schiefe im Cassini-Zustand aus Radar beziehungsweise MESSENGER-Radiodaten, $J_2$, $C_{22}$ | [Margot et al. 2012](literatur:margot-2012); [Genova et al. 2019](literatur:genova-2019) |
| Jupiter | 0,26393 ± 0,00001 | $C/(M a^2)$, $a$ = 71 492 km | nicht gemessen: Innenmodelle, angepasst an $J_2$ bis $J_{10}$ | [Militzer und Hubbard 2023](literatur:militzer-2023) |
| Saturn | 0,2258 ± 0,0025 (1σ); Modell 0,2181 ± 0,0002 | $C/(M a^2)$, $a$ = 60 330 km; Modell 60 268 km | Polpräzession aus Ringbedeckungen und Satellitenbahnen; Modell mit Winden, an das Schwerefeld angepasst | [Jacobson 2022](literatur:jacobson-2022); [Militzer und Hubbard 2023](literatur:militzer-2023) |
| Ganymed | 0,3159 ± 0,0052 (16. bis 84. Perzentil) | Modell aus volumengleichen Kugelschichten | $J_2$ und $C_{22}$ aus Juno (2021) und Galileo, Dreischichtmodell mit nicht hydrostatischem Anteil wie bei Titan | [Gomez Casajus et al. 2022](literatur:gomez-casajus-2022) |
| Titan | 0,343 ± 0,001 | $C/(M R^2)$ | $J_2$ und $C_{22}$ aus zehn Cassini-Vorbeiflügen, Radau-Darwin | [Petricca et al. 2025](literatur:petricca-2025) |

Frühere Galileo-Auswertungen hatten für Ganymed mit dem erzwungenen hydrostatischen Verhältnis 10/3
und der Radau-Darwin-Näherung 0,3105 ± 0,0028 ergeben; der neue, höhere Mittelwert deutet auf einen
etwas weniger differenzierten [Ganymed](objekt:ganymede) hin, die größere Unsicherheit
berücksichtigt nicht hydrostatische Anteile
([Gomez Casajus et al. 2022](literatur:gomez-casajus-2022)).

## Offene Fragen

- **Größe und Zustand des Marskerns:** Seismik und Nutation ergaben übereinstimmend einen großen
  flüssigen Kern, 1830 ± 40 km ([Stähler et al. 2021](literatur:staehler-2021)) und 1835 ± 55 km
  ([Le Maistre et al. 2023](literatur:le-maistre-2023)). Die dafür nötige Menge leichter Elemente
  passt aber nicht zu petrologischen Experimenten ([Samuel et al. 2023](literatur:samuel-2023)) und
  übersteigt, was die wahrscheinlichen Bausteine des Mars an flüchtigen Elementen boten
  ([Khan et al. 2023](literatur:khan-2023)). Liegt über dem Kern eine geschmolzene Silikatschicht,
  wird der Kern kleiner und dichter: 1675 ± 30 km mit 6,65 ± 0,1 g/cm³ unter einer 150 ± 15 km
  dicken Schicht, abgeleitet aus mehrfach gebeugten P-Wellen
  ([Khan et al. 2023](literatur:khan-2023)), oder 1650 ± 20 km mit 6,5 g/cm³ in einem geschichteten
  Mantel, der auch mit der Gezeitendissipation durch Phobos vereinbar ist
  ([Samuel et al. 2023](literatur:samuel-2023)). Auch nach der Nutation könnte der metallische Kern
  mehr als 200 km kleiner sein, wenn der unterste Mantel geschmolzen ist und sich unabhängig dreht
  ([Le Maistre et al. 2023](literatur:le-maistre-2023)). Ob ein Teil des Kerns fest ist, bleibt
  strittig: Die Nutationsdaten zeigen keine Spur eines inneren Kerns; mit viel leichten Elementen
  und Schwefel nahe dem Eutektikum liegt die Schmelztemperatur weit unter der erwarteten
  Kerntemperatur, ein innerer Kern ist danach sehr unwahrscheinlich
  ([Le Maistre et al. 2023](literatur:le-maistre-2023)). Bi et al. fanden dagegen 2025 Phasen, die
  den Kern durchlaufen oder an einem inneren Kern reflektiert werden, und bestimmten seinen Radius
  zu 613 ± 67 km ([Bi et al. 2025](literatur:bi-2025)).
- **Kern des Mondes:** Die Apollo-Seismik zeigte einen festen inneren Kern
  ([Weber et al. 2011](literatur:weber-2011)); die geodätischen Daten lassen einen inneren Kern von
  0 bis 280 km zu, verlangen ihn also nicht, und begrenzen den ganzen Kern auf höchstens 1,5 % der
  Masse ([Williams et al. 2014](literatur:williams-2014)). Die hydrostatische Kernabplattung aus den
  Laserentfernungen ergibt dagegen 1,59 bis 1,77 %
  ([Viswanathan et al. 2019](literatur:viswanathan-2019)). Ein Abgleich geodätischer Randbedingungen
  mit thermodynamischen Modellen ergab einen inneren Kern von 258 ± 40 km Radius, im Rahmen einer
  frühen Umwälzung des Mantels ([Briaud et al. 2023](literatur:briaud-2023)).
- **Verdünnter Kern Jupiters:** Wie weit er reicht, hängt an Zustandsgleichung und Annahmen. Neben
  Kernen bis 63 % des Radius ([Militzer et al. 2022](literatur:militzer-2022)) ergeben sich mit
  veränderten Zustandsgleichungen auch kleine verdünnte Kerne, die nur rund 20 % der Masse umfassen
  und besser zu Modellen von Entstehung und Entwicklung passen; alle diese Modelle verlangen eine
  höhere innere Entropie, als man aus den Messungen der Galileo-Sonde gewöhnlich annimmt
  ([Howard et al. 2023](literatur:howard-2023)). Zudem verlangt das Schwerefeld zwischen 10 und 100
  GPa eine geringere Dichte, als eine Hülle mit der in der Atmosphäre gemessenen Anreicherung
  schwerer Elemente hätte; mit einer stabilen Schicht nahe der Oberfläche und solarer
  Zusammensetzung der Atmosphäre schrumpft der verdünnte Kern auf 0,4 bis 0,5 des Radius
  ([Nettelmann und Fortney 2025](literatur:nettelmann-2025)). Wie sich ein verdünnter Kern bildet
  und hält, ist nicht verstanden ([Wahl et al. 2017](literatur:wahl-2017)).
- **Saturns Trägheitsmoment:** Die Polpräzession ergibt beim Radius 60 268 km 0,2263 ± 0,0101 (3σ),
  mehr als alle Modellvorhersagen, aber innerhalb von 3σ ([Jacobson 2022](literatur:jacobson-2022)).
  Modelle mit Winden, die das Schwerefeld treffen, sagen 0,2181 ± 0,0002 voraus; die tiefen Winde
  senken den Wert um 0,4 %, was eine Messung über einen hinreichend langen Abschnitt der Präzession
  prüfen könnte ([Militzer und Hubbard 2023](literatur:militzer-2023)). Zwischen beiden Werten
  liegen 2,4σ der Messung.
- **Hydrostatik Titans:** Aus $J_2/C_{22} = 3{,}186 \pm 0{,}077$, verträglich mit 10/3 auf dem
  2σ-Niveau, folgt ein Trägheitsmoment nahe 0,341. Titans Form ist aber deutlich stärker
  abgeplattet, als es dem Gleichgewicht entspräche; das Gleichgewicht ist damit nicht gesichert, und
  ein nicht hydrostatisches Inneres ließe auch kleinere Werte zu
  ([Durante et al. 2019](literatur:durante-2019)). Die Neuauswertung mit zehn Vorbeiflügen fand
  $J_2/C_{22} = 3{,}316 \pm 0{,}051$, ein Feld im entspannten hydrostatischen Zustand und
  $C/(M R^2) = 0{,}343 \pm 0{,}001$; sie deutet Titan ohne globalen Ozean
  ([Petricca et al. 2025](literatur:petricca-2025)). Die Streitfrage um $k_2$ und den Ozean steht
  unter [Gezeiten](thema:gezeiten).

## Im Modell

- **Kein Schwerefeld:** Orrery bewegt alle Körper über Bahnelemente mit linearen Raten
  ([Bahnelemente](thema:bahnelemente)); weder $GM$ noch $J_2$ gehen in die Bahnen ein. Die Masse
  eines Körpers dient nur der Zeile „Masse" im Datenblock und der Kepler-Umlaufzeit, die der
  Datenblock aus $G\,(M + m)$ rechnet. Was der Äquatorwulst an den Mondbahnen bewirkt, steckt nur in
  den festen Knoten- und Apsidenraten der Datensätze, soweit diese welche führen.
- **Form:** Alle Körper sind Kugeln mit dem mittleren Radius. Bei Jupiter liegt die Kugel von 69 911
  km am Äquator 1581 km unter und an den Polen 3057 km über der 1-bar-Fläche (Radien 71 492 und 66
  854 km, Abplattung 0,06487), bei Saturn 2036 und 3868 km (60 268 und 54 364 km, Abplattung
  0,09796), bei der Erde 7,1 und 14,2 km (Faktenblätter des NSSDC).
- **Drehung:** Die Pole stehen fest und die Rotation ist gleichförmig
  ([Bezugssysteme](thema:bezugssysteme)). Es fehlen damit gerade die Größen, aus denen das
  Trägheitsmoment gemessen wird: Präzession, Nutation, physische Libration und freie Polbewegung.
  Kerne, Trägheitsmomente, Schwerefeldkoeffizienten und Love-Zahlen stehen in keinem Datensatz.
- **Massen und GM:** Massen und Radien von Sonne, Erde, Jupiter und Saturn stimmen mit den
  Faktenblättern des NSSDC überein, bis auf die Sonnenmasse (siehe unten); die Gravitationskonstante
  ist $G = 6{,}67430 \cdot 10^{-11}\,\mathrm{m}^3\,\mathrm{kg}^{-1}\,\mathrm{s}^{-2}$ (CODATA 2018).
  Ihr Produkt mit der Masse weicht vom dynamisch bestimmten $GM$ ab: bei der Sonne um +45 ppm gegen
  die IERS-Konstante, bei Erde und Mond um +5 und +29 ppm
  ([Petit und Luzum 2010](literatur:petit-2010)), bei Jupiter um +3 ppm
  ([Durante et al. 2020](literatur:durante-2020)), bei Saturn um +5 ppm und bei Titan um +238 ppm
  ([Jacobson 2022](literatur:jacobson-2022)); die Marsmasse liegt 34 ppm unter dem Wert, mit dem Le
  Maistre et al. rechnen ([Le Maistre et al. 2023](literatur:le-maistre-2023)). Der Datensatz führt
  die Sonne mit $1{,}9885 \cdot 10^{30}\,\mathrm{kg}$; das heutige Faktenblatt nennt
  $1{,}9884 \cdot 10^{30}\,\mathrm{kg}$, damit läge das Produkt 5 ppm unter der IERS-Konstante. Die
  Kepler-Umlaufzeiten der Planeten im Datenblock werden durch die +45 ppm um rund 23 ppm zu kurz.
- **Datenblock:** Der Durchmesser ist der doppelte mittlere Radius. Weitere Vereinfachungen:
  [Grenzen des Modells](thema:modell).

*Stand: September 2026*
