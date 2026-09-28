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
 * Weitere Schalter: `--markieren` markiert einen schon belegten Zielordner
 * einmalig als Orrerys eigenen, `--mit-musik` lädt musik/ mit hoch,
 * `--unsicher` erlaubt DEPLOY_SECURE=false.
 *
 * Ablauf: Der Zielordner muss leer sein oder die Markierungsdatei MARKE
 * tragen, sonst bricht der Deploy ab — ein falsch gesetztes DEPLOY_DIR darf
 * nie einen fremden Webauftritt überschreiben. dist/ wird hochgeladen
 * (Bestand bleibt erhalten), index.html zuletzt und per Umbenennung, damit
 * nie ein halbes index.html ausgeliefert wird. Danach werden in
 * DEPLOY_DIR/assets/ die gehashten Bündel gelöscht, die weder zu diesem noch
 * zum vorigen Deploy gehören: Offene Tabs finden ihre nachgeladenen Chunks so
 * noch eine Version lang. Die Markierung merkt sich dafür die Assets des
 * letzten Deploys. Ein Leeren des Zielverzeichnisses findet bewusst nicht
 * statt. Hochgeladen wird Datei für Datei; bei Netzfehlern wird mit neuer
 * Verbindung bis zu dreimal wiederholt.
 *
 * Die reinen Funktionen sind exportiert und in deploy.test.ts geprüft; der
 * Hauptlauf startet nur beim direkten Aufruf der Datei.
 */
import { Client } from 'basic-ftp';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { Readable, Writable } from 'node:stream';
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

/** Schalter der Befehlszeile. */
export interface Schalter {
  trocken: boolean;
  markieren: boolean;
  mitMusik: boolean;
  unsicher: boolean;
}

export function schalterLesen(argv: readonly string[]): Schalter {
  return {
    trocken: argv.includes('--trocken'),
    markieren: argv.includes('--markieren'),
    mitMusik: argv.includes('--mit-musik'),
    unsicher: argv.includes('--unsicher'),
  };
}

/** Unverschlüsseltes FTP schickt das Passwort im Klartext: nur mit ausdrücklichem --unsicher. */
export function verschluesselungPruefen(konfig: DeployKonfig, unsicher: boolean): void {
  if (!konfig.secure && !unsicher) {
    throw new Error(
      'DEPLOY_SECURE=false überträgt das Passwort unverschlüsselt; nur zusammen mit --unsicher erlaubt',
    );
  }
}

/**
 * Markierungsdatei im Zielordner. Ohne Punkt am Anfang, weil manche
 * FTP-Server Punktdateien im Listing ausblenden. Sie ist öffentlich lesbar,
 * enthält aber nur die ohnehin öffentlichen Namen der Bündel.
 */
export const MARKE = 'orrery-deploy.json';

/** Leer, von Orrery markiert oder fremd belegt (dann bricht der Deploy ab). */
export function zielStand(namen: readonly string[]): 'leer' | 'markiert' | 'fremd' {
  const echte = namen.filter((n) => n !== '.' && n !== '..');
  if (echte.includes(MARKE)) return 'markiert';
  return echte.length === 0 ? 'leer' : 'fremd';
}

export function markeText(assets: readonly string[]): string {
  const inhalt = {
    hinweis: 'Zielordner von Orrery (scripts/deploy.ts). assets: Bündel des letzten Deploys.',
    assets: [...assets].sort(),
  };
  return `${JSON.stringify(inhalt, null, 2)}\n`;
}

/** Assets aus der Markierung; eine leere oder fremde Datei ergibt keine. */
export function markeLesen(text: string): string[] {
  try {
    const daten = JSON.parse(text) as { assets?: unknown };
    return Array.isArray(daten.assets) ? daten.assets.filter((a): a is string => typeof a === 'string') : [];
  } catch {
    return [];
  }
}

/** Bündel auf dem Server, die weder zu diesem noch zum vorigen Deploy gehören. */
export function zuLoeschendeAssets(
  server: readonly string[], lokal: readonly string[], vorige: readonly string[],
): string[] {
  return veralteteNamen(server, [...lokal, ...vorige]);
}

/** Reihenfolge des Uploads: index.html zuletzt, musik/ nur mit Schalter. */
export function hochladeFolge(
  dateien: readonly DistDatei[], mitMusik: boolean,
): { vorher: DistDatei[]; einstieg: DistDatei | undefined; musikAusgelassen: number } {
  const musik = (d: DistDatei): boolean => d.pfad.startsWith('musik/');
  return {
    vorher: dateien.filter((d) => d.pfad !== 'index.html' && (mitMusik || !musik(d))),
    einstieg: dateien.find((d) => d.pfad === 'index.html'),
    musikAusgelassen: mitMusik ? 0 : dateien.filter(musik).length,
  };
}

/**
 * Entfernt eine Datei; ist sie schon fort (FTP 550), gilt das nicht als
 * Fehler — der Server listete schon verschwundene Bündel, und der Lauf brach
 * sonst vor dem Schreiben der Markierung ab. true, wenn wirklich entfernt.
 */
export async function entfernenFallsDa(
  client: { remove(pfad: string): Promise<unknown> }, pfad: string,
): Promise<boolean> {
  try {
    await client.remove(pfad);
    return true;
  } catch (fehler) {
    if ((fehler as { code?: unknown }).code === 550) return false;
    throw fehler;
  }
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
    zeilen.push(
      'Hinweis: musik/ stammt aus public/musik/ (git-ignoriert) und wird nur mit --mit-musik hochgeladen.',
    );
  }
  const gesamt = dateien.reduce((summe, d) => summe + d.bytes, 0);
  zeilen.push(`Gesamt: ${anzahlText(dateien.length)}, ${groesse(gesamt)}`);
  return zeilen;
}

