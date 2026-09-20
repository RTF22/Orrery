# Jupiter

Jupiter ist mit Abstand der größte Planet und der erste Gasriese von der Sonne aus: mehr als
doppelt so massereich wie alle anderen Planeten zusammen, ohne feste Oberfläche und mit einem
Schwerefeld, das seit 2016 die Raumsonde Juno in enger Polarumlaufbahn vermisst; schon ihre ersten
Vorbeiflüge veränderten das Bild von Schwerefeld, Atmosphäre und Magnetfeld zugleich
([Bolton et al. 2017](literatur:bolton-2017)). Dieser Text stellt
Schwerefeld und Inneres, Atmosphäre und Magnetosphäre sowie Bahn und Entstehung dar und beschreibt
zuletzt, was Orrery davon abbildet. Die vier Galileischen Monde [Io](objekt:io),
[Europa](objekt:europa), [Ganymed](objekt:ganymede) und [Kallisto](objekt:callisto) sind hier nur
Verweis; sie haben eigene Texte, ebenso [Saturn](objekt:saturn) als der andere große Gasriese.

## Kenngrößen und Messung

Radio-Bahnverfolgung der Raumsonde Juno liefert Jupiters Schwerefeld unmittelbar aus der
Dopplerverschiebung ihrer Bahn. Zehn Vorbeiflüge bis Dezember 2018 ergaben, bezogen auf den
Äquatorradius 71 492 km, $J_2 = 14696{,}5735 \cdot 10^{-6}$, $J_4 = -586{,}6085 \cdot 10^{-6}$ und
$J_6 = 34{,}2007 \cdot 10^{-6}$, mit Unsicherheiten von wenigen $10^{-9}$ (3σ;
[Durante et al. 2020](literatur:durante-2020)). Für einen rein rotierenden Fluidkörper ohne innere
Strömungen wären nur die geraden Momente von null verschieden und ungefähr proportional zu $q^n$,
mit $q = \omega^2 a^3/(GM)$ als Verhältnis von Fliehkraft zu Schwere am Äquator
([Iess et al. 2018](literatur:iess-2018)); mit $q = 0{,}0892$
([Militzer und Hubbard 2023](literatur:militzer-2023)) ergeben die Messwerte $J_2/q = 0{,}165$,
$J_4/q^2 = -0{,}074$ und $J_6/q^3 = 0{,}048$. Juno fand daneben eine Nord-Süd-Asymmetrie des Feldes,
die Signatur innerer Strömungen: $J_3 = (-0{,}0450 \pm 0{,}0033) \cdot 10^{-6}$ (3σ;
[Durante et al. 2020](literatur:durante-2020)). Aus den ungeraden Momenten folgt, dass die
Jetströme der Wolkenoberfläche rund 3000 km tief reichen, bei [Saturn](objekt:saturn) rund 9000 km
([Militzer und Hubbard 2023](literatur:militzer-2023)) – ein Ergebnis, das eine eigene
Schwerefeldarbeit unter dem Titel „Jupiters Jetströme reichen tausende Kilometer tief" bestätigt
([Kaspi et al. 2018](literatur:kaspi-2018)). Unterhalb dieser Tiefe rotiert das Innere nach
begleitenden Modellrechnungen im Wesentlichen starr
([Guillot et al. 2018](literatur:guillot-2018)).

Jupiters Trägheitsmomentfaktor ist nicht direkt gemessen: Modelle, die alle Momente bis $J_{10}$
treffen, ergeben $C/(M a^2) = 0{,}26393 \pm 0{,}00001$
([Militzer und Hubbard 2023](literatur:militzer-2023)); mehr zu Definition und Grenzen dieser
Größe steht unter [Trägheitsmomentfaktor](thema:innerer-aufbau). Die folgende Tabelle fasst die
wichtigsten Kenngrößen zusammen.

