import { Entity, Query, System, World } from 'ape-ecs';
import { CPosition, CTextBubble, CVelocity } from '../components';
import { Application, ICanvas } from 'pixi.js';
import Game from '../Game';
import { Vector } from '../../utils/vector';
import { VelocityDurationType } from '../components/CVelocity';

class PhysicsSystem extends System {
  game: Game;
  app: Application<ICanvas>;
  hasVelocityQuery: Query;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;

    this.hasVelocityQuery = this.createQuery()
      .fromAll(CVelocity, CPosition)
      .persist();
  }

  update(tick: number) {
    this.applyVelocities();
  }

  applyVelocities = () => {
    this.hasVelocityQuery.execute().forEach((entity: Entity) => {
      const netVelocity: Vector = { x: 0, y: 0 };
      entity.getComponents(CVelocity).forEach((cVelocity: CVelocity) => {
        const { velocity } = cVelocity;
        netVelocity.x += velocity.x;
        netVelocity.y += velocity.y;

        this.decrementVelocityDuration(entity, cVelocity);
      });

      this.applyNetVelocity(entity, netVelocity);
    });
  };

  decrementVelocityDuration = (entity: Entity, cVelocity: CVelocity) => {
    switch (cVelocity.durationType) {
      case VelocityDurationType.INFINITE:
        // Do nothing, keep velocity forever
        break;
      case VelocityDurationType.INSTANT:
        entity.removeComponent(cVelocity);
        break;
      case VelocityDurationType.TIMED:
        cVelocity.duration = cVelocity.duration - 1;
        if (cVelocity.duration <= 0) {
          entity.removeComponent(cVelocity);
        }
        cVelocity.update();
        break;

      default:
        console.warn('Unrecognized cVelocity.durationType', cVelocity);
        break;
    }
  };

  applyNetVelocity = (entity: Entity, velocity: Vector) => {
    const cPosition: CPosition = entity.getOne(CPosition);
    cPosition.x += velocity.x;
    cPosition.y += velocity.y;
    cPosition.update();
  };
}

export default PhysicsSystem;
