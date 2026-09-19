# Gezeiten und Roche-Grenze

Gezeiten entstehen, weil das Schwerefeld eines Körpers über die Ausdehnung eines anderen nicht
gleich stark ist. Wie stark sich ein Körper darunter verformt, hängt auch von seinem
[inneren Aufbau](thema:innerer-aufbau)
ab ([Murray und Dermott 2000](literatur:murray-2000), Kapitel 4); wie viel Energie er dabei
verliert, bestimmt, wie schnell sich Bahnen und Rotationen verändern. Dieser Text führt vom
Gezeitenpotential über Love-Zahlen und Dissipation zu Bahnentwicklung, Gezeitenheizung,
gebundener Rotation und Roche-Grenze und ordnet ein, was Orrery davon abbildet.

## Gezeitenpotential und Gezeitenbeschleunigung

Eine Masse $M$ im Abstand $d$ erzeugt an einem Punkt $\vec{r}$, gemessen vom Schwerpunkt eines
ausgedehnten Körpers, ein Potential, dessen konstanter Teil nichts bewirkt und dessen linearer
Teil den Körper als Ganzes beschleunigt. Verformend wirkt in führender Ordnung der Term zweiten
Grades, wie ihn auch die IERS Conventions verwenden
([Petit und Luzum 2010](literatur:petit-2010), Gl. 6.6 und 7.5):

$$W_2 = \frac{G M r^2}{d^3}\,P_2(\cos\psi), \quad P_2(x) = \frac{3 x^2 - 1}{2}$$

Dabei ist $\psi$ der Winkel zwischen $\vec{r}$ und der Richtung $\hat{d}$ zur störenden Masse. Der
Gradient ist die Gezeitenbeschleunigung:

$$\vec{a}_\mathrm{G} = \nabla W_2 = \frac{G M r}{d^3}\left( 3 \cos\psi\,\hat{d} - \hat{r} \right)$$

Auf der Verbindungslinie zieht sie mit $2 G M r/d^3$ nach außen, auf beiden Seiten; quer dazu
drückt sie mit $G M r/d^3$ nach innen. An der Erdoberfläche erreicht der Mond so
$1{,}1 \cdot 10^{-6}\,\mathrm{m}\,\mathrm{s}^{-2}$, rund $10^{-7}$ der Schwerebeschleunigung;
die Sonne bringt das 0,46-Fache. Ein Ozean im Gleichgewicht auf einer starren Erde stünde unter
dem Mond um $W_2/g = 0{,}36\,\mathrm{m}$ über dem ungestörten Niveau, Flut und Ebbe lägen 0,53 m
auseinander.

## Love-Zahlen

Ein nachgiebiger Körper antwortet auf $W_2$ mit einer Verformung, die selbst ein Potential erzeugt.
Die Love-Zahl $k_2$ beschreibt dieses Zusatzpotential, $h_2$ die radiale und die Shida-Zahl $l_2$
die waagerechte Verschiebung der Oberfläche ([Love-Zahlen](quelle:wikipedia-de-love-zahlen);
[Petit und Luzum 2010](literatur:petit-2010), Kapitel 6 und Gl. 7.5). Für einen Körper mit Radius
$R$ und Schwerebeschleunigung $g$ gilt

$$\Phi_\mathrm{ind}(r) = k_2\,W_2(R)\left( \frac{R}{r} \right)^3, \quad u_r = h_2\,\frac{W_2(R)}{g}$$

So geht $k_2$ in die zeitliche Änderung der Schwerefeldkoeffizienten zweiten Grades ein und $h_2$ in
die Verschiebung von Messstationen ([Petit und Luzum 2010](literatur:petit-2010), Gl. 6.6 und
7.5). Ein starrer Körper hätte $k_2 = h_2 = 0$. Gemessen wird $k_2$ über die zeitliche Änderung
des Schwerefelds in der Bahnverfolgung von Raumsonden oder über die Bahnen von Monden, $h_2$ über
Laserhöhenmessung, Laserentfernungen zu Reflektoren und auf der Erde über Stationsbewegungen:

