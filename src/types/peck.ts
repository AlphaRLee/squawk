import { Vector } from '../utils/vector';
import { PlannedActivity } from './activity';

export type PeckingActivity = PlannedActivity & {
  target?: {
    id: string;
    // Position of target, relative to pecker
    relativePosition: Vector;
  };
};

export type PeckedEvent = {
  timestamp: number;
  peckedByEntityId: string;
};
