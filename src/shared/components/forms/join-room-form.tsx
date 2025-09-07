'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { ROUTES } from '@/shared/constants';
import { Button, Input } from '../ui';

interface Props {
  className?: string;
}

export const JoinRoomForm: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = React.useState('');

  const handleJoin = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    const trimmed = inputValue.trim();

    if (trimmed) {
      router.push(ROUTES.room.id(trimmed));
    }
  };

  return (
    <form className={cn('max-w-xl w-full gap-2 flex items-center', className)}>
      <Input
        type='text'
        placeholder='Введите ключ комнаты'
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <Button
        type='submit'
        variant='ghost'
        onClick={handleJoin}
        disabled={!inputValue.trim()}>
        Подключиться
      </Button>
    </form>
  );
};
