import { describe, expect, it } from 'vitest';

// Der Transcoder liegt versioniert unter public/basis/ (Entwurf Phase 5 §5.2).
// Ein three-Update brächte eine neue Fassung mit, zu der die alte nicht mehr
// passt — dieser Test fällt dann, statt dass der Transcoder still veraltet.
describe('Basis-Transcoder', () => {
  it.each(['basis_transcoder.js', 'basis_transcoder.wasm'])('%s gleicht Byte für Byte der Fassung aus three', async (datei) => {
    // @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration (wie in src/data/index.test.ts).
    const { readFileSync } = await import('node:fs');
    const eigen = readFileSync(`public/basis/${datei}`);
    const three = readFileSync(`node_modules/three/examples/jsm/libs/basis/${datei}`);
    expect(eigen.equals(three)).toBe(true);
  });

  it('wird vom Webspace mit passenden Typen, Cache und Kompression ausgeliefert', async () => {
    // @ts-expect-error -- 'node:fs' hat ohne @types/node keine Typdeklaration (wie in src/data/index.test.ts).
    const { readFileSync } = await import('node:fs');
    const htaccess = readFileSync('public/.htaccess', 'utf8') as string;
    expect(htaccess).toContain('AddType image/ktx2 .ktx2');
    expect(htaccess).toContain('AddType application/wasm .wasm');
    expect(htaccess).toMatch(/FilesMatch "\\\.\(jpg\|jpeg\|png\|webp\|ktx2\)\$"/);
    expect(htaccess).toMatch(/DEFLATE[^\n]*application\/wasm/);
  });
});
