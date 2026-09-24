# Abnahme Phase 5 Etappe 3 (Texturen und Laden)

## 1. Umfang

Branch `phase5-3` (von `master`, nach dem Plan-Commit `1e1274c`, nicht gepusht). Entwurf
`docs/superpowers/specs/2026-09-23-phase5-design.md` §5 (Etappe 5-3: Stufen, Format und
Werkzeugkette, Albedo-Faktor, Nachladen, Auslieferung, Probe und Messungen), Plan
`docs/superpowers/plans/2026-09-24-phase5-etappe3-texturen.md`. Umsetzung:

- `932e15c` — Helfer für Stufen und Mittel, Werkzeugordner ignoriert (Task 1): KTX-Software
  4.4.2 von Khronos bereitgestellt, `scripts/textur-stufe.py` (verkleinern, spiegeln,
  Mittel messen, vergleichen), erste Probe an Erde und Mond (§5.6)
- `a1618bf` — Vergleich bringt beide Bilder je Kante auf die kleinere Größe (Fixrunde 1 zu
  Task 1, ein Prüfbefund am Vergleichshelfer)
- `a4322de` — Plan-Commit mit der Entscheidung von Jens nach der erweiterten Probe:
  gemischte Kodierung und angehobene Ladeziele (§5.6, siehe §3 unten)
- `0b420e5` — Stufen als KTX2 mit Bauskript und Datenliste (Task 2): `scripts/texturen-bauen.ts`,
  `scripts/texturen-quellen.json`, die 47 KTX2-Stufen und die versionierten JPEG-Quellen unter
  `assets-quellen/texturen/`, `src/data/texturen.ts` (§5.2, §5.3)
- `40d58cc` — KTX2-Stufen zur Laufzeit, Mittel aus der Datenliste (Task 3): `KTX2Loader`,
  Basis-Transcoder unter `public/basis/`, `setzeTextur`/`texturBreite` in `render/bodies.ts`,
  `appearance.textures` entfernt, die alten JPEGs unter `public/textures/` gelöscht, `.htaccess`
  ergänzt (§5.2, §5.3, §5.5)
- `6508380` — Nachladen nach dargestelltem Durchmesser bis zur Höchststufe (Task 4):
  `render/texturen.ts` mit `benoetigteStufe`, Obergrenze je Qualitätsstufe, Warteschlange,
  Anbindung in `render/scene.ts` (§5.4)
- `63edc93` — Nachladen beginnt erst nach den Startladungen (Korrektur nach Task 5, §5.4):
  behebt die einzige verfehlte Messung (siehe §4)

Damit liegen alle Albedokarten als KTX2-Stufen vor (1k für alle 29 Körper, 2k zusätzlich für
zehn, 4k für drei, 8k für fünf), geladen wird zuerst die 1k-Stufe, danach lädt die Anwendung
nach dargestelltem Durchmesser höhere Stufen nach, begrenzt durch Qualitätsstufe und
Grafikkarte. Task 5 (Messung) und dieser Task (`ASSETS.md`, Abnahme) ändern daran nichts mehr.

## 2. Lint, Tests, Build

Auf `63edc93` (24.09.2026, eigener Lauf für diese Abnahme):

- `npm run lint`: `eslint .` ohne Befund.
- `npm test`:

  ```
  Test Files  110 passed (110)
       Tests  5232 passed (5232)
  ```

  Stand vor der Etappe 5192 (Ende Etappe 5-2). Herleitung laut Ledger: 5205 nach Task 1/2
  (Bauskript und Datenliste), 5214 nach Task 3 (KTX2 zur Laufzeit), 5231 nach Task 4
  (Nachladen), 5232 nach der Korrektur zu Task 5 (ein zusätzlicher Test für das Warten auf
  die Startladungen).
- `npm run build` (`tsc -b && vite build`): 541 Module, `✓ built in 1,28s`, Hauptchunk
  `index-BHleyTL2.js` **1 523,05 kB** (gzip 421,62 kB), nur der bekannte Hinweis zu
  Chunkgrößen über 500 kB. Stand vor der Etappe **1 458,08 kB** (Ende Etappe 5-2), Grenze
  **1 503,78 kB** (Entwurf §8.3) — Task 3 (Anbindung von `KTX2Loader` und dem
  Basis-Transcoder) überschritt sie mit 1 521,79 kB um 18,01 kB. Jens hat die Überschreitung
  am 24.09.2026 zugelassen: Der Lader bleibt im Hauptchunk (kein dynamischer Import), die
  Grenze gilt damit als angehoben, die nächste Frage erst ab 1 571,79 kB (+50 kB). Der
  aktuelle Stand 1 523,05 kB liegt rund 48,74 kB unter dieser neuen Schwelle.
