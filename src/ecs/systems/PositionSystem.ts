import { Entity, Query, System, World } from 'ape-ecs';
import {
  CPosition,
  CPositionAt,
  CSize,
  CSprite,
  CTextBubble,
  CType,
  PositionAnchor,
} from '../components';
import { Application, ICanvas, Sprite } from 'pixi.js';
import Game from '../Game';
import { Vector } from '../../utils/vector';

export class PositionSystem extends System {
  game: Game;
  app: Application<ICanvas>;
  posAtQuery: Query;
  spritePosQuery: Query;
  textBubblePosQuery: Query;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;

    this.posAtQuery = this.createQuery()
      .fromAll(CSize, CPositionAt)
      .not(CPosition)
      .persist();
    this.spritePosQuery = this.createQuery()
      .fromAll(CSprite, CPosition)
      .persist();
    // TODO: Create a CSpriteContainer component and use instead of CTextBubble
    this.textBubblePosQuery = this.createQuery()
      .fromAll(CTextBubble, CPosition)
      .persist();
  }

  update(tick: number) {
    this.posAtQuery?.execute()?.forEach(this.setAnchoredPosition);
    this.spritePosQuery
      ?.execute({
        updatedValues: tick - 1,
      })
      ?.forEach(this.setSpritePosition);
    this.textBubblePosQuery
      ?.execute({
        updatedValues: tick - 1,
      })
      ?.forEach(this.setTextBubblePosition);
  }

  setAnchoredPosition = (entity: Entity): void => {
    const cSize = entity.getOne(CSize);
    if (!cSize) return;

    const cPosAt = entity.getOne(CPositionAt);
    const topLeftPos: Vector = { x: 0, y: 0 };

    switch (cPosAt.anchor) {
      case PositionAnchor.TOP_LEFT:
        topLeftPos.x = cPosAt.x;
        topLeftPos.y = cPosAt.y;
        break;
      case PositionAnchor.TOP_RIGHT:
        topLeftPos.x = cPosAt.x - cSize.width;
        topLeftPos.y = cPosAt.y;
        break;
      case PositionAnchor.BOTTOM_LEFT:
        topLeftPos.x = cPosAt.x;
        topLeftPos.y = cPosAt.y - cSize.height;
        break;
      case PositionAnchor.BOTTOM_RIGHT:
        topLeftPos.x = cPosAt.x - cSize.width;
        topLeftPos.y = cPosAt.y - cSize.height;
        break;
    }

    entity.removeComponent(cPosAt);
    entity.addComponent({
      type: CType.CPosition,
      key: 'cPosition',
      ...topLeftPos,
    });
  };

  setSpritePosition = (entity: Entity): void => {
    const cSprite: CSprite = entity.getOne(CSprite);
    const sprite: Sprite = cSprite.sprite;
    if (!sprite) return;

    const cPos: CPosition = entity.getOne(CPosition);
    if (sprite.x !== cPos.x || sprite.y !== cPos.y) {
      sprite.x = cPos.x;
      sprite.y = cPos.y;
      cSprite.update();
    }
  };

  setTextBubblePosition = (entity: Entity): void => {
    const cTextBubble: CTextBubble = entity.getOne(CTextBubble);
    const { container } = cTextBubble;
    if (!container) return;

    const cPos: CPosition = entity.getOne(CPosition);
    if (container.x !== cPos.x || container.y !== cPos.y) {
      container.x = cPos.x;
      container.y = cPos.y;
      cTextBubble.update();
    }
  };
}
