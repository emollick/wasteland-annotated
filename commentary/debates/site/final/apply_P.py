# Proposals from the part debates (shared-proposals-part2..5.md) folded into the site files, where they add a fact
# or a correction the site debate had not made. Everything else in those files was already covered.
import sys, json, re
sys.path.insert(0, '/tmp/claude-0/-home-user/47b143d1-a9ed-5a02-adf0-c9c713677b02/scratchpad/debate/final')
import records
from apply_B import smart
SITE = '/mnt/project-files/commentary/site/'

def getrec(recs, rid):
    for f in recs:
        if any(k=='id' and v==rid for k,v,s in f): return f
    raise SystemExit('no record '+rid)
def get(fields, key):
    for f in fields:
        if f[0]==key: return f[1]
    return None
def setf(fields, key, val, after=None):
    for f in fields:
        if f[0]==key: f[1]=val; return
    # insert a new block field after `after`
    for i,f in enumerate(fields):
        if f[0]==after: fields.insert(i+1,[key,val,'block']); return
    raise SystemExit('cannot insert '+key)
def sub(fields, key, old, new):
    t=get(fields,key); assert t is not None and old in t, (key, old); setf(fields,key,t.replace(old,new))

path=SITE+'sources.txt'; text=open(path,encoding='utf-8').read(); recs=records.parse(text); assert records.serialize(recs)==text
log=[]
# dans-le-restaurant (Part IV): the translation the gloss card carries; the note's dates
r=getrec(recs,'dans-le-restaurant')
sub(r,'trans','carried him far away','carried him very far away'); sub(r,'trans','Consider then, it was a hard fate','Just imagine, it was a hard fate')
setf(r,'note','''Eliot published four poems in French; this is one of them, written in 1917, printed in the <i>Little Review</i> in September 1918 and then in his two collections of 1920, <i>Ara Vos Prec</i> and <i>Poems</i>. A shabby waiter tells a customer about sheltering from a shower with a small girl when he was seven; the customer, disgusted, gives him ten sous to go and wash. Then, without transition, come seven lines on the drowned Phoenician Phlebas. Eliot turned those seven lines into the ten of Part IV, dropping the tin and Cornwall and adding “Gentile or Jew” and the address to the man at the wheel. His “Cornouaille”, without an s, is strictly the district of Brittany; the cargo of tin points to Cornwall, and that is how the line is read. In the draft these lines closed a long narrative of a shipwreck; Pound cut the narrative and insisted that Phlebas stay.'''); log.append('dans-le-restaurant')
# hesse (Part V): the English version
r=getrec(recs,'hesse-blick-ins-chaos')
sub(r,'note','He visited Hesse at Montagnola','Stephen Hudson’s English version, <i>In Sight of Chaos</i> (1923), has the two Dostoevsky essays. He visited Hesse at Montagnola'); log.append('hesse-blick-ins-chaos')
# webster (Part II): the order of bribe and stabbing, checked against the 1623 quarto by the Part II thread
r=getrec(recs,'webster-devils-law-case')
setf(r,'note','''Act III scene ii. Romelio, disguised as a physician, bribes the two surgeons attending the wounded Contarino to leave him alone with the patient, and stabs him; the surgeons, who have kept near, come back. When Contarino groans, one of them asks the other “Is the wind in that door still?”, an idiom for “so that is how things stand?”: the man is alive. The stab has drained the old wound, and Contarino recovers. Eliot’s note quotes the line with “Webster” for its source and does not name the play.'''); log.append('webster-devils-law-case')
# middleton (Part II): one word for what happens upstairs, as in the Part II gloss; the unverified essay quotation dropped
r=getrec(recs,'middleton-wbw')
setf(r,'what','The game of chess played downstairs while a woman is forced upstairs.')
setf(r,'note','''Livia, a rich widow acting as the Duke of Florence’s go-between, keeps Bianca’s mother-in-law at chess while the Duke forces himself on Bianca in the gallery above; her remarks on the game double as commentary on what is happening upstairs. Eliot’s note on line 137 cites “the game of chess in Middleton’s <i>Women beware Women</i>”; the title of Part II has also been connected with Middleton’s <i>A Game at Chess</i> (1624), a satire on Spain that ran for nine days at the Globe before the Privy Council stopped it.'''); log.append('middleton-wbw')
# dante-purg5 (Part III): where the Maremma is
r=getrec(recs,'dante-purg5')
sub(r,'note','Early commentators named her','The Maremma is the marsh country on the Tuscan coast. Early commentators named her'); log.append('dante-purg5')
# gotterdammerung (Part III): "hehr" is noble, not holy; what the refrain is
r=getrec(recs,'gotterdammerung')
sub(r,'trans','when whole and holy the father’s gold','when whole and noble the father’s gold'); sub(r,'trans','holy star of the deep','noble star of the deep')
sub(r,'note','Their refrain is the “la la” that Eliot’s Thames-daughters sing over oil and tar.','Their refrain is sung syllables without meaning, which Wagner’s printed poem leaves out and the scores supply at length; Eliot’s Thames-daughters sing two lines of it at 277–278 and 290–291.'); log.append('gotterdammerung')
# psalm137 (Part III): Eliot's line follows the Prayer Book wording, not the King James
r=getrec(recs,'psalm137')
setf(r,'author','The Book of Common Prayer (Coverdale’s psalter)')
setf(r,'date','6th century BC; Coverdale’s translation, 1530s, as in the Book of Common Prayer')
setf(r,'what','“By the waters of Babylon we sat down and wept.”')
setf(r,'passage','By the waters of Babylon we sat down and wept, when we remembered thee, O Sion. As for our harps, we hanged them up upon the trees that are therein. For they that led us away captive required of us then a song, and melody in our heaviness: Sing us one of the songs of Sion. How shall we sing the Lord’s song in a strange land?')
setf(r,'note','''The psalm of the Jewish exiles in Babylon, whose captors ask them for a song, and who ask in return how they can sing the Lord’s song in a strange land. Eliot’s line follows the Prayer Book’s wording, “By the waters of Babylon we sat down and wept,” not the King James Version’s “By the rivers of Babylon, there we sat down, yea, we wept.” Leman is Lac Léman, Lake Geneva: Eliot finished the poem at Lausanne, on the lake, in November and December 1921, on three months’ leave from Lloyds Bank, and puts the lake in place of Babylon’s waters. “Leman” is also an old English word for a lover, and the double sense has often been noticed.'''); log.append('psalm137')
# ovid-met6 (Parts II and III): both sisters kill Itys; Ovid names the hoopoe; a passage and translation for the empty fields
r=getrec(recs,'ovid-met6')
setf(r,'passage','corpora Cecropidum pennis pendere putares:<br>pendebant pennis. quarum petit altera silvas,<br>altera tecta subit, neque adhuc de pectore caedis<br>excessere notae, signataque sanguine pluma est.<br>ille dolore suo poenaeque cupidine velox<br>vertitur in volucrem, cui stant in vertice cristae.<br>prominet inmodicum pro longa cuspide rostrum;<br>nomen epops volucri, facies armata videtur.', after='what')
setf(r,'trans','As they fly from him you would think that the bodies of the two Athenians were poised on wings: they were poised on wings! One flies to the woods, the other rises to the roof. And even now their breasts have not lost the marks of their murderous deed, their feathers are stained with blood. Tereus, swift in pursuit because of his grief and eager desire for vengeance, is himself changed into a bird. Upon his head a stiff crest appears, and a huge beak stands forth instead of his long sword. He is the hoopoe, with the look of one armed for war. (Frank Justus Miller, 1916; <i>Metamorphoses</i> VI, 667–674)', after='passage')
sub(r,'note','Procne kills her son Itys and serves him to his father;','the sisters kill Procne’s son Itys and serve him to his father;')
sub(r,'note','Ovid does not say which sister became the nightingale and which the swallow;','Ovid names only Tereus’s bird, the hoopoe, and does not say which sister became the nightingale and which the swallow;'); log.append('ovid-met6')
# verlaine (Part III): the text reads "sous la tente"
r=getrec(recs,'verlaine-parsifal')
sub(r,'passage','rentre sous sa tente','rentre sous la tente'); sub(r,'trans','returns to his tent','returns to the tent'); log.append('verlaine-parsifal')
# day (Part III): the date of writing is not known; "the spring" in Day is water
r=getrec(recs,'day-parliament-of-bees')
setf(r,'date','printed 1641; date of writing unknown')
sub(r,'note','Eliot keeps the shape of Day’s sentence','In Day “the spring” is the water Diana bathes in; in Eliot’s line it is the season. Eliot keeps the shape of Day’s sentence'); log.append('day-parliament-of-bees')
# lyly (Part III): the song's date
r=getrec(recs,'lyly-campaspe'); setf(r,'date','play printed 1584; song first printed 1632'); log.append('lyly-campaspe')
# froude (Part III): Froude's own words in the passage; what Eliot's note changed
r=getrec(recs,'froude-elizabeth')
setf(r,'passage','In the afternoon we were in a barge, watching the games on the river. She was alone with the Lord Robert and myself on the poop, when they began to talk nonsense, and went so far that Lord Robert at last said, as I was on the spot there was no reason why they should not be married if the queen pleased.')
sub(r,'note','Eliot’s note cites Froude for lines 279–289,','Eliot’s note cites Froude for lines 279–289, quoting the passage with “(The queen)” for Froude’s “She”; his “Vol. I, ch. iv” is the Everyman’s Library edition,'); log.append('froude-elizabeth')
# spenser (Part III): the subtitle's spelling
r=getrec(recs,'spenser-prothalamion'); sub(r,'note','A “spousal verse,” as its title page calls it,','A “Spousall Verse,” as its title page calls it,'); log.append('spenser-prothalamion')
# shakespearian-rag (Part II): who first identified the song; the cover's spelling
r=getrec(recs,'shakespearian-rag')
sub(r,'note','Published in 1912 and advertised as a number from that year’s Ziegfeld Follies, the Broadway revue. In 2017','Published in 1912 and advertised as a number from that year’s Ziegfeld Follies, the Broadway revue; B. R. McElderry, who identified it as Eliot’s source in 1957, took the advertisements at their word. In 2017')
sub(r,'note','No recording from the period is known.','The cover spells the title “Shakesperian”, the chorus inside “Shakespearian”. No recording from the period is known.'); log.append('shakespearian-rag')
open(path,'w',encoding='utf-8').write(records.serialize(recs)); print('sources.txt:',len(log),'records:',', '.join(log))

