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
  CCollisionEventQueue,
  CSize,
  CMass,
  CActivity,
  CSpriteContainer,
  CPlannedActivities,
  CPeckedEventQueue,
  CPeckable,
  VelocityDurationType,
  CCloud,
} from './components';
import {
  VelocitySystem,
  RunType,
  SendTextSystem,
  SpriteSystem,
  CollisionSystem,
  PositionSystem,
  BackgroundSceneSystem,
  registerActivitySystems,
} from './systems';
import loadPetTextures from '../utils/loadPetTextures';
import { MessageData, PetActivity } from '../types';
import { GravitySystem } from './systems/GravitySystem';
import { AnimationSystem } from './systems/AnimationSystem';
import { PetActivitySystem } from './systems/pet/PetActivitySystem';
import { Vector } from '../utils';

class Game {
  app: Application<ICanvas>;
  size: { width: number; height: number };
  ecs: World;
  dt: number;

  // FIXME: React rendering problems, I'm somehow triggering this twice
  constructor(options: {
    app: Application<ICanvas>;
    size: { width: number; height: number };
  }) {
    this.app = options.app;
    this.size = options.size;
    this.ecs = new World();

    this.ecs.registerTags(
      ...[...Object.keys(Tags), ...Object.values(PetActivity)]
    );
    this.ecs.registerComponent(CGame, 1);
    this.ecs.registerComponent(CSprite);
    this.ecs.registerComponent(CSpriteContainer);
    this.ecs.registerComponent(CAnimatedSprite);
    this.ecs.registerComponent(CPosition);
    this.ecs.registerComponent(CPositionAt);
    this.ecs.registerComponent(CSize);
    this.ecs.registerComponent(CMass);
    this.ecs.registerComponent(CVelocity);
    this.ecs.registerComponent(CCloud);
    this.ecs.registerComponent(CTextBubble);
    this.ecs.registerComponent(CCollidable);
    this.ecs.registerComponent(CCollisionEventQueue);
    this.ecs.registerComponent(CActivity);
    this.ecs.registerComponent(CPlannedActivities);
    this.ecs.registerComponent(CPeckedEventQueue);
    this.ecs.registerComponent(CPeckable);

    this.createGameEntity();
    this.createGroundEntity();
    this.createCloudEntities();
    this.createPetEntity('pet', { x: 300, y: 200 });
    // this.createPetEntity('pet2', { x: 100, y: 300 });
    this.app.stage.sortableChildren = true;

    this.ecs.registerSystem(RunType.tick, SpriteSystem);
    this.ecs.registerSystem(RunType.tick, BackgroundSceneSystem);
    this.ecs.registerSystem(RunType.tick, SendTextSystem);
    this.ecs.registerSystem(RunType.tick, AnimationSystem);
    this.ecs.registerSystem(RunType.tick, PositionSystem);
    this.ecs.registerSystem(RunType.tick, VelocitySystem);
    this.ecs.registerSystem(RunType.tick, CollisionSystem);
    this.ecs.registerSystem(RunType.tick, GravitySystem);

    registerActivitySystems(this.ecs);
    this.ecs.registerSystem(RunType.tick, PetActivitySystem);

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

  createPetEntity(id: string, position: Vector): void {
    const petTextures = loadPetTextures();

    this.ecs.createEntity({
      id,
      components: [
        {
          type: CType.CSprite,
          key: 'cSprite',
        },
        {
          type: CType.CAnimatedSprite,
          key: 'cAnimatedSprite',
          activityName: PetActivity.IDLE,
          textures: petTextures.idle,
          textureStates: petTextures,
        },
        {
          type: CType.CPosition,
          key: 'cPosition',
          ...position,
        },
        {
          type: CType.CMass,
          key: 'cMass',
          mass: 1,
        },
        {
          type: CType.CCollidable,
          key: 'cCollidable',
          canBePushed: true,
        },
        {
          type: CType.CActivity,
          key: 'cActivity',
          name: PetActivity.IDLE,
        },
        {
          type: CType.CPlannedActivities,
          key: 'cPlannedActivities',
          plannedActivities: [],
        },
      ],
      tags: [Tags.new, Tags.interactiveSprite, Tags.gravity],
    });
  }

  createGroundEntity(): void {
    this.ecs.createEntity({
      id: 'ground',
      components: [
        {
          type: CType.CPosition,
          key: 'cPosition',
          x: 0,
          y: this.size.height - 100,
        },
        {
          type: CType.CSize,
          key: 'cSize',
          width: this.size.width,
          height: 128,
        },
        {
          type: CType.CCollidable,
          key: 'cCollidable',
          canBePushed: false,
          restitution: 0.4,
        },
        {
          type: CType.CPeckable,
          key: 'cPeckable',
          destroyedOnPeck: false,
        },
      ],
      tags: [Tags.ground, Tags.new],
    });
  }

  createCloudEntities(): void {
    const nClouds = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < nClouds; i++) {
      this.ecs.createEntity({
        components: [
          {
            type: CType.CCloud,
            key: 'cCloud',
            startingPosition: { x: 0, y: 0 },
            screenWidth: this.size.width,
          },
          {
            type: CType.CPosition,
            key: 'cPosition',
            x: Math.floor(Math.random() * this.size.width * 1.2) - 100,
            y: Math.floor(Math.random() * 200) - 10,
          },
          {
            type: CType.CVelocity,
            velocity: {
              x: Math.random() * 2 + 0.5,
              y: 0,
            },
            durationType: VelocityDurationType.INFINITE,
            duration: -1 as number,
          },
        ],
        tags: [Tags.new],
      });
    }
  }

  createTextBubble(message: MessageData) {
    if (!message?.text) return;

    this.ecs.createEntity({
      components: [
        {
          type: CType.CTextBubble,
          key: 'cTextBubble',
          message: message.text,
          timestamp: this.ecs.currentTick,
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
          canBePushed: false,
          restitution: 0.6,
        },
        {
          type: CType.CPeckable,
          key: 'cPeckable',
          destroyedOnPeck: true,
        },
      ],
      tags: [Tags.new],
    });
  }
}

export default Game;
