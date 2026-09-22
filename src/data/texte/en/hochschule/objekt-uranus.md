# Uranus

By radius Uranus is the third-largest planet, by mass the fourth-largest: its volumetric mean radius
exceeds Neptune's by about 3 %, while its mass stays a good 15 % below Neptune's
([NSSDC Uranus Fact Sheet](quelle:nssdc-uranus)). Together with [Neptune](objekt:neptune) it forms the
class of ice giants: beneath an envelope of hydrogen and helium lies a mantle made mostly of water,
ammonia and methane. Unique among the planets is its axial tilt of 97.77° to its own orbit — Uranus
rotates practically on its side — together with a magnetic field that coincides with neither the
rotation axis nor the planet's centre; how extremely tilted the system appears from Earth is shown by
the scene [Uranus lying on its side](szene:uranus-gekippt). The Uranus system has so far been seen by
only one spacecraft: Voyager 2 passed the planet on 24 January 1986 at a distance of about
81,500 km, at a time when its southern hemisphere faced the Sun
([Stone and Miner 1986](literatur:stone-1986); [Smith et al. 1986](literatur:smith-1986)). Almost
everything learned about the system since then comes from Earth, from Hubble and from JWST, or from
model calculations; this text names, for every value, what it rests on. This article covers parameters
and interior, atmosphere and magnetosphere, as well as orbit, rotation, formation and the Orrery model;
the rings have their own text ([Rings](thema:ringe)), as do the causes of the axial tilt
([Axial tilt](thema:achsneigung)) and the five large moons
[Miranda](objekt:miranda), [Ariel](objekt:ariel), [Umbriel](objekt:umbriel), [Titania](objekt:titania)
and [Oberon](objekt:oberon).

## Parameters and measurement

Uranus' gravity field and the orbits of its moons and rings were determined from Voyager 2's radio
tracking together with decades of ground-based astrometry
([Jacobson 2014](literatur:jacobson-2014)); a recently published reanalysis with a data arc extended
to 1847–2016, additional Gaia positions, and tidal and relativistic corrections further refines the
gravity field and pole direction ([Jacobson and Park 2025](literatur:jacobson-2025)).

| Quantity | Value | Uncertainty | Determination | Source |
|---|---|---|---|---|
| Mass | $8.6811 \cdot 10^{25}\,\mathrm{kg}$ | – | Orbit tracking, moon orbits | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| $GM$ (system) | $5794548.6\,\mathrm{km^3\,s^{-2}}$ | $1.5\,\mathrm{km^3\,s^{-2}}$ | Voyager 2 tracking, moon orbits | [Jacobson 2014](literatur:jacobson-2014) |
| $GM$ (Uranus alone) | $5793951.3\,\mathrm{km^3\,s^{-2}}$ | – | as above, system minus moon masses | [Jacobson 2014](literatur:jacobson-2014) |
| Equatorial radius (1 bar) | $25559\,\mathrm{km}$ | – | Radio occultation | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| Polar radius (1 bar) | $24973\,\mathrm{km}$ | – | Radio occultation | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| Volumetric mean radius | $25362\,\mathrm{km}$ | – | from equatorial and polar radius | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| Flattening | $0.02293$ | – | (equatorial minus polar radius)/equatorial radius | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| Mean density | $1270\,\mathrm{kg\,m^{-3}}$ | – | from mass and volume | [NSSDC Uranus Fact Sheet](quelle:nssdc-uranus) |
| $J_2$ | $3510.7 \cdot 10^{-6}$ | $0.7 \cdot 10^{-6}$ | Orbit tracking, reference radius $25559\,\mathrm{km}$ | [Jacobson 2014](literatur:jacobson-2014) |
| $J_4$ | $-34.2 \cdot 10^{-6}$ | $1.3 \cdot 10^{-6}$ | Orbit tracking, reference radius $25559\,\mathrm{km}$ | [Jacobson 2014](literatur:jacobson-2014) |
| Rotation period (radio modulation) | $-17.24\,\mathrm{h}$ | $0.01\,\mathrm{h}$ | Voyager 2 radio emission | [Desch et al. 1986](literatur:desch-1986) |
| Rotation period (aurora) | $17.247864\,\mathrm{h}$ | $0.000010\,\mathrm{h}$ | Hubble UV images of the aurorae, 2011–2022 | [Lamy et al. 2025](literatur:lamy-2025) |
| Pole | $257.311^\circ / -15.175^\circ$ | – | IAU report, fixed in the data set | [Archinal et al. 2018](literatur:archinal-2018) |
| Geometric albedo (V band) | $0.488$ | – | Photometric | [Mallama et al. 2017](literatur:mallama-2017) |
| Bond albedo (orbital mean) | $0.349$ | $0.016$ | Holistic atmosphere model | [Irwin et al. 2025](literatur:irwin-2025) |
| Absorbed solar flux (orbital mean) | $0.604\,\mathrm{W\,m^{-2}}$ | $0.027\,\mathrm{W\,m^{-2}}$ | from Bond albedo and solar distance | [Irwin et al. 2025](literatur:irwin-2025) |
| Emitted flux (orbital mean) | $0.693\,\mathrm{W\,m^{-2}}$ | $0.013\,\mathrm{W\,m^{-2}}$ | Infrared photometry | [Irwin et al. 2025](literatur:irwin-2025) |
| Internal heat flux | $0.078\,\mathrm{W\,m^{-2}}$ | $0.018\,\mathrm{W\,m^{-2}}$ | Energy balance over one orbit | [Wang et al. 2025](literatur:wang-2025) |

