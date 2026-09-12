# Phase 3a — Katalog-Ausbau und Ringe: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 25 neue Körper (20 Monde, 5 Zwergplaneten) mit belegten Bahnelementen, Saturn- und Uranusringe mit Vorwärtsstreuung, eine aufgeräumte Oberfläche für 35 Körper und ein Szenenkatalog, der das alles zeigt.

**Architecture:** Der Planetenpol wird zum Datum, aus dem Mondbahnebene, Ringebene und Achsneigung gleichermaßen folgen — eine Zahl statt dreier unabhängig gepflegter. Die Mathematik dafür liegt als reine Funktionen in `sim/frames.ts` und ist ohne Three.js testbar. Die Ringe sind ein eigenes Rendermodul, datengetrieben aus dem bereits vorhandenen Feld `appearance.rings`; Beleuchtung und Distanzausgleich holen sie sich aus `render/lighting.ts`, statt eigene Regeln zu erfinden. Neue Körper und neue Szenen sind reine Daten — der Director und die Szenen-Engine bleiben unangetastet.

**Tech Stack:** TypeScript (strict), Vite, React 19, Zustand, Tailwind CSS v4, Three.js, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-12-phase3a-katalog-design.md` (baut auf `2026-09-11-sonnensystem-design.md` auf)

## Global Constraints

- **Sprache:** Alle sichtbaren Texte ausschließlich über `ui/i18n/de.ts`, niemals als Literal im Code. Deutsch ist Standardsprache.
- **Commits:** Ausschließlich Jens Fricke als Autor. **Keine** `Co-Authored-By:`-Zeile, keine `Claude-Session:`-Zeile, keine Erwähnung von Claude oder Anthropic in Commit-Messages oder Dateien.
- **Schrittgröße:** Jeder Task endet in einem eigenen Commit mit grünen Tests und ist für sich abgeschlossen. Sessionlimits sind eine reale Schranke — kein Task, der nur zur Hälfte sinnvoll ist.
- **Veröffentlichung:** Das Repository bleibt privat. Der Pages-Job bleibt `workflow_dispatch`.
- **Schichtengrenze:** `src/sim/**` und `src/data/**` dürfen **nichts** aus `three`, `react` oder dem DOM importieren (von `eslint.config.js` erzwungen).
- **Quellenpflicht:** Jeder neue Datensatz trägt seinen Quellenkommentar mit nachvollziehbarer Kontrollrechnung, so wie `src/data/bodies/moon.ts`. Jede neue Texturdatei bekommt ihre Zeile in `ASSETS.md` mit Quelle, Urheber, Lizenz, Maßen, Größe und Bearbeitungsvermerk.
- **Keine erfundenen Zahlen:** Bahnelemente, Radien, Massen und Pollagen werden aus der genannten Quelle abgerufen, nicht aus dem Gedächtnis geschrieben. Wo dieser Plan Zahlen nennt, sind es **Ausgangswerte, die die Kontrollrechnung des jeweiligen Tasks bestehen müssen** — besteht ein Wert sie nicht, gilt die Quelle, nicht der Plan.
- **Kein Screenshot-Vergleich:** Gerenderte Bilder werden nicht automatisiert verglichen (Spec Abschnitt 12 des Hauptentwurfs). Wo es auf das Bild ankommt, steht eine manuelle Sichtprüfung im Task.

---

## Dateistruktur

**Neu:**

| Datei | Verantwortung |
|---|---|
| `src/sim/frames.ts` | Pol-Mathematik: Polvektor, Achsneigung, Drehung Äquatorebene → Ekliptik. Reine Funktionen, keine Three.js-Typen. |
| `src/sim/frames.test.ts` | Tests dazu, inklusive der entarteten Fälle. |
| `src/data/bodies/mars-monde.ts` | Phobos, Deimos. |
| `src/data/bodies/jupiter-monde.ts` | Io, Europa, Ganymed, Kallisto. |
| `src/data/bodies/saturn-monde.ts` | Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Iapetus. |
| `src/data/bodies/uranus-monde.ts` | Miranda, Ariel, Umbriel, Titania, Oberon. |
| `src/data/bodies/neptun-monde.ts` | Triton. |
| `src/data/bodies/pluto-system.ts` | Pluto und Charon. |
| `src/data/bodies/zwergplaneten.ts` | Ceres, Eris, Haumea, Makemake. |
| `src/sim/monde.fixture.test.ts` | Fixture-Vergleich der Mondbahnen gegen JPL Horizons. |
| `src/sim/__fixtures__/monde-horizons.json` | Die abgerufenen Referenzpositionen. |
| `src/render/rings.ts` | Ringgeometrie, Ringmaterial, Aktualisierung pro Frame. |
| `src/render/rings.test.ts` | Geometriebauer und Phasenterm als reine Funktionen. |

**Geändert:**

| Datei | Änderung |
|---|---|
| `src/sim/types.ts` | `PhysicalData.pole`; `axialTiltDeg` entfällt. |
| `src/sim/orbit.ts:63-93` | `parentEquator` wird gerechnet statt abgelehnt. |
| `src/data/bodies/*.ts` (10 bestehende) | Pol statt Achsneigung. |
| `src/data/index.ts` | Sieben neue Importe. |
| `src/render/bodies.ts:88-94` | Ausrichtung aus dem Pol statt aus der Neigungsstärke. |
| `src/render/scene.ts` | Ringe verdrahten. |
| `src/render/labels.ts` | Zweite Schwelle für Mondbeschriftungen. |
| `src/ui/panels/BodyTree.tsx` | Einklappbare Mondgruppen, Sichtbarkeitskaskade. |
| `src/ui/i18n/de.ts` | 25 Namens- und Beschreibungsschlüssel, neue Szenentitel. |
| `src/data/scenes.ts` | Ausbau auf rund 18 Szenen. |
| `ASSETS.md` | Neue Texturen. |

---

## Task 1: Pol-Mathematik als reine Funktionen

Der Grundstein. Ohne diese Funktionen kann kein Mond und kein Ring korrekt stehen. Bewusst ein eigener Task ohne jede Datenänderung: Die Mathematik lässt sich gegen bekannte Winkel prüfen, bevor irgendein Datensatz davon abhängt.

**Files:**
- Create: `src/sim/frames.ts`
- Test: `src/sim/frames.test.ts`

**Interfaces:**
- Consumes: `Vec3` aus `src/sim/types.ts`
- Produces:
  - `EKLIPTIK_SCHIEFE_GRAD: number` (23.4392911)
  - `poleVector(raDeg: number, decDeg: number): Vec3` — Einheitsvektor der Nordpolrichtung in **ekliptikalen** Koordinaten J2000
  - `axialTiltDeg(pole: Vec3): number` — Winkel zwischen Pol und Ekliptiknormale, in Grad
  - `equatorToEcliptic(v: Vec3, pole: Vec3): Vec3` — dreht einen Vektor aus der Äquatorebene des Körpers (z = Pol) in die Ekliptik

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

```ts
import { describe, it, expect } from 'vitest';
import {
  EKLIPTIK_SCHIEFE_GRAD, poleVector, axialTiltDeg, equatorToEcliptic,
} from './frames';

describe('poleVector', () => {
  it('liefert für den Himmelsnordpol die um die Schiefe gekippte Ekliptiknormale', () => {
    // Rektaszension ist am Pol bedeutungslos; Deklination 90° ist der
    // Himmelsnordpol. In Ekliptikkoordinaten steht er um die Schiefe der
    // Ekliptik gekippt — das ist genau die Erdachsneigung.
    const p = poleVector(0, 90);
    const eps = (EKLIPTIK_SCHIEFE_GRAD * Math.PI) / 180;
    expect(p.x).toBeCloseTo(0, 12);
    expect(p.y).toBeCloseTo(Math.sin(eps), 12);
    expect(p.z).toBeCloseTo(Math.cos(eps), 12);
  });

  it('liefert stets einen Einheitsvektor', () => {
    for (const [ra, dec] of [[0, 90], [268.06, 64.5], [257.31, -15.18], [40.59, 83.54]]) {
      const p = poleVector(ra!, dec!);
      expect(Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2)).toBeCloseTo(1, 12);
    }
  });
});

describe('axialTiltDeg', () => {
  it('ist null für die Ekliptiknormale selbst', () => {
    expect(axialTiltDeg({ x: 0, y: 0, z: 1 })).toBeCloseTo(0, 12);
  });

  it('ergibt für den Erdpol die Schiefe der Ekliptik', () => {
    expect(axialTiltDeg(poleVector(0, 90))).toBeCloseTo(EKLIPTIK_SCHIEFE_GRAD, 6);
  });
});

describe('equatorToEcliptic', () => {
  it('ist die Identität, wenn der Pol die Ekliptiknormale ist', () => {
    // Der entartete Fall: Äquatorebene und Ekliptik fallen zusammen, es gibt
    // keinen Knoten. Die Drehung muss dann die Identität liefern statt durch
    // ein Kreuzprodukt der Länge null zu laufen.
    const v = { x: 3, y: -4, z: 5 };
    const r = equatorToEcliptic(v, { x: 0, y: 0, z: 1 });
    expect(r.x).toBeCloseTo(3, 12);
    expect(r.y).toBeCloseTo(-4, 12);
    expect(r.z).toBeCloseTo(5, 12);
  });

  it('bildet die Äquatornormale auf den Pol ab', () => {
    const pole = poleVector(268.06, 64.5);
    const r = equatorToEcliptic({ x: 0, y: 0, z: 1 }, pole);
    expect(r.x).toBeCloseTo(pole.x, 12);
    expect(r.y).toBeCloseTo(pole.y, 12);
    expect(r.z).toBeCloseTo(pole.z, 12);
  });

  it('erhält Längen und Winkel', () => {
    const pole = poleVector(40.59, 83.54);
    const a = equatorToEcliptic({ x: 1, y: 2, z: 3 }, pole);
    const b = equatorToEcliptic({ x: -2, y: 1, z: 0 }, pole);
    expect(Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2)).toBeCloseTo(Math.sqrt(14), 12);
    // Die beiden Ausgangsvektoren stehen senkrecht aufeinander (1*-2 + 2*1 + 0 = 0);
    // eine Drehung darf daran nichts ändern.
    expect(a.x * b.x + a.y * b.y + a.z * b.z).toBeCloseTo(0, 12);
  });

  it('legt die x-Achse in den aufsteigenden Knoten', () => {
    // Der Knoten ist die Schnittgerade von Äquator- und Ekliptikebene. Ein
    // Vektor entlang der lokalen x-Achse muss deshalb in der Ekliptikebene
    // liegen, also z = 0 haben.
    const pole = poleVector(268.06, 64.5);
    const r = equatorToEcliptic({ x: 1, y: 0, z: 0 }, pole);
    expect(r.z).toBeCloseTo(0, 12);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/frames.test.ts`
Erwartet: FAIL mit `Cannot find module './frames'`

- [ ] **Step 3: Implementierung schreiben**

```ts
import type { Vec3 } from './types';

/**
 * Schiefe der Ekliptik zur Epoche J2000 in Grad (IAU 2006, ε₀ = 23° 26′ 21,406″).
 * Die säkulare Änderung (rund 47″ pro Jahrhundert) bleibt außen vor: Sie liegt
 * über den Zeitraum, den diese Anwendung zeigt, weit unter der Genauigkeit der
 * verwendeten mittleren Bahnelemente.
 */
