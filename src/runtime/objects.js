/** Nilai OOP milik runtime Sasak, terpisah dari object host JavaScript. */
export class SasakClass {
  constructor(name, parent = null) {
    this.kind = 'class'; this.name = name; this.parent = parent;
    this.methods = new Map(); this.staticMethods = new Map(); this.fields = new Map();
    this.constructorMethod = null;
  }
  lookup(name, isStatic = false) {
    return (isStatic ? this.staticMethods : this.methods).get(name) ?? this.parent?.lookup(name, isStatic);
  }
  initializer() { return this.constructorMethod ?? this.parent?.initializer() ?? null; }
}
export class SasakInstance {
  constructor(klass) { this.kind = 'instance'; this.klass = klass; this.fields = new Map(); }
}
