import { Container, Eyebrow, Button, TextLink } from '@/components/ui';
import { ResponsiveImage } from '@/components/responsive-image';
import { ServiceIndex, ProjectFeature, NetworkDirectory, ShipmentProcess, QuoteCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { exportRecognition } from '@/content/credentials';
export const metadata = pageMetadata('Freight & Project Logistics in Nepal', 'Kapileshwor Cargo coordinates international air, ocean and cross-border freight, customs clearance and project logistics from Kathmandu, Nepal.', '/');
export default function HomePage() {
  return <>
    <section className="home-hero"><Container>
      <div className="hero-topline"><Eyebrow>Kathmandu · Nepal</Eyebrow><span className="hero-coordinate">Freight / Customs / Project logistics</span></div>
      <div className="hero-grid">
        <div className="hero-title-field"><h1><span className="hero-title-line">FROM NEPAL.</span><span className="hero-title-line hero-title-destination">TO THE WORLD.</span></h1><div className="hero-rule" aria-hidden="true"><span /></div></div>
        <div className="hero-copy"><p>International freight.<br />Practical execution in Nepal.</p><p className="hero-description">Air, ocean and cross-border cargo, with customs and final delivery considered from the start.</p><div className="hero-actions"><Button href="/contact">Request a freight quote</Button><TextLink href="/services">Explore services</TextLink></div></div>
      </div>
      <ResponsiveImage image="terminal" className="hero-photo" priority caption="International freight infrastructure. Illustrative stock." />
      <div className="hero-bottom"><span>Kapileshwor Cargo Pvt. Ltd.</span><span>International connections. Nepal-side knowledge.</span></div>
    </Container></section>
    <ServiceIndex />
    <section className="proposition"><Container><div className="section-heading"><Eyebrow number="02">The Nepal-side perspective</Eyebrow><h2>International coordination.<br />Practical execution in Nepal.</h2></div><div className="proposition-columns"><p>Freight reaches Nepal through a series of handovers. The details between them matter as much as the international leg.</p><div><h3>Customs in the plan</h3><p>Documentation and release requirements considered alongside the movement, rather than left to the arrival point.</p></div><div><h3>The final approach</h3><p>Inland transport and delivery-site access coordinated with the cargo’s dimensions, weight and handling needs.</p></div></div></Container></section>
    <ProjectFeature />
    <section className="section"><Container className="editorial-grid"><div><Eyebrow number="04">Regional & international</Eyebrow><h2>Your Nepal-side<br />logistics counterpart.</h2><p className="muted measure">For importers, exporters and overseas freight forwarders who need the international and local stages to work together.</p><TextLink href="/network">Our network approach</TextLink></div><NetworkDirectory /></Container></section>
    <ShipmentProcess />
    <section className="recognition-strip"><Container><div><Eyebrow>Company recognition</Eyebrow><p>{exportRecognition.title} <span>2022–2025</span></p><p className="small muted">{exportRecognition.issuer}</p></div><TextLink href="/about#recognition">Recognition & associations</TextLink></Container></section><QuoteCTA />
  </>;
}
