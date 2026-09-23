# Szene: Von Neptun zur fernen Sonne

Die Kamera steht hinter [Neptun](objekt:neptune), auf dessen sonnenabgewandter Seite, und blickt
auf ihn zurück; die [Sonne](objekt:sun) steht daneben im Bild – die Szene zeigt Neptun als
überwiegend dunkle Scheibe mit einer schmalen, zur Sonne hin beleuchteten Sichel, während sein
eigener Stern von hier aus nur noch wie ein ferner Lichtpunkt erscheint.

## Was das Bild zeigt

Der Bahntyp `sichtlinie` (`render/camera/cinema.ts`) setzt die Kamera auf die Verbindungslinie
Neptun–Sonne, auf der von der Sonne abgewandten Seite Neptuns, und richtet den Blick fest auf
Neptun selbst: `lookAtId: 'sun'` legt hier nur die Richtung dieser Linie fest, nicht das
Blickziel der Kamera (Entwurf §4); `blickzielVon` liefert entsprechend den Standortkörper Neptun,
nicht die Sonne. Radius: 14 dargestellte Neptunradien ($R_\mathrm{N}=24\,622\,\mathrm{km}$) mal
Streufaktor; bei 0,9/1,0/1,5 sind das 310 237/344 708/517 062 km. Der Basisazimut 196° liegt 16°
jenseits der 180°, die genau die sonnenabgewandte Richtung träfen, mit ± 4° Azimut- und ± 3°
Elevationsversatz je Ziehung – die Kamera steht damit in jeder Ziehung nahe, aber nicht exakt, auf
der Nachtseite.

Der Winkelabstand zwischen Sonnen- und Neptunmitte im Bild reicht dadurch, je nach Maßstab und
Ziehung, von rund 10° bis rund 21° (Rastersuche über den ganzen gezogenen Bereich: „Realistisch"
12,0°–21,0°, „Schaubild" 11,7°–20,8°, „Kompakt" 10,2°–19,0°) – die Sonne bleibt damit in jedem
Fall innerhalb des Sichtfelds (Halbfeld 25° vertikal), aber deutlich neben Neptun. Der
Phasenwinkel Sonne–Neptun–Kamera folgt daraus zu $180^\circ-\theta$, rund 159° bis 170°; der
beleuchtete Flächenanteil $(1+\cos\alpha)/2$ einer Kugel liegt entsprechend nur bei rund 1 bis 3
Prozent – Neptun zeigt der Kamera eine schmale, sichelförmig beleuchtete Fläche zur Sonne hin und
sonst seine Nachtseite.

Der reale Sonnendurchmesser beträgt von hier aus rund 64″ (eigene Rechnung mit dem
Neptun-Sonne-Abstand 4 505 484 129 km zur Epoche J2000: 63,7″, [Sonne](objekt:sun) nennt gerundet
64″); ihr Licht braucht von dort gut vier Stunden bis Neptun (eigene Rechnung: $4\,505\,484\,129
\,\mathrm{km}/299\,792{,}458\,\mathrm{km\,s^{-1}}=4{,}17\,\mathrm{h}$). Die nominale
Sonnenkonstante von 1361 W/m² bei 1 AE ([Kopp und Lean 2011](literatur:kopp-2011) maßen am
Minimum 2008 $1360{,}8\pm0{,}5\,\mathrm{W\,m^{-2}}$) ergibt bei Neptuns Abstand von 30,12 AE nur
noch 1,50 W/m² – ein Neunhundertsiebtel der Erde (eigene Rechnung; für den 17. September 2026
nennt [Albedo und Helligkeit](thema:photometrie) das im Modell verwendete Verhältnis 1/883). Mit
der fachgeprüften Sonnenhelligkeit $m_\odot=-26{,}75$ (1 AE, V-Band) aus demselben Text folgt für
die scheinbare Helligkeit der Sonne von Neptun $m=-26{,}75+5\log_{10}(30{,}12)=-19{,}36$ – rund
440-mal heller als der Vollmond von der Erde aus (−12,74, NSSDC Moon Fact Sheet).

In den 30 s bei 0,5 Tagen je Sekunde vergehen 15 simulierte Tage: Bei $16{,}11\,\mathrm{h}$
Rotationsperiode ([Neptun](objekt:neptune)) sind das 22,3 Umdrehungen; auf seiner Bahn wandert
Neptun in dieser Zeit nur rund 0,09° weiter (Kepler-Umlaufzeit 164,9 Jahre), knapp 7,05 Millionen
km oder 0,047 AE – verschwindend gegen seinen 4,5-Milliarden-km-Bahnradius.

