/** Metadata proyek; belum menyediakan API interpreter. */
export const project = Object.freeze({
  name: 'Sasak Script',
  dialect: 'Lotura',
  extension: '.lu',
  command: 'sasak',
});

export { tokenize } from './lexer/lexer.js';
export { parse } from './parser/parser.js';
export { SasakError } from './errors/SasakError.js';
export { Interpreter } from './runtime/interpreter.js';
import { parse } from './parser/parser.js';
import { Interpreter } from './runtime/interpreter.js';

import { ThrowSignal } from './runtime/signals.js';
import { SasakError } from './errors/SasakError.js';
import { realpath } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function run(source, options = {}) {
  const interpreter = new Interpreter(options);
  let entry;
  if (options.file) {
    entry = await realpath(options.file).catch(() => resolve(options.file));
    interpreter.file = entry;
    interpreter.loader.cache.set(entry, { state: 'loading' });
  }
  try {
    const env = await interpreter.run(parse(source, options));
    if (entry) interpreter.loader.cache.set(entry, { state: 'ready', exports: interpreter.exports });
    return env;
  } catch (error) {
    if (entry) interpreter.loader.cache.delete(entry);
    if (error instanceof ThrowSignal) throw new SasakError(`Error tidak ditangkap: ${interpreter.display(error.value)}`, error.location, 'UncaughtError');
    throw error;
  }
}
