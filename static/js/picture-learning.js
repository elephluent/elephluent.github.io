let options, newWord, questionProgressBar, scoreProgressBar;
    // , option1, option2, option3, option4;
let continueButton, finishButton;

let optionSelected = false;

let score = 0;
let gameData, questions;

let startTime, endTime, totalTime;
let d = new Date();
let wrongWords = [];
let numSent = 0;
let numWrong = 0;

function setContinueButton(buttonOn) {
    if (buttonOn) {
        continueButton.css("display", "block");
        continueButton.unbind().click((evt) => {
            questionCounter++;
            if (questionCounter < questions.length) {
                displayQuestion(questionCounter);
            }
            // remove the continue button for the next game
            setContinueButton(false);
            // reset the tracker for whether an option was selected
            optionSelected = false;
        });
    } else {
        continueButton.css("display", "none");
    }
}

function setFinishButton(buttonOn) {
    if (buttonOn) {
        finishButton.css("display", "block");
    } else {
        finishButton.css("display", "none");
    }
}

const NUM_OPTIONS = 4;

const correctSvg = "<div><i class='fas fa-check correct'></i></div>";
const wrongSvg = "<div><i class='fas fa-times wrong'></i></div>";
let questionCounter = 0;

$(document).ready(() => {
    startTime = d.getTime();
    // let profile = JSON.parse(window.localStorage.getItem("profile"));

    let moduleName = //window.sessionStorage.getItem("moduleName");// || 
    "Colors";
    let language = //profile.preferredLanguage || window.sessionStorage.getItem("language");// || 
    "Spanish";
    // let language = window.sessionStorage.getItem("language");// || "Spanish";

    // if (!moduleName || !language) {
    //     alert("No data");
    // } else {
    //     let req = {
    //         moduleName: moduleName,
    //         language: language,
    //         lessonType: "PictureLearning"
    //     };

    //     $.post("/module/lesson/get-lesson", req, responseJSON => {
        	// gameData = JSON.parse(responseJSON);
            gameData = {
    "questions": [
        {
            "word": "yellow",
            "translation": "amarillo",
            "otherChoices": [
                "rosa",
                "azul",
                "naranja"
            ]
        },
        {
            "word": "black",
            "translation": "negro",
            "otherChoices": [
                "amarillo",
                "rosa",
                "azul"
            ]
        },
        {
            "word": "red",
            "translation": "rojo",
            "otherChoices": [
                "negro",
                "amarillo",
                "rosa"
            ]
        },
        {
            "word": "purple",
            "translation": "morado",
            "otherChoices": [
                "rojo",
                "negro",
                "amarillo"
            ]
        },
        {
            "word": "white",
            "translation": "blanco",
            "otherChoices": [
                "morado",
                "rojo",
                "negro"
            ]
        },
        {
            "word": "grey",
            "translation": "gris",
            "otherChoices": [
                "blanco",
                "morado",
                "rojo"
            ]
        },
        {
            "word": "green",
            "translation": "verde",
            "otherChoices": [
                "gris",
                "blanco",
                "morado"
            ]
        },
        {
            "word": "orange",
            "translation": "naranja",
            "otherChoices": [
                "verde",
                "gris",
                "blanco"
            ]
        },
        {
            "word": "blue",
            "translation": "azul",
            "otherChoices": [
                "naranja",
                "verde",
                "gris"
            ]
        },
        {
            "word": "pink",
            "translation": "rosa",
            "otherChoices": [
                "azul",
                "naranja",
                "verde"
            ]
        }
    ],
    "images": {
        "negro": "https://i.pinimg.com/originals/0e/1e/8a/0e1e8ace2d78fe052f607aae724720e7.jpg",
        "amarillo": "http://www.clker.com/cliparts/s/y/s/q/h/R/cartoon-sun-hi.png",
        "naranja": "https://t3.ftcdn.net/jpg/01/76/03/54/240_F_176035457_jjkqIzzZR2zJHDFD4y8xAxucKww2758h.jpg",
        "gris": "http://www.clker.com/cliparts/m/m/K/N/C/K/grey-squirrel-hi.png",
        "rojo": "https://kindnessblogdotcom1.files.wordpress.com/2016/12/kck4z8xcj.png",
        "blanco": "http://images.all-free-download.com/images/graphiclarge/blank_white_paper_cartoon_clip_art_12090.jpg",
        "verde": "https://clipart.info/images/ccovers/1520611248grass-png-cartoon.png",
        "morado": "http://www.clker.com/cliparts/3/7/d/9/1331673181131731361Purple%20Cartoon%20Octopus.svg.med.png",
        "azul": "http://www.clker.com/cliparts/l/a/P/C/T/M/cup-of-blue-water-md.png",
        "rosa": "http://www.clker.com/cliparts/C/H/o/A/i/k/pink-shirt-hi.png"
    }
};
            questions = gameData.questions;
            numSent = Object.keys(questions).length;

            options = $("#options");
            newWord = $("#new-word");
            continueButton = $("#continue");
            finishButton = $("#finish");
            questionProgressBar = $("#question-progress");
            scoreProgressBar = $("#score-progress");
            $("#module-name").text(moduleName);

            setupTTS(getLanguageCode(language));
            displayQuestion(questionCounter);
    //     });
    // }

    $("#start-over-button").on("click", function() {
        setOverlay(false);
        $("#redo").css('display', 'none');
       window.location = "picture-learning.html";
    });

    $("#continue-button").on("click", function() {
        let d2 = new Date();
        endTime = d2.getTime();
        totalTime = (endTime - startTime) / 1000;

        // Update user progress if the current module is the same as the
        // module the profile is currently working on
        // if(moduleName === profile.preferredProgress[0]) {
        //     let formattedScore = Math.ceil(((numSent - numWrong) / numSent) * 100);
        //     let formattedWrong = formatWrong(wrongWords);
        //     updateEmail(profile.username, moduleName, "Picture Learning", formattedScore, formattedWrong, totalTime);
        //     updateProgress("PictureLearning", profile, "index.html");
        // }
        // else {
          location.href='index.html';
        // }
    });
});

