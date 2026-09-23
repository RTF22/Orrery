# Zwergplaneten

Fünf Körper tragen heute den von der Internationalen Astronomischen Union (IAU) 2006 geschaffenen
Status „Zwergplanet": [Ceres](objekt:ceres) im Hauptgürtel sowie [Pluto](objekt:pluto),
[Eris](objekt:eris), [Haumea](objekt:haumea) und [Makemake](objekt:makemake) im Kuipergürtel.
Die Kategorie entstand nicht aus einer neuen physikalischen Erkenntnis, sondern aus einem
Zähl- und Abgrenzungsproblem: Ceres war 1801 kurzzeitig ein Planet, wurde mit der Entdeckung
weiterer, ähnlich großer Körper zum „Asteroiden" herabgestuft, und dieselbe Frage stellte sich
rund 200 Jahre später erneut, als 2005 mit Eris ein Körper auftauchte, der massereicher als Pluto
ist, aber offensichtlich zu derselben Population wie Pluto und Dutzende weiterer transneptunischer
Objekte gehört. Dieser Text stellt die IAU-Definition und ihre quantitativen Kriterien vor, ordnet
die Frage nach dem hydrostatischen Gleichgewicht mit ihren Grenzfällen ein, vergleicht die fünf
anerkannten Körper anhand der Werte aus ihren eigenen Texten, behandelt die Größen-Dichte-Beziehung
und die Monde großer Kuipergürtelobjekte als mögliche Einschlagsfolgen und schließt mit dem Streit
um die Definition selbst, wie er auch Pluto betrifft.

## Definition und Geschichte der Einstufung

Die IAU-Resolution B5 der Generalversammlung 2006 definiert einen Planeten als einen Körper, der
(a) die Sonne umläuft, (b) genug Masse hat, dass die eigene Schwerkraft starre Körperkräfte
überwindet und eine hydrostatische Gleichgewichtsform (annähernd rund) erzwingt, und (c) die
Umgebung seiner Bahn freigeräumt hat. Ein „Zwergplanet" erfüllt (a) und (b), aber nicht (c), und
ist zugleich kein Mond ([IAU 2006](literatur:iau-2006)); ein ausdrücklich vorgesehener, aber bis
heute nicht formalisierter IAU-Prozess sollte Grenzfälle einer der beiden Kategorien zuordnen. Die
begleitende Resolution B6 erklärt Pluto zum Zwergplaneten nach dieser Definition und erkennt ihn
zugleich als Prototyp einer neuen Kategorie transneptunischer Objekte an
([IAU 2006](literatur:iau-2006)).

Ceres selbst steht am Anfang der Geschichte: Giuseppe Piazzi entdeckte sie 1801 in Palermo,
zunächst als Planet geführt; als binnen weniger Jahrzehnte mit Pallas, Juno und Vesta weitere
Körper ähnlicher Größe auf ähnlichen Bahnen auftauchten, wurde die ganze Gruppe zu „Asteroiden"
herabgestuft (Einstufungsgeschichte unter [Ceres](objekt:ceres)). Clyde Tombaugh entdeckte Pluto
1930 am Lowell-Observatorium bei der gezielten Suche nach einem postulierten „Planeten X"
(Einstufungsgeschichte unter [Pluto](objekt:pluto)); über 70 Jahre lang blieb er ohne bekannten
Nachbarn ähnlicher Größe der neunte Planet. Erst der seit den 1990er-Jahren zunehmend erschlossene
Kuipergürtel und darin 2005 die Entdeckung von Eris — nach der ersten Massenbestimmung
geringfügig massereicher als Pluto — erzwangen die Entscheidung: Entweder hätte man Eris und in
absehbarer Zeit weitere, ähnlich große Kuipergürtelkörper ebenfalls zu Planeten erklären müssen,
oder man brauchte eine eigene Klasse
([Brown, Trujillo und Rabinowitz 2005](literatur:brown-trujillo-rabinowitz-2005)). Haumea und
Makemake, beide bereits 2004/2005 entdeckt, reihten sich neben Ceres, Pluto und Eris als weitere
Vertreter der neuen Kategorie ein.

