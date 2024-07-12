import type { Metadata } from 'next';
export * from './imgs';

export const DEFAULT_METADATA: Metadata = {
  title: {
    default: 'OrdinalsBot.com',
    template: 'Ordinalsbot.com | %s'
  },
  manifest: './manifest.json'
};