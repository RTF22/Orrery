# The Solar System

The Solar System is the Sun together with everything its gravity binds: eight major planets,
five recognized dwarf planets, at least 461 known moons, two belts of small bodies, and, beyond
them, a cloud of cometary nuclei that is so far only inferred indirectly. This text describes
its architecture at a specialist level: how mass and orbital angular momentum are divided
between the Sun and the planets, which plane actually stays fixed in space, how the classes of
bodies formed and got their names, and how old and how stable the system is. The eight planets
and the five dwarf planets have their own texts, reachable through their names from
[Mercury](objekt:mercury) to [Neptune](objekt:neptune), plus [Ceres](objekt:ceres),
[Pluto](objekt:pluto) and the rest; dedicated topics go deeper into the orbital elements
themselves ([Orbital Elements](thema:bahnelemente)), reference systems and time scales
([Reference Systems](thema:bezugssysteme)), formation from the protoplanetary disk
([Formation of the Solar System](thema:entstehung)), orbital resonances
([Orbital Resonances](thema:resonanzen)), tides and the Roche limit ([Tides](thema:gezeiten)),
the interior structure of the bodies ([Interior Structure](thema:innerer-aufbau)), and albedo
and brightness ([Photometry](thema:photometrie)); what Orrery shows of all this, and where it
simplifies, is collected under [Limits of the Model](thema:modell).

## Architecture: Mass and Orbital Angular Momentum

The Sun and the eight planets together account for practically the entire mass of the system;
dwarf planets, moons, rings and the two belts together contribute less than a millionth of it.
From the catalog masses and semi-major axes (`src/data/bodies/`):

| Body | Mass (kg) | $a$ (AU) | Share of mass | Share of angular momentum |
|---|---:|---:|---:|---:|
| Sun | $1.9885 \cdot 10^{30}$ | – | 99.866 % | 0.609 % |
| Mercury | $3.3010 \cdot 10^{23}$ | 0.387 | 0.0000166 % | 0.00284 % |
| Venus | $4.8673 \cdot 10^{24}$ | 0.723 | 0.000244 % | 0.0585 % |
| Earth | $5.9722 \cdot 10^{24}$ | 1.000 | 0.000300 % | 0.0844 % |
| Mars | $6.4169 \cdot 10^{23}$ | 1.524 | 0.0000322 % | 0.0112 % |
| Jupiter | $1.89813 \cdot 10^{27}$ | 5.203 | 0.0953 % | 61.1 % |
| Saturn | $5.6832 \cdot 10^{26}$ | 9.537 | 0.0285 % | 24.8 % |
| Uranus | $8.6811 \cdot 10^{25}$ | 19.189 | 0.00436 % | 5.37 % |
| Neptune | $1.02409 \cdot 10^{26}$ | 30.070 | 0.00514 % | 7.94 % |

The mass shares are relative to the sum of the solar mass and the eight planetary masses: the
planets together make up 0.134 % of that sum, the Sun 99.866 % — close to the round figure of
99.86 % already given at secondary-school level. The orbital angular momentum of each planet
follows from the two-body formula

$$L = M\,\sqrt{GM_\odot\,a\,\left(1-e^2\right)}$$

with the eccentricity $e$ from the dataset at epoch J2000 and
$GM_\odot = 1.327 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$, computed from the solar mass and
$G = 6.674 \cdot 10^{-11}\,\mathrm{m}^3\,\mathrm{kg}^{-1}\,\mathrm{s}^{-2}$ (working shown in the
source list). The result is the actual angular momentum problem of Solar System formation:
although the Sun carries practically the entire mass, practically all of the orbital angular
momentum sits with the planets ([Ray 2012](literatur:ray-2012)), with Jupiter and Saturn alone
accounting for 85.9 % (own calculation). The Sun's own rotation contributes only
$1.92 \cdot 10^{41}\,\mathrm{kg}\,\mathrm{m}^2\,\mathrm{s}^{-1}$ to this, a value measured from
helioseismology ([Iorio 2012](literatur:iorio-2012)); a naive estimate treating the Sun as a
uniform sphere,

$$L_{\mathrm{naiv}} = \frac{2}{5}\,M_\odot\,R_\odot^2\,\omega_\odot,$$

using the solar mass, the solar radius and $\omega_\odot$ from the dataset's rotation period of
609.12 h at 16° heliographic latitude, would give
$1.10 \cdot 10^{42}\,\mathrm{kg}\,\mathrm{m}^2\,\mathrm{s}^{-1}$ — 5.7 times the measured value
(own calculation). The difference shows how strongly the Sun's mass is concentrated toward its
centre: a uniform sphere would have a moment-of-inertia factor $I/MR^2 = 2/5$, whereas the
measured angular momentum implies only about 0.07 for the Sun — well below the value for a
homogeneous sphere, as expected for a star that grows denser toward its interior.

