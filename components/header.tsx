'use client';
/* eslint-disable @next/next/no-html-link-for-pages -- Use full-page navigation in private embedded previews. */
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { navigation } from '@/content/navigation';
import { Arrow } from './ui';

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia('(min-width: 1100px)');
    const close = () => setOpen(false);
    media.addEventListener('change', close);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    const outside = (e: PointerEvent) => {
      if (e.target instanceof Node && !nav.current?.contains(e.target) && !toggle.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', outside);
    return () => { media.removeEventListener('change', close); document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <header className="site-header" onBlur={event => { if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}><div className="container header-inner">
    <a href="/" aria-label="Kapileshwor Cargo — home" className="logo-link" onClick={() => setOpen(false)}><Image src="/brand/kcpl-primary.svg" alt="Kapileshwor Cargo Pvt. Ltd." width={605} height={128} priority /></a>
    <button className="menu-toggle" type="button" ref={toggle} aria-controls="primary-navigation" aria-expanded={open} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen(current => !current)}><span className="menu-toggle-label">{open ? 'Close' : 'Menu'}</span><span className="menu-toggle-icon" aria-hidden="true">{open ? '−' : '+'}</span></button>
    <nav id="primary-navigation" aria-label="Primary navigation" ref={nav} className={`primary-nav ${open ? 'is-open' : ''}`}>
      {navigation.map(item => <a key={item.href} href={item.href} aria-current={path === item.href ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</a>)}
      <a href="/contact" className="header-quote" aria-current={path === '/contact' ? 'page' : undefined} onClick={() => setOpen(false)}>Request a quote<Arrow /></a>
    </nav>
  </div></header>;
}
