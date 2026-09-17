# Tides and the Roche limit

Tides arise because the gravitational field of one body is not equally strong across the extent
of another. How much a body deforms in response also depends on its internal structure
([Murray and Dermott 2000](literatur:murray-2000), chapter 4); how much energy it loses in doing
so determines how fast orbits and rotations change. This text leads from the tidal potential via
Love numbers and dissipation to orbital evolution, tidal heating, tidal locking and the Roche
limit, and sets out what Orrery reproduces of it.

## Tidal potential and tidal acceleration

A mass $M$ at distance $d$ produces at a point $\vec{r}$, measured from the centre of mass of an
extended body, a potential whose constant part has no effect and whose linear part accelerates the
body as a whole. To leading order the deforming part is the second-degree term, as also used in the
IERS Conventions ([Petit and Luzum 2010](literatur:petit-2010), eqs. 6.6 and 7.5):

$$W_2 = \frac{G M r^2}{d^3}\,P_2(\cos\psi), \quad P_2(x) = \frac{3 x^2 - 1}{2}$$

Here $\psi$ is the angle between $\vec{r}$ and the direction $\hat{d}$ to the perturbing mass. The
gradient is the tidal acceleration:

$$\vec{a}_\mathrm{G} = \nabla W_2 = \frac{G M r}{d^3}\left( 3 \cos\psi\,\hat{d} - \hat{r} \right)$$

Along the line joining the bodies it pulls outwards with $2 G M r/d^3$, on both sides; at right
angles to it it pushes inwards with $G M r/d^3$. At the Earth's surface the Moon thus reaches
$1.1 \cdot 10^{-6}\,\mathrm{m}\,\mathrm{s}^{-2}$, about $10^{-7}$ of the gravitational
acceleration; the Sun contributes 0.46 times as much. An ocean in equilibrium on a rigid Earth
would stand $W_2/g = 0.36\,\mathrm{m}$ above its undisturbed level beneath the Moon, and high and
low water would be 0.53 m apart.

## Love numbers

A yielding body responds to $W_2$ with a deformation that itself produces a potential. The Love
number $k_2$ describes this additional potential, $h_2$ the radial and the Shida number $l_2$ the
horizontal displacement of the surface
([Love numbers, German Wikipedia](quelle:wikipedia-de-love-zahlen)). For a body of radius $R$ and
surface gravity $g$,

$$\Phi_\mathrm{ind}(r) = k_2\,W_2(R)\left( \frac{R}{r} \right)^3, \quad u_r = h_2\,\frac{W_2(R)}{g}$$

In this way $k_2$ enters the time variation of the second-degree gravity field coefficients and
$h_2$ the displacement of measuring stations ([Petit and Luzum 2010](literatur:petit-2010),
eqs. 6.6 and 7.5). A rigid body would have $k_2 = h_2 = 0$. $k_2$ is measured through the time
variation of the gravity field in spacecraft tracking or through the orbits of moons, $h_2$ through
laser altimetry, laser ranging to retroreflectors and, on Earth, through station motions:

| Body | $k_2$ | $h_2$ | Method | Reference |
|---|---|---|---|---|
| Earth | 0.30102 (semidiurnal, imaginary part −0.00130) | 0.6078 | conventional value from Earth models, without uncertainty; VLBI estimates for twelve diurnal tides shift the stations by 1.7 mm in total relative to the conventional values | [Petit and Luzum 2010](literatur:petit-2010); [Krásná et al. 2013](literatur:krasna-2013) |
| Moon | 0.02416 ± 0.00022 (period 1 month) | 0.0387 ± 0.0025 | GRAIL, mean of two analyses; LOLA laser altimetry | [Williams et al. 2014](literatur:williams-2014); [Thor et al. 2021](literatur:thor-2021) |
| Mars | 0.169 ± 0.006 | – | tracking of Mars Odyssey, MRO and MGS | [Konopliv et al. 2020](literatur:konopliv-2020) |
| Titan | 0.608 ± 0.048 (real part, 1σ) | – | Doppler from ten Cassini flybys, reanalysed | [Petricca et al. 2025](literatur:petricca-2025) |

