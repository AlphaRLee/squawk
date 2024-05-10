import { System, World } from 'ape-ecs';
import { CActivity, CAnimatedSprite, CSprite, Tags } from '../components';
import { AnimatedSprite, Application, ICanvas, Sprite } from 'pixi.js';
import Game from '../Game';
import { Animation, PetActivity } from '../../types';
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
      .not(Tags.destroyed)
      .execute({
        updatedValues: this.world.currentTick - 1,
      })
      .forEach((entity) => {
        const cSprite = entity.c.cSprite as CSprite;
        const cAnimatedSprite = entity.c.cAnimatedSprite as CAnimatedSprite;
        const cActivity = entity.c.cActivity as CActivity;

        // If activity is still the same as the animation, do nothing
        if (cAnimatedSprite.activityName === cActivity.activity.name) return;

        // TODO: Tightly coupled, only pet animations are allowed
        const newAnimation = petAnimations[cActivity.activity.name];
        if (!newAnimation) {
          throw new Error(
            `Entity ${entity.id} has activity ${cActivity.id} ${cActivity.activity.name} but no matching animation found`
          );
        }

        cAnimatedSprite.activityName = cActivity.activity.name;
        cAnimatedSprite.update();
        AnimationSystem.playAnimation(
          cSprite,
          newAnimation,
          cActivity.activity.name,
          this.world
        );
      });
  };

  static playAnimation = (
    cSprite: CSprite,
    animation: Animation,
    activityName: string = undefined,
    world: World = undefined
  ) => {
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

    if (activityName === PetActivity.PECKING) {
      console.log(
        `PECK start world tick ${world.currentTick} -----------------`
      );
      animatedSprite.onFrameChange = (currentFrame: number) => {
        console.log(
          `PECK currentFrame ${currentFrame} world tick ${world.currentTick}`
        );
      };
      animatedSprite.onComplete = () => {
        console.log(`PECK onComplete world tick ${world.currentTick}`);
      };
      animatedSprite.onLoop = () => {
        console.log(`PECK onLoop world tick ${world.currentTick}`);
      };
    } else {
      animatedSprite.onFrameChange = undefined;
      animatedSprite.onLoop = undefined;
      animatedSprite.onComplete = undefined;
    }

    cSprite.update();
  };
}
