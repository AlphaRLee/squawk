import { Application, ICanvas, Ticker } from 'pixi.js';
import { World } from 'ape-ecs';
import {
  Tags,
  CAnimatedSprite,
  CSprite,
  CPosition,
  CVelocity,
  CGame,
  CType,
  CTextBubble,
  PositionAnchor,
  CPositionAt,
  CCollidable,
  CSize,
} from './components';
import {
  VelocitySystem,
  RunType,
  SendTextSystem,
  SpriteSystem,
  CollisionSystem,
  PositionSystem,
} from './systems';
import loadPetTextures from '../utils/loadPetTextures';
import { MessageData } from '../types';

class Game {
  app: Application<ICanvas>;
  size: { width: number; height: number };
  ecs: World;
  dt: number;

  constructor(options: {
    app: Application<ICanvas>;
    size: { width: number; height: number };
  }) {
    this.app = options.app;
    this.size = options.size;
    this.ecs = new World();

    this.ecs.registerTags(...Object.keys(Tags));
    this.ecs.registerComponent(CGame, 1);
    this.ecs.registerComponent(CSprite);
    this.ecs.registerComponent(CAnimatedSprite);
    this.ecs.registerComponent(CPosition);
    this.ecs.registerComponent(CPositionAt);
    this.ecs.registerComponent(CSize);
    this.ecs.registerComponent(CVelocity);
    this.ecs.registerComponent(CTextBubble);
    this.ecs.registerComponent(CCollidable);

    this.createGameEntity();
    this.createPetEntity();

    this.ecs.registerSystem(RunType.tick, SpriteSystem);
    this.ecs.registerSystem(RunType.tick, PositionSystem);
    this.ecs.registerSystem(RunType.tick, SendTextSystem);
    this.ecs.registerSystem(RunType.tick, VelocitySystem);
    this.ecs.registerSystem(RunType.tick, CollisionSystem);

    // TODO: Add event listeners here? Good for mouse press types
  }

  onTick = (delta: number, ticker: Ticker): void => {
    // delta represents number of frames b/w last call and this one
    // delta is roughly 1, but can be a decimal based on time
    // By default, everything runs at 60fps, so 1 frame is 16.67 milliseconds
    this.dt = delta;
    this.ecs.tick();
    this.ecs.runSystems(RunType.tick);
  };

  sendMessage(lastMessage: MessageData) {
    this.createTextBubble(lastMessage);
  }

  // Create game reference as an entity
  createGameEntity(): void {
    this.ecs.createEntity({
      id: 'game',
      components: [
        {
          type: CType.CGame,
          key: 'cGame',
          game: this,
        },
      ],
    });
  }

  createPetEntity(): void {
    const petTextures = loadPetTextures();

    this.ecs.createEntity({
      id: 'pet',
      components: [
        {
          type: CType.CSprite,
          key: 'cSprite',
        },
        {
          type: CType.CAnimatedSprite,
          key: 'cAnimatedSprite',
          textures: petTextures.idle,
          textureStates: petTextures,
        },
        {
          type: CType.CPosition,
          key: 'cPosition',
          x: 100,
          y: 150,
        },
        {
          type: CType.CCollidable,
          key: 'cCollidable',
          canCollide: true,
        },
      ],
      tags: [Tags.new, Tags.interactiveSprite],
    });
  }

  createTextBubble(message: MessageData) {
    if (!message?.text) return;

    this.ecs.createEntity({
      components: [
        {
          type: CType.CTextBubble,
          key: 'cTextBubble',
          message: message.text,
        },
        {
          type: CType.CPositionAt,
          key: 'cPositionAt',
          anchor: PositionAnchor.BOTTOM_RIGHT,
          x: this.size.width - 20,
          y: this.size.height - 20,
        },
        {
          type: CType.CCollidable,
          key: 'cCollidable',
          canCollide: true,
        },
      ],
      tags: [Tags.new],
    });
  }
}

export default Game;
