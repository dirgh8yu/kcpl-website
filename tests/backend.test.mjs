import assert from 'node:assert/strict';
import test from 'node:test';
// Local Worker only: never run mutation tests against hosted customer data.
const origin = 'http://127.0.0.1:8787';
const staff = { 'oai-authenticated-user-id': 'local-test-staff', 'oai-authenticated-user-email': 'staff@example.test' };
function form(id = crypto.randomUUID()) { const f = new FormData(); for (const [k,v] of Object.entries({ Name:'Test enquiry',Email:'cargo@example.test',Origin:'Test origin',Destination:'Test destination','Service required':'project-cargo','Cargo / commodity':'Demonstration equipment',consent:'yes',requestId:id })) f.set(k,v); return f; }
function send(body, headers = {}) { return fetch(origin + '/api/enquiries', { method:'POST', headers:{ Origin:origin, ...headers }, body }); }
test('intake, access control, attachment delivery and optimistic follow-up', async () => {
  assert.equal((await fetch(origin + '/api/staff/enquiries')).status,403);
  assert.equal((await fetch(origin + '/api/staff/enquiries',{headers:{...staff,'oai-authenticated-user-email':'outsider@example.test'}})).status,403);
  assert.equal((await send(form(),{Origin:'https://unrelated.example'})).status,403);
  const invalid = form(); invalid.set('Email','invalid'); const invalidResponse = await send(invalid); assert.equal(invalidResponse.status,400,await invalidResponse.text());
  const missing = form(); missing.delete('consent'); assert.equal((await send(missing)).status,400);
  const badFile = form(); badFile.set('attachments',new Blob(['not a pdf'],{type:'application/pdf'}),'bad.pdf'); assert.equal((await send(badFile)).status,400);
  const id = crypto.randomUUID(); const f = form(id); const bytes = '%PDF-1.4\n% Local test fixture, not a customer document'; f.set('attachments',new Blob([bytes],{type:'application/pdf'}),'fixture.pdf');
  const receipt = await send(f); assert.equal(receipt.status,201); const saved = await receipt.json(); assert.match(saved.reference,/^KCPL-/);
  const repeated = await send(f); assert.equal(repeated.status,200); assert.equal((await repeated.json()).reference,saved.reference);
  const conflict = form(id); conflict.set('Name','Changed'); assert.equal((await send(conflict)).status,409);
  const endpoint = origin + '/api/staff/enquiries/' + id;
  const detailResponse = await fetch(endpoint,{headers:staff}); assert.equal(detailResponse.headers.get('cache-control'),'no-store'); const detail = await detailResponse.json(); assert.equal(detail.files.length,1);
  const download = origin + '/api/staff/files/' + detail.files[0].id; assert.equal((await fetch(download)).status,403); const file = await fetch(download,{headers:staff}); assert.equal(await file.text(),bytes); assert.match(file.headers.get('content-disposition'),/^attachment/);
  const patch = () => fetch(endpoint,{method:'PATCH',headers:{...staff,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({status:'reviewing',version:1,note:'Local test note'})});
  assert.equal((await patch()).status,200); assert.equal((await patch()).status,409);
  const updated = await (await fetch(endpoint,{headers:staff})).json(); assert.equal(updated.item.status,'reviewing'); assert.equal(updated.events.length,1);
  for (let i=0;i<4;i++) await send(form()); assert.equal((await send(form())).status,429);
});
