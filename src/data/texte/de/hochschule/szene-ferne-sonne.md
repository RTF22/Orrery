# Szene: Von Neptun zur fernen Sonne

Die Kamera steht nahe [Neptun](objekt:neptune) und blickt fest zur [Sonne](objekt:sun) – die
Szene zeigt, wie klein und schwach der Stern aussieht, um den auch Neptun kreist, aus den
Außenbezirken des Sonnensystems.

## Was das Bild zeigt

Der Bahntyp `static` (`render/camera/cinema.ts`) hält die Kamera fest bei Neptun,
`lookAtId: 'sun'` richtet den Blick dauerhaft zur Sonne. Radius: 12 dargestellte Neptunradien
($R_\mathrm{N}=24\,622\,\mathrm{km}$) mal Streufaktor; bei 0,9/1,0/1,5 sind das 265 918/295 464/
443 196 km. Elevation ist additiv fest zwischen 5° und 40° (Basis 15° ± 10°), Azimut additiv fest
zwischen 80° und 160° (Basis 120° ± 40°); die Rate ist 0, das Bild driftet über die 30 s Dauer
also nicht.

Weil die Kamera nur wenige hunderttausend Kilometer von Neptun absteht, gegen 4,5 Milliarden km
Neptun-Sonne-Abstand, bestimmt allein die Blickrichtung zur Sonne, wo Neptun im Bild landet – und
das ist nirgends: Eine eigene Rastersuche über den ganzen gezogenen Azimut-/Elevationsbereich
ergibt für den Winkel zwischen der Blickrichtung (Kamera→Sonne) und der Richtung Kamera→Neptun
Werte zwischen 123° und 173°. Das liegt in jeder Ziehung weit über 90° und damit auch weit über
dem großzügigeren horizontalen Halbfeld von 39,7° (16:9 bei `KAMERA_FOV_GRAD` 50°, das vertikale
Halbfeld beträgt nur 25°) – Neptun steht nicht am Bildrand, sondern schlicht hinter der Kamera.
Die Szene zeigt buchstäblich nur den Blick von Neptuns Standort zur fernen Sonne, nicht Neptun
selbst.

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

Neptuns Energie- und Lichtbilanz hängt fast vollständig an diesem einen Neunhundertstel
Sonnenlicht; alles Wärmeempfinden für innere Wärmequellen im Riesenplaneten misst sich gegen genau
diese schwache äußere Einstrahlung. Bisher hat nur [Voyager 2](quelle:nasa-voyager-2) Neptun aus
der Nähe gesehen, am 25. August 1989. Sein Schwesterschiff Voyager 1 blickte, bereits weit
außerhalb der Planetenbahnen, am 14. Februar 1990 noch einmal zurück: Die Aufnahmesequenz des
„Familienporträts" begann ausgerechnet bei Neptun, dem lichtschwächsten Ziel, und arbeitete sich
von dort zur Sonne vor
([Erstes Familienporträt des Sonnensystems](quelle:nasa-family-portrait)) – dieselbe Blickrichtung,
die diese Szene zeigt.

Voyager 2 selbst flog nach der Begegnung mit Neptun weiter hinaus und überschritt am 5. November
2018, bei 119 AE, die Heliopause – die Grenze, an der der Sonnenwind dem interstellaren Medium
weicht ([Stone et al. 2019](literatur:stone-2019)). Das ist fast das Vierfache von Neptuns eigenem
Sonnenabstand: Der Einfluss der Sonne reicht weit über die Planetenbahnen hinaus, nur eben nicht
mehr als sichtbares Licht.

## Modellgrenzen

- **Sonne vergrößert:** In „Schaubild" erscheint sie 1,2° statt 64″
  ([Sonne](objekt:sun)) – rund 68-fach überhöht (eigene Rechnung).
- **Belichtung folgt der Sonne, nicht Neptun:** Weil `lookAtId` gesetzt ist, liefert
  `exposureTargetId` hier die Sonne; da sie stets im Koordinatenursprung steht, ergibt das den
  Referenzwert für 1 AE (Faktor $\pi$, eigene Rechnung). Anders als bei den meisten übrigen Szenen
  dieser Etappe, wo das angesehene Ziel exakt auf Referenzniveau erscheint, bekäme Neptun bei
  dieser Belichtung rechnerisch nur rund 41 % davon (eigene Rechnung) – in der Praxis unerheblich,
  weil Neptun ohnehin außerhalb des Bildfelds liegt (siehe „Was das Bild zeigt").
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
