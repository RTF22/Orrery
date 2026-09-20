# Venus

In mass and radius, Venus is almost a twin of [Earth](objekt:earth), yet in rotation, atmosphere and
surface history it is as different from its nearest relative as any planet could be. The radar probe
Magellan (1990–1994) was the first to map the entire surface, while Venus Express (2006–2014) and the
Japanese orbiter mission Akatsuki (since 2015) re-measured the atmosphere and rotation across
decades. This text presents Venus's interior, surface, atmosphere and dynamics, introduces the open
disputes over its core, present-day volcanism, phosphine and early climate, and finally describes
what Orrery reproduces of it.

## Parameters and measurement

Radio tracking of Magellan provided the first global gravity field, with the highest resolution
reaching spherical-harmonic degree and order 180 in selected equatorial regions. Compared with the
topography obtained by the same mission, gravity and relief correlate strongly down to short
wavelengths – the basis for all later models of how Venus's highlands, such as Ishtar Terra and
Aphrodite Terra, are supported ([Konopliv et al. 1999](literatur:konopliv-1999)); exactly how that
support works is closely tied to the missing plate tectonics discussed under "Interior".

Fifteen years of Earth-based radar observations (2006 to 2020) determined Venus's rotation more
precisely than ever before: the mean sidereal day lasts $243.0226 \pm 0.0013$ Earth days, retrograde,
the tilt of the spin axis against its own orbital plane is $2.6392 \pm 0.0008^\circ$, and the spin
axis precesses at $44.58 \pm 3.3$ arc seconds per year. From the precession rate follows the
normalized moment of inertia $C/(MR^2) = 0.337 \pm 0.024$
([Margot et al. 2021](literatur:margot-2021)). The same data set shows that the rotation period
itself fluctuates by 61 ppm, on average about 20 minutes, with a possible diurnal or semidiurnal
periodicity; this requires that at least about 4% of the atmosphere's angular momentum is
transferred to the solid body and back
([Margot et al. 2021](literatur:margot-2021)) – early evidence that solid-body and atmospheric tides
jointly govern Venus's rotation (see "Orbit, rotation and dynamics" and
[Tidal locking](thema:gebundene-rotation)).

| Quantity | Value | Uncertainty | Determination | Reference |
|---|---|---|---|---|
| Mass | $4.8673 \cdot 10^{24}\,\mathrm{kg}$ | – | Magellan/Venus Express orbit tracking | [NSSDC Venus Fact Sheet](quelle:nssdc-venus) |
| $GM$ | $324860\,\mathrm{km^3\,s^{-2}}$ | – | Magellan/Venus Express orbit tracking | [NSSDC Venus Fact Sheet](quelle:nssdc-venus) |
| Volumetric mean radius | $6051.8\,\mathrm{km}$ | – | Magellan altimetry | [NSSDC Venus Fact Sheet](quelle:nssdc-venus) |
| Gravity field | degree/order 180 (equatorial) | – | Magellan Doppler tracking | [Konopliv et al. 1999](literatur:konopliv-1999) |
| Sidereal rotation | $243.0226\,\mathrm{d}$ | $0.0013\,\mathrm{d}$ | Earth-based radar 2006–2020 | [Margot et al. 2021](literatur:margot-2021) |
| Tilt against orbital plane | $2.6392^\circ$ | $0.0008^\circ$ | Radar spin axis | [Margot et al. 2021](literatur:margot-2021) |
| $C/(MR^2)$ | $0.337$ | $0.024$ | Radar precession rate | [Margot et al. 2021](literatur:margot-2021) |

From mass and volumetric mean radius follows a mean density of $5243\,\mathrm{kg\,m^{-3}}$, only
slightly below Earth's – a central plank of the "twin" analogy that the interior structure qualifies
in the next section.

## Interior

