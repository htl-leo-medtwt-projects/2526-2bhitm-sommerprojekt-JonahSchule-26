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
  [
    [
      document.getElementById("optionsScreen")
    ]
  ],
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
  [
    [
      document.getElementById("tutorialScreen"),
      document.getElementById("tutorial-title"),
      document.getElementById("tutorial-text"),
      document.getElementById("tutorial-step"),
    ]
  ],
  [
    [
      document.getElementById("are-you-sure"),
      document.getElementById("exit-headline"),
      document.getElementById("yes"),
      document.getElementById("no"),
    ]
  ]
];

const defaultOptions = {
    musicVolume: 70,
    sfxVolume: 80,
    option1: 'normal',
    option2: 'de'
};

const tutorialDialogs = [
    {
        title: "🏁 Welcome to Kart and Key!",
        text: "Get ready for an exciting racing adventure! Click anywhere to continue..."
    },
    {
        title: "🎮 How to Play",
        text: "Use the ARROW KEYS to control your kart. Press UP to accelerate, LEFT/RIGHT to steer."
    },
    {
        title: "⭐ Collect Power-Ups",
        text: "Drive over glowing items to get speed boosts, shields, and special abilities!"
    },
    {
        title: "🏆 Win the Race",
        text: "Reach the finish line before your opponents to unlock new karts and tracks."
    },
    {
        title: "⚙️ Options",
        text: "You can adjust music volume, SFX volume, and game difficulty in the Options menu."
    },
    {
        title: "📊 Leaderboard",
        text: "Compete with friends and try to get the best time on the global leaderboard!"
    },
    {
        title: "🚀 Ready to Race?",
        text: "Click START GAME to begin your journey! Good luck and have fun!"
    }
];

let currentOptions = { ...defaultOptions };
let tutorialStep = 0;
let tutorialActive = false;
let originalShowTutorialScreen = showTutorialScreen;

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
    loadCurrentOptions();
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

/* OPTIONEN LADEN UND SPEICHERN */
function loadCurrentOptions() {
    // Slider Werte auf aktuelle Optionen setzen
    let musicSlider = document.getElementById('music-volume');
    let sfxSlider = document.getElementById('sfx-volume');
    let musicValue = document.getElementById('music-value');
    let sfxValue = document.getElementById('sfx-value');
    let option1 = document.getElementById('option-1');
    let option2 = document.getElementById('option-2');
    
    if (musicSlider) musicSlider.value = currentOptions.musicVolume;
    if (sfxSlider) sfxSlider.value = currentOptions.sfxVolume;
    if (musicValue) musicValue.textContent = currentOptions.musicVolume + '%';
    if (sfxValue) sfxValue.textContent = currentOptions.sfxVolume + '%';
    if (option1) option1.value = currentOptions.option1;
    if (option2) option2.value = currentOptions.option2;
}

function setupVolumeSliders() {
    let musicSlider = document.getElementById('music-volume');
    let sfxSlider = document.getElementById('sfx-volume');
    let musicValue = document.getElementById('music-value');
    let sfxValue = document.getElementById('sfx-value');
    
    if (musicSlider) {
        musicSlider.addEventListener('input', function() {
            musicValue.textContent = this.value + '%';
        });
    }
    
    if (sfxSlider) {
        sfxSlider.addEventListener('input', function() {
            sfxValue.textContent = this.value + '%';
        });
    }
}

function resetOptions() {
    currentOptions = { ...defaultOptions };
    
    // Update UI
    let musicSlider = document.getElementById('music-volume');
    let sfxSlider = document.getElementById('sfx-volume');
    let musicValue = document.getElementById('music-value');
    let sfxValue = document.getElementById('sfx-value');
    let option1 = document.getElementById('option-1');
    let option2 = document.getElementById('option-2');
    
    if (musicSlider) musicSlider.value = defaultOptions.musicVolume;
    if (sfxSlider) sfxSlider.value = defaultOptions.sfxVolume;
    if (musicValue) musicValue.textContent = defaultOptions.musicVolume + '%';
    if (sfxValue) sfxValue.textContent = defaultOptions.sfxVolume + '%';
    if (option1) option1.value = defaultOptions.option1;
    if (option2) option2.value = defaultOptions.option2;
    
    console.log("Options reset to default");
}

