# Albedo and brightness

How bright a body appears depends on its size, its distances from the Sun and the observer, the
phase angle, and on how its surface or atmosphere scatters light. Photometry separates these
contributions: the geometry lies in distance laws, the scattering properties in the albedo and the
phase function. This text introduces the quantities used to describe planets, moons and small
bodies, presents measured values and the points in dispute, and explains why the brightness of a
body in Orrery's image reproduces none of these quantities.

## Geometric albedo, phase integral and Bond albedo

The phase angle $\alpha$ is the angle between the directions to the Sun and to the observer, as seen
from the body. The geometric albedo $p$ is the ratio of the brightness at $\alpha = 0$ to that of a
flat, perfectly white, Lambertian disk with the same cross-section
([Geometric albedo](quelle:wikipedia-en-geometric-albedo);
[Mallama et al. 2017](literatur:mallama-2017)). With the phase function $\Phi(\alpha)$ normalized to
$\Phi(0) = 1$, the apparent magnitude of a sphere of radius $R$ at distance $r$ from the Sun and
$\Delta$ from the observer, all lengths in au, is

$$m = m_\odot - 2.5\,\log_{10}\left[p\,\Phi(\alpha)\,\frac{R^2}{r^2\,\Delta^2}\right]$$

Here $m_\odot$ is the magnitude of the Sun in the same band at a distance of 1 au, −26.75 in the V
band. In this way Mallama et al. recover the geometric albedo 0.499 from Saturn's V magnitude
referred to 1 au and full phase with the rings edge-on, −8.91, and its mean disk radius of 57,240 km
([Mallama et al. 2017](literatur:mallama-2017), Sections 1 and 6, Tables 3 and 6, Appendix A-6).

The Bond albedo $A$, also called spherical albedo, is the fraction of the radiation falling on the
cross-section that the body scatters back in all directions; its ratio to the geometric albedo is
called the phase integral ([Albedo](quelle:wikipedia-de-albedo);
[Muinonen et al. 2010](literatur:muinonen-2010), Eq. 8;
[Shevchenko et al. 2019](literatur:shevchenko-2019), Eq. 1):

$$A = p\,q, \quad q = 2\int_0^\pi \Phi(\alpha)\,\sin\alpha\,d\alpha$$

The relation holds per wavelength. For the energy balance what counts is the bolometric Bond albedo,
the mean weighted with the solar spectrum $F_\odot(\lambda)$
([Buratti et al. 2022](literatur:buratti-2022), Eq. 2):

$$A_\mathrm{bol} = \frac{\int_0^\infty p(\lambda)\,q(\lambda)\,F_\odot(\lambda)\,d\lambda}{\int_0^\infty F_\odot(\lambda)\,d\lambda}$$

Tables such as the one below often mix both, $p$ in the V band and $A$ bolometric; their quotient is
then not a phase integral. Unlike $A$, $p$ is not bounded by 1: if a surface is strongly
backscattering or has a strong opposition effect, conservation of energy allows $p > 1$
([Verbiscer et al. 2007](literatur:verbiscer-2007), note 3).

## Lambert sphere and Lommel–Seeliger law

A Lambert surface of albedo $A_\mathrm{L}$ has the radiance factor $I/F = A_\mathrm{L}\,\mu_0$, with
$\mu_0$ the cosine of the angle of incidence. Integrating over the sphere gives

$$p = \frac{2}{3}\,A_\mathrm{L}, \quad \Phi_\mathrm{L}(\alpha) = \frac{\sin\alpha + (\pi - \alpha)\cos\alpha}{\pi}, \quad q = \frac{3}{2}$$

The Bond albedo of the Lambert sphere is thus $A_\mathrm{L}$ itself, its geometric albedo two thirds
of it; it cannot exceed $2/3$.

The Lommel–Seeliger law describes single scattering by isotropically scattering particles of
single-scattering albedo $w$, with $\mu$ the cosine of the emission angle; it follows from radiative
transfer theory when multiple scattering is neglected for a small single-scattering albedo
([Muinonen and Wilkman 2015](literatur:muinonen-2015), Eqs. 2.1 and 2.2):

