# Gebundene Rotation

Ein Körper rotiert gebunden, wenn seine Drehung und sein Umlauf in einem festen, ganzzahligen
Verhältnis stehen. Der Regelfall ist 1:1, die synchrone Rotation, bei der ein Mond seinem Planeten
stets dieselbe Seite zeigt; [Merkur](objekt:mercury) dagegen dreht sich dreimal, während er die
Sonne zweimal umläuft. Beides sind Endzustände derselben Entwicklung: Gezeitenreibung baut die
Eigendrehung ab, bis ein Drehmoment auf eine bleibende Unsymmetrie des Körpers sie festhält. Dieser
Text führt vom Gezeitendrehmoment über Einfangwahrscheinlichkeiten, Cassini-Zustände und Libration
zu den Messverfahren, ordnet die Sonderfälle Venus, Hyperion und Pluto–Charon ein und beschreibt
zuletzt, was Orrery davon abbildet (Überblick auch bei
[NASA Science](quelle:nasa-gebundene-rotation)).

## Drehmoment und Zeitskala des Abbremsens

Der Zentralkörper hebt im Trabanten eine Gezeitenbeule. Innere Reibung lässt sie der Anregung
nacheilen, wenn der Trabant schneller rotiert als er umläuft; die Anziehung auf die versetzte Beule
erzeugt dann ein bremsendes Drehmoment ([Gezeiten und Roche-Grenze](thema:gezeiten)). In führender
Ordnung, mit der Love-Zahl $k_2$, der Güte $Q$ und dem Radius $R$ des rotierenden Körpers, der
Masse $M$ des Partners und dem Abstand $a$, ist sein Betrag

$$\Gamma = \frac{3}{2}\,\frac{k_2}{Q}\,\frac{G M^2 R^5}{a^6}$$

Teilt man den Drehimpuls $C\,\omega_0$ des Trabanten durch dieses als konstant angenommene
Drehmoment, folgt als grobe Zeitskala bis zur gebundenen Rotation

$$t \approx \frac{2}{3}\,\frac{Q}{k_2}\,\frac{C\,\omega_0\, a^6}{G M^2 R^5}$$

mit dem polaren Trägheitsmoment $C$ und der anfänglichen Winkelgeschwindigkeit $\omega_0$. Dieselbe
Abschätzung findet sich auch mit dem Vorfaktor $1/3$; ein solcher Faktor zwei entsteht leicht aus
den Konventionen für $Q$, in denen der Phasenverzug doppelt so groß ist wie der geometrische Winkel
zwischen Beule und Verbindungslinie ([Efroimsky und Lainey 2007](literatur:efroimsky-2007)).

**Beispielrechnung.** Für den [Mond](objekt:moon) sind $k_2 = 0{,}02416 \pm 0{,}00022$ und
$Q = 37{,}5 \pm 4$ bei einem Monat Periode aus Laserentfernungen und GRAIL bekannt, das mittlere
Trägheitsmoment des festen Mondes ist $0{,}392728 \pm 0{,}000012\,M R^2$ und der mittlere Radius
$1737{,}151\,\mathrm{km}$ ([Williams et al. 2014](literatur:williams-2014)). Mit der Erdmasse
$M_\oplus$ und einer anfänglichen Rotationsperiode von 10 Stunden ergibt die Formel am heutigen
Abstand von 60,3 Erdradien rund 43 Millionen Jahre; das Drehmoment beträgt dabei
$1{,}1 \cdot 10^{16}\,\mathrm{N}\,\mathrm{m}$. Bei 20 Erdradien, einem frühen Abstand des Mondes,
sind es wegen der sechsten Potenz nur noch rund 57 000 Jahre. Die Bindung eines nahen Mondes ist
deshalb praktisch immer schon abgeschlossen, während weit entfernte, kleine Körper ihre
ursprüngliche Drehung behalten.

## Endzustände: Spin-Bahn-Resonanzen

Die Bremsung endet nicht an einem beliebigen Punkt. Ist der Körper nicht rotationssymmetrisch, übt
der Zentralkörper auf die bleibende Deformation ein Drehmoment aus, das die Drehung an ein
Vielfaches der mittleren Bewegung $n$ binden kann. Goldreich und Peale mittelten die
Bewegungsgleichung über einen Umlauf. Nahe der $p$-ten Resonanz, in der die Drehung $p\,n$ beträgt,
gilt für den Winkel $\gamma$ zwischen der langen Achse und der Richtung zum Zentralkörper im
Perizentrum ([Goldreich und Peale 1966](literatur:goldreich-1966), Gl. 10)

$$C\,\ddot{\gamma} + \frac{3}{2}(B - A)\,n^2 H(p,e)\,\sin 2\gamma = \bar{T}$$

mit den Hauptträgheitsmomenten $A \le B \le C$, dem über den Umlauf gemittelten
Gezeitendrehmoment $\bar{T}$ und einer nur von Exzentrizität und Ordnung abhängigen Reihenfunktion
$H(p,e)$. Ohne das Gezeitenglied ist das die Gleichung eines Pendels: Der Körper schwingt um die
Resonanzlage. Die Frequenz dieser freien Libration ist bei 1:1 mit $H(1,e) \approx 1$

$$\omega_\mathrm{lib} = n\,\sqrt{\frac{3(B - A)}{C}}$$

