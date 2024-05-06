import { Texture, BaseTexture, Rectangle, SCALE_MODES } from 'pixi.js';
const petSpriteSheetImg = '/assets/BirdSprite.png';

export type PetAnimationTextures = {
  idle: Texture[];
  flying: Texture[];
  pecking: Texture[];
  turningToFront: Texture[];
  turningToFrontAngry: Texture[];
  eating: Texture[];
  eating2: Texture[];
  shocked: Texture[];
  sweating: Texture[];
};

const w = 16;
const h = 16;

let petAnimationTextures: PetAnimationTextures | undefined;

const loadPetTextures = (): PetAnimationTextures => {
  if (petAnimationTextures) return petAnimationTextures;

  const baseTexture = BaseTexture.from(petSpriteSheetImg);
  baseTexture.scaleMode = SCALE_MODES.NEAREST;

  const textureAt = buildTexture(baseTexture, w, h);
  const texturesAt = buildTextures(baseTexture, w, h);

  const mainPose = textureAt(0, 0);

  petAnimationTextures = {
    idle: [mainPose, textureAt(1, 0)],
    flying: texturesAt(0, 1, 7),
    pecking: texturesAt(0, 2, 2),
    turningToFront: texturesAt(0, 3, 2),
    turningToFrontAngry: texturesAt(0, 4, 2),
    eating: texturesAt(0, 5, 3),
    eating2: texturesAt(0, 6, 3),
    shocked: texturesAt(0, 7, 3),
    sweating: texturesAt(0, 8, 2),
  };

  return petAnimationTextures;
};

const buildTexture =
  (baseTexture: BaseTexture, width: number, height: number) =>
  (x: number, y: number): Texture =>
    new Texture(
      baseTexture,
      new Rectangle(x * width, y * height, width, height)
    );

const buildTextures =
  (baseTexture: BaseTexture, width: number, height: number) =>
  (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number = fromY
  ): Texture[] => {
    const textures: Texture[] = [];
    for (let y = fromY; y <= toY; y++) {
      for (let x = fromX; x <= toX; x++) {
        textures.push(
          new Texture(
            baseTexture,
            new Rectangle(x * width, y * height, width, height)
          )
        );
      }
    }
    return textures;
  };

export default loadPetTextures;
