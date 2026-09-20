# Fold in the Part I thread's proposals (shared-proposals-part1.md) to the site files.
import records, json, re, shutil
SITE='/mnt/project-files/commentary/site/'

def load(fn):
    recs=records.parse(open(SITE+fn).read())
    return {dict((k,v) for k,v,s in r)['id']: dict((k,v) for k,v,s in r) for r in recs}

def sub(cur, old, new):
    assert cur.count(old)==1, ('substring not unique/found', old[:60], cur.count(old))
    return cur.replace(old, new)

# ---------- sources.txt ----------
S=load('sources.txt'); ch={}
def setf(id, field, value): ch.setdefault(id,{})[field]=value
def subf(id, field, old, new):
    cur = ch.get(id,{}).get(field, S[id][field])
    setf(id, field, sub(cur, old, new))

subf('tristan','note',
 "and wrote a poem about it, “Opera,” dated November 1909; Stravinsky, who met him in 1956, thought <i>Tristan</i> “must have been one of the most passionate experiences of his life.”",
 "and wrote a poem about it, “Opera,” dated November 1909. Stravinsky, who met him in December 1956, wrote in “Memories of T. S. Eliot” (<i>Esquire</i>, August 1965) that <i>Tristan</i> “must have been one of the most passionate experiences of his life.”")

setf('baudelaire-au-lecteur','date',"1855; the preface poem of the 1857 volume")
setf('baudelaire-au-lecteur','note',
 "Baudelaire opens his book by listing the sins of mankind, keeping the worst, boredom, for last, and then turning on whoever is reading. Eliot closes his first section the same way. In his essay “Baudelaire” (1930) he called him “the greatest exemplar in modern poetry in any language,” and in “What Dante Means to Me” (1950) he said he had learned from him “the possibility of fusion between the sordidly realistic and the phantasmagoric.”")

setf('death-of-st-narcissus','note',
 "The poem was set in type for <i>Poetry</i> (Chicago) in 1915 and withdrawn in proof; it was first published in 1950. It is about a saint who believes he has been a tree, a fish and a young girl, and who dies pierced with arrows. Two manuscripts, a rough draft and a fair copy, survived among the papers Eliot sent in 1922 to John Quinn, the New York lawyer and collector, with the <i>Waste Land</i> drafts; they are now in the Berg Collection of the New York Public Library and are reproduced in the 1971 facsimile. After these two lines the speaker promises to show the listener something other than the listener’s own shadow, sprawling on the sand at daybreak or leaping behind the fire against a red rock. <i>The Waste Land</i> keeps the second line, with “gray” changed to “red,” and reshapes the first. The poem is still in copyright, so only its first two lines are given here.")

subf('huxley-crome-yellow','note',
 "at the village fête under the name “Sesostris, the Sorceress of Ecbatana,” is the accepted source of Madame Sosostris.",
 "at the charity fair in the park under the name “Sesostris, the Sorceress of Ecbatana,” is the source usually given for Madame Sosostris.")
subf('huxley-crome-yellow','note',
 "without being conscious of doing so.",
 "without being conscious of doing so. Lawrence Rainey (<i>Revisiting The Waste Land</i>, 2005) has doubted it: he dates the typescript of Parts I and II to May 1921 from its paper and typewriter, before Huxley had finished the novel, and suggests the name was Eliot’s own.")

subf('dante-inf3','note',
 "Dante finds the souls who were neither good nor bad, “who lived without infamy and without praise,” rejected by Heaven and refused by Hell, running for ever after a banner and stung by wasps.",
 "Dante finds the souls who were neither good nor bad, “who lived without infamy and without praise.” Heaven has cast them out and Hell will not receive them; they run for ever after a banner, stung by wasps.")
subf('dante-inf3','note',
 "Eliot said in 1950 that Dante’s poetry was still,",
 "Eliot said in “What Dante Means to Me” (1950) that Dante’s poetry was still,")

subf('dante-inf4','note',"the sighs of the office crowd","the sighs of the crowd on London Bridge")

subf('chaucer','note',"birds singing through the night","birds singing")

subf('tennyson','note',
 "Eliot cites neither poem. The mad speaker of <i>Maud</i>, who imagines himself buried under a city street with the traffic going over him, has been cited for “a handful of dust” (line 30), and the passage has been compared with the “rats’ alley” of Part II. The Prince’s song in <i>The Princess</i>, with Swinburne’s “Itylus” (“Swallow, my sister, O sister swallow”), has been cited for “O swallow swallow” at line 429, the English half of a line whose Latin half is from the <i>Pervigilium Veneris</i>. In 1936 Eliot wrote that Tennyson “had the finest ear of any English poet since Milton.”",
 "Eliot’s notes cite neither poem. The mad speaker of <i>Maud</i>, who imagines himself buried under a city street with the traffic going over him, is the source usually given for “a handful of dust” (line 30), and the passage has been compared with the “rats’ alley” of Part II. The Prince’s song in <i>The Princess</i>, with Swinburne’s “Itylus” (“Swallow, my sister, O sister swallow”) beside it, is the source usually given for “O swallow swallow” at line 429, the English half of a line whose Latin half is from the <i>Pervigilium Veneris</i>. In his essay “In Memoriam” (1936) Eliot wrote that Tennyson “had the finest ear of any English poet since Milton.”")

