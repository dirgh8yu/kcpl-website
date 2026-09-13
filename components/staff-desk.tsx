'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { statuses } from '@/lib/enquiry-validation';
import { services } from '@/content/services';

type Item = { id: string; reference: string; data: string; status: string; version: number; created_at: string; updated_at: string };
type Detail = { item: Item; files: { id: string; name: string; size: number }[]; events: { actor: string; message: string; created_at: string }[] };
type ListResult = { key: string; items: Item[]; hasMore: boolean; error: string; refreshed: string };
type DetailResult = { key: string; data: Detail | null; error: string };
const statusLabels: Record<string, string> = { new: 'New', reviewing: 'Reviewing', 'awaiting-details': 'Awaiting details', quoted: 'Quoted', closed: 'Closed' };
function date(value: string) { return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kathmandu' }).format(new Date(value)) + ' NPT'; }
function serviceLabel(value: string) { return services.find(service => service.id === value)?.title ?? (value === 'partner-enquiry' ? 'Nepal-side support' : value === 'advice' ? 'Service advice requested' : value); }
class DeskError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const timeout = new AbortController();
  const timer = window.setTimeout(() => timeout.abort(), 20000);
  const abort = () => timeout.abort();
  options?.signal?.addEventListener('abort', abort, { once: true });
  if (options?.signal?.aborted) timeout.abort();
  try {
    const response = await fetch(url, { cache: 'no-store', ...options, signal: timeout.signal });
    if (!response.headers.get('content-type')?.includes('application/json')) throw new DeskError('Your session may have expired. Reopen the enquiry desk to sign in again. Copy any unsaved note first.', 401);
    const data = await response.json() as T & { error?: string };
    if (!response.ok) throw new DeskError(response.status === 403 ? 'Staff access could not be verified. Reopen the desk to check your sign-in; copy any unsaved note first.' : data.error ?? 'Request unavailable.', response.status);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError' && !options?.signal?.aborted) throw new DeskError('The request timed out before confirmation. Please retry the read or refresh the enquiry before attempting another save.', 408);
    throw error;
  } finally { window.clearTimeout(timer); options?.signal?.removeEventListener('abort', abort); }
}
export function StaffDesk() {
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [list, setList] = useState<ListResult>({ key: '', items: [], hasMore: false, error: '', refreshed: '' });
  const [selected, setSelected] = useState('');
  const [detailRevision, setDetailRevision] = useState(0);
  const [detailResult, setDetailResult] = useState<DetailResult>({ key: '', data: null, error: '' });
  const [nextStatus, setNextStatus] = useState('new');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [needsReload, setNeedsReload] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [notice, setNotice] = useState('');
  const listPosition = useRef(0);
  const detailPanel = useRef<HTMLElement>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const saveLock = useRef(false);
  const preserveStatus = useRef(false);
  const listKey = JSON.stringify([status, search, page, revision]);
  const detailKey = selected + ':' + detailRevision;
  const loading = list.key !== listKey;
  const detailLoading = !!selected && detailResult.key !== detailKey;
  const detail = detailResult.key === detailKey ? detailResult.data : null;
  const draftRecord = detailResult.data?.item.id === selected ? detailResult.data : null;
  const dirty = !!note.trim() || (!!draftRecord && nextStatus !== draftRecord.item.status);

  useEffect(() => {
    const controller = new AbortController();
    api<{ items: Item[]; hasMore: boolean }>(`/api/staff/enquiries?status=${encodeURIComponent(status)}&q=${encodeURIComponent(search)}&page=${page}`, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setList({ key: listKey, ...data, error: '', refreshed: date(new Date().toISOString()) }); })
      .catch(error => { if (!controller.signal.aborted) setList(previous => ({ ...previous, key: listKey, error: error.message })); });
    return () => controller.abort();
  }, [status, search, page, revision, listKey]);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    api<Detail>('/api/staff/enquiries/' + selected, { signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted) return;
        setDetailResult({ key: detailKey, data, error: '' });
        if (!preserveStatus.current) setNextStatus(data.item.status);
        preserveStatus.current = false;
        setNeedsReload(false);
        if (detailRevision) setNotice('Latest enquiry loaded. Any retained draft is still here; check the history before saving it.');
      })
      .catch(error => { if (!controller.signal.aborted) setDetailResult({ key: detailKey, data: null, error: error.message }); });
    return () => controller.abort();
  }, [selected, detailRevision, detailKey]);

  useEffect(() => {
    if (!dirty && !busy) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, busy]);

  function mayLeave() { return !busy && (!dirty || window.confirm('Discard the unsaved follow-up changes?')); }
  function select(item: Item) {
    if (selected === item.id || !mayLeave()) return;
    listPosition.current = window.scrollY;
    preserveStatus.current = false;
    setDetailResult({ key: '', data: null, error: '' }); setNextStatus(item.status);
    setSelected(item.id); setDetailRevision(0); setNote(''); setSaveError(''); setNotice(''); setNeedsReload(false);
    requestAnimationFrame(() => {
      if (window.matchMedia('(max-width: 800px)').matches) {
        detailPanel.current?.focus(); detailPanel.current?.scrollIntoView({ block: 'start' });
      }
    });
  }
  function back() {
    if (!mayLeave()) return;
    const previous = selected;
    setSelected(''); setNote(''); setSaveError(''); setNotice('');
    requestAnimationFrame(() => { document.getElementById('enquiry-' + previous)?.focus({ preventScroll: true }); window.scrollTo({ top: listPosition.current }); });
  }
  function refreshDetail() {
    if (busy || detailLoading) return;
    preserveStatus.current = !!detail && nextStatus !== detail.item.status;
    setSaveError(''); setNotice(''); setDetailRevision(value => value + 1);
  }
  function clearFilters() { setQuery(''); setSearch(''); setStatus(''); setPage(0); setRevision(value => value + 1); }
  async function copyNote() {
    try { await navigator.clipboard.writeText(note); setNotice('Draft note copied.'); }
    catch { noteInput.current?.focus(); noteInput.current?.select(); setNotice('Select and copy the draft note.'); }
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!detail || saveLock.current || needsReload || !dirty) return;
    saveLock.current = true; setBusy(true); setSaveError(''); setNotice('');
    let confirmed = false;
    try {
      const result = await api<{ saved: boolean }>('/api/staff/enquiries/' + detail.item.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus, version: detail.item.version, note }) });
      if (!result.saved) throw new DeskError('The save response could not be confirmed. Refresh the enquiry before trying again.', 503);
      confirmed = true;
      setNote('');
      const fresh = await api<Detail>('/api/staff/enquiries/' + detail.item.id);
      setDetailResult({ key: detailKey, data: fresh, error: '' }); setNextStatus(fresh.item.status);
      setNotice('Follow-up saved. The latest details are shown.');
    } catch (error) {
      if (confirmed) setNotice('Follow-up saved, but the latest details could not be loaded. Refresh the enquiry before making another update.');
      else setSaveError(error instanceof Error ? error.message : 'Save not confirmed. Refresh the enquiry before trying again.');
      setNeedsReload(true);
    } finally {
      if (confirmed) setRevision(value => value + 1);
      saveLock.current = false; setBusy(false);
    }
  }
  const fields: Record<string, string> = detail ? JSON.parse(detail.item.data) : {};
  const filtered = !!search || !!status;
  return <>
    <form className="desk-filters" role="search" onSubmit={event => { event.preventDefault(); setSearch(query.trim()); setPage(0); setRevision(value => value + 1); }}>
      <div className="form-field"><label htmlFor="desk-search">Search cargo, company or reference</label><input id="desk-search" type="search" value={query} onChange={event => setQuery(event.target.value)} maxLength={100} /></div>
      <div className="form-field"><label htmlFor="desk-status">Enquiry status</label><select id="desk-status" value={status} onChange={event => { setStatus(event.target.value); setPage(0); }}><option value="">All enquiries</option>{statuses.map(value => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></div>
      <button className="button" type="submit" disabled={loading}>Search</button>
      <button className="button button-secondary" type="button" disabled={loading} aria-busy={loading} onClick={() => setRevision(value => value + 1)}>{loading ? 'Refreshing…' : 'Refresh list'}</button>
    </form>
    <div className="desk-list-toolbar"><p className="desk-feedback" role="status">{loading ? 'Loading enquiries…' : list.error ? 'Enquiry list unavailable.' : 'Last refreshed ' + list.refreshed}</p>{filtered && <button className="text-link" type="button" onClick={clearFilters}>Clear filters</button>}</div>
    <div className={`desk-workspace ${selected ? 'has-selection' : ''}`}>
      <section className="desk-list" aria-label="Enquiries" aria-busy={loading}>
        {list.error && !loading && <div className="desk-message" role="alert"><h2>Could not load the list.</h2><p>{list.error}</p><button className="text-link" type="button" onClick={() => setRevision(value => value + 1)}>Retry loading</button></div>}
        {!list.error && !loading && !list.items.length && <div className="desk-message"><h2>{filtered ? 'No matching enquiries.' : page ? 'No more enquiries.' : 'No enquiries yet.'}</h2><p>{filtered ? 'Try a different company, route or reference, or clear the filters.' : page ? 'Return to the previous page to review earlier results.' : 'New freight enquiries will appear here when they are received.'}</p>{filtered && <button className="text-link" type="button" onClick={clearFilters}>Show all enquiries</button>}</div>}
        {!list.error && list.items.map(item => {
          const data = JSON.parse(item.data) as Record<string, string>;
          return <button type="button" className={`desk-row ${selected === item.id ? 'is-selected' : ''}`} id={'enquiry-' + item.id} key={item.id} disabled={busy || loading} onClick={() => select(item)} aria-pressed={selected === item.id}>
            <span className="desk-row-meta"><span className="desk-status" data-status={item.status}>{statusLabels[item.status] ?? item.status}</span><time dateTime={item.created_at}>{date(item.created_at)}</time></span>
            <strong>{data.Origin} → {data.Destination}</strong>
            <span>{data.Company || data.Name}</span><span className="small muted">{serviceLabel(data['Service required'])}</span>
            <span className="small desk-reference">{item.reference}</span>
          </button>;
        })}
        <nav className="desk-pagination" aria-label="Enquiry pages"><button type="button" className="button button-secondary" disabled={loading || page === 0} onClick={() => setPage(value => value - 1)}>Previous</button><span className="small">Page {page + 1}</span><button type="button" className="button button-secondary" disabled={loading || !list.hasMore || !!list.error} onClick={() => setPage(value => value + 1)}>Next</button></nav>
      </section>
      <section className="desk-detail" aria-label="Selected enquiry" ref={detailPanel} tabIndex={-1} aria-busy={detailLoading}>
        <button type="button" className="button button-secondary desk-back" disabled={busy} onClick={back}>← Back to enquiries</button>
        {!selected && <div className="desk-message"><p className="eyebrow">Cargo / Documents / Follow-up</p><h2>Select an enquiry.</h2><p>Review the shipment details, check the documents and record the next step.</p></div>}
        {detailLoading && <p role="status">Loading the enquiry…</p>}
        {!!selected && !detailLoading && detailResult.error && <div className="desk-message" role="alert"><h2>Details unavailable.</h2><p>{detailResult.error}</p><button className="text-link" type="button" onClick={refreshDetail}>Retry loading details</button>{note && <><p>Your draft note is retained.</p><textarea aria-label="Retained draft note" ref={noteInput} readOnly value={note} rows={5} /><button className="text-link" type="button" onClick={copyNote}>Copy draft note</button></>}</div>}
        {detail && <>
          <div className="desk-detail-header"><span className="desk-status" data-status={detail.item.status}>{statusLabels[detail.item.status] ?? detail.item.status}</span><button type="button" className="text-link" disabled={busy} onClick={refreshDetail}>Refresh enquiry</button></div>
          <p className="small desk-reference">{detail.item.reference}</p><h2>{fields.Company || fields.Name}</h2><p className="desk-route">{fields.Origin} → {fields.Destination}</p>
          <a className="inline-link" href={`mailto:${fields.Email}?subject=${encodeURIComponent('Re: ' + detail.item.reference)}`}>Email {fields.Name}</a>
          <dl className="desk-fields">{Object.entries(fields).filter(([,value]) => value).map(([key,value]) => <div key={key}><dt>{key}</dt><dd>{key === 'Service required' ? serviceLabel(value) : value}</dd></div>)}</dl>
          <h3>Cargo documents</h3><p className="small muted">Customer-supplied files are not malware-scanned. Download only when needed; scan before opening.</p>
          {detail.files.length ? <ul className="desk-files">{detail.files.map(file => <li key={file.id}><a className="inline-link" href={'/api/staff/files/' + file.id}>{file.name}</a><span className="small muted">{Math.ceil(file.size / 1000)} KB</span></li>)}</ul> : <p className="small muted">No documents attached.</p>}
          <form onSubmit={save} aria-busy={busy}>
            <div className="desk-followup-heading"><h3>Follow-up</h3>{dirty && <span className="small muted">Unsaved changes</span>}</div>
            {saveError && <p className="desk-save-error" role="alert">{saveError}</p>}
            {needsReload && <div className="desk-message"><p>Refresh the enquiry and review its latest history before saving again. Your unsaved note is retained.</p><button type="button" className="text-link" onClick={refreshDetail} disabled={busy}>Load latest details</button></div>}
            <div className="form-field"><label htmlFor="follow-status">Status</label><select id="follow-status" value={nextStatus} onChange={event => setNextStatus(event.target.value)} disabled={busy}>{statuses.map(value => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></div>
            <div className="form-field"><label htmlFor="follow-note">Internal follow-up note</label><textarea id="follow-note" ref={noteInput} rows={5} value={note} onChange={event => setNote(event.target.value)} maxLength={2000} disabled={busy} aria-describedby="follow-note-help" placeholder="Missing dimensions, agreed next step, or handover details" /><p id="follow-note-help" className="field-help">Internal only. Saving does not send an email or confirm a booking.</p></div>
            <div className="desk-save-actions"><button className="button" type="submit" disabled={busy || needsReload || !dirty} aria-busy={busy}>{busy ? 'Saving follow-up…' : 'Save follow-up'}</button>{!!note && <button className="text-link" type="button" disabled={busy} onClick={copyNote}>Copy draft note</button>}</div>
          </form>
          <p className="desk-feedback" role="status">{notice}</p><h3>Follow-up history</h3>
          {detail.events.length ? <ol className="desk-history">{detail.events.map((event,index) => <li key={index}><time className="small muted" dateTime={event.created_at}>{date(event.created_at)}</time><p>{event.message}</p><span className="small muted">Recorded by authorised staff</span></li>)}</ol> : <p>No follow-up recorded yet.</p>}
        </>}
      </section>
    </div>
  </>;
}
