
var deviceWidth = 844;//innerWidth * window.devicePixelRatio;
var deviceHeight = 390; //innerHeight * window.devicePixelRatio;
var config = {
    type: Phaser.WEBGL,
    // width: deviceWidth,
    // height: deviceHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: deviceWidth,
        height: deviceHeight
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
        ],
        // global: [{
        //     key: 'rexVirtualJoystick',
        //     plugin: window.VirtualJoystickPlugin,
        //     start: true
        // }]
    }
};

var game = new Phaser.Game(config);

var cursors;
var player;

function preload() {
    // this.scale.lockOrientation('landscape')

    this.load.image('ground', './img/platform.png');
    this.load.image('background', './img/city.png');

    // Load Spineboy
    this.load.setPath('./img/spineboy/');
    this.load.spine('sb', 'demos.json', [ 'atlas1.atlas' ], true);

    // Load Joystick
    // this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();

    this.add.image(deviceWidth/2, deviceHeight/2, 'background');

    var platforms = this.physics.add.staticGroup();
    platforms.create(deviceWidth/2, deviceHeight * 0.9, 'ground').setScale(2.5).refreshBody();

    var spineBoy = this.add.spine(deviceWidth*0.2, deviceHeight/4, 'sb.spineboy', 'idle', true);
    
    // spineBoy.setOffset(0, 0)
    spineBoy.setInteractive();
    console.log(spineBoy.getAnimationList());
    console.log(spineBoy)
    player = this.physics.add.existing(spineBoy).setScale(0.15);

    // player.body.setBounce(0.2);
    player.body.setCollideWorldBounds(true);
    
    this.input.enableDebug(player, 0xff00ff);
    

    // var joyStick = this.plugins.get('rexVirtualJoystick').addPlayer(this, config);
    // console.log(joyStick.pointerX)

    this.physics.add.collider(player, platforms);

    window.addEventListener('resize', resize);
    resize();
}

function update() {
    

    // if (player.getCurrentAnimation().name == 'idle') {
        // player.clearTrack(0)
    // }
    // console.log(player.getCurrentAnimation().name);
    if (cursors.up.isDown && player.body.touching.down)
    {   
        player.clearTrack(1);
        player.setAnimation(0, 'jump', false, true);
        player.addAnimation(0, 'idle', false);
        
        player.body.setVelocityY(-200);
        
    } else if (cursors.left.isDown) {
        player.body.setVelocityX(-160);
        spineboyRun();
        player.body.setOffset(player.width, 0) // mamaya
        player.setScale(-0.15, 0.15);
        
        // spineBoy.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(160);
        spineboyRun();
        player.body.setOffset(0, 0) // mamaya
        player.setScale(0.15, 0.15);
        // spineBoy.setFlipX(true);
    } else {
        player.body.setVelocityX(0);
        spineboyIdle();
    }
}

function spineboyRun() {
    if (player.getCurrentAnimation().name != 'jump') {
        player.setAnimation(1, 'run', true, true);
        // .play('run', true, true);
    }
}

function spineboyIdle() {
    // if (player.getCurrentAnimation(1).name != 'jump') {
        player.setAnimation(1, 'idle', true, true);
        // player.play('idle', true, true);
    // }
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