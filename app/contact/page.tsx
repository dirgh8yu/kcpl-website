import { Container, PageIntro, Eyebrow } from '@/components/ui';
import { EnquiryForm } from '@/components/enquiry-form';
import { company } from '@/content/company';
import { services } from '@/content/services';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('Contact & Request a Freight Quote', 'Contact Kapileshwor Cargo in Kathmandu. Share your cargo, origin, destination, weight and dimensions for a freight or project logistics enquiry.', '/contact');
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  const initialService = [...services.map(s => s.id), 'partner-enquiry'].includes(params.service ?? '') ? params.service! : '';
  return <><PageIntro label="Contact / Request a quote" title={<>Let’s start<br />with the cargo.</>}><p>Share what you need to move, where it needs to go and the handling requirements. We’ll discuss the scope from there.</p></PageIntro><section className="contact-section"><Container className="contact-grid"><aside className="contact-aside"><Eyebrow>Talk to KCPL</Eyebrow><h2>Kathmandu,<br />Nepal.</h2><address>{company.address}</address><a className="contact-email" href={`mailto:${company.email}`}>{company.email}</a><div className="contact-note"><h3>Prefer to email directly?</h3><p>Send the origin, destination, cargo description, weight and dimensions. Include drawings or photos for heavy or oversized pieces.</p></div></aside><div><EnquiryForm initialService={initialService} /><noscript><p>Please send your enquiry directly to <a href={`mailto:${company.email}`}>{company.email}</a>. The draft builder requires JavaScript.</p></noscript></div></Container></section></>;
}
