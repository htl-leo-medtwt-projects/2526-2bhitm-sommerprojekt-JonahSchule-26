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

/* =========================================================
   SCREEN FUNCTIONS
========================================================= */

function showHub() {
  SCREEN[0].forEach((el) => el && (el.style.display = "block"));
  SCREEN[1].forEach((el) => el && (el.style.display = "none"));

  raceSection.style.display = "none";
  raceSection.style.pointerEvents = "none";
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

function upgradeMotor() {
  if (UPGRADES[0] < 7) {
    UPGRADES[0]++;
    updateUpgradeBars();
  }
}

function upgradeGrip() {
  if (UPGRADES[1] < 7) {
    UPGRADES[1]++;
    updateUpgradeBars();
  }
}

function upgradeTransmission() {
  if (UPGRADES[2] < 7) {
    UPGRADES[2]++;
    updateUpgradeBars();
  }
}

function updateUpgradeBars() {
  const bars = [
    "motor-bar",
    "grip-bar",
    "transmission-bar"
  ];

  bars.forEach((id, i) => {
    const bar = document.getElementById(id);
    if (!bar) return;

    bar.innerHTML = "";

    for (let j = 0; j < 7; j++) {
      const span = document.createElement("span");

      if (j < UPGRADES[i]) {
        span.classList.add("active");
      }

      bar.appendChild(span);
    }
  });
}

function renderUpgradeBars() {
  const bars = [
    "motor-bar",
    "grip-bar",
    "transmission-bar"
  ];

  bars.forEach((id, i) => {
    const bar = document.getElementById(id);
    if (!bar) return;

    bar.innerHTML = "";

    for (let j = 0; j < 7; j++) {
      const seg = document.createElement("span");
      if (j < UPGRADES[i]) seg.classList.add("active");
      bar.appendChild(seg);
    }
  });
}

/* =========================================================
   KABOOM INIT
========================================================= */

kaboom({
  global: true,
  width: window.innerWidth,
  height: window.innerHeight,
  root: raceSection,
});

/* =========================================================
   SPRITES
========================================================= */

loadSprite("player", "assets/img/sprite.jpg");
loadSprite("tyre1", "assets/img/tyre.png");
loadSprite("tyre2", "assets/img/tire-stack-1.jpeg.jpg");
loadSprite("tyre3", "assets/img/tire-stack-2.jpeg");

loadSprite("car", "assets/img/kart-sprite-img.png", {
  sliceX: 4,
  sliceY: 4,
  anims: {
    drive: {
      from: 0,
      to: 3,
      loop: true,
      speed: 12,
    },
  },
});

/* =========================================================
   HUB SCENE
========================================================= */

scene("hub", () => {
  showHub();

  const player = add([
    sprite("player"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(2),
  ]);

  player.play("walk");
});

/* =========================================================
   RACE SCENE
========================================================= */

scene("race", () => {
  raceSection.style.display = "block";

  focus();

  lives = 3;
  raceRunning = true;

  /* -------------------------
     LANES
  ------------------------- */
  const lanes = [width() * 0.3, width() * 0.5, width() * 0.7];

  let laneIndex = 1;

  const speed = 500 + UPGRADES[0] * 60;

  /* -------------------------
     TRACK VISUALS
  ------------------------- */

  function spawnLaneLine(x) {
    add([
      rect(12, 80),
      pos(x, -100),
      color(255, 255, 255),
      move(DOWN, 260),
      anchor("center"),
    ]);
  }

  function spawnBorderBlock(x, isRed) {
    add([
      rect(40, 100),
      pos(x, -120),
      color(...(isRed ? [255, 0, 0] : [255, 255, 255])),
      move(DOWN, 260),
      anchor("center"),
    ]);
  }

  let borderToggle = true;

  loop(0.35, () => {
    if (!raceRunning) return;

    // Spur-Linien
    spawnLaneLine(width() * 0.4);
    spawnLaneLine(width() * 0.6);

    // Rand
    spawnBorderBlock(lanes[0] - 150, borderToggle);
    spawnBorderBlock(lanes[2] + 150, !borderToggle);

    borderToggle = !borderToggle;
  });

  /* -------------------------
     CAR
  ------------------------- */
  const car = add([
    sprite("car"),
    pos(lanes[laneIndex], height() - 140),
    area(),
    anchor("center"),
    scale(0.6),
  ]);

  car.play("drive");

  function updateCar() {
    car.pos.x = lanes[laneIndex];
  }

  /* -------------------------
     CONTROLS
  ------------------------- */
  onKeyPress("left", () => {
    laneIndex = Math.max(0, laneIndex - 1);
    updateCar();
  });

  onKeyPress("right", () => {
    laneIndex = Math.min(2, laneIndex + 1);
    updateCar();
  });

  /* -------------------------
     TIRES
  ------------------------- */
  const tires = ["tyre1", "tyre2", "tyre3"];

  const tireConfig = {
    tyre1: { scale: 0.25, speed: 260 },
    tyre2: { scale: 0.225, speed: 260 },
    tyre3: { scale: 0.1125, speed: 260 },
  };

  function spawnTire() {
    const lane = choose(lanes);
    const type = choose(tires);
    const cfg = tireConfig[type];

    add([
      sprite(type),
      pos(lane, -120),
      area(),
      anchor("center"),
      scale(cfg.scale),
      move(DOWN, cfg.speed),
      "obstacle",
    ]);
  }

  /* -------------------------
     RANDOM SPAWN
  ------------------------- */
  loop(0.9, () => {
    if (!raceRunning) return;

    if (chance(0.25)) return;

    spawnTire();
  });

  /* -------------------------
     COLLISION
  ------------------------- */
  car.onCollide("obstacle", (o) => {
    destroy(o);
    shake(6);
  });

  /* -------------------------
     UI
  ------------------------- */
  const ui = add([text("Lives: 3"), pos(20, 20), fixed()]);

  onUpdate(() => {
    ui.text = `Lives: ${lives}`;
  });

  /* -------------------------
     FINISH LINE
  ------------------------- */
  wait(30, () => {
    raceRunning = false;

    let finished = false;

    const finishLine = add([
      rect(width(), 80),
      pos(0, -100),
      color(255, 255, 255),
      fixed(),
      move(DOWN, 260),
      area(),
      outline(6),
    ]);

    add([
      text("FINISH", { size: 64 }),
      pos(width() / 2, -60),
      anchor("center"),
      fixed(),
      move(DOWN, 260),
      color(0, 0, 0),
    ]);

    finishLine.onUpdate(() => {
      if (finished) return;

      if (finishLine.pos.y > height() + 100) {
        finished = true;

        wait(0.5, () => {
          go("hub");
        });
      }
    });
  });
});

/* =========================================================
   BUTTON EVENTS
========================================================= */

document.querySelectorAll(".enter-race").forEach((btn) => {
  btn.addEventListener("click", () => {
    go("race");
  });
});

/* =========================================================
   START
========================================================= */

go("hub");
renderUpgradeBars();