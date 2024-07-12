import * as SatsConnect from 'sats-connect';

export async function connectWallet(): Promise<string> {
  const provider = new SatsConnect();
  const address = await provider.connect();
  return address;
}

export async function signMessage(message: string): Promise<string> {
  const provider = new SatsConnect();
  const signature = await provider.signMessage(message);
  return signature;
}