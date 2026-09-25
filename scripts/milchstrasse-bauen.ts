/**
 * Baut die Himmelskarte der Milchstraße (Entwurf Phase 6 §3): Quelle holen und
 * prüfen, mit scripts/milchstrasse.py aufbereiten (Kurve, Lage, Schirmwerte),
 * mit KTX-Software kodieren. Läuft nur von Hand (`npm run milchstrasse`); die
 * Stufen sind versioniert, der Build braucht es nicht. KTX-Software wie in
 * scripts/texturen-bauen.ts beschrieben; anderes Python über PYTHON.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kodierungFuer, type Quellliste } from './texturen-bauen.ts';

export const BREITEN = [1024, 2048, 8192] as const;

export interface Schirmwerte { band_median: number; band_p995: number; pol_mittel: number }

export function himmelPfad(breite: number): string {
  return `textures/milchstrasse/himmel-${breite}.ktx2`;
}

/** Zielwerte am Schirm (Entwurf §3.2); leere Liste, wenn alle im Bereich liegen. */
export function werteFehler(w: Schirmwerte): string[] {
  const fehler: string[] = [];
  if (w.band_median < 20 || w.band_median > 30) fehler.push(`Band-Median ${w.band_median} statt 20 bis 30`);
  if (w.band_p995 < 60 || w.band_p995 > 70) fehler.push(`Band-Spitze ${w.band_p995} statt 60 bis 70`);
  if (w.pol_mittel > 6) fehler.push(`Polkappen ${w.pol_mittel} statt höchstens 6`);
  return fehler;
}

function sha256(pfad: string): string {
  return createHash('sha256').update(readFileSync(pfad)).digest('hex');
}

async function main(): Promise<void> {
  const stamm = resolve(fileURLToPath(import.meta.url), '..', '..');
  const ktx = process.env['KTX'] ?? resolve(stamm, '.cache/werkzeuge/ktx/bin/ktx.exe');
  const python = process.env['PYTHON'] ?? 'python';
  const quelle = JSON.parse(readFileSync(resolve(stamm, 'scripts/milchstrasse-quelle.json'), 'utf8')) as { url: string; sha256: string };
  const { kodierung } = JSON.parse(readFileSync(resolve(stamm, 'scripts/texturen-quellen.json'), 'utf8')) as Quellliste;

  const exr = resolve(stamm, '.cache/milchstrasse/milkyway_2020_8k.exr');
  if (!existsSync(exr)) {
    mkdirSync(dirname(exr), { recursive: true });
    const antwort = await fetch(quelle.url);
    if (!antwort.ok) throw new Error(`${quelle.url} liefert ${antwort.status}`);
    writeFileSync(exr, Buffer.from(await antwort.arrayBuffer()));
  }
  const ist = sha256(exr);
  if (ist !== quelle.sha256) throw new Error(`SHA-256 ${ist} statt ${quelle.sha256} (Quelle geändert?)`);

  const zwischen = resolve(stamm, '.cache/milchstrasse/stufen');
  const ausgabe = execFileSync(
    python, [resolve(stamm, 'scripts/milchstrasse.py'), 'bauen', exr, zwischen, ...BREITEN.map(String)],
    { encoding: 'utf8', maxBuffer: 1 << 24 },
  );
  const ergebnis = JSON.parse(ausgabe) as {
    kurve: { a: number; g: number }; lage: { name: string; abstand: number }[];
    werte: Schirmwerte; stufen: { breite: number; png: string }[];
  };
  console.log(`Kurve a=${ergebnis.kurve.a} g=${ergebnis.kurve.g}`);
  for (const m of ergebnis.lage) console.log(`Lage ${m.name}: ${m.abstand}°`);
  console.log(`Schirmwerte ${JSON.stringify(ergebnis.werte)}`);

  for (const { breite, png } of ergebnis.stufen) {
    const ziel = resolve(stamm, 'public', himmelPfad(breite));
    mkdirSync(dirname(ziel), { recursive: true });
    execFileSync(ktx, ['create', '--format', 'R8G8B8_SRGB', ...kodierungFuer(breite, kodierung), '--generate-mipmap', png, ziel]);
    console.log(`${himmelPfad(breite)}  ${statSync(ziel).size} Bytes`);
  }
  const fehler = werteFehler(ergebnis.werte);
  if (fehler.length > 0) {
    console.error(fehler.join('\n'));
    process.exit(1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