| Körper | $k_2$ | $h_2$ | Verfahren | Beleg |
|---|---|---|---|---|
| Erde | 0,30102 (halbtägig, Imaginärteil −0,00130) | 0,6078 | Zahlenstandard aus Erdmodellen, ohne Unsicherheit; VLBI-Schätzungen für zwölf tägliche Tiden verschieben die Stationen gegenüber den konventionellen Werten radial zusammen um 1,7 mm, quer um 1,2 mm | [Petit und Luzum 2010](literatur:petit-2010); [Krásná et al. 2013](literatur:krasna-2013) |
| Mond | 0,02416 ± 0,00022 (Periode 1 Monat) | 0,0387 ± 0,0025 | GRAIL, Mittel zweier Analysen; LOLA-Laserhöhenmessung | [Williams et al. 2014](literatur:williams-2014); [Thor et al. 2021](literatur:thor-2021) |
| Mars | 0,169 ± 0,006 | – | Bahnverfolgung von Mars Odyssey, MRO und MGS | [Konopliv et al. 2020](literatur:konopliv-2020) |
| Titan | 0,608 ± 0,048 (Realteil, 1σ) | – | Doppler von zehn Cassini-Vorbeiflügen, neu ausgewertet | [Petricca et al. 2025](literatur:petricca-2025) |

Außer für die Erde lagen beide Zahlen bis 2020 nur für den Mond vor, und dort streuen die
Verfahren: Laserentfernungen ergaben für $h_2$ je nach Auswertung 0,0410 bis 0,0476, die
Kreuzungspunkte der LOLA-Bahnen $0{,}0371 \pm 0{,}0033$ und ein Innenmodell, das den GRAIL-Wert
von $k_2$ trifft, 0,0424 ([Thor et al. 2021](literatur:thor-2021)). Bei Titan maß Cassini zuerst
$0{,}589 \pm 0{,}150$ und $0{,}637 \pm 0{,}224$ (2σ), eine Verformung, die mit einem globalen
Ozean verträglich ist ([Iess et al. 2012](literatur:iess-2012)). Eine eigene Auswertung der
Cassini-Daten fand nur $0{,}375 \pm 0{,}06$ ([Goossens et al. 2024](literatur:goossens-2024));
vier frühere Analysen lagen bei 0,59 bis 0,64 ([Durante et al. 2026](literatur:durante-2026)).
Goossens et al. halten in ihrer Antwort dagegen, Unterschiede in der Auswertung erklärten den
abweichenden Wert nicht ([Goossens et al. 2026](literatur:goossens-2026)). Zwei neuere Auswertungen
stützen den hohen Wert: $0{,}608 \pm 0{,}048$
([Petricca et al. 2025](literatur:petricca-2025)) und $0{,}596 \pm 0{,}094$
([Magnanini et al. 2026](literatur:magnanini-2026), Tabelle C.2), beide 1σ.

## Phasenverzug, Güte Q und k₂/Q

Reibung im Inneren lässt die Antwort hinter der Anregung zurückbleiben. Die Güte $Q$ ist das
Verhältnis der Spitzenenergie der Verformung zum Energieverlust je Radiant der Schwingung. Mit dem
Phasenverzug $\varepsilon$ und dem geometrischen Winkel $\delta$ zwischen Gezeitenbeule und
störendem Körper gilt ([Efroimsky und Lainey 2007](literatur:efroimsky-2007))

$$Q^{-1} = \tan\varepsilon = \tan 2\delta, \quad \mathrm{Im}(k_2) = -\frac{|k_2|}{Q}$$

Wer den Faktor 2 übersieht, erhält ein doppelt so großes $Q$
([Efroimsky und Lainey 2007](literatur:efroimsky-2007)). Die zweite Beziehung ist die häufige
Definition für die komplexe Love-Zahl; astrometrische Messungen bestimmten lange nur $|k_2|/Q$, nicht
den Realteil ([Park et al. 2025](literatur:park-2025)):

