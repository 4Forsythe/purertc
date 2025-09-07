'use client';

import React from 'react';

import { Toaster, ThemeProvider } from '@/shared/components';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange>
      {children}
      <Toaster position='bottom-right' expand />
    </ThemeProvider>
  );
};
