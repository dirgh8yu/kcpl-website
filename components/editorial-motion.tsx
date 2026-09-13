'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive enhancement: no element starts hidden or depends on this script. */
export function EditorialMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('reveal-enter');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
    // Animate content groups, never whole forms or the operational staff desk.
    // Content stays readable before hydration and if observers are unavailable.
    const targets = document.querySelectorAll<HTMLElement>(
      'main .section-heading, main .editorial-grid > div, main .service-detail, main .planning-list > article, main .project-record, main .handover-list > li, main .nea-project-list > li, main .association-list > li, main .project-feature-grid > div, main .photo, main .process-list > li, main .quote-cta .container > div, main .legal-content > h2, .footer-top'
    );
    targets.forEach(target => {
      if (target.closest('.home-hero, .page-intro, .staff-desk') || target.parentElement?.closest('.service-detail, .project-record')) return;
      if (target.getBoundingClientRect().top >= window.innerHeight - 32) observer.observe(target);
    });
    const stop = () => { if (preference.matches) observer.disconnect(); };
    preference.addEventListener('change', stop);
    return () => { observer.disconnect(); preference.removeEventListener('change', stop); };
  }, [pathname]);
  return null;
}
