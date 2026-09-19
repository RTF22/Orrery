# Albedo und Helligkeit

Wie hell ein Körper erscheint, hängt von seiner Größe, seinen Abständen zu Sonne und Beobachter, vom
Phasenwinkel und davon ab, wie seine Oberfläche oder Atmosphäre Licht streut. Die Photometrie trennt
diese Anteile: Die Geometrie steckt in Abstandsgesetzen, die Streueigenschaften in Albedo und
Phasenfunktion. Dieser Text führt die Größen ein, mit denen Planeten, Monde und Kleinkörper
beschrieben werden, stellt Messwerte und ihre Streitpunkte vor und erklärt, warum die Helligkeit
eines Körpers im Bild von Orrery keine dieser Größen wiedergibt.

## Geometrische Albedo, Phasenintegral und Bond-Albedo

Der Phasenwinkel $\alpha$ ist der Winkel zwischen den Richtungen zur Sonne und zum Beobachter, vom
Körper aus gesehen. Die geometrische Albedo $p$ ist das Verhältnis der Helligkeit bei $\alpha = 0$
zur Helligkeit einer ebenen, vollkommen weißen, lambertsch streuenden Scheibe mit demselben
Querschnitt ([Geometrische Albedo](quelle:wikipedia-en-geometric-albedo);
[Mallama et al. 2017](literatur:mallama-2017)). Mit der auf $\Phi(0) = 1$ normierten Phasenfunktion
$\Phi(\alpha)$ folgt die scheinbare Helligkeit einer Kugel vom Radius $R$ im Abstand $r$ von der
Sonne und $\Delta$ vom Beobachter, alle Längen in AE:

$$m = m_\odot - 2{,}5\,\log_{10}\left[p\,\Phi(\alpha)\,\frac{R^2}{r^2\,\Delta^2}\right]$$

Dabei ist $m_\odot$ die Helligkeit der Sonne im selben Band in 1 AE Abstand, im V-Band −26,75. So
rechnen Mallama et al. aus der auf 1 AE und volle Phase bezogenen V-Helligkeit des Saturns bei
Kantenstellung der Ringe, −8,91, und seinem mittleren Scheibenradius von 57 240 km die geometrische
Albedo 0,499 zurück ([Mallama et al. 2017](literatur:mallama-2017), Abschnitte 1 und 6, Tabellen 3
und 6, Anhang A-6).

Die Bond-Albedo $A$, auch sphärische Albedo, ist der Anteil der auf den Querschnitt fallenden
Strahlung, den der Körper in alle Richtungen zurückwirft; ihr Verhältnis zur geometrischen Albedo
heißt Phasenintegral ([Albedo](quelle:wikipedia-de-albedo);
[Muinonen et al. 2010](literatur:muinonen-2010), Gl. 8;
[Shevchenko et al. 2019](literatur:shevchenko-2019), Gl. 1):

$$A = p\,q, \quad q = 2\int_0^\pi \Phi(\alpha)\,\sin\alpha\,d\alpha$$

Die Beziehung gilt je Wellenlänge. Für die Energiebilanz zählt die bolometrische Bond-Albedo, das
mit dem Sonnenspektrum $F_\odot(\lambda)$ gewichtete Mittel
([Buratti et al. 2022](literatur:buratti-2022), Gl. 2):

$$A_\mathrm{bol} = \frac{\int_0^\infty p(\lambda)\,q(\lambda)\,F_\odot(\lambda)\,d\lambda}{\int_0^\infty F_\odot(\lambda)\,d\lambda}$$

Tabellen wie die unten mischen oft beides, $p$ im V-Band und $A$ bolometrisch; ihr Quotient ist dann
kein Phasenintegral. Anders als $A$ ist $p$ nicht durch 1 begrenzt: Streut eine Oberfläche stark
zurück oder hat sie einen starken Oppositionseffekt, erlaubt die Energieerhaltung $p > 1$
([Verbiscer et al. 2007](literatur:verbiscer-2007), Anmerkung 3).

## Lambert-Kugel und Lommel-Seeliger-Gesetz

Eine Lambert-Fläche der Albedo $A_\mathrm{L}$ hat den Strahldichtefaktor
$I/F = A_\mathrm{L}\,\mu_0$, mit $\mu_0$ dem Kosinus des Einfallswinkels. Über die Kugel integriert
folgt

$$p = \frac{2}{3}\,A_\mathrm{L}, \quad \Phi_\mathrm{L}(\alpha) = \frac{\sin\alpha + (\pi - \alpha)\cos\alpha}{\pi}, \quad q = \frac{3}{2}$$

