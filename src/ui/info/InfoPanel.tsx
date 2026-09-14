import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useStore } from '../../store';
import {
  INFO_BREITE_MAX_REM, INFO_BREITE_MIN_REM, INFO_TEILUNG_MAX, INFO_TEILUNG_MIN,
} from '../../store/types';
import { bodyIndex } from '../../data';
import { SCENES } from '../../data/scenes';
import { NIVEAUS } from '../../data/themen';
import type { Niveau } from '../../data/themen';
import { ladeMitAusweich } from '../../data/texte';
import type { GeladenerText, TextKennung } from '../../data/texte';
import type { Verweis } from '../../data/verweise';
import { t } from '../i18n';
import { aktuellerText, ausweichTitel, grundlage, textSchluessel } from './aktuellerText';
import { parseMarkdown, titelVon } from './markdownParser';
import { Markdown } from './Markdown';
import { Datenblock, VERWEIS_KNOPF } from './Datenblock';
import { Quellenkarten } from './Quellenkarten';
import { Griff } from './Griff';
import { verweisAusfuehren } from './verweisAusfuehren';

/** Schlüssel in ui.panels; anders als die anderen Panels ohne Standardeintrag (siehe useSchmal). */
export const INFO_PANEL = 'info';
/** Unterhalb wird die Spalte zum Bogen von unten (Entwurf 4c §3.4). */
export const SCHMAL_ABFRAGE = '(max-width: 899px)';
/** So lange bleibt eine Quellenkarte nach einem Verweis hervorgehoben. */
const HERVORHEBUNG_MS = 1500;
/** Höchstbreite als Anteil der Fensterbreite. */
const BREITE_MAX_ANTEIL = 0.6;

const remPx = (): number =>
  (typeof document === 'undefined' ? 16 : parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);

/**
 * Fensterbreite als Zustand statt einmalig beim Rendern gelesen: Die
 * Höchstbreite des Panels hängt von ihr ab (60 % der Fensterbreite,
 * Entwurf 4c §3.2) und muss deshalb einer Größenänderung des Fensters
 * folgen, nicht nur dem ersten Aufruf.
 */
function useFensterbreite(): number | null {
  const [breite, setBreite] = useState<number | null>(() => (typeof window === 'undefined' ? null : window.innerWidth));
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bei = (): void => { setBreite(window.innerWidth); };
    window.addEventListener('resize', bei);
    return () => { window.removeEventListener('resize', bei); };
  }, []);
  return breite;
}

function useSchmal(): boolean {
  const abfrage = (): boolean =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(SCHMAL_ABFRAGE).matches;
  const [schmal, setSchmal] = useState(abfrage);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(SCHMAL_ABFRAGE);
    const bei = (): void => { setSchmal(mq.matches); };
    mq.addEventListener('change', bei);
    return () => { mq.removeEventListener('change', bei); };
  }, []);
  return schmal;
}

interface Anzeige { schluessel: string; niveau: Niveau; sprache: 'de' | 'en'; geladen: GeladenerText | null }

/** Standort und Blickziel einer Szene als Objektverweise (Entwurf 4c §5.1). */
function Szenenkopf({ kennung, onVerweis }: { kennung: string; onVerweis: (v: Verweis) => void }): React.JSX.Element | null {
  const szene = SCENES.find((s) => s.id === kennung);
  if (szene === undefined) return null;
  const knopf = (id: string): React.JSX.Element | null => {
    const body = bodyIndex[id];
    if (body === undefined) return null;
    return (
      <button type="button" className={VERWEIS_KNOPF} onClick={() => { onVerweis({ art: 'objekt', kennung: id }); }}>
        {t(body.info.nameKey)}
      </button>
    );
  };
  return (
    <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
      <dt className="opacity-70">{t('info.szene.ziel')}</dt>
      <dd className="m-0">{knopf(szene.targetId)}</dd>
      {szene.lookAtId !== undefined ? (
        <>
          <dt className="opacity-70">{t('info.szene.blick')}</dt>
          <dd className="m-0">{knopf(szene.lookAtId)}</dd>
        </>
      ) : null}
    </dl>
  );
}

const TAB = 'rounded-t border-b-2 px-2 py-1 text-xs';
const TAB_AKTIV = `${TAB} border-sky-300 font-semibold`;
const TAB_RUHIG = `${TAB} border-transparent opacity-70 hover:opacity-100`;

/**
 * Rechte Spalte (Entwurf 4c §3): Kopf mit Titel, drei Niveau-Tabs, oben
 * Datenblock und Text, unten Quellenkarten; Breiten- und Teilungsgriff.
 * Der Text wird beim Wechsel von Kennung, Niveau oder Sprache faul geladen;
 * bis dahin bleibt der vorige stehen, damit nichts flackert.
 */
