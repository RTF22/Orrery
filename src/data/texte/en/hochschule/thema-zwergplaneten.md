# Dwarf planets

Five bodies today carry the status "dwarf planet" created by the International Astronomical Union
(IAU) in 2006: [Ceres](objekt:ceres) in the main belt, and [Pluto](objekt:pluto),
[Eris](objekt:eris), [Haumea](objekt:haumea) and [Makemake](objekt:makemake) in the Kuiper belt.
The category did not arise from a new physical insight but from a counting and boundary problem:
Ceres was briefly a planet in 1801, then demoted to "asteroid" once further, similarly sized bodies
turned up nearby, and the same question resurfaced roughly 200 years later, when the 2005
discovery of Eris produced a body more massive than Pluto that evidently belongs to the same
population as Pluto and dozens of other trans-Neptunian objects. This text presents the IAU
definition and its quantitative criteria, places the question of hydrostatic equilibrium with its
borderline cases, compares the five recognized bodies using the values from their own texts,
covers the size-density relation and the moons of large Kuiper belt objects as possible impact
remnants, and closes with the dispute over the definition itself, as it also affects Pluto.

## Definition and history of the classification

IAU Resolution B5 from the 2006 General Assembly defines a planet as a body that (a) is in orbit
around the Sun, (b) has sufficient mass for its self-gravity to overcome rigid body forces so that
it assumes a hydrostatic equilibrium (nearly round) shape, and (c) has cleared the neighbourhood
around its orbit. A "dwarf planet" satisfies (a) and (b) but not (c), and is at the same time not a
satellite ([IAU 2006](literatur:iau-2006)); an IAU process explicitly foreseen but never formalized
was to assign borderline objects to one of the two categories. The accompanying Resolution B6
declares Pluto a dwarf planet under this definition and recognizes it as the prototype of a new
category of trans-Neptunian objects ([IAU 2006](literatur:iau-2006)).

Ceres itself stands at the beginning of the story: Giuseppe Piazzi discovered it in 1801 in
Palermo, initially listed as a planet; once Pallas, Juno and Vesta turned up within a few decades
as further bodies of similar size on similar orbits, the whole group was demoted to "asteroids"
(classification history under [Ceres](objekt:ceres)). Clyde Tombaugh discovered Pluto in 1930 at
Lowell Observatory during a deliberate search for a postulated "Planet X" (classification history
under [Pluto](objekt:pluto)); for more than 70 years it remained the ninth planet with no known
neighbour of comparable size. Only the Kuiper belt, increasingly explored from the 1990s onward,
and within it the 2005 discovery of Eris — after the first mass determination slightly more
massive than Pluto — forced the decision: either Eris and, before long, further similarly sized
Kuiper belt bodies would have had to be declared planets as well, or a separate class was needed
([Brown, Trujillo and Rabinowitz 2005](literatur:brown-trujillo-rabinowitz-2005)). Haumea and
Makemake, both already discovered in 2004/2005, joined Ceres, Pluto and Eris as further members of
the new category.

## Quantitative criteria for clearing the orbit

The third criterion, clearing the orbital neighbourhood, is stated qualitatively and cannot be met
literally: no planet has completely cleared its orbit of small bodies, because gravitational and
radiative forces continually scatter asteroids and comets onto orbit-crossing paths
([Margot 2015](literatur:margot-2015)). Several works have therefore tried to put the criterion in
quantitative terms.

Already [Stern and Levison (2002)](literatur:stern-levison-2002) examined a purely dynamical
measure of the form $\Lambda \propto M_p^2/P$ (planet mass $M_p$, orbital period $P$) for a body's
ability to dominate its orbital zone over a characteristic time span;
[Soter (2006)](literatur:soter-2006) took up this theoretical "scattering parameter" $\Lambda$
again but set alongside it a second, purely observation-based measure: the discriminant
$\mu = M/m$, with $M$ the mass of the target body and $m$ the combined mass of all other bodies
sharing its orbital zone. For Mars ($\mu \approx 5100$, against the near-Earth objects) and Ceres
($\mu = (1/4)/(3/4) \approx 1/3$, against the rest of the main belt, since Ceres carries about a
quarter of its mass) a gap of four orders of magnitude opens up; Pluto, at about 7 percent of the
Kuiper belt's mass, sits at $\mu \approx 0.07$. Soter proposes $\mu = 100$ as the boundary
between planets and non-planets, near the middle of the observed gap, with a defensible margin of
roughly 10 to 1000.

