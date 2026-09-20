# Map vignettes for the Thames map

Small drawn spots for the poem's places, made to be pinned to the map at their real coordinates. Thirteen: the six that were asked for, then seven more where the poem hands over an image. The set stops there; the pins the poem gives no picture for (Moorgate, the Strand, Queen Victoria Street, the places abroad) are left to the map's own marks.

## How to use them

- Each file is an SVG with `viewBox="0 0 200 200"`, no width or height, no fonts, no scripts, no raster, no external references. Between 15 and 100 KB each as written. The shared folder stamps every SVG on write with a Content Credentials manifest (an `xmlns:c2pa` attribute and a `<metadata>` block of about 8 KB at the top of the file); it is inert and can be stripped before inlining.
- The ground is transparent and every line of ink is `currentColor`, so inline the markup (or fetch and inject it) rather than loading it through an `<img>`, and the page's `color` becomes the ink. On bone paper set `color: #1B1917`; in dark mode `color: #E6DCCB` and the drawings invert with the page. They have been checked both ways.
- Two other colours appear, small and flat, and stay as they are in dark mode: rust `#A3442B` on the barge's sails, and dull gold `#A8873A` on the ball and vane of St Magnus's spire and the ring of its clock.
- Every `id` inside a file is prefixed with the file's name (`st-magnus-martyr-k3`), so any number of them can sit in one document without their clip paths colliding.
- They are drawn to read at 120 to 200 px on the map and to be looked at enlarged (600 px and up). Line weights are set for that range; below 100 px the hatching closes up into grey, which is fine for a thumbnail but loses the drawing.
- The buildings share one projection so they sit on the map as a set: the front face square-on, the side receding up and to the left at 30 degrees at half scale, the light from the upper left. The bridge is an elevation from the water; the barge is broadside.
- Anchor points are given per piece. The buildings stand on a ground line at about y = 170 with the subject centred on x = 100, so the natural pin is the bottom centre of the box, and the vignette can sit with its foot on the pin the way buildings sit on an old pictorial map. The bridge and the barge belong on the water and give their own anchors.
- `contact-sheet.png` and `contact-sheet-2.png` in this folder are only for looking at the set together; they are not for the site.

## The six

### st-mary-woolnoth.svg
Lines 66 to 68: "Flowed up the hill and down King William Street, / To where Saint Mary Woolnoth kept the hours / With a dead sound on the final stroke of nine." Eliot's note: "A phenomenon which I have often noticed."

Hawksmoor's church of 1716 to 1727 on the corner of Lombard Street and King William Street, seen from the north-west corner, which is where the crowd coming up from the bridge would see it. The west front with its banded rustication, the round-headed door with the half-moon window over it, the banded Tuscan columns at the angles, the broad shallow tower with its Composite columns, and the two flat-topped turrets with balustrades that make its silhouette unlike any other church in the City. The north wall along Lombard Street carries Hawksmoor's blind arcade (the low blind apertures with heavy keystones and the great round-headed rusticated frames above them), which he built to keep the noise of Lombard Street out of the church. A line of clerks flows past at its foot.

In 1922 the Portland stone was black with a century of soot; it is drawn in line, as an engraver would, not in soot. The Bank tube station had been built under it in 1897 to 1900 (the crypt cleared, the church carried on steel girders, the lift shafts sunk beneath the floor); its entrance was cut into the south side, which this view does not show. Sources: Historic England list entry 1064620; Wikipedia, St Mary Woolnoth.

Anchor: the church stands on the ground line at y = 170, centred on x = 100. Pin at (100, 172).

### st-magnus-martyr.svg
Lines 259 to 265: "where the walls / Of Magnus Martyr hold / Inexplicable splendour of Ionian white and gold." Eliot's note on 264 calls the interior "one of the finest among Wren's interiors" and cites the pamphlet against the proposed demolition of nineteen City churches.

Wren's church (1671 to 1687, the steeple 1703 to 1706) at the foot of old London Bridge on Lower Thames Street, seen from the south-west, the river side, which is how you saw it from Rennie's bridge. The square tower in four stages with the archway cut through its base in 1762 so the footway of the old bridge could pass under it (people still walk through it), Sir Charles Duncombe's clock of 1709 out on its curved beam and scroll bracket from the west face, the parapet with vases, the octagonal lantern with round-headed openings, the lead dome, the little lantern and the concave-sided spirelet with its ball and vane, 185 feet in all. To the west, a skeleton of steel and a crane: Adelaide House going up (1921 to 1925), the "architectural Matterhorn" that The Times said would hide all but the tip of the spire. In the poem's year it was a frame.

