# Eclipses

An eclipse is the passage of one body through the shadow of another. At new Moon the shadow of the
[Moon](objekt:moon) can fall on the [Earth](objekt:earth); at full Moon the Moon enters the Earth's
shadow. This text covers the geometry of shadows, the conditions and parameters of both kinds, the
eclipse limits, the saros and inex periods, the computational method of the Besselian elements, the
role of ΔT for ancient eclipses, eclipses as a research tool and eclipses at other planets. The
enlargement of the Earth's shadow and the course of the scene are described in
[Scene: Lunar eclipse](szene:mondfinsternis).

## Umbra, penumbra and antumbra

Behind an opaque body of radius $R$ at distance $D$ from the [Sun](objekt:sun) of radius $R_\odot$,
two cones bound the shadow. The inner one comes to a point at distance $L$, the outer one widens:

$$\sin f_2 = \frac{R_\odot - R}{D}, \quad L = \frac{R\,D}{R_\odot - R}, \quad \sin f_1 = \frac{R_\odot + R}{D}$$

At distance $d$ behind the body, umbra and penumbra therefore have the radii

$$r_\mathrm{u}(d) = R - d\,\tan f_2, \quad r_\mathrm{p}(d) = R + d\,\tan f_1$$

For $d > L$, $r_\mathrm{u}$ becomes negative. That region is the antumbra: the occulting body appears
smaller than the Sun, a narrow ring remains visible, and an eclipse there is annular. Within the
penumbra the Sun is partly covered, within the umbra completely. These boundaries are sharp only
geometrically; an atmosphere on the occulting body blurs them.

At 1 au the Earth's umbra reaches about 1.38 million km, 3.6 times the mean lunar distance. The
Moon's umbra already ends after about 374,500 km and thus just inside the mean lunar distance —
which is why annular solar eclipses are more frequent than total ones. At the Moon's distance the
Earth's umbra has a radius of 4599 km and the penumbra one of 8175 km; the umbra is 2.65 times as
wide as the Moon.

## Solar eclipses

Four kinds are distinguished: partial, when only the Moon's penumbra grazes the Earth; annular, when
the antumbra strikes it; total, when the umbra strikes it; and hybrid, when umbra and antumbra reach
different parts of the Earth, so that the eclipse appears annular along one section of its path and
total along another ([Espenak and Meeus 2006](literatur:espenak-2006)). Whether an observer at
distance $d$ from the Moon's centre sees totality follows from comparing the angular radii under
which that observer sees the Moon and the Sun:

$$\beta = \arcsin\frac{R_\mathrm{M}}{d}, \quad \alpha = \arcsin\frac{R_\odot}{D + d}$$

Totality occurs for $\beta \ge \alpha$, and that is equivalent to $d \le L$; for $\beta < \alpha$ a
ring remains and the fraction $\beta^2/\alpha^2$ of the solar disc is missing. Seen from the Earth,
the Sun's angular radius varies between 0.262° at aphelion and 0.271° at perihelion, that of the
Moon between 0.245° at mean apogee and 0.274° at mean perigee; the two ranges overlap, and that is
precisely why both kinds occur.

Two parameters describe a solar eclipse. The magnitude is the occulted fraction of the Sun's
diameter; it is less than 1 for partial and annular eclipses and at least 1 for total and hybrid
ones. Gamma is the minimum distance of the shadow axis from the Earth's centre in units of the
Earth's equatorial radius, positive north of it and negative south of it; between −0.997 and +0.997
the eclipse is central, and the departure from 1 comes from the Earth's flattening
([Espenak and Meeus 2006](literatur:espenak-2006)). Over the 5000 years from −1999 to +3000 the
canon counts 11,898 solar eclipses: 4200 partial, 3956 annular, 3173 total and 569 hybrid. Every
calendar year brings two to five of them, in 72.5 % of years exactly two.

## Lunar eclipses

