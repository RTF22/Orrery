# Phobos

Phobos is the inner, larger Martian moon: a dark, triaxial body of just 11 km mean radius, circling
Mars in under eight hours, slowly falling towards it, probably with a past as a debris disc. This
text presents mass and surface from the Mars Express flybys, the question of origin between
capture and giant impact, the fate of the orbit, and what Orrery models of it.

## Parameters and measurement

The closest Mars Express flyby, on 3 March 2010 at 77 km, determined the mass parameter directly
via radio science; the second-degree gravity field stayed too imprecise to tell a homogeneous from
an inhomogeneous mass distribution ([Pätzold et al. 2014](literatur:paetzold-2014)). Independently,
a photogrammetric terrain model from stereo-camera and Viking-orbiter images gave a new volume that
lowered the density against older estimates ([Willner et al. 2014](literatur:willner-2014)).

| Quantity | Value | Uncertainty | Method | Reference |
|---|---|---|---|---|
| $GM$ | $0.7072 \cdot 10^{-3}\,\mathrm{km^3\,s^{-2}}$ | $0.0013 \cdot 10^{-3}\,\mathrm{km^3\,s^{-2}}$ | Mars Express flyby, radio science | [Pätzold et al. 2014](literatur:paetzold-2014) |
| $\bar{\rho}$ | $1862\,\mathrm{kg\,m^{-3}}$ | $30\,\mathrm{kg\,m^{-3}}$ | from $GM$ and photogrammetric volume | [Pätzold et al. 2014](literatur:paetzold-2014) |
| Volume | $5741\,\mathrm{km^3}$ | 0.6 % | terrain model, spherical harmonics degree 45 | [Willner et al. 2014](literatur:willner-2014) |
| Semi-axes | $13.0 / 11.4 / 9.1\,\mathrm{km}$ | – | triaxial ellipsoid, same model | [JPL SSD satellite data](quelle:jpl-satelliten) |

The current JPL catalogue gives $GM = (0.7087 \pm 0.0006) \cdot 10^{-3}\,\mathrm{km^3\,s^{-2}}$ and
$\bar{\rho} = 1872 \pm 76\,\mathrm{kg\,m^{-3}}$ ([JPL SSD satellite data](quelle:jpl-satelliten)),
within one standard deviation of Pätzold et al. With Pätzold et al.'s density
$1862\,\mathrm{kg\,m^{-3}}$ and a grain density of 2800 to 3300 kg/m³ (carbonaceous to ordinary
chondrites), this gives a porosity of about 33 to 44 %.

## Interior

At this density Phobos cannot be solid rock: either a highly porous, water-free rubble pile, or a
body with some ice mixed in, since its second-degree gravity terms cannot yet be told apart from
uniform mass distribution ([Pätzold et al. 2014](literatur:paetzold-2014)). Structure and origin
are linked: a captured asteroid would bring its material unchanged, a reaccreted body would be
loosely packed from the start ([Rosenblatt 2011](literatur:rosenblatt-2011);
[Interior structure](thema:innerer-aufbau)). MMX, due to launch on 20 October 2026, is to test this
with gravity-field and rotation data from orbit, and bring samples to Earth
([Kuramoto et al. 2022](literatur:kuramoto-2022); [JAXA MMX 2026](literatur:jaxa-mmx-2026)).

## Surface

Phobos carries the 9 km crater Stickney, nearly half its diameter
([NASA Mars moons](quelle:nasa-marsmonde)), and a network of parallel grooves and crater chains of
disputed origin. A model of the tidal stress building up as the orbit
decays, in an outer shell load-bearing only in a thin layer, matches most groove families' location
and orientation ([Hurford et al. 2016](literatur:hurford-2016)). For the most conspicuous
grooves that do not fit this stress field, an orbital calculation matches sesquinary chains just as
closely: material an impact throws out, without escaping Mars's pull, re-impacts along its own
orbit ([Nayak and Asphaug 2016](literatur:nayak-2016)); the two models apparently explain different
families ([Thomas 1993](literatur:thomas-1993)).

Reflectance spectra show two units: a widespread reddish one and a bluer one near Stickney with a
flatter spectrum, both without sharp mineral bands but with an absorption near 2.8 µm pointing to
OH-bearing material. The red spectrum resembles D-type asteroids, common in the outer main belt
and among the Jupiter Trojans ([Fraeman et al. 2012](literatur:fraeman-2012)).

## Atmosphere and magnetosphere

Phobos has neither atmosphere nor magnetic field, its surface exposed to the solar wind. Mars
Express readings with and without Phobos in view show backscattered protons from its vicinity, a
sign the dusty surface reflects part of the wind rather than fully absorbing it
([Futaana et al. 2021](literatur:futaana-2021)).

## Orbit, rotation and dynamics

Phobos orbits within the synchronous distance, so its tide on Mars lags and brakes it: the
ephemeris MAR099 gives $\tau = k_2/Q = (1.816 \pm 0.084) \cdot 10^{-3}$ for Mars and
$\dot{n}/2 = (1.258 \pm 0.058) \cdot 10^{-3}$ degrees per year² for Phobos, an orbital decay of
about 3.8 cm per year ([Brozović et al. 2025](literatur:brozovic-2025); derived under
[Tides](thema:gezeiten)). With this tide alone, impact would take about 29 to 43 million years
([Efroimsky and Lainey 2007](literatur:efroimsky-2007)); the real breakup sets in earlier, at the
Roche limit, with 20 to 40 million years for the weakest material to disperse into a ring
([Black and Mittal 2015](literatur:black-2015)).

