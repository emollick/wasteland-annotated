# Batch B, final: paths.txt intros, drafts.txt (two records), voices.json (label, note), timeline.json (what).
# Merge of rewrites/B.md with r2/B-scholar.md (facts) and r2/B-reader.md (wording).
import sys, json, re
sys.path.insert(0, '/tmp/claude-0/-home-user/47b143d1-a9ed-5a02-adf0-c9c713677b02/scratchpad/debate/final')
import records
SITE = '/mnt/project-files/commentary/site/'

PATHS = {
'first': '''Twelve stops through the poem for a reader meeting it for the first time. Each stop gives a passage and a short note on it, in the order of the poem. Read the lines first, then the note, then go on to the next stop.''',
'water': '''The passages where water is present or lacking, in the order of the poem, from the spring rain of line 4 to the fisher on the shore at line 424: the dry stone of line 24 and the empty sea of line 42, the drowned sailor in Madame Sosostris’s pack and her warning “Fear death by water” (47–55), the Thames of Part III and the waters of Leman (182), the drowning of Phlebas in Part IV, the rock without water in Part V (331–359), the rain of line 395, the sunken Ganges (396) and the boat of line 419. Eliot’s headnote to his notes credits Jessie L. Weston’s book on the Grail legend, <i>From Ritual to Romance</i>, one chapter of which is called “The Freeing of the Waters.”''',
'dead': '''The poem’s dead, in the order they appear, among them the crowd on London Bridge (lines 62–63), the corpse planted in the garden (71), Phlebas in Part IV and the “Dry bones” of line 391. Part I takes its title, The Burial of the Dead, from the burial service in the Book of Common Prayer.''',
'women': '''Eliot’s note on Tiresias (line 218) says that in the poem “all the women are one woman.” This pathway gives the poem’s women in the order they appear, so that you can judge the claim for yourself. Some speak in their own words; some are figures from older books, named or alluded to; Philomel, from Ovid, appears as a nightingale.''',
'cities': '''The places the poem names, in the order it names them: the Starnbergersee and the Hofgarten, in Munich, at the start; London through the middle, with the bridge, the streets and churches, a public bar in Lower Thames Street and the river at Greenwich and at Richmond, and among the London stops the places the poem’s people come from or remember, Lithuania, Mylae, Leman, Smyrna, Thebes, Margate and Carthage; then, in Part V, the five cities named in two lines, “Jerusalem Athens Alexandria / Vienna London” (375–376), and the Ganges and Himavant (396–398).''',
'birds': '''The poem’s birds, in the order they appear, with the lines where each is heard or named: the nightingale into which Philomel was changed (99–103 and 203–206), the gulls that Phlebas forgot (313), the hermit-thrush of line 357, which Eliot’s note says he heard in Quebec County, the cock on the rooftree (392) and the swallow of line 429. Three stops are for other creatures the poem sets beside them: the cricket of line 23, the cicada of line 354 and the bats of line 380. Recordings of the birds themselves, where they exist, are in the listening room.''',
'nothing': '''The word “nothing” wherever the poem uses it: at line 40, by the one who came back from the hyacinth garden and could not speak; at lines 120–126, in the exchange between the woman with bad nerves and the man who does not answer her; and at lines 302 and 305, by the third Thames-daughter on Margate Sands. A last stop, at line 402, is the thunder’s first question, “what have we given?”, where the word does not occur.''',
'eyes': '''Eyes in the poem, from the epigraph, where Trimalchio says he saw the Sibyl with his own eyes, to Part V: the eyes that fail in the hyacinth garden (line 39), the pearls that were the drowned man’s eyes (48), the one-eyed merchant (52), the eyes each man fixes before his feet on London Bridge (65), the “lidless eyes” of line 138, and the blind Tiresias (218). Eliot’s note on Part V names the journey to Emmaus, where, in Luke 24, the disciples’ eyes “were holden,” held, so that they did not know who walked beside them.''',
'eliot': '''Places and dates from Eliot’s life that lie behind particular lines of the poem, from the summers of his boyhood at Gloucester, Massachusetts, and Munich in 1911 to Margate and Lausanne in the autumn of 1921 and Paris in January 1922, each set beside the lines it bears on.''',
}