[Margot (2015)](literatur:margot-2015) formalized the scattering parameter $\Lambda$ into a
clearing time $t_\mathrm{clear}$, after which a body of mass $M_p$ at distance $a_p$ around a star
of mass $M_\mathrm{star}$ has cleared its surroundings out to $C$ times its own Hill radius (commonly
$C = 2\sqrt{3}$). From this follows a minimum clearing mass $M_\mathrm{clear}$ for clearing within
a time $t$, and, for main-sequence stars with the approximation $t_\mathrm{MS}/t_\odot \approx
(M_\mathrm{star}/M_\odot)^{-2.5}$, the closed form

$$\frac{M_\mathrm{clear}}{M_\oplus} \approx 1.9 \times 10^{-4}\,C^{3/2}
\left(\frac{M_\mathrm{star}}{M_\odot}\right)^{5/2} \left(\frac{a_p}{1\,\mathrm{AU}}\right)^{9/8}$$

The discriminant $\Pi = M_\mathrm{body}/M_\mathrm{clear}$ separates planets from non-planets at
$\Pi = 1$. For the solar system ($C = 2\sqrt{3}$, $t = t_\mathrm{MS}$) this gives:

| Body | Mass ($M_\oplus$) | $\Pi$ |
|---|---:|---:|
| Jupiter | 317.90 | $4.0 \times 10^4$ |
| Earth | 1.000 | $8.1 \times 10^2$ |
| Mercury | 0.055 | $1.3 \times 10^2$ |
| Mars | 0.107 | $5.4 \times 10^1$ |
| Ceres | $1.6 \times 10^{-4}$ | $4.0 \times 10^{-2}$ |
| Pluto | $2.2 \times 10^{-3}$ | $2.8 \times 10^{-2}$ |
| Eris | $2.8 \times 10^{-3}$ | $2.0 \times 10^{-2}$ |

All eight planets lie well above $\Pi = 1$, Ceres, Pluto and Eris well below it — between the
smallest planetary value (Mars, $\Pi = 54$) and the largest non-planet value (Ceres,
$\Pi = 0.04$) lies a gap of a good three orders of magnitude (a factor of about 1350), even though
Pluto's mass falls short of Mercury's by only a factor of 25: Mercury's $\Pi$ exceeds Pluto's by
more than 4000-fold (own calculation from the table). Margot's original table does not
list Haumea and Makemake; their masses lie between those of Ceres and Pluto (own calculation:
$6.6 \times 10^{-4}\,M_\oplus$ and $4.5 \times 10^{-4}\,M_\oplus$ respectively), and since both
orbit about as far out as Pluto and Eris, their $\Pi$ would likewise fall well below the gap.
Three independently constructed measures —
Stern and Levison's theoretical scattering parameter, Soter's observed discriminant and Margot's
clearing-time criterion — agree in separating the same eight bodies from all the rest.

## Hydrostatic equilibrium

The second criterion is less sharp than it first appears: the size at which self-gravity overcomes
material strength depends on a body's composition, temperature and history, not on its mass alone.
Icy bodies become round already at a few hundred kilometres in diameter, because water ice has far
less resistance to slow flow (creep) at the low temperatures of the outer solar system than rock
does; rocky bodies correspondingly need more mass. Tancredi and Favre studied this problem
systematically using the shape and size data available for asteroids and trans-Neptunian objects
at the time and proposed observable criteria (from absolute magnitude and albedo, among others) to
estimate which bodies are likely in equilibrium without requiring a direct shape measurement for
each one ([Tancredi and Favre 2008](literatur:tancredi-2008)).

