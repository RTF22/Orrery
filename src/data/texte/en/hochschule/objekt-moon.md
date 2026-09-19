# Moon

This text treats the Moon as a body measured by geodesy and seismology: parameters from the gravity
field and laser ranging, the interior, the surface and sample ages, the exosphere and the extinct
dynamo, the solar-perturbed orbit together with Cassini's laws, the origin, the open controversies
and what Orrery models of all this.

## Parameters and measurement

The mass parameter comes from ephemerides that fit lunar laser ranging together with interplanetary
range measurements: the centre of the Earth moves about the Earth-Moon barycentre, and this motion
reveals the mass ratio in the orbits of spacecraft. Mass and mean density, by contrast, are only as
accurate as the gravitational constant $G$ ([Williams et al. 2014](literatur:williams-2014)). The
table gives the values of this analysis; the gravity coefficients refer to the reference radius
$R = 1738\,\mathrm{km}$.

| Quantity | Value | Uncertainty | Method | Reference |
|---|---|---|---|---|
| $GM$ | $4902.80007\,\mathrm{km}^3\,\mathrm{s}^{-2}$ | $0.00014\,\mathrm{km}^3\,\mathrm{s}^{-2}$ | ephemeris DE430: laser ranging and interplanetary data | [Williams et al. 2014](literatur:williams-2014) |
| $M$ | $7.34630 \cdot 10^{22}\,\mathrm{kg}$ | $0.00088 \cdot 10^{22}\,\mathrm{kg}$ | $GM/G$ with $G$ from CODATA 2010 | [Williams et al. 2014](literatur:williams-2014) |
| mean radius | $1737.151\,\mathrm{km}$ | below 1 m | laser altimetry from LRO | [Williams et al. 2014](literatur:williams-2014) |
| $\bar{\rho}$ | $3345.56\,\mathrm{kg}\,\mathrm{m}^{-3}$ | $0.40\,\mathrm{kg}\,\mathrm{m}^{-3}$ | from mass and radius | [Williams et al. 2014](literatur:williams-2014) |
| $J_2$ | $203.30517 \cdot 10^{-6}$ | $0.00070 \cdot 10^{-6}$ | GRAIL, field GL0660B, including the permanent tide | [Williams et al. 2014](literatur:williams-2014) |
| $C_{22}$ | $22.42635 \cdot 10^{-6}$ | $0.00022 \cdot 10^{-6}$ | as $J_2$ | [Williams et al. 2014](literatur:williams-2014) |
| $\beta = (C - A)/B$ | $631.0213 \cdot 10^{-6}$ | $0.0031 \cdot 10^{-6}$ | physical libration from laser ranging | [Williams et al. 2014](literatur:williams-2014) |
| $\gamma = (B - A)/C$ | $227.7317 \cdot 10^{-6}$ | $0.0042 \cdot 10^{-6}$ | as $\beta$ | [Williams et al. 2014](literatur:williams-2014) |
| $I_\mathrm{s}/(M R^2)$ | $0.392728$ | $0.000012$ | solid Moon without the fluid core; $J_2$, $C_{22}$, $\beta$, $\gamma$ combined | [Williams et al. 2014](literatur:williams-2014) |
| $k_2$ | $0.02416$ | $0.00022$ | GRAIL, mean of two analyses, period 1 month | [Williams et al. 2014](literatur:williams-2014) |
| $Q$ | $37.5$ | $4$ | laser ranging, period 1 month | [Williams et al. 2014](literatur:williams-2014) |

The IAU cartographic radius of 1737.4 km serves map scale and height reference
([Archinal et al. 2018](literatur:archinal-2018), Table 5); it lies 249 m above the measured mean.

