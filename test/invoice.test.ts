import test from 'node:test';
import assert from 'node:assert/strict';
import { invoiceEndpoint } from '../invoice.ts';

test('a £1,000 hammer price plus a 15% premium totals £1,150', () => {
  const response = invoiceEndpoint('POST', '/invoice', { hammerPence: 100000 });
  assert.equal(response.status, 200);
  assert.equal(response.body.totalPence, 115000);
});

test('rejects invalid hammer amounts', () => {
  for (const hammerPence of [-1, 0, 1.1, '100000', null, Number.MAX_SAFE_INTEGER]) {
    assert.equal(invoiceEndpoint('POST', '/invoice', { hammerPence }).status, 400);
  }
});

test('unknown routes return 404', () => {
  assert.equal(invoiceEndpoint('POST', '/missing', {}).status, 404);
});

test('invoice endpoint only accepts POST', () => {
  assert.equal(invoiceEndpoint('GET', '/invoice', {}).status, 405);
});
