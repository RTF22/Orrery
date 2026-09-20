# Mars

Mars, Earth's outer neighbour, is the most thoroughly explored of the rocky planets: since the
1960s, more than a dozen orbiters, landers and rovers have surveyed it, most recently InSight with
the first seismometer outside Earth and the Moon. This text presents its gravity field, interior,
surface, atmosphere and orbit, follows the dispute over the size and state of its core that has been
running since 2023, and finally describes what Orrery models of it. The moons Phobos and Deimos are
only cross-referenced here; they have their own texts.

## Parameters and measurement

Radio tracking of orbiters and landers yields Mars's gravity field and, through the precession of
its rotation axis, the [moment of inertia factor](thema:innerer-aufbau) $C/(M a^2)$. Doppler and
range measurements from the Pathfinder lander, combined with the older Viking landers, gave a 1997
precession of $-7576 \pm 35$ milliarcseconds (mas) per year, pointing to a dense, metallic core; the
same data revealed the seasonal exchange of carbon dioxide between the atmosphere and the ice caps
directly in the rotation itself ([Folkner et al. 1997](literatur:folkner-1997)). A specially
extended stationary period of the Opportunity rover during the 2012 martian winter improved the
value in 2014 to $-7606.1 \pm 3.5\,\mathrm{mas}$ per year
([Kuchynka et al. 2014](literatur:kuchynka-2014)); this rotation model has since formed the basis of
the official IAU recommendation (see "In the model"). The InSight lander's radio science experiment
(RISE) refined the precession in 2023 to $-7598.1 \pm 2.2\,\mathrm{mas}$ per year and, with
$J_2 = 0.0019566$, the normalized polar moment of inertia factor to
$C/(M a^2) = 0.36419 \pm 0.00011$ (reference radius $a = 3396\,\mathrm{km}$; referred to the
mean radius of $3389.5\,\mathrm{km}$, $0.36428 \pm 0.00011$)
([Le Maistre et al. 2023](literatur:le-maistre-2023)). Shape and gravity field deviate from the pure
Radau–Darwin approximation for a hydrostatic body by 3.0 %, explainable by a shell that behaves like
a fluid over the long term but carries embedded mass anomalies
([Le Maistre et al. 2023](literatur:le-maistre-2023)). The same tracking data also showed a slow
acceleration of Mars's rotation, whose cause – internal dynamics or a longer-term trend in the
atmosphere and ice caps – remains open.

For the first time outside Earth, a Chandler wobble was detected in 2020: tracking data from three
orbiters gave a period of $206.9 \pm 0.5$ days with an amplitude of $10\,\mathrm{cm}$ at the
pole; combined with the tidal Love number $k_2 = 0.169 \pm 0.006$, it constrains the rheology of
the mantle, in particular its frequency dependence over long periods
([Konopliv et al. 2020](literatur:konopliv-2020)). The following table summarizes the main
parameters.

| Quantity | Value | Uncertainty | Method | Source |
|---|---|---|---|---|
| Mass | $6.4169 \cdot 10^{23}\,\mathrm{kg}$ | – | Tracking of orbiters and landers | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| $GM$ | $42828\,\mathrm{km^3\,s^{-2}}$ | – | Orbit tracking | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| Equatorial radius | $3396.2\,\mathrm{km}$ | – | Laser altimetry (MOLA) | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| Polar radius | $3376.2\,\mathrm{km}$ | – | Laser altimetry (MOLA) | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| Volumetric mean radius | $3389.5\,\mathrm{km}$ | – | Laser altimetry (MOLA) | [NSSDC Mars Fact Sheet](quelle:nssdc-mars) |
| $J_2$ | $0.0019566$ | – | Orbit tracking (InSight RISE) | [Le Maistre et al. 2023](literatur:le-maistre-2023) |
| $C/(M a^2)$ | $0.36419$ | $0.00011$ | Precession from radio data (InSight, Viking), $J_2$ | [Le Maistre et al. 2023](literatur:le-maistre-2023) |
| Precession rate | $-7598.1$ mas/yr | $2.2$ mas/yr | InSight RISE radio tracking | [Le Maistre et al. 2023](literatur:le-maistre-2023) |
| Chandler period | $206.9$ days | $0.5$ days | Tracking of three orbiters | [Konopliv et al. 2020](literatur:konopliv-2020) |
| $k_2$ | $0.169$ | $0.006$ | Tidal gravity field | [Konopliv et al. 2020](literatur:konopliv-2020) |

