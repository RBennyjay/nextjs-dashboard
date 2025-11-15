import Table from '@/app/ui/customers/table';
import Search from '@/app/ui/search';
import { FormattedCustomersTable } from '@/app/lib/definitions';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

interface CustomersPageProps {
  searchParams?: { query?: string; page?: string } | Promise<{ query?: string; page?: string }>;
}

export default async function Page({ searchParams }: CustomersPageProps) {
  // Await searchParams if it's a Promise
  const sp = await searchParams;

  const query = typeof sp?.query === 'string' ? sp.query : '';
  const currentPage = Number(sp?.page ?? 1);

  // Fetch customers from server
  const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      {/* Client-side search */}
      {/* <Search placeholder="Search customers..." /> */}

      {/* Server-side table */}
      <Table query={query} currentPage={currentPage} customers={customers} />
    </div>
  );
}
