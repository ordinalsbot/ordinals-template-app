import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { fetchMempoolTx } from '@/lib/api';
import { ONE_SECOND } from '@/lib/constants';
import { ETransactionsType, TMempoolStatus, TMempoolTx } from '@/types';

type TMempoolTxWithType = TMempoolTx & { transactionType: ETransactionsType };

interface ITransactionState {
  transactions: { [key: string]: TMempoolTxWithType };
  addTransaction: (txid: string, transactionType: ETransactionsType) => void;
  removeTransaction: (txid: string) => void;
  updateTransaction: (txid: string, transaction: Partial<TMempoolTxWithType>) => void;
  getTransactionState: (txid: string) => TMempoolStatus | 'unknown';
  getActiveTransactions: () => TMempoolTxWithType[];
  getActiveTransactionByType: (transactionType: ETransactionsType) => TMempoolTxWithType[];
  fetchTransactionStatus: (txid: string) => Promise<void>;
}

const useTransactionStore = create<ITransactionState>()(
  persist(
    (set, get) => ({
      transactions: {},
      addTransaction: (txid: string, transactionType: ETransactionsType) =>
        set((state) => ({
          transactions: {
            ...state.transactions,
            [txid]: {
              txid,
              status: { confirmed: false } as TMempoolStatus,
              vout: [],
              vin: [],
              weight: 0,
              version: 0,
              size: 0,
              sigops: 0,
              locktime: 0,
              fee: 0,
              transactionType
            }
          }
        })),
      removeTransaction: (txid: string) =>
        set((state) => {
          const updated = { ...state.transactions };
          delete updated[txid];
          return { transactions: updated };
        }),
      updateTransaction: (txid: string, transaction: Partial<TMempoolTxWithType>) =>
        set((state) => ({
          transactions: {
            ...state.transactions,
            [txid]: {
              ...state.transactions[txid],
              ...transaction
            }
          }
        })),
      getTransactionState: (txid: string): TMempoolStatus | 'unknown' => {
        return get().transactions[txid]?.status ?? { confirmed: false };
      },
      getActiveTransactions: () => {
        return Object.values(get().transactions).filter((tx) => !tx.status.confirmed) || [];
      },
      getActiveTransactionByType: (transactionType: ETransactionsType) => {
        return Object.values(get().transactions).filter(
          (tx) => tx.transactionType === transactionType && !tx.status.confirmed
        );
      },
      fetchTransactionStatus: async (txid: string) => {
        try {
          const transaction = await fetchMempoolTx(txid);
          set((state) => ({
            transactions: {
              ...state.transactions,
              [txid]: {
                ...state.transactions[txid],
                status: transaction.status,
                vout: transaction.vout,
                vin: transaction.vin,
                weight: transaction.weight,
                version: transaction.version,
                size: transaction.size,
                sigops: transaction.sigops,
                locktime: transaction.locktime,
                fee: transaction.fee
              }
            }
          }));
          if (transaction.status.confirmed) {
            setTimeout(() => {
              get().removeTransaction(txid);
            }, ONE_SECOND.toMillis() * 10);
          }
        } catch (error) {
          console.error('Error fetching transaction status:', error);
        }
      }
    }),
    {
      name: 'transaction-storage'
    }
  )
);

export default useTransactionStore;
