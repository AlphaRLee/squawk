import { Component } from 'ape-ecs';

export class CPosition extends Component {
  x: number;
  y: number;

  static properties = {
    x: 0,
    y: 0,
  };
}
