// Global Constants
const WIDTH = 800
const HEIGHT = 600
const KEYS = Phaser.Input.Keyboard.KeyCodes

// Game variables
let onScreenPhrases = []    // In-game phrases currently on-screen
let containers = []
let currentWord = "";  // This will be the player's answer
let currentWordText    // Screen representation of the current word

var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {

        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL('/');

    this.load.image('box', 'assets/img/box.png');
    this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
}

function create() {
    currentWordText = this.add.bitmapText(400, 550, 'arcade', currentWord, 12).setTint(0xff0000)

    // Receives every single key up event, regardless of origin or key
    this.input.keyboard.on('keyup', (event) => {
        let key = String.fromCharCode(event.keyCode)
        console.log("KEY:", key)

        // If user presses ENTER, they submit an answer
        if (event.keyCode === KEYS.ENTER) {
            testAnswer(this, currentWord)
        }
        else if (event.keyCode === KEYS.BACKSPACE) {
            // Make it look like we are backspacing the typed word
            if (currentWordText.text.length > 0) {
                currentWordText.text = currentWordText.text.slice(0, -1)
                currentWordText.x = (WIDTH / 2) - (currentWordText.width / 2)
                currentWord = currentWordText.text
            }
        }

        else if (event.keyCode === KEYS.RIGHT) {
            // Test adding word to screen - simulate actual process
            addWordToScreen(this, "TESTING")
            // Reset typing area
            currentWordText.text = ""
        }
        else {
            // Print out letters
            currentWord = currentWord.concat(key)
            currentWordText.text = currentWord
            // Always re-align word to be central
            currentWordText.x = (WIDTH / 2) - (currentWordText.width / 2)
            console.dir(currentWordText)

            /* TODO: Add an underline for style */

        }
    });
}

function update() {

}

function testAnswer(self, answer) {
    // Compare the answer with the current set of words/phrases
    // If it matches remove the word/phrase from the set, add to the score, remove word from typing area
    // If no match, do nothing - perhaps make a sound, show an error image

    // Test delete word from screen
    console.log("Word to delete:", answer)
    deleteWordFromScreen(this, answer.trim())

    // Reset word
    currentWordText.text = ""
    currentWord = ""

}

function addWordToScreen(self, w) {
    let container = self.add.container(100, 100)
    container.name = w
    let box = self.physics.add.sprite(0, 0, 'box')
    let text = self.add.text(0, 0, w);
    text.font = "Arial"
    text.setOrigin(0.5, 0.5)
    container.add(box)
    container.add(text)

    // Give a Container velocity by setting it's physics 'body' property
    self.physics.world.enable(container);
    container.body.setVelocity(100, 0).setBounce(1, 0).setCollideWorldBounds(true);

    containers.push(container)
}

function deleteWordFromScreen(self, w) {
    // We have to delete the container to remove it from screen
    // We should also flag or delete it from the onScreenPhrases set
    containers = containers.filter((val, idx) => {
        if (val.name === w) {
            val.destroy()
        }
        return val.name !== w
    })
}