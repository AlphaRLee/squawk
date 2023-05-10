import { Component } from 'ape-ecs';
import { Texture, AnimatedSprite } from 'pixi.js';

class CAnimatedSprite extends Component {
  textures: Texture[];
  textureStates: { [k: string]: Texture[] };

  static properties = {
    textures: undefined as Texture[],
    textureStates: undefined as { [k: string]: Texture[] },
  };
}

export default CAnimatedSprite;
