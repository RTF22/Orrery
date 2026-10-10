/**
 * Vorlesen der Doku-Seiten (Entwurf 2026-10-10 §4) mit den lokalen Stimmen des Browsers
 * (Web Speech API). Reine Bausteine als Zeichenketten; doku-vorlage.ts setzt sie ein.
 */

import type { Sprache } from './doku-bauen.ts';

/**
 * Satzzerlegung als Browser-Quelltext (ES5). Die Sprachausgabe bekommt Satz für Satz,
 * weil Chrome lange Äußerungen nach rund 15 s abbricht. Getrennt wird an `.`, `!`, `?`
 * (samt schließender Anführungszeichen/Klammern) vor einem Leerzeichen, wenn danach ein
 * Großbuchstabe, eine Ziffer oder ein öffnendes Zeichen folgt — nicht nach einzelnen
 * Buchstaben (z. B., d. h., e.g.), Abkürzungen der Liste und ein- bis zweistelligen
 * Zahlen (Ordnungszahlen wie „3. Oktober“). `String.raw`, damit die Backslashes der
 * regulären Ausdrücke unverändert im Browser ankommen.
 */
export const SAETZE_JS = String.raw`function saetze(text) {
  var ABKUERZUNGEN = ['bzw', 'ca', 'vgl', 'Nr', 'Dr', 'Prof', 'St', 'etc', 'usw', 'ggf', 'evtl', 'inkl', 'bspw',
    'sog', 'Abb', 'Kap', 'Jh', 'Mio', 'Mrd', 'Mr', 'Mrs', 'Ms', 'vs', 'approx', 'cf', 'Fig', 'No', 'al'];
  var t = String(text).replace(/\s+/g, ' ').trim();
  var ergebnis = [];
  var anfang = 0;
  var muster = /[.!?]+["'”“»«)\]]*(?= )/g;
  var treffer;
  while ((treffer = muster.exec(t)) !== null) {
    var ende = treffer.index + treffer[0].length;
    if (!/[A-ZÄÖÜ0-9"'„“‚«»(\[]/.test(t.charAt(ende + 1))) continue;
    if (treffer[0].charAt(0) === '.') {
      var wort = t.slice(anfang, treffer.index).split(' ').pop();
      if (/^[A-Za-zÄÖÜäöü]$/.test(wort) || /^\d{1,2}$/.test(wort) || /^[a-z]\.[a-z]$/i.test(wort) ||
        ABKUERZUNGEN.indexOf(wort) >= 0) continue;
    }
    ergebnis.push(t.slice(anfang, ende).trim());
    anfang = ende + 1;
  }
  var rest = t.slice(anfang).trim();
  if (rest) ergebnis.push(rest);
  return ergebnis;
}`;

const WOERTER: Record<Sprache, {
  knopf: string; knopfTitel: string; leiste: string; pause: string; weiter: string;
  zurueck: string; vor: string; stopp: string; tempo: string;
}> = {
  de: {
    knopf: 'Vorlesen', knopfTitel: 'Seite ab dem aktuellen Abschnitt vorlesen', leiste: 'Vorlesen',
    pause: 'Pause', weiter: 'Weiter', zurueck: 'Absatz zurück', vor: 'Absatz vor', stopp: 'Vorlesen beenden',
    tempo: 'Tempo',
  },
  en: {
    knopf: 'Read aloud', knopfTitel: 'Read this page aloud from the current section', leiste: 'Read aloud',
    pause: 'Pause', weiter: 'Resume', zurueck: 'Previous paragraph', vor: 'Next paragraph', stopp: 'Stop reading',
    tempo: 'Speed',
  },
};

/** Kopfknopf; bleibt verborgen, bis das Skript eine lokale Stimme der Seitensprache findet. */
export function vorlesenKnopf(sprache: Sprache): string {
  const w = WOERTER[sprache];
  return (
    `<button type="button" class="kopf-knopf vorlesen-knopf" id="vorlesen-knopf" hidden aria-pressed="false" ` +
    `title="${w.knopfTitel}">${w.knopf}</button>`
  );
}

/** Bedienleiste unten; Zeichen mit Textdarstellung (U+FE0E), Namen über aria-label. */
export function vorlesenLeiste(sprache: Sprache): string {
  const w = WOERTER[sprache];
  const knopf = (aktion: string, zeichen: string, text: string, extra = ''): string =>
    `<button type="button" data-aktion="${aktion}" aria-label="${text}" title="${text}"${extra}>${zeichen}</button>`;
  return `<div class="vorlesen-leiste" id="vorlesen-leiste" role="region" aria-label="${w.leiste}" hidden>
${knopf('zurueck', '&#x23EE;&#xFE0E;', w.zurueck)}
${knopf('pause', '&#x23F8;&#xFE0E;', w.pause, ` data-pause="${w.pause}" data-weiter="${w.weiter}"`)}
${knopf('vor', '&#x23ED;&#xFE0E;', w.vor)}
${knopf('tempo', '1&#xD7;', `${w.tempo} 1×`, ` data-text="${w.tempo}"`)}
${knopf('stopp', '&#x23F9;&#xFE0E;', w.stopp)}
</div>`;
}