$$\frac{I}{F} = \frac{w}{4}\,\frac{\mu_0}{\mu_0 + \mu}$$

At $\alpha = 0$, $\mu_0 = \mu$; the disk appears uniformly bright without limb darkening, and
$p = w/8$ ([Muinonen and Wilkman 2015](literatur:muinonen-2015), Eq. 2.10). The phase function and
phase integral of the sphere are

$$\Phi_\mathrm{LS}(\alpha) = 1 + \sin\frac{\alpha}{2}\,\tan\frac{\alpha}{2}\,\ln\tan\frac{\alpha}{4}, \quad q = \frac{16}{3}\,(1 - \ln 2) \approx 1.64$$

in agreement with the value 1.64 given by [Shevchenko et al. 2019](literatur:shevchenko-2019). At
$\alpha = 90^\circ$ the Lambert sphere retains 0.318 and the Lommel–Seeliger sphere 0.377 of its
brightness at full phase.

Neither law knows an opposition effect. Lommel–Seeliger serves as a model for dark, particulate
surfaces such as those of primitive asteroids
([Muinonen and Wilkman 2015](literatur:muinonen-2015)), but neither law reproduces the measured
phase curves of airless bodies: for asteroid classes of low to high albedo, measured phase curves
give phase integrals from 0.35 to 0.54, 0.44 on average, because mutual shadowing of regolith
particles makes the phase curve steep; for the Moon Shevchenko et al. obtained 0.48 ± 0.02, clearly
less than the older value 0.60 of Lane and Irvine (1973), a difference they attribute to newer,
better measurements of the lunar phase curve ([Shevchenko et al. 2019](literatur:shevchenko-2019)).
The mid-sized moons of Saturn lie between 0.71 and 0.80 at 0.55 µm
([Buratti et al. 2022](literatur:buratti-2022), Table 2). For cloud-covered planets the phase curve
falls off more gently, and the phase integral exceeds 1: for Jupiter roughly 1.1 to 1.3 below 1050
nm ([Li et al. 2018](literatur:li-2018)), for Uranus 1.36 ± 0.03 bolometric
([Irwin et al. 2025](literatur:irwin-2025)).

## Phase curve and opposition effect

Over a wide range, the magnitude of asteroids changes roughly linearly with phase angle; below about
7° the brightness rises nonlinearly. This opposition effect is attributed to an interplay of shadow
hiding and coherent backscattering ([Muinonen et al. 2010](literatur:muinonen-2010)).

In shadow hiding, which Seeliger put forward as the explanation in 1887 and 1895, the shadows that
particles cast onto deeper ones disappear as soon as the directions of incidence and viewing
coincide. Loosely packed, porous surfaces show the strongest surges
([Buratti et al. 2022](literatur:buratti-2022)). For identical particles without multiple
scattering, Hapke's model gives the angular width as a function of the filling factor $\phi$ (Hapke
1986, as cited by [Buratti et al. 2022](literatur:buratti-2022)):

$$h_\mathrm{S} = -\frac{3}{8}\,\ln(1 - \phi)$$

The more porous the surface, the narrower the surge. Coherent backscattering arises when multiply
scattered photons traverse the same path in opposite directions and interfere constructively exactly
in the backward direction. Because it requires multiple scattering, it should be stronger on bright
surfaces; it is invoked above all for the narrow spike in the last degree of phase angle
([Buratti et al. 2022](literatur:buratti-2022)). The second edition of Hapke's textbook treats it in
detail ([Hapke 2012a](literatur:hapke-2012a)). One signature is polarization: in Apollo soil samples
the linear polarization ratio decreases and the circular one increases in the opposition peak
([Hapke et al. 1993](literatur:hapke-1993)).

