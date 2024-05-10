import { Entity, Query, System, World } from 'ape-ecs';
import { Application, ICanvas } from 'pixi.js';
import Game from '../../Game';
import {
  CActivity,
  CPeckable,
  CPeckedEventQueue,
  CPlannedActivities,
  CPosition,
  CSize,
  CTextBubble,
  CType,
  Tags,
} from '../../components';
import {
  Activity,
  ActivityPriority,
  PeckedEvent,
  PeckingActivity,
  PetActivity,
} from '../../../types';
import { PetActivitySystem } from './PetActivitySystem';
import { Vector, textBubblesInclude } from '../../../utils';
import { getBoundingBox } from '../../../utils/position';

const MAX_PECKED_EVENT_QUEUE_LENGTH = 10;

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
      .fromAll(CPlannedActivities, CActivity, CPosition, CSize)
      .not(PetActivity.PECKING)
      .execute()
      .forEach(this.planActivity);

    this.world
      .createQuery()
      .fromAll(CPlannedActivities, CActivity, PetActivity.PECKING)
      .execute()
      .forEach(this.executeActivity);

    this.world
      .createQuery()
      .fromAll(CPeckable, CPeckedEventQueue)
      .not(Tags.destroyRequested, Tags.destroyed)
      .execute({ updatedValues: this.world.currentTick - 1 })
      .forEach(this.onPecked);
  };

  planActivity = (entity: Entity) => {
    if (textBubblesInclude(this.world, 'peck')) {
      const peckingActivity: PeckingActivity = {
        name: PetActivity.PECKING,
        priority: ActivityPriority.GOAL,
      };
      const peckingTargetData = this.findPeckableUnderEntity(entity);
      if (peckingTargetData) {
        peckingActivity.target = {
          id: peckingTargetData.target.id,
          relativePosition: peckingTargetData.relativePosition,
        };
      }

      PetActivitySystem.addPlannedActivity(entity, peckingActivity);
    }
  };

  findPeckableUnderEntity = (
    entity: Entity
  ): { target: Entity; relativePosition: Vector } | undefined => {
    const peckerBB = getBoundingBox(entity);

    const peckableEntities = this.world
      .createQuery()
      .fromAll(CPeckable, CPosition, CSize)
      .execute();

    const targetPeckable = [...peckableEntities].reduce(
      (target: Entity | null, peckableEntity: Entity) => {
        const peckableBB = getBoundingBox(peckableEntity);

        if (
          peckableBB.bottom < peckerBB.bottom ||
          peckableBB.left > peckerBB.right ||
          peckableBB.right < peckerBB.left
        ) {
          return target;
        }

        return peckableBB.top - peckerBB.bottom <= 3 ? peckableEntity : target;
      },
      null
    );

    if (!targetPeckable) return undefined;

    const targetBB = getBoundingBox(targetPeckable);
    return {
      target: targetPeckable,
      // Position of target, relative to pecker
      relativePosition: {
        x: targetBB.left - peckerBB.left,
        y:
          targetBB.top >= peckerBB.bottom
            ? targetBB.top - peckerBB.top
            : peckerBB.bottom - peckerBB.top,
      },
    };
  };

  executeActivity = (entity: Entity) => {
    const cActivity = entity.c.cActivity as CActivity;
    const activity = cActivity.activity as PeckingActivity & Activity;
    const duration = this.world.currentTick - activity.sinceTick;

    if (activity.target.id) {
      const targets = this.world
        .createQuery()
        .from(activity.target.id)
        .execute();

      if (duration === 10 || duration === 28) {
        this.emitPeckedEvent([...targets][0], entity);
      }
    }

    if (duration > 48) {
      activity.done = true;
      cActivity.update();
    }
  };

  emitPeckedEvent = (entity: Entity, peckedByEntity: Entity) => {
    if (!entity) return;
    const cPeckedEventQueue = entity.getOne(CPeckedEventQueue);

    const peckedEvent: PeckedEvent = {
      timestamp: this.world.currentTick,
      peckedByEntityId: peckedByEntity.id,
    };

    if (cPeckedEventQueue) {
      const { events } = cPeckedEventQueue;

      events.push(peckedEvent);
      if (events.length > MAX_PECKED_EVENT_QUEUE_LENGTH) {
        events.shift();
      }

      cPeckedEventQueue.update();
    } else {
      entity.addComponent({
        type: CType.CPeckedEventQueue,
        events: [peckedEvent],
      });
    }
  };

  onPecked = (entity: Entity) => {
    const cPeckable = entity.c.cPeckable as CPeckable;
    const { destroyedOnPeck } = cPeckable;
    const cPeckedEventQueue = entity.getOne(CPeckedEventQueue);
    const { events, eventWindow } = cPeckedEventQueue;

    if (!events.length || !destroyedOnPeck) return;

    const timesRecentlyPecked = events.reduce(
      (count, event) =>
        this.world.currentTick - event.timestamp <= eventWindow
          ? count + 1
          : count,
      0
    );

    // TODO: Hardcoded 2, extract into CPeckable
    if (timesRecentlyPecked >= 2) {
      entity.addTag(Tags.destroyRequested);
    }
  };
}
