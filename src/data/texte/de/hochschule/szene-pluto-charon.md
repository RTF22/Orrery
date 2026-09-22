# Szene: Pluto und Charon im Doppel

Die Kamera umkreist [Pluto](objekt:pluto) in großem Abstand, während [Charon](objekt:charon) auf
seiner Bahn sichtbar bleibt: Bahntyp `orbit`, Zielkörper `pluto`, Basisabstand 55 Plutoradien mit
Streufaktor 0,8 bis 1,5, Elevation 10° bis 30°, Azimut 50,5° bis 90,5° bei 1,5°/s Drift, Dauer 45 s,
Zeitraffer 0,3 Tage je Sekunde (`src/data/scenes.ts`). Beide Körper bilden das bekannteste doppelt
gebundene Paar des Sonnensystems und zeigen einander dauerhaft dieselbe Seite
([Gebundene Rotation](thema:gebundene-rotation)); am 14. Juli 2015 flog New Horizons als bislang
einzige Sonde an beiden vorbei ([Stern et al. 2015](literatur:stern-2015)).

## Was das Bild zeigt

Bei Streufaktor 0,8/1/1,5 steht die Kamera $52\,285$/$65\,357$/$98\,035\,\mathrm{km}$ von Pluto
entfernt (44/55/82,5 Plutoradien, $R_\mathrm{Pluto} = 1188{,}3\,\mathrm{km}$; Herleitung). Charons
Bahnradius von $19\,596\,\mathrm{km}$ entspricht dabei $16{,}49$ Plutoradien; sein Winkelabstand von
der Bildmitte reicht von $20{,}55^\circ$ bei Streufaktor 0,8 bis $11{,}30^\circ$ bei 1,5 (Herleitung)
— gegen das halbe Sichtfeld der Kamera von $25^\circ$ (Kamera-Sichtfeld $50^\circ$,
`render/renderer.ts`) bleibt die ganze Bahn in jeder Ziehung sicher im Bild, am knappsten bei
Streufaktor 0,8, wo die halbe Bildhöhe rund $24\,400\,\mathrm{km}$ beträgt. In den 45 Sekunden
vergehen bei 0,3 Tagen je Sekunde $13{,}5$ simulierte Tage — rund $2{,}11$ Umläufe Charons
(Umlaufzeit $6{,}387\,\mathrm{d}$, Herleitung); die Kamera selbst driftet davon unabhängig um
$67{,}5^\circ$ weiter ($1{,}5^\circ/\mathrm{s} \times 45\,\mathrm{s}$). Weil beide Körper mit genau
dieser Umlaufzeit rotieren (Rotationsperiode $153{,}29335\,\mathrm{h}$), bleibt während des ganzen
Durchlaufs stets dieselbe Kartenregion jedes Körpers dem anderen zugewandt — sichtbar daran, dass
sich die New-Horizons-Mosaike auf Pluto und Charon im Bild synchron mitdrehen, ohne dass der Kamera
je eine unbekannte Seite zugewandt wäre.

Die Kamera blickt annähernd aus der Sonnenrichtung: Aus Plutos eigenen Bahnelementen ergibt eine
eigene Nachrechnung mit `positionAt` zu J2000 einen heliozentrischen Ort von $30{,}20\,\mathrm{AU}$
und eine Richtung Pluto→Sonne bei Azimut $70{,}495^\circ$ und Elevation $-11{,}17^\circ$ — nahe am
Basisazimut der Szene von $70{,}5^\circ$. Charons eigener Versatz von $19\,596\,\mathrm{km}$ ergibt
dabei nur eine Parallaxe von rund $0{,}00025^\circ$ zur Sonne, geometrisch bedeutungslos
(Herleitung). Bei Elevation 10° bis 30° und bis zu 20° Azimutabweichung von dieser Basisrichtung
liegt der Phasenwinkel zwischen rund $21^\circ$ und $41^\circ$, mit voller Azimutstreuung bis rund
$45^\circ$ (Herleitung) — beide Körper erscheinen als deutlich beleuchtete, leicht angeschnittene
Scheiben, nie als Sichel.

