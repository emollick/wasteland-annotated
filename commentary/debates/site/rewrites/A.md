# Rewrite, batch A: the site's own words (pages.txt and ui.txt)

Editor's merge of r1/A-scholar.md and r1/A-reader.md. The ids are now the real ones from
/mnt/project-files/commentary/site/pages.txt and ui.txt (the round-one reports used working ids; the
map is given at the foot). Rule applied: the scholar's facts, the reader's wording. Records not listed
here stand as they are in the export.

Decisions the editor made where the two differed:
- Lens names: "Echoes" becomes "Sources" and "Tongues" becomes "Languages" (the reader could not guess
  either; the scholar left names to the reader). "Clock" stays: the lens draws a clock face. The card
  labels change with them (kind-echo "Echo" -> "Source"; kind-tongue "Another language" -> "Translation").
- "Pathways" stays as the name (the reader: the page's lede explains it at once; renaming would touch
  the running head, the title page, the tools, the guide and the About page).
- Tools: the button is "Tools"; every item is an imperative naming what the tool does (both sides offered
  this set in nearly the same words).
- The Water legend says only what is tinted and how the count is made (the scholar's substance); the
  reader's sentence about the poem's water being unwelcome is a reading and is left out.
- The commute over London Bridge is out everywhere (not established; see the scholar's Checked list).
- The theme button's tooltip is the reader's "Light or dark"; the screen-reader label names the function.
- Quotations from Eliot's post-1929 words are cut to phrases (about-quote-3). The Russell letter is 1923
  and stays whole.

---

## pages.txt

### meta-description
OLD: T. S. Eliot’s The Waste Land (1922), the whole text with Eliot’s notes, the sources in their own words, the voices, the languages, the water, the map of its London, the recordings, the drafts, and pathways through it.
NEW: T. S. Eliot’s The Waste Land (1922): the whole text with Eliot’s notes, and beside each line its sources, translations, speakers and places; with a map of its London, the recordings, the drafts, and nine pathways through the poem.
(Editor's change, to match tp-sub; not in the round-one batch. Both to check.)

### theme-label
OLD: Switch between paper and the violet hour
NEW: Switch between light and dark

### theme-title
OLD: The violet hour
NEW: Light or dark

### colophon
OLD: … Annotations, translations and design were written for this edition; …
NEW: The text is that of the first book edition (Boni &amp; Liveright, New York, December 1922), which is in the public domain in the United States. The annotations, translations and design are this edition’s own; sources are quoted from public-domain texts and named on each card. Map data © OpenStreetMap contributors (ODbL). Pictures are public domain or Creative Commons and credited where they appear.

### tp-sub
OLD: The whole poem, with Eliot’s notes, the sources in their own words, the voices, the languages, the water, the map, the recordings, the drafts, and pathways through it.
NEW: The whole poem, with Eliot’s notes, and beside each line its sources, translations, speakers and places. On other pages, the map, the recordings, the drafts, and nine pathways through the poem.

### tp-begin-path
OLD: take the first reading, twelve stops
NEW: take the guided first reading, twelve stops

### tp-begin-slow
OLD: read it line by line
NEW: read it one line at a time

### rb-do
OLD: Do
NEW: Tools

### The nine lenses (button, then tooltip)
lens-plain: Plain — lens-plain-desc: The poem alone (unchanged)
lens-echoes: Sources (was Echoes) — lens-echoes-desc: What the poem quotes, phrase by phrase (was "The sources, phrase by phrase")
lens-notes: Notes — lens-notes-desc: Eliot’s 1922 notes beside their lines (unchanged)
lens-voices: Voices — lens-voices-desc: Who is speaking (unchanged)
lens-tongues: Languages (was Tongues) — lens-tongues-desc: The foreign phrases, translated (was "Eight languages, translated": English is not translated)
lens-water: Water — lens-water-desc: Water, drought and fire (unchanged)
lens-places: Places — lens-places-desc: The places the poem names, and the map (was "Where the poem is standing")
lens-clock: Clock — lens-clock-desc: The hours and the seasons (unchanged)
lens-drafts: Drafts — lens-drafts-desc: The cuts and changes before printing (was "What Pound cut")

### The seven tools
tool-slow: Read line by line (was "Line by line")
tool-cards: Turn the tarot cards (was "Turn the cards")
tool-fragments: Unstack the last lines (was "Unstack the fragments"; the overlay is titled "The last eight lines")
tool-sortes: Draw a line at random (was "Draw a line")
tool-concordance: Find a word (unchanged)
tool-heart: Learn it by heart (was "By heart")
tool-walk: Take a pathway (unchanged)

### notes-about
OLD: Eliot’s notes as printed in the 1922 book, keyed to his own line numbers. The margin numbers on this page count the lines as they are; the 1922 printing’s numbers run one behind from line 346 onward, so that his “line 433” is the poem’s 434th, and his notes do not always agree with the margin. <a href="about.html#numbering">Why</a>.
NEW: Eliot’s notes as printed in the 1922 book, with his own line numbers. The margin on this page counts every line of the poem; the 1922 printing’s numbers run one behind from line 346, so that Eliot’s “line 433” is this margin’s 434, and his numbers do not always agree with the margin. <a href="about.html#numbering">On the numbering</a>.

### margin-aria
OLD: Marginalia
NEW: Margin notes

### map-title
OLD: Where the poem is standing
NEW: The map

### map-lede
OLD: The poem walks a real city. London Bridge, King William Street, St Mary Woolnoth and Lombard Street are one route, the one Eliot took to work at Lloyds Bank; …
NEW: The places the poem names in London, and its river. London Bridge, King William Street and St Mary Woolnoth lie on one route, the way City workers came in from London Bridge station; it ends a short walk from Lloyds Bank, where Eliot worked. The Strand, Queen Victoria Street, Lower Thames Street and St Magnus Martyr make a second route, in Part III. The river’s places run from Richmond and Kew past Greenwich Reach and the Isle of Dogs to Margate Sands, where the third Thames-daughter speaks. Click a place for its lines. The river is drawn from OpenStreetMap data.
(Lombard Street is not named in the poem and is dropped from the list.)

### world-lede
OLD: From the Starnberger See to the Ganges, in the order the poem names them, with a line drawn between. The poem’s centre of gravity is London, but its last places are a river in India and a mountain range, and its first is a lake outside Munich where a king drowned.
NEW: The places the poem names, from the Starnbergersee near Munich to the Ganges, joined by a line in the order the poem names them. The lake is the first place named (line 8); Ludwig II of Bavaria drowned in it in 1886.

### city-title
OLD: The City, a mile of it
NEW: The City

### city-lede
OLD: From the Cannon Street Hotel to Billingsgate, with the buildings the poem names drawn as they stood in 1922: Hawksmoor’s St Mary Woolnoth keeping the hours over King William Street, Rennie’s London Bridge with the morning crowd flowing north, Wren’s St Magnus the Martyr at the bridge foot, the hotel where Mr. Eugenides asks you to luncheon. Click a building for its lines.
NEW: A mile of the City, from the Cannon Street Hotel to Billingsgate, with the buildings the poem names drawn as they stood in 1922: St Mary Woolnoth, Hawksmoor’s church at the top of King William Street, whose clock the poem hears; London Bridge, Rennie’s bridge of 1831, which the crowd crosses in Part I; St Magnus the Martyr, Wren’s church at the foot of the bridge; and the Cannon Street Hotel, where Mr. Eugenides asked the speaker to lunch. Click a building for its lines.

### library-lede
OLD: Everything the poem quotes, borrows or bends, in its own words and language, with a translation where one is needed, a note on what Eliot did with it, the lines where it surfaces, and a place to read the whole thing free. Fifty-five works in eight languages, from a Vedic hymn to a rag of 1912. Click a line number to go to it in the poem.
NEW: The works the poem quotes or draws on, in eight languages, from the Upanishads to a rag of 1912. Each is given in its own language, with a translation where one is needed, a note on what Eliot did with it, the lines where it appears in the poem, and a link to a free text of the whole work. Click a line number to go to it in the poem.
(The count "fifty-five" is dropped: the library has fifty-six records and several works have more than one, so no count is safe.)

### drafts-title
OLD: What Pound cut
NEW: The drafts

### drafts-lede
OLD: The poem was typed out at about eight hundred lines and published at four hundred and thirty-four. Ezra Pound did most of the cutting, in pencil, in Paris in January 1922; Vivien Eliot added comments and one line; Eliot struck out his own first opening. The typescript survived, lost for forty years, and was printed in facsimile in 1971. …
NEW: The poem was typed out at roughly twice its published length of four hundred and thirty-four lines. Ezra Pound did most of the cutting, in Paris in January 1922 and by letter after Eliot went home; Vivien Eliot added comments and two lines of the pub scene; Eliot himself struck out the first opening of Part I. Eliot gave the typescript to John Quinn in 1922. After Quinn’s death in 1924 it went unseen until the New York Public Library bought it in 1958, and its whereabouts were made public only in 1968, three years after Eliot’s death. It was printed in facsimile in 1971. The cut passages are still in copyright, so they are described here, not reproduced; the descriptions follow the facsimile edition page by page.
(Scholar to confirm in round 2: Vivien Eliot's two lines, 153 and 164, against the facsimile; "roughly twice its published length" replaces "about eight hundred lines", which nobody had checked.)

### drafts-lede-2
OLD: Pound’s own account, in the letter he sent Eliot with the edited drafts in the winter of 1921–22: he called himself the poem’s <i>sage homme</i>, its man-midwife.
NEW: Pound’s own account is in the letter of 24 January 1922 answering the revised typescript Eliot had sent from London. The verses in it are signed <i>Sage Homme</i>, man-midwife, and say that “on each Occasion / Ezra performed the Caesarean Operation.”

### pencil-title
OLD: The pencil, quoted
NEW: Pound’s comments

### drafts-note
OLD: Every quotation on this page is from the facsimile edition (ed. Valerie Eliot, 1971) or from the published letters of Pound and Eliot, and is given in the spirit of quotation for comment. The full drafts are worth an afternoon in any library that has the book.
NEW: Every quotation on this page is from the facsimile edition (ed. Valerie Eliot, 1971) or from the published letters of Pound and Eliot, kept to a phrase or two and quoted for comment. The drafts can be read in full in the facsimile edition.

### listen-lede
OLD: Eliot read the poem aloud to the Woolfs in June 1922 before most people had seen a line of it, and the recordings of his own voice, flat and incantatory, are the best commentary on it. Nothing here is copied onto this site: each record plays from the library, archive or broadcaster that holds it, and opens there.
NEW: Recordings of the poem, beginning with Eliot’s own, the music it quotes, the song of the bird in Eliot’s note to line 357, and the 1922 printings page by page. Nothing is copied onto this site: each recording plays from the library, archive or broadcaster that holds it, and can be opened there.

### listen-readers-lede
OLD: Actors mostly, and one volunteer.
NEW: Actors mostly, and one LibriVox volunteer.

### listen-music-lede
OLD: The poem quotes two operas and a rag; here they are.
NEW: The two operas and the rag that the poem quotes.

### listen-birds-lede
OLD: The bird of line 357, singing in the pine trees, from three places.
NEW: The bird of Eliot’s note to line 357, in three recordings.

### listen-pages-lede
OLD: The 1922 book and magazine, page by page, and where the manuscript is.
NEW: The 1922 printings, page by page, and where the manuscript is.

### paths-lede
OLD: Nine walks through the poem, each a sequence of places to stand. Choose one and the poem page opens with a small guide that takes you from stop to stop. They are not summaries; they are routes.
NEW: Nine pathways through the poem, each a sequence of about a dozen stops. Choose one and the poem page opens with a small guide in the corner that takes you from stop to stop.

### about-numbering-title
OLD: The 434th line called 433
NEW: The line numbering

### about-numbering
OLD: … is famously “line 433” although the poem has 434. …
NEW: the same paragraph with "famously" removed: … and the last line, “Shantih shantih shantih,” is “line 433” although the poem has 434. …

### about-text-2
OLD: … reads “mount in” in most copies of the first printing, the type having shifted as it ran. …
NEW: the same paragraph with that clause as: … reads “mount in” in many copies of the first printing, the a having dropped out as the sheets ran. …

### about-voices-title
OLD: Voices from 1922
NEW: Four remarks on the poem

### about-quote-1
OLD attribution: Virginia Woolf, diary, June 1922, after Eliot read the poem at dinner.
NEW: “He sang it &amp; chanted it rhythmed it. It has great beauty &amp; force of phrase: symmetry; &amp; tensity. What connects it together, I’m not so sure.” Virginia Woolf, diary, 23 June 1922, after Eliot read the poem at dinner.

### about-quote-2
OLD: “Complimenti, you bitch. I am wracked by the seven jealousies.” Ezra Pound to Eliot, January 1922 (or the December before; the letter is dated in a calendar of his own invention).
NEW: “Complimenti, you bitch. I am wracked by the seven jealousies.” Ezra Pound to Eliot, 24 January 1922, answering the revised typescript. Pound dated the letter “24 Saturnus, An 1,” in a calendar of his own devising, and it was long thought to be from December 1921.

### about-quote-3
OLD: “Various critics have done me the honour to interpret the poem in terms of criticism of the contemporary world, have considered it, indeed, as an important bit of social criticism. To me it was only the relief of a personal and wholly insignificant grouse against life; it is just a piece of rhythmical grumbling.” Eliot, in a lecture at Harvard, as reported by Theodore Spencer and printed at the head of the facsimile edition.
NEW: To Eliot the poem was “the relief of a personal and wholly insignificant grouse against life,” “just a piece of rhythmical grumbling.” His remark as quoted by Theodore Spencer in a lecture at Harvard and written down by Eliot’s brother, Henry Ware Eliot Jr.; printed at the head of the facsimile edition (1971).
(Cut to phrases: the remark is from the 1930s and falls under the rule on Eliot's later words. The attribution was reversed.)

### about-quote-4
unchanged (the letter is from 1923; the rule does not bite).

### about-how-1
OLD: The poem page is the whole thing. The row of lenses above the text changes what the page shows beside each line: Eliot’s notes, the sources, the speakers, the languages, the water, the places, the hours, the cuts. The keys 1 to 9 switch lenses; Escape closes anything open. Marked phrases open a card in the margin (or under the line, on a phone). The hairline strip at the edge of the screen is the poem itself, one mark per line, coloured by the lens you are using; click it to move. The violet hour, the dark setting, follows your system’s preference and can be switched with the small dot in the running head.
NEW: Everything is on the poem page. The row of lenses above the text chooses what the page shows beside each line: Eliot’s notes, the sources, the speakers, the translations, water and drought, the places, the hours, or the cuts from the drafts. The keys 1 to 9 switch lenses; Escape closes anything open. Marked phrases open a card in the margin (or under the line, on a phone). The thin strip at the edge of the screen stands for the whole poem, one mark per line, coloured by the lens in use; click it to move to a line. The dark setting, called the violet hour after line 215, follows your system’s preference and can be switched with the small dot in the running head.

### about-how-2
OLD: Two ways of reading are meant to be slower than a page allows. “Line by line” dims everything but one line and brings whatever belongs to it into the margin: the echo, Eliot’s note, a change of speaker, a translation; the arrow keys move, or let it walk on its own at a reading pace. In the voices lens, clicking a speaker follows that voice alone through the poem, so you can hear what the woman in the chair says from beginning to end, or the thunder, or the Thames-daughters.
NEW: Two ways of reading are for going slowly. “Line by line” dims everything but one line and brings whatever belongs to it into the margin: its source, Eliot’s note, a change of speaker, a translation. The arrow keys move between lines, or it can move on by itself at reading pace. In the Voices lens, clicking a speaker follows that voice alone through the poem, so that you can read everything one speaker says from beginning to end: the woman in the chair in Part II, the thunder, the Thames-daughters.

### about-map
OLD: The river is drawn from OpenStreetMap’s survey of the Thames (relation 2263653), …
NEW: The river is drawn from OpenStreetMap data for the Thames (relation 2263653), © OpenStreetMap contributors, ODbL; places were geocoded with Nominatim. Coastlines on the world map are from Natural Earth (public domain).

---

## ui.txt

### kind-echo
OLD: Echo
NEW: Source

### kind-voice
OLD: A voice
NEW: Voice

### kind-tongue
OLD: Another language
NEW: Translation

### notes-head-text
OLD: Written to fill out the Boni &amp; Liveright book; Eliot later called them “bogus scholarship.” They appear here beside the lines they belong to, and in full <a href="#notes">after the poem</a>. Gold dots mark the lines that have one.
NEW: Eliot’s notes were first printed in the book edition of December 1922; the poem had appeared in <i>The Criterion</i> and <i>The Dial</i> without them. In 1956 Eliot said they had been expanded to fill out a book that was “inconveniently short,” and called them “bogus scholarship.” Each appears here beside its lines, and all of them <a href="#notes">after the poem</a>. Gold dots mark the lines that have one.

### legend-voices-text
OLD: The typescript was headed <i>He Do the Police in Different Voices</i>. Each change of speaker is marked; the colours are only a way of seeing where one voice stops and another starts. Who counts as a voice is a reading, not a fact.
NEW: Eliot’s typescripts of Parts I and II were headed <i>He Do the Police in Different Voices</i>, a phrase from Dickens’s <i>Our Mutual Friend</i>. Each change of speaker is marked, and each voice has its own colour, so that you can see where one stops and another starts. Which changes count as a new voice is a matter of interpretation; the divisions marked here are this edition’s reading.

### voices-following
OLD: Following {voice}, {n} lines. Click again to hear everyone.
NEW: Following {voice}, {n} lines. Click again to show all the voices.

### legend-tongues-text
OLD: Latin and Greek before the first line; German, French, Italian and Sanskrit inside the poem; Provençal in the notes; and the languages of birds, bells and the river. Click any coloured phrase for its translation. The poem leaves them untranslated on purpose: the reader of 1922 was meant to feel the wall.
NEW: Latin and Greek in the epigraph; German, French, Italian, Latin and Sanskrit in the poem; Provençal in Eliot’s note on line 428, which quotes Arnaut Daniel’s speech in Dante. The cries of birds, the bells and the river’s song are marked as well. Click any coloured phrase for a translation. Eliot printed none of them in translation; the translations here were made for this edition.

### legend-tongues
OLD: Tongues
NEW: Languages

### legend-water-text
OLD: Every line that is wet, dry or burning, tinted. The poem's argument is a weather report: rain that is unwelcome, rivers that are dirty, a sea that drowns, and then twenty-nine lines of rock before three words of rain.
NEW: Lines that mention water (rain, river, sea), drought (rock, stone, dust) or fire are tinted. The bar below shows how much of the poem each takes, and the count under it how many lines.

### legend-water-note
OLD: The tagging is by hand and by sense, not by keyword: “a spring” at line 351 is water; “in the spring” at line 198 is not. Argue with it.
NEW: The tagging was done for this edition by sense, not by keyword: “a spring” at line 351 is water; “in the spring” at line 198 is not.

### legend-places-text
OLD: Place names are marked. Click one for its lines and its spot on the map. The route in Part I, London Bridge to King William Street to St Mary Woolnoth, is the walk Eliot took to Lloyds Bank every morning; the river in Part III runs from Richmond to Margate.
NEW: Place names are marked. Click one for its lines and its spot on the map. The route of Part I, over London Bridge and up King William Street to St Mary Woolnoth, is the way City workers came in from London Bridge station; Eliot’s note to line 68 says the “dead sound” of the church clock at nine was “a phenomenon which I have often noticed,” and Lloyds Bank, where he worked from 1917 to 1925, was a short walk from the church. The places along the river in Part III run from Richmond to Margate.

### legend-places-link
OLD: <a href="map.html">The map</a>, drawn from the river's real course.
NEW: <a href="map.html">See the map</a>.

### legend-clock-text
OLD: Every hour the poem names, plotted on a day. Most of them fall after dark. The year runs from April to “winter noon” and back to spring; the poem's own season, by its leaves and its weather, is late October.
NEW: The hours the poem names, set on a clock face, and below them the seasons it names: April and spring rain, the winter that “kept us warm,” the summer that “surprised us,” the winter dawn and winter noon of the City, and, in Part V, “thunder of spring over distant mountains.” The fallen leaves of Part III are autumn without the word.

### legend-drafts-text
OLD: Where the typescript differed, a typewritten note stands in the text: the Boston opening, the Fresca couplets, the eighty-three lines of sea voyage, Pound's pencil and Vivien's. The cut passages are still in copyright and are described, not quoted.
NEW: Where the typescript differed from the printed poem, a note in typewriter face stands in the text and describes the passage: the cancelled opening of Part I, the couplets about Fresca that opened Part III, the sea voyage that opened Part IV, and the smaller cuts and changes made by Pound, by Vivien Eliot and by Eliot himself. The cut passages are still in copyright, so they are described, not quoted.

### legend-drafts-link
OLD: The whole story of the cuts
NEW: The drafts page

### tarot-phoenician-sailor-deck
OLD: … He is drawn inverted on purpose: he is the Hanged Man the reading cannot find, gone into the water instead.
NEW: In this pack: a sailor in a striped jersey sinking head first through the water, a ship’s wheel already on the bottom, two gold pearls for eyes. He is drawn head down, in the posture of the Hanged Man, the card Madame Sosostris does not find.

### tarot-phoenician-sailor-note
OLD: <p>Not in any Tarot pack. He is Phlebas of Part IV, the merchant of Part III, and Ferdinand’s drowned father in <i>The Tempest</i>, whose eyes are pearls. “Fear death by water,” says the clairvoyante; Part IV obliges.</p>
NEW: <p>Not a card of any Tarot pack. Eliot’s note to line 46 says the Phoenician Sailor “appears later” and that “Death by Water is executed in Part IV”: he is Phlebas. The note to line 218 adds that the one-eyed merchant “melts into the Phoenician Sailor, and the latter is not wholly distinct from Ferdinand Prince of Naples.” Line 48, “Those are pearls that were his eyes,” is from Ariel’s song in <i>The Tempest</i>, sung to Ferdinand about his father, who is thought drowned.</p>

### tarot-belladonna-note
OLD: <p>“Beautiful lady,” the deadly nightshade, and the drops women used to widen their pupils. Leonardo’s <i>Virgin of the Rocks</i> is behind the title; the woman in the chair of Part II is in front of it. “The lady of situations” is gossip-column English.</p>
NEW: <p>Belladonna is Italian for “beautiful lady”; it is also the name of deadly nightshade, and of the eye-drops made from it, which women once used to widen their pupils. “The Lady of the Rocks” has been read as an allusion to Leonardo’s <i>Virgin of the Rocks</i>, and Belladonna has often been linked with the woman in the chair in Part II.</p>

### tarot-three-staves-deck
OLD: … a staff planted in the ground that has begun to sprout: a wound, a line, a rod of office.
NEW: In this pack: a man seen from behind on a headland of cracked earth, watching two barges under a low red sun. His three staves are a crutch, a fishing rod with its line down, and a staff planted in the ground that has begun to sprout.

### tarot-wheel-note
OLD: <p>The Wheel of Fortune, card X of the major arcana: rise, reign, fall. “O you who turn the wheel and look to windward,” line 320, is a helmsman and this card at once.</p>
NEW: <p>The Wheel of Fortune, card X of the major arcana, on which figures rise, reign and fall as it turns. Eliot’s note does not mention it. The wheel at line 320, “O you who turn the wheel and look to windward,” is a ship’s wheel; it has also been read as this card.</p>

### tarot-one-eyed-merchant-deck
OLD: In this pack: Mr. Eugenides in profile, which is the only kind of one-eyed man a printed card can have: bowler, astrakhan collar, …
NEW: In this pack: Mr. Eugenides in profile, so that only one eye shows: bowler, astrakhan collar, a handful of currants held out, and on his back a roped bundle whose contents are not shown.

### tarot-one-eyed-merchant-note
OLD: <p>Not a card. One-eyed because seen in profile; he is Mr. Eugenides of Smyrna, with his currants and his invitation, at line 209. Something on his back that the clairvoyante is forbidden to see.</p>
NEW: <p>Not a card of the pack. Eliot’s note to line 218 calls him “the one-eyed merchant, seller of currants,” which makes him Mr. Eugenides, the Smyrna merchant of line 209, with his pocket full of currants and his invitation to lunch. Why he is one-eyed is not explained; one suggestion is that he is seen in profile, as figures on cards often are. What he carries on his back is the blank card, “which I am forbidden to see” (line 54).</p>

### tarot-blank-deck
OLD: In this pack: bare paper inside the frame. Faintly, the merchant’s bundle shows through from the other side, reversed, as if the print on the back had bled. Something is there and cannot be read. Hold the pointer over it.
NEW: In this pack: bare paper inside the frame. Faintly, the merchant’s bundle shows through from the other side, reversed, as if the print on the back had bled through.
("Hold the pointer over it" is dropped unless the build thread says what happens; then "Hold the pointer over it to …".)

### tarot-blank-note
OLD: <p>“This card, / Which is blank, is something he carries on his back, / Which I am forbidden to see.” The one card the poem refuses to read. Weston’s merchants carried the Grail mysteries along the trade routes; whatever this is, it is not shown.</p>
NEW: <p>“This card, / Which is blank, is something he carries on his back, / Which I am forbidden to see” (lines 52–54). Madame Sosostris cannot read it, and the poem never says what it is. Jessie Weston, in <i>From Ritual to Romance</i>, suggested that the mystery cult behind the Grail legend was carried into Europe by Syrian merchants, and the merchant’s unseen burden has been read in that light.</p>

### tarot-hanged-man-deck
OLD: … the paper is left bare in his shape. Round the head that is not there, a gold halo. Far off on a road, two walkers and a hooded third.
NEW: In this pack: a dead tree with one long bough, a rope with its noose hanging open, and where the Hanged Man should hang, inverted, one leg crooked, the paper is left bare in his shape, with a gold halo where his head would be. Far off on a road, two walkers and a hooded third.

### tarot-hanged-man-note
OLD: <p>Card XII: a young man hanging by one foot from a living tree, serene, haloed. Eliot linked him to Frazer’s Hanged God, the sacrificed king whose death brings the rain, and to the hooded figure on the road to Emmaus. Madame Sosostris does not find him. No sacrifice, no resurrection, in this deal.</p>
NEW: <p>Card XII of the major arcana: a man hanging by one foot from a living tree, his face calm, a halo round his head. Eliot’s note says the card “fits my purpose in two ways: because he is associated in my mind with the Hanged God of Frazer, and because I associate him with the hooded figure in the passage of the disciples to Emmaus in Part V.” Frazer’s Hanged God is in <i>The Golden Bough</i>, his study of the sacrificed gods of old religion. Madame Sosostris does not find him: “I do not find / The Hanged Man” (lines 54–55).</p>

### tarot-crowd-in-a-ring-note
OLD: <p>Not a card but what she sees: Dante’s neutrals running after their banner, Frazer’s villagers round the maypole, the commuters on London Bridge four lines later, the hooded hordes of Part V.</p>
NEW: <p>Not a card; it is what she sees next. Eliot’s note says the “crowds of people” appear later: the crowd that flows over London Bridge at line 62, six lines on, which his note to line 63 traces to the souls in Dante’s <i>Inferno</i> (canto III) who run for ever after a banner. The “hooded hordes” of Part V (line 369) have been read as the same crowd.</p>

### cards-title
OLD: Madame Sosostris deals
NEW: The tarot cards

### cards-sub
OLD: Lines 46–56. Turn each card. “I am not familiar with the exact constitution of the Tarot pack of cards, from which I have obviously departed to suit my own convenience.” (Eliot’s note.)
NEW: Madame Sosostris’s reading, lines 46–56. Turn each card. Eliot’s note: “I am not familiar with the exact constitution of the Tarot pack of cards, from which I have obviously departed to suit my own convenience.”

### pack-intro
OLD: The poem’s people, places and portents as a suit of their own, drawn for this edition; each card carries the number of the line where it first appears. Click a card to read it, and again to go there.
NEW: A second set of cards, drawn for this edition, for the poem’s other people, places and omens; each carries the number of the line where it first appears. Click a card to read it, and again to go to that line.

### frag-own-line
OLD: “These fragments I have shored against my ruins.” The one line in the stack that is not a quotation, and the poem’s account of its own method: other people’s lines propped like timbers against a wall that is coming down. It is also a boast. The ruins are his.
NEW: “These fragments I have shored against my ruins.” The one line in the stack that is not a quotation. To shore is to prop up, as a wall is propped with timbers; the fragments are the quotations round the line. It has often been read as the poem’s description of its own method.

### fragments-title
OLD: The fragments, unstacked
NEW: The last eight lines

### fragments-sub
OLD: The last eight lines, in five languages. Click a line to pull it out of the stack and see where it came from.
NEW: The last eight lines of the poem, in five languages. Click a line to pull it out of the stack and see where it comes from.

### sortes-none
OLD: No note on this line. Some lines are just lines.
NEW: No note on this line.

### sortes-title
OLD: Sortes
NEW: A line at random

### sortes-sub
OLD: Madame Sosostris’s method: one line, at random, and what stands behind it. Fortune-telling by a poem that is mostly quotations.
NEW: One line of the poem, chosen at random, with its note and its sources if it has any.

### conc-sub
OLD: Every occurrence, with its line. The words the poem uses most are listed below; “water” and “nothing” between them are a reading of the poem.
NEW: Every line a word appears in. The words the poem uses most often are listed below.

### walk-sub
OLD: A walk through the poem in a dozen stops or so. The guide stays in the corner; the poem stays where it is.
NEW: Each pathway takes you through the poem in about a dozen stops. A small guide in the corner of the poem page moves you from one stop to the next.

### slow-text
OLD: One line at a time, with whatever belongs to it beside it. <span class="keys">↓</span> or <span class="keys">space</span> for the next, <span class="keys">↑</span> for the last; click any line to move there.
NEW: One line at a time, with whatever belongs to it beside it. <span class="keys">↓</span> or <span class="keys">space</span> for the next line, <span class="keys">↑</span> for the one before; click any line to move there.

### slow-auto-stop
OLD: Stop it walking
NEW: Stop

### slow-auto-start
OLD: Let it walk
NEW: Move on by itself

---

## Outside the export (for the build thread, not for these files)
- ways.txt part headings ("Ten ways into The Burial of the Dead" and the rest): drop the count: "Ways into The Burial of the Dead", "Ways into A Game of Chess", "Ways into The Fire Sermon", "Ways into Death by Water", "Ways into What the Thunder Said".
- map.js: the card for a grey dot says "a place from Eliot’s own year"; the legend says "Eliot’s own life". Proposed: "Not named in the poem: a place from Eliot’s life while he was writing it."
- About page credits: every line ends "via Wikimedia Commons Commons"; one "Commons".
- The Languages lens: the label "river-noise" (data) reads oddly; "the river" would do.
- The blank card: if holding the pointer over it does something, the deck text should say what.

## Map of working ids (round one) to export ids
page-title-map -> map-title, title-map; page-title-drafts -> drafts-title, title-drafts; theme-button -> theme-label, theme-title; tp-sub -> tp-sub; tp-begin -> tp-begin, tp-or, tp-begin-path, tp-begin-slow; lens-bar-label -> rb-read; lens-* -> lens-*, lens-*-desc; tools-menu -> rb-do, tool-*; legend-notes -> notes-head-text, notes-head-title; legend-voices -> legend-voices-text, voices-follow-hint, voices-following, legend-voices, voice-tag-title; legend-tongues -> legend-tongues-text, legend-tongues; legend-water -> legend-water-text, legend-water-note, legend-water; legend-places -> legend-places-text, legend-places-link, legend-places; legend-clock -> legend-clock-text, clock-*, legend-clock; legend-drafts -> legend-drafts-text, legend-drafts-link, legend-drafts; card-kinds -> kind-*; card-source -> in-library, read-whole-label; card-close -> close; tool-linebyline -> slow-*; tool-pathway-overlay -> walk-title, walk-sub; tool-tarot-overlay -> cards-title, cards-sub, tarot-turn, pack-title, pack-intro; tarot-* -> tarot-*-deck, -name, -note; tool-fragments -> fragments-title, fragments-sub, frag-*; tool-sortes -> sortes-*; tool-concordance -> conc-*; tool-byheart -> tool-heart, heart-*; tool-drawaline -> tool-sortes; map-lede -> map-lede; map-city-head/lede -> city-title, city-lede; map-grey-dots -> map-legend; map-world-head/lede -> world-title, world-lede; map-unnamed -> (map.js, not exported); listen-lede -> listen-lede; listen-heads -> listen-*-lede, listen-*-title; listen-labels -> listen-play, listen-open; library-lede -> library-lede; library-labels -> kind-*, src-*; drafts-* -> drafts-*, pencil-*; paths-lede -> paths-lede; notes-heading -> notes-title; notes-about -> notes-about; colophon -> colophon, colophon-link, margin-aria; about-* -> about-*.
