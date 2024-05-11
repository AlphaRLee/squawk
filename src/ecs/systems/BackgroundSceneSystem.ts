import { Entity, System, World } from 'ape-ecs';
import { Application, Container, ICanvas, Sprite, TilingSprite } from 'pixi.js';
import Game from '../Game';
import { CCloud, CPosition, CSize, CType, Tags } from '../components';
import loadGroundTextures from '../../utils/loadGroundTextures';
import { loadCloudTextures } from '../../utils';

const GROUND_TILE_SCALE = 4;

export class BackgroundSceneSystem extends System {
  game: Game;
  app: Application<ICanvas>;

  constructor(world: World, ...args: any[]) {
    super(world, ...args);

    this.game = this.world.getEntity('game').c.cGame.game;
    this.app = this.game.app;
  }

  update() {
    this.world
      .createQuery()
      .fromAll(CPosition, CSize, Tags.ground, Tags.new)
      .execute({ updatedComponents: this.world.currentTick - 1 })
      .forEach(this.createGround);
    this.world
      .createQuery()
      .fromAll(CCloud, CPosition, Tags.new)
      .execute({ updatedComponents: this.world.currentTick - 1 })
      .forEach(this.createCloud);
    this.world
      .createQuery()
      .fromAll(CCloud, CPosition)
      .not(Tags.new)
      .execute()
      .forEach(this.resetCloudPosition);
  }

  createGround = (entity: Entity): void => {
    const groundTextures = loadGroundTextures();

    const cSize = entity.c.cSize as CSize;

    const container = new Container();

    const leftSprite = new Sprite();
    leftSprite.texture = groundTextures.left;
    leftSprite.anchor.set(0);
    leftSprite.scale.set(GROUND_TILE_SCALE);
    leftSprite.position = { x: 0, y: 0 };

    const rightSprite = new Sprite();
    rightSprite.texture = groundTextures.right;
    rightSprite.anchor.set(0);
    rightSprite.scale.set(GROUND_TILE_SCALE);
    // Hack, rightSprite is represented as a fraction while leftSprite is represented in px
    rightSprite.position = { x: cSize.width - leftSprite.width, y: 0 };

    const baseSprite = new TilingSprite(
      groundTextures.base,
      (cSize.width - leftSprite.width - leftSprite.width) / GROUND_TILE_SCALE,
      cSize.height / GROUND_TILE_SCALE
    );
    baseSprite.anchor.set(0);
    baseSprite.scale.set(GROUND_TILE_SCALE);
    baseSprite.position = { x: leftSprite.width, y: 0 };

    container.addChild(leftSprite, baseSprite, rightSprite);

    this.app.stage.addChild(container);

    entity.addComponent({
      type: CType.CSpriteContainer,
      container,
    });

    entity.removeTag(Tags.new);
  };

  createCloud = (entity: Entity): void => {
    const cCloud = entity.c.cCloud as CCloud;
    const cPos = entity.getOne(CPosition);

    const cloudTextures = loadCloudTextures();
    const cloudTextureValues = Object.values(cloudTextures);
    const cloudTexture =
      cloudTextureValues[Math.floor(Math.random() * cloudTextureValues.length)];

    const sprite = new Sprite();
    sprite.texture = cloudTexture;
    sprite.anchor.set(0);
    sprite.scale.set(Math.floor(Math.random() * 2) + 2);
    sprite.zIndex = -100;
    this.app.stage.addChild(sprite);

    entity.addComponent({
      type: CType.CSprite,
      sprite,
      textureStates: {},
    });
    entity.addComponent({
      type: CType.CSize,
      key: 'cSize',
      width: sprite.width,
      height: sprite.height,
    });

    cCloud.startingPosition = { x: cPos.x, y: cPos.y };
    cCloud.update();

    entity.removeTag(Tags.new);
  };

  resetCloudPosition = (entity: Entity) => {
    const cPos = entity.getOne(CPosition);
    const cCloud = entity.c.cCloud as CCloud;

    if (cPos.x > cCloud.screenWidth) {
      cPos.x = -300;
      cPos.update();
    }
  };
}
