import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { MempoolTx } from '@/components/common/MempoolTx';
import { fetchMempoolTx } from '@/lib/api';
import { ONE_MINUTE, ONE_SECOND } from '@/lib/constants';
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
  const [transactions, setTransactions] = useState<{ [key: string]: TMempoolTxWithType }>({});

  const addTransaction = useCallback((txid: string, transactionType: ETransactionsType) => {
    setTransactions((prev) => ({
      ...prev,
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
    }));
  }, []);

  const removeTransaction = useCallback((txid: string) => {
    setTransactions((prev) => {
      const updated = { ...prev };
      delete updated[txid];
      return updated;
    });
  }, []);

  const fetchTransactionStatus = useCallback(async (txid: string) => {
    try {
      const transaction = await fetchMempoolTx(txid);
      setTransactions((prev) => ({
        ...prev,
        [txid]: {
          ...prev[txid],
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
      }));
      if (transaction.status.confirmed) {
        setTimeout(() => {
          removeTransaction(txid);
        }, ONE_MINUTE.toMillis() / 2);
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error);
    }
  }, []);

  const renderTransactionById = (txid: string, isMintTransaction: boolean = true, transactionLabel?: string) => {
    if (!transactions[txid] && !txid) return <div>No transaction found</div>;
    return (
      <MempoolTx
        txid={transactions[txid] ? undefined : txid}
        transactionLabel={transactionLabel}
        transactionDetails={transactions[txid]}
        isMintTransaction={isMintTransaction}
      />
    );
  };

  const getTransactionState = (txid: string): TMempoolStatus | 'unknown' => {
    return transactions[txid]?.status ?? { confirmed: false };
  };

  const getActiveTransactions = () => {
    return Object.values(transactions).filter((tx) => !tx.status.confirmed);
  };

  const getActiveTransactionByType = useCallback(
    (transactionType: ETransactionsType) => {
      return Object.values(transactions).filter((tx) => tx.transactionType === transactionType && !tx.status.confirmed);
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