Die Bond-Albedo der Lambert-Kugel ist also $A_\mathrm{L}$ selbst, ihre geometrische Albedo zwei
Drittel davon; über $2/3$ kommt sie nicht hinaus.

Das Lommel-Seeliger-Gesetz beschreibt einfache Streuung an isotrop streuenden Teilchen der
Einfachstreualbedo $w$, mit $\mu$ dem Kosinus des Austrittswinkels; es folgt aus der
Strahlungstransporttheorie, wenn man bei kleiner Einfachstreualbedo die Mehrfachstreuung weglässt
([Muinonen und Wilkman 2015](literatur:muinonen-2015), Gl. 2.1 und 2.2):

$$\frac{I}{F} = \frac{w}{4}\,\frac{\mu_0}{\mu_0 + \mu}$$

Bei $\alpha = 0$ ist $\mu_0 = \mu$; die Scheibe erscheint ohne Randverdunkelung gleichmäßig hell,
und $p = w/8$ ([Muinonen und Wilkman 2015](literatur:muinonen-2015), Gl. 2.10). Phasenfunktion und
Phasenintegral der Kugel sind

$$\Phi_\mathrm{LS}(\alpha) = 1 + \sin\frac{\alpha}{2}\,\tan\frac{\alpha}{2}\,\ln\tan\frac{\alpha}{4}, \quad q = \frac{16}{3}\,(1 - \ln 2) \approx 1{,}64$$

in Übereinstimmung mit dem Wert 1,64 bei [Shevchenko et al. 2019](literatur:shevchenko-2019). Bei
$\alpha = 90^\circ$ behält die Lambert-Kugel 0,318, die Lommel-Seeliger-Kugel 0,377 ihrer Helligkeit
bei voller Phase.

Keines der beiden Gesetze kennt einen Oppositionseffekt. Lommel-Seeliger gilt als Modell für dunkle,
feinkörnige Oberflächen wie die primitiver Asteroiden
([Muinonen und Wilkman 2015](literatur:muinonen-2015)), die gemessenen Phasenkurven luftloser Körper
gibt aber keines der beiden wieder: Für Asteroidenklassen niedriger bis hoher Albedo ergeben sich
aus gemessenen Phasenkurven Phasenintegrale von 0,35 bis 0,54, im Mittel 0,44, weil die gegenseitige
Abschattung der Regolithteilchen die Phasenkurve steil macht; für den Mond erhielten Shevchenko et
al. 0,48 ± 0,02, deutlich weniger als den älteren Wert 0,60 von Lane und Irvine (1973); den
Unterschied führen sie auf neuere, bessere Messungen der Mondphasenkurve zurück
([Shevchenko et al. 2019](literatur:shevchenko-2019)). Die mittelgroßen Saturnmonde liegen bei 0,55
µm zwischen 0,71 und 0,80 ([Buratti et al. 2022](literatur:buratti-2022), Tabelle 2). Bei
wolkenbedeckten Planeten fällt die Phasenkurve flacher ab, und das Phasenintegral liegt über 1: für
Jupiter unter 1050 nm etwa zwischen 1,1 und 1,3 ([Li et al. 2018](literatur:li-2018)), für Uranus
bolometrisch bei 1,36 ± 0,03 ([Irwin et al. 2025](literatur:irwin-2025)).

## Phasenkurve und Oppositionseffekt

Über einen weiten Bereich ändert sich die Helligkeit von Asteroiden in Magnituden etwa linear mit
dem Phasenwinkel; unterhalb von grob 7° steigt sie nichtlinear an. Diesen Oppositionseffekt führt
man auf ein Zusammenspiel von Schattenverbergen und kohärenter Rückstreuung zurück
([Muinonen et al. 2010](literatur:muinonen-2010)).

Beim Schattenverbergen, das Seeliger 1887 und 1895 als Erklärung angab, verschwinden die Schatten,
die Teilchen auf tiefer liegende werfen, sobald Einfalls- und Blickrichtung zusammenfallen. Locker
gepackte, poröse Oberflächen zeigen die stärksten Anstiege
([Buratti et al. 2022](literatur:buratti-2022)). Für gleichartige Teilchen ohne Mehrfachstreuung
gibt Hapkes Modell die Winkelbreite in Abhängigkeit vom Füllfaktor $\phi$ an (Hapke 1986, zitiert
nach [Buratti et al. 2022](literatur:buratti-2022)):

$$h_\mathrm{S} = -\frac{3}{8}\,\ln(1 - \phi)$$

