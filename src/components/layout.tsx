import '@/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

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
        <body className="dark bg-background text-foreground">{children}</body>
      </html>
    </ClerkProvider>
  );
}
