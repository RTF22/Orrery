# Kirkwood gaps

Plot the semi-major axes of all main-belt asteroids and the distribution is not smooth: at
several places the frequency drops to a fraction of its surroundings, while at two neighbouring
places bodies actually cluster instead. The location of these gaps follows from Kepler's third law
for orbits whose period stands in a ratio of small integers to Jupiter's (a mean-motion resonance),
as derived in [Orbital resonances](thema:resonanzen):

$$a = a_\mathrm{J} \left( \frac{p-q}{p} \right)^{2/3}$$

With $a_\mathrm{J} = 5.203\,\mathrm{AU}$ the resonances 3:1, 5:2, 7:3 and 2:1 lie at 2.50, 2.82,
2.96 and 3.28 AU. This text covers the observed distribution, the mechanisms now understood for
forming and maintaining the gaps, the transport of their material towards Earth and the Sun, the
balance between early clearing and present-day dynamics, and the comparison with resonance gaps in
Saturn's rings; finally it explains what [Orrery](thema:modell) shows of them.

## Observation

Named after its discoverer, who was the first to recognise that integer orbital-period ratios with
Jupiter lie behind the uneven distribution, histograms of the semi-major axes of the numbered main
belt show pronounced, narrow drops. Such an overview for around 157,000 asteroids with
well-determined orbits explicitly marks the four gaps 3:1, 5:2, 7:3 and 2:1, without giving
numerical values in AU or showing the groups at 3:2 and 1:1
(chart [Kirkwood gaps in the main belt](quelle:jpl-hauptguertel)). Not every resonance clears its
region: the Hilda asteroids gather at 3:2, the Jupiter Trojans at 1:1
([Nesvorný 2018](literatur:nesvorny-2018)). [Ceres](objekt:ceres) itself lies between two of the
most prominent gaps, the 3:1 resonance at 2.50 AU and the 5:2 resonance at 2.82 AU, clearly closer
to the latter, without being trapped in either.

## Mechanisms

That orbits near the 3:1 resonance can run for centuries at low eccentricity and then jump within
a short time to Mars-crossing values was shown by Wisdom using a fast mapping method: test bodies
spend up to a million years with $e < 0.1$ and then jump to $e > 0.3$; the outer boundary of this
chaotic zone coincides, within the errors of the orbital elements, with the boundary of the
observed 3:1 gap ([Wisdom 1983](literatur:wisdom-1983)). A later, semianalytic perturbation theory
for the same resonance set out to explain *why* this chaos arises. It explicitly rules out the most
obvious explanation: the three mean-motion sub-resonances belonging to the 3:1 ratio itself overlap
strongly, yet their overlap is specifically not the cause of the large chaotic zone. Instead, the
work identifies "zones of uncertainty": regions where an adiabatic invariant of the motion, split
into two timescales, breaks down because the orbit runs close to a separatrix; chaotic motion
begins exactly there ([Wisdom 1985](literatur:wisdom-1985)).

A later explanation, generalised to further gaps, traces the chaos in the 4:1, 3:1, 5:2 and 7:3
resonances to a different, independent mechanism: the overlap of secular resonances *within* the
respective mean-motion resonance (Moons and Morbidelli 1995, as referenced by
[Kirkwood gap, Wikipedia](quelle:wikipedia-en-kirkwood-gap)) — a mechanism that is not identical to
the breakdown of the adiabatic invariant Wisdom described in detail for 3:1, but complements it and
extends it to the other gaps. The 2:1 resonance holds a special position here: current
understanding is that it contains stable islands in phase space, yet is cleared almost completely
by slow diffusion through the overlapping secular resonances (as referenced by
[Kirkwood gap, Wikipedia](quelle:wikipedia-en-kirkwood-gap)) — unlike the neighbouring 3:2
resonance, where the Hilda asteroids sit stably
([Nesvorný 2018](literatur:nesvorny-2018)). In general, mean-motion resonances with Jupiter
amplify an asteroid's eccentricity variations
([Nesvorný 2018](literatur:nesvorny-2018)).

## Transport

Once a body enters one of the main-belt resonances, its residence time is short: numerical
integrations show dynamical lifetimes of typically only a few million years, after which most
bodies plunge into the Sun or reach Jupiter-crossing orbits
([Gladman et al. 1997](literatur:gladman-1997)). For today's near-Earth objects the contribution of
this route can be quantified: a model that assembles the observed, bias-corrected orbital
distribution of near-Earth objects from five source regions finds a weight of about 20 percent for
the 3:1 resonance in the overall population — alongside 37 percent from the $\nu_6$ resonance,
27 percent from the intermediate Mars-crossing region, 10 percent from the outer main belt and
6 percent from Jupiter-family comets ([Bottke et al. 2002](literatur:bottke-2002)).

