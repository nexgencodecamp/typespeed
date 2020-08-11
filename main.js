const WIDTH = 800
const HEIGHT = 600

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
    let word = "";

    let container = this.add.container(100, 100);

    let box = this.physics.add.sprite(0, 0, 'box')
    let text = this.add.text(0, 0, 'Testing');
    text.font = "Arial";
    text.setOrigin(0.5, 0.5);
    container.add(box)
    container.add(text)

    // This will be the player's answer
    let wordText = this.add.bitmapText(400, 550, 'arcade', word).setTint(0xff0000);

    this.tweens.add({
        targets: container,
        x: text.x + 700,
        ease: 'Power1',
        duration: 3000,
        delay: 500,
        yoyo: true,
        repeat: -1
    });

    // Receives every single key up event, regardless of origin or key
    this.input.keyboard.on('keyup', function (event) {
        let key = String.fromCharCode(event.keyCode)
        console.log("KEY:", key)

        // Print out letters
        word = word.concat(key)
        wordText.text = word
        // Always re-align word to be central
        wordText.x = (WIDTH / 2) - (wordText.width / 2)
        console.dir(wordText)

        /* TODO: Add an underline for style */
        
    });

}

function update() {

}