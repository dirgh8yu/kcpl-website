import Link from 'next/link';
import Image from 'next/image';
import { company } from '@/content/company';
import { navigation } from '@/content/navigation';
import { Container, Arrow } from './ui';
export function Footer() {
  return <footer className="site-footer"><Container>
    <div className="footer-top"><Link href="/" aria-label="Kapileshwor Cargo — home"><Image src="/brand/kcpl-reversed.svg" alt="Kapileshwor Cargo Pvt. Ltd." width={605} height={128} className="footer-logo" /></Link><p>From Nepal.<br />To the world.</p></div>
    <div className="footer-grid">
      <div><p className="footer-description">International freight coordination.<br />Practical execution in Nepal.</p><address>{company.address}</address></div>
      <div><h2>Explore</h2>{navigation.filter(i => i.href !== '/').map(i => <Link href={i.href} key={i.href}>{i.label}</Link>)}</div>
      <div><h2>Freight & logistics</h2><Link href="/services#air-freight">Air freight</Link><Link href="/services#ocean-freight">Ocean freight</Link><Link href="/services#cross-border">Cross-border freight</Link><Link href="/services#customs-clearance">Customs clearance</Link></div>
      <div className="footer-contact"><h2>Discuss a shipment</h2><a href={`mailto:${company.email}`}>{company.email}</a><Link className="text-link" href="/contact">Request a quote<Arrow diagonal /></Link><p>Kathmandu · Nepal</p></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {company.name}</span><Link href="/privacy">Privacy notice</Link><span>Air / Ocean / Road / Project</span></div>
  </Container></footer>;
}
