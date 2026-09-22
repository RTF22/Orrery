# Szene: Die geneigte Bahn des Iapetus

Die Kamera umkreist [Saturn](objekt:saturn) selbst, nicht [Iapetus](objekt:iapetus) – bei
diesem Abstand zeigt erst der planetenzentrierte Blick, wie stark seine Bahn gegen Saturns
Äquator und [Ringe](thema:ringe) geneigt ist. Anders als bei [Saturns Ringen von der
Kante](szene:saturn-ringkante), wo fünf Monde nahe der Ringebene hin- und herziehen, ist
Iapetus der Ausreißer: weit draußen, deutlich geneigt, in dieser Szene nur als Bahnlinie
sichtbar, nie als Scheibe.

## Was das Bild zeigt

Der Bahntyp `orbit` hält die Kamera auf einer Kugel um Saturns Mittelpunkt: Radius
40 dargestellte Saturnradien ($R_\mathrm{p} = 58\,232\,\mathrm{km}$) mal Streufaktor, ohne
`lookAtId` – die Kamera blickt also auf Saturn, nicht auf Iapetus. Bei Streufaktor
0,8/1,0/1,5 liegt sie $1\,863\,424\,\mathrm{km}$/$2\,329\,280\,\mathrm{km}$/
$3\,493\,920\,\mathrm{km}$ entfernt; Saturns Winkeldurchmesser $2\arcsin(R_\mathrm{p}/R)$
schrumpft dabei von 3,58° auf 1,91°, der Ring (Außenkante $136\,780\,\mathrm{km}$) von 8,42°
auf 4,49°. Azimut liegt fest bei 225,58° (Streuung ±20°, Rate 1°/s über 30 s), Elevation je
Ziehung fest zwischen 30° und 60° (Basis 45°, additiv ±15°).

Der Ring-Öffnungswinkel folgt derselben Rechnung wie bei [Saturns Ringen von der
Kante](szene:saturn-ringkante): $B=\arcsin(|\hat d \cdot \hat n|)$ mit Saturns Pol $\hat n$
(`poleVector`, 40,589°/83,537°) und der Blickrichtung $\hat d$. Bei Azimut 225,58° und
Elevation 30°/45°/60° ergibt sich $B=5{,}94^\circ/20{,}38^\circ/34{,}70^\circ$, das scheinbare
Achsenverhältnis des Rings $\sin B = 0{,}10/0{,}35/0{,}57$ – offen genug, um Ring und Kugel
klar zu trennen. Dieselbe Rechnung, angewandt auf die Normale von Iapetus' eigener Bahnebene
statt auf Saturns Pol, ergibt für dieselben drei Elevationen $B=12{,}80^\circ/27{,}80^\circ/42{,}79^\circ$
und ein Achsenverhältnis von 0,22/0,47/0,68: Die um 15,47° gegen Saturns Äquator geneigte
Bahnellipse erscheint damit im ganzen Elevationsbereich klar als Ellipse, nie als Linie.

Weil Saturns Kameraabstand (40 $R_\mathrm{p}$) kleiner ist als Iapetus' eigener Bahnradius
(rund 61 $R_\mathrm{p}$), gilt diese Achsenverhältnis-Rechnung nur für die Orientierung der
Ellipse, nicht für ihre vollständige Sichtbarkeit: Eine echte Kegelprüfung entlang der
Kamerabasis (halbes Sichtfeld 25° vertikal, bei 16:9 rund 39,7° horizontal) zeigt, dass in
der Grundeinstellung nur rund ein Drittel bis knapp die Hälfte der momentanen Bahnellipse
im Bildausschnitt liegt – der Rest liegt hinter der Kamera oder außerhalb des horizontalen
Sichtfelds. Sichtbar bleibt in jeder Ziehung ein klar gekrümmter, deutlich geneigter Bogen
nahe Saturn, kein vollständig geschlossener Ring; das ist echte Perspektive, keine
vereinfachte Orthogonalprojektion.

Iapetus selbst bleibt dabei unauffällig: Sein eigener scheinbarer Radius erreicht über die
90 simulierten Tage der Szene (30 s bei 3 Tagen/s, Umlaufzeit 79,331 Tage, rund 1,13
Umläufe) und den ganzen Streuungsbereich höchstens rund 1 Bildpunkt (Bildhöhe 1080 px,
Sichtfeld 50°) – weit unter `LABEL_MIN_PIXEL_MOND` (8 Bildpunkte, `render/labels.ts`) und
auch unter der Marker-Schwelle (3 Bildpunkte, geprüft über 6516 Zeitpunkt-Kamera-Kombinationen
im 0,5-Tage-Raster): kein Label, kaum ein Punkt, nur die
Bahnlinie zeigt ihn. Von den übrigen Monden bleiben [Rhea](objekt:rhea) (9,05
$R_\mathrm{p}$), [Dione](objekt:dione) (6,49), [Tethys](objekt:tethys) (5,07), Enceladus
(4,09) und Mimas (3,19) in jeder Ziehung vollständig im Bild, weil ihre Bahnradien selbst
beim engsten Kameraabstand weit innerhalb der halben Bildbreite liegen; [Titan](objekt:titan)
(20,99 $R_\mathrm{p}$) liegt nahe der Bildkante und kann bei flacher Elevation und kleinem
Streufaktor teilweise aus dem Bild wandern.