## Hintergrund

Neptuns Lichtbilanz hängt fast vollständig an diesem einen Neunhundertstel Sonnenlicht. Bisher hat
nur [Voyager 2](quelle:nasa-voyager-2) Neptun aus
der Nähe gesehen, am 25. August 1989. Sein Schwesterschiff Voyager 1 blickte, bereits weit
außerhalb der Planetenbahnen, am 14. Februar 1990 noch einmal zurück: Die Aufnahmesequenz des
„Familienporträts" begann ausgerechnet bei Neptun, dem lichtschwächsten Ziel, und arbeitete sich
von dort zur Sonne vor
([Erstes Familienporträt des Sonnensystems](quelle:nasa-family-portrait)).

Voyager 2 selbst flog nach der Begegnung mit Neptun weiter hinaus und überschritt am 5. November
2018, bei 119 AE, die Heliopause – die Grenze, an der der Sonnenwind dem interstellaren Medium
weicht ([Stone et al. 2019](literatur:stone-2019)). Das ist fast das Vierfache von Neptuns eigenem
Sonnenabstand: Der Einfluss der Sonne reicht weit über die Planetenbahnen hinaus, nur eben nicht
mehr als sichtbares Licht.

## Modellgrenzen

- **Sonne vergrößert:** In „Schaubild" erscheint sie 1,2° statt 64″
  ([Sonne](objekt:sun)) – rund 68-fach überhöht (eigene Rechnung).
- **Belichtung jetzt auf Neptun:** `blickzielVon` liefert bei `path: 'sichtlinie'` den
  Standortkörper, hier Neptun, statt der Sonne; `exposureTargetId` belichtet damit wie bei
  praktisch jeder anderen Szene auf den tatsächlich angesehenen Körper. Der dafür nötige
  Verstärkungsfaktor (`targetExposure`, Bezugswert 1 bei 1 AE) liegt bei rund 24 in „Realistisch"
  (Neptuns wahrem Abstand von 30,12 AE) und bei rund 11 in „Schaubild" (auf 7,7 AE komprimiert,
  $r^{0{,}6}$; eigene Rechnung) – Neptuns beleuchtete Seite landet dadurch, anders als früher,
  unabhängig vom Maßstab exakt auf dem Referenzwert (`EXPOSURE_REFERENCE=1`). Auf die im selben
  Bild sichtbare Sonne wirkt dieser Faktor nicht, weil ihr Material unbeleuchtet ist und
  Belichtung ignoriert ([Sonne](objekt:sun)). Das vom Maßstab unabhängige Fülllicht der
  Nachtseite ($\mathrm{nightFill}=0{,}25$, `store/index.ts`; Emissiv gleich
  $\mathrm{nightFill}\cdot\mathrm{dayLevel}/\pi$, `render/lighting.ts`) hebt Neptuns physikalisch
  fast schwarze Nachtseite dabei auf ein Viertel des jetzt korrekt eingestellten Tagniveaus an –
  im Bild erscheint Neptun deshalb überwiegend als graue Scheibe (Median rund 153 von 255) mit
  der schmalen, helleren Sichel darüber, statt der in Wirklichkeit fast schwarzen Nachtseite.
- **Keine Streuung, kein Blendeffekt** über den Bloom-Durchgang hinaus (`render/postfx.ts`):
  Nur Objekte auf der Bloom-Ebene erhalten den zusätzlichen Leuchtkranz, ein atmosphärisches oder
  optisches Streumodell fehlt.
- **Sternhintergrund ohne echte Leuchtdichten:** Die Katalogmagnitude bestimmt nur die Punktgröße
  und über den B-V-Index die Farbe (`render/starfield.ts`), nicht eine physikalisch belichtete
  Helligkeit wie bei den Körpern.
- **Maßstab:** In „Schaubild" staucht `sim/scale.ts` Neptuns wahre 30-AE-Entfernung zur Sonne mit
  $r^{0{,}6}$; der Kameraabstand von Neptun selbst bleibt davon unberührt, weitere
  Vereinfachungen in [Grenzen des Modells](thema:modell).

*Stand: September 2026*
