import { Component } from 'ape-ecs';
import { Text } from 'pixi.js';

export class CTextBubble extends Component {
  text: Text;
  message: string;

  static properties = {
    text: undefined as Text,
    message: undefined as string,
  };
}
