function placeBomb(x, y,player) {

    console.log(x+" "+y);
    var bomb = bombs.create(snap(x + 16, 32) + 16, snap(y + 16, 32) + 16, 'bomb');
    bomb.player=player;
    bomb.time = 0;
    bomb.explosionrange=player.explosionrange;
    bomb.explode = function () {
        console.log("x")
        bomb.player.bombs++;

        var index = bomblist.indexOf(bomb);
        if (index > -1) {
            bomblist.splice(index, 1);
        }
        createExplosion(bomb.x, bomb.y,bomb);
        for (let i = 1; i < bomb.explosionrange; i++) {
            if (!checkFreeWall(bomb.x - i * 32, bomb.y)) {
                break;
            }
            createExplosion(bomb.x - i * 32, bomb.y,bomb);
            if (!checkFreeCrate(bomb.x - i * 31, bomb.y)) {
                break;
            }

        }
        for (let i = 1; i < bomb.explosionrange; i++) {
            if (!checkFreeWall(bomb.x, bomb.y + i * 32)) {
                break;
            }
            createExplosion(bomb.x, bomb.y + i * 32,bomb);
            if (!checkFreeCrate(bomb.x, bomb.y + i * 32)) {
                break;
            }

        }
        for (let i = 1; i < bomb.explosionrange; i++) {
            if (!checkFreeWall(bomb.x + i * 32, bomb.y)) {
                break;
            }
            createExplosion(bomb.x + i * 32, bomb.y,bomb);
            if (!checkFreeCrate(bomb.x + i * 32, bomb.y)) {
                break;
            }

        }
        for (let i = 1; i < bomb.explosionrange; i++) {
            if (!checkFreeWall(bomb.x, bomb.y - i * 32)) {
                break;
            }
            createExplosion(bomb.x, bomb.y - i * 32,bomb);
            if (!checkFreeCrate(bomb.x, bomb.y - i * 32)) {
                break;
            }

        }
        bomb.destroy()
    };
    bomb.tick = function (bomb) {

        bomb.time++;
        if (bomb.time === 150) {
            bomb.explode();

        }
    };
    bomblist.push(bomb);

}
