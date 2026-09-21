# Scene: The Galilean shadow play

The camera circles in a steep overhead view around [Jupiter](objekt:jupiter) and shows, at a
strong time-lapse rate, the orbits of the four moons Galileo Galilei first observed in January
1610: [Io](objekt:io), [Europa](objekt:europa), [Ganymede](objekt:ganymede) and
[Callisto](objekt:callisto). Three of them – Io, Europa and Ganymede – stand in the Laplace
resonance and trace out a recurring pattern of motion in the ratio 4:2:1; Callisto orbits
alongside, outside that chain.

## What the view shows

The `orbit` path type (`render/camera/cinema.ts`) keeps the camera on a sphere around Jupiter's
centre: radius 55 displayed Jupiter radii (69,911 km) times the scatter factor, azimuth
advancing at 1°/s by 45°, elevation fixed per draw between 45° and 65°; the scene sets no
`lookAtId`, so the camera always looks at Jupiter itself. At scatter factor 0.8/1.0/1.5 it sits
3,076,084/3,845,105/5,767,658 km away; Jupiter's angular diameter $2\arcsin(R_\mathrm{J}/d)$
shrinks from 2.6° to 1.4° – against the 50° field of view, Jupiter itself stays tiny. Unlike the
[Flyby of Jupiter](szene:jupiter-vorbeiflug), which closes in, this scene shows the system from a
distance.

On that sphere lie the four moon orbits: Io's semi-major axis of 421,800 km amounts to 6.0
displayed Jupiter radii, Europa's 671,100 km to 9.6, Ganymede's 1,070,400 km to 15.3, and
Callisto's 1,882,700 km to 26.9 (NSSDC fact sheet, [Jovian satellites](quelle:nssdc-jupitermonde));
because `scaledPositionAt` scales moon offsets and the planet's own radius by the same
`sizeScale`, this ratio holds unchanged at every scale setting. Compared with the half-frame
width (25°), Io's, Europa's and Ganymede's orbits stay safely inside the frame across the whole
scatter range – even at factor 0.8, the largest angular offset from frame centre (Ganymede) stays
under 21°. Callisto's orbit, however, already exceeds the frame edge at the default value
(factor 1: 29.5° instead of 25°) and only fits completely from a factor of about 1.17 upward;
with a uniformly drawn scatter factor, that affects a good half of all draws.

At 0.5 simulated days per second, 45 seconds nominally cover 22.5 days; after the two-second
time-lapse ease-in (`RATE_BLEND_SEC`), the actual span ranges, depending on the preceding scene,
from 21.7 (after `mondfinsternis`, 0.0035 days/s) to 36.2 days (after `systemblick`, 30 days/s).
At the nominal rate, Io orbits Jupiter 12.7 times in that span (orbital period 1.769138 d),
Europa 6.3 times (3.551181 d), Ganymede 3.1 times (7.154553 d), and Callisto 1.3 times
(16.689017 d) – Io, Europa and Ganymede thus in the near-ratio 4:2:1; Jupiter itself spins on its
axis 54.4 times in that time (`rotationPeriodH` 9.9250 h).

Io and Europa's conjunctions – seen from Jupiter in the same direction – recur, through the
resonance, near the same point relative to Io's perijove (formula and derivation:
[Orbital resonances](thema:resonanzen)); with a synodic period of 3.53 days, about 6.4 such
encounters fall within the scene, visible as a recurring overtaking rhythm always near the same
direction from Jupiter (on the drift of that direction in the model: Model limitations).

Whether a moon casts any shadow onto Jupiter at all depends on the Sun's elevation above its
equatorial plane: $\arcsin(R_\mathrm{J}/a)$ gives 9.5° for Io, 6.0° for Europa, 3.7° for Ganymede
and 2.1° for Callisto (derivation, the same formula as for [Eclipses](thema:finsternis)); at a
3.1° obliquity, Io, Europa and Ganymede therefore always cast a shadow, Callisto only some of the
time – essentially unchanged over the scene's short span, so a single playthrough either always
or never shows a Callisto shadow. Because the model also treats the moons as
mutual shadow casters (see Model limitations), genuine mutual moon eclipses can appear as well
(Background) – though at this distance no larger than a single pixel, on Jupiter's disc, itself
only 1.4° to 2.6° across.

