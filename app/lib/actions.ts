'use server'; // <--- ADD THIS LINE FIRST!

import { sql } from '@vercel/postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Define the schema for the form data using Zod
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// The state type for useActionState to handle validation errors and messages
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Types for Create and Update actions
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/**
 * Server Action to create a new invoice in the database.
 * @param prevState The previous state (passed by useActionState).
 * @param formData The data submitted from the form.
 * @returns An object containing validation errors or a success message.
 */
export async function createInvoice(prevState: State, formData: FormData) {
  // 1. Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // 2. If validation fails, return errors early.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // 3. Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // 4. Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    // If a database error occurs, return a more specific message.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // 5. Revalidate the cache for the invoices page and redirect
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Server Action to update an existing invoice in the database.
 * @param id The ID of the invoice to update.
 * @param prevState The previous state (passed by useActionState).
 * @param formData The data submitted from the form.
 * @returns An object containing validation errors or a success message.
 */
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  // 1. Validate form fields using Zod
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // 2. If validation fails, return errors early.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  // 3. Prepare data for update
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  // 4. Update data in the database
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  // 5. Revalidate the cache for the invoices page and redirect
  revalidatePath('/dashboard/invoices');
  revalidatePath(`/dashboard/invoices/${id}/edit`);
  redirect('/dashboard/invoices');
}

/**
 * Server Action to delete an invoice from the database.
 * @param id The ID of the invoice to delete.
 */
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    // Revalidate the cache for the invoices page
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error('Database Error:', error);
    // Throw an error to display to the user if the deletion fails
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}