What the lines are about is inside: the fluted Ionic columns, the white and gold. It cannot be shown from the street, so the gold on the clock ring and the vane is a wink toward it. Eliot saw the eighteenth-century interior; Martin Travers's baroque re-gilding came in 1924, after the poem. The window and the oculus on the tower's second and third stages are my reading of photographs; check against one before enlarging this piece beyond map size. Sources: RCHME, London vol. IV (British History Online, Bridge Ward Within); Historic England list entry 1064601; the parish website's page on the tower and lantern; Wikipedia, St Magnus-the-Martyr.

Anchor: the tower stands at x = 64 on the ground line y = 170; the whole drawing's foot is (100, 172). If the pin should touch the church itself, set (64, 170) on the pin.

### london-bridge.svg
Lines 62 to 65: "A crowd flowed over London Bridge, so many, / I had not thought death had undone so many. / Sighs, short and infrequent, were exhaled, / And each man fixed his eyes before his feet." And line 427, "London Bridge is falling down falling down falling down."

Rennie's bridge of 1831, not the present one of 1973: five elliptical arches of Haytor granite, the centre span 152 feet, 928 feet in all, on piers with pointed cutwaters. Seen from downstream, with the morning crowd flowing north into the City above the parapet, a frieze of bowler hats. The footways had been widened in 1902 to 1904, carried on granite corbels (the row of brackets under the cornice) with open parapets; the lamp standards were cast from French cannon taken in the Peninsular War. Beyond the bridge, faint in the brown fog of a winter dawn: roofs and chimneys, the Monument, and St Magnus's steeple at the bridge foot. The bridge was sold in 1968 and stands, re-erected, at Lake Havasu City, Arizona. The figures are drawn far larger than true scale, as pictorial maps have always done; at true scale a man on this bridge would be a single dot. Sources: Wikipedia, London Bridge; the 1911 Encyclopaedia Britannica on the widening; Heritage Calling on the lamps.

Anchor: the bridge spans the whole box, its deck at y = 96 and the water at y = 128. The pin wants the centre of the span at the water, (100, 128). The map may prefer to lay the vignette across the river with its ends on the two banks.

### red-sailed-barge.svg
Lines 266 to 276: "The river sweats / Oil and tar / The barges drift / With the turning tide / Red sails / Wide / To leeward, swing on the heavy spar. / The barges wash / Drifting logs / Down Greenwich reach / Past the Isle of Dogs."

A Thames spritsail barge, about 85 feet, flat-bottomed and leeboarded, with the mainsail set on the heavy spar (the sprit, running from the mast foot to the peak), a topsail above it, a foresail to the stemhead, and the small mizzen on the rudder head. Sails were dressed with red ochre and cod oil, which is the red; it is the only rust in the set. Two men and a dog was the usual crew: the skipper at the wheel aft, the mate forward. Drifting logs, oil on the water, the hull's dark reflection, and the Isle of Dogs low on the horizon with its chimneys. Over two thousand barges were on the register at the turn of the century. She sails to the right, which on a north-up map is downstream through Greenwich Reach. Source: Wikipedia, Thames sailing barge.

Anchor: she floats. Waterline centre at (100, 141); the pin sits under the hull.

### margate-sands.svg
Lines 300 to 305: "On Margate Sands. / I can connect / Nothing with nothing. / The broken fingernails of dirty hands. / My people humble people who expect / Nothing."

The Nayland Rock shelter on the promenade at the west end of Marine Terrace, where Eliot sat through three weeks of October and November 1921, sent to the sea to rest before Lausanne, and wrote much of Part III. It is Grade II listed for exactly that. Built about 1900: a hipped zinc roof on two rows of five slender cast-iron columns with fretwork brackets, a timber fretwork awning along the eaves, an H-plan white-painted glazed timber screen down the middle, continuous benches with heavy armrests, the whole on a triple-stepped dais faced with green tiles. Seen from the land side, so that the sea shows through it; an empty horizon and a gull or two. The man alone on the bench in his coat and hat is the poem's "I", or anyone. Source: Historic England list entry 1393490.

