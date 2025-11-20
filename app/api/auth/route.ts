// app/api/auth/route.ts
// import { nextAuthHandler } from '../../../auth';

// export const GET = nextAuthHandler.auth;
// export const POST = nextAuthHandler.auth;


// app/api/auth/[...nextauth]/route.ts

import { GET, POST } from '../../../../auth'; 

// Re-exported to handle all authentication API requests
export { GET, POST };