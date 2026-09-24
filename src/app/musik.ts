import { pruefeListe } from './musikListe';
import { BLENDE_S, UEBERBLENDUNG_S, erzeugeFolge, sollSpielen } from './musikFolge';
import { useStore } from '../store';
import { useMusikStand, type MusikEintrag } from '../ui/musikStand';

/** Die Teile der Web-Audio-Schnittstelle, die der Spieler braucht — Tests setzen Attrappen ein. */
export interface Param {
  value: number;
  setValueAtTime(v: number, t: number): unknown;
  linearRampToValueAtTime(v: number, t: number): unknown;
  cancelScheduledValues(t: number): unknown;
}
export interface Knoten { connect(ziel: unknown): unknown }
export interface Verstaerker extends Knoten { readonly gain: Param }
export interface Tonkontext {
  readonly currentTime: number;
  readonly state: string;
  readonly destination: unknown;
  resume(): Promise<void>;
  createGain(): Verstaerker;
  createMediaElementSource(el: HTMLAudioElement): Knoten;
}
export interface Tonumgebung {
  kontext(): Tonkontext;
  element(): HTMLAudioElement;
}

/** Momentaufnahme für Tests und Messungen (window.musik.stand() im DEV-Build). */
export interface SpielerStand {
  spielt: boolean;
  stueck: number | null;
  blende: number;
  kanaele: [number, number];
  lautstaerke: number;
  pausiert: [boolean, boolean];
  zeit: [number, number];
}

export interface MusikSpieler {
  /** Gleicht Soll und Lautstärke ab; mit unveränderten Werten geschieht nichts. */
  setze(spielen: boolean, lautstaerke: number): void;
  /** Nach einer Nutzergeste: gesperrten Kontext fortsetzen, abgewiesenes Abspielen wiederholen. */
  entsperren(): void;
  stand(): SpielerStand;
  beenden(): void;
}

interface Kanal {
  el: HTMLAudioElement;
  verstaerker: Verstaerker;
  stueck: number | null;
}

/**
 * Spieler nach Entwurf Phase 5 §6.3: zwei Audio-Elemente (gestreamt,
 * `preload="none"`) über je einen Verstärker, eine gemeinsame Blende und die
 * Lautstärke. Nur über Web Audio greift die Lautstärke auch auf iOS.
 * Graph: Element → Kanalverstärker → Blende → Lautstärke → Ausgang.
 */