Apart from the Earth, both numbers were available until 2020 only for the Moon, and there the
methods scatter: laser ranging gave $h_2$ between 0.0410 and 0.0476 depending on the analysis, the
crossover points of the LOLA tracks $0.0371 \pm 0.0033$, and an interior model matching the GRAIL
value of $k_2$ gave 0.0424 ([Thor et al. 2021](literatur:thor-2021)). For Titan, Cassini first
measured $0.589 \pm 0.150$ and $0.637 \pm 0.224$ (2σ), a deformation consistent with a global
ocean ([Iess et al. 2012](literatur:iess-2012)). An independent analysis of the Cassini data found
only $0.375 \pm 0.06$ ([Goossens et al. 2024](literatur:goossens-2024)); four earlier analyses lay
between 0.59 and 0.64 ([Durante et al. 2026](literatur:durante-2026)), and the most recent one
confirms the high value ([Petricca et al. 2025](literatur:petricca-2025)).

## Phase lag, quality factor Q and k₂/Q

Friction in the interior makes the response lag behind the forcing. The quality factor $Q$ is the
ratio of the peak energy of the deformation to the energy lost per radian of the oscillation. With
the phase lag $\varepsilon$ and the geometric angle $\delta$ between the tidal bulge and the
perturbing body ([Efroimsky and Lainey 2007](literatur:efroimsky-2007)),

$$Q^{-1} = \tan\varepsilon = \tan 2\delta, \quad \mathrm{Im}(k_2) = -\frac{|k_2|}{Q}$$

Overlooking the factor of 2 yields a $Q$ twice as large
([Efroimsky and Lainey 2007](literatur:efroimsky-2007)). The second relation is the common
definition for the complex Love number; astrometric measurements long determined only $|k_2|/Q$,
not the real part ([Park et al. 2025](literatur:park-2025)):

| Body | Quantity | Value | Period or reference | Reference |
|---|---|---|---|---|
| Earth, solid Earth | phase lag; $Q$ | 0.16° ± 0.09°; 370 | principal lunar tide, 12.4 h | [Ray et al. 1996](literatur:ray-1996) |
| Moon | $Q$ | 38 ± 4; 41 ± 9; ≥ 74; ≥ 58 | 1 month; 1; 3; 6 years | [Williams and Boggs 2015](literatur:williams-2015) |
| Mars | $k_2/Q$ | (1.816 ± 0.084) · 10⁻³ | tide raised by Phobos | [Brozović et al. 2025](literatur:brozovic-2025) |
| Io | $k_2/Q$ | 0.015 ± 0.003 | astrometry | [Lainey et al. 2009](literatur:lainey-2009) |
| Io | real part of $k_2$; $Q$ | 0.125 ± 0.047; 11.4 ± 3.6 (1σ) | Juno, Galileo, astrometry | [Park et al. 2025](literatur:park-2025) |
| Titan | imaginary part of $k_2$; $Q$ | 0.135 ± 0.035; 4.5 ± 1.1 | Cassini Doppler | [Petricca et al. 2025](literatur:petricca-2025) |
| Jupiter | $k_2/Q$ | (1.102 ± 0.203) · 10⁻⁵ | Galilean moons, constant $Q$ | [Lainey et al. 2009](literatur:lainey-2009) |
| Saturn | $k_2$; $Q$ | 0.382 ± 0.017; 75 (+176/−31), both 3σ | Titan's frequency | [Magnanini et al. 2026](literatur:magnanini-2026) |

Dissipation in the solid Earth is hard to measure because the oceans consume far more energy;
earlier estimates of the semidiurnal $Q$ ranged from 90 to 500
([Ray et al. 1996](literatur:ray-1996)). With the GRAIL value the Moon has
$k_2/Q \approx 6.4 \cdot 10^{-4}$ at one month, and with $k_2 = 0.169$ Mars has a $Q$ of about 93.

