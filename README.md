# Orrery

**English** | [Deutsch](README.de.md)

An interactive 3D simulation of the solar system that runs in the browser, with explanatory
texts on three educational levels and a documented scientific basis.

**Live: <https://orrery3d.de>**

![Saturn with the planet's shadow on its rings, rendered by Orrery](docs/bilder/orrery-saturn.jpg)

An orrery is a mechanical model of planetary motion, named after the Earl of Orrery, for whom
one of the first was built in 1704. This one is digital: it computes positions from published
orbital elements, and its positions are tested against JPL Horizons. The simulation always
calculates physically correctly; only the display may exaggerate sizes and brightness so that
small and distant bodies stay visible. How much it exaggerates is a slider setting, not a
built-in compromise.

## Data sources

| Dataset | Source | Validity / accuracy |
|---|---|---|
| Planetary orbits | JPL Approximate Positions, extrapolated linearly against the fixed J2000 ecliptic (Earth modeled as the Earth-Moon barycenter) | Checked for 1800–2050; nominal heliocentric-longitude error 15″ (Mercury) to 600″ (Saturn); for Earth, 20″ in longitude, 8″ in latitude, 6000 km in distance |
| Moons | 20 of 21 moon orbits referred to the parent body's equator (pole fixed at epoch), no separately maintained Laplace plane | Deviates from JPL's own Laplace plane by 0.4° (Callisto), 0.9° (Deimos), 7.6° (Iapetus) |
| Dwarf planets and the Pluto system | Osculating elements from the JPL Small-Body Database at their own epoch, with only the mean longitude as a running rate | Against the integrated ephemeris DE441, Pluto's position deviates by 0.05° (2000), 0.13° (2050), 0.15° (1900), 1.4° (1800); Pluto sits fixed at its system's origin rather than orbiting the barycenter 2126 km (1.79 Pluto radii) away |
| Rotation and poles | Fixed right ascension/declination, mostly from the 2011 IAU report; Uranus and Neptune keep the Voyager 2 radio periods from 1986/1989, the Mars pole the older 2009 IAU report | No precession, no periodic terms; the catalog holds −17.24 h for Uranus against 17.247864 ± 0.000010 h from 2011–2022 Hubble images, and 16.11 h for Neptune against a photometric 15.9663 h; the older Mars pole yields a 25.19° obliquity, the one official since 2015 gives 23.92° |
| Time scales | The clock displays the date as UTC but feeds the same number into the orbit calculation as TDB, unconverted; valid from 1 January year 1 to 31 December 9999, orbital elements checked only for 1800–2050 | Today's UTC/TDB error shifts Earth by 2.8″ in ecliptic longitude, the Moon by 38″ |
| Eclipses | Computed, not read from tables; the lunar-eclipse search is checked against the NASA catalog | Finds 135 of 143 umbral eclipses from 1951 to 2050, with a maximum time offset of 3.0 h and a root-mean-square of 1.8 h |
| Star catalogue | HYG database (Astronexus), version 4.1, commit of 17 August 2024, CC BY-SA 4.0 | 5070 stars with apparent magnitude ≤ 6.0 (the naked-eye limit) |
| Milky Way | NASA SVS "Deep Star Maps 2020", computed from 1.7 billion Gaia DR2 stars (excluding the bright Hipparcos and Tycho stars) | SVS content is public domain; the Gaia share is licensed CC BY-NC 3.0 IGO |
| Textures | 14 textures (Sun, planets, Moon, four dwarf planets) from Solar System Scope, CC BY 4.0; 15 more (moons, Pluto, Charon) from public-domain NASA/USGS Astrogeology maps | Per-file source, edits and licence in `ASSETS.md` |
| Check against JPL Horizons | JPL Horizons vector table, heliocentric, J2000 ecliptic, in km (test fixture `src/sim/__fixtures__/horizons.json`) | Compares the computed x/y/z position of the 8 planets and 5 dwarf planets at 5 sample dates between 1850 and 2040 (65 points); tolerance per body, from 12,000 km (Mercury) to 220,000,000 km (Eris) |

For details, including the model's known simplifications, see the topic *Limits of the model*
in the app, [`ASSETS.md`](ASSETS.md) and [`docs/belege/hochschule/`](docs/belege/hochschule/).

## Educational content

Every body, every cinema scene and every topic has an explanatory text on three levels, in
German and English. Level and language can be switched in the app at any time.

| Level | Style | Data shown alongside | Texts |
|---|---|---|---|
| Primary school | Short texts in plain language | Diameter, orbital period, current distance from the Sun | 63 |
| Secondary school | Figures, physical relationships, links to related topics | Also mass, rotation period, axial tilt, eccentricity, orbital velocity | 63 |
| University | Full scientific basis: formulas, tables with uncertainties, open questions with both sides, citations | Also orbital elements at J2000 with rates, pole direction, geometric albedo | 69 |

The texts cover 35 bodies (the Sun, eight planets, five dwarf planets, 21 moons), 19 cinema
scenes and 9 general topics such as eclipses, ring systems, axial tilt and Kirkwood gaps. The
university level adds six advanced topics: tides, orbital resonances, reference systems and
time scales, interior structure, photometry, and the formation of the solar system.

A dedicated topic, *Limits of the model*, lists what Orrery simplifies and quantifies the
resulting errors, for example the time scale used for orbits or the rotation models of the
planets.

## Sources and literature

- **91 source cards** link each text to public reference material: NASA (50), Wikipedia (23),
  JPL (11), ESA (4), IAU (1) and two others. They open in a new tab and are never embedded.
- **761 publications** form the literature catalogue of the university texts, 737 of them
  with a DOI. Each entry is checked automatically against Crossref or arXiv
  (`npm run literatur:pruefen`).
- **69 evidence files** in [`docs/belege/hochschule/`](docs/belege/hochschule/) record, for
  every university text, each claim with its value, source, location in the source and
  verification.

## Features

- Sun, planets, dwarf planets and moons with Saturn's and Uranus's rings, the asteroid belt
  with Kirkwood gaps, the Kuiper belt, a star catalogue and the Milky Way at its true position.
- Shadows and eclipses: moon shadows on planets, ring shadows, the blood moon; the cinema
  scene *Lunar eclipse* jumps to the next real one.
- Time control from 1 January of year 1 to 31 December 9999: pause, speed, reverse, date jump.
- Separate scale sliders for size and distance.
- Cinema mode: full screen, automatic camera flights through 19 curated scenes.
- Installable web app; works on phones, with keyboard, mouse and game controller.

## How it was built

Orrery was built in 15 calendar days, from the initial prompt to its own domain — built with
an AI coding assistant, a tool that does not work deterministically. The guiding idea was to
use that tool to build a deterministic, verifiable application anyway: tests, numbers, and
pixel measurements instead of impressions. How that unfolded in detail, with every number and
commit hash, is told by the [overview](docs/entstehung.en.md) and the detailed
[chronicle](docs/chronik.en.md). Both are also available as web pages at
<https://orrery3d.de/doku/making-of/en/>.

## Licence

Code is licensed under MIT ([`LICENSE`](LICENSE)); own texts and images under CC BY-SA 4.0
([`LICENSE-TEXTE.md`](LICENSE-TEXTE.md)). Textures and the Milky Way map are subject to the
licences listed in [`ASSETS.md`](ASSETS.md) (mostly CC BY 4.0; the Milky Way map includes Gaia
data under CC BY-NC 3.0 IGO).

Development, deployment, custom music and code structure (in German):
[`docs/entwicklung.md`](docs/entwicklung.md).
