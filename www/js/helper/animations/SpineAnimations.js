var isJumping = false;

function spineBoyJump(player) {
    if (player.body.touching.down) {
        player.body.setVelocityX(0);
        player.body.setVelocityY(-200);
        player.clearTrack(1);
        player.setAnimation(0, 'jump', false, true);
        player.addAnimation(0, 'idle', false);
        isJumping = true;
    }
}

function spineBoyShoot(player) {
    if (player.body.touching.down) {
        player.clearTracks();
        player.setAnimation(0, 'shoot', false, true);
        player.addAnimation(0, 'idle', false);
    }
}

function spineboyRun(player) {
    if (!isJumping) {
        player.setAnimation(1, 'run', true, true);
    }
}

function spineboyIdle(player) {
    if (!isJumping) {
        player.setAnimation(1, 'idle', true, true);
    }
}

function spineBoyNotJumping() {
    isJumping = false;
}

export default 
{ 
    spineBoyJump, 
    spineBoyShoot, 
    spineboyRun, 
    spineboyIdle, 
    spineBoyNotJumping
};