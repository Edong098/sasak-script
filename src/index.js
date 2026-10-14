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

export async function run(source, options = {}) {
  return new Interpreter(options).run(parse(source, options));
}
