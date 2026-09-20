# Mercury

Mercury is the closest planet to the Sun, the smallest planet, and, after Earth, the second
densest. Its parameters come almost entirely from two spacecraft: radar measurements and the
flyby probe Mariner 10 in the 1970s, and since 2011 the orbiter mission MESSENGER. This text
presents Mercury's interior, surface, magnetosphere and orbit, introduces the relativistic
perihelion precession as one of the early tests of general relativity, and finally describes what
Orrery reproduces of it.

## Parameters and measurement

Radio tracking of the MESSENGER spacecraft provided the first high-resolution gravity field: the
northern hemisphere shows gravity anomalies above 100 mgal, including possible mass concentrations,
and the crust is thicker at low latitudes than at the poles
([Smith et al. 2012](literatur:smith-2012)). Combining the gravity field with the observed spin
gives the [moment of inertia factor](thema:innerer-aufbau) $C/(MR^2)$ and the fraction
$C_\mathrm{m}/C$ contributed by the librating outer shell; it has decreased with every refinement
of the radar measurement: Smith et al., using the older ground-based radar solution, found
$C/(MR^2) = 0.353 \pm 0.017$ and $C_\mathrm{m}/C = 0.452 \pm 0.035$, a new radar campaign from 2002
to 2012 gave $0.346 \pm 0.014$ and $0.431 \pm 0.025$
([Margot et al. 2012](literatur:margot-2012)), and MESSENGER's own orbit and spin, determined
geodetically rather than by radar, give $0.333 \pm 0.005$ at three standard deviations
([Genova et al. 2019](literatur:genova-2019)). The same radar campaign measured the tilt of the
spin axis as $2.04 \pm 0.08$ arc minutes and the solar-forced [libration](thema:gebundene-rotation)
in longitude as $38.5 \pm 1.6$ arc seconds over the 88-day orbital period
([Margot et al. 2012](literatur:margot-2012)); an earlier radar analysis had already found
$2.11 \pm 0.1$ arc minutes and $35.8 \pm 2$ arc seconds and concluded that the mantle is decoupled
from a core that is at least partially molten ([Margot et al. 2007](literatur:margot-2007)). Laser
altimeter profiles from three years of MESSENGER gave $38.9 \pm 1.3$ arc seconds of libration and
$2.029 \pm 0.085$ arc minutes of obliquity, together with a rotation rate of
$(6.13851804 \pm 9.4\cdot 10^{-7})^\circ$ per day, noticeably above the pure resonant rate
([Stark et al. 2015](literatur:stark-2015)).

From the gravity field and spin, Hauck et al. modelled the radius of the boundary to the liquid
core as $2020 \pm 30\,\mathrm{km}$, with a mean density of $3380 \pm 200\,\mathrm{kg\,m^{-3}}$
above it and $6980 \pm 280\,\mathrm{kg\,m^{-3}}$ below it; an iron-sulfide-rich layer at the top of
the core, part of which may already be solid, is consistent with these values
([Hauck et al. 2013](literatur:hauck-2013)). Genova et al.'s geodetic analysis goes further: their
refined moment of inertia factor requires a solid inner core with a radius between 0.3 and 0.7 of
the outer core radius ([Genova et al. 2019](literatur:genova-2019)). The table below summarises
the main parameters.

| Quantity | Value | Uncertainty | Determination | Reference |
|---|---|---|---|---|
| Mass | $3.3010 \cdot 10^{23}\,\mathrm{kg}$ | – | MESSENGER orbit tracking | [NSSDC Mercury Fact Sheet](quelle:nssdc-mercury) |
| $GM$ | $22032\,\mathrm{km^3\,s^{-2}}$ | – | MESSENGER orbit tracking | [NSSDC Mercury Fact Sheet](quelle:nssdc-mercury) |
| Volumetric mean radius | $2439.7\,\mathrm{km}$ | – | laser altimetry and stereo imaging | [NSSDC Mercury Fact Sheet](quelle:nssdc-mercury) |
| $C/(MR^2)$ | $0.333$ | $0.005$ (3σ) | gravity field plus MESSENGER spin, geodetic | [Genova et al. 2019](literatur:genova-2019) |
| $C_\mathrm{m}/C$ | $0.431$ | $0.025$ | gravity field plus radar libration | [Margot et al. 2012](literatur:margot-2012) |
| Core–mantle boundary | $2020\,\mathrm{km}$ | $30\,\mathrm{km}$ | Monte Carlo density profiles | [Hauck et al. 2013](literatur:hauck-2013) |
| Obliquity of the spin axis (arc minutes) | $2.029$ | $0.085$ | laser-altimeter libration | [Stark et al. 2015](literatur:stark-2015) |

