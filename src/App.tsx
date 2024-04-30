import { useState, useEffect } from 'react';
import './App.css';
import GameStage from './components/game/GameStage';
import MessageInput from './components/text/MessageInput';
import { MessageData } from './types';

function App() {
  const [lastMessage, setLastMessage] = useState<MessageData>();

  const onMessageSubmit = (message: MessageData) => {
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