$Q$ depends on the frequency $\chi$, and every tidal model fixes this dependence: a constant
geometric angle (Gerstenkorn, MacDonald, Kaula) implies a frequency-independent $Q$, a constant
time lag (Singer, Mignard) $Q \propto \chi^{-1}$. Rock, by contrast, shows
$Q \propto \chi^{\alpha}$ with $\alpha = 0.2$ to $0.4$ between $10^{7}\,\mathrm{Hz}$ and one cycle
per year (0.2 for partial melts), and roughly $Q \propto \chi$ at periods from one to a hundred
years ([Efroimsky and Lainey 2007](literatur:efroimsky-2007)). For the Moon, $Q$ increases from one
month to three years; models with an absorption band around 120 days fit this
([Williams and Boggs 2015](literatur:williams-2015)). In giant planets, besides the equilibrium
tide, the dynamical tide also dissipates, that is, excited waves and normal modes; close to a
resonance a moon's migration timescale drops by orders of magnitude
([Fuller et al. 2016](literatur:fuller-2016)).

## Orbital evolution

If a planet spins faster than its moons orbit, dissipation transfers angular momentum to the
orbits and the moons migrate outwards. With $k_2$, $Q$ and radius $R$ of the planet, moon mass
$m$, planet mass $M$ and mean motion $n$ of the moon ([Fuller et al. 2016](literatur:fuller-2016),
eqs. 1 and 2),

$$\frac{\dot{a}}{a} = 3\,\frac{k_2}{Q}\,\frac{m}{M}\left( \frac{R}{a} \right)^5 n$$

For constant $Q$, $\dot{a}$ falls off as $a^{-11/2}$; outer moons such as Titan should then hardly
migrate at all ([Lainey et al. 2020](literatur:lainey-2020)).

**Earth and Moon.** Laser ranging to the [Moon](objekt:moon) together with geophysical tide models
yields a decrease of the mean motion by 25.97 ± 0.05″ per century² and
$\dot{a} = 38.30 \pm 0.08\,\mathrm{mm}$ per year. Most of it is caused by dissipation on Earth;
dissipation in the Moon reduces the eccentricity rate. For the Earth's rotation the geophysical
model predicts an increase in the length of day of 2.395 ms per century
([Williams and Boggs 2016](literatur:williams-2016)). Eclipses and occultations since 720 BC show
on average only +1.8 ms per century ([Stephenson et al. 2016](literatur:stephenson-2016)); for
the interpretation see [Earth](objekt:earth).

**Jupiter and Io.** The heat in [Io](objekt:io) comes from orbital energy and accelerates Io in its
orbit, while dissipation in Jupiter decelerates it. Astrometry shows that Io is currently migrating
inwards and that the three inner Galilean moons are evolving out of the exact Laplace resonance;
Jupiter's $k_2/Q$ is close to the upper bound of the average expected from the long-term evolution
([Lainey et al. 2009](literatur:lainey-2009)). The mean motions change relatively by
$+0.14 \pm 0.01$ (Io), $-0.43 \pm 0.10$ (Europa) and $-1.57 \pm 0.27$ (Ganymede) in units of
$10^{-10}$ per year. An analysis including Juno data confirms the dissipation values; both,
however, describe Jupiter's tides with a single parameter for all frequencies
([Lainey et al. 2025](literatur:lainey-2025)), Lainey et al. with a constant $Q$, Park et al. with
a constant time lag ([Park et al. 2025](literatur:park-2025)).

**Saturn and Titan.** As early as 2012, astrometry gave $k_2/Q = (2.3 \pm 0.7) \cdot 10^{-4}$
for Saturn, about ten times more than usual theoretical estimates
([Lainey et al. 2025](literatur:lainey-2025)). For [Titan](objekt:titan), two independent
measurements with Cassini found migration on a timescale of roughly ten billion years, about
12 cm per year, corresponding to $Q \simeq 100$, more than a hundred times smaller than most
expectations. The authors interpret this as resonance locking with inertial waves inside the
planet ([Lainey et al. 2020](literatur:lainey-2020)): an oscillation of the planet whose frequency
shifts as its interior evolves stays in resonance with the moon and drives it outwards on a
timescale comparable to the age of the Solar System, nearly independent of distance
([Fuller et al. 2016](literatur:fuller-2016)).

