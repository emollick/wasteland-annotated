# The standard for every note in Part III (read this first)

## What this is
The annotated Waste Land at https://the-waste-land.netlify.app carries commentary beside every line. Its owner, Ethan, has read it and objected that the commentary is "written in the voice of an LLM". His two examples of what must go:

  1. a tour-guide heading: "Where the poem is standing"
  2. this sentence: "The poem's argument is a weather report: rain that is unwelcome, rivers that are dirty, a sea that drowns, and then twenty-nine lines of rock before three words of rain."

He asked for Eliot-scholar agents and reader agents to debate every section "to make sure it is clear, good in its wording, and real". You are one side of that debate for Part III, The Fire Sermon (lines 173 to 311 in the site's count). An editor runs the debate, decides, and applies the rewrites. Three rounds at most per note. On substance the scholar has the last word; on wording the reader has it. What is not settled is written down.

## What "the voice of an LLM" means here, from Ethan's examples
- Tour-guide framing and headings ("Where the poem is standing", "Notice that", "Decide whether", "read it once each way").
- The aphoristic "X is a Y:" opening followed by a rhythmic list of three or four ("The poem's argument is a weather report: rain that..., rivers that..., a sea that...").
- The tidy flourish that counts things to sound clever ("twenty-nine lines of rock before three words of rain"; "a sentence, a word four times, a prayer, a prayer with its end torn off, one word alone"; "Four lines, three birds' worth of noise, then the name").
- Metaphors that describe the poem instead of explaining it ("a water-rhythm", "the river's own noise takes over", "relay stations", "the rhymes are doing the judging").
- The last sentence that ties a bow: the epigram, the paradox, the "X is not Y. It is Z." ("The nightingale's song in this poem is never lovely. It is evidence."; "The fire that burns here is lust. The fire at line 428 refines.")
- Second-person flourishes that make the reader the subject ("a question the poem asks about you"; "decides how you read the poem"; "a season you can feel on your skin").
- Superlatives nobody could check ("the most argued-over scene in the poem", "the most terrible short speech in the poem", "the most violent cut in the poem", "the poem's newest object", "its most modern word", "the poem's hour").
- Balanced antitheses for their own sake ("the poem's most private moment and its most public"; "Spenser's river is a procession; Eliot's is the morning after"; "skip the seduction and keep the dying").
- Fragments and stacked clauses strung with colons and semicolons to sound brisk.

## What to aim at instead
The plainness of a good scholarly editor writing for readers: Ricks and McCue's commentary in the 2015 Poems, Southam's Guide, Rainey's Annotated Waste Land. Say what the line refers to, what is known about it and how it is known, what is disputed, and, when a reading is offered, whose it is or that it is one. Then stop. A note may be one sentence. Short sentences are fine; fragments and stacked clauses are not. A fact that does not help a reader with this line is cut, however good. Wit is allowed when it is Eliot's or a source's, not the annotator's. Plain words: "says", "quotes", "means", "was", "is usually taken as", "Southam suggests", "Eliot's note gives". No "notice", "watch", "decide", "read it once each way".

Readings may be offered, but as readings: "has been read as", "one reading is", "critics have taken this as", or with the critic named. What Eliot said (in a note, a letter, a lecture), what critics made of it, and what the lines do are kept distinct. Eliot's note calling Tiresias "the most important personage in the poem" is the test case.

## Facts and sources
Every fact on the site was checked against primary sources by the builder. That does not make it right. The scholar checks again, and a change of fact needs a source. Reachable from here (WebFetch or curl through the proxy): the 1922 text on Gutenberg (https://www.gutenberg.org/cache/epub/1321/pg1321.txt; also saved at the path given in your brief); Wikisource (Prothalamion, Marvell, Psalms KJV, Verlaine's Parsifal, Purgatorio V); Gutenberg for Augustine's Confessions in Pusey (#3296) and The Vicar of Wakefield (#2667); Perseus for Ovid Met. III; archive.org for Froude's Elizabeth (reignofelizabeth01frouuoft, p. 244) and Bullen's Day; projekt-gutenberg.org for the Götterdämmerung libretto; Warren's Buddhism in Translations is on archive.org (search inside for "Fire-Sermon"). Lyly's Campaspe songs are on Wikisource or Bartleby. The 1971 facsimile of the drafts (Valerie Eliot), Ricks and McCue (2015), Southam, Rainey, Grover Smith, Kenner, Gardner, Gordon and Crawford are not online in full; use what you know of them and say so ("Southam gives", "Ricks and McCue note", "as I recall it, unverified").

Rights rules of the site, which the notes must keep to: sources before 1930 may be quoted freely. Eliot's own texts after 1929 (letters, the 1946 essay on Pound, the 1956 lecture, the drafts as published in 1971) and Pound's marginalia: describe, or quote a phrase or two, never a passage. The 1922 text's spellings are kept (forc'd, smoothes, to-night).

## Line numbers
The site counts every line 1 to 434. Eliot's 1922 marginal numbers run one behind from line 346. In Part III the site's numbers match the 1922 margin. Eliot's notes are printed with their 1922 numbers even where they slip; the commentary uses the site's numbers.

## The files
Records are `key: value` blocks separated by `---`. Fixed fields (id, line, to, anchor, kind, source, image, lang, path, part) must not change. Editable: title, body, text, and quote/trans only for accuracy. Plain text with <i>…</i>, <a href>, <br> allowed; curly quotes where they already are; no Markdown. A body line must not begin with `word:`.
