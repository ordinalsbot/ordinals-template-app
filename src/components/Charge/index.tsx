
import type { DirectInscriptionCharge } from 'ordinalsbot/dist/types/v1';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loading } from '../forms/common';
import { satsToBitcoin, shortenAddress } from '@/lib/utilities';
import { Button } from '../ui/button';
import Wallet, { RpcErrorCode } from 'sats-connect';
import { toast } from 'sonner';

export default function Charge({ charge, loading }: { charge: DirectInscriptionCharge | null | undefined, loading: boolean }) {
  
  const pay = async () => {
    if (!charge) return;
    try {
      const response = await Wallet.request('sendTransfer', {
        recipients: [
          {
            address: charge.address,
            amount: charge.amount,
          },
        ]
      });
      if (response.status === 'success') {
        // handle success
        toast.success('Payment successful');
      } else {
        if (response.error.code === RpcErrorCode.USER_REJECTION) {
          // handle user cancellation error
          toast.error('Payment cancelled');
        } else {
          // handle error
          toast.error(response.error.message);
        }
      }
    } catch (err: any) {
      toast.error(err.error.message);
    }
  };
  
  if (loading) return <Loading />;
  if (!charge) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ satsToBitcoin(charge.amount) } ₿</CardTitle>
        <CardDescription>{charge.amount} sats</CardDescription>
      </CardHeader>
      <CardContent>

        <div className='flex flex-row justify-between items-center'>
          <span>Payment Address: </span>
          <span>{ shortenAddress(charge.address) }</span>
        </div>

      </CardContent>
      <CardFooter>
        <div className='flex flex-row justify-end w-full'>
          <Button className='bg-green-700 hover:bg-green-600' onClick={pay} disabled={!charge.address}>Pay Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
}