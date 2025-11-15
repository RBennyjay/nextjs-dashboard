import Table from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

// Define the expected type for searchParams
interface CustomersPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: CustomersPageProps) {
  const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
  const currentPage = Number(searchParams?.page) || 1;

  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <Table query={query} currentPage={currentPage} customers={customers} />
    </div>
  );
}