Je poröser die Oberfläche, desto schmaler der Anstieg. Die kohärente Rückstreuung entsteht, wenn
mehrfach gestreute Photonen denselben Weg in entgegengesetzter Richtung durchlaufen und genau in
Rückwärtsrichtung konstruktiv interferieren. Weil sie Mehrfachstreuung voraussetzt, sollte sie bei
hellen Oberflächen stärker ausfallen; mit ihr erklärt man vor allem die schmale Spitze im letzten
Grad Phasenwinkel ([Buratti et al. 2022](literatur:buratti-2022)). Die zweite Auflage von Hapkes
Lehrbuch behandelt sie ausführlich ([Hapke 2012a](literatur:hapke-2012a)). Ein Kennzeichen ist die
Polarisation: An Apollo-Bodenproben sinkt im Oppositionspeak das lineare und steigt das zirkulare
Polarisationsverhältnis ([Hapke et al. 1993](literatur:hapke-1993)).

Die Beobachtungen ordnen sich nach der Albedo, die sich auch mit der Wellenlänge ändert: Je dunkler
die Oberfläche, desto steiler die Phasenkurve, je heller, desto ausgeprägter die kohärente Spitze
([Buratti et al. 2022](literatur:buratti-2022), Abschnitt 4). Den scharfen Peak von Europa konnte
Schattenverbergen nur mit unvernünftigen Porositäten erklären (Domingue et al. 1991, nach
[Buratti et al. 2022](literatur:buratti-2022)). An [Enceladus](objekt:enceladus) zeigten
HST-Aufnahmen zwischen 0,26° und 6,4° einen steilen, schmalen Anstieg, den ein Modell aus mäßigem
Schattenverbergen und schmaler kohärenter Rückstreuung am besten beschreibt
([Verbiscer et al. 2005](literatur:verbiscer-2005)). Bei den mittelgroßen Saturnmonden passen die
Phasenkurven im Sichtbaren und nahen Infrarot nicht zu reinem Schattenverbergen, bei 3,6 µm, wo die
geometrische Albedo auf etwa 0,2 fällt und Mehrfachstreuung kaum zählt, dagegen schon; die dunkle
Hemisphäre von [Iapetus](objekt:iapetus) scheint keinen nennenswerten Anstieg zu zeigen
([Buratti et al. 2022](literatur:buratti-2022)). Wie stark der Effekt Beobachtungen prägt, zeigt
[Merkur](objekt:mercury): Er erscheint nahe der oberen Konjunktion, bei kleinem Phasenwinkel und
größtem Abstand, am hellsten ([Mallama und Hilton 2018](literatur:mallama-2018)).

## Absolute Helligkeit und Durchmesser

Die absolute Helligkeit $H$ eines Kleinkörpers ist seine über eine Rotation gemittelte V-Helligkeit
in 1 AE Abstand von Sonne und Erde bei $\alpha = 0$
([Muinonen et al. 2010](literatur:muinonen-2010)). Mit $r = \Delta = 1$ und $\Phi(0) = 1$ folgt aus
der Helligkeitsgleichung der Durchmesser $D = 2R$ ([Muinonen et al. 2010](literatur:muinonen-2010),
Gl. 1; [Mahlke et al. 2021](literatur:mahlke-2021), Gl. 2):

$$D = \frac{1329\,\mathrm{km}}{\sqrt{p}}\,10^{-H/5}$$

Die Konstante ist zwei AE mal $10^{m_\odot/5}$ und entspricht $m_\odot = -26{,}76$; mit −26,75 wären
es 1336 km. Ohne gemessene Albedo bleibt die Größe unsicher: Bei $H = 10$ ergibt $p = 0{,}05$ einen
Durchmesser von 59 km, $p = 0{,}25$ nur 27 km. Umgekehrt ist eine aus $H$ und Größe abgeleitete
Albedo keine direkte Messung; Bowell et al. schlugen dafür den Namen Pseudoalbedo vor (nach
[Muinonen et al. 2010](literatur:muinonen-2010)).

## H-G- und H-G₁-G₂-System

Weil kaum ein Asteroid nahe $\alpha = 0$ beobachtet wird, muss $H$ aus Messungen bei größeren
Phasenwinkeln extrapoliert werden. 1985 nahm die Kommission 20 der IAU dafür das H-G-System an. Für
die auf Einheitsabstände reduzierte Helligkeit gilt
([Muinonen et al. 2010](literatur:muinonen-2010), Gl. 2 und 6)

$$V(\alpha) = H - 2{,}5\,\log_{10}\left[(1 - G)\,\Phi_1(\alpha) + G\,\Phi_2(\alpha)\right]$$

