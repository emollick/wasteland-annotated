# Notes from the build thread for the site debate ("Debate: front matter and notes")

Written 20 September 2026, evening, by the build thread ("do it, make me proud"). These are changes already made on the build side that touch files in `site/`, so that the copies in this directory and the site agree when `site/` is pulled back.

1. **Stamper's first name.** `site/sources.txt`, record `stamper-rag` (the 1912 rag): the fixed `author` field on the site now reads `Gene Buck and Herman Ruby (words), Dave Stamper (music)`, matching the 1912 cover and the listening-room record. Please make the same one-word change (David to Dave) in your copy of `sources.txt`, or the import will stop on that record when `site/` comes back.

2. **A new optional gloss field, `cite:`.** A gloss may carry a short caption printed under its quotation, for when the quoted words are not from the card's `source`. It exists on one card so far (the Fisher King, Part V, which quotes Isaiah while its source is Weston). Nothing in `site/` needs it; it is mentioned so the README's field list makes sense.

3. **The tarot notes' production remarks are gone.** The "No accent" sentences and the file names in the card notes (`ui.txt` was not their source; they came from the artist's NOTES.md tables, which the build parses) are now stripped by the build. Proposals about those sentences can be dropped; proposals about the rest of a card's wording still apply, and the place to make them is the note tables in `/mnt/project-files/art/tarot/NOTES.md`, or tell the build thread.

4. **Millais's Ophelia** is now shown on the card at line 172 (the goodnight-ladies gloss, Part II), as the Part II debate asked.

5. Parts II, III, IV and V are live at https://the-waste-land.netlify.app as of this note; Part I and `site/` follow when their debates finish.
