export default class Stars {
    constructor (scene, x, y, imageKey, numberOfStars) {
        let stars = scene.physics.add.group({
            key: imageKey,
            repeat: numberOfStars,
            setXY: { x: x, y: y, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        return stars
    }
}