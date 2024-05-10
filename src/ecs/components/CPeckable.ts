import { Component } from 'ape-ecs';

export class CPeckable extends Component {
  destroyedOnPeck: boolean;

  static properties = {
    destroyedOnPeck: false,
  };
}
