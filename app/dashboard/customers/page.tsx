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
  // Turbopack requires awaiting searchParams even if it's not a Promise
  const sp = await searchParams;

  const query =
    typeof sp?.query === 'string' ? sp.query : '';

  const currentPage =
    typeof sp?.page === 'string' ? Number(sp.page) : 1;

  const customers: FormattedCustomersTable[] =
    await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <Table
        query={query}
        currentPage={currentPage}
        customers={customers}
      />
    </div>
  );
}
