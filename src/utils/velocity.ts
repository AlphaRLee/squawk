import { Entity } from 'ape-ecs';
import { Vector } from './vector';
import { CVelocity } from '../ecs/components';

export function getNetVelocity(entity: Entity): Vector {
  const cVelocities = entity.getComponents(CVelocity);
  return [...cVelocities].reduce(
    (netVelocity: Vector, cVelocity) => {
      netVelocity.x += cVelocity.velocity.x;
      netVelocity.y += cVelocity.velocity.y;
      return netVelocity;
    },
    { x: 0, y: 0 } as Vector
  );
}
