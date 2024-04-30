import { Component } from 'ape-ecs';

export class CCollidable extends Component {
  canCollide: boolean;

  static properties = {
    canCollide: true,
  };
}
