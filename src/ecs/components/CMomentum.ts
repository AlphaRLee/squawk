import { Component } from 'ape-ecs';
import { Vector } from '../../utils/vector';

export class CMomentum extends Component {
  magnitude: number;
  vector: Vector;

  static properties = {
    magnitude: undefined as number,
    vector: {
      x: 0,
      y: 0,
    },
  };
}
