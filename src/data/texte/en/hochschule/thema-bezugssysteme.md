# Reference systems and time scales

A position in the Solar System needs an origin, three axis directions and a time scale in which
its epoch holds. Astronomy distinguishes the reference system, a definition, from its
realisation, a frame of measured coordinates
([Petit and Luzum 2010](literatur:petit-2010), chapter 2). This text leads from the quasar frame
via the ecliptic, precession and rotation models to the time scales and ephemerides, and places
what Orrery uses among them.

## The ICRS and its realisations

The International Celestial Reference System (ICRS) is defined kinematically: its axes are meant
to be fixed with respect to the distant matter of the universe. The origin lies at the barycentre
of the Solar System, the fundamental plane close to the mean equator of J2000.0 and the origin of
right ascension close to the dynamical equinox of that epoch. The IAU adopted the system in 1997;
on 1 January 1998 it replaced the FK5 system ([Petit and Luzum 2010](literatur:petit-2010),
chapter 2). In relativity two coordinate systems belong to it: the barycentric BCRS with the time
coordinate TCB and the geocentric GCRS with TCG, whose spatial axes are kinematically
non-rotating with respect to the BCRS. Resolution B1.3 of 2000 fixed the orientation of the BCRS
axes only up to a constant rotation ([Soffel et al. 2003](literatur:soffel-2003)); since IAU
Resolution B2 of 2006, the BCRS and GCRS are, unless otherwise stated, oriented according to the
axes of the ICRS ([Petit and Luzum 2010](literatur:petit-2010), sections 5.2.2 and 5.3.1).

The ICRS is realised by radio positions of compact extragalactic sources measured with Very Long
Baseline Interferometry (VLBI). Defining sources hold the axes in place; the positions depend on
neither equator, equinox nor ecliptic
([Petit and Luzum 2010](literatur:petit-2010), sections 2.1 and 2.2):

| Realisation | Sources | of which defining | Key figure | Reference |
|---|---:|---:|---|---|
| ICRF1 (from 1998) | 608 | 212 | axes stable to ±0.02 mas | [Petit and Luzum 2010](literatur:petit-2010) |
| ICRF2 (from 2010) | 3414 | 295 | noise floor ≈ 0.04 mas, axes stable to 0.01 mas | [Petit and Luzum 2010](literatur:petit-2010) |
| ICRF3 (from 2019) | 4536 at 8.4 GHz | 303 | noise floor 0.03 mas | [Charlot et al. 2020](literatur:charlot-2020) |

ICRF3 rests on nearly 40 years of VLBI at 8.4 and 2.3 GHz, supplemented by measurements from the
last 15 years at 24 GHz (824 sources) and at 32 GHz (678 sources); positions are determined
independently in each band. For the first time the acceleration of the Solar System towards the
Galactic centre is modelled. It produces a dipolar field of apparent proper motions of 5.8 µas per
year, so the positions refer to epoch 2015.0. The frame at 8.4 and 2.3 GHz is aligned by a
no-net-rotation condition on the 295 defining sources of ICRF2; other selections of these sources
rotate it by at most 6 µas, less than the 10 µas directional stability of ICRF2. The IAU adopted
ICRF3 in August 2018, and it has replaced ICRF2 since 1 January 2019
([Charlot et al. 2020](literatur:charlot-2020)).

In the optical, Gaia-CRF3 realises the ICRS; in 2021 the IAU declared ICRF3 in the radio and
Gaia-CRF3 in the optical to be realisations of the ICRS. The orientation of the roughly 1.6 million
quasar-like sources of Gaia-CRF3 is tied to ICRF3 through about 2000 common sources; for 3142
optical counterparts of ICRF3 sources the median offset from the radio position is about 0.5 mas
([Gaia Collaboration, Klioner et al. 2022](literatur:gaia-2022)). Already against its predecessor
Gaia-CRF2, ICRF3 showed no deformations larger than 0.03 mas; for 22% of the sources, however, optical and radio positions
differ significantly, possibly because of extended source structure
([Charlot et al. 2020](literatur:charlot-2020)). An overview is given by
[International Celestial Reference System](quelle:wikipedia-en-icrs).

## Ecliptic, equinox and frame bias

Orbital elements are traditionally referred to the ecliptic and equinox of an epoch. Both are
determined dynamically and do not coincide exactly with the axes of the ICRS. The mean pole of
J2000.0 lies

