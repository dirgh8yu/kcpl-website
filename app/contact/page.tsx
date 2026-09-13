import { Container, PageIntro, Eyebrow } from '@/components/ui';
import { EnquiryForm } from '@/components/enquiry-form';
import { company } from '@/content/company';
import { services } from '@/content/services';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('Contact & Request a Freight Quote', 'Contact Kapileshwor Cargo in Kathmandu. Share your cargo, origin, destination, weight and dimensions for a freight or project logistics enquiry.', '/contact');
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  const initialService = [...services.map(s => s.id), 'partner-enquiry'].includes(params.service ?? '') ? params.service! : '';
  return <><div className="contact-intro"><PageIntro label="Contact / Request a quote" title={<>Let’s start with the cargo.</>}><p>Tell us what needs to move and where it needs to go. We’ll discuss the freight, customs and delivery scope.</p></PageIntro></div>
    <section className="contact-section"><Container>
      <p className="contact-direct">Prefer email? <a className="inline-link" href={`mailto:${company.email}`}>{company.email}</a></p>
      <div className="contact-grid"><div className="contact-form-column"><EnquiryForm initialService={initialService} /><noscript><p>Please send your enquiry directly to <a href={`mailto:${company.email}`}>{company.email}</a>. The online enquiry form requires JavaScript.</p></noscript></div>
        <aside className="contact-aside"><Eyebrow>Talk to KCPL</Eyebrow><h2>Kathmandu,<br />Nepal.</h2><address>{company.address}</address><a className="contact-email" href={`mailto:${company.email}`}>{company.email}</a><div className="contact-note"><h3>Not every detail is ready?</h3><p>Start with what you know. Weight, dimensions and the ready date can be confirmed during the freight discussion.</p></div><div className="contact-note"><h3>Heavy or oversized cargo</h3><p>Include individual piece weights, dimensions and delivery-site access. For large drawings, tell us what is available so transfer can be arranged.</p></div></aside>
      </div></Container></section></>;
}
