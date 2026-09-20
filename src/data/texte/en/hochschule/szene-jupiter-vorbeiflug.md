# Scene: Flyby of Jupiter

The camera moves past [Jupiter](objekt:jupiter) in a straight line, sideways to its own line of
sight and at a constant pace for the whole scene. It looks at Jupiter's centre throughout; whether
the innermost Galilean moon [Io](objekt:io) also enters the frame turns out to depend hardly on
chance at all, but on its short orbital period.

## What the view shows

The `flyby` path shifts the camera sideways to the line of sight, linearly from $+2$ to $-2$ radii
(`render/camera/cinema.ts`); a radius here is four times the displayed Jupiter radius (69,911 km)
times the scatter factor (`distanceInRadii: 4`). The sideways direction stands exactly
perpendicular to the camera–Jupiter line and, regardless of azimuth and elevation, always lies in
the ecliptic; its dot product with the radius direction therefore always vanishes, without the
approximation other path types in the catalogue need. By Pythagoras, the distance to Jupiter's
centre then follows exactly from the radius and the sideways offset: the closest approach falls
exactly at the middle of the scene (17.5 s), at a radius between 3.2 and 6.0 Jupiter radii (scatter
factor 0.8 to 1.5); the farthest point sits at both ends, at $\sqrt5$ times that, so 7.2 to
13.4 radii.

The path itself is a straight stretch of four radii: over the 35 seconds the camera covers between
894,861 km (factor 0.8) and 1,677,864 km (factor 1.5), 1,118,576 km at the default (factor 1) –
that is 25,567 to 47,939 km/s, 31,959 km/s at the default: between 8.5% and 16.0% of the speed of
light, far beyond any real probe (see Background). Jupiter's angular diameter – using the full,
not small-angle $2\arcsin(R_\mathrm{J}/d)$ – grows over the scene from 12.8° at the start and end
to 29.0° in the middle (default settings); across the full range of variation that spans 8.5°/19.2°
(factor 1.5) to 16.1°/36.4° (factor 0.8) – with a 50° field of view, Jupiter therefore always stays
well within the frame. At 0.3 days per second, 35 seconds nominally cover 10.5 simulated days;
Jupiter's `rotationPeriodH` of 9.9250 h (details at [Jupiter](objekt:jupiter)) then gives
25.4 rotations of the texture.

Whether moons enter the frame depends on Io's orbital radius: 421,800 km amounts to 6.0 displayed
Jupiter radii (model radius 69,911 km) – almost exactly the camera's own distance range. Because
[Io](objekt:io) completes nearly six orbits within the scene's 10.5 simulated days (orbital period
1.769138 d), practically every draw brings it close to the camera's line of sight to Jupiter at some
point: a grid search over 480 combinations of azimuth, elevation and scatter factor (step size
0.5 s) found, in every single draw, a moment when the angle between the directions camera→Jupiter
and camera→Io fell below the 25° that make up half the frame height, with a median of only 3.5°; in
the most favourable case tested (azimuth 220°, elevation −3°, factor 1.5, shortly after the scene
began) the angle was only 0.14° – Io then stood practically on Jupiter's own disc, which at that
point spanned 4.6°. By the same pattern, the three remaining moons occasionally come close to the
line of sight too, without the scene being built for them.

## Background

Real probes do not fly straight: Jupiter's gravity field bends the path into a hyperbola, whose
deflection angle $\delta = 2\arcsin(1/e)$ depends on the eccentricity
$e = 1 + r_p v_\infty^2/GM_\mathrm{J}$ – that is, on the periapsis distance $r_p$ and the approach
speed $v_\infty$ relative to Jupiter ([Murray and Dermott 2000](literatur:murray-2000)). In the
frame co-moving with Jupiter, only the direction of $v_\infty$ changes, not its magnitude; because
Jupiter itself moves around the Sun at about 13 km/s, this rotated velocity can add to or subtract
from Jupiter's own heliocentric motion – the actual mechanism behind a gravity assist.

Several probes have used Jupiter as a waystation: Pioneer 10 and 11, Voyager 1 and 2, Ulysses and
Cassini flew past between the 1970s and the 2000s, "on their way to other worlds"
([Jupiter at NASA Science](quelle:nasa-jupiter)); in March 1979 Voyager 1 delivered the first
close-up images of active volcanism on [Io](objekt:io) ([Smith et al. 1979](literatur:smith-1979)).
The best-documented case is New Horizons: on 28 February 2007 the probe came closest to Jupiter,
at about 32 Jupiter radii (roughly 2.3 million km) and 21 km/s
([NSSDC 2026](literatur:nssdc-newhorizons-2026)), and afterwards was about 14,000 km/h
(4 km/s) faster – shaving three years off the trip to [Pluto](objekt:pluto)
([New Horizons mission](quelle:nasa-new-horizons)); the same flyby captured a major eruption of the
Io volcano Tvashtar ([Spencer et al. 2007](literatur:spencer-2007)).

Getting closer is dangerous: Jupiter's magnetic field – 15 to more than 50 times stronger than
Earth's – holds belts of energetic particles, which Juno has avoided since 2016 with a near-polar
orbit that comes no closer than about 3,500 km above the clouds ([Juno mission](quelle:nasa-juno))
– closer than any of the probes named above, yet still far beyond the 3.2 to 6.0 Jupiter radii this
scene's camera flies through unharmed.

## Model limitations

- **Camera without gravity:** a straight line instead of a hyperbola, a constant pace of 25,567 to
  47,939 km/s – 8.5 to 16.0% of the speed of light, far beyond any real probe's speed
  (New Horizons: 21 km/s).
- **Jupiter as a sphere with System III rotation:** the same values as at [Jupiter](objekt:jupiter),
  section "In the model" (`rotationPeriodH` 9.9250 h against the IAU rate of 9.924920 h, obliquity
  3.1200°, flattening not represented).
- **Exposure:** the scene sets no `lookAtId`; the camera therefore exposes on Jupiter itself
  (`exposureTargetId`, `render/exposure.ts`).
- **Jupiter's own motion:** at an orbital speed of about 13 km/s, Jupiter covers only about 460 km
  in 35 s, negligible against the camera's path of at least 894,861 km; the orbital elements, like
  for every planet, are linearly propagated from the JPL approximate-position table
  ([Orbital elements](thema:bahnelemente)).
- **Moon shadows:** all four Galilean moons count as possible occluders (`MAX_OKKLUDER` 4); seen
  from Jupiter, the Sun has an angular radius of only 0.051°, so at Jupiter's 3.1° obliquity Io
  always casts a shadow while Callisto sometimes casts none at all (9.5° versus 2.1° permissible
  solar elevation, [Eclipses](thema:finsternis)) – such a shadow can appear in the picture without
  the scene being built for it; a deliberate view of the moons and their shadows is instead given by
  [Galilean shadow play](szene:galileisches-schattenspiel).
- **Time-lapse:** it glides for 2 s at the start of the scene, geometrically, onto 0.3 days/s
  (`RATE_BLEND_SEC`); depending on the preceding scene, that yields between 10.0 (predecessor
  `mondfinsternis`, 0.0035 days/s) and 23.0 simulated days (predecessor `systemblick`, 30 days/s)
  instead of the nominal 10.5 – correspondingly between about 24 and 56 Jupiter rotations and
  between 5.7 and 13.0 Io orbits. Further simplifications: [limits of the model](thema:modell).

*As of September 2026*