$$\xi_0 = -16.617\,\mathrm{mas}, \quad \eta_0 = -6.819\,\mathrm{mas}$$

from the pole of the GCRS, 18 mas in total, and the mean equinox of J2000.0 has the right
ascension $\mathrm{d}\alpha_0 = -14.60\,\mathrm{mas}$ in the GCRS
([Petit and Luzum 2010](literatur:petit-2010), eqs. 5.21 and 5.33). The equinox meant is the
inertial one: the ecliptic is perpendicular to the orbital angular momentum of the Earth-Moon
barycentre, computed from the velocity with respect to an inertial system and not with respect to
the rotating orbital plane ([Petit and Luzum 2010](literatur:petit-2010), section 5.5.4).

The mean obliquity of the ecliptic at J2000.0 is 84,381.406″ according to IAU 2006, with an
uncertainty of 0.001″; the IAU 2000 model still used 84,381.448″
([Petit and Luzum 2010](literatur:petit-2010), table 1.1 and section 5.6.2). With an obliquity
$\varepsilon_0$, equatorial coordinates $\vec{r}_\alpha$ and ecliptic coordinates
$\vec{r}_\lambda$ of the same epoch are related by a rotation of the coordinate axes about the
x-axis, which points to the vernal equinox:

$$\vec{r}_\lambda = R_x(\varepsilon_0)\,\vec{r}_\alpha$$

Exactly in this way, with 84,381.448″ and without frame bias, JPL Horizons produces its fixed
ecliptic of J2000, to which the approximate planetary tables also refer
([Orbital elements](thema:bahnelemente)). Compared with the ecliptic of J2000 according to
IAU 2006, this plane is inclined by 0.04″, and its intersection with the ICRF equator is shifted by
0.05″ ([Petit and Luzum 2010](literatur:petit-2010), eq. 5.40 at the epoch).

## Precession, nutation and the equinox of date

External torques move the Earth's rotation axis in space. Precession is the secular part of this
motion together with the term of about 26,000 years period, nutation the remaining part
([Petit and Luzum 2010](literatur:petit-2010), glossary). At the same time the orbital plane of
the Earth-Moon barycentre tilts against the fixed ecliptic of J2000.0
([Petit and Luzum 2010](literatur:petit-2010), eq. 5.38). Coordinates "of date" therefore refer to
the mean equator and mean equinox of an instant, "true" coordinates also include nutation.

In the IAU 2006 precession the angle $\psi_A$ grows by 5038.48″ per Julian century (eq. 5.39). The
general precession in longitude $p_A$, in the form the Conventions use as an argument of planetary
nutation, grows by 0.02438175 rad per century (eq. 5.44); one cycle thus takes about 25,770 years
([Petit and Luzum 2010](literatur:petit-2010)). By 17 September 2026 the mean equinox has thus
moved 0.37° along the ecliptic. According to the polynomial part of the series for the
coordinates of the CIP, the celestial pole has moved about 0.15° away from the pole of the GCRS
([Petit and Luzum 2010](literatur:petit-2010), eq. 5.16).

The largest nutation term has as its argument the mean longitude of the ascending node of the
Moon $\Omega$, whose period is 18.6 years; its amplitudes are 17.206″ in longitude and 9.205″ in
obliquity. IAU 2000A comprises 678 lunisolar and 687 planetary terms. Because the free core
nutation cannot be predicted, the model fixes the direction of the celestial pole in the GCRS only
to about 0.3 mas ([Petit and Luzum 2010](literatur:petit-2010), section 5.6.1 and eq. 5.43).

Since IAU 2000, Earth rotation has been separated from precession and nutation. The Earth
rotation angle $\theta$ is counted along the equator of the Celestial Intermediate Pole (CIP) from
the non-rotating origin CIO to the TIO and is linearly related to UT1:

$$\theta = 2\pi\,(0.7790572732640 + 1.00273781191135448\,T_\mathrm{u})$$

with $T_\mathrm{u}$ the Julian date in UT1 minus 2,451,545.0. Sidereal time follows as
$\mathrm{GST} = \theta - \mathrm{EO}$; the equation of the origins EO contains the precession and
nutation in right ascension accumulated since J2000.0
([Petit and Luzum 2010](literatur:petit-2010), eqs. 5.14 and 5.30).

