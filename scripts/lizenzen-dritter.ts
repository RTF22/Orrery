/**
 * Lizenzen der mitausgelieferten Fremdsoftware als `dist/lizenzen-dritter.txt`.
 *
 * MIT verlangt, dass Copyright- und Lizenztext jeder Kopie beiliegen; Apache 2.0
 * verlangt den Lizenztext und die NOTICE-Datei. Das minimierte Bündel enthält
 * keine Lizenzkommentare mehr, deshalb läuft dieses Skript im Build nach
 * `vite build` (wie doku-bauen.ts) und legt die Texte neben `index.html`.
 *
 * Welche Pakete: die Laufzeitabhängigkeiten aus `package.json` samt deren eigenen
 * Abhängigkeiten (react-dom bringt scheduler mit), dazu Tailwind, dessen Präflight
 * und Hilfsklassen im CSS landen, obwohl es nur Entwicklungsabhängigkeit ist.
 * Dazu kommt der Basis-Transcoder (`public/basis/`), den three.js als fertige
 * Datei mitbringt; seine Texte liegen unter `scripts/lizenzen/`: LICENSE und
 * NOTICE unverändert, von der BSD-Datei nur der Zstandard-Teil (tinyexr gehört zum
 * Encoder), alle aus github.com/BinomialLLC/basis_universal, Stand 99f52d6
 * (27.09.2026). Dass der Transcoder Zstandard enthält, zeigen die UASTC-Stufen:
 * Sie sind mit Zstandard superkomprimiert (KTX2-Kopf, Schema 2) und laden.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DATEINAME = 'lizenzen-dritter.txt';

/** Nur im CSS enthalten, deshalb nicht unter `dependencies`. */
const NUR_IM_CSS = ['tailwindcss'];

interface Kopf {
  version: string;
  license?: string;
  dependencies?: Record<string, string>;
}

/** Liest einen Lizenztext mit LF; unter Windows (core.autocrlf) liegen die Vorlagen mit CRLF. */
function textLesen(pfad: string): string {
  return readFileSync(pfad, 'utf8').replace(/\r\n/g, '\n');
}

function kopfLesen(ordner: string): Kopf {
  return JSON.parse(readFileSync(join(ordner, 'package.json'), 'utf8')) as Kopf;
}

/** Laufzeitabhängigkeiten des Projekts, transitiv, sortiert, plus die reinen CSS-Pakete. */
export function paketeSammeln(stamm = '.'): string[] {
  const gefunden = new Set<string>(NUR_IM_CSS);
  const offen = Object.keys(kopfLesen(stamm).dependencies ?? {});
  while (offen.length > 0) {
    const name = offen.pop()!;
    if (gefunden.has(name)) continue;
    gefunden.add(name);
    offen.push(...Object.keys(kopfLesen(join(stamm, 'node_modules', name)).dependencies ?? {}));
  }
  return [...gefunden].sort();
}

export interface Paket {
  name: string;
  version: string;
  lizenz: string;
  text: string;
}

/** Liest Version, Lizenzkennung und Lizenzdatei eines Pakets aus `node_modules`. */
export function paketLesen(name: string, wurzel = 'node_modules'): Paket {
  const ordner = join(wurzel, name);
  const kopf = kopfLesen(ordner);
  const datei = readdirSync(ordner).find((n) => /^(licen[cs]e|copying)(\.(md|txt))?$/i.test(n));
  if (datei === undefined) throw new Error(`${name}: keine Lizenzdatei in ${ordner}`);
  return {
    name,
    version: kopf.version,
    lizenz: kopf.license ?? 'unbekannt',
    text: textLesen(join(ordner, datei)).trim(),
  };
}

const TRENNER = '='.repeat(78);

function abschnitt(titel: string, text: string): string {
  return `${TRENNER}\n${titel}\n${TRENNER}\n\n${text.trim()}\n`;
}

/** Der vollständige Dateiinhalt für die gegebenen Pakete. */
export function lizenzenText(pakete: readonly Paket[], stamm = 'scripts/lizenzen'): string {
  const lesen = (datei: string): string => textLesen(join(stamm, datei));
  const kopf = [
    'Orrery – Lizenzen der mitgelieferten Fremdsoftware',
    'Orrery – licences of the bundled third-party software',
    '',
    'Orrerys eigener Code steht unter der MIT-Lizenz, die Texte unter CC BY-SA 4.0;',
    'Texturen, Sternkatalog und Himmelskarte siehe ASSETS.de.md im Repository.',
    "Orrery's own code is MIT-licensed, its texts CC BY-SA 4.0; for textures, star",
    'catalogue and sky map see ASSETS.md in the repository.',
    'https://github.com/RTF22/Orrery',
    '',
  ].join('\n');
  const teile = pakete.map((p) => abschnitt(`${p.name} ${p.version} (${p.lizenz})`, p.text));
  teile.push(
    abschnitt(
      'Basis Universal Transcoder (Apache-2.0) – basis/basis_transcoder.js, basis/basis_transcoder.wasm\n' +
        'unverändert aus three.js übernommen / taken unchanged from three.js',
      `${lesen('basis-universal-NOTICE.txt')}\n\n${lesen('basis-universal-LICENSE.txt')}`,
    ),
    abschnitt(
      'Zstandard (BSD-3-Clause) – im Basis-Universal-Transcoder enthalten / contained in the transcoder',
      lesen('zstd-BSD-3-clause.txt'),
    ),
  );
  return `${kopf}\n${teile.join('\n')}`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pakete = paketeSammeln().map((name) => paketLesen(name));
  writeFileSync(join('dist', DATEINAME), lizenzenText(pakete), 'utf8');
  console.log(`${DATEINAME}: ${pakete.map((p) => p.name).join(', ')} + Basis Universal, Zstandard`);
}
