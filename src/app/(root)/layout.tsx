import { Header } from '@/shared/components';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='w-full h-screen flex flex-col'>
      <Header />
      <main className='flex flex-1 flex-col overflow-hidden'>{children}</main>
    </div>
  );
}