DRAFTS = {
'title-draft': {'title': 'The earlier title', 'body': '''The typescripts of Parts I and II carry the heading “He Do the Police in Different Voices,” with “Part I” and “Part II” beneath it. The words are Betty Higden’s in Dickens’s <i>Our Mutual Friend</i> (Book I, chapter 16), praising Sloppy, the foundling who lives with her and turns her mangle, for the way he reads the police news in the paper aloud, doing the voices: “You mightn’t think it, but Sloppy is a beautiful reader of a newspaper. He do the Police in different voices.” The title page Eliot typed for the finished poem reads “The Waste Land,” and his headnote to the notes says that the title, the plan and a good deal of the incidental symbolism were suggested by Jessie L. Weston’s book on the Grail legend, <i>From Ritual to Romance</i>. Dickens is not mentioned in the notes.'''},
'epigraph-draft': {'body': '''The title page of the typescript carries, under “The Waste Land,” a passage from Conrad’s <i>Heart of Darkness</i> ending with the dying Kurtz’s words, “The horror! the horror!” Pound wrote, on 24 January 1922, that he doubted Conrad was “weighty enough to stand the citation”; Eliot answered that it was “much the most appropriate I can find, and somewhat elucidative”; Pound then told him to do as he liked about Conrad. Eliot nevertheless replaced it with the sentence from Petronius’s <i>Satyricon</i> in which Trimalchio, the host of the dinner, says that he saw the Sibyl of Cumae hanging in a jar, and that when the boys asked her what she wanted she answered, “I want to die.” The Sibyl had been granted long life, but not youth.'''},
}

VOICES = {
'poem': {'note': '''The voice that belongs to no named character. It opens the poem, describes the room at the start of Part II, introduces Madame Sosostris (43–46), speaks the lines on the drowned Phlebas in Part IV and the opening of Part V (322–330), brings on the thunder (396–400), and answers each DA (402–410, 412–417, 419–423).'''},
'marie': {'note': '''A woman remembering a summer: coffee and talk in the Hofgarten in Munich, and a sled ride in the mountains as a child with her cousin the archduke. Lines 8–18, except the sentence of German at line 12, which this edition gives to another speaker. Valerie Eliot’s edition of the drafts records that Eliot had met Countess Marie Larisch, niece of the Empress Elisabeth of Austria, and that the sledding story was hers.'''},
'stranger': {'label': 'A voice in German', 'note': '''Line 12, one sentence: “I am not Russian at all, I come from Lithuania, a real German.” The poem does not say who speaks it; giving it to a second speaker is a reading.'''},
'prophet': {'note': '''Lines 19–30: a voice speaking as the Old Testament prophets do, addressing its hearer as “Son of man,” the words with which God addresses Ezekiel (Eliot’s note cites Ezekiel 2:1), and offering the shade of the red rock. Eliot’s note on line 23 cites Ecclesiastes; “the shadow of this red rock” has been linked to Isaiah 32:2.'''},
'lover': {'note': '''The one who came back from the hyacinth garden and could not speak. Lines 37–41: “I could not / Speak, and my eyes failed.”'''},
'shepherd': {'note': '''Line 42: the shepherd in Tristan und Isolde, Act III, who has looked out for Isolde’s ship and reports the sea desolate and empty.'''},
'sosostris': {'note': '''The fortune-teller (the poem’s word is clairvoyante), reading the cards. Lines 43–46 introduce her in the poem’s own voice; she speaks from the middle of line 46 (“Here, said she”) to line 59.'''},
'walker': {'label': 'The walker in the City of London', 'note': '''The “I” of three passages, read here as one voice: the crowd on London Bridge and the meeting with Stetson (60–76), Mr. Eugenides (207–211), and the music along the Strand and the bar in Lower Thames Street (257–265).'''},
'she': {'note': '''Lines 111–114, 117, 119, 121–123, 126 and 131–134, printed in quotation marks, unlike the man’s. The quotation marks are usually taken to mean that she speaks aloud.'''},
'he': {'note': '''Lines 115–116, 118, 120, 124–125, 127–130 and 135–138, printed without quotation marks, which is usually read as meaning that he does not speak aloud. Some of his replies are other people’s words: the playwrights Webster (118) and Middleton (137–138), both cited in Eliot’s notes; Ariel’s song from The Tempest (125); and the song “That Shakespearian Rag” of 1912 (128–130).'''},
'pub': {'note': '''A woman in a pub, telling what she said to her friend Lil about Lil’s husband Albert, home from the army. Lines 139–171, interrupted by the publican’s call.'''},
'publican': {'note': '''The landlord calling closing time: HURRY UP PLEASE ITS TIME, at lines 141, 152, 165, 168 and 169.'''},
'ophelia': {'note': '''Line 172: Ophelia’s good night in Hamlet (Act IV, scene 5), as she goes out, mad. Her drowning is reported two scenes later.'''},
'fisher': {'note': '''The speaker by the river in Part III, lines 173–198, who repeats Spenser’s refrain “Sweet Thames, run softly” and fishes in the dull canal behind the gashouse. He speaks partly in others’ lines: Spenser’s (176, 183–184), Psalm 137 at 182 (“we sat down, yea, we wept”), and Ferdinand’s in The Tempest (191–192, Eliot’s note). That he is the Fisher King of the Grail legend is a reading; Eliot’s notes name the Fisher King at lines 46 and 425.'''},
'song': {'label': 'Songs quoted', 'note': '''Lines 199–202: the ballad about Mrs Porter, which Eliot’s note says was reported to him from Sydney, Australia (199–201), and Verlaine’s line on children singing in the dome (202). The rag at lines 128–130 is given to the man who does not answer.'''},
'nightingale': {'note': '''Lines 203–206: the nightingale’s song as the Elizabethan poets wrote it, “jug jug” and “Tereu,” calling on Tereus, the king who raped Philomel; her story is told at lines 99–103, and “So rudely forc’d” repeats line 100.'''},
'typist': {'note': '''Line 252, her only words, in quotation marks: what the poem calls her “one half-formed thought.”'''},
'thames': {'note': '''The three Thames-daughters, as Eliot’s note calls them, singing together: lines 266–291. His note says that from line 292 to 306 they speak in turn. The refrain “Weialala leia” is the Rhine-daughters’ from Wagner’s Götterdämmerung, Act III, which the note cites.'''},
'thames1': {'note': '''Highbury, Richmond and Kew: lines 292–295. Eliot’s note sends the reader to Dante’s Purgatorio, canto V, and quotes the line of La Pia, one of the dead there: “Siena mi fe’, disfecemi Maremma,” Siena made me, Maremma unmade me.'''},
'ascetic': {'note': '''Lines 307–311: Augustine’s Confessions (307 and 309–310, beginning “To Carthage then I came”) set beside the Buddha’s Fire Sermon (308 and 311, “Burning”). Eliot’s note calls them “two representatives of eastern and western asceticism” and says that setting them side by side “is not an accident.”'''},
'seer': {'note': '''Lines 367–395, from “What is that sound high in the air” to “Bringing rain.” Eliot’s note on the hooded hordes cites Hermann Hesse’s book Blick ins Chaos.'''},
'thunder': {'note': '''“DA,” at lines 401, 411 and 418. Eliot’s note says the fable of the thunder’s meaning is in the Brihadaranyaka Upanishad.'''},
'fisherking': {'note': '''Lines 424–426: “I sat upon the shore / Fishing, with the arid plain behind me.” Eliot’s note on line 425 refers to the chapter on the Fisher King in Jessie L. Weston’s book on the Grail legend, From Ritual to Romance; the poem does not name the speaker.'''},
'fragments': {'note': '''Lines 427–432, a line each: the nursery rhyme “London Bridge is falling down” (427); Dante’s Purgatorio, canto XXVI (428); the Latin poem Pervigilium Veneris (429); Nerval’s sonnet “El Desdichado” (430); the poem’s own line, “These fragments I have shored against my ruins” (431); and Kyd’s play The Spanish Tragedy (432). Eliot’s notes give the sources of the four quotations.'''},
'upanishad': {'note': '''The poem’s last two lines, 433–434. Eliot’s notes translate the three words as “Give, sympathize, control” and give their source as the Brihadaranyaka Upanishad, one of the Hindu scriptures; “Shantih,” repeated three times, is “a formal ending to an Upanishad,” for which “The Peace which passeth understanding” is, his note says, “a feeble translation.”'''},
}

