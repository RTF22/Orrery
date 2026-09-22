# Neptune

Neptune is the outermost of the eight planets and, by radius, the smaller of the two ice giants, but
by mass the heavier one: its volumetric mean radius stays about 3 % below that of
[Uranus](objekt:uranus), whose mass in turn stays a good 15 % below Neptune's own mass
([NSSDC Neptune Fact Sheet](quelle:nssdc-neptune); [Uranus](objekt:uranus)). Together with Uranus it
shares the class of ice giants — beneath an envelope of hydrogen and helium, a mantle made mostly of
water, ammonia and methane — yet Neptune radiates markedly more heat of its own, shows the strongest
measured winds in the solar system, and carries a magnetic field tilted and offset in a similarly
skewed way to that of Uranus. The Neptune system, too, has so far been seen by only one spacecraft:
Voyager 2 passed the planet on 25 August 1989
([Stone and Miner 1989](literatur:stone-1989); [Smith et al. 1989](literatur:smith-1989)). Almost
everything learned about the system since then comes from Earth, from Hubble and from JWST, or from
model calculations; this text names, for every value, what it rests on. This article covers parameters
and interior, atmosphere and magnetosphere, as well as orbit, rotation, formation and the Orrery model;
the axial tilt has its own, comparative text ([Axial tilt](thema:achsneigung)), as do the rings
([Rings](thema:ringe)), the 3:2 resonance with [Pluto](objekt:pluto)
([Orbital resonances](thema:resonanzen)), and the large, retrograde moon
[Triton](objekt:triton), shown by the scene [Triton's retrograde orbit](szene:triton-rueckwaerts); how
small the Sun appears from Neptune's distance is shown by
[From Neptune to the distant Sun](szene:ferne-sonne).

## Parameters and measurement

Neptune's gravity field, the orientation of its pole, and the orbits of Triton, Nereid and Proteus were
determined from Voyager 2's radio tracking together with decades of ground-based astrometry of
Triton's orbit ([Jacobson 2009](literatur:jacobson-2009)); the $J_2$ and $J_4$ values reported there
refer to a historically fixed reference radius of 25,225 km, different from the 1-bar surface.

| Quantity | Value | Uncertainty | Determination | Source |
|---|---|---|---|---|
| Mass | $1.02409 \cdot 10^{26}\,\mathrm{kg}$ | – | Orbit tracking, moon orbit | [NSSDC Neptune Fact Sheet](quelle:nssdc-neptune) |
| $GM$ (system) | $6836527.1\,\mathrm{km^3\,s^{-2}}$ | $10\,\mathrm{km^3\,s^{-2}}$ | Voyager 2 tracking, Triton's orbit | [Jacobson 2009](literatur:jacobson-2009) |
| $GM$ (Neptune alone) | $6835100\,\mathrm{km^3\,s^{-2}}$ | about $10\,\mathrm{km^3\,s^{-2}}$ | as above, system minus Triton's $GM$ | [Jacobson 2009](literatur:jacobson-2009) |
| Equatorial radius (1 bar) | $24766\,\mathrm{km}$ | $15\,\mathrm{km}$ | Radio occultation | [Lindal 1992](literatur:lindal-1992) |
| Polar radius (1 bar) | $24342\,\mathrm{km}$ | $30\,\mathrm{km}$ | Radio occultation | [Lindal 1992](literatur:lindal-1992) |
| Volumetric mean radius | $24622\,\mathrm{km}$ | – | from equatorial and polar radius | [NSSDC Neptune Fact Sheet](quelle:nssdc-neptune) |
| Flattening | $0.0171$ | $0.0014$ | (equatorial minus polar radius)/equatorial radius | [Lindal 1992](literatur:lindal-1992) |
| $J_2$ (reference radius 25,225 km) | $3408.43 \cdot 10^{-6}$ | $4.50 \cdot 10^{-6}$ | Orbit tracking | [Jacobson 2009](literatur:jacobson-2009) |
| $J_4$ (reference radius 25,225 km) | $-33.40 \cdot 10^{-6}$ | $2.90 \cdot 10^{-6}$ | Orbit tracking | [Jacobson 2009](literatur:jacobson-2009) |
| Rotation period (radio modulation) | $16.11\,\mathrm{h}$ | – | Voyager 2 radio emission | [Warwick et al. 1989](literatur:warwick-1989) |
| Rotation period (south polar features) | $15.9663\,\mathrm{h}$ | $0.0002\,\mathrm{h}$ | photometric tracking of two stable features | [Karkoschka 2011](literatur:karkoschka-2011) |
| Rotation period (from shape) | $\approx 17.46\,\mathrm{h}$ | – | minimising wind speed and dynamic height against shape and gravity field | [Helled et al. 2010](literatur:helled-2010) |
| Pole | $299.3337^\circ / 42.9504^\circ$ | – | IAU report, epoch J2000, fixed in the data set | [Archinal et al. 2018](literatur:archinal-2018) |
| Geometric albedo | $0.442$ | – | Photometric | [NSSDC Neptune Fact Sheet](quelle:nssdc-neptune) |
| Bond albedo | $0.290$ | $0.067$ | Voyager infrared photometry (IRIS) | [Pearl and Conrath 1991](literatur:pearl-1991) |
| Effective temperature | $59.3\,\mathrm{K}$ | $0.8\,\mathrm{K}$ | Voyager IRIS | [Pearl and Conrath 1991](literatur:pearl-1991) |
| Energy balance (emitted/absorbed) | $2.61$ | $0.28$ | Voyager IRIS, averaged over one rotation | [Pearl and Conrath 1991](literatur:pearl-1991) |
| Internal heat flux | $0.43\,\mathrm{W\,m^{-2}}$ | $0.09\,\mathrm{W\,m^{-2}}$ | from energy balance and Bond albedo | [Pearl and Conrath 1991](literatur:pearl-1991) |

The product of $G$ and the catalogue mass gives $6835083.9\,\mathrm{km^3\,s^{-2}}$: about 2 ppm below
the dynamically determined $GM$ of the planet alone, but about 211 ppm below the $GM$ of the system —
the difference of about $1427\,\mathrm{km^3\,s^{-2}}$ is of the same order as Triton's own $GM$ (about
$1428\,\mathrm{km^3\,s^{-2}}$ in more recent solutions), which accounts for almost all of the
difference between the system and planet $GM$. Equatorial and polar radius deviate from the
volume-equivalent mean by $0.0171$ because of rotation ([Lindal 1992](literatur:lindal-1992)); the
equatorial radius is thus about 0.6 % above the volumetric mean radius the data set carries as
`radiusKm` (see "In the model").

