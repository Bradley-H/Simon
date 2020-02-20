"use strict";
var green = document.querySelector('#green[data-id="1"]');
var red = document.querySelector('#red[data-id="2"]');
var yellow = document.querySelector('#yellow[data-id="3"]');
var blue = document.querySelector('#blue[data-id="4"]');
var start = document.querySelector('#level-title');
var turnCounter = document.querySelector('#turn');
var again = document.querySelector('#again');
var order = [];
var playerOrder = [];
var flash;
var turn = 0;
var intervalID;
var toWin = 13;
var incorrect = 0;
var on = false;
var good;
var win;
var noise;
var compTurn;
function clearColors() {
    red.style.backgroundColor = 'red';
    green.style.backgroundColor = 'green';
    yellow.style.backgroundColor = 'yellow';
    blue.style.backgroundColor = 'blue';
}
function play() {
    turn = 1;
    clearColors();
    again.style.display = "none";
    turnCounter.textContent = "Round " + turn;
    win = false;
    order = [];
    for (var i = 0; i < toWin; i++) {
        order.push(Math.floor(Math.random() * 4) + 1);
    }
    playerOrder = [];
    flash = 0;
    intervalID = 0;
    incorrect = 0;
    on = true;
    good = true;
    noise = true;
    compTurn = true;
    intervalID = setInterval(gameTurn, 875);
}
function gameTurn() {
    if (flash == turn) {
        clearInterval(intervalID);
        compTurn = false;
        clearColors();
        on = true;
    }
    if (compTurn) {
        on = false;
        clearColors();
        setTimeout(function () {
            playSound(order[flash]);
            flash++;
        }, 200);
    }
}
function playSound(val) {
    flashColors(val);
    noise = true;
    if (noise) {
        var audio = document.querySelector("audio[data-id='" + val + "'] ");
        audio.currentTime = 0;
        audio.play();
    }
}
function color(val) {
    if (on) {
        playerOrder.push(val);
        playSound(val);
        check();
        if (!win) {
            setTimeout(function () {
                incorrect !== 3 ? clearColors() : "";
            }, 250);
        }
    }
}
function check() {
    if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
        good = false;
    if (playerOrder.length == toWin && good) {
        won();
    }
    if (good == false) {
        flashColors(1, 2, 3, 4);
        playSound(5);
        turnCounter.textContent = "Incorrect";
        incorrect++;
        if (incorrect !== 3) {
            setTimeout(function () {
                turnCounter.textContent = "Round " + turn;
                clearColors();
                compTurn = true;
                flash = 0;
                playerOrder = [];
                good = true;
                intervalID = setInterval(gameTurn, 800);
            }, 750);
            noise = false;
        }
        incorrect == 3 ? lose() : "";
    }
    if (turn == playerOrder.length && good && !win) {
        compTurn = true;
        turn++;
        playerOrder = [];
        flash = 0;
        turnCounter.textContent = "Round " + turn;
        intervalID = setInterval(gameTurn, 750);
    }
}
function flashColors(val, val2, val3, val4) {
    val === 1 ? green.style.backgroundColor = 'lightGreen' : "";
    val2 || val === 2 ? red.style.backgroundColor = 'tomato' : "";
    val3 || val === 3 ? yellow.style.backgroundColor = 'lightyellow' : "";
    val4 || val === 4 ? blue.style.backgroundColor = 'lightBlue' : "";
}
function won() {
    flashColors(1, 2, 3, 4);
    turnCounter.textContent = "You've Won !";
    again.style.display = "block";
    again.textContent = "Play again?";
    on = false;
    win = true;
}
function lose() {
    on = false;
    turnCounter.textContent = "You've Lost, you made it to round " + turn + " !";
    again.style.display = "block";
    again.textContent = "Play again?";
    flashColors(1, 2, 3, 4);
}
green.addEventListener('click', function () { return color(1); });
red.addEventListener('click', function () { return color(2); });
yellow.addEventListener('click', function () { return color(3); });
blue.addEventListener('click', function () { return color(4); });
again.addEventListener('click', function () { return play(); });
start.addEventListener('click', function () {
    play();
    start.style.display = "none";
    clearColors();
    turnCounter.textContent = "Round " + turn;
});
