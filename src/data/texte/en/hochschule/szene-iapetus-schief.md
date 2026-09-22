# Scene: The tilted orbit of Iapetus

The camera orbits [Saturn](objekt:saturn) itself, not [Iapetus](objekt:iapetus) – only a
planet-centred view at this distance shows how strongly its orbit is tilted against
Saturn's equator and [rings](thema:ringe). Unlike [Saturn's rings edge-on](szene:saturn-ringkante),
where five moons sweep back and forth near the ring plane, Iapetus is the outlier: far out,
clearly tilted, and in this scene visible only as an orbital line, never as a disc.

## What the view shows

The `orbit` path type keeps the camera on a sphere around Saturn's centre: radius
40 rendered Saturn radii ($R_\mathrm{p} = 58\,232\,\mathrm{km}$) times the draw factor,
without a `lookAtId` – the camera looks at Saturn, not at Iapetus. At draw factors
0.8/1.0/1.5 it stands $1\,863\,424\,\mathrm{km}$/$2\,329\,280\,\mathrm{km}$/
$3\,493\,920\,\mathrm{km}$ away; Saturn's angular diameter $2\arcsin(R_\mathrm{p}/R)$ shrinks
from 3.58° to 1.91°, the ring (outer edge $136\,780\,\mathrm{km}$) from 8.42° to 4.49°.
Azimuth is fixed at 225.58° (spread ±20°, rate 1°/s over 30 s), elevation fixed per draw
between 30° and 60° (base 45°, additive ±15°).

The ring's opening angle follows the same formula as in [Saturn's rings
edge-on](szene:saturn-ringkante): $B=\arcsin(|\hat d \cdot \hat n|)$ with Saturn's pole
$\hat n$ (`poleVector`, 40.589°/83.537°) and the view direction $\hat d$. At azimuth
225.58° and elevation 30°/45°/60° this gives $B=5.94^\circ/20.38^\circ/34.70^\circ$, an apparent ring
axis ratio $\sin B = 0.10/0.35/0.57$ – open enough to clearly separate ring and globe. The
same calculation, applied to the normal of Iapetus' own orbital plane instead of Saturn's
pole, gives $B=12.80^\circ/27.80^\circ/42.79^\circ$ for the same three elevations and an axis ratio of
0.22/0.47/0.68: the orbital ellipse, tilted 15.47° against Saturn's equator, thus appears
as a clear ellipse throughout the elevation range, never as a line.

Because the camera's distance from Saturn (40 $R_\mathrm{p}$) is smaller than Iapetus'
own orbital radius (about 61 $R_\mathrm{p}$), this axis-ratio calculation only describes
the ellipse's orientation, not its full visibility: an actual cone test along the camera
basis (half field of view 25° vertical, about 39.7° horizontal at 16:9) shows that in the
base setting only about a third to just under half of the momentary orbital ellipse lies
within the frame – the rest lies behind the camera or outside the horizontal field of
view. What remains visible on every draw is a clearly curved, distinctly tilted arc near
Saturn, not a fully closed loop; this is genuine perspective, not a simplified orthographic
projection.

Iapetus itself stays inconspicuous: its own apparent radius reaches at most about 1 pixel
over the scene's 90 simulated days (30 s at 3 days/s, orbital period 79.331 days, about
1.13 orbits) and the full spread of draw parameters (screen height 1080 px, field of view
50°) – far below `LABEL_MIN_PIXEL_MOND` (8 pixels, `render/labels.ts`) and also below the
marker threshold (3 pixels, checked over 6516 time/camera combinations on a 0.5-day grid)
too: no label, barely a dot, only the orbital line shows it.
Of the other moons, [Rhea](objekt:rhea) (9.05 $R_\mathrm{p}$), [Dione](objekt:dione)
(6.49), [Tethys](objekt:tethys) (5.07), Enceladus (4.09) and Mimas (3.19) stay fully
within the frame on every draw, because their orbital radii lie well within half the frame
width even at the closest camera distance; [Titan](objekt:titan) (20.99 $R_\mathrm{p}$)
sits close to the frame edge and can partly leave the picture at shallow elevation and a
small draw factor.

## Background

Saturn's Laplace radius lies at $48.4\,R_\mathrm{p}$
([Orbital elements](thema:bahnelemente)); beyond it the Sun dominates precession more than
Saturn's equatorial bulge, and the plane about which an orbit precesses tips from Saturn's
equator towards its own orbital plane. By the mean orbital elements Iapetus orbits at
$59\,R_\mathrm{p}$, well beyond this threshold – the osculating value actually used in the
model, about 61 $R_\mathrm{p}$, lies in the same order of magnitude. Its Laplace plane is
therefore only 14.8° from Saturn's equator, and its actual orbit a further 7.6° from that
plane ([Tremaine et al. 2009](literatur:tremaine-2009)); measured directly against
Saturn's equator this comes to 15.47° – the largest inclination among the classical
Saturnian moons.

Giovanni Domenico Cassini discovered Iapetus on 25 October 1671 and already noticed then
that it was easy to see only west of Saturn, and barely visible east of it. From this
asymmetry he correctly concluded that one hemisphere of the moon was much darker than the
other ([Iapetus at NASA Science](quelle:nasa-iapetus)). Only the single close Cassini flyby on
10 September 2007, at an altitude of $1644\,\mathrm{km}$
([Cassini flyby of Iapetus](quelle:nasa-iapetus-vorbeiflug)), resolved the anomaly at
close range: the global colour dichotomy is geometrically sharp-edged
([Denk et al. 2010](literatur:denk-2010)), best explained by primordial dark material,
captured from the Phoebe ring, on the leading hemisphere, amplified by a thermal feedback
([Spencer and Denk 2010](literatur:spencer-2010)) – details on origin and equatorial ridge
are in [Iapetus](objekt:iapetus).

## Model limitations

- **Sphere without flattening:** `radiusKm` is a single scalar; Iapetus' real equatorial
  ridge (up to 20 km high) would be invisible at this camera distance anyway.
- **Fixed node precession about Saturn's pole instead of the Laplace pole:** deviation
  from Horizons is 0.71° by 2050 and 1.11° by 2076
  ([Orbital elements](thema:bahnelemente)).
- **Ring as a disc without thickness**, Saturn and Iapetus as spheres without real
  flattening.
- **Single-colour albedo 0.275:** the real two-tone surface (0.05 versus 0.5) shows only
  in the texture, not in the exposure value.
- **Time-lapse rate:** it ramps geometrically to 3 days/s over 2 s at scene start
  (`RATE_BLEND_SEC`, `app/cinema.ts`).
- **Sun direction fixed from J2000:** azimuth 225.58° is, as in [Enceladus in bright
  light](szene:enceladus-hell), the direction from Saturn to the Sun at epoch J2000.
  Saturn's mean motion ($1222.49362201^\circ$ per century, `LDot`) equals $12.22^\circ$ per year;
  by today (22 September 2026, 26.72 years since J2000) this has accumulated an offset of
  about 35°, closing full circle after $29.45$ years (one Saturn year). Further
  simplifications: [Model limitations](thema:modell).

*As of September 2026*
