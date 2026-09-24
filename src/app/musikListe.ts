import type { MusikEintrag } from '../ui/musikStand';

/** Ein Dateiname ohne Pfadtrenner; `.` und `..` zählen nicht (Entwurf Phase 5 §6.1). */
function gueltigeDatei(wert: unknown): wert is string {
  return typeof wert === 'string' && wert !== '' && wert !== '.' && wert !== '..' && !/[/\\]/.test(wert);
}

function text(wert: unknown): string | undefined {
  if (typeof wert !== 'string') return undefined;
  const bereinigt = wert.trim();
  return bereinigt === '' ? undefined : bereinigt;
}

/** Nur http und https — ein `javascript:`-Link aus fremder Hand wird nie klickbar. */
function link(wert: unknown): string | undefined {
  const t = text(wert);
  return t !== undefined && /^https?:\/\//i.test(t) ? t : undefined;
}

/**
 * Prüft die Liste `musik/stuecke.json` des Betreibers. Ungültige Einträge
 * fallen still weg; bleibt nichts übrig, gibt es keine Musik.
 */
export function pruefeListe(roh: unknown): MusikEintrag[] {
  if (!Array.isArray(roh)) return [];
  const liste: MusikEintrag[] = [];
  for (const eintrag of roh) {
    if (typeof eintrag !== 'object' || eintrag === null || Array.isArray(eintrag)) continue;
    const felder = eintrag as Record<string, unknown>;
    if (!gueltigeDatei(felder['datei'])) continue;
    const titel = text(felder['titel']);
    const urheber = text(felder['urheber']);
    const verweis = link(felder['link']);
    liste.push({
      datei: felder['datei'],
      ...(titel === undefined ? {} : { titel }),
      ...(urheber === undefined ? {} : { urheber }),
      ...(verweis === undefined ? {} : { link: verweis }),
    });
  }
  return liste;
}
