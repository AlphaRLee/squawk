import { Entity, Query, System, World } from 'ape-ecs';
import { Application, ICanvas } from 'pixi.js';
import Game from '../../Game';
import { CActivity, CPlannedActivities, CVelocity } from '../../components';
import { getNetVelocity } from '../../../utils/velocity';
import {
  Activity,
  ActivityPriority,
  PetActivity,
  PlannedActivity,
} from '../../../types';
import { PetActivitySystem } from './PetActivitySystem';

const FAST_HORIZONTAL_SPEED = 8;
const FAST_UPWARD_SPEED = -5;
const FAST_DOWNWARD_SPEED = 5;

export class ShockedActivitySystem extends System {
  game: Game;
  app: Application<ICanvas>;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;
  }

  update = () => {
    this.world
      .createQuery()
      .fromAll(CPlannedActivities, CActivity, CVelocity)
      .not(PetActivity.SHOCKED)
      .execute()
      .forEach(this.planActivity);

    this.world
      .createQuery()
      .fromAll(CPlannedActivities, CActivity, PetActivity.SHOCKED, CVelocity)
      .execute()
      .forEach(this.executeActivity);
  };

  planActivity = (entity: Entity) => {
    const cActivity = entity.c.cActivity as CActivity;
    const { activity } = cActivity;
    const netVelocity = getNetVelocity(entity);

    if (
      activity.name !== PetActivity.SHOCKED &&
      netVelocity.y <= FAST_UPWARD_SPEED
    ) {
      PetActivitySystem.addPlannedActivity(entity, {
        name: PetActivity.SHOCKED,
        priority: ActivityPriority.REACTION,
      });
    }
  };

  executeActivity = (entity: Entity) => {
    const cActivity = entity.c.cActivity as CActivity;
    const { activity } = cActivity;
    const netVelocity = getNetVelocity(entity);

    if (
      activity.name === PetActivity.SHOCKED &&
      this.world.currentTick - activity.sinceTick > 60 &&
      Math.abs(netVelocity.x) < FAST_HORIZONTAL_SPEED &&
      netVelocity.y > FAST_UPWARD_SPEED &&
      netVelocity.y < FAST_DOWNWARD_SPEED
    ) {
      activity.done = true;
      cActivity.update();

      // FIXME: This belongs in a separated system
      PetActivitySystem.addPlannedActivity(entity, {
        name: PetActivity.IDLE,
        priority: ActivityPriority.IDLE,
      });
    }
  };
}
