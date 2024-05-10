import { Component } from 'ape-ecs';
import { PlannedActivity } from '../../types';

export class CPlannedActivities extends Component {
  plannedActivities: PlannedActivity[];

  static properties = {
    plannedActivities: [] as PlannedActivity[],
  };
}