The product of $G$ and the catalogue mass gives $5794026.6\,\mathrm{km^3\,s^{-2}}$: about 13 ppm above
the dynamically determined $GM$ of the planet alone, but about 90 ppm below the $GM$ of the system —
the difference of about $600\,\mathrm{km^3\,s^{-2}}$ roughly matches the sum of the gravitational
parameters of the five large moons. Equatorial and polar radius deviate from the volume-equivalent
mean by $0.02293$ because of rotation ([NSSDC Uranus Fact Sheet](quelle:nssdc-uranus)); the equatorial
radius is thus about 0.8 % above the volumetric mean radius the data set carries as `radiusKm` (see
"In the model"). Like [Neptune](objekt:neptune), Uranus has no solid surface from which a rotation
period could be read off; unlike [Saturn](objekt:saturn), where four independent methods disagree by
up to 13 minutes, for Uranus only the period derived from the magnetic field has existed so far.
Voyager determined it in 1986 from the modulation of the radio emission as
$17.24 \pm 0.01\,\mathrm{h}$ ([Desch et al. 1986](literatur:desch-1986)); a 2025 analysis of
Hubble ultraviolet images of the aurorae from 2011 to 2022 tracked the rotation of the auroral spots instead
and gave $17.247864 \pm 0.000010\,\mathrm{h}$ — about 28 s longer per rotation, but with a
thousandfold smaller uncertainty ([Lamy et al. 2025](literatur:lamy-2025)); details on the model value
and the resulting phase drift are given under "In the model". The geometric albedo in the V band is
comparable with the other giant planets
([Mallama et al. 2017](literatur:mallama-2017); [Albedo and brightness](thema:photometrie)); the
bolometric Bond albedo, by contrast, was only redetermined in 2025 from a model that for the first time
fits observations from the ultraviolet to the near infrared jointly
([Irwin et al. 2025](literatur:irwin-2025)) and came out higher than the older value
$0.300 \pm 0.049$ obtained from Voyager infrared data
([Pearl et al. 1990](literatur:pearl-1990)) — more on this under "Open questions".

## Interior

Uranus belongs to the ice giants: models place, beneath the hydrogen-helium envelope, an extended
mantle of water, ammonia and methane that, at the pressures and temperatures found there, resembles a
hot, dense fluid rather than classical ice, and below that a small rocky core. As with every giant
planet, only mass, radius, rotation and the even moments of the gravity field constrain such models,
not a direct measurement ([Interior structure](thema:innerer-aufbau)). Whether this structure is
arranged in sharply separated layers, or whether composition and density vary continuously with depth,
remains undecided: reviews place three-layer models explicitly alongside models with non-adiabatic,
inhomogeneous transitions ([Helled et al. 2020](literatur:helled-2020)). An early study found evidence
for a dichotomy between the two otherwise similar ice giants: the outer envelope may hold at most about
8 % heavy elements at Uranus but up to 65 % at Neptune — a finding that points to a more pronounced,
more strongly layered (non-adiabatic) structure for Uranus, while Neptune's higher heat flux, more
consistent with an adiabatic model, fits better with a more homogeneously mixed interior
([Nettelmann et al. 2013](literatur:nettelmann-2013)). Empirical density profiles, fitted to mass,
radius, rotation and the even moments $J_2$ and $J_4$ without assuming fixed layers, confirm this
freedom: many different density profiles that fit equally well already follow from today's data
([Neuenschwander and Helled 2022](literatur:neuenschwander-2022)). Even a substantially more precise
gravity measurement, of the kind only an orbiter could provide, would, according to a study on the
limits of precision gravimetry, hardly resolve the degeneracy between three-layer and transition
models, even though it would make high-order moments such as $J_6$ and $J_8$ accessible for the first
time ([Movshovitz and Fortney 2022](literatur:movshovitz-2022)) — a central argument for the
recommendation of a dedicated orbiter mission (see "Formation and evolution").