- Wort- und Trailerprüfung der lokalen Projektanleitung für alle Commits und neuen Dateien
  dieser Etappe: Ergebnis 0.
- Schlussprüfung: ohne kritische Befunde; ein wichtiger Befund (fehlende Freigabe von Lader und
  spät eintreffenden Ladungen beim Abbau) und mehrere kleine Punkte als „Bekannte Unschärfen“ in
  §7 ergänzt, Branch bereit zum Fast-Forward. Nacharbeit (Commit `257750a`, siehe §7/§8): der
  wichtige Befund und zwei der kleinen (Konstante, Kommentare ohne Ziel) sind behoben. Stand
  danach: **5235 Tests**, Hauptchunk **1 523,15 kB** (vorher 1 523,05 kB).

## 3. Probe und Kodierung, Stufen und Größen

### 3.1 Erste Probe (Task 1, Erde und Mond)

ETC1S mit `--clevel 2 --qlevel 255` gegen UASTC mit `--uastc-quality 2 --zstd 18`, jeweils
`--format R8G8B8_SRGB --generate-mipmap`, Abweichung gegen das gespiegelte Eingangs-PNG:

| Datei | Kodierung | Größe (Bytes) | Abweichung | Mittel (Rückwandlung) |
|---|---|---:|---:|---:|
| erde-8192 | ETC1S | 2 770 483 | 3,2 | 0,1378 |
| erde-8192 | UASTC | 14 925 118 | 0,32 | 0,1336 |
| erde-2048 | ETC1S | 252 839 | 2,768 | 0,1333 |
| erde-2048 | UASTC | 1 168 719 | 0,519 | 0,1339 |
| mond-2048 | ETC1S | 484 165 | 5,667 | 0,3128 |
| mond-2048 | UASTC | 2 443 814 | 0,794 | 0,3124 |

ETC1S verfehlte am Mond das Ziel „höchstens 2 von 255“ (5,667), UASTC hielt die Bildtreue in
allen sechs Fällen, sprengte aber mit dieser Kodierung die ursprüngliche 1k-Summen-Zielgröße
von 1,5 MB deutlich (Hochrechnung 8,47–13,91 MB, je nach Rechenweg). Lage und Mittel der
8k-Erde bestätigten sich gegen die Fixture 0,1339 (Abweichung höchstens 0,0039).

### 3.2 Erweiterte Probe (auf Anfrage, 1k-Summe zu hoch)

Vier weitere Varianten an Erde (1k/2k), Mond (1k/2k) und Io (1k), alle `--format
R8G8B8_SRGB --generate-mipmap`: A ETC1S mit `--clevel 5 --qlevel 255 --max-endpoints 16128
--max-selectors 16128`; B/C/D UASTC mit `--uastc-quality 2 --uastc-rdo` und
`--uastc-rdo-l` 1,0/3,0/5,0 sowie `--zstd 18`:

| Datei | Variante | Größe (Bytes) | Abweichung Mittel | Abweichung P95 |
|---|---|---:|---:|---:|
| erde-1024 | A | 94 747 | 3,14 | 10,0 |
| erde-1024 | B | 296 867 | 0,755 | 4,0 |
| erde-1024 | C | 269 311 | 1,17 | 5,0 |
| erde-1024 | D | 250 572 | 1,571 | 8,0 |
| erde-2048 | A | 234 594 | 2,838 | 9,0 |
| erde-2048 | B | 1 053 533 | 0,655 | 3,0 |
| erde-2048 | C | 938 763 | 1,024 | 5,0 |
| erde-2048 | D | 869 652 | 1,342 | 7,0 |
| mond-1024 | A | 148 438 | 4,45 | 12,0 |
| mond-1024 | B | 615 231 | 0,961 | 3,0 |
| mond-1024 | C | 565 967 | 1,9 | 7,0 |
| mond-1024 | D | 507 272 | 3,277 | 13,0 |
| mond-2048 | A | 454 445 | 5,729 | 16,0 |
| mond-2048 | B | 2 389 311 | 0,926 | 3,0 |
| mond-2048 | C | 2 223 449 | 1,705 | 7,0 |
| mond-2048 | D | 2 027 638 | 2,885 | 12,0 |
| io-1024 | A | 144 284 | 2,842 | 8,0 |
| io-1024 | B | 525 141 | 1,168 | 3,0 |
| io-1024 | C | 450 613 | 1,947 | 6,0 |
| io-1024 | D | 414 919 | 2,471 | 8,0 |

