import { SasakError } from "../errors/SasakError.js";

export const DEFAULT_LIMITS = Object.freeze({
  sourceBytes: 262144,
  tokens: 50000,
  parseDepth: 128,
  steps: 100000,
  durationMs: 2000,
  callDepth: 128,
  evalDepth: 256,
  modules: 64,
  tasks: 1024,
  stringLength: 1048576,
  outputBytes: 1048576,
});

/** Satu budget bersama; module/async/catch tidak dapat mereset batas program. */
export class ExecutionBudget {
  constructor(limits = {}) {
    this.limits = { ...DEFAULT_LIMITS };
    for (const [name, value] of Object.entries(limits)) {
      if (
        !Object.hasOwn(DEFAULT_LIMITS, name) ||
        !Number.isSafeInteger(value) ||
        value < 1
      )
        throw new TypeError(
          `Batas ${name} harus berupa integer positif yang dikenal.`,
        );
      this.limits[name] = value;
    }
    this.started = performance.now();
    this.steps = 0;
    this.tokens = 0;
    this.evaluations = 0;
    this.calls = 0;
    this.modules = 0;
    this.tasks = 0;
    this.outputBytes = 0;
    this.aborted = null;
  }
  abort(message, location) {
    this.aborted ??= new SasakError(message, location, "LimitError");
    this.aborted.fatal = true;
    throw this.aborted;
  }
  check(location) {
    if (this.aborted) throw this.aborted;
    if (performance.now() - this.started > this.limits.durationMs)
      this.abort("Batas waktu eksekusi terlampaui.", location);
  }
  tick(location) {
    this.check(location);
    if (++this.steps > this.limits.steps)
      this.abort("Batas langkah eksekusi terlampaui.", location);
  }
  count(name, location) {
    this.check(location);
    if (++this[name] > this.limits[name])
      this.abort(`Batas ${name} terlampaui.`, location);
  }
  source(source, location) {
    this.check(location);
    if (Buffer.byteLength(source, "utf8") > this.limits.sourceBytes)
      this.abort("File source melebihi batas ukuran.", location);
  }
  async wait(promise, location) {
    this.check(location);
    let timer;
    const timeout = new Promise((_, reject) => {
      const remaining = Math.max(
        1,
        this.limits.durationMs - (performance.now() - this.started),
      );
      timer = setTimeout(() => {
        try {
          this.abort("Batas waktu eksekusi terlampaui.", location);
        } catch (error) {
          reject(error);
        }
      }, remaining);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }
  output(text, location) {
    this.check(location);
    this.outputBytes += Buffer.byteLength(text, "utf8") + 1;
    if (this.outputBytes > this.limits.outputBytes)
      this.abort("Batas output terlampaui.", location);
  }
}
