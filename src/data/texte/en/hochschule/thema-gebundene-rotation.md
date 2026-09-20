# Tidal locking

A body is tidally locked when its rotation and its orbit stand in a fixed, integer ratio. The usual
case is 1:1, synchronous rotation, in which a moon always shows the same face to its planet;
[Mercury](objekt:mercury), by contrast, rotates three times while orbiting the Sun twice. Both are
end states of the same evolution: tidal friction removes the body's spin until a torque acting on a
permanent asymmetry holds it fast. This text leads from the tidal torque via capture probabilities,
Cassini states and libration to the measurement techniques, places the special cases Venus,
Hyperion and Pluto–Charon, and finally describes what Orrery reproduces of it (overview also at
[NASA Science](quelle:nasa-gebundene-rotation)).

## Torque and the timescale of despinning

The central body raises a tidal bulge in the satellite. Internal friction makes it lag behind the
forcing when the satellite rotates faster than it orbits; the pull on the displaced bulge then
creates a braking torque ([Tides and the Roche limit](thema:gezeiten)). To leading order, with the
Love number $k_2$, the quality factor $Q$ and the radius $R$ of the rotating body, the mass $M$ of
its partner and the separation $a$, its magnitude is

$$\Gamma = \frac{3}{2}\,\frac{k_2}{Q}\,\frac{G M^2 R^5}{a^6}$$

Dividing the satellite's angular momentum $C\,\omega_0$ by this torque, assumed constant, gives a
rough timescale to tidal locking

$$t \approx \frac{2}{3}\,\frac{Q}{k_2}\,\frac{C\,\omega_0\, a^6}{G M^2 R^5}$$

with the polar moment of inertia $C$ and the initial angular velocity $\omega_0$. The same estimate
is also found with the prefactor $1/3$; such a factor of two arises easily from the conventions for
$Q$, in which the phase lag is twice the geometric angle between the bulge and the line joining the
bodies ([Efroimsky and Lainey 2007](literatur:efroimsky-2007)).

**Worked example.** For the [Moon](objekt:moon), $k_2 = 0.02416 \pm 0.00022$ and
$Q = 37.5 \pm 4$ at a period of one month are known from lunar laser ranging and GRAIL, the mean
moment of inertia of the solid Moon is $0.392728 \pm 0.000012\,M R^2$ and the mean radius
$1737.151\,\mathrm{km}$ ([Williams et al. 2014](literatur:williams-2014)); there $k_2$ refers to a
reference radius of 1738 km, which shifts the result of this estimate by less than 0.3 %. With the
Earth's mass
$M_\oplus$ and an initial rotation period of 10 hours, the formula gives about 43 million years at
today's distance of 60.3 Earth radii; the torque is then
$1.1 \cdot 10^{16}\,\mathrm{N}\,\mathrm{m}$. At 20 Earth radii, an early distance of the Moon, the
sixth power leaves only about 57,000 years. The locking of a close moon is therefore practically
always complete, while distant, small bodies keep their original spin.

## End states: spin-orbit resonances

The braking does not end at an arbitrary point. If the body is not rotationally symmetric, the
central body exerts a torque on the permanent deformation that can lock the spin to a multiple of
the mean motion $n$. Goldreich and Peale averaged the equation of motion over one orbit. Near the
$p$-th resonance, in which the spin is $p\,n$, the angle $\gamma$ between the long axis and the
direction to the central body at pericentre obeys
([Goldreich and Peale 1966](literatur:goldreich-1966), eq. 10)

$$C\,\ddot{\gamma} + \frac{3}{2}(B - A)\,n^2 H(p,e)\,\sin 2\gamma = \bar{T}$$

with the principal moments of inertia $A \le B \le C$, the orbit-averaged tidal torque $\bar{T}$
and a series function $H(p,e)$ that depends only on eccentricity and order. Without the tidal term
this is the equation of a pendulum: the body swings about the resonant orientation. With
$H(1,e) \approx 1$, the frequency of this free libration at 1:1 is

$$\omega_\mathrm{lib} = n\,\sqrt{\frac{3(B - A)}{C}}$$

For the Moon, $(B - A)/C = (227.7317 \pm 0.0042) \cdot 10^{-6}$ is known from the physical
libration ([Williams et al. 2014](literatur:williams-2014)); it follows that
$\omega_\mathrm{lib}/n = 0.0261$, a free libration in longitude of about 1045 days.