export function erzeugeSpieler(
  liste: readonly MusikEintrag[],
  ordner: string,
  umgebung: Tonumgebung,
  beiStueck: (eintrag: MusikEintrag | null) => void,
  zufall: () => number = Math.random,
): MusikSpieler {
  const kontext = umgebung.kontext();
  const haupt = kontext.createGain();
  haupt.connect(kontext.destination);
  const blende = kontext.createGain();
  blende.gain.value = 0;
  blende.connect(haupt);
  const folge = erzeugeFolge(liste.length, zufall);
  const gescheitert = new Set<number>();
  // 0 | 1 statt number: so bleibt kanaele[aktiv] unter noUncheckedIndexedAccess ein Kanal.
  let aktiv: 0 | 1 = 0;
  let soll = false;
  let lautstaerke = Number.NaN;
  let ueberblendet = false;
  let pausenUhr: ReturnType<typeof setTimeout> | undefined;
  let beendet = false;

  const kanaele: [Kanal, Kanal] = [neuerKanal(), neuerKanal()];

  function neuerKanal(): Kanal {
    const el = umgebung.element();
    el.preload = 'none';
    // Ein einzelnes Stück läuft in Schleife statt in sich selbst überzublenden.
    el.loop = liste.length === 1;
    const verstaerker = kontext.createGain();
    kontext.createMediaElementSource(el).connect(verstaerker);
    verstaerker.connect(blende);
    const kanal: Kanal = { el, verstaerker, stueck: null };
    el.addEventListener('timeupdate', () => { beiZeit(kanal); });
    el.addEventListener('ended', () => { if (kanal === kanaele[aktiv] && soll) wechseln(0); });
    el.addEventListener('error', () => { beiFehler(kanal); });
    return kanal;
  }

  function sofort(param: Param, wert: number): void {
    const t = kontext.currentTime;
    param.cancelScheduledValues(t);
    param.setValueAtTime(wert, t);
  }

  /** Lineare Rampe vom aktuellen Wert aus — eine laufende Blende kehrt ohne Sprung um. */
  function rampe(param: Param, von: number, nach: number, dauer: number): void {
    const t = kontext.currentTime;
    param.cancelScheduledValues(t);
    param.setValueAtTime(von, t);
    param.linearRampToValueAtTime(nach, t + dauer);
  }

  function spiele(el: HTMLAudioElement): void {
    // Ein abgewiesenes Abspielen (Autoplay-Sperre) holt entsperren() nach.
    el.play().catch(() => {});
  }

  function erschoepft(): boolean {
    return gescheitert.size >= liste.length;
  }

  /** Nächstes Stück, das nicht gescheitert ist; null, wenn keines bleibt. */
  function naechstesStueck(): number | null {
    if (erschoepft()) return null;
    for (let i = 0; i < 2 * liste.length; i++) {
      const kandidat = folge.naechstes();
      if (!gescheitert.has(kandidat)) return kandidat;
    }
    return null;
  }

  function lade(kanal: Kanal, stueck: number): void {
    kanal.stueck = stueck;
    kanal.el.src = ordner + encodeURIComponent(liste[stueck]!.datei);
    beiStueck(liste[stueck]!);
  }

  function verstummen(): void {
    for (const k of kanaele) k.el.pause();
    beiStueck(null);
  }

  /** Nächstes Stück auf dem anderen Element; `dauer` 0 wechselt sofort. */
  function wechseln(dauer: number): void {
    const stueck = naechstesStueck();
    if (stueck === null) { verstummen(); return; }
    const alt = kanaele[aktiv];
    aktiv = aktiv === 0 ? 1 : 0;
    const neu = kanaele[aktiv];
    ueberblendet = false;
    lade(neu, stueck);
    if (dauer > 0) {
      rampe(neu.verstaerker.gain, 0, 1, dauer);
      rampe(alt.verstaerker.gain, alt.verstaerker.gain.value, 0, dauer);
      setTimeout(() => { if (kanaele[aktiv] !== alt) alt.el.pause(); }, dauer * 1000);
    } else {
      sofort(neu.verstaerker.gain, 1);
      sofort(alt.verstaerker.gain, 0);
      alt.el.pause();
    }
    spiele(neu.el);
  }

  function beiZeit(kanal: Kanal): void {
    if (kanal !== kanaele[aktiv] || ueberblendet || !soll || liste.length === 1) return;
    const rest = kanal.el.duration - kanal.el.currentTime;
    if (Number.isFinite(rest) && rest <= UEBERBLENDUNG_S) {
      ueberblendet = true;
      wechseln(UEBERBLENDUNG_S);
    }
  }

  function beiFehler(kanal: Kanal): void {
    // Nicht erneut versucht in dieser Sitzung (Entwurf Phase 5 §6.3).
    if (kanal.stueck !== null) gescheitert.add(kanal.stueck);
    if (kanal !== kanaele[aktiv]) return;
    if (erschoepft()) { verstummen(); return; }
    if (soll) wechseln(0);
  }

  return {
    setze(spielen, neueLautstaerke) {
      if (beendet) return;
      if (neueLautstaerke !== lautstaerke) {
        lautstaerke = neueLautstaerke;
        sofort(haupt.gain, neueLautstaerke);
      }
      if (spielen === soll) return;
      soll = spielen;
      clearTimeout(pausenUhr);
      pausenUhr = undefined;
      if (spielen) {
        if (erschoepft()) return;
        const kanal = kanaele[aktiv];
        if (kanal.stueck === null || gescheitert.has(kanal.stueck)) {
          const stueck = naechstesStueck();
          if (stueck === null) { verstummen(); return; }
          sofort(kanal.verstaerker.gain, 1);
          lade(kanal, stueck);
        }
        spiele(kanal.el);
        rampe(blende.gain, blende.gain.value, 1, BLENDE_S);
      } else {
        rampe(blende.gain, blende.gain.value, 0, BLENDE_S);
        // Angehalten, nicht beendet: Das Stück läuft beim nächsten Einblenden weiter.
        pausenUhr = setTimeout(() => { for (const k of kanaele) k.el.pause(); }, BLENDE_S * 1000);
      }
    },
    entsperren() {
      if (beendet) return;
      if (kontext.state === 'suspended') void kontext.resume();
      const el = kanaele[aktiv].el;
      if (soll && el.paused && !erschoepft()) spiele(el);
    },
    stand() {
      return {
        spielt: soll,
        stueck: kanaele[aktiv].stueck,
        blende: blende.gain.value,
        kanaele: [kanaele[0].verstaerker.gain.value, kanaele[1].verstaerker.gain.value],
        lautstaerke: haupt.gain.value,
        pausiert: [kanaele[0].el.paused, kanaele[1].el.paused],
        zeit: [kanaele[0].el.currentTime, kanaele[1].el.currentTime],
      };
    },
    beenden() {
      beendet = true;
      clearTimeout(pausenUhr);
      for (const k of kanaele) k.el.pause();
    },
  };
}

