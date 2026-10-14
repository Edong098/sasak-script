/** Nilai OOP milik runtime Sasak, terpisah dari object host JavaScript. */
export class SasakClass {
  constructor(name, parent = null) {
    this.kind = "class";
    this.name = name;
    this.parent = parent;
    this.methods = new Map();
    this.staticMethods = new Map();
    this.fields = new Map();
    this.constructorMethod = null;
  }
  lookup(name, isStatic = false) {
    for (let klass = this; klass; klass = klass.parent) {
      const method = (isStatic ? klass.staticMethods : klass.methods).get(name);
      if (method) return method;
    }
    return undefined;
  }
  initializer() {
    for (let klass = this; klass; klass = klass.parent) {
      if (klass.constructorMethod) return klass.constructorMethod;
    }
    return null;
  }
}
export class SasakInstance {
  constructor(klass) {
    this.kind = "instance";
    this.klass = klass;
    this.fields = new Map();
  }
}
