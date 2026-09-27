# Assets

**English** | [Deutsch](ASSETS.de.md)

This file documents the origin of all third-party files stored in and shipped
with the repository (textures, star catalogue, Basis transcoder), fulfilling
the attribution requirement of the CC BY licence. A test
(`scripts/assets.test.ts`) checks that every texture folder under
`public/textures/` is named here.

## Texture source: Solar System Scope

All ten albedo textures come from Solar System Scope
(<https://www.solarsystemscope.com/textures/>), resolution 2k (2048×1024 pixels,
equirectangular). Author: Solar System Scope. Licence: Creative Commons
Attribution 4.0 International (CC BY 4.0, <https://creativecommons.org/licenses/by/4.0/>).
According to the source, the textures are based on NASA elevation and imaging
data, colour-matched to imagery from the Messenger, Viking and Cassini probes
and the Hubble Space Telescope.

Processing: none — the files were taken over unchanged, in the resolution
delivered by the source (2048×1024, JPEG), and only renamed/relocated. Since
the switch to KTX2 texture levels, these JPEGs are versioned sources under
`assets-quellen/texturen/<koerper>/albedo.jpg` and are no longer shipped; the
shipped files are the KTX2 levels generated from them under
`public/textures/<koerper>/albedo-<breite>.ktx2`, see section "Texture
levels (KTX2)" below.

| File | Source (URL) | Author | Licence | Dimensions | Size | Processing |
|---|---|---|---|---|---|---|
| `assets-quellen/texturen/sun/albedo.jpg` | [2k_sun.jpg](https://www.solarsystemscope.com/textures/download/2k_sun.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 822,427 bytes | kept unchanged, only renamed |
| `assets-quellen/texturen/mercury/albedo.jpg` | [2k_mercury.jpg](https://www.solarsystemscope.com/textures/download/2k_mercury.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 872,555 bytes | kept unchanged, only renamed |
| `assets-quellen/texturen/venus/albedo.jpg` | [2k_venus_surface.jpg](https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 885,075 bytes | kept unchanged, only renamed (surface map, not the cloud-cover variant) |
| `assets-quellen/texturen/earth/albedo.jpg` | [2k_earth_daymap.jpg](https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 463,087 bytes | kept unchanged, only renamed (day-side map, without cloud cover) |
| `assets-quellen/texturen/mars/albedo.jpg` | [2k_mars.jpg](https://www.solarsystemscope.com/textures/download/2k_mars.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 750,547 bytes | kept unchanged, only renamed |
| `assets-quellen/texturen/jupiter/albedo.jpg` | [2k_jupiter.jpg](https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 498,976 bytes | kept unchanged, only renamed |
| `assets-quellen/texturen/saturn/albedo.jpg` | [2k_saturn.jpg](https://www.solarsystemscope.com/textures/download/2k_saturn.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 199,916 bytes | kept unchanged, only renamed (without ring texture) |
| `assets-quellen/texturen/uranus/albedo.jpg` | [2k_uranus.jpg](https://www.solarsystemscope.com/textures/download/2k_uranus.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 77,751 bytes | kept unchanged, only renamed |
| `assets-quellen/texturen/neptune/albedo.jpg` | [2k_neptune.jpg](https://www.solarsystemscope.com/textures/download/2k_neptune.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 241,580 bytes | kept unchanged, only renamed |
| `assets-quellen/texturen/moon/albedo.jpg` | [2k_moon.jpg](https://www.solarsystemscope.com/textures/download/2k_moon.jpg) | Solar System Scope | CC BY 4.0 | 2048×1024 | 1,053,869 bytes | kept unchanged, only renamed |

None of the ten files is a placeholder — all were successfully downloaded
from the source named above and are present at the required resolution.

## Star catalogue source: HYG database

The star background (`src/data/stars/hyg.json`) comes from the HYG database
(<https://github.com/astronexus/HYG-Database>), a catalogue compiled by
Astronexus from the Hipparcos, Yale Bright Star and Gliese catalogues.
Author: Astronexus. Licence: Creative Commons Attribution-ShareAlike 4.0
International (CC BY-SA 4.0, <https://creativecommons.org/licenses/by-sa/4.0/>).

Raw file used: `hyg/CURRENT/hygdata_v41.csv` (HYG version 4.1), as of commit
`3bf37f4b2d5460e1278286320d1d62fab9b493c1` from 17 August 2024, original size
33,932,548 bytes with 119,626 entries.

Processing: from the raw file, only stars with apparent magnitude (field
`mag`) ≤ 6.0 were kept (the limiting magnitude visible to the naked eye), and
the Sun itself (field `dist` = 0) was excluded, since it is already rendered
as its own illuminated body at its true position (see `src/render/bodies.ts`)
and should not additionally appear as a fixed star in the sky. Of the
remaining 5070 stars, only four fields were kept: right ascension in degrees
(raw field `ra` is given in hours and was multiplied by 15), declination in
degrees (raw field `dec`), apparent magnitude (raw field `mag`) and B−V
colour index (raw field `ci`). 23 stars without a known colour index received
the neutral reference value 0.0 instead of `NaN` (the zero point of the
colour-index scale, corresponding to a white A0V star). All four fields were
rounded to reduce size (right ascension and declination to three, magnitude
and colour index to two decimal places).

| File | Source (URL) | Author | Licence | Entries | Size | Processing |
|---|---|---|---|---|---|---|
| `src/data/stars/hyg.json` | [HYG v41: hygdata_v41.csv](https://github.com/astronexus/HYG-Database/blob/3bf37f4b2d5460e1278286320d1d62fab9b493c1/hyg/CURRENT/hygdata_v41.csv) | Astronexus | CC BY-SA 4.0 | 5070 stars | 247,290 bytes | filtered to mag ≤ 6.0, Sun excluded, reduced to four fields (ra/dec in degrees, mag, ci), rounded — see description above |

## Milky Way: NASA SVS Deep Star Maps 2020

The sky background (`public/textures/milchstrasse/`) is based on the map
"Milky Way Background" from the "Deep Star Maps 2020" of the NASA Goddard
Scientific Visualization Studio (<https://svs.gsfc.nasa.gov/4851>): plate
carrée in ICRF/J2000, computed from 1.7 billion stars from Gaia DR2 without
the bright Hipparcos and Tycho stars. Attribution: "NASA/Goddard Space Flight
Center Scientific Visualization Studio. Gaia DR2: ESA/Gaia/DPAC". The SVS
declares its content public domain unless noted otherwise
(<https://svs.gsfc.nasa.gov/help/>); the underlying Gaia DR2 share is,
according to ESA, licensed under CC BY-NC 3.0 IGO with attribution
(<https://www.cosmos.esa.int/web/gaia-users/license>). Orrery is a
non-commercial project.

Processing: `scripts/milchstrasse-bauen.ts` and `scripts/milchstrasse.py` map
the HDR image to 8-bit sRGB via a power curve (the band's median and 99.5th
percentile as control points) with the inverse of the ACES tone mapping built
in, flip it vertically (KTX2 has no flipY) and encode it as KTX2.

Author and licence are the same for all three files in this table: author
"NASA/GSFC SVS; Gaia DR2: ESA/Gaia/DPAC", licence "SVS public domain; Gaia
share CC BY-NC 3.0 IGO (attribution required)".

| File | Source | Dimensions | Size | Processing |
|---|---|---|---|---|
| `public/textures/milchstrasse/himmel-1024.ktx2` | [SVS: milkyway_2020_8k.exr](https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004851/milkyway_2020_8k.exr) | 1024×512 | 59,941 bytes | see above, ETC1S |
| `public/textures/milchstrasse/himmel-2048.ktx2` | as above | 2048×1024 | 1,069,543 bytes | see above, UASTC |
| `public/textures/milchstrasse/himmel-8192.ktx2` | as above | 8192×4096 | 30,310,600 bytes | see above, UASTC |

## Texture source: Solar System Scope (dwarf planets)

Four more albedo textures again come from Solar System Scope
(<https://www.solarsystemscope.com/textures/>), this time for four of the
five dwarf planets: Ceres, Eris, Haumea, Makemake. Author: Solar System
Scope. Licence: Creative Commons Attribution 4.0 International (CC BY 4.0,
<https://creativecommons.org/licenses/by/4.0/>).

At the source itself, these four files carry the name suffix "_fictional"
(e.g. `2k_ceres_fictional.jpg`): unlike the ten original bodies, no
comprehensive photographic surface maps exist for these dwarf planets (no
space probe has mapped them from close range) — the textures are stylised
artistic renderings from the source, approximated to the known colour and
albedo, not real photographs. This is stated openly here, not concealed.

A section of its own instead of a row in the table above, because these four
files — unlike the ten original textures — are stored at 1024×512 instead of
2048×1024 (moons and dwarf planets are rarely seen filling the frame in the
simulation).

Processing: downscaled from the 2k source resolution (2048×1024, JPEG) to
1024×512, otherwise unchanged.

Author and licence are the same for all four files in this table: author
Solar System Scope, licence CC BY 4.0.

| File | Source (URL) | Dimensions | Size | Processing |
|---|---|---|---|---|
| `assets-quellen/texturen/ceres/albedo.jpg` | [2k_ceres_fictional.jpg](https://www.solarsystemscope.com/textures/download/2k_ceres_fictional.jpg) | 1024×512 | 215,184 bytes | downscaled from 2048×1024 to 1024×512 |
| `assets-quellen/texturen/eris/albedo.jpg` | [2k_eris_fictional.jpg](https://www.solarsystemscope.com/textures/download/2k_eris_fictional.jpg) | 1024×512 | 200,229 bytes | downscaled from 2048×1024 to 1024×512 |
| `assets-quellen/texturen/haumea/albedo.jpg` | [2k_haumea_fictional.jpg](https://www.solarsystemscope.com/textures/download/2k_haumea_fictional.jpg) | 1024×512 | 192,721 bytes | downscaled from 2048×1024 to 1024×512 |
| `assets-quellen/texturen/makemake/albedo.jpg` | [2k_makemake_fictional.jpg](https://www.solarsystemscope.com/textures/download/2k_makemake_fictional.jpg) | 1024×512 | 207,523 bytes | downscaled from 2048×1024 to 1024×512 |

Pluto itself is deliberately missing here: Solar System Scope no longer
offers a Pluto texture (checked on 12 September 2026: the previously used
download address `2k_pluto.jpg` returns 404). Pluto instead appears in the
following section — with a real New Horizons image, which would have been
preferable to the fictional SSS variant anyway.

## Texture source: USGS Astrogeology / NASA (moons and dwarf planets, public domain)

15 more albedo textures — the large moons plus Pluto and Charon — come from
public-domain maps produced by NASA missions (Voyager, Galileo, Cassini, New
Horizons, Viking) or the USGS Astrogeology Science Center. The files were
obtained via Wikimedia Commons, which mirrors the same public-domain original
files and documents author and licence per file; Source (URL) below links to
the respective Commons file page, where the attribution and licence template
can be verified.

**Public-domain notice instead of a CC BY line:** All files in this section
are works of the US federal government or the mission teams it commissioned,
and are in the public domain, with no copyright restriction; attribution is
not legally required but is given here anyway. See NASA's media guidelines:
<https://www.nasa.gov/nasa-brand-center/images-and-media/> ("NASA content —
images, audio, video... — is generally not copyrighted and may be used for
educational or informational purposes").

Processing (all files): downscaled to 1024×512; for Mimas and Iapetus, the
title line, axis labels/border lines and the caption with scale bar and
institute logos were additionally cropped out, since in the respective NASA
original photo they are part of the image file (details per row).

| File | Source (URL) | Author | Licence | Dimensions | Size | Processing |
|---|---|---|---|---|---|---|
| `assets-quellen/texturen/pluto/albedo.jpg` | [Commons: Pluto_color_mapmosaic.jpg](https://commons.wikimedia.org/wiki/File:Pluto_color_mapmosaic.jpg) | NASA / Johns Hopkins University Applied Physics Laboratory / Southwest Research Institute | Public Domain (NASA media policy) | 1024×512 | 96,492 bytes | downscaled from 5926×2963 to 1024×512; New Horizons global mosaic — the far side not visited by the probe is unlit in it and appears black (about 30% of the area), see the gap note below |
| `assets-quellen/texturen/charon/albedo.jpg` | [Commons: Cpmap_cyl_PS717_HR_180.jpg](https://commons.wikimedia.org/wiki/File:Cpmap_cyl_PS717_HR_180.jpg) | JPL/NASA (New Horizons mission team) | Public Domain (NASA media policy) | 1024×512 | 65,838 bytes | downscaled from 5000×2500 to 1024×512; as with Pluto, the unlit far side (about a third of the area) is unlit and black |
| `assets-quellen/texturen/io/albedo.jpg` | [Commons: Io_for_GeoHacks.jpg](https://commons.wikimedia.org/wiki/File:Io_for_GeoHacks.jpg) | U.S. Geological Survey Astrogeology Research Program | Public Domain (NASA media policy) | 1024×512 | 122,466 bytes | downscaled from 1225×613 to 1024×512 (Galileo/Voyager mosaic, full sphere −90° to 90°) |
| `assets-quellen/texturen/europa/albedo.jpg` | [Commons: Jupiter_II-Europa_map_NASA_JPL_Voyager.jpg](https://commons.wikimedia.org/wiki/File:Jupiter_II-Europa_map_NASA_JPL_Voyager.jpg) | Caltech/JPL/USGS | Public Domain (NASA media policy) | 1024×512 | 128,550 bytes | downscaled from 1440×720 to 1024×512 |
| `assets-quellen/texturen/ganymede/albedo.jpg` | [Commons: Ganymede_map_NASA_JPL_Voyager.jpg](https://commons.wikimedia.org/wiki/File:Ganymede_map_NASA_JPL_Voyager.jpg) | Caltech/JPL/USGS | Public Domain (NASA media policy) | 1024×512 | 170,216 bytes | downscaled from 1440×720 to 1024×512 |
| `assets-quellen/texturen/callisto/albedo.jpg` | [Commons: Callisto_USGS_global_small.jpg](https://commons.wikimedia.org/wiki/File:Callisto_USGS_global_small.jpg) | USGS Astrogeology Science Center | Public Domain (NASA media policy) | 1024×512 | 104,638 bytes | scaled from 1024×498 to 1024×512 (the source format was already close to the target resolution); this stretches the height by 2.8% (aspect ratio changes from 2.057:1 to 2:1) — a slight latitude error on this simple-cylindrical map |
| `assets-quellen/texturen/titan/albedo.jpg` | [Commons: Map_of_Titan_cropped.jpg](https://commons.wikimedia.org/wiki/File:Map_of_Titan_cropped.jpg) | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA media policy) | 1024×512 | 94,714 bytes | scaled from 1000×500 to 1024×512; near-infrared mosaic (penetrates the haze layer, real photography shows only uniform orange haze) |
| `assets-quellen/texturen/enceladus/albedo.jpg` | [Commons: Map_of_Enceladus_cropped.jpg](https://commons.wikimedia.org/wiki/File:Map_of_Enceladus_cropped.jpg) | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA media policy) | 1024×512 | 190,782 bytes | scaled from 1000×500 to 1024×512 |
| `assets-quellen/texturen/rhea/albedo.jpg` | [Commons: Map_of_Rhea_cropped.jpg](https://commons.wikimedia.org/wiki/File:Map_of_Rhea_cropped.jpg) | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA media policy) | 1024×512 | 185,698 bytes | scaled from 1000×500 to 1024×512 |
| `assets-quellen/texturen/dione/albedo.jpg` | [Commons: Dione_map_for_GeoHack.jpg](https://commons.wikimedia.org/wiki/File:Dione_map_for_GeoHack.jpg) | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA media policy) | 1024×512 | 108,993 bytes | upscaled from 720×360 to 1024×512 |
| `assets-quellen/texturen/tethys/albedo.jpg` | [Commons: Map_of_Tethys_cropped.jpg](https://commons.wikimedia.org/wiki/File:Map_of_Tethys_cropped.jpg) | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA media policy) | 1024×512 | 223,535 bytes | scaled from 1000×500 to 1024×512 |
| `assets-quellen/texturen/iapetus/albedo.jpg` | [Commons: Color_map_of_Iapetus_PIA18436_Nov._2014.jpg](https://commons.wikimedia.org/wiki/File:Color_map_of_Iapetus_PIA18436_Nov._2014.jpg) | NASA / JPL-Caltech / Space Science Institute / Lunar and Planetary Institute | Public Domain (NASA media policy) | 1024×512 | 147,074 bytes | cropped the caption/logo border of the original figure (12261×7821) to the pure map area (11739×5861), then downscaled to 1024×512; the strongly different brightness of the two hemispheres is a real albedo dichotomy (Cassini Regio), not a data gap |
| `assets-quellen/texturen/mimas/albedo.jpg` | [Commons: Map_of_Mimas_2017-01_PIA17214.jpg](https://commons.wikimedia.org/wiki/File:Map_of_Mimas_2017-01_PIA17214.jpg) | NASA/JPL-Caltech/Space Science Institute | Public Domain (NASA media policy) | 1024×512 | 199,780 bytes | cropped the title line, axis labels/border lines and scale bar of the original figure (6330×3756) to the pure map area (5827×2947), then downscaled to 1024×512; this left a narrow black strip from the figure frame (6 rows top, 5 bottom, 5 columns left, 6 right of the 1024×512 file, about 3.4% of the area) — cropped away in a second processing step and rescaled exactly to 1024×512 again; after the cut, all border rows/columns contain image data, no more black strips |
| `assets-quellen/texturen/triton/albedo.jpg` | [Commons: Triton_Map.jpg](https://commons.wikimedia.org/wiki/File:Triton_Map.jpg) | NASA/JPL-Caltech/Lunar & Planetary Institute | Public Domain (NASA media policy) | 1024×512 | 85,766 bytes | downscaled from 14138×7069 to 1024×512; Voyager 2 mosaic — the northern hemisphere, unlit at the time of the flyby, is unlit and appears black (about 38.5% of the area), see the gap note below |
| `assets-quellen/texturen/phobos/albedo.jpg` | [Commons: Phobos_Viking_Mosaic_DLRcontrol_7200.jpg](https://commons.wikimedia.org/wiki/File:Phobos_Viking_Mosaic_DLRcontrol_7200.jpg) | Planetary Data System / Phil Stooke (USGS Astrogeology) | Public Domain (NASA media policy) | 1024×512 | 164,171 bytes | downscaled from 7200×3600 to 1024×512 |

**Note on Pluto, Charon and Triton:** All three maps show a black, unlit area
(either one of the two polar caps or the far side not visited by the probe) —
a real, documented limit of the respective single-flyby mission (New Horizons
at Pluto/Charon in 2015, Voyager 2 at Neptune/Triton in 1989), not a
processing error. Unlike the five large Uranian moons (see the gaps section
below), the actually mapped area here clearly dominates, at about 61-70% of
the area, which is why these three maps were judged usable despite the gap.

## Texture source: Solar System Scope (ring texture)

The Saturn ring texture again comes from Solar System Scope
(<https://www.solarsystemscope.com/textures/>). Author: Solar System Scope.
Licence: Creative Commons Attribution 4.0 International (CC BY 4.0,
<https://creativecommons.org/licenses/by/4.0/>).

Format: PNG with alpha channel, 2048×125 pixels — not an equirectangular
image like the albedo textures, but a radial strip: one image column
corresponds to one ring radius, and the small height (125 px) is the strip
thickness. This matches the UV layout of `ringGeometrieDaten` in
`src/render/rings.ts`: u runs from the inner edge (u=0) to the outer edge
(u=1) of the ring, v is constant and is not evaluated during sampling. The
alpha channel carries the ring's radial banding/density; the RGB carries
their colour.

Checked (12 September 2026): the source's full download list lists only
`2k_saturn_ring_alpha.png` and `8k_saturn_ring_alpha.png` under "Rings" — no
Uranus counterpart. The 2k variant was used, consistent with the 2k
resolution of all the other original textures in this project.

Processing: none — taken over unchanged in the delivered resolution, only
placed at `public/textures/saturn/ring.png`.

| File | Source (URL) | Author | Licence | Dimensions | Size | Processing |
|---|---|---|---|---|---|---|
| `public/textures/saturn/ring.png` | [2k_saturn_ring_alpha.png](https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png) | Solar System Scope | CC BY 4.0 | 2048×125 | 12,119 bytes | kept unchanged, only renamed |

## Uranus ring: computed from measurement data instead of an image file

`appearance.rings.texture` remains empty for Uranus. Checked on 12 September
2026 whether a ring texture exists under a licence suited to the project
(CC BY, public domain):

| Source | Finding |
|---|---|
| Solar System Scope, download list "Rings" | only `2k_/8k_saturn_ring_alpha.png`, no Uranus |
| NASA 3D Resources (GitHub, "Images and Textures") | Uranian moons Ariel to Umbriel, no ring texture |
| NASA Science, "Uranus 3D Model" (glTF/USDZ, VTAD, 09/2023) | a sphere with one image (`Uranus_1_51118.glb`: 1 mesh, 1 material, 1 texture), no rings |
| Stellarium `textures/` and `stellarium-addons` (1K package) | `uranus_rings.png` only in the addon package; `ssystem_major.ini` notes "texture from Celestia", the package calls itself "from Celestia and Space Engine projects" with an empty licence field — unusable |
| DeviantArt textures ("Uranus Rings Texture") | fan works, some derived from Planet Pixel Emporium (not freely redistributable) |

Freely available, however, is the **measurement data**: the PDS Ring-Moon
Systems Node (SETI Institute, NASA Planetary Data System) tabulates, under
"Vital Statistics for Uranus's Rings"
(<https://pds-rings.seti.org/uranus/uranus_rings_table.html>), the mean
radius, width and normal optical depth for each ring. These values are
stored as `URANUS_RINGPROFIL` in `src/data/bodies/uranus.ts`;
`src/render/ringProfil.ts` computes a radial 2048×1 strip with alpha channel
from them at runtime, in the format of the Saturn ring texture. So there is
no image file in the repository, and there is nothing to attribute except
the data source.

Deliberately not to scale (artistic licence, explained in the module comment
of `ringProfil.ts`): the narrow rings (1.5 to 60 km) are widened on a base of
260 km plus six times their true width, because one kilometre is an
eightieth of a pixel in the cinema scene; the diffuse components (ζ ring,
dust layer, τ ≈ 0.005) are boosted twelvefold and capped at an opacity of
0.12. Physically, the opacity of the narrow rings (1 − e^(−τ)) — and hence
the ranking — is preserved: ε covers 78%, δ and 5 cover 39%, 6, 4, β, γ cover
26%, λ covers 10%. Colour uniformly light, warm grey (sRGB 214/202/190) —
"slightly red" in the visible according to Baines et al. 1998. Pixel
measurement after the change (12 September 2026, cinema scene
`uranus-gekippt` at second 4, Schaubild preset, standard lighting, Chromium
1249×1269): ε ring 66 of 255, inner rings 10 to 32, ζ veil 8 — against 0 at
every ring position before the correction.

If `profil` is ever missing, the mid-grey 1×1 fallback texture
(`ERSATZ_RING_GRAU` = 128 in `render/rings.ts`) still applies. The grey
value is a visibility value, not an albedo value: a value derived from the
real albedo (about 0.05) (RGB 38) measured as black (0 of 255) in the cinema
scene `uranus-gekippt`, because the scene is nowhere physically lit and the
ACES tone mapping pushes everything under about 1% linear to black; at 128,
the flat ring measured 31 of 255 there.

## Gaps: bodies without a texture

For six of the 25 subsequently added bodies, `appearance.textures.albedo`
remained empty; the fallback colour (see the respective source block in
`src/data/bodies/`) carries them entirely. Sources checked: Solar System
Scope (<https://www.solarsystemscope.com/textures/>), USGS Astrogeology
(<https://astrogeology.usgs.gov/search>), and a targeted search via the
Wikimedia Commons API (`commons.wikimedia.org/w/api.php`, full-text and
category search) for official NASA/USGS map mosaics.

- **Miranda, Ariel, Umbriel, Titania, Oberon** (all five large Uranian
  moons): the only existing close-up imagery comes from Voyager 2's single
  1986 flyby. Because Uranus was lying almost on its side at the time, the
  probe saw only the sunlit southern hemisphere of each of the five moons —
  the files available as USGS/JPL map mosaics (`<Mond>_map_JPL_USGS.jpg`,
  <https://maps.jpl.nasa.gov/tmaps/uranus.html>, public domain) therefore
  consist of 57-62% unlit, black area (pixel count of the preview images,
  brightness threshold < 12). That is markedly more than for Pluto, Charon
  or Triton (30-39% there, see the note above), and would have looked on the
  sphere like a rendering error rather than a documented data gap — the
  fallback colour is the more honest representation here. This was expected
  for Miranda and Umbriel; the check found that Ariel, Titania and Oberon
  fail at the same threshold. Mimas, by contrast, initially also suspected
  as a possible gap candidate, has a complete, gapless Cassini map (see the
  previous table) and is textured.
- **Deimos**: no official USGS/NASA global map could be found (neither on
  astrogeology.usgs.gov nor via Wikimedia Commons). The only global Deimos
  texture in circulation (`Deimos_color_map.jpg` on Wikimedia Commons) comes
  from a DeviantArt user ("Oleg-Pluton") under CC BY-SA 3.0 — an unofficial
  fan reconstruction with no traceable chain of provenance to real imaging
  data, which does not meet this catalogue's standard (documented, official
  sources). Rejected rather than used.

Not expected but likewise not found: a Solar System Scope texture for Pluto
(see the note in the previous section) — here the real New Horizons map was
used instead, which is why Pluto is textured after all.

## Texture levels (KTX2)

All 29 albedo maps are additionally available as KTX2 levels, stored under
`public/textures/<koerper>/albedo-<breite>.ktx2`. Which levels a body carries
is listed in `src/data/texturen.ts`:

| Body | Levels |
|---|---|
| Mercury, Venus, Earth, Mars, Moon | 1024, 2048, 8192 |
| Sun, Jupiter, Saturn | 1024, 2048, 4096 |
| Uranus, Neptune | 1024, 2048 |
| all other bodies with a texture (moons, dwarf planets) | 1024 |

**Processing:** the levels up to 2048 are produced from the respective JPEG
under `assets-quellen/texturen/<koerper>/albedo.jpg` (see above); the 4096
and 8192 levels come from separate, higher-resolution sources (table below).
Each level is downscaled to its width with Lanczos filtering (Pillow) and
flipped vertically, because KTX2 has no `flipY`, then encoded with KTX
Software 4.4.2 from Khronos (Basis Universal, sRGB colour space, with
mipmaps): the 1k level as ETC1S (small initial load), all wider levels as
UASTC with Zstandard post-compression (higher fidelity). The exact switches
are listed in `scripts/texturen-quellen.json`, generated with `npm run
texturen` (`scripts/texturen-bauen.ts`); details of the trial that led to
this encoding are recorded in `docs/phase5-etappe3-abnahme.md` §3.

**New sources for the highest levels:** for the eight bodies with a level
above 2048, the build script downloads a higher-resolution source file again
from Solar System Scope. The source files themselves do not live in the
repository, only temporarily in the git-ignored folder `.cache/texturen/`;
the SHA-256 secures their provenance on every rebuild.

Author and licence are the same for all eight files in this table: author
Solar System Scope, licence CC BY 4.0.

| Body | Source (URL) | Dimensions | Processing |
|---|---|---|---|
| Mercury | [8k_mercury.jpg](https://www.solarsystemscope.com/textures/download/8k_mercury.jpg) | 8192×4096 | as above, level 8192 |
| Venus | [8k_venus_surface.jpg](https://www.solarsystemscope.com/textures/download/8k_venus_surface.jpg) | 8192×4096 | as above, level 8192 |
| Earth | [8k_earth_daymap.jpg](https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg) | 8192×4096 | as above, level 8192 |
| Mars | [8k_mars.jpg](https://www.solarsystemscope.com/textures/download/8k_mars.jpg) | 8192×4096 | as above, level 8192 |
| Moon | [8k_moon.jpg](https://www.solarsystemscope.com/textures/download/8k_moon.jpg) | 8192×4096 | as above, level 8192 |
| Sun | [8k_sun.jpg](https://www.solarsystemscope.com/textures/download/8k_sun.jpg) | 4096×2048 | as above, level 4096 |
| Jupiter | [8k_jupiter.jpg](https://www.solarsystemscope.com/textures/download/8k_jupiter.jpg) | 4096×2048 | as above, level 4096 |
| Saturn | [8k_saturn.jpg](https://www.solarsystemscope.com/textures/download/8k_saturn.jpg) | 4096×2048 | as above, level 4096 |

The SHA-256 checksums of these eight source files secure their provenance on
every rebuild:

| Body | SHA-256 |
|---|---|
| Mercury | `5c8bd885ae3571c6ba2cd34b3446b9c6d767e314bf0ee8c1d5c147cadd388fc3` |
| Venus | `9bc21a50577ed8ac734cda91058724c7a741c19427aa276224ce349351432c5b` |
| Earth | `88ab060b6e7d241cfc590c69f528fab2b3247b738d40124cb590999a6fe44abc` |
| Mars | `4cc52149924abc6ae507d63032f994e1d42a55cb82c09e002d1a567ff66c23ee` |
| Moon | `d1875bcec83588ca25e4802e576f6bb9f88b39e1e403cb41ff55867419c54796` |
| Sun | `f22b1cfb306ddce72a7e3b628668a0175b745038ce6268557cb2f7f1bdf98b9d` |
| Jupiter | `0bd844bf20822c4e3e80882b077859833c0dac44c7e4e1e0cd63d1b1b6d43085` |
| Saturn | `0d39a4a490c87c3edabe00a3881a29bb3418364178c79c534fe0986e97e09853` |

These eight files are all genuine 8192×4096 or 4096×2048 photo mosaics from
the same source as the 2k maps above (Solar System Scope, CC BY 4.0), just
at higher resolution; the authorship and licence details from the first
section apply unchanged.

## Basis transcoder

The KTX2 loader (`three/examples/jsm/loaders/KTX2Loader.js`) needs a
WebAssembly transcoder from Basis Universal at runtime. The two files
`public/basis/basis_transcoder.js` and `public/basis/basis_transcoder.wasm`
are copied unchanged from three.js 0.186
(`node_modules/three/examples/jsm/libs/basis/`); a test
(`src/render/basis.test.ts`) compares both files byte for byte with the
bundled version, so that a three.js update cannot silently let them go
stale.

The README in the three.js folder names no licence for the transcoder.
According to the `LICENSE` file of the original repository
<https://github.com/BinomialLLC/basis_universal>, the Basis Universal code —
and hence the transcoder built from it — is under the Apache License 2.0,
Copyright 2019–2026 Binomial LLC.

## App icon

`public/symbole/orrery-192.png` and `public/symbole/orrery-512.png` are
original drawings (a sun with two orbits), generated with
`scripts/app-symbol.py` (Pillow); no third-party authors.

## Music

Orrery ships no music. Whoever operates the site can place their own MP3
files in the `musik/` folder of the deployed site (instructions in
`README.md`, section "Custom music"); locally the folder lives under
`public/musik/` and is git-ignored, so it never appears in the repository.
Licensing, attribution and usage rights for these tracks are the operator's
sole responsibility. The application shows title, author and link for the
currently playing track from its list `musik/stuecke.json`.
