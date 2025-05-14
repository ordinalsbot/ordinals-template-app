export type TMempoolStatus = {
  block_hash?: string;
  block_height?: number;
  block_time?: number;
  confirmed: boolean;
};
export type TMempoolVin = {
  is_coinbase: boolean;
  prevout: TMempoolVout;
  scriptsig: string;
  scriptsig_asm: string;
  sequence: number;
  txid: string;
  vout: number;
  witness: string[];
};

export type TMempoolVout = {
  sciptpubkey: string;
  sciptpubkey_address: string;
  sciptpubkey_asm: string;
  sciptpubkey_type: string;
  value: number;
};

export type TMempoolTx = {
  vout: TMempoolVout[];
  vin: TMempoolVin[];
  weight: number;
  version: number;
  txid: string;
  status: TMempoolStatus;
  size: number;
  sigops: number;
  locktime: number;
  fee: number;
};

export enum ETransactionsType {
  PaddingOutputTransaction = 'padding-output-transaction',
  MultisigPaddingTransaction = 'multisig-padding-transaction',
  MultisigTopupTransaction = 'multisig-topup-transaction',
  MintTransaction = 'mint-transaction',
  MultisigWithdrawalTransaction = 'multisig-withdrawal-transaction'
}
