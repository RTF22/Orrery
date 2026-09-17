# Scene: Lunar eclipse

The scene shows the shadow of the [Earth](objekt:earth) sweeping across the full
[Moon](objekt:moon); for context see [eclipses](thema:finsternis).

## What the view shows

At the start, Orrery searches from the current time for the next full Moon at which the Moon
touches the umbra; the search skips penumbral eclipses. The clock jumps to one tenth of the
duration from first to last umbral contact (U1 to U4) before U1 and then runs at 0.0035 days per
second, so the 45 s of the scene cover 3.78 h. If U1 to U4 lasts longer than 206 min, U4 falls
after the end of the scene; this applies to 65 of the 137 eclipses the model finds from 1951 to
2050.

The camera stands four lunar radii from the Moon's centre towards the Earth, offset by 8° in
ecliptic latitude and drifting in longitude at 0.4° per second, and looks at the lit face of the
full Moon. Each playback varies the distance (factor 0.8 to 1.3), latitude (±6°) and longitude
(±20°). The Moon subtends $2 \arcsin(1/4) = 29.0^\circ$ (22.2° to 36.4°) in a vertical field of
view of 50°. The Earth, subtending 1.8° to 2.1° as seen from the camera, lies more than 138°
from the viewing direction and stays out of the frame; seen from the Moon, the Sun measures 0.52°
to 0.54°. Because the scale presets enlarge body radii and lunar distances by the same factor,
these angles hold for every preset.

## Background

For a spherical Earth without an atmosphere, the umbra and penumbra at lunar distance $d$ and
solar distance $D$ have approximately the radii

$$r_\mathrm{u} = R_\oplus - d\,\frac{R_\odot - R_\oplus}{D}, \quad r_\mathrm{p} = R_\oplus + d\,\frac{R_\odot + R_\oplus}{D}$$

which for the model's mean lunar orbit and 1 au gives 4599 km and 8175 km; the umbra is 2.65
lunar diameters wide.

The observed umbra is larger. Chauvenet enlarged the angular radii of both shadows by 1/50;
Danjon instead added an opaque layer of 75 km to the Earth's radius (about 1/85), and the NASA
canon follows him ([Espenak and Meeus 2009](literatur:espenak-2009)). A layer of height $h$
enlarges $r_\mathrm{u}$ by $h\,(1 + d/D) \approx h$, by almost the same distance at any lunar
distance. More than 20,000 crater timings at 94 eclipses from 1842 to 2011 give an effective
height of 86.9 ± 0.2 km with no trend in lunar distance, whereas the percentage enlargement (mean
1.88%) depends somewhat on it; even at the very dark eclipse of 30 December 1963 the height was an
ordinary 87.1 ± 1.4 km ([Herald and Sinnott 2014](literatur:herald-2014)).

Light reaches the umbra through refraction in the atmosphere. Lower, denser layers bend it more
strongly and illuminate the inner parts, so the brightness usually increases towards the edge
([Espenak and Meeus 2009](literatur:espenak-2009)). Rayleigh scattering weakens short wavelengths
more strongly: with an unperturbed stratosphere the eclipsed Moon tends to look copper to deep
red, with a turbid one darker ([Guillet et al. 2023](literatur:guillet-2023)). The Danjon scale
for total eclipses runs from L = 0, Moon almost invisible, to L = 4, very bright copper-red or
orange ([Espenak and Meeus 2009](literatur:espenak-2009)). The brightnesses of 21 eclipses from
1960 to 1982 yield globally averaged aerosol optical depths, similar after El Chichón in 1982 and
after Agung in 1963 ([Keen 1983](literatur:keen-1983)). Among 46 well-observed eclipses, L = 0
occurred only when the stratospheric aerosol optical depth exceeded about 0.1; Guillet et al.
build on this, among other things, to date eruptions of the High Middle Ages
([Guillet et al. 2023](literatur:guillet-2023)).

## Model limitations

- **Shadow:** the Earth and the Sun are spheres. Each surface point receives direct light in
  proportion to the visible part of the uniformly bright solar disc; both shadows are purely
  geometric, without oblateness, atmosphere or enlargement. Only the search enlarges the umbra by
  2%, so contact with the rendered umbra follows U1 by a median of 1.8 min.
- **Colour:** inside the umbra only the night-side fill light remains (by default a quarter of
  the day level), tinted with the fixed colour value #ff9a5c, and in the penumbra in proportion
  to the covered part of the solar disc. The linear luminance at the centre of the disc thus
  drops by about 2.6 magnitudes, the same for every eclipse. In 1963 the Moon reached only
  +4.1 mag ([Herald and Sinnott 2014](literatur:herald-2014)), almost 17 magnitudes below the
  [mean full Moon](quelle:nssdc-moon) at −12.74 mag.
- **Timing:** the lunar orbit is a Kepler ellipse with linearly advancing angles and no periodic
  perturbations. Against the [NASA](quelle:nasa-eclipse) catalogue, the model finds 135 of the
  143 umbral eclipses from 1951 to 2050, with the maximum off by up to 3.0 h (root mean square
  1.8 h); eight partial eclipses with umbral magnitude up to 0.10 are missing, two penumbral
  eclipses become partial, and eleven differ in type. Starting from September 2026, the search
  skips the eclipse of 12 January 2028 and shows the one of 6 July 2028, with its maximum at 16:16
  instead of 18:21 dynamical time. Using UTC as TDB accounts for only 69 s.
- **Time-lapse:** after the jump, the rate glides from its previous value to 0.0035 days per
  second; coming from 0.9 days per second, 2.1 h pass in the first second (at 60 frames per
  second), and all or part of the eclipse goes by unseen.

*As of September 2026*
