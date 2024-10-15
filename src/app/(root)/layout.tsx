import Header from '@/app/_components/shared/Header';
import Footer from '@/app/_components/shared/Footer';

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header/>
      <main className="flex-1">{children}</main>
      <Footer/>
    </div>
  );
}
