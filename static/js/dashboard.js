let modules, lessons, continueButton;

const modulesData = {
    "Pronouns": {
        name: "Pronouns",
        image: "static/img/something.png",
        desc: "Uno, dos, tres, quatro",
        games: [
	        "PictureLearning",
	        "MatchingWordToWord",
            "MatchingWordToImage",
            "ReadTheSentence",
            "HideAndSeek",
            "FillInTheBlank"
        ]
    },
    "Family": {
        name: "Family",
        image: "static/img/something.png",
        desc: "Mi familia es bueno.",
        games: [
            "FillInTheBlank",
            "HideAndSeek",
            "MatchingWordToWord",
            "MatchingWordToImage",
            "PictureLearning",
            "ReadTheSentence"
        ]
    },
    "Phrases": {
        name: "Phrases",
        image: "static/img/something.png",
        desc: "El gato, el perro",
        games: [ "PictureLearning", "HideAndSeek" ]
    },
    "Colors": {
        name: "Colors",
        image: "static/img/something.png",
        desc: "Tacos y naranjas",
        games: [ 
            "PictureLearning",
            "MatchingWordToWord",
            "MatchingWordToImage",
            "ReadTheSentence",
            "HideAndSeek",
            "FillInTheBlank"
        ]
    }
};

let lastModule;

const MODULE_NAMES = [ "Colors", "Pronouns", "Family", "Phrases" ];

const moduleImages = {
    "Colors": "static/img/modules/colors.png",
    "Phrases": "static/img/modules/phrases.png",
    "Family": "static/img/modules/family.png",
    "Pronouns": "static/img/modules/pronouns.png"
};

const lessonImages = {
    "FillInTheBlank": "static/img/games/fill-in-the-blank.png",
    "PictureLearning": "static/img/games/picture-learning.png",
    "MatchingWordToImage": "static/img/games/match-words-pics.png",
    "MatchingWordToWord": "static/img/games/match-words.png",
    "HideAndSeek": "static/img/games/hide-and-seek.png",
    "ReadTheSentence": "static/img/games/read-the-sentence.png"
};

const lessonDisplayInfo = {
    "PictureLearning": {
        title: "Picture Learning",
        url: "picture-learning.html"
    },
    "MatchingWordToWord": {
        title: "Matching Word to Word",
        url: "match-words.html"
    },
    "MatchingWordToImage": {
        title: "Matching Word to Image",
        url: "match-words-pics.html"
    },
    "ReadTheSentence": {
        title: "Read the Sentence",
        url: "read-the-sentence.html"
    },
    "FillInTheBlank": {
        title: "Fill In the Blank",
        url: "fill-in-the-blank.html"
    },
    "HideAndSeek": {
        title: "Hide and Seek",
        url: "hide-and-seek.html"
    },
};

const GREETINGS = {
    "Spanish": "¡Bienvenido!",
    "Chinese": "欢迎!",
    "Japanese": "ようこそ!",
    "Russian": "Добро пожаловать!",
};

