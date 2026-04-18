/* --------------------------
    Global Variables
-------------------------- */

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

const UPGRADES = [0 /* motor */, 0 /* grip */, 0 /* transmisson */];

const GAME_CONFIG = {
  gameSpeed: 24,
  characterSpeed: 5,
};

// Tastenstatus für Bewegung (WASD + Pfeiltasten)
const KEY_EVENTS = {
  up: false,
  down: false,
  left: false,
  right: false
};

// Spieler-Position
let playerX = window.innerWidth / 2 - 48;
let playerY = window.innerHeight / 2 - 48;

// Sprite-Animation Variablen
let currentDirection = 'down'; // 'up', 'down', 'left', 'right'
let currentFrame = 0;
let frameCounter = 0;
const ANIMATION_SPEED = 6; // Je niedriger, desto schneller die Animation
let isMoving = false;

// DOM-Elemente
let playerImg = null;
let playerBox = null;

/* -----------
   SPRITE
---------- */

const SPRITE_CONFIG = {
  spriteUrl: '',
  frameWidth: 96,
  frameHeight: 96,
  framesPerRow: 4,
  rows: 4
};
const directionRowMap = {
  'down': 0,
  'left': 1,
  'right': 2,
  'up': 3
};

/* --------------------------
    SPRITE INITIALISIERUNG
-------------------------- */

function initPlayerSprite() {
  playerBox = document.getElementById('player-box');
  playerImg = document.querySelector('#player-box img');
  
  if (!playerImg) {
    // Falls kein img existiert, erstelle eines
    playerImg = document.createElement('img');
    playerImg.alt = "Player";
    playerBox.appendChild(playerImg);
  }
  
  // Styles für das Player-Box
  if (playerBox) {
    playerBox.style.position = 'absolute';
    playerBox.style.width = SPRITE_CONFIG.frameWidth + 'px';
    playerBox.style.height = SPRITE_CONFIG.frameHeight + 'px';
    playerBox.style.left = playerX + 'px';
    playerBox.style.top = playerY + 'px';
    playerBox.style.transform = 'translate(0, 0)'; // Entferne die translate von CSS
  }
  
  // Styles für das Image
  if (playerImg) {
    playerImg.style.width = '100%';
    playerImg.style.height = '100%';
    playerImg.style.imageRendering = 'pixelated';
    playerImg.style.imageRendering = 'crisp-edges';
    playerImg.style.display = 'block';
  }
  
  updateSpriteFrame();
}

// Aktualisiert das Sprite-Frame basierend auf Richtung und Animationsframe
function updateSpriteFrame() {
  if (!playerImg) return;
  
  const row = directionRowMap[currentDirection];
  const col = currentFrame;
  
  if (SPRITE_CONFIG.spriteUrl && SPRITE_CONFIG.spriteUrl !== '') {
    // Verwende echtes Sprite-Sheet als Background-Sprite
    playerImg.style.backgroundImage = `url('${SPRITE_CONFIG.spriteUrl}')`;
    playerImg.style.backgroundPosition = `-${col * SPRITE_CONFIG.frameWidth}px -${row * SPRITE_CONFIG.frameHeight}px`;
    playerImg.style.backgroundSize = `${SPRITE_CONFIG.frameWidth * SPRITE_CONFIG.framesPerRow}px ${SPRITE_CONFIG.frameHeight * SPRITE_CONFIG.rows}px`;
    playerImg.style.backgroundRepeat = 'no-repeat';
    playerImg.src = ''; // Leere src wenn background verwendet wird
  } else {
    // DEMO-MODUS: Generiere farbige Frames für Tests
    generateDemoSprite(row, col);
  }
}

