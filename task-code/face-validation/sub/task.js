/* init connection with pavlovia.org */
var pavlovia_init = {
	type: "pavlovia",
	command: "init"
};

var pavlovia_finish = {
	type: "pavlovia",
	command: "finish"
	};

var timeline = [pavlovia_init, consent, fullscreen, welcome, faces, debrief, pavlovia_finish, finish]

var allimages = images;
// run
  jsPsych.init({
    timeline: timeline,
    preload_images: faceimg,
    show_preload_progress_bar: true,
		on_finish: function(data){
			//jsPsych.data.get().localSave('csv','TEST_PICCBI_'+subject_id+'_'+cond+'.csv'); // download locally if piloting
			document.body.innerHTML = '<p> Thank you for completing the study! You can now close this page.</p>'
			//document.body.innerHTML = '<p> You can go ahead and close this page! Thanks! </p>'
     //  setTimeout(function () { location.href = "https://app.prolific.co/submissions/complete?cc=11EED3C3" }, 10000) // send back to Prolific once study is online
		}
});