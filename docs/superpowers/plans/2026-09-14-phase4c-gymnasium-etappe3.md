# Phase 4c Infopanel, Etappe 3 „Gymnasium" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Die Gymnasialstufe ist komplett: Jeder der 35 Körper und jedes der 8 Themen hat einen Gymnasialtext in Deutsch und Englisch, der Quellenkatalog wächst von 24 auf 62 Einträge, und jeder Körper und jedes Thema hat mindestens eine Quellenkarte. Erde, Saturn und `thema-modell` liegen seit Etappe 1 vor; es fehlen 33 Körper und 7 Themen, also 80 neue Markdown-Dateien. Vorab korrigiert Task 1 die Datenblockzeile „Achsneigung", die heute gegen die Ekliptik statt gegen die eigene Bahn misst und damit jedem Gymnasialtext widerspräche.

**Architektur:** Task 1 ist eine Codeänderung mit Test zuerst: neue reine Funktion `achsneigungDeg(body, index)` in `src/sim/orbit.ts` (Drehachse gegen Bahnnormale zur Epoche J2000), genutzt von `src/ui/info/datenzeilen.ts`. Task 2 erweitert `src/data/quellen.ts` und bekommt einen Abdeckungstest. Task 3 bis 9 sind Dateiergänzungen unter `src/data/texte/<sprache>/gymnasium/` (Entwurf §4.1); der Lader findet sie über `import.meta.glob`, `src/data/texte/dateien.test.ts` prüft jede Datei (Namensmuster, Überschrift, auflösbare Verweise, kein HTML, Sprachpaar; die Wortgrenze entfällt für Gymnasium ab Task 3). Die Texte in diesem Plan sind **wörtlich** zu übernehmen; ein Umsetzer schreibt keine eigenen Sätze.

**Tech-Stack:** TypeScript, Vitest, Markdown-Teilmenge des Renderers (Überschrift `#`, Absätze, `-`-Listen, fett, kursiv, Links `[Text](objekt:id|szene:id|thema:id|quelle:id)`), Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md`, maßgeblich §2 Punkt 4 (Textlänge, mit Nachtrag aus Task 3), §4.1 bis §4.5 (Ablage, Markdown, Verweise, Quellenkatalog, Themen), §5.1 (Datenblock, mit Nachtrag aus Task 1), §7 Punkt 3 in der Fassung des Nachtrags vom 14.09.2026 („33 Körper und 7 Themen in Deutsch und Englisch, Quellenkatalog auf rund 60 Quellen"), §8 (Tests). Abweichungen und Präzisierungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Kommentare, Protokoll). Umlaute korrekt. Englisch nur in `src/data/texte/en/` und in den `en`-Feldern des Quellenkatalogs.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungs-URL, keine Werkzeugnamen. Nach jedem Commit prüfen: `git log --format=%B -1 | grep -ci 'co-authored\|session'` muss 0 ergeben. Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben).
- Branch `gymnasium` (von `master`), **kein Worktree**: der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Schichten: `ui/` → `store/` → `render/` → `sim/`; `sim/` importiert nichts aus `ui/`, `store/` oder `render/`. `achsneigungDeg` gehört deshalb nach `sim/orbit.ts`, nicht nach `ui/`.
- **Textlänge (Entscheidung Jens, 14.09.2026):** Beim Gymnasium ist die Wortzahl kein Dogma. Maßgeblich ist die sachlich korrekte, dem Niveau angepasste Darstellung. 120 bis 180 Wörter bleiben Richtwert; ein Text darf länger sein, wenn der Sachverhalt es verlangt, Füllsätze sind zu vermeiden. Task 3 hebt die Prüfgrenze für Gymnasium im Dateitest auf und trägt die Entscheidung im Entwurf nach.
- Textform (Entwurf §4.2): erste Zeile `# Titel`; Zeilenumbrüche innerhalb eines Absatzes sind erlaubt (der Parser verbindet sie); kein HTML, keine Bilder, keine Tabellen.
- Überschriften: Körpertexte tragen den Namen ohne Artikel wie die Etappe-1-Texte (`# Erde`, `# Saturn`); Thementexte tragen den Titel aus `ui/i18n` (`thema.<id>.title`).
- Verweise nur auf existierende Ziele: `objekt:<id>` (35 Körper), `szene:<id>` (19 Szenen in `src/data/scenes.ts`; `galileisches-schattenspiel` wird nicht verlinkt), `thema:<id>` (8 Themen), `quelle:<id>` (62 Quellen nach Task 2). Ein `quelle:`-Verweis auf eine in Task 2 neue Kennung ist erst danach auflösbar; die Reihenfolge der Tasks ist deshalb bindend.
- Zahlen im Text passen zum Datenblock (Entwurf §5.1: Durchmesser, Umlaufzeit, Masse, Tageslänge, Achsneigung nach Task 1, Exzentrizität). Sie sind gerundet; der Datenblock bleibt die genaue Anzeige.
- Deutsche und englische Fassung sind inhaltlich parallel (gleiche Aussagen, gleiche Verweise).
- Vor jedem Commit: die im Task genannten Tests grün. Vor „fertig": `npm run lint`, `npm test`, `npm run build` (Ausgabe zeigen).
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.

## Dateistruktur

| Task | Inhalt | Dateien |
|---|---|---|
| 1 | Achsneigung gegen die eigene Bahn | `src/sim/orbit.ts`, `src/sim/orbit.test.ts`, `src/ui/info/datenzeilen.ts`, `src/ui/info/datenzeilen.test.ts`, Entwurf §5.1 |
| 2 | Quellenkatalog 24 → 62, Abdeckungstest | `src/data/quellen.ts`, `src/data/quellen.test.ts` |
| 3 | Wortgrenze Gymnasium; sun, mercury, venus, mars; Grundschul-Nachtrag Venus | `src/data/texte/dateien.test.ts`, Entwurf §2; 8 Texte neu, 2 geändert |
| 4 | moon, phobos, deimos | 6 |
| 5 | jupiter, io, europa, ganymede, callisto | 10 |
| 6 | mimas, enceladus, tethys, dione, rhea, titan, iapetus | 14 |
| 7 | uranus, miranda, ariel, umbriel, titania, oberon, neptune, triton; Grundschul-Nachtrag Oberon | 16 neu, 2 geändert |
| 8 | pluto, charon, ceres, eris, haumea, makemake | 12 |
| 9 | Themen finsternis, ringe, gebundene-rotation, kirkwood-luecken, achsneigung, zwergplaneten, bahnelemente | 14 |
| 10 | Abnahme `docs/phase4c-etappe3-abnahme.md`, `README.md` | 2 |

Texte liegen unter `src/data/texte/de/gymnasium/<art>-<id>.md` und `src/data/texte/en/gymnasium/<art>-<id>.md`. Nach Etappe 3 gibt es 176 Textdateien (96 bisher, 66 Gymnasial-Körpertexte, 14 Gymnasial-Thementexte); `dateien.test.ts` erzeugt je Datei fünf Fälle plus zwei Sammelfälle, also 882.

**Vorgehen je Text-Task (Task 3 bis 9):** Dateien wörtlich aus dem Plan anlegen → `npx vitest run src/data/texte` → alle Fälle grün → Commit nur mit `git add src/data/texte` (Task 3 zusätzlich den Entwurf). Fällt der Verweis-Fall, die Kennung gegen die Kataloge prüfen, nie den Test ändern. Themenverweise (`thema:`) in Körpertexten zeigen bis Task 9 auf dem Gymnasium-Tab den Hinweis „kein Text"; das wird für Zwischencommits hingenommen.

---

### Task 1: Achsneigung gegen die eigene Bahn

**Befund (Planung, 14.09.2026):** `datenzeilen()` zeigt `axialTiltDeg(poleVector(…))`, den Winkel zwischen Pol und **Ekliptiknormale**. Das ergibt Merkur 7,0° (richtig 0,03°), Venus 1,2° (177,4°), Mars 26,7° (25,2°), Saturn 28,1° (26,7°) und für die Saturnmonde rund 28°, weil sie in Saturns Äquatorebene liegen. Auf dem Grundschul-Tab fällt es nicht auf (die Zeile gehört zum Gymnasium-Datenblock); jeder Gymnasialtext mit einer Neigungsangabe widerspräche ihm.

**Dateien:**
- Ändern: `src/sim/orbit.ts` (Import aus `./frames` in Zeile 4, neue Funktion am Dateiende hinter `umlaufzeitTage`)
- Ändern: `src/sim/orbit.test.ts` (Import in Zeile 2, neuer `describe`-Block am Ende)
- Ändern: `src/ui/info/datenzeilen.ts` (Importe Zeile 3 und 4, Zeilen 50 und 51)
- Ändern: `src/ui/info/datenzeilen.test.ts` (neuer Fall)
- Ändern: `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md` §5.1 (Nachtrag)

**Schnittstellen:**
- Konsumiert: `positionAt(id, index, jd)`, `velocityAt(id, index, jd)` aus `src/sim/orbit.ts`; `poleVector(raDeg, decDeg)`, `axialTiltDeg(pole)` aus `src/sim/frames.ts`; `J2000` aus `src/sim/time.ts` (in `orbit.ts` schon importiert).
- Produziert: `export function achsneigungDeg(body: Body, index: BodyIndex): number` in `src/sim/orbit.ts` — Grad, 0 bis 180. Die Texte in Task 3 bis 9 nennen Neigungen passend zu diesen Werten.

- [ ] **Schritt 1: Branch anlegen**

```bash
git checkout -b gymnasium master
```

- [ ] **Schritt 2: Fehlschlagenden Test in `src/sim/orbit.test.ts` schreiben**

Import in Zeile 2 ändern:

```ts
import { positionAt, AU_KM, umlaufzeitTage, achsneigungDeg } from './orbit';
```

Am Dateiende anfügen:

```ts
describe('achsneigungDeg (gegen die eigene Bahn, Epoche J2000)', () => {
  /** Schiefe gegen die eigene Bahn laut NSSDC-Faktenblättern, Zeile „Obliquity to orbit". */
  const SCHIEFE: Record<string, number> = {
    mercury: 0.03, venus: 177.36, earth: 23.44, mars: 25.19,
    jupiter: 3.13, saturn: 26.73, uranus: 97.77, neptune: 28.32,
  };

  it('trifft die bekannten Werte der Planeten, rückläufige Drehung über 90°', () => {
    for (const [id, soll] of Object.entries(SCHIEFE)) {
      expect(Math.abs(achsneigungDeg(getBody(id), bodyIndex) - soll), id).toBeLessThan(0.1);
    }
  });

  it('misst Monde gegen ihre eigene Bahn, nicht gegen die Ekliptik', () => {
    // 6,68° gegen die eigene Bahn (Cassinis Gesetze, siehe moon.ts); gegen
    // die Ekliptik wären es 1,54°.
    expect(Math.abs(achsneigungDeg(getBody('moon'), bodyIndex) - 6.68)).toBeLessThan(0.1);
    // Gebunden rotierende Monde in der Äquatorebene ihres Planeten liegen nahe
    // 0°, nicht bei der Neigung des Planeten (Saturn 26,7°).
    for (const id of ['io', 'titan', 'enceladus', 'charon']) {
      expect(achsneigungDeg(getBody(id), bodyIndex), id).toBeLessThan(1);
    }
  });

  it('nimmt für die Sonne den Winkel zur Ekliptiknormale', () => {
    expect(Math.abs(achsneigungDeg(getBody('sun'), bodyIndex) - 7.25)).toBeLessThan(0.01);
  });
});
```

- [ ] **Schritt 3: Test laufen lassen, er muss fehlschlagen**

