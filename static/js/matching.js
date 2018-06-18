let box00;
let box01;
let box02;
let box03;
let box10;
let box11;
let box12;
let box13;
let box20;
let box21;
let box22;
let box23;

let $continue;

let board;

let firstChoice, secondChoice;
let firstClicked = false, secondClicked = false;

let counter = 0;

// let translations;
let keywords;

let numWrong = 0;
let numSent = 6;

let wrongWords = [];

const d = new Date();
let startTime, endTime, totalTime;
let translations
= {'rojo': 'red', 'azul': 'blue', 'maron': 'brown', 'morado': 'purple',
    'verde': 'green', 'amarillo': 'yellow', 'arananjado': 'orange', 'negro': 'black'};

const DEFAULT_COLOR = "white";
const CORRECT_COLOR = "#49ad8c";

const HOME_URL = "index.html";

$(document).ready(() => {
    startTime = d.getTime();
    // let profile = JSON.parse(window.localStorage.getItem("profile"));

    let moduleName = //window.sessionStorage.getItem("moduleName");// || "Colors";// || 
    "Colors";
    let language = //profile.preferredLanguage;// || 
    "Spanish";

    // if (!moduleName || !language) {
    //     alert("Please login first");
    // } else {
    //     let req = {
    //         moduleName: moduleName,
    //         language: language,
    //         lessonType: "MatchingWordToWord"
    //     };
    //     $.post("/module/lesson/get-lesson", req, responseJSON => {
    //         translations = JSON.parse(responseJSON);
            keywords = $.extend({}, translations);
            keywords = Object.keys(keywords);

            numSent = Object.keys(translations).length;

            $("#module-name").text(moduleName);
            board = $("#board");
            displayCards();
            assignCards();
        // });
        $continue = $("#continue");
    // }

    $("#continue-button").on("click", function(event) {
      // if(moduleName === profile.preferredProgress[0]) {
      //     let formattedScore = Math.ceil(((numSent - numWrong) / numSent) * 100);
      //     let formattedWrong = formatWrong(wrongWords);
      //     console.log(formattedWrong);
      //     updateEmail(profile.username, moduleName, "Matching: Word to Word", formattedScore, formattedWrong, totalTime);
      //   updateProgress("MatchingWordToWord", profile, HOME_URL);
      // }
      // else {
        location.href=HOME_URL;
      // }
    });
            // $.post(url, postParameters, responseJSON => {
    //     const responseObject = JSON.parse(responseJSON);
    //     translations = responseObject.translations;
    // });
});

function updateAfterClick(box) {
    if (firstChoice === box) {
        setCardToDefault(firstChoice);
        firstChoice = null;
    } else if (secondChoice === box) {
        setCardToDefault(secondChoice);
        secondChoice = null;
    } else {
        if (!firstChoice) {
            firstChoice = box;
            setCardToCorrect(firstChoice);
        } else {
            if (!secondChoice) {
                secondChoice = box;
                setCardToCorrect(secondChoice);
                twoClicked();
            } else {
                setCardToDefault(firstChoice);
                setCardToDefault(secondChoice);
                firstChoice = box;
                secondChoice = null;
                setCardToCorrect(firstChoice, true);
            }
        }
    }
}

function setCardToDefault(card) {
    card.css("background-color", DEFAULT_COLOR);
    card.css("color", "black");
    card.css("border-bottom", `8px solid ${ CORRECT_COLOR }`);
}

function setCardToCorrect(card) {
    card.css("background-color", CORRECT_COLOR);
    card.css("color", "white");
    card.css("border", "0");
}

function assignCards() {
  box00 = $("#box00");
  box01 = $("#box01");
  box02 = $("#box02");
  box03 = $("#box03");
  box10 = $("#box10");
  box11 = $("#box11");
  box12 = $("#box12");
  box13 = $("#box13");
  box20 = $("#box20");
  box21 = $("#box21");
  box22 = $("#box22");
  box23 = $("#box23");

  box00.on("click", () => {
    updateAfterClick(box00);
  });

  box01.click(() => {
    updateAfterClick(box01);
  });

  box02.click(() => {
      updateAfterClick(box02);
  });

  box03.click(() => {
      updateAfterClick(box03);
  });

  box10.click(() => {
      updateAfterClick(box10);
  });

  box11.click(() => {
      updateAfterClick(box11);
  });

  box12.click(() => {
      updateAfterClick(box12);
  });

  box13.click(() => {
      updateAfterClick(box13);
  });

  box20.click(() => {
      updateAfterClick(box20);
  });

  box21.click(() => {
      updateAfterClick(box21);
  });

  box22.click(() => {
      updateAfterClick(box22);
  });

  box23.click(() => {
      updateAfterClick(box23);
  });
}

