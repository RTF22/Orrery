import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { lizenzenText, paketLesen, paketeSammeln } from './lizenzen-dritter.ts';

describe('paketeSammeln', () => {
  it('nimmt die Laufzeitabhängigkeiten samt ihren eigenen und Tailwind für das CSS', () => {
    expect(paketeSammeln()).toEqual(['react', 'react-dom', 'scheduler', 'tailwindcss', 'three', 'zustand']);
  });
});

describe('lizenzenText', () => {
  const pakete = ['react', 'three'].map((n) => paketLesen(n));
  const text = lizenzenText(pakete);

  it('führt jedes Paket mit Version, Kennung und seinem Lizenztext', () => {
    for (const p of pakete) {
      expect(text).toContain(`${p.name} ${p.version} (MIT)`);
      expect(text).toContain(p.text);
    }
    expect(text).toContain('Copyright © 2010-2026 three.js authors');
  });

  it('liefert für den Basis-Transcoder NOTICE, Apache-Lizenz und die Zstandard-Lizenz mit', () => {
    const notice = readFileSync('scripts/lizenzen/basis-universal-NOTICE.txt', 'utf8');
    expect(text).toContain(notice.replace(/\r\n/g, '\n').trim());
    expect(text).toContain('Apache License\n                           Version 2.0, January 2004');
    expect(text).toContain('For Zstandard software');
  });

  it('schreibt nur LF, auch wenn die Vorlagen mit CRLF ausgecheckt sind', () => {
    expect(text).not.toContain('\r');
  });

  it('meldet ein Paket ohne Lizenzdatei, statt es still wegzulassen', () => {
    expect(() => paketLesen('vulcan', 'scripts/lizenzen')).toThrow();
  });
});