The observations sort by albedo, which also changes with wavelength: the darker the surface, the
steeper the phase curve; the brighter, the more pronounced the coherent spike
([Buratti et al. 2022](literatur:buratti-2022), Section 4). Shadow hiding could explain the sharp
peak of Europa only with unreasonable porosities (Domingue et al. 1991, after
[Buratti et al. 2022](literatur:buratti-2022)). On [Enceladus](objekt:enceladus), HST images between
0.26° and 6.4° showed a steep, narrow surge that is best described by a model combining moderate
shadow hiding and narrow coherent backscattering
([Verbiscer et al. 2005](literatur:verbiscer-2005)). For the mid-sized moons of Saturn the phase
curves in the visible and near infrared do not fit pure shadow hiding, whereas at 3.6 µm, where the
geometric albedo drops to about 0.2 and multiple scattering hardly matters, they do; the dark
hemisphere of [Iapetus](objekt:iapetus) seems to show no appreciable surge
([Buratti et al. 2022](literatur:buratti-2022)). How strongly the effect shapes observations is
shown by [Mercury](objekt:mercury): it appears brightest near superior conjunction, at small phase
angle and greatest distance ([Mallama and Hilton 2018](literatur:mallama-2018)).

## Absolute magnitude and diameter

The absolute magnitude $H$ of a small body is its V magnitude averaged over a rotation, at 1 au from
the Sun and the Earth and at $\alpha = 0$ ([Muinonen et al. 2010](literatur:muinonen-2010)). With
$r = \Delta = 1$ and $\Phi(0) = 1$ the magnitude equation yields the diameter $D = 2R$
([Muinonen et al. 2010](literatur:muinonen-2010), Eq. 1;
[Mahlke et al. 2021](literatur:mahlke-2021), Eq. 2):

$$D = \frac{1329\,\mathrm{km}}{\sqrt{p}}\,10^{-H/5}$$

The constant is two au times $10^{m_\odot/5}$ and corresponds to $m_\odot = -26.76$; with −26.75 it
would be 1336 km. Without a measured albedo the size remains uncertain: for $H = 10$, $p = 0.05$
gives a diameter of 59 km, $p = 0.25$ only 27 km. Conversely, an albedo derived from $H$ and size is
not a direct measurement; Bowell et al. proposed calling it a pseudoalbedo (after
[Muinonen et al. 2010](literatur:muinonen-2010)).

## H-G and H-G₁-G₂ systems

Because hardly any asteroid is observed near $\alpha = 0$, $H$ has to be extrapolated from
measurements at larger phase angles. In 1985 Commission 20 of the IAU adopted the H-G system for
this. For the magnitude reduced to unit distances ([Muinonen et al. 2010](literatur:muinonen-2010),
Eqs. 2 and 6)

$$V(\alpha) = H - 2.5\,\log_{10}\left[(1 - G)\,\Phi_1(\alpha) + G\,\Phi_2(\alpha)\right]$$

$$\Phi_1 \approx \exp\left(-3.33\,\tan^{0.63}\frac{\alpha}{2}\right), \quad \Phi_2 \approx \exp\left(-1.87\,\tan^{1.22}\frac{\alpha}{2}\right)$$

The slope parameter $G$ is close to 0 for steep phase curves and close to 1 for shallow ones. The
basis functions stem from scattering models that did not yet include coherent backscattering. In
2010, $G$ had been determined for about 0.1% of the known asteroids; for the rest $G = 0.15$ is
usually assumed ([Muinonen et al. 2010](literatur:muinonen-2010)). For very dark and very bright
objects the H-G system reproduces the opposition effect poorly
([Mahlke et al. 2021](literatur:mahlke-2021)).

Muinonen et al. extended it, with newly fitted basis functions, to the H-G₁-G₂ system, in which
$\Phi_1$ and $\Phi_2$ describe the linear part and $\Phi_3$ the opposition effect
([Muinonen et al. 2010](literatur:muinonen-2010); [Mahlke et al. 2021](literatur:mahlke-2021), Eq.
3):

$$V(\alpha) = H - 2.5\,\log_{10}\left[G_1\,\Phi_1(\alpha) + G_2\,\Phi_2(\alpha) + (1 - G_1 - G_2)\,\Phi_3(\alpha)\right]$$

