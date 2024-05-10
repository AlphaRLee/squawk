import { Entity, Query, System, World } from 'ape-ecs';
import { Application, ICanvas } from 'pixi.js';
import Game from '../../Game';
import { CActivity, CPlannedActivities } from '../../components';
import { ActivityPriority, PetActivity, PlannedActivity } from '../../../types';
import { PetActivitySystem } from './PetActivitySystem';

const START_BLINKING_PROBABILITY = 0.01;
const REPEAT_BLINKING_PROBABILITY = 0.6;
const MAX_BLINKING_REPEATS = 4;

export class IdleActivitySystem extends System {
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
      .execute()
      .forEach(this.planActivity);

    this.world
      .createQuery()
      .fromAll(CActivity, PetActivity.IDLE)
      .execute()
      .forEach(this.executeActivity);

    this.world
      .createQuery()
      .fromAll(CActivity, PetActivity.IDLE_BLINKING)
      .execute()
      .forEach(this.executeBlinkingActivity);
  };

  planActivity = (entity: Entity) => {
    const cActivity = entity.c.cActivity as CActivity;
    const { activity } = cActivity;

    this.planOneIdleActivity(entity);

    if (activity.priority >= ActivityPriority.GOAL) return;

    if (
      Math.random() <= START_BLINKING_PROBABILITY &&
      activity.name !== PetActivity.IDLE_BLINKING
    ) {
      this.addBlinkingActivity(entity);
    }
  };

  planOneIdleActivity = (entity: Entity) => {
    const cPlannedActivities = entity.getOne(CPlannedActivities);
    const { plannedActivities } = cPlannedActivities;

    if (
      plannedActivities.some(
        (plannedActivity) => plannedActivity.name === PetActivity.IDLE
      )
    ) {
      return;
    }

    PetActivitySystem.addPlannedActivity(entity, {
      name: PetActivity.IDLE,
      priority: ActivityPriority.IDLE,
    });
  };

  addBlinkingActivity = (
    entity: Entity,
    timesRepeated = 0
  ): PlannedActivity | undefined => {
    if (timesRepeated >= MAX_BLINKING_REPEATS) return undefined;

    const blinkingActivity: PlannedActivity = {
      name: PetActivity.IDLE_BLINKING,
      priority: ActivityPriority.IDLE,
    };

    if (Math.random() <= REPEAT_BLINKING_PROBABILITY) {
      blinkingActivity.nextActivity = this.addBlinkingActivity(
        entity,
        timesRepeated + 1
      );
    }

    if (timesRepeated === 0) {
      PetActivitySystem.addPlannedActivity(entity, blinkingActivity);
    }

    return blinkingActivity;
  };

  executeActivity = (entity: Entity) => {
    const cActivity = entity.c.cActivity as CActivity;
    const { activity } = cActivity;

    if (this.world.currentTick - activity.sinceTick > 60) {
      activity.done = true;
      cActivity.update();
    }
  };

  executeBlinkingActivity = (entity: Entity) => {
    const cActivity = entity.c.cActivity as CActivity;
    const { activity } = cActivity;

    if (this.world.currentTick - activity.sinceTick > 10) {
      activity.done = true;
      cActivity.update();
    }
  };
}
