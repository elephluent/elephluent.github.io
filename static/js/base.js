// base JS file for each page
let $account, $overlay, $questionProgressBar, $scoreProgressBar;
let profile = {
  username: "demo",
  email: "demo",
  preferredLanguage: "Spanish",
  preferredProgress: ["Colors"]
};

let msg = new SpeechSynthesisUtterance();

const colors = {
  rojo: "#ff544f",
  rosa: "#FF6F85",
  azul: "#44A5DC",
  morado: "#9250dc",
  amarillo: "#FFC200",
  naranja: "#FF9A34",
  verde: "#65BF3B",
  blanco: "#bababa",
  gris: "#777",
  negro: "#333",
  maron: "#8b4513"
};

$(document).ready(() => {
  // add login and logout button
  $account = $("#account");
  $overlay = $("#overlay");
  $scoreProgressBar = $("#score-progress");
  $questionProgressBar = $("#question-progress");

  // display account name if user is logged in
  if (profile) {
    $account.append(`
            <div><i class="fas fa-user-circle"></i> ${profile.username} </div>
            <div><button id="logout" class="button btn-outline">Logout</button></div>
        `);
    $("#logout").click(evt => {
      window.localStorage.removeItem("profile");
      window.sessionStorage.removeItem("moduleName");
      window.location = "/";
    });
  } else {
    $account.append(
      `<button id="login" class="button btn-outline">Login</button>`
    );
    $("#login").click(evt => {
      window.location = "/login";
    });
  }
});

/**
 * Toggles the overlay (modal) to be either on or off.
 * @param {*} overlayOn
 */
function setOverlay(overlayOn) {
  let display = overlayOn ? "flex" : "none";
  $overlay.css("display", display);
}

/**
 * Detaches the logo from the header and puts it on the side.
 */
function detachLogo() {
  let logo = $("#logo").detach();
  logo.appendTo("#logo-container");
  logo.css("display", "block");
}

/**
 * Changes the score progress bar to reflect how many questions user has gotten
 * right.
 * @param {*} score         percentage of correct questions
 * @param {*} numQuestions  number of total questions
 */
function updateScoreProgressBar(score, numQuestions) {
  let scoreProgress = (score * 100.0) / numQuestions;

  if (scoreProgress > 100) {
    scoreProgress = 100;
  }

  $scoreProgressBar.css("width", `${scoreProgress}%`);
}

/**
 * Changes the question progress bar to reflect how many questions the user has
 * answered.
 * @param {*} questionsFinished     number of questions finished
 * @param {*} numQuestions          total number of questions
 */
function updateQuestionProgressBar(questionsFinished, numQuestions) {
  let questionProgress = (questionsFinished * 100.0) / numQuestions;

  if (questionProgress > 100) {
    questionProgress = 100;
  }
  $questionProgressBar.css("width", `${questionProgress}%`);
}

/**
 * Sets up the text to speech for voice related games.
 * @param {*} language  language code (e.g. 'en-US')
 */
function setupTTS(language) {
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[10]; // Note: some voices don't support altering params
  msg.voiceURI = "native";
  msg.volume = 1; // 0 to 1
  msg.rate = 1; // 0.1 to 10wd
  msg.pitch = 1; //0 to 2
  msg.lang = language;
}

/**
 * Changes the text to speech language to a different language.
 * @param {*} language  language code (e.g. 'en-US')
 */
function changeTTSLanguage(language) {
  msg.lang = language;
}

/**
 * Uses the Web Speech API to say the given text.
 * @param {*} text text to say out loud
 */
function speak(text) {
  msg.text = text;
  speechSynthesis.speak(msg);
}

function formatWrong(ww) {
  let str = "";
  for (let i = 0; i < Object.keys(ww).length; i++) {
    str += ww[i];
    if (i != Object.keys(ww).length - 1) {
      str += "|";
    }
  }

  return str;
}
