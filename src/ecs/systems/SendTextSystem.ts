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
import { CPosition, CTextBubble, Tags } from '../components';
import Game from '../Game';
import loadTextBubbleTextures, {
  TextBubbleTextures,
} from '../../utils/loadTextBubbleTextures';
import { textureScale } from '../../utils/globals';

class SendTextSystem extends System {
  game: Game;
  app: Application<ICanvas>;
  newTextQuery: Query;
  existingTextQuery: Query;
  posQuery: Query;
  textBubbleTextures: TextBubbleTextures;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;

    this.newTextQuery = this.createQuery()
      .fromAll(CTextBubble, Tags.New)
      .persist();
    this.existingTextQuery = this.createQuery()
      .fromAll(CTextBubble)
      .not(Tags.New)
      .persist();
    this.posQuery = this.createQuery()
      .fromAll(CTextBubble, CPosition)
      .persist();

    this.textBubbleTextures = loadTextBubbleTextures();
  }

  update(tick: number) {
    this.newTextQuery.execute().forEach((entity: Entity) => {
      this.sendNewTextBubble(entity);
      this.bumpExistingText(entity);
    });

    this.posQuery?.execute()?.forEach(this.setPosition);
  }

  sendNewTextBubble = (entity: Entity): void => {
    const cTextBubble: CTextBubble = entity.getOne(CTextBubble);

    // FIXME: Dupe code
    // const style = new TextStyle({
    //   fontFamily: ['Minecraft', 'Arial'],
    //   fontSize: 16,
    //   wordWrap: true,
    //   wordWrapWidth: Math.min(this.game.size.width, 200),
    // });
    // const text = new Text(cTextBubble.message, style);
    // text.anchor.set(0.5);

    const { container, text } = this.createTextBubbleContainer(
      cTextBubble.message
    );
    this.app.stage.addChild(container);
    cTextBubble.container = container;
    cTextBubble.text = text;

    cTextBubble.update();
    entity.removeTag(Tags.New);
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
    const scale = textureScale;
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

    console.log('sides.left', sides.left.width, sides.left.height);

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

    return { container, text };
  };

  bumpExistingText = (entity: Entity): void => {
    const newCText: CTextBubble = entity.getOne(CTextBubble);
  };

  setPosition = (entity: Entity): void => {
    const cTextBubble: CTextBubble = entity.getOne(CTextBubble);
    const { container } = cTextBubble;
    if (!container) return;

    const cPos: CPosition = entity.getOne(CPosition);
    container.x = cPos.x;
    container.y = cPos.y;
    cTextBubble.update();
  };
}

export default SendTextSystem;
