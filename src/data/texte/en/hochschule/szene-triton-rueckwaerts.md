# Scene: Triton's retrograde orbit

The camera circles [Neptune](objekt:neptune) at great distance and shows the full orbit of its
largest moon, [Triton](objekt:triton), as an ellipse — oblique enough to make the steeply
inclined, retrograde orbit recognisable as such instead of collapsing it into a line.

## What the view shows

The `orbit` path type (`render/camera/cinema.ts`) keeps the camera on a sphere around Neptune,
with no `lookAtId` — the camera looks at Neptune itself, not at Triton. Radius: 45 displayed
Neptune radii ($R_\mathrm{N}=24\,622\,\mathrm{km}$) times a scatter factor; at 0.8/1.0/1.5 that
is 36/45/67.5 Neptune radii, or 886,392/1,107,990/1,661,985 km. Azimuth is fixed at 123.92° and
keeps advancing at 1°/s (35 s duration, 35° of drift by the scene's end), offset additively by
±20° per draw; elevation is fixed additively between 30° and 60° (base 45° ± 15°).

Triton's orbital radius in the model is 354,766 km (orbital element `a`, epoch J2000), or 14.41
Neptune radii. At scatter factor 0.8, the closest draw, the half-frame width at Neptune's
distance, $d\tan(25^\circ)$ with the half, vertical field of view from `KAMERA_FOV_GRAD` 50°,
comes to about 413,331 km — a margin of 16.5% over Triton's orbital radius; at scatter factor
1.5 the margin grows to 118.5%. The full orbit therefore fits in the frame on every draw.

In the 35 s at 0.4 days per second, 14 simulated days pass; Triton's orbit takes 5.877 days in
the model (from the mean motion; the third Kepler law with Neptune's and Triton's masses matches
the same value to 0.02%) — the scene shows about 2.4 complete orbits.

That the near-circular orbit ($e\approx0.00015$) appears as an ellipse, rather than a circle or a
line, is pure projection geometry: the axis ratio of the apparent ellipse is the absolute cosine
of the angle between the line of sight and the normal of Triton's orbital plane — 0 when looking
within the orbital plane (a line), 1 when looking perpendicular to it (a circle). Rotating
Triton's orbital elements into the ecliptic, an own calculation for elevation 30–60° and the
drawn azimuth range gives an axis ratio between about 0.05 and 0.35 — never a degenerate line,
never a circle.

The retrograde motion itself shows in the sense of revolution: the camera turns with positive
azimuth, the same sense as Neptune's own spin and as every planetary orbit (counterclockwise seen
from the north). Triton's orbital inclination of 156.83° against Neptune's equator — above 90°,
retrograde by definition — instead makes it run backwards in the frame, against Neptune's spin
and against the camera's own slow revolution.

The lighting direction is not arbitrary: from Neptune's heliocentric position at epoch J2000 (own
calculation with `positionAt`: $x=2\,513\,956\,734$, $y=-3\,738\,856\,178$,
$z=19\,059\,249\,\mathrm{km}$), the Neptune–Sun direction works out to azimuth 123.92° and
elevation −0.24° — exactly the scene's fixed base azimuth. Triton's distance from Neptune
(354,766 km) against the Neptune–Sun distance (30.12 au) gives a parallax of
$\arctan(354\,766/4\,505\,484\,129)\approx0.0045^\circ$: the same solar direction therefore
also holds for Triton, and the narrow ±20° scatter range keeps the lit side in the frame.

Without a `lookAtId`, the camera exposes on Neptune itself (`exposureTargetId`); Triton, at
almost the same solar distance, appears similarly bright as a result. As a satellite
(`isSatellite`), Triton's orbit in the image scales with `sizeScale`, not with the distance
compression applied to planetary orbits ([model limitations](thema:modell)).

## Background

Such a steep, retrograde orbital inclination is impossible for a moon that formed together with
its planet from the same disc — regular moons inherit their planet's sense of rotation.
[Triton](objekt:triton) must therefore have been captured, most likely as the survivor of a
binary broken apart from the Kuiper belt; details, timescale and figures are given there. The
retrograde motion has an unusual consequence: tides remove orbital energy from a retrograde moon
instead of adding it — Triton is therefore slowly spiralling in toward Neptune instead of
receding, as most moons do ([Tides](thema:gezeiten)).

The four giant planets together carry about a hundred known irregular moons: captured from
initially heliocentric orbits, with large, often steeply inclined or retrograde orbits, unlike the
nearly circular, low-inclination orbits of the regular moons that formed within the accretion disc
([Jewitt and Haghighipour 2007](literatur:jewitt-2007)). The same paper explicitly groups Triton
with the irregular moons because of its retrograde orbit, but just as explicitly points out that
its large size and small orbital radius set it apart from all the others — a singular case that
accounts for the unusual, stronger capture mechanism described there. Only
[Voyager 2](quelle:nasa-voyager-2) has seen the Neptune system up close, on 25 August 1989
([Stone and Miner 1989](literatur:stone-1989)); everything since has come from Earth, from Hubble
or from JWST.

## Model limitations

- **Orbit fixed, without nodal precession:** `nodeDot` and `lpDot` are set to 0 for Triton; in
  reality the orbital plane precesses about Neptune's Laplace pole, as
  [Orbital elements](thema:bahnelemente) describes.
- **Fixed pole**, without the large periodic terms of the IAU report, as
  [Axial tilt](thema:achsneigung) describes for Neptune and Triton.
- **Sphere without oblateness.**
- **No Neptune rings and none of Neptune's other moons** (Nereid, Proteus and others) in the
  catalogue.
- **Exposure set on Neptune** (`render/exposure.ts`): Neptune appears at the reference daylight
  level, though it really receives only about 1/907 of Earth's irradiance (own calculation at
  epoch J2000; for 17 September 2026, [Albedo and brightness](thema:photometrie) gives 1/883) —
  the same compensation applied to any camera target.
- **Scale:** further simplifications in [Model limitations](thema:modell).

*As of September 2026*