Anchor: the foot of the dais, (100, 166).

### cannon-street-hotel.svg
Lines 207 to 214: "Unreal City / Under the brown fog of a winter noon / Mr. Eugenides, the Smyrna merchant / Unshaven, with a pocket full of currants / C.i.f. London: documents at sight, / Asked me in demotic French / To luncheon at the Cannon Street Hotel / Followed by a weekend at the Metropole."

E. M. Barry's City Terminus Hotel of 1867 (Cannon Street Hotel from 1879), five storeys of Italianate stone across the front of Cannon Street station, with the train shed's single arch of glass and iron (200 feet across, 118 feet above the rails) rising behind it, its top lost in the fog of a winter noon. A hansom and a motor taxi wait at the door; the man in the soft hat by the porch is Mr Eugenides. The hotel's bedrooms became offices in 1930 (Southern House), it was hit in the Blitz, the shed roof came down in 1958 and the hotel in 1960; only the two river towers stand today. The Communist Party of Great Britain held its founding congress here in July 1920. The roofline (the mansard with dormers, the taller pavilion over the centre) follows Barry's Charing Cross Hotel of 1865, its near twin; the 1866 engraving in the Illustrated London News is the check if one is wanted. Sources: Wikipedia, Cannon Street station; Grace's Guide; the Railway Hub archive on the station's centenary.

Anchor: the hotel stands on the ground line at y = 170, centred on x = 100. Pin at (100, 172).

## The second seven

### lower-thames-street-bar.svg
Lines 259 to 263: "O City city, I can sometimes hear / Beside a public bar in Lower Thames Street, / The pleasant whining of a mandoline / And a clatter and a chatter from within / Where fishmen lounge at noon."

Eliot never names the pub, so this is a public bar of the kind that stood along Lower Thames Street beside Billingsgate in 1922: pilasters, etched glass over panelled stall-risers (a clear band and scrolls left in the glass), a dark fascia with one gilt rule and no name, a lamp on the corner, sash windows above, a gull on the parapet. The men are Billingsgate porters in their bobbin hats, the flat-topped, tarred-leather hats made in Lovat Lane so that a box of fish could ride on the head; one goes by with a box up, one leans on the pilaster with a pipe, one stands and listens. The mandoline player sits on an upturned fish box with his back to the window. The church is a few doors east. Source: London Museum, "Hat, porter's hat"; the Billingsgate bobbin hat page at History on Your Head.

Anchor: the pub stands on the pavement line at y = 170, centred on x = 100. Pin at (100, 172).

### elizabeth-and-leicester.svg
Lines 279 to 289: "Elizabeth and Leicester / Beating oars / The stern was formed / A gilded shell / Red and gold / The brisk swell / Rippled both shores / Southwest wind / Carried down stream / The peal of bells / White towers." Eliot's note sends the reader to Froude's Elizabeth and De Quadra's letter to Philip of Spain: the Queen, Lord Robert and the ambassador alone on the poop, talking nonsense about marriage.

The royal barge on the river off the Tower, long and low, with the oars beating (some lifted, some dipped), the rowers a row of heads above the gunwale, the house aft under its canopy and valance, the two of them standing on the poop (her ruff and farthingale, his cloak and feathered hat), pennants streaming down-stream in the south-west wind, and the stern formed as a gilded shell, which is the set's one other use of gold. Behind, the white towers: the White Tower with its four turrets and their cupolas, left white against a ruled sky, above the battlemented river wall of the Tower and its wharf. The swell is drawn as a brisk swell.

Anchor: she floats. Waterline centre at (100, 138); the pin can sit on the river below the Tower. If the map wants the White Tower itself pinned, its foot is at (106, 116).

### the-metropole.svg
Line 214: "Followed by a weekend at the Metropole."

The Hotel Metropole on the King's Road, Brighton, which is where the Smyrna merchant's weekend goes: Alfred Waterhouse's red terracotta pile of 1890, the largest hotel outside London when it opened, drawn as it stood in 1922 with its French pavilion roofs, dormers and the tall central spire that Seifert's rebuilding took off in 1961. Fourteen bays, iron balconies on the first and third floors, an arcade at the pavement, the promenade railing, the shingle and the sea line below; a couple out for the weekend, she with a parasol. Sources: My Brighton and Hove, "Metropole Hotel, Kings Road"; the Victorian Web's page on Waterhouse's Metropole ("its spire and French pavilion roof, removed in the 1960s"); Wikipedia.

