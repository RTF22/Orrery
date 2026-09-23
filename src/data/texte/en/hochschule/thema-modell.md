# Limits of the model

Orrery keeps apart two things a screen simulation usually blurs together: where a body
actually stands is computed physically, from orbital elements, rotation models and masses. How
big and how bright it appears on screen is display, and is allowed to exaggerate — a size slider
enlarges bodies far beyond their true ratio to their orbital distance, and an exposure
calculation lifts faint light into the visible range so that a planet 30 AU away does not vanish
into black. This second freedom changes nothing about the first: the position the render loop
draws is always the same number the data panel shows. The identically titled overview at
secondary-school level lists the most important of these simplifications briefly; this text puts
them in context, gives orders of magnitude and sources, and collects what the roughly seventy
body, topic and scene texts at university level have already worked out about individual model
deviations. Where a number already stands in a fact-checked text, this text repeats it unchanged
and names its source; own calculations are marked as such.

## Time

Orrery counts Julian days from 1 January 1, 0:00, to 31 December 9999, 0:00 (code constants
`JD_MIN`/`JD_MAX`); beyond this self-chosen edge, an unchecked, linearly extrapolated
eccentricity would have consequences — Saturn's $e$ would reach zero in the year 12,563 and go
negative thereafter, and Neptune's $e$ going backwards in the year −14,828, values the Kepler
solver rejects ([Formation of the Solar System](thema:entstehung)). Within the range, the clock displays the date
as UTC but feeds the same number into the orbit calculation as TDB, unconverted. Since
1 January 2017,
$\mathrm{TT} - \mathrm{UTC} = 32.184\,\mathrm{s} + 37\,\mathrm{s} = 69.184\,\mathrm{s}$,
and TDB differs from TT only by milliseconds — this [present-day
error](thema:bezugssysteme) shifts the Earth by 2.8″ in ecliptic longitude, the Moon by 38″. For
earlier and later times, the difference ΔT = TT − UT between uniform
orbital time and the time measured from Earth's rotation grows: for the year −500 the solar
eclipse canon gives ΔT = 17,190 ± 430 s ([Espenak and Meeus
2006](literatur:espenak-2006)) — nearly five hours, in which Earth turns by roughly 72°. Eclipse
records and stellar occultations document this offset from 720 BC to 2015 ([Stephenson et al.
2016](literatur:stephenson-2016)); for the time before that, for every century after 2015, and
even more so for dates far before year 1 or after 9999, there is no comparable observational
record. Even within the documented period, the observed increase in day length (+1.78 ± 0.03 ms
per century against +2.3 ± 0.1 ms from tidal friction alone, [Stephenson et al.
2016](literatur:stephenson-2016)) oscillates with a period of about 14 centuries around its mean
([Morrison et al. 2021](literatur:morrison-2021)); a simple extrapolation over millennia would
therefore be only a rough estimate of our own, not a documented figure. Orrery applies none of
these corrections; instead, the program flags the period for which its orbital elements are
actually checked: outside 1800 to 2050, both a body's data panel and the time control show a
warning about the reduced accuracy or validity window — this warning is, contrary to
what one might expect, not mere program text but tied to a tested threshold in the code.
Regardless of the calendar date, Earth spins uniformly in the model at 23.9345 h, 0.101 s longer
than one turn of the actual Earth rotation angle; at epoch J2000 the map's null meridian is
already offset from Greenwich by 79.5°, on 17 September 2026 by 75.4° — there has in fact been
no official rotation model for Earth since the 2015 IAU report, which struck the older
approximations as inaccurate ([Archinal et al. 2018](literatur:archinal-2018)); Orrery's uniform
rotation is thus not a misapplied model, but a replacement for one that no longer officially
exists.

## Planetary orbits

