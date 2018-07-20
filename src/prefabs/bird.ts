import 'phaser';

export default class Bird extends Phaser.Sprite {
    alive: boolean
    jumpSound: Phaser.Sound;
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'bird');
        this.alive = true;

        this.jumpSound = this.game.add.audio('jump');

        this.animations.add('left', [0, 1, 2, 3], 10, true);
        this.animations.play('left');

        this.game.physics.arcade.enable(this);
        this.body.gravity.y = 1000;
    }

    jump() {
        this.body.velocity.y = -350;
        this.jumpSound.play();
    }
}