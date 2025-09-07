'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { useSocket } from '@/shared/hooks';

import { Button, Input } from '../ui';

interface Props {
  roomId: string;
}

export const SendMessageForm: React.FC<Props> = ({ roomId }) => {
  const [inputValue, setInputValue] = React.useState('');

  const { socket } = useSocket();

  const handleSend = () => {
    const trimmed = inputValue.trim();

    if (trimmed) {
      socket?.emit('room:message', { roomId, text: trimmed });
    }

    setInputValue('');
  };

  return (
    <form className='max-w-xl w-full gap-2 flex flex-none items-center self-center'>
      <Input
        type='text'
        placeholder='Введите сообщение...'
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <Button
        size='icon'
        className='shrink-0'
        type='submit'
        onClick={handleSend}
        disabled={!inputValue.trim()}>
        <Send size={20} />
      </Button>
    </form>
  );
};