Venus's [moment of inertia factor](thema:innerer-aufbau) of $0.337$ lies closer to that of a
homogeneous sphere ($0.4$) than Earth's value of $0.3307$; its mass is thus somewhat less
concentrated toward the centre than Earth's, consistent with a proportionally smaller or less dense
core ([Margot et al. 2021](literatur:margot-2021)). Whether that core is today liquid, partially
liquid or fully solid remains open: unlike [Mercury](objekt:mercury) and Earth, Venus has no global
magnetic field, and O’Neill names four, not mutually exclusive, explanations – slow rotation alone is
unlikely to be sufficient for an inefficient dynamo; a mantle made hotter by the absence of plate
tectonics could keep the heat flow out of the core too small to drive a dynamo; a missing solid inner
core would remove the core's driver of thermochemical convection; or the entire core has already
solidified. An Earth-like, partly liquid core is compatible with the absence of a dynamo only if the
thermal conductivity of the core material lies toward the high end of current estimates (above about
$100\,\mathrm{W\,m^{-1}\,K^{-1}}$); at the lower estimates of 40 to $50\,\mathrm{W\,m^{-1}\,K^{-1}}$,
the models favour a core that has fully solidified or retained a primordial stratification
([O’Neill 2021](literatur:oneill-2021)).

Above the core lies a silicate mantle and a crust; the strong correlation between gravity and
topography down to short wavelengths (see above) provides the basis from which the thickness of the
crust beneath the highlands is modelled ([Konopliv et al. 1999](literatur:konopliv-1999)). Venus has
no plate tectonics in the terrestrial sense – no set of global, interlocking plates with subduction
zones – yet it is not a rigid stagnant lid either: satellite images reveal a globally distributed
network of crustal blocks in the lowlands that have rotated and shifted laterally relative to one
another after the youngest plains material had already solidified; stresses from mantle convection
are sufficient to fracture the upper crust there in a brittle manner. This pattern is more dynamic
than on Mercury, the Moon or Mars, yet more restrained than on modern Earth – a possible hint at how
planetary tectonics may have operated during Earth's own hotter early history
([Byrne et al. 2021](literatur:byrne-2021)). As alternatives to a frozen stagnant lid, research
discusses an episodic regime with recurring, large-scale crustal renewal as well as the ongoing but
spatially distributed cracking of the lithosphere just described; both ideas are closely tied to the
question, addressed in the next section, of whether the surface was once resurfaced globally or
renews itself continuously.

## Surface

Roughly a thousand mapped impact craters are distributed almost randomly across Venus's surface, only
a few partly buried by younger lava flows
([Bjonnes et al. 2012](literatur:bjonnes-2012)). Strom, Schaber and Dawson read a single global event
into this: a catastrophic resurfacing an estimated few hundred million years ago erased almost the
entire surface that existed before through volcanism, after which the crater count grew only slowly
([Strom et al. 1994](literatur:strom-1994)). Monte Carlo models of crater accumulation show, however,
that the same near-random distribution fits equally well to an equilibrium model in which many
spatially smaller volcanic or tectonic events continuously erase craters throughout the planet's
history, without there ever having been a single global event
([Bjonnes et al. 2012](literatur:bjonnes-2012)); which of the two pictures is correct is one of the
open questions below. Both models yield a mean surface age of roughly a few hundred million years –
geologically young compared with the multi-billion-year-old crust of the Moon or Mercury.

Two landforms are peculiar to Venus. Tesserae are highland terrains strongly deformed, folded and
fractured in multiple directions; they are considered the structurally oldest exposed crust and carry
the same tectonic imprint seen in the lowlands, only more intensely developed. Coronae are ring-shaped
volcano-tectonic structures often several hundred kilometres across, interpreted as the surface
expression of rising or sinking mantle flow
([Byrne et al. 2021](literatur:byrne-2021); [Widemann et al. 2023](literatur:widemann-2023)). Whether
Venus is still volcanically active today was long unclear; two pieces of evidence now argue for it.
Thermal emissivity data from Venus Express show anomalies at several suspected hotspots, including
Idunn Mons, consistent with lava flows too little weathered to be geologically old
([Smrekar et al. 2010](literatur:smrekar-2010)). More directly still: comparing two Magellan radar
images of the same volcanic vent on Maat Mons taken eight months apart (February and October 1991)
shows a change in shape from a circular to an irregular opening, together with additional lava flows
downhill from the vent in the later image – the first direct evidence of surface change from
volcanism during an ongoing mission
([Herrick and Hensley 2023](literatur:herrick-2023)). At the surface itself, conditions of 92 bar of
pressure and 464 °C (737 K) match those found 900 m deep in Earth's oceans, at a heat that would melt
lead ([NSSDC Venus Fact Sheet](quelle:nssdc-venus)).

