// Global Constants
const WIDTH = 800
const HEIGHT = 600
const KEYS = Phaser.Input.Keyboard.KeyCodes

// Game variables
let _onScreenPhrases    // In-game phrases currently on-screen
let _containers = []
let currentWord = "";  // This will be the player's answer
let currentWordText    // Screen representation of the current word
let _level = 1
let _nextWord = 0;

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


function setupAndStartLevel(self, levelNum) {
    _onScreenPhrases = LEVEL_1.wordList

    // Create bitmaps & container objects
    _onScreenPhrases.forEach((word, idx) => {
        let container = self.add.container(-100, 100 + (idx * 50))
        container.name = word
        let text = self.add.text(0, 0, word);
        text.font = "Arial"
        text.setOrigin(0.5, 0.5)
        let r = self.add.rectangle(0, 0, text.width + 20, 32, 0x6666ff)
        r.setStrokeStyle(4, 0xefc53f);
        let box = self.physics.add.existing(r)
        container.add(box)
        container.add(text)
        // text.toggleFlipX(); - flips the text!

        container.on('destroy', (obj) => {
            // Set the next word going
            _containers[_nextWord++].body.setVelocity(Phaser.Math.Between(50, 100), 0)
        })

        // Give a Container velocity by setting it's physics 'body' property
        self.physics.world.enable(container);
        _containers.push(container)
    })

    // Set first word going
    _containers[_nextWord++].body.setVelocity(Phaser.Math.Between(50, 100), 0)
}

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
        // TODO: Setup a regular expression to match only a-z and certain keys
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
        else if (event.keyCode === KEYS.RIGHT) { // This will be our 'Game Start'            
            // Setup a few words loaded from a JSON source
            setupAndStartLevel(this, _level)
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
    // Destroy offscreen game objects
    _containers.forEach((val, idx) => {
        if (val.active && val.x > WIDTH + val.first.width / 2) {
            val.destroy()
        }
    })
}

function testAnswer(self, answer) {
    /* 
        Compare the answer with the current set of words/phrases
        If it matches remove the word/phrase from the set, add to the score, remove word from typing area
        If no match, do nothing - perhaps make a sound, show an error image 
    */
    deleteWordFromScreen(self, answer.trim())
    resetCurrentWord()
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

function resetCurrentWord() {
    currentWordText.text = ""
    currentWord = ""
}