import SpriteSystem from './SpriteSystem';
import SendTextSystem from './SendTextSystem';
import PhysicsSystem from './PhysicsSystem';

enum RunType {
  'tick' = 'tick',
  'trigger' = 'trigger',
}

export { RunType, SpriteSystem, SendTextSystem, PhysicsSystem };