with $G_1, G_2 \ge 0$ and $G_1 + G_2 \le 1$. For few observations they derived from it a nonlinear
two-parameter H-G₁₂ system. In 2012 the IAU adopted the H-G₁-G₂ system to supersede the H-G system.
As late as 2024 the Minor Planet Center, JPL and Lowell Observatory published $H$ in the H-G system,
mostly with $G = 0.15$; H-G₁-G₂ needs observations below 2° to 4°
([Carry et al. 2024](literatur:carry-2024)). Both systems yield a phase integral
([Muinonen et al. 2010](literatur:muinonen-2010), Eq. 7, accurate to about 5%;
[Shevchenko et al. 2019](literatur:shevchenko-2019), Eq. 3):

$$q = 0.290 + 0.684\,G, \quad q = 0.009082 + 0.4061\,G_1 + 0.8092\,G_2$$

With $G = 0.15$, $q = 0.39$.

## Apparent magnitudes of the planets

For The Astronomical Almanac, Mallama and Hilton compute the V magnitude of the planets from the
distance $r$ from the Sun and $d$ from the Earth in au, the magnitude $V_1(0)$ at 1 au and full
phase, and a polynomial in the phase angle in degrees
([Mallama and Hilton 2018](literatur:mallama-2018), Eq. 1):

$$V = 5\,\log_{10}(r\,d) + V_1(0) + C_1\,\alpha + C_2\,\alpha^2 + \ldots$$

The peculiarities sit in additional terms. [Venus](objekt:venus) becomes fainter again as
$\alpha \to 0$, interpreted as a glory of its atmosphere; at 163.7° the curve kinks because sulfuric
acid droplets scatter light forward. It reaches greatest brilliancy on average at
$\alpha = 123.5^\circ$ with −4.81; it was brightest in the period analysed on 19 December 1989 at
−4.92. For the [Earth](objekt:earth), seen from space, $V_1(0) = -3.99$ corresponds to the geometric
albedo 0.434; model calculations give, depending on cloud cover, 0.12 without clouds up to 0.76
under altostratus and, between 0.5 and 0.9 µm, 0.358 for realistic clouds, which is why the Earth's
magnitude is probably less predictable than that of most other planets. Mars varies with the
longitude of the visible hemisphere by up to 0.06 magnitudes. For Saturn the rings dominate: near
$\alpha = 0$ they become much brighter than at 6°, while the globe stays almost the same. Uranus
appears brighter when more of its methane-depleted polar regions is visible. Neptune brightened
markedly between about 1980 and 2000 (see Open questions). The brightest mean opposition magnitude
belongs to Jupiter at −2.70, the faintest to Neptune at 7.71
([Mallama and Hilton 2018](literatur:mallama-2018)).

## Albedo of selected bodies

Geometric albedo in the V band (Enceladus at 0.55 µm) and bolometric Bond albedo; the sources are in
the last column.

| Body | $p$ | $A_\mathrm{bol}$ | Sources |
|---|---:|---:|---|
| [Venus](objekt:venus) | 0.689 | 0.76 | [Mallama et al. 2017](literatur:mallama-2017); [Haus et al. 2016](literatur:haus-2016) |
| [Earth](objekt:earth) | 0.434 | 0.293 | [Mallama et al. 2017](literatur:mallama-2017); [Stephens et al. 2015](literatur:stephens-2015) |
| [Jupiter](objekt:jupiter) | 0.538 | 0.503 ± 0.012 | [Mallama et al. 2017](literatur:mallama-2017); [Li et al. 2018](literatur:li-2018) |
| [Saturn](objekt:saturn) | 0.499 | 0.41 ± 0.02 | [Mallama et al. 2017](literatur:mallama-2017); [Wang et al. 2024a](literatur:wang-2024a) |
| [Uranus](objekt:uranus) | 0.488 | 0.349 ± 0.016 (orbital mean) | [Mallama et al. 2017](literatur:mallama-2017); [Irwin et al. 2025](literatur:irwin-2025) |
| [Enceladus](objekt:enceladus) | 1.24 ± 0.01 | 0.89 ± 0.02 | [Buratti et al. 2022](literatur:buratti-2022) |
| [Iapetus](objekt:iapetus), dark leading side | – | 0.06 ± 0.01 | [Blackburn et al. 2011](literatur:blackburn-2011) |
| [Iapetus](objekt:iapetus), bright trailing side | – | 0.25 ± 0.03 | [Blackburn et al. 2011](literatur:blackburn-2011) |

