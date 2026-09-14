# Grenzen des Modells

Die Simulation rechnet die Bahnen nach den Keplerschen Gesetzen: Jeder Körper bewegt
sich auf einer Ellipse um seinen Mutterkörper, beschrieben durch sechs
[Bahnelemente](thema:bahnelemente), die sich langsam mit der Zeit ändern. Diese
Näherung ist bewusst gewählt und hat bekannte Grenzen.

- **Keine Bahnstörungen:** In Wirklichkeit ziehen die Planeten aneinander; hier zieht
  nur die Sonne. Die Elemente enthalten die mittlere Wirkung der Störungen als
  lineare Raten, nicht die kurzperiodischen Schwankungen.
- **Genauigkeitsfenster 1800 bis 2050:** Nur in diesem Zeitraum sind die verwendeten
  Elemente belastbar. Außerhalb wächst der Fehler, der Datenblock warnt dann.
- **Keine Präzession, keine Nutation:** Die Rotationsachsen stehen fest im Raum. Die
  Erdachse wandert in Wirklichkeit in rund 26 000 Jahren einmal um den Ekliptikpol.
- **Monde auf vereinfachter Ebene:** Viele Mondbahnen beziehen sich auf die
  Äquatorebene ihres Planeten (Laplace-Ebene), nicht auf die genaue Bewegung ihrer
  Bahnpole.
- **Erde als Schwerpunkt:** Die Tabelle liefert den Erde-Mond-Schwerpunkt; die
  Abweichung zum Erdmittelpunkt liegt unter 4 700 km.

Quellen: [JPL Approximate Positions](quelle:jpl-approx-pos) für die Bahnelemente,
[NSSDC Fact Sheets](quelle:nssdc-factsheets) für die Kennzahlen,
[IAU-Bericht](quelle:iau-rotation) für die Rotationsachsen.
