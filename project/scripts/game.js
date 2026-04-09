const SCREEN = [
    [
        document.getElementById("hub"),
        document.getElementById("hub-image"),
        document.getElementById("player-box"),
        document.getElementById("hub-elements"),
        document.getElementById("goToGarage-button"),
        document.getElementById("live1"),
        document.getElementById("live2"),
        document.getElementById("live3"),
        document.getElementById("garage-power"),
        document.getElementById("power-text"),
        document.getElementById("power-bar"),
        document.getElementById("power-fill")
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
        document.querySelector("#garage .back-button button")
    ]
];

function showHub() {
    SCREEN[0].forEach(element => {
        element.style.display = "block";
    });
    SCREEN[1].forEach(element => {
        element.style.display = "none";
    });
}

function showGarage() {
    SCREEN[0].forEach(element => {
        element.style.display = "none";
    });
    for (let i = 0; i < SCREEN[1].length; i++) {
        if ( i == 1) {
            SCREEN[1][i].style.display = "grid";
        } else if (i == 0) {
            SCREEN[1][i].style.display = "block";
        } else if (i == 3 || i == 5 || i == 7) {
            SCREEN[1][i].style.display = "absolute";
        } else {
            SCREEN[1][i].style.display = "block";
        }
    }
}





/* --------------------------
    window.onload Functions
-------------------------- */
window.onload = function() {
    showHub();
};