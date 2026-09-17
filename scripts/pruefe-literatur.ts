/**
 * Prüft den Literaturkatalog gegen Crossref und arXiv (Entwurf 4d §4.5).
 *
 * Aufruf aus dem Projektstamm:
 *   npm run literatur:pruefen                          ganzer Katalog
 *   npm run literatur:pruefen -- --nur iess-2019,x     nur diese Einträge
 *
 * Braucht Netz, läuft nur von Hand, nicht in npm test. Abfragen nacheinander
 * mit Pause, ohne E-Mail-Adresse im Abruf. Exit-Code 1 bei mindestens einem
 * Fehler; Warnungen allein ergeben 0. Die Vergleiche stehen getestet in
 * literaturVergleich.ts.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LITERATUR } from '../src/data/literatur.ts';
import type { Publikation } from '../src/data/literatur.ts';
import { arxivEintragLesen, auswahl, pruefeArxiv, pruefeCrossref } from './literaturVergleich.ts';
import type { Befund, CrossrefWerk, Urteil } from './literaturVergleich.ts';

const KOPF = { 'User-Agent': 'Orrery-Literaturpruefung' };
const PAUSE_MS = 200;

const warte = (ms: number): Promise<void> => new Promise((fertig) => { setTimeout(fertig, ms); });

async function pruefe(p: Publikation): Promise<Befund[]> {
  const befunde: Befund[] = [];
  const fehler = (pruefung: Befund['pruefung'], text: string): Befund => ({ id: p.id, pruefung, urteil: 'fehler', text });

  if (p.doi !== undefined) {
    try {
      const antwort = await fetch(`https://api.crossref.org/works/${encodeURIComponent(p.doi)}`, { headers: KOPF });
      if (!antwort.ok) befunde.push(fehler('crossref', `Crossref antwortet ${antwort.status}`));
      else befunde.push(...pruefeCrossref(p, ((await antwort.json()) as { message: CrossrefWerk }).message));
    } catch (e) {
      befunde.push(fehler('crossref', `nicht erreichbar: ${String(e)}`));
    }
    await warte(PAUSE_MS);
  }

  if (p.arxiv !== undefined) {
    try {
      const antwort = await fetch(`https://export.arxiv.org/api/query?id_list=${encodeURIComponent(p.arxiv)}`, { headers: KOPF });
      if (!antwort.ok) befunde.push(fehler('arxiv', `arXiv antwortet ${antwort.status}`));
      else befunde.push(...pruefeArxiv(p, arxivEintragLesen(await antwort.text())));
    } catch (e) {
      befunde.push(fehler('arxiv', `nicht erreichbar: ${String(e)}`));
    }
    await warte(PAUSE_MS);
  }

  if (p.doi === undefined && p.arxiv === undefined && p.url !== undefined) {
    try {
      let antwort = await fetch(p.url, { method: 'HEAD', headers: KOPF, redirect: 'follow' });
      if (antwort.status === 405) antwort = await fetch(p.url, { headers: KOPF, redirect: 'follow' });
      befunde.push({ id: p.id, pruefung: 'url', urteil: antwort.status < 400 ? 'ok' : 'fehler', text: `HTTP ${antwort.status}` });
    } catch (e) {
      befunde.push(fehler('url', `nicht erreichbar: ${String(e)}`));
    }
    await warte(PAUSE_MS);
  }
  return befunde;
}

async function hauptlauf(): Promise<void> {
  const liste = auswahl(process.argv.slice(2), LITERATUR);
  console.log(`Prüfe ${liste.length} von ${LITERATUR.length} Einträgen`);
  const alle: Befund[] = [];
  for (const p of liste) {
    for (const b of await pruefe(p)) {
      console.log(`${b.id.padEnd(28)} ${b.pruefung.padEnd(9)} ${b.urteil.padEnd(8)} ${b.text}`);
      alle.push(b);
    }
  }
  const zahl = (u: Urteil): number => alle.filter((b) => b.urteil === u).length;
  console.log(`\n${zahl('ok')} ok, ${zahl('warnung')} Warnungen, ${zahl('fehler')} Fehler`);
  if (zahl('fehler') > 0) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  hauptlauf().catch((fehler: unknown) => {
    console.error(fehler instanceof Error ? fehler.message : fehler);
    process.exitCode = 1;
  });
}
