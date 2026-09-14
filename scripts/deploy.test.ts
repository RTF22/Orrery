import { describe, expect, it } from 'vitest';
import { konfigLesen, veralteteNamen } from './deploy.ts';

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
