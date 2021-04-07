var powerups;

function createPowerup(x, y) {

    var r = Math.round(Math.random() * 15);
    var pow;
    if (r <= 5) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0);
    }
    else if (r<=10) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0).setTint(0xffff00);
    }
    else if (r<=15) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0).setTint(0x00ff00);
    }

}

function powerplayer(player, powerup) {
}
