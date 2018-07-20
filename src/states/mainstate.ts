import 'phaser';
import Bird from '../prefabs/bird';

export default class extends Phaser.State {
  bird: Bird;
  pipes: Phaser.Group;
  holes: Phaser.Group;

  earth: Phaser.TileSprite;

  score: number;

  gameOverText: Phaser.Text;
  scoreText: Phaser.Text;
  pointSound: Phaser.Sound;

  timerloop: Phaser.TimerEvent;

  hitSound: Phaser.Sound;
  dieSound: Phaser.Sound;

  preload() {
    this.game.stage.backgroundColor = '#71c5cf';

    this.game.load.spritesheet('bird', 'assets/spr_b2_strip4.png', 34, 24);
    this.game.load.image('pipe', 'assets/pipe.png');
    this.game.load.image('earth', 'assets/spr_earth.png');

    this.game.load.audio('jump', 'assets/sounds/sfx_wing.ogg');
    this.game.load.audio('point', 'assets/sounds/sfx_point.ogg');
    this.game.load.audio('hit', 'assets/sounds/sfx_hit.ogg');
    this.game.load.audio('die', 'assets/sounds/sfx_die.ogg');
  }

  create() {


    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bird = new Bird(this.game, 100, 240);
    this.game.add.existing(this.bird);



    this.pipes = this.game.add.group();
    this.holes = this.game.add.group();

    this.pipes.enableBody = true;
    this.holes.enableBody = true;

    this.pointSound = this.game.add.audio('point');
    this.hitSound = this.game.add.audio('hit');
    this.dieSound = this.game.add.audio('die');

    this.timerloop = this.game.time.events.loop(1200, this.spawnPipes, this);

    this.score = 0;

    this.GUI();

    const spaceKey = this.game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    this.earth = this.game.add.tileSprite(0, this.game.world.height - 32, this.game.world.width, 32, 'earth')
  }

  jump() {
    if (this.bird.alive) {
      this.bird.jump();
    } else {
      this.restartGame()
    }
  }

  GUI() {
    this.scoreText = this.game.add.text(
      10,
      10,
      "0",
      {
        font: '16px "Press Start 2P"',
        fill: '#fff',
        stroke: '#430',
        strokeThickness: 4,
        align: 'center'
      }
    );

    this.gameOverText = this.game.add.text(
      this.game.world.width / 2,
      this.game.world.height / 2,
      "",
      {
        font: '16px "Press Start 2P"',
        fill: '#fff',
        stroke: '#430',
        strokeThickness: 4,
        align: 'center'
      }
    );

    this.gameOverText.anchor.setTo(0.5, 0.5);
  }

  hit() {
    this.hitSound.play()
    this.bird.alive = false;
    let hiscore = +window.localStorage.getItem('hiscore');
    hiscore = hiscore ? hiscore : this.score;
    hiscore = this.score > hiscore ? this.score : hiscore;
    window.localStorage.setItem('hiscore', hiscore.toString());
    this.gameOverText.setText("GAMEOVER\nHIGH SCORE\n" + hiscore + "\n\n press space to continue.  ");
    this.gameOverText.renderable = true;
    this.pipes.forEachAlive(pipe => {
      pipe.body.velocity.x = 0;
    });
    this.holes.forEach(hole => {
      hole.body.velocity.x = 0;
    }, null);
    this.game.time.events.remove(this.timerloop);
    this.dieSound.play();
  }

  incScore(_, hole) {
    this.holes.remove(hole);
    this.score += 1;
    this.scoreText.setText(this.score.toString());
    this.pointSound.play();
  }

  update() {
    if (this.bird.alive) {
      this.game.physics.arcade.overlap(this.bird, this.pipes, this.hit, null, this);
      if (this.bird.y < 0 || this.bird.y > 490 - 32)
        this.hit();
      this.game.physics.arcade.overlap(this.bird, this.holes, this.incScore, null, this);
    }

   
    this.pipes.forEachAlive(pipe => {
      if (pipe.x + pipe.width < this.game.world.bounds.left) {
        pipe.kill();
      }
    });
  }

  restartGame() {
    this.game.state.start('main');
  }


  spawnPipe(pipeY, flipped = false) {
    const pipe = this.pipes.create(
      this.game.width,
      pipeY + (flipped ? -134 : 134) / 2,
      'pipe'
    );
    pipe.body.allowGravity = false;
    pipe.scale.setTo(1, flipped ? -1 : 1);
    pipe.body.velocity.x = -200;

    return pipe;
  }

  spawnPipes() {
    const pipeY = ((this.game.height - 16 - 134 / 2) / 2) + (Math.random() > 0.5 ? -1 : 1) * Math.random() * this.game.height / 6;
    this.spawnPipe(pipeY);
    const topPipe = this.spawnPipe(pipeY, true);

    const inv = this.holes.create(topPipe.x + topPipe.width, 0);
    inv.width = 2;
    inv.height = this.game.world.height;
    inv.body.allowGravity = false;
    inv.body.velocity.x = -200;

  }
}
