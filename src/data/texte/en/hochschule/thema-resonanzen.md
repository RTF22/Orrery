# Orbital resonances

Orbital resonances link bodies that orbit the same central body with mean motions in a ratio of small
integers ([Peale 1976](literatur:peale-1976)). When periodic perturbations act again and again at the
same point of the orbit, they either add up or cancel each other; in this way resonances stabilise
orbits such as Pluto's or clear regions such as the Kirkwood gaps
([Orbital resonance, German Wikipedia](quelle:wikipedia-de-bahnresonanz)). This text covers mean-motion
resonances, the Laplace resonance, Neptune and Pluto, secular resonances, capture by migration and the
Saturnian moons, and explains what Orrery shows of them. The coupling of rotation and orbit is covered
in [Tides and the Roche limit](thema:gezeiten).

## Resonant angle

If an inner body (index 1) and an outer body (index 2) orbit the central body close to the period
ratio $P_2/P_1 = p/(p - q)$, the dynamics are described by the resonant angle
([Tamayo and Hadden 2025](literatur:tamayo-2025), Eqs. 3 and 4)

$$\varphi = p\,\lambda_2 - (p - q)\,\lambda_1 - q\,\varpi$$

with the mean longitudes $\lambda$ and the longitude of pericentre $\varpi$ of one of the bodies
([Orbital elements](thema:bahnelemente)). The integer $q$ is the order of the resonance. The
coefficients sum to zero, because a rotation of the coordinate system must not change $\varphi$; instead
of $\varpi$, the longitude of pericentre of the other body or pairs of node longitudes $\Omega$ may
appear. At a conjunction, $\lambda_1 = \lambda_2$, one has $\varphi/q = \lambda_1 - \varpi$: if
$\varphi$ stays fixed, conjunctions always occur at the same place relative to the pericentre.
Higher-order resonances are weaker because the effects of the $q$ conjunctions per cycle partly cancel
([Tamayo and Hadden 2025](literatur:tamayo-2025)).

## Libration, circulation and resonance width

Close to exact commensurability, $\varphi$ behaves to first approximation like a pendulum
([Murray and Dermott 2000](literatur:murray-2000), chapter 8):

$$\ddot{\varphi} = -\omega_0^2 \sin(\varphi - \varphi_0), \quad E = \frac{\dot{\varphi}^2}{2} + \omega_0^2\,[1 - \cos(\varphi - \varphi_0)]$$

For $E < 2\omega_0^2$, $\varphi$ oscillates about the centre $\varphi_0$ (libration); for
$E > 2\omega_0^2$ it runs through all values (circulation); the separatrix lies in between. For closely
spaced orbits, Tamayo and Hadden give frequency and width in a form common to all resonances of the same
order ([Tamayo and Hadden 2025](literatur:tamayo-2025), Eqs. 8, 10 and 11):

$$\omega_0 = \frac{q\,A_q\,n}{e_\mathrm{c}} \sqrt{\mu\,\tilde{e}^{q}}, \quad \Delta_\mathrm{max} = 3\,A_q \sqrt{\mu\,\tilde{e}^{q}}, \quad \tilde{e} = \frac{e}{e_\mathrm{c}}, \quad e_\mathrm{c} \approx \frac{2q}{3p}$$

Here $\Delta$ is the fractional deviation of the period ratio from its resonant value, $\mu$ the ratio of
the combined mass of both bodies to the central mass, $e$ the eccentricity (the relative eccentricity
for two massive bodies), $e_\mathrm{c}$ the eccentricity at which the orbits cross, and $A_q$ a factor
of 0.845, 0.754 and 0.748 for orders 1 to 3. The width therefore grows with the square root of mass
and $e^q$. The pendulum model treats $e$ as fixed and fails for nearly circular orbits; there the second
fundamental model of resonance is needed. Where neighbouring resonances overlap, the motion becomes
chaotic ([Tamayo and Hadden 2025](literatur:tamayo-2025), sections 3.2 and 5.6).

Not every oscillating angle means libration in the strict sense. Among the satellite resonances, only
Mimas–Tethys and Titan–Hyperion have a separatrix, and only their angles librate with large amplitudes,
which are regarded as relics of the time of capture. Io–Europa, Europa–Ganymede and Enceladus–Dione lie
too far from exact resonance for that ([Luan and Goldreich 2017](literatur:luan-2017)). Their angles do
oscillate, but in phase space the trajectories circulate around a shifted centre without being enclosed
by a separatrix ([Lari and Saillenfest 2024](literatur:lari-2024)).

## The Laplace resonance of Io, Europa and Ganymede

[Io](objekt:io), [Europa](objekt:europa) and [Ganymede](objekt:ganymede) satisfy, as a time average
([Yoder and Peale 1981](literatur:yoder-1981)),

