import { useStore } from '../store';
import { t } from './i18n';
import { formatZahl } from './format';

/**
 * Hinweis „Größen überhöht (n×)“ (Entwurf §11.4): sichtbar, solange der
 * Handmodus von der Erde eine Lupe über 1 zeigt — auch bei ausgeblendeter
 * Oberfläche, weil ein Bildschirmfoto sonst überhöhte Größen als echte zeigte.
 */
export function LupenHinweis(): React.JSX.Element | null {
  const lupe = useStore((s) => (s.camera.mode === 'geozentrisch' ? s.camera.geo.lupe : 1));
  if (lupe <= 1) return null;
  return (
    <div className="pointer-events-none fixed left-1/2 top-3 z-20 -translate-x-1/2 rounded bg-black/60 px-2 py-1 text-xs text-white/85">
      {t('himmel.groessenUeberhoeht').replace('{n}', formatZahl(lupe, lupe < 10 ? 1 : 0))}
    </div>
  );
}
