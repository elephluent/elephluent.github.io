let speechLanguage = 'en-US';
let recording = false;

let $micButton;

let sentence;
let finalTranscriptText = '';

let $moduleName;
let $finalTranscript;
let $interimTranscript;
let $sentence;

let $spokenWordDiv;
let $correctedWordDiv;

let completed = false;
let $continueButton;
let $finishButton;
let $skipButton;
let $questionProg;
let $scoreProg;

let score = 0;
let sentenceCounter = 0;
let triesSoFar = 0;
let skip = 0;

let startTime, endTime, totalTime;
let d = new Date();

let data;
let $hearBtn;

let wrongSentences = [];

let numWrong = 0;
let numSent = 0;

const CORRECT_COLOR = "#0dc56f";
const HOME_URL = "index.html";

$(document).ready(() => {
  startTime = d.getTime();
  // window.sessionStorage.setItem("moduleName","Colors");
  // window.sessionStorage.setItem("language", "English");

  // let profile = JSON.parse(window.localStorage.getItem("profile"));

  let moduleName = //window.sessionStorage.getItem("moduleName");
  "Colors";
  let language = //profile.preferredLanguage;
  "Spanish";

  speechLanguage = getLanguageCode(language);

  // if(!moduleName || !language) {
  //   $('#message-text').text("Please log in first!");
  //   $('#message').animate({
  //     opacity: 1
  //   }, 1000, function() {});
  // }
  // else {
  //   // AJAX request
  //   let req = {
  //     moduleName: moduleName,
  //     language: language,
  //     lessonType: "ReadTheSentence"
  //   };
  //   $.post("/module/lesson/get-lesson", req, responseJSON => {
      data = //JSON.parse(responseJSON);
      [
        "El gato es negro.",
        "Los zapatos son rojos.",
        "El cielo es azul.",
        "El césped es verde.",
        "La ardilla es gris."
      ];

      // Use jquery to get objects
      $finalTranscript = $('#final-transcript');
      $interimTranscript = $('#interim-transcript');
      $continueButton = $("#continue-btn");
      disableContinueButton();
      $finishButton = $("#finish");
      $skipButton = $("#skip");
      $moduleName = $("#module-name");
      $micButton = $("#mic-button");
      $hearBtn = $("#hear-sent");
      $questionProg = $("#question-progress");
      $scoreProg = $("#score-progress");

      numSent = data.length;

      $moduleName.text(moduleName);

      // Set sentencce to the one in the database
      $sentence = $('#sentence');
      setSentence(data[sentenceCounter]);

      // Get the spoken and corrected word divs
      $spokenWordDiv = $("#spoken-words");
      $correctedWordDiv = $("#corrected-words");

      setupTTS(getLanguageCode(language));

      enableSkipButton();

      if (!('webkitSpeechRecognition' in window)) {
        console.log("error");
      }
      else {
        setupRecognition();
      }

      $micButton.on("click", function() {
        startButton();
      });

      $continueButton.on("click", function() {
        if (sentenceCounter < data.length - 1) {
          nextSentence();
        }
      });

      $finishButton.on("click", function() {
        finish();
      });
      $skipButton.on("click", function() {
        if (sentenceCounter < data.length - 1) {
          skip++;
          nextSentence();
        }
        else {
          updateQuestionProgressBar(1, 1);
          disableContinueButton();
          disableSkipButton();
          $micButton.css("display", "none");
          enableFinishButton();
          setOverlay(true);
          $("#continue").css("display", "block");
          $("#continue").addClass("animated bounceIn");
        }
      });

      $hearBtn.click(() => {
          speak($sentence.text());
      });

  //   });
  // }

  function finish() {
    let d2 = new Date();
    endTime = d2.getTime();
    totalTime = (endTime - startTime) / 1000;

    // Update user progress if the current module is the same as the
    // module the profile is currently working on
    // if(moduleName === profile.preferredProgress[0]) {
    //     let formattedScore = Math.ceil(((numSent - numWrong) / numSent) * 100);
    //     let formattedWrong = formatWrong(wrongSentences);
    //     updateEmail(profile.username, moduleName, "Read the Sentence", formattedScore, formattedWrong, totalTime);
    //     updateProgress("ReadTheSentence", profile, HOME_URL);
    // }
    // else {
      location.href=HOME_URL;
    // }
  }
});

function nextSentence() {
  sentenceCounter++;
  updateQuestionProgressBar(sentenceCounter, data.length);

  setSentence(data[sentenceCounter]);

  completed = false;
  reset();
  disableContinueButton();
  enableSkipButton();

  triesSoFar = 0;
}

function setSentence(s) {
  $sentence.text(s);
  sentence = s;
}

function enableSkipButton() {
  $skipButton.css("display", "block");
}
function disableSkipButton() {
  $skipButton.css("display", "none");
}

function enableContinueButton() {
  $continueButton.css("display", "block");
}
function disableContinueButton() {
  $continueButton.css("display", "none");
}

function enableFinishButton() {
    $finishButton.css("display", "block");
}

