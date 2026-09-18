# Interior structure from gravity and rotation

Nobody can look inside a planet. What can be measured are mass and radius, and hence the mean
density, the external gravity field, the rotation of the body in space, its deformation by tides
and, where seismometers stand, the travel times of waves. Each of these quantities constrains the
density distribution in a different way; only together do they separate core, mantle and envelope.
This text covers the gravitational potential, the moment of inertia factor from precession,
libration and the hydrostatic approximation, Love numbers, seismology and the dilute cores of the
giant planets, and what Orrery reproduces of them.

## Gravitational potential and spherical harmonics

Outside a body the gravitational potential can be expanded in spherical harmonics. The IERS
Conventions write the expansion with normalized coefficients
([Petit and Luzum 2010](literatur:petit-2010), Eqs. 6.1 to 6.3); with unnormalized ones it reads the
same:

$$V(r, \varphi, \lambda) = \frac{GM}{r} \sum_{n=0}^{\infty} \left( \frac{a}{r} \right)^n \sum_{m=0}^{n} \left[ C_{nm} \cos m\lambda + S_{nm} \sin m\lambda \right] P_{nm}(\sin\varphi)$$

Here $\varphi$ and $\lambda$ are latitude and longitude, $a$ is the reference radius, $P_{nm}$ are
the associated Legendre functions and $C_{00} = 1$. With the origin at the centre of mass the
degree-one terms vanish. The zonal coefficients ($m = 0$) are written with the opposite sign as
$J_n$; with the IERS normalization for $m = 0$ ([Petit and Luzum 2010](literatur:petit-2010), Eqs.
6.2b and 6.3)

$$J_n = -C_{n0} = -\sqrt{2n + 1}\,\bar{C}_{n0}$$

The degree-two terms depend directly on the principal moments of inertia $A < B < C$
([Margot et al. 2012](literatur:margot-2012)):

$$J_2 = \frac{C - (A + B)/2}{M a^2}, \quad C_{22} = \frac{B - A}{4 M a^2}$$

$J_2$ thus only measures by how much the polar moment of inertia exceeds the mean equatorial one,
not $C$ itself. Obtaining $C$ requires a second, independent relation: the rotation of the body in
space or the assumption of hydrostatic equilibrium.

The coefficients come from tracking spacecraft. For [Jupiter](objekt:jupiter), Juno's ten gravity
passes up to December 2018 gave, at the reference radius of 71,492 km,
$J_2 = 14696.5735 \cdot 10^{-6}$, $J_4 = -586.6085 \cdot 10^{-6}$ and $J_6 = 34.2007 \cdot 10^{-6}$,
with uncertainties of a few $10^{-9}$ (3σ; [Durante et al. 2020](literatur:durante-2020), Table 2).
Without internal flows the field of a rotating fluid planet would be axially and north–south
symmetric and dominated by the even coefficients, with $J_{2n}$ roughly proportional to $q^n$; $q$
is the ratio of centrifugal acceleration to gravity at the equator
([Iess et al. 2018](literatur:iess-2018)). With $q = 0.0892$ for Jupiter
([Militzer and Hubbard 2023](literatur:militzer-2023), Table 1) the measured values give
$J_2/q = 0.165$, $J_4/q^2 = -0.074$ and $J_6/q^3 = 0.048$. The odd coefficients $J_3$, $J_5$, $J_7$
and $J_9$, by contrast, measure how deep the winds of the individual zones reach. Juno found a
north–south asymmetry, the signature of flows in the atmosphere and interior
([Iess et al. 2018](literatur:iess-2018)); thus $J_3 = (-0.0450 \pm 0.0033) \cdot 10^{-6}$ (3σ;
[Durante et al. 2020](literatur:durante-2020)). Accordingly the winds reach about 3000 km deep on
Jupiter and about 9000 km on [Saturn](objekt:saturn); on Saturn they contribute about 6 % of $J_6$
and dominate from $J_8$ upwards ([Militzer and Hubbard 2023](literatur:militzer-2023)). For the
giant planets the gravity field responds mainly to the outer layers anyway and constrains the cores
only loosely ([Mankovich and Fuller 2021](literatur:mankovich-2021)).

## Moment of inertia factor