Für den Mond ist $(B - A)/C = (227{,}7317 \pm 0{,}0042) \cdot 10^{-6}$ aus der physikalischen
Libration bekannt ([Williams et al. 2014](literatur:williams-2014)); daraus folgt
$\omega_\mathrm{lib}/n = 0{,}0261$, also eine freie Libration in Länge von rund 1045 Tagen.

Entscheidend für den Einfang ist die Form des Gezeitendrehmoments. Ist $\bar{T}$ konstant, kann der
Körper nie eingefangen werden: Er durchläuft die Resonanz und wird weiter abgebremst. Erst ein
Anteil, der vom Vorzeichen von $\dot{\gamma}$ abhängt, macht Einfang möglich. Für
$\bar{T} = -W - Z\,\mathrm{sign}\,\dot{\gamma}$ mit positiven Konstanten $W$ und $Z$ ist die
Einfangwahrscheinlichkeit

$$P = \frac{2 Z}{W + Z}$$

und hängt dann nicht von $(B - A)/C$ ab; bei einem Drehmoment nach MacDonald hängt sie davon ab
([Goldreich und Peale 1966](literatur:goldreich-1966), Gl. 18 und 20). Dieselbe Arbeit zeigte, dass
schon ein sehr kleines $(B - A)/C$ von der Größenordnung $10^{-8}$ genügt, um Merkurs Drehung bei
zwei Dritteln seiner Umlaufzeit festzuhalten; das hinreichende Kriterium lautet dort
$(B - A)/C > 7{,}1 \cdot 10^{-8}/(Q\,H(p,e))$. Gemessen ist Merkurs Unsymmetrie weit größer:
$(B - A)/C_\mathrm{m} = (2{,}206 \pm 0{,}074) \cdot 10^{-4}$ für die librierende Außenschale und
$C_\mathrm{m}/C = 0{,}421 \pm 0{,}021$ ([Stark et al. 2015](literatur:stark-2015)), zusammen
$(B - A)/C = 9{,}3 \cdot 10^{-5}$, rund zehntausendmal mehr als nötig. Dass Merkur nicht synchron
läuft, sondern in 3:2, zeigte erst die Radarmessung von 1965
([Pettengill und Dyce 1965](literatur:pettengill-1965)).

Wie Merkur dorthin kam, ist bis heute Gegenstand der Modellrechnung. Mit einem realistischen
Gezeitenmodell liegt die Einfangwahrscheinlichkeit in die 3:2-Resonanz bei nur rund 7 %; erst wenn
die chaotische Bahnentwicklung die Exzentrizität über 0,325 treibt, wird der Einfang sehr
wahrscheinlich — in 1000 gerechneten Entwicklungen über 4 Milliarden Jahre endeten 55,4 % in 3:2
([Correia und Laskar 2004](literatur:correia-2004)). Nimmt man die Reibung an der Grenze zum
flüssigen Kern hinzu, endet die Drehung in 99,8 % der Fälle in irgendeiner Resonanz, verteilt auf
5:2 (22 %), 2:1 (32 %) und 3:2 (26 %); sank die Exzentrizität in der Vergangenheit unter 0,025 oder
0,005, steigt der Anteil der 3:2-Resonanz auf 55 % beziehungsweise 73 %
([Correia und Laskar 2009](literatur:correia-2009)). Eine Rechnung mit einem Drehmoment aus der
Darwin-Kaula-Entwicklung kommt zu einem anderen Bild: Dort ist 3:2 schon nach einer einzigen
Begegnung mit der Resonanz der wahrscheinlichste Endzustand, der Einfang ist endgültig, und er
geschieht in den meisten Entwicklungen binnen 10 bis 20 Millionen Jahren; eine auch nur schwache
laminare Reibung zwischen Mantel und Kern führte dagegen eher in 2:1 oder höher
([Noyelles et al. 2014](literatur:noyelles-2014)). Spin-Bahn-Resonanzen sind damit ein Seitenstück
zu den [Bahnresonanzen](thema:resonanzen): In beiden Fällen hält ein periodisches Drehmoment ein
Frequenzverhältnis fest, das sonst langsam durchlaufen würde.

## Cassini-Zustände

Gebundene Rotation legt nicht nur die Drehgeschwindigkeit fest, sondern auch die Lage der
Drehachse. Cassini beschrieb für den Mond drei Gesetze: synchrone Rotation, eine konstante
Neigung des Mondäquators gegen die Ekliptik, und die Lage von Drehachse, Ekliptiknormale und
Bahnnormale in einer Ebene, die mit dem Bahnknoten umläuft. Colombo zeigte, dass das zweite und
dritte Gesetz vom ersten unabhängig sind und eine Bewegung kleinster innerer Energiezerstreuung
beschreiben ([Colombo 1966](literatur:colombo-1966)). Peale verallgemeinerte sie: Alle stabilen,
gleichebenen Lagen von Drehvektor, Bahnnormale und Präzessionsvektor sind Extrema der
Orientierungsenergie, und eine solche Lage verknüpft die Trägheitsmomentdifferenzen $(C - A)/C$ und
$(B - A)/C$ ([Peale 1969](literatur:peale-1969)). Es gibt mehrere solcher Cassini-Zustände; sie
werden durchnummeriert, und für gebremste Monde kommen vor allem die Zustände 1 und 2 in Frage.

