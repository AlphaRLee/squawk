import { Component } from 'ape-ecs';

export class CActivity extends Component {
  name: string;

  static properties = {
    name: '',
  };
}
