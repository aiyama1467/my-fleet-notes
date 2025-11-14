import '@/globals.css';
import ConfigureAmplifyClientSide from '@/components/configure-amplify';
import Header from '@/components/layout/header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        <ConfigureAmplifyClientSide />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
