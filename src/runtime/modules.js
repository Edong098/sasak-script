import { realpath } from "node:fs/promises";
import {
  resolve,
  dirname,
  extname,
  relative,
  isAbsolute,
  sep,
} from "node:path";
import { readSource } from "./source.js";
import { parse } from "../parser/parser.js";
import { Interpreter } from "./interpreter.js";
import { SasakError } from "../errors/SasakError.js";

/** Satu cache per eksekusi utama; hanya modul .lu relatif, tanpa akses host JS. */
export class ModuleLoader {
  constructor({
    output,
    scheduler,
    budget,
    file = "<source>",
    moduleRoot,
  } = {}) {
    this.budget = budget;
    const root = resolve(moduleRoot ?? dirname(resolve(file)));
    this.root = root;
    this.output = output;
    this.scheduler = scheduler;
    this.cache = new Map();
  }
  async load(specifier, importer, location) {
    if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
      throw new SasakError(
        "Path modul harus relatif: ./ atau ../.",
        location,
        "ModuleError",
      );
    }
    if (extname(specifier) !== ".lu")
      throw new SasakError(
        "Modul harus menggunakan ekstensi .lu.",
        location,
        "ModuleError",
      );
    let file, source;
    try {
      file = await realpath(resolve(dirname(importer), specifier));
    } catch {
      throw new SasakError(
        `Modul ${specifier} tidak dapat dibaca.`,
        location,
        "ModuleError",
      );
    }
    let root;
    try {
      root = await realpath(this.root);
    } catch {
      throw new SasakError(
        "Folder modul tidak dapat dibaca.",
        location,
        "ModuleError",
      );
    }
    const path = relative(root, file);
    if (path === ".." || path.startsWith(`..${sep}`) || isAbsolute(path))
      throw new SasakError(
        "Modul berada di luar folder program.",
        location,
        "ModuleError",
      );
    const cached = this.cache.get(file);
    if (cached?.state === "loading")
      throw new SasakError(
        "Impor melingkar tidak didukung.",
        location,
        "ModuleError",
      );
    if (cached?.state === "ready") return cached.exports;
    this.budget.count("modules", location);
    this.cache.set(file, { state: "loading" });
    try {
      source = await readSource(file, this.budget, location);
      const interpreter = new Interpreter({
        output: this.output,
        loader: this,
        scheduler: this.scheduler,
        budget: this.budget,
        file,
      });
      await interpreter.run(parse(source, { file, budget: this.budget }));
      this.cache.set(file, { state: "ready", exports: interpreter.exports });
      return interpreter.exports;
    } catch (error) {
      this.cache.delete(file);
      if (error instanceof SasakError) throw error;
      if (error?.code)
        throw new SasakError(
          `Modul ${specifier} tidak dapat dibaca.`,
          location,
          "ModuleError",
        );
      throw error;
    }
  }
}
