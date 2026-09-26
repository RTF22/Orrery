/**
 * Seitenvorlage für die vier Making-of-Seiten (Entwurf §3a): Kopf mit
 * Sprachumschalter, Navigation (Making-of-Links, Inhaltsverzeichnis mit
 * Lesefortschritt) und Inhalt, dazu die beiden Weiterleitungsseiten
 * (Sprachwahl, Doku-Wurzel) und das gemeinsame Stylesheet. Reine Funktionen
 * ohne Seiteneffekt; `baue()` in doku-bauen.ts ruft `seite()` je Seite auf und
 * schreibt die übrigen drei Ausgaben einmal.
 *
 * Farben: aus den Tailwind-Klassen der Panels in src/ui/ abgeleitet (kein
 * eigenes Tailwind-Theme im Projekt, daher die Standardpalette) —
 * Hintergrund `bg-slate-900` (#0f172a) und Text `text-slate-100` (#f1f5f9)
 * aus src/ui/karte/Kartendialog.tsx (Zeile mit `bg-slate-900 text-sm
 * text-slate-100`, der einzige *deckende* Panel-Hintergrund der App — die
 * übrigen Panels legen `bg-slate-900/70` über die 3D-Szene, für eine
 * eigenständige Seite ohne Szene passt die deckende Fassung), gedämpfter Text
 * `text-slate-300` (#cbd5e1) aus src/ui/Kopfzeile.tsx (Statuszeile), Akzent
 * `border-sky-300`/`bg-sky-400` (#7dd3fc/#38bdf8) aus den aktiven Reitern in
 * src/ui/info/InfoPanel.tsx und src/ui/ueberschrift.ts.
 */
import type { Dokument, Eintrag, SeitenDaten, Sprache } from './doku-bauen.ts';

// Einzige Quelle für beide Konstanten (auch von doku-bauen.ts verwendet, dort per Wert-Import
// aus dieser Datei — nicht umgekehrt: doku-bauen.ts importiert von hier nur Typen (`import
// type`, laufzeitfrei), ein echter Ringimport zur Laufzeit entstünde sonst, weil GITHUB_STAMM
// hier unten sofort beim Auswerten des Moduls in WOERTER gebraucht wird (TDZ bei `const`).
export const GITHUB_STAMM = 'https://github.com/RTF22/Orrery';

// Kanonische Wurzel der Seite (orrery3d.de, nicht die gleichwertige Adresse unter
// jensfricke.com/Orrery/): einzige Quelle für Canonical, Hreflang, og:url/og:image
// hier sowie für robots.txt und die Sitemap (doku-bauen.ts).
export const SEITEN_STAMM = 'https://orrery3d.de';

export const DATEI_JE_DOKUMENT: Record<Dokument, string> = {
  entstehung: 'index.html',
  chronik: 'chronik.html',
};

/**
 * Absolute Adresse einer Doku-Seite unterhalb von SEITEN_STAMM: Verzeichnisform
 * (`.../making-of/<sprache>/`) für die als `index.html` abgelegte Übersicht, sonst der
 * volle Dateiname — dieselbe Form wie in der Sitemap (doku-bauen.ts) und der
 * Canonical-Zeile von `seite()` unten.
 */
export function seitenAdresse(sprache: Sprache, dokument: Dokument): string {
  const datei = DATEI_JE_DOKUMENT[dokument];
  const pfad = datei === 'index.html' ? '' : datei;
  return `${SEITEN_STAMM}/doku/making-of/${sprache}/${pfad}`;
}

interface Woerter {
  label: Record<Dokument, string>;
  navLabel: string;
  sprachLabel: string;
  inhalt: string;
  fuss: string;
}

const WOERTER: Record<Sprache, Woerter> = {
  de: {
    label: { entstehung: 'Überblick', chronik: 'Chronik' },
    navLabel: 'Making-of-Navigation',
    sprachLabel: 'Sprache',
    inhalt: 'Inhalt',
    fuss:
      `© Jens Fricke · Code MIT, Texte CC BY-SA 4.0 · Texturen siehe ` +
      `<a href="${GITHUB_STAMM}/blob/master/ASSETS.md">ASSETS.md</a> · ` +
      `<a href="${GITHUB_STAMM}">Quelltext bei GitHub</a>`,
  },
  en: {
    label: { entstehung: 'Overview', chronik: 'Chronicle' },
    navLabel: 'Making-of navigation',
    sprachLabel: 'Language',
    inhalt: 'Contents',
    fuss:
      `© Jens Fricke · code MIT, texts CC BY-SA 4.0 · textures see ` +
      `<a href="${GITHUB_STAMM}/blob/master/ASSETS.md">ASSETS.md</a> · ` +
      `<a href="${GITHUB_STAMM}">source on GitHub</a>`,
  },
};

