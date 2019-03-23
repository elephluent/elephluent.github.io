let option1;
let option2;
let option3;
let option4;
let c1;
let c2;
let c3;
let c4;
let correctOptionSelected;
let sent;
let nextBtn;
let continueButton;
let keywords;
let index;
let numSent;
let currOption;
let sent_pic;

let $continue;

let startTime, endTime, totalTime;
let d = new Date();

let wrongWords = [];
let numWrong = 0;

let fitbMap = {
  negro: [
    "El gato es ",
    "",
    "negro",
    "azul",
    "verde",
    "rojo",
    "https://i.pinimg.com/originals/0e/1e/8a/0e1e8ace2d78fe052f607aae724720e7.jpg"
  ],
  rojo: [
    "Los zapatos son ",
    "",
    "negro",
    "morado",
    "maron",
    "rojo",
    "https://kindnessblogdotcom1.files.wordpress.com/2016/12/kck4z8xcj.png"
  ],
  verde: [
    "El césped es ",
    "",
    "azul",
    "rosa",
    "gris",
    "verde",
    "https://clipart.info/images/ccovers/1520611248grass-png-cartoon.png"
  ],
  azul: [
    "El cielo es ",
    "",
    "azul",
    "rosa",
    "maron",
    "naranja",
    "http://backgroundcheckall.com/wp-content/uploads/2017/12/cartoon-sky-background-.jpg"
  ],
  gris: [
    "La ardilla es",
    "",
    "gris",
    "azul",
    "rosa",
    "naranja",
    "http://www.clker.com/cliparts/m/m/K/N/C/K/grey-squirrel-hi.png"
  ]
};

const correctSvg = "<div><i class='fas fa-check'></i></div>";
const wrongSvg = '<div><i class="fas fa-times"></i></div>';

$(document).ready(() => {
  startTime = d.getTime();

  let moduleName = "Colors";
  let language = "Spanish";
  $("#module-name").text(moduleName);

  initializeVars();
  setupTTS(getLanguageCode(language));

  displaySentence();

  nextBtn.click(() => {
    // still more sentences to be filled in
    if (index < numSent) {
      index++;
      if (correctOptionSelected) {
        currOption.css("box-shadow", "none");
        correctOptionSelected = false;
        displaySentence();
      }
    } else {
      // all sentences have been filled in (game over)
      let d2 = new Date();
      endTime = d2.getTime();
      totalTime = (endTime - startTime) / 1000;
      nextBtn.css("visibility", "hidden");
      setOverlay(true);
      $continue.css("display", "block");
      $continue.addClass("animated bounceIn");
    }
  });

  option1.click(() => {
    optionClicked(option1, c1);
  });

  option2.click(() => {
    optionClicked(option2, c2);
  });

  option3.click(() => {
    optionClicked(option3, c3);
  });

  option4.click(() => {
    optionClicked(option4, c4);
  });

  $("#startOver").on("click", function() {
    location.href = "index.html";
  });
});

/**
 * Function that initializes HTML references and JS variables
 */
function initializeVars() {
  // HTML divs for each possible answer.
  option1 = $("#option-1");
  option2 = $("#option-2");
  option3 = $("#option-3");
  option4 = $("#option-4");

  // HTML h3's for text of each possible answer.
  c1 = $("#choice1");
  c2 = $("#choice2");
  c3 = $("#choice3");
  c4 = $("#choice4");

  correctOptionSelected = false;

  // sentence that will be displayed first with a blank
  // then filled in once correct answer is selected
  sent = $("#sentence");
  sent_pic = $("#sent_pic");

  // button that will appear once correct answer is selected
  nextBtn = $("#nextBtn");

  // button that will appear once all sentences have been filled in
  $continue = $("#continue");
  keywords = shuffleMap();

  index = 0;
  numSent = Object.keys(fitbMap).length - 1; // adjust for off by one
}

/**
 * Shuffles keywords
 * @returns {Array} shuffled array of keywords
 */
function shuffleMap() {
  let rand = [];
  // copy of fitbMap to avoid pointer problems
  let mapCopy = $.extend({}, fitbMap);

  while (Object.keys(mapCopy).length > 0) {
    let index = Math.random() * Object.keys(mapCopy).length;
    index = Math.floor(index);

    let indexTwo = Object.keys(mapCopy)[index];

    delete mapCopy[indexTwo];

    rand.push(indexTwo);
  }
  return rand;
}

/**
 * Displays sentence with blank.
 */
function displaySentence() {
  sent_pic.attr("src", fitbMap[keywords[index]][6]);
  sent.text(
    fitbMap[keywords[index]][0] + "________" + fitbMap[keywords[index]][1]
  );

  // fills h3 values for each possible answer
  let options = [];

  for (let i = 2; i < 6; i++) {
    let optionNum = i - 1;
    let word = fitbMap[keywords[index]][i];
    $(`#choice${optionNum}`).text(word);
    if (colors.hasOwnProperty(word)) {
      $(`#option-${optionNum}`).css("background-color", `${colors[word]}`);
    }
  }
  c1.text(options[0]);

  c2.text(fitbMap[keywords[index]][3]);
  c3.text(fitbMap[keywords[index]][4]);
  c4.text(fitbMap[keywords[index]][5]);

  // hides next button until correct answer is selected
  nextBtn.css("visibility", "hidden");
}

let selectedOptions = [];

/**
 * Handles when an option is clicked
 *
 * @param option div that was clicked
 * @param choice h3 associated with div that was clicked
 */
function optionClicked(option, choice) {
  // saves current option to adjust shadow later
  currOption = option;

  // if correct option has not been selected yet and option was not previously clicked
  if (!correctOptionSelected && selectedOptions.indexOf(choice.text()) === -1) {
    selectedOptions.push(choice.text());
    // update if correct answer is selected
    if (choice.text() === keywords[index]) {
      // indicate correct with check and shadow
      choice.append(correctSvg);
      option.css("box-shadow", `0 0 50px ${option.css("background-color")}`);

      // make next button visible
      nextBtn.css("visibility", "visible");

      // fill blank with correct word
      sent.text(
        fitbMap[keywords[index]][0] +
          " " +
          keywords[index] +
          " " +
          fitbMap[keywords[index]][1]
      );

      correctOptionSelected = true;

      // reset selected options
      selectedOptions = [];
      speak(sent.text());
    } else {
      if (!cont2(choice.text())) {
        wrongWords.push(choice.text());
        numWrong++;
      }
      // indicate incorrect selection with X
      choice.append(wrongSvg);
    }
  }
}

/**
 * Continue button visible once all sentences filled out
 */
function enableContinueButton() {
  continueButton.css("display", "block");
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
