import { db, json, staff, sameOrigin, limitedBody } from '@/lib/backend';
import { statuses } from '@/lib/enquiry-validation';
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) {
  if (!await staff()) return json({ error: 'Staff access required.' }, 403);
  try {
    const { id } = await context.params;
    const item = await db().prepare('SELECT id,reference,data,status,version,created_at,updated_at FROM enquiries WHERE id = ?').bind(id).first();
    if (!item) return json({ error: 'Enquiry not found.' }, 404);
    const files = await db().prepare('SELECT id,name,mime,size FROM attachments WHERE enquiry_id = ?').bind(id).all();
    const events = await db().prepare('SELECT actor,message,created_at FROM enquiry_events WHERE enquiry_id = ? ORDER BY created_at DESC LIMIT 100').bind(id).all();
    return json({ item, files: files.results, events: events.results });
  } catch { console.error('Enquiry detail unavailable'); return json({ error: 'Enquiry could not be loaded.' }, 503); }
}
export async function PATCH(request: Request, context: Context) {
  const actor = await staff(); if (!actor || !sameOrigin(request)) return json({ error: 'Staff access required.' }, 403);
  try {
    const { id } = await context.params;
    let input;
    try { input = JSON.parse(new TextDecoder().decode(await limitedBody(request, 12000))); } catch { return json({ error: 'Invalid update.' }, 400); }
    const { status, version, note } = input ?? {};
    if (!statuses.includes(status) || !Number.isInteger(version) || version < 1 || typeof note !== 'string' || note.length > 2000) return json({ error: 'Please check the status and note (maximum 2,000 characters).' }, 400);
    const now = new Date().toISOString(); const eventId = crypto.randomUUID();
    // The event and optimistic update execute atomically. A stale version writes neither.
    const result = await db().batch([
      db().prepare('INSERT INTO enquiry_events (id,enquiry_id,actor,message,created_at) SELECT ?,id,?,?,? FROM enquiries WHERE id = ? AND version = ?').bind(eventId, actor.userId, `Status: ${status}${note.trim() ? '\n' + note.trim() : ''}`, now, id, version),
      db().prepare('UPDATE enquiries SET status = ?, version = version + 1, updated_at = ? WHERE id = ? AND version = ?').bind(status, now, id, version),
    ]);
    if (!result[1].meta.changes) return json({ error: 'This enquiry changed in another session. Refresh it before saving.' }, 409);
    return json({ saved: true });
  } catch { console.error('Enquiry update failed'); return json({ error: 'The update could not be saved. Your note is still here.' }, 503); }
}
