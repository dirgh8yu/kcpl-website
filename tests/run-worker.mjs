import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
const origin = 'http://127.0.0.1:8787';
const server = spawn(process.execPath, ['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--local','--persist-to','.wrangler/state','--ip','127.0.0.1','--port','8787','--inspector-port','0','--var',`SITE_ORIGIN:${origin}`,'--var','STAFF_EMAILS:staff@example.test','--var',`RATE_LIMIT_SECRET:${crypto.randomUUID()}`], { stdio:['ignore','pipe','pipe'] });
let logs = ''; server.stdout.on('data',d => { logs += d; }); server.stderr.on('data',d => { logs += d; });
try {
  let ready = false;
  for(let i=0;i<100;i++) { try { if ((await fetch(origin)).ok) { ready=true; break; } } catch {} await setTimeout(200); }
  if (!ready) throw new Error('Worker did not start: '+logs.slice(-3000));
  const child = spawn(process.execPath,['--test','tests/backend.test.mjs','tests/site.test.mjs'], { env:{...process.env,TEST_BASE_URL:origin},stdio:'inherit' });
  process.exitCode = await new Promise(resolve => child.on('exit',resolve));
  if (process.exitCode) console.error(logs.slice(-4000));
} finally { server.kill('SIGTERM'); }