What decides capture is the form of the tidal torque. If $\bar{T}$ is constant, the body can never
be captured: it passes through the resonance and keeps slowing down. Only a term depending on the
sign of $\dot{\gamma}$ makes capture possible. For
$\bar{T} = -W - Z\,\mathrm{sign}\,\dot{\gamma}$ with positive constants $W$ and $Z$, the capture
probability is

$$P = \frac{2 Z}{W + Z}$$

and is then independent of $(B - A)/C$; for a MacDonald torque it does depend on it
([Goldreich and Peale 1966](literatur:goldreich-1966), eq. 18 and 20). The same work showed that a
very small $(B - A)/C$ of order $10^{-8}$ already suffices to hold Mercury's rotation at two thirds
of its orbital period; the sufficient criterion given there is
$(B - A)/C > 7.1 \cdot 10^{-8}/(Q\,H(p,e))$. The measured asymmetry of Mercury is far larger:
$(B - A)/C_\mathrm{m} = (2.206 \pm 0.074) \cdot 10^{-4}$ for the librating outer shell and
$C_\mathrm{m}/C = 0.421 \pm 0.021$ ([Stark et al. 2015](literatur:stark-2015)), together
$(B - A)/C = 9.3 \cdot 10^{-5}$, some ten thousand times more than required. That Mercury does not
rotate synchronously at all was shown in 1965 by the first accurate radar observations of its
rotation ([Pettengill and Dyce 1965](literatur:pettengill-1965);
[Stark et al. 2015](literatur:stark-2015), section 1); reading the measured period as exactly
$1.5\,n$ goes back to Colombo, and that a sufficient departure from axial symmetry stabilises that
state was shown by several works immediately afterwards
([Goldreich and Peale 1966](literatur:goldreich-1966), introduction).

How Mercury got there is still a matter of modelling. With a realistic tidal model the probability
of capture into the 3:2 resonance is only about 7 %; capture becomes very likely only once chaotic
orbital evolution drives the eccentricity beyond 0.325 — in 1000 computed histories over 4 billion
years, 55.4 % ended in 3:2 ([Correia and Laskar 2004](literatur:correia-2004)). Adding friction at
the boundary of the liquid core, the spin ends in some resonance in 99.8 % of cases, distributed
over 5:2 (22 %), 2:1 (32 %) and 3:2 (26 %); if the eccentricity fell below 0.025 or 0.005 in the
past, the share of the 3:2 resonance rises to 55 % and 73 % respectively
([Correia and Laskar 2009](literatur:correia-2009)). A calculation with a torque from the
Darwin-Kaula expansion gives a different picture: there 3:2 is the most probable end state after
only a single encounter with the resonance, capture is final, and in most histories it happens
within 10 to 20 million years; even weak laminar friction between mantle and core would instead
lead to 2:1 or higher ([Noyelles et al. 2014](literatur:noyelles-2014)). Spin-orbit resonances are
thus a counterpart to [orbital resonances](thema:resonanzen): in both cases a periodic torque holds
a frequency ratio that would otherwise be passed through slowly.

## Cassini states

Tidal locking fixes not only the spin rate but also the orientation of the spin axis.
The laws named after Cassini describe the motion of the lunar axis: the Moon rotates
synchronously, its equator keeps a constant inclination to the ecliptic, and its equatorial plane
precesses with the orbital plane, so that spin axis, ecliptic normal and orbit normal stay
coplanar ([Williams et al. 2014](literatur:williams-2014), section 6;
[Ward 1975](literatur:ward-1975)). Colombo showed that the second and third laws are
independent of the first and describe a motion of minimum internal energy dissipation
([Colombo 1966](literatur:colombo-1966)). Peale generalised them: all stable, coplanar
configurations of spin vector, orbit normal and precession vector are extremes of the orientation
energy, and such a configuration links the moment differences $(C - A)/C$ and $(B - A)/C$
([Peale 1969](literatur:peale-1969)). Without dissipation at most four such coplanar
configurations are possible; Peale enumerated them and named them Cassini states. Tidal friction
drives the spin axis into one of two of them: state 1 lies close to the orbit normal, state 2 close
to the normal of the invariable plane, and which one is occupied depends mainly on the ratio of
the precession periods of spin axis and orbit ([Ward 1975](literatur:ward-1975)).

