# Scene: Low pass over Phobos

The camera locks onto [Phobos](objekt:phobos), keeps its distance for the whole scene, and looks
not at Phobos itself but at [Mars](objekt:mars) — of the catalogue's two `chase` scenes, the only
one whose look target differs from the body it follows.

## What the view shows

The `chase` path anchors the camera behind the body, opposite its velocity vector, and raises it
additionally, purely vertically, by `radius · sin(elevation)` (`render/camera/cinema.ts`); the
reference quantity for the distance is the displayed Phobos radius (`distanceBasis: 'bodyRadius'`,
`distanceInRadii: 4`), elevation varies between 8° and 28°, and the distance factor between 0.8 and
1.5 (`data/scenes.ts`). Unlike the catalogue's other `chase` scene, `lookAtId` sets the look target
to Mars instead of Phobos itself: the camera does not show the moon it follows, but flies along
with it.

The scene's code comment claims that Phobos lies outside the frame almost the whole time — this can
be checked. Across a full Phobos orbit, the full spread of elevation and distance factor, and all
three scale presets, the angle between the line of sight to Mars and the direction to Phobos stays
between $32.7^\circ$ and $147.0^\circ$ — consistently above half the vertical field of view of
$25^\circ$ (`KAMERA_FOV_GRAD = 50`, `render/renderer.ts`). Phobos itself therefore never enters the
picture, because the orbital-velocity direction the camera follows runs nearly at right angles to
the line of sight toward Mars. These angles are practically identical across all three presets
(differing only from the tenth decimal place on), because `scaledPositionAt` scales Phobos'
distance from Mars and the camera offset alike, uniformly, with `sizeScale` (`sim/scale.ts`) — the
picture looks the same in Realistic, Diagram and Compact.

Mars, in turn, fills much of the frame: its angular diameter, across the same orbital phases and
variation, ranges from $41.8^\circ$ to $43.0^\circ$, and is $41.9^\circ$ at the scene's baseline
values (elevation 8°, factor 1) — close to the 42° given in the secondary-school text. Seen from
Phobos itself at the same instant it is likewise $41.9^\circ$, because the camera's offset of only
about 44 km barely matters next to the roughly 9488 km separation between Mars and Phobos on that
day, near apoapsis; the camera accordingly stands about 6087 km above the Martian surface (Mars
radius 3389.5 km, [NSSDC fact sheet](quelle:nssdc-mars)) — slightly below Phobos' own height on
that day (about 6098 km).

The scene runs at 0.05 days per second for 25 seconds, making 1.25 simulated days: within it Phobos
orbits Mars about 3.9 times (orbital period 7.65384 h), while Mars turns through 1.22 rotations
($438.6^\circ$, rotation period 24.6229 h). As with every scene change, the time-lapse rate first
glides geometrically onto its target value over two seconds (`RATE_BLEND_SEC`, `app/cinema.ts`).

## Background

Phobos orbits Mars at 9375 km, well inside the synchronous orbit: from Mars' model GM and rotation
period (see [Mars](objekt:mars)) that radius works out to about 20,428 km; [Deimos](objekt:deimos)
orbits at 23,457 km, just beyond it, and is slowly drifting outward instead of falling. Because
Phobos orbits faster than Mars rotates, it rises in the west and sets in the east as seen from the
surface, on average about every 11.1 hours. Its
[rotation is tidally locked](thema:gebundene-rotation); tides simultaneously pull it slowly inward,
with the orbit sinking by about 3.8 cm per year
([Brozović et al. 2025](literatur:brozovic-2025); derivation under [Tides](thema:gezeiten)) — from
this tide alone, about 29 to 43 million years pass until impact, while the real disruption at the
Roche limit sets in earlier, at 20 to 40 million years (details at [Phobos](objekt:phobos)).

Seen from the Martian surface, Phobos regularly transits the Sun without ever covering it
completely: it subtends only $0.106^\circ$ in angular radius against the Sun's $0.175^\circ$ and
covers a good third of its disc, for 20 to 35 seconds ([Eclipses](thema:finsternis)). At night, its
Mars-facing side additionally receives faint Mars-light, similar to earthshine on the waxing Moon.
Surveying the [Martian moons](quelle:nasa-marsmonde) at close range was a core task of the probe
[Mars Express](quelle:esa-mars-express), whose flybys pinned down Phobos' mass and shape.

## Model limitations

- **Spherical shape:** 11.1 km radius instead of the semi-axes 13.0 / 11.4 / 9.1 km (+17.1 %,
  +2.7 %, −18.0 %), as described for [Phobos](objekt:phobos); Stickney and the grooves are absent.
- **Orbit:** a fixed Kepler ellipse in the `parentEquator` reference (the Martian equator, see
  [Mars](objekt:mars)), without the orbital decay described above — Phobos stays at 9375 km.
- **Exposure:** the camera exposes on the look target, here Mars, because the scene sets
  `lookAtId: 'mars'` (`exposureTargetId`, `render/exposure.ts`).
- **No Mars-light:** the lighting model (`render/lighting.ts`) computes only sunlight plus a fixed
  night-side fraction for each body; light from Mars onto Phobos, or the reverse, is not included,
  unlike the real effect named above.
- **Shadow:** unlike the moonless Mercury, Mars always counts as a possible occluder for its moons
  (`waehleOkkluder`, `render/shadows.ts`); whether the real solar geometry actually casts Mars'
  umbra onto Phobos in a given frame is computed per pixel and is not specifically staged in this
  scene.
- **Time-lapse:** at the start of the scene it glides geometrically over two seconds to the nominal
  value (see above). Further simplifications: [limits of the model](thema:modell).

*As of September 2026*
