'use client';

import { Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { EComponentVariants } from '@/types';

interface ITagProps {
  variant?: EComponentVariants;
  label: string;
  className?: string;
  info?: string;
  fullyRounded?: boolean;
}

const SPIN_INTERVAL = 150;

const DIRECTIONS = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'];
export function Tag({ variant = EComponentVariants.Default, label, className, info, fullyRounded = false }: ITagProps) {
  const [tick, setTick] = useState(0);

  const { inner, outer } = useMemo(() => {
    const dir = DIRECTIONS[tick % DIRECTIONS.length];
    switch (variant) {
      case 'success':
        return {
          inner: 'bg-ob-black text-white',
          outer: `bg-gradient-to-${dir} from-ob-green-light to-ob-green`
        };
      case 'disabled':
        return {
          inner: 'bg-ob-black-lightest text-ob-white-40',
          outer: 'bg-ob-white-40'
        };
      case 'error':
        return {
          inner: 'bg-ob-black text-white',
          outer: `bg-gradient-to-${dir} from-ob-red-lightest via-ob-red-light to-ob-red-dark`
        };
      case 'info':
        return {
          inner: 'bg-ob-purple text-white',
          outer: `bg-gradient-to-${dir} from-ob-purple-light to-ob-purple-lighter`
        };
      default:
        return {
          inner: 'bg-ob-purple-darkest text-white',
          outer: `bg-gradient-to-${dir} from-ob-blue to-ob-green`
        };
    }
  }, [variant, tick]);

  // Increment tick, which cases the background gradient to shift position once every SPIN_INTERVAL milliseconds
  useEffect(() => {
    const interval = setInterval(() => setTick((prevTick) => prevTick + 1), SPIN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative h-[--button-height-sm] max-h-[--button-height-md] min-w-[auto] ${fullyRounded ? 'rounded-full' : 'rounded-sm'} p-[1px] shadow-lg ${className}`}
    >
      <div
        className={`absolute inset-0 h-full w-full ${fullyRounded ? 'rounded-full' : 'rounded-sm'} ${outer} duration-100 ease-in-out`}
      ></div>
      <div
        className={`relative ml-[1px] flex h-full w-fit flex-row items-center justify-between ${fullyRounded ? 'rounded-full' : 'rounded-sm'} px-4 ${inner} min-h-[calc(var(--button-height-sm)-2px)] gap-2`}
      >
        <span className='w-fit text-nowrap text-center text-xs font-semibold md:text-sm'>{label}</span>
        {info && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={12} />
            </TooltipTrigger>
            <TooltipContent>{info}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
