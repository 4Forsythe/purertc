'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Headphones, HeadphoneOff, LogOut } from 'lucide-react';

import { ROUTES } from '@/shared/constants';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '../ui';
import { useSounds, useMicroStatus } from '@/shared/hooks';

interface Props {
  className?: string;
}

export const RoomControlPanel: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { play } = useSounds();
  const { status } = useMicroStatus();

  const [isMicroOn, setIsMicroOn] = React.useState(true);
  const [isHeadphonesOn, setIsHeadphonesOn] = React.useState(true);

  const handleToggleMicro = () => {
    setIsMicroOn((prev) => !prev);

    if (isMicroOn) {
      play('mute');
    } else {
      play('unmute');
    }
  };

  const handleToggleHeadphones = () => {
    setIsHeadphonesOn((prev) => !prev);
    setIsMicroOn((prev) => (isHeadphonesOn ? false : prev));

    if (isHeadphonesOn) {
      play('mute');
    } else {
      play('unmute');
    }
  };

  React.useEffect(() => {
    if (status === 'denied') {
      setIsMicroOn(false);
    }
  }, [status]);

  return (
    <div
      className={cn(
        'w-fit gap-2 bg-secondary/15 inline-flex items-center',
        className
      )}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className='w-10 h-10'
            variant={isMicroOn ? 'secondary' : 'default'}
            onClick={handleToggleMicro}
            disabled={status === 'unknown' || status === 'denied'}>
            {isMicroOn ? <Mic /> : <MicOff />}
          </Button>
        </TooltipTrigger>
        <TooltipContent className='text-background bg-foreground [&_svg]:bg-foreground [&_svg]:fill-foreground'>
          <p>{isMicroOn ? 'Выкл. микрофон' : 'Вкл. микрофон'}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className='w-10 h-10'
            variant={isHeadphonesOn ? 'secondary' : 'default'}
            onClick={handleToggleHeadphones}>
            {isHeadphonesOn ? <Headphones /> : <HeadphoneOff />}
          </Button>
        </TooltipTrigger>
        <TooltipContent className='text-background bg-foreground [&_svg]:bg-foreground [&_svg]:fill-foreground'>
          <p>{isHeadphonesOn ? 'Выкл. звук' : 'Вкл. звук'}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className='w-10 h-10'
            variant='destructive'
            onClick={() => router.push(ROUTES.home)}>
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent className='text-background bg-foreground [&_svg]:bg-foreground [&_svg]:fill-foreground'>
          <p>Выйти</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
