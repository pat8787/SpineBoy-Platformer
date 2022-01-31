import GameScene from './scene/GameScene.js';
import TitleScene from './scene/TitleScene.js';

var deviceWidth = 844; //innerWidth * window.devicePixelRatio;
var deviceHeight = 390; //innerHeight * window.devicePixelRatio;
var config = {
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: deviceWidth,
        height: deviceHeight
    },
    input: {
        activePointers: 3 
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: [TitleScene, GameScene],
    plugins: {
        scene: [
            { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
        ]
    }
};

var game = new Phaser.Game(config);

export default { game, deviceWidth, deviceHeight };