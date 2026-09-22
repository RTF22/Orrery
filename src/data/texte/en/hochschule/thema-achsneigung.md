# Axial tilt

The axial tilt or obliquity $\varepsilon$ of a body is the angle between its spin axis and the
normal of its own orbital plane. It decides whether and how strongly a body has seasons, drives its
own slow drift through external torques, and is itself the subject of unsettled disputes for the
giant planets. This text sets out the definition, compares measured and model values for all
planets, Pluto and the Sun, derives the insolation formula and the precession rate, traces the
long-term evolution of the tilt of Earth, Mars, Venus and Mercury, and closes with the competing
explanations for the extreme tilt of [Uranus](objekt:uranus) – which is also the central puzzle of
this stage: how can a planet tip over by almost 98° without its moons drifting away from their
equatorial, prograde orbits?

## Definition of obliquity

Formally, obliquity is the angle between a body's angular-momentum vector (its physical spin axis)
and the normal of its orbital plane. In the practice of [reference systems](thema:bezugssysteme),
however, this physical angle is rarely stated directly: the IAU working group on rotational elements
instead defines a north pole that lies, purely geometrically, north of the solar system's invariable
plane regardless of the actual sense of rotation, and describes the spin through the prime-meridian
angle $W$ with a rate $\dot W$. If $\dot W$ is negative the body rotates retrograde, and the angle
measured this way between that geometric north pole and the orbit normal exceeds 90° – it is then no
longer the physical tilt angle of the spin axis but its supplement to 180°. Venus at 177° and Uranus
at 98° are therefore not "upside down" in the sense of a tilt near 180° of their true spin axis;
rather, their physical spin axis lies only a little away from the orbit normal (Venus about 3°,
Uranus about 82°), just with the opposite sense of rotation. For dwarf planets, small bodies and
their moons, this north-pole convention of large bodies does not apply; instead the positive pole
simply follows the right-hand rule
([Archinal et al. 2011](literatur:archinal-2011); [Archinal et al. 2019](literatur:archinal-2019)).

Equally important is the distinction between obliquity against a body's own orbit and obliquity
against the ecliptic: the two coincide only if the orbital plane itself coincides with the ecliptic.
Uranus' orbit is inclined by 0.77° to the ecliptic; its pole lies at right ascension 257.311°,
declination −15.175°. Measured against the ecliptic (without the 180° supplement of the north-pole
convention), the raw angle between pole and ecliptic normal is 82.278°, or 97.722° with the
supplement – against its own orbit normal, by contrast, it is 97.77° (see below). The difference of
only 0.048° is small here because the orbital inclination itself is small; for a body with a more
strongly inclined orbit it would be larger. Venus shows the difference especially clearly: its pole
lies at right ascension 272.76°, declination 67.16° – only 1.24° from the ecliptic north pole, so
practically parallel to the ecliptic axis. Only the 180° supplement from the retrograde rotation and
the 3.39° inclination of Venus' orbit to the ecliptic together yield the familiar 177° against its
own orbit.

## Measured and model values

The table below compares the published measured values with the model value that Orrery computes
via `achsneigungDeg` from the pole and orbit normal at epoch J2000 (derivation see "In the model").
The Sun has no orbit; its value is the angle between pole and ecliptic normal.

| Body | Measured | Model | Source |
|---|---|---|---|
| Mercury | 0.034° | 0.034° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Venus | 177.4° | 177.362° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Earth | 23.4° | 23.439° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Mars | 25.2° | 25.192° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Jupiter | 3.1° | 3.120° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Saturn | 26.7° | 26.730° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Uranus | 97.8° | 97.770° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Neptune | 28.3° | 28.318° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Pluto | 119.5° | 119.614° | [NSSDC fact sheets](quelle:nssdc-factsheets) |
| Sun | 7.25° | 7.2517° | [Archinal et al. 2011](literatur:archinal-2011) |

