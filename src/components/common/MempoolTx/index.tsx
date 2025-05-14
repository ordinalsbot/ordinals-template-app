'use client';

import { Check, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Loading, Tag } from '@/components';
import { MEMPOOL_SPACE_URL } from '@/lib/constants';
import { useBlockHeight, useMempoolTx } from '@/lib/hooks';
import { shortenAddress, shortenTxid } from '@/lib/utilities';
import { EComponentVariants, TMempoolTx } from '@/types';

interface IMempoolTxBase {
  isMintTransaction?: boolean;
  transactionDetails?: TMempoolTx;
  transactionLabel?: string;
}

type TMempoolTxProps = IMempoolTxBase &
  ({ txid: string; transactionDetails?: never } | { txid?: string; transactionDetails: TMempoolTx });

export const MempoolTx = ({
  txid,
  isMintTransaction,
  transactionDetails,
  transactionLabel = 'Pending Buy'
}: TMempoolTxProps) => {
  const { data: tip } = useBlockHeight();

  // Use transactionDetails if available, otherwise fetch data using useMempoolTx
  let { data: tx, isFetching } = useMempoolTx(txid);
  tx = txid ? tx : transactionDetails;

  const confirmations = useMemo(() => {
    if (!tip || tx === null || tx === undefined || !tx?.status) return 0;
    const { block_height: confirmationHeight, confirmed } = tx.status;
    if (!confirmed || !confirmationHeight) return 0;
    if (tip === confirmationHeight) return 1;
    return tip - confirmationHeight;
  }, [tip, tx]);

  const renderStatus = () => {
    if (!tx && !isFetching)
      return (
        <div className='bg-light flex flex-row items-center justify-between gap-4 p-4'>
          <XIcon size={12} />
          <span>No transaction found</span>
        </div>
      );
    if (tx?.status?.confirmed) {
      // Confirmed
      return (
        <div
          className={`bg-light flex flex-row items-center justify-between gap-4 rounded-md p-4 ${confirmations > 0 ? 'border-ob-green-light/[0.80] border' : ''}`}
        >
          <Check size={12} />
          <div className='flex flex-col'>
            <span className='bold'>
              Transaction Confirmed:&nbsp;
              <Link href={`${MEMPOOL_SPACE_URL}/tx/${txid ?? tx?.txid}`} target='_blank' className='text-ob-yellow'>
                {shortenAddress(txid ?? tx?.txid)}
              </Link>
            </span>
            {!isMintTransaction && <span>{confirmations} Confirmations</span>}
          </div>
        </div>
      );
    } else {
      // Unconfirmed
      return isMintTransaction ? (
        <div className='flex w-full flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='flex flex-col gap-2'>
            <span className='text-2xl font-bold text-white'>Pending Transaction</span>
            <a
              target='_blank'
              href={`${MEMPOOL_SPACE_URL}/tx/${txid ?? tx?.txid}`}
              className='flex flex-row justify-center gap-2 sm:justify-start'
            >
              <span className='text-ob-grey-lightest'>Transaction ID</span>
              <span className='text-ob-grey-lightest'>{(txid ?? tx?.txid) && shortenTxid(txid ?? tx?.txid ?? '')}</span>
            </a>
          </div>
          <div className='flex h-full flex-col items-center justify-center'>
            <Tag label={transactionLabel} variant={EComponentVariants.Info} />
          </div>
        </div>
      ) : (
        <div
          className={`bg-light flex w-full flex-row items-center justify-between gap-4 rounded-md p-4 ${confirmations > 0 ? 'border-ob-green-light/[0.20] border' : ''}`}
        >
          <Loading />
          <div className='flex w-full flex-col gap-2'>
            <div className='flex flex-row'>
              <span className='bold text-nowrap text-base'>Transaction Found:&nbsp;</span>
              <Link
                href={`${MEMPOOL_SPACE_URL}/tx/${txid ?? tx?.txid}`}
                target='_blank'
                className='text-ob-green hover:text-ob-green-light'
              >
                {shortenAddress(txid ?? tx?.txid ?? '')}
              </Link>
            </div>
            <span className='text-base'>{confirmations} Confirmations</span>
          </div>
        </div>
      );
    }
  };

  if (tx === null)
    return (
      <a href={`${MEMPOOL_SPACE_URL}/tx/${txid}`} target='_blank'>
        {shortenAddress(txid ?? '')}
      </a>
    );
  return <div className='flex flex-row items-center justify-center'>{renderStatus()}</div>;
};
