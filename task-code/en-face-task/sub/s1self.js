// FIRST STAGE SELF-JUDGEMENT TASKS FOR PICC STUDY //

var selfImage = []; // will contain the face they judge themselves as having
var choosebody = function(param) {
   if (Math.floor(images.length*param) > images.length-1){
     var name = images[images.length-1]
   } else {
     var name = images[Math.floor(images.length*param)]}
   selfImage.push(name); // current body choice

   var html = '<div><img src="'+name+'" style="width:300px;height:300px;" /></div>' +
   '<p>What face type would you say best matches your own?</p>'+
   "<p>Use the images above as a references. <b>Press or hold the 'i' key to cycle upward and the 'd' key to cycle downward.</b></p>"+
   "<p>Please be as honest as possible. When you are finished, please press the continue button below</p>"

   return html;
}

var selfchoice = {
 type: 'reconstruction',
 stim_function: choosebody,
 starting_value: 0.5,
 step_size: 0.016666666,
 key_increase: 'i',
 key_decrease: 'd',
 on_finish: function(data){
   jsPsych.data.addProperties({
     s1self: data.final_value
   });
   console.log(data)
 }
};

var selfjudge = {
 type: "image-keyboard-response",
 stimulus_height: 300, //original stimulus HxW divided by 3 to fit on screen, but keep ratio
 stimulus_width: 300,
 stimulus: function(){return selfImage[selfImage.length - 1]},
 prompt: "<p>If you had to choose, would you say the face is <strong>of Middle-Eastern geographic origin</strong> or not?" +
         "<p> Press "+choicekeys[0].toUpperCase()+" if you think the face is of Middle-Eastern geographic origin. Press "+choicekeys[1].toUpperCase()+" if you do not.</p>",
 choices: choicekeys,
 on_finish: function(data){
   jsPsych.data.addProperties({
     chosenbody: data.stimulus,
     s1selfjudge: data.key_press
   });
 }
};