The moment of inertia factor $C/(M R^2)$ condenses the radial mass distribution into one number. For
a homogeneous sphere it is 2/5; if density increases inwards it falls below that, and the further it
falls, the more strongly the dense material is concentrated towards the centre
([Moment of inertia factor (Wikipedia)](quelle:wikipedia-en-moment-of-inertia-factor)). The value
depends on the chosen radius: for giant planets many authors use the equatorial radius at 1 bar,
others the volumetric radius ([Militzer and Hubbard 2023](literatur:militzer-2023)). Jupiter's
0.26393 at the equatorial radius thus becomes 0.2761 at the volumetric radius.

**Precession.** The Sun and moons exert a torque on the equatorial bulge, and the spin axis
precesses at a rate that depends on $H = [C - (A + B)/2]/C$. Together with $J_2$ this yields $C$;
this is how the values for Earth and Mars were obtained
([Margot et al. 2012](literatur:margot-2012)). For the [Earth](objekt:earth) the numerical standards
$J_2 = 1.0826359 \cdot 10^{-3}$ and $H = 3.273795 \cdot 10^{-3}$
([Petit and Luzum 2010](literatur:petit-2010), Table 1.1) give $C/(M a^2) = J_2/H = 0.330698$. For
[Mars](objekt:mars), radio data from Pathfinder and the Viking landers gave a precession of −7576 ±
35 milliarcseconds (mas) per year in 1997, an indication of a dense core
([Folkner et al. 1997](literatur:folkner-1997)). Radio tracking of the InSight lander yielded
−7598.1 ± 2.2 mas per year in 2023 and from it a normalized polar moment of inertia of 0.36419 ±
0.00011 ([Le Maistre et al. 2023](literatur:le-maistre-2023)). The supplement of the paper gives the
relation

$$\frac{C}{M R_\mathrm{e}^2} = -1415393\,\frac{J_2}{\dot{\psi} - \dot{\psi}_\mathrm{g}}$$

with the rates in mas per year, the geodetic precession $\dot{\psi}_\mathrm{g}$ of 6.754 mas per
year, $J_2 = 0.0019566$ and the reference radius of 3396 km; referred to the mean radius of 3389.5
km the mean moment of inertia is 0.36428 ± 0.00011
([Le Maistre et al. 2023](literatur:le-maistre-2023), Supplement section 5). For Jupiter and Saturn
one precession cycle takes about 0.5 and 2 million years
([Militzer and Hubbard 2023](literatur:militzer-2023)). For Saturn the measurement succeeded
nevertheless, from ring occultations, satellite orbits and observations reaching back to 1891:
0.2258 ± 0.0025 (1σ, reference radius 60,330 km; [Jacobson 2022](literatur:jacobson-2022), Table 8).

**Radau–Darwin approximation.** For bodies in hydrostatic equilibrium the Radau–Darwin approximation
estimates the moment of inertia factor from shape, rotation and gravity
([Moment of inertia factor (Wikipedia)](quelle:wikipedia-en-moment-of-inertia-factor)); it assumes a
unique relation between $J_2$, rotation and moment of inertia. Here it is written with the fluid
Love number $k_\mathrm{f}$; the form in the source is equivalent
([Militzer and Hubbard 2023](literatur:militzer-2023), Eq. 16):

$$\frac{C}{M a^2} = \frac{2}{3}\left( 1 - \frac{2}{5}\sqrt{\frac{4 - k_\mathrm{f}}{1 + k_\mathrm{f}}} \right), \quad k_\mathrm{f} = \frac{3 J_2}{q}, \quad q = \frac{\omega^2 a^3}{GM}$$

The form $k_\mathrm{f} = 3 J_2/q$ holds for a rotating planet. For a synchronously rotating moon,
rotation and tide act together; in hydrostatic equilibrium, $J_2 = \frac{5}{6}\,k_\mathrm{f}\,q$ and
$C_{22} = \frac{1}{4}\,k_\mathrm{f}\,q$ with $q = \omega^2 R^3/(GM)$, and the Radau–Darwin formula
relates $k_\mathrm{f}$ to the moment of inertia in the same way
([Hemingway et al. 2018](literatur:hemingway-2018), Eqs. 15, 16 and 21). For the homogeneous sphere
$k_\mathrm{f} = 3/2$, and the formula gives exactly 2/5. It becomes exact in the limit of slow
rotation and large $J_2$, that is, for nearly homogeneous bodies
([Militzer and Hubbard 2023](literatur:militzer-2023)). Its validity has limits:

- It presupposes hydrostatic equilibrium and even then remains an approximation; even for a
  hydrostatic body $J_2$ and $C_{22}$ do not correspond to a unique moment of inertia
  ([Gomez Casajus et al. 2022](literatur:gomez-casajus-2022)).
- For Jupiter and Saturn it is too inaccurate, because both rotate rapidly and their density varies
  strongly throughout the interior ([Militzer and Hubbard 2023](literatur:militzer-2023)). With
  their $J_2$ and $q$ it gives 0.2582 for Jupiter, 2.2 % below the model value 0.26393, and 0.2193
  for Saturn, 0.5 % above the model value 0.2181.
- Non-hydrostatic contributions corrupt $J_2$: solid bodies, too, support non-hydrostatic topography
  at their exteriors, and measured shape and gravity reflect a mostly hydrostatic body with
  superimposed non-hydrostatic parts ([Hemingway et al. 2018](literatur:hemingway-2018), section
  2.1.6). For Mars the formula with $q = 0.00459$ gives 0.3751, 3.0 % more than the precession. The
  shape and gravity field of Mars can be explained if on long time scales it behaves like a fluid
  beneath a solid shell with embedded mass anomalies; gravity field and shape then have a
  non-hydrostatic part ([Le Maistre et al. 2023](literatur:le-maistre-2023), Supplement section 10).
  For the Earth the formula gives 0.3315, 0.25 % above $J_2/H$.
- For synchronously rotating moons, rotation and tide together produce $J_2$ and $C_{22}$ in the
  hydrostatic ratio 10/3. This ratio is necessary but not sufficient for hydrostatic equilibrium
  ([Durante et al. 2019](literatur:durante-2019)).

**Libration and obliquity.** Where no precession can be measured, the rotation itself reveals the
interior. For [Mercury](objekt:mercury), Peale proposed in 1976 to combine four quantities: $J_2$
and $C_{22}$ from the gravity field, the obliquity of the spin axis in Cassini state 1 and the
amplitude of the forced libration in longitude. Obliquity and gravity field give $C/(M R^2)$. The
solar torque on the asymmetric figure, and hence the libration, are proportional to
$(B - A)/C_\mathrm{m}$, where $C_\mathrm{m}$ is the moment of inertia of the outer shell that
librates on its own above a liquid core ([Margot et al. 2012](literatur:margot-2012), Eq. 3):

$$\frac{C_\mathrm{m}}{C} = \frac{4\,C_{22}}{C/(M R^2)} \left( \frac{B - A}{C_\mathrm{m}} \right)^{-1}$$

Radar observations at 35 epochs from 2002 to 2012 gave an obliquity of 2.04′ ± 0.08′ and a libration
of 38.5″ ± 1.6″, about 450 m at the equator, that is
$(B - A)/C_\mathrm{m} = (2.18 \pm 0.09) \cdot 10^{-4}$. With $J_2 = 5.031 \cdot 10^{-5}$ and
$C_{22} = 0.809 \cdot 10^{-5}$ from MESSENGER this yields $C/(M R^2) = 0.346 \pm 0.014$ and
$C_\mathrm{m}/C = 0.431 \pm 0.025$: only 43 % of the moment of inertia takes part in the libration.
A two-layer model with these values has a core of 1998 km radius, 82 % of the planetary radius
([Margot et al. 2012](literatur:margot-2012)). The MESSENGER radio data later gave a mean obliquity
of 1.968′ ± 0.027′ and hence $0.333 \pm 0.005$ (both 3σ); the matching models have a solid inner
core with 0.3 to 0.7 of the radius of the outer core ([Genova et al. 2019](literatur:genova-2019)).
Margot et al. urge caution: according to a calculation they cite, a core–mantle boundary that is not
axially symmetric can shift inferences on the mantle density by 10 to 20 %.

For the [Moon](objekt:moon), laser ranging also captures its rotation; its analysis determines
$(C - A)/B$ and $(B - A)/C$, and with $J_2$ and $C_{22}$ from GRAIL the mean moment of inertia of
the solid Moon comes out as $0.392728 \pm 0.000012$. The same data also show the flattening of the
fluid outer core and the dissipation at its solid boundaries
([Williams et al. 2014](literatur:williams-2014)). Laser ranging is sensitive to the fluid core
because core and mantle exchange angular momentum. An extended dynamical model gave a core
flattening of $(2.2 \pm 0.6) \cdot 10^{-4}$, which matches the hydrostatic value for a core–mantle
boundary radius of 381 ± 12 km; the core would then hold 1.59 to 1.77 % of the mass
([Viswanathan et al. 2019](literatur:viswanathan-2019)).

