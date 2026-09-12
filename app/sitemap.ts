import type { MetadataRoute } from 'next';
import { siteUrl } from '@/content/company';
import { routes } from '@/content/navigation';
export default function sitemap(): MetadataRoute.Sitemap {
  return siteUrl ? routes.map(path => ({ url: `${siteUrl}${path}` })) : [];
}
