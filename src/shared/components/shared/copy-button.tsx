'use client';

import React from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';

import { Button, buttonVariants } from '../ui';

interface Props {
  clipboard: string;
}

export const CopyButton: React.FC<
  Props & React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>
> = ({ className, clipboard, children, ...props }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const timeoutRef = React.useRef<number>(null);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(clipboard);
      setIsCopied(true);
      toast.success('Скопировано в буфер обмена');

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error('CopyButton copying error:', error);
      toast.error('Не удалось скопировать ссылку');
    }
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Button
      type='button'
      className={cn('justify-between overflow-hidden', className)}
      {...props}
      onClick={onCopy}>
      <span className='whitespace-nowrap text-nowrap flex-nowrap truncate'>
        {children}
      </span>
      {isCopied ? <Check size={20} /> : <Copy size={20} />}
    </Button>
  );
};
