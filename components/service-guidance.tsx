import { enquiryGuidance } from '@/content/enquiry-guidance';

export function ServiceGuidance({ service }: { service: string }) {
  const guidance = enquiryGuidance[service];
  if (!guidance) return null;
  return <aside className="project-guidance service-guidance" aria-label="Enquiry preparation">
    <h3>{guidance.title}</h3><p>{guidance.intro}</p>
    <details className="planning-disclosure"><summary>Information to prepare</summary><ul className="plain-list">{guidance.items.map(item => <li key={item}>{item}</li>)}</ul></details>
  </aside>;
}
