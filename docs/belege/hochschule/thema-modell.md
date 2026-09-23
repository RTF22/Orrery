# Belege: thema-modell (Hochschule)

| Nr. | Aussage | Wert im Text | Beleg | Fundstelle | Prüfung |
|---|---|---|---|---|---|
| 1 | Zeitbereich der Simulation | 1. Januar 1, 0 Uhr bis 31. Dezember 9999, 0 Uhr | Nachrechnung am Code: `src/sim/time.ts` (`JD_MIN`, `JD_MAX`) | Zeile 14–15 | |
| 2 | Uhr zeigt UTC an, rechnet aber mit derselben Zahl als TDB | ohne Umrechnung | fachgeprüfter Text: `thema-bezugssysteme.md`, Im Modell | Zeile 251–253 | |
| 3 | TT − UTC seit 1.1.2017 | 32,184 s + 37 s = 69,184 s | fachgeprüfter Text: `objekt-earth.md`, Im Modell | Zeile 253–254 | |
| 4 | Versatz der Erde durch diesen Fehler | 2,8″ in Länge, Mond 38″ | fachgeprüfter Text: `thema-bezugssysteme.md`, Im Modell | Zeile 256 | |
| 5 | ΔT für das Jahr −500 | 17 190 ± 430 s | literatur:espenak-2006 | Sonnenfinsterniskanon | |
| 6 | ΔT-Beobachtungszeitraum | 720 v. Chr. bis 2015 | literatur:stephenson-2016 | Titel der Arbeit | |
| 7 | Beobachtete Tageslängenzunahme gegen Gezeitenrechnung | +1,78 ± 0,03 ms/Jh gegen +2,3 ± 0,1 ms/Jh | literatur:stephenson-2016; auch fachgeprüfter Text: `thema-finsternis.md`, Offene Fragen | Zeile 170–172 | |
| 8 | Schwankung der Tageslängenzunahme, Periode | rund 14 Jahrhunderte | literatur:morrison-2021; auch fachgeprüfter Text: `thema-finsternis.md`, Offene Fragen | Zeile 176–177 | |
| 9 | Genauigkeitsfenster-Warnung erscheint im Datenblock UND im Zeit-Bedienfeld | „Außerhalb des Genauigkeitsfensters" / „Positionen ungenau" | Nachrechnung am Code: `src/ui/format.ts` (`isOutOfRange`, Schwelle 1800/2050), `src/ui/info/Datenblock.tsx`, `src/ui/panels/TimePanel.tsx`, `src/ui/i18n/de.ts` | `format.ts` Zeile 86–90; `Datenblock.tsx` Zeile 26,41; `TimePanel.tsx` Zeile 29,104–108; `de.ts` Zeile 223 | |
| 10 | Erdrotation im Modell, Periode und Versatz zur ERA-Umdrehung | 23,9345 h, 0,101 s länger | fachgeprüfter Text: `objekt-earth.md`, Im Modell | Zeile 265–267 | |
| 11 | Kartennullmeridian-Verdrehung | 79,5° (J2000), 75,4° (17.9.2026) | fachgeprüfter Text: `objekt-earth.md`, Im Modell | Zeile 267–269 | |
| 12 | Für die Erde gibt es seit IAU-Bericht 2015 kein Rotationsmodell mehr | gestrichen, weil ungenau | literatur:archinal-2018; auch fachgeprüfter Text: `objekt-earth.md`, Im Modell | Zeile 263–265 | |
| 13 | Nominelle Fehler JPL-Tafel 1800–2050, heliozentrische Länge | 15″ Merkur, 400″ Jupiter, 600″ Saturn | quelle:jpl-approx-pos; auch fachgeprüfter Text: `thema-bahnelemente.md`, Im Modell | Zeile 153–154 | |
| 14 | Erde-Mond-Schwerpunkt, nominelle Fehler | 20″ Länge, 8″ Breite, 6000 km Abstand | fachgeprüfter Text: `objekt-earth.md`, Im Modell | Zeile 246–247 | |
| 15 | Vergleich zweier JPL-Tafeln, Saturn-Apsidenrate | −0,419°/Jh gegen +0,542°/Jh | fachgeprüfter Text: `thema-bahnelemente.md`, Abschnitt vor „Singularitäten" | Zeile 151–153 | |
| 16 | Sonne-Jupiter-Zweikörper-Schwerpunkt ab Sonnenmitte | 742 260 km = 1,067 Sonnenradien, 46 600 km über der Oberfläche | Herleitung: $r=a_\mathrm{Jup}\,M_\mathrm{Jup}/(M_\odot+M_\mathrm{Jup})$ mit den Katalogwerten | `src/data/bodies/sun.ts:15-16`, `src/data/bodies/jupiter.ts:10,23-24` | |
| 17 | Keplerlöser bei e = 0,438 (Eris) | höchstens 5 Newton-Schritte | fachgeprüfter Text: `thema-bahnelemente.md`, Im Modell | Zeile 243–244 | |
| 18 | Keplerlöser bei e = 0,99 | höchstens 10 Schritte | fachgeprüfter Text: `thema-bahnelemente.md`, Im Modell | Zeile 244–245 | |
| 19 | Keplerlöser bei e = 0,999 | 943 von 200 001 Werten ohne Konvergenz, 886 mit Residuum > 10⁻⁶ rad, Iterierte bis ~10¹⁶ | fachgeprüfter Text: `thema-bahnelemente.md`, Im Modell | Zeile 245–247 | |
| 20 | Pluto-SBDB-Elemente gegen DE441 | Ortsfehler 0,05° (2000), 0,13° (2050), 0,15° (1900), 1,4° (1800) | literatur:park-2021; auch fachgeprüfter Text: `thema-bahnelemente.md`, Im Modell | Zeile 221–226 | |
| 21 | Ursache des Pluto-Ortsfehlers | mittlere Bewegung 0,44 % zu langsam, nur Sonnenmasse als Zentralmasse | fachgeprüfter Text: `thema-bahnelemente.md`, Im Modell | Zeile 225–226 | |
| 22 | Mondbahnen im Katalog gegen Äquator des Mutterkörpers | 20 von 21 | fachgeprüfter Text: `thema-bezugssysteme.md`, Im Modell | Zeile 264–265 | |
| 23 | Laplace-Ebene vs. Äquator, Kallisto | 0,4° Abweichung | fachgeprüfter Text: `thema-bahnelemente.md`, Abschnitt „Übrige Monde" | Zeile 232–233 | |
| 24 | Laplace-Ebene vs. Äquator, Deimos | 0,9° Abweichung | fachgeprüfter Text: `thema-bahnelemente.md`, Abschnitt „Übrige Monde" | Zeile 233 | |
| 25 | Iapetus: Bahn gegen Laplace-Ebene, Knotenpräzession um Saturns statt Laplace-Pol | Bahn 7,6° gegen Laplace-Ebene | fachgeprüfter Text: `thema-bahnelemente.md`, Abschnitt „Monde und die Laplace-Ebene" | Zeile 207–209 | |
| 26 | Pluto-Schwerpunkt-Versatz | 2126 km (1,79 Plutoradien) von Plutos Mitte | fachgeprüfter Text: `objekt-pluto.md`, Im Modell; auch `objekt-charon.md`, Im Modell | Zeile 274–275; 205–206 | |
| 27 | Pluto-Taumelbetrag relativ zum Sonnenabstand | unter 0,00004 % von 39,6 AE | fachgeprüfter Text: `objekt-pluto.md`, Im Modell | Zeile 278–280 | |
| 28 | Monde der Zwergplaneten fehlen im Katalog | Dysnomia, Hiʻiaka, Namaka, MK 2, Styx/Nix/Kerberos/Hydra | fachgeprüfter Text: `thema-zwergplaneten.md`, Im Modell; auch `objekt-pluto.md`, Im Modell | Zeile 257–259; 312 | |
| 29 | Monde im Katalog gesamt und je Planet | 21 (Erde 1, Mars 2, Jupiter 4, Saturn 7, Uranus 5, Neptun 1, Pluto 1) | Nachrechnung am Code: `src/data/bodies/*monde*.ts`, `moon.ts`, `pluto-system.ts` (Zählung der `id:`-Einträge); auch fachgeprüfter Text: `objekt-deimos.md`, Im Modell | „21 Monde des Katalogs", Zeile 92–93 | |
| 30 | Bekannte Monde der Riesenplaneten, des Mars und Plutos | 460, Stand 23. Mai 2023 | quelle:jpl-satelliten-entdeckung | „A total of 460 planetary satellites … are represented below", „last updated 2023-May-23" | |
| 31 | Feste Pole ohne Präzession und periodische Glieder | alle Pole `physical.pole` konstant | fachgeprüfter Text: `thema-achsneigung.md`, Im Modell | Zeile 251–253 | |
| 32 | Eris' Pol als Bahnnormale statt Messung | Kippwinkel 0° angenommen, real rund 78,3° (Dysnomia) | fachgeprüfter Text: `objekt-eris.md`, Im Modell; auch `thema-zwergplaneten.md`, Im Modell | Zeile 178–188; 264–266 | |
| 33 | Makemakes Pol unbekannt | Kippwinkel 46° bis 78° | fachgeprüfter Text: `thema-zwergplaneten.md`, Im Modell | Zeile 265–266 | |
| 34 | Marspol: bewusst älterer IAU-2009-Pol statt IAU-2015-Pol | 317,68143°/52,88650° statt 317,269°/54,432°; Achsneigung 25,19° gegen 23,92° | fachgeprüfter Text: `objekt-mars.md`, Im Modell | Zeile 256–263 | |
| 35 | Uranus-Rotation im Datensatz vs. Hubble-Messung | −17,24 h gegen 17,247864 ± 0,000010 h | literatur:lamy-2025; auch fachgeprüfter Text: `objekt-uranus.md`, Im Modell | Zeile 243–246 | |
| 36 | Uranus-Rotation: Drift seit J2000 | rund 28 s je Umdrehung, ~6 Umdrehungen seit 26,7 Jahren | fachgeprüfter Text: `objekt-uranus.md`, Im Modell | Zeile 246–249 | |
| 37 | Neptun-Rotation im Datensatz vs. Karkoschka-Messung | 16,11 h gegen 15,9663 h | fachgeprüfter Text: `objekt-neptune.md`, Im Modell | Zeile 234–237 | |
| 38 | Neptun-Rotation: Drift seit J2000 | rund 8,6 min je Umdrehung, ~131 Umdrehungen | fachgeprüfter Text: `objekt-neptune.md`, Im Modell | Zeile 237–240 | |
| 39 | Neptun-Rotation, dritte Schätzung (Offene Fragen) | rund 17,46 h (formbasiert) | fachgeprüfter Text: `objekt-neptune.md`, Offene Fragen | Zeile 205–210 | |
| 40 | Saturn-Abplattung, Modellfehler | 0,09796; −2036 km Äquator, +3868 km Pole | fachgeprüfter Text: `objekt-saturn.md`, Im Modell | Zeile 224–229 | |
| 41 | Jupiter-Abplattung | 0,06487 | fachgeprüfter Text: `objekt-jupiter.md`, Im Modell | Zeile 224–226 | |
| 42 | Uranus-Abplattung | 0,02293 | fachgeprüfter Text: `objekt-uranus.md`, Im Modell | Zeile 240–242 | |
| 43 | Neptun-Abplattung | 0,0171 | fachgeprüfter Text: `objekt-neptune.md`, Im Modell | Zeile 229–232 | |
| 44 | Haumea Kugel statt Ellipsoid | 774,1 km Radius gegen Halbachsen ~1061/844/514 km, −27 %/+51 % | fachgeprüfter Text: `objekt-haumea.md`, Im Modell; auch `thema-zwergplaneten.md`, Im Modell | Zeile 201–209; 264–268 | |
| 45 | Künstlerische Texturen im Katalog | 4 von rund 30 „fictional" (Ceres, Eris, Haumea, Makemake); Deimos ohne Textur | Nachrechnung am Code: `ASSETS.md` (Tabellenzeilen, Zählung); auch `objekt-deimos.md`, Im Modell | `ASSETS.md:90-93`; `objekt-deimos.md:96-97` | |
| 46 | Saturnring als einzelne Scheibe ohne D-/F-/G-/E-Ring, Dicke, Dichtewellen | vollständig | fachgeprüfter Text: `thema-ringe.md`, Im Modell | Zeile 254–258 | |
| 47 | Fresnel-Faktor F je Phasenwinkel | 0,04 (0°), 0,13 (135°), 0,41 (160°) | fachgeprüfter Text: `thema-photometrie.md`, Im Modell | Zeile 329–331 | |
| 48 | Kugel der Reflexion p, Ergebnis ohne Glanz/Fülllicht | geometrische Albedo 0,640·p | fachgeprüfter Text: `thema-photometrie.md`, Im Modell | Zeile 332–334 | |
| 49 | Erde im Modell vs. gemessen | 0,278/0,415 gegen 0,434/0,293 | fachgeprüfter Text: `thema-photometrie.md`, Im Modell | Zeile 334–335 | |
| 50 | Enceladus im Modell vs. Katalog | 0,64 gegen 1,0 | fachgeprüfter Text: `thema-photometrie.md`, Im Modell | Zeile 335 | |
| 51 | Standard-Fülllicht (nightFill) | ein Viertel des Tagniveaus | Nachrechnung am Code: `src/render/lighting.ts` (`nightFill`, Standardwert); auch `objekt-eris.md`, Im Modell | `lighting.ts:100-112`; `objekt-eris.md:213-214` | |
| 52 | MAX_OKKLUDER | 4 gleichzeitige Kugel-Okkluder | Nachrechnung am Code: `src/render/shadows.ts` | Zeile 26 | |
| 53 | Saturn behält Titan/Tethys/Dione/Rhea, Uranus verliert Oberon | als Okkluder | fachgeprüfter Text: `thema-finsternis.md`, Im Modell | Zeile 305–309 | |
| 54 | Kallisto zeitweise ohne eigenen Schatten | Sonnenhöhe über 2,128° gegen Jupiters Achsneigung 3,12°/3,13° | fachgeprüfter Text: `objekt-callisto.md`, Im Modell | Zeile 251–259 | |
| 55 | Mondfinsternis-Trefferquote 1951–2050 | 135 von 143, Maximalabweichung 3,0 h, RMS 1,8 h | fachgeprüfter Text: `thema-finsternis.md`, Im Modell | Zeile 299–303 | |
| 56 | Sternfeld-Anzahl | 5070 Sterne (HYG-Datenbank) | Nachrechnung am Code: `src/data/stars/hyg.json` (Zählung per `node`) | Datei-Länge (Array) | |
| 57 | SCALE_PRESETS-Werte | realistisch {1, 1,0, 1,0}; schaubild {50, 0,6, 0,35}; kompakt {200, 0,4, 0,2} | Nachrechnung am Code: `src/sim/scale.ts` | Zeile 13–16 | |
| 58 | Skalierungsformel | $r' = A\,(r/A)^k$, Fixpunkt A = 1 AE | Nachrechnung am Code: `src/sim/scale.ts` | Zeile 19–24 | |
| 59 | Neptun-Abstand je Preset | realistisch 30,07 AE; schaubild 7,71 AE; kompakt 3,90 AE | Herleitung mit der Formel aus `scale.ts` und $a$(Neptun) aus dem Datensatz | `src/data/bodies/neptune.ts:10` | |
| 60 | Sonne-Erde-Größenverhältnis je Preset | real 109,2:1; schaubild 38,2:1; kompakt 21,8:1 | Herleitung mit `scaledRadius` und den Katalogradien | `src/data/bodies/sun.ts:15`, `src/data/bodies/earth.ts:24` | |
| 61 | Hauptgürtel-Verteilung | Glockenkurve um 2,7 AE, σ=0,35 AE, Bereich 2,1–3,3 AE | fachgeprüfter Text: `thema-kirkwood-luecken.md`, Im Modell | Zeile 138–141 | |
| 62 | Kirkwood-Lücken: Restdichte und Halbwertsbreiten | 10 % Restdichte; 0,0167–0,0333 AE Halbwertsbreite | fachgeprüfter Text: `thema-kirkwood-luecken.md`, Im Modell | Zeile 139–146 | |
| 63 | a(Jupiter) im Belt-Code vs. Bahnresonanzen | 5,2044 AE gegen 5,203 AE, Lückenverschiebung 0,0006–0,0009 AE | fachgeprüfter Text: `thema-kirkwood-luecken.md`, Im Modell | Zeile 148–157 | |
| 64 | Hauptgürtel-Albedo | 0,06 einheitlich | fachgeprüfter Text: `thema-entstehung.md`, Im Modell; auch `objekt-ceres.md`, Im Modell | Zeile 353–355; 301–303 | |
| 65 | Kuipergürtel-Mischung | 60 % kalt (σᵢ=3°), 25 % heiß (12°), 15 % Plutinos | fachgeprüfter Text: `thema-entstehung.md`, Im Modell | Zeile 352–354 | |
| 66 | Offene Frage: keine zweite, radiounabhängige Uranus-Rotationsbestimmung | offen | literatur:lamy-2025 | Diskussion/Ausblick | |
| 67 | Offene Frage: IAU-Bericht 2018 als Momentaufnahme, Beschluss der Arbeitsgruppe aussteht | offen | literatur:archinal-2018 | Bericht selbst | |