Like Uranus, Neptune has no solid surface from which a rotation period could be read off directly, and
as with Uranus the available methods disagree widely. Voyager determined
$16.11\,\mathrm{h}$ in 1989 from the modulation of the magnetic field's radio emission
([Warwick et al. 1989](literatur:warwick-1989)); a 2011 analysis of two extraordinarily stable features
near the south pole, the "South Polar Feature" and the "South Polar Wave", observed for about twenty
years, gave $15.9663 \pm 0.0002\,\mathrm{h}$ — about 8.6 minutes shorter per rotation, with a
thousandfold smaller uncertainty ([Karkoschka 2011](literatur:karkoschka-2011)). A third, independent
determination fits no rotational phase at all, but instead fits the flattening derived from wind speeds
and the single measured occultation latitude to a fixed rotation period, minimising wind speed and the
dynamic height of the 1-bar surface; it gives about $17.46\,\mathrm{h}$ — longer, not shorter, than the
Voyager period ([Helled et al. 2010](literatur:helled-2010)). The three values differ by more than an
hour and agree only in that none of them necessarily measures the rotation of the deep interior (see
"Open questions"). The geometric albedo is comparable with the other giant planets, but the lowest
among them in mean opposition brightness ([Albedo and brightness](thema:photometrie)); the Bond albedo
and energy balance come from the same Voyager infrared analysis, which found for Neptune a
particularly high ratio of emitted to absorbed power — about 2.6 times
([Pearl and Conrath 1991](literatur:pearl-1991)).

## Interior

