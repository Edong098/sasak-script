import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenize } from '../src/lexer/lexer.js';
import { KEYWORDS } from '../src/lexer/tokens.js';
import { SasakError } from '../src/errors/SasakError.js';

test('token declaration, lokasi, operator dan komentar', () => {
  const t = tokenize('pengaq angka = 12.5 # komentar\ngitaq(angka >= 2)', { file: 'uji.lu' });
  assert.deepEqual(t.slice(0, 4).map(x => [x.type, x.value, x.line, x.column]), [
    ['pengaq', 'pengaq', 1, 1], ['IDENTIFIER', 'angka', 1, 8], ['=', '=', 1, 14], ['NUMBER', 12.5, 1, 16],
  ]);
  assert.equal(t[0].file, 'uji.lu');
  assert.equal(t.at(-1).type, 'EOF');
  assert.ok(t.some(x => x.type === '>='));
});
test('seluruh keyword resmi dicadangkan', () => {
  assert.deepEqual(tokenize([...KEYWORDS].join(' ')).slice(0, -2).map(x => x.type), [...KEYWORDS]);
});
test('nested indent, blank, comment, CRLF, EOF tanpa newline', () => {
  const t = tokenize('lamun (tetu):\r\n    # komentar\r\n    lamun (tetu):\r\n        gitaq(1)\r\n\r\n    gitaq(2)');
  assert.deepEqual(t.filter(x => ['INDENT', 'DEDENT'].includes(x.type)).map(x => x.type), ['INDENT', 'INDENT', 'DEDENT', 'DEDENT']);
});
test('string escape dan # di dalam string', () => {
  assert.equal(tokenize(String.raw`"a\n\t\r\\\"#"`)[0].value, 'a\n\t\r\\"#');
  assert.equal(tokenize("'Halo'")[0].value, 'Halo');
});
for (const source of ['@', '  gitaq(1)', '\tgitaq(1)', '"belum', '"\\q"', '1e3', 'lamun (tetu):\n        gitaq(1)']) {
  test(`lexer menolak ${JSON.stringify(source)}`, () => {
    assert.throws(() => tokenize(source), error => error instanceof SasakError && error.line >= 1 && error.column >= 1);
  });
}
