import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { EditorialMotion } from '@/components/editorial-motion';
import { company, siteUrl, isPublicSite } from '@/content/company';
import './globals.css';

const geist = localFont({ src: '../public/brand/Geist-Regular.ttf', display: 'swap', variable: '--font-geist' });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || 'http://localhost:3000'),
  title: { default: 'Kapileshwor Cargo | Freight & Project Logistics in Nepal', template: '%s | Kapileshwor Cargo' },
  description: company.description,
  robots: { index: isPublicSite, follow: isPublicSite },
  icons: { icon: '/brand/kcpl-symbol.svg', apple: '/apple-icon.png' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={geist.variable}><body><a href="#main" className="skip-link">Skip to content</a><Header /><main id="main">{children}</main><Footer /><EditorialMotion /></body></html>;
}
