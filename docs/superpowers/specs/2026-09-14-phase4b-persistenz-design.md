# Phase 4b — Persistenz: URL-Sharing, Sitzung, Ansichten

Entwurf vom 14.09.2026. Teil von Phase 4 „Komfort" des Gesamtentwurfs
(`2026-09-11-sonnensystem-design.md`, §10 und §16). Reihenfolge der Phase 4 nach
Entscheidung vom 13.09.2026: 4a Englisch (abgeschlossen), dann 4b Persistenz, dann
4c Infopanel.

Akzeptanzkriterien aus dem Gesamtentwurf: **URL-Sharing stellt den Zustand exakt
wieder her (durch Round-Trip-Test abgesichert)** und **Presets speichern, laden,
exportieren, importieren.** Die benannten Nutzer-Einstellungen heißen in diesem
Entwurf und in der Oberfläche „Ansichten", weil „Preset" im Projekt bereits die drei
rastenden Maßstäbe bezeichnet (`scale.preset`, Maßstabspanel).

## 1. Ausgangslage

- `store/serialize.ts` liefert `toShareable`/`fromShareable` (rekursiver Diff gegen
  `DEFAULT_STATE`, Merge zurück) und `encodeState`/`decodeState` (JSON, Base64URL
  über den UTF-8-Bytepfad, Prototyp-Schutz, Rückfall auf den Standard bei
  beschädigtem Fragment). Nichts davon wird außerhalb der Tests aufgerufen.
- `decodeState` prüft keine Typen: `{"ui":{"language":"fr"}}` oder
  `{"time":{"jd":"x"}}` landen unverändert im Store. Pflichtpunkt aus der Abnahme
  4a: `ui.language` muss gegen `'de' | 'en'` geprüft werden.
- `app/main.tsx` setzt die Startsprache mit `startSprache(navigator.language, null)`;
  der zweite Parameter ist für den geteilten Zustand vorgesehen.
- Die Kopfzeile (`ui/Kopfzeile.tsx`) enthält nur den Sprachschalter und hat laut
  Kommentar Platz für weitere Schaltflächen.
- Der Store kennt `replaceAll(state)`; Panels öffnen und schließen über
  `ui.panels[id] !== false`.

## 2. Entscheidungen (Jens, 14.09.2026)

| Frage | Entscheidung |
|---|---|
| Schnitt | Ein Entwurf, zwei Etappen: (1) Prüfer, Profile, Sitzung, Link, Zurücksetzen; (2) Panel „Ansichten" mit Export und Import. Jede Etappe mit eigenem Abnahmeprotokoll. |
| Was mitreist | Siehe Profiltabelle in §3. Qualitätsstufe und Panelzustand reisen nicht im Link; Ansichten enthalten weder Zeitpunkt noch Kino, Qualität oder Oberfläche. |
| Adresszeile | Bleibt sauber. Nur „Link kopieren" erzeugt das Fragment und legt die Adresse in die Zwischenablage. Ein beim Start vorhandenes Fragment wird angewendet und dann entfernt. |
| Sitzung | Automatisch gesichert (entprellt 1 s, zusätzlich bei `pagehide`), beim Start wiederhergestellt, Checkbox „Sitzung merken" im Darstellungspanel, standardmäßig an; Ausschalten löscht sofort. |
| Zurücksetzen | Jetzt, als Schaltfläche in der Kopfzeile; Sprache und Qualitätsstufe bleiben erhalten. |
| Begriff | „Ansichten" / „Views". |
| Mechanik | Ansatz 1: eigenes Modul `store/persist.ts` (reine Funktionen, `Storage` als Parameter) plus Verdrahtung in `app/persistenz.ts`. Keine Zustand-Middleware, keine neue Abhängigkeit. |

## 3. Profile und Prüfung (`store/persist.ts`)

### 3.1 Profile

Ein Profil ist eine Liste von Pfaden, die aus dem Diff `toShareable(state)`
gestrichen werden, bevor kodiert oder gespeichert wird:

| Profil | Streicht | Verwendung |
|---|---|---|
| `link` | `quality`, `ui.hidden`, `ui.panels` | URL-Fragment |
| `sitzung` | nichts | `localStorage`, automatische Sicherung |
| `ansicht` | `time.jd`, `time.paused`, `cinema`, `quality`, `ui` | gespeicherte Ansichten, Export |

Signatur: `filtereProfil(patch: Plain, profil: Profil): Plain`. Leere Zweige, die
nach dem Streichen übrig bleiben, entfallen ganz. `cinema.elapsedSec` und
`cinema.nummer` bleiben im Link, weil der Kinozustand ohne sie nicht reproduzierbar
ist. `time.jd` bleibt im Link als der geteilte Moment; läuft die Uhr, läuft sie
danach weiter.

### 3.2 Prüfer

`pruefeZustand(roh: unknown): Plain` läuft rekursiv über das rohe Objekt und
vergleicht mit `DEFAULT_STATE`:

- Unbekannte Schlüssel fallen weg (Vorwärtskompatibilität, Prototyp-Schutz bleibt
  über `GEFAEHRLICHE_SCHLUESSEL`).
- Der Typ muss zum Standardwert passen (`typeof`); Zahlen müssen endlich sein
  (`Number.isFinite`).
- `camera.freezeJd` und `scale.preset` dürfen `null` sein; `scale.preset` muss sonst
  ein Schlüssel von `SCALE_PRESETS` sein.
- Aufzählungen: `camera.mode` ∈ `{'free','attached','follow','cinema'}`,
  `quality.tier` ∈ `{'auto','low','medium','high'}`, `ui.language` ∈ `{'de','en'}`.
- `camera.targetId` muss ein Schlüssel von `bodyIndex` (`data/index.ts`) sein.
- `visible` und `ui.panels` sind Records mit ausschließlich booleschen Werten;
  Einträge mit anderem Wert fallen weg.
- **Feldweise** verwerfen: ein ungültiges Feld entfernt nur dieses Feld, der übrige
  Patch bleibt. So liefert ein Link aus einer älteren Version noch das Gültige.

`decodeState` ruft den Prüfer nach dem JSON-Parsen auf; `fromShareable` bleibt
ungeprüft (interner Aufruf mit bereits geprüften Patches). Damit ist der Pflichtpunkt
Sprache erfüllt: `decodeState` mit `ui.language: 'fr'` ergibt `'de'`.

### 3.3 Ablageformat

| Schlüssel in `localStorage` | Inhalt |
|---|---|
| `orrery.sitzung.v1` | JSON des Diff-Objekts, Profil `sitzung` |
| `orrery.sitzungMerken` | `'0'` = aus; fehlend oder anderer Wert = an |
| `orrery.ansichten.v1` | JSON `{ name: string; state: Plain }[]`, Profil `ansicht` |

Export-Datei: `{ format: 'orrery-ansichten', version: 1, ansichten: [...] }`,
Dateiname `orrery-ansichten.json`. Das URL-Fragment bleibt `#p=<base64url>` ohne
eigene Versionsnummer; das tolerante Lesen übernimmt die Migration. Ein späterer
Formatbruch bekommt ein neues Suffix (`.v2`) und liest `.v1` einmalig mit.

### 3.4 Speicherfunktionen

Alle nehmen `Storage` als ersten Parameter, sind synchron und werfen nie:

```ts
sitzungLesen(storage): Plain | null
sitzungSchreiben(storage, patch): boolean
sitzungLoeschen(storage): void
sitzungMerkenLesen(storage): boolean
sitzungMerkenSchreiben(storage, an): void
ansichtenLesen(storage): Ansicht[]
ansichtenSchreiben(storage, liste): boolean
ansichtenExportieren(liste): string           // JSON mit Umschlag
ansichtenImportieren(text, vorhandene): { liste: Ansicht[]; fehler: string | null }
```

Fehlender oder gesperrter `localStorage`, `QuotaExceededError`, beschädigtes JSON:
Lesen ergibt `null` bzw. `[]`, Schreiben ergibt `false`, nichts wird gelöscht.
`sitzungLesen` und `ansichtenLesen` schicken jeden gelesenen Zustand durch
`pruefeZustand`, genau wie `decodeState`; ein Eintrag ohne gültigen Namen fällt weg.
Beim Import werden Umschlag und jede Ansicht geprüft (`name` nichtleerer String,
`state` durch den Prüfer); Namenskonflikte mit vorhandenen Ansichten bekommen ein
Suffix „ (2)", „ (3)" usw.

