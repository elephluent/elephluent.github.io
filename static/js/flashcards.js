let flashcard;
let card;
let nextBtn;
let firstSelection;
let prevBtn;
let shuffleBtn;
let currSelection; // 0 for spanish first, 1 for english first
let currSide; // 0 for spanish, 1 for english
let flipSidePic;
let picUrl;
let seeSent;
let sent;
let $continue;
let soundButton;
// let translations;

let translations = {
  rojo: [
    "red",
    "Los zapatos son rojos.",
    "https://kindnessblogdotcom1.files.wordpress.com/2016/12/kck4z8xcj.png"
  ],
  blanco: [
    "white",
    "El papel es blanco.",
    "http://images.all-free-download.com/images/graphiclarge/blank_white_paper_cartoon_clip_art_12090.jpg"
  ],
  azul: [
    "blue",
    "El agua es azul.",
    "http://www.clker.com/cliparts/l/a/P/C/T/M/cup-of-blue-water-md.png"
  ],
  amarillo: [
    "yellow",
    "El sol es amarillo.",
    "http://www.clker.com/cliparts/s/y/s/q/h/R/cartoon-sun-hi.png"
  ],
  negro: [
    "black",
    "El gato es negro.",
    "https://i.pinimg.com/originals/0e/1e/8a/0e1e8ace2d78fe052f607aae724720e7.jpg"
  ]
};

let progress;
let progress_bar;
let setListKeyword;
let currIndex;
let currKeyword;
let originalLength;
let startOverBox;
let reviewButton;

$(document).ready(() => {
  flashcard = $("#flashcard");
  card = $("#card");
  nextBtn = $("#next");
  prevBtn = $("#previous");
  shuffleBtn = $("#shuffle");
  firstSelection = $("#first_selection");
  currSelection = 0;
  currSide = 0;
  flipSidePic = $("#card_pic");
  seeSent = $("#see_sent");
  sent = $("#sent");
  currIndex = 0;
  progress = $("#prog");
  progress_bar = $("#prog_bar");
  startOverBox = $("#overlay-box");
  $continue = $("#continue");
  reviewButton = $("#startOver");
  soundButton = $("#speech-button");

  detachLogo();

  let moduleName = "Colors";
  let language = "Spanish";

  originalLength = Object.keys(translations).length;

  setListKeyword = shuffleMap();

  setup();

  function setup() {
    setupTTS(getLanguageCode(language));
    progress_bar.attr("max", originalLength);

    updateProgress();
    displayCard();
  }

  // flip card
  flashcard.click(() => {
    flashcard.toggleClass("flipped");

    picUrl = translations[currKeyword][2];
    flipSidePic.attr("src", picUrl);
    if (currSide == currSelection) {
      flipSidePic.css("display", "block");
    } else {
      flipSidePic.css("display", "none");
    }
    // if foreign, flip to english
    if (currSide == 0) {
      changeTTSLanguage(getLanguageCode("English"));
      card.text(translations[currKeyword][0]);
      currSide = 1; // in case they want to flip back and forth on same card
    } else {
      // if english, flip to foreign
      changeTTSLanguage(getLanguageCode(language));
      card.text(currKeyword);
      currSide = 0;
    }
    sent.text("");
  });

  seeSent.click(() => {
    sent.text(translations[currKeyword][1]);
  });

  nextBtn.click(() => {
    if (!allCardsUsed()) {
      currSide = currSelection;

      if (currSide == 0) {
        changeTTSLanguage(getLanguageCode(language));
      } else {
        changeTTSLanguage(getLanguageCode("English"));
      }
      flipSidePic.css("display", "none");
      sent.text("");

      currIndex++;

      updateProgress();
      displayCard();
    }
  });

  prevBtn.click(() => {
    if (currIndex != 0) {
      flipSidePic.css("display", "none");
      currIndex--;
      updateProgress();
      displayCard();
    }
  });

  shuffleBtn.click(() => {
    flipSidePic.css("display", "none");
    currIndex = 0;
    updateProgress();
    setListKeyword = shuffleMap();
    displayCard();
  });

  firstSelection.on("change", function() {
    if ($(this).val() == "eng_first") {
      currSelection = 1;
    } else {
      currSelection = 0;
    }
    if (currSide != currSelection) {
      flashcard.click();
    } else {
      flipSidePic.css("display", "none");
    }
  });

  soundButton.click(() => {
    let word;
    if (currSide == 0) {
      //foreign first
      word = currKeyword;
    } else {
      word = translations[currKeyword][0];
    }
    speak(word);
  });

  $continue.on("click", function() {
    setOverlay(false);
    $continue.css("display", "none");

    currIndex = 0;
    updateProgress();
    setListKeyword = shuffleMap();
    displayCard();
  });
});

// left arrow	37
// up arrow	38
// right arrow	39
// down arrow	40
// space 13

$(document).keydown(function(e) {
  if (e.which == 37) {
    prevBtn.click();
  }

  if (e.which == 38 || e.which == 40) {
    flashcard.click();
  }

  if (e.which == 39) {
    nextBtn.click();
  }
});

function updateProgress() {
  progress.text(currIndex + " / " + originalLength);
  progress_bar.attr("value", currIndex);
}

function displayCard() {
  sent.text("");
  if (allCardsUsed()) {
    // print a message that all cards (all previous words) have been tested
    currIndex--;

    setTimeout(function() {
      setOverlay(true);
      $continue.css("display", "block");
      $continue.addClass("animated bounceIn");
    }, 250);
  } else {
    currKeyword = setListKeyword[currIndex];
    picUrl = translations[currKeyword][2];
    if (currSelection == 0) {
      // display a new card with foreign first
      card.text(currKeyword);
    } else {
      // display a new card with english first
      card.text(translations[currKeyword][0]);
    }

    if (translations[currKeyword][1] === "") {
      console.log("there is no sentence");
      seeSent.css("visibility", "hidden");
    } else {
      seeSent.css("visibility", "visible");
    }
  }
}

function shuffleMap() {
  let rand = [];
  let translationsCopy = $.extend({}, translations);

  while (Object.keys(translationsCopy).length > 0) {
    let index = Math.random() * Object.keys(translationsCopy).length;
    index = Math.floor(index);

    let indexTwo = Object.keys(translationsCopy)[index];

    delete translationsCopy[indexTwo];

    rand.push(indexTwo);
  }

  return rand;
}

function allCardsUsed() {
  return currIndex >= originalLength;
}
