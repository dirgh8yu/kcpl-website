import Link from 'next/link';
import { services } from '@/content/services';
import { Container, PageIntro, Eyebrow, TextLink } from '@/components/ui';
import { ResponsiveImage } from '@/components/responsive-image';
import { QuoteCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('Freight & Logistics Services', 'Air freight, ocean freight, cross-border transport, customs clearance and inland delivery coordinated by KCPL in Nepal.', '/services');
export default function ServicesPage() {
  return <><PageIntro label="Services / Air · Ocean · Road" title={<>The right movement.<br />The right coordination.</>}><p>International freight and Nepal-side execution, connected through a clearly defined shipment scope.</p></PageIntro>
    <Container><nav className="service-jump" aria-label="Services on this page">{services.map(s => <Link href={`#${s.id}`} key={s.id}>{s.title}</Link>)}</nav><ResponsiveImage image="ocean" className="wide-photo" caption="Maritime freight context. Illustrative stock." /></Container>
    <section className="section"><Container>{services.map(s => <article className="service-detail" id={s.id} key={s.id}><div><Eyebrow>{s.number} / Service</Eyebrow><h2>{s.title}</h2>{s.id === 'project-cargo' && <TextLink href="/project-cargo">Our project cargo capability</TextLink>}</div><div><p className="service-lead">{s.detail}</p><ul className="plain-list">{s.scope.map(item => <li key={item}>{item}</li>)}</ul><p className="service-note">{s.note}</p><TextLink href={`/contact?service=${s.id}`}>Enquire about {s.title.toLowerCase()}</TextLink></div></article>)}</Container></section><QuoteCTA /></>;
}
