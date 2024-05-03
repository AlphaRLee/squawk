import { Component } from 'ape-ecs';

export class CCollidable extends Component {
  canBePushed: boolean;
  restitution: number;

  static properties = {
    canBePushed: false,
    restitution: 1,
  };
}
