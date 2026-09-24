"""Stufen der Albedokarten: verkleinern, spiegeln, Mittel messen, vergleichen.

Aufgerufen von scripts/texturen-bauen.ts; das Mittel rechnet genau wie
scripts/textur-mittel.py (256x128, cos(Breite)-gewichtet, Pixel < 0,005
ausgeschlossen), damit es mit der Fixture vergleichbar bleibt.

  python scripts/textur-stufe.py stufe <quelle> <ziel.png> <breite> [--spiegeln]
  python scripts/textur-stufe.py mittel <bild>
  python scripts/textur-stufe.py vergleich <a> <b>
"""
import importlib.util
import json
import os
import sys

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None  # 8k-Quellen liegen über der Pillow-Vorgabe

_pfad = os.path.join(os.path.dirname(__file__), "textur-mittel.py")
_spec = importlib.util.spec_from_file_location("textur_mittel", _pfad)
textur_mittel = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(textur_mittel)


def stufe(quelle, ziel, breite, spiegeln):
    bild = Image.open(quelle).convert("RGB")
    if breite > bild.width:
        # Eine Stufe über der Quellbreite wäre nur hochgerechnet, keine neue Auflösung.
        raise SystemExit(f"Quelle {quelle} ist {bild.width} breit, Stufe {breite} verlangt")
    bild = bild.resize((breite, breite // 2), Image.LANCZOS)
    if spiegeln:
        # KTX2 kennt kein flipY: Zeile 0 der Datei muss der Südrand sein.
        bild = bild.transpose(Image.FLIP_TOP_BOTTOM)
    # Manche Quellen (z. B. Downloads) tragen ein ICC-Profil; ktx create lehnt
    # das als "unsupported ICC profile" ab. Die Karten sind ohnehin sRGB
    # (--format R8G8B8_SRGB beim Kodieren), das Profil entfällt daher.
    bild.info.pop("icc_profile", None)
    bild.save(ziel)
    return {"breite": bild.width, "hoehe": bild.height}


def vergleich(a, b):
    bild_a = Image.open(a).convert("RGB")
    bild_b = Image.open(b).convert("RGB")
    # min() auf den Tupeln würde lexikografisch vergleichen (erst Breite,
    # dann bei Gleichstand Höhe) statt je Kante die kleinere zu nehmen.
    groesse = (min(bild_a.width, bild_b.width), min(bild_a.height, bild_b.height))
    feld_a = np.asarray(bild_a.resize(groesse, Image.LANCZOS)).astype(float)
    feld_b = np.asarray(bild_b.resize(groesse, Image.LANCZOS)).astype(float)
    return {"abweichung": round(float(np.abs(feld_a - feld_b).mean()), 3)}


def main(argv):
    befehl = argv[1]
    if befehl == "stufe":
        ergebnis = stufe(argv[2], argv[3], int(argv[4]), "--spiegeln" in argv[5:])
    elif befehl == "mittel":
        ergebnis = {"mittel": round(textur_mittel.mittlere_reflexion(argv[2]), 4)}
    elif befehl == "vergleich":
        ergebnis = vergleich(argv[2], argv[3])
    else:
        raise SystemExit(f"unbekannter Befehl: {befehl}")
    print(json.dumps(ergebnis))


if __name__ == "__main__":
    main(sys.argv)
