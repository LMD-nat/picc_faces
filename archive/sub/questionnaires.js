// QUESTIONNAIRES //

var demo1 = {
  type: 'survey-text',
  questions: [
    {prompt: "What is your university e-mail address? This is just to help us identify you for credit assignment", name:'ID'},
    {prompt: "What is your age in years?", name:'age'},
    {prompt: "Please enter your date of birth", placeholder: "DD/MM/YYYY", name:'dob'},
    {prompt: "Please indicate your marital status (Single (never married), Married, Separated, Widowed, Other (if other please specify))", placeholder: "e.g., Single", name:'marital'},
    {prompt: "Please enter your first (native) language", placeholder: "English, French, Arabic, German, etc.", name:'natlang'},
    {prompt: "Please enter any additional languages that you speak in order of proficiency. If you speak French as your second language and a little bit of Spanish, please enter French, Spanish", placeholder: "e.g., French, Spanish", name:'olang'}
  ],
  preamble: 'Welcome! Here are some questions about your background. Please answer the following demographic questions as honestly as possible. All of your responses are strictly confidential',
  on_finish: function(data){
    jsPsych.data.addProperties({
      ID:  JSON.parse(data.responses)['ID'],
      age: JSON.parse(data.responses)['age'],
      dob: JSON.parse(data.responses)['dob'],
      marital: JSON.parse(data.responses)['marital'],
      natlang: JSON.parse(data.responses)['natlang'],
      olang: JSON.parse(data.responses)['olang']
    });
  }
};

var health = {
  type: 'survey-text',
  questions: [
    {prompt: "If you have been diagnosed with a mental health condition over the past 6 months, please specify what kind of condition you have. If this does not apply to you, enter N/A.", placeholder: "e.g., Depressive Disorder, N/A", name:'mental'},
    {prompt: "Are you currently taking medication for a mental health treatment? If yes please specify the type", placeholder: "Antidepressants, N/A", name:'mentdrug'},
    {prompt: "If you are taking medication for a mental health treatment, please specify the drug name, frequency of use, and dosage", placeholder: "e.g., Sertraline, 15mg daily", name:'mentpos'}
  ],
  preamble: 'Thank you. Below are some questions about your physical and mental health along with any medication you have been or are currently taking. For any questions that do not apply to you, please enter "N/A". All of your responses are strictly confidential.',
  on_finish: function(data){
    jsPsych.data.addProperties({ // add random data to file
      mental: JSON.parse(data.responses)['mental'],
      mentdrug: JSON.parse(data.responses)['mentdrug'],
      mentpos: JSON.parse(data.responses)['mentpos']
    });
  }
};

// Short scale of political cynicism (Aichholzer & Kritzinger, 2016)

var sspc = ['1: Many, like all of them', '2: Most', '3: About half', '4: A few', '5: None of them']
var SSPC = {
  type: 'survey-likert',
  questions: [
    {prompt: "How many politicians are honest with voters?", name:'sspc_01', labels: sspc, required:true},
    {prompt: "How many politicians are in politics to achieve as much personal gain as possible?", name:'sspc_02', labels: sspc, required:true},
    ],
  preamble: 'We are interested in what you think about politicians in Canada. Please indicate your thoughts about the following statements.',
      on_finish: function(data){
    jsPsych.data.addProperties({
      sspc_01: JSON.parse(data.responses)['sspc_01'],
      sspc_02: JSON.parse(data.responses)['sspc_02']
    });
  }
};