## The Laplace plane of moons

For moons, neither the ecliptic nor the planet's equator is a priori the natural reference plane.
The orbits of most moons are governed by the quadrupole of the equatorial bulge and the tidal
field of the Sun. On the classical Laplace surface, defined for circular orbits, the long-term
evolution driven by both forces vanishes, so orientation and shape of the orbit stay fixed; close
to the planet the surface coincides with its equator, far out with its orbital plane. A
dissipative disc around the planet should settle into it, and moons formed from such a disc are
likely to orbit in or near it. If the planet's obliquity exceeds 68.875°, the classical Laplace
surface is unstable over a range of semi-major axes
([Tremaine et al. 2009](literatur:tremaine-2009)). How JPL gives mean satellite elements with
respect to the Laplace plane, and where the transition between equator and orbital plane lies, is
described in [Orbital elements](thema:bahnelemente).

## IAU rotation models

The IAU working group on cartographic coordinates and rotational elements describes the
orientation of a planet or moon in the ICRF by three angles. Right ascension $\alpha_0$ and
declination $\delta_0$ give the north pole, the pole on the north side of the invariable plane of
the Solar System. The body's equator and the ICRF equator intersect at $\alpha_0 \pm 90^\circ$;
the point at $\alpha_0 + 90^\circ$ is the node $Q$. The angle $W$ is counted from $Q$ eastward
along the body's equator to the prime meridian. Time runs from the standard epoch JD 2,451,545.0,
1 January 2000 at 12 h TDB, in days $d$ and Julian centuries $T$
([Archinal et al. 2011](literatur:archinal-2011)):

$$\alpha_0 = \alpha_{00} + \dot{\alpha}_0\,T, \quad \delta_0 = \delta_{00} + \dot{\delta}_0\,T, \quad W = W_0 + \dot{W}\,d$$

Depending on the body, periodic terms are added, for Phobos also a quadratic term in $W$. The 2015
report keeps these conventions; its figures wrongly showed a negative sign in the right ascension
of $Q$ ([Archinal et al. 2019](literatur:archinal-2019), fig. 1 and table 2). A negative $\dot{W}$
means retrograde rotation, as for Venus and Uranus; the north pole then points against the
angular momentum. For dwarf planets, minor planets, their satellites and comets the positive pole
according to the right-hand rule applies instead
([Archinal et al. 2011](literatur:archinal-2011);
[Archinal et al. 2019](literatur:archinal-2019)). For the Moon the 2009 report recommended the
mean Earth/polar axis system ([Archinal et al. 2011](literatur:archinal-2011)).

For the [Earth](objekt:earth) the 2009 report still contained approximations, among them
$W = 190.147^\circ + 360.9856235^\circ\,d$ ([Archinal et al. 2011](literatur:archinal-2011)). The
2015 report removed these expressions: their accuracy was poor, they failed near J2000.0, and yet
they were sometimes used as a recommended model; for Earth rotation it refers to the IERS. The low-precision
series for the orientation of the Moon was removed as well
([Archinal et al. 2018](literatur:archinal-2018)). DE440 and DE441 give the orientation of the
lunar mantle as libration angles with respect to ICRF3, referred to its principal axes from data
of the GRAIL mission ([Park et al. 2021](literatur:park-2021)).

## Time scales

International Atomic Time TAI realises Terrestrial Time apart from a constant offset:

$$\mathrm{TT} = \mathrm{TAI} + 32.184\,\mathrm{s}$$

([Petit and Luzum 2010](literatur:petit-2010), section 10.1). UTC runs at the rate of TAI but is
offset by an integer number of seconds such that $|\mathrm{UT1} - \mathrm{UTC}| < 0.9\,\mathrm{s}$
([Petit and Luzum 2010](literatur:petit-2010), glossary). Leap seconds can be inserted at the end
of June or December; since 1 January 2017, TAI − UTC = 37 s, and none will be added at the end of
December 2026 ([Bizouard 2026](literatur:bizouard-2026)). TT − UTC is thus 69.184 s. UT1 is not a
uniform time but, through the Earth rotation angle, a measure of Earth rotation. The difference
$\Delta T = \mathrm{TT} - \mathrm{UT}$ compares the uniform time of orbital theories with time from
Earth rotation; eclipse records and lunar occultations provide it from 720 BC to AD 2015
([Stephenson et al. 2016](literatur:stephenson-2016)).