Ward applied the generalised laws to several bodies and
found that only the Moon definitely occupies state 2, while most bodies lie in state 1; Iapetus
could occupy either depending on its oblateness, and Mercury's resonant rotation has little effect
on the tidal drift of its spin axis towards state 1
([Ward 1975](literatur:ward-1975)). A systematic study including permanent triaxial
deformation confirmed this: for the parameter ranges of most real satellites that have been despun
to synchronous rotation, state 1 is the only possible endpoint, because the asymmetry destabilises
the higher-obliquity state 2; the Moon is the exception, because state 1 does not exist for it
([Gladman et al. 1996](literatur:gladman-1996)). The lunar equator is therefore tilted by 1.543°
against the ecliptic, opposite to the orbital inclination, and precesses with the node in 18.6
years ([Williams et al. 2014](literatur:williams-2014)).

Cassini states are measurable because the obliquity is small and can be determined precisely.
Mercury's spin axis is tilted by $2.04 \pm 0.08$ arc minutes with respect to the orbit normal, and
the direction of the tilt suggests that the planet is in or near a Cassini state
([Margot et al. 2012](literatur:margot-2012)); the measurement from orbit about Mercury gave
$2.029 \pm 0.085$ arc minutes ([Stark et al. 2015](literatur:stark-2015)). For
[Titan](objekt:titan) the obliquity is $0.32 \pm 0.02^\circ$ and the offset from the Cassini plane
$0.12 \pm 0.02^\circ$, both determined by
[Baland et al. 2011](literatur:baland-2011); from this departure from the expected state follow
values of $k_2/Q$ between 0.058 and 0.12 and a minimum $Q \approx 5$
([Downey and Nimmo 2025](literatur:downey-2025)).

## Optical and physical libration

A tidally locked body does not show exactly the same face at all times. Because it rotates
uniformly but moves non-uniformly along its orbit, as Kepler's second law requires, the direction
to the central body swings in longitude; to first order the amplitude is $2e$, for the Moon 6.29°.
Because the spin axis is tilted against the orbit normal, it also swings in latitude, for the Moon
by about ±6.7°. This optical libration is pure perspective: according to the DE441 ephemeris it
reaches about ±8° in longitude for the Moon between 1990 and 2030, and the reflector arrays on the
lunar surface are thereby tilted by up to 10° away from the line of sight
([Murphy 2013](literatur:murphy-2013)). The
[scene "The dance of the Moon"](szene:mondtanz) shows exactly this non-uniform orbital motion.

Physical libration, by contrast, is a real oscillation of the rotation: the external gravitational
torque on the deformation changes with orbital phase and drives the pendulum of the previous
section. Its amplitude depends on $(B - A)/C$ and on how far the forcing frequency lies from the
free libration frequency; for the Moon it yields the ratios $\beta = (C - A)/B$ and
$\gamma = (B - A)/C$ ([Williams et al. 2014](literatur:williams-2014)). Because it probes the
interior, it is one of the few remote-sensing techniques for the
[internal structure](thema:innerer-aufbau) of small bodies:

- **Mercury.** The forced libration at the period of the 88-day orbit has an amplitude of
  $38.5 \pm 1.6$ arc seconds, corresponding to about 450 m at the equator. Combined with the
  second-degree gravitational harmonics this gives $C/(M R^2) = 0.346 \pm 0.014$ and a fraction of
  the librating shell of $C_\mathrm{m}/C = 0.431 \pm 0.025$: the mantle is decoupled from a core
  that is at least partially molten ([Margot et al. 2007](literatur:margot-2007);
  [Margot et al. 2012](literatur:margot-2012)). The measurement from orbit gives
  $0.421 \pm 0.021$ for the same fraction independently
  ([Stark et al. 2015](literatur:stark-2015)); the two determinations overlap.
- **Mimas.** Librations measured from Cassini images confirm all the amplitudes calculated from
  orbital dynamics except one, which is twice as large as expected under the assumption of
  hydrostatic equilibrium. Either Mimas has a strongly non-hydrostatic interior or a hydrostatic
  one with an ocean beneath a thick icy shell ([Tajeddine et al. 2014](literatur:tajeddine-2014)).