One possible explanation for the unusual magnetic field lies in the water itself: shock-compression
experiments in 2018 found a melting point of about $5000\,\mathrm{K}$ at $200\,\mathrm{GPa}$ — about
$4000\,\mathrm{K}$ higher than at $0.5\,\mathrm{Mbar}$ —, a thermodynamic sign of a superionic phase in
which the oxygen lattice stays solid while the hydrogen ions move freely through it, carrying a high
protonic conductivity ([Millot et al. 2018](literatur:millot-2018)); X-ray diffraction on
laser-shocked samples directly confirmed the underlying crystal structure for the first time in 2019
([Millot et al. 2019](literatur:millot-2019)). Exactly such conditions are expected
in the mantle of Uranus and Neptune; they provide a conductive layer without requiring the whole mantle
to be metallic. Numerical dynamo models show that a dynamo confined to a thin, convecting,
electrically conductive shell around a stably stratified, non-convecting core region produces fields
that — unlike a pure dipole — turn out strongly non-dipolar and non-axisymmetric, as Voyager 2 actually
measured ([Stanley and Bloxham 2004](literatur:stanley-2004); see "Atmosphere and magnetosphere").
How deep this conductive shell reaches, and what fraction of rock and ice make up the whole structure,
remains open (see "Open questions").

## Atmosphere and magnetosphere

Voyager 2's radio occultation measurement gave a composition of the upper atmosphere of mostly
molecular hydrogen and helium with about 2.3 % methane
([Lindal et al. 1987](literatur:lindal-1987)). The methane distribution is anything but uniform:
spectroscopy with the Hubble imaging spectrograph showed a compact methane cloud layer at low
latitudes and marked methane depletion over the poles
([Karkoschka and Tomasko 2009](literatur:karkoschka-2009)). Methane in the upper atmosphere
preferentially absorbs red light and gives Uranus its pale blue colour; a holistic aerosol model that
jointly fits reflectance spectra from the ultraviolet to the near infrared also explains the colour
difference from Neptune: over Uranus' comparatively calm, sluggish atmosphere more haze builds up than
over Neptune's more active one, making Uranus appear brighter and paler
([Irwin et al. 2022](literatur:irwin-2022)). The same polar structure explains the seasonal brightness
change: Uranus appears brighter when a more methane-poor polar region faces Earth more directly
([Albedo and brightness](thema:photometrie)).

Voyager 2 discovered in 1986 a magnetic field whose dipole axis is tilted by about 60° to the rotation
axis and offset from the centre by about $0.3$ Uranus radii
([Ness et al. 1986](literatur:ness-1986)). A spherical-harmonic model derived from this (Q3) refined
the tilt to $58.6^\circ$, confirmed the offset and gave a dipole moment of
$0.228\,\mathrm{G}\,R_\mathrm{U}^3$ with an unusually large quadrupole component
([Connerney et al. 1987](literatur:connerney-1987)). Because the field geometry is independent of the
viewing geometry to the Sun, the 97.77°-tilted rotation axis, combined with the skewed dipole, sweeps
out a magnetosphere whose field lines twist corkscrew-like with every rotation. A 2024 reanalysis of
Voyager 2's plasma and field data found that the solar-wind dynamic pressure at the flyby was about
twenty times higher than a week earlier, compressing the magnetosphere to a fraction of its usual
volume, a state that independent solar-wind models predict for only about 4 % of the time
([Jasinski et al. 2024](literatur:jasinski-2024)) — since then it has been open how strongly the
previous picture of the Uranus magnetosphere is shaped by this single, possibly atypical flyby (see
"Open questions").

## Orbit, rotation and dynamics

