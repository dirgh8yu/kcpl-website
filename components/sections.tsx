import Link from 'next/link';
import { services, processSteps } from '@/content/services';
import { Container, Eyebrow, TextLink, Button, Arrow } from './ui';
import { ResponsiveImage } from './responsive-image';

export function ServiceIndex() {
  return <section className="section"><Container className="editorial-grid"><div><Eyebrow number="01">Freight & logistics</Eyebrow><h2>One shipment.<br />Every stage considered.</h2><p className="muted measure">International movement, customs and inland delivery planned as connected parts of the job.</p><TextLink href="/services">Explore all services</TextLink></div><div className="service-index">{services.slice(0, 5).map(service => <Link key={service.id} href={service.id === 'project-cargo' ? '/project-cargo' : `/services#${service.id}`} className="service-row"><span className="row-number">{service.number}</span><div><h3>{service.title}</h3><p>{service.short}</p></div><Arrow diagonal /></Link>)}</div></Container></section>;
}
export function ProjectFeature() {
  return <section className="project-feature dark"><Container><Eyebrow number="03">Project cargo</Eyebrow><div className="project-feature-grid"><div><h2>When the route<br />becomes part<br />of the job.</h2><p>Heavy, oversized and sensitive cargo needs planning around the piece, the road and the final delivery site.</p><TextLink href="/project-cargo">Explore project cargo</TextLink></div><ResponsiveImage image="industrial" caption="Industrial logistics context; not a KCPL project." /></div><div className="technical-strip"><span>Piece weight</span><span>Dimensions</span><span>Route access</span><span>Site conditions</span></div></Container></section>;
}
export function NetworkDirectory() {
  return <div className="network-directory"><div className="network-base"><span className="eyebrow">KCPL base</span><h3>Kathmandu, Nepal</h3><p>International coordination and practical Nepal-side support.</p></div><div className="network-row"><h3>India gateways</h3><p>Port and road connections coordinated with regional counterparts and Nepal-side customs requirements.</p></div><div className="network-row"><h3>China–Nepal</h3><p>Container and land-border coordination with the relevant origin and border operating parties.</p></div><div className="network-row"><h3>International counterparts</h3><p>Air and ocean freight handovers with overseas forwarding and destination agents.</p></div></div>;
}
export function ShipmentProcess() {
  return <section className="section process-section"><Container><div className="section-heading"><Eyebrow number="05">How we work</Eyebrow><h2>A clear plan.<br />From the first conversation.</h2></div><ol className="process-list">{processSteps.map((step, index) => <li key={step.title}><span className="process-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></Container></section>;
}
export function QuoteCTA({ project = false }: { project?: boolean }) {
  return <section className="quote-cta"><Container><div><Eyebrow>Start a conversation</Eyebrow><h2>{project ? 'Let’s look at the cargo.\nAnd the route ahead.' : 'What do you need\nto move?'}</h2></div><div><p>{project ? 'Share piece weights, dimensions, drawings and delivery-site details. We’ll discuss the handling and access requirements.' : 'Tell us the origin, destination and cargo details. We’ll discuss the freight, customs and delivery requirements.'}</p><Button href={project ? '/contact?service=project-cargo' : '/contact'}>{project ? 'Discuss project cargo' : 'Request a freight quote'}</Button></div></Container></section>;
}
