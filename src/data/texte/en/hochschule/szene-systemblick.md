# Scene: The Solar System from above

The camera sits high above the ecliptic over the resting [Sun](objekt:sun), looks down on it and
slowly circles it while time runs at a time-lapse rate. Unlike the close and fly-by scenes
elsewhere in the film, this path type shows no single body but the architecture of the whole
[Solar System](thema:sonnensystem) at a glance — with every simplification a model needs for
that.

## What the view shows

Path type `system` (`src/render/camera/cinema.ts`), target body the Sun, distance basis
`systemRadius`: the reference radius is the compressed distance of the outermost *planet*,
[Neptune](objekt:neptune) (`AEUSSERSTER_PLANET`, `src/render/camera/cinema.ts`) — dwarf planets
deliberately do not count, Eris' orbit reaches, with $e=0.438$ and $a=67.934\,\mathrm{AU}$, out to
about $97.7\,\mathrm{AU}$ at aphelion (derived from $a(1+e)$) and would inflate the scale out of
proportion. With Neptune's semi-major axis of 30.07 AU ([Limits of the model](thema:modell)) the
system radii, and, at 1.6 times the radius times the scatter factor, the camera distances work
out as:

| Preset | System radius | Camera distance (factor 0.85–1.25) |
|---|---|---|
| Realistic | 30.07 AU | 40.90–60.14 AU (48.11 AU at factor 1, about 7.20 billion km) |
| Diagram | 7.71 AU | 10.48–15.41 AU (12.33 AU) |
| Compact | 3.90 AU | 5.31–7.80 AU (6.24 AU) |

The actual, compressed distance to Neptune varies by at most about 1 % around this semi-major-axis
value because of its low eccentricity ($e=0.0086$; own recalculation with `systemRadiusKm`).

Elevation and scatter factor are drawn once per run of the scene and then stay fixed, only the
azimuth keeps turning at $0.9^\circ/\mathrm{s}$: a base of $78^\circ$ with an offset from
$-25^\circ$ to $+10^\circ$ gives an elevation between $53^\circ$ and $88^\circ$ (own sample over
5000 draws: $53.0^\circ$ to $87.8^\circ$), the scatter factor lies between 0.85 and 1.25; in 60 s
the camera turns by exactly $54^\circ$ ($0.9^\circ/\mathrm{s}\times 60\,\mathrm{s}$).

The vertical field of view measures $50^\circ$ (`KAMERA_FOV_GRAD`), so the half-angle is
$25^\circ$. For a point on a circular orbit of radius $\rho$ (in units of the system radius), the
projection onto the image's vertical axis at camera distance $D=1.6\cdot f$ (with $f$ the scatter
factor) and elevation $e$ gives a near-side angle $\arctan(\rho\sin e/(D-\rho\cos e))$ and a far-side
angle $\arctan(\rho\sin e/(D+\rho\cos e))$ (derivation, the camera's look-at plane). For
Neptune's own orbit ($\rho=1$) the two add up, depending on the draw, to $46.8^\circ$ (elevation
$53^\circ$, factor 1.25) through $72.6^\circ$ (elevation $88^\circ$, factor 0.85); because the
near and far points do not sit symmetrically about the image centre, though, this sum is not what
decides the fit — the single near-point angle against the half-angle $25^\circ$ is. Solved for the
orbital radius, that gives a threshold of about 59 % (tightest draw) to 92 % (widest draw) of the
system radius, above which a circular orbit no longer stays fully within frame; since Neptune's
own orbital radius ($\rho=1$) exceeds this in every draw, it never fits fully into the frame.
Uranus (64–84 % of the system radius, depending on preset) sits inside the frame in some draws and
beyond its edge in others, while the four inner planets (up to 30.3 % under "Compact", the
largest value being Mars) always stay safely inside.

