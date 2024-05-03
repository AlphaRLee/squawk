import { Entity, Query, System, World } from 'ape-ecs';
import {
  CCollidable,
  CMass,
  CPosition,
  CType,
  CVelocity,
  VelocityDurationType,
} from '../components';
import { Application, ICanvas } from 'pixi.js';
import Game from '../Game';
import { Vector } from '../../utils/vector';

export class CollisionSystem extends System {
  game: Game;
  app: Application<ICanvas>;
  collidableQuery: Query;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;

    this.collidableQuery = this.createQuery()
      .fromAll(CCollidable, CPosition)
      .persist();
  }

  update = (tick: number) => {
    const collidedPairs = this.detectCollided();
    collidedPairs.forEach(this.applyCollision);
  };

  detectCollided = (): Set<[Entity, Entity]> => {
    const collidedPairIds: Set<[string, string]> = new Set();
    const collidedPairs: Set<[Entity, Entity]> = new Set();

    // TODO: Implement a performant collision detection algorithm - this one is O(n^2)

    const collidableEntities = this.collidableQuery.execute();
    // Only fetch entities whose values (i.e. position) changed since the last tick
    const recentlyMovedEntities = this.createQuery()
      .fromAll(CCollidable, CPosition)
      .execute({
        updatedValues: this.world.currentTick - 1,
      });

    for (const recentlyMovedEntity of recentlyMovedEntities) {
      for (const collidableEntity of collidableEntities) {
        if (
          recentlyMovedEntity.id === collidableEntity.id ||
          collidedPairIds.has([collidableEntity.id, recentlyMovedEntity.id])
        ) {
          continue;
        }

        const movedBoundingBox = this.getBoundingBox(recentlyMovedEntity);
        const collidableBoundingBox = this.getBoundingBox(collidableEntity);

        if (
          movedBoundingBox.left < collidableBoundingBox.right &&
          movedBoundingBox.right > collidableBoundingBox.left &&
          movedBoundingBox.top < collidableBoundingBox.bottom &&
          movedBoundingBox.bottom > collidableBoundingBox.top
        ) {
          collidedPairIds.add([recentlyMovedEntity.id, collidableEntity.id]);
          collidedPairs.add([recentlyMovedEntity, collidableEntity]);
        }
      }
    }

    return collidedPairs;
  };

  getBoundingBox = (
    entity: Entity
  ): {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } => {
    const cPos = entity.getOne(CType.CPosition);
    const cSize = entity.getOne(CType.CSize);
    const boundingBox = {
      left: cPos.x,
      top: cPos.y,
      right: cPos.x,
      bottom: cPos.y,
    };

    if (cSize) {
      boundingBox.right += cSize.width;
      boundingBox.bottom += cSize.height;
    }

    return boundingBox;
  };

  applyCollision = ([entity1, entity2]: [Entity, Entity]) => {
    const cCollidable1 = entity1.getOne(CCollidable);
    const cCollidable2 = entity2.getOne(CCollidable);

    if (!cCollidable1.canBePushed && !cCollidable2.canBePushed) {
      return;
    }

    const velocity1 = this.getNetVelocity(entity1);
    const velocity2 = this.getNetVelocity(entity2);

    const cMass1: CMass | undefined = entity1.getOne(CMass);
    const cMass2: CMass | undefined = entity2.getOne(CMass);
    const mass1 = cMass1?.mass;
    const mass2 = cMass2?.mass;

    // Coefficient of restitution, typically defined as |v2Result - v1Result| / |v1 - v2|
    const cor = cCollidable1.restitution * cCollidable2.restitution;

    if (cCollidable1.canBePushed && cCollidable2.canBePushed) {
      if (mass1 === undefined || mass2 === undefined) {
        console.warn(
          `Cannot apply collision, must have both masses mass1 (${mass1}) and mass2 (${mass2})`,
          entity1.getObject(),
          entity2.getObject()
        );
        return;
      }

      function solveVelocityComponent(
        m1: number,
        m2: number,
        v1: number,
        v2: number,
        cor: number // Coefficient of restitution
      ) {
        const p = m1 * v1 + m2 * v2;
        const totalMass = m1 + m2;

        // Inelastic Collision formula in 1d
        const v1Result = (cor * m2 * (v2 - v1) + p) / totalMass;
        const v2Result = (cor * m1 * (v1 - v2) + p) / totalMass;

        return [v1Result, v2Result];
      }

      const [newV1X, newV2X] = solveVelocityComponent(
        mass1,
        mass2,
        velocity1.x,
        velocity2.x,
        cor
      );
      const [newV1Y, newV2Y] = solveVelocityComponent(
        mass1,
        mass2,
        velocity1.y,
        velocity2.y,
        cor
      );

      const newVelocity1 = { x: newV1X, y: newV1Y };
      const newVelocity2 = { x: newV2X, y: newV2Y };

      this.replaceVelocity(entity1, newVelocity1);
      this.replaceVelocity(entity2, newVelocity2);
    } else if (cCollidable1.canBePushed && !cCollidable2.canBePushed) {
      // Assume mass2 is near-infinite, so v2 drops by a tiny amount. Take inelastic collision formula to the limit
      // Unusual result: when v1 = 0 and cor = 1, then v1Result = 2*v2
      const newVelocity1 = {
        x: cor * (velocity2.x - velocity1.x) + velocity2.x,
        y: cor * (velocity2.y - velocity1.y) + velocity2.y,
      };
      this.replaceVelocity(entity1, newVelocity1);
    } else if (!cCollidable1.canBePushed && cCollidable2.canBePushed) {
      // Opposite of above
      const newVelocity2 = {
        x: cor * (velocity1.x - velocity2.x) + velocity1.x,
        y: cor * (velocity1.y - velocity2.y) + velocity1.y,
      };
      this.replaceVelocity(entity2, newVelocity2);
    }
  };

  getNetVelocity = (entity: Entity): Vector => {
    const cVelocities = entity.getComponents(CVelocity);
    return [...cVelocities].reduce(
      (netVelocity: Vector, cVelocity) => {
        netVelocity.x += cVelocity.velocity.x;
        netVelocity.y += cVelocity.velocity.y;
        return netVelocity;
      },
      { x: 0, y: 0 } as Vector
    );
  };

  getSign = (n: number) => {
    return n >= 0 ? 1 : -1;
  };

  replaceVelocity = (entity: Entity, newVelocity: Vector) => {
    entity
      .getComponents(CVelocity)
      .forEach((cVelocity) => entity.removeComponent(cVelocity));
    entity.addComponent({
      type: CType.CVelocity,
      velocity: newVelocity,
      durationType: VelocityDurationType.INFINITE,
    });
  };
}