## Atmosphere and magnetosphere

Venus's atmosphere is 96.5% carbon dioxide and 3.5% nitrogen
([NSSDC Venus Fact Sheet](quelle:nssdc-venus)), with traces of sulfur dioxide, water vapour, carbon
monoxide and other gases whose abundances vary in space and time
([Marcq et al. 2018](literatur:marcq-2018)). The carbon dioxide alone would already drive a strong
greenhouse effect; the unbroken, several-tens-of-kilometres-thick cloud deck of sulfuric acid
droplets between roughly 45 and 70 km altitude reinforces it further while also reflecting a good
three-quarters of the incoming sunlight (Bond albedo $0.76$), so that radiative equilibrium at this
albedo and Venus's solar distance of $0.7233\,\mathrm{AU}$ gives an effective temperature of about
229 K, close to the effective emission temperature of 228.5 K from a dedicated radiative-balance
model ([Haus et al. 2016](literatur:haus-2016); figures as in
[Albedo and brightness](thema:photometrie)) – the actual surface temperature of 464 °C lies far
above this, entirely attributable to the greenhouse effect of the dense atmosphere beneath.

The most striking feature of the atmospheric dynamics is superrotation: the cloud top circles the
planet in only about four days, roughly sixty times faster than the solid body itself
([Read and Lebonnois 2018](literatur:read-2018)). How such extreme rotation is maintained against
friction at the surface has been one of the hardest questions in atmospheric dynamics for decades;
every proposed mechanism requires a global meridional overturning circulation, but how strongly
non-axisymmetric waves contribute differs from model to model and remains unsettled
([Read and Lebonnois 2018](literatur:read-2018)). The Japanese orbiter Akatsuki has provided the most
precise finding so far for the cloud top itself: thermal tides – temperature waves excited by solar
heating that travel with the rotation – transport angular momentum equatorward and thereby maintain
the rotation peak near the cloud top at low latitudes, while other planetary-scale waves and
small-scale turbulence act in the opposite direction
([Horinouchi et al. 2020](literatur:horinouchi-2020)).

One of the more recent disputes concerns phosphine: in 2020 Greaves and colleagues reported, from
millimetre-wave observations with the James Clerk Maxwell Telescope and ALMA, a concentration of
about 20 ppb of phosphine in the cloud layer, a gas that on Earth is produced almost exclusively by
biological or industrial processes ([Greaves et al. 2021](literatur:greaves-2021)). An independent
reanalysis of the same and additional spectra found no robust detection instead: the absorption line
in question lies so close to a line of sulfur dioxide, a common cloud-layer gas with known variable
concentration, that as little as about 100 ppb of sulfur dioxide could explain the observed signal
without any phosphine at all
([Villanueva et al. 2021](literatur:villanueva-2021)); whether Venus's clouds actually contain
phosphine therefore remains open (see "Open questions").

