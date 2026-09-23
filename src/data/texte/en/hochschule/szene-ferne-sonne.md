# Scene: From Neptune to the distant Sun

The camera stands behind [Neptune](objekt:neptune), on its side facing away from the Sun, and
looks back at it; the [Sun](objekt:sun) stands next to it in the frame. In reality Neptune is
almost entirely dark from here, with only a narrow crescent lit by the Sun, and the Sun itself is
just a point of light about 64″ across — in the image, the display's fill light brightens
Neptune's night side to grey, and in "Diagram" the Sun itself appears as a clear disc.

## What the view shows

The `sichtlinie` (line-of-sight) path type (`render/camera/cinema.ts`) places the camera on the
Neptune–Sun connecting line, on the side of Neptune facing away from the Sun, and points the view
firmly at Neptune itself: `lookAtId: 'sun'` only sets the direction of this line here, not the
camera's target (design doc §4); `blickzielVon` accordingly returns the standing body Neptune, not
the Sun. Radius: 14 displayed Neptune radii ($R_\mathrm{N}=24\,622\,\mathrm{km}$) times a scatter
factor; at 0.9/1.0/1.5 that is 310,237/344,708/517,062 km. The base azimuth of 196° sits 16°
beyond the 180° that would hit the direction facing away from the Sun exactly, with a ± 4° azimuth
and ± 3° elevation offset per draw — so the camera stands, on every draw, close to but not exactly
on the night side.

The angular separation between the Sun's and Neptune's centres in the frame therefore ranges, by
scale and draw, from about 10° to about 21° (grid search over the whole drawn range: "Realistic"
12.0°–21.0°, "Diagram" 11.7°–20.8°, "Compact" 10.2°–19.0°) — the Sun stays within the field of view
(half field 25° vertical) in every case, but well apart from Neptune. The phase angle
Sun–Neptune–camera follows as $180^\circ-\theta$, about 159° to 170°; the illuminated fraction
$(1+\cos\alpha)/2$ of a sphere accordingly comes out to only about 1 to 3 percent — Neptune shows
the camera a narrow, crescent-shaped lit area toward the Sun and its night side otherwise.

The Sun's real angular diameter from here is about 64″ (own calculation with the Neptune–Sun
distance of 4,505,484,129 km at epoch J2000: 63.7″; [the Sun](objekt:sun) gives 64″, rounded); its
light takes a good four hours to reach Neptune from there (own calculation:
$4\,505\,484\,129\,\mathrm{km}/299\,792.458\,\mathrm{km\,s^{-1}}=4.17\,\mathrm{h}$). The
nominal solar constant of 1361 W/m² at 1 au ([Kopp and Lean 2011](literatur:kopp-2011) measured
$1360.8\pm0.5\,\mathrm{W\,m^{-2}}$ at the 2008 minimum) works out to only 1.50 W/m² at Neptune's
distance of 30.12 au — one nine-hundred-and-seventh of Earth's (own calculation; for
17 September 2026, [Albedo and brightness](thema:photometrie) gives the ratio used in the model
as 1/883). With the peer-reviewed solar brightness $m_\odot=-26.75$ (1 au, V band) from the same
text, the Sun's apparent magnitude from Neptune follows as
$m=-26.75+5\log_{10}(30.12)=-19.36$ — about 440 times brighter than the full moon seen from Earth
(−12.74, NSSDC Moon Fact Sheet).

In the 30 s at 0.5 days per second, 15 simulated days pass: at a $16.11\,\mathrm{h}$ rotation
period ([Neptune](objekt:neptune)), that is 22.3 rotations; on its orbit, Neptune moves only about
0.09° further in that time (Kepler orbital period 164.9 years), barely 7.05 million km or
0.047 au — vanishingly small against its 4.5-billion-km orbital radius.

## Background

Neptune's light budget hangs almost entirely on this one nine-hundredth of sunlight. So far only
[Voyager 2](quelle:nasa-voyager-2) has seen Neptune up close, on
25 August 1989. Its sister ship Voyager 1, already far outside the planetary orbits, looked back
once more on 14 February 1990: the imaging sequence of the "family portrait" began, of all places,
at Neptune, the faintest target, and worked its way from there toward the Sun
([First-Ever Solar System Family Portrait](quelle:nasa-family-portrait)).

Voyager 2 itself flew on past Neptune and, on 5 November 2018 at 119 au, crossed the
heliopause — the boundary where the solar wind gives way to the interstellar medium
([Stone et al. 2019](literatur:stone-2019)). That is almost four times Neptune's own solar
distance: the Sun's influence reaches far beyond the planetary orbits, just no longer as visible
light.

## Model limitations

- **Sun enlarged:** in "Diagram" it appears 1.2° across instead of 64″
  ([the Sun](objekt:sun)) — about 68 times too large (own calculation).
- **Exposure now on Neptune:** for `path: 'sichtlinie'`, `blickzielVon` returns the standing
  body, here Neptune, instead of the Sun; `exposureTargetId` therefore exposes on the body actually
  looked at, as in practically every other scene. `targetExposure` (`render/lighting.ts`) comes out
  to about 24 in "Realistic" (Neptune's true distance of 30.12 au) and about 11 in "Diagram"
  (compressed to 7.7 au, $r^{0.6}$) — against the value π at 1 au, that is about 7.7 and 3.4 times,
  respectively (own calculation: $30.12^{0.6}=7.7$, $7.7^{0.6}=3.4$). Neptune's lit side therefore
  lands, unlike before, exactly on the reference value (`dayLevel`/π equal to
  `EXPOSURE_REFERENCE`·`brightness`) regardless of scale. This factor has no effect on the Sun
  visible in the same frame, because its material is unlit and ignores exposure
  ([the Sun](objekt:sun)). The night-side fill light, which
  is independent of scale ($\mathrm{nightFill}=0.25$, `store/index.ts`; emissive equal to
  $\mathrm{nightFill}\cdot\mathrm{dayLevel}/\pi$, `render/lighting.ts`), raises Neptune's
  physically near-black night side to a quarter of the now correctly set day level — in the image
  Neptune therefore appears mostly as a grey disc (median around 153 of 255) with the narrow,
  brighter crescent on top, instead of the near-black night side of reality.
- **No scattering, no glare** beyond the bloom pass (`render/postfx.ts`): only objects on the
  bloom layer get the extra glow; no atmospheric or optical scattering model exists.
- **Star background without real luminosities:** catalogue magnitude only sets point size and,
  via the B–V index, colour (`render/starfield.ts`), not a physically exposed brightness the way
  the bodies get.
- **Scale:** in "Diagram", `sim/scale.ts` compresses Neptune's true 30-au distance from the Sun
  with $r^{0.6}$; the camera's distance from Neptune itself is unaffected by this, further
  simplifications in [Model limitations](thema:modell).

*As of September 2026*