| Größe | Wert | Unsicherheit | Bestimmung | Beleg |
|---|---|---|---|---|
| Masse | $1{,}89813 \cdot 10^{27}\,\mathrm{kg}$ | – | Bahnverfolgung (Juno) | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| $GM$ | $126687\,\mathrm{km^3\,s^{-2}}$ | – | Bahnverfolgung | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| Äquatorradius (1 bar) | $71492\,\mathrm{km}$ | – | Radiookkultation, Grenzdruck 1 bar | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| Polradius (1 bar) | $66854\,\mathrm{km}$ | – | Radiookkultation | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| Volumenmittelradius | $69911\,\mathrm{km}$ | – | aus Äquator- und Polradius | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| Abplattung | $0{,}06487$ | – | (Äquator- minus Polradius)/Äquatorradius | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| $J_2$ | $14696{,}5735 \cdot 10^{-6}$ | wenige $10^{-9}$ | Juno-Bahnverfolgung, 10 Durchgänge | [Durante et al. 2020](literatur:durante-2020) |
| $J_4$ | $-586{,}6085 \cdot 10^{-6}$ | wenige $10^{-9}$ | Juno-Bahnverfolgung | [Durante et al. 2020](literatur:durante-2020) |
| $J_6$ | $34{,}2007 \cdot 10^{-6}$ | wenige $10^{-9}$ | Juno-Bahnverfolgung | [Durante et al. 2020](literatur:durante-2020) |
| $J_3$ (ungerade, Windsignatur) | $-0{,}0450 \cdot 10^{-6}$ | $0{,}0033 \cdot 10^{-6}$ (3σ) | Juno-Bahnverfolgung | [Durante et al. 2020](literatur:durante-2020) |
| $C/(M a^2)$ | $0{,}26393$ | $0{,}00001$ | Innenmodelle, angepasst an $J_2$ bis $J_{10}$ | [Militzer und Hubbard 2023](literatur:militzer-2023) |
| Bond-Albedo | $0{,}503$ | $0{,}012$ | Cassini-Radiometrie, volle Phasenwinkel-/Wellenlängenabdeckung | [Li et al. 2018](literatur:li-2018) |
| Geometrische Albedo | $0{,}538$ | – | photometrisch (V-Band) | [Mallama et al. 2017](literatur:mallama-2017) |