## Quantitative Kriterien für das Freiräumen der Bahn

Das dritte Kriterium, das Freiräumen der Bahnumgebung, ist qualitativ formuliert und lässt sich
nicht buchstäblich erfüllen: Kein Planet hat seine Bahn vollständig von Kleinkörpern befreit, weil
gravitative und Strahlungskräfte Asteroiden und Kometen fortlaufend auf bahnkreuzende Werte streuen
([Margot 2015](literatur:margot-2015)). Mehrere Arbeiten haben deshalb versucht, das Kriterium
quantitativ zu fassen.

Bereits [Stern und Levison (2002)](literatur:stern-levison-2002) untersuchten einen rein
dynamischen Maßstab der Form $\Lambda \propto M_p^2/P$ (Planetenmasse $M_p$, Umlaufzeit $P$) für
die Fähigkeit eines Körpers, seine Bahnumgebung über eine charakteristische Zeitspanne hinweg zu
dominieren; [Soter (2006)](literatur:soter-2006) griff diesen theoretischen
„Streuparameter" $\Lambda$ wieder auf, stellte ihm aber einen zweiten, rein beobachtungsbasierten
Maßstab gegenüber: die Diskriminante $\mu = M/m$, mit $M$ der Masse des Zielkörpers und $m$ der
gemeinsamen Masse aller übrigen Körper, die dessen Bahnzone teilen. Für Mars ($\mu \approx 5100$,
gegen die erdnahen Objekte) und Ceres ($\mu = (1/4)/(3/4) \approx 1/3$, gegen den übrigen
Hauptgürtel, da Ceres rund ein Viertel von dessen Masse trägt) klafft eine Lücke von vier
Größenordnungen; Pluto liegt mit rund 7 Prozent der Kuipergürtelmasse bei $\mu \approx 0{,}07$.
Soter schlägt $\mu = 100$ als Grenze zwischen Planeten und Nichtplaneten vor, mittig in der
beobachteten Lücke, mit einem vertretbaren Spielraum von etwa 10 bis 1000.

[Margot (2015)](literatur:margot-2015) formalisierte den Streuparameter $\Lambda$ zu einer
Räumungszeit $t_\mathrm{clear}$, ab der ein Körper der Masse $M_p$ im Abstand $a_p$ um einen Stern
der Masse $M_\mathrm{star}$ sein Umfeld bis zum $C$-Fachen des eigenen Hill-Radius (üblich $C = 2\sqrt{3}$)
frei geräumt hat. Daraus folgt eine Mindestmasse $M_\mathrm{clear}$ für die Räumung innerhalb einer
Zeit $t$ und, für Hauptreihensterne mit der Näherung $t_\mathrm{MS}/t_\odot \approx
(M_\mathrm{star}/M_\odot)^{-2{,}5}$, die geschlossene Form

$$\frac{M_\mathrm{clear}}{M_\oplus} \approx 1{,}9 \times 10^{-4}\,C^{3/2}
\left(\frac{M_\mathrm{star}}{M_\odot}\right)^{5/2} \left(\frac{a_p}{1\,\mathrm{AU}}\right)^{9/8}$$

Die Diskriminante $\Pi = M_\mathrm{body}/M_\mathrm{clear}$ trennt Planeten von Nichtplaneten bei
$\Pi = 1$. Für das Sonnensystem ($C = 2\sqrt{3}$, $t = t_\mathrm{MS}$) ergibt das:

| Körper | Masse ($M_\oplus$) | $\Pi$ |
|---|---:|---:|
| Jupiter | 317,90 | $4{,}0 \times 10^4$ |
| Erde | 1,000 | $8{,}1 \times 10^2$ |
| Merkur | 0,055 | $1{,}3 \times 10^2$ |
| Mars | 0,107 | $5{,}4 \times 10^1$ |
| Ceres | $1{,}6 \times 10^{-4}$ | $4{,}0 \times 10^{-2}$ |
| Pluto | $2{,}2 \times 10^{-3}$ | $2{,}8 \times 10^{-2}$ |
| Eris | $2{,}8 \times 10^{-3}$ | $2{,}0 \times 10^{-2}$ |

