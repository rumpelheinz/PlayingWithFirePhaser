function createplayer(x, y, tint, game,id) {
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





    GUY.setAnim = function (key) {
        if (key!==GUY.animkey){
            console.log(key+" "+GUY.animkey);
        }
        GUY.animkey=key;
    };


    GUY.updatePlayer = function (cursors) {
        if (GUY.id===1){
            GUY.x=player1.x;
            GUY.y=player1.y;
            GUY.setAnim(player1.animkey)
            GUY.setTint(player1.tint);
        }
        if (GUY.id===2){
            GUY.x=player2.x;
            GUY.y=player2.y;
            GUY.setAnim(player2.animkey)
            GUY.setTint(player2.tint);
        }
        if (GUY.id===3){
            GUY.x=player3.x;
            GUY.y=player3.y;
            GUY.setAnim(player3.animkey)
            GUY.setTint(player3.tint);
        }
        if (GUY.id===4){
            GUY.x=player4.x;
            GUY.y=player4.y;
            GUY.setAnim(player4.animkey)
            GUY.setTint(player4.tint);
        }
    };
    return GUY;

}


function snap(x, gridsize) {
    return (Math.floor(x / gridsize) * gridsize);
}
