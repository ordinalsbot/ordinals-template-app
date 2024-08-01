import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { shortenAddress } from '@/lib/utilities';
import type { DirectInscriptionOrder } from 'ordinalsbot/dist/types/v1';
import { Loading } from '../forms/common';
import { CircleCheckBig } from 'lucide-react';


export default function Order({ order, loading }: { order: DirectInscriptionOrder | null, loading: boolean }) {
  if (!order) return null;
  if (loading) return <Loading />;
  
  return (
    <Card className='relative'>
      <div className='absolute top-4 right-4'>
        <CircleCheckBig color={order.state === 'waiting-payment' ? '#ffbf00' : order.state === 'completed' ? 'green' : 'black'} />
      </div>
      <CardHeader>
        <CardTitle>{ order.id }</CardTitle>
        <CardDescription>{ order.orderType } inscription</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-row justify-between items-center'>
          <span># of files: </span>
          <span>{ order.files?.length }</span>
        </div>

        <hr className='my-2' />

        <div className='flex flex-row justify-between items-center'>
          <span>Receive Address: </span>
          <span>{ shortenAddress(order.receiveAddress as string) }</span>
        </div>
      </CardContent>
    </Card>
  );
}