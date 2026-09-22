# Uranus

Uranus ist nach Radius der drittgrößte, nach Masse der viertgrößte Planet: Sein Volumenmittelradius
übertrifft den Neptuns um rund 3 %, seine Masse bleibt gut 15 % unter dessen Wert
([NSSDC Uranus Fact Sheet](quelle:nssdc-uranus)). Mit [Neptun](objekt:neptune) bildet er die Klasse
der Eisriesen: Unter einer Hülle aus Wasserstoff und Helium liegt ein Mantel, der überwiegend aus
Wasser, Ammoniak und Methan besteht. Einzigartig unter den Planeten ist seine Achsneigung von 97,77°
gegen die eigene Bahn – Uranus rotiert praktisch liegend –, dazu ein Magnetfeld, das weder mit der
Rotationsachse noch mit dem Planetenzentrum zusammenfällt; wie extrem verkippt das System von der Erde
aus erscheint, zeigt die Szene [Der liegende Uranus](szene:uranus-gekippt). Das Uranussystem hat bislang nur eine
Raumsonde gesehen: Voyager 2 passierte den Planeten am 24. Januar 1986 in rund 81 500 km Abstand,
zu einem Zeitpunkt, an dem seine Südhalbkugel der Sonne zugewandt war
([Stone und Miner 1986](literatur:stone-1986); [Smith et al. 1986](literatur:smith-1986)). Fast alles,
was seither über das System bekannt wurde, stammt von der Erde, von Hubble und vom JWST oder aus
Modellrechnungen; dieser Text benennt bei jedem Wert, worauf er beruht. Dieser Artikel behandelt
Kenngrößen und Inneres, Atmosphäre und Magnetosphäre sowie Bahn, Rotation, Entstehung und das
Orrery-Modell; die Ringe haben einen eigenen Text ([Ringe](thema:ringe)), ebenso die Ursachen der
Achsneigung ([Achsneigung](thema:achsneigung)) und die fünf großen Monde
[Miranda](objekt:miranda), [Ariel](objekt:ariel), [Umbriel](objekt:umbriel), [Titania](objekt:titania)
und [Oberon](objekt:oberon).

## Kenngrößen und Messung

Uranus' Schwerefeld und die Bahnen seiner Monde und Ringe wurden aus der Radio-Bahnverfolgung von
Voyager 2 zusammen mit jahrzehntelanger erdgestützter Astrometrie bestimmt
([Jacobson 2014](literatur:jacobson-2014)); eine kürzlich veröffentlichte Neuauswertung mit einem auf
1847 bis 2016 erweiterten Datenbogen, zusätzlichen Gaia-Positionen sowie Gezeiten- und
relativistischen Korrekturen verfeinert Schwerefeld und Polrichtung weiter
([Jacobson und Park 2025](literatur:jacobson-2025)).

