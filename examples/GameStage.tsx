import { useRef, useReducer } from 'react';
import { Container, Sprite, Stage, useTick } from '@pixi/react';
import { Texture, BaseTexture, Rectangle } from 'pixi.js';

type BunnyData = { x: number; y: number; rotation: number; anchor: number };
const reducer = (_: any, { type, data }: { type: string; data: BunnyData }) =>
  data;

const Bunny = () => {
  const [motion, update] = useReducer(reducer, {
    x: 0,
    y: 0,
    rotation: 0,
    anchor: 0,
  });
  const iter = useRef(0);

  useTick((delta) => {
    const i = (iter.current += 0.05 * delta);

    update({
      type: 'update',
      data: {
        x: Math.sin(i) * 100,
        y: Math.sin(i / 1.5) * 100,
        rotation: Math.sin(i) * Math.PI,
        anchor: Math.sin(i / 2),
      },
    });
  });

  const textureRef = useRef(
    Texture.from('https://pixijs.io/pixi-react/img/bunny.png')
  );

  return <Sprite texture={textureRef.current} {...motion} />;
};

const smSize = 320;

export const GameStage = () => {
  return (
    <Stage
      width={Math.min(window.innerWidth, smSize)}
      height={window.innerHeight}
      options={{ background: '#1099bb' }}
    >
      <Container x={150} y={150}>
        <Bunny />
      </Container>
    </Stage>
  );
};

export default GameStage;
