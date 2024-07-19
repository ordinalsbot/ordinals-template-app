'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col p-8 rounded shadow'>
        <h2 className='text-2xl font-bold mb-4'>Oops, Something went wrong!</h2>
        <button
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}