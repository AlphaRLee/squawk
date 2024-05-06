import { Component } from 'ape-ecs';
import { Texture, AnimatedSprite } from 'pixi.js';

export class CAnimatedSprite extends Component {
  activityName: string;
  textures: Texture[];
  textureStates: { [k: string]: Texture[] };

  static properties = {
    activityName: '',
    textures: [] as Texture[],
    textureStates: {} as { [k: string]: Texture[] },
  };
}