// Demo-Sprite-Generator (falls kein Sprite-Sheet vorhanden)
function generateDemoSprite(row, col) {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_CONFIG.frameWidth;
  canvas.height = SPRITE_CONFIG.frameHeight;
  const ctx = canvas.getContext('2d');
  
  // Hintergrundfarbe basierend auf Richtung
  let baseColor;
  switch(row) {
    case 0: baseColor = '#FF4444'; break; // Unten - Rot
    case 1: baseColor = '#44FF44'; break; // Links - Grün
    case 2: baseColor = '#4444FF'; break; // Rechts - Blau
    case 3: baseColor = '#FFFF44'; break; // Oben - Gelb
    default: baseColor = '#FFFFFF';
  }
  
  // Karosserie
  ctx.fillStyle = baseColor;
  ctx.fillRect(10, 20, 76, 56);
  
  // Räder
  ctx.fillStyle = '#333333';
  ctx.fillRect(5, 15, 15, 20);
  ctx.fillRect(76, 15, 15, 20);
  ctx.fillRect(5, 61, 15, 20);
  ctx.fillRect(76, 61, 15, 20);
  
  // Windschutzscheibe
  ctx.fillStyle = '#88CCFF';
  ctx.fillRect(35, 25, 26, 20);
  
  // Animations-Frame anzeigen (Punkt oder Linie für Frame-Variation)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Arial';
  ctx.fillText((col + 1).toString(), 44, 55);
  
  // Richtungsanzeige
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px Arial';
  let dirText = '';
  switch(row) {
    case 0: dirText = '▼'; break;
    case 1: dirText = '◀'; break;
    case 2: dirText = '▶'; break;
    case 3: dirText = '▲'; break;
  }
  ctx.fillText(dirText, 44, 80);
  
  playerImg.src = canvas.toDataURL();
  playerImg.style.backgroundImage = '';
}

/* --------------------------
    TASTEN-EVENTS (WASD + Pfeiltasten)
-------------------------- */

document.onkeydown = keyListenerDown;
document.onkeyup = keyListenerUp;

function keyListenerDown(e) {
  const key = e.key.toLowerCase();
  
  // Pfeiltasten
  if (e.key === "ArrowLeft" || key === "a") {
    KEY_EVENTS.left = true;
    e.preventDefault();
  }
  if (e.key === "ArrowUp" || key === "w") {
    KEY_EVENTS.up = true;
    e.preventDefault();
  }
  if (e.key === "ArrowRight" || key === "d") {
    KEY_EVENTS.right = true;
    e.preventDefault();
  }
  if (e.key === "ArrowDown" || key === "s") {
    KEY_EVENTS.down = true;
    e.preventDefault();
  }
}

function keyListenerUp(e) {
  const key = e.key.toLowerCase();
  
  if (e.key === "ArrowLeft" || key === "a") {
    KEY_EVENTS.left = false;
  }
  if (e.key === "ArrowUp" || key === "w") {
    KEY_EVENTS.up = false;
  }
  if (e.key === "ArrowRight" || key === "d") {
    KEY_EVENTS.right = false;
  }
  if (e.key === "ArrowDown" || key === "s") {
    KEY_EVENTS.down = false;
  }
}

/* --------------------------
    BEWEGUNG & ANIMATION
-------------------------- */

function updateMovement() {
  let newX = playerX;
  let newY = playerY;
  let newDirection = currentDirection;
  let moving = false;
  
  // Bewegung bestimmen (Priorität: zuletzt gedrückte Taste könnte man einbauen)
  if (KEY_EVENTS.up) {
    newY -= GAME_CONFIG.characterSpeed;
    newDirection = 'up';
    moving = true;
  }
  if (KEY_EVENTS.down) {
    newY += GAME_CONFIG.characterSpeed;
    newDirection = 'down';
    moving = true;
  }
  if (KEY_EVENTS.left) {
    newX -= GAME_CONFIG.characterSpeed;
    newDirection = 'left';
    moving = true;
  }
  if (KEY_EVENTS.right) {
    newX += GAME_CONFIG.characterSpeed;
    newDirection = 'right';
    moving = true;
  }
  
  // Begrenzung innerhalb des Bildschirms (mit Rand)
  const maxX = window.innerWidth - SPRITE_CONFIG.frameWidth;
  const maxY = window.innerHeight - SPRITE_CONFIG.frameHeight;
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));
  
  // Position aktualisieren
  playerX = newX;
  playerY = newY;
  
  if (playerBox) {
    playerBox.style.left = playerX + 'px';
    playerBox.style.top = playerY + 'px';
  }
  
  // Richtung aktualisieren (wenn Bewegung stattfindet)
  if (moving) {
    if (newDirection !== currentDirection) {
      currentDirection = newDirection;
      currentFrame = 0; // Frame zurücksetzen bei Richtungswechsel
      frameCounter = 0;
    }
    isMoving = true;
  } else {
    isMoving = false;
    currentFrame = 0; // Steh-Frame (erster Frame)
    frameCounter = 0;
  }
  
  // Animation nur bei Bewegung aktualisieren
  if (isMoving) {
    frameCounter++;
    if (frameCounter >= ANIMATION_SPEED) {
      frameCounter = 0;
      currentFrame = (currentFrame + 1) % SPRITE_CONFIG.framesPerRow;
    }
  }
  
  updateSpriteFrame();
}

