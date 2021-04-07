var config = {
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
    }
};

var game = new Phaser.Game(config);
var lastPressed = {};
lastPressed.left = false;
lastPressed.right = false;
lastPressed.up = false;
lastPressed.down = false;
var justDown = {};
justDown.left = false;
justDown.right = false;
justDown.up = false;
justDown.down = false;
var justReleased={};
justReleased.left=false;
justReleased.right=false;
justReleased.up=false;
justReleased.down=false;

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('block', 'assets/Blocks/sandBlock.png');
    this.load.spritesheet('dude',
        'assets/guy.png',
        {frameWidth: 32, frameHeight: 32}
    );
}

var star;
var platforms;
var player;
var score = 0;
var scoreText;
var curDir = Phaser.NONE;
var nextDir = Phaser.NONE;

function create() {

    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    for (i = 0; i < 17; i++)
        platforms.create(0, i * 32, 'block').setOrigin(0, 0).refreshBody();
    for (i = 1; i < 17; i++)
        platforms.create(i * 32, 0, 'block').setOrigin(0, 0).refreshBody();
    for (i = 1; i < 17; i++)
        platforms.create(i * 32, 16 * 32, 'block').setOrigin(0, 0).refreshBody()//.setOrigin(0, 0);
    for (i = 1; i < 17; i++)
        platforms.create(16 * 32, i * 32, 'block').setOrigin(0, 0).refreshBody()//.setOrigin(0, 0);

    for (i = 1; i < 15; i++) {
        for (j = 1; j < 15; j++) {
            if (i % 2 == 0 && j % 2 == 0)
                platforms.create(i * 32, j * 32, 'block').setOrigin(0, 0).refreshBody();

        }
    }
    player = this.physics.add.sprite(64, 64, 'dude').setScale(0.9).setOrigin(0, 0);
    console.log(player)
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 15, end: 17
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{key: 'dude', frame: 4}],
        frameRate: 20
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dude', {start: 39, end: 41}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('dude', {start: 3, end: 5}),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 27, end: 29}),
        frameRate: 10,
        repeat: -1
    });
    //   player.body.setGravityY(100);
    this.physics.add.collider(player, platforms);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70}
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    //   scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

}

function collectStar(player, star) {
    star.disableBody(true, true);
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

function update() {
    var cursors = this.input.keyboard.createCursorKeys();
    updatePlayer(cursors);

}

function move(curdir, nextdir) {
    if (curdir == Phaser.LEFT) {
        player.x -= 5;
    }
    if (curdir == Phaser.RIGHT) {
        player.x += 5;
    }
    if (curdir == Phaser.UP) {
        player.y -= 5;
    }
    if (curdir == Phaser.DOWN) {
        player.y += 5;
    }
}

function updatePlayer(cursors) {
    if (cursors.down.isDown && !lastPressed.down) justDown.down = true;
    if (cursors.up.isDown && !lastPressed.up) justDown.up = true;
    if (cursors.right.isDown && !lastPressed.right) justDown.right = true;
    if (cursors.left.isDown && !lastPressed.left) justDown.left = true;


    if (!cursors.down.isDown && lastPressed.down) justReleased.down = true;
    if (!cursors.up.isDown && lastPressed.up) justReleased.up = true;
    if (!cursors.right.isDown && lastPressed.right) justReleased.right = true;
    if (!cursors.left.isDown && lastPressed.left) justReleased.left = true;

    if (justReleased.right) {
        if (nextDir === Phaser.RIGHT)
            nextDir = Phaser.NONE;
        if (curDir===Phaser.RIGHT){
            curDir=nextDir;
        }
    }
    if (justReleased.left) {
        if (nextDir === Phaser.LEFT)
            nextDir = Phaser.NONE;
        if (curDir===Phaser.LEFT){
            curDir=nextDir;
        }
    }
    if (justReleased.up) {
        if (nextDir === Phaser.UP)
            nextDir = Phaser.NONE;
        if (curDir===Phaser.UP){
            curDir=nextDir;
        }
    }
    if (justReleased.down) {
        if (nextDir === Phaser.DOWN)
            nextDir = Phaser.NONE;
        if (curDir===Phaser.DOWN){
            curDir=nextDir;
        }
    }

    if (justDown.left) {
        if (curDir === Phaser.NONE || curDir === Phaser.RIGHT)
            curDir = Phaser.LEFT;
        else{
            nextDir=Phaser.left;
        }
    }
    if (justDown.right) {
        if (curDir === Phaser.NONE || curDir === Phaser.LEFT)
            curDir = Phaser.RIGHT;
        else{
            nextDir=Phaser.RIGHT;
        }
    }
    if (justDown.up) {
        if (curDir === Phaser.NONE || curDir === Phaser.DOWN)
            curDir = Phaser.UP;
        else{
            nextDir=Phaser.UP;
        }
    }
    if (justDown.down) {
        if (curDir === Phaser.NONE || curDir === Phaser.UP)
            curDir = Phaser.DOWN;
        else{
            nextDir=Phaser.DOWN;
        }
    }


    lastPressed.left = cursors.left.isDown;
    lastPressed.right = cursors.right.isDown;
    lastPressed.up = cursors.up.isDown;
    lastPressed.down = cursors.down.isDown;

    justDown.down = false;
    justDown.up = false;
    justDown.right = false;
    justDown.left = false;


    move(curDir, nextDir);


}
