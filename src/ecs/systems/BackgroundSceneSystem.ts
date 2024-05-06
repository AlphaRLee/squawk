import { Entity, System, World } from 'ape-ecs';
import { Application, Container, ICanvas, Sprite, TilingSprite } from 'pixi.js';
import Game from '../Game';
import { CPosition, CSize, CType, Tags } from '../components';
import loadGroundTextures from '../../utils/loadGroundTextures';

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
      .execute()
      .forEach(this.createGround);
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
}
