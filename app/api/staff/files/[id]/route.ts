import { bucket, db, json, staff } from '@/lib/backend';
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await staff()) return json({ error: 'Staff access required.' }, 403);
  try {
    const { id } = await context.params;
    const file = await db().prepare('SELECT object_key,name FROM attachments WHERE id = ?').bind(id).first<{object_key: string; name: string}>();
    if (!file) return json({ error: 'File not found.' }, 404);
    const object = await bucket().get(file.object_key);
    if (!object) return json({ error: 'File unavailable.' }, 404);
    return new Response(object.body, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="${file.name}"`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "sandbox; default-src 'none'" } });
  } catch { console.error('Attachment unavailable'); return json({ error: 'File could not be downloaded.' }, 503); }
}
