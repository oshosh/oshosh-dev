import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Providers from '@/app/_components/provider/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | OSHOSH 블로그',
    default: 'OSHOSH 블로그',
  },
  description: '프론트엔드 개발과 관련된 다양한 지식과 경험을 공유하는 블로그입니다.',
  keywords: ['Next.js', '프론트엔드', '웹개발', '코딩', '프로그래밍', '리액트'],
  authors: [{ name: 'oshosh', url: 'https://github.com/oshosh' }],
  creator: 'oshosh',
  publisher: 'oshosh',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  // metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}`),
  alternates: {
    canonical: '/',
  },
  other: {
    google: 'notranslate',
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll -smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            {modal}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
