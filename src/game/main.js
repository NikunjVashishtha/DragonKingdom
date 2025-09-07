/* eslint-disable no-undef */
import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { LevelSelect } from './scenes/LevelSelect';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Game } from 'phaser';
import { Settings } from './scenes/Settings';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#000000ff',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        LevelSelect,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Settings
    ],
    dom: {
        createContainer: true
    }
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
