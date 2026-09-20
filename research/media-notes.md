# Media research log — The Waste Land (1922)

Companion to `media.json` (54 items, 51 verified). Written 2026-09-20.

**Method.** Every URL in `media.json` marked `verified: true` was actually fetched: with curl (browser
User-Agent) or the WebFetch tool; YouTube videos via the oEmbed endpoint (returns title + channel
name); SoundCloud via its oEmbed; archive.org via `/metadata/ID` (file lists, uploader, dates);
xeno-canto via the `/NUMBER/embed` page (HTTP 200) plus xeno-canto's GBIF dataset for metadata;
loc.gov via the `?fo=json` API (HTML is Cloudflare-blocked); two NYPL pages via Wayback captures
(stated in the item). No audio was downloaded; the only files pulled were page images of the 1922
Boni & Liveright scan for the text checks. Anything that could not be fetched is `verified: false`.

## 1. Eliot's own readings — dates

- **Poetry Archive** (poetryarchive.org, five per-part pages, own player, not embeddable). The poet
  page says verbatim that the recording "dates from 1933, a decade earlier than the well-known and
  much more widely available 1946 recording" and "The date of the recording was once thought to be
  1935, but recent scholarship has shown that this is incorrect", citing Swigg, *Quick, Said the
  Bird* (2012) and Camlot, *Phonopoetics* (2019), information from Dr Lacy Rumsey.
- **Faber SoundCloud** (official FaberBooks account): 64-second extract of the same recording,
  described as "a rare recording from 1933". Embeddable via the SoundCloud player.
- **PennSound** (writing.upenn.edu, ed. Chris Mustazza): the Columbia "Speech Lab" recording in two
  complete versions, section-by-section MP3s (HTTP 200), but **labelled 1935**; aluminium platters
  recorded by W. Cabell Greet and George W. Hibbitt, dubbed by the Library of Congress in the 1970s;
  Eliot Estate permission, noncommercial/educational use only.
- **Library of Congress**: its online ARPL catalogue has **no separate 1946 Waste Land item**. The
  only online item is the 23 May 1947 National Gallery reading (loc.gov/item/95770483), which
  contains Part V only, streaming for "reference, research, and educational purposes only".
- **HarperAudio / archive.org RTFM-Harp-940218**: the later commercial (Caedmon/HarperCollins)
  recording of the whole poem, distributed in 1994 as an 8 kHz computer sound file (low fidelity);
  the item does not state the recording year. The Hilltop Review abstract found in searching
  speaks of "one made in 1946 for the Library of Congress, and another from 1935, recorded at
  Columbia University". Wikipedia's Recordings section links only this HarperAudio page and LibriVox.
- **Conclusion for the edition**: the Columbia recording should be dated **1933** (Poetry Archive
  and Faber, on Swigg/Camlot evidence), with a note that older sources (including PennSound) say
  1935. The "1946" date for the later recording is widely repeated but I could not confirm it from
  any primary page; treat as "cited, not confirmed online".

## 2. Alec Guinness (Argo)

- Full reading on YouTube, channel **Bookyards** (@bookyards9808), video 8YAgdETvQG0 (oEmbed
  confirmed; not the rights holder).
- Per-section uploads on **P is for Poetry** (Zsuzsanna Uhlik): Parts I, II, III and V; no Part IV
  found on that channel.
- archive.org TheWasteLand_201704: a community upload of the Guinness reading **mixed with a loop of
  Barber's Adagio** at "432 Hz" — not the clean Argo audio; the uploader's public-domain claim is
  unfounded. Included only so nobody mistakes it for the original.
- Discogs (via api.discogs.com): Argo PLP 1206/7, 2 x LP mono, "Recorded in association with The
  Arts Council of Great Britain and the BBC", dated **1975**. The often-cited 1971 recording date was
  not confirmed by any fetched source.

## 3. Jeremy Irons & Eileen Atkins (BBC Radio 4, 2012)

- BBC programme page b01dvzg7 verified: "Eileen Atkins and Jeremy Irons read TS Eliot's The Waste
  Land. Introduced by Dr Rowan Williams", 45 min; first broadcast Fri 30 March 2012 14:15
  (jeremyirons.net; producer Susan Roberts); page shows "Last on Thu 12 Mar 2015, BBC Radio 4
  Extra". No audio on the page; not on BBC Sounds.