The inner planets never resolve into discs: at an image height of 1440 pixels and factor 1, Earth,
the largest of the four, measures 0.0014 pixels in radius under "Realistic", 0.267 under "Diagram"
and 2.11 under "Compact" (`apparentRadiusPixels`, `src/render/labels.ts`); even at the closest
possible draw (factor 0.85, "Compact") it stays at about 2.5 pixels, below the threshold of 3 at
which a body switches from a placeholder glyph to an actual sphere (`MARKER_MIN_PIXEL`). Mercury,
Venus and Mars are smaller still — in this scene the inner planets appear only as markers, in
every preset and every draw.

With no `lookAtId` of its own, the camera exposes on the scene's target body, here the Sun
(`blickzielVon`); because its displayed distance at the origin is zero, `targetExposure` returns
exactly $\pi$ regardless of preset and display settings (`src/render/lighting.ts`,
`src/render/exposure.ts`) — the same reference value as a camera exposing at 1 AU on a Lambertian
surface with `brightness = 1`.

At 30 days per second, exactly 1800 simulated days pass in 60 s, just under 4.93 years. From the
dataset's mean motions (`LDot`, `src/data/bodies/*.ts`) this works out to 20.46 orbits for
[Mercury](objekt:mercury) (87.97 d), 8.01 for Venus (224.70 d), 4.93 for the
[Earth](objekt:earth) (365.26 d), 2.62 for Mars (686.98 d), 0.415 for Jupiter (11.86 yr), 0.167
for Saturn (29.45 yr), 0.059 for Uranus (84.02 yr) and 0.0299 for Neptune (164.79 yr) — the
figures "about twenty", "almost five", "two fifths" and "3 %" from the school-level version of
this scene match the recalculated values.

## Background

The orbital periods follow from Kepler's third law for the two-body problem
([Orbital elements](thema:bahnelemente)):

$$T^2 = \frac{4\pi^2 a^3}{G\,(M_\odot + m)}$$

with the nominal solar mass parameter $GM_\odot = 1.3271244\cdot10^{20}\,\mathrm{m^3\,s^{-2}}$
under IAU Resolution B3 ([Prša et al. 2016](literatur:prsa-2016)). For a circular orbit this gives
the orbital speed $v=\sqrt{GM_\odot/a}$: Mercury moves at 47.87 km/s, Earth at 29.78 km/s and
Neptune at 5.43 km/s — the school-level version gives "almost 30 km/s" for Earth and "just over
5 km/s" for Neptune, both confirmed.

Seen from the north, all eight planets orbit the Sun in the same, prograde sense, and their orbital
inclinations against the ecliptic stay small, between $0.77^\circ$ (Uranus) and $7.00^\circ$
(Mercury) — both a legacy of the rotating protoplanetary disc from which they formed
([Formation of the Solar System](thema:entstehung)). The mass distribution and architecture that
this top-down view sums up are described in detail by [The Solar System](thema:sonnensystem).

The Sun itself does not really rest in this image: with the positions and masses from Orrery's
data sets, its centre lay between 0.06 and 2.11 solar radii from the barycentre of the Solar
System from 1800 to 2050, 1.21 solar radii on average, 1.07 of that shifted by
[Jupiter](objekt:jupiter) alone (figures as in [Sun](objekt:sun)).

## Model limitations

The camera shows the planets around a Sun resting at the origin, not around the true, wandering
barycentre (above, as [Limits of the model](thema:modell) describes in general); distances are
compressed by different amounts per preset and bodies are enlarged, by the formula given in
"Limits of the model" ([The Solar System](thema:sonnensystem) gives the values). As derived above, the system
radius excludes all dwarf planets, even though several of them leave the catalogue's range and
would, in principle, stand farther out in the image than Neptune. The asteroid and Kuiper belts,
where within the view cone, appear only as synthetic clouds of points without individual orbits.
Every body, as throughout the program, is propagated undisturbed on its Keplerian ellipse — real
mutual perturbations between the planets are absent ([Orbital elements](thema:bahnelemente)).

*As of September 2026*
