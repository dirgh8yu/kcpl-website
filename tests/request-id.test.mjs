import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
test('submission IDs work when randomUUID is unavailable in a browser context', () => {
  const source = readFileSync(new URL('../lib/request-id.ts', import.meta.url), 'utf8').replace('export function', 'function');
  const create = runInNewContext(source + '\ncreateRequestId', { crypto: { getRandomValues: array => crypto.getRandomValues(array) }, Uint8Array });
  const ids = new Set(Array.from({ length: 100 }, () => create()));
  assert.equal(ids.size, 100);
  for (const id of ids) assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
