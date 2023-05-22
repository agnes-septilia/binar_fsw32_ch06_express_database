// WORKFLOW: 
// if one button is clicked:
//  -- background changed
//  -- computer randomly run the choice
//  -- decided if it's win/lose/draw
//  -- if other button is clicked --> nothing happened
//  -- if refresh button is clicked --> set all to default 



/// ------------ ///
/// DEFINE CLASS ///
/// ------------ ///

class gameActions {
    constructor(element) {
        this.element = element 
    }

    // computer randomly chooses the weapon
    #randomNum = null

    #randomChoice() {
        this.#randomNum = Math.floor(Math.random() * this.element.length)
    }
    
    randomSelected () {
        this.#randomChoice()
        return this.#randomNum
    }

}


class changeStyle extends gameActions {
    constructor(element, value) {
        super(element)
        this.value = value
    }

    // change background when the player choose the weapon 
    #changeBackground(element, value) {
        element.style.backgroundColor = value.backgroundColor
    }

    #changeBorder(element, value) {
        element.style.borderRadius = value.borderRadius
    }

    changeBackground() {
        this.#changeBackground(this.element, this.value)
        this.#changeBorder(this.element, this.value)
    }

    // change visibility of result 
    seeResult() {
        this.element.style.visibility = this.value;
    }


}



/// --------------- ///
/// DEFINE VARIABLE ///
/// --------------- ///

// variable for weapons
const playerWeapons = document.querySelectorAll('.player-weapons');
const comWeapons = document.querySelectorAll('.com-weapons');

// variable for result elements
const refreshButton = document.getElementById("refresh");
const vsSign = document.getElementById("versus");
const playerWinSign = document.getElementById("player-win");
const comWinSign = document.getElementById("com-win");
const drawSign = document.getElementById("draw");



/// -------------- ///
/// DEFINE ACTIONS ///
/// -------------- ///

// reset page to default when refresh button is clicked
refreshButton.addEventListener('click', function reset() {
    location.reload();
});

// variable to indicate whether the button is clicked
let buttonClicked = false;

// the game --> run on click
playerWeapons.forEach((weapon) => {
    weapon.addEventListener('click', function onClick() {

        // disregard changes upon any click after the game 
        if (buttonClicked) {
            return;
        }

        // player chooses the weapon
        const playerSelected = new changeStyle(weapon, {backgroundColor: "#C4C4C4", borderRadius: "20%"})
        playerSelected.changeBackground()
        const playerElement = playerSelected.element.className.split(' ')[1]

        // computer randomly chooses the weapon
        const comRandom = new gameActions(comWeapons)
        const comSelected = new changeStyle(comWeapons[comRandom.randomSelected()], {backgroundColor: "#C4C4C4", borderRadius: "20%"})
        comSelected.changeBackground()
        const comElement = comSelected.element.className.split(' ')[1]

        // define visibility of result
        const vsSignHidden = new changeStyle(vsSign, 'hidden')
        const playerWinShow = new changeStyle(playerWinSign, 'visible')
        const comWinShow = new changeStyle(comWinSign, 'visible')
        const drawShow = new changeStyle(drawSign, 'visible')

        vsSignHidden.seeResult()

        // condition for the game result
        if (playerElement === comElement) {
            drawShow.seeResult(); 
        }
        else if (playerElement === "rock") {
            if (comElement === "paper") {
                comWinShow.seeResult();
            } else {
                playerWinShow.seeResult();
            }
        }
        else if (playerElement === "paper") {
            if (comElement === "scissors") {
                comWinShow.seeResult();
            } else {
                playerWinShow.seeResult();
            }
        }
        else {
            if (comElement === "rock") {
                comWinShow.seeResult();
            } else {
                playerWinShow.seeResult();
            }
        }

        // indicate that the button has been clicked
        buttonClicked = true;

    })
})

    