$$n_1 - 3n_2 + 2n_3 = 0, \quad \varphi_\mathrm{L} = \lambda_1 - 3\lambda_2 + 2\lambda_3 = 180^\circ$$

In addition there are three two-body angles ([Yoder and Peale 1981](literatur:yoder-1981)):

$$\lambda_1 - 2\lambda_2 + \varpi_1 = 0^\circ, \quad \lambda_1 - 2\lambda_2 + \varpi_2 = 180^\circ, \quad \lambda_2 - 2\lambda_3 + \varpi_2 = 0^\circ$$

Accordingly, conjunctions of Io and Europa fall at Io's perijove and Europa's apojove, and conjunctions
of Europa and Ganymede at Europa's perijove. Because $\varphi_\mathrm{L}$ lies at 180°, all three moons
are never in conjunction at once ([Paita et al. 2018](literatur:paita-2018)). The perijoves of Io and
Europa follow the lines of conjunction and regress ([Yoder and Peale 1981](literatur:yoder-1981)):

$$\dot{\varpi}_1 = \dot{\varpi}_2 = -(n_1 - 2n_2) \approx -0.7395^\circ\,\mathrm{d}^{-1}$$

In Brown's (1977) theory the two differences $n_1 - 2n_2$ and $n_2 - 2n_3$ are 0.7395507361° and
0.7395507301° per day ([Paita et al. 2018](literatur:paita-2018)). Io's forced eccentricity of 0.0041
sustains its tidal heating; above $e_1 = 0.012$ the Laplace relation would be unstable
([Yoder and Peale 1981](literatur:yoder-1981)). The E5 ephemeris includes a free libration of
$\varphi_\mathrm{L}$ with an amplitude of 0.064° and a period of 2071 days
([Lieske 1998](literatur:lieske-1998)); a filtered analysis of the SPICE ephemerides over 100 years
found only about 0.02°, at a period slightly above 2000 days ([Paita et al. 2018](literatur:paita-2018)).
How tides change Io's orbit and heat budget today is described in
[Tides and the Roche limit](thema:gezeiten).

## Neptune and Pluto

[Pluto](objekt:pluto) orbits the Sun on average twice while [Neptune](objekt:neptune) orbits it three
times. Pluto's perihelion distance lies inside Neptune's orbit, yet the two never come close. The angle

$$\varphi_\mathrm{P} = 3\lambda_\mathrm{P} - 2\lambda_\mathrm{N} - \varpi_\mathrm{P}$$

librates about 180° with an amplitude of about 76° and a period of about 19,670 years; in an integration
of the five outer planets over 120,000 years, Pluto and Neptune never came closer than 18 AU
([Cohen and Hubbard 1965](literatur:cohen-1965)). An integration over 4.5 million years confirmed the
libration with a mean period of 19,951 years and also found that Pluto's argument of perihelion
$\omega$ librates about 90° with an amplitude of 24° and a period of 3.955 million years; both increase
the minimum distance ([Williams and Benson 1971](literatur:williams-1971)). Because $\varphi_\mathrm{P}$
oscillates about 180°, conjunctions take place around aphelion, and because $\omega$ oscillates about
90°, perihelion lies far from the ecliptic. The longitude of perihelion of resonant objects oscillates
about a point 90° away from Neptune's mean longitude, and for stable orbits the amplitude of
$\varphi_\mathrm{P}$ stays below about 90° ([Malhotra 1995](literatur:malhotra-1995)). Pluto and the
other Plutinos are thus protected from close encounters with Neptune by their phase
([Nesvorný 2018](literatur:nesvorny-2018)).

## Secular resonances and Kirkwood gaps

Secular resonances couple not the orbital motions but the precession of perihelion or node
([Orbital resonance, German Wikipedia](quelle:wikipedia-de-bahnresonanz)). In the asteroid belt,
$\nu_6 = g - g_6$ is particularly important, with the frequency $g$ at which the asteroid's longitude
of perihelion moves and the corresponding frequency $g_6$ of Saturn. Where $\nu_6$ approaches zero, the
eccentricity grows until the asteroids cross the orbit of Mars; the resonance bounds the belt on the
inside at about 2 AU and on the side at inclinations of about 20°
([Orbital resonance](quelle:wikipedia-en-orbital-resonance)). Together with $\nu_{16}$ ($s = s_6$, for
the nodes) it lies at about 2 AU for low inclinations
([Nesvorný 2018](literatur:nesvorny-2018)).

The [Kirkwood gaps](thema:kirkwood-luecken), by contrast, lie at mean-motion resonances with Jupiter,
by Kepler's third law for $P_\mathrm{J}/P = p/(p - q)$ at

