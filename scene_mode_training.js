_levelTimer = 0
_timeOnLevel = 0
_pausedTempObj = {}

let Scene_Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function SceneModeTraining() {
        Phaser.Scene.call(this, { key: 'scene_mode_training' });
    },

    preload: function () {
        this.load.setBaseURL('/')
        this.load.image('box', 'assets/img/box.png')
        this.load.spritesheet('cursor', 'assets/sprite/cursor_spritesheet.png', { frameWidth: 16, frameHeight: 4 });
        this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml')
        this.load.bitmapFont('azo-fire', 'assets/fonts/bitmap/azo-fire.png', 'assets/fonts/bitmap/azo-fire.xml')
        this.load.audio('typespeed_theme', ['assets/audio/typespeed.mp3']);
    },

    create: function () {
        console.log('Scene Game...');
        createStatusBar(this);

        _currentWordText = this.add.bitmapText(20, 570, 'arcade', _currentWord, 12).setTint(0xff0000)
        _scoreText = this.add.bitmapText(750, 20, 'arcade', "0", 12).setTint(0xff0000)
        _nextLevelText = this.add.bitmapText(400, 300, 'arcade', "", 12).setTint(0x00ff00)
        _pausedText = this.add.bitmapText(400, 280, 'arcade', "", 12).setTint(0x00ff00)
        var config = {
            key: 'blink',
            frames: this.anims.generateFrameNames('cursor', { start: 0, end: 5 }),
            frameRate: 2,
            repeat: -1
        };
        this.anims.create(config);
        _blinkCursor = this.add.sprite(BLINKCURSOR_OFFSET_X, 587, 'cursor');
        _blinkCursor.anims.play('blink');

        // Receives every single key up event, regardless of origin or key
        this.input.keyboard.on('keyup', (event) => {
            let key = String.fromCharCode(event.keyCode)

            if (event.keyCode === KEYS.BACKSPACE && !_paused) {
                // Make it look like we are backspacing the typed word
                if (_currentWordText.text.length > 0) {
                    _currentWord = _currentWord.slice(0, -1)
                    _currentWordText.x = CURRENT_WORD_X
                    this.updateCursorPos(-12)
                }
            }
            else if (event.keyCode === KEYS.SPACE) {
                // Un/Pause the game
                _paused = !_paused
                if (_paused) {
                    // Prevent input
                    // Stop timers
                    // Halt objects
                    _pausedTempObj.wordVelocityX = _containers[_nextWord].body.velocity.x
                    _containers[_nextWord].body.setVelocity(0, 0)
                }
                else {
                    _containers[_nextWord].body.setVelocity(_pausedTempObj.wordVelocityX, 0)
                    _pausedTempObj = {}
                }
            }
            else {
                if (!_paused) {
                    // Update for stats
                    _statusBar.numKeystrokes++
                    // Print out letters
                    _currentWord = _currentWord.concat(key)
                    // Move cursor
                    this.updateCursorPos(12)
                    // Test the current word
                    this.time.addEvent({
                        delay: 250,
                        callback: this.testAnswer,
                        args: [this, _currentWord],
                    });
                }
            }
        });

        // Setup a few words loaded from a JSON source
        this.setupAndStartLevel(this, _level)
    },

    update: function () {
        // Destroy offscreen game objects & reset text
        _containers.forEach((val, idx) => {
            if (val.active && val.x > WIDTH + val.first.width / 2) {
                val.destroy()
                this.updateScore(SCORE_PENALTY_OUT_OF_TIME_WORD)
                this.resetCursor()
                _currentWord = ""
            }
        })

        // Update screen text
        _currentWordText.text = _currentWord

        // Update status bar
        _statusBar.numHitsText.text = "NUM HITS:" + _statusBar.numHits
        _statusBar.accuracyText.text = "ACC:" + _statusBar.accuracy
        _statusBar.wordsPerMinText.text = "W/MIN:" + _statusBar.wordsPerMin

        // Pause
        _pausedText.text = _paused === true ? "PAUSED" : ""
        _pausedText.x = centerText(WIDTH, _pausedText)
    },

    setupAndStartLevel: function (self, levelNum) {
        _currentWord = ""
        _nextLevelText.text = ""
        _onScreenPhrases = ALL_LEVELS.MODES_TRAINING.levels[levelNum - 1].wordList
        let music = self.sound.add('typespeed_theme');

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
                ++_nextWord
                if (_nextWord < _containers.length) {
                    _containers[_nextWord].body.setVelocity(Phaser.Math.Between(50, 100), 0)
                }
            })

            // Give a Container velocity by setting it's physics 'body' property
            self.physics.world.enable(container)
            _containers.push(container)
        })

        // Set first word going
        _containers[_nextWord].body.setVelocity(Phaser.Math.Between(50, 100), 0)
        // Start timer
        _levelTimer = this.time.addEvent({
            delay: 500,                // ms
            callback: this.checkLevelTimer,
            //args: [],
            //callbackScope: thisArg,
            loop: true
        });
        //if (_level === 1)
        //music.play();
    },

    checkLevelTimer: function () {
        _timeOnLevel += 500
    },

    testAnswer: function (self, answer) {
        /* 
            Compare the answer with the current WORD
            If it matches remove the word/phrase from the set, add to the score, remove word from typing area
            If no match, do nothing - perhaps make a sound, show an error image 
        */
        let wordToTest = _containers[_nextWord]

        // Test for accuracy
        if (answer.trim().toUpperCase() === wordToTest.name.toUpperCase().slice(0, answer.trim().length)) {
            _statusBar.numCorrectKeystrokes++
        }
        self.updateStatusBar(false, true, false)

        // OK - THIS IS A HIT !!!
        if (wordToTest.name.toUpperCase() === answer.trim().toUpperCase()) {
            self.deleteWordFromScreen(wordToTest)
            self.resetCursor();
            // Reset type area & check for end of level
            self.updateScore(SCORE_WORD)
            self.updateStatusBar(true, false, true)
            self.resetCurrentWord()
            self.endOfLevelCheck()
        }
    },

    deleteWordFromScreen: function (val) {
        // We have to delete the container to remove it from screen    
        val.destroy()
    },

    resetCursor: function () {
        _blinkCursor.x = BLINKCURSOR_OFFSET_X;
    },

    updateCursorPos: function (amt) {
        _blinkCursor.x += amt
    },

    endOfLevelCheck: function () {
        if (_nextWord === _containers.length) {
            _endOfLevel = true
            console.log("End of Level:", _level)
            _level++
            resetStatusBar()
            this.setNextLevelText()
        }
    },

    resetCurrentWord: function () {
        _currentWord = ""
    },

    updateScore: function (amt) {
        _score += amt
        _scoreText.text = String(_score)
        console.log(_score)
    },

    updateStatusBar: function (bNumHits = false, bAccuracy = false, bWordsPerMin = false) {
        if (bNumHits) _statusBar.numHits++
        if (bAccuracy) _statusBar.accuracy = Math.round((_statusBar.numCorrectKeystrokes / _statusBar.numKeystrokes) * 100)
        if (bWordsPerMin) _statusBar.wordsPerMin = Math.round(++_statusBar.numWords * (60 / (_timeOnLevel / 1000)))
        //console.log("numWords:", _statusBar.numWords, "wordsPerMin", _statusBar.wordsPerMin, "elapsed time:", _timeOnLevel)
    },

    setNextLevelText: function () {
        _nextLevelText.text = `Level ${_level - 1} complete. Get ready...`
        _nextLevelText.x = centerText(WIDTH, _nextLevelText)

        // Start timer countdown for next level
        this.startNextLevel()
    },

    startNextLevel: function () {
        let timer = this.time.addEvent({
            delay: 2000,                // ms
            callback: this.setupAndStartLevel,
            args: [this, _level],
            callbackScope: this,
            loop: false
        });
    }
});

