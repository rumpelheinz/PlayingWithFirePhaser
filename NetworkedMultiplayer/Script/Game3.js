//var game = new Phaser.Game(config);
var config;
var phaz = this;
var game;
var changes = [];
var Input1 = [];
var Input2 = [];
var Input3 = [];
var Input4 = [];


var xlength = 17;
var ylength = 17;



const socket = io('http://localhost:3000/server');
socket.on('toserver', (msg) => {
    console.log("toserver");
    console.log(msg);
    for (var i in msg.data) {
        data = msg.data[i];
        switch (data.type) {
            case('CONTROL'): {
                if (msg.player === 1) {
                    Input1 = data.data;
                    console.log("id1")
                }
                if (msg.player === 2)
                    Input2 = data.data;

                if (msg.player === 3)
                    Input3 = data.data;

                if (msg.player === 4)
                    Input4 = data.data;

                break;
            }
            default:
                ;
        }
    }

});
function reloadAll(){socket.emit('toclient', [{type: 'reload'}]);}



var id = 0;

config = {
    type: Phaser.AUTO,
    width: 32 * 17,
    height: 32 * 17,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    canvas: document.getElementById('gamewindow')

};
game = new Phaser.Game(config);

function verify() {
    var text = document.getElementById("password").value;
    fetch(text).then(function () {

    }).catch(function () {

    });
}

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('block', 'assets/Blocks/sandBlock.png');
    this.load.image('crate', 'assets/Blocks/darkGrassDirtBlock.png');
    this.load.spritesheet('dude1',
        'assets/guy.png',
        {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('dude2',
        'assets/rpgsprites1/mage_m.png',
        {frameWidth: 32, frameHeight: 36});
    this.load.spritesheet('dude3', 'assets/rpgsprites1/warrior_f.png',
        {frameWidth: 32, frameHeight: 36});
    this.load.spritesheet('dude4', 'assets/rpgsprites1/ranger_f.png',
        {frameWidth: 32, frameHeight: 36});
    this.load.spritesheet('explosion',
        'assets/explosion.png',
        {frameWidth: 32, frameHeight: 32});
    for (var i = 0; i < 20000; i++) {
        console.log(i)
    }
}

var explosions;
var star;
var platforms;
var players;
var bombs;
var gameOver = false;

var newcrates = [];
var newExplosions = [];
var newPowerups = [];
var newBombs = [];

var explosionlist = [];
var bomblist = [];
var cratelist = [];

function blowup(player, explosion) {

    if ((Math.abs(player.x + 16 - (explosion.x)) > 16 && explosion.dir === 'y') ||
        (Math.abs(player.y + 16 - (explosion.y)) > 16 && explosion.dir === 'x'))
        return;

    if (!player.immune) {
        player.lives--;
        player.immune = true;
        player.immuneticks = 60 * 2;
        player.setTint(0xff0000);
        var playerchanges = {type: 'players', player: player.id,tint:'0xff0000'};
        changes.push(playerchanges)
        if (player.lives === 0) {

            document.getElementById('overlaywindow').style.display = 'block';
            var id = (player.id === 1) ? '2' : '1';
            document.getElementById('playernumber').innerText = id;
            document.addEventListener("keyup", function (event) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                    // Trigger the button element with a click
                    location.reload();
                }
            });

            gameOver = true;
        }
    }


}

function bombHitExplosion(bomb, explosion) {
    console.log("bomb");
    bomb.explode();
}


function crateHitExplosion(crate, explosion) {
    crate.explode(crate);
}

function createCrate(i, j) {
    var crate = crates.create(i * 32, j * 32, 'crate').setOrigin(0, 0).refreshBody();

    id++;
    newcrates.push({x: crate.x, y: crate.y, id: id});
    crate.id = id;
    crate.explode = function (crate) {
        createPowerup(crate.x, crate.y);
        var index = cratelist.indexOf(crate);
        if (index > -1) {
            cratelist.splice(index, 1);
            console.log("crate removed")
        }
        changes.push({type: 'destroycrate', data: crate.id});
        crate.destroy();
    };
    cratelist.push(crate);
}