The gravity field comes from the GRAIL Primary Mission: two spacecraft measured their mutual
velocity to about 0.03 µm/s, and the field GL0660B extends to degree 660; up to degree 330 it is 98 %
coherent with topography, the spacecraft orbits are determined to 20 cm, and the uncertainty of
$k_2$ fell to one fifth ([Konopliv et al. 2013](literatur:konopliv-2013)). In a field to degree 420,
more than 98 % of the signal between degrees 80 and 300 is due to topography, the mark of a highly
fractured crust that preserves the relief of craters ([Zuber et al. 2013](literatur:zuber-2013)).
Over the large impact basins the field shows a bull's-eye pattern: a central positive anomaly, the
mass concentration (mascon), surrounded by a negative collar and a positive outer ring. It results
from excavation and collapse of the basin, isostatic adjustment and the cooling and contraction of a
large melt pool ([Melosh et al. 2013](literatur:melosh-2013)).

The degree-2 coefficients depend on the principal moments of inertia $A < B < C$:

$$J_2 = \frac{C - (A + B)/2}{M R^2}, \quad C_{22} = \frac{B - A}{4 M R^2}$$

For a synchronously rotating body in hydrostatic equilibrium

$$J_2 = \frac{5}{6}\,k_\mathrm{f}\,q, \quad C_{22} = \frac{1}{4}\,k_\mathrm{f}\,q, \quad q = \frac{n^2 R^3}{GM}$$

with mean motion $n$ and fluid Love number $k_\mathrm{f}$, which is tied to the moment of inertia by
Radau-Darwin; rotation and tide together give the ratio $J_2/C_{22} = 10/3$ (derivation and limits
under [Interior structure](thema:innerer-aufbau)). With $q = 7.59 \cdot 10^{-6}$ and
$k_\mathrm{f} = 1.43$ from the measured moment of inertia, one would expect
$J_2 = 9.07 \cdot 10^{-6}$ and $C_{22} = 2.72 \cdot 10^{-6}$; the measured values are 22 and 8
times larger, with a ratio of 9.07. That the deformation is far too large for the present orbit and
rotation has been known since Laplace; it is interpreted as a fossil figure, frozen in when the Moon
was closer to the Earth. The observed figure, however, fits only an eccentric, non-synchronous orbit.
Keane and Matsuyama subtract the contributions of the mascons and basins; what remains is a
misaligned fossil figure consistent with an early synchronous orbit of low eccentricity and with
polar wander of about 15°, driven by the South Pole-Aitken basin
([Keane and Matsuyama 2014](literatur:keane-2014)). Garrick-Bethell et al. attribute most of the
degree-2 topography to early tidal heating during crust building and the rest to a tidal-rotational
bulge that froze at about 32 Earth radii; the polar axis then wandered by $36 \pm 4^\circ$
([Garrick-Bethell et al. 2014](literatur:garrick-bethell-2014)).

The mean moment of inertia follows only from combining two methods: GRAIL provides $J_2$ and
$C_{22}$, laser ranging the ratios $\beta$ and $\gamma$ from the rotation
([Williams et al. 2014](literatur:williams-2014)). In lunar laser ranging, short laser pulses travel
to one reflector at a time and back; from the travel time the distance was determined to a few
decimetres at first and to a few millimetres by 2013, $10^{-9}$ to $10^{-11}$ in relative terms. At
that time five reflectors were available, three from Apollo and two from Lunokhod, and the best
model left weighted residuals of about 18 mm; Venus and Jupiter perturb the Earth-Moon distance by
about 1 km ([Murphy 2013](literatur:murphy-2013)). The same data yield the flattening and friction of the fluid
core and the tidal friction in the Moon; the topic [Tides](thema:gezeiten) places $k_2$ and $Q$ in
context.

## Interior

According to GRAIL, the highland crust has a bulk density of only 2550 kg/m³. Together with sample
and remote-sensing data this implies a mean porosity of 12 % down to at least a few kilometres, and
the crust is 34 to 43 km thick on average instead of the roughly 50 km assumed before
([Wieczorek et al. 2013](literatur:wieczorek-2013)). In the Moscoviense basin on the far side it is
less than 1 km thin, at the Apollo 12 and 14 landing sites 30 km thick. The density varies laterally
by ±250 kg/m³; the South Pole-Aitken basin is densest, its rocks being considerably more mafic than
the surrounding anorthosites.

