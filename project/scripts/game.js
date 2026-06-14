/* =========================================================
   DOM REFERENCES
========================================================= */

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

const raceSection = document.getElementById("race");

/* =========================================================
   GAME STATE
========================================================= */

const UPGRADES = [0, 0, 0];
let lives = 3;
let raceRunning = false;
let currentRacePlaying = null;

let playerName = "";
let raceWins = new Array(14).fill(false);
let timerStartTime = null;
let timerInterval = null;
let timerEl = null;

/* =========================================================
   AUDIO SYSTEM
========================================================= */

let backgroundMusic = null;
let sfxVolume = 0.8;

function loadAudioSettings() {
  const savedMusicVolume = localStorage.getItem("game_music_volume");
  const savedSfxVolume = localStorage.getItem("game_sfx_volume");

  if (savedMusicVolume !== null) {
    setMusicVolume(parseInt(savedMusicVolume));
  }
  if (savedSfxVolume !== null) {
    sfxVolume = parseInt(savedSfxVolume) / 100;
  }
}

function initBackgroundMusic() {
  backgroundMusic = new Audio("assets/audio/background-music.mp3");
  backgroundMusic.loop = true;
  loadAudioSettings();
}

function startBackgroundMusic() {
  if (!backgroundMusic) {
    initBackgroundMusic();
  }
  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
}

function setMusicVolume(volume) {
  if (backgroundMusic) {
    backgroundMusic.volume = volume / 100;
  }
}

function playSfx(soundFile) {
  const sfx = new Audio(`assets/audio/${soundFile}`);
  sfx.volume = sfxVolume;
  sfx.play().catch(() => {});
}

function playCrashSound() {
  playSfx("crash.wav");
}

function playFinishSound() {
  playSfx("finish.mp3");
}

function playCoinSound() {
  playSfx("coin.mp3");
}

function playUpgradeSound() {
  playSfx("upgrade.wav");
}

function playButtonClickSound() {
  playSfx("click.mp3");
}

/* =========================================================
   RACE BUTTON SETUP
========================================================= */

function setupRaceButtons() {
  for (let i = 1; i <= 14; i++) {
    const btn = document.getElementById(`race-button-${i}`);
    if (btn) {
      const raceIdx = i - 1;
      btn.onclick = () => {
        playButtonClickSound();
        if (raceWins[raceIdx]) {
          showAlreadyPlayedMessage();
        } else {
          currentRacePlaying = raceIdx;
          go("race");
        }
      };
    }
  }
}

function showAlreadyPlayedMessage() {
  const overlay = document.createElement("div");
  overlay.className = "message-overlay";
  overlay.innerHTML = `
        <div class="message-container">
            <div class="message-icon">⚠️</div>
            <h2 class="message-title">RACE ALREADY PLAYED</h2>
            <p class="message-text">You have already won this race.<br>Choose another race.</p>
            <button class="message-btn" onclick="this.closest('.message-overlay').remove()">OK</button>
        </div>
    `;
  document.body.appendChild(overlay);
}

/* =========================================================
   VICTORY SCREEN
========================================================= */