$$\Phi_1 \approx \exp\left(-3{,}33\,\tan^{0{,}63}\frac{\alpha}{2}\right), \quad \Phi_2 \approx \exp\left(-1{,}87\,\tan^{1{,}22}\frac{\alpha}{2}\right)$$

Der Steigungsparameter $G$ liegt für steile Phasenkurven nahe 0, für flache nahe 1. Die
Basisfunktionen stammen aus Streumodellen, die die kohärente Rückstreuung noch nicht enthielten.
Bestimmt war $G$ 2010 für etwa 0,1 % der bekannten Asteroiden; für die übrigen wird meist
$G = 0{,}15$ angenommen ([Muinonen et al. 2010](literatur:muinonen-2010)). Für sehr dunkle und sehr
helle Objekte gibt das H-G-System den Oppositionseffekt schlecht wieder
([Mahlke et al. 2021](literatur:mahlke-2021)).

Muinonen et al. erweiterten es mit neu angepassten Basisfunktionen zum H-G₁-G₂-System, in dem
$\Phi_1$ und $\Phi_2$ den linearen Teil und $\Phi_3$ den Oppositionseffekt beschreiben
([Muinonen et al. 2010](literatur:muinonen-2010); [Mahlke et al. 2021](literatur:mahlke-2021), Gl.
3):

$$V(\alpha) = H - 2{,}5\,\log_{10}\left[G_1\,\Phi_1(\alpha) + G_2\,\Phi_2(\alpha) + (1 - G_1 - G_2)\,\Phi_3(\alpha)\right]$$

mit $G_1, G_2 \ge 0$ und $G_1 + G_2 \le 1$. Für wenige Beobachtungen leiteten sie daraus ein
nichtlineares Zwei-Parameter-System H-G₁₂ ab. 2012 nahm die IAU das H-G₁-G₂-System an, um das
H-G-System abzulösen. Noch 2024 veröffentlichten das Minor Planet Center, JPL und das Lowell
Observatory $H$ im H-G-System, meist mit $G = 0{,}15$; H-G₁-G₂ braucht Beobachtungen unter 2° bis 4°
([Carry et al. 2024](literatur:carry-2024)). Beide Systeme liefern ein Phasenintegral
([Muinonen et al. 2010](literatur:muinonen-2010), Gl. 7, auf etwa 5 % genau;
[Shevchenko et al. 2019](literatur:shevchenko-2019), Gl. 3):

$$q = 0{,}290 + 0{,}684\,G, \quad q = 0{,}009082 + 0{,}4061\,G_1 + 0{,}8092\,G_2$$

Mit $G = 0{,}15$ ist $q = 0{,}39$.

## Scheinbare Helligkeiten der Planeten

Für den Astronomical Almanac rechnen Mallama und Hilton die V-Helligkeit der Planeten aus dem
Abstand $r$ von der Sonne und $d$ von der Erde in AE, der Helligkeit $V_1(0)$ bei 1 AE und voller
Phase und einem Polynom im Phasenwinkel in Grad ([Mallama und Hilton 2018](literatur:mallama-2018),
Gl. 1):

$$V = 5\,\log_{10}(r\,d) + V_1(0) + C_1\,\alpha + C_2\,\alpha^2 + \ldots$$

Die Eigenheiten stecken in Zusatzgliedern. [Venus](objekt:venus) wird zu $\alpha \to 0$ wieder
dunkler, gedeutet als Glorie ihrer Atmosphäre; bei 163,7° knickt die Kurve, weil
Schwefelsäuretröpfchen Licht nach vorn streuen. Ihren größten Glanz erreicht sie im Mittel bei
$\alpha = 123{,}5^\circ$ mit −4,81; am hellsten war sie im untersuchten Zeitraum am 19. Dezember
1989 mit −4,92. Für die [Erde](objekt:earth), vom All aus gesehen, entspricht $V_1(0) = -3{,}99$ der
geometrischen Albedo 0,434; Modellrechnungen ergeben je nach Bewölkung 0,12 ohne Wolken bis 0,76
unter Altostratus und zwischen 0,5 und 0,9 µm 0,358 für eine realistische Bewölkung, weshalb die
Helligkeit der Erde wohl schlechter vorhersagbar ist als die der meisten anderen Planeten. Mars
schwankt mit der Länge der sichtbaren Hälfte um bis zu 0,06 Magnituden. Bei Saturn überwiegen die
Ringe: Nahe $\alpha = 0$ werden sie viel heller als bei 6°, während die Kugel fast gleich bleibt.
Uranus erscheint heller, wenn mehr von seinen methanarmen Polregionen zu sehen ist. Neptun wurde
zwischen etwa 1980 und 2000 deutlich heller (siehe Offene Fragen). Die hellste mittlere
Oppositionshelligkeit hat Jupiter mit −2,70, die schwächste Neptun mit 7,71
([Mallama und Hilton 2018](literatur:mallama-2018)).