- **Enceladus.** A control point network built up over seven years gives a forced libration of
  $0.120 \pm 0.014^\circ$ (2σ). The value is too large for the core to be rigidly connected to the
  surface, and it requires a global ocean rather than a localised polar sea
  ([Thomas et al. 2016](literatur:thomas-2016)).
- **Phobos.** The latest ephemeris of the Martian moons carries a physical libration of 1.14° for
  [Phobos](objekt:phobos) ([Brozović et al. 2025](literatur:brozovic-2025)).

## Measuring rotation

The rotational parameters of Solar System bodies are collected by the IAU working group on
cartographic coordinates and rotational elements. It describes the position of the prime meridian
by the angle $W$, measured along the body's equator from the node $Q$ on the ICRF equator, as
$W = W_0 + \dot{W}\,d$ with $d$ the interval in days from the standard epoch; if $W$ increases with
time the rotation is prograde, if it decreases, retrograde
([Archinal et al. 2011](literatur:archinal-2011)). The same report makes clear how thin the data
are for many moons: in the absence of other information the rotation axis is assumed to be normal
to the mean orbital plane, and for many satellites it is assumed that the rotation period equals
the orbital period — an assumption that in some cases still needs to be validated.

Where rotation really is measured, it is done in four ways. **Radar** from Earth tracks speckle
patterns that turn with the surface; this is how Mercury's obliquity and libration were determined
([Margot et al. 2007](literatur:margot-2007)) and how Venus was measured over fifteen years
([Margot et al. 2021](literatur:margot-2021)). **Control point networks** from spacecraft images
follow identifiable surface points over years; the librations of Mimas and Enceladus come from such
networks, for Mimas using stereophotogrammetry
([Tajeddine et al. 2014](literatur:tajeddine-2014);
[Thomas et al. 2016](literatur:thomas-2016)). **Laser altimetry** combined with stereo digital
terrain models achieves the same from orbit: three years of MESSENGER profiles, coregistered with
terrain models, gave Mercury's libration amplitude, obliquity and a mean rotation rate of
$6.13851804 \pm 9.4 \cdot 10^{-7}$ degrees per day, corresponding to a rotation period of
$58.6460768 \pm 0.0000090$ days ([Stark et al. 2015](literatur:stark-2015)). **Gravity field and
spin together** finally give the moment of inertia, as for Mercury and for the Moon, where laser
ranging supplied the libration angles and GRAIL the gravity coefficients
([Williams et al. 2014](literatur:williams-2014)).

## Pluto and Charon: doubly locked

When both bodies lock each other, the system comes to rest: each permanently shows the other the
same face, and no more angular momentum is transferred. [Pluto](objekt:pluto) and
[Charon](objekt:charon) are the best known example in the Solar System.
Calculations that start from an initial state with Charon on an eccentric orbit at about four Pluto
radii — consistent with an impact origin — and conserve the total angular momentum reach the dual
synchronous end state smoothly and self-consistently if the gravitational coefficient $C_{22}$ of
both bodies is carried along; omitting it frustrates successful evolution in some cases. On the
way, Charon's spin is temporarily captured into spin-orbit resonances, about which it
then librates with damping. The course of events depends strongly on the tidal model, and the ratio
of dissipation in Charon to that in Pluto controls how the eccentricity develops
([Cheng et al. 2014](literatur:cheng-2014)). The
[scene "Pluto and Charon, a double world"](szene:pluto-charon) shows this pair. The four small
moons of the system behave quite differently: Styx, Nix and Hydra are tied together by a three-body
resonance into which perturbations by the other bodies inject chaos, and Nix and Hydra rotate
chaotically, driven by the large torques of the binary
([Showalter and Hamilton 2015](literatur:showalter-2015)).

## Venus: solid body tides against atmospheric tides

