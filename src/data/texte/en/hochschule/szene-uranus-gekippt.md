# Scene: Uranus lying on its side

The camera orbits [Uranus](objekt:uranus) at just 7 displayed Uranus radii – close enough that
[the rings](thema:ringe) and moons stand out clearly in front of the disc. Unlike
[Saturn's rings edge-on](szene:saturn-ringkante), where a stationary camera sits permanently in
the ring plane, this camera moves: it starts near the node where Uranus's tilted equatorial plane
crosses the ecliptic and keeps sweeping on, so the initially edge-on ring visibly opens up over
the scene.

## What the view shows

The `orbit` path type (`render/camera/cinema.ts`) holds the camera on a sphere around Uranus:
radius 7 displayed Uranus radii ($R_\mathrm{U}=25362\,\mathrm{km}$) times the scatter factor,
without a `lookAtId` – the camera looks at Uranus itself. Azimuth is fixed at 167.65° and keeps
advancing at 1.2°/s (35 s duration, 42° of drift by the end of the scene), elevation is fixed per
draw between 0° and 20° (base 10°, additive ±10°). At scatter factor 0.8/1.0/1.5 the camera sits
142,027/177,534/266,301 km away; Uranus's angular diameter $2\arcsin(R_\mathrm{U}/d)$ shrinks from
20.57° to 10.93° over that range, the ring's outer edge (51,600 km) from 42.61° to 22.35°.

The azimuth 167.65° is not arbitrary, just as in [Saturn's rings edge-on](szene:saturn-ringkante):
Uranus's pole (`poleVector`, 257.311°/−15.175°) lies at ecliptic longitude 257.65°, latitude
7.72°; the equatorial plane, which coincides with the rings, crosses the ecliptic exactly where
the azimuth direction stands perpendicular to the pole's horizontal projection, at
257.65° ± 90° = 167.65° or 347.65° – the smaller solution. At the base elevation of 10°, the
opening angle $B=\arcsin(|\hat d\cdot\hat n|)$ – camera direction $\hat d$, pole $\hat n$, the
same calculation as there – comes out to only 1.34°
($\sin B=0.023$); even across the whole scatter range (0° to 20°) B stays below 2.64° ($\sin B$
below 0.05) – the ring sits practically edge-on at the start. Only the continuing azimuth opens
it up, until B reaches about 42.6° ($\sin B=0.68$) after the 42° of drift.

Over the scene's 35 s at 0.3 days/s, 10.5 simulated days pass; at the rotation period used in the
model, $17.24\,\mathrm{h}$, that amounts to $10.5\cdot24/17.24\approx14.6$ rotations.

At the 7-Uranus-radii camera distance (5.6 to 10.5 $R_\mathrm{U}$ across the scatter range), the
orbital radii of the five large moons are 5.12 $R_\mathrm{U}$ (Miranda), 7.53 (Ariel), 10.49
(Umbriel), 17.20 (Titania), and 23.01 $R_\mathrm{U}$ ([Oberon](objekt:oberon), calculated
independently from `uranus-monde.ts`). Since all five orbital planes are tilted by less than
4.43° (Miranda) or under 0.19° (the rest) from the ring/equatorial plane, they behave optically
like the ring: nearly edge-on at first, opening up with the same azimuth sweep. A genuine frustum
test (72 sample points per orbit, half field of view 25°/39.7° at 16:9 and `KAMERA_FOV_GRAD` 50°)
nonetheless shows that in the base setting the ring stays entirely within frame (72 of 72 sample
points), while only part of each moon's orbit does – [Miranda](objekt:miranda) 30 of 72,
[Ariel](objekt:ariel) 19 of 72, Umbriel 17 of 72, Titania 15 of 72, Oberon 13 of 72. Most of the
rest falls above or below the frame, and for the three outer moons partly behind the camera too,
since their orbital radius exceeds the camera distance.

The scene fixes no sun direction: unlike the lunar-eclipse scene, it has no `zeitpunkt` field, so
`tickCinema` lets time run on without a jump (`app/cinema.ts`). Which pole, or the equator
instead, appears lit thus depends on the calendar date at scene start: on 22 September 2026, the
subsolar latitude works out to about 73° – deep within the lit north polar cap, three and a half
years before the 2030 northern summer solstice, much like the [bright north polar cap Webb
imaged in 2023](quelle:nasa-webb-uranus).

## Background

The cause of Uranus's [axial tilt](thema:achsneigung) of 97.77° (geometric angle between pole and
orbit normal 82.23°) remains unresolved; one or more giant impacts and a gradual spin–orbit
resonance both remain candidates, with the arguments for each laid out there. Over an 84-year
orbit, each pole faces the Sun for about 42 years and then lies in darkness for just as long;
because the seasonal points do not coincide with the apsides of the slightly eccentric orbit, the
time intervals between them are not equal, by Kepler's second law: the southern summer solstice,
near the Voyager 2 flyby, fell on 30 September 1985, the following equinox on 6/7 December 2007 —
a good 22 years later —, and the next northern summer solstice on 11 April 2030 — another good
22 years after that, making about 44.5 years rather than the 42 years expected from an even split
between the two solstices. Because the rings lie
exactly in this strongly tilted equatorial plane, and Uranus's own orbital plane deviates from
the ecliptic by only 0.77°, they appear from Earth almost as tilted as the rotation axis itself.

The rings were discovered on 10 March 1977, when a planned stellar occultation showed five brief,
symmetric dimmings of the star's light minutes before and after the main event – the chance
discovery of at least five narrow, dense rings ([Elliot et al. 1977](literatur:elliot-1977)).
Up close, the Uranian system has so far been visited by a single spacecraft:
[Voyager 2](quelle:nasa-voyager-2) passed the planet on 24 January 1986 at an altitude of about
81,600 km, near that solstice – the Sun illuminated only the southern hemispheres of Uranus and
its moons at the time ([Stone and Miner 1986](literatur:stone-1986)). Everything since has come
from Earth or Earth orbit: the first Earth-based ring-plane crossing since the discovery, in
2007, revealed the unlit side of the rings for the first time and showed that the fine dust
component had changed markedly since Voyager ([de Pater et al. 2007](literatur:depater-2007)).
The outer dust rings ν and μ, discovered with Hubble between 2003 and 2005 – the latter sharing
its orbit with the small moon Mab ([Showalter and Lissauer 2006](literatur:showalter-2006)) –
received their most thorough characterisation yet in 2026: combined Keck, JWST, and Hubble data
show that the μ ring closely matches water ice from impacts on Mab, while the ν ring consists of
rocky material with 10 to 15 % carbon-rich organics – two rings of entirely different origin
([de Pater et al. 2026](literatur:depater-2026)).

## Model limitations

- **Sphere without oblateness:** `radiusKm` is set to $25362\,\mathrm{km}$, the volumetric mean,
  about 0.8 % below the real equatorial radius (flattening 2.29 %); `render/bodies.ts` scales
  every sphere with a single factor.
- **Rings as a computed strip**, as described at [Rings](thema:ringe): a base width of 260 km
  plus six times the real width, diffuse components amplified twelvefold and capped at 0.12,
  physical opacity following $1-e^{-\tau}$ from 10 % (λ) to 78 % (ε). Without thickness the strip
  vanishes completely at $B=0$; in reality the rings are only a few kilometres thick.
- **No ν or μ ring:** the strip only spans 37,800 to 51,600 km; the two diffuse outer dust rings
  are missing, as are the small shepherd moons Cordelia, Ophelia, and Puck, absent from the
  catalogue.
- **Pole fixed in space**, without the small real precession.
- **Rotation period** $17.24\,\mathrm{h}$ (Voyager radio measurement) versus the
  $17.247864\,\mathrm{h}$ from Hubble aurora observations in 2025
  ([Lamy et al. 2025](literatur:lamy-2025)): 28.3 s too short per rotation, about 70° of phase
  drift since J2000.
- **Lighting without an atmosphere** and without seasonal cloud bands; exposure locked onto
  Uranus itself (`exposureTargetId`, `render/exposure.ts`); Miranda through Oberon shown as
  fallback colours without a texture.
- **Time lapse:** it ramps up geometrically over 2 s at scene start to 0.3 days/s
  (`RATE_BLEND_SEC`, `app/cinema.ts`); unlike the lunar-eclipse scene, the clock does not jump to
  a particular date here. Further simplifications: [limits of the model](thema:modell).

*As of September 2026*
