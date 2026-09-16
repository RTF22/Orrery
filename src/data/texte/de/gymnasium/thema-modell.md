# Grenzen des Modells

Die Simulation rechnet die Bahnen nach den Keplerschen Gesetzen: Jeder Körper bewegt
sich auf einer Ellipse um seinen Mutterkörper, beschrieben durch sechs
[Bahnelemente](thema:bahnelemente), die sich langsam mit der Zeit ändern. Diese
Näherung ist bewusst gewählt und hat bekannte Grenzen.

- **Keine Bahnstörungen:** In Wirklichkeit ziehen die Planeten aneinander; hier zieht
  nur die Sonne. Die Elemente enthalten die mittlere Wirkung der Störungen als
  lineare Raten, nicht die kurzperiodischen Schwankungen.
- **Sonne im Ursprung:** Die Simulation setzt die Sonne fest in den Ursprung. In
  Wirklichkeit umlaufen Sonne und Planeten den gemeinsamen Schwerpunkt, den vor allem
  Jupiter bis knapp außerhalb der Sonnenoberfläche verschiebt. Die Planetenbahnen sind
  heliozentrisch gerechnet.
- **Genauigkeitsfenster 1800 bis 2050:** Nur in diesem Zeitraum sind die verwendeten
  Elemente belastbar. Außerhalb wächst der Fehler, der Datenblock warnt dann.
- **Keine Präzession, keine Nutation:** Die Rotationsachsen stehen fest im Raum. Die
  Erdachse wandert in Wirklichkeit in rund 26 000 Jahren einmal um den Ekliptikpol.
- **Nicht gemessene Achsen:** Für [Eris](objekt:eris) und [Makemake](objekt:makemake)
  ist die Richtung der Drehachse unbekannt; die Simulation stellt sie senkrecht auf die
  Bahn, der Datenblock zeigt dann 0° Achsneigung. Die Pole von [Triton](objekt:triton)
  und [Miranda](objekt:miranda) sind ohne ihre periodischen Schwankungen hinterlegt,
  ihre Achsneigungen im Datenblock sind deshalb nicht belastbar. Der Pol von
  [Haumea](objekt:haumea) ist nur aus Lichtkurven erschlossen und mehrdeutig; die
  Simulation übernimmt eine von zwei Lösungen.
- **Monde auf vereinfachter Ebene:** Viele Mondbahnen beziehen sich auf die
  Äquatorebene ihres Planeten (bei nahen Monden praktisch die Laplace-Ebene), nicht auf
  die genaue Bewegung ihrer Bahnpole.
- **Ruhende Mutterkörper:** Monde umlaufen hier den Mittelpunkt ihres Planeten oder
  Zwergplaneten, der selbst nicht um den gemeinsamen Schwerpunkt pendelt. Meist liegt
  dieser Punkt im Inneren des größeren Körpers. Bei [Pluto](objekt:pluto) und
  [Charon](objekt:charon) liegt er rund 900 km über Plutos Oberfläche; Pluto müsste
  deshalb alle 6,4 Tage einen Kreis von rund 2 100 km Radius ziehen, den die Simulation
  weglässt.
- **Erde als Schwerpunkt:** Die Tabelle liefert den Erde-Mond-Schwerpunkt; die
  Abweichung zum Erdmittelpunkt liegt unter 4 700 km.

Quellen: [JPL Approximate Positions](quelle:jpl-approx-pos) für die Bahnelemente,
[NSSDC Fact Sheets](quelle:nssdc-factsheets) für die Kennzahlen,
[IAU-Bericht](quelle:iau-rotation) für die Rotationsachsen.
