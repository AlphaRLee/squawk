import { Component } from 'ape-ecs';

class CPosition extends Component {
  x: number;
  y: number;

  static properties = {
    x: 0,
    y: 0,
  };
}

export default CPosition;
