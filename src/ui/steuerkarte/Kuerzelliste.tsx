import { t } from '../i18n';
import type { Kuerzel } from './belegung';

export function Kuerzelliste({ eintraege }: { eintraege: Kuerzel }): React.JSX.Element {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
      {eintraege.map(([taste, schluessel]) => {
        const label = typeof taste === 'string' ? taste : t(taste.key);
        return (
          <div key={schluessel} className="contents">
            <dt className="font-mono text-xs opacity-80">{label}</dt>
            <dd className="m-0">{t(schluessel)}</dd>
          </div>
        );
      })}
    </dl>
  );
}