/**
 * Displays the question at the given index.
 * @param index - index of the question to display
 */
function displayQuestion(index) {
    let firstSeen = true;
    let question = questions[index];
    newWord.html('');
    newWord.append(`<h1>${question.word}</h1>`);

    // generate a random place for the correct word
    let correctIndex = Math.floor(Math.random() * NUM_OPTIONS);

    question.otherChoices.splice(correctIndex, 0, question.translation);
    let choices = question.otherChoices;
    options.html('');

    for (let i = 0; i < choices.length; i++) {
        let otherChoice = choices[i];
        options.append(`
            <div class="option box scale-up" id="option-${i}">
                <h3 class="word">${otherChoice}</h3>
                <img src="${gameData.images[otherChoice]}" alt="${otherChoice}">
            </div>
        `);
        let option = $(`#option-${i}`);
        if (colors.hasOwnProperty(otherChoice)) {
            option.css("border-bottom", `15px solid ${ colors[otherChoice] }`);
        }
        option.click(() => {
            if (!optionSelected) {
                if (i === correctIndex) {
                    option.append(correctSvg);
                    score++;
                } else {
                    if (firstSeen) {
                        wrongWords.push(choices[correctIndex]);
                        numWrong++;
                        option.append(wrongSvg);
                        firstSeen = false;
                    }
                }
                //
                optionSelected = true;
                let correctOption = $(`#option-${correctIndex}`);

                correctOption.css("border", `5px solid #65BF3B`);
                correctOption.css("box-shadow", `0 0 20px #65BF3B`);
                correctOption.css("transition", `transform 0.4s`);
                correctOption.css("transform", `scale(1.05)`);

                speak(correctOption.text());

                updateQuestionProgressBar(questionCounter + 1, questions.length);
                updateScoreProgressBar(score, questions.length);

                if (questionCounter >= questions.length - 1) {
                    if (((numSent - numWrong) / numSent) < 0.5) {
                        setOverlay(true);
                        $("#continue-overlay").css('display', 'none');
                        $("#redo").css('display', 'block');
                        $("#redo").addClass("animated bounceIn");
                    } else {
                        setOverlay(true);
                        $("#redo").css('display', 'none');
                        $("#continue-overlay").css('display', 'block');
                        $("#continue-overlay").addClass("animated bounceIn");
                    }
                    // setFinishButton(true);

                } else {
                    setContinueButton(true);
                }
            }
        });
    }
}
