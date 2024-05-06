import { Entity, System, World } from 'ape-ecs';
import { Application, ICanvas } from 'pixi.js';
import Game from '../../Game';
import { CActivity, CVelocity } from '../../components';
import { getNetVelocity } from '../../../utils/velocity';
import { PetActivity } from '../../../types';

const FAST_HORIZONTAL_SPEED = 8;
const FAST_UPWARD_SPEED = -5;
const FAST_DOWNWARD_SPEED = 5;

// TODO: In an ideal world, this is abstracted out to not be dependent on pet
export class PetActivitySystem extends System {
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
      .fromAll(CActivity, CVelocity)
      .execute()
      .forEach(this.reactToVelocity);
  };

  reactToVelocity = (entity: Entity) => {
    // FIXME: Oversimplified - for now, assume simply going up at a fast velocity means be shocked
    const cActivity = entity.c.cActivity as CActivity;
    const netVelocity = getNetVelocity(entity);

    if (
      cActivity.name !== PetActivity.SHOCKED &&
      netVelocity.y <= FAST_UPWARD_SPEED
    ) {
      this.updateActivity(cActivity, PetActivity.SHOCKED);
    }

    if (
      cActivity.name !== PetActivity.IDLE &&
      this.world.currentTick - cActivity.sinceTick > 60 &&
      Math.abs(netVelocity.x) < FAST_HORIZONTAL_SPEED &&
      netVelocity.y > FAST_UPWARD_SPEED &&
      netVelocity.y < FAST_DOWNWARD_SPEED
    ) {
      this.updateActivity(cActivity, PetActivity.IDLE);
    }
  };

  updateActivity = (cActivity: CActivity, name: PetActivity): void => {
    cActivity.name = name;
    cActivity.sinceTick = this.world.currentTick;
    cActivity.update();
  };
}
