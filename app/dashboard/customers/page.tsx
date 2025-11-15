import Table, { FormattedCustomersTable } from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page(props: { searchParams?: any }) {
  // Await searchParams to satisfy Next.js App Router
  const searchParams = await props.searchParams;

  const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
  const currentPage = Number(searchParams?.page ?? 1);

  const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <Table query={query} currentPage={currentPage} customers={customers} />
    </div>
  );
}
