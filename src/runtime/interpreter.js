import { Environment } from './environment.js';
import { BreakSignal } from './signals.js';
import { SasakError } from '../errors/SasakError.js';

export class Interpreter {
  constructor({ output = console.log } = {}) {
    this.global = new Environment();
    this.global.define('gitaq', { kind: 'builtin', arity: 1, invoke: args => { output(this.display(args[0])); return null; } });
  }
  fail(message, n) { throw new SasakError(message, n.location, 'RuntimeError'); }
  display(value) { return value === null ? 'deq_araq' : value === true ? 'tetu' : value === false ? 'salaq' : String(value); }
  boolean(value, n) { if (typeof value !== 'boolean') this.fail('Kondisi dan logika membutuhkan tetu atau salaq.', n); return value; }
  number(value, n) { if (typeof value !== 'number') this.fail('Operator ini membutuhkan angka.', n); return value; }
  async run(program) { await this.executeBody(program.body, this.global); return this.global; }
  async executeBody(body, env) { for (const statement of body) await this.execute(statement, env); }
  async execute(n, env) {
    switch (n.type) {
      case 'Break': throw new BreakSignal();
      case 'While': {
        while (this.boolean(await this.evaluate(n.condition, env), n)) {
          try { await this.executeBody(n.body, new Environment(env)); }
          catch (error) { if (error instanceof BreakSignal) break; throw error; }
        }
        return null;
      }
      case 'If': {
        const condition = this.boolean(await this.evaluate(n.condition, env), n);
        return this.executeBody(condition ? n.consequent : n.alternate, new Environment(env));
      }
      case 'Declaration': return env.define(n.name, await this.evaluate(n.value, env), n.location);
      case 'Assignment': return env.assign(n.target.name, await this.evaluate(n.value, env), n.location);
      case 'ExpressionStatement': return this.evaluate(n.expression, env);
      default: this.fail(`Statement ${n.type} belum didukung.`, n);
    }
  }
  async evaluate(n, env) {
    switch (n.type) {
      case 'Literal': return n.value;
      case 'Identifier': return env.get(n.name, n.location);
      case 'Unary': {
        const raw = await this.evaluate(n.argument, env);
        if (n.operator === 'bukan') return !this.boolean(raw, n);
        const value = this.number(raw, n);
        return n.operator === '-' ? -value : value;
      }
      case 'Binary': {
        const left = await this.evaluate(n.left, env);
        if (n.operator === 'dan' || n.operator === 'atau') {
          this.boolean(left, n);
          if (n.operator === 'dan' && !left) return false;
          if (n.operator === 'atau' && left) return true;
          return this.boolean(await this.evaluate(n.right, env), n);
        }
        const right = await this.evaluate(n.right, env);
        if (n.operator === '==') return left === right;
        if (n.operator === '!=') return left !== right;
        if (['>', '<', '>=', '<='].includes(n.operator)) {
          if (typeof left !== typeof right || !['number', 'string'].includes(typeof left)) this.fail('Perbandingan membutuhkan dua angka atau dua string.', n);
          return { '>': () => left > right, '<': () => left < right, '>=': () => left >= right, '<=': () => left <= right }[n.operator]();
        }
        if (n.operator === '+' && typeof left === 'string' && typeof right === 'string') return left + right;
        this.number(left, n); this.number(right, n);
        if (['/', '%'].includes(n.operator) && right === 0) this.fail('Pembagian dengan nol tidak diperbolehkan.', n);
        const value = { '+': () => left + right, '-': () => left - right, '*': () => left * right, '/': () => left / right, '%': () => left % right }[n.operator]();
        if (!Number.isFinite(value)) this.fail('Hasil angka tidak berhingga.', n);
        return value;
      }
      case 'Call': {
        const callee = await this.evaluate(n.callee, env);
        const args = [];
        for (const arg of n.args) args.push(await this.evaluate(arg, env));
        return this.call(callee, args, n);
      }
      default: this.fail(`Ekspresi ${n.type} belum didukung.`, n);
    }
  }
  async call(callee, args, n) {
    if (callee?.kind !== 'builtin') this.fail('Nilai ini bukan fungsi.', n);
    if (args.length !== callee.arity) this.fail(`Fungsi membutuhkan ${callee.arity} argumen.`, n);
    return callee.invoke(args);
  }
}
