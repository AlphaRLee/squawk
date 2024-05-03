import { World, Query, Entity, System } from 'ape-ecs';
import { AnimatedSprite, Application, ICanvas, Sprite } from 'pixi.js';
import {
  CAnimatedSprite,
  CPosition,
  CSprite,
  CType,
  Tags,
} from '../components';
import Game from '../Game';
import { TEXTURE_SCALE } from '../../utils/globals';

export class SpriteSystem extends System {
  game: Game;
  app: Application<ICanvas>;
  spriteQuery: Query;
  animatedSpriteQuery: Query;
  posAtQuery: Query;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    // Somehow this is called before constructor, and all the this references are messed up
    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;

    // TODO: Check if persist is needed for all these
    this.spriteQuery = this.createQuery()
      .fromAll(CSprite, Tags.new)
      .not(CAnimatedSprite)
      .persist();
    this.animatedSpriteQuery = this.createQuery()
      .fromAll(CSprite, CAnimatedSprite, Tags.new)
      .persist();
  }

  update(tick: number) {
    // FIXME: Why is this.spriteQuery and all other things set in init() always undefined? Fall back to this.queries?
    this.spriteQuery?.execute()?.forEach(this.createSprite);
    this.animatedSpriteQuery?.execute()?.forEach(this.createAnimatedSprite);
  }

  createSprite = (entity: Entity): void => {
    const cSprite: CSprite = entity.getOne(CSprite);
    const { texture } = cSprite;
    if (!texture) {
      console.warn(
        'SpriteSystem.createSprite tried creating sprite with no texture',
        cSprite
      );
      return;
    }

    const sprite = new Sprite(texture);
    sprite.scale.set(TEXTURE_SCALE);

    this.app.stage.addChild(sprite);
    cSprite.sprite = sprite;
    cSprite.update();

    entity.addComponent({
      type: CType.CSize,
      key: 'cSize',
      width: sprite.width,
      height: sprite.height,
    });

    entity.removeTag(Tags.new);
  };

  createAnimatedSprite = (entity: Entity): void => {
    const cSprite: CSprite = entity.getOne(CSprite);
    const cAnimSprite: CAnimatedSprite = entity.getOne(CAnimatedSprite);
    const { textures } = cAnimSprite;
    if (!textures || !textures?.length) {
      console.warn(
        'SpriteSystem.createAnimatedSprite tried creating animated sprite with no texture',
        cAnimSprite
      );
      return;
    }

    const sprite = new AnimatedSprite(cAnimSprite.textures);
    sprite.scale.set(TEXTURE_SCALE);

    this.app.stage.addChild(sprite);
    cSprite.sprite = sprite;
    cAnimSprite.update();

    entity.removeTag(Tags.new);
  };
}
