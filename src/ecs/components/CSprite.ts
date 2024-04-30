import { Component } from 'ape-ecs';
import { Sprite, Texture } from 'pixi.js';

export class CSprite extends Component {
  sprite: Sprite;
  texture?: Texture;
  textureStates: { [k: string]: Texture };

  static properties = {
    sprite: undefined as Sprite,
    texture: undefined as Texture,
    textureStates: undefined as { [k: string]: Texture },
  };
}
