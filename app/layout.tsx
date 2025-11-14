// import '@/app/ui/global.css';
// import { inter } from '@/app/ui/fonts';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} antialiased`}>{children}</body>
//     </html>
//   );
// }

// app/layout.tsx

import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        // ADDED: This suppresses the hydration warning for attributes injected by extensions.
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}

