# Scene: Mercury on the inner orbit

The camera chases [Mercury](objekt:mercury) along its orbit around the [Sun](objekt:sun) — the
fastest planet in the catalogue.

## What the view shows

The `chase` path anchors the camera behind the body, opposite its current velocity vector, and
raises it additionally, purely vertically, by `radius · sin(elevation)` (`render/camera/cinema.ts`);
unlike the `orbit` scenes, no `azimuthRateDegPerSec` turns the camera from outside — the whole
swinging motion comes from Mercury's own orbital motion. The reference quantity for the distance is
the displayed Mercury radius, radius times `sizeScale` — unlike the Sun's `sunDamping`,
`scaledRadius` applies no extra damping to planets. Because that offset is added purely vertically
instead of turning with the view, the true distance to the centre is not exactly the nominal nine
body radii: at the lower end of the elevation variation (5°) it is 1.014 times that value, at the
upper end (30°) 1.17 times. Mercury's small orbital inclination of $i = 7.00^\circ$ keeps the
difference small, since a vector within the orbital plane never points more than
$\sin i = 0.122$ of its length out of the ecliptic.

30 seconds at 2 days per second are 60 simulated days, a good two-thirds (68.2%) of the data set's
orbital period of 87.969 days — the same value as in the
[fact sheet](quelle:nssdc-mercury). The blend at the scene transition lets 56.6 to 76.9 days pass
depending on the preceding scene (catalogue extremes 0.0035 to 30 days per second as the
predecessor rate), that is 64% to 87% of a Mercury year instead of the nominal 68.2%.

In a vertical field of view of 50°, Mercury subtends about $12.3^\circ$ at the base parameters
(elevation 10°, factor 1) — identical in all three scale settings, because radius and distance
scale equally with `sizeScale`; over the full variation (elevation 5° to 30°, factor 0.8 to 1.6,
sampled across a year) that ranges from $6.8^\circ$ to $16.1^\circ$. The Sun, by contrast, depends
on the scale preset: in the "Diagram" default it subtends $14.9^\circ$ at the start of the scene
and grows within the 30 seconds to $18.3^\circ$, because Mercury's compressed solar distance
decreases at this point in the orbit; in "Realistic" it is only $1.2^\circ$, in "Compact"
$29.5^\circ$.

The orbital speed itself does not show up directly: the camera centres Mercury regardless of its
pace, only the direction behind it turns with the true velocity vector. What becomes visible
instead is how fast the Sun and background swing past — by Kepler's second law the angular
velocity is $\dot\theta \propto 1/r^2$, higher at perihelion than at aphelion by a factor of
$(r_\mathrm{aph}/r_\mathrm{peri})^2 = 2.30$, markedly more than the plain speed ratio
$v_\mathrm{peri}/v_\mathrm{aph} = (1+e)/(1-e) = 1.518$.

## Background

From the vis-viva equation $v(r)^2 = GM_\odot\,(2/r - 1/a)$, with the values from `mercury.ts` and
`sun.ts` (CODATA $G$ times the catalogue mass), $a(1-e) = 46.00$ and $a(1+e) = 69.82$ million
kilometres give the orbital speeds $v_\mathrm{peri} = 58.98$ and
$v_\mathrm{aph} = 38.86\,\mathrm{km/s}$ — close to the $58.97$ and $38.86\,\mathrm{km/s}$ given in
the fact sheet ([NSSDC Mercury Fact Sheet](quelle:nssdc-mercury)).

Already in the 19th century, Le Verrier found the excess perihelion precession, one of the first
tests of general relativity; the linked text on Mercury gives the figures. The 176-day solar day
follows from the 3:2 coupling of rotation and orbit — and because the orbital angular velocity at
perihelion ($6.35^\circ$ per day) slightly exceeds the data set's rotation rate ($6.14^\circ$ per
day), while at aphelion ($2.76^\circ$ per day) it stays far below it, the Sun's apparent motion in
Mercury's sky reverses for a few days near perihelion. Soter and Ulrichs were the first to describe
this effect ([Soter and Ulrichs 1967](literatur:soter-1967)).

Seen from Earth, Mercury always stays close to the Sun: with $a(1-e) = 0.307$ and
$a(1+e) = 0.467$ astronomical units, and Earth's orbit at roughly 1 au, the greatest elongation
lies roughly between $\arcsin(0.307) = 17.9^\circ$ and $\arcsin(0.467) = 27.8^\circ$. Close to
superior conjunction, at small phase and greatest distance, it nonetheless appears brightest
([Photometry](thema:photometrie)). Transits across the solar disk are rare: they require an
inferior conjunction close to one of the two orbital nodes and therefore occur almost only in May
or November.

## Model limitations

- **Orbit:** a Kepler ellipse with linearly advanced elements
  ([orbital elements](thema:bahnelemente)); the data set's perihelion precession, $577.716804$
  arc seconds per century relative to the fixed J2000 ecliptic, contains the observed total
  precession including the relativistic contribution and lies 2.41 arc seconds per century above
  the measured total of $575.3100 \pm 0.0015$ arc seconds per century
  ([Park et al. 2017](literatur:park-2017)).
- **Rotation without libration:** `rotationPeriodH` of $1407.6\,\mathrm{h} = 58.65$ days against
  two-thirds of the data set's own sidereal orbital period ($58.6461709$ days): the rotation falls
  behind the exact 3:2 coupling by $14.6^\circ$ per century, and against the measured
  $58.6460768$ days the model period is 339 s too long
  ([Tidal locking](thema:gebundene-rotation); [Stark et al. 2015](literatur:stark-2015)).
- **Exposure:** the camera exposes on the target — here Mercury itself, since the scene sets no
  `lookAtId`.
- **The Sun as a damped disc:** `sunDamping` (1.0 / 0.35 / 0.2 in Realistic, Diagram, Compact) and
  the distance exponent together explain the very different solar sizes per preset described above;
  over a year with full variation, its angular diameter in the Diagram preset ranges from
  $14.8^\circ$ to $19.0^\circ$, a ratio of $1.287$ — close to the
  $(r_\mathrm{aph}/r_\mathrm{peri})^{0.6} = 1.284$ expected from the compression exponent $0.6$.
- **Time-lapse:** at the start of the scene it glides geometrically over 2 s to the nominal value
  (see above).
- **No shadow cast by Mercury:** `waehleOkkluder` only selects the parent body and sibling moons as
  occluders; since Mercury is a moonless planet, it never casts a shadow in the model and never
  dims the Sun for any other body — Mercury transits and solar eclipses caused by Mercury do not
  occur in the picture ([eclipses](thema:finsternis)). Further simplifications:
  [limits of the model](thema:modell).

*As of September 2026*
