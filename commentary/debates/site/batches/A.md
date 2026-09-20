# BATCH A: the site's own words. Page titles, the title page, each page's opening lines, the lens names and descriptions, the tool names and the words the tools speak, the recurring card labels, the About page, the map and listening-room captions, the tarot reading's notes.

These live in the page templates (the build thread is exporting them as site/pages.txt and site/ui.txt). Each record below has a working id in square brackets, a "where" line, and the text as it stands on the live site. Labels may be one or two words. Where a record is a heading or label, judge it as a heading or label, not as a sentence.

## Running head and page titles

[running-head] where: the strip at the top of every page. Items: "The Waste Land" (site name) · "The poem" · "Map" · "Listen" · "Drafts" · "Library" · "Pathways" · "About"

[page-title-poem] where: browser tab of the poem page. Text: "The Waste Land, annotated"
[page-title-map] where: browser tab and the map page's heading (h1). Text: "Where the poem is standing" (tab: "The map of The Waste Land")
[page-title-listen] where: heading of the listening room. Text: "The listening room"
[page-title-drafts] where: heading of the drafts page. Text: "What Pound cut" (tab: "The drafts of The Waste Land")
[page-title-library] where: heading of the library page. Text: "The library"
[page-title-paths] where: heading of the pathways page. Text: "Pathways" (tab: "Pathways through The Waste Land")
[page-title-about] where: heading of the About page. Text: "About this edition"

[theme-button] where: the small dot in the running head that switches dark mode. Tooltip: "The violet hour". Screen-reader label: "Switch between paper and the violet hour".

## The title page (top of the poem page)

[tp-sub] where: under the title, author and year, before the poem. Text: "The whole poem, with Eliot’s notes, the sources in their own words, the voices, the languages, the water, the map, the recordings, the drafts, and pathways through it."

[tp-begin] where: the line of links under it. Text: "Begin  or take the first reading, twelve stops  or read it line by line" (three links: "Begin", "take the first reading, twelve stops", "read it line by line")

[epigraph-link] where: screen-reader label on the epigraph. Text: "About the epigraph"

## The lens bar ("Read with")

[lens-bar-label] where: the label before the row of lens buttons. Text: "Read with"
[lens-bar-aria] where: screen-reader name of the row. Text: "Ways of reading"

Each lens has a one-word name on the button and a one-line description in its tooltip:
[lens-plain] name: "Plain" — tooltip: "The poem alone"
[lens-echoes] name: "Echoes" — tooltip: "The sources, phrase by phrase"
[lens-notes] name: "Notes" — tooltip: "Eliot’s 1922 notes beside their lines"
[lens-voices] name: "Voices" — tooltip: "Who is speaking"
[lens-tongues] name: "Tongues" — tooltip: "Eight languages, translated"
[lens-water] name: "Water" — tooltip: "Water, drought and fire"
[lens-places] name: "Places" — tooltip: "Where the poem is standing"
[lens-clock] name: "Clock" — tooltip: "The hours and the seasons"
[lens-drafts] name: "Drafts" — tooltip: "What Pound cut"

[tools-menu] where: the "Do" button opens a list of tools. Button: "Do". Items: "Line by line" · "Turn the cards" · "Unstack the fragments" · "Draw a line" · "Find a word" · "By heart" · "Take a pathway"

## The legend card each lens opens in the margin

[legend-notes] where: the card at the head of the Notes lens. Label: "Eliot’s notes, 1922". Text: "Written to fill out the Boni & Liveright book; Eliot later called them “bogus scholarship.” They appear here beside the lines they belong to, and in full after the poem. Gold dots mark the lines that have one."

[notes-card-label] where: on each of Eliot's notes when it opens beside its line. Text: "Eliot’s note · line 20" (pattern: "Eliot’s note · line N")

[legend-voices] where: the card at the head of the Voices lens, above the list of speakers. Text: "The typescript was headed He Do the Police in Different Voices. Each change of speaker is marked; the colours are only a way of seeing where one voice stops and another starts. Who counts as a voice is a reading, not a fact." Then: "Click a voice, here or in the text, to follow it alone through the poem." When a voice is followed: "Following Marie, 10 lines. Click again to hear everyone." Tooltip on a voice tag in the text: "Follow this voice alone".

