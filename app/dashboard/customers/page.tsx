import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
import { FormattedCustomersTable } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Customers',
};

// SAME method as invoices (Promise searchParams)
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const sp = await props.searchParams;

  const query = sp?.query || '';
  const currentPage = Number(sp?.page) || 1;

  const customers: FormattedCustomersTable[] =
    await fetchFilteredCustomers(query);

  return (
    <div className="w-full">  
      <Table customers={customers} />
    </div>
  );
}