Mass and volumetric mean radius give a mean density of $3934\,\mathrm{kg\,m^{-3}}$
([NSSDC Mars Fact Sheet](quelle:nssdc-mars)), well below Earth's ($5513\,\mathrm{kg\,m^{-3}}$) – an
early hint at a smaller core, poorer in heavy elements (see "Interior").

## Interior

Mars's interior has been directly probed seismically since 2021. Eight weak marsquakes, analysed
using direct and multiply reflected wave phases, gave a crust 24 to 72 km thick over an unusually
thick thermal lithosphere near 500 km depth and a liquid core of about 1830 km radius
([Stähler et al. 2021](literatur:staehler-2021)). A companion analysis of the upper mantle found a
low-velocity zone beneath it, consistent with a thermal boundary layer markedly thicker than Earth's
([Khan et al. 2021](literatur:khan-2021)), while a third study confined the crustal thickness to the
same 24 to 72 km range and likewise inferred a slow layer beneath the lithosphere
([Knapmeyer-Endrun et al. 2021](literatur:knapmeyer-endrun-2021)).

InSight's radio science (RISE) also detected a resonance between the forced nutation and the free
core nutation, whose amplification ($0.0615 \pm 0.007$) depends mainly on the core radius and
whose period ($-243 \pm 3.3$ days) mainly on its shape: for an entirely solid mantle, the liquid
core has a radius of $1835 \pm 55\,\mathrm{km}$ and a mean density of $5955$ to
$6290\,\mathrm{kg\,m^{-3}}$, with a density jump at the core–mantle boundary of $1690$ to
$2110\,\mathrm{kg\,m^{-3}}$; the nutation data argue against a solid inner core
([Le Maistre et al. 2023](literatur:le-maistre-2023)).

Since 2023 it has been disputed whether a molten silicate layer sits above this core in its own
right. Phases multiply diffracted at the core–mantle boundary give a smaller, denser core of
$1675 \pm 30\,\mathrm{km}$ beneath a $150 \pm 15\,\mathrm{km}$ thick molten layer, with a core
composition of 85 to 91 weight percent iron–nickel and 9 to 15 weight percent light elements, chiefly
sulfur, carbon, oxygen and hydrogen ([Khan et al. 2023](literatur:khan-2023)). An independent
analysis that also incorporates tidal dissipation through [Phobos](objekt:phobos) arrives, with a
layered mantle, at a core of about $1650\,\mathrm{km}$ at $6.5\,\mathrm{g\,cm^{-3}}$
([Samuel et al. 2023](literatur:samuel-2023)); both models reduce the amount of light elements
previously required in the core, which had been difficult to reconcile with petrology. In 2025, Bi
et al. found, in phases that cross the core or are reflected at its centre (PKKP, PKiKP), a
compressional-wave-speed jump of about 30 % and inferred a solid inner core of
$613 \pm 67\,\mathrm{km}$ radius – a result that contradicts the absence of an inner core inferred
from nutation (see "Open questions") and points to crystallization enriching light elements at the
centre, with a possible link to the planet's extinct magnetic field
([Bi et al. 2025](literatur:bi-2025)).

## Surface

Mars's most striking global feature is the dichotomy between the old, densely cratered southern
highlands and the younger, smoother northern lowlands: altimetry from the Mars Orbiter Laser
Altimeter (MOLA), with a radial accuracy of about one metre relative to the centre of mass and a
global grid of 1/64° by 1/32° in latitude and longitude
([Smith et al. 2001](literatur:smith-2001)), shows the lowlands lying several kilometres lower on
average, with a markedly thinner crust beneath them (see "Interior"); whether a single giant impact
or internal mantle convection is the cause remains unresolved (see "Open questions"). In the Tharsis
volcanic province, Olympus Mons, with a base about 600 km across and a height of roughly 22 km,
towers as the largest known volcano in the Solar System; to its east, the more than 4000 km long
Valles Marineris canyon system stretches across a good sixth of Mars's circumference
([Mars at NASA Science](quelle:nasa-mars)).

