var powerups;

function createPowerup(x, y) {
    if (Math.round(Math.random() * 10) >= 7) {
        return
    }

    var r = Math.round(Math.random() * 15);
    var pow;
    if (r <= 5) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0);
        pow.power = function (player) {
            player.explosionrange++;
            pow.destroy();
        }
    }
    else if (r<=10) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0).setTint(0xffff00);
        pow.power = function (player) {
            player.bombs++;
            pow.destroy();
        }
    }
    else if (r<=15) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0).setTint(0x00ff00);
        pow.power = function (player) {
            player.speed+=0.5;
            pow.destroy();
        }
    }

}

function powerplayer(player, powerup) {
    powerup.power(player);
}
