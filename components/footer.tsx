/* eslint-disable @next/next/no-html-link-for-pages -- Use full-page navigation in private embedded previews. */
import Image from 'next/image';
import { company } from '@/content/company';
import { navigation } from '@/content/navigation';
import { Container, Arrow } from './ui';
export function Footer() {
  return <footer className="site-footer"><Container>
    <div className="footer-top"><a href="/" aria-label="Kapileshwor Cargo — home"><Image src="/brand/kcpl-reversed.svg" alt="Kapileshwor Cargo Pvt. Ltd." width={605} height={128} className="footer-logo" /></a><p>From Nepal.<br />To the world.</p></div>
    <div className="footer-grid">
      <div><p className="footer-description">International freight coordination.<br />Practical execution in Nepal.</p><address>{company.address}</address></div>
      <div><h2>Explore</h2>{navigation.filter(i => i.href !== '/').map(i => <a href={i.href} key={i.href}>{i.label}</a>)}</div>
      <div><h2>Freight & logistics</h2><a href="/services#air-freight">Air freight</a><a href="/services#ocean-freight">Ocean freight</a><a href="/services#cross-border">Cross-border freight</a><a href="/services#customs-clearance">Customs clearance</a></div>
      <div className="footer-contact"><h2>Discuss a shipment</h2><a href={`mailto:${company.email}`}>{company.email}</a><a className="text-link" href="/contact">Request a quote<Arrow diagonal /></a><p>Kathmandu · Nepal</p></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {company.name}</span><a href="/privacy">Privacy notice</a><span>Air / Ocean / Road / Project</span></div>
  </Container></footer>;
}