For Venus the Bond albedo even exceeds the geometric one ($A/p \approx 1.10$, in different bands):
its phase curve falls off far more gently than that of airless Mercury
([Mallama and Hilton 2018](literatur:mallama-2018), Fig. 1). For the Earth the Bond albedo follows
from the mean reflected flux of 99.7 W m⁻² according to CERES; without clouds it would be 52.4 W m⁻²
or 0.149, and Explorer 7 had already measured about 0.30 in 1959
([Stephens et al. 2015](literatur:stephens-2015)). For Uranus the geometric albedo depends strongly
on the band, 0.488 in V against 0.079 in I ([Mallama et al. 2017](literatur:mallama-2017), Table 7).
For Enceladus $p\,q$ is 0.98 at 0.55 µm, but 0.89 bolometric, because the albedo drops in the ice
bands of the near infrared, to 0.36 at 2.02 µm ([Buratti et al. 2022](literatur:buratti-2022),
Tables 2 and 3). Other analyses gave $p = 1.41 \pm 0.03$ at 549 nm
([Verbiscer et al. 2005](literatur:verbiscer-2005)) and, from thermal emission,
$A_\mathrm{bol} = 0.81 \pm 0.04$ ([Howett et al. 2010](literatur:howett-2010), value as given by
[Buratti et al. 2022](literatur:buratti-2022), Table 3). The moons in the E ring have mean geometric
albedos around or above 1, which Verbiscer et al. attribute to the ice particles from Enceladus
([Verbiscer et al. 2007](literatur:verbiscer-2007)). For Iapetus the value depends on resolution:
bright material reaches 0.38 ± 0.04 in high-resolution images, because the hemispheric means include
dark specks ([Blackburn et al. 2011](literatur:blackburn-2011)). A disk-integrated geometric albedo
per hemisphere is missing from the works evaluated here; Buratti et al. leave Iapetus out of their
albedo table because of its albedo variations.

## Equilibrium temperature

If a body at distance $d$ (in au) absorbs over its cross-section and emits uniformly over its whole
surface with emissivity $\varepsilon$, then

$$T_\mathrm{eq} = \left[\frac{(1 - A)\,S_\odot}{4\,\varepsilon\,\sigma\,d^2}\right]^{1/4}$$

with the nominal solar constant $S_\odot = 1361\,\mathrm{W}\,\mathrm{m}^{-2}$ of IAU Resolution B3
of 2015; the irradiance varies by about 0.08% ([Prša et al. 2016](literatur:prsa-2016)). For the
subsolar point of a slowly rotating body the factor 4 drops out, and the temperature rises by a
factor of 1.41. The Earth would reach 255 K with $A = 0.293$ and $\varepsilon = 1$. For Venus,
$A = 0.76$ and 0.7233 au give 229 K, close to the effective emission temperature of 228.5 K from a
radiative balance model ([Haus et al. 2016](literatur:haus-2016)). For Iapetus the subsolar values
are 125.5 K for $A = 0.06$ and 118.6 K for $A = 0.25$; Blackburn et al. give 125.5 K and 118.4 K
([Blackburn et al. 2011](literatur:blackburn-2011)). Giant planets emit more than they absorb; the
difference is their internal heat flux, and any error in $A_\mathrm{bol}$ enters it. With Jupiter's
Bond albedo of 0.503 instead of 0.343 the absorbed power drops by 24%; together with an emitted
power of 14.098 W m⁻² this gave an internal heat flux of 7.485 instead of 5.444 W m⁻²
([Li et al. 2018](literatur:li-2018)).

## Open questions