Run: `npx vitest run src/sim/orbit.test.ts`
Expected: FAIL — `achsneigungDeg` ist kein Export von `./orbit` („is not a function").

- [ ] **Schritt 4: Funktion in `src/sim/orbit.ts` schreiben**

Import in Zeile 4 ändern:

```ts
import { equatorToEcliptic, poleVector, icrfKnotenVersatzDeg, axialTiltDeg } from './frames';
```

Am Dateiende (hinter `umlaufzeitTage`) anfügen:

```ts
const differenz = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

/**
 * Achsneigung gegen die eigene Bahn (Schiefe) in Grad, zur Epoche J2000.
 *
 * Gemessen wird die Drehachse, nicht der Nordpol des Datensatzes: Bei
 * negativer Rotationsperiode zeigt der Drehimpuls dem Pol entgegen
 * (IAU-Nordpol-Konvention, siehe venus.ts und uranus.ts), und die Neigung
 * liegt über 90° — Venus 177,4°, Uranus 97,8°, wie in den NSSDC-
 * Faktenblättern. Die Bahnnormale kommt aus relativer Position und
 * Geschwindigkeit der Simulation, damit Bezugsebene und Knotenversatz der
 * Monde (positionAt) nicht ein zweites Mal nachgebaut werden. Epoche statt
 * Uhrzeit, weil die Pole im Datensatz auf J2000 festliegen, während die
 * Bahnknoten wandern (beim Mond in 18,6 Jahren); zum laufenden Datum
 * gerechnet zeigte der Mond sonst Werte zwischen 3° und 7°. Ohne Bahn (Sonne)
 * gilt der Winkel zur Ekliptiknormale.
 */
export function achsneigungDeg(body: Body, index: BodyIndex): number {
  const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
  if (body.orbit === null || body.parent === null) return axialTiltDeg(pol);
  const r = differenz(positionAt(body.id, index, J2000), positionAt(body.parent, index, J2000));
  const v = differenz(velocityAt(body.id, index, J2000), velocityAt(body.parent, index, J2000));
  const normale = { x: r.y * v.z - r.z * v.y, y: r.z * v.x - r.x * v.z, z: r.x * v.y - r.y * v.x };
  const drehsinn = body.physical.rotationPeriodH < 0 ? -1 : 1;
  const skalar = pol.x * normale.x + pol.y * normale.y + pol.z * normale.z;
  const cos = (drehsinn * skalar) / (Math.hypot(pol.x, pol.y, pol.z) * Math.hypot(normale.x, normale.y, normale.z));
  return Math.acos(Math.min(Math.max(cos, -1), 1)) / GRAD;
}
```

- [ ] **Schritt 5: Test laufen lassen, er muss bestehen**

Run: `npx vitest run src/sim/orbit.test.ts`
Expected: PASS, drei neue Fälle grün. Werte aus der Planung: Merkur 0,03°, Venus 177,36°, Erde 23,44°, Mars 25,19°, Jupiter 3,12°, Saturn 26,73°, Uranus 97,77°, Neptun 28,32°, Mond 6,72°, Io 0,01°, Titan 0,34°, Enceladus 0,02°, Charon 0,08°, Sonne 7,25°.

- [ ] **Schritt 6: Fehlschlagenden Fall in `src/ui/info/datenzeilen.test.ts` schreiben**

Hinter dem Fall „Monde: Umlauf um den Mutterkörper mit Hinweis, …" einfügen:

```ts
  it('Achsneigung gegen die eigene Bahn zur Epoche, rückläufige Drehung über 90°', () => {
    const neigung = (id: string, jd = J2000) =>
      zeile(datenzeilen(bodyIndex[id]!, 'gymnasium', jd, bodyIndex), 'info.daten.achsneigung')?.wert;
    expect(neigung('mercury')).toBe('0°');
    expect(neigung('mars')).toBe('25,2°');
    expect(neigung('saturn')).toBe('26,7°');
    expect(neigung('venus')).toBe('177,4°');
    expect(neigung('uranus')).toBe('97,8°');
    expect(neigung('titan')).toBe('0,3°');
    // Die Pole liegen auf J2000 fest; die Zeile hängt deshalb nicht von der Uhr ab.
    expect(neigung('moon', J2000 + 3652.5)).toBe('6,7°');
  });
```

- [ ] **Schritt 7: Test laufen lassen, er muss fehlschlagen**

Run: `npx vitest run src/ui/info/datenzeilen.test.ts`
Expected: FAIL im neuen Fall — erwartet `'0°'`, erhalten `'7°'` (Merkur gegen die Ekliptik).

- [ ] **Schritt 8: `src/ui/info/datenzeilen.ts` umstellen**

Die Importzeilen 3 und 4 ersetzen durch eine Zeile (der Import aus `../../sim/frames` entfällt ganz, `poleVector` und `axialTiltDeg` werden hier sonst nicht gebraucht):

```ts
import { achsneigungDeg, elementsAt, positionAt, umlaufzeitTage, velocityAt } from '../../sim/orbit';
```

Die zwei Zeilen

```ts
  const pol = poleVector(body.physical.pole.raDeg, body.physical.pole.decDeg);
  zeilen.push({ schluessel: 'info.daten.achsneigung', wert: `${formatZahl(axialTiltDeg(pol), 1)}°` });
```

ersetzen durch:

```ts
  zeilen.push({ schluessel: 'info.daten.achsneigung', wert: `${formatZahl(achsneigungDeg(body, index), 1)}°` });
```

- [ ] **Schritt 9: Tests laufen lassen**

Run: `npx vitest run src/ui/info src/sim src/data`
Expected: PASS. Der bestehende Erdfall (`'23,4°'`) und der Sonnenfall (Zeilenliste) bleiben grün.

- [ ] **Schritt 10: Entwurf nachziehen**

In `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md` §5.1 hinter dem Absatz „Für die Sonne entfallen Bahnzeilen; …" einen Absatz einfügen:

```markdown
**Nachtrag (4c-3):** Die Achsneigung ist die Schiefe gegen die eigene Bahn zur
Epoche J2000, gemessen an der Drehachse (bei rückläufiger Rotation über 90°, etwa
Venus 177,4°, Uranus 97,8°); nur die Sonne ohne Bahn bezieht sich auf die
Ekliptik. Umgesetzt als `achsneigungDeg` in `sim/orbit.ts`. Die erste Fassung
maß gegen die Ekliptik und zeigte etwa Merkur mit 7,0° und die Saturnmonde mit
rund 28°.
```

- [ ] **Schritt 11: Lint und Commit**

Run: `npm run lint`
Expected: keine Fehler (insbesondere kein ungenutzter Import in `datenzeilen.ts`).

```bash
git add src/sim/orbit.ts src/sim/orbit.test.ts src/ui/info/datenzeilen.ts src/ui/info/datenzeilen.test.ts docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md
git commit -m "Datenblock: Achsneigung gegen die eigene Bahn zur Epoche J2000 statt gegen die Ekliptik"
```

---

### Task 2: Quellenkatalog auf 62 Einträge

**Dateien:**
- Ändern: `src/data/quellen.ts` (Einträge in allen fünf Gruppen)
- Ändern: `src/data/quellen.test.ts` (Import, neuer Fall)

**Schnittstellen:**
- Konsumiert: `QUELLEN`, `quellenFuer(kennung)` aus `src/data/quellen.ts`; `THEMEN` aus `src/data/themen.ts`; `bodyIndex` aus `src/data/index.ts`.
- Produziert: 38 neue Quellenkennungen, die Task 3 bis 9 als `quelle:<id>` verlinken: `nssdc-sun`, `nssdc-mercury`, `nssdc-venus`, `nssdc-mars`, `nssdc-jupiter`, `nssdc-uranus`, `nssdc-neptune`, `nssdc-pluto`, `nssdc-jupitermonde`, `nssdc-saturnmonde`, `nssdc-uranusmonde`, `jpl-satelliten`, `nasa-sun`, `nasa-mercury`, `nasa-venus`, `nasa-mars`, `nasa-jupiter`, `nasa-uranus`, `nasa-neptune`, `nasa-pluto`, `nasa-ceres`, `nasa-kuiperguertel`, `nasa-marsmonde`, `nasa-jupitermonde`, `nasa-saturnmonde`, `nasa-uranusmonde`, `nasa-triton`, `nasa-gebundene-rotation`, `nasa-messenger`, `esa-mars-express`, `nasa-juno`, `esa-juice`, `nasa-voyager-2`, `nasa-new-horizons`, `nasa-dawn`, `jpl-sbdb`, `jpl-satelliten-bahnen`, `jpl-hauptguertel`.

Alle Adressen wurden am 14.09.2026 mit einem Browser-User-Agent abgerufen: HTTP 200 ohne Umleitung. Die IAU-Seiten zur Zwergplaneten-Resolution (`iau.org/news/pressreleases/detail/iau0603/`, `iau.org/public/themes/pluto/`) liefern 404 und fehlen deshalb. Die zwei Photojournal-Adressen aus Etappe 1 leiten inzwischen zweifach auf science.nasa.gov um und werden auf das Ziel umgestellt.

- [ ] **Schritt 1: Fehlschlagenden Abdeckungstest schreiben**

In `src/data/quellen.test.ts` den Import aus `./themen` ändern:

```ts
import { istThema, THEMEN } from './themen';
```

Hinter dem Fall „verweist nur auf bekannte Körper, Szenen und Themen" einfügen:

```ts
  it('bietet jedem Körper und jedem Thema mindestens eine Quelle', () => {
    const kennungen = [
      ...Object.keys(bodyIndex).map((id) => `objekt:${id}`),
      ...THEMEN.map((thema) => `thema:${thema.id}`),
    ];
    expect(kennungen.filter((kennung) => quellenFuer(kennung).length === 0)).toEqual([]);
  });
```

- [ ] **Schritt 2: Test laufen lassen, er muss fehlschlagen**

Run: `npx vitest run src/data/quellen.test.ts`
Expected: FAIL — die Liste ohne Quelle enthält unter anderem `objekt:mercury`, `objekt:phobos`, `objekt:ceres`, `thema:gebundene-rotation`, `thema:kirkwood-luecken`, `thema:zwergplaneten`.

- [ ] **Schritt 3: Faktenblätter ergänzen**

Im Eintrag `nssdc-factsheets` die Zeile `fuer` ersetzen (die Übersichtstabelle führt die Zeile „Obliquity to orbit"):

```ts
    fuer: ['thema:modell', 'objekt:sun', 'thema:achsneigung'],
```

Direkt hinter dem Eintrag `nssdc-factsheets` (vor dem Kommentar `// --- Übersichten ---`) einfügen:

```ts
  {
    id: 'nssdc-sun',
    titel: { de: 'Sonne: Faktenblatt (NSSDC)', en: 'Sun Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html',
    fuer: ['objekt:sun'],
  },
  {
    id: 'nssdc-mercury',
    titel: { de: 'Merkur: Faktenblatt (NSSDC)', en: 'Mercury Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html',
    fuer: ['objekt:mercury'],
  },
  {
    id: 'nssdc-venus',
    titel: { de: 'Venus: Faktenblatt (NSSDC)', en: 'Venus Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html',
    fuer: ['objekt:venus'],
  },
  {
    id: 'nssdc-mars',
    titel: { de: 'Mars: Faktenblatt (NSSDC)', en: 'Mars Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
    fuer: ['objekt:mars'],
  },
  {
    id: 'nssdc-jupiter',
    titel: { de: 'Jupiter: Faktenblatt (NSSDC)', en: 'Jupiter Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html',
    fuer: ['objekt:jupiter'],
  },
  {
    id: 'nssdc-uranus',
    titel: { de: 'Uranus: Faktenblatt (NSSDC)', en: 'Uranus Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html',
    fuer: ['objekt:uranus'],
  },
  {
    id: 'nssdc-neptune',
    titel: { de: 'Neptun: Faktenblatt (NSSDC)', en: 'Neptune Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html',
    fuer: ['objekt:neptune'],
  },
  {
    id: 'nssdc-pluto',
    titel: { de: 'Pluto: Faktenblatt (NSSDC)', en: 'Pluto Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html',
    fuer: ['objekt:pluto'],
  },
  {
    id: 'nssdc-jupitermonde',
    titel: { de: 'Jupitermonde: Faktenblatt (NSSDC)', en: 'Jovian Satellite Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html',
    fuer: ['objekt:io', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto'],
  },
  {
    id: 'nssdc-saturnmonde',
    titel: { de: 'Saturnmonde: Faktenblatt (NSSDC)', en: 'Saturnian Satellite Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturniansatfact.html',
    fuer: ['objekt:mimas', 'objekt:enceladus', 'objekt:tethys', 'objekt:dione', 'objekt:rhea', 'objekt:titan', 'objekt:iapetus'],
  },
  {
    id: 'nssdc-uranusmonde',
    titel: { de: 'Uranusmonde: Faktenblatt (NSSDC)', en: 'Uranian Satellite Fact Sheet (NSSDC)' },
    herausgeber: 'NASA', sprache: 'en', art: 'faktenblatt',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uraniansatfact.html',
    fuer: ['objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon'],
  },
  {
    id: 'jpl-satelliten',
    titel: { de: 'Physikalische Daten der Monde (JPL SSD)', en: 'Planetary Satellite Physical Parameters (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'faktenblatt',
    url: 'https://ssd.jpl.nasa.gov/sats/phys_par/',
    fuer: [
      'objekt:moon', 'objekt:phobos', 'objekt:deimos',
      'objekt:io', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto',
      'objekt:mimas', 'objekt:enceladus', 'objekt:tethys', 'objekt:dione', 'objekt:rhea', 'objekt:titan', 'objekt:iapetus',
      'objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon',
      'objekt:triton', 'objekt:charon',
    ],
  },
```

- [ ] **Schritt 4: Übersichten ergänzen**

Direkt hinter dem Eintrag `wikipedia-en-lunar-eclipse` (vor dem Kommentar `// --- Bildarchive ---`) einfügen:

```ts
  {
    id: 'nasa-sun',
    titel: { de: 'Sonne bei NASA Science', en: 'Sun at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/sun/',
    fuer: ['objekt:sun'],
  },
  {
    id: 'nasa-mercury',
    titel: { de: 'Merkur bei NASA Science', en: 'Mercury at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mercury/',
    fuer: ['objekt:mercury'],
  },
  {
    id: 'nasa-venus',
    titel: { de: 'Venus bei NASA Science', en: 'Venus at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/venus/',
    fuer: ['objekt:venus'],
  },
  {
    id: 'nasa-mars',
    titel: { de: 'Mars bei NASA Science', en: 'Mars at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mars/',
    fuer: ['objekt:mars'],
  },
  {
    id: 'nasa-jupiter',
    titel: { de: 'Jupiter bei NASA Science', en: 'Jupiter at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/jupiter/',
    fuer: ['objekt:jupiter'],
  },
  {
    id: 'nasa-uranus',
    titel: { de: 'Uranus bei NASA Science', en: 'Uranus at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/uranus/',
    fuer: ['objekt:uranus'],
  },
  {
    id: 'nasa-neptune',
    titel: { de: 'Neptun bei NASA Science', en: 'Neptune at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/neptune/',
    fuer: ['objekt:neptune'],
  },
  {
    id: 'nasa-pluto',
    titel: { de: 'Pluto bei NASA Science', en: 'Pluto at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/dwarf-planets/pluto/',
    fuer: ['objekt:pluto', 'objekt:charon', 'thema:zwergplaneten'],
  },
  {
    id: 'nasa-ceres',
    titel: { de: 'Ceres bei NASA Science', en: 'Ceres at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/dwarf-planets/ceres/',
    fuer: ['objekt:ceres', 'thema:zwergplaneten'],
  },
  {
    id: 'nasa-kuiperguertel',
    titel: { de: 'Kuipergürtel bei NASA Science', en: 'Kuiper Belt at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/solar-system/kuiper-belt/',
    fuer: ['objekt:pluto', 'objekt:eris', 'objekt:haumea', 'objekt:makemake', 'thema:zwergplaneten'],
  },
  {
    id: 'nasa-marsmonde',
    titel: { de: 'Marsmonde bei NASA Science', en: 'Mars moons at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mars/moons/',
    fuer: ['objekt:phobos', 'objekt:deimos'],
  },
  {
    id: 'nasa-jupitermonde',
    titel: { de: 'Jupitermonde bei NASA Science', en: 'Jupiter moons at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/jupiter/jupiter-moons/',
    fuer: ['objekt:io', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto'],
  },
  {
    id: 'nasa-saturnmonde',
    titel: { de: 'Saturnmonde bei NASA Science', en: 'Saturn moons at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/saturn/moons/',
    fuer: ['objekt:mimas', 'objekt:enceladus', 'objekt:tethys', 'objekt:dione', 'objekt:rhea', 'objekt:titan', 'objekt:iapetus'],
  },
  {
    id: 'nasa-uranusmonde',
    titel: { de: 'Uranusmonde bei NASA Science', en: 'Uranus moons at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/uranus/moons/',
    fuer: ['objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon'],
  },
  {
    id: 'nasa-triton',
    titel: { de: 'Triton bei NASA Science', en: 'Triton at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/neptune/moons/triton/',
    fuer: ['objekt:triton'],
  },
  {
    id: 'nasa-gebundene-rotation',
    titel: { de: 'Gebundene Rotation bei NASA Science', en: 'Tidal locking at NASA Science' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/moon/tidal-locking/',
    fuer: ['thema:gebundene-rotation', 'objekt:moon'],
  },
  {
    id: 'nasa-messenger',
    titel: { de: 'Mission MESSENGER (NASA)', en: 'MESSENGER mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/messenger/',
    fuer: ['objekt:mercury'],
  },
  {
    id: 'esa-mars-express',
    titel: { de: 'Mars Express (ESA)', en: 'Mars Express (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Mars_Express',
    fuer: ['objekt:mars', 'objekt:phobos'],
  },
  {
    id: 'nasa-juno',
    titel: { de: 'Mission Juno (NASA)', en: 'Juno mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/juno/',
    fuer: ['objekt:jupiter'],
  },
  {
    id: 'esa-juice',
    titel: { de: 'Juice (ESA)', en: 'Juice (ESA)' },
    herausgeber: 'ESA', sprache: 'en', art: 'uebersicht',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Juice',
    fuer: ['objekt:jupiter', 'objekt:europa', 'objekt:ganymede', 'objekt:callisto'],
  },
  {
    id: 'nasa-voyager-2',
    titel: { de: 'Voyager 2 (NASA)', en: 'Voyager 2 (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/voyager/voyager-2/',
    fuer: [
      'objekt:uranus', 'objekt:neptune', 'objekt:triton',
      'objekt:miranda', 'objekt:ariel', 'objekt:umbriel', 'objekt:titania', 'objekt:oberon',
    ],
  },
  {
    id: 'nasa-new-horizons',
    titel: { de: 'Mission New Horizons (NASA)', en: 'New Horizons mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/new-horizons/',
    fuer: ['objekt:pluto', 'objekt:charon'],
  },
  {
    id: 'nasa-dawn',
    titel: { de: 'Mission Dawn (NASA)', en: 'Dawn mission (NASA)' },
    herausgeber: 'NASA', sprache: 'en', art: 'uebersicht',
    url: 'https://science.nasa.gov/mission/dawn/',
    fuer: ['objekt:ceres'],
  },
```

- [ ] **Schritt 5: Bildarchive auf die neuen Adressen umstellen**

Im Eintrag `jpl-photojournal-earth` die Zeile `url` ersetzen:

```ts
    url: 'https://science.nasa.gov/photojournal/galleries/pj-earth/',
```

Im Eintrag `jpl-photojournal-saturn` die Zeile `url` ersetzen:

```ts
    url: 'https://science.nasa.gov/photojournal/galleries/pj-saturn/',
```

Kennungen, Titel und Herausgeber bleiben (das Photojournal ist weiterhin ein JPL-Angebot, nur unter neuer Adresse).

- [ ] **Schritt 6: Werkzeug und Fachliches ergänzen**

Direkt hinter dem Eintrag `jpl-horizons` (vor dem Kommentar `// --- Fachliches ---`) einfügen:

```ts
  {
    id: 'jpl-sbdb',
    titel: { de: 'Kleinkörper-Datenbank (JPL SBDB)', en: 'Small-Body Database (JPL SBDB)' },
    herausgeber: 'JPL', sprache: 'en', art: 'werkzeug',
    url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html',
    fuer: ['objekt:ceres', 'objekt:eris', 'objekt:haumea', 'objekt:makemake'],
  },
```

Im Eintrag `pds-rings` die Zeile `fuer` ersetzen (Quelle des Uranus-Ringprofils, siehe `data/bodies/uranus.ts`):

```ts
    fuer: ['objekt:saturn', 'objekt:uranus', 'thema:ringe'],
```

Direkt hinter dem Eintrag `pds-rings` (vor `];`) einfügen:

```ts
  {
    id: 'jpl-satelliten-bahnen',
    titel: { de: 'Mittlere Bahnelemente der Monde (JPL SSD)', en: 'Planetary Satellite Mean Elements (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'fachartikel',
    url: 'https://ssd.jpl.nasa.gov/sats/elem/',
    fuer: ['thema:bahnelemente', 'thema:modell'],
  },
  {
    id: 'jpl-hauptguertel',
    titel: { de: 'Kirkwood-Lücken im Hauptgürtel (JPL SSD)', en: 'Kirkwood gaps in the main belt (JPL SSD)' },
    herausgeber: 'JPL', sprache: 'en', art: 'fachartikel',
    url: 'https://ssd.jpl.nasa.gov/diagrams/mb_hist.html',
    fuer: ['thema:kirkwood-luecken', 'objekt:ceres'],
  },
```

- [ ] **Schritt 7: Tests laufen lassen**

Run: `npx vitest run src/data src/ui/info`
Expected: PASS, auch der neue Abdeckungsfall und `Quellenkarten.test.tsx` (der nur `objekt:earth` prüft, dessen Quellen unverändert bleiben). Dazu `grep -c "^    id: '" src/data/quellen.ts` → `62`.

- [ ] **Schritt 8: Adressen abrufen**

```bash
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
grep -o "url: '[^']*'" src/data/quellen.ts | sed "s/url: '//; s/'$//" | while read -r u; do
  printf '%s %s\n' "$(curl -s -o /dev/null -L -A "$UA" --max-time 20 -w '%{http_code} %{num_redirects}' "$u")" "$u"
done
```

Expected: 62 Zeilen, jede mit `200`; Umleitungszahl `0` außer bei `https://doi.org/10.1007/s10569-017-9805-5` (DOI-Auflösung zum Verlag). Abweichungen wörtlich in den Report.

- [ ] **Schritt 9: Lint und Commit**

Run: `npm run lint`
Expected: keine Fehler.

```bash
git add src/data/quellen.ts src/data/quellen.test.ts
git commit -m "Quellenkatalog: 38 neue Quellen, jeder Körper und jedes Thema mit Karte, Photojournal-Adressen nachgezogen"
```

---

### Task 3: Wortgrenze Gymnasium; Sonne und innere Planeten

**Dateien:**
- Ändern: `src/data/texte/dateien.test.ts:11-12` (Konstante `WORTGRENZE` samt Kommentar)
- Ändern: `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md` §2 (Nachtrag hinter der Liste)
- Ändern: `src/data/texte/{de,en}/grundschule/objekt-venus.md` (Nachtrag aus Etappe 2, Ruling 13)
- Erstellen: `src/data/texte/{de,en}/gymnasium/objekt-{sun,mercury,venus,mars}.md`

**Schnittstellen:**
- Konsumiert: `achsneigungDeg` aus Task 1 (Venus 177,4°, Mars 25,2°, Merkur 0°, Sonne 7,3° im Datenblock); Quellen `nssdc-sun`, `nssdc-mercury`, `nssdc-venus`, `nssdc-mars`, `nasa-venus`, `nasa-messenger`, `esa-mars-express` aus Task 2; Verweise `objekt:earth`, `objekt:jupiter`, `objekt:ganymede`, `objekt:titan`, `objekt:mercury`, `objekt:phobos`, `objekt:deimos`, `szene:systemblick`, `szene:merkurjagd`, `thema:modell`, `thema:gebundene-rotation`, `thema:achsneigung` (Text aus Task 9).
- Produziert: `WORTGRENZE.gymnasium = Infinity`, auf das sich die Texte in Task 4 bis 9 verlassen.

- [ ] **Schritt 1: Wortgrenze für Gymnasium aufheben**

In `src/data/texte/dateien.test.ts` die Zeilen

```ts
/** Weiche Obergrenzen zu den Richtwerten 40–80 und 120–180 Wörter (Entwurf §2 Punkt 4, §8). */
const WORTGRENZE: Record<Niveau, number> = { grundschule: 110, gymnasium: 240, hochschule: Infinity };
```

ersetzen durch:

```ts
/**
 * Weiche Obergrenze zum Richtwert 40–80 Wörter der Grundschule (Entwurf §2
 * Punkt 4, §8). Beim Gymnasium ist die Wortzahl kein Dogma (Entscheidung
 * Jens, 14.09.2026): Maßgeblich ist die korrekte, dem Niveau angepasste
 * Darstellung; 120–180 Wörter bleiben Richtwert ohne Prüfgrenze.
 */
const WORTGRENZE: Record<Niveau, number> = { grundschule: 110, gymnasium: Infinity, hochschule: Infinity };
```

In `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md` direkt hinter Punkt 5 der Liste in §2 („**Ablage als Markdown-Dateien** …") einfügen:

```markdown
**Nachtrag zu Punkt 4 (14.09.2026, Jens):** Beim Gymnasium ist die Wortzahl kein
Dogma. Maßgeblich ist die korrekte und dem Niveau angepasste Darstellung des
Sachverhalts; 120 bis 180 Wörter bleiben Richtwert. Der Dateitest (§8) prüft für
Gymnasium deshalb keine Obergrenze mehr, nur noch für die Grundschule.
```

Run: `npx vitest run src/data/texte`
Expected: PASS mit unveränderter Fallzahl (die Grenze war bisher nicht erreicht).

- [ ] **Schritt 2: Grundschultext Venus präzisieren**

Zurückgestellt aus Etappe 2 (Ruling 13): „Ein Venustag dauert länger als ein Venusjahr" stimmt nur für die siderische Drehung (243 Tage); der Sonnentag (117 Tage) ist kürzer als das Jahr (225 Tage). Der Satz spricht deshalb von einer Drehung um sich selbst.

`de/grundschule/objekt-venus.md` vollständig ersetzen:
```markdown
# Die Venus

Venus ist fast so groß wie die [Erde](objekt:earth), aber ganz anders. Dicke Wolken
hüllen sie ein, und darunter ist es heißer als in einem Backofen, heißer als auf
jedem anderen Planeten. Venus dreht sich sehr langsam und sogar
[rückwärts](thema:achsneigung): Für eine einzige Drehung um sich selbst braucht sie
länger als für eine Runde um die Sonne. Am Abend- oder Morgenhimmel leuchtet sie so
hell, dass man sie oft für einen Stern hält.
```

`en/grundschule/objekt-venus.md` vollständig ersetzen:
```markdown
# Venus

Venus is almost as big as the [Earth](objekt:earth), but completely different. Thick
clouds wrap around it, and underneath it is hotter than an oven, hotter than on any
other planet. Venus spins very slowly and even [backwards](thema:achsneigung): a
single turn on its axis takes longer than one trip around the Sun. In the evening or
morning sky it shines so brightly that people often mistake it for a star.
```

- [ ] **Schritt 3: Gymnasialtexte anlegen**

`de/gymnasium/objekt-sun.md`:
```markdown
# Sonne

Die Sonne ist ein gewöhnlicher Stern der Hauptreihe (Spektralklasse G2), rund
4,6 Milliarden Jahre alt, und enthält etwa 99,86 % der Masse des Sonnensystems. Ihr
Durchmesser von 1,39 Millionen km entspricht 109 Erddurchmessern. Der Masse nach
besteht sie zu rund drei Vierteln aus Wasserstoff und zu einem Viertel aus Helium. Im
Kern verschmilzt bei etwa 15 Millionen Kelvin Wasserstoff zu Helium; dabei wandeln
sich in jeder Sekunde gut vier Millionen Tonnen Masse nach E = mc² in Strahlung um.
Die sichtbare Oberfläche, die Photosphäre, ist nur etwa 5 800 K heiß. Ihr Licht
braucht gut acht Minuten bis zur [Erde](objekt:earth).

Als Gaskugel dreht sich die Sonne nicht starr: am Äquator in etwa 25 Tagen, nahe den
Polen in rund 35 Tagen. Der Datenblock nennt den üblichen Bezugswert bei 16°
heliografischer Breite. Die Sonnenachse ist um 7,25° gegen die Ekliptik geneigt. Die
Zahl der Sonnenflecken schwankt in einem Zyklus von rund elf Jahren.

Genau genommen ruht die Sonne nicht: Mit den Planeten umläuft sie den gemeinsamen
Schwerpunkt. Allein [Jupiter](objekt:jupiter) rückt diesen Punkt bis knapp außerhalb
der Sonnenoberfläche. Die Simulation setzt die Sonne vereinfachend in den Ursprung
([Grenzen des Modells](thema:modell)). Überblick:
[Das System von oben](szene:systemblick); Kennzahlen:
[NSSDC Sun Fact Sheet](quelle:nssdc-sun).
```

`en/gymnasium/objekt-sun.md`:
```markdown
# Sun

The Sun is an ordinary main-sequence star (spectral class G2), about 4.6 billion years
old, and contains some 99.86 % of the mass of the Solar System. Its diameter of
1.39 million km equals 109 Earth diameters. By mass it is about three quarters hydrogen
and one quarter helium. In the core, at around 15 million kelvin, hydrogen fuses into
helium; every second a little over four million tonnes of mass are converted into
radiation according to E = mc². The visible surface, the photosphere, is only about
5,800 K. Its light takes just over eight minutes to reach the [Earth](objekt:earth).

Being a ball of gas, the Sun does not rotate rigidly: about 25 days at the equator,
around 35 days near the poles. The data block gives the usual reference value at 16°
heliographic latitude. The solar axis is tilted by 7.25° to the ecliptic. The number
of sunspots varies in a cycle of about eleven years.

Strictly speaking the Sun is not at rest: together with the planets it orbits their
common centre of mass. [Jupiter](objekt:jupiter) alone shifts that point to just
outside the solar surface. For simplicity the simulation places the Sun at the origin
([limits of the model](thema:modell)). Overview:
[The Solar System from above](szene:systemblick); key figures:
[NSSDC Sun Fact Sheet](quelle:nssdc-sun).
```

`de/gymnasium/objekt-mercury.md`:
```markdown
# Merkur

Merkur ist der innerste und kleinste Planet. Mit 4 879 km Durchmesser ist er kleiner
als die Monde [Ganymed](objekt:ganymede) und [Titan](objekt:titan), hat aber mit
5,4 g/cm³ fast die mittlere Dichte der Erde. Der Grund ist ein großer Eisenkern, der
mehr als vier Fünftel seines Radius einnimmt.

Seine Bahn ist die exzentrischste aller Planeten (e ≈ 0,21) und um 7° gegen die
Ekliptik geneigt; der Sonnenabstand schwankt zwischen 46 und 70 Millionen km. Für
einen Umlauf braucht Merkur 88 Tage, für eine Drehung um sich selbst 58,6 Tage,
genau zwei Drittel davon. Die Gezeiten der Sonne haben ihn nicht in eine
[gebundene Rotation](thema:gebundene-rotation) gebremst, sondern wegen der
exzentrischen Bahn in diese 3:2-Resonanz. Ein Sonnentag von Mittag zu Mittag dauert
deshalb 176 Tage. Ohne nennenswerte Atmosphäre schwankt die Temperatur zwischen etwa
430 °C am Tag und −180 °C in der Nacht. Weil die Achse fast senkrecht auf der Bahn
steht (unter 0,1°), liegen die Böden polnaher Krater im Dauerschatten; dort fand die
Sonde MESSENGER Hinweise auf Wassereis.

Merkurs Perihel wandert schneller, als es die Anziehung der anderen Planeten erklärt.
Den Rest von 43 Bogensekunden je Jahrhundert erklärte erst Einsteins Allgemeine
Relativitätstheorie. Szene: [Merkur auf der Innenbahn](szene:merkurjagd); Kennzahlen:
[NSSDC Mercury Fact Sheet](quelle:nssdc-mercury); Mission:
[MESSENGER](quelle:nasa-messenger).
```

`en/gymnasium/objekt-mercury.md`:
```markdown
# Mercury

Mercury is the innermost and smallest planet. At 4,879 km in diameter it is smaller
than the moons [Ganymede](objekt:ganymede) and [Titan](objekt:titan), yet at
5.4 g/cm³ its mean density is almost that of the Earth. The reason is a large iron
core that takes up more than four fifths of its radius.

Its orbit is the most eccentric of all the planets (e ≈ 0.21) and inclined by 7° to
the ecliptic; its distance from the Sun varies between 46 and 70 million km. Mercury
needs 88 days for one orbit and 58.6 days for one rotation, exactly two thirds of
that. The Sun's tides did not brake it into [tidal locking](thema:gebundene-rotation)
but, because of the eccentric orbit, into this 3:2 resonance. A solar day from noon
to noon therefore lasts 176 days. With no significant atmosphere, temperatures range
from about 430 °C by day to −180 °C at night. Because the axis stands almost
perpendicular to the orbit (less than 0.1°), the floors of craters near the poles lie
in permanent shadow; there the MESSENGER spacecraft found evidence of water ice.

Mercury's perihelion advances faster than the pull of the other planets can explain.
The remaining 43 arcseconds per century were only explained by Einstein's general
theory of relativity. Scene: [Mercury on the inner orbit](szene:merkurjagd); key
figures: [NSSDC Mercury Fact Sheet](quelle:nssdc-mercury); mission:
[MESSENGER](quelle:nasa-messenger).
```

`de/gymnasium/objekt-venus.md`:
```markdown
# Venus

Venus ist mit 12 104 km Durchmesser und 82 % der Erdmasse fast ein Zwilling der
[Erde](objekt:earth), unterscheidet sich aber grundlegend. Ihre Atmosphäre besteht zu
rund 96 % aus Kohlendioxid; am Boden herrscht ein Druck von über 90 bar, so viel wie in
900 m Meerestiefe. Der Treibhauseffekt heizt die Oberfläche auf rund 465 °C, mehr als
auf dem sonnennäheren [Merkur](objekt:mercury). Eine geschlossene Wolkendecke aus
Schwefelsäuretröpfchen wirft rund drei Viertel des Sonnenlichts zurück; deshalb ist
Venus nach dem Mond das hellste Objekt am Nachthimmel.

Venus dreht sich rückläufig und sehr langsam: Eine Drehung gegenüber den Sternen dauert
243 Tage, länger als ihr Jahr von 225 Tagen. Der Datenblock zeigt diese siderische
Rotation. Weil Drehung und Umlauf gegenläufig sind, ist ein Sonnentag kürzer: 117 Tage.
Die Rückläufigkeit steckt in der [Achsneigung](thema:achsneigung) von 177°: Die Achse
steht fast aufrecht, aber auf dem Kopf. Die Wolkenschicht dagegen umrundet den Planeten
in nur vier Tagen.

Ihre Bahn ist mit e ≈ 0,007 die kreisähnlichste aller Planeten. Von der Erde aus zeigt
Venus Phasen wie der Mond; Galilei sah darin 1610 einen Beleg für das heliozentrische
Weltbild. Kennzahlen: [NSSDC Venus Fact Sheet](quelle:nssdc-venus); Überblick:
[Venus bei NASA](quelle:nasa-venus).
```

`en/gymnasium/objekt-venus.md`:
```markdown
# Venus

At 12,104 km in diameter and 82 % of the Earth's mass, Venus is almost a twin of the
[Earth](objekt:earth), yet fundamentally different. Its atmosphere is about 96 %
carbon dioxide; the pressure at the ground exceeds 90 bar, as much as 900 m deep in
the ocean. The greenhouse effect heats the surface to about 465 °C, more than on
[Mercury](objekt:mercury), which is closer to the Sun. A closed cloud deck of
sulphuric acid droplets reflects about three quarters of the sunlight; that is why
Venus is the brightest object in the night sky after the Moon.

Venus rotates retrograde and very slowly: one rotation relative to the stars takes
243 days, longer than its year of 225 days. The data block shows this sidereal
rotation. Because rotation and orbit run in opposite directions, a solar day is
shorter: 117 days. The retrograde spin is contained in the
[axial tilt](thema:achsneigung) of 177°: the axis is almost upright, but upside down.
The cloud layer, by contrast, circles the planet in only four days.

Its orbit, with e ≈ 0.007, is the most nearly circular of all the planets. Seen from
Earth, Venus shows phases like the Moon; in 1610 Galileo took them as evidence for the
heliocentric system. Key figures: [NSSDC Venus Fact Sheet](quelle:nssdc-venus);
overview: [Venus at NASA](quelle:nasa-venus).
```

`de/gymnasium/objekt-mars.md`:
```markdown
# Mars

Mars ist mit 6 779 km Durchmesser etwa halb so groß wie die [Erde](objekt:earth) und
hat gut ein Zehntel ihrer Masse. Er umläuft die Sonne in 1,52 AE Abstand in 687 Tagen;
seine Bahn ist mit e ≈ 0,093 deutlich elliptisch. Die Oppositionen, bei denen Erde und
Mars einander am nächsten kommen, sind deshalb unterschiedlich günstig: Der Abstand
liegt dann zwischen etwa 56 und 101 Millionen km.

Eine Drehung dauert 24 h 37 min, die Achse ist um 25,2° geneigt, fast wie bei der Erde.
Mars hat deshalb Jahreszeiten, die wegen des längeren Jahres fast doppelt so lange
dauern. Ohne großen Mond ist seine [Achsneigung](thema:achsneigung) aber nicht
stabilisiert: Modellrechnungen zeigen, dass sie über viele Jahrmillionen chaotisch
zwischen fast 0° und rund 60° schwankt.

Die Atmosphäre aus Kohlendioxid erreicht am Boden weniger als ein Hundertstel des
Erddrucks. Flüssiges Wasser ist heute nicht beständig, doch Flusstäler, Deltas und
wasserhaltige Minerale zeigen, dass es früher reichlich vorhanden war. Der Vulkan
Olympus Mons ragt rund 22 km über das mittlere Niveau, das Grabensystem Valles
Marineris ist etwa 4 000 km lang. Die rote Farbe stammt von Eisenoxid im Staub.

Monde: [Phobos](objekt:phobos) und [Deimos](objekt:deimos). Kennzahlen:
[NSSDC Mars Fact Sheet](quelle:nssdc-mars); Mission:
[Mars Express](quelle:esa-mars-express).
```

`en/gymnasium/objekt-mars.md`:
```markdown
# Mars

With a diameter of 6,779 km, Mars is about half the size of the [Earth](objekt:earth)
and has just over a tenth of its mass. It orbits the Sun at 1.52 AU in 687 days; with
e ≈ 0.093 its orbit is noticeably elliptical. Oppositions, when Earth and Mars come
closest, are therefore not all equally favourable: the distance then lies between
about 56 and 101 million km.

One rotation takes 24 h 37 min, and the axis is tilted by 25.2°, almost like the
Earth's. Mars therefore has seasons, which last almost twice as long because of the
longer year. Without a large moon, however, its [axial tilt](thema:achsneigung) is not
stabilised: model calculations show it varying chaotically over many millions of
years, between almost 0° and about 60°.

The carbon dioxide atmosphere reaches less than one hundredth of the Earth's pressure
at the ground. Liquid water is not stable today, but river valleys, deltas and
water-bearing minerals show that it was once plentiful. The volcano Olympus Mons rises
about 22 km above the mean level, and the canyon system Valles Marineris is about
4,000 km long. The red colour comes from iron oxide in the dust.

Moons: [Phobos](objekt:phobos) and [Deimos](objekt:deimos). Key figures:
[NSSDC Mars Fact Sheet](quelle:nssdc-mars); mission:
[Mars Express](quelle:esa-mars-express).
```

- [ ] **Schritt 4: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS; `dateien.test.ts` mit 104 Dateien, also 522 Fällen.

- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md
git commit -m "Gymnasialtexte: Sonne und innere Planeten; Wortgrenze Gymnasium aufgehoben; Grundschultext Venus präzisiert"
```

---

### Task 4: Erdmond und Marsmonde

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/gymnasium/objekt-{moon,phobos,deimos}.md`

**Schnittstellen:**
- Konsumiert: `achsneigungDeg` aus Task 1 (Mond 6,7° im Datenblock); Quellen `nssdc-moon`, `nasa-marsmonde`, `jpl-satelliten` (Task 2); Verweise `objekt:earth`, `objekt:mars`, `objekt:phobos`, `objekt:deimos`, `szene:mondfinsternis`, `szene:mondtanz`, `szene:phobos-tiefflug`, `thema:gebundene-rotation`, `thema:finsternis` (Texte aus Task 9).
- Produziert: nichts für spätere Tasks.

- [ ] **Schritt 1: Dateien anlegen**

`de/gymnasium/objekt-moon.md`:
```markdown
# Mond

Der Mond umkreist die [Erde](objekt:earth) in rund 384 400 km mittlerem Abstand. Mit
3 475 km Durchmesser ist er gut ein Viertel so groß wie sie, hat aber nur 1/81 ihrer
Masse. Für einen Umlauf gegenüber den Sternen braucht er 27,3 Tage (siderischer
Monat). Von Vollmond zu Vollmond vergehen dagegen 29,5 Tage (synodischer Monat), weil
die Erde in dieser Zeit ein Stück um die Sonne weiterzieht und der Mond diesen Winkel
aufholen muss.

Seine Rotation ist [gebunden](thema:gebundene-rotation): Er dreht sich in genau der
Zeit einmal um sich selbst, in der er die Erde umrundet. Weil die Bahn elliptisch und
geneigt ist, schwankt der Anblick etwas (Libration), so dass wir mit der Zeit rund
59 % seiner Oberfläche sehen. Die Mondbahn ist um 5,1° gegen die Ekliptik geneigt;
deshalb bringt nicht jeder Vollmond eine [Finsternis](thema:finsternis). Die Achse des
Mondes steht 6,7° gegen seine eigene Bahn und nur 1,5° gegen die Ekliptik.

Die dunklen Maria sind erstarrte Lavaflächen, die hellen Hochländer sind älter und
stärker verkratert. Nach der gängigen Hypothese entstand der Mond vor etwa
4,5 Milliarden Jahren aus den Trümmern eines Zusammenstoßes der jungen Erde mit einem
marsgroßen Körper. Laserreflektoren der Apollo-Missionen zeigen, dass er sich jährlich
um 3,8 cm von der Erde entfernt. Szenen: [Mondfinsternis](szene:mondfinsternis),
[Der Tanz des Mondes](szene:mondtanz); Kennzahlen:
[NSSDC Moon Fact Sheet](quelle:nssdc-moon).
```

`en/gymnasium/objekt-moon.md`:
```markdown
# Moon

The Moon orbits the [Earth](objekt:earth) at a mean distance of about 384,400 km. At
3,475 km in diameter it is just over a quarter of the Earth's size but has only 1/81 of
its mass. One orbit relative to the stars takes 27.3 days (sidereal month). From full
Moon to full Moon, however, 29.5 days pass (synodic month), because in that time the
Earth moves on along its orbit around the Sun and the Moon has to make up that angle.

Its rotation is [tidally locked](thema:gebundene-rotation): it turns once on its axis
in exactly the time it takes to orbit the Earth. Because the orbit is elliptical and
inclined, the view wobbles slightly (libration), so that over time we see about 59 %
of its surface. The lunar orbit is inclined by 5.1° to the ecliptic; that is why not
every full Moon brings an [eclipse](thema:finsternis). The Moon's axis is tilted 6.7°
to its own orbit and only 1.5° to the ecliptic.

The dark maria are solidified lava plains; the bright highlands are older and more
heavily cratered. According to the leading hypothesis, the Moon formed about
4.5 billion years ago from the debris of a collision between the young Earth and a
Mars-sized body. Laser reflectors left by the Apollo missions show that it recedes
from the Earth by 3.8 cm per year. Scenes: [Lunar eclipse](szene:mondfinsternis),
[The dance of the Moon](szene:mondtanz); key figures:
[NSSDC Moon Fact Sheet](quelle:nssdc-moon).
```

`de/gymnasium/objekt-phobos.md`:
```markdown
# Phobos

Phobos ist der innere der beiden Marsmonde, ein unregelmäßiger Körper von etwa
27 × 22 × 18 km. Seine mittlere Dichte von rund 1,9 g/cm³ spricht für einen porösen,
locker gepackten Körper. Die Oberfläche ist mit Staub bedeckt und von parallelen Rillen
durchzogen; der größte Krater, Stickney, misst etwa 9 km, ein Drittel der Länge des
Mondes.

Phobos kreist nur rund 6 000 km über der Marsoberfläche und braucht für einen Umlauf
7 h 39 min, weniger als eine Marsdrehung. Er liegt damit innerhalb der synchronen
Umlaufbahn: Vom Mars aus gesehen geht er im Westen auf und im Osten unter, etwa zweimal
am Tag. Die Gezeitenbeule, die er auf dem Mars hebt, bleibt hinter ihm zurück und
bremst ihn; seine Bahn sinkt um knapp zwei Meter je Jahrhundert. In 30 bis
50 Millionen Jahren wird er aufschlagen oder von den Gezeitenkräften zu einem Ring
zerrissen.

Wie [Deimos](objekt:deimos) zeigt Phobos dem [Mars](objekt:mars) stets dieselbe Seite
([gebundene Rotation](thema:gebundene-rotation)). Ob beide eingefangene Asteroiden
oder Trümmer eines großen Einschlags auf dem Mars sind, ist noch offen. Szene:
[Tiefflug über Phobos](szene:phobos-tiefflug); Überblick:
[Marsmonde bei NASA](quelle:nasa-marsmonde).
```

`en/gymnasium/objekt-phobos.md`:
```markdown
# Phobos

Phobos is the inner of the two Martian moons, an irregular body of about
27 × 22 × 18 km. Its mean density of about 1.9 g/cm³ points to a porous, loosely packed
body. The surface is covered in dust and crossed by parallel grooves; the largest
crater, Stickney, measures about 9 km, a third of the moon's length.

Phobos orbits only about 6,000 km above the Martian surface and needs 7 h 39 min for
one orbit, less than one rotation of Mars. It thus lies inside the synchronous orbit:
seen from Mars it rises in the west and sets in the east, about twice a day. The tidal
bulge it raises on Mars lags behind it and slows it down; its orbit shrinks by almost
two metres per century. In 30 to 50 million years it will either crash or be torn
apart into a ring by tidal forces.

Like [Deimos](objekt:deimos), Phobos always shows the same face to
[Mars](objekt:mars) ([tidal locking](thema:gebundene-rotation)). Whether both are
captured asteroids or debris from a large impact on Mars is still open. Scene:
[Low pass over Phobos](szene:phobos-tiefflug); overview:
[Mars moons at NASA](quelle:nasa-marsmonde).
```

`de/gymnasium/objekt-deimos.md`:
```markdown
# Deimos

Deimos ist der äußere und kleinere Marsmond, etwa 15 × 12 × 11 km groß. Er kreist in
rund 23 500 km Abstand vom Marsmittelpunkt und braucht für einen Umlauf 30,3 Stunden,
etwas länger als eine Marsdrehung. Weil er am Himmel nur langsam hinter der Drehung
des Mars zurückbleibt, geht er zwar im Osten auf, bleibt aber gut zweieinhalb Tage über
dem Horizont. Vom Marsboden aus wirkt er wie ein heller Stern, nicht wie eine Scheibe.

Deimos liegt außerhalb der synchronen Umlaufbahn in etwa 20 400 km Abstand. Anders als
[Phobos](objekt:phobos) wird er von den Gezeiten deshalb nicht abgebremst, sondern
ganz langsam nach außen geschoben. Seine Oberfläche ist glatter als die von Phobos,
weil eine dicke Staubschicht die meisten Krater auffüllt. Mit einer geometrischen
Albedo unter 0,1 gehört er zu den dunkelsten Körpern im Sonnensystem, ähnlich
kohlenstoffreichen Asteroiden.

Beide Monde laufen fast genau in der Äquatorebene des [Mars](objekt:mars) auf nahezu
kreisförmigen Bahnen. Das passt schlecht zu eingefangenen Asteroiden, deren Bahnen
eher geneigt und gestreckt wären, und spricht für eine Entstehung aus einer
Trümmerscheibe nach einem großen Einschlag. Überblick:
[Marsmonde bei NASA](quelle:nasa-marsmonde); Kennzahlen:
[JPL-Satellitendaten](quelle:jpl-satelliten).
```

`en/gymnasium/objekt-deimos.md`:
```markdown
# Deimos

Deimos is the outer and smaller Martian moon, about 15 × 12 × 11 km in size. It orbits
about 23,500 km from the centre of Mars and needs 30.3 hours for one orbit, slightly
longer than one rotation of Mars. Because it falls behind the planet's rotation only
slowly, it does rise in the east, but then stays above the horizon for a good two and
a half days. From the Martian surface it looks like a bright star, not like a disc.

Deimos lies outside the synchronous orbit at about 20,400 km. Unlike
[Phobos](objekt:phobos), it is therefore not slowed down by the tides but pushed
outwards very slowly. Its surface is smoother than that of Phobos because a thick
layer of dust fills most craters. With a geometric albedo below 0.1 it is one of the
darkest bodies in the Solar System, similar to carbon-rich asteroids.

Both moons move almost exactly in the equatorial plane of [Mars](objekt:mars) on
nearly circular orbits. That fits poorly with captured asteroids, whose orbits would
tend to be inclined and elongated, and argues for formation from a debris disc after
a large impact. Overview: [Mars moons at NASA](quelle:nasa-marsmonde); key figures:
[JPL satellite data](quelle:jpl-satelliten).
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS; `dateien.test.ts` mit 110 Dateien, also 552 Fällen.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Gymnasialtexte: Erdmond und Marsmonde"
```

---

### Task 5: Jupiter und die Galileischen Monde

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/gymnasium/objekt-{jupiter,io,europa,ganymede,callisto}.md`

**Schnittstellen:**
- Konsumiert: Quellen `nssdc-jupiter`, `nasa-juno`, `nssdc-jupitermonde`, `nasa-jupitermonde`, `esa-juice` (Task 2); Verweise `objekt:earth`, `objekt:sun`, `objekt:moon`, `objekt:mercury`, `objekt:jupiter`, `objekt:io`, `objekt:europa`, `objekt:ganymede`, `objekt:callisto`, `szene:jupiter-vorbeiflug`, `thema:kirkwood-luecken`, `thema:gebundene-rotation` (Texte aus Task 9).
- Produziert: nichts für spätere Tasks.

- [ ] **Schritt 1: Dateien anlegen**

`de/gymnasium/objekt-jupiter.md`:
```markdown
# Jupiter

Jupiter ist der größte Planet: Sein Durchmesser beträgt rund 140 000 km, elfmal so viel
wie der der [Erde](objekt:earth), und seine Masse ist 318-mal so groß wie die der Erde,
mehr als doppelt so viel wie die aller anderen Planeten zusammen. Er umläuft die
[Sonne](objekt:sun) in 5,2 AE Abstand in knapp zwölf Jahren. Seine mittlere Dichte von
1,3 g/cm³ zeigt, dass er überwiegend aus Wasserstoff und Helium besteht. Unter dem
gewaltigen Druck in der Tiefe wird Wasserstoff metallisch und elektrisch leitend; darin
entsteht das stärkste Magnetfeld aller Planeten.

In knapp zehn Stunden dreht sich Jupiter einmal um sich selbst, schneller als jeder
andere Planet, und ist deshalb sichtbar abgeplattet. Seine Achse ist nur um 3° geneigt,
Jahreszeiten gibt es kaum. Die Wolken ordnen sich zu hellen Zonen und dunklen Bändern;
der Große Rote Fleck ist ein Wirbelsturm, der seit fast 200 Jahren ununterbrochen
beobachtet wird. Er schrumpft, ist aber noch immer größer als die Erde.

Jupiters Schwerkraft prägt das ganze Sonnensystem, etwa die
[Kirkwood-Lücken](thema:kirkwood-luecken) im Asteroidengürtel. Von fast hundert
bekannten Monden sind die vier Galileischen die größten: [Io](objekt:io),
[Europa](objekt:europa), [Ganymed](objekt:ganymede) und [Kallisto](objekt:callisto).
Szene: [Vorbeiflug an Jupiter](szene:jupiter-vorbeiflug); Kennzahlen:
[NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter); Mission: [Juno](quelle:nasa-juno).
```

`en/gymnasium/objekt-jupiter.md`:
```markdown
# Jupiter

Jupiter is the largest planet: its diameter is about 140,000 km, eleven times that of
the [Earth](objekt:earth), and its mass is 318 times the Earth's, more than twice that
of all the other planets combined. It orbits the [Sun](objekt:sun) at 5.2 AU in just
under twelve years. Its mean density of 1.3 g/cm³ shows that it consists mainly of
hydrogen and helium. Under the enormous pressure at depth, hydrogen becomes metallic
and electrically conducting; this is where the strongest magnetic field of all the
planets is generated.

Jupiter turns once on its axis in just under ten hours, faster than any other planet,
and is therefore visibly flattened. Its axis is tilted by only 3°, so there are hardly
any seasons. The clouds are arranged in bright zones and dark belts; the Great Red Spot
is a storm that has been observed continuously for almost 200 years. It is shrinking
but is still larger than the Earth.

Jupiter's gravity shapes the whole Solar System, for example the
[Kirkwood gaps](thema:kirkwood-luecken) in the asteroid belt. Of almost a hundred known
moons, the four Galilean moons are the largest: [Io](objekt:io),
[Europa](objekt:europa), [Ganymede](objekt:ganymede) and [Callisto](objekt:callisto).
Scene: [Flyby of Jupiter](szene:jupiter-vorbeiflug); key figures:
[NSSDC Jupiter Fact Sheet](quelle:nssdc-jupiter); mission: [Juno](quelle:nasa-juno).
```

`de/gymnasium/objekt-io.md`:
```markdown
# Io

Io ist der innerste der vier Galileischen Monde und mit 3 643 km Durchmesser etwas
größer als der [Mond](objekt:moon) der Erde. Er umläuft [Jupiter](objekt:jupiter) in
422 000 km Abstand in 1,77 Tagen. Kein anderer Körper im Sonnensystem ist vulkanisch so
aktiv: Mehr als 400 aktive Vulkane sind bekannt, manche Ausbruchswolken steigen mehrere
hundert Kilometer hoch, und Lavaseen erreichen über 1 200 °C. Schwefel und
Schwefeldioxid färben die Oberfläche gelb, orange, rot und weiß. Einschlagkrater fehlen,
weil Lava sie laufend überdeckt.

Die Energie stammt aus Gezeitenreibung. Io, [Europa](objekt:europa) und
[Ganymed](objekt:ganymede) stehen in einer Bahnresonanz von 1:2:4: Während Ganymed
einmal umläuft, umrundet Europa Jupiter zweimal und Io viermal. Die regelmäßigen
Anstöße halten Ios Bahn leicht elliptisch. Weil Io [gebunden](thema:gebundene-rotation)
rotiert, sich sein Abstand zu Jupiter aber ständig ändert, wird er im Takt eines Umlaufs
um bis zu rund 100 Meter verformt; die Reibung heizt sein Inneres.

Mit einer Dichte von 3,5 g/cm³ ist Io ein Gesteinskörper mit Eisenkern und praktisch
ohne Wasser. Vulkanisch ausgestoßenes Material bildet entlang seiner Bahn einen Ring aus
geladenen Teilchen im Magnetfeld Jupiters, den Io-Plasmatorus. Kennzahlen:
[Faktenblatt der Jupitermonde](quelle:nssdc-jupitermonde); Überblick:
[Jupitermonde bei NASA](quelle:nasa-jupitermonde).
```

`en/gymnasium/objekt-io.md`:
```markdown
# Io

Io is the innermost of the four Galilean moons and, at 3,643 km in diameter, slightly
larger than the Earth's [Moon](objekt:moon). It orbits [Jupiter](objekt:jupiter) at
422,000 km in 1.77 days. No other body in the Solar System is as volcanically active:
more than 400 active volcanoes are known, some eruption plumes rise several hundred
kilometres high, and lava lakes exceed 1,200 °C. Sulphur and sulphur dioxide colour the
surface yellow, orange, red and white. Impact craters are missing because lava keeps
covering them.

The energy comes from tidal friction. Io, [Europa](objekt:europa) and
[Ganymede](objekt:ganymede) are locked in a 1:2:4 orbital resonance: while Ganymede
orbits once, Europa circles Jupiter twice and Io four times. The regular nudges keep
Io's orbit slightly elliptical. Because Io is [tidally locked](thema:gebundene-rotation)
but its distance from Jupiter keeps changing, it is flexed by up to about 100 metres
with every orbit; the friction heats its interior.

With a density of 3.5 g/cm³, Io is a rocky body with an iron core and practically no
water. Material ejected by the volcanoes forms a ring of charged particles along its
orbit in Jupiter's magnetic field, the Io plasma torus. Key figures:
[Jovian Satellite Fact Sheet](quelle:nssdc-jupitermonde); overview:
[Jupiter moons at NASA](quelle:nasa-jupitermonde).
```

`de/gymnasium/objekt-europa.md`:
```markdown
# Europa

Europa ist der kleinste der Galileischen Monde, mit 3 122 km Durchmesser etwas kleiner
als der Erdmond. Er umläuft [Jupiter](objekt:jupiter) in 671 000 km Abstand in
3,55 Tagen. Unter einer Eiskruste von vermutlich 15 bis 25 km Dicke liegt nach heutigem
Kenntnisstand ein globaler Ozean aus salzigem Wasser, vielleicht 60 bis 150 km tief. Er
enthielte etwa doppelt so viel Wasser wie alle Ozeane der [Erde](objekt:earth).

Die Belege sind indirekt, aber stark: Die Raumsonde Galileo maß ein Magnetfeld, das
Jupiters wechselndes Feld in einer leitfähigen, also salzigen Schicht unter der
Oberfläche hervorruft. Die Oberfläche ist mit schätzungsweise 40 bis 90 Millionen Jahren
geologisch jung und kaum verkratert. Lange Risse und Doppelrücken sowie Chaos-Gebiete,
in denen Eisschollen verschoben und wieder eingefroren sind, zeigen, dass die Kruste in
Bewegung ist. Die Wärme liefert wie bei [Io](objekt:io) die Gezeitenreibung aus der
Bahnresonanz mit Io und [Ganymed](objekt:ganymede).

Weil flüssiges Wasser, chemische Energie und organische Verbindungen dort
zusammenkommen könnten, gilt Europa als einer der aussichtsreichsten Orte für die Suche
nach Leben außerhalb der Erde. Die NASA-Sonde Europa Clipper und die ESA-Sonde Juice
sollen ihn in den 2030er Jahren genauer untersuchen. Überblick:
[Jupitermonde bei NASA](quelle:nasa-jupitermonde); Mission: [Juice](quelle:esa-juice).
```

`en/gymnasium/objekt-europa.md`:
```markdown
# Europa

Europa is the smallest of the Galilean moons, at 3,122 km in diameter slightly smaller
than the Earth's Moon. It orbits [Jupiter](objekt:jupiter) at 671,000 km in 3.55 days.
According to current knowledge, beneath an ice crust probably 15 to 25 km thick lies a
global ocean of salty water, perhaps 60 to 150 km deep. It would hold about twice as
much water as all the oceans of the [Earth](objekt:earth).

The evidence is indirect but strong: the Galileo spacecraft measured a magnetic field
that Jupiter's changing field induces in a conducting, and therefore salty, layer below
the surface. At an estimated 40 to 90 million years, the surface is geologically young
and hardly cratered. Long cracks and double ridges, as well as chaos terrain where ice
rafts have shifted and refrozen, show that the crust is on the move. As on
[Io](objekt:io), the heat comes from tidal friction driven by the orbital resonance with
Io and [Ganymede](objekt:ganymede).

Because liquid water, chemical energy and organic compounds could come together there,
Europa is considered one of the most promising places to search for life beyond the
Earth. NASA's Europa Clipper and ESA's Juice are to study it more closely in the 2030s.
Overview: [Jupiter moons at NASA](quelle:nasa-jupitermonde); mission:
[Juice](quelle:esa-juice).
```

`de/gymnasium/objekt-ganymede.md`:
```markdown
# Ganymed

Ganymed ist der größte Mond im Sonnensystem. Mit 5 262 km Durchmesser übertrifft er den
Planeten [Merkur](objekt:mercury), hat aber nur 45 % von dessen Masse: Seine Dichte von
1,9 g/cm³ zeigt einen Körper aus etwa gleichen Teilen Gestein und Wassereis. Er umläuft
[Jupiter](objekt:jupiter) in 1,07 Millionen km Abstand in 7,15 Tagen und steht mit
[Io](objekt:io) und [Europa](objekt:europa) in der 1:2:4-Resonanz.

Als einziger bekannter Mond erzeugt Ganymed ein eigenes Magnetfeld, vermutlich in einem
flüssigen Eisenkern; die Raumsonde Galileo entdeckte es 1996. Es ist in Jupiters
Magnetfeld eingebettet und erzeugt eigene Polarlichter. Aus der Art, wie diese
Polarlichter hin- und herpendeln, schlossen Forschende 2015 mit dem Hubble-Teleskop auf
einen salzigen Ozean unter der Eiskruste, der das Pendeln dämpft.

Die Oberfläche zeigt zwei Landschaften: dunkle, alte und stark verkraterte Gebiete wie
Galileo Regio und hellere, jüngere Regionen mit langen Rillen und Furchen, die bei der
Dehnung der Eiskruste entstanden sind. Die ESA-Sonde Juice soll 2034 als erste Raumsonde
in eine Umlaufbahn um einen anderen Mond als den Erdmond einschwenken: um Ganymed.
Kennzahlen: [Faktenblatt der Jupitermonde](quelle:nssdc-jupitermonde); Mission:
[Juice](quelle:esa-juice).
```

`en/gymnasium/objekt-ganymede.md`:
```markdown
# Ganymede

Ganymede is the largest moon in the Solar System. At 5,262 km in diameter it exceeds
the planet [Mercury](objekt:mercury) but has only 45 % of its mass: its density of
1.9 g/cm³ indicates a body made of roughly equal parts rock and water ice. It orbits
[Jupiter](objekt:jupiter) at 1.07 million km in 7.15 days and shares the 1:2:4
resonance with [Io](objekt:io) and [Europa](objekt:europa).

Ganymede is the only known moon that generates its own magnetic field, probably in a
liquid iron core; the Galileo spacecraft discovered it in 1996. The field is embedded
in Jupiter's magnetic field and produces aurorae of its own. From the way these aurorae
rock back and forth, researchers using the Hubble telescope concluded in 2015 that a
salty ocean lies beneath the ice crust and damps the rocking.

The surface shows two kinds of landscape: dark, old and heavily cratered regions such as
Galileo Regio, and brighter, younger areas with long grooves and ridges that formed when
the ice crust was stretched. In 2034 ESA's Juice spacecraft is to become the first probe
to enter orbit around a moon other than the Earth's Moon: Ganymede. Key figures:
[Jovian Satellite Fact Sheet](quelle:nssdc-jupitermonde); mission:
[Juice](quelle:esa-juice).
```

`de/gymnasium/objekt-callisto.md`:
```markdown
# Kallisto

Kallisto ist der äußerste der Galileischen Monde und mit 4 821 km Durchmesser fast so
groß wie [Merkur](objekt:mercury), hat aber nur ein Drittel von dessen Masse. Er umläuft
[Jupiter](objekt:jupiter) in 1,88 Millionen km Abstand in 16,7 Tagen und gehört nicht
zur Resonanzkette von [Io](objekt:io), Europa und [Ganymed](objekt:ganymede). Ohne
diesen Takt fehlt ihm die Gezeitenheizung, die die inneren Monde geologisch aktiv hält.

Seine Oberfläche ist die am dichtesten verkraterte im Sonnensystem und mehrere
Milliarden Jahre alt. Das größte Einschlagbecken, Valhalla, ist ein System
konzentrischer Ringe von rund 3 800 km Durchmesser. Messungen der Raumsonde Galileo
zeigen, dass sich Gestein und Eis im Inneren nur teilweise getrennt haben; Kallisto ist
also nie vollständig aufgeschmolzen. Wie bei Europa und Ganymed deutet ein induziertes
Magnetfeld dennoch auf eine salzige, flüssige Schicht unter der Kruste hin.

Weil Kallisto außerhalb von Jupiters stärksten Strahlungsgürteln liegt, ist die
Strahlung dort weit schwächer als bei den inneren Monden. Studien haben ihn deshalb als
möglichen Standort einer Basis für künftige bemannte Missionen erwogen. Die ESA-Sonde
Juice wird ihn mehrfach nahe passieren. Kennzahlen:
[Faktenblatt der Jupitermonde](quelle:nssdc-jupitermonde); Mission:
[Juice](quelle:esa-juice).
```

`en/gymnasium/objekt-callisto.md`:
```markdown
# Callisto

Callisto is the outermost of the Galilean moons and, at 4,821 km in diameter, almost as
large as [Mercury](objekt:mercury), but with only a third of its mass. It orbits
[Jupiter](objekt:jupiter) at 1.88 million km in 16.7 days and is not part of the
resonance chain of [Io](objekt:io), Europa and [Ganymede](objekt:ganymede). Without
that rhythm it lacks the tidal heating that keeps the inner moons geologically active.

Its surface is the most densely cratered in the Solar System and several billion years
old. The largest impact basin, Valhalla, is a system of concentric rings about 3,800 km
across. Measurements by the Galileo spacecraft show that rock and ice in the interior
have separated only partially; Callisto has therefore never melted completely. As with
Europa and Ganymede, an induced magnetic field nevertheless points to a salty liquid
layer beneath the crust.

Because Callisto lies outside Jupiter's most intense radiation belts, radiation there
is far weaker than at the inner moons. Studies have therefore considered it as a
possible site for a base on future crewed missions. ESA's Juice spacecraft will pass it
closely several times. Key figures:
[Jovian Satellite Fact Sheet](quelle:nssdc-jupitermonde); mission:
[Juice](quelle:esa-juice).
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS; `dateien.test.ts` mit 120 Dateien, also 602 Fällen.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Gymnasialtexte: Jupiter und die Galileischen Monde"
```

---

### Task 6: Saturnmonde

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/gymnasium/objekt-{mimas,enceladus,tethys,dione,rhea,titan,iapetus}.md`

**Schnittstellen:**
- Konsumiert: Quellen `nssdc-saturnmonde`, `nasa-saturnmonde` (Task 2), `nasa-cassini`, `esa-cassini-huygens` (Etappe 1); Verweise `objekt:saturn`, `objekt:mimas`, `objekt:enceladus`, `objekt:tethys`, `objekt:dione`, `objekt:titan`, `objekt:iapetus`, `objekt:ganymede`, `objekt:mercury`, `szene:enceladus-hell`, `szene:titan-dunst`, `szene:iapetus-schief`, `thema:ringe`, `thema:gebundene-rotation`, `thema:modell`.
- Produziert: nichts für spätere Tasks.

Fürwörter wie in den Grundschultexten: Tethys „er", Dione und Rhea „sie".

- [ ] **Schritt 1: Dateien anlegen**

`de/gymnasium/objekt-mimas.md`:
```markdown
# Mimas

Mimas ist der innerste der großen Saturnmonde, mit 397 km Durchmesser gerade groß genug,
dass ihn die eigene Schwerkraft annähernd zur Kugel geformt hat. Er umläuft
[Saturn](objekt:saturn) in 186 000 km Abstand in knapp 23 Stunden. Seine geringe Dichte
von 1,15 g/cm³ zeigt, dass er fast ganz aus Wassereis besteht. Der Krater Herschel misst
rund 140 km, ein gutes Drittel des Monddurchmessers; ein nur wenig heftigerer Einschlag
hätte Mimas wohl zerbrochen.

Mimas prägt die [Ringe](thema:ringe): Teilchen am Außenrand des B-Rings umlaufen Saturn
genau zweimal, während Mimas einmal umläuft. In dieser 2:1-Resonanz werden sie immer an
derselben Stelle ihrer Bahn angezogen und aus dem Bereich gedrängt; so entsteht der
scharfe Innenrand der Cassini-Teilung.

Die Raumsonde Cassini hat gemessen, dass Mimas bei seinem Umlauf etwas stärker hin- und
herpendelt, als es ein durch und durch fester Eiskörper täte. Eine 2024 veröffentlichte
Auswertung erklärt das mit einem Ozean unter einer 20 bis 30 km dicken Eiskruste, der
erst vor weniger als 25 Millionen Jahren entstanden sein soll. Die alte, verkraterte
Oberfläche verrät davon nichts. Kennzahlen:
[Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde); Überblick:
[Saturnmonde bei NASA](quelle:nasa-saturnmonde).
```

`en/gymnasium/objekt-mimas.md`:
```markdown
# Mimas

Mimas is the innermost of Saturn's major moons, at 397 km in diameter just large enough
for its own gravity to have pulled it into a roughly spherical shape. It orbits
[Saturn](objekt:saturn) at 186,000 km in just under 23 hours. Its low density of
1.15 g/cm³ shows that it consists almost entirely of water ice. The crater Herschel is
about 140 km across, a good third of the moon's diameter; an only slightly more violent
impact would probably have shattered Mimas.

Mimas shapes the [rings](thema:ringe): particles at the outer edge of the B ring orbit
Saturn exactly twice while Mimas orbits once. In this 2:1 resonance they are pulled at
the same point of their orbit again and again and pushed out of the region; this
creates the sharp inner edge of the Cassini Division.

The Cassini spacecraft measured that Mimas rocks back and forth slightly more during
its orbit than a completely solid ice body would. An analysis published in 2024
explains this with an ocean beneath an ice crust 20 to 30 km thick, which is thought to
have formed less than 25 million years ago. The old, cratered surface gives no hint of
it. Key figures: [Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde); overview:
[Saturn moons at NASA](quelle:nasa-saturnmonde).
```

`de/gymnasium/objekt-enceladus.md`:
```markdown
# Enceladus

Enceladus misst nur 504 km, ist aber einer der aktivsten Körper im Sonnensystem. Seine
frische Eisoberfläche wirft rund 80 % des Sonnenlichts zurück, mehr als jeder andere
große Körper. Er umläuft [Saturn](objekt:saturn) in 238 000 km Abstand in 1,37 Tagen.

2005 entdeckte die Raumsonde [Cassini](quelle:nasa-cassini) am Südpol vier parallele
Bruchzonen, die Tigerstreifen. Aus ihnen schießen Fontänen aus Wasserdampf und
Eisteilchen hunderte Kilometer hoch. Ein Teil des Materials entkommt und speist Saturns
weit ausgedehnten, diffusen E-Ring. Cassini flog mehrfach durch die Fontänen und fand
darin Salze, winzige Körnchen aus Siliziumdioxid, molekularen Wasserstoff und organische
Verbindungen. Zusammen mit Cassinis Messungen des Schwerefelds und des Taumelns ergibt
sich daraus das Bild eines globalen salzigen Ozeans unter der Eiskruste, an dessen Boden
heißes Wasser mit Gestein reagiert, ähnlich wie an hydrothermalen Quellen in der Tiefsee
der Erde.

Die Wärme liefert Gezeitenreibung: Enceladus steht in einer 2:1-Resonanz mit
[Dione](objekt:dione), die seine Bahn leicht elliptisch hält. Weil flüssiges Wasser,
Energie und chemische Bausteine zusammenkommen, gilt er als aussichtsreicher Ort für die
Suche nach Leben. Szene: [Enceladus im hellen Glanz](szene:enceladus-hell); Kennzahlen:
[Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde).
```

`en/gymnasium/objekt-enceladus.md`:
```markdown
# Enceladus

Enceladus measures only 504 km, yet it is one of the most active bodies in the Solar
System. Its fresh ice surface reflects about 80 % of the sunlight, more than any other
large body. It orbits [Saturn](objekt:saturn) at 238,000 km in 1.37 days.

In 2005 the [Cassini](quelle:nasa-cassini) spacecraft discovered four parallel
fractures at the south pole, the tiger stripes. From them, jets of water vapour and ice
particles shoot hundreds of kilometres high. Part of the material escapes and feeds
Saturn's widely extended, diffuse E ring. Cassini flew through the plumes several times
and found salts, tiny grains of silica, molecular hydrogen and organic compounds.
Together with Cassini's measurements of the gravity field and of the moon's wobble,
this gives the picture of a global salty ocean beneath the ice crust, at whose floor hot
water reacts with rock, much like at hydrothermal vents in the Earth's deep sea.

The heat comes from tidal friction: Enceladus is in a 2:1 resonance with
[Dione](objekt:dione), which keeps its orbit slightly elliptical. Because liquid water,
energy and chemical building blocks come together, it is regarded as a promising place
to search for life. Scene: [Enceladus in brilliant light](szene:enceladus-hell); key
figures: [Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde).
```

`de/gymnasium/objekt-tethys.md`:
```markdown
# Tethys

Tethys hat 1 062 km Durchmesser und umläuft [Saturn](objekt:saturn) in 295 000 km
Abstand in 1,89 Tagen. Mit einer Dichte von knapp 1 g/cm³ besteht er fast
ausschließlich aus Wassereis. Zwei Strukturen beherrschen die Oberfläche: der
Einschlagkrater Odysseus mit rund 450 km Durchmesser, gut zwei Fünftel des Mondes, und
Ithaca Chasma, ein Grabensystem von bis zu 100 km Breite und etwa 2 000 km Länge. Ob der
Graben mit dem Einschlag zusammenhängt oder beim Gefrieren eines früheren inneren Ozeans
aufriss, ist nicht geklärt.

Tethys teilt seine Bahn mit zwei kleinen Monden: Telesto läuft ihm um 60° voraus,
Calypso folgt ihm um 60°. Beide sitzen in den Lagrange-Punkten L4 und L5. Dort gleichen
sich die Anziehung von Saturn und Tethys und die Fliehkraft des gemeinsamen Umlaufs so
aus, dass kleine Körper dauerhaft mitlaufen können. Dasselbe Muster zeigt
[Dione](objekt:dione) mit Helene und Polydeuces.

Wie alle großen inneren Saturnmonde zeigt Tethys seinem Planeten stets dieselbe Seite
([gebundene Rotation](thema:gebundene-rotation)). Kennzahlen:
[Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde); Überblick:
[Saturnmonde bei NASA](quelle:nasa-saturnmonde).
```

`en/gymnasium/objekt-tethys.md`:
```markdown
# Tethys

Tethys is 1,062 km in diameter and orbits [Saturn](objekt:saturn) at 295,000 km in
1.89 days. With a density of just under 1 g/cm³ it consists almost entirely of water
ice. Two features dominate the surface: the impact crater Odysseus, about 450 km across
and thus more than two fifths of the moon's diameter, and Ithaca Chasma, a system of
troughs up to 100 km wide and about 2,000 km long. Whether the trough is linked to the
impact or cracked open when an earlier internal ocean froze has not been settled.

Tethys shares its orbit with two small moons: Telesto runs 60° ahead of it, Calypso
follows 60° behind. Both sit at the Lagrange points L4 and L5. There, the pull of Saturn
and Tethys and the centrifugal force of the shared orbit balance in such a way that
small bodies can travel along permanently. [Dione](objekt:dione) shows the same pattern
with Helene and Polydeuces.

Like all of Saturn's major inner moons, Tethys always shows the same face to its planet
([tidal locking](thema:gebundene-rotation)). Key figures:
[Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde); overview:
[Saturn moons at NASA](quelle:nasa-saturnmonde).
```

`de/gymnasium/objekt-dione.md`:
```markdown
# Dione

Dione misst 1 123 km und umläuft [Saturn](objekt:saturn) in 377 000 km Abstand in
2,74 Tagen. Mit 1,48 g/cm³ ist sie dichter als [Tethys](objekt:tethys) und enthält neben
Eis einen deutlichen Anteil Gestein. Sie steht mit [Enceladus](objekt:enceladus) in
einer 2:1-Resonanz und hält dessen Bahn leicht elliptisch, so dass die Gezeitenheizung
dort nicht erlischt.

Auf ihrer in Umlaufrichtung hinteren Hälfte ziehen sich helle Streifen über dunkleres
Gelände. Nach den Voyager-Bildern hielt man sie für Ablagerungen von Frost; erst Cassini
zeigte 2004, dass es hunderte Meter hohe Steilwände aus Eis entlang von Bruchzonen der
Kruste sind. Auffällig ist auch, dass die hintere Hälfte stärker verkratert ist als die
vordere, obwohl ein gebunden rotierender Mond vorn mehr Einschläge abbekommen sollte.
Eine Erklärung: Ein großer Einschlag hat Dione in ihrer Frühzeit herumgedreht.

Schwerefeldmessungen von Cassini lassen einen Ozean unter einer rund 100 km dicken
Kruste möglich erscheinen. Wie Tethys teilt Dione ihre Bahn mit zwei kleinen Trojanern,
Helene und Polydeuces. Kennzahlen:
[Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde); Überblick:
[Saturnmonde bei NASA](quelle:nasa-saturnmonde).
```

`en/gymnasium/objekt-dione.md`:
```markdown
# Dione

Dione measures 1,123 km and orbits [Saturn](objekt:saturn) at 377,000 km in 2.74 days.
At 1.48 g/cm³ it is denser than [Tethys](objekt:tethys) and contains a significant
share of rock besides ice. It is in a 2:1 resonance with [Enceladus](objekt:enceladus)
and keeps that moon's orbit slightly elliptical, so that the tidal heating there does
not die out.

Bright streaks run across darker terrain on its trailing hemisphere, the half that
faces backwards along the orbit. After the Voyager images they were taken for frost
deposits; only Cassini showed in 2004 that they are ice cliffs hundreds of metres high
along fracture zones in the crust. Also striking is that the trailing hemisphere is
more heavily cratered than the leading one, although a tidally locked moon should
receive more impacts at the front. One explanation: a large impact spun Dione around
early in its history.

Gravity measurements by Cassini make an ocean beneath a crust about 100 km thick seem
possible. Like Tethys, Dione shares its orbit with two small trojans, Helene and
Polydeuces. Key figures: [Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde);
overview: [Saturn moons at NASA](quelle:nasa-saturnmonde).
```

`de/gymnasium/objekt-rhea.md`:
```markdown
# Rhea

Rhea ist mit 1 527 km Durchmesser der zweitgrößte Saturnmond und umläuft
[Saturn](objekt:saturn) in 527 000 km Abstand in 4,5 Tagen. Ihre Dichte von 1,24 g/cm³
entspricht etwa drei Vierteln Eis und einem Viertel Gestein. Cassinis Schweremessungen
passen zu einem Inneren, in dem sich Gestein und Eis wohl nie vollständig getrennt
haben.

Die Oberfläche ist alt und dicht verkratert, mit großen Becken wie Tirawa (gut 350 km).
Auf der in Umlaufrichtung hinteren Hälfte ziehen sich, wie bei [Dione](objekt:dione),
helle Streifen aus Eisklippen entlang alter Bruchzonen. Zu den auffälligsten Merkmalen
gehört der junge Krater Inktomi mit seinen hellen Strahlen aus Auswurfmaterial.

2010 wies Cassini über Rhea eine hauchdünne Exosphäre aus Sauerstoff und Kohlendioxid
nach. Der Sauerstoff entsteht, wenn energiereiche Teilchen aus Saturns Magnetosphäre auf
das Oberflächeneis treffen und Wassermoleküle spalten. Eine 2008 vermutete schwache
Ringscheibe um Rhea bestätigte sich bei gezielten Beobachtungen nicht. Von den großen
Monden kreisen nur [Titan](objekt:titan) und [Iapetus](objekt:iapetus) weiter draußen.
Kennzahlen: [Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde); Überblick:
[Saturnmonde bei NASA](quelle:nasa-saturnmonde).
```

`en/gymnasium/objekt-rhea.md`:
```markdown
# Rhea

At 1,527 km in diameter, Rhea is Saturn's second-largest moon; it orbits
[Saturn](objekt:saturn) at 527,000 km in 4.5 days. Its density of 1.24 g/cm³
corresponds to about three quarters ice and one quarter rock. Cassini's gravity
measurements fit an interior in which rock and ice probably never fully separated.

The surface is old and densely cratered, with large basins such as Tirawa (just over
350 km). On the trailing hemisphere, as on [Dione](objekt:dione), bright streaks of ice
cliffs run along old fracture zones. Among the most striking features is the young
crater Inktomi with its bright rays of ejected material.

In 2010 Cassini detected a very thin exosphere of oxygen and carbon dioxide around
Rhea. The oxygen forms when energetic particles from Saturn's magnetosphere strike the
surface ice and split water molecules. A faint ring disc suspected around Rhea in 2008
was not confirmed by targeted observations. Of the major moons, only
[Titan](objekt:titan) and [Iapetus](objekt:iapetus) orbit farther out. Key figures:
[Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde); overview:
[Saturn moons at NASA](quelle:nasa-saturnmonde).
```

`de/gymnasium/objekt-titan.md`:
```markdown
# Titan

Titan ist mit 5 150 km Durchmesser der größte Saturnmond und nach
[Ganymed](objekt:ganymede) der zweitgrößte Mond im Sonnensystem, größer als
[Merkur](objekt:mercury), aber mit nur 41 % von dessen Masse. Er umläuft
[Saturn](objekt:saturn) in 1,22 Millionen km Abstand in knapp 16 Tagen.

Als einziger Mond besitzt Titan eine dichte Atmosphäre: überwiegend Stickstoff mit
einigen Prozent Methan, am Boden mit etwa 1,5 bar Druck dichter als die Lufthülle der
Erde. Sonnenlicht spaltet Methan in der Hochatmosphäre; daraus entstehen organische
Verbindungen, die als orangefarbener Dunst die Oberfläche verhüllen. Bei rund −180 °C
spielt Methan die Rolle, die Wasser auf der Erde hat: Es bildet Wolken, regnet ab, füllt
Flussbetten und Seen wie Kraken Mare und Ligeia Mare nahe dem Nordpol. Die Dünenfelder
am Äquator bestehen aus organischen Körnern.

Am 14. Januar 2005 landete die europäische Sonde [Huygens](quelle:esa-cassini-huygens)
auf Titan, die bis heute fernste Landung. Messungen von Cassini zeigen, wie stark sich
Titan unter Saturns Gezeiten verformt; das spricht für einen Ozean aus Wasser tief unter
der Eiskruste. Szene: [Titan im Dunst vor Saturn](szene:titan-dunst); Kennzahlen:
[Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde); Mission:
[Cassini](quelle:nasa-cassini).
```

`en/gymnasium/objekt-titan.md`:
```markdown
# Titan

At 5,150 km in diameter, Titan is Saturn's largest moon and, after
[Ganymede](objekt:ganymede), the second-largest moon in the Solar System, larger than
[Mercury](objekt:mercury) but with only 41 % of its mass. It orbits
[Saturn](objekt:saturn) at 1.22 million km in just under 16 days.

Titan is the only moon with a dense atmosphere: mostly nitrogen with a few per cent
methane, and at about 1.5 bar at the ground denser than the Earth's atmosphere.
Sunlight splits methane in the upper atmosphere; this produces organic compounds that
shroud the surface as an orange haze. At around −180 °C, methane plays the role that
water plays on the Earth: it forms clouds, rains down, and fills river beds and lakes
such as Kraken Mare and Ligeia Mare near the north pole. The dune fields at the equator
consist of organic grains.

On 14 January 2005 the European probe [Huygens](quelle:esa-cassini-huygens) landed on
Titan, still the most distant landing ever made. Cassini's measurements show how
strongly Titan deforms under Saturn's tides; this points to an ocean of water deep
beneath the ice crust. Scene: [Hazy Titan in front of Saturn](szene:titan-dunst); key
figures: [Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde); mission:
[Cassini](quelle:nasa-cassini).
```

`de/gymnasium/objekt-iapetus.md`:
```markdown
# Iapetus

Iapetus misst 1 469 km und umläuft [Saturn](objekt:saturn) weit draußen, in
3,56 Millionen km Abstand, in 79 Tagen. Seine Bahn ist um gut 15° gegen Saturns
Äquatorebene geneigt, viel stärker als die der inneren Monde. In dieser Entfernung zerrt
neben Saturns abgeplattetem Äquatorwulst auch die Sonne merklich an der Bahn; deren
Ebene kreiselt deshalb um eine Laplace-Ebene zwischen Saturns Äquator und seiner
Bahnebene. Die Simulation bildet das vereinfacht nach
([Grenzen des Modells](thema:modell)). Iapetus ist der einzige große Saturnmond, von
dem aus man die Ringe schräg sähe.

Auffälligstes Merkmal ist der Helligkeitskontrast: Die in Umlaufrichtung vordere Hälfte,
Cassini Regio, wirft nur etwa 5 % des Lichts zurück, die hintere rund 50 %. Nach
heutiger Erklärung beginnt der Kontrast mit dunklem Staub von außen, vom fernen Mond
Phoebe und dessen riesigem Staubring, den Iapetus auf seiner Vorderseite aufsammelt. Die
dunklen Flächen erwärmen sich stärker; Eis verdampft dort und schlägt sich auf den
kälteren, hellen Gebieten nieder. So verstärkt sich der Unterschied von selbst.

Längs des Äquators zieht sich ein bis zu 13 km hoher Gebirgsrücken über rund 1 300 km,
der Iapetus die Form einer Walnuss gibt. Seine abgeplattete Gestalt passt zu einer
früheren, schnelleren Rotation, die in der Kruste eingefroren ist. Szene:
[Die geneigte Bahn des Iapetus](szene:iapetus-schief); Kennzahlen:
[Faktenblatt der Saturnmonde](quelle:nssdc-saturnmonde); Überblick:
[Saturnmonde bei NASA](quelle:nasa-saturnmonde).
```

`en/gymnasium/objekt-iapetus.md`:
```markdown
# Iapetus

Iapetus measures 1,469 km and orbits [Saturn](objekt:saturn) far out, at
3.56 million km, in 79 days. Its orbit is inclined by just over 15° to Saturn's
equatorial plane, much more than those of the inner moons. At this distance, besides
Saturn's flattened equatorial bulge, the Sun also pulls noticeably on the orbit; its
plane therefore precesses around a Laplace plane lying between Saturn's equator and its
orbital plane. The simulation reproduces this in simplified form
([limits of the model](thema:modell)). Iapetus is the only major moon of Saturn from
which the rings would be seen at an angle.

Its most striking feature is the brightness contrast: the leading hemisphere, Cassini
Regio, reflects only about 5 % of the light, the trailing hemisphere about 50 %.
According to the current explanation, the contrast starts with dark dust from outside,
from the distant moon Phoebe and its huge dust ring, which Iapetus sweeps up on its
leading side. The dark areas warm up more; ice evaporates there and condenses on the
colder, bright regions. In this way the difference reinforces itself.

Along the equator runs a mountain ridge up to 13 km high and about 1,300 km long, which
gives Iapetus the shape of a walnut. Its flattened shape fits an earlier, faster
rotation frozen into the crust. Scene:
[The tilted orbit of Iapetus](szene:iapetus-schief); key figures:
[Saturnian Satellite Fact Sheet](quelle:nssdc-saturnmonde); overview:
[Saturn moons at NASA](quelle:nasa-saturnmonde).
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS; `dateien.test.ts` mit 134 Dateien, also 672 Fällen.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Gymnasialtexte: Saturnmonde"
```

---

### Task 7: Uranus, Neptun und ihre Monde

**Dateien:**
- Ändern: `src/data/texte/{de,en}/grundschule/objekt-oberon.md` (Nachtrag aus Etappe 2, Ruling 13)
- Erstellen: `src/data/texte/{de,en}/gymnasium/objekt-{uranus,miranda,ariel,umbriel,titania,oberon,neptune,triton}.md`

**Schnittstellen:**
- Konsumiert: `achsneigungDeg` aus Task 1 (Uranus 97,8° im Datenblock); Quellen `nssdc-uranus`, `nssdc-neptune`, `nssdc-uranusmonde`, `nasa-uranusmonde`, `nasa-triton`, `nasa-voyager-2` (Task 2); Verweise `objekt:earth`, `objekt:uranus`, `objekt:neptune`, `objekt:miranda`, `objekt:ariel`, `objekt:umbriel`, `objekt:titania`, `objekt:oberon`, `objekt:triton`, `objekt:pluto`, `szene:uranus-gekippt`, `szene:ferne-sonne`, `szene:triton-rueckwaerts`, `thema:achsneigung`, `thema:ringe`, `thema:gebundene-rotation`, `thema:modell`.
- Produziert: nichts für spätere Tasks.

Fürwörter wie in den Grundschultexten: Miranda, Ariel, Umbriel, Oberon, Triton „er", Titania „sie".

- [ ] **Schritt 1: Grundschultext Oberon präzisieren**

Zurückgestellt aus Etappe 2 (Ruling 13): Die Höhe des Bergs am Rand des Voyager-Bilds wird je nach Auswertung auf 6 bis 11 km geschätzt; „etwa sechs Kilometer" nennt nur den unteren Rand. Der Grundschultext nennt deshalb keine Zahl.

`de/grundschule/objekt-oberon.md` vollständig ersetzen:
```markdown
# Oberon

Oberon ist der äußerste der großen Monde des [Uranus](objekt:uranus) und fast so
groß wie Titania. Seine alte Oberfläche ist voller Krater; in manchen liegt dunkles
Material am Boden, das wohl aus dem Inneren hochgekommen ist. Am Rand des Mondes ragt
ein Berg auf, der mehrere Kilometer hoch ist. Oberon braucht fast zwei Wochen für
eine Runde um Uranus.
```

`en/grundschule/objekt-oberon.md` vollständig ersetzen:
```markdown
# Oberon

Oberon is the outermost of the big moons of [Uranus](objekt:uranus) and almost as
large as Titania. Its old surface is full of craters; some have dark material on
their floors that probably came up from the inside. At the edge of the moon a
mountain rises several kilometres high. Oberon needs almost two weeks for one lap
around Uranus.
```

- [ ] **Schritt 2: Gymnasialtexte anlegen**

`de/gymnasium/objekt-uranus.md`:
```markdown
# Uranus

Uranus ist mit 50 724 km Durchmesser viermal so groß wie die [Erde](objekt:earth) und
hat knapp 15 Erdmassen. Er umläuft die Sonne in 19,2 AE Abstand in 84 Jahren. Wie
[Neptun](objekt:neptune) zählt er zu den Eisriesen: Unter einer Hülle aus Wasserstoff
und Helium liegt vermutlich ein dichter Mantel aus Wasser, Ammoniak und Methan, der als
heiße Flüssigkeit unter hohem Druck steht. Methan in der oberen Atmosphäre schluckt
rotes Licht und gibt dem Planeten seine blaugrüne Farbe.

Seine Drehachse ist um 98° gegen die Bahn geneigt; Uranus liegt auf der Seite und dreht
sich, formal gezählt, rückläufig in gut 17 Stunden. Im Lauf eines Umlaufs zeigt jeder
Pol rund 42 Jahre lang zur Sonne und danach ebenso lange in die Dunkelheit
([Achsneigung](thema:achsneigung)). Ungewöhnlich ist auch das Magnetfeld: Es ist um 59°
gegen die Drehachse gekippt und sitzt nicht im Zentrum des Planeten. Anders als die
übrigen Riesenplaneten gibt Uranus kaum mehr Wärme ab, als er von der Sonne erhält.

William Herschel entdeckte ihn 1781, als ersten Planeten mit dem Fernrohr. Er hat
schmale, dunkle [Ringe](thema:ringe) und fast 30 bekannte Monde, benannt nach Figuren
bei Shakespeare und Pope; die fünf großen sind [Miranda](objekt:miranda),
[Ariel](objekt:ariel), [Umbriel](objekt:umbriel), [Titania](objekt:titania) und
[Oberon](objekt:oberon). Bisher hat nur Voyager 2 ihn besucht, 1986. Szene:
[Der liegende Uranus](szene:uranus-gekippt); Kennzahlen:
[NSSDC Uranus Fact Sheet](quelle:nssdc-uranus); Mission:
[Voyager 2](quelle:nasa-voyager-2).
```

`en/gymnasium/objekt-uranus.md`:
```markdown
# Uranus

With a diameter of 50,724 km, Uranus is four times the size of the
[Earth](objekt:earth) and has almost 15 Earth masses. It orbits the Sun at 19.2 AU in
84 years. Like [Neptune](objekt:neptune) it is an ice giant: beneath an envelope of
hydrogen and helium there is probably a dense mantle of water, ammonia and methane in
the form of a hot fluid under high pressure. Methane in the upper atmosphere absorbs red
light and gives the planet its blue-green colour.

Its rotation axis is tilted by 98° to its orbit; Uranus lies on its side and, formally
counted, rotates retrograde in just over 17 hours. Over one orbit, each pole points
towards the Sun for about 42 years and then into darkness for just as long
([axial tilt](thema:achsneigung)). Its magnetic field is unusual too: it is tilted by
59° to the rotation axis and is not centred in the planet. Unlike the other giant
planets, Uranus gives off hardly more heat than it receives from the Sun.

William Herschel discovered it in 1781, the first planet found with a telescope. It has
narrow, dark [rings](thema:ringe) and almost 30 known moons, named after characters from
Shakespeare and Pope; the five large ones are [Miranda](objekt:miranda),
[Ariel](objekt:ariel), [Umbriel](objekt:umbriel), [Titania](objekt:titania) and
[Oberon](objekt:oberon). So far only Voyager 2 has visited it, in 1986. Scene:
[Uranus lying on its side](szene:uranus-gekippt); key figures:
[NSSDC Uranus Fact Sheet](quelle:nssdc-uranus); mission:
[Voyager 2](quelle:nasa-voyager-2).
```

`de/gymnasium/objekt-miranda.md`:
```markdown
# Miranda

Miranda ist mit 471 km Durchmesser der kleinste und innerste der fünf großen
Uranusmonde. Er umläuft [Uranus](objekt:uranus) in 130 000 km Abstand in 1,4 Tagen;
seine Bahn ist mit gut 4° stärker gegen den Uranusäquator geneigt als die der anderen
großen Monde.

Voyager 2 fotografierte 1986 nur die Südhalbkugel, doch die Bilder zeigten eine der
seltsamsten Oberflächen im Sonnensystem. Alte, verkraterte Ebenen grenzen unvermittelt
an drei große Coronae, ovale bis eckige Gebiete mit parallelen Rillen und Rücken. Die
Steilwand Verona Rupes ist rund 20 km hoch, die höchste bekannte Klippe im
Sonnensystem. Bei Mirandas geringer Schwerkraft dauerte ein Sturz von ihrer Kante rund
zwölf Minuten.

Früher hielt man Miranda für einen Mond, der bei einem Zusammenstoß zerbrach und sich
neu zusammenfügte. Heute erklären die meisten Modelle die Coronae mit wärmerem Eis, das
von unten aufstieg. Die Wärme stammte wohl aus Gezeitenreibung in einer früheren
Bahnresonanz mit [Umbriel](objekt:umbriel) oder [Ariel](objekt:ariel), die auch die
erhöhte Bahnneigung erklären könnte. Überblick:
[Uranusmonde bei NASA](quelle:nasa-uranusmonde); Kennzahlen:
[Faktenblatt der Uranusmonde](quelle:nssdc-uranusmonde); Mission:
[Voyager 2](quelle:nasa-voyager-2).
```

`en/gymnasium/objekt-miranda.md`:
```markdown
# Miranda

At 471 km in diameter, Miranda is the smallest and innermost of the five large moons of
Uranus. It orbits [Uranus](objekt:uranus) at 130,000 km in 1.4 days; at just over 4°,
its orbit is more steeply inclined to the Uranian equator than those of the other large
moons.

In 1986 Voyager 2 photographed only the southern hemisphere, yet the images revealed
one of the strangest surfaces in the Solar System. Old cratered plains border abruptly
on three large coronae, oval to angular regions with parallel grooves and ridges. The
cliff Verona Rupes is about 20 km high, the tallest known cliff in the Solar System. In
Miranda's weak gravity, a fall from its edge would take about twelve minutes.

Miranda was once thought to be a moon that shattered in a collision and reassembled.
Today, most models explain the coronae by warmer ice rising from below. The heat
probably came from tidal friction in an earlier orbital resonance with
[Umbriel](objekt:umbriel) or [Ariel](objekt:ariel), which could also explain the
increased inclination. Overview: [Uranus moons at NASA](quelle:nasa-uranusmonde); key
figures: [Uranian Satellite Fact Sheet](quelle:nssdc-uranusmonde); mission:
[Voyager 2](quelle:nasa-voyager-2).
```

`de/gymnasium/objekt-ariel.md`:
```markdown
# Ariel

Ariel misst 1 158 km und umläuft [Uranus](objekt:uranus) in 191 000 km Abstand in
2,5 Tagen. Er ist der hellste der großen Uranusmonde und hat die jüngste Oberfläche
unter ihnen: Große Einschlagbecken fehlen weitgehend, die meisten Krater sind klein.

Quer über die Oberfläche ziehen sich lange Grabenbrüche, deren Böden oft glatt
aufgefüllt sind, vermutlich von zähflüssigem Eis, das aus dem Inneren aufstieg. Ariel
war also einmal geologisch aktiv. Als Wärmequelle kommen Gezeiten in früheren
Bahnresonanzen mit anderen Uranusmonden in Frage; heute ist seine Bahn nahezu
kreisförmig.

Teleskopbeobachtungen, zuletzt mit dem James-Webb-Weltraumteleskop, fanden auf Ariel
Kohlendioxid-Eis, vor allem auf der in Umlaufrichtung hinteren Hälfte, außerdem
Kohlenmonoxid und Hinweise auf Carbonate. Weil Kohlendioxid-Eis dort nicht lange
beständig ist, muss es laufend nachgeliefert werden, durch Strahlung aus der
Magnetosphäre des Uranus oder aus dem Inneren. Manche Forschende halten deshalb einen
Ozean unter der Kruste für möglich. Ariel ist fast so groß wie
[Umbriel](objekt:umbriel), aber deutlich heller. Kennzahlen:
[Faktenblatt der Uranusmonde](quelle:nssdc-uranusmonde); Überblick:
[Uranusmonde bei NASA](quelle:nasa-uranusmonde).
```

`en/gymnasium/objekt-ariel.md`:
```markdown
# Ariel

Ariel measures 1,158 km and orbits [Uranus](objekt:uranus) at 191,000 km in 2.5 days.
It is the brightest of the large Uranian moons and has the youngest surface among them:
large impact basins are largely absent, and most craters are small.

Long rift valleys cross the surface, their floors often smoothly filled, probably by
viscous ice that rose from the interior. Ariel was therefore once geologically active.
Tides in earlier orbital resonances with other Uranian moons are a possible heat
source; today its orbit is almost circular.

Telescope observations, most recently with the James Webb Space Telescope, have found
carbon dioxide ice on Ariel, mainly on its trailing hemisphere, as well as carbon
monoxide and hints of carbonates. Because carbon dioxide ice does not last long there,
it must be continually replenished, by radiation from the magnetosphere of Uranus or
from the interior. Some researchers therefore consider an ocean beneath the crust
possible. Ariel is almost as large as [Umbriel](objekt:umbriel) but considerably
brighter. Key figures: [Uranian Satellite Fact Sheet](quelle:nssdc-uranusmonde);
overview: [Uranus moons at NASA](quelle:nasa-uranusmonde).
```

`de/gymnasium/objekt-umbriel.md`:
```markdown
# Umbriel

Umbriel misst 1 169 km und ist damit knapp größer als [Ariel](objekt:ariel). Er umläuft
[Uranus](objekt:uranus) in 266 000 km Abstand in 4,1 Tagen. Mit einer geometrischen
Albedo um 0,2 ist er der dunkelste der großen Uranusmonde.

Seine Oberfläche ist alt und gleichmäßig mit großen Kratern bedeckt; Spuren späterer
geologischer Aktivität wie bei Ariel oder [Titania](objekt:titania) fehlen weitgehend.
Umso auffälliger ist ein heller Ring von rund 80 km Durchmesser auf dem Boden des
Kraters Wunda nahe dem Äquator. Woraus er besteht, ist unklar; diskutiert werden
Ablagerungen von Kohlendioxid-Eis oder frisches Material eines Einschlags.

Warum Umbriel so viel dunkler ist als seine Nachbarn, ist ebenfalls offen. Eine
Deutung: Die Oberfläche ist sehr alt und hat über Milliarden Jahre unter Strahlung
dunkles, kohlenstoffreiches Material angereichert, das bei den aktiveren Monden
überdeckt wurde. Wie alle großen Uranusmonde ist Umbriel
[gebunden](thema:gebundene-rotation) und läuft in der Äquatorebene des stark gekippten
Planeten, erlebt also dieselben extremen Jahreszeiten. Kennzahlen:
[Faktenblatt der Uranusmonde](quelle:nssdc-uranusmonde); Überblick:
[Uranusmonde bei NASA](quelle:nasa-uranusmonde).
```

`en/gymnasium/objekt-umbriel.md`:
```markdown
# Umbriel

Umbriel measures 1,169 km and is thus slightly larger than [Ariel](objekt:ariel). It
orbits [Uranus](objekt:uranus) at 266,000 km in 4.1 days. With a geometric albedo of
about 0.2 it is the darkest of the large Uranian moons.

Its surface is old and evenly covered with large craters; traces of later geological
activity like those on Ariel or [Titania](objekt:titania) are largely absent. All the
more striking is a bright ring about 80 km across on the floor of the crater Wunda near
the equator. What it consists of is unclear; deposits of carbon dioxide ice or fresh
material from an impact are being discussed.

Why Umbriel is so much darker than its neighbours is also an open question. One
interpretation: the surface is very old and, over billions of years, radiation has
enriched it with dark, carbon-rich material that was covered up on the more active
moons. Like all the large Uranian moons, Umbriel is
[tidally locked](thema:gebundene-rotation) and orbits in the equatorial plane of the
strongly tilted planet, so it experiences the same extreme seasons. Key figures:
[Uranian Satellite Fact Sheet](quelle:nssdc-uranusmonde); overview:
[Uranus moons at NASA](quelle:nasa-uranusmonde).
```

`de/gymnasium/objekt-titania.md`:
```markdown
# Titania

Titania ist mit 1 578 km Durchmesser der größte Uranusmond, knapp halb so groß wie der
Erdmond. Sie umläuft [Uranus](objekt:uranus) in 436 000 km Abstand in 8,7 Tagen. Ihre
Dichte von 1,7 g/cm³ spricht für etwa gleiche Anteile Eis und Gestein; vermutlich hat
sich ein Gesteinskern von einem Eismantel getrennt.

Über die Oberfläche ziehen sich gewaltige Grabenbrüche, allen voran Messina Chasma mit
rund 1 500 km Länge. Sie entstanden wohl, als das Innere gefror und sich ausdehnte, so
dass die Kruste aufriss. Große alte Krater wie Gertrude mit gut 300 km Durchmesser sind
teilweise von jüngeren Ablagerungen überdeckt, ein Hinweis auf frühere Aktivität.

2001 zog Titania von der Erde aus gesehen vor einem Stern vorbei. Das Sternlicht erlosch
abrupt, statt allmählich schwächer zu werden; eine nennenswerte Atmosphäre hat Titania
also nicht. Ob zwischen Kern und Mantel noch eine dünne flüssige Schicht existiert, ist
offen. Benannt ist sie nach der Feenkönigin in Shakespeares Sommernachtstraum, wie ihr
Gemahl [Oberon](objekt:oberon). Kennzahlen:
[Faktenblatt der Uranusmonde](quelle:nssdc-uranusmonde); Mission:
[Voyager 2](quelle:nasa-voyager-2).
```

`en/gymnasium/objekt-titania.md`:
```markdown
# Titania

At 1,578 km in diameter, Titania is the largest moon of Uranus, a little under half the
size of the Earth's Moon. It orbits [Uranus](objekt:uranus) at 436,000 km in 8.7 days.
Its density of 1.7 g/cm³ suggests roughly equal parts ice and rock; a rocky core has
probably separated from an icy mantle.

Enormous rift valleys run across the surface, above all Messina Chasma, about 1,500 km
long. They probably formed when the interior froze and expanded, cracking the crust.
Large old craters such as Gertrude, just over 300 km across, are partly covered by
younger deposits, a sign of earlier activity.

In 2001 Titania passed in front of a star as seen from Earth. The starlight vanished
abruptly instead of fading gradually, so Titania has no significant atmosphere. Whether
a thin liquid layer still exists between core and mantle is an open question. It is
named after the queen of the fairies in Shakespeare's A Midsummer Night's Dream, like
her consort [Oberon](objekt:oberon). Key figures:
[Uranian Satellite Fact Sheet](quelle:nssdc-uranusmonde); mission:
[Voyager 2](quelle:nasa-voyager-2).
```

`de/gymnasium/objekt-oberon.md`:
```markdown
# Oberon

Oberon ist mit 1 523 km Durchmesser der zweitgrößte und äußerste der großen
Uranusmonde. Er umläuft [Uranus](objekt:uranus) in 584 000 km Abstand in 13,5 Tagen und
liegt damit zeitweise außerhalb von dessen Magnetosphäre.

Die Oberfläche ist alt und die am stärksten verkraterte unter den Uranusmonden. Auf den
Böden mancher großer Krater, etwa Hamlet mit gut 200 km Durchmesser, liegt dunkles
Material, das vermutlich nach den Einschlägen aus dem Inneren aufgestiegen ist. Ein
langer Grabenbruch, Mommur Chasma, zeugt davon, dass sich auch hier das Innere einmal
ausgedehnt hat. Am Rand eines Voyager-Bildes ragt ein Berg auf, dessen Höhe je nach
Auswertung auf 6 bis 11 km geschätzt wird.

Die Kenntnisse über Oberon stammen fast vollständig von einem einzigen Vorbeiflug:
Voyager 2 passierte das Uranussystem im Januar 1986 und sah dabei nur die Südhalbkugeln
der Monde, auf denen gerade Sommer herrschte. Wie bei [Titania](objekt:titania) lässt
die Dichte von 1,6 g/cm³ auf etwa gleiche Teile Eis und Gestein schließen. Kennzahlen:
[Faktenblatt der Uranusmonde](quelle:nssdc-uranusmonde); Mission:
[Voyager 2](quelle:nasa-voyager-2).
```

`en/gymnasium/objekt-oberon.md`:
```markdown
# Oberon

At 1,523 km in diameter, Oberon is the second-largest and outermost of the large moons
of Uranus. It orbits [Uranus](objekt:uranus) at 584,000 km in 13.5 days and at times
lies outside the planet's magnetosphere.

Its surface is old and the most heavily cratered among the Uranian moons. On the floors
of some large craters, such as Hamlet, just over 200 km across, lies dark material that
probably welled up from the interior after the impacts. A long rift valley, Mommur
Chasma, shows that the interior once expanded here too. On the edge of a Voyager image
a mountain rises whose height is estimated at 6 to 11 km, depending on the analysis.

What we know about Oberon comes almost entirely from a single flyby: Voyager 2 passed
through the Uranian system in January 1986 and saw only the southern hemispheres of the
moons, where it was summer at the time. As with [Titania](objekt:titania), a density of
1.6 g/cm³ indicates roughly equal parts ice and rock. Key figures:
[Uranian Satellite Fact Sheet](quelle:nssdc-uranusmonde); mission:
[Voyager 2](quelle:nasa-voyager-2).
```

`de/gymnasium/objekt-neptune.md`:
```markdown
# Neptun

Neptun ist mit 49 244 km Durchmesser etwas kleiner als [Uranus](objekt:uranus), hat aber
mit 17 Erdmassen mehr Masse und ist mit 1,64 g/cm³ der dichteste Riesenplanet. Er
umläuft die Sonne in 30,1 AE Abstand in 165 Jahren auf einer fast kreisförmigen Bahn.
Das Sonnenlicht braucht gut vier Stunden bis zu ihm und ist dort rund 900-mal schwächer
als bei der Erde.

Neptun wurde nicht zufällig entdeckt, sondern berechnet: Uranus wich von seiner
vorausberechneten Bahn ab. Urbain Le Verrier schloss daraus auf einen unbekannten,
weiter außen ziehenden Planeten und sagte dessen Ort voraus; Johann Gottfried Galle fand
ihn 1846 in Berlin nur etwa ein Grad davon entfernt. Solche gegenseitigen Bahnstörungen
rechnet die Simulation nicht ([Grenzen des Modells](thema:modell)).

Obwohl Neptun so weit von der Sonne entfernt ist, ist seine Atmosphäre sehr bewegt:
Winde erreichen rund 2 000 km/h, die höchsten im Sonnensystem. Er strahlt etwa das
2,6-Fache der Energie ab, die er von der Sonne empfängt; innere Wärme treibt das Wetter.
Voyager 2 sah 1989 einen Großen Dunklen Fleck, der wenige Jahre später verschwunden
war. Neptun hat dunkle [Ringe](thema:ringe) und 16 bekannte Monde, darunter
[Triton](objekt:triton). Szenen: [Von Neptun zur fernen Sonne](szene:ferne-sonne),
[Tritons rückläufige Bahn](szene:triton-rueckwaerts); Kennzahlen:
[NSSDC Neptune Fact Sheet](quelle:nssdc-neptune).
```

`en/gymnasium/objekt-neptune.md`:
```markdown
# Neptune

At 49,244 km in diameter, Neptune is slightly smaller than [Uranus](objekt:uranus) but,
at 17 Earth masses, more massive, and at 1.64 g/cm³ it is the densest giant planet. It
orbits the Sun at 30.1 AU in 165 years on an almost circular orbit. Sunlight takes just
over four hours to reach it and is about 900 times weaker there than at the Earth.

Neptune was not found by chance but calculated: Uranus deviated from its predicted
orbit. Urbain Le Verrier concluded that an unknown planet farther out was responsible
and predicted its position; in 1846 Johann Gottfried Galle found it in Berlin only
about one degree away. The simulation does not compute such mutual perturbations
([limits of the model](thema:modell)).

Although Neptune is so far from the Sun, its atmosphere is very turbulent: winds reach
about 2,000 km/h, the fastest in the Solar System. It radiates about 2.6 times the
energy it receives from the Sun; internal heat drives the weather. In 1989 Voyager 2
saw a Great Dark Spot that had vanished a few years later. Neptune has dark
[rings](thema:ringe) and 16 known moons, including [Triton](objekt:triton). Scenes:
[From Neptune to the distant Sun](szene:ferne-sonne),
[Triton's retrograde orbit](szene:triton-rueckwaerts); key figures:
[NSSDC Neptune Fact Sheet](quelle:nssdc-neptune).
```

`de/gymnasium/objekt-triton.md`:
```markdown
# Triton

Triton ist mit 2 707 km Durchmesser der größte Neptunmond und der siebtgrößte Mond im
Sonnensystem. Er umläuft [Neptun](objekt:neptune) in 355 000 km Abstand in 5,9 Tagen,
aber rückläufig, entgegen Neptuns Drehsinn, auf einer um rund 157° gegen dessen Äquator
geneigten Bahn. Kein anderer großer Mond läuft so. In einer gemeinsamen Staub- und
Gasscheibe mit dem Planeten kann Triton deshalb nicht entstanden sein; er wurde
vermutlich aus dem Kuipergürtel eingefangen und ist damit ein Verwandter von
[Pluto](objekt:pluto), dem er in Größe und Dichte ähnelt.

Die rückläufige Bahn hat Folgen: Die Gezeiten bremsen Triton, so dass er sich Neptun
langsam nähert. In einigen Milliarden Jahren wird er innerhalb der Roche-Grenze von den
Gezeitenkräften zerrissen und könnte ein Ringsystem bilden.

Voyager 2 flog 1989 an Triton vorbei und maß eine Oberflächentemperatur von etwa
−235 °C, einer der kältesten gemessenen Werte im Sonnensystem. Die Oberfläche aus
Stickstoff-, Wasser- und Kohlendioxid-Eis ist jung und kaum verkratert; Teile ähneln der
Schale einer Netzmelone. Dunkle Streifen stammen von geysirartigen Fontänen, die
Stickstoffgas und Staub bis etwa 8 km hoch in eine dünne Stickstoffatmosphäre tragen.
Szene: [Tritons rückläufige Bahn](szene:triton-rueckwaerts); Überblick:
[Triton bei NASA](quelle:nasa-triton); Mission: [Voyager 2](quelle:nasa-voyager-2).
```

`en/gymnasium/objekt-triton.md`:
```markdown
# Triton

At 2,707 km in diameter, Triton is Neptune's largest moon and the seventh-largest moon
in the Solar System. It orbits [Neptune](objekt:neptune) at 355,000 km in 5.9 days,
but retrograde, against Neptune's direction of rotation, on an orbit inclined by about
157° to the planet's equator. No other large moon moves like this. Triton therefore
cannot have formed in a shared disc of dust and gas with the planet; it was probably
captured from the Kuiper Belt and is thus a relative of [Pluto](objekt:pluto), which it
resembles in size and density.

The retrograde orbit has consequences: the tides slow Triton down, so that it slowly
approaches Neptune. In a few billion years it will be torn apart by tidal forces inside
the Roche limit and could form a ring system.

Voyager 2 flew past Triton in 1989 and measured a surface temperature of about
−235 °C, one of the coldest values measured in the Solar System. The surface of
nitrogen, water and carbon dioxide ice is young and hardly cratered; parts of it
resemble the skin of a cantaloupe melon. Dark streaks come from geyser-like plumes that
carry nitrogen gas and dust up to about 8 km high into a thin nitrogen atmosphere.
Scene: [Triton's retrograde orbit](szene:triton-rueckwaerts); overview:
[Triton at NASA](quelle:nasa-triton); mission: [Voyager 2](quelle:nasa-voyager-2).
```

- [ ] **Schritt 3: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS; `dateien.test.ts` mit 150 Dateien, also 752 Fällen.

- [ ] **Schritt 4: Commit**

```bash
git add src/data/texte
git commit -m "Gymnasialtexte: Uranus, Neptun und ihre Monde; Grundschultext Oberon präzisiert"
```

---

### Task 8: Zwergplaneten

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/gymnasium/objekt-{pluto,charon,ceres,eris,haumea,makemake}.md`

**Schnittstellen:**
- Konsumiert: `achsneigungDeg` aus Task 1 (Pluto rund 120°, Eris und Makemake 0° als Behelf); Quellen `nssdc-pluto`, `nasa-new-horizons`, `nasa-dawn`, `nasa-kuiperguertel`, `jpl-sbdb` (Task 2); Verweise `objekt:pluto`, `objekt:charon`, `objekt:neptune`, `objekt:mars`, `objekt:jupiter`, `szene:pluto-charon`, `szene:ceres-guertel`, `thema:zwergplaneten`, `thema:gebundene-rotation`, `thema:kirkwood-luecken`, `thema:bahnelemente`, `thema:ringe`, `thema:modell` (der Punkt zu den nicht gemessenen Achsen folgt in Task 9).
- Produziert: nichts für spätere Tasks.

Fürwörter wie in den Grundschultexten: Pluto, Charon, Makemake „er", Ceres, Eris, Haumea „sie". Zahlen aus dem Datensatz geprüft (Planung, 14.09.2026): Eris Aphel 1977 bei 97,7 AE, Perihel 2257 bei 38,2 AE; Makemakes Masse nach Bamberger (2025) aus der Bahn des Mondes; Haumeas Masse nach Proudfoot u. a. (2024) aus den Bahnen beider Monde.

- [ ] **Schritt 1: Dateien anlegen**

`de/gymnasium/objekt-pluto.md`:
```markdown
# Pluto

Pluto ist der bekannteste [Zwergplanet](thema:zwergplaneten). Mit 2 377 km Durchmesser
ist er kleiner als der Erdmond und hat nur rund 0,2 % der Erdmasse. Seine Bahn ist mit
e ≈ 0,25 stark exzentrisch und um 17° gegen die Ekliptik geneigt. Im Perihel kommt er
der Sonne mit knapp 30 AE näher als [Neptun](objekt:neptune), zuletzt zwischen 1979
und 1999. Eine Kollision ist trotzdem ausgeschlossen: Pluto steht mit Neptun in einer
3:2-Resonanz, er umläuft die Sonne zweimal, während Neptun es dreimal tut, und beide
kommen sich dabei nie näher als rund 17 AE. Ein Umlauf dauert knapp 250 Jahre.

Pluto und sein großer Mond [Charon](objekt:charon) sind gegenseitig
[gebunden](thema:gebundene-rotation): Beide zeigen einander stets dieselbe Seite und
drehen sich in 6,4 Tagen einmal. Die Achse ist um rund 120° geneigt, Pluto rotiert also
rückläufig. Die Raumsonde New Horizons zeigte 2015 eine überraschend vielfältige Welt:
die Ebene Sputnik Planitia aus Stickstoffeis, deren Oberfläche sich langsam umwälzt und
deshalb frei von Kratern ist, Berge aus Wassereis von mehreren Kilometern Höhe und eine
dünne Stickstoffatmosphäre mit blauen Dunstschichten.

Entdeckt wurde Pluto 1930 von Clyde Tombaugh. Seit 2006 zählt er nach der Definition der
Internationalen Astronomischen Union zu den Zwergplaneten, weil er die Umgebung seiner
Bahn nicht freigeräumt hat. Szene: [Pluto und Charon im Doppel](szene:pluto-charon);
Kennzahlen: [NSSDC Pluto Fact Sheet](quelle:nssdc-pluto); Mission:
[New Horizons](quelle:nasa-new-horizons).
```

`en/gymnasium/objekt-pluto.md`:
```markdown
# Pluto

Pluto is the best-known [dwarf planet](thema:zwergplaneten). At 2,377 km in diameter
it is smaller than the Earth's Moon and has only about 0.2 % of the Earth's mass. With
e ≈ 0.25 its orbit is strongly eccentric and inclined by 17° to the ecliptic. At
perihelion it comes closer to the Sun than [Neptune](objekt:neptune), at just under
30 AU, most recently between 1979 and 1999. A collision is nevertheless impossible:
Pluto is in a 3:2 resonance with Neptune, orbiting the Sun twice while Neptune does so
three times, and the two never come closer than about 17 AU. One orbit takes almost
250 years.

Pluto and its large moon [Charon](objekt:charon) are mutually
[tidally locked](thema:gebundene-rotation): both always show each other the same face
and turn once in 6.4 days. The axis is tilted by about 120°, so Pluto rotates
retrograde. In 2015 the New Horizons spacecraft revealed a surprisingly varied world:
the plain Sputnik Planitia made of nitrogen ice, whose surface slowly overturns and is
therefore free of craters, mountains of water ice several kilometres high, and a thin
nitrogen atmosphere with blue haze layers.

Pluto was discovered in 1930 by Clyde Tombaugh. Since 2006 it has been classed as a
dwarf planet under the definition of the International Astronomical Union, because it
has not cleared the neighbourhood of its orbit. Scene:
[Pluto and Charon, a double world](szene:pluto-charon); key figures:
[NSSDC Pluto Fact Sheet](quelle:nssdc-pluto); mission:
[New Horizons](quelle:nasa-new-horizons).
```

`de/gymnasium/objekt-charon.md`:
```markdown
# Charon

Charon ist mit 1 212 km Durchmesser gut halb so groß wie [Pluto](objekt:pluto) und hat
etwa ein Achtel seiner Masse. Kein anderer Mond ist im Verhältnis zu dem Körper, den er
umläuft, so groß. Der gemeinsame Schwerpunkt liegt deshalb nicht im Inneren Plutos,
sondern rund 900 km über seiner Oberfläche im freien Raum; streng genommen umkreisen
beide diesen Punkt. Man spricht deshalb oft von einem Doppelsystem.

Charon umläuft Pluto in 19 600 km Abstand in 6,4 Tagen, genau so lange, wie beide für
eine Drehung brauchen. Die Gezeiten haben hier nicht nur den Mond, sondern auch den
Hauptkörper abgebremst: Pluto und Charon zeigen einander stets dieselbe Seite, eine
doppelt [gebundene Rotation](thema:gebundene-rotation). Von der einen Hälfte Plutos aus
steht Charon deshalb unbeweglich am Himmel, von der anderen ist er nie zu sehen.

Die Oberfläche besteht vor allem aus Wassereis. Die Sonde New Horizons fand 2015 einen
Gürtel aus Schluchten von über 1 600 km Länge, viermal so lang wie der Grand Canyon,
und eine rötliche Polkappe, Mordor Macula. Ihre Farbe stammt vermutlich von Methan, das
aus Plutos Atmosphäre entweicht, in Charons kalter Polarnacht ausfriert und unter
ultraviolettem Licht zu rötlichen organischen Stoffen umgewandelt wird. Entdeckt wurde
Charon 1978. Szene: [Pluto und Charon im Doppel](szene:pluto-charon); Mission:
[New Horizons](quelle:nasa-new-horizons).
```

`en/gymnasium/objekt-charon.md`:
```markdown
# Charon

At 1,212 km in diameter, Charon is just over half the size of [Pluto](objekt:pluto)
and has about an eighth of its mass. No other moon is so large relative to the body it
orbits. The common centre of mass therefore lies not inside Pluto but about 900 km
above its surface in open space; strictly speaking both orbit this point. The pair is
therefore often called a double system.

Charon orbits Pluto at 19,600 km in 6.4 days, exactly as long as both need for one
rotation. Here the tides have braked not only the moon but also the main body: Pluto
and Charon always show each other the same face, a doubly
[tidally locked](thema:gebundene-rotation) system. From one hemisphere of Pluto, Charon
therefore hangs motionless in the sky; from the other it is never visible.

The surface consists mainly of water ice. In 2015 New Horizons found a belt of canyons
more than 1,600 km long, four times the length of the Grand Canyon, and a reddish polar
cap, Mordor Macula. Its colour probably comes from methane that escapes from Pluto's
atmosphere, freezes out in Charon's cold polar night and is converted by ultraviolet
light into reddish organic compounds. Charon was discovered in 1978. Scene:
[Pluto and Charon, a double world](szene:pluto-charon); mission:
[New Horizons](quelle:nasa-new-horizons).
```

`de/gymnasium/objekt-ceres.md`:
```markdown
# Ceres

Ceres ist mit 939 km Durchmesser der größte Körper im Asteroidengürtel und als einziger
dort ein [Zwergplanet](thema:zwergplaneten). Allein sie vereint schätzungsweise rund ein
Drittel der Masse des gesamten Gürtels. Sie umläuft die Sonne zwischen
[Mars](objekt:mars) und [Jupiter](objekt:jupiter) in 2,77 AE Abstand in 4,6 Jahren,
zwischen zwei der [Kirkwood-Lücken](thema:kirkwood-luecken).

Giuseppe Piazzi entdeckte Ceres am 1. Januar 1801. Nach wenigen Wochen verlor er sie
hinter der Sonne; Carl Friedrich Gauß berechnete aus den wenigen Beobachtungen ihre
[Bahnelemente](thema:bahnelemente) so genau, dass sie Ende 1801 wiedergefunden wurde.
Rund ein halbes Jahrhundert galt sie als Planet, dann wurde sie mit den vielen neu
entdeckten Asteroiden zu den Kleinplaneten gezählt. Seit 2006 ist sie Zwergplanet.

Die Raumsonde Dawn umkreiste Ceres von 2015 bis 2018. Ihre mittlere Dichte von
2,2 g/cm³ und Schweremessungen zeigen einen Körper aus Gestein und reichlich Wassereis.
Die hellen Flecken im Krater Occator bestehen vor allem aus Natriumcarbonat, das mit
salzigem Wasser aus einem Reservoir unter der Oberfläche aufgestiegen ist; der Berg
Ahuna Mons gilt als Eisvulkan. Ceres dreht sich in gut neun Stunden einmal. Szene:
[Ceres im Asteroidengürtel](szene:ceres-guertel); Mission: [Dawn](quelle:nasa-dawn).
```

`en/gymnasium/objekt-ceres.md`:
```markdown
# Ceres

At 939 km in diameter, Ceres is the largest body in the asteroid belt and the only
[dwarf planet](thema:zwergplaneten) there. On its own it holds an estimated third of
the mass of the entire belt. It orbits the Sun between [Mars](objekt:mars) and
[Jupiter](objekt:jupiter) at 2.77 AU in 4.6 years, between two of the
[Kirkwood gaps](thema:kirkwood-luecken).

Giuseppe Piazzi discovered Ceres on 1 January 1801. After a few weeks he lost it
behind the Sun; Carl Friedrich Gauss used the few observations to calculate its
[orbital elements](thema:bahnelemente) so precisely that it was found again at the end
of 1801. For about half a century it was regarded as a planet; then, with the many
newly discovered asteroids, it was counted among the minor planets. Since 2006 it has
been a dwarf planet.

The Dawn spacecraft orbited Ceres from 2015 to 2018. Its mean density of 2.2 g/cm³ and
gravity measurements show a body of rock and plenty of water ice. The bright spots in
the crater Occator consist mainly of sodium carbonate that rose with salty water from a
reservoir below the surface; the mountain Ahuna Mons is considered an ice volcano.
Ceres rotates once in just over nine hours. Scene:
[Ceres in the asteroid belt](szene:ceres-guertel); mission: [Dawn](quelle:nasa-dawn).
```

`de/gymnasium/objekt-eris.md`:
```markdown
# Eris

Eris hat mit 2 326 km fast den Durchmesser von [Pluto](objekt:pluto), aber rund ein
Viertel mehr Masse. Die Masse ist so genau bekannt, weil Eris einen Mond hat, Dysnomia:
Aus dessen Umlaufzeit und Bahnradius folgt nach dem dritten Keplerschen Gesetz die Masse
des Hauptkörpers. Eris dreht sich vermutlich im Takt dieses Mondes, in knapp 16 Tagen.
Mit einer geometrischen Albedo von 0,96 gehört sie zu den hellsten Körpern im
Sonnensystem, wohl wegen frisch ausgefrorenen Methans an der Oberfläche.

Ihre Bahn ist stark exzentrisch (e ≈ 0,44) und um 44° gegen die Ekliptik geneigt. Der
Sonnenabstand schwankt zwischen etwa 38 und 98 AE; den sonnenfernsten Punkt hat Eris
1977 durchlaufen, das Perihel erreicht sie um 2257. Ein Umlauf dauert rund 560 Jahre.
Eris gehört zur gestreuten Scheibe, einer Gruppe von Körpern, die Neptun einst auf weite,
geneigte Bahnen gelenkt hat.

Die Entdeckung 2005 löste die Debatte aus, die 2006 zur Definition der
[Zwergplaneten](thema:zwergplaneten) führte: Wäre Pluto ein Planet geblieben, hätte auch
Eris einer sein müssen. Die Lage ihrer Drehachse ist unbekannt; die Simulation nimmt
ersatzweise die Senkrechte auf der Bahnebene an, der Datenblock zeigt deshalb eine
Achsneigung von 0° ([Grenzen des Modells](thema:modell)). Überblick:
[Kuipergürtel bei NASA](quelle:nasa-kuiperguertel); Daten:
[JPL Small-Body Database](quelle:jpl-sbdb).
```

`en/gymnasium/objekt-eris.md`:
```markdown
# Eris

At 2,326 km, Eris has almost the same diameter as [Pluto](objekt:pluto) but about a
quarter more mass. The mass is known so precisely because Eris has a moon, Dysnomia:
its orbital period and orbital radius give the mass of the main body via Kepler's third
law. Eris probably rotates in step with this moon, in just under 16 days. With a
geometric albedo of 0.96 it is one of the brightest bodies in the Solar System,
probably because of freshly frozen methane on its surface.

Its orbit is strongly eccentric (e ≈ 0.44) and inclined by 44° to the ecliptic. Its
distance from the Sun varies between about 38 and 98 AU; Eris passed its farthest point
in 1977 and will reach perihelion around 2257. One orbit takes about 560 years. Eris
belongs to the scattered disc, a group of bodies that Neptune once flung onto wide,
inclined orbits.

Its discovery in 2005 triggered the debate that led to the definition of
[dwarf planets](thema:zwergplaneten) in 2006: had Pluto remained a planet, Eris would
have had to be one too. The direction of its rotation axis is unknown; the simulation
uses the perpendicular to the orbital plane instead, so the data block shows an axial
tilt of 0° ([limits of the model](thema:modell)). Overview:
[Kuiper Belt at NASA](quelle:nasa-kuiperguertel); data:
[JPL Small-Body Database](quelle:jpl-sbdb).
```

`de/gymnasium/objekt-haumea.md`:
```markdown
# Haumea

Haumea ist der ungewöhnlichste der [Zwergplaneten](thema:zwergplaneten). Sie dreht sich
in nur 3,9 Stunden einmal um sich selbst, schneller als jeder andere bekannte Körper
dieser Größe im Sonnensystem. Die Fliehkraft hat sie zu einem gestreckten Ellipsoid
verformt, gut 2 000 km lang und nur etwa halb so dick; der Datenblock nennt einen
mittleren Durchmesser. Sie umläuft die Sonne jenseits von [Neptun](objekt:neptune) in
43 AE mittlerem Abstand in rund 283 Jahren, auf einer um 28° geneigten Bahn.

Die Oberfläche besteht überwiegend aus kristallinem Wassereis, darunter liegt ein
dichter Gesteinskern. Vermutlich hat vor langer Zeit ein gewaltiger Zusammenstoß einen
Teil des Eismantels abgesprengt und Haumea in schnelle Drehung versetzt. Dafür spricht
eine Familie kleiner Eiskörper mit sehr ähnlichen Bahnen und Oberflächen, die
Haumea-Familie. Auch ihre zwei Monde Hiʻiaka und Namaka sind wohl Bruchstücke dieses
Ereignisses; aus ihren Bahnen ist Haumeas Masse bekannt.

2017 zog Haumea von der Erde aus gesehen vor einem Stern vorbei. Aus dem Verlauf des
Lichts ließ sich nicht nur ihre Form genauer bestimmen, sondern auch ein schmaler
[Ring](thema:ringe) in rund 2 300 km Abstand vom Zentrum nachweisen, der erste bei einem
Körper jenseits von Neptun. Überblick:
[Kuipergürtel bei NASA](quelle:nasa-kuiperguertel); Daten:
[JPL Small-Body Database](quelle:jpl-sbdb).
```

`en/gymnasium/objekt-haumea.md`:
```markdown
# Haumea

Haumea is the most unusual of the [dwarf planets](thema:zwergplaneten). It rotates once
in only 3.9 hours, faster than any other known body of this size in the Solar System.
Centrifugal force has deformed it into an elongated ellipsoid, just over 2,000 km long
and only about half as thick; the data block gives a mean diameter. It orbits the Sun
beyond [Neptune](objekt:neptune) at a mean distance of 43 AU in about 283 years, on an
orbit inclined by 28°.

The surface consists mainly of crystalline water ice, with a dense rocky core beneath.
A giant collision long ago probably knocked off part of the icy mantle and set Haumea
spinning fast. Evidence for this is a family of small icy bodies with very similar
orbits and surfaces, the Haumea family. Its two moons, Hiʻiaka and Namaka, are probably
fragments of the same event; Haumea's mass is known from their orbits.

In 2017 Haumea passed in front of a star as seen from Earth. The course of the
starlight made it possible not only to determine its shape more precisely but also to
detect a narrow [ring](thema:ringe) about 2,300 km from its centre, the first found
around a body beyond Neptune. Overview:
[Kuiper Belt at NASA](quelle:nasa-kuiperguertel); data:
[JPL Small-Body Database](quelle:jpl-sbdb).
```

`de/gymnasium/objekt-makemake.md`:
```markdown
# Makemake

Makemake ist nach Pluto der zweithellste bekannte Körper im Kuipergürtel. Mit rund
1 430 km Durchmesser ist er gut halb so groß wie [Pluto](objekt:pluto). Er umläuft die
Sonne jenseits von [Neptun](objekt:neptune) in 45,6 AE mittlerem Abstand in rund
308 Jahren, auf einer um 29° geneigten Bahn. Anders als Pluto steht er nicht in Resonanz
mit Neptun; er gehört zu den klassischen Objekten des Kuipergürtels.

Spektren zeigen gefrorenes Methan und Ethan. Unter Sonnenlicht und kosmischer Strahlung
entstehen daraus rötlich-braune organische Verbindungen, die Makemake seine Farbe geben.
Eine Sternbedeckung 2011 zeigte keine nennenswerte Atmosphäre, obwohl Pluto mit einer
ähnlichen Oberfläche eine trägt.

2016 fand das Hubble-Teleskop einen kleinen, sehr dunklen Mond. Aus dessen Bahn ließ
sich inzwischen Makemakes Masse bestimmen. Die Lage der Drehachse ist dagegen
unbekannt; die Simulation nimmt ersatzweise die Senkrechte auf der Bahnebene an, der
Datenblock zeigt deshalb eine Achsneigung von 0° ([Grenzen des Modells](thema:modell)).
Entdeckt wurde Makemake 2005, kurz nach Ostern; benannt ist er nach dem Schöpfergott der
Rapa Nui auf der Osterinsel. Mehr zu [Zwergplaneten](thema:zwergplaneten); Überblick:
[Kuipergürtel bei NASA](quelle:nasa-kuiperguertel).
```

`en/gymnasium/objekt-makemake.md`:
```markdown
# Makemake

Makemake is the second-brightest known body in the Kuiper Belt after Pluto. At about
1,430 km in diameter it is just over half the size of [Pluto](objekt:pluto). It orbits
the Sun beyond [Neptune](objekt:neptune) at a mean distance of 45.6 AU in about
308 years, on an orbit inclined by 29°. Unlike Pluto, it is not in resonance with
Neptune; it is one of the classical objects of the Kuiper Belt.

Spectra show frozen methane and ethane. Sunlight and cosmic radiation turn these into
reddish-brown organic compounds that give Makemake its colour. A stellar occultation in
2011 showed no significant atmosphere, although Pluto, with a similar surface, has one.

In 2016 the Hubble telescope found a small, very dark moon. Its orbit has since made it
possible to determine Makemake's mass. The direction of the rotation axis, however, is
unknown; the simulation uses the perpendicular to the orbital plane instead, so the
data block shows an axial tilt of 0° ([limits of the model](thema:modell)). Makemake
was discovered in 2005, shortly after Easter, and is named after the creator god of the
Rapa Nui on Easter Island. More on [dwarf planets](thema:zwergplaneten); overview:
[Kuiper Belt at NASA](quelle:nasa-kuiperguertel).
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS; `dateien.test.ts` mit 162 Dateien, also 812 Fällen.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Gymnasialtexte: Zwergplaneten"
```

---

### Task 9: Themen Gymnasium

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/gymnasium/thema-{finsternis,ringe,gebundene-rotation,kirkwood-luecken,achsneigung,zwergplaneten,bahnelemente}.md`
- Ändern: `src/data/texte/{de,en}/gymnasium/thema-modell.md` (neuer Listenpunkt „Nicht gemessene Achsen")

**Schnittstellen:**
- Konsumiert: `achsneigungDeg` aus Task 1 (Thementext Achsneigung beschreibt die Zeile); Quellen `nasa-gebundene-rotation`, `nasa-kuiperguertel`, `nasa-ceres`, `jpl-hauptguertel`, `jpl-satelliten-bahnen` (Task 2) sowie `nasa-eclipse`, `pds-rings`, `iau-rotation`, `jpl-approx-pos` (Etappe 1); Verweise auf Körper, Szenen `mondfinsternis`, `ringdurchflug`, `saturn-ringkante`, `pluto-charon`, `ceres-guertel`, `uranus-gekippt` und die Themen `ringe`, `modell`.
- Produziert: Gymnasialtexte für alle acht Themen; damit führen die `thema:`-Verweise aus Task 3 bis 8 und aus `thema-modell` (Verweis `bahnelemente`) nicht mehr auf „kein Text".

Listen: Der Parser erkennt Zeilen, die mit `- ` oder `1. ` beginnen, als Listenpunkte; eingerückte Folgezeilen gehören zum vorigen Punkt. In Fließtext darf keine umbrochene Zeile so beginnen.

- [ ] **Schritt 1: Themendateien anlegen**

`de/gymnasium/thema-finsternis.md`:
```markdown
# Finsternisse

Eine Finsternis tritt ein, wenn Sonne, [Erde](objekt:earth) und [Mond](objekt:moon)
nahezu auf einer Linie stehen. Bei einer Sonnenfinsternis fällt der Schatten des Mondes
auf die Erde; das ist nur bei Neumond möglich. Bei einer Mondfinsternis tritt der Mond
in den Schatten der Erde; das ist nur bei Vollmond möglich.

Weil die Mondbahn um 5,1° gegen die Ekliptik geneigt ist, zieht der Mond meist ober-
oder unterhalb des Schattens vorbei. Eine Finsternis gibt es nur, wenn Neu- oder
Vollmond nahe einem der beiden Bahnknoten liegt, den Schnittpunkten von Mondbahn und
Ekliptik. Das geschieht in zwei Finsternisperioden im Jahr, die sich wegen der
wandernden Knoten jedes Jahr um knapp drei Wochen verfrühen. Nach einem Saros-Zyklus
von rund 18 Jahren und 11 Tagen wiederholen sich Finsternisse in fast gleicher
Geometrie.

Dass es totale Sonnenfinsternisse gibt, ist ein Zufall der Größenverhältnisse: Die
Sonne ist rund 400-mal so groß wie der Mond, aber auch rund 400-mal so weit entfernt,
so dass beide fast gleich groß erscheinen. Steht der Mond nahe dem erdfernsten Punkt
seiner Bahn, reicht er nicht ganz aus, und es entsteht eine ringförmige Finsternis. Der
Kernschatten des Mondes streicht nur über einen schmalen Streifen der Erde; eine
Mondfinsternis ist dagegen von der ganzen Nachtseite aus zu sehen.

Finsternisse gibt es auch anderswo: 1676 schloss Ole Rømer aus den Verfinsterungen des
Jupitermondes [Io](objekt:io) erstmals, dass sich Licht mit endlicher Geschwindigkeit
ausbreitet. Szene: [Mondfinsternis](szene:mondfinsternis); Zeiten und Karten:
[NASA Eclipse Web Site](quelle:nasa-eclipse).
```

`en/gymnasium/thema-finsternis.md`:
```markdown
# Eclipses

An eclipse occurs when the Sun, the [Earth](objekt:earth) and the [Moon](objekt:moon)
stand almost in a line. In a solar eclipse the Moon's shadow falls on the Earth, which
is only possible at new Moon. In a lunar eclipse the Moon enters the Earth's shadow,
which is only possible at full Moon.

Because the lunar orbit is inclined by 5.1° to the ecliptic, the Moon usually passes
above or below the shadow. An eclipse is only possible when new or full Moon falls near
one of the two nodes, the points where the lunar orbit crosses the ecliptic. This
happens in two eclipse seasons a year, which come almost three weeks earlier each year
because the nodes drift. After a saros cycle of about 18 years and 11 days, eclipses
repeat in almost the same geometry.

That total solar eclipses exist at all is a coincidence of proportions: the Sun is
about 400 times larger than the Moon but also about 400 times farther away, so both
appear almost the same size. When the Moon is near the farthest point of its orbit, it
is not quite big enough, and an annular eclipse results. The Moon's umbra sweeps only a
narrow strip of the Earth, whereas a lunar eclipse can be seen from the entire night
side.

Eclipses happen elsewhere too: in 1676 Ole Rømer used the eclipses of Jupiter's moon
[Io](objekt:io) to show for the first time that light travels at a finite speed. Scene:
[Lunar eclipse](szene:mondfinsternis); times and maps:
[NASA Eclipse Web Site](quelle:nasa-eclipse).
```

`de/gymnasium/thema-ringe.md`:
```markdown
# Ringsysteme

Alle vier Riesenplaneten haben Ringe, doch nur die des [Saturn](objekt:saturn) sind
hell und massereich. Sie bestehen zu über 95 % aus Wassereis, in Teilchen von
Staubkorngröße bis zu einigen Metern. Jedes Teilchen umläuft den Planeten auf seiner
eigenen Keplerbahn, innen schneller als außen. Zusammenstöße der Teilchen dämpfen alle
Bewegungen senkrecht zur Ringebene; deshalb sind die Hauptringe bei über 270 000 km
Durchmesser meist nur etwa zehn Meter dick.

Ringe liegen meist innerhalb der Roche-Grenze. Dort sind die Gezeitenkräfte des
Planeten stärker als die Schwerkraft, mit der sich lose Brocken zu einem Mond
zusammenballen könnten. Monde formen die Ringe: [Mimas](objekt:mimas) räumt über eine
2:1-Resonanz die Cassini-Teilung, die kleinen Schäfermonde Prometheus und Pandora
halten den schmalen F-Ring zusammen, und der Mond Pan hält die Encke-Lücke offen. Wie
alt Saturns Ringe sind, ist umstritten: Cassini-Messungen ihrer Masse und des
einfallenden Staubs sprechen für höchstens einige hundert Millionen Jahre, andere
Modelle halten sie für so alt wie das Sonnensystem.

Die Ringe des [Uranus](objekt:uranus) wurden 1977 entdeckt, als der Planet vor einem
Stern vorbeizog und das Sternlicht vorher und nachher mehrfach kurz erlosch. Sie sind
schmal und dunkel. [Neptun](objekt:neptune) hat dünne Ringe, in deren äußerstem sich
Material zu Bögen verdichtet. Die Ringe des [Jupiter](objekt:jupiter) bestehen aus
feinem Staub, den Einschläge auf kleinen inneren Monden freisetzen. Selbst der
Zwergplanet [Haumea](objekt:haumea) trägt einen Ring. Szenen:
[Durchflug durch Saturns Ringe](szene:ringdurchflug),
[Saturns Ringe von der Kante](szene:saturn-ringkante); Daten:
[PDS Ring-Moon Systems Node](quelle:pds-rings).
```

`en/gymnasium/thema-ringe.md`:
```markdown
# Ring systems

All four giant planets have rings, but only those of [Saturn](objekt:saturn) are bright
and massive. They are more than 95 % water ice, in particles ranging from dust grains
to a few metres across. Every particle orbits the planet on its own Kepler orbit,
faster on the inside than on the outside. Collisions between particles damp all motion
perpendicular to the ring plane; that is why the main rings, more than 270,000 km
across, are mostly only about ten metres thick.

Rings usually lie inside the Roche limit. There the planet's tidal forces are stronger
than the gravity with which loose chunks could clump together into a moon. Moons shape
the rings: [Mimas](objekt:mimas) clears the Cassini Division through a 2:1 resonance,
the small shepherd moons Prometheus and Pandora hold the narrow F ring together, and
the moon Pan keeps the Encke Gap open. How old Saturn's rings are is disputed: Cassini
measurements of their mass and of infalling dust suggest a few hundred million years
at most, while other models consider them as old as the Solar System.

The rings of [Uranus](objekt:uranus) were discovered in 1977, when the planet passed in
front of a star and the starlight briefly dimmed several times before and after. They
are narrow and dark. [Neptune](objekt:neptune) has thin rings, the outermost of which
contains material bunched into arcs. The rings of [Jupiter](objekt:jupiter) consist of
fine dust released by impacts on small inner moons. Even the dwarf planet
[Haumea](objekt:haumea) has a ring. Scenes:
[Flying through Saturn's rings](szene:ringdurchflug),
[Saturn's rings edge-on](szene:saturn-ringkante); data:
[PDS Ring-Moon Systems Node](quelle:pds-rings).
```

`de/gymnasium/thema-gebundene-rotation.md`:
```markdown
# Gebundene Rotation

Ein Körper rotiert gebunden, wenn eine Drehung um die eigene Achse genau so lange dauert
wie ein Umlauf. Er zeigt seinem Zentralkörper dann stets dieselbe Seite, so wie der
[Mond](objekt:moon) der [Erde](objekt:earth).

Die Ursache sind Gezeitenkräfte. Der Planet zieht an der ihm zugewandten Seite eines
Mondes stärker als an der abgewandten und streckt ihn zu zwei leichten Gezeitenbeulen.
Dreht sich der Mond schneller oder langsamer, als er umläuft, wandern die Beulen durch
seinen Körper; innere Reibung verschiebt sie gegen die Verbindungslinie zum Planeten.
Dessen Anziehung auf die verschobenen Beulen erzeugt ein Drehmoment, das die Rotation so
lange bremst oder beschleunigt, bis sie mit dem Umlauf übereinstimmt. Weil diese
Wirkung mit der sechsten Potenz des Abstands abnimmt, sind vor allem nahe Monde
gebunden, darunter fast alle großen Monde im Sonnensystem.

Die Wirkung ist gegenseitig. Der Mond hebt auf der Erde Gezeitenbeulen, die ihm wegen
der schnellen Erddrehung vorauseilen und die Erde bremsen; der Tag wird dadurch um rund
zwei Millisekunden je Jahrhundert länger. Den Drehimpuls übernimmt der Mond, der sich
um 3,8 cm im Jahr entfernt. Am Ende eines solchen Prozesses sind beide Körper gebunden,
wie [Pluto](objekt:pluto) und [Charon](objekt:charon) schon heute.

Nicht jede Gezeitenbremse endet bei 1:1: [Merkur](objekt:mercury) dreht sich wegen
seiner exzentrischen Bahn dreimal, während er die Sonne zweimal umläuft. Monde
innerhalb der synchronen Umlaufbahn wie [Phobos](objekt:phobos) werden sogar abgebremst
und sinken langsam zum Planeten. Szene: [Pluto und Charon im Doppel](szene:pluto-charon);
Überblick: [Gebundene Rotation bei NASA](quelle:nasa-gebundene-rotation).
```

`en/gymnasium/thema-gebundene-rotation.md`:
```markdown
# Tidal locking

A body is tidally locked when one rotation about its axis takes exactly as long as one
orbit. It then always shows the same face to the body it orbits, just as the
[Moon](objekt:moon) does to the [Earth](objekt:earth).

The cause is tidal forces. The planet pulls harder on the near side of a moon than on
the far side and stretches it into two slight tidal bulges. If the moon spins faster or
slower than it orbits, the bulges travel through its body; internal friction shifts
them away from the line joining it to the planet. The planet's pull on the shifted
bulges creates a torque that brakes or speeds up the rotation until it matches the
orbit. Because this effect falls off with the sixth power of distance, it is mainly
close moons that are locked, including almost all the large moons in the Solar System.

The effect works both ways. The Moon raises tidal bulges on the Earth that run ahead of
it because of the Earth's fast rotation and slow the Earth down; the day grows longer
by about two milliseconds per century. The angular momentum goes to the Moon, which
recedes by 3.8 cm a year. At the end of such a process both bodies are locked, as
[Pluto](objekt:pluto) and [Charon](objekt:charon) already are today.

Not every tidal brake ends at 1:1: because of its eccentric orbit,
[Mercury](objekt:mercury) rotates three times while orbiting the Sun twice. Moons
inside the synchronous orbit, such as [Phobos](objekt:phobos), are even slowed down and
slowly sink towards the planet. Scene:
[Pluto and Charon, a double world](szene:pluto-charon); overview:
[Tidal locking at NASA](quelle:nasa-gebundene-rotation).
```

`de/gymnasium/thema-kirkwood-luecken.md`:
```markdown
# Kirkwood-Lücken

Trägt man die Asteroiden des Hauptgürtels nach der großen Halbachse ihrer Bahn auf,
fallen deutliche Lücken auf. Daniel Kirkwood erkannte 1866, dass sie dort liegen, wo
die Umlaufzeit eines Asteroiden in einem einfachen ganzzahligen Verhältnis zur
Umlaufzeit des [Jupiter](objekt:jupiter) steht. Nach dem dritten Keplerschen Gesetz,
T² ∝ a³, gehört zu jedem Verhältnis ein bestimmter Abstand: 3:1 bei 2,50 AE, 5:2 bei
2,82 AE, 7:3 bei 2,95 AE und 2:1 bei 3,28 AE.

In einer solchen Resonanz begegnet der Asteroid Jupiter immer wieder an denselben
Stellen seiner Bahn. Die kleinen Anstöße heben sich deshalb nicht im Mittel auf,
sondern summieren sich. Mit der Zeit wächst die Exzentrizität der Bahn, bis der
Asteroid die Bahn des [Mars](objekt:mars) oder sogar der [Erde](objekt:earth) kreuzt
und durch nahe Begegnungen aus der Lücke geworfen wird. Viele erdnahe Asteroiden und
Meteoriten stammen aus den Rändern solcher Resonanzen.

Die Lücken sind Lücken in der Verteilung der Halbachsen, keine leeren Streifen im Raum:
Weil die Bahnen elliptisch sind, laufen zu jedem Zeitpunkt auch Asteroiden durch die
Abstände der Lücken. Nicht jede Resonanz leert ihren Bereich: Bei 3:2 sammeln sich die
Hildas, bei 1:1 die Trojaner. [Ceres](objekt:ceres) liegt mit 2,77 AE zwischen den
Lücken bei 3:1 und 5:2. Ein Gegenstück in Saturns [Ringen](thema:ringe) ist die
Cassini-Teilung. Szene: [Ceres im Asteroidengürtel](szene:ceres-guertel); Daten:
[Kirkwood-Lücken im Hauptgürtel](quelle:jpl-hauptguertel).
```

`en/gymnasium/thema-kirkwood-luecken.md`:
```markdown
# Kirkwood gaps

If the asteroids of the main belt are plotted by the semi-major axis of their orbits,
clear gaps appear. In 1866 Daniel Kirkwood recognised that they lie where an asteroid's
orbital period is in a simple whole-number ratio to the orbital period of
[Jupiter](objekt:jupiter). By Kepler's third law, T² ∝ a³, each ratio corresponds to a
particular distance: 3:1 at 2.50 AU, 5:2 at 2.82 AU, 7:3 at 2.95 AU and 2:1 at
3.28 AU.

In such a resonance the asteroid meets Jupiter again and again at the same points of
its orbit. The small nudges therefore do not cancel out on average but add up. Over
time the eccentricity of the orbit grows until the asteroid crosses the orbit of
[Mars](objekt:mars) or even of the [Earth](objekt:earth) and is thrown out of the gap
by close encounters. Many near-Earth asteroids and meteorites come from the edges of
such resonances.

The gaps are gaps in the distribution of semi-major axes, not empty strips in space:
because the orbits are elliptical, asteroids pass through the distances of the gaps at
any moment. Not every resonance empties its region: the Hildas gather at 3:2 and the
Trojans at 1:1. [Ceres](objekt:ceres), at 2.77 AU, lies between the gaps at 3:1 and
5:2. A counterpart in Saturn's [rings](thema:ringe) is the Cassini Division. Scene:
[Ceres in the asteroid belt](szene:ceres-guertel); data:
[Kirkwood gaps in the main belt](quelle:jpl-hauptguertel).
```

`de/gymnasium/thema-achsneigung.md`:
```markdown
# Achsneigung

Die Achsneigung, auch Schiefe genannt, ist der Winkel zwischen der Drehachse eines
Körpers und der Senkrechten auf seiner Bahnebene. Bei der [Erde](objekt:earth) beträgt
sie 23,4°. Deshalb gibt es Jahreszeiten: Im Nordsommer ist die Nordhalbkugel der Sonne
zugeneigt, die Sonne steht dort höher und scheint länger. Der Abstand zur Sonne spielt
kaum eine Rolle; im Perihel Anfang Januar ist auf der Nordhalbkugel Winter.

Werte über 90° bedeuten eine rückläufige Drehung. [Venus](objekt:venus) steht mit 177°
praktisch auf dem Kopf, [Uranus](objekt:uranus) liegt mit 98° auf der Seite: Im Lauf
seines 84-jährigen Umlaufs zeigt jeder Pol rund 42 Jahre lang zur Sonne und liegt
danach ebenso lange im Dunkeln. [Merkur](objekt:mercury) hat fast keine Neigung;
deshalb erreicht der Boden mancher Polkrater nie Sonnenlicht.

Die Neigung ist nicht fest. Die Erdachse schwankt in rund 41 000 Jahren zwischen etwa
22,1° und 24,5°, was den Wechsel von Eis- und Warmzeiten mitbestimmt; der große Mond
hält diese Schwankung klein. Beim [Mars](objekt:mars) ohne großen Mond zeigen
Modellrechnungen chaotische Änderungen über viele Jahrmillionen. Zusätzlich beschreibt
die Erdachse in rund 26 000 Jahren einen Kegel, die Präzession. Die Simulation hält
alle Achsen fest ([Grenzen des Modells](thema:modell)); der Datenblock rechnet die
Neigung aus Polrichtung und Bahn zur Epoche J2000. Szene:
[Der liegende Uranus](szene:uranus-gekippt); Pole:
[IAU-Bericht über Rotationselemente](quelle:iau-rotation).
```

`en/gymnasium/thema-achsneigung.md`:
```markdown
# Axial tilt

Axial tilt, also called obliquity, is the angle between a body's rotation axis and the
perpendicular to its orbital plane. For the [Earth](objekt:earth) it is 23.4°. That is
why there are seasons: in northern summer the northern hemisphere is tilted towards the
Sun, which stands higher there and shines for longer. The distance from the Sun hardly
matters; at perihelion in early January it is winter in the northern hemisphere.

Values above 90° mean retrograde rotation. [Venus](objekt:venus), at 177°, is
practically upside down, and [Uranus](objekt:uranus), at 98°, lies on its side: over
its 84-year orbit each pole points towards the Sun for about 42 years and then lies in
darkness for just as long. [Mercury](objekt:mercury) has almost no tilt, which is why
sunlight never reaches the floors of some of its polar craters.

The tilt is not fixed. The Earth's axis varies between about 22.1° and 24.5° over some
41,000 years, which helps to set the rhythm of ice ages and warm periods; the large
Moon keeps this variation small. For [Mars](objekt:mars), which has no large moon,
model calculations show chaotic changes over many millions of years. In addition, the
Earth's axis traces out a cone in about 26,000 years, the precession. The simulation
keeps all axes fixed ([limits of the model](thema:modell)); the data block calculates
the tilt from the pole direction and the orbit at epoch J2000. Scene:
[Uranus lying on its side](szene:uranus-gekippt); poles:
[IAU report on rotational elements](quelle:iau-rotation).
```

`de/gymnasium/thema-zwergplaneten.md`:
```markdown
# Zwergplaneten

Seit 2006 unterscheidet die Internationale Astronomische Union (IAU) Planeten und
Zwergplaneten. Ein Planet muss drei Bedingungen erfüllen:

- Er umläuft die Sonne.
- Seine Masse reicht aus, dass ihn die eigene Schwerkraft in eine nahezu runde Form
  gebracht hat (hydrostatisches Gleichgewicht).
- Er hat die Umgebung seiner Bahn von anderen Körpern freigeräumt.

Ein Zwergplanet erfüllt die ersten beiden Bedingungen, aber nicht die dritte, und ist
kein Mond. Anerkannt sind fünf: [Ceres](objekt:ceres) im Asteroidengürtel sowie
[Pluto](objekt:pluto), [Eris](objekt:eris), [Haumea](objekt:haumea) und
[Makemake](objekt:makemake) jenseits von [Neptun](objekt:neptune). Weitere Körper wie
Gonggong, Quaoar oder Sedna sind vermutlich ebenfalls rund, aber nicht offiziell
eingestuft.

Den Anstoß gab die Entdeckung von Eris 2005, einem Körper mit mehr Masse als Pluto. Man
hätte entweder Eris und bald Dutzende weitere Körper zu Planeten erklären oder eine neue
Klasse schaffen müssen. Das dritte Kriterium trennt deutlich: Jeder der acht Planeten
übertrifft die übrigen Körper in seiner Bahnzone zusammen um ein Vielfaches an Masse,
während Pluto und Ceres nur große Mitglieder ihrer Populationen im Kuipergürtel
beziehungsweise im Asteroidengürtel sind. Ab welcher Größe ein Körper rund wird, hängt
vom Material ab: Bei Eis genügen einige hundert Kilometer Durchmesser, bei Gestein
braucht es mehr. Überblick: [Kuipergürtel bei NASA](quelle:nasa-kuiperguertel),
[Ceres bei NASA](quelle:nasa-ceres).
```

`en/gymnasium/thema-zwergplaneten.md`:
```markdown
# Dwarf planets

Since 2006 the International Astronomical Union (IAU) has distinguished between planets
and dwarf planets. A planet must meet three conditions:

- It orbits the Sun.
- Its mass is large enough for its own gravity to have pulled it into a nearly round
  shape (hydrostatic equilibrium).
- It has cleared the neighbourhood of its orbit of other bodies.

A dwarf planet meets the first two conditions but not the third, and is not a moon.
Five are recognised: [Ceres](objekt:ceres) in the asteroid belt, and
[Pluto](objekt:pluto), [Eris](objekt:eris), [Haumea](objekt:haumea) and
[Makemake](objekt:makemake) beyond [Neptune](objekt:neptune). Other bodies such as
Gonggong, Quaoar or Sedna are probably round as well but have not been officially
classified.

The trigger was the discovery of Eris in 2005, a body with more mass than Pluto. Either
Eris and soon dozens of other bodies would have had to be declared planets, or a new
class had to be created. The third criterion separates clearly: each of the eight
planets outweighs all the other bodies in its orbital zone combined many times over,
whereas Pluto and Ceres are merely large members of their populations in the Kuiper
Belt and the asteroid belt. The size at which a body becomes round depends on its
material: for ice a few hundred kilometres in diameter are enough, for rock it takes
more. Overview: [Kuiper Belt at NASA](quelle:nasa-kuiperguertel),
[Ceres at NASA](quelle:nasa-ceres).
```

`de/gymnasium/thema-bahnelemente.md`:
```markdown
# Bahnelemente

Eine ungestörte Bahn um einen Zentralkörper ist eine Ellipse, in deren einem Brennpunkt
der Zentralkörper steht. Sechs Zahlen legen sie fest:

- **Große Halbachse a:** die Größe der Bahn; nach dem dritten Keplerschen Gesetz folgt
  daraus die Umlaufzeit.
- **Exzentrizität e:** wie stark die Ellipse gestreckt ist, von 0 für einen Kreis bis
  knapp unter 1.
- **Inklination i:** die Neigung der Bahnebene gegen eine Bezugsebene.
- **Länge des aufsteigenden Knotens Ω:** die Richtung, in der die Bahn die Bezugsebene
  von Süden nach Norden durchstößt.
- **Länge des Perihels ϖ:** die Richtung zum Perihel, dem Punkt größter Annäherung an
  den Zentralkörper.
- **Mittlere Länge L:** wo der Körper zu einem festen Zeitpunkt, der Epoche, steht.

Bezugsebene der Planeten ist die Ekliptik zur Epoche J2000, also die Ebene der Erdbahn
im Jahr 2000; die [Erde](objekt:earth) hat deshalb eine Inklination von praktisch 0°.
Viele Monde beziehen ihre Elemente auf die Äquatorebene ihres Planeten. Für die
Planeten verwendet die Simulation Elemente des JPL, die zur Epoche J2000 gelten und sich
mit linearen Raten je Jahrhundert ändern; zwischen 1800 und 2050 sind sie genau genug
für diese Darstellung ([Grenzen des Modells](thema:modell)).

Für einen Zeitpunkt rechnet die Simulation zuerst die mittlere Anomalie M = L − ϖ aus
und löst dann die Keplergleichung M = E − e · sin E mit dem Newton-Verfahren nach der
exzentrischen Anomalie E auf. Daraus folgt die Lage in der Bahnebene, die anschließend
um Perihelargument, Inklination und Knotenlänge in die Ekliptik gedreht wird. Auffällige
Werte haben etwa [Merkur](objekt:mercury) mit e ≈ 0,21 und [Pluto](objekt:pluto) mit
i ≈ 17°. Daten: [JPL Approximate Positions](quelle:jpl-approx-pos),
[Mittlere Bahnelemente der Monde](quelle:jpl-satelliten-bahnen).
```

`en/gymnasium/thema-bahnelemente.md`:
```markdown
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
```

- [ ] **Schritt 2: `thema-modell` um die nicht gemessenen Achsen ergänzen**

Eris und Makemake verweisen in Task 8 auf `thema:modell`, weil der Datenblock bei ihnen eine Behelfsachse zeigt; Tritons Pol ist im Datensatz nur mit seinem konstanten IAU-Anteil hinterlegt (daraus folgen 21,4° im Datenblock). Der Etappe-1-Text bekommt dafür einen Listenpunkt hinter „Keine Präzession, keine Nutation".

In `de/gymnasium/thema-modell.md` direkt hinter der Zeile `  Erdachse wandert in Wirklichkeit in rund 26 000 Jahren einmal um den Ekliptikpol.` einfügen:
```markdown
- **Nicht gemessene Achsen:** Für [Eris](objekt:eris) und [Makemake](objekt:makemake)
  ist die Richtung der Drehachse unbekannt; die Simulation stellt sie senkrecht auf die
  Bahn, der Datenblock zeigt dann 0° Achsneigung. Der Pol von [Triton](objekt:triton)
  ist ohne seine periodischen Schwankungen hinterlegt, seine Achsneigung im Datenblock
  ist deshalb nicht belastbar.
```

In `en/gymnasium/thema-modell.md` direkt hinter der Zeile `  the Earth's axis circles the ecliptic pole once in about 26,000 years.` einfügen:
```markdown
- **Unmeasured axes:** For [Eris](objekt:eris) and [Makemake](objekt:makemake) the
  direction of the rotation axis is unknown; the simulation sets it perpendicular to the
  orbit, and the data block then shows an axial tilt of 0°. The pole of
  [Triton](objekt:triton) is stored without its periodic variations, so its axial tilt
  in the data block is not reliable.
```

- [ ] **Schritt 3: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS; `dateien.test.ts` mit 176 Dateien, also 882 Fällen.

- [ ] **Schritt 4: Verweisziele je Niveau prüfen**

Jeder `objekt:`- und `thema:`-Verweis aus einer Datei muss auf eine Datei desselben Niveaus und derselben Sprache zeigen (sonst Sackgasse „kein Text"). Szenen bleiben bis 4c-4 ausgenommen.

```bash
for sp in de en; do for nv in grundschule gymnasium; do
  grep -oh '\](\(objekt\|thema\):[a-z-]*)' src/data/texte/$sp/$nv/*.md | sed 's/^](//; s/)$//' | sort -u \
    | while IFS=: read -r art id; do test -f "src/data/texte/$sp/$nv/$art-$id.md" || echo "FEHLT $sp $nv $art-$id"; done
done; done
```
Expected: keine Ausgabe.

- [ ] **Schritt 5: Commit**

```bash
git add src/data/texte
git commit -m "Gymnasialtexte: sieben Themen, Modellgrenzen um nicht gemessene Achsen ergänzt"
```

---

### Task 10: Abnahme, README, Abschluss

**Dateien:**
- Erstellen: `docs/phase4c-etappe3-abnahme.md`
- Ändern: `README.md` (Absatz „Stand")

**Schnittstellen:**
- Konsumiert: alles aus Task 1 bis 9.
- Produziert: Abnahmeprotokoll, auf das die lokale Projektanleitung und die Rulings-Meldung verweisen.

DOM-Anker (Stand `src/ui/info/InfoPanel.tsx`, `Datenblock.tsx`, `Quellenkarten.tsx`): Panel `aside.info-panel`, Kopf `aside.info-panel h2`, oberes Segment `aside.info-panel [role=tabpanel]`, Hinweiszeilen `p.text-amber-300` darin, Datenblock `[data-testid=datenblock]` mit `dt`/`dd`-Paaren, Quellenkarten `aside.info-panel a[data-quelle]`. Hinweistexte: `info.keinText` = „Zu diesem Eintrag gibt es noch keinen Text." / „There is no text for this entry yet.", `info.nichtUebersetzt` = „Noch nicht übersetzt, deutscher Text." / „Not translated yet; German text shown.", `info.keineQuellen` = „Keine Quellen zu diesem Text." / „No sources for this text.".

**Messregel aus Etappe 2:** Der Hinweis „kein Text" erscheint erst, wenn der faule Import aufgelöst ist (`frisch` in `InfoPanel.tsx`), und der Panelkopf zeigt bis dahin den Ausweichtitel. Jede Abfrage wartet deshalb per `performance.now()`-Schleife, bis sich der Prosatext gegenüber dem vorigen Ziel geändert hat oder der Hinweis steht; läuft die Frist ab, wird das als **Nichtmessung** gezählt und nicht als bestanden.

- [ ] **Schritt 1: Server und Stand**

`curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`; `git status --short` leer; `git log --oneline -1` notieren; `ls src/data/texte/*/gymnasium | grep -c objekt-` → `70`; `ls src/data/texte/*/gymnasium | grep -c thema-` → `16`; `grep -c "^    id: '" src/data/quellen.ts` → `62`.

- [ ] **Schritt 2: Dateitest und Verweisziele**

`npx vitest run src/data/texte/dateien.test.ts` → Schlusszeile ins Protokoll, Erwartung 882 Fälle (176 × 5 + 2). Dazu das Skript aus Task 9 Schritt 4: keine Ausgabe.

- [ ] **Schritt 3: Rundgang Körper, beide Sprachen**

`browser_navigate` auf `http://localhost:5173/Orrery/`, direkt danach `window.store.setState({ quality: { tier: 'high' } })`, Infopanel offen (`window.store.getState().setUi({ panels: { ...window.store.getState().ui.panels, info: true } })`), Sprache Deutsch. Dann per `browser_run_code_unsafe`:

```js
async () => {
  const warte = async (pruefe, ms = 4000) => {
    const start = performance.now();
    while (performance.now() - start < ms) {
      const r = pruefe();
      if (r) return r;
      await new Promise((f) => setTimeout(f, 50));
    }
    return null;
  };
  const panel = () => document.querySelector('aside.info-panel [role=tabpanel]');
  const prosa = () => [...(panel()?.querySelectorAll('p:not(.text-amber-300), li') ?? [])].map((e) => e.textContent).join('|');
  const hinweise = () => [...(panel()?.querySelectorAll('p.text-amber-300') ?? [])].map((e) => e.textContent);
  const alle = ['sun','mercury','venus','earth','moon','mars','phobos','deimos','jupiter','io','europa','ganymede','callisto','saturn','mimas','enceladus','tethys','dione','rhea','titan','iapetus','uranus','miranda','ariel','umbriel','titania','oberon','neptune','triton','pluto','charon','ceres','eris','haumea','makemake'];
  window.store.getState().setInfo({ niveau: 'gymnasium', thema: null });
  const aus = [];
  for (const id of alle) {
    const vorher = prosa();
    window.store.getState().setCamera({ targetId: id });
    const ok = await warte(() => ((prosa() !== vorher && prosa().length > 100) || hinweise().length > 0 ? true : null));
    const dt = [...document.querySelectorAll('[data-testid=datenblock] dt')]
      .find((e) => e.textContent === 'Achsneigung' || e.textContent === 'Axial tilt');
    aus.push({
      id,
      gemessen: ok === true,
      kopf: document.querySelector('aside.info-panel h2')?.textContent ?? '',
      hinweise: hinweise(),
      neigung: dt?.nextElementSibling?.textContent ?? '',
      karten: document.querySelectorAll('aside.info-panel a[data-quelle]').length,
      knoepfe: panel()?.querySelectorAll('button').length ?? 0,
    });
  }
  return aus;
}
```

Erwartet für alle 35: `gemessen: true`, `hinweise: []`, `karten` ≥ 1, `knoepfe` ≥ 1, `kopf` gleich der ersten Zeile der Datei ohne `# ` (Sonne, Merkur, Venus, Erde, Mond, Mars, Phobos, Deimos, Jupiter, Io, Europa, Ganymed, Kallisto, Saturn, Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Iapetus, Uranus, Miranda, Ariel, Umbriel, Titania, Oberon, Neptun, Triton, Pluto, Charon, Ceres, Eris, Haumea, Makemake). Achsneigung: Merkur `0°`, Venus `177,4°`, Erde `23,4°`, Mars `25,2°`, Saturn `26,7°`, Uranus `97,8°`, Mond `6,7°`, Titan `0,3°`, Eris `0°`, Makemake `0°`; Triton zeigt `21,4°` (Bekannte Unschärfe, siehe Task 9 Schritt 2). Tabelle ins Protokoll.

Danach `window.store.getState().setUi({ language: 'en' })` und denselben Lauf: `kopf` gleich der englischen Überschrift (Sun, Mercury, …, Ganymede, Callisto, …, Neptune, …), keine Hinweiszeile (insbesondere nicht „Not translated yet; German text shown."), Achsneigung im englischen Zahlformat (`177.4°`).

- [ ] **Schritt 4: Rundgang Themen, beide Sprachen**

Dasselbe Skript mit der Liste `['finsternis','ringe','gebundene-rotation','kirkwood-luecken','achsneigung','zwergplaneten','bahnelemente','modell']` und `window.store.getState().setInfo({ thema: id })` statt `setCamera` (vor dem Lauf einmal `setCamera({ targetId: 'sun' })`, weil ein Zielwechsel das Thema löscht). Erwartet: `gemessen: true`, `hinweise: []`, `karten` ≥ 1, `kopf` gleich dem Titel aus `ui/i18n` (Finsternisse, Ringsysteme, Gebundene Rotation, Kirkwood-Lücken, Achsneigung, Zwergplaneten, Bahnelemente, Grenzen des Modells / Eclipses, Ring systems, Tidal locking, Kirkwood gaps, Axial tilt, Dwarf planets, Orbital elements, Limits of the model). In `modell` erscheint der neue Listenpunkt („Nicht gemessene Achsen" / „Unmeasured axes"): Text des vierten `li` ins Protokoll.

- [ ] **Schritt 5: Keine Sackgasse auf dem Gymnasium-Tab**

Per `browser_run_code_unsafe` für alle 35 Körper und 8 Themen, beide Sprachen, auf dem Gymnasium-Tab jeden Knopf im `[role=tabpanel]` einzeln anklicken (`knopf.click()`), jeweils nach frisch hergestelltem Ausgangszustand (Kino aus: `setCinema({ running: false })`, `setCamera({ mode: 'free' })`; Ziel beziehungsweise Thema setzen; auf Prosa warten). Die Art des Verweises ergibt sich aus der Store-Änderung nach dem Klick: `cinema.running` wird `true` → Szene; `ui.info.thema` ändert sich → Thema (dazu zählt der Knopf „Grenzen des Modells" im Datenblock); `camera.targetId` ändert sich → Objekt; nichts davon → Quellenverweis (nicht gezählt). Nach dem Klick mit der Warteschleife aus Schritt 3 warten, bis sich der Prosatext geändert hat oder eine Hinweiszeile steht.

Getrennt zählen:
- (a) `objekt:`- und `thema:`-Klicks: Erwartung 0 Sackgassen (kein `info.keinText`),
- (b) `szene:`-Klicks: jeder Klick auf eine Szene ohne Gymnasialtext (alle außer `mondfinsternis`) zeigt `info.keinText` — bis 4c-4 so vorgesehen und als Zahl ausgewiesen, nicht als Sackgasse des Kriteriums (Entwurf §7 Nachtrag, Scoping-Satz aus Etappe 2),
- (c) Nichtmessungen (Frist abgelaufen oder Panel im Kino ausgeblendet): Erwartung 0; sonst den betroffenen Knopf mit längerer Frist einzeln wiederholen.

Alle drei Zähler mit Kennungen ins Protokoll.

- [ ] **Schritt 6: Stichproben mit echten Klicks**

Mit Playwright-Klicks (`browser_click`), Tab „Gymnasium", Deutsch: bei Merkur auf „MESSENGER" → Karte `nasa-messenger` hervorgehoben (Klasse `border-sky-300/80`); bei Europa auf „Juice" → Karte `esa-juice` hervorgehoben; bei Ceres auf „Bahnelemente" → `ui.info.thema` = `bahnelemente`, Kopf „Bahnelemente", Liste mit sechs Punkten; bei Neptun auf „Grenzen des Modells" → Kopf „Grenzen des Modells". Store-Werte und Kopf ins Protokoll.

- [ ] **Schritt 7: Grundschul-Nachträge und Hochschul-Tab**

Tab „Grundschule": Venus enthält „Drehung um sich selbst", Oberon enthält „mehrere Kilometer" (Deutsch und Englisch: „single turn on its axis", „several kilometres"). Tab „Hochschule", Ziel Mars: Hinweis `info.hochschuleFolgt`, darunter der Gymnasialtext (Prosa beginnt mit „Mars ist mit 6 779 km").

- [ ] **Schritt 8: Konsole**

`browser_console_messages`: 0 Fehler, 0 Warnungen (sonst wörtlich ins Protokoll).

- [ ] **Schritt 9: Lint, Test, Build**

`npm run lint`, `npm test`, `npm run build`; Schlusszeilen und Testzahl ins Protokoll. Erwartung: 1536 + 5 (Task 1: vier Fälle, Task 2: ein Fall) + 400 (80 neue Dateien × 5) = 1941 Tests.

- [ ] **Schritt 10: Protokoll `docs/phase4c-etappe3-abnahme.md`**

Aufbau wie `docs/phase4c-etappe2-abnahme.md`: Kopf (Datum, Branch, Commit, Prüfumgebung), je Schritt die wörtlichen Werte, Konsole, Lint/Test/Build. „Bekannte Unschärfen":
1. Triton zeigt im Datenblock 21,4° Achsneigung und Miranda 4,3°, weil ihre Pole ohne die periodischen IAU-Glieder hinterlegt sind; Eris und Makemake zeigen 0° als Behelf (in Texten und `thema-modell` benannt). Eine Datenkorrektur gehört nicht zu dieser Etappe.
2. Szenen haben auf dem Gymnasium-Tab außer `mondfinsternis` noch keinen Text (4c-4); die Zahl aus Schritt 5 (b).
3. Der Hochschul-Tab zeigt weiterhin Gymnasialtexte mit Hinweis (Phase 4d).
4. Zahlen in den Texten sind gerundet; Aussagen zum Forschungsstand und zu Missionen (Juice 2034, Europa Clipper, Mimas-Ozean 2024, Makemake-Masse 2025) geben den Stand September 2026 wieder.
5. Quellenadressen sind am 14.09.2026 geprüft; externe Seiten können sich ändern.
6. Der Dateitest prüft Themen- und Objektziele nur auf Existenz im Katalog, die Prüfung „Ziel hat Text im selben Niveau" läuft als Shell-Skript (Task 9 Schritt 4); der Testfall kommt laut Entwurf §7 Nachtrag in 4c-4.

Bewertet wird das Kriterium aus Entwurf §7 Punkt 3 in der Fassung des Nachtrags: „Gymnasium komplett: 33 Körper und 7 Themen in Deutsch und Englisch, Quellenkatalog auf rund 60 Quellen", zusätzlich wie in Etappe 2: kein `objekt:`- oder `thema:`-Verweis auf dem Gymnasium-Tab führt auf „kein Text", `szene:`-Verweise bis 4c-4 ausgenommen.

- [ ] **Schritt 11: README**

Im Absatz „Stand": 4c Etappe 3 (Gymnasialstufe komplett: 35 Körper und 8 Themen in Deutsch und Englisch, 62 Quellen, Achsneigung im Datenblock gegen die eigene Bahn) abgeschlossen; die Szenen beider Niveaus folgen in 4c-4.

- [ ] **Schritt 12: Commit**

```bash
git add docs/phase4c-etappe3-abnahme.md README.md
git commit -m "Abnahme 4c Etappe 3: Gymnasium komplett"
```

## Abschluss

- [ ] `npm run lint`, `npm test`, `npm run build` auf dem Branch, Ausgabe zeigen.
- [ ] Die Kontrollen der lokalen Projektanleitung für versionierte Dateien und Commit-Texte ausführen (Ergebnis leer beziehungsweise 0); zusätzlich `git log master..gymnasium --format=%B | grep -ci 'co-authored\|session'` → `0`.
- [ ] Die lokale Projektanleitung im Abschnitt „Stand" nachziehen (4c-3 auf master, Testzahl, Achsneigungs-Korrektur, 62 Quellen, nächster Schritt 4c-4 Szenen; Rulings unten).
- [ ] Fast-Forward nach `master`, Branch `gymnasium` löschen, `.playwright-mcp/` leeren. Tag: keiner (Phase 4 wird erst nach 4c-4 getaggt).
- [ ] Rulings gesammelt an Jens melden.

## Rulings

Entscheidungen während der Planung, die vom Entwurf abweichen oder ihn präzisieren; Jens bestätigt oder kippt sie.

1. **Achsneigung im Datenblock wird in dieser Etappe korrigiert** (Task 1), obwohl 4c-3 als reine Text-Etappe geplant war: Die Zeile maß gegen die Ekliptik und widerspräche sonst jedem Gymnasialtext (Merkur 7,0° statt 0,03°, Venus 1,2° statt 177,4°). Gemessen wird die Drehachse (bei negativer Rotationsperiode umgekehrt, also über 90° wie in den NSSDC-Faktenblättern) gegen die Bahnnormale aus Position und Geschwindigkeit, zur Epoche J2000 statt zur laufenden Uhr, weil die Pole im Datensatz auf J2000 festliegen. Die Sonne bleibt gegen die Ekliptik (7,25°).
2. **Wortgrenze Gymnasium entfällt im Dateitest** — keine Planungsentscheidung, sondern Entscheidung Jens vom 14.09.2026 („Wortzahl kein Dogma, wichtig ist die korrekte und dem Niveau angepasste Darstellung"); der Entwurf bekommt in Task 3 den Nachtrag. Die Grundschulgrenze 110 bleibt.
3. **Quellenkatalog 62 statt „rund 60"**, ausgewählt nach dem Grundsatz „jeder Körper und jedes Thema mindestens eine Karte": NSSDC-Faktenblätter, NASA-Science-Übersichten, sieben Missionsseiten (NASA und ESA), JPL-Tabellen und -Werkzeuge. Keine neuen Wikipedia-Einträge; auf Deutsch sehen Nutzer deshalb für die meisten Körper nur englischsprachige Seiten. Die IAU-Seiten zur Resolution 2006 sind nicht erreichbar (404) und fehlen.
4. **Neuer Abdeckungstest** „jedem Körper und jedem Thema mindestens eine Quelle" in `quellen.test.ts`. Entwurf §4.4 sieht `info.keineQuellen` als möglichen Zustand vor; der Test macht ihn für Körper und Themen zum Fehler, Szenen bleiben ausgenommen.
5. **Photojournal-Adressen umgestellt** (Umleitung auf science.nasa.gov), Kennungen, Titel und Herausgeber „JPL" bleiben.
6. **Zurückgestellte Grundschul-Punkte aus Etappe 2 (Ruling 13) hier erledigt:** Venus „Drehung um sich selbst" statt „Venustag" (Task 3), Oberon „mehrere Kilometer" statt „etwa sechs" (Task 7).
7. **Etappe-1-Text `thema-modell` (Gymnasium) ergänzt** um den Punkt „Nicht gemessene Achsen" (Eris, Makemake, Triton), damit die Verweise aus Task 8 ein inhaltliches Ziel haben.
8. **Datenartefakte nur benannt, nicht behoben:** Eris und Makemake 0° (Behelfspol), Triton 21,4° und Miranda 4,3° (Pole ohne periodische Glieder). Eine Datenkorrektur oder das Ausblenden der Zeile wäre eine Codeänderung außerhalb des Etappenumfangs.
9. **Überschriften der Körpertexte ohne Artikel** wie in Etappe 1 (`# Merkur`, nicht `# Der Merkur` wie in der Grundschule); Fürwörter wie in den Grundschultexten (Tethys, Miranda, Makemake „er").
10. **Forschungsstand mit Jahreszahlen** (Mimas-Ozean 2024, Makemake-Masse 2025, Juice 2034, Europa Clipper „in den 2030er Jahren"): Die Texte datieren solche Aussagen, damit sie beim Veralten erkennbar bleiben.
11. **Szenenverweise auch in Gymnasialtexten**, obwohl sie bis 4c-4 (außer `mondfinsternis`) auf „kein Text" führen; gezählt getrennt wie in Etappe 2 (Ruling 12 dort). `galileisches-schattenspiel` wird nicht verlinkt.
12. **Kein Dateitest „Ziel hat Text im selben Niveau"** in dieser Etappe; das Shell-Skript in Task 9 Schritt 4 prüft jetzt beide Niveaus und `objekt:` zusätzlich zu `thema:`. Der Testfall bleibt laut Entwurf §7 Nachtrag Teil von 4c-4.
13. **Neuer Themenverweis-Bestand nicht festgeschrieben:** Anders als in Etappe 2 gibt es keine Liste „Themenverweise laut Entscheidung"; die Gymnasialtexte setzen `thema:`-Verweise dort, wo der Sachverhalt sie trägt (etwa Merkur → gebundene Rotation, Neptun → Modellgrenzen wegen der Bahnstörungen).
