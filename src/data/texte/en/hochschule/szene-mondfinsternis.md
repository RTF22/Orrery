# Scene: Lunar eclipse

The shadow of the [Earth](objekt:earth) sweeps across the full [Moon](objekt:moon); see also
[eclipses](thema:finsternis).

## What the view shows

At the start, Orrery jumps to the next umbral eclipse after the current time; the search skips
penumbral eclipses. The clock then stands one tenth of the duration from first to last umbral
contact (U1 to U4) before U1. The nominal time-lapse rate of 0.0035 days per second would give
3.78 h in the 45 s (see time-lapse below).

The camera stands four lunar radii from the Moon's centre towards the Earth, offset by 8° in
ecliptic latitude and drifting in longitude at 0.4° per second, and looks at the lit face of the
full Moon. Each playback varies the distance (factor 0.8 to 1.3), latitude (±6°) and longitude
(±20°). Without variation the Moon subtends $2 \arcsin(1/4) = 29.0^\circ$ in a vertical field of
view of 50°. The Earth subtends 1.8° to 2.1° as seen from the camera and, once the camera has
swung in, lies more than 138° from the viewing direction, outside the frame.

## Background

For a spherical Earth without an atmosphere, the umbra and penumbra at lunar distance $d$ and
solar distance $D$ have approximately the radii

$$r_\mathrm{u} = R_\oplus - d\,\frac{R_\odot - R_\oplus}{D}, \quad r_\mathrm{p} = R_\oplus + d\,\frac{R_\odot + R_\oplus}{D}$$

which for the model's mean lunar orbit and 1 au gives 4599 km and 8175 km; the umbra is 2.65
times as wide as the Moon.

The observed umbra is larger. Chauvenet enlarged the angular radii of both shadows by 1/50,
Danjon added an opaque layer of 75 km to the Earth's radius (about 1/85). The NASA canon follows
Danjon but cites crater timings from 1972 to 1982 that support about 2%
([Espenak and Meeus 2009](literatur:espenak-2009)). A layer of height $h$ enlarges $r_\mathrm{u}$
by $h\,(1 + d/D) \approx h$. More than 20,000 crater timings at 94 eclipses from 1842 to 2011 give
a mean layer height of 86.9 km (uncertainty of the mean 0.2 km) with no trend in lunar distance,
whereas the percentage enlargement (mean 1.88%) depends somewhat on it. Herald and Sinnott
recommend a Danjon-like approach for contact times, with a layer height of 87 km above the oblate
Earth; in 2014 the Astronomical Almanac still used 1.02
([Herald and Sinnott 2014](literatur:herald-2014)).

The atmosphere refracts light into the umbra; lower, denser layers attenuate it more strongly and
bend it further inwards, so the brightness usually increases towards the edge
([Espenak and Meeus 2009](literatur:espenak-2009)). Rayleigh scattering weakens short wavelengths
more strongly: when the stratosphere is little perturbed, the eclipsed Moon tends to look copper to
deep red, and darker when it is turbid ([Guillet et al. 2023](literatur:guillet-2023)). The [Danjon
scale](thema:photometrie) for total eclipses runs from L = 0, Moon almost invisible, to L = 4, very bright copper-red
or orange ([Espenak and Meeus 2009](literatur:espenak-2009)). Among 46 eclipses drawn on by Guillet
et al., L = 0 occurred only when the stratospheric aerosol optical depth exceeded about 0.1
([Guillet et al. 2023](literatur:guillet-2023)).

## Model limitations

- **Shadow:** each surface point receives direct light according to the visible part of the
  uniformly bright solar disc behind the spherical Earth, without oblateness, atmosphere or
  enlargement. This shadowing applies only with the "Shadows" switch on and the Earth visible.
  Only the search enlarges the umbra by 2%.
- **Colour:** inside the umbra only the night-side fill light remains (by default a quarter of
  the day level), tinted with the fixed colour value #ff9a5c, and in the penumbra in proportion
  to the covered part of the solar disc. The linear luminance at the centre of the disc thus
  drops by 2.4 to 2.6 magnitudes depending on the angle of incidence, regardless of eclipse depth
  and lunar distance. On 30 December 1963 the totally eclipsed Moon reached only +4.1 mag
  ([Herald and Sinnott 2014](literatur:herald-2014)), almost 17 magnitudes below the
  [mean full Moon](quelle:nssdc-moon).
- **Timing:** the lunar orbit is a Kepler ellipse without periodic perturbations; in addition,
  the node and perigee rates after Meeus contain the [precession](thema:bezugssysteme) of 1.4° per century, whereas the
  mean longitude and the Earth's orbit do not. Against the [NASA catalogue](quelle:nasa-eclipse),
  the model finds 135 of the 143 umbral eclipses from 1951 to 2050, with the maximum off by up to
  3.0 h (root mean square 1.8 h); eight small partial eclipses are missing, and eleven differ in
  type, only three without the precession in the rates. The search classifies the penumbral
  eclipses of 17 September 1959 and 3 March 2045 as partial.
- **Time-lapse:** after the jump, the rate glides from its previous value to the nominal one;
  coming from 0.9 days per second, about 2 h pass in the first second (60 frames/s), and all or
  part of the eclipse goes by unseen.

*As of September 2026*
