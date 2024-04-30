import { useState, useRef, ChangeEvent } from 'react';
import { MessageData } from '../../types';

const MessageInput = ({
  onSubmit,
}: {
  onSubmit: (message: MessageData) => void;
}) => {
  const [message, setMessage] = useState<MessageData>({
    text: '',
    timestamp: Date.now(),
  });

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && message.text !== '') {
      onSubmit(message);
      setMessage({ text: '', timestamp: Date.now() });
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage({ text: event.target.value, timestamp: Date.now() });
  };

  return (
    <div>
      <input
        type="text"
        value={message.text}
        enterKeyHint="send"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default MessageInput;