## 4. Abläufe (`app/persistenz.ts`)

### 4.1 Start

Vor `createRoot` in `main.tsx`, als `startZustand(location, storage, navigatorLanguage)`:

1. Enthält `location.hash` ein `p=…`, wird es mit `decodeState` dekodiert (der Prüfer
   ist darin enthalten) und per `history.replaceState` aus der Adresse entfernt. Ein
   späteres Neuladen nimmt dann die gesicherte Sitzung, nicht immer wieder den
   alten Link.
2. Sonst, falls „Sitzung merken" an ist: `sitzungLesen`, geprüft.
3. Sprache: `startSprache(navigatorLanguage, patch.ui?.language ?? null)`. Der Patch
   überschreibt nur, wenn er die Sprache wirklich enthält; sonst entscheidet wie
   bisher der Browser.
4. `replaceAll(fromShareable(patch))` mit der ermittelten Sprache in `ui.language`.
   Ohne Patch bleibt es beim Standard wie bisher.

Reihenfolge damit: Fragment vor Sitzung vor Standard; Sprache: Fragment vor
Sitzung vor Browsersprache.

### 4.2 Sichern

`sicherungStarten(store, storage, window)` abonniert `useStore.subscribe`; jede
Änderung startet einen 1-s-Timer, dessen Ablauf `sitzungSchreiben` mit Profil
`sitzung` aufruft. `pagehide` schreibt sofort und bricht den Timer ab. Ist „merken"
aus, wird nichts geschrieben. Die Präferenz lebt außerhalb des Stores im Hook
`useSitzungMerken` (`ui/`): liest `sitzungMerkenLesen` einmal beim Mount, schreibt
bei Änderung und ruft beim Ausschalten `sitzungLoeschen`. Damit die Sicherung die
Präferenz kennt, ohne den Store zu bemühen, liest `sicherungStarten` sie bei jedem
Schreibversuch erneut aus `storage` (ein Zugriff pro Sekunde ist vernachlässigbar).

Nachtrag 14.09.2026: `sitzungSchreiben` trägt `ui.language` immer in den
gesicherten Patch ein, auch wenn sie dem Standard `'de'` entspricht. Grund:
Der Patch enthält laut §3.1 nur Abweichungen vom Standard; ein Nutzer mit
englischsprachigem Browser, der bewusst Deutsch wählt, hätte sonst eine
Sitzung ohne `ui.language`, und `startSprache` griffe beim nächsten Start
wieder auf `navigator.language` zurück — die gewählte Sprache ginge verloren.

### 4.3 Link kopieren

`linkErzeugen(state, location): string` liefert Ursprung, Pfad und das Fragment
`#p=` mit `encodeState` im Profil `link`. Die Kopfzeile ruft
`navigator.clipboard.writeText(link)`; bei Erfolg erscheint zwei Sekunden lang
„Kopiert". Schlägt die Zwischenablage fehl oder fehlt sie, setzt die Kopfzeile das
Fragment per `history.replaceState` in die Adresszeile und meldet „Adresse in der
Adresszeile kopieren". In diesem Fall bleibt das Fragment bis zum nächsten Start
stehen und wird dort wie in 4.1 verbraucht.

### 4.4 Zurücksetzen

`zuruecksetzen(store)`: `replaceAll` mit `DEFAULT_STATE`, dabei `ui.language` und
`quality.tier` aus dem aktuellen Zustand übernommen. Kein Bestätigungsdialog: die
Sitzung wird ohnehin laufend überschrieben, und nichts Benanntes geht verloren.
Bekannte Unschärfe: Ein laufender Maßstabs-Übergang (`tweenScale`, 700 ms) kann nach
dem Zurücksetzen noch nachschreiben; hingenommen, im Abnahmeprotokoll vermerkt.

### 4.5 Ansicht laden

