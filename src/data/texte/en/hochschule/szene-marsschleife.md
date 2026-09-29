# Scene: Mars retrograde loop

For a while around its opposition, [Mars](objekt:mars) runs backwards against the stars because
[Earth](objekt:earth) overtakes it on the inner orbit.

## What the view shows

The observer sits at the orbital point of Earth, in the dataset the Earth-Moon barycentre, and looks
fixedly, after the blend of the first 2 s (see below), in the direction in which Mars stands at the middle of the scene. The Earth sphere is not
drawn; the scale is "Realistic" so that directions and angular sizes are right. The vertical field
of view is 30°, so 50.9° horizontally at 16:9. At opposition Mars measures 13.8″ and, at a picture
height of 1440 pixels (75″ per pixel), is only a labelled marker. It leaves a trail of the last 365
days, one point per day, with opacity fading towards the past (checkbox "Planet trails (1 year)");
the ecliptic is added as a great circle (checkbox "Ecliptic"). Both checkboxes are on by default.

At the start the clock jumps to 81 days before the next opposition after the set time, which is the
30 s to the middle of the scene at 2.7 days per second. The search looks for the longitude
opposition, that is the sign change of the longitude difference to the anti-Sun, in daily steps over
800 days and then by bisection to about 9 s. For any start time between the oppositions of
16 January 2025 (02:37) and 19 February 2027 (15:44), it returns the latter. All times are values of
the model clock, which the model uses as TDB.

The 2027 opposition lies at 150.39° ecliptic longitude and 4.46° latitude at a distance of 0.678 AU.
Mars turns around on 10 January at 13:36 at 160.05° longitude (latitude 3.61°) and runs forwards
again on 1 April at 13:09 at 140.54° (latitude 3.21°). The retrograde motion lasts 81.0 days and
covers 19.5° of longitude. In the nominal window of the scene, 81 days before to 81 days after opposition, Mars ranges
from 140.5° to 160.0° longitude at 1.8° to 4.5° latitude. Jupiter is in the picture as well, at
about 137° to 147° longitude and 0.8° to 1.1° latitude; in the model its opposition is on
11 February 2027 at 01:06.

The time rate glides geometrically over the first 2 s from the value of the previous scene to 2.7
days per second. Opposition therefore does not fall exactly at 30 s, but at 30.7 s after 1 day per
second, at 23.6 s after 30 days per second and at 31.7 s after the smallest value in the catalogue
(0.0035 days per second). The view is aimed at Mars at an estimate of the scene middle; depending on
the predecessor it lies 4.6 days before to 17.3 days after opposition, with the picture centre at
152.2° to 144.1° longitude; during the blend the view moves there, by up to 6.3°. The retrograde motion stays entirely in the picture, and the scene ends
76 to 98 days after opposition.

## Background

From the rates of mean longitude in the dataset follow the periods
$T_\oplus = 365.256\,\mathrm{d}$ and $T_\mathrm{Mars} = 686.980\,\mathrm{d}$ and the synodic period

$$\frac{1}{S} = \frac{1}{T_\oplus} - \frac{1}{T_\mathrm{Mars}}, \quad S = 779.94\,\mathrm{d}.$$

The model's oppositions from 2022 to 2029 follow one another after 769.9, 764.5 and 764.7 days, 10
to 15 days below the mean.

With $(x, y)$ as the difference of the ecliptic components of the positions of Mars and Earth and
$(\dot x, \dot y)$ as the difference of their velocities, the ecliptic longitude of Mars as seen from
Earth changes at

$$\dot\lambda = \frac{x\,\dot y - y\,\dot x}{x^2 + y^2}.$$

Negative means retrograde; the stationary points are the zeros. For coplanar circular orbits the
rate at opposition is
$\dot\lambda = (n_\mathrm{Mars} a_\mathrm{Mars} - n_\oplus a_\oplus)/(a_\mathrm{Mars} - a_\oplus)$.
With the dataset values ($n_\oplus = 0.9856$° and $n_\mathrm{Mars} = 0.5240$° per day,
$a_\mathrm{Mars} = 1.5237$ AU) that is $-0.357$° per day; the model gives $-0.399$° per day
in 2027. Mars is then 1.665 AU from the Sun, near its aphelion ($a(1+e) = 1.666$ AU); the
circular approximation gives only the order of magnitude.

The latitude follows from the orbital inclination. For a small inclination

$$\sin\beta = \frac{r}{\Delta}\,\sin i\,\sin u,$$

with $r$ the heliocentric distance of Mars, $\Delta$ its distance from Earth and $u$ the argument of
latitude (Earth lies in the plane). At the 2027 opposition Mars is 1.81° north of the ecliptic as
seen from the Sun; with $r/\Delta = 2.457$ this gives 4.46° latitude. Whether the retrograde motion
draws a closed loop or a zigzag depends on the course of the latitude: in 2027 it rises from 2.3° to
3.6° up to the first stationary point, reaches 4.46° at opposition and falls from the second
stationary point (3.2°) to 1.8° at the end of the scene. In the model the path never crosses itself
(polygon in steps of 0.25 days): it is a zigzag, not a closed knot.

Reading the motion as perspective is the historical core. By the second century, when Ptolemy
compiled the Almagest, astronomers had developed epicycles on deferents for retrograde motion.
Copernicus explained it in the Commentariolus as a mere appearance caused by Earth's motion, but
kept epicycles on the deferents ([Rabin 2023](quelle:sep-copernicus)).

## Model limitations

- **Direction:** At the five reference dates of JPL Horizons, the direction of Mars deviates by
  0.0002° to 0.0043° (up to 16″). Against Horizons (geocentric, geometric, Earth from DE441,
  [Park et al. 2021](literatur:park-2021)) between November 2026 and May 2027 the maximum is
  0.0042°; the stationary points differ by +0.80 h and −0.94 h, opposition by 5 s (Horizons: 10 January 12:48, 1 April 14:06, 19 February 15:44). Jupiter deviates by up to 0.036° (131″) in
  the picture. One pixel corresponds to 75″.
- **Earth-Moon barycentre:** The observer is not at the centre of Earth but 4672 km away; at
  opposition this amounts to up to 9.5″.
- **Light time and aberration:** The model shows geometric directions. At opposition the light takes
  338 s; this shifts Mars by 15″, annual aberration by 21″, both together by at most 9″ over the
  whole scene.
- **Reference frame:** Ecliptic and vernal equinox are fixed at J2000, precession is absent. By
  19 February 2027 the mean equinox has moved along the ecliptic by
  $p_A = 0.02438175\,t + 0.00000538691\,t^2$ in radians, with $t = 0.2714$ centuries, that is 0.379°
  (1365″) ([Petit and Luzum 2010](literatur:petit-2010), Eq. 5.44); coordinates of date would be
  larger by this amount, see [Reference systems](thema:bezugssysteme).

Further simplifications: [Limits of the model](thema:modell).

*As of September 2026*
