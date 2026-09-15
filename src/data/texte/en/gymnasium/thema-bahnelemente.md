# Orbital elements

An unperturbed orbit around a central body is an ellipse with the central body at one
focus. Six numbers define it:

- **Semi-major axis a:** the size of the orbit; Kepler's third law gives the orbital
  period from it.
- **Eccentricity e:** how elongated the ellipse is, from 0 for a circle to just below 1.
- **Inclination i:** the tilt of the orbital plane against a reference plane.
- **Longitude of the ascending node Ω:** the direction in which the orbit crosses the
  reference plane from south to north.
- **Longitude of perihelion ϖ:** the direction to the perihelion, the point of closest
  approach to the central body.
- **Mean longitude L:** where the body stands at a fixed time, the epoch.

The reference plane for the planets is the ecliptic at epoch J2000, the plane of the
Earth's orbit in the year 2000; the [Earth](objekt:earth) therefore has an inclination
of practically 0°. Many moons refer their elements to the equatorial plane of their
planet. For the planets, the simulation uses JPL elements that are valid at epoch J2000
and change at linear rates per century; between 1800 and 2050 they are accurate enough
for this display ([limits of the model](thema:modell)).

For a given time, the simulation first calculates the mean anomaly M = L − ϖ and then
solves Kepler's equation M = E − e · sin E for the eccentric anomaly E using Newton's
method. This gives the position in the orbital plane, which is then rotated into the
ecliptic by the argument of perihelion, the inclination and the longitude of the node.
Striking values include [Mercury](objekt:mercury) with e ≈ 0.21 and
[Pluto](objekt:pluto) with i ≈ 17°. Data:
[JPL Approximate Positions](quelle:jpl-approx-pos),
[Planetary Satellite Mean Elements](quelle:jpl-satelliten-bahnen).
