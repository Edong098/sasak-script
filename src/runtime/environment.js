import { SasakError } from '../errors/SasakError.js';

/** Scope lexical: Map menghindari benturan nama dengan properti JavaScript. */
export class Environment {
  constructor(parent = null) { this.parent = parent; this.values = new Map(); }
  define(name, value, location) {
    if (this.values.has(name)) throw new SasakError(`Nama ${name} sudah dideklarasikan di scope ini.`, location, 'RuntimeError');
    this.values.set(name, value);
    return value;
  }
  owner(name, location) {
    if (this.values.has(name)) return this;
    if (this.parent) return this.parent.owner(name, location);
    throw new SasakError(`Variabel ${name} belum dideklarasikan.`, location, 'RuntimeError');
  }
  get(name, location) { return this.owner(name, location).values.get(name); }
  assign(name, value, location) { this.owner(name, location).values.set(name, value); return value; }
}
