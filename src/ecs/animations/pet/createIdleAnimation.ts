import { Animation, PetActivity } from '../../../types';
import loadPetTextures from '../../../utils/loadPetTextures';

export function createIdleAnimation(): Animation {
  const { idle: idleTextures } = loadPetTextures();
  return {
    name: PetActivity.IDLE,
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

export function createIdleBlinkingAnimation(): Animation {
  const { idle: idleTextures, blinking: blinkingTextures } = loadPetTextures();
  return {
    name: PetActivity.IDLE_BLINKING,
    frameIndex: 0,
    speed: 0.1,
    done: false,
    loop: true,
    frames: [{ texture: idleTextures[0] }, { texture: blinkingTextures[0] }],
  };
}

export function createIdleHopLeftAnimation(): Animation {
  const { idle: idleTextures } = loadPetTextures();
  return {
    name: PetActivity.IDLE_HOP_LEFT,
    frameIndex: 0,
    speed: 0.3,
    done: false,
    loop: false,
    frames: [
      { texture: idleTextures[0] },
      { texture: idleTextures[0] },
      { texture: idleTextures[1] },
      { texture: idleTextures[0] },
    ],
  };
}

export function createIdleHopRightAnimation(): Animation {
  const { idle: idleTextures } = loadPetTextures();
  return {
    name: PetActivity.IDLE_HOP_RIGHT,
    frameIndex: 0,
    speed: 0.3,
    done: false,
    loop: false,
    frames: [
      { texture: idleTextures[0] },
      { texture: idleTextures[0] },
      { texture: idleTextures[1] },
      { texture: idleTextures[0] },
    ],
  };
}