Welcher davon besetzt wird, hängt vom Körper ab. Ward wandte die verallgemeinerten Gesetze auf
mehrere Körper an und fand, dass allein der Mond eindeutig Zustand 2 einnimmt, während die meisten
Körper in Zustand 1 liegen; Iapetus könnte je nach Abplattung in beiden liegen, und Merkurs
resonante Rotation ändert an Zustand 1 wenig ([Ward 1975](literatur:ward-1975)). Eine
systematische Untersuchung mit bleibender dreiachsiger Deformation bestätigte das: Für die
Parameterbereiche der meisten wirklichen Monde, die auf synchrone Rotation abgebremst wurden, ist
Zustand 1 der einzig mögliche Endpunkt, weil die Unsymmetrie den Zustand 2 mit höherer Schiefe
destabilisiert; der Mond ist die Ausnahme, weil es Zustand 1 für ihn nicht gibt
([Gladman et al. 1996](literatur:gladman-1996)). Der Mondäquator ist deshalb um 1,543° gegen die
Ekliptik geneigt, entgegengesetzt zur Bahnneigung, und präzediert mit dem Knoten in 18,6 Jahren
([Williams et al. 2014](literatur:williams-2014)).

Cassini-Zustände sind messbar, weil die Schiefe klein und genau bestimmbar ist. Merkurs Drehachse
steht $2{,}04 \pm 0{,}08$ Bogenminuten gegen die Bahnnormale, und die Richtung der Neigung spricht
dafür, dass der Planet in oder nahe einem Cassini-Zustand liegt
([Margot et al. 2012](literatur:margot-2012)); die Messung aus der Bahn um Merkur ergab
$2{,}029 \pm 0{,}085$ Bogenminuten ([Stark et al. 2015](literatur:stark-2015)). Bei
[Titan](objekt:titan) sind die Schiefe $0{,}32 \pm 0{,}02^\circ$ und die Abweichung aus der
Cassini-Ebene $0{,}12 \pm 0{,}02^\circ$; aus diesem Abstand vom erwarteten Zustand folgen
$k_2/Q$ zwischen 0,058 und 0,12 und ein Mindestwert $Q \approx 5$
([Downey und Nimmo 2025](literatur:downey-2025)).

## Optische und physikalische Libration

