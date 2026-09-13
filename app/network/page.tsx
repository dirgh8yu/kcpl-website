import { Container, PageIntro, Eyebrow, TextLink } from '@/components/ui';
import { NetworkDirectory, QuoteCTA } from '@/components/sections';
import { partnerHandovers, branchOffices, warehouseFacilities } from '@/content/network';
import { enquiryGuidance } from '@/content/enquiry-guidance';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('Network & Overseas Partners', 'Your Nepal-side logistics counterpart for regional India and China freight coordination, customs, inland transport and international forwarding handovers.', '/network');
export default function NetworkPage() {
  return <>
    <PageIntro label="Network / Partners" title={<>International connections.<br />Nepal-side knowledge.</>}>
      <p>A Kathmandu-based counterpart for freight forwarders, importers and exporters coordinating cargo to and from Nepal.</p>
      <TextLink href="/contact?service=partner-enquiry">Discuss Nepal-side support</TextLink>
    </PageIntro>
    <section className="network-section"><Container className="editorial-grid">
      <div><Eyebrow>Operating coverage</Eyebrow><h2>Connected through<br />the shipment plan.</h2><p className="muted measure">The right gateway depends on the origin, the cargo and the destination. KCPL coordinates the relevant freight and customs stages through its Nepal and India locations and international counterparts.</p><p className="network-ownership-note">Kathmandu is KCPL’s base, supported by operating locations at the key customs and gateway points.</p></div>
      <NetworkDirectory />
    </Container></section>
    <section className="section location-section" id="offices"><Container className="editorial-grid">
      <div><Eyebrow>KCPL locations</Eyebrow><h2>At the gateways.<br />Closer to the cargo.</h2><p className="muted measure">Branch offices in Nepal and India support cross-border coordination. Contact the Kathmandu team to arrange the relevant office handover before a visit or cargo dispatch.</p><TextLink href="/contact">Contact KCPL</TextLink></div>
      <div className="location-directory"><h3>Branch offices</h3>{branchOffices.map(group => <div className="location-group" key={group.country}><h4>{group.country}</h4><ul>{group.locations.map(place => <li key={place}>{place}</li>)}</ul></div>)}</div>
    </Container></section>
    <section className="section" id="warehouse-facilities"><Container className="editorial-grid">
      <div><Eyebrow>Storage / Inland movement</Eyebrow><h2>Warehouse facilities.<br />India and Nepal.</h2><p className="muted measure">Storage locations connected with the shipment plan. Discuss space, cargo suitability, handling and release arrangements with KCPL.</p><TextLink href="/contact?service=warehousing">Discuss storage requirements</TextLink></div>
      <div className="location-directory"><h3>Facility locations</h3>{warehouseFacilities.map(group => <div className="location-group" key={group.country}><h4>{group.country}</h4><ul>{group.locations.map(place => <li key={place}>{place}</li>)}</ul></div>)}</div>
    </Container></section>
    <section className="handover-section"><Container>
      <div className="editorial-grid"><div><Eyebrow>Clear responsibilities</Eyebrow><h2>Agree the handovers.<br />Then plan the movement.</h2></div><p className="service-lead">A shared shipment scope should identify who coordinates each stage, which documents travel with the cargo and how the receiving party is prepared.</p></div>
      <ol className="handover-list">{partnerHandovers.map((handover, index) => <li key={handover.stage}>
        <span className="section-number">0{index + 1}</span><h3>{handover.stage}</h3><div><p>{handover.scope}</p><p className="muted">{handover.responsibility}</p></div>
      </li>)}</ol>
    </Container></section>
    <section className="section"><Container className="editorial-grid">
      <div><Eyebrow>For overseas freight forwarders</Eyebrow><h2>Your counterpart<br />on the ground.</h2><p className="muted measure">Discuss customs requirements, inland transport and final delivery as part of the wider freight scope.</p></div>
      <div><h3>Information for a Nepal-side enquiry</h3><ul className="plain-list">{enquiryGuidance['partner-enquiry'].items.map(item => <li key={item}>{item}</li>)}</ul><TextLink href="/contact?service=partner-enquiry">Prepare a partner enquiry</TextLink></div>
    </Container></section><QuoteCTA />
  </>;
}
