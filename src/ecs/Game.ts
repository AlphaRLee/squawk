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
} from './components';
import {
  PhysicsSystem,
  RunType,
  SendTextSystem,
  SpriteSystem,
} from './systems';
import loadPetTextures from '../utils/loadPetTextures';

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
    this.ecs.registerComponent(CVelocity);
    this.ecs.registerComponent(CTextBubble);

    this.createGameEntity();
    this.createPetEntity();

    this.ecs.registerSystem(RunType.tick, SpriteSystem);
    this.ecs.registerSystem(RunType.tick, SendTextSystem);
    this.ecs.registerSystem(RunType.tick, PhysicsSystem);

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

  sendMessage(lastMessage: string) {
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
      ],
      tags: [Tags.new, Tags.interactiveSprite],
    });
  }

  createTextBubble(message: string) {
    if (!message) return;

    this.ecs.createEntity({
      components: [
        {
          type: CType.CTextBubble,
          key: 'cTextBubble',
          message: message,
        },
        {
          type: CType.CPositionAt,
          key: 'cPositionAt',
          anchor: PositionAnchor.BOTTOM_RIGHT,
          x: this.size.width - 20,
          y: this.size.height - 20,
        },
      ],
      tags: [Tags.new],
    });
  }
}

export default Game;
