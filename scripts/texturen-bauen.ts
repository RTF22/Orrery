/**
 * Baut die Texturstufen (Entwurf Phase 5 §5.2, §5.3): Quellen holen und
 * prüfen, je Stufe verkleinern und spiegeln (scripts/textur-stufe.py), mit
 * KTX-Software kodieren, das Mittel der zurückgewandelten Stufe messen und
 * src/data/texturen.ts schreiben. Läuft nur von Hand (`npm run texturen`);
 * der Build braucht es nicht, alle Ergebnisse sind versioniert.
 *
 * Einrichtung von KTX-Software 4.4.2 (winget führt es nicht):
 *   gh release download v4.4.2 -R KhronosGroup/KTX-Software \
 *     -p 'KTX-Software-4.4.2-Windows-x64.exe' -D .cache/werkzeuge
 *   "/c/Program Files/7-Zip/7z.exe" x -y -o.cache/werkzeuge/ktx \
 *     .cache/werkzeuge/KTX-Software-4.4.2-Windows-x64.exe
 * Anderer Ort über die Umgebungsvariable KTX, anderes Python über PYTHON.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Hochquelle { url: string; sha256: string }
export interface KoerperQuelle { id: string; stufen: number[]; hoch?: Hochquelle }
export interface Kodierung { etc1s: string[]; uastc: string[] }
export interface Quellliste { kodierung: Kodierung; koerper: KoerperQuelle[] }
export interface GebauteStufe { breite: number; pfad: string; mittel: number }

/** Bis zu dieser Breite stammen die Stufen aus den versionierten JPEGs. */
export const JPEG_HOECHSTBREITE = 2048;
export const MITTEL_TOLERANZ = 0.005;
/** Die 1k-Stufe ist ETC1S (klein, schneller Start), alle breiteren UASTC (treu). */
export const ETC1S_BREITE = 1024;

export function stufenPfad(id: string, breite: number): string {
  return `textures/${id}/albedo-${breite}.ktx2`;
}

/** Schalter für `ktx create` je Stufe (Entscheidung Jens nach der Probe, siehe Plan 5-3). */
export function kodierungFuer(breite: number, kodierung: Kodierung): string[] {
  return breite <= ETC1S_BREITE ? kodierung.etc1s : kodierung.uastc;
}

export function quelleFuer(
  koerper: KoerperQuelle, breite: number,
): { art: 'jpeg'; pfad: string } | ({ art: 'hoch' } & Hochquelle) {
  if (breite <= JPEG_HOECHSTBREITE) {
    return { art: 'jpeg', pfad: `assets-quellen/texturen/${koerper.id}/albedo.jpg` };
  }
  if (koerper.hoch === undefined) {
    throw new Error(`${koerper.id}: Stufe ${breite} ohne Quelle in texturen-quellen.json`);
  }
  return { art: 'hoch', ...koerper.hoch };
}

/** Fehlermeldung, wenn das Mittel mehr als MITTEL_TOLERANZ vom fachgeprüften Wert abweicht. */
export function mittelFehler(
  id: string, breite: number, mittel: number, fixture: Readonly<Record<string, number>>,
): string | null {
  const soll = fixture[`textures/${id}/albedo.jpg`];
  if (soll === undefined) return `${id}: kein Sollwert in textur-mittel.json`;
  // Auf vier Stellen gerundet, sonst kippt die Grenze 0,005 durch
  // Gleitkomma-Rundung (0,1389 − 0,1339 ergibt sonst 0,005000000000000004).
  const abweichung = Math.round(Math.abs(mittel - soll) * 1e4) / 1e4;
  return abweichung > MITTEL_TOLERANZ
    ? `${id} ${breite}: Mittel ${mittel} weicht um ${abweichung.toFixed(4)} von ${soll} ab`
    : null;
}

export function datenlisteText(
  eintraege: readonly { id: string; stufen: readonly GebauteStufe[] }[],
): string {
  const zeilen = [
    '// Erzeugt von scripts/texturen-bauen.ts (npm run texturen) — nicht von Hand ändern.',
    '// Stufen der Albedokarten je Körper mit gemessenem Mittel (Entwurf Phase 5 §5.2, §5.3).',
    '',
    'export interface TexturStufe {',
    '  /** Breite in Pixeln; die Höhe ist die Hälfte. */',
    '  readonly breite: number;',
    '  /** Pfad relativ zur Basis der Anwendung. */',
    '  readonly pfad: string;',
    '  /** Mittlere lineare Reflexion dieser Stufe (scripts/textur-stufe.py mittel). */',
    '  readonly mittel: number;',
    '}',
    '',
    '/** Stufen je Körper-ID, aufsteigend nach Breite. Körper ohne Eintrag behalten ihre Ausweichfarbe. */',
    'export const TEXTUREN: Readonly<Record<string, readonly TexturStufe[]>> = {',
  ];
  for (const { id, stufen } of [...eintraege].sort((a, b) => a.id.localeCompare(b.id))) {
    zeilen.push(`  ${id}: [`);
    for (const s of [...stufen].sort((a, b) => a.breite - b.breite)) {
      zeilen.push(`    { breite: ${s.breite}, pfad: '${s.pfad}', mittel: ${s.mittel} },`);
    }
    zeilen.push('  ],');
  }
  zeilen.push('};', '');
  return zeilen.join('\n');
}

