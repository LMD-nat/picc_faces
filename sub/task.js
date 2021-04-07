/* init connection with pavlovia.org */
var pavlovia_init = {
	type: "pavlovia",
	command: "init"
};

var pavlovia_finish = {
	type: "pavlovia",
	command: "finish"
	};

var timeline = [pavlovia_init, consent, fullscreen, welcome, questionnaires_pre, selfchoice, selfjudge, i1, ptrials, i2]
for (i in _.range(numblocks)){
  timeline.push(block);
  timeline.push(trials);
};

timeline.push(end, selfjudge2, instself, selfchoice2, questionnaires_post, debrief, pavlovia_finish);

var allimages = images;
// run
  jsPsych.init({
    timeline: timeline,
    preload_images: allimages,
    show_preload_progress_bar: true,
		on_finish: function(data){
			//jsPsych.data.get().localSave('csv','TEST_PICCBI_'+subject_id+'_'+cond+'.csv'); // download locally if piloting
			document.body.innerHTML = '<p> All done! You can now close this page! </p>'
      //setTimeout(function () { location.href = "https://app.prolific.co/submissions/complete?cc=F0B109B4" }, 10000) // send back to Prolific once study is online
		}
});
