# Scene: Saturn's rings edge-on

The camera sits fixed in the ecliptic, exactly in the direction where [the rings](thema:ringe)
cross that plane, and looks from there at [Saturn](objekt:saturn). Because the rings are an
infinitely thin disc in the model, they nearly vanish at this spot – as in
[Grazing light](szene:saturn-streiflicht), everything here hinges on the viewing angle too, only far
more narrowly.

## What the view shows

The `static` path type holds the camera motionless on a sphere around Saturn
(`render/camera/cinema.ts`): radius 8 displayed Saturn radii (58,232 km) times the scatter factor,
azimuth fixed at 169.53°, elevation fixed per draw between −1.5° and 1.5°. At scatter factor
0.8/1.0/1.5 the camera sits 372,685/465,856/698,784 km away; Saturn's angular diameter shrinks from
17.98° to 9.56° over that range.

The azimuth 169.53° is not an arbitrary number: Saturn's pole (`poleVector`, 40.589°/83.537°) lies at
ecliptic longitude 79.53° ([Reference frames](thema:bezugssysteme)); the ring plane crosses the
ecliptic exactly where the azimuth direction stands perpendicular to the pole's horizontal
projection, that is at 79.53° ± 90° = 169.53° or 349.53°. Because the pole in the dataset is fixed in
time, this value holds exactly at every simulated moment – an independent calculation matches the
catalogued 169.53° to within 0.003°.

At exactly 0° elevation the camera sits within the ring plane itself (viewing angle
$B=\arcsin(\hat{d}\cdot\hat{n})<0.001^\circ$) – the ring is then, as intended by the model, a pure
line with no area. Only the elevation scatter opens it up: at ±1.5° the same calculation gives
$B=\pm1.32^\circ$ (the approximation $B\approx\arcsin(\sin(1.5^\circ)\cos i)$ with $i=28.05^\circ$,
the obliquity against the ecliptic normal, matches that to within 0.001°). The apparent ring thickness – outer
diameter (273,560 km) times $\sin B$, divided by the camera distance – comes out at factor 1 to
0.78° = 22 pixels (assumption: image height 1440 px, 50° field of view, `KAMERA_FOV_GRAD`); at
factor 0.8 it grows to 28 pixels, at factor 1.5 it shrinks to 15. As little as 0.068° of elevation is
already enough, by calculation, for a single pixel – the ring is thus fully invisible only within a
vanishingly narrow elevation window around 0°.

Saturn's solar elevation above the ring plane on 21 September 2026 is −7.5°
([Rings](thema:ringe); [Albedo and brightness](thema:photometrie)); the edge-on view therefore lies
on the ring's unlit side, one more reason little light comes back.

Over the scene's 6 simulated days (30 s at 0.2 days/s), [Mimas](objekt:mimas) completes 6.4 orbits
(period 0.942 d), Enceladus 4.4 (1.370 d), Tethys 3.2 (1.888 d), Dione 2.2 (2.737 d), and Rhea 1.3
(4.518 d); all five swing back and forth along the ring's line, just as in reality. Unlike the three
inner moons, Dione's orbital radius (6.49 Saturn radii), and especially Rhea's (9.05), is of the same
order as the camera's own distance (6.4 to 12 radii) – below factor 1.13 the camera actually sits
closer to Saturn than Rhea does on its orbit.

## Background

Ring-plane crossings of [Earth](objekt:earth) – threefold in 1995/96, again in 2009, and most
recently on 23 March 2025 ([Saturn](objekt:saturn)) – are rare opportunities for research. In 1995/96
the Hubble Space Telescope used them for spectroscopic stellar occultations that constrained the
F ring's thickness to 1.2 to 1.5 km and tracked the E ring out to about 15,000 km
([Nicholson et al. 1996](literatur:nicholson-1996)). Ring-plane crossings have also historically
offered favourable conditions for discovering especially faint objects: in 1966 Audouin Dollfus
identified a tenth Saturnian moon during one such crossing, which only later turned out to be two
bodies on nearly identical orbits – Janus and Epimetheus; a later study re-examined the conflicting
observations of several candidate moons from that period
([Aksnes and Franklin 1978](literatur:aksnes-1978)). Near Saturn's equinox in August 2009, vertical
structures up to 3.5 km tall at the outer edge of the B ring cast measurable shadows for the first
time – evidence for otherwise invisible small moons embedded there
([Spitale and Porco 2010](literatur:spitale-2010)). Determining the ring's thickness itself relies on
edge brightness and such occultations; for the dense main rings this comes out to a range of metres
to a few tens of metres (same as [Rings](thema:ringe), section "Particles, thickness and self-gravity
wakes").

## Model limitations

- **Disc without thickness:** vanishes completely at exactly 0° elevation; in reality the main rings
  are only about ten metres thick, but not zero – an observer at this spot would therefore still see
  a wafer-thin sliver, unlike the model, plus the far thicker, eccentric F ring (1.2 to 1.5 km) and
  the B ring's up to 3.5-km-tall edge structures.
- **Missing E and F rings:** only the main rings (74,658 to 136,780 km) are shown.
- **Forward scattering, exposure:** the same values as at
  [Saturn in grazing light](szene:saturn-streiflicht); without a `lookAtId`, the camera exposes on
  Saturn itself (`exposureTargetId`).
- **No moon shadow on the ring:** for the ring disc itself, the code only ever treats Saturn as a
  possible shadow caster (`render/rings.ts`, `uPlanetOkkluder`; `render/shadows.ts`, design note
  "rings: only the planet") – none of Saturn's seven moons can cast a shadow onto the ring in the
  model, unlike onto Saturn itself or onto other moons. The general shadow calculation is described
  at [Eclipses](thema:finsternis).
- **Fixed orientation without precession:** `poleVector` is constant in time, so Saturn's real, very
  slow pole drift has no effect anywhere in the simulation's time range – an unintended, but in
  practice inconsequential, difference from reality. Further simplifications:
  [limits of the model](thema:modell).

*As of September 2026*