Alle acht Planeten liegen weit über $\Pi = 1$, Ceres, Pluto und Eris weit darunter — zwischen dem
kleinsten Planetenwert (Mars, $\Pi = 54$) und dem größten Nichtplanetenwert (Ceres,
$\Pi = 0{,}04$) liegt eine Lücke von gut drei Größenordnungen (Faktor rund 1350), obwohl Plutos
Masse die Merkurs nur um den Faktor 25 unterschreitet: Merkurs $\Pi$ übertrifft Plutos um mehr als
das 4000-Fache (eigene Rechnung aus der Tabelle). Haumea und Makemake führt Margots
Originaltabelle nicht; ihre Massen liegen zwischen denen von Ceres und Pluto (eigene Rechnung:
$6{,}6 \times 10^{-4}\,M_\oplus$ beziehungsweise $4{,}5 \times 10^{-4}\,M_\oplus$), und da beide
ähnlich weit draußen wie Pluto und Eris umlaufen, läge ihr $\Pi$ ebenfalls weit unterhalb der
Lücke. Drei unabhängig konstruierte Maßstäbe — Stern und
Levisons theoretischer Streuparameter, Soters beobachtete Diskriminante und Margots
Räumungszeit-Kriterium — trennen damit übereinstimmend dieselben acht Körper von allen übrigen.

## Hydrostatisches Gleichgewicht

Das zweite Kriterium ist weniger scharf, als es zunächst scheint: Ab welcher Größe die
Eigenschwerkraft die Materialfestigkeit überwindet, hängt von Zusammensetzung, Temperatur und
Geschichte des Körpers ab, nicht allein von seiner Masse. Eisige Körper werden schon bei einigen
hundert Kilometern Durchmesser rund, weil Wassereis bei den niedrigen Temperaturen des äußeren
Sonnensystems deutlich weniger Festigkeit gegen langsames Fließen (Kriechen) hat als Gestein;
Gesteinskörper brauchen entsprechend mehr Masse. Tancredi und Favre untersuchten dieses Problem
systematisch anhand der damals verfügbaren Form- und Größendaten von Asteroiden und
transneptunischen Objekten und schlugen beobachtbare Kriterien (etwa aus absoluter Helligkeit und
Albedo) vor, um abzuschätzen, welche Körper voraussichtlich im Gleichgewicht sind, ohne für jeden
einzelnen eine direkte Formmessung zu benötigen
([Tancredi und Favre 2008](literatur:tancredi-2008)).

Auch unter den fünf anerkannten Zwergplaneten ist „annähernd rund" kein Alles-oder-Nichts-Befund.
Ceres ist am Äquator praktisch kreisförmig, aber mit rund 7,5 Prozent polarer Abplattung
deutlich stärker abgeplattet, als ihre heutige, vergleichsweise langsame Rotation von rund 9,07 h
erwarten ließe; Ceres nähert sich dem hydrostatischen Gleichgewicht damit an, erreicht es aber
nicht exakt (Einzelheiten und Zahlen unter [Ceres](objekt:ceres)). Haumea ist der ausgeprägteste
Grenzfall: Mit einer Rotationsperiode von nur 3,92 h und einem Achsenverhältnis von ungefähr
2:1,6:1 ist offen, ob ihre Form tatsächlich einem Jacobi-Ellipsoid entspricht, der
Gleichgewichtsform eines homogenen, starr rotierenden Fluidkörpers; eine ältere Lichtkurvenlösung
passt gut zu diesem Bild, während die genauere Sternbedeckungsform von 2017 eher zu einem
inhomogenen, aber ebenfalls im Gleichgewicht befindlichen Körper passt, und eine neuere Rechnung
für 2026 eine mit künftigen Bedeckungen entscheidbare Vorhersage macht (Streitstand und Belege
unter [Haumea](objekt:haumea)). Ein drittes, gegenteiliges Beispiel liefert der Saturnmond
[Iapetus](objekt:iapetus): Seine heutige Form entspricht nicht seiner heutigen, gebundenen Rotation
von rund 79 Tagen, sondern ist als „eingefrorenes" Relikt einer früheren, rund 16-stündigen
Rotation erhalten geblieben — ein Beleg dafür, dass die Gleichgewichtsform eines Körpers auch seine
vergangene, nicht nur seine gegenwärtige Geschichte spiegeln kann, sobald eine ausreichend feste
Lithosphäre die alte Form konserviert.