Mit Masse und Volumenmittelradius folgt eine mittlere Dichte von nur $1326\,\mathrm{kg\,m^{-3}}$
([NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter)) – ein früher Hinweis darauf, dass Jupiter
überwiegend aus Wasserstoff und Helium besteht statt aus Gestein oder Eis (siehe „Inneres").

## Inneres

Vor Juno sprachen Modelle für einen kompakten Kern aus Gestein und Eis von einigen Erdmassen unter
einer Hülle aus metallischem, darüber molekularem Wasserstoff. Die ersten Juno-Schweredaten
passten dagegen deutlich besser zu einem „verdünnten" Kern, dessen schwere Elemente über einen
großen Teil des Radius statt in einem scharf begrenzten Zentrum verteilt sind, mit 7 bis
25 Erdmassen an schweren Elementen insgesamt
([Wahl et al. 2017](literatur:wahl-2017)). Neuere Zustandsgleichungen aus Ab-initio-Rechnungen
treffen alle gemessenen Momente mit einem verdünnten Kern bis 63 % des Radius, in dem schwere
Elemente nur 18 % der Masse ausmachen ([Militzer et al. 2022](literatur:militzer-2022)). Wie weit
der Kern reicht, hängt aber empfindlich an der gewählten Wasserstoff-Helium-Zustandsgleichung:
Mit veränderten Annahmen ergeben sich auch kleine verdünnte Kerne, die nur rund 20 % der Masse
umfassen und besser zu Entstehungsmodellen passen, allerdings eine höhere innere Entropie
verlangen, als man aus den Messungen der Galileo-Atmosphärensonde gewöhnlich annimmt
([Howard et al. 2023](literatur:howard-2023); mehr unter [Innerer Aufbau](thema:innerer-aufbau)).

Zwischen rund 0,8 und 1 Jupiterradius geht molekularer in metallischen, elektrisch leitenden
Wasserstoff über; diese Schicht treibt den selbst erzeugten Dynamo, dessen äußerer Rand nach dem
aktuellen Magnetfeldmodell bei $0{,}81\,R_\mathrm{J}$ liegt
([Connerney et al. 2022](literatur:connerney-2022)). In dieser Tiefe kondensiert Helium tropfenweise
aus dem umgebenden Wasserstoff aus und regnet nach innen ab, sobald die Temperatur unter die
Mischbarkeitsgrenze beider Stoffe fällt – ein Vorgang, der die in der Atmosphäre gemessene
Heliumverarmung erklären soll. Ein aktuelles Modell mit einer stabil geschichteten, die
Durchmischung bremsenden Zone bei $0{,}975$ bis $0{,}99\,R_\mathrm{J}$ kombiniert genau diesen
Heliumregen mit einem nach außen hin invertierten Heliumgradienten und kommt danach mit einem auf
$0{,}4$ bis $0{,}5\,R_\mathrm{J}$ ($0{,}2$ bis $0{,}3$ Jupitermassen) verkleinerten verdünnten Kern
aus ([Nettelmann und Fortney 2025](literatur:nettelmann-2025)). Welche dieser Zustandsgleichungen
und Mischungsmodelle zutrifft, ist eine offene Streitfrage der Riesenplanetenphysik (siehe unten;
Übersicht bei [Helled et al. 2022](literatur:helled-2022)).

Auch der Wärmehaushalt verrät das Innere: Jupiter strahlt insgesamt mehr Energie ab, als er von der
Sonne empfängt, ein Überschuss aus der Kontraktion seit der Entstehung (Kelvin-Helmholtz-Mechanismus,
siehe „Entstehung und Entwicklung"). Cassini-Radiometrie ergab dafür eine Bond-Albedo von
$0{,}503 \pm 0{,}012$ statt der älteren, aus Voyager-Daten und einem angenommenen Pioneer-
Phasenintegral gewonnenen $0{,}343$ ([Li et al. 2018](literatur:li-2018);
[Hanel et al. 1981](literatur:hanel-1981)); die höhere Albedo bedeutet, dass Jupiter deutlich
weniger Sonnenlicht absorbiert als bislang angenommen, die absorbierte Leistung sinkt dadurch um
24 % ([Albedo und Helligkeit](thema:photometrie)) – ein noch größerer Anteil der abgestrahlten
Energie muss also aus dem Inneren selbst stammen, als ältere Bilanzen zeigten. Weil das Schwerefeld
vor allem auf die äußeren Schichten reagiert, legt es tiefe Kerne bei allen Riesenplaneten ohnehin
nur lose fest ([Mankovich und Fuller 2021](literatur:mankovich-2021)).

## Atmosphäre und Magnetosphäre

Jupiters Atmosphäre besteht überwiegend aus molekularem Wasserstoff und Helium. Ihre
Wasserhäufigkeit blieb nach der ungewöhnlich trockenen Messung der Galileo-Atmosphärensonde 1995
lange rätselhaft; Junos Mikrowellenradiometer ergab 2020 für die Äquatorzone (0 bis 4° nördlicher
Breite, Drucktiefen von rund 0,7 bis 30 bar) eine Wasserhäufigkeit von
$2{,}5^{+2{,}2}_{-1{,}6} \cdot 10^3\,\mathrm{ppm}$, das $2{,}7^{+2{,}4}_{-1{,}7}$-Fache des
protosolaren Sauerstoffverhältnisses – deutlich mehr als die Galileo-Sonde maß, aber es bleibt
offen, ob dieser Wert für den ganzen Planeten gilt
([Li et al. 2020](literatur:li-2020)). Die sichtbaren hellen Zonen und dunklen Bänder markieren
auf- beziehungsweise absteigende Strömung; ihre zonalen Winde reichen, wie oben hergeleitet, rund
3000 km tief. Der Große Rote Fleck, ein antizyklonaler Wirbelsturm mit Wurzeln bis in etwa
320 km Tiefe, schrumpft seit mindestens den 1930er-Jahren kontinuierlich: Zwischen 1995 und 2017
nahm seine Länge um rund $0{,}194^\circ$ und seine Breite um rund $0{,}048^\circ$ je Jahr ab, seine
Westwärtsdrift gegenüber System III beschleunigte sich im selben Zeitraum von rund
$0{,}026^\circ$ auf rund $0{,}36^\circ$ je Tag, und seit 2014 verändern sich Farbe und innere
Zirkulation merklich ([Simon et al. 2018](literatur:simon-2018)).

An beiden Polen ordnen sich weitere, erst durch Juno entdeckte Wirbelstürme in einem stabilen
Muster um einen zentralen Zyklon, am Südpol in anderer Zahl als am Nordpol
([Adriani et al. 2018](literatur:adriani-2018)): Am Nordpol etwa acht um den zentralen, mit
Durchmessern bis rund 4000 km ([Juno-Mission (NASA)](quelle:nasa-juno)). Junos Mikrowellenradiometer registrierte
außerdem Blitzentladungen bei 600 MHz überwiegend nahe den Polen, anders als das aus optischen
Voyager- und Galileo-Aufnahmen abgeleitete Bild einer auf mittlere Breiten konzentrierten
Gewittertätigkeit ([Brown et al. 2018](literatur:brown-2018)).

Das Magnetfeld entsteht im metallischen Wasserstoff und ist das stärkste aller Planeten. Das
aktuelle Modell JRM33 aus 32 Polumläufen zeigt neben dem globalen Dipol einen „Großen Blauen
Fleck", einen isolierten, intensiven Fleck magnetischen Flusses nahe dem Äquator, der von tiefen
Zonalwinden mit rund 3500 km Reichweite und rund $0{,}04\,\mathrm{m\,s^{-1}}$ Geschwindigkeit
ostwärts verfrachtet wird ([Connerney et al. 2022](literatur:connerney-2022)); nach der laufenden
Drift sollte er den Planeten binnen etwa 350 Jahren einmal umrunden
([Juno-Mission (NASA)](quelle:nasa-juno)). Io speist mit seinem vulkanisch ausgestoßenen
Schwefel- und Sauerstoffplasma einen Ionentorus entlang seiner Bahn, dessen Ströme unter anderem
Polarlicht-Fußabdrücke aller vier Galileischen Monde erzeugen; zuletzt wies Juno 2023 auch den
lange gesuchten Fußabdruck von Kallisto nach ([Jupiter bei NASA Science](quelle:nasa-jupiter)).

## Bahn, Rotation und Dynamik

Jupiter umläuft die Sonne in 5,2 AE mittlerem Abstand in 4332,589 Tagen, knapp zwölf Jahren, auf
einer nur mäßig exzentrischen Bahn ([Bahnelemente](thema:bahnelemente)). Weil der Gasriese keine
feste Oberfläche hat, unterschied die Beobachtung traditionell drei Rotationssysteme: System I für
die schneller laufende Äquatorregion, System II für die übrigen, wolkenabhängig unterschiedlich
schnellen Breiten, und System III, gebunden an die Rotation des Magnetfelds und damit an das
Innere selbst. Nach seiner Neubestimmung aus jahrzehntelangen Radiobeobachtungen bildet System III
seither die Grundlage der amtlichen IAU-Kartierung
([Higgins et al. 1997](literatur:higgins-1997); [Archinal et al. 2018](literatur:archinal-2018)).
Mit rund 9 h 55 min ist Jupiter der am schnellsten rotierende Planet; Einzelheiten des
Modellwerts stehen unter „Im Modell".

Jupiters Achse ist nur um $3{,}13^\circ$ gegen seine Bahn geneigt
([NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter)), Jahreszeiten fallen deshalb kaum ins Gewicht.
Diese geringe Schiefe hält auch die klassische Laplace-Fläche der Monde, auf der sich Äquatorwulst
und solares Gezeitenfeld im Mittel aufheben, bei jedem Bahnradius stabil – anders als bei einem
hypothetischen Planeten mit mehr als $68{,}875^\circ$ Achsneigung
([Tremaine et al. 2009](literatur:tremaine-2009)); nahe an Jupiter fällt sie mit dessen Äquator
zusammen, weit draußen mit seiner Bahnebene um die Sonne
([Laplace-Ebene der Monde](thema:bezugssysteme)). Die vier Galileischen Monde laufen nahe dieser
Fläche und stehen in einer Kette von Bahnresonanzen, der Laplace-Resonanz von
[Io](objekt:io), [Europa](objekt:europa) und [Ganymed](objekt:ganymede); weiter draußen, in 60°
Abstand vor und hinter Jupiter auf seiner eigenen Bahn, halten die Lagrangepunkte $L_4$ und $L_5$
mehrere zehntausend Jupiter-Trojaner gefangen ([Bahnresonanzen](thema:resonanzen)).

## Entstehung und Entwicklung

Wie Jupiter aus dem protoplanetaren Sonnennebel entstand, ist nicht abschließend geklärt. Im
Modell der Kernakkretion sammelt zunächst ein Kern aus Eis und Gestein Planetesimale ein, bis seine
Masse ausreicht, um in einer sich selbst verstärkenden zweiten Phase große Mengen Gas
einzufangen; für Jupiter braucht dieses Modell eine Planetesimal-Flächendichte von etwa dem Drei-
bis Vierfachen einer minimalen solaren Nebelscheibe und liefert dann Bildungszeiten von 1 bis 10
Millionen Jahren ([Pollack et al. 1996](literatur:pollack-1996)). Als schnellere Alternative
schlug Boss vor, dass eine hinreichend massereiche, kühle Gasscheibe direkt durch eigene
Schwerkraft in einzelne, jupitermassereiche Klumpen zerfällt, ohne den Umweg über einen zuvor
gewachsenen Kern ([Boss 1997](literatur:boss-1997); mehr unter
[Entstehung](thema:entstehung)).

Meteoritische Chronologie legt nahe, dass Jupiters Kern ungewöhnlich schnell wuchs: Aus der
Trennung zweier bis heute unvermischt gebliebener Isotopenreservoire folgt, dass er in weniger als
einer Million Jahre nach den ältesten Kalzium-Aluminium-reichen Einschlüssen bereits rund 20
Erdmassen erreicht und bis mindestens 3 bis 4 Millionen Jahre danach auf rund 50 Erdmassen
zugelegt haben muss ([Kruijer et al. 2017](literatur:kruijer-2017)); ob Jupiter damit wirklich die
Materialbarriere zwischen den beiden Reservoiren war, ist offen. Nach der Gasakkretion wanderte
Jupiter nach dem „Grand-Tack"-Modell zunächst bis auf 1,5 AE einwärts und kehrte dann gemeinsam mit
[Saturn](objekt:saturn) wieder nach außen um, wodurch die Planetesimalscheibe der terrestrischen
Planeten auf 1 AE beschnitten wurde ([Walsh et al. 2011](literatur:walsh-2011)). Seit der
vollständigen Gasakkretion kühlt und kontrahiert Jupiter langsam weiter; der dabei freigesetzte
Kelvin-Helmholtz-Wärmefluss ist, wie oben gezeigt, größer, als ältere Strahlungsbilanzen
nahelegten.

## Offene Fragen

- **Ausdehnung und Zusammensetzung des verdünnten Kerns:** Modelle mit unterschiedlichen
  Wasserstoff-Helium-Zustandsgleichungen reichen von einem bis 63 % des Radius ausgedehnten Kern
  mit 18 % Massenanteil schwerer Elemente ([Militzer et al. 2022](literatur:militzer-2022)) über
  kleinere, rund 20 % der Masse umfassende Kerne mit höherer verlangter Entropie
  ([Howard et al. 2023](literatur:howard-2023)) bis zu einem auf $0{,}4$–$0{,}5\,R_\mathrm{J}$
  begrenzten Kern unter einer stabilisierenden, den Heliumregen invertierenden Schicht
  ([Nettelmann und Fortney 2025](literatur:nettelmann-2025)); welche Zustandsgleichung zutrifft,
  ist ungeklärt.
- **Globale Wasserhäufigkeit:** Junos Messung gilt nur für die Äquatorzone und widerspricht der
  ungewöhnlich trockenen Messung der Galileo-Sonde von 1995; ob sie für den ganzen Planeten
  repräsentativ ist, ist offen ([Li et al. 2020](literatur:li-2020)).
- **Ursache der Schrumpfung des Roten Flecks:** Dass der Fleck schrumpft und seine Westwärtsdrift
  sich beschleunigt, ist über Jahrzehnte gut belegt; ob dahinter ein allmählicher Verlust an
  Wirbelenergie, eine Änderung der großräumigen Zirkulation oder beides zugleich steht, ist mit den
  seit 2014 beobachteten Farb- und Zirkulationsänderungen noch nicht entschieden
  ([Simon et al. 2018](literatur:simon-2018)).
- **Kernakkretion oder Scheibeninstabilität:** Kernakkretion erklärt die für Jupiter nötige
  Anreicherung schwerer Elemente zwanglos, aber nur mit einer gegenüber der minimalen Nebelscheibe
  deutlich erhöhten Flächendichte ([Pollack et al. 1996](literatur:pollack-1996)); Scheibeninstabilität
  bildet Riesenplaneten dagegen fast augenblicklich aus dem Kollaps einer massereichen Gasscheibe,
  ohne dass die Kernakkretion Zeit hätte ([Boss 1997](literatur:boss-1997)) – welcher Weg bei
  Jupiter zum Zuge kam, ist nicht entschieden.

## Im Modell

- **Bahn:** Die Elemente stammen aus der JPL-Näherungstafel 1800 bis 2050, linear fortgeschrieben
  gegen die feste Ekliptik J2000 ([Bahnelemente](thema:bahnelemente)). Die aus Katalogmasse und
  großer Halbachse nach dem dritten Keplerschen Gesetz gerechnete Umlaufzeit ergibt 4332,594 Tage,
  rund 7 Minuten mehr als der Faktenblattwert 4332,589 Tage.
- **Form:** Wie alle Körper ist Jupiter im Modell eine Kugel mit dem mittleren Radius; `radiusKm`
  steht auf 69 911 km, dem NSSDC-Volumenmittel, nicht auf dem Äquatorradius 71 492 km. Die Kugel
  liegt damit am Äquator 1581 km (2,2 %) unter und an den Polen 3057 km (4,6 %) über der
  tatsächlichen 1-bar-Fläche (Abplattung 0,06487); `render/bodies.ts` skaliert jede Kugel nur mit
  einem einzigen Faktor, die sichtbare Abplattung fehlt also ganz, obwohl sie bei Jupiters rascher
  Rotation mit bloßem Auge auffällt (dieselbe Vereinfachung wie bei Saturn, siehe
  [Innerer Aufbau](thema:innerer-aufbau)). Ebenso fehlt Jupiters reales, schwaches Ringsystem
  vollständig: `jupiter.ts` führt kein `appearance.rings`, obwohl das Faktenblatt unter
  „Planetary ring system" ein Ja verzeichnet
  ([NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter)).
- **Rotation:** `rotationPeriodH` steht auf 9,9250 h und trifft damit das NSSDC-Faktenblatt exakt.
  Aus der amtlichen IAU-Rotationsrate für System III ($870{,}5360000^\circ$ je Tag,
  [Archinal et al. 2018](literatur:archinal-2018), aufbauend auf der Neubestimmung von
  [Higgins et al. 1997](literatur:higgins-1997)) folgt dagegen eine Periode von 9,924920 h – der
  Datensatz ist um 0,29 s länger. Die Textur dreht sich als Ganzes starr mit dieser einen Periode;
  weder die unterschiedlich schnellen Rotationssysteme I und II noch einzelne Jetströme sind
  abgebildet. Bei der aktuellen Westwärtsdrift des Großen Roten Flecks von rund $0{,}36^\circ$ je
  Tag gegen System III ([Simon et al. 2018](literatur:simon-2018)) liefe der reale Fleck der im
  Modell fest auf der Textur stehenden Markierung binnen eines Jahres um rund $130^\circ$ davon –
  ein Effekt, den die Simulation nicht abbildet, weil sie den Fleck gar nicht gesondert zeichnet.
- **Pol und Achsneigung:** Der hinterlegte Pol (268,057°/64,495°) trifft den IAU-Bericht 2015
  (268,056595°/64,495303°, [Archinal et al. 2018](literatur:archinal-2018)) auf drei
  Nachkommastellen. Die Nachrechnung mit `achsneigungDeg` ergibt $3{,}1200^\circ$ gegen die
  im Datensatz hinterlegte Bahnnormale – der Kommentar in `jupiter.ts` (3,12°) beschreibt den
  Ist-Zustand also zutreffend; das Faktenblatt nennt, gegen eine hochgenaue statt der hier
  verwendeten Näherungsephemeride, $3{,}13^\circ$
  ([NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter)), derselbe methodische Unterschied wie bei
  [Mars](objekt:mars). `rotationAtEpochDeg` steht auf 0; der IAU-Bericht nennt für die
  Rotationsphase bei J2000,0 $W_0 = 284{,}95^\circ$ – Jupiters Kartennullmeridian im Modell liegt
  deshalb nicht dort, wo der Bericht ihn setzt, was nur die Kartenausrichtung betrifft.
- **Albedo:** Der Katalogwert 0,538 ist die geometrische Albedo und stimmt mit dem NSSDC-Faktenblatt
  und mit [Mallama et al. 2017](literatur:mallama-2017) überein, wie in
  [Albedo und Helligkeit](thema:photometrie) für alle Planeten belegt.
- **Monde und Schatten:** Der Datensatz führt nur die vier Galileischen Monde, nicht die weiteren
  rund 90 bekannten kleinen Jupitermonde. Weil `MAX_OKKLUDER` in `render/shadows.ts` ebenfalls 4
  ist, wählt `waehleOkkluder` für Jupiter alle vier als Kugel-Okkluder (nach dargestelltem
  Winkelradius geordnet: Io, Ganymed, Europa, Kallisto) – jeder der vier kann also Schatten auf
  Jupiter werfen, und jeder Mond wird umgekehrt von Jupiter und allen drei übrigen Monden
  beschattet. Bei Jupiters $3{,}13^\circ$ Achsneigung wirft Io wegen seiner Nähe immer einen
  Schatten, Kallisto zeitweise gar nicht (9,5° gegen 2,1° zulässige Sonnenhöhe über der
  Bahnebene); von Jupiter aus hat die Sonne nur $0{,}051^\circ$ Winkelradius, deutlich weniger als
  die Winkelradien der vier Monde selbst, sodass ihre Schatten als scharfe schwarze Flecken
  erscheinen ([Finsternisse](thema:finsternis)). Wie bei Jupiters eigenem Schatten auf Saturn trägt
  auch dieser keine Kernschattenfarbe. Die Mondbahnen sind auf Jupiters Äquatorebene bezogen
  (`frame: 'parentEquator'`, Pol aus diesem Datensatz) statt auf die eigentliche Laplace-Ebene
  jedes einzelnen Mondes; die dabei entstehende Abweichung ist bei den drei inneren Monden mit
  0,02° klein, bei Kallisto mit 0,4° am größten (siehe Kommentar in `jupiter-monde.ts`).
- Maßstab: `sizeScale` vergrößert Jupiter wie jeden Körper gleich; `sunDamping` betrifft nur die
  Sonne. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