The Moon passes through the penumbra and then the umbra. The contacts are called P1 and P4 (exterior
tangency with the penumbra), U1 and U4 (exterior tangency with the umbra) and U2 and U3 (interior
tangency with the umbra). An eclipse is called penumbral when the Moon only crosses the penumbra,
partial when it partly reaches the umbra, and total when it lies entirely within it; if during a
penumbral eclipse the whole lunar disc lies inside the penumbra, the event is a total penumbral
eclipse ([Espenak and Meeus 2009](literatur:espenak-2009)). With the minimum distance $\gamma$ of the
Moon's centre from the shadow axis at lunar distance, the conditions for the Moon to touch the
penumbra, to touch the umbra and to lie entirely within it read

$$\gamma < r_\mathrm{p} + R_\mathrm{M}, \quad \gamma < r_\mathrm{u} + R_\mathrm{M}, \quad \gamma < r_\mathrm{u} - R_\mathrm{M}$$

They are nested: the eclipse is called penumbral when only the first holds, partial when the second
holds but not the third, and total when all three hold. Here too the magnitude is a fraction of the
Moon's diameter, now
of the depth of immersion in the respective shadow; in the canon the penumbral magnitude ranges from
0.0004 to 1.0858 and the umbral magnitude from 0.0001 to 0.9998 for partial and from 1.0001 to
1.8821 for total eclipses. Of the 12,064 lunar eclipses of the five millennia, 4378 are penumbral —
only 141 of them total penumbral — 4207 partial and 3479 total, of which 2074 are central
([Espenak and Meeus 2009](literatur:espenak-2009)). The 21st century has 228 lunar eclipses, on
average 2.28 per year and at least two in every year
([Lunar eclipse](quelle:wikipedia-en-lunar-eclipse)). Times and maps of all lunar eclipses are given
on the [NASA Eclipse Web Site](quelle:nasa-eclipse).

The observed umbra is larger than the geometric one. Chauvenet enlarged both angular radii by 1/50,
Danjon added an opaque layer of 75 km to the Earth's radius, and more than 20,000 crater timings
give a mean effective layer height of 86.9 km
([Herald and Sinnott 2014](literatur:herald-2014)). What follows from this for the scene is described
there.

## Eclipse limits and the eclipse year

An eclipse requires new or full Moon to stand near a node of the lunar orbit, that is, near the
intersection of the lunar orbit and the ecliptic ([orbital elements](thema:bahnelemente)). For lunar
eclipses: beyond about 10.6° from the node only penumbral eclipses remain, beyond about 16.7° there
is none at all, and above 4.7° no total one is possible
([Lunar eclipse, German Wikipedia](quelle:wikipedia-de-mondfinsternis)).

Because the node regresses, the Sun returns to it faster than to the vernal equinox. This eclipse
year follows from the draconic month $T_\mathrm{d}$ and the synodic month $T_\mathrm{s}$:

$$\frac{1}{T_\mathrm{f}} = \frac{1}{T_\mathrm{d}} - \frac{1}{T_\mathrm{s}}$$

That gives 346.62 days; the point opposite the Sun therefore moves away from the node at 1.0386° per
day. The window of ±16.7° is thus 32.2 days wide and longer than a synodic month of 29.53 days: at
least one full Moon falls into every eclipse season. The seasons follow one another half an eclipse
year apart, that is every 173.3 days, so at least two fall into every calendar year — hence there
are at least two lunar eclipses every year. The window of ±10.6°, by contrast, is only 20.4 days
wide, so a season can pass without an umbral eclipse. Because the eclipse year is a good 18 days shorter than
the sidereal year, the seasons advance by that amount each year and move once through the calendar
in 18.6 years.

## Saros and inex

Eclipses of the same kind repeat when the synodic, draconic and anomalistic months are all nearly
commensurate at the same time. With the values for the year 2000
([Espenak and Meeus 2009](literatur:espenak-2009)) this yields the saros:

| Month | Length (d) | Number in one saros | Total (d) |
|---|---|---|---|
| synodic (new Moon to new Moon) | 29.530589 | 223 | 6585.3213 |
| draconic (node to node) | 27.212221 | 242 | 6585.3575 |
| anomalistic (perigee to perigee) | 27.554550 | 239 | 6585.5375 |

The saros therefore lasts about 18 years, 11 days and 8 hours. After it the Moon again stands near
the same node, at nearly the same distance and at the same time of year. The extra third of a day
shifts the zone of visibility about 120° west; only the triple saros, the exeligmos of about 54 years
and 34 days, brings it back to the same part of the Earth. Because the synodic and draconic months
differ by 52 minutes, the Moon moves about 0.48° with respect to the node per saros, and every series
ends after 12 to 15 centuries. Of the 120 complete lunar eclipse series in the canon, almost every
second one contains 72 or 73 eclipses; the range runs from 69 to 89. Every series begins and ends
with penumbral eclipses and carries 11 to 29 total ones in the middle
([Espenak and Meeus 2009](literatur:espenak-2009)).

The inex of 358 synodic months (10,571.9509 d, about 29 years less 20 days) nearly coincides with
388.5 draconic months (10,571.9479 d). The half month means that successive eclipses of a series
occur at opposite nodes; the difference of a good four minutes corresponds to a node shift of 0.04°, and
an inex series therefore runs for about 225 centuries with some 780 eclipses. Van den Bergh arranged
all eclipses in a grid of saros columns and inex rows
([Espenak and Meeus 2009](literatur:espenak-2009)). The month lengths themselves change secularly
because the mean eccentricity of the lunar and the terrestrial orbit slowly drifts: the synodic
month by +0.2 s, the draconic by +0.4 s and the anomalistic by −0.8 s per millennium.

## Besselian elements

The standard method for solar eclipses goes back to Bessel. It places a fundamental plane through
the Earth's centre, perpendicular to the axis of the lunar shadow, and describes the motion of the
shadow within it: $l_1$ and $l_2$ are the radii of the penumbral and umbral cones in that plane,
$f_1$ and $f_2$ their opening angles, and the minimum distance of the axis from the Earth's centre
in Earth equatorial radii is the gamma introduced above
([Melati and Hodijah 2016](literatur:melati-2016)). From these
quantities follow, for any location, the path of the shadow, its width and the duration. According
to the umbral radius $u$ in the fundamental plane, a central eclipse is total for $u < 0$ and
annular for $u > 0.0047$, and in between annular or hybrid. The canons of Meeus and Mucke and of
Meeus, Grosjean and Vanderleen list exactly these elements
([Espenak and Meeus 2009](literatur:espenak-2009)). For lunar eclipses the course does not depend on
the location: the eclipse runs the same way for the whole night side, and only moonrise and moonset
limit visibility. Times are given in Terrestrial Time
([reference systems](thema:bezugssysteme)).

## ΔT and ancient eclipses

Where an eclipse was visible depends on the Earth's rotation. The ephemeris calculation yields
Terrestrial Time, the Earth's rotation Universal Time; their difference ΔT cannot be predicted but
must be measured. For the past, eclipse reports supply that measurement themselves. Stephenson,
Morrison and Hohenkerk analysed 180 Babylonian eclipse timings from −720 to −9, 111 Chinese records
from 434 to 1280 as well as Greek and Arab observations, and found an observed increase of the length
of day of +1.78 ± 0.03 ms per century against +2.3 ± 0.1 ms per century from
[tidal friction](thema:gezeiten) alone
([Stephenson et al. 2016](literatur:stephenson-2016)). Adding further solar eclipse reports gave an
observed deceleration of $(-4.59 \pm 0.08) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$ against
$(-6.39 \pm 0.03) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$ from the conservation of angular
momentum in the Sun–[Earth](objekt:earth)–Moon system, hence a mean accelerative component of
$(+1.8 \pm 0.1) \cdot 10^{-22}\,\mathrm{rad}\,\mathrm{s}^{-2}$, together with a variation of about
14 centuries in period ([Morrison et al. 2021](literatur:morrison-2021)). Without ΔT an ancient
eclipse would land hours and hence continents wrong: for the year −500 the solar eclipse canon gives
ΔT = 17,190 ± 430 s ([Espenak and Meeus 2006](literatur:espenak-2006)), almost five hours, during
which the Earth turns by about 72°.

