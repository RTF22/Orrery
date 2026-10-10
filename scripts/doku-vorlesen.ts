/**
 * Vorlesen der Doku-Seiten (Entwurf 2026-10-10 §4) mit den lokalen Stimmen des Browsers
 * (Web Speech API). Reine Bausteine als Zeichenketten; doku-vorlage.ts setzt sie ein.
 */

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
