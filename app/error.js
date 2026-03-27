'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled Client-Side Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 text-center">
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        We encountered an unexpected error.
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Try Again
        </button>
        <Link href="/" className="px-6 py-2 border rounded-lg">
          Back Home
        </Link>
      </div>
    </div>
  );
}
