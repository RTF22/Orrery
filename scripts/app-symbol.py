"""Zeichnet das App-Symbol (schlichtes Orrery-Zeichen) in 192 und 512 Pixeln.

Aufruf aus dem Projektstamm: python scripts/app-symbol.py
Das Motiv liegt vollständig in der inneren Sicherheitszone (80 % der Fläche),
damit Android es als maskierbares Symbol rund oder abgerundet beschneiden darf.
"""
from pathlib import Path

from PIL import Image, ImageDraw

GRUND = (5, 7, 13)          # fast schwarz, wie der Weltraum der Anwendung
BAHN = (120, 140, 170)      # gedämpftes Blaugrau
SONNE = (255, 196, 80)
INNEN = (90, 160, 255)      # blauer Planet auf der inneren Bahn
AUSSEN = (210, 120, 80)     # rötlicher Planet auf der äußeren Bahn
UEBERABTASTUNG = 4


def zeichne(groesse: int) -> Image.Image:
    s = groesse * UEBERABTASTUNG
    bild = Image.new('RGB', (s, s), GRUND)
    d = ImageDraw.Draw(bild)
    m = s / 2

    def kreis(r: float, **art: object) -> None:
        d.ellipse((m - r, m - r, m + r, m + r), **art)

    strich = max(1, round(s * 0.012))
    kreis(s * 0.24, outline=BAHN, width=strich)
    kreis(s * 0.36, outline=BAHN, width=strich)
    kreis(s * 0.11, fill=SONNE)
    for bahn, winkel_x, winkel_y, farbe, r in (
        (0.24, 0.866, -0.5, INNEN, 0.045),   # 30° über der Waagerechten, rechts
        (0.36, -0.766, 0.643, AUSSEN, 0.055),  # 220°, links unten
    ):
        x, y = m + s * bahn * winkel_x, m + s * bahn * winkel_y
        d.ellipse((x - s * r, y - s * r, x + s * r, y + s * r), fill=farbe)
    return bild.resize((groesse, groesse), Image.Resampling.LANCZOS)


if __name__ == '__main__':
    ziel = Path('public/icons')
    ziel.mkdir(parents=True, exist_ok=True)
    for groesse in (192, 512):
        zeichne(groesse).save(ziel / f'orrery-{groesse}.png', optimize=True)
        print(f'public/icons/orrery-{groesse}.png')