## Background

Galileo Galilei first observed the four bright points beside Jupiter on 7 January 1610 and
realised within a few nights that they orbit it – a direct argument against the geocentric
worldview. The German astronomer Simon Marius observed them independently around the same time
but published later; the names he proposed in 1614, suggested to him by Johannes Kepler, prevailed
regardless ([Jupiter moons at NASA Science](quelle:nasa-jupitermonde)). Galileo also proposed
using the moons' eclipses as a celestial clock for determining longitude; from that came the
Paris Observatory's observation series in which Ole Rømer concluded in 1676 that irregularly
delayed eclipses of Io stem from the finite speed of light
([Bobis and Lequeux 2008](literatur:bobis-2008); shadow geometry and light travel time:
[Eclipses](thema:finsternis)).

Io, Europa and Ganymede satisfy, in a time average, the Laplace relation
$\varphi_\mathrm{L} = \lambda_1 - 3\lambda_2 + 2\lambda_3 \approx 180^\circ$ with the mean
longitudes λ; it locks the three orbits into a stable coupling, prevents a simultaneous
conjunction of all three moons, and forces the small orbital eccentricity that keeps Io's tidal
heating going (derivation and two-body angles: [Orbital resonances](thema:resonanzen)).

Because their orbits lie nearly in one plane, the four moons also occult and eclipse one another
near Jupiter's equinoxes. Such mutual events (PHEMU) yield, from mere light-curve photometry,
relative positions at the milliarcsecond level that feed into the moons' ephemerides; a first
large campaign took place in 2009 ([Arlot et al. 2014](literatur:arlot-2014)), with further
campaigns in 2014/15 and 2021. The Juice spacecraft is to enter Jupiter orbit in July 2031; it
targets the three icy moons Ganymede, Callisto and Europa
([Juice at ESA](quelle:esa-juice)) – Io is not among them.

## Model limitations

- **Kepler orbits without perturbations:** like every body in the catalogue, the four moons move
  on ellipses with linearly propagated elements from the JPL table for the Jupiter system
  ([Orbital elements](thema:bahnelemente)); libration, resonance capture, and the real, slow
  drift away from the exact resonance are absent.
- **Laplace angle and perijoves:** $\varphi_\mathrm{L}$ stands exactly at 180.0° at the J2000
  epoch and drifts by −1.05°/century – over the scene's 22.5 days, less than 0.001° and thus
  unnoticeable. The perijoves of Io and Europa, however, run forward in the dataset with periods
  of 1.33 and 1.46 years respectively instead of, as the theory requires, backward at the same
  rate (figures as in [Orbital resonances](thema:resonanzen)) – over the scene's 22.5 days, a
  forward drift of about 17° and 15° respectively, in the wrong direction.
- **Shadows:** `waehleOkkluder` (`render/shadows.ts`) treats each moon's three siblings, beside
  Jupiter itself, as possible shadow casters; at `MAX_OKKLUDER` 4 that fits without any cut –
  unlike Saturn's seven large moons – so genuine mutual moon eclipses are built into the model.
  The calculation is continuous (a genuine penumbra from the full angular sizes of the Sun and
  the occluder) and colour-neutral, since none of the five bodies carries its own umbra colour.
- **Exposure:** without a `lookAtId`, the camera exposes on Jupiter itself (`exposureTargetId`,
  `render/exposure.ts`) – as in the Flyby of Jupiter.
- **Time-lapse:** it eases in geometrically over 2 s at the start of the scene onto 0.5 days/s
  (`RATE_BLEND_SEC`); depending on the preceding scene, that yields between 21.7 and 36.2
  simulated days instead of the nominal 22.5 – correspondingly between 52.5 and 87.4 Jupiter
  rotations. Further simplifications: [limits of the model](thema:modell).

*As of September 2026*