[Venus](objekt:venus) is not locked, although it is close enough to the Sun and old enough. Radar
measurements from 2006 to 2020 give a mean sidereal day of $243.0226 \pm 0.0013$ Earth days,
retrograde, a tilt of the spin axis with respect to the orbital plane of
$2.6392 \pm 0.0008^\circ$ and a normalised moment of inertia of $0.337 \pm 0.024$; the rotation
period of the solid planet varies by 61 ppm, about 20 minutes, which requires that at least 4 % of
the atmospheric angular momentum be transferred to the solid body
([Margot et al. 2021](literatur:margot-2021)). Exactly this exchange is one reason why Venus is not
locked: the thermal tide of the dense atmosphere drives the rotation away from synchronisation. A
global climate model shows that for Earth-like planets in general a comparatively thin atmosphere
already suffices for this, once the amplitude of the thermal tide exceeds a threshold; Venus serves
there as the starting example ([Leconte et al. 2015](literatur:leconte-2015)).

Goldreich and Peale already considered a resonance of the second kind for Venus, in which the spin
would be commensurate with the synodic motion relative to the Earth, but found that this would
require a large $(B - A)/C > 10^{-4}$ and that the capture probability comes out small
([Goldreich and Peale 1966](literatur:goldreich-1966)). Today's explanation does without that
resonance: terrestrial planets with a dense atmosphere evolve into one of only four possible
rotation states, and most initial conditions lead to the one observed today — either through the
classical flip of the spin axis or, without any rotation of the axis, by slowing a prograde
rotation until it reverses while the obliquity goes towards zero
([Correia and Laskar 2001](literatur:correia-2001)).

## Chaotic rotation

Not every braking ends in a resonance. If a moon is strongly irregular in shape and moves on an
eccentric orbit, the resonance zones can overlap and the rotation becomes chaotic. Hyperion is the
textbook example: assuming rotation about a principal axis normal to the orbit plane, a large
chaotic zone surrounds the synchronous state, so large that it encloses the 1:2 and 2:1 states and
makes libration in the 3:2 state impossible. Rotation in this zone is also unstable against
tipping of the axis, so the moon tumbles as soon as tidal braking carries it into the zone
([Wisdom et al. 1984](literatur:wisdom-1984)). Since then Hyperion has counted as the only moon
observed to undergo chaotic rotation; the Cassini images added its shape, a mean density of
$544 \pm 50\,\mathrm{kg}\,\mathrm{m}^{-3}$ and a porosity above 40 %
([Thomas et al. 2007](literatur:thomas-2007)).

A three-dimensional treatment without the assumption of principal axis rotation, however, reaches a
different conclusion: resonances between the nutation and orbital frequencies drive the dynamics,
Hyperion is not tumbling chaotically contrary to long-held belief but lies near or in a
nutation-orbit resonance that is first order in eccentricity, and therefore rotates
quasi-regularly; the so-called barrel instability belongs to a different set of the same resonances
([Goldberg and Batygin 2024](literatur:goldberg-2024)). Independently of that, chaotic rotation is
no marginal phenomenon: placing the known moons on a stability diagram of inertial parameter and
eccentricity shows that the majority of moons with unknown rotation state cannot rotate
synchronously at all, because no stable 1:1 state exists for them; they rotate either much faster
or, far less probably, chaotically
([Melnikov and Shevchenko 2010](literatur:melnikov-2010)).

## Not quite synchronous: Europa and Titan

If the orbit is eccentric, the equilibrium spin of a dissipative body lies slightly above the
synchronous value — unless a permanent asymmetry holds it fast. [Europa](objekt:europa) has a
forced eccentricity of about 0.01 from its interaction with Io and Ganymede, and gravity data
suggested a permanent asymmetry large enough to offset the tidal torque. If non-synchronous
rotation is nevertheless observed, the crust is probably decoupled from the interior by a liquid or
ductile layer. From the orientation and distribution of the lineaments in early Galileo images it
was concluded that Europa rotates faster than synchronously, or did so in the past
([Geissler et al. 1998](literatur:geissler-1998)). An analysis of the hemispheric colour dichotomy,
which arises from the bombardment of the trailing hemisphere by energetic particles in Jupiter's
magnetosphere and therefore persists only if the discolouration acts much faster than the rotation
relative to the synchronous state, finds no detectable signature of non-synchronous rotation in
Voyager data — which sharpens the open question of the origin of the stresses that create Europa's
tectonics ([Burnett and Hayne 2021](literatur:burnett-2021)).

For Titan it is not the rate that is at issue but the axis: the measured departure from the
expected rotation state — obliquity and position relative to the Cassini plane — is larger than a
fully damped rigid body should show, and precisely for that reason it allows dissipation in the
interior to be inferred ([Downey and Nimmo 2025](literatur:downey-2025)).