## Albedo ausgewählter Körper

Geometrische Albedo im V-Band (Enceladus bei 0,55 µm) und bolometrische Bond-Albedo; die Quellen
stehen in der letzten Spalte.

| Körper | $p$ | $A_\mathrm{bol}$ | Quellen |
|---|---:|---:|---|
| [Venus](objekt:venus) | 0,689 | 0,76 | [Mallama et al. 2017](literatur:mallama-2017); [Haus et al. 2016](literatur:haus-2016) |
| [Erde](objekt:earth) | 0,434 | 0,293 | [Mallama et al. 2017](literatur:mallama-2017); [Stephens et al. 2015](literatur:stephens-2015) |
| [Jupiter](objekt:jupiter) | 0,538 | 0,503 ± 0,012 | [Mallama et al. 2017](literatur:mallama-2017); [Li et al. 2018](literatur:li-2018) |
| [Saturn](objekt:saturn) | 0,499 | 0,41 ± 0,02 | [Mallama et al. 2017](literatur:mallama-2017); [Wang et al. 2024a](literatur:wang-2024a) |
| [Uranus](objekt:uranus) | 0,488 | 0,349 ± 0,016 (Bahnmittel) | [Mallama et al. 2017](literatur:mallama-2017); [Irwin et al. 2025](literatur:irwin-2025) |
| [Enceladus](objekt:enceladus) | 1,24 ± 0,01 | 0,89 ± 0,02 | [Buratti et al. 2022](literatur:buratti-2022) |
| [Iapetus](objekt:iapetus), dunkle Vorderseite | – | 0,06 ± 0,01 | [Blackburn et al. 2011](literatur:blackburn-2011) |
| [Iapetus](objekt:iapetus), helle Rückseite | – | 0,25 ± 0,03 | [Blackburn et al. 2011](literatur:blackburn-2011) |

Bei Venus übertrifft die Bond-Albedo sogar die geometrische ($A/p \approx 1{,}10$, bei
unterschiedlichen Bändern): Ihre Phasenkurve fällt viel flacher ab als die des luftlosen Merkur
([Mallama und Hilton 2018](literatur:mallama-2018), Abb. 1). Für die Erde ergibt sich die
Bond-Albedo aus dem mittleren reflektierten Fluss von 99,7 W m⁻² nach CERES; ohne Wolken wären es
52,4 W m⁻² oder 0,149, und schon Explorer 7 hatte 1959 rund 0,30 gemessen
([Stephens et al. 2015](literatur:stephens-2015)). Die geometrische Albedo hängt bei Uranus stark
vom Band ab, 0,488 im V-Band gegen 0,079 im I-Band ([Mallama et al. 2017](literatur:mallama-2017),
Tabelle 7). Bei Enceladus ist $p\,q$ bei 0,55 µm 0,98, bolometrisch sind es 0,89, weil die Albedo in
den Eisbanden des nahen Infrarots fällt, bei 2,02 µm auf 0,36
([Buratti et al. 2022](literatur:buratti-2022), Tabellen 2 und 3). Andere Auswertungen ergaben
$p = 1{,}41 \pm 0{,}03$ bei 549 nm ([Verbiscer et al. 2005](literatur:verbiscer-2005)) und aus der
Wärmestrahlung $A_\mathrm{bol} = 0{,}81 \pm 0{,}04$ ([Howett et al. 2010](literatur:howett-2010),
Wert nach [Buratti et al. 2022](literatur:buratti-2022), Tabelle 3). Die Monde im E-Ring haben im
Mittel geometrische Albedos um oder über 1, was Verbiscer et al. auf die Eisteilchen von Enceladus
zurückführen ([Verbiscer et al. 2007](literatur:verbiscer-2007)). Bei Iapetus hängt der Wert von der
Auflösung ab: Helles Material erreicht in hoch aufgelösten Bildern 0,38 ± 0,04, weil die
Hemisphärenmittel dunkle Flecken einschließen ([Blackburn et al. 2011](literatur:blackburn-2011)).
Eine scheibenintegrierte geometrische Albedo je Hemisphäre fehlt in den hier ausgewerteten Arbeiten;
Buratti et al. lassen Iapetus wegen seiner Albedounterschiede aus ihrer Albedotabelle heraus.

