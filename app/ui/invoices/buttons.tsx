'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
// Import the deleteInvoice action
import { deleteInvoice } from '@/app/lib/actions';
import { useFormStatus } from 'react-dom';

/**
 * Creates the "Create Invoice" button for navigation.
 */
export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

/**
 * Creates the "Edit Invoice" button for navigation.
 */
export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

// ----------------------------------------------------
// DELETE BUTTON
// The 'use client' declaration is implied here because we import useFormStatus
// ----------------------------------------------------

/**
 * Client Component to handle form submission status and provide UX feedback.
 */
function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-md border p-2 hover:bg-gray-100"
      disabled={pending} // Disable button while deletion is pending
    >
      <span className="sr-only">Delete</span>
      {pending ? (
        <TrashIcon className="w-5 text-gray-500 animate-pulse" />
      ) : (
        <TrashIcon className="w-5" />
      )}
    </button>
  );
}

/**
 * Renders the form that calls the deleteInvoice Server Action.
 * @param id The ID of the invoice to delete.
 */
export function DeleteInvoice({ id }: { id: string }) {
  // Bind the deleteInvoice Server Action with the invoice ID
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      {/* DeleteButton uses useFormStatus to monitor this form */}
      <DeleteButton />
    </form>
  );
}