export const EKLIPTIK_SCHIEFE_GRAD = 23.4392911;

const GRAD = Math.PI / 180;
const EPS = EKLIPTIK_SCHIEFE_GRAD * GRAD;

/** Untergrenze, ab der zwei Richtungen als parallel gelten (siehe equatorToEcliptic). */
const PARALLEL_SCHWELLE = 1e-12;

/**
 * Nordpolrichtung eines Körpers als Einheitsvektor in **ekliptikalen**
 * Koordinaten J2000.
 *
 * Der IAU-Bericht gibt Pollagen in äquatorialen Koordinaten (Rektaszension,
 * Deklination) an; der gesamte Rest dieser Anwendung rechnet ekliptikal. Die
 * Umrechnung ist eine Drehung um die x-Achse (Frühlingspunkt) um die Schiefe
 * der Ekliptik.
 */
export function poleVector(raDeg: number, decDeg: number): Vec3 {
  const ra = raDeg * GRAD;
  const dec = decDeg * GRAD;
  const x = Math.cos(dec) * Math.cos(ra);
  const y = Math.cos(dec) * Math.sin(ra);
  const z = Math.sin(dec);
  return {
    x,
    y: y * Math.cos(EPS) + z * Math.sin(EPS),
    z: -y * Math.sin(EPS) + z * Math.cos(EPS),
  };
}

/** Achsneigung in Grad: der Winkel zwischen Pol und Ekliptiknormale. */
export function axialTiltDeg(pole: Vec3): number {
  const betrag = Math.sqrt(pole.x ** 2 + pole.y ** 2 + pole.z ** 2);
  const cos = Math.min(Math.max(pole.z / betrag, -1), 1);
  return Math.acos(cos) / GRAD;
}

/**
 * Dreht einen Vektor aus der Äquatorebene eines Körpers in die Ekliptik.
 *
 * Die lokale Basis: z zeigt zum Pol, x in den aufsteigenden Knoten (die
 * Schnittgerade von Äquator- und Ekliptikebene, als Kreuzprodukt aus
 * Ekliptiknormale und Pol), y vervollständigt das Rechtssystem.
 *
 * Fällt der Pol mit der Ekliptiknormale zusammen, gibt es keinen Knoten und
 * das Kreuzprodukt hat die Länge null. Dann sind beide Ebenen identisch und
 * die Drehung ist die Identität — dieser Zweig ist kein Sonderfall, sondern
 * die korrekte Antwort.
 */
export function equatorToEcliptic(v: Vec3, pole: Vec3): Vec3 {
  const pb = Math.sqrt(pole.x ** 2 + pole.y ** 2 + pole.z ** 2);
  const z = { x: pole.x / pb, y: pole.y / pb, z: pole.z / pb };

  // Kreuzprodukt (0,0,1) × z — die dritte Komponente ist konstruktionsbedingt null.
  const kx = -z.y;
  const ky = z.x;
  const kb = Math.sqrt(kx * kx + ky * ky);
  if (kb < PARALLEL_SCHWELLE) return { ...v };

  const x = { x: kx / kb, y: ky / kb, z: 0 };
  const y = {
    x: z.y * x.z - z.z * x.y,
    y: z.z * x.x - z.x * x.z,
    z: z.x * x.y - z.y * x.x,
  };

  return {
    x: x.x * v.x + y.x * v.y + z.x * v.z,
    y: x.y * v.x + y.y * v.y + z.y * v.z,
    z: x.z * v.x + y.z * v.y + z.z * v.z,
  };
}
```

- [ ] **Step 4: Tests prüfen**

Run: `npx vitest run src/sim/frames.test.ts && npm run lint && npx tsc --noEmit`
Erwartet: alle grün, kein Lint- und kein Typfehler.

- [ ] **Step 5: Commit**

```bash
git add src/sim/frames.ts src/sim/frames.test.ts
git commit -m "Pol-Mathematik für Äquatorebenen als reine Funktionen"
```

---

## Task 2: Der Pol als Datum im Katalog

`axialTiltDeg` verschwindet aus den Daten und wird zum abgeleiteten Wert. Das berührt alle zehn vorhandenen Körper — deshalb ein eigener Task, der nichts anderes tut.

**Files:**
- Modify: `src/sim/types.ts` (`PhysicalData`)
- Modify: `src/data/bodies/*.ts` (alle zehn)
- Modify: `src/sim/orbit.ts` (`rotationAt` bleibt, nutzt aber nichts aus dem Pol — nur prüfen, dass nichts bricht)
- Test: `src/sim/frames.test.ts` (erweitern), `src/data/index.test.ts` (erweitern)

**Interfaces:**
- Consumes: `poleVector`, `axialTiltDeg` aus Task 1
- Produces: `PhysicalData.pole: { raDeg: number; decDeg: number }`; `axialTiltDeg` ist **kein** Datenfeld mehr

**Kontrollrechnung — das Herzstück dieses Tasks.** Die Pollagen kommen aus dem IAU-Bericht (Archinal et al., *Report of the IAU Working Group on Cartographic Coordinates and Rotational Elements*). Ob ein abgerufener Wert richtig übernommen wurde, prüft die abgeleitete Achsneigung: Sie muss die bekannte Neigung des Körpers ergeben. Diese Tabelle ist der Test, nicht die Quelle:

| Körper | Pol RA / Dec (Ausgangswert) | Erwartete Achsneigung |
|---|---|---|
| Sonne | 286,13 / 63,87 | 7,25° |
| Merkur | 281,0103 / 61,4155 | 0,03° |
| Venus | 272,76 / 67,16 | 177,36° |
| Erde | 0,00 / 90,00 | 23,44° |
| Mond | 269,9949 / 66,5392 | 1,54° |
| Mars | 317,269 / 54,432 | 25,19° |
| Jupiter | 268,057 / 64,495 | 3,13° |
| Saturn | 40,589 / 83,537 | 26,73° |
| Uranus | 257,311 / −15,175 | 97,77° |
| Neptun | 299,36 / 43,46 | 28,32° |

Weicht eine abgeleitete Neigung um mehr als 0,05° ab, ist der Polwert falsch abgeschrieben — dann gilt die Quelle, und die erwartete Neigung wird aus einer zweiten unabhängigen Quelle geprüft, bevor irgendetwas angepasst wird.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

In `src/sim/frames.test.ts` anfügen:

```ts
import { bodies } from '../data/index';

describe('Pollagen des Katalogs', () => {
  // Die Kontrollrechnung aus dem Plan: Der Pol ist richtig übernommen,
  // wenn die daraus abgeleitete Achsneigung die bekannte Neigung ergibt.
  const ERWARTETE_NEIGUNG: Record<string, number> = {
    sun: 7.25, mercury: 0.03, venus: 177.36, earth: 23.44, moon: 1.54,
    mars: 25.19, jupiter: 3.13, saturn: 26.73, uranus: 97.77, neptune: 28.32,
  };

  it('liefert für jeden Körper die bekannte Achsneigung', () => {
    for (const body of bodies) {
      const erwartet = ERWARTETE_NEIGUNG[body.id];
      if (erwartet === undefined) continue;
      const ist = axialTiltDeg(poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg));
      expect(ist, `Achsneigung von ${body.id}`).toBeCloseTo(erwartet, 1);
    }
  });

  it('kennt für jeden Körper einen Pol', () => {
    for (const body of bodies) {
      expect(Number.isFinite(body.physical.pole.raDeg), body.id).toBe(true);
      expect(Number.isFinite(body.physical.pole.decDeg), body.id).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/frames.test.ts`
Erwartet: FAIL — `body.physical.pole` existiert noch nicht (Typfehler bzw. `undefined`).

- [ ] **Step 3: Den Typ ändern**

In `src/sim/types.ts`, `PhysicalData`: `axialTiltDeg` entfernen, dafür

```ts
  /**
   * Nordpolrichtung in äquatorialen Koordinaten J2000 (IAU-Bericht über
   * Rotationselemente). Aus ihr folgen Achsneigung, Ringebene und die
   * Bezugsebene der Monde — deshalb steht hier der Pol und nicht die
   * Neigung: Die Neigung sagt, wie stark die Achse steht, nicht wohin.
   */
  pole: { raDeg: number; decDeg: number };
```

- [ ] **Step 4: Die zehn Datensätze umstellen**

Je Körper `axialTiltDeg: X` ersetzen durch `pole: { raDeg: …, decDeg: … }` samt Quellenzeile im Kommentar. Beispiel `src/data/bodies/saturn.ts`:

```ts
    // Pollage aus dem IAU-Bericht über Rotationselemente (Archinal et al.).
    // Kontrollrechnung: Daraus folgt eine Achsneigung von 26,73° — der
    // bekannte Wert für Saturn, und zugleich die Neigung der Ringebene.
    pole: { raDeg: 40.589, decDeg: 83.537 },