Even among the five recognized dwarf planets, "nearly round" is not an all-or-nothing finding.
Ceres is practically circular at the equator but, at about 7.5 percent polar flattening,
noticeably more flattened than its current, comparatively slow rotation of about 9.07 h would
suggest; Ceres thus approaches hydrostatic equilibrium without reaching it exactly (details and
figures under [Ceres](objekt:ceres)). Haumea is the most pronounced borderline case: with a
rotation period of only 3.92 h and an axis ratio of roughly 2:1.6:1, it is open whether its shape
actually corresponds to a Jacobi ellipsoid, the equilibrium shape of a homogeneous, rigidly
rotating fluid body; an older light-curve solution fits this picture well, while the more precise
2017 occultation shape fits better to an inhomogeneous body that is nonetheless also in
equilibrium, and a newer 2026 calculation makes a prediction decidable by future occultations
(state of the dispute and references under [Haumea](objekt:haumea)). A third, contrasting example
is the Saturn moon [Iapetus](objekt:iapetus): its present shape does not match its present, tidally
locked rotation of about 79 days, but is preserved as a "frozen" relic of an earlier rotation of
about 16 hours — evidence that a body's equilibrium shape can also reflect its past, not only its
present, history, once a sufficiently rigid lithosphere has locked in the old shape.

Beyond the five officially recognized dwarf planets, several further trans-Neptunian objects are
regarded as plausible but not formally classified candidates, foremost among them Gonggong,
Quaoar, Sedna and Orcus — all large enough (a few hundred kilometres in radius) that hydrostatic
equilibrium is likely but, absent a direct shape or gravity-field measurement, unproven. JWST
spectroscopy of Sedna, Gonggong and Quaoar found complex organic compounds formed from irradiated
methane on all three and interprets the findings as evidence of internal melting and geochemical
evolution, similar to the large, recognized dwarf planets and distinctly different from the
smaller Kuiper belt objects ([Emery et al. 2024](literatur:emery-2024)) — an indirect argument for
internal differentiation, but no proof of the outer equilibrium shape itself. Orcus, dynamically
closely aligned with Pluto through its large moon Vanth (both in 3:2 resonance with Neptune),
together with Vanth reaches the highest moon-to-primary mass ratio known to date among planets or
dwarf planets (figures under [Charon](objekt:charon)).

## Comparing the five recognized dwarf planets

The following table sets the parameters of the five bodies from their own texts and the dataset
side by side; radius, mass and rotation period are measured values. For Ceres, Pluto, Eris and
Makemake the density follows from them via $\bar\rho = 3M/(4\pi R^3)$ (derivation); for Haumea it
is the span of two independent shape solutions (see below). $a$, $e$ and $i$ are the dataset's
heliocentric orbital elements at the respective epoch.

| Body | Radius (km) | Mass (kg) | Density ($\mathrm{g\,cm^{-3}}$) | Albedo | Rotation (h) | $a$ (AU) | $e$ | $i$ (°) | Moons |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ceres | 469.7 | $9.3835 \times 10^{20}$ | 2.162 | 0.090 | 9.074 | 2.766 | 0.0797 | 10.588 | 0 |
| Pluto | 1188.3 | $1.303 \times 10^{22}$ | 1.85 | 0.62 | 153.293 | 39.589 | 0.2518 | 17.148 | 5 |
| Eris | 1163 | $1.638 \times 10^{22}$ | 2.49 | 0.96 | 378.864 | 67.934 | 0.438 | 43.926 | 1 |
| Haumea | 774.1 | $3.952 \times 10^{21}$ | 1.86–2.05 | 0.51 | 3.915 | 43.060 | 0.194 | 28.208 | 2 |
| Makemake | 715 | $2.69 \times 10^{21}$ | 1.76 | 0.77 | 22.83/11.41 | 45.571 | 0.159 | 29.028 | 1 |

The row shows a span of almost an order of magnitude in mass and radius, but densities that all lie
between those of water ice and rock: Ceres and Eris, the two most massive, are also the densest,
while Haumea and Makemake, despite mass comparable to Pluto, are noticeably less dense — a first
hint of the size-density relation discussed in the next section. For [Pluto](objekt:pluto) the
photometrically measured albedo shown here differs from the dataset value (0.52 catalogue against
0.62 measured); the reason is given there under "In the model". Haumea's density and radius depend on the shape solution used
(details below and under [Haumea](objekt:haumea)), Makemake's rotation period is not settled as of
September 2026 ([Makemake](objekt:makemake)), and its mass rests on an unrefereed preprint (see
below).

