# Scene: The dance of the Moon

The [Moon](objekt:moon) orbits the [Earth](objekt:earth) in time-lapse, seen obliquely from above.

## What the view shows

The camera is anchored to the Earth, 150 displayed Earth radii away and 55° above the ecliptic, and
looks at the Earth's centre; its azimuth drifts prograde at 0.5° per second, hence by 22.5° over the
45 s of the scene. The reference quantity is the displayed radius, radius times the size factor;
because the lunar distance grows by the same factor, the scene shows the same picture at all three
scale settings, and the ratio of semi-major axis to Earth radius stays 60.35.

Each playback varies the azimuth over the full circle, the elevation between 30° and 85° and the
distance by a factor of 0.8 to 1.2, hence over 120 to 180 Earth radii. The elevation governs the
apparent shape of the orbit: at 30° the ellipse appears compressed to 0.59 of its width, at 85° it
is almost circular.

In a vertical field of view of 50° the Earth subtends $2\arcsin(1/150) = 0.76^\circ$, with the
variation 0.64° to 0.95°; the Moon reaches 0.16° to 0.26° depending on its place in the orbit, with
the variation 0.13° to 0.44°. Both stay small discs; the orbit line, by contrast, fills the frame.
Its angular radius around the centre of the image is 23.9° to 24.7° without the variation, against
25° for half the image height; at a distance factor of 0.8 it reaches beyond the edge. Over all
draws an average of 96% of the line stays in frame (16:9), all of it in a good two thirds of the
cases.

45 s at 0.9 days per second are 40.5 days, 1.48 sidereal revolutions of 30.4 s each; because the
camera drifts in the same direction, the Moon goes around only 1.42 times relative to the frame.

## Background

One revolution takes different lengths of time depending on the reference direction, and because
the equinox, perigee, node and Sun all move, this gives five months. The values follow from the
fundamental arguments of the IERS Conventions
([Petit and Luzum 2010](literatur:petit-2010), Eqs. 5.43 and 5.44):

| Month | counted against | Length |
|---|---|---|
| sidereal | the fixed stars | 27.32166 d |
| tropical | the equinox of date | 27.32158 d |
| anomalistic | perigee | 27.55455 d |
| draconic | the ascending node | 27.21222 d |
| synodic | the Sun | 29.53059 d |

The sidereal month is also the rotation period, because the rotation is
[tidally locked](thema:gebundene-rotation). If full Moon falls close to a node, there is a
[lunar eclipse](szene:mondfinsternis).

The Sun pulls on the Moon more strongly than the Earth does, more than twice as strongly according
to the NASA canon ([Espenak and Meeus 2009](literatur:espenak-2009)); with the gravitational
parameters of the IERS it is 1.8 to 2.5 times as strong depending on the distances, 2.2 times on
average. The acceleration towards the Sun thus dominates everywhere, and because it is almost
perpendicular to the direction of motion, the path of the Moon around the Sun is everywhere concave
towards the Sun: neither loop nor cusp. Nor do the at most 1.10 km/s around the Earth
([fact sheet](quelle:nssdc-moon)) ever cancel the roughly 29.8 km/s of the Earth's orbit.

In ecliptic longitude the solar perturbations appear as a series: the equation of the centre of the
Kepler ellipse (first term 22,639.55″, with the period of the anomalistic month) is followed by the
evection (4586.43″ = 1.274°, argument $2D - l$, 31.81 d), the variation (2369.91″ = 0.658°, $2D$,
14.77 d) and the annual equation (−666.44″ = −0.185°, $l_\odot$, 365.26 d); the largest solar term
in latitude is 623.66″ = 0.173° with $2D - F$, that in distance −3699 km with $2D - l$
([Chapront-Touzé and Chapront 1988](literatur:chapront-touze-1988)).

The instantaneous eccentricity therefore swung between 0.0266 and 0.0762 from 2008 to 2010, largest
every 205.9 days, when the line of apsides points at the Sun. Over the five millennia of the NASA
canon the perigee distance ranges from 356,355 to 370,399 km, the apogee distance only from 404,042
to 406,725 km, and the anomalistic month from 24.629 to 28.565 days
([Espenak and Meeus 2009](literatur:espenak-2009)); a separate evaluation of the ephemeris DE441
([Park et al. 2021](literatur:park-2021)) for 1990 to 2030 gives 356,509 to 370,323 km, 404,077 to
406,707 km and 24.65 to 28.55 days.

Strictly speaking, both bodies orbit their common centre of mass. With the mass ratio
$\mu = 0.0123000371$ it lies $\mu/(1 + \mu)$, that is 1.215% of the distance, from the Earth's
centre: 4332 to 4942 km, and thus always inside the Earth's body. Seen from the Sun, the Earth's
centre therefore wobbles by up to 6.9″ every month.

## Model limitations

- **Kepler ellipse:** a fixed semi-major axis of 384,467 km, eccentricity 0.0549 and inclination
  5.145° to the ecliptic ([orbital elements](thema:bahnelemente)); mean longitude, perigee and node
  run linearly, the rates after Meeus reduced by the general precession to +4067.6168° and
  −1935.5333° per century. No periodic term is included: against DE441 the longitude from 1990 to
  2030 is off by up to 2.39° (root mean square 1.03°), the latitude by 0.34°, the distance by about
  7000 km. The distance swings rigidly between 363,359 and 405,574 km; the variation of perigee,
  apogee and month length is missing entirely.
- **Orbit line:** the momentary ellipse for the current time, sampled in eccentric anomaly — the
  Moon therefore always sits exactly on it. During the scene the line of apsides turns by 4.5°, the
  line of nodes by −2.1°.
- **Earth at rest:** the Earth's centre sits at the Earth–Moon barycentre of the JPL table, and the
  Moon hangs rigidly from it; the view therefore shows no revolution of both bodies about a common
  point. The true centre of the Earth would be 4415 to 4928 km away.
- **Scale and light:** the lunar distance grows with the size factor like the radii, whereas the
  solar distance is compressed; because the point light sits in the displayed Sun, the direction of
  the light at the Moon departs from the true one by up to 7.6° ("Diagram") or 32.7° ("Compact")
  within a month, and the phases accordingly.
- **Time-lapse:** at the start of the scene it glides geometrically over 2 s from the value of the
  previous scene to 0.9 days per second; depending on the predecessor — the catalogue ranges from
  0.0035 to 30 days per second — 40.2 to 44.4 days pass in the 45 s instead of 40.5.
- **No tides:** the semi-major axis stays fixed, while [tidal friction](thema:gezeiten) pushes the
  Moon outwards by 3.8 cm per year. Further simplifications:
  [limits of the model](thema:modell).

*As of September 2026*
