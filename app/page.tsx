import { Container, Eyebrow, Button, TextLink } from '@/components/ui';
import { ResponsiveImage } from '@/components/responsive-image';
import { ServiceIndex, ProjectFeature, NetworkDirectory, ShipmentProcess, QuoteCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('Freight & Project Logistics in Nepal', 'Kapileshwor Cargo coordinates international air, ocean and cross-border freight, customs clearance and project logistics from Kathmandu, Nepal.', '/');
export default function HomePage() {
  return <>
    <section className="home-hero"><Container><div className="hero-topline"><Eyebrow>Kathmandu · Nepal</Eyebrow><span className="hero-coordinate">International freight / Local knowledge</span></div><div className="hero-grid"><div className="hero-copy"><h1>FROM NEPAL.<br /><span>TO THE<br className="desktop-break" /> WORLD.</span></h1><p>International freight, customs and project logistics coordinated from Nepal.</p><div className="hero-actions"><Button href="/contact">Request a freight quote</Button><TextLink href="/services">Our services</TextLink></div></div><ResponsiveImage image="terminal" className="hero-photo" priority caption="International freight infrastructure. Illustrative stock." /></div><div className="hero-bottom"><span>Kapileshwor Cargo Pvt. Ltd.</span><span>Air / Ocean / Road / Project</span></div></Container></section>
    <ServiceIndex />
    <section className="proposition"><Container><div className="section-heading"><Eyebrow number="02">The Nepal-side perspective</Eyebrow><h2>International coordination.<br />Practical execution in Nepal.</h2></div><div className="proposition-columns"><p>Freight reaches Nepal through a series of handovers. The details between them matter as much as the international leg.</p><div><h3>Customs in the plan</h3><p>Documentation and release requirements considered alongside the movement, rather than left to the arrival point.</p></div><div><h3>The final approach</h3><p>Inland transport and delivery-site access coordinated with the cargo’s dimensions, weight and handling needs.</p></div></div></Container></section>
    <ProjectFeature />
    <section className="section"><Container className="editorial-grid"><div><Eyebrow number="04">Regional & international</Eyebrow><h2>Your Nepal-side<br />logistics counterpart.</h2><p className="muted measure">For importers, exporters and overseas freight forwarders who need the international and local stages to work together.</p><TextLink href="/network">Our network approach</TextLink></div><NetworkDirectory /></Container></section>
    <ShipmentProcess /><QuoteCTA />
  </>;
}
