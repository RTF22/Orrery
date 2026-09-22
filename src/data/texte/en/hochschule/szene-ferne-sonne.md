# Scene: From Neptune to the distant Sun

The camera stands near [Neptune](objekt:neptune) and looks steadily toward the
[Sun](objekt:sun) — the scene shows how small and faint the star that Neptune too orbits looks
from the outer reaches of the Solar System.

## What the view shows

The `static` path type (`render/camera/cinema.ts`) keeps the camera fixed at Neptune;
`lookAtId: 'sun'` points the view permanently at the Sun. Radius: 12 displayed Neptune radii
($R_\mathrm{N}=24\,622\,\mathrm{km}$) times a scatter factor; at 0.9/1.0/1.5 that is
265,918/295,464/443,196 km. Elevation is fixed additively between 5° and 40° (base 15°,
asymmetric −10°/+25°), azimuth fixed additively between 80° and 160° (base 120°, symmetric
± 40°); the rate is 0, so the image does not drift over the 30 s duration.

Because the camera stands only a few hundred thousand kilometres from Neptune, against a
4.5-billion-km Neptune–Sun distance, the viewing direction toward the Sun alone decides where
Neptune ends up in the frame — and that is nowhere: an own grid search over the whole drawn
azimuth/elevation range gives values between 123° and about 175° for the angle between the line of
sight (camera→Sun) and the direction camera→Neptune. That is well above 90° on every draw, and
so well above even the more generous horizontal half field of view of 39.7° (16:9 at
`KAMERA_FOV_GRAD` 50°, the vertical half field is only 25°) — Neptune is not at the edge of the
frame, it is simply behind the camera. The scene shows literally only the view from Neptune's
location toward the distant Sun, not Neptune itself.

The Sun's real angular diameter from here is about 64″ (own calculation with the Neptune–Sun
distance of 4,505,484,129 km at epoch J2000: 63.7″; [the Sun](objekt:sun) gives 64″, rounded); its
light takes a good four hours to reach Neptune from there (own calculation:
$4\,505\,484\,129\,\mathrm{km}/299\,792.458\,\mathrm{km\,s^{-1}}=4.17\,\mathrm{h}$). The
nominal solar constant of 1361 W/m² at 1 au ([Kopp and Lean 2011](literatur:kopp-2011) measured
$1360.8\pm0.5\,\mathrm{W\,m^{-2}}$ at the 2008 minimum) works out to only 1.50 W/m² at Neptune's
distance of 30.12 au — one nine-hundred-and-seventh of Earth's (own calculation; for
17 September 2026, [Albedo and brightness](thema:photometrie) gives the ratio used in the model
as 1/883). With the peer-reviewed solar brightness $m_\odot=-26.75$ (1 au, V band) from the same
text, the Sun's apparent magnitude from Neptune follows as
$m=-26.75+5\log_{10}(30.12)=-19.36$ — about 440 times brighter than the full moon seen from Earth
(−12.74, NSSDC Moon Fact Sheet).

In the 30 s at 0.5 days per second, 15 simulated days pass: at a $16.11\,\mathrm{h}$ rotation
period ([Neptune](objekt:neptune)), that is 22.3 rotations; on its orbit, Neptune moves only about
0.09° further in that time (Kepler orbital period 164.9 years), barely 7.05 million km or
0.047 au — vanishingly small against its 4.5-billion-km orbital radius.

## Background

Neptune's light budget hangs almost entirely on this one nine-hundredth of sunlight. So far only
[Voyager 2](quelle:nasa-voyager-2) has seen Neptune up close, on
25 August 1989. Its sister ship Voyager 1, already far outside the planetary orbits, looked back
once more on 14 February 1990: the imaging sequence of the "family portrait" began, of all places,
at Neptune, the faintest target, and worked its way from there toward the Sun
([First-Ever Solar System Family Portrait](quelle:nasa-family-portrait)) — the same direction of
view this scene shows.

Voyager 2 itself flew on past Neptune and, on 5 November 2018 at 119 au, crossed the
heliopause — the boundary where the solar wind gives way to the interstellar medium
([Stone et al. 2019](literatur:stone-2019)). That is almost four times Neptune's own solar
distance: the Sun's influence reaches far beyond the planetary orbits, just no longer as visible
light.

## Model limitations

- **Sun enlarged:** in "Diagram" it appears 1.2° across instead of 64″
  ([the Sun](objekt:sun)) — about 68 times too large (own calculation).
- **Exposure follows the Sun, not Neptune:** because `lookAtId` is set, `exposureTargetId`
  returns the Sun here; since it always sits at the coordinate origin, that yields the reference
  value for 1 au (factor $\pi$, own calculation). Unlike most other scenes in this stage, where
  the body the camera looks at appears at exactly the reference level, Neptune would work out to
  only about 13% of that under this exposure (own calculation; matches the formula
  $E^{1-0.7}$ used in [Albedo and brightness](thema:photometrie)) — irrelevant in practice,
  because Neptune lies outside the frame anyway (see "What the view shows").
- **No scattering, no glare** beyond the bloom pass (`render/postfx.ts`): only objects on the
  bloom layer get the extra glow; no atmospheric or optical scattering model exists.
- **Star background without real luminosities:** catalogue magnitude only sets point size and,
  via the B–V index, colour (`render/starfield.ts`), not a physically exposed brightness the way
  the bodies get.
- **Scale:** in "Diagram", `sim/scale.ts` compresses Neptune's true 30-au distance from the Sun
  with $r^{0.6}$; the camera's distance from Neptune itself is unaffected by this, further
  simplifications in [Model limitations](thema:modell).

*As of September 2026*