| Körper | Messgröße | Wert | Periode oder Bezug | Beleg |
|---|---|---|---|---|
| Erde, feste Erde | Phasenverzug; $Q$ | 0,16° ± 0,09°; 370 | Hauptmondgezeit, 12,4 h | [Ray et al. 1996](literatur:ray-1996) |
| Mond | $Q$ | 38 ± 4; 41 ± 9; ≥ 74; ≥ 58 | 1 Monat; 1; 3; 6 Jahre | [Williams und Boggs 2015](literatur:williams-2015) |
| Mars | $k_2/Q$ | (1,816 ± 0,084) · 10⁻³ | Gezeit durch Phobos | [Brozović et al. 2025](literatur:brozovic-2025) |
| Io | $k_2/Q$ | 0,015 ± 0,003 | Astrometrie | [Lainey et al. 2009](literatur:lainey-2009) |
| Io | Realteil $k_2$; $Q$ | 0,125 ± 0,047; 11,4 ± 3,6 (1σ) | Juno, Galileo, Astrometrie | [Park et al. 2025](literatur:park-2025) |
| Titan | Imaginärteil $k_2$; $Q$ | 0,135 ± 0,035; 4,5 ± 1,1 | Cassini-Doppler | [Petricca et al. 2025](literatur:petricca-2025) |
| Jupiter | $k_2/Q$ | (1,102 ± 0,203) · 10⁻⁵ | Galileische Monde, konstantes $Q$ | [Lainey et al. 2009](literatur:lainey-2009) |
| Saturn | $k_2$; $Q$ | 0,382 ± 0,017; 75 (+176/−31), beide 3σ | Frequenz Titans | [Magnanini et al. 2026](literatur:magnanini-2026) |

Die Dissipation der festen Erde ist schwer zu messen, weil die Ozeane weit mehr Energie
verbrauchen; frühere Schätzungen des halbtägigen $Q$ reichten von 90 bis 500
([Ray et al. 1996](literatur:ray-1996)). Mit dem GRAIL-Wert ergibt sich für den Mond
$k_2/Q \approx 6{,}4 \cdot 10^{-4}$ bei einem Monat, mit $k_2 = 0{,}169$ für Mars ein $Q$ von
rund 93.

$Q$ hängt von der Frequenz $\chi$ ab, und jedes Gezeitenmodell legt diese Abhängigkeit fest: Ein
konstanter geometrischer Winkel (Gerstenkorn, MacDonald, Kaula) bedeutet frequenzunabhängiges $Q$,
eine konstante Zeitverzögerung (Singer, Mignard) $Q \propto \chi^{-1}$. Gestein zeigt dagegen
zwischen $10^{7}\,\mathrm{Hz}$ und einem Zyklus je Jahr $Q \propto \chi^{\alpha}$ mit
$\alpha = 0{,}2$ bis $0{,}4$ (0,2 bei Teilschmelzen), bei Perioden von einem bis hundert Jahren
etwa $Q \propto \chi$ ([Efroimsky und Lainey 2007](literatur:efroimsky-2007)). Beim Mond wächst
$Q$ vom Monat zu drei Jahren; dazu passen Modelle mit einem Absorptionsband um 120 Tage
([Williams und Boggs 2015](literatur:williams-2015)). In Riesenplaneten dissipiert neben der
Gleichgewichtsgezeit auch die dynamische Gezeit, also angeregte Wellen und Eigenschwingungen; nahe
einer Resonanz sinkt die Auswanderungszeit eines Mondes um Größenordnungen
([Fuller et al. 2016](literatur:fuller-2016)).

## Bahnentwicklung

Dreht sich ein Planet schneller, als seine Monde umlaufen, überträgt die Dissipation Drehimpuls auf
die Bahnen, und die Monde wandern nach außen. Mit $k_2$, $Q$ und Radius $R$ des Planeten,
Mondmasse $m$, Planetenmasse $M$ und mittlerer Bewegung $n$ des Mondes gilt
([Fuller et al. 2016](literatur:fuller-2016), Gl. 1 und 2)

$$\frac{\dot{a}}{a} = 3\,\frac{k_2}{Q}\,\frac{m}{M}\left( \frac{R}{a} \right)^5 n$$

Bei konstantem $Q$ fällt $\dot{a}$ mit $a^{-11/2}$; äußere Monde wie Titan dürften danach kaum
wandern ([Lainey et al. 2020](literatur:lainey-2020)).