subf('whitman-lilacs','note',
 "and at line 357 wants the hermit-thrush’s “water-dripping song”; his note on that line describes the bird",
 "and the hermit-thrush’s “water-dripping song” is at line 357; Eliot’s note on that line describes the bird")
subf('whitman-lilacs','note',
 "in order to do so.” The case that",
 "in order to do so.” Two years earlier, reviewing a life of Whitman, he had written that “when Whitman speaks of the lilacs or of the mocking-bird, his theories and beliefs drop away like a needless pretext” (“Whitman and Tennyson,” <i>Nation and Athenaeum</i>, 18 December 1926). The case that")

subf('webster-white-devil','note',
 "rising from a feigned death after Vittoria has fired at him what she took to be a loaded pistol.",
 "rising from a feigned death after Vittoria and her maid Zanche have fired at him pistols they took to be loaded.")

subf('shakespeare-tempest','note',
 "refers them back to lines 37 and 48; his note on Tiresias says",
 "refers them back to lines 37 and 48. His note on Tiresias says")

subf('frazer','note',
 "argued that the myths of Adonis, Attis and Osiris, and by implication of Christ, tell one story, that of a god who dies with the harvest and returns with the spring, helped by rites in which a king is sacrificed or an effigy is buried or drowned.",
 "argued that the myths of Adonis, Attis and Osiris tell one story, that of a god who dies with the harvest and returns with the spring, helped by rites in which a king is sacrificed or an effigy is buried or drowned, and that the Church’s Easter was adapted from the spring festivals of Adonis and Attis.")
subf('frazer','note',
 "describing it as a view of Lake Nemi; it in fact shows Lake Avernus and the Sibyl of Cumae, the prophetess of the poem’s epigraph, holding the bough that admits Aeneas to the underworld.",
 "describing it as a view of Lake Nemi. It in fact shows Lake Avernus, with the Sibyl of Cumae, the prophetess of the poem’s epigraph, holding the bough that admits Aeneas to the underworld.")

subf('weston','note',
 "II (The Task of the Hero), IX (The Fisher King)",
 "II (The Task of the Hero), VI (The Symbols, where the Grail hallows become the four suits of the Tarot), IX (The Fisher King)")

subf('petronius','note',
 "asked Apollo for as many years as the grains of sand in her hand and forgot to ask for youth to go with them",
 "asked Apollo for as many years as there were grains in a heap of dust she had scooped up, and forgot to ask for youth to go with them")
subf('petronius','note',"Eliot put Petronius in its stead before publication.","Eliot put Petronius in its place before publication.")

subf('dante-purg26','note',
 "from line 145, and line 428 of the poem from line 148,",
 "from line 145 (the Ovid Press title page misprinted it “Ara Vus Prec,” a form Eliot later blamed on his Italian edition of Dante), and line 428 of the poem from line 148,")
subf('dante-purg26','note',
 "and it first appeared in print in <i>Poems 1909–1925</i>.",
 "and it first appeared in print in <i>Poems 1909–1925</i>. The phrase was already Pound’s own: “Il Miglior Fabbro” is the title of his chapter on Arnaut Daniel in <i>The Spirit of Romance</i> (1910).")

subf('dickens-omf','note',
 "Betty Higden, a poor old woman in the novel, is praising Sloppy, the foundling she has brought up, who reads her the newspaper and does all the voices in the police-court reports.",
 "Betty Higden, a poor old woman who minds children for a living, is praising Sloppy, a foundling brought up in the workhouse who lives with her and turns her mangle, and who reads her the newspaper and does all the voices in the police-court reports.")

subf('conrad-hod','note',
 "The last words of Kurtz, the trader whom the narrator, Marlow, has gone up the river to find, stood at the head of the typescript of Part I as the poem’s epigraph. Pound wrote that he doubted whether Conrad was “weighty enough to stand the citation.” Eliot answered that it was “much the most appropriate I can find, and somewhat elucidative,” and Pound withdrew the objection; Eliot nevertheless replaced it",
 "Kurtz’s last words stood on the title page of the typescript, as the poem’s epigraph. Kurtz is the trader whom the narrator, Marlow, has gone up the river to find. Pound, returning the poem in January 1922, wrote that he doubted whether Conrad was “weighty enough to stand the citation.” Eliot answered that it was “much the most appropriate I can find, and somewhat elucidative,” and Pound withdrew the objection (the exchange is printed in the 1971 facsimile and in the <i>Letters</i>, volume 1); Eliot nevertheless replaced it")

