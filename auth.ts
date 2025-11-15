import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
// NOTE: Using 'postgres' here as instructed, unlike '@vercel/postgres' in actions.ts
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
/**
 * Queries the database for a user by email.
 * This is used within the authorize function below.
 * @param email The user's email address.
 * @returns The User object or undefined.
 */
async function getUser(email: string): Promise<User | undefined> {
  try {
    // Note: The generic type <User[]> ensures type safety for the query result
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // 1. Fetch user from database
          const user = await getUser(email);
          if (!user) {
            console.log('User not found.');
            return null; // Return null if user does not exist
          }

          // 2. Compare password hashes
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) {
            return user; // Return the user object if successful
          }
        }
 
        console.log('Invalid credentials');
        return null; // Return null if validation or password check fails
      },
    }),
  ],
});