export function createPlayerAnimations(scene) {
    scene.anims.create({
        key: 'relax',
        frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 11 }),
        frameRate: 6,
        repeat: -1,
        yoyo: true
    });

    scene.anims.create({
        key: 'walk',
        frames: scene.anims.generateFrameNumbers('player', { start: 12, end: 19 }),
        frameRate: 8,
        repeat: -1
    });
    // TODO: Add more animations here
}