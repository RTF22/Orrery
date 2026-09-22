# Szene: Der liegende Uranus

Die Kamera umkreist [Uranus](objekt:uranus) in nur 7 dargestellten Uranusradien Abstand – nah
genug, dass [Ringe](thema:ringe) und Monde deutlich vor der Kugel stehen. Anders als bei
[Saturns Ringen von der Kante](szene:saturn-ringkante), wo eine ruhende Kamera dauerhaft in der
Ringebene steht, bewegt sich die Kamera hier: Sie startet nahe dem Knoten der stark geneigten
Uranus-Äquatorebene mit der Ekliptik und zieht weiter, sodass sich der anfangs kantige Ring im
Lauf der Szene sichtbar öffnet.

## Was das Bild zeigt

Der Bahntyp `orbit` (`render/camera/cinema.ts`) hält die Kamera auf einer Kugel um Uranus: Radius
7 dargestellte Uranusradien ($R_\mathrm{U}=25362\,\mathrm{km}$) mal Streufaktor, ohne
`lookAtId` – die Kamera blickt also auf Uranus selbst. Azimut liegt fest bei 167,65° und läuft mit 1,2°/s weiter (35 s Dauer, macht 42° Drift bis zum Szenenende),
Elevation ist je Ziehung fest zwischen 0° und 20° (Basis 10°, additiv ±10°). Bei Streufaktor
0,8/1,0/1,5 liegt die Kamera 142 027/177 534/266 301 km entfernt; Uranus' Winkeldurchmesser
$2\arcsin(R_\mathrm{U}/d)$ schrumpft dabei von 20,57° auf 10,93°, die Ring-Außenkante
(51 600 km) von 42,61° auf 22,35°.

Der Azimut 167,65° ist, wie bei [Saturns Ringen von der Kante](szene:saturn-ringkante), kein
Zufallswert: Uranus' Pol (`poleVector`, 257,311°/−15,175°) liegt ekliptikal bei Länge 257,65°,
Breite 7,72°; die mit den Ringen zusammenfallende Äquatorebene schneidet die Ekliptik dort, wo
die Azimutrichtung senkrecht auf der horizontalen Polprojektion steht, also bei
257,65° ± 90° = 167,65° oder 347,65° – die kleinere der beiden Lösungen. Bei der Basis-Elevation
10° ergibt der Öffnungswinkel $B=\arcsin(|\hat d\cdot\hat n|)$ – mit der Kamerarichtung $\hat d$
und Uranus' Pol $\hat n$, derselben Rechnung wie dort – nur 1,34°
($\sin B=0{,}023$); selbst über den ganzen Streuungsbereich (0° bis 20°) bleibt B unter 2,64°
($\sin B$ unter 0,05) – der Ring steht zu Szenenbeginn praktisch auf der Kante. Erst der
weiterlaufende Azimut öffnet ihn, bis B nach den 42° Drift bei rund 42,6° ($\sin B=0{,}68$) liegt.

In den 35 s bei 0,3 Tagen/s vergehen 10,5 simulierte Tage; bei der im Modell verwendeten
Rotationsperiode $17{,}24\,\mathrm{h}$ sind das $10{,}5\cdot24/17{,}24\approx14{,}6$ Umdrehungen.

Bei 7 Uranusradien Kameraabstand (5,6 bis 10,5 $R_\mathrm{U}$ über die Streuung) liegen die
Bahnradien der fünf großen Monde bei 5,12 $R_\mathrm{U}$ (Miranda), 7,53 (Ariel), 10,49 (Umbriel),
17,20 (Titania) und 23,01 $R_\mathrm{U}$ ([Oberon](objekt:oberon), eigene Nachrechnung aus
`uranus-monde.ts`). Weil alle fünf Bahnebenen um weniger als 4,43° (Miranda) beziehungsweise
unter 0,19° (die übrigen) gegen die Ring-/Äquatorebene geneigt sind, verhalten sie sich optisch
wie der Ring: Zu Szenenbeginn nahezu kantig, öffnen sie sich mit demselben Azimutlauf. Ein echter
Kegeltest (72 Stützpunkte je Kreisbahn, halbes Sichtfeld 25°/39,7° bei 16:9 und
`KAMERA_FOV_GRAD` 50°) zeigt trotzdem: In der Grundeinstellung bleibt der Ring vollständig im
Bild (72 von 72 Stützpunkten), von den Mondbahnen dagegen nur ein Teil –
[Miranda](objekt:miranda) 30 von 72, [Ariel](objekt:ariel) 19 von 72, Umbriel 17 von 72, Titania
15 von 72, Oberon 13 von 72. Der Rest liegt vor allem außerhalb des oberen und unteren
Bildrands, bei den drei äußeren Monden zudem teils hinter der Kamera, weil ihr Bahnradius die
Kameraentfernung übersteigt.

Die Szene legt keine Sonnenrichtung fest: Sie besitzt, anders als die Mondfinsternis-Szene, kein
`zeitpunkt`-Feld, `tickCinema` lässt die Zeit deshalb ohne Sprung weiterlaufen (`app/cinema.ts`).
Welcher Pol oder eher die Äquatorregion beleuchtet erscheint, hängt damit vom Kalenderdatum beim
Szenenstart ab: Am 22.09.2026 liegt der subsolare Breitengrad rechnerisch bei rund 73° – tief in
der beleuchteten Nordpolkappe, gut dreieinhalb Jahre vor der Nordsommer-Sonnenwende 2030, ähnlich
der 2023 vom [James-Webb-Weltraumteleskop gezeigten hellen Nordpolkappe](quelle:nasa-webb-uranus).

## Hintergrund

