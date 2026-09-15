# Bahnelemente

Eine ungestörte Bahn um einen Zentralkörper ist eine Ellipse, in deren einem Brennpunkt
der Zentralkörper steht. Sechs Zahlen legen sie fest:

- **Große Halbachse a:** die Größe der Bahn; nach dem dritten Keplerschen Gesetz folgt
  daraus die Umlaufzeit.
- **Exzentrizität e:** wie stark die Ellipse gestreckt ist, von 0 für einen Kreis bis
  knapp unter 1.
- **Inklination i:** die Neigung der Bahnebene gegen eine Bezugsebene.
- **Länge des aufsteigenden Knotens Ω:** die Richtung, in der die Bahn die Bezugsebene
  von Süden nach Norden durchstößt.
- **Länge des Perihels ϖ:** die Richtung zum Perihel, dem Punkt größter Annäherung an
  den Zentralkörper.
- **Mittlere Länge L:** wo der Körper zu einem festen Zeitpunkt, der Epoche, steht.

Bezugsebene der Planeten ist die Ekliptik zur Epoche J2000, also die Ebene der Erdbahn
im Jahr 2000; die [Erde](objekt:earth) hat deshalb eine Inklination von praktisch 0°.
Viele Monde beziehen ihre Elemente auf die Äquatorebene ihres Planeten. Für die
Planeten verwendet die Simulation Elemente des JPL, die zur Epoche J2000 gelten und sich
mit linearen Raten je Jahrhundert ändern; zwischen 1800 und 2050 sind sie genau genug
für diese Darstellung ([Grenzen des Modells](thema:modell)).

Für einen Zeitpunkt rechnet die Simulation zuerst die mittlere Anomalie M = L − ϖ aus
und löst dann die Keplergleichung M = E − e · sin E mit dem Newton-Verfahren nach der
exzentrischen Anomalie E auf. Daraus folgt die Lage in der Bahnebene, die anschließend
um Perihelargument, Inklination und Knotenlänge in die Ekliptik gedreht wird. Auffällige
Werte haben etwa [Merkur](objekt:mercury) mit e ≈ 0,21 und [Pluto](objekt:pluto) mit
i ≈ 17°. Daten: [JPL Approximate Positions](quelle:jpl-approx-pos),
[Mittlere Bahnelemente der Monde](quelle:jpl-satelliten-bahnen).
