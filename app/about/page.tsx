import { Container, PageIntro, Eyebrow, TextLink } from '@/components/ui';
import { ResponsiveImage } from '@/components/responsive-image';
import { QuoteCTA } from '@/components/sections';
import { company } from '@/content/company';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('About KCPL', 'Founded in 2013 by Ramesh Kumar Mishra, Kapileshwor Cargo is a Kathmandu-based freight forwarding, customs and project logistics company.', '/about');
export default function AboutPage() {
  return <><PageIntro label="About Kapileshwor Cargo" title={<>Based in Nepal.<br />Built around the work.</>}><p>International freight forwarding, customs and logistics, with practical experience at Nepal’s borders and delivery sites.</p></PageIntro>
    <section className="about-story"><Container className="about-grid"><ResponsiveImage image="gateway" className="about-photo" caption="Freight infrastructure. Illustrative stock." /><div><Eyebrow>Kapileshwor Cargo Pvt. Ltd.</Eyebrow><h2>A Kathmandu base.<br />An international outlook.</h2><p>Founded in {company.founded} by {company.founder}, KCPL coordinates international freight and the Nepal-side customs, border and inland stages that bring a shipment to its destination.</p><p>Our work spans routine air and ocean cargo, regional road freight, and heavy or sensitive equipment requiring additional route and handling planning.</p><dl className="company-facts"><div><dt>Established</dt><dd>{company.founded}</dd></div><div><dt>Base</dt><dd>{company.location}</dd></div><div><dt>Founder & Managing Director</dt><dd>{company.founder}</dd></div></dl></div></Container></section>
    <section className="section dark"><Container><Eyebrow>Working approach</Eyebrow><h2 className="manifesto">Clear scope.<br />Clear handovers.<br /><span>Practical execution.</span></h2><div className="manifesto-bottom"><p>Every shipment has its own requirements. We begin with the cargo and the agreed responsibilities, then coordinate the freight, documents and delivery arrangements around them.</p><TextLink href="/services">How we support your shipment</TextLink></div></Container></section><QuoteCTA /></>;
}