**Erde und Mond.** Aus Laserentfernungen zum [Mond](objekt:moon) und geophysikalischen
Gezeitenmodellen folgen eine Abnahme der mittleren Bewegung um 25,97 ± 0,05″ je Jahrhundert² und
$\dot{a} = 38{,}30 \pm 0{,}08\,\mathrm{mm}$ je Jahr. Den größten Teil bewirkt die Dissipation auf
der Erde, die im Mond verringert die Exzentrizitätsrate. Für die Erdrotation sagt das
geophysikalische Modell 2,395 ms Zunahme der Tageslänge je Jahrhundert voraus
([Williams und Boggs 2016](literatur:williams-2016)). Finsternisse und Sternbedeckungen seit
720 v. Chr. zeigen im Mittel nur +1,8 ms je Jahrhundert
([Stephenson et al. 2016](literatur:stephenson-2016)); zur Deutung siehe [Erde](objekt:earth).

**Jupiter und Io.** Die Wärme in [Io](objekt:io) stammt aus der Bahnenergie und beschleunigt Io auf
der Bahn, die Dissipation in Jupiter bremst Io. Die Astrometrie zeigt, dass Io derzeit nach innen
wandert und die drei inneren Galileischen Monde die exakte Laplace-Resonanz verlassen; Jupiters
$k_2/Q$ liegt nahe der Obergrenze dessen, was die Langzeitentwicklung als Mittel erwarten lässt
([Lainey et al. 2009](literatur:lainey-2009)). Die mittleren Bewegungen ändern sich relativ um
$+0{,}14 \pm 0{,}01$ (Io), $-0{,}43 \pm 0{,}10$ (Europa) und $-1{,}57 \pm 0{,}27$ (Ganymed) in
Einheiten von $10^{-10}$ je Jahr (formale Fehler, 1σ;
[Lainey et al. 2025](literatur:lainey-2025), Tabelle 1). Eine Auswertung mit Juno-Daten bestätigt
die Dissipationswerte; beide beschreiben Jupiters Gezeiten aber mit einem Parameter für alle
Frequenzen, Lainey et al. mit konstantem $Q$, Park et al. mit konstanter Zeitverzögerung
([Lainey et al. 2025](literatur:lainey-2025); [Park et al. 2025](literatur:park-2025)).

**Saturn und Titan.** Schon 2012 ergab die Astrometrie für Saturn $k_2/Q = (2{,}3 \pm 0{,}7) \cdot 10^{-4}$,
etwa zehnmal mehr als theoretisch üblich ([Lainey et al. 2025](literatur:lainey-2025)). Für
[Titan](objekt:titan) fanden zwei unabhängige Messungen mit Cassini eine Auswanderung um
$11{,}3 \pm 2{,}0\,\mathrm{cm}$ je Jahr, eine Zeitskala von rund zehn Milliarden Jahren,
entsprechend $Q \simeq 100$, mehr als hundertmal kleiner als meist erwartet. Die Autoren deuten das
als Resonanzsperre mit Trägheitswellen im Planeten ([Lainey et al. 2020](literatur:lainey-2020)):
Eine Schwingung des Planeten, deren Frequenz sich mit seiner inneren Entwicklung verschiebt, bleibt
mit dem Mond in Resonanz und treibt ihn auf einer Zeitskala vergleichbar dem Alter des
Sonnensystems nach außen,
nahezu unabhängig vom Abstand ([Fuller et al. 2016](literatur:fuller-2016)).

**Mars und Phobos.** [Phobos](objekt:phobos) läuft innerhalb der synchronen Bahn und wandert nach
innen. Die Ephemeride MAR099 ergibt für Mars $k_2/Q = (1{,}816 \pm 0{,}084) \cdot 10^{-3}$ und
für Phobos die halbe Gezeitenbeschleunigung $\dot{n}/2 = (1{,}258 \pm 0{,}058) \cdot 10^{-3}$ Grad
je Jahr² ([Brozović et al. 2025](literatur:brozovic-2025)); wegen $\dot{a}/a = -2\dot{n}/(3n)$
sinkt die Bahn um etwa 3,8 cm je Jahr. Rechnet man nur mit der Gezeit auf Mars und ohne den Zerfall
an der Roche-Grenze, vergehen bis zum Aufschlag mit konstanter Zeitverzögerung rund 29, mit
konstantem $Q$ 38 und mit $Q \propto \chi^{\alpha}$ 40 bis 43 Millionen Jahre
([Efroimsky und Lainey 2007](literatur:efroimsky-2007)); zum Zerfall siehe unten.