## Eclipses as a research tool

Total solar eclipses open a view of the corona. In 1868 Janssen, in India, saw a yellow emission
line in the spectrum of the chromosphere close to the sodium D lines but matching neither of them;
it was named D3 and attributed to an element "helium" that was isolated on Earth only in 1895.
Janssen realised that with a widened slit he could see the lines without an eclipse — the same was
achieved independently shortly afterwards by Lockyer. At the eclipses of 1868 and 1869 the first
coronal emission line was detected, which about 25 years later was ascribed to an element
"coronium". That the corona is heated to millions of kelvins, almost a thousand times hotter than
the [photosphere](objekt:sun) at about 5800 K, is a result of the 20th century resting on these
observations of the 19th; why it is so hot remains one of the major open questions.
Ground-based eclipse observations still reach domains in space, time and spectrum that are
inaccessible from space ([Pasachoff 2009](literatur:pasachoff-2009)).

On 29 May 1919 two British expeditions measured the deflection of starlight at the solar limb.
Einstein predicted 1.75″, the Newtonian calculation 0.87″. The 4-inch lens at Sobral gave 1.98 ±
0.12″, the astrograph on Principe 1.61 ± 0.30″, both probable errors; the Sobral astrographic plates
gave 0.93″ or 1.52″ depending on the assumptions and were discarded because of unquantifiable
systematic errors ([Gilmore and Tausch-Pebody 2022](literatur:gilmore-2022)). A re-measurement of
the plates in 1979 gave 1.90 ± 0.11″ for the 4-inch lens and 1.55 ± 0.34″ for the astrograph
([Longair 2015](literatur:longair-2015)).

The eclipses of Jupiter's moon [Io](objekt:io) were the first to show that light takes time. The
minutes of the Paris Academy for 22 August 1676 record Cassini attributing the observed inequality
to light taking "ten or eleven minutes" to cross a distance equal to the half-diameter of the annual
orbit; Rømer presented his interpretation on 21 November 1676 and published it on 7 December, while
Cassini soon abandoned the idea again ([Bobis and Lequeux 2008](literatur:bobis-2008)). The modern
value of the light time for one astronomical unit is 8.32 minutes. Near the equinoxes of
[Jupiter](objekt:jupiter) the Galilean moons eclipse and occult one another; 609 light curves from
the 2014/15 campaign gave relative positions with a scatter of ±24 mas, which is 75 km at Jupiter,
at a mean departure from the ephemerides of ±50 mas or 150 km
([Saquet et al. 2018](literatur:saquet-2018)). The 2021 campaign added 84 light curves with
departures of 49 mas in right ascension and 48 mas in declination
([Emelyanov et al. 2022](literatur:emelyanov-2022)).

From 1985 to 1990 Pluto and [Charon](objekt:charon) occulted and eclipsed one another
([Proudfoot et al. 2026](literatur:proudfoot-2026)). That series yielded the first crude map of the
Charon-facing half of Pluto, the proof that the methane in the combined spectrum lies on Pluto, the
discovery of water ice on Charon, the first usable radii and the unexpectedly high mean density of
about $2\,\mathrm{g}\,\mathrm{cm}^{-3}$ ([Stern et al. 2018a](literatur:stern-2018a)). The transits
of [Mercury](objekt:mercury) and [Venus](objekt:venus) across the Sun belong here as well: the 20th
century had 15 transits of Mercury, the 21st has 14, and the "black drop" that spoiled the historical
parallax measurements could be separated, from images of the 1999 transit of Mercury, into limb
darkening and the instrumental point spread function
([Schneider et al. 2005](literatur:schneider-2005)). Ahead of the 2012 transit of Venus it was
computed what the event should yield as a test case for studying Earth-sized exoplanets: carbon
dioxide ought to produce a signal of about 20 ppm in the ultraviolet, and the sulfuric acid droplets
of the upper haze a Mie extinction of about 5 ppm at 0.8 µm
([Ehrenreich et al. 2012](literatur:ehrenreich-2012)).

