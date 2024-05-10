import { Entity, Query, System, World } from 'ape-ecs';
import { Application, ICanvas } from 'pixi.js';
import Game from '../../Game';
import { CActivity, CPlannedActivities } from '../../components';
import { ActivityPriority, PetActivity } from '../../../types';
import { PetActivitySystem } from './PetActivitySystem';
import { textBubblesInclude } from '../../../utils';

export class PeckingActivitySystem extends System {
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
      .fromAll(CPlannedActivities, CActivity)
      .not(PetActivity.PECKING)
      .execute()
      .forEach(this.planActivity);

    this.world
      .createQuery()
      .fromAll(CPlannedActivities, CActivity, PetActivity.PECKING)
      .execute()
      .forEach(this.executeActivity);
  };

  planActivity = (entity: Entity) => {
    if (textBubblesInclude(this.world, 'peck')) {
      PetActivitySystem.addPlannedActivity(entity, {
        name: PetActivity.PECKING,
        priority: ActivityPriority.GOAL,
      });
    }
  };

  executeActivity = (entity: Entity) => {
    const cActivity = entity.c.cActivity as CActivity;
    const { activity } = cActivity;

    if (this.world.currentTick - activity.sinceTick > 48) {
      activity.done = true;
      cActivity.update();
    }
  };
}
