import { useState, useEffect } from 'react';
import './App.css';
import GameStage from './components/game/GameStage';
import MessageInput from './components/text/MessageInput';

function App() {
  const [lastMessage, setLastMessage] = useState<string>();

  const onMessageSubmit = (message: string) => {
    setLastMessage(message);
  };

  return (
    <div className="App">
      <GameStage lastMessage={lastMessage} />
      <MessageInput onSubmit={onMessageSubmit} />
    </div>
  );
}

export default App;