The time coordinates of relativity are TCB in the BCRS and TCG in the GCRS
([Soffel et al. 2003](literatur:soffel-2003)). TT differs from TCG by a defined rate, and TDB from
TCB by a linear transformation according to IAU Resolution B3 of 2006:

$$\frac{\mathrm{d}\,\mathrm{TT}}{\mathrm{d}\,\mathrm{TCG}} = 1 - L_\mathrm{G}, \quad \mathrm{TDB} = \mathrm{TCB} - L_\mathrm{B}\,(\mathrm{JD}_\mathrm{TCB} - T_0) \cdot 86400\,\mathrm{s} + \mathrm{TDB}_0$$

with $L_\mathrm{G} = 6.969290134 \cdot 10^{-10}$, $L_\mathrm{B} = 1.550519768 \cdot 10^{-8}$,
$T_0 = 2443144.5003725$ and $\mathrm{TDB}_0 = -6.55 \cdot 10^{-5}\,\mathrm{s}$
([Petit and Luzum 2010](literatur:petit-2010), section 10.1 and eq. 10.3). $L_\mathrm{G}$ is chosen
so that the unit of TT agrees with the SI second on the geoid. TCG therefore runs ahead of TT by
22 ms per year, and TCB ahead of TDB by 0.49 s per year. Between TT and TDB a periodic difference
remains; its largest term has an amplitude of 1.7 ms and follows the sine of the mean anomaly of
the Sun, so it varies annually ([Petit and Luzum 2010](literatur:petit-2010), section 5.6.4).

## Ephemerides and mean elements

Accurate positions come from numerically integrated ephemerides. DE440 and DE441 were produced by
fitting integrated orbits to ground-based and space-based observations. Their time argument is
TDB; measurements with UTC time tags are converted via TAI and TT. The inertial frame is connected
to the ICRS: the orbits of the inner planets are aligned with ICRF3 through VLBI measurements of
Mars-orbiting spacecraft with an average accuracy of about 0.2 mas, and Jupiter and Saturn through
measurements of Juno and Cassini. DE441 omits the damping between the liquid lunar core and the
mantle, and is therefore less accurate than DE440 for the current century, but covers the years
−13,200 to +17,191 instead of 1550 to 2650 ([Park et al. 2021](literatur:park-2021)). Asteroid
orbits in the dynamical model of DE440, determined without Gaia data, show an orientation offset of
about 10 mas and rotation rates below 0.5 mas per year against the Gaia observations of 1001
asteroids, far more than the reported differences between DE440 and ICRF3. The authors attribute
this to systematic errors in older asteroid astrometry; with Gaia data in the orbit determination
the offset drops to about 0.2 mas ([Yao et al. 2025](literatur:yao-2025)). Notes on
using the files are given at [JPL planetary ephemerides](quelle:jpl-ephemeriden).

Mean elements, or elements fitted to a time window, are by contrast approximations of limited
validity; how they differ from osculating elements is explained in
[Orbital elements](thema:bahnelemente).

## Open questions

- **Bright Gaia frame:** The stellar frame of Gaia, especially for bright stars, may have
  significantly larger systematic errors than the quasar frame Gaia-CRF3
  ([Gaia Collaboration, Klioner et al. 2022](literatur:gaia-2022)); there is a systematic rotation
  between the bright and faint parts, which future data releases are to correct. Comparisons with
  radio stars whose positions VLBI measures in ICRF3 point in different directions. Zhang et al.
  find the spin in agreement with Gaia's internal estimate and indications that the orientation
  error also depends on magnitude ([Zhang et al. 2025](literatur:zhang-2025)). For the bright frame
  down to G = 13 mag, Lunz et al. find no significant orientation offset but a spin about the y-axis
  of 0.072 ± 0.025 mas per year, and in their analysis the uncorrected bright frame agrees better
  with ICRF3 than the corrected one ([Lunz et al. 2024](literatur:lunz-2024)).
