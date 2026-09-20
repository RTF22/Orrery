# Jupiter

Jupiter is by far the largest planet and the first gas giant from the Sun: more massive than all
other planets combined more than twice over, with no solid surface, and with a gravity field that
the Juno spacecraft has been measuring from a tight polar orbit since 2016; its very first flybys
already changed the picture of the gravity field, atmosphere and magnetic field at once
([Bolton et al. 2017](literatur:bolton-2017)). This text presents the gravity field and interior,
the atmosphere and magnetosphere, and the orbit and formation, and finally describes what Orrery
models of it. The four Galilean moons [Io](objekt:io), [Europa](objekt:europa),
[Ganymede](objekt:ganymede) and [Callisto](objekt:callisto) are only cross-referenced here; they
have their own texts, as does [Saturn](objekt:saturn), the other large gas giant.

## Parameters and measurement

Radio tracking of the Juno spacecraft yields Jupiter's gravity field directly from the Doppler
shift of its orbit. Ten flybys through December 2018 gave, referred to the equatorial radius of
71,492 km, $J_2 = 14696.5735 \cdot 10^{-6}$, $J_4 = -586.6085 \cdot 10^{-6}$ and
$J_6 = 34.2007 \cdot 10^{-6}$, with uncertainties of a few $10^{-9}$ (3σ;
[Durante et al. 2020](literatur:durante-2020)). For a purely rotating fluid body without internal
flows, only the even moments would be non-zero and approximately proportional to $q^n$, with
$q = \omega^2 a^3/(GM)$ the ratio of centrifugal force to gravity at the equator
([Iess et al. 2018](literatur:iess-2018)); with $q = 0.0892$
([Militzer and Hubbard 2023](literatur:militzer-2023)) the measured values give $J_2/q = 0.165$,
$J_4/q^2 = -0.074$ and $J_6/q^3 = 0.048$. Juno also found a north–south asymmetry of the field, the
signature of internal flows: $J_3 = (-0.0450 \pm 0.0033) \cdot 10^{-6}$ (3σ;
[Durante et al. 2020](literatur:durante-2020)). From the odd moments it follows that the jet
streams of the cloud surface extend about 3000 km deep, about 9000 km at
[Saturn](objekt:saturn) ([Militzer and Hubbard 2023](literatur:militzer-2023)) – a result a
dedicated gravity study, titled "Jupiter's atmospheric jet streams extend thousands of kilometres
deep", confirms independently ([Kaspi et al. 2018](literatur:kaspi-2018)). Below this depth,
companion model calculations find the interior rotating essentially rigidly
([Guillot et al. 2018](literatur:guillot-2018)).

Jupiter's moment of inertia factor is not measured directly: models that match all moments up to
$J_{10}$ give $C/(M a^2) = 0.26393 \pm 0.00001$
([Militzer and Hubbard 2023](literatur:militzer-2023)); the definition and limits of this quantity
are covered under [Moment of inertia factor](thema:innerer-aufbau). The following table summarizes
the main parameters.

| Quantity | Value | Uncertainty | Method | Source |
|---|---|---|---|---|
| Mass | $1.89813 \cdot 10^{27}\,\mathrm{kg}$ | – | Tracking (Juno) | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| $GM$ | $126687\,\mathrm{km^3\,s^{-2}}$ | – | Orbit tracking | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| Equatorial radius (1 bar) | $71492\,\mathrm{km}$ | – | Radio occultation, 1 bar level | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| Polar radius (1 bar) | $66854\,\mathrm{km}$ | – | Radio occultation | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| Volumetric mean radius | $69911\,\mathrm{km}$ | – | from equatorial and polar radius | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| Ellipticity | $0.06487$ | – | (equatorial minus polar radius)/equatorial radius | [NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter) |
| $J_2$ | $14696.5735 \cdot 10^{-6}$ | a few $10^{-9}$ | Juno tracking, 10 passes | [Durante et al. 2020](literatur:durante-2020) |
| $J_4$ | $-586.6085 \cdot 10^{-6}$ | a few $10^{-9}$ | Juno tracking | [Durante et al. 2020](literatur:durante-2020) |
| $J_6$ | $34.2007 \cdot 10^{-6}$ | a few $10^{-9}$ | Juno tracking | [Durante et al. 2020](literatur:durante-2020) |
| $J_3$ (odd, wind signature) | $-0.0450 \cdot 10^{-6}$ | $0.0033 \cdot 10^{-6}$ (3σ) | Juno tracking | [Durante et al. 2020](literatur:durante-2020) |
| $C/(M a^2)$ | $0.26393$ | $0.00001$ | interior models fit to $J_2$ through $J_{10}$ | [Militzer and Hubbard 2023](literatur:militzer-2023) |
| Bond albedo | $0.503$ | $0.012$ | Cassini radiometry, full phase-angle/wavelength coverage | [Li et al. 2018](literatur:li-2018) |
| Geometric albedo | $0.538$ | – | photometric (V band) | [Mallama et al. 2017](literatur:mallama-2017) |

