import { ESupportedWallets } from '@/lib/constants';

export interface IWallet {
  ordinalsAddress: string;
  ordinalsPublicKey: string;
  paymentAddress: string;
  paymentPublicKey: string;
  wallet: ESupportedWallets;
}

export interface IAuthContext {
  isAuthenticated: boolean;
  logOut: () => void;
  loading: boolean;
}
