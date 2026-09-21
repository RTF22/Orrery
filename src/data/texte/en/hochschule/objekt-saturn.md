# Saturn

Saturn is the second-largest planet and the outer of the two large gas giants: with a mean density of
only 687 kg/m³ it is the only planet that would float on water, and with an oblateness of 0.098 it is
the most flattened. Cassini orbited it for thirteen years and, during its "Grand Finale", dived 22
times between the planet and its rings before the spacecraft plunged into the atmosphere in 2017;
much of the gravity-field and magnetic-field data cited here comes from exactly these final orbits
([Iess et al. 2019](literatur:iess-2019); [Dougherty et al. 2018](literatur:dougherty-2018)). This
text presents the gravity field and interior, the atmosphere and magnetosphere, and the orbit,
rotation and formation, and finally describes what Orrery models of it; the rings themselves and the
moons [Titan](objekt:titan) and [Enceladus](objekt:enceladus) have their own texts, as does
[Jupiter](objekt:jupiter), the other large gas giant.

## Parameters and measurement

As with Jupiter, radio tracking of a spacecraft yields Saturn's gravity field directly from the
Doppler shift of its orbit. Five of the 22 Grand Finale orbits, during which Cassini dived between the
inner edge of the D ring and the cloud tops, gave, referred to the radius of 60,330 km,
$J_2 = 16290.573 \cdot 10^{-6}$, $J_4 = -935.314 \cdot 10^{-6}$ and $J_6 = 86.340 \cdot 10^{-6}$, with
uncertainties of a few $10^{-2} \cdot 10^{-6}$, together with further even moments tightly constrained
up to $J_{10}$ and $J_{12}$ additionally determined ([Iess et al. 2019](literatur:iess-2019)). As with
Jupiter, odd moments at Saturn are also non-zero – at least $J_3$, $J_5$ and $J_9$ – the signature of
internal flows; their signal arises entirely from the north–south antisymmetric component of
differential rotation ([Iess et al. 2019](literatur:iess-2019)). This implies that Saturn's winds
extend about 9000 km deep, over three times as deep as Jupiter's; more on wind depth and the moment of
inertia factor is given under [Interior structure](thema:innerer-aufbau). As a byproduct of the same
tracking, the mass of the rings came out to $(1.54 \pm 0.49) \cdot 10^{19}\,\mathrm{kg}$, about 0.41
times the mass of Mimas – markedly less than older models expected for rings as old as the planet
([Iess et al. 2019](literatur:iess-2019); more under [Rings](thema:ringe)).

| Quantity | Value | Uncertainty | Method | Source |
|---|---|---|---|---|
| Mass | $5.6832 \cdot 10^{26}\,\mathrm{kg}$ | – | Tracking (Cassini) | [NSSDC Saturn Fact Sheet](quelle:nssdc-saturn) |
| $GM$ | $3.7931 \cdot 10^{7}\,\mathrm{km^3\,s^{-2}}$ | – | Orbit tracking | [NSSDC Saturn Fact Sheet](quelle:nssdc-saturn) |
| Equatorial radius (1 bar) | $60268\,\mathrm{km}$ | – | Radio occultation, 1 bar level | [NSSDC Saturn Fact Sheet](quelle:nssdc-saturn) |
| Polar radius (1 bar) | $54364\,\mathrm{km}$ | – | Radio occultation | [NSSDC Saturn Fact Sheet](quelle:nssdc-saturn) |
| Volumetric mean radius | $58232\,\mathrm{km}$ | – | from equatorial and polar radius | [NSSDC Saturn Fact Sheet](quelle:nssdc-saturn) |
| Ellipticity | $0.09796$ | – | (equatorial minus polar radius)/equatorial radius | [NSSDC Saturn Fact Sheet](quelle:nssdc-saturn) |
| Mean density | $687\,\mathrm{kg\,m^{-3}}$ | – | from mass and volume | [NSSDC Saturn Fact Sheet](quelle:nssdc-saturn) |
| $J_2$ | $16290.573 \cdot 10^{-6}$ | $0.028 \cdot 10^{-6}$ | Grand Finale tracking, 5 passes | [Iess et al. 2019](literatur:iess-2019) |
| $J_4$ | $-935.314 \cdot 10^{-6}$ | $0.037 \cdot 10^{-6}$ | Grand Finale tracking | [Iess et al. 2019](literatur:iess-2019) |
| $J_6$ | $86.340 \cdot 10^{-6}$ | $0.087 \cdot 10^{-6}$ | Grand Finale tracking | [Iess et al. 2019](literatur:iess-2019) |
| $C/(Ma^2)$, measured | $0.2258$ | $0.0025$ (1σ) | pole precession, $a = 60330$ km | [Jacobson 2022](literatur:jacobson-2022) |
| $C/(Ma^2)$, model | $0.2181$ | $0.0002$ | interior model with winds, fit to $J_2$ through $J_{10}$, $a = 60268$ km | [Militzer and Hubbard 2023](literatur:militzer-2023) |
| Geometric albedo | $0.499$ | – | photometric (V band) | [Mallama et al. 2017](literatur:mallama-2017) |
| Bond albedo | $0.41$ | $0.02$ | Cassini radiometry | [Wang et al. 2024a](literatur:wang-2024a) |
| Ring mass | $1.54 \cdot 10^{19}\,\mathrm{kg}$ | $0.49 \cdot 10^{19}\,\mathrm{kg}$ | Grand Finale tracking | [Iess et al. 2019](literatur:iess-2019) |

