var powerups;

function createPowerup(x, y) {
    if (Math.round(Math.random() * 10) >= 7) {
        return
    }

    id++;
    var r = Math.round(Math.random() * 15);
    var pow;
    if (r <= 5) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0);
        pow.id=id;
        pow.type=1;
        pow.power = function (player) {
            player.explosionrange++;
            changes.push({type:'destroyPowerup',data:pow.id});
            pow.destroy();
        }
    }
    else if (r<=10) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0).setTint(0xff0000);
        pow.id=id;
        pow.type=2;
        pow.power = function (player) {
            player.bombs++;
            changes.push({type:'destroyPowerup',data:pow.id});
            pow.destroy();
        }
    }
    else if (r<=15) {
        pow = powerups.create(x, y, 'star').setOrigin(0, 0).setTint(0x00ff00);
        pow.type=3;
        pow.id=id;
        pow.power = function (player) {
            player.speed+=0.5;
            changes.push({type:'destroyPowerup',data:pow.id});
            pow.destroy();
        }
    }
    newPowerups.push({x:pow.x,y:pow.y,powType:pow.type,id:pow.id});

}

function powerplayer(player, powerup) {
    powerup.power(player);
}
