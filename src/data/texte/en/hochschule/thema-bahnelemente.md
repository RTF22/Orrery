# Orbital elements

Orbital elements are coordinates on the solution space of the two-body problem: six numbers
replace position and velocity. Because no body in the Solar System follows an exact Keplerian
orbit, the same name denotes, depending on the source, a snapshot, an average or a parameter
set fitted over a time window. Orrery moves every body exclusively through such elements; this
text sets out what they achieve and where they stop being valid.

## Two-body problem and integrals of motion

For the relative vector $\vec{r}$ of two point masses,

$$\ddot{\vec{r}} = -\frac{\mu\,\vec{r}}{r^3}, \quad \mu = G\,(M + m)$$

The specific energy, the specific angular momentum and the eccentricity vector are conserved;
up to the factor $\mu$, the latter is the Laplace–Runge–Lenz vector
([Tremaine et al. 2009](literatur:tremaine-2009), there for a test particle):

$$\varepsilon = \frac{v^2}{2} - \frac{\mu}{r} = -\frac{\mu}{2a}, \quad \vec{h} = \vec{r} \times \dot{\vec{r}}, \quad \vec{e} = \frac{\dot{\vec{r}} \times \vec{h}}{\mu} - \frac{\vec{r}}{r}$$

The seven components are linked by $\vec{e} \cdot \vec{h} = 0$ and
$e^2 = 1 + 2\varepsilon h^2/\mu^2$; five independent integrals fix size, shape and spatial
orientation of the conic, and the sixth element fixes the position on it. The area integral
with $h^2 = \mu a\,(1 - e^2)$ and the ellipse area $\pi a^2 \sqrt{1 - e^2}$ yield Kepler's
third law:

$$T^2 = \frac{4\pi^2 a^3}{G\,(M_\odot + m)}$$

What dynamics determines is the product $GM$, not $G$ and $M$ separately: the uncertainty of
$G$ is five orders of magnitude larger than that of the solar mass parameter, whose nominal
value under IAU Resolution B3 (2015) is $1.3271244 \cdot 10^{20}\,\mathrm{m}^3\,\mathrm{s}^{-2}$
([Prša et al. 2016](literatur:prsa-2016)).

## Classical elements and the JPL set

Classically, the semi-major axis $a$ and eccentricity $e$ describe the shape of the orbit, the
inclination $I$ and longitude of the ascending node $\Omega$ its plane relative to a reference
plane, the argument of pericentre $\omega$ the line of apsides within the orbital plane, and
the mean anomaly $M = n\,(t - \tau)$ with $n = 2\pi/T$ the position. JPL's approximate
element tables for the planets use the longitude of perihelion $\varpi$ and the mean longitude
$L$ instead and convert back with $\omega = \varpi - \Omega$ and $M = L - \varpi$
([JPL Approximate Positions](quelle:jpl-approx-pos)). The reason becomes clear where individual
angles lose their meaning:

| Element | measured from … to | undefined for |
|---|---|---|
| $\Omega$ | reference direction to node, in the reference plane | $I \to 0$, $I \to 180^\circ$ |
| $\omega$ | node to pericentre, in the orbital plane | $I \to 0$, $I \to 180^\circ$, $e \to 0$ |
| $\varpi = \Omega + \omega$ | sum across both planes | $e \to 0$, $I \to 180^\circ$ |
| $M$ | pericentre to body, uniform in time | $e \to 0$ |
| $L = \varpi + M$ | sum across both planes, uniform in time | $I \to 180^\circ$ |

For the planets' low-inclination orbits, $L$ therefore always remains defined, and so does
$\varpi$ as long as $e$ does not become too small.

## Kepler's equation

The position at a given time follows from the eccentric anomaly $E$ via the transcendental
equation

$$M = E - e \sin E$$

The usual method is Newton's iteration

$$E_{k+1} = E_k - \frac{E_k - e \sin E_k - M}{1 - e \cos E_k}$$

It converges locally quadratically. For common
starters, regions in $(e, M)$ with guaranteed convergence and an a priori error bound can be
proven, and convergence becomes ever faster as $e \to 0$
([Elipe et al. 2017](literatur:elipe-2017)). The critical case is $e \to 1$ at small absolute
$M$, where the derivative $1 - e \cos E$ approaches zero. With the starter $E_0 = M$, the
iteration behaves chaotically at very high eccentricity and can temporarily oscillate between
two incorrect values; with $E_0 = \pi$ it always converges rapidly for $0 \le M \le \pi$
([Charles and Tatum 1997](literatur:charles-1997)), and correspondingly with $E_0 = -\pi$ for
negative $M$. JPL's recipe reduces $M$ to ±180°, starts
from $E_0 = M + e \sin M$ and considers a tolerance of $10^{-6}$ degrees sufficient
([JPL Approximate Positions](quelle:jpl-approx-pos)). From $E$ follow the coordinates in the
orbital plane, with $\xi$ pointing to pericentre:

