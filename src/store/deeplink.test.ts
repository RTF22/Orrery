import { describe, it, expect } from 'vitest';
import { fragmentAuswerten, lesbarerLink } from './deeplink';
import { encodePatch, fromShareable } from './serialize';
import { DEFAULT_STATE } from './index';
import { JD_MIN, JD_MAX, jdToDate } from '../sim/time';
import { fokusAbstand } from '../sim/scale';
import { bodyIndex } from '../data';

const ORT = { origin: 'https://beispiel.test', pathname: '/Orrery/' };

/** Fragmentteil eines Links: alles nach dem „#". */
function fragmentTeil(link: string): string {
  return link.slice(link.indexOf('#'));
}

/** JJJJ-MM-TTTHH:MMZ für einen Zeitpunkt, der auf dieselbe Minute wie `jd` fällt. */
function datumAufDerselbenMinute(jd: number): string {
  const d = jdToDate(jd);
  const zwei = (n: number): string => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${zwei(d.getUTCMonth() + 1)}-${zwei(d.getUTCDate())}`
    + `T${zwei(d.getUTCHours())}:${zwei(d.getUTCMinutes())}Z`;
}

/** Erwarteter Fokusabstand: dieselbe Funktion wie in koerperPatch (sim/scale.ts). */
function erwarteterAbstand(id: string): number {
  const koerper = bodyIndex[id];
  if (koerper === undefined) throw new Error(`Unbekannter Körper in der Prüfung: ${id}`);
  return fokusAbstand(koerper, DEFAULT_STATE.scale);
}

describe('fragmentAuswerten: kein Fragment', () => {
  it('liefert null ohne führendes „#"', () => {
    expect(fragmentAuswerten('')).toBeNull();
    expect(fragmentAuswerten('p=abc')).toBeNull();
  });

  it('liefert ein gültig-leeres Ergebnis für ein bloßes „#"', () => {
    // Kein einziger Schlüssel vorhanden — wie ein beschädigter Link.
    expect(fragmentAuswerten('#')).toEqual({ patch: null, szeneId: null });
  });
});

describe('fragmentAuswerten: altes „#p="-Fragment unverändert', () => {
  it('gültig-leer bei „#p=" ohne Rest', () => {
    expect(fragmentAuswerten('#p=')).toEqual({ patch: {}, szeneId: null });
  });

  it('übernimmt einen gültigen p-Patch unverändert', () => {
    const patch = { scale: { sizeScale: 3 } };
    expect(fragmentAuswerten('#p=' + encodePatch(patch))).toEqual({ patch, szeneId: null });
  });

  it('beschädigtes p ohne weiteren Schlüssel: patch null', () => {
    expect(fragmentAuswerten('#p=!!!nicht-base64!!!')).toEqual({ patch: null, szeneId: null });
  });
});

describe('fragmentAuswerten: unbekannte Schlüssel', () => {
  it('ignoriert unbekannte Schlüssel, patch bleibt null ohne einen gültigen', () => {
    expect(fragmentAuswerten('#foo=bar&baz=qux')).toEqual({ patch: null, szeneId: null });
  });

  it('unbekannte Schlüssel neben einem gültigen stören nicht', () => {
    const ergebnis = fragmentAuswerten('#foo=bar&lang=en');
    expect(ergebnis?.patch).toEqual({ ui: { language: 'en' } });
  });
});

describe('fragmentAuswerten: date', () => {
  it('Datum ohne Uhrzeit bedeutet 12:00 UTC, angehalten', () => {
    const ergebnis = fragmentAuswerten('#date=2024-03-01');
    const erwartet = Date.UTC(2024, 2, 1, 12, 0, 0, 0) / 86_400_000 + 2440587.5;
    expect(ergebnis?.patch).toEqual({ time: { jd: erwartet, paused: true } });
  });

  it('Datum mit Uhrzeit trifft genau diesen Zeitpunkt', () => {
    const ergebnis = fragmentAuswerten('#date=2024-03-01T18:45Z');
    const erwartet = Date.UTC(2024, 2, 1, 18, 45, 0, 0) / 86_400_000 + 2440587.5;
    expect(ergebnis?.patch).toEqual({ time: { jd: erwartet, paused: true } });
  });

  it('Prozent-kodierter Doppelpunkt in der Uhrzeit wird verstanden', () => {
    const kodiert = fragmentAuswerten('#date=2024-03-01T18%3A45Z');
    const klartext = fragmentAuswerten('#date=2024-03-01T18:45Z');
    expect(kodiert?.patch).toEqual(klartext?.patch);
  });

  it('unmögliches Kalenderdatum wird verworfen (kein stilles Umschreiben)', () => {
    expect(fragmentAuswerten('#date=2026-02-30')).toEqual({ patch: null, szeneId: null });
  });

  it('Jahr 0000 liegt außerhalb des Zeitbereichs', () => {
    expect(fragmentAuswerten('#date=0000-06-15')).toEqual({ patch: null, szeneId: null });
  });

  it('Jahr mit 5 Stellen ist kein gültiges Datum', () => {
    expect(fragmentAuswerten('#date=10000-01-01')).toEqual({ patch: null, szeneId: null });
  });

  it('untere Grenze des Zeitbereichs ist genau gültig', () => {
    const ergebnis = fragmentAuswerten('#date=0001-01-01T00:00Z');
    expect(ergebnis?.patch).toEqual({ time: { jd: JD_MIN, paused: true } });
  });

  it('obere Grenze des Zeitbereichs ist genau gültig', () => {
    const ergebnis = fragmentAuswerten('#date=9999-12-31T00:00Z');
    expect(ergebnis?.patch).toEqual({ time: { jd: JD_MAX, paused: true } });
  });

  it('der 31.12.9999 ohne Uhrzeit (12:00 UTC) liegt schon über der oberen Grenze', () => {
    expect(fragmentAuswerten('#date=9999-12-31')).toEqual({ patch: null, szeneId: null });
  });

  it('ein ungültiges Datum neben einem gültigen body zählt für sich allein nicht', () => {
    const ergebnis = fragmentAuswerten('#date=2026-02-30&body=mars');
    expect(ergebnis?.patch?.time).toBeUndefined();
    expect((ergebnis?.patch?.camera as { targetId: string }).targetId).toBe('mars');
  });
});

describe('fragmentAuswerten: body', () => {
  it('wählt den Körper aus und richtet die Kamera auf ihn, wie ein Klick in der Körperliste', () => {
    const ergebnis = fragmentAuswerten('#body=mars');
    expect(ergebnis?.patch).toEqual({
      camera: { targetId: 'mars', mode: 'attached', freezeJd: null, distance: erwarteterAbstand('mars') },
      ui: { info: { thema: null } },
    });
  });

  it('unbekannter Körper (katalogfremde Kennung) wird ignoriert', () => {
    expect(fragmentAuswerten('#body=vulcan')).toEqual({ patch: null, szeneId: null });
  });

  it('behält Azimut und Elevation aus der Grundlage p bei (wie beim Klick)', () => {
    const p = { camera: { azimuth: 1.23, elevation: -0.4 } };
    const ergebnis = fragmentAuswerten('#p=' + encodePatch(p) + '&body=mars');
    expect(ergebnis?.patch).toEqual({
      camera: {
        azimuth: 1.23, elevation: -0.4,
        targetId: 'mars', mode: 'attached', freezeJd: null, distance: erwarteterAbstand('mars'),
      },
      ui: { info: { thema: null } },
    });
  });

  it('rechnet den Fokusabstand mit dem Maßstab aus p', () => {
    const p = { scale: { sizeScale: DEFAULT_STATE.scale.sizeScale * 2 } };
    const ergebnis = fragmentAuswerten('#p=' + encodePatch(p) + '&body=mars');
    const massstab = { ...DEFAULT_STATE.scale, sizeScale: DEFAULT_STATE.scale.sizeScale * 2 };
    const mars = bodyIndex.mars;
    if (mars === undefined) throw new Error('Unbekannter Körper in der Prüfung: mars');
    const erwartet = fokusAbstand(mars, massstab);
    expect((ergebnis?.patch?.camera as { distance: number }).distance).toBe(erwartet);
  });
});

describe('fragmentAuswerten: scene', () => {
  it('gültige Szene: date und body zählen dann nicht', () => {
    const ergebnis = fragmentAuswerten('#scene=systemblick&date=2024-03-01&body=mars');
    expect(ergebnis?.szeneId).toBe('systemblick');
    expect(ergebnis?.patch).toEqual({});
  });

  it('lang gilt neben einer Szene weiterhin', () => {
    const ergebnis = fragmentAuswerten('#scene=systemblick&lang=en');
    expect(ergebnis?.szeneId).toBe('systemblick');
    expect(ergebnis?.patch).toEqual({ ui: { language: 'en' } });
  });

  it('unbekannte Szene wird ignoriert, date und body gelten normal', () => {
    const ergebnis = fragmentAuswerten('#scene=nichtvorhanden&date=2024-03-01');
    expect(ergebnis?.szeneId).toBeNull();
    expect(ergebnis?.patch?.time).toBeDefined();
  });
});

describe('fragmentAuswerten: lang', () => {
  it('de und en sind gültig', () => {
    expect(fragmentAuswerten('#lang=en')?.patch).toEqual({ ui: { language: 'en' } });
    expect(fragmentAuswerten('#lang=de')?.patch).toEqual({ ui: { language: 'de' } });
  });

  it('unbekannte Sprache (fr) wird ignoriert', () => {
    expect(fragmentAuswerten('#lang=fr')).toEqual({ patch: null, szeneId: null });
  });

  it('überschreibt die Sprache aus p', () => {
    const p = { ui: { language: 'de' } };
    const ergebnis = fragmentAuswerten('#p=' + encodePatch(p) + '&lang=en');
    expect((ergebnis?.patch?.ui as { language: string }).language).toBe('en');
  });
});

describe('fragmentAuswerten: p als Grundlage', () => {
  it('date überschreibt nur die Uhr, andere Felder von p bleiben', () => {
    const p = { time: { jd: 2451000, rateDaysPerSec: 5 } };
    const ergebnis = fragmentAuswerten('#p=' + encodePatch(p) + '&date=2024-03-01');
    const erwarteteJd = Date.UTC(2024, 2, 1, 12, 0, 0, 0) / 86_400_000 + 2440587.5;
    expect(ergebnis?.patch).toEqual({ time: { jd: erwarteteJd, paused: true, rateDaysPerSec: 5 } });
  });
});

describe('fragmentAuswerten: URL-Kodierung, leere Werte, doppelte Schlüssel', () => {
  it('leerer Wert bei body neben gültigem date', () => {
    const ergebnis = fragmentAuswerten('#body=&date=2024-03-01');
    expect(ergebnis?.patch?.camera).toBeUndefined();
    expect(ergebnis?.patch?.time).toBeDefined();
  });

  it('doppelter Schlüssel: der erste zählt', () => {
    const ergebnis = fragmentAuswerten('#body=mars&body=venus');
    expect((ergebnis?.patch?.camera as { targetId: string }).targetId).toBe('mars');
  });

  it('doppelter Schlüssel: ein leerer erster Wert lässt den zweiten nicht mehr gelten', () => {
    const ergebnis = fragmentAuswerten('#body=&body=mars');
    expect(ergebnis).toEqual({ patch: null, szeneId: null });
  });
});

describe('fragmentAuswerten: Erkennung als gültiger Link (Grundlage für „mitLink" in app/main.tsx)', () => {
  it('ein rein lesbarer Link ganz ohne p gilt als gültig', () => {
    // Das spätere README-Beispiel: https://orrery3d.de/#date=1990-05-17&body=mars
    const ergebnis = fragmentAuswerten('#date=1990-05-17&body=mars');
    expect(ergebnis?.patch).not.toBeNull();
  });

  it('der vom Knopf erzeugte Link (p zuletzt) gilt als gültig', () => {
    const ergebnis = fragmentAuswerten('#date=1990-05-17&body=mars&p=' + encodePatch({}));
    expect(ergebnis?.patch).not.toBeNull();
  });

  it('eine gültige Szene allein gilt ebenfalls als Link', () => {
    const ergebnis = fragmentAuswerten('#scene=systemblick');
    expect(ergebnis).not.toBeNull();
    expect(ergebnis?.patch !== null || ergebnis?.szeneId !== null).toBe(true);
  });

  it('ein beschädigtes p ohne weiteren Schlüssel gilt nicht als Link', () => {
    const ergebnis = fragmentAuswerten('#p=!!!nicht-base64!!!');
    expect(ergebnis?.patch === null && ergebnis?.szeneId === null).toBe(true);
  });
});

describe('fragmentAuswerten: date überschreibt p nur bei abweichender Minute', () => {
  it('gleiche Minute: p bleibt maßgeblich, auch für paused', () => {
    // 30 Sekunden nach einer vollen Minute — date rundet genau auf diese Minute.
    const basisJd = 2451000 + 30 / 86_400;
    const p = { time: { jd: basisJd, paused: false, rateDaysPerSec: 5 } };
    const link = '#p=' + encodePatch(p) + '&date=' + datumAufDerselbenMinute(basisJd);
    expect(fragmentAuswerten(link)?.patch).toEqual({ time: { jd: basisJd, paused: false, rateDaysPerSec: 5 } });
  });

  it('abweichende Minute: date überschreibt wie gehabt, auch paused', () => {
    const p = { time: { jd: 2451000, paused: false, rateDaysPerSec: 5 } };
    const link = '#p=' + encodePatch(p) + '&date=2024-03-01T18:45Z';
    const erwarteteJd = Date.UTC(2024, 2, 1, 18, 45, 0, 0) / 86_400_000 + 2440587.5;
    expect(fragmentAuswerten(link)?.patch).toEqual({ time: { jd: erwarteteJd, paused: true, rateDaysPerSec: 5 } });
  });
});

describe('lesbarerLink', () => {
  it('erzeugt date, body (nur bei ausgewähltem Körper) und p in dieser Reihenfolge', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.camera = { ...state.camera, mode: 'attached', targetId: 'mars' };
    const link = lesbarerLink(state, ORT);
    expect(link.startsWith(`${ORT.origin}${ORT.pathname}#date=`)).toBe(true);
    expect(fragmentTeil(link)).toMatch(/^#date=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z&body=mars&p=/);
  });

  it('lässt body weg, wenn kein Körper ausgewählt ist (camera.mode nicht attached)', () => {
    const link = lesbarerLink(structuredClone(DEFAULT_STATE), ORT); // Standard: mode 'free'
    expect(fragmentTeil(link)).not.toMatch(/[#&]body=/);
  });

  it('rundet date auf die volle Minute', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.time.jd = DEFAULT_STATE.time.jd + 45 / 86_400; // 45 Sekunden später
    const link = lesbarerLink(state, ORT);
    const treffer = /^#date=(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z)&/.exec(fragmentTeil(link));
    expect(treffer).not.toBeNull();
    // 45 s runden aufwärts: Bei J2000 (12:00:00 UTC) ist das die nächste Minute.
    expect(treffer?.[1]).toBe('2000-01-01T12:01Z');
  });

  it('Rundreise: Sekunden und laufende Uhr bleiben wie mit „#p=" erhalten', () => {
    const state = structuredClone(DEFAULT_STATE);
    // 10 s nach der vollen Minute: date rundet ab, fällt also auf dieselbe
    // Minute wie der genaue Zeitpunkt — 30 s wäre die Rundungsgrenze selbst.
    state.time.jd = DEFAULT_STATE.time.jd + 10 / 86_400;
    state.time.paused = false;
    state.scale = { ...state.scale, sizeScale: 7 };
    const link = lesbarerLink(state, ORT);
    const ergebnis = fragmentAuswerten(fragmentTeil(link));
    const zurueck = fromShareable(ergebnis?.patch ?? {});
    expect(zurueck.time.jd).toBe(state.time.jd);
    expect(zurueck.time.paused).toBe(false);
    expect(zurueck.scale.sizeScale).toBe(7);
  });

  it('Rundreise mit ausgewähltem Körper: derselbe Zustand wie mit „#p=" allein', () => {
    const state = structuredClone(DEFAULT_STATE);
    state.camera = {
      ...state.camera, mode: 'attached', targetId: 'mars', freezeJd: null,
      distance: erwarteterAbstand('mars'),
    };
    const link = lesbarerLink(state, ORT);
    const ergebnis = fragmentAuswerten(fragmentTeil(link));
    const zurueck = fromShareable(ergebnis?.patch ?? {});
    expect(zurueck.camera).toEqual(state.camera);
  });
});