### 3.3 Entscheidung (Jens, 24.09.2026)

Kodierung gemischt: die 1k-Stufe ETC1S (Variante A), ab 2048 UASTC mit RDO λ=1,0
(Variante B), jeweils `--format R8G8B8_SRGB --generate-mipmap`. Begründung aus den
Messwerten: Das Design-Ziel „höchstens 2 von 255“ gilt nur für die 2k-Stufe im
Bildvergleich (§5.6) — dort verfehlt ETC1S (Variante A) es an beiden Körpern (Erde 2,838,
Mond 5,729), während UASTC es bei jeder RDO-Stärke einhält (B: 0,655/0,926, C: 1,024/1,705).
Auf der 1k-Stufe, für die keine Bildtreuegrenze gilt, bleibt ETC1S deutlich kleiner als UASTC
(Erde 94 747 gegen 296 867 Bytes) und senkt die Startlast. Variante B statt der stärkeren
RDO-Stufen C/D, weil D an Mond-2048 mit 2,885 die 2k-Grenze selbst gerissen hätte und C bereits
merklich mehr Bildabweichung bei nur mäßig kleinerem Ergebnis kostet.

Auch mit dieser Kombination erreichte keine Variante die ursprünglichen Design-Ziele; Jens hob
sie deshalb an:

| Ziel | Entwurf §5.6 | Angehoben (24.09.2026) |
|---|---:|---:|
| 1k-Stufen aller Körper zusammen | 1 500 000 Bytes | 4 000 000 Bytes |
| Alle Körper unter „Fast 4G“ texturiert nach spätestens | 3 000 ms | 5 000 ms |

### 3.4 Stufen und Größen (Task 2)

47 Stufen gebaut (5 Körper × 3 Stufen + 3 Körper × 3 Stufen + 2 Körper × 2 Stufen + 19 Körper ×
1 Stufe), Summe aller KTX2-Größen **177 914 750 Bytes** (rund 169,7 MiB). Die 1k-Stufen aller
29 Körper zusammen **3 567 420 Bytes** — unter dem angehobenen Ziel 4 000 000 Bytes, Reserve
432 580 Bytes.

Repositoryzuwachs dieser Etappe rund **170 MiB** (`public/textures` allein 170 MiB, dazu 8,5 MB
neue JPEG-Quellen unter `assets-quellen/texturen/`, abzüglich der gelöschten alten JPEGs unter
`public/textures/`). Größte Einzeldateien sind die 8k-Stufen von Mond (36 531 028 Bytes, rund
34,8 MiB), Merkur (33 563 967 Bytes, rund 32,0 MiB), Venus (33 228 693 Bytes, rund 31,7 MiB)
und Mars (27 528 890 Bytes, rund 26,3 MiB); die 8k-Stufe der Erde bleibt mit 12 990 043 Bytes
deutlich kleiner (weniger feine, schlecht komprimierbare Strukturen als bei den anderen vier
Körpern).

Beleg (Nacharbeit, per `git ls-tree -r -l <rev> -- public/textures assets-quellen/texturen`):
vor der Etappe (`1e1274c`) 30 Dateien / 8 782 272 Bytes, danach (`db37710`) 77 Dateien /
186 697 022 Bytes — Differenz 177 914 750 Bytes (169,68 MiB), deckungsgleich mit der
KTX2-Summe oben (die verschobenen JPEG-Quellen ändern die Baumgröße per Saldo nicht, nur den
Pfad). Dieselbe Abfrage bestätigt die vier größten Einzeldateien mit exakt den oben genannten
Bytezahlen.

## 4. Messungen

Aufbau (Task 5): Fenster 1400 × 900 CSS-Pixel, `devicePixelRatio` 1, Playwright-gebündelter
Chromium 153.0.8010.53, `localStorage.clear()` vor jeder Messreihe.

