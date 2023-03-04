import 'https://cdn.jsdelivr.net/npm/phaser@3.15.1/dist/phaser-arcade-physics.min.js';
import 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

var player;
var dragon;
var dragonHealthBar;
var gameWin = false;
// var stars;
// var bombs;
var platforms;
var attackKey;
var cursors;
// var score = 0;
var gameOver = false;
var life1, life2, life3;
var sky;
// var scoreText;

/*global Phaser*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var game = new Phaser.Game(config);
function preload() {
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dragon', 'assets/dragon.png', {
        frameWidth: 62,
        frameHeight: 60
    });
    this.load.spritesheet('enemyHealth', 'assets/enemyHealth.png', {
        frameWidth: 330,
        frameHeight: 92,
    })
    this.load.spritesheet('sky', 'assets/sky.png', {
        frameWidth: window.innerWidth,
        frameHeight: 800,
    });
    this.load.spritesheet('life', 'assets/life.png', {
        frameWidth: 72,
        frameHeight: 72,
    });
    this.load.spritesheet('player', 'assets/adventurerSprite.png', {
        frameWidth: 32,
        frameHeight: 32,
    });
}

function create() {
    // Sky
    sky = this.physics.add.sprite(400, 345, 'sky');
    sky.body.setAllowGravity(false);
    this.anims.create({
        key: 'cloudy',
        frames: this.anims.generateFrameNumbers('sky', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
    });

    // Ground
    platforms = this.physics.add.staticGroup();
    platforms.create(800, 600, 'ground');

    // Health
    life1 = this.add.sprite(30, 30, 'life').setScale(0.5);
    life2 = this.add.sprite(70, 30, 'life').setScale(0.5);
    life3 = this.add.sprite(110, 30, 'life').setScale(0.5);

    // Dragon
    dragon = this.physics.add.sprite(800, 300, 'dragon').setScale(6);
    dragon.setCollideWorldBounds(true);
    dragon.body.setAllowGravity(false);
    dragon.health = 100;
    this.physics.add.collider(dragon, platforms);
    this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('dragon', { start: 0, end: 8 }),
        frameRate: 10,
    })
    dragonHealthBar = this.physics.add.sprite(770, 150, 'enemyHealth').setScale(0.5);
    dragonHealthBar.body.setAllowGravity(false);
    this.anims.create({
        key: 'dragonDie',
        frames: this.anims.generateFrameNumbers('dragon', { start: 18, end: 22 }),
        frameRate: 10,
        repeat: -1,
    });

    // Player
    player = this.physics.add.sprite(100, 450, 'player');
    player.setScale(3);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.health = 6;
    this.physics.add.collider(player, platforms);

    // Player Animations

    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [
                26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 39, 40, 41, 42, 43, 44, 45, 46,
                47, 48, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
            ],
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'jump',
        frames: [{ key: 'player', frame: 68 }],
        frameRate: 20,
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 13, end: 20 }),
        frameRate: 15,
        repeat: -1,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 13, end: 20 }),
        frameRate: 15,
        repeat: -1,
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 12 }),
        frameRate: 8,
        repeat: -1,
    });

    this.anims.create({
        key: 'damage',
        frames: this.anims.generateFrameNumbers('player', { start: 78, end: 81 })
    })

    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('player', { start: 91, end: 97 }),
        frameRate: 8,
    });

    // Damage
    this.physics.add.overlap(player, dragon, attack, null, this);

    // Keyboard Controls
    cursors = this.input.keyboard.createCursorKeys();
    attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
}
function damage() {
    player.health -= 10;
    player.anims.play('damage', true);
}

function attack() {
    if (attackKey.isDown) {
        dragon.health -= 10;
    }
}

function update() {
    if (gameOver) {
        player.setVelocityX(0);
        player.anims.play('die', true);
        return;
    }
    else if(gameWin)
    {
        null
    }
    dragon.flipX = true;
    dragon.anims.play('fly', true);
    if (dragon.health <= 0) {
        dragon.body.setAllowGravity(true);
        dragon.anims.play('dragonDie', true);
        dragon.remove()
    }
    // sky.anims.play('cloudy', true);
    switch (player.health) {
        case 0:
            life1.setFrame(2);
            life2.setFrame(2);
            life3.setFrame(2);
            gameOver = true;
            break;
        case 1:
            life1.setFrame(1);
            life2.setFrame(2);
            life3.setFrame(2);
            break;
        case 2:
            life1.setFrame(0);
            life2.setFrame(2);
            life3.setFrame(2);
            break;
        case 3:
            life1.setFrame(0);
            life2.setFrame(1);
            life3.setFrame(2);
            break;
        case 4:
            life1.setFrame(0);
            life2.setFrame(0);
            life3.setFrame(2);
            break;
        case 5:
            life1.setFrame(0);
            life2.setFrame(0);
            life3.setFrame(1);
            break;
        case 6:
            life1.setFrame(0);
            life2.setFrame(0);
            life3.setFrame(0);
            break;
    }
    switch (dragon.health) {
        case 0:
            dragonHealthBar.setFrame(0);
            gameWin = true;
            break;
        case 20:
            dragonHealthBar.setFrame(1);
            break;
        case 40:
            dragonHealthBar.setFrame(2);
            break;
        case 60:
            dragonHealthBar.setFrame(3);
            break;
        case 80:
            dragonHealthBar.setFrame(4);
            break;
        case 90:
            dragonHealthBar.setFrame(5);
            break;
        case 100:
            dragonHealthBar.setFrame(6);
            break;
    }
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true;
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.flipX = false;
        player.anims.play('right', true);
    } else if (attackKey.isDown) {
        player.anims.play('attack', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }
    if (cursors.up.isDown && cursors.down.isUp) {
        player.anims.play('jump', true);
        if (player.body.touching.down) {
            player.setVelocityY(-300);
        }
    }
    if (
        cursors.down.isDown &&
        400 - player.body.position.y > 10 &&
        cursors.up.isUp
    ) {
        player.anims.play('jump', true);
        player.setVelocityY(300);
    }
}
