import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
import { FormattedCustomersTable } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Customers',
};

// ⚡ SAME structure as invoices page:
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  // MUST await because props.searchParams is now a Promise
  const searchParams = await props.searchParams;

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const customers: FormattedCustomersTable[] =
    await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      {/* Search bar */}
      <Search placeholder="Search customers..." />

      {/* Table */}
      <Table query={query} currentPage={currentPage} customers={customers} />
    </div>
  );
}