function pickRandSix() {
    let rand = [];
    let translationsCopy = $.extend({}, translations);

    for (let i = 0; i < 6; i++) {
        let index = Math.random() * Object.keys(translationsCopy).length;
        index = Math.floor(index);

        let indexTwo = Object.keys(translationsCopy)[index];
        let temp = translationsCopy[indexTwo];

        delete translationsCopy[indexTwo];

        rand.push(temp);
        rand.push(indexTwo);
    }

    return rand;
}

function shuffleArray(arr) {
    let newArr = [];
    while (Object.keys(arr).length > 0) {
        let ind = Math.floor(Math.random() * Object.keys(arr).length);

        newArr.push(arr[ind]);
        arr.splice(ind, 1);
    }

    return newArr;
}

function displayCards() {

    let cardData = shuffleArray(pickRandSix());

    board.append(
        `<div class="grid-item box scale-up" id="box00">${cardData[0]}</div>
        <div class="grid-item box scale-up" id="box01" >${cardData[1]}</div>
        <div class="grid-item box scale-up" id="box02" >${cardData[2]}</div>
        <div class="grid-item box scale-up" id="box03" >${cardData[3]}</div>
        <div class="grid-item box scale-up" id="box10">${cardData[4]}</div>
        <div class="grid-item box scale-up" id="box11" >${cardData[5]}</div>
        <div class="grid-item box scale-up" id="box12" >${cardData[6]}</div>
        <div class="grid-item box scale-up" id="box13" >${cardData[7]}</div>
        <div class="grid-item box scale-up" id="box20">${cardData[8]}</div>
        <div class="grid-item box scale-up" id="box21" >${cardData[9]}</div>
        <div class="grid-item box scale-up" id="box22" >${cardData[10]}</div>
        <div class="grid-item box scale-up" id="box23" >${cardData[11]}</div>`);

}

function gameOver() {
    return counter === 6;
}

function twoClicked() {
    if (validatePair()) {
        counter ++;

        firstChoice.addClass('animated flipOutX').one("animationend webkitAnimationEnd oanimationend", function() {
            $(this).css("visibility", "hidden");
        });
        secondChoice.addClass('animated flipOutX').one("animationend webkitAnimationEnd oanimationend", function() {
            $(this).css("visibility", "hidden");
        });

        // check if game is over
        if (gameOver()) {
            console.log(wrongWords);
            console.log(formatWrong(wrongWords));
            let d2 = new Date();
            endTime = d2.getTime();
            totalTime = (endTime - startTime) / 1000;

            setTimeout(function() {
                setOverlay(true);
                $continue.css("display", "block");
                $continue.addClass("animated bounceIn");

            }, 500);
            console.log(formatWrong(wrongWords));
        }
    } else {
        var delayInMilliseconds = 500; //1 second

        firstChoice.addClass('animated shake').one("animationend webkitAnimationEnd oanimationend", function() {
            $(this).removeClass("animated shake");
        });
        secondChoice.addClass('animated shake').one("animationend webkitAnimationEnd oAnimationEnd", function() {
            $(this).removeClass("animated shake");
        });

        setTimeout(function() {
            //your code to be executed after 1 second
            setCardToDefault(firstChoice);
            setCardToDefault(secondChoice);

            firstChoice = null;
            secondChoice = null;
        }, delayInMilliseconds);

        console.log(cont("FIRST: " + firstChoice.text()));
        console.log(cont(secondChoice.text()));

        if(cont(firstChoice.text())) {
            if (!cont2(firstChoice.text(), wrongWords)) {
                wrongWords.push(firstChoice.text());
                numWrong++;
            }
        } else if (cont(secondChoice.text())) {
            if (!cont2(secondChoice.text(), wrongWords)) {
                wrongWords.push(secondChoice.text());
                numWrong++;
            }
        }

    }
}

function validatePair() {
    let word1 = firstChoice.text();
    let word2 = secondChoice.text();

    if (translations[word1]) {
        return translations[word1] === word2;
    } else if (translations[word2]) {
        return translations[word2] === word1;
    } else {
        console.log("something went wrong.");
    }
}

function cont(w) {
    for (let i = 0; i < Object.keys(keywords).length; i++) {
        console.log(keywords[i]);
        console.log(w);
        console.log(keywords[i] == w);

        if (keywords[i] == w) {
            return true;
        }
    }
    return false;
}

function cont2(w) {
    console.log("IN CONT 2");
    console.log(wrongWords);
    for (let i = 0; i < Object.keys(wrongWords).length; i++) {
        console.log(wrongWords[i]);
        console.log(w);
        console.log(wrongWords[i] == w);

        if (wrongWords[i] == w) {
            return true;
        }
    }
    return false;
}