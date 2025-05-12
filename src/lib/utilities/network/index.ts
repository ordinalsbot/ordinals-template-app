import { BaseNetwork } from '@omnisat/lasereyes';

export const mapAppNetworkToLaserEyesNetwork = (network: string) => {
  switch (network.toLowerCase()) {
    case 'signet':
      return BaseNetwork.SIGNET;
    case 'testnet':
      return BaseNetwork.TESTNET;
    case 'mainnet':
    default:
      return BaseNetwork.MAINNET;
  }
};
