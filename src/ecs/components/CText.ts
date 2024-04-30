import { Component } from 'ape-ecs';
import { Text } from 'pixi.js';

/**
 * @deprecated Use CTextBubble. I don't know ECS design principles
 */
export class CText extends Component {
  text: Text;
  message: string;

  static properties = {
    text: undefined as Text,
    message: undefined as string,
  };
}
