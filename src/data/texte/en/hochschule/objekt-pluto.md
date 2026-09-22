# Pluto

Pluto is the first dwarf planet discovered and the best-studied body of the Kuiper belt. Clyde
Tombaugh found it in 1930 at Lowell Observatory during a targeted search for a postulated
"Planet X"; the International Astronomical Union formally classified it as a dwarf planet in 2006
([IAU 2006](literatur:iau-2006)), after its orbit and its mass, small compared to the eight
planets, marked it as the prototype of a separate class of bodies beyond Neptune. On 14 July 2015
the New Horizons spacecraft flew past Pluto at a distance of only 12,500 km and its first results,
published within a few months, gave the only close-up view of the system to date
([Stern et al. 2015](literatur:stern-2015)); since then, new findings have come from stellar occultations,
ground- and space-based spectroscopy, and models that extrapolate the flyby data. This text
presents parameters, interior, surface, atmosphere, orbit and formation, and describes last what
Orrery renders of it, in particular the simplification that lets the model have Charon orbit
Pluto itself rather than the true system barycenter (see In the model). Charon's own parameters
are under [Charon](objekt:charon); the comparison with the related Kuiper belt body
[Triton](objekt:triton) is under Formation and evolution.

## Parameters and measurement

New Horizons images from the LORRI camera yielded a mean radius of
$1188.3 \pm 1.6\,\mathrm{km}$ from a limb fit across several approach images
([Nimmo et al. 2017](literatur:nimmo-2017)). The masses of Pluto and Charon follow from the orbit
solution of all five moons known at the time: $GM_\mathrm{Pluto} = 869.3 \pm 0.4\,\mathrm{km^3\,s^{-2}}$
and $GM_\mathrm{Charon} = 106.1 \pm 0.3\,\mathrm{km^3\,s^{-2}}$
([Brozović et al. 2015](literatur:brozovic-2015)). With these values and the radius,
$\bar\rho = 3\,GM/(4\pi G R^3)$ gives a mean density for Pluto of about $1.85\,\mathrm{g\,cm^{-3}}$
(derivation); Charon, with a radius of $606\,\mathrm{km}$
([Nimmo et al. 2017](literatur:nimmo-2017)) and the same calculation, is markedly less dense at
about $1.70\,\mathrm{g\,cm^{-3}}$ — a first hint at a smaller rock fraction.

Geometric albedo varies across Pluto's surface by more than a factor of ten: the brightest areas
(the nitrogen-ice field Tombaugh Regio) reach a normal reflectance near one, while a notably
darker polar region reaches only about 0.20; averaged over the whole visible sphere, the
geometric albedo at the LORRI reference band is 0.62 for Pluto and 0.41 for Charon, whose surface
mostly lies between 0.4 and 0.6, with a few brighter crater ejecta
([Buratti et al. 2017](literatur:buratti-2017)). The catalog values 0.52 (Pluto) and 0.42
(Charon) are rounded NSSDC whole-disk means and accordingly differ from these photometrically
determined values (see In the model).

The radio occultation performed by New Horizons' REX instrument measured a temperature profile
reaching the ground for the first time: $38.9 \pm 2.1\,\mathrm{K}$ air temperature immediately
above the surface at the entry point, $51.6 \pm 3.8\,\mathrm{K}$ at the exit point, and a surface
pressure of $11.5 \pm 0.7\,\mathrm{\mu bar}$ at a reference radius of
$1189.9 \pm 0.2\,\mathrm{km}$ ([Gladstone et al. 2016](literatur:gladstone-2016)). That pressure
is part of a longer time series: ground-based stellar occultations between 1988 and 2016 show
pressure rising from about $2.3\,\mathrm{\mu bar}$ (1988) to roughly three times that by the
mid-2010s — close to the directly measured $11.5\,\mathrm{\mu bar}$ of 2015
([Meza et al. 2019](literatur:meza-2019)); what happened afterward is discussed under Atmosphere
and magnetosphere.