$$\xi = a\,(\cos E - e), \quad \eta = a\,\sqrt{1 - e^2}\,\sin E$$

## Transformation to ecliptic coordinates

Three rotations, in turn by $\omega$ about the orbit normal, by $I$ about the line of nodes and
by $\Omega$ about the pole of the reference plane, carry the vector into the ecliptic
([JPL Approximate Positions](quelle:jpl-approx-pos)):

$$\vec{r} = R_z(-\Omega)\,R_x(-I)\,R_z(-\omega)\,\vec{\rho}, \quad \vec{\rho} = (\xi, \eta, 0)$$

The third component is $z = r \sin I \sin(\omega + \nu)$ with the true anomaly $\nu$; for a
given inclination, the ecliptic latitude depends only on the argument of latitude
$\omega + \nu$.

## Reference frame and time scale

The tables refer to the mean ecliptic and [equinox of J2000](thema:bezugssysteme). Today this plane is a convention:
JPL Horizons produces it by rotating the ICRF about its x-axis by the fixed value
84,381.448″ (IAU 1976/1980), and points out that a mean orbital plane is ambiguous at high
precision because of the mutual motion of the Earth and Moon; there, the DE440/DE441
ephemerides are taken to be aligned with ICRF3 to within 0.0002″
([JPL Horizons](quelle:jpl-horizons)). The IAU working group on precession and the ecliptic
recommended defining the ecliptic pole explicitly by the mean orbital angular momentum of the
Earth–Moon barycentre in the BCRS ([Hilton et al. 2006](literatur:hilton-2006)).

Time is counted from J2000.0 in Julian centuries of the TDB time scale
([JPL Approximate Positions](quelle:jpl-approx-pos)):

$$T = \frac{\mathrm{JD}_\mathrm{TDB} - 2451545.0}{36525}, \quad \varpi = \varpi_0 + \dot{\varpi}\,T$$

TT and TDB differ periodically by at most 2 ms. TDB − UTC was 64.18 s on 1 January 2000 at
12:00 UTC and 69.18 s on 17 September 2026 ([JPL Horizons](quelle:jpl-horizons)).

The [Earth](objekt:earth), represented in the tables by the Earth–Moon barycentre, shows one
consequence of the fixed frame: its orbital plane moves relative to the J2000 ecliptic. The
table for 1800 to 2050 holds the node, undefined at $I \approx 0$, fixed at $\Omega = 0$ and
lets $I$ pass through zero into negative values at the end of 1999, at −0.0129° per century; a
negative inclination is equivalent to a positive one at $\Omega + 180^\circ$. The table for
3000 BC to 3000 AD instead sets $\Omega = -5.11^\circ$
([JPL Approximate Positions](quelle:jpl-approx-pos)).

## Osculating, mean and fitted elements

Osculating elements describe the Keplerian orbit that matches position and velocity exactly at
one instant; they depend on the chosen centre and on $\mu$. For the Pluto system barycentre,
Horizons (DE441) gives the following for 2000 to 2030 in yearly steps
([JPL Horizons](quelle:jpl-horizons)):

| Quantity | heliocentric | barycentric |
|---|---:|---:|
| $a$ in au | 39.230 to 39.860 | 39.487 to 39.489 |
| $e$ | 0.2445 to 0.2544 | 0.24898 to 0.24903 |
| $I$ in degrees | 17.098 to 17.176 | 17.1406 to 17.1408 |

The heliocentric values oscillate with Jupiter's orbital period (largest $a$ in 2008 and 2020)
because the Sun itself moves around the barycentre of the system; referred to the barycentre,
Pluto's orbit is almost a fixed ellipse over thirty years.

Mean elements result from averaging out the short-period parts of the perturbations. The
problem of three or more bodies is not integrable, but the secular terms of the disturbing
function alone yield an analytical approximation for planets and satellites alike
([Murray and Dermott 2000](literatur:murray-2000), chapter 7). Laplace and Lagrange showed that,
to first order in the masses, eccentricities and inclinations, the planets move
quasi-periodically. A secular theory to second order in the masses and fifth order in
eccentricity and inclination, integrated over 200 million years, is chaotic instead, with a
largest Lyapunov exponent of about 1/(5 million years); the orbits of the inner planets are
unpredictable over a few tens of millions of years ([Laskar 1989](literatur:laskar-1989)).

