export enum ENETWORK {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
  Signet = 'signet'
}

export const NETWORK: ENETWORK = (process.env.NEXT_PUBLIC_NETWORK?.toLowerCase() || 'mainnet') as ENETWORK;

const MEMPOOL_SPACE_URLS = {
  [ENETWORK.Mainnet]: 'https://mempool.space',
  [ENETWORK.Signet]: 'https://mempool.space/signet',
  [ENETWORK.Testnet]: 'https://mempool.space/testnet4'
};

export const MEMPOOL_SPACE_URL = MEMPOOL_SPACE_URLS[NETWORK];
