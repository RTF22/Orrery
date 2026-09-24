import { describe, expect, it, vi } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  dateienUnter,
  groesse,
  istNetzfehler,
  konfigLesen,
  mitWiederholung,
  ordnerFuer,
  uebersichtZeilen,
  veralteteNamen,
} from './deploy.ts';

const voll = {
  DEPLOY_HOST: 'ftp.example.org',
  DEPLOY_USER: 'w0123456',
  DEPLOY_PASSWORD: 'geheim',
  DEPLOY_DIR: '/example.org/Orrery',
};

describe('konfigLesen', () => {
  it('liest alle vier Pflichtfelder', () => {
    expect(konfigLesen(voll)).toEqual({
      host: 'ftp.example.org',
      port: 21,
      user: 'w0123456',
      password: 'geheim',
      dir: '/example.org/Orrery',
      secure: true,
    });
  });

  it('nennt jedes fehlende Feld beim Namen', () => {
    expect(() => konfigLesen({ DEPLOY_HOST: 'h' })).toThrow(
      /DEPLOY_USER, DEPLOY_PASSWORD, DEPLOY_DIR/,
    );
  });

  it('behandelt leere Werte wie fehlende', () => {
    expect(() => konfigLesen({ ...voll, DEPLOY_PASSWORD: '  ' })).toThrow(/DEPLOY_PASSWORD/);
  });

  it('verlangt ein absolutes Zielverzeichnis', () => {
    expect(() => konfigLesen({ ...voll, DEPLOY_DIR: 'Orrery' })).toThrow(/DEPLOY_DIR/);
  });

  it('lehnt die Wurzel als Ziel ab', () => {
    expect(() => konfigLesen({ ...voll, DEPLOY_DIR: '/' })).toThrow(/DEPLOY_DIR/);
  });

  it('nimmt einen abweichenden Port an und lehnt Unsinn ab', () => {
    expect(konfigLesen({ ...voll, DEPLOY_PORT: '2121' }).port).toBe(2121);
    expect(() => konfigLesen({ ...voll, DEPLOY_PORT: 'einundzwanzig' })).toThrow(/DEPLOY_PORT/);
    expect(() => konfigLesen({ ...voll, DEPLOY_PORT: '0' })).toThrow(/DEPLOY_PORT/);
  });

  it('schaltet TLS nur mit DEPLOY_SECURE=false ab', () => {
    expect(konfigLesen({ ...voll, DEPLOY_SECURE: 'false' }).secure).toBe(false);
    expect(konfigLesen({ ...voll, DEPLOY_SECURE: 'nein' }).secure).toBe(true);
  });
});

describe('veralteteNamen', () => {
  it('liefert die entfernten Namen, die lokal fehlen', () => {
    expect(
      veralteteNamen(['index-alt.js', 'index-neu.js', 'index-alt.css'], ['index-neu.js']),
    ).toEqual(['index-alt.js', 'index-alt.css']);
  });

  it('ist leer, wenn alles übereinstimmt', () => {
    expect(veralteteNamen(['a.js'], ['a.js'])).toEqual([]);
  });
});

describe('dateienUnter', () => {
  it('liefert alle Dateien rekursiv, mit Schrägstrich-Pfaden und Größen, alphabetisch', () => {
    const wurzel = mkdtempSync(join(tmpdir(), 'orrery-dist-'));
    try {
      mkdirSync(join(wurzel, 'textures', 'earth'), { recursive: true });
      writeFileSync(join(wurzel, 'index.html'), 'x'.repeat(10));
      writeFileSync(join(wurzel, 'textures', 'earth', 'albedo-1024.ktx2'), 'y'.repeat(2500));
      writeFileSync(join(wurzel, '.htaccess'), 'z');
      expect(dateienUnter(wurzel)).toEqual([
        { pfad: '.htaccess', bytes: 1 },
        { pfad: 'index.html', bytes: 10 },
        { pfad: 'textures/earth/albedo-1024.ktx2', bytes: 2500 },
      ]);
    } finally {
      rmSync(wurzel, { recursive: true, force: true });
    }
  });

  it('liefert für einen leeren Ordner eine leere Liste', () => {
    const wurzel = mkdtempSync(join(tmpdir(), 'orrery-dist-'));
    try {
      expect(dateienUnter(wurzel)).toEqual([]);
    } finally {
      rmSync(wurzel, { recursive: true, force: true });
    }
  });
});

describe('istNetzfehler', () => {
  it('erkennt bekannte Netzwerk-Fehlercodes', () => {
    expect(istNetzfehler(Object.assign(new Error('x'), { code: 'ECONNRESET' }))).toBe(true);
  });

  it('erkennt FTP-Antwortcodes 421 und 425/426', () => {
    expect(istNetzfehler(Object.assign(new Error('x'), { code: 425 }))).toBe(true);
    expect(istNetzfehler(Object.assign(new Error('x'), { code: 426 }))).toBe(true);
    expect(istNetzfehler(Object.assign(new Error('x'), { code: 421 }))).toBe(true);
  });

  it('erkennt eine geschlossene Verbindung an der Meldung', () => {
    expect(istNetzfehler(new Error('Client is closed'))).toBe(true);
  });

  it('erkennt eine Zeitüberschreitung an der Meldung', () => {
    expect(istNetzfehler(new Error('Timeout (control socket)'))).toBe(true);
  });

  it('lehnt FTP-Fehler ohne Netz-Code ab', () => {
    expect(istNetzfehler(new Error('550 No such file'))).toBe(false);
  });

  it('lehnt Nicht-Fehler-Werte ab', () => {
    expect(istNetzfehler('text')).toBe(false);
  });
});

