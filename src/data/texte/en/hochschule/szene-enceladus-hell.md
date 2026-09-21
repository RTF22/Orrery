# Scene: Enceladus in brilliant light

The camera circles [Enceladus](objekt:enceladus) closely, on its sun-facing side – the moon with the
highest measured albedo in the solar system, whose [tidal heating](thema:gezeiten) through the
resonance with [Dione](objekt:dione) drives the plumes mentioned in the background section.
[Saturn](objekt:saturn) fills a large part of the background; the companion scene
[Hazy Titan in front of Saturn](szene:titan-dunst) shows the same planet from a larger, darker moon.

## What the view shows

The `orbit` path type keeps the camera on a sphere around Enceladus's centre: radius 5 displayed
Enceladus radii (252 km) times the scatter factor, azimuth fixed at 225.58° (scatter ±20°, rate
1.5°/s, giving 45° over 30 s), elevation fixed per draw between 2° and 18° (default 10°, scatter
additive −8° to 8°). At scatter factor 0.8/1.0/1.5, Enceladus's own angular diameter is
28.955/23.074/15.325°.

The azimuth 225.58° is the Sun's direction as seen from Saturn at epoch J2000 – recomputed from
Saturn's position via `positionAt`, this gives azimuth 225.579° and elevation 2.307°, essentially
exactly the coded value (225.58°/2.31°). The parallax between "direction Saturn→Sun" and "direction
Enceladus→Sun" is $\arctan(238420/1.37\cdot10^{9})=0.01^\circ$, well below any measurement precision
used here. By the scene's actual time, though, this fixed value no longer holds: Saturn advances
along its orbit at its mean motion of $360^\circ/29.4464\,\mathrm{a}=12.23^\circ$ per year; the
recomputation gives an unwrapped offset of 324.96° between J2000 and 21 September 2026 (26.72 years)
– equivalent to a remainder of 35.04° by which the coded solar direction now trails the true one. As
a result the Sun–Enceladus–camera phase angle at the default draw grows from 7.7° (the design value
at J2000, near full light) to 35.6° (as of 21 September 2026, a visible crescent edge) – see "Model
limitations".

Saturn's own angular diameter as seen from Enceladus is $2\arcsin(58232/238420)=28.3^\circ$, more
than half the frame height. Because Enceladus is [tidally locked](thema:gebundene-rotation) and the
scene's 30 seconds at 0.05 days/s amount to 1.5 simulated days, that is 1.095 orbits (orbital period
1.370218 days), its Saturn-facing side also turns once all the way around relative to the nearly
fixed camera direction: the angle between the direction Enceladus→Saturn and the direction
Enceladus→camera ranges from 18° to 165° over the scene – the camera therefore sees, one after
another, practically every longitude of the surface, not just one fixed hemisphere.

Because Enceladus's orbit (238,420 km) lies within the shadow threshold
$\arcsin(58232/238420)=14.14^\circ$ and the Sun on 21 September 2026 stands only $7.54^\circ$ above
Saturn's ring plane (the same figure as in [Rings](thema:ringe)), Enceladus crosses Saturn's full
umbra along an arc of about 24° of its orbit (6.7%). Since the scene's 1.095 orbits cover more than a
full circle, it hits this arc at least once in every draw – Enceladus visibly darkens for about 1.8 s
of real time (24° at 0.05 days/s), because `waehleOkkluder` always inserts Saturn as the first
occluder for its moons, the same geometry as for [eclipses](thema:finsternis) elsewhere.

## Background

At 0.55 µm, Enceladus reflects $1.24 \pm 0.01$ of the incident light – the highest geometric albedo
ever measured in the solar system ([Buratti et al. 2022](literatur:buratti-2022)). Values above 1 are
not a contradiction: near zero phase angle, a body can return more light than an ideally diffuse flat
disc of the same size would – a steep, narrow rise that Hubble observations traced between 0.26° and
6.4° phase angle, best matched by moderate shadow-hiding combined with narrow coherent backscattering
([Verbiscer et al. 2005](literatur:verbiscer-2005)). Enceladus itself supplies the polish: its
plumes feed Saturn's E ring with fine ice dust, and the moons embedded in it carry similarly high
geometric albedos on average, because their surfaces are continually dusted with the same fresh frost
([Verbiscer et al. 2007](literatur:verbiscer-2007)). The plumes themselves, rising from four parallel
fractures at the south pole, were discovered by Cassini's camera in 2005 in strongly backlit images at
high phase angle – only in backlight do the fine, few-micrometre particles grow bright enough to
stand out against the dark sky ([Porco et al. 2006](literatur:porco-2006)). This scene's camera shows
little of that: at elevations between 2° and 18°, the south pole and its tiger stripes mostly stay
outside the frame.

## Model limitations

- **Albedo instead of a phase function:** the catalogue albedo is set to 1.0 (the older NSSDC fact
  sheet value, not the newer 1.24/0.89), the texture map averages only 0.172 linear and is normalised
  onto that with a factor of 5.80 (the same figures as in
  [Albedo and brightness](thema:photometrie)); the model has no opposition effect or backscatter
  surge, only Lambertian scattering.
- **Dimmed brightness, computed:** at standard brightness 1, the camera exposes so that a full-albedo
  target reaches linear 1.0 at its brightest pixel ($\mathrm{uTag}=\pi$, formula albedo·uTag/π);
  after the three-ACES curve (factor $1/0.6$, RRTAndODTFit) and sRGB, that lands at 226 of 255. The
  material model itself, computed without specular highlight and night-side fill, reaches only the
  geometric albedo $0.640\,p$ instead of $p$ (a Lambertian sphere times the Fresnel factor, derived
  there) – 0.64 instead of 1.0 for Enceladus, about 209 of 255 by the same calculation. The "overall
  dimmed brightness" the scene comment in `scenes.ts` notes is therefore not a bug of this scene but
  the same effect present for every body in the catalogue, most noticeable at Enceladus because of
  its unusually high real albedo.
- **No plumes, no E ring:** the renderer draws neither the water-vapour-and-ice plumes nor the ring
  they feed; Enceladus appears as a calm, textured sphere.
- **Exposure:** without a `lookAtId`, the camera exposes on Enceladus itself (`exposureTargetId`,
  `render/exposure.ts`).
- **Saturn and ring:** a sphere without flattening, the ring a disc without thickness – the same
  simplifications as at [Saturn](objekt:saturn) and [Rings](thema:ringe).
- **Solar direction fixed from J2000:** as computed above, the azimuth 225.58° has fallen about 35°
  behind the true solar direction since the year 2000 – at a drift of about 12.2° per year, a
  deviation that grows with every further decade and shifts the scene's phase angle accordingly.
- **Time-lapse:** it eases in geometrically over 2 s at the start of the scene onto 0.05 days/s
  (`RATE_BLEND_SEC`). Further simplifications: [limits of the model](thema:modell).

*As of September 2026*
