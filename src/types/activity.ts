import { Vector } from '../utils/vector';

export enum PetActivity {
  IDLE = 'ACTIVITY_IDLE',
  FLYING = 'ACTIVITY_FLYING',
  SHOCKED = 'ACTIVITY_SHOCKED',
  PECKING = 'ACTIVITY_PECKING',
}

export enum ActivityPriority {
  REACTION = 300,
  GOAL = 200,
  IDLE = 100,
}

export type PlannedActivity = {
  name: PetActivity;
  // High priority or equal priority activities are executed before low priority activities
  priority: number;
  done?: boolean;
  nextActivity?: PlannedActivity;
};

export type Activity = PlannedActivity & {
  sinceTick: number;
};

export type PeckActivity = PlannedActivity & {
  target: {
    id: string;
    relativePosition: Vector;
  };
};
