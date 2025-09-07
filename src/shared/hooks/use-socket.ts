'use client';

import React from 'react';
import { SocketContext } from '../context/socket-context';

export function useSocket() {
  return React.useContext(SocketContext);
}