function applyOptions() {
  showAreYouSureScreen();
    let musicSlider = document.getElementById('music-volume');
    let sfxSlider = document.getElementById('sfx-volume');
    let option1 = document.getElementById('option-1');
    let option2 = document.getElementById('option-2');
    
    currentOptions = {
        musicVolume: musicSlider ? parseInt(musicSlider.value) : 70,
        sfxVolume: sfxSlider ? parseInt(sfxSlider.value) : 80,
        option1: option1 ? option1.value : 'normal',
        option2: option2 ? option2.value : 'de'
    };
    
    /* HIER OPTIONEN IM SPIEL ANWENDEN (z.B. Musiklautstärke, Sprache, etc.) */
}

function cancelOptions() {
    loadCurrentOptions();
    showStartScreen();
}

function showAreYouSureScreen() {
    showScreen(5);
}


/* Tutorial Funktionen */
function showTutorialScreen() {
    showScreen(4);
    startTutorial();
}

function startTutorial() {
    tutorialStep = 0;
    tutorialActive = true;
    showTutorialDialog(0);
    
    // Klick-Listener für Tutorial hinzufügen
    let tutorialScreen = document.getElementById("tutorialScreen");
    if (tutorialScreen) {
        tutorialScreen.addEventListener("click", nextTutorialDialog);
    }
}

function showTutorialDialog(step) {
    let title = document.getElementById("tutorial-title");
    let text = document.getElementById("tutorial-text");
    let stepSpan = document.getElementById("tutorial-step");
    
    if (title && text && tutorialDialogs[step]) {
        title.textContent = tutorialDialogs[step].title;
        text.textContent = tutorialDialogs[step].text;
        
        if (stepSpan) {
            stepSpan.textContent = `Step ${step + 1}/${tutorialDialogs.length}`;
        }
        
        // Animation zurücksetzen
        let dialog = document.querySelector(".tutorial-dialog");
        if (dialog) {
            dialog.style.animation = "none";
            setTimeout(() => {
                dialog.style.animation = "fadeIn 0.3s ease";
            }, 10);
        }
    }
}

function nextTutorialDialog() {
    if (!tutorialActive) return;
    
    tutorialStep++;
    
    if (tutorialStep < tutorialDialogs.length) {
        showTutorialDialog(tutorialStep);
    } else {
        endTutorial();
    }
}

function endTutorial() {
    tutorialActive = false;
    
    // Entferne Klick-Listener
    let tutorialScreen = document.getElementById("tutorialScreen");
    if (tutorialScreen) {
        tutorialScreen.removeEventListener("click", nextTutorialDialog);
    }
    
    // Zeige Abschlussmeldung
    let title = document.getElementById("tutorial-title");
    let text = document.getElementById("tutorial-text");
    
    if (title && text) {
        title.textContent = "🎉 Tutorial Complete! 🎉";
        text.textContent = "You're now ready to race! Click the button below to start the game.";
        
        // Button zum Starten hinzufügen
        let dialog = document.querySelector(".tutorial-dialog");
        if (dialog && !document.getElementById("tutorial-start-btn")) {
            let startBtn = document.createElement("button");
            startBtn.id = "tutorial-start-btn";
            startBtn.textContent = "START GAME";
            startBtn.className = "tutorial-start-btn";
            startBtn.onclick = () => {
                showStartScreen();
            };
            dialog.appendChild(startBtn);
            
            // CSS für den Button
            let style = document.createElement("style");
            style.textContent = `
                .tutorial-start-btn {
                    margin-top: 1rem;
                    padding: 0.75rem 2rem;
                    font-size: 1.2rem;
                    font-weight: bold;
                    background: linear-gradient(to bottom, #4CAF50, #2E7D32);
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-family: f1Font;
                    transition: all 0.3s ease;
                }
                .tutorial-start-btn:hover {
                    transform: scale(1.05);
                    filter: brightness(1.1);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Klick-Hinweis entfernen
    let hint = document.querySelector(".click-hint");
    if (hint) hint.remove();
}

// Optional: Klick-Hinweis anzeigen
function showClickHint() {
    let tutorialScreen = document.getElementById("tutorialScreen");
    if (tutorialScreen && !document.querySelector(".click-hint")) {
        let hint = document.createElement("div");
        hint.className = "click-hint";
        hint.innerHTML = "✨ Click anywhere to continue ✨";
        tutorialScreen.appendChild(hint);
    }
}

showTutorialScreen = function() {
    originalShowTutorialScreen();
    setTimeout(showClickHint, 500);
};

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