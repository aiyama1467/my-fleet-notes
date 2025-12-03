import '@/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { cn } from '@/lib/utils';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = 'dark';

  return (
    <ClerkProvider
      appearance={{
        theme: theme === 'dark' ? dark : undefined,
      }}
    >
      <html lang="ja">
        <body className={cn(theme, 'bg-background text-foreground')}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
