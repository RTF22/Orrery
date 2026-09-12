import { de } from './de';

type Key = keyof typeof de;

/** Unbekannte Schlüssel fallen sichtbar auf, statt still zu verschwinden. */
export function t(key: string): string {
  return (de as Record<string, string>)[key] ?? `[${key}]`;
}

export type { Key };
export { de };