With mass and volumetric mean radius, the mean density is only $1326\,\mathrm{kg\,m^{-3}}$
([NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter)) – an early hint that Jupiter consists mostly of
hydrogen and helium rather than rock or ice (see "Interior").

## Interior

Before Juno, models favoured a compact core of rock and ice of a few Earth masses beneath a shell
of metallic and, further out, molecular hydrogen. Juno's first gravity data instead fit
significantly better with a "dilute" core, whose heavy elements are spread over a large fraction of
the radius rather than confined to a sharply bounded centre, with 7 to 25 Earth masses of heavy
elements in total ([Wahl et al. 2017](literatur:wahl-2017)). Newer equations of state from
ab-initio calculations match all measured moments with a dilute core extending to 63 % of the
radius, in which heavy elements make up only 18 % of the mass
([Militzer et al. 2022](literatur:militzer-2022)). How far the core extends, however, depends
sensitively on the chosen hydrogen–helium equation of state: with different assumptions, small
dilute cores of only about 20 % of the mass also result, fitting formation models better but
requiring a higher internal entropy than is usually assumed from the Galileo atmospheric probe's
measurements ([Howard et al. 2023](literatur:howard-2023); more under
[Interior structure](thema:innerer-aufbau)).

Between about 0.8 and 1 Jupiter radius, molecular hydrogen turns into metallic, electrically
conducting hydrogen; this layer drives the self-generated dynamo, whose outer edge lies at
$0.81\,R_\mathrm{J}$ according to the current magnetic field model
([Connerney et al. 2022](literatur:connerney-2022)). At this depth, helium condenses out of the
surrounding hydrogen in droplets and rains further inward once the temperature drops below the
miscibility limit of the two substances – a process meant to explain the helium depletion measured
in the atmosphere. A recent model with a stably stratified layer damping mixing at
$0.975$ to $0.99\,R_\mathrm{J}$ combines exactly this helium rain with a helium gradient that is
inverted further out, and thereby arrives at a dilute core shrunk to $0.4$ to $0.5\,R_\mathrm{J}$
($0.2$ to $0.3$ Jupiter masses) ([Nettelmann and Fortney 2025](literatur:nettelmann-2025)). Which of
these equations of state and mixing models is correct is an open dispute in giant-planet physics
(see below; reviewed by [Helled et al. 2022](literatur:helled-2022)).

The heat budget also reveals the interior: Jupiter radiates more energy overall than it receives
from the Sun, an excess from contraction since its formation (Kelvin–Helmholtz mechanism, see
"Formation and evolution"). Cassini radiometry gave a Bond albedo of $0.503 \pm 0.012$ instead of
the older $0.343$ derived from Voyager data and an assumed Pioneer phase integral
([Li et al. 2018](literatur:li-2018); [Hanel et al. 1981](literatur:hanel-1981)); the higher albedo
means Jupiter absorbs markedly less sunlight than previously assumed, cutting the absorbed power by
24 % ([Albedo and brightness](thema:photometrie)) – so an even larger share of the radiated energy
must come from the interior itself than older balances showed. Because the gravity field mainly
responds to the outer layers anyway, it only loosely constrains deep cores at any giant planet
([Mankovich and Fuller 2021](literatur:mankovich-2021)).

## Atmosphere and magnetosphere