Ein gebunden rotierender Körper zeigt nicht exakt immer dieselbe Seite. Weil er gleichförmig
rotiert, aber nach dem zweiten Keplerschen Gesetz ungleichförmig umläuft, pendelt die Richtung zum
Zentralkörper in Länge; in erster Ordnung beträgt die Amplitude $2e$, beim Mond also 6,29°. Weil
die Drehachse gegen die Bahnnormale geneigt ist, pendelt sie zusätzlich in Breite, beim Mond um
rund ±6,7°. Diese optische Libration ist eine reine Perspektive: Nach der Ephemeride DE441 erreicht
sie beim Mond von 1990 bis 2030 rund ±8° in Länge, und die Reflektorfelder auf der Mondoberfläche
kippen dadurch um bis zu 10° gegen die Sichtlinie ([Murphy 2013](literatur:murphy-2013)). Die
[Szene „Der Tanz des Mondes"](szene:mondtanz) zeigt genau diese ungleichförmige Bahnbewegung.

Die physikalische Libration ist dagegen eine wirkliche Drehschwankung: Das äußere Schweredrehmoment
auf die Deformation ändert sich mit der Bahnphase und regt das Pendel aus dem vorigen Abschnitt an.
Ihre Amplitude hängt von $(B - A)/C$ und vom Abstand der Anregungsfrequenz zur freien
Librationsfrequenz ab; beim Mond folgen aus ihr die Verhältnisse $\beta = (C - A)/B$ und
$\gamma = (B - A)/C$ ([Williams et al. 2014](literatur:williams-2014)). Weil sie das Innere
abtastet, ist sie eines der wenigen Fernerkundungsverfahren für den
[inneren Aufbau](thema:innerer-aufbau) kleiner Körper:

- **Merkur.** Die erzwungene Libration mit der Periode des 88-tägigen Umlaufs hat eine Amplitude von
  $38{,}5 \pm 1{,}6$ Bogensekunden, entsprechend rund 450 m am Äquator. Zusammen mit den
  Schwerefeldkoeffizienten zweiten Grades folgen daraus
  $C/(M R^2) = 0{,}346 \pm 0{,}014$ und ein Anteil der librierenden Schale von
  $C_\mathrm{m}/C = 0{,}431 \pm 0{,}025$: Der Mantel ist von einem mindestens teilweise flüssigen
  Kern entkoppelt ([Margot et al. 2007](literatur:margot-2007);
  [Margot et al. 2012](literatur:margot-2012)).
- **Mimas.** Aus Cassini-Bildern gemessene Librationen bestätigen alle aus der Bahndynamik
  berechneten Amplituden bis auf eine, die doppelt so groß ist wie unter der Annahme
  hydrostatischen Gleichgewichts erwartet. Entweder hat Mimas ein stark nichthydrostatisches
  Inneres oder einen hydrostatischen Ozean unter einer dicken Eisschale
  ([Tajeddine et al. 2014](literatur:tajeddine-2014)).
- **Enceladus.** Ein über sieben Jahre aufgebautes Kontrollpunktnetz ergibt eine erzwungene
  Libration von $0{,}120 \pm 0{,}014^\circ$ (2σ). Der Wert ist zu groß, als dass der Kern starr mit
  der Oberfläche verbunden sein könnte, und verlangt einen globalen Ozean statt eines örtlichen
  Südpolmeeres ([Thomas et al. 2016](literatur:thomas-2016)).
- **Phobos.** Die neueste Ephemeride der Marsmonde führt für [Phobos](objekt:phobos) eine
  physikalische Libration von 1,14° ([Brozović et al. 2025](literatur:brozovic-2025)).

## Messung der Rotation

Die Rotationsparameter der Körper des Sonnensystems sammelt der IAU-Arbeitskreis für
kartografische Koordinaten und Rotationselemente. Er beschreibt die Stellung des Nullmeridians
durch den Winkel $W$, gemessen längs des Körperäquators vom Knoten $Q$ auf dem ICRF-Äquator, als
$W = W_0 + \dot{W}\,d$ mit dem Abstand $d$ in Tagen von der Standardepoche; wächst $W$ mit der
Zeit, ist die Rotation rechtläufig, sinkt er, rückläufig
([Archinal et al. 2011](literatur:archinal-2011)). Derselbe Bericht macht deutlich, wie dünn die
Datenlage bei vielen Monden ist: In Ermangelung anderer Angaben wird die Drehachse als senkrecht
auf der mittleren Bahnebene angenommen, und für viele Satelliten wird angenommen, dass die
Rotationsperiode gleich der Umlaufzeit ist — eine Annahme, die in manchen Fällen noch zu bestätigen
ist.

Wo wirklich gemessen wird, geschieht das auf vier Wegen. **Radar** von der Erde aus verfolgt
Streumuster, die sich mit der Oberfläche mitdrehen; damit wurden Merkurs Schiefe und Libration
bestimmt ([Margot et al. 2007](literatur:margot-2007)) und Venus über fünfzehn Jahre vermessen
([Margot et al. 2021](literatur:margot-2021)). **Kontrollpunktnetze** aus Raumsondenbildern
verfolgen identifizierbare Oberflächenpunkte über Jahre; die Librationen von Mimas und Enceladus
stammen aus solchen Netzen, bei Mimas mit Stereophotogrammetrie
([Tajeddine et al. 2014](literatur:tajeddine-2014);
[Thomas et al. 2016](literatur:thomas-2016)). **Laserhöhenmessung** mit Stereo-Geländemodellen
liefert dasselbe aus der Umlaufbahn: Drei Jahre MESSENGER-Profile, auf Geländemodelle
koregistriert, ergaben Merkurs Librationsamplitude, Schiefe und eine mittlere Rotationsrate von
$6{,}13851804 \pm 9{,}4 \cdot 10^{-7}$ Grad je Tag, entsprechend einer Rotationsperiode von
$58{,}6460768 \pm 0{,}0000090$ Tagen ([Stark et al. 2015](literatur:stark-2015)). **Schwerefeld
und Drehung zusammen** ergeben schließlich das Trägheitsmoment, wie bei Merkur und beim Mond, wo
Laserentfernungen die Librationswinkel und GRAIL die Schwerekoeffizienten beisteuerten
([Williams et al. 2014](literatur:williams-2014)).

## Pluto und Charon: doppelt gebunden

Wenn beide Körper einander binden, steht das System still: Jeder zeigt dem anderen dauerhaft
dieselbe Seite, und es wird kein Drehimpuls mehr übertragen. [Pluto](objekt:pluto) und
[Charon](objekt:charon) sind das bekannteste Beispiel im Sonnensystem. Rechnungen, die von einem
Anfangszustand mit Charon auf einer exzentrischen Bahn bei
etwa vier Plutoradien ausgehen — passend zu einer Entstehung durch einen Einschlag — und den
gesamten Drehimpuls erhalten, erreichen den doppelt synchronen Endzustand nur, wenn der
Schwerekoeffizient $C_{22}$ beider Körper mitgeführt wird; unterwegs wird Charons Drehung
vorübergehend in Spin-Bahn-Resonanzen eingefangen, um die sie dann gedämpft libriert. Der Verlauf
hängt stark vom Gezeitenmodell ab, und das Verhältnis der Dissipation in Charon zu der in Pluto
steuert, wie sich die Exzentrizität entwickelt ([Cheng et al. 2014](literatur:cheng-2014)). Die
[Szene „Pluto und Charon im Doppel"](szene:pluto-charon) zeigt dieses Paar. Die vier kleinen Monde
des Systems verhalten sich ganz anders: Styx, Nix und Hydra sind durch eine Dreikörperresonanz
verbunden, in die Störungen der übrigen Körper Chaos eintragen, und Nix und Hydra rotieren
chaotisch, getrieben von den großen Drehmomenten des Doppelsystems
([Showalter und Hamilton 2015](literatur:showalter-2015)).

## Venus: feste Gezeiten gegen Atmosphärengezeiten

[Venus](objekt:venus) ist nicht gebunden, obwohl sie der Sonne nahe genug steht und alt genug ist.
Radarmessungen von 2006 bis 2020 ergeben einen mittleren siderischen Tag von
$243{,}0226 \pm 0{,}0013$ Erdtagen, rückläufig, eine Neigung der Drehachse gegen die Bahnebene von
$2{,}6392 \pm 0{,}0008^\circ$ und ein normiertes Trägheitsmoment von $0{,}337 \pm 0{,}024$; die
Rotationsperiode des festen Planeten schwankt um 61 ppm, rund 20 Minuten, was den Übergang von
mindestens 4 % des atmosphärischen Drehimpulses auf den festen Körper verlangt
([Margot et al. 2021](literatur:margot-2021)). Genau dieser Austausch ist ein Grund, warum Venus
nicht gebunden ist: Die Gezeit der dichten Atmosphäre wirkt der Gezeit des festen Körpers
entgegen.

Schon Goldreich und Peale erwogen für Venus eine Resonanz der zweiten Art, bei der die Drehung mit
der synodischen Bewegung gegenüber der Erde kommensurabel wäre, fanden aber, dass dafür ein großes
$(B - A)/C > 10^{-4}$ nötig wäre und die Einfangwahrscheinlichkeit klein ausfällt
([Goldreich und Peale 1966](literatur:goldreich-1966)). Die heutige Erklärung kommt ohne diese
Resonanz aus: Erdähnliche Planeten mit dichter Atmosphäre entwickeln sich in einen von nur vier
möglichen Rotationszuständen, und die meisten Anfangsbedingungen führen auf den heute beobachteten
— entweder über das klassische Umklappen der Drehachse oder, ohne jede Drehung der Achse, durch
Abbremsen einer rechtläufigen Rotation bis zur Umkehr, während die Schiefe gegen null geht
([Correia und Laskar 2001](literatur:correia-2001)).

## Chaotische Rotation

Nicht jede Bremsung endet in einer Resonanz. Ist ein Mond stark unregelmäßig geformt und läuft er
auf einer exzentrischen Bahn, können die Resonanzzonen überlappen, und die Drehung wird chaotisch.
Hyperion ist das Lehrbuchbeispiel: Unter der Annahme einer Drehung um eine Hauptachse senkrecht zur
Bahnebene umgibt eine große chaotische Zone den synchronen Zustand, so groß, dass sie die Zustände
1:2 und 2:1 einschließt und eine Libration im 3:2-Zustand unmöglich macht. Rotation in dieser Zone
ist außerdem gegen ein Kippen der Achse instabil, sodass der Mond taumelt, sobald die
Gezeitenbremse ihn in die Zone führt ([Wisdom et al. 1984](literatur:wisdom-1984)). Cassini fand
Hyperion als den einzigen Mond, bei dem chaotische Rotation beobachtet ist, mit einer mittleren
Dichte von $544 \pm 50\,\mathrm{kg}\,\mathrm{m}^{-3}$ und einer Porosität über 40 %
([Thomas et al. 2007](literatur:thomas-2007)).

Eine dreidimensionale Behandlung ohne die Annahme einer Hauptachsendrehung kommt allerdings zu
einem anderen Schluss: Resonanzen zwischen Nutations- und Bahnfrequenz treiben die Dynamik,
Hyperion taumelt entgegen der langjährigen Auffassung nicht chaotisch, sondern liegt nahe an oder
in einer in der Exzentrizität ersten Nutations-Bahn-Resonanz und rotiert damit quasi-regulär; die
sogenannte Fassinstabilität gehört zu einer anderen Gruppe derselben Resonanzen
([Goldberg und Batygin 2024](literatur:goldberg-2024)). Unabhängig davon ist chaotische Rotation
kein Randphänomen: Trägt man die bekannten Monde in ein Stabilitätsdiagramm aus Trägheitsparameter
und Exzentrizität ein, so kann die Mehrzahl der Monde mit unbekanntem Rotationszustand gar nicht
synchron rotieren, weil für sie kein stabiler 1:1-Zustand existiert; sie drehen sich entweder weit
schneller oder, weit weniger wahrscheinlich, chaotisch
([Melnikov und Shevchenko 2010](literatur:melnikov-2010)).

## Nicht ganz synchron: Europa und Titan

Wenn die Bahn exzentrisch ist, liegt die Gleichgewichtsdrehung eines reibungsbehafteten Körpers
etwas über der synchronen — es sei denn, eine bleibende Unsymmetrie hält ihn fest.
[Europa](objekt:europa) hat durch das Zusammenspiel mit Io und Ganymed eine erzwungene
Exzentrizität von etwa 0,01, und Schweredaten legten eine bleibende Unsymmetrie nahe, die groß
genug wäre, das Gezeitendrehmoment auszugleichen. Wird dennoch nichtsynchrone Rotation beobachtet,
ist die Kruste vermutlich durch eine flüssige oder duktile Schicht vom Inneren entkoppelt. Aus
Orientierung und Verteilung der Lineamente in frühen Galileo-Aufnahmen wurde geschlossen, dass
Europa schneller als synchron rotiert oder es in der Vergangenheit tat
([Geissler et al. 1998](literatur:geissler-1998)). Eine Auswertung der hemisphärischen
Farbdichotomie, die durch den Beschuss der nachlaufenden Hemisphäre mit energiereichen Teilchen aus
der Magnetosphäre Jupiters entsteht und deshalb nur bestehen bleibt, wenn die Verfärbung viel
schneller wirkt als die Drehung gegen den synchronen Zustand, findet dagegen in Voyager-Daten
keine nachweisbare Signatur nichtsynchroner Rotation — was die offene Frage nach dem Ursprung der
Spannungen verschärft, die Europas Tektonik erzeugen
([Burnett und Hayne 2021](literatur:burnett-2021)).

Bei Titan geht es nicht um die Geschwindigkeit, sondern um die Achse: Die gemessene Abweichung vom
erwarteten Rotationszustand — Schiefe und Lage gegen die Cassini-Ebene — ist größer, als ein
vollständig gedämpfter starrer Körper zeigen dürfte, und erlaubt gerade deshalb den Rückschluss auf
die Dissipation im Inneren ([Downey und Nimmo 2025](literatur:downey-2025)).

## Gebundene Körper im Sonnensystem

Die Auswahl zeigt, worauf die Zuordnung jeweils beruht. „Angenommen" heißt: aus der Theorie
erwartet, aber nicht gemessen.

| Körper | Zustand | Verfahren | Beleg |
|---|---|---|---|
| Mond | 1:1, Cassini-Zustand 2 | Laserentfernungen, Schwerefeld | [Williams et al. 2014](literatur:williams-2014); [Gladman et al. 1996](literatur:gladman-1996) |
| Merkur | 3:2, Cassini-Zustand | Radar; Laserhöhenmessung mit Stereomodell | [Pettengill und Dyce 1965](literatur:pettengill-1965); [Stark et al. 2015](literatur:stark-2015) |
| Phobos | 1:1, Libration 1,14° | Ephemeride aus Bild- und Bahndaten | [Brozović et al. 2025](literatur:brozovic-2025) |
| Europa | 1:1 oder sehr langsam nichtsynchron | Lineamente; Farbdichotomie | [Geissler et al. 1998](literatur:geissler-1998); [Burnett und Hayne 2021](literatur:burnett-2021) |
| Mimas | 1:1, Libration doppelt so groß wie hydrostatisch erwartet | Stereophotogrammetrie aus Cassini-Bildern | [Tajeddine et al. 2014](literatur:tajeddine-2014) |
| Enceladus | 1:1, Libration 0,120° ± 0,014° | Kontrollpunktnetz aus sieben Jahren Cassini-Bildern | [Thomas et al. 2016](literatur:thomas-2016) |
| Titan | 1:1, Cassini-Zustand, Schiefe 0,32° | Rotationszustand gegen die Cassini-Ebene | [Downey und Nimmo 2025](literatur:downey-2025); [Gladman et al. 1996](literatur:gladman-1996) |
| Hyperion | chaotisch oder nahe einer Nutations-Bahn-Resonanz | Beobachtungen und Modelle | [Wisdom et al. 1984](literatur:wisdom-1984); [Goldberg und Batygin 2024](literatur:goldberg-2024) |
| Pluto und Charon | doppelt 1:1 | Bahnbestimmung und Gezeitenmodell | [Cheng et al. 2014](literatur:cheng-2014) |
| Nix, Hydra | chaotisch | Beobachtung des Rotationszustands | [Showalter und Hamilton 2015](literatur:showalter-2015) |
| Venus | nicht gebunden, 243,0226 d rückläufig | Radar 2006 bis 2020 | [Margot et al. 2021](literatur:margot-2021) |
| die meisten übrigen Monde | 1:1 angenommen | IAU-Rotationsmodell | [Archinal et al. 2011](literatur:archinal-2011) |
| unregelmäßige Monde | meist schnelle Rotation, kein stabiler 1:1-Zustand | Stabilitätsdiagramm | [Melnikov und Shevchenko 2010](literatur:melnikov-2010) |

Die theoretische Grundlage dieser Zuordnungen, von der Gezeitenbremsung über die Stabilität der
Resonanzen bis zu dem bleibenden Quadrupolmoment, das der Mond braucht, um synchron zu bleiben,
steht zusammenhängend bei [Murray und Dermott 2000](literatur:murray-2000), Kapitel 5.

## Offene Fragen

- **Rotiert Hyperion chaotisch?** Das klassische ebene Modell sagt Taumeln voraus, und die
  Beobachtung galt als Bestätigung ([Wisdom et al. 1984](literatur:wisdom-1984);
  [Thomas et al. 2007](literatur:thomas-2007)). Das dreidimensionale Modell ohne Annahme einer
  Hauptachsendrehung kommt zum gegenteiligen Schluss und hält die verlässlichsten Beobachtungen für
  vereinbar mit nichtchaotischer Bewegung oder mit Chaos, das Größenordnungen schwächer ist als
  ursprünglich behauptet ([Goldberg und Batygin 2024](literatur:goldberg-2024)). Der Streit ist
  offen.
- **Rotiert Europa nichtsynchron?** Die Lineamente sprachen dafür
  ([Geissler et al. 1998](literatur:geissler-1998)), die Farbdichotomie findet keine Signatur
  ([Burnett und Hayne 2021](literatur:burnett-2021)). Beide Befunde lassen sich nur über sehr
  lange Umlaufzeiten der Kruste vereinbaren, und die Alternative — eine bleibende Unsymmetrie, die
  das Gezeitendrehmoment ausgleicht — verlangt dann eine andere Quelle für die Spannungen, die die
  Bruchmuster erzeugen.
- **Wie kam Merkur in die 3:2-Resonanz?** Chaotische Bahnentwicklung mit hoher Exzentrizität
  liefert 55,4 % ([Correia und Laskar 2004](literatur:correia-2004)), mit Kern-Mantel-Reibung
  26 % neben 32 % für 2:1 ([Correia und Laskar 2009](literatur:correia-2009)), und ein Drehmoment
  aus der Darwin-Kaula-Entwicklung macht 3:2 schon nach der ersten Begegnung zum
  wahrscheinlichsten Ausgang, kehrt aber die Rolle der Kern-Mantel-Reibung um
  ([Noyelles et al. 2014](literatur:noyelles-2014)). Welcher Gezeitenrheologie man folgt,
  entscheidet die Antwort.
- **Ist Venus im Gleichgewicht?** Vier Endzustände sind möglich, und zwei Wege führen auf den
  heutigen ([Correia und Laskar 2001](literatur:correia-2001)); ob die heutige Drehung ein
  Gleichgewicht zwischen fester und atmosphärischer Gezeit ist oder noch driftet, ist offen. Die
  gemessenen Schwankungen der Tageslänge von 61 ppm zeigen, wie stark die Atmosphäre auf den festen
  Körper wirkt ([Margot et al. 2021](literatur:margot-2021)).
- **Mimas' Inneres.** Die zu große Libration lässt sich durch ein stark nichthydrostatisches
  Inneres oder durch einen Ozean unter dicker Eisschale erklären; die Librationsmessung allein
  trennt die beiden Deutungen nicht ([Tajeddine et al. 2014](literatur:tajeddine-2014)).

## Im Modell

Orrery dreht jeden Körper gleichförmig: Die Rotationsphase ist bei allen 35 Körpern zur Epoche
null und wächst mit der festen Rotationsperiode des Datensatzes um einen festen Pol; eine negative
Periode dreht rückläufig. Es gibt kein IAU-Modell $W(t)$, keine periodischen Glieder, keine
physikalische Libration und keine Cassini-Zustände. Die Phase zählt auch nicht vom Knoten $Q$,
sondern von der Richtung, in die die kürzeste Drehung der Kugel auf den Körperpol die Kartenmitte
bringt. Die Tabelle unten gibt den Winkel zwischen dieser Kartenmitte — bei einer Plattkarte mit
dem Nullmeridian in der Bildmitte also dem Nullmeridian — und der Richtung zum Mutterkörper.

- **Gebundene Rotation steckt allein in den Perioden.** Bei allen 21 Monden ist die
  Rotationsperiode gleich der siderischen Umlaufzeit $360^\circ/\dot{L}$ des eigenen Datensatzes,
  bis auf Rundungsreste von höchstens $0{,}66 \cdot 10^{-6}$ (Deimos). Diese Reste lassen die
  Richtung zum Mutterkörper langsam über die Karte wandern: 6,9° je Jahrhundert bei Deimos, 1,2°
  bei Mimas, 1,1° bei Miranda, bei allen übrigen unter 0,6°.
- **Libration.** Sie entsteht im Modell nur aus der Exzentrizität — die Länge pendelt um $2e$,
  beim Mond über 12,6°, bei Titan über 6,6° — und aus der Neigung der Bahn gegen den festen Pol,
  die die Breite pendeln lässt. Der Ausschlag in Breite ist genau der Winkel zwischen Pol und
  Bahnnormale: beim Mond zur Epoche ±6,7°, bei Miranda ±4,3°, bei Triton ±21,4°. Bei den beiden
  letzteren wandert der Bahnknoten im Datensatz nicht, der Ausschlag bleibt also fest. Bei Triton
  kommt dadurch auch in Länge
  ein Ausschlag von ±2,1° zustande, obwohl $2e$ dort nur 0,02° beträgt: Es ist die Reduktion auf
  den Äquator, nicht die Bahnexzentrizität.
  Bei Triton und Miranda ist dieser Ausschlag ein Artefakt des Datensatzes: Der IAU-Bericht gibt
  ihre Pole als Reihen mit großen periodischen Gliedern an — für Triton
  $299{,}36^\circ - 32{,}35^\circ \sin N_7 - \ldots$ und
  $41{,}17^\circ + 22{,}55^\circ \cos N_7 + \ldots$, für Miranda
  $257{,}43^\circ + 4{,}41^\circ \sin U_{11} - \ldots$ und
  $-15{,}08^\circ + 4{,}25^\circ \cos U_{11} - \ldots$
  ([Archinal et al. 2011](literatur:archinal-2011)). Diese Glieder beschreiben die Präzession, mit
  der die Drehachse der wandernden Bahnnormale folgt; der Datensatz führt nur die konstanten
  Glieder, und der Pol steht im Modell fest.
- **Mond.** Rotationsperiode 655,71984 h $= 360^\circ/\dot{L} = 27{,}32166$ Tage, also ohne
  Abweichung; die Kepler-Umlaufzeit des Datenblocks ist 0,11 % kürzer. Der Winkel zwischen
  Kartenmitte und Erdrichtung beträgt zur Epoche 41,7°, am 19. September 2026 37,5°, 1900 31,2°
  und 2100 34,1°; im Mittel steht die Erde über 37,0° östlicher Länge der Karte, im Monatslauf
  zwischen 30,5° und 43,5°. Der Pol steht fest, während der Bahnknoten wandert: Pol und
  Bahnnormale liegen zur Epoche 6,72° auseinander, im Minimum 3,57° und am 19. September 2026
  3,76°. Ein Cassini-Zustand ist das nicht, auch wenn die Lage zur Epoche ihm nahekommt.
- **Merkur.** Die Rotationsperiode 1407,6 h $= 58{,}65$ Tage ist das gerundete Faktenblattmittel.
  Zwei Drittel der siderischen Umlaufzeit des Datensatzes wären 58,6461709 Tage; die Drehung bleibt
  deshalb je Jahrhundert um 14,6° hinter der 3:2-Kopplung zurück, und gegen die gemessenen
  58,6460768 Tage ist die Modellperiode 339 s zu lang. Die aus Pol und Bahn gerechnete Achsneigung
  Merkurs beträgt im Modell 0,034° und trifft damit die gemessenen $2{,}029 \pm 0{,}085$
  Bogenminuten: Der Pol des Datensatzes stammt aus dem IAU-Bericht und trägt die Cassini-Lage
  bereits in sich, ohne dass das Modell sie nachbildete.
- **Venus.** Die Rotationsperiode ist $-5832{,}6$ h $= -243{,}025$ Tage; der Sonnentag beträgt im
  Modell 116,75 Tage und die synodische Periode gegenüber der Erde 583,92 Tage, also das
  5,0014-Fache — die bekannte Beinahe-Kommensurabilität bleibt damit erhalten. Die gerechnete
  Achsneigung 177,3624° entspricht den gemessenen 2,6392° gegen die Bahnebene bei rückläufiger
  Drehung.
- **Pluto und Charon.** Beide tragen dieselbe Polrichtung und dieselbe Rotationsperiode
  153,29335 h; Charons Umlaufzeit ist 153,29333 h. Sie zeigen einander damit dauerhaft dieselbe
  Seite, allerdings nicht die Kartenmitte: Der Winkel zwischen Kartenmitte und Partnerrichtung
  liegt bei 131,1° (Pluto) und 48,9° (Charon) und wandert je Jahrhundert um nur 0,3°.
- **Was fehlt.** Hyperion, Janus, Epimetheus, Nix und Hydra sind nicht im Katalog; chaotische
  Rotation kommt im Modell nirgends vor. Es gibt keine Gezeitendrehmomente, keine
  Kern-Mantel-Reibung und keine Atmosphärengezeiten, also auch keine Entwicklung eines
  Rotationszustands. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

Die folgende Tabelle ist am Code nachgerechnet. Der Winkel misst den Abstand zwischen der
Kartenmitte und der Richtung zum Mutterkörper, bei Pluto zu Charon; „+100 a" ist der
1. Januar 2100. Bei Merkur wandert der Unterpunkt der Sonne in der 3:2-Kopplung ständig um den
ganzen Körper, die beiden Winkel sind dort nur Momentaufnahmen.

| Körper | $P_\mathrm{rot}/P_\mathrm{sid} - 1$ in $10^{-6}$ | Winkel J2000 | Winkel +100 a |
|---|---|---|---|
| Merkur | −333 290 | 79,4° | 143,4° |
| Mond | 0,000 | 41,7° | 34,1° |
| Phobos | 0,000 | 103,7° | 102,5° |
| Deimos | 0,660 | 149,6° | 156,4° |
| Io | −0,047 | 162,8° | 163,1° |
| Europa | 0,070 | 31,5° | 31,2° |
| Ganymed | −0,012 | 39,0° | 39,1° |
| Kallisto | 0,055 | 101,2° | 102,5° |
| Mimas | 0,088 | 143,6° | 145,7° |
| Enceladus | −0,061 | 136,2° | 135,8° |
| Tethys | 0,044 | 140,8° | 141,0° |
| Dione | −0,061 | 130,5° | 130,0° |
| Rhea | −0,018 | 5,9° | 5,8° |
| Titan | −0,005 | 37,7° | 40,0° |
| Iapetus | 0,001 | 46,0° | 47,2° |
| Miranda | 0,118 | 77,6° | 78,6° |
| Ariel | 0,066 | 46,7° | 46,6° |
| Umbriel | 0,020 | 0,8° | 1,2° |
| Titania | 0,019 | 31,9° | 31,6° |
| Oberon | 0,006 | 102,6° | 102,6° |
| Triton | 0,028 | 19,4° | 12,0° |
| Pluto | 0,144 | 131,1° | 131,4° |
| Charon | 0,144 | 48,9° | 48,6° |

Miranda, Ariel, Umbriel, Titania, Oberon und Triton haben eine negative Rotationsperiode. Ihre
Bahnneigung gegen den Äquator des Mutterkörpers liegt im Datensatz über 90°, sodass sie diesen Pol
ebenfalls rückläufig umlaufen: Drehung und Umlauf bleiben gleichsinnig. Die Tabelle vergleicht
deshalb die Beträge.

*Stand: September 2026*