Jenseits der fünf offiziell anerkannten Zwergplaneten gelten mehrere weitere transneptunische
Objekte als plausible, aber nicht förmlich eingestufte Kandidaten, allen voran Gonggong, Quaoar,
Sedna und Orcus — allesamt groß genug (einige hundert Kilometer Radius), dass hydrostatisches
Gleichgewicht wahrscheinlich, aber mangels direkter Form- oder Schwerefeldmessung nicht
nachgewiesen ist. JWST-Spektroskopie von Sedna, Gonggong und Quaoar fand bei allen drei
komplexe, aus bestrahltem Methan entstandene organische Verbindungen und deutet die Befunde als
Hinweis auf innere Aufschmelzung und geochemische Entwicklung, ähnlich den großen, anerkannten
Zwergplaneten und deutlich verschieden von den übrigen, kleineren Kuipergürtelobjekten
([Emery et al. 2024](literatur:emery-2024)) — ein indirektes Argument für innere Differenzierung,
aber kein Nachweis der äußeren Gleichgewichtsform selbst. Orcus, mit seinem großen Mond Vanth
dynamisch eng an Pluto angelehnt (beide in 3:2-Resonanz mit Neptun), erreicht mit Vanth zusammen
das bislang höchste bekannte Mond-Hauptkörper-Masseverhältnis unter Planeten oder Zwergplaneten
überhaupt (Zahlen unter [Charon](objekt:charon)).

## Vergleich der fünf anerkannten Zwergplaneten

Die folgende Tabelle stellt die Kenngrößen der fünf Körper aus ihren eigenen Texten und dem
Datensatz gegenüber; Radius, Masse und Rotationsperiode sind gemessene Werte, die Dichte folgt bei
Ceres, Pluto, Eris und Makemake daraus über $\bar\rho = 3M/(4\pi R^3)$ (Herleitung), bei Haumea aus
der Spanne zweier unabhängiger Formlösungen (siehe unten); $a$, $e$ und $i$ sind die
heliozentrischen Bahnelemente des Datensatzes zur jeweiligen Epoche.

| Körper | Radius (km) | Masse (kg) | Dichte ($\mathrm{g\,cm^{-3}}$) | Albedo | Rotation (h) | $a$ (AU) | $e$ | $i$ (°) | Monde |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ceres | 469,7 | $9{,}3835 \times 10^{20}$ | 2,162 | 0,090 | 9,074 | 2,766 | 0,0797 | 10,588 | 0 |
| Pluto | 1188,3 | $1{,}303 \times 10^{22}$ | 1,85 | 0,62 | 153,293 | 39,589 | 0,2518 | 17,148 | 5 |
| Eris | 1163 | $1{,}638 \times 10^{22}$ | 2,49 | 0,96 | 378,864 | 67,934 | 0,438 | 43,926 | 1 |
| Haumea | 774,1 | $3{,}952 \times 10^{21}$ | 1,86–2,05 | 0,51 | 3,915 | 43,060 | 0,194 | 28,208 | 2 |
| Makemake | 715 | $2{,}69 \times 10^{21}$ | 1,76 | 0,77 | 22,83/11,41 | 45,571 | 0,159 | 29,028 | 1 |

