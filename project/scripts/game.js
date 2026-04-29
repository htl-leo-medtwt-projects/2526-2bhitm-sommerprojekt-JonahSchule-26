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
  if (UPGRADES[0] < 7) UPGRADES[0]++;
}

function upgradeGrip() {
  if (UPGRADES[1] < 7) UPGRADES[1]++;
}

function upgradeTransmission() {
  if (UPGRADES[2] < 7) UPGRADES[2]++;
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
  sliceX: 6,
  sliceY: 4,
  anims: {
    drive: {
      from: 0,
      to: 5,
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
  raceSection.style.display = "block"

  lives = 3
  raceRunning = true

  const speed = 450 + UPGRADES[0] * 60

  /* =========================
     CAR
  ========================= */

  const car = add([
    sprite("car"),
    pos(width() / 2, height() - 160),
    area(),
    anchor("center"),
    scale(0.7),
  ])

  car.play("drive")

  /* =========================
     CONTROLS
  ========================= */

  onKeyDown("left", () => car.move(-speed, 0))
  onKeyDown("right", () => car.move(speed, 0))

  /* =========================
     OBSTACLES (ONLY ONE SYSTEM)
  ========================= */

  const tires = ["tyre1", "tyre2", "tyre3"]

  loop(0.8, () => {
    if (!raceRunning) return

    add([
      sprite(choose(tires)),
      pos(rand(80, width() - 80), -120),
      area(),
      move(DOWN, rand(260, 260)),
      scale(0.25),   // <<< FIX: deutlich kleiner
      anchor("center"),
      "obstacle",
    ])
  })

  /* =========================
     COLLISION
  ========================= */

  car.onCollide("obstacle", (o) => {
    destroy(o)
    shake(6)

    car.pos.x += rand(-15, 15)
  })

  /* =========================
     UI FIX
  ========================= */

  const livesText = add([
    text("Lives: 3"),
    pos(20, 20),
    fixed(),
  ])

  onUpdate(() => {
    livesText.text = `Lives: ${lives}`
  })
})

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