The agreement is close but not exactly coincidental: the model value adopts the same pole that the
measurements also rely on, but computes the orbit normal itself from the tabulated orbital elements
at epoch instead of looking it up separately. Small differences such as for Pluto (119.5° versus
119.614°) or Uranus (97.8° versus 97.770°) arise from rounding the measured value to one or two
decimal places.

## Seasons and insolation

The daily-mean insolation at a location of latitude $\varphi$ depends on the solar declination
$\delta$, which is itself set by the obliquity $\varepsilon$ and the Sun's true longitude on the
orbit ($\sin\delta = \sin\varepsilon\,\sin\lambda$, with $\lambda = 0$ at the equinox). With the hour
angle $H_0$ from sunrise to sunset, $\cos H_0 = -\tan\varphi\,\tan\delta$ (clamped to $[0,\pi]$:
$H_0 = \pi$ during polar day, $H_0 = 0$ during polar night), the daily-mean insolation is

$$Q(\varphi,\delta) = \frac{S_0}{\pi}\left(H_0\,\sin\varphi\,\sin\delta + \cos\varphi\,\cos\delta\,\sin H_0\right)$$

with the solar constant $S_0$ at the relevant solar distance. Since $H_0$, $\varphi$ and $\delta$ are
dimensionless (radians), $Q$ carries the same unit as $S_0$, usually $\mathrm{W}\,\mathrm{m}^{-2}$ –
the dimensional check works out. The same quantity underlies the "insolation quantities" of
[Earth](objekt:earth) tabulated by Laskar et al.
([Laskar et al. 2004](literatur:laskar-2004)). As $\varepsilon \to 0$ the annual cycle vanishes
entirely ($\delta \equiv 0$); the larger $\varepsilon$, the larger the area that experiences polar
day or polar night at some point: on Earth the polar circle begins at
$90^\circ - \varepsilon = 66.6^\circ$.

Uranus, with its extreme obliquity, shows the limiting case: with an orbital period of 84 years, the
Sun stands above each pole for about 42 years and below the horizon for just as long, while the
equator experiences short days with rapidly changing illumination. The southern summer solstice –
near the sunlit southern hemisphere that Voyager 2 saw on 24 January 1986 – fell on 30 September
1985, the following equinox on 6/7 December 2007, and the next northern summer solstice on 11 April
2030. [Pluto](objekt:pluto) too, with its obliquity of about 120°, experiences extended polar-day and
polar-night zones that reach into even middle latitudes because of its still stronger tilt – amplified
by its high orbital eccentricity, which lets the solar distance vary by more than a factor of two over
one orbit.

## Precession of the spin axis

A rotating, oblate body is not a rigid gyroscope in a vacuum: the pull of an external perturber on
its equatorial bulge produces a torque that, averaged over the orbit and the spin, makes the spin
axis precess uniformly about the orbit normal without changing the obliquity itself. For a perturber
of mass $m$ at distance $a$, the precession rate is

$$\dot\Psi = \frac{3}{2}\,\frac{Gm}{a^3}\,\frac{J_2}{C/(MR^2)}\,\frac{\cos\varepsilon}{\omega}$$