| Messung | Soll | Ist | erfüllt |
|---|---|---|---|
| Bildvergleich 2k gegen altes JPEG, Erde (Mittel) | ≤ 2,0/255 | 0,675 | ja |
| Bildvergleich 2k gegen altes JPEG, Mond (Mittel) | ≤ 2,0/255 | 0,540 | ja |
| Bildvergleich 2k gegen altes JPEG, Jupiter (Mittel) | ≤ 2,0/255 | 0,965 | ja |
| 1k-Summe aller Körper | < 4 000 000 Bytes | 3 567 420 Bytes | ja |
| Ladezeit ungedrosselt (informativ) | — | 239,7 ms (Median) | — |
| Ladezeit „Fast 4G“, vor der Korrektur | ≤ 5 000 ms | 5 208,3 ms (Median) | **nein** |
| Ladezeit „Fast 4G“, nach der Korrektur (`63edc93`) | ≤ 5 000 ms | 4 543,6 ms (Median) | ja |
| Zeit bis 8k-Erde, ungedrosselt (informativ) | — | 4 055,9 ms | — |
| Zeit bis 8k-Erde, „Fast 4G“ (informativ) | — | 13 834,3 ms | — |
| Ausreißer beim Tausch, ungedrosselt | ≤ 100 ms | 18,9 ms | ja |
| Ausreißer beim Tausch, „Fast 4G“ | ≤ 100 ms | 35,4 ms | ja |

### 4.1 „Fast 4G“ verfehlt und Korrektur

Die erste Messung verfehlte das Ziel um 208,3 ms (+4,2 %), alle drei Wiederholungen lagen über
5 000 ms (5 186–5 224 ms), keine Ausreißerstreuung. Ursache: Beim Kaltstart forderte das
Nachladen für das Kameraziel (im Kaltstart die Sonne, unter dem Standardmaßstab „schaubild“
schon groß genug im Bild) eine breitere Stufe an, noch während die 29 Startladungen liefen —
statt 3,57 MB (29 × 1k) mussten so 5,14 MB übertragen werden, bevor alle Körper ihre erste
Stufe hatten. Korrektur (`63edc93`): Das Nachladen wartet jetzt, bis alle Startladungen
abgeschlossen sind (erfüllt oder gescheitert), bevor es zum ersten Mal prüft. Danach Median
4 543,6 ms (4 503,8 / 4 581,6 / 4 543,6 ms, Reserve 456,4 ms), eine unabhängige
Kontrollmessung kurz zuvor ergab 4 610,5 ms (im normalen Streubereich); die KTX2-Anfragen bis
„alle texturiert“ sanken von 30 auf durchgehend 29 je Lauf.

Verwendete Drosselwerte für „Fast 4G“ (per CDP `Network.emulateNetworkConditions`): Latenz
165 ms, Downloadrate 1 012 500 B/s, Uploadrate 168 750 B/s (aus dem Plan übernommen). Ein
Abgleich mit der DevTools-Voreinstellung der laufenden Chromium-Version war über reine
CDP-Automatisierung nicht möglich — keine Protokollmethode liefert die dort hinterlegten Werte,
und das Öffnen der echten DevTools-Oberfläche war mit den verfügbaren Werkzeugen nicht
zuverlässig herstellbar.

### 4.2 Sichtkontrolle (Task 3) und Sichtprobe (Task 4)

**Task 3, Lage- und Bildkontrolle:** Kamera `attached`/Erde, Maßstab `realistisch`, Scheibe
295 px Durchmesser (Ziel rund 300 px), Maske 84 609 Pixel (Helligkeit über 8). Abweichung
zwischen der KTX2-1k-Stufe (A) und dem alten JPEG (B) **3,860** (Grenze 4, unterschritten);
Abweichung von B senkrecht um den Scheibenmittelpunkt gespiegelt gegen A **59,028** — deutlich
größer, die Lage (KTX2 kennt kein `flipY`, die Karten werden beim Kodieren gespiegelt)
bestätigt sich damit als korrekt.

