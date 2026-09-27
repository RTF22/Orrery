/**
 * Impressum und Datenschutzerklärung liegen zentral auf jensfricke.com (Projekt
 * „Homepage“, eigenes Repository). Diese Adressen verlinken die Info-Karte, die
 * Fußzeile der Doku-Seiten und der Hinweis ohne JavaScript in index.html; ein
 * Test hält index.html gleich. Importfrei, damit die Build-Skripte unter Node
 * die Datei direkt laden können.
 */
export const RECHTSSEITEN = {
  de: {
    impressum: 'https://jensfricke.com/impressum/',
    datenschutz: 'https://jensfricke.com/datenschutz/orrery/',
  },
  en: {
    impressum: 'https://jensfricke.com/en/legal-notice/',
    datenschutz: 'https://jensfricke.com/en/privacy/orrery/',
  },
} as const;
