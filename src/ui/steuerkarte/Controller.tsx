import { t } from '../i18n';

/** Eine Beschriftung: Text, optionale zweite Zeile, Seite, Grundlinie, Zielpunkt am Controller (viewBox-Einheiten). */
export interface Beschriftung {
  readonly schluessel: string;
  readonly zusatz?: string;
  readonly seite: 'links' | 'rechts';
  readonly y: number;
  readonly ziel: readonly [number, number];
}

/**
 * Belegung nach dem Entwurf Flug und Controller §5.2/§5.3 (Standardbelegung).
 * Die Grundlinien sind so gewählt, dass sich die Linien nicht kreuzen und an
 * den Knöpfen vorbeiführen; X, L3 und die Mitteltaste sind unbelegt.
 */
export const BESCHRIFTUNGEN: readonly Beschriftung[] = [
  { schluessel: 'steuerkarte.pad.lt', seite: 'links', y: 50, ziel: [402, 66] },
  { schluessel: 'steuerkarte.pad.lb', zusatz: 'steuerkarte.pad.lbZusatz', seite: 'links', y: 88, ziel: [400, 84] },
  { schluessel: 'steuerkarte.pad.ansicht', seite: 'links', y: 135, ziel: [455, 150] },
  { schluessel: 'steuerkarte.pad.linkerStick', zusatz: 'steuerkarte.pad.linkerStickZusatz', seite: 'links', y: 175, ziel: [400, 165] },
  { schluessel: 'steuerkarte.pad.kreuzOben', seite: 'links', y: 230, ziel: [435, 226] },
  { schluessel: 'steuerkarte.pad.kreuzSeiten', seite: 'links', y: 255, ziel: [421, 237] },
  { schluessel: 'steuerkarte.pad.kreuzUnten', seite: 'links', y: 280, ziel: [435, 248] },
  { schluessel: 'steuerkarte.pad.rt', seite: 'rechts', y: 50, ziel: [558, 66] },
  { schluessel: 'steuerkarte.pad.rb', seite: 'rechts', y: 80, ziel: [560, 84] },
  { schluessel: 'steuerkarte.pad.menue', seite: 'rechts', y: 110, ziel: [505, 150] },
  { schluessel: 'steuerkarte.pad.y', seite: 'rechts', y: 145, ziel: [565, 150] },
  { schluessel: 'steuerkarte.pad.b', seite: 'rechts', y: 180, ziel: [587, 172] },
  { schluessel: 'steuerkarte.pad.a', seite: 'rechts', y: 212, ziel: [565, 194] },
  { schluessel: 'steuerkarte.pad.rechterStick', zusatz: 'steuerkarte.pad.rechterStickZusatz', seite: 'rechts', y: 250, ziel: [525, 237] },
];

const TEXT_LINKS = 290;
const TEXT_RECHTS = 670;
const KOERPER = 'M 345 95 C 380 86 420 88 440 92 L 520 92 C 540 88 580 86 615 95 C 650 105 668 160 682 240 C 695 315 690 370 650 382 C 615 392 590 360 572 322 C 562 302 548 296 525 296 L 435 296 C 412 296 398 302 388 322 C 370 360 345 392 310 382 C 270 370 265 315 278 240 C 292 160 310 105 345 95 Z';
const TASTEN: readonly (readonly [string, number, number, string])[] = [
  ['Y', 565, 150, '#d29922'],
  ['X', 543, 172, '#58a6ff'],
  ['B', 587, 172, '#f85149'],
  ['A', 565, 194, '#3fb950'],
];

/**
 * Schematischer Controller (eigene Zeichnung, kein fremdes Bildmaterial) mit
 * Beschriftungen links und rechts (Entwurf Info-Karte §7). Die Grafik ist für
 * Screenreader verborgen; dieselbe Belegung steht als unsichtbare Liste daneben.
 */
export function ControllerBild(): React.JSX.Element {
  return (
    <div>
      <svg viewBox="0 0 960 400" aria-hidden="true" className="h-auto w-full" fontSize="15" fill="currentColor">
        {/* Schultertasten und Trigger */}
        <rect x="380" y="55" width="45" height="22" rx="8" className="fill-slate-600" />
        <rect x="535" y="55" width="45" height="22" rx="8" className="fill-slate-600" />
        <rect x="365" y="78" width="70" height="12" rx="6" className="fill-slate-500" />
        <rect x="525" y="78" width="70" height="12" rx="6" className="fill-slate-500" />
        <path d={KOERPER} className="fill-slate-700 stroke-slate-400" strokeWidth="2" />
        {/* Linien unter den Knöpfen */}
        <g className="stroke-slate-400/70" strokeWidth="1.2" fill="none">
          {BESCHRIFTUNGEN.map((b) => (
            <line
              key={b.schluessel}
              x1={b.seite === 'links' ? TEXT_LINKS + 6 : TEXT_RECHTS - 6}
              y1={b.y - 5}
              x2={b.ziel[0]}
              y2={b.ziel[1]}
            />
          ))}
        </g>
        {/* Sticks, Steuerkreuz, Mitte */}
        <circle cx="400" cy="165" r="22" className="fill-slate-800 stroke-slate-500" strokeWidth="2" />
        <circle cx="400" cy="165" r="14" className="fill-slate-600" />
        <circle cx="525" cy="237" r="22" className="fill-slate-800 stroke-slate-500" strokeWidth="2" />
        <circle cx="525" cy="237" r="14" className="fill-slate-600" />
        <path d="M 430 222 h 10 v 10 h 10 v 10 h -10 v 10 h -10 v -10 h -10 v -10 h 10 Z" className="fill-slate-500" />
        <circle cx="455" cy="150" r="6" className="fill-slate-500" />
        <circle cx="505" cy="150" r="6" className="fill-slate-500" />
        <circle cx="480" cy="120" r="9" className="fill-slate-600" />
        {TASTEN.map(([name, x, y, farbe]) => (
          <g key={name}>
            <circle cx={x} cy={y} r="10" fill={farbe} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" className="fill-slate-900">{name}</text>
          </g>
        ))}
        {/* Beschriftungen */}
        {BESCHRIFTUNGEN.map((b) => {
          const x = b.seite === 'links' ? TEXT_LINKS : TEXT_RECHTS;
          const anker = b.seite === 'links' ? 'end' : 'start';
          return (
            <text key={b.schluessel} x={x} y={b.y} textAnchor={anker} className="fill-slate-100">
              {t(b.schluessel)}
              {b.zusatz !== undefined ? (
                <tspan x={x} dy="16" fontSize="12" className="fill-slate-400">{t(b.zusatz)}</tspan>
              ) : null}
            </text>
          );
        })}
      </svg>
      <ul className="sr-only">
        {BESCHRIFTUNGEN.map((b) => (
          <li key={b.schluessel}>{t(b.schluessel)}{b.zusatz !== undefined ? ` (${t(b.zusatz)})` : ''}</li>
        ))}
      </ul>
    </div>
  );
}