## Hintergrund

Saturns Laplace-Radius liegt bei $48{,}4\,R_\mathrm{p}$
([Bahnelemente](thema:bahnelemente)); jenseits davon bestimmt die Sonne die Präzession
stärker als Saturns Äquatorwulst, und die Ebene, um die eine Bahn kreiselt, kippt von
Saturns Äquator zu seiner eigenen Bahnebene. Nach den mittleren Bahnelementen läuft Iapetus
bei $59\,R_\mathrm{p}$, deutlich jenseits dieser Schwelle – der im Modell tatsächlich
verwendete, osculierende Wert liegt mit rund 61 $R_\mathrm{p}$ in derselben Größenordnung.
Seine Laplace-Ebene ist deshalb nur noch 14,8° gegen Saturns Äquator geneigt, seine
tatsächliche Bahn weitere 7,6° gegen diese Ebene ([Tremaine et al.
2009](literatur:tremaine-2009)); direkt gegen Saturns Äquator gemessen ergibt das 15,47° –
die größte Neigung unter den klassischen Saturnmonden.

Giovanni Domenico Cassini entdeckte Iapetus am 25. Oktober 1671 und bemerkte dabei bereits,
dass er nur westlich von Saturn gut zu sehen war, östlich dagegen kaum. Aus dieser
Asymmetrie schloss er richtig, dass eine Hälfte des Mondes viel dunkler ist als die andere
([Iapetus bei NASA Science](quelle:nasa-iapetus)). Erst der einzige nahe
Cassini-Vorbeiflug am 10. September 2007, in $1644\,\mathrm{km}$ Höhe
([Cassini-Vorbeiflug an Iapetus](quelle:nasa-iapetus-vorbeiflug)), löste die Anomalie aus
der Nähe auf: Die globale Farbdichotomie ist geometrisch scharf begrenzt
([Denk et al. 2010](literatur:denk-2010)), am ehesten durch primordiales, aus dem
Phoebe-Ring eingefangenes dunkles Material auf der führenden Halbkugel erklärt, das eine
thermische Rückkopplung verstärkt ([Spencer und Denk 2010](literatur:spencer-2010)) – Details
zu Ursprung und Äquatorwulst stehen bei [Iapetus](objekt:iapetus).

## Modellgrenzen

- **Kugel ohne Abplattung:** `radiusKm` ist ein einzelner Skalar; Iapetus' realer
  Äquatorwulst (bis zu 20 km hoch) bleibt bei diesem Kameraabstand ohnehin unsichtbar.
- **Feste Knotenpräzession um Saturns Pol statt um den Laplace-Pol:** Abweichung gegen
  Horizons 2050 um 0,71°, 2076 um 1,11° ([Bahnelemente](thema:bahnelemente)).
- **Ring als Scheibe ohne Dicke**, Saturn und Iapetus als Kugeln ohne reale Abplattung.
- **Albedo einfarbig 0,275:** Die reale Zweiteilung (0,05 gegen 0,5) zeigt nur die Textur,
  nicht der Belichtungswert.
- **Zeitraffer:** Er gleitet beim Szenenbeginn 2 s lang geometrisch auf 3 Tage/s
  (`RATE_BLEND_SEC`, `app/cinema.ts`).
- **Sonnenrichtung fest aus J2000:** Azimut 225,58° ist, wie bei [Enceladus im hellen
  Glanz](szene:enceladus-hell), die Richtung Saturn→Sonne zur Epoche J2000. Saturns mittlere
  Bewegung ($1222{,}49362201^\circ$ je Jahrhundert, `LDot`) entspricht $12{,}22^\circ$ je Jahr; bis
  heute (22.09.2026, 26,72 Jahre seit J2000) sind daraus rund 35° Versatz aufgelaufen, nach
  vollen $29{,}45$ Jahren (ein Saturnjahr) schließt sich der Kreis wieder. Weitere
  Vereinfachungen: [Grenzen des Modells](thema:modell).

*Stand: September 2026*