Jupiter's atmosphere consists mostly of molecular hydrogen and helium. Its water abundance remained
puzzling for decades after the unusually dry measurement by the Galileo atmospheric probe in 1995;
Juno's microwave radiometer gave, in 2020, for the equatorial zone (0 to 4° north latitude, pressure
depths of roughly 0.7 to 30 bar) a water abundance of
$2.5^{+2.2}_{-1.6} \cdot 10^3\,\mathrm{ppm}$, $2.7^{+2.4}_{-1.7}$ times the protosolar oxygen ratio –
markedly more than the Galileo probe measured, but whether this value holds for the whole planet
remains open ([Li et al. 2020](literatur:li-2020)). The visible bright zones and dark belts mark
rising and sinking flow respectively; as derived above, their zonal winds extend about 3000 km
deep. The Great Red Spot, an anticyclonic storm with roots reaching down to about 320 km, has been
shrinking continuously since at least the 1930s: between 1995 and 2017 its length decreased by
about $0.194^\circ$ and its width by about $0.048^\circ$ per year, its westward drift relative to
System III accelerated over the same period from about $0.026^\circ$ to about $0.36^\circ$ per day,
and since 2014 its colour and internal circulation have changed noticeably
([Simon et al. 2018](literatur:simon-2018)).

At both poles, further storms discovered only by Juno arrange themselves in a stable pattern around
a central cyclone, in a different number at the south pole than at the north
([Adriani et al. 2018](literatur:adriani-2018)): at the north pole about eight around the central
one, with diameters up to about 4000 km ([Juno mission (NASA)](quelle:nasa-juno)). Juno's microwave radiometer also recorded
lightning discharges at 600 MHz concentrated mostly near the poles, unlike the picture, inferred
from optical Voyager and Galileo images, of thunderstorm activity concentrated at mid-latitudes
([Brown et al. 2018](literatur:brown-2018)).

The magnetic field originates in the metallic hydrogen and is the strongest of any planet. The
current JRM33 model, from 32 polar orbits, shows, besides the global dipole, a "Great Blue Spot", an
isolated, intense patch of magnetic flux near the equator that is carried eastward by deep zonal
winds reaching about 3500 km
([Connerney et al. 2022](literatur:connerney-2022)); at its current drift, it should circle the
planet once in roughly 350 years ([Juno mission (NASA)](quelle:nasa-juno)). Io feeds an ion torus
along its orbit from its volcanically ejected sulfur and oxygen plasma, whose currents produce,
among other things, auroral footprints of all four Galilean moons; most recently, Juno also
detected the long-sought footprint of Callisto
([Jupiter at NASA Science](quelle:nasa-jupiter)).

## Orbit, rotation and dynamics

Jupiter orbits the Sun at a mean distance of 5.2 AU in 4332.589 days, just under twelve years, on
an only moderately eccentric orbit ([Orbital elements](thema:bahnelemente)). Because the gas giant
has no solid surface, observation traditionally distinguished three rotation systems: System I for
the faster-moving equatorial region, System II for the remaining latitudes, whose speed varies with
the clouds tracked, and System III, tied to the rotation of the magnetic field and hence to the
interior itself. Since its redetermination from decades of radio observations, System III has
formed the basis of the official IAU cartography
([Higgins et al. 1997](literatur:higgins-1997); [Archinal et al. 2018](literatur:archinal-2018)).
At about 9 h 55 min, Jupiter is the fastest-rotating planet; details of the model value are given
under "In the model".

Jupiter's axis is tilted only $3.13^\circ$ from its orbit
([NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter)), so seasons barely register. This small
obliquity also keeps the moons' classical Laplace surface, on which the equatorial bulge and the
solar tidal field cancel on average, stable at every orbital radius – unlike for a hypothetical
planet with an obliquity above $68.875^\circ$
([Tremaine et al. 2009](literatur:tremaine-2009)); close to Jupiter it coincides with its equator,
far out with its orbital plane around the Sun
([Laplace surface of the moons](thema:bezugssysteme)). The four Galilean moons orbit near this
surface and sit in a chain of orbital resonances, the Laplace resonance of
[Io](objekt:io), [Europa](objekt:europa) and [Ganymede](objekt:ganymede); farther out, 60° ahead of
and behind Jupiter on its own orbit, the Lagrange points $L_4$ and $L_5$ trap numerous Jupiter
trojans ([Formation](thema:entstehung)).

