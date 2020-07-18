var game;
var gameWidth;
var gameHeight;
var gameCanvas;
var gameLevel;

var margin = 20;

// On Load -> Reset game
$(document).ready(function () {

    loadGlobals();

    gameLevel = 1;
    initGame(Math.pow(gameLevel*2, 2));

});


$(document).keyup(function (e) {
    // Check for enter key
    if (e.which == 13) {
        if (gameLevel < 5) {
            gameLevel++;
            refreshCanvas();
            initGame(Math.pow(gameLevel*2, 2))
        }
    }
});

function reset() {
    gameLevel = 0;
    refreshCanvas();
}

function loadGlobals() {
    game = $("#game");
    gameWidth = game.width();
    gameHeight = game.height();
    gameCanvas = document.getElementById("game").getContext("2d");
}

function refreshCanvas() {
    gameCanvas.clearRect(0, 0, gameWidth, gameHeight);
}

function initGame(blocks=16) {

    var tile_locations = calculateTiles(blocks);

    console.log(tile_locations);
    for (var i=0; i<blocks; i++) {
        drawTile(tile_locations[i], null);
    }
}


function calculateTiles(blocks) {
    var col = Math.sqrt(blocks);

    var max_width = gameWidth - (2 * margin);
    var max_height= gameHeight - (2 * margin);

    var col_width = Math.floor(max_width / col);
    var col_height = Math.floor(max_height / col);

    var tiles = [];

    w = margin;
    h = margin;
    for (var i=0; i<col; i++) {

        x = w;
        y = h;

        for (var j=0; j<col; j++) {
            tiles.push({
                "x1" : w + (margin/2), "x2" : w + col_width - (margin/2),
                "y1" : h + (margin/2), "y2" : h + col_height - (margin/2)
            })
            w += col_width;
        }
        w = margin;
        h += col_height;
    }

    return tiles;
}

function drawTile(tile_location, colour) {
    gameCanvas.beginPath();
    gameCanvas.rect(tile_location.x1, tile_location.y1, tile_location.x2 - tile_location.x1, tile_location.y2 - tile_location.y1);
    gameCanvas.fillStyle = "#FFFF00";
    gameCanvas.fill();
    gameCanvas.closePath();
}