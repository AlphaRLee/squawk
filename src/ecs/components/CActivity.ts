import { Component } from 'ape-ecs';
import { Activity, PetActivity } from '../../types';

// An Activity represents the thing the pet is doing right now
export class CActivity extends Component {
  activity: Activity;

  static properties = {
    activity: {
      name: PetActivity.IDLE,
      sinceTick: 0,
      priority: 0,
      done: false,
    } as Activity,
  };
}
