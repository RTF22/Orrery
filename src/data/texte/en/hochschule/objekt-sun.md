# Sun

This text treats the Sun as the star that can be measured in detail: its parameters, the interior
from free oscillations and neutrinos, the photosphere, the atmosphere out to the heliopause,
rotation and motion about the barycentre, age and future, the open disputes, and what Orrery
reproduces of them.

## Parameters and measurement

IAU Resolution B3 of 2015 defines nominal values that are exact by definition and serve only as
conversion factors, not as the true properties of the Sun:
$R_\odot^{\mathrm{N}} = 695700\,\mathrm{km}$, $S_\odot^{\mathrm{N}} = 1361\,\mathrm{W}\,\mathrm{m}^{-2}$,
$L_\odot^{\mathrm{N}} = 3.828 \cdot 10^{26}\,\mathrm{W}$, $T_\mathrm{eff}^{\mathrm{N}} = 5772\,\mathrm{K}$
and $GM_\odot^{\mathrm{N}} = 1.3271244 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$, the latter
rounded to the digits in which TCB- and TDB-compatible values agree
([Prša et al. 2016](literatur:prsa-2016)). The table lists the best measured values, which the
nominal values closely follow.

| Quantity | Value | Uncertainty | Method | Reference |
|---|---|---|---|---|
| $GM_\odot$ (TDB) | $1.32712440041 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$ | $1 \cdot 10^{10}\,\mathrm{m}^3\,\mathrm{s}^{-2}$ | ephemeris DE421; TCB table value times $1 - L_\mathrm{B}$ | [Petit and Luzum 2010](literatur:petit-2010) |
| $G$ | $6.67430 \cdot 10^{-11}\,\mathrm{m}^3\,\mathrm{kg}^{-1}\,\mathrm{s}^{-2}$ | $0.00015 \cdot 10^{-11}\,\mathrm{m}^3\,\mathrm{kg}^{-1}\,\mathrm{s}^{-2}$ | 16 laboratory measurements, uncertainty expanded by a factor of 3.9 | [Mohr et al. 2025](literatur:mohr-2025) |
| $M_\odot = GM_\odot/G$ | $1.98841 \cdot 10^{30}\,\mathrm{kg}$ | $4.5 \cdot 10^{25}\,\mathrm{kg}$ | quotient of the two rows above | derivation |
| $R_\odot$ | $695658\,\mathrm{km}$ | $140\,\mathrm{km}$ | inflection point of the limb profile, converted to $\tau_\mathrm{Ross} = 2/3$ | [Haberreiter et al. 2008](literatur:haberreiter-2008); [Prša et al. 2016](literatur:prsa-2016) |
| $S_\odot$ (minimum 2008) | $1360.8\,\mathrm{W}\,\mathrm{m}^{-2}$ | $0.5\,\mathrm{W}\,\mathrm{m}^{-2}$ | radiometer TIM on SORCE | [Kopp and Lean 2011](literatur:kopp-2011) |
| $L_\odot$ | $3.8275 \cdot 10^{26}\,\mathrm{W}$ | $0.0014 \cdot 10^{26}\,\mathrm{W}$ | $4\pi\,(1\,\mathrm{au})^2\,S_\odot$ with the mean of cycle 23 | [Prša et al. 2016](literatur:prsa-2016) |
| $T_\mathrm{eff}$ | $5772.0\,\mathrm{K}$ | $0.8\,\mathrm{K}$ | Stefan–Boltzmann from $R_\odot$ and $L_\odot$ | [Prša et al. 2016](literatur:prsa-2016) |
| $J_2$ | $2.246 \cdot 10^{-7}$ | $0.022 \cdot 10^{-7}$ | Mercury's orbit from ranging to MESSENGER | [Genova et al. 2018](literatur:genova-2018) |
| $\Delta r/R$ | $9.02 \cdot 10^{-6}$ | $0.72 \cdot 10^{-6}$ | limb shape from HMI roll manoeuvres 2010 to 2023 | [Meftah and Mecheri 2025](literatur:meftah-2025) |
| pole $\alpha_0$, $\delta_0$ | $286.13^\circ$, $63.87^\circ$ | about $0.1^\circ$ | IAU expression, for comparison only | [Archinal et al. 2018](literatur:archinal-2018); [Archinal et al. 2011](literatur:archinal-2011) |