| Quantity | Value | Uncertainty | Method | Source |
|---|---|---|---|---|
| Radius | $1188.3\,\mathrm{km}$ | $1.6\,\mathrm{km}$ | New Horizons LORRI, limb fit | [Nimmo et al. 2017](literatur:nimmo-2017) |
| $GM_\mathrm{Pluto}$ | $869.3\,\mathrm{km^3\,s^{-2}}$ | $0.4\,\mathrm{km^3\,s^{-2}}$ | Orbit solution of the moons | [Brozović et al. 2015](literatur:brozovic-2015) |
| $\bar\rho$ | $1.85\,\mathrm{g\,cm^{-3}}$ | – | Derivation from $GM$ and radius | Derivation |
| Geometric albedo | $0.62$ | – | LORRI whole-disk mean | [Buratti et al. 2017](literatur:buratti-2017) |
| Surface temperature | $38.9$–$51.6\,\mathrm{K}$ | $\pm 2$–$4\,\mathrm{K}$ | REX radio occultation | [Gladstone et al. 2016](literatur:gladstone-2016) |
| Surface pressure (2015) | $11.5\,\mathrm{\mu bar}$ | $0.7\,\mathrm{\mu bar}$ | REX radio occultation | [Gladstone et al. 2016](literatur:gladstone-2016) |

## Interior

The density of $1.85\,\mathrm{g\,cm^{-3}}$ derived from mass and radius lies well above that of
pure water ice ($\approx 1\,\mathrm{g\,cm^{-3}}$) and requires a substantial rock fraction. With
end-member densities $\rho_\mathrm{R} \approx 3.3\,\mathrm{g\,cm^{-3}}$ for rock and
$\rho_\mathrm{I} \approx 1.0\,\mathrm{g\,cm^{-3}}$ for ice,
$1/\bar\rho = X/\rho_\mathrm{R} + (1-X)/\rho_\mathrm{I}$ gives a rock mass fraction of about
66 % against 34 % ice (derivation) — consistent with a differentiated body whose rock settled
early into a dense core, surrounded by an ice shell.

Whether liquid water still lies beneath that ice shell today is the central point of contention.
One argument is geometric: Sputnik Planitia, the large, nitrogen-filled basin on the
Charon-facing side, lies close to the point nearest or farthest from Charon — a position that
requires true polar wander, driven by a positive mass anomaly beneath the basin. That anomaly is
most simply explained by a local thickening of a global water ocean beneath the collapsed basin,
which puts a denser residual layer where the ice removed by the original impact used to be
([Nimmo et al. 2016](literatur:nimmo-2016)); independently, the extensional fault geometry
surrounding the basin is consistent with this freezing and expansion of the ocean
([Keane et al. 2016](literatur:keane-2016)). Thermal-evolution calculations suggest the basin
formed very early in Pluto's history and collected its volatile ice fast enough to trigger the
reorientation while still geologically young
([Hamilton et al. 2016](literatur:hamilton-2016)). For such an ocean not to have frozen solid
over 4.5 billion years requires insulation: a layer of methane clathrate, which conducts heat
less efficiently than pure ice, can act as a thermal blanket and keep the ocean liquid to the
present if only a few kilometers thick ([Kamata et al. 2019](literatur:kamata-2019)).

A more recent counter-position explains the same mass anomaly without a global ocean at all: in
impact simulations that account for the material strength of cold icy bodies, the dense, partly
differentiated core of the impactor that formed Sputnik Planitia sinks to Pluto's core-mantle
boundary and forms a lasting "mascon" of denser material there — a mechanism that explains the
observed polar wander equally well but makes a thick global ocean unnecessary, or allows at most
a very thin one ([Ballantyne et al. 2024](literatur:ballantyne-2024)). Both interpretations are
consistent with the New Horizons data; which one is correct is open (see Open questions). Heat
comes from radioactive decay in the rocky core and, to a lesser degree, from the energy released
by the reorientation itself; there is no direct measurement of heat flow. How early enough heat
came together for at least a temporary ocean also depends on the mode of formation: a "hot
start", in which accretion energy released during growth heats Pluto quickly and differentiates
it early, allows an ocean shortly after formation, while a slowly and coldly accreted body would
only develop its ocean over millions of years of radiogenic heating
([Bierson, Nimmo and Stern 2020](literatur:bierson-2020)).

