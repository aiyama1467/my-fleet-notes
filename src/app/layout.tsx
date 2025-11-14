import '@/globals.css';
import Header from '@/components/layout/header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
