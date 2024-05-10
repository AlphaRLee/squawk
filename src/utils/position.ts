import { Entity } from 'ape-ecs';
import { CType } from '../ecs/components';

export function getBoundingBox(entity: Entity): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  const cPos = entity.getOne(CType.CPosition);
  const cSize = entity.getOne(CType.CSize);
  const boundingBox = {
    left: cPos.x,
    top: cPos.y,
    right: cPos.x,
    bottom: cPos.y,
  };

  if (cSize) {
    boundingBox.right += cSize.width;
    boundingBox.bottom += cSize.height;
  }

  return boundingBox;
}
