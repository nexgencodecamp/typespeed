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
        this.load.image('buttonModeTraining', 'assets/img/button-bg.png');
        this.load.image('buttonModeWordsPerMin', 'assets/img/button-bg.png');
        this.load.image('buttonModeEasy', 'assets/img/button-bg.png');
        this.load.image('buttonModeMedium', 'assets/img/button-bg.png');
        this.load.image('buttonModeHard', 'assets/img/button-bg.png');
        this.load.image('buttonModeBattle', 'assets/img/button-bg.png');
        this.load.image('buttonText', 'assets/img/button-text.png');
        this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml')
    },

    create: function () {
        console.log('Scene Intro...');

        //this.add.image(400, 300, 'intro')
        introText = this.add.bitmapText(175, 150, 'arcade', _intro, 12).setTint(0xff0000)

        let bg = this.add.image(0, 0, 'buttonBG').setInteractive();
        let text = this.add.image(0, 0, 'buttonText');
        let container = this.add.container(400, 300, [bg, text]);
        container.visible = false

        // TODO: Refactor this to a button create method
        // Modes
        let btnModeTraining = this.add.image(400, 260, 'buttonModeTraining')
        btnModeTraining.setInteractive();
        btnModeTraining.scale = 0.5
        btnModeTraining.setTint(0xff00ff);
        btnTrainingText = this.add.bitmapText(353, 252, 'arcade', "Training", 12).setTint(0xff0000)

        btnModeTraining.on('pointerup', function () {
            this.scene.start('scene_mode_training');
            _mode = MODES.TRAINING
        }, this);

        let btnModeWordsPerMin = this.add.image(400, 320, 'buttonModeWordsPerMin')
        btnModeWordsPerMin.setInteractive();
        btnModeWordsPerMin.scale = 0.5
        btnModeWordsPerMin.setTint(0xffff00);
        btnWordsPerMinText = this.add.bitmapText(353, 312, 'arcade', "Words/Min", 12).setTint(0xff0000)

        let btnModeEasy = this.add.image(400, 380, 'buttonModeEasy')
        btnModeEasy.setInteractive();
        btnModeEasy.scale = 0.5
        btnModeEasy.setTint(0x00ffff);
        btnEasyText = this.add.bitmapText(353, 372, 'arcade', "Easy", 12).setTint(0xff0000)

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
            () => c.visible = false) // temporarily set to false
    }
});