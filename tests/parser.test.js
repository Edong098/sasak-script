import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../src/parser/parser.js';

test('AST deklarasi, assignment, panggilan dan lokasi', () => {
  const ast = parse('pengaq a = 2\na = a + 1\ngitaq(a)', { file: 'program.lu' });
  assert.deepEqual(ast.body.map(n => n.type), ['Declaration', 'Assignment', 'ExpressionStatement']);
  assert.equal(ast.body[0].name, 'a');
  assert.equal(ast.body[1].target.name, 'a');
  assert.equal(ast.body[2].expression.callee.name, 'gitaq');
  assert.equal(ast.body[2].location.line, 3);
  assert.equal(ast.body[2].location.file, 'program.lu');
});
test('prioritas, asosiasi kiri, grouping, unary, call bersarang', () => {
  const value = parse('pengaq n = 10 - 3 - 2 * -4').body[0].value;
  assert.equal(value.operator, '-');
  assert.equal(value.left.operator, '-');
  assert.equal(value.right.operator, '*');
  assert.equal(value.right.right.type, 'Unary');
  const call = parse('gitaq(tambah((1 + 2) * 3, 4))').body[0].expression;
  assert.equal(call.args[0].args[0].operator, '*');
});
for (const source of ['pengaq = 2', 'pengaq a =', '1 = 2', 'gitaq(1', 'gitaq(1) gitaq(2)', '    gitaq(1)', 'lamun (tetu):\n    gitaq(1)']) {
  test(`parser melaporkan error: ${JSON.stringify(source)}`, () => {
    assert.throws(() => parse(source), e => e.name === 'SyntaxError' && e.line >= 1 && e.column >= 1);
  });
}