## Eclipses at other planets

On Mars, [Phobos](objekt:phobos) regularly passes in front of the Sun but never covers it
completely: from the surface its angular radius is 0.106° against 0.175° for the Sun, so it hides a
good third of the solar disc, and Deimos only a hundredth. The InSight lander measured the ground
temperature during such transits. They last only 20 to 35 s, so that only the uppermost 0.3 to
0.8 mm cool appreciably; for the top layer of 0.2 to 4 mm this gave a thermal inertia of 103 against
200 from the diurnal curve, both in
$\mathrm{J}\,\mathrm{m}^{-2}\,\mathrm{K}^{-1}\,\mathrm{s}^{-1/2}$
([Mueller et al. 2021](literatur:mueller-2021)).

For the giant planets it is the other way round. From [Jupiter](objekt:jupiter) the Sun has an
angular radius of only 0.051°, while the Galilean moons span 0.076° to 0.297°; their shadows
therefore carry a true umbra and travel across the clouds as sharp black spots. From Saturn the Sun
measures 0.028°; all the large moons exceed that, only Iapetus stays below it at 0.012° and casts
nothing but an antumbra. Whether a shadow reaches the planet at all depends on the height of the Sun
above the equatorial plane in which the moons travel: a moon at distance $r$ from the planet's centre
casts its shadow onto the globe of radius $R$ only while that height stays below $\arcsin(R/r)$. At
Jupiter, with an axial tilt of 3.1°, this is 9.5° for Io but only 2.1° for Callisto: Io always casts
a shadow on the planet, Callisto at times none at all. At Saturn, with an axial tilt of 26.7°, the
window ranges from 18.2° for Mimas to 2.7° for Titan, which is why shadow transits there cluster
around the planet's equinoxes.

## Open questions

- **Cause and variation of the enlargement of the shadow.** Empirically it is settled: a mean
  effective layer height of 86.9 ± 0.2 km over 94 eclipses, corresponding to 1.88 %, where the
  percentage depends somewhat on the lunar distance but the height does not; individual eclipses
  depart clearly from the mean, for instance 90.7 ± 1.2 km on 6 July 1982 against 82.2 ± 1.0 km on
  17 August 1989 ([Herald and Sinnott 2014](literatur:herald-2014)). The NASA canon follows Danjon
  with 75 km but cites crater timings that rather support Chauvenet's 2 %
  ([Espenak and Meeus 2009](literatur:espenak-2009)). Physically, the absorbing layer once assumed
  has never been measured; a model of refraction, absorption and focusing gives 211 km instead,
  reduced by ozone absorption, clouds and high terrain at the Earth's limb, and observers may not
  place the shadow boundary where the brightness gradient is steepest
  ([Mallama 2021](literatur:mallama-2021)). That work is a preprint; whether the difference between
  211 km and 87 km lies in the atmosphere or in perception is open.
- **Extrapolating ΔT.** The mean trend is well determined, as is the departure from pure tidal
  friction; on top of it, however, lies a variation with a period of about 14 centuries
  ([Morrison et al. 2021](literatur:morrison-2021)), and even the split into tidal and non-tidal
  parts depends on the assumed secular acceleration of the Moon, which the canon explicitly calls
  very poorly known and possibly not constant
  ([Espenak and Meeus 2006](literatur:espenak-2006)). Extrapolation beyond a few centuries therefore
  carries an uncertainty that shows up for ancient eclipses as a shift in longitude on the map.