- YouTube sYROFY_Kh8M (channel jssmrenton, individual): 27:45 off-air copy — exists, unofficial.
- archive.org BBC_Radio_4_FM_20170101_140000_Jeremy_Irons_Reads_TS_Eliot: Internet Archive's own
  off-air radio archive (stream-only), 1 Jan 2017 broadcast "Jeremy Irons reads the poetry of TS
  Eliot: The Waste Land"; whether it re-uses the 2012 recording is not stated.
- Bonus: Irons & Sinéad Cusack live reading, Borris House Festival (official channel The Borris
  Broadcasts), lAaC3DOpIY8, 52 min.

## 4. Fiona Shaw / Deborah Warner

- Official Festival de Cannes page (Un Certain Regard 1996) verified. No legitimate stream of the
  BBC film was found (BBC iPlayer/Genome unreachable). The complete film exists on YouTube only as
  a private individual's upload (u0Ic4P93O2o, 35:07) — flagged `plausible_channel: false`.
- Only BBC-authorised video: BBC Politics channel, "Fiona Shaw performs The Wasteland – Newsnight"
  (ACCJWm_zdSA, 1:17).
- The Faber/Touch Press **app** (App Store id427434046, seller now NatureGuides Ltd) contains a
  separately filmed 2011 Shaw performance of the whole poem plus the Eliot (two periods), Hughes,
  Guinness, Mortensen and Irons/Atkins audio. Official demo films: Touch Press "A walk through The
  Waste Land" (rlhosnfP-Jw) and Arts Council England "Anatomy of The Waste Land iPad app"
  (hyVzW4d7Jac).
- Google Arts & Culture photos verified: Marilyn Kingwill (Wilton's Music Hall collection, 1997
  run) and Graham Brandon (V&A, TM/10298/5/28A).
- Shaw audio per section on P is for Poetry (I–V), source recording not stated.

## 5. Hughes, Mortensen, centenary readings

- Ted Hughes: official Faber SoundCloud extract (A Game of Chess); full audiobook on Faber's product
  page (9780571333066). Recording year not stated.
- Viggo Mortensen: official Faber SoundCloud extract (The Fire Sermon), recorded 2011 for the app.
  The British Library 2015 event page for his live reading now 404s.
- Centenary (2022): Edoardo Ballerini — Faber SoundCloud extract of the Centenary Edition audiobook
  (Faber / T. S. Eliot Foundation, 4 Jan 2022), Faber "Poem of the Week" page and product page
  verified; Queens Public Library event (Ff3L58qIlqY, 1:07:37) and Charleston Literary Festival
  session (R8RBl2WCXrM, 51:15), both on official channels.
- LibriVox (Elizabeth Klett, 2011, archive.org wasteland_etk_librivox; also LibriVox Audiobooks on
  YouTube JPKdIkJSiEk) — the only reading that is free to reuse.
- BBC Two Arena documentary "T. S. Eliot: Into 'The Waste Land'" (13 Oct 2022, dir. Susanna White):
  BBC page unreachable; only an unofficial YouTube copy exists (kuu0L1c0vJI) — **not included**.

## 6. Wagner

- 1928 Bayreuth Tristan (Elmendorff), archive.org `tristan1928-1` (Act I) and `Tristan1928-3`
  (Act III, capital T), FLAC+MP3 per number, 78-rpm surface noise. Named tracks: "02 - Westwärts
  schweift der Blick (Seemann - Gustav Rodin)" and "05 - Szene 2 - Frisch weht der Wind (Seemann)";
  Act III "53 - Der Hirt (Hans Beer)" and "54 - Kurwenal, sag! (Hirt - Hans Beer)" (the exchange
  ending "Öd' und leer das Meer!"). Track contents inferred from file names, not auditioned.
  Copyright: public domain in the EU; in the US, 1923–46 recordings are protected until 2029.
- 1927 HMV Act III (Coates/Widdop), archive.org `tristan-Isolde3`, shepherd/Kurwenal opening on
  track 2.
- Furtwängler/Flagstad 1952 (Boston Public Library vinyl digitisation, streamable, in copyright).
- Götterdämmerung Rhinemaidens: Solti/Vienna 1964 LP set, side "disc5/09.02. Act III Scene 1"
  (601 s) opens with "Frau Sonne ... Weialala leia"; alternative 1956 Flagstad/Fjeldstad set.