This supply does not sustain itself, because collisional fragments alone would empty the resonances
faster than the observed flux of near-Earth objects allows. The anisotropic thermal re-emission of
rotating bodies, the Yarkovsky effect, slowly but steadily shifts the semi-major axis of small
asteroids and meteoroids (diameter below roughly 40 km) over millions of years — carrying them into
the narrow chaotic resonance zones in the first place, from where the mechanism described above can
carry them on to Earth ([Bottke et al. 2006](literatur:bottke-2006)). Without this resupply the
Kirkwood gaps would remain just as empty, but the stream of meteorites and near-Earth asteroids
from their edges would eventually run dry.

## History

Today's chaotic dynamics explain why the resonance cores themselves are empty, but the observed
distribution shows more: in regions that should be dynamically stable over the age of the Solar
System, a pattern of excess depletion appears immediately outward of the 5:2, 7:3 and 2:1
resonances that the present-day planetary configuration alone does not explain. It instead matches
the dynamical ejection produced by sweeping resonances during the migration of Jupiter and Saturn
around four billion years ago: as the giant planets migrated outward, their resonances swept across
parts of today's main belt and ejected bodies there, long before today's more narrowly confined
chaotic dynamics began to act at the same places
([Minton and Malhotra 2009](literatur:minton-2009)). The main belt thus carries two layers of
depletion on top of each other: a primordial one from the early
[migration of the giant planets](thema:entstehung) and one still active today, from the resonance
chaos described in the Mechanisms section.

## Comparison

A counterpart outside the asteroid belt is found in Saturn's ring system: the Cassini division, the
sparsely populated zone between the dense B ring and the A ring, sits where the 2:1 resonance with
the moon Mimas clears the material almost completely, producing the sharpest edge in the entire
ring system ([Rings](thema:ringe)). Structurally this resembles the Kirkwood gaps: there, too, a
mean-motion resonance marks the gap. The clearing mechanism, however, differs markedly. At the
Cassini division a single moon, acting directly at the resonance location, transfers angular
momentum to the ring particles through a Lindblad resonance and pushes them out of the zone; in the
main belt, by contrast, no second body is needed at the resonance location itself — there the
asteroid's own chaotic dynamics pumps up its eccentricity until collisions or close passages by
Mars or Earth remove it from the orbit over millions of years. What both cases share is only the
principle of a resonance as the cause of a gap, not the mechanism that clears it.

## Open questions

- **Share of early clearing versus present-day dynamics:** How much of the depletion observed
  outside the resonance cores today goes back to primordial resonance sweeping during the giant
  planets' migration, and how much to the chaotic dynamics of the resonances that has kept acting
  ever since, is not cleanly separated; Minton and Malhotra read the observed depletion pattern
  beyond the resonances as evidence for a primordial component, without quantifying it
  ([Minton and Malhotra 2009](literatur:minton-2009)).
- **Role of the Yarkovsky effect at the gap edges:** the effect demonstrably delivers material into
  the resonance zones and at the same time disperses asteroid families, whose fragments drift into
  or out of mean-motion and secular resonances ([Bottke et al. 2006](literatur:bottke-2006)); how
  strongly it should be weighted against the primordial layout and the ongoing chaotic clearing for
  the sharpness of each individual gap's edge is not yet quantified gap by gap.
- **2:1 empty, 3:2 populated:** why the 2:1 resonance appears almost completely cleared by slow
  diffusion despite containing stable islands in its phase space, while the neighbouring 3:2
  resonance stays permanently populated by the Hilda asteroids, is only partly understood: the
  difference is attributed to the additional overlap of secular resonances that occurs around 2:1
  and is absent in this form at 3:2 (as referenced by
  [Kirkwood gap, Wikipedia](quelle:wikipedia-en-kirkwood-gap); Hildas per
  [Nesvorný 2018](literatur:nesvorny-2018)); a quantitative comparison of the two resonances,
  checked within this text itself, remains outstanding.

## In the model

