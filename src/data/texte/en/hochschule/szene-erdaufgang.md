# Scene: Sunrise over the limb of the Earth

The camera circles close above the [Earth](objekt:earth) and always looks at its centre.
The comment in the dataset names the intent: the [Sun](objekt:sun) is meant to slide across
the edge in grazing light.

## What the view shows

Without variation the camera stands 2.4 displayed Earth radii from the centre (in the
"Diagram" scale 764,520 km in the model's world coordinates, 15,290 km in real terms — the
radius and the distance carry the same scale factor, so the view of the Earth corresponds to
the sight from 2.4 true Earth radii), 6° above the ecliptic (elevation against the plane of
the ecliptic, not against its normal), and its azimuth drifts at 1.2° per second, hence by
48° over the 40 s of the scene. There is no separate look-at target (`lookAtId` is unset);
the camera therefore always looks at the Earth's centre, regardless of azimuth and
elevation — checked in code across 20,000 draws without exception.

Each playback varies the azimuth over the full circle, the elevation between 2° and 16°
(base 6° plus −4° to 10°) and the distance by a factor of 0.9 to 1.3, hence between 2.16 and
3.12 Earth radii. In a vertical field of view of 50° the Earth subtends
$2\arcsin(1/2.4) = 49.2^\circ$ without variation, and 37.4° to 55.2° with it: at the closest
distance the globe already extends beyond the edge of the frame vertically (horizontally
the field reaches ±39.6° at 16:9, where the globe still stays in frame).

Over the 40 s the globe turns by 288.8° on its own axis (0.8 model days at a rotation
period of 23.9345 h); relative to the camera, whose azimuth moves by only 48°, that is
240.8°, hence 0.67 revolutions — the surface sweeps noticeably past under the camera during
this time. The terminator, by contrast, hangs on the barely-moving direction of the Sun
(0.8 model days turn it by only about 0.8°) and so moves relative to the camera mainly with
the camera's own 48°, not with the surface's 240.8°.

Whether the Sun itself appears in the frame depends on the date, azimuth, elevation and
distance: across 200,000 random draws of these four quantities and the scene time (with the
clock running), its disc can be seen at all in only about 14% of the draws (centre in frame,
disc not entirely behind the Earth); in about 6% of all draws only a remnant clipped by the
Earth's edge is left — the grazing light the scene's name promises. The terminator itself,
by contrast, appears far more often: it lies on the cap of the Earth visible from the camera
in a good three quarters of the draws (77.5%). Mostly, then, the scene shows the transition
from day to night, but without the Sun itself in the frame.

## Background

Sunrise or sunset is defined to occur when the centre of the solar disc reaches a geometric
zenith distance of 90°50′ — the 50′ excess over 90° is the sum of the mean horizontal
refraction (34′) and the Sun's semidiameter (16′); the same geometric convention grades
twilight: civil, nautical and astronomical twilight begin in the morning and end in the
evening when the centre of the Sun is geometrically 6°, 12° and 18° below the horizon
respectively ([U.S. Naval Observatory 2026](literatur:usno-2026)). The 34′ are an average
value; the actual refraction depends on the local air temperature and pressure. Bennett's
approximation formulas stay accurate over a wide range of temperature and pressure and may
for all practical purposes be considered equivalent to the refraction tables of the Nautical
Almanac ([Bennett 1982](literatur:bennett-1982)). Because refraction increases as altitude
falls, it lifts the lower edge of the solar disc more than the upper one: near the horizon
the disc looks flattened, an optical effect and not a real one.

At the Earth's edge itself, Rayleigh scattering mixes with the weak absorption of ozone in
the visible Chappuis band: according to model calculations for the zenith sky at twilight,
without ozone it would be greyish green-blue at sunset and yellowish in twilight within a
few degrees of solar depression, whereas with ozone it stays blue
([Hulburt 1953](literatur:hulburt-1953)) — the same combination presumably also colours the
narrow, sunlit band above the Earth's edge in orbital photographs blue to violet.