Two methods determine the radius: the intensity profile at the limb and the frequencies of the
f modes, whose "seismic" radius is converted to optical depth unity. The two differed by about
0.3 Mm. Haberreiter et al. explain the difference by the height between optical depth unity at
disc centre ($\tau_\mathrm{Ross} = 2/3$) and the inflection point of the limb profile,
0.333 ± 0.08 Mm: because of the extent of the photosphere and the longer tangential rays, the disc
appears larger. The standard radius is thereby lowered to 695.66 Mm
([Haberreiter et al. 2008](literatur:haberreiter-2008)).

Planetary orbits measure only the product $GM_\odot$. The IERS Conventions give it to
$7.5 \cdot 10^{-11}$; their table value is TCB-compatible, the TDB-compatible one follows with
$L_\mathrm{B} = 1.550519768 \cdot 10^{-8}$ ([Petit and Luzum 2010](literatur:petit-2010),
Table 1.1). DE440 estimates $GM_\odot = 132712440041.279419\,\mathrm{km}^3\,\mathrm{s}^{-2}$
([Park et al. 2021](literatur:park-2021), Table 2); the nominal value differs from it by
$3 \cdot 10^{-10}$. The gravitational constant, in contrast, has been the least well known of the
major fundamental constants for decades: its 16 laboratory measurements disagree, their
uncertainties are expanded by a factor of 3.9, and no new one was added between the 2018 and 2022
adjustments ([Mohr et al. 2025](literatur:mohr-2025)). $G$ is thus five orders of magnitude less certain than
$GM_\odot$, and masses should be quoted as $GM/G$ with the value of $G$ stated
([Prša et al. 2016](literatur:prsa-2016)). $GM_\odot$ decreases: seven years of ranging to
MESSENGER give
$\dot{GM}_\odot/GM_\odot = (-6.13 \pm 1.47) \cdot 10^{-14}$ per year. The expected mass loss
through the luminosity is $-0.679 \cdot 10^{-13}$ per year and through the solar wind
$-0.2 \cdot 10^{-13}$ to $-0.69 \cdot 10^{-13}$ per year, together on average over the duration
of the mission $-0.9 \cdot 10^{-13}$ to $-1.1 \cdot 10^{-13}$ per year; the authors call the measured, somewhat smaller
decrease consistent with this and use it to limit $|\dot{G}|/G$ to below
$4 \cdot 10^{-14}$ per year ([Genova et al. 2018](literatur:genova-2018)). The share of the
luminosity is

$$\dot{M}_\odot = \frac{L_\odot}{c^2} = 4.26 \cdot 10^{9}\,\mathrm{kg}\,\mathrm{s}^{-1},$$

as in the fact sheet ([NSSDC Sun Fact Sheet](quelle:nssdc-sun)), i.e. $6.8 \cdot 10^{-14}$ of the
mass per year.

Rotation flattens the Sun only slightly. From 23 roll manoeuvres of SDO between 2010 and 2023 the
limb shape gives $\Delta r/R = (9.02 \pm 0.72) \cdot 10^{-6}$, i.e. 6.28 ± 0.50 km, in anti-phase
with activity; the internal rotation inferred from helioseismology gives
$(8.40 \pm 0.02) \cdot 10^{-6}$, 5.85 ± 0.01 km, varying in phase by $0.05 \cdot 10^{-6}$. The
authors call the conflict troubling ([Meftah and Mecheri 2025](literatur:meftah-2025)). Kuhn et al.
found the oblateness almost independent of the cycle and well below theoretical expectations,
which a slower differential rotation in the outer few percent of the radius could explain
([Kuhn et al. 2012](literatur:kuhn-2012)). The quadrupole moment of the gravity field
([Interior structure from gravity and rotation](thema:innerer-aufbau)) follows from Mercury's
orbit as $J_2 = (2.246 \pm 0.022) \cdot 10^{-7}$; the helioseismic determination tabulated by
Genova et al. gives $(2.20 \pm 0.03) \cdot 10^{-7}$ ([Genova et al. 2018](literatur:genova-2018)).

