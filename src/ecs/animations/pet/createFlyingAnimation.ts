import { Animation, PetActivity } from '../../../types';
import loadPetTextures from '../../../utils/loadPetTextures';

export function createFlyingAnimation(): Animation {
  const { flying: flyingTextures } = loadPetTextures();
  return {
    name: PetActivity.SHOCKED,
    frameIndex: 0,
    speed: 0.3,
    done: false,
    loop: true,
    frames: flyingTextures.map((texture) => ({ texture })),
  };
}
