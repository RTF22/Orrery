import type { AppState } from '../../store/types';
import type { TextKennung } from '../../data/texte';
import { textSchluessel } from '../../data/texte';
import { SCENES } from '../../data/scenes';
import { THEMEN } from '../../data/themen';
import { bodyIndex } from '../../data';
import { sceneIndexFor } from '../../sim/director';
import { t } from '../i18n';

export type Auswahlzustand = Pick<AppState, 'camera' | 'cinema' | 'ui'>;

/**
 * Szene des laufenden oder nur angehaltenen Kinos, sonst `null`. Die
 * Bedingung spiegelt `cinemaAktiv()` aus ui/cinemaControl.ts (Zwilling):
 * Jene liest den globalen Store, hier geht es um den übergebenen Zustand,
 * damit die Funktion als Selektor und in Tests mit eigenem Zustand taugt.
 * Eine Eingabe hält den Film an (`pauseOnInput`), die Oberfläche erscheint
 * erst danach — das Panel soll dann weiter die Szene zeigen.
 */
function laufendeSzene(s: Auswahlzustand): string | null {
  if (!s.cinema.running && s.camera.mode !== 'cinema') return null;
  const index = sceneIndexFor(s.cinema.nummer, SCENES.length, s.cinema.seed, s.cinema.shuffle);
  return SCENES[index]?.id ?? SCENES[0]?.id ?? null;
}

/**
 * Welche Kennung das Panel gerade zeigt (Entwurf 4c §3.3): ein per Verweis
 * gewähltes Thema, sonst die Szene des laufenden oder angehaltenen Kinos,
 * sonst das Kameraziel.
 */
export function aktuellerText(s: Auswahlzustand): TextKennung {
  if (s.ui.info.thema !== null) return { art: 'thema', kennung: s.ui.info.thema };
  const szene = laufendeSzene(s);
  if (szene !== null) return { art: 'szene', kennung: szene };
  return { art: 'objekt', kennung: s.camera.targetId };
}

/**
 * Dieselbe Auswahl ohne das Thema: Wechselt sie, verfällt ein gewähltes
 * Thema, außer es wurde im selben `setState` neu gesetzt (ui/info/
 * themaVerfall.ts). Als Zeichenkette, damit ein Vergleich zweier Zustände
 * ohne neues Objekt je Aufruf auskommt.
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