# voices.json: tiresias (Part III), walker (Part III), fisher (the Prayer Book wording)
vp=SITE+'voices.json'; raw=open(vp,encoding='utf-8').read(); obj=json.loads(raw); assert json.dumps(obj,ensure_ascii=False,indent=1)==raw
V=obj['voices']
V['tiresias']['note']='Lines 215–251 and 253–256: the blind seer of Thebes from Ovid, once a woman for seven years, who says he “can see” the typist’s evening and has “foresuffered all.” Eliot’s note on line 218, which quotes Ovid, calls him “a mere spectator and not indeed a ‘character’” and yet “the most important personage in the poem, uniting all the rest.”'
V['walker']['note']='The “I” of three passages, read here as one voice: the crowd on London Bridge and the meeting with Stetson (60–76), Mr. Eugenides (207–211), and the music along the Strand and the bar in Lower Thames Street (257–265); at 257 he speaks Ferdinand’s line from The Tempest.'
V['fisher']['note']=V['fisher']['note'].replace('Psalm 137 at 182 (“we sat down, yea, we wept”)','Psalm 137 at 182 (“By the waters of Babylon we sat down and wept,” in the Prayer Book’s wording)')
assert 'Prayer Book' in V['fisher']['note']
open(vp,'w',encoding='utf-8').write(json.dumps(obj,ensure_ascii=False,indent=1)); print('voices.json: tiresias, walker, fisher')

# pages.txt and ui.txt (Part III)
records.apply(SITE+'pages.txt', {'map-gashouse-sub': {'text': 'the poem names no canal'}})
records.apply(SITE+'ui.txt', {'tarot-three-staves-note': {'text': '<p>A real card, the Three of Wands: a figure on a headland, back turned, watching ships go out. Eliot associated him, “quite arbitrarily,” with the Fisher King, whom his note on line 425 places on the shore, and whom readers also hear in the man fishing in the canal at line 189.</p>'}})
