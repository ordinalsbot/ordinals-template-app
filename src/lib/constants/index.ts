import type { Metadata } from 'next';
export * from './imgs';
export * from './time';

export const APP_NAME = 'Ordinals Template App';

const CLEAN_APP_NAME = APP_NAME.replace(/ /g, '-').toLowerCase();

export const DEFAULT_METADATA: Metadata = {
  title: {
    default: `${APP_NAME}`,
    template: `${APP_NAME} | %s`
  },
  manifest: './manifest.json'
};

// The wallet cookie is a string with no spaces in it. We prefix the APP_NAME with __wallet-cookie and then attach the APP_NAME at the end for uniqueness
export const WALLET_COOKIE = `__wallet-cookie-${CLEAN_APP_NAME}`;
export const WALLET_SIGN_IN_MESSAGE = `Sign into ${APP_NAME} Application`;


export const SESSION_TOKEN_NAME = `${CLEAN_APP_NAME}.session-token`;

export const USE_LOW_POSTAGE = true;
export const ONE_BITCOIN = 100000000;

export const EXPLORER_URL = process.env.ORDINALS_EXPLORER_URL || 'https://explorer.ordinalsbot.com';
export const MEMPOOL_URL = process.env.MEMPOOL_URL || 'https://mempool.space';


export enum ENETWORK {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  SIGNET = 'signet'
}
export const NETWORK: ENETWORK = (process.env.NEXT_PUBLIC_NETWORK?.toLowerCase() || 'mainnet') as ENETWORK;

export enum ESUPPORTED_WALLETS {
  UNISAT = 'unisat',
  XVERSE = 'xverse',
  MAGIC_EDEN = 'magic-eden',
  LEATHER = 'leather',
  ORANGE = 'orange',
  OKX = 'okx',
  OYL = 'oyl',
  PHANTOM = 'phantom',
  WIZZ = 'wizz'
}