// Populist attitude scale. Akkerman et al., 2014, adapted according to recommendations by Castanho Silva et al. (2019)
var pas = ['1: Very much disagree', '2: ', '3: ', '4: ', '5: Very much agree']
var PAS = {
  type: 'survey-likert',
  questions: [
    {prompt: "The politicians in the Canadian parliament need to follow the will of the people.", name:'pas_01', labels: pas, required:true},
    {prompt: "The people, and not politicians, should make our most important policy decisions.", name:'ngs_pas', labels: pas, required:true},
    {prompt: "The political differences between the elite and the people are larger than diferences among the people.", name:'pas_03', labels: pas, required:true},
    {prompt: "I would rather be represented by a citizen than by a specialized politician.", name:'pas_04', labels: pas, required:true},
    {prompt: "Elected officials talk too much and take too little action.", name:'pas_05', labels: pas, required:true},
    {prompt: "Politics is ultimately a struggle between good and evil.", name:'pas_06', labels: pas, required:true},
    {prompt: "What people call compromise in politics is really just selling out on one's principles.", name:'pas_07', labels: pas, required:true},
    {prompt: "Interest groups have too much influence over political decisions.", name:'pas_08', labels: pas, required:true},
    {prompt: "In a democracy, it is important to make compromises among differing viewpoints.", name:'pas_09', labels: pas, required:true},
    {prompt: "It is important to listen to the opinion of other groups.", name:'pas_10', labels: pas, required:true},
    {prompt: "Diversity limits my freedom.", name:'pas_11', labels: pas, required:true},
    {prompt: "Politicians should lead rather than follow the people.", name:'pas_12', labels: pas, required:true},
    {prompt: "Our contry would be governed better if important decisions were left up to successful business people.", name:'pas_13', labels: pas, required:true},
    {prompt: "Our contry would be governed better if important decisions were left up to independent experts.", name:'pas_14', labels: pas, required:true}
      ],
  preamble: 'Thanks! Here are some more questions on your political views. Again, we are interested in what you think about politicians in Canada. Please indicate your thoughts about the following statements.',
  on_finish: function(data){
    jsPsych.data.addProperties({
      pas_01: JSON.parse(data.responses)['pas_01'],
      pas_02: JSON.parse(data.responses)['pas_02'],
      pas_03: JSON.parse(data.responses)['pas_03'],
      pas_04: JSON.parse(data.responses)['pas_04'],
      pas_05: JSON.parse(data.responses)['pas_05'],
      pas_06: JSON.parse(data.responses)['pas_06'],
      pas_07: JSON.parse(data.responses)['pas_07'],
      pas_08: JSON.parse(data.responses)['pas_08'],
      pas_09: JSON.parse(data.responses)['pas_09'],
      pas_10: JSON.parse(data.responses)['pas_10'],
      pas_11: JSON.parse(data.responses)['pas_11'],
      pas_12: JSON.parse(data.responses)['pas_12'],
      pas_13: JSON.parse(data.responses)['pas_13'],
      pas_14: JSON.parse(data.responses)['pas_14']
    });
  }
};

/ ICQ: Intergroup contact