The elements of JPL's approximate tables are neither osculating nor mean elements in the sense
of perturbation theory: according to JPL, they are fitted to a time window, do not represent
any mean and are not valid outside the window. How strongly the rates depend on the window and
on the form of the fit is shown by the tables for 1800 to 2050 and for 3000 BC to 3000 AD: for
$\dot{\varpi}$ they give 0.0027° and 0.0568° per century for Venus ($e = 0.0068$), and even
−0.419° and +0.542° for Saturn ($e = 0.054$). The nominal errors for 1800 to 2050 in
heliocentric longitude are 15″ for Mercury, 400″ for Jupiter and 600″ for Saturn; for 3000 BC to
3000 AD, the mean anomaly of Jupiter to Neptune additionally needs
$b T^2 + c \cos(f T) + s \sin(f T)$ ([JPL Approximate Positions](quelle:jpl-approx-pos)). A
linear rate per century therefore combines secular drift with the part of long-period terms
that acts within the window, and fitted $a$ and $\dot{L}$ need not satisfy Kepler's third law
exactly. JPL's mean satellite elements are fitted as well: they are the elements of a
precessing ellipse, fitted in a least-squares sense to the numerically integrated orbit, and
explicitly not intended for ephemeris computation
([Planetary Satellite Mean Elements](quelle:jpl-satelliten-bahnen)). Accurate positions come
from numerically integrated ephemerides fitted to observations, such as DE440 for the years
1550 to 2650 and DE441 for −13,200 to +17,191 ([Park et al. 2021](literatur:park-2021)).

## Singularities and equinoctial elements

As $e \to 0$ the pericentre loses its direction, as $I \to 0$ the node does, and at
$I \to 180^\circ$ only $\Omega - \omega$ is defined. Equinoctial elements replace the affected
angles with

$$h = e \sin\varpi, \quad k = e \cos\varpi, \quad p = \tan\frac{I}{2}\,\sin\Omega, \quad q = \tan\frac{I}{2}\,\cos\Omega$$

together with $a$ and the mean longitude at epoch. The associated matrices, including the
partial derivatives of position and velocity with respect to the elements, are free of
singularities for $e = 0$ and for inclinations of 0° and 90°
([Broucke and Cefola 1972](literatur:broucke-1972)). Retrograde equatorial orbits and
rectilinear motion remain singular; a variant moves the singularity to $I = 0$
([Baù et al. 2021](literatur:bau-2021)).

All three cases occur in Orrery's data sets. In JPL's table, [Io](objekt:io) has
$I = 0.0^\circ$ without a node precession period, and [Deimos](objekt:deimos) has
$e = 0.000$ without an apsidal period
([Planetary Satellite Mean Elements](quelle:jpl-satelliten-bahnen)); there the data set sets
the node rate and the apsidal rate, respectively, to zero. The major moons of Uranus orbit with
inclinations between 175.6° and 180.0° relative to Uranus' IAU north pole. In Horizons, the
osculating node of Ariel, on average 0.02° from 180°, moves so irregularly from 1986 to 2026
that it deviates from the fitted straight line by 40° root mean square; for Titania it reverses
after 25 years. Umbriel and Oberon, by contrast, show uniform node rates of 3.7° and 0.7° per
year, whereas the node periods in JPL's table give 2.8° and 1.9° per year
([JPL Horizons](quelle:jpl-horizons)). The data set keeps the nodes of all five moons of Uranus
fixed.

## Satellites and the Laplace plane

Most satellites are governed chiefly by the equatorial bulge of their planet and the tidal
field of the Sun. The classical Laplace surface, on which the secular evolution of circular
orbits vanishes, coincides with the planet's equator close to the planet and with its orbital
plane far out; the transition lies near the Laplace radius
([Tremaine et al. 2009](literatur:tremaine-2009)):

$$r_\mathrm{L}^5 = J_2\,R_\mathrm{p}^2\,a_\mathrm{p}^3\,(1 - e_\mathrm{p}^2)^{3/2}\,\frac{M_\mathrm{p}}{M_\odot}$$