Deep moonquakes occur at about 900 km depth; what lies below remained largely unknown from the Apollo
data. The reference model VPREMOON determines the core radius from shear waves reflected at the core
as $380 \pm 40\,\mathrm{km}$, with a mean core density of $5200 \pm 1000\,\mathrm{kg}\,\mathrm{m}^{-3}$;
that only horizontally polarised shear waves appear reflected favours a liquid outer core
([Garcia et al. 2011](literatur:garcia-2011)). A reanalysis of the same seismograms with
array-processing methods found a solid inner and a fluid outer core beneath a partially molten
boundary layer, about 60 % liquid by volume and with less than 6 weight per cent of light elements
([Weber et al. 2011](literatur:weber-2011)).

The rotation of the Moon confirms the fluid core: friction at its boundaries measurably shifts the
orientation of the mantle, the parameter $K/C = (1.64 \pm 0.17) \cdot 10^{-8}$ per day is determined
at almost ten times its uncertainty, and the core flattening comes out as
$(2.46 \pm 1.4) \cdot 10^{-4}$. Models that match density, moment of inertia and $k_2$ at once have a
fluid outer core of 200 to 380 km radius, a solid inner core of 0 to 280 km and above them a zone of
low shear-wave velocity; the whole core holds at most 1.5 % of the mass
([Williams et al. 2014](literatur:williams-2014)). An extended dynamical model of the laser ranging
found a flattening of the core-mantle boundary of $(2.2 \pm 0.6) \cdot 10^{-4}$, hydrostatic for a
radius of 381 ± 12 km and a core fraction of 1.59 to 1.77 % of the mass, by contrast more than this
upper limit ([Viswanathan et al. 2019](literatur:viswanathan-2019)). Whether the boundary layer is actually
partially molten depends on how the frequency dependence of $Q$ is interpreted: a model with grain
boundary sliding in the mantle explains it equally well, and the available data do not distinguish
the two ([Walterová et al. 2023](literatur:walterova-2023)).

Above the mantle lies a crust of light anorthosites, in the conventional picture solidified as scum
on a global magma ocean. Because of the poorly conducting crust and heat extraction by partial
melting of convecting cumulates, this ocean took 150 to 200 million years to solidify
([Maurice et al. 2020](literatur:maurice-2020)). The ferroan anorthosite 60025 crystallised
$4360 \pm 3$ million years ago; either the Moon solidified later than thought, or these rocks are
not flotation cumulates of a magma ocean ([Borg et al. 2011](literatur:borg-2011)). For the role of
gravity field and rotation see [Interior structure](thema:innerer-aufbau).

## Surface

The near side is low and flat, dominated by volcanic maria; the far side is mountainous and heavily
cratered ([Jutzi and Asphaug 2011](literatur:jutzi-2011)). Remote-sensing data show that the crust is
not simply layered but consists of at least three provinces: the Procellarum KREEP Terrane (PKT) in
the Procellarum–Imbrium region, which holds about 40 % of the crust's thorium in about 10 % of its
volume, about 5 ppm on average; the Feldspathic Highlands Terrane with a core of several tens of
kilometres of anorthosite; and the South Pole-Aitken Terrane, a mafic anomaly that may include upper
mantle ([Jolliff et al. 2000](literatur:jolliff-2000)). The South Pole-Aitken basin is 2000 km in
diameter ([Wieczorek et al. 2013](literatur:wieczorek-2013)). Norites from Chang'e-6 samples,
crystallised from an impact melt, date two impacts: one 4.25 billion years ago, most likely the
formation of the basin, and a resetting event within the basin 3.87 billion years ago
([Su et al. 2025](literatur:su-2025)).