Independent of the scene's time-lapse, one circular orbit at 400 km altitude above a sphere
of the mean Earth radius, with $r = R_\oplus + 400\,\mathrm{km}$, takes

$$T = 2\pi\sqrt{\frac{r^3}{GM_\oplus}}$$

about 92.4 min ($R_\oplus$ from the dataset,
[NSSDC Earth Fact Sheet](quelle:nssdc-earth); $GM_\oplus$ from the IERS table,
[Petit and Luzum 2010](literatur:petit-2010)). That is about 15.6 orbits, and just as many
sunrises and sunsets, per day — close to the 16 of the school-level version, which rounds to
90 minutes and 16. This real quantity has nothing to do with the scene's arbitrary camera
path (1.2° of azimuth per second).

The Earth's [axial tilt](thema:achsneigung) determines the terminator's orientation: it
stands perpendicular to the direction of the Sun at all times, not to the rotation axis, and
so tilts against the meridians as the subsolar point migrates between the tropics over the
course of a year; only at the equinoxes does it run through the poles.

## Model limitations

- **No atmosphere, no clouds:** the only Earth texture is an albedo map in three resolution
  levels (`public/textures/earth/albedo-{1024,2048,8192}.ktx2`); there is no cloud or
  atmosphere layer, no refractive bending at the edge, no twilight colours, no Chappuis band
  and no airglow. The terminator follows the Lambertian part of the material times $1-F$
  (the Fresnel factor) plus the
  night-side fill light — by default a quarter of the day level, applied over the whole
  visible disc and hence on the day side too; the flattened solar disc from the Background
  section is likewise absent.
- **Fixed rotation:** Orrery rotates the Earth uniformly with the sidereal period 23.9345 h
  from a fixed zero point at right ascension 0°
  ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)), without precession, nutation or polar
  motion; the map's prime meridian is therefore offset from the
  [Earth rotation angle](thema:bezugssysteme) — by 75.4° on 17 September 2026, as derived in
  the "In the model" section of `objekt-earth`, and unchanged at 75.4° on 20 September 2026
  (drift about 0.0004° per day). Day and night therefore lie over the wrong longitudes.
- **Solar disc:** how large the Sun appears depends on the display scale, not only on
  distance (for the radius factor and its cause see `objekt-sun`): seen from the camera's
  actual position, its angular diameter in "Diagram" varies with date and azimuth between
  about 9.2° and 9.5° instead of the true roughly 0.53° — about 17.5 times too large — and
  correspondingly about 40 times too large in "Compact"; only "Realistic" shows close to the
  true size.
- **Exposure and tone mapping:** the camera exposes for the Earth as its target
  ([Photometry](thema:photometrie)): a white Lambert surface at the target would reach the
  linear reference value 1 under perpendicular light, without the Fresnel factor and without
  fill light; the day side of the Earth map stays below that with its own reflectance, while
  the night side carries only the fill light, a quarter of the day level, and accordingly
  sits darker in the image after the ACES tone curve. Image brightnesses are therefore not
  measured quantities. The self-luminous Sun is unaffected by this target exposure, but not
  by the ACES curve; only its bloom halo additionally depends on the displayed radius.
- **Time-lapse:** at the start of the scene it glides geometrically over 2 s from the value
  of the previous scene to the nominal rate of 0.02 days per second. Because this nominal
  rate is itself among the lowest in the catalogue, its origin has an outsized effect:
  depending on the predecessor — the catalogue ranges from 0.0035 to 30 days per second — at
  60 frames per second and with a scene change that falls exactly on a frame, between 0.80
  (the nominal rate itself) and about 3.49 days pass in the 40 s, and the globe turns
  correspondingly between 0.80 and 3.50 times on its own axis. Further simplifications:
  [limits of the model](thema:modell).

*As of September 2026*
