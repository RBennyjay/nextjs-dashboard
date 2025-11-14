'use client';

import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  // 1. Get hooks for URL management
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // 2. Function to handle search input changes
  // function handleSearch(term: string) {
  const handleSearch = useDebouncedCallback((term) => {
      console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    
    // Reset page number to 1 when a new search term is entered
    params.set('page', '1'); 

    if (term) {
      // Set the 'query' param to the user's input
      params.set('query', term);
    } else {
      // If input is empty, delete the 'query' param
      params.delete('query');
    }

    // 3. Update the URL using client-side navigation
    // Pathname (e.g., /dashboard/invoices) + '?' + new query string
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // Use onChange to call the search function
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // 4. Keep input and URL in sync using defaultValue
        // If 'query' exists in the URL, populate the input field
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}