```

- [ ] **Step 5: Tests laufen lassen**

Run: `npm test`
Erwartet: `frames.test.ts` grün. `src/sim/rotation.test.ts` und `src/render/bodies.ts` schlagen jetzt fehl, weil sie `axialTiltDeg` als Datenfeld lesen — das behebt Task 3. **Dieser Task endet noch nicht grün**; deshalb gehören Task 2 und Task 3 in dieselbe Sitzung oder Task 3 folgt unmittelbar.

- [ ] **Step 6: Noch nicht committen**

Erst nach Task 3, gemeinsam. Ein Commit mit rotem Testlauf widerspricht der Schrittregel.

---

## Task 3: Ausrichtung der Körper aus dem Pol

**Files:**
- Modify: `src/render/bodies.ts:88-94` (Rotationsblock in `update`)
- Modify: `src/sim/rotation.test.ts`
- Test: `src/render/bodies.test.ts` (erweitern)

**Interfaces:**
- Consumes: `poleVector` aus Task 1, `PhysicalData.pole` aus Task 2
- Produces: keine neue Signatur; `createBodyViews` verhält sich unverändert von außen

**Das Problem heute.** `render/bodies.ts` setzt die Kugel mit `rotation.set(Math.PI / 2, 0, 0)` aufrecht, kippt sie um `axialTiltDeg` um die x-Achse und dreht dann um die eigene Achse. Die Kipprichtung ist damit willkürlich die x-Achse. Solange nur die Kugel rotiert, sieht das plausibel aus; sobald Ringe und Monde in derselben Äquatorebene liegen, stünde das System verdreht zur Bahnebene der Monde.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

In `src/render/bodies.test.ts` anfügen:

```ts
import * as THREE from 'three';
import { poleAusrichtung } from './bodies';
import { poleVector } from '../sim/frames';

