# Deimos

Deimos is the outer, smaller of the two Martian moons: an even darker, smoother body of just
6.2 km mean radius, its craters largely buried under regolith. Unlike [Phobos](objekt:phobos), it
orbits outside the synchronous distance and drifts, though barely measurably, away from Mars
rather than towards it. This text presents mass, surface and orbit, refers to Phobos for the
question of origin, and finally describes what Orrery models of it.

## Parameters and measurement

Deimos lacks a flyby as close as Phobos had, so its mass and density are considerably more
uncertain. The current JPL catalogue gives $GM = (0.0962 \pm 0.0028) \cdot 10^{-3}\,
\mathrm{km^3\,s^{-2}}$ and a mean radius of $6.2 \pm 0.24\,\mathrm{km}$ – its relative uncertainty
a good ten times that of Phobos ($11.08 \pm 0.04\,\mathrm{km}$) – giving a density of
$1471 \pm 166\,\mathrm{kg\,m^{-3}}$, with 11.3 % relative uncertainty against 4.1 % for Phobos
([JPL SSD satellite data](quelle:jpl-satelliten)). A photogrammetric model from stereo images of
several missions independently gives $1465 \pm 51\,\mathrm{kg\,m^{-3}}$ and semi-axes of
$8.04 / 5.89 / 5.11\,\mathrm{km}$ ([Ernst et al. 2023](literatur:ernst-2023)) – both values sit
well below the density that the catalogue's older mass of $2.4 \cdot 10^{15}\,\mathrm{kg}$
([NASA Mars moons](quelle:nasa-marsmonde)) and the same semi-axes would give: about
$2368\,\mathrm{kg\,m^{-3}}$. The catalogue mass is thus likely too high by about two thirds (see
"In the model").

## Interior

At a density around 1.47 g/cm³ rather than the roughly 2.37 g/cm³ derived from the outdated
catalogue mass (see "Parameters and measurement"), Deimos too is more likely a loose rubble pile
than a solid body, as already discussed for [Phobos](objekt:phobos)
([Rosenblatt 2011](literatur:rosenblatt-2011); [Interior structure](thema:innerer-aufbau)). Whether
the interior also holds some ice is, for want of a close flyby, more open than for Phobos.

## Surface

Deimos looks markedly smoother than Phobos: a thick regolith mantle, estimated up to 100 m deep,
fills many craters and leaves only the youngest sharp-edged ([NASA Mars moons](quelle:nasa-marsmonde)).
A recent impact simulation explains the regolith blanket, a south-polar depression and bright
streaks together through a single oblique impact by a body about 320 m across; this requires the
uppermost layer to be extremely weak, porous and dissipative, like recently visited rubble-pile
asteroids rather than lunar regolith ([Raducan et al. 2026](literatur:raducan-2026)). Reflectance
spectra show a C-type-like, carbon-rich material, spectrally more uniform than Phobos's red–blue
contrast ([NASA Mars moons](quelle:nasa-marsmonde); [Albedo and brightness](thema:photometrie)).

## Atmosphere and magnetosphere

Like [Phobos](objekt:phobos), Deimos has neither atmosphere nor magnetic field and lies exposed to
the solar wind; no dedicated measurement like Phobos's exists for Deimos.

## Orbit, rotation and dynamics

Deimos orbits [Mars](objekt:mars) in about 30.3 hours at just under 23,460 km, outside the Mars-synchronous
distance of about 20,500 km, where a moon would neither rise nor sink
([Brozović et al. 2025](literatur:brozovic-2025)). The tide it raises on Mars therefore leads its
motion instead of lagging behind, driving it slowly outward in principle; the MAR099 ephemeris is
not sensitive enough to measure such an effect for Deimos
([Brozović et al. 2025](literatur:brozovic-2025)). Its rotation, like that of all regular moons, is
[tidally locked](thema:gebundene-rotation).

## Formation and evolution

The same open question applies as for [Phobos](objekt:phobos): capture from the outer asteroid
belt, or formation from a debris disc after a giant impact on the young Mars
([Rosenblatt 2011](literatur:rosenblatt-2011); [Rosenblatt et al. 2016](literatur:rosenblatt-2016)).
In the disc models, Deimos forms in the thinner, outer part of the disc and so needs less mass
than Phobos to reach its present, nearly circular orbit
([Canup and Salmon 2018](literatur:canup-2018)); in the picture of a shared progenitor breaking
apart, it would be the outer of the two fragments ([Bagheri et al. 2021](literatur:bagheri-2021)).
Context: [Formation of the Solar System](thema:entstehung).

## Open questions

- **Capture or formed in place?** As open as for Phobos; Deimos's smoother, more uniform surface
  gives no clear extra argument for either side ([Rosenblatt 2011](literatur:rosenblatt-2011)).
- **Porous rubble or ice?** The density, itself uncertain, allows either
  ([Ernst et al. 2023](literatur:ernst-2023)).
- **Where does the smooth regolith come from?** A single impact at an unspecified time explains
  both the blanket and the depression at once
  ([Raducan et al. 2026](literatur:raducan-2026)); this does not rule out slow, billion-year
  micrometeorite gardening instead.

## In the model

- **Orbit:** a Kepler ellipse in the `parentEquator` frame with a fixed semi-major axis
  (23,457 km), $e = 0$ and $I = 1.8^\circ$. Because the orbit is circular, the longitude of periapsis in the
  data set is meaningless; it simply tracks the node, which cycles in 56.2 years, as the orbital
  element table itself states. The measured $e$ is actually only about 0.0002 to 0.0003 rather
  than exactly zero; which value a given source uses should be checked at that source
  ([Tides](thema:gezeiten)).
- **Rotation:** `rotationPeriodH` (30.29858 h) deviates from the sidereal period computed from
  $\dot{L}$ by $0.66 \cdot 10^{-6}$ – tiny, but the largest such rounding remainder of the
  catalogue's 21 moons ([Tidal locking](thema:gebundene-rotation)).
- **Spherical shape:** 6.2 km radius instead of the semi-axes 7.8 / 6.0 / 5.1 km (+25.8 %,
  −3.2 %, −17.7 %); the regolith blanket and depression are absent from the smooth mesh.
- **Albedo and texture:** Deimos remains untextured, as no official global map could be found; the
  only circulating map is an unofficial fan reconstruction with no traceable source chain
  (`ASSETS.md`). The fallback colour `#7a7067`, like any texture, passes through the albedo
  factor: its raw mean is 0.164 linear, well above the catalogued albedo of 0.08, so it is darkened
  by about 0.49 ([Albedo and brightness](thema:photometrie)).
- **Data panel:** the catalogue mass of $2.4 \cdot 10^{15}\,\mathrm{kg}$ sits 67 % above the mass
  of $1.44 \cdot 10^{15}\,\mathrm{kg}$ derived from the current JPL $GM$; unlike for Phobos, the
  older value here is not merely rounded but clearly undercut by newer determinations
  ([JPL SSD satellite data](quelle:jpl-satelliten); [Ernst et al. 2023](literatur:ernst-2023)).
  Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