For Mars, InSight saw the nutation amplified by a resonance with the free core nutation. The
amplification factor of 0.0615 ± 0.007 depends mainly on the core radius, the period of −243 ± 3.3
days mainly on the shape of the core. If the mantle is entirely solid, this implies a liquid core of
1835 ± 55 km radius and a mean density of 5955 to 6290 kg/m³
([Le Maistre et al. 2023](literatur:le-maistre-2023)).

## Love number k₂ as a constraint

Measured deformations allow the density profile of the Earth's interior to be estimated; for gas
planets the flattening is the main indicator
([Love numbers, German Wikipedia](quelle:wikipedia-de-love-zahlen)). Rotation and, for synchronously
rotating moons, the static tide deform a body over very long times; how strongly its gravity field
responds is described by the fluid Love number $k_\mathrm{f}$, which Radau–Darwin relates to the
moment of inertia ([Hemingway et al. 2018](literatur:hemingway-2018), Eqs. 10 to 12). The varying
tides also deform it at their period, which is described by $k_2$ (definition and measured values
under [Tides and the Roche limit](thema:gezeiten)). If the two differ, part of the body does not
behave like a fluid at the tidal period. Titan's gravity field, fitted to $J_2$ and $C_{22}$
together with the relations for synchronously rotating moons, thus corresponds to a $k_\mathrm{f}$
of about 1.01 (recomputed with Durante's $J_2$ and $C_{22}$: 1.00 from $J_2$ alone, 1.05 from
$C_{22}$ alone), but its tidal response only to a $k_2$ of about 0.62
([Durante et al. 2019](literatur:durante-2019)); how large $k_2$ really is remains disputed (see
[Tides and the Roche limit](thema:gezeiten)).

For Mars, $k_2 = 0.169 \pm 0.006$, the period of the free polar motion (Chandler period) of 206.9 ±
0.5 days and the moments of inertia from the precession enter the interior models together; the
Chandler period constrains the rheology of the mantle, in particular its frequency dependence over
long periods ([Konopliv et al. 2020](literatur:konopliv-2020)). For the Moon, density, moment of
inertia and $k_2$ fit models with a fluid outer core of 200 to 380 km radius, a solid inner core of
0 to 280 km and a zone of low shear-wave velocity deep in the mantle; the whole core holds at most
1.5 % of the mass ([Williams et al. 2014](literatur:williams-2014)). Jupiter's
$k_{22} = 0.565 \pm 0.018$ (3σ), determined with the same Love number for all moons, lies below the
prediction of static interior models for the tide raised by Io; with satellite-dependent Love
numbers the uncertainty for Io grows to 0.074, the deviation from the static value lies below it and
is therefore not yet established ([Durante et al. 2020](literatur:durante-2020)). For its
interpretation see [Tides and the Roche limit](thema:gezeiten).

## Seismology

Seismic models, too, use mass and moment of inertia as constraints. The reference model PREM of the
[Earth](objekt:earth) was built from about 1000 normal-mode periods, 500 summary travel times, 100
quality factors, mass and moment of inertia, and 1.75 million travel times of P and S waves
([Dziewonski and Anderson 1981](literatur:dziewonski-1981)).

On the Moon, the seismometers of the Apollo missions recorded. A reanalysis with array-seismology
methods pointed in 2011 to a solid inner and a fluid outer core beneath a partially molten layer,
about 60 % liquid by volume ([Weber et al. 2011](literatur:weber-2011)). Two analyses of the Apollo
data from the same year left the size of the fluid core open by ±55 km; the radius from laser
ranging agrees to 0.3 % with one of them (Garcia et al. 2011) and differs by 13 % from the other
(Weber et al.) ([Viswanathan et al. 2019](literatur:viswanathan-2019)).

On Mars, InSight provided a single seismometer. Waves reflected from the core–mantle boundary,
inverted together with geodetic data, gave in 2021 a liquid core of 1830 ± 40 km radius and a mean
density of 5.7 to 6.3 g/cm³, which requires many light elements in the iron
([Stähler et al. 2021](literatur:staehler-2021)).