- **Future of the leap second:** It has been decided that the permitted magnitude of UT1 − UTC will
  be increased in or before 2035; a new maximum value that keeps UTC continuous for at least a
  century, and a plan for implementing it, are to be put to the General Conference in 2026
  ([CGPM 2022](literatur:cgpm-2022)). The procedure is disputed. Levine proposes an algorithmic
  rate adjustment without time steps ([Levine 2024](literatur:levine-2024)). Petit and Tagliaferro
  consider his description ambiguous and his numerical examples misleading: instead of the
  tolerance of one minute he states, excursions of UT1 − UTC of several minutes would have to be
  tolerated ([Petit and Tagliaferro 2025](literatur:petit-2025)). In his reply, Levine concludes
  that the advantages of the method outweigh its drawbacks
  ([Levine 2025](literatur:levine-2025)). According to Agnew, UTC as currently defined would need
  its first negative leap second by 2029, which could force changes earlier than planned
  ([Agnew 2024](literatur:agnew-2024)).

## In the model

- **Time:** The clock keeps Julian days, displays them as a date in UTC and uses the same number
  as TDB in the orbital elements and as the time argument of rotation. Without a link or a saved
  session it starts at JD 2,451,545.0, displayed as 1 January 2000, 12 h UTC; J2000.0, however, is
  12 h TT ([Petit and Luzum 2010](literatur:petit-2010), section 5.3.1). The orbits therefore miss
  TT − UTC = 69.184 s today, and TDB differs from TT by milliseconds only: the Earth lags 2.8″ in
  longitude, the Moon 38″. For the rotation of the Earth, UT1 would be the correct argument, which
  differs from UTC by at most 0.9 s.
- **Frame:** All orbits and poles are computed in JPL's fixed ecliptic of J2000, the ICRF rotated
  by 84,381.448″ without frame bias. The elements of the planets, the dwarf planets and all moons
  except the Earth's Moon come from JPL sources ([Orbital elements](thema:bahnelemente)); Orrery
  rotates the equatorial poles by the same angle and so stays within the frame of its data.
  Precession and nutation are missing. For orbits in the fixed frame this is correct; the Earth's
  pole, however, stands still as a result (see Earth), and conversely the lunar rates contain
  precession (see lunar node).
- **Reference planes:** The planets, the Moon (with rates from the equinox of date, see lunar
  node) and five dwarf planets including Pluto have elements
  referred to the ecliptic of J2000; the other 20 moons are referred to the equator of their parent
  body with its fixed pole. There is no separate Laplace plane (details in
  [Orbital elements](thema:bahnelemente)).
- **Lunar node:** The node and perigee rates of the Moon are counted from the mean equinox of date.
  The node rate of −1934.1363° per century agrees to within $3 \cdot 10^{-5}$ degrees per century
  with the expression DE440 uses in its Earth orientation model for the argument of the 18.6-year
  nutation term, counted from the mean equinox of date ([Park et al. 2021](literatur:park-2021)). Against the fixed ecliptic of J2000, the osculating
  elements from DE441 for 1900 to 2100 give rates of −1935.53° and +4067.63° per century, smaller
  by 1.39° and 1.38°, as much as the general precession. In the fixed frame of the model, node and
  perigee are therefore 0.37° too large in longitude in September 2026 and 2.8° too small in 1800.
  The mean longitude itself grows at the rate from the sidereal month and thus in the fixed frame;
  what is shifted are the mean anomaly and the argument of latitude, each by about 0.37° in 2026.
- **Poles and rotation:** Poles are stored as fixed right ascension and declination without rates
  or periodic terms. The rotation phase is zero at the epoch for all 35 bodies and grows with a
  fixed period. It is counted not from $Q$ but from the direction into which the shortest rotation
  of the sphere onto the body's pole carries the centre of the map; excluding the Earth, depending
  on the pole this lies between 2° (Callisto) and 173° (Pluto and Charon) from $Q$. $W_0$ from the
  IAU model is not used: from 2026 to 2036 the map centre of the Moon points between 31° and 44°
  away from the direction to the Earth.
- **Earth:** Orrery rotates the Earth uniformly with 23.9345 h, 0.101 s longer than one cycle of
  the Earth rotation angle, about the fixed ICRF pole; by now the celestial pole has moved about
  0.15° away from it (see precession). At JD 2,451,545.0 Greenwich points to right
  ascension 0° instead of 280.46°: the globe is rotated 79.5° too far east, on 17 September 2026 by
  75.4°. Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
