// app/api/auth/route.ts
import { nextAuthHandler } from '../../../auth'; // path from app/api/auth to root auth.ts

export const GET = nextAuthHandler.auth;
export const POST = nextAuthHandler.auth;
