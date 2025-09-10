'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/shared/constants';

import {
  Button,
  Container,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui';
import { CopyButton } from './copy-button';
import { ThemeToggleButton } from './theme-toggle-button';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

export const Header: React.FC = () => {
  const pathname = usePathname();

  const roomId = pathname.split('/').at(-1);

  const fullUrl = BASE_URL.endsWith('/')
    ? BASE_URL.slice(0, -1) + pathname
    : BASE_URL + pathname;

  return (
    <Container className='w-full flex-none'>
      <header className='w-full py-8 flex items-center justify-center'>
        <div className='w-full gap-2.5 flex items-center justify-between'>
          <span className='text-lg font-black cursor-default select-none'>
            PureRTC
          </span>
          {pathname.startsWith(ROUTES.room.root) &&
            !pathname.endsWith(ROUTES.room.root) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className='text-xs font-normal'
                    variant='ghost'
                    size='sm'>
                    Поделиться ссылкой
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-md w-full'>
                  <DialogHeader>
                    <DialogTitle>Поделиться ссылкой</DialogTitle>
                    <DialogDescription>
                      Скопируйте ключ или URL-адрес комнаты в буфер обмена,
                      чтобы поделиться ими с друзьями
                    </DialogDescription>
                  </DialogHeader>
                  <div className='gap-3 flex flex-col'>
                    {roomId && (
                      <div className='gap-2 flex flex-col'>
                        <span className='text-sm text-accent-foreground'>
                          Ключ комнаты
                        </span>
                        <CopyButton
                          className='text-muted-foreground'
                          variant='outline'
                          clipboard={roomId}>
                          {roomId}
                        </CopyButton>
                      </div>
                    )}
                    {fullUrl && (
                      <div className='grid gap-3'>
                        <span className='text-sm text-accent-foreground'>
                          URL
                        </span>
                        <CopyButton
                          className='text-muted-foreground'
                          variant='outline'
                          clipboard={fullUrl}>
                          {fullUrl}
                        </CopyButton>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant='outline'>Закрыть</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          <ThemeToggleButton />
        </div>
      </header>
    </Container>
  );
};