[legend-tongues] where: the card at the head of the Tongues lens. Text: "Latin and Greek before the first line; German, French, Italian and Sanskrit inside the poem; Provençal in the notes; and the languages of birds, bells and the river. Click any coloured phrase for its translation. The poem leaves them untranslated on purpose: the reader of 1922 was meant to feel the wall." Language labels in the list: English, Latin, Greek, German, French, Italian, Provençal, Sanskrit, "Birds, bells and river-noise".

[legend-water] where: the card at the head of the Water lens, above a bar showing the proportions. Text: "Every line that is wet, dry or burning, tinted. The poem's argument is a weather report: rain that is unwelcome, rivers that are dirty, a sea that drowns, and then twenty-nine lines of rock before three words of rain." Labels in the list: "water, rain, river, sea" · "rock, stone, dust, drought" · "fire and burning".

[legend-places] where: the card at the head of the Places lens. Text: "Place names are marked. Click one for its lines and its spot on the map. The route in Part I, London Bridge to King William Street to St Mary Woolnoth, is the walk Eliot took to Lloyds Bank every morning; the river in Part III runs from Richmond to Margate." Then a link: "The map, drawn from the river's real course."

[place-card] where: the card that opens when a place name is clicked. Label: "Place". Text pattern: "Named at line 62, line 427. 51.508°, -0.088°." Link: "See it on the map".

[legend-clock] where: the card at the head of the Clock lens, above a drawn clock face. Text: "Every hour the poem names, plotted on a day. Most of them fall after dark. The year runs from April to “winter noon” and back to spring; the poem's own season, by its leaves and its weather, is late October." Then two lists headed "Hours" and "Seasons". Screen-reader label of the clock drawing: "The hours the poem names".

[legend-drafts] where: the card at the head of the Drafts lens. Text: "Where the typescript differed, a typewritten note stands in the text: the Boston opening, the Fresca couplets, the eighty-three lines of sea voyage, Pound's pencil and Vivien's. The cut passages are still in copyright and are described, not quoted." Link: "The whole story of the cuts".

[draft-marker] where: each typewritten note in the text under the Drafts lens ends with a link. Text: "The drafts page".

## Card labels (the small label at the top of every margin card)

[card-kinds] Labels by kind of card: "Echo" · "Note" · "Place" · "From the drafts" · "A voice" · "Another language" · "Sound" · "Picture". Under the label, the lines: "line 20" or "lines 1–7".
[card-source] where: the foot of a card that quotes a source. Text: "Jessie L. Weston, From Ritual to Romance (1920). In the library" and, when a free text exists, "Read it whole: [link]".
[card-close] Screen-reader label of the × button: "Close". "more" is the button on a long note that is clamped.

## The "ways into" heading on each part

[ways-heading] where: at the head of each of the five parts, a fold-out list. Headings as they stand: "Ten ways into The Burial of the Dead" · "Nine ways into A Game of Chess" · "Eleven ways into The Fire Sermon" · "Six ways into Death by Water" · "Twelve ways into What the Thunder Said". (The lists themselves belong to the five part threads; the heading pattern is decided here.)

## The tools, and what they say

[tool-linebyline] where: the bar at the foot of the screen in line-by-line reading. Title: "Line by line · 1 of 434 · I". Text: "One line at a time, with whatever belongs to it beside it. ↓ or space for the next, ↑ for the last; click any line to move there." Buttons: "Back" · "Next" · "Let it walk" / "Stop it walking". Screen-reader label of ×: "Stop reading line by line".

[tool-pathway-bar] where: the small guide in the corner while walking a pathway. Title: "A first reading · 3 of 12". Head: "Line 35 · I" (or "The title page"). Buttons: "Back" · "Next" / "Finish". Screen-reader label of ×: "Leave the pathway".

[tool-pathway-overlay] where: the "Take a pathway" window. Title: "Take a pathway". Subtitle: "A walk through the poem in a dozen stops or so. The guide stays in the corner; the poem stays where it is." Then the nine pathways, each with its title and intro.

[tool-tarot-overlay] where: the "Turn the cards" window. Title: "Madame Sosostris deals". Subtitle: "Lines 46–56. Turn each card. “I am not familiar with the exact constitution of the Tarot pack of cards, from which I have obviously departed to suit my own convenience.” (Eliot’s note.)" Under the cards: "Turn a card over to read what it is, where it comes from, and where it turns up again in the poem." Below, a second heading: "The rest of the pack", with: "The poem’s people, places and portents as a suit of their own, drawn for this edition; each card carries the number of the line where it first appears. Click a card to read it, and again to go there." When a pack card is turned: "[Card name]. [what it shows]" then "[what it answers to]" then "Go to line N, or click the card again." (or "Go to the epigraph").

