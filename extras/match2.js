var game;
var gameWidth;
var gameHeight;
var gameCanvas;
var gameLevel;
var tileBase;
var colourBase;
var matched;

var allColours = [
    "pink",
    "lightblue",
    "orange",
    "green",
    "red",
    "yellow",
    "black",
    "white",
    "lightpink",
    "magenta",
    "torquise"
]


// On Load -> Reset game
$(document).ready(function () {

    loadGlobals();
    drawGameBoard();
    assignColours();

    var flippedColour = null;
    var flippedId = null;
    var block = null;

    $("#game").on('click', '.tile', function () {
        if (block == null) {

            tileId = this.id;
            if ($("#" + tileId).css("background-color") == "rgb(0, 139, 139)") {

                // Flip first tile
                if (flippedColour == null) {
                    $("#" + tileId).css("background-color", tileBase[tileId]);
                    flippedColour = tileBase[tileId];
                    flippedId = tileId;
                }

                // Check second tile
                else {

                    // Check that it's a different tile
                    if (tileId != flippedId) {

                        // Increment moves count
                        $("#moves").html(parseInt($("#moves").html()) + 1);

                        // Did not match, flip back
                        if (tileBase[tileId] != flippedColour) {
                            $("#" + tileId).css("background-color", tileBase[tileId]);

                            block = setTimeout(function () {
                                $("#" + tileId).css("background-color", "darkcyan");
                                $("#" + flippedId).css("background-color", "darkcyan");
                                flippedColour = null;
                                block = null;
                            }, 500);
                        }

                        // Matched (increment count)
                        else {
                            $("#" + tileId).css("background-color", tileBase[tileId]);
                            matched++;
                            flippedColour = null;

                            // Game complete!
                            if (matched == Math.pow(gameLevel * 2, 2) / 2) {
                                setTimeout(function () {
                                    alert("Level up");
                                    gameLevel++;
                                    levelUp();
                                }, 500);
                            }
                        }
                    }
                }
            }
        }
    });
});


$(document).keyup(function (e) {
    // Check for enter key
    if (e.which == 13) {
        if (gameLevel < 5) {
            gameLevel++;
            refreshCanvas();
            drawGameBoard(gameLevel);
            assignColours(gameLevel);
        }
    }
});

function reset() {
    gameLevel = 1;
    $("#moves").html("0");
    refreshCanvas();
    drawGameBoard();
    assignColours();
}

function loadGlobals() {
    game = $("#game");
    gameWidth = game.width();
    gameHeight = game.height();
    tileBase = {};
    matched = 0;
    gameLevel = 1;
    colourBase = allColours.slice(0, 4);
}

function refreshCanvas() {
    game.html("");
    // $("#moves").html("0");
    matched = 0;
    $("#level").html(gameLevel);
}


function levelUp() {
    if (gameLevel > 5) {
        refreshCanvas();
        drawGameBoard(5);
        assignColours(5);
    }
    else {
        refreshCanvas();
        drawGameBoard(gameLevel);
        assignColours(gameLevel);
    }
}


function drawGameBoard(level = 1) {

    var gameTable = drawTable();

    var cols = level * 2;

    for (var i = 0; i < cols; i++) {
        row = drawRow(gameTable, i);
        for (var j = 0; j < cols; j++) {
            drawTile(row, i, j);
        }
    }

    $(".tile").height($(".tile").width())
}


function drawTable() {
    game.append('<table id="main"></table>');
    return $("#main");
}

function drawRow(table, id) {
    table.append('<tr id="rid' + id + '"></tr>');
    return $("#rid" + id);

}

function drawTile(row, rid, cid) {
    row.append('<th class="tile" id="r' + rid + 'c' + cid + '"></th>');
}


function assignColours(level = 1) {
    var cols = level * 2;
    var tileList = []

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < cols; j++) {
            var tileId = "r" + i + "c" + j;
            tileList.push(tileId);
        }
    }

    var colourIndex = 0;
    var tileIndex;
    while (tileList.length > 0) {

        // Choose a random tile
        tileIndex = Math.round(Math.random() * 100) % tileList.length;
        // Assign colour
        tileBase[tileList[tileIndex]] = colourBase[colourIndex % colourBase.length];
        // Remove tile from list
        tileList.splice(tileIndex, 1);

        // Choose another tile
        tileIndex = Math.round(Math.random() * 100) % tileList.length;
        // Assign colour
        tileBase[tileList[tileIndex]] = colourBase[colourIndex % colourBase.length];
        // Remove tile from list
        tileList.splice(tileIndex, 1);

        // Next colour
        colourIndex++;
    }

}


$(document).ready(function () {

    // Adjust difficulty
    $("#difficulty").change(function () {
        var difficulty = $("#difficulty").val();
        $("#diff").html($("#difficulty").val());

        colourBase = allColours.slice(0, difficulty);
    });
});