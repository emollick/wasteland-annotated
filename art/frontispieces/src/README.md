# Regenerating the plates

The SVGs in the folder above are not hand-edited files; they are drawn by these scripts, so a change is a change to the script and a rerun.

Requirements: Python 3.11 with `fonttools` and `shapely` (`pip install fonttools shapely`); for the preview renders, Node with Playwright and a Chromium (`render.js` looks for Playwright under `/opt/node22/lib/node_modules/playwright`; edit that path if yours differs).

Run from this `src` directory's parent, so `src/` is on the path the scripts expect:

```
python3 src/part1.py part-1.svg          # each part script takes an output path; default is the shared folder
python3 src/title.py title.svg
python3 src/initials.py .                # writes initial-1.svg … initial-5.svg into the directory given
python3 src/ornaments.py .               # writes the ornaments, the tailpiece and the two marks
node src/render.js part-1.svg part-1.png 1200 light        # or dark; optional clip "x,y,w,h" in viewBox units, then a scale
node src/contact.js sheet.png light part-1.svg "caption" part-2.svg "caption"
```

`engrave.py` is the engine: polygons in, compact paths out. Hatching is clipped in Python (no clipPath), `holes=` cuts anything that stands in front of a background out of it, `break_fn(x, y)` thins a tone toward zero, `whiteline()` cuts pale lines out of a black mass, `puppet()` builds a figure from a skeleton, and `diff/union/inter/grow` are the shapely booleans. `motifs.py` holds the small creatures the plates and ornaments share. The initials outline `fonts/EBGaramond[wght].ttf` at weight 500 through fontTools; the font is under the SIL Open Font License in `fonts/OFL.txt`.

Colours: ink is `currentColor`; the two accents are `var(--violet, #4A3560)` and `var(--gold, #A8873A)` (constants at the top of `engrave.py`).