**Task 4, Sichtprobe:** `quality.tier` auf `high`, 3 s gewartet — alle 29 Körper zeigten
`texturStand()` 1024. Danach Kamera auf die Erde (`distance 6500` km, Scheibe größer als das
Fenster), erneut 3 s gewartet — `texturStand().earth === 8192`, alle übrigen 28 Körper
unverändert bei 1024 (kein Übergriff des Nachladens auf Körper außerhalb des Kamerawegs).
Konsole seit dem Navigieren: 0 Fehler, 1 Warnung (`THREE.KTX2Loader: Multiple active KTX2
loaders`, durch Reacts StrictMode-Doppelmontage im DEV-Build verursacht, siehe §7).

## 5. Texte

`grep -rn -E "albedo\.jpg|2048|4096|8192|Pixel|JPEG" src/data/texte` und Einzelprüfung jeder
Fundstelle (Task 5) ergab zehn Aussagen, die durch die Stufen bzw. die neuen Pfade falsch
werden. Fachgeprüfte Texte wurden dabei nicht geändert (siehe §8):

| Datei | Zeile | Aussage | Neuer Stand |
|---|---:|---|---|
| `src/data/texte/de/hochschule/objekt-ceres.md` | 265 | Pfad `textures/ceres/albedo.jpg` | Liegt jetzt als `public/textures/ceres/albedo-1024.ktx2`; die JPEG-Quelle steht unter `assets-quellen/texturen/ceres/albedo.jpg`. |
| `src/data/texte/en/hochschule/objekt-ceres.md` | 256 | dito (EN) | dito |
| `src/data/texte/de/hochschule/objekt-charon.md` | 236 | Pfad `textures/charon/albedo.jpg` | `public/textures/charon/albedo-1024.ktx2`, Quelle `assets-quellen/texturen/charon/albedo.jpg`. |
| `src/data/texte/en/hochschule/objekt-charon.md` | 224 | dito (EN) | dito |
| `src/data/texte/de/hochschule/objekt-haumea.md` | 213 | Pfad `textures/haumea/albedo.jpg` | `public/textures/haumea/albedo-1024.ktx2`, Quelle `assets-quellen/texturen/haumea/albedo.jpg`. |
| `src/data/texte/en/hochschule/objekt-haumea.md` | 199 | dito (EN) | dito |
| `src/data/texte/de/hochschule/szene-erdaufgang.md` | 83 | Pfad `public/textures/earth/albedo.jpg` als „die einzige Erdtextur“ | Jetzt Stufen `public/textures/earth/albedo-{1024,2048,8192}.ktx2`; die JPEG-Quelle liegt unter `assets-quellen/texturen/earth/albedo.jpg`. |
| `src/data/texte/en/hochschule/szene-erdaufgang.md` | 83 | dito (EN) | dito |
| `src/data/texte/de/hochschule/objekt-sun.md` | 378 | „Die künstlerische Karte hat am Äquator 2134 km je Pixel“ (feste Auflösung) | Gilt nur für die 2048er-Stufe; die Sonne lädt inzwischen bedarfsweise 1024/2048/4096 nach (4269 / 2134 / 1067 km je Pixel). |
| `src/data/texte/en/hochschule/objekt-sun.md` | 362 | dito (EN) | dito — Fund außerhalb des wörtlichen Grep-Musters (Kleinschreibung „pixel“), der Vollständigkeit halber mitgenommen. |

Geprüft und nicht betroffen: `szene-ringdurchflug.md` (DE/EN, „62 122 km auf 2048 Pixel“)
bezieht sich auf die unveränderte Saturn-Ringtextur (eigener Lader, `render/rings.ts`);
`szene-systemblick.md` (DE/EN, „2,11 Bildpunkte Radius“) betrifft die bildschirmpixelbasierte
Marker-/Label-Schwelle, unabhängig von der geladenen Texturstufe.

## 6. Rulings

- **Ruling:** Umsetzer, Prüfer und Schlussprüfer laufen auf sonnet (lokale Projektanleitung:
  möglichst kleine Modelle) — kostet ggf. übersehene Feinheiten in der Schlussprüfung.
