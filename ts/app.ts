// DOM SELECTIONS //
const green = document.querySelector<HTMLDivElement>('#green[data-id="1"]')
const red = document.querySelector<HTMLDivElement>('#red[data-id="2"]')
const yellow = document.querySelector<HTMLDivElement>('#yellow[data-id="3"]')
const blue = document.querySelector<HTMLDivElement>('#blue[data-id="4"]')
const start = document.querySelector<HTMLDivElement>('#level-title')
const turnCounter = document.querySelector<HTMLDivElement>('#turn')
const again = document.querySelector<HTMLDivElement>('#again')


// ARRAYS//
let order: number[] = [] //order of the inputs
let playerOrder: number[] = [] //order that the player put in.


// VARIABLES//
let flash: number // number of flashes
let turn: number = 0 //the round it is.
let intervalID: number // ID to clear the inverval
let toWin: number = 13 //to win the game
let incorrect: number = 0 // how many answer you got wrong


// BOOLEANS//
let on: boolean = false //is the game playing
let good: boolean // did you answer correctly
let win: boolean // did you win
let noise: boolean // is the sound playing
let compTurn: boolean // is the comp displaying the order
//////////////////////////////////////////////////////////


// FUNCTIONS //

// CLEARS THE COLORS BACK TO DEFAULT //
function clearColors() {
    red!.style.backgroundColor = 'red'
    green!.style.backgroundColor = 'green'
    yellow!.style.backgroundColor = 'yellow'
    blue!.style.backgroundColor = 'blue'
}

// RESET EVERYTHING //
function play() {
    turn = 1
    clearColors()
    again!.style.display = "none"
    turnCounter!.textContent = `Round ${ turn }`
    win = false
    order = []
    for (let i = 0; i < toWin; i++) {
        order.push(Math.floor(Math.random() * 4) + 1)
    }
    playerOrder = []
    flash = 0
    intervalID = 0
    incorrect = 0
    on = true
    good = true
    noise = true
    compTurn = true
    intervalID = setInterval(gameTurn, 875)
}

// DURING THE GAME'S FLASHING STAGE
function gameTurn() {
    // IF YOU'VE GOTTEN TO THE END OF THE ROUND, IT'll CLEAR EVERYTHING
    if (flash == turn) {
        clearInterval(intervalID)
        compTurn = false
        clearColors()
        on = true
    }
    // IF IT"S THE COMP'S TURN IT"ll CLEAR ALL THE RELEVENT STUFF, PLAY SOUND AND DISPLAY COLORS
    if (compTurn) {
        on = false
        clearColors()
        setTimeout(() => {
            playSound(order[flash]) //THIS ALSO DISPLAYS THE COLORS
            flash++
        }, 200)
    }
}


// PLAYS THE CORRECT SOUNDS AND DISPLAY THE COLOR
function playSound(val: number) {
    flashColors(val)
    noise = true
    if (noise) {
        let audio = document.querySelector<HTMLAudioElement>(`audio[data-id='${ val }'] `)
        audio!.currentTime = 0
        audio!.play()
    }
}

// PUSHES THE VALUE TO THE PLAYER ORDER, PLAYS THE CORRECT SOUND, AND CHECKS THE GAME STATUS
function color(val: number) {
    if (on) {
        playerOrder.push(val)
        playSound(val)
        check()
        if (!win) {
            setTimeout(() => {
                incorrect !== 3 ? clearColors() : ""
            }, 250)
        }
    }
}

// CHECKS YOUR INPUT //
function check() {
    if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
        good = false
    if (playerOrder.length == toWin && good) {
        won()
    }
    if (good == false) {
        flashColors(1, 2, 3, 4)
        playSound(5)
        turnCounter!.textContent = "Incorrect"
        incorrect++
        if (incorrect !== 3) {
            setTimeout(() => {
                turnCounter!.textContent = `Round ${ turn }`
                clearColors()
                compTurn = true
                flash = 0
                playerOrder = []
                good = true
                intervalID = setInterval(gameTurn, 800)
            }, 750)
            noise = false
        }
        incorrect == 3 ? lose() : ""
    }
    if (turn == playerOrder.length && good && !win) {
        compTurn = true
        turn++
        playerOrder = []
        flash = 0
        turnCounter!.textContent = `Round ${ turn }`
        intervalID = setInterval(gameTurn, 750)
    }
}

// FLASHES THE COLOR BASED ON BUTTON YOU CLICKED //
function flashColors(val: number, val2?: number, val3?: number, val4?: number) {
    val === 1 ? green!.style.backgroundColor = 'lightGreen' : ""
    val2 || val === 2 ? red!.style.backgroundColor = 'tomato' : ""
    val3 || val === 3 ? yellow!.style.backgroundColor = 'lightyellow' : ""
    val4 || val === 4 ? blue!.style.backgroundColor = 'lightBlue' : ""
}

// IF YOU"VE WON THE GAME //
function won() {
    flashColors(1, 2, 3, 4)
    turnCounter!.textContent = `You've Won !`
    again!.style.display = "block"
    again!.textContent = "Play again?"
    on = false
    win = true
}

// IF YOU LOST THE GAME //
function lose() {
    on = false
    turnCounter!.textContent = `You've Lost, you made it to round ${ turn } !`
    again!.style.display = "block"
    again!.textContent = "Play again?"
    flashColors(1, 2, 3, 4)
}


//!!  EVENT LISTENERS !!//
green!.addEventListener('click', () => color(1))

red!.addEventListener('click', () => color(2))

yellow!.addEventListener('click', () => color(3))

blue!.addEventListener('click', () => color(4))

again!.addEventListener('click', () => play())

start!.addEventListener('click', () => {
    play()
    start!.style.display = "none"
    clearColors()
    turnCounter!.textContent = `Round ${ turn }`
})