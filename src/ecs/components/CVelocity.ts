import { Component } from 'ape-ecs';
import { Vector } from '../../utils/vector';

export enum VelocityDurationType {
  INFINITE = 'infinite',
  INSTANT = 'instant',
  TIMED = 'timed',
}

export class CVelocity extends Component {
  velocity: Vector;
  durationType: VelocityDurationType;
  duration: number;

  static properties = {
    velocity: { x: 0, y: 0 } as Vector,
    durationType: VelocityDurationType.INFINITE,
    duration: -1 as number,
  };
}
