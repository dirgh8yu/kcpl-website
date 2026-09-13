'use client';
import { createContext, useContext, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { services } from '@/content/services';
import { company } from '@/content/company';
import { Arrow } from './ui';
import { ServiceGuidance } from './service-guidance';
import { createRequestId } from '@/lib/request-id';

type Errors = Record<string, string>;
const ErrorContext = createContext<Errors>({});
type FieldProps = { name: string; label: string; required?: boolean; type?: string; placeholder?: string; autoComplete?: string; wide?: boolean; maxLength?: number };
function FieldError({ id }: { id: string }) {
  const errors = useContext(ErrorContext);
  return errors[id] ? <p id={id + '-error'} className="field-error">{errors[id]}</p> : null;
}
function Field({ name, label, required = false, type = 'text', placeholder, autoComplete, wide = false, maxLength = 180 }: FieldProps) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const errors = useContext(ErrorContext);
  return <div className={`form-field ${wide ? 'span-two' : ''}`}>
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    <input id={id} name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} maxLength={maxLength} aria-invalid={!!errors[id]} aria-describedby={errors[id] ? id + '-error' : undefined} {...(type === 'number' ? { min: 1, max: 999999999, step: 1 } : {})} />
    <FieldError id={id} />
  </div>;
}
const subscribe = () => () => {};
function serviceName(value: string) {
  return services.find(s => s.id === value)?.title ?? (value === 'partner-enquiry' ? 'Nepal-side support / partner enquiry' : 'Please advise on the service');
}
function emailDraft(data: FormData) {
  const lines = ['Dear KCPL team,', '', 'Please review the following freight enquiry:', ''];
  for (const [key, value] of data.entries()) {
    if (value instanceof File || ['requestId', 'website', 'consent'].includes(key)) continue;
    const text = key === 'Service required' ? serviceName(String(value)) : String(value).trim();
    if (text) lines.push(key + ': ' + text);
  }
  lines.push('', 'Please advise on the available options, documentation and agreed scope.');
  return lines.join('\n');
}
function validate(form: HTMLFormElement): Errors {
  const errors: Errors = {};
  for (const element of Array.from(form.elements)) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) || !element.willValidate) continue;
    const label = element.labels?.[0]?.textContent?.replace(/\s*\*$/, '') || element.name;
    if (element.type === 'checkbox' && element.validity.valueMissing) errors[element.id] = 'Please acknowledge the privacy notice.';
    else if (element.required && !element.value.trim()) errors[element.id] = label + ' is required.';
    else if (element.type === 'email' && element.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value)) errors[element.id] = 'Enter a complete email address, such as name@company.com.';
    else if (!element.validity.valid) errors[element.id] = element.type === 'number' ? 'Enter a positive whole number of packages.' : 'Please check ' + label.toLowerCase() + '.';
  }
  return errors;
}

