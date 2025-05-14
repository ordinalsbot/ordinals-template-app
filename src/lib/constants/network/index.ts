export enum ENETWORK {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  SIGNET = 'signet'
}

export const NETWORK: ENETWORK = (process.env.NEXT_PUBLIC_NETWORK?.toLowerCase() || 'mainnet') as ENETWORK;

const MEMPOOL_SPACE_URLS = {
  [ENETWORK.MAINNET]: 'https://mempool.space',
  [ENETWORK.SIGNET]: 'https://mempool.space/signet',
  [ENETWORK.TESTNET]: 'https://mempool.space/testnet4'
};

export const MEMPOOL_SPACE_URL = MEMPOOL_SPACE_URLS[NETWORK];