TIMELINE = {
'1910–11': '''A year in Paris; friendship with Jean Verdenal, a French medical student. August 1911 in Munich, where ‘Prufrock’ is finished.''',
'1915': '''Jean Verdenal killed at the Dardanelles in May. Eliot marries Vivien Haigh-Wood in June. ‘The Death of Saint Narcissus’ is set in type for Poetry (Chicago) and withdrawn; its opening lines are reworked in lines 25–30 of the poem.''',
'1917': '''Joins Lloyds Bank’s Colonial and Foreign Department in the City of London in March. Prufrock and Other Observations published, dedicated to Verdenal.''',
'1918': '''‘Dans le Restaurant’ published in the Little Review; its last stanza, in French, is the source of the ten lines of ‘Death by Water’ that Pound let stand.''',
'1921, October': '''Lloyds grants three months’ sick leave. Eliot goes to Margate in the middle of the month and stays until 12 November; on 4 November he tells his friend Sydney Schiff that he has written ‘some fifty lines’ of Part III, sitting in a shelter on the seafront.''',
'1921, November': '''To Paris, where Vivien stays; then alone to Lausanne for treatment by Dr Roger Vittoz. Parts IV and V written there.''',
'1922, January': '''Back through Paris. Pound goes over the typescript there and again by post, cutting it hard; Eliot accepts nearly all of it. Pound’s verdict, in a letter of 24 January: ‘Complimenti, you bitch.’''',
'1922, September': '''Smyrna burns, 13–22 September, a month before the poem is published. The fire is not in the poem; Mr. Eugenides, ‘the Smyrna merchant’ of line 209, was already in the typescript Pound edited in January.''',
'1922, November': '''American publication in the November number of The Dial, again without notes. The Dial’s award for 1922, $2,000, is announced in the December number.''',
'1922, December': '''Boni & Liveright publish the first book edition in New York on 15 December, 1,000 copies, the first printing to carry the notes. Eliot said in 1956 that he had expanded them to make the book long enough.''',
'1923, January': '''Eliot inscribes Pound’s copy of the Boni & Liveright edition to him as il miglior fabbro, ‘the better craftsman’, Dante’s words for the poet Arnaut Daniel in Purgatorio XXVI; the phrase becomes the printed dedication in 1925.''',
'1933': '''Eliot records the poem at Columbia University, on aluminium discs, the earliest surviving reading. The discs were long dated 1935, and the PennSound archive still labels them so; the Poetry Archive dates them 1933, following the scholar Lacy Rumsey and the work of Richard Swigg (2012) and Jason Camlot (2019).''',
'1956': '''In a lecture at Minneapolis, ‘The Frontiers of Criticism’, Eliot calls the notes ‘bogus scholarship’ and regrets having sent readers on ‘a wild goose chase after Tarot cards and the Holy Grail’.''',
'1968': '''The New York Public Library announces that it holds the typescript, long thought lost, with Pound’s and Vivien Eliot’s comments written on it. Eliot had sent it in 1922 to the New York lawyer and collector John Quinn; after Quinn’s death in 1924 it passed to his sister and then to his niece, who sold it to the library in 1958 on condition of secrecy, and the purchase was not made public for ten years.''',
'1971': '''Valerie Eliot, his widow, edits a facsimile edition of the drafts, showing Pound’s cuts and comments.''',
'2015': '''Christopher Ricks and Jim McCue publish their annotated edition, The Poems of T. S. Eliot, in two volumes.''',
}

