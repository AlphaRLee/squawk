import { Texture, BaseTexture, Rectangle, SCALE_MODES } from 'pixi.js';
import groundSpriteSheetImg from '../assets/GroundSprite.png';

export type GroundTextures = {
  base: Texture;
  left: Texture;
  right: Texture;
};

// Texture is 32x32 blocks, intentionally trying half sized
const w = 32;
const h = 32;
// const w = 16;
// const h = 16;

let groundTextures: GroundTextures | undefined;

const loadGroundTextures = (): GroundTextures => {
  if (groundTextures) return groundTextures;

  const baseTexture = BaseTexture.from(groundSpriteSheetImg);
  baseTexture.scaleMode = SCALE_MODES.NEAREST;

  const textureAt = buildTexture(baseTexture, w, h);

  groundTextures = {
    base: textureAt(1, 1),
    left: textureAt(0, 1),
    right: textureAt(4, 1),
    // Trying out 16x16
    // base: textureAt(1, 2),
    // left: textureAt(0, 2),
    // right: textureAt(9, 2),
  };

  return groundTextures;
};

const buildTexture =
  (baseTexture: BaseTexture, width: number, height: number) =>
  (x: number, y: number): Texture =>
    new Texture(
      baseTexture,
      new Rectangle(x * width, y * height, width, height)
    );

export default loadGroundTextures;