Crater chronology links crater densities to the radiometric ages of returned samples. Until 2024 all
samples came from the near side, and the ages that can be assigned to particular surfaces are below
4.0 billion years. Chang'e-6 returned 1.935 kg from the far side on 25 June 2024: basalts of
$2807 \pm 3$ and norites of $4247 \pm 5$ million years. Refined with them, the chronology function
remains a combination of an exponential decrease and a linear term, and the impact rate declined
smoothly at early times rather than abruptly ([Yue et al. 2026](literatur:yue-2026)). Basalt from
Chang'e-5 crystallised $2030 \pm 4$ million years ago, the youngest radiometric age of a lunar basalt
and a key calibration point; volcanism thus lasted 800 to 900 million years longer than known until
then ([Li et al. 2021](literatur:li-2021)). Among about 3000 glass beads from the same regolith, three
are of volcanic origin and only $123 \pm 15$ million years old, rich in rare earth elements and
thorium ([Wang et al. 2024b](literatur:wang-2024b)). On the far side, volcanism occurred $4203 \pm 4$ million years
ago from a KREEP-rich source and $2807 \pm 3$ million years ago from a KREEP-poor one, over more than
1.4 billion years; because the younger age agrees with crater counts, the near-side chronology also
applies to the far side ([Zhang et al. 2025a](literatur:zhang-2025a)).

At the equator the temperature varies between 95 and 390 K over the day
([NSSDC Moon Fact Sheet](quelle:nssdc-moon)). Water ice can survive in permanently shadowed cold
traps at the poles. On 9 October 2009 a spent Centaur upper stage struck the permanently shadowed
crater Cabeus; within the field of view of LCROSS the ejecta plume held up to
$155 \pm 12\,\mathrm{kg}$ of water vapour and ice, an estimated $5.6 \pm 2.9$ per cent by mass of
ice in the regolith at the impact site ([Colaprete et al. 2010](literatur:colaprete-2010)). In the
scattered light inside cold traps, spectra from the Moon Mineralogy Mapper show water ice right at
the surface, within 20° of both poles and mostly at no more than 110 K; only about 3.5 % of the cold traps
show it, locally at about 30 per cent by mass ([Li et al. 2018a](literatur:li-2018a)).

## Atmosphere and magnetosphere

The Moon has only an exosphere: about 25,000 kg in total, at night $3 \cdot 10^{-15}$ bar and
$2 \cdot 10^{5}$ particles per cm³ at the surface, mainly helium, neon, hydrogen and argon; the
composition is poorly known and variable ([NSSDC Moon Fact Sheet](quelle:nssdc-moon)). The mass
spectrometer on LADEE made the first global maps of helium and argon and discovered neon. Helium
comes from solar-wind alpha particles and from an internal source of
$1.9 \cdot 10^{23}$ atoms per second; neon reaches densities similar to helium at night, and over the
western maria a local enhancement of argon was found ([Benna et al. 2015](literatur:benna-2015)).

The Moon has no global magnetic field today, but its rocks and crust are magnetised. Laboratory and
spacecraft measurements indicate that much of this magnetisation comes from a core dynamo that
existed from at least 4.25 to 3.56 billion years ago, at times as strong as the present Earth's
field, and weakened by at least an order of magnitude by about 3.3 billion years ago
([Weiss and Tikoo 2014](literatur:weiss-2014)). Two breccias cooled $0.44 \pm 0.01$ and
$0.91 \pm 0.11$ billion years ago in a field below 0.1 µT; together with earlier palaeointensities,
the dynamo probably ended between 1.92 and 0.80 billion years ago, driven at the end most likely by
core crystallisation ([Mighani et al. 2020](literatur:mighani-2020)). Chang'e-6 basalts from 2.8
billion years ago carry palaeointensities of about 5 to 21 µT, a rebound after the decline around 3.1
billion years ago ([Cai et al. 2025](literatur:cai-2025)).

A magnetosphere of its own is therefore absent; there are only local crustal fields. Above a strong
anomaly near the antipode of Mare Crisium, Chandrayaan-1 imaged a mini-magnetosphere in backscattered
hydrogen atoms, a partial void in the solar wind 360 km across, surrounded by a 300 km wide region of
enhanced plasma flux ([Wieser et al. 2010](literatur:wieser-2010)).

## Orbit, rotation and dynamics

