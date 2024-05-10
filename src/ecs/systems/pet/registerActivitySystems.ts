import { World } from 'ape-ecs';
import { RunType } from '..';
import { ShockedActivitySystem } from './ShockedActivitySystem';

export function registerActivitySystems(world: World) {
  world.registerSystem(RunType.tick, ShockedActivitySystem);
}
