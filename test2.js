import assert from 'node:assert';
import test from 'node:test'

test('simple test', async (t) => {
  assert.deepStrictEqual({a: 1}, {a: '1', b: 2}, 'not deepEqual');
});

