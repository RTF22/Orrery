# How Orrery Came to Be

**English** | [Deutsch](entstehung.de.md)

![Saturn with the planet's shadow on its rings, rendered by Orrery.](bilder/orrery-saturn.jpg)

Orrery is an interactive 3D simulation of the solar system in the browser, built between 11 and
25 September 2026 — 15 calendar days, 673 commits, from the initial prompt to the site at
<https://orrery3d.de>. This page tells two stories at once: the story of Orrery as a tool for
science communication, with sourced references at three levels, and the story of a path to
building a deterministic, verifiable application with the AI coding assistant Claude Code
(Anthropic) — a language model that does not work deterministically. Details, commit hashes, and
evidence for every number on this page are provided by the [Chronicle](chronik.en.md).

## 1. The Idea

The [initial prompt](ursprungsprompt.md) to Claude Code explicitly required interviewing first
with the brainstorming skill, then presenting a design document, and only after that planning and
implementing in small, testable steps. This sequence — brainstorming, draft, approval, plan,
implementation, acceptance — runs through the entire project; the skills used come from the
Superpowers collection, a plugin by Jesse Vincent. From the first interview with Jens Fricke on
11 September 2026, it was settled: Orrery should be a learning tool and a showpiece in equal
measure, the orbit model should compute analytically by Kepler's laws and be testable against
reference values, and the repository should stay private until completion. Between the first and
the last commit of this stage (`32072ef`, `b9e4283`), fewer than three minutes passed — no code
yet, no tests yet. [Chronicle](chronik.en.md#idee)

## 2. Timeline

Milestone and commit count per day; "tag" names the version tag set on that day.

| Date | Milestone | Tag | Commits |
|---|---|---|---:|
| 11 September 2026 | Initial prompt, design document, start of phase 1 | — | 18 |
| 12 September 2026 | Phase 1 completed, phase 2, start of phase 3a | v0.1.0/v0.2.0 | 67 |
| 13 September 2026 | Phase 3a/3b, renamed to Orrery, phase 4a | v0.3.0 | 62 |
| 14 September 2026 | Phase 4b, deploy script, start of phase 4c | — | 62 |
| 15 September 2026 | Primary- and secondary-school texts, clickable hit areas | — | 35 |
| 16 September 2026 | Scene texts, phase 4c | — | 18 |
| 17 September 2026 | Phase 4c completed, start of phase 4d | v0.4.0 | 50 |
| 18 September 2026 | Phase 4d, subject topics | — | 12 |
| 19 September 2026 | Time range, flight, repository made public | — | 77 |
| 20 September 2026 | Phase 4d, inner planets | — | 46 |
| 21 September 2026 | Phase 4d, Jupiter system | — | 29 |
| 22 September 2026 | Phase 4d, Saturn and Uranus systems | — | 59 |
| 23 September 2026 | Phase 4d completed, follow-up, start of phase 5 | v0.5.0 | 64 |
| 24 September 2026 | Phase 5, mobile, textures, music | — | 33 |
| 25 September 2026 | Phase 5 completed, Milky Way, info card, odds and ends, domain | v0.6.0–v0.7.2 | 46 |

## 3. Phases

Fifteen days lie between the first working scene and today's simulation:

![Early development state v0.1.0 with a simple interface.](bilder/entstehung/alt-v0.1.0.jpg)
![The entire solar system with orbit lines of all planets and dwarf planets around the sun.](bilder/entstehung/systemblick.jpg)

### Phases 1–3: Vertical Slice, Catalogue, Belt, and Shadows

First a working, vertical slice through the whole chain from input to rendering (v0.1.0, 152
tests, about 11.1 hours), then — brought forward by an interview decision — a cinema mode with
full screen and an automatic camera flight (v0.2.0, about 0.9 hours). Next came expanding the
catalogue to 20 moons and 5 dwarf planets, plus planet rings (phase 3a, 689 tests, main chunk
1,096.84 kB, about 22.1 hours), then an asteroid belt as `THREE.Points` with orbit computation in
the vertex shader — 50,000 Kepler solves per frame would have been too expensive in JavaScript —
and real shadows via analytical occluders instead of shadow maps, because of the huge range of
scales and an exact penumbra from circle overlap (phase 3b, v0.3.0, about 8.7 hours). 46 minutes
after that tag, the project was renamed to "Orrery".
[Chronicle: Phase 1](chronik.en.md#phase-1) · [Phase 2](chronik.en.md#phase-2) ·
[Phase 3a](chronik.en.md#phase-3a) · [Phase 3b](chronik.en.md#phase-3b)

### Phases 4a–4d: English, Persistence, Info Panel, University-Level Texts

The interface became switchable to English at runtime, without an external i18n framework, using
`en-GB` as the English locale (phase 4a, 848 tests). Next came state that persisted across
sessions — shared links, a remembered session, a "Views" panel (phase 4b) — and an info panel
with curated source cards and three text levels per body and topic; the source catalogue grew
from 24 to 66 entries in the process (phase 4c, v0.4.0, 2,892 tests). Alongside this came
clickable bodies, names, and orbits in the view (clickable hit areas, 2,003 tests); a crash found
in phase 4d — Saturn's orbital eccentricity became numerically negative from the year 12,563
onward under linearly extrapolated computation — led to a fixed time range from 1 January of
year 1 to 31 December 9999; along with that came free flight with keyboard, mouse, and Xbox
controller.

![Info panel at university level on the topic of orbital elements, with formulas.](bilder/entstehung/infopanel-hochschule.jpg)

The finish was the third, unlimited text level, "University", with formulas, tables, and primary
literature, filled in over eleven stages: 761 literature citations machine-checked against
Crossref or arXiv, 138 university-level files (69 German, 69 English) with 318,938 words
combined, 91 source cards, 5,150 tests at the end (v0.5.0, about 152.9 hours). A subsequent
follow-up fixed findings left open from the overall acceptance review, without changing any code.
[Chronicle: Phase 4a](chronik.en.md#phase-4a) · [Phase 4b](chronik.en.md#phase-4b) ·
[Phase 4c](chronik.en.md#phase-4c) · [Clickable hit areas](chronik.en.md#klickflaechen) ·
[Time range](chronik.en.md#zeitbereich) · [Flight](chronik.en.md#flug) ·
[Phase 4d](chronik.en.md#phase-4d) · [Follow-up](chronik.en.md#nachfuehrung-4d)

### Phase 5: Interface, Mobile, Textures, Music

A collapsible left column, a compact mode for phones, textures in several tiers (KTX2) — the 1k
total dropped to 3,567,420 bytes in the process, and the load time under simulated "Fast 4G" to a
median of 4,543.6 ms — and finally a dedicated section for music. The phase ended with tag
`v0.6.0`, 5,285 tests, and a main chunk of 1,529.67 kB.
[Chronicle](chronik.en.md#phase-5)

### Phase 6: Milky Way

The Milky Way in the background includes a share of Gaia data; the design assumed the CC BY-SA
licence at first, but the specialist review found it to actually be CC BY-NC 3.0 IGO
(non-commercial) — no obstacle for the non-commercial Orrery, but it meant an updated design
document and a source card with an NC note. Three texture tiers: 59,941 bytes (1k), 1,069,543
bytes (2k), 30,310,600 bytes (8k). Tag `v0.7.0`, 5,328 tests, main chunk 1,531.36 kB.
[Chronicle](chronik.en.md#phase-6)

### Info Card and Odds and Ends

An info card with the tabs Setup, Controls, and About, plus a separate "Controls" card, extended
the interface (v0.7.1, four stages taking tests from 5,328 to 5,371, main chunk up to
1,549.24 kB); smaller, previously open points then closed out the stage (v0.7.2,
5,402 tests, main chunk 1,550.81 kB).

![The open info card with the "Controls" tab and the main keyboard shortcuts.](bilder/entstehung/infokarte.jpg)

[Chronicle: Info Card](chronik.en.md#infokarte) · [Odds and Ends](chronik.en.md#kleinigkeiten)

## 4. Working Method: Human and AI

Jens Fricke set direction, approvals, and hands-on checks; Claude Code drafted, planned, and
steered the implementation; independent subagents took over implementation and review, using the
smallest model that could still reliably solve the task whenever possible. Every phase went
through the same sequence: brainstorming, an approved design document, a plan, implementation in
small, individually assigned work steps (tasks), and an acceptance review with rulings. Decisions
that became necessary while a plan was running were made by the steering session itself as a
"ruling" rather than as a question back — each one recorded in writing with its reasoning and
presented to Jens together at the end.

Two further rules ran through all phases: visual checks were done as pixel measurements rather
than impressions — screenshots from the same page load, a control image with no differing
pixels, a paused clock for reproducible captures. And every literature reference in the
university-level texts was machine-checked against Crossref or arXiv before a specialist review
checked it in substance against the cited work itself — a comment in the code never counted as
evidence. The skills used come from the Superpowers collection, a plugin by Jesse Vincent, in
particular for brainstorming, drafting, planning, and the subagent-driven implementation itself.

## 5. Deterministic with a Non-Deterministic Tool

The reviewed logs record 37 cases in which a language model — as implementer or as reviewer —
delivered something wrong and a deterministic check caught it: specialist reviews caught 25 of
them, build or type-checking 2, a pixel measurement 1, the automated literature check 1, a
grep-based review 2, Jens' own hands-on check 1, an overall acceptance review 4, and a later task
1. Seven recurring patterns in this net, each with one real case:

**Physics against reference values.** The simulation computes analytically by Kepler's laws and
is tested against JPL Horizons fixtures; only the rendering may exaggerate sizes and brightness,
never the physics itself. This separation has limits: under orbit computation linearly
extrapolated over millennia, Saturn's eccentricity became numerically negative from the year
12,563 onward, the Kepler solver aborted with an error, and the render loop froze. A specialist
review during work on the university-level texts found the case; the fix was not a special case
in the code, but a fixed, documented time range from 1 January of year 1 to 31 December 9999.

**Tests as a contract.** The test count grew from 152 at the first slice to 5,402 at the end;
before every "done", `lint`, `tsc -b --noEmit`, and `build` ran alongside it. That a green `npm
test` run checks no types showed up more than once: a literal import from `node:fs` in a test
file only broke the build after the test run had already passed, fixed the same day. To be
honest: none of the 37 cases named above was caught by an automated test alone — always only
together with a build, a measurement, or a specialist review.

**Measuring instead of looking.** Visual checks yield pixel values, not impressions: screenshots
from the same page load, difference images against a control image with no differing pixels, a
paused clock for reproducible captures. This caught, for example, a click that hit Mars in the
crowded system view but selected Deimos instead — a sub-pixel coincidence where mere ranking by
depth in the image decided instead of proximity to the pointer. Only a pixel measurement
uncovered this; the fix gave every disc its own field for its kind and a two-stage ranking.

**Evidence instead of claims.** 761 academic publications make up the literature catalogue of
the university-level texts, each machine-checked against Crossref or arXiv — and every statement
additionally checked against the cited work itself, not against a comment in the code. One topic
on orbital elements attributed the origin of all lunar rates to a single source across the board;
in fact, one of the rates actually came from the sidereal orbital period, not from that source. A
specialist review found the mix-up, and a second, separately documented review round corrected
it. Typical errors of this kind were orders of magnitude, misattributed values, and confused
source years — never invented citations.

**Human gates.** Brainstorming, draft, approval, plan, implementation, acceptance — every stage
needed Jens Fricke's consent before the next one began, and rulings instead of questions kept
running plans moving. Besides that, plain hands-on testing on a real device stayed a gate of its
own: the ⓘ symbol for info and help turned out to be too small on the desktop screen — no
automated test would have found that, only Jens' own eye on the screen. The button then moved
into the language row of the header.

**Bounded freedom.** Small tasks per session, one implementer at a time (subagents share a
browser), at most one review round per text, and language models kept as small as possible — four
rules that limit freedom and cost at the same time. Their limit showed when a mechanical
clean-up of forbidden phrasing in reference lists was first handed to the smallest model in use:
the first pass left 37 hits standing that should actually have been caught, and a second attempt
instead struck unrelated passages and deleted reference numbers without replacement. A grep-based
review caught both, before a specialist review was even needed; the repeat run then ran on the
medium model. Since then, similar rule-bound clean-ups start there right away.

**Determinism in the app itself.** Not only the workflow but the application itself is built to
be deterministic: pure functions in the simulation layer, a time range with fixed bounds instead
of unbounded extrapolation, layers with one-way dependency, and their own layer tests. One
example: the date field initially truncated its time format to ten characters; with a negative
year, this left out the day, the browser rejected the value, and the field stayed empty. A
specialist review found this; the fix was a single pure function that assembles year, month, and
day independently of the sign — no chain of special cases in the UI code.

**What the net didn't catch.** To be honest, there is also what the net didn't catch, or caught
only late. A type error from a follow-up task only broke the production build after an
already-green test run — one of the lessons from this: `npm test` checks no types, `tsc -b
--noEmit` belongs in every final check. And even an overall acceptance review can be wrong: it
still listed three secondary-school findings as open although they had long since been fixed,
and in another case noted "corrected" at one point in its own report while, at a second point in
the same report, noting "open" for the same attribution. This second contradiction was only
uncovered by the review of a later part of this chronicle, traced directly to commit `63d3144`.
The net of checks catches a great deal reliably, but not always at first glance — sometimes only
a second, independent review catches it.

## 6. What It Cost

What was evaluated were the local session logs of the assistant for this project: 52 main
sessions and 756 subagent runs up to the cut-off date, the upload of the domain fix on
25 September 2026 (`f3807c7`). Only sums are published, never log contents. Every response counts
once, identified by its message id; under streaming, the same response appears in the log more
than once, so the maximum value across all lines is counted per field — without this rule, a
sample for Claude Sonnet 5 came out at only 1.9 instead of 23.8 million output tokens.

Up to the cut-off date, this added up to 44,895 responses with about 42.9 million output tokens,
about 10.4 billion tokens of cache reads, about 0.2 billion tokens of cache writes, and about
153,000 uncached input tokens — a total of about 10.7 billion tokens, of which about 98% were
cache reads. About 82.7% of all four categories combined went to subagent runs, the rest to the
main session with the steering model. About 65% of all responses came from Claude Sonnet 5,
about 23% from Claude Opus 5; the rest ran on Claude Opus 5.5, Claude Fable 5.1, and, for purely
mechanical work, the deliberately smallest model, Claude Haiku 4.5. At the start, before the
first subagent run, almost everything ran on the largest model; as the project grew, the medium
model increasingly took the lion's share.

That reading the ever-growing context determines the total, and not writing code, is no
accident: small tasks per session and models kept as small as possible are direct answers to
exactly this cost structure — every new response reads plans, earlier decisions, and code
already written all over again before it contributes anything new.

![Tokens per day by model, and cache reads per day.](bilder/entstehung/tokens-je-tag.svg)

The logs exist only locally and have not been reconciled against any billing; the counting method
and cut-off date are given here so the numbers can be put in context. The full breakdown by day,
phase, and model is in the [chronicle's appendix](chronik.en.md#anhang-tokens).

## 7. Lessons

- **`npm test` checks no types.** A literal import and, later, a type error from a follow-up task
  only broke `tsc -b --noEmit` and the production build, respectively, after an already-green
  test run. Since then, a separate type-check and build run belongs in every final check, not
  just `npm test`.
- **Even a review can be wrong.** A first calculation for a scene arrived at a wrong value
  because of its own sign error; an overall acceptance review considered three already-fixed
  findings to still be open and even contradicted itself on one point. Both cases were only
  resolved by a second, independent review.
- **A comment in the code is no evidence.** Several attribution errors in the university-level
  texts traced back to a wrong or unchecked comment, not to the cited work itself; the rule to
  check every statement against the source therefore stayed without exception.
- **Rule-bound clean-ups need the right model.** Two attempts at a mechanical text clean-up on
  the smallest model in use failed at rule compliance, before a repeat on the medium model
  succeeded. Similar clean-ups have started there ever since.
- **Visual checks need pixel values, not impressions.** A click that hit the wrong target in the
  crowded system view only came to light through a pixel measurement, not by looking.
- **One implementer at a time.** Subagents share the same browser; parallel implementation would
  have distorted visual checks and measurements against each other — so at most one
  implementation ran at any given time.

## 8. Path to the Domain

The repository stayed private from the start, with no deployment before completion — one of the
project's first decisions, three minutes after the design document. On 14 September 2026 the
deploy script for publishing via FTPS was created, along with an environment template; on
19 September 2026 the repository went public, with an open licence. On 24 September 2026, an
installable web app with a full-screen start and its own icon was added, together with a
file-by-file upload with retries on network errors.

Two commits on 25 September 2026 finally resolved the last obstacles to the site's own domain:
the fixed base for all paths produced HTTP 500 responses from the server under
<https://orrery3d.de>, because the domain points directly at the project folder; relative paths
have run under both addresses ever since. A global server alias was also serving its own icons
instead of the app's icons; the icons therefore moved into their own folder. Since then, the site
has run under <https://orrery3d.de> as well as under <https://www.jensfricke.com/Orrery/>,
uploaded via FTPS. [Chronicle](chronik.en.md#domain)

## 9. Key Figures

- **673 commits** over 15 calendar days (11–25 September 2026).
- **5,402 tests** in 127 test files, main chunk 1,557.08 kB (gzip 430.04 kB) — state after the
  domain fix.
- **761 academic publications** in the literature catalogue of the university-level texts, each
  machine-checked against Crossref or arXiv, linked to 91 curated source cards.
- **138 university-level files** (69 German, 69 English) with 318,938 words combined (151,719
  German, 167,219 English).
- **Time range** from 1 January of year 1 to 31 December 9999.
- **Textures** in several tiers (KTX2); the Milky Way map alone in three tiers, from 59,941 bytes
  (1k) through 1,069,543 bytes (2k) to 30,310,600 bytes (8k).
