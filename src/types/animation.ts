import { Texture } from 'pixi.js';
import { Vector } from '../utils/vector';

export type Animation = {
  name: string;
  frameIndex: number;
  speed: number;
  done: boolean;
  loop: boolean;
  frames: AnimationFrame[];
};

export type AnimationFrame = {
  // Texture to show
  texture: Texture;
  // Duration in ticks
  // duration: number;
  // Optional velocity to apply to the sprite
  velocity?: Vector;
};

export enum PetActivity {
  IDLE = 'idle',
  FLYING = 'flying',
  SHOCKED = 'shocked',
}