The mean orbital elements are a semi-major axis of 384,400 km, an eccentricity of 0.0549 and an
inclination of 5.145° to the ecliptic, with a sidereal period of 27.3217 days and a synodic period of
29.53 days; because the orbit changes over the course of the year, the distance ranges from about
357,000 to 407,000 km ([NSSDC Moon Fact Sheet](quelle:nssdc-moon); for the quantities see
[Orbital elements](thema:bahnelemente)). Relative to the stars the nodes regress in 18.6 years
(6793.48 days) and the line of apsides advances in 8.85 years
([Espenak and Meeus 2009](literatur:espenak-2009)). The fundamental arguments of the IERS Conventions
give 27.5545 days for the anomalistic, 27.2122 days for the draconic and 29.5306 days for the synodic
month ([Petit and Luzum 2010](literatur:petit-2010), Eq. 5.43).

The [Sun](objekt:sun) continually distorts the orbit. From 2008 to 2010 the instantaneous
eccentricity varied between 0.0266 and 0.0762, largest when the line of apsides points towards the
Sun, on average every 205.9 days, and the inclination between 5.00° and 5.30°, largest when the Sun
is in the line of nodes, so always close to its maximum at [eclipses](thema:finsternis)
([Espenak and Meeus 2009](literatur:espenak-2009)). In ecliptic longitude this appears as a series:

$$\lambda = L + 2e\sin l + \frac{5}{4}e^2\sin 2l + 1.274^\circ \sin(2D - l) + 0.658^\circ \sin 2D - 0.185^\circ \sin l_\odot + \ldots$$

with mean longitude $L$, mean anomaly $l$ of the Moon, $l_\odot$ of the Sun and mean elongation $D$.
The first two terms are the equation of the centre of the Kepler ellipse, $2e = 6.29^\circ$. They are
followed by the evection with a period of 31.81 days, the variation with 14.77 days and the annual
equation with 365.26 days; the periods follow from the rates of the fundamental arguments
([Petit and Luzum 2010](literatur:petit-2010), Eq. 5.43). The dots stand for smaller terms and the
reduction of the orbital longitude to the ecliptic. The amplitudes are those of the main problem of
ELP 2000-82B, 4586.43″, 2369.91″ and −666.44″, plus 22,639.55″ or 6.2888° for the first term of the
equation of the centre ([Chapront-Touzé and Chapront 1988](literatur:chapront-touze-1988)). Our own
cross-check gives the same values: the difference between the geocentric longitude of the Moon in
the ephemeris DE441 ([Park et al. 2021](literatur:park-2021)) and a Kepler ellipse with mean
elements, every six hours from 1990 to 2030, is explained by these three and five smaller terms of
0.04° to 0.06° down to 0.044° root mean square.

The rotation is [tidally locked](thema:gebundene-rotation), and the spin axis follows Cassini's laws:
the lunar equator precesses retrograde along the ecliptic with the orbital node in 18.6 years and is
tilted to it by only 1.543°, opposite to the orbital inclination
([Williams et al. 2014](literatur:williams-2014)). The spin axis, the orbit normal and the axis about
which the orbit precesses, for the Moon nearly the ecliptic pole, thus lie in one plane. Peale showed
that the stable coplanar configurations represent extremes of the orientation energy
([Peale 1969](literatur:peale-1969)); the Moon is in Cassini state 2 because state 1 does not exist
for it ([Gladman et al. 1996](literatur:gladman-1996)). The spin axis is therefore inclined by
$1.543^\circ + 5.145^\circ = 6.688^\circ$ to the orbit normal; the fact sheet gives 6.68°.
Friction in the Moon and at the core boundary shifts
the pole by 0.27″ and the node by −10.0″ from this configuration
([Williams et al. 2014](literatur:williams-2014)).

Because the Moon rotates uniformly but moves non-uniformly, and because its axis is inclined to the
orbit normal, it appears to rock over the month, the optical libration: by the difference between
true and mean longitude, up to about ±8° according to DE441 from 1990 to 2030, and by about ±6.7° in
latitude; the reflector arrays thereby tilt by up to 10° from the line of sight
([Murphy 2013](literatur:murphy-2013)). The physical libration, the actual rotational oscillation
under the external gravitational torques, depends on $\beta$ and $\gamma$
([Williams et al. 2014](literatur:williams-2014)). With the best model in 2013, the libration angles
needed corrections of only 5 to 7 nanoradians in weighted root mean square for the reflectors to
agree;
in addition there is a wobble with a period of 75 years and an amplitude of 70 m
([Murphy 2013](literatur:murphy-2013)).

