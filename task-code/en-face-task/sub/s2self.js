// STAGE 2 SELF -JUDGEMENT //

var selfjudge2 = {
 type: "image-keyboard-response",
 stimulus_height: 300, // to fit on screen, but keep ratio
 stimulus_width: 300,
 stimulus: function(){return selfImage[selfImage.length - 1]},
 prompt: "<p>Please judge this last face in the same way as before.</p>"+
         "<p>If you had to choose, would you say the model is <strong>of Middle-Eastern geographic origin</strong> or not?</p>" +
         "<p> Press "+choicekeys[0].toUpperCase()+" if you think the model is of Middle-Eastern geographic origin. Press "+choicekeys[1].toUpperCase()+" if you do not.</p>",
 choices: choicekeys,
 on_finish: function(data){
   jsPsych.data.addProperties({
     s2selfjudge: data.key_press
   });
 }
};

var instself = { // after trials
  type: "html-keyboard-response",
  stimulus: "<p>Thank you!</p>" +
            "<p>Next, please just tell us again what face you feel best matches your own.<p>"+
            "<p>You will do this on the next screen. Press SPACE to continue</p>",
  choices: ['space'],
  post_trial_gap: poststimtime
};

var selfchoice2 = {
 type: 'reconstruction',
 stim_function: choosebody,
 starting_value: 0.5,
 step_size: 0.016666666,
 key_increase: 'i',
 key_decrease: 'd',
 on_finish: function(data){
   jsPsych.data.addProperties({
     s2self: data.final_value
   });
 }
};
