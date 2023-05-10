import { useRef, useState, useEffect } from 'react';
import { Stage, Container, useApp, useTick } from '@pixi/react';
import Game from '../../ecs/Game';

const maxMessageHistory = 30;
const smSize = 475;

// useApp must be inside a <Stage> element, use GameStage as a light wrapper for this class
// This class bridges Game.ts with React
const GameCore = ({
  lastMessage,
  size,
}: {
  lastMessage: string;
  size: { width: number; height: number };
}) => {
  const app = useApp();

  const gameRef = useRef<Game>(new Game({ app, size }));

  useEffect(() => {
    gameRef.current.sendMessage(lastMessage);
  }, [lastMessage]);

  useTick(gameRef.current.ticker);

  return <Container x={150} y={150}></Container>;
};

export const GameStage = ({ lastMessage }: { lastMessage: string }) => {
  const [messageLog, setMessageLog] = useState<string[]>([]); // FIXME: is log history useful here?

  useEffect(() => {
    let newMessageLog = [...messageLog, lastMessage];
    if (newMessageLog.length > maxMessageHistory) newMessageLog.shift();

    setMessageLog(newMessageLog);
  }, [lastMessage]);

  const size = {
    width: Math.min(window.innerWidth, smSize),
    height: window.innerHeight - 40,
  };

  return (
    <div style={{ display: 'block' }}>
      <Stage
        width={size.width}
        height={size.height}
        options={{ background: '#1099bb' }}
      >
        <GameCore lastMessage={lastMessage} size={size} />
      </Stage>
    </div>
  );
};

export default GameStage;