[Tidal friction](thema:gezeiten) drives the Moon outwards. Laser ranging and tide models give
$\mathrm{d}a/\mathrm{d}t = 38.30 \pm 0.08\,\mathrm{mm}$ per year and a decrease of the mean motion by
25.97 ± 0.05″ per century²; a solution with three tidal time delays gives an increase of the
eccentricity by $(1.50 \pm 0.10) \cdot 10^{-11}$ per year. Dissipation in the Earth causes most of
the change in $n$ and $a$, dissipation in the Moon reduces the increase of the eccentricity
([Williams and Boggs 2016](literatur:williams-2016)). The scene
[The dance of the Moon](szene:mondtanz) shows the elliptical orbit around the Earth.

## Formation and evolution

According to the giant-impact hypothesis, the Moon formed from the debris of an off-centre collision
with the young [Earth](objekt:earth). Canup and Asphaug found impacts by a smaller body than
previously thought necessary that, near the end of the Earth's growth, yield an iron-poor Moon and the
present angular momentum ([Canup and Asphaug 2001](literatur:canup-2001)). In such simulations,
however, more than 40 % of the disk comes from the impactor, while the isotope ratio ⁵⁰Ti/⁴⁷Ti of Moon
and Earth is identical to about 4 ppm, one hundred and fiftieth of the range among meteorites
([Zhang et al. 2012](literatur:zhang-2012)). The oxygen isotopes, too, differ in Δ′¹⁷O by only
−1 ± 5 ppm (2 standard errors), which suggests vigorous mixing in an energetic impact with high
angular momentum ([Young et al. 2016](literatur:young-2016)). In tungsten the Moon shows an excess of
¹⁸²W of $20.6 \pm 5.1$ ppm ([Touboul et al. 2015](literatur:touboul-2015)) or $27 \pm 4$ ppm
([Kruijer et al. 2015](literatur:kruijer-2015)) relative to the present Earth's mantle; both groups
attribute it to unequally distributed late accretion, before which the values were equal.

Several variants aim to explain the similarity. An impact on a fast-spinning proto-Earth produces a
disk derived mainly from the Earth's mantle ([Ćuk and Stewart 2012](literatur:cuk-2012)), a
considerably larger impactor a disk with the composition of the mantle
([Canup 2012](literatur:canup-2012)); both then need a resonance with the Sun to remove angular
momentum. According to Lock et al., energetic impacts with high angular momentum leave a synestia, a
structure beyond the corotation limit, in whose vapour of bulk silicate Earth composition the Moon
condenses ([Lock et al. 2018](literatur:lock-2018)). According to Rufu et al., the Moon may also
result from several smaller impacts whose debris disks each form a moonlet that migrates outwards and
merges with the others ([Rufu et al. 2017](literatur:rufu-2017)). Context within planet formation:
[Formation of the Solar System](thema:entstehung).

The age is disputed. Zircons from Apollo 14 samples require a differentiated crust 4.51 billion years
ago and thus a Moon within the first 60 million years or so of the Solar System
([Barboni et al. 2017](literatur:barboni-2017)). A magma ocean that takes 150 to 200 million years to
solidify, combined with the sample ages, leads instead to $4.425 \pm 0.025$ billion years
([Maurice et al. 2020](literatur:maurice-2020)). Nimmo et al. interpret the frequent ages around 4.35
billion years as remelting by tidal heating when the receding Moon passed through the Laplace plane
transition; the Moon could then have formed within a few tens of million years of the formation of
the Solar System, which also explains why there are fewer large basins than expected
([Nimmo et al. 2024](literatur:nimmo-2024)).

## Open questions