From mass and volumetric mean radius follows a mean density of $5427\,\mathrm{kg\,m^{-3}}$, the
second highest in the Solar System after [Earth](objekt:earth), even though the low pressure inside
Mercury's small body compresses the material only a little further.

## Interior

Mercury's high density reflects an unusually large iron core: it extends to nearly
$2020\,\mathrm{km}$ in radius, while the whole body measures only $2439.7\,\mathrm{km}$
([Hauck et al. 2013](literatur:hauck-2013)) – about 57 % of the volume. Combined with the mean
densities above and below that boundary from the same model (parameters table), this gives a core
mass fraction of about 73 %; the mean density predicted this way, $5424\,\mathrm{kg\,m^{-3}}$,
matches the mean density computed from mass and radius, $5427\,\mathrm{kg\,m^{-3}}$ (see above), to
within $0.06$ %. The outer core is at least partially liquid, as shown by the large libration in
longitude (see above); the geodetically refined gravity and spin data further require a solid inner
core, though its radius is only constrained to between 0.3 and 0.7 of the outer core radius
([Genova et al. 2019](literatur:genova-2019)). Only a thin silicate mantle lies between core and
crust; a model consistent with the MESSENGER data also includes a solid, iron-sulfide-rich layer at
the top of the core ([Smith et al. 2012](literatur:smith-2012);
[Hauck et al. 2013](literatur:hauck-2013)). The surface abundances of potassium, thorium and
uranium (see below) further require that the mantle is not depleted in moderately volatile
elements relative to other rocky planets, even though the planet as a whole is so iron-rich
([Peplowski et al. 2011](literatur:peplowski-2011)) – a finding that constrains the formation
models (see "Formation and evolution").

## Surface

