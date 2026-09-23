# Eris

At a radius of about $1163\,\mathrm{km}$, Eris is nearly as large as
[Pluto](objekt:pluto), but distinctly more massive; its discovery in 2005 triggered the
debate that led to the 2006 definition of dwarf planets
([Brown et al. 2005](literatur:brown-trujillo-rabinowitz-2005);
[IAU 2006](literatur:iau-2006)). As with [Charon](objekt:charon), almost everything known
about Eris comes from the orbit of its one known moon, Dysnomia, and from stellar
occultations, light curves and spectroscopy — no spacecraft has ever surveyed the system up
close. This text presents parameters, interior, surface, atmosphere, orbit and formation, and
closes with what Orrery models of all this, in particular the stand-in axis that replaces
the missing measured pole direction.

## Parameters and measurement

A stellar occultation on 6 November 2010 gave Eris a mean radius of
$1163 \pm 6\,\mathrm{km}$ ([Sicardy et al. 2011](literatur:sicardy-2011)) — within the
uncertainties, essentially equal to Pluto's $1188.3 \pm 1.6\,\mathrm{km}$
([Pluto's parameters](objekt:pluto)). Before New Horizons surveyed Pluto in 2015, Eris was
widely considered the larger of the two bodies; today Pluto is, within measurement accuracy,
slightly larger, while Eris remains the more massive one. As with Charon, the mass follows
from the orbit of a moon: the combined Keplerian fit to Dysnomia's orbit (period
$15.785899 \pm 0.000050\,\mathrm{d}$, semi-major axis $37\,273 \pm 64\,\mathrm{km}$) gives a
system mass for Eris plus Dysnomia of $(1.6466 \pm 0.0085) \times 10^{22}\,\mathrm{kg}$
([Holler et al. 2021](literatur:holler-2021)). ALMA radio observations set a $1\sigma$ upper
limit of $1.4 \times 10^{20}\,\mathrm{kg}$ on Dysnomia's own share, a mass ratio of at most
$0.0085$ ([Brown and Butler 2023](literatur:brown-butler-2023)); Eris therefore carries
essentially the entire system mass and is about 26 % more massive than Pluto (derived from
[Pluto's $GM$](objekt:pluto)). Taking the system mass minus an assumed small Dysnomia mass
together with the occultation radius, $\bar\rho = 3M/(4\pi R^3)$ gives a density of about
$2.49\,\mathrm{g\,cm^{-3}}$ for Eris alone (derivation) — close to, but somewhat above, the
full system density of $2.43 \pm 0.05\,\mathrm{g\,cm^{-3}}$ that Holler et al. (2021)
compute from the combined volume of Eris and Dysnomia (Dysnomia's own, presumably lower
density pulls the system value down), and below the older value of
$2.52 \pm 0.05\,\mathrm{g\,cm^{-3}}$, which still rested on the original mass determination
by [Brown and Schaller (2007)](literatur:brown-schaller-2007). The same occultation gave a
geometric albedo of $0.96_{-0.04}^{+0.09}$ ([Sicardy et al. 2011](literatur:sicardy-2011))
— the highest in the entire catalog. Long-term photometry from the ground and from space
shows a light curve with a period equal to Dysnomia's orbit and an amplitude of only about
0.03 mag, evidence for tidally locked rotation
([Szakáts et al. 2023](literatur:szakats-2023)).

| Quantity | Value | Uncertainty | Method | Source |
|---|---|---|---|---|
| Radius | $1163\,\mathrm{km}$ | $6\,\mathrm{km}$ | Stellar occultation, 2010 | [Sicardy et al. 2011](literatur:sicardy-2011) |
| System mass (Eris + Dysnomia) | $1.6466 \times 10^{22}\,\mathrm{kg}$ | $0.0085 \times 10^{22}\,\mathrm{kg}$ | Kepler's law from Dysnomia's orbit | [Holler et al. 2021](literatur:holler-2021) |
| Mean density (Eris alone) | $2.49\,\mathrm{g\,cm^{-3}}$ | – | Derived from mass and radius | Derivation |
| Geometric albedo | $0.96$ | +0.09/−0.04 | Stellar occultation, 2010 | [Sicardy et al. 2011](literatur:sicardy-2011) |
| Rotation period | $378.864\,\mathrm{h}$ | – | Light curve = Dysnomia's orbital period | [Szakáts et al. 2023](literatur:szakats-2023) |

## Interior

A homogeneous rock–ice mixture with the observed density would have to be over 85 % rock by
mass; its Love number would be about $k_2 \approx 0.01$, and a radiogenically heated central
temperature of around 875 K would stay well below the melting point of rock — such a body
would hardly be dissipative. Eris and Dysnomia's doubly synchronous rotation (see Orbit,
rotation and dynamics) demands the opposite: for Eris' spin to have slowed to Dysnomia's
orbital period within 4.5 billion years, the body must be considerably more dissipative than
the homogeneous mixture allows — for a simplified model with constant $Q$, that corresponds
to a ratio $Q/k_2$ of about 3200; a more realistic, frequency-dependent (viscoelastic)
damping law requires an initial value of 6300 and, averaged over the evolution, about
5500 — less than a factor of 2 from the constant-Q value, but in both cases far beyond
what a homogeneous mixture could supply. The small upper limit on Dysnomia's mass measured by
[Brown and Butler (2023)](literatur:brown-butler-2023) with ALMA makes this contradiction
particularly telling: so small a companion can only have slowed the comparatively large Eris
if its interior is unusually compliant. That points to a differentiated structure — a rigid
rock core beneath an isoviscous ice shell on the order of $90\,\mathrm{km}$ thick, topped by
a firm, elastic lid — whose ice supplies the extra dissipation through convection. Unlike
[Pluto](objekt:pluto), where a positive mass anomaly beneath Sputnik Planitia argues for a
possible ocean, this model finds no need for liquid water at Eris
([Nimmo and Brown 2023](literatur:nimmo-brown-2023)).

## Surface

Near-infrared spectra show deep methane-ice bands on Eris, shifted relative to pure methane
ice — a sign of methane dissolved in a nitrogen-ice matrix, similar to Pluto
([Tegler et al. 2010](literatur:tegler-2010)). James Webb Space Telescope spectroscopy
detected the heavy isotopologues of methane for the first time — ${}^{13}\mathrm{CH_4}$ at
$2.615\,\mathrm{\mu m}$ and $\mathrm{CH_3D}$ at $4.33$ and $4.57\,\mathrm{\mu m}$ — and found
a D/H ratio in the methane similar to that in water; the authors read this as evidence for
internal geochemical activity in a warm or hot rocky core
([Grundy et al. 2024](literatur:grundy-2024)). A later modeling study shows, however, that the
same elevated D/H ratio can also be explained without internal activity, if the methane is
primordial, sequestered as a solid in the protosolar disk, similar to values measured at
comet 67P/Churyumov–Gerasimenko ([Mousis et al. 2025](literatur:mousis-2025)); which reading
is correct remains open (see Open questions). The exceptionally high albedo (see Parameters
and measurement) fits freshly deposited nitrogen and methane frost, as expected for a
sublimation-driven surface near the far end of the orbit
([Sicardy et al. 2011](literatur:sicardy-2011)).

## Atmosphere and magnetosphere

The same occultation that gave the radius and albedo also sets a tight limit on any global
atmosphere: for a pure, isothermal nitrogen atmosphere, the surface pressure is at most
$2.9\,\mathrm{nbar}$ ($3\sigma$), with comparable limits for methane and argon
([Sicardy et al. 2011](literatur:sicardy-2011)). That is more than three orders of magnitude
below Pluto's actually measured surface pressure of about $11.5\,\mathrm{\mu bar}$
([Pluto's parameters](objekt:pluto)) and fits Eris' far greater, currently still growing
solar distance (see Orbit, rotation and dynamics): unlike on Pluto, near aphelion every
volatile on Eris is fully frozen onto the surface instead of forming a measurable gas
envelope.

## Orbit, rotation and dynamics

Eris' orbit has a semi-major axis of $a = 67.934\,\mathrm{AU}$ and, with $e = 0.438$, the
largest eccentricity in the entire catalog (value as in
[Orbital elements](thema:bahnelemente)), at an inclination of $i = 43.9^\circ$ to the
ecliptic. From this follow a perihelion distance of $38.16\,\mathrm{AU}$ and an aphelion
distance of $97.71\,\mathrm{AU}$ (derivation); the orbital period is about 560 years
(derivation, checked in code, consistent with Kepler's third law for the heliocentric
semi-major axis). On 17 September 2026, Eris is about $95.5\,\mathrm{AU}$ from the Sun
(checked in code) — closer than at aphelion in 1977, but still far from perihelion around
2257. Unlike Pluto, Eris is in no orbital resonance with Neptune; it belongs to the scattered
disc, that group of objects with high eccentricity and inclination that Neptune's migration
once flung out of closer orbits
([Brown et al. 2005](literatur:brown-trujillo-rabinowitz-2005); context under
[Formation of the Solar System](thema:entstehung)). Dysnomia orbits Eris in
$15.785899\,\mathrm{d}$ on a nearly circular, but measurably eccentric orbit
($e = 0.0062 \pm 0.0010$) with $a = 37\,273\,\mathrm{km}$; the orbit pole is tilted by
$78.29 \pm 0.65^\circ$ against Eris' own heliocentric orbital plane
([Holler et al. 2021](literatur:holler-2021)) — the only axis information measured for Eris
so far, on the assumption that the doubly synchronous rotation aligns spin axis and moon
orbit pole (context under [Tidal locking](thema:gebundene-rotation) and
[Axial tilt](thema:achsneigung)). The next season of mutual occultations and eclipses between
Eris and Dysnomia as seen from Earth is not expected until 2239
([Holler et al. 2021](literatur:holler-2021)).

## Formation and evolution

Eris' discovery in 2005 as a body more massive than Pluto set off the debate that led to the
2006 formal definition of the dwarf planet
([Brown et al. 2005](literatur:brown-trujillo-rabinowitz-2005); context under
[Dwarf planets](thema:zwergplaneten)). Like the other members of the scattered disc, Eris
likely formed closer to the Sun in the original, thin planetesimal-disc reservoir and was
flung out onto its present wide, highly inclined orbit by close encounters with the
migrating Neptune, rather than being captured into a protective mean-motion resonance like
Pluto ([Brown et al. 2005](literatur:brown-trujillo-rabinowitz-2005); context under
[Formation of the Solar System](thema:entstehung)).

## Open questions

- **Is Eris internally differentiated, with a convecting ice shell over a rock core?** The
  spin-orbit evolution requires high dissipation that a homogeneous mixture cannot supply; a
  differentiated model explains it, but a direct measurement of the moment of inertia or
  gravity field is still missing
  ([Nimmo and Brown 2023](literatur:nimmo-brown-2023)).
- **Where does Eris' spin axis point?** The only known value is a tilt of $78.29^\circ$
  against its own orbit, derived from Dysnomia's orbit pole, with no right ascension or
  declination ([Holler et al. 2021](literatur:holler-2021); see In the model).
- **How large is Dysnomia, and what is its albedo?** An initial ALMA measurement gave an
  assumed radius of about $350\,\mathrm{km}$
  ([Brown and Butler 2018](literatur:brown-butler-2018)); a more recent ALMA Band 6
  follow-up observation revises the size to a diameter of $615^{+60}_{-50}\,\mathrm{km}$,
  that is a radius of about $308\,\mathrm{km}$, which is also the radius used to compute the
  density of $0.7 \pm 0.5\,\mathrm{g\,cm^{-3}}$ (upper limit $1.2\,\mathrm{g\,cm^{-3}}$)
  ([Brown and Butler 2023](literatur:brown-butler-2023)) — both values considerably less
  certain than the corresponding ones for Eris itself.
- **Does the elevated D/H ratio in the methane ice come from internal activity or from the
  protosolar disc?** Both readings fit the same measurement
  ([Grundy et al. 2024](literatur:grundy-2024); [Mousis et al. 2025](literatur:mousis-2025)),
  and the field has not settled the question.
- **Does Eris develop a transient atmosphere near its perihelion around 2257?** Today's
  upper limit of $2.9\,\mathrm{nbar}$ holds near aphelion; whether warmer conditions closer to
  the Sun permit a sublimation-driven gas envelope as on Pluto is unanswered.

## In the model

- **Pole as the orbital normal, not a measurement:** The dataset carries Eris' pole at
  $296.9706^\circ/25.9491^\circ$ — exactly its own heliocentric orbital normal from $i$ and
  the node, independently checked in code and matching the catalog value to six decimal
  places. This stand-in axis contradicts the one value that has actually been measured, the
  tilt of $78.29^\circ$ derived from Dysnomia's orbit pole
  ([Holler et al. 2021](literatur:holler-2021); values and reasoning as in
  [Axial tilt](thema:achsneigung)): the orbital normal itself corresponds to a tilt of
  $0^\circ$, so it can be wrong by as much as $78^\circ$. The axial tilt recomputed in the
  data panel with `achsneigungDeg` accordingly gives only $0.000036^\circ$ — the panel rounds
  this to one decimal place and shows $0.0^\circ$, far from the measured tilt.
- **Rotation period against Dysnomia's measured value:** `rotationPeriodH` is set to
  $378.864$; Dysnomia's precisely measured orbital period of $15.785899\,\mathrm{d}$
  ([Holler et al. 2021](literatur:holler-2021)) gives $378.861576\,\mathrm{h}$ — a deviation
  of about $0.0024\,\mathrm{h}$ (just under 9 seconds, about 0.0006 %), far below display
  precision.
- **`massKg` as Eris alone:** The value $1.638 \times 10^{22}\,\mathrm{kg}$ is, according to
  the dataset comment, the system mass ($1.6466 \times 10^{22}\,\mathrm{kg}$,
  [Holler et al. 2021](literatur:holler-2021)) minus an assumed, small Dysnomia share of
  about $8.6 \times 10^{19}\,\mathrm{kg}$ — a figure below, but of the same order of
  magnitude as, the later ALMA upper limit of $1.4 \times 10^{20}\,\mathrm{kg}$
  ([Brown and Butler 2023](literatur:brown-butler-2023)); exactly which source the dataset
  comment used for that subtraction is not stated there.
- **Dysnomia is missing from the catalog:** Unlike Pluto and Charon, Orrery does not model
  Eris' moon; the orbit and mass values above are text-only.
- **Orbit and Kepler solver:** Osculating heliocentric SBDB elements at its own epoch, all
  rates except $\dot L$ zero (as in [Orbital elements](thema:bahnelemente)); for the largest
  eccentricity in the catalog ($e = 0.438$), the Newton method needs at most 5 steps (value
  as in [Orbital elements](thema:bahnelemente)).
- **Albedo and texture:** Albedo $0.96$, the highest in the catalog. Per `ASSETS.md`, the
  surface texture is an artistic approximation explicitly labeled "fictional" by Solar System
  Scope, not a real image (checked in code: `ASSETS.md`) — there simply is no imagery of
  Eris' surface.
- **Exposure at about 96 AU:** On 17 September 2026, Eris' displayed distance is
  $95.5\,\mathrm{AU}$; with the default settings (`brightness = 1`, `lightFalloff = 2`,
  `lightCompensation = 0.7`, `nightFill = 0.25`), `bodyLighting` gives a day-side level of
  about 6.5 % and a night-side level of about 1.6 % of the reference brightness (checked
  in code: `render/lighting.ts`); if the camera exposes on Eris itself, `targetExposure`
  raises the overall illumination by a factor of about 48 (checked in code:
  `render/exposure.ts`). The calibration value documented in `render/lighting.test.ts`
  (distance $97.23\,\mathrm{AU}$, day level $0.0642$) holds for epoch J2000, not for today's
  date; the difference follows purely from the distance covered along the orbit since then.
- **Scale and camera radius:** Eris is a heliocentric dwarf planet (`parent: 'sun'`) and
  therefore scales like a planet with the distance compression of the display, not like a
  moon with `sizeScale` (`sim/scale.ts`). The automatic camera system-radius calculation in
  `render/camera/cinema.ts` deliberately keys only on Neptune (`AEUSSERSTER_PLANET`), not on
  Eris' much wider orbit — otherwise cinema scenes would be disproportionately inflated.
  Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
