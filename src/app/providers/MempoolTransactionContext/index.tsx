import React, { ReactNode, createContext, useCallback, useContext, useEffect } from 'react';

import { MempoolTx } from '@/components/common/MempoolTx';
import { ONE_SECOND } from '@/lib/constants';
import useTransactionStore from '@/stores/transactionStore';
import { ETransactionsType, TMempoolStatus, TMempoolTx } from '@/types';

type TMempoolTxWithType = TMempoolTx & { transactionType: ETransactionsType };
interface IMempoolTxContextType {
  transactions: { [key: string]: TMempoolTxWithType };
  addTransaction: (txid: string, transactionType: ETransactionsType) => void;
  removeTransaction: (txid: string) => void;
  renderTransactionById: (txid: string, isMintTransaction?: boolean, transactionLabel?: string) => JSX.Element;
  getTransactionState: (txid: string) => TMempoolStatus | 'unknown';
  getActiveTransactions: () => TMempoolTxWithType[];
  getActiveTransactionByType: (transactionType: ETransactionsType) => TMempoolTxWithType[];
}

const MempoolTxContext = createContext<IMempoolTxContextType | undefined>(undefined);

export const MempoolTxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    transactions,
    addTransaction,
    removeTransaction,
    getTransactionState,
    getActiveTransactions,
    getActiveTransactionByType,
    fetchTransactionStatus
  } = useTransactionStore();

  const renderTransactionById = useCallback(
    (txid: string, isMintTransaction: boolean = true, transactionLabel?: string) => {
      if (!transactions[txid] && !txid) return <div>No transaction found</div>;
      return (
        <MempoolTx
          txid={transactions[txid] ? undefined : txid}
          transactionLabel={transactionLabel}
          transactionDetails={transactions[txid]}
          isMintTransaction={isMintTransaction}
        />
      );
    },
    [transactions]
  );

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      Object.keys(transactions).forEach((txid) => {
        if (transactions[txid].status.confirmed === false) {
          fetchTransactionStatus(txid);
        }
      });
    }, ONE_SECOND.toMillis() * 8);

    return () => clearInterval(pollingInterval);
  }, [transactions, fetchTransactionStatus]);

  return (
    <MempoolTxContext.Provider
      value={{
        transactions,
        addTransaction,
        removeTransaction,
        renderTransactionById,
        getTransactionState,
        getActiveTransactions,
        getActiveTransactionByType
      }}
    >
      {children}
    </MempoolTxContext.Provider>
  );
};

export const useMempoolTxContext = (): IMempoolTxContextType => {
  const context = useContext(MempoolTxContext);
  if (!context) {
    throw new Error('useMempoolTxContext must be used within a MempoolTxProvider');
  }
  return context;
};
