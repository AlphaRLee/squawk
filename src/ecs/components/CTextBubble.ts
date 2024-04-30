import { Component } from 'ape-ecs';
import { Container, Text } from 'pixi.js';

export class CTextBubble extends Component {
  container: Container;
  text: Text;
  message: string;

  static properties = {
    container: undefined as Container,
    text: undefined as Text,
    message: undefined as string,
  };
}
