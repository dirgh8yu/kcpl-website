export const company = {
  name: 'Kapileshwor Cargo Pvt. Ltd.',
  shortName: 'KCPL',
  location: 'Kathmandu, Nepal',
  address: 'Sorakhutte, Mhepi Road, Kathmandu, Nepal',
  email: 'kapileswortravels@gmail.com',
  founded: '2013',
  founder: 'Ramesh Kumar Mishra',
  description: 'International freight, customs and project logistics coordinated from Nepal.',
};

// Set only after the production origin is confirmed. Review builds stay noindex.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
export const isPublicSite = process.env.SITE_INDEXABLE === 'true' && Boolean(siteUrl);