export interface MusikOptionen {
  /** Basis der Anwendung, z. B. `/Orrery/` (import.meta.env.BASE_URL). */
  basis: string;
  laden?: (url: string) => Promise<{ ok: boolean; json(): Promise<unknown> }>;
  umgebung?: Tonumgebung;
  dokument?: Pick<Document, 'visibilityState' | 'addEventListener' | 'removeEventListener'>;
  fenster?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
}

const browserUmgebung: Tonumgebung = {
  kontext: () => new AudioContext() as unknown as Tonkontext,
  element: () => new Audio(),
};

/**
 * Lädt die Liste des Betreibers (Entwurf Phase 5 §6.1) und verbindet den
 * Spieler mit Store, Sichtbarkeit und Nutzergesten. Ohne gültige Liste: kein
 * Tonkontext, keine Bedienung, keine Meldung (Ergebnis null). Läuft einmal
 * außerhalb von React (app/main.tsx), damit StrictMode nichts verdoppelt.
 */
export async function musikStarten(optionen: MusikOptionen): Promise<{ spieler: MusikSpieler; beenden(): void } | null> {
  const ordner = `${optionen.basis}musik/`;
  const laden = optionen.laden ?? ((url: string) => fetch(url, { cache: 'no-cache' }));
  let liste: MusikEintrag[];
  try {
    const antwort = await laden(`${ordner}stuecke.json`);
    if (!antwort.ok) return null;
    liste = pruefeListe(await antwort.json());
  } catch {
    return null;
  }
  if (liste.length === 0) return null;

  const dokument = optionen.dokument ?? document;
  const fenster = optionen.fenster ?? window;
  const spieler = erzeugeSpieler(
    liste, ordner, optionen.umgebung ?? browserUmgebung,
    (eintrag) => { useMusikStand.setState({ aktuell: eintrag }); },
  );
  useMusikStand.setState({ verfuegbar: true });

  const abgleichen = (): void => {
    const s = useStore.getState();
    spieler.setze(sollSpielen(s.ton, s.cinema.running, dokument.visibilityState === 'visible'), s.ton.lautstaerke);
  };
  const entsperren = (): void => { spieler.entsperren(); };
  // Der Store ändert sich jedes Bild (Zeit); setze() ist dann ein Vergleich und sonst nichts.
  const abmelden = useStore.subscribe(abgleichen);
  dokument.addEventListener('visibilitychange', abgleichen);
  fenster.addEventListener('pointerdown', entsperren);
  fenster.addEventListener('keydown', entsperren);
  abgleichen();

  return {
    spieler,
    beenden() {
      abmelden();
      dokument.removeEventListener('visibilitychange', abgleichen);
      fenster.removeEventListener('pointerdown', entsperren);
      fenster.removeEventListener('keydown', entsperren);
      spieler.beenden();
      useMusikStand.setState({ verfuegbar: false, aktuell: null });
    },
  };
}
