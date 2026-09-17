# Earth

This text treats the Earth as a planet: figure and gravity field from satellite orbits,
structure from free oscillations and seismic travel times, rotation and tides from historical
eclipses and lunar laser ranging, together with the open disputes with both sides and what
Orrery reproduces of them.

## Parameters and measurement

The IERS Conventions (2010) collect the basic geodetic quantities as numerical standards
([Petit and Luzum 2010](literatur:petit-2010), Table 1.1). Equatorial radius, flattening and
$J_2$ are given in the zero-tide system: the permanent deformation caused by the permanent tidal
potential is not removed.

| Quantity | Value | Uncertainty | Determination | Reference |
|---|---|---|---|---|
| $GM_\oplus$ (TCG) | $3.986004418 \cdot 10^{14}\,\mathrm{m}^3\,\mathrm{s}^{-2}$ | $8 \cdot 10^{5}\,\mathrm{m}^3\,\mathrm{s}^{-2}$, recent studies $4 \cdot 10^{5}$ | satellite orbits, mainly LAGEOS; including the atmosphere | [Petit and Luzum 2010](literatur:petit-2010); [Ries et al. 1992](literatur:ries-1992) |
| $a_\mathrm{E}$ | $6378136.6\,\mathrm{m}$ | $0.1\,\mathrm{m}$ | zero tide | [Petit and Luzum 2010](literatur:petit-2010) |
| $1/f$ | $298.25642$ | $0.00001$ | zero tide | [Petit and Luzum 2010](literatur:petit-2010) |
| $J_2$ | $1.0826359 \cdot 10^{-3}$ | $1 \cdot 10^{-10}$ | gravity field, zero tide | [Petit and Luzum 2010](literatur:petit-2010) |
| $H$ | $3.273795 \cdot 10^{-3}$ | $1 \cdot 10^{-9}$ | consistent with the IAU 2006/2000 precession-nutation model | [Petit and Luzum 2010](literatur:petit-2010) |
| $C$ | $80349.0 \cdot 10^{33}\,\mathrm{kg}\,\mathrm{m}^2$ | $9.6 \cdot 10^{33}\,\mathrm{kg}\,\mathrm{m}^2$ | gravity models EGM2008, EIGEN-6C, EIGEN-6C2; limited by $G$ and $H$ | [Chen et al. 2015](literatur:chen-2015) |
| $\mu$ (Moon/Earth) | $0.0123000371$ | $4 \cdot 10^{-10}$ | numerical standard | [Petit and Luzum 2010](literatur:petit-2010) |
| $\omega$ (nominal) | $7.292115 \cdot 10^{-5}\,\mathrm{rad}\,\mathrm{s}^{-1}$ | – | reference system GRS80 | [Petit and Luzum 2010](literatur:petit-2010) |

In most determinations of $GM_\oplus$ up to 1992, laser ranging to the LAGEOS satellite had the
greatest influence; after correcting an error in its centre-of-mass offset, these data gave
398,600.4415 km³ s⁻² with 0.0008 km³ s⁻² (1σ), including the atmosphere
([Ries et al. 1992](literatur:ries-1992)). This is the TT-compatible value that the IERS
Conventions derive from the table value with $x_\mathrm{TT} = x_\mathrm{TCG}\,(1 - L_\mathrm{G})$.
The polar radius $b = a_\mathrm{E}\,(1 - f) = 6356751.9\,\mathrm{m}$ is 21.4 km smaller.

$J_2$ and the dynamical flattening $H$ contain the same difference of principal moments of
inertia:

$$J_2 = \frac{C - (A + B)/2}{M a_\mathrm{E}^2}, \quad H = \frac{C - (A + B)/2}{C}$$

Their ratio $C/(M a_\mathrm{E}^2) = J_2/H = 0.330698$ does not depend on $G$; the table values
give a formal uncertainty of $1 \cdot 10^{-7}$. The absolute $C$, in contrast, needs the mass
and hence $G$; its accuracy is limited by the uncertainties of $G$ and $H$
([Chen et al. 2015](literatur:chen-2015)).
For the mean moment of inertia $I = (A + B + C)/3$,

$$\frac{I}{M a_\mathrm{E}^2} = \frac{C}{M a_\mathrm{E}^2} - \frac{2}{3}\,J_2 = 0.329976$$

so relative to the mean radius of 6,371.0 km $I/(M R^2) = 0.33072$, well below 0.4 for a
homogeneous sphere.

