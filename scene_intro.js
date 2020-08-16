let Scene_Intro = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function SceneA() {
        Phaser.Scene.call(this, { key: 'scene_intro' });
    },

    preload: function () {
        this.load.image('intro', 'assets/img/intro.png');
        this.load.image('buttonBG', 'assets/img/button-bg.png');
        this.load.image('buttonText', 'assets/img/button-text.png');
    },

    create: function () {
        console.log('Scene Intro...');

        this.add.image(400, 300, 'intro')

        let bg = this.add.image(0, 0, 'buttonBG').setInteractive();
        let text = this.add.image(0, 0, 'buttonText');
        let container = this.add.container(400, 350, [bg, text]);

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
    }
});