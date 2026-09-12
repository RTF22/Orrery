import type { Body, BodyIndex } from '../sim/types';
import { sun } from './bodies/sun';
import { mercury } from './bodies/mercury';
import { venus } from './bodies/venus';
import { earth } from './bodies/earth';
import { mars } from './bodies/mars';
import { jupiter } from './bodies/jupiter';
import { saturn } from './bodies/saturn';
import { uranus } from './bodies/uranus';
import { neptune } from './bodies/neptune';
import { moon } from './bodies/moon';
import { marsMonde } from './bodies/mars-monde';
import { jupiterMonde } from './bodies/jupiter-monde';

export const bodies: Body[] = [
  sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, moon,
  ...marsMonde,
  ...jupiterMonde,
];

export const bodyIndex: BodyIndex = Object.fromEntries(
  bodies.map((b) => [b.id, b]),
);

export function getBody(id: string): Body {
  const b = bodyIndex[id];
  if (!b) throw new Error(`Unbekannter Körper: ${id}`);
  return b;
}
