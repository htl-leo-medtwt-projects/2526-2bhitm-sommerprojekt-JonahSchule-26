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

const UPGRADES = [
  0, /* motor */
  0, /* grip */
  0, /* transmisson */
]

const collectibles = 0;



/* --------------------------
    Hub Functions
-------------------------- */



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