## Interior

Cassini's ring seismology makes Saturn's interior directly audible: stellar occultations in the C
ring revealed waves excited by the planet's own oscillations. Together with $J_2$, $J_4$, $J_6$ and
the frequencies of several observed modes, this requires a stably stratified transition zone between
core and envelope out to $r/R = 0.59 \pm 0.01$, holding about 17 Earth masses of ice and rock – a
"dilute" rather than sharply bounded core, as is now also assumed for Jupiter
([Mankovich and Fuller 2021](literatur:mankovich-2021); more under
[Interior structure](thema:innerer-aufbau)). The stratification itself could be a consequence of
helium rain: once the temperature in the outer hydrogen–helium mixture drops below the miscibility
limit of the two substances, helium condenses out in droplets and sinks inward; the resulting
composition gradient opposes convection and could produce the layer that seismology requires
([Mankovich and Fuller 2021](literatur:mankovich-2021)).

The heat budget also reveals the interior: like Jupiter, Saturn radiates more energy overall than it
receives from the Sun. Cassini radiometry gave a Bond albedo of $0.41 \pm 0.02$ instead of the older
$0.34 \pm 0.03$ derived from Voyager data, and an internal heat flux of
$2.84 \pm 0.20\,\mathrm{W\,m^{-2}}$ instead of $2.01 \pm 0.14\,\mathrm{W\,m^{-2}}$
([Wang et al. 2024a](literatur:wang-2024a); [Albedo and brightness](thema:photometrie)) – an even
larger heat excess than older balances showed, one that contraction since formation
(Kelvin–Helmholtz mechanism, see "Formation and evolution") alone can hardly explain and that
suggests additional energy from helium rain. How strongly core and envelope deform under tides is
also revealed by Saturn's $k_2$ and its quality factor $Q$, determinable from Titan's orbital
evolution (see [Tides](thema:gezeiten)). Which equation of state for hydrogen and helium
simultaneously matches the stratification, the wind depth and the moment of inertia is, as with
Jupiter, an open dispute (see below).

## Atmosphere and magnetosphere

Saturn's atmosphere, like Jupiter's, consists mostly of molecular hydrogen and helium, with traces of
methane, ammonia and water vapour deep in the cloud deck
([NSSDC Saturn Fact Sheet](quelle:nssdc-saturn)). The visible bands mark rising and sinking flow;
their equatorial eastward jet is among the fastest in the solar system and, as derived above, extends
about 9000 km deep. At the north pole, a hexagonal band of flow encloses a central polar vortex;
Cassini's infrared spectroscopy showed in 2018 that this pattern continues into the stratosphere,
about 300 km above the cloud deck, with a thermal boundary near 78° north that is likewise hexagonal
([Fletcher et al. 2018](literatur:fletcher-2018)). Roughly once every Saturn year (29.5 years), a
"Great White Spot" erupts in the northern hemisphere, a planet-encircling storm; six such outbreaks
have been recorded since 1876. The outbreak of 5 December 2010 at 37.7° north latitude showed,
through the propagation speed of the storm head relative to the local westward jet, that Saturn's
winds extend to great depth without notable decay
([Sánchez-Lavega et al. 2011](literatur:sanchez-lavega-2011)).

