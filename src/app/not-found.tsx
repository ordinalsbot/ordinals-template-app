import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <TriangleAlert size='64' color='red' />
      <div className='text-center'>
        <h2 className='text-4xl font-bold'>Not Found</h2>
        <p className='text-xl'>Could not find requested resource</p>
        <Link className='hover:text-sky-500' href='/'>
          Return Home
        </Link>
      </div>
    </div>
  );
}
