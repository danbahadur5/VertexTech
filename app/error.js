'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from './components/ui/button';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled Client-Side Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-950 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Something went wrong
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        We encountered an unexpected error while rendering this page. Our team has been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          onClick={() => reset()}
          className="theme-btn min-w-[140px] flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        
        <Button
          variant="outline"
          asChild
          className="min-w-[140px] flex items-center gap-2"
        >
          <Link href="/">
            <Home className="w-4 h-4" />
            Back Home
          </Link>
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-left max-w-2xl overflow-auto border border-gray-200 dark:border-gray-800">
          <p className="text-xs font-mono text-red-600 dark:text-red-400 mb-2 font-bold uppercase">
            Debug Info (Development Only):
          </p>
          <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {error?.message || 'Unknown error'}
            {error?.stack && `\n\n${error.stack}`}
          </pre>
        </div>
      )}
    </div>
  );
}