/** HTML-Maskierung für Titel, Beschreibung und Inhaltsverzeichnistexte (Reihenfolge wichtig: `&` zuerst). */
function maskieren(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Inhaltsverzeichnis als flache Liste: Ebene-3-Einträge tragen die Kennung
 * ihres vorausgehenden Ebene-2-Eintrags als `data-abschnitt` — das
 * Lesefortschritt-Skript blendet darüber die Ebene-3-Einträge des gerade
 * aktiven Abschnitts ein (CSS blendet sie sonst aus, `<noscript>` zeigt ohne
 * Skript ohnehin alle).
 */
function tocListe(toc: Eintrag[]): string {
  let abschnitt = '';
  return toc
    .map((eintrag) => {
      const text = maskieren(eintrag.text);
      if (eintrag.ebene === 2) {
        abschnitt = eintrag.id;
        return `<li class="toc-2"><a href="#${eintrag.id}">${text}</a></li>`;
      }
      return `<li class="toc-3" data-abschnitt="${abschnitt}"><a href="#${eintrag.id}">${text}</a></li>`;
    })
    .join('\n');
}

/** Umschließt jede Tabelle mit einem Rahmen (`overflow-x: auto`), ohne die Tabelle selbst zu verändern. */
function tabellenEinrahmen(html: string): string {
  return html.replace(/<table>/g, '<div class="tabelle"><table>').replace(/<\/table>/g, '</table></div>');
}

/** Setzt `loading="lazy"` auf jedes Bild außer dem ersten (Entwurf §3a). */
function bilderVerzoegern(html: string): string {
  let erstesGesehen = false;
  return html.replace(/<img /g, () => {
    if (!erstesGesehen) {
      erstesGesehen = true;
      return '<img ';
    }
    return '<img loading="lazy" ';
  });
}

/** Die Seitenvorlage: Kopf, Navigation mit Inhaltsverzeichnis, Inhalt, Fuß. */
export function seite(d: SeitenDaten): string {
  const datei = DATEI_JE_DOKUMENT[d.dokument];
  const w = WOERTER[d.sprache];
  const titel = maskieren(d.titel);
  const titelSeite = `${titel} · Orrery`;
  const beschreibung = maskieren(d.beschreibung);
  const adresseEigen = seitenAdresse(d.sprache, d.dokument);
  const adresseDe = seitenAdresse('de', d.dokument);
  const adresseEn = seitenAdresse('en', d.dokument);

  const navKnopfId = 'inhalt-knopf';
  const navId = 'inhalt-nav';

  const navSeiten = (['entstehung', 'chronik'] as Dokument[])
    .map((dok) => {
      const aktiv = dok === d.dokument;
      return `<li><a href="${DATEI_JE_DOKUMENT[dok]}"${aktiv ? ' aria-current="page"' : ''}>${w.label[dok]}</a></li>`;
    })
    .join('\n');

  const sprachwahl =
    d.sprache === 'de'
      ? `<span aria-current="true">DE</span> | <a href="../en/${datei}">EN</a>`
      : `<a href="../de/${datei}">DE</a> | <span aria-current="true">EN</span>`;

  const inhalt = bilderVerzoegern(tabellenEinrahmen(d.html));

  return `<!doctype html>
<html lang="${d.sprache}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titelSeite}</title>
<meta name="description" content="${beschreibung}">
<link rel="canonical" href="${adresseEigen}">
<link rel="alternate" hreflang="de" href="${adresseDe}">
<link rel="alternate" hreflang="en" href="${adresseEn}">
<link rel="alternate" hreflang="x-default" href="${adresseEn}">
<meta property="og:type" content="article">
<meta property="og:title" content="${titelSeite}">
<meta property="og:description" content="${beschreibung}">
<meta property="og:url" content="${adresseEigen}">
<meta property="og:image" content="${SEITEN_STAMM}/doku/making-of/bilder/orrery-saturn.jpg">
<meta name="theme-color" content="#0f172a">
<link rel="icon" type="image/png" href="../../../symbole/orrery-192.png">
<link rel="stylesheet" href="../doku.css">
<noscript><style>
.navknopf{display:none}
.nav{position:static!important;display:block!important;transform:none!important;max-height:none!important;width:auto!important;padding:1rem!important}
.toc .toc-3{display:list-item!important}
</style></noscript>
</head>
<body>
<header class="kopf">
<div class="kopf-links">
<a class="orrery-link" href="../../../index.html">Orrery</a>
<span class="kopf-titel">${titel}</span>
</div>
<nav class="sprachwahl" aria-label="${w.sprachLabel}">${sprachwahl}</nav>
</header>
<button type="button" class="navknopf" id="${navKnopfId}" aria-expanded="false" aria-controls="${navId}">${w.inhalt}</button>
<nav class="nav" id="${navId}" aria-label="${w.navLabel}">
<p class="nav-ueberschrift">Making-of</p>
<ul class="nav-seiten">
${navSeiten}
</ul>
<ul class="toc">
${tocListe(d.toc)}
</ul>
</nav>
<main class="inhalt">
<h1>${titel}</h1>
${inhalt}
</main>
<footer class="fuss">
<p>${w.fuss}</p>
</footer>
<script>
(function () {
  var knopf = document.getElementById('${navKnopfId}');
  var nav = document.getElementById('${navId}');
  if (knopf && nav) {
    knopf.addEventListener('click', function () {
      var offen = nav.getAttribute('data-offen') === 'true';
      nav.setAttribute('data-offen', offen ? 'false' : 'true');
      knopf.setAttribute('aria-expanded', offen ? 'false' : 'true');
    });
    nav.addEventListener('click', function (ev) {
      var ziel = ev.target;
      if (ziel && ziel.tagName === 'A') {
        nav.setAttribute('data-offen', 'false');
        knopf.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.getAttribute('data-offen') === 'true') {
        nav.setAttribute('data-offen', 'false');
        knopf.setAttribute('aria-expanded', 'false');
        knopf.focus();
      }
    });
  }

  var kopfHoehe = 60;
  var ueberschriften = Array.prototype.slice.call(document.querySelectorAll('main h2[id], main h3[id]'));
  var linkJeId = {};
  Array.prototype.forEach.call(document.querySelectorAll('.toc a[href^="#"]'), function (a) {
    linkJeId[a.getAttribute('href').slice(1)] = a;
  });
  var abschnittJeId = {};
  Array.prototype.forEach.call(document.querySelectorAll('.toc li'), function (li) {
    var a = li.querySelector('a');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    abschnittJeId[id] = li.classList.contains('toc-3') ? li.getAttribute('data-abschnitt') : id;
  });

  var aktuellesId = null;
  var offenerAbschnitt = null;
  function setzeAktuell(id) {
    if (id === aktuellesId) return;
    if (aktuellesId && linkJeId[aktuellesId]) linkJeId[aktuellesId].removeAttribute('aria-current');
    aktuellesId = id;
    if (id && linkJeId[id]) linkJeId[id].setAttribute('aria-current', 'location');
    var abschnitt = id ? abschnittJeId[id] : null;
    if (abschnitt !== offenerAbschnitt) {
      offenerAbschnitt = abschnitt;
      Array.prototype.forEach.call(document.querySelectorAll('.toc li.toc-3'), function (li) {
        var offen = li.getAttribute('data-abschnitt') === abschnitt;
        li.classList.toggle('offen', offen);
      });
    }
  }

  if ('IntersectionObserver' in window && ueberschriften.length) {
    var sichtbar = {};
    var beobachter = new IntersectionObserver(
      function (eintraege) {
        eintraege.forEach(function (e) {
          sichtbar[e.target.id] = e.isIntersecting;
        });
        var letzte = null;
        ueberschriften.forEach(function (h) {
          if (sichtbar[h.id]) letzte = h.id;
        });
        if (letzte) setzeAktuell(letzte);
      },
      { rootMargin: '-' + kopfHoehe + 'px 0px -70% 0px', threshold: 0 },
    );
    ueberschriften.forEach(function (h) {
      beobachter.observe(h);
    });
  }
})();
</script>
</body>
</html>
`;
}

/**
 * Sprachwahlseite `making-of/index.html`: leitet per Skript auf `de/` oder
 * `en/` weiter (Browsersprache, sonst Englisch), darunter beide Links sichtbar
 * für den Fall ohne JavaScript.
 */
export function sprachwahlSeite(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Orrery · Making-of</title>
<script>
location.replace((navigator.languages?.[0] ?? navigator.language ?? 'en').toLowerCase().startsWith('de') ? 'de/' : 'en/');
</script>
</head>
<body>
<p><a href="de/">Deutsch</a></p>
<p><a href="en/">English</a></p>
</body>
</html>
`;
}

/** Doku-Wurzel `doku/index.html`: leitet auf die Sprachwahl weiter. */
export function dokuWurzelSeite(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=making-of/">
<title>Orrery · Making-of</title>
</head>
<body>
<p><a href="making-of/">Making-of</a></p>
</body>
</html>
`;
}

/**
 * Gemeinsames Stylesheet der Making-of-Seiten. Dunkles Thema aus den
 * Tailwind-Klassen der App-Panels (siehe Dateikopf): Hintergrund `#0f172a`,
 * Text `#f1f5f9` — Kontrastverhältnis 16,3:1 (WCAG-Formel über die relative
 * Leuchtdichte), weit über der geforderten Mindestschwelle 7:1.
 */
export const DOKU_CSS = `:root {
  --bg: #0f172a;
  --text: #f1f5f9;
  --text-gedaempft: #cbd5e1;
  --akzent: #7dd3fc;
  --akzent-stark: #38bdf8;
  --rand: rgba(255, 255, 255, 0.14);
  color-scheme: dark;
}
* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif;
}
a { color: var(--akzent); text-decoration: underline; text-underline-offset: 0.15em; }
a:focus-visible, button:focus-visible { outline: 2px solid var(--akzent-stark); outline-offset: 2px; }

.kopf {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  min-height: 60px;
  padding: 0.6rem 1rem;
  background: var(--bg);
  border-bottom: 1px solid var(--rand);
}
.kopf-links { display: flex; align-items: baseline; gap: 0.75rem; min-width: 0; overflow: hidden; }
.orrery-link { flex-shrink: 0; font-weight: 700; color: var(--text); text-decoration: none; }
.orrery-link:hover { text-decoration: underline; }
.kopf-titel {
  color: var(--text-gedaempft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sprachwahl { flex-shrink: 0; font-size: 0.875rem; }
.sprachwahl [aria-current] { color: var(--text); font-weight: 700; }

.navknopf {
  position: fixed;
  z-index: 25;
  top: 4.5rem;
  left: 0.75rem;
  min-height: 44px;
  min-width: 44px;
  padding: 0.5rem 1rem;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--rand);
  border-radius: 0.5rem;
  font: inherit;
  cursor: pointer;
}
@media (min-width: 900px) { .navknopf { display: none; } }

.nav-ueberschrift { margin: 0 0 0.5rem; font-weight: 700; }
.nav-seiten { list-style: none; margin: 0 0 1rem; padding: 0; }
.nav-seiten a[aria-current="page"] { color: var(--text); font-weight: 700; }
.toc { list-style: none; margin: 0; padding: 0; }
.toc .toc-2 { margin: 0.35rem 0; }
.toc .toc-3 {
  display: none;
  margin: 0.2rem 0 0.2rem 1rem;
  font-size: 0.9em;
}
.toc .toc-3.offen { display: list-item; }
.toc a[aria-current="location"] { color: var(--akzent); font-weight: 700; }

@media (min-width: 900px) {
  body { display: grid; grid-template-columns: 280px minmax(0, 1fr); }
  .kopf, .fuss { grid-column: 1 / -1; }
  .nav {
    grid-column: 1;
    width: 280px;
    align-self: start;
    position: sticky;
    top: 60px;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    padding: 1rem;
    border-right: 1px solid var(--rand);
  }
  main.inhalt { grid-column: 2; }
}
@media (max-width: 899px) {
  body { overflow-x: hidden; }
  .nav {
    position: fixed;
    z-index: 24;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(85vw, 320px);
    max-height: 100vh;
    overflow-y: auto;
    padding: 4rem 1rem 1rem;
    background: var(--bg);
    border-right: 1px solid var(--rand);
    transform: translateX(-105%);
    transition: transform 0.15s ease;
  }
  .nav[data-offen="true"] { transform: translateX(0); }
}

main.inhalt {
  padding: 1.5rem 1rem 3rem;
  max-width: 72ch;
}
main.inhalt :is(h1, h2, h3, h4) { line-height: 1.25; }
main.inhalt :is(h2, h3, h4)[id] { scroll-margin-top: 4.5rem; }
main.inhalt img { max-width: 100%; height: auto; }
main.inhalt .tabelle { overflow-x: auto; border: 1px solid var(--rand); border-radius: 0.4rem; margin: 1rem 0; }
main.inhalt .tabelle table { width: 100%; border-collapse: collapse; }
main.inhalt .tabelle th, main.inhalt .tabelle td { padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--rand); text-align: left; }
/* Nur Zahlenspalten (GFM-Tabellensyntax --:, marked rendert sie mit align="right") nicht
   umbrechen lassen — eine Fließtextspalte wie „Meilenstein" in der Zeitleiste bekommt kein
   align="right" und bricht wie gewohnt um, statt die 72ch-Spalte am Desktop zu sprengen. */
main.inhalt .tabelle th[align="right"], main.inhalt .tabelle td[align="right"] { white-space: nowrap; }
main.inhalt pre { overflow-x: auto; padding: 0.75rem; border: 1px solid var(--rand); border-radius: 0.4rem; }
main.inhalt code { font-family: ui-monospace, "Cascadia Code", monospace; }

.fuss {
  padding: 1.5rem 1rem 3rem;
  color: var(--text-gedaempft);
  font-size: 0.875rem;
  border-top: 1px solid var(--rand);
}
.fuss a { color: var(--text-gedaempft); }
`;
