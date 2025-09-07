'use client';

import React from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export type SocketContextType = {
  socket: Socket | null;
};

export const SocketContext = React.createContext<SocketContextType>({
  socket: null,
});

export const SocketProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const _socket = io(SERVER_URL);

    _socket.on('connect', () => {
      console.log('Socket is connected');
    });

    _socket.on('disconnect', () => {
      console.log('Socket is disconnected');
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