## Invariable Plane and Barycentre

Neither the ecliptic nor the solar equator is fixed in space; both precess against each other.
What does stay fixed is the invariable plane, perpendicular to the total angular momentum of the
system and passing through its barycentre: including the eight planets, Pluto, Ceres, and the
two largest asteroids Vesta and Pallas, it is inclined by 1.58° to the ecliptic and equinox of
J2000 ([Reference Systems](thema:bezugssysteme)), with an ascending node at ecliptic longitude
107.6° — a determination accurate to under a milliarcsecond, for which the authors find the
dwarf planets Ceres and Pluto indispensable
([Souami and Souchay 2012](literatur:souami-2012)).

The Sun itself does not rest at this barycentre but moves around it: between 1800 and 2050 its
centre lay between 0.06 and 2.11 solar radii from it, on average 1.21 solar radii, at speeds of
8.5 to 16.1 m/s; [Jupiter](objekt:jupiter) alone shifts the barycentre by 1.07 solar radii, and
the closest approaches recur on average every 19.86 years, the synodic period of Jupiter and
Saturn (peer-reviewed text: [Sun](objekt:sun), section Orbit, rotation and dynamics). Orrery, by
contrast, treats the Sun as resting at the origin, without this motion around the barycentre
(details further below).

## Classes of Bodies

Bodies are grouped by mass, composition and orbital location. The four inner ones,
[Mercury](objekt:mercury), [Venus](objekt:venus), [Earth](objekt:earth) and [Mars](objekt:mars),
are terrestrial planets with a solid core and a thin or absent gas envelope. Beyond the snow
line come the gas giants [Jupiter](objekt:jupiter) and [Saturn](objekt:saturn), mostly hydrogen
and helium, and the ice giants [Uranus](objekt:uranus) and [Neptune](objekt:neptune), with a
larger share of water, ammonia and methane ice. Five bodies — [Ceres](objekt:ceres),
[Pluto](objekt:pluto), [Eris](objekt:eris), Haumea and Makemake — carry the status of dwarf
planet: massive enough for hydrostatic equilibrium, but without a cleared orbital neighbourhood;
criteria, the dispute, and individual values are given under [Dwarf Planets](thema:zwergplaneten).

Moons accompany six of the eight planets and several dwarf planets; at least 461 are known —
Earth 1, Mars 2, Jupiter 115, Saturn 293, Uranus 29, Neptune 16, Pluto 5 —, as of 23 May 2023
([JPL SSD Discovery Circumstances](quelle:jpl-satelliten-entdeckung)); most of them are small,
irregularly bound captured bodies.

Between Mars and Jupiter lies the asteroid belt, whose semi-major-axis distribution peaks around
2.7 AU and extends over roughly 2.1 to 3.3 AU (peer-reviewed text:
[Kirkwood Gaps](thema:kirkwood-luecken), section In the model); beyond Neptune lies the
Kuiper belt, whose population is roughly divided into about 60 % cold classical, 25 % hot, and
15 % Plutino objects (peer-reviewed text: [Formation of the Solar System](thema:entstehung),
section In the model). Further out still lies the scattered disk, whose objects were thrown onto
eccentric, strongly inclined orbits by close encounters with Neptune; whether a roughly
spherical Oort cloud of cometary nuclei follows beyond that is considered the likely explanation
for long-period comets, but it has not been observed directly — even rough figures for its
extent and total mass are still missing ([Oort Cloud](quelle:nasa-oortwolke)).

The heliosphere, finally, is the bubble the solar wind inflates in the interstellar medium;
Voyager 2 crossed its outer boundary, the heliopause, on 5 November 2018 at 119 AU
([Stone et al. 2019](literatur:stone-2019)).

## Age

The oldest dated solids in the system, calcium-aluminium-rich inclusions in meteorites, formed
$4567.30 \pm 0.16$ million years ago ([Connelly et al. 2012](literatur:connelly-2012)); this age
is commonly taken as the age of the Solar System itself, because the formation of the first
solids marks the transition from the solar formation cloud to the Solar System proper.

## Stability and Long-Term Evolution

Despite the simple two-body physics of each individual orbit, the dynamics of the system as a
whole is chaotic, with a predictability horizon of a few tens of millions of years for the exact
positions of the inner planets. In an integration of 2501 slightly different initial conditions
over 5 billion years each, about 1 % ended in a strong increase of Mercury's orbital
eccentricity, which can lead to a collision with Venus or a plunge into the Sun, and in rarer
cases to a subsequent instability that lets Mars or Venus collide with Earth
([Laskar and Gastineau 2009](literatur:laskar-2009)); the Solar System in its present form is
thus stable statistically, not deterministically.

## Placing the Solar System among Exoplanet Systems