/**
 * Vorleseskript (ES5). Nur Stimmen mit `localService` und passender Sprache, sonst bleibt
 * der Knopf verborgen (kein Text an fremde Server). `lauf` zählt jeden Neuansatz; Ereignisse
 * älterer Äußerungen (nach cancel()) laufen ins Leere. Nach cancel() wird per setTimeout neu
 * angesetzt, weil manche Browser ein sofortiges speak() nach cancel() verschlucken.
 */
export const VORLESEN_SKRIPT = String.raw`<script>
(function () {
  var knopf = document.getElementById('vorlesen-knopf');
  var leiste = document.getElementById('vorlesen-leiste');
  var main = document.querySelector('main');
  if (!knopf || !leiste || !main || !window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') return;
  var synth = window.speechSynthesis;
  var sprache = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  var TEMPI = [0.8, 1, 1.25];
  var BLOECKE = 'h1, h2, h3, h4, p, li, blockquote';
  var KOPF_HOEHE = 60;
  var pauseKnopf = leiste.querySelector('[data-aktion="pause"]');
  var tempoKnopf = leiste.querySelector('[data-aktion="tempo"]');

  var stimme = null;
  var liste = [];
  var index = 0;
  var saetzeJetzt = [];
  var satz = 0;
  var laeuft = false;
  var pausiert = false;
  var tempo = 1;
  var lauf = 0;
  // Chrome verliert onend, wenn die Äußerung vorher vom Speicherbereiniger eingesammelt wird.
  var aeusserung = null;

  ${SAETZE_JS}

  function stimmeWaehlen() {
    var passend = synth.getVoices().filter(function (v) {
      return v.localService === true && String(v.lang).toLowerCase().indexOf(sprache) === 0;
    });
    stimme = passend.filter(function (v) { return v.default; })[0] || passend[0] || null;
    knopf.hidden = !stimme;
    if (!stimme && laeuft) beenden();
  }

  /** Text eines Blocks ohne verschachtelte Listen, Tabellen und Code (die liest ihr eigener Block bzw. niemand). */
  function text(el) {
    var kopie = el.cloneNode(true);
    Array.prototype.forEach.call(kopie.querySelectorAll('ul, ol, table, pre'), function (k) {
      k.parentNode.removeChild(k);
    });
    return kopie.textContent.replace(/\s+/g, ' ').trim();
  }

  function bloecke() {
    return Array.prototype.filter.call(main.querySelectorAll(BLOECKE), function (el) {
      if (el.closest('table, pre, nav')) return false;
      if (el.tagName === 'BLOCKQUOTE' && el.querySelector('p, li')) return false;
      if (el.tagName === 'P' && el.closest('li')) return false;
      return text(el) !== '';
    });
  }

  function startIndex() {
    var aktiv = document.querySelector('.toc a[aria-current="location"]');
    var ziel = aktiv ? document.getElementById(aktiv.getAttribute('href').slice(1)) : null;
    var i = ziel ? liste.indexOf(ziel) : -1;
    return i >= 0 ? i : 0;
  }

  function markieren(el) {
    var alt = main.querySelector('.vorlesen-aktiv');
    if (alt) alt.classList.remove('vorlesen-aktiv');
    if (!el) return;
    el.classList.add('vorlesen-aktiv');
    var r = el.getBoundingClientRect();
    if ((r.top < KOPF_HOEHE || r.bottom > window.innerHeight - 80) && el.scrollIntoView) {
      var ruhig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'center', behavior: ruhig ? 'auto' : 'smooth' });
    }
  }

  function zeigen() {
    var t = pauseKnopf.getAttribute(pausiert ? 'data-weiter' : 'data-pause');
    pauseKnopf.innerHTML = pausiert ? '&#x25B6;&#xFE0E;' : '&#x23F8;&#xFE0E;';
    pauseKnopf.setAttribute('aria-label', t);
    pauseKnopf.setAttribute('title', t);
    var wert = String(tempo).replace('.', sprache === 'de' ? ',' : '.') + '×';
    tempoKnopf.textContent = wert;
    tempoKnopf.setAttribute('aria-label', tempoKnopf.getAttribute('data-text') + ' ' + wert);
    tempoKnopf.setAttribute('title', tempoKnopf.getAttribute('data-text') + ' ' + wert);
  }

  function blockLaden() {
    while (index < liste.length) {
      saetzeJetzt = saetze(text(liste[index]));
      if (saetzeJetzt.length) {
        markieren(liste[index]);
        return true;
      }
      index += 1;
    }
    return false;
  }

  function sprechen() {
    if (!laeuft || pausiert) return;
    if (!stimme) { beenden(); return; }
    if (satz >= saetzeJetzt.length) {
      index += 1;
      satz = 0;
      if (!blockLaden()) { beenden(); return; }
    }
    var meinLauf = lauf;
    var u = new SpeechSynthesisUtterance(saetzeJetzt[satz]);
    u.voice = stimme;
    u.lang = stimme.lang;
    u.rate = tempo;
    u.onend = function () {
      if (meinLauf !== lauf) return;
      satz += 1;
      sprechen();
    };
    u.onerror = function (e) {
      if (meinLauf !== lauf) return;
      if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
      beenden();
    };
    aeusserung = u;
    synth.speak(u);
  }

  function neuAnsetzen() {
    lauf += 1;
    synth.cancel();
    var l = lauf;
    setTimeout(function () { if (l === lauf) sprechen(); }, 0);
  }

  function springen(neu) {
    index = Math.max(0, Math.min(neu, liste.length - 1));
    satz = 0;
    pausiert = false;
    zeigen();
    if (!blockLaden()) { beenden(); return; }
    neuAnsetzen();
  }

  function starten() {
    liste = bloecke();
    if (!liste.length || !stimme) return;
    laeuft = true;
    knopf.setAttribute('aria-pressed', 'true');
    leiste.hidden = false;
    document.body.classList.add('vorlesen-laeuft');
    springen(startIndex());
    if (laeuft) pauseKnopf.focus();
  }

  function beenden() {
    lauf += 1;
    laeuft = false;
    pausiert = false;
    synth.cancel();
    markieren(null);
    // Lag der Fokus in der Leiste, geht er an den Kopfknopf zurück (die Leiste verschwindet).
    var fokusInLeiste = leiste.contains(document.activeElement);
    knopf.setAttribute('aria-pressed', 'false');
    leiste.hidden = true;
    if (fokusInLeiste) knopf.focus();
    document.body.classList.remove('vorlesen-laeuft');
    zeigen();
  }

  knopf.addEventListener('click', function () {
    if (laeuft) beenden();
    else starten();
  });

  leiste.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button[data-aktion]') : null;
    if (!b || !laeuft) return;
    var aktion = b.getAttribute('data-aktion');
    if (aktion === 'pause') {
      if (pausiert) {
        pausiert = false;
        zeigen();
        neuAnsetzen();
      } else {
        pausiert = true;
        lauf += 1;
        synth.cancel();
        zeigen();
      }
    } else if (aktion === 'zurueck') {
      springen(index - 1);
    } else if (aktion === 'vor') {
      if (index + 1 < liste.length) springen(index + 1);
      else beenden();
    } else if (aktion === 'tempo') {
      tempo = TEMPI[(TEMPI.indexOf(tempo) + 1) % TEMPI.length];
      zeigen();
      if (!pausiert) neuAnsetzen();
    } else if (aktion === 'stopp') {
      beenden();
    }
  });

  document.addEventListener('click', function (ev) {
    if (!laeuft) return;
    var a = ev.target && ev.target.closest ? ev.target.closest('.toc a[href^="#"]') : null;
    if (!a) return;
    var i = liste.indexOf(document.getElementById(a.getAttribute('href').slice(1)));
    if (i >= 0) springen(i);
  });

  // Erfassungsphase: läuft vor dem Escape-Hörer der Navigation, der die Schublade schließt.
  window.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' || !laeuft) return;
    if (document.querySelector('.nav[data-offen="true"]')) return;
    beenden();
  }, true);

  window.addEventListener('pagehide', function () {
    if (laeuft) beenden();
  });

  stimmeWaehlen();
  if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', stimmeWaehlen);
  else synth.onvoiceschanged = stimmeWaehlen;
})();
</script>`;

