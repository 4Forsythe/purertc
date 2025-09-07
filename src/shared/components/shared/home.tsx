'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Code, Plus } from 'lucide-react';
import { ROUTES } from '@/shared/constants';

import { Button, Container, JoinRoomForm } from '@/shared/components';

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL;

export const Home: React.FC = () => {
  const router = useRouter();

  const handleGenerateRoom = () => {
    const uuid = crypto.randomUUID();
    router.push(ROUTES.room.id(uuid));
  };

  return (
    <Container className='w-full flex flex-1 flex-col'>
      <div className='my-24 flex flex-1 flex-col'>
        <div className='w-full flex flex-col items-center relative'>
          <div className='w-[50%] h-14 top-[50%] left-[50%] -translate-x-[50%] -z-10 bg-primary/50 dark:bg-primary/25 blur-3xl rounded-full animate-pulse absolute' />
          <h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
            Анонимная аудиосвязь по Wi-Fi и мобильному интернету без ограничений
            и блокировок
          </h1>
          <div className='w-full mt-14 space-y-14 flex flex-col items-center'>
            <JoinRoomForm className='mt-5' />
            <div className='gap-3.5 flex items-center'>
              <Button className='font-bold' onClick={handleGenerateRoom}>
                <Plus size={20} /> Новая комната
              </Button>
              <Button variant='outline' asChild>
                <Link href={GITHUB_URL as string} target='_blank'>
                  <Code size={20} /> GitHub
                </Link>
              </Button>
              <Button variant='ghost' className='font-normal'>
                🤔 Как это работает?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
