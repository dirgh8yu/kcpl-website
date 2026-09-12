import { db, json, staff } from '@/lib/backend';
import { statuses } from '@/lib/enquiry-validation';
export async function GET(request: Request) {
  if (!await staff()) return json({ error: 'Staff access required.' }, 403);
  try {
    const url = new URL(request.url); const status = url.searchParams.get('status') ?? '';
    if (status && !statuses.includes(status as typeof statuses[number])) return json({ error: 'Unknown status.' }, 400);
    const rawPage = Number(url.searchParams.get('page') ?? 0); const page = Number.isInteger(rawPage) && rawPage >= 0 ? Math.min(rawPage, 10000) : 0;
    const q = (url.searchParams.get('q') ?? '').trim().slice(0, 100);
    const result = await db().prepare("SELECT id,reference,data,status,version,created_at,updated_at FROM enquiries WHERE (? = '' OR status = ?) AND (? = '' OR instr(lower(data || reference), lower(?)) > 0) ORDER BY created_at DESC,id DESC LIMIT 26 OFFSET ?").bind(status, status, q, q, page * 25).all();
    return json({ items: result.results.slice(0,25), hasMore: result.results.length > 25, page });
  } catch { console.error('Enquiry list unavailable'); return json({ error: 'Enquiries could not be loaded. Please retry.' }, 503); }
}
