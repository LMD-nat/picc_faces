README
PICC BI and Face Validation notes
07/11/2020

These are the changed files between Sean’s PICCBI repository and Nathalie’s forked Body Image Study designed for the participant pool (originally forked from Sean’s PICCBI repo). 

The file names are exactly the same as the original repository. The variable names for things also have not changed. 

Main changes: 
1. Forced choice for some demographic variables, like determining eligibility criteria (mental health, gender, ethnicity)
2. Ethnicity question added, wasn’t there before
3. Currency question added, just in case, otherwise participants are asked to simply estimate their incomes in CAD based on their currency
4. Time issues were clarified in screen time (note added that a max enterable time is 24:00), participants in piloting responded weirdly (ie. 36:00) even though the max was 24:00
5. Ethics certificate # added just in case to debrief and consent for lab personnel/coders to consult
6. Faces instructions match what Cassandra and Ben agreed to
7. Study is gender neutral now, men can rate “their own” bodies pre and post, before there was a line telling men to skip those two questions

To add:

1. Button/option for “I choose not to respond” on each of the faces, if you choose that option you can also force the continue button to appear only after the slider has moved so people can’t just spam “continue” (require_movement) (check here: https://www.jspsych.org/plugins/jspsych-image-slider-response/)
2. In faces, line 165, if you don’t change the button described above you’ll need to edit this line, it currently reads "<p>If you prefer not to answer for a given face, simply press Continue without moving the slider.</p>",

Checks: 
1. Does the whole study run on Pavlovia with no issues? – Yes but Kirby did not run and there were typos (forgot Caucasian in enthnicity), fixed these and now everything looks fabulous
2. Does the redirect back to prolific work? – Yes [This completion URL is working correctly. The participant will complete with the code F0B109B4.]
3. Does the data save? – Yes, csv format and everything
4. Do the questionnaires look ok? – Typo fixes performed, everything looks good
5. Do the faces pre-load? (I had an issue with this yesterday) – Yes, no issues
6. How long did everything take? 40:00 for me to run the whole study
