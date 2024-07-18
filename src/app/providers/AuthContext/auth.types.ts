export interface IWallet {
  ordinalsAddress:string;
  ordinalsPublicKey: string;
  paymentAddress: string;
  paymentPublicKey: string;
};

export interface IAuthContext {
	loginWithWallet: (wallet: IWallet) => void;
	logout: () => void;

  wallet: IWallet | null;

  loading: boolean;
};