## Surface

New Horizons revealed a surprisingly diverse, geologically young world. Sputnik Planitia, the
heart-shaped feature that gives Pluto its nickname, is a roughly 800,000 km² basin filled with
nitrogen ice and showing not a single recognizable impact crater; its surface is divided into
polygonal cells tens of kilometers across, whose margins trace convection cells within an ice
layer several kilometers thick. Such cells can renew their surface within 500,000 to a million
years, so the absence of craters implies a surface age of under 10 million years, while the basin
itself, which first collected this ice, is probably billions of years old
([McKinnon et al. 2016](literatur:mckinnon-2016); [Moore et al. 2016](literatur:moore-2016)).

Surrounding Sputnik Planitia are water-ice mountains several kilometers high that float, raft-like,
in the comparatively soft nitrogen ice, alongside extensive, dark, heavily cratered and therefore
old terrain such as Cthulhu Macula, whose reddish-brown color comes from tholins — complex organic
compounds formed by photochemically processed methane (see Atmosphere). In the southwest of the
hemisphere imaged by New Horizons lies a group of unusually large, cone-shaped rises with
collapsed summits, foremost among them Wright Mons (about 4 to 5 km high, roughly 150 km across,
estimated volume about $2.4 \times 10^4\,\mathrm{km^3}$) and the still larger Piccard Mons (about
7 km high, roughly 225 km wide); their hummocky flank morphology and the absence of comparable
landforms elsewhere in the imaged Solar System argue for a so-far unique, large-scale cryovolcanic
resurfacing rather than ordinary tectonic or impact processes
([Singer et al. 2022](literatur:singer-2022)); whether they are truly cryovolcanic or purely
tectonically uplifted blocks remains contested (see Open questions). North of this region lie
seasonally migrating methane snow caps. A systematic count of craters larger than 13 km on the
older terrains found markedly fewer small craters than expected from Kuiper belt collisional
evolution models — independent evidence that small Kuiper belt objects are rarer than equilibrium
models predict ([Singer et al. 2019](literatur:singer-2019)).

## Atmosphere and magnetosphere

Pluto's thin atmosphere consists mostly of molecular nitrogen with small amounts of methane and
carbon monoxide; high up, sunlight and cosmic rays break methane into fragments that condense
into tholins and form several nested haze layers, photographed as high as 200 km — markedly more
layers, and markedly higher, than pre-flyby models predicted
([Gladstone et al. 2016](literatur:gladstone-2016)). The same observations showed that nitrogen
escapes into space more slowly than pre-flyby hydrodynamic escape models predicted: the
atmosphere behaves more like Earth's thin, ballistically escaping exosphere than a
hydrodynamically outflowing wind ([Gladstone et al. 2016](literatur:gladstone-2016)). The absence
of an expected strong heating is consistent with cooling by hydrogen cyanide and other
hydrocarbons in the upper atmosphere.

Surface pressure follows Pluto's seasons: because the orbit is strongly eccentric, with
$e \approx 0.25$ (see Orbit, rotation and dynamics), insolation varies substantially over an
orbit, and pressure responds to the balance between sublimating and freezing nitrogen ice in
Tombaugh Regio. After the rise described in Parameters and measurement, which lasted until about
2015, later stellar occultations show a decline followed by a plateau; whether and when the
atmosphere, on its way to aphelion in 2114, will cool enough to freeze out almost entirely onto
the surface (a "collapse", which is in principle possible for such a thin, sublimation-driven
nitrogen envelope) remains open (see Open questions). Pluto has no magnetic field of its own
generated by an internal dynamo; New Horizons instruments instead measured an interaction with
the solar wind that was smaller and more strongly asymmetric than models for a comet-like,
outflowing ion tail predicted — more a compact, planet-like interaction than an extended cometary
tail ([McComas et al. 2016](literatur:mccomas-2016)).

