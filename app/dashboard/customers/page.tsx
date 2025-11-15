import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Customers',
};

export default function Page() {
    return <p>Customers Page</p>;
}

// import Table from '@/app/ui/customers/table';
// import { Metadata } from 'next';
// import { fetchFilteredCustomers } from '@/app/lib/data';

// export const metadata: Metadata = {
//   title: 'Customers',
// };

// export default async function Page({
//   searchParams,
// }: {
//   searchParams?: { [key: string]: string | string[] | undefined };
// }) {
//   const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
//   const currentPage = Number(searchParams?.page) || 1;

//   const customers = await fetchFilteredCustomers(query);

//   return (
//     <div className="w-full">
//       <Table query={query} currentPage={currentPage} customers={customers} />
//     </div>
//   );
// }