**Mars and Phobos.** [Phobos](objekt:phobos) orbits inside the synchronous orbit and migrates
inwards. The MAR099 ephemeris gives $k_2/Q = (1.816 \pm 0.084) \cdot 10^{-3}$ for Mars and half
the tidal acceleration of Phobos $\dot{n}/2 = (1.258 \pm 0.058) \cdot 10^{-3}$ degrees per year²
([Brozović et al. 2025](literatur:brozovic-2025)); since $\dot{a}/a = -2\dot{n}/(3n)$, the orbit
shrinks by about 3.8 cm per year. The time until impact is about 29 million years for a constant
time lag, 38 for a constant $Q$ and 40 to 43 for $Q \propto \chi^{\alpha}$
([Efroimsky and Lainey 2007](literatur:efroimsky-2007)).

## Tidal heating

When a synchronously rotating moon follows an eccentric orbit, its tidal bulge changes during each
orbit and friction releases heat. If equator and orbit are coplanar
([Tidal heating](quelle:wikipedia-en-tidal-heating)),

$$\dot{E} = -\mathrm{Im}(k_2)\,\frac{21}{2}\,\frac{G M^2 R^5\, n\, e^2}{a^6} = \frac{21}{2}\,\frac{k_2}{Q}\,\frac{(n R)^5\, e^2}{G}$$

with $k_2$, $Q$ and radius $R$ of the moon and planet mass $M$; the second form follows from
$n^2 a^3 = G M$. The energy comes from the orbit, which would thereby become circular; orbital
resonances maintain the eccentricity, for Io with Europa and Ganymede, for
[Enceladus](objekt:enceladus) with Dione ([Tidal heating](quelle:wikipedia-en-tidal-heating)).

In 1979 Peale, Cassen and Reynolds concluded that tidal dissipation had probably melted a large
fraction of Io and expected visible consequences in the Voyager 1 images
([Peale et al. 1979](literatur:peale-1979)). The measured dissipation agrees with the observed heat
flow, so Io is close to thermal equilibrium ([Lainey et al. 2009](literatur:lainey-2009)). With
$k_2/Q = 0.015 \pm 0.003$ and $e = 0.004$ the formula gives 89 TW, 71 to 107 TW within the
uncertainty; about $10^{5}$ GW, that is 100 TW, are observed
([Fuller et al. 2016](literatur:fuller-2016)). The small real part of $k_2$ from the Juno flybys
fits a mostly solid mantle. A magma ocean beneath a 50 km thick layer would have raised it to at
least 0.8; what is excluded is a shallow global magma ocean, not one deeper than 318 km
([Park et al. 2025](literatur:park-2025)).

Enceladus loses 4 to 19 GW through its south polar region, depending on assumptions. At the north
pole, Cassini measurements in winter and summer additionally show a heat flow of
$46 \pm 4\,\mathrm{mW}\,\mathrm{m}^{-2}$; in total the loss should not exceed 54 GW, compared with
estimated equilibrium tidal heating of 50 to 55 GW whose uncertainty exceeds 100 %
([Miles et al. 2025](literatur:miles-2025)).

## Tidal locking

The same friction brakes a moon's spin until it matches the orbit. Applying the migration formula
to the bulge on the moon and dividing its angular momentum $C\,\omega_0$ by the torque gives as a
rough timescale

$$t \approx \frac{2}{3}\,\frac{Q}{k_2}\,\frac{C\,\omega_0\, a^6}{G M^2 R^5}$$

