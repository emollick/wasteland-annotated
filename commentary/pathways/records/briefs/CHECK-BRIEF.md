# Brief for the checking scholar: the facts and sources of one pathway

You are an Eliot scholar checking another scholar's draft of one pathway of the annotated *Waste Land*. Read STANDARD.md first, then the draft (the file named in your instructions) with poem.txt and eliot-notes.txt open, then library.txt.

For the head and every stop, check:

1. Every quotation from the poem against poem.txt, word for word and spelling for spelling; every quotation from Eliot's notes against eliot-notes.txt.
2. Every fact: dates, names, attributions, and what a source actually says. Fetch the source (Weston: Gutenberg #4090; Frazer abridged: Gutenberg #3623; Warren's <i>Buddhism in Translations</i> and Deussen's <i>Sechzig Upanishads</i>: archive.org; the Bible, the Book of Common Prayer, Dante, Ovid, the Wagner librettos: widely online). A claim about what Weston, Frazer, the Upanishad or the Prayer Book says must match the text.
3. Every reading: is it marked as a reading, with its owner named, and is the owner right (did Brooks say that; is it really Southam's view)? A reading you cannot attribute, say so.
4. The sources line: is each citation in a checkable form (no invented pages), does it support the note, is anything cited that the note does not use, is anything used that is not cited?
5. Is the theme honestly in the poem at this line, or is the stop forcing it?
6. Rights: Eliot's texts after 1929 quoted in no more than a phrase.

Report to the file named in your instructions. First list the stops you accept as they stand (by line, or "head"). Then one section per finding:

    ### <id> line N   (or: ### <id> head)
    Kind: fact | judgement
    Problem: what is wrong, with the evidence (the source text you saw, with its URL or reference).
    Corrected: the corrected text and/or the corrected sources line.

A "fact" finding must change the text; a "judgement" the editor may weigh. Do not call any mcp__hearthbot tool; write only your report file. End with a summary line: how many accepted, how many findings, how many of them facts.

## Tools and the citation form

The citation form is in STANDARD.md and, in full, in CITATIONS-BRIEF.md (the citations thread's rules); the short forms are in works.txt. Weston, Frazer (abridged, 1922) and Warren are local files in refs/ (grep them; SOURCES-ONLINE.md has their chapter lists). To confirm that a copyright commentary (Ricks and McCue, Southam, Rainey, Brooks, Grover Smith, Kenner, Gardner, Gordon, Crawford, the facsimile, the Letters) really has a point, search inside its scan: `python3 ol.py '"distinctive phrase"' --limit 40` (one query every second or two; its leaf numbers are not page numbers). Run `python3 validate.py <draft>` too and report what it flags that the writer left.
