import Table from '@/app/ui/customers/table';
import Search from '@/app/ui/search';
import { FormattedCustomersTable } from '@/app/lib/definitions';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({ searchParams }: { searchParams?: any }) {
  // Await searchParams if necessary (Next.js 14+ may return Promise)
  const sp = await searchParams;

  const query = typeof sp?.query === 'string' ? sp.query : '';
  const currentPage = Number(sp?.page ?? 1);

  const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      {/* Client-side search */}
      <Search placeholder="Search customers..." />
      {/* Server-side table */}
      <Table query={query} currentPage={currentPage} customers={customers} />
    </div>
  );
}
