function createplayer(x, y, tint, game, config,id) {
    var GUY = players.create(x, y, 'dude'+id).setOrigin(0, 0);
    GUY.lives = 3;
    GUY.immune = 0;
    GUY.immuneticks = 0;
    GUY.bombs = 1;
    GUY.speed = 1;
    GUY.config = config;
    GUY.setCollideWorldBounds(true);
    GUY.explosionrange = 2;
    GUY.id=id;

    GUY.lastPressed = {left: false, right: false, up: false, down: false};
    GUY.justDown = {left: false, right: false, up: false, down: false};
    GUY.justReleased = {left: false, right: false, up: false, down: false};

    GUY.DOWN = config.DOWN;
    GUY.RIGHT = config.RIGHT;
    GUY.LEFT = config.LEFT;
    GUY.UP = config.UP;
    GUY.BOMB = config.BOMB;


    GUY.move = function (curdir) {
        if ((GUY.x % 32) < GUY.speed)
            GUY.x = Math.round(GUY.x / 32) * 32;
        if ((GUY.y % 32) < GUY.speed)
            GUY.y = Math.round(GUY.y / 32) * 32;

        if (curdir === Phaser.LEFT) {
            if (checkFree(GUY.x - 1, GUY.y) && checkFree(GUY.x - 1, GUY.y + 31)) {
                GUY.x -= GUY.speed;
                GUY.anims.play('left'+id,true);
            }
            else {
                GUY.x = Math.floor((GUY.x) / 32) * 32
                if (checkFree(GUY.x - 1, GUY.y) && !GUY.lastPressed.down && checkFree(GUY.x, GUY.y - 1)) {
                    GUY.y -= Math.min(GUY.speed, (GUY.y - Math.floor(GUY.y / 32) * 32))//=Math.min(2.5,GUY.x-Math.floor(GUY.x))
                    //              GUY.anims.play('up');
                }
                else if (checkFree(GUY.x - 1, GUY.y + 32) && !GUY.lastPressed.up && checkFree(GUY.x, GUY.y + 32)) {
                    GUY.y += Math.min(GUY.speed, (Math.floor(GUY.y + 32 / 32) * 32) - GUY.y)//=Math.min(2.5,GUY.x-Math.floor(GUY.x))
                    //            GUY.anims.play('down');
                }
            }
        }
        if (curdir === Phaser.RIGHT) {
            if (checkFree(GUY.x + 32, GUY.y) && checkFree(GUY.x + 32, GUY.y + 31)) {
                GUY.x += GUY.speed;

                GUY.anims.play('right'+id,true);
            }
            else {
                GUY.x = Math.floor((GUY.x) / 32) * 32;
                if (checkFree(GUY.x + 32, GUY.y) && !GUY.lastPressed.down && checkFree(GUY.x, GUY.y - 1)) {
                    GUY.y -= Math.min(GUY.speed, (GUY.y - Math.floor(GUY.y / 32) * 32))//=Math.min(2.5,GUY.x-Math.floor(GUY.x))
                    //          GUY.anims.play('up');
                }
                else if (checkFree(GUY.x + 32, GUY.y + 32) && !GUY.lastPressed.up && checkFree(GUY.x, GUY.y + 32)) {
                    GUY.y += Math.min(GUY.speed, (Math.floor(GUY.y + 32 / 32) * 32) - GUY.y)//=Math.min(2.5,GUY.x-Math.floor(GUY.x))

                    //        GUY.anims.play('down');
                }
            }
        }
        if (curdir === Phaser.UP) {

            if (checkFree(GUY.x, GUY.y - 1) && checkFree(GUY.x + 31, GUY.y - 1)) {
                GUY.y -= GUY.speed;
                GUY.anims.play('up'+id,true);
            }
            else {
                GUY.y = Math.floor((GUY.y) / 32) * 32;
                if (checkFree(GUY.x, GUY.y - 32) && !GUY.lastPressed.right && checkFree(GUY.x - 1, GUY.y)) {
                    GUY.x -= Math.min(GUY.speed, (GUY.x - Math.floor(GUY.x / 32) * 32))//=Math.min(2.5,GUY.x-Math.floor(GUY.x))
                    //      GUY.anims.play('left');
                }
                if (checkFree(GUY.x + 32, GUY.y - 32) && !GUY.lastPressed.left && checkFree(GUY.x + 32 + 1, GUY.y)) {
                    GUY.x += Math.min(GUY.speed, (Math.floor(GUY.x + 32 / 32) * 32) - GUY.x)//=Math.min(2.5,GUY.x-Math.floor(GUY.x))
                    //    GUY.anims.play('right');
                }
            }
        }
        if (curdir === Phaser.DOWN) {

            if (checkFree(GUY.x, GUY.y + 32) && checkFree(GUY.x + 31, GUY.y + 32)) {
                GUY.y += GUY.speed;
                GUY.anims.play('down'+id,true);
            }
            else {
                GUY.y = Math.floor((GUY.y + GUY.speed) / 32) * 32
                if (checkFree(GUY.x, GUY.y + 32) && !GUY.lastPressed.right && checkFree(GUY.x - 1, GUY.y)) {
                    GUY.x -= Math.min(GUY.speed, (GUY.x - Math.floor(GUY.x / 32) * 32))//=Math.min(2.5,GUY.x-Math.floor(GUY.x))
                    //    GUY.anims.play('left');
                }
                else if (checkFree(GUY.x + 32, GUY.y + 32) && !GUY.lastPressed.left && checkFree(GUY.x + 32, GUY.y)) {
                    GUY.x += Math.min(GUY.speed, (Math.floor(GUY.x + 32 / 32) * 32) - GUY.x)//=Math.min(2.5,GUY.x-Math.floor(GUY.x))
                    //  GUY.anims.play('right');
                }
            }
        }
    }


    GUY.updatePlayer = function (cursors) {

        GUY.immuneticks--;
        if (GUY.immuneticks === 0) {
            GUY.immune = 0;
            GUY.setTint(0xffffff);

        }
        if (GUY.DOWN.isDown && !GUY.lastPressed.down) {
            GUY.justDown.down = true;
        }
        if (GUY.UP.isDown && !GUY.lastPressed.up) {
            GUY.justDown.up = true;
        }
        if (GUY.RIGHT.isDown && !GUY.lastPressed.right) {
            GUY.justDown.right = true;
        }
        if (GUY.LEFT.isDown && !GUY.lastPressed.left) {
            GUY.justDown.left = true;
        }


        if (GUY.DOWN.isDown) {
            GUY.curDir = Phaser.DOWN;
            GUY.lastPressed.down = true;
        }
        if (GUY.UP.isDown) {
            GUY.curDir = Phaser.UP;
            GUY.lastPressed.down = true;
        }
        if (GUY.RIGHT.isDown) {
            GUY.curDir = Phaser.RIGHT;
            GUY.lastPressed.right = true;
        }
        if (GUY.LEFT.isDown) {
            GUY.curDir = Phaser.LEFT;
            GUY.lastPressed.left = true;
        }
        if (GUY.BOMB.isDown && GUY.lastPressed.space === false) {
            GUY.justDown.space = true;
        }

        GUY.lastPressed.down = GUY.DOWN.isDown;
        GUY.lastPressed.up = GUY.UP.isDown;
        GUY.lastPressed.right = GUY.RIGHT.isDown;
        GUY.lastPressed.left = GUY.LEFT.isDown;
        GUY.lastPressed.space = GUY.BOMB.isDown;

        if (GUY.justDown.space && GUY.bombs > 0) {
            GUY.bombs--;
            placeBomb(GUY.x, GUY.y, GUY);
        }


        GUY.justDown.space = false;
        GUY.justDown.up = false;
        GUY.justDown.down = false;
        GUY.justDown.right = false;
        GUY.justDown.left = false;


        GUY.move(GUY.curDir);
        GUY.curDir = Phaser.NONE;

    };
    return GUY;

}


function snap(x, gridsize) {
    return (Math.floor(x / gridsize) * gridsize);
}