- **Assessment of the 1919 measurements.** Part of the literature has held the selection of plates
  to be biased since 1980; Kennefick counters that it was not Eddington but Dyson who discarded the
  astrographic plates, and did so on comprehensible grounds of unquantifiable systematic errors
  ([Kennefick 2009](literatur:kennefick-2009)). A re-analysis of both analyses concludes that the
  1919 calculation is statistically sound while the 1980 criticism is methodologically untenable;
  at the same time it shows that this criticism is still adopted by part of the specialist literature
  and rejected by another part
  ([Gilmore and Tausch-Pebody 2022](literatur:gilmore-2022)). For physics the question has no
  consequences: the deflection of light has long been measured more accurately by other methods
  ([Pasachoff 2009](literatur:pasachoff-2009)).

## In the model

- **Search:** Orrery searches for lunar eclipses only, purely geocentrically from the orbits. From
  the starting time the search samples, in steps of 0.25 days, the angle between the direction to the
  Moon and the shadow axis, refines each local minimum — each of which is a full Moon — by golden
  section within a fixed window of ±0.5 days down to 10⁻⁴ days, about 9 s, and finds entry and exit
  by bisection. The umbral radius carries Chauvenet's factor of 1.02; the penumbra does not appear at
  all. After three years without a hit the search gives up. It knows only "partial" and "total" and
  returns neither magnitude nor gamma nor a saros number; it never reports a purely penumbral
  eclipse.
- **Accuracy:** against the NASA catalogue the model finds 135 of the 143
  umbral eclipses from 1951 to 2050, with the maximum off by up to 3.0 h (root mean square 1.8 h);
  eight small partial eclipses are missing, and for three total ones the search reports a partial
  eclipse ([Scene: Lunar eclipse](szene:mondfinsternis)). The cause is the Kepler ellipse without
  periodic perturbations: the data set of the [Moon](objekt:moon) matches the mean perigee and
  apogee distances (363,359 km and 405,574 km against 363,396 km and 405,504 km in the canon), not
  the extremes of individual months.
- **Rendered shadows:** the display picks up to four spherical shadow casters per body — for a
  planet its own moons, for a moon the parent body and its siblings. The Sun never gets shadow
  casters, so transits of Mercury and Venus do not appear. Where there are more than four candidates
  the limit bites: Saturn keeps Titan, Tethys, Dione and Rhea, so Mimas, Enceladus and Iapetus never
  cast a shadow there; at Uranus, Oberon drops out.
- **Solar eclipses:** they are not searched for and have no scene, but they arise in the picture by
  themselves because the Moon is a shadow caster for the Earth. At the model's maximum of the eclipse
  of 2 August 2027 the visible fraction of the Sun on the Earth's surface drops to zero; the umbra
  there has a radius of 101 km and the penumbra one of 3381 km. Its diameter of 203 km stays about a
  fifth below the path width of 258 km in the catalogue. In four checked cases the time was
  0.0 to 2.1 h away from the NASA catalogue.
- **Brightness in the shadow:** the shadow factor is the uncovered area fraction of two discs treated
  as uniformly bright; the antumbra is covered as a separate case. Limb darkening is missing: with
  the Eddington approximation a small body in front of the disc centre would block 25 % more light
  than its area, at the limb only half. For a central annular eclipse at mean apogee the model leaves
  15.1 % of the light, with Eddington limb darkening it would be 10.5 %.
- **Colour:** only the Earth carries an umbral colour. The shadow of Jupiter or Saturn on a moon
  therefore stays colour-neutral and merely darkens. The shadow factor acts on the direct light, not
  on the night-side fill light. All of this applies only with the "Shadows" switch on and the shadow
  caster visible. Further simplifications: [limits of the model](thema:modell).

*As of September 2026*