| Größe | Wert | Unsicherheit | Bestimmung | Beleg |
|---|---|---|---|---|
| Masse | $8{,}6811 \cdot 10^{25}\,\mathrm{kg}$ | – | Bahnverfolgung, Mondbahnen | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| $GM$ (System) | $5794548{,}6\,\mathrm{km^3\,s^{-2}}$ | $1{,}5\,\mathrm{km^3\,s^{-2}}$ | Bahnverfolgung Voyager 2, Mondbahnen | [Jacobson 2014](literatur:jacobson-2014) |
| $GM$ (Uranus allein) | $5793951{,}3\,\mathrm{km^3\,s^{-2}}$ | – | wie oben, System minus Mondmassen | [Jacobson 2014](literatur:jacobson-2014) |
| Äquatorradius (1 bar) | $25559\,\mathrm{km}$ | – | Radiookkultation | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| Polradius (1 bar) | $24973\,\mathrm{km}$ | – | Radiookkultation | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| Volumenmittelradius | $25362\,\mathrm{km}$ | – | aus Äquator- und Polradius | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| Abplattung | $0{,}02293$ | – | (Äquator- minus Polradius)/Äquatorradius | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| Mittlere Dichte | $1270\,\mathrm{kg\,m^{-3}}$ | – | aus Masse und Volumen | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| $J_2$ | $3510{,}7 \cdot 10^{-6}$ | $0{,}7 \cdot 10^{-6}$ | Bahnverfolgung, Bezugsradius $25559\,\mathrm{km}$ | [Jacobson 2014](literatur:jacobson-2014) |
| $J_4$ | $-34{,}2 \cdot 10^{-6}$ | $1{,}3 \cdot 10^{-6}$ | Bahnverfolgung, Bezugsradius $25559\,\mathrm{km}$ | [Jacobson 2014](literatur:jacobson-2014) |
| Rotationsperiode (Radiomodulation) | $-17{,}24\,\mathrm{h}$ | $0{,}01\,\mathrm{h}$ | Voyager-2-Radiostrahlung | [Desch et al. 1986](literatur:desch-1986) |
| Rotationsperiode (Aurora) | $17{,}247864\,\mathrm{h}$ | $0{,}000010\,\mathrm{h}$ | Hubble-UV-Bilder der Aurorae, 2011–2022 | [Lamy et al. 2025](literatur:lamy-2025) |
| Pol | $257{,}311^\circ / -15{,}175^\circ$ | – | IAU-Bericht, im Datensatz fest | [Archinal et al. 2018](literatur:archinal-2018) |
| Geometrische Albedo (V-Band) | $0{,}488$ | – | photometrisch | [Mallama et al. 2017](literatur:mallama-2017) |
| Bond-Albedo (Bahnmittel) | $0{,}349$ | $0{,}016$ | Holistisches Atmosphärenmodell | [Irwin et al. 2025](literatur:irwin-2025) |
| Absorbierter solarer Fluss (Bahnmittel) | $0{,}604\,\mathrm{W\,m^{-2}}$ | $0{,}027\,\mathrm{W\,m^{-2}}$ | aus Bond-Albedo und Sonnenabstand | [Irwin et al. 2025](literatur:irwin-2025) |
| Abgestrahlter Fluss (Bahnmittel) | $0{,}693\,\mathrm{W\,m^{-2}}$ | $0{,}013\,\mathrm{W\,m^{-2}}$ | Infrarotphotometrie | [Irwin et al. 2025](literatur:irwin-2025) |
| Interner Wärmefluss | $0{,}078\,\mathrm{W\,m^{-2}}$ | $0{,}018\,\mathrm{W\,m^{-2}}$ | Energiebilanz über einen Umlauf | [Wang et al. 2025](literatur:wang-2025) |

