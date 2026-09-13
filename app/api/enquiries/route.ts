import { bucket, db, digest, json, sameOrigin, allowIntake, limitedBody } from '@/lib/backend';
import { validateEnquiry } from '@/lib/enquiry-validation';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Please submit from the KCPL website.' }, 403);
  const savedKeys: string[] = [];
  try {
    if (!await allowIntake(request)) return json({ error: 'Too many attempts. Please try again later or email KCPL.' }, 429);
    let form: FormData;
    try { form = await new Response(await limitedBody(request, 6500000), { headers: { 'Content-Type': request.headers.get('content-type') ?? '' } }).formData(); }
    catch { return json({ error: 'The form could not be read. Keep attachments below 6 MB in total.' }, 400); }
    if (form.get('website')) return json({ error: 'The enquiry could not be accepted.' }, 400);
    if (form.get('consent') !== 'yes') return json({ error: 'Please acknowledge the privacy notice.' }, 400);
    const id = String(form.get('requestId') ?? '');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return json({ error: 'Please reload the form before submitting.' }, 400);
    let data: Record<string, string>;
    try { data = validateEnquiry(Object.fromEntries(form)); } catch (e) { return json({ error: (e as Error).message }, 400); }
    const files = form.getAll('attachments').filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > 3 || files.some(f => f.size > 2000000)) return json({ error: 'Attach up to three PDF, JPEG or PNG files, each below 2 MB.' }, 400);
    const checked = [];
    for (const f of files) {
      const bytes = await f.arrayBuffer(); const sig = new Uint8Array(bytes);
      const mime = sig[0] === 37 && sig[1] === 80 && sig[2] === 68 && sig[3] === 70 && sig[4] === 45 ? 'application/pdf' : sig[0] === 255 && sig[1] === 216 && sig[2] === 255 ? 'image/jpeg' : [137,80,78,71,13,10,26,10].every((v,i) => sig[i] === v) ? 'image/png' : '';
      if (!mime || mime !== f.type) return json({ error: 'Only PDF, JPEG or PNG files with a matching file signature are accepted.' }, 400);
      checked.push({ bytes, mime, name: f.name.replace(/[^a-zA-Z0-9 ._()-]/g, '_').slice(0, 120), size: f.size, hash: await digest(bytes) });
    }
    const hash = await digest(JSON.stringify([data, checked.map(f => [f.name, f.hash])]));
    const existing = await db().prepare('SELECT reference, payload_hash FROM enquiries WHERE id = ?').bind(id).first<{ reference: string; payload_hash: string }>();
    if (existing) return existing.payload_hash === hash ? json({ reference: existing.reference }) : json({ error: 'This request was already saved. Reload to start a new enquiry.' }, 409);
    const reference = 'KCPL-' + id.replaceAll('-', '').toUpperCase(); const now = new Date().toISOString();
    const inserts = [db().prepare('INSERT INTO enquiries (id,payload_hash,reference,data,status,version,created_at,updated_at) VALUES (?,?,?,?,?,1,?,?)').bind(id, hash, reference, JSON.stringify(data), 'new', now, now)];
    for (const f of checked) {
      const fileId = crypto.randomUUID(); const key = `enquiries/${id}/${fileId}`;
      await bucket().put(key, f.bytes, { httpMetadata: { contentType: 'application/octet-stream' } }); savedKeys.push(key);
      inserts.push(db().prepare('INSERT INTO attachments (id,enquiry_id,object_key,name,mime,size) VALUES (?,?,?,?,?,?)').bind(fileId, id, key, f.name, f.mime, f.size));
    }
    try { await db().batch(inserts); }
    catch (error) {
      await Promise.all(savedKeys.map(key => bucket().delete(key))); savedKeys.length = 0;
      const raced = await db().prepare('SELECT reference, payload_hash FROM enquiries WHERE id = ?').bind(id).first<{reference: string; payload_hash: string}>();
      if (raced?.payload_hash === hash) return json({ reference: raced.reference }); throw error;
    }
    return json({ reference }, 201);
  } catch (error) {
    await Promise.allSettled(savedKeys.map(key => bucket().delete(key)));
    console.error('Enquiry intake failed', error instanceof Error ? error.name : 'Storage error');
    return json({ error: 'We could not confirm receipt. Your entries are still here. Retry or contact KCPL by email.' }, 503);
  }
}