The irradiance at 1 au is by far the largest energy input to the [Earth](objekt:earth), nearly
$10^{4}$ times the next largest. The TIM radiometer measured
$1360.8 \pm 0.5\,\mathrm{W}\,\mathrm{m}^{-2}$ in the 2008 minimum instead of the
$1365.4 \pm 1.3\,\mathrm{W}\,\mathrm{m}^{-2}$ established in the 1990s; older radiometers picked up
scattered light because their precision aperture sits behind the view-limiting aperture. From
minimum to maximum the monthly mean rises by about $1.6\,\mathrm{W}\,\mathrm{m}^{-2}$, 0.12 %; over
a 27-day solar rotation the irradiance itself can vary by more than 0.3 %
([Kopp and Lean 2011](literatur:kopp-2011)).

## Interior

A standard solar model today is spherically symmetric, with a simple treatment of diffusion and
gravitational settling, an up-to-date equation of state, opacity and nuclear reaction rates, and a
simple description of near-surface convection; mixing in the radiative interior and rotation are
left out. It is calibrated to match the Sun's mass, radius, luminosity and present surface ratio
$Z/X$ at the solar age. In the reference Model S the central temperature is 15.67 MK, the central
density 153.9 g cm⁻³ and the central hydrogen fraction 0.338
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021), Table 2). The fact sheet gives
the [moment of inertia factor](thema:innerer-aufbau) $I/(M R^2) = 0.070$
([NSSDC Sun Fact Sheet](quelle:nssdc-sun)), far below 0.4 for a homogeneous sphere.

The frequencies of the free oscillations make the structure measurable; thanks to helioseismology it
is known to remarkable precision ([Basu 2016](literatur:basu-2016)). The base of the convection
zone lies at $r = (0.713 \pm 0.001)\,R_\odot$, and the envelope has the helium abundance
$Y_\mathrm{s} = 0.2485 \pm 0.0034$. This is well below the initial value of 0.271 required by the
calibration and confirms helium settling; Model S reaches 0.245
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

Below the convection zone the Sun rotates like a solid body; in the innermost core the rotation is
hardly constrained. In the convection zone the rotation rate at fixed latitude is almost
independent of depth ([Basu 2016](literatur:basu-2016)), and the radiative interior rotates
slightly slower than the equator at the surface
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)). Two shear layers separate
the regions: one near the surface, between the fastest-rotating layer at about $0.95\,R_\odot$ and
the surface, and the tachocline at the base of the convection zone. Its centroid lies slightly
below that boundary and its thickness is about $0.05\,R_\odot$. Whether it depends on latitude was
disputed: two analyses from 1998 and 1999 found no variation, Charbonneau et al. found it
$(0.024 \pm 0.004)\,R_\odot$ shallower at 60° latitude than at the equator, Basu and Antia in 2003
slightly shallower and thicker at high latitudes. It is believed to play an important role in the
dynamo ([Howe 2009](literatur:howe-2009)). Antia and Basu confirmed the prolate shape in 2011 and
also found a width increasing with latitude
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

