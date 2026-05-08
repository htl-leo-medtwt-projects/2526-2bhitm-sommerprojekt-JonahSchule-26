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

  let totalPower = UPGRADES[0] + UPGRADES[1] + UPGRADES[2];
  document.getElementById("power-text").innerHTML = `Power: ${totalPower}`;

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
  const bars = ["motor-bar", "grip-bar", "transmission-bar"];

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
  const bars = ["motor-bar", "grip-bar", "transmission-bar"];

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
  crisp: true,
});

/* =========================================================
   SPRITES
========================================================= */

loadSprite("player", "assets/img/sprite-without-background.png", {
  sliceX: 7,
  sliceY: 1,
  anims: {
    walk: {
      from: 0,
      to: 6,
      loop: true,
      speed: 8,
    },
  },
});
loadSprite("tyre1", "assets/img/tyre.png");
loadSprite("tyre2", "assets/img/tire-stack-1.jpeg.jpg");
loadSprite("tyre3", "assets/img/tire-stack-2.jpeg");
loadSprite("asphalt", "assets/img/asphalt.jpg");
loadSprite("grass", "assets/img/grass.jpg");

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
    anchor("center"),
    scale(0.5),
  ]);

  player.play("walk");
});

/* =========================================================
   RACE SCENE
========================================================= */

let raceDuration = 30 - UPGRADES[2] * 2;

scene("race", () => {
  raceDuration = 30 - UPGRADES[2] * 2;
  raceSection.style.display = "block";
  raceSection.style.pointerEvents = "auto";

  add([
    sprite("grass"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(3),
    z(-100),
  ]);

  setTimeout(() => {
    document.querySelector("canvas")?.focus();
  }, 50);

  lives = 3;
  raceRunning = true;
  let spawningStopped = false;
  let lastLanes = [];
  const maxMemory = 3;

  /* -------------------------
     LANES
  ------------------------- */
  const lanes = [width() * 0.3, width() * 0.5, width() * 0.7];

  /* -------------------------
     ASPHALT
  ------------------------- */
  add([
    sprite("asphalt"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(0.74, 1.3),
    z(-10),
  ]);

  /* -------------------------
     CAR PHYSICS
  ------------------------- */
  let carVelX = 0;
  let input = 0;

  const accel = 40 + UPGRADES[0] * 2;
  const maxSpeed = 10 + UPGRADES[0] * 2;
  const grip = 0.88 - UPGRADES[1] * 0.015;

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

    spawnLaneLine(width() * 0.4);
    spawnLaneLine(width() * 0.6);

    spawnBorderBlock(lanes[0] - 150, borderToggle);
    spawnBorderBlock(lanes[2] + 150, !borderToggle);

    borderToggle = !borderToggle;
  });

  /* -------------------------
     CAR
  ------------------------- */
  const car = add([
    sprite("car"),
    pos(lanes[1], height() - 140),
    area(),
    anchor("center"),
    scale(0.6),
  ]);

  car.play("drive");

  /* -------------------------
     INPUT
  ------------------------- */
  onKeyDown("a", () => (input = -1));
  onKeyDown("d", () => (input = 1));

  onKeyRelease("a", () => {
    if (!isKeyDown("d")) input = 0;
  });

  onKeyRelease("d", () => {
    if (!isKeyDown("a")) input = 0;
  });

  /* -------------------------
     MOVEMENT
  ------------------------- */
  onUpdate(() => {
    if (!raceRunning) return;

    carVelX += input * accel * dt();
    carVelX = clamp(carVelX, -maxSpeed, maxSpeed);

    carVelX *= grip;

    car.pos.x += carVelX * 60 * dt();

    car.pos.x = clamp(car.pos.x, lanes[0] - 80, lanes[2] + 80);
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

  function getSafeLane() {
    let lane;

    do {
      lane = choose(lanes);
    } while (lastLanes.includes(lane));

    lastLanes.push(lane);

    if (lastLanes.length > maxMemory) {
      lastLanes.shift();
    }

    return lane;
  }

  function spawnTire() {
    const lane = getSafeLane();
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

  loop(0.9, () => {
    if (!raceRunning || spawningStopped) return;
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
     FINISH
  ------------------------- */
  wait(raceDuration, () => {
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

    add([
      text("FINISH", { size: 64 }),
      pos(width() / 2, -60),
      anchor("center"),
      fixed(),
      move(DOWN, 260),
      color(0, 0, 0),
    ]);

    finishLine.onUpdate(() => {
      if (finishLine.pos.y > height() + 120) {
        raceRunning = false;

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
