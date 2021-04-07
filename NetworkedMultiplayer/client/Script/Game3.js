//var game = new Phaser.Game(config);
var config;
var phaz = this
var game;
var changes = [];
var controllchanges = [];
//var socket = io();
const socket = io('/client');


socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
});

var player1 = {player: 1, x: 32, y: 32, animkey: 'up',tint:'0xffffff'};
var player2 = {player: 2, x: 32 * 15, y: 32 * 15, animkey: 'up',tint:'0xffffff'};
var player3 = {player: 3, x: 32 * 15, y: 32, animkey: 'up',tint:'0xffffff'};
var player4 = {player: 4, x: 32, y: 32 * 15, animkey: 'up',tint:'0xffffff'};


socket.on('toclient', function (msg) {
//    console.log(msg);
    for (var i in msg) {
        data = msg[i];
        switch (data.type) {
            case('reload'): {
                console.log("reload")
                location.reload();
                break;
            }
            case('players'): {
                var player;
                if (data.player === 1)
                    player = player1;

                if (data.player === 2)
                    player = player2;

                if (data.player === 3)
                    player = player3;

                if (data.player === 4)
                    player = player4;

                if (data.x !== undefined) player.x = data.x;
                if (data.y !== undefined) player.y = data.y;
                if (data.animkey !== undefined) player.animkey = data.animkey;
                if (data.tint !== undefined) player.tint = data.tint;

                break;


            }

            case('newCrates'): {
                newCrates = data.data;
                resetcrates = true;
                break;
            }
            case('newExplosions'): {
                newExplosions = data.data;
                break;
            }
            case('newPowerups'): {
                newPowerups = data.data;
                break;
            }
            case('newBombs'): {
                // console.log(data.data)
                newBombs = data.data;
                break;
            }
            case('destroyBomb'): {
                var bombId = data.data;
                destroyBomb(bombId);
                break;
            }
            case('destroyPowerup'): {
                console.log(data.data);
                var powId = data.data;
                destroyPowerup(powId);
                break;
            }
            case('destroycrate'): {
                var crateid = data.data;
                destroycrate(crateid);
                break;
            }
            case('destroyExplosion'): {
                var crateid = data.data;
                destroyExplosion(crateid);
                break;
            }
            default:
                ;


        }
    }
});


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
}

var newBombs = [];
var newPowerups = [];
var newCrates = [];
var newExplosions = [];
var resetcrates = false;

var powerups;
var explosions;
var platforms;
var players;
var bombs;
var gameOver = false;


