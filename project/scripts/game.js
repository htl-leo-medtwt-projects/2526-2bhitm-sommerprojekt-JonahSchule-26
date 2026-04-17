/* --------------------------
    Global Variables
-------------------------- */

const SCREEN = [
  [
    document.getElementById("hub"),
    document.getElementById("hub-image"),
    document.getElementById("player-box"),
    document.getElementById("goToGarage-button"),
    document.getElementById("live1"),
    document.getElementById("live2"),
    document.getElementById("live3"),
    document.getElementById("garage-power"),
    document.getElementById("power-text"),
    document.getElementById("power-bar"),
    document.getElementById("power-fill"),
  ],
  [
    document.getElementById("garage"),
    document.getElementById("upgrade-grid"),
    document.getElementById("motor"),
    document.getElementById("motor-upgrade-text-box"),
    document.getElementById("grip"),
    document.getElementById("grip-upgrade-text-box"),
    document.getElementById("transmisson"),
    document.getElementById("transmission-upgrade-text-box"),
    document.getElementById("img-of-kart"),
    document.querySelector("#garage .back-button"),
    document.querySelector("#garage .back-button button"),
  ],
];

const UPGRADES = [0 /* motor */, 0 /* grip */, 0 /* transmisson */];

const GAME_CONFIG = {
  gamespeed: 24,
  characterSpeed: 5,
};

const KEY_EVENTS = {
  leftArrow: false,
  rightArrow: false,
  upArrow: false,
  downArrow: false,
};

document.onkeydown = keyListenerDown;
document.onkeyup = keyListenerUp;

function keyListenerDown(e) {
  if (e.key === "ArrowLeft") {
    // Left arrow
    KEY_EVENTS.leftArrow = true;
  }
  if (e.key === "ArrowUp") {
    // Up arrow
    KEY_EVENTS.upArrow = true;
  }
  if (e.key === "ArrowRight") {
    // Right arrow
    KEY_EVENTS.rightArrow = true;
  }
  if (e.key === "ArrowDown") {
    // Down arrow
    KEY_EVENTS.downArrow = true;
  }
}

function keyListenerUp(e) {
  if (e.key === "ArrowLeft") {
    // Left arrow
    KEY_EVENTS.leftArrow = false;
  }
  if (e.key === "ArrowUp") {
    // Up arrow
    KEY_EVENTS.upArrow = false;
  }
  if (e.key === "ArrowRight") {
    // Right arrow
    KEY_EVENTS.rightArrow = false;
  }
  if (e.key === "ArrowDown") {
    // Down arrow
    KEY_EVENTS.downArrow = false;
  }
}

function movePlayer(dx, dy, dr) {
  // save original position
  let originalX = parseFloat(SCREEN[0][1].style.right);
  let originalY = parseFloat(SCREEN[0][1].style.bottom);

  SCREEN[0][1].style.right = originalX + dx + "px";
  SCREEN[0][1].style.bottom = originalY + dy + "px";

  /*if (dr != 0 && dr != PLAYER.spriteDirection) {
    PLAYER.spriteDirection = dr;
    PLAYER.box.style.transform = `scaleX(${dr})`;
  } */
}

/* --------------------------
    Hub Functions
-------------------------- */

function gameLoop() {
  if (KEY_EVENTS.leftArrow) {
    movePlayer(-1 * GAME_CONFIG.characterSpeed, 0, -1);
    // animatePlayer();
  }
  if (KEY_EVENTS.rightArrow) {
    movePlayer(GAME_CONFIG.characterSpeed, 0, 1);
    // animatePlayer();
  }
  if (KEY_EVENTS.upArrow) {
    movePlayer(0, -1 * GAME_CONFIG.characterSpeed, 0);
    // animatePlayer();
  }
  if (KEY_EVENTS.downArrow) {
    movePlayer(0, GAME_CONFIG.characterSpeed, 0);
    // animatePlayer();
  }

  setTimeout(gameLoop, 1000 / GAME_CONFIG.gameSpeed);
}

/* --------------------------
    Screen Functions
-------------------------- */

function showHub() {
  SCREEN[0].forEach((element) => {
    element.style.display = "block";
  });
  SCREEN[1].forEach((element) => {
    element.style.display = "none";
  });
}

function showGarage() {
  SCREEN[0].forEach((element) => {
    element.style.display = "none";
  });
  for (let i = 0; i < SCREEN[1].length; i++) {
    let element = SCREEN[1][i];
    if (!element) continue;

    if (i == 1) {
      element.style.display = "grid";
    } else if (i == 0) {
      element.style.display = "block";
    } else if (i == 3 || i == 5 || i == 7) {
      element.style.position = "absolute";
      element.style.display = "block";
      element.style.bottom = "10px";
      element.style.left = "50%";
      element.style.transform = "translateX(-50%)";
    } else if (i == 2 || i == 4 || i == 6) {
      // motor, grip, transmisson
      element.style.display = "block";
      element.style.position = "relative";
      element.style.paddingBottom = "60px"; // von 40px auf 50px erhöhen
    } else {
      element.style.display = "block";
    }
  }
}

/* --------------------------
    Upgrade Functions
-------------------------- */
function upgradeMotor() {
  if (UPGRADES[0] != 7) {
    UPGRADES[0]++;
    showUpgradeCarImg();
  } else {
    alert("Motor is already at max level!");
  }
}

function upgradeGrip() {
  if (UPGRADES[1] != 7) {
    UPGRADES[1]++;
    showUpgradeCarImg();
  } else {
    alert("Grip is already at max level!");
  }
}

function upgradeTransmission() {
  if (UPGRADES[2] != 7) {
    UPGRADES[2]++;
    showUpgradeCarImg();
  } else {
    alert("Transmission is already at max level!");
  }
}

function showUpgradeCarImg() {
  SCREEN[1][8].src = "./assets/img/F1-Car-Garage-upgrading-version2.png";
  setTimeout(() => {
    SCREEN[1][8].src = "./assets/img/F1-Car-Garage.png";
  }, 1000);
}

/* --------------------------
    window.onload Functions
-------------------------- */
window.onload = function () {
  showHub();
};

  gameLoop();