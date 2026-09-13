import { describe, it, expect, afterEach } from 'vitest';
import { formatJd, formatRate, formatZahl, isOutOfRange } from './format';
import { dateToJd, J2000 } from '../sim/time';
import { setSprache } from './i18n';

describe('formatJd', () => {
  it('gibt deutsches Datumsformat aus', () => {
    const jd = dateToJd(new Date(Date.UTC(2026, 8, 11, 14, 32)));
    expect(formatJd(jd)).toMatch(/^11\.09\.2026/);
  });
});

describe('formatRate', () => {
  it('nennt Sekunden, Tage und Jahre je nach Größenordnung', () => {
    expect(formatRate(1 / 86400)).toContain('Sekunde');
    expect(formatRate(1)).toContain('Tag');
    expect(formatRate(365.25)).toContain('Jahr');
  });

  it('kennzeichnet Rueckwaertslauf', () => {
    expect(formatRate(-30)).toContain('−');
  });

  it('erkennt Stillstand', () => {
    expect(formatRate(0)).toContain('Pause');
  });

  it('verwendet das deutsche Dezimalkomma', () => {
    expect(formatRate(2.5 * 365.25)).toContain(',');
  });
});

describe('Formatierung je Sprache', () => {
  afterEach(() => { setSprache('de'); });

  it('formatiert Zahlen mit der Locale der Sprache', () => {
    expect(formatZahl(1234.5)).toBe('1.234,5');
    setSprache('en');
    expect(formatZahl(1234.5)).toBe('1,234.5');
    expect(formatZahl(0.123456, 3)).toBe('0.123');
  });

  it('formatiert das Datum mit Tag vor Monat in beiden Sprachen', () => {
    // J2000 = 1. Januar 2000, 12:00 UTC
    expect(formatJd(J2000)).toMatch(/^01\.01\.2000, 12:00$/);
    setSprache('en');
    expect(formatJd(J2000)).toMatch(/^01\/01\/2000, 12:00$/);
  });

  it('übersetzt die Zeitraffer-Einheit', () => {
    setSprache('en');
    expect(formatRate(2.5)).toBe('2.5 days/s');
    expect(formatRate(1)).toBe('1 day/s');
  });
});

describe('isOutOfRange', () => {
  it('akzeptiert das Fenster 1800 bis 2050', () => {
    expect(isOutOfRange(dateToJd(new Date(Date.UTC(1900, 0, 1))))).toBe(false);
    expect(isOutOfRange(dateToJd(new Date(Date.UTC(2026, 0, 1))))).toBe(false);
  });

  it('warnt außerhalb', () => {
    expect(isOutOfRange(dateToJd(new Date(Date.UTC(1700, 0, 1))))).toBe(true);
    expect(isOutOfRange(dateToJd(new Date(Date.UTC(2200, 0, 1))))).toBe(true);
  });
});