Anchor: the hotel stands on the King's Road at y = 170, centred on x = 100. Pin at (100, 172). The sea is at the bottom of the box, so on the map the vignette wants to sit with the sea side toward the Channel.

### the-gashouse.svg
Lines 187 to 195: "A rat crept softly through the vegetation / Dragging its slimy belly on the bank / While I was fishing in the dull canal / On a winter evening round behind the gashouse / Musing upon the king my brother's wreck / And on the king my father's death before him."

Eliot names no gasworks and there were gasholders by every canal in London, so this is the type: a telescopic gasholder in its cage of cast-iron columns and lattice girders, the bell part-raised inside, the retort house with its sawtooth roof, a chimney with the smoke going flat in the cold, reeds and one bare tree on the bank. The man sits on the towpath with his rod out over the water and a float on the surface; the rat is on the bank to the right, going the other way. The canal is drawn dull: long, thin, widely spaced strokes. Winter evening, so no sun anywhere.

Anchor: the bank, where the towpath meets the water, at (100, 141). The pin can sit on the canal or on the bank as the map prefers.

### richmond.svg
Lines 293 to 295: "Highbury bore me. Richmond and Kew / Undid me. By Richmond I raised my knees / Supine on the floor of a narrow canoe."

Richmond Bridge as it was in 1922, before the widening of 1937 to 1940: Paine and Couse's Portland stone bridge of 1777, five elliptical arches with the tall centre span and the humpbacked road over them, the balustrade along the top. Behind it Richmond Hill rises with its trees and the houses of the Terrace on the crest; a willow leans over the near bank. In front, the narrow canoe: a man kneeling aft with the paddle, and forward, someone lying on the floor with knees up and a hat over the face. Source: Wikipedia, Richmond Bridge, London.

Anchor: on the water. The canoe is at (104, 160) and the bridge's centre span at (100, 140); pin at the canoe, or mid-span if the map pins the bridge.

### highbury.svg
Lines 292 to 293: "Trams and dusty trees. / Highbury bore me."

A London County Council tramcar of the E/1 class, the covered-top double-decker that worked the Highbury routes (the tracks reached Highbury station in 1906, and through services from there to Tower Bridge and Kennington began in 1908), on the conduit track that inner London used instead of overhead wires: two rails and the slot between them in the setts. Heads in the windows, the route box and destination board left blank, one man waiting at the kerb by the lamp. Behind it the dusty trees are London planes, with the flaking bark and the summer dust drawn as a stipple low in the air. Sources: the Kingsway tramway subway and Metropolitan Electric Tramways pages on Wikipedia for the Highbury dates; the National Tramway Museum on LCC cars.

Anchor: the rails, at (100, 164). Pin at (100, 166).

### kew.svg
Line 293: "Richmond and Kew / Undid me."

Chambers's Great Pagoda of 1761 in Kew Gardens, 163 feet, ten storeys, octagonal, each roof a little smaller than the one below, with the arcaded balconies round every storey. It is drawn as it was in 1922, which is to say without the eighty gilded dragons: they had gone by 1784 and did not come back until 2018. A few of Kew's dark conifers at its foot. Source: Wikipedia, Great Pagoda, Kew Gardens.

Anchor: the foot of the steps, (100, 170). Pin at (100, 172).

## Liberties taken, so nobody is surprised
- Figures are out of scale with the buildings everywhere, as on any pictorial map; they are there for life and for the poem's crowd.
- The stone is drawn clean. Every one of these London buildings was black in 1922.
- Nothing is drawn as it looks today: the bridge is Rennie's, Adelaide House is a frame, the hotel is standing, the shelter is new-ish, the Metropole has its spire, Richmond Bridge is narrow, the Pagoda has no dragons.
- The gashouse and the public bar are types, not particular buildings, because the poem names none.

## Source
The scripts that draw these are in `src/` beside them (one Python file per vignette on a small shared toolkit, plus the Playwright render harness), so any piece can be corrected and regenerated rather than edited by hand. See `src/README.md`.
