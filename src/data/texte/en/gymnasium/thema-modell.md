# Limits of the model

The simulation computes the orbits from Kepler's laws: every body moves on an
ellipse around its parent body, described by six [orbital elements](thema:bahnelemente)
that change slowly with time. This approximation is deliberate and has known limits.

- **No perturbations:** In reality the planets pull on each other; here only the Sun
  pulls. The elements contain the mean effect of the perturbations as linear rates,
  not the short-period variations.
- **Accuracy window 1800 to 2050:** Only within this period are the elements
  reliable. Outside it the error grows and the data block shows a warning.
- **No precession, no nutation:** The rotation axes are fixed in space. In reality
  the Earth's axis circles the ecliptic pole once in about 26,000 years.
- **Unmeasured axes:** For [Eris](objekt:eris) and [Makemake](objekt:makemake) the
  direction of the rotation axis is unknown; the simulation sets it perpendicular to the
  orbit, and the data block then shows an axial tilt of 0°. The pole of
  [Triton](objekt:triton) is stored without its periodic variations, so its axial tilt
  in the data block is not reliable.
- **Moons on a simplified plane:** Many lunar orbits refer to the equatorial plane of
  their planet (Laplace plane), not to the exact motion of their orbital poles.
- **Earth as barycentre:** The table gives the Earth-Moon barycentre; the deviation
  from the Earth's centre is below 4,700 km.

Sources: [JPL Approximate Positions](quelle:jpl-approx-pos) for the orbital
elements, [NSSDC Fact Sheets](quelle:nssdc-factsheets) for the key figures,
[IAU report](quelle:iau-rotation) for the rotation axes.
