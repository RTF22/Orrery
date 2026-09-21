# Scene: Hazy Titan in front of Saturn

The camera circles [Titan](objekt:titan) almost all the way around and shows it exactly as any
camera would in visible light: a uniformly orange sphere whose surface the haze hides completely –
much like the cloud deck of [Venus](objekt:venus), except that Titan's veil is photochemistry rather
than sulfuric-acid droplets. [Saturn](objekt:saturn) crosses the frame with good, but not guaranteed,
odds; the companion scene [Enceladus in brilliant light](szene:enceladus-hell) shows the same planet
from the vicinity of a smaller, brighter moon.

## What the view shows

The `orbit` path type keeps the camera on a sphere around Titan's centre: radius 7 displayed Titan
radii (2575 km) times the scatter factor, azimuth advancing at 11°/s, elevation fixed per draw
between 5° and 25° (default 15°, scatter additive −10° to 10°). At scatter factor 0.8/1.0/1.5 the
camera sits 14,420/18,025/27,038 km away; Titan's own angular diameter ($2\arcsin(2575/d)$) shrinks
from 20.6° to 10.9° over that range.

Over 35 s the azimuth covers $11^\circ/\mathrm{s}\cdot 35\,\mathrm{s}=385^\circ$ – more than a full
circle. Whether Saturn enters the frame depends on the angle between the line of sight camera→Titan
and the direction Titan→Saturn: computed across eight orbital phases, five elevations, four scatter
factors and eight starting azimuths (1280 combinations), Saturn sits in frame for only about 9% of
the scene's time on average (25° half-angle plus Saturn's own angular radius, as a circular
approximation of the 50° field of view); it appears at least once in 41% of the combinations and
never in 59% – "good odds, but not guaranteed" is, if anything, an optimistic description. Saturn's
own angular diameter as seen from Titan, computed with the mean semi-major axis (1,221,935 km), is
$2\arcsin(58232/1221935)=5.46^\circ$; on 21 September 2026 Titan stands near the far point of its
orbit, where it is only 5.31°.

Across the full azimuth sweep, the Sun–Titan–camera phase angle ranges from 12.6° (near full light)
to 162.6° (a deep crescent near new light) – the terminator sweeps once across the entire visible
disc in the process. The scene compresses 10.5 simulated days (35 s at 0.3 days/s), which is 0.66
Titan orbits (237° of orbital motion); because Titan is [tidally locked](thema:gebundene-rotation), it
turns through the same angle about its own axis.

Seen from Titan, Saturn's rings appear almost exactly edge-on: because Titan's orbit is tilted only
0.36° from Saturn's equator, the line of sight Titan→Saturn lies just as close to the ring plane – on
21 September 2026 at −0.12°, ranging between −0.36° and 0.36° over a full orbit. The ring itself, were
it visible, would span about $2\arctan(136780/1221935)=12.8^\circ$ of the sky, a hair-thin line.

## Background

In November 1980, Voyager 1 saw Titan as a "featureless orange world": the haze hid the surface
completely, leaving only a north–south brightness contrast and a dark polar hood visible
([Smith et al. 1981](literatur:smith-1981)). In 2004 Cassini first resolved a detached haze layer at
about 500 km altitude, 150 to 200 km higher than the one Voyager had observed
([Porco et al. 2005](literatur:porco-2005)); this layer is not fixed in place but follows Titan's
29.5-year seasonal cycle: between 2007 and 2010 it dropped from over 500 km to only 380 km, because
the pole-to-pole circulation cell weakened around the 2009 equinox
([West et al. 2011](literatur:west-2011)). Sunlight and Saturn's magnetosphere gradually build up
larger organic molecules from methane and nitrogen in the upper atmosphere, which eventually condense
into solid, orange-brown tholins and settle downward – a recent review summarises the photochemistry
and structure of these layers ([Hörst 2017](literatur:hoerst-2017);
[Nixon 2024](literatur:nixon-2024)). Small particles such as those in the haze scatter light
preferentially forward; Cassini's images of Titan's night side in backlight accordingly show a
brightly glowing limb, the same optical effect that [Albedo and brightness](thema:photometrie)
describes for Saturn's rings as well. Seen from the surface, Saturn, at 5.5° angular diameter a good
ten times the width of the full Moon in Earth's sky, would stand practically motionless above the
haze – none of that would actually be visible. The only images ever to reach the surface through the
haze came from the Huygens probe during its descent on 14 January 2005
([Tomasko et al. 2005](literatur:tomasko-2005)).

## Model limitations

- **No atmosphere in the renderer:** Titan shows a surface map assembled from Cassini RADAR and
  infrared images (`ASSETS.md`), which in reality lies hidden beneath the haze described above; no
  limb glow, no forward scattering – only Saturn's ring carries such a term in `render/rings.ts`,
  Titan as a sphere does not. The albedo 0.22 (the real haze's geometric albedo) is applied to this
  surface map, which is not the haze.
- **Exposure:** without a `lookAtId`, the camera exposes on Titan itself (`exposureTargetId`,
  `render/exposure.ts`).
- **Saturn:** a sphere without flattening, the ring a disc without thickness – the same
  simplifications as at [Saturn](objekt:saturn) itself.
- **Time-lapse:** it eases in geometrically over 2 s at the start of the scene onto 0.3 days/s
  (`RATE_BLEND_SEC`).
- **Saturn in frame:** the scene comment calls it "not guaranteed" – the calculation above puts a
  number on that: about 9% of the scene's time on average, appearing at all in less than half of the
  draws. Further simplifications: [limits of the model](thema:modell).

*As of September 2026*