Like Uranus, Neptune belongs to the ice giants: beneath the hydrogen-helium envelope lies an extended
mantle of water, ammonia and methane, and below that a small rocky core. As with every giant planet,
only mass, radius, rotation and the even moments of the gravity field constrain such models, not a
direct measurement ([Interior structure](thema:innerer-aufbau)). Despite their similar size and
composition, Uranus and Neptune differ in two central respects: the outer envelope may hold at most
about 8 % heavy elements at Uranus but up to 65 % at Neptune
([Nettelmann et al. 2013](literatur:nettelmann-2013); [Uranus](objekt:uranus)), and Neptune's markedly
higher heat flux (see "Parameters"), more consistent with an adiabatic model, fits a more homogeneously
mixed interior, while Uranus' flux, measured near zero, points to a more strongly layered,
non-adiabatic structure ([Nettelmann et al. 2013](literatur:nettelmann-2013)). Reviews nonetheless place
three-layer models for both planets explicitly alongside models with continuous, non-adiabatic
transitions ([Helled et al. 2020](literatur:helled-2020)), and empirical density profiles, fitted to
mass, radius, rotation and the even moments $J_2$ and $J_4$ without assuming fixed layers, show the
same freedom for both ice giants: many different density profiles that fit equally well already follow
from today's data ([Neuenschwander and Helled 2022](literatur:neuenschwander-2022)). Even a
substantially more precise gravity measurement, of the kind only an orbiter could provide, would,
according to a study on the limits of precision gravimetry, hardly resolve the degeneracy between
three-layer and transition models, even though it would make high-order moments such as $J_6$ and
$J_8$ accessible for the first time
([Movshovitz and Fortney 2022](literatur:movshovitz-2022)).

Neptune's — like Uranus' — unusual, strongly non-dipolar and non-axisymmetric magnetic field (see
"Atmosphere and magnetosphere") can be explained by a dynamo confined to a thin, convecting,
electrically conductive shell around a stably stratified, non-convecting core region, rather than
pervading the whole mantle ([Stanley and Bloxham 2004](literatur:stanley-2004)). A possible
microphysical basis for this lies in the water itself: at the pressures and temperatures expected in
the mantle, a superionic phase is expected in which the oxygen lattice stays solid while the hydrogen
ions move freely through it, carrying a high protonic conductivity (see
[Interior structure](thema:innerer-aufbau) for the details of this mechanism, which also applies to
Uranus). How deep this conductive shell reaches at Neptune, and what fraction of rock and ice make up
the whole structure, remains open (see "Open questions").

## Atmosphere and magnetosphere

Voyager 2's radio occultation measurement gave a composition of the upper atmosphere of mostly
molecular hydrogen and helium in a ratio near 85:15, with about 2 % methane in the deep troposphere
([Lindal 1992](literatur:lindal-1992)). Methane preferentially absorbs red light and gives Neptune its
strong blue colour; a holistic aerosol model that jointly fits reflectance spectra from the ultraviolet
to the near infrared also explains the colour difference from Uranus: over Uranus' comparatively calm,
sluggish atmosphere more haze builds up than over Neptune's more active one, making Uranus appear
brighter and paler, and Neptune more strongly blue
([Irwin et al. 2022](literatur:irwin-2022); [Uranus](objekt:uranus)).

Voyager image sequences of cloud features gave Neptune's equator a retrograde wind speed of up to about
$400\,\mathrm{m\,s^{-1}}$ against the rotation, and a prograde jet of about $250\,\mathrm{m\,s^{-1}}$
near 70° south ([Sromovsky et al. 1993](literatur:sromovsky-1993)) — the strongest directly measured
winds in the solar system. Voyager also discovered the Great Dark Spot, an anticyclonic storm system
roughly the size of Earth ([Smith et al. 1989](literatur:smith-1989)); by the time of the next Hubble
observation it had already vanished. Since then Hubble has repeatedly discovered new dark spots and
watched them shrink again, such as one first seen in 2015 that had shrunk to about 3,700 km in length
by 2018 ([Wong et al. 2018](literatur:wong-2018)); such spots evidently form and dissolve repeatedly,
unlike the single, eponymous spot of 1989. Over a near-infrared record spanning almost thirty years,
Neptune's cloud activity from 1994 to 2022 correlated with solar Lyman-α emission, pointing to
photochemical cloud formation driven by solar ultraviolet light; a marked, broad cloud decline from
2019 to 2023 fits this relationship, even though seasonal effects likely also play a role for the
slower changes ([Chavez et al. 2023](literatur:chavez-2023); [Albedo and brightness](thema:photometrie)).

Voyager 2 found in 1989 a magnetic field whose (simplified) dipole model is tilted by about 47° to the
rotation axis and offset from the centre by about 0.55 Neptune radii
([Ness et al. 1989](literatur:ness-1989)) — similarly skewed and offset as at Uranus, and explainable
by the same dynamo mechanism in a thin conductive shell (see "Interior"). Because the field geometry is
independent of the viewing geometry to the Sun, even the comparatively moderate axial tilt of 28.3°,
combined with the skewed dipole, sweeps out a complex magnetosphere that twists with every rotation;
no source opened for this text reports a reliable detection of aurorae at Neptune.

## Orbit, rotation and dynamics