export function EnquiryForm({ initialService }: { initialService: string }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [service, setService] = useState(initialService);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [fileError, setFileError] = useState('');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [reference, setReference] = useState('');
  const [attempt, setAttempt] = useState('');
  const [summary, setSummary] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [failure, setFailure] = useState('');
  const requestId = useRef('');
  const sending = useRef(false);
  const pending = useRef<FormData | null>(null);
  const output = useRef<HTMLElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const draftText = useRef<HTMLTextAreaElement>(null);
  const receiptText = useRef<HTMLInputElement>(null);
  const disabled = !hydrated || busy || unconfirmed;
  const subject = 'Freight enquiry — Kapileshwor Cargo';

  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || reference) return;
    const form = event.currentTarget;
    if (!pending.current) {
      const nextErrors = validate(form);
      if (fileError) nextErrors['cargo-files'] = fileError;
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        requestAnimationFrame(() => errorSummary.current?.focus());
        return;
      }
    }
    const data = pending.current ?? new FormData(form);
    if (!pending.current) { data.delete('attachments'); files.forEach(file => data.append('attachments', file)); }
    sending.current = true;
    setBusy(true); setFailure(''); setStatus('Sending your enquiry…');
    const controller = new AbortController();
    const slowTimer = window.setTimeout(() => setStatus('Still waiting for confirmation. Please keep this page open; do not send a second enquiry.'), 10000);
    const timeout = window.setTimeout(() => controller.abort(), 35000);
    try {
      requestId.current ||= createRequestId();
      setAttempt('KCPL-' + requestId.current.replaceAll('-', '').toUpperCase());
      data.set('requestId', requestId.current);
      pending.current = data;
      const response = await fetch('/api/enquiries', { method: 'POST', body: data, signal: controller.signal });
      if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Receipt could not be confirmed. If this is a private review, check that you are still signed in.');
      const result = await response.json() as { reference?: string; error?: string };
      if (!response.ok || !result.reference) {
        // An explicit rejection permits editing; a lost/unknown response retains the exact request for a safe retry.
        if ([400, 403, 413, 429].includes(response.status)) { pending.current = null; setUnconfirmed(false); }
        throw new Error(result.error ?? 'Receipt could not be confirmed. Please retry.');
      }
      setSummary(Object.fromEntries(['Origin', 'Destination', 'Cargo / commodity', 'Service required'].map(key => [key, String(data.get(key) ?? '')])));
      setDraft(emailDraft(data));
      setReference(result.reference);
      setStatus('Your enquiry has been received.');
      pending.current = null; setUnconfirmed(false);
      requestAnimationFrame(() => output.current?.focus());
    } catch (error) {
      const unknown = !!pending.current;
      setUnconfirmed(unknown);
      setFailure(error instanceof Error && error.name !== 'AbortError' ? error.message : 'The connection timed out before receipt was confirmed.');
      setStatus('');
      setDraft(emailDraft(data));
      requestAnimationFrame(() => output.current?.focus());
    } finally {
      window.clearTimeout(slowTimer); window.clearTimeout(timeout);
      sending.current = false; setBusy(false);
    }
  }
  function chooseFiles(selected: FileList | null) {
    if (!selected) return;
    const incoming = Array.from(selected);
    const combined = [...files, ...incoming];
    const invalid = combined.length > 3 ? 'Choose up to three files. Remove an existing file before adding another.' : incoming.some(f => !f.size || f.size > 2000000 || !['application/pdf', 'image/jpeg', 'image/png'].includes(f.type)) ? 'Choose non-empty PDF, JPEG or PNG files, up to 2 MB each.' : '';
    setFileError(invalid);
    setErrors(current => { const copy = { ...current }; delete copy['cargo-files']; return copy; });
    if (!invalid) setFiles(combined);
  }
  async function copy(text: string, receipt = false) {
    try { await navigator.clipboard.writeText(text); setStatus(receipt ? 'Receipt reference copied.' : 'Enquiry summary copied.'); }
    catch {
      if (receipt) { receiptText.current?.focus(); receiptText.current?.select(); }
      else { draftText.current?.focus(); draftText.current?.select(); }
      setStatus('Select and copy the text shown on this page.');
    }
  }
  function downloadReceipt() {
    const text = 'KCPL enquiry receipt\n' + reference + '\n\n' + draft + '\n\nThis is an enquiry receipt, not a quotation or booking confirmation.';
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = reference + '.txt'; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <ErrorContext.Provider value={errors}>
    {!reference && <form onSubmit={prepare} method="post" noValidate className="enquiry-form" aria-busy={busy} onBlur={event => {
      const form = event.currentTarget; const id = event.target.id;
      if (errors[id]) { const checked = validate(form); setErrors(current => { const next = { ...current }; if (checked[id]) next[id] = checked[id]; else delete next[id]; return next; }); }
    }}>
      <p className="form-explanation">Fields marked * are required. Share the details you know; leave unconfirmed weights and dimensions blank.</p>
      {!hydrated && <p role="status" className="review-notice">Loading enquiry form… You can also use the direct email link above.</p>}
      {!!Object.keys(errors).length && <div className="error-summary" ref={errorSummary} tabIndex={-1} aria-labelledby="error-heading"><h2 id="error-heading">Check these details</h2><ul>{Object.entries(errors).map(([id, message]) => <li key={id}><a href={'#' + id} onClick={e => { e.preventDefault(); document.getElementById(id)?.focus(); }}>{message}</a></li>)}</ul></div>}
      <fieldset disabled={disabled}><legend><span>01</span>The shipment</legend><div className="form-grid">
        <Field name="Origin" label="Origin city / country" placeholder="City, country" required />
        <Field name="Destination" label="Destination city / country" placeholder="City, country" required />
        <div className="form-field span-two"><label htmlFor="service">Service required <span aria-hidden="true">*</span></label><select id="service" name="Service required" value={service} required aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-error' : undefined} onChange={e => setService(e.target.value)}><option value="">Select a service</option>{services.map(s => <option value={s.id} key={s.id}>{s.title}</option>)}<option value="partner-enquiry">Nepal-side support / partner enquiry</option><option value="advice">Please advise on the service</option></select><FieldError id="service" /></div>
        <Field name="Cargo / commodity" label="Cargo / commodity" required wide placeholder="Describe the goods or equipment" maxLength={500} />
        <Field name="Number of packages" label="Number of packages" type="number" />
        <Field name="Total weight" label="Total weight, with unit" placeholder="e.g. 1,500 kg" />
        <Field name="Dimensions" label="Dimensions (L × W × H), with unit" placeholder="e.g. 120 × 100 × 150 cm per piece" />
        <Field name="Cargo ready date" label="Cargo ready date" type="date" />
      </div>
      <ServiceGuidance service={service} />
      </fieldset>
      <fieldset disabled={disabled}><legend><span>02</span>Your contact details</legend><div className="form-grid">
        <Field name="Name" label="Name" required autoComplete="name" /><Field name="Company" label="Company" autoComplete="organization" />
        <Field name="Email" label="Email" type="email" required autoComplete="email" maxLength={254} /><Field name="Phone" label="Phone, including country code" type="tel" autoComplete="tel" maxLength={80} />
      </div></fieldset>
      <fieldset disabled={disabled}><legend><span>03</span>Supporting details</legend>
        <div className="form-field"><label htmlFor="handling">Special handling requirements</label><textarea id="handling" name="Special handling requirements" rows={3} maxLength={1500} placeholder="Sensitive equipment, lifting needs, oversized pieces, site access…" /></div>
        <div className="form-field"><label htmlFor="additional">Additional information</label><textarea id="additional" name="Additional information" rows={3} maxLength={2500} placeholder="Receiving arrangements, agreed responsibilities or details still to be confirmed" /></div>
        <div className="attachment-picker"><div className="form-field"><label htmlFor="cargo-files">Drawings, packing details or photographs</label><p id="file-help" className="field-help">Optional. Up to 3 PDF, JPEG or PNG files, 2 MB each. For larger drawings, mention what is available so transfer can be arranged.</p><input id="cargo-files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" aria-describedby={fileError ? 'file-help file-error' : 'file-help'} aria-invalid={!!fileError} onChange={e => { chooseFiles(e.target.files); e.target.value = ''; }} />
        {fileError && <p id="file-error" role="alert" className="field-error">{fileError}</p>}</div>
        {!!files.length && <ul className="attachment-list">{files.map((file, index) => <li key={file.name + index}><div><span className="attachment-name">{file.name}</span><span className="small muted">{Math.ceil(file.size / 1000)} KB · Ready to attach</span></div><button type="button" aria-label={'Remove ' + file.name} onClick={() => { setFiles(current => current.filter((_, i) => i !== index)); setFileError(''); setErrors(current => { const next = { ...current }; delete next['cargo-files']; return next; }); }}>Remove</button></li>)}</ul>}
        <p className="field-help">Do not upload passports, bank details or unrelated confidential documents.</p></div>
        <div className="form-trap" aria-hidden="true"><label htmlFor="website">Leave blank</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <label className="consent-line" htmlFor="privacy-consent"><input id="privacy-consent" type="checkbox" name="consent" value="yes" required aria-invalid={!!errors['privacy-consent']} aria-describedby={errors['privacy-consent'] ? 'privacy-consent-error' : undefined} /><span>I have read the <a className="inline-link" href="/privacy" target="_blank" rel="noopener noreferrer">privacy notice<span className="sr-only"> (opens in a new tab)</span></a> and understand that KCPL will store and use these details to handle my enquiry.</span></label><FieldError id="privacy-consent" />
      </fieldset>
      <div className="form-submit"><button type="submit" className="button" disabled={!hydrated || busy} aria-busy={busy}>{busy ? 'Sending your enquiry…' : unconfirmed ? 'Retry receipt confirmation' : 'Send freight enquiry'}{busy ? <span className="loading-dot" aria-hidden="true" /> : <Arrow />}</button><p>{unconfirmed ? 'Your original details are held unchanged for a safe retry.' : 'An enquiry is not a booking. Scope and pricing are confirmed separately.'}</p></div>
    </form>}
    <p role="status" aria-live="polite" className="form-status">{status}</p>
    {reference && <section className="draft-output receipt-panel" tabIndex={-1} ref={output} aria-labelledby="receipt-heading">
      <p className="eyebrow">Enquiry received</p><h2 id="receipt-heading">The details are with KCPL.</h2><p>Keep this reference for correspondence.</p>
      <label htmlFor="receipt-reference">Your receipt reference</label><input id="receipt-reference" className="receipt-reference" ref={receiptText} value={reference} readOnly />
      <div className="draft-actions"><button className="button button-secondary" type="button" onClick={() => copy(reference, true)}>Copy reference</button><button className="button button-secondary" type="button" onClick={downloadReceipt}>Download receipt</button></div>
      <dl className="receipt-summary">{Object.entries(summary).map(([key, value]) => <div key={key}><dt>{key === 'Cargo / commodity' ? 'Cargo' : key === 'Service required' ? 'Service' : key}</dt><dd>{key === 'Service required' ? serviceName(value) : value}</dd></div>)}<div><dt>Documents</dt><dd>{files.length ? files.length + ' file(s) received' : 'None attached'}</dd></div></dl>
      <p>KCPL will review the cargo requirements before confirming scope, pricing or arrangements.</p><p className="receipt-note">This receipt is not a quotation or booking confirmation. No automated confirmation email has been sent.</p><a className="text-link" href="/contact">Start another enquiry<Arrow /></a>
    </section>}
    {!reference && failure && <section className="draft-output" tabIndex={-1} ref={output} aria-labelledby="draft-heading">
      <h2 id="draft-heading">Receipt not confirmed.</h2><p role="alert">{failure}</p>
      <p>{unconfirmed ? 'Use Retry receipt confirmation above to check the same enquiry without creating a duplicate. If you contact KCPL by email, mention this attempt; do not assume it failed to arrive.' : 'Your entries are still here. Correct the details and retry, or contact KCPL by email.'}</p>
      {unconfirmed && <p className="small receipt-reference">Attempt reference: {attempt}</p>}
      <label htmlFor="enquiry-draft">Email fallback — review before sending</label><textarea id="enquiry-draft" ref={draftText} value={draft} onChange={e => setDraft(e.target.value)} rows={9} />
      <div className="draft-actions"><a className="button" href={`mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent((unconfirmed ? 'Please check receipt of attempt ' + attempt + ' before creating another enquiry.\n\n' : '') + draft)}`}>Open email draft<Arrow /></a><button className="button button-secondary" type="button" onClick={() => copy(draft)}>Copy enquiry</button></div>
      <p className="small muted">Opening a draft does not send an email. Attach any files yourself in your email app.</p>
    </section>}
  </ErrorContext.Provider>;
}
