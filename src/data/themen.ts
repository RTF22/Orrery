/** Niveaustufen der Erläuterungstexte (Entwurf 4c §2 Punkt 2). */
export type Niveau = 'grundschule' | 'gymnasium' | 'hochschule';
export const NIVEAUS: readonly Niveau[] = ['grundschule', 'gymnasium', 'hochschule'];

/**
 * Ein Thema ist ein Erläuterungstext ohne Körper und ohne Szene (Entwurf
 * §4.5). Der Titel steht als Sprachschlüssel in ui/i18n; der Text selbst
 * liegt unter data/texte als thema-<id>.md.
 */
export interface Thema { id: string; titleKey: string }

export const THEMEN: readonly Thema[] = [
  { id: 'finsternis', titleKey: 'thema.finsternis.title' },
  { id: 'ringe', titleKey: 'thema.ringe.title' },
  { id: 'gebundene-rotation', titleKey: 'thema.gebundene-rotation.title' },
  { id: 'kirkwood-luecken', titleKey: 'thema.kirkwood-luecken.title' },
  { id: 'achsneigung', titleKey: 'thema.achsneigung.title' },
  { id: 'zwergplaneten', titleKey: 'thema.zwergplaneten.title' },
  { id: 'bahnelemente', titleKey: 'thema.bahnelemente.title' },
  { id: 'modell', titleKey: 'thema.modell.title' },
  { id: 'sonnensystem', titleKey: 'thema.sonnensystem.title' },
];

/**
 * Thema der Übersicht: Das Infopanel zeigt es beim Start ohne Link und ohne
 * Sitzung, nach „Zurücksetzen" und nach einem Klick auf die Wurzel des
 * Objektbaums (Entwurf 4c §3.3, Nachtrag 4c-4).
 */
export const SYSTEM_THEMA = 'sonnensystem';

export function istThema(id: string): boolean {
  return THEMEN.some((thema) => thema.id === id);
}
