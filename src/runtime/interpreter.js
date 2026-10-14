import { ExecutionBudget } from "./budget.js";
import { AsyncScheduler, SasakPromise } from "./async.js";
import { ModuleLoader } from "./modules.js";
import { SasakClass, SasakInstance } from "./objects.js";
import { Environment } from "./environment.js";
import {
  BreakSignal,
  ContinueSignal,
  ReturnSignal,
  ThrowSignal,
} from "./signals.js";
import { SasakError } from "../errors/SasakError.js";

// Tabel operator dibuat sekali, bukan di setiap evaluasi ekspresi.
const ARITHMETIC = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
};
const COMPARISONS = {
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,
  ">=": (a, b) => a >= b,
  "<=": (a, b) => a <= b,
};

export class Interpreter {
  constructor({
    output = console.log,
    loader,
    scheduler,
    budget,
    limits,
    moduleRoot,
    file = "<source>",
  } = {}) {
    this.budget = budget ?? new ExecutionBudget(limits);
    this.scheduler = scheduler ?? new AsyncScheduler(this.budget);
    this.loader =
      loader ??
      new ModuleLoader({
        output,
        scheduler: this.scheduler,
        budget: this.budget,
        file,
        moduleRoot,
      });
    this.file = file;
    this.exports = new Map();
    this.global = new Environment();
    this.global.define("gitaq", {
      kind: "builtin",
      arity: 1,
      invoke: (args, n) => {
        const text = this.display(args[0], n);
        this.budget.output(text, n.location);
        output(text);
        return null;
      },
    });
  }
  fail(message, n) {
    throw new SasakError(message, n.location, "RuntimeError");
  }
  display(value, n = { location: {} }) {
    if (value instanceof SasakPromise)
      this.fail("Gunakan anti untuk membaca hasil fungsi liwatin.", n);
    if (Array.isArray(value)) return this.displayArray(value, n);
    if (value === null) return "deq_araq";
    if (value === true) return "tetu";
    if (value === false) return "salaq";
    return String(value);
  }
  displayArray(array, n, seen = new Set(), depth = 0) {
    if (seen.has(array)) return "";
    if (depth >= this.budget.limits.evalDepth)
      this.budget.abort("Batas kedalaman output terlampaui.", n.location);
    seen.add(array);
    try {
      let text = "";
      for (let i = 0; i < array.length; i++) {
        this.budget.tick(n.location);
        const item = array[i];
        const part = Array.isArray(item)
          ? this.displayArray(item, n, seen, depth + 1)
          : item === null
            ? ""
            : this.display(item, n);
        if (
          text.length + part.length + (i ? 1 : 0) >
          this.budget.limits.stringLength
        )
          this.budget.abort("Batas panjang output terlampaui.", n.location);
        text += (i ? "," : "") + part;
      }
      return text;
    } finally {
      seen.delete(array);
    }
  }
  functionValue(definition, closure, extra = {}) {
    return {
      kind: "function",
      params: definition.params,
      body: definition.body,
      isAsync: definition.isAsync,
      closure,
      ...extra,
    };
  }
  async evaluateList(expressions, env) {
    const values = [];
    for (const expression of expressions)
      values.push(await this.evaluate(expression, env));
    return values;
  }
  boolean(value, n) {
    if (typeof value !== "boolean")
      this.fail("Kondisi dan logika membutuhkan tetu atau salaq.", n);
    return value;
  }
  number(value, n) {
    if (typeof value !== "number")
      this.fail("Operator ini membutuhkan angka.", n);
    return value;
  }
  async run(program) {
    await this.executeBody(program.body, this.global);
    return this.global;
  }
  async executeBody(body, env) {
    for (const statement of body) await this.execute(statement, env);
  }
  async execute(n, env) {
    this.budget.tick(n.location);
    switch (n.type) {
      case "Import": {
        const exports = await this.loader.load(n.path, this.file, n.location);
        for (const name of exports.keys())
          if (env.values.has(name))
            this.fail(`Nama impor ${name} sudah dideklarasikan.`, n);
        for (const [name, value] of exports)
          env.define(name, value, n.location);
        return null;
      }
      case "Export": {
        await this.execute(n.declaration, env);
        this.exports.set(
          n.declaration.name,
          env.get(n.declaration.name, n.location),
        );
        return null;
      }
      case "Throw":
        throw new ThrowSignal(await this.evaluate(n.value, env), n.location);
      case "Try": {
        try {
          await this.executeBody(n.body, new Environment(env));
        } catch (error) {
          if (error.fatal) throw error;
          if (!(error instanceof ThrowSignal) && !(error instanceof SasakError))
            throw error;
          const handlerEnv = new Environment(env);
          handlerEnv.define(
            n.name,
            error instanceof ThrowSignal ? error.value : error.toString(),
            n.location,
          );
          await this.executeBody(n.handler, handlerEnv);
        }
        return null;
      }
      case "Class": {
        const parent = n.parent ? env.get(n.parent, n.location) : null;
        if (n.parent && !(parent instanceof SasakClass))
          this.fail("Induk bale harus class.", n);
        const klass = new SasakClass(n.name, parent);
        for (const method of n.methods) {
          const value = this.functionValue(method, env, { owner: klass });
          if (method.name === "sandiang")
            klass.constructorMethod = { ...value, isConstructor: true };
          else
            (method.isStatic ? klass.staticMethods : klass.methods).set(
              method.name,
              value,
            );
        }
        return env.define(n.name, klass, n.location);
      }
      case "Function":
        return env.define(n.name, this.functionValue(n, env), n.location);
      case "Return":
        throw new ReturnSignal(await this.evaluate(n.value, env));
      case "Break":
        throw new BreakSignal();
      case "Continue":
        throw new ContinueSignal();
      case "For": {
        const loopEnv = new Environment(env);
        await this.execute(n.initializer, loopEnv);
        while (this.boolean(await this.evaluate(n.condition, loopEnv), n)) {
          if (!(await this.executeIteration(n.body, new Environment(loopEnv))))
            break;
          await this.execute(n.update, loopEnv);
        }
        return null;
      }
      case "While": {
        while (this.boolean(await this.evaluate(n.condition, env), n)) {
          if (!(await this.executeIteration(n.body, new Environment(env))))
            break;
        }
        return null;
      }
      case "If": {
        const condition = this.boolean(
          await this.evaluate(n.condition, env),
          n,
        );
        return this.executeBody(
          condition ? n.consequent : n.alternate,
          new Environment(env),
        );
      }
      case "Declaration":
        return env.define(
          n.name,
          await this.evaluate(n.value, env),
          n.location,
        );
      case "Assignment": {
        if (n.target.type === "Identifier")
          return env.assign(
            n.target.name,
            await this.evaluate(n.value, env),
            n.location,
          );
        const object = await this.evaluate(n.target.object, env);
        const key = await this.evaluate(n.target.property, env);
        const value = await this.evaluate(n.value, env);
        return this.setMember(object, key, value, n);
      }
      case "ExpressionStatement":
        return this.evaluate(n.expression, env);
      default:
        this.fail(`Statement ${n.type} belum didukung.`, n);
    }
  }
  async executeIteration(body, env) {
    try {
      await this.executeBody(body, env);
    } catch (error) {
      if (error instanceof BreakSignal) return false;
      if (!(error instanceof ContinueSignal)) throw error;
    }
    return true;
  }
  async evaluate(n, env) {
    this.budget.tick(n.location);
    if (++this.budget.evaluations > this.budget.limits.evalDepth)
      this.budget.abort("Batas kedalaman evaluasi terlampaui.", n.location);
    try {
      return await this.evaluateNode(n, env);
    } finally {
      this.budget.evaluations--;
    }
  }
  async evaluateNode(n, env) {
    switch (n.type) {
      case "Await": {
        const value = await this.evaluate(n.argument, env);
        if (!(value instanceof SasakPromise))
          this.fail("anti membutuhkan hasil fungsi liwatin.", n);
        return value.unwrap(this.budget, n.location);
      }
      case "New": {
        const klass = await this.evaluate(n.klass, env);
        if (!(klass instanceof SasakClass))
          this.fail("jariang membutuhkan class.", n);
        const args = await this.evaluateList(n.args, env);
        const instance = new SasakInstance(klass);
        const init = klass.initializer();
        if (init) await this.call({ ...init, receiver: instance }, args, n);
        else if (args.length)
          this.fail("Constructor default tidak menerima argumen.", n);
        return instance;
      }
      case "Array":
        return this.evaluateList(n.elements, env);
      case "Object": {
        const object = new Map();
        for (const entry of n.entries)
          object.set(entry.key, await this.evaluate(entry.value, env));
        return object;
      }
      case "Member":
        return this.getMember(
          await this.evaluate(n.object, env),
          await this.evaluate(n.property, env),
          n,
        );
      case "Literal":
        return n.value;
      case "Identifier":
        return env.get(n.name, n.location);
      case "Unary": {
        const raw = await this.evaluate(n.argument, env);
        if (n.operator === "bukan") return !this.boolean(raw, n);
        const value = this.number(raw, n);
        return n.operator === "-" ? -value : value;
      }
      case "Binary": {
        const left = await this.evaluate(n.left, env);
        if (n.operator === "dan" || n.operator === "atau") {
          this.boolean(left, n);
          if (n.operator === "dan" && !left) return false;
          if (n.operator === "atau" && left) return true;
          return this.boolean(await this.evaluate(n.right, env), n);
        }
        const right = await this.evaluate(n.right, env);
        if (n.operator === "==") return left === right;
        if (n.operator === "!=") return left !== right;
        if (Object.hasOwn(COMPARISONS, n.operator)) {
          if (
            typeof left !== typeof right ||
            !["number", "string"].includes(typeof left)
          )
            this.fail("Perbandingan membutuhkan dua angka atau dua string.", n);
          return COMPARISONS[n.operator](left, right);
        }
        if (
          n.operator === "+" &&
          typeof left === "string" &&
          typeof right === "string"
        ) {
          if (left.length + right.length > this.budget.limits.stringLength)
            this.budget.abort("Batas panjang string terlampaui.", n.location);
          return left + right;
        }
        this.number(left, n);
        this.number(right, n);
        if (["/", "%"].includes(n.operator) && right === 0)
          this.fail("Pembagian dengan nol tidak diperbolehkan.", n);
        const value = ARITHMETIC[n.operator](left, right);
        if (!Number.isFinite(value))
          this.fail("Hasil angka tidak berhingga.", n);
        return value;
      }
      case "Call": {
        const callee = await this.evaluate(n.callee, env);
        const args = await this.evaluateList(n.args, env);
        return this.call(callee, args, n);
      }
      default:
        this.fail(`Ekspresi ${n.type} belum didukung.`, n);
    }
  }
  validateKey(object, key, n) {
    if (Array.isArray(object)) {
      if (!Number.isInteger(key) || key < 0 || key >= object.length)
        this.fail("Index array harus bilangan bulat dalam batas array.", n);
    } else if (object instanceof Map) {
      if (typeof key !== "string") this.fail("Key object harus string.", n);
    } else this.fail("Nilai ini tidak memiliki index atau property.", n);
  }
  getMember(object, key, n) {
    if (
      object instanceof SasakInstance ||
      object instanceof SasakClass ||
      object?.kind === "super"
    ) {
      if (typeof key !== "string") this.fail("Nama property harus string.", n);
      const isSuper = object.kind === "super";
      const receiver = isSuper ? object.receiver : object;
      const klass = isSuper
        ? object.parent
        : receiver instanceof SasakClass
          ? receiver
          : receiver.klass;
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
      if (typeof key !== "string") this.fail("Nama property harus string.", n);
      object.fields.set(key, value);
      return value;
    }
    this.validateKey(object, key, n);
    if (Array.isArray(object)) object[key] = value;
    else object.set(key, value);
    return value;
  }
  async call(callee, args, n) {
    if (callee?.kind === "super") {
      if (!callee.canConstruct || !(callee.receiver instanceof SasakInstance))
        this.fail("lokaq() hanya untuk constructor instance.", n);
      const init = callee.parent?.initializer();
      if (!callee.parent) this.fail("Class ini tidak memiliki induk.", n);
      if (!init) {
        if (args.length)
          this.fail("Constructor induk tidak menerima argumen.", n);
        return null;
      }
      return this.call({ ...init, receiver: callee.receiver }, args, n);
    }
    if (!["builtin", "function"].includes(callee?.kind))
      this.fail("Nilai ini bukan fungsi.", n);
    const arity =
      callee.kind === "builtin" ? callee.arity : callee.params.length;
    if (args.length !== arity)
      this.fail(`Fungsi membutuhkan ${arity} argumen.`, n);
    if (callee.kind === "builtin") return callee.invoke(args, n);
    if (callee.isAsync)
      return this.scheduler.start(
        () => this.invokeFunction(callee, args, n),
        n.location,
      );
    return this.invokeFunction(callee, args, n);
  }
  async invokeFunction(callee, args, n) {
    this.budget.check(n.location);
    this.budget.calls++;
    if (this.budget.calls > this.budget.limits.callDepth)
      this.budget.abort("Batas kedalaman pemanggilan terlampaui.", n.location);
    try {
      return await this.executeFunction(callee, args, n);
    } finally {
      this.budget.calls--;
    }
  }
  async executeFunction(callee, args, n) {
    const local = new Environment(callee.closure);
    if (callee.receiver) {
      local.define("niki", callee.receiver, n.location);
      local.define(
        "lokaq",
        {
          kind: "super",
          parent: callee.owner.parent,
          receiver: callee.receiver,
          canConstruct: Boolean(callee.isConstructor),
        },
        n.location,
      );
    }
    callee.params.forEach((param, i) =>
      local.define(param, args[i], n.location),
    );
    try {
      await this.executeBody(callee.body, local);
    } catch (error) {
      if (error instanceof ReturnSignal) {
        return callee.isAsync && error.value instanceof SasakPromise
          ? error.value.unwrap(this.budget, n.location)
          : error.value;
      }
      throw error;
    }
    return null;
  }
}
