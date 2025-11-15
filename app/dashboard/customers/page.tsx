import Table from '@/app/ui/customers/table';
import { FormattedCustomersTable } from '@/app/lib/definitions';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

interface CustomersPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: CustomersPageProps) {
  const query =
    typeof searchParams?.query === 'string' ? searchParams.query : '';

  const currentPage =
    typeof searchParams?.page === 'string'
      ? Number(searchParams.page)
      : 1;

  // Fetch customers from server
  const customers: FormattedCustomersTable[] =
    await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      {/* Server-side table */}
      <Table
        query={query}
        currentPage={currentPage}
        customers={customers}
      />
    </div>
  );
}
