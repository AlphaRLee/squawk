import { Texture, BaseTexture, Rectangle, SCALE_MODES } from 'pixi.js';
const textBubbleSpriteSheetImg = '/assets/TextBubbleSprite.png';

export type TextBubbleTextures = {
  side: {
    left: Texture;
    right: Texture;
    top: Texture;
    bottom: Texture;
  };
  corner: {
    topLeft: Texture;
    topRight: Texture;
    bottomLeft: Texture;
    bottomRight: Texture;
  };
  tail: {
    bottomLeftOut: Texture;
    bottomRightOut: Texture;
  };
};

const w = 3;
const h = 3;

let textBubbleTextures: TextBubbleTextures | undefined;

const loadTextBubbleTextures = (): TextBubbleTextures => {
  if (textBubbleTextures) return textBubbleTextures;

  const baseTexture = BaseTexture.from(textBubbleSpriteSheetImg);
  baseTexture.scaleMode = SCALE_MODES.NEAREST;

  const textureAt = buildTexture(baseTexture, w, h);

  textBubbleTextures = {
    side: {
      left: textureAt(4, 0),
      right: textureAt(5, 0),
      top: textureAt(6, 0),
      bottom: textureAt(7, 0),
    },
    corner: {
      topLeft: textureAt(0, 0),
      topRight: textureAt(1, 0),
      bottomLeft: textureAt(2, 0),
      bottomRight: textureAt(3, 0),
    },
    tail: {
      bottomLeftOut: textureAt(8, 0),
      bottomRightOut: textureAt(9, 0),
    },
  };

  return textBubbleTextures;
};

const buildTexture =
  (baseTexture: BaseTexture, width: number, height: number) =>
  (x: number, y: number): Texture =>
    new Texture(
      baseTexture,
      new Rectangle(x * width, y * height, width, height)
    );

export default loadTextBubbleTextures;