def smart(s):
    """Straight quotes to typographic ones, outside tags and placeholders."""
    out=[]; i=0; dq_open=True
    parts=re.split(r'(<[^>]*>|\{[^}]*\})', s)
    for p in parts:
        if p.startswith('<') or p.startswith('{'): out.append(p); continue
        buf=[]
        for j,c in enumerate(p):
            prev = p[j-1] if j>0 else (out[-1][-1] if out and out[-1] else ' ')
            if c=='"':
                buf.append('“' if (prev in ' \n(—–[' ) else '”')
            elif c=="'":
                buf.append('‘' if (prev in ' \n(—–[') else '’')
            else: buf.append(c)
        out.append(''.join(buf))
    return ''.join(out)

def edit_json(path, changes, field_keys, log=print):
    raw=open(path,encoding='utf-8').read()
    obj=json.loads(raw)
    assert json.dumps(obj,ensure_ascii=False,indent=1)==raw, 'round-trip failed '+path
    return obj, raw

if __name__=='__main__':
    for k,v in PATHS.items(): assert '\n' not in v
    records.apply(SITE+'paths.txt', {k:{'intro':v} for k,v in PATHS.items()})
    records.apply(SITE+'drafts.txt', DRAFTS)
    # voices.json
    obj,raw=edit_json(SITE+'voices.json', VOICES, ('label','note'))
    n=0
    for key,rec in obj['voices'].items():
        if key in VOICES:
            for f,v in VOICES[key].items():
                assert f in rec, (key,f); rec[f]=v; n+=1
    missing=set(VOICES)-set(obj['voices']); assert not missing, missing
    for key,rec in obj['voices'].items():
        for f in ('label','note'):
            if f in rec: rec[f]=smart(rec[f])
    open(SITE+'voices.json','w',encoding='utf-8').write(json.dumps(obj,ensure_ascii=False,indent=1))
    print('voices.json:',n,'fields set;',len(VOICES),'voices changed; quotes regularised throughout')
    # timeline.json
    obj,raw=edit_json(SITE+'timeline.json', TIMELINE, ('what',))
    seen=set()
    for rec in obj:
        if rec['when'] in TIMELINE: rec['what']=TIMELINE[rec['when']]; seen.add(rec['when'])
        rec['what']=smart(rec['what'])
    missing=set(TIMELINE)-seen; assert not missing, missing
    open(SITE+'timeline.json','w',encoding='utf-8').write(json.dumps(obj,ensure_ascii=False,indent=1))
    print('timeline.json:',len(seen),'entries changed; quotes regularised throughout')
    json.dump({'paths':PATHS,'drafts':DRAFTS,'voices':VOICES,'timeline':TIMELINE}, open('/tmp/claude-0/-home-user/47b143d1-a9ed-5a02-adf0-c9c713677b02/scratchpad/debate/final/B.json','w'), ensure_ascii=False, indent=1)