Das Produkt aus $G$ und der Katalogmasse ergibt $5794026{,}6\,\mathrm{km^3\,s^{-2}}$: rund 13 ppm
über dem dynamisch bestimmten $GM$ des Planeten allein, aber rund 90 ppm unter dem $GM$ des Systems –
die Differenz von rund $600\,\mathrm{km^3\,s^{-2}}$ entspricht ungefähr der Summe der
Gravitationsparameter der fünf großen Monde. Äquator- und Polradius weichen wegen der Rotation um
$0{,}02293$ vom volumengleichen Mittel ab ([NSSDC Uranus Fact Sheet](quelle:nssdc-uranus)); der
Äquatorradius liegt damit rund 0,8 % über dem Volumenmittelradius, den der Datensatz als `radiusKm`
führt (siehe „Im Modell"). Uranus hat wie [Neptun](objekt:neptune) keine feste Oberfläche, an der sich
eine Rotationsperiode ablesen ließe; anders als bei [Saturn](objekt:saturn), wo vier unabhängige
Verfahren um bis zu 13 Minuten auseinanderliegen, existiert für Uranus bislang nur die aus dem
Magnetfeld gewonnene Periode.
Voyager bestimmte sie 1986 aus der Modulation der Radiostrahlung zu
$17{,}24 \pm 0{,}01\,\mathrm{h}$ ([Desch et al. 1986](literatur:desch-1986)); eine 2025 veröffentlichte
Auswertung von Hubble-Ultraviolettbildern der Aurorae aus den Jahren 2011 bis 2022 verfolgte stattdessen die Rotation der
Polarlichtflecken und ergab $17{,}247864 \pm 0{,}000010\,\mathrm{h}$ – rund 28 s je Umdrehung länger,
aber mit tausendfach kleinerer Unsicherheit ([Lamy et al. 2025](literatur:lamy-2025)); Einzelheiten
zum Modellwert und zur daraus folgenden Phasenabweichung stehen unter „Im Modell". Die geometrische
Albedo im V-Band ist mit den anderen Riesenplaneten vergleichbar
([Mallama et al. 2017](literatur:mallama-2017); [Albedo und Helligkeit](thema:photometrie)); die
bolometrische Bond-Albedo dagegen wurde erst 2025 aus einem Modell neu bestimmt, das erstmals
Beobachtungen vom Ultravioletten bis ins nahe Infrarot gemeinsam anpasst
([Irwin et al. 2025](literatur:irwin-2025)) und dabei höher ausfiel als der ältere, aus
Voyager-Infrarotdaten gewonnene Wert $0{,}300 \pm 0{,}049$
([Pearl et al. 1990](literatur:pearl-1990)) – mehr dazu unter „Offene Fragen".

## Inneres

Uranus zählt zu den Eisriesen: Modelle setzen unter der Wasserstoff-Helium-Hülle einen ausgedehnten
Mantel aus Wasser, Ammoniak und Methan an, der bei den dort herrschenden Drücken und Temperaturen eher
einer heißen, dichten Flüssigkeit als klassischem Eis gleicht, und darunter einen kleinen Kern aus
Gestein. Wie bei jedem Riesenplaneten liefern nur Masse, Radius, Rotation und die geraden Momente des
Schwerefelds Zwänge für solche Modelle, nicht eine direkte Messung
([Innerer Aufbau](thema:innerer-aufbau)). Ob dieser Aufbau in scharf getrennten Schichten vorliegt oder ob Zusammensetzung und Dichte
mit der Tiefe stetig ineinander übergehen, ist unentschieden: Übersichten stellen Drei-Schichten-Modelle
ausdrücklich neben Modelle mit nicht-adiabatischen, inhomogenen Übergängen
([Helled et al. 2020](literatur:helled-2020)). Eine frühe Untersuchung fand dabei Hinweise auf eine
Dichotomie zwischen den beiden sonst ähnlichen Eisriesen: Die äußere Hülle darf bei Uranus höchstens
rund 8 % schwere Elemente enthalten, bei Neptun dagegen bis zu 65 % – ein Befund, der für Uranus einen
ausgeprägteren, stärker geschichteten (nicht-adiabatischen) Aufbau nahelegt, während Neptuns höherer,
mit einem adiabatischen Modell verträglicher Wärmefluss eher zu einem homogener durchmischten Inneren
passt ([Nettelmann et al. 2013](literatur:nettelmann-2013)). Empirische Dichteprofile, die ohne feste
Schichtannahme allein an Masse, Radius, Rotation und die geraden Momente $J_2$ und $J_4$ angepasst
werden, bestätigen diese Freiheit: Schon aus den heutigen Daten folgen viele unterschiedliche, gleich
gut passende Dichteverläufe ([Neuenschwander und Helled 2022](literatur:neuenschwander-2022)). Selbst
eine deutlich genauere Schwerefeldmessung, wie sie nur eine Umlaufbahn liefern könnte, würde nach einer
Studie zu den Grenzen der Präzisionsgravimetrie die Entartung zwischen Drei-Schichten- und
Übergangsmodellen kaum auflösen, obwohl sie hochgeordnete Momente wie $J_6$ und $J_8$ erstmals
zugänglich machte
([Movshovitz und Fortney 2022](literatur:movshovitz-2022)) – ein zentrales Argument für die
Empfehlung einer eigenen Orbitermission (siehe „Entstehung und Entwicklung").

Eine mögliche Erklärung für das ungewöhnliche Magnetfeld liegt im Wasser selbst: Schockkompressions-
Experimente ergaben 2018 einen Schmelzpunkt von rund $5000\,\mathrm{K}$ bei $200\,\mathrm{GPa}$ – rund
$4000\,\mathrm{K}$ höher als bei $0{,}5\,\mathrm{Mbar}$ –, ein thermodynamisches Indiz für eine
überionische Phase, in der das Sauerstoffgitter fest bleibt, während die Wasserstoffionen frei durch
das Gitter wandern und eine hohe protonische Leitfähigkeit tragen
([Millot et al. 2018](literatur:millot-2018)); Röntgenbeugung an lasergeschockten Proben bestätigte
2019 erstmals unmittelbar die zugrundeliegende Kristallstruktur
([Millot et al. 2019](literatur:millot-2019)). Genau solche Bedingungen werden im
Mantel von Uranus und Neptun erwartet; sie liefern eine leitfähige Schicht, ohne dass der gesamte
Mantel metallisch sein müsste. Numerische Dynamomodelle zeigen, dass ein Dynamo, der auf eine dünne,
konvektierende, elektrisch leitfähige Schale um einen stabil geschichteten, nicht konvektierenden
Kernbereich beschränkt ist, Felder erzeugt, die – anders als ein reiner Dipol – stark nicht-dipolar und
nicht achsensymmetrisch ausfallen, wie sie Voyager 2 tatsächlich maß
([Stanley und Bloxham 2004](literatur:stanley-2004); siehe „Atmosphäre und Magnetosphäre"). Wie tief
diese leitfähige Schale reicht und welchen Anteil Gestein und Eis am Gesamtaufbau haben, bleibt offen
(siehe „Offene Fragen").

## Atmosphäre und Magnetosphäre

Voyager 2s Radio-Okkultationsmessung ergab für die obere Atmosphäre eine Zusammensetzung von
überwiegend molekularem Wasserstoff und Helium mit rund 2,3 % Methan
([Lindal et al. 1987](literatur:lindal-1987)). Die Methanverteilung ist dabei alles andere als
gleichförmig: Spektroskopie mit dem Hubble-Bildspektrographen zeigte eine kompakte Methanwolkenschicht
bei niedrigen Breiten und eine deutliche Methanverarmung über den Polen
([Karkoschka und Tomasko 2009](literatur:karkoschka-2009)). Methan in der oberen Atmosphäre schluckt
rotes Licht bevorzugt und gibt Uranus seine blassblaue Farbe; ein holistisches Aerosolmodell, das
Reflexionsspektren vom Ultravioletten bis ins nahe Infrarot gemeinsam anpasst, erklärt auch den
Farbunterschied zu Neptun: Über Uranus' vergleichsweise ruhiger, träger Atmosphäre baut sich mehr
Dunst auf als über der aktiveren Neptuns, wodurch Uranus heller und blasser erscheint
([Irwin et al. 2022](literatur:irwin-2022)). Dieselbe Polstruktur erklärt die jahreszeitliche
Helligkeitsänderung: Uranus erscheint heller, wenn eine methanärmere Polregion der Erde stärker
zugewandt ist ([Albedo und Helligkeit](thema:photometrie)).

Voyager 2 entdeckte 1986 ein Magnetfeld, dessen Dipolachse um rund 60° gegen die Rotationsachse
geneigt und um etwa $0{,}3$ Uranusradien aus dem Zentrum versetzt ist
([Ness et al. 1986](literatur:ness-1986)). Ein daraus abgeleitetes Kugelflächenfunktionsmodell (Q3)
verfeinerte die Neigung auf $58{,}6^\circ$, bestätigte den Versatz und ergab ein Dipolmoment von
$0{,}228\,\mathrm{G}\,R_\mathrm{U}^3$ bei einem ungewöhnlich großen Quadrupolanteil
([Connerney et al. 1987](literatur:connerney-1987)). Da die Feldgeometrie unabhängig von der
Sichtgeometrie zur Sonne ist, wirft die um 97,77° geneigte Rotationsachse selbst kombiniert mit dem
schiefen Dipol eine Magnetosphäre auf, deren Feldlinien sich bei jeder Rotation korkenzieherartig
verdrehen. Eine Neuauswertung der Voyager-2-Plasma- und Feld-Daten fand 2024, dass die
Sonnenwind-Staudichte beim Vorbeiflug rund zwanzigmal höher lag als eine Woche zuvor und die
Magnetosphäre dadurch auf einen Bruchteil ihres üblichen Volumens zusammengedrückt war, einen Zustand,
den unabhängige Sonnenwindmodelle nur in etwa 4 % der Zeit erwarten
([Jasinski et al. 2024](literatur:jasinski-2024)) – seitdem ist offen, wie stark das bisherige Bild der
Uranus-Magnetosphäre von diesem einzigen, möglicherweise untypischen Vorbeiflug geprägt ist (siehe
„Offene Fragen").

## Bahn, Rotation und Dynamik

Uranus umläuft die Sonne in rund 19,19 AE mittlerem Abstand in etwa 84,0 Jahren
([Bahnelemente](thema:bahnelemente)); seine Rotation ist retrograd, mit einer Achsneigung von 97,77°
gegen die eigene Bahn – der geometrische Winkel zwischen Pol und Bahnnormale beträgt 82,23°, und erst
die negative Rotationsperiode klappt ihn auf den vielzitierten Wert (Definition und Ursachenstreit in
[Achsneigung](thema:achsneigung); hier nur die Folge). Über einen Umlauf zeigt jeder Pol rund 42 Jahre
lang zur Sonne, dann ebenso lange in die Dunkelheit. Weil die Jahreszeitenpunkte nicht mit den Apsiden
der leicht exzentrischen Bahn zusammenfallen, sind die Zeitabstände zwischen ihnen nach Keplers zweitem
Gesetz nicht gleich lang: Die Südsommer-Sonnenwende, nahe der Voyager 2 vorbeiflog, fiel auf den
30. September 1985, die folgende Tagundnachtgleiche auf den 6./7. Dezember 2007 – gut 22 Jahre später –,
und die nächste Nordsommer-Sonnenwende auf den 11. April 2030 – noch einmal gut 22 Jahre danach, macht
zusammen rund 44,5 statt der bei gleichmäßiger Aufteilung erwarteten 42 Jahre zwischen den beiden
Sonnenwenden. Die Tagundnachtgleiche und die Nordsommer-Sonnenwende sind unabhängig veröffentlicht
bestätigt; die beiden Sonnenwenden ergeben sich außerdem als Extrema des
Winkels zwischen Bahnrichtung und Pol aus den Bahnelementen und dem Pol des Datensatzes (eigene
Rechnung, Einzelheiten unter „Im Modell") und decken sich mit unabhängig veröffentlichten Terminen.

Die fünf großen Monde Miranda, Ariel, Umbriel, Titania und Oberon laufen nahezu in Uranus' Äquatorebene
und damit prograd zu seiner (nach IAU-Konvention retrograden) Rotation; in der Ekliptik gemessen ergibt
das Inklinationen nahe 180° statt nahe 0°, dieselbe Konvention, die auch die Rotationsachse selbst
über 90° treibt. Die Einzelheiten der Knotenwanderung und die Sonderfälle bei Miranda und Ariel stehen dort ebenfalls.
Die Ringe liegen exakt in derselben stark geneigten
Äquatorebene und sind deshalb, von der Erde aus gesehen, fast ebenso stark verkippt wie die Monde
([Ringe](thema:ringe)).

## Entstehung und Entwicklung

Wie die übrigen Riesenplaneten entstand Uranus vermutlich näher an der Sonne und wanderte im
Nizza-Modell gemeinsam mit Jupiter, Saturn und Neptun nach außen, während die vier Planeten Drehimpuls
mit einer Scheibe aus übrig gebliebenen Planetesimalen austauschten; manche Varianten des Modells
verlangen dafür einen inzwischen aus dem System geworfenen fünften Eisriesen
([Entstehung](thema:entstehung)). Die Ursache seiner extremen Achsneigung – eine oder mehrere
Riesenkollisionen gegen eine allmähliche Spin-Bahn-Resonanz – ist ungeklärt und wird unter
[Achsneigung](thema:achsneigung) behandelt.

Für die Entstehung der fünf großen, nahezu koplanaren und prograden Monde konkurrieren zwei
Modellfamilien. Simulationen eines Rieseneinschlags zeigen, dass die daraus entstehende
Trümmerscheibe zunächst rund eine Größenordnung kompakter und zwei Größenordnungen massereicher ist
als das heutige System; erst wenn berücksichtigt wird, dass Wassereis bei den erreichten Temperaturen
größtenteils verdampft, kühlt und mit dem verbleibenden Dampf nach außen wandert, ergibt sich eine
Scheibe, aus der Monde in der beobachteten Zahl und Masse kondensieren können
([Ida et al. 2020](literatur:ida-2020)). Eine zweite Modellfamilie lässt die Monde stattdessen aus
Feststoffen in einer während der Gasakkretion des Planeten selbst mitentstandenen zirkumplanetaren
Scheibe koakkretieren, ähnlich dem für die großen Jupiter- und Saturnmonde angenommenen Weg, allerdings
mit einer wegen der geringeren Planetenmasse weiter innen liegenden Kondensationszone
([Szulágyi et al. 2018](literatur:szulagyi-2018)). Der Vergleich beider Wege mit den beobachteten
Massen, Bahnen und Zusammensetzungen der fünf Monde ist Gegenstand laufender Forschung. Wegen dieser
und der oben genannten offenen Fragen zum Inneren empfiehlt die Planetenforschungs-Decadal-Survey der
National Academies eine Orbiter- und Sondenmission zum Uranussystem als höchste Priorität unter den
großen NASA-Flaggschiffmissionen des kommenden Jahrzehnts
([National Academies of Sciences 2023](literatur:national-academies-2023)).

## Offene Fragen

- **Wärmefluss und Energiebilanz:** Voyager-Infrarotdaten ergaben ein Verhältnis von abgestrahlter zu
  absorbierter Leistung von $1{,}06 \pm 0{,}08$, vereinbar mit einem inneren Wärmefluss nahe null
  ([Pearl et al. 1990](literatur:pearl-1990)). Zwei unabhängige Neuauswertungen kamen 2025 zum
  gegenteiligen Schluss: Ein neues Atmosphärenmodell ergab einen abgestrahlten Fluss von
  $0{,}693 \pm 0{,}013\,\mathrm{W\,m^{-2}}$ gegen einen absorbierten von
  $0{,}604 \pm 0{,}027\,\mathrm{W\,m^{-2}}$ ([Irwin et al. 2025](literatur:irwin-2025)), eine
  Energiebilanz-Rechnung über einen vollen Umlauf einen inneren Fluss von
  $0{,}078 \pm 0{,}018\,\mathrm{W\,m^{-2}}$, nur rund 12,5 % des absorbierten Flusses und damit deutlich
  weniger als bei jedem anderen Riesenplaneten ([Wang et al. 2025](literatur:wang-2025)). Warum Uranus
  trotz eines nun gemessenen positiven Wärmeflusses so viel weniger davon zeigt als Jupiter, Saturn und
  Neptun, ist offen.
- **Innerer Aufbau:** Ob Uranus in scharf getrennten Schichten aufgebaut ist oder ob Zusammensetzung
  und Dichte stetig ineinander übergehen, lässt sich aus Masse, Radius, Rotation und den bekannten
  geraden Momenten $J_2$ und $J_4$ nicht entscheiden; mehrere, gleich gut passende Dichteprofile
  erfüllen dieselben Messgrößen ([Neuenschwander und Helled 2022](literatur:neuenschwander-2022)), und
  selbst deutlich genauere Schwerefelddaten würden die Entartung nach heutigem Stand kaum auflösen
  ([Movshovitz und Fortney 2022](literatur:movshovitz-2022)).
- **Ursache der Kippung:** Riesenkollision gegen allmähliche Spin-Bahn-Resonanz – beide Erklärungen
  haben Anhänger und offene Probleme; die Entscheidung steht unter
  [Achsneigung](thema:achsneigung) an.
- **Rotationsperiode:** Die Neubestimmung aus Hubble-Aurorabeobachtungen von 2011 bis 2022 ist tausendfach
  genauer als die alte Voyager-Radiomessung ([Lamy et al. 2025](literatur:lamy-2025)), misst aber
  wie diese die Rotation des Magnetfelds. Ob diese Periode auch die Rotation des Körpers als Ganzes
  trifft, bleibt unabhängig von der Präzisionssteigerung offen: Anders als bei Saturn, wo Schwerefeld
  und Ringseismologie ein von der Radiostrahlung unabhängiges zweites Verfahren liefern, fehlt für
  Uranus bislang eine solche zweite, mechanische Bestimmung – eines der Ziele einer künftigen
  Orbitermission ([National Academies of Sciences 2023](literatur:national-academies-2023)).
- **Untypischer Vorbeiflug:** Die einzige In-situ-Messung der Uranus-Magnetosphäre traf nach einer
  Neuauswertung einen Zustand, den der Sonnenwind nur in rund 4 % der Zeit erzeugt
  ([Jasinski et al. 2024](literatur:jasinski-2024)); wie sehr das bisherige Bild von Magnetfeld und
  Magnetosphäre dadurch verzerrt ist, lässt sich erst mit weiteren Messungen klären.

## Im Modell

- **Form:** `radiusKm` steht auf $25362\,\mathrm{km}$, dem NSSDC-Volumenmittel, nicht auf dem
  Äquatorradius $25559\,\mathrm{km}$; die Kugel liegt damit am Äquator rund 0,8 % unter der
  tatsächlichen 1-bar-Fläche (Abplattung $0{,}02293$). `render/bodies.ts` skaliert jede Kugel nur mit
  einem einzigen Faktor, die sichtbare Abplattung fehlt also ganz.
- **Rotation:** `rotationPeriodH` steht auf $-17{,}24$, der Voyager-Radiomessung
  ([Desch et al. 1986](literatur:desch-1986)); das negative Vorzeichen trägt die Rückläufigkeit. Gegen
  die 2025 bestimmte Periode $17{,}247864\,\mathrm{h}$ ([Lamy et al. 2025](literatur:lamy-2025)) ist
  das rund 28,3 s je Umdrehung zu kurz. Seit J2000 sind das (Stand September 2026, rund 26,7 Jahre)
  etwa 13 588 Umdrehungen mit der alten gegen rund 13 582 mit der neuen Periode – eine
  Kartenmarkierung, die im Modell fest auf der Textur steht, liefe gegenüber der tatsächlichen
  Rotationsphase um rund 6,2 Umdrehungen bzw. etwa 70° auseinander (eigene Rechnung).
- **Pol:** $257{,}311^\circ / -15{,}175^\circ$ ([Archinal et al. 2018](literatur:archinal-2018)) liegt
  fest im Raum; die im Bericht dokumentierte, geringe Präzession des Uranuspols bleibt unberücksichtigt
  ([Bezugssysteme und Zeitskalen](thema:bezugssysteme)).
- **Achsneigung:** `achsneigungDeg` bildet den Winkel zwischen Pol und der aus Position und
  Geschwindigkeit zur Epoche J2000 gebildeten Bahnnormale und klappt ihn bei negativer
  Rotationsperiode um 180°. Der geometrische Winkel Pol–Bahnnormale beträgt $82{,}23^\circ$; mit dem
  Klappen ergibt sich die Datenblock-Achsneigung $97{,}77^\circ$ – exakt der auch im NSSDC-Faktenblatt
  genannte Wert (eigene Nachrechnung mit den Bahnelementen aus `uranus.ts` und dem Pol des Datensatzes;
  Herleitung der Konvention dort ebenfalls).
- **Bahn und Jahreszeiten:** Die Elemente stammen aus der JPL-Näherungstafel 1800 bis 2050, linear
  fortgeschrieben gegen die feste Ekliptik J2000 ([Bahnelemente](thema:bahnelemente)); die
  Kepler-Umlaufzeit aus Katalogmasse und großer Halbachse liegt dort rund 0,05 % über $360^\circ/\dot{L}$,
  demselben dort hergeleiteten Wert. Die im Text genannten Jahreszeitentermine sind Nullstellen
  beziehungsweise Extrema des Skalarprodukts aus dem Pol (`poleVector`) und der auf Länge eins
  normierten, umgekehrten Richtung von Uranus zur Sonne (aus `positionAt`), gefunden durch Bisektion
  über die Jahre 1975 bis 2036 (eigene Rechnung); sie stimmen mit unabhängig veröffentlichten Terminen
  überein.
- **Ringe:** Der Streifen reicht von $37800$ bis $51600\,\mathrm{km}$, gerechnet aus Messwerten
  statt aus einer Bilddatei ([Ringe](thema:ringe); Texturfrage in `ASSETS.md`).
- **Schatten:** Von den fünf großen Monden werden bei einem Bewerberüberschuss die vier mit dem größten
  dargestellten Winkelradius als Kugel-Okkluder gewählt (`MAX_OKKLUDER` in `render/shadows.ts`);
  Oberon fällt dabei stets weg ([Finsternisse](thema:finsternis)).
- **Nicht abgebildet:** keine Atmosphäre, kein Magnetfeld, keine jahreszeitlichen Wolken oder
  Polkappen im Renderer; die Textur ist eine einzige, unbewegte Aufnahme von Solar System Scope
  (CC BY 4.0, `ASSETS.md`), keine Bänderstruktur wird eigens gezeichnet.
- **Datenblock:** Masse, Radius, Rotationsperiode, Pol und Albedo des Datensatzes treffen die zitierten
  Messwerte auf die angegebene Genauigkeit; Maßstab: `sizeScale` skaliert Uranus und seinen Ring
  gemeinsam (`sim/scale.ts`). Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
