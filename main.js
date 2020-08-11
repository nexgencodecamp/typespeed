var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

    let container = this.add.container(100, 100);

    let box = this.physics.add.sprite(0, 0, 'box')
    let text = this.add.text(0, 0, 'Testing');
    text.font = "Arial";
    text.setOrigin(0.5, 0.5);
    container.add(box)
    container.add(text)

    this.tweens.add({
        targets: container,
        x: text.x + 700,
        ease: 'Power1',
        duration: 3000,
        delay: 500,
        yoyo: true,
        repeat: -1
    });

    //  Receives every single key down event, regardless of origin or key

    this.input.keyboard.on('keydown', function (event) {
        console.log("KEY:", String.fromCharCode(event.keyCode));
    });

}

function update() {

}