During the Grand Finale, Cassini itself collected dust grains falling from the rings into the upper
atmosphere: nanometre-sized particles at high concentration near the ring plane and at mid-latitudes
confirmed the "ring rain" suspected since Voyager and the coupling between the rings and the
ionosphere ([Hsu et al. 2018](literatur:hsu-2018)). Saturn's magnetic field is exceptionally
axisymmetric: in-situ measurements during the Grand Finale orbits gave a tilt of the dipole axis
against the rotation axis of under $0.007^\circ$
([Dougherty et al. 2018](literatur:dougherty-2018)). The magnetic equator lies about
$2820 \pm 26\,\mathrm{km}$ ($0.0468\,R_\mathrm{S}$) north of the geometric one; small-scale but still
axisymmetric structures of high order point to a shallow second dynamo in the semiconducting hydrogen
near the surface ([Cao et al. 2020](literatur:cao-2020)).

The magnetosphere is fed to a large extent by [Enceladus](objekt:enceladus): its plumes supply the
water vapour and ice that form the E ring and, at the same time, dominate the plasma of the inner
magnetosphere ([Cassini mission](quelle:nasa-cassini)). Charged particles that plunge along the field
lines into the upper atmosphere produce auroras at both poles. The magnetic field also modulates a
radio emission, Saturn kilometric radiation (SKR); because it is tied to the field and hence
apparently to the rotation of the interior, it long served as its clock – until Cassini showed that
its period drifted over the course of the mission (see "Orbit, rotation and dynamics").

## Orbit, rotation and dynamics

Saturn orbits the Sun at a mean distance of about 9.54 AU in 10,755.7 days, about 29.45 years
([Orbital elements](thema:bahnelemente)); from the catalogue mass and semi-major axis, Kepler's
third law gives 10,755.3 days, about 0.4 days less than the fact-sheet value
([NSSDC Saturn Fact Sheet](quelle:nssdc-saturn)).

Like Jupiter, Saturn has no solid surface as a gas giant from which a rotation period could be read
off – but unlike there, even the second-best method, radio emission, disagrees with itself. Voyager
measured, from the modulation of Saturn kilometric radiation in 1980/81,
$10\,\mathrm{h}\,39\,\mathrm{min}\,24\,\mathrm{s} \pm 7\,\mathrm{s}$
([Desch and Kaiser 1981](literatur:desch-1981)); Cassini instead found, for the same radiation,
$10\,\mathrm{h}\,45\,\mathrm{min}\,45\,\mathrm{s} \pm 36\,\mathrm{s}$, a good six minutes more, and
the period kept drifting over the mission's 13 years – it has since no longer been regarded as a
clock of the interior, but as a quantity that varies with the solar wind and with material from
Enceladus's ring current ([Gurnett et al. 2005](literatur:gurnett-2005)). Two methods independent of
radio emission instead date it markedly faster: from Saturn's gravity field and its oblateness, an
optimization gave $10\,\mathrm{h}\,32\,\mathrm{min}\,45\,\mathrm{s} \pm 46\,\mathrm{s}$
([Helled et al. 2015](literatur:helled-2015)), and from the rings' own oscillations,
$10\,\mathrm{h}\,33\,\mathrm{min}\,38\,\mathrm{s}$ (+1 min 52 s/−1 min 19 s;
[Mankovich et al. 2019](literatur:mankovich-2019)) – about 13 minutes faster than the classical
Voyager period. Details of the model value are given under "In the model".

Saturn's axis is tilted $26.73^\circ$ from its orbit – the third-largest obliquity among the planets,
after Uranus (97.77°) and Neptune (28.32°) – and at the same time the tilt of the ring plane, which
coincides with the equator. Its
cause is not conclusively settled (see "Open questions"): Ward and Hamilton showed in 2004 that the
precession period of Saturn's spin axis lies close to the nodal precession period of the orbit of
[Neptune](objekt:neptune) – a secular spin–orbit resonance that could have driven the obliquity from a
small initial value up to its present one since formation, with a possible libration amplitude of up
to $31^\circ$ ([Ward and Hamilton 2004](literatur:ward-2004)). An alternative proposed in 2022 places
the resonance more recently: a now-destroyed moon, named "Chrysalis", would have held Saturn exactly
in the resonance for billions of years and broken apart some 100 million years ago, its debris forming
today's rings while Saturn drifted just out of the resonance
([Wisdom et al. 2022](literatur:wisdom-2022)).

