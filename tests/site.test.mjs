import test, { before, after } from 'node:test';
import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import assert from 'node:assert/strict';

const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3100';
let server;
before(async () => {
  if (process.env.TEST_BASE_URL) return;
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3100'], { stdio: 'ignore' });
  for (let attempt = 0; attempt < 30; attempt++) {
    try { if ((await fetch(origin)).ok) return; } catch {}
    await setTimeout(200);
  }
  throw new Error('Production server did not start; run npm run build first.');
});
after(() => server?.kill('SIGTERM'));
const paths = ['/', '/services', '/project-cargo', '/about', '/network', '/contact', '/privacy'];
const documents = new Map();
for (const path of paths) {
  test(`Public page ${path} has a valid response and semantic identity`, async () => {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    documents.set(path, html);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /name="description" content="[^"]+"/);
    assert.match(html, /<main id="main"/);
  });
}

test('Internal navigation and service fragments resolve', async () => {
  for (const path of paths) {
    const html = documents.get(path) || await (await fetch(origin + path)).text();
    for (const match of html.matchAll(/href="(\/[^"]*|#[^"]+)"/g)) {
      const target = new URL(match[1].replaceAll('&amp;', '&'), origin + path);
      // Public document links, excluding framework preloads and generated metadata assets.
      if (!paths.includes(target.pathname)) continue;
      const targetHtml = documents.get(target.pathname) || await (await fetch(target)).text();
      if (target.hash) assert.ok(targetHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `Missing ${target.pathname}${target.hash}`);
    }
  }
});

test('Unhydrated enquiry controls cannot leak details through native GET submission', async () => {
  const html = await (await fetch(origin + '/contact?service=project-cargo')).text();
  assert.equal((html.match(/<fieldset disabled=""/g) || []).length, 3);
  assert.match(html, /<button type="submit"[^>]*disabled=""/);
  assert.match(html, /<noscript>.*mailto:/s);
  assert.match(html, /For project cargo/);
});

test('Review metadata and robots discourage indexing', async () => {
  if (process.env.SITE_INDEXABLE === 'true') return;
  const html = documents.get('/') || await (await fetch(origin)).text();
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  const robots = await (await fetch(origin + '/robots.txt')).text();
  assert.match(robots, /Disallow: \//);
  assert.equal((await fetch(origin + '/sitemap.xml')).status, 200);
});
