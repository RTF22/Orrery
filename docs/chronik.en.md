# Development Chronicle

**English** | [Deutsch](chronik.de.md)

A condensed overview of the entire development is provided by
[the overview](entstehung.en.md); this chronicle supplies the details for each stage — as
evidence for two claims at once: Orrery as a tool for science communication, and the working
method described here as a path to building a deterministic, verifiable application with a
non-deterministically working language model.

Every stage follows the same structure: **Goal** names the intent at the outset,
**Decisions** the choices made in the design document or by Jens Fricke, **Result** the
figures measured at the end, **Errors and Corrections** the cases recorded in the material
along with the review that caught them, and **Tokens** the stage's language-model
consumption. The short hashes in parentheses and under **Commits** are commits in the
`RTF22/Orrery` repository and can be looked up with `git show <hash>`. Where a screenshot
fits a stage, it appears directly below it, with alt text. Inserted stages (Clickable Hit
Areas, Time Range, Flight) come after the phase in which they began, and overlap in time
with phase 4c and phase 4d respectively.

## Contents

1. [The Idea](#idee)
2. [Phase 1: Vertical Slice](#phase-1)
3. [Phase 2: Cinema Mode](#phase-2)
4. [Phase 3a: Catalogue Expansion and Rings](#phase-3a)
5. [Phase 3b: Belt and Shadows](#phase-3b)
6. [Phase 4a: English and Language Switching](#phase-4a)
7. [Phase 4b: Persistence and Views](#phase-4b)
8. [Phase 4c: Info Panel](#phase-4c)
9. [Clickable Hit Areas](#klickflaechen)
10. [Time Range](#zeitbereich)
11. [Flight: Keyboard, Mouse, and Controller](#flug)
12. [Phase 4d: University-Level Texts](#phase-4d)
13. [Follow-up After Phase 4d](#nachfuehrung-4d)
14. [Phase 5: Interface, Mobile, Textures, Music](#phase-5)
15. [Phase 6: Milky Way](#phase-6)
16. [Info Card](#infokarte)
17. [Odds and Ends](#kleinigkeiten)
18. [Path to the Domain](#domain)
19. [Appendix: Token Balance](#anhang-tokens)

<a id="idee"></a>
## The Idea (11 September 2026)

**Goal:** The initial prompt to the AI coding assistant Claude Code (Anthropic) explicitly
required starting with the brainstorming skill and interviewing the user before planning or
writing any code, asking the questions one at a time, each time proposing a well-reasoned
recommendation, and at the end summarizing a design document for approval; only after that
should an implementation plan follow, then implementation in small, testable steps
(`docs/ursprungsprompt.md`). This sequence — brainstorming, design document, approval, plan,
implementation, acceptance — runs through the entire project. The skills used for this come
from the Superpowers collection (a plugin by Jesse Vincent).

**Decisions:** From the interview for the design document (Jens Fricke, 11 September 2026):
Orrery is to be a learning tool and a showpiece in equal measure; the orbit model computes
analytically by Kepler's laws, is data-driven, and testable against reference values; the
repository stays private until completion, with GitHub Pages planned only for the finish.

**Result:** Design document (`docs/superpowers/specs/2026-09-11-sonnensystem-design.md`) and
initial prompt (`docs/ursprungsprompt.md`) recorded, along with the decision to keep the
repository private until completion and without deployment. Between the first and the last
of these two commits, fewer than three minutes passed according to the timestamps (19:58:18
to 20:01:07); the 63 responses assigned to this stage lie, according to the token balance,
entirely in the main session, none of them in a subagent run. No code yet, no tests yet.

**Errors and Corrections:** For this stage, the reviewed logs record no case — there was no
code yet that could have failed. The first case recorded here comes only from phase 4c.

**Tokens:** 230,581 output tokens, 8,843,552 cache-read tokens across 63 responses
(identifier `idee`). Of these, 28 responses fall chronologically before the official start
of this phase and were nonetheless assigned to it, because the timeline recognises no
earlier phase. Already on 11 September 2026, 1 main session and 19 subagent runs were
running alongside it. Within this phase itself, 0.0% of the output tokens went to
subagents (63 main-session responses, 0 subagent responses); the predominant model here was
Claude Opus 5 (100.0% of the output tokens).
The duration given per stage in the following sections is the pure calendar time between the
first and the last assigned commit, not a measured workload.

**Commits:** `32072ef`, `b9e4283`.

<a id="phase-1"></a>
## Phase 1: Vertical Slice (11–12 September 2026, v0.1.0)

**Goal:** a working, vertical slice of the simulation — the complete chain from input to
rendering, run through once end to end, before the catalogue grows.

**Decisions:** From the same round of interviews, the order of implementation was set:
slice first, then the cinema mode brought forward (ahead of the catalogue expansion), then
the catalogue, then comfort features, and finally sound and polish.

**Result:** 152 tests in 27 test files at completion, tag `v0.1.0`. The stage ran from the
evening of 11 September 2026 (`89b0284`, 20:28) to the early morning of 12 September 2026
(`bf025fd`, 07:37) — about 11.1 hours according to the timestamps. On the day it finished,
4 main sessions and 62 subagent runs were already running.

![Early development state v0.1.0 with a simple interface.](bilder/entstehung/alt-v0.1.0.jpg)

**Errors and Corrections:** For this stage, the reviewed logs record no case.

**Tokens:** 1,187,833 output tokens, 175,356,549 cache-read tokens across 1,126 responses
(identifier `phase-1`; 354 main-session, 772 subagent responses); 64.3% of this phase's
output tokens went to subagents, the predominant model was Claude Sonnet 5 (63.4% of the
output tokens), ahead of Claude Opus 5 (35.7%).

**Commits:** `89b0284`, `bf025fd`.

<a id="phase-2"></a>
## Phase 2: Cinema Mode (12 September 2026, v0.2.0)

**Goal:** a cinema mode with a hideable interface, true full screen, and an automatic
camera flight — brought forward, per the interview decision, ahead of the actual catalogue
expansion.

**Decisions:** For this stage, the material records no decision block of its own; the
order — cinema mode directly after the slice, before the catalogue expansion — follows the
prioritisation already made in the idea phase (see above).

**Result:** 240 tests in 39 test files at completion, tag `v0.2.0` (tag commit `125696f`,
set by fast-forward onto master, chronologically already after the start of phase 3a). The
stage itself ran entirely during the morning of 12 September 2026, from `a1d4c5a` (08:10) to
`ff68df5` (09:04) — just under an hour (0.9 hours according to the timestamps).

**Errors and Corrections:** For this stage, the reviewed logs record no case.

**Tokens:** 147,022 output tokens, 51,721,718 cache-read tokens across 171 responses
(identifier `phase-2`; all 171 in the main session, no subagent response); 0.0% of this
phase's output tokens went to subagents, the predominant model was Claude Opus 5 (100.0%
of the output tokens).

**Commits:** `a1d4c5a`, `ff68df5`, `125696f`.

<a id="phase-3a"></a>
## Phase 3a: Catalogue Expansion and Rings (12–13 September 2026)

**Goal:** expand the body catalogue to 20 moons and 5 dwarf planets, and render rings.

**Decisions:** textures where available, otherwise a fallback colour; the planetary pole
serves as the reference datum, with moon orbital plane, ring plane, and axial tilt each
coming from a single number; rings are lit, visible from both sides, and computed with
forward scattering. The depth of review demanded invariants across all scenes and a
worked calculation for spot checks — an explicit wish of the client. Also inserted into
this stage was an intermediate step on target exposure and albedo (commits `bc0de15`…
`a369f57`); its substantive decisions appear together with those of phase 3b in the
following section.

**Result:** 689 tests in 44 test files (already 721 in the next run), main chunk
1,096.84 kB (gzip 290.66 kB). The stage took about 22.1 hours according to the
timestamps and ran from 12 September 2026 (67 commits, the day with the most commits of
the first three days) into 13 September 2026.

**Errors and Corrections:** For this stage too, the reviewed logs record no case.

**Tokens:** 4,344,979 output tokens, 724,412,063 cache-read tokens across 3,851 responses
(identifier `phase-3a`; 634 main-session, 3,217 subagent responses); 79.4% of this
phase's output tokens went to subagents, the predominant model was Claude Sonnet 5
(73.9% of the output tokens), ahead of Claude Opus 5 (15.4%).

**Commits:** `0a69089`, `750bef7`, `bc0de15`, `a369f57`.

<a id="phase-3b"></a>
## Phase 3b: Belt and Shadows (13 September 2026, v0.3.0)

**Goal:** an asteroid belt and true shadows with eclipses.

**Decisions:** The belt runs as `THREE.Points` with orbit computation in the vertex
shader instead of as an `InstancedMesh`, because 50,000 Kepler solves per frame would
have been too expensive in JavaScript. Shadows arise via analytical occluders instead of
shadow maps, because of the huge range of scales, logarithmic depth, and an exact
penumbra from circle overlap. Exposure follows the camera's target rather than a fixed
camera, albedo is a catalogue datum per body, and the Sun and stars remain untouched by
the exposure.

**Result:** Tag `v0.3.0` (tag commit `515f4fe`, 17:46). About 46 minutes later, at 18:32,
the project was renamed to "Orrery" (`6d3409b`). The metrics do not list a separate test
count or main-chunk value for this stage on its own (the next recorded figure already
belongs to phase 4a). The stage took about 8.7 hours according to the timestamps,
entirely on 13 September 2026 — the day with 7 main sessions and 68 subagent runs, on
which phase 3a also ended and phase 4a began. By the end of this third day, according to
the timeline, 147 of the eventual 673 commits to project completion had already been
made (18 on 11 September, 67 on 12 September, 62 on 13 September).

**Errors and Corrections:** For this stage too, the reviewed logs record no case.

**Tokens:** 1,435,858 output tokens, 204,267,920 cache-read tokens across 1,539 responses
(identifier `phase-3b`; 324 main-session, 1,215 subagent responses); 74.8% of this
phase's output tokens went to subagents, the predominant model was Claude Opus 5 (36.9%
of the output tokens), ahead of Claude Sonnet 5 (36.4%).

**Commits:** `d94c497`, `515f4fe`, `6d3409b`, `69e9998`.

<a id="phase-4a"></a>
## Phase 4a: English and Language Switching (13 September 2026)

**Goal:** make the interface switchable to English at runtime, without introducing an
external i18n framework.

**Decisions:** Set by Jens Fricke on 13 September 2026: the starting language is
determined automatically from `navigator.language` (if the value begins with "en", the
app starts in English); instead of a framework, a small, purpose-built solution was
created; the English locale is `en-GB` (day before month, 24-hour clock).

**Result:** 848 tests in 54 test files, main chunk 1,120.22 kB (gzip 298.40 kB). The
stage ran entirely on 13 September 2026, from `6a565c1` (20:12) to `41c0127` (21:25) —
about 1.2 hours. This stage was not given its own git tag; it counts toward the later
tag `v0.4.0`.

**Errors and Corrections:** For this stage, the reviewed logs record no case.

**Tokens:** 463,002 output tokens, 66,461,714 cache-read tokens across 519 responses
(identifier `phase-4a`; 100 main-session, 419 subagent responses); 72.2% of this
phase's output tokens went to subagents, the predominant model was Claude Sonnet 5
(68.0% of the output tokens), ahead of Claude Fable 5.1 (27.8%).

**Commits:** `6a565c1`, `41c0127`.

<a id="phase-4b"></a>
## Phase 4b: Persistence and Views (14 September 2026)

**Goal:** keep state across sessions — shared links, a remembered session, and saved
views — instead of starting from the default state every time.

**Decisions:** Set by Jens Fricke on 14 September 2026: two stages, first validators,
profiles, session, link, and reset, then a dedicated "Views" panel with export and
import; the session is saved automatically and debounced, the "Remember session"
checkbox is on by default; the address bar stays clean, only the "Copy link" button
generates the URL fragment.

**Result:** After stage 1, 58 test files and main chunk 1,125.99 kB (gzip 300.42 kB); at
the end of the stage, 59 test files and main chunk 1,134.38 kB (gzip 302.88 kB). The
entire stage ran during the morning of 14 September 2026, from `f18d527` (07:08) to
`3dee118` (10:10) — about 3.0 hours.

**Errors and Corrections:** For this stage too, the reviewed logs record no case.

**Tokens:** 881,748 output tokens, 103,360,297 cache-read tokens across 903 responses
(identifier `phase-4b`; 234 main-session, 669 subagent responses); 60.0% of this
phase's output tokens went to subagents, the predominant model was Claude Sonnet 5
(45.7% of the output tokens), ahead of Claude Fable 5.1 (40.0%).

**Commits:** `f18d527`, `3dee118`.

<a id="phase-4c"></a>
## Phase 4c: Info Panel (14–17 September 2026, v0.4.0)

**Goal:** an info panel with curated source cards and staggered text levels per body
and topic, plus scene texts and a camera flight.

**Decisions:** Set by Jens Fricke on 14 September 2026: no embedding of external pages,
curated source cards open in a new tab instead; the tabs in the panel are the levels
Primary school, Secondary school, and University, and they switch the text; the text
length is staggered (Primary school 40 to 80, Secondary school 120 to 180 words,
University with no upper limit) — the university level is only wired in technically
here; it is filled only in phase 4d.

**Result:** The source catalogue grew from 24 entries (stage 1) through 62 (stage 3) to
66 at the end of phase 4c; the test count grew in parallel from 1,126 (stage 1) through
1,536 (stage 2) and 1,940 (stage 3, main chunk 1,195.59 kB, gzip 317.66 kB) to 2,892
tests in 82 test files at the end. The stage ran from 14 September 2026 (`022dee6`,
13:25) into the night of 17 September 2026 (`ddccc3a`, 00:16) — about 58.8 hours — and
closed with tag `v0.4.0` (the tag commit is identical to the stage's last commit; the
tag object itself carries a creation date about eight hours later, 08:17 the same day).

![Development stage v0.4.0 with an expanded interface and info text.](bilder/entstehung/alt-v0.4.0.jpg)

**Errors and Corrections:** The primary-school texts initially deviated from the
approved plan: `objekt-phobos` gave a rise count instead of the orbital statement,
`thema-ringe` gave the ring width as "over 250,000 km" (that is the diameter) instead of
"200,000 km wide", `objekt-makemake` compared Makemake to Pluto as "a good half its
size" instead of "two thirds" — caught by the specialist review, corrected in a wave of
fixes that brought 15 primary-school texts verbatim in line with the plan.

**Tokens:** 3,987,747 output tokens, 539,796,022 cache-read tokens across 3,370
responses (identifier `phase-4c`; 810 main-session, 2,560 subagent responses); 62.4%
of this phase's output tokens went to subagents, the predominant model was Claude
Sonnet 5 (47.5% of the output tokens), ahead of Claude Opus 5 (35.5%).

**Commits:** `022dee6`, `70e1c4c`, `c8bb17b`, `ddccc3a`.

<a id="klickflaechen"></a>
## Clickable Hit Areas (15 September 2026)

**Goal:** make bodies, names, and orbits directly clickable in the view, instead of
reachable only through lists.

**Decisions:** According to the acceptance review, Jens decided on 15 September 2026
that clicking again on the already-selected camera target flies back to it (the
zoom-reset effect is intentional), and that clicks in the crowded system view may also
hit an orbit rather than "empty space" — the decision was to leave it that way.

**Result:** 2,003 tests in 81 test files. The stage ran during the afternoon of
15 September 2026, from `ebc5abc` (16:10) to `e9e78c0` (19:28) — about 3.3 hours — and
overlaps in time with phase 4c.

**Errors and Corrections:** A click on a name only visible through hover initially hit
nothing or the wrong target, because `pointerdown` immediately reported `onZeiger(null)`
and the name had already disappeared before `pointerup` — caught by the specialist
review, fixed by keeping the highlight in place for mouse and pen during the press and
triggering `onZeiger(null)` only from a tap threshold, a second pointer, `pointercancel`,
or `pointerleave` (commit `bda469d`). In the system view, a click on Mars instead hit
the moon Deimos, because under extreme distance compression, rank 1 was chosen by depth
rather than by proximity to the pointer centre — caught by pixel measurement, fixed with
a dedicated `glyphe` field per disc and a two-stage ranking (commit `6b43f0c`).

**Tokens:** 984,680 output tokens, 98,857,888 cache-read tokens across 717 responses
(identifier `klickflaechen`; 114 main-session, 603 subagent responses); 78.7% of this
phase's output tokens went to subagents, the predominant model was Claude Sonnet 5
(59.7% of the output tokens), ahead of Claude Opus 5 (34.9%).

**Commits:** `ebc5abc`, `bda469d`, `6b43f0c`, `e9e78c0`.

<a id="zeitbereich"></a>
## Time Range (19 September 2026)

**Goal:** fix a crash found in phase 4d — under linearly extrapolated orbit
computation, Saturn's orbital eccentricity became numerically negative from the year
12,563 onward, the Kepler solver threw an error, and the render loop froze permanently,
caught by the specialist review during phase 4d — and for this, introduce a fixed time
range from 1 January of year 1 to 31 December 9999 with commit `6566e32`.

**Decisions:** From the implementation's rulings — individual, reasoned decisions made
during the running implementation itself in place of a question back to Jens: the date
field deliberately shows years outside 1 to 9999 as empty rather than as an invalid
value; the lower bound stays Julian day 0 (year 1), as chosen by Jens; before the merge,
a dedicated wave of fixes ran for the display of years BC, the date field for years 1 to
99, and the error message after recovering from the crash.

**Result:** 3,689 tests in 93 test files (final state after the rework). The stage ran
during the morning of 19 September 2026, from `ccb398c` (09:57) to `4b77caf` (11:09) —
about 1.2 hours — and overlaps in time with phase 4d.

**Errors and Corrections:** The date field itself truncated `toISOString()` to ten
characters; with a negative year this left out the day, the browser rejected the value,
and the field stayed empty — caught by the specialist review, fixed with the pure
function `jdZuDatumsfeld` in `src/ui/format.ts` (commit `46c7319`).

**Tokens:** 365,863 output tokens, 89,041,341 cache-read tokens across 552 responses
(identifier `zeitbereich`; 70 main-session, 482 subagent responses); 82.2% of this
phase's output tokens went to subagents, the predominant model was Claude Sonnet 5
(70.9% of the output tokens), ahead of Claude Opus 5 (29.1%).

**Commits:** `ccb398c`, `6566e32`, `46c7319`, `4b77caf`.

<a id="flug"></a>
## Flight: Keyboard, Mouse, and Controller (19 September 2026)

**Goal:** free flight through the scene with keyboard and mouse (stage 1), and with an
Xbox controller including a crosshair (stage 2).

**Decisions:** Recorded by Jens Fricke on 19 September 2026: to do everything as
recommended — the rule from §13.5 of the design document stands; the cinema is allowed
to run windowed if Chrome refuses full screen; the right stick and the R3 button no
longer abort a running camera flight, and a recovery is also recognised while a flight
is in progress.

**Result:** After stage 1, 3,769 tests in 98 test files, main chunk 1,291.02 kB (gzip
346.93 kB); after stage 2, 3,832 tests in 101 test files, main chunk 1,299.03 kB (gzip
349.86 kB). The entire stage ran during the afternoon of 19 September 2026, from
`691a0ab` (12:45) to `78e6f1d` (18:15) — about 5.5 hours — and overlaps in time with
phase 4d.

**Errors and Corrections:** At flight start, the camera compared the pose just shown
with the target pose already moved within the same frame, took that for a recovery, and
damped with 0.45 instead of the intended 0.15 seconds — caught by the specialist
review, fixed so that the flight function returns immediately on the entry frame and
the actual flight step only begins one frame later.

**Tokens:** 2,107,770 output tokens, 278,589,820 cache-read tokens across 1,549
responses (identifier `flug`; 274 main-session, 1,275 subagent responses); 74.0% of
this phase's output tokens went to subagents, the predominant model was Claude
Sonnet 5 (51.1% of the output tokens), ahead of Claude Opus 5 (48.9%).

**Commits:** `691a0ab`, `78e6f1d`.

<a id="phase-4d"></a>
## Phase 4d: University-Level Texts (17–23 September 2026, v0.5.0)

**Goal:** alongside Primary school and Secondary school, fill a third, unlimited text
level, "University", with formulas, tables, and primary literature — across eleven
stages (4d-1 to 4d-11), one per body or subject-topic group. Core rule from the design
document: every literature reference is machine-checked against Crossref or arXiv, and
checked in substance against the cited work itself; tool `scripts/pruefe-literatur.ts`,
invoked via `npm run literatur:pruefen`.

**Decisions:** Workflow per text: write → `npm test` and `npm run literatur:pruefen --
--nur <new identifiers>` → a joint commit of text, version, reference list, and
catalogue entries → one specialist review, and in case of error one rework with its
own commit; further review rounds occurred only occasionally, findings left open were
otherwise noted for later (see 4d-3, 4d-5, 4d-7). For the whole phase, the following
also applied: one implementer at a time, rulings instead of questions back during a
running plan, every decision recorded with its reasoning and collected for Jens, and a
comment in the code is no evidence — several stages confirmed this with cases of their
own (below). Each of the eleven stages had its own plan, its own commits, and its own
acceptance review.

### 4d-1: Pilot Texts (17 September 2026)

The first two university-level texts, `thema-bahnelemente` and `objekt-earth`, ran as a
pilot and were accepted with commit `f0963a0`. Three cases came up at once here:
`thema-bahnelemente` attributed to all four outer moons of Uranus, across the board,
"no reliable linear trend over more than 40 years"; that was true for only two of them,
the sole evidence for the blanket statement being a wrong comment in `uranus-monde.ts` —
caught by the specialist review, corrected with commit `a21082a`. The same text
attributed the origin of the moons' rates across the board to "JPL", even though the
orbital period itself actually came from the sidereal period — likewise caught by the
specialist review, corrected in a second, separately documented review round with
commit `dc36107`. `objekt-earth` confused the start of a measurement period (1972) with
the onset of the physical effect itself — caught by the specialist review, corrected
with commit `4e5d336`.

![Info panel at university level on the topic of orbital elements, with formulas.](bilder/entstehung/infopanel-hochschule.jpg)

### 4d-2: Subject Topics (17–19 September 2026)

Topics independent of individual bodies, including internal structure, albedo and
brightness, and the formation of the Solar System (commits `2db1043`…`2008eed`),
accepted with `6a76e77`/`b24fc6a`. In this stage, the specialist review found the
Kepler crash described under [Time Range](#zeitbereich): under linearly extrapolated
orbit computation, Saturn's eccentricity becomes numerically negative from the year
12,563 onward, the Kepler solver throws an error, and the render loop stalls. The
finding itself belongs to 4d-2; its fix ran as its own, inserted stage.

### 4d-3: Sun, Earth–Moon System (19–20 September 2026)

Commits `87320bb`…`512ad5b` (accepted `2df3430`/`512ad5b`). Two cases show how
differently reviews can turn out: on the topic of tidal locking, the model gave Tethys a
libration period of 57.8 instead of the expected 1.89 days — about a factor of 30 — the
specialist review noted this without changing the code; the finding went as a note for
later into the subsequent Tethys body text (stage 4d-7). For the scene "Sunrise over the
limb of the Earth", the review itself was initially mistaken: a first calculation
arrived, because of its own rounding and sign error, at +0.5 instead of +5.275 ppm GM⊕
deviation; only a second, independent calculation confirmed the implementer's original
value.

### 4d-4: Inner Planets (20 September 2026)

Commits `7fcea01`…`1059282`, implemented and accepted in a single day. No error cases
are recorded for this stage.

### 4d-5: Jupiter System (20–21 September 2026)

Commits `fcf9845`…`df715ff`. `objekt-europa` confused two different physical
quantities at one point (tilt angle "as with Io"), caught by the specialist review and
corrected in the rework. A second finding, by contrast, stayed open: a comment in
`scenes.ts` on the scene "The Galilean shadow play" claims that Callisto's orbit
"occasionally" juts out beyond the frame edge — caught by the specialist review, whose
full geometric recalculation found 52.4% of all draws; the text follows its own
calculation, the comment remained unchanged.

### 4d-6: Saturn and Rings (21–22 September 2026)

Commits `c74c4b4`…`53a1d63` (accepted `dde8291`/`53a1d63`). No error cases are recorded
for this stage.

### 4d-7: Mid-sized Saturn Moons (22 September 2026)

Commits `e227ac2`…`f3d579b`. Here too, a code comment proved unsubstantiated: for the
scene "The tilted orbit of Iapetus", `scenes.ts` claims that `distanceInRadii: 40` shows
"Iapetus' complete, clearly tilted orbital ellipse comfortably within the frame" —
caught by the specialist review, whose own frustum test actually showed only 5 to 31 of
72 sample points within the frame. This finding, too, remained in the report as a note
for later, without a code change.

### 4d-8: Uranus System (22 September 2026)

Commits `7dacecb`…`0a8b584`. `objekt-umbriel` confused Ariel's semi-major axis with its
eccentricity at one point, caught by the specialist review and corrected in the rework.

### 4d-9: Neptune, Pluto (23 September 2026)

Accepted with `4e39a04`. `objekt-pluto` and the specialist-reviewed foundational topic
`thema-achsneigung` wrongly attributed Pluto's "chaotic" axial tilt to Dobrovolskis and
Harris 1983; that work in fact describes a stable oscillation. `objekt-pluto` was
corrected still within the stage; for `thema-achsneigung`, the rule "no changes to
specialist-reviewed texts within this stage" initially ruled out a correction, and the
decision was left to Jens. He made it that same day: commit `63d3144`
(23 September 2026, 06:32) corrected `thema-achsneigung` in both languages, including
its reference list. The overall acceptance review of phase 4d noted this correction in
one place but still carried the attribution as open in another — a contradiction within
its own report, which the first draft of this section took over unchanged, until the
review of this part of the chronicle found it by checking the commit itself.

### 4d-10: Dwarf Planets (23 September 2026)

Accepted with `5bed033`: a specialist review caught four attribution errors here at
once. For `objekt-eris`, the damping quantity Q/k₂ = 3200 was wrongly attributed to
frequency-dependent rather than constant damping, and the Dysnomia radius of 350 km was
wrongly attributed to a 2023 paper instead of the actual 2018 source. For
`objekt-makemake`, a D/H value of 3.98·10⁻⁴ was wrongly attributed to the gas phase
instead of methane ice; a comment in `zwergplaneten.ts` also attributed Makemake's tilt
angle range to the wrong paper (Hromakina instead of Parker et al. 2016) — corrected in
the text, the comment remained unchanged.

### 4d-11: Completion (23 September 2026, v0.5.0)

The last topics (`modell`, `sonnensystem`) and the scene `systemblick` completed the
university-level corpus; since then, the file test no longer requires a
secondary-school substitute. Commit `ce8cf95` set the tag `v0.5.0` and, at the same
time, closed out the phase's overall acceptance review. This overall acceptance review
found five further remaining findings — too low a drift rate for the Great Red Spot, an
excessive deviation in the secondary-school text `thema-modell`, process language in
reference lists, an outdated note in a review column, and three unescaped pipe
characters — and referred them to the subsequent stage
[Follow-up After Phase 4d](#nachfuehrung-4d).

**Errors and Corrections:** This phase totals 20 recorded error cases (the Kepler crash
described under [Time Range](#zeitbereich) is added separately and treated there) —
fifteen of them appear above under their stage, five more were found only by the
overall acceptance review; they are described under
[Follow-up After Phase 4d](#nachfuehrung-4d).

**Result:** At the end of 4d-1 there were 6 text files, 3,537 tests, 51 catalogue
entries, 80 source cards, and a main chunk of 1,243.77 kB; at the end of the phase
(4d-11) there were 5,150 tests, 761 catalogue entries, 91 source cards, and 1,453.78 kB,
across a total of 138 university-level files (69 German, 69 English). The German texts
together come to 151,719 words (average 2,199 per file), the English ones to 167,219
(average 2,423) — making 318,938 words of university-level corpus. The literature
catalogue grew to 761 entries, 761 distinct citations, each machine-checked against
Crossref or arXiv. The phase ran, according to the timestamps, for about 152.9 hours,
from 17 September 2026 (`5707089`) to 23 September 2026 (`ce8cf95`).

**Tokens:** 23,807,582 output tokens, 7,178,734,109 cache-read tokens across 24,905
responses (identifier `phase-4d`; 2,254 main-session, 22,651 subagent responses); 87.9%
of this phase's output tokens went to subagents, the predominant model was Claude
Sonnet 5 (54.9% of the output tokens), ahead of Claude Opus 5 (38.1%).

**Commits:** `5707089`, `f0963a0`, `4e39a04`, `5bed033`, `ce8cf95`.

<a id="nachfuehrung-4d"></a>
## Follow-up After Phase 4d (23 September 2026)

**Goal:** work through the remaining findings from phase 4d that the overall acceptance
review had turned up, before phase 5 begins: the Great Red Spot's drift rate, a
deviation in the secondary-school text `thema-modell`, process language in reference
lists, and a technical character problem.

**Decisions:** The specialist-reviewed university-level text `objekt-jupiter` was
allowed to be changed as an exception — an explicit decision from 23 September 2026
against the otherwise-applying rule not to touch specialist-reviewed texts in later
stages. The mechanical clean-up of the process language was split into two tasks
(individually assigned work steps) for the smallest model in use — that ultimately was
not enough, and both attempts had to be reworked (see below).

**Errors and Corrections:** Commit `a323c80` corrected two of the cases found by the
overall acceptance review: the westward drift of the Great Red Spot was given in a
university-level text as "about 0.026° per day" instead of "about 0.26° per day" — a
factor of 10 too small — and the secondary-school text `thema-modell` gave the offset
between the Earth–Moon barycentre and Earth's centre as "under 4,700 km", although the
specialist-reviewed maximum value is 4,928 km; corrected to "about 4,400 to 4,900 km".
The process language itself affected 27 reference lists (about 230 hits across 40 files
under a broad search) and became a lesson in its own right about the smallest model:
the first clean-up commit left 37 rule-matching hits standing instead of removing them
completely — caught by the controller review, a grep-based check ahead of the actual
specialist review; a further commit then brought this down to 0 hits (commits
`5c27397`/`8989c69`). A second attempt on an auxiliary branch
(`sicherung-task3-haiku`, commit `d25d58f`) overshot the mark: it struck "(Runde 1)"
from about 15 unrelated reference lists and deleted note numbers without replacement —
likewise caught by the controller review; the attempt was discarded, the branch was
reset, and the stage was then repeated, together with the rework of Part A, on the
medium model. A third clean-up pass, in the process, also lost model figures in
`objekt-ganymede.md` as well as finding numbers in `objekt-jupiter.md` and
`objekt-mars.md` — caught by the specialist review and restored with commit `b6558f6`.
A third, technical problem concerned three reference-list lines with an unescaped pipe
character `|`, which a first, naive cell count wrongly reported as 51 "wrong cell
counts" across the whole corpus; they were escaped within the same stage, the lines
themselves remaining unchanged in substance. A fifth side note from the overall
acceptance review turned out to be a purely administrative finding: the review column
for `objekt-neptune.md` held a language mix-up to be unresolved that had actually
already been correct since stage 4d-9 — the column itself had simply not been updated.
Finally, the stage also had to deal with its own predecessor: the overall acceptance
review of phase 4d had reported three secondary-school findings (the Uranus solstice
"2028" instead of 2030, the height of Verona Rupes, the Titania/Oberon proportions) as
still open, even though all three had already been fixed since commit `44b760c` of
22 September 2026 — a later task set this straight, without changing the original
report again. Jens drew a lesson from this for the next phase: since then, similarly
rule-bound clean-ups start straight away on the medium model rather than first on the
smallest one.

**Result:** Tests, catalogue, and main chunk stayed unchanged at 5,150 tests, 761
catalogue entries, 91 source cards, and 1,453.78 kB — the stage changed text and
process content, not code. It ran, according to the timestamps, for about one hour, on
23 September 2026, from `218b1f7` (17:42) to `c0b39fb` (18:41).

**Tokens:** 234,231 output tokens, 81,737,072 cache-read tokens across 604 responses
(identifier `nachfuehrung-4d`; 121 main-session, 483 subagent responses); 48.8% of
this phase's output tokens went to subagents, the predominant model was Claude
Opus 5.5 (51.2% of the output tokens), ahead of Claude Sonnet 5 (33.5%).

**Commits:** `218b1f7`, `a323c80`, `8989c69`, `b6558f6`, `c0b39fb`.

<a id="phase-5"></a>
## Phase 5: Interface, Mobile, Textures, Music (23–25 September 2026, v0.6.0)

**Goal:** Continue building after phase 4d in four functional stages — 5-1 Interface,
5-2 Mobile, 5-3 Textures and Loading, 5-4 Music — and finish with stage 5-5.

**Decisions:** The phase's overall acceptance review (Jens Fricke, 25 September 2026)
recorded the hands-on check as free of issues; tag `v0.6.0` was set and pushed to
`master`. It also confirmed the lesson on model choice for rule-bound clean-ups
already drawn during the follow-up after phase 4d (see above).

**Result:** Tests and the main chunk grew from stage to stage: 5-1 5,174 tests
(1,456.56 kB), 5-2 5,192 tests (1,458.08 kB), 5-3 after rework 5,235 tests
(1,523.15 kB), 5-4 5,275 tests, final state (`de97203`) 5,285 tests with the main
chunk unchanged at 1,529.67 kB. Stage 5-3 brought the 1k texture total down to
3,567,420 bytes (target under 4,000,000 bytes) and, after a correction (`63edc93`),
the load time under simulated "Fast 4G" down to a median of 4,543.6 ms (target at
most 5,000 ms) — alongside a repository growth of about 170 MiB for the new texture
tiers (KTX2 total 177,914,750 bytes). According to the timestamps, the phase ran
for about 36.3 hours, from 23 September 2026 (`d326970`, 20:00) to 25 September
2026 (`d0e88f5`, 08:21).

![Compact mode on a smartphone screen with arc navigation at the bottom.](bilder/entstehung/kompakt-handy.jpg)

**Errors and Corrections:** In stage 5-2, `npm run build` (`tsc -b`) rejected the
literal import of `readFileSync` from `node:fs` in `konstanten.test.ts` (TS2591) —
caught by the build, fixed within the same task. In stage 5-3, `texturen-bauen.ts`
compared the 1k sum literally against `breite === 1024` instead of the constant
`ETC1S_BREITE` — caught by the specialist review, corrected in the rework (commit
`257750a`).

**Tokens:** 1,386,592 output tokens, 413,032,693 cache-read tokens across 2,784
responses (identifier `phase-5`; 534 main-session, 2,250 subagent responses); 56.6%
of this phase's output tokens went to subagents, the predominant model was Claude
Sonnet 5 (53.5% of the output tokens), ahead of Claude Opus 5.5 (43.4%).

**Commits:** `d326970`, `626dba1`, `c2d871e`, `1c53656`, `d0e88f5`.

<a id="phase-6"></a>
## Phase 6: Milky Way (25 September 2026, v0.7.0)

**Goal:** Add the Milky Way to the background of the scene.

**Decisions:** From the overall acceptance review (Jens Fricke, 25 September 2026):
the measured Coalsack contrast ratio of 0.707 was accepted, with the brightness
curve left unchanged. The hands-on check passed, tag
`v0.7.0` was set, pushed to `master`, and rolled out to the web space.

**Result:** Tests rose from 5,301 to 5,328, the main chunk from 1,529.67 kB to
1,531.36 kB. The Milky Way's three texture tiers come to 59,941 bytes (1k),
1,069,543 bytes (2k), and 30,310,600 bytes (8k). According to the timestamps, the
stage ran for about 3.4 hours, on 25 September 2026, from `02bb097` (08:45) to
`a576b7b` (12:10); the tag commit `8d1b268` (11:56) falls in between.

![View from Neptune back toward the small, distant Sun against the Milky Way.](bilder/entstehung/ferne-sonne.jpg)

**Errors and Corrections:** The Gaia share of the Milky Way source had been assumed
in the design document to carry the CC BY-SA licence; it is actually CC BY-NC 3.0
IGO (non-commercial, subject to permission) — caught by the specialist review,
resolved with an NC note on the source card and an update to the design document
(Orrery is non-commercial).

**Tokens:** 352,026 output tokens, 136,374,213 cache-read tokens across 644
responses (identifier `phase-6`; 125 main-session, 519 subagent responses); 59.3%
of this phase's output tokens went to subagents, the predominant model was Claude
Sonnet 5 (56.0% of the output tokens), ahead of Claude Opus 5.5 (40.7%).

**Commits:** `02bb097`, `8d1b268`, `a576b7b`.

<a id="infokarte"></a>
## Info Card (25 September 2026, v0.7.1)

**Goal:** Introduce an info card with the tabs App, Controls, and About, plus a
separate "Controls" card.

**Decisions:** The hands-on check on desktop and on the Galaxy A55 found no
issues; the ⓘ symbol, initially too small, moved into the language row of the
header. Tag `v0.7.1` and the deploy were approved.

**Result:** The test count rose in four stages from 5,328 through 5,354 and 5,364
to 5,370 and 5,371, the main chunk from 1,531.36 kB through 1,543.51 kB and
1,548.56 kB to 1,548.89 kB and 1,549.24 kB. According to the timestamps, the stage
ran for about 5.9 hours, on 25 September 2026, from `32fc0b5` (12:26) to `6f8a9d9`
(18:22).

![The open info card with the "Controls" tab and the main keyboard shortcuts.](bilder/entstehung/infokarte.jpg)

**Errors and Corrections:** On desktop (1600×900), the ⓘ symbol turned out to be
too small — caught by Jens' own hands-on check, fixed by moving it into the
language row (commit `f8adc75`). `App.tsx` returned two different tree shapes
depending on whether the card was open, which caused the info card to be
remounted whenever `ui.hidden` changed, losing focus restoration in the process —
caught by the specialist review, fixed by making `App` always return the same tree
shape. `steuerungTakt` did not check whether the info or controls card was open,
so controller and WASD input kept flying, turning, and zooming while a card was
open, and pad A/B kept triggering camera moves — likewise caught by the specialist
review; the lock was extended, and pad B has closed the card ever since.

**Tokens:** 636,957 output tokens, 178,316,206 cache-read tokens across 1,021
responses (identifier `infokarte`; 190 main-session, 831 subagent responses);
68.4% of this phase's output tokens went to subagents, the predominant model was
Claude Sonnet 5 (68.1% of the output tokens), ahead of Claude Opus 5.5 (31.6%).

**Commits:** `32fc0b5`, `f8adc75`, `6f8a9d9`.

<a id="kleinigkeiten"></a>
## Odds and Ends (25 September 2026, v0.7.2)

**Goal:** Work through smaller points left open after the info card.

**Decisions:** The hands-on check was skipped for this stage — Jens left it out;
only the automated evidence counted. Tag `v0.7.2` was approved; the upload to the
web space was to be triggered by Jens himself afterwards.

**Result:** Tests rose from 5,371 to 5,402, the main chunk from 1,549.24 kB to
1,550.81 kB. According to the timestamps, the stage ran for about 1.7 hours, on
25 September 2026, from `f1e308d` (18:37) to `a203f11` (20:17).

**Errors and Corrections:** A type error from a rework (`cinemaControl.test.ts:267`,
TS2349) made `npm run build` (`tsc -b`) fail — caught by the build, fixed at once by
the same implementer and bundled with a test-name rename.

**Tokens:** 334,554 output tokens, 83,144,170 cache-read tokens across 559
responses (identifier `kleinigkeiten`; 89 main-session, 470 subagent responses);
84.6% of this phase's output tokens went to subagents, the predominant model was
Claude Sonnet 5 (84.6% of the output tokens), ahead of Claude Opus 5.5 (15.4%).

**Commits:** `f1e308d`, `a203f11`.

<a id="domain"></a>
## Path to the Domain (25 September 2026)

**Goal:** Put in place the last technical prerequisites for the custom domain, so
that `https://orrery3d.de` works just as well as the existing address
`https://www.jensfricke.com/Orrery/`.

**Decisions:** At the start stood the decision, already made back in the idea
phase, to keep the repository private until completion (see [The Idea](#idee)).
Next came the deploy script together with `.htaccess` and an environment template
on 14 September 2026 (commit `c07b521`), on 19 September 2026 the README change
stating that the repository was now public, the licence still open (commit
`04fe610`), and on 24 September 2026, in stage 5-5, an installable web app with a
full-screen start and its own icon (commit `60fa468`), together with a file-by-file
upload with retries on network errors (commit `217a4f7`).

**Result:** Two commits on 25 September 2026 removed the last technical obstacles:
`1e08dba` (20:25) switched the build to relative paths, because the fixed base
`/Orrery/` produced HTTP 500 responses from the server under the custom domain —
relative paths work under both addresses, the development server stays on
`/Orrery/`. `f3807c7` (20:30) moved the app icons to `symbole/`, because a global
server alias `/icons/` would otherwise have served its own icons there instead of
the app's (404 responses for the favicon and manifest icons). According to
`docs/entwicklung.md`, the site has since run under `https://orrery3d.de` and
`https://www.jensfricke.com/Orrery/`, uploaded via FTPS. According to the
timestamps, the stage itself took about five minutes.

**Errors and Corrections:** For this stage, the reviewed logs record no case.

**Tokens:** 6,458 output tokens, 1,559,177 cache-read tokens across 18 responses
(identifier `domain`; all 18 in the main session, no subagent response); 0.0% of
this phase's output tokens went to subagents, the predominant model was Claude
Opus 5.5 (100.0% of the output tokens).

**Commits:** `c07b521`, `04fe610`, `60fa468`, `1e08dba`, `f3807c7`.

<a id="anhang-tokens"></a>
## Appendix: Token Balance

This appendix summarises the language-model consumption of the entire project,
evaluated from the assistant's local session logs for this project; only sums are
published, never log contents.

**Method:** Every response counts once, identified by its message id; under
streaming, the same response appears in the log several times, so the maximum
value across all lines with the same id is counted per field — without this rule, a
sample for Claude Sonnet 5 came out at only 1.9 instead of 23.8 million output
tokens. Four categories are counted per response: uncached input, output, cache
reads, cache writes. Timestamps are recorded in the logs as UTC and were converted
with a fixed offset of +02:00 to Berlin summer time (which applies throughout
September 2026); the phase assigned to each response follows from the interval of
the respective phase boundaries, and in case of overlap from the most recently
started stage. The cut-off date is the upload of the domain fix (`f3807c7`,
25 September 2026, 20:30).

**Limits:** The logs exist only locally and have not been reconciled against any
billing; the counting method and cut-off date are given here so the numbers can be
put in context.

**Tokens by model (up to the cut-off date):**

| Display name | Responses | Output | Cache reads |
|---|---:|---:|---:|
| Claude Opus 5 | 10,523 | 14,011,620 | 3,015,452,404 |
| Claude Opus 5.5 | 1,646 | 1,747,637 | 452,555,143 |
| Claude Fable 5.1 | 1,976 | 2,623,271 | 473,944,393 |
| Claude Sonnet 5 | 29,164 | 23,833,638 | 6,360,113,132 |
| Claude Haiku 4.5 | 1,586 | 679,317 | 111,541,452 |
| **Total** | **44,895** | **42,895,483** | **10,413,606,524** |

In addition, up to the cut-off date there were 152,983 tokens of uncached input
and 200,194,976 tokens of cache writes (same table).

**Tokens by phase (up to the cut-off date):**

| Identifier | Output | Cache reads |
|---|---:|---:|
| `idee` | 230,581 | 8,843,552 |
| `phase-1` | 1,187,833 | 175,356,549 |
| `phase-2` | 147,022 | 51,721,718 |
| `phase-3a` | 4,344,979 | 724,412,063 |
| `phase-3b` | 1,435,858 | 204,267,920 |
| `phase-4a` | 463,002 | 66,461,714 |
| `phase-4b` | 881,748 | 103,360,297 |
| `phase-4c` | 3,987,747 | 539,796,022 |
| `klickflaechen` | 984,680 | 98,857,888 |
| `phase-4d` | 23,807,582 | 7,178,734,109 |
| `zeitbereich` | 365,863 | 89,041,341 |
| `flug` | 2,107,770 | 278,589,820 |
| `nachfuehrung-4d` | 234,231 | 81,737,072 |
| `phase-5` | 1,386,592 | 413,032,693 |
| `phase-6` | 352,026 | 136,374,213 |
| `infokarte` | 636,957 | 178,316,206 |
| `kleinigkeiten` | 334,554 | 83,144,170 |
| `domain` | 6,458 | 1,559,177 |
| **Total** | **42,895,483** | **10,413,606,524** |

![Tokens per day by model, and cache reads per day.](bilder/entstehung/tokens-je-tag.svg)

**Diagram:** At the top are the output tokens per calendar day, stacked by model
(display names without a manufacturer prefix); below, on its own axis, is the
cache-read count per day as a separate series — per stage, roughly a factor of 100
to 300 above the output (see the tables above); only this separate axis keeps the
course of the output visible at all alongside it.

**After the cut-off date:** Sessions after this cut-off date — for instance for the
bilingual README and for this chronicle stage itself — are already under way, but
are not included in the figures above, because their total is still growing.
