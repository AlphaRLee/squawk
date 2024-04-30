import { Component } from 'ape-ecs';

export enum PositionAnchor {
  TOP_LEFT = 'top_left',
  TOP_RIGHT = 'top_right',
  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_RIGHT = 'bottom_right',
}

/**
 * CPosition which you can specify where it spawns from
 * Use to initialize a new position of a sprite with unknown dimensions
 * This component is replaced with CPosition after initialization and values are not maintained
 */
export class CPositionAt extends Component {
  anchor: PositionAnchor;
  x: number;
  y: number;

  static properties = {
    anchor: PositionAnchor.TOP_LEFT,
    x: 0,
    y: 0,
  };
}