Neptune orbits the Sun at a mean distance of about 30.1 AU in roughly 164.8 years
([Orbital elements](thema:bahnelemente)); since its discovery in 1846 from the orbital perturbations of
Uranus it has completed only a single full orbit, in 2011. Its axial tilt of 28.3° to its own orbit is
moderate compared with the extreme tilt of Uranus, but markedly larger than for the other giant planets
except Saturn; the definition, the measured value and the precise model value
28.318° are given under [Axial tilt](thema:achsneigung). The southern summer solstice, near which the visibility of
Neptune's south pole was greatest, fell in 2005 ([Albedo and brightness](thema:photometrie)).

Neptune is also the anchor of the solar system's best-known orbital resonance: Pluto and the Plutinos
orbit the Sun twice, on average, for every three orbits of Neptune, protected by a libration of the
resonant angle $\varphi_\mathrm{P} = 3\lambda_\mathrm{P} - 2\lambda_\mathrm{N} - \varpi_\mathrm{P}$
around 180° with about 76° amplitude and a period of about 19,670 years, so that the two bodies, despite
their crossing orbits, never come closer than 18 AU
([Cohen and Hubbard 1965](literatur:cohen-1965); [Orbital resonances](thema:resonanzen)). Neptune also
carries several faint, partly arc-shaped rings, of which the outermost, the Adams ring, concentrates
its material into a few dense arcs ([Rings](thema:ringe)). Its moon system consists mostly of small,
irregular bodies and the by far largest moon, [Triton](objekt:triton), which alone orbits Neptune
retrograde, just inside the Roche limit — unlike any other large moon in the solar system; also
present are the highly eccentric Nereid and the small, inner Proteus. How extreme Triton's retrograde
orbit appears from Earth is shown by the scene
[Triton's retrograde orbit](szene:triton-rueckwaerts); details on Triton itself are given there.

## Formation and evolution

Like the other giant planets, Neptune probably formed closer to the Sun and migrated outward in the
Nice model. According to the review this stage relies on, Neptune began at about 20 to 25 AU, a
possible additional fifth ice giant, since ejected from the system, began at about 10 AU, and the
instability that set everything off began when Neptune reached about 27.7 AU
([Formation](thema:entstehung)). During this migration, Neptune captured Pluto and the other Plutinos
into the 3:2 resonance that persists today ([Orbital resonances](thema:resonanzen)).

Triton itself, according to the now most widely accepted view, is not a moon that formed in place but a
captured one: it was originally part of a trans-Neptunian binary that was torn apart during a close
encounter with the young Neptune, in a three-body interaction — Triton remained bound to Neptune, while
its former partner continued on a hyperbolic orbit
([Agnor and Hamilton 2006](literatur:agnor-2006)). Such a capture would have strongly disturbed
Neptune's original, presumably coplanar and prograde moon system; details of this process and its
consequences for Triton's own orbit and heating history are given in the text on Triton. Because of the
open questions about the interior and magnetosphere that Neptune shares with Uranus, and because of the
particular astrobiological interest of a possible ocean beneath Triton's surface, the National
Academies' decadal survey discusses a later Neptune-Triton mission alongside the Uranus mission
recommended with the highest priority, without giving it the same top priority
([National Academies of Sciences 2022](literatur:national-academies-2022); [Uranus](objekt:uranus)).

## Open questions

- **Rotation period of the deep interior:** Voyager's radio measurement ($16.11\,\mathrm{h}$), the
  photometric determination from stable south polar features ($15.9663\,\mathrm{h}$,
  [Karkoschka 2011](literatur:karkoschka-2011)) and a shape-based estimate ($\approx 17.46\,\mathrm{h}$,
  [Helled et al. 2010](literatur:helled-2010)) differ by more than an hour; none of them necessarily
  measures the rotation of the deep interior, and whether a single period even describes the fixed
  rotation of the whole body, given possible internal differential rotation, is open.
- **Internal heat:** Why Neptune, with a ratio of emitted to absorbed power of about 2.6, radiates so
  much more internal heat than the nearly balanced Uranus is not conclusively explained despite several
  modelling approaches (see "Interior")
  ([Pearl and Conrath 1991](literatur:pearl-1991); [Nettelmann et al. 2013](literatur:nettelmann-2013)).
- **Interior structure:** Whether Neptune is built from sharply separated layers or whether composition
  and density vary continuously cannot be decided from mass, radius, rotation and the known even
  moments $J_2$ and $J_4$; several equally well-fitting density profiles satisfy the same measured
  quantities ([Neuenschwander and Helled 2022](literatur:neuenschwander-2022)).
- **Cause of the cloud variability:** Whether the long-term cloud decline from 2019 to 2023 is mainly
  attributable to the solar cycle or to Neptune's own, very long seasons (southern summer solstice in
  2005) remains open ([Chavez et al. 2023](literatur:chavez-2023)).
