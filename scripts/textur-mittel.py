"""Mittlere lineare Reflexion jeder Albedo-Textur, breitengradgewichtet,
ohne Datenluecken — dieselbe Rechnung wie src/render/albedo.ts, hier offline
fuer die Fixture src/render/__fixtures__/textur-mittel.json.

Aufruf aus dem Projektstamm:  python scripts/textur-mittel.py
"""
import datetime
import glob
import json
import os

import numpy as np
from PIL import Image

MESS_BREITE, MESS_HOEHE = 256, 128
LUECKEN_SCHWELLE_LINEAR = 0.005


def srgb_zu_linear(kanal):
    v = kanal / 255.0
    return np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)


def mittlere_reflexion(pfad):
    bild = Image.open(pfad).convert("RGB").resize((MESS_BREITE, MESS_HOEHE), Image.BILINEAR)
    lin = srgb_zu_linear(np.asarray(bild).astype(float))
    grau = lin.mean(axis=2)
    breite_grad = 90 - (np.arange(MESS_HOEHE) + 0.5) / MESS_HOEHE * 180
    gewicht = np.cos(np.radians(breite_grad))[:, None] * np.ones_like(grau)
    zaehlt = grau >= LUECKEN_SCHWELLE_LINEAR
    if not zaehlt.any():
        return None
    return float((grau * gewicht)[zaehlt].sum() / gewicht[zaehlt].sum())


def main():
    mittel = {}
    for pfad in sorted(glob.glob(os.path.join("public", "textures", "*", "albedo.*"))):
        schluessel = pfad.replace(os.sep, "/").removeprefix("public/")
        wert = mittlere_reflexion(pfad)
        if wert is not None:
            mittel[schluessel] = round(wert, 4)
    fixture = {
        "quelle": "scripts/textur-mittel.py",
        "erzeugtAm": datetime.date.today().isoformat(),
        "messgroesse": "mittlere lineare Reflexion, 256x128, cos(Breite)-gewichtet, Pixel < 0.005 ausgeschlossen",
        "mittel": mittel,
    }
    ziel = os.path.join("src", "render", "__fixtures__", "textur-mittel.json")
    os.makedirs(os.path.dirname(ziel), exist_ok=True)
    with open(ziel, "w", encoding="utf-8", newline="\n") as f:
        json.dump(fixture, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"{len(mittel)} Texturen -> {ziel}")


if __name__ == "__main__":
    main()
