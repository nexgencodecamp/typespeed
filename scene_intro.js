let Scene_Intro = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function SceneA() {
            Phaser.Scene.call(this, { key: 'scene_intro' });
        },

    preload: function () {
        this.load.image('intro', 'assets/img/intro.png');
    },

    create: function () {
        console.log('Scene Intro');

        this.add.image(400, 300, 'intro')

        //this.scene.start('sceneB');
    }

});