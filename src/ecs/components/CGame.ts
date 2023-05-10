import { Component } from 'ape-ecs';
import Game from '../Game';

class CGame extends Component {
  game: Game;

  static properties = {
    game: undefined as Game,
  };
}

export default CGame;
