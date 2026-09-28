import { useRef } from 'react';
import { useStore } from '../store';
import { lesbarerLink } from '../store/deeplink';
import { t } from './i18n';
import { vollbildUmschalten } from './shortcuts/useShortcuts';
import { stopCinema } from './cinemaControl';
import { useInfoKarte } from './infokarte/zustand';
import { useSteuerKarte } from './steuerkarte/zustand';

/** Wie „DE"/„EN" in Kopfzeile.tsx: ein Domain-Name ist kein übersetzbarer Text. */
const ZIEL = 'orrery3d.de';

const KNOPF = 'pointer-events-auto rounded border border-transparent px-2 py-1 opacity-80 hover:opacity-100 hover:bg-white/10';

/** Karte (Info oder Steuerung) offen: beide Elemente hier sperren dann wie die übrige Oberfläche. */
function useKarteOffen(): boolean {
  const infoOffen = useInfoKarte((s) => s.offen);
  const steuerOffen = useSteuerKarte((s) => s.offen);
  return infoOffen || steuerOffen;
}

/**
 * Schmale Leiste unten mittig (Feature Einbettung, Schritt 2): erscheint,
 * solange die Oberfläche ausgeblendet ist (`ui.hidden` — Präsentationsmodus
 * wie iframe gleichermaßen), und blendet zusätzlich nach kurzer Ruhe aus,
 * genau wie der Mauszeiger im Kino. `untaetig` kommt dafür von außen
 * (App.tsx, `useIdleHide`) herein: Der Ruhewächter hat Nebenwirkungen
 * (`zeigerAus`, `resumeIfIdle`, `noteUserInput`) und darf nur einmal laufen —
 * ein zweiter `useIdleHide`-Aufruf hier verdoppelte sie.
 */
export function Minileiste({ untaetig }: { untaetig: boolean }): React.JSX.Element | null {
  const versteckt = useStore((s) => s.ui.hidden);
  const paused = useStore((s) => s.time.paused);
  const setTime = useStore((s) => s.setTime);
  const setUi = useStore((s) => s.setUi);
  // Wie in CinemaPanel.tsx (dort als `aktiv`): läuft der Film oder steht er
  // nur durch eine Eingabe still (camera.mode noch 'cinema')? In beiden
  // Fällen setzt tickCinema (app/cinema.ts) `time.paused` jedes Bild auf
  // `false` zurück, solange cinema.running true ist — ein reines
  // `setTime({ paused: true })` wäre dann wirkungslos (Fix-Runde 1, C1).
  const kinoAktiv = useStore((s) => s.cinema.running || s.camera.mode === 'cinema');
  const karteOffen = useKarteOffen();

  if (!versteckt || untaetig) return null;

  return (
    <div
      className="minileiste pointer-events-none fixed inset-x-0 bottom-3 flex justify-center"
      inert={karteOffen}
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1 text-xs text-slate-100 backdrop-blur-md">
        <button
          type="button"
          className={KNOPF}
          onClick={() => {
            // Bei laufendem oder angehaltenem Kino derselbe Weg wie der
            // Start/Stopp-Knopf des Kino-Panels (ui/cinemaControl.ts):
            // stopCinema beendet den Film und stellt Kamera und Zeitraffer
            // von vor dem Start wieder her. Ohne Kino bleibt es beim reinen
            // Umschalten von time.paused.
            if (kinoAktiv) stopCinema();
            else setTime({ paused: !paused });
          }}
        >
          {kinoAktiv ? t('cinema.stop') : (paused ? t('leiste.zeitStart') : t('leiste.zeitStopp'))}
        </button>
        <button type="button" className={KNOPF} onClick={() => { void vollbildUmschalten(); }}>
          {t('shortcuts.fullscreen')}
        </button>
        <button type="button" className={KNOPF} onClick={() => { setUi({ hidden: false }); }}>
          {t('leiste.einblenden')}
        </button>
      </div>
    </div>
  );
}

/**
 * Knopf zurück zu orrery3d.de (nur im iframe, Feature Einbettung): dauerhaft
 * sichtbar unten rechts — anders als die Minileiste blendet er weder nach
 * Ruhe noch bei eingeblendeter voller Oberfläche aus. `href` entsteht am
 * DOM-Knoten selbst aus dem dann aktuellen Zustand (nicht beim Rendern): So
 * bleibt das Ziel exakt die im Augenblick der Bedienung gezeigte Ansicht,
 * ohne bei jeder Zustandsänderung neu gerechnet werden zu müssen. Fokus und
 * Klick reichen für Linksklick bzw. Tastatur; Mittelklick, Rechtsklick
 * („Link in neuem Tab öffnen") und langes Drücken auf Touch lösen aber
 * weder `click` noch `focus` aus (Fix-Runde 1, C2) — deshalb zusätzlich
 * `pointerenter` (Maus über dem Knopf, noch vor einem Klick), `pointerdown`
 * (jede Maustaste, auch Mittel-/Rechtsklick, sowie ein Touch-Antippen vor
 * dem Kontextmenü) und `contextmenu` (Rechtsklick- bzw. Halten-Menü selbst).
 *
 * `ueberBogenreiter` (Fix-Runde 1, C3): Im Kompaktmodus bei eingeblendeter
 * Oberfläche sitzt der Bogenreiter (Bogenreiter.tsx, `.bogenreiter` in
 * index.css) an derselben Ecke unten rechts. Der Knopf zurück steht dann
 * höher, statt ihn zu verdecken.
 */
export function KnopfZurueck({ ueberBogenreiter }: { ueberBogenreiter: boolean }): React.JSX.Element | null {
  const eingebettet = useStore((s) => s.ui.eingebettet);
  const karteOffen = useKarteOffen();
  const ref = useRef<HTMLAnchorElement>(null);

  const aktualisieren = (): void => {
    if (ref.current === null) return;
    ref.current.href = lesbarerLink(useStore.getState(), { origin: `https://${ZIEL}`, pathname: '/' });
  };

  if (!eingebettet) return null;

  return (
    <a
      ref={ref}
      href={`https://${ZIEL}/`}
      target="_blank"
      rel="noopener"
      onFocus={aktualisieren}
      onClick={aktualisieren}
      onPointerEnter={aktualisieren}
      onPointerDown={aktualisieren}
      onContextMenu={aktualisieren}
      inert={karteOffen}
      aria-label={t('leiste.zurueck')}
      className={`pointer-events-auto fixed right-3 ${ueberBogenreiter ? 'bottom-16' : 'bottom-3'} rounded border border-white/15 bg-slate-900/70 px-2 py-1 text-xs text-slate-100 opacity-80 backdrop-blur-md hover:opacity-100`}
    >
      {ZIEL}
      {' '}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