function create() {


    bombs = this.physics.add.group();
    explosions = this.physics.add.group();
    bombs = this.physics.add.group();
    powerups = this.physics.add.group();
    players = this.physics.add.group();
    crates = this.physics.add.staticGroup();


    platforms = this.physics.add.staticGroup();

    this.add.image(400, 300, 'sky');
    for (i = 0; i < ylength; i++)
        platforms.create(0, i * 32, 'block').setOrigin(0, 0).refreshBody();
    for (i = 1; i < xlength; i++)
        platforms.create(i * 32, 0, 'block').setOrigin(0, 0).refreshBody();
    for (i = 1; i < xlength; i++)
        platforms.create(i * 32, 16 * 32, 'block').setOrigin(0, 0).refreshBody()//.setOrigin(0, 0);
    for (i = 1; i < ylength; i++)
        platforms.create(16 * 32, i * 32, 'block').setOrigin(0, 0).refreshBody()//.setOrigin(0, 0);

    for (i = 1; i < 15; i++) {
        for (j = 1; j < 15; j++) {
            if (i % 2 == 0 && j % 2 == 0 && i != xlength && j != ylength)
                platforms.create(i * 32, j * 32, 'block').setOrigin(0, 0).refreshBody();

        }
    }

    createAnims(this);


    this.physics.add.collider(players, platforms);
    this.physics.add.collider(players, explosions, blowup, null, this);
    this.physics.add.collider(players, powerups, powerplayer, null, this);
    this.physics.add.collider(bombs, explosions, bombHitExplosion, null, this);
    this.physics.add.collider(crates, explosions, crateHitExplosion, null, this);

    resetGame(this);

}

function clearGroup(group) {
    for (var i in group.children.entries) {
        group.children.entries[i].destroy();
    }
}

function resetGame(game) {
    clearGroup(bombs);
    clearGroup(explosions);
    clearGroup(powerups);
    clearGroup(players);
    clearGroup(crates);

    newcrates = [];
    newExplosions = [];
    newPowerups = [];
    newBombs = [];

    explosionlist = [];
    bomblist = [];
    cratelist = [];


    for (i = 1; i < xlength - 1; i++)
        for (j = 1; j < ylength - 1; j++) {
            if ((j == 1 && (i == 1 || i === 2 || i === xlength - 2 || i === xlength - 3))
                || (j == 2 && (i == 1 || i === xlength - 2))
                || (j == ylength - 3 && (i == 1 || i === xlength - 2))
                || (j == ylength - 2 && (i == 1 || i === 2 || i === xlength - 2 || i === xlength - 3))
                || (j % 2 === 0 && i % 2 === 0)
            )
                continue;
            if (Math.round(Math.random() * 2) == 2) {
                continue
            }
            createCrate(i, j);

        }
    newcrates = {type: 'newCrates', data: newcrates};
    changes.push(newcrates)


    /* let player1 = createplayer(32, 32, '0xffffff', this, {
         DOWN: this.input.keyboard.addKey(83),
         RIGHT: this.input.keyboard.addKey(68),
         LEFT: this.input.keyboard.addKey(65),
         UP: this.input.keyboard.addKey(87),
         BOMB: this.input.keyboard.addKey(16)

     }, 1);*/
    player1 = createplayer(32, 32, '0xffffff', this, {
        DOWN: {isDown: false},
        RIGHT: {isDown: false},
        LEFT: {isDown: false},
        UP: {isDown: false},
        BOMB: {isDown: false},

    }, 1);
    player2 = createplayer(32 * 15, 32 * 15, '0xffffff', this, {
        DOWN: {isDown: false},
        RIGHT: {isDown: false},
        LEFT: {isDown: false},
        UP: {isDown: false},
        BOMB: {isDown: false},
    }, 2);
    player3 = createplayer(32 * 15, 32, '0xffffff', this, {
        DOWN: {isDown: false},
        RIGHT: {isDown: false},
        LEFT: {isDown: false},
        UP: {isDown: false},
        BOMB: {isDown: false},
    }, 3);
    player4 = createplayer(32 * 1, 32 * 15, '0xffffff', this, {
        DOWN: {isDown: false},
        RIGHT: {isDown: false},
        LEFT: {isDown: false},
        UP: {isDown: false},
        BOMB: {isDown: false},
    }, 4);

}


