import '@/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

import Header from '@/components/layout/header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
      }}
    >
      <html lang="ja">
        <body className="bg-black text-white">
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