Uranus orbits the Sun at a mean distance of about 19.19 AU in roughly 84.0 years
([Orbital elements](thema:bahnelemente)); its rotation is retrograde, with an axial tilt of 97.77° to
its own orbit — the geometric angle between the pole and the orbit normal is 82.23°, and only the
negative rotation period flips it to the commonly quoted value (definition and the dispute over its
cause under [Axial tilt](thema:achsneigung); only the consequence here). Over one orbit, each pole
faces the Sun for about 42 years and then lies in darkness for just as long. Because the seasonal
points do not coincide with the apsides of the slightly eccentric orbit, the time intervals between
them are not equal, by Kepler's second law: the southern summer solstice, near which Voyager 2 flew
by, fell on 30 September 1985, the following equinox on 6/7 December 2007 — a good 22 years later —,
and the next northern summer solstice on 11 April 2030 — another good 22 years after that, making
about 44.5 years rather than the 42 years expected from an even split between the two solstices. The
equinox and the northern summer solstice are independently confirmed in the published literature; the
two solstices also follow as extrema of the angle between the orbital direction and the pole, computed
from the orbital
elements and the pole of the data set (own calculation, details under "In the model"), and agree with
independently published dates.

The five large moons Miranda, Ariel, Umbriel, Titania and Oberon orbit almost exactly in Uranus'
equatorial plane and thus prograde with respect to its (by IAU convention retrograde) rotation;
measured against the ecliptic this gives inclinations near 180° rather than near 0°, the same
convention that also pushes the rotation axis itself past 90°. The details of the nodal drift and the
special cases of Miranda and Ariel are covered there as well. The rings lie in exactly the same
strongly tilted equatorial plane and therefore appear, seen from Earth, almost as strongly tilted as
the moons ([Rings](thema:ringe)).

## Formation and evolution

Like the other giant planets, Uranus probably formed closer to the Sun and migrated outward in the
Nice model together with Jupiter, Saturn and Neptune, while the four planets exchanged angular momentum
with a disk of leftover planetesimals; some variants of the model require a fifth ice giant, since
ejected from the system, to make this work ([Formation](thema:entstehung)). The cause of its extreme
axial tilt — one or more giant collisions versus a gradual spin-orbit resonance — is unresolved and is
discussed under [Axial tilt](thema:achsneigung).

Two model families compete to explain the formation of the five large, nearly coplanar, prograde
moons. Simulations of a giant impact show that the resulting debris disk is initially about an order
of magnitude more compact and two orders of magnitude more massive than today's system; only once it
is taken into account that water ice largely vaporises at the temperatures reached, then cools and
migrates outward together with the remaining vapour, does a disk emerge from which moons of the
observed number and mass can condense ([Ida et al. 2020](literatur:ida-2020)). A second model family
instead lets the moons co-accrete from solids in a circumplanetary disk that formed alongside the
planet's own gas accretion, similar to the path assumed for the large moons of Jupiter and Saturn,
though with a condensation zone lying further in because of the lower planetary mass
([Szulágyi et al. 2018](literatur:szulagyi-2018)). Comparing both pathways against the observed masses,
orbits and compositions of the five moons is a matter of ongoing research. Because of this and the open
questions about the interior noted above, the planetary science decadal survey of the National
Academies recommends an orbiter and probe mission to the Uranus system as the top priority among the
large NASA flagship missions of the coming decade
([National Academies of Sciences 2022](literatur:national-academies-2022)).

## Open questions

- **Heat flux and energy balance:** Voyager infrared data gave a ratio of emitted to absorbed power of
  $1.06 \pm 0.08$, consistent with an internal heat flux near zero
  ([Pearl et al. 1990](literatur:pearl-1990)). Two independent reanalyses reached the opposite
  conclusion in 2025: a new atmosphere model gave an emitted flux of
  $0.693 \pm 0.013\,\mathrm{W\,m^{-2}}$ against an absorbed flux of
  $0.604 \pm 0.027\,\mathrm{W\,m^{-2}}$ ([Irwin et al. 2025](literatur:irwin-2025)), while an
  energy-balance calculation over a full orbit gave an internal flux of
  $0.078 \pm 0.018\,\mathrm{W\,m^{-2}}$, only about 12.5 % of the absorbed flux and thus markedly
  less than for any other giant planet ([Wang et al. 2025](literatur:wang-2025)). Why Uranus, despite
  now having a measured positive heat flux, shows so much less of it than Jupiter, Saturn and Neptune
  is open.
- **Interior structure:** Whether Uranus is built from sharply separated layers or whether composition
  and density vary continuously cannot be decided from mass, radius, rotation and the known even
  moments $J_2$ and $J_4$; several equally well-fitting density profiles satisfy the same measured
  quantities ([Neuenschwander and Helled 2022](literatur:neuenschwander-2022)), and even substantially
  more precise gravity data would, given the current state of the art, hardly resolve the degeneracy
  ([Movshovitz and Fortney 2022](literatur:movshovitz-2022)).