Ob Charon einen Schatten auf Pluto wirft oder umgekehrt, prüft das Modell in jedem Bild neu
(`waehleOkkluder`, `render/shadows.ts`): Für Pluto ist Charon der einzige mögliche Schattenwerfer,
für Charon nur Pluto (`MAX_OKKLUDER = 4` bleibt hier ungenutzt). Ein Treffer verlangt aber, dass die
Sonne nahe der Ebene steht, in der Charon um Pluto läuft — Plutos Äquatorebene. Eine eigene
Nachrechnung des Winkels zwischen Sonnenrichtung und dieser Ebene ergibt zu J2000 $25{,}5^\circ$ und
zum Stand dieses Textes (September 2026) bereits $60{,}0^\circ$, nahe am aus Plutos rund
$120^\circ$-Schiefe folgenden Extremwert von $60{,}4^\circ$, den das Modell um das Jahr 2030 erreicht
(Herleitung). Ein neuer Nulldurchgang, das nächste Modell-Äquinoktium mit möglichem Schattenwurf,
folgt danach erst wieder um das Jahr 2110. Zum jetzigen Zeitpunkt zeigt die Szene deshalb praktisch
nie einen Schatten des einen Körpers auf dem anderen.

## Hintergrund

Pluto und Charon sind das bekannteste doppelt gebundene Paar des Sonnensystems
([Gebundene Rotation](thema:gebundene-rotation)): Beide rotieren mit Charons Umlaufzeit, ein
Endzustand, den Gezeitenrechnungen aus einem exzentrischen Ausgangszustand nach einem Einschlag
nachvollziehen ([Cheng et al. 2014](literatur:cheng-2014)). Der gemeinsame Schwerpunkt liegt rund
$2126\,\mathrm{km}$ (das 1,79-Fache von Plutos Radius) von Plutos Mitte entfernt, außerhalb seiner
Oberfläche ([Kenngrößen von Pluto](objekt:pluto)). Charon entstand vermutlich bei einem schrägen
Einschlag eines annähernd plutogroßen Körpers — nach älterer Deutung ein zirkularisierender,
intakter Trümmerkörper ([Canup 2005](literatur:canup-2005)), nach neuerer ein kurzzeitig
verhaktes, sich wieder lösendes Paar („kiss and capture",
[Denton et al. 2025a](literatur:denton-2025a)). Charons auffällige rote Nordpolkappe, Mordor
Macula, entsteht aus Methan, das Plutos dünner Atmosphäre entweicht, sich am kalten Pol als Eis
niederschlägt und dort zu rötlichen Tholinen photolysiert wird
([Grundy et al. 2016](literatur:grundy-2016)). Von 1985 bis 1990 verdeckten und verfinsterten sich
beide Körper von der Erde aus gesehen ([Finsternisse](thema:finsternis)) — bislang die einzige
beobachtete Serie dieser Art bei diesem Paar; ein neues Fenster ist für dieses System nicht
vorhergesagt
([Proudfoot et al. 2026](literatur:proudfoot-2026)). New Horizons blieb am 14. Juli 2015 die
bislang einzige Raumsonde an beiden Körpern.

## Modellgrenzen

Pluto steht im Modell fest im Ursprung seines Systems, statt mit Charons Umlaufperiode um den
wahren Schwerpunkt zu taumeln. Bei 55 Plutoradien Kameraabstand entspräche dieser reale Taumel einem
Winkel von rund $1{,}86^\circ$ — dem 1,79-Fachen von Plutos eigenem Winkelradius aus dieser
Entfernung ($1{,}04^\circ$), weil sich beide Größen bei gleichem Kameraabstand im selben Verhältnis
in einen Winkel übersetzen wie der lineare Schwerpunktabstand zum Planetenradius (Herleitung). Im
Bild bewegt sich deshalb sichtbar nur Charon, während Pluto ruht. Die vier kleinen Monde Styx, Nix,
Kerberos und Hydra fehlen im Katalog ebenso wie jede Atmosphäre oder Dunstschicht auf Pluto. Ohne
`lookAtId` belichtet die Kamera auf Pluto selbst (`render/exposure.ts`); die wirkliche
Bestrahlungsstärke bei Plutos simuliertem Sonnenabstand von rund $35{,}6\,\mathrm{AU}$ (Stand dieses
Textes) beträgt nur rund $1/1270$ der Erdbestrahlung — das Modell gleicht das vollständig aus und
zeigt Pluto stets im selben Helligkeitsniveau wie jeden anderen Körper. Beide Pole bleiben fest, es
gibt keine fortlaufende [Gezeitenentwicklung](thema:gezeiten) mehr. Als heliozentrischer
Zwergplanet skaliert Pluto mit der Abstandskompression der Darstellung, Charon dagegen als
Satellit mit `sizeScale` wie jeder andere Mond. Weitere Vereinfachungen:
[Grenzen des Modells](thema:modell).

*Stand: September 2026*