At Saturn the [rings](thema:ringe) serve as a seismometer. During stellar occultations Cassini
observed waves in the C ring that are excited by oscillation modes of the planet, mainly fundamental
modes (f modes), and in addition gravity modes (g modes). A mode excites the ring particles at its
Lindblad resonance; the azimuthal order $m$ is read off the shape of the wave. g modes are restored
by buoyancy; that Saturn shows them means that part of its interior is stabilized against convection
by a composition gradient. Mankovich and Fuller identified the wave W76.44 with the g mode with
$l = 2$ and $m = -2$ of lowest radial order. Together with $J_2$, $J_4$, $J_6$ and the frequencies
of three of the four observed waves with $m = -2$, this requires a stably stratified transition zone
between core and envelope out to $r/R = 0.59 \pm 0.01$ containing about 17 Earth masses of ice and
rock ([Mankovich and Fuller 2021](literatur:mankovich-2021)).

## Dilute cores of the giant planets

Conventional models of the giant planets consist of a few chemically homogeneous layers, usually
with a discrete core of heavy elements at the centre
([Mankovich and Fuller 2021](literatur:mankovich-2021)). Juno's $J_4$ and $J_6$, however, are
smaller in magnitude than such models with a large, distinct core predict
([Militzer et al. 2022](literatur:militzer-2022)). Already after the first two orbits it emerged
that a dilute core helps, with its heavy elements spread over 0.3 to 0.5 of the planetary radius;
depending on the equation of state and the degree of dilution the core contains 7 to 25 Earth masses
of heavy elements, more dilute cores more, and the deep metallic envelope is in any case more
enriched than the outer molecular one ([Wahl et al. 2017](literatur:wahl-2017)). Models with winds
and an equation of state from ab initio calculations match all measured coefficients with a dilute
core extending to 63 % of the radius, in which heavy elements make up only 18 % of the mass
([Militzer et al. 2022](literatur:militzer-2022)).

Jupiter's moment of inertia has not been measured directly; the table value below is a model
calculation ([Moment of inertia factor (Wikipedia)](quelle:wikipedia-en-moment-of-inertia-factor)).
$J_2$, $J_4$ and $J_6$ do not determine it uniquely but constrain it to better than 1 %; models that
match all coefficients up to $J_{10}$ give 0.26393 ± 0.00001
([Militzer and Hubbard 2023](literatur:militzer-2023)). The precession of the axis is inversely
proportional to the moment of inertia; Durante et al. expected in 2020 that it would be measured
more accurately towards the end of the Juno mission ([Durante et al. 2020](literatur:durante-2020)).
No such measurement has been published so far.

## Moment of inertia factors compared

Quantities, radii and uncertainties are given as in the sources, the σ level where stated. Ganymede
has the lowest value among the solid bodies of the Solar System, while the Moon is nearly
homogeneous apart from a small core
([Moment of inertia factor (Wikipedia)](quelle:wikipedia-en-moment-of-inertia-factor)).

| Body | Value | Quantity and radius | Method | Reference |
|---|---|---|---|---|
| Earth | 0.330698 (formal ±0.0000001) | $C/(M a^2)$, $a$ = 6378.1366 km | precession ($H$) and $J_2$ | [Petit and Luzum 2010](literatur:petit-2010) |
| Moon | 0.392728 ± 0.000012 | mean moment of inertia of the solid Moon | rotation from laser ranging, $J_2$ and $C_{22}$ from GRAIL | [Williams et al. 2014](literatur:williams-2014) |
| Mars | 0.36419 ± 0.00011 | $C/(M a^2)$, $a$ = 3396 km | precession from InSight and Viking radio data, $J_2$ | [Le Maistre et al. 2023](literatur:le-maistre-2023) |
| Mercury | 0.346 ± 0.014 (1σ); 0.333 ± 0.005 (3σ) | $C/(M R^2)$ | obliquity in the Cassini state from radar or MESSENGER radio data, $J_2$, $C_{22}$ | [Margot et al. 2012](literatur:margot-2012); [Genova et al. 2019](literatur:genova-2019) |
| Jupiter | 0.26393 ± 0.00001 | $C/(M a^2)$, $a$ = 71,492 km | not measured: interior models fitted to $J_2$ to $J_{10}$ | [Militzer and Hubbard 2023](literatur:militzer-2023) |
| Saturn | 0.2258 ± 0.0025 (1σ); model 0.2181 ± 0.0002 | $C/(M a^2)$, $a$ = 60,330 km; model 60,268 km | pole precession from ring occultations and satellite orbits; model with winds, fitted to the gravity field | [Jacobson 2022](literatur:jacobson-2022); [Militzer and Hubbard 2023](literatur:militzer-2023) |
| Ganymede | 0.3159 ± 0.0052 (16th to 84th percentile) | model of volume-equivalent spherical layers | $J_2$ and $C_{22}$ from Juno (2021) and Galileo, three-layer model with a non-hydrostatic part as for Titan | [Gomez Casajus et al. 2022](literatur:gomez-casajus-2022) |
| Titan | 0.343 ± 0.001 | $C/(M R^2)$ | $J_2$ and $C_{22}$ from ten Cassini flybys, Radau–Darwin | [Petricca et al. 2025](literatur:petricca-2025) |