- **Impact and isotopes:** Herwartz et al. measured a difference of 12 ± 3 ppm in Δ¹⁷O as a trace of
  the impactor Theia, alternatively of a late supply of carbonaceous chondrites
  ([Herwartz et al. 2014](literatur:herwartz-2014)), Cano et al. a dependence on rock type, with
  heavier values in the deep lunar mantle ([Cano et al. 2020](literatur:cano-2020)); Young et al. and
  Fischer et al. find no difference, Fischer et al. not even below one ppm
  ([Young et al. 2016](literatur:young-2016); [Fischer et al. 2024](literatur:fischer-2024)).
  Which scenario is correct remains open.
- **Age:** early, no later than 4.51 billion years ago ([Barboni et al. 2017](literatur:barboni-2017))
  or within a few tens of million years of the formation of the Solar System
  ([Nimmo et al. 2024](literatur:nimmo-2024)), or later, $4.425 \pm 0.025$ billion years ago
  ([Maurice et al. 2020](literatur:maurice-2020)); the anorthosite age of 4.36 billion years
  requires either a late-solidifying Moon or a different origin of the anorthosites
  ([Borg et al. 2011](literatur:borg-2011)).
- **Duration and strength of the dynamo:** Tarduno et al. show that a young impact glass carries a
  strong, Earth-like magnetisation, while crystals from 3.9 to 3.2 billion years ago that could record
  a strong field show none; the Moon, they conclude, had no long-lived dynamo
  ([Tarduno et al. 2021](literatur:tarduno-2021)). This is contradicted by a dynamo that ended only
  1.92 to 0.80 billion years ago ([Mighani et al. 2020](literatur:mighani-2020)) and by the field
  strengths from Chang'e-6 ([Cai et al. 2025](literatur:cai-2025)).
- **Cause of the asymmetry:** proposals include internal causes and external ones such as a second
  moon about 1200 km across that slowly collided with the far side
  ([Jutzi and Asphaug 2011](literatur:jutzi-2011)), or mantle heating by the South Pole-Aitken impact
  that moved thorium- and titanium-rich cumulates to the near side
  ([Jones et al. 2022](literatur:jones-2022)).
- **State of the core:** seismology points to a solid inner core
  ([Weber et al. 2011](literatur:weber-2011)), as does a comparison with thermodynamic models giving
  $258 \pm 40\,\mathrm{km}$ ([Briaud et al. 2023](literatur:briaud-2023)); the geodetic data allow
  0 to 280 km ([Williams et al. 2014](literatur:williams-2014)). Whether a partially molten layer
  surrounds the core is also open ([Walterová et al. 2023](literatur:walterova-2023)).
- **Fossil figure:** early tidal heating and a bulge frozen at 32 Earth radii
  ([Garrick-Bethell et al. 2014](literatur:garrick-bethell-2014)) or a figure that fits a synchronous
  orbit only after the basins are subtracted ([Keane and Matsuyama 2014](literatur:keane-2014)).

## In the model

- **Orbit:** Orrery computes the Moon as a Kepler ellipse with fixed $a = 0.00257$ AU (384,467 km,
  the rounded fact-sheet mean of 384,400 km), $e = 0.0549$ and $I = 5.145^\circ$ relative to the
  ecliptic J2000 ([Orbital elements](thema:bahnelemente)); mean longitude, perigee and node advance
  linearly. The node and perigee rates from Meeus are reduced by the general precession of
  1.3969713° per century, to −1935.5333° and +4067.6168° per century
  ([Reference systems](thema:bezugssysteme)); the node thus circulates in 18.600 years, the perigee in
  8.850 years. The distance shown in the data panel thus stays between
  $a\,(1 - e) = 363359\,\mathrm{km}$ and $a\,(1 + e) = 405574\,\mathrm{km}$. Periodic
  perturbations are missing: against DE441 the longitude deviates from 1990 to 2030 by up to 2.39°,
  1.03° root mean square, the latitude by up to 0.34° and the distance by up to 7010 km. In longitude
  almost all of this is evection, variation and annual equation, in distance evection and variation
  (see Orbit); in latitude it is the variation of inclination and node, main term
  $0.173^\circ \sin(2D - F)$ with the mean argument of latitude $F$
  ([Chapront-Touzé and Chapront 1988](literatur:chapront-touze-1988)). The mean longitude does not
  drift from 1800 to 2100. The [lunar eclipse](szene:mondfinsternis) is thus off
  by up to 3 h. The Earth's centre sits at the Earth-Moon barycentre ([Earth](objekt:earth)); the
  vector from the Earth to the Moon is not affected by this.
