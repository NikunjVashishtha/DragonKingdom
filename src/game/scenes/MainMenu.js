import { Scene } from 'phaser';
import { createPlayerAnimations } from '../animations';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Setup background and logo
        this.add.image(540, 360, 'background');
        this.add.image(540, 200, 'logo').setScale(0.5);
        this.add.image(540, 720, 'platform');

        // Title
        this.add.text(540, 350, 'Main Menu', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Menu options
        const optionLabels = ['Play', 'Levels', 'Settings', 'Credits'];
        const options = [];
        let selectedOptionIndex = 0;
        let blinkTween = null;

        // Create menu option texts
        optionLabels.forEach((label, i) => {
            const y = 450 + i * 50;
            const optionText = this.add.text(540, y, label, {
                fontFamily: 'Arial Black',
                fontSize: 28,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }).setOrigin(0.5);
            options.push(optionText);
        });

        // Helper: update selection arrows and blinking
        const updateSelection = (prev, next) => {
            options[prev].setText(optionLabels[prev]);
            options[prev].setAlpha(1);
            if (blinkTween) blinkTween.stop();

            options[next].setText(`> ${optionLabels[next]} <`);
            blinkTween = this.tweens.add({
                targets: options[next],
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        };

        // Initial selection
        options[selectedOptionIndex].setText(`> ${optionLabels[selectedOptionIndex]} <`);
        blinkTween = this.tweens.add({
            targets: options[selectedOptionIndex],
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Keyboard navigation
        this.input.keyboard.on('keydown-ENTER', () => {
            const scenes = ['Game', 'LevelSelect', 'Settings', 'Credits'];
            if (selectedOptionIndex === 0) {
                this.scene.start(scenes[0], { level: 1 });
            } else {
                this.scene.start(scenes[selectedOptionIndex]);
            }
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            if (selectedOptionIndex < options.length - 1) {
                const prev = selectedOptionIndex;
                selectedOptionIndex += 1;
                updateSelection(prev, selectedOptionIndex);
            }
        });

        this.input.keyboard.on('keydown-UP', () => {
            if (selectedOptionIndex > 0) {
                const prev = selectedOptionIndex;
                selectedOptionIndex -= 1;
                updateSelection(prev, selectedOptionIndex);
            }
        });

        // Decorative player sprite
        createPlayerAnimations(this);
        const player = this.add.sprite(150, 605, 'player', 0).setScale(3);
        player.play('relax');
    }
}