## Orbit, rotation and dynamics

Pluto's orbit has an eccentricity of $e \approx 0.25$ and an inclination of $i \approx 17^\circ$
against the ecliptic (values as in [Orbital elements](thema:bahnelemente)); at perihelion, last
passed on 5 September 1989, Pluto comes about 30 AU closer to the Sun than Neptune. A collision is
nonetheless excluded: Pluto is locked in a 3:2 mean-motion resonance with Neptune, whose resonant
angle librates about 180° with an amplitude of roughly 76° and a period of about 19,670 years,
while at the same time Pluto's argument of perihelion librates about 90° with roughly 24°
amplitude, further widening the minimum distance to Neptune; together, both effects keep
conjunctions permanently away from perihelion (values and derivation under
[Orbital resonances](thema:resonanzen)). This resonance is not a quirk of the initial conditions
but the result of Neptune's migration in the early Solar System, which captured Pluto from an
originally less eccentric orbit (see Formation and evolution).

Pluto's rotation axis is tilted by about 120° against its own orbit normal — more than 90°, so
Pluto rotates retrograde — and this obliquity varies chaotically over millions of years, driven by
proximity to spin-orbit resonances ([Dobrovolskis and Harris 1983](literatur:dobrovolskis-1983);
values as in [Axial tilt](thema:achsneigung)). This high, shifting obliquity produces extreme
seasons: for long stretches of the 248-year orbit, one pole lies almost continuously in darkness
while the other is almost continuously lit — a rhythm that feeds directly, via nitrogen
sublimation, into the pressure history described above.

Pluto and Charon are the Solar System's best-known doubly synchronous pair: both show each other
the same face permanently, because their rotation periods equal Charon's orbital period of
$153.29333\,\mathrm{h}$, an end state that tidal calculations reproduce starting from Charon on an
eccentric, close orbit and with full conservation of angular momentum
([Cheng et al. 2014](literatur:cheng-2014); placed among all other doubly and singly synchronous
pairs under [Tidal locking](thema:gebundene-rotation)). From Charon's orbital radius of
$19\,596\,\mathrm{km}$ and the mass ratio
$M_\mathrm{Charon}/(M_\mathrm{Pluto}+M_\mathrm{Charon}) \approx 0.1085$ (from the $GM$ values
above), the barycenter's distance from Pluto's center follows as
$d_\mathrm{S} = a_\mathrm{Charon}\cdot M_\mathrm{Charon}/(M_\mathrm{Pluto}+M_\mathrm{Charon})
\approx 2126\,\mathrm{km}$ (derivation) — more than Pluto's own radius of $1188.3\,\mathrm{km}$, or
about 1.8 times it. The shared barycenter thus lies outside Pluto's surface, and both bodies
actually orbit a point in free space between them, not Pluto's center — the reason the pair is
sometimes called a "double dwarf planet" (how Orrery's model simplifies this is described under
In the model). Four tiny, irregularly shaped moons — Styx, Nix, Kerberos and Hydra — orbit the
pair further out; Nix and Hydra rotate chaotically, driven by the strong, changing torques of the
massive, close Pluto-Charon pair ([Showalter and Hamilton 2015](literatur:showalter-2015)).

## Formation and evolution

Pluto formed in the Kuiper belt from the same reservoir of icy-rocky planetesimals as the other
trans-Neptunian objects. Its present 3:2 resonance with Neptune is not a coincidence of the
present day but the result of Neptune's slow migration by several astronomical units in the early
Solar System, which swept up and captured many Kuiper belt bodies into mean-motion resonances
instead of scattering them ([Malhotra 1993](literatur:malhotra-1993); placed among the other
migration models under [Formation of the Solar System](thema:entstehung)). Charon probably formed
in an oblique impact of a roughly Pluto-sized body early in the system's history: hydrodynamic
simulations show that such an impact, under suitable geometry, can leave an intact, water-rich
debris body on a close orbit that then circularizes and migrates outward to become Charon
([Canup 2005](literatur:canup-2005)). More recent simulations, which account for the material
strength of cold bodies rather than pure fluid dynamics, find a different sequence: Pluto and the
impactor meet, briefly lock together into a single rotating body ("kiss"), but then separate
again before merging completely, remaining behind as a separate, bound pair ("capture") — a
mechanism that leaves both bodies largely intact rather than thoroughly mixing them in the impact
([Denton et al. 2025a](literatur:denton-2025a)). The two scenarios predict different internal heat
budgets and degrees of differentiation for Pluto and Charon, and thus also different starting
conditions for a possible ocean (see Interior).

