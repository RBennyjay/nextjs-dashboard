import Table from '@/app/ui/customers/table';
import { Metadata } from 'next';
// 1. Import the function to fetch customer data
import { fetchFilteredCustomers } from '@/app/lib/data'; 

export const metadata: Metadata = {
    title: 'Customers', // Will render as "Customers | Acme Dashboard"
};
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // 2. Fetch the filtered customer data on the server
  
  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      {/* 3. Pass the fetched 'customers' data to the Table component */}
      <Table query={query} currentPage={currentPage} customers={customers} />
    </div>
  );
}