# Titan

At 2575 km radius, Titan is the largest moon of [Saturn](objekt:saturn) and, after
[Ganymede](objekt:ganymede), the second-largest moon in the Solar System: larger in diameter than
[Mercury](objekt:mercury) (4879 km against 5150 km), but with only about 41 % of its mass. It is
the only moon with a dense, opaque atmosphere and the only body besides [Earth](objekt:earth) on
which stable liquid is confirmed on a solid surface today – though of methane and ethane rather
than water, at around 94 K. An ocean is suspected beneath the ice crust, but has been seriously
questioned since 2025. This text presents the gravity field and interior, surface, atmosphere and
magnetosphere, and orbit, rotation and formation, and finally describes what Orrery models of it.

## Parameters and measurement

Ten close flybys of the Cassini spacecraft provided Titan's gravity field through radio Doppler
tracking. An initial analysis found a $J_2/C_{22}$ ratio of $3.2 \pm 0.6$, consistent with the
hydrostatic relation $10/3$ but with an error bar large enough that a non-hydrostatic interior
could not be excluded ([Durante et al. 2019](literatur:durante-2019)). A reanalysis of the same
ten flybys with improved processing narrowed this to $J_2/C_{22} = 3.316 \pm 0.051$ – a field in
hydrostatic equilibrium – and from it derived the moment-of-inertia factor
$C/(MR^2) = 0.343 \pm 0.001$, as well as, for the first time, the imaginary part of the Love number
$k_2$, i.e. the phase lag of the tidal response
([Petricca et al. 2025](literatur:petricca-2025); values as under
[Tides](thema:gezeiten)).

| Quantity | Value | Uncertainty | Method | Source |
|---|---|---|---|---|
| Radius (mean) | $2574.73\,\mathrm{km}$ | $0.09\,\mathrm{km}$ | Cassini RADAR altimetry, shape fit | [Zebker et al. 2009](literatur:zebker-2009) |
| $\bar\rho$ | $1881\,\mathrm{kg\,m^{-3}}$ | – | derived from catalog mass and radius | Derivation |
| $C/(MR^2)$ | $0.343$ | $0.001$ | $J_2$, $C_{22}$ from ten Cassini flybys, Radau–Darwin | [Petricca et al. 2025](literatur:petricca-2025) |
| Real part $k_2$ | $0.608$ | $0.048$ (1σ) | Cassini Doppler | [Petricca et al. 2025](literatur:petricca-2025) |
| Imaginary part $k_2$; $Q$ | $0.135$; $4.5$ | $0.035$; $1.1$ | Cassini Doppler, phase lag | [Petricca et al. 2025](literatur:petricca-2025) |
| Geometric albedo | $0.22$ | – | photometric | [Saturnian satellites fact sheet](quelle:nssdc-saturnmonde) |

With $C/(MR^2) = 0.343$, Titan is closer to a homogeneous sphere ($0.4$) than
[Ganymede](objekt:ganymede) ($0.3159 \pm 0.0052$): its interior is less strongly separated into a
dense core and a light shell – see the ranking of all measured moment-of-inertia factors under
[Interior structure](thema:innerer-aufbau). The density of 1881 kg/m³ derived from mass and radius
is close to the often-quoted rounded value of 1880 kg/m³ from the fact sheet.

## Interior

The low but not extreme moment-of-inertia factor points to a sphere of concentric shells: a dense
silicate core, above it high-pressure ice that stays solid despite being warmer than the melting
point at surface pressure because of the pressure itself, and at the top a crust of ordinary water
ice, likely present as a methane clathrate: cages of water-ice molecules trap methane and make the
crust denser and mechanically different from pure ice – a building block for the question of
methane resupply as well (see below and Open questions). Whether a layer of liquid, salty water
lies between the high-pressure ice and the crust is the central dispute of this section.

