import { describe, expect, it } from 'vitest';
import { SAETZE_JS } from './doku-vorlesen.ts';

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