$$a = a_\mathrm{J} \left( \frac{p - q}{p} \right)^{2/3}$$

so with Jupiter's semi-major axis of 5.203 AU at 2.50, 2.82, 2.96 and 3.28 AU for 3:1, 5:2, 7:3
and 2:1.
These resonances amplify the variations of the eccentricity ([Nesvorný 2018](literatur:nesvorny-2018)).
Wisdom showed for 3:1 why they produce gaps: test asteroids there move with $e < 0.1$ for up to a
million years and then jump to $e > 0.3$, where they can cross the orbit of Mars. The motion is
chaotic, and the outer boundary of the chaotic zone coincides with the boundary of the observed gap
within the errors of the orbital elements ([Wisdom 1983](literatur:wisdom-1983)). Bodies that enter
resonances of the main belt typically survive there for only a few million years; most are driven into
the Sun or onto Jupiter-crossing orbits ([Gladman et al. 1997](literatur:gladman-1997)). Not every
resonance clears its region: the Hilda asteroids reside in the 3:2 resonance
([Nesvorný 2018](literatur:nesvorny-2018)).

## Resonance capture by migration

A pair is captured permanently into resonance when its orbits slowly approach each other. For capture
into 2:1, the rate and form of the migration hardly matter; what matters is that the orbits converge,
as long as the migration is not unreasonably fast ([Peale and Lee 2002](literatur:peale-2002)). The
Mimas–Tethys and Enceladus–Dione resonances also require converging orbits
([Ćuk et al. 2024](literatur:cuk-2024)). For the Galilean moons, Yoder and Peale outlined a tidal path:
Jupiter pushes Io outwards fastest, the first two two-body angles are captured with probability 1, the
third, and with it $\varphi_\mathrm{L}$, with about 0.9, and dissipation in Io damps the amplitudes
([Yoder and Peale 1981](literatur:yoder-1981)).

For Pluto, Malhotra proposed that Neptune migrated outwards through encounters with residual
planetesimals, captured Pluto from a nearly circular orbit into 3:2 and then quickly drove its
eccentricity up to the present Neptune-crossing value ([Malhotra 1993](literatur:malhotra-1993)).
Pluto's orbit thus implies an outward migration of Neptune by at least about 5 AU
([Malhotra 1995](literatur:malhotra-1995)). Models with smooth migration, however, predict resonant
populations that are too large, whereas the classical Kuiper belt contains two to four times as many
objects as the Plutinos; grainy migration caused by encounters of Neptune with massive planetesimals
raises the ratio of non-resonant to resonant objects by up to about a factor of ten compared with smooth
migration ([Nesvorný and Vokrouhlický 2016](literatur:nesvorny-2016)).

## Resonances of the Saturnian moons

Three pairs of large Saturnian moons are in mean-motion resonance ([Peale 1976](literatur:peale-1976)):

| Pair | Periods | Resonant angle | Libration | Reference |
|---|---|---|---|---|
| [Mimas](objekt:mimas)–[Tethys](objekt:tethys) | 1:2 (4:2) | $4\lambda_\mathrm{Te} - 2\lambda_\mathrm{Mi} - \Omega_\mathrm{Mi} - \Omega_\mathrm{Te}$ | about 0°, amplitude 95°, period 70 years | [Ćuk et al. 2024](literatur:cuk-2024) |
| [Enceladus](objekt:enceladus)–[Dione](objekt:dione) | 1:2 | $2\lambda_\mathrm{Di} - \lambda_\mathrm{En} - \varpi_\mathrm{En}$ | amplitude below 1° | [Ćuk et al. 2024](literatur:cuk-2024) |
| [Titan](objekt:titan)–Hyperion | 3:4 | $4\lambda_\mathrm{Hy} - 3\lambda_\mathrm{Ti} - \varpi_\mathrm{Hy}$ | about 180°, amplitude 36.5°, period about 640 days | [Duriez 1992](literatur:duriez-1992) |

Mimas and Tethys are coupled through their inclinations, the other two pairs through eccentricities.
The resonance with Dione maintains the eccentricity of Enceladus and hence its tidal heating, which can
only persist while the orbits keep converging; the resonance with Titan protects Hyperion, with
$e = 0.104$, from close encounters ([Ćuk et al. 2024](literatur:cuk-2024)).

## Open questions

