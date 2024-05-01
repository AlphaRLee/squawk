import { Component } from 'ape-ecs';
import { Vector } from '../../utils/vector';

export class CSize extends Component {
  width: number;
  height: number;

  static properties = {
    width: 0,
    height: 0,
  };
}
