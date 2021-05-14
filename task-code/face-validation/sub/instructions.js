// INSTRUCTIONS FOR PICC BODY IMAGE TASK //

var welcome = {
	    type: 'instructions',
	    pages: [
		'Welcome to this study! We are interested in studying how people perceive and identify different kinds of faces. Click next to begin.',
		"<p>On the next screen, you will be asked to answer some questions about yourself. </p>" +
		"<p>Please do so as honestly as possible. </p>" +
		"<p>After you answer these questions, you will be directed to the main tasks. More instructions will follow then. Click next to continue.</p>"
	    ],
	    show_clickable_nav: true
};

var finish = {
  type: "html-keyboard-response",
  stimulus: "<p>You have finished the entire experiment!</p>"+
            "<p>You may now exit the window</p>",
  choices: ['e']
};
