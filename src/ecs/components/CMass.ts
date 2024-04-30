import { Component } from 'ape-ecs';

export class CMass extends Component {
  mass: number;

  static properties = {
    mass: 1, // Default to 1 because you're probably gonna make a divide by 0 error somewhere if you don't
  };
}
