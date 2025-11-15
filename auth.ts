import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
// Initialize Postgres connection
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * Fetches a user from the database by email.
 * @param email The user's email address.
 * @returns The User object or undefined if not found.
 */
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    // Return the first user found (or undefined if the array is empty)
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    // Returning undefined/null here allows NextAuth to gracefully handle the error.
    return undefined; 
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // 1. Validate the incoming credentials using Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // 2. Fetch the user from the database
          const user = await getUser(email);
          if (!user) {
             console.log('User not found');
             return null; // Stop execution if user doesn't exist
          }

          // 3. Compare the provided password with the hashed password
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) {
             return user; // Success! Return the user object to establish the session
          }
        }
 
        // If validation fails or passwords don't match
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});