The eight cards of the reading, each with a note (shown when the card is turned) and a description of the drawing ("In this pack: …"):

[tarot-phoenician-sailor] name: "The drowned Phoenician Sailor". Note: "Not in any Tarot pack. He is Phlebas of Part IV, the merchant of Part III, and Ferdinand’s drowned father in The Tempest, whose eyes are pearls. “Fear death by water,” says the clairvoyante; Part IV obliges." Drawing: "In this pack: a sailor in a striped jersey sinking head first through the water, a ship’s wheel already on the bottom, two gold pearls for eyes. He is drawn inverted on purpose: he is the Hanged Man the reading cannot find, gone into the water instead."

[tarot-belladonna] name: "Belladonna, the Lady of the Rocks". Note: "“Beautiful lady,” the deadly nightshade, and the drops women used to widen their pupils. Leonardo’s Virgin of the Rocks is behind the title; the woman in the chair of Part II is in front of it. “The lady of situations” is gossip-column English." Drawing: "In this pack: a woman in a grotto of stone, wrapped in black to the chin, pupils wide with the drops, lips violet, a sprig of nightshade held up; sea through the mouth of the cave."

[tarot-three-staves] name: "The man with three staves" (numbered III, with Pamela Colman Smith's Three of Wands as a fallback picture). Note: "A real card, the Three of Wands: a figure on a headland, back turned, watching ships go out. Eliot associated him, “quite arbitrarily,” with the Fisher King, who sits on the shore at line 424." Drawing: "In this pack: a man seen from behind on a headland of cracked earth, watching two barges under a low red sun. His three staves are a crutch, a fishing rod with its line down, and a staff planted in the ground that has begun to sprout: a wound, a line, a rod of office."

[tarot-wheel] name: "The Wheel" (X). Note: "The Wheel of Fortune, card X of the major arcana: rise, reign, fall. “O you who turn the wheel and look to windward,” line 320, is a helmsman and this card at once." Drawing: "In this pack: Fortune’s wheel drawn as a ship’s wheel, the same man in a bowler at its four stations, enthroned, falling, crushed, climbing. It looks ahead to “you who turn the wheel and look to windward”."

[tarot-one-eyed-merchant] name: "The one-eyed merchant". Note: "Not a card. One-eyed because seen in profile; he is Mr. Eugenides of Smyrna, with his currants and his invitation, at line 209. Something on his back that the clairvoyante is forbidden to see." Drawing: "In this pack: Mr. Eugenides in profile, which is the only kind of one-eyed man a printed card can have: bowler, astrakhan collar, a handful of currants held out, and on his back a roped bundle whose contents are not shown."

[tarot-blank] name: "The blank card". Note: "“This card, / Which is blank, is something he carries on his back, / Which I am forbidden to see.” The one card the poem refuses to read. Weston’s merchants carried the Grail mysteries along the trade routes; whatever this is, it is not shown." Drawing: "In this pack: bare paper inside the frame. Faintly, the merchant’s bundle shows through from the other side, reversed, as if the print on the back had bled. Something is there and cannot be read. Hold the pointer over it."

[tarot-hanged-man] name: "The Hanged Man" (XII). Note: "Card XII: a young man hanging by one foot from a living tree, serene, haloed. Eliot linked him to Frazer’s Hanged God, the sacrificed king whose death brings the rain, and to the hooded figure on the road to Emmaus. Madame Sosostris does not find him. No sacrifice, no resurrection, in this deal." Drawing: "In this pack: a dead tree with one long bough, a rope with its noose hanging open, and where the Hanged Man should hang, inverted, one leg crooked, the paper is left bare in his shape. Round the head that is not there, a gold halo. Far off on a road, two walkers and a hooded third."

[tarot-crowd-in-a-ring] name: "Crowds of people, walking round in a ring". Note: "Not a card but what she sees: Dante’s neutrals running after their banner, Frazer’s villagers round the maypole, the commuters on London Bridge four lines later, the hooded hordes of Part V." Drawing: "In this pack: a ring of walkers in bowlers and cloche hats, seen from above, going round clockwise on a bare plain, the path worn into the ground under their feet. The centre of the ring is empty."

[tool-fragments] where: the "Unstack the fragments" window. Title: "The fragments, unstacked". Subtitle: "The last eight lines, in five languages. Click a line to pull it out of the stack and see where it came from." For the one line that is not a quotation: "“These fragments I have shored against my ruins.” The one line in the stack that is not a quotation, and the poem’s account of its own method: other people’s lines propped like timbers against a wall…" (continues; the rest of this sentence was not captured, treat the opening as the sample).

[tool-sortes] where: the "Draw a line" window. Title: "Sortes". Subtitle: "Madame Sosostris’s method: one line, at random, and what stands behind it. Fortune-telling by a poem that is mostly quotations." Each draw shows: "Line 62 · I. The Burial of the Dead", the line, its note if any, else "No note on this line. Some lines are just lines." Links: "Go to it in the poem" · button "Draw another".

[tool-concordance] where: the "Find a word" window. Title: "Find a word". Subtitle: "Every occurrence, with its line. The words the poem uses most are listed below; “water” and “nothing” between them are a reading of the poem." Search box placeholder: "water, dead, nothing, dry, rock, eyes…"

[tool-byheart] where: the "By heart" tool (memorising: words are hidden progressively). Text not captured from the live site; the export will carry it. Judge the name only.

[tool-drawaline] name only: "Draw a line" (opens Sortes).

## The map page

[map-lede] where: under the map's heading. Text: "The poem walks a real city. London Bridge, King William Street, St Mary Woolnoth and Lombard Street are one route, the one Eliot took to work at Lloyds Bank; the Strand, Queen Victoria Street, Lower Thames Street and St Magnus Martyr are another; the river runs from Richmond and Kew past Greenwich Reach and the Isle of Dogs to Margate, where the third Thames-daughter sits on the sand. Click a place for its lines. The river is drawn from OpenStreetMap’s survey of its actual course."

[map-city-head] where: heading of the City inset. Text: "The City, a mile of it"
[map-city-lede] Text: "From the Cannon Street Hotel to Billingsgate, with the buildings the poem names drawn as they stood in 1922: Hawksmoor’s St Mary Woolnoth keeping the hours over King William Street, Rennie’s London Bridge with the morning crowd flowing north, Wren’s St Magnus the Martyr at the bridge foot, the hotel where Mr. Eugenides asks you to luncheon. Click a building for its lines."
[map-grey-dots] Text: "Grey dots are places from Eliot’s own life that the poem does not name."
[map-world-head] where: heading of the world map. Text: "The poem’s world"
[map-world-lede] Text: "From the Starnberger See to the Ganges, in the order the poem names them, with a line drawn between. The poem’s centre of gravity is London, but its last places are a river in India and a mountain range, and its first is a lake outside Munich where a king drowned."
[map-unnamed] where: the card for a grey dot. Text: "Not named in the poem; a place from Eliot’s own year."

## The listening room page (its own words; the records are in batch D)

[listen-lede] Text: "Eliot read the poem aloud to the Woolfs in June 1922 before most people had seen a line of it, and the recordings of his own voice, flat and incantatory, are the best commentary on it. Nothing here is copied onto this site: each record plays from the library, archive or broadcaster that holds it, and opens there."
[listen-heads] Section headings and their captions: "Eliot’s own voice" — "Two readings by the poet, more than a decade apart, and a fragment of a third." · "Other readers" — "Actors mostly, and one volunteer." · "The music in it" — "The poem quotes two operas and a rag; here they are." · "The hermit-thrush" — "The bird of line 357, singing in the pine trees, from three places." · "The printings and the manuscript" — "The 1922 book and magazine, page by page, and where the manuscript is."
[listen-labels] On each record: "Play here" (opens the embedded player) · "Open at The Poetry Archive" (pattern: "Open at [host]").

## The library page (its own words; the records are in batch C)

[library-lede] Text: "Everything the poem quotes, borrows or bends, in its own words and language, with a translation where one is needed, a note on what Eliot did with it, the lines where it surfaces, and a place to read the whole thing free. Fifty-five works in eight languages, from a Vedic hymn to a rag of 1912. Click a line number to go to it in the poem."
[library-labels] On each record: "In the poem: line 62, line 63" · "Read it whole: [links]". Section headings by kind: "Poems", "Plays", "Scripture", etc.

## The drafts page (its own words; the records are in batch B and the part directories)

[drafts-lede] Text: "The poem was typed out at about eight hundred lines and published at four hundred and thirty-four. Ezra Pound did most of the cutting, in pencil, in Paris in January 1922; Vivien Eliot added comments and one line; Eliot struck out his own first opening. The typescript survived, lost for forty years, and was printed in facsimile in 1971. The cut passages are still in copyright, so they are described here, not reproduced; the descriptions follow the facsimile edition page by page."
[drafts-lede-2] Text: "Pound’s own account, in the letter he sent Eliot with the edited drafts in the winter of 1921–22: he called himself the poem’s sage homme, its man-midwife."
[drafts-at] On each record: "at line 77" (pattern: "at line N").
[drafts-pencil-head] Heading: "The pencil, quoted". List: "too tum-pum at a stretch — beside the opening of Part II." · "verse not interesting enough as verse to warrant so much of it — on the typist." · "Perhaps be damned — against a hedging line." · "make up yr. mind / you Tiresias / if you know / know damn well / or / else / you / dont" · "Bad — across the sea voyage of Part IV." · "OK from here on I think — at the head of Part V." · "echt — beside the river song." · "And in a letter: Complimenti, you bitch. I am wracked by the seven jealousies."
[drafts-foot] Text: "Every quotation on this page is from the facsimile edition (ed. Valerie Eliot, 1971) or from the published letters of Pound and Eliot, and is given in the spirit of quotation for comment. The full drafts are worth an afternoon in any library that has the book."

## The pathways page (its own words; the intros are in batch B)

[paths-lede] Text: "Nine walks through the poem, each a sequence of places to stand. Choose one and the poem page opens with a small guide that takes you from stop to stop. They are not summaries; they are routes."
[paths-count] On each: "12 stops".

## Eliot's notes, printed after the poem

[notes-heading] Heading: "Notes on The Waste Land"
[notes-about] Text: "Eliot’s notes as printed in the 1922 book, keyed to his own line numbers. The margin numbers on this page count the lines as they are; the 1922 printing’s numbers run one behind from line 346 onward, so that his “line 433” is the poem’s 434th, and his notes do not always agree with the margin. Why." ("Why" links to the About page.)

## The colophon (foot of every page)

[colophon] Text: "The text is that of the first book edition (Boni & Liveright, New York, December 1922), which is in the public domain in the United States. Annotations, translations and design were written for this edition; sources are quoted from public-domain texts and named on each card. Map data © OpenStreetMap contributors (ODbL). Pictures are public domain or Creative Commons and credited where they appear." Link: "About this edition". Screen-reader name of the aside: "Marginalia".

## The About page

[about-text-head] Heading: "The text"
[about-text-1] "The poem is given as it stands in the first book edition, published by Boni & Liveright in New York in December 1922, including Eliot’s notes, which were written for that edition; the poem had appeared in The Criterion (October 1922) and The Dial (November 1922) without them. That text is in the public domain in the United States, where this site is published. In the United Kingdom and the European Union the poem remains in copyright until the end of 2035, seventy years after Eliot’s death."
[about-text-2] "The 1922 text differs in small ways from the one in later Faber editions. This edition keeps the 1922 readings and notes the later ones where they matter: “Quando fiam ceu chelidon” at line 429 (later “uti,” the word in the Latin poem); “aetherial” at line 416 (later “aethereal”); the note on “Shantih,” which in 1922 calls the English phrase “a feeble translation of the content of this word” and later “our equivalent.” The pub talk’s “dont” and “wont,” “alright” at line 161, “tonight” at line 111 and “smoothes” at line 255 are the 1922 book’s own spellings, kept as they stand. The dedication to Pound was not printed until 1925 and is included here because Eliot wrote it into Pound’s copy in January 1923. Three slips of the 1922 press are set right: “Oed’ und leer das Meer” at line 42 was printed with a plain O; “The hot water at ten” at line 135 lost its a; and “Dead mountain mouth of carious teeth” at line 339 reads “mount in” in most copies of the first printing, the type having shifted as it ran. Typographic quotation marks and a few spellings have been regularised from the transcription on Project Gutenberg, which was checked against a scan of the 1922 printing."
[about-numbering-head] Heading: "The 434th line called 433"
[about-numbering] "The 1922 printing numbers every tenth line in the margin. On page 42, in Part V, “If there were water” is set flush right as the run-over of “From doors of mudcracked houses” and is not counted, so from line 346 the printed numbers run one behind: 350 stands beside “A spring,” 360 beside “When I count, there are only you and I together” (the poem’s 361st line), and the last line, “Shantih shantih shantih,” is famously “line 433” although the poem has 434. Eliot’s notes mostly follow the printed count, but not always: the note on the hermit-thrush is numbered 357 and the note on the Antarctic expedition 360, which fit the true count, while 366–76, 401, 411, 424 and 433 fit the printed one. On this site the margin counts the lines as they are, and each note is attached to the line Eliot meant."
[about-written-head] Heading: "What was written for this edition"
[about-written] "The annotations, the translations of the sources, the descriptions of the voices, the tagging of water and drought, the pathways and the section “ways in” were written for this site. Every claim about the poem’s composition can be traced to one of: the facsimile edition of the drafts (Valerie Eliot, ed., 1971); The Letters of T. S. Eliot, volume 1; The Poems of T. S. Eliot, edited by Christopher Ricks and Jim McCue (2015), whose commentary is the standard reference; Lawrence Rainey’s The Annotated Waste Land (2005); Robert Crawford’s Young Eliot (2015); and Matthew Hollis’s The Waste Land: A Biography of a Poem (2022). The recordings and source texts are linked, not copied, from the libraries and archives that hold them."
[about-voices-head] Heading: "Voices from 1922"
[about-voices] Four quotations with attributions: (1) “He sang it & chanted it rhythmed it. It has great beauty & force of phrase: symmetry; & tensity. What connects it together, I’m not so sure.” Virginia Woolf, diary, June 1922, after Eliot read the poem at dinner. (2) “Complimenti, you bitch. I am wracked by the seven jealousies.” Ezra Pound to Eliot, January 1922 (or the December before; the letter is dated in a calendar of his own invention). (3) “Various critics have done me the honour to interpret the poem in terms of criticism of the contemporary world, have considered it, indeed, as an important bit of social criticism. To me it was only the relief of a personal and wholly insignificant grouse against life; it is just a piece of rhythmical grumbling.” Eliot, in a lecture at Harvard, as reported by Theodore Spencer and printed at the head of the facsimile edition. (4) “It gives me very great pleasure that you like The Waste Land, and especially Part V which in my opinion is not only the best part, but the only part that justifies the whole, at all.” Eliot to Bertrand Russell, October 1923.
[about-timeline-head] Heading: "A timeline" (entries are in batch B)
[about-how-head] Heading: "How the site works"
[about-how-1] "The poem page is the whole thing. The row of lenses above the text changes what the page shows beside each line: Eliot’s notes, the sources, the speakers, the languages, the water, the places, the hours, the cuts. The keys 1 to 9 switch lenses; Escape closes anything open. Marked phrases open a card in the margin (or under the line, on a phone). The hairline strip at the edge of the screen is the poem itself, one mark per line, coloured by the lens you are using; click it to move. The violet hour, the dark setting, follows your system’s preference and can be switched with the small dot in the running head."
[about-how-2] "Two ways of reading are meant to be slower than a page allows. “Line by line” dims everything but one line and brings whatever belongs to it into the margin: the echo, Eliot’s note, a change of speaker, a translation; the arrow keys move, or let it walk on its own at a reading pace. In the voices lens, clicking a speaker follows that voice alone through the poem, so you can hear what the woman in the chair says from beginning to end, or the thunder, or the Thames-daughters."
[about-type-head] Heading: "Type, drawings and pictures"
[about-type] "The type is EB Garamond (Georg Duffner and Octavio Pardo), Cormorant Garamond (Christian Thalmann) and Courier Prime (Alan Dague-Greene for Quote-Unquote Apps), all under the SIL Open Font License and served from this site. The tarot pack, the frontispieces to the five parts and the buildings on the map were drawn for this edition. The photographs and paintings come from Wikimedia Commons and are credited here:" (then the list of picture credits, e.g. "T. S. Eliot, 1923. Lady Ottoline Morrell, 1923. Public domain, via Wikimedia Commons Commons" — note the doubled word "Commons Commons" on every credit line.)
[about-map-head] Heading: "Map"
[about-map] "The river is drawn from OpenStreetMap’s survey of the Thames (relation 2263653), © OpenStreetMap contributors, ODbL; places were geocoded with Nominatim. Coastlines on the world map are from Natural Earth (public domain)."
