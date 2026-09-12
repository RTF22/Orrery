import { describe, it, expect } from 'vitest';
import { formatJd, formatRate, isOutOfRange } from './format';
import { dateToJd } from '../sim/time';

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
