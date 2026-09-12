'use client';
import { useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { services } from '@/content/services';
import { company } from '@/content/company';
import { Arrow } from './ui';

type FieldProps = { name: string; label: string; required?: boolean; type?: string; placeholder?: string; autoComplete?: string; wide?: boolean; maxLength?: number };
function Field({ name, label, required = false, type = 'text', placeholder, autoComplete, wide = false, maxLength = 180 }: FieldProps) {
  const fieldId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return <div className={`form-field ${wide ? 'span-two' : ''}`}><label htmlFor={fieldId}>{label}{required && <span aria-hidden="true"> *</span>}</label><input id={fieldId} name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} maxLength={maxLength} {...(type === 'number' ? { min: 1, step: 1 } : {})} /></div>;
}
const subscribe = () => () => {};
export function EnquiryForm({ initialService }: { initialService: string }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [service, setService] = useState(initialService);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');
  const requestId = useRef('');
  const [status, setStatus] = useState('');
  const output = useRef<HTMLElement>(null);
  const draftText = useRef<HTMLTextAreaElement>(null);
  const subject = 'Freight enquiry — Kapileshwor Cargo';
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || reference) return;
    const data = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    data.set('requestId', requestId.current);
    setBusy(true); setStatus('Sending your enquiry…');
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', body: data });
      const result = await response.json() as { reference?: string; error?: string };
      if (!response.ok || !result.reference) throw new Error(result.error ?? 'Receipt could not be confirmed. Please retry.');
      setReference(result.reference); setStatus('Your enquiry and any attachments have been received. This is not a quotation or booking confirmation.');
      setBusy(false); requestAnimationFrame(() => output.current?.focus()); return;
    } catch (error) { setStatus((error as Error).message); setBusy(false); }

    const lines: string[] = ['Dear KCPL team,', '', 'Please review the following freight enquiry:', ''];
    for (const [key, value] of data.entries()) {
      if (value instanceof File || ['requestId', 'website', 'consent'].includes(key)) continue;
      const raw = String(value).trim();
      const text = key === 'Service required' ? (services.find(s => s.id === raw)?.title ?? (raw === 'partner-enquiry' ? 'Nepal-side support / partner enquiry' : 'Please advise on the service')) : raw;
      if (text) lines.push(`${key}: ${text}`);
    }
    lines.push('', 'Please advise on the available options, documentation and agreed scope.');
    setDraft(lines.join('\n'));
    requestAnimationFrame(() => output.current?.focus());
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft); setStatus('Enquiry copied. Paste it into an email to ' + company.email + '.'); }
    catch { draftText.current?.focus(); draftText.current?.select(); setStatus('Select and copy the enquiry text, then paste it into your email.'); }
  }
  return <><form onSubmit={prepare} method="post" className="enquiry-form" aria-busy={busy}>
    <p className="form-explanation">Send your cargo requirements directly to KCPL. Fields marked * are required. Keep a copy of the receipt reference after submission.</p>
    <fieldset disabled={!hydrated || busy || !!reference}><legend><span>01</span> Your details</legend><div className="form-grid"><Field name="Name" label="Name" required autoComplete="name" /><Field name="Company" label="Company" autoComplete="organization" /><Field name="Email" label="Email" type="email" required autoComplete="email" /><Field name="Phone" label="Phone, including country code" type="tel" autoComplete="tel" /></div></fieldset>
    <fieldset disabled={!hydrated || busy || !!reference}><legend><span>02</span> The shipment</legend><div className="form-grid"><Field name="Origin" label="Origin city / country" placeholder="City, country" required /><Field name="Destination" label="Destination city / country" placeholder="City, country" required /><div className="form-field span-two"><label htmlFor="service">Service required *</label><select id="service" name="Service required" value={service} required onChange={e => setService(e.target.value)}><option value="">Select a service</option>{services.map(s => <option value={s.id} key={s.id}>{s.title}</option>)}<option value="partner-enquiry">Nepal-side support / partner enquiry</option><option value="advice">Please advise on the service</option></select></div><Field name="Cargo / commodity" label="Cargo / commodity" required wide placeholder="Describe the goods or equipment" /><Field name="Number of packages" label="Number of packages" type="number" /><Field name="Total weight" label="Total weight, with unit" placeholder="e.g. 1,500 kg" /><Field name="Dimensions" label="Dimensions (L × W × H), with unit" placeholder="e.g. 120 × 100 × 150 cm per piece" /><Field name="Cargo ready date" label="Cargo ready date" type="date" /></div>
      {service === 'project-cargo' && <aside className="project-guidance"><h3>For project cargo</h3><p>Include individual piece weights and dimensions, delivery-site details and access constraints. You can include drawings or photographs below. For larger technical files, mention what is available and arrange transfer with KCPL.</p></aside>}
    </fieldset>
    <fieldset disabled={!hydrated || busy || !!reference}><legend><span>03</span> Handling & delivery</legend><div className="form-field"><label htmlFor="handling">Special handling requirements</label><textarea id="handling" name="Special handling requirements" rows={3} maxLength={1500} placeholder="Fragile or sensitive equipment, lifting needs, oversized pieces, site access…" /></div><div className="form-field"><label htmlFor="additional">Additional information</label><textarea id="additional" name="Additional information" rows={4} maxLength={2500} placeholder="Agreed responsibilities, receiving arrangements or other details" /></div></fieldset>
    <fieldset disabled={!hydrated || busy || !!reference}><legend><span>04</span> Supporting documents</legend><div className="form-field"><label htmlFor="cargo-files">Drawings, packing details or cargo photographs (optional)</label><input id="cargo-files" name="attachments" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" aria-describedby="file-help" /><p id="file-help" className="small muted">Up to 3 PDF, JPEG or PNG files, 2 MB each. Do not upload passports, bank details or unrelated confidential documents.</p></div><div className="form-trap" aria-hidden="true"><label htmlFor="website">Leave blank</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div><label className="consent-line"><input type="checkbox" name="consent" value="yes" required /><span>I have read the <a className="inline-link" href="/privacy">privacy notice</a> and understand that KCPL will store and use these details to handle my enquiry.</span></label></fieldset><button type="submit" className="button" disabled={!hydrated || busy || !!reference}>{busy ? 'Sending…' : reference ? 'Enquiry received' : 'Send freight enquiry'}<Arrow /></button>
  </form>
  <p role="status" aria-live="polite" className="form-status">{status}</p>
  {reference && <section className="draft-output" tabIndex={-1} ref={output}><h2>Enquiry received.</h2><p className="receipt-reference">{reference}</p><p>Keep this reference for correspondence. KCPL will review the cargo requirements before confirming scope, pricing or arrangements. No automated email confirmation is sent by this version.</p><a className="inline-link" href="/contact">Start another enquiry</a></section>}
  {!reference && draft && <section className="draft-output" tabIndex={-1} ref={output} aria-labelledby="draft-heading"><h2 id="draft-heading">Review your enquiry</h2><p>To: <a className="inline-link" href={`mailto:${company.email}`}>{company.email}</a></p><label htmlFor="enquiry-draft">Email body — you can edit this before sending</label><textarea id="enquiry-draft" ref={draftText} value={draft} onChange={e => setDraft(e.target.value)} rows={14} /><div className="draft-actions"><a className="button" href={`mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`}>Open email draft<Arrow /></a><button className="button button-secondary" type="button" onClick={copy}>Copy enquiry</button></div><p className="small muted">Nothing has been sent. Send the email from your email app. If the draft does not open or appears incomplete, use Copy enquiry and paste it into a new message.</p></section>}
  </>;
}