The first Cassini Doppler measurements found a large real part of $k_2$ ($0.589 \pm 0.150$ and
$0.637 \pm 0.224$, both 2σ, from separate subsets of the flybys), a deformation expected of a thin
ice shell elastically decoupled from a liquid ocean below
([Iess et al. 2012](literatur:iess-2012)). A later analysis with different processing instead found
a substantially smaller $k_2$ and still interpreted it as an ocean, though a thinner or
less dense one than previously assumed ([Goossens et al. 2024](literatur:goossens-2024)). Petricca
et al.'s new analysis with improved processing recovers the large real part again, close to the
original value of Iess et al., and for the first time measures the imaginary part:
$0.135 \pm 0.035$, corresponding to a very low quality factor $Q = 4.5 \pm 1.1$ – such strong
dissipation, nearly in phase with the tidal period, is, in the authors' view, better explained by a
warm high-pressure ice layer close to its melting point without a global ocean than by a weakly
dissipative liquid layer beneath ([Petricca et al. 2025](literatur:petricca-2025)). A comment
published in 2026 argues that the conspicuously low $k_2$ value of Goossens et al. 2024 may stem
from differences in the processing chain rather than a real property of Titan
([Durante et al. 2026](literatur:durante-2026)); Goossens et al. explicitly disputed this in their
own reply and stand by both their processing and their interpretation
([Goossens et al. 2026](literatur:goossens-2026)). The dispute thus remains open (see below).

Heat is supplied mainly by radioactive decay in the silicate core and, to a lesser extent than for
the more closely orbiting moons [Io](objekt:io) or [Enceladus](objekt:enceladus), by tidal friction
itself; how much of it is radiated away is only modeled, not measured, for lack of a direct
heat-flow measurement.

## Surface

On 14 January 2005, the European probe Huygens made what remains the most distant successful
landing to date, on Titan. Three of its instruments still shape today's picture of the surface:
the GCMS mass spectrometer measured the composition of the lower atmosphere and traces of methane
at the ground ([Niemann et al. 2005](literatur:niemann-2005)); the HASI instrument recorded the
temperature and pressure profile of the entire descent, finding $93.65 \pm 0.25\,\mathrm{K}$ and
$1467 \pm 1\,\mathrm{hPa}$ at the surface as well as signs of a conductive layer around 60 km
altitude that could point to electrical activity
([Fulchignoni et al. 2005](literatur:fulchignoni-2005)); the DISR camera returned images of a
channel-cut bright highland draining into a dark lowland strewn with rounded, pebble-sized ice
chunks – traces of past, if not necessarily local or contemporaneous, liquid flow
([Tomasko et al. 2005](literatur:tomasko-2005); overview of the descent and landing by
[Lebreton et al. 2005](literatur:lebreton-2005)).

From 2006 onward, Cassini RADAR found extensive dune fields of organic sand material near the
equator, similar in shape and orientation to terrestrial longitudinal dunes but considerably
larger ([Lorenz et al. 2006](literatur:lorenz-2006)). Around the north pole lie large areas dark to
radar, interpreted as lakes and seas of liquid methane and ethane – Kraken Mare, Ligeia Mare and
Punga Mare are the largest ([Stofan et al. 2007](literatur:stofan-2007)); a later review of their
depths, composition and shorelines summarizes the entire Cassini mission's findings
([Hayes 2016](literatur:hayes-2016)). That Titan's methane cycle is active was shown directly in
2010: following a large equatorial cloud system, more than 500,000 km² of surface darkened, most
plausibly explained by liquid methane rain that fell and later evaporated again
([Turtle et al. 2011](literatur:turtle-2011)).

Titan's surface carries strikingly few impact craters: a count of all craters identified in
Cassini RADAR coverage through 2010 gives a crater density comparable to Venus, well below that of
the [Moon](objekt:moon) or [Ganymede](objekt:ganymede), and – despite highly uncertain production
rates – a surface age of roughly 200 million to 1 billion years
([Neish and Lorenz 2012](literatur:neish-2012)). Whether individual landforms interpreted as
volcanic, foremost the Sotra Facula complex with its deepest known pit (Sotra Patera) and
flow-like structures, actually show cryovolcanism or formed purely exogenically (by impact,
erosion and deposition) is disputed (see Open questions).

## Atmosphere and magnetosphere

At the ground, Titan's atmosphere is more than 95 % molecular nitrogen, with a few percent methane
and traces of hydrogen and heavier hydrocarbons, at a surface pressure of about 1.5 bar denser than
Earth's atmosphere ([Niemann et al. 2005](literatur:niemann-2005)). Sunlight and energetic
particles from Saturn's magnetosphere break up methane and nitrogen in the upper atmosphere; the
fragments build up into ever larger organic molecules that eventually condense into solid,
orange-brown aerosols – tholins – and settle as haze. This haze forms a thick main layer and a
thinner, higher detached layer, whose origin and evolution a recent review of Titan's chemistry
sets in context ([Nixon 2024](literatur:nixon-2024)). This same haze makes Titan's surface
impenetrable to cameras in visible light (see In the model) and gives Titan its name-giving orange
globe – just as the scene [Titan in Haze before Saturn](szene:titan-dunst) shows it.

