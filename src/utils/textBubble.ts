import { Entity, World } from 'ape-ecs';
import { CTextBubble, Tags } from '../ecs/components';

export function textBubblesInclude(
  world: World,
  text: string,
  caseSensitive = false
): boolean {
  const searchText = caseSensitive ? text : text.toLocaleLowerCase();

  const entities = world
    .createQuery()
    .fromAll(CTextBubble)
    .execute({
      updatedComponents: world.currentTick - 1,
    });

  for (const entity of entities) {
    const cTextBubble = entity.getOne(CTextBubble);
    const message = caseSensitive
      ? cTextBubble.message
      : cTextBubble.message.toLocaleLowerCase();
    if (message.includes(searchText)) {
      return true;
    }
  }

  return false;
}