Die Reihe zeigt eine Spanne von fast einer Größenordnung in der Masse und dem Radius, aber
Dichten, die alle zwischen der von Wassereis und der von Gestein liegen: Ceres und Eris, die beiden
massereichsten, sind auch die dichtesten, während Haumea und Makemake trotz vergleichbarer
Masse zu Pluto deutlich weniger dicht sind — ein erster Hinweis auf die im nächsten Abschnitt
behandelte Größen-Dichte-Beziehung. Bei [Pluto](objekt:pluto) weicht die hier gezeigte,
photometrisch gemessene Albedo vom Datensatzwert ab (0,52 Katalog gegen 0,62 gemessen); der Grund
steht dort unter „Im Modell". Haumeas Dichte
und Radius hängen von der verwendeten Formlösung ab (Einzelheiten unten und unter
[Haumea](objekt:haumea)), Makemakes Rotationsperiode ist mit Stand September 2026 nicht
eindeutig geklärt ([Makemake](objekt:makemake)), und seine Masse beruht auf einem
unbegutachteten Vorabdruck (siehe unten).

## Größen-Dichte-Beziehung und flüchtige Stoffe

Über die transneptunischen Objekte hinweg steigt die mittlere Dichte tendenziell mit der Größe:
Bierson und Nimmo deuten das als Folge sinkender Porosität, weil größere Körper unter höherem
Innendruck und, bei ausreichender Größe, höherer radiogener Temperatur ihren anfänglich lockeren,
porösen Gesteinsanteil stärker verdichten. Für 14 von 17 Objekten mit gemessener Dichte trifft ein
gemeinsamer, über alle Körper konstanter Gesteinsmassenanteil von rund 70 Prozent die beobachteten
Werte innerhalb der doppelten Messunsicherheit; aus der für eine solche Verdichtung nötigen
radiogenen Aufheizung durch das kurzlebige Isotop ${}^{26}\mathrm{Al}$ folgt eine Mindestbildungszeit von rund
4 Millionen Jahren nach den ersten Festkörpern des Sonnensystems
([Bierson und Nimmo 2019](literatur:bierson-2019)). Ceres und Pluto folgen dieser Größen-Dichte-
Tendenz ungefähr, Eris liegt mit seiner hohen Dichte bei vergleichsweise moderater Größe eher
darüber, während Haumea und Makemake trotz ähnlicher oder größerer Masse als Pluto deutlich
weniger dicht sind (siehe Tabelle oben) — ein Hinweis darauf, dass neben der Größe auch die
Kollisionsgeschichte eines Körpers seine heutige Dichte mitbestimmt (siehe unten).

Ob ein Körper flüchtige Stoffe wie Stickstoff-, Methan- oder Kohlenmonoxideis an seiner Oberfläche
behält oder sie im Lauf der Zeit ins All verliert, hängt von seiner Fluchtgeschwindigkeit und
seiner Oberflächentemperatur ab, die wiederum vom Sonnenabstand und der Albedo bestimmt wird;
Schaller und Brown modellierten diesen Wettlauf zwischen Sublimation und Entweichen für die
bekannten großen Kuipergürtelobjekte und grenzten ab, welche von ihnen über das Alter des
Sonnensystems flüchtige Eise halten konnten und welche nicht
([Schaller und Brown 2007](literatur:schaller-brown-2007); Zahlen für die einzelnen Körper unter
[Makemake](objekt:makemake)).

