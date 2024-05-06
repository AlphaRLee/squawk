import { Animation, PetActivity } from '../../../types';
import loadPetTextures from '../../../utils/loadPetTextures';

export function createShockedAnimation(): Animation {
  const { shocked: shockedTextures } = loadPetTextures();
  return {
    name: PetActivity.SHOCKED,
    frameIndex: 0,
    speed: 1,
    done: false,
    loop: false,
    frames: [
      {
        texture: shockedTextures[0],
        // duration: 2,
      },
    ],
  };
}