Venus has no global magnetic field of its own – measurements limit any dipole moment to roughly one
hundred-thousandth of Earth's. The solar wind nonetheless shapes an induced magnetosphere around
Venus: the interplanetary magnetic field carried by the wind piles up against the conducting
ionosphere to form a magnetic barrier, with a subsolar bow-shock distance of about 1.4 Venus radii
(1.36 to 1.46 between solar minimum and maximum) – an order of magnitude smaller than the
magnetosphere Earth's true dynamo sustains
([Futaana et al. 2017](literatur:futaana-2017)). Within this induced magnetosphere, ionospheric ions
continually escape into the tail; the ratio of escaping hydrogen to oxygen ions measured there by
Venus Express matches the stoichiometric composition of water and shows that Venus is still losing
water to space today ([Futaana et al. 2017](literatur:futaana-2017)). That Venus once held
considerably more water is suggested by the ratio of deuterium to hydrogen in today's atmosphere: it
is about 120 times the terrestrial value, as expected from the preferential loss of the lighter
hydrogen during sustained photolysis of water vapour and escape to space
([Grinspoon 1993](literatur:grinspoon-1993)).

## Orbit, rotation and dynamics

With $e = 0.0068$, Venus has the most nearly circular orbit of all the planets; its orbital
inclination of $3.39^\circ$ relative to the J2000 ecliptic is, by contrast, unremarkable. Only the
rotation is unusual: Venus rotates retrograde, against its direction of revolution, and at 243.02
days more slowly than it orbits the Sun (224.7 days); the result is a solar day – from noon to noon –
of only about 117 days, because retrograde spin and orbital motion add together in their effect on
the Sun's apparent position instead of partly cancelling as they would for prograde spin. The
retrograde motion itself is expressed in the [axial tilt](thema:achsneigung): measured against its
own orbit normal, the spin axis sits at about 177° – the axis is thus nearly perpendicular to the
orbital plane, but upside down, rather than near 0° as for most prograde-rotating planets.

That Venus, unlike most moons and unlike [Mercury](objekt:mercury) in its 3:2 resonance, does not
rotate in any simple integer ratio to its orbit but instead sits in a balance between solid-body
tides and the thermal tides of its own dense atmosphere is explained in detail in the linked text
([Tidal locking](thema:gebundene-rotation)); the fluctuation of the rotation period by 61 ppm noted
above is the direct observational trace of this balance. How Venus arrived there in the first place is
itself a subject of research: Correia and Laskar showed that chaotic perturbations from the other
planets can drive the obliquity of a Venus-like body to almost any value over very long timescales,
and that two very different evolutionary paths – one with obliquity growing toward nearly 180°, the
other via a rotation that temporarily comes to a halt and then reverses – both lead to a final state
very similar to Venus today; these paths require less restrictive initial conditions than the
classical explanation relying solely on core–mantle friction and atmospheric tides, which requires an
already high initial obliquity ([Correia and Laskar 2001](literatur:correia-2001)).

Seen from Earth, Venus shows phases, like the Moon; Galileo used this in 1610 as evidence against the
geocentric world view. Only during the rare passages through the ecliptic plane near inferior
conjunction does Venus cross in front of the Sun as a small dark disk – a so-called transit, tied to
the same three-body plane geometry as [eclipses](thema:finsternis).

## Formation and evolution

Venus formed about 4.567 billion years ago together with the other planets from the
[protoplanetary solar nebula](thema:entstehung). Whether it ever carried liquid surface water
afterward is one of the most fiercely debated questions in planet formation. A three-dimensional
climate model using Magellan's topography, estimated early solar irradiance and a cloud cover similar
to today's Earth found that, at its present slow rotation, Venus could have had moderate surface
temperatures and thus possibly liquid water until about 715 million years ago, before some
unspecified event tipped the climate
([Way et al. 2016](literatur:way-2016)). A more recent three-dimensional circulation model that
computes cloud formation itself instead of prescribing it evenly between day and night sides reaches
the opposite conclusion: water clouds preferentially form on the downwind night side, because water
vapour strongly absorbs incoming light on the day side, and these clouds heat the surface so strongly
that water never condenses anywhere, even at only 0.95 times terrestrial insolation – Venus would
accordingly never have had oceans at all
([Turbet et al. 2021](literatur:turbet-2021)). Both calculations are internally consistent; which
underlying cloud assumption better reflects the past remains open (see "Open questions").

