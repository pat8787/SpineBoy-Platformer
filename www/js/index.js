import VirtualJoystick from '../node_modules/phaser3-rex-plugins/plugins/virtualjoystick.js';
import Button from '../node_modules/phaser3-rex-plugins/plugins/button.js';

var deviceWidth = 844;//innerWidth * window.devicePixelRatio;
var deviceHeight = 390; //innerHeight * window.devicePixelRatio;
var config = {
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
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
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    plugins: {
        scene: [
            { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
        ]
    }
};

var game = new Phaser.Game(config);

var cursors;
var joystickCursors;
var player;
var isJumping;

function preload() {
    this.load.image('ground', './img/platform.png');
    this.load.image('background', './img/city.png');

    // Load Spineboy
    this.load.setPath('./img/spineboy/');
    this.load.spine('sb', 'demos.json', [ 'atlas1.atlas' ], true);
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();

    this.add.image(deviceWidth/2, deviceHeight/2, 'background');

    var platforms = this.physics.add.staticGroup();
    platforms.create(deviceWidth/2, deviceHeight * 0.9, 'ground').setScale(2.5).refreshBody();

    var spineBoy = this.add.spine(deviceWidth*0.2, deviceHeight/4, 'sb.spineboy', 'idle', true);
    
    spineBoy.setInteractive();
    console.log(spineBoy)
    player = this.physics.add.existing(spineBoy).setScale(0.15);

    // player.body.setBounce(0.2);
    player.body.setCollideWorldBounds(true);
    
    this.input.enableDebug(player, 0xff00ff);

    var joyStick = new VirtualJoystick(this, {
        x: deviceWidth * 0.10,
        y: deviceHeight * 0.75,
        radius: 50
    });

    joystickCursors = joyStick.createCursorKeys();

    createBtn(this, {
        x: deviceWidth * 0.8,
        y: deviceHeight * 0.75,
        color: 0x00cccc,
        name: 'A'
    }, handleSpineBoyJump);

    createBtn(this, {
        x: deviceWidth * 0.9,
        y: deviceHeight * 0.75,
        color: 0xcc00cc,
        name: 'B'
    }, handleSpineBoyShoot);


    this.physics.add.collider(player, platforms);

    window.addEventListener('resize', resize);
    resize();
}

const GetValue = Phaser.Utils.Objects.GetValue;
var createBtn = function (scene, config, onClick) {
    var x = GetValue(config, 'x', 0);
    var y = GetValue(config, 'y', 0);
    var color = GetValue(config, 'color', 0xffffff);
    var name = GetValue(config, 'name', '');

    var btn = scene.add.rectangle(x, y, 50, 50, color)
        .setName(name);
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

function handleSpineBoyJump(button, gameObject) {
    if (player.body.touching.down) {
        player.body.setVelocityX(0);
        player.body.setVelocityY(-200);
        player.clearTrack(1);
        player.setAnimation(0, 'jump', false, true);
        player.addAnimation(0, 'idle', false);
        isJumping = true;
    }
}

function handleSpineBoyShoot(button, gameObject) {
    if (player.body.touching.down) {
        player.clearTracks();
        player.setAnimation(0, 'shoot', false, true);
        player.addAnimation(0, 'idle', false);
    }
}

function update() {
    
    if (player.getCurrentAnimation().name != 'jump') {
        isJumping = false;
    }

    // if (cursors.left.isDown) {
    if (joystickCursors.left.isDown) {
        player.body.setVelocityX(-160);
        spineboyRun();
        player.body.setOffset(player.width, 0);
        player.setScale(-0.15, 0.15);
    // } else if (cursors.right.isDown) {
    } else if (joystickCursors.right.isDown) {
        player.body.setVelocityX(160);
        spineboyRun();
        player.body.setOffset(0, 0);
        player.setScale(0.15, 0.15);
    } else {
        player.body.setVelocityX(0);
        spineboyIdle();
    }
}

function spineboyRun() {
    if (!isJumping) {
        player.setAnimation(1, 'run', true, true);
    }
}

function spineboyIdle() {
    if (!isJumping) {
        player.setAnimation(1, 'idle', true, true);
    }
}

function resize() {
    var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}