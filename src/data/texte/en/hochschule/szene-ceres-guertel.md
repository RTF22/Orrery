# Scene: Ceres in the asteroid belt

The camera orbits [Ceres](objekt:ceres) at close range: path type `orbit`, target body `ceres`,
base distance 6 Ceres radii with scatter factor 0.8 to 1.5, elevation 5° to 25° (base
15° ± 10°), azimuth drawn over the full circle and drifting at 1°/s, duration 30 s, time-lapse
rate 0.02 days per second (`src/data/scenes.ts`). Unlike the distant orbits around Neptune or
the Uranus system, this is a pure close flight around the largest body of the main belt between
[Mars](objekt:mars) and [Jupiter](objekt:jupiter), surrounded by the synthetic point cloud of
the belt model.

## What the view shows

The camera distance scales with `scaledRadius`, i.e. with the same `sizeScale` factor as Ceres
itself: at "Realistic" (sizeScale 1) it is 2255/2818/4227 km, at "Diagram" (sizeScale 50, the
default) 112,728/140,910/211,365 km, and at "Compact" (sizeScale 200) 450,912/563,640/845,460
km, for scatter factors 0.8/1/1.5 respectively (derivation). Because radius and distance grow by
the same factor, Ceres' angular diameter $2\arcsin(1/(6f))$ stays the same across every preset:
$24.05^\circ$ at $f=0.8$, $19.19^\circ$ at $f=1$ and $12.76^\circ$ at $f=1.5$ (derivation) —
comfortably within the vertical field of view of $50^\circ$ (`KAMERA_FOV_GRAD`,
`render/renderer.ts`).

Over the 30 seconds, at 0.02 days per second, 0.6 simulated days pass; with the rotation period
of $9.074170\,\mathrm{h}$ ($0.378090\,\mathrm{d}$) that amounts to about $1.587$ rotations
(derivation) — a calm, clearly resolvable spin without the stroboscopic jumps a larger time-lapse
rate would produce here. The camera itself drifts independently by $30^\circ$
($1^\circ/\mathrm{s} \times 30\,\mathrm{s}$).

Because the base azimuth of every draw is scattered over the full circle, the angle between the
camera direction and the Sun direction covers nearly the whole possible range: on 22 September
2026 Ceres stands at $2.680\,\mathrm{AU}$, with the direction to the Sun at elevation
$-0.32^\circ$ (own calculation from `positionAt`); combined with the camera elevation of
$5^\circ$ to $25^\circ$, a grid search over all azimuth differences gives a phase angle between
$5.32^\circ$ (camera close to the Sun direction, near-full phase) and $175.32^\circ$ (camera
nearly opposite, Ceres nearly unlit) — lighting and viewing geometry therefore differ markedly
from draw to draw.

Whether belt particles appear in the frame depends strongly on the drawn direction: because
Ceres itself sits inside the thin belt disc, a viewing cone with a $25^\circ$ half-angle (half
the vertical field of view) captures, depending on the drawn azimuth and elevation, between
roughly 130 and roughly 14,000 of the 50,000 "high"-quality particles (own calculation from
`sim/belts.ts` and `render/belts.ts`, a sample over eight azimuths and three elevations);
directions close to the belt plane (elevation $5^\circ$) capture markedly more than those near
the edge of the scatter range ($25^\circ$). Almost all captured particles are not close
neighbours of Ceres, but spread across nearly the whole width of the main belt (in one sample,
from $a = 2.107$ to $3.299\,\mathrm{AU}$) — the camera-Ceres distance of a few thousand
kilometres is negligible against the extent of the belt, so any visible particles form a
scattered dust field in the background rather than a dense neighbourhood around Ceres. The 3:1
and 5:2 Kirkwood gaps, between which Ceres lies, remain invisible at this close range: because
the eccentricity of the population spreads each particle over a range of heliocentric distances
wider than the narrow gaps themselves, the underlying density dip vanishes once particles are
sorted by their actual solar distance instead of by semi-major axis
([Kirkwood gaps](thema:kirkwood-luecken)); the sample above confirms this further, since the
particles captured in the viewing cone cover almost the entire semi-major-axis range of the
belt instead of being confined to a narrow band corresponding to a single gap.

Without a `lookAtId`, the camera exposes on Ceres itself (`blickzielVon`,
`render/camera/cinema.ts`; `render/exposure.ts`): on 22 September 2026, Ceres at
$2.680\,\mathrm{AU}$ receives only about $13.9$ percent, i.e. $1/7.2$, of Earth's irradiance
(derivation); the model fully compensates for this, so Ceres always appears at the reference
level regardless of its solar distance (exposure factor about $4.48$ under the default
"Diagram" preset, about $5.68$ under "Realistic", depending on the displayed distance; own
calculation with `targetExposure`). Even without this target exposure, under the standard
settings Ceres already reaches a day-side level of $0.571$ at the J2000 epoch (own calculation,
matching the regression bound in `render/lighting.test.ts`) — well above the threshold at which
a body would stay dark in the image.

## Background

Ceres is the most massive body of the main belt and carries about 39 percent of its total mass
([Ceres](objekt:ceres)); its orbit lies between the 3:1 (at $2.50\,\mathrm{AU}$) and 5:2 (at
$2.82\,\mathrm{AU}$) Kirkwood gaps, closer to the outer one
([Kirkwood gaps](thema:kirkwood-luecken)). Unlike the densely packed asteroid fields of some
films, the real main belt is nearly empty: on average, some $965600\,\mathrm{km}$ separate
neighbouring asteroids, out of an estimated 700,000 to 1.7 million bodies larger than 1 km
across the whole belt; probes have crossed it without deliberate avoidance manoeuvres since the
Pioneer and Voyager missions, with an estimated collision probability of less than one in a
billion ([Asteroid belt](quelle:wikipedia-en-asteroid-belt)). The only close-up observation of a
main-belt body remains NASA's Dawn spacecraft, which orbited Ceres from March 2015 until it ran
out of fuel in October 2018 ([Russell et al. 2016](literatur:russell-2016)).

## Model limitations

In the model, Ceres is a sphere without its real polar flattening of about 7.5 percent, derived
from its shape figure; the texture is, per `ASSETS.md`, a "fictional" map, not a rendering of
the real Dawn mapping (both [Ceres](objekt:ceres)). The belt itself is a synthetic point cloud
with fixed orbital elements — only the mean anomaly advances — with built-in rather than
dynamically formed Kirkwood gaps, a uniform albedo of 0.06 for every particle, and a fixed point
size of about one screen pixel, enlarged up to fourfold near the camera; the size of real
asteroids, collisions between particles and any resonance dynamics are entirely absent. Ceres
itself carries no exosphere in the model. The display's distance compression changes the
absolute kilometre values of the camera distance between presets, but changes neither Ceres'
angular diameter nor the number of belt particles captured in the viewing cone appreciably (own
calculation: a compression exponent of $k=1$ against $k=0.6$ gave comparable particle counts
for the same viewing direction). Further simplifications: [Model limitations](thema:modell).

*As of September 2026*
