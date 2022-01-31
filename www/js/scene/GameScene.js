import VirtualJoystick from '../../node_modules/phaser3-rex-plugins/plugins/virtualjoystick.js';
import Player from '../helper/Player.js';
import Stars from '../helper/Stars.js';
import ButtonHud from '../helper/ButtonHud.js'
import SpineAnimations from '../helper/animations/SpineAnimations.js'
import MainIndex from '../index.js';

var cursors;
var joystickCursors;
var player;
var stars;
var starsText;
var youWinText;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    preload() {
        this.load.image('ground', './img/platform.png');
        this.load.image('background', './img/city.png');
        this.load.image('star', './img/object/star.png');

        // Load Spineboy
        this.load.setPath('./img/spineboy/');
        this.load.spine('sb', 'demos.json', [ 'atlas1.atlas' ], true);
    }

    create() {
        let deviceWidth = MainIndex.deviceWidth;
        let deviceHeight = MainIndex.deviceHeight;

        this.add.image(deviceWidth/2, deviceHeight/2, 'background');

        let platforms = this.physics.add.staticGroup();
        platforms.create(deviceWidth/2, deviceHeight * 0.9, 'ground').setScale(2.5).refreshBody();

        // Player
        let spineBoy = this.add.spine(deviceWidth*0.2, deviceHeight*0.6, 'sb.spineboy', 'idle', true);        
        spineBoy.setInteractive();
        console.log(spineBoy)

        player = new Player(this, spineBoy, 0.15);
        player.body.setCollideWorldBounds(true);
        this.input.enableDebug(player, 0xff00ff); // Display Hitbox

        // STARS
        stars = new Stars(this, deviceWidth/2, 0, 'star', 5);

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);

        // Interact
        this.physics.add.overlap(player, stars, collectStar, null, this);

        // HUD Text
        starsText = this.add.text(deviceWidth/2, deviceHeight*0.075, 'x', {
            fontSize: '15pt',
            align: "center"
        })
            .setOrigin(0.5, 0.5);;
        
        updateStarsText();

        youWinText = this.add.text(deviceWidth/2, deviceHeight/2, 'YOU WIN!', {
            fontSize: '30pt',
            align: "center"
        });
        youWinText.visible = false;
        youWinText.setOrigin(0.5, 0.5);

        // JOYSTICK
        var joyStick = new VirtualJoystick(this, {
            x: deviceWidth * 0.10,
            y: deviceHeight * 0.75,
            radius: 50
        });

        joystickCursors = joyStick.createCursorKeys();
        cursors = this.input.keyboard.createCursorKeys(); // Keyboard Inputs

        // A+B Button
        new ButtonHud(this, {
            x: deviceWidth * 0.8,
            y: deviceHeight * 0.75,
            color: 0x00cccc,
            name: 'A'
        }, handleButtonA);

        new ButtonHud(this, {
            x: deviceWidth * 0.9,
            y: deviceHeight * 0.75,
            color: 0xcc00cc,
            name: 'B'
        }, handleButtonB);

        window.addEventListener('resize', resize);
        resize();
    }

    update() {
        if (stars.countActive() == '0' && youWinText.visible == false) {
            youWinText.visible = true;
            this.time.delayedCall(3000, function () {
                this.scene.start('titleScene');
            }, null, this);
        }

        if (player.getCurrentAnimation().name != 'jump') {
            SpineAnimations.spineBoyNotJumping();
        }

        // if (cursors.left.isDown) { // Keyboard Left Arrow
        if (joystickCursors.left.isDown) {
            player.body.setVelocityX(-160);
            SpineAnimations.spineboyRun(player);
            player.body.setOffset(player.width, 0);
            player.setScale(-0.15, 0.15);
        // } else if (cursors.right.isDown) { // Keyboard Right Arrow
        } else if (joystickCursors.right.isDown) {
            player.body.setVelocityX(160);
            SpineAnimations.spineboyRun(player);
            player.body.setOffset(0, 0);
            player.setScale(0.15, 0.15);
        } else {
            player.body.setVelocityX(0);
            SpineAnimations.spineboyIdle(player);
        }
    }
}

// Stars Handlers
function collectStar (player, star) {
    star.disableBody(true, true)
    updateStarsText();
}

function updateStarsText() {
    starsText.setText("Stars left: " + stars.countActive() + "/"+ stars.children.size);
}

// Button Handlers
function handleButtonA(button, gameObject) {
    SpineAnimations.spineBoyJump(player);
}

function handleButtonB(button, gameObject) {
    SpineAnimations.spineBoyShoot(player);
}


// Responsive Sizing
function resize() {
    var canvas = MainIndex.game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}