The IERS Conventions count rotation through the Earth Rotation Angle in UT1
([Petit and Luzum 2010](literatur:petit-2010), Eq. 5.14):

$$\theta_\mathrm{ERA} = 2\pi\,(0.7790572732640 + 1.00273781191135448\,T_\mathrm{u})$$

with $T_\mathrm{u}$ the Julian date in UT1 minus 2,451,545.0. One rotation relative to the sky
therefore takes 86,164.0989 s; changes in the length of day (LOD) follow from
$\Delta \mathrm{LOD}/\mathrm{LOD} = -\Delta\omega/\omega$.

## Interior

The reference model PREM was derived from about 1000 free-oscillation periods, 500 summary
travel-time observations, 100 quality factors, mass and moment of inertia, plus 1.75 million P-
and S-wave travel times from ISC data; the outer 220 km of the mantle had to be made
transversely isotropic ([Dziewonski and Anderson 1981](literatur:dziewonski-1981)). The
constraints were $R = 6371\,\mathrm{km}$, $M = 5.974 \cdot 10^{24}\,\mathrm{kg}$ and
$I/(M R^2) = 0.3308$. In PREM the inner core extends to a radius of 1,221.5 km, the core–mantle
boundary lies at 3,480.0 km, i.e. 2,891 km deep, and the mantle transition zone between the
discontinuities at 400 and 670 km depth. The density polynomials give 13.09 g/cm³ at the centre,
a jump from 12.17 to 12.76 g/cm³ at the inner core and from 5.57 to 9.90 g/cm³ at the
core–mantle boundary.

Both parts of the core are less dense than pure iron. The deficit is attributed to light
elements such as S, Si, O, C and H; their abundances can only be inferred indirectly, by
matching high-pressure experiments and calculations with seismic observations. Hirose et al.
give, by weight, Fe with 5 % Ni, 1.7 % S, 0 to 4.0 % Si, 0.8 to 5.3 % O, 0.2 % C and 0 to
0.26 % H for the outer core, and for the inner core, among others, only 0 to 0.1 % O
([Hirose et al. 2021](literatur:hirose-2021)).

When the inner core started to grow depends on the thermal conductivity, and the measurements
disagree. Ohta et al. measured the electrical resistivity of iron up to 4500 K in a
diamond-anvil cell; the low value points to high thermal conductivity, rapid cooling and an
inner core younger than 0.7 billion years ([Ohta et al. 2016](literatur:ohta-2016)).
Konôpková et al. estimate 18 to 44 W m⁻¹ K⁻¹ for the core from heat pulses in solid iron; then
thermal convection can drive the dynamo for billions of years, and the inner core can be as old
as the dynamo ([Konôpková et al. 2016](literatur:konopkova-2016)). Palaeomagnetically, Biggin et
al. interpret an increase in mean field strength and variability 1.0 to 1.5 billion years ago
as the onset of core crystallisation at moderate conductivity
([Biggin et al. 2015](literatur:biggin-2015)). Bono et al. found a mean dipole moment of only
about $0.7 \cdot 10^{22}\,\mathrm{A}\,\mathrm{m}^2$ in rocks about 565 million years old,
consistent with high conductivity and an Ediacaran onset of inner-core growth
([Bono et al. 2019](literatur:bono-2019)).

## Surface

The topographic range is 20.4 km; at $1.4 \cdot 10^{21}\,\mathrm{kg}$ the hydrosphere has about
275 times the mass of the atmosphere ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)). The Earth
is the only known planet with plate tectonics; the principal driving force is the sinking of
cold, dense lithosphere in subduction zones ([Stern 2005](literatur:stern-2005)). When plate
tectonics began is open; proposals range from the Hadean to the Neoproterozoic. Palin et al. see
in metamorphic rocks and geodynamic models a global onset no later than about 3 billion years
ago and interpret older subduction traces as local, plume-induced subduction
([Palin et al. 2020](literatur:palin-2020)). Stern, in contrast, infers from the rock record
that the present episode of plate tectonics began only in the Neoproterozoic
([Stern 2018](literatur:stern-2018)); earlier he based this on the first appearance of
ophiolites, blueschists and ultrahigh-pressure rocks ([Stern 2005](literatur:stern-2005)).

## Atmosphere and magnetosphere

