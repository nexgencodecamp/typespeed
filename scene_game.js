let Scene_Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function SceneA() {
            Phaser.Scene.call(this, { key: 'scene_game' });
        },

    preload: function () {
        this.load.setBaseURL('/')
        this.load.image('box', 'assets/img/box.png')
        this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml')
    },

    create: function () {
        console.log('Scene Game...');

        _currentWordText = this.add.bitmapText(400, 550, 'arcade', _currentWord, 12).setTint(0xff0000)
        _scoreText = this.add.bitmapText(750, 20, 'arcade', "0", 12).setTint(0xff0000)

        // Receives every single key up event, regardless of origin or key
        this.input.keyboard.on('keyup', (event) => {
            let key = String.fromCharCode(event.keyCode)

            // If user presses ENTER, they submit an answer
            // TODO: Setup a regular expression to match only a-z and certain keys
            if (event.keyCode === KEYS.ENTER) {
                this.testAnswer(this, _currentWord)
            }
            else if (event.keyCode === KEYS.BACKSPACE) {
                // Make it look like we are backspacing the typed word
                if (_currentWordText.text.length > 0) {
                    _currentWordText.text = _currentWordText.text.slice(0, -1)
                    _currentWordText.x = (WIDTH / 2) - (_currentWordText.width / 2)
                    _currentWord = _currentWordText.text
                }
            }
            else if (event.keyCode === KEYS.RIGHT) { // This will be our 'Game Start'            
                // Setup a few words loaded from a JSON source
                this.setupAndStartLevel(this, _level)
                // Reset typing area
                _currentWordText.text = ""
            }
            else {
                // Print out letters
                _currentWord = _currentWord.concat(key)
                _currentWordText.text = _currentWord
                // Always re-align word to be central
                _currentWordText.x = (WIDTH / 2) - (_currentWordText.width / 2)

                /* TODO: Add an underline for style */

            }
        });
    },

    update: function () {
        // Destroy offscreen game objects
        _containers.forEach((val, idx) => {
            if (val.active && val.x > WIDTH + val.first.width / 2) {
                val.destroy()
                this.updateScore(SCORE_PENALTY_OUT_OF_TIME_WORD)
            }
        })
    },

    setupAndStartLevel: function (self, levelNum) {
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
                // Set the next word going if there is one!
                if (_nextWord <= _containers.length - 1)
                    _containers[_nextWord++].body.setVelocity(Phaser.Math.Between(50, 100), 0)
            })

            // Give a Container velocity by setting it's physics 'body' property
            self.physics.world.enable(container)
            _containers.push(container)
        })

        // Set first word going
        _containers[_nextWord++].body.setVelocity(Phaser.Math.Between(50, 100), 0)
    },

    testAnswer: function (self, answer) {
        /* 
            Compare the answer with the current WORD
            If it matches remove the word/phrase from the set, add to the score, remove word from typing area
            If no match, do nothing - perhaps make a sound, show an error image 
        */
        let wordToTest = _containers[_nextWord - 1]
        if (wordToTest.name.toUpperCase() === answer.trim().toUpperCase()) {
            this.deleteWordFromScreen(wordToTest)

            // Reset type area & check for end of level
            this.updateScore(SCORE_WORD)
            this.resetCurrentWord()
            this.endOfLevelCheck()
        }
        else {
            // Guess must be wrong! Award penalty points!
            this.updateScore(SCORE_PENALTY_GUESS_INCORRECT)
        }
    },

    deleteWordFromScreen: function (val) {
        // We have to delete the container to remove it from screen    
        val.destroy()
    },

    endOfLevelCheck: function () {
        if (_nextWord === _containers.length) {
            _endOfLevel = true
            console.log("End of Level:", _level)
        }
    },

    resetCurrentWord: function () {
        _currentWordText.text = ""
        _currentWord = ""
    },

    updateScore: function (amt) {
        _score += amt
        _scoreText.text = String(_score)
        console.log(_score)
    }
});