subf('eliot-frontiers','note',
 "A lecture given at the University of Minnesota on 30 April 1956, to an audience of about fourteen thousand, and printed in <i>On Poetry and Poets</i> (1957).",
 "Eliot gave the lecture at the University of Minnesota on 30 April 1956, to an audience of about fourteen thousand; it was printed in <i>On Poetry and Poets</i> (1957).")

shutil.copy(SITE+'sources.txt', 'sources.beforeP1.txt')
records.apply(SITE+'sources.txt', ch)
json.dump(ch, open('P1-sources.json','w'), ensure_ascii=False, indent=1)

# ---------- drafts.txt ----------
D=load('drafts.txt'); ch={}
b=D['title-draft']['body']
b=sub(b, "The words are Betty Higden’s in Dickens’s <i>Our Mutual Friend</i> (Book I, chapter 16), praising Sloppy, the foundling who lives with her and turns her mangle, for the way he reads the police news in the paper aloud, doing the voices:",
       "The words are Betty Higden’s, in Dickens’s <i>Our Mutual Friend</i> (Book I, chapter 16). She is praising Sloppy, the foundling who lives with her and turns her mangle, for the way he reads the police news aloud from the paper, doing the voices:")
b=sub(b, "The title page Eliot typed for the finished poem reads", "The title page of the typescript reads")
ch['title-draft']={'body':b}
b=D['epigraph-draft']['body']
b=sub(b, "The Sibyl had been granted long life, but not youth.", "The Sibyl had been granted long life, but not youth; the story is told in Ovid, <i>Metamorphoses</i> XIV.")
ch['epigraph-draft']={'body':b}
shutil.copy(SITE+'drafts.txt', 'drafts.beforeP1.txt')
records.apply(SITE+'drafts.txt', ch)

# ---------- ui.txt ----------
U=load('ui.txt'); ch={}
t=U['tarot-one-eyed-merchant-note']['text']
t=sub(t, "one suggestion is that he is seen in profile, as figures on cards often are.", "Cleanth Brooks (1939) took it to mean no more than that the face on the card is shown in profile.")
ch['tarot-one-eyed-merchant-note']={'text':t}
t=U['tarot-hanged-man-note']['text']
t=sub(t, "“I do not find / The Hanged Man” (lines 54–55).</p>", "“I do not find / The Hanged Man” (lines 54–55). Cleanth Brooks (1939) explained her failure by the hood: “That he is hooded accounts for Madame Sosostris’ inability to see him.”</p>")
ch['tarot-hanged-man-note']={'text':t}
shutil.copy(SITE+'ui.txt', 'ui.beforeP1.txt')
records.apply(SITE+'ui.txt', ch)

# ---------- voices.json ----------
raw=open(SITE+'voices.json').read()
v=json.loads(raw)
assert json.dumps(v, ensure_ascii=False, indent=1)==raw, 'voices.json does not round-trip'
shutil.copy(SITE+'voices.json', 'voices.beforeP1.json')
V=v['voices']
V['poem']['note'] = sub(V['poem']['note'], "and answers each DA (402–410, 412–417, 419–423).",
  "and answers each DA (402–410, 412–417, 419–423). That Marie’s voice begins at line 8 rather than at line 1 is this edition’s reading: the “us” of line 5 returns at line 8, and Cleanth Brooks (1939) read lines 1–18 as one voice.")
V['stranger']['note'] = sub(V['stranger']['note'], "Line 12, one sentence: ", "Line 12, one sentence, spoken by a woman (the German is feminine, “Russin”): ")
V['walker']['note'] = sub(V['walker']['note'], "Mr. Eugenides (207–211)", "Mr. Eugenides, whose invitation is reported (207–214)")
del V['eugenides']
sp=v['spans']
i=sp.index([207,211,'walker']); j=sp.index([212,214,'eugenides'])
assert j==i+1
sp[i]=[207,214,'walker']; del sp[j]
open(SITE+'voices.json','w').write(json.dumps(v, ensure_ascii=False, indent=1))
print('voices.json: poem, stranger, walker notes changed; eugenides voice and span removed; walker span 207–214')
# sanity: spans contiguous
prev=0
for a,b_,k in sp:
    assert a==prev+1 or prev==0 and a==1, (a,b_,k,prev)
    assert b_>=a; prev=b_
print('spans contiguous to', prev)
