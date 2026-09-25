import { useStore } from '../store';
import { useSprache } from './i18n/useSprache';
import { Kopfzeile } from './Kopfzeile';
import { Seitenleiste } from './Seitenleiste';
import { Bogenreiter } from './Bogenreiter';
import { useSchmal } from './fenster';
import { TimePanel } from './panels/TimePanel';
import { ScalePanel } from './panels/ScalePanel';
import { CinemaPanel } from './panels/CinemaPanel';
import { CameraPanel } from './panels/CameraPanel';
import { DisplayPanel } from './panels/DisplayPanel';
import { AnsichtenPanel } from './panels/AnsichtenPanel';
import { BodyTree } from './panels/BodyTree';
import { InfoPanel } from './info/InfoPanel';
import { useShortcuts } from './shortcuts/useShortcuts';
import { useIdleHide } from './idle';
import { useWakeLock } from './wakeLock';
import { InfoKarte } from './infokarte/InfoKarte';
import { useInfoKarte } from './infokarte/zustand';
import { SteuerKarte } from './steuerkarte/SteuerKarte';
import { useSteuerKarte } from './steuerkarte/zustand';
import { HilfeKnopf } from './HilfeKnopf';

/**
 * Die Bedienoberfläche liegt als eigene Ebene über der Canvas. Sie lässt
 * Zeigereignisse durch (`pointer-events-none`); nur die Panels selbst fangen
 * sie wieder ein, damit das Ziehen der Kamera überall sonst funktioniert.
 */
export function App(): React.JSX.Element {
  // Muss vor allem anderen stehen, damit t() in diesem Durchlauf schon die
  // neue Tabelle sieht.
  useSprache();
  useShortcuts();
  const untaetig = useIdleHide();
  const schmal = useSchmal();
  const versteckt = useStore((s) => s.ui.hidden);
  const laeuftKino = useStore((s) => s.cinema.running);
  const infoOffen = useInfoKarte((s) => s.offen);
  const steuerOffen = useSteuerKarte((s) => s.offen);
  const karteOffen = infoOffen || steuerOffen;
  // Solange der Film läuft, darf der Bildschirm nicht abschalten.
  useWakeLock(laeuftKino);

  // Im Kino-Modus verschwindet die Oberfläche nach kurzer Ruhe von selbst;
  // außerhalb bleibt sie stehen, bis H gedrückt wird. Die Info-Karte steht
  // immer an derselben Stelle im Baum (zweites Kind des Fragments), auch
  // wenn die Ebene selbst verschwindet: Sonst hängt React `InfoKarte` beim
  // Wechsel neu ein, und die Fokusrückgabe beim Schließen (InfoKarte.tsx)
  // verliert ihr Ziel, weil `ausloeser` dann aus `document.body` gelesen wird.
  const sichtbar = !(versteckt || (laeuftKino && untaetig));

  return (
    <>
      {sichtbar ? (
        <div
          className="ui-ebene pointer-events-none fixed inset-0 flex items-start justify-between gap-2 p-3 text-slate-100"
          inert={karteOffen}
        >
          <Seitenleiste kopf={<Kopfzeile />}>
            {/* Die Himmelskörper stehen bewusst gleich unter dem Sprachschalter. */}
            <BodyTree />
            <TimePanel />
            <ScalePanel />
            <CinemaPanel />
            <CameraPanel />
            <DisplayPanel />
            <AnsichtenPanel />
          </Seitenleiste>
          <InfoPanel />
          {schmal ? <Bogenreiter /> : null}
          {schmal ? <HilfeKnopf /> : null}
        </div>
      ) : null}
      <InfoKarte />
      <SteuerKarte />
    </>
  );
}