## Locked bodies in the Solar System

The selection shows what each assignment rests on. "Assumed" means: expected from theory, but not
measured.

| Body | State | Method | Source |
|---|---|---|---|
| Moon | 1:1, Cassini state 2 | laser ranging, gravity field | [Williams et al. 2014](literatur:williams-2014); [Gladman et al. 1996](literatur:gladman-1996) |
| Mercury | 3:2, Cassini state | radar; laser altimetry with stereo model | [Pettengill and Dyce 1965](literatur:pettengill-1965); [Stark et al. 2015](literatur:stark-2015) |
| Phobos | 1:1, libration 1.14° | ephemeris from image and tracking data | [Brozović et al. 2025](literatur:brozovic-2025) |
| Europa | 1:1 or very slowly non-synchronous | lineaments; colour dichotomy | [Geissler et al. 1998](literatur:geissler-1998); [Burnett and Hayne 2021](literatur:burnett-2021) |
| Mimas | 1:1, libration twice the hydrostatic expectation | stereophotogrammetry from Cassini images | [Tajeddine et al. 2014](literatur:tajeddine-2014) |
| Enceladus | 1:1, libration 0.120° ± 0.014° | control point network from seven years of Cassini images | [Thomas et al. 2016](literatur:thomas-2016) |
| Titan | 1:1, Cassini state, obliquity 0.32° | rotation state relative to the Cassini plane | [Downey and Nimmo 2025](literatur:downey-2025); [Gladman et al. 1996](literatur:gladman-1996) |
| Hyperion | chaotic, or near a nutation-orbit resonance | observations and models | [Wisdom et al. 1984](literatur:wisdom-1984); [Goldberg and Batygin 2024](literatur:goldberg-2024) |
| Pluto and Charon | doubly 1:1 | orbit determination and tidal model | [Cheng et al. 2014](literatur:cheng-2014) |
| Nix, Hydra | chaotic | observed rotation state | [Showalter and Hamilton 2015](literatur:showalter-2015) |
| Venus | not locked, 243.0226 d retrograde | radar 2006 to 2020 | [Margot et al. 2021](literatur:margot-2021) |
| most other moons | 1:1 assumed | IAU rotation model | [Archinal et al. 2011](literatur:archinal-2011) |
| irregular moons | mostly fast rotation, no stable 1:1 state | stability diagram | [Melnikov and Shevchenko 2010](literatur:melnikov-2010) |

The theoretical basis of these assignments, from tidal braking via the stability of the resonances
to the permanent quadrupole moment the Moon needs in order to stay synchronous, is set out
coherently in [Murray and Dermott 2000](literatur:murray-2000), chapter 5.

## Open questions

- **Does Hyperion rotate chaotically?** The classical planar model predicts tumbling, and the
  observations were taken as confirmation ([Wisdom et al. 1984](literatur:wisdom-1984);
  [Thomas et al. 2007](literatur:thomas-2007)). The three-dimensional model without the assumption
  of principal axis rotation reaches the opposite conclusion and holds the most reliable
  observations to be consistent with non-chaotic motion or with chaos orders of magnitude smaller
  than originally claimed ([Goldberg and Batygin 2024](literatur:goldberg-2024)). The dispute is
  open.
- **Does Europa rotate non-synchronously?** The lineaments spoke for it
  ([Geissler et al. 1998](literatur:geissler-1998)), the colour dichotomy finds no signature
  ([Burnett and Hayne 2021](literatur:burnett-2021)). The two results can be reconciled only
  through very long rotation periods of the crust, and the alternative — a permanent asymmetry that
  balances the tidal torque — then requires another source for the stresses that create the
  fracture patterns.
- **How did Mercury enter the 3:2 resonance?** Chaotic orbital evolution with high eccentricity
  gives 55.4 % ([Correia and Laskar 2004](literatur:correia-2004)), with core-mantle friction 26 %
  alongside 32 % for 2:1 ([Correia and Laskar 2009](literatur:correia-2009)), and a torque from the
  Darwin-Kaula expansion makes 3:2 the most probable outcome after the very first encounter, while
  reversing the role of core-mantle friction
  ([Noyelles et al. 2014](literatur:noyelles-2014)). Which tidal rheology one follows decides the
  answer.
