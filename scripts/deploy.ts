/**
 * Lädt dist/ per FTP (Standard: FTPS, explizites TLS) auf den Webspace.
 *
 * Aufruf aus dem Projektstamm, nach `npm run build`:
 *   node scripts/deploy.ts             hochladen
 *   node scripts/deploy.ts --trocken   nur verbinden und Zielverzeichnis auflisten
 *
 * Zugangsdaten stehen in `.env.local` (git-ignoriert), Vorlage in `.env.example`:
 *   DEPLOY_HOST, DEPLOY_USER, DEPLOY_PASSWORD, DEPLOY_DIR, optional DEPLOY_PORT, DEPLOY_SECURE.
 *
 * Ablauf: dist/ wird vollständig in DEPLOY_DIR hochgeladen (Bestand bleibt
 * erhalten), danach werden in DEPLOY_DIR/assets/ nur die gehashten Bündel
 * gelöscht, die es lokal nicht mehr gibt. Ein Leeren des Zielverzeichnisses
 * findet bewusst nicht statt: ein falsch gesetztes DEPLOY_DIR darf nie den
 * übrigen Webauftritt löschen.
 *
 * Die reinen Funktionen sind exportiert und in deploy.test.ts geprüft; der
 * Hauptlauf startet nur beim direkten Aufruf der Datei.
 */
import { Client } from 'basic-ftp';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
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

async function hauptlauf(): Promise<void> {
  const trocken = process.argv.includes('--trocken');
  const stamm = resolve(fileURLToPath(import.meta.url), '..', '..');
  const dist = join(stamm, 'dist');

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

  const client = new Client();
  try {
    await client.access({
      host: konfig.host,
      port: konfig.port,
      user: konfig.user,
      password: konfig.password,
      secure: konfig.secure,
    });
    console.log(`Verbunden mit ${konfig.host}:${konfig.port}${konfig.secure ? ' (FTPS)' : ' (unverschlüsselt)'}`);

    if (trocken) {
      await client.ensureDir(konfig.dir);
      const eintraege = await client.list();
      console.log(`Inhalt von ${konfig.dir}: ${eintraege.length} Einträge`);
      for (const e of eintraege) console.log(`  ${e.isDirectory ? 'd' : '-'} ${e.name}`);
      return;
    }

    await client.ensureDir(konfig.dir);
    await client.uploadFromDir(dist);
    console.log(`Hochgeladen: dist/ nach ${konfig.dir}`);

    const assetsLokal = readdirSync(join(dist, 'assets'));
    await client.cd(`${konfig.dir}/assets`);
    const assetsEntfernt = (await client.list()).filter((e) => !e.isDirectory).map((e) => e.name);
    for (const name of veralteteNamen(assetsEntfernt, assetsLokal)) {
      await client.remove(name);
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