- **Contributions to the lunar opposition effect:** Hapke et al. took the polarization of laboratory
  samples in 1993 as unequivocal evidence that most of the lunar effect is due to coherent
  backscattering ([Hapke et al. 1993](literatur:hapke-1993)). From images of the Lunar
  Reconnaissance Orbiter wide-angle camera they later concluded that neither mechanism alone
  explains the phase curves; for a highland area coherent backscattering contributes nearly 40% in
  the ultraviolet and over 60% in the red. That the width of the effect hardly depends on
  wavelength, although theory predicts for the Moon an increase with the square of the wavelength,
  they take as a sign that the understanding of coherent backscattering is incomplete or perhaps
  incorrect ([Hapke et al. 2012b](literatur:hapke-2012b)). Another analysis of the same camera finds
  a narrow coherent component with a width from 1.2° in the highlands in red light to 3.9° in the
  maria in blue light, with an albedo dependence as expected from theory, and estimates its maximum
  amplitude at about 8%. The width is defined there specifically, as the largest phase angle up to
  which the slope of the spike grows with albedo
  ([Velikodsky et al. 2016](literatur:velikodsky-2016)); the numbers of the two works measure
  different quantities and cannot be compared directly.
- **Bond albedo of the giant planets:** For Jupiter, the Voyager radiometer and a Pioneer phase
  integral of 1.25 gave 0.343 ± 0.032, whose error is an estimate of systematic effects
  ([Hanel et al. 1981](literatur:hanel-1981)); Cassini data gave 0.503 ± 0.012. Li et al. name
  better calibration, more complete coverage in wavelength and phase angle, and the wavelength
  dependence as reasons and rule out a temporal change ([Li et al. 2018](literatur:li-2018)). For
  Saturn the value rose from 0.34 ± 0.03 after Voyager to 0.41 ± 0.02 and the internal heat flux
  from 2.01 ± 0.14 to 2.84 ± 0.20 W m⁻². That Voyager covered only a belt between −11° and −32°
  latitude, 4.6% darker than the global mean, explains only part of the difference. The Voyager
  analysis is hard to reproduce for lack of details, and the Saturn determination follows the method
  the group had described earlier, among others for Jupiter
  ([Wang et al. 2024a](literatur:wang-2024a)). For Uranus, Irwin et al. set against the Voyager
  values of Pearl et al. (1990), an orbital mean of 0.300 ± 0.049 and a ratio of emitted to absorbed
  power of 1.06 ± 0.08, consistent with thermal equilibrium, an aerosol model fitted to
  observations: 0.349 ± 0.016 and 1.15 ± 0.06. Their value still rests on the emission measured by
  Voyager 2, whose re-determination they recommend ([Irwin et al. 2025](literatur:irwin-2025), Table
  1). With an energy balance over a whole orbit, Wang et al. also find an energy loss, with an
  internal heat flux of 0.078 ± 0.018 W m⁻² ([Wang et al. 2025](literatur:wang-2025)).
- **Brightening of Neptune:** Why Neptune brightened between 1980 and 2000 was considered
  unexplained in 2018. Karkoschka (2011) suggests darkening events in which haze particles are
  lifted and then settle again, Sromovsky et al. (2003) a seasonal change as on Uranus; Lockwood and
  Jerzykiewicz (2006) objected that the seasonal model reproduces older observations poorly. If it
  were correct, Neptune should soon fade again after its solstice in 2005 (all after
  [Mallama and Hilton 2018](literatur:mallama-2018)). According to Lowell and HST data the
  brightness rose until 2005, stayed flat until about 2012 and decreased overall thereafter. From
  1994 to 2022 the cloud activity in the near infrared was correlated with the Sun's Lyman-α
  radiation, which Chavez et al. take as support for photochemical cloud formation driven by solar
  ultraviolet; seasonal effects are probably important for the slow changes, but the other long-term
  variations must have a different origin ([Chavez et al. 2023](literatur:chavez-2023)).

## In the model

