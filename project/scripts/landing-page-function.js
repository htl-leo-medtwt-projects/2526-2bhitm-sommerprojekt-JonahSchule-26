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
  document.body.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      justify-content: center;
      align-items: center;
      background: black;
      color: white;
      font-family: Arial;
      grid-template-columns: 1fr;
      text-align: center;
    ">
      <h1>Game Closed</h1><br>
      <p>Thank you for playing!</p>
    </div>
  `;
}