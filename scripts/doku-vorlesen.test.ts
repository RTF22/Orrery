import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { SAETZE_JS, VORLESEN_CSS } from './doku-vorlesen.ts';
import { seite } from './doku-vorlage.ts';

const saetze = new Function(`${SAETZE_JS}\nreturn saetze;`)() as (text: string) => string[];

describe('saetze', () => {
  it('trennt an Punkt, Ausrufe- und Fragezeichen', () => {
    expect(saetze('Erster Satz. Zweiter Satz! Dritter? Ja.')).toEqual(['Erster Satz.', 'Zweiter Satz!', 'Dritter?', 'Ja.']);
  });
  it('nicht nach Abkürzungen aus einzelnen Buchstaben oder der Liste', () => {
    expect(saetze('Das gilt z. B. für Mars, d. h. für alle. Neu.')).toEqual(['Das gilt z. B. für Mars, d. h. für alle.', 'Neu.']);
    expect(saetze('Version 1.5 kam ca. Mitte Mai. Danach Nr. 7 und vgl. Kap. 2.')).toEqual([
      'Version 1.5 kam ca. Mitte Mai.', 'Danach Nr. 7 und vgl. Kap. 2.',
    ]);
    expect(saetze('It works, e.g. on Mars. The end.')).toEqual(['It works, e.g. on Mars.', 'The end.']);
  });
  it('nicht nach Ordnungszahlen bis zwei Stellen, wohl aber nach Datum und Jahr', () => {
    expect(saetze('Am 3. Oktober 2026 begann es. Dann ging es weiter.')).toEqual([
      'Am 3. Oktober 2026 begann es.', 'Dann ging es weiter.',
    ]);
    expect(saetze('Stand 02.10.2026. Danach mehr.')).toEqual(['Stand 02.10.2026.', 'Danach mehr.']);
    // bewusst: „5.“ gilt als Ordnungszahl, der Satz läuft weiter (nur etwas längere Äußerung)
    expect(saetze('Das war Phase 5. Danach kam 6.')).toEqual(['Das war Phase 5. Danach kam 6.']);
  });
  it('nicht, wenn klein weitergeschrieben wird', () => {
    expect(saetze('Er schrieb etwas. und dann mehr.')).toEqual(['Er schrieb etwas. und dann mehr.']);
  });
  it('schließende Anführungszeichen und Auslassungspunkte bleiben am Satz', () => {
    expect(saetze('Er sagte „Fertig.“ Dann ging er.')).toEqual(['Er sagte „Fertig.“', 'Dann ging er.']);
    expect(saetze('She said "Done." Then she left.')).toEqual(['She said "Done."', 'Then she left.']);
    expect(saetze('Und dann... Weiter.')).toEqual(['Und dann...', 'Weiter.']);
  });
  it('fasst Leerraum zusammen; leer ergibt nichts, ohne Satzzeichen einen Satz', () => {
    expect(saetze('  Eins.\n   Zwei.  ')).toEqual(['Eins.', 'Zwei.']);
    expect(saetze('')).toEqual([]);
    expect(saetze('   ')).toEqual([]);
    expect(saetze('Ohne Satzzeichen')).toEqual(['Ohne Satzzeichen']);
  });
});

interface Stimme { name: string; lang: string; localService: boolean; default: boolean }
const DE_LOKAL: Stimme = { name: 'Hedda', lang: 'de-DE', localService: true, default: false };
const DE_ONLINE: Stimme = { name: 'Google Deutsch', lang: 'de-DE', localService: false, default: false };
const EN_LOKAL: Stimme = { name: 'Zira', lang: 'en-US', localService: true, default: false };