Here $J_2$ includes the contribution of inner satellites. JPL defines the Laplace plane as the
plane in which a satellite's nodal precession is contained on average; for typical satellites
it lies between the planet's equatorial and orbital planes
([Planetary Satellite Mean Elements](quelle:jpl-satelliten-bahnen)). For Saturn,
$r_\mathrm{L} = 48.4\,R_\mathrm{p}$, and [Iapetus](objekt:iapetus) orbits at
$59\,R_\mathrm{p}$ ([Tremaine et al. 2009](literatur:tremaine-2009)). Its Laplace plane is
tilted by 14.8° to Saturn's equator, its orbit by 7.6° to that plane, with a node precession
period of 3130 years. JPL lists the Earth's Moon with elements relative to the ecliptic:
$I = 5.16^\circ$, node period 18.6 years
([Planetary Satellite Mean Elements](quelle:jpl-satelliten-bahnen)).

## In the model

- **Planets:** Table 1 of JPL's approximate elements (1800 to 2050) relative to the J2000
  ecliptic with linear rates, for the Earth the Earth–Moon barycentre. Outside the window the
  data block shows a warning.
- **Dwarf planets:** osculating heliocentric elements from the JPL Small-Body Database at their
  own epoch, all rates except $\dot{L}$ zero. For [Pluto](objekt:pluto) (JD 2457588.5,
  19 July 2016) they agree with the heliocentric osculating orbit of the Pluto system
  barycentre from DE441; relative to DE441, its position deviates by 0.05° in 2000, 0.13° in
  2050, 0.15° in 1900 and 1.4° in 1800. The main cause is the mean motion of the snapshot: it is
  0.44 % below the barycentric one, because $a$ is 0.10 au larger and only the Sun's mass counts
  as central mass; by 1800 this adds up to 1.39°.
- **Earth's Moon:** mean elements relative to the ecliptic: $a$, $e$ and $I = 5.145^\circ$ from
  the NSSDC fact sheet, $\dot{L}$ from the sidereal period (27.3217 days there, computed with
  27.32166 days in the data set); $L$ at epoch as well as $\varpi$ and $\Omega$ with their rates
  after Meeus (Astronomical Algorithms); without periodic terms. Hence $I$ differs from the
  5.16° in JPL's table.
- **Other satellites:** elements relative to the parent body's equator, using its IAU pole at
  epoch J2000; as at JPL, the longitude of the node is counted from the node of this plane on
  the ICRF equator, and the data block shows it that way. The moons of Mars and Jupiter use
  JPL's mean elements and equate the Laplace plane with the equator, although it deviates from
  it by 0.4° for Callisto and 0.9° for Deimos. The moons of Saturn, Uranus, Neptune and Pluto
  use osculating Horizons elements at J2000. For the moons of Saturn, nodes and apsides precess
  at rates from JPL's table (the nodes of Enceladus and Dione are fixed); for the moons of
  Uranus only the apsides precess; Triton and Charon do not precess. For Iapetus the node
  therefore precesses about Saturn's pole instead of the Laplace pole; its inclination to
  Saturn's equator deviates from Horizons by 0.71° in 2050 and 1.11° in 2076.
- **Kepler's equation:** Newton's method from $E_0 = M + e \sin M$, stopping at a step below
  $10^{-12}$ rad, at most 30 steps. Recomputed on 200,001 equally spaced values of $M$, the
  largest eccentricity in the catalogue ([Eris](objekt:eris), 0.438) needs at most 5 steps,
  $e = 0.99$ at most 10. At $e = 0.999$, 943 values with small absolute $M$ do not reach the
  stopping criterion; for 886 of them a residual above $10^{-6}$ rad remains, the iterates
  diverge up to the order of $10^{16}$, and the solver returns the last value unchecked.
- **Orbital period:** the data block computes it with the formula above from $a$ at epoch and
  $G\,(M + m)$ with $G$ from CODATA 2018. For the Sun this product exceeds the nominal mass
  parameter by $4.5 \cdot 10^{-5}$, so the planets' periods come out 0.002 % too short. The
  bodies, however, move with $\dot{L}$. For Uranus and Neptune the Keplerian period is 0.05 %
  and 0.06 % longer than $360^\circ/\dot{L}$; counting the masses of the planets orbiting
  further in, above all Jupiter and Saturn, as central mass, which approximately holds for orbits this far out,
  leaves −0.016 % and −0.006 %. For the Earth's Moon it is 0.11 % shorter.
- **Time:** the clock counts Julian days in UTC and uses them as TDB without conversion.
  According to Horizons, the offset TDB − UT is 18.6 s for 1800, −1.9 s for 1900 and 69.2 s
  today ([JPL Horizons](quelle:jpl-horizons)); today it shifts Mercury by 8″ to 18″ in
  heliocentric longitude, of the same order as the nominal error of the table. Further
  simplifications: [limits of the model](thema:modell).

*As of September 2026*
