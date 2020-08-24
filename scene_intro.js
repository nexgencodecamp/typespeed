let _intro = ''

let Scene_Intro = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function SceneA() {
        Phaser.Scene.call(this, { key: 'scene_intro' });
    },

    preload: function () {
        //this.load.image('intro', 'assets/img/intro.png');
        this.load.image('buttonBG', 'assets/img/button-bg.png');
        this.load.image('buttonText', 'assets/img/button-text.png');
        this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml')
    },

    create: function () {
        console.log('Scene Intro...');

        //this.add.image(400, 300, 'intro')
        introText = this.add.bitmapText(175, 200, 'arcade', _intro, 12).setTint(0xff0000)

        let bg = this.add.image(0, 0, 'buttonBG').setInteractive();
        let text = this.add.image(0, 0, 'buttonText');
        let container = this.add.container(400, 350, [bg, text]);
        container.visible = false

        bg.on('pointerover', function () {
            this.setTint(0x44ff44);
        });

        bg.on('pointerout', function () {
            this.clearTint();
        });

        bg.on('pointerup', function () {
            console.log("Button pressed")
            this.scene.start('scene_game');
        }, this);

        this.runIntroText(introText, container)
    },

    runIntroText: function (textObj, c) {
        typeWriteText(this,
            textObj,
            "This is a game of wits and speed!\n\nCan you defeat the evil wordsmith by\n\nmoving through the levels?",
            50,
            () => c.visible = true)
    }
});