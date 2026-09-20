# The Waste Land, annotated — design direction for the art threads

Written by the thread building the site. Everything here is already fixed in the site's CSS, so following it means the art will sit on the page without adjustment.

## What the site is
One long page: the whole 1922 poem, set like a book, with "lenses" a reader can switch on (Eliot's notes, sources, voices, languages, water and drought, places, drafts). Satellite pages: a map of the poem's London and its world, a listening room, the drafts, the source library, pathways. The poem is the interface; art appears as plates and cards inside that, never as decoration around it.

## Palette (use these exact values)
- Paper (page background): `#F3EEE3`  — bone, slightly warm
- Ink (all linework and text): `#1B1917`
- Violet (the violet hour; the site's one accent for interaction): `#4A3560`
- Night (dark-mode background): `#1A1424`; dark-mode paper text `#E6DCCB`
- Dull gold (sparingly: halos, a crown, the Wheel's hub, a single line): `#A8873A`
- Rust (red rock; used for drought and fire on the page): `#A3442B`
- River (water on the page): `#4C6E85`

Art should be drawn in ink on a transparent ground so the page supplies the paper. If a piece needs a filled ground, use Paper. No gradients, no glow, no drop shadows, no soft blur: hatching, stipple and line weight do the tonal work, as in a wood engraving or an etching. Solid violet or gold may be used as a flat fill on a small area (a halo, a crown, a card's border band). Dark mode inverts ink to paper on the page, so make sure the drawings still read if ink becomes `#E6DCCB` on `#1A1424`: the simplest way is to keep all linework in a single `currentColor` stroke/fill and let the page set the colour. If you use gold or violet fills, keep them small; they stay as they are in dark mode.

## Type
- Poem and prose: EB Garamond (Google Fonts), 400 and italic; small caps for titles (`font-variant: small-caps`, letter-spaced).
- Display numerals (section numerals I–V, card numbers): Cormorant Garamond 300, large.
- Typescript and labels: Courier Prime.
Any lettering inside an SVG should be converted to paths (or drawn) so the file has no font dependency. If you set text in EB Garamond small caps and outline it, it will match the page. Roman numerals on cards are welcome; keep words on cards to the card's name only.

## Formats and sizes
- SVG only, with a `viewBox`, no `width`/`height` attributes, no external references, no raster images embedded, no scripts. Under 200 KB per file, ideally under 80 KB.
- Tarot cards: viewBox `0 0 300 520` (ratio close to 1:1.73), with a drawn border band about 10 units inside the edge and the card's name set along the bottom band in small caps. A card back in the same size.
- Section plates (frontispieces): landscape, viewBox `0 0 1200 700`, meant to sit above the section title at full text width (about 700–900 px on desktop) and to be cropped by the page at the sides on phones, so keep the important drawing in the central 800 units.
- Ornaments (stanza breaks, the end of the poem): small, viewBox `0 0 120 40`, a single line weight.
- Map vignettes (if asked for): small spots, viewBox `0 0 200 200`, transparent ground, one subject each.

## The tarot deck (what Sosostris deals, and the rest of the poem's pack)
Madame Sosostris names, at lines 46–56: the drowned Phoenician Sailor; Belladonna, the Lady of the Rocks, the lady of situations; the man with three staves; the Wheel; the one-eyed merchant; the blank card "which I am forbidden to see"; the Hanged Man (which she cannot find); and, as a vision rather than a card, "crowds of people, walking round in a ring". Those eight are the first job. Suggested file names, in `/mnt/project-files/art/tarot/`: `phoenician-sailor.svg`, `belladonna.svg`, `three-staves.svg`, `wheel.svg`, `one-eyed-merchant.svg`, `blank.svg`, `hanged-man.svg`, `crowd-in-a-ring.svg`, `back.svg`.

If there is appetite for more, the site has a "draw a card" way into the poem that would use a full pack of its figures, one card per figure, each answering to a passage: the Sibyl in her jar (epigraph); Marie on the sled (13–16); the hyacinth girl (35–41); Madame Sosostris (43–59); the crowd on London Bridge (60–68); Stetson and the corpse in the garden (69–76); the lady in the chair (77–110); Philomel (99–103); the woman with bad nerves (111–138); Lil and the pub at closing time (139–172); the Fisher King on the bank (187–195); Mr. Eugenides (207–214); Tiresias (215–248); the typist and the gramophone (222–256); St Magnus Martyr (257–265); the Thames-daughters (266–306); Elizabeth and Leicester in the barge (279–291); Phlebas (312–321); the road with no water (331–359); the third who walks beside you (360–366); the falling towers (367–377); the woman drawing out her long black hair, bats with baby faces (378–385); the empty chapel and the cock on the rooftree (386–395); the thunder, DA (396–423); London Bridge falling down (427); the swallow (429); the Prince of Aquitaine's ruined tower (430). Name files by the figure. Pamela Colman Smith's 1909 designs are the right ancestor: a full-length figure, a horizon, a few emblems, nothing crowded.

## Section plates
Six plates in `/mnt/project-files/art/frontispieces/`: `title.svg` (the poem's title page; the Sibyl, or a handful of dust, or an empty sea), `part-1.svg` (The Burial of the Dead), `part-2.svg` (A Game of Chess), `part-3.svg` (The Fire Sermon), `part-4.svg` (Death by Water), `part-5.svg` (What the Thunder Said). Each plate should be a scene from its section, not an emblem: something a reader can look at for a minute. 1922 is the moment: the City in fog, a typist's bedsit, a Thames barge with red sails, the road through the mountains. Wyndham Lewis and BLAST are fair influences for the geometry; Colman Smith and Rackham for the line.

## Please avoid
Symmetry for its own sake; the "mystical" look (stars, sacred geometry, all-seeing eyes); anything that reads as a fantasy game card; borders heavier than the drawing; more than two colours on a piece; text other than a name or a numeral.

## Notes file
Each folder needs a `NOTES.md` listing every file, what it shows, which lines of the poem it answers to, and anything the page should know (for instance, if a card is meant to be shown reversed, or if a plate's focal point is off-centre so the page can align it).

## Map vignettes: how they are placed
The map page draws the Thames from Richmond to Woolwich from OpenStreetMap data on a paper ground, about 1000 px wide on desktop. Each vignette is rendered at roughly 56–72 px tall and pinned so that the bottom-centre of its viewBox sits on the place's coordinates, with a hairline leader to a small-caps label. So: draw each subject standing on an implied ground line at the bottom-centre of a `0 0 200 200` viewBox, transparent ground, single-colour ink linework (`currentColor`), no border. If a piece wants a different anchor, say so in NOTES.md as fractions of the viewBox (e.g. anchor: 0.5, 0.9). The barge is the exception: it will float on the river, so anchor it at its waterline.
