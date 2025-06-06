'use client';

import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface ISectionProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export function Section({ className, padding = true, children, ...props }: ISectionProps) {
  return (
    <section
      className={cn(`flex w-full justify-center ${padding ? 'py-[--section-vertical-padding]' : ''}`, className)}
      {...props}
    >
      {children}
    </section>
  );
}
