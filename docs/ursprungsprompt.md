# Projekt: Interaktive 3D-Simulation des Sonnensystems (Browser)

Bitte starte mit dem brainstorming-Skill und interviewe mich, bevor du planst
oder Code schreibst. Stelle die Fragen einzeln, schlage jeweils eine
begründete Empfehlung vor und fasse am Ende ein Design-Dokument zusammen,
das ich freigebe. Erst danach: Implementierungsplan, dann Umsetzung in
kleinen, testbaren Schritten.

## Vision
Eine visuell beeindruckende, flüssig animierte 3D-Simulation unseres
Sonnensystems, die komplett im Browser läuft. Zwei Nutzungsmodi:
1. **Explorer-Modus:** Umfangreiches, gut strukturiertes UI, in dem der
   Benutzer praktisch alles einstellen kann.
2. **Kino-Modus:** UI komplett ausblendbar (Tastenkürzel + dezenter Button),
   echtes Vollbild (Fullscreen API), automatische Kamerafahrten –
   das System einfach genießen, z. B. als Bildschirm-Deko.

## Inhaltlicher Umfang (Ausgangsbasis, im Interview verfeinern)
- Sonne, 8 Planeten, wichtige Monde, Zwergplaneten (Pluto, Ceres …)
- Optional: Asteroidengürtel, Kuipergürtel, Saturn- und Uranusringe,
  Kometen mit Schweif, Sternenhintergrund / Milchstraße
- Umlaufbahnen auf Basis realer Bahnelemente (Kepler), korrekte Neigungen
  und Rotationsachsen; physikalische Genauigkeit vs. Optik ist eine
  Designfrage fürs Interview

## Parametrisierung (Beispiele, bitte systematisch erweitern)
- Zeit: Geschwindigkeit (Echtzeit bis Jahre/Sekunde), Pause, Rückwärts,
  Sprung zu Datum, "Jetzt"
- Maßstab: realistische Größen/Abstände vs. dargestellter Maßstab
  (getrennte Regler für Körpergröße und Bahnabstände)
- Darstellung: Bahnlinien, Beschriftungen, Achsen, Schatten, Glow/Bloom,
  Atmosphären, Textur-Qualität, Helligkeit, Sonnen-Lichtabfall
- Kamera: frei (Orbit/Zoom), an Körper heften, Verfolgung,
  vordefinierte Blickwinkel, automatische Kinofahrt mit Übergängen
- Körper ein-/ausblenden, Infopanel mit Daten zum ausgewählten Objekt
- Einstellungen speichern/laden (Presets), per URL teilbar

## UI/UX
- Modernes, dunkles, halbtransparentes UI, das die Szene nicht erdrückt
- Einklappbare Panels, Tastenkürzel (mit Übersicht), Maus + Touch
- UI-Toggle (z. B. Taste H) und Vollbild (F) jederzeit verfügbar
- Deutschsprachig, Mehrsprachigkeit vorbereitet

## Technische Leitplanken
- Rein clientseitig, kein Backend nötig, statisch deploybar
- Vorschlag: Three.js (oder begründete Alternative), TypeScript, Vite
- Saubere Architektur: Simulation/Physik getrennt von Rendering und UI,
  Konfiguration datengetrieben (Himmelskörper als Datensatz, nicht im Code)
- Ziel: stabile 60 fps auf aktuellem Mittelklasse-Laptop;
  Qualitätsstufen für schwächere Hardware
- Texturen: frei lizenzierte Quellen, Lizenzen dokumentieren
- Tests für die Bahnberechnung (Positionen gegen Referenzwerte prüfen)

## Qualitätsanspruch
Es soll *toll aussehen*: realistische Beleuchtung, Bloom um die Sonne,
Atmosphärenschimmer, weiche Kamerabewegungen, sanfte Übergänge.
Lieber weniger Features, dafür poliert.

## Offene Punkte fürs Interview (mindestens)
- Zielgruppe und Anspruch: Lernwerkzeug, Showpiece oder beides?
- Physikalische Genauigkeit vs. Ästhetik – wo liegt die Grenze?
- MVP-Umfang vs. spätere Ausbaustufen (Roadmap in Phasen)
- Kino-Modus: welche Kamerafahrten, Musik/Ambient-Sound?
- Mobile-Unterstützung: vollwertig oder nur "funktioniert"?
- Hosting/Deployment (lokal, GitHub Pages, eigener Server)
- Weitere Ideen, die ich noch nicht bedacht habe – bitte aktiv vorschlagen

## Über mich
Ich bin ausgebildeter Systementwickler (Pascal, Python, C), programmiere
aber heute wenig und denke in Konzepten. Erkläre technische Entscheidungen
knapp mit Begründung und Alternativen; keine Grundlagen-Erklärungen nötig.