/* --------------------------
    GAME LOOP
-------------------------- */

function gameLoop() {
  updateMovement();
  setTimeout(gameLoop, 1000 / GAME_CONFIG.gameSpeed);
}

/* --------------------------
    Hub Functions
-------------------------- */

// Entferne die alte movePlayer Funktion, da wir updateMovement verwenden

/* --------------------------
    Screen Functions
-------------------------- */

function showHub() {
  SCREEN[0].forEach((element) => {
    if (element) element.style.display = "block";
  });
  SCREEN[1].forEach((element) => {
    if (element) element.style.display = "none";
  });
  
  // Spieler neu positionieren und Sprite initialisieren
  setTimeout(() => {
    initPlayerSprite();
  }, 50);
}

function showGarage() {
  SCREEN[0].forEach((element) => {
    if (element) element.style.display = "none";
  });
  for (let i = 0; i < SCREEN[1].length; i++) {
    let element = SCREEN[1][i];
    if (!element) continue;

    if (i == 1) {
      element.style.display = "grid";
    } else if (i == 0) {
      element.style.display = "block";
    } else if (i == 3 || i == 5 || i == 7) {
      element.style.position = "absolute";
      element.style.display = "block";
      element.style.bottom = "10px";
      element.style.left = "50%";
      element.style.transform = "translateX(-50%)";
    } else if (i == 2 || i == 4 || i == 6) {
      element.style.display = "block";
      element.style.position = "relative";
      element.style.paddingBottom = "60px";
    } else {
      element.style.display = "block";
    }
  }
}

/* --------------------------
    Upgrade Functions
-------------------------- */

function upgradeMotor() {
  if (UPGRADES[0] != 7) {
    UPGRADES[0]++;
    showUpgradeCarImg();
    // Motor-Upgrade erhöht Geschwindigkeit
    GAME_CONFIG.characterSpeed = 5 + UPGRADES[0] * 0.5;
    updatePowerDisplay();
  } else {
    alert("Motor is already at max level!");
  }
}

function upgradeGrip() {
  if (UPGRADES[1] != 7) {
    UPGRADES[1]++;
    showUpgradeCarImg();
    updatePowerDisplay();
  } else {
    alert("Grip is already at max level!");
  }
}

function upgradeTransmission() {
  if (UPGRADES[2] != 7) {
    UPGRADES[2]++;
    showUpgradeCarImg();
    updatePowerDisplay();
  } else {
    alert("Transmission is already at max level!");
  }
}

function updatePowerDisplay() {
  const totalPower = UPGRADES[0] + UPGRADES[1] + UPGRADES[2];
  const powerText = document.getElementById('power-text');
  const powerFill = document.getElementById('power-fill');
  
  if (powerText) {
    powerText.textContent = `Power: ${totalPower}`;
  }
  
  if (powerFill) {
    const percentage = (totalPower / 21) * 100; // Max 21 (3x7)
    powerFill.style.width = percentage + '%';
    powerFill.style.height = '100%';
    powerFill.style.backgroundColor = '#FFD700';
    powerFill.style.borderRadius = '0.5rem';
  }
}

function showUpgradeCarImg() {
  const carImg = SCREEN[1][8];
  if (carImg) {
    const originalSrc = carImg.src;
    carImg.src = "./assets/img/F1-Car-Garage-upgrading-version2.png";
    setTimeout(() => {
      carImg.src = "./assets/img/F1-Car-Garage.png";
    }, 1000);
  }
}

/* --------------------------
    Fenster-Resize anpassen
-------------------------- */

function handleResize() {
  // Begrenze Position bei Fensteränderung
  const maxX = window.innerWidth - SPRITE_CONFIG.frameWidth;
  const maxY = window.innerHeight - SPRITE_CONFIG.frameHeight;
  playerX = Math.max(0, Math.min(playerX, maxX));
  playerY = Math.max(0, Math.min(playerY, maxY));
  
  if (playerBox) {
    playerBox.style.left = playerX + 'px';
    playerBox.style.top = playerY + 'px';
  }
}

/* --------------------------
    window.onload Functions
-------------------------- */

window.onload = function () {
  showHub();
  updatePowerDisplay();
  window.addEventListener('resize', handleResize);
  gameLoop();
};