Earlier Galileo analyses had obtained 0.3105 ± 0.0028 for Ganymede, enforcing the hydrostatic ratio
10/3 and using the Radau–Darwin approximation; the new, higher central value points to a somewhat
less differentiated [Ganymede](objekt:ganymede), and the larger uncertainty accounts for
non-hydrostatic contributions ([Gomez Casajus et al. 2022](literatur:gomez-casajus-2022)).

## Open questions

- **Size and state of the Martian core:** Seismology and nutation consistently gave a large liquid
  core, 1830 ± 40 km ([Stähler et al. 2021](literatur:staehler-2021)) and 1835 ± 55 km
  ([Le Maistre et al. 2023](literatur:le-maistre-2023)). The amount of light elements this requires,
  however, does not fit petrological experiments ([Samuel et al. 2023](literatur:samuel-2023)) and
  exceeds the volatile elements that the likely building blocks of Mars provided
  ([Khan et al. 2023](literatur:khan-2023)). If a molten silicate layer lies above the core, the
  core becomes smaller and denser: 1675 ± 30 km with 6.65 ± 0.1 g/cm³ beneath a layer 150 ± 15 km
  thick, derived from multiply diffracted P waves ([Khan et al. 2023](literatur:khan-2023)), or 1650
  ± 20 km with 6.5 g/cm³ in a layered mantle that is also consistent with the tidal dissipation
  caused by Phobos ([Samuel et al. 2023](literatur:samuel-2023)). According to the nutation as well,
  the metallic core could be more than 200 km smaller if the lowermost mantle is molten and rotates
  independently ([Le Maistre et al. 2023](literatur:le-maistre-2023)). Whether part of the core is
  solid remains disputed: the nutation data show no trace of an inner core; with many light elements
  and sulphur close to the eutectic, the melting temperature lies far below the expected core
  temperature, so an inner core is highly unlikely
  ([Le Maistre et al. 2023](literatur:le-maistre-2023)). Bi et al., in contrast, found in 2025
  phases that traverse the core or reflect off an inner core, and determined its radius as 613 ± 67
  km ([Bi et al. 2025](literatur:bi-2025)).
- **The lunar core:** Apollo seismology pointed to a solid inner core
  ([Weber et al. 2011](literatur:weber-2011)); the geodetic data allow an inner core of 0 to 280 km,
  so they do not require one, and limit the whole core to at most 1.5 % of the mass
  ([Williams et al. 2014](literatur:williams-2014)). The hydrostatic core flattening from laser
  ranging, in contrast, gives 1.59 to 1.77 %
  ([Viswanathan et al. 2019](literatur:viswanathan-2019)). Matching geodetic constraints with
  thermodynamic models gave an inner core of 258 ± 40 km radius, within a scenario of early mantle
  overturn ([Briaud et al. 2023](literatur:briaud-2023)).
- **Jupiter's dilute core:** How far it extends depends on the equation of state and assumptions.
  Besides cores reaching 63 % of the radius ([Militzer et al. 2022](literatur:militzer-2022)),
  modified equations of state also yield small dilute cores comprising only about 20 % of the mass,
  which agree better with formation and evolution models; all these models require a higher internal
  entropy than is usually assumed from the Galileo probe measurements
  ([Howard et al. 2023](literatur:howard-2023)). Moreover, the gravity field requires a lower
  density between 10 and 100 GPa than an envelope with the heavy-element enrichment measured in the
  atmosphere would have; with a stable layer near the surface and a solar atmospheric composition
  the dilute core shrinks to 0.4 to 0.5 of the radius
  ([Nettelmann and Fortney 2025](literatur:nettelmann-2025)). How a dilute core forms and survives
  is not understood ([Wahl et al. 2017](literatur:wahl-2017)).
