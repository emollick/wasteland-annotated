# The Waste Land, annotated

The source of https://the-waste-land.netlify.app: the 1922 text of *The Waste Land* with Eliot's notes, a commentary on every part of it, and several ways through the poem (lenses on the notes, the sources, the voices, the languages, the water, the places, the drafts and the hours; pathways on its themes; a map of its London; a listening room; a library of the texts it draws on). The poem is the page, and everything else opens from it.

## What is here

    site/          the built site, as Netlify serves it (netlify.toml: publish = site)
    build/         build.js, which writes site/ from data/, research/ and art/; the scripts named below
    data/          the poem, Eliot's notes and the commentary, in the record format described in commentary/README.md:
                   the glosses of each part, the ways into each part, the pathways and their stops, the drafts,
                   the library, the listening room, the voices, the dates, the page texts and the tools' words,
                   and works.txt, the list of the editions and studies the notes cite
    research/      working files: the 1922 text as fetched, the records behind the images and recordings, the source links
    art/           the tarot pack for Madame Sosostris, the frontispieces and ornaments, and the map vignettes of London,
                   drawn as SVG by code; each directory keeps its sources and a NOTES.md, and STYLE.md is the direction they follow
    commentary/    the commentary as exported for the editorial work on it: the same records as data/, part by part,
                   with the debates over each part (debates/), the citing of the sources (citations/), and the pathways

## Building

    node build/build.js

Node alone; there are no dependencies. The build reads the art and the commentary from the project's shared directory (/mnt/project-files) when it is present and from art/ and commentary/ here otherwise. `build/commentary.js export` writes the commentary out for editing and `build/commentary.js import part1|…|part5|site|all` takes it back, refusing a record whose fixed fields changed; `build/pathways.js` takes in a delivered set of thematic pathways; `build/sync.sh` copies the shared art and commentary into this repository before a commit.

## Deploying

site/ is deployed to Netlify as it stands, and each deploy is committed and pushed here, so the history is the history of the live site.

## The texts

The 1922 text and Eliot's notes to it are in the public domain in the United States and are given whole. Recordings of the poem are linked or embedded from where they are published, never copied. Eliot's writing after 1929 (the drafts, the letters, the lectures) is described or quoted in a phrase.

## The commentary

The notes were written to the standard of a plain scholarly edition, argued over part by part between a scholar's reading and a reader's (the rounds are in commentary/debates/), and then cited: every note names the editions and studies it rests on, under References, and the library page lists the works. A claim that could not be verified against a source stays uncited and is listed in commentary/citations/.

## Licence

The code (build/, the drawing scripts under art/, and the site's JavaScript and stylesheet) is under the MIT licence, in LICENSE. Everything written or drawn for the edition, the commentary and its records, the research notes, the built site and the art, is under the Creative Commons Attribution 4.0 International licence, in LICENSE-CONTENT, which also says what is not ours to license: the 1922 text and Eliot's notes are in the public domain in the United States and in copyright elsewhere (in the United Kingdom until the end of 2035); passages quoted from scholars and other writers remain their authors'; the fonts are under the SIL Open Font License (art/frontispieces/src/fonts/OFL.txt); the pictures come from Wikimedia Commons, most in the public domain and a few under Creative Commons licences of their own, each credited with its licence in research/images.json; the map's river is OpenStreetMap data under the ODbL; the recordings are not here.
