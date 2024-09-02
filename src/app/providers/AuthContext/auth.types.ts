export interface IWallet {
  ordinalsAddress: string;
  ordinalsPublicKey: string;
  paymentAddress: string;
  paymentPublicKey: string;
  wallet: SUPPORTED_WALLETS;
};

export interface IAuthContext {
  loginWithWallet: (wallet: IWallet) => void;
  logout: () => void;

  wallet: IWallet | null;

  loading: boolean;
};

export enum SUPPORTED_WALLETS {
  UNISAT = 'unisat',
  XVERSE = 'xverse',
  MAGIC_EDEN = 'magic-eden',
  LEATHER = 'leather'
};
