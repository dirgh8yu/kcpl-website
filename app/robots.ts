import type { MetadataRoute } from 'next';
import { isPublicSite, siteUrl } from '@/content/company';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', ...(isPublicSite ? { allow: '/' } : { disallow: '/' }) }, ...(isPublicSite && siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}) };
}