The ring plane and the equator coincide, so the ring opening seen from Earth changes with Saturn's own
year: twice per orbit, near the equinoxes, the ring appears exactly edge-on from Earth; the most
recent such crossing occurred on 23 March 2025.

## Formation and evolution

Like Jupiter, Saturn probably formed by core accretion: a core of ice and rock first collected
planetesimals until its mass sufficed to capture gas in a self-reinforcing second phase; this model
needs a planetesimal surface density elevated above a minimum solar nebula and then gives formation
times of 1 to 10 million years for both gas giants
([Pollack et al. 1996](literatur:pollack-1996); [Formation](thema:entstehung)). After gas accretion,
in the "Grand Tack" model Jupiter first migrated inward to 1.5 AU and then turned back outward
together with Saturn, truncating the terrestrial planets' planetesimal disk at 1 AU; this requires
both planets to enter the 3:2 orbital resonance during the migration
([Walsh et al. 2011](literatur:walsh-2011)). Later, after the gas dispersed, in the Nice model the
giant planets exchanged angular momentum with the remaining planetesimal disk: Jupiter migrated inward
by ejecting bodies, while Saturn, Uranus and Neptune scattered them preferentially inward and migrated
outward, with Jupiter and Saturn crossing their present 1:2 resonance along the way, which set the
giant planets' semi-major axes and eccentricities to their present values.

The lasting heat excess that Saturn has radiated since its formation likely stems, besides
contraction, from an ongoing helium rain as well (see "Interior"). The age of the rings themselves –
whether they are as old as Saturn or, as the low ring mass measured in the Grand Finale suggests, only
ten to a hundred million years old – is discussed under [Rings](thema:ringe).

## Open questions

- **True rotation period:** radio measurements (10 h 39 min 24 s for Voyager, 10 h 45 min 45 s and
  drifting for Cassini), gravity field and oblateness (10 h 32 min 45 s), and ring seismology
  (10 h 33 min 38 s) disagree by about 13 minutes; which of these methods captures Saturn's true
  interior rotation is open
  ([Desch and Kaiser 1981](literatur:desch-1981); [Gurnett et al. 2005](literatur:gurnett-2005);
  [Helled et al. 2015](literatur:helled-2015); [Mankovich et al. 2019](literatur:mankovich-2019)).
- **Extent and nature of the dilute core:** ring seismology requires a stably stratified zone out to
  $r/R = 0.59 \pm 0.01$ holding about 17 Earth masses of ice and rock
  ([Mankovich and Fuller 2021](literatur:mankovich-2021)); the same uncertainty shows up in the moment
  of inertia: Saturn's pole precession gives $C/(Ma^2) = 0.2258 \pm 0.0025$, more than any interior
  model predicts, while a model fit to the gravity field with winds gives $0.2181 \pm 0.0002$, a
  difference of 2.4 to 3.3σ depending on which uncertainty is used
  ([Interior structure](thema:innerer-aufbau)).
- **Cause of the obliquity:** the secular spin–orbit resonance with Neptune explains why Saturn's
  precession lies close to the resonance, not necessarily how it got there
  ([Ward and Hamilton 2004](literatur:ward-2004)). The Chrysalis hypothesis proposes that a now-lost
  moon held Saturn exactly in the resonance for billions of years and that its breakup around 100
  million years ago both produced the rings and let Saturn drift slightly out of the resonance – a
  timescale compatible with the ring formation age inferred from the ring mass, ten to a hundred
  million years, without either finding proving the other
  ([Wisdom et al. 2022](literatur:wisdom-2022); [Iess et al. 2019](literatur:iess-2019)).
- **Cause of the magnetic field's axisymmetry:** a dynamo whose field coincides exactly with the
  rotation axis should not, by classical dynamo theory, actually be able to sustain itself; the tilt
  of under $0.007^\circ$ measured by Cassini is the strongest known axisymmetry of any planetary
  magnetic field ([Dougherty et al. 2018](literatur:dougherty-2018)). A stably stratified zone
  separating the dynamo from the visible surface could filter out non-axisymmetric components; the
  small-scale but again axisymmetric high-order structures point to a shallow second dynamo in this
  zone, without proving the mechanism
  ([Cao et al. 2020](literatur:cao-2020)).