with $k_2$, $Q$, radius $R$ and moment of inertia $C$ of the moon, initial angular velocity
$\omega_0$ and planet mass $M$; the torque is assumed constant. Because of the sixth power of the
distance, despinning acts above all on close moons. Most major moons rotate synchronously, and the
Moon needs a permanent quadrupole moment to remain so
([Murray and Dermott 2000](literatur:murray-2000), chapter 5). The spin axis ends in a Cassini
state, in state 1 for most synchronously despun moons and in state 2 for the Moon, for which
state 1 does not exist ([Gladman et al. 1996](literatur:gladman-1996)). Not every despinning ends
at 1:1: [Mercury](objekt:mercury) rotates three times in two orbits. According to Correia and
Laskar, chaotic orbital evolution can drive its eccentricity above 0.325, which strongly favours
capture; in 1000 computed evolutions over 4 billion years, 55.4 % ended in the 3:2 resonance
([Correia and Laskar 2004](literatur:correia-2004)). Overview:
[Tidal locking](thema:gebundene-rotation).

## Roche limit

If only its own gravity holds a satellite together, tides tear it apart below a minimum distance.
For a rigid spherical satellite of radius $r$ and mass $m$, a test mass at the point nearest the
planet begins to float when $2 G M r/d^3$ reaches the self-attraction $G m/r^2$; with radius $R$
and density $\rho_M$ of the planet and density $\rho_m$ of the satellite
([Roche limit, German Wikipedia](quelle:wikipedia-de-roche-grenze)),

$$d = R\,\sqrt[3]{\frac{2\,\rho_M}{\rho_m}} \approx 1.26\,R\,\sqrt[3]{\frac{\rho_M}{\rho_m}}$$

A fluid satellite elongates towards the planet and so increases the tidal force; its limit lies
about twice as far out:

$$d \approx 2.42\,R\,\sqrt[3]{\frac{\rho_M}{\rho_m}}$$

Roche himself gave the factor 2.44
([Roche limit, German Wikipedia](quelle:wikipedia-de-roche-grenze)). Real bodies lie between the
two cases, and a body held together by material strength can also orbit inside the limit
([Roche limit](quelle:wikipedia-en-roche-limit)). Because $R\,\rho_M^{1/3}$ depends only on the
planet's mass, apart from that mass only the satellite's density matters.

Almost all planetary rings lie within their Roche limit; exceptions include Saturn's E ring and the
ring of the trans-Neptunian object Quaoar at about 7.4 body radii
([Roche limit](quelle:wikipedia-en-roche-limit)). For compact ice of
$900\,\mathrm{kg}\,\mathrm{m}^{-3}$, Saturn's fluid limit lies at about 129,000 km, inside the outer
edge of the A ring at 136,780 km. The small moons in the ring region, however, have only 0.4 to
$0.6\,\mathrm{g}\,\mathrm{cm}^{-3}$, about the critical density at which a body completely fills
its Roche lobe, and the ring particles themselves are likely to have similarly low densities
([Porco et al. 2007](literatur:porco-2007)). For 400 to $600\,\mathrm{kg}\,\mathrm{m}^{-3}$ the
limit moves out to 148,000 to 169,000 km, beyond the main rings; see [Rings](thema:ringe).

Phobos has a mean density of about $1850\,\mathrm{kg}\,\mathrm{m}^{-3}$; its orbit lies at 89 % of
the fluid and 171 % of the rigid limit. It probably consists largely of weak, heavily damaged
material that is expected to disperse within 20 to 40 million years into a ring lasting $10^{6}$ to
$10^{8}$ years; strong fragments will strike Mars obliquely and slowly
([Black and Mittal 2015](literatur:black-2015)).

## Open questions

- **Resonance locking or constant Q:** With a constant $Q$, the measured migration of Saturn's moons
  is compatible only if the moons formed billions of years after Saturn; resonance locking allows
  coeval formation ([Fuller et al. 2016](literatur:fuller-2016)). An analysis combining Cassini
  radio data with more than a century of astrometry confirms Titan's fast migration with $Q = 75$
  (+176/−31, 3σ) ([Magnanini et al. 2026](literatur:magnanini-2026)). A comprehensive analysis of
  astrometry and radio data from Cassini, Voyager and Pioneer 11, by contrast, gave
  $Q = 1224 \pm 357$ (3σ) ([Jacobson 2022](literatur:jacobson-2022); value as given by
  [Magnanini et al. 2026](literatur:magnanini-2026)). A review shortly before the new analysis
  called the cause of the discrepancy unresolved ([Lainey et al. 2025](literatur:lainey-2025)).