function create() {
    var xlength = 17;
    var ylength = 17;

    this.add.image(400, 300, 'sky');

    bombs = this.physics.add.group();
    explosions = this.physics.add.group();
    bombs = this.physics.add.group();
    powerups = this.physics.add.group();
    players = this.physics.add.group();
    crates = this.physics.add.staticGroup();


    platforms = this.physics.add.staticGroup();


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
    console.log(game);
    let player1 = createplayer(32, 32, 'ffffff', this, 1);
    let player2 = createplayer(32 * 15, 32 * 15, 'ffffff', this, 2);
    let player3 = createplayer(32 * 15, 32 * 1, 'ffffff', this, 3);
    let player4 = createplayer(32 * 1, 32 * 15, 'ffffff', this, 4);

    Controll = {
        DOWN: this.input.keyboard.addKey(83),
        RIGHT: this.input.keyboard.addKey(68),
        LEFT: this.input.keyboard.addKey(65),
        UP: this.input.keyboard.addKey(87),
        BOMB: this.input.keyboard.addKey(16),
        lastPressed: {LEFT: false, RIGHT: false, UP: false, DOWN: false, BOMB: false}

    };

    this.anims.create({
        key: 'left' + 1,
        frames: this.anims.generateFrameNumbers('dude' + 1, {
            start: 15, end: 17
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn' + 1,
        frames: [{key: 'dude' + 1, frame: 4}],
        frameRate: 20
    });
    this.anims.create({
        key: 'up' + 1,
        frames: this.anims.generateFrameNumbers('dude' + 1, {start: 39, end: 41}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('dude' + 1, {start: 3, end: 5}),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: 'right' + 1,
        frames: this.anims.generateFrameNumbers('dude' + 1, {start: 27, end: 29}),
        frameRate: 10,
        repeat: -1
    });

    for (var i = 2; i <= 4; i++) {
        this.anims.create({
            key: 'left' + i,
            frames: this.anims.generateFrameNumbers('dude' + i, {
                start: 9, end: 11
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn' + i,
            frames: [{key: 'dude' + i, frame: 7}],
            frameRate: 20
        });
        this.anims.create({
            key: 'up' + i,
            frames: this.anims.generateFrameNumbers('dude' + i, {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down' + i,
            frames: this.anims.generateFrameNumbers('dude' + i, {start: 6, end: 7}),
            frameRate: 10,
            repeat: -1
        });


        this.anims.create({
            key: 'right' + i,
            frames: this.anims.generateFrameNumbers('dude' + i, {start: 3, end: 5}),
            frameRate: 10,
            repeat: -1
        });
    }

    this.anims.create({
        key: 'boom',
        frames: this.anims.generateFrameNumbers('explosion', {
            start: 0, end: 99
        }),
        frameRate: 99,
        repeat: -1
    });

}

function createcrates() {
    if (resetcrates) {

        for (var i in crates.children.entries) {
            crates.children.entries[i].destroy()
        }
        console.log(newCrates);
        for (var i in newCrates) {
            crate = newCrates[i];
            newcrate = crates.create(crate.x, crate.y, 'crate').setOrigin(0, 0).refreshBody();
            newcrate.id = crate.id;
        }
        resetcrates = false;
    }
}

function destroycrate(id) {
    for (var i in crates.children.entries) {
        if (crates.children.entries[i].id === id)
            crates.children.entries[i].destroy()
    }

}

function destroyExplosion(id) {
    for (var i in explosions.children.entries) {
        if (explosions.children.entries[i].id === id) {
            explosions.children.entries[i].destroy(true, true)
            console.log("destroyed")
        }
    }

}

function destroyBomb(id) {
    for (var i in bombs.children.entries) {
        if (bombs.children.entries[i].id === id) {
            bombs.children.entries[i].destroy(true, true)

        }
    }

}

function destroyPowerup(id) {
    for (var i in powerups.children.entries) {
        console.log(id + " " + powerups.children.entries[i].id)
        if (powerups.children.entries[i].id === id) {
            powerups.children.entries[i].destroy(true, true)
        }
    }

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
    var cursors = this.input.keyboard.createCursorKeys();
    players.children.iterate(function (child) {
        child.updatePlayer(cursors);

    });

    createExplosions();
    createcrates();
    createBombs();
    createPowerups();
    updateButtons();
    if (changes.length > 0) {
        socket.emit('toserver', changes);
    }
    changes = [];

}


function createExplosions() {
    for (var i in newExplosions) {
        exp = newExplosions[i];
        var newexp = explosions.create(exp.x, exp.y, 'explosion');
        newexp.anims.play('boom');
        newexp.id = exp.id;
    }
    newExplosions = [];
}

function createBombs() {
    for (var i in newBombs) {
        console.log("newbomb")
        bomb = newBombs[i];
        var newBomb = bombs.create(bomb.x, bomb.y, 'bomb');
        newBomb.id = bomb.id;
    }
    newBombs = [];
}

function createPowerups() {
    if (newPowerups.length > 0)
        console.log(newPowerups)
    for (var i in newPowerups) {
        powerup = newPowerups[i];
        var newPowerup = powerups.create(powerup.x + 16, powerup.y + 16, 'star');

        newPowerup.id = powerup.id;
        newPowerup.powType = powerup.powType;
        switch (newPowerup.powType) {
            case 1:
                newPowerup.setTint("0xffffff")
                break;
            case 2:
                newPowerup.setTint("0xff0000")
                break;
            case 3:
                newPowerup.setTint("0x00ff00")
                break;
        }

    }
    newPowerups = [];
}

var Controll;

function updateButtons() {


    if (Controll.DOWN.isDown && !Controll.lastPressed.DOWN) {
        controllchanges.push({event: 'pressed', button: 'DOWN'})
    }
    if (Controll.UP.isDown && !Controll.lastPressed.UP) {
        controllchanges.push({event: 'pressed', button: 'UP'})
    }
    if (Controll.RIGHT.isDown && !Controll.lastPressed.RIGHT) {
        controllchanges.push({event: 'pressed', button: 'RIGHT'})
    }
    if (Controll.LEFT.isDown && !Controll.lastPressed.LEFT) {
        controllchanges.push({event: 'pressed', button: 'LEFT'})
    }
    if (Controll.BOMB.isDown && !Controll.lastPressed.BOMB) {
        controllchanges.push({event: 'pressed', button: 'BOMB'})
    }

    if (!Controll.DOWN.isDown && Controll.lastPressed.DOWN) {
        controllchanges.push({event: 'released', button: 'DOWN'})
    }
    if (!Controll.UP.isDown && Controll.lastPressed.UP) {
        controllchanges.push({event: 'released', button: 'UP'})
    }
    if (!Controll.RIGHT.isDown && Controll.lastPressed.RIGHT) {
        controllchanges.push({event: 'released', button: 'RIGHT'})
    }
    if (!Controll.LEFT.isDown && Controll.lastPressed.LEFT) {
        controllchanges.push({event: 'released', button: 'LEFT'})
    }
    if (!Controll.BOMB.isDown && Controll.lastPressed.BOMB) {
        controllchanges.push({event: 'released', button: 'BOMB'})
    }


    Controll.lastPressed.DOWN = Controll.DOWN.isDown;
    Controll.lastPressed.UP = Controll.UP.isDown;
    Controll.lastPressed.RIGHT = Controll.RIGHT.isDown;
    Controll.lastPressed.LEFT = Controll.LEFT.isDown;
    Controll.lastPressed.BOMB = Controll.BOMB.isDown;

    if (controllchanges.length > 0) {
        changes.push({type: 'CONTROL', data: controllchanges})
        console.log(controllchanges)
        controllchanges = [];
    }


}


//restart()