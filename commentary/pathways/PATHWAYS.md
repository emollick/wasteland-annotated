# The thematic pathways: what is in this directory and what to do with it

Written 20 September 2026 by the thread "Pathways on the poem's themes", after Ethan's message of 20:08 UTC ("the pathways seem to focus on obvious words and such and not the actual themes of the poem, its relation to myth or christianity, or whatever ... you need to do a deeper scholarly look"). Everything here went through a scholar who designed the set, a scholar who wrote each pathway with its sources, and then a reader and a second scholar who reported on every head and stop; the editor merged the rounds with the scholar last on substance and the reader last on wording. The records are in `records/`.

## Files

- `heads.txt`: the ten new pathway heads in the site/paths.txt format (id, title, intro, why), in the order proposed for the chooser. A head may carry `sources:` after `why:`.
- `part1.txt` to `part5.txt`: the stops, in the partN/paths.txt format (`===` between pathways, `---` between stops; `path`, `line`, `text`, and `sources` as a multi-line value, one citation per line, each beginning with the short form from the citations thread's works list). A stop that rests on the poem alone has no `sources` line.
- `ways-replacements.txt`: five "ways in" items, one per part, to replace the five whose fixed `path` field points at a retired pathway.
- `new-works.txt`: works cited on the stops that are not in the citations thread's works list, in its record format, for that thread to fold into works.txt.
- `records/`: the design round (three scholars), each writer's draft, the reader's and the checker's reports, and the editor's decisions.

## The set, and the order of the chooser

Keep: first (A first reading), cities (Cities), eliot (The poem in Eliot's life).
Retire: water, dead, women, birds, nothing, eyes. Their matter is absorbed: the drought and the water into the Grail pathway, the dead into Dante and the dead, the women into The loves that fail, the birds into Metamorphosis and the Grail (the hermit-thrush) and the Bible (the cock), "nothing" into The loves that fail, the eyes into Prophecy and sight and Metamorphosis.

Order:
1. first
2. grail
3. passion
4. east
5. dante
6. love
7. seers
8. change
9. method
10. war
11. wagner
12. cities
13. eliot

Line-0 stops open grail (the title), dante (the dedication) and seers (the Sibyl); none closes a pathway.

## The five ways-in items

`ways-replacements.txt` gives, for each part, the item to replace and the new item (kind: path, title, path, body). Part I "Meet the dead" (dead) → grail; Part II "The women, one after another" (women) → love; Part III "Every bird" (birds) → method; Part IV "The drowned before Phlebas" (water) → change; Part V "Every 'nothing'" (nothing) → passion.

## The three page texts that count the pathways

- meta-description: "… and thirteen pathways through the poem." (was "nine")
- tp-sub: "… the map, the recordings, the drafts, and thirteen pathways through the poem." (was "nine")
- paths-lede: "Thirteen pathways through the poem, each a sequence of stops. Choose one and the poem page opens with a small guide in the corner that takes you from stop to stop." (was "Nine")

If the count is better left out, "the pathways through the poem" in each.

## Points for the citing thread

- The commentaries are cited by their own keys, as the works list says ("cited by the line its note is keyed to"). Southam's keys run one behind the site's line numbers from line 346 (his 388 is the site's 389, his 433 the site's 434), and Ricks and McCue's likewise where the checking scholars found them; the stops' text uses the site's numbers, the sources lines the commentary's. If the site would rather convert, the checkers' reports in `records/` give both numbers for every such citation.
- Ricks and McCue are cited only where a checker saw their key in the scan (the textual apparatus answers searches, the commentary pages rarely do); add their commentary where a copy is to hand.
- The record for Gordon, The Hyacinth Girl might note that no scan exists and that its thesis (Hale as the hyacinth girl, on Eliot's own word in his letter to her of 3 November 1930) was confirmed from Dickey (2020) and the book's reviews.
- `new-works.txt` marks in a `note:` what was not confirmed (an edition, a volume number).

## Points for the build thread

- The card "fragments" at line 434 dates the rewording of Eliot's Shantih note to 1925. The checking scholars found that the 1926 impression of <i>Poems 1909–1925</i> still prints "a feeble translation of the content of this word", and that "is our equivalent to this word" first appears in the Faber resetting of 1932 (Ricks and McCue's textual note: "our equivalent to] 1932+"). The card should say 1932.

## Added at hand-over (21 Sept 2026, 01:17 UTC)

- The set was validated against the citing thread's works.txt as it stood at 22:04 UTC on 20 Sept (224 records). Two works the earlier list had and the final list dropped are cited on one stop each and are repeated in `new-works.txt` (Gardner (1949); Eliot, "Thomas Middleton" (1927)), which now has fifteen records.
- For the citing thread: Southam's note on the Bradford millionaire (site line 234) is printed under the key "l. 243" in the 1994 and 1996 editions, a misprint; the stop cites "note on line 234" (see records/rounds/war-merge.md). Southam's note on the London Bridge rhyme is keyed 426 (the site's 427); his mention of the rhyme's echo at line 62 is in his note on lines 412–414, and the crowd-and-rhyme link is Kenner's (1959), so the war stop cites Kenner.
- The War pathway's Bradford stop is at line 233, not the 231 of the design, so that it opens on the simile; no other pathway stops at 233.
- Stop counts as compiled: grail 13, passion 13, east 10, dante 10, love 13, seers 12, change 9, method 9, war 8, wagner 8; 105 in all (Part I 29, II 11, III 30, IV 3, V 32).
