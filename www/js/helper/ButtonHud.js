import Button from '../../node_modules/phaser3-rex-plugins/plugins/button.js';

const GetValue = Phaser.Utils.Objects.GetValue;

export default class ButtonHud {
    constructor (scene, config, onClick) {
        var x = GetValue(config, 'x', 0);
        var y = GetValue(config, 'y', 0);
        var color = GetValue(config, 'color', 0xffffff);
        var name = GetValue(config, 'name', '');
    
        var btn = scene.add.rectangle(x, y, 50, 50, color)
            .setName(name).setAlpha(0.75);
        scene.add.text(x, y, name, {
            fontSize: '20pt'
        })
            .setOrigin(0.5, 0.5)
    
        btn.button = new Button(btn, {
            clickInterval: 500
        });
    
        btn.button.on('click', onClick);
        return btn;
    }
}