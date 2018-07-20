import 'p2';
import 'pixi';
import 'phaser';
import MainState from './states/mainstate';
import config from './config';

class App extends Phaser.Game {
  constructor () {
    super(config.gameWidth, config.gameHeight, Phaser.CANVAS, 'content', null);

    this.state.add('main', MainState, false);

    this.state.start('main');
  }
}

window.onload = () => {
  let app = new App();
};