function sha256(pfad: string): string {
  return createHash('sha256').update(readFileSync(pfad)).digest('hex');
}

function json<T>(befehl: string, args: string[]): T {
  return JSON.parse(execFileSync(befehl, args, { encoding: 'utf8' })) as T;
}

async function holeHochquelle(stamm: string, id: string, quelle: Hochquelle): Promise<string> {
  const ziel = resolve(stamm, '.cache/texturen', `${id}-hoch.jpg`);
  if (!existsSync(ziel)) {
    mkdirSync(dirname(ziel), { recursive: true });
    const antwort = await fetch(quelle.url);
    if (!antwort.ok) throw new Error(`${id}: ${quelle.url} liefert ${antwort.status}`);
    writeFileSync(ziel, Buffer.from(await antwort.arrayBuffer()));
  }
  const ist = sha256(ziel);
  if (ist !== quelle.sha256) throw new Error(`${id}: SHA-256 ${ist} statt ${quelle.sha256} (Quelle geändert?)`);
  return ziel;
}

async function main(): Promise<void> {
  const stamm = resolve(fileURLToPath(import.meta.url), '..', '..');
  const ktx = process.env['KTX'] ?? resolve(stamm, '.cache/werkzeuge/ktx/bin/ktx.exe');
  const python = process.env['PYTHON'] ?? 'python';
  const helfer = resolve(stamm, 'scripts/textur-stufe.py');
  const liste = JSON.parse(readFileSync(resolve(stamm, 'scripts/texturen-quellen.json'), 'utf8')) as Quellliste;
  const fixture = (JSON.parse(
    readFileSync(resolve(stamm, 'src/render/__fixtures__/textur-mittel.json'), 'utf8'),
  ) as { mittel: Record<string, number> }).mittel;
  const zwischen = resolve(stamm, '.cache/stufen');
  mkdirSync(zwischen, { recursive: true });

  const fehler: string[] = [];
  const eintraege: { id: string; stufen: GebauteStufe[] }[] = [];
  let anzahl = 0;
  let summe1k = 0;
  for (const koerper of liste.koerper) {
    const stufen: GebauteStufe[] = [];
    for (const breite of koerper.stufen) {
      const quelle = quelleFuer(koerper, breite);
      const eingang = quelle.art === 'jpeg'
        ? resolve(stamm, quelle.pfad)
        : await holeHochquelle(stamm, koerper.id, quelle);
      const png = resolve(zwischen, `${koerper.id}-${breite}.png`);
      const zurueck = resolve(zwischen, `${koerper.id}-${breite}-zurueck.png`);
      const pfad = stufenPfad(koerper.id, breite);
      const ziel = resolve(stamm, 'public', pfad);
      mkdirSync(dirname(ziel), { recursive: true });
      json(python, [helfer, 'stufe', eingang, png, String(breite), '--spiegeln']);
      execFileSync(ktx, [
        'create', '--format', 'R8G8B8_SRGB', ...kodierungFuer(breite, liste.kodierung), '--generate-mipmap', png, ziel,
      ]);
      execFileSync(ktx, ['extract', '--transcode', 'rgba8', '--level', '0', ziel, zurueck]);
      const { mittel } = json<{ mittel: number }>(python, [helfer, 'mittel', zurueck]);
      const meldung = mittelFehler(koerper.id, breite, mittel, fixture);
      if (meldung !== null) fehler.push(meldung);
      const groesse = statSync(ziel).size;
      if (breite === 1024) summe1k += groesse;
      anzahl += 1;
      stufen.push({ breite, pfad, mittel });
      console.log(`${pfad}  ${groesse} Bytes  Mittel ${mittel}`);
    }
    eintraege.push({ id: koerper.id, stufen });
  }
  writeFileSync(resolve(stamm, 'src/data/texturen.ts'), datenlisteText(eintraege));
  console.log(`${anzahl} Stufen, 1k-Stufen zusammen: ${summe1k} Bytes`);
  if (fehler.length > 0) {
    console.error(fehler.join('\n'));
    process.exit(1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