- **Albedo value:** Every body except the Sun carries a geometric albedo, which the data panel shows
  as "Geometric albedo". The values of the planets agree with the V-band values of
  [Mallama et al. 2017](literatur:mallama-2017), Table 7; Enceladus carries 1.0, the value of the
  NSSDC fact sheet, and thus lies below the newer measurements in the table; the Moon carries 0.12
  and Iapetus 0.275, the mean of the hemispheric values 0.05 and 0.5 from the same fact sheet.
  Orrery computes neither Bond albedo, phase integral, phase angle nor apparent magnitudes;
  magnitudes occur only for the background stars, as point size.
- **Map and factor:** The textures are not reflectance maps; the map of Enceladus has a mean of only
  0.172. Orrery averages their linear colour values, the three channels with equal weight, weighted
  with the cosine of latitude and excluding data gaps below 0.005, and scales the material colour by
  geometric albedo divided by this mean, limited to 0.1 to 30. The Earth map has a mean of 0.134 and
  is multiplied by 3.24, the Moon map by 0.384, that of Enceladus by 5.80. The mean reflectance of
  the displayed surface is thus the geometric albedo. Weighted by luminance, the Earth map would
  have a mean of 0.116. The contrast of the map remains: for Iapetus the hemisphere centred on the
  darkest viewing direction has a mean reflectance of 0.053, the one centred on the brightest 0.373.
- **Scattering:** The material of three.js 0.186 with roughness 1 and no metalness scatters
  Lambertian times $1 - F$. The Fresnel factor $F$ applies at the half vector between light and
  viewing direction and therefore depends only on the phase angle: 0.04 at full phase, 0.13 at 135°,
  0.41 at 160°. In addition there is a faint uncoloured gloss that the albedo factor does not scale.
  A sphere of reflectance $p$ therefore has in the model, computed without gloss and fill light, the
  geometric albedo $0.640\,p$, the phase integral 1.49, slightly below 1.5 because of the growing
  $F$, and the Bond albedo $0.955\,p$; for a target at 1 au the gloss adds about 0.011 to the
  geometric albedo. The Earth thus appears with 0.278 and 0.415 instead of the measured 0.434 and
  0.293, Enceladus with 0.64 instead of 1.24. Opposition effect, Lommel–Seeliger or Hapke behaviour,
  clouds and scattering in atmospheres are missing; the Earth map is cloudless.
- **Fill light:** The night-side fill, by default a quarter of the day level, lies with the same map
  over the whole visible disk, on the day side as well. At full phase it raises the disk mean from
  $0.640\,p$ to $0.890\,p$; at 90° phase angle 55%, at 135° 90% of the disk light comes from it. The
  phase curve in the image therefore follows no physical law. In the
  [lunar eclipse](szene:mondfinsternis) only this fill, tinted with the colour value #ff9a5c,
  remains of the Moon in the umbra, and the camera exposes for the Earth there.
- **Exposure:** The camera sets the illumination so that a white Lambert surface at the target under
  normal incidence, without Fresnel factor and fill, reaches the linear value 1. Every target thus
  appears equally bright, however far it is from the Sun, although on 17 September 2026 Neptune
  receives only 1/883 of the Earth's irradiance. For the other bodies in the image the irradiance
  $E$ relative to 1 au counts, with the default of the "Distance compensation" slider, only as
  $E^{0.3}$, and in the default view "Diagram" the compressed distance $r_\mathrm{d} = r^{0.6}$
  applies, both in au. With the Earth as target, Neptune appears at 0.295 of its day level instead
  of 0.00113, i.e. 261 times too bright, in the "Realistic" view 115 times.
- **Tone curve:** The image values pass through the ACES curve of three.js and the sRGB encoding.
  The linear value 1 ends up at 226 of 255, with the fill, i.e. 1.25, at 233. At the subsolar point
  of a surface of reflectance 0.12, including Fresnel factor and fill, the value is 112, for
  reflectance 1 it is 232: 8.3 times the luminance becomes 2.1 times the image value, and luminances
  below 0.0020 turn black. Brightnesses in the image are therefore not measured quantities; neither
  $p$ nor $A$ can be recovered from them.
- **Rings:** They receive a designed brightening term that acts only in backlight, but no
  backscatter spike; the strong brightening of Saturn's rings at full phase is not shown by Orrery.
  Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
