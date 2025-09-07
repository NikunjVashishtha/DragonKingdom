import { Scene } from 'phaser';
import { createPlayerAnimations } from '../animations';

export class LevelSelect extends Scene {
    constructor() {
        super('LevelSelect');
    }

    create() {
        // --- Setup ---
        createPlayerAnimations(this);
        this.add.image(540, 360, 'background');
        this.add.image(1020, 70, 'logo').setScale(0.25);
        this.add.image(540, 720, 'platform');

        this.add.text(540, 70, 'Select Level', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(20, 20, 'Main Menu [Esc]', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'left'
        }).setOrigin(0, 0);

        // --- Data ---
        const levelFiles = ["level1.json", "level2.json", "level3.json", "level4.json", "level5.json"];
        const levelCount = levelFiles.length;
        let selectedIndex = 0;

        // --- Level Boxes ---
        const levelContainer = this.add.container(540, 360);
        const levelBoxes = [];

        for (let i = 0; i < levelCount; i++) {
            const x = -460 + (i * 200);
            const y = -180;

            // Box graphics
            const box = this.add.graphics();
            box.fillStyle(0x222222, 1).fillRect(x + 6, y + 6, 128, 88); // Shadow
            box.fillStyle(0xFFD700, 1).fillRect(x, y, 128, 88); // Main box
            box.lineStyle(4, 0x000000, 1).strokeRect(x, y, 128, 88); // Outline

            // Level label
            const levelText = this.add.text(x + 64, y + 44, `Level ${i + 1}`, {
                fontFamily: 'Arial Black',
                fontSize: 24,
                color: '#000000',
                align: 'center'
            }).setOrigin(0.5);

            // Interactivity
            box.setInteractive({ cursor: 'pointer' });
            box.on('pointerdown', () => {
                this.scene.start('Game', { level: i + 1 });
            });

            levelContainer.add([box, levelText]);
            levelBoxes.push(box);
        }

        // --- Selection Effect ---
        const flashSelectedBox = () => {
            this.tweens.add({
                targets: levelBoxes[selectedIndex],
                alpha: 0.5,
                yoyo: true,
                repeat: -1,
                duration: 300
            });
        };

        flashSelectedBox();

        // --- Player Sprite ---
        const player = this.add.sprite(150 + (selectedIndex * 200), 655, 'player', 0)
            .setScale(3)
            .setOrigin(0.5, 1);
        player.play('relax');

        // --- Input Handlers ---
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MainMenu');
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (selectedIndex > 0) {
                this.tweens.killTweensOf(levelBoxes[selectedIndex]);
                levelBoxes[selectedIndex].setAlpha(1);
                selectedIndex--;
                flashSelectedBox();

                player.flipX = true;
                this.tweens.add({
                    targets: player,
                    x: 150 + (selectedIndex * 200),
                    duration: 300,
                    onStart: () => player.play('walk', true),
                    onComplete: () => player.play('relax')
                });
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (selectedIndex < levelCount - 1) {
                this.tweens.killTweensOf(levelBoxes[selectedIndex]);
                levelBoxes[selectedIndex].setAlpha(1);
                selectedIndex++;
                flashSelectedBox();

                player.flipX = false;
                this.tweens.add({
                    targets: player,
                    x: 150 + (selectedIndex * 200),
                    duration: 300,
                    onStart: () => player.play('walk', true),
                    onComplete: () => player.play('relax')
                });
            }
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('Game', { level: selectedIndex + 1 });
        });
    }
}