## Gleichgewichtstemperatur

Absorbiert ein Körper im Abstand $d$ (in AE) auf seinem Querschnitt und strahlt er gleichmäßig über
die ganze Oberfläche mit dem Emissionsgrad $\varepsilon$ ab, gilt

$$T_\mathrm{eq} = \left[\frac{(1 - A)\,S_\odot}{4\,\varepsilon\,\sigma\,d^2}\right]^{1/4}$$

mit der nominellen Solarkonstante $S_\odot = 1361\,\mathrm{W}\,\mathrm{m}^{-2}$ der IAU-Resolution
B3 von 2015; die Einstrahlung schwankt um etwa 0,08 % ([Prša et al. 2016](literatur:prsa-2016)). Für
den subsolaren Punkt eines langsam rotierenden Körpers entfällt der Faktor 4, die Temperatur steigt
um den Faktor 1,41. Die Erde käme mit $A = 0{,}293$ und $\varepsilon = 1$ auf 255 K. Für Venus
ergeben $A = 0{,}76$ und 0,7233 AE 229 K, nahe der effektiven Emissionstemperatur von 228,5 K aus
einem Strahlungsbilanzmodell ([Haus et al. 2016](literatur:haus-2016)). Für Iapetus folgen subsolar
125,5 K bei $A = 0{,}06$ und 118,6 K bei $A = 0{,}25$; Blackburn et al. geben 125,5 K und 118,4 K an
([Blackburn et al. 2011](literatur:blackburn-2011)). Riesenplaneten strahlen mehr ab, als sie
absorbieren; die Differenz ist ihr innerer Wärmestrom, und jeder Fehler in $A_\mathrm{bol}$ geht in
ihn ein. Mit Jupiters Bond-Albedo von 0,503 statt 0,343 sinkt die absorbierte Leistung um 24 %;
zusammen mit einer abgestrahlten Leistung von 14,098 W m⁻² ergab sich ein innerer Wärmestrom von
7,485 statt 5,444 W m⁻² ([Li et al. 2018](literatur:li-2018)).

## Offene Fragen

- **Anteile im Oppositionseffekt des Mondes:** Die Polarisation von Laborproben werteten Hapke et
  al. 1993 als eindeutigen Beleg dafür, dass der größte Teil des Mondeffekts auf kohärente
  Rückstreuung zurückgeht ([Hapke et al. 1993](literatur:hapke-1993)). Aus Bildern der
  Weitwinkelkamera des Lunar Reconnaissance Orbiter folgerten sie später, dass keiner der beiden
  Mechanismen allein die Phasenkurven erklärt; für ein Hochlandgebiet trägt die kohärente
  Rückstreuung im Ultravioletten fast 40 %, im Roten über 60 % bei. Dass die Breite des Effekts kaum
  von der Wellenlänge abhängt, obwohl die Theorie für den Mond eine Zunahme mit dem Quadrat der
  Wellenlänge erwartet, werten sie als Zeichen, dass das Verständnis der kohärenten Rückstreuung
  unvollständig oder vielleicht falsch ist ([Hapke et al. 2012b](literatur:hapke-2012b)). Eine
  andere Auswertung derselben Kamera findet eine schmale kohärente Komponente von 1,2° Breite im
  Hochland im Roten bis 3,9° im Mare im Blauen, mit einer Albedoabhängigkeit wie von der Theorie
  erwartet, und schätzt ihre größte Amplitude auf etwa 8 %. Die Breite ist dort eigens definiert,
  als größter Phasenwinkel, bis zu dem die Steigung der Spitze mit der Albedo wächst
  ([Velikodsky et al. 2016](literatur:velikodsky-2016)); die Zahlen beider Arbeiten messen
  verschiedene Größen und lassen sich nicht direkt vergleichen.