More than 6000 planets around other stars are now known
([NASA Exoplanet Catalog](quelle:nasa-exoplaneten)), enough to place the architecture of our own
system in context. In the period ratios of neighbouring planets, our system falls within the
usual range: the most commonly observed ratios lie between 1.5 and 3.0, those of the eight
planets between 1.7 and 2.8 ([Winn and Fabrycky 2015](literatur:winn-2015)). What is atypical is
what is missing: about half of all Sun-like stars host at least one close-in planet, orbiting in
less than a year, with one to four Earth radii — an entire size class between terrestrial planet
and ice giant that has no representative anywhere in our own system
([Winn and Fabrycky 2015](literatur:winn-2015)). Whether our own system is on the whole ordinary
or rare therefore remains open (see below).

## The Name "Orrery"

The name Orrery goes back to a mechanical model of the Solar System: around 1713, the London
instrument maker John Rowley built such a device for Charles Boyle, the fourth Earl of Orrery,
showing the Sun, Earth and Moon; it is now held by the Science Museum in London
([Collection item](quelle:sciencemuseum-orrery)); in German, such devices were also called
Planetarium, Planetenmaschine, or, when they show only the Sun, Earth and Moon, Tellurium
([Wikipedia](quelle:wikipedia-de-orrery)). No known orrery is built to scale — at true size
ratios the planet balls would be invisibly small — and this program, too, enlarges bodies and
compresses distances; unlike a gear train, though, it computes the positions continuously from
orbital elements instead of approximating them through fixed gear ratios.

## Open Questions

- **A ninth, distant planet?** A clustering in the direction of perihelion and orbital plane of
  several extreme trans-Neptunian objects fits an unseen planet of more than about 10 Earth
  masses on a strongly eccentric orbit hundreds of AU from the Sun, with a chance probability of
  only 0.007 % ([Batygin and Brown 2016](literatur:batygin-2016)). A later analysis of the
  observational selection of several sky surveys instead found no evidence for a clustering that
  was not already explained by the uneven observational coverage itself
  ([Napier et al. 2021](literatur:napier-2021)); the question therefore remains open.
- **How typical is the Solar System?** Period ratios match the usual range, but the missing
  size class of close-in super-Earths does not
  ([Winn and Fabrycky 2015](literatur:winn-2015)); the field has not settled on a summary
  verdict of "typical" or "rare".
- **Mass and shape of the Oort cloud.** Its existence is considered the likely explanation for
  long-period comets, but for lack of direct observation even rough, generally accepted figures
  for its extent, population and total mass are still missing
  ([Oort Cloud](quelle:nasa-oortwolke)).
- **Origin of the Sun's axial tilt.** The solar equator is inclined by about 6° to the
  invariable plane; as a possible explanation the authors themselves call testable, Bailey,
  Batygin and Brown propose the same hypothetical distant planetary orbit that is also meant to
  explain the clustering of the trans-Neptunian objects
  ([Bailey et al. 2016](literatur:bailey-2016)).

## In the Model

Orrery includes 35 bodies: the Sun, the eight planets, 21 moons, and the five recognized dwarf
planets (counted in `src/data/index.ts`). Practically all of the remaining at least 461 known
moons are missing, as is every comet, the Jupiter trojans, the scattered disk, the Oort cloud,
and the heliosphere as its own structure — matching what
[Formation of the Solar System](thema:entstehung) already describes in its own "In the model"
section for the two belts. The Sun sits fixed at the origin, not at the true, wandering
barycentre (above); every body moves on its own, without mutual perturbations.

Camera scenes that orient themselves on the extent of the system base their radius explicitly on
the outermost *planet* — Neptune, `AEUSSERSTER_PLANET` in `src/render/camera/cinema.ts` — and
deliberately leave the dwarf planets out: Eris' orbit reaches roughly 98 AU at aphelion, farther
than Neptune, and would inflate any such scene disproportionately. For the display itself, an
adjustable scale compresses distances and enlarges bodies: in the "Diagram" preset, Neptune's
real semi-major axis of 30.07 AU shrinks to roughly 7.71 AU, in "Compact" to roughly 3.90 AU,
while the real size ratio of the solar to the Earth's radius (about 109.2 to 1) drops to about
38.2 to 1 and 21.8 to 1 respectively through an additional damping that acts only on the Sun
(own calculation with the formula from `src/sim/scale.ts`; details under
[Limits of the Model](thema:modell)).

This text is also the starting text of the university tab: without a link and without a
remembered session, after a click on "Reset", and after a click on the root of the object tree,
the code explicitly sets the topic to `sonnensystem` (`SYSTEM_THEMA` in `src/data/themen.ts`,
used for the start and the reset in `src/app/persistenz.ts` and `src/store/persist.ts`, and for
the click on the root in `src/ui/kamerafahrt.ts`) — whoever opens the program without bringing a
specific target reads this text first. A moving overview is shown by
[The Solar System from above](szene:systemblick).

*As of September 2026*
