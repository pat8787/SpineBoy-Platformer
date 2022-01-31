import Button from '../../node_modules/phaser3-rex-plugins/plugins/button.js';
import MainIndex from '../index.js';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {

    }

    create() {
        this.add.text(MainIndex.deviceWidth/2, MainIndex.deviceHeight * 0.75, 'Click anywhere to start', {
            fontSize: '20pt',
            align: "center"
        }).setOrigin(0.5, 0.5);
        
        this.input.on('pointerup', function (pointer) {
            this.scene.start('gameScene');
        }, this);
    }
}
