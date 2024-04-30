import { World, Query, Entity, System } from 'ape-ecs';
import { AnimatedSprite, Application, ICanvas, Sprite } from 'pixi.js';
import {
  CAnimatedSprite,
  CPosition,
  CPositionAt,
  CSprite,
  CType,
  PositionAnchor,
  Tags,
} from '../components';
import Game from '../Game';
import { TEXTURE_SCALE } from '../../utils/globals';
import { Vector } from '../../utils/vector';

class SpriteSystem extends System {
  game: Game;
  app: Application<ICanvas>;
  spriteQuery: Query;
  animatedSpriteQuery: Query;
  posAtQuery: Query;
  posQuery: Query;

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
    this.posQuery = this.createQuery().fromAll(CSprite, CPosition).persist();
    this.posAtQuery = this.createQuery()
      .fromAll(CSprite, CPositionAt)
      .not(CPosition)
      .persist();
  }

  update(tick: number) {
    // FIXME: Why is this.spriteQuery and all other things set in init() always undefined? Fall back to this.queries?
    this.spriteQuery?.execute()?.forEach(this.createSprite);
    this.animatedSpriteQuery?.execute()?.forEach(this.createAnimatedSprite);
    // this.posAtQuery?.execute()?.forEach(this.setAnchoredPosition);
    this.posQuery?.execute()?.forEach(this.setPosition);
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
    sprite.anchor.set(0.5);
    sprite.scale.set(2);

    this.app.stage.addChild(sprite);
    cSprite.sprite = sprite;
    cSprite.update();

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
    sprite.anchor.set(0.5);
    sprite.scale.set(TEXTURE_SCALE);

    this.app.stage.addChild(sprite);
    cSprite.sprite = sprite;
    cAnimSprite.update();

    entity.removeTag(Tags.new);
  };

  /**
   * Replace the CPositionAt with CPosition. Should happen before drawing the CPosition
   * @param entity
   * @returns
   */
  setAnchoredPosition = (entity: Entity): void => {
    const cSprite: CSprite = entity.getOne(CSprite);
    const sprite: Sprite = cSprite.sprite;
    if (!sprite) return;

    const cPosAt = entity.getOne(CPositionAt);
    const topLeftPos: Vector = { x: 0, y: 0 };

    switch (cPosAt.anchor) {
      case PositionAnchor.TOP_LEFT:
        topLeftPos.x = cPosAt.x;
        topLeftPos.y = cPosAt.y;
        break;
      case PositionAnchor.TOP_RIGHT:
        topLeftPos.x = cPosAt.x - sprite.width;
        topLeftPos.y = cPosAt.y;
        break;
      case PositionAnchor.BOTTOM_LEFT:
        topLeftPos.x = cPosAt.x;
        topLeftPos.y = cPosAt.y - sprite.height;
        break;
      case PositionAnchor.BOTTOM_RIGHT:
        topLeftPos.x = cPosAt.x - sprite.width;
        topLeftPos.y = cPosAt.y - sprite.height;
        break;
    }

    entity.removeComponent(cPosAt);
    entity.addComponent({
      type: CType.CPosition,
      key: 'cPosition',
      ...topLeftPos,
    });
  };

  setPosition = (entity: Entity): void => {
    const cSprite: CSprite = entity.getOne(CSprite);
    const sprite: Sprite = cSprite.sprite;
    if (!sprite) return;

    const cPos: CPosition = entity.getOne(CPosition);
    sprite.x = cPos.x;
    sprite.y = cPos.y;
    cSprite.update();
  };
}

export default SpriteSystem;
