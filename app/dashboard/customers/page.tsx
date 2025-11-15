import Table from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({ searchParams }: { searchParams?: any }) {
  // Extract query parameters safely
  const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
  const currentPage = Number(searchParams?.page) || 1;

  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <Table query={query} currentPage={currentPage} customers={customers} />
    </div>
  );
}