var CONTACT = {
  type:'survey-likert',
  questions:[
    {prompt: "How often do you interact with people of Middle-Eastern geographic origin?", name:'contact_01', labels: ['Never', 'Less than once a year', 'Yearly','A few times a year', 'Monthly', 'Weekly', 'Daily'], required:true},
    {prompt: "Was your contact with people of Middle-Eastern geographic origin friendly?", name:'contact_02', labels: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Agree', 'Strongly agree'], required:true},
    {prompt: "Was your contact with people of Middle-Eastern geographic origin unpleasant?", name:'contact_03', labels: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Agree', 'Strongly agree'], required:true},
    {prompt: "Did you cooperate well?", name:'contact_04', labels: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Agree', 'Strongly agree'], required:true},
    {prompt: "Did you interact as equals?", name:'contact_05', labels: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Agree', 'Strongly agree'], required:true},
    {prompt: "Was your contact with people of Middle-Eastern geographic origin negative?", name:'contact_06', labels: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Agree', 'Strongly agree'], required:true},
    {prompt: "How many people of Middle-Eastern geographic origin do you know, at last as aquaintances?", name:'contact_07', labels: ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten or more'], required:true},
    {prompt: "How many of your friends are people of Middle-Eastern geographic origin?", name:'contact_08', labels: ['None of my friends', 'One of my friends', 'A few of my friends', 'About half of my friends', 'More than half of my friends', 'Almost all of my friends', 'All of my friends'], required:true},
    {prompt: "How often do you meet friends of your Middle-Eastern origin friends?", name:'contact_09', labels: ['Never', 'Less than once a year', 'Yearly','A few times a year', 'Monthly', 'Weekly', 'Daily'], required:true}
  ],
  preamble: 'Here are some questions about your contact with people of Middle-Eastern geographic origin. Please indicate your level of agreement or your answer by clicking on it.',
  on_finish: function(data){
    jsPsych.data.addProperties({
    contact_01: JSON.parse(data.responses)['contact_01'],
    contact_02: JSON.parse(data.responses)['contact_02'],
    contact_03: JSON.parse(data.responses)['contact_03'],
    contact_04: JSON.parse(data.responses)['contact_04'],
    contact_05: JSON.parse(data.responses)['contact_05'],
    contact_06: JSON.parse(data.responses)['contact_06'],
    contact_07: JSON.parse(data.responses)['contact_07'],
    contact_08: JSON.parse(data.responses)['contact_08'],
    contact_09: JSON.parse(data.responses)['contact_09']
    });
  }
};

/ ICQ: Acceptance and empowerment

var idnd = ['1: Strongly disagree', '2: Disagree', '3: Somewhat disagree', '4: Neutral', '5: Somewhat agree', '6: Agree', '7: Strongly agree']
var IDENTITY_NEEDS = {
  type: 'survey-likert',
  questions: [
    {prompt: "I felt welcomed and accepted by people of Middle-Eastern geographic origin members with whom I had contact.", name:'idnd_01', labels: idnd, required:true},
    {prompt: "I felt that people of Middle-Eastern geographic origin member with whom I had contact saw me as racist or immoral. [recoded]", name:'idnd_02', labels: idnd, required:true},
    {prompt: "I felt that people of Middle-Eastern geographic origin member with whom I had contact perceived me as competent and intelligent.", name:'idnd_03', labels: idnd, required:true},
    {prompt: "If you are paying attention, please select 'Agree' for this question", name:'catch_01', labels: idnd, required:true},
    {prompt: "I felt that people of Middle-Eastern geographic origin member with whom I had contact listened to what I had to say.", name:'idnd_04', labels: idnd, required:true},
    {prompt: "Contact with people of Middle-Eastern geographic origin left me with the impression that my ingroup was welcomed and accepted by people of Middle-Eastern geographic origin.", name:'idnd_05', labels: idnd, required:true},
    {prompt: "Contact with people of Middle-Eastern geographic origin left me with the impression that people of Middle-Eastern geographic origin saw my group of geographic origin as racist or immoral. [recoded]", name:'idnd_06', labels: idnd, required:true},
    {prompt: "I felt that people of Middle-Eastern geographic origin with whom I had contact perceived my group of geographic origin as competent and intelligent.", name:'idnd_07', labels: idnd, required:true},
    {prompt: "I felt that people of Middle-Eastern geographic origin with whom I had contact listened to what my group of geographic origin had to say.", name:'idnd_08', labels: idnd, required:true}
    ],
  preamble: 'Thank you! Here are some more questions about your contact with people of Middle-Eastern geographic origin. Please indicate your level of agreement or your answer by clicking on it.',
      on_finish: function(data){
    jsPsych.data.addProperties({
      idnd_01: JSON.parse(data.responses)['idnd_01'],
      idnd_02: JSON.parse(data.responses)['idnd_02'],
      idnd_03: JSON.parse(data.responses)['idnd_03'],
      idnd_04: JSON.parse(data.responses)['idnd_04'],
      idnd_05: JSON.parse(data.responses)['idnd_05'],
      idnd_06: JSON.parse(data.responses)['idnd_06'],
      idnd_07: JSON.parse(data.responses)['idnd_07'],
      idnd_08: JSON.parse(data.responses)['idnd_08'],
      catch_01: JSON.parse(data.responses)['catch_01']
    });
  }
};

/ ICQ: Addressed discrimination
var adig = ['1: Never', '2: Rarely', '3: Occasionally', '4: Sometimes', '5: Frequently', '6: Usually', '7: Always']
var A_DISC = {
  type: 'survey-likert',
  questions: [
    {prompt: "When I come into contact with members of my own group of origin, we talk about injustices in society regarding people of Middle-Eastern geographic origin.", name:'adig_01', labels: adig, required:true},
    {prompt: "When I come into contact with members of my own group of origin, we talk about personal experiences with discrimination against people of Middle-Eastern geographic origin.", name:'adig_02', labels: adig, required:true},
    {prompt: "When I come into contact with members of my own group of origin, we talk about the existence of privilege among members of my own group of origin", name:'adig_03', labels: adig, required:true}
    ],
  preamble: 'Thank you! Here are some more questions about what you discuss within your own group of origin regarding people of Middle-Eastern geographic origin. Please indicate your level of agreement or your answer by clicking on it.',
      on_finish: function(data){
    jsPsych.data.addProperties({
      adig_01: JSON.parse(data.responses)['adig_01'],
      adig_02: JSON.parse(data.responses)['adig_02'],
      adig_03: JSON.parse(data.responses)['adig_03']
    });
  }
};

/ ICQ: Perceived legitimacy of differences
var plcs = ['1: Strongly disagree', '2: Disagree', '3: Somewhat disagree', '4: Neutral', '5: Somewhat agree', '6: Agree', '7: Strongly agree']
var PLCSSJ = {
  type: 'survey-likert',
  questions: [
    {prompt: "I think it is justified that people of my own geographic origin have a higher status than people of Middle-Eastern geographic origin.", name:'plcs_01', labels: plcs, required:true},
    {prompt: "I think the advantages of people of my own geographic origin compared to people of Middle-Eastern geographic origin are legitimate.", name:'plcs_02', labels: plcs, required:true},
    {prompt: "In general, relations between people of my own geographic origin and people of Middle-Eastern geographic origin are fair.", name:'plcs_03', labels: plcs, required:true},
    {prompt: "For people of Middle-Eastern geographic origin, Canada is the best country in the world to live in.", name:'plcs_04', labels: plcs, required:true},
    {prompt: "Most policies relating to people of Middle-Eastern geographic origin serve the greater good.", name:'plcs_05', labels: plcs, required:true},
    {prompt: "Everyone regardless of group of origin, has a fair shot at wealth and happiness.", name:'plcs_06', labels: plcs, required:true},
    {prompt: "If you are paying attention, please select 'Disagree' for this question", name:'catch_02', labels: plcs, required:true},
    {prompt: "I felt that people of Middle-Eastern geographic origin with whom I had contact perceived my group of geographic origin as competent and intelligent.", name:'plcs_07', labels: plcs, required:true},
    {prompt: "The Canadian society is set up so that people of my own geographic origin and people of Middle-Eastern geographic origin usually get what they deserve.", name:'plcs_08', labels: plcs, required:true},
    {prompt: "The political decisions dealing with people of Middle-Eastern geographic origin are as they should be.", name:'plcs_09', labels: plcs, required:true},
    {prompt: "People of Middle-Eastern geographic origin should obtain much more power in the decision-centers of our society.", name:'plcs_10', labels: plcs, required:true},
    {prompt: "Institutions of my country should allocate more places to people of Middle-Eastern geographic origin as a form of affirmative action.", name:'plcs_11', labels: plcs, required:true},
    {prompt: "The state budget should be distributed equally so that the resources that are allocated to people of Middle-Eastern geographic origin are proportional to those that are allocated to people of my own geographic origin.", name:'plcs_12', labels: plcs, required:true}
    ],
  preamble: 'Thank you! Here are some more questions asking you to indicate your level of agreement with some proposed statements concerning your thoughts about people of Middle-Eastern geographic origin. Please indicate your level of agreement or your answer by clicking on it.',
      on_finish: function(data){
    jsPsych.data.addProperties({
      plcs_01: JSON.parse(data.responses)['plcs_01'],
      plcs_02: JSON.parse(data.responses)['plcs_02'],
      plcs_03: JSON.parse(data.responses)['plcs_03'],
      plcs_04: JSON.parse(data.responses)['plcs_04'],
      plcs_05: JSON.parse(data.responses)['plcs_05'],
      plcs_06: JSON.parse(data.responses)['plcs_06'],
      plcs_07: JSON.parse(data.responses)['plcs_07'],
      plcs_08: JSON.parse(data.responses)['plcs_08'],
      plcs_09: JSON.parse(data.responses)['plcs_09'],
      plcs_10: JSON.parse(data.responses)['plcs_10'],
      plcs_11: JSON.parse(data.responses)['plcs_11'],
      plcs_12: JSON.parse(data.responses)['plcs_12'],
      catch_02: JSON.parse(data.responses)['catch_02']
    });
  }
};

/ ICQ: Support for social change
var wwwp = ['1: Not at all', '2: A bit', '3: Somewhat', '4: Neutral', '5: Moderate', '6: A great deal', '7: Very much']
var WIWOWP = {
  type: 'survey-likert',
  questions: [
    {prompt: "How willing are you to cooperate with people of Middle-Eastern geographic origin to work for justice for people of Middle-Eastern geographic origin?", name:'wwwp_01', labels: plcs, required:true},
    {prompt: "How willing are you to protest alongside people of Middle-Eastern geographic origin to work for justice for people of Middle-Eastern geographic origin?", name:'wwwp_02', labels: plcs, required:true},
    {prompt: "How willing are you to unite with people of Middle-Eastern geographic origin to work for justice for people of Middle-Eastern geographic origin?", name:'wwwp_03', labels: plcs, required:true},
    {prompt: "Attending meetings or workshops regarding the unequal treatment of people of Middle-Eastern geographic origin.", name:'wwwp_04', labels: plcs, required:true},
    {prompt: "Writing letters to public officials or other people of influence to protest against the unequal treatment of people of Middle-Eastern geographic origin.", name:'wwwp_05', labels: plcs, required:true},
    {prompt: "Attending demonstrations, protests or rallies against the unequal treatment of people of Middle-Eastern geographic origin.", name:'wwwp_06', labels: plcs, required:true},
    {prompt: "Voting for political candidates who support the equal treatment of people of Middle-Eastern geographic origin.", name:'wwwp_07', labels: plcs, required:true},
    {prompt: "Signing an online/regular petition to support action against the unequal treatment of people of Middle-Eastern geographic origin.", name:'wwwp_08', labels: plcs, required:true},
    {prompt: "Sharing posts on Facebook to support equality for people of Middle-Eastern geographic origin.", name:'wwwp_09', labels: plcs, required:true}
    ],
  preamble: 'Thank you! Here are a last set of questions asking you to indicate your willigness to work with and advocate for people of Middle-Eastern geographic origin. Please indicate your level of agreement or your answer by clicking on it.',
      on_finish: function(data){
    jsPsych.data.addProperties({
      wwwp_01: JSON.parse(data.responses)['wwwp_01'],
      wwwp_02: JSON.parse(data.responses)['wwwp_02'],
      wwwp_03: JSON.parse(data.responses)['wwwp_03'],
      wwwp_04: JSON.parse(data.responses)['wwwp_04'],
      wwwp_05: JSON.parse(data.responses)['wwwp_05'],
      wwwp_06: JSON.parse(data.responses)['wwwp_06'],
      wwwp_07: JSON.parse(data.responses)['wwwp_07'],
      wwwp_08: JSON.parse(data.responses)['wwwp_08'],
      wwwp_09: JSON.parse(data.responses)['wwwp_09']
    });
  }
};

var SESincome = {
  type:'survey-likert',
  questions:[
    {prompt: "Please indicate your parents' weekly income", name:'sesparent', labels: ['< 100$', '101-200$', '201-300$', '301-400$', '401-500$', '501-600$', '601-700$', '701-800$', '801-900$', '901$ +'], required:true},
    {prompt: "Please indicate your weekly income", name:'sesstudent', labels: ['< 100$', '101-200$', '201-300$', '301-400$', '401-500$', '501-600$', '601-700$', '701-800$', '801-900$', '901$ +'], required:true},
    {prompt: "We are interested in how you perceive your life.  Think of a ladder representing where people stand in North America. At the top of the ladder are the people who are the best off -- those who have the most money, the most education, and the most respected jobs. At the bottom are the people who are the worst off -- who have the least money, least education, and the least respected jobs or no job. The higher up you are on this ladder, the closer you are to the people at the very top; the lower you are, the closer you are to the people at the very bottom. Imagine this rating scale represents the ladder. Where would you place yourself, relative to other people in North America?", name:'sesladder', labels: ['1, very low on the social ladder', '2', '3', '4', '5', '6', '7', '8', '9', '10, very high on the social ladder'], required:true},
    {prompt: "What is your native currency?", name:'sescurrency', labels: ['CAD', 'USD', 'GBP', 'AUS', 'EUR', 'Other'], required:true}
  ],
  preamble: 'For statistical purposes, we are interested in average incomes in Canadian Dollars. Please make your best guess, converting your own native currency to CAD. Some exchange rates are: 1 USD = 1.33 CAD, 1 AUS = 0.95 CAD, 1 EUR = 1.56 CAD, 1 GBP = 1.70 CAD',
  on_finish: function(data){
    jsPsych.data.addProperties({
      sesparent: JSON.parse(data.responses)['sesparent'],
      sesstudent: JSON.parse(data.responses)['sesstudent'],
      sesladder: JSON.parse(data.responses)['sesladder'],
      sescurrency: JSON.parse(data.responses)['sescurrency']
    });
  }
};

var EDUC = {
  type:'survey-likert',
  questions:[
    {prompt: "If you completed High School (Secondary School), what was your average grade approximately?", name:'educ_hs', labels: ['90-100 (A+)', '85-89 (A)', '80-84 (A-)', '77-79 (B+)', '73-76 (B)', '70-72 (B-)', '67-70 (C+)', '63-66 (C)', '60-62 (C-)', '57-59 (D+)', '53-56 (D)', '50-52 (D-)', '< 50 (F)', 'I did not complete High School'], required:true},
    {prompt: "If you completed studies at a non-university college (or post-secondary institution), or CEGEP what was your average grade approximately?", name:'educ_ce', labels: ['90-100 (A+)', '85-89 (A)', '80-84 (A-)', '77-79 (B+)', '73-76 (B)', '70-72 (B-)', '67-70 (C+)', '63-66 (C)', '60-62 (C-)', '57-59 (D+)', '53-56 (D)', '50-52 (D-)', '< 50 (F)', 'N/A'], required:false}
  ],
  preamble: 'Here are some additional questions about your education background',
  on_finish: function(data){
    jsPsych.data.addProperties({
      educ_hs: JSON.parse(data.responses)['educ_hs'],
      educ_ce: JSON.parse(data.responses)['educ_ce']
    });
  }
};

var gender_options = ["Female &nbsp &nbsp", "Male &nbsp &nbsp", "Transgender &nbsp &nbsp", "Non-Binary &nbsp &nbsp"];
var ethnicity_options = ["American Indian or Alaskan Native  &nbsp &nbsp", "Native Hawaiian or Other Pacific Islander  &nbsp &nbsp", "Asian  &nbsp &nbsp", "Hispanic or Latino or Spanish Origin of any race  &nbsp &nbsp", "Black or African American  &nbsp &nbsp", "Middle Eastern or North African  &nbsp &nbsp", "White or Caucasian  &nbsp &nbsp", "I would rather not answer &nbsp &nbsp"];
var education_options = ["Elementary School  &nbsp &nbsp", "Junior High School  &nbsp &nbsp", "High School  &nbsp &nbsp", "CEGEP, non-university college, trade school or equivalent  &nbsp &nbsp", "Undergraduate degree  &nbsp &nbsp", "Graduate degree  &nbsp &nbsp", "Professional degree (i.e., Law School, Medical School, Dentistry) &nbsp &nbsp"];
var school_options = ["Yes, but not at a university  &nbsp &nbsp", "Yes, Undergraduate studies  &nbsp &nbsp", "Yes, Graduate studies  &nbsp &nbsp", "No, currently not in school  &nbsp &nbsp"];
var demo2 = {
  type: 'survey-multi-choice',
  questions: [
    {prompt: "What is your gender?", options: gender_options, name:'gender', required: true, horizontal: false,},
    {prompt: "What is your ethnicity?", options: ethnicity_options, name:'ethnicity', required: true, horizontal: false,}, // Adapted from https://ir.aa.ufl.edu/surveys/race-and-ethnicity-survey/
    {prompt: "Have you been diagnosed with a mental health condition over the past 6 months?", options: ['Yes' + '&nbsp &nbsp &nbsp', 'No' + '&nbsp &nbsp'], name:'mental_check', required: true, horizontal: false,},
    {prompt: "What is your highest level of education?", name:'educ_l', options: education_options, required: true, horizontal: false,},
    {prompt: "Are you currently attending school?", name:'educ_c', options: school_options, required: false}
  ],
    preamble: 'Here are some more demographic questions that we will use for statistical purposes',
    on_finish: function(data){
        jsPsych.data.addProperties({
        gender: JSON.parse(data.responses)['gender'],
        ethnicity: JSON.parse(data.responses)['ethnicity'],
        mental_check: JSON.parse(data.responses)['mental_check'],
        educ_l: JSON.parse(data.responses)['educ_l'],
        educ_c: JSON.parse(data.responses)['educ_c']
    });
  }
};

var lsns = ['None', 'One', 'Two', 'Three or four', 'Five to eight', 'Eight or more']
var lsns_fam = {
  type:'survey-likert',
  questions:[
    {prompt: "How many relatives do you see or hear from at least once a month?", name:'lsns_fam_1', labels: lsns, required:true},
    {prompt: "How many relatives do you feel close to such that you could call on them for help?", name:'lsns_fam_2', labels: lsns, required:true},
    {prompt: "How many relatives do you feel at ease with that you can talk about private matters?", name:'lsns_fam_3', labels: lsns, required:true}
  ],
  preamble: '<br> Considering the people to whom you are related either by birth or marriage:',
  on_finish: function(data){
    jsPsych.data.addProperties({
      lsns_fam_1: JSON.parse(data.responses)['lsns_fam_1'],
      lsns_fam_2: JSON.parse(data.responses)['lsns_fam_2'],
      lsns_fam_3: JSON.parse(data.responses)['lsns_fam_3']
    });
  }
};

var lsns_fri = {
  type:'survey-likert',
  questions:[
    {prompt: "How many friends do you see or hear from at least once a month?", name:'lsns_fri_1', labels: lsns, required:true},
    {prompt: "How many friends do you feel close to such that you could call on them for help?", name:'lsns_fri_2', labels: lsns, required:true},
    {prompt: "How many friends do you feel at ease with that you can talk about private matters?", name:'lsns_fri_3', labels: lsns, required:true}
  ],
  preamble: '<br> Considering all of your friends including those who live in your neighbourhood:',
  on_finish: function(data){
    jsPsych.data.addProperties({
      lsns_fri_1: JSON.parse(data.responses)['lsns_fri_1'],
      lsns_fri_2: JSON.parse(data.responses)['lsns_fri_2'],
      lsns_fri_3: JSON.parse(data.responses)['lsns_fri_3']
    });
  }
};

questionnaires_pre = {
  timeline: [demo1, demo2, health, SESincome, EDUC],
};

questionnaires_post = {
  timeline: [sspc, pas, CONTACT, idnd, idig, adig, plcs, wwwp, lsns, lsns_fri],
};
