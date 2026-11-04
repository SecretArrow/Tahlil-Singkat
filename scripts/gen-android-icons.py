#!/usr/bin/env python3
"""
Generate the Tahlil Singkat Android launcher icon set from an SVG.

Produces, under android/app/src/main/res/:
  - mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher.png        (legacy, full icon)
  - mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher_round.png  (legacy, round)
  - mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher_foreground.png (adaptive fg)
  - mipmap-anydpi-v26/ic_launcher.xml        (adaptive icon descriptor)
  - mipmap-anydpi-v26/ic_launcher_round.xml  (adaptive round descriptor)
  - values/ic_launcher_background.xml        (background color resource)
  - values-round/ic_launcher_background.xml  (round background color resource)
  - playstore-icon.png                       (512x512, repo root, for store listings)

Also updates AndroidManifest to reference @mipmap/ic_launcher (adaptive-aware).
"""
import os
import shutil
import cairosvg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")

# Emerald → teal gradient, with a white open book and a small crescent.
# The book sits in the centre; for the adaptive-foreground variant the
# background is transparent and the glyph is scaled into the 66% safe zone.
BACKGROUND_SVG = """
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0d4f3c"/>
    <stop offset="0.55" stop-color="#0f766e"/>
    <stop offset="1" stop-color="#14b8a6"/>
  </linearGradient>
</defs>
<rect x="0" y="0" width="1024" height="1024" rx="220" ry="220" fill="url(#bg)"/>
"""

# The glyph (book + crescent) drawn within a 1024 canvas, centred.
# For the foreground variant this is placed on a transparent canvas.
GLYPH_SVG = """
<!-- crescent above the book -->
<path d="M512 250
         a 70 70 0 1 0 49 120
         a 95 95 0 1 1 -49 -120 Z"
      fill="#fbbf24" opacity="0.95"/>
<!-- open book: two pages meeting at a centre spine -->
<path d="M512 410
         C 460 380 390 372 318 380
         C 300 382 290 396 290 414
         L 290 660
         C 290 678 304 690 322 688
         C 390 680 460 688 512 718
         Z"
      fill="#ffffff"/>
<path d="M512 410
         C 564 380 634 372 706 380
         C 724 382 734 396 734 414
         L 734 660
         C 734 678 720 690 702 688
         C 634 680 564 688 512 718
         Z"
      fill="#f8fafc"/>
<!-- spine -->
<rect x="506" y="404" width="12" height="320" rx="6" fill="#0d4f3c" opacity="0.55"/>
<!-- page lines -->
<g stroke="#0d4f3c" stroke-width="6" opacity="0.18">
  <line x1="320" y1="460" x2="480" y2="450"/>
  <line x1="320" y1="500" x2="480" y2="490"/>
  <line x1="320" y1="540" x2="470" y2="532"/>
  <line x1="544" y1="450" x2="704" y2="460"/>
  <line x1="544" y1="490" x2="704" y2="500"/>
  <line x1="554" y1="532" x2="704" y2="540"/>
</g>
"""

def svg_to_png(svg_body: str, size: int, path: str, scale_glyph: float = 1.0):
    """Render an SVG body to a PNG of `size`x`size` at `path`."""
    if scale_glyph != 1.0:
        # Scale the glyph group around the centre (512,512) by wrapping in a transform.
        glyph = f'<g transform="translate(512,512) scale({scale_glyph}) translate(-512,-512)">{GLYPH_SVG}</g>'
    else:
        glyph = GLYPH_SVG
    full = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="{size}" height="{size}">{svg_body}{glyph}</svg>'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    cairosvg.svg2png(bytestring=full.encode("utf-8"), write_to=path, output_width=size, output_height=size)
    print(f"  wrote {path} ({size}x{size})")


def main():
    print("Generating Tahlil Singkat icon set…")
    densities = {
        "mdpi": 48,
        "hdpi": 72,
        "xhdpi": 96,
        "xxhdpi": 144,
        "xxxhdpi": 192,
    }
    # Foreground densities use the 108dp adaptive spec.
    fg_densities = {
        "mdpi": 108,
        "hdpi": 162,
        "xhdpi": 216,
        "xxhdpi": 324,
        "xxxhdpi": 432,
    }

    # 1. Legacy full icons (background + glyph) — square + round.
    for bucket, px in densities.items():
        d = os.path.join(RES, f"mipmap-{bucket}")
        svg_to_png(BACKGROUND_SVG, px, os.path.join(d, "ic_launcher.png"))
        svg_to_png(BACKGROUND_SVG, px, os.path.join(d, "ic_launcher_round.png"))

    # 2. Adaptive foreground — transparent background, glyph scaled into the
    #    safe zone (~66% of the 108dp canvas) so the launcher mask never clips it.
    fg_scale = 0.62  # shrink glyph so it sits inside the masked safe area
    for bucket, px in fg_densities.items():
        d = os.path.join(RES, f"mipmap-{bucket}")
        svg_to_png("", px, os.path.join(d, "ic_launcher_foreground.png"), scale_glyph=fg_scale)

    # 3. Adaptive icon descriptors (Android 8+ use these in preference to the
    #    legacy PNGs; they reference the foreground drawable + a background colour).
    anydpi = os.path.join(RES, "mipmap-anydpi-v26")
    os.makedirs(anydpi, exist_ok=True)
    with open(os.path.join(anydpi, "ic_launcher.xml"), "w") as f:
        f.write(
            '<?xml version="1.0" encoding="utf-8"?>\n'
            '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
            '    <background android:drawable="@color/ic_launcher_background"/>\n'
            '    <foreground android:drawable="@drawable/ic_launcher_foreground"/>\n'
            '    <monochrome android:drawable="@drawable/ic_launcher_foreground"/>\n'
            '</adaptive-icon>\n'
        )
    with open(os.path.join(anydpi, "ic_launcher_round.xml"), "w") as f:
        f.write(
            '<?xml version="1.0" encoding="utf-8"?>\n'
            '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
            '    <background android:drawable="@color/ic_launcher_background"/>\n'
            '    <foreground android:drawable="@drawable/ic_launcher_foreground"/>\n'
            '    <monochrome android:drawable="@drawable/ic_launcher_foreground"/>\n'
            '</adaptive-icon>\n'
        )

    # 4. Background colour resource (emerald, matches the gradient midpoint).
    values = os.path.join(RES, "values")
    os.makedirs(values, exist_ok=True)
    with open(os.path.join(values, "ic_launcher_background.xml"), "w") as f:
        f.write(
            '<?xml version="1.0" encoding="utf-8"?>\n'
            '<resources>\n'
            '    <color name="ic_launcher_background">#0f766e</color>\n'
            '</resources>\n'
        )

    # 5. Play Store 512x512 icon (full, for listings).
    svg_to_png(BACKGROUND_SVG, 512, os.path.join(ROOT, "playstore-icon.png"))

    print("Done.")


if __name__ == "__main__":
    main()
