/* VARIABLES */

const SCREEN = {
    /* STARTSCREEN */
  start: document.getElementById("start-screen"),
  startElements: {
    headline: document.getElementById("start-screen-headline"),
    startGame: document.getElementById("start-game"),
    options: document.getElementById("options"),
    leaderboard: document.getElementById("leaderboard"),
    exit: document.getElementById("exit-button"),
  },

  /* OPTIONS */
  options: document.getElementById("optionsScreen"),
  optionsElements: {},

  /* EXIT */
  exit: document.getElementById("exitScreen"),
  exitElements: {
    headline: document.getElementById("exit-headline"),
    yes: document.getElementById("yes"),
    no: document.getElementById("no"),
  },

  /* LEADERBOARD */
  leaderboard: document.getElementById("leaderboardScreen"),
  leaderboardElements: {
    firstPlace: document.getElementById("first-place"),
    secondPlace: document.getElementById("second-place"),
    thirdPlace: document.getElementById("third-place"),
  },

  /* TUTORIAL */
  tutorial: document.getElementById("tutorialScreen"),
  tutorialElements: {},
};

function showExitOverlay() {
  SCREEN.forEach((screen) => {
    screen.classList.add("hiddenOnStart");
    screen.style.display = "none";
  });
  SCREEN.exit.classList.remove("hiddenOnStart");
  SCREEN.exit.style.display = "flex";
}

function showStartscreen() {
  SCREEN: forEach((screen) => {
    screen.classList.add("hiddenOnStart");
    screen.style.display = "none";
  });
  SCREEN.start.classList.remove("hiddenOnStart");
  SCREEN.start.style.display = "flex";
}

/* ON LOAD FUNCTIONS */
window.onload = function () {
  showStartscreen();
};