- **Stability of the ring arcs:** Why material in the Adams ring stays confined to a few dense arcs
  rather than spreading uniformly remains disputed since the originally proposed corotation resonance
  with Galatea ([Rings](thema:ringe)).

## In the model

- **Shape:** `radiusKm` is set to $24622\,\mathrm{km}$, the NSSDC volumetric mean, not the equatorial
  radius $24766\,\mathrm{km}$ ([Lindal 1992](literatur:lindal-1992)); the sphere thus sits about 0.6 %
  below the true 1-bar surface at the equator (own calculation from the radii in the parameters table;
  flattening $0.0171$). `render/bodies.ts` scales every sphere with a single factor, so the visible
  flattening is missing entirely.
- **Rotation:** `rotationPeriodH` is set to $16.11$, the Voyager radio measurement
  ([Warwick et al. 1989](literatur:warwick-1989)). Against the period determined in 2011 from south
  polar features, $15.9663\,\mathrm{h}$ ([Karkoschka 2011](literatur:karkoschka-2011)), that is about
  8.6 minutes too long per rotation. Since J2000 that amounts (as of September 2026, about 26.7 years)
  to about 14,542 rotations with the data-set value versus about 14,672 with the Karkoschka value — a
  marker fixed on the texture in the model would drift from the faster rotation by about 131 rotations
  (own calculation).
- **Pole:** The IAU report gives Neptune's pole as a series with a periodic correction term that
  depends on a Neptune-specific phase $N = 357.85^\circ + 52.316^\circ\,T$ ($T$ in Julian centuries
  since J2000); evaluated at $T = 0$ this gives $299.3337^\circ / 42.9504^\circ$, and it is exactly
  this value, then held fixed, that the data set carries
  ([Archinal et al. 2018](literatur:archinal-2018)). The raw, constant value without this term
  ($299.36^\circ / 43.46^\circ$) would give an axial tilt against the same orbit normal of about
  27.85° instead of 28.318° — a difference of about 0.47° (own recalculation using the orbital
  elements from `neptune.ts` following the method of `achsneigungDeg`).
- **Axial tilt:** `achsneigungDeg` forms the angle between the pole and the orbit normal built from
  position and velocity at epoch J2000; with a positive rotation period (Neptune rotates prograde), the
  180° flip does not apply. The data-sheet axial tilt is $28.318^\circ$ — identical to the model value
  from [Axial tilt](thema:achsneigung) (own recalculation, see above).
- **Orbit:** The elements come from the JPL approximation table 1800 to 2050, linearly advanced
  against the fixed ecliptic J2000 ([Orbital elements](thema:bahnelemente)); the Kepler orbital period
  from the catalogue mass and semi-major axis is there about 0.06 % above $360^\circ/\dot{L}$, the same
  value derived there, and still about 0.006 % below it if the masses of the planets orbiting further
  in are added to the central mass.
- **Rings:** Neptune appears in the model entirely without rings; the faint, arc-shaped rings are
  missing altogether ([Rings](thema:ringe)).
- **Moon system:** Of the at least 16 known moons of Neptune, the catalogue carries only
  [Triton](objekt:triton); Nereid, Proteus and all other small, irregular moons are missing.
- **Not shown:** no atmosphere, no magnetic field, no clouds or storm systems in the renderer; the
  texture is a single, static image from Solar System Scope (CC BY 4.0, `ASSETS.md`), the Great Dark
  Spot and its successors are not depicted.
- **Exposure:** on 17 September 2026 Neptune receives only $1/883$ of Earth's irradiance, yet appears
  in the image just as bright as any other target; with Earth in the target at the same time, it looks
  261 times too bright in the default "Schaubild" display, 115 times in "Realistic"
  ([Albedo and brightness](thema:photometrie)). In the scene
  [From Neptune to the distant Sun](szene:ferne-sonne) the Sun accordingly appears exaggerated, 1.2°
  instead of the actual 64″ ([Sun](objekt:sun)).
- **Data sheet:** mass, radius, rotation period, pole and albedo of the data set match the cited
  measurements to the stated precision, with the own-calculated deviations in equatorial radius and
  rotational phase noted above; scale: `sizeScale` scales Neptune like every other body. Further
  simplifications: [Model limits](thema:modell).

*As of September 2026*