Große Kuipergürtelobjekte tragen auffällig oft Monde: Brown et al. durchsuchten die damals vier
hellsten bekannten Kuipergürtelobjekte systematisch mit adaptiver Optik am Keck-Observatorium und
fanden bei dreien — Pluto, dem heutigen Haumea und dem heutigen Eris — jeweils mindestens einen
Mond ([Brown et al. 2006](literatur:brown-2006)). Barr und Schwamb werten diese Häufung als
Hinweis auf eine gemeinsame Entstehung durch große Einschläge und ordnen die bekannten Systeme
danach in zwei Gruppen: Systeme mit großem, massereichem Mond wie Pluto–Charon behalten bei einem
schürfenden, langsamen Einschlag die eisreiche Ausgangsdichte beider Partner nahezu vollständig,
während Systeme mit kleinem Mond wie Eris, Haumea oder Quaoar in energiereicheren Einschlägen
einen größeren Teil ihres Eismantels verlieren und dadurch dichter zurückbleiben
([Barr und Schwamb 2016](literatur:barr-schwamb-2016)). Haumeas Fall ist dabei doppelt besonders:
Derselbe Einschlag, der ihre schnelle Rotation und ihre beiden Monde Hiʻiaka und Namaka erklären
soll, hat nach dieser Deutung auch ihre vergleichsweise hohe Dichte hinterlassen (Streitstand zu
Haumeas Familienentstehung unter [Haumea](objekt:haumea)). Haumea trägt außerdem als bislang
einziger der fünf Zwergplaneten einen bestätigten Ring, rund 70 km breit bei etwa 2287 km Abstand,
in der Ebene ihres Äquators und ihres größten Monds; ob ähnliche Ringe auch anderswo im
Kuipergürtel üblich sind, ist offen ([Ringe](thema:ringe)).

## Streit um die Definition

Die IAU-Definition von 2006 ist nicht unumstritten. Ihr wichtigster Kritikpunkt: Das
Freiräum-Kriterium hängt vom Sonnenabstand ab, weil dieselbe Masse eine Bahnzone umso schwerer
räumt, je weiter draußen und je größer sie ist — ein Körper mit Pluto-artiger Masse an Erdbahn-
Abstand würde das Kriterium mühelos erfüllen, während er es an Neptunbahn-Abstand nicht tut.
Metzger et al. schlagen deshalb eine rein geophysikalische Definition vor, nach der ein Planet
allein über die eigene hydrostatische Rundheit definiert wird, unabhängig von der Bahnumgebung;
in dieser Lesart wären Pluto und die übrigen Zwergplaneten ebenso Planeten wie hydrostatisch runde
Monde ([Metzger et al. 2022](literatur:metzger-2022)). Die drei quantitativen Freiräum-Kriterien
oben zeigen umgekehrt, dass sich die IAU-Grenze — trotz ihrer qualitativen Formulierung —
unabhängig von der genauen Methode an derselben Stelle im Sonnensystem festmachen lässt, was für
ihre dynamische Aussagekraft spricht. Beide Seiten haben damit tragfähige Argumente; die Fachwelt
hat sich nicht auf ein gemeinsames Kriterium geeinigt, und Orrery folgt, wie bereits bei
[Pluto](objekt:pluto) dargestellt, der IAU-Einstufung, ohne den Streit zu entscheiden.

## Offene Fragen

- **Welche Kandidaten sind tatsächlich im hydrostatischen Gleichgewicht?** Für Gonggong, Quaoar,
  Sedna und Orcus fehlen direkte Form- oder Schwerefeldmessungen; die JWST-Spektren sprechen für
  innere Differenzierung, sind aber kein Nachweis der äußeren Form
  ([Emery et al. 2024](literatur:emery-2024)). Auch unter den fünf anerkannten Körpern bleibt
  Haumeas Jacobi-Ellipsoid-Frage offen ([Haumea](objekt:haumea)).
- **Trägt das Freiräum-Kriterium fachlich, oder ist eine geophysikalische Definition vorzuziehen?**
  Beide Seiten sind belegt und nicht entschieden
  ([IAU 2006](literatur:iau-2006); [Metzger et al. 2022](literatur:metzger-2022)).
- **Woher stammt die Größen-Dichte-Beziehung transneptunischer Objekte?** Bierson und Nimmo deuten
  sie als Folge sinkender Porosität bei gleichbleibendem Gesteinsanteil
  ([Bierson und Nimmo 2019](literatur:bierson-2019)); wie stark daneben unterschiedliche
  Einschlagsgeschichten (siehe oben, [Barr und Schwamb 2016](literatur:barr-schwamb-2016)) die
  einzelnen Körper von diesem gemeinsamen Trend abweichen lassen, ist nicht sauber getrennt.