- **Ruling** (Task 1, erste Probe, später ersetzt): Kodierung UASTC mit `--format
  R8G8B8_SRGB --encode uastc --uastc-quality 2 --zstd 18 --generate-mipmap` — Abweichung
  Erde-2k 0,519 und Mond-2k 0,794 (beide ≤ 2,0, ETC1S hätte 2,768 bzw. 5,667 gehabt und damit
  die Regel nicht erfüllt), Mittel 8k-Erde weicht nur 0,0003 von der Fixture 0,1339 ab. UASTC
  hält die Bildtreue, sprengt aber die 1k-Summen-Zielgröße von 1,5 MB um das ≈5,6- bis
  9,3-fache — als Frage an Jens für die Abnahme vermerkt, keine Blockade des Tasks. Durch die
  Entscheidung von Jens (siehe unten) ersetzt.
- **Ruling:** `min(a.size, b.size)` aus dem Plantext wird korrigiert zu
  `(min(Breiten), min(Höhen))` — der Plan verlangt „beide Bilder auf die kleinere Größe“, der
  Code verfehlte das bei ungleichem Seitenverhältnis — kostet nichts.
- **Ruling:** Re-Review der Fixrunde 1 direkt am Diff (eine Zeile plus Kommentar) statt durch
  einen eigenen Prüfer — kostet nichts, falls eine Feinheit übersehen ist, fängt sie die
  Schlussprüfung.
- **Entscheidung Jens (24.09.2026):** Kodierung gemischt — 1k-Stufe ETC1S (Variante A:
  `--encode basis-lz --clevel 5 --qlevel 255 --max-endpoints 16128 --max-selectors 16128`), ab
  2048 UASTC (Variante B: `--encode uastc --uastc-quality 2 --uastc-rdo --uastc-rdo-l 1.0
  --zstd 18`), je `--format R8G8B8_SRGB --generate-mipmap`. Ziele angehoben: 1k-Summe unter
  4 000 000 Bytes, unter „Fast 4G“ alle Körper spätestens 5 s texturiert. Begründung und
  Messwerte in §3.
- **Ruling:** UASTC-Variante B (RDO λ=1) statt reinem UASTC der ersten Probe — rund 10 %
  kleiner (Erde 2k 1 053 533 statt 1 168 719 Bytes) bei Abweichung 0,66 statt 0,52, beides weit
  unter 2 — kostet wenig Bildtreue.
- **Entscheidung Jens (24.09.2026):** `KTX2Loader` bleibt im Hauptchunk (1 521,79 kB); die
  Grenze gilt damit als angehoben, die nächste Frage erst ab 1 571,79 kB (+50 kB). Begründung
  und Zahlen in §2.
- **Ruling:** Das Nachladen wartet, bis alle Startladungen abgeschlossen sind (erfüllt oder
  gescheitert) — Ursache der „Fast 4G“-Verfehlung war eine 2k-Nachladung des Kameraziels,
  die während des Starts Bandbreite nahm (5,14 MB statt 3,57 MB); entspricht Entwurf §5.4
  „Start … danach Nachladen“ — kostet, falls falsch, einige hundert ms bis zur ersten
  Detailstufe des Kameraziels. Messnachweis in §4.

Rulings des Plans (Global Constraints):

- Die Stufen bis 2048 entstehen aus den heutigen, fachgeprüften JPEGs (jetzt unter
  `assets-quellen/`), nur die Höchststufen 4096/8192 aus den neuen Quellen — so bleiben
  Mittel und Bildvergleich an den bisherigen Karten verankert; das Bauskript bricht ab, wenn
  eine Höchststufe im Mittel mehr als 0,005 abweicht.
- Alle Stufen eines Körpers verwenden für den Albedo-Faktor das Mittel der 1k-Stufe, damit der
  Tausch die Helligkeit nicht verschiebt; die Datenliste führt das Mittel trotzdem je Stufe,
  damit der Test jede Stufe prüfen kann.
- Das Feld `appearance.textures` entfällt ganz (nicht nur `albedo`), weil `normal`, `specular`
  und `emissive` nirgends belegt sind (Entwurf §9: keine Normal- und Nachtkarten).
- Die Startladungen (erste Stufe je Körper) laufen ohne Mengenbegrenzung; die Grenze von zwei
  gleichzeitigen Ladevorgängen gilt nur für das Nachladen — sonst hätte der Start unter
  „Fast 4G“ für 29 Dateien zu lange gedauert.
- KTX-Software wird nicht per winget eingerichtet (dort nicht geführt), sondern aus dem
  offiziellen GitHub-Release von Khronos per 7-Zip nach `.cache/werkzeuge/ktx/` entpackt.