## Gezeitenheizung

Läuft ein gebunden rotierender Mond auf einer exzentrischen Bahn, ändert sich seine Gezeitenbeule
mit jedem Umlauf, und Reibung setzt Wärme frei. Liegen Äquator und Bahn in einer Ebene, gilt
([Gezeitenheizung (englische Wikipedia)](quelle:wikipedia-en-tidal-heating))

$$\dot{E} = -\mathrm{Im}(k_2)\,\frac{21}{2}\,\frac{G M^2 R^5\, n\, e^2}{a^6} = \frac{21}{2}\,\frac{k_2}{Q}\,\frac{(n R)^5\, e^2}{G}$$

mit $k_2$, $Q$ und Radius $R$ des Mondes und der Planetenmasse $M$; die zweite Form folgt mit
$n^2 a^3 = G M$. Die Energie stammt aus der Bahn, die dadurch kreisförmig würde; [Bahnresonanzen](thema:resonanzen)
halten die Exzentrizität aufrecht, bei Io mit Europa und Ganymed, bei
[Enceladus](objekt:enceladus) mit Dione
([Gezeitenheizung (englische Wikipedia)](quelle:wikipedia-en-tidal-heating)).

Peale, Cassen und Reynolds schlossen 1979, die Gezeitenreibung dürfte einen großen Teil von Io
geschmolzen haben, und rechneten mit sichtbaren Folgen in den Bildern von Voyager 1
([Peale et al. 1979](literatur:peale-1979)). Die gemessene Dissipation passt zum beobachteten
Wärmefluss; Io ist demnach nahe am thermischen Gleichgewicht
([Lainey et al. 2009](literatur:lainey-2009)). Mit $k_2/Q = 0{,}015 \pm 0{,}003$ und der
erzwungenen Exzentrizität $e = 0{,}0041$ ([Lari und Saillenfest 2024](literatur:lari-2024)) ergibt
die Formel 93 TW, im Fehlerbereich 75 bis 112 TW; beobachtet sind rund $10^{5}$ GW, also 100 TW
([Fuller et al. 2016](literatur:fuller-2016)). Der kleine Realteil von $k_2$ aus den
Juno-Vorbeiflügen passt zu einem überwiegend festen Mantel. Ein Magmaozean unter einer 50 km dicken
Schicht hätte ihn auf mindestens 0,8 gehoben; ausgeschlossen ist ein flacher globaler Magmaozean,
nicht einer tiefer als 318 km ([Park et al. 2025](literatur:park-2025)).

Enceladus gibt über die Südpolregion je nach Annahmen 4 bis 19 GW ab. Am Nordpol zeigen
Cassini-Messungen im Winter und im Sommer zusätzlich einen Wärmefluss von
$46 \pm 4\,\mathrm{mW}\,\mathrm{m}^{-2}$; insgesamt dürften es höchstens 54 GW sein, verglichen mit
geschätzten 50 bis 55 GW Gezeitenheizung im Gleichgewicht, deren Unsicherheit über 100 % liegt
([Miles et al. 2025](literatur:miles-2025)).

## Gebundene Rotation

Dieselbe Reibung bremst die Eigenrotation eines Mondes, bis sie dem Umlauf gleicht. Überträgt man
die Auswanderungsformel auf die Beule im Mond und teilt dessen Drehimpuls $C\,\omega_0$ durch das
Drehmoment, folgt als grobe Zeitskala

$$t \approx \frac{2}{3}\,\frac{Q}{k_2}\,\frac{C\,\omega_0\, a^6}{G M^2 R^5}$$

