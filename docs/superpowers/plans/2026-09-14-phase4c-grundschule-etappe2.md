# Phase 4c Infopanel, Etappe 2 „Grundschule Körper" — Umsetzungsplan

> **Für agentische Umsetzer:** ERFORDERLICHE SUB-SKILL: superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, Task für Task. Die Schritte verwenden Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Jeder der 35 Körper hat einen Grundschultext in Deutsch und Englisch; Erde und Saturn liegen seit Etappe 1 vor, es fehlen 33 Körper, also 66 Markdown-Dateien. Kein Code ändert sich.

**Architektur:** Reine Dateiergänzung unter `src/data/texte/<sprache>/grundschule/objekt-<id>.md` (Entwurf §4.1). Der Lader findet neue Dateien über `import.meta.glob` ohne Codeänderung; `src/data/texte/dateien.test.ts` prüft jede Datei (Namensmuster, Überschrift, auflösbare Verweise, kein HTML, Wortgrenze 110, Sprachpaar). Die Texte in diesem Plan sind **wörtlich** zu übernehmen; ein Umsetzer schreibt keine eigenen Sätze.

**Tech-Stack:** Markdown-Teilmenge des Renderers (Überschrift `#`, Absätze, fett, kursiv, Links `[Text](objekt:id|szene:id|quelle:id)`), Vitest, Playwright-MCP für die Abnahme.

**Entwurf:** `docs/superpowers/specs/2026-09-14-phase4c-infopanel-design.md`, maßgeblich §2 Punkt 4 (40 bis 80 Wörter), §4.1 (Ablage), §4.2 (Markdown), §4.3 (Verweise), §7 Punkt 2 (Umfang: 35 Texte Deutsch und Englisch), §8 (Dateitest). Abweichungen unter „Rulings" am Ende.

## Globale Randbedingungen

