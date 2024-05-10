import { Vector } from '../utils/vector';

export const MAX_COLLISION_EVENT_QUEUE_LENGTH = 10;

export type CollisionEvent = {
  timestamp: number;
  member1: CollisionEventMember;
  member2: CollisionEventMember;
};

export type CollisionEventMember = {
  entityId: string;
  velocityIn: Vector;
  velocityOut: Vector;
  canBePushed: boolean;
};