## Formation and evolution

How Jupiter formed from the protoplanetary solar nebula is not conclusively settled. In the core
accretion model, a core of ice and rock first collects planetesimals until its mass suffices to
capture large amounts of gas in a self-reinforcing second phase; for Jupiter, this model needs a
planetesimal surface density of about three to four times a minimum solar nebula and then gives
formation times of 1 to 10 million years
([Pollack et al. 1996](literatur:pollack-1996)). As a faster alternative, Boss proposed that a
sufficiently massive, cool gas disk fragments directly under its own gravity into individual,
Jupiter-mass clumps, without the detour through a previously grown core
([Boss 1997](literatur:boss-1997); more under [Formation](thema:entstehung)).

Meteoritic chronology suggests that Jupiter's core grew unusually fast: from the separation of two
isotopic reservoirs that have remained unmixed to this day, it follows that it must have reached
about 20 Earth masses within less than a million years of the oldest calcium–aluminium-rich
inclusions and grown to about 50 Earth masses by at least 3 to 4 million years afterwards
([Kruijer et al. 2017](literatur:kruijer-2017)); whether Jupiter really was the material barrier
between the two reservoirs remains open. After gas accretion, in the "Grand Tack" model Jupiter
first migrated inward to 1.5 AU and then turned back outward together with
[Saturn](objekt:saturn), truncating the terrestrial planets' planetesimal disk at 1 AU
([Walsh et al. 2011](literatur:walsh-2011)). Since completing gas accretion, Jupiter has continued
to slowly cool and contract; the resulting Kelvin–Helmholtz heat flux is, as shown above, larger
than older radiation balances suggested.

## Open questions

- **Extent and composition of the dilute core:** models with different hydrogen–helium equations of
  state range from a core extending to 63 % of the radius with an 18 % mass fraction of heavy
  elements ([Militzer et al. 2022](literatur:militzer-2022)), through smaller cores of about 20 % of
  the mass requiring higher entropy ([Howard et al. 2023](literatur:howard-2023)), to a core confined
  to $0.4$–$0.5\,R_\mathrm{J}$ beneath a stabilizing layer that inverts the helium rain
  ([Nettelmann and Fortney 2025](literatur:nettelmann-2025)); which equation of state is correct
  remains unresolved.
- **Global water abundance:** Juno's measurement holds only for the equatorial zone and contradicts
  the unusually dry measurement of the Galileo probe from 1995; whether it is representative of the
  whole planet is open ([Li et al. 2020](literatur:li-2020)).
- **Cause of the Great Red Spot's shrinkage:** that the spot is shrinking and its westward drift is
  accelerating is well documented over decades; whether this reflects a gradual loss of vortex
  energy, a change in large-scale circulation, or both at once is not yet settled, given the colour
  and circulation changes observed since 2014
  ([Simon et al. 2018](literatur:simon-2018)).
- **Core accretion or disk instability:** core accretion readily explains the heavy-element
  enrichment Jupiter needs, but only with a surface density markedly higher than the minimum nebula
  ([Pollack et al. 1996](literatur:pollack-1996)); disk instability instead forms giant planets
  almost instantaneously from the collapse of a massive gas disk, leaving core accretion no time to
  act ([Boss 1997](literatur:boss-1997)) – which path Jupiter actually took is undecided.

## In the model

- **Orbit:** the elements come from the JPL approximate-position table for 1800 to 2050, linearly
  propagated against the fixed J2000 ecliptic ([Orbital elements](thema:bahnelemente)). The orbital
  period computed from the catalogue mass and semi-major axis via Kepler's third law comes to
  4332.594 days, about 7 minutes more than the fact-sheet value of 4332.589 days.