## In the model

- **Orbit:** the elements come from the JPL approximate-position table for 1800 to 2050, linearly
  propagated against the fixed J2000 ecliptic ([Orbital elements](thema:bahnelemente)). The orbital
  period computed from the catalogue mass and semi-major axis via Kepler's third law comes to
  10,755.3 days, about 0.4 days less than the fact-sheet value of 10,755.7 days.
- **Shape:** like every body, Saturn is a sphere with the mean radius in the model; `radiusKm` is set
  to 58,232 km, the NSSDC volumetric mean, not the equatorial radius of 60,268 km. The sphere
  therefore sits 2036 km below the actual 1-bar surface at the equator and 3868 km above it at the
  poles (ellipticity 0.09796); `render/bodies.ts` scales every sphere with only a single factor, so
  the visible flattening is entirely absent, even though it is more pronounced for Saturn than for
  any other planet (the same simplification as for Jupiter, see
  [Interior structure](thema:innerer-aufbau)).
- **Rotation:** `rotationPeriodH` is set to 10.656 h. The official IAU rotation rate for Saturn's
  System III ($810.7939024^\circ$ per day, [Archinal et al. 2018](literatur:archinal-2018)) gives
  10.65622 h from this – the dataset matches it to under a second, and so traces back essentially to
  the old Voyager radio measurement rather than the newer, faster determinations (see "Open
  questions"). The texture rotates rigidly as a whole at this single period; no banding, no jet
  stream is represented individually. At the difference to the ring-seismology period, a real
  feature rotating at that faster rate would drift about 157° away from the marking fixed on the
  model's texture within a single year – an effect the simulation does not show, because it does not
  draw any individual feature separately.
- **Pole and obliquity:** the stored pole (40.589°/83.537°) matches the 2015 IAU report exactly.
  Recomputing with `achsneigungDeg` gives $26.730^\circ$ against the orbital normal stored in the
  dataset – matching the obliquity of $26.73^\circ$ given in the fact sheet
  ([NSSDC Saturn Fact Sheet](quelle:nssdc-saturn)) to two decimal places, markedly closer than for
  [Jupiter](objekt:jupiter) or Mars. `rotationAtEpochDeg` is set to 0; the IAU report gives
  $W_0 = 38.90^\circ$ for the rotation phase at J2000.0 – Saturn's map zero meridian in the model
  therefore does not sit where the report puts it, which affects only the map's orientation.
- **Albedo and GM:** the catalogue value 0.499 is the geometric albedo and matches the NSSDC fact
  sheet and [Mallama et al. 2017](literatur:mallama-2017), as documented for all planets in
  [Albedo and brightness](thema:photometrie). The product of the catalogue mass and $G$ deviates from
  the dynamically determined $GM$ by +5 ppm ([Interior structure](thema:innerer-aufbau)).
- **Rings:** `appearance.rings` draws a flat disk from 74,658 to 136,780 km – the C ring's inner edge
  to the A ring's outer edge – with an image file as texture whose alpha channel carries the radial
  banding as opacity; unlike the computed Uranus ring, there is no measured density profile behind
  it. The D, F, G and E rings are absent, as is any thickness or individual particle; details and the
  solar system's four ring systems are covered under [Rings](thema:ringe).
- **Shadows:** `waehleOkkluder` in `render/shadows.ts` selects Saturn's four moons with the largest
  displayed angular radius as sphere occluders: Titan, Tethys, Dione and Rhea; Mimas, Enceladus and
  Iapetus never cast a shadow in the model, even though real solar elevations would allow it
  ([Eclipses](thema:finsternis)). At Saturn's 26.7° obliquity, the shadow window ranges from 18.2°
  for Mimas to 2.7° for Titan; seen from Saturn, the Sun has, on average, only 0.028° angular radius.
  The ring itself acts as its own occluder (`RingOkkluder`), whose opacity comes from the same alpha
  channel as the display: when Saturn's shadow falls on its own ring, it removes the direct light
  entirely and leaves only `RING_SCHATTEN_RESTLICHT` (0.3) of the night-side fill as planetshine; the
  forward-scattering glow stays unshadowed.
- **Data block:** the dataset's mass, radius, rotation, pole and albedo consistently match the cited
  measurements to the stated precision. Scale: `sizeScale` scales Saturn and its ring together
  (`sim/scale.ts`). Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
