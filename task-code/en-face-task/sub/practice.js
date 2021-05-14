// PRACTICE TRIALS //

var pCount = 0;
var pstim = {
  type: "image-keyboard-response",
  stimulus_height: 891, //shortened, square ratio kept
  stimulus_width: 891,
  stimulus: function(){return practicestim[pCount];},
  trial_duration: stimtime,
  choices: jsPsych.NO_KEYS
};

var pfix = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">?</div>',
  choices: choicekeys,
  post_trial_gap: poststimtime,
  on_finish: function(data){
    pCount++;
    data.trial = pCount;
    data.block = 'Practice';
    data.freq = pracfreq;

    console.log(data);
  }
};

var ptrials = {
  timeline: [pstim, pfix],
  repetitions: numpractrials,
};
