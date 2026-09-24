/**
 * Lädt dist/ per FTP (Standard: FTPS, explizites TLS) auf den Webspace.
 *
 * Aufruf aus dem Projektstamm, nach `npm run build`:
 *   node scripts/deploy.ts             hochladen
 *   node scripts/deploy.ts --trocken   Dateiliste und Gesamtgröße von dist/ zeigen, dann nur verbinden und Zielverzeichnis auflisten (legt nichts an)
 *
 * Zugangsdaten stehen in `.env.local` (git-ignoriert), Vorlage in `.env.example`:
 *   DEPLOY_HOST, DEPLOY_USER, DEPLOY_PASSWORD, DEPLOY_DIR, optional DEPLOY_PORT, DEPLOY_SECURE.
 *
 * Ablauf: dist/ wird vollständig in DEPLOY_DIR hochgeladen (Bestand bleibt
 * erhalten), danach werden in DEPLOY_DIR/assets/ nur die gehashten Bündel
 * gelöscht, die es lokal nicht mehr gibt. Ein Leeren des Zielverzeichnisses
 * findet bewusst nicht statt: ein falsch gesetztes DEPLOY_DIR darf nie den
 * übrigen Webauftritt löschen. Hochgeladen wird Datei für Datei; bei
 * Netzfehlern wird mit neuer Verbindung bis zu dreimal wiederholt.
 *
 * Die reinen Funktionen sind exportiert und in deploy.test.ts geprüft; der
 * Hauptlauf startet nur beim direkten Aufruf der Datei.
 */
import { Client } from 'basic-ftp';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface DeployKonfig {
  host: string;
  /** Standard 21. */
  port: number;
  user: string;
  password: string;
  /** Absoluter Pfad auf dem Server, z. B. `/example.org/Orrery`. */
  dir: string;
  /** FTPS (explizites TLS); nur `DEPLOY_SECURE=false` schaltet es ab. */
  secure: boolean;
}

type Umgebung = Record<string, string | undefined>;

const PFLICHT = ['DEPLOY_HOST', 'DEPLOY_USER', 'DEPLOY_PASSWORD', 'DEPLOY_DIR'] as const;

/** Liest und prüft die Konfiguration aus den Umgebungsvariablen. */
export function konfigLesen(env: Umgebung): DeployKonfig {
  const wert = (name: string): string => (env[name] ?? '').trim();
  const fehlend = PFLICHT.filter((name) => wert(name) === '');
  if (fehlend.length > 0) {
    throw new Error(
      `Fehlende Angaben in .env.local: ${fehlend.join(', ')} (Vorlage: .env.example)`,
    );
  }
  const dir = wert('DEPLOY_DIR').replace(/\/+$/, '');
  if (!dir.startsWith('/') || dir === '') {
    throw new Error(
      'DEPLOY_DIR muss ein absoluter Pfad unterhalb der Wurzel sein, z. B. /example.org/Orrery',
    );
  }
  const port = wert('DEPLOY_PORT') === '' ? 21 : Number(wert('DEPLOY_PORT'));
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DEPLOY_PORT muss eine Portnummer zwischen 1 und 65535 sein');
  }
  return {
    host: wert('DEPLOY_HOST'),
    port,
    user: wert('DEPLOY_USER'),
    password: wert('DEPLOY_PASSWORD'),
    dir,
    secure: wert('DEPLOY_SECURE').toLowerCase() !== 'false',
  };
}

/** Namen, die auf dem Server liegen, lokal aber nicht mehr existieren. */
export function veralteteNamen(entfernt: readonly string[], lokal: readonly string[]): string[] {
  const vorhanden = new Set(lokal);
  return entfernt.filter((name) => !vorhanden.has(name));
}

const NETZFEHLER_CODES = new Set(['ECONNRESET', 'ETIMEDOUT', 'EPIPE', 'ECONNABORTED', 'ECONNREFUSED']);
const NETZFEHLER_FTP_CODES = new Set([421, 425, 426]);

/** Netzfehler, nach denen ein neuer Versuch mit frischer Verbindung lohnt. */
export function istNetzfehler(fehler: unknown): boolean {
  if (!(fehler instanceof Error)) return false;
  const code = (fehler as { code?: unknown }).code;
  if (typeof code === 'string' && NETZFEHLER_CODES.has(code)) return true;
  if (typeof code === 'number' && NETZFEHLER_FTP_CODES.has(code)) return true;
  return fehler.message.includes('closed') || fehler.message.includes('Timeout');
}

