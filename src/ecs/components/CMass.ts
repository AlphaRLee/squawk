import { Component } from 'ape-ecs';
import { Vector } from '../../utils/vector';

export class CMass extends Component {
  mass: number;

  static properties = {
    mass: undefined as number,
  };
}
