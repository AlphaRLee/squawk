import { Component } from 'ape-ecs';
import { Vector } from '../../utils';

export class CCloud extends Component {
  startingPosition: Vector;
  screenWidth: number;

  static properties = {
    startingPosition: { x: 0, y: 0 } as Vector,
    screenWidth: 600,
  };
}
