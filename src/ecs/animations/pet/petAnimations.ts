import { Animation, PetActivity } from '../../../types';
import { createFlyingAnimation } from './createFlyingAnimation';
import {
  createIdleAnimation,
  createIdleBlinkingAnimation,
  createIdleHopLeftAnimation,
  createIdleHopRightAnimation,
} from './createIdleAnimation';
import { createPeckingAnimation } from './createPeckingAnimation';
import { createShockedAnimation } from './createShockedAnimation';

export const petAnimations: Record<PetActivity, Animation> = {
  [PetActivity.IDLE]: createIdleAnimation(),
  [PetActivity.IDLE_BLINKING]: createIdleBlinkingAnimation(),
  [PetActivity.IDLE_HOP_LEFT]: createIdleHopLeftAnimation(),
  [PetActivity.IDLE_HOP_RIGHT]: createIdleHopRightAnimation(),
  [PetActivity.FLYING]: createFlyingAnimation(),
  [PetActivity.SHOCKED]: createShockedAnimation(),
  [PetActivity.PECKING]: createPeckingAnimation(),
};