mit $k_2$, $Q$, Radius $R$ und Trägheitsmoment $C$ des Mondes, anfänglicher Winkelgeschwindigkeit
$\omega_0$ und Planetenmasse $M$; das Drehmoment ist dabei als konstant angenommen. In der Literatur
findet sich dieselbe Abschätzung auch mit dem Vorfaktor 1/3. Ein solcher Faktor zwei entsteht
leicht aus den Konventionen für $Q$, in denen der Phasenverzug doppelt so groß ist wie der
geometrische Winkel ([Efroimsky und Lainey 2007](literatur:efroimsky-2007)); die Abschätzung gilt
ohnehin nur der Größenordnung nach. Wegen der sechsten Potenz des Abstands wirkt die Bremsung vor
allem auf nahe Monde. Die meisten großen Monde
rotieren synchron, und der Mond braucht ein bleibendes Quadrupolmoment, um es zu bleiben
([Murray und Dermott 2000](literatur:murray-2000), Kapitel 5). Die Drehachse endet in einem
Cassini-Zustand, bei den meisten synchron gebremsten Monden in Zustand 1, beim Mond, für den es
Zustand 1 nicht gibt, in Zustand 2 ([Gladman et al. 1996](literatur:gladman-1996)). Nicht jede
Bremsung endet bei 1:1: [Merkur](objekt:mercury) dreht sich dreimal in zwei Umläufen. Nach Correia
und Laskar kann die chaotische Bahnentwicklung seine Exzentrizität über 0,325 treiben, was den
Einfang stark begünstigt; in 1000 gerechneten Entwicklungen über 4 Milliarden Jahre endeten 55,4 % in
der 3:2-Resonanz ([Correia und Laskar 2004](literatur:correia-2004)). Überblick:
[Gebundene Rotation](thema:gebundene-rotation).

## Roche-Grenze

Hält nur die eigene Schwerkraft einen Satelliten zusammen, reißen ihn Gezeiten unterhalb eines
Mindestabstands auseinander. Für einen starren kugelförmigen Satelliten mit Radius $r$ und Masse
$m$ beginnt eine Testmasse am planetennächsten Punkt zu schweben, wenn $2 G M r/d^3$ die
Eigenanziehung $G m/r^2$ erreicht; mit Radius $R$ und Dichte $\rho_M$ des Planeten und Dichte
$\rho_m$ des Satelliten folgt ([Roche-Grenze](quelle:wikipedia-de-roche-grenze))

$$d = R\,\sqrt[3]{\frac{2\,\rho_M}{\rho_m}} \approx 1{,}26\,R\,\sqrt[3]{\frac{\rho_M}{\rho_m}}$$

Ein flüssiger Satellit streckt sich zum Planeten hin und verstärkt so die Gezeitenkraft; seine
Grenze liegt etwa doppelt so weit draußen:

$$d \approx 2{,}42\,R\,\sqrt[3]{\frac{\rho_M}{\rho_m}}$$

Roche selbst gab den Faktor 2,44 an ([Roche-Grenze](quelle:wikipedia-de-roche-grenze)). Reale
Körper liegen zwischen beiden Fällen, und wer durch Festigkeit zusammenhält, kann auch innerhalb
der Grenze umlaufen ([Roche-Grenze (englische Wikipedia)](quelle:wikipedia-en-roche-limit)). Weil
$R\,\rho_M^{1/3}$ nur von der Planetenmasse abhängt, zählt neben ihr allein die Dichte des
Satelliten.

Fast alle Planetenringe liegen innerhalb ihrer Roche-Grenze; Ausnahmen sind etwa Saturns E-Ring und
der Ring des transneptunischen Objekts Quaoar bei rund 7,4 Körperradien
([Roche-Grenze (englische Wikipedia)](quelle:wikipedia-en-roche-limit)). Für kompaktes Eis mit
$900\,\mathrm{kg}\,\mathrm{m}^{-3}$ liegt Saturns flüssige Grenze bei rund 129 000 km, innerhalb
der Außenkante des A-Rings bei 136 780 km; für poröse Teilchen mit 400 bis
$600\,\mathrm{kg}\,\mathrm{m}^{-3}$ rückt sie auf 169 000 bis 148 000 km, jenseits der Hauptringe.
Ein anderes Kriterium führt an den Ringrand zurück: Ein loses Aggregat wächst nur, bis es seinen
Roche-Bereich ausfüllt, also bis zur kritischen Dichte $\rho = 3 M/(\gamma\,d^3)$ mit der
Planetenmasse $M$, dem Bahnabstand $d$ und $\gamma \approx 1{,}59$; für dieselben Dichten liegt
diese Grenze bei 139 000 bis 121 000 km, also im Bereich des A-Rings. Die kleinen Monde dort haben
gerade solche Dichten, 0,4 bis $0{,}6\,\mathrm{g}\,\mathrm{cm}^{-3}$, und die Ringteilchen selbst
dürften ähnlich wenig dicht sein
([Porco et al. 2007](literatur:porco-2007)); siehe [Ringe](thema:ringe).

