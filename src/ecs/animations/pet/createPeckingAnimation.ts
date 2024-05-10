import { Animation, PetActivity } from '../../../types';
import loadPetTextures from '../../../utils/loadPetTextures';

export function createPeckingAnimation(): Animation {
  const { idle: idleTextures, pecking: peckingTextures } = loadPetTextures();
  return {
    name: PetActivity.PECKING,
    frameIndex: 0,
    speed: 0.4,
    done: false,
    loop: true,
    frames: [
      { texture: idleTextures[0] },
      { texture: idleTextures[0] },
      { texture: idleTextures[0] },
      { texture: peckingTextures[0] },
      { texture: peckingTextures[1] },
      { texture: peckingTextures[2] },
      { texture: peckingTextures[2] },
      { texture: peckingTextures[1] },
      { texture: peckingTextures[0] },
      { texture: peckingTextures[0] },
      { texture: peckingTextures[0] },
      { texture: peckingTextures[1] },
      { texture: peckingTextures[2] },
      { texture: peckingTextures[2] },
      { texture: peckingTextures[1] },
      { texture: peckingTextures[0] },
      { texture: idleTextures[0] },
      { texture: idleTextures[0] },
      { texture: idleTextures[0] },
      { texture: idleTextures[0] },
      { texture: idleTextures[0] },
    ],
  };
}
