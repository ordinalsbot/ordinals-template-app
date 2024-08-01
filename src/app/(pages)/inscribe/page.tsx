'use client';

import ordinalsbot from '@/lib/ob';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from '@tanstack/react-form';
import * as v from 'valibot';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { valibotValidator } from '@tanstack/valibot-form-adapter';
import { storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { EXPLORER_URL, MEMPOOL_URL, ONE_MINUTE, ONE_SECOND, USE_LOW_POSTAGE } from '@/lib/constants';
import { DirectInscriptionOrder, InscriptionOrderState, type InscriptionFile } from 'ordinalsbot/dist/types/v1';
import { useQuery } from '@tanstack/react-query';
import Order from '@/components/Order';
import Charge from '@/components/Charge';
import { LoaderPinwheel } from 'lucide-react';
import { AuthContext } from '@/app/providers/AuthContext';

const directInscribeSchema = v.object({
  file: v.nullable(
    v.pipe(
      v.file(),
      v.mimeType(['image/jpeg', 'image/png', 'text/plain'], 'Please upload one of the supported filetypes'),
      v.maxSize(1024 * 1024 * 10, 'Please select a file smaller than 10 MB.')
    )
  )
});

type TDirectInscribeForm = v.InferInput<typeof directInscribeSchema>;

export default function Inscribe() {

  const { wallet } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<DirectInscriptionOrder | null>(null);

  const { data, error, isLoading } = useQuery({
    queryFn: async () => {
      return ordinalsbot.Inscription().getOrder(order?.id!);
    },
    queryKey: ['order', order?.id],
    enabled: !!order,
    staleTime: ONE_SECOND.toMillis() * 5,
    // The refetch interval is based on whether or not we have the charge address. If we do, then we can poll every 20 seconds, instead of every 5
    refetchInterval: () => {
      if (order?.charge.address) return ONE_MINUTE.toMillis() / 3;
      return ONE_SECOND.toMillis() * 5;
    }
  });

  const { data: feeRate, isLoading: feeRateLoading, error: feeRateError } = useQuery(
    {
      queryFn: async () => fetch('/api/feeRate').then(res => res.json()),
      queryKey: ['feeRate']
    }
  );

  useEffect(() => {
    if (isLoading) return;
    setOrder(data as DirectInscriptionOrder);
  }, [data]);

  const form = useForm({
    defaultValues: {
      file: null,
    },
    onSubmit: async ({ value }: { value: TDirectInscribeForm}) => {

      if (
        (loading || error) ||
        (feeRateLoading || feeRateError)
      ) return; // Don't submit if we're loading or have an error

      try {
        v.parse(directInscribeSchema, value);
      } catch (err: any) {
        setLoading(false);
        return toast.error(err.message);
      }

      if (!value.file) {
        setLoading(false);
        return toast.error('Please select a file');
      }

      if (!wallet?.ordinalsAddress) {
        setLoading(false);
        return toast.error('Please connect a wallet');
      }

      const { file } = value;

      const fileExtension = value.file?.name.split('.').pop()?.toLowerCase();

      const fileRef = ref(storage, `/inscriptions.${fileExtension}`);
      
      const uploadResult = await uploadBytes(fileRef, value.file as File);

      if (uploadResult) {
        const downloadURL = await getDownloadURL(fileRef);
        
        const { type, name, size  } = file;

        const directInscribeResponse = await ordinalsbot.Inscription().createDirectOrder({
          files: [{
            url: downloadURL,
            name, size, type
          }],
          lowPostage: USE_LOW_POSTAGE,
          fee: feeRate?.fastestFee,
          receiveAddress: wallet?.ordinalsAddress
        });

        setOrder(directInscribeResponse);

      } else {
        toast.error('Failed to upload avatar');
      }
      setLoading(false);
    },
    validatorAdapter: valibotValidator()
  
  });
  
  return (
    <div className='flex flex-row flex-wrap justify-center w-full pt-10 px-10 gap-5'>
      <div className='flex flex-col justify-between w-2/3 h-48 gap-5'>
        <h2 className='text-2xl'>Inscribe a File</h2>
        <form
          className='flex flex-col'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name='file'
            children={(field) => {
              const { name } = field;
              return (
                <div className='flex flex-row items-center justify-between gap-2'>
                  <label className='uppercase' htmlFor={name}>{name}</label>
                  <Input
                    className='font-black ring-1'
                    type='file'
                    id={name}
                    name={name}
                    onChange={(e) => {
                      //@ts-ignore
                      form.setFieldValue(name, e?.target?.files?.[0]);
                    }}
                  />
                </div>
              );
            }}
          />

          <div className='flex flex-row justify-end mt-5'>
            <Button type='submit' disabled={loading || feeRateLoading}>Inscribe { loading && <LoaderPinwheel className='animate-spin' /> }</Button>
          </div>
        </form>
      </div>

      <div className='w-1/3'>
        <Order loading={isLoading} order={order} />
      </div>

      <div className='w-1/3'>
        <Charge 
          loading={isLoading} 
          charge={order?.charge}
          feeRate={feeRate}
        />
      </div>

      {
        [InscriptionOrderState.QUEUED, InscriptionOrderState.COMPLETED].includes(order?.state!) && <div className='w-2/3'>
          <h3 className='text-2xl'>Inscription Status</h3>
          { 
            order?.files?.map((file: InscriptionFile, index: number) => {
              return (
                <div className='flex flex-row justify-between rounded-sm border-solid border-2 border-neutral-500 h-12 items-center px-5' key={index}>
                  <div className='flex-1'>{index + 1}</div>
                  <div className='flex-1'>{file.name}</div>
                  <div className='flex-1'>{file.status}</div>
                  <div className='flex flex-col 2'>
                    <div className='text-sm'><a href={`${EXPLORER_URL}/${file.inscriptionId}`} target='_blank'>{file.inscriptionId}</a></div>
                    <div className='text-xs'><a href={`${MEMPOOL_URL}/tx/${file.sent}`} target='_blank'>{file.sent}</a></div>
                  </div>
                </div>
              );
            })
          }
        </div>
      }
    </div>
  );
}