/**
 * Führt `aktion` aus; scheitert sie mit einem Netzfehler, wird `neuVerbinden`
 * aufgerufen und erneut versucht, insgesamt höchstens `versuche`-mal.
 * Andere Fehler und der letzte Netzfehler werden weitergeworfen.
 */
export async function mitWiederholung<T>(
  aktion: () => Promise<T>,
  neuVerbinden: () => Promise<void>,
  versuche = 3,
): Promise<T> {
  for (let versuch = 1; ; versuch += 1) {
    try {
      return await aktion();
    } catch (fehler) {
      if (!istNetzfehler(fehler) || versuch >= versuche) throw fehler;
      await neuVerbinden();
    }
  }
}

export interface DistDatei {
  /** Pfad relativ zur Wurzel, immer mit `/` wie auf dem Server. */
  readonly pfad: string;
  readonly bytes: number;
}

/** Alle Dateien unter `wurzel` (rekursiv), alphabetisch nach Pfad. */
export function dateienUnter(wurzel: string): DistDatei[] {
  const liste: DistDatei[] = [];
  const gehe = (ordner: string): void => {
    for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
      const voll = join(ordner, eintrag.name);
      if (eintrag.isDirectory()) gehe(voll);
      else liste.push({ pfad: relative(wurzel, voll).split(sep).join('/'), bytes: statSync(voll).size });
    }
  };
  gehe(wurzel);
  return liste.sort((a, b) => (a.pfad < b.pfad ? -1 : a.pfad > b.pfad ? 1 : 0));
}

/** Ordner, die vor den Dateien angelegt werden müssen, sortiert, ohne Wurzel: 'textures', 'textures/earth', … */
export function ordnerFuer(dateien: readonly DistDatei[]): string[] {
  const ordner = new Set<string>();
  for (const datei of dateien) {
    const teile = datei.pfad.split('/');
    teile.pop(); // Dateiname entfernen
    let pfad = '';
    for (const teil of teile) {
      pfad = pfad === '' ? teil : `${pfad}/${teil}`;
      ordner.add(pfad);
    }
  }
  return [...ordner].sort();
}

