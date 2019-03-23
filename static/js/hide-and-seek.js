let overlay, info;
let startButton, aboutButton, backButton;

// let spritesToAdd, bg, objects;
let spritesToAdd = {
  bg: {
    image: "static/img/night_room.jpg",
    position: { x: 0, y: -50 }
  },
  objects: {
    maracas: {
      name: "maracas",
      image: "static/img/rsz_maracas.png",
      isCorrect: true,
      position: { x: 300, y: 510 },
      scale: 0.25,
      rotation: 0.5,
      saturation: -0.9,
      clickText: "You found the maracas!",
      desc: "Maracas are an instrument that make noise when you shake them!"
    },
    macaroni: {
      name: "macaroni",
      image: "static/img/rsz_bowl-of-macaroni.png",
      isCorrect: false,
      position: { x: 600, y: 500 },
      scale: 0.9,
      brightness: 0.75,
      clickText: "Sorry, those weren't the maracas, it was a bowl of macaroni.",
      desc: "Macaroni is a a type of pasta, not an instrument."
    },
    pins: {
      name: "pins",
      image: "static/img/bowling_pins.png",
      isCorrect: false,
      position: { x: 750, y: 285 },
      scale: 0.4,
      brightness: 0.75,
      saturation: -0.9,
      clickText: "Sorry, those were bowling pins, not maracas.",
      desc: "While they look similar, those were bowling pins, not maracas."
    }
  }
};
let correctObject = spritesToAdd.objects.maracas;

let bgSprite;

const colorMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

let light;

// let correctObject;

$(document).ready(() => {
  overlay = $("#overlay");
  info = $("#info");

  //Aliases
  let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

  //Create a Pixi Application
  let app = new Application({ width: 900, height: 600 });
  let stage = (app.stage = new PIXI.display.Stage());

  light = new PIXI.lights.PointLight(0xffffff, 1);

  //Add the canvas that Pixi automatically created for you to the HTML document
  $("main").append(app.view);

  // put all layers for deferred rendering of normals
  stage.addChild(new PIXI.display.Layer(PIXI.lights.diffuseGroup));
  stage.addChild(new PIXI.display.Layer(PIXI.lights.normalGroup));
  stage.addChild(new PIXI.display.Layer(PIXI.lights.lightGroup));

  bg = spritesToAdd.bg;
  objects = spritesToAdd.objects;

  let images = [bg.image];
  for (let objName in objects) {
    if (
      objects.hasOwnProperty(objName) &&
      objects[objName].hasOwnProperty("image")
    ) {
      images.push(objects[objName].image);
    }
  }

  loader
    .add(images)
    // .add("diffuse", "static/img/nature.png")
    .add("normal", "static/img/NormalMap.png")
    .load(setup);

  function setup() {
    // add the background image
    addSpriteFromObject(bg, true);

    light.position.set(525, 160);

    stage.addChild(new PIXI.lights.AmbientLight(null, 0.2));
    stage.addChild(light);

    // add all objects' properties and place them on the screen
    for (let objName in objects) {
      if (objects.hasOwnProperty(objName)) {
        addSpriteFromObject(objects[objName]);
      }
    }
    stage.addChild(light);
  }
  function createPair(diffuseTex, normalTex) {
    let container = new PIXI.Container();
    let diffuseSprite = new PIXI.Sprite(diffuseTex);
    diffuseSprite.parentGroup = PIXI.lights.diffuseGroup;
    let normalSprite = new PIXI.Sprite(normalTex);
    normalSprite.parentGroup = PIXI.lights.normalGroup;
    container.addChild(diffuseSprite);
    container.addChild(normalSprite);
    return container;
  }
  function addSpriteFromObject(object, isBg) {
    // sprite that gets displayed on screen
    let sprite = createPair(
      resources[object.image].texture,
      resources["normal"].texture
    );

    if (isBg) {
      bgSprite = sprite;
    }

    // set
    sprite.position.set(object.position.x, object.position.y);
    if (object.hasOwnProperty("scale")) {
      sprite.scale.set(object.scale, object.scale);
    }

    if (object.hasOwnProperty("rotation")) {
      sprite.rotation = object.rotation;
    }
    // add optional saturation and brightness
    sprite.filters = [];
    if (object.hasOwnProperty("saturation")) {
      let saturationFilter = new PIXI.filters.ColorMatrixFilter();
      saturationFilter.matrix = colorMatrix;
      sprite.filters = [saturationFilter];

      saturationFilter.saturate(object.saturation, false);
    }
    if (object.hasOwnProperty("brightness")) {
      let brightnessFilter = new PIXI.filters.ColorMatrixFilter();
      brightnessFilter.matrix = colorMatrix;
      sprite.filters = [brightnessFilter];

      brightnessFilter.brightness(object.brightness, false);
    }

    if (
      object.hasOwnProperty("clickText") &&
      object.hasOwnProperty("isCorrect")
    ) {
      // add onclick event
      displayInstructions();
      sprite.interactive = true;
      sprite.buttonMode = true;
      sprite.on("pointerdown", () => {
        displayClickedObject(object);
      });
    }

    // add sprite to the screen
    stage.addChild(sprite);
  }
});

function setOverlayVisibility(value) {
  if (value) {
    overlay.css("display", "flex");
  } else {
    overlay.css("display", "none");
  }
}

function displayInstructions() {
  info.html("");
  info.html(`
        <h3>Eliie can't find her ${correctObject.name}.</h3>
        <h1>Can you help her find them?</h1>
        <div id="buttons">
            <button id="start" class="button">Of course!</button>
            <button id="about" class="button secondary">What's that?</button>
        </div>
    `);
  startButton = $("#start");
  aboutButton = $("#about");
  startButton.click(event => {
    setOverlayVisibility(false);
    bgSprite.interactive = true;
    bgSprite.on("mousemove", function(event) {
      light.position.copy(event.data.global);
    });
  });

  aboutButton.click(event => {
    displayObjectInfo();
  });
}

function displayObjectInfo() {
  info.html("");
  info.append(`
        <h1>${correctObject.name}</h1>
        <img src="${correctObject.image}" alt="${
    correctObject.name
  }" class="scale-up">
        <p>${correctObject.desc}</p>
        <button id="back" class="button">Back</a>
    `);
  backButton = $("#back");
  backButton.click(event => {
    displayInstructions();
  });
}

/**
 * Displays an overlay with text telling the user whether they clicked
 * the correct object.
 * @param clicked - clicked object to display information about
 */
function displayClickedObject(clicked) {
  setOverlayVisibility(true);
  info.html("");

  // if the clicked object was correct, display the button, otherwise don't
  let nextButton = clicked.isCorrect
    ? '<a id="next" class="button btn-outline">Next</a>'
    : '<button onclick="setOverlayVisibility(false)" class="button">Back</button>';
  info.append(`
        <h1>${clicked.clickText}</h1>
        <img src="${clicked.image}" alt="${correctObject.name}">
        ${nextButton}
    `);

  $("#next").on("click", function() {
    location.href = "index.html";
  });
}