- **Is Venus in equilibrium?** Four end states are possible, and two paths lead to today's one
  ([Correia and Laskar 2001](literatur:correia-2001)); whether today's spin is an equilibrium
  between solid and atmospheric tides or is still drifting is open. The measured length-of-day
  variations of 61 ppm show how strongly the atmosphere acts on the solid body
  ([Margot et al. 2021](literatur:margot-2021)).
- **Mimas's interior.** The oversized libration can be explained by a strongly non-hydrostatic
  interior or by an ocean beneath a thick icy shell; the libration measurement alone does not
  separate the two readings ([Tajeddine et al. 2014](literatur:tajeddine-2014)).

## In the model

Orrery rotates every body uniformly: the rotation phase is zero at epoch for all 35 bodies and
grows with the fixed rotation period of the data set about a fixed pole; a negative period rotates
retrograde. There is no IAU model $W(t)$, no periodic terms, no physical libration and no Cassini
states. Nor does the phase count from the node $Q$; it counts from the direction into which the
shortest rotation of the sphere onto the body's pole carries the centre of the map. The table below
gives the angle between that centre of the map — on an equirectangular map with the prime meridian
in the middle of the image, therefore the prime meridian — and the direction to the parent body.

- **Tidal locking resides solely in the periods.** For all 21 moons the rotation period equals the
  sidereal orbital period $360^\circ/\dot{L}$ of the body's own data set, apart from rounding
  residues of at most $0.66 \cdot 10^{-6}$ (Deimos). These residues let the direction to the parent
  body drift slowly across the map: 6.9° per century for Deimos, 1.2° for Mimas, 1.1° for Miranda,
  and below 0.6° for all the others. As the orbital period the data block shows not this one but
  the Keplerian period computed from semi-major axis and masses; it departs from
  $360^\circ/\dot{L}$ by 0.54 % for Mimas, 0.32 % for Enceladus, −0.11 % for the Moon and by less
  than 0.21 % for the remaining moons. The displayed orbital period is therefore not exactly the
  one the rotation is locked to.
- **Libration.** In the model it arises only from the eccentricity — longitude swings with
  amplitude $2e$, for the Moon therefore over a range of 12.6°, for Titan over 6.6° — and from the
  inclination of the orbit against the
  fixed pole, which makes latitude swing. The swing in latitude is exactly the angle between pole
  and orbit normal: for the Moon ±6.7° at epoch, for Miranda ±4.3°, for Triton ±21.4°. For the
  latter two the orbital node does not move in the data set, so the swing stays fixed. For Triton
  and Miranda this also adds a swing in longitude, ±2.1° for Triton, although $2e$ there is only
  0.02°: it is the reduction to the equator, not the orbital eccentricity.
  For Triton and Miranda this swing is an artefact of the data set: the IAU report gives their
  poles as series with large periodic terms — for Triton
  $299.36^\circ - 32.35^\circ \sin N_7 - \ldots$ and
  $41.17^\circ + 22.55^\circ \cos N_7 + \ldots$, for Miranda
  $257.43^\circ + 4.41^\circ \sin U_{11} - \ldots$ and
  $-15.08^\circ + 4.25^\circ \cos U_{11} - \ldots$
  ([Archinal et al. 2011](literatur:archinal-2011)). These terms describe the precession with which
  the spin axis follows the moving orbit normal; the data set keeps only the constant terms, and in
  the model the pole stays fixed. Tethys is an exception of another kind: there the rate of the
  pericentre exceeds that of the mean longitude in the data set, the mean anomaly therefore runs
  backwards, and the libration in longitude has the right amplitude but a period of 57.8 instead of
  1.89 days.
- **Moon.** Rotation period 655.71984 h $= 360^\circ/\dot{L} = 27.32166$ days, hence no deviation;
  the Keplerian orbital period in the data block is 0.11 % shorter. The angle between the centre of
  the map and the direction to the Earth is 41.7° at epoch, 37.5° on 19 September 2026, 31.2° in
  1900 and 34.1° in 2100; on average the Earth stands over 37.0° east longitude of the map, and
  over a month between 30.5° and 43.5°. The pole stays fixed while the orbital node moves: pole and
  orbit normal are 6.72° apart at epoch, 3.57° at minimum and 3.76° on 19 September 2026. This is
  not a Cassini state, even if the configuration at epoch comes close to one.