describe('poleAusrichtung', () => {
  it('richtet die lokale y-Achse der Kugel auf den Pol aus', () => {
    // Die SphereGeometry von Three hat ihre Pole auf der lokalen y-Achse.
    // Nach der Ausrichtung muss diese Achse in Weltkoordinaten genau in die
    // Polrichtung zeigen — sonst stehen Ringe und Mondbahnen schief zur Kugel.
    const pol = poleVector(40.589, 83.537);
    const q = poleAusrichtung(pol);
    const achse = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    expect(achse.x).toBeCloseTo(pol.x, 10);
    expect(achse.y).toBeCloseTo(pol.y, 10);
    expect(achse.z).toBeCloseTo(pol.z, 10);
  });

  it('stellt die Kugel bei Pol = Ekliptiknormale aufrecht', () => {
    const q = poleAusrichtung({ x: 0, y: 0, z: 1 });
    const achse = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    expect(achse.z).toBeCloseTo(1, 10);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/bodies.test.ts`
Erwartet: FAIL — `poleAusrichtung` ist nicht exportiert.

- [ ] **Step 3: Implementierung schreiben**

In `src/render/bodies.ts`:

```ts
import { poleVector } from '../sim/frames';

/**
 * Quaternion, das die lokale y-Achse der Kugelgeometrie (dort liegen ihre
 * Pole) auf die Polrichtung dreht. Ersetzt die frühere Kippung um die
 * x-Achse, die zwar den Betrag der Achsneigung traf, aber eine willkürliche
 * Richtung wählte — mit Ringen und Monden in derselben Ebene fällt das auf.
 */
export function poleAusrichtung(pole: Vec3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(pole.x, pole.y, pole.z).normalize(),
  );
}
```

und im Rotationsblock von `update`:

```ts
        // Ausrichtung: Pol zuerst, dann die Eigenrotation um genau diese Achse.
        const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
        mesh.quaternion.copy(poleAusrichtung(pol));
        mesh.rotateY(rotationAt(body, jd));
```

- [ ] **Step 4: `sim/rotation.test.ts` nachziehen**

Die Tests dort prüfen `rotationAt` (Phase, Periode, retrograde Drehung) — die bleibt unverändert. Nur der Testkörper in der Testdatei braucht statt `axialTiltDeg` ein `pole`-Feld. Der Block `describe('Bezugsebene parentEquator')` bleibt unangetastet; er ist erst in Task 4 dran.

- [ ] **Step 5: Vollständige Prüfung**

Run: `npm test && npm run lint && npx tsc --noEmit`
Erwartet: alles grün — auch die in Task 2 rot gewordenen Stellen.

- [ ] **Step 6: Sichtprüfung**

`npm run dev`, Saturn anfliegen: Die Achse muss sichtbar geneigt stehen, die Rotation um genau diese geneigte Achse laufen (nicht um die Bildschirmachse). Uranus prüfen: Er muss praktisch liegen.

- [ ] **Step 7: Commit (Task 2 und 3 gemeinsam)**

```bash
git add src/sim/types.ts src/sim/frames.test.ts src/data/bodies src/render/bodies.ts src/render/bodies.test.ts src/sim/rotation.test.ts
git commit -m "Planetenpol als Datum statt Achsneigung als Zahl"
```

---

## Task 4: Die Bezugsebene `parentEquator` rechnen

**Files:**
- Modify: `src/sim/orbit.ts:63-93` (`positionAt`)
- Test: `src/sim/rotation.test.ts` (Block `describe('Bezugsebene parentEquator')` umschreiben)

**Interfaces:**
- Consumes: `equatorToEcliptic`, `poleVector` aus Task 1; `PhysicalData.pole` aus Task 2
- Produces: keine neue Signatur — `positionAt(id, index, jd)` beherrscht ab jetzt beide Bezugsebenen

**Die Sperre entfällt nicht ersatzlos.** Ein Körper mit `parentEquator` ohne Mutterkörper muss weiterhin scheitern, statt still am falschen Ort zu rechnen. Nur der Grund ändert sich: vorher „noch nicht gebaut", jetzt „Datensatz unvollständig".

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`src/sim/rotation.test.ts`, den bestehenden Block ersetzen durch:

```ts
describe('Bezugsebene parentEquator', () => {
  /** Baut einen Mutterkörper mit gegebener Pollage und einen Trabanten darum. */
  function system(polRa: number, polDec: number, inklination: number): BodyIndex {
    const mutter: Body = {
      id: 'mutter', parent: null, kind: 'planet',
      orbit: null,
      physical: {
        radiusKm: 1000, massKg: 1e24, rotationPeriodH: 24,
        pole: { raDeg: polRa, decDeg: polDec }, rotationAtEpochDeg: 0,
      },
      appearance: { textures: { albedo: '' }, color: '#ffffff' },
      info: { nameKey: 'x', descriptionKey: 'x' },
    };
    const trabant: Body = {
      ...mutter,
      id: 'trabant', parent: 'mutter', kind: 'moon',
      orbit: {
        a: 0.001, aDot: 0, e: 0, eDot: 0,
        i: inklination, iDot: 0,
        L: 0, LDot: 1000, lp: 0, lpDot: 0, node: 0, nodeDot: 0,
        frame: 'parentEquator',
      },
    };
    return { mutter, trabant };
  }

  it('ist deckungsgleich mit "ecliptic", wenn der Pol die Ekliptiknormale ist', () => {
    // Pol = Ekliptiknormale heißt: Äquatorebene und Ekliptik fallen zusammen.
    // Dann muss die Drehung wirkungslos sein — sonst stimmt die Basiswahl nicht.
    const index = system(270, 90 - EKLIPTIK_SCHIEFE_GRAD, 0);
    const p = positionAt('trabant', index, J2000 + 3);
    expect(p.z).toBeCloseTo(0, 6);
  });

  it('legt eine ungeneigte Bahn in die Äquatorebene des Mutterkörpers', () => {
    // Bahnneigung 0 gegen den Äquator heißt: Die Bahnebene steht senkrecht
    // auf dem Pol. Geprüft wird genau das — das Skalarprodukt aus normiertem
    // Ortsvektor und Polrichtung muss über die ganze Bahn verschwinden.
    const index = system(268.057, 64.495, 0); // Jupiters Pollage
    const pol = poleVector(268.057, 64.495);
    for (const tage of [0, 1, 2, 5, 9]) {
      const p = positionAt('trabant', index, J2000 + tage);
      const betrag = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
      const skalar = (p.x * pol.x + p.y * pol.y + p.z * pol.z) / betrag;
      expect(skalar).toBeCloseTo(0, 9);
    }
  });

  it('hält den Bahnradius unverändert — die Drehung ist längentreu', () => {
    const index = system(268.057, 64.495, 12);
    const p = positionAt('trabant', index, J2000 + 4);
    const r = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
    expect(r).toBeCloseTo(0.001 * AU_KM, 3);
  });

  it('lehnt einen Datensatz ohne Mutterkörper ab, statt still falsch zu rechnen', () => {
    const index = system(268.057, 64.495, 0);
    const waise = { ...index['trabant']!, id: 'waise', parent: null };
    expect(() => positionAt('waise', { ...index, waise }, J2000))
      .toThrow(/parentEquator/);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/sim/rotation.test.ts`
Erwartet: FAIL — die alte Sperre wirft noch bei jedem `parentEquator`-Körper.

- [ ] **Step 3: Implementierung schreiben**

In `src/sim/orbit.ts` den Sperrblock und die Elternaddition ersetzen:

```ts
  const relativ = positionInParentFrame(body.orbit, jd);
  if (body.parent === null) {
    if (body.orbit.frame === 'parentEquator') {
      throw new Error(
        `Bezugsebene 'parentEquator' ohne Mutterkörper (Körper: ${id}). ` +
        `Die Ebene ist ohne den Pol eines Mutterkörpers nicht definiert.`,
      );
    }
    return relativ;
  }

  const mutter = index[body.parent];
  if (!mutter) throw new Error(`Unbekannter Mutterkörper: ${body.parent}`);

  // 'parentEquator': Die Elemente sind auf die Äquator- bzw. Laplace-Ebene des
  // Mutterkörpers bezogen — so gibt JPL die mittleren Elemente der Monde an.
  // Erst die Drehung in die Ekliptik macht sie mit allem anderen vergleichbar.
  const inEkliptik = body.orbit.frame === 'parentEquator'
    ? equatorToEcliptic(
      relativ,
      poleVector(mutter.physical.pole.raDeg, mutter.physical.pole.decDeg),
    )
    : relativ;

  const eltern = positionAt(body.parent, index, jd);
  return {
    x: eltern.x + inEkliptik.x,
    y: eltern.y + inEkliptik.y,
    z: eltern.z + inEkliptik.z,
  };
```

- [ ] **Step 4: Vollständige Prüfung**

Run: `npm test && npm run lint && npx tsc --noEmit`
Erwartet: alles grün; der Erdmond (`frame: 'ecliptic'`) ist unverändert, seine Fixture-Tests aus Phase 1 bleiben gültig.

- [ ] **Step 5: Commit**

```bash
git add src/sim/orbit.ts src/sim/rotation.test.ts
git commit -m "Bahnelemente in der Äquatorebene des Mutterkörpers rechnen"
```

---

## Task 5: Marsmonde — der erste Datensatz in der neuen Bezugsebene

Zwei Körper, bewusst als eigener Task: Hier zeigt sich, ob Bezugsebene, Maßstab und Darstellung zusammenspielen. Die 18 weiteren Monde sind danach Fleißarbeit nach demselben Muster.

**Files:**
- Create: `src/data/bodies/mars-monde.ts`
- Modify: `src/data/index.ts`, `src/ui/i18n/de.ts`
- Test: `src/data/index.test.ts`

**Interfaces:**
- Consumes: `Body` aus `src/sim/types.ts`
- Produces: `export const marsMonde: readonly Body[]` mit den IDs `phobos`, `deimos`

**Quelle:** JPL Solar System Dynamics, „Planetary Satellite Mean Elements" (<https://ssd.jpl.nasa.gov/sats/elem/>), Tabelle für das Marssystem. Sie gibt `a` in Kilometern, `e`, `i` gegen die Laplace-Ebene, Knoten, Periapsis, mittlere Länge, die Umlaufzeit in Tagen sowie die Pollage der Laplace-Ebene. Umrechnung für den Datensatz: `a_AE = a_km / 149597870.7`, `LDot = 36525 / periode_tage * 360`.

**Kontrollrechnung (Pflichtkommentar im Datensatz):**

| Mond | Bahnradius | Umlaufzeit | Erwartete Besonderheit |
|---|---|---|---|
| Phobos | ≈ 9376 km | ≈ 0,3189 d | Umläuft Mars schneller, als Mars rotiert (24,6 h) |
| Deimos | ≈ 23 463 km | ≈ 1,2624 d | Knapp außerhalb der synchronen Bahn |

Beide Bahnen liegen nahezu in der Marsäquatorebene (i < 2°) — genau der Fall, für den `parentEquator` gebaut ist. Phobos' Bahnradius ist kleiner als der 2,8-fache Marsradius; bei `sizeScale` 200 (Preset „Kompakt") liegt er damit **innerhalb** der dargestellten Marskugel. Das ist kein Fehler, sondern die bekannte Folge der Größenüberhöhung — es gehört als Kommentar in den Datensatz, damit es später niemand „korrigiert".

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

In `src/data/index.test.ts` anfügen:

```ts
describe('Katalog-Invarianten', () => {
  it('hat eindeutige IDs', () => {
    const ids = bodies.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('verweist nur auf existierende Mutterkörper', () => {
    for (const body of bodies) {
      if (body.parent === null) continue;
      expect(bodyIndex[body.parent], `Mutterkörper von ${body.id}`).toBeDefined();
    }
  });

  it('nutzt parentEquator nur, wo der Mutterkörper einen Pol hat', () => {
    for (const body of bodies) {
      if (body.orbit?.frame !== 'parentEquator') continue;
      const mutter = body.parent === null ? undefined : bodyIndex[body.parent];
      expect(mutter?.physical.pole, `Pol des Mutterkörpers von ${body.id}`).toBeDefined();
    }
  });

  it('kennt für jeden Körper einen Namensschlüssel mit hinterlegtem Text', () => {
    for (const body of bodies) {
      expect(t(body.info.nameKey), body.id).not.toBe(body.info.nameKey);
    }
  });

  it('führt Phobos und Deimos in der Marsäquatorebene', () => {
    for (const id of ['phobos', 'deimos']) {
      const mond = bodyIndex[id];
      expect(mond?.parent).toBe('mars');
      expect(mond?.orbit?.frame).toBe('parentEquator');
      expect(mond?.orbit?.i ?? 99).toBeLessThan(2);
    }
  });

  it('trifft die bekannten Bahnradien der Marsmonde', () => {
    // Kontrollrechnung der Quelle: große Halbachse zurück in Kilometer.
    expect((bodyIndex['phobos']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(9376, -2);
    expect((bodyIndex['deimos']?.orbit?.a ?? 0) * AU_KM).toBeCloseTo(23463, -2);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/data/index.test.ts`
Erwartet: FAIL — `phobos` ist unbekannt.

- [ ] **Step 3: Werte abrufen**

Die Tabelle des Marssystems von <https://ssd.jpl.nasa.gov/sats/elem/> abrufen. Notiert werden alle Elemente, die Umlaufzeit, die Pollage der Laplace-Ebene sowie Abrufdatum und Epoche der Tabelle. Radius und Masse aus dem zugehörigen NASA-Fact-Sheet, Pollagen von Phobos und Deimos aus dem IAU-Bericht (beide rotieren gebunden).

- [ ] **Step 4: Datensatz schreiben**

`src/data/bodies/mars-monde.ts` nach dem Muster von `moon.ts`: Quellenblock als Kommentar oben (URL, Abrufdatum, Epoche), darunter je Mond ein vollständiger `Body`. Danach `src/data/index.ts` um den Import erweitern und `ui/i18n/de.ts` um `body.phobos.name`, `body.phobos.description`, `body.deimos.name`, `body.deimos.description`.

- [ ] **Step 5: Tests prüfen**

Run: `npm test && npm run lint && npx tsc --noEmit`
Erwartet: alles grün.

- [ ] **Step 6: Sichtprüfung**

`npm run dev`, Preset „Schaubild", Kamera auf Mars heften, Zeitraffer rund 1 Tag/s: Phobos muss sichtbar schneller umlaufen als Deimos, beide nahezu in derselben Ebene — und diese Ebene muss zur Marsachse passen, nicht zur Ekliptik.

- [ ] **Step 7: Commit**

```bash
git add src/data/bodies/mars-monde.ts src/data/index.ts src/data/index.test.ts src/ui/i18n/de.ts
git commit -m "Phobos und Deimos als erste Monde in der Äquatorebene"
```

---

## Task 6: Fixture-Nachweis der Mondbahnen

**Files:**
- Create: `src/sim/__fixtures__/monde-horizons.json`, `src/sim/monde.fixture.test.ts`
- Modify: `src/sim/__fixtures__/README.md`

**Interfaces:**
- Consumes: `positionAt` aus `src/sim/orbit.ts`, `bodyIndex` aus `src/data/index.ts`
- Produces: keine — reiner Nachweis

**Schranken (Spec, Abschnitt 8).** Streng ist, was man im Bild sieht; locker ist die Phase:

| Größe | Schranke | Begründung |
|---|---|---|
| Bahnradius | 1 % | Ein falscher Radius fällt sofort auf |
| Lage der Bahnebene | 0,5° | Bestimmt, wie das System im Raum steht |
| Umlaufzeit | 0,1 % | Sonst über lange Zeiträume sichtbarer Versatz |
| Position entlang der Bahn | 5 % des Bahnumfangs | Mittlere Elemente kennen die großen Störungen nicht — Laplace-Resonanz bei Io/Europa/Ganymed, wandernde Bahnebene bei Iapetus. Bewusste Entscheidung der Spec, keine Nachlässigkeit. |

- [ ] **Step 1: Referenzdaten abrufen**

Aus JPL Horizons je Mond Vektoren relativ zum Mutterkörper zu fünf Epochen: 1976-01-01, 2000-01-01, 2026-01-01, 2050-01-01, 2076-01-01. Abgelegt als JSON im Format der bestehenden `horizons.json`, mit Abrufdatum und der genauen Anfrage im README. **Klemmt der Dienst, endet der Task hier** mit einem Vermerk; die Datensätze der folgenden Tasks hängen nicht daran.

- [ ] **Step 2: Den Test schreiben**

```ts
import { describe, it, expect } from 'vitest';
import fixture from './__fixtures__/monde-horizons.json';
import { positionAt } from './orbit';
import { bodyIndex } from '../data/index';
import type { Vec3 } from './types';

/** Relativvektor Mond → Mutterkörper, in km. */
function relativ(id: string, jd: number): Vec3 {
  const mond = bodyIndex[id]!;
  const p = positionAt(id, bodyIndex, jd);
  const m = positionAt(mond.parent!, bodyIndex, jd);
  return { x: p.x - m.x, y: p.y - m.y, z: p.z - m.z };
}

const betrag = (v: Vec3): number => Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);

describe('Mondbahnen gegen JPL Horizons', () => {
  it.each(fixture.eintraege)('$id bei JD $jd: Bahnradius auf 1 %', ({ id, jd, soll }) => {
    const ist = betrag(relativ(id, jd));
    expect(Math.abs(ist - betrag(soll)) / betrag(soll)).toBeLessThan(0.01);
  });

  it.each(fixture.eintraege)('$id bei JD $jd: Bahnebene auf 0,5°', ({ id, jd, soll }) => {
    // Geprüft wird die Lage der Ebene, nicht die Stelle auf der Bahn: der
    // Winkel zwischen Ist-Vektor und der Soll-Bahnebene.
    const ist = relativ(id, jd);
    const n = betrag(ist) * betrag(soll);
    const sinus = Math.abs(ist.x * soll.y - ist.y * soll.x) / n;
    expect((Math.asin(Math.min(sinus, 1)) * 180) / Math.PI).toBeLessThan(0.5);
  });

  it.each(fixture.eintraege)('$id bei JD $jd: Position auf 5 % des Bahnumfangs', ({ id, jd, soll }) => {
    // Die bewusst lockere Schranke: Mittlere Bahnelemente kennen die großen
    // Störungen nicht. Die Simulation zeigt Monde bei sizeScale 50 ohnehin
    // überhöht — wenige Grad Phasenversatz sieht niemand, einen falschen
    // Bahnradius sofort.
    const ist = relativ(id, jd);
    const abstand = betrag({ x: ist.x - soll.x, y: ist.y - soll.y, z: ist.z - soll.z });
    expect(abstand).toBeLessThan(0.05 * 2 * Math.PI * betrag(soll));
  });
});
```

- [ ] **Step 3: Test laufen lassen**

Run: `npx vitest run src/sim/monde.fixture.test.ts`
Erwartet: grün für Phobos und Deimos (mehr Monde gibt es noch nicht). Schlägt etwas fehl, ist der Datensatz falsch übernommen — **nicht** die Schranke aufweichen.

- [ ] **Step 4: Commit**

```bash
git add src/sim/monde.fixture.test.ts src/sim/__fixtures__/
git commit -m "Fixture-Nachweis für Mondbahnen gegen JPL Horizons"
```

---

## Tasks 7 bis 10: die übrigen Mondsysteme und die Zwergplaneten

Vier Tasks nach exakt dem Ablauf von Task 5, jeder für sich abgeschlossen und committet:

1. Invariantentest in `src/data/index.test.ts` um die neuen IDs erweitern (Bahnradius, Bezugsebene, Namensschlüssel), dazu den jeweils genannten Sondertest.
2. Werte aus <https://ssd.jpl.nasa.gov/sats/elem/> (Monde) bzw. der JPL Small-Body Database (Zwergplaneten) abrufen; Radius, Masse und Rotation aus dem NASA-Fact-Sheet, Pollage aus dem IAU-Bericht.
3. Datei anlegen mit Quellenblock, Kontrollrechnung im Kommentar und vollständigen `Body`-Datensätzen.
4. `src/data/index.ts` und `src/ui/i18n/de.ts` ergänzen.
5. `npm test && npm run lint && npx tsc --noEmit`.
6. Fixture aus Task 6 um die neuen Körper erweitern und erneut laufen lassen.
7. Sichtprüfung, dann Commit.

### Task 7: Jupitermonde

Datei `src/data/bodies/jupiter-monde.ts`, IDs `io`, `europa`, `ganymede`, `callisto`, alle `frame: 'parentEquator'`.

| Mond | Bahnradius | Umlaufzeit | Kontrollpunkt |
|---|---|---|---|
| Io | ≈ 421 800 km | ≈ 1,769 d | |
| Europa | ≈ 671 100 km | ≈ 3,551 d | rund 2 × Io |
| Ganymed | ≈ 1 070 400 km | ≈ 7,155 d | rund 4 × Io; Radius 2634 km, größer als Merkur |
| Kallisto | ≈ 1 882 700 km | ≈ 16,689 d | außerhalb der Resonanz |

**Sondertest — die Laplace-Resonanz.** Die Umlaufzeiten von Io, Europa und Ganymed stehen wie 1:2:4. Das ist die Eigenschaft, die die Szene „Galileisches Schattenspiel" später zeigt, und zugleich der beste Nachweis, dass die drei Datensätze zueinander passen:

```ts
it('hält die Laplace-Resonanz 1:2:4 von Io, Europa und Ganymed', () => {
  // LDot ist die mittlere Länge in Grad je julianischem Jahrhundert;
  // die Umlaufzeit in Tagen ist 36525 / (LDot / 360).
  const periode = (id: string): number => 36525 / ((bodyIndex[id]?.orbit?.LDot ?? 0) / 360);
  expect(periode('europa') / periode('io')).toBeCloseTo(2, 1);
  expect(periode('ganymede') / periode('io')).toBeCloseTo(4, 1);
});
```

Commit: `git commit -m "Die vier Galileischen Monde"`

### Task 8: Saturnmonde

Datei `src/data/bodies/saturn-monde.ts`, IDs `mimas`, `enceladus`, `tethys`, `dione`, `rhea`, `titan`, `iapetus`.

| Mond | Bahnradius | Umlaufzeit | Kontrollpunkt |
|---|---|---|---|
| Mimas | ≈ 185 540 km | ≈ 0,942 d | knapp außerhalb des A-Rings |
| Enceladus | ≈ 238 040 km | ≈ 1,370 d | Albedo nahe 1 — hellster Körper des Sonnensystems |
| Tethys | ≈ 294 670 km | ≈ 1,888 d | |
| Dione | ≈ 377 420 km | ≈ 2,737 d | |
| Rhea | ≈ 527 070 km | ≈ 4,518 d | |
| Titan | ≈ 1 221 870 km | ≈ 15,945 d | Radius 2575 km |
| Iapetus | ≈ 3 560 800 km | ≈ 79,32 d | Bahnneigung rund 15° gegen die Laplace-Ebene |

**Sondertest — Mimas und die Ringe.** Mimas' Bahnradius muss größer sein als der Außenradius des Saturnrings aus `appearance.rings.outerKm` (Task 12 setzt den Wert; bis dahin der Literalwert aus derselben Quelle). Das ist der Test, der später beweist, dass Ring und Mondbahn im selben Maßstab und derselben Ebene liegen:

```ts
it('hält Mimas außerhalb des Ringsystems', () => {
  const ringAussen = bodyIndex['saturn']?.appearance.rings?.outerKm ?? 0;
  expect(ringAussen).toBeGreaterThan(0);
  expect((bodyIndex['mimas']?.orbit?.a ?? 0) * AU_KM).toBeGreaterThan(ringAussen);
});
```

Commit: `git commit -m "Sieben Saturnmonde"`

### Task 9: Uranusmonde und Triton

Dateien `src/data/bodies/uranus-monde.ts` (IDs `miranda`, `ariel`, `umbriel`, `titania`, `oberon`) und `src/data/bodies/neptun-monde.ts` (ID `triton`).

| Mond | Bahnradius | Umlaufzeit | Kontrollpunkt |
|---|---|---|---|
| Miranda | ≈ 129 900 km | ≈ 1,413 d | |
| Ariel | ≈ 190 900 km | ≈ 2,520 d | |
| Umbriel | ≈ 266 000 km | ≈ 4,144 d | |
| Titania | ≈ 436 300 km | ≈ 8,706 d | |
| Oberon | ≈ 583 500 km | ≈ 13,463 d | |
| Triton | ≈ 354 800 km | ≈ 5,877 d | **retrograd** — `LDot` ist negativ |

**Sondertest 1 — der liegende Uranus.** Seine Monde laufen in seiner Äquatorebene, und die steht fast senkrecht auf der Ekliptik. Der Nachweis ist derselbe wie in Task 4, nur mit echten Daten:

```ts
it('lässt die Uranusmonde in der Äquatorebene ihres Planeten laufen', () => {
  const pol = poleVector(
    bodyIndex['uranus']!.physical.pole.raDeg,
    bodyIndex['uranus']!.physical.pole.decDeg,
  );
  for (const id of ['miranda', 'ariel', 'umbriel', 'titania', 'oberon']) {
    const p = positionAt(id, bodyIndex, J2000 + 2);
    const u = positionAt('uranus', bodyIndex, J2000 + 2);
    const r = { x: p.x - u.x, y: p.y - u.y, z: p.z - u.z };
    const betrag = Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2);
    const skalar = (r.x * pol.x + r.y * pol.y + r.z * pol.z) / betrag;
    // Bahnneigungen gegen die Laplace-Ebene liegen unter 5°, also |cos| < 0,09.
    expect(Math.abs(skalar), id).toBeLessThan(0.09);
  }
});
```

**Sondertest 2 — Tritons Rücklauf.** Über zwei Stützstellen muss der Relativvektor um den Neptunpol im mathematisch negativen Sinn wandern:

```ts
it('lässt Triton retrograd umlaufen', () => {
  const pol = poleVector(
    bodyIndex['neptune']!.physical.pole.raDeg,
    bodyIndex['neptune']!.physical.pole.decDeg,
  );
  const rel = (jd: number) => {
    const p = positionAt('triton', bodyIndex, jd);
    const n = positionAt('neptune', bodyIndex, jd);
    return { x: p.x - n.x, y: p.y - n.y, z: p.z - n.z };
  };
  const a = rel(J2000);
  const b = rel(J2000 + 0.5);
  // Das Kreuzprodukt a × b zeigt in Umlaufrichtung; bei retrogradem Lauf
  // steht es dem Pol entgegen.
  const kreuz = {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
  expect(kreuz.x * pol.x + kreuz.y * pol.y + kreuz.z * pol.z).toBeLessThan(0);
});
```

Commit: `git commit -m "Uranusmonde und der rückläufige Triton"`

### Task 10: Pluto-System und Zwergplaneten

Dateien `src/data/bodies/pluto-system.ts` (IDs `pluto`, `charon`) und `src/data/bodies/zwergplaneten.ts` (IDs `ceres`, `eris`, `haumea`, `makemake`).

Pluto und die vier übrigen Zwergplaneten: `kind: 'dwarf'`, `parent: 'sun'`, `frame: 'ecliptic'`, Elemente aus der JPL Small-Body Database. Charon: `kind: 'moon'`, `parent: 'pluto'`, `frame: 'parentEquator'`.

| Körper | Große Halbachse | Umlaufzeit | Kontrollpunkt |
|---|---|---|---|
| Ceres | ≈ 2,77 AE | ≈ 4,60 a | im Asteroidengürtel |
| Pluto | ≈ 39,48 AE | ≈ 248 a | e = 0,2488, Neigung 17,16° |
| Haumea | ≈ 43,1 AE | ≈ 283 a | |
| Makemake | ≈ 45,4 AE | ≈ 306 a | |
| Eris | ≈ 67,8 AE | ≈ 559 a | e = 0,44; Aphel rund 97 AE |
| Charon | ≈ 19 591 km | ≈ 6,387 d | gebunden — gleiche Periode wie Plutos Rotation |

**Sondertest — Plutos Perihel liegt innerhalb der Neptunbahn:**

```ts
it('führt Pluto im Perihel innerhalb der Neptunbahn', () => {
  // a(1-e) ≈ 29,7 AE gegen Neptuns 30,07 AE. Der Test belegt zugleich, dass
  // Halbachse und Exzentrizität zueinander passen.
  const p = bodyIndex['pluto']!.orbit!;
  const perihel = p.a * (1 - p.e);
  expect(perihel).toBeLessThan(bodyIndex['neptune']!.orbit!.a);
  expect(perihel).toBeGreaterThan(29);
});
```

**Ein Punkt, der eigens geprüft wird: Eris sprengt den bisherigen Bildausschnitt.** Bei Preset „Realistisch" steht sie im Aphel rund dreimal so weit draußen wie Neptun. Die Systemschau-Szene (`distanceBasis: 'systemRadius'`, siehe `render/camera/cinema.ts`) bezieht sich auf den äußersten Körper — das ist nach diesem Task nicht mehr Neptun. Die Sichtprüfung umfasst deshalb ausdrücklich die Systemschau: Sie darf nicht auf einen nahezu leeren Bildausschnitt herauszoomen. Fällt sie unbrauchbar aus, wird `systemRadius` auf den äußersten **Planeten** statt den äußersten Körper bezogen — mit Kommentar, warum.

Commit: `git commit -m "Pluto, Charon und vier Zwergplaneten"`

---

## Task 11: Texturen beschaffen und belegen

**Files:**
- Create: `public/textures/<id>/albedo.jpg` (neue Dateien)
- Modify: `ASSETS.md`, betroffene Datensätze (Texturpfad)

- [ ] **Step 1: Bestand klären**

Solar System Scope (CC BY 4.0, bereits belegte Quelle) liefert Pluto, Ceres, Eris, Haumea, Makemake sowie die Ringtexturen für Saturn und Uranus. Für die großen Monde kommen USGS-Astrogeology- oder NASA-Karten infrage (gemeinfrei): Io, Europa, Ganymed, Kallisto, Titan, Enceladus, Rhea, Dione, Tethys, Iapetus, Triton, Charon, Phobos, Deimos.

- [ ] **Step 2: Herunterladen in 1k**

Monde und Zwergplaneten in 1024 × 512 statt der 2048 × 1024 der Planeten — sie sind selten formatfüllend zu sehen, das spart rund zwei Drittel. Ablage unter `public/textures/<id>/albedo.jpg`, Dateiname wie bisher.

- [ ] **Step 3: `ASSETS.md` ergänzen**

Je Datei eine Zeile mit Quelle (URL), Urheber, Lizenz, Maßen, Größe in Bytes und Bearbeitungsvermerk, im Format der bestehenden Tabelle. Für gemeinfreie NASA/USGS-Karten tritt an die Stelle der CC-BY-Zeile der Gemeinfreiheitsvermerk mit Verweis auf die Medienrichtlinie der NASA. Neue Quelle heißt: neuer Abschnitt in `ASSETS.md`, nicht eine Zeile in der falschen Tabelle.

- [ ] **Step 4: Lücken dokumentieren**

Findet sich für einen Körper keine brauchbare freie Karte (erwartet bei Mimas, Miranda, Umbriel), bleibt `textures.albedo` leer und `ASSETS.md` vermerkt die Lücke ausdrücklich. Die Ausweichfarbe trägt den Körper dann vollständig.

- [ ] **Step 5: Test — kein toter Texturpfad**

```ts
it('verweist nur auf vorhandene Texturdateien', async () => {
  // Ein Tippfehler im Pfad fiele sonst erst im Browser auf, und dort nur
  // als stumm bleibende Ausweichfarbe (siehe ladeAlbedo in render/bodies.ts).
  const { existsSync } = await import('node:fs');
  for (const body of bodies) {
    const pfad = body.appearance.textures.albedo;
    if (pfad === '') continue;
    expect(existsSync(`public/${pfad}`), `${body.id}: ${pfad}`).toBe(true);
  }
});
```

- [ ] **Step 6: Sichtprüfung und Commit**

Jeden texturierten Körper einmal anfliegen: Die Textur muss ohne Nahtversatz an den Polen sitzen.

```bash
git add public/textures ASSETS.md src/data/bodies src/data/index.test.ts
git commit -m "Texturen für Monde und Zwergplaneten samt Herkunftsnachweis"
```

---

## Task 12: Ringgeometrie als reine Funktion

Die Geometrie zuerst, ohne Material und ohne Szene: Sie ist vollständig rechnerisch prüfbar, das Material danach ist Sichtprüfung.

**Files:**
- Create: `src/render/rings.ts` (nur der Geometrieteil), `src/render/rings.test.ts`
- Modify: `src/data/bodies/saturn.ts`, `src/data/bodies/uranus.ts` (Feld `rings` füllen)

**Interfaces:**
- Consumes: `kmToUnits` aus `src/render/units.ts`, `poleVector` aus `src/sim/frames.ts`
- Produces:
  - `ringGeometrieDaten(innenUnits: number, aussenUnits: number, segmente: number): { positions: Float32Array; uvs: Float32Array; indices: Uint16Array }`
  - `ringAusrichtung(pole: Vec3): THREE.Quaternion`

**Warum nicht `THREE.RingGeometry`.** Deren UV-Belegung bildet die Ringfläche auf ein Quadrat ab, als wäre sie eine Scheibe im Bild. Ringtexturen sind aber radiale Streifen: eine Bildzeile, die von der Innen- zur Außenkante läuft. Gebraucht wird `u = (r − innen) / (außen − innen)` und `v` konstant — genau das leistet die eigene Funktion.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

```ts
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { ringGeometrieDaten, ringAusrichtung } from './rings';
import { poleVector } from '../sim/frames';

describe('ringGeometrieDaten', () => {
  const daten = ringGeometrieDaten(2, 5, 64);

  it('legt zwei Punkte je Segmentgrenze an — innen und außen', () => {
    expect(daten.positions.length / 3).toBe(2 * (64 + 1));
  });

  it('hält alle Punkte in der lokalen xy-Ebene', () => {
    for (let i = 2; i < daten.positions.length; i += 3) {
      expect(daten.positions[i]).toBe(0);
    }
  });

  it('trifft Innen- und Außenradius genau', () => {
    for (let i = 0; i < daten.positions.length; i += 6) {
      const rInnen = Math.hypot(daten.positions[i]!, daten.positions[i + 1]!);
      const rAussen = Math.hypot(daten.positions[i + 3]!, daten.positions[i + 4]!);
      expect(rInnen).toBeCloseTo(2, 10);
      expect(rAussen).toBeCloseTo(5, 10);
    }
  });

  it('legt u radial: 0 an der Innenkante, 1 an der Außenkante', () => {
    for (let i = 0; i < daten.uvs.length; i += 4) {
      expect(daten.uvs[i]).toBeCloseTo(0, 10);
      expect(daten.uvs[i + 2]).toBeCloseTo(1, 10);
    }
  });

  it('bildet je Segment zwei Dreiecke', () => {
    expect(daten.indices.length).toBe(64 * 6);
  });
});

describe('ringAusrichtung', () => {
  it('stellt die Ringebene senkrecht auf den Pol', () => {
    const pol = poleVector(40.589, 83.537); // Saturn
    const normale = new THREE.Vector3(0, 0, 1).applyQuaternion(ringAusrichtung(pol));
    expect(normale.x).toBeCloseTo(pol.x, 10);
    expect(normale.y).toBeCloseTo(pol.y, 10);
    expect(normale.z).toBeCloseTo(pol.z, 10);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/rings.test.ts`
Erwartet: FAIL — `Cannot find module './rings'`

- [ ] **Step 3: Implementierung schreiben**

```ts
import * as THREE from 'three';
import type { Vec3 } from '../sim/types';

/**
 * Stützpunkte einer Ringscheibe in der lokalen xy-Ebene.
 *
 * Bewusst nicht THREE.RingGeometry: Deren UV-Belegung bildet die Fläche auf
 * ein Quadrat ab. Ringtexturen sind aber radiale Streifen — eine Bildzeile
 * von der Innen- zur Außenkante. Gebraucht wird deshalb u = (r - innen) /
 * (außen - innen), v spielt keine Rolle.
 */
export function ringGeometrieDaten(
  innenUnits: number, aussenUnits: number, segmente: number,
): { positions: Float32Array; uvs: Float32Array; indices: Uint16Array } {
  const punkte = segmente + 1;
  const positions = new Float32Array(punkte * 2 * 3);
  const uvs = new Float32Array(punkte * 2 * 2);
  const indices = new Uint16Array(segmente * 6);

  for (let s = 0; s < punkte; s++) {
    const winkel = (s / segmente) * Math.PI * 2;
    const cos = Math.cos(winkel);
    const sin = Math.sin(winkel);
    const p = s * 6;
    positions[p] = cos * innenUnits;
    positions[p + 1] = sin * innenUnits;
    positions[p + 2] = 0;
    positions[p + 3] = cos * aussenUnits;
    positions[p + 4] = sin * aussenUnits;
    positions[p + 5] = 0;

    const u = s * 4;
    uvs[u] = 0; uvs[u + 1] = 0;
    uvs[u + 2] = 1; uvs[u + 3] = 0;
  }

  for (let s = 0; s < segmente; s++) {
    const i = s * 6;
    const a = s * 2;
    indices[i] = a; indices[i + 1] = a + 1; indices[i + 2] = a + 2;
    indices[i + 3] = a + 1; indices[i + 4] = a + 3; indices[i + 5] = a + 2;
  }

  return { positions, uvs, indices };
}

/** Dreht die lokale Ringnormale (z) auf die Polrichtung des Planeten. */
export function ringAusrichtung(pole: Vec3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(pole.x, pole.y, pole.z).normalize(),
  );
}
```

- [ ] **Step 4: Ringdaten in den Katalog eintragen**

`appearance.rings` bei Saturn und Uranus füllen (Innen- und Außenradius in km aus dem NASA-Fact-Sheet, Texturpfad). Kontrollwerte: Saturns Hauptringsystem reicht rund von 74 500 km (D/C-Ring-Innenkante) bis 140 200 km (A-Ring-Außenkante), also etwa vom 1,24- bis zum 2,33-fachen Saturnradius. Der Uranusring ist mit rund 38 000 bis 51 000 km deutlich schmaler und sehr dunkel.

- [ ] **Step 5: Tests prüfen und committen**

Run: `npm test && npm run lint && npx tsc --noEmit`

```bash
git add src/render/rings.ts src/render/rings.test.ts src/data/bodies/saturn.ts src/data/bodies/uranus.ts
git commit -m "Ringgeometrie mit radialer UV-Belegung"
```

---

## Task 13: Ringmaterial mit Vorwärtsstreuung

**Files:**
- Modify: `src/render/rings.ts` (Material und `createRingViews`), `src/render/rings.test.ts`
- Modify: `src/render/scene.ts` (Verdrahtung)

**Interfaces:**
- Consumes: `bodyLighting` aus `src/render/lighting.ts`, `ringGeometrieDaten`/`ringAusrichtung` aus Task 12
- Produces:
  - `vorwaertsstreuung(cosWinkel: number, staerke: number, schaerfe: number): number`
  - `createRingViews(scene: THREE.Scene): RingViews` mit `update(jd, s, cameraKm, visible, licht, sonneRender)`

**Die drei Terme.** Direktlicht als Betrag von `N·L` (beidseitig — eine Ringfläche hat keine „Rückseite"), mal dem Tagniveau aus `lighting.ts`. Dazu die Nachtseitenfüllung, damit die sonnenabgewandte Fläche lesbar bleibt. Und die Vorwärtsstreuung: Steht die Sonne hinter den Ringen, leuchten die dichten Bänder auf.

`vorwaertsstreuung` ist bewusst eine eigene, exportierte TypeScript-Funktion **und** eine Zeile GLSL. Der Shader ist nicht testbar, die Kennlinie schon — und sie ist der Teil, der falsch sein kann.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

```ts
describe('vorwaertsstreuung', () => {
  it('ist maximal, wenn die Sonne genau hinter den Ringen steht', () => {
    // cos = -1: Blickrichtung und Richtung zur Sonne sind entgegengesetzt,
    // das Licht kommt also durch die Ringe auf die Kamera zu.
    expect(vorwaertsstreuung(-1, 0.8, 8)).toBeCloseTo(0.8, 12);
  });

  it('verschwindet, sobald die Sonne vor den Ringen steht', () => {
    expect(vorwaertsstreuung(0, 0.8, 8)).toBe(0);
    expect(vorwaertsstreuung(0.5, 0.8, 8)).toBe(0);
    expect(vorwaertsstreuung(1, 0.8, 8)).toBe(0);
  });

  it('wächst monoton zum Gegenlicht hin', () => {
    const werte = [-0.2, -0.5, -0.8, -1].map((c) => vorwaertsstreuung(c, 1, 8));
    for (let i = 1; i < werte.length; i++) {
      expect(werte[i]!).toBeGreaterThan(werte[i - 1]!);
    }
  });

  it('bündelt den Effekt mit steigender Schärfe enger', () => {
    // Bei halbem Gegenlicht muss ein schärferer Exponent weniger übrig lassen.
    expect(vorwaertsstreuung(-0.5, 1, 16)).toBeLessThan(vorwaertsstreuung(-0.5, 1, 4));
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/render/rings.test.ts`
Erwartet: FAIL — `vorwaertsstreuung` ist nicht exportiert.

- [ ] **Step 3: Die Kennlinie implementieren**

```ts
/**
 * Vorwärtsstreuung der Ringpartikel.
 *
 * `cosWinkel` ist das Skalarprodukt aus Blickrichtung (Fragment → Kamera)
 * und Lichtrichtung (Fragment → Sonne). Stehen beide entgegengesetzt
 * (cos = -1), steht die Sonne hinter den Ringen und leuchtet durch sie
 * hindurch — der Effekt, den die Cassini-Aufnahmen bekannt gemacht haben.
 * Steht die Sonne vor den Ringen, gibt es nichts zu durchleuchten; der Term
 * ist dann exakt null und nicht etwa schwach positiv.
 */
export function vorwaertsstreuung(cosWinkel: number, staerke: number, schaerfe: number): number {
  return staerke * Math.pow(Math.max(0, -cosWinkel), schaerfe);
}
```

- [ ] **Step 4: Material und Szenenanbindung schreiben**

`ShaderMaterial` mit `transparent: true`, `depthWrite: false`, `side: THREE.DoubleSide`. Uniforms: `tRing` (Albedo mit Alphakanal), `uSonne` (kamerarelative Sonnenposition in Render-Einheiten), `uTag` (Tagniveau aus `bodyLighting`), `uFuellung` (Nachtseitenanteil), `uStreuung`, `uSchaerfe`.

```glsl
// Fragment-Anteil, der die drei Terme zusammenführt:
vec4 ring = texture2D(tRing, vUv);
vec3 L = normalize(uSonne - vWeltPos);
vec3 V = normalize(-vWeltPos);            // Kamera sitzt im Ursprung
vec3 N = normalize(vNormal);
float direkt = abs(dot(N, L)) * uTag;      // beidseitig: ein Ring hat keine Rückseite
float streu = uStreuung * pow(max(0.0, -dot(V, L)), uSchaerfe) * uTag;
gl_FragColor = vec4(ring.rgb * (direkt + uFuellung * uTag + streu), ring.a);
```

In `render/scene.ts`: `createRingViews(ctx.scene)` neben `createBodyViews` aufbauen und in `update` mit denselben Argumenten versorgen, die die Körper bekommen, plus `lichtRender` (steht dort bereits für das Punktlicht bereit). Die Ringradien skalieren mit `sizeScale` wie die Körperradien, **ohne** `sunDamping` — der gilt nur für die Sonne.

- [ ] **Step 5: Tests prüfen**

Run: `npm test && npm run lint && npx tsc --noEmit`

- [ ] **Step 6: Sichtprüfung — der eigentliche Nachweis**

`npm run dev`:

1. Saturn von schräg oben: Ringe sichtbar, Bänderung erkennbar, Kante durchscheinend.
2. Kamera so drehen, dass die Sonne hinter den Ringen steht: Die Ringe müssen deutlich aufleuchten.
3. Genau in die Ringebene fahren: Die Ringe verschwinden nahezu zur Linie.
4. Uranus: Ringe stehen fast senkrecht, sind sehr dunkel, aber vorhanden.
5. Preset „Realistisch" und „Kompakt" durchschalten: Die Ringe müssen in jedem Maßstab am Planeten kleben, nie schweben.

- [ ] **Step 7: Commit**

```bash
git add src/render/rings.ts src/render/rings.test.ts src/render/scene.ts
git commit -m "Ringe beleuchtet, beidseitig und mit Vorwärtsstreuung"
```

---

## Task 14: Mondgruppen im Körperbaum

**Files:**
- Modify: `src/ui/panels/BodyTree.tsx`
- Test: `src/ui/panels/BodyTree.test.tsx`

**Interfaces:**
- Consumes: `buildTree` (bereits vorhanden), `toggleVisible` aus dem Store
- Produces: keine neue exportierte Signatur außer `kaskadierendeSichtbarkeit(id: string): string[]`

**Zwei Verhaltensänderungen:**

1. Ein Knoten mit Kindern ist einklappbar; Mondgruppen starten **zu**. Der Klappzustand lebt in `useState` der Komponente, **nicht** im Store — sonst vergrößerte jedes Auf- und Zuklappen das geteilte URL-Fragment (dieselbe Überlegung wie bei `visible`, siehe `store/index.ts`).
2. Der Sichtbarkeitsschalter eines Körpers nimmt seine Nachkommen mit.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

```tsx
describe('BodyTree mit Monden', () => {
  it('zeigt Mondgruppen zunächst eingeklappt', () => {
    render(<BodyTree />);
    expect(screen.getByText('Jupiter')).toBeInTheDocument();
    expect(screen.queryByText('Europa')).not.toBeInTheDocument();
  });

  it('klappt eine Gruppe auf Klick auf', async () => {
    render(<BodyTree />);
    await userEvent.click(screen.getByRole('button', { name: /Jupiter aufklappen/ }));
    expect(screen.getByText('Europa')).toBeInTheDocument();
  });

  it('blendet mit dem Planeten auch seine Monde aus', () => {
    useStore.setState({ visible: {} });
    kaskadierendeSichtbarkeit('jupiter').forEach((id) => {
      expect(['jupiter', 'io', 'europa', 'ganymede', 'callisto']).toContain(id);
    });
    expect(kaskadierendeSichtbarkeit('jupiter')).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Test laufen lassen und Fehlschlag bestätigen**

Run: `npx vitest run src/ui/panels/BodyTree.test.tsx`
Erwartet: FAIL — `Europa` ist sichtbar (keine Klappmechanik), `kaskadierendeSichtbarkeit` fehlt.

- [ ] **Step 3: Implementierung schreiben**

`kaskadierendeSichtbarkeit` sammelt rekursiv den Körper und alle Nachkommen aus `bodies`. Die Zeile bekommt links ein Klappdreieck (ein echter `button` mit `aria-expanded` und `aria-label` aus `i18n`), wenn der Knoten Kinder hat. Beim Umschalten der Sichtbarkeit läuft `toggleVisible` über die gesamte Liste — mit einem Zielzustand, der sich am Elternteil orientiert, damit nicht die Hälfte der Monde umkippt.

- [ ] **Step 4: Prüfen, Sichtprüfung, Commit**

Run: `npm test && npm run lint && npx tsc --noEmit`; im Browser: Jupiter aus- und wieder einblenden, dabei müssen alle vier Monde mitgehen.

```bash
git add src/ui/panels/BodyTree.tsx src/ui/panels/BodyTree.test.tsx src/ui/i18n/de.ts
git commit -m "Einklappbare Mondgruppen mit kaskadierender Sichtbarkeit"
```

---

## Task 15: Beschriftungsschwelle für Monde

**Files:**
- Modify: `src/render/labels.ts`, `src/render/scene.ts` (Feld `istMond` im Label-Eintrag)
- Test: `src/render/labels.test.ts`

**Interfaces:**
- Consumes: `apparentRadiusPixels` (vorhanden)
- Produces: `LABEL_MIN_PIXEL_MOND: number`, `zeigeLabel(radiusPixel: number, istMond: boolean): boolean`; `LabelEintrag` bekommt `istMond: boolean`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

```ts
describe('zeigeLabel', () => {
  it('beschriftet Planeten unabhängig von ihrer Größe', () => {
    expect(zeigeLabel(0.1, false)).toBe(true);
  });

  it('beschriftet einen Mond erst ab der Schwelle', () => {
    expect(zeigeLabel(LABEL_MIN_PIXEL_MOND - 0.1, true)).toBe(false);
    expect(zeigeLabel(LABEL_MIN_PIXEL_MOND + 0.1, true)).toBe(true);
  });

  it('hält die Mondschwelle über der Markerschwelle', () => {
    // Sonst stünden in der Systemschau 20 Mondlabels übereinander — genau
    // der Zustand, den die Schwelle verhindern soll.
    expect(LABEL_MIN_PIXEL_MOND).toBeGreaterThan(MARKER_MIN_PIXEL);
  });
});
```

- [ ] **Step 2: Fehlschlag bestätigen, implementieren, prüfen**

Run: `npx vitest run src/render/labels.test.ts` (FAIL), dann `zeigeLabel` einbauen und in `update` vor der Kollisionsauflösung anwenden. `scene.ts` füllt `istMond: body.kind === 'moon'`.

- [ ] **Step 3: Sichtprüfung und Commit**

Systemschau: keine Mondlabels. Jupitersystem aus der Nähe: alle vier beschriftet.

```bash
git add src/render/labels.ts src/render/labels.test.ts src/render/scene.ts
git commit -m "Mondbeschriftungen erst ab sichtbarer Größe"
```

---

## Task 16: Szenenkatalog auf 18 Szenen

**Files:**
- Modify: `src/data/scenes.ts`, `src/ui/i18n/de.ts`
- Test: `src/data/scenes.test.ts`

**Interfaces:**
- Consumes: `Scene` (unverändert), alle neuen Körper-IDs
- Produces: `SCENES` mit 18 Einträgen; Engine und Director bleiben unangetastet

**Die elf neuen Szenen:**

| ID | Standort | Pfad | Was sie zeigt |
|---|---|---|---|
| `galileisches-schattenspiel` | jupiter | orbit | Die vier Monde im Zeitraffer; die Resonanz 1:2:4 wird als Muster sichtbar |
| `phobos-tiefflug` | phobos | chase | Dicht über der Marsoberfläche mitlaufend |
| `pluto-charon` | pluto | orbit | Beide um den gemeinsamen Schwerpunkt; Blick auf das Paar |
| `saturn-ringkante` | saturn | static | Genau in der Ringebene — die Ringe verschwinden zur Linie |
| `ringdurchflug` | saturn | flyby | Gegenlicht durch die Ringe; zeigt die Vorwärtsstreuung |
| `titan-dunst` | titan | orbit | Der größte Saturnmond vor dem Ringplaneten |
| `enceladus-hell` | enceladus | orbit | Der hellste Körper des Sonnensystems im Streiflicht |
| `triton-rueckwaerts` | triton | orbit | Der rückläufige Mond vor Neptun |
| `iapetus-schief` | iapetus | static | Die um 15° geneigte Bahn gegen das Ringsystem |
| `uranus-gekippt` | uranus | orbit | Der liegende Planet mit senkrechten Ringen |
| `ceres-guertel` | ceres | orbit | Der Zwergplanet zwischen Mars und Jupiter |

Jede Szene bekommt `variation` mit sinnvollen Bereichen (Azimut meist voll, Elevation eng um den Entwurfswert, Abstandsfaktor 0,8 bis 1,5) und einen Titelschlüssel in `i18n/de.ts`.

- [ ] **Step 1: Invariantentests über alle Szenen schreiben**

```ts
describe('Szenenkatalog — Invarianten über alle Szenen', () => {
  it('führt mindestens 18 Szenen', () => {
    expect(SCENES.length).toBeGreaterThanOrEqual(18);
  });

  it('hat eindeutige IDs und hinterlegte Titel', () => {
    const ids = SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SCENES) expect(t(s.titleKey), s.id).not.toBe(s.titleKey);
  });

  it('zeigt nur auf existierende Körper', () => {
    for (const s of SCENES) {
      expect(bodyIndex[s.targetId], s.id).toBeDefined();
      if (s.lookAtId !== undefined) expect(bodyIndex[s.lookAtId], s.id).toBeDefined();
    }
  });

  it('hält Dauer und Parameter in brauchbaren Bereichen', () => {
    for (const s of SCENES) {
      expect(s.durationSec, s.id).toBeGreaterThanOrEqual(20);
      expect(s.durationSec, s.id).toBeLessThanOrEqual(90);
      expect(s.params.distanceInRadii, s.id).toBeGreaterThan(0);
      expect(Math.abs(s.params.elevationDeg), s.id).toBeLessThan(89);
    }
  });

  it('hat wohlgeformte Variationsbereiche', () => {
    for (const s of SCENES) {
      for (const [von, bis] of [s.variation.azimuthDeg, s.variation.elevationDeg, s.variation.distanceFactor]) {
        expect(von, s.id).toBeLessThanOrEqual(bis);
      }
      expect(s.variation.distanceFactor[0], s.id).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Stichproben rechnerisch nachprüfen**

```ts
describe('Szenen — Stichproben', () => {
  it('stellt die Ringkantenszene tatsächlich in die Ringebene', () => {
    const s = SCENES.find((x) => x.id === 'saturn-ringkante')!;
    // Elevation 0 gegen den Standortkörper heißt: in seiner Äquatorebene,
    // und dort liegen die Ringe.
    expect(Math.abs(s.params.elevationDeg)).toBeLessThan(2);
    expect(Math.abs(s.variation.elevationDeg[0])).toBeLessThan(3);
    expect(Math.abs(s.variation.elevationDeg[1])).toBeLessThan(3);
  });

  it('hält den Phobos-Tiefflug innerhalb der Marsbahn des Mondes', () => {
    const s = SCENES.find((x) => x.id === 'phobos-tiefflug')!;
    expect(s.targetId).toBe('phobos');
    // Abstand in Phobos-Radien; bei mehr als dem Zehnfachen wäre es kein
    // Tiefflug mehr, sondern eine Totale.
    expect(s.params.distanceInRadii * s.variation.distanceFactor[1]).toBeLessThan(10);
  });

  it('zeigt im Galileischen Schattenspiel genug Zeit für einen Io-Umlauf', () => {
    const s = SCENES.find((x) => x.id === 'galileisches-schattenspiel')!;
    // Io braucht 1,769 Tage; die Szene muss mindestens einen Umlauf zeigen.
    expect(s.durationSec * s.timeRateDaysPerSec).toBeGreaterThan(1.8);
  });

  it('lässt den Ringdurchflug gegen die Sonne laufen', () => {
    const s = SCENES.find((x) => x.id === 'ringdurchflug')!;
    expect(s.path).toBe('flyby');
    expect(s.lookAtId ?? s.targetId).toBe('saturn');
  });
});
```

- [ ] **Step 3: Szenen schreiben, prüfen, sichten**

Run: `npm test && npm run lint && npx tsc --noEmit`. Dann Kino-Modus starten und mindestens die fünf neuen Ring- und Mondszenen einmal durchlaufen lassen — jede muss ein brauchbares Bild liefern, keine Szene darf im Körperinneren stehen oder ins Leere blicken.

- [ ] **Step 4: Commit**

```bash
git add src/data/scenes.ts src/data/scenes.test.ts src/ui/i18n/de.ts
git commit -m "Elf neue Kinoszenen für Monde, Ringe und Zwergplaneten"
```

---

## Task 17: Abnahme

**Files:**
- Create: `docs/phase3a-abnahme.md`

- [ ] **Step 1: Vollständige Prüfung**

Run: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` — alle vier ohne Befund; Testzahl notieren.

- [ ] **Step 2: Messen statt schätzen**

Im Entwicklungslauf über `window.renderer.info` ablesen und notieren: Geometrien, Texturen, Shader-Programme, JS-Heap — je einmal direkt nach dem Laden und nach zehn Minuten Kino-Modus. Dazu die Ladezeit bis zum ersten Bild und die Gesamtgröße von `public/textures`.

- [ ] **Step 3: Bildrate prüfen**

20 Sekunden `requestAnimationFrame`-Aufzeichnung im Kino-Modus, Median und 95. Perzentil notieren — dieselbe Messung wie im Phase-2-Protokoll, damit die Zahlen vergleichbar sind. 35 statt 10 Körper dürfen die Bildrate nicht messbar drücken.

- [ ] **Step 4: Akzeptanzkriterien abhaken**

Gegen die Spec, Abschnitt 8, sowie den Hauptentwurf, Abschnitt 16 (Phase 3): Katalogumfang, Fixture-Nachweis, Ringe, Szenen. Was offen bleibt (etwa fehlende Texturen einzelner Monde), steht unter „Offene Punkte" — nicht unter „erfüllt".

- [ ] **Step 5: Commit**

```bash
git add docs/phase3a-abnahme.md
git commit -m "Abnahmeprotokoll für Phase 3a"
```

---

## Selbstprüfung des Plans

**Abdeckung der Spec.** Abschnitt 3 (Katalog) → Tasks 5, 7–10; Abschnitt 4 (Bezugsebenen) → Tasks 1–4; Abschnitt 5 (Ringe) → Tasks 12–13; Abschnitt 6 (Oberfläche) → Tasks 14–15, i18n-Anteile in jedem Datentask; Abschnitt 7 (Szenen) → Task 16; Abschnitt 8 (Prüfung) → in jedem Task plus Task 6; Abschnitt 9 (Budget und Risiken) → Task 11 und Task 17.

**Bekannte Abhängigkeiten zwischen Tasks.** Task 2 endet als einziger absichtlich rot und wird erst mit Task 3 committet — das ist im Task vermerkt und der einzige Fall. Task 12 schreibt `appearance.rings`, worauf der Mimas-Test aus Task 8 zugreift; wird Task 8 zuerst ausgeführt, nutzt er den Literalwert aus derselben Quelle und wird in Task 12 auf das Datenfeld umgestellt.

**Namensabgleich.** `poleVector`, `axialTiltDeg`, `equatorToEcliptic` (Task 1) werden in den Tasks 2, 3, 4, 9 und 12 unter genau diesen Namen verwendet. `bodyLighting` stammt unverändert aus `render/lighting.ts`. `LabelEintrag` bekommt in Task 15 das Feld `istMond`, das `scene.ts` im selben Task füllt.