By volume, dry air consists of 78.08 % N₂, 20.95 % O₂, 9340 ppm Ar and 420 ppm CO₂; water vapour
is typically about 1 %. The fact sheet gives a surface pressure of 1014 hPa, a mean temperature
of 288 K, a mean molar mass of 28.97 g/mol and a scale height of 8.5 km; the isothermal
approximation $h_\mathrm{s} = k_\mathrm{B} T/(\bar{m}\,g)$ gives 8.4 km. The Bond albedo is
0.294, the geometric albedo 0.434 ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)). The northern
and southern hemispheres reflect the same amount of sunlight to within about 0.2 W m⁻², because
clouds in the south offset the brighter land in the north, and the reflected mean varies from
year to year by only about 0.2 % ([Stephens et al. 2015](literatur:stephens-2015)).
Nevertheless, the planetary albedo reached a record low in 2023, mainly through less low cloud
in the northern mid-latitudes and the tropics. The authors see this as the main factor behind
the roughly 0.2 K by which earlier estimates of the known drivers fell short of the temperature
rise ([Goessling et al. 2025](literatur:goessling-2025)).

The IGRF describes the main field in spherical harmonics with the reference radius
$a = 6371.2\,\mathrm{km}$; the 14th generation of November 2024 contains models for 2020.0 and
2025.0 to degree 13 and a forecast of the secular variation for 2025 to 2030
([Beggan et al. 2026](literatur:beggan-2026)). The first-degree Gauss coefficients give

$$B_0 = \sqrt{\left( g_1^0 \right)^2 + \left( g_1^1 \right)^2 + \left( h_1^1 \right)^2}, \quad m = \frac{4\pi a^3 B_0}{\mu_0}$$

For 2025.0 these are $B_0 = 29733\,\mathrm{nT}$ and
$m = 7.69 \cdot 10^{22}\,\mathrm{A}\,\mathrm{m}^2$; the dipole axis is tilted by about 9.2° from
the rotation axis, and the IGRF places the geomagnetic north pole at 80.85° N (geodetic
latitude), 72.76° W. In
1900 the moment was $8.32 \cdot 10^{22}\,\mathrm{A}\,\mathrm{m}^2$, so it fell by 7.6 % in 125
years, and the forecast change of $g_1^0$ by +12.6 nT per year continues the decline. In the
field changes at the core–mantle boundary on sub-decadal time scales, the CHAOS-8 model finds
westward-moving features and, tentatively, small-scale eastward-moving ones at low latitudes, at
about 200 km per year, interpreted as evidence of hydromagnetic waves
([Kloss et al. 2026](literatur:kloss-2026)).

## Orbit, rotation and dynamics

JPL's approximate table for 1800 to 2050 lists the Earth–Moon barycentre with
$a = 1.00000261$ au, $e = 0.01671123$ changing by −0.0000439 per century, and the
longitude of perihelion 102.94° advancing by 0.323° per century, relative to the J2000 ecliptic
([JPL Approximate Positions](quelle:jpl-approx-pos)); for the meaning of such elements see
[Orbital elements](thema:bahnelemente). The obliquity of the ecliptic decreases from
84,381.406″ at epoch J2000.0 by 46.84″ per century; the general precession in longitude of
0.02438175 rad per century gives one cycle in about 25,770 years
([Petit and Luzum 2010](literatur:petit-2010), Eqs. 5.40 and 5.44).

Today the obliquity varies by only ±1.3° about 23.3°. Laskar et al. found a chaotic zone from
60° to 90° obliquity that would extend from nearly 0° to about 85° without the Moon; the Moon
thus acts as a potential climate regulator ([Laskar et al. 1993](literatur:laskar-1993)). Li
and Batygin, in contrast, estimate that even without the Moon the chaotic change in obliquity
would be slow enough not to preclude long-term habitability
([Li and Batygin 2014](literatur:li-2014)). The orbital solution La2004 is suitable for
calibrating palaeoclimate data over 40 to 50 million years; beyond that, chaos prevents precise
values, and for the Mesozoic the authors recommend the eccentricity term of largest amplitude,
with a period of 405,000 years ([Laskar et al. 2004](literatur:laskar-2004)).

Tidal friction transfers angular momentum from the Earth's rotation to the lunar orbit. Lunar
laser ranging, supplemented by geophysical tide models, gives
$\mathrm{d}a/\mathrm{d}t = 38.30 \pm 0.08\,\mathrm{mm}$ per year; the geophysical model
predicts a tidal increase in the length of day of 2.395 ms per century
([Williams and Boggs 2016](literatur:williams-2016)). Eclipse records from 720 BC and lunar
occultations up to 2015, however, show on average only +1.8 ms per century and fluctuations on
time scales of decades to centuries; post-glacial rebound and core–mantle coupling are invoked
to explain the difference ([Stephenson et al. 2016](literatur:stephenson-2016)). The extended
analysis gives $(-4.59 \pm 0.08) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$ observed against
$(-6.39 \pm 0.03) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$ from the tidal calculation
([Morrison et al. 2021](literatur:morrison-2021)). With

