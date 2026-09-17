import { describe, it, expect, vi } from 'vitest';
import { parseMarkdown } from './markdownParser';
import { sortiereArbeiten, zitierteArbeiten, zitierteKennungen } from './zitate';

const { ARBEITEN } = vi.hoisted(() => {
  const arbeit = (id: string, autor: string, jahr: number) => ({
    id, autoren: [autor], etAl: false, jahr, titel: `Titel ${id}`, erschienen: 'Test 1, 1', doi: `10.0000/${id}`,
  });
  return {
    ARBEITEN: [
      arbeit('zeta-2019', 'Zeta, Z.', 2019),
      arbeit('mueller-2020b', 'Müller, M.', 2020),
      arbeit('mueller-2020a', 'Müller, M.', 2020),
      arbeit('mueller-2018', 'Müller, M.', 2018),
      arbeit('de-pater-2014', 'de Pater, I.', 2014),
    ],
  };
});

vi.mock('../../data/literatur', async (importOriginal) => {
  const echt = await importOriginal<typeof import('../../data/literatur')>();
  return { ...echt, LITERATUR: ARBEITEN, publikationFinden: (id: string) => ARBEITEN.find((a) => a.id === id) };
});

const MD = [
  '## Abschnitt [Zeta 2019](literatur:zeta-2019)',
  '',
  'Text [Müller 2020b](literatur:mueller-2020b) und **[de Pater et al. 2014](literatur:de-pater-2014)**, [Erde](objekt:earth).',
  '',
  '- [Müller 2020a](literatur:mueller-2020a) und [unbekannt](literatur:nope-1999)',
  '',
  '| Wert | Quelle |',
  '|---|---|',
  '| 1 | [Zeta 2019](literatur:zeta-2019) |',
].join('\n');

describe('zitate', () => {
  it('sammelt Zitate aus Überschriften, Absätzen, Hervorhebungen, Listen und Tabellen, ohne Doppelte', () => {
    expect(zitierteKennungen(parseMarkdown(MD))).toEqual([
      'zeta-2019', 'mueller-2020b', 'de-pater-2014', 'mueller-2020a', 'nope-1999',
    ]);
  });

  it('sortiert nach Erstautor ohne Rücksicht auf Groß- und Kleinschreibung, dann Jahr, dann Suffix', () => {
    expect(sortiereArbeiten(ARBEITEN).map((a) => a.id)).toEqual([
      'de-pater-2014', 'mueller-2018', 'mueller-2020a', 'mueller-2020b', 'zeta-2019',
    ]);
  });

  it('liefert die zitierten Katalogeinträge sortiert und übergeht Unbekanntes', () => {
    expect(zitierteArbeiten(parseMarkdown(MD)).map((a) => a.id)).toEqual([
      'de-pater-2014', 'mueller-2020a', 'mueller-2020b', 'zeta-2019',
    ]);
  });
});