- IMSLP work pages for Tristan (vocal scores incl. Kleinmichel/Schott, Bülow/Breitkopf) and
  Götterdämmerung (vocal scores; "Scene of the Rhine-Maidens (Act III)" arrangement) verified.

## 7. "That Shakespearian Rag"

- Songwriters confirmed: music **Dave Stamper**, words **Gene Buck and Herman Ruby**, Jos. W. Stern
  & Co., New York, 1912; the sheet music spells it "That Shakesperian Rag". Eliot's line reads
  "O O O O that Shakespeherian Rag —".
- Sheet music scan: York University Libraries (YorkSpace item 62165c1c-…, PDF bitstream verified).
- Library of Congress: `notated-music` and `audio` JSON searches return **zero** results for both
  spellings — no LOC sheet music and no National Jukebox recording. No period recording found on
  archive.org either (Duke HASM: no hits; IN Harmony: search error; UCSB DAHR: 403).

## 8. Hermit thrush

- xeno-canto (metadata via GBIF; `/N/embed` pages fetched, HTTP 200; main pages are behind an
  Anubis bot wall so A–E quality ratings could not be read):
  - XC664726, Matthew R. Halley, Warren County, Pennsylvania, 2019-07-14, song, 2:42, CC BY-NC-SA 4.0.
  - XC899696, Denis Provencher, Les Laurentides, Québec, 2024-05-01, 2:19, CC BY-NC-SA 4.0 (phone
    recording; thematically apt for Eliot's note "which I have heard in Quebec County").
  - XC715748, Doug Hynes, Nova Scotia, 2021-07-06, 0:57, **CC BY-SA 4.0** (no NC clause).
  - Also noted: XC567241 (Heckscher, Alaska, 2:35) and XC815822 (Provencher, Matawinie, 4:15).
- Macaulay Library article "Hermit Thrush Song Differs Across North America" (2017) verified, with
  ML 3675 (1951, Allen & Kellogg) and ML 48265131 (2006, Budney) embedded; Macaulay asset pages and
  All About Birds are bot-blocked (All About Birds URL left `verified: false`).

## 9. 1922 Boni & Liveright scans

- archive.org `wasteland01elio` (Duke University Libraries, 2012, 72 leaves, PDF/JP2/OCR) — used
  for all text checks below. archive.org `wasteland00elio` (BYU, copy no. 596; catalogue: "Second
  state of line 339 ('mount in')"). `wasteland00elio_0` (Getty) is the third printing (Aug 1928).
- HathiTrust Record 001835100 (full-view Duke copy dul1.ark:/13960/t9k371w5q — the same scan):
  every HathiTrust host returned Cloudflare 403; `verified: false`.

## 1922 text readings

Source: Duke copy `wasteland01elio`, page images read at full resolution. Page numbers below are
the printed/inferred page numbers of the book; the corresponding JP2 leaf in the archive.org item is
**leaf = page + 4** (e.g. p. [43] = `wasteland01elio_0047.jp2`). Image URL pattern used (the
`ia8xxxxx` host may change):
`https://ia800409.us.archive.org/BookReader/BookReaderImages.php?zip=/17/items/wasteland01elio/wasteland01elio_jp2.zip&file=wasteland01elio_jp2/wasteland01elio_00NN.jp2&id=wasteland01elio&scale=1&rotate=0`.
The OCR (djvu.txt/djvu.xml) was used only to locate pages; every reading below was checked on the image.

Original five checks:

1. **Marginal "360"** sits beside "When I count, there are only you and I together" (p. [43]),
   i.e. one line *after* "Who is the third who walks always beside you?", which carries no number
   (it is 359 by the edition's own count, 360 by the modern count).
2. **"Shantih shantih shantih" has no marginal number.** The last printed marginal number is
   **430**, beside "These fragments I have shored against my ruins" (p. [49]). Counting on from
   there, Shantih is 433, and the Notes are headed "433. Shantih." (p. [64]).
3. **"aetherial"**: "Only at nightfall, aetherial rumours" (p. [47]) — spelt *aetherial*, not
   *aethereal*; edition line 415 (marginal 410 stands at the preceding "DA").
4. **"ceu chelidon"**: "Quando fiam ceu chelidon — O swallow swallow" (p. [49], italic) — *ceu*,
   not *uti*; edition line 428, and the note reads "428. V. Pervigilium Veneris".
5. **"Od' und leer das Meer."** (p. [13]) — a plain capital O with no diaeresis and no "Oe"
   digraph (not "Oed'" and not "Öd'"); the note reads "42. Id. III, verse 24".

Additional checks requested by the coordinator:

- (a) Line 141 is set in small capitals as **HURRY UP PLEASE ITS TIME** — **no apostrophe**
  (p. [23]); the same reading recurs at 152 (p. [24]), 165 (p. [25]) and 168–169 (p. [26]).
- (b) Line 133: "**tomorrow**", unhyphenated — "…so. What shall we do tomorrow?" (p. [22]).
- (c) Line 69: **colon after "crying"** — "There I saw one I knew, and stopped him, / crying:
  "Stetson!" (the line turns over after "him,"; p. [15]).
- (d) Line 85: **semicolon** — "From satin cases poured in rich profusion;" (p. [17]).
- (e) Line 132 **begins with an opening double quotation mark**: ""I shall rush out as I am, and
  walk the / street" (p. [22]; run-over line).
- (f) Line 298: "He wept. He promised **'a new start.'**" — single quotation marks with the **full
  stop inside** the closing quote (p. [37]).

Other observations from this copy:

- Marginal numbers verified on the images: 30 "dust.", 40 "Living nor dead, and I knew nothing,",
  50 "The lady of situations.", 70 "Mylae!", 80 "…peeped out", 120, 130 "So intelligent",
  140 "…myself,", 150 "…I said.", 160 "…of young George.)", 170 "…May. Goonight.", 270 "Red sails",
  280 "Beating oars", 290 "Weialala leia", 300 "On Margate Sands.", 340 "Here one can neither stand
  nor lie nor sit", 350 "A spring", 360 "…together", 390 "Dry bones can harm no one.", 400 "DA",
  410 "DA", 420 "…would have responded", 430 "…my ruins".
- **Why the edition counts 433 lines, not 434**: on p. [42] "If there were water" is set flush
  right as a run-over of "From doors of mudcracked houses" and is not counted, so from 346 onward
  the marginal numbers run one behind the modern count (hence 350 at "A spring", 360 at
  "together", 415 "aetherial", 428 "ceu chelidon", 430 "ruins", 433 Shantih).
- **The Notes are internally inconsistent about this**: "357. This is Turdus aonalaschkae pallasii,
  the hermit-thrush which I have heard in Quebec County…" and "360. The following lines were
  stimulated by the account of one of the Antarctic expeditions (I forget which, but I think one of
  Shackleton's)…" (p. [61]) fit the straight (modern) count, whereas "366-76" (Hesse), 401, 407,
  411, 424, 427, 428, 429, 431 and 433 fit the marginal count.
- Line 339 reads "Dead **mount in** mouth of carious teeth" (p. [41]) — the "mount in" state (BYU
  catalogues its copy as the "second state").
- Line 135 reads "The hot **w ter** at ten." (p. [22]) — dropped "a".
- Line 32 reads "Der **Heimai** zu," (p. [12]) — the final letter prints as a dotted i (damaged or
  wrong sort); lines 31–34 are an italic indented block.
- Line 128: "O O O O that Shakespeherian Rag —" (p. [21]).
- Line 1: "APRIL is the cruellest month" (two l's; first word in capitals). The Dial text
  (see §10) prints "cruelest".

## 10. Magazine appearances

- **The Dial, November 1922** (vol. 73 no. 5): archive.org `sim_dial_1922-11_73` (serials
  microfilm scan, public, 137 leaves). Leaf n0 = p. 473: "THE WASTE LAND / BY T. S. ELIOT",
  epigraph, "April is the cruelest month", and the footnote "Copyright 1922 by T. S. Eliot. An
  edition of The Waste Land with annotations by Mr Eliot will presently be issued by Boni &
  Liveright.—The Editors." Poem ends p. 485 (leaf 12). HathiTrust: only v.72 (Jan–Jun 1922,
  mdp.39015031076550) surfaced in search; v.73 ID not found; HathiTrust unreachable anyway.
- **Modernist Journals Project**: journal list checked — neither The Dial nor The Criterion is on MJP.
- **The Criterion, October 1922**: no public scan found. archive.org `criterionquarter01unse`
  (Toronto) is Vol. I No. 4, July 1923 (OCR has no "Waste Land"); the 1967 Faber facsimile volumes
  on archive.org are lending-only.

## 11. Berg Collection (NYPL)

- Finding aid archives.nypl.org/brg/19153 (verified via Wayback 2025-02-11; live site 403s):
  "T. S. Eliot collection of papers, 1918-1989", Berg Coll MSS Eliot, 678 items, includes "the
  typescript/manuscript of 'The Waste Land,' with Ezra Pound's annotations" (from John Quinn).
- NYPL Digital Collections item 025c9df0-0d63-013c-4b53-0242ac110002 ("[Page 30, recto]", Image ID
  58104579; verified via Wayback 2024-06-25; live site behind Incapsula): the digitised pages are
  **onsite-only** ("may be viewed onsite in the Stephen A. Schwarzman Building"), rights "protected
  by copyright". The 1971 facsimile (ed. Valerie Eliot; reissued 2022) remains the way to see
  Pound's annotations. No online images of the manuscript were found on any legitimate site.

## 12. Sources

- Project Gutenberg #4090 Weston, *From Ritual to Romance* — verified.
- Project Gutenberg #3623 Frazer, *The Golden Bough* — verified; Gutenberg's note says "1922
  Abridged edition".
- Frazer, *Adonis, Attis, Osiris*: 1906 first edition `adonisattisosiri00frazuoft` (Toronto);
  the 3rd-edition Golden Bough Part IV (2 vols, 1914) as `TheGoldenBoughPartIvAdonisAttisOsirisVolI`
  and `adonisattisosiri025648mbp` — all verified.

## Could not verify / not found

- HathiTrust (catalog, babel, API): Cloudflare 403 to every fetch — record 001835100 and the Dial
  volume left `verified: false`.
- All About Birds Hermit Thrush sounds page: Cloudflare 403 (`verified: false`); Macaulay asset
  pages: bot challenge (article page verified instead).
- xeno-canto main pages: Anubis challenge (embed pages and GBIF used instead; quality grades unread).
- NYPL live pages (archives.nypl.org, digitalcollections.nypl.org, nypl.org exhibition): 403 /
  Incapsula; two pages verified through Wayback captures as stated.
- BBC iPlayer / BBC Genome / Arena documentary page: unreachable.
- UCSB DAHR (403), Indiana IN Harmony (search backend error): could not rule out a period
  "Shakespearian Rag" recording there, but LOC and archive.org have none.
- T. S. Eliot Society page, Poetry Foundation article (Wayback capture was a JS shell), British
  Library 2015 Mortensen event page (404): not usable as sources.
- Not confirmed by any fetched source: the 1971 date for the Guinness Argo recording (Discogs:
  1975); the 1946 date/existence of an LOC Waste Land recording; the source recording of the
  P is for Poetry Shaw uploads.
- Unofficial YouTube copies seen but **not included** in `media.json`: CqvhMeZ2PlY (tim24frames),
  1rpFBSO65P4, EFsXEtYokfg, qqrq8F0oVNs, Hcj4G45F9pw, kuu0L1c0vJI (Arena documentary). Two
  unofficial uploads *are* included, clearly flagged `plausible_channel: false`, because they are
  the only online copies of the 2012 BBC broadcast and the 1995 BBC film: sYROFY_Kh8M and u0Ic4P93O2o.

## Rights reminders for the edition

- Eliot's readings: Poetry Archive/Faber/PennSound audio is under Eliot Estate permission for
  noncommercial/educational use; LOC streaming is for reference/research/education; the HarperAudio
  file is a limited-distribution 8 kHz copy. Link or embed; do not rehost.
- 1927–28 Wagner 78s: PD in the EU, US-protected until 2029; archive.org LP digitisations are
  in-copyright library streams (link/embed only).
- xeno-canto: CC BY-NC-SA 4.0 (Halley, Provencher) or CC BY-SA 4.0 (Hynes) — credit recordist + XC number.
- LibriVox reading and the 1906/1914 Frazer, 1912 sheet music, 1922 Dial and B&L scans: public domain.