let recognition;
function setupRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recording = true;
  };

  recognition.onend = function() {
    recording = false;

    if(!completed) {
      checkAnswer();
    }
  };

  recognition.onerror = function(event) {
    console.log(event.error);
  };

  recognition.onresult = function(event) {
    let interimTranscriptText = "";
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscriptText += event.results[i][0].transcript;
      } else {
        interimTranscriptText += event.results[i][0].transcript;
      }
    }
    finalTranscriptText = finalTranscriptText.toLowerCase();
    interimTranscriptText = interimTranscriptText.toLowerCase();

    $finalTranscript.text(finalTranscriptText);
    $interimTranscript.text(interimTranscriptText);

    if(interimTranscriptText.trim() === "" &&
      (sentence.toLowerCase().trim().replace(".", "").replace("!", "").replace("?", "") === finalTranscriptText.trim())) {
      recognition.stop();

      score++;
      updateScoreProgressBar(score, data.length);
      $finalTranscript.animate({
        color: CORRECT_COLOR
      }, 1000, function() {});
      $interimTranscript.animate({
        "min-height": "0px",
      }, 1000, function() {});

      $('#message-text').text("You got it! Good job!");
      $('#message').animate({
        opacity: 1
      }, 1000, function() {});
      stopButtonOn(false);
      completed = true;
        if (sentenceCounter < data.length - 1) {
          enableContinueButton();
        } else {
          updateQuestionProgressBar(1, 1);
          disableContinueButton();
          disableSkipButton();
          $micButton.css("display", "none");
          enableFinishButton();
          setOverlay(true);
          $("#continue").css("display", "block");
          $("#continue").addClass("animated bounceIn");
        }
      disableSkipButton();
    }
  };
}

/**
  When the start button is pressed
**/
function startButton() {
  if (recording) {
    stopButtonOn(false);
    return recognition.stop();
  } else {
    stopButtonOn(true);
  }
  if (completed) {
    stopButtonOn(false);

    return;
  }

  reset();
  recognition.lang = speechLanguage;
  recognition.start();
}

let micIcon = `<i class="fas fa-microphone"></i>`;
let stopIcon = `<i class="fas fa-stop"></i>`;

function stopButtonOn(buttonOn) {
  if (buttonOn) {
    $micButton.removeClass("mic");
    $micButton.addClass("stop");
    $micButton.html(stopIcon);

  } else {
    $micButton.removeClass("stop");
    $micButton.addClass("mic");
      $micButton.html(micIcon);
  }
}

function reset() {
  $('#message-text').text("");
  $('message').css("opacity", "0");

  $spokenWordDiv.css("display", "block");
  $correctedWordDiv.empty();
  $correctedWordDiv.css("display", "none");

  finalTranscriptText = '';
  $finalTranscript.text('');
  $interimTranscript.text('');

  $finalTranscript.finish();
  $interimTranscript.finish();
  $finalTranscript.css("color", "#606060");
  $interimTranscript.css("min-height", "70px");

  // disableSkipButton();
  disableContinueButton();
}

function checkAnswer() {
  let correctWords = sentence.toLowerCase().replace(".", "").replace("!", "").replace("?", "").split(" ");
  let spokenWords = finalTranscriptText.toLowerCase().split(" ");

  let singular = false;
  if(correctWords.length === 1) {
    singular = true;
    correctWords = sentence.toLowerCase().replace(".", "").replace("!", "").replace("?", "").split("");
    spokenWords = finalTranscriptText.toLowerCase().split("");
  }

  let correctHash = {};
  for(i in correctWords) {
    correctHash[correctWords[i]] = true;
  }

  let correctOrNot = [];
  for(i in spokenWords) {
    if(correctHash[spokenWords[i]]) {
      correctOrNot[i] = true;
    }
    else {
      correctOrNot[i] = false;
    }
  }

  let anyWrong = false;
  $spokenWordDiv.css("display", "none");
  $correctedWordDiv.css("display", "block");
  for(i in spokenWords) {
    if(correctOrNot[i]) {
      $correctedWordDiv.append("<span class='correct'>" + spokenWords[i] + (singular ? "" : " ") + "</span>");
    }
    else {
      anyWrong = true;
      $correctedWordDiv.append("<span class='incorrect'>" + spokenWords[i] + (singular ? "" : " ") + "</span>");
    }
  }

  if (anyWrong) {
    wrongSentences.push($sentence.text());
    numWrong++;
  }

  triesSoFar++;
  // Set corrected answers to animate colour
  $('.correct').animate({
    color: CORRECT_COLOR
  }, 1000, function() {});
  $('.incorrect').animate({
    color: "#ff6666"
  }, 1000, function() {});

  if(finalTranscriptText.trim() === "") {
    $('#message-text').text("Huh? We didn't here anything! Press the button and try saying the sentence again!");
    $('#message').animate({
      opacity: 1
    }, 1000, function() {});
  }
  else if(triesSoFar >= 3) {
    $('#message-text').text("You've tried a few times already, how about coming back to this one later?");
    $('#message').animate({
      opacity: 1
    }, 1000, function() {});

    enableSkipButton();
  }
  else if(!anyWrong) {
    $('#message-text').text("You're pronouncing the words correctly, but try saying the whole sentence in the right order!");
    $('#message').animate({
      opacity: 1
    }, 1000, function() {});
  }
  else {
    $('#message-text').text("You're close! Try again!");
    $('#message').animate({
      opacity: 1
    }, 1000, function() {});
  }
}
