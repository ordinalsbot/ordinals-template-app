import { useLaserEyes } from '@omnisat/lasereyes';
import { RecommendedFees } from 'ordinalsbot/dist/types/mempool_types';
import type { DirectInscriptionCharge } from 'ordinalsbot/dist/types/v1';
import { toast } from 'sonner';

import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { satsToBitcoin, shortenAddress } from '@/lib/utilities';

export default function Charge({
  charge,
  loading,
  feeRate
}: {
  charge: DirectInscriptionCharge | null | undefined;
  loading: boolean;
  feeRate: RecommendedFees;
}) {
  const { sendBTC } = useLaserEyes();
  const pay = async () => {
    if (!charge) return;
    try {
      const response = await sendBTC(charge.address, charge.amount);

      if (response) {
        // handle success
        toast.success('Payment successful');
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
        <CardTitle>{satsToBitcoin(charge.amount)} ₿</CardTitle>
        <CardDescription>{charge.amount} sats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-row items-center justify-between'>
          <span>Payment Address: </span>
          <span>{charge.address ? shortenAddress(charge.address) : <Loading />}</span>
        </div>

        <div className='flex flex-row items-center justify-between'>
          <span>Fee Rate: </span>
          <span>{feeRate.fastestFee} sats/vybte</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex w-full flex-row justify-end'>
          <Button className='bg-green-700 hover:bg-green-600' onClick={pay} disabled={!charge.address}>
            Pay Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