- **Saturn's moment of inertia:** The pole precession gives 0.2263 ± 0.0101 (3σ) at the radius of
  60,268 km, more than all model predictions but within 3σ; the value assumes a rigid body rotating
  at the rate of Mankovich et al. 2019 and a pole aligned with the angular momentum
  ([Jacobson 2022](literatur:jacobson-2022)). Models with winds that match the gravity field predict
  0.2181 ± 0.0002; the deep winds lower the value by 0.4 %, which a measurement over a sufficiently
  long arc of the precession could test ([Militzer and Hubbard 2023](literatur:militzer-2023)). The
  two values differ by 2.4σ with the uncertainty of Jacobson's Table 9 and by 3.3σ with that of
  Table 8 (0.0025 as 1σ); the two tables are not consistent in their uncertainty.
- **Titan's hydrostatic state:** $J_2/C_{22} = 3.186 \pm 0.077$ is consistent with 10/3 at the 2σ
  level; under the hydrostatic assumption, $J_2$ and $C_{22}$ give a moment of inertia close to
  0.341 via Radau–Darwin. Titan's shape, however, is considerably more flattened than equilibrium
  would imply; equilibrium is therefore not guaranteed, and a non-hydrostatic interior would also
  allow smaller values ([Durante et al. 2019](literatur:durante-2019)). A reanalysis of the same ten
  flybys found $J_2/C_{22} = 3.316 \pm 0.051$, a field in a relaxed hydrostatic state, and
  $C/(M R^2) = 0.343 \pm 0.001$; it interprets Titan as having no global ocean
  ([Petricca et al. 2025](literatur:petricca-2025)). The dispute about $k_2$ and the ocean is
  covered under [Tides and the Roche limit](thema:gezeiten).

## In the model

- **No gravity field:** Orrery moves all bodies by orbital elements with linear rates
  ([Orbital elements](thema:bahnelemente)); neither $GM$ nor $J_2$ enters the orbits. A body's mass
  serves only the "Mass" line of the data panel and the Kepler orbital period, which the data panel
  computes from $G\,(M + m)$. What the equatorial bulge does to the moons' orbits is contained only
  in the fixed node and apsis rates of the data sets, where they have any.
- **Shape:** All bodies are spheres with the mean radius. For Jupiter the sphere of 69,911 km lies
  1581 km below the 1-bar surface at the equator and 3057 km above it at the poles (radii 71,492 and
  66,854 km, flattening 0.06487), for Saturn 2036 and 3868 km (60,268 and 54,364 km, flattening
  0.09796), for the Earth 7.1 and 14.2 km (NSSDC fact sheets).
- **Rotation:** The poles are fixed and the rotation is uniform
  ([Reference systems](thema:bezugssysteme)). This removes exactly the quantities from which the
  moment of inertia is measured: precession, nutation, physical libration and free polar motion.
  Cores, moments of inertia, gravity coefficients and Love numbers appear in no data set.
- **Masses and GM:** The masses and radii of the Sun, Earth, Jupiter and Saturn agree with the NSSDC
  fact sheets, except for the solar mass (see below); the gravitational constant is
  $G = 6.67430 \cdot 10^{-11}\,\mathrm{m}^3\,\mathrm{kg}^{-1}\,\mathrm{s}^{-2}$ (CODATA 2018). Its
  product with the mass deviates from the dynamically determined $GM$: for the Sun by +45 ppm from
  the IERS constant, for the Earth and Moon by +5 and +29 ppm
  ([Petit and Luzum 2010](literatur:petit-2010)), for Jupiter by +3 ppm
  ([Durante et al. 2020](literatur:durante-2020)), for Saturn by +5 ppm and for Titan by +238 ppm
  ([Jacobson 2022](literatur:jacobson-2022)); the mass of Mars lies 34 ppm below the value used by
  Le Maistre et al. ([Le Maistre et al. 2023](literatur:le-maistre-2023)). The data set lists the
  Sun with $1.9885 \cdot 10^{30}\,\mathrm{kg}$; the current fact sheet gives
  $1.9884 \cdot 10^{30}\,\mathrm{kg}$, with which the product would lie 5 ppm below the IERS
  constant. Because of the +45 ppm, the Kepler periods of the planets in the data panel come out
  about 23 ppm too short.
- **Data panel:** The diameter is twice the mean radius. Further simplifications:
  [Limits of the model](thema:modell).

*As of September 2026*
