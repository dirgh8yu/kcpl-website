import type { Metadata } from 'next';
import { siteUrl } from '@/content/company';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: siteUrl ? { canonical: `${siteUrl}${path}` } : undefined,
    openGraph: { title: `${title} | Kapileshwor Cargo`, description, type: 'website', locale: 'en_US', siteName: 'Kapileshwor Cargo', ...(siteUrl ? { url: `${siteUrl}${path}`, images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630 }] } : {}) },
  };
}