export function InfoPanel(): React.JSX.Element {
  const language = useStore((s) => s.ui.language);
  const info = useStore((s) => s.ui.info);
  const setInfo = useStore((s) => s.setInfo);
  const setUi = useStore((s) => s.setUi);
  const panels = useStore((s) => s.ui.panels);
  const schmal = useSchmal();
  const offen = panels[INFO_PANEL] ?? !schmal;
  const schluessel = useStore((s) => textSchluessel(aktuellerText(s)));
  const basis = useStore(grundlage);
  const kennung = useMemo<TextKennung>(() => {
    const [art, rest] = schluessel.split(/:(.*)/s);
    return { art: art as TextKennung['art'], kennung: rest ?? '' };
  }, [schluessel]);

  // Ein gewähltes Thema verfällt, sobald Ziel oder Szene wechseln (§3.3).
  const vorigeBasis = useRef(basis);
  useEffect(() => {
    if (vorigeBasis.current === basis) return;
    vorigeBasis.current = basis;
    if (useStore.getState().ui.info.thema !== null) setInfo({ thema: null });
  }, [basis, setInfo]);

  const [anzeige, setAnzeige] = useState<Anzeige | null>(null);
  useEffect(() => {
    let aktuell = true;
    void ladeMitAusweich(language, info.niveau, kennung).then((geladen) => {
      if (aktuell) setAnzeige({ schluessel, niveau: info.niveau, sprache: language, geladen });
    });
    return () => { aktuell = false; };
  }, [schluessel, kennung, info.niveau, language]);

  const oben = useRef<HTMLDivElement | null>(null);
  const segmente = useRef<HTMLDivElement | null>(null);
  useEffect(() => { oben.current?.scrollTo?.(0, 0); }, [schluessel]);

  const [hervorgehoben, setHervorgehoben] = useState<string | null>(null);
  const hervorhebung = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (hervorhebung.current !== null) clearTimeout(hervorhebung.current); }, []);
  const hebeHervor = (id: string): void => {
    setHervorgehoben(id);
    if (hervorhebung.current !== null) clearTimeout(hervorhebung.current);
    hervorhebung.current = setTimeout(() => { setHervorgehoben(null); hervorhebung.current = null; }, HERVORHEBUNG_MS);
  };
  const onVerweis = (v: Verweis): void => { verweisAusfuehren(v, { hebeHervor }); };

  const geladen = anzeige?.geladen ?? null;
  const text = geladen?.text ?? null;
  /**
   * Ist der zuletzt fertig geladene Anzeigestand tatsächlich der aktuell
   * gewünschte (Kennung, Niveau und Sprache)? Solange nicht, zeigt der Kopf
   * den Ausweichtitel der NEUEN Kennung statt der (noch) geladenen
   * Überschrift der ALTEN — deterministisch und sofort, statt kurz die
   * überholte Überschrift stehen zu lassen. Der Text darunter bleibt bis
   * zum frischen Stand trotzdem unverändert (kein Flackern im Textkörper).
   */
  const frisch = anzeige !== null && anzeige.schluessel === schluessel
    && anzeige.niveau === info.niveau && anzeige.sprache === language;
  const titel = useMemo(
    () => (frisch && text !== null ? titelVon(parseMarkdown(text)) : null) ?? ausweichTitel(kennung),
    [frisch, text, kennung, language],
  );
  const body = kennung.art === 'objekt' ? bodyIndex[kennung.kennung] : undefined;
  const hinweise: string[] = [];
  if (anzeige !== null && geladen === null) hinweise.push('info.keinText');
  if (geladen !== null && info.niveau === 'hochschule' && geladen.niveau !== 'hochschule') hinweise.push('info.hochschuleFolgt');
  if (geladen !== null && geladen.sprache !== language) hinweise.push('info.nichtUebersetzt');

  const tabTasten = (e: KeyboardEvent<HTMLDivElement>): void => {
    const i = NIVEAUS.indexOf(info.niveau);
    const richtung = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (richtung === 0) return;
    e.preventDefault();
    const neu = NIVEAUS[(i + richtung + NIVEAUS.length) % NIVEAUS.length];
    if (neu !== undefined) setInfo({ niveau: neu });
  };

  const fensterbreite = useFensterbreite();
  const breiteMax = Math.min(
    INFO_BREITE_MAX_REM,
    fensterbreite === null ? INFO_BREITE_MAX_REM : Math.floor((fensterbreite * BREITE_MAX_ANTEIL) / remPx()),
  );
  /**
   * Tatsächlich dargestellte Breite: nie über die Höchstbreite hinaus, auch
   * wenn ein aus Sitzung oder Link wiederhergestellter Store-Wert größer ist
   * als in einem inzwischen schmaleren Fenster erlaubt. Der Store-Wert
   * selbst bleibt unangetastet — hier wird nichts zurückgeschrieben, nur
   * die Darstellung geklemmt.
   */
  const breite = Math.min(info.breiteRem, Math.max(INFO_BREITE_MIN_REM, breiteMax));

  if (!offen) {
    return (
      <button
        type="button"
        aria-expanded={false}
        aria-label={t('info.oeffnen')}
        onClick={() => { setUi({ panels: { ...panels, [INFO_PANEL]: true } }); }}
        className="info-reiter pointer-events-auto self-start rounded-lg border border-white/10 bg-slate-900/70 px-1 py-2 text-xs font-semibold text-slate-100 backdrop-blur-md hover:bg-white/10"
      >
        {t('panel.info')}
      </button>
    );
  }

  return (
    <aside
      aria-label={t('panel.info')}
      className="info-panel pointer-events-auto relative flex max-h-full flex-col rounded-lg border border-white/10 bg-slate-900/70 text-slate-100 backdrop-blur-md"
      style={{ width: `${breite}rem` }}
    >
      {schmal ? null : (
        <Griff
          richtung="senkrecht"
          wert={breite}
          min={INFO_BREITE_MIN_REM}
          max={Math.max(INFO_BREITE_MIN_REM, breiteMax)}
          schritt={1}
          label={t('info.griff.breite')}
          ausVersatz={(start, dx) => start - dx / remPx()}
          onWert={(breiteRem) => { setInfo({ breiteRem }); }}
          className="absolute top-0 left-0 z-10 h-full w-2 -translate-x-1/2 rounded hover:bg-sky-300/30"
        />
      )}
      <header className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <h2 className="m-0 truncate text-sm font-semibold">{titel}</h2>
        <button
          type="button"
          aria-expanded
          aria-label={t('info.schliessen')}
          onClick={() => { setUi({ panels: { ...panels, [INFO_PANEL]: false } }); }}
          className="text-xs opacity-70 hover:opacity-100"
        >
          ▾
        </button>
      </header>
      <div role="tablist" aria-label={t('info.niveau')} onKeyDown={tabTasten} className="flex gap-1 border-b border-white/10 px-3 pt-1">
        {NIVEAUS.map((n) => (
          <button
            key={n}
            type="button"
            role="tab"
            aria-selected={n === info.niveau}
            tabIndex={n === info.niveau ? 0 : -1}
            onClick={() => { setInfo({ niveau: n }); }}
            className={n === info.niveau ? TAB_AKTIV : TAB_RUHIG}
          >
            {t(`info.tab.${n}`)}
          </button>
        ))}
      </div>
      <div ref={segmente} className="flex min-h-0 flex-1 flex-col">
        <div ref={oben} role="tabpanel" className="min-h-0 overflow-y-auto px-3 py-2" style={{ flex: `${info.teilung} 1 0px` }}>
          {hinweise.map((h) => <p key={h} className="m-0 mb-2 text-xs text-amber-300">{t(h)}</p>)}
          {body !== undefined ? (
            <Datenblock body={body} niveau={info.niveau} onModell={() => { setInfo({ thema: 'modell' }); }} />
          ) : null}
          {kennung.art === 'szene' ? <Szenenkopf kennung={kennung.kennung} onVerweis={onVerweis} /> : null}
          {text !== null ? <Markdown text={text} onVerweis={onVerweis} titelAusblenden /> : null}
        </div>
        <Griff
          richtung="waagerecht"
          wert={info.teilung}
          min={INFO_TEILUNG_MIN}
          max={INFO_TEILUNG_MAX}
          schritt={0.05}
          label={t('info.griff.teilung')}
          ausVersatz={(start, dy) => start + dy / Math.max(segmente.current?.clientHeight ?? 600, 1)}
          onWert={(teilung) => { setInfo({ teilung }); }}
          className="h-2 shrink-0 border-y border-white/10 hover:bg-sky-300/30"
        />
        <div className="min-h-24 overflow-y-auto px-3 py-2" style={{ flex: `${1 - info.teilung} 1 0px` }}>
          <h3 className="m-0 mb-1 text-xs font-semibold opacity-70">{t('info.quellen')}</h3>
          <Quellenkarten kennung={schluessel} hervorgehoben={hervorgehoben} />
        </div>
      </div>
    </aside>
  );
}