with the oblateness moment $J_2$, the normalized polar moment of inertia $C/(MR^2)$ and the spin rate
$\omega$ of the precessing body. The dimensional check confirms the form: $Gm/a^3$ has units of
$\mathrm{s}^{-2}$, $J_2$ and $C/(MR^2)$ are dimensionless, and dividing by $\omega$
($\mathrm{s}^{-1}$) again yields $\mathrm{s}^{-1}$, the unit of a rate. For [Earth](objekt:earth),
with $C/(MR^2) = 0.3307$ and $J_2 = 1.0826359 \cdot 10^{-3}$
([Petit and Luzum 2010](literatur:petit-2010)), evaluating the formula separately for the Sun and the
[Moon](objekt:moon) gives 15.94″ per year from the Sun and 34.73″ per year from the Moon, 50.67″ per
year in total; the actual general precession in longitude is 5029.0966″ per century, that is 50.2910″
per year, completing one cycle in about 25,770 years
([Petit and Luzum 2010](literatur:petit-2010)). The simple formula matches the measured value to
about 0.8 %; the residual mainly reflects the Moon's orbital inclination to the ecliptic (5.145°),
neglected here. Since epoch J2000 up to 22 September 2026, that is over 26.72 years, the true
celestial pole has thereby already shifted by
50.2910″ × 26.72 = 1343.9″ = 22.40′ = 0.3733° – an amount Orrery neglects (see "In the model"). For
[Mars](objekt:mars), the same formula with only the Sun as perturber, $J_2 = 0.0019566$
and $C/(Ma^2) = 0.36419$ gives 7.50″ per year, about 1.2 % below the value of 7598.1 milliarcseconds
per year measured from InSight radio tracking
([Le Maistre et al. 2023](literatur:le-maistre-2023)).

## Long-term evolution

The orbital planes of the planets themselves slowly drift against one another (see
[orbital elements](thema:bahnelemente)); since obliquity is measured against a body's own, drifting
orbit, obliquity changes even without any precession of the spin axis. For Earth this produces the
well-known Milanković cycle: the obliquity of the ecliptic oscillates between 22.1° and 24.5° over
about 41,000 years ([Laskar et al. 2004](literatur:laskar-2004)). Without the Moon, Earth would
according to Laskar et al.'s calculations be exposed to a much larger, chaotic zone that could range
from nearly 0° to about 85°; the Moon keeps the actual oscillation confined to the narrow,
quasi-periodic zone between 22.1° and 24.5°
([Laskar et al. 1993](literatur:laskar-1993)). A later, independent numerical integration of a truly
moonless Earth qualifies this picture, however: Lissauer et al. find typical variations of only about
±10° over gigayear timescales, well below the theoretically allowed range – the Moon thus protects
Earth more from a rare large excursion than from a typical, moderate drift
([Lissauer et al. 2012](literatur:lissauer-2012)).

[Mars](objekt:mars) has no comparable counterweight. Laskar and Robutel showed generally that
Earth-like planets can lie in large chaotic obliquity zones; for Mars they then quoted a zone from 0°
to 60° ([Laskar and Robutel 1993a](literatur:laskar-1993a)), while an independent integration by
Touma and Wisdom found chaotic variations between about 11° and 49° with a divergence timescale of 3
to 4 million years ([Touma and Wisdom 1993](literatur:touma-1993)). The most recent long-term
calculation gives a mean obliquity of $37.62^\circ \pm 13.82^\circ$ over the last 5 billion years,
with peaks up to $82.035^\circ$ ([Laskar et al. 2004a](literatur:laskar-2004a)) – today's comparatively
moderate tilt of about 25° is thus a single snapshot within a much wider distribution.

[Venus](objekt:venus) reached its present, nearly upside-down state not through ordinary precession
but through one of four possible end states of rotation: Earth-like planets with a dense atmosphere
can either flip the axis in the classical way or, without any axial tipping at all, slow a prograde
rotation down to reversal while the obliquity itself tends to zero; which of the two paths is taken
depends on the interplay of solid-body and atmospheric thermal tides
([Correia and Laskar 2001](literatur:correia-2001)). [Mercury](objekt:mercury), by contrast, retained
a very small obliquity: it sits in a [Cassini state](thema:gebundene-rotation) in which the spin axis,
the orbit normal and the orbit's precession axis stay coplanar; the measured value is
$2.029 \pm 0.085$ arcminutes ([Stark et al. 2015](literatur:stark-2015)) – a value closely tied to the
planet's [interior structure](thema:innerer-aufbau), because the size of the obliquity depends on the
core–mantle coupling.

## Tilting mechanisms of the giant planets

