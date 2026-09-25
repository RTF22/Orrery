import { Kartendialog, type KartenReiter } from '../karte/Kartendialog';
import { useInfoKarte, type InfoReiter } from './zustand';
import { ReiterApp, ReiterBedienung, ReiterUeber } from './inhalte';

const REITER: readonly KartenReiter<InfoReiter>[] = [
  { id: 'app', schluessel: 'infokarte.reiter.app' },
  { id: 'bedienung', schluessel: 'infokarte.reiter.bedienung' },
  { id: 'ueber', schluessel: 'infokarte.reiter.ueber' },
];

/** Info-Karte (Entwurf Info-Karte §3–§4) im gemeinsamen Kartenrahmen. */
export function InfoKarte(): React.JSX.Element | null {
  const offen = useInfoKarte((s) => s.offen);
  const reiter = useInfoKarte((s) => s.reiter);
  const setReiter = useInfoKarte((s) => s.setReiter);
  const schliessen = useInfoKarte((s) => s.schliessen);
  return (
    <Kartendialog
      offen={offen}
      titelSchluessel="infokarte.titel"
      reiterSchluessel="infokarte.reiter"
      reiter={REITER}
      aktiv={reiter}
      setAktiv={setReiter}
      schliessen={schliessen}
      kennung="infokarte"
      breite="w-[min(92vw,34rem)] [@media(max-height:500px)]:w-[min(96vw,48rem)]"
    >
      {reiter === 'app' ? <ReiterApp /> : reiter === 'bedienung' ? <ReiterBedienung /> : <ReiterUeber />}
    </Kartendialog>
  );
}
