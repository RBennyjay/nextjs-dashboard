import Table from '@/app/ui/customers/table';
import { FormattedCustomersTable } from '@/app/lib/definitions';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

interface CustomersPageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export default async function Page({ searchParams }: CustomersPageProps) {
  // No awaiting needed — searchParams is NOT a Promise
  const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
  const currentPage = Number(searchParams?.page ?? 1);

  // Fetch customers from server
  const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      {/* Server-side table */}
      <Table query={query} currentPage={currentPage} customers={customers} />
    </div>
  );
}
