import { Component } from 'ape-ecs';

export class CActivity extends Component {
  name: string;
  sinceTick: number;

  static properties = {
    name: '',
    sinceTick: 0,
  };
}