/** Ersatz für SpeechSynthesisUtterance: merkt sich Text, Stimme und Tempo. */
class Aeusserung {
  text: string;
  voice: Stimme | null = null;
  lang = '';
  rate = 1;
  onend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

const SEITE_DE = seite({
  sprache: 'de', dokument: 'entstehung', titel: 'Titel', beschreibung: 'Kurz',
  html:
    '<h2 id="a">Abschnitt A</h2><p>Satz eins. Satz zwei.</p>' +
    '<table><tr><td>Zelle.</td></tr></table><pre><code>code();</code></pre>' +
    '<p><img src="x.png" alt="Bild"></p>' +
    '<ul><li>Punkt eins<ul><li>Unterpunkt</li></ul></li></ul>' +
    '<h2 id="b">Abschnitt B</h2><p>Letzter Satz.</p>',
  toc: [{ ebene: 2, text: 'Abschnitt A', id: 'a' }, { ebene: 2, text: 'Abschnitt B', id: 'b' }],
});

/** Lädt die Seite mit Ersatz-Sprachausgabe; `stimmen === null` heißt: Browser ohne speechSynthesis. */
function laden(stimmen: Stimme[] | null) {
  const gesprochen: Aeusserung[] = [];
  const hoerer: Array<() => void> = [];
  let abbrueche = 0;
  const synth = {
    getVoices: () => stimmen ?? [],
    speak: (u: Aeusserung) => {
      gesprochen.push(u);
    },
    cancel: () => {
      abbrueche += 1;
    },
    addEventListener: (typ: string, fn: () => void) => {
      if (typ === 'voiceschanged') hoerer.push(fn);
    },
  };
  const fenster = new JSDOM(SEITE_DE, {
    runScripts: 'dangerously',
    url: 'https://orrery3d.de/doku/making-of/de/',
    beforeParse(w) {
      if (stimmen !== null) Object.assign(w, { speechSynthesis: synth, SpeechSynthesisUtterance: Aeusserung });
    },
  }).window;
  const el = (s: string) => fenster.document.querySelector(s) as HTMLElement;
  const letzte = () => gesprochen[gesprochen.length - 1];
  return { fenster, el, gesprochen, hoerer, letzte, abbrueche: () => abbrueche };
}
/** Das Skript setzt nach einem Abbruch per setTimeout(…, 0) neu an. */
const warten = () => new Promise((fertig) => setTimeout(fertig, 5));

describe('Vorlesen: Verfügbarkeit', () => {
  it('ohne Skript verborgen: Knopf und Leiste tragen im HTML hidden', () => {
    expect(SEITE_DE).toMatch(/<button[^>]*id="vorlesen-knopf"[^>]*\bhidden\b/);
    expect(SEITE_DE).toMatch(/<div[^>]*id="vorlesen-leiste"[^>]*role="region"[^>]*aria-label="Vorlesen"[^>]*\bhidden\b/);
  });
  it('Knopf steht in der Kopfzeile zwischen Farbschalter und Sprachwahl', () => {
    const kopf = SEITE_DE.slice(SEITE_DE.indexOf('<header'), SEITE_DE.indexOf('</header>'));
    const lage = ['id="farbschema-knopf"', 'id="vorlesen-knopf"', 'class="sprachwahl"'].map((s) => kopf.indexOf(s));
    expect(lage[0]).toBeGreaterThan(0);
    expect(lage).toEqual([...lage].sort((a, b) => a - b));
  });
  it('ohne speechSynthesis bleibt der Knopf verborgen', () => {
    expect(laden(null).el('#vorlesen-knopf').hidden).toBe(true);
  });
  it('nur Online-Stimmen oder fremde Sprache: verborgen', () => {
    expect(laden([DE_ONLINE, EN_LOKAL]).el('#vorlesen-knopf').hidden).toBe(true);
  });
  it('lokale Stimme der Seitensprache: sichtbar, auch wenn sie erst später gemeldet wird', () => {
    const stimmen: Stimme[] = [];
    const s = laden(stimmen);
    expect(s.el('#vorlesen-knopf').hidden).toBe(true);
    stimmen.push(DE_LOKAL);
    s.hoerer.forEach((fn) => fn());
    expect(s.el('#vorlesen-knopf').hidden).toBe(false);
  });
  it('die Standardstimme hat Vorrang', async () => {
    const standard: Stimme = { ...DE_LOKAL, name: 'Katja', default: true };
    const s = laden([DE_LOKAL, standard]);
    s.el('#vorlesen-knopf').click();
    await warten();
    expect(s.letzte().voice).toBe(standard);
  });
});

describe('Vorlesen: Ablauf', () => {
  it('beginnt beim Titel, markiert ihn und zeigt die Leiste', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    expect(s.letzte().text).toBe('Titel');
    expect(s.letzte().rate).toBe(1);
    expect(s.el('h1').classList.contains('vorlesen-aktiv')).toBe(true);
    expect(s.el('#vorlesen-leiste').hidden).toBe(false);
    expect(s.el('#vorlesen-knopf').getAttribute('aria-pressed')).toBe('true');
    expect(s.fenster.document.body.classList.contains('vorlesen-laeuft')).toBe(true);
  });
  it('liest Satz für Satz; Tabelle, Code, Bild und doppelte Listenpunkte entfallen; am Ende ist Schluss', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    for (let i = 0; i < 20 && !s.el('#vorlesen-leiste').hidden; i += 1) s.letzte().onend!();
    expect(s.gesprochen.map((u) => u.text)).toEqual([
      'Titel', 'Abschnitt A', 'Satz eins.', 'Satz zwei.', 'Punkt eins', 'Unterpunkt', 'Abschnitt B', 'Letzter Satz.',
    ]);
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(s.fenster.document.querySelector('.vorlesen-aktiv')).toBeNull();
  });
  it('beginnt beim Abschnitt, den das Inhaltsverzeichnis gerade markiert', async () => {
    const s = laden([DE_LOKAL]);
    s.el('.toc a[href="#b"]').setAttribute('aria-current', 'location');
    s.el('#vorlesen-knopf').click();
    await warten();
    expect(s.letzte().text).toBe('Abschnitt B');
  });
  it('Stopp beendet alles; ein spätes onend spricht nicht weiter', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const alt = s.letzte();
    s.el('[data-aktion="stopp"]').click();
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(s.el('#vorlesen-knopf').getAttribute('aria-pressed')).toBe('false');
    expect(s.fenster.document.querySelector('.vorlesen-aktiv')).toBeNull();
    expect(s.abbrueche()).toBeGreaterThan(0);
    const anzahl = s.gesprochen.length;
    alt.onend!();
    await warten();
    expect(s.gesprochen.length).toBe(anzahl);
  });
  it('Fokus: Start setzt ihn in die Leiste, Stopp gibt ihn an den Kopfknopf zurück', async () => {
    const s = laden([DE_LOKAL]);
    const d = s.fenster.document;
    s.el('#vorlesen-knopf').click();
    await warten();
    expect(d.activeElement).toBe(s.el('[data-aktion="pause"]'));
    s.el('[data-aktion="stopp"]').click();
    expect(d.activeElement).toBe(s.el('#vorlesen-knopf'));
  });
  it('Fokus: Beenden per Kopfknopf lässt den Fokus dort; Escape ohne Fokus in der Leiste fasst ihn nicht an', async () => {
    const s = laden([DE_LOKAL]);
    const d = s.fenster.document;
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('#vorlesen-knopf').focus();
    s.el('#vorlesen-knopf').click();
    expect(d.activeElement).toBe(s.el('#vorlesen-knopf'));
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('h1').setAttribute('tabindex', '-1');
    s.el('h1').focus();
    s.fenster.dispatchEvent(new s.fenster.KeyboardEvent('keydown', { key: 'Escape' }));
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(d.activeElement).toBe(s.el('h1'));
  });
  it('der Kopfknopf beendet ein laufendes Vorlesen', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('#vorlesen-knopf').click();
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
  });
  it('Pause hält an, Weiter setzt mit demselben Satz fort', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const pause = s.el('[data-aktion="pause"]');
    pause.click();
    expect(pause.getAttribute('aria-label')).toBe('Weiter');
    const anzahl = s.gesprochen.length;
    s.letzte().onend!();
    await warten();
    expect(s.gesprochen.length).toBe(anzahl);
    pause.click();
    await warten();
    expect(pause.getAttribute('aria-label')).toBe('Pause');
    expect(s.letzte().text).toBe('Titel');
  });
  it('Tempo reihum 1,25 → 0,8 → 1, wirkt sofort', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const tempo = s.el('[data-aktion="tempo"]');
    expect(tempo.textContent).toBe('1×');
    tempo.click();
    await warten();
    expect([s.letzte().rate, tempo.textContent, tempo.getAttribute('aria-label')]).toEqual([1.25, '1,25×', 'Tempo 1,25×']);
    tempo.click();
    await warten();
    expect(s.letzte().rate).toBe(0.8);
    tempo.click();
    await warten();
    expect(s.letzte().rate).toBe(1);
  });
  it('Absatz vor und zurück', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('[data-aktion="vor"]').click();
    await warten();
    expect(s.letzte().text).toBe('Abschnitt A');
    expect(s.el('#a').classList.contains('vorlesen-aktiv')).toBe(true);
    s.el('[data-aktion="zurueck"]').click();
    await warten();
    expect(s.letzte().text).toBe('Titel');
  });
  it('Klick ins Inhaltsverzeichnis setzt beim Ziel an', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('.toc a[href="#b"]').click();
    await warten();
    expect(s.letzte().text).toBe('Abschnitt B');
  });
  it('Escape stoppt; bei offener Navigationsschublade schließt es nur die Schublade', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const escape = () =>
      s.fenster.document.dispatchEvent(new s.fenster.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    s.el('#inhalt-nav').setAttribute('data-offen', 'true');
    escape();
    expect(s.el('#inhalt-nav').getAttribute('data-offen')).toBe('false');
    expect(s.el('#vorlesen-leiste').hidden).toBe(false);
    escape();
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
  });
  it('pagehide bricht ab und räumt auf', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.fenster.dispatchEvent(new s.fenster.Event('pagehide'));
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(s.fenster.document.querySelector('.vorlesen-aktiv')).toBeNull();
  });
  it('Fehler der Sprachausgabe beendet, Abbruchmeldungen nicht', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.letzte().onerror!({ error: 'interrupted' });
    expect(s.el('#vorlesen-leiste').hidden).toBe(false);
    s.letzte().onerror!({ error: 'synthesis-failed' });
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
  });
  it('Zurück am ersten Block spricht wieder den Titel', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    const anzahl = s.gesprochen.length;
    s.el('[data-aktion="zurueck"]').click();
    await warten();
    expect(s.gesprochen.length).toBe(anzahl + 1);
    expect(s.letzte().text).toBe('Titel');
  });
  it('Vor am letzten Block beendet und blendet die Leiste aus', async () => {
    const s = laden([DE_LOKAL]);
    s.el('.toc a[href="#b"]').setAttribute('aria-current', 'location');
    s.el('#vorlesen-knopf').click();
    await warten();
    expect(s.letzte().text).toBe('Abschnitt B');
    s.el('[data-aktion="vor"]').click();
    await warten();
    expect(s.letzte().text).toBe('Letzter Satz.');
    s.el('[data-aktion="vor"]').click();
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(s.el('#vorlesen-knopf').getAttribute('aria-pressed')).toBe('false');
  });
  it('Tempo in der Pause spricht nicht; Weiter spricht mit dem neuen Tempo', async () => {
    const s = laden([DE_LOKAL]);
    s.el('#vorlesen-knopf').click();
    await warten();
    s.el('[data-aktion="pause"]').click();
    const anzahl = s.gesprochen.length;
    s.el('[data-aktion="tempo"]').click();
    await warten();
    expect(s.gesprochen.length).toBe(anzahl);
    s.el('[data-aktion="pause"]').click();
    await warten();
    expect(s.gesprochen.length).toBe(anzahl + 1);
    expect(s.letzte().rate).toBe(1.25);
  });
  it('Stimmverlust beim Vorlesen beendet und verbirgt den Knopf', async () => {
    const stimmen: Stimme[] = [DE_LOKAL];
    const s = laden(stimmen);
    s.el('#vorlesen-knopf').click();
    await warten();
    stimmen.length = 0;
    s.hoerer.forEach((fn) => fn());
    expect(s.el('#vorlesen-leiste').hidden).toBe(true);
    expect(s.el('#vorlesen-knopf').hidden).toBe(true);
  });
  it('englische Seite: englische Beschriftung', () => {
    const en = seite({ sprache: 'en', dokument: 'chronik', titel: 'T', beschreibung: 'B', html: '<p>x</p>', toc: [] });
    expect(en).toMatch(/id="vorlesen-knopf"[^>]*>Read aloud</);
    expect(en).toContain('aria-label="Stop reading"');
  });
});

describe('VORLESEN_CSS: Markierung ohne color-mix', () => {
  it('Ersatz für Browser ohne color-mix und für erzwungene Farben', () => {
    expect(VORLESEN_CSS).toMatch(
      /@supports not \(background: color-mix\(in srgb, red 50%, blue\)\) \{\s*\.vorlesen-aktiv \{[^}]*outline: 2px solid var\(--akzent\);[^}]*outline-offset: 0\.2rem;/,
    );
    expect(VORLESEN_CSS).toMatch(/@media \(forced-colors: active\) \{\s*\.vorlesen-aktiv \{[^}]*outline: 2px solid Highlight;/);
  });
});