Unlike Triton, whose retrograde orbit shows it was gravitationally captured by Neptune after its
formation, Pluto was never captured: it evolved its own orbit into the present resonance as
Neptune migrated. The two bodies are nonetheless strikingly similar in size, density and surface
chemistry — nitrogen ice, methane, tholins — pointing to a common origin in the same,
chemically similar trans-Neptunian reservoir (placed under [Triton](objekt:triton)).

## Open questions

- **Does a global ocean still exist beneath Sputnik Planitia today?** The polar wander and its
  accompanying tectonics argue for a positive mass anomaly, classically explained by an ocean
  insulated by a clathrate layer ([Nimmo et al. 2016](literatur:nimmo-2016);
  [Kamata et al. 2019](literatur:kamata-2019)); a more recent interpretation explains the same
  anomaly through a sunken, dense impactor core with no ocean, or at most a very thin one
  ([Ballantyne et al. 2024](literatur:ballantyne-2024)).
- **Did Sputnik Planitia form in a single large impact, and when did reorientation occur?** An
  early, rapid sequence is considered plausible
  ([Hamilton et al. 2016](literatur:hamilton-2016)), but details of the timing and order of
  impact, infill and polar wander remain model-dependent.
- **Are Wright Mons and Piccard Mons true cryovolcanoes?** Their size, shape and volume argue for
  a unique cryovolcanic resurfacing ([Singer et al. 2022](literatur:singer-2022)); a definitive
  classification as volcanic rather than purely tectonic uplift is still lacking.
- **Will Pluto's atmosphere collapse in the far winter?** The observed pressure rise into the
  mid-2010s and the subsequent decline leave open how far atmospheric pressure will continue to
  fall toward aphelion in 2114, and whether it will approach zero
  ([Meza et al. 2019](literatur:meza-2019)).
- **How exactly did Charon form — through a classical impact followed by circularization, or
  through "kiss and capture"?** Both mechanisms are consistent with the roughly known orbital and
  density values ([Canup 2005](literatur:canup-2005);
  [Denton et al. 2025a](literatur:denton-2025a)), but predict different thermal histories.
- **Is Pluto a "planet"?** The 2006 IAU definition requires clearing the neighborhood of its
  orbit, which Pluto does not satisfy ([IAU 2006](literatur:iau-2006)); a counter-proposal
  suggests a purely geophysical definition under which hydrostatically round moons and dwarf
  planets would count as planets, too ([Metzger et al. 2022](literatur:metzger-2022)). The field
  has not settled on a shared criterion; Orrery follows the IAU classification as a
  [dwarf planet](thema:zwergplaneten) without thereby resolving the disciplinary dispute.

## In the model

- **Orbit:** Pluto moves heliocentrically on osculating elements from the JPL Small-Body Database
  at its own epoch JD 2457588.5 (19 July 2016), with all rates except $\dot L$ set to zero (values
  as in [Orbital elements](thema:bahnelemente)); $e = 0.2518$ and $i = 17.148^\circ$ match the
  rounded figures $\approx 0.25$ and $\approx 17^\circ$ given in the text.
