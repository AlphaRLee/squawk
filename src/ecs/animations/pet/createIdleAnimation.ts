import { Animation, PetActivity } from '../../../types';
import loadPetTextures from '../../../utils/loadPetTextures';

export function createIdleAnimation(): Animation {
  const { idle: idleTextures } = loadPetTextures();
  return {
    name: PetActivity.SHOCKED,
    frameIndex: 0,
    speed: 0.015,
    done: false,
    loop: true,
    frames: [
      {
        texture: idleTextures[0],
      },
      {
        texture: idleTextures[1],
      },
    ],
  };
}
