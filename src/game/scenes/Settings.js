/* eslint-disable no-undef */
import { Scene } from 'phaser';
import { createPlayerAnimations } from '../animations';

export class Settings extends Scene {
    constructor() {
        super('Settings');
    }

    create() {
        // --- Background & Branding ---
        createPlayerAnimations(this);
        this.add.image(540, 360, 'background');
        this.add.image(1020, 70, 'logo').setScale(0.25);
        this.add.image(540, 720, 'platform');

        // --- Styles ---
        const labelStyle = {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'left'
        };
        const valueStyle = {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'left'
        };

        // --- Title & Navigation ---
        this.add.text(540, 70, 'SETTINGS', {
            ...labelStyle,
            fontSize: 48,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(20, 20, 'Main Menu [Esc]', {
            ...labelStyle,
            fontSize: 18
        }).setOrigin(0, 0);

        // --- Settings Options ---
        this.options = [
            { label: 'Music', type: 'toggle', value: true },
            { label: 'Music Volume', type: 'slider', value: 1 },
            { label: 'SFX', type: 'toggle', value: true },
            { label: 'SFX Volume', type: 'slider', value: 1 }
        ];
        this.selected = 0;

        // --- UI Elements ---
        this.optionTexts = [];
        this.valueTexts = [];
        this.sliderRects = [];
        this.volumeBars = [];

        for (let i = 0; i < this.options.length; i++) {
            const y = 200 + i * 80;

            // Container rectangle
            const rect = this.add.rectangle(540, y, 500, 56, 0x222222, i === this.selected ? 1 : 0.5)
                .setOrigin(0.5);
            this.sliderRects.push(rect);

            // Option label
            const label = this.add.text(320, y - 8, this.options[i].label, labelStyle).setOrigin(0, 0.5);
            this.optionTexts.push(label);

            // Option value & progress bar
            let valueText;
            if (this.options[i].type === 'toggle') {
                valueText = this.add.text(900, y - 8, this.options[i].value ? 'ON' : 'OFF', valueStyle).setOrigin(1, 0.5);
                this.valueTexts.push(valueText);
                this.volumeBars.push(null);
            } else {
                valueText = this.add.text(900, y - 8, Math.round(this.options[i].value * 100) + '%', valueStyle).setOrigin(1, 0.5);
                this.valueTexts.push(valueText);

                // Progress bar inside container
                const barBg = this.add.rectangle(540 - 200, y + 18, 400, 10, 0x444444).setOrigin(0, 0.5);
                const barFill = this.add.rectangle(540 - 200, y + 18, 400 * this.options[i].value, 10, 0xffffff).setOrigin(0, 0.5);
                this.volumeBars.push({ barBg, barFill });
            }
        }

        // --- Keyboard Controls ---
        this.input.keyboard.on('keydown-UP', () => {
            this.selected = (this.selected - 1 + this.options.length) % this.options.length;
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            this.selected = (this.selected + 1) % this.options.length;
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-LEFT', () => {
            this.adjustOption(-1);
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.adjustOption(1);
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.toggleOption();
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            this.toggleOption();
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MainMenu');
        });

        this.updateSelection();

        // Decorative player sprite
        createPlayerAnimations(this);
        const player = this.add.sprite(150, 605, 'player', 0).setScale(3);
        player.play('relax');
    }

    updateSelection() {
        // Highlight selected option
        for (let i = 0; i < this.sliderRects.length; i++) {
            this.sliderRects[i].setFillStyle(0x222222, i === this.selected ? 1 : 0.5);
        }
    }

    adjustOption(dir) {
        // Adjust slider value and update bar
        const opt = this.options[this.selected];
        if (opt.type === 'slider') {
            opt.value = Phaser.Math.Clamp(opt.value + dir * 0.1, 0, 1);
            this.valueTexts[this.selected].setText(Math.round(opt.value * 100) + '%');
            const bar = this.volumeBars[this.selected];
            if (bar) {
                bar.barFill.width = 400 * opt.value;
            }
            // TODO: Apply volume to your audio system
        }
    }

    toggleOption() {
        // Toggle ON/OFF for music and SFX
        const opt = this.options[this.selected];
        if (opt.type === 'toggle') {
            opt.value = !opt.value;
            this.valueTexts[this.selected].setText(opt.value ? 'ON' : 'OFF');
            // TODO: Apply toggle to your audio system
        }
    }
}