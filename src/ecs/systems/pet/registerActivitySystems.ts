import { World } from 'ape-ecs';
import { RunType } from '..';
import { ShockedActivitySystem } from './ShockedActivitySystem';
import { PeckingActivitySystem } from './PeckingActivitySystem';
import { IdleActivitySystem } from './IdleActivitySystem';

export function registerActivitySystems(world: World) {
  world.registerSystem(RunType.tick, IdleActivitySystem);
  world.registerSystem(RunType.tick, ShockedActivitySystem);
  world.registerSystem(RunType.tick, PeckingActivitySystem);
}