describe('mitWiederholung', () => {
  it('gibt bei Erfolg im ersten Versuch das Ergebnis zurück, ohne neu zu verbinden', async () => {
    const neuVerbinden = vi.fn(async () => {});
    const ergebnis = await mitWiederholung(async () => 'ok', neuVerbinden);
    expect(ergebnis).toBe('ok');
    expect(neuVerbinden).not.toHaveBeenCalled();
  });

  it('versucht nach zwei Netzfehlern ein drittes Mal erfolgreich', async () => {
    const neuVerbinden = vi.fn(async () => {});
    let versuch = 0;
    const aktion = vi.fn(async () => {
      versuch += 1;
      if (versuch <= 2) throw Object.assign(new Error('x'), { code: 'ECONNRESET' });
      return 'ok';
    });
    const ergebnis = await mitWiederholung(aktion, neuVerbinden);
    expect(ergebnis).toBe('ok');
    expect(neuVerbinden).toHaveBeenCalledTimes(2);
  });

  it('wirft nach drei Netzfehlern den letzten Fehler und verbindet nur zweimal neu', async () => {
    const neuVerbinden = vi.fn(async () => {});
    const fehler3 = Object.assign(new Error('dritter'), { code: 'ECONNRESET' });
    const aktion = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('erster'), { code: 'ECONNRESET' }))
      .mockRejectedValueOnce(Object.assign(new Error('zweiter'), { code: 'ECONNRESET' }))
      .mockRejectedValueOnce(fehler3);
    await expect(mitWiederholung(aktion, neuVerbinden)).rejects.toBe(fehler3);
    expect(neuVerbinden).toHaveBeenCalledTimes(2);
  });

  it('wirft andere Fehler sofort weiter, ohne neu zu verbinden', async () => {
    const neuVerbinden = vi.fn(async () => {});
    const fehler = new Error('550 No such file');
    const aktion = vi.fn().mockRejectedValueOnce(fehler);
    await expect(mitWiederholung(aktion, neuVerbinden)).rejects.toBe(fehler);
    expect(neuVerbinden).not.toHaveBeenCalled();
  });
});

describe('ordnerFuer', () => {
  it('liefert die vorab anzulegenden Ordner, sortiert, ohne Wurzel', () => {
    const dateien = ['index.html', 'assets/a.js', 'textures/earth/x.ktx2', 'textures/sun/y.ktx2'].map(
      (pfad) => ({ pfad, bytes: 0 }),
    );
    expect(ordnerFuer(dateien)).toEqual(['assets', 'textures', 'textures/earth', 'textures/sun']);
  });

  it('liefert eine leere Liste ohne Unterordner', () => {
    expect(ordnerFuer([{ pfad: 'index.html', bytes: 0 }])).toEqual([]);
  });
});

describe('groesse', () => {
  it('schreibt Bytes, kB, MB und GB in Zehnerpotenzen mit Komma', () => {
    expect(groesse(999)).toBe('999 B');
    expect(groesse(1000)).toBe('1,00 kB');
    expect(groesse(1_529_670)).toBe('1,53 MB');
    expect(groesse(176_000_000)).toBe('176,00 MB');
    expect(groesse(2_500_000_000)).toBe('2,50 GB');
  });
});

describe('uebersichtZeilen', () => {
  const dateien = [
    { pfad: '.htaccess', bytes: 500 },
    { pfad: 'assets/index-abc.js', bytes: 1_529_670 },
    { pfad: 'textures/earth/albedo-1024.ktx2', bytes: 300_000 },
    { pfad: 'textures/sun/albedo-1024.ktx2', bytes: 200_000 },
  ];

  it('nennt jede Datei, Summen je Ordner und am Ende die Gesamtgröße', () => {
    const zeilen = uebersichtZeilen(dateien);
    expect(zeilen).toContain('  assets/index-abc.js  1,53 MB');
    expect(zeilen).toContain('  (Stamm)  1 Datei, 500 B');
    expect(zeilen).toContain('  textures/  2 Dateien, 500,00 kB');
    expect(zeilen.at(-1)).toBe('Gesamt: 4 Dateien, 2,03 MB');
  });

  it('weist auf Stücke aus public/musik/ hin, die mit hochgeladen würden', () => {
    const zeilen = uebersichtZeilen([...dateien, { pfad: 'musik/stuecke.json', bytes: 50 }]);
    expect(zeilen.some((zeile) => zeile.includes('public/musik/'))).toBe(true);
    expect(zeilen.at(-1)).toBe('Gesamt: 5 Dateien, 2,03 MB');
  });

  it('erwähnt ohne musik/ keine Musik', () => {
    expect(uebersichtZeilen(dateien).some((zeile) => zeile.includes('musik'))).toBe(false);
  });
});
