# Scene: Saturn in grazing light

The camera circles [Saturn](objekt:saturn) at a shallow angle above the ecliptic and shows how
differently [the rings](thema:ringe) look depending on illumination: sometimes as a narrow, dark
band in grazing light, sometimes glowing brightly in backlight. Unlike
[Saturn's rings edge-on](szene:saturn-ringkante) or the [Ring flythrough](szene:ringdurchflug),
Saturn stays fully in frame here; solar direction and camera direction together decide which of the
two appearances is on screen at any moment.

## What the view shows

The `orbit` path type keeps the camera on a sphere around Saturn's centre
(`render/camera/cinema.ts`): radius 5 displayed Saturn radii (58,232 km) times the scatter factor,
azimuth advancing at 0.8°/s around Saturn, elevation fixed per draw between 1° and 16° (default 4°,
scatter additive −3° to 12°). At scatter factor 0.85/1.0/1.4 the camera sits 247,486/291,160/
407,624 km away; Saturn's angular diameter ($2\arcsin(R_\mathrm{S}/d)$, not small-angle) shrinks
from 27.2° to 16.4° over that range.

Whether the whole ring fits in frame depends purely on distance: its inner edge (74,658 km, 1.28
Saturn radii) reaches, as the largest angular offset from frame centre, $\arcsin(74658/d)$ – 17.6°
at factor 0.85 down to 10.6° at factor 1.4 – the outer edge (136,780 km, 2.35 Saturn radii)
correspondingly 33.6° to 19.6°. Against the half-frame height of 25° (50° field of view,
`KAMERA_FOV_GRAD`), the outer edge only fits completely from factor 1.11 upward; with a uniformly
drawn scatter factor, it extends past the frame edge in just under half of all draws (47.6%).

How obliquely the camera looks onto the ring plane follows from azimuth, elevation and Saturn's
pole: the viewing angle $B=\arcsin(\hat{d}\cdot\hat{n})$ ($\hat{d}$ the line of sight, $\hat{n}$ the
pole direction, [Reference frames](thema:bezugssysteme)) is 25.1° at the default draw (azimuth 40°,
elevation 4°), and ranges from −27.1° to 44.1° across the full scatter. Saturn's pole stands 28.1°
from the ecliptic normal, not 26.73°: that often-quoted figure measures against Saturn's own orbit,
tilted 2.49° from the ecliptic, whereas the camera's ecliptic elevation measures against the
ecliptic normal itself.

Whether the camera stands in grazing or in backlight shows up in the Sun–Saturn–camera phase angle.
At the default draw (as of 21 September 2026) it is 149.9° – already close to backlight – and across
the full azimuth circle it ranges from 1.6° (full light, azimuth 190.5°) to 173.6° (azimuth 10.5°);
with the elevation scatter, values up to 176.6° are reachable. In that same narrow azimuth window the
camera sits geometrically inside Saturn's own umbra: at factor 1 its angular radius as seen from
Saturn is 11.5° (13.6° at factor 0.85, 8.2° at factor 1.4) – a real spacecraft there would, like
Cassini on 15 September 2006, lose direct sunlight for several hours
([Eclipses](thema:finsternis)). Across the full scatter this affects, depending on factor, 2.8% to
6.7% of all azimuth draws.

The forward scattering $s(\gamma)=0.85\max(0,-\cos\gamma)^6$ (`vorwaertsstreuung`,
[Rings](thema:ringe)) follows the same angle: at azimuth 40° it already stands well above zero at
0.356, and near azimuth 10.5° it reaches 0.82 – close to its maximum.

Over the 3.5 simulated days of the scene (35 s at 0.1 days/s), Saturn turns on its axis 7.9 times
(`rotationPeriodH` 10.656 h).

## Background

The ring's shadow on the cloud tops acts as a seasonal clock: on 21 September 2026 the Sun stands
only 7.5° above the ring plane, and the shadow band measures 2.2° to 10.5° in width; near solstice
(solar elevation 26.7°) it reaches all the way to the winter polar cap
([Rings](thema:ringe)). Cassini's mosaic "In Saturn's Shadow" was assembled on 15 September 2006 from
165 wide-angle images taken over about three hours, while the spacecraft itself drifted in Saturn's
shadow for twelve hours; besides the main rings, the faint G and E rings became visible in it, along
with a pale point of light – Earth ([Photojournal Saturn](quelle:jpl-photojournal-saturn)). The
rings' general phase function, including an opposition effect near zero phase angle, is covered in
[Albedo and brightness](thema:photometrie); the forward scattering shown here comes from
micrometeoroid dust. Its visibility also depends on the Sun's elevation above the ring plane: the
B ring's radial "spokes", explained by electrostatically levitated dust, nearly vanished between 1998
and September 2005 and only returned once the rings opened further toward the Sun again
([Mitchell et al. 2006](literatur:mitchell-2006)).

## Model limitations

- **Saturn as a sphere with System III rotation:** the same values as at [Saturn](objekt:saturn)
  (`rotationPeriodH` 10.656 h, obliquity against its own orbit 26.730°, flattening not represented).
- **Ring as a disc without thickness:** a texture strip with an alpha channel (inner edge 74,658 km,
  outer edge 136,780 km); forward scattering `RING_STREUUNG` 0.85, `RING_SCHAERFE` 6, residual light
  in the planet's shadow `RING_SCHATTEN_RESTLICHT` 0.3, ring shadow using the alpha channel's opacity
  (the same figures as [Rings](thema:ringe)); no spokes, no thickness, no opposition surge.
- **Exposure:** without a `lookAtId`, the camera exposes on Saturn itself (`exposureTargetId`,
  `render/exposure.ts`).
- **Time-lapse:** it eases in geometrically over 2 s at the start of the scene onto 0.1 days/s
  (`RATE_BLEND_SEC`); depending on the preceding scene, that yields between 3.4 (predecessor
  `mondfinsternis`, 0.0035 days/s) and 14.0 simulated days (predecessor `systemblick`, 30 days/s)
  instead of the nominal 3.5 – correspondingly between 7.6 and 31.6 Saturn rotations. Further
  simplifications: [limits of the model](thema:modell).

*As of September 2026*