- **Pluto at the origin of its system instead of around the barycenter:** As derived above, the
  system's actual barycenter lies about 2126 km (1.79 Pluto radii) from Pluto's center, outside
  Pluto's surface. Orrery does not reproduce this: `pluto` carries the heliocentric SBDB orbit
  unchanged, and `charon` orbits Pluto's own center with `parent: 'pluto'`, like any other moon,
  rather than this barycenter. In reality, Pluto itself would wobble by about 2126 km around the
  barycenter with Charon's orbital period of 153.29335 h, and its heliocentric position would
  shift periodically by the same amount. At a solar distance of about 39.6 AU (just under 5.9
  billion km), this wobble amounts to less than 0.00004 % of the distance and is
  insignificant for the display; the heliocentric SBDB orbit is itself already that of the system
  barycenter, so in the model Pluto sits exactly on the (real-wobble-averaging) barycentric orbit,
  while Charon visibly and to scale orbits Pluto's center rather than the true barycenter, which
  lies closer to Charon. The scene ["Pluto and Charon, a double world"](szene:pluto-charon)
  accordingly shows two bodies of which only Charon visibly moves.
- **Rotation and pole:** `rotationPeriodH` is set to $153.29335$, positive for both Pluto and
  Charon; the retrograde sense (about 120° obliquity) is contained entirely in the pole direction
  $132.993^\circ/-6.163^\circ$, not in the sign. The obliquity independently recomputed with
  `achsneigungDeg` matches $119.614^\circ$ (value as in [Axial tilt](thema:achsneigung)) — the
  geometric angle between this pole and the orbit normal built from SBDB's orbital elements at
  epoch J2000, without a 180° flip, because `rotationPeriodH` stays positive. The angle between
  the map center and the direction to Charon is 131.1° (Pluto) and 48.9° (Charon), drifting by
  only 0.3° per century (values as in [Tidal locking](thema:gebundene-rotation)); the map center
  accordingly does not point at Charon but 173° away from it (value as in
  [Reference frames](thema:bezugssysteme)).
- **Resonance with Neptune:** At the epoch, the model's resonant angle stands at
  $\varphi_\mathrm{P} = 242.6^\circ$ (own recomputation from the mean longitudes of Pluto and
  Neptune rescaled to J2000 and Pluto's longitude of perihelion, matching
  [Orbital resonances](thema:resonanzen)); the datasets' period ratio deviates from 3:2 at 1.5116,
  so $\varphi_\mathrm{P}$ decreases by 3.35° per century in the model and completes one cycle in
  10,752 years instead of librating by 180° as in reality; conjunctions never come closer to
  Neptune than 19.0 AU between 1800 and 2050.
- **Data panel against measured values:** The mass carried in the dataset gives
  $GM_\mathrm{Pluto} = 869.66\,\mathrm{km^3\,s^{-2}}$, about 416 ppm above the dynamically
  determined value given in Parameters and measurement; for Charon it gives
  $105.85\,\mathrm{km^3\,s^{-2}}$, about 2300 ppm below it — both deviations lie far below the
  display's precision. Catalog albedos 0.52 (Pluto) and 0.42 (Charon) are NSSDC whole-disk means,
  not LORRI measurements, and therefore fall between the surface extremes given in Parameters and
  measurement; every body carries its albedo normalized to the slider range
  ([Albedo and brightness](thema:photometrie)).
- **What is missing:** Styx, Nix, Kerberos and Hydra are not in the catalog; Orrery's
  `waehleOkkluder` therefore trivially always picks only Charon as a possible shadow caster for
  Pluto (`MAX_OKKLUDER = 4` in `render/shadows.ts`, value as in
  [Eclipses](thema:finsternis), which covers the mutual events of 1985 to 1990). There is no
  atmosphere, no haze layer and no seasonal change in pressure or albedo; Pluto appears as a
  sharply bounded, directly lit sphere with a New Horizons global-mosaic texture whose far side,
  not visited by the spacecraft, remains unlit and black (about 30 % of the area, about a third for
  Charon; `ASSETS.md`). As a heliocentric dwarf planet, Pluto scales like any planet with the
  display's distance compression, while Charon, as a satellite (`isSatellite`), scales with
  `sizeScale` like any other moon (`sim/scale.ts`). Further simplifications:
  [Limits of the model](thema:modell).

*As of September 2026*
