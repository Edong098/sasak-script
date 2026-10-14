import { ModuleLoader } from './modules.js';
import { SasakClass, SasakInstance } from './objects.js';
import { Environment } from './environment.js';
import { BreakSignal, ReturnSignal, ThrowSignal } from './signals.js';
import { SasakError } from '../errors/SasakError.js';

export class Interpreter {
  constructor({ output = console.log, loader, file = '<source>' } = {}) {
    this.loader = loader ?? new ModuleLoader({ output });
    this.file = file; this.exports = new Map();
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
      case 'Import': {
        const exports = await this.loader.load(n.path, this.file, n.location);
        for (const name of exports.keys()) if (env.values.has(name)) this.fail(`Nama impor ${name} sudah dideklarasikan.`, n);
        for (const [name, value] of exports) env.define(name, value, n.location);
        return null;
      }
      case 'Export': {
        await this.execute(n.declaration, env);
        this.exports.set(n.declaration.name, env.get(n.declaration.name, n.location));
        return null;
      }
      case 'Throw': throw new ThrowSignal(await this.evaluate(n.value, env), n.location);
      case 'Try': {
        try { await this.executeBody(n.body, new Environment(env)); }
        catch (error) {
          if (!(error instanceof ThrowSignal) && !(error instanceof SasakError)) throw error;
          const handlerEnv = new Environment(env);
          handlerEnv.define(n.name, error instanceof ThrowSignal ? error.value : error.toString(), n.location);
          await this.executeBody(n.handler, handlerEnv);
        }
        return null;
      }
      case 'Class': {
        const parent = n.parent ? env.get(n.parent, n.location) : null;
        if (parent !== null && !(parent instanceof SasakClass)) this.fail('Induk bale harus class.', n);
        const klass = new SasakClass(n.name, parent);
        for (const method of n.methods) {
          const value = { kind: 'function', params: method.params, body: method.body, closure: env, owner: klass, isStatic: method.isStatic };
          if (method.name === 'sandiang') klass.constructorMethod = value;
          else (method.isStatic ? klass.staticMethods : klass.methods).set(method.name, value);
        }
        return env.define(n.name, klass, n.location);
      }
      case 'Function': return env.define(n.name, { kind: 'function', params: n.params, body: n.body, closure: env }, n.location);
      case 'Return': throw new ReturnSignal(await this.evaluate(n.value, env));
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
      case 'Assignment': {
        if (n.target.type === 'Identifier') return env.assign(n.target.name, await this.evaluate(n.value, env), n.location);
        const object = await this.evaluate(n.target.object, env);
        const key = await this.evaluate(n.target.property, env);
        const value = await this.evaluate(n.value, env);
        return this.setMember(object, key, value, n);
      }
      case 'ExpressionStatement': return this.evaluate(n.expression, env);
      default: this.fail(`Statement ${n.type} belum didukung.`, n);
    }
  }
  async evaluate(n, env) {
    switch (n.type) {
      case 'New': {
        const klass = await this.evaluate(n.klass, env);
        if (!(klass instanceof SasakClass)) this.fail('jariang membutuhkan class.', n);
        const args = [];
        for (const arg of n.args) args.push(await this.evaluate(arg, env));
        const instance = new SasakInstance(klass);
        const init = klass.initializer();
        if (init) await this.call({ ...init, receiver: instance }, args, n);
        else if (args.length) this.fail('Constructor default tidak menerima argumen.', n);
        return instance;
      }
      case 'Array': {
        const values = [];
        for (const element of n.elements) values.push(await this.evaluate(element, env));
        return values;
      }
      case 'Object': {
        const object = new Map();
        for (const entry of n.entries) object.set(entry.key, await this.evaluate(entry.value, env));
        return object;
      }
      case 'Member': return this.getMember(await this.evaluate(n.object, env), await this.evaluate(n.property, env), n);
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
  validateKey(object, key, n) {
    if (Array.isArray(object)) {
      if (!Number.isInteger(key) || key < 0 || key >= object.length) this.fail('Index array harus bilangan bulat dalam batas array.', n);
    } else if (object instanceof Map) {
      if (typeof key !== 'string') this.fail('Key object harus string.', n);
    } else this.fail('Nilai ini tidak memiliki index atau property.', n);
  }
  getMember(object, key, n) {
    if (object instanceof SasakInstance || object instanceof SasakClass || object?.kind === 'super') {
      if (typeof key !== 'string') this.fail('Nama property harus string.', n);
      const isSuper = object.kind === 'super';
      const receiver = isSuper ? object.receiver : object;
      const klass = isSuper ? object.parent : receiver instanceof SasakClass ? receiver : receiver.klass;
      if (!isSuper && receiver.fields.has(key)) return receiver.fields.get(key);
      const method = klass?.lookup(key, receiver instanceof SasakClass);
      if (!method) this.fail(`Property atau method ${key} tidak ditemukan.`, n);
      return { ...method, receiver };
    }
    this.validateKey(object, key, n);
    if (Array.isArray(object)) return object[key];
    if (!object.has(key)) this.fail(`Property ${key} tidak ditemukan.`, n);
    return object.get(key);
  }
  setMember(object, key, value, n) {
    if (object instanceof SasakInstance || object instanceof SasakClass) {
      if (typeof key !== 'string') this.fail('Nama property harus string.', n);
      object.fields.set(key, value); return value;
    }
    this.validateKey(object, key, n);
    if (Array.isArray(object)) object[key] = value;
    else object.set(key, value);
    return value;
  }
  async call(callee, args, n) {
    if (callee?.kind === 'super') {
      if (!(callee.receiver instanceof SasakInstance)) this.fail('lokaq() hanya untuk constructor instance.', n);
      const init = callee.parent?.initializer();
      if (!callee.parent) this.fail('Class ini tidak memiliki induk.', n);
      if (!init) { if (args.length) this.fail('Constructor induk tidak menerima argumen.', n); return null; }
      return this.call({ ...init, receiver: callee.receiver }, args, n);
    }
    if (!['builtin', 'function'].includes(callee?.kind)) this.fail('Nilai ini bukan fungsi.', n);
    const arity = callee.kind === 'builtin' ? callee.arity : callee.params.length;
    if (args.length !== arity) this.fail(`Fungsi membutuhkan ${arity} argumen.`, n);
    if (callee.kind === 'builtin') return callee.invoke(args);
    const local = new Environment(callee.closure);
    if (callee.receiver) {
      local.define('niki', callee.receiver, n.location);
      local.define('lokaq', { kind: 'super', parent: callee.owner.parent, receiver: callee.receiver }, n.location);
    }
    callee.params.forEach((param, i) => local.define(param, args[i], n.location));
    try { await this.executeBody(callee.body, local); }
    catch (error) { if (error instanceof ReturnSignal) return error.value; throw error; }
    return null;
  }
}