The eight planets move according to the JPL approximate table for 1800 to 2050, extrapolated
linearly against the fixed J2000 ecliptic ([JPL Approximate
Positions](quelle:jpl-approx-pos)). Within the window, the table itself states nominal errors in
heliocentric longitude from 15″ for Mercury up to 400″ for Jupiter and 600″ for Saturn, and for
Earth — the Earth-Moon barycenter in the model — 20″ in longitude, 8″ in latitude and 6000 km in
distance. How quickly this approximation becomes unusable outside the window shows in a
comparison with a second JPL table for 3000 BC to 3000 AD: for Saturn, the two tables give
$-0.419^\circ$ and $+0.542^\circ$ per century respectively for the same apsidal rate — not
merely different numbers, but opposite signs, because each table only captures the secular drift
effective within its own window, not a true average ([Orbital
elements](thema:bahnelemente)). Orrery computes no mutual perturbations between the planets;
each body moves alone around the Sun, which rests at the origin. This simplification affects the
Sun itself most strongly: with the actual positions and masses from Orrery's own datasets, its
center lay between 0.06 and 2.11 $R_\odot$ from the Solar System's barycenter from 1800 to 2050,
1.21 $R_\odot$ on average; Jupiter alone shifts the barycenter by 1.07 $R_\odot$, the largest
single share among the four giant planets (fact-checked many-body calculation,
[Sun](objekt:sun)). Within an orbit, the Newton-based Kepler solver converts
mean into eccentric anomaly; for the largest eccentricity in the catalog, $e = 0.438$ at Eris, it
needs at most five steps, at $e = 0.99$ at most ten. At $e = 0.999$ — well above any value that
occurs in the catalog, but a limiting case suited to testing the solver's robustness — 943 of
200,001 evenly spaced test values of the mean anomaly miss the stopping criterion; 886 of those
keep a residual above $10^{-6}$ rad, and the iterates diverge to the order of $10^{16}$ without
the solver reporting it (own check of the Kepler equation as `src/sim/kepler.ts` solves it). For
the five dwarf planets, including [Pluto](objekt:pluto), Orrery instead uses osculating elements
from the JPL Small-Body Database at their own epoch, with only the mean longitude as a running
rate; against the numerically integrated ephemeris DE441 ([Park et al.
2021](literatur:park-2021)), Pluto's position thereby deviates by 0.05° in 2000, 0.13° in 2050,
0.15° in 1900, and already 1.4° in 1800, mainly because the snapshot counts only the Sun's mass
as the central mass and so carries a mean motion about 0.44 % too slow.

## Moons and dwarf planets

20 of the 21 moon orbits in the catalog are referred to their parent body's equator, with that
body's pole fixed at the epoch as the reference plane; a separately maintained Laplace plane —
the surface on which the secular motion of circular orbits actually vanishes, and which
coincides with the equator near the planet and with the orbital plane far out — is unknown to
Orrery. For most moons the difference is small; for Callisto, JPL's own Laplace plane deviates
0.4° from Jupiter's equator, for Deimos 0.9° from Mars' equator, and for Iapetus the orbit
itself lies 7.6° from the tilted Laplace plane, while Orrery ties it to Saturn's equator instead
of precessing the node about the Laplace pole rather than Saturn's own pole ([Orbital
elements](thema:bahnelemente)). For [Pluto](objekt:pluto) and its moon Charon, the
simplification goes further: the true system barycenter lies about 2126 km — 1.79 Pluto radii —
from Pluto's center, outside Pluto's own surface. Orrery nonetheless keeps Pluto fixed at the
origin of its system and lets Charon visibly orbit Pluto's center rather than this barycenter;
Pluto's own wobble with Charon's orbital period stays invisible, and at a solar distance of
about 39.6 AU its magnitude is in any case less than 0.00004 % of that distance. For the four
remaining dwarf planets — Ceres, [Haumea](objekt:haumea), Makemake and Eris — Orrery, as with
Pluto, uses osculating elements without precession rates; their own moons are entirely missing
from the catalog: Charon is the only moon of any dwarf planet in the dataset at all, while
Dysnomia (Eris), Hi'iaka and Namaka (Haumea), MK 2 (Makemake) and Pluto's four small moons Styx,
Nix, Kerberos and Hydra are absent. More generally, Orrery's moon catalog shows only a small
slice: 21 moons appear in the dataset (Earth 1, Mars 2, Jupiter 4, Saturn 7, Uranus 5, Neptune
1, Pluto 1), against 460 moons of the giant planets, Mars and Pluto combined officially tracked
by the JPL Solar System Dynamics group — as of 23 May 2023, not counting later announcements
([JPL SSD Discovery Circumstances](quelle:jpl-satelliten-entdeckung)); the missing roughly 440
are almost all small, irregularly captured moons below any resolution for which visibility in
the image would be doubtful anyway.

## Rotation and poles