How Venus's striking, slow, retrograde rotation evolved over time is closely tied to the chaotic
orbital dynamics described in the previous section
([Correia and Laskar 2001](literatur:correia-2001)) – a definitive reconstruction of the path from a
possible initial rotation to today's, however, is still missing. Three selected missions are set to
provide new data in the coming years: the NASA orbiter mission VERITAS (radar and gravity), the NASA
probe DAVINCI (an atmospheric probe with flybys), and the ESA-led orbiter mission EnVision (radar,
spectroscopy, radio science); together they aim to characterise Venus's interior, surface and
atmosphere across its entire history far more precisely than previous missions
([Widemann et al. 2023](literatur:widemann-2023)).

## Open questions

- **State of the core:** whether Venus's core is liquid, partially liquid or fully solid depends on
  the thermal conductivity of the core material, which is difficult to measure independently; both
  cases are consistent with the data so far ([O’Neill 2021](literatur:oneill-2021)).
- **Extent of present-day volcanism:** thermal anomalies and a single observed vent change show that
  Venus is not volcanically extinct; how frequent and how strong eruptions still are today is unknown
  ([Smrekar et al. 2010](literatur:smrekar-2010); [Herrick and Hensley 2023](literatur:herrick-2023)).
- **Phosphine in the clouds:** an initial detection and its spectroscopic rebuttal remain unresolved
  against each other
  ([Greaves et al. 2021](literatur:greaves-2021); [Villanueva et al. 2021](literatur:villanueva-2021)).
- **Early ocean:** climate models with a prescribed, Earth-like cloud distribution allow a billion
  years of moderate climate; models that compute clouds themselves rule out surface water at any time
  ([Way et al. 2016](literatur:way-2016); [Turbet et al. 2021](literatur:turbet-2021)).
- **Resurfacing – one event or many?** the same near-random crater distribution fits both a single
  global event and many smaller renewals spread across the planet's whole history
  ([Strom et al. 1994](literatur:strom-1994); [Bjonnes et al. 2012](literatur:bjonnes-2012)).

## In the model

- **Orbit:** the elements come from JPL's approximate table for 1800 to 2050, advanced linearly
  relative to the fixed J2000 ecliptic ([orbital elements](thema:bahnelemente); on the reference
  frame, see [Reference systems](thema:bezugssysteme)).
- **Sign of the rotation:** `rotationPeriodH` for Venus is set to $-5832.6\,\mathrm{h}$. `rotationAt`
  computes the rotation phase as `rotationAtEpochDeg + (jd − J2000)·24/rotationPeriodH · 360°`; a
  negative period makes the second term negative as `jd` grows, so the phase runs backward around the
  circle with time – the only branch in the code that distinguishes retrograde from prograde
  rotation. Computed independently, this gives Venus a daily phase decrease of $1.48133^\circ$,
  against the more precise rate of $1.4813688^\circ$ per day known from the IAU report
  ([Archinal et al. 2018](literatur:archinal-2018)), a deviation of under 0.003%.
- **Pole and obliquity:** the data set's pole (right ascension 272.76°, declination 67.16°) matches
  the IAU report ([Archinal et al. 2018](literatur:archinal-2018)). The plain, undirected angle
  between this pole and the orbit normal is, computed independently, 2.64°, matching the measured
  tilt of $2.6392 \pm 0.0008^\circ$ ([Margot et al. 2021](literatur:margot-2021)) – **but** this is
  not what `achsneigungDeg` returns or what the data block shows. The function additionally
  multiplies the cosine, before the arc cosine, by a sense-of-rotation factor that equals −1 for a
  negative `rotationPeriodH`; this flips the angle, giving 177.3624°, rounded to 177.4° in the data
  block – the same value as in the NSSDC fact sheet. This inversion is intentional (see the JSDoc in
  `sim/orbit.ts`) and follows the same convention by which fact sheets express retrograde rotation as
  an obliquity above 90° rather than as a negative value; the comment in `data/bodies/venus.ts` already
  explains exactly this: with this pole (below 90° from the orbit normal) and the already negative
  `rotationPeriodH`, it states that 177.36° is the correct result, whereas the earlier combination of
  the old `axialTiltDeg: 177.36` with the same negative period would have counted the retrograde
  motion twice. The recalculation above confirms this explanation, already present in the comment,
  independently – under the project's own rules, though, a comment alone still does not count as
  evidence.
