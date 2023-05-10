import { Application, ICanvas, Ticker } from 'pixi.js';
import { useTick } from '@pixi/react';
import { World } from 'ape-ecs';
import {
  Tags,
  CAnimatedSprite,
  CSprite,
  CPosition,
  CGame,
  CType,
  CText,
  CTextBubble,
} from './components';
import { RunType, SendTextSystem, SpriteSystem } from './systems';
import loadPetTextures from '../utils/loadPetTextures';
import CVelocity from './components/CVelocity';

class Game {
  app: Application<ICanvas>;
  size: { width: number; height: number };
  ecs: World;

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
    this.ecs.registerComponent(CVelocity);
    this.ecs.registerComponent(CText);
    this.ecs.registerComponent(CTextBubble);

    this.createGameEntity();
    this.createPetEntity();

    this.ecs.registerSystem(RunType.tick, SpriteSystem);
    this.ecs.registerSystem(RunType.tick, SendTextSystem);

    // TODO: Add event listeners here? Good for mouse press types
  }

  ticker = (delta: number, ticker: Ticker): void => {
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
      tags: [Tags.New],
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
          type: CType.CPosition,
          key: 'cPosition',
          x: this.size.width / 2,
          y: this.size.height - 200,
        },
      ],
      tags: [Tags.New],
    });
  }
}

export default Game;
