import { Component } from 'ape-ecs';
import { CollisionEvent } from '../../types';

export class CCollisionEventQueue extends Component {
  events: CollisionEvent[];

  static properties = {
    events: [] as CollisionEvent[],
  };
}
