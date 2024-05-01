import { Entity, Query, System, World } from 'ape-ecs';
import { CCollidable, CPosition, CVelocity } from '../components';
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

  update(tick: number) {}

  applyVelocities = () => {
    // this.collidableQuery.execute().forEach((entity: Entity) => {
    //   const netVelocity: Vector = { x: 0, y: 0 };
    //   entity.getComponents(CVelocity).forEach((cVelocity: CVelocity) => {
    //     const { velocity } = cVelocity;
    //     netVelocity.x += velocity.x;
    //     netVelocity.y += velocity.y;
    //     this.decrementVelocityDuration(entity, cVelocity);
    //   });
    //   this.applyNetVelocity(entity, netVelocity);
    // });
  };
}