$$\dot{\mathrm{LOD}} = -\frac{\mathrm{LOD}^2}{2\pi}\,\dot{\omega}$$

the tidal value corresponds to 2.40 ms per century, in agreement with the 2.395 ms of the
geophysical model. For the period since 1972, Agnew found that once ice melt in Greenland and
Antarctica, measured by satellite gravimetry, is removed, the angular velocity of the liquid
core decreases at a constant rate and increases that of the rest of the Earth; UTC would then
need a negative leap second by 2029, three years earlier without the accelerated ice melt
([Agnew 2024](literatur:agnew-2024)).

## Formation and evolution

Calcium–aluminium-rich inclusions in meteorites, the first solids of the Solar System, formed
$4567.30 \pm 0.16$ million years ago ([Connelly et al. 2012](literatur:connelly-2012)). Their
formation marks the zero point for times after the formation of the Solar System
([Bouvier and Wadhwa 2010](literatur:bouvier-2010)); Bouvier and Wadhwa date the inclusion they
studied to an age of 4568.2 million years. The
[Moon](objekt:moon) is regarded as the product of a giant impact. Canup and Asphaug found
impacts by a smaller body than previously thought viable that, near the end of the Earth's
growth, yield an iron-poor Moon and the present angular momentum
([Canup and Asphaug 2001](literatur:canup-2001)). In such simulations most lunar material comes
from the impactor, yet Earth and Moon are isotopically nearly identical. Two variants start with
more angular momentum, later removed through a resonance with the Sun: an impact onto a
fast-spinning proto-Earth whose disk derives mainly from the Earth's mantle
([Ćuk and Stewart 2012](literatur:cuk-2012)), or a much larger impactor whose disk acquires the
same composition as the mantle ([Canup 2012](literatur:canup-2012)).

How similar the oxygen isotopes really are is disputed. Herwartz et al. measured a difference in
Δ¹⁷O of 12 ± 3 ppm as a trace of the impactor Theia, or alternatively of a late addition of
carbonaceous chondrites ([Herwartz et al. 2014](literatur:herwartz-2014)). Young et al. found −1
± 5 ppm (2 standard errors) in the logarithmically defined Δ′¹⁷O and infer vigorous mixing in an
energetic impact ([Young et al. 2016](literatur:young-2016)). According to Cano et al., the values
correlate with lithology, and samples from the deep lunar mantle are heavier than the Earth
([Cano et al. 2020](literatur:cano-2020)). Fischer et al. find no difference at the sub-ppm
level ([Fischer et al. 2024](literatur:fischer-2024)).

The age of the Moon is also disputed. Zircons from Apollo 14 samples indicate a lunar crust
differentiated 4.51 billion years ago at the latest, i.e. formation of the Moon within the first
60 million years or so after the formation of the Solar System
([Barboni et al. 2017](literatur:barboni-2017)). A magma ocean that takes 150 to 200 million
years to solidify, combined with sample ages, leads instead to $4.425 \pm 0.025$ billion years,
equal to the uranium–lead age of the Earth, which would then date the last core formation
([Maurice et al. 2020](literatur:maurice-2020)). A zircon whose age of 4.4 billion years is
confirmed by atom-probe tomography requires any mixing of the silicate Earth to have happened
earlier ([Valley et al. 2014](literatur:valley-2014)).

## Open questions

- **Age of the inner core:** depending on thermal conductivity, estimates range from about 0.5
  to more than 2.5 billion years ([Bono et al. 2019](literatur:bono-2019)), and the palaeofield
  is interpreted differently ([Biggin et al. 2015](literatur:biggin-2015);
  [Bono et al. 2019](literatur:bono-2019)).
- **Light elements:** the ranges would narrow with tighter limits on the core temperature and a
  better link between the compositions of the solid and liquid core
  ([Hirose et al. 2021](literatur:hirose-2021)).
