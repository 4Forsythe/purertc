import React from 'react';

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div className={cn('max-w-7xl mx-auto my-0', className)}>{children}</div>
  );
};
