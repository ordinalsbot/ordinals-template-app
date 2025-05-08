import { ESUPPORTED_WALLETS } from "@/lib/constants";

export interface IWallet {
  ordinalsAddress: string;
  ordinalsPublicKey: string;
  paymentAddress: string;
  paymentPublicKey: string;
  wallet: ESUPPORTED_WALLETS;
};

export interface IAuthContext {
  isAuthenticated: boolean;
  logOut: () => void;
  wallet: IWallet | null;
  loading: boolean;
};