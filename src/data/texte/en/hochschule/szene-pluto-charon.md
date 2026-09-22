# Scene: Pluto and Charon, a double world

The camera orbits [Pluto](objekt:pluto) at a large distance while [Charon](objekt:charon) stays
visible on its orbit: path type `orbit`, target body `pluto`, base distance 55 Pluto radii with a
scatter factor of 0.8 to 1.5, elevation 10° to 30°, azimuth 50.5° to 90.5° with a drift of 1.5°/s,
duration 45 s, time rate 0.3 days per second (`src/data/scenes.ts`). Together they form the best-
known doubly synchronous pair in the solar system, permanently showing each other the same side
([Tidal locking](thema:gebundene-rotation)); on 14 July 2015 New Horizons flew past both as the
only spacecraft to do so to date ([Stern et al. 2015](literatur:stern-2015)).

## What the view shows

At scatter factor 0.8/1/1.5 the camera stands $52\,285$/$65\,357$/$98\,035\,\mathrm{km}$ from Pluto
(44/55/82.5 Pluto radii, $R_\mathrm{Pluto} = 1188.3\,\mathrm{km}$; derivation). Charon's orbital
radius of $19\,596\,\mathrm{km}$ then equals $16.49$ Pluto radii; its angular distance from the
center of the image ranges from $20.55^\circ$ at scatter factor 0.8 to $11.30^\circ$ at 1.5
(derivation) — against the camera's half field of view of $25^\circ$ (field of view $50^\circ$,
`render/renderer.ts`), the whole orbit stays safely inside the frame in every draw, tightest at
scatter factor 0.8, where half the image height is about $24\,400\,\mathrm{km}$. In the 45 seconds,
at 0.3 days per second, $13.5$ simulated days pass — about $2.11$ orbits of Charon (orbital period
$6.387\,\mathrm{d}$, derivation); the camera itself drifts independently of that by $67.5^\circ$
($1.5^\circ/\mathrm{s} \times 45\,\mathrm{s}$). Because both bodies rotate with exactly this
orbital period (rotation period $153.29335\,\mathrm{h}$), the same map region of each body faces
the other throughout the whole run — visible in that the New Horizons mosaics on Pluto and Charon
turn in the image in lock-step, so that the camera is never shown an unknown hemisphere of either
body.

The camera looks roughly from the direction of the Sun: from Pluto's own orbital elements, an
independent recalculation with `positionAt` at J2000 gives a heliocentric distance of
$30.20\,\mathrm{AU}$ and a Pluto-to-Sun direction at azimuth $70.495^\circ$ and elevation
$-11.17^\circ$ — close to the scene's base azimuth of $70.5^\circ$. Charon's own offset of
$19\,596\,\mathrm{km}$ produces a parallax to the Sun of only about $0.00025^\circ$, geometrically
insignificant (derivation). Between elevations of 10° and 30° and up to 20° of azimuth deviation
from that base direction, the phase angle ranges from about $21^\circ$ to $41^\circ$, reaching
about $45^\circ$ with the full azimuth scatter (derivation) — both bodies appear as clearly lit,
slightly gibbous discs, never as a crescent.

Whether Charon casts a shadow on Pluto or the other way around is re-evaluated by the model every
frame (`waehleOkkluder`, `render/shadows.ts`): for Pluto, Charon is the only possible occluder, and
for Charon only Pluto (`MAX_OKKLUDER = 4` stays unused here). A hit, though, requires the Sun to be
near the plane in which Charon orbits Pluto — Pluto's equatorial plane. An independent recalculation
of the angle between the Sun direction and that plane gives $25.5^\circ$ at J2000 and already
$60.0^\circ$ as of this text (September 2026), close to the extreme value of $60.4^\circ$ that
follows from Pluto's roughly $120^\circ$ obliquity, which the model reaches around the year 2030
(derivation). The next zero crossing, the model's next equinox with a possible shadow, does not
follow until around the year 2110. At the present time, the scene therefore practically never shows
a shadow of either body on the other.

## Background

Pluto and Charon are the best-known doubly synchronous pair in the solar system
([Tidal locking](thema:gebundene-rotation)): both rotate with Charon's orbital period, an end state
that tidal calculations reproduce starting from an eccentric state after an impact
([Cheng et al. 2014](literatur:cheng-2014)). Their common barycenter lies about
$2126\,\mathrm{km}$ (1.79 times Pluto's radius) from Pluto's center, outside its surface
([Pluto's parameters](objekt:pluto)). Charon probably formed in an oblique impact of a body nearly
as large as Pluto itself — the older interpretation has an intact, water-rich debris body that
circularizes and migrates outward ([Canup 2005](literatur:canup-2005)), while a newer one has the
two bodies briefly lock together and separate again before merging completely ("kiss and capture",
[Denton et al. 2025a](literatur:denton-2025a)). Charon's conspicuous red north polar cap, Mordor
Macula, forms from methane escaping Pluto's thin atmosphere, freezing out as ice at the cold pole
and being photolyzed there into reddish tholins
([Grundy et al. 2016](literatur:grundy-2016)). From 1985 to 1990 the two bodies mutually occulted
and eclipsed each other as seen from Earth ([Eclipses](thema:finsternis)) — so far the only observed
series of this kind for this pair; no new window is predicted for this system
([Proudfoot et al. 2026](literatur:proudfoot-2026)). New Horizons on 14 July 2015 remains the only
spacecraft to have visited both bodies to date.

## Model limitations

In the model, Pluto stays fixed at the origin of its system instead of wobbling around the true
barycenter with Charon's orbital period. At a camera distance of 55 Pluto radii, that real wobble
would correspond to an angle of about $1.86^\circ$ — 1.79 times Pluto's own angular radius at that
distance ($1.04^\circ$), because at the same camera distance both quantities translate into an
angle in the same ratio as the linear barycenter distance to the planet's radius (derivation). In
the image, only Charon therefore visibly moves while Pluto stays still. The four small moons Styx,
Nix, Kerberos and Hydra are missing from the catalog, as is any atmosphere or haze on Pluto. Without
a `lookAtId`, the camera exposes on Pluto itself (`render/exposure.ts`); the true irradiance at
Pluto's simulated solar distance of about $35.6\,\mathrm{AU}$ (as of this text) is only about
$1/1270$ of Earth's — the model fully compensates for that and always shows Pluto at the same
brightness level as any other body. Both poles stay fixed, and there is no ongoing
[tidal evolution](thema:gezeiten). As a heliocentric dwarf planet, Pluto scales with the display's
distance compression, while Charon, as a satellite, scales with `sizeScale` like any other moon.
Further simplifications: [Model limitations](thema:modell).

*As of September 2026*
