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
[chronicle](docs/chronik.en.md).

## Licence

No licence has been chosen yet; all rights are reserved. Textures and the Milky Way map are
subject to the licences listed in [`ASSETS.md`](ASSETS.md) (mostly CC BY 4.0; the Milky Way
map includes Gaia data under CC BY-NC 3.0 IGO).

Development, deployment, custom music and code structure (in German):
[`docs/entwicklung.md`](docs/entwicklung.md).
