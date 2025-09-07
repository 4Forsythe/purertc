import React from 'react';
import { cn } from '@/lib/utils';
import { getStringInitials } from '@/lib/get-string-initials';

import { Avatar, AvatarFallback } from '../ui';

interface Props {
  member: { name: string };
  isSpeak?: boolean;
  className?: string;
}

export const RoomVoiceMember: React.FC<Props> = ({
  member,
  isSpeak,
  className,
}) => {
  const memberInitials = getStringInitials(member.name);

  return (
    <div
      className={cn(
        'max-w-sm h-64 w-full flex items-center justify-center bg-accent/80 dark:bg-accent/15 border shadow-xs hover:bg-accent hover:dark:bg-accent/20 hover:text-accent-foreground rounded-lg transition duration-200',
        className,
        { 'bg-accent dark:bg-accent/20 border border-primary': isSpeak }
      )}>
      <div className='max-w-[80%] gap-2 flex flex-col items-center'>
        <Avatar>
          <AvatarFallback>{memberInitials}</AvatarFallback>
        </Avatar>
        <span className='text-sm text-center'>{member.name}</span>
      </div>
    </div>
  );
};