The methane cycle structurally resembles Earth's water cycle – evaporation, cloud formation,
precipitation, runoff into lakes – but runs over Titan's seasonal cycle of 29.5 Earth years and at
entirely different temperatures and substances; a comprehensive review of circulation, clouds and
climate summarizes observations across the whole Cassini mission
([Hörst 2017](literatur:hoerst-2017)). A striking feature of the circulation is superrotation of
the atmosphere – it spins considerably faster at mid-altitudes than the solid body beneath it –, as
also seen in the atmosphere of [Venus](objekt:venus); a review article compares the mechanisms and
open questions of both cases ([Read and Lebonnois 2018](literatur:read-2018)).

The ratio of nitrogen-14 to nitrogen-15 in Titan's atmosphere is markedly enriched relative to the
protosolar value; since the Solar System is too young for this to be explained solely by ongoing,
preferential loss of nitrogen-14 to space, the nitrogen must have arrived already carrying an
elevated isotope ratio – a clue to its origin (see Formation and evolution)
([Mandt et al. 2014](literatur:mandt-2014)).

Titan has no dynamo-generated magnetic field of its own. It usually sits inside
[Saturn's](objekt:saturn) magnetosphere; Cassini's first close flyby measured how Saturn's carried
field penetrates the ionosphere and forms an induced, magnetotail-like field on the side facing
away from Saturn, with no sign of a permanent field of Titan's own
([Backes et al. 2005](literatur:backes-2005)). Near the apoapsis of its orbit, Titan occasionally
leaves the magnetosphere for the unshielded solar wind.

## Orbit, rotation and dynamics

Titan orbits Saturn at a mean distance of 1,221,935 km, with an orbital inclination of
$0.33^\circ$ to Saturn's equator and an eccentricity of $0.0292$
([Saturnian satellites fact sheet](quelle:nssdc-saturnmonde)); figures for the osculating element
set held in the model at epoch J2000 are given below. It is tidally locked to Saturn, but does not
follow simple synchronous rotation: instead it occupies the Cassini state, in which its rotation
axis, its orbit pole and the pole of Saturn's precession all lie in one plane, with a measured
obliquity of $0.32 \pm 0.02^\circ$ and a deviation of $0.12 \pm 0.02^\circ$ from that plane
([Baland et al. 2011](literatur:baland-2011); see the ranking of all moons under
[Tidal locking](thema:gebundene-rotation)).

Titan is migrating away from Saturn – faster than classical tidal theory at constant $k_2/Q$ would
predict for a moon orbiting this far out: two independent Cassini analyses agree on
$11.3 \pm 2.0\,\mathrm{cm}$ of outward migration per year
([Lainey et al. 2020](literatur:lainey-2020); [Magnanini et al. 2026](literatur:magnanini-2026)).
Resonance locking – in which Saturn's internal oscillation modes track Titan's slowly drifting
forcing frequency instead of being overtaken by it, keeping Saturn's effective tidal quality low
and the migration fast – explains this without difficulty
([Fuller et al. 2016](literatur:fuller-2016)); the derivation, the resulting $Q \approx 75$ for
Saturn (from Titan's frequency), and its comparison with Jacobson's independent, substantially
higher estimate are given under [Tides and the Roche limit](thema:gezeiten). This Saturn quality
factor $Q$ must not be confused with Titan's own $Q = 4.5$ mentioned above: the former describes
how strongly Saturn itself responds to the tide raised by Titan, and hence Titan's orbital
evolution; the latter describes Titan's own response to the tide raised by Saturn, and hence its
interior.

Titan also stands in a 3:4 orbital resonance with the much smaller, chaotically rotating Hyperion:
the resonance angle $4\lambda_\mathrm{Hy} - 3\lambda_\mathrm{Ti} - \varpi_\mathrm{Hy}$ librates
around $180^\circ$ with an amplitude of $36.5^\circ$ and a period of about 640 days; it is this
resonance that protects Hyperion, despite its eccentricity of $e = 0.104$, from close encounters
with Titan ([Duriez 1992](literatur:duriez-1992); derivation and comparison with all orbital
resonances in the Solar System under [Orbital resonances](thema:resonanzen)). Titan's own, small
eccentricity of about 0.029 is, however, not the result of this or any other known resonance –
unlike [Ganymede](objekt:ganymede), [Europa](objekt:europa) and [Enceladus](objekt:enceladus),
whose forced eccentricities follow directly from their respective resonances – but persists
without any recognizable ongoing driver, which makes its own damping history an open question in
itself (see below).

## Formation and evolution

Like the moons of the other giant planets, Titan probably formed out of a circum-Saturnian disk of
gas and solids replenished during the last stage of Saturn's own growth; a balance between inflow
and loss through gas-driven orbital decay keeps the mass fraction of such satellite systems at
around $10^{-4}$ of the planet's own mass regardless of planet size – at Saturn nearly entirely
concentrated in Titan, unlike at Jupiter, where the mass is spread across four comparably sized
moons ([Canup and Ward 2006](literatur:canup-2006)). The broader context of planet formation is
given under [Formation of the Solar System](thema:entstehung).

Based on the isotope evidence above, the nitrogen of today's atmosphere was probably not
molecular nitrogen from the start, but arrived as protosolar ammonia ice in Titan's building
material – similar to the material that also shapes cometary nuclei – and was converted to N₂ only
later, for instance by impact energy or photolysis ([Mandt et al. 2014](literatur:mandt-2014)). The
atmospheric methane, by contrast, is destroyed photochemically under sunlight and would vanish
within a few tens of millions of years without resupply – a short span compared with the age of
the Solar System. A numerical model coupling the interior's methane-clathrate crust to an
underlying ammonia-rich water ocean finds episodic outgassing to be a plausible source: an internal
heat anomaly locally destabilizing the clathrate crust would release its trapped methane into the
atmosphere in bursts ([Tobie et al. 2006](literatur:tobie-2006)) – a mechanism also compatible with
some landforms interpreted as cryovolcanic (see Surface and Open questions).

Starting in July 2028, the nuclear-powered rotorcraft Dragonfly is planned to launch for Titan and,
after a cruise of about six and a half years, land in 2034 in the Shangri-La dune field near the
crater Selk. Cassini data point to water-rich material in and around the crater; already in a
preparatory study, Selk was among the most promising targets for detecting organic and possible
biological molecules in situ in impact-melt deposits fresh enough to preserve them
([Barnes et al. 2021](literatur:barnes-2021); [Neish et al. 2018](literatur:neish-2018)). Over
about two and a half years, Dragonfly is planned to cover roughly 175 km from there in individual
flights of up to eight kilometers.

## Open questions

- **Ocean or no ocean?** A large real part of $k_2$ initially suggested a thin ice shell decoupled
  from an ocean ([Iess et al. 2012](literatur:iess-2012)); different processing later found a
  smaller $k_2$, still interpreted as an (thinner, less dense) ocean
  ([Goossens et al. 2024](literatur:goossens-2024)). A new analysis again recovers the large real
  part and for the first time measures a large imaginary part, pointing to a warm, dissipative
  high-pressure ice layer rather than a global ocean
  ([Petricca et al. 2025](literatur:petricca-2025)); whether Goossens' differing value stems from
  data processing is itself disputed between the groups
  ([Durante et al. 2026](literatur:durante-2026); [Goossens et al. 2026](literatur:goossens-2026)).
- **Where does the atmospheric methane come from, and for how long?** Without resupply it vanishes
  photochemically within a few tens of millions of years. Episodic outgassing from a
  clathrate-bound reservoir is a plausible but unproven mechanism
  ([Tobie et al. 2006](literatur:tobie-2006)); whether and where this still happens today is open.
- **Does Titan show genuine cryovolcanism?** The Sotra Facula complex, with its cone-, pit- and
  flow-like forms, is interpreted as an active or recently active cryovolcanic area
  ([Lopes et al. 2013](literatur:lopes-2013)); a systematic review of many previously proposed
  volcanic landforms instead finds more convincing exogenic explanations (impact, erosion,
  deposition) for most of them and considers cryovolcanism on Titan overall unproven
  ([Moore and Pappalardo 2011](literatur:moore-2011)).
- **Why does Titan migrate so fast, and why has its eccentricity not long since damped away?**
  Resonance locking explains the fast migration without difficulty
  ([Fuller et al. 2016](literatur:fuller-2016)), yet an independent, far longer time series from
  astrometry and radio data gives a substantially higher value for Saturn's quality factor,
  consistent with slower migration ([Jacobson 2022](literatur:jacobson-2022); see
  [Tides](thema:gezeiten)). Separately, it remains open what keeps Titan's small eccentricity of
  about 0.029, forced by no known resonance, from vanishing under its own fairly strong tidal
  damping at $Q = 4.5$.

## In the model

- **Orbital reference:** Like the other Saturnian moons, Titan runs in the `parentEquator`
  reference on Saturn's equatorial plane, with osculating Horizons elements at epoch J2000
  ($a = 1221934.907\,\mathrm{km}$, $e = 0.02860$, $i = 0.360^\circ$); `eDot` and `iDot` are fixed
  at 0. NASA's fact sheet gives the somewhat different, multi-decade averaged values of
  $0.33^\circ$ and $0.0292$ for inclination and eccentricity – the difference is of the order at
  which the real orbit is continually perturbed by the other moons and the Sun, while the model
  holds the single snapshot at J2000 constant forever after.
- **Node and apsidal period:** From `nodeDot` ($-52.3735^\circ$ per century) follows a retrograde
  nodal period of $360/52.3735 \times 100 = 687.4$ years; from `lpDot` ($51.4686^\circ$ per
  century) a prograde apsidal precession period of $360/51.4686 \times 100 = 699.5$ years – both
  figures as under [Orbital elements](thema:bahnelemente).
- **Orbital period of the dataset:** From $\dot L$ ($824624.0557^\circ$ per century) follows
  $36525/(\dot L/360) = 15.9454$ days – nearly identical to the fact sheet's $15.945421$ days
  (a difference under three seconds) and to the period Titan actually completes in the model. The
  data panel instead shows the Kepler orbital period computed from the semi-major axis and masses
  (`umlaufzeitTage`), $15.9473$ days, about 120 ppm longer.
- **Rotation ratio:** `rotationPeriodH` ($382.69075\,\mathrm{h}$) matches the sidereal period
  computed from $\dot L$ to $-0.005 \cdot 10^{-6}$ relative; the angle between map center and the
  direction to Saturn is $37.7^\circ$ at epoch and $40.0^\circ$ after a hundred years (figures as
  under [Tidal locking](thema:gebundene-rotation)).
- **Axial tilt:** Recomputing with `achsneigungDeg` gives $0.337^\circ$, within a good one-sigma of
  the measured obliquity of $0.32 \pm 0.02^\circ$ ([Baland et al. 2011](literatur:baland-2011));
  the deviation from the common plane of the Cassini state (measured at $0.12^\circ$), which the
  model does not represent, does not matter here, because `achsneigungDeg` only measures the angle
  between pole and orbit normal, not the position within the Cassini plane itself.
- **Pole:** $39.4827^\circ / 83.4279^\circ$ from the IAU rotation elements
  ([Archinal et al. 2018](literatur:archinal-2018)), fixed at epoch.
- **Albedo and texture:** The albedo of 0.22 is the fact sheet's geometric albedo, matched exactly,
  and is normalized to the catalog albedo as for every body
  ([Albedo and brightness](thema:photometrie)). The texture is a surface map composited from
  Cassini RADAR and infrared imagery (`ASSETS.md`) – a view that, because of the haze described in
  this text, is never actually seen in visible light. Orrery's renderer, moreover, has no
  atmosphere or haze layer at all: `render/` contains no such module, so Titan appears as a
  sharply bounded, directly lit sphere carrying this surface map, without scattered light, limb
  haze glow, or reddening of transmitted light. What is missing is exactly the property that makes
  Titan unique among moons.
- **Shadows:** Titan is one of the four occluders `waehleOkkluder` selects for Saturn (alongside
  Tethys, Dione and Rhea; figures as under [Eclipses](thema:finsternis)); its shadow on Saturn and
  Saturn's own shadow and the rings' shadow on it follow the same geometry. The threshold angle set
  by Titan's orbital radius, $\arcsin(R_\mathrm{Saturn}/a_\mathrm{Titan})$, works out to
  $2.73^\circ$, well below Saturn's axial tilt of $26.73^\circ$: like the other three occluders,
  Titan casts a shadow at practically every season.
- **Scale:** Titan is a satellite (`isSatellite`, its `parent` is Saturn, not the Sun); its orbital
  radius around Saturn therefore scales, like its own and Saturn's radius, with `sizeScale`, not
  with the distance compression applied to planetary orbits (`scaledPositionAt`).
- **Data panel:** The mass carried in the dataset ($1.3455 \cdot 10^{23}\,\mathrm{kg}$) times $G$
  per CODATA 2018 gives a $GM$ of $8980.27\,\mathrm{km^3\,s^{-2}}$, about 238 ppm above the
  dynamically determined reference ([Jacobson 2022](literatur:jacobson-2022); figure as under
  [Interior structure](thema:innerer-aufbau)). Further simplifications:
  [Limits of the model](thema:modell).

*As of September 2026*