Phobos hat eine mittlere Dichte von rund $1850\,\mathrm{kg}\,\mathrm{m}^{-3}$; seine Bahn liegt
bei 89 % der flüssigen und 171 % der starren Grenze. Er besteht vermutlich großenteils aus
schwachem, stark zerrüttetem Material, das sich in 20 bis 40 Millionen Jahren zu einem Ring
zerstreuen dürfte, der $10^{6}$ bis $10^{8}$ Jahre bestehen bleibt; feste Bruchstücke stürzen schräg
und langsam auf Mars ([Black und Mittal 2015](literatur:black-2015)).

## Offene Fragen

- **Resonanzsperre oder konstantes Q:** Mit konstantem $Q$ sind die gemessenen Auswanderungen der
  Saturnmonde nur vereinbar, wenn die Monde Milliarden Jahre nach Saturn entstanden; die
  Resonanzsperre erlaubt gleichzeitige Entstehung ([Fuller et al. 2016](literatur:fuller-2016)).
  Eine Auswertung von Cassini-Radiodaten zusammen mit über hundert Jahren Astrometrie bestätigt
  die schnelle Auswanderung Titans mit $Q = 75$ (+176/−31, 3σ)
  ([Magnanini et al. 2026](literatur:magnanini-2026)). Eine umfassende Auswertung von Astrometrie
  und Radiodaten von Cassini, Voyager und Pioneer 11 ergab dagegen $Q = 1224 \pm 119$ (1σ, also
  ±357 bei 3σ; [Jacobson 2022](literatur:jacobson-2022), Tabelle 10). Jacobson bezweifelt, dass die
  Radiodaten der Titan-Vorbeiflüge Saturns Schwerefeld und Love-Zahl festlegen, und hält ihre
  Zeitspanne für zu kurz, um die Gezeitenbeschleunigung von langperiodischen Störungen zu trennen;
  genau diese beiden Punkte greifen Magnanini et al. auf. Eine Übersicht kurz vor deren Auswertung
  nannte die Ursache des Unterschieds ungeklärt ([Lainey et al. 2025](literatur:lainey-2025)).
- **Q von Jupiter:** Die Bestimmungen beschreiben Jupiters Dissipation mit einem Parameter für alle
  Frequenzen, obwohl Modelle mit festem Kern und flüssiger Hülle stark frequenzabhängige
  Dissipation erwarten; die Fehlerbalken von $k_2/Q$ könnten deshalb zu klein sein. Junos $k_2$ von
  $0{,}565 \pm 0{,}018$ liegt unter dem statischen Modellwert 0,590 für Io, was auf eine dynamische
  Antwort hindeuten kann, mit satellitenabhängigen statischen Love-Zahlen aber ebenfalls verträglich
  ist ([Lainey et al. 2025](literatur:lainey-2025)).
- **Titans Inneres:** Ein Imaginärteil von $k_2$, drei- bis viermal größer als mit Ozean möglich,
  spricht gegen einen globalen Ozean und für eine dissipative Hochdruckeisschicht nahe dem
  Schmelzpunkt ([Petricca et al. 2025](literatur:petricca-2025)). Der große Realteil galt dagegen
  als Hinweis auf einen Ozean ([Iess et al. 2012](literatur:iess-2012)), und mit dem kleineren Wert
  von Goossens et al. wäre ein Ozean geringerer Dichte wahrscheinlicher
  ([Goossens et al. 2024](literatur:goossens-2024)). Auch der Realteil selbst ist strittig: Sein
  niedriger Wert wird auf die Auswertung zurückgeführt
  ([Durante et al. 2026](literatur:durante-2026)); seine Urheber widersprechen, diese Unterschiede
  erklärten den abweichenden Wert nicht ([Goossens et al. 2026](literatur:goossens-2026)). Die
  Mission Dragonfly soll die Frage erneut prüfen ([Petricca et al. 2025](literatur:petricca-2025)).
