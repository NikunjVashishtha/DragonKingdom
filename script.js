/*global Phaser*/
class Adventurer extends Phaser.Scene {
    constructor() {
        super();
    }
    preload() {
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('dragon', 'assets/dragon.png', {
            frameWidth: 62,
            frameHeight: 60
        });
        this.load.spritesheet('enemyHealth', 'assets/enemyHealth.png', {
            frameWidth: 330,
            frameHeight: 92,
        })
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('life', 'assets/life.png', {
            frameWidth: 72,
            frameHeight: 72,
        });
        this.load.spritesheet('player', 'assets/adventurerSprite.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    create() {
        // Sky
        this.add.image(700, 345, 'sky');

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
        dragon.isUp = true;
        dragon.isAlive = true;
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
            frameRate: 10
        });

        // Player
        player = this.physics.add.sprite(100, 450, 'player');
        player.setScale(3);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.health = 6;
        player.isAlive = true;
        this.physics.add.collider(player, platforms);

        // Player Animations

        this.anims.create({
            key: 'attack1',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'attack2',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'attack3',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [52, 53, 54, 55, 56, 57, 58, 59, 60, 61],
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'jumpRun',
            frames: this.anims.generateFrameNumbers('player', { start: 65, end: 70 }),
            frameRate: 10,
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { frames: [68] }),
            frameRate: 10,
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
            frames: this.anims.generateFrameNumbers('player', {
                frames: [78, 79, 80, 81, 78],
            }),
            frameRate: 8,
        })

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('player', { start: 91, end: 97 }),
            frameRate: 8,
        });
        if (player.isAlive == false) {
            player.anims.play('die');
        }

        // Damage
        this.physics.add.overlap(player, dragon, attack, null, this);

        // Keyboard Controls
        cursors = this.input.keyboard.createCursorKeys();
        attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.input.keyboard.on('keydown-ENTER', damage);
        function damage() {
            if (player.health > 0) {
                player.health--;
                player.anims.play('damage');
            }
        }
        function attack() {
            if (attackKey.isDown && dragon.health > 0) {
                dragon.health--;
            }
        }
    }
    disableEnemy(object) {
        object.disableBody(true, true);
    }
    update() {
        if (dragon.isAlive) {
            dragon.anims.play('fly', true);
        }
        dragon.flipX = true;
        switch (player.health) {
            case 0:
                life1.setFrame(2);
                life2.setFrame(2);
                life3.setFrame(2);
                if (!player.anims.currentAnim || player.anims.currentAnim.key != 'die') {
                    player.play('die', true);
                    player.setVelocityX(0);
                    console.log('dead');
                }
                return;
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
                if (!dragon.anims.currentAnim || dragon.anims.currentAnim.key != 'dragonDie') {
                    dragonHealthBar.setFrame(0);
                    dragon.body.setAllowGravity(true);
                    dragon.anims.play('dragonDie', true);
                    dragon.isAlive = false;
                    dragon.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                        this.disableEnemy(dragon);
                        this.disableEnemy(dragonHealthBar);
                    }, this);
                }
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
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.flipX = false;
            player.anims.play('right', true);
        }
        else if (attackKey.isDown) {
            player.anims.play(`attack${n}`, true);
        }
        else {
            player.anims.play('idle', true);
            player.setVelocityX(0);
        }
        if (cursors.up.isDown && cursors.down.isUp) {
            player.anims.play('jump', true);
            if (player.body.touching.down) {
                player.setVelocityY(-300);
            }
            if (attackKey.isDown) {
                player.anims.play(`attack${n}`, true);
            }
        }
        if (cursors.down.isDown && 400 - player.body.position.y > 10 && cursors.up.isUp) {
            player.anims.play('jump', true);
            player.setVelocityY(300);
        }
    }
}

const config = {
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
    scene: [Adventurer],
};

var player;
var dragon;
var dragonHealthBar;
var platforms;
var attackKey;
var cursors;
var life1, life2, life3;
var n = 2;
setInterval(100, setAttackType());
function setAttackType() {
    n = Math.ceil(Math.random() * 3);
    console.log(n);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Phaser.Game(config);