For the giant planets, even the cause of the obliquity is disputed. Saturn's 26.73° is attributed
either to a precession resonance with the nodal drift of Neptune's orbit, which could have dragged
Saturn's axis along, or to the loss of a since-destroyed moon; neither explanation is settled
([Ward and Hamilton 2004](literatur:ward-2004); [Wisdom et al. 2022](literatur:wisdom-2022)). Even
Jupiter's small tilt of 3.1° may not be purely primordial: its spin-axis precession period lies close
to the roughly $4.3 \cdot 10^5$-year Laplace–Lagrange mode with which Uranus' own orbital plane
precesses – if Jupiter is caught in resonance with this orbital mode, part of its obliquity is forced
rather than inherited, which yields a constraint on its moment of inertia independent of any interior
model ([Ward and Canup 2006](literatur:ward-2006)).

For [Uranus](objekt:uranus), the tilt of almost 98° is itself the quantity to be explained, and with
it a second puzzle: all five large moons orbit almost exactly in the planet's (tilted) equatorial
plane and prograde – in the model their obliquities against the Uranian equator range from 0.069°
(Oberon) to 4.334° (Miranda), essentially zero compared with the planet's own tilt. A single late
impact would tilt the planet but leave any pre-existing moons on their old orbits, now inclined
against the new equator. In the Safronov tradition, Slattery, Benz and Cameron already showed that an
impact on a young Uranus could have shaped its rotational state
([Slattery et al. 1992](literatur:slattery-1992)); modern, high-resolution smoothed-particle
(SPH) simulations by Kegerreis et al. show that an impactor of at least two Earth masses can explain
today's fast rotation while at least 90 % of the atmosphere remains bound
([Kegerreis et al. 2018](literatur:kegerreis-2018)) – a methodological follow-up, however, shows that
even bulk results such as the post-impact rotation period converge only above ten million SPH
particles, which limits how much weight any single simulation run can bear
([Kegerreis et al. 2019](literatur:kegerreis-2019)). For the moons themselves, Morbidelli et al.
showed that a debris or proto-satellite disk present at the time of the tilt would precess
incoherently around the new, tilted equator after the impact and collapse, through collisional
damping, into a thin equatorial disk from which today's moons could have formed – the prograde
equatorial orbits would then be no exception but the expected outcome
([Morbidelli et al. 2012](literatur:morbidelli-2012)).

An entirely different family of explanations dispenses with an impact altogether, or needs one only
as a final step. Rogoszinski and Hamilton showed that a circumplanetary disk of at least three times
today's satellite mass pushes the Laplace radius far enough outward that the spin precession of a
young Uranus resonates with its own orbital precession and drives the obliquity up to about 70°; a
subsequent, much smaller impact of about $0.5\,M_\oplus$ then suffices to reach today's 98°
([Rogoszinski and Hamilton 2020](literatur:rogoszinski-2020)). A follow-up work compares this
resonance mechanism directly with pure collision scenarios: resonance capture alone would need about
100 million years to reach 90°, whereas a single impact of $1\,M_\oplus$ suffices and two impacts of
$0.5\,M_\oplus$ each are even more likely – collisions remain the most plausible explanation by this
account ([Rogoszinski and Hamilton 2021](literatur:rogoszinski-2021)). Saillenfest et al. instead
trace the migration of a long-vanished, hypothetical moon of about $4 \cdot 10^{-4}$ Uranus masses
across roughly ten Uranus radii: at a drift rate like the Moon's present recession, the planet and
moon fall into a secular spin-orbit resonance that first controls, then, beyond 80°, chaotically tips
Uranus, until the moon finally plunges into the planet and freezes the obliquity reached – in about
80 % of the simulations that end in a Uranus-like state
([Saillenfest et al. 2022](literatur:saillenfest-2022)). The scene
[Uranus lying on its side](szene:uranus-gekippt) shows the outcome of these competing paths without
deciding between them. For comparison: [Neptune](objekt:neptune), of similar size and composition to
Uranus, has only 28.3° of obliquity, was not struck by any of these mechanisms to the same degree, and
stayed close to its original orientation.