- **Wie häufig sind Ringe und Monde unter transneptunischen Objekten?** Bislang ist nur Haumea
  unter den fünf anerkannten Zwergplaneten mit einem Ring bekannt, während mit Quaoar und
  Chariklo auch deutlich kleinere Körper Ringe tragen ([Ringe](thema:ringe)); ob sich daraus eine
  allgemeine Häufigkeit ableiten lässt, ist bei der bislang kleinen Zahl bekannter Fälle offen.

## Im Modell

Orrery führt alle fünf anerkannten Zwergplaneten mit `kind: 'dwarf'` als heliozentrische Körper,
mit oskulierenden Elementen der JPL Small-Body Database zu einer eigenen Epoche und allen Raten
außer $\dot L$ auf null gesetzt (wie [Bahnelemente](thema:bahnelemente)), gegen die Ekliptik J2000
(wie [Bezugssysteme](thema:bezugssysteme)). Von den Monden der Zwergplaneten steht nur Charon im
Katalog; Dysnomia (Eris), Hiʻiaka und Namaka (Haumea) sowie MK 2 (Makemake) fehlen ebenso wie
Plutos vier kleine Monde Styx, Nix, Kerberos und Hydra.

Die Pole folgen je nach Datenlage unterschiedlichen Verfahren: Ceres und Pluto tragen einen aus
Raumsonden- beziehungsweise Kernel-Daten gemessenen IAU-Pol, Haumeas Pol stammt aus einer von zwei
nahezu gleichwertigen Lichtkurven-Inversionslösungen, und Eris sowie Makemake tragen mangels
gemessenen Pols ersatzweise die eigene Bahnnormale — eine ausdrückliche Behelfsannahme, die dem
publizierten Kippwinkel sogar widerspricht: bei Eris rund 78°, wie unter
[Achsneigung](thema:achsneigung) hergeleitet, bei Makemake 46° bis 78°
([Parker et al. 2016](literatur:parker-2016)). Alle fünf Körper sind im Modell Kugeln ohne
Abplattung, auch Haumea: Ihr stark dreiachsiger Umriss (Halbachsen rund 1061, 844 und 514 km)
weicht von der Modellkugel (Radius 774,1 km) entlang der langen Achse um rund −27 Prozent und
entlang der kurzen Achse um rund +51 Prozent ab (Einzelheiten unter [Haumea](objekt:haumea)); ihr
Ring fehlt im Modell vollständig. Alle vier Texturen der transneptunischen Zwergplaneten (Ceres,
Eris, Haumea, Makemake) sind bei der Quelle ausdrücklich als „fictional" gekennzeichnet, weil für
diese Körper keine flächendeckende Kartierung existiert (`ASSETS.md`); Plutos und Charons
Texturen dagegen beruhen auf dem tatsächlichen New-Horizons-Mosaik ihrer angeflogenen Hemisphäre
(siehe [Pluto](objekt:pluto), [Charon](objekt:charon)).

Die Systemgröße der Kinoszenen (`systemRadiusKm` in `src/render/camera/cinema.ts`) bezieht sich
ausdrücklich nur auf `AEUSSERSTER_PLANET = 'neptune'` und schließt die Zwergplaneten bewusst aus:
Eris' stark exzentrische Bahn reicht im Aphel bis auf rund 98 AE, weiter hinaus als Neptun, und
würde jede an der Systemgröße orientierte Kameraszene unverhältnismäßig aufblähen. Der
Kuipergürtel selbst ist, wie unter [Entstehung des Sonnensystems](thema:entstehung) beschrieben,
eine Punktwolke mit festen Bahnelementen ohne eigene Dynamik; die dort erzeugte Verteilung enthält
keine der hier besprochenen fünf Körper und keinen der Kandidaten Gonggong, Quaoar, Sedna oder
Orcus, die im Modell durchweg fehlen. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
