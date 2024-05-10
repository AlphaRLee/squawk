import { Component } from 'ape-ecs';
import { CollisionEvent, PeckedEvent } from '../../types';

export class CPeckedEventQueue extends Component {
  events: PeckedEvent[];
  // Amount of time for an event to be considered "recent"
  eventWindow: number;

  static properties = {
    events: [] as PeckedEvent[],
    eventWindow: 60,
  };
}