- **Bond-Albedo der Riesenplaneten:** Für Jupiter ergaben Voyager-Radiometer und ein
  Pioneer-Phasenintegral von 1,25 den Wert 0,343 ± 0,032, dessen Fehler eine Schätzung
  systematischer Effekte ist ([Hanel et al. 1981](literatur:hanel-1981)); Cassini-Daten ergaben
  0,503 ± 0,012. Li et al. nennen bessere Kalibrierung, vollständigere Abdeckung in Wellenlänge und
  Phasenwinkel und die Wellenlängenabhängigkeit als Gründe und schließen eine zeitliche Änderung aus
  ([Li et al. 2018](literatur:li-2018)). Für Saturn stieg der Wert von 0,34 ± 0,03 nach Voyager auf
  0,41 ± 0,02 und der innere Wärmestrom von 2,01 ± 0,14 auf 2,84 ± 0,20 W m⁻². Dass Voyager nur
  einen Gürtel zwischen −11° und −32° Breite erfasste, der 4,6 % dunkler ist als das globale Mittel,
  erklärt nur einen Teil des Unterschieds. Die Voyager-Auswertung ist mangels Angaben schwer
  nachzuvollziehen, und die Saturn-Bestimmung folgt dem Verfahren, das die Gruppe zuvor unter
  anderem für Jupiter beschrieben hatte ([Wang et al. 2024a](literatur:wang-2024a)). Für Uranus
  stellen Irwin et al. den Voyager-Werten von Pearl et al. (1990), im Bahnmittel 0,300 ± 0,049 und
  einem Verhältnis von abgestrahlter zu absorbierter Leistung von 1,06 ± 0,08, verträglich mit
  thermischem Gleichgewicht, ein an Beobachtungen angepasstes Aerosolmodell gegenüber: 0,349 ± 0,016
  und 1,15 ± 0,06. Ihr Wert beruht weiter auf der von Voyager 2 gemessenen Abstrahlung, deren
  Neubestimmung sie empfehlen ([Irwin et al. 2025](literatur:irwin-2025), Tabelle 1). Mit einer
  Energiebilanz über einen ganzen Umlauf finden auch Wang et al. einen Energieverlust, mit einem
  inneren Wärmestrom von 0,078 ± 0,018 W m⁻², unter der Annahme einer jahreszeitlich kaum
  veränderlichen Abstrahlung ([Wang et al. 2025](literatur:wang-2025)).
- **Helligkeitsanstieg Neptuns:** Warum Neptun zwischen 1980 und 2000 heller wurde, galt 2018 als
  ungeklärt. Karkoschka (2011) vermutet Verdunkelungsereignisse, bei denen Dunstteilchen aufsteigen
  und danach wieder absinken, Sromovsky et al. (2003) eine jahreszeitliche Änderung wie bei Uranus;
  Lockwood und Jerzykiewicz (2006) wandten ein, dass das jahreszeitliche Modell ältere Beobachtungen
  schlecht wiedergibt. Träfe es zu, müsste Neptun nach seiner Sonnenwende 2005 bald wieder schwächer
  werden (alle nach [Mallama und Hilton 2018](literatur:mallama-2018)). Nach Lowell- und HST-Daten
  stieg die Helligkeit bis 2005, blieb bis etwa 2012 gleich und nahm danach insgesamt ab. Die
  Wolkenaktivität im nahen Infrarot hing von 1994 bis 2022 mit der Lyman-α-Strahlung der Sonne
  zusammen, was Chavez et al. als Stütze für eine photochemische Wolkenbildung durch solares
  Ultraviolett werten; jahreszeitliche Effekte seien für die langsamen Änderungen wohl wichtig, die
  übrigen langfristigen Schwankungen müssten eine andere Ursache haben
  ([Chavez et al. 2023](literatur:chavez-2023)).

## Im Modell

- **Albedowert:** Jeder Körper außer der Sonne trägt eine geometrische Albedo, die der Datenblock
  als „Geometrische Albedo" zeigt. Die Werte der Planeten stimmen mit den V-Band-Werten von
  [Mallama et al. 2017](literatur:mallama-2017) überein, Tabelle 7; Enceladus trägt 1,0, den Wert
  des NSSDC-Faktenblatts, und liegt damit unter den neueren Messungen der Tabelle; der Mond trägt
  0,12 und Iapetus 0,275, das Mittel der Hemisphärenwerte 0,05 und 0,5 desselben Faktenblatts.
  Bond-Albedo, Phasenintegral, Phasenwinkel und scheinbare Helligkeiten rechnet Orrery nicht;
  Magnituden kommen nur bei den Hintergrundsternen vor, als Punktgröße.
- **Karte und Faktor:** Die Texturen sind keine Reflexionskarten; die Karte von Enceladus hat im
  Mittel nur 0,172. Orrery mittelt ihre linearen Farbwerte, die drei Kanäle zu gleichen Teilen, mit
  dem Kosinus der Breite gewichtet und ohne Datenlücken unter 0,005, und skaliert die Materialfarbe
  mit geometrischer Albedo durch dieses Mittel, begrenzt auf 0,1 bis 30. Die Erdkarte hat das Mittel
  0,134 und wird mit 3,24 multipliziert, die Mondkarte mit 0,384, die von Enceladus mit 5,80. Die
  mittlere Reflexion der dargestellten Oberfläche ist damit die geometrische Albedo. Nach der
  Leuchtdichte gewichtet hätte die Erdkarte das Mittel 0,116. Der Kontrast der Karte bleibt: Bei
  Iapetus hat die um die dunkelste Blickrichtung zentrierte Halbkugel die mittlere Reflexion 0,053,
  die um die hellste 0,373.