/** Liest eine kleine Textdatei vom Server. */
async function textHolen(client: Client, pfad: string): Promise<string> {
  const teile: Buffer[] = [];
  const senke = new Writable({
    write(stueck: Buffer, _kodierung, fertig) {
      teile.push(stueck);
      fertig();
    },
  });
  await client.downloadTo(senke, pfad);
  return Buffer.concat(teile).toString('utf8');
}

async function textAblegen(client: Client, text: string, pfad: string): Promise<void> {
  await client.uploadFrom(Readable.from([Buffer.from(text, 'utf8')]), pfad);
}

const STAND_TEXT = {
  markiert: `Markierung ${MARKE} gefunden: Orrerys eigener Zielordner.`,
  leer: `Zielordner leer: ${MARKE} würde angelegt.`,
  fremd: `Keine Markierung ${MARKE}, aber der Ordner ist belegt: Der Deploy bräche ab. `
    + 'Ist es sicher Orrerys Ordner, einmalig mit --markieren hochladen.',
} as const;

async function hauptlauf(): Promise<void> {
  const schalter = schalterLesen(process.argv);
  const { trocken } = schalter;
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
  verschluesselungPruefen(konfig, schalter.unsicher);

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

    // Nur lesen: ensureDir würde das Zielverzeichnis anlegen. Fehlt es,
    // gilt es als leer und wird beim Hochladen angelegt.
    let eintraege: Awaited<ReturnType<Client['list']>> | null = null;
    try {
      eintraege = await client.list(konfig.dir);
    } catch {
      eintraege = null;
    }
    const stand = zielStand((eintraege ?? []).map((e) => e.name));

    if (trocken) {
      if (eintraege === null) {
        console.log(`${konfig.dir} existiert noch nicht und würde beim Hochladen angelegt`);
      } else {
        console.log(`Inhalt von ${konfig.dir}: ${eintraege.length} Einträge`);
        for (const e of eintraege) console.log(`  ${e.isDirectory ? 'd' : '-'} ${e.name}`);
      }
      console.log(STAND_TEXT[stand]);
      return;
    }

    if (stand === 'fremd' && !schalter.markieren) {
      throw new Error(
        `${konfig.dir} ist belegt, trägt aber keine Markierung ${MARKE}. Falsches DEPLOY_DIR? `
        + 'Zuerst mit --trocken prüfen; ist es Orrerys Ordner, einmalig mit --markieren hochladen.',
      );
    }
    const marke = `${konfig.dir}/${MARKE}`;
    const vorige = stand === 'markiert'
      ? markeLesen(await mitWiederholung(() => textHolen(client, marke), verbinden))
      : [];

    const folge = hochladeFolge(dateienUnter(dist), schalter.mitMusik);
    const dateien = folge.einstieg === undefined ? folge.vorher : [...folge.vorher, folge.einstieg];
    await mitWiederholung(() => client.ensureDir(konfig.dir), verbinden);
    // Die Markierung zuerst: Bricht der Lauf ab, bleibt der Ordner als Orrerys erkennbar.
    if (stand !== 'markiert') {
      await mitWiederholung(() => textAblegen(client, markeText(vorige), marke), verbinden);
      console.log(`Markierung angelegt: ${MARKE}`);
    }
    for (const ordner of ordnerFuer(dateien)) {
      await mitWiederholung(() => client.ensureDir(`${konfig.dir}/${ordner}`), verbinden);
    }

    let hochgeladen = 0;
    const hochladen = async (datei: DistDatei, ziel: string): Promise<void> => {
      const quelle = join(dist, ...datei.pfad.split('/'));
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
    };
    for (const datei of folge.vorher) await hochladen(datei, `${konfig.dir}/${datei.pfad}`);
    if (folge.einstieg !== undefined) {
      // Erst vollständig unter anderem Namen, dann umbenennen: Wer die Seite
      // während des Uploads lädt, bekommt das alte oder das neue index.html,
      // nie ein halbes.
      const ziel = `${konfig.dir}/index.html`;
      const zwischen = `${ziel}.neu`;
      await hochladen(folge.einstieg, zwischen);
      await mitWiederholung(async () => {
        try {
          await client.rename(zwischen, ziel);
        } catch {
          // Manche Server benennen nicht über eine vorhandene Datei hinweg um.
          await client.remove(ziel, true);
          await client.rename(zwischen, ziel);
        }
      }, verbinden);
    }
    console.log(`Hochgeladen: ${hochgeladen} von ${dateien.length} Dateien`);
    if (folge.musikAusgelassen > 0) {
      console.log(
        `musik/ nicht hochgeladen (${anzahlText(folge.musikAusgelassen)}). Mit --mit-musik hochladen, `
        + 'wenn die Rechte geklärt sind und die Datenschutzerklärung die Musik nennt.',
      );
    }

    const assetsLokal = readdirSync(join(dist, 'assets'));
    const zielAssets = `${konfig.dir}/assets`;
    const eintraegeAssets = await mitWiederholung(() => client.list(zielAssets), verbinden);
    const assetsEntfernt = eintraegeAssets.filter((e) => !e.isDirectory).map((e) => e.name);
    for (const name of zuLoeschendeAssets(assetsEntfernt, assetsLokal, vorige)) {
      const entfernt = await mitWiederholung(() => entfernenFallsDa(client, `${zielAssets}/${name}`), verbinden);
      console.log(entfernt ? `Entfernt: assets/${name}` : `Schon fort: assets/${name}`);
    }
    // Zuletzt: Erst ein vollständiger Lauf macht diese Bündel zum „vorigen Deploy".
    await mitWiederholung(() => textAblegen(client, markeText(assetsLokal), marke), verbinden);
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
