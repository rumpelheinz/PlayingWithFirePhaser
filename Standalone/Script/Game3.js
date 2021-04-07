//var game = new Phaser.Game(config);
var config;
var phaz = this
var game;

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

function restart() {

    document.getElementById('gamewindow').remove();

    document.getElementById('mainwindow').innerHTML = "<canvas id='gamewindow'></canvas>"
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

}


function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('block', 'assets/Blocks/sandBlock.png');
    this.load.image('crate', 'assets/Blocks/darkGrassDirtBlock.png');
    this.load.spritesheet('dude1',
        'assets/rpgsprites1/warrior_m.png',
        {frameWidth: 32, frameHeight: 36});
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

var bomblist = [];
var cratelist = [];
var explosions;
var star;
var platforms;
var players;
var bombs;
var explosionlist = [];
var gameOver = false;

let lives1=document.getElementById("player1lives");
let lives2=document.getElementById("player2lives");


function blowup(player, explosion) {

    if ((Math.abs(player.x + 16 - (explosion.x)) > 16 && explosion.dir === 'y') ||
        (Math.abs(player.y + 16 - (explosion.y)) > 16 && explosion.dir === 'x'))
        return;

    if (!player.immune) {
        player.lives--;
        if (player.id==1){lives1.innerHTML=player.lives;}
        if (player.id==2){lives2.innerHTML=player.lives;}
        player.immune = true;
        player.immuneticks = 60 * 2;
        player.setTint(0xff0000);
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

    for (i = 1; i < xlength - 1; i++)
        for (j = 1; j < ylength - 1; j++) {
            if ((j == 1 && ( i == 1 || i === 2 || i === xlength - 2 || i === xlength - 3))
                || (j == 2 && ( i == 1 || i === xlength - 2))
                || (j == ylength - 3 && ( i == 1 || i === xlength - 2))
                || (j == ylength - 2 && ( i == 1 || i === 2 || i === xlength - 2 || i === xlength - 3))
                || (j % 2 === 0 && i % 2 === 0)
            )
                continue;
            if (Math.round(Math.random() * 2) == 2) {
                continue
            }
            var crate = crates.create(i * 32, j * 32, 'crate').setOrigin(0, 0).refreshBody();
            crate.explode = function (crate) {
                createPowerup(crate.x, crate.y);
                var index = cratelist.indexOf(crate);
                if (index > -1) {
                    cratelist.splice(index, 1);
                    console.log("crate removed")
                }
                crate.destroy();
            };
            cratelist.push(crate);
        }


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
    console.log(game)
    for (var i = 1; i <= 4; i++) {
        this.anims.create({
            key: 'left'+i,
            frames: this.anims.generateFrameNumbers('dude'+i, {
                start: 9, end: 11
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn'+i,
            frames: [{key: 'dude'+i, frame: 7}],
            frameRate: 20
        });
        this.anims.create({
            key: 'up'+i,
            frames: this.anims.generateFrameNumbers('dude'+i, {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down'+i,
            frames: this.anims.generateFrameNumbers('dude'+i, {start: 6, end: 7}),
            frameRate: 10,
            repeat: -1
        });


        this.anims.create({
            key: 'right'+i,
            frames: this.anims.generateFrameNumbers('dude'+i, {start: 3, end: 5}),
            frameRate: 10,
            repeat: -1
        });
    }
    let player1 = createplayer(32, 32, 'ffffff', this, {
        DOWN: this.input.keyboard.addKey(83),
        RIGHT: this.input.keyboard.addKey(68),
        LEFT: this.input.keyboard.addKey(65),
        UP: this.input.keyboard.addKey(87),
        BOMB: this.input.keyboard.addKey(16)

    }, 1);
    let player2 = createplayer(32 * 15, 32 * 15, 'ffffff', this, {
        DOWN: this.input.keyboard.addKey(40),
        RIGHT: this.input.keyboard.addKey(39),
        LEFT: this.input.keyboard.addKey(37),
        UP: this.input.keyboard.addKey(38),
        BOMB: this.input.keyboard.addKey(32)
    }, 2);

    // this.anims.create({
    //     key: 'left'+1,
    //     frames: this.anims.generateFrameNumbers('dude'+1, {
    //         start: 15, end: 17
    //     }),
    //     frameRate: 10,
    //     repeat: -1
    // });
    // this.anims.create({
    //     key: 'turn'+1,
    //     frames: [{key: 'dude'+1, frame: 4}],
    //     frameRate: 20
    // });
    // this.anims.create({
    //     key: 'up'+1,
    //     frames: this.anims.generateFrameNumbers('dude'+1, {start: 39, end: 41}),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.anims.create({
    //     key: 'down',
    //     frames: this.anims.generateFrameNumbers('dude'+1, {start: 3, end: 5}),
    //     frameRate: 10,
    //     repeat: -1
    // });


    // this.anims.create({
    //     key: 'right'+1,
    //     frames: this.anims.generateFrameNumbers('dude'+1, {start: 27, end: 29}),
    //     frameRate: 10,
    //     repeat: -1
    // });




    this.physics.add.collider(players, platforms);
    this.physics.add.collider(players, explosions, blowup, null, this);
    this.physics.add.collider(players, powerups, powerplayer, null, this);
    this.physics.add.collider(bombs, explosions, bombHitExplosion, null, this);
    this.physics.add.collider(crates, explosions, crateHitExplosion, null, this);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 0,
        setXY: {x: 12, y: -10, stepX: 70}
    });
    this.anims.create({
        key: 'boom',
        frames: this.anims.generateFrameNumbers('explosion', {
            start: 0, end: 99
        }),
        frameRate: 99,
        repeat: -1
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });
    this.physics.add.collider(stars, platforms);

    //   scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

    players.children.iterate(function (child) {

        child.anims.play('turn'+1);

    });
    /* for (let i in players.children) {
         let exp = players.children[i];
         exp.anims.play('turn');
     }*/
    // player.anims.play('turn');

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
    for (let i in bomblist) {
        let bomb = bomblist[i];
        bomb.tick(bomb);
    }
    for (let i in explosionlist) {
        let exp = explosionlist[i];
        exp.tick(exp);
    }

}


function createExplosion(x, y, bomb) {
    var exp = explosions.create(x, y, 'explosion');
    exp.anims.play('boom');
    exp.time = 0;
    exp.bomb = bomb;
    exp.dir = 'n';
    if (bomb.x !== x)
        exp.dir = 'x';
    if (bomb.y !== y)
        exp.dir = 'y';
    exp.tick = function (exp) {
        exp.time++;
        if (exp.time === 99) {
            exp.disableBody(true, true);

            var index = explosionlist.indexOf(exp);
            if (index > -1) {
                explosionlist.splice(index, 1);
            }
        }
    };
    explosionlist.push(exp);
}

//restart()