- **Rotation phase at J2000:** `rotationAtEpochDeg` is set to 0, while the IAU report gives
  $W_0 = 160.20^\circ$ for the rotation phase at J2000.0
  ([Archinal et al. 2018](literatur:archinal-2018)); Venus's map centre in the model is therefore not
  where the IAU report places it – as with Mercury, this affects only the orientation of the map
  image, not the motion itself. The rotation period stored in the data set, derived from the rounded
  NSSDC fact sheet, is 243.025 days, which is 0.0065 days (about 9 minutes) longer than the period of
  243.0185 days following from the IAU report, but only 0.0024 days (about 3.5 minutes) short of the
  newer radar mean of $243.0226 \pm 0.0013$ days
  ([Margot et al. 2021](literatur:margot-2021)) – both deviations lie far below the 61 ppm
  fluctuation that this same data set does not represent at all.
- **Solar day in the model:** from the data set's rotation and orbital periods follows a solar day of
  116.75 days and a synodic period relative to Earth of 583.92 days, that is 5.0014 times the solar
  day – the same figures as in [Tidal locking](thema:gebundene-rotation) (ruling: reused verbatim).
- **Albedo:** the catalogue value 0.689 is the geometric albedo following
  [Mallama et al. 2017](literatur:mallama-2017), as shown for all planets in
  [Albedo and brightness](thema:photometrie). Using the scattering model derived there (Lambertian
  sphere times Fresnel factor, material roughness 1), a sphere of this albedo appears in the image at
  full phase without night-side fill as $0.640 \cdot 0.689 = 0.441$, with fill as
  $0.890 \cdot 0.689 = 0.613$, and as a Bond-albedo analogue as $0.955 \cdot 0.689 = 0.658$ – none of
  these numbers is itself an albedo. For the real Venus, the measured Bond albedo of 0.76 actually
  **exceeds** the geometric albedo, because the clouds scatter light strongly forward
  ([Mallama and Hilton 2018](literatur:mallama-2018)); Orrery's always-identical geometric scattering
  reverses this relationship for every body (the Bond analogue is smaller than the geometric albedo),
  so for Venus it gets the real behaviour wrong in direction, not only in magnitude.
- **Texture:** according to `ASSETS.md`, the image file shows the false-colour surface map derived
  from Magellan's radar, not the cloud deck that an observer would actually see exclusively in
  visible light. Neither atmosphere, nor scattered light, nor the greenhouse effect enters the
  rendering; `render/bodies.ts` has no dedicated atmosphere layer for any body.
- **Data block:** mass, $GM$ and volumetric mean radius match the NSSDC fact sheet
  ([NSSDC Venus Fact Sheet](quelle:nssdc-venus)). The model's $GM$, from CODATA $G$ times the
  catalogue mass, gives $324858.2\,\mathrm{km^3\,s^{-2}}$, only 0.0006% below the measured
  $324860\,\mathrm{km^3\,s^{-2}}$; the mean density computed from mass and radius,
  $5242.6\,\mathrm{kg\,m^{-3}}$, matches the value given above, $5243\,\mathrm{kg\,m^{-3}}$, to within
  rounding.
- **Scale:** as for every body, the displayed radius grows linearly with the `sizeScale` control; the
  heliocentric distance is additionally compressed with the distance exponent, with a fixed point at
  1 AU. Since Venus's true distance of about 0.723 AU lies inside this fixed point, its orbit moves
  relatively closer to Earth's as the exponent decreases, while its radius, like that of every body,
  scales only with `sizeScale`.
- Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
