import { Component } from 'ape-ecs';
import { Container, Sprite, Texture } from 'pixi.js';

export class CSpriteContainer extends Component {
  container: Container;

  static properties = {
    container: undefined as Container,
  };
}
