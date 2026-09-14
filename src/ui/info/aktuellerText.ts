import type { AppState } from '../../store/types';
import type { TextKennung } from '../../data/texte';
import { textSchluessel } from '../../data/texte';
import { SCENES } from '../../data/scenes';
import { THEMEN } from '../../data/themen';
import { bodyIndex } from '../../data';
import { sceneIndexFor } from '../../sim/director';
import { t } from '../i18n';

export type Auswahlzustand = Pick<AppState, 'camera' | 'cinema' | 'ui'>;

function laufendeSzene(s: Auswahlzustand): string | null {
  if (!s.cinema.running) return null;
  const index = sceneIndexFor(s.cinema.nummer, SCENES.length, s.cinema.seed, s.cinema.shuffle);
  return SCENES[index]?.id ?? SCENES[0]?.id ?? null;
}

/**
 * Welche Kennung das Panel gerade zeigt (Entwurf 4c §3.3): ein per Verweis
 * gewähltes Thema, sonst die laufende Kinoszene, sonst das Kameraziel.
 */
export function aktuellerText(s: Auswahlzustand): TextKennung {
  if (s.ui.info.thema !== null) return { art: 'thema', kennung: s.ui.info.thema };
  const szene = laufendeSzene(s);
  if (szene !== null) return { art: 'szene', kennung: szene };
  return { art: 'objekt', kennung: s.camera.targetId };
}

/**
 * Dieselbe Auswahl ohne das Thema: Wechselt sie, verfällt ein gewähltes
 * Thema. Als Zeichenkette, damit ein Store-Selektor sie ohne neues Objekt
 * je Aufruf zurückgeben kann.
 */
export function grundlage(s: Auswahlzustand): string {
  const szene = laufendeSzene(s);
  return szene !== null ? `szene:${szene}` : `objekt:${s.camera.targetId}`;
}

/** Titel, wenn kein Text da ist oder der Text keine Überschrift trägt. */
export function ausweichTitel(k: TextKennung): string {
  switch (k.art) {
    case 'objekt': {
      const body = bodyIndex[k.kennung];
      return body === undefined ? k.kennung : t(body.info.nameKey);
    }
    case 'szene': {
      const szene = SCENES.find((s) => s.id === k.kennung);
      return szene === undefined ? k.kennung : t(szene.titleKey);
    }
    case 'thema': {
      const thema = THEMEN.find((th) => th.id === k.kennung);
      return thema === undefined ? k.kennung : t(thema.titleKey);
    }
  }
}

export { textSchluessel };