$(document).ready(() => {
    detachLogo();
    modules = $("#modules");
    lessons = $("#lessons");
    continueButton = $("#continue");
    overlay = $("#overlay");
    lastModule = $("#last-module");

    // $( window ).on("resize", function() {
    //     if ($( window ).width() <= 628) {
    //         let greetingElement = $("#greeting-container").detach();
    //         greetingElement.prependTo(".left");
    //     }
    // }).resize();

    let account = $("#account").detach();
    account.appendTo("#header");

    let logout = $("#logout");
    logout.click((evt) => {
        window.localStorage.removeItem("profile");
        window.sessionStorage.removeItem("moduleName");
        window.location = "/";
    });
    logout.css("border", "0");

    // profile = JSON.parse(window.localStorage.getItem("profile"));

    if (profile) {
        if (GREETINGS.hasOwnProperty(profile.preferredLanguage)) {
            $("#greeting").text(GREETINGS[profile.preferredLanguage]);
        }
    }

    // if(!window.sessionStorage.getItem("new_session")) {
    //   window.sessionStorage.setItem("new_session", "true");
    //   let req = {
    //     key   : "username",
    //     val   : profile.username
    //   }
    //   $.post("/user/get-user", req, responseJSON => {
    //     let updatedProfile = JSON.parse(responseJSON);

    //     if(updatedProfile.error) {
    //       console.log("ERROR");
    //       setupPage();
    //     }
    //     else {
    //       window.localStorage.setItem("profile", JSON.stringify(updatedProfile));
    //       profile = updatedProfile;

    //       setupPage();
    //     }
    //   });
    // }
    // else {
    //   setupPage();
    // }
    setupPage();
    function setupPage() {
      let moduleName = profile.preferredProgress[0];
      let language = profile.preferredLanguage;

      // $.post("/module/get-module-metadata", responseJSON => {
          // modulesData = JSON.parse(responseJSON);

          displayModules(modulesData);
          let m = modulesData[moduleName];
          if (m) {
              lastModule.append(`<div class="text"><h2>Your Next Module</h2></div>`);
              lastModule.append(getModuleHtml(m));
              $(`#${m.name}`).click((evt) => {
                  displayLessons(m.games);
                  window.sessionStorage.setItem("moduleName", m.name);
              });
          } else {
              lastModule.append(`Welcome back!`);
          }
      // });
      overlay.click((evt) => {
          setOverlay(false);
      });

      $("#overlay-box").click((evt) => {
          evt.stopPropagation();
      });
    }
});

function displayLessons(lessonsData, isPastModule) {
    let markedModules = profile.preferredProgress.slice(1);
    setOverlay(true);
    lessons.html('');
    for (let i = 0; i < lessonsData.length; i++) {
        let lesson = lessonsData[i];
        let lessonInfo = lessonDisplayInfo[lesson];

        lessons.append(`
            <div class="lesson scale-up" id="${lesson}">
                <a href="${lessonInfo.url}"><img src="${lessonImages[lesson]}" alt="${lessonInfo.title}"></a>
            </div>
        `);
        if (isPastModule || markedModules.indexOf(lesson) !== -1) {
            $(`#${ lesson }`).append(`
                <div class="check">
                    <i class="fas fa-check-circle"></i>
                </div>
            `);
            // $(`#${ lesson }`).addClass("completed");
        }
    }
}

let moduleCount = 0;

/**
 * Adds a list of modules to the dashboard page.
 * @param modulesData - list of objects with a name, image, and description
 */
function displayModules(modulesData) {
    let markedModule = profile.preferredProgress[0];
    let foundMarkedModule = false;

    for (let i = 0; i < MODULE_NAMES.length; i++) {
        let moduleName = MODULE_NAMES[i];

        if (modulesData.hasOwnProperty(moduleName)) {
            let module = modulesData[moduleName];
            modules.append(getModuleHtml(module));

            let $newModule = $(`#${module.name}`);
            if (foundMarkedModule) {
                $newModule.removeClass("scale-up");
                $newModule.addClass("locked");
            } else {
                $newModule.click((evt) => {
                    displayLessons(module.games, MODULE_NAMES.indexOf(moduleName) < MODULE_NAMES.indexOf(profile.preferredProgress[0]));
                    window.sessionStorage.setItem("moduleName", module.name);
                    console.log(window.sessionStorage.getItem("moduleName"));
                });
            }

            if (moduleName === markedModule) {
                foundMarkedModule = true;
            }
        }
    }
}

function getModuleHtml(module) {
    if (moduleImages[module.name]) {
        return `<div class="module scale-up" id="${module.name}">
                    <img class="module-img" src="${moduleImages[module.name]}" alt="${module.name}">
                </div>`;
    } else {
        return `<div class="module scale-up">
                    <h2 id="${module.name}" class="module-name"><a href="#">${module.name}</a></h2>
                    <p>${module.desc}</p>
                    <img src="${module.image}" alt="${module.name}">
                </div>`;
    }
}
