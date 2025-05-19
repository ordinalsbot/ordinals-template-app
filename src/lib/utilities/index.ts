import { ONE_BITCOIN } from '../constants';

export * from './network';
export * from './httpError';
export * from './apiClient';

export const shortenString = (str: string, firstAmount: number, lastAmount: number) => {
  if (!str) return '';

  const start = str.substring(0, firstAmount);
  const end = str.slice(lastAmount * -1);

  return `${start}...${end}`;
};

export const shortenAddress = (address: string) => {
  return shortenString(address, 4, 4);
};

export const shortenTxid = (txid: string) => {
  return shortenString(txid, 4, 4);
};

export const satsToBitcoin = (sats: number) => {
  return sats / ONE_BITCOIN;
};
