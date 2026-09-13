import { associations, exportRecognition } from '@/content/credentials';
import { Container, Eyebrow } from './ui';

export function CompanyCredentials() {
  return <section className="section credentials-section" id="recognition"><Container>
    <div className="editorial-grid recognition-grid">
      <div><Eyebrow>Recognition</Eyebrow><h2>{exportRecognition.title}</h2><p className="muted">{exportRecognition.issuer}</p></div>
      <div><ul className="award-years" aria-label="Award years">{exportRecognition.years.map(year => <li key={year}>{year}</li>)}</ul><p className="small muted">Award history provided by KCPL.</p></div>
    </div>
    <div className="association-heading"><h3>Associations & industry network</h3><p className="small muted">KCPL’s industry associations and international logistics network.</p></div>
    <ul className="association-list">{associations.map(association => <li key={association.short}>
      <a href={association.href} className="association-link">
        {association.logo && <img src={association.logo} alt="" width="138" height="79" loading="lazy" />}
        <span><span className="association-name">{association.name}</span><span className="association-website">Visit {association.short} website ↗</span></span>
      </a>
    </li>)}</ul>
  </Container></section>;
}
