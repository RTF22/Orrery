# Ceres

Ceres is the largest body in the asteroid main belt between the orbits of
[Mars](objekt:mars) and [Jupiter](objekt:jupiter), and the only dwarf planet a spacecraft
has surveyed from close range. Giuseppe Piazzi discovered it on 1 January 1801 from the
Palermo Observatory, at first taking it for a planet in the gap between Mars and Jupiter
that Bode's law had postulated; once further, smaller bodies turned up at the same location,
Ceres was demoted to an asteroid within a few decades, until the International Astronomical
Union reclassified it in 2006, together with Pluto and the newly discovered Eris, as a
[dwarf planet](thema:zwergplaneten) ([IAU 2006](literatur:iau-2006)) — the same definition
that also underlies [Pluto's](objekt:pluto) classification. From March 2015
([Russell et al. 2016](literatur:russell-2016)) until it lost control after running out of
fuel on 1 November 2018 ([JPL mission-end announcement](quelle:jpl-dawn-missionsende)), NASA's
Dawn spacecraft orbited Ceres, in its final phase from less than 400 km altitude, and returned
its gravity field, shape, composition and a global map — the only close-up view of a main-belt
dwarf planet to date, while the trans-Neptunian dwarf planets remain known only from afar.
This text presents parameters, interior, surface, the transient exosphere, orbit and
formation, and describes last what Orrery renders of it; the scene
[Ceres in the asteroid belt](szene:ceres-guertel) shows the dwarf planet amid the model
belt's point cloud.

## Parameters and measurement

Radiometric tracking and optical landmark navigation during the final, lowest orbits
yielded a gravity field to degree 18 and a gravitational parameter
$GM = 62.6284\,\mathrm{km^3\,s^{-2}}$ ([Park et al. 2016](literatur:park-2016);
[Konopliv et al. 2018](literatur:konopliv-2018)). With $G = 6.67430 \cdot
10^{-20}\,\mathrm{km^3\,kg^{-1}\,s^{-2}}$ (CODATA 2018), this gives a mass of
$9.3835 \cdot 10^{20}\,\mathrm{kg}$; the control value $G \cdot M = 62.62829\,\mathrm{km^3\,s^{-2}}$
recomputed from this rounded mass matches the measured value to about 1.7 ppm (derivation) —
the tiny remainder comes solely from rounding the mass to five figures.

The ellipsoid derived from the shape figure has half-axes around $a \approx 482\,\mathrm{km}$,
$b \approx 482\,\mathrm{km}$ and $c \approx 446\,\mathrm{km}$
([Park et al. 2016](literatur:park-2016); different tables in the same paper give $a$ and
$b$ values between 481 and 483 km, see the reference list). The geometric mean
$(a\cdot b\cdot c)^{1/3} \approx 469.75\,\mathrm{km}$ matches the mean radius of
$469.7\,\mathrm{km}$ to about 0.01 percent (derivation). Ceres is nearly circular at the
equator ($a$ and $b$ differ by about 0.02 percent), but markedly flattened: relative to the
mean of $a$ and $b$, the polar flattening is about 7.5 percent (derivation) — more than a
body in hydrostatic equilibrium at the present, slow rotation would be expected to show (see
Interior). With mass and mean radius, $\bar\rho = 3\,GM/(4\pi G R^3)$ gives a mean density of
about $2.162\,\mathrm{g\,cm^{-3}}$ (derivation) — well above that of water ice and well below
that of rock, an early sign of a layered body.

| Quantity | Value | Uncertainty | Method | Source |
|---|---|---|---|---|
| $GM$ | $62.6284\,\mathrm{km^3\,s^{-2}}$ | – | Radiometric tracking, Dawn | [Park et al. 2016](literatur:park-2016) |
| Radius (volumetric mean) | $469.7\,\mathrm{km}$ | – | Shape figure from stereophotoclinometry | [Park et al. 2016](literatur:park-2016) |
| Mean density | $2.162\,\mathrm{g\,cm^{-3}}$ | – | Derivation from $GM$ and radius | Derivation |
| $J_2$ | $0.026499$ | $0.0000008$ | Gravity field, reference radius 470 km | [Park et al. 2016](literatur:park-2016) |
| Normalized (polar) moment of inertia | $0.37$ | $0.01$ | Gravity field with hydrostatic approximation | [Park et al. 2016](literatur:park-2016); [Ermakov et al. 2017](literatur:ermakov-2017) |
| Rotation period | $9.074170\,\mathrm{h}$ | $0.000001\,\mathrm{h}$ | Tracking and shape control | [Konopliv et al. 2018](literatur:konopliv-2018) |
| Pole (right ascension/declination) | $291.427^\circ/66.760^\circ$ | – | as above | [Konopliv et al. 2018](literatur:konopliv-2018) |
| Geometric albedo (HST, V band) | $0.090$ | $0.003$ | Ground-based photometry | [Li et al. 2006](literatur:li-2006) |
| Geometric albedo (Dawn, 0.55 µm) | $0.094$ | $0.008$ | VIR spectrophotometry | [Ciarniello et al. 2017](literatur:ciarniello-2017) |
| Bond albedo | $0.034$ | $0.001$ | Framing Camera photometry | [Ciarniello et al. 2017](literatur:ciarniello-2017) |

## Interior

From gravity field and shape, Park et al. derived a dense, partially differentiated rocky
core beneath a lighter, volatile-rich shell. Assuming that the present shape corresponds to
the hydrostatic equilibrium of the measured rotation, the normalized polar moment of
inertia comes out at $0.37 \pm 0.01$ — well below the value $0.4$ of a homogeneous sphere,
but still far above that of a fully differentiated body with a sharp core-mantle boundary
([Park et al. 2016](literatur:park-2016)). How strongly the real shape departs from the
hydrostatic ideal is itself part of this uncertainty: a rotationally symmetric ellipsoid
matches the measured gravity field only to within a few percent and the measured shape only
to within a few percent; Ceres approaches hydrostatic equilibrium without reaching it
exactly (see the reference list).

A two-layer model built from admittance (the ratio of gravity to topography signal) and
shape refines this picture: a roughly 41 km thick, light upper layer with a fitted density
around $1287\,\mathrm{kg\,m^{-3}}$ overlies a denser mantle at about
$2434\,\mathrm{kg\,m^{-3}}$ ([Ermakov et al. 2017](literatur:ermakov-2017)). An independent
analysis of the topography finds at least 30 volume percent of light, solid phases in
addition to the ice in the same upper layer — consistent with salts or gas hydrates
(clathrates), but not with pure water ice, which would already flow noticeably under the
observed load at Ceres' temperatures ([Fu et al. 2017](literatur:fu-2017)). The crust of
ice, salts, hydrates and phyllosilicates, roughly 40 km thick, is thus not a pure ice shell
but a solid, salt-rich mixture whose mechanical strength can support the observed topography
over geological time.

Beneath this crust, several findings argue for at least intermittently mobile, deep brine
reservoirs rather than a fully frozen body: gravity data and thermal models together suggest
that the impact that formed the 92 km wide Occator crater breached a deep brine chamber at
the crust-mantle boundary and carried brine to the surface over geological timescales
([Raymond et al. 2020](literatur:raymond-2020)). Whether this implies a single, extensive
reservoir or several independent, by now largely frozen pockets is placed among the open
questions of a possible "ocean world Ceres" by a later assessment
([Castillo-Rogez 2020](literatur:castillo-rogez-2020)). On the moment-of-inertia factor and
core formation in bodies generally, see
[Interior structure from gravity and rotation](thema:innerer-aufbau).

## Surface

Ceres' surface is dark (albedo values as in Parameters and measurement) and globally
crossed by ammoniated phyllosilicates — an unusual finding in today's main belt, because
ammonia does not condense at the temperatures found there
([De Sanctis et al. 2015](literatur:desanctis-2015); interpretation under Formation and
evolution). By far the brightest spots on the surface lie in the 92 km wide Occator crater:
spectra of the Cerealia and Vinalia faculae show mostly sodium carbonate alongside some
ammonium carbonate or chloride, residues of crystallized brines that rose along fracture
systems after the impact ([De Sanctis et al. 2016](literatur:desanctis-2016)). High-resolution
images from the mission's final, lowest orbital phase show that this activity did not end
with the roughly 22-million-year-old impact itself: part of the bright deposits and
accompanying flow features formed only millions of years later, starting at the earliest
about 9 million years ago, and point to a long-lasting cryovolcanic aftermath reaching into
geologically recent times ([Nathues et al. 2020](literatur:nathues-2020)).

There are also signs of cryovolcanism away from Occator: Ahuna Mons, a roughly 17 km wide
and 4 km high, cone-shaped dome with no counterpart elsewhere on Ceres, is best explained as
the extrusion of a viscous, salt-rich cryomagma that solidified about 210 million years
ago ([Ruesch et al. 2016](literatur:ruesch-2016)) — young enough that, despite its small
size, Ceres retained internal heat and mobile liquids into geologically recent times. At
Ernutet crater, localized deposits of aliphatic organic material were also found; their
concentration and distribution make an external origin (for instance from a carbon-rich
impactor) unlikely, favoring formation within Ceres itself
([De Sanctis et al. 2017](literatur:desanctis-2017)).

Water is not only bound in silicates and carbonates: the GRaND gamma-ray and neutron
spectrometer detected extensive water ice beneath the uppermost regolith, especially at
higher latitudes, consistent with a chemically altered but ice-rich subsurface
([Prettyman et al. 2017](literatur:prettyman-2017)); in the roughly 10 km wide, geologically
very young Oxo crater, the VIR spectrometer found a locally exposed H₂O surface — one of the
few water-ice surfaces directly detected in reflectance on the sunlit side of a main-belt
body at the time ([Combe et al. 2016](literatur:combe-2016)).

The global crater record shows a densely but unevenly cratered crust that is neither purely
icy nor purely rocky, with a simple-to-complex crater transition diameter falling in
between; a smooth region near Kerwan crater gives an age of 550 to 720 million years
depending on the chronology model applied
([Hiesinger et al. 2016](literatur:hiesinger-2016)). At the same time, the near-total
absence of very large basins stands out: collisional models of the depleted main belt
predict 10 to 15 basins larger than 400 km over 4.55 billion years of history, yet the
largest crater identified on Ceres stays well below about 280 km — most plausibly explained
by viscous relaxation of a deep, ice-rich layer or by later resurfacing with cryolava that
smoothed out old, large basins over time ([Marchi et al. 2016](literatur:marchi-2016)).

## Atmosphere and magnetosphere

Ceres has no permanent gas envelope, but a transient, extremely thin water-vapor exosphere:
the Herschel Space Observatory detected localized sources in the far infrared in 2012/2013,
from which at least about $10^{26}$ water molecules per second escaped in total, concentrated
at mid-latitudes and variable in time; both comet-like sublimation of near-surface ice and
cryovolcanism are consistent explanations, and the observation itself cannot distinguish
between them ([Küppers et al. 2014](literatur:kueppers-2014)). Whether and how these sources
relate to the young activity at Occator described under Surface is open (see Open
questions).

Whether Ceres has its own magnetic field generated by an internal dynamo is a question Dawn
never tested directly: for cost reasons, the mission dropped the originally planned
magnetometer before launch, leaving the instrument suite of cameras, spectrometer and radio
science to manage without an in-situ field measurement
([Russell et al. 2016](literatur:russell-2016)). No direct upper limit on any such field
therefore comes from this mission; given the small size, the presumably long-frozen core
region and the absence of any indirect indication, an active dynamo field is considered
unlikely, though not ruled out.

## Orbit, rotation and dynamics

Ceres' osculating orbital elements from the JPL Small-Body Database are
$a = 2.7655\,\mathrm{AU}$, $e = 0.0797$ and $i = 10.59^\circ$ against the ecliptic (values as
in [Orbital elements](thema:bahnelemente)); Kepler's third law with the Sun's mass then gives
an orbital period of $1679.8$ days, or $4.60$ years (derivation) — the simple Kepler check
(orbital period in years equal to the semi-major axis in astronomical units to the power of
three halves) gives $4.599$ years and confirms the value to about 0.0004 percent.

This orbit lies in the outer main belt between two of the most prominent
[Kirkwood gaps](thema:kirkwood-luecken): the 3:1 mean-motion resonance with Jupiter at
$2.50\,\mathrm{AU}$ and the 5:2 resonance at $2.82\,\mathrm{AU}$ (values as in
[Orbital resonances](thema:resonanzen)). Ceres sits about 0.26 AU from the inner gap and
only about 0.06 AU from the outer one, markedly closer to the 5:2 resonance (derivation),
without being trapped in either — unlike, for instance, the Hilda asteroids in the stable
3:2 resonance further out ([Nesvorný 2018](literatur:nesvorny-2018)). With a mass of
$9.3835 \cdot 10^{20}\,\mathrm{kg}$ and a total main-belt mass of $(4.008 \pm 0.029) \cdot
10^{-4}$ Earth masses determined from the motion of planets and spacecraft
([Pitjeva and Pitjev 2018](literatur:pitjeva-2018)), Ceres alone carries about 39 percent of
the entire belt's mass (derivation) — more than any other single body in the main belt.

Its discovery goes back to Giuseppe Piazzi, who found Ceres on 1 January 1801, at first
taking it for a planet in the gap between Mars and Jupiter that Bode's law had postulated;
with the discovery of Pallas (1802), Juno (1804) and Vesta (1807) at the same location, the
classification as a separate body class, "asteroid", took hold within a few decades. Only in
2006 did the International Astronomical Union classify Ceres, together with Pluto and the
newly discovered Eris, as a [dwarf planet](thema:zwergplaneten)
([IAU 2006](literatur:iau-2006)) — the same definition, oriented on clearing the orbital
neighborhood, that also underlies Pluto's classification, with the same unresolved question
of principle whether a purely geophysical definition would be more appropriate (see
[Pluto](objekt:pluto)).

## Formation and evolution

The widespread detection of ammoniated clay minerals raises the question of where Ceres
formed: because ammonia does not condense in today's main belt at the temperatures found
there, De Sanctis et al. interpreted it as evidence of an origin at greater heliocentric
distance, whether through formation further out followed by inward migration, or through
subsequent transport of material into the belt
([De Sanctis et al. 2015](literatur:desanctis-2015)). A counter-position explains the same
finding without migration: the rest of Ceres' mineralogy and geochemistry closely resembles
CI/CM carbonaceous chondrites overall, and the observed ammonium could equally be generated
by metamorphism of organic precursors within Ceres itself, without the body ever having lain
farther out ([McSween et al. 2018](literatur:mcsween-2018)). Which explanation is correct
remains undecided (see Open questions).

Both interpretations fit into the broader formation scenarios of the main belt: in the
picture of an originally nearly empty belt, today's asteroids migrated in only later from
neighboring regions ([Raymond and Izidoro 2017](literatur:raymond-2017)); the Grand Tack
explains the belt's mixed composition of inner S-type and outer C-type material through a
brief inward-then-outward migration of Jupiter that first depleted it and then partially
refilled it ([Walsh et al. 2011](literatur:walsh-2011)); Ceres' precursor population could
accordingly include both bodies from today's belt region and objects carried in from farther
out (values and context under
[Formation of the Solar System](thema:entstehung)). Regardless of its exact origin, Ceres,
because of its size, its retained volatiles and its presumably early but incomplete
differentiation, ranks among the most important witnesses of this early phase — one reason
the National Academies' decadal survey names a Ceres sample-return mission, targeted at the
brine deposits and habitability, as a possible target for a medium-scale New Frontiers
proposal ([National Academies of Sciences 2022](literatur:national-academies-2022)).

## Open questions

- **Where did Ceres form?** Ammoniated clay minerals point to an origin at greater
  heliocentric distance or to material transported in later
  ([De Sanctis et al. 2015](literatur:desanctis-2015)); the overall carbonaceous-chondritic
  composition is equally consistent with formation in today's belt and internal ammonia
  release through metamorphism ([McSween et al. 2018](literatur:mcsween-2018)).
- **How extensive and how long-lived are today's brine reservoirs?** Gravity data and
  thermal models argue for a deep brine chamber mobilized by the Occator impact
  ([Raymond et al. 2020](literatur:raymond-2020)); whether this implies a connected
  reservoir that is still partly liquid today, or several long-frozen remnant pockets, is
  open ([Castillo-Rogez 2020](literatur:castillo-rogez-2020)).
- **How much ice does the crust actually contain?** Admittance models suggest a roughly
  41 km thick layer with an effective density around $1287\,\mathrm{kg\,m^{-3}}$
  ([Ermakov et al. 2017](literatur:ermakov-2017)); an independent estimate from topography
  requires at least 30 volume percent of salt- or clathrate-rich solid phases alongside the
  ice, without fixing the exact ice fraction itself
  ([Fu et al. 2017](literatur:fu-2017)).
- **Where does the observed water vapor come from?** Comet-like sublimation of near-surface
  ice and cryovolcanism are both consistent with the localized, time-variable Herschel
  sources, and the two explanations have not yet been separated
  ([Küppers et al. 2014](literatur:kueppers-2014)).
- **Why are large, old impact basins missing?** Collisional models predict several basins
  larger than 400 km, yet the surface shows none larger than about 280 km; whether viscous
  relaxation of an ice-rich deep layer, resurfacing by cryolava, or an early impact history
  differing from the model assumptions is the cause remains open
  ([Marchi et al. 2016](literatur:marchi-2016)).

## In the model

- **Shape:** The dataset carries Ceres as a sphere with `radiusKm` $469.7$ and no
  flattening; the polar flattening of about 7.5 percent derived from the half-axes (see
  Parameters and measurement) is entirely absent from the model, while the equatorial
  deviation from a circle, about 0.02 percent, is in any case far below any display
  precision.
- **Texture:** according to `ASSETS.md`, `textures/ceres/albedo.jpg` is a "fictional" map
  from Solar System Scope, an artistic rendering approximating known color and albedo, even
  though Dawn actually delivered global, photographically grounded maps
  ([Russell et al. 2016](literatur:russell-2016)); Occator's bright spots, Ahuna Mons and the
  other features described under Surface do not appear in it in their real form and
  location.
- **Rotation and pole:** `rotationPeriodH` $9.074170$ and the pole $291.418^\circ/66.764^\circ$
  match the values $9.074170\,\mathrm{h}$ and $291.427^\circ/66.760^\circ$ determined by
  Konopliv et al. to within a few thousandths of a degree
  ([Konopliv et al. 2018](literatur:konopliv-2018)). `rotationAtEpochDeg`, however, is set to
  $0$, while the corresponding IAU rotation model places the prime meridian at epoch J2000
  at $W_0 \approx 170.3^\circ$ (Konopliv et al. 2018) — Orrery's texture is thus rotated by
  about 170 degrees from the true prime meridian, anchored on a crater chain. Because the
  texture is a "fictional" map anyway, this offset has no visible effect on individual
  surface features. The obliquity independently recomputed with `achsneigungDeg` matches
  $4.04^\circ$ — a small but nonzero tilt against the body's own orbit normal, as follows
  from the pole and orbital elements.
- **Orbit:** Ceres moves heliocentrically on osculating SBDB elements at its own epoch
  JD 2,461,200.5, with all rates except $\dot L$ set to zero (values as in
  [Orbital elements](thema:bahnelemente)); $a = 2.7655\,\mathrm{AU}$, $e = 0.0797$ and
  $i = 10.59^\circ$ match the values given in the text. Because the secular precession of
  perihelion and node is thus missing, the positional error grows with time distance from
  the fit epoch; the secular apsidal precession documented for Ceres, about 54 arcseconds
  per year, gives the order of magnitude of this error (own estimate, order of magnitude
  only): a few tenths of a degree per century, similar in order of magnitude to what is
  documented for [Pluto](objekt:pluto).
- **Kirkwood gaps in the belt model:** the rendered main belt (`sim/belts.ts`) produces its
  gaps as built-in, Gaussian density dips rather than from actual orbital dynamics; it uses
  $a_\mathrm{J} = 5.2044\,\mathrm{AU}$ instead of the $5.203\,\mathrm{AU}$ used in
  [Orbital resonances](thema:resonanzen), which places the 3:1 gap in the model at
  $2.5020\,\mathrm{AU}$ instead of $2.5013\,\mathrm{AU}$, and the 5:2 gap at
  $2.8254\,\mathrm{AU}$ instead of $2.8246\,\mathrm{AU}$ (derivation) — a shift of about
  0.0007 to 0.0008 AU, far below any visible resolution. Ceres itself is rendered as its own
  body, not as part of this point cloud; at its location the density function shows
  essentially no dip anymore, consistent with Ceres lying between, not inside, either gap.
- **Main-belt albedo:** the main belt's point cloud carries a uniform albedo of $0.06$ for
  every particle (values as in
  [Formation of the Solar System](thema:entstehung)), well below Ceres' own albedo of
  $0.090$ — Ceres therefore appears brighter in the image than the surrounding point cloud,
  matching the real order of magnitude of the albedo values, even though the model makes no
  type distinction (such as S-type versus C-type).
- **What is missing:** no water-vapor exosphere, no magnetic-field model (which could not be
  determined from the mission anyway), no Occator faculae or Ahuna Mons as geometry separate
  from the texture, and no time evolution of the cryovolcanism. As a heliocentric dwarf
  planet (`kind: 'dwarf'`, `parent: 'sun'`), Ceres scales like any planet with the display's
  distance compression, not with `sizeScale` like a satellite (`sim/scale.ts`).
- **Data panel against measured values:** the mass carried in the dataset gives
  $GM = 62.62829\,\mathrm{km^3\,s^{-2}}$, about 1.7 ppm below the measured value given in
  Parameters and measurement; rotation period, pole and albedo match the literature as
  described above to within a few parts per thousand or better. The data panel computes the
  orbital period via `umlaufzeitTage` from $a$ and $G\,(M_\odot+M_\mathrm{Ceres})$; it
  matches the period Ceres actually moves with, from $\dot L$, to about 0.002 percent,
  practically identical because both calculations rest on the same semi-major axis. Every
  body carries its albedo normalized to the slider range
  ([Albedo and brightness](thema:photometrie)). Further simplifications:
  [Limits of the model](thema:modell).

*As of September 2026*
