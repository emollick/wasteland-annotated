# Source for the vignettes

Every vignette is drawn by a short Python script on top of `vig.py` (the toolkit: oblique projection, hatching, stipple, the crowd figures, the porter, water and swell). To redraw one after a change:

    cd src && python3 magnus.py            # writes ../st-magnus-martyr.svg
    NODE_PATH=/opt/node22/lib/node_modules node render.cjs out/ ../st-magnus-martyr.svg   # PNG at 120/160/200/640 px, bone and night
    NODE_PATH=/opt/node22/lib/node_modules node sheet.cjs sheet.png "title" ../*.svg     # contact sheet

The render harness needs Playwright with Chromium. Script to file: woolnoth → st-mary-woolnoth, magnus → st-magnus-martyr, bridge → london-bridge, barge → red-sailed-barge, margate → margate-sands, cannon → cannon-street-hotel, fishmen → lower-thames-street-bar, elizabeth → elizabeth-and-leicester, metropole → the-metropole, gashouse → the-gashouse, richmond, highbury, kew.
