export const MILLISECONDS_PER_FRAME = 16.66;

export function timeToFrames(milliseconds: number): number {
  return milliseconds / MILLISECONDS_PER_FRAME;
}

/**
 * time (frames) = distance (px) / speed (px/frame)
 * @param totalDistance
 * @param unitsPerFrame Speed in px/frame. Negative values are inverted to positive
 * @returns
 */
export function distanceToFrames(
  totalDistance: number,
  unitsPerFrame: number
): number {
  return totalDistance / Math.abs(unitsPerFrame);
}
