'use client';

import React from 'react';
import { Mic } from 'lucide-react';
import { useParams } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Room,
} from '@/shared/components';
import { useMicroStatus } from '@/shared/hooks';
import { SocketProvider } from '@/shared/context/socket-context';

export default function RoomPage(): React.JSX.Element {
  const { id } = useParams();
  const { status } = useMicroStatus();

  const [isOpenWarning, setIsOpenWarning] = React.useState(false);

  React.useEffect(() => {
    if (status === 'prompt' || status === 'denied') {
      setIsOpenWarning(true);
    }
  }, [status]);

  return (
    <SocketProvider>
      <AlertDialog open={isOpenWarning} defaultOpen={false}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='gap-2 flex items-center'>
              <Mic size={20} /> Разрешите доступ к микрофону
            </AlertDialogTitle>
            <AlertDialogDescription>
              Таким образом все собеседники внутри комнаты будут слышать ваш
              замечательный голос
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpenWarning(false)}>
              Пропустить
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Room roomId={id as string} />
    </SocketProvider>
  );
}