- **Rotation:** The rotation period of 655.71984 h is exactly the sidereal period $360^\circ/\dot{L}$
  of the data set, 27.32166 days; the map therefore does not drift against the direction of the
  Earth. The phase is zero at the epoch. The pole is the expression of the IAU report of 2009 at the
  epoch including periodic terms, 266.8577° and 65.6411° ([Archinal et al. 2011](literatur:archinal-2011)),
  1.570° from the ecliptic pole instead of the mean 1.543°. The map centre, the centre of the near
  side, lies 4.18° east of the node $Q$ at the epoch, the IAU prime meridian according to the same
  expression at 41.20°. On average the Earth therefore stands over 37.0° east longitude on the map
  instead of 0°, and the annual mean changes from 1800 to 2126 only between 36.8° and 37.2°. The
  angle between map centre and Earth direction is 41.7° at the epoch (Earth over 41.3° E, 6.7° S),
  37.5° on 19 September 2026 (37.4° E, 3.5° N), 31.2° in 1900 (31.2° E, 1.5° S) and 34.1° in 2100
  (34.1° E, 1.6° S). Over the month the longitude swings between 30.5° and 43.5°; the contributions
  of evection and variation are missing from this libration.
- **Pole and Cassini state:** The pole is fixed while the orbital node moves. At the epoch pole and
  orbit normal are 6.72° apart, almost in the Cassini configuration; after half a nodal cycle
  (2 May 2009, again on 8 December 2027) they are only 3.57° apart, on 19 September 2026 3.76°; 6.72°
  recurs with the nodal cycle, on 20 August 2018 and on 27 March 2037. The libration in latitude thus varies between about ±3.6° and
  ±6.7°. The obliquity in the data panel, 6.7°, is the value at the epoch.
- **Scale:** The lunar distance grows with the size factor like the radii: in "Diagram" 50-fold to
  19.2 million km, in "Compact" 200-fold to 76.9 million km; the ratio of distance to Earth radius
  stays 60.3. The point light sits in the displayed Sun. From 19 September 2026, within one month the
  light direction at the displayed Moon deviates from the true one by up to 7.6° in "Diagram" and
  32.7° in "Compact", and so does the phase; the shadows for eclipses use the true direction.
- **Albedo:** The data set carries the geometric albedo of 0.12 from the fact sheet; the lunar map is
  scaled by 0.384. The material yields a geometric albedo of $0.640\,p = 0.077$ and a Bond albedo of
  $0.955\,p = 0.115$; the fact sheet gives 0.12 and 0.11
  ([NSSDC Moon Fact Sheet](quelle:nssdc-moon)). The phase integral of the model is 1.49, the one
  determined from measured lunar phase curves $0.48 \pm 0.02$
  ([Shevchenko et al. 2019](literatur:shevchenko-2019)). Together the two fact-sheet values would
  give a phase integral of 0.92 and thus do not fit this measurement. The opposition effect and the
  steep phase curve of the regolith are missing ([Albedo and brightness](thema:photometrie)).
- **Data panel:** The diameter of 3475 km is twice the cartographic radius of 1737.4 km; laser
  altimetry would give 3474.3 km. The mass, 7.35 · 10²² kg ($7.346 \cdot 10^{22}\,\mathrm{kg}$ in
  the data set), multiplied by $G$ from CODATA 2018 gives a $GM$ 29 ppm above the ephemeris value. The
  data panel computes the orbital period of 27.3 days from Kepler's law with $a$ and
  $G\,(M_\oplus + M)$: 27.2916 days, 0.11 % below the sidereal period with which the Moon moves in the
  model. Rotation period 27.3 days and eccentricity 0.055 are fixed, node and perigee move with the
  reduced rates. Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