- **Mercury.** The rotation period of 1407.6 h $= 58.65$ days is the rounded fact sheet value. Two
  thirds of the sidereal orbital period of the data set would be 58.6461709 days; the rotation
  therefore falls behind the 3:2 coupling by 14.6° per century, and against the measured
  58.6460768 days the model period is 339 s too long. The obliquity of Mercury computed from pole
  and orbit is 0.034° in the model and thus matches the measured $2.029 \pm 0.085$ arc minutes:
  the pole of the data set comes from the IAU report and already carries the Cassini configuration
  within it, without the model reproducing it. The data block rounds this value to one decimal and
  therefore shows 0.0°.
- **Venus.** The rotation period is $-5832.6$ h $= -243.025$ days; in the model the solar day is
  116.75 days and the synodic period relative to the Earth 583.92 days, that is 5.0014 times as
  long — the well known near-commensurability is thus preserved. The computed obliquity of
  177.3624° corresponds to the measured 2.6392° against the orbital plane with retrograde rotation.
- **Pluto and Charon.** Both carry the same pole direction and the same rotation period of
  153.29335 h; Charon's orbital period is 153.29333 h. They therefore permanently show each other
  the same face, though not the centre of the map: the angle between the centre of the map and the
  direction to the partner is 131.1° (Pluto) and 48.9° (Charon) and drifts by only 0.3° per
  century.
- **What is missing.** Hyperion, Janus, Epimetheus, Nix and Hydra are not in the catalogue; chaotic
  rotation does not occur anywhere in the model. There are no tidal torques, no core-mantle
  friction and no atmospheric tides, and therefore no evolution of a rotation state at all. Further
  simplifications: [Limits of the model](thema:modell).

The following table is computed from the code. The angle measures the separation between the centre
of the map and the direction to the parent body, for Pluto to Charon; for Pluto the orbital period
in the first column is Charon's too, not its own around the Sun. "+100 a" is 1 January 2100. Both
angle columns are snapshots: their difference is usually not the drift but the libration phase at
the respective moment — for the Moon the drift is zero and the angle still differs by 7.6°, for
Triton by 7.4° at a drift of 0.06° per century. For Mercury the sub-solar point travels around the
whole body under the 3:2 coupling anyway.

| Body | $P_\mathrm{rot}/P_\mathrm{sid} - 1$ in $10^{-6}$ | angle J2000 | angle +100 a |
|---|---|---|---|
| Mercury | −333,290 | 79.4° | 143.4° |
| Moon | 0.000 | 41.7° | 34.1° |
| Phobos | 0.000 | 103.7° | 102.5° |
| Deimos | 0.660 | 149.6° | 156.4° |
| Io | −0.047 | 162.8° | 163.1° |
| Europa | 0.070 | 31.5° | 31.2° |
| Ganymede | −0.012 | 39.0° | 39.1° |
| Callisto | 0.055 | 101.2° | 102.5° |
| Mimas | 0.088 | 143.6° | 145.7° |
| Enceladus | −0.061 | 136.2° | 135.8° |
| Tethys | 0.044 | 140.8° | 141.0° |
| Dione | −0.061 | 130.5° | 130.0° |
| Rhea | −0.018 | 5.9° | 5.8° |
| Titan | −0.005 | 37.7° | 40.0° |
| Iapetus | 0.001 | 46.0° | 47.2° |
| Miranda | 0.118 | 77.6° | 78.6° |
| Ariel | 0.066 | 46.7° | 46.6° |
| Umbriel | 0.020 | 0.8° | 1.2° |
| Titania | 0.019 | 31.9° | 31.6° |
| Oberon | 0.006 | 102.6° | 102.6° |
| Triton | 0.028 | 19.4° | 12.0° |
| Pluto | 0.144 | 131.1° | 131.4° |
| Charon | 0.144 | 48.9° | 48.6° |

Miranda, Ariel, Umbriel, Titania, Oberon and Triton have a negative rotation period. Their orbital
inclination against the equator of the parent body exceeds 90° in the data set, so they orbit that
pole retrograde as well: rotation and orbit remain in the same sense. The table therefore compares
the magnitudes.

*As of September 2026*