Orbital infrared spectroscopy and in-situ exploration by rovers show a basaltic upper crust with
regionally varying proportions of plagioclase, pyroxene and olivine. Clay minerals in widespread
exposures of the oldest, Noachian crust record early weathering as well as hydrothermal and
diagenetic aqueous environments; younger Noachian and Hesperian sediments also contain palaeolake
deposits with clays, carbonates, sulfates and chlorides
([Ehlmann and Edwards 2014](literatur:ehlmann-2014)) – evidence for past liquid water that, together
with incised valley networks, shapes the climate debate (see "Formation and evolution"). The polar
caps consist of a permanent water-ice base beneath a seasonally growing and shrinking layer of
carbon dioxide, whose condensation and sublimation govern the global surface pressure (see
"Atmosphere and magnetosphere"); regional and, occasionally, global dust storms are likewise part of
present-day surface activity ([Mars Express (ESA)](quelle:esa-mars-express)).

## Atmosphere and magnetosphere

The thin atmosphere is 95.1 % carbon dioxide, with 2.59 % nitrogen, 1.94 % argon, 0.16 % oxygen and
0.06 % carbon monoxide; the mean surface pressure is 6.36 mbar and varies seasonally between 4.0 and
8.7 mbar, because carbon dioxide freezes out at one polar cap while it sublimates at the other
([NSSDC Mars Fact Sheet](quelle:nssdc-mars); for the coupling to rotation, see "Parameters and
measurement"). The MAVEN spacecraft measured, over a full Mars year, combined hydrogen and oxygen
loss rates to space of roughly 2 to 3 kg/s; extrapolated to the far stronger ultraviolet and
particle radiation of the young [Sun](objekt:sun), the integrated loss could amount to as much as
0.8 bar of carbon dioxide or a globally 23 m thick layer of water
([Jakosky et al. 2018](literatur:jakosky-2018)) – a key ingredient in explaining how a once denser
atmosphere became today's thin one (see "Formation and evolution").

Unlike [Earth](objekt:earth), Mars has no global, core-generated magnetic field. The magnetometer
aboard Mars Global Surveyor did, however, find strongly magnetized crustal stripes that correlate
with the old, cratered highlands; crustal magnetization is entirely absent around the large impact
basins Hellas and Argyre, pointing to the internal dynamo having shut down as early as the early
Noachian, around 4 billion years ago
([Acuña et al. 1999](literatur:acuna-1999)). The remaining, localized magnetic fields form small,
crust-bound "mini-magnetospheres", without the global shielding of a dipole field such as Earth's.

## Orbit, rotation and dynamics

Mars orbits the Sun in 686.98 days on a noticeably eccentric orbit with $e = 0.0934$
([Orbital elements](thema:bahnelemente)); the distance from the Sun therefore varies by about 21 %
between perihelion and aphelion, making the southern hemisphere's seasons sharper than the
northern hemisphere's. The sidereal rotation period is $24.6229\,\mathrm{h}$; because Mars also
advances by about $1/687$ of a revolution during one orbit, a solar day (sol) lasts
$24\,\mathrm{h}\,39\,\mathrm{min}\,35\,\mathrm{s}$, nearly 40 minutes longer.

The present-day obliquity of $25.19^\circ$ resembles Earth's and produces comparable seasons, but,
unlike Earth's axis, it is not stabilized by a large moon: an orbit can still be given for periods of
a few tens of millions of years, but beyond that the system becomes chaotic. A statistical study of
more than 600 orbital and over 200,000 obliquity solutions across 5 billion years gives a mean
obliquity of $37.62^\circ \pm 13.82^\circ$ with peak values up to $82.035^\circ$
([Laskar et al. 2004a](literatur:laskar-2004a)) – today's comparatively moderate tilt is thus only a
snapshot of an axis that tumbles far more strongly on average (see [Obliquity](thema:achsneigung)).
As the tilt changes, so does, over the long term, how much sunlight the poles receive relative to
the equator, with direct consequences for the stability of the polar caps and hence the atmospheric
pressure.

The precession of the rotation axis described above and the free Chandler wobble (see the
[moment of inertia factor](thema:innerer-aufbau)) proceed independently of this long-term, chaotic
change in obliquity: the former is a forced, periodic motion of the pole in space, the latter a free
oscillation of the pole within the body itself. Both martian moons,
[Phobos](objekt:phobos) and [Deimos](objekt:deimos), take part in this dynamics only as very small
perturbing bodies; their own, unusual orbits – Phobos closer to its planet than any other known
major moon, Deimos near the synchronous orbit – have their own texts.

## Formation and evolution

Hafnium–tungsten chronology shows that Mars grew unusually fast: it reached about half its present
mass within at most two million years of the formation of the oldest calcium–aluminium-rich
inclusions, before the gas of the protoplanetary disk had dissipated and while the roughly 100 km
parent bodies of the chondrites were still forming
([Dauphas and Pourmand 2011](literatur:dauphas-2011)). This rapid growth suggests that Mars, unlike
Earth and Venus, is a "stranded" planetary embryo that never merged with a comparably large body – a
possible reason for its comparatively low mass.

Two models compete over how the inner Solar System, forming out of the
[protoplanetary solar nebula](thema:entstehung), produced this low mass. In the "Grand Tack"
scenario, Jupiter first migrated inward to 1.5 AU and then back outward, truncating the terrestrial
planets' planetesimal disk at 1 AU; the rocky planets then formed over the following 30 to 50
million years from this smaller disk, with an Earth/Mars mass ratio matching observations
([Walsh et al. 2011](literatur:walsh-2011)). Alternatively, 800 dynamical simulations show that an
instability of the outer planets setting in only 1 to 10 million years after the gas disk dispersed
(related to the "Nice model") regularly scatters large protoplanets out of the Mars region, while
Mars itself is left behind as a stranded embryo
([Clement et al. 2018](literatur:clement-2018)). Isotopically, Mars, like [Earth](objekt:earth),
sits mostly in the "non-carbonaceous" reservoir of the early Solar System; based on chromium,
titanium and nickel isotope anomalies, the proportion of carbonaceous, water-richer material is
about 9 % for Mars, versus about 24 % for Earth ([Warren 2011](literatur:warren-2011)) – a hint that
both planets formed from overlapping but not identical grain populations of the disk.

Whether early Mars had a warm, wet climate or was mostly cold and icy is one of the central open
questions of Mars research (see below): geological evidence points to an episodically warm state
during the late Noachian and early Hesperian, 3 to 4 billion years ago, while the low solar flux of
the time and the limited greenhouse effect of carbon dioxide favour an on-average cold state,
punctuated by brief warm episodes, likely driven by impacts or volcanism, that melted water and ice
deposits and carved the observed valley networks
([Wordsworth 2016](literatur:wordsworth-2016)). Since then, Mars has lost most of its atmosphere
(see "Atmosphere and magnetosphere").

## Open questions

- **Early climate:** Whether an on-average warm and wet climate, or a mostly cold and icy one with
  brief warm episodes, better explains the Noachian and early Hesperian evidence for water remains
  unresolved; both positions draw on the same geological and climate-modelling evidence
  ([Wordsworth 2016](literatur:wordsworth-2016); evidence for past liquid water in
  [Ehlmann and Edwards 2014](literatur:ehlmann-2014)).
- **Cause of the dichotomy:** Numerical impact simulations show that a single giant impact near the
  north pole can explain the elliptical Borealis lowland and hence the thinner crust of the
  lowlands ([Andrews-Hanna et al. 2008](literatur:andrews-hanna-2008)); degree-1 mantle convection,
  triggered by an early weak asthenosphere, predicts the same one-sided heating and crustal thinning
  with no impact at all ([Zhong and Zuber 2001](literatur:zhong-2001)); gravity and topography alone
  are not yet enough to decide between the two.
- **State of the core and the basal layer:** Nutation data argue against a solid inner core and for
  a homogeneous liquid core of 1830 to 1835 km radius
  ([Le Maistre et al. 2023](literatur:le-maistre-2023);
  [Stähler et al. 2021](literatur:staehler-2021)); two seismic analyses from 2023 instead require an
  additional molten silicate layer and hence a smaller, denser core of 1650 to 1675 km
  ([Khan et al. 2023](literatur:khan-2023); [Samuel et al. 2023](literatur:samuel-2023)); a renewed
  seismic analysis in 2025 in turn finds evidence for a solid inner core of
  $613 \pm 67\,\mathrm{km}$, contradicting the absence of an inner core inferred from nutation
  ([Bi et al. 2025](literatur:bi-2025)) – which model is correct remains open.
- **Methane:** Since 2012, the Curiosity rover has repeatedly measured methane in Gale crater with
  its SAM instrument, with a seasonally varying background around 0.4 ppbv and individual spikes
  above 20 ppbv ([Webster et al. 2018](literatur:webster-2018)); the European–Russian ExoMars Trace
  Gas Orbiter, by contrast, found no methane at all during its first months of observation, with
  instruments roughly a thousand times more sensitive, down to a detection limit of 0.05 ppbv
  ([The ACS and NOMAD Science Teams, Korablev et al. 2019](literatur:korablev-2019)); whether measurement error, local release near
  Gale, or a still poorly understood fast removal mechanism explains the discrepancy remains
  unresolved.

## In the model

- **Orbit:** The elements come from the JPL approximate-position table for 1800 to 2050, linearly
  propagated against the fixed J2000 ecliptic ([Orbital elements](thema:bahnelemente); on the
  reference frame, see [Reference frames](thema:bezugssysteme)).
- **Rotation:** The rotation period `rotationPeriodH` of $24.6229\,\mathrm{h}$ matches the NSSDC
  fact sheet exactly. The official IAU rotation rate ($350.891982^\circ$ per day, from the rotation
  model of [Kuchynka et al. 2014](literatur:kuchynka-2014)) corresponds to a period of
  $24.622962\,\mathrm{h}$, only 0.22 seconds more than the dataset. From the model's rotation and
  orbital periods follows a solar day of $24.6597\,\mathrm{h} = 24\,\mathrm{h}\,39\,\mathrm{min}\,
  35\,\mathrm{s}$ – exactly the known value.
- **Pole and obliquity:** The comment in `mars.ts` deliberately picks the older pole from the 2009
  IAU report ($317.68143^\circ$/$52.88650^\circ$,
  [Archinal et al. 2011](literatur:archinal-2011)) instead of the pole
  $317.269^\circ$/$54.432^\circ$ that has been official since the 2015 IAU report
  ([Archinal et al. 2018](literatur:archinal-2018), built on the rotation model of
  [Kuchynka et al. 2014](literatur:kuchynka-2014)), on the grounds that the older pole exactly
  matches the widely quoted obliquity of $25.19^\circ$, whereas the newer one gives $23.92^\circ$.
  Recomputing with `achsneigungDeg` confirms both figures in the comment to the fourth decimal place
  ($25.1918^\circ$ and $23.9165^\circ$ respectively) – the comment describes the actual state of
  the code accurately. The dataset thus **deliberately departs from the currently valid IAU
  recommendation**: Archinal et al. 2018 revise Mars's pole and prime meridian precisely because the
  older model no longer matched the state of orbit tracking. Which of the two values should count as
  "correct" for the obliquity also depends on which orbital normal one compares against: the one
  used here comes from the approximate-position table fitted to 1800–2050, not from the high-accuracy
  ephemeris used by Kuchynka et al. – a methodological difference this text cannot resolve. The data
  panel rounds the obliquity to one decimal place and therefore shows $25.2^\circ$ instead of
  $25.19^\circ$. `rotationAtEpochDeg` is set to 0; the 2015 IAU report gives $W_0 = 176.049863^\circ$
  for the rotation phase at J2000.0 – Mars's map zero meridian in the model therefore does not sit
  where the IAU report puts it, which affects only the map's orientation, not its motion.
- **Albedo:** The catalogue value 0.170 is the geometric albedo and matches the V-band value from
  [Mallama et al. 2017](literatur:mallama-2017), as documented for all planets in
  [Albedo and brightness](thema:photometrie). Under the scattering model derived there, a sphere of
  this albedo appears, at full phase without night-side fill light, at
  $0.640 \cdot 0.170 = 0.109$, and with fill light at $0.890 \cdot 0.170 = 0.151$ – pure
  image values before the tone curve, not an albedo. The texture (Solar System Scope, CC BY 4.0, see
  ASSETS.md) is a static colour map without seasonal polar caps, clouds or dust storms; Orrery does
  not render an atmosphere at all.
- **Data panel:** The model's $GM$, from CODATA $G$ times the catalogue mass, gives
  $42828.3\,\mathrm{km^3\,s^{-2}}$, about 7 ppm above the NSSDC value. The orbital period
  computed from the catalogue mass and semi-major axis via Kepler's third law comes to 686.98 days,
  practically identical to the fact-sheet value. As derived for the whole dataset in
  [Interior structure](thema:innerer-aufbau), the catalogue mass is 34 ppm below the value used by
  [Le Maistre et al. 2023](literatur:le-maistre-2023).
- The orbits of [Phobos](objekt:phobos) and [Deimos](objekt:deimos) are referred to the martian
  equatorial plane (`frame: 'parentEquator'`, pole from this dataset); details, and the close-up
  scene [Low pass over Phobos](szene:phobos-tiefflug), are in their own texts. Further
  simplifications: [Limits of the model](thema:modell).

*As of September 2026*