## Size-density relation and volatiles

Across trans-Neptunian objects, mean density tends to rise with size: Bierson and Nimmo interpret
this as a consequence of falling porosity, because larger bodies compact their initially loose,
porous rock fraction more strongly under higher internal pressure and, given sufficient size,
higher radiogenic temperature. For 14 of 17 objects with a measured density, a common rock mass
fraction of about 70 percent, held constant across all bodies, matches the observed values within
twice the measurement uncertainty; the radiogenic heating needed for such compaction, driven by the
short-lived isotope ${}^{26}\mathrm{Al}$, implies a minimum formation time of about 4 million years after the
solar system's first solids ([Bierson and Nimmo 2019](literatur:bierson-2019)). Ceres and Pluto
follow this size-density trend roughly, Eris, with its high density at comparatively moderate size,
sits somewhat above it, while Haumea and Makemake, despite mass similar to or greater than Pluto's,
are noticeably less dense (see table above) — a hint that, besides size, a body's collision history
also shapes its present density (see below).

Whether a body retains volatile ices such as nitrogen, methane or carbon monoxide at its surface or
loses them to space over time depends on its escape velocity and its surface temperature, which in
turn is set by solar distance and albedo; Schaller and Brown modelled this race between sublimation
and escape for the known large Kuiper belt objects and worked out which of them could hold volatile
ices over the age of the solar system and which could not
([Schaller and Brown 2007](literatur:schaller-brown-2007); figures for the individual bodies under
[Makemake](objekt:makemake)).

