import { Animation, PetActivity } from '../../../types';
import { createFlyingAnimation } from './createFlyingAnimation';
import { createIdleAnimation } from './createIdleAnimation';
import { createShockedAnimation } from './createShockedAnimation';

export const petAnimations: Record<PetActivity, Animation> = {
  [PetActivity.IDLE]: createIdleAnimation(),
  [PetActivity.FLYING]: createFlyingAnimation(),
  [PetActivity.SHOCKED]: createShockedAnimation(),
};