The distant dwarf planet [Pluto](objekt:pluto) also carries an extreme obliquity of about 120°;
unlike for Uranus, here it is stability rather than cause that is disputed. Dobrovolskis and Harris
already showed that Pluto's obliquity varies chaotically on timescales of millions of years
([Dobrovolskis and Harris 1983](literatur:dobrovolskis-1983)) – a finding later confirmed by refined
calculations without changing the fundamental restlessness of the Pluto–Charon orbit coupling.

## Open questions

- **Cause of Uranus' tilt.** A giant impact
  ([Slattery et al. 1992](literatur:slattery-1992); [Kegerreis et al. 2018](literatur:kegerreis-2018)),
  a pure spin-orbit resonance with a circumplanetary disk
  ([Rogoszinski and Hamilton 2020](literatur:rogoszinski-2020)), the migration of a vanished moon
  ([Saillenfest et al. 2022](literatur:saillenfest-2022)), or a combination of resonance and a smaller
  impact ([Rogoszinski and Hamilton 2021](literatur:rogoszinski-2021)) all stand side by side; each
  explains the moons' prograde equatorial orbits with different degrees of success.
- **Cause of Saturn's obliquity.** A precession resonance with Neptune
  ([Ward and Hamilton 2004](literatur:ward-2004)) versus the loss of a moon
  ([Wisdom et al. 2022](literatur:wisdom-2022)) – both explanations rest on the same observational
  quantities, and neither calculation rules out the other.
- **Does the Moon really stabilize Earth's obliquity?** Laskar et al. found a chaotic zone from 60°
  to 90° that would range from nearly 0° to 85° without the Moon
  ([Laskar et al. 1993](literatur:laskar-1993)); a later, independent integration of a truly moonless
  Earth instead finds only moderate variations of about ±10°
  ([Lissauer et al. 2012](literatur:lissauer-2012)). How large the Moon's protective effect really is
  thus remains a question of the model assumptions.
- **Venus' path into retrograde rotation.** Whether today's state was reached through a classical
  flip of the axis or through pure deceleration to a reversal of spin sense is unresolved
  ([Correia and Laskar 2001](literatur:correia-2001)).

## In the model

Orrery keeps every pole fixed in space: there is no precession and no nutation, and each pole sits at
its constant value from `physical.pole` – the IAU pole at epoch J2000, taken depending on the dataset
from the IAU report on rotational elements or from the SPICE kernel `pck00011.tpc`. For Earth this
means the actual precession accumulated since J2000, 22.40′ (see above), is entirely absent; over the
short time spans typically shown in the application this goes unnoticed, but it becomes visible for
time jumps spanning centuries. The data panel computes the obliquity with `achsneigungDeg` as the
angle between this fixed pole and the orbit normal built from position and velocity at epoch, with a
180° flip for a negative rotation period (Venus, Uranus, the five large Uranian moons, Triton); for
the Sun, which has no orbit, the angle against the ecliptic normal is used instead. Moons with
`frame: 'parentEquator'` measure their obliquity against the orbit normal built from position and
velocity, not against a separately tracked Laplace plane. Miranda and Triton nonetheless keep a fixed
pole in the dataset, even though the IAU report gives their poles as series expansions with large
periodic terms that describe the precession of the spin axis following the drifting orbit normal –
the dataset carries only the constant terms
([Archinal et al. 2011](literatur:archinal-2011)). Eris and Makemake carry a pole perpendicular to
their own orbit in the dataset, for want of a measured alternative. Seasons emerge in the rendered
image purely from the pole and the direction to the Sun in the lighting calculation, with no
dedicated seasons code – like every simplification of this kind, this too belongs to the
[limits of the model](thema:modell).

*As of September 2026*
