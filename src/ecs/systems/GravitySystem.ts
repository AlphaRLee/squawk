import { Entity, Query, System, World } from 'ape-ecs';
import { CPosition, CTextBubble, CType, CVelocity, Tags } from '../components';
import { Application, ICanvas } from 'pixi.js';
import Game from '../Game';
import { Vector } from '../../utils/vector';
import { VelocityDurationType } from '../components/CVelocity';

export const GRAVITY_CVELOCITY_KEY = 'cVelocityGravity';
const GRAVITY_ACCELERATION = 0.8;

export class GravitySystem extends System {
  game: Game;
  app: Application<ICanvas>;
  hasGravityQuery: Query;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;

    this.hasGravityQuery = this.createQuery()
      .fromAll(CPosition, Tags.gravity)
      .persist();
  }

  update = (tick: number) => {
    this.hasGravityQuery.execute().forEach(this.applyGravity);
  };

  applyGravity = (entity: Entity) => {
    const cVelocityGravity = entity.c[GRAVITY_CVELOCITY_KEY] as
      | CVelocity
      | undefined;
    if (cVelocityGravity) {
      cVelocityGravity.velocity.y += GRAVITY_ACCELERATION;
      cVelocityGravity.update();
    } else {
      this.addCVelocityGravity(entity, { x: 0, y: GRAVITY_ACCELERATION });
    }
  };

  addCVelocityGravity = (entity: Entity, velocity: Vector) => {
    entity.addComponent({
      type: CType.CVelocity,
      key: GRAVITY_CVELOCITY_KEY,
      velocity,
      durationType: VelocityDurationType.INFINITE,
    });
  };
}
