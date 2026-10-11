'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Unable to load the dashboard</h2>
      <p className="text-center text-gray-600">Please try again in a moment.</p>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-400"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
