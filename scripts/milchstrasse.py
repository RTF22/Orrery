"""Himmelskarte der Milchstraße (Entwurf Phase 6 §3): HDR lesen, Kurve, Lage, Stufen.

Aufgerufen von scripts/milchstrasse-bauen.ts.

  python scripts/milchstrasse.py bauen <quelle.exr> <zielordner> <breite> [<breite> ...]
  python scripts/milchstrasse.py lage <bild>

Konvention der SVS-Karte (Entwurf §3.4, an der Vorschau bestimmt): RA 0h in der
Bildmitte, RA wächst nach links, Norden oben (Zeile 0 = Dec +90°).
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageFilter

Image.MAX_IMAGE_PIXELS = None

# Galaktischer Nordpol in J2000 (Rektaszension, Deklination in Grad).
RA_NGP, DEC_NGP = 192.85948, 27.12825

ZIEL_MEDIAN = 25.0  # Schirmwert des mittleren Bandes (|b| < 10°), Ziel 20 bis 30
ZIEL_SPITZE = 65.0  # 99,5-Perzentil des Bandes, Ziel 60 bis 70
BAND_GRAD = 10.0
POL_GRAD = 80.0
MESS_BREITE = 2048  # Kurve und Vorhersage an dieser Stufe (Entwurf §3.2)

# Name, RA, Dec, Toleranz in Grad (Entwurf §3.4)
MERKMALE = [
    ("Galaktisches Zentrum", 266.4, -28.9, 5.0),
    ("Große Magellansche Wolke", 80.9, -69.8, 2.0),
    ("Kleine Magellansche Wolke", 13.2, -72.8, 2.0),
]

# Nullstelle des Zählers von RRTAndODTFit: darunter liefert ACES 0.
_V0 = (-0.0245786 + np.sqrt(0.0245786 ** 2 + 4 * 0.000090537)) / 2
_V = np.linspace(_V0, 8.0, 800001)


def aces_fit(v):
    """RRTAndODTFit aus three.js (ACESFilmicToneMapping); für Grauwerte sind Ein- und
    Ausgangsmatrix neutral, die Kurve allein bestimmt den Schirmwert."""
    return (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.4329510) + 0.238081)


_A = aces_fit(_V)


def srgb_zu_linear(s):
    return np.where(s <= 0.04045, s / 12.92, ((s + 0.055) / 1.055) ** 2.4)


def linear_zu_srgb(l):
    l = np.clip(l, 0.0, 1.0)
    return np.where(l <= 0.0031308, l * 12.92, 1.055 * np.power(l, 1 / 2.4) - 0.055)


def schirm_aus_textur(textur_srgb01):
    """Vorwärts: Texturwert (sRGB 0..1) → Schirmwert (sRGB 0..255) bei Belichtung 1."""
    v = srgb_zu_linear(textur_srgb01) / 0.6
    return 255.0 * linear_zu_srgb(np.clip(aces_fit(v), 0.0, 1.0))


def textur_aus_schirm(schirm255):
    """Rückwärts: gewünschter Schirmwert (0..255) → linearer Texturwert."""
    ziel = srgb_zu_linear(np.clip(schirm255, 0, 255) / 255.0)
    v = np.interp(ziel, _A, _V, left=0.0)
    return np.where(ziel <= 0.0, 0.0, v * 0.6)


def lies_exr(pfad):
    kopf = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height", "-of", "json", pfad],
        capture_output=True, check=True, text=True)
    strom = json.loads(kopf.stdout)["streams"][0]
    w, h = strom["width"], strom["height"]
    roh = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", pfad, "-f", "rawvideo", "-pix_fmt", "gbrpf32le", "-"],
        capture_output=True, check=True).stdout
    ebenen = np.frombuffer(roh, dtype="<f4").reshape(3, h, w)
    # gbrp: Ebenen in der Reihenfolge G, B, R
    return np.stack([ebenen[2], ebenen[0], ebenen[1]], axis=-1)


def himmelsgitter(w, h):
    """RA und Dec der Pixelmitten, je (h, w), in Grad."""
    x = (np.arange(w, dtype=np.float64) + 0.5) / w
    y = (np.arange(h, dtype=np.float64) + 0.5) / h
    ra = (180.0 - x * 360.0) % 360.0
    dec = 90.0 - y * 180.0
    return np.meshgrid(ra, dec)


def galaktische_breite(ra, dec):
    r = np.radians
    sinb = (np.sin(r(dec)) * np.sin(r(DEC_NGP))
            + np.cos(r(dec)) * np.cos(r(DEC_NGP)) * np.cos(r(ra - RA_NGP)))
    return np.degrees(np.arcsin(np.clip(sinb, -1.0, 1.0)))


def verkleinere(feld, breite):
    """Flächenmittel auf breite × breite/2 (Feld (h, w, 3), Fließkomma)."""
    h, w, _ = feld.shape
    f = w // breite
    return feld.reshape(h // f, f, w // f, f, 3).mean(axis=(1, 3))


def leuchtdichte(rgb):
    return 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]


def kurve(hdr_mess):
    """Potenzkurve S = a·Y^g durch Median und 99,5-Perzentil des Bandes."""
    h, w, _ = hdr_mess.shape
    ra, dec = himmelsgitter(w, h)
    band = np.abs(galaktische_breite(ra, dec)) < BAND_GRAD
    y = leuchtdichte(hdr_mess)[band]
    y = y[y > 0]
    median, spitze = np.median(y), np.percentile(y, 99.5)
    g = np.log(ZIEL_SPITZE / ZIEL_MEDIAN) / np.log(spitze / median)
    a = ZIEL_MEDIAN / median ** g
    return float(a), float(g)


def textur(hdr, a, g):
    """HDR → Textur (sRGB 0..255, uint8) mit eingerechneter ACES-Umkehrung."""
    y = np.maximum(leuchtdichte(hdr), 0.0)
    schirm = np.clip(a * np.power(y, g, where=y > 0, out=np.zeros_like(y)), 0, 255)
    lin = textur_aus_schirm(schirm)
    anteil = np.divide(hdr, y[..., None], out=np.zeros_like(hdr), where=y[..., None] > 0)
    kanal = lin[..., None] * np.clip(anteil, 0.0, 4.0)
    return np.round(255.0 * linear_zu_srgb(kanal)).astype(np.uint8)


def schirmwerte(textur_u8):
    """Vorhergesagte Zielwerte am Schirm (Entwurf §3.2) für ein Texturbild (h, w, 3)."""
    h, w, _ = textur_u8.shape
    ra, dec = himmelsgitter(w, h)
    b = np.abs(galaktische_breite(ra, dec))
    schirm = leuchtdichte(schirm_aus_textur(textur_u8.astype(np.float64) / 255.0))
    return {
        "band_median": round(float(np.median(schirm[b < BAND_GRAD])), 1),
        "band_p995": round(float(np.percentile(schirm[b < BAND_GRAD], 99.5)), 1),
        "pol_mittel": round(float(schirm[b > POL_GRAD].mean()), 1),
    }


def winkelabstand(ra1, dec1, ra2, dec2):
    r = np.radians
    c = (np.sin(r(dec1)) * np.sin(r(dec2))
         + np.cos(r(dec1)) * np.cos(r(dec2)) * np.cos(r(ra1 - ra2)))
    return float(np.degrees(np.arccos(np.clip(c, -1.0, 1.0))))


def lage(bild):
    """Maximum im 10°-Fenster um jedes Merkmal; Abstand zum Sollpunkt in Grad."""
    grau = np.asarray(bild.convert("L").filter(ImageFilter.GaussianBlur(2)), dtype=np.float64)
    h, w = grau.shape
    ergebnis = []
    for name, ra, dec, toleranz in MERKMALE:
        x0 = ((180.0 - ra) % 360.0) / 360.0 * w
        y0 = (90.0 - dec) / 180.0 * h
        r = int(10.0 / 360.0 * w)
        bester = None
        for y in range(max(0, int(y0) - r), min(h, int(y0) + r + 1)):
            for x in range(int(x0) - r, int(x0) + r + 1):
                wert = grau[y, x % w]
                if bester is None or wert > bester[0]:
                    bester = (wert, x % w, y)
        assert bester is not None
        _, x, y = bester
        ra_ist = (180.0 - (x + 0.5) / w * 360.0) % 360.0
        dec_ist = 90.0 - (y + 0.5) / h * 180.0
        abstand = winkelabstand(ra, dec, ra_ist, dec_ist)
        ergebnis.append({"name": name, "ra": round(ra_ist, 1), "dec": round(dec_ist, 1),
                         "abstand": round(abstand, 2), "ok": abstand <= toleranz})
    return ergebnis


def bauen(quelle, zielordner, breiten):
    hdr = lies_exr(quelle).astype(np.float64)
    mess = verkleinere(hdr, MESS_BREITE)
    a, g = kurve(mess)
    lage_ergebnis = lage(Image.fromarray(textur(verkleinere(hdr, 1024), a, g)))
    if not all(m["ok"] for m in lage_ergebnis):
        print(json.dumps({"lage": lage_ergebnis}))
        raise SystemExit("Lageprüfung gescheitert: Karte gespiegelt oder verschoben?")
    werte = schirmwerte(textur(mess, a, g))
    voll = textur(hdr, a, g)
    del hdr
    os.makedirs(zielordner, exist_ok=True)
    stufen = []
    for breite in breiten:
        bild = Image.fromarray(voll)
        if breite != bild.width:
            bild = bild.resize((breite, breite // 2), Image.Resampling.LANCZOS)
        # KTX2 kennt kein flipY: Zeile 0 der Datei muss der Südrand sein.
        bild = bild.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        pfad = os.path.join(zielordner, f"himmel-{breite}.png")
        bild.save(pfad)
        stufen.append({"breite": breite, "png": pfad})
    return {"kurve": {"a": a, "g": g}, "lage": lage_ergebnis, "werte": werte, "stufen": stufen}


def main(argv):
    befehl = argv[1]
    if befehl == "bauen":
        ergebnis = bauen(argv[2], argv[3], [int(b) for b in argv[4:]])
    elif befehl == "lage":
        ergebnis = {"lage": lage(Image.open(argv[2]).convert("RGB"))}
    else:
        raise SystemExit(f"unbekannter Befehl: {befehl}")
    print(json.dumps(ergebnis))


if __name__ == "__main__":
    main(sys.argv)
