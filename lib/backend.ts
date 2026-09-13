import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export function db() { if (!env.DB) throw new Error('Database unavailable'); return env.DB; }
export function bucket() { if (!env.BUCKET) throw new Error('Storage unavailable'); return env.BUCKET; }
export function json(value: unknown, status = 200) { return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
export async function staff() {
  const user = await getChatGPTUser();
  const allowed = (env.STAFF_EMAILS ?? '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return user && allowed.includes(user.email.toLowerCase()) ? user : null;
}
export function sameOrigin(request: Request) {
  return !!env.SITE_ORIGIN && request.headers.get('origin') === env.SITE_ORIGIN && new URL(request.url).origin === env.SITE_ORIGIN;
}
export async function digest(value: string | ArrayBuffer) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).map(b => b.toString(16).padStart(2, '0')).join('');
}
export async function allowIntake(request: Request) {
  if (!env.RATE_LIMIT_SECRET) return false;
  const hour = Math.floor(Date.now() / 3600000);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.RATE_LIMIT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${hour}:${request.headers.get('cf-connecting-ip') ?? 'unknown'}`));
  const hash = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  const row = await db().prepare('INSERT INTO rate_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count').bind(hash, (hour + 2) * 3600000).first<{ count: number }>();
  await db().prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Date.now()).run();
  return !!row && row.count <= 10;
}
export async function limitedBody(request: Request, max: number) {
  if (!request.body) throw new Error('Missing request');
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; total += value.length; if (total > max) { await reader.cancel(); throw new Error('Request is too large.'); } chunks.push(value); }
  const body = new Uint8Array(total); let offset = 0; for (const c of chunks) { body.set(c, offset); offset += c.length; }
  return body;
}