`src/sim/belts.ts` draws the main belt's semi-major axes from a bell curve around 2.7 AU (spread
$\sigma = 0.35\,\mathrm{AU}$) over the range 2.1 to 3.3 AU, multiplied by five Gaussian dips of the
form $1 - 0.9\,\exp(-x^2)$ at the resonances 4:1, 3:1, 5:2, 7:3 and 2:1, each with
$x = (a - a_\mathrm{res})/w$; the residual density at the centre of every gap is therefore exactly
10 percent by construction (own check: `kirkwoodDensity` returns 0.10000 at all five resonance
locations). The full width at half maximum of such a dip is $1.665\,w$ (derivation:
$\exp(-x^2) = 1/2$ at $x = \sqrt{\ln 2}$, the full width is $2x$); with the values held in the code,
$w = 0.012$ (4:1), $0.015$ (3:1), $0.012$ (5:2), $0.010$ (7:3) and $0.020$ AU (2:1), the resulting
half-widths are 0.0200, 0.0250, 0.0200, 0.0167 and 0.0333 AU — the gaps are therefore
**prescribed** density profiles of fixed width and location, not the product of actual orbital
dynamics; the particles move on fixed Keplerian orbits, only their mean anomaly changes, and any
perturbation by Jupiter is entirely absent.

The code fixes the locations with the constant `A_JUPITER_AE`, $a_\mathrm{J} = 5.2044\,\mathrm{AU}$,
whereas [Orbital resonances](thema:resonanzen) uses $a_\mathrm{J} = 5.203\,\mathrm{AU}$ (own check
with $a = a_\mathrm{J}(p/q)^{2/3}$ for both values):

| Resonance | $a$ at 5.2044 AU | $a$ at 5.203 AU | Difference |
|---|---|---|---|
| 4:1 | 2.0654 AU | 2.0648 AU | 0.0006 AU |
| 3:1 | 2.5020 AU | 2.5013 AU | 0.0007 AU |
| 5:2 | 2.8254 AU | 2.8246 AU | 0.0008 AU |
| 7:3 | 2.9584 AU | 2.9576 AU | 0.0008 AU |
| 2:1 | 3.2786 AU | 3.2777 AU | 0.0009 AU |

The shift therefore lies, for all five gaps, between 0.0006 and 0.0009 AU, well below any distance
resolvable in the image (the same order of magnitude is already given for [Ceres](objekt:ceres) for
3:1 and 5:2). Of the five gaps, only the 4:1 gap at 2.0654 AU lies before the belt's lower boundary
of 2.1 AU: there its dip has already decayed to over 99.9 percent density (own check:
`kirkwoodDensity(2.10) = 0.99978`) and contributes practically nothing. The 2:1 gap at 3.2786 AU,
by contrast, has its centre within the range; only the upper boundary of 3.3 AU cuts off its outer
flank, a good half-width beyond the centre, where the density has still dropped to about
71.5 percent (own check: `kirkwoodDensity(3.30) = 0.71459`, i.e. a 28.5 percent dip) — beyond
3.3 AU the drawn belt therefore no longer offers an undiluted comparison class for this gap.

Among the 50,000 particles of the "high" quality tier, a 0.02 AU wide window around the resonance
centre at 3:1, 5:2 and 7:3 contains only about 19, 26 and 34 percent as many particles as
equally wide comparison windows 0.06 to 0.10 AU away on either side, on average; at 2:1 it is about
12 percent of the two inner comparison windows (the outer ones already lie beyond the belt because
of the upper boundary and are empty — averaging them in by mistake would give a distorted figure of
about 25 percent instead of 12 percent, own check). Sorted by actual distance from the Sun instead
of by semi-major axis, this depth almost entirely disappears: on 17 September 2026 the shares for
3:1, 5:2 and 7:3 are about 104, 100 and 105 percent of their surroundings — the population's mean
eccentricity of 0.125 spreads each particle over a range of heliocentric distances wider than the
0.02 to 0.03 AU narrow gap itself, so the gaps overlap each other in solar distance. In the scene
[Ceres in the asteroid belt](szene:ceres-guertel), whose point cloud shows the same distribution,
the Kirkwood gaps are therefore, by this calculation, not recognisable as a structure in the image,
even though they are present in the underlying density profile of the semi-major axis.

Particle count by quality tier: 0 at "low", 10,000 at "medium" and 50,000 at "high"
(`BELT_PARTICLES`); at "low" there is no point cloud at all, and therefore no gap that could in
principle be visible. Hildas, Trojans, the $\nu_6$ resonance and the Yarkovsky effect are entirely
absent from the model: the particles carry fixed orbital elements without secular precession, so a
secular resonance cannot arise in the first place, and their albedo is uniformly 0.06, as justified
for the rest of the main belt in [Formation of the Solar System](thema:entstehung). Further model
limits: [Limits of the model](thema:modell).

*As of September 2026*
