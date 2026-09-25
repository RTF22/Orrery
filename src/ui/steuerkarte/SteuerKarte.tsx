import { Kartendialog, type KartenReiter } from '../karte/Kartendialog';
import { useMusikStand } from '../musikStand';
import { KUERZEL, MUSIK_KUERZEL } from './belegung';
import { ControllerBild } from './Controller';
import { Kuerzelliste } from './Kuerzelliste';
import { useSteuerKarte, type SteuerReiter } from './zustand';

const REITER: readonly KartenReiter<SteuerReiter>[] = [
  { id: 'tastatur', schluessel: 'steuerkarte.reiter.tastatur' },
  { id: 'controller', schluessel: 'steuerkarte.reiter.controller' },
];

/** Reiter „Tastatur"; M nur mit Musik des Betreibers (useShortcuts.ts). */
function ReiterTastatur(): React.JSX.Element {
  const musik = useMusikStand((s) => s.verfuegbar);
  return <Kuerzelliste eintraege={musik ? [...KUERZEL, ...MUSIK_KUERZEL] : KUERZEL} />;
}

/** Reiter „Controller" — schematische Grafik mit beschrifteten Knöpfen. */
function ReiterController(): React.JSX.Element {
  return <ControllerBild />;
}

/** Karte „Steuerung" (Entwurf Info-Karte §7). */
export function SteuerKarte(): React.JSX.Element | null {
  const offen = useSteuerKarte((s) => s.offen);
  const reiter = useSteuerKarte((s) => s.reiter);
  const setReiter = useSteuerKarte((s) => s.setReiter);
  const schliessen = useSteuerKarte((s) => s.schliessen);
  return (
    <Kartendialog
      offen={offen}
      titelSchluessel="steuerkarte.titel"
      reiterSchluessel="steuerkarte.reiter"
      reiter={REITER}
      aktiv={reiter}
      setAktiv={setReiter}
      schliessen={schliessen}
      kennung="steuerkarte"
      breite="w-[min(96vw,56rem)]"
    >
      {reiter === 'tastatur' ? <ReiterTastatur /> : <ReiterController />}
    </Kartendialog>
  );
}
