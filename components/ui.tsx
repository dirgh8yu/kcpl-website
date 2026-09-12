import Link from 'next/link';
import type { ReactNode } from 'react';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}
export function Button({ children, href, secondary = false }: { children: ReactNode; href: string; secondary?: boolean }) {
  return <Link className={`button ${secondary ? 'button-secondary' : ''}`} href={href}>{children}<Arrow /></Link>;
}
export function TextLink({ children, href }: { children: ReactNode; href: string }) {
  return <Link className="text-link" href={href}>{children}<Arrow diagonal /></Link>;
}
export function Eyebrow({ children, number }: { children: ReactNode; number?: string }) {
  return <p className="eyebrow">{number && <span className="section-number">{number} /</span>}{children}</p>;
}
export function PageIntro({ label, title, children, dark = false }: { label: string; title: ReactNode; children: ReactNode; dark?: boolean }) {
  return <section className={`page-intro ${dark ? 'dark' : ''}`}><Container><Eyebrow>{label}</Eyebrow><div className="intro-grid"><h1>{title}</h1><div className="intro-description">{children}</div></div></Container></section>;
}
