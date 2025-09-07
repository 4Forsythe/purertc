import React from 'react';
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import { getStringInitials } from '@/lib/get-string-initials';
import { getChatMessageTimestamp } from '@/lib/get-chat-message-timestamp';

import { Avatar, AvatarFallback, Badge } from '../ui';

interface Props {
  type: 'default' | 'system' | 'incoming';
  username: string;
  text: string;
  timestamp: Date;
}

export const ChatMessage: React.FC<Props> = ({
  type = 'default',
  username,
  text,
  timestamp,
}) => {
  const ownerInitials = getStringInitials(username);
  const formattedTimestamp = getChatMessageTimestamp(timestamp);

  return (
    <div
      className={cn('gap-2 mb-5 flex items-end relative', {
        'ml-auto flex-row-reverse': type === 'default',
      })}>
      <Avatar>
        <AvatarFallback className='text-xs'>{ownerInitials}</AvatarFallback>
      </Avatar>
      <div
        className={clsx('gap-1.5 flex flex-col', {
          'items-end': type === 'default',
          'items-start': type === 'incoming',
        })}>
        {type !== 'system' && <Badge variant='secondary'>{username}</Badge>}
        <span className='p-3 text-sm leading-none bg-secondary rounded-lg'>
          {text}
        </span>
        <span className='top-full text-[0.65rem] text-foreground/70 absolute'>
          {formattedTimestamp}
        </span>
      </div>
    </div>
  );
};