At first glance, Mercury's surface resembles that of the [Moon](objekt:moon): cratered terrain,
extensive plains and, as a distinctive element, long, curving scarps. These so-called lobate
scarps are thrust faults that formed as the cooling planet contracted globally. A survey of more
than 5,900 such landforms in MESSENGER images found a radial contraction of up to
$7\,\mathrm{km}$, far more than the $0.8$ to $3\,\mathrm{km}$ suggested by earlier estimates based
on only a few surface images ([Byrne et al. 2014](literatur:byrne-2014)); this resolution of a
long-standing discrepancy between observation and thermal evolution models is revisited below.
Another landform discovered only with MESSENGER is hollows: shallow, rimless depressions, often
surrounded by bright ejecta, in crater walls and floors that look fresh and probably form through
ongoing loss of volatiles – by sublimation, space weathering, outgassing or pyroclastic activity
([Blewett et al. 2011](literatur:blewett-2011)); their age is not determined (see "Open
questions").

Despite equatorial temperatures up to 430 °C, permanently shadowed polar craters stay cold enough
for water ice. Radar-bright patches in such craters had long been suspected as ice; MESSENGER's
neutron spectrometer confirmed it: the hydrogen flux over the north polar craters decreases as
expected for an on average more than ten-centimetre-thick, hydrogen-rich layer beneath a thinner,
10 to 30 cm, less hydrogen-rich surface layer; combined with the radar data, nearly pure water ice
fits best. The estimated total water mass of $2\cdot 10^{16}$ to $10^{18}\,\mathrm{g}$ is
consistent with delivery by comets or volatile-rich asteroids
([Lawrence et al. 2013](literatur:lawrence-2013)) – where the ice actually came from remains open.

The gamma-ray spectrometer measured the surface abundances of the radioactive elements potassium
($1150 \pm 220$ ppm), thorium ($220 \pm 60$ ppb) and uranium ($90 \pm 20$ ppb); the ratio of the
moderately volatile potassium to the refractory thorium and uranium is inconsistent with formation
models that require extreme heating of the planet or its precursor material, and instead supports
formation from volatile-bearing, chondrite-like material
([Peplowski et al. 2011](literatur:peplowski-2011)). The same data show that internal heat
production has declined substantially since formation, consistent with widespread volcanism
shortly after the end of the Late Heavy Bombardment 3.8 billion years ago and only isolated
activity since ([Peplowski et al. 2011](literatur:peplowski-2011)).

## Atmosphere and magnetosphere

Mercury has no bound atmosphere but an exosphere: individual atoms move on ballistic paths between
collisions with the surface, without colliding with each other as a gas would. Observed species
include sodium, potassium and calcium; they are continuously resupplied from the surface by
photon-stimulated desorption as well as thermal and impact vaporisation, and lost again just as
quickly ([Killen et al. 2007](literatur:killen-2007)).

Despite its small size, Mercury carries a global, dipole-like magnetic field – besides Earth's, the
only one among the terrestrial planets. MESSENGER's orbital magnetometry shows a dipole axis tilted
by less than 0.8° from the rotation axis but offset northward by about 480 km, roughly one-fifth of
the body's radius ([Anderson et al. 2012](literatur:anderson-2012)); this offset noticeably shrinks
the magnetosphere over the south pole relative to the north. The magnetopause averaged from
magnetometer data has a subsolar standoff distance of 1.45 body radii, the bow shock on average
1.96 body radii at a typical Alfvén Mach number of 6.6
([Winslow et al. 2013](literatur:winslow-2013)) – a magnetosphere very small compared with Earth's
(about ten Earth radii), which offers little resistance to the strong, variable wind of the
[Sun](objekt:sun) so close to it.

## Orbit, rotation and dynamics

With $e = 0.206$, Mercury's orbit is the most eccentric of all the planets, and with
$i = 7.00^\circ$ relative to the J2000 ecliptic it is also the most inclined. Already in the 19th
century, Le Verrier noticed that Mercury's perihelion advances faster than the attraction of the
other planets alone can explain; this discrepancy became one of the first quantitative tests of
general relativity. Park et al. determined the total perihelion precession from MESSENGER range
measurements as $575.3100 \pm 0.0015$ arc seconds per century and, combined with the Shapiro delay
from the Cassini mission, the post-Newtonian parameter $\beta = 1.000 \pm 0.001$ and the Sun's
oblateness $J_{2,\odot} = (2.25 \pm 0.09)\cdot 10^{-7}$
([Park et al. 2017](literatur:park-2017)). A purely Newtonian numerical calculation with nine
planets and no relativistic terms converges, for time spans around 1000 years, to $532.1$ arc
seconds per century ([Pogossian 2022](literatur:pogossian-2022)); the difference from the observed
total precession is of the same order as the relativistic prediction known since 1915, about 43
arc seconds per century, one of the post-Newtonian tests of relativity that have since been
confirmed with high precision ([Will 2014](literatur:will-2014)).

Mercury is in a 3:2 [spin–orbit resonance](thema:gebundene-rotation), one of several ways in which
orbital and rotation periods can couple in the Solar System
([orbital resonances](thema:resonanzen)): it rotates three times on its axis while orbiting the Sun twice –
unlike, for instance, the only nearly resonant synodic rotation of [Venus](objekt:venus) relative
to Earth. How a body ends up in such a coupling at all, rather than becoming synchronous like most
moons, is explained in detail in the linked text; here only this much: Mercury's eccentricity can
reach values above 0.325 through chaotic interaction with the other planets, which makes capture
into the 3:2 resonance very likely, whereas earlier calculations with a purely regular orbit gave a
capture probability of only about 7 %
([Correia and Laskar 2004](literatur:correia-2004)). The long solar day follows directly from the
3:2 coupling: the angle to the Sun grows only by the difference between one-and-a-half and one
orbital angular velocities, that is once every two orbits, so a solar day – from noon to noon –
lasts about $2\times 87.97\,\mathrm{d} \approx 176$ days.

Because the eccentric orbit stays fixed relative to the ecliptic according to its
[orbital elements](thema:bahnelemente), while the rotation axis stays nearly fixed in space, a
so-called Cassini state develops over long time scales: the pole, the orbit normal and the orbit's
precession axis remain coplanar, and the small but measurable tilt of the spin axis (about two arc
minutes, see above) is a direct consequence of this equilibrium, not a leftover from formation.
Because of its orbital geometry, Mercury crosses in front of the solar disk as seen from Earth only
during the rare passages through the ecliptic plane near inferior conjunction; like
[eclipses](thema:finsternis), such transits are tied to a shared plane of three bodies and occur on
average about 13 times per century, mostly in May or November.

## Formation and evolution

Mercury formed about 4.567 billion years ago together with the other planets from the
[protoplanetary solar nebula](thema:entstehung), yet with an iron core making up about 73 % of its
mass (see "Interior"), it stands out sharply among the terrestrial planets – far more than simple
condensation models of the solar nebula predict for its distance. Three explanations compete: one
or more giant impacts could have stripped away most of the original silicate mantle of a
more massive proto-Mercury; intense heating near the young Sun could have vaporised part of the
mantle and carried the gas away; or a condensation front in the solar nebula could have separated
iron and silicate grains spatially before Mercury formed from predominantly iron-rich material.
None of these models so far explains all the observations, and gaps in the understanding of the
innermost solar-nebula region limit how well the hypotheses can currently be tested
([Ebel and Stewart 2018](literatur:ebel-2018)). Arguing against very intense heating is the
chondrite-like abundance of moderately volatile potassium mentioned above, surprising for such an
iron-rich body ([Peplowski et al. 2011](literatur:peplowski-2011)); newer giant-impact simulations
covering single impacts, hit-and-run collisions and series of multiple collisions further show
that an efficient single impact would have to be head-on and at high velocity, and that the
impactor's composition can shift the iron distribution in the final body by up to 25 % without
strongly changing the mean iron fraction ([Chau et al. 2018](literatur:chau-2018)).

After its formation, Mercury's interior cooled and the whole body contracted; the resulting lobate
scarps (see "Surface") show a contraction of up to 7 km, considerably larger than earlier estimates
suggested, and fit better with thermal evolution models of the large iron core
([Byrne et al. 2014](literatur:byrne-2014)). The European–Japanese mission BepiColombo, under way
since 2018, aims to survey Mercury's interior, surface, exosphere and magnetosphere more
comprehensively than MESSENGER, using radio science to test general relativity once more as well
([Benkhoff et al. 2021](literatur:benkhoff-2021)).

## Open questions

- **Cause of the high iron fraction:** giant impact, evaporation and condensation front each fail
  on their own to explain all observations; which combination applies is undecided
  ([Ebel and Stewart 2018](literatur:ebel-2018); [Chau et al. 2018](literatur:chau-2018)).
- **Origin of the polar ice:** the estimated water mass is consistent with delivery by either
  comets or volatile-rich asteroids; which source dominates is open
  ([Lawrence et al. 2013](literatur:lawrence-2013)).
- **Size of the solid inner core:** the geodetic data only bound its radius to between 0.3 and 0.7
  of the outer core radius, without a tighter value ([Genova et al. 2019](literatur:genova-2019)).
- **Age of the hollows:** their fresh appearance suggests geologically young, perhaps still
  ongoing activity; a numerical age is still missing
  ([Blewett et al. 2011](literatur:blewett-2011)).

## In the model

- **Orbit:** the elements come from JPL's approximate table for 1800 to 2050, advanced linearly
  relative to the fixed J2000 ecliptic ([orbital elements](thema:bahnelemente); on the reference
  frame, see [Reference systems](thema:bezugssysteme)). The data set's rate `lpDot`,
  $0.16047689^\circ$ per century, corresponds to
  $0.16047689 \cdot 3600 = 577.716804$ arc seconds per century relative to this fixed frame – so
  the data set contains the **observed total precession**, not only the Newtonian contribution
  from planetary perturbations. It lies 2.41 arc seconds per century (0.4 %) above the measured
  total from Park et al. (see above); the approximate table is a linear fit for 1800 to 2050 and
  not a high-precision ephemeris, so a small deviation of this size is to be expected.
- **Rotation:** the rotation period `rotationPeriodH` of $1407.6\,\mathrm{h} = 58.65$ days is the
  rounded fact-sheet mean. Two-thirds of the data set's own sidereal orbital period would be
  $58.6461709$ days; the rotation therefore falls behind the exact 3:2 coupling by 14.6° per
  century, and against the measured $58.6460768$ days
  ([Stark et al. 2015](literatur:stark-2015)) the model period is 339 seconds too long
  ([Tidal locking](thema:gebundene-rotation) gives the same figures). The data set has no
  libration in longitude: the rotation phase grows uniformly about a fixed pole, with no periodic
  terms added.
- **Pole and obliquity:** the data set's pole (right ascension 281.0103°, declination 61.4155°)
  matches the IAU report ([Archinal et al. 2018](literatur:archinal-2018)) and differs from the
  newer geodetic solution (281.0082° ± 0.0009°, 61.4164° ± 0.0003°,
  [Genova et al. 2019](literatur:genova-2019)) by only a few arc seconds. The obliquity computed
  from pole and orbit normal is 0.034° in the model and thus matches the measured
  $2.029 \pm 0.085$ arc minutes: the IAU pole already carries the Cassini configuration within it,
  without the model reproducing it separately; the data block rounds the value to one decimal and
  therefore shows 0.0°. `rotationAtEpochDeg` is set to 0, while the IAU report gives
  $W_0 = 329.5469^\circ$ for the rotation phase at J2000.0 – Mercury's map centre in the model is
  therefore not where the IAU report places it, which affects only the orientation of the map
  image, not the motion itself.
- **Albedo:** the catalogue value 0.142 is the geometric albedo and matches the V-band value from
  [Mallama et al. 2017](literatur:mallama-2017), as shown for all planets in
  [Albedo and brightness](thema:photometrie). Using the scattering model derived there (Lambertian
  sphere times Fresnel factor, material roughness 1), a sphere of this albedo appears in the image
  at full phase without night-side fill as $0.640 \cdot 0.142 = 0.091$, with fill as
  $0.890 \cdot 0.142 = 0.126$ – neither of these numbers is itself an albedo; both are plain image
  values before the tone curve.
- **Data block:** mass and volumetric mean radius match the NSSDC fact sheet
  ([NSSDC Mercury Fact Sheet](quelle:nssdc-mercury)); the slightly larger equatorial radius of the
  triaxial shape (2440.5 km) is not used, since Orrery renders every body as a sphere. The model's
  $GM$, from CODATA $G$ times the catalogue mass, gives $22033.2\,\mathrm{km^3\,s^{-2}}$, only
  0.005 % above the measured $22032\,\mathrm{km^3\,s^{-2}}$.
- **Scale:** as for every body, the displayed radius grows linearly with the `sizeScale` control;
  the heliocentric distance is additionally compressed with the distance exponent, with a fixed
  point at 1 au. Since Mercury's true distance of about 0.39 au lies inside this fixed point, its
  orbit moves relatively closer to Earth's as the exponent decreases, while its radius, like that
  of every body, scales only with `sizeScale`.
- Close-up views of the inner orbit are shown in
  [Mercury on the inner orbit](szene:merkurjagd); further simplifications:
  [Limits of the model](thema:modell).

*As of September 2026*
