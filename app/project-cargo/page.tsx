import { Container, PageIntro, Eyebrow, TextLink, Button } from '@/components/ui';
import { ResponsiveImage } from '@/components/responsive-image';
import { QuoteCTA } from '@/components/sections';
import { projects, planning, neaProjects } from '@/content/projects';
import { enquiryGuidance } from '@/content/enquiry-guidance';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('Project Cargo & Heavy Transport in Nepal', 'Heavy, oversized and sensitive cargo planning in Nepal: piece weight, dimensions, route access, customs and delivery-site coordination.', '/project-cargo');
const chapterIds = ['the-cargo', 'the-route', 'the-site'];

export default function ProjectCargoPage() {
  return <>
    <PageIntro dark label="Project cargo / Heavy · Oversized · Sensitive" title={<>When the route<br />becomes part<br />of the job.</>}>
      <p>Heavy and oversized cargo requires planning around the piece, the route and the final delivery site.</p>
      <p className="intro-small">Transformers. Electrical equipment. Cargo beyond standard handling.</p>
      <div className="project-intro-actions"><Button href="/contact?service=project-cargo">Discuss a project movement</Button></div>
    </PageIntro>
    <section className="project-image-band dark"><Container>
      <ResponsiveImage image="industrial" className="wide-photo" priority caption="Industrial logistics context; not a photograph of a KCPL project." />
      <nav className="project-chapter-nav" aria-label="Project cargo on this page">
        <a href="#the-cargo"><span>01</span>The cargo</a><a href="#the-route"><span>02</span>The route</a><a href="#the-site"><span>03</span>The site</a><a href="#project-experience"><span>04</span>Experience</a>
      </nav>
    </Container></section>
    <section className="section"><Container>
      <div className="section-heading"><Eyebrow>Planning the movement</Eyebrow><h2>Three parts of one transport plan.</h2></div>
      <div className="planning-list">{planning.map((chapter, index) => <article id={chapterIds[index]} key={chapter.title}>
        <span className="planning-number">0{index + 1}</span><div><h3>{chapter.title}</h3><p>{chapter.intro}</p></div>
        <ul className="plain-list">{chapter.items.map(item => <li key={item}>{item}</li>)}</ul>
      </article>)}</div>
    </Container></section>
    <section className="project-brief"><Container className="editorial-grid">
      <div><Eyebrow>Before the first conversation</Eyebrow><h2>A useful brief.<br />A better starting point.</h2><p className="muted measure">You do not need every answer before contacting KCPL. Share the details you have and identify what still needs to be confirmed.</p>
        <a className="text-link" href="/project-cargo-brief.txt" download="KCPL-project-cargo-brief.txt">Download the planning checklist <span className="download-format">TXT</span></a>
      </div>
      <div><ul className="plain-list brief-list">{enquiryGuidance['project-cargo'].items.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="small muted">The checklist structures a freight enquiry. Vehicle selection, route suitability and handling arrangements require a separate assessment and agreed scope.</p>
        <TextLink href="/contact?service=project-cargo">Prepare a project enquiry</TextLink>
      </div>
    </Container></section>
    <section className="project-records" id="project-experience"><Container className="editorial-grid">
      <div><Eyebrow>Company-reported experience</Eyebrow><h2>Power-sector cargo.<br />Practical constraints.</h2><p className="muted measure">Selected cargo-handling references from KCPL’s company material. These describe logistics roles associated with the projects.</p><p className="small muted measure">Project references do not imply that KCPL designed, built or commissioned the infrastructure.</p></div>
      <div>{projects.map(project => <article className="project-record" key={project.place}>
        <div className="record-heading"><h3>{project.place}</h3><span>{project.cargo}</span></div>
        <dl><div><dt>KCPL’s role</dt><dd>{project.role}</dd></div><div><dt>Planning context</dt><dd>{project.consideration}</dd></div></dl>
      </article>)}</div>
    </Container></section>
    <section className="section nea-experience" id="nea-projects"><Container>
      <div className="editorial-grid">
        <div><Eyebrow>Project handling references</Eyebrow><h2>Across Nepal’s<br />power infrastructure.</h2><a className="project-authority" href="https://nea.org.np/en"><img src="/organisations/nea.png" alt="" width="51" height="51" loading="lazy" /><span><span className="small">Project authority</span><strong>Nepal Electricity Authority</strong></span></a></div>
        <div><p className="service-lead">KCPL has acted as a project handling agent for cargo connected with the following Nepal Electricity Authority projects.</p><p className="muted">These company-provided references describe cargo-handling involvement, not construction, engineering or commissioning. They do not imply a direct contract with NEA or an endorsement by the authority.</p></div>
      </div>
      <ul className="nea-project-list">{neaProjects.map((project, index) => <li key={project.name + project.location}><span className="section-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{project.name}</h3><p>{project.location}, Nepal</p></div></li>)}</ul>
      <TextLink href="/contact?service=project-cargo">Discuss a comparable cargo movement</TextLink>
    </Container></section>
    <section className="section"><Container className="editorial-grid">
      <div><Eyebrow>Sensitive equipment</Eyebrow><h2>Handling matters<br />all the way to site.</h2></div>
      <div><p className="service-lead">Electrical and GIS equipment can bring additional packing, restraint and movement requirements. Those conditions belong in the transport discussion from the start.</p><p className="muted">Agree the cargo condition, available handling instructions, vehicle requirements, unloading scope and responsibilities with the relevant parties before movement.</p></div>
    </Container></section><QuoteCTA project />
  </>;
}
