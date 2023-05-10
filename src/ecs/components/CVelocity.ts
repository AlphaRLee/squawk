import { Component } from 'ape-ecs';
import { Vector } from '../../utils/vector';

class CVelocity extends Component {
  velocity: Vector;

  static properties = {
    velocity: { x: 0, y: 0 } as Vector,
  };
}

export default CVelocity;