- **Cause of the tilt:** Giant collision versus gradual spin-orbit resonance — both explanations have
  proponents and open problems; the decision is pending under
  [Axial tilt](thema:achsneigung).
- **Rotation period:** The redetermination from Hubble auroral observations from 2011 to 2022 is a thousand
  times more precise than the old Voyager radio measurement
  ([Lamy et al. 2025](literatur:lamy-2025)), but like that measurement it tracks the rotation of the
  magnetic field. Whether this period also matches the rotation of the body as a whole remains open
  independently of the gain in precision: unlike Saturn, where gravity field and ring seismology
  provide a second method independent of the radio emission, Uranus so far lacks such a second,
  mechanical determination — one of the goals of a future orbiter mission
  ([National Academies of Sciences 2022](literatur:national-academies-2022)).
- **Atypical flyby:** The only in-situ measurement of the Uranus magnetosphere, according to a
  reanalysis, caught a state that the solar wind produces only about 4 % of the time
  ([Jasinski et al. 2024](literatur:jasinski-2024)); how much the previous picture of the magnetic
  field and magnetosphere is distorted by this can only be settled with further measurements.

## In the model

- **Shape:** `radiusKm` is set to $25362\,\mathrm{km}$, the NSSDC volumetric mean, not the equatorial
  radius $25559\,\mathrm{km}$; the sphere thus sits about 0.8 % below the true 1-bar surface at the
  equator (flattening $0.02293$). `render/bodies.ts` scales every sphere with a single factor, so the
  visible flattening is missing entirely.
- **Rotation:** `rotationPeriodH` is set to $-17.24$, the Voyager radio measurement
  ([Desch et al. 1986](literatur:desch-1986)); the negative sign carries the retrograde sense. Against
  the period determined in 2025, $17.247864\,\mathrm{h}$
  ([Lamy et al. 2025](literatur:lamy-2025)), that is about 28.3 s too short per rotation. Since J2000
  that amounts (as of September 2026, about 26.7 years) to about 13,588 rotations with the old period
  versus about 13,582 with the new one — a marker fixed on the texture in the model would drift from
  the true rotational phase by about 6.2 rotations, or roughly 70° (own calculation).
- **Pole:** $257.311^\circ / -15.175^\circ$ ([Archinal et al. 2018](literatur:archinal-2018)) is
  fixed in space; the small precession of the Uranus pole documented in the report is not taken into
  account ([Reference systems and time scales](thema:bezugssysteme)).
- **Axial tilt:** `achsneigungDeg` forms the angle between the pole and the orbit normal built from
  position and velocity at epoch J2000, and flips it by 180° for a negative rotation period. The
  geometric angle between pole and orbit normal is $82.23^\circ$; with the flip, the data-sheet
  axial tilt comes out as $97.77^\circ$ — exactly the value also given in the NSSDC fact sheet (own
  recalculation using the orbital elements from `uranus.ts` and the pole of the data set; the
  derivation of the convention is given there as well).
- **Orbit and seasons:** The elements come from the JPL approximation table 1800 to 2050, linearly
  advanced against the fixed ecliptic J2000 ([Orbital elements](thema:bahnelemente)); the Kepler orbital
  period from the catalogue mass and semi-major axis is there about 0.05 % above $360^\circ/\dot{L}$,
  the same value derived there. The seasonal dates given in the text are zeros or extrema of the scalar
  product of the pole (`poleVector`) and the unit-length, reversed direction from Uranus to the Sun
  (from `positionAt`), found by bisection over the years 1975 to 2036 (own calculation); they agree
  with independently published dates.
- **Rings:** The band runs from $37800$ to $51600\,\mathrm{km}$, computed from measured data rather
  than an image file ([Rings](thema:ringe); texture question in `ASSETS.md`).
- **Shadows:** Among the five large moons, whenever there are more candidates than slots, the four with
  the largest rendered angular radius are chosen as sphere occluders (`MAX_OKKLUDER` in
  `render/shadows.ts`); Oberon is always left out ([Eclipses](thema:finsternis)).
- **Not shown:** no atmosphere, no magnetic field, no seasonal clouds or polar caps in the renderer; the
  texture is a single, static image from Solar System Scope (CC BY 4.0, `ASSETS.md`), no banded
  structure is drawn separately.
- **Data sheet:** mass, radius, rotation period, pole and albedo of the data set match the cited
  measurements to the stated precision; scale: `sizeScale` scales Uranus and its ring together
  (`sim/scale.ts`). Further simplifications: [Model limits](thema:modell).

*As of September 2026*
