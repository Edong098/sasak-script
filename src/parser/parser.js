import { node } from '../ast/nodes.js';
import { tokenize } from '../lexer/lexer.js';
import { SasakError } from '../errors/SasakError.js';

const PRECEDENCE = { atau: 1, dan: 2, '==': 3, '!=': 3, '>': 4, '<': 4, '>=': 4, '<=': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6 };
export class Parser {
  constructor(tokens) { this.tokens = tokens; this.current = 0; this.loopDepth = 0; }
  peek() { return this.tokens[this.current]; }
  at(type) { return this.peek().type === type; }
  take() { return this.tokens[this.current++]; }
  match(type) { if (this.at(type)) return this.take(); return null; }
  error(message, token = this.peek()) { throw new SasakError(message, token); }
  expect(type) { if (!this.at(type)) this.error(`Diharapkan ${type}, ditemukan ${this.peek().type}.`); return this.take(); }
  parse() {
    const start = this.peek();
    const body = [];
    while (!this.at('EOF')) body.push(this.statement());
    return node('Program', start, { body });
  }
  end() {
    if (!this.match('NEWLINE') && !this.at('EOF') && !this.at('DEDENT')) this.error('Statement harus diakhiri baris baru.');
  }
  statement() {
    const start = this.peek();
    let result;
    if (this.match('semasih')) {
      this.expect('('); const condition = this.expression(); this.expect(')');
      this.loopDepth++;
      const body = this.block();
      this.loopDepth--;
      return node('While', start, { condition, body });
    }
    if (this.match('mengenteng')) {
      if (!this.loopDepth) this.error('mengenteng hanya boleh digunakan di dalam loop.', start);
      this.end(); return node('Break', start);
    }
    if (this.match('lamun')) {
      this.expect('('); const condition = this.expression(); this.expect(')');
      const consequent = this.block();
      const alternate = this.match('deq') ? this.block() : [];
      return node('If', start, { condition, consequent, alternate });
    }
    if (this.match('pengaq')) {
      const name = this.expect('IDENTIFIER').value;
      this.expect('=');
      result = node('Declaration', start, { name, value: this.expression() });
    } else {
      const expression = this.expression();
      if (this.match('=')) {
        if (expression.type !== 'Identifier') this.error('Target assignment harus variabel.', start);
        result = node('Assignment', start, { target: expression, value: this.expression() });
      } else result = node('ExpressionStatement', start, { expression });
    }
    this.end();
    return result;
  }
  block() {
    this.expect(':'); this.expect('NEWLINE'); this.expect('INDENT');
    const body = [];
    while (!this.at('DEDENT') && !this.at('EOF')) body.push(this.statement());
    this.expect('DEDENT');
    return body;
  }
  expression(min = 0) {
    let left = this.unary();
    while (Object.hasOwn(PRECEDENCE, this.peek().type) && PRECEDENCE[this.peek().type] >= min) {
      const op = this.take();
      const right = this.expression(PRECEDENCE[op.type] + 1);
      left = node('Binary', op, { operator: op.type, left, right });
    }
    return left;
  }
  unary() {
    if (['-', '+', 'bukan'].includes(this.peek().type)) {
      const op = this.take();
      return node('Unary', op, { operator: op.type, argument: this.unary() });
    }
    return this.postfix();
  }
  postfix() {
    let expr = this.primary();
    while (this.match('(')) {
      const args = [];
      if (!this.at(')')) {
        do { args.push(this.expression()); } while (this.match(','));
      }
      this.expect(')');
      expr = node('Call', expr.location, { callee: expr, args });
    }
    return expr;
  }
  primary() {
    const token = this.take();
    if (['tetu', 'salaq', 'deq_araq'].includes(token.type)) return node('Literal', token, { value: { tetu: true, salaq: false, deq_araq: null }[token.type] });
    if (['NUMBER', 'STRING'].includes(token.type)) return node('Literal', token, { value: token.value });
    if (['IDENTIFIER', 'gitaq'].includes(token.type)) return node('Identifier', token, { name: token.value });
    if (token.type === '(') { const expr = this.expression(); this.expect(')'); return expr; }
    this.error(`Ekspresi tidak valid: ${token.type}.`, token);
  }
}
export const parse = (source, options) => new Parser(tokenize(source, options)).parse();
