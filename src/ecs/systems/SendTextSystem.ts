import { World, Query, Entity, System } from 'ape-ecs';
import {
  Text,
  TextStyle,
  Application,
  ICanvas,
  Container,
  Sprite,
  TilingSprite,
  Texture,
  Graphics,
} from 'pixi.js';
import {
  CVelocity,
  VelocityDurationType,
  CPosition,
  CTextBubble,
  CType,
  Tags,
  CPositionAt,
  PositionAnchor,
} from '../components';
import Game from '../Game';
import loadTextBubbleTextures, {
  TextBubbleTextures,
} from '../../utils/loadTextBubbleTextures';
import { TEXTURE_SCALE } from '../../utils/globals';
import { distanceToFrames, timeToFrames } from '../../utils/animation';
import { Vector } from '../../utils/vector';

export class SendTextSystem extends System {
  game: Game;
  app: Application<ICanvas>;
  newTextQuery: Query;
  existingTextQuery: Query;
  // posAtQuery: Query;
  posQuery: Query;
  textBubbleTextures: TextBubbleTextures;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;

    this.newTextQuery = this.createQuery()
      .fromAll(CTextBubble, Tags.new)
      .persist();
    this.existingTextQuery = this.createQuery()
      .fromAll(CTextBubble)
      .not(Tags.new)
      .persist();
    // this.posAtQuery = this.createQuery()
    //   .fromAll(CTextBubble, CPositionAt)
    //   .not(CPosition)
    //   .persist();

    this.textBubbleTextures = loadTextBubbleTextures();
  }

  update(tick: number) {
    this.newTextQuery.execute().forEach((entity: Entity) => {
      this.sendNewTextBubble(entity);
      this.bumpExistingText(entity, this.existingTextQuery.execute());
    });
  }

  sendNewTextBubble = (entity: Entity): void => {
    const cTextBubble: CTextBubble = entity.getOne(CTextBubble);

    const { container, text } = this.createTextBubbleContainer(
      cTextBubble.message
    );
    this.app.stage.addChild(container);
    cTextBubble.container = container;
    cTextBubble.text = text;
    cTextBubble.update();

    entity.addComponent({
      type: CType.CSize,
      key: 'cSize',
      width: container.width,
      height: container.height,
    });

    entity.removeTag(Tags.new);
  };

  createTextBubbleContainer = (
    message: string
  ): { container: Container; text: Text } => {
    const style = new TextStyle({
      fontFamily: ['Minecraft', 'Arial'],
      fontSize: 16,
      wordWrap: true,
      wordWrapWidth: Math.min(this.game.size.width, 200),
    });
    const scale = TEXTURE_SCALE;
    const textureSize = 3;
    const textPadding = textureSize * scale;

    const container = new Container();
    const text = new Text(message, style);

    const graphics: Graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(textPadding, textPadding, text.width, text.height);
    container.addChild(graphics);

    const setupSprite = (sprite: Sprite): void => {
      sprite.anchor.set(0);
      sprite.scale.set(scale);
    };

    const sideTextures = this.textBubbleTextures.side;
    const sides: { [k in keyof TextBubbleTextures['side']]: TilingSprite } = {
      left: new TilingSprite(
        sideTextures.left,
        textureSize,
        text.height / scale
      ),
      right: new TilingSprite(
        sideTextures.right,
        textureSize,
        text.height / scale
      ),
      top: new TilingSprite(sideTextures.top, text.width / scale, textureSize),
      bottom: new TilingSprite(
        sideTextures.bottom,
        text.width / scale,
        textureSize
      ),
    };

    Object.values(sides).forEach((side) => setupSprite(side));

    sides.left.position = { x: 0, y: textPadding };
    sides.right.position = { x: text.width + textPadding, y: textPadding };
    sides.top.position = { x: textPadding, y: 0 };
    sides.bottom.position = { x: textPadding, y: text.height + textPadding };

    const corners = Object.entries(this.textBubbleTextures.corner).reduce(
      (prev, [k, v]: [string, Texture]) => {
        const sprite = new Sprite(v);
        setupSprite(sprite);
        prev[k] = sprite;
        return prev;
      },
      {}
    ) as { [k in keyof TextBubbleTextures['corner']]: Sprite };

    corners.topLeft.position = { x: 0, y: 0 };
    corners.topRight.position = { x: text.width + textPadding, y: 0 };
    corners.bottomLeft.position = { x: 0, y: text.height + textPadding };
    corners.bottomRight.position = {
      x: text.width + textPadding,
      y: text.height + textPadding,
    };

    Object.values(sides).forEach((side) => container.addChild(side));
    Object.values(corners).forEach((corner) => container.addChild(corner));

    text.position = { x: textPadding, y: textPadding };
    container.addChild(text);

    container.interactive = true;

    return { container, text };
  };

  bumpExistingText = (
    newEntity: Entity,
    existingEntities: Set<Entity>
  ): void => {
    const newCTextBubble: CTextBubble = newEntity.getOne(CTextBubble);
    const newContainer: Container = newCTextBubble.container;
    existingEntities.forEach((entity) => {
      const vy = -4;

      entity.addComponent({
        type: CType.CVelocity,
        velocity: {
          x: 0,
          y: vy,
        },
        durationType: VelocityDurationType.TIMED,
        duration: distanceToFrames(newContainer.height, vy),
      });
    });
  };
}
