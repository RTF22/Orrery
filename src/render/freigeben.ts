import * as THREE from 'three';

/** Texturen eines Materials: Karten (map, normalMap …) und Shader-Uniforms. */
function texturenVon(material: THREE.Material): THREE.Texture[] {
  const gefunden: THREE.Texture[] = [];
  for (const wert of Object.values(material)) {
    if (wert instanceof THREE.Texture) gefunden.push(wert);
  }
  if (material instanceof THREE.ShaderMaterial) {
    for (const uniform of Object.values(material.uniforms)) {
      if (uniform.value instanceof THREE.Texture) gefunden.push(uniform.value);
    }
  }
  return gefunden;
}

/**
 * Gibt alles frei, was die Szene noch hält — Geometrien, Materialien samt
 * Texturen, Lichter — und leert sie. Für den Abbau der ganzen Szene (Hot
 * Reload, StrictMode): Die einzelnen Sichten geben nur frei, was sie selbst
 * nachladen, der Rest bliebe sonst als Kopie im Grafikspeicher. Geteilte
 * Ressourcen werden nur einmal freigegeben; ein zweites dispose() einer schon
 * freigegebenen Ressource ist in three.js harmlos.
 */
export function szeneFreigeben(szene: THREE.Scene): void {
  const erledigt = new Set<{ dispose(): void }>();
  const frei = (d: { dispose(): void }): void => {
    if (erledigt.has(d)) return;
    erledigt.add(d);
    d.dispose();
  };
  szene.traverse((obj) => {
    const netz = obj as Partial<THREE.Mesh>;
    if (netz.geometry instanceof THREE.BufferGeometry) frei(netz.geometry);
    const material = netz.material;
    const materialien = Array.isArray(material) ? material : material === undefined ? [] : [material];
    for (const m of materialien) {
      for (const t of texturenVon(m)) frei(t);
      frei(m);
    }
    if (obj instanceof THREE.Light) frei(obj);
  });
  szene.clear();
}