/** Größe in Zehnerpotenzen wie die Ausgabe von `vite build`, mit Dezimalkomma. */
export function groesse(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`;
  const einheiten = ['kB', 'MB', 'GB'] as const;
  let wert = bytes / 1000;
  let i = 0;
  while (wert >= 1000 && i < einheiten.length - 1) {
    wert /= 1000;
    i += 1;
  }
  return `${wert.toFixed(2).replace('.', ',')} ${einheiten[i]}`;
}

function anzahlText(anzahl: number): string {
  return `${anzahl} ${anzahl === 1 ? 'Datei' : 'Dateien'}`;
}

/**
 * Lokale Übersicht für den Trockenlauf: je Datei eine Zeile, Summen je oberstem
 * Ordner, ein Hinweis auf eigene Musik, zuletzt die Gesamtgröße.
 */
export function uebersichtZeilen(dateien: readonly DistDatei[]): string[] {
  const zeilen = dateien.map((d) => `  ${d.pfad}  ${groesse(d.bytes)}`);
  const ordner = new Map<string, { anzahl: number; bytes: number }>();
  for (const d of dateien) {
    const kopf = d.pfad.includes('/') ? `${d.pfad.split('/')[0]}/` : '(Stamm)';
    const summe = ordner.get(kopf) ?? { anzahl: 0, bytes: 0 };
    summe.anzahl += 1;
    summe.bytes += d.bytes;
    ordner.set(kopf, summe);
  }
  zeilen.push('Summen je Ordner:');
  for (const [kopf, summe] of [...ordner].sort(([a], [b]) => (a < b ? -1 : 1))) {
    zeilen.push(`  ${kopf}  ${anzahlText(summe.anzahl)}, ${groesse(summe.bytes)}`);
  }
  if (ordner.has('musik/')) {
    zeilen.push('Hinweis: musik/ stammt aus public/musik/ (git-ignoriert) und würde mit hochgeladen.');
  }
  const gesamt = dateien.reduce((summe, d) => summe + d.bytes, 0);
  zeilen.push(`Gesamt: ${anzahlText(dateien.length)}, ${groesse(gesamt)}`);
  return zeilen;
}

async function hauptlauf(): Promise<void> {
  const trocken = process.argv.includes('--trocken');
  const stamm = resolve(fileURLToPath(import.meta.url), '..', '..');
  const dist = join(stamm, 'dist');

  if (trocken) {
    if (existsSync(join(dist, 'index.html'))) {
      console.log('Lokal in dist/ (würde hochgeladen):');
      for (const zeile of uebersichtZeilen(dateienUnter(dist))) console.log(zeile);
    } else {
      console.log('dist/ fehlt, die lokale Übersicht entfällt (zuerst `npm run build`)');
    }
  }

  try {
    process.loadEnvFile(join(stamm, '.env.local'));
  } catch {
    // Keine .env.local: dann müssen die Variablen anderweitig gesetzt sein,
    // konfigLesen meldet sonst, was fehlt.
  }
  const konfig = konfigLesen(process.env);

  if (!trocken && !existsSync(join(dist, 'index.html'))) {
    throw new Error('dist/index.html fehlt, zuerst `npm run build` ausführen');
  }

  // 60 s statt Standard 30 s: die größten Dateien haben 36 MB.
  const client = new Client(60_000);
  try {
    let ersteVerbindung = true;
    const verbinden = async (): Promise<void> => {
      if (!ersteVerbindung) client.close();
      await client.access({
        host: konfig.host,
        port: konfig.port,
        user: konfig.user,
        password: konfig.password,
        secure: konfig.secure,
      });
      if (ersteVerbindung) {
        console.log(
          `Verbunden mit ${konfig.host}:${konfig.port}${konfig.secure ? ' (FTPS)' : ' (unverschlüsselt)'}`,
        );
        ersteVerbindung = false;
      }
    };
    await verbinden();

    if (trocken) {
      // Nur lesen: ensureDir würde das Zielverzeichnis anlegen.
      try {
        await client.cd(konfig.dir);
      } catch {
        console.log(`${konfig.dir} existiert noch nicht und würde beim Hochladen angelegt`);
        return;
      }
      const eintraege = await client.list();
      console.log(`Inhalt von ${konfig.dir}: ${eintraege.length} Einträge`);
      for (const e of eintraege) console.log(`  ${e.isDirectory ? 'd' : '-'} ${e.name}`);
      return;
    }

    const dateien = dateienUnter(dist);
    await mitWiederholung(() => client.ensureDir(konfig.dir), verbinden);
    for (const ordner of ordnerFuer(dateien)) {
      await mitWiederholung(() => client.ensureDir(`${konfig.dir}/${ordner}`), verbinden);
    }

    let hochgeladen = 0;
    for (const datei of dateien) {
      const quelle = join(dist, ...datei.pfad.split('/'));
      const ziel = `${konfig.dir}/${datei.pfad}`;
      let wiederholt = false;
      await mitWiederholung(
        () => client.uploadFrom(quelle, ziel),
        async () => {
          wiederholt = true;
          await verbinden();
        },
      );
      if (wiederholt) console.log(`Neuer Versuch nach Netzfehler: ${datei.pfad}`);
      hochgeladen += 1;
      if (hochgeladen % 50 === 0 && hochgeladen < dateien.length) {
        console.log(`Hochgeladen: ${hochgeladen} von ${dateien.length} Dateien`);
      }
    }
    console.log(`Hochgeladen: ${hochgeladen} von ${dateien.length} Dateien`);

    const assetsLokal = readdirSync(join(dist, 'assets'));
    const zielAssets = `${konfig.dir}/assets`;
    const eintraegeAssets = await mitWiederholung(() => client.list(zielAssets), verbinden);
    const assetsEntfernt = eintraegeAssets.filter((e) => !e.isDirectory).map((e) => e.name);
    for (const name of veralteteNamen(assetsEntfernt, assetsLokal)) {
      await mitWiederholung(() => client.remove(`${zielAssets}/${name}`), verbinden);
      console.log(`Entfernt: assets/${name}`);
    }
  } finally {
    client.close();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  hauptlauf().catch((fehler: unknown) => {
    console.error(fehler instanceof Error ? fehler.message : fehler);
    process.exitCode = 1;
  });
}