- **Shape:** like every body, Jupiter is a sphere with the mean radius in the model; `radiusKm` is
  set to 69,911 km, the NSSDC volumetric mean, not the equatorial radius of 71,492 km. The sphere
  therefore sits 1581 km (2.2 %) below the actual 1-bar surface at the equator and 3057 km (4.6 %)
  above it at the poles (ellipticity 0.06487); `render/bodies.ts` scales every sphere with only a
  single factor, so the visible flattening is entirely absent, even though it is noticeable to the
  naked eye given Jupiter's rapid rotation (the same simplification as for Saturn, see
  [Interior structure](thema:innerer-aufbau)). Jupiter's real, faint ring system is likewise entirely
  absent: `jupiter.ts` carries no `appearance.rings`, even though the fact sheet lists a "yes" under
  "Planetary ring system" ([NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter)).
- **Rotation:** `rotationPeriodH` is set to 9.9250 h, matching the NSSDC fact sheet exactly. The
  official IAU rotation rate for System III ($870.5360000^\circ$ per day,
  [Archinal et al. 2018](literatur:archinal-2018), building on the redetermination by
  [Higgins et al. 1997](literatur:higgins-1997)), however, gives a period of 9.924920 h – the dataset
  is 0.29 s longer. The texture rotates rigidly as a whole at this single period; neither the
  differently paced rotation Systems I and II nor individual jet streams are represented. At the
  Great Red Spot's current westward drift of about $0.36^\circ$ per day relative to System III
  ([Simon et al. 2018](literatur:simon-2018)), the real spot would drift about $130^\circ$ away from
  the marking fixed on the model's texture within a single year – an effect the simulation does not
  show, because it does not draw the spot separately at all.
- **Pole and obliquity:** the stored pole (268.057°/64.495°) matches the 2015 IAU report
  (268.056595°/64.495303°, [Archinal et al. 2018](literatur:archinal-2018)) to three decimal places.
  Recomputing with `achsneigungDeg` gives $3.1200^\circ$ against the orbital normal stored in the
  dataset – the comment in `jupiter.ts` (3.12°) thus accurately describes the actual state of the
  code; the fact sheet gives $3.13^\circ$, measured against a high-accuracy ephemeris rather than
  the approximate one used here
  ([NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter)), the same methodological difference as for
  [Mars](objekt:mars). `rotationAtEpochDeg` is set to 0; the IAU report gives
  $W_0 = 284.95^\circ$ for the rotation phase at J2000.0 – Jupiter's map zero meridian in the model
  therefore does not sit where the report puts it, which affects only the map's orientation.
- **Albedo:** the catalogue value 0.538 is the geometric albedo and matches the NSSDC fact sheet and
  [Mallama et al. 2017](literatur:mallama-2017), as documented for all planets in
  [Albedo and brightness](thema:photometrie).
- **Moons and shadows:** the dataset carries only the four Galilean moons, not the roughly 90 further
  known small Jovian moons. Because `MAX_OKKLUDER` in `render/shadows.ts` is likewise 4,
  `waehleOkkluder` selects all four as sphere occluders for Jupiter (ordered by displayed angular
  radius: Io, Ganymede, Europa, Callisto) – so each of the four can cast a shadow on Jupiter, and
  conversely each moon is shadowed by Jupiter and all three remaining moons. At Jupiter's
  $3.13^\circ$ obliquity, Io, being close in, always casts a shadow, while Callisto sometimes casts
  none at all (9.5° versus 2.1° permissible solar elevation above the orbital plane); seen from
  Jupiter, the Sun has, on average, an angular radius of only $0.051^\circ$, markedly smaller than the angular
  radii of the four moons themselves, so their shadows appear as sharp black spots
  ([Eclipses](thema:finsternis)). As with Jupiter's own shadow on Saturn, this one carries no umbra
  colour either. The moons' orbits are referred to Jupiter's equatorial plane
  (`frame: 'parentEquator'`, pole from this dataset) rather than each moon's own Laplace plane; the
  resulting deviation is small, 0.02°, for Io and Europa, still moderate, 0.12°, for Ganymede, and
  largest, 0.4°, for Callisto (see
  the comment in `jupiter-monde.ts`).
- Scale: `sizeScale` enlarges Jupiter like any body; `sunDamping` affects only the Sun. Further
  simplifications: [Limits of the model](thema:modell).

*As of September 2026*
