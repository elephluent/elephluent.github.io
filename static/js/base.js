let $account, $overlay, $questionProgressBar, $scoreProgressBar;
let profile = {
  username: "demo", 
  email: "demo", 
  preferredLanguage: "Spanish", 
  preferredProgress: ["Colors"]
};
// let profile = JSON.parse(window.localStorage.getItem("profile"));
let msg = new SpeechSynthesisUtterance();

const colors = {
    "rojo": "#ff544f",
    "rosa": "#FF6F85",
    "azul": "#44A5DC",
    "morado": "#9250dc",
    "amarillo": "#FFC200",
    "naranja": "#FF9A34",
    "verde": "#65BF3B",
    "blanco": "#bababa",
    "gris": "#777",
    "negro": "#333",
    "maron": "#8b4513"
};

// if not logged in and not about to login, redirect to home page
let pathname = window.location.pathname;
// if (!profile && pathname !== "/" && pathname !== "/login" && pathname !== "/register") {
//     window.location = "/";
// }

// // home page redirects to dashboard if logged in
// if (pathname === "/" && profile) {
//     window.location = "/dashboard";
// }

$(document).ready(() => {
    // add login and logout button
    $account = $("#account");
    $overlay = $("#overlay");
    $scoreProgressBar = $("#score-progress");
    $questionProgressBar = $("#question-progress");

    if (profile) {
        $account.append(`
            <div><i class="fas fa-user-circle"></i> ${ profile.username } </div>
            <div><button id="logout" class="button btn-outline">Logout</button></div>
        `);
        $("#logout").click((evt) => {
            window.localStorage.removeItem("profile");
            window.sessionStorage.removeItem("moduleName");
            window.location = "/";
        });
    } else {
        $account.append(`<button id="login" class="button btn-outline">Login</button>`);
        $("#login").click((evt) => {
            window.location = "/login";
        });
    }
});

function setOverlay(overlayOn) {
    let display = overlayOn ? "flex" : "none";
    $overlay.css("display", display);
}

function detachLogo() {
    let logo = $("#logo").detach();
    logo.appendTo("#logo-container");
    logo.css("display", "block");
}

function updateScoreProgressBar(score, numQuestions) {
    let scoreProgress = (score * 100.0) / numQuestions;

    if (scoreProgress > 100) {
        scoreProgress = 100;
    }

    $scoreProgressBar.css("width", `${ scoreProgress }%`);
}

function updateQuestionProgressBar(questionsFinished, numQuestions) {
    let questionProgress = (questionsFinished * 100.0) / numQuestions;

    if (questionProgress > 100) {
        questionProgress = 100;
    }
    $questionProgressBar.css("width", `${ questionProgress }%`);
}

function setupTTS(language) {
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[10]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10wd
    msg.pitch = 1; //0 to 2
    msg.lang = language;
}

function changeTTSLanguage(language) {
    msg.lang = language;
}

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