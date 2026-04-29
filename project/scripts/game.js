window.addEventListener("DOMContentLoaded", () => {
   initGame()
})


function initGame() {

    const raceSection = document.getElementById("race")

    kaboom({
        global: true,
        width: window.innerWidth,
        height: window.innerHeight,
    })

    loadSprite("car", "./assets/img/kart-sprite-img.png", {
        sliceX: 6,
        sliceY: 4,
        anims: {
            drive: { from: 0, to: 5, loop: true, speed: 12 },
        },
    })

    scene("hub", () => {
        raceSection.style.display = "none"

        add([
            text("HUB", { size: 32 }),
            pos(width() / 2, height() / 2),
            anchor("center"),
        ])
    })

    scene("race", () => {
        raceSection.style.display = "block"

        const car = add([
            sprite("car"),
            pos(width() / 2, height() - 150),
            area(),
        ])

        car.play("drive")

        onKeyDown("left", () => car.move(-500, 0))
        onKeyDown("right", () => car.move(500, 0))

        loop(1, () => {
            add([
                rect(60, 60),
                pos(rand(0, width()), -50),
                move(DOWN, 400),
                area(),
                "obstacle",
            ])
        })

        car.onCollide("obstacle", (o) => {
            destroy(o)
            shake(8)
        })
    })

    document.querySelectorAll(".enter-race").forEach(btn => {
        btn.addEventListener("click", () => {
            go("race")
        })
    })

    go("hub")
}


/* =========================================================
   GLOBAL DOM REFERENCES (HUB + GARAGE BLEIBT)
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

const UPGRADES = [0, 0, 0];

const GAME_CONFIG = {
  characterSpeed: 5,
};

/* =========================================================
   SCREEN FUNCTIONS (UNVERÄNDERT)
========================================================= */

function showHub() {
  SCREEN[0].forEach(el => el && (el.style.display = "block"));
  SCREEN[1].forEach(el => el && (el.style.display = "none"));
}

function showGarage() {
  SCREEN[0].forEach(el => el && (el.style.display = "none"));
  SCREEN[1].forEach(el => el && (el.style.display = "block"));
}

/* =========================================================
   UPGRADES (UNVERÄNDERT, aber jetzt nutzbar für Race später)
========================================================= */

function upgradeMotor() {
  if (UPGRADES[0] < 7) {
    UPGRADES[0]++;
    GAME_CONFIG.characterSpeed = 5 + UPGRADES[0] * 0.5;
  }
}

function upgradeGrip() {
  if (UPGRADES[1] < 7) UPGRADES[1]++;
}

function upgradeTransmission() {
  if (UPGRADES[2] < 7) UPGRADES[2]++;
}

/* =========================================================
   KABOOM SETUP
========================================================= */

kaboom({
  global: true,
  width: window.innerWidth,
  height: window.innerHeight,
})

/* =========================================================
   SPRITES
========================================================= */

loadSprite("player", "../assets/img/sprite.jpg", {
  sliceX: 6,
  sliceY: 4,
  anims: {
    walk: { from: 0, to: 5, loop: true, speed: 10 },
  },
})

loadSprite("car", "../assets/img/kart-sprite-img.png", {
  sliceX: 6,
  sliceY: 4,
  anims: {
    drive: { from: 0, to: 5, loop: true, speed: 12 },
  },
})

/* =========================================================
   STATE
========================================================= */

let lives = 3
let raceRunning = false

const raceSection = document.getElementById("race")

/* =========================================================
   HUB SCENE
========================================================= */

scene("hub", () => {

  raceSection.style.display = "none"

  add([
    sprite("player"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(2),
  ]).play("walk")
})

/* =========================================================
   RACE SCENE
========================================================= */

scene("race", () => {

  raceSection.style.display = "block"
  lives = 3
  raceRunning = true

  const speed = 500 + UPGRADES[0] * 50

  const car = add([
    sprite("car"),
    pos(width() / 2, height() - 150),
    area(),
    anchor("center"),
    scale(2),
  ])

  car.play("drive")

  /* -------------------------
     MOVEMENT
  ------------------------- */

  onKeyDown("left", () => {
    car.move(-speed, 0)
  })

  onKeyDown("right", () => {
    car.move(speed, 0)
  })

  /* -------------------------
     OBSTACLES
  ------------------------- */

  loop(1, () => {
    if (!raceRunning) return

    add([
      rect(60, 60),
      pos(rand(0, width()), -50),
      move(DOWN, 400 + UPGRADES[1] * 30),
      area(),
      "obstacle",
    ])
  })

  /* -------------------------
     COLLISION
  ------------------------- */

  car.onCollide("obstacle", (o) => {
    destroy(o)
    lives--
    shake(8)

    if (lives <= 0) {
      raceRunning = false
      go("hub")
    }
  })

  /* -------------------------
     UI
  ------------------------- */

  add([
    text(() => `Lives: ${lives}`, { size: 24 }),
    pos(20, 20),
  ])
})

/* =========================================================
   BUTTONS -> RACE
========================================================= */

document.querySelectorAll(".enter-race").forEach(btn => {
  btn.addEventListener("click", () => {
    go("race")
  })
})

/* =========================================================
   START
========================================================= */

showHub()
go("hub")