function showVictoryScreen() {
  const elapsed = (Date.now() - timerStartTime) / 1000;
  stopTimer();

  const records = JSON.parse(localStorage.getItem("raceRecords") || "[]");
  const top3 = records.slice(0, 3);

  const overlay = document.createElement("div");
  overlay.className = "message-overlay";

  let top3Html = "";
  if (top3.length > 0) {
    top3Html = `
            <table class="victory-leaderboard">
                <thead>
                    <tr>
                        <th></th><th>NAME</th><th>TIME</th><th>DATE</th>
                    </tr>
                </thead>
                <tbody>
                    ${top3
                      .map((r, i) => {
                        const medal = ["🥇", "🥈", "🥉"][i];
                        return `
                            <tr>
                                <td>${medal}</td>
                                <td>${r.name}</td>
                                <td>${formatTime(r.time)}</td>
                                <td>${r.date}</td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        `;
  }

  overlay.innerHTML = `
        <div class="message-container victory-container">
            <div class="message-icon">🏆🏆🏆</div>
            <h2 class="message-title">CONGRATULATIONS!</h2>
            <p class="message-text">You have mastered all 14 races!</p>
            <p class="message-text">${playerName}</p>
            <p class="message-time">⏱️ ${formatTime(elapsed)}</p>
            ${top3Html}
            <button class="message-btn" onclick="location.reload()">NEW GAME</button>
        </div>
    `;
  document.body.appendChild(overlay);

  records.push({
    name: playerName,
    time: elapsed,
    date: new Date().toLocaleDateString("de-AT"),
    completed: true,
  });
  records.sort((a, b) => a.time - b.time);
  localStorage.setItem("raceRecords", JSON.stringify(records.slice(0, 10)));
}

function showRaceFailedMessage() {
  const overlay = document.createElement("div");
  overlay.className = "message-overlay";
  overlay.innerHTML = `
        <div class="message-container">
            <div class="message-icon">💥</div>
            <h2 class="message-title">RACE FAILED!</h2>
            <p class="message-text">You lost all 5 lives.<br>Try again!</p>
            <button class="message-btn" onclick="this.closest('.message-overlay').remove(); go('hub')">BACK</button>
        </div>
    `;
  document.body.appendChild(overlay);
}

function checkAllRacesComplete() {
  if (raceWins.every((won) => won === true)) {
    showVictoryScreen();
  }
}

/* =========================================================
   TIMER & NAME HELPERS
========================================================= */

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
}

function createTimerDisplay() {
  timerEl = document.createElement("div");
  timerEl.id = "global-timer";
  timerEl.textContent = "00:00.00";
  document.body.appendChild(timerEl);
}

function startTimer() {
  timerStartTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!timerEl) return;
    const elapsed = (Date.now() - timerStartTime) / 1000;
    timerEl.textContent = formatTime(elapsed);
  }, 50);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function createNameScreen() {
  const overlay = document.createElement("div");
  overlay.id = "name-screen";
  overlay.className = "name-screen";

  overlay.innerHTML = `
    <div class="name-icon">🏎️</div>
    <h1 class="name-title">Racing Game</h1>
    <p class="name-subtitle">Enter your name before the race starts:</p>
    <input id="name-input" class="name-input" type="text" maxlength="20" placeholder="Your name…">
    <button id="name-confirm" class="name-confirm-btn">Let's go!</button>
  `;
  document.body.appendChild(overlay);

  const confirm = () => {
    const val = document.getElementById("name-input").value.trim();
    playerName = val || "Unknown";
    overlay.remove();
    startTimer();
    go("hub");
  };

  document.getElementById("name-confirm").onclick = confirm;
  document.getElementById("name-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirm();
  });

  setTimeout(() => document.getElementById("name-input")?.focus(), 100);
}

/* =========================================================
   SCREEN FUNCTIONS
========================================================= */

function showHub() {
  SCREEN[0].forEach((el) => el && (el.style.display = "block"));
  SCREEN[1].forEach((el) => el && (el.style.display = "none"));

  let totalPower = UPGRADES[0] + UPGRADES[1] + UPGRADES[2];
  document.getElementById("power-text").innerHTML = `Power: ${totalPower}`;

  raceSection.style.display = "block";
  raceSection.style.pointerEvents = "none";
  raceSection.style.zIndex = "5";

  updateLivesDisplay();
  updateRaceButtonsState();
}

function updateRaceButtonsState() {
  for (let i = 0; i < 14; i++) {
    const btn = document.getElementById(`race-button-${i + 1}`);
    if (btn) {
      if (raceWins[i]) {
        btn.style.opacity = "0.5";
        btn.style.filter = "grayscale(0.5)";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = "✓<br>Done";
      } else {
        btn.style.opacity = "1";
        btn.style.filter = "none";
        btn.style.cursor = "pointer";
        btn.innerHTML = "Enter<br>Race";
      }
    }
  }
}

function updateLivesDisplay() {
  for (let i = 1; i <= 3; i++) {
    const liveImg = document.getElementById(`live${i}`);
    if (liveImg) {
      if (i <= lives) {
        liveImg.style.opacity = "1";
        liveImg.style.filter = "none";
      } else {
        liveImg.style.opacity = "0.3";
        liveImg.style.filter = "grayscale(1)";
      }
    }
  }
}

function showGarage() {
  SCREEN[0].forEach((el) => el && (el.style.display = "none"));

  for (let i = 0; i < SCREEN[1].length; i++) {
    let element = SCREEN[1][i];
    if (!element) continue;

    if (i === 1) {
      element.style.display = "grid";
    } else if (i === 0) {
      element.style.display = "block";
    } else if (i === 3 || i === 5 || i === 7) {
      element.style.display = "block";
      element.style.position = "absolute";
      element.style.bottom = "10px";
      element.style.left = "50%";
      element.style.transform = "translateX(-50%)";
    } else if (i === 2 || i === 4 || i === 6) {
      element.style.display = "block";
      element.style.position = "relative";
      element.style.paddingBottom = "60px";
    } else {
      element.style.display = "block";
    }
  }

  raceSection.style.display = "none";
}

/* =========================================================
   UPGRADE FUNCTIONS
========================================================= */

let coins = 0;

function upgradeMotor() {
  if (coins > 1 && UPGRADES[0] < 7) {
    UPGRADES[0]++;
    coins -= 1;
    updateUpgradeBars();
    playUpgradeSound();
    updateCoinsDisplay();
  }
}

function upgradeGrip() {
  if (coins > 1 && UPGRADES[1] < 7) {
    UPGRADES[1]++;
    coins -= 1;
    updateUpgradeBars();
    playUpgradeSound();
    updateCoinsDisplay();
  }
}

function upgradeTransmission() {
  if (coins > 1 && UPGRADES[2] < 7) {
    UPGRADES[2]++;
    coins -= 1;
    updateUpgradeBars();
    playUpgradeSound();
    updateCoinsDisplay();
  }
}

function updateUpgradeBars() {
  const bars = ["motor-bar", "grip-bar", "transmission-bar"];

  bars.forEach((id, i) => {
    const bar = document.getElementById(id);
    if (!bar) return;

    bar.innerHTML = "";

    for (let j = 0; j < 7; j++) {
      const span = document.createElement("span");
      if (j < UPGRADES[i]) span.classList.add("active");
      bar.appendChild(span);
    }
  });
}

function renderUpgradeBars() {
  updateUpgradeBars();
}

function updateCoinsDisplay() {
  let coinsAmount = document.getElementById("coins-amount");
  if (coinsAmount) {
    coinsAmount.innerHTML = `Coins: ${coins}`;
  }
}

function setupGarageButtons() {
  const motorBtn = document.getElementById("motor-upgrade-text-box");
  const gripBtn = document.getElementById("grip-upgrade-text-box");
  const transBtn = document.getElementById("transmission-upgrade-text-box");
  const backBtn = document.querySelector("#garage .back-button button");

  if (motorBtn)
    motorBtn.onclick = () => {
      playButtonClickSound();
      upgradeMotor();
    };
  if (gripBtn)
    gripBtn.onclick = () => {
      playButtonClickSound();
      upgradeGrip();
    };
  if (transBtn)
    transBtn.onclick = () => {
      playButtonClickSound();
      upgradeTransmission();
    };
  if (backBtn)
    backBtn.onclick = () => {
      playButtonClickSound();
      go("hub");
    };
}

/* =========================================================
   KABOOM INIT
========================================================= */

kaboom({
  global: true,
  width: window.innerWidth,
  height: window.innerHeight,
  root: raceSection,
  crisp: true,
});

/* =========================================================
   SPRITES
========================================================= */

loadSprite("tyre1", "assets/img/tyre.png");
loadSprite("tyre2", "assets/img/tyre-2.png");
loadSprite("asphalt", "assets/img/asphalt.jpg");
loadSprite("grass", "assets/img/grass.jpg");
loadSprite("car", "assets/img/car-without-background.png");

/* =========================================================
   HUB SCENE
========================================================= */

scene("hub", () => {
  showHub();
  updateCoinsDisplay();
});

/* =========================================================
   RACE SCENE
========================================================= */

scene("race", () => {
  if (currentRacePlaying === null) {
    go("hub");
    return;
  }

  const raceDuration = 45 - UPGRADES[2] * 2.5;
  let raceLives = 5;

  raceSection.style.display = "block";
  raceSection.style.pointerEvents = "auto";
  raceSection.style.zIndex = "99999";

  add([
    sprite("grass"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(3),
    z(-100),
  ]);

  add([
    sprite("asphalt"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(0.65, 1.3),
    z(-10),
  ]);

  const MARK_SPEED = 260;

  function addDashedLine(x) {
    const dashH = 50;
    const gap = 45;
    const seg = dashH + gap;
    const count = Math.ceil(height() / seg) + 3;

    const dashes = [];
    for (let i = 0; i < count; i++) {
      const d = add([
        rect(10, dashH),
        pos(x, i * seg - seg),
        color(255, 255, 255),
        anchor("top"),
        z(-4),
      ]);
      dashes.push(d);
    }

    onUpdate(() => {
      if (!raceRunning) return;
      dashes.forEach((d) => {
        d.pos.y += MARK_SPEED * dt();
        if (d.pos.y > height() + dashH) {
          d.pos.y -= count * seg;
        }
      });
    });
  }

  function addBorderLine(x) {
    const stripeH = 42;
    const lineW = 22;
    const count = Math.ceil(height() / stripeH) + 3;

    const stripes = [];
    for (let i = 0; i < count; i++) {
      const isRed = i % 2 === 0;
      const s = add([
        rect(lineW, stripeH),
        pos(x, i * stripeH - stripeH),
        color(isRed ? 220 : 255, isRed ? 30 : 255, isRed ? 30 : 255),
        anchor("top"),
        z(-4),
      ]);
      stripes.push(s);
    }

    onUpdate(() => {
      if (!raceRunning) return;
      stripes.forEach((s) => {
        s.pos.y += MARK_SPEED * dt();
        if (s.pos.y > height() + stripeH) {
          s.pos.y -= count * stripeH;
        }
      });
    });
  }

  addDashedLine(width() * 0.4);
  addDashedLine(width() * 0.6);
  addBorderLine(width() * 0.195);
  addBorderLine(width() * 0.798);

  setTimeout(() => {
    document.querySelector("canvas")?.focus();
  }, 50);

  raceRunning = true;
  let spawningStopped = false;

  const lanePositions = [width() * 0.3, width() * 0.5, width() * 0.7];

  let spawnHistory = [];

  function getSafeLane() {
    let lane;
    let attempts = 0;

    do {
      lane = randi(0, 3);
      attempts++;

      if (attempts > 20) break;
    } while (
      spawnHistory.length >= 2 &&
      ((spawnHistory[0] === 0 && spawnHistory[1] === 1 && lane === 2) ||
        (spawnHistory[0] === 2 && spawnHistory[1] === 1 && lane === 0))
    );

    spawnHistory.push(lane);

    if (spawnHistory.length > 2) {
      spawnHistory.shift();
    }

    return lane;
  }

  let carVelX = 0;
  let input = 0;

  const maxSpeed = 10 + UPGRADES[0] + UPGRADES[1];
  const slideBase = 0.95;
  const slideCoeff = slideBase * (1 - UPGRADES[1] / 7);

  const car = add([
    sprite("car"),
    pos(lanePositions[1], height() - 140),
    area(),
    anchor("center"),
    scale(0.5),
  ]);

  onKeyDown("a", () => (input = -1));
  onKeyDown("d", () => (input = 1));

  onKeyRelease("a", () => {
    if (!isKeyDown("d")) input = 0;
  });

  onKeyRelease("d", () => {
    if (!isKeyDown("a")) input = 0;
  });

  onUpdate(() => {
    if (!raceRunning) return;

    if (input !== 0) {
      carVelX = input * maxSpeed;
    } else {
      if (UPGRADES[1] >= 7) {
        carVelX = 0;
      } else {
        carVelX *= Math.pow(slideCoeff, dt() * 60);
        if (Math.abs(carVelX) < 0.5) carVelX = 0;
      }
    }

    car.pos.x += carVelX * 60 * dt();
    car.pos.x = clamp(car.pos.x, lanePositions[0] - 80, lanePositions[2] + 80);
  });

  const tires = ["tyre1", "tyre2"];

  function spawnTire() {
    const lane = getSafeLane();

    add([
      sprite(choose(tires)),
      pos(lanePositions[lane], -120),
      area(),
      anchor("center"),
      scale(0.25),
      move(DOWN, 260),
      "obstacle",
    ]);
  }

  loop(0.9, () => {
    if (!raceRunning || spawningStopped) return;
    if (chance(0.25)) return;
    spawnTire();
  });

  car.onCollide("obstacle", (o) => {
    destroy(o);
    shake(8);
    playCrashSound();

    raceLives--;

    if (raceLives <= 0) {
      raceRunning = false;
      shake(12);

      get("obstacle").forEach((obs) => destroy(obs));

      wait(0.5, () => {
        showRaceFailedMessage();
      });

      wait(1.5, () => {
        currentRacePlaying = null;
        go("hub");
      });
    }
  });

  const ui = add([text(`Lives: ${raceLives}`), pos(20, 20), fixed()]);

  onUpdate(() => {
    ui.text = `Lives: ${raceLives}`;
  });

  wait(raceDuration, () => {
    if (!raceRunning) return;

    spawningStopped = true;

    const finishLine = add([
      rect(width(), 80),
      pos(0, -100),
      color(255, 255, 255),
      fixed(),
      move(DOWN, 260),
      area(),
      outline(6),
    ]);

    finishLine.onUpdate(() => {
      if (finishLine.pos.y > height() + 120) {
        raceRunning = false;
        playFinishSound();

        wait(0.5, () => {
          if (currentRacePlaying !== null && !raceWins[currentRacePlaying]) {
            raceWins[currentRacePlaying] = true;
            coins++;
            playCoinSound();
            updateCoinsDisplay();
            updateRaceButtonsState();
            checkAllRacesComplete();
          }
          currentRacePlaying = null;
          go("hub");
        });
      }
    });
  });
});

/* =========================================================
   START
========================================================= */

window.onload = function () {
  initBackgroundMusic();
  loadAudioSettings();
  setupGarageButtons();
  setupRaceButtons();
  updateRaceButtonsState();
  updateLivesDisplay();
};

createTimerDisplay();
createNameScreen();
renderUpgradeBars();