- **Jupiter's Q:** The determinations describe Jupiter's dissipation with a single parameter for all
  frequencies, although models with a solid core and a fluid envelope predict strongly
  frequency-dependent dissipation; the error bars on $k_2/Q$ may therefore be too small. Juno's
  $k_2$ of $0.565 \pm 0.018$ lies below the static model value of 0.590 for Io, which may point to a
  dynamical response but is also compatible with satellite-dependent static Love numbers
  ([Lainey et al. 2025](literatur:lainey-2025)).
- **Titan's interior:** An imaginary part of $k_2$ three to four times larger than possible with an
  ocean argues against a global ocean and for a dissipative high-pressure ice layer close to its
  melting point ([Petricca et al. 2025](literatur:petricca-2025)). The large real part, on the other
  hand, was taken as evidence of an ocean ([Iess et al. 2012](literatur:iess-2012)), and with the
  smaller value of Goossens et al. a lower-density ocean would be more likely
  ([Goossens et al. 2024](literatur:goossens-2024)). The Dragonfly mission is to test the question
  again ([Petricca et al. 2025](literatur:petricca-2025)).
- **The Moon's h₂:** Laser altimetry gives about 10 % less than an interior model fitted to $k_2$,
  laser ranging rather more; possible causes include retroreflectors only on the near side and
  their thermal expansion ([Thor et al. 2021](literatur:thor-2021)).
- **Heat budget of Enceladus:** Whether heat loss and tidal heating are in balance today depends on
  estimates with more than 100 % uncertainty ([Miles et al. 2025](literatur:miles-2025)).

## In the model

- **No tidal forces:** Orrery moves all bodies with orbital elements and linear rates
  ([Orbital elements](thema:bahnelemente)). For all 21 moons, semi-major axis and eccentricity are
  fixed. The Moon stays at 384,467 km; the measured 38.30 mm per year would amount to only 9.6 m
  over the table window 1800 to 2050. The tidal term in the Moon's longitude, about 13″ after one
  century, is missing as well.
- **Phobos:** The orbit stays at 9375 km; orbital decay is missing. The quadratic term in longitude,
  $(\dot{n}/2)\,t^2$ with $t$ in years since J2000, would already amount to 0.9° relative to the
  linear propagation on 17 September 2026 and to 12.6° after a hundred years. The measured physical
  libration of 1.14° is missing too ([Brozović et al. 2025](literatur:brozovic-2025)).
- **Tidal locking:** It resides solely in the rotation periods of the data sets. For all 21 moons
  the rotation period equals the orbital period $360^\circ/\dot{L}$ to within 0.0001 % at most
  (Deimos); the direction to the planet therefore drifts on the map by at most 6.9° per century,
  for all other moons by less than 1.3°. [Pluto](objekt:pluto) and [Charon](objekt:charon) both
  rotate in 153.29335 hours, Charon's orbital period, and permanently show each other the same
  side. Because the rotation is uniform and the orbit eccentric, the direction to the planet swings
  in longitude by about $\pm 2e$, as in optical libration: over 12.6° for the Moon, over 6.6° for
  Titan.
- **Which side faces the planet:** The rotation phase at epoch is zero for all bodies rather than
  set from the IAU model. On the lunar map the direction to the Earth therefore lies between 30.5°
  and 43.5° east longitude from 1800 to 2050, 37° on average (see
  [Reference systems](thema:bezugssysteme)).
- **Mercury:** The rotation period of 58.65 days is not exactly two thirds of the orbital period
  (58.646 days); the rotation falls behind the 3:2 coupling by 14.6° per century.
- **Shape and heat:** All bodies are rigid spheres without tidal bulges, Phobos included, even
  though it lies inside its fluid Roche limit; tidal heating, volcanism on Io and the plumes of
  Enceladus are missing. Saturn's rings are a flat disc from 74,658 to 136,780 km without individual
  particles. Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