- **Streuung:** Das Material von three.js 0.186 mit Rauheit 1 und ohne Metallanteil streut
  lambertsch mal $1 - F$. Der Fresnel-Faktor $F$ gilt am Halbvektor zwischen Licht- und
  Blickrichtung und hängt deshalb nur vom Phasenwinkel ab: 0,04 bei voller Phase, 0,13 bei 135°,
  0,41 bei 160°. Dazu kommt ein schwacher ungefärbter Glanz, den der Albedofaktor nicht skaliert.
  Eine Kugel der Reflexion $p$ hat im Modell deshalb, ohne Glanz und Fülllicht nachgerechnet, die
  geometrische Albedo $0{,}640\,p$, das Phasenintegral 1,49, wegen des wachsenden $F$ etwas unter
  1,5, und die Bond-Albedo $0{,}955\,p$; der Glanz addiert bei einem Ziel in 1 AE etwa 0,011 zur
  geometrischen Albedo. Die Erde erscheint so mit 0,278 und 0,415 statt der Messwerte 0,434 und
  0,293, Enceladus mit 0,64 statt 1,24. Oppositionseffekt, Lommel-Seeliger- oder Hapke-Verhalten,
  Wolken und Streuung in Atmosphären fehlen; die Erdkarte ist wolkenlos.
- **Fülllicht:** Die Nachtseitenfüllung, im Standard ein Viertel des Tagniveaus, liegt mit derselben
  Karte über der ganzen sichtbaren Scheibe, auch auf der Tagseite. Bei voller Phase hebt sie das
  Scheibenmittel von $0{,}640\,p$ auf $0{,}890\,p$; bei 90° Phasenwinkel stammen 55 %, bei 135° 90 %
  des Scheibenlichts aus ihr. Die Phasenkurve im Bild folgt deshalb keinem physikalischen Gesetz. In
  der [Mondfinsternis](szene:mondfinsternis) bleibt vom Mond im Kernschatten nur diese Füllung,
  getönt mit dem Farbwert #ff9a5c, und die Kamera belichtet dort auf die Erde.
- **Belichtung:** Die Kamera setzt die Beleuchtung so, dass eine weiße Lambert-Fläche am Ziel bei
  senkrechtem Licht, ohne Fresnel-Faktor und Füllung, den linearen Wert 1 erreicht. Jedes Ziel
  erscheint damit gleich hell, wie weit es auch von der Sonne steht, obwohl Neptun am 17. September
  2026 nur 1/883 der Bestrahlung der Erde erhält. Für die übrigen Körper im Bild zählt die
  Bestrahlung $E$ relativ zu 1 AE mit dem Standardwert 0,7 des Reglers „Distanzausgleich" nur als
  $E^{1 - 0{,}7} = E^{0{,}3}$, und in der Standarddarstellung „Schaubild" gilt der gestauchte
  Abstand $r_\mathrm{d} = r^{0{,}6}$, beide in AE. Steht die Erde im Ziel, erscheint Neptun mit
  0,295 ihres Tagniveaus statt mit 0,00113, also 261-mal zu hell, in der Darstellung „Realistisch"
  115-mal.
- **Tonwertkurve:** Die Bildwerte durchlaufen die ACES-Kurve von three.js und die sRGB-Kodierung.
  Der lineare Wert 1 landet bei 226 von 255, mit der Füllung, also 1,25, bei 233. Am subsolaren
  Punkt einer Fläche der Reflexion 0,12 stehen samt Fresnel-Faktor und Füllung 112, bei der
  Reflexion 1 stehen 232: Die 8,3-fache Leuchtdichte wird zum 2,1-fachen Bildwert, und Leuchtdichten
  unter 0,0020 werden schwarz. Helligkeiten im Bild sind deshalb keine Messgrößen; weder $p$ noch
  $A$ lassen sich aus ihnen zurückgewinnen.
- **Ringe:** Sie erhalten einen gestalteten Aufhellungsterm, der nur im Gegenlicht wirkt, aber keine
  Rückstreuspitze; die starke Aufhellung der Saturnringe bei voller Phase zeigt Orrery nicht.
  Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
