export const mapAppNetworkToLaserEyesNetwork = (network: string) => {
  switch (network.toLowerCase()) {
    case 'signet':
      return 'signet';
    case 'testnet':
      return 'testnet';
    case 'mainnet':
    default:
      return 'mainnet';
  }
};