Die Ursache von Uranus' [Achsneigung](thema:achsneigung) von 97,77° (geometrischer Winkel
Pol–Bahnnormale 82,23°) ist ungeklärt; infrage kommen eine oder mehrere Riesenkollisionen ebenso
wie eine allmähliche Spin-Bahn-Resonanz, die Argumente für beide Seiten stehen dort. Über einen
Umlauf von 84 Jahren zeigt jeder Pol rund 42 Jahre der Sonne, dann ebenso lange der Dunkelheit;
weil die Jahreszeitenpunkte nicht mit den Apsiden der leicht exzentrischen Bahn zusammenfallen,
sind die Zeitabstände zwischen ihnen nach Keplers zweitem Gesetz aber nicht gleich lang: Die
Südsommer-Sonnenwende, nahe der Voyager 2 vorbeiflog, fiel auf den 30. September 1985, die
folgende Tagundnachtgleiche auf den 6./7. Dezember 2007 – gut 22 Jahre später –, und die nächste
Nordsommer-Sonnenwende auf den 11. April 2030 – noch einmal gut 22 Jahre danach, macht zusammen
rund 44,5 statt der bei gleichmäßiger Aufteilung erwarteten 42 Jahre zwischen den beiden
Sonnenwenden. Weil die Ringe genau in dieser stark geneigten Äquatorebene liegen und
Uranus' eigene Bahnebene nur 0,77° von der Ekliptik abweicht, stehen sie von der Erde aus fast
ebenso verkippt wie die Rotationsachse selbst.

Entdeckt wurden die Ringe am 10. März 1977, als eine geplante Sternbedeckung Minuten vor und nach
dem eigentlichen Ereignis fünf kurze, symmetrische Lichteinbrüche zeigte – der Zufallsfund von
mindestens fünf schmalen, dichten Ringen ([Elliot et al. 1977](literatur:elliot-1977)). Aus der
Nähe hat das Uranussystem bis heute nur ein einziges Raumfahrzeug gesehen: [Voyager 2](quelle:nasa-voyager-2)
passierte den Planeten am 24. Januar 1986 in rund 81 600 km Höhe, nahe der damaligen
Südsommer-Sonnenwende – die Sonne beleuchtete dabei nur die Südhalbkugeln von Uranus und seinen
Monden ([Stone und Miner 1986](literatur:stone-1986)). Alles Spätere stammt von der
Erde oder aus dem Erdorbit: Der erste erdgebundene Ringebenendurchgang seit der Entdeckung, 2007,
zeigte erstmals die unbeleuchtete Ringseite und belegte, dass sich die feine Staubkomponente seit
Voyager deutlich verändert hatte ([de Pater et al. 2007](literatur:depater-2007)). Die 2003 bis
2005 per Hubble entdeckten äußeren Staubringe ν und μ – Letzterer teilt seine Bahn mit dem kleinen
Mond Mab ([Showalter und Lissauer 2006](literatur:showalter-2006)) – erhielten 2026 ihre bislang
gründlichste Charakterisierung: Kombinierte Keck-, JWST- und Hubble-Daten zeigen, dass der μ-Ring
wasserreiches Eis aus Einschlägen auf Mab enthält, während der ν-Ring aus Gesteinsmaterial mit
10 bis 15 % organischen Kohlenstoffverbindungen besteht – zwei Ringe mit grundverschiedenem
Ursprung ([de Pater et al. 2026](literatur:depater-2026)).

## Modellgrenzen

- **Kugel ohne Abplattung:** `radiusKm` steht auf $25362\,\mathrm{km}$, dem Volumenmittel, rund
  0,8 % unter dem realen Äquatorradius (Abplattung 2,29 %); `render/bodies.ts` skaliert jede Kugel
  nur mit einem einzigen Faktor.
- **Ringe als gerechneter Streifen**, wie [Ringe](thema:ringe) beschrieben: Sockel 260 km plus dem
  Sechsfachen der echten Breite, diffuse Komponenten zwölffach verstärkt und auf 0,12 gedeckelt,
  physikalische Deckkraft $1-e^{-\tau}$ von 10 % (λ) bis 78 % (ε). Ohne Ringdicke verschwindet der
  Streifen bei $B=0$ vollständig; real sind die Ringe nur wenige Kilometer dick.
- **Ohne ν- und μ-Ring:** Der Streifen reicht nur von 37 800 bis 51 600 km; die beiden diffusen
  äußeren Staubringe fehlen ebenso wie die kleinen Hirtenmonde Cordelia, Ophelia und Puck, die im
  Katalog nicht enthalten sind.
- **Pol fest im Raum**, ohne die geringe reale Präzession.
- **Rotationsperiode** $17{,}24\,\mathrm{h}$ (Voyager-Radiomessung) gegen die 2025 per
  Hubble-Aurora bestimmten $17{,}247864\,\mathrm{h}$ ([Lamy et al. 2025](literatur:lamy-2025)):
  28,3 s je Umdrehung zu kurz, macht seit J2000 rund 70° Phasenabweichung.
- **Beleuchtung ohne Atmosphäre** und ohne jahreszeitliche Wolkenbänder; Belichtung auf Uranus
  selbst (`exposureTargetId`, `render/exposure.ts`); Miranda bis Oberon als Ausweichfarben ohne
  Textur.
- **Zeitraffer:** Er gleitet beim Szenenbeginn 2 s lang geometrisch auf 0,3 Tage/s
  (`RATE_BLEND_SEC`, `app/cinema.ts`); anders als bei der Mondfinsternis-Szene springt die Uhr
  hier nicht auf ein bestimmtes Datum. Weitere Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
