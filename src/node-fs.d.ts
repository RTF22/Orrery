/**
 * Minimale Typdeklaration für `node:fs`, nur die in
 * `ui/info/konstanten.test.ts` gebrauchte Funktion (Lesen der CSS-Datei als
 * Zwillingsprüfung der Medienabfragen). Ruling: `@types/node` fehlt bewusst
 * (keine neue Abhängigkeit) und `tsconfig.json` beschränkt `types` auf
 * `vite/client`; ohne diese Deklaration lehnt `tsc -b` den Import ab
 * (TS2591) — Laufzeit ist unbetroffen, Vitest läuft in Node.
 */
declare module 'node:fs' {
  export function readFileSync(path: string | URL, encoding: string): string;
}
