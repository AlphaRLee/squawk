export type Vector = {
  x: number;
  y: number;
};

export function getVectorMagnitude(vector: Vector): number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}
