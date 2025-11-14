import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

// Define the correct structure for the Page component's props.
// Using EditInvoicePageProps to align with your Vercel error log.
interface EditInvoicePageProps {
  params: {
    id: string;
  };
}

// The component receives 'params' directly as an object, not a Promise.
export default async function Page({ params }: EditInvoicePageProps) {
  const id = params.id; // Access the id directly from the params object

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
  
  // Guard clause to handle cases where the invoice is not found
  if (!invoice) {
    notFound();
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
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}