- Der dargestellte Durchmesser rechnet in Gerätepixeln (CSS-Höhe × Pixeldichte), weil die
  Texel auf Gerätepixel fallen.

## 7. Bekannte Unschärfen

Aus dem Ledger (zurückgestellt, kein Merge-Hindernis):

- Task 1: Lageprüfung nur an 3 von 6 Kodierungen durchgeführt (Mond fehlt).
- Task 1: Pyright meldet `Image.LANCZOS`/`FLIP_TOP_BOTTOM` und `spec None` in
  `textur-stufe.py` (nur Typprüfung, das Skript läuft).
- Task 2: `texturen-bauen.ts` verglich bei der 1k-Summe wörtlich `breite === 1024` statt der
  Konstante `ETC1S_BREITE` — **behoben** in der Nacharbeit (Commit `257750a`).
- Task 3: `eslint.config.js` schließt `public/basis/**` aus (fremder, unminifizierter
  Emscripten-Code) — nicht im Plan vorgesehen, aber sachlich nötig, damit `npm run lint` den
  kopierten Transcoder nicht prüft.
- Task 4: Kein `dispose()` für den `KTX2Loader` in `buildScene.dispose` und keine Freigabe spät
  eintreffender Texturen nach dem Abbau — Ursache der Warnung „Multiple active KTX2 loaders“ im
  StrictMode des DEV-Builds (siehe §4.2 und §8) — **behoben** in der Nacharbeit (Commit
  `257750a`): `TexturLader.freigeben()`, `TexturSteuerung.beenden()`, Aufruf in `scene.ts
  dispose()` vor den übrigen Aufräumaufrufen. Browser-Kontrolle danach: frischer Navigate, 3 s
  gewartet, keine Konsolenwarnung mehr, `texturStand()` weiter 29 × mindestens 1024.
- Task 4: `benoetigteStufe` erlaubt Stufe 0 auch bei einer Obergrenze unter 1024 (gewollt,
  praktisch nicht erreichbar, da die kleinste Obergrenze 1024 ist).
- Task 5: Die Zeit, bis das Kameraziel nach „alle texturiert“ seine breitere Stufe erhält,
  streut stark (3,4–5 589,9 ms) durch den Prüftakt und belegte Nachladeplätze (das
  Standardkameraziel Sonne kann einen der zwei Plätze belegen) — Bestandsverhalten, von der
  Korrektur `63edc93` unberührt.
- Task 5 Korrektur: Im Test „fordert eine Stufe, die schon der Start lädt, nicht ein zweites Mal
  an“ ist der erste `pruefe`-Aufruf seit der Korrektur `63edc93` wirkungslos (Startladungen noch
  offen); die Aussage des Tests trägt der zweite Aufruf nach Abschluss der Startladungen.
- Task 6 (Kommentare): In `pluto-system.ts:137` und `zwergplaneten.ts:88,142,202,254` verwies
  die Wendung „Ausweichfarbe für die Ladezeit der Textur (unten)“ auf keine Zeile mehr im
  selben Block (die Texturzeile war beim Entfernen von `appearance.textures` in Task 3
  entfallen) — **behoben** in der Nacharbeit (Commit `257750a`): Verweis auf `data/texturen.ts`.

## 8. Fragen an Jens

1. **Zehn Textfundstellen** (§5) werden durch die Stufen bzw. die neuen Pfade falsch. Sie
   wurden nicht geändert, weil fachgeprüfte Texte in dieser Phase nicht angefasst werden — wie
   soll mit ihnen verfahren werden (eigene Nachführungsrunde, warten bis zu einer ohnehin
   fälligen Überarbeitung, oder etwas anderes)?
2. **Repositoryzuwachs rund 170 MiB** durch die 47 neuen KTX2-Dateien (§3.4) — soll das so
   bleiben, oder gibt es eine Grenze, ab der zum Beispiel auf weniger hohe Stufen oder eine
   andere Ablage ausgewichen werden soll?
3. **Handprüfung der Texturen auf dem A55** bei mittlerer Qualitätsstufe — noch offen, wird in
   der Gesamtabnahme 5-5 gesammelt geprüft.

(Die frühere Frage 3, fehlende Freigabe des `KTX2Loader` beim Abbau der Szene, ist mit der
Nacharbeit behoben — siehe §7, Task 4.)
