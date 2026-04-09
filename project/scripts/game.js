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
    SCREEN[1].forEach(element => {
        element.style.display = "block";
    });
}





/* --------------------------
    window.onload Functions
-------------------------- */
window.onload = function() {
    showHub();
};