Neutrinos from the fusion reactions are the only direct probe of the deep interior. The pp chain
produces about 99 % of the energy, the CNO cycle about 1 %
([The Borexino Collaboration 2020](literatur:borexino-2020)). Its rate grows roughly as $T^{20}$;
in Model S it contributes 11 % of the energy generation at the centre and 1.3 % of the luminosity
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)). Borexino measured the pp
neutrinos as
$(6.6 \pm 0.7) \cdot 10^{10}\,\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$, consistent with the models, and
from all significantly contributing reactions a nuclear luminosity of
$(3.89_{-0.42}^{+0.35}) \cdot 10^{26}\,\mathrm{W}$: the Sun currently produces, to within 10 %, as
much energy as it radiates ([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).
Borexino first detected neutrinos from the CNO cycle in 2020
([The Borexino Collaboration 2020](literatur:borexino-2020)); the complete data set excludes their
absence at about 7σ and gives a flux of
$6.6_{-0.9}^{+2.0} \cdot 10^{8}\,\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$
([Appel et al. 2022](literatur:appel-2022)).

The most sensitive point is the composition. Asplund et al. confirm low abundances of C, N and O,
for oxygen $\log\varepsilon_\mathrm{O} = 8.69 \pm 0.04$, and give for the present photosphere
$X = 0.7438 \pm 0.0054$, $Y = 0.2423 \pm 0.0054$, $Z = 0.0139 \pm 0.0006$ and
$Z/X = 0.0187 \pm 0.0009$; the solar modelling problem remains and points to shortcomings in the
opacities or in the treatment of mixing below the convection zone
([Asplund et al. 2021](literatur:asplund-2021)). A model with the 2009 composition has a convection
zone $0.276\,R_\odot$ deep instead of $0.287\,R_\odot$ and $Y_\mathrm{s} = 0.235$ instead of
0.2485 ([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021), Table 6).

## Surface

The photosphere, the layer from which most photons escape, counts as the surface. The fact sheet
gives a thickness of about 500 km, 6600 K at its bottom and 4400 K at its top, and a pressure of
125 mbar at optical depth unity ([NSSDC Sun Fact Sheet](quelle:nssdc-sun)).

The appearance of the photosphere is dominated by granulation: bright, hot upflows surrounded by
dark, cooler downflows, typically 1 Mm across, driven by cooling in a thin boundary layer at the
visible surface. An upflow needs about 2 km s⁻¹ to supply the radiative losses, and the horizontal
velocities can hardly exceed the sound speed of about 7 km s⁻¹; this limits granules to about 4 Mm.
At mean optical depth unity the upflows, at about 10,000 K, are almost twice as hot as the
downflows at about 6000 K. Meso- and supergranulation, at 5 to 10 and 20 to 50 Mm, are rather parts
of a continuous spectrum than distinct scales ([Nordlund et al. 2009](literatur:nordlund-2009)).

Towards the limb the disc darkens, because the oblique line of sight reaches optical depth unity in
higher, cooler layers. In the Eddington approximation of a grey atmosphere, with
$\mu = \cos\theta$,

$$\frac{I(\mu)}{I(1)} = \frac{2 + 3\mu}{5},$$

so at the limb 40 % of the central intensity remains. Three-dimensional simulations of convection
reproduce the observed limb darkening very well
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

Sunspots are magnetic flux tubes; the two spots analysed by Borrero and Ichimoto show vertical
tubes 30 to 40 Mm in diameter. The field is strongest and vertical at the centre and becomes
weaker and more inclined outwards; it reached about 3300 G in the large spot and 2900 G in the
small one. In 1908 Hale estimated 2600 to
2900 G from the Zeeman splitting, the first detection of a magnetic field beyond the Earth
([Borrero and Ichimoto 2011](literatur:borrero-2011)).

## Atmosphere and magnetosphere

Above the photosphere lies the chromosphere, about 2500 km thick and about 30,000 K at its top
([NSSDC Sun Fact Sheet](quelle:nssdc-sun)). In steady models, heating and radiative losses balance
below $10^{4}\,\mathrm{K}$; once the density drops so far that radiation can no longer balance the
heating, a rapid transition to coronal temperatures follows, involving thermal conduction: the
transition region. Current satellite instruments are most sensitive to the brighter plasma at 1 to
3 MK ([Cranmer and Winebarger 2019](literatur:cranmer-2019)). The corona loses about
$10^{7}\,\mathrm{erg}\,\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$ in active regions and
$3 \cdot 10^{5}\,\mathrm{erg}\,\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$ in the quiet Sun through radiation
and conduction, and the energy comes from motions in and below the photosphere
([Klimchuk 2006](literatur:klimchuk-2006)). That is $10^{4}$ and $300\,\mathrm{W}\,\mathrm{m}^{-2}$,
against the $6.29 \cdot 10^{7}\,\mathrm{W}\,\mathrm{m}^{-2}$ radiated by the photosphere. Jostling of
the footpoints by granulation at about 1 km s⁻¹ with a coronal field of 50 G supplies an energy
flux of about 20 kW m⁻². How it is converted into heat historically divided the field into two
schools: dissipation of waves against braiding of field lines with many small energy releases;
the review also lists turbulence and Taylor relaxation models
([Cranmer and Winebarger 2019](literatur:cranmer-2019)).

The corona turns into the solar wind: slow, dense wind at 250 to 450 km s⁻¹ and fast, tenuous
wind at 500 to 800 km s⁻¹; streams from large coronal holes reach 700 to 900 km s⁻¹ at 1 au; the
slow wind has several sources, such as active regions and the edges of coronal holes
([Cranmer and Winebarger 2019](literatur:cranmer-2019)). At 09:33 UT on 28 April 2021 Parker Solar
Probe dipped 13 million km above the photosphere below the Alfvén surface for five hours, into
plasma in which the magnetic pressure exceeded both ion and electron pressure; the Alfvén Mach
number was 0.79 ([Kasper et al. 2021](literatur:kasper-2021)). From the probe's measurements, the
longitudinally averaged Alfvén radius grew with activity from 11 to 16 $R_\odot$, and the braking
torque of the wind from $1.4 \cdot 10^{23}$ to $3 \cdot 10^{23}\,\mathrm{N}\,\mathrm{m}$; the surface
is highly structured and 30 % larger than in simulations with the same mass loss and open flux
([Finley 2025](literatur:finley-2025)).

The wind inflates the heliosphere. On 25 August 2012 at 122 au the heliospheric ions vanished at
Voyager 1 and galactic cosmic rays rose abruptly, yet the magnetic field still pointed to the
heliosphere ([Stone et al. 2013](literatur:stone-2013)). Only plasma oscillations at 2.6 kHz from
9 April 2013 established the crossing, corresponding to about 0.08 electrons per cm³ as expected
in the interstellar medium, against about 0.002 in the outer heliosphere
([Gurnett et al. 2013](literatur:gurnett-2013)). Voyager 2 crossed the heliopause on 5 November
2018 at 119 au ([Stone et al. 2019](literatur:stone-2019)).

The magnetic field organises the cycle. By Hale's polarity laws the preceding and following spots
of a group have opposite polarity, groups in the two hemispheres likewise, and the polarity reverses
from one cycle to the next. By Joy's law the following spot lies farther from the equator; its flux
migrates poleward and reverses the polar fields around maximum, so that one magnetic cycle spans
two sunspot cycles. At the start of a cycle the centroid of the sunspot area lies at about 28°
latitude; it drifts towards the equator and stops at about 7°. Cycles 1 to 22 lasted 131.7 months
on average, almost exactly eleven years ([Hathaway 2015](literatur:hathaway-2015)). The 13-month
smoothed sunspot number peaked at 116.4 in April 2014 in cycle 24 and at 160.9 in October 2024 in
cycle 25 ([SILSO World Data Center 2026](literatur:silso-2026)).

## Orbit, rotation and dynamics

The surface rotates differentially. The fact sheet gives the sidereal rate as a function of
heliographic latitude $B$ as

$$\omega = \left(14.37 - 2.33\,\sin^2 B - 1.56\,\sin^4 B\right)^\circ\,\mathrm{d}^{-1}$$

([NSSDC Sun Fact Sheet](quelle:nssdc-sun)); one rotation takes 25.05 days at the equator, 30.65
at 60° latitude and 34.35 days at the poles. Magnetic features rotate faster than the plasma:
according to Snodgrass's measurements they follow $462 - 74\,\sin^2 B - 53\,\sin^4 B$ nHz, the
Doppler rate of the plasma $452 - 49\,\sin^2 B - 84\,\sin^4 B$ nHz; the usual explanation is that
the features are anchored deeper, where rotation is faster ([Howe 2009](literatur:howe-2009)).

The [IAU rotation model](thema:bezugssysteme) gives for the Sun
$W = 84.176^\circ + 14.1844000^\circ\,d$, corrected for light travel time and unchanged since the
2009 report ([Archinal et al. 2018](literatur:archinal-2018), Table 1); the expressions for the Sun
and Earth are intended for comparison only ([Archinal et al. 2011](literatur:archinal-2011)). The
rate gives 25.380 days or 609.12 hours sidereal, the traditional sidereal period of Carrington's
system ([Gonzalez 2025](literatur:gonzalez-2025)), and, as seen from the moving Earth, 27.275 days
synodic. In the fact-sheet
law the surface rotates at this rate at 16.0° latitude, in the law for magnetic features at 16.1°;
by the Doppler measurement the plasma rotates more slowly even at the equator, at 14.06° per day.
The pole at $\alpha_0 = 286.13^\circ$, $\delta_0 = 63.87^\circ$ has no rates; the solar equator is
inclined by 7.25° to the J2000 ecliptic, with its ascending node at 75.77° ecliptic longitude.

The Sun is not at rest. With the positions and masses from Orrery's data sets, its centre lay
between 0.06 and 2.11 $R_\odot$ from the barycentre of the Solar System from 1800 to 2050,
1.21 $R_\odot$ on average, and moved relative to it at 8.5 to 16.1 m s⁻¹.
[Jupiter](objekt:jupiter) alone shifts the barycentre by 1.07 $R_\odot$. The closest approaches
to the barycentre recur on average every 19.86 years, the synodic period of Jupiter and Saturn;
Perryman and Schulze-Hartung call a suspected link between this motion and solar activity unproven
([Perryman and Schulze-Hartung 2011](literatur:perryman-2011)). The top view
[The Solar System from above](szene:systemblick) shows the planets around the resting Sun.

## Formation and evolution

[Calcium–aluminium-rich inclusions](thema:entstehung) in meteorites formed
$4567.30 \pm 0.16$ million years ago ([Connelly et al. 2012](literatur:connelly-2012)).
Christensen-Dalsgaard identifies, for simplicity, the age of the meteorites with the Sun's arrival
on the main sequence, because planet formation probably took no longer than the contraction of the
star. Helioseismology gives an independent age that depends on the composition: with the older,
metal-rich one the best model, at 4.57 billion years, matches the meteoritic age; with that of
2009 it gives 4.77 billion, clearly inconsistent with it
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

As hydrogen is turned into helium in the core, the mean molecular weight rises and the luminosity
grows. On arrival on the main sequence 4.57 billion years ago it was, according to standard models,
about 30 % below its present value; except for the first 0.2 billion years, approximately

$$\frac{L(t)}{L_\odot} = \frac{1}{1 + \frac{2}{5}\left(1 - \frac{t}{t_\odot}\right)}$$

with the age $t$ since the arrival on the main sequence and the present age
$t_\odot = 4.57$ billion years ([Feulner 2012](literatur:feulner-2012)). By radiative balance, a
change of 30 % of the present value shifts the Earth's surface temperature by about 20 K
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)). For the early Earth, stellar
models predict about 25 % less insolation; without compensation it would have been frozen for the
first two billion years, yet there was liquid water and life in the Archean. Most solutions invoke
more greenhouse gases, all face considerable difficulties, and the faint young Sun problem is
regarded as unsolved ([Feulner 2012](literatur:feulner-2012)). Other proposals are less cloud
cover, a stronger young solar wind that damped cosmic rays and thereby cloud formation, or an
initially more massive Sun ([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

After core hydrogen burning ends, the Sun ascends as a red giant to more than 2000 solar
luminosities. At about 80 MK helium ignites in the degenerate core in a helium flash. In these
models the Sun sheds its envelope at an age of about 12.4 billion years, 7.8 billion years from
now, leaving a hot, compact core of carbon and oxygen that cools as a white dwarf. Calculations by
Schröder and Smith including mass loss, tidal interaction and drag in the solar atmosphere show
that planets with a present distance below about 1.15 au are engulfed at the tip of the red-giant
branch, so the Earth probably is as well
([Christensen-Dalsgaard 2021](literatur:christensen-dalsgaard-2021)).

## Open questions

- **Coronal heating:** the Fe XIX line, which forms at 8.9 MK, is present weakly throughout an
  active region; this points to infrequent heating events such as small reconnection events
  (nanoflares). Coronal rain, in contrast, requires nearly steady heating at the footpoints, as
  expected from wave models; the processes that heat the corona and accelerate the wind have not
  been identified definitively ([Cranmer and Winebarger 2019](literatur:cranmer-2019)). A
  measured Alfvén-wave flux suffices for active regions only if almost all of it reaches the
  corona ([Klimchuk 2006](literatur:klimchuk-2006)).
- **Abundance problem:** Magg et al. derive $Z/X = 0.0225$ and find that models with it match
  helioseismology again ([Magg et al. 2022](literatur:magg-2022)); Asplund et al. stay at 0.0187
  ([Asplund et al. 2021](literatur:asplund-2021)). Buldgen et al. show that metal-rich models that
  also reproduce the lithium depletion come into tension with seismology and neutrinos
  ([Buldgen et al. 2023](literatur:buldgen-2023)), and infer from seismology an opacity about 10 %
  higher at around 2 MK than the models use ([Buldgen et al. 2025](literatur:buldgen-2025)). The CNO
  neutrinos stand at about 2σ against the metal-poor composition; together with ⁷Be and ⁸B they
  disfavour the metal-poor standard model at 3.1σ ([Appel et al. 2022](literatur:appel-2022)).
- **Cycle strength:** the physics-based forecasts for cycle 25 converged on 110.5 ± 13.5
  ([Nandy 2021](literatur:nandy-2021)); McIntosh et al. expected, from the spacing of "terminator"
  events, a cycle among the strongest since records began
  ([McIntosh et al. 2020](literatur:mcintosh-2020)). At 160.9
  ([SILSO World Data Center 2026](literatur:silso-2026)) it fell in between. The polar fields at
  minimum serve as a precursor; Tobias et al., in contrast, consider the dynamo deterministically
  chaotic and thus inherently unpredictable ([Hathaway 2015](literatur:hathaway-2015)).
- **Oblateness and young Sun:** limb shape and seismic calculation disagree in magnitude and in
  their variation with activity ([Meftah and Mecheri 2025](literatur:meftah-2025)); for the faint
  young Sun no solution is regarded as secure ([Feulner 2012](literatur:feulner-2012)).

## In the model

- **Position:** Orrery fixes the Sun at the origin and computes all orbits heliocentrically,
  consistent with the heliocentric elements; the positions of the bodies relative to the Sun are
  therefore correct within the accuracy of the tables. The barycentre, about which the Sun moves by
  up to 2.1 $R_\odot$ or 1.47 million km, does not appear.
- **Rotation:** the Sun rotates rigidly with the period of the data set, 609.12 h, equal to the
  Carrington rate to within $3 \cdot 10^{-6}$ degrees per day, i.e. like the surface at 16°
  latitude; equator and poles do not rotate differently. The phase is zero at the epoch and counts
  from the direction into which the orientation of the sphere brings the map centre, 21.8° west of
  the node $Q$. The prime meridian therefore lies 106.0° behind the IAU prime meridian with
  $W_0 = 84.176^\circ$. Since the map shows no real features, this is not visible, but
  heliographic longitudes in the model are off by this angle.
- **Pole:** it is fixed at the IAU values, which have no rates for the Sun; the conversion to the
  ecliptic uses the obliquity 84,381.448″.
- **Mass and GM:** the data set lists $1.9885 \cdot 10^{30}\,\mathrm{kg}$; times $G$ from CODATA
  2018 this gives $1.327185 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$, 45 ppm above the nominal
  value and DE440. With the $1.9884 \cdot 10^{30}\,\mathrm{kg}$ of the current fact sheet it would
  be 5 ppm below. The Kepler orbital periods in the data block therefore come out about 23 ppm too
  short.
- **Data block:** the diameter of 1,391,400 km is twice the nominal radius, which the 2015 report
  of the IAU working group also lists as the solar radius
  ([Archinal et al. 2018](literatur:archinal-2018), Table 4); the measured radius would give
  1,391,316 ± 280 km. The rotation period of 25.4 days is the sidereal Carrington period,
  neither the synodic one of 27.3 days nor that at the equator. The axial tilt of 7.3° is the
  rounded angle of 7.252° between pole and ecliptic normal. Mass (1.99 · 10³⁰ kg) and pole
  (286.13°, 63.87°) are shown as in the data set.
- **Size:** the displayed radius is $R_\odot$ times the size factor times the value of the "Damp
  the Sun" slider (0.1 to 1): 1 times in "Realistic", $50 \cdot 0.35 = 17.5$ times in "Diagram"
  (0.081 au), $200 \cdot 0.2 = 40$ times in "Compact" (0.186 au), i.e. reduced by a factor of 2.9
  or 5 relative to the planets. Undamped, it would reach 0.93 au in "Compact", beyond the displayed
  positions of Mercury (0.73 au) and Venus (0.88 au) on 19 September 2026. In "Diagram" it appears
  9.3° across from the Earth instead of 0.53°, and 1.2° instead of 64″ in the scene
  [From Neptune to the distant Sun](szene:ferne-sonne).
- **Appearance:** the Sun is an unlit material with the map as colour texture. Because the switch
  of the base colour to white runs only for lit bodies, the fallback colour #fdb813 remains as a
  factor: the linear map mean (0.874, 0.246, 0.034) becomes (0.859, 0.118, 0.0002), after the tone
  curve and sRGB about (237, 112, 21) of 255 before the glow; the disc appears deep orange, with
  almost no blue. The artistic map has 2134 km per pixel at the equator and so shows neither
  granulation nor spots; limb darkening is missing. The brightness slider and exposure do not act
  on the Sun. Only the Sun receives the glow (switch "Glow"), with strength 0.7 or 1.1 depending on
  the quality tier, none in the lowest.
- **Light:** a white point light sits at the displayed centre of the Sun and by default falls off
  with the square of the displayed distance ("Light falloff" slider); at 1 au the irradiance is
  calibrated to brightness times exposure. Exposure and distance compensation are described in
  [Albedo and brightness](thema:photometrie).
- **Shadows:** the shadow calculation treats the Sun as a uniformly bright disc with the true
  angular radius from the true radius and distance, and counts the covered fraction of its area.
  With Eddington limb darkening a small body in front of the disc centre would block 25 % more
  light than its area fraction, near the limb only half ([Eclipses](thema:finsternis)).
- Orrery computes neither the irradiance in W m⁻² and its variation nor cycle, spots, corona, wind
  or heliosphere; the lighting uses only the irradiance relative to 1 au. Further
  simplifications: [Limits of the model](thema:modell).

*As of September 2026*
