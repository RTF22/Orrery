# Scene: Flying through Saturn's rings

The camera flies past [Saturn](objekt:saturn) in a straight line, low over [the rings](thema:ringe)
and about two Saturn radii from the centre – as in the [Jupiter flyby](szene:jupiter-vorbeiflug), it
shifts linearly across the line of sight, but here it actually crosses the ring plane once.

## What the view shows

The `flyby` path type keeps the view fixed on Saturn's centre throughout and shifts the camera
linearly across the line of sight, from +2 to −2 radii (`render/camera/cinema.ts`); one radius here
is twice the displayed Saturn radius (58,232 km) times the scatter factor (`distanceInRadii: 2`). At
scatter factor 0.8/1.0/1.5 it covers 372,685/465,856/698,784 km over the 30 seconds – 12,423/15,529/
23,293 km/s, that is 4.1 to 7.8 % of the speed of light. As with every `flyby`, the greatest distance
occurs at both ends, at $\sqrt5$ times the radius, the smallest exactly at mid-scene (15 s), at the
radius itself: there Saturn's angular diameter measures 60° (scatter 39° to 77°, at times beyond the
50° field of view), at the start and end only 26° (17° to 32°). Azimuth 169.53° is – as in
[Saturn in grazing light](szene:saturn-streiflicht) – the ring-plane node adopted from Task 5 (derived
there from the pole longitude 79.5275° + 90°; confirmed here only as a check against this scene's own
camera geometry: 169.5275°). At the nominal distance (2 radii, 116,464 km) the path's reference point
sits in the middle of the B ring (91,975–117,570 km, [Rings](thema:ringe)), close to its outer edge.

The comment in the source code claims that the sideways motion drifts "increasingly" out of the ring
plane, which is tilted 28.05° to the ecliptic – a calculation shows instead a **constant** rate of
7303 km/s over the whole flight (four times the radius times the sine of the 28.05° tilt, divided by
the scene's 30 seconds): the camera starts about 1.8 Saturn radii below the ring plane, crosses it –
depending on the drawn elevation – between 10.4 s and 14.8 s, always before mid-scene at 15 s, at a
point 2.0 to 2.3 Saturn radii from the centre (so in the middle of the B or A ring), and ends about
2.0 radii above it. Only at the lower end of the elevation scatter (near −3°, about 1° in total) does
the ring, right at mid-scene, still stand almost edge-on
($B\approx\arcsin(\sin(1^\circ)\cos i)\approx0.9^\circ$ with $i=28.05^\circ$, the same formula as in
[Saturn's rings edge-on](szene:saturn-ringkante)); at the upper end (+15°, 19° in total) it has already
opened to 16.7° by then.

At the reference time (21 September 2026) the Sun–Saturn–camera phase angle stays below 85° for the
whole scene, so the [forward scattering](thema:photometrie) (`RING_STREUUNG` 0.85) contributes almost
nothing; because the azimuth sits exactly on the ring node, the same phase angle reaches close to 180°
at only a single point in Saturn's 29.4-year orbit (calculated near early 2014, with the same method
the next recurrence near mid-2043) – then this very flyby would show the ring in near-full backlight.

Over the nominal 1.5 simulated days, Saturn rotates 3.4 times (10.656 h); [Mimas](objekt:mimas)
(0.942 d) completes 1.6 orbits in that time, [Enceladus](objekt:enceladus) (1.370 d) 1.1 orbits. The
ring texture resolves the strip radially to 30.3 km per pixel (62,122 km over 2048 pixels,
`ASSETS.md`).

## Background

Real ring-plane crossings have been rare, and always outside the dense main rings: Pioneer 11 crossed
the plane on 1 September 1979, about 35,000 km beyond the A ring's outer edge; Voyager 2 passed Saturn
in 1981 at a distance of about 161,000 km, close to the faint G-ring plane.
[Cassini's](quelle:nasa-cassini) orbit insertion took it through the gap between the F and G rings at
about 158,500 km in 2004; the same mission ended on 15 September 2017, after diving 22 times through
the same gap between the D ring and the atmosphere during the Grand Finale
([Ye et al. 2018](literatur:ye-2018)), measuring about 5 kg of infalling ring dust per second in the
upper atmosphere ([Mitchell et al. 2018](literatur:mitchell-2018)) and collecting it in situ
([Hsu et al. 2018](literatur:hsu-2018)) – a review of 13 years of Cassini research at Saturn is drawn
by [Spilker (2019)](literatur:spilker-2019).

For a probe travelling at many kilometres per second, even a centimetre-sized chunk is dangerous:
Voyager radio occultations found a broad particle-size distribution in the main rings, from dust-grain
size up to several metres ([Zebker et al. 1985](literatur:zebker-1985)); inside the
[Roche limit](thema:gezeiten), no moon can hold itself together from that material anyway. Each
particle orbits Saturn on its own Keplerian path, differing from its neighbours' – the same shear that
also produces the [self-gravity wakes](thema:ringe) in the dense B and A rings would, seen up close,
look like a constant, slow sliding of particles past one another, not the calm band the simulation
shows.

## Model limitations

- **Disc without thickness or particles:** up close the ring never resolves into chunks, no
  self-gravity wakes, no collisions; the texture resolves the strip radially to only 30.3 km per
  pixel, coarser than any real density wave.
- **Forward scattering, exposure:** the same values as in
  [Saturn in grazing light](szene:saturn-streiflicht); without a `lookAtId`, the camera exposes on
  Saturn itself (`exposureTargetId`).
- **Camera without gravity:** a straight line instead of a bound or hyperbolic orbit, at a speed of
  12,423 to 23,293 km/s (4.1 to 7.8 % of the speed of light) – far beyond any real probe.
- **Fixed ring plane without precession:** `poleVector` is constant in time, as in the neighbouring
  ring scenes.
- **Time acceleration:** it glides for 2 s at the start of the scene, geometrically, to 0.05 days/s;
  depending on the preceding scene this yields between 1.4 (predecessor `mondfinsternis`,
  0.0035 days/s) and 11.0 simulated days (predecessor `systemblick`, 30 days/s) instead of the nominal
  1.5 – correspondingly between 3.2 and 24.8 Saturn rotations. No collision or near-field model
  constrains the camera itself. Further simplifications:
  [limits of the model](thema:modell).

*As of September 2026*
