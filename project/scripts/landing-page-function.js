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
};

const STORAGE_KEYS = {
    MUSIC_VOLUME: 'game_music_volume',
    SFX_VOLUME: 'game_sfx_volume'
};

const tutorialDialogs = [
    {
        title: "🏁 Welcome to Kart and Key!",
        text: "Get ready for an exciting racing adventure! Click anywhere to continue..."
    },
    {
        title: "🎮 How to Play",
        text: "Use 'A' to steer left and 'D' to steer right."
    },
    {
        title: "Finish Races to collect Coins",
        text: "If you finish a race, you will receive a coin. This coin can be spent in the garage to upgrade your car. But be careful: You don't have enough coins to upgrade everything, so choose wisely!"
    },
    {
        title: "🏆 Win the Race",
        text: "Reach the finish line before you drive into 5 obstacles to win the race!"
    },
    {
        title: "⚙️ Options",
        text: "You can adjust music volume, SFX volume, and language in the Options menu."
    },
    {
        title: "📊 Leaderboard",
        text: "Compete with friends and try to get the best time on the global leaderboard! Leaderboard only shows the top 3 records."
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

let backgroundMusic = null;

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
  
  const records = JSON.parse(localStorage.getItem("raceRecords") || "[]");
  records.sort((a, b) => a.time - b.time);
  
  const first = records[0] || null;
  const second = records[1] || null;
  const third = records[2] || null;
  
  document.getElementById("first-place").innerHTML = first ? `${first.name}<br>${formatTime(first.time)}<br>${first.date}` : "—";
  document.getElementById("second-place").innerHTML = second ? `${second.name}<br>${formatTime(second.time)}<br>${second.date}` : "—";
  document.getElementById("third-place").innerHTML = third ? `${third.name}<br>${formatTime(third.time)}<br>${third.date}` : "—";
}

function showTutorialScreen() {
  showScreen(4);
}

function initBackgroundMusic() {
    backgroundMusic = new Audio('assets/music/background-music.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = currentOptions.musicVolume / 100;
}

function startBackgroundMusic() {
    if (backgroundMusic && !backgroundMusic.paused) return;
    if (!backgroundMusic) initBackgroundMusic();
    backgroundMusic.play().catch(() => {});
}

function setMusicVolume(volume) {
    if (backgroundMusic) {
        backgroundMusic.volume = volume / 100;
    }
}

function saveOptionsToLocalStorage() {
    localStorage.setItem(STORAGE_KEYS.MUSIC_VOLUME, currentOptions.musicVolume);
    localStorage.setItem(STORAGE_KEYS.SFX_VOLUME, currentOptions.sfxVolume);
}

function loadOptionsFromLocalStorage() {
    const savedMusicVolume = localStorage.getItem(STORAGE_KEYS.MUSIC_VOLUME);
    const savedSfxVolume = localStorage.getItem(STORAGE_KEYS.SFX_VOLUME);
    
    return {
        musicVolume: savedMusicVolume !== null ? parseInt(savedMusicVolume) : defaultOptions.musicVolume,
        sfxVolume: savedSfxVolume !== null ? parseInt(savedSfxVolume) : defaultOptions.sfxVolume
    };
}

function loadCurrentOptions() {
    currentOptions = loadOptionsFromLocalStorage();
    
    let musicSlider = document.getElementById('music-volume');
    let sfxSlider = document.getElementById('sfx-volume');
    let musicValue = document.getElementById('music-value');
    let sfxValue = document.getElementById('sfx-value');
    
    if (musicSlider) musicSlider.value = currentOptions.musicVolume;
    if (sfxSlider) sfxSlider.value = currentOptions.sfxVolume;
    if (musicValue) musicValue.innerHTML = currentOptions.musicVolume + '%';
    if (sfxValue) sfxValue.innerHTML = currentOptions.sfxVolume + '%';
    
    setMusicVolume(currentOptions.musicVolume);
}

function setupVolumeSliders() {
    let musicSlider = document.getElementById('music-volume');
    let sfxSlider = document.getElementById('sfx-volume');
    let musicValue = document.getElementById('music-value');
    let sfxValue = document.getElementById('sfx-value');
    
    if (musicSlider) {
        musicSlider.addEventListener('input', function() {
            musicValue.innerHTML = this.value + '%';
            setMusicVolume(parseInt(this.value));
        });
    }
    
    if (sfxSlider) {
        sfxSlider.addEventListener('input', function() {
            sfxValue.innerHTML = this.value + '%';
        });
    }
}

function resetOptions() {
    currentOptions = { ...defaultOptions };
    
    let musicSlider = document.getElementById('music-volume');
    let sfxSlider = document.getElementById('sfx-volume');
    let musicValue = document.getElementById('music-value');
    let sfxValue = document.getElementById('sfx-value');
    
    if (musicSlider) {
        musicSlider.value = defaultOptions.musicVolume;
        if (musicValue) musicValue.textContent = defaultOptions.musicVolume + '%';
        setMusicVolume(defaultOptions.musicVolume);
    }
    
    if (sfxSlider) {
        sfxSlider.value = defaultOptions.sfxVolume;
        if (sfxValue) sfxValue.textContent = defaultOptions.sfxVolume + '%';
    }
    
    saveOptionsToLocalStorage();
}

function applyOptions() {
    showAreYouSureScreen();
    let musicSlider = document.getElementById('music-volume');
    let sfxSlider = document.getElementById('sfx-volume');
    
    currentOptions = {
        musicVolume: musicSlider ? parseInt(musicSlider.value) : 70,
        sfxVolume: sfxSlider ? parseInt(sfxSlider.value) : 80
    };
    
    saveOptionsToLocalStorage();
    setMusicVolume(currentOptions.musicVolume);
}

function cancelOptions() {
    loadCurrentOptions();
    showStartScreen();
}

function showAreYouSureScreen() {
    showScreen(5);
}

function startTutorial() {
    tutorialStep = 0;
    tutorialActive = true;
    showTutorialDialog(0);
    
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
    
    let tutorialScreen = document.getElementById("tutorialScreen");
    if (tutorialScreen) {
        tutorialScreen.removeEventListener("click", nextTutorialDialog);
    }
    
    let title = document.getElementById("tutorial-title");
    let text = document.getElementById("tutorial-text");
    
    if (title && text) {
        title.textContent = "🎉 Tutorial Complete! 🎉";
        text.textContent = "You're now ready to race! Click the button below to start the game.";
        
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
    
    let hint = document.querySelector(".click-hint");
    if (hint) hint.remove();
}

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

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(2);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(5, '0')}`;
}

window.onload = function () {
    initBackgroundMusic();
    currentOptions = loadOptionsFromLocalStorage();
    setupVolumeSliders();
    setMusicVolume(currentOptions.musicVolume);
    
    let startBtn = document.getElementById("start-game");
    if (startBtn) {
        startBtn.addEventListener("click", startBackgroundMusic);
    }
    
    let optionsBtn = document.getElementById("options");
    if (optionsBtn) {
        optionsBtn.addEventListener("click", startBackgroundMusic);
    }
    
    let leaderboardBtn = document.getElementById("leaderboard");
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener("click", startBackgroundMusic);
    }
    
    let tutorialBtn = document.getElementById("tutorial");
    if (tutorialBtn) {
        tutorialBtn.addEventListener("click", startBackgroundMusic);
    }
    
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

function onDragVolumeSlider(slider) {
    const value = slider.value;
    if (slider.id === "music-volume") {
        document.getElementById("music-value").innerHTML = value + "%";
        setMusicVolume(parseInt(value));
    } 
    else if (slider.id === "sfx-volume") {
        document.getElementById("sfx-value").innerHTML = value + "%";
    }
}