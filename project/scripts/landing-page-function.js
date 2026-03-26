/* VARIABLES */
const SCREEN = [
  [
    [
      document.getElementById("start-screen"),
      document.getElementById("start-screen-headline"),
      document.getElementById("start-game"),
      document.getElementById("options"),
      document.getElementById("leaderboard"),
      document.getElementById("exit-button"),
      document.getElementById("tutorial"),
    ],
  ],
  [[document.getElementById("optionsScreen")]],
  [
    [
      document.getElementById("exitScreen"),
      document.getElementById("exit-headline"),
      document.getElementById("yes"),
      document.getElementById("no"),
    ],
  ],
  [
    [
      document.getElementById("leaderboardScreen"),
      document.getElementById("first-place"),
      document.getElementById("second-place"),
      document.getElementById("third-place"),
    ],
  ],
  [[document.getElementById("tutorialScreen")]],
];

/* SICHERHEITSFUNKTIONEN */
function hideAllScreens() {
  SCREEN.forEach((screen) => {
    if (screen[0] && screen[0].forEach) {
      screen[0].forEach((element) => {
        if (element && element.style) {
          element.style.display = "none";
        }
      });
    }
  });
}

function showScreen(index) {
  hideAllScreens();

  if (SCREEN[index] && SCREEN[index][0] && SCREEN[index][0].forEach) {
    SCREEN[index][0].forEach((element) => {
      if (element && element.style) {
        element.style.display = "flex";
      }
    });
  }
}

// Spezifische Screen-Funktionen
function showStartScreen() {
  showScreen(0);
}

function showOptionsScreen() {
  showScreen(1);
}

function showExitScreen() {
  showScreen(2);
}

function showLeaderboardScreen() {
  showScreen(3);
}

function showTutorialScreen() {
  showScreen(4);
}

/* ON LOAD / EXIT GAME FUNCTIONS */
window.onload = function () {
  showStartScreen();
};

function exitGame() {
  window.close();
}
