# Scene: Sunrise over the limb of the Earth

The camera circles close above the [Earth](objekt:earth) and always looks at its centre,
while the [Sun](objekt:sun) stands somewhere in the frame; the identifier `erdaufgang`
("earthrise") is historical — what is shown is the terminator seen up close.

## What the view shows

Without variation the camera stands 2.4 Earth radii from the centre, 6° above the ecliptic
(elevation against the ecliptic normal, not against an observer's horizon), and its azimuth
drifts at 1.2° per second, hence by 48° over the 40 s of the scene. There is no separate
look-at target (`lookAtId` is unset); the camera therefore always looks at the Earth's
centre, regardless of azimuth and elevation — checked in code across 20,000 draws without
exception.

Each playback varies the azimuth over the full circle, the elevation between 2° and 16°
(base 6° plus −4° to 10°) and the distance by a factor of 0.9 to 1.3, hence between 2.16 and
3.12 Earth radii. In a vertical field of view of 50° the Earth subtends
$2\arcsin(1/2.4) = 49.2^\circ$ without variation, and 37.4° to 55.2° with it: at the closest
distance the globe already extends beyond the edge of the frame.

Over the 40 s the globe turns by 288.8° on its own axis (0.8 model days at a rotation
period of 23.9345 h), while the camera's azimuth moves by only 48° — the globe very nearly
laps the camera once, and what the scene's name promises is less a lingering sunrise than
the day–night boundary sweeping past underneath the camera.

Whether the Sun itself appears in the frame depends strongly on the date and the drawn
azimuth: across a grid of 73 dates over a year, all azimuths in 5° steps, four elevations
and three points in the scene (63,072 cases), the direction to the Sun lies within half the
field of view (25°) of the boresight in only about 13% of cases. Mostly the scene shows an
ordinary day or night side without grazing light at the edge, despite its name.

## Background

Sunrise or sunset is defined to occur when the centre of the solar disc reaches a geocentric
zenith distance of 90°50′ — the sum of the mean horizontal refraction (34′) and the Sun's
semidiameter (16′). Civil, nautical and astronomical twilight use the same zenith distance
at 96°, 102° and 108° respectively, that is 6°, 12° and 18° below the horizon
([U.S. Naval Observatory 2026](literatur:usno-2026)). The 34′ are a mean value: formulas
such as Bennett's depend explicitly on air temperature and pressure and are equivalent to
the Nautical Almanac's tables only for the mean state
([Bennett 1982](literatur:bennett-1982)) — at the real horizon, refraction varies with the
temperature profile of the lowest layer of air. Because it increases as altitude falls, it
lifts the lower edge of the solar disc more than the upper one: near the horizon the disc
looks flattened, an optical effect and not a real one.

At the Earth's edge itself, Rayleigh scattering mixes with the weak absorption of ozone in
the visible Chappuis band: according to model calculations of twilight, without ozone the
sky would tip into greenish yellow within a few degrees of solar depression, whereas with it
it stays blue ([Hulburt 1953](literatur:hulburt-1953)) — the same combination presumably
also colours the narrow, sunlit band above the Earth's edge in orbital photographs blue to
violet; in addition, the upper atmosphere glimmers faintly as airglow.

Independent of the scene's time-lapse, one circular orbit at 400 km altitude above a sphere
of the mean Earth radius, with $r = R_\oplus + 400\,\mathrm{km}$, takes

$$T = 2\pi\sqrt{\frac{r^3}{GM_\oplus}}$$

about 92.4 min ($GM_\oplus$ and $R_\oplus$ as in the data panel:
[Petit and Luzum 2010](literatur:petit-2010); [NSSDC Earth Fact Sheet](quelle:nssdc-earth)).
That is about 15.6 orbits, and just as many sunrises and sunsets, per day — close to the 16
of the school-level version of this scene, which rounds to 90 minutes and 16. This real
quantity has nothing to do with the scene's arbitrary camera path (1.2° of azimuth per
second).

That the terminator appears as a band at all, rather than a semicircle running through the
poles, is due to the Earth's [axial tilt](thema:achsneigung): it stands perpendicular to the
direction of the Sun, not to the rotation axis, and migrates with the Sun's declination
between the tropics over the course of a year.

## Model limitations

- **No atmosphere, no clouds:** the only Earth texture is an albedo map
  (`public/textures/earth/albedo.jpg`); there is no cloud or atmosphere layer, no refractive
  bending at the edge, no twilight colours, no Chappuis band and no airglow. The terminator
  follows only the Lambertian part of the material plus the night-side fill light, by
  default a quarter of the day level (`nightFill = 0.25`); the flattened solar disc from the
  Background section is likewise absent.
- **Fixed rotation:** Orrery rotates the Earth uniformly with the sidereal period 23.9345 h
  from a fixed zero point at right ascension 0°
  ([NSSDC Earth Fact Sheet](quelle:nssdc-earth)), without precession, nutation or polar
  motion; the map's prime meridian is therefore offset from the
  [Earth rotation angle](thema:bezugssysteme) — by 75.4° on 17 September 2026, as derived in
  the "In the model" section of `objekt-earth`, and unchanged at 75.4° on 20 September 2026
  (drift about 0.0004° per day). Day and night therefore lie over the wrong longitudes.
- **Solar disc:** how large the Sun itself appears depends on the display scale, not only on
  distance: its displayed radius carries the `sunDamping` reduction, but the full
  `sizeScale` on top of it. At the default scale "Diagram" (`sizeScale` 50, `sunDamping`
  0.35) the Sun subtends 9.31° on 20 September 2026 instead of the true 0.53° — 17.6 times
  too large, matching the 9.3° given in `objekt-sun` — and at the "Compact" scale (200/0.2)
  as much as 21.40°, 40.3 times too large; only "Realistic" shows close to the true size. The
  self-luminous Sun carries no lighting
  material and is unaffected by the target exposure ([Photometry](thema:photometrie)); only
  its bloom halo depends on the same radius.
- **Time-lapse:** at the start of the scene it glides geometrically over 2 s from the value
  of the previous scene to the nominal rate of 0.02 days per second. Because this nominal
  rate is itself among the lowest in the catalogue, its origin has an outsized effect:
  depending on the predecessor — the catalogue ranges from 0.0035 to 30 days per second —
  between 0.78 and 9.21 days pass in the 40 s instead of the nominal 0.8, and the globe turns
  correspondingly between 0.78 and 9.24 times instead of once. Further simplifications:
  [limits of the model](thema:modell).

*As of September 2026*
