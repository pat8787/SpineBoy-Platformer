export default class Player {
    constructor(scene, spineObject, scale) {
        let player = scene.physics.add.existing(spineObject).setScale(scale);
        return player
    }
}