`ansichtAnwenden(store, ansicht)`: `replaceAll(fromShareable(merge(aktuell, ansicht.state)))`
mit `aktuell = toShareable(store.getState())`. Zeitpunkt, Pausenzustand, Kino,
Qualität und Oberfläche bleiben also erhalten; Maßstab, Darstellung, Kamera,
Sichtbarkeit und Zeitrate kommen aus der Ansicht. Felder, die die Ansicht nicht
enthält, fallen dabei **nicht** auf den Standard zurück, sondern bleiben wie sie sind;
das entspricht „Einstellungen mitnehmen", nicht „Zustand ersetzen".

## 5. Oberfläche und Texte

### 5.1 Kopfzeile

Links vom Sprachschalter zwei Textschaltflächen „Link kopieren" und „Zurücksetzen"
in derselben Optik wie die Sprachknöpfe. Die Rückmeldung nach dem Kopieren steht
als Text mit `role="status"` in der Kopfzeile (Screenreader sagen sie an) und
verschwindet nach zwei Sekunden. Bei schmalen Fenstern brechen die Knöpfe um
(`flex-wrap`), nichts wird abgeschnitten. Keine neuen Tastenkürzel; die Kürzelhilfe
bleibt unverändert.

### 5.2 Darstellungspanel

Unten eine Checkbox „Sitzung merken", gespeist aus `useSitzungMerken`.

### 5.3 Panel „Ansichten" (Etappe 2)

Kennung `views`, Position unter dem Darstellungspanel, Ein-/Ausklappen über
`ui.panels` wie bei allen Panels.

- Oben ein Namensfeld mit Schaltfläche „Speichern". Existiert der Name bereits,
  heißt die Schaltfläche „Überschreiben"; ein Dialog entfällt. Leerer Name: Knopf
  deaktiviert.
- Liste der Ansichten: Der Name ist die Lade-Schaltfläche. Daneben „Umbenennen"
  (schaltet die Zeile in ein Eingabefeld, Enter bestätigt, Escape bricht ab, ein
  bereits vergebener Name wird abgelehnt und im Feld markiert) und „Löschen" (ohne
  Rückfrage; die Zeile zeigt fünf Sekunden lang „Rückgängig", danach ist der Eintrag
  endgültig fort).
- Unten „Exportieren" (JSON per Blob-URL und `a[download]`) und „Importieren"
  (verstecktes `input[type=file]`, `accept=".json,application/json"`). Fehler beim
  Import erscheinen als Text unter den Schaltflächen und verschwinden beim nächsten
  erfolgreichen Vorgang.
- Leerzustand: „Noch keine Ansichten gespeichert."

Die Liste lebt als React-Zustand im Panel und wird bei jeder Änderung mit
`ansichtenSchreiben` gesichert; sie geht nicht durch den Store, weil sie nicht Teil
der Ansicht ist und nicht im Link mitreisen darf.

### 5.4 Texte

Alle neuen Beschriftungen in `ui/i18n/de.ts` und `ui/i18n/en.ts`; der bestehende
Schlüsselgleichheitstest sichert die Vollständigkeit. Englisch: „Copy link",
„Copied", „Copy the address from the address bar", „Reset", „Remember session",
„Views", „Save", „Overwrite", „Rename", „Delete", „Undo", „Export", „Import",
„No views saved yet.", „Name already in use", „File is not a views export".

## 6. Fehlerbehandlung

| Fall | Verhalten |
|---|---|
| `localStorage` fehlt, gesperrt, voll | Schreiben schlägt still fehl (`false`), Anwendung läuft weiter, Checkbox bleibt bedienbar. |
| Beschädigtes JSON in Sitzung oder Ansichten | Eintrag wird ignoriert, nicht gelöscht. |
| Ungültiges Fragment | Standardzustand (wie heute), Fragment wird trotzdem entfernt. |
| Fragment mit einzelnen ungültigen Feldern | Nur diese Felder fallen weg. |
| Import: falscher Umschlag, kein gültiger Eintrag | Meldung im Panel, nichts übernommen. |
| Import: teilweise gültig | Gültige Einträge übernommen, Meldung nennt die Zahl der verworfenen. |
| Zwischenablage nicht verfügbar | Rückfall über die Adresszeile (§4.3). |

