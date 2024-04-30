import { Component } from 'ape-ecs';
import Game from '../Game';

export class CGame extends Component {
  game: Game;

  static properties = {
    game: undefined as Game,
  };
}
