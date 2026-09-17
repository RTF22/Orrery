import type { Niveau } from '../themen';
import type { Sprache } from '../quellen';

export type TextArt = 'objekt' | 'szene' | 'thema';
export interface TextKennung { art: TextArt; kennung: string }

/**
 * Alle Erläuterungstexte, faul geladen (Entwurf 4c §4.1): Das Glob ohne
 * `eager` liefert je Datei eine Ladefunktion; erst der Aufruf holt den
 * Text, danach hält ihn der Speicher. So bleibt der Hauptbundle klein,
 * und eine neue Textdatei braucht keine Codeänderung.
 */
const dateien = import.meta.glob('./*/*/*.md', {
  query: '?raw', import: 'default',
}) as Record<string, () => Promise<string>>;

const speicher = new Map<string, string>();

export function textSchluessel(k: TextKennung): string {
  return `${k.art}:${k.kennung}`;
}

export function textPfad(sprache: Sprache, niveau: Niveau, k: TextKennung): string {
  return `./${sprache}/${niveau}/${k.art}-${k.kennung}.md`;
}

export function textVorhanden(sprache: Sprache, niveau: Niveau, k: TextKennung): boolean {
  return Object.hasOwn(dateien, textPfad(sprache, niveau, k));
}

export function alleTextPfade(): readonly string[] {
  return Object.keys(dateien);
}

export async function ladeText(sprache: Sprache, niveau: Niveau, k: TextKennung): Promise<string | null> {
  const pfad = textPfad(sprache, niveau, k);
  const lader = dateien[pfad];
  if (lader === undefined) return null;
  const bekannt = speicher.get(pfad);
  if (bekannt !== undefined) return bekannt;
  const text = await lader();
  speicher.set(pfad, text);
  return text;
}

/**
 * Ausweichreihenfolge (Entwurf §3.5): gewünschte Kombination; fehlt der
 * Hochschultext, der Gymnasialtext derselben Sprache; fehlt die Sprache,
 * Deutsch in derselben Staffelung.
 */
export function ausweichKandidaten(sprache: Sprache, niveau: Niveau): readonly (readonly [Sprache, Niveau])[] {
  const stufen: Niveau[] = niveau === 'hochschule' ? ['hochschule', 'gymnasium'] : [niveau];
  const sprachen: Sprache[] = sprache === 'de' ? ['de'] : [sprache, 'de'];
  return sprachen.flatMap((s) => stufen.map((n) => [s, n] as const));
}

export interface GeladenerText { text: string; niveau: Niveau; sprache: Sprache }

/** Lädt einen Text oder liefert null; einspritzbar, damit Tests nicht von echten Dateien abhängen. */
export type TextLader = (sprache: Sprache, niveau: Niveau, k: TextKennung) => Promise<string | null>;

export async function ladeMitAusweich(
  sprache: Sprache, niveau: Niveau, k: TextKennung, laden: TextLader = ladeText,
): Promise<GeladenerText | null> {
  for (const [s, n] of ausweichKandidaten(sprache, niveau)) {
    const text = await laden(s, n, k);
    if (text !== null) return { text, niveau: n, sprache: s };
  }
  return null;
}