Alle Speicherzugriffe sitzen in `store/persist.ts` hinter `try/catch`, nirgends
sonst. Die Schichtung bleibt: `ui/` ruft `store/persist.ts` und die Hooks, `app/`
verdrahtet, `render/` und `sim/` sind unberührt.

## 7. Tests

Vitest, ohne Browser:

- `store/persist.test.ts`: Profile streichen genau die genannten Pfade und lassen
  keine leeren Zweige zurück; `pruefeZustand` verwirft falsche Typen, `NaN`,
  `Infinity`, unbekannte Schlüssel, ungültige Sprache, Kameramodus, Qualitätsstufe,
  Maßstabs-Preset und Körperkennung jeweils feldweise und lässt `null` bei
  `freezeJd` und `scale.preset` zu; Round-Trip je Profil; Speicherfunktionen mit
  einem `Storage`-Fake, auch mit werfendem Fake und `QuotaExceededError`;
  Import-Umschlag, teilweise gültige Datei, Namenskonflikte mit Suffix.
- `store/serialize.test.ts`: Pflichtpunkt `ui.language: 'fr'` ergibt `'de'`; Fragment
  mit `__proto__` bleibt abgewehrt.
- `app/persistenz.test.ts`: Startreihenfolge Fragment vor Sitzung vor Standard mit
  Fake-`location` und Fake-`history`; Fragment wird entfernt; Sprachwahl aus Patch
  oder Browser; Entprellung mit `vi.useFakeTimers`; `pagehide` schreibt sofort;
  „merken aus" schreibt nicht; Zurücksetzen behält Sprache und Qualität; Ansicht
  laden lässt Zeit, Kino, Qualität und Oberfläche unberührt.
- Komponententests: Kopfzeile kopiert und meldet „Kopiert", Rückfall bei fehlender
  Zwischenablage; Checkbox schreibt die Präferenz und löscht beim Ausschalten;
  Ansichten-Panel speichern, überschreiben, laden, umbenennen (inkl. Ablehnung
  doppelter Namen), löschen mit Rückgängig, leerer Zustand, Import-Fehlermeldung.
- `render/schichten.test.ts` und `i18n.test.ts` bleiben grün.

## 8. Abnahme (Sichtprüfung)

Playwright gegen den laufenden Entwicklungsserver:

1. Zustand über `window.store` ändern (Maßstab, Kamera, Sichtbarkeit, Sprache), eine
   Sekunde warten, neu laden, `getState()` vergleichen: identisch bis auf die
   laufende Uhr.
2. „Link kopieren" mit erteilter Zwischenablage-Berechtigung, Link in neuem Tab
   öffnen, Zustand vergleichen; die Adresszeile des neuen Tabs ist danach ohne
   Fragment; `quality.tier` des neuen Tabs ist `auto`, nicht der Wert des Absenders.
3. „Sitzung merken" aus, Zustand ändern, neu laden: Standard.
4. Zurücksetzen mit Englisch und `tier: 'high'`: beides bleibt, alles andere Standard.
5. Screenshot der Kopfzeile bei 400 px Fensterbreite: Knöpfe umgebrochen, nichts
   abgeschnitten (Pixelprüfung: keine Elementkante außerhalb des Viewports).
6. Etappe 2: Ansicht speichern, Zustand ändern, Ansicht laden, vergleichen; Export
   herunterladen, Ansichten löschen, Datei importieren, Liste vergleichen.

Protokolle: `docs/phase4b-etappe1-abnahme.md`, `docs/phase4b-etappe2-abnahme.md`.
Tag `v0.4.0` erst nach Abschluss von 4c.

## 9. Nicht-Ziele

- Keine laufend gespiegelte Adresszeile, keine Kurzlinks, kein Server.
- Keine Sortierung, Ordner, Vorschaubilder oder Tastenkürzel für Ansichten.
- Keine Migration alter Formate (es gibt noch keine).
- Kein Teilen einzelner Ansichten als Link; dafür genügt Laden und dann „Link
  kopieren".
- Keine Synchronisation zwischen Tabs (`storage`-Ereignis); der zuletzt geschlossene
  Tab gewinnt.
