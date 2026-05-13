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

  raceSection.style.display = "block";
  raceSection.style.pointerEvents = "none";
  raceSection.style.zIndex = "5";
}

function showGarage() {
  SCREEN[0].forEach((el) => el && (el.style.display = "none"));
  SCREEN[1].forEach((el) => el && (el.style.display = "block"));

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
      if (j < UPGRADES[i]) span.classList.add("active");
      bar.appendChild(span);
    }
  });
}

function renderUpgradeBars() {
  updateUpgradeBars();
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
});

/* =========================================================
   RACE SCENE
========================================================= */

scene("race", () => {
  const raceDuration = 30 + UPGRADES[2] * 2;

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
    scale(0.74, 1.3),
    z(-10),
  ]);

  setTimeout(() => {
    document.querySelector("canvas")?.focus();
  }, 50);

  lives = 3;
  raceRunning = true;
  let spawningStopped = false;

  const lanePositions = [
    width() * 0.3,
    width() * 0.5,
    width() * 0.7
  ];

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
      (
        (spawnHistory[0] === 0 && spawnHistory[1] === 1 && lane === 2) ||
        (spawnHistory[0] === 2 && spawnHistory[1] === 1 && lane === 0)
      )
    );

    spawnHistory.push(lane);

    if (spawnHistory.length > 2) {
      spawnHistory.shift();
    }

    return lane;
  }

  let carVelX = 0;
  let input = 0;

  const accel = 40;
  const maxSpeed = 40 + UPGRADES[0] * 3;
  const grip = 0.88 - UPGRADES[1] * 0.015;

  const car = add([
    sprite("car"),
    pos(lanePositions[1], height() - 140),
    area(),
    anchor("center"),
    scale(0.5),
  ]);

  onKeyDown("a", () => input = -1);
  onKeyDown("d", () => input = 1);

  onKeyRelease("a", () => {
    if (!isKeyDown("d")) input = 0;
  });

  onKeyRelease("d", () => {
    if (!isKeyDown("a")) input = 0;
  });

  onUpdate(() => {
    if (!raceRunning) return;

    carVelX += input * accel * dt();
    carVelX = clamp(carVelX, -maxSpeed, maxSpeed);
    carVelX *= grip;

    car.pos.x += carVelX * 60 * dt();

    car.pos.x = clamp(
      car.pos.x,
      lanePositions[0] - 80,
      lanePositions[2] + 80
    );
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
    shake(6);
  });

  const ui = add([text("Lives: 3"), pos(20, 20), fixed()]);

  onUpdate(() => {
    ui.text = `Lives: ${lives}`;
  });

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
   START
========================================================= */

for (let i = 1; i <= 14; i++) {
  document.getElementById(`race-button-${i}`).onclick = () => {
    go("race");
  };
}

go("hub");
renderUpgradeBars();