- **h₂ des Mondes:** Die Laserhöhenmessung ergibt rund 10 % weniger als ein an $k_2$ angepasstes
  Innenmodell, die Laserentfernungen meist mehr. Laserentfernungen messen nur auf der Vorderseite und
  können durch die Wärmeausdehnung von Reflektoren und Regolith verzerrt sein; bei der
  Laserhöhenmessung kommen thermische oder instrumentelle Effekte bei der Gezeitenperiode von
  27,2 Tagen in Frage, und auch ein unsicheres $k_2$ aus GRAIL wäre möglich
  ([Thor et al. 2021](literatur:thor-2021)).
- **Wärmebilanz von Enceladus:** Ob Wärmeverlust und Gezeitenheizung heute im Gleichgewicht sind,
  hängt an Schätzungen mit über 100 % Unsicherheit ([Miles et al. 2025](literatur:miles-2025)).

## Im Modell

- **Keine Gezeitenkräfte:** Orrery bewegt alle Körper über Bahnelemente mit linearen Raten
  ([Bahnelemente](thema:bahnelemente)). Bei allen 21 Monden sind große Halbachse und Exzentrizität
  fest. Der Erdmond bleibt bei 384 467 km; die gemessenen 38,30 mm je Jahr ergäben über das
  Tafelfenster 1800 bis 2050 nur 9,6 m. Auch das Gezeitenglied der Mondlänge fehlt, das nach einem
  Jahrhundert rund 13″ ausmacht.
- **Phobos:** Die Bahn bleibt bei 9375 km, der Bahnverfall fehlt. Das quadratische Glied der Länge,
  $(\dot{n}/2)\,t^2$ mit $t$ in Jahren seit J2000, ergäbe gegenüber der linearen Fortschreibung am
  17. September 2026 schon 0,9° und nach hundert Jahren 12,6°. Die gemessene physische Libration
  von 1,14° fehlt ebenfalls ([Brozović et al. 2025](literatur:brozovic-2025)).
- **Gebundene Rotation:** Sie steckt allein in den Rotationsperioden der Datensätze. Bei allen 21
  Monden gleicht die Rotationsperiode der Umlaufzeit $360^\circ/\dot{L}$ bis auf höchstens
  0,0001 % (Deimos); die Richtung zum Planeten wandert auf der Karte dadurch um höchstens 6,9° je
  Jahrhundert, bei allen anderen Monden um weniger als 1,3°. [Pluto](objekt:pluto) und
  [Charon](objekt:charon) drehen sich beide in 153,29335 Stunden, der Umlaufzeit Charons, und
  zeigen einander dauerhaft dieselbe Seite. Weil die Rotation gleichförmig ist und die Bahn
  exzentrisch, pendelt die Richtung zum Planeten wie bei der optischen Libration um etwa $\pm 2e$
  in Länge, beim Mond über 12,6°, bei Titan über 6,6°.
- **Welche Seite zum Planeten zeigt:** Die Rotationsphase ist zur Epoche bei allen Körpern null,
  nicht nach dem IAU-Modell gesetzt. Die Richtung zur Erde liegt deshalb auf der Mondkarte von 1800
  bis 2050 zwischen 30,5° und 43,5° östlicher Länge, im Mittel bei 37° (siehe
  [Bezugssysteme](thema:bezugssysteme)).
- **Merkur:** Die Rotationsperiode von 58,65 Tagen ist nicht genau zwei Drittel der Umlaufzeit
  (58,646 Tage); die Drehung bleibt hinter der 3:2-Kopplung um 14,6° je Jahrhundert zurück.
- **Form und Wärme:** Alle Körper sind starre Kugeln ohne Gezeitenbeulen, auch Phobos innerhalb
  seiner flüssigen Roche-Grenze; Gezeitenheizung, Vulkanismus auf Io und die Fontänen von Enceladus
  fehlen. Saturns Ringe sind eine flache Scheibe von 74 658 bis 136 780 km ohne Einzelteilchen.
  Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
