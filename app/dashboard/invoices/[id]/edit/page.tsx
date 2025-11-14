// import Form from '@/app/ui/invoices/edit-form';
// import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

// export default async function Page(props: { params: Promise<{ id: string }> }) {
//   const params = await props.params;
//   const id = params.id;

//     const [invoice, customers] = await Promise.all([
//     fetchInvoiceById(id),
//     fetchCustomers(),
//   ]);
 
// export default async function Page() {
//   return (
//     <main>
//       <Breadcrumbs
//         breadcrumbs={[
//           { label: 'Invoices', href: '/dashboard/invoices' },
//           {
//             label: 'Edit Invoice',
//             href: `/dashboard/invoices/${id}/edit`,
//             active: true,
//           },
//         ]}
//       />
//       <Form invoice={invoice} customers={customers} />
//     </main>
//   );
// }

import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

// Use the standard Next.js App Router pattern for accessing route params
export default async function Page({ params }: { params: { id: string } }) {
  // Destructure the id directly from params
  const { id } = params;

  // Fetch data concurrently using Promise.all
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  // Handle case where invoice might not be found (optional, but good practice)
  if (!invoice) {
    // You should use a dedicated not-found page/component in a real app,
    // but a simple message is fine for demonstration.
    return (
      <main className="flex items-center justify-center h-full p-4">
        <p className="text-xl text-red-500">Invoice not found.</p>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* Pass the fetched data to the Form component */}
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}