- **Age and origin of the Laplace resonance:** According to Yoder and Peale, tides in Jupiter assembled
  the resonances from initially arbitrary orbits ([Yoder and Peale 1981](literatur:yoder-1981)).
  According to Peale and Lee, the Laplace relation may instead be primordial, produced by migration of
  the young moons in the circumjovian disk ([Peale and Lee 2002](literatur:peale-2002)). A recent
  review considers both the path and the age unresolved; a heating of Ganymede midway through its history
  would point to an earlier, different resonance and against a primordial origin
  ([Nimmo et al. 2026](literatur:nimmo-2026)). Today, according to astrometry, the three moons are
  evolving out of the exact resonance ([Lainey et al. 2009](literatur:lainey-2009)).
- **A genuine three-body resonance:** Yoder and Peale describe three librating two-body angles in
  addition to $\varphi_\mathrm{L}$ ([Yoder and Peale 1981](literatur:yoder-1981)). An analysis of the
  fundamental frequencies, however, finds no separatrix for the pairs Io–Europa and Europa–Ganymede; the
  only genuine resonance today is said to be the three-body one
  ([Lari and Saillenfest 2024](literatur:lari-2024)).
- **Resonant trans-Neptunian objects as evidence of migration:** The structure of the Kuiper belt is
  considered strong support for a planetesimal-driven outward migration of Neptune
  ([Nesvorný 2018](literatur:nesvorny-2018)), and grainy migration matches the observed ratio of resonant
  to non-resonant objects ([Nesvorný and Vokrouhlický 2016](literatur:nesvorny-2016)). The distant
  resonances beyond 2:1, however, are far more populated than any published migration model predicts,
  and the ratios between them largely fit unstable scattering objects that temporarily stick in
  resonances ([Crompvoets et al. 2022](literatur:crompvoets-2022)).

## In the model

- **No mutual perturbations:** Orrery moves all bodies on Keplerian orbits with linearly propagated
  elements ([Orbital elements](thema:bahnelemente)). Resonances appear only insofar as the rates in the
  data sets match the mean motions; libration, capture and chaos are absent.
- **Laplace relation:** From the mean longitudes of the data sets, all taken in the frame of Jupiter's
  equator and at the same time, $\varphi_\mathrm{L}$ comes out at exactly 180.0° at the epoch J2000.
  Because $n_1 - 3n_2 + 2n_3$ is −1.05° per century there, it is 179.72° on 17 September 2026, 181.05° in
  1900 and 178.95° in 2100: after a hundred years roughly sixteen times the E5 amplitude. The deviation
  is within the rounding of the six-digit orbital periods, which for Io alone allows ±2.1° per century.
- **Perijoves of Io and Europa:** At the epoch the three two-body angles are at 0.3°, 180.2° and 0.2°.
  The data sets, however, advance the perijoves with periods of 1.33 and 1.46 years instead of letting
  them regress at $n_1 - 2n_2$; the angles therefore circulate once in 243 and 255 days.
- **Pluto and Neptune:** At the epoch $\varphi_\mathrm{P} = 242.6^\circ$. The period ratio of the data
  sets is 1.5116 instead of 3:2 on average, so $\varphi_\mathrm{P}$ decreases by 3.35° per century and
  circulates in 10,752 years. Today conjunctions still avoid perihelion: in 1892 Pluto was at a mean
  anomaly of 219°, 48.1 AU from the Sun and 19.4 AU from Neptune, and between 1800 and 2050 the two come
  no closer than 19.0 AU. Around 1500 BC and around AD 9200, however, conjunctions fall at perihelion;
  between 4700 BC and AD 20,000 the smallest distance is 2.8 AU (year 9734, shortly after Pluto's
  perihelion). The argument of perihelion is fixed at 113.7°.
- **Saturnian moons:** The Mimas–Tethys angle is at −61.2° at the epoch and drifts by 13.3° per century
  instead of oscillating by 95° over 70 years. Hyperion is not in the catalogue.
- **Asteroid belt:** The point cloud receives Kirkwood gaps as dips in density in semi-major axis at 4:1,
  3:1, 5:2, 7:3 and 2:1, down to 10 % at the centre. Among the 50,000 particles of the highest quality
  level, a strip 0.02 AU wide around 3:1, 5:2 and 7:3 contains only 19, 26 and 34 % as many particles as
  strips of equal width 0.06 to 0.10 AU away on average. Sorted by distance from the Sun on
  17 September 2026, with a mean eccentricity of 0.125, the figures are instead 104, 100 and 106 %: the
  gaps cannot be seen in the view. The particles' elements are fixed, so a secular resonance such as
  $\nu_6$ does not exist.
- **Plutinos:** The Kuiper cloud contains Plutinos with semi-major axes around 39.4 AU, but with random
  angles; for half of the particles around 39.4 AU, $\varphi_\mathrm{P}$ at the epoch is closer to 0°
  than to 180°, so there is no protection from Neptune. Further simplifications:
  [Limits of the model](thema:modell).

*As of September 2026*
