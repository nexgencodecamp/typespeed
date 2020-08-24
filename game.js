// Global Constants
const WIDTH = 800
const HEIGHT = 600
const KEYS = Phaser.Input.Keyboard.KeyCodes
const SCORE_WORD = 100
const SCORE_PENALTY_GUESS_INCORRECT = -10
const SCORE_PENALTY_OUT_OF_TIME_WORD = -50
const SCORE_BONUS_LEVEL_1 = 1000
const MODES = {
    TRAINING: "TRAINING",
    WORDS_PER_MIN: "WORDS_PER_MIN",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
    BATTLE: "BATTLE"
}

// Game variables
let _onScreenPhrases    // In-game phrases currently on-screen
let _containers = []
let _currentWord = ""   // This will be the player's answer
let _currentWordText    // Screen representation of the current word
let _level = 1
let _nextLevelText      // Text to show when a level is complete
let _nextWord = 0
let _score = 0
let _endOfLevel = false
let _mode = MODES.TRAINING

let config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {

        }
    },
    scene: [Scene_Intro, Scene_Game]
};

var game = new Phaser.Game(config)