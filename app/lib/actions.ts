'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

import { signIn } from '@/auth'; 
import { AuthError } from 'next-auth';

// Initialize Postgres connection
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

// --------------------
// Zod Schemas
// --------------------
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

const CreateInvoiceSchema = FormSchema.omit({ id: true, date: true });
const UpdateInvoiceSchema = FormSchema.omit({ id: true, date: true });

// --------------------
// Types for Server Actions
// --------------------
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// --------------------
// Server Actions
// --------------------

/**
 * Create a new invoice: Includes validation and database error handling (try/catch).
 */
export async function createInvoice(
  prevState: State, // Required signature for useActionState
  formData: FormData
): Promise<State | void> {
  const validated = CreateInvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create invoice.',
    };
  }

  const { customerId, amount, status } = validated.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    // Return error message on database failure
    return { message: 'Database Error: Failed to Create Invoice.' }; 
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Update an existing invoice: Includes validation and database error handling (try/catch).
 */
export async function updateInvoice(
  id: string,
  prevState: State, // Required signature for useActionState
  formData: FormData
): Promise<State | void> {
  const validated = UpdateInvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to update invoice.',
    };
  }

  const { customerId, amount, status } = validated.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    // Return error message on database failure
    return { message: 'Database Error: Failed to Update Invoice.' }; 
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Delete an invoice: Includes database error handling (try/catch).
 */
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    // No redirect needed here.
  } catch (error) {
    console.error('Database Error:', error);
    // If the database delete fails, return a message to the caller
    return { message: 'Database Error: Failed to Delete Invoice.' }; 
  }
}

/**
 * Authenticates a user with email and password, and redirects on success.
 */
export async function authenticate(
  prevState: string | undefined, 
  formData: FormData,
) {
  // Get the redirect path from the hidden input field in the login form
  const redirectTo = formData.get('redirectTo') as string | undefined;

  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData.entries()),
      redirect: false, // Prevent automatic redirect
    });

    // If sign-in is successful, manually redirect to the intended page
    if (redirectTo) {
        redirect(redirectTo); 
    } else {
        redirect('/dashboard');
    }

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    // Re-throw if it's not a known authentication error
    throw error;
  }
}