- Alles auf Deutsch (Commit-Texte, Protokoll). Umlaute korrekt. Englisch nur in `src/data/texte/en/`.
- Keine Fremdzurechnung im Commit-Text: keine Co-Autor-Zeile, keine Sitzungs-URL, keine Werkzeugnamen. Nach jedem Commit prüfen: `git log --format=%B -1 | grep -ci 'co-authored\|session'` muss 0 ergeben. Der Dateiname der lokalen Projektanleitung erscheint in keiner versionierten Datei („die lokale Projektanleitung" schreiben).
- Branch `grundschule` (von `master`), **kein Worktree**: der Vite-Server auf Port 5173 (Basis `/Orrery/`) liefert dieses Verzeichnis aus. Erst `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` prüfen, keinen zweiten starten.
- Textregeln (Entwurf §2 Punkt 4, §4.2): 40 bis 80 Wörter je Datei, weiche Prüfgrenze 110 (gezählt inklusive Überschrift und Linktext, ohne Link-Ziele); erste Zeile `# Titel`; Zeilenumbrüche innerhalb eines Absatzes sind erlaubt (der Parser verbindet sie); kein HTML, keine Bilder, keine Tabellen.
- Verweise nur auf existierende Ziele: `objekt:<id>` (35 Körper), `szene:<id>` (19 Szenen in `src/data/scenes.ts`), `quelle:<id>` (24 Quellen in `src/data/quellen.ts`). **Keine `thema:`-Verweise in Grundschultexten** (Ruling 1: Themen haben bis 4c-4 keinen Text, ein Verweis wäre eine Sackgasse).
- Deutsche und englische Fassung sind inhaltlich parallel (gleiche Aussagen, gleiche Verweise).
- Vor jedem Commit: `npx vitest run src/data/texte` grün. Vor „fertig": `npm test`, `npm run lint`, `npx tsc -b`, `npm run build`.
- Playwright schreibt nur nach `.playwright-mcp/` (git-ignoriert). Direkt nach jedem `browser_navigate`: `window.store.setState({ quality: { tier: 'high' } })`.

## Dateistruktur

| Task | Körper | Dateien |
|---|---|---|
| 1 | sun, mercury, venus, mars | 8 |
| 2 | moon, phobos, deimos | 6 |
| 3 | jupiter, io, europa, ganymede, callisto | 10 |
| 4 | mimas, enceladus, tethys, dione, rhea, titan, iapetus | 14 |
| 5 | uranus, miranda, ariel, umbriel, titania, oberon, neptune, triton | 16 |
| 6 | pluto, charon, ceres, eris, haumea, makemake | 12 |
| 7 | Abnahme `docs/phase4c-etappe2-abnahme.md`, `README.md` | 2 |

Jede Datei liegt unter `src/data/texte/de/grundschule/objekt-<id>.md` beziehungsweise `src/data/texte/en/grundschule/objekt-<id>.md`. Nach Etappe 2 gibt es 80 Textdateien; `dateien.test.ts` erzeugt je Datei fünf Fälle.

**Vorgehen je Text-Task (gilt für Task 1 bis 6):** Dateien wörtlich aus dem Plan anlegen → `npx vitest run src/data/texte` → alle Fälle grün (die Zahl der Dateien im Fall „gibt es" wächst mit) → Commit nur mit `git add src/data/texte`. Fällt der Wortgrenzen-Fall, den Text behutsam kürzen und die Kürzung im Report nennen; fällt der Verweis-Fall, ist die Kennung gegen die Kataloge zu prüfen, nie der Test zu ändern.

---

### Task 1: Sonne und innere Planeten

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/grundschule/objekt-{sun,mercury,venus,mars}.md`

**Schnittstellen:**
- Konsumiert: Verweise `objekt:earth`, `objekt:moon`, `objekt:phobos`, `objekt:deimos`, `szene:systemblick`, `szene:merkurjagd`.
- Produziert: nichts für spätere Tasks.

- [ ] **Schritt 1: Branch anlegen**

```bash
git checkout -b grundschule master
```

- [ ] **Schritt 2: Dateien anlegen**

`de/grundschule/objekt-sun.md`:
```markdown
# Die Sonne

Die Sonne ist ein Stern, eine riesige Kugel aus heißem Gas. Sie ist so groß, dass
mehr als hundert Erden nebeneinander in sie hineinpassen würden. Ihr Licht braucht
gut acht Minuten, bis es bei uns ankommt. Alle Planeten kreisen um die Sonne, auch
die [Erde](objekt:earth). Ohne ihr Licht und ihre Wärme gäbe es kein Leben. Die
[Systemschau](szene:systemblick) zeigt, wie alles um sie herumläuft.
```

`en/grundschule/objekt-sun.md`:
```markdown
# The Sun

The Sun is a star, a giant ball of hot gas. It is so big that more than a hundred
Earths would fit side by side across it. Its light takes a good eight minutes to
reach us. All the planets circle the Sun, including the [Earth](objekt:earth).
Without its light and warmth there would be no life. The
[system view](szene:systemblick) shows how everything runs around it.
```

`de/grundschule/objekt-mercury.md`:
```markdown
# Der Merkur

Merkur ist der kleinste Planet und der Sonne am nächsten. Er hat keine Luft, deshalb
wird es am Tag glühend heiß und in der Nacht eiskalt. Seine Oberfläche ist voller
Krater, fast wie beim [Mond](objekt:moon). Ein Jahr auf Merkur dauert nur 88 Tage,
so schnell saust er um die Sonne. In der Szene [Merkurjagd](szene:merkurjagd)
kannst du ihm dabei zusehen.
```

`en/grundschule/objekt-mercury.md`:
```markdown
# Mercury

Mercury is the smallest planet and the closest to the Sun. It has no air, so the day
gets scorching hot and the night freezing cold. Its surface is full of craters,
almost like the [Moon](objekt:moon). A year on Mercury lasts only 88 days, that is
how fast it races around the Sun. In the scene [Chasing Mercury](szene:merkurjagd)
you can watch it do so.
```

`de/grundschule/objekt-venus.md`:
```markdown
# Die Venus

Venus ist fast so groß wie die [Erde](objekt:earth), aber ganz anders. Dicke Wolken
hüllen sie ein, und darunter ist es heißer als in einem Backofen, heißer als auf
jedem anderen Planeten. Venus dreht sich sehr langsam und sogar rückwärts: Ein
Venustag dauert länger als ein Venusjahr. Am Abend- oder Morgenhimmel leuchtet sie
so hell, dass man sie oft für einen Stern hält.
```

`en/grundschule/objekt-venus.md`:
```markdown
# Venus

Venus is almost as big as the [Earth](objekt:earth), but completely different. Thick
clouds wrap around it, and underneath it is hotter than an oven, hotter than on any
other planet. Venus spins very slowly and even backwards: a day on Venus lasts
longer than a year on Venus. In the evening or morning sky it shines so brightly
that people often mistake it for a star.
```

`de/grundschule/objekt-mars.md`:
```markdown
# Der Mars

Mars ist der rote Planet. Seine Farbe kommt von Rost im Sand. Er ist nur etwa halb so
groß wie die [Erde](objekt:earth), hat aber den höchsten Berg im Sonnensystem, den
Vulkan Olympus Mons. An den Polen liegt Eis. Zwei winzige Monde,
[Phobos](objekt:phobos) und [Deimos](objekt:deimos), kreisen um ihn. Roboter auf
Rädern erkunden seine Oberfläche und suchen nach Spuren von Wasser.
```

`en/grundschule/objekt-mars.md`:
```markdown
# Mars

Mars is the red planet. Its colour comes from rust in the sand. It is only about half
as big as the [Earth](objekt:earth), but it has the tallest mountain in the solar
system, the volcano Olympus Mons. There is ice at its poles. Two tiny moons,
[Phobos](objekt:phobos) and [Deimos](objekt:deimos), circle around it. Robots on
wheels explore its surface and look for traces of water.
```

- [ ] **Schritt 3: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS; der Fall „gibt es" zählt 22 Dateien, je Datei fünf Fälle grün.

- [ ] **Schritt 4: Commit**

```bash
git add src/data/texte
git commit -m "Grundschultexte: Sonne, Merkur, Venus, Mars"
```

---

### Task 2: Erdmond und Marsmonde

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/grundschule/objekt-{moon,phobos,deimos}.md`

**Schnittstellen:**
- Konsumiert: `objekt:earth`, `objekt:mars`, `objekt:phobos`, `szene:mondfinsternis`, `szene:phobos-tiefflug`, `quelle:nssdc-moon`.

- [ ] **Schritt 1: Dateien anlegen**

`de/grundschule/objekt-moon.md`:
```markdown
# Der Mond

Der Mond ist der Begleiter der [Erde](objekt:earth). Er ist etwa ein Viertel so breit
wie sie und braucht rund vier Wochen für eine Runde um sie. Dabei zeigt er uns immer
dieselbe Seite. Er hat keine Luft, und seine Oberfläche ist voller Krater. Menschen
sind schon auf ihm gelandet. Wandert er durch den Schatten der Erde, gibt es eine
[Mondfinsternis](szene:mondfinsternis). Mehr Zahlen: [Mondsteckbrief](quelle:nssdc-moon).
```

`en/grundschule/objekt-moon.md`:
```markdown
# The Moon

The Moon is the companion of the [Earth](objekt:earth). It is about a quarter as wide
as the Earth and needs around four weeks for one lap around it. While doing so it
always shows us the same side. It has no air, and its surface is full of craters.
People have already landed on it. When it moves through the Earth's shadow there is
a [lunar eclipse](szene:mondfinsternis). More numbers: [Moon fact sheet](quelle:nssdc-moon).
```

`de/grundschule/objekt-phobos.md`:
```markdown
# Phobos

Phobos ist der größere der beiden Monde des [Mars](objekt:mars) und trotzdem winzig:
Er sieht aus wie eine Kartoffel und ist nur gut 20 Kilometer lang. Er fliegt so dicht
und so schnell um den Mars, dass er dreimal am Tag am Himmel erscheint, und zwar im
Westen! Ganz langsam kommt er dem Mars näher. In der Szene
[Tiefflug](szene:phobos-tiefflug) siehst du ihn ganz nah.
```

`en/grundschule/objekt-phobos.md`:
```markdown
# Phobos

Phobos is the larger of the two moons of [Mars](objekt:mars) and still tiny: it
looks like a potato and is only a good 20 kilometres long. It flies so close and so
fast around Mars that it appears in the sky three times a day, and it rises in the
west! Very slowly it is getting closer to Mars. In the scene
[Low pass](szene:phobos-tiefflug) you see it up close.
```

`de/grundschule/objekt-deimos.md`:
```markdown
# Deimos

Deimos ist der kleinere und äußere Mond des [Mars](objekt:mars). Er ist nur etwa
zwölf Kilometer groß und braucht gut einen Tag für eine Runde. Vom Mars aus sieht er
wie ein heller Stern aus, nicht wie eine Scheibe. Wahrscheinlich sind Deimos und
[Phobos](objekt:phobos) einmal Asteroiden gewesen, die der Mars eingefangen hat.
Beide sind dunkel und mit Staub bedeckt.
```

`en/grundschule/objekt-deimos.md`:
```markdown
# Deimos

Deimos is the smaller and outer moon of [Mars](objekt:mars). It is only about twelve
kilometres across and needs a good day for one lap. Seen from Mars it looks like a
bright star, not like a disc. Deimos and [Phobos](objekt:phobos) were probably once
asteroids that Mars captured. Both are dark and covered in dust.
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS, 28 Dateien.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Grundschultexte: Mond, Phobos, Deimos"
```

---

### Task 3: Jupiter und die Galileischen Monde

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/grundschule/objekt-{jupiter,io,europa,ganymede,callisto}.md`

**Schnittstellen:**
- Konsumiert: `objekt:earth`, `objekt:jupiter`, `objekt:io`, `objekt:europa`, `objekt:ganymede`, `objekt:callisto`, `objekt:mercury`, `objekt:moon`, `szene:jupiter-vorbeiflug`.

- [ ] **Schritt 1: Dateien anlegen**

`de/grundschule/objekt-jupiter.md`:
```markdown
# Der Jupiter

Jupiter ist der größte Planet. Elf Erden würden nebeneinander in ihn passen. Er ist
ein Gasriese ohne festen Boden, mit bunten Wolkenstreifen und dem Großen Roten
Fleck, einem Sturm, der größer ist als die [Erde](objekt:earth). Trotz seiner Größe
dreht er sich in nicht einmal zehn Stunden einmal um sich selbst. Seine vier großen
Monde [Io](objekt:io), [Europa](objekt:europa), [Ganymed](objekt:ganymede) und
[Kallisto](objekt:callisto) sieht man schon im Fernglas. Szene:
[Vorbeiflug](szene:jupiter-vorbeiflug).
```

`en/grundschule/objekt-jupiter.md`:
```markdown
# Jupiter

Jupiter is the largest planet. Eleven Earths would fit side by side across it. It is
a gas giant without solid ground, with colourful bands of clouds and the Great Red
Spot, a storm bigger than the [Earth](objekt:earth). Despite its size it spins around
once in less than ten hours. Its four big moons [Io](objekt:io),
[Europa](objekt:europa), [Ganymede](objekt:ganymede) and [Callisto](objekt:callisto)
can be seen with binoculars. Scene: [Flyby](szene:jupiter-vorbeiflug).
```

`de/grundschule/objekt-io.md`:
```markdown
# Io

Io ist der Vulkanmond des [Jupiter](objekt:jupiter). Auf keinem anderen Körper im
Sonnensystem gibt es so viele Vulkane, hunderte sind gleichzeitig aktiv und
schleudern Schwefel kilometerhoch. Deshalb ist Io gelb, orange und schwarz gefleckt
wie eine Pizza. Jupiter zieht so stark an ihm, dass sein Inneres durchgeknetet wird
und heiß bleibt. Io ist etwas größer als unser [Mond](objekt:moon).
```

`en/grundschule/objekt-io.md`:
```markdown
# Io

Io is the volcano moon of [Jupiter](objekt:jupiter). No other body in the solar
system has so many volcanoes; hundreds are active at the same time and throw sulphur
kilometres high. That is why Io is spotted yellow, orange and black like a pizza.
Jupiter pulls on it so strongly that its inside is kneaded and stays hot. Io is
slightly bigger than our [Moon](objekt:moon).
```

`de/grundschule/objekt-europa.md`:
```markdown
# Europa

Europa ist ein Mond des [Jupiter](objekt:jupiter) und mit einer glatten Kruste aus
Eis überzogen, die von langen Rissen durchzogen ist. Unter dem Eis liegt ein Ozean
aus Wasser, in dem es mehr Wasser gibt als in allen Meeren der [Erde](objekt:earth)
zusammen. Forscher fragen sich, ob dort Leben möglich ist. Europa ist ein wenig
kleiner als unser [Mond](objekt:moon).
```

`en/grundschule/objekt-europa.md`:
```markdown
# Europa

Europa is a moon of [Jupiter](objekt:jupiter) and is covered by a smooth crust of ice
crossed by long cracks. Under the ice lies an ocean of water that holds more water
than all the seas of the [Earth](objekt:earth) put together. Scientists wonder
whether life might be possible there. Europa is a little smaller than our
[Moon](objekt:moon).
```

`de/grundschule/objekt-ganymede.md`:
```markdown
# Ganymed

Ganymed ist der größte Mond im ganzen Sonnensystem. Er ist sogar größer als der
Planet [Merkur](objekt:mercury), nur viel leichter, weil er zur Hälfte aus Eis
besteht. Als einziger Mond hat er ein eigenes Magnetfeld, so wie die
[Erde](objekt:earth). Seine Oberfläche zeigt dunkle, alte Gebiete voller Krater und
helle, jüngere mit langen Rillen. Er umkreist den [Jupiter](objekt:jupiter) in
einer Woche.
```

`en/grundschule/objekt-ganymede.md`:
```markdown
# Ganymede

Ganymede is the largest moon in the whole solar system. It is even bigger than the
planet [Mercury](objekt:mercury), only much lighter, because half of it is ice. It is
the only moon with a magnetic field of its own, like the [Earth](objekt:earth). Its
surface shows dark, old regions full of craters and bright, younger ones with long
grooves. It circles [Jupiter](objekt:jupiter) in one week.
```

`de/grundschule/objekt-callisto.md`:
```markdown
# Kallisto

Kallisto ist der äußerste der vier großen Monde des [Jupiter](objekt:jupiter). Seine
dunkle Oberfläche ist über und über mit Kratern bedeckt, mehr als bei jedem anderen
Körper im Sonnensystem. Sie ist uralt und hat sich seit Milliarden Jahren kaum
verändert. Kallisto ist fast so groß wie [Merkur](objekt:mercury) und braucht gut
zwei Wochen für eine Runde um Jupiter.
```

`en/grundschule/objekt-callisto.md`:
```markdown
# Callisto

Callisto is the outermost of the four big moons of [Jupiter](objekt:jupiter). Its
dark surface is covered all over with craters, more than any other body in the solar
system. It is ancient and has hardly changed in billions of years. Callisto is
almost as big as [Mercury](objekt:mercury) and needs a good two weeks for one lap
around Jupiter.
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS, 38 Dateien.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Grundschultexte: Jupiter, Io, Europa, Ganymed, Kallisto"
```

---

### Task 4: Saturnmonde

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/grundschule/objekt-{mimas,enceladus,tethys,dione,rhea,titan,iapetus}.md`

**Schnittstellen:**
- Konsumiert: `objekt:saturn`, `objekt:enceladus`, `objekt:titan`, `objekt:mercury`, `objekt:moon`, `szene:enceladus-hell`, `szene:titan-dunst`, `szene:iapetus-schief`, `quelle:nasa-cassini`, `quelle:esa-cassini-huygens`.

- [ ] **Schritt 1: Dateien anlegen**

`de/grundschule/objekt-mimas.md`:
```markdown
# Mimas

Mimas ist ein kleiner Eismond des [Saturn](objekt:saturn), nur etwa 400 Kilometer
groß. Berühmt ist er für einen einzigen riesigen Krater, der fast ein Drittel so
breit ist wie der ganze Mond. Mit dem Krater sieht Mimas aus wie ein Auge, und viele
finden, er erinnert an eine Raumstation aus dem Kino. Der Einschlag hätte den Mond
beinahe zerbrochen.
```

`en/grundschule/objekt-mimas.md`:
```markdown
# Mimas

Mimas is a small icy moon of [Saturn](objekt:saturn), only about 400 kilometres
across. It is famous for a single giant crater that is almost a third as wide as the
whole moon. With that crater Mimas looks like an eye, and many people think it
resembles a space station from the movies. The impact nearly broke the moon apart.
```

`de/grundschule/objekt-enceladus.md`:
```markdown
# Enceladus

Enceladus ist ein kleiner Mond des [Saturn](objekt:saturn), aber ein besonderer:
Seine Oberfläche aus frischem Eis ist so weiß, dass sie fast alles Sonnenlicht
zurückwirft. Am Südpol schießen Fontänen aus Wasser und Eis ins All. Darunter
verbirgt sich ein Ozean. Die Raumsonde [Cassini](quelle:nasa-cassini) ist mitten
durch die Fontänen geflogen. In der Szene [Enceladus hell](szene:enceladus-hell)
leuchtet er dir entgegen.
```

`en/grundschule/objekt-enceladus.md`:
```markdown
# Enceladus

Enceladus is a small moon of [Saturn](objekt:saturn), but a special one: its surface
of fresh ice is so white that it reflects almost all the sunlight. At the south pole
fountains of water and ice shoot into space. An ocean is hidden underneath. The
[Cassini](quelle:nasa-cassini) spacecraft flew right through the fountains. In the
scene [Bright Enceladus](szene:enceladus-hell) it shines towards you.
```

`de/grundschule/objekt-tethys.md`:
```markdown
# Tethys

Tethys ist ein Eismond des [Saturn](objekt:saturn), gut 1000 Kilometer groß und so
leicht, dass er fast nur aus Wassereis bestehen muss. Zwei Dinge fallen auf ihm
auf: ein riesiger Krater namens Odysseus und ein gewaltiger Graben, der sich fast
einmal um den ganzen Mond zieht. Tethys teilt sich seine Bahn mit zwei winzigen
Begleitern, die ihm vorauslaufen und folgen.
```

`en/grundschule/objekt-tethys.md`:
```markdown
# Tethys

Tethys is an icy moon of [Saturn](objekt:saturn), a good 1,000 kilometres across and
so light that it must be made almost entirely of water ice. Two things stand out on
it: a huge crater called Odysseus and an enormous trench that runs almost all the
way around the moon. Tethys shares its orbit with two tiny companions that run ahead
of it and behind it.
```

`de/grundschule/objekt-dione.md`:
```markdown
# Dione

Dione ist ein Eismond des [Saturn](objekt:saturn), etwas größer als Tethys. Auf
seiner Rückseite ziehen sich helle Streifen über die dunklere Oberfläche. Von Nahem
sind das hohe Klippen aus Eis, die entstanden sind, als die Kruste des Mondes
aufgerissen wurde. Dione zeigt Saturn immer dieselbe Seite, so wie unser
[Mond](objekt:moon) der Erde.
```

`en/grundschule/objekt-dione.md`:
```markdown
# Dione

Dione is an icy moon of [Saturn](objekt:saturn), slightly bigger than Tethys. On its
far side bright streaks run across the darker surface. Up close these are tall
cliffs of ice that formed when the moon's crust was torn open. Dione always shows
Saturn the same side, just as our [Moon](objekt:moon) does to the Earth.
```

`de/grundschule/objekt-rhea.md`:
```markdown
# Rhea

Rhea ist der zweitgrößte Mond des [Saturn](objekt:saturn), gut 1500 Kilometer groß.
Sie besteht überwiegend aus Eis mit einem kleinen Anteil Gestein und ist über und
über mit Kratern bedeckt. Rhea ist der äußerste der großen Eismonde, die Saturn
nah umkreisen; nur [Titan](objekt:titan) und Iapetus liegen weiter draußen. Für eine
Runde um Saturn braucht sie viereinhalb Tage.
```

`en/grundschule/objekt-rhea.md`:
```markdown
# Rhea

Rhea is the second largest moon of [Saturn](objekt:saturn), a good 1,500 kilometres
across. It is made mostly of ice with a small share of rock and is covered all over
with craters. Rhea is the outermost of the big icy moons that circle Saturn closely;
only [Titan](objekt:titan) and Iapetus lie further out. It needs four and a half
days for one lap around Saturn.
```

`de/grundschule/objekt-titan.md`:
```markdown
# Titan

Titan ist der größte Mond des [Saturn](objekt:saturn) und sogar größer als der
Planet [Merkur](objekt:mercury). Als einziger Mond hat er eine dicke Lufthülle. Sie
ist orange und so dunstig, dass man die Oberfläche nicht sieht. Dort unten gibt es
Seen und Flüsse, aber nicht aus Wasser, sondern aus flüssigem Gas, denn es ist
bitterkalt. Die Sonde [Huygens](quelle:esa-cassini-huygens) ist dort gelandet.
Szene: [Titans Dunst](szene:titan-dunst).
```

`en/grundschule/objekt-titan.md`:
```markdown
# Titan

Titan is the largest moon of [Saturn](objekt:saturn) and even bigger than the planet
[Mercury](objekt:mercury). It is the only moon with a thick atmosphere. It is orange
and so hazy that you cannot see the surface. Down there are lakes and rivers, but
not of water: they are made of liquid gas, because it is bitterly cold. The
[Huygens](quelle:esa-cassini-huygens) probe landed there. Scene:
[Titan's haze](szene:titan-dunst).
```

`de/grundschule/objekt-iapetus.md`:
```markdown
# Iapetus

Iapetus ist ein Mond des [Saturn](objekt:saturn) mit zwei Gesichtern: Eine Hälfte
ist dunkel wie Kohle, die andere hell wie Schnee. Der dunkle Staub sammelt sich auf
der Seite, die beim Umlauf vorn liegt. Rund um seinen Bauch verläuft ein Gebirge,
so dass er aussieht wie eine Walnuss. Seine Bahn ist schief geneigt, das zeigt die
Szene [Iapetus schief](szene:iapetus-schief).
```

`en/grundschule/objekt-iapetus.md`:
```markdown
# Iapetus

Iapetus is a moon of [Saturn](objekt:saturn) with two faces: one half is dark as
coal, the other bright as snow. The dark dust collects on the side that leads the
way as it orbits. A mountain range runs around its middle, so it looks like a
walnut. Its orbit is tilted, which the scene [Tilted Iapetus](szene:iapetus-schief)
shows.
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS, 52 Dateien.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Grundschultexte: Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Iapetus"
```

---

### Task 5: Uranus, Neptun und ihre Monde

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/grundschule/objekt-{uranus,miranda,ariel,umbriel,titania,oberon,neptune,triton}.md`

**Schnittstellen:**
- Konsumiert: `objekt:earth`, `objekt:uranus`, `objekt:neptune`, `objekt:saturn`, `objekt:moon`, `szene:uranus-gekippt`, `szene:ferne-sonne`, `szene:triton-rueckwaerts`.

- [ ] **Schritt 1: Dateien anlegen**

`de/grundschule/objekt-uranus.md`:
```markdown
# Der Uranus

Uranus ist ein Eisriese, viermal so breit wie die [Erde](objekt:earth), und
schimmert blaugrün, weil ein Gas namens Methan in seinen Wolken das rote Licht
schluckt. Das Besondere: Uranus liegt auf der Seite und rollt gewissermaßen um die
Sonne, seine Pole zeigen abwechselnd zur Sonne. Er hat dünne, dunkle Ringe und über
zwei Dutzend Monde, die nach Figuren aus Theaterstücken heißen. Szene:
[Uranus gekippt](szene:uranus-gekippt).
```

`en/grundschule/objekt-uranus.md`:
```markdown
# Uranus

Uranus is an ice giant, four times as wide as the [Earth](objekt:earth), and it
shimmers blue-green because a gas called methane in its clouds swallows the red
light. The special thing: Uranus lies on its side and more or less rolls around the
Sun; its poles take turns pointing at the Sun. It has thin, dark rings and more than
two dozen moons named after characters from plays. Scene:
[Tilted Uranus](szene:uranus-gekippt).
```

`de/grundschule/objekt-miranda.md`:
```markdown
# Miranda

Miranda ist der kleinste der fünf großen Monde des [Uranus](objekt:uranus) und sieht
aus, als wäre er aus Bruchstücken zusammengesetzt: Glatte Ebenen stoßen an zerfurchte
Rillen und riesige Klippen. Eine davon ist rund 20 Kilometer hoch, mehr als doppelt so
hoch wie der Mount Everest. Wie Miranda so wild geworden ist, wissen Forscher noch
nicht genau.
```

`en/grundschule/objekt-miranda.md`:
```markdown
# Miranda

Miranda is the smallest of the five big moons of [Uranus](objekt:uranus) and looks as
if it were put together from broken pieces: smooth plains meet furrowed grooves and
giant cliffs. One of them is about 20 kilometres high, more than twice the height of
Mount Everest. Scientists do not yet know exactly how Miranda got so wild.
```

`de/grundschule/objekt-ariel.md`:
```markdown
# Ariel

Ariel ist der hellste Mond des [Uranus](objekt:uranus). Seine Oberfläche aus Eis
wird von langen Tälern und Gräben durchzogen, und viele Krater sind zugedeckt, als
hätte einmal weiches Eis darüber geflossen. Ariel ist also innen einmal warm
gewesen. Mit gut 1100 Kilometern ist er etwa ein Drittel so groß wie unser
[Mond](objekt:moon).
```

`en/grundschule/objekt-ariel.md`:
```markdown
# Ariel

Ariel is the brightest moon of [Uranus](objekt:uranus). Its icy surface is crossed by
long valleys and trenches, and many craters are covered over, as if soft ice had once
flowed across them. So Ariel was once warm inside. At a good 1,100 kilometres it is
about a third the size of our [Moon](objekt:moon).
```

`de/grundschule/objekt-umbriel.md`:
```markdown
# Umbriel

Umbriel ist der dunkelste der großen Monde des [Uranus](objekt:uranus). Seine
Oberfläche ist alt, mit vielen Kratern bedeckt und wirft nur wenig Licht zurück. Umso
mehr fällt ein heller Ring am Rand eines Kraters auf, den man Wunda nennt; vielleicht
ist es frisches Eis. Umbriel ist fast genauso groß wie sein Nachbar Ariel, aber ganz
anders gefärbt.
```

`en/grundschule/objekt-umbriel.md`:
```markdown
# Umbriel

Umbriel is the darkest of the big moons of [Uranus](objekt:uranus). Its surface is
old, covered with many craters and reflects only a little light. That makes a bright
ring at the edge of a crater called Wunda stand out all the more; it may be fresh
ice. Umbriel is almost exactly the same size as its neighbour Ariel, but coloured
quite differently.
```

`de/grundschule/objekt-titania.md`:
```markdown
# Titania

Titania ist der größte Mond des [Uranus](objekt:uranus), knapp 1600 Kilometer groß,
also etwa halb so groß wie unser [Mond](objekt:moon). Über ihre Oberfläche ziehen
sich gewaltige Schluchten, hunderte Kilometer lang und mehrere Kilometer tief. Sie
entstanden, als das Innere des Mondes gefror und sich ausdehnte, so dass die Kruste
aufriss. Titania braucht knapp neun Tage für eine Runde um Uranus.
```

`en/grundschule/objekt-titania.md`:
```markdown
# Titania

Titania is the largest moon of [Uranus](objekt:uranus), almost 1,600 kilometres
across, about half the size of our [Moon](objekt:moon). Enormous canyons run across
its surface, hundreds of kilometres long and several kilometres deep. They formed
when the inside of the moon froze and expanded, so that the crust cracked open.
Titania needs almost nine days for one lap around Uranus.
```

`de/grundschule/objekt-oberon.md`:
```markdown
# Oberon

Oberon ist der äußerste der großen Monde des [Uranus](objekt:uranus) und fast so
groß wie Titania. Seine alte Oberfläche ist voller Krater; in manchen liegt dunkles
Material am Boden, das wohl aus dem Inneren hochgekommen ist. Am Rand des Mondes ragt
ein Berg auf, der etwa sechs Kilometer hoch ist. Oberon braucht fast zwei Wochen für
eine Runde um Uranus.
```

`en/grundschule/objekt-oberon.md`:
```markdown
# Oberon

Oberon is the outermost of the big moons of [Uranus](objekt:uranus) and almost as
large as Titania. Its old surface is full of craters; some have dark material on
their floors that probably came up from the inside. At the edge of the moon a
mountain rises about six kilometres high. Oberon needs almost two weeks for one lap
around Uranus.
```

`de/grundschule/objekt-neptune.md`:
```markdown
# Der Neptun

Neptun ist der äußerste Planet und tiefblau. Er ist ein Eisriese, fast so groß wie
Uranus, und auf ihm wehen die schnellsten Winde im Sonnensystem, weit über tausend
Kilometer in der Stunde. Weil er so weit weg ist, braucht er 165 Jahre für einen
Umlauf um die Sonne, die von dort nur noch wie ein sehr heller Stern aussieht. Das
zeigt die Szene [Ferne Sonne](szene:ferne-sonne). Sein größter Mond ist
[Triton](objekt:triton).
```

`en/grundschule/objekt-neptune.md`:
```markdown
# Neptune

Neptune is the outermost planet and deep blue. It is an ice giant, almost as big as
Uranus, and the fastest winds in the solar system blow on it, well over a thousand
kilometres per hour. Because it is so far away it needs 165 years for one trip
around the Sun, which from there looks only like a very bright star. The scene
[Distant Sun](szene:ferne-sonne) shows this. Its largest moon is
[Triton](objekt:triton).
```

`de/grundschule/objekt-triton.md`:
```markdown
# Triton

Triton ist der größte Mond des [Neptun](objekt:neptune) und läuft als einziger
großer Mond rückwärts um seinen Planeten, entgegen dessen Drehung. Deshalb glauben
Forscher, dass Neptun ihn irgendwann eingefangen hat. Triton ist einer der kältesten
Orte im Sonnensystem, und trotzdem schießen dort Fontänen aus Stickstoff aus dem Eis.
In der Szene [Triton rückwärts](szene:triton-rueckwaerts) siehst du seine Bahn.
```

`en/grundschule/objekt-triton.md`:
```markdown
# Triton

Triton is the largest moon of [Neptune](objekt:neptune) and the only big moon that
runs backwards around its planet, against the planet's spin. That is why scientists
believe Neptune captured it at some point. Triton is one of the coldest places in
the solar system, and yet fountains of nitrogen shoot out of its ice. In the scene
[Triton backwards](szene:triton-rueckwaerts) you can see its orbit.
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS, 68 Dateien.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Grundschultexte: Uranus, Miranda, Ariel, Umbriel, Titania, Oberon, Neptun, Triton"
```

---

### Task 6: Zwergplaneten

**Dateien:**
- Erstellen: `src/data/texte/{de,en}/grundschule/objekt-{pluto,charon,ceres,eris,haumea,makemake}.md`

**Schnittstellen:**
- Konsumiert: `objekt:pluto`, `objekt:charon`, `objekt:moon`, `objekt:mars`, `objekt:jupiter`, `objekt:neptune`, `szene:pluto-charon`, `szene:ceres-guertel`.

- [ ] **Schritt 1: Dateien anlegen**

`de/grundschule/objekt-pluto.md`:
```markdown
# Der Pluto

Pluto ist ein Zwergplanet weit draußen hinter [Neptun](objekt:neptune). Er ist
kleiner als unser [Mond](objekt:moon) und braucht 248 Jahre für eine Runde um die
Sonne. Auf seiner Oberfläche aus Eis liegt eine riesige helle Fläche in Form eines
Herzens. Sein Mond [Charon](objekt:charon) ist halb so groß wie er, die beiden
umkreisen einander wie ein Paar. Die Szene
[Pluto und Charon](szene:pluto-charon) zeigt den Tanz.
```

`en/grundschule/objekt-pluto.md`:
```markdown
# Pluto

Pluto is a dwarf planet far out beyond [Neptune](objekt:neptune). It is smaller than
our [Moon](objekt:moon) and needs 248 years for one lap around the Sun. On its icy
surface lies a huge bright area in the shape of a heart. Its moon
[Charon](objekt:charon) is half its size; the two circle each other like a pair.
The scene [Pluto and Charon](szene:pluto-charon) shows the dance.
```

`de/grundschule/objekt-charon.md`:
```markdown
# Charon

Charon ist der große Mond des [Pluto](objekt:pluto), halb so breit wie Pluto selbst.
Kein anderer Mond ist im Vergleich zu seinem Planeten so groß. Die beiden zeigen
einander immer dieselbe Seite und drehen sich in gut sechs Tagen umeinander, als
wären sie mit einer Stange verbunden. Charons Nordpol ist dunkelrot gefärbt, mit
Stoff, der von Pluto herübergeweht ist.
```

`en/grundschule/objekt-charon.md`:
```markdown
# Charon

Charon is the big moon of [Pluto](objekt:pluto), half as wide as Pluto itself. No
other moon is so large compared with its planet. The two always show each other the
same side and turn around each other in a good six days, as if they were joined by
a rod. Charon's north pole is coloured dark red, with material that drifted over
from Pluto.
```

`de/grundschule/objekt-ceres.md`:
```markdown
# Ceres

Ceres ist der größte Brocken im Asteroidengürtel zwischen [Mars](objekt:mars) und
[Jupiter](objekt:jupiter) und der einzige Zwergplanet dort. Sie ist rund 940
Kilometer groß, also etwa ein Viertel so breit wie unser [Mond](objekt:moon). In
einem Krater leuchten helle Flecken aus Salz, das aus salzigem Wasser im Inneren
stammt. Die Szene [Ceres im Gürtel](szene:ceres-guertel) zeigt ihre Nachbarschaft.
```

`en/grundschule/objekt-ceres.md`:
```markdown
# Ceres

Ceres is the biggest chunk in the asteroid belt between [Mars](objekt:mars) and
[Jupiter](objekt:jupiter) and the only dwarf planet there. It is about 940
kilometres across, roughly a quarter as wide as our [Moon](objekt:moon). In one
crater bright spots of salt shine, left behind by salty water from the inside. The
scene [Ceres in the belt](szene:ceres-guertel) shows its neighbourhood.
```

`de/grundschule/objekt-eris.md`:
```markdown
# Eris

Eris ist ein Zwergplanet, fast so groß wie [Pluto](objekt:pluto), aber schwerer und
dreimal so weit von der Sonne entfernt. Für eine Runde braucht sie über 550 Jahre.
Als Eris 2005 entdeckt wurde, mussten sich die Astronomen entscheiden, was ein
Planet ist, und seitdem heißen Pluto und Eris Zwergplaneten. Eris hat einen kleinen
Mond namens Dysnomia.
```

`en/grundschule/objekt-eris.md`:
```markdown
# Eris

Eris is a dwarf planet, almost as big as [Pluto](objekt:pluto), but heavier and
three times as far from the Sun. It needs over 550 years for one lap. When Eris was
discovered in 2005, astronomers had to decide what a planet is, and since then Pluto
and Eris have been called dwarf planets. Eris has a small moon called Dysnomia.
```

`de/grundschule/objekt-haumea.md`:
```markdown
# Haumea

Haumea ist ein Zwergplanet hinter [Neptun](objekt:neptune) und sieht aus wie ein
Ei: Sie dreht sich so schnell, in nur vier Stunden, dass sie in die Länge gezogen
wird. Ihre Oberfläche ist mit Eis bedeckt. Haumea hat zwei kleine Monde und sogar
einen dünnen Ring, den man erst 2017 entdeckt hat, als sie vor einem Stern
vorbeizog.
```

`en/grundschule/objekt-haumea.md`:
```markdown
# Haumea

Haumea is a dwarf planet beyond [Neptune](objekt:neptune) and looks like an egg: it
spins so fast, in just four hours, that it is stretched out lengthways. Its surface
is covered with ice. Haumea has two small moons and even a thin ring, which was only
discovered in 2017 when it passed in front of a star.
```

`de/grundschule/objekt-makemake.md`:
```markdown
# Makemake

Makemake ist ein Zwergplanet weit draußen hinter [Neptun](objekt:neptune), etwa zwei
Drittel so groß wie [Pluto](objekt:pluto). Er schimmert rötlich, weil auf seinem Eis
Stoffe liegen, die das Sonnenlicht dunkel gefärbt hat. Für einen Umlauf um die Sonne
braucht er gut 300 Jahre. Makemake hat einen kleinen, dunklen Mond, der erst 2016
gefunden wurde.
```

`en/grundschule/objekt-makemake.md`:
```markdown
# Makemake

Makemake is a dwarf planet far out beyond [Neptune](objekt:neptune), about two
thirds the size of [Pluto](objekt:pluto). It shimmers reddish, because substances
lie on its ice that sunlight has coloured dark. It needs a good 300 years for one
trip around the Sun. Makemake has a small, dark moon that was only found in 2016.
```

- [ ] **Schritt 2: Prüfen**

Run: `npx vitest run src/data/texte`
Expected: PASS, 80 Dateien (Fall „gibt es"), 402 Fälle in dieser Datei.

- [ ] **Schritt 3: Commit**

```bash
git add src/data/texte
git commit -m "Grundschultexte: Pluto, Charon, Ceres, Eris, Haumea, Makemake"
```

---

### Task 7: Abnahme, README, Abschluss

**Dateien:**
- Erstellen: `docs/phase4c-etappe2-abnahme.md`
- Ändern: `README.md` (Absatz „Stand")

- [ ] **Schritt 1: Server und Stand** — `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/Orrery/` → `200`; `git status --short` leer; `git log --oneline -1` notieren; `ls src/data/texte/*/grundschule | grep -c objekt-` → 70 (35 je Sprache).

- [ ] **Schritt 2: Dateitest gezielt** — `npx vitest run src/data/texte/dateien.test.ts` und die Schlusszeile (Fälle) ins Protokoll; Erwartung 402 Fälle (80 Dateien × 5 + 2).

- [ ] **Schritt 3: Rundgang im Browser** — `browser_navigate` auf `http://localhost:5173/Orrery/`, `window.store.setState({ quality: { tier: 'high' } })`, Tab „Grundschule" wählen (`setInfo({ niveau: 'grundschule' })`). Dann per `browser_run_code_unsafe` alle 35 Körper durchgehen:
```js
async () => {
  const alle = ['sun','mercury','venus','earth','moon','mars','phobos','deimos','jupiter','io','europa','ganymede','callisto','saturn','mimas','enceladus','tethys','dione','rhea','titan','iapetus','uranus','miranda','ariel','umbriel','titania','oberon','neptune','triton','pluto','charon','ceres','eris','haumea','makemake'];
  const aus = [];
  for (const id of alle) {
    window.store.getState().setCamera({ targetId: id });
    await new Promise((r) => setTimeout(r, 400));
    const kopf = document.querySelector('aside.info-panel h2')?.textContent ?? '';
    const hinweis = [...document.querySelectorAll('aside.info-panel p')].some((p) => p.textContent?.includes('noch keinen Text'));
    const knoepfe = document.querySelectorAll('aside.info-panel [role=tabpanel] button').length;
    aus.push({ id, kopf, hinweis, knoepfe });
  }
  return aus;
}
```
Erwartet: für jeden Körper `hinweis: false`, `kopf` gleich der Überschrift der Datei (etwa „Der Merkur"), `knoepfe` ≥ 1 (mindestens ein Objektverweis). Tabelle ins Protokoll. Danach Sprache auf Englisch (`setUi({ language: 'en' })`) und denselben Lauf wiederholen; erwartet `kopf` gleich der englischen Überschrift und keine Zeile „Not translated yet".

- [ ] **Schritt 4: Verweise stichprobenartig** — bei Phobos (Grundschule) auf „Tiefflug" klicken → `cinema.running` true, `cinema.nummer` = Index von `phobos-tiefflug` (8); Kino beenden (Escape). Bei Enceladus auf „Cassini" klicken → Karte `nasa-cassini` hervorgehoben (Klasse `border-sky-300`), Tabs unverändert 1. Bei Jupiter auf „Europa" klicken → `camera.targetId` = `europa`, Kopf „Europa".

- [ ] **Schritt 5: Gymnasium-Tab bei Körpern ohne Text** — Tab „Gymnasium", Ziel Mars: Hinweis „Zu diesem Eintrag gibt es noch keinen Text." und Datenblock sichtbar (Text folgt in 4c-3). Ziel Erde: Text vorhanden, kein Hinweis.

- [ ] **Schritt 6: Konsole** — `browser_console_messages`: 0 Fehler, 0 Warnungen (sonst wörtlich ins Protokoll).

- [ ] **Schritt 7: Lint, Test, Build** — `npm run lint`, `npm test`, `npm run build`; Schlusszeilen und Testzahl ins Protokoll (Erwartung: 1126 + 330 = 1456 Tests).

- [ ] **Schritt 8: Protokoll `docs/phase4c-etappe2-abnahme.md`** — Aufbau wie `docs/phase4c-etappe1-abnahme.md`: Kopf (Datum, Branch, Commit, Prüfumgebung), je Schritt die wörtlichen Werte, Konsole, Lint/Test/Build, „Bekannte Unschärfen": (1) Gymnasium- und Hochschul-Tab zeigen bei 33 Körpern noch den Hinweis „kein Text" (4c-3); (2) Grundschultexte verlinken keine Themen (Ruling 1, bis 4c-4); (3) Zahlen in den Texten sind gerundete Richtwerte, die Kennzahlen stehen im Datenblock. Das Kriterium „Infopanel mit abgeleiteten Live-Werten" ist seit 4c-1 erfüllt; hier wird das Kriterium aus Entwurf §7 Punkt 2 („35 Texte Deutsch und Englisch") bewertet.

- [ ] **Schritt 9: README** — im Absatz „Stand": 4c Etappe 2 (Grundschultexte für alle 35 Körper in Deutsch und Englisch) abgeschlossen; Gymnasialtexte folgen in 4c-3, Szenen und Themen in 4c-4.

- [ ] **Schritt 10: Commit**

```bash
git add docs/phase4c-etappe2-abnahme.md README.md
git commit -m "Abnahme 4c Etappe 2: Grundschultexte für alle Körper"
```

## Abschluss

- [ ] `npm run lint`, `npm test`, `npm run build` auf dem Branch, Ausgabe zeigen.
- [ ] Die lokale Projektanleitung im Abschnitt „Stand" nachziehen (4c-2 auf master, Testzahl, nächster Schritt 4c-3 Gymnasium-Texte mit Katalog auf rund 60 Quellen; Rulings unten).
- [ ] Fast-Forward nach `master`, Branch `grundschule` löschen, `.playwright-mcp/` leeren. Tag: keiner (Phase 4 wird erst nach 4c-4 getaggt).
- [ ] Rulings gesammelt an Jens melden.

## Rulings

Entscheidungen während der Planung, die vom Entwurf abweichen oder ihn präzisieren; Jens bestätigt oder kippt sie:

1. **Keine `thema:`-Verweise in Grundschultexten.** Themen bekommen erst in 4c-4 Texte; ein Verweis führte bis dahin in eine Sackgasse (Befund der Abschlussprüfung 4c-1). Die Grundschultexte verweisen auf Körper, Szenen und Quellen.
2. **Verweise auf Szenen und Quellen sind erlaubt und erwünscht,** wo sie zum Körper passen (Entwurf §4.3 nennt sie als Schemata; §6 verlangt keine bestimmte Dichte). Die Szene `galileisches-schattenspiel` wird nicht verlinkt (laut lokaler Projektanleitung nicht weiterverfolgt).
3. **Texte wörtlich aus dem Plan.** Der Entwurf verlangt Texte, aber keinen Autor; damit die Prüfung je Task etwas Festes hat, stehen die Texte im Plan und der Umsetzer überträgt sie. Kürzungen nur, wenn der Dateitest die Wortgrenze reißt, und dann im Report benannt.
4. **Sechs Teilcommits je Körpergruppe** (Sonne und innere Planeten; Erd- und Marsmonde; Jupiter-System; Saturnmonde; Uranus- und Neptun-System; Zwergplaneten) statt „je Planetensystem" (Entwurf §7), damit kein Task mehr als 16 Dateien trägt.
5. **Zahlen in Grundschultexten sind gerundete Richtwerte** („gut 20 Kilometer", „248 Jahre"); die genauen Kennzahlen liefert der Datenblock aus dem Datensatz, deshalb stehen im Text keine Werte, die dem Datensatz widersprechen könnten (Radien, Umlaufzeiten nur grob).
