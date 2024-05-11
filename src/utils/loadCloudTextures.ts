import { Texture, BaseTexture, Rectangle, SCALE_MODES } from 'pixi.js';
const groundSpriteSheetImg = '/assets/CloudSprite.png';

export type CloudTextures = {
  small1: Texture;
  small2: Texture;
  medium1: Texture;
  medium2: Texture;
  large1: Texture;
};

const baseUnit = 8;

let cloudTextures: CloudTextures | undefined;

const loadCloudTextures = (): CloudTextures => {
  if (cloudTextures) return cloudTextures;

  const baseTexture = BaseTexture.from(groundSpriteSheetImg);
  baseTexture.scaleMode = SCALE_MODES.NEAREST;

  cloudTextures = {
    small1: buildTexture(baseTexture, baseUnit * 2, baseUnit * 1)(0, 0),
    small2: buildTexture(baseTexture, baseUnit * 3, baseUnit * 1)(1, 0),
    medium1: buildTexture(baseTexture, baseUnit * 3, baseUnit * 2)(0, 0.5),
    medium2: buildTexture(baseTexture, baseUnit * 4, baseUnit * 2)(0.75, 0.5),
    large1: buildTexture(baseTexture, baseUnit * 8, baseUnit * 3)(0, 1),
  };

  return cloudTextures;
};

const buildTexture =
  (baseTexture: BaseTexture, width: number, height: number) =>
  (x: number, y: number): Texture =>
    new Texture(
      baseTexture,
      new Rectangle(x * width, y * height, width, height)
    );

export default loadCloudTextures;