Large Kuiper belt objects notably often carry moons: Brown et al. systematically searched the then
four brightest known Kuiper belt objects with adaptive optics at Keck Observatory and found at
least one moon around three of them — Pluto, today's Haumea and today's Eris
([Brown et al. 2006](literatur:brown-2006)). Barr and Schwamb read this clustering as evidence of a
common origin through giant impacts and sort the known systems into two groups accordingly: systems
with a large, massive moon such as Pluto-Charon retain nearly the full ice-rich starting density of
both partners in a grazing, low-velocity impact, while systems with a small moon such as Eris,
Haumea or Quaoar lose a larger part of their ice mantle in more energetic impacts and are left
denser as a result ([Barr and Schwamb 2016](literatur:barr-schwamb-2016)). Haumea's case is doubly
notable: the same impact thought to explain its fast rotation and its two moons Hiʻiaka and Namaka
has, on this reading, also left behind its comparatively high density (state of the dispute over
Haumea's family formation under [Haumea](objekt:haumea)). Haumea is also, so far, the only one of
the five dwarf planets with a confirmed ring, about 70 km wide at a distance of roughly 2287 km, in
the plane of its equator and its largest moon; whether similar rings are common elsewhere in the
Kuiper belt is open ([Rings](thema:ringe)).

## Dispute over the definition

The 2006 IAU definition is not undisputed. Its main point of criticism: the clearing criterion
depends on solar distance, because the same mass finds it harder to clear an orbital zone the
farther out and the larger that zone is — a body with Pluto-like mass at Earth-orbit distance
would satisfy the criterion easily, while at Neptune-orbit distance it does not. Metzger et al.
therefore propose a purely geophysical definition, under which a planet is defined solely by its
own hydrostatic roundness, independent of its orbital surroundings; on this reading, Pluto and the
other dwarf planets would be planets just as much as hydrostatically round moons
([Metzger et al. 2022](literatur:metzger-2022)). Conversely, the three quantitative clearing
criteria above show that, despite its qualitative wording, the IAU boundary can be fixed at the
same place in the solar system independently of the exact method, which speaks for its dynamical
significance. Both sides thus have tenable arguments; the field has not settled on a shared
criterion, and Orrery follows, as already shown for [Pluto](objekt:pluto), the IAU classification
without deciding the dispute.

## Open questions

- **Which candidates are actually in hydrostatic equilibrium?** Gonggong, Quaoar, Sedna and Orcus
  lack direct shape or gravity-field measurements; the JWST spectra argue for internal
  differentiation but are no proof of the outer shape
  ([Emery et al. 2024](literatur:emery-2024)). Even among the five recognized bodies, Haumea's
  Jacobi-ellipsoid question remains open ([Haumea](objekt:haumea)).
- **Does the clearing criterion carry scientific weight, or is a geophysical definition
  preferable?** Both sides are supported and undecided
  ([IAU 2006](literatur:iau-2006); [Metzger et al. 2022](literatur:metzger-2022)).
- **Where does the size-density relation of trans-Neptunian objects come from?** Bierson and Nimmo
  interpret it as a consequence of falling porosity at constant rock fraction
  ([Bierson and Nimmo 2019](literatur:bierson-2019)); how much different impact histories (see
  above, [Barr and Schwamb 2016](literatur:barr-schwamb-2016)) make individual bodies deviate from
  this common trend is not cleanly separated.
- **How common are rings and moons among trans-Neptunian objects?** So far only Haumea among the
  five recognized dwarf planets is known to carry a ring, while Quaoar and Chariklo show that
  considerably smaller bodies can carry rings too ([Rings](thema:ringe)); whether a general
  frequency can be inferred from the still small number of known cases is open.

## In the model

Orrery models all five recognized dwarf planets with `kind: 'dwarf'` as heliocentric bodies, with
osculating elements from the JPL Small-Body Database at their own epoch and all rates except
$\dot L$ set to zero (as in [Orbital elements](thema:bahnelemente)), against the ecliptic of J2000
(as in [Reference systems](thema:bezugssysteme)). Of the dwarf planets' moons, only Charon is in
the catalogue; Dysnomia (Eris), Hiʻiaka and Namaka (Haumea) and MK 2 (Makemake) are missing, as are
Pluto's four small moons Styx, Nix, Kerberos and Hydra.

The poles follow different procedures depending on the available data: Ceres and Pluto carry an
IAU pole measured from spacecraft and kernel data respectively, Haumea's pole comes from one of two
nearly equivalent light-curve inversion solutions, and Eris and Makemake, for lack of a measured
pole, carry their own orbit normal instead — an explicit stopgap assumption that actually
contradicts the published tilt angle: roughly 78° for Eris, as derived under
[Axial tilt](thema:achsneigung), and 46° to 78° for Makemake
([Parker et al. 2016](literatur:parker-2016)). All five bodies are spheres without flattening in the model,
including Haumea: its strongly triaxial outline (semi-axes roughly 1061, 844 and 514 km) deviates
from the model sphere (radius 774.1 km) by about −27 percent along the long axis and about +51
percent along the short axis (details under [Haumea](objekt:haumea)); its ring is entirely absent
from the model. All four textures of the trans-Neptunian dwarf planets (Ceres, Eris, Haumea,
Makemake) are explicitly labelled "fictional" at their source, because no full surface mapping
exists for these bodies (`ASSETS.md`); Pluto's and Charon's textures, by contrast, rest on the
actual New Horizons mosaic of their imaged hemisphere (see [Pluto](objekt:pluto),
[Charon](objekt:charon)).

The scene system size for cinema mode (`systemRadiusKm` in `src/render/camera/cinema.ts`) refers
explicitly only to `AEUSSERSTER_PLANET = 'neptune'` and deliberately excludes the dwarf planets:
Eris's strongly eccentric orbit reaches roughly 98 AU at aphelion, farther out than Neptune, and
would inflate any camera scene keyed to system size out of proportion. The Kuiper belt itself, as
described under [Formation of the Solar System](thema:entstehung), is a point cloud with fixed
orbital elements and no dynamics of its own; the distribution generated there contains none of the
five bodies discussed here and none of the candidates Gonggong, Quaoar, Sedna or Orcus, all of
which are absent from the model throughout. Further simplifications:
[Model limitations](thema:modell).

*As of September 2026*