createAnims = function createAnims(obj) {
    obj.anims.create({
        key: 'left' + 1,
        frames: obj.anims.generateFrameNumbers('dude' + 1, {
            start: 15, end: 17
        }),
        frameRate: 10,
        repeat: -1
    });
    obj.anims.create({
        key: 'turn' + 1,
        frames: [{key: 'dude' + 1, frame: 4}],
        frameRate: 20
    });
    obj.anims.create({
        key: 'up' + 1,
        frames: obj.anims.generateFrameNumbers('dude' + 1, {start: 39, end: 41}),
        frameRate: 10,
        repeat: -1
    });

    obj.anims.create({
        key: 'down',
        frames: obj.anims.generateFrameNumbers('dude' + 1, {start: 3, end: 5}),
        frameRate: 10,
        repeat: -1
    });


    obj.anims.create({
        key: 'right' + 1,
        frames: obj.anims.generateFrameNumbers('dude' + 1, {start: 27, end: 29}),
        frameRate: 10,
        repeat: -1
    });

    for (var i = 2; i <= 4; i++) {
        obj.anims.create({
            key: 'left' + i,
            frames: obj.anims.generateFrameNumbers('dude' + i, {
                start: 9, end: 11
            }),
            frameRate: 10,
            repeat: -1
        });
        obj.anims.create({
            key: 'turn' + i,
            frames: [{key: 'dude' + i, frame: 7}],
            frameRate: 20
        });
        obj.anims.create({
            key: 'up' + i,
            frames: obj.anims.generateFrameNumbers('dude' + i, {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        obj.anims.create({
            key: 'down' + i,
            frames: obj.anims.generateFrameNumbers('dude' + i, {start: 6, end: 7}),
            frameRate: 10,
            repeat: -1
        });


        obj.anims.create({
            key: 'right' + i,
            frames: obj.anims.generateFrameNumbers('dude' + i, {start: 3, end: 5}),
            frameRate: 10,
            repeat: -1
        });
    }
    obj.anims.create({
        key: 'boom',
        frames: obj.anims.generateFrameNumbers('explosion', {
            start: 0, end: 99
        }),
        frameRate: 99,
        repeat: -1
    });


    players.children.iterate(function (child) {

        child.anims.play('turn' + 1);

    });


}

function checkFree(x, y) {
    if (!checkFreeWall(x, y)) {
        return false
    }
    return (checkFreeCrate(x, y))

}

function checkFreeWall(x, y) {
    let ret = true;
    for (let i in platforms.children.entries) {
        let wall = platforms.children.entries[i];
        // console.log(Math.floor(wall.x/32) +" "+ Math.floor(x/32)+  " - "+ Math.floor(wall.y/32) +" "+Math.floor(y/32))
        // console.log(player.x+" "+ player.y)
        if (Math.floor(wall.x / 32) === Math.floor(x / 32)) {
            if (Math.floor(wall.y / 32) === Math.floor(y / 32)) {
                return false;
            }
        }
    }
    return true;
}

function checkFreeCrate(x, y) {
    let ret = true;
    for (let i in crates.children.entries) {
        let wall = crates.children.entries[i];
        // console.log(Math.floor(wall.x/32) +" "+ Math.floor(x/32)+  " - "+ Math.floor(wall.y/32) +" "+Math.floor(y/32))
        // console.log(player.x+" "+ player.y)
        if (Math.floor(wall.x / 32) === Math.floor(x / 32)) {
            if (Math.floor(wall.y / 32) === Math.floor(y / 32)) {
                return false;
            }
        }
    }
    return true;
}

function update() {
    if (gameOver)
        return;
    player1.updateInput(Input1);
    player2.updateInput(Input2);
    player3.updateInput(Input3);
    player4.updateInput(Input4);
    players.children.iterate(function (child) {
        child.updatePlayer();
    });
    for (let i in bomblist) {
        let bomb = bomblist[i];
        bomb.tick(bomb);
    }
    for (let i in explosionlist) {
        let exp = explosionlist[i];
        exp.tick(exp);
    }
    if (newExplosions.length > 0) {
        newExplosions = {type: 'newExplosions', data: newExplosions};
        changes.push(newExplosions)
    }
    if (newBombs.length > 0) {
        newBombs = {type: 'newBombs', data: newBombs};
        changes.push(newBombs)
    }
    if (newPowerups.length > 0) {
        newPowerups = {type: 'newPowerups', data: newPowerups};
        changes.push(newPowerups)
    }
    if (changes.length > 0) {
        socket.emit("toclient", changes);
        changes = [];
    }

    newCrates = [];
    newExplosions = [];
    newBombs = [];
    newPowerups = [];
}


function createExplosion(x, y, bomb) {
    var exp = explosions.create(x, y, 'explosion');
    id++;
    newExplosions.push({x: x, y: y, id: id});
    exp.anims.play('boom');
    exp.time = 0;
    exp.bomb = bomb;
    exp.dir = 'n';
    exp.id = id;
    if (bomb.x !== x)
        exp.dir = 'x';
    if (bomb.y !== y)
        exp.dir = 'y';
    exp.tick = function (exp) {
        exp.time++;
        if (exp.time === 99) {

            var index = explosionlist.indexOf(exp);
            if (index > -1) {
                explosionlist.splice(index, 1);
            }
            changes.push({type: 'destroyExplosion', data: exp.id});
            exp.destroy()
        }
    };
    explosionlist.push(exp);
}


//restart()