import { System, World } from 'ape-ecs';
import { CActivity, CAnimatedSprite, CSprite } from '../components';
import { AnimatedSprite, Application, ICanvas, Sprite } from 'pixi.js';
import Game from '../Game';
import { Animation } from '../../types';
import { petAnimations } from '../animations/pet';

export class AnimationSystem extends System {
  game: Game;
  app: Application<ICanvas>;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;
  }

  update(tick: number) {
    this.updateAnimationOnActivityChange();
  }

  updateAnimationOnActivityChange = () => {
    this.world
      .createQuery()
      .fromAll(CSprite, CAnimatedSprite, CActivity)
      .execute({
        updatedValues: this.world.currentTick - 1,
      })
      .forEach((entity) => {
        const cSprite = entity.c.cSprite as CSprite;
        const cAnimatedSprite = entity.c.cAnimatedSprite as CAnimatedSprite;
        const cActivity = entity.c.cActivity as CActivity;

        // If activity is still the same as the animation, do nothing
        if (cAnimatedSprite.activityName === cActivity.name) return;

        // TODO: Tightly coupled, only pet animations are allowed
        const newAnimation = petAnimations[cActivity.name];
        if (!newAnimation) {
          throw new Error(
            `Entity ${entity.id} has activity ${cActivity.id} ${cActivity.name} but no matching animation found`
          );
        }

        cAnimatedSprite.activityName = cActivity.name;
        cAnimatedSprite.update();
        AnimationSystem.playAnimation(cSprite, newAnimation);
      });
  };

  static playAnimation = (cSprite: CSprite, animation: Animation) => {
    const animatedSprite = cSprite.sprite;
    if (!(animatedSprite instanceof AnimatedSprite)) {
      throw new Error(
        `Expected ${cSprite.id} sprite to be an instance of AnimatedSprite`
      );
    }
    animatedSprite.textures = animation.frames.map((frame) => frame.texture);
    animatedSprite.animationSpeed = animation.speed;
    animatedSprite.loop = animation.loop;
    animatedSprite.play();

    cSprite.update();
  };
}
