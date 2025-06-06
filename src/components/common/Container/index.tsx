'use client';

import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface IContainerProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
  justifyCenter?: boolean;
}

export function Container({ className, children, padding = true, justifyCenter = true, ...props }: IContainerProps) {
  return (
    <div
      className={cn(
        `flex max-w-[--global-max-width] ${justifyCenter ? 'justify-center' : ''} ${padding ? 'px-4 md:px-16' : ''} w-full`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
