# Brief for the editor merging one pathway's round

You are the editor of one pathway of the annotated Waste Land. Three files are yours to read for it: the writer's draft `drafts/<id>.txt`, the reader's report `rounds/<id>-reader-r1.md`, and the checking scholar's report `rounds/<id>-check-r1.md`. Read STANDARD.md first (the rule for every word and the citation form), then WRITING-BRIEF.md (the record format), then the three files, with poem.txt open.

## The rule of the merge

- **The scholar is last on substance.** Every fact, quotation, attribution, line number and citation follows the checker's report where it corrects the draft (and the writer where the checker accepted it). A reader's correction that changes a fact, a quotation or a citation, or drops one the checker relied on, is not taken on that point.
- **The reader is last on wording.** Where the reader gives a corrected text, the merged stop is the reader's corrected text, with the checker's facts put into it where they differ. Where the reader accepted a record as it stands, the writer's text stands, with the checker's corrections put in.
- Where the reader's wording and the checker's wording of the same sentence differ but say the same thing, take the reader's.
- Where they differ in substance, take the checker's, and reword it in the reader's manner (plain, no bare names on first appearance, nothing the card at the line already says).
- The reader's objection to a bare name, a repeated card, a forbidden shape (a verbless opening, an "X is a Y:" aphorism, a list of three for rhythm, a knowing aside, a bow-tying close) is always carried, even where the checker accepted the stop.
- Nothing new: do not add a fact, a quotation or a reading that neither report nor the draft carries. If a checker's correction leaves a sentence with no support, cut the sentence.
- Keep every stop at ninety words or fewer (target sixty) and the intro at 160 words or fewer (target 120) with a short first sentence that stands on its own; cut whole sentences, not words, and cut what the card at the line already gives first.
- The sources value follows the checker: add what the checker says is missing, drop what the checker says is unsupported, keep the exact short forms of works.txt and new-works.txt. If the checker's "New works" section corrects an entry in new-works.txt, say so in your record; do not edit new-works.txt.

## What to write

1. `merged/<id>.txt`: the merged pathway, in the exact record format of WRITING-BRIEF.md (head: id, title, intro, why, optional sources; then the stops). Run `python3 validate.py merged/<id>.txt` and fix every problem it reports other than "quotation not found in poem" for a quotation from a source and "warn:" lines.
2. `rounds/<id>-merge.md`: a short record, one line per head or stop: "line N: reader's text, with the checker's correction to X" / "writer's text, accepted by both" / "reader's text" / and so on; then a list "Sentences the editor wrote" for any sentence that is in neither report nor the draft (there should be few or none), and a list "Disagreements decided for the scholar" naming each point where the reader's text was not taken on substance; then any correction to new-works.txt the checker asked for.

Do not call any mcp__hearthbot tool. Do not edit any file other than the two you write. Finish with one line: "<id>: N stops merged; M sentences the editor wrote; K disagreements decided for the scholar; validate.py clean/not clean".

## Naming another pathway

A stop that points the reader to another pathway names it as the reader will find it in the chooser, never by its working id or with the workshop's words ("takes", "owns", "has"). The titles: The Grail and the waste land ("the Grail pathway"); The Bible and the Prayer Book ("the pathway on the Bible and the Prayer Book"); The Fire Sermon and the thunder ("the pathway on the Fire Sermon and the thunder"); Dante and the dead ("the pathway on Dante and the dead"); The loves that fail ("the pathway on the loves that fail"); Prophecy and sight ("the pathway on prophecy and sight"); Metamorphosis ("the Metamorphosis pathway"); The past beside the present ("the pathway on the past beside the present"); After the war ("the pathway After the war"); Wagner ("the Wagner pathway"); and the kept ones, A first reading, Cities, The poem in Eliot's life. Keep such a pointer only where the reader kept it or asked for it; the form is "For the couple in the garden, see the pathway on the loves that fail."

## Eliot's own notes

A stop refers to Eliot's 1922 notes by the site's line number, the line the note glosses on the page, whatever number Eliot printed: "Eliot's note on line 125" for the note he numbered 126 (the pearls line), "Eliot's note on line 309" for the one printed 312 (Augustine and the Buddha), "Eliot's note on line 367" for 366 (Hesse), "Eliot's note on line 412" for 411 (Bradley), "Eliot's note on line 419" for 418, "Eliot's note on line 425" for the Fisher King, "Eliot's note on line 434" for Shantih. Where the printed number would help a reader who has the notes open, add it once in brackets: "Eliot's note on line 125 (numbered 126)". Check every "Eliot's note on line N" in the merged text against poem.txt: the line named must be the line the note is about.

## "Card" in Part I

On the site "the card" means the marginal gloss card, and the stops use it so. Where Madame Sosostris's tarot cards are also on the page (lines 43 to 59, and line 125, which looks back to 48), a stop says "the card in the margin" for the gloss and "the Sailor's card" or "one of Madame Sosostris's cards" for the tarot, so that the two are never the same word in one stop.

## The intro's first sentence

The intro's first sentence is shown alone in the guide's corner and names the pathway's subject; it may be a naming phrase without a verb ("The Indian texts in the poem, the Buddha's Fire Sermon and an Upanishad."), as the other heads have it. That licence is the intro's only: a stop never opens with a verbless sentence.