The rotation is [tidally locked](thema:gebundene-rotation); the 1.14° libration Willner et al.
predicted for uniform density was later matched by MAR099 just as closely, at
$1.14 \pm 0.03^\circ$ – for [Deimos](objekt:deimos) the ephemeris is not sensitive enough for this
([Brozović et al. 2025](literatur:brozovic-2025)). Seen from Mars, Phobos, only 0.106° in angular
radius against the Sun's 0.175°, regularly transits it; Spirit and Opportunity imaged the first
transits of both moons in 2004 ([Bell et al. 2005](literatur:bell-2005); details under
[Eclipses](thema:finsternis)). The scene [Low pass over Phobos](szene:phobos-tiefflug) shows this view.

## Formation and evolution

Whether Phobos is a captured asteroid or formed from Martian material has been open since the
1970s ([Burns 1978](literatur:burns-1978)): carbon-rich spectra favour capture, the low probability
of capture onto a near-circular, equatorial orbit without extra friction argues against it
([Rosenblatt 2011](literatur:rosenblatt-2011)). A giant impact on the young Mars could instead have
produced a debris disc, whose thin outer part accreted into Phobos and Deimos while a larger inner
moon heated it through migration before falling in itself
([Rosenblatt et al. 2016](literatur:rosenblatt-2016)); a mere Vesta- to Ceres-sized impactor already
suffices ([Canup and Salmon 2018](literatur:canup-2018)). Since such a moon reaches
the Roche limit and breaks into a ring from which the next, smaller moon grows, both could be only
the latest of several cycles ([Hesselbrock and Minton 2017](literatur:hesselbrock-2017)). Bagheri
et al. instead propose one larger progenitor breaking up, its fragments settling onto their
present orbits within under 2.7 billion years by tidal friction alone
([Bagheri et al. 2021](literatur:bagheri-2021)); an orbital integration counters that they would
collide again within 10,000 years ([Hyodo et al. 2022](literatur:hyodo-2022)). Context:
[Formation of the Solar System](thema:entstehung).

## Open questions

- **Capture or formed in place?** Spectra fit distant asteroids, the orbit hardly fits capture
  without extra friction ([Rosenblatt 2011](literatur:rosenblatt-2011)); giant-impact scenarios
  explain the orbit but still owe an explanation of the spectra via space weathering
  ([Canup and Salmon 2018](literatur:canup-2018)).
- **One progenitor or several generations?** Breakup of one progenitor fits the orbits given
  2.7 billion years of tidal friction ([Bagheri et al. 2021](literatur:bagheri-2021)); orbital
  calculations instead have the fragments collide within millennia
  ([Hyodo et al. 2022](literatur:hyodo-2022)).
- **Porous rubble or ice?** The density allows either, as long as the gravity field's second degree
  stays unresolved ([Pätzold et al. 2014](literatur:paetzold-2014)).
- **Where do the grooves come from?** Tidal stress and sesquinary chains match different families;
  a third cause stays possible
  ([Hurford et al. 2016](literatur:hurford-2016); [Nayak and Asphaug 2016](literatur:nayak-2016)).

## In the model

- **Orbit:** a Kepler ellipse in the `parentEquator` frame (the Martian equator, see
  [Mars](objekt:mars)) with fixed $a = 9375\,\mathrm{km}$, $e = 0.015$, $I = 1.1^\circ$; node and
  longitude of periapsis advance at −15,652.17° and +17,075.10° per century: 2.300 years for the
  nodal cycle (as the element table itself states) and 2.108 years for the periapsis longitude –
  longer than the table's separately listed argument period alone (1.1 years), because the
  opposite nodal motion weakens the precession of the periapsis longitude relative to the argument
  alone. Orbital decay is absent; by 19 September 2026 the gap to the measured tidal acceleration
  would already be 0.9° ([Tides](thema:gezeiten)).
- **Rotation:** `rotationPeriodH` (7.65384 h) matches the sidereal period from $\dot{L}$ to under
  one part per million, exactly 1:1. Neither the physical libration (1.14°) nor the optical one
  from eccentricity ($2e = 1.7^\circ$) is modelled.
- **Spherical shape:** 11.1 km radius instead of the semi-axes 13.0 / 11.4 / 9.1 km (+17.1 %,
  +2.7 %, −18.0 %); Stickney and the grooves are absent from the sphere mesh.
- **Albedo and texture:** 0.07 is the fact sheet's geometric albedo; the texture, a Viking mosaic
  (`ASSETS.md`), shows the red–blue contrast without the material itself distinguishing the units
  ([Albedo and brightness](thema:photometrie)).
- **Data panel:** catalogue and JPL-$GM$-derived mass agree to 0.2 %, unlike for Deimos. Further
  simplifications: [Limits of the model](thema:modell).

*As of September 2026*
