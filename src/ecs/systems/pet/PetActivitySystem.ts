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

// TODO: In an ideal world, this is abstracted out to not be dependent on pet
export class PetActivitySystem extends System {
  game: Game;
  app: Application<ICanvas>;
  activityQuery: Query;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;

    this.activityQuery = this.world
      .createQuery()
      .fromAll(CPlannedActivities, CActivity, CVelocity);
  }

  update = () => {
    this.activityQuery
      .execute({
        updatedValues: this.world.currentTick - 1,
      })
      .forEach(this.executePlannedActivity);
  };

  static addPlannedActivity = (
    entity: Entity,
    plannedActivity: PlannedActivity
  ) => {
    const cPlannedActivities = entity.c
      .cPlannedActivities as CPlannedActivities;
    cPlannedActivities.plannedActivities.push(plannedActivity);
    cPlannedActivities.update();
  };

  executePlannedActivity = (entity: Entity): void => {
    const cActivity = entity.c.cActivity as CActivity;
    const currentActivity = cActivity.activity;
    const cPlannedActivities = entity.c
      .cPlannedActivities as CPlannedActivities;
    let { plannedActivities } = cPlannedActivities;

    this.clearDonePlannedActivities(cPlannedActivities);
    plannedActivities = cPlannedActivities.plannedActivities;
    if (!plannedActivities.length) return;

    const nextActivityIndex =
      this.getNextPlannedActivityIndex(plannedActivities);
    const nextActivity = plannedActivities[nextActivityIndex];

    if (currentActivity.done) {
      if (currentActivity.nextActivity) {
        PetActivitySystem.addPlannedActivity(
          entity,
          currentActivity.nextActivity
        );
      }
      this.updateActivity(entity, nextActivityIndex);
      return;
    }

    if (
      nextActivity.priority >= currentActivity.priority &&
      nextActivity.name !== currentActivity.name
    ) {
      PetActivitySystem.addPlannedActivity(entity, currentActivity);
      this.updateActivity(entity, nextActivityIndex);
    }
  };

  clearDonePlannedActivities = (cPlannedActivities: CPlannedActivities) => {
    const { plannedActivities } = cPlannedActivities;

    if (!plannedActivities.length) return;

    // Get activities that are not done (i.e. undefined or false)
    const recentlyPlannedActivities = plannedActivities.filter(
      (plannedActivity) => !plannedActivity.done
    );

    if (recentlyPlannedActivities.length < plannedActivities.length) {
      cPlannedActivities.plannedActivities = recentlyPlannedActivities;
      cPlannedActivities.update();
    }
  };

  getNextPlannedActivityIndex = (plannedActivities: PlannedActivity[]) =>
    plannedActivities.reduce(
      (
        priorityActivityIndex: number,
        plannedActivity: PlannedActivity,
        plannedActivityIndex: number
      ) => {
        if (priorityActivityIndex < 0) return plannedActivityIndex;
        const priorityActivity = plannedActivities[priorityActivityIndex];
        return plannedActivity.priority > priorityActivity.priority
          ? plannedActivityIndex
          : priorityActivityIndex;
      },
      -1
    );

  updateActivity = (entity: Entity, plannedActivityIndex: number): void => {
    const cActivity = entity.c.cActivity as CActivity;
    const currentActivity = cActivity.activity;
    const cPlannedActivities = entity.c
      .cPlannedActivities as CPlannedActivities;
    const { plannedActivities } = cPlannedActivities;
    const plannedActivity = plannedActivities[plannedActivityIndex];

    entity.removeTag(currentActivity.name);
    cActivity.activity = {
      ...plannedActivity,
      sinceTick: this.world.currentTick,
    };
    entity.addTag(plannedActivity.name);

    cPlannedActivities.plannedActivities.splice(plannedActivityIndex, 1);
    cPlannedActivities.update();
  };
}