- **Rotation of the inner core:** according to repeated seismic waves, differential rotation
  paused over the past decade, interpreted as a gradual turning-back within an oscillation of
  about seven decades ([Yang and Song 2023](literatur:yang-2023)). Wang et al. trace the
  reversal in more detail: super-rotation from 2003 to 2008, then sub-rotation two to three
  times slower until 2023; new coupling models are needed
  ([Wang et al. 2024](literatur:wang-2024)).
- **Onset of plate tectonics:** no later than 3 billion years ago, or in the modern style only
  in the Neoproterozoic (see Surface).
- **Formation of the Moon:** whether the oxygen isotopes are identical, and whether the Moon
  formed 4.51 or 4.425 billion years ago (see Formation).
- **Albedo:** how much of the decline in low cloud is internal variability, fewer aerosols or an
  emerging feedback ([Goessling et al. 2025](literatur:goessling-2025)).

## In the model

- **Orbit:** elements from JPL's Table 1 (1800 to 2050) relative to the J2000 ecliptic with
  linear rates, valid for the Earth–Moon barycentre, with nominal errors of 20″ in longitude, 8″
  in latitude and 6000 km in distance ([JPL Approximate Positions](quelle:jpl-approx-pos)).
  Orrery puts the Earth's centre at this barycentre and the Moon relative to it with fixed $a$,
  $e$, $I$ and linearly advancing angles. The true centre of the Earth is offset by
  $\mu/(1 + \mu)$ of the lunar distance, 4415 to 4928 km with the model’s lunar elements, or up
  to 6.9″ as seen from the Sun; the vector from Earth to Moon is not affected.
- **Time:** the clock counts Julian days in UTC and uses them as TDB without conversion. Since
  2017, $\mathrm{TT} - \mathrm{UTC} = 32.184\,\mathrm{s} + 37\,\mathrm{s} = 69.184\,\mathrm{s}$,
  and TDB differs from TT only by milliseconds; the Earth therefore lags by 2.8″ in longitude.
- **Data block:** the diameter of 12,742 km is twice the mean radius, not the equatorial
  diameter; the sphere is not flattened. The data block computes the orbital period of 365.2
  days with Kepler’s law from $a$ at epoch and $G\,(M_\odot + M_\oplus)$: 365.2495 days, about
  ten minutes less than the $360^\circ/\dot{L} = 365.2564$ days of the motion. This is mainly
  due to CODATA $G$ times the Sun’s mass in the data set, 45 ppm above the heliocentric
  gravitational constant ([Petit and Luzum 2010](literatur:petit-2010)); with the latter it
  would be 365.2578 days. The eccentricity 0.017 is the table value at the clock time.
- **Rotation:** there is no longer an IAU rotation model for the Earth; the earlier
  approximations were poor, failed near J2000.0 and were removed in favour of the IERS models
  ([Archinal et al. 2018](literatur:archinal-2018)). Orrery rotates the Earth uniformly with the
  sidereal period of 23.9345 h ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)), 0.101 s longer
  than one rotation of the Earth Rotation Angle. At JD 2,451,545.0 the prime meridian of the map
  points to right ascension 0°, but the Earth Rotation Angle was 280.46°. The globe is therefore
  rotated by 79.5°, by 75.4° on 17 September 2026; day and night lie over the wrong longitudes.
- **Pole and axial tilt:** the pole is fixed at right ascension 0° and declination 90°, without
  precession, nutation or polar motion; according to $\delta_0 = 90.00^\circ - 0.557^\circ\,T$
  ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)) it would have moved by about 0.15° by 2026.
  Converting pole directions to the ecliptic uses the obliquity 84,381.448″ of IAU 2000 instead
  of 84,381.406″ ([Petit and Luzum 2010](literatur:petit-2010)). The axial tilt of 23.4° in the
  data block is the angle to the orbit normal at epoch, 23.43928°; on 17 September 2026 the mean
  obliquity is 23.4358°.
- **Albedo:** a factor of about 3.2 raises the mean linear reflectance of the cloud-free day
  map, about 0.13, to the geometric albedo of 0.434, so the brightness of the clouds lies on
  land and sea. The material scatters essentially like a Lambert surface, and such a sphere has
  $p = 2A/3 = 0.29$ and the Bond albedo $A = 0.434$, matching neither measured value, 0.434 or
  0.294. Clouds and atmosphere are missing; only the umbra is tinted for lunar eclipses.
- The day–night boundary seen from close by is shown in
  [Sunrise over the limb of the Earth](szene:erdaufgang); further simplifications:
  [Limits of the model](thema:modell).

*As of September 2026*