/** Markierung, Leiste und Platz für den Seitenfuß; Markierungsfarbe wie im Kontrasttest (12 %). */
export const VORLESEN_CSS = `.vorlesen-aktiv {
  background: color-mix(in srgb, var(--akzent) 12%, var(--bg));
  box-shadow: 0 0 0 0.3rem color-mix(in srgb, var(--akzent) 12%, var(--bg));
  border-radius: 0.2rem;
}
.vorlesen-leiste {
  position: fixed;
  z-index: 30;
  left: 50%;
  bottom: 0.75rem;
  transform: translateX(-50%);
  display: flex;
  gap: 0.4rem;
  padding: 0.4rem;
  background: var(--bg);
  border: 1px solid var(--rand);
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.3);
}
.vorlesen-leiste[hidden] { display: none; }
.vorlesen-leiste button {
  min-width: 44px;
  min-height: 44px;
  padding: 0 0.5rem;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--rand);
  border-radius: 0.5rem;
  font: inherit;
  cursor: pointer;
}
@supports not (background: color-mix(in srgb, red 50%, blue)) {
  .vorlesen-aktiv { outline: 2px solid var(--akzent); outline-offset: 0.2rem; }
}
@media (forced-colors: active) {
  .vorlesen-aktiv { outline: 2px solid Highlight; }
}
body.vorlesen-laeuft .fuss { padding-bottom: 6rem; }
`;