Every rotation pole in the catalog stands as a fixed right ascension and declination, without
precession and without the periodic terms the IAU report adds for some moons ([Archinal et al.
2011](literatur:archinal-2011)); [Miranda and Triton](thema:achsneigung) therefore keep only the
constant part of their officially more complicated pole path. Where no measurement exists at
all, the dataset falls back on a substitute: [Eris'](objekt:eris) pole stands perpendicular to
its own heliocentric orbit, corresponding to an assumed tilt of 0°, while the one actual
measurement — from the orbit of its moon Dysnomia — gives a tilt of about 78.3°; Makemake's pole
is even less constrained, at 46° to 78°. Even where a pole is measured, Orrery does not always
use the officially latest one: the dataset carries the older 2009 IAU pole for Mars
(317.68143°/52.88650°) rather than the pole official since 2015 (317.269°/54.432°), because only
the older value yields the widely cited obliquity of 25.19° — the newer one would give 23.92°; a
methodical difference between the two underlying ephemerides that no single text can resolve.
Finally, for the two outermost giant planets, the rotation period in the dataset still rests on
the Voyager 2 flyby radio measurements from 1986 and 1989, even though far more accurate methods
now exist: for Uranus the catalog holds $-17.24\,\mathrm{h}$, while Hubble images of the aurorae
across 2011 to 2022 give a thousand times more precise
$17.247864 \pm 0.000010\,\mathrm{h}$ ([Lamy et al. 2025](literatur:lamy-2025)) — a difference of
only about 28 s per rotation, which nonetheless accumulates, over the 26.7 years since J2000, to
about six full rotations of drift. For [Neptune](objekt:neptune) the catalog holds
$16.11\,\mathrm{h}$ from the same Voyager 2 measurement; a photometric tracking of stable south
polar features gave $15.9663\,\mathrm{h}$ in 2011, about 8.6 minutes shorter per rotation, which
accumulates to about 131 rotations of drift since J2000 — whether any single period even
describes the fixed rotation of the whole, possibly differentially rotating body remains open.
This simplification affects only which rotation marker on the map points where; the moons'
sidereal orbital period, and thus their orbital motion, is unaffected by it.

## Shape and surface

Every body in the catalog is a sphere with a single radius on screen; `render/bodies.ts` knows
no oblateness. For the giant planets, the radius used is the NSSDC volumetric mean of equatorial
and polar radius, not the actually visible equatorial radius: Saturn's oblateness of 0.09796 is
the largest in the catalog and leaves the model sphere 2036 km below the real equator and
3868 km above the real poles; Jupiter follows with an oblateness of 0.06487, well ahead of
Uranus (0.02293) and Neptune (0.0171). For small bodies the error can exceed that of any planet:
[Haumea's](objekt:haumea) model sphere has a radius of 774.1 km, while its measured semi-axes
sit at about 1061, 844 and 514 km — the sphere underestimates the long axis by about 27 % and
overestimates the short one by about 51 %, the largest shape deviation in the whole catalog. In
addition to shape, the image material itself is unevenly reliable: of the roughly thirty stored
body textures, four — Ceres, Eris, Haumea and Makemake — are explicitly labeled "fictional" by
their source, artistic maps approximated to color and albedo, because no complete mapping exists
for these bodies; Deimos carries no texture at all, only a fallback color (provenance documented
in the licensing appendix). Saturn's ring follows the same logic as the spheres: a single flat
disk aligned to the pole, with one image file for banding and color, without D, F, G or E rings,
without thickness, and without density waves ([Ring systems](thema:ringe)).

## Light and image

Every body except the Sun carries a geometric albedo, mostly from V-band measurements; only the
Sun itself emits its own light, every other body scatters it. The material model scatters
Lambertian times a Fresnel factor $F$ that applies at the half-vector between light and view
direction and therefore grows with phase angle — 0.04 at full phase, 0.13 at 135°, and 0.41 at
160° — plus a small uncolored specular term. A sphere of linear reflectance $p$ therefore
reaches, without specular and fill light, only the geometric albedo $0.640\,p$: the Earth sphere
shows 0.278 and 0.415 instead of the measured 0.434 and 0.293, Enceladus 0.64 instead of the
measured 1.24 ([Albedo and brightness](thema:photometrie)). The night side is never fully black
regardless: a fill light (`nightFill`), a quarter of the day level by default, brightens it with
the same texture but without the scattering factor — a design addition without a physical model,
needed so the hidden side of a body does not vanish without a trace on screen. Orrery draws
shadows only between spheres, with at most four simultaneous occluders (`MAX_OKKLUDER`); where a
system has more candidates than this limit allows, the largest displayed angular radius decides
— for Saturn, Titan, Tethys, Dione and Rhea remain, for Uranus Oberon drops out as the smallest
([Eclipses](thema:finsternis)). Whether a moon can cast a shadow on its planet at all follows
geometrically from $\arcsin(R_\mathrm{p}/a)$ with planet radius $R_\mathrm{p}$ and the moon's
orbital radius $a$, compared against the planet's obliquity; for
the four Galilean moons and Jupiter's obliquity of about 3.1°, that means only Callisto is
sometimes entirely without its own shadow. Overall, the lunar-eclipse search finds 135 of 143
umbral eclipses from 1951 to 2050 against the NASA catalog, with a maximum time offset of 3.0 h
and a root-mean-square of 1.8 h — the cause is the same Kepler ellipse without periodic
perturbations that also simplifies the planetary orbits. The star background, finally, shows
5070 stars from the HYG database as pure point sizes, with no spectrum beyond color-index tinting
and no variable brightness.

## Scale

So that a planet and its orbit fit on screen at the same time, Orrery compresses distances with
a power function fixed at 1 AU:

$$R = A\,\left(\frac{r}{A}\right)^{k}, \quad A = 1\,\mathrm{AU}$$

`SCALE_PRESETS` in `src/sim/scale.ts` stores three fixed settings of size factor, distance
exponent $k$, and an extra damping applied only to the Sun's sphere: "Realistic" ($1\times$,
$k=1.0$, undamped — the identity, true sizes and distances), "Diagram" ($50\times$, $k=0.6$, Sun
damped to 35 %), and "Compact" ($200\times$, $k=0.4$, Sun damped to 20 %). A falling $k$
compresses far distances strongly and distances near 1 AU hardly at all, which is why Earth
stays practically in place while the slider is dragged. The effect shows most clearly at the
farthest planet: Neptune's actual semi-major axis of 30.07 AU appears unchanged under
"Realistic", compressed to about 7.71 AU under "Diagram", and to about 3.90 AU under "Compact"
(own calculation with the formula above). Size ratios, by contrast, grow with the plain size
factor, undamped for every body except the Sun: the real ratio of solar to Earth radius, about
109.2 to 1, shrinks through the extra solar damping to about 38.2 to 1 in the Diagram preset and
to about 21.8 to 1 in the Compact preset (own calculation) — without this targeted damping, the
enlarged Sun would visually swallow the inner planets in either reduced scale. Moons follow a
rule of their own: because their orbital radius around the parent body scales with the same size
factor as the parent's own radius, not with the distance compression of the planetary orbits,
the ratio of planet radius to moon orbit stays exactly correct at every preset — only the whole
moon system travels with its planet.

## Belt

The main and Kuiper belts are, on screen, pure point clouds with fixed orbital elements; only
the mean anomaly advances, and perturbation by the planets is entirely absent ([Formation of the
Solar System](thema:entstehung)). The main belt distributes its semi-major axes in a bell curve
around 2.7 AU (spread 0.35 AU) over the range 2.1 to 3.3 AU, and multiplies this distribution by
five pre-set, Gaussian-shaped dips at the resonances 4:1, 3:1, 5:2, 7:3 and 2:1, whose residual
density at the center comes out to exactly 10 % and whose half-widths lie between 0.0167 AU
(7:3) and 0.0333 AU (2:1) ([Kirkwood gaps](thema:kirkwood-luecken)). The positions themselves
deviate slightly from the rest of the simulation: the belt code fixes Jupiter's semi-major axis
at 5.2044 AU, while [Orbital resonances](thema:resonanzen) uses 5.203 AU — the resulting shift in
gap position lies between 0.0006 and 0.0009 AU, far below any distance resolvable on screen. All
main-belt particles carry a uniform albedo of 0.06, with no distinction between brighter S-type
and darker C-type asteroids; the Kuiper belt mixes 60 % cold classical objects (inclination
spread 3°), 25 % hot ones (12°) and 15 % plutinos, likewise without any physical evolution of
individual orbits over time.

## Open questions

- **Rotation periods of Uranus and Neptune.** For Uranus, any second determination
  independent of radio emission — such as the gravity field and ring seismology that Saturn
  provides — is still missing; whether the period derived from magnetic-field rotation via
  Hubble also matches the rotation of the whole body remains open ([Lamy et al.
  2025](literatur:lamy-2025)). For Neptune, Voyager's radio measurement (16.11 h), a
  photometric determination from south polar features (15.9663 h), and a shape-based estimate
  (about 17.46 h) differ by more than an hour from one another, with none of the three
  established as the rotation of the deep interior.
- **$\Delta T$ for distant centuries.** Eclipse records and stellar occultations document the
  difference between uniform orbital time and Earth's rotation only from 720 BC to 2015
  ([Stephenson et al. 2016](literatur:stephenson-2016)); for Orrery's full time range from
  year 1 to 9999 there is no comparably documented series, and whether the observed increase
  in day length would even stay uniform over such spans is unknown.
- **Haumea's true shape and density.** Depending on the adopted shape determination, the
  derived mean density is about 1859 or about 2050 kg/m³; a homogeneous body does not fit the
  measured shape ([Ortiz et al. 2017](literatur:ortiz-2017)), a differentiated one does
  ([Dunham et al. 2019](literatur:dunham-2019)), and a more recent calculation even predicts,
  for the hydrostatic case, a "pinched" shape departing from any ellipsoid — undercutting
  Orrery's sphere approximation even further — that only a future occultation could decide
  ([Staelen et al. 2026](literatur:staelen-2026)).
- **The next edition of the IAU rotation report.** The 2018 report is itself already a
  snapshot that deliberately leaves individual values (for Uranus and Neptune, for instance) at
  the level of older spacecraft missions, because a formal decision by the responsible working
  group is still pending ([Archinal et al. 2018](literatur:archinal-2018)); Orrery's dataset
  can follow that decision only once it is published.

*As of September 2026*
