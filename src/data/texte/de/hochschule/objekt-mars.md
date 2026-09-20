# Mars

Mars, der äußere Nachbar der Erde, ist unter den Gesteinsplaneten der am gründlichsten erkundete:
Seit den 1960er-Jahren haben mehr als ein Dutzend Orbiter, Lander und Rover ihn vermessen, zuletzt
InSight mit dem ersten Seismometer außerhalb von Erde und Mond. Dieser Text stellt Schwerefeld,
Inneres, Oberfläche, Atmosphäre und Bahn dar, verfolgt den seit 2023 laufenden Streit um Größe und
Zustand seines Kerns und beschreibt zuletzt, was Orrery davon abbildet. Die Monde Phobos und Deimos
sind hier nur Verweis; sie haben eigene Texte.

## Kenngrößen und Messung

Radio-Bahnverfolgung von Orbitern und Landern liefert Marsʼ Schwerefeld und, über die Präzession
seiner Rotationsachse, den [Trägheitsmomentfaktor](thema:innerer-aufbau) $C/(M a^2)$. Aus Doppler-
und Entfernungsmessungen der Landesonde Pathfinder zusammen mit den älteren Viking-Landern folgte
1997 eine Präzession von $-7576 \pm 35$ Millibogensekunden (mas) je Jahr, ein Hinweis auf einen
dichten, metallischen Kern; dieselben Daten zeigten den jahreszeitlichen Massenaustausch von
Kohlendioxid zwischen Atmosphäre und Polkappen unmittelbar in der Rotation selbst
([Folkner et al. 1997](literatur:folkner-1997)). Eine eigens verlängerte Standzeit des Rovers
Opportunity während des Marswinters 2012 verbesserte den Wert 2014 auf
$-7606{,}1 \pm 3{,}5\,\mathrm{mas}$ je Jahr ([Kuchynka et al. 2014](literatur:kuchynka-2014)); dieses
Rotationsmodell bildet seither die Grundlage der amtlichen IAU-Empfehlung (siehe „Im Modell"). Die
Radiowissenschaft des InSight-Landers (RISE) verschärfte die Präzession 2023 auf
$-7598{,}1 \pm 2{,}2\,\mathrm{mas}$ je Jahr und daraus, mit $J_2 = 0{,}0019566$, den normierten
polaren Trägheitsmomentfaktor auf $C/(M a^2) = 0{,}36419 \pm 0{,}00011$ (Bezugsradius
$a = 3396\,\mathrm{km}$; auf den mittleren Radius $3389{,}5\,\mathrm{km}$ bezogen
$0{,}36428 \pm 0{,}00011$) ([Le Maistre et al. 2023](literatur:le-maistre-2023)). Form und
Schwerefeld weichen dabei von der reinen Radau-Darwin-Näherung eines hydrostatischen Körpers um
3,0 % ab, erklärbar mit einer im langen Mittel flüssigkeitsähnlichen, aber mit eingebetteten
Massenanomalien versehenen festen Schale ([Le Maistre et al. 2023](literatur:le-maistre-2023)).
Dieselbe Bahnverfolgung zeigte zudem eine langsame Beschleunigung der Marsrotation, deren Ursache –
innere Dynamik oder ein längerfristiger Trend in Atmosphäre und Eiskappen – offen ist.

Erstmals außerhalb der Erde gelang 2020 der Nachweis einer Chandler-Wobbel: Aus der Bahnverfolgung
dreier Orbiter ergab sich eine Periode von $206{,}9 \pm 0{,}5$ Tagen bei $10\,\mathrm{cm}$ Amplitude
am Pol; zusammen mit der Gezeiten-Love-Zahl $k_2 = 0{,}169 \pm 0{,}006$ begrenzt sie die Rheologie
des Mantels, insbesondere ihre Frequenzabhängigkeit über lange Perioden
([Konopliv et al. 2020](literatur:konopliv-2020)). Die folgende Tabelle fasst die wichtigsten
Kenngrößen zusammen.

| Größe | Wert | Unsicherheit | Bestimmung | Beleg |
|---|---|---|---|---|
| Masse | $6{,}4169 \cdot 10^{23}\,\mathrm{kg}$ | – | Bahnverfolgung von Orbitern und Landern | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| $GM$ | $42828\,\mathrm{km^3\,s^{-2}}$ | – | Bahnverfolgung | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| Äquatorradius | $3396{,}2\,\mathrm{km}$ | – | Laseraltimetrie (MOLA) | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| Polradius | $3376{,}2\,\mathrm{km}$ | – | Laseraltimetrie (MOLA) | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| Volumenmittelradius | $3389{,}5\,\mathrm{km}$ | – | Laseraltimetrie (MOLA) | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| $J_2$ | $0{,}0019566$ | – | Bahnverfolgung (InSight RISE) | [Le Maistre et al. 2023](literatur:le-maistre-2023) |
| $C/(M a^2)$ | $0{,}36419$ | $0{,}00011$ | Präzession aus Radiodaten (InSight, Viking), $J_2$ | [Le Maistre et al. 2023](literatur:le-maistre-2023) |
| Präzessionsrate | $-7598{,}1$ mas/Jahr | $2{,}2$ mas/Jahr | Radio-Bahnverfolgung InSight RISE | [Le Maistre et al. 2023](literatur:le-maistre-2023) |
| Chandler-Periode | $206{,}9$ Tage | $0{,}5$ Tage | Bahnverfolgung dreier Orbiter | [Konopliv et al. 2020](literatur:konopliv-2020) |
| $k_2$ | $0{,}169$ | $0{,}006$ | Gezeiten-Schwerefeld | [Konopliv et al. 2020](literatur:konopliv-2020) |

Mit Masse und Volumenmittelradius folgt eine mittlere Dichte von $3934\,\mathrm{kg\,m^{-3}}$
([NSSDC Mars Fact Sheet](quelle:nssdc-mars)), deutlich unter der der Erde
($5513\,\mathrm{kg\,m^{-3}}$) – ein früher Hinweis auf einen kleineren, an schweren Elementen
ärmeren Kern (siehe „Inneres").

## Inneres

Marsʼ Inneres ist seit 2021 direkt seismisch erschlossen. Acht schwache, mit direkten und mehrfach
reflektierten Wellenphasen ausgewertete Beben ergaben eine 24 bis 72 km dicke Kruste über einer
ungewöhnlich mächtigen thermischen Lithosphäre nahe 500 km Tiefe und einen flüssigen Kern von rund
1830 km Radius ([Stähler et al. 2021](literatur:staehler-2021)). Eine begleitende Auswertung des
oberen Mantels fand darunter eine Niedriggeschwindigkeitszone, verträglich mit einer gegenüber der
Erde deutlich dickeren thermischen Grenzschicht ([Khan et al. 2021](literatur:khan-2021)), während
eine dritte Arbeit die Krustendicke auf denselben Bereich von 24 bis 72 km eingrenzte und ebenfalls
eine langsame Schicht unter der Lithosphäre vermutete
([Knapmeyer-Endrun et al. 2021](literatur:knapmeyer-endrun-2021)).

Die Radiowissenschaft von InSight (RISE) sah zusätzlich eine Resonanz zwischen der erzwungenen
Nutation und der freien Kernnutation, deren Verstärkung ($0{,}0615 \pm 0{,}007$) vor allem am
Kernradius, deren Periode ($-243 \pm 3{,}3$ Tage) vor allem an seiner Form hängt: Für einen ganz
festen Mantel folgt ein flüssiger Kern von $1835 \pm 55\,\mathrm{km}$ Radius und $5955$ bis
$6290\,\mathrm{kg\,m^{-3}}$ mittlerer Dichte, mit einem Dichtesprung an der Kern-Mantel-Grenze von
$1690$ bis $2110\,\mathrm{kg\,m^{-3}}$; die Nutationsdaten sprechen dabei gegen einen festen inneren
Kern ([Le Maistre et al. 2023](literatur:le-maistre-2023)).

Seit 2023 ist umstritten, ob über diesem Kern zusätzlich eine eigene, geschmolzene Silikatschicht
liegt. Aus mehrfach an der Kern-Mantel-Grenze gebeugten P-Wellen folgt ein kleinerer, dichterer Kern
von $1675 \pm 30\,\mathrm{km}$ unter einer $150 \pm 15\,\mathrm{km}$ dicken geschmolzenen Schicht,
mit einer Kernzusammensetzung von 85 bis 91 Gewichtsprozent Eisen-Nickel und 9 bis 15 Gewichtsprozent
leichten Elementen, vor allem Schwefel, Kohlenstoff, Sauerstoff und Wasserstoff
([Khan et al. 2023](literatur:khan-2023)). Eine unabhängige Auswertung, die auch die
Gezeitendissipation durch [Phobos](objekt:phobos) einbezieht, kommt mit einem geschichteten Mantel
auf einen Kern von rund $1650\,\mathrm{km}$ bei $6{,}5\,\mathrm{g\,cm^{-3}}$
([Samuel et al. 2023](literatur:samuel-2023)); beide Modelle senken die zuvor nötige, petrologisch
schwer zu erklärende Menge leichter Elemente im Kern. 2025 fanden Bi et al. in Phasen, die den Kern
durchqueren oder an seiner Mitte reflektiert werden (PKKP, PKiKP), einen rund 30-prozentigen Sprung
der Kompressionswellengeschwindigkeit und daraus einen festen inneren Kern von
$613 \pm 67\,\mathrm{km}$ Radius – ein Ergebnis, das der aus der Nutation gefolgerten Abwesenheit
eines inneren Kerns widerspricht (siehe „Offene Fragen") und auf eine Kristallisation mit
angereicherten leichten Elementen im Zentrum hindeutet, mit möglichem Bezug zum erloschenen
Magnetfeld ([Bi et al. 2025](literatur:bi-2025)).

## Oberfläche

Marsʼ auffälligstes globales Merkmal ist die Dichotomie zwischen den alten, dicht verkraterten
südlichen Hochländern und den jüngeren, glatteren nördlichen Tiefländern: Nach Höhenmessungen des
Mars Orbiter Laser Altimeter (MOLA), mit einer radialen Genauigkeit von rund einem Meter gegen den
Schwerpunkt und einem globalen Gitter von 1/64° mal 1/32° Breite und Länge
([Smith et al. 2001](literatur:smith-2001)), liegen die Tiefländer im Mittel mehrere Kilometer
tiefer, und ihre Kruste ist deutlich dünner (siehe „Inneres"); ob ein einzelner Riesenimpakt oder
mantelinterne Konvektion die Ursache ist, ist unentschieden (siehe „Offene Fragen"). In der
Tharsis-Vulkanprovinz erreicht Olympus Mons nach MOLA-Höhendaten eine Gipfelhöhe von bis zu
21,1 km und ist damit der höchste bekannte Vulkan des Sonnensystems
([Plescia 2004](literatur:plescia-2004)); östlich davon zieht sich das nach amtlicher
IAU-Nomenklatur 3769 km lange Canyonsystem Valles Marineris über gut ein Sechstel des Marsumfangs
([USGS Astrogeology Science Center 2026](literatur:usgs-gazetteer-2026)).

Orbitale Infrarotspektroskopie und die In-situ-Erkundung durch Rover zeigen eine basaltische
Oberkruste mit regional wechselnden Anteilen von Plagioklas, Pyroxen und Olivin. Tonminerale in weit
verbreiteten Aufschlüssen der ältesten, noachischen Kruste belegen frühe Verwitterung sowie
hydrothermale und diagenetische wässrige Umgebungen; jüngere noachische und hesperische Sedimente
enthalten zudem Paläoseeablagerungen mit Tonen, Karbonaten, Sulfaten und Chloriden
([Ehlmann und Edwards 2014](literatur:ehlmann-2014)) – Belege für einstiges flüssiges Wasser, die
zusammen mit eingeschnittenen Talnetzen die Klimadebatte prägen (siehe „Entstehung und
Entwicklung"). Die Polkappen bestehen aus einer ganzjährigen Wassereisbasis unter einer
jahreszeitlich wachsenden und schrumpfenden Kohlendioxidschicht
([Byrne 2009](literatur:byrne-2009)), deren Kondensation und Sublimation den globalen Luftdruck
steuert (siehe „Atmosphäre und Magnetosphäre"); neben häufigen regionalen Staubstürmen tritt im
Mittel alle paar Marsjahre, unregelmäßig wiederkehrend, auch ein den ganzen Planeten einhüllender
Sturm auf ([Guzewich et al. 2020](literatur:guzewich-2020)).

## Atmosphäre und Magnetosphäre

Die dünne Atmosphäre besteht zu 95,1 % aus Kohlendioxid, dazu 2,59 % Stickstoff, 1,94 % Argon,
0,16 % Sauerstoff und 0,06 % Kohlenmonoxid; der mittlere Bodendruck liegt bei 6,36 mbar und
schwankt jahreszeitlich zwischen 4,0 und 8,7 mbar, weil abwechselnd an einer Polkappe Kohlendioxid
ausfriert und an der anderen sublimiert ([NSSDC Mars Fact Sheet](quelle:nssdc-mars); zur Kopplung an
die Rotation siehe „Kenngrößen und Messung"). Die Sonde MAVEN maß über ein volles Marsjahr
Verlustraten von Wasserstoff und Sauerstoff ins All von zusammen rund 2 bis 3 kg/s; hochgerechnet auf
die frühere, deutlich stärkere UV- und Teilchenstrahlung der jungen [Sonne](objekt:sun) entspräche
der integrierte Verlust bis zu 0,8 bar Kohlendioxid oder einer global 23 m dicken Wasserschicht
([Jakosky et al. 2018](literatur:jakosky-2018)) – ein wesentlicher Baustein der Erklärung, wie aus
einer einst dichteren Atmosphäre die heutige dünne wurde (siehe „Entstehung und Entwicklung").

Anders als die [Erde](objekt:earth) hat Mars kein globales, im Kern erzeugtes Magnetfeld. Das
Magnetometer der Sonde Mars Global Surveyor fand jedoch stark magnetisierte Krustenstreifen, die mit
dem alten, verkraterten Hochland korrelieren; in der Umgebung der großen Einschlagsbecken Hellas und
Argyre fehlt jede Krustenmagnetisierung, was auf ein Erlöschen des inneren Dynamos schon im frühen
Noachium vor rund 4 Milliarden Jahren hindeutet
([Acuña et al. 1999](literatur:acuna-1999)). Die verbliebenen, lokal begrenzten Magnetfelder formen
kleine, an die Kruste gebundene „Minimagnetosphären", ohne die globale Abschirmung eines Dipolfelds
wie bei der Erde.

## Bahn, Rotation und Dynamik

Mars umläuft die Sonne in 686,98 Tagen auf einer mit $e = 0{,}0934$ merklich exzentrischen Bahn
([Bahnelemente](thema:bahnelemente)); der Sonnenabstand schwankt dadurch um rund 21 % zwischen
Perihel und Aphel, was die Jahreszeiten der Südhalbkugel schärfer ausfallen lässt als die der
Nordhalbkugel. Die siderische Rotationsperiode beträgt $24{,}6229\,\mathrm{h}$; weil Mars sich
während eines Umlaufs zusätzlich um rund $1/687$ Umdrehung weiterbewegt, dauert ein Sonnentag (Sol)
mit $24\,\mathrm{h}\,39\,\mathrm{min}\,35\,\mathrm{s}$ knapp 40 Minuten länger.

Die heutige Achsneigung von $25{,}19^\circ$ ähnelt der der Erde und erzeugt vergleichbare
Jahreszeiten, ist aber, anders als die Erdachse, nicht durch einen großen Mond stabilisiert: Über
Zeiträume von einigen zehn Millionen Jahren lässt sich noch eine Bahn angeben, doch darüber hinaus
wird das System chaotisch. Eine statistische Auswertung von mehr als 600 Bahn- und über 200 000
Neigungslösungen über 5 Milliarden Jahre ergibt eine mittlere Achsneigung von
$37{,}62^\circ \pm 13{,}82^\circ$ mit Spitzenwerten bis $82{,}035^\circ$
([Laskar et al. 2004a](literatur:laskar-2004a)) – die heutige, vergleichsweise moderate Neigung ist
also nur eine Momentaufnahme einer im Mittel weit stärker taumelnden Achse (siehe
[Achsneigung](thema:achsneigung)). Mit der Neigung ändert sich langfristig auch, wie viel
Sonnenlicht die Pole gegenüber dem Äquator erhalten, mit unmittelbaren Folgen für die Stabilität der
Polkappen und damit den Atmosphärendruck.

Die oben beschriebene Präzession der Rotationsachse und die freie Chandler-Wobbel (siehe
[Trägheitsmomentfaktor](thema:innerer-aufbau)) laufen unabhängig von dieser langfristigen,
chaotischen Neigungsänderung: Erstere ist eine erzwungene, periodische Bewegung des Pols im Raum,
Letztere eine freie Schwingung des Pols im Körper selbst. Beide Marsmonde,
[Phobos](objekt:phobos) und [Deimos](objekt:deimos), sind an dieser Dynamik nur als sehr kleine
Störkörper beteiligt; ihre eigenen, ungewöhnlichen Bahnen – Phobos näher an seinem Planeten als jeder
andere bekannte große Mond, Deimos nahe der synchronen Bahn – haben eigene Texte.

## Entstehung und Entwicklung

Hafnium-Wolfram-Chronologie zeigt, dass Mars ungewöhnlich schnell wuchs: Er erreichte schon innerhalb
von höchstens zwei Millionen Jahren nach Bildung der ältesten Kalzium-Aluminium-reichen Einschlüsse
etwa die Hälfte seiner heutigen Masse, noch bevor sich das Gas der protoplanetaren Scheibe auflöste
und während die rund 100 km großen Mutterkörper der Chondrite noch entstanden
([Dauphas und Pourmand 2011](literatur:dauphas-2011)). Dieses rasche Wachstum spricht dafür, dass
Mars, anders als Erde und Venus, ein „steckengebliebener" Planetenembryo ist, der nie mit einem
vergleichbar großen Körper verschmolzen ist – ein möglicher Grund für seine im Vergleich geringe
Masse.

Zwei Modelle konkurrieren dabei, wie das innere Sonnensystem aus dem
[protoplanetaren Sonnennebel](thema:entstehung) diese geringe Masse hervorbrachte. Nach dem
„Grand-Tack"-Szenario wanderte Jupiter zunächst bis auf 1,5 AE einwärts und dann wieder auswärts,
wodurch die Planetesimalscheibe der terrestrischen Planeten auf 1 AE abgeschnitten wurde; die
Gesteinsplaneten bildeten sich anschließend über 30 bis 50 Millionen Jahre aus dieser verkleinerten
Scheibe, mit einem Erde-Mars-Massenverhältnis, das die Beobachtung trifft
([Walsh et al. 2011](literatur:walsh-2011)). Alternativ zeigen 800 dynamische Simulationen, dass
eine erst 1 bis 10 Millionen Jahre nach Auflösung der Gasscheibe einsetzende Instabilität der
äußeren Planeten (verwandt dem „Nizza-Modell") große Protoplaneten aus der Marsregion herausstreut,
während Mars selbst als zurückgelassener Embryo übrig bleibt
([Clement et al. 2018](literatur:clement-2018)). Isotopisch steht Mars, wie auch die
[Erde](objekt:earth), überwiegend im „nicht-karbonischen" Reservoir des frühen Sonnensystems; der
Anteil karbonischen, wasserreicheren Materials liegt anhand von Chrom-, Titan- und
Nickel-Isotopenanomalien bei Mars bei rund 9 %, gegenüber rund 24 % bei der Erde
([Warren 2011](literatur:warren-2011)) – ein Hinweis darauf, dass beide Planeten aus überlappenden,
aber nicht identischen Kornpopulationen der Scheibe entstanden.

Ob das frühe Mars-Klima warm und feucht oder überwiegend kalt und eisig war, ist eine der zentralen
offenen Fragen der Marsforschung (siehe unten): Geologische Belege zeigen einen episodisch warmen
Zustand während des späten Noachiums und frühen Hesperiums vor 3 bis 4 Milliarden Jahren, während
die geringe damalige Sonneneinstrahlung und die begrenzte Treibhauswirkung von Kohlendioxid für einen
im Mittel kalten Zustand sprechen, unterbrochen von kurzen, vermutlich einschlags- oder
vulkanismusgetriebenen Warmphasen, die Wasser- und Eisdepots aufschmolzen und die beobachteten
Talnetze formten ([Wordsworth 2016](literatur:wordsworth-2016)). Seither hat Mars den größten Teil
seiner Atmosphäre verloren (siehe „Atmosphäre und Magnetosphäre").

## Offene Fragen

- **Frühes Klima:** Ob ein im Mittel warmes und feuchtes oder ein überwiegend kaltes und eisiges
  Klima mit kurzen Warmphasen die noachischen und frühen hesperischen Wassermerkmale besser erklärt,
  ist unentschieden; beide Positionen stützen sich auf dieselben geologischen und
  klimamodellierten Befunde ([Wordsworth 2016](literatur:wordsworth-2016); Belege für einstiges
  flüssiges Wasser bei [Ehlmann und Edwards 2014](literatur:ehlmann-2014)).
- **Ursache der Dichotomie:** Numerische Einschlagsimulationen zeigen, dass ein einzelner
  Riesenimpakt nahe dem Nordpol die elliptische Borealis-Senke und damit die dünnere Kruste der
  Tiefländer erklären kann ([Andrews-Hanna et al. 2008](literatur:andrews-hanna-2008)); eine
  Konvektion des Mantels mit Grad-1-Muster, ausgelöst durch eine früh schwache Asthenosphäre, sagt
  dieselbe einseitige Erwärmung und Krustenausdünnung ganz ohne Einschlag voraus
  ([Zhong und Zuber 2001](literatur:zhong-2001)); Schwerefeld und Topographie allein reichen
  bislang nicht aus, um zwischen beiden zu entscheiden.
- **Zustand des Kerns und der Basalschicht:** Nutationsdaten sprechen gegen einen festen inneren
  Kern und für einen homogenen flüssigen Kern von 1830 bis 1835 km Radius
  ([Le Maistre et al. 2023](literatur:le-maistre-2023);
  [Stähler et al. 2021](literatur:staehler-2021)); zwei seismische Auswertungen von 2023 verlangen
  dagegen eine zusätzliche geschmolzene Silikatschicht und damit einen kleineren, dichteren Kern von
  1650 bis 1675 km ([Khan et al. 2023](literatur:khan-2023);
  [Samuel et al. 2023](literatur:samuel-2023)); eine erneute Seismikauswertung 2025 findet
  wiederum Hinweise auf einen festen inneren Kern von $613 \pm 67\,\mathrm{km}$, die dem aus der
  Nutation gefolgerten Fehlen eines inneren Kerns widersprechen
  ([Bi et al. 2025](literatur:bi-2025)) – welches Modell zutrifft, ist offen.
- **Methan:** Der Rover Curiosity misst seit 2012 mit dem Instrument SAM wiederholt Methan im
  Gale-Krater, mit einem jahreszeitlich schwankenden Hintergrund um 0,4 ppbv und einzelnen Spitzen
  bis über 20 ppbv ([Webster et al. 2018](literatur:webster-2018)); der europäisch-russische
  Orbiter ExoMars Trace Gas Orbiter fand dagegen in seinen ersten Beobachtungsmonaten keinerlei
  Methan bis zu einer Nachweisgrenze von 0,05 ppbv, rund eine Größenordnung unter dem
  SAM-Hintergrund ([Korablev et al. 2019](literatur:korablev-2019)); ob Messfehler, lokale
  Freisetzung nahe Gale oder ein noch unverstandener schneller Abbaumechanismus den Widerspruch
  erklären, ist ungeklärt.

## Im Modell

- **Bahn:** Die Elemente stammen aus der JPL-Näherungstafel 1800 bis 2050, linear fortgeschrieben
  gegen die feste Ekliptik J2000 ([Bahnelemente](thema:bahnelemente); zum Bezugsrahmen
  [Bezugssysteme](thema:bezugssysteme)).
- **Rotation:** Die Rotationsperiode `rotationPeriodH` von $24{,}6229\,\mathrm{h}$ trifft das
  NSSDC-Faktenblatt exakt. Die amtliche IAU-Rotationsrate ($350{,}891982^\circ$ je Tag, aus dem
  Rotationsmodell von [Kuchynka et al. 2014](literatur:kuchynka-2014)) entspricht einer Periode von
  $24{,}622962\,\mathrm{h}$, nur 0,22 Sekunden mehr als der Datensatz. Aus Rotations- und Umlaufzeit
  des Modells folgt ein Sonnentag von $24{,}6597\,\mathrm{h} = 24\,\mathrm{h}\,39\,\mathrm{min}\,
  35\,\mathrm{s}$ – exakt der bekannte Wert.
- **Pol und Achsneigung:** Der Kommentar in `mars.ts` wählt bewusst den älteren Pol aus dem
  IAU-Bericht 2009 ($317{,}68143^\circ$/$52{,}88650^\circ$,
  [Archinal et al. 2011](literatur:archinal-2011)) statt des seit dem IAU-Bericht 2015
  ([Archinal et al. 2018](literatur:archinal-2018), aufbauend auf dem Rotationsmodell von
  [Kuchynka et al. 2014](literatur:kuchynka-2014)) amtlichen Pols $317{,}269^\circ$/$54{,}432^\circ$,
  mit der Begründung, der ältere Pol treffe die vielfach zitierte Achsneigung von $25{,}19^\circ$
  exakt, während der neuere $23{,}92^\circ$ ergebe. Die Nachrechnung mit `achsneigungDeg` bestätigt
  beide Zahlen des Kommentars auf die vierte Nachkommastelle ($25{,}1918^\circ$ beziehungsweise
  $23{,}9165^\circ$) – der Kommentar beschreibt den Ist-Zustand also zutreffend. Damit weicht der
  Datensatz **bewusst von der aktuell gültigen IAU-Empfehlung ab**: Archinal et al. 2018
  überarbeiten Marsʼ Pol und Nullmeridian gerade deshalb, weil das ältere Modell nicht mehr dem
  Stand der Bahnverfolgung entsprach. Welcher der beiden Werte für die Achsneigung als „richtiger"
  gelten soll, hängt zudem davon ab, gegen welche Bahnnormale man vergleicht: Die hier verwendete
  stammt aus der auf 1800 bis 2050 gepassten Näherungstafel, nicht aus der von Kuchynka et al.
  verwendeten hochgenauen Ephemeride – ein methodischer Unterschied, der sich mit den Mitteln
  dieses Texts nicht auflösen lässt. Der Datenblock rundet die Achsneigung auf eine Nachkommastelle
  und zeigt deshalb $25{,}2^\circ$ statt $25{,}19^\circ$. `rotationAtEpochDeg` steht auf 0; der
  IAU-Bericht 2015 nennt für die Rotationsphase bei J2000,0 $W_0 = 176{,}049863^\circ$ – Marsʼ
  Kartennullmeridian im Modell liegt deshalb nicht dort, wo der IAU-Bericht ihn setzt, was nur die
  Kartenausrichtung, nicht die Bewegung betrifft.
- **Albedo:** Der Katalogwert 0,170 ist die geometrische Albedo und stimmt mit dem V-Band-Wert nach
  [Mallama et al. 2017](literatur:mallama-2017) überein, wie in
  [Albedo und Helligkeit](thema:photometrie) für alle Planeten belegt. Nach dem dort hergeleiteten
  Streumodell erscheint eine Kugel dieser Albedo im Bild bei voller Phase ohne Nachtseitenfüllung mit
  $0{,}640 \cdot 0{,}170 = 0{,}109$, mit Füllung mit $0{,}890 \cdot 0{,}170 = 0{,}151$ – reine
  Bildwerte vor der Tonwertkurve, keine Albedo. Die Textur (Solar System Scope, CC BY 4.0, siehe
  ASSETS.md) ist eine statische Farbkarte ohne jahreszeitliche Polkappen, Wolken oder Staubstürme;
  eine Atmosphäre stellt Orrery ohnehin nicht dar.
- **Datenblock:** Das Modell-$GM$ aus CODATA-$G$ mal Katalogmasse ergibt
  $42828{,}3\,\mathrm{km^3\,s^{-2}}$, rund 7 ppm über dem NSSDC-Wert. Die aus Katalogmasse und
  großer Halbachse nach dem dritten Keplerschen Gesetz gerechnete Umlaufzeit ergibt 686,98 Tage,
  praktisch identisch mit dem Faktenblattwert. Die Katalogmasse liegt, wie in
  [Innerer Aufbau](thema:innerer-aufbau) für den ganzen Datensatz hergeleitet, 34 ppm unter dem
  Wert, mit dem [Le Maistre et al. 2023](literatur:le-maistre-2023) rechnen.
- Die Bahnen von [Phobos](objekt:phobos) und [Deimos](objekt:deimos) sind auf die Marsäquatorebene
  bezogen (`frame: 'parentEquator'`, Pol aus diesem Datensatz); Einzelheiten und die Nahaufnahme
  [Phobos im Tiefflug](szene:phobos-tiefflug) stehen in ihren eigenen Texten. Weitere
  Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
