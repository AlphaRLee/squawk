import { Animation, PetActivity } from '../../../types';
import { createFlyingAnimation } from './createFlyingAnimation';
import { createIdleAnimation } from './createIdleAnimation';
import { createPeckingAnimation } from './createPeckingAnimation';
import { createShockedAnimation } from './createShockedAnimation';

export const petAnimations: Record<PetActivity, Animation> = {
  [PetActivity.IDLE]: createIdleAnimation(),
  [PetActivity.FLYING]: createFlyingAnimation(),
  [PetActivity.SHOCKED]: createShockedAnimation(),
  [PetActivity.PECKING]: createPeckingAnimation(),
};
