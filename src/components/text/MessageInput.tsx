import { useState, useRef } from 'react';

const MessageInput = ({
  onSubmit,
}: {
  onSubmit: (message: string) => void;
}) => {
  const [text, setText] = useState<string>('');

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && text !== '') {
      onSubmit(text);
      setText('');
    }
  };

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        enterKeyHint="send"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default MessageInput;
