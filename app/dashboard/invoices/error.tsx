'use client'; // This is a Client Component

import { useEffect } from 'react';
import Link from 'next/link';
 
// The error boundary component receives two props:
// 1. error: An Error object that holds the error that was thrown.
// 2. reset: A function to reset the error boundary. When executed, it will try to re-render the segment.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      {/* We can display the error message, but often it's too technical for users. 
        It's better to provide a friendly message and a way to recover.
      */}
      <p className="text-sm text-gray-500 mt-2">
        A problem occurred while loading the invoices section.
      </p>

      {/* The reset function tries to re-render the content */}
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>

      {/* Optionally, provide a link to a safe place */}
      <Link href="/dashboard" className="mt-2 text-sm text-blue-500 hover:underline">
        Go to Dashboard Home
      </Link>
    </main>
  );
}