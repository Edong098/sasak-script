import { KEYWORDS, TOKEN } from "./tokens.js";
import { ExecutionBudget } from "../runtime/budget.js";
import { SasakError } from "../errors/SasakError.js";

/** Lexer berbasis baris: indentasi empat spasi, lokasi satu-based. */
export class Lexer {
  constructor(source, { file = "<source>", budget, limits } = {}) {
    this.budget = budget ?? new ExecutionBudget(limits);
    this.source = source;
    this.file = file;
  }
  tokenize() {
    this.budget.source(this.source, { file: this.file });
    const lines = this.source.replace(/\r\n/g, "\n").split("\n");
    const tokens = [];
    let depth = 0;
    const emit = (type, value, line, column) => {
      const location = { line, column, file: this.file };
      this.budget.count("tokens", location);
      tokens.push({ type, value, ...location });
    };
    const fail = (message, line, column) => {
      throw new SasakError(message, { line, column, file: this.file });
    };
    for (let row = 0; row < lines.length; row++) {
      const text = lines[row];
      const line = row + 1;
      let i = 0;
      while (text[i] === " ") i++;
      if (text[i] === "\t")
        fail("Gunakan empat spasi, bukan tab, untuk indentasi.", line, i + 1);
      if (i === text.length || text[i] === "#") continue;
      if (i % 4 !== 0)
        fail("Indentasi harus kelipatan empat spasi.", line, i + 1);
      const next = i / 4;
      if (next > depth + 1)
        fail("Indentasi hanya boleh bertambah satu tingkat.", line, i + 1);
      if (next > depth) emit(TOKEN.INDENT, null, line, i + 1);
      while (depth > next) {
        emit(TOKEN.DEDENT, null, line, i + 1);
        depth--;
      }
      depth = next;
      while (i < text.length) {
        const ch = text[i];
        const column = i + 1;
        if (ch === " ") {
          i++;
          continue;
        }
        if (ch === "#") break;
        if (ch === '"' || ch === "'") {
          const quote = ch;
          let value = "";
          i++;
          while (i < text.length && text[i] !== quote) {
            if (text[i] === "\\") {
              i++;
              const escapes = {
                n: "\n",
                r: "\r",
                t: "\t",
                "\\": "\\",
                '"': '"',
                "'": "'",
              };
              if (!Object.hasOwn(escapes, text[i]))
                fail("Escape string tidak dikenal.", line, i + 1);
              value += escapes[text[i++]];
            } else value += text[i++];
          }
          if (i === text.length) fail("String belum ditutup.", line, column);
          i++;
          emit(TOKEN.STRING, value, line, column);
          continue;
        }
        if (/[0-9]/.test(ch)) {
          const start = i;
          while (i < text.length && /[0-9]/.test(text[i])) i++;
          if (text[i] === "." && /[0-9]/.test(text[i + 1] ?? "")) {
            i++;
            while (i < text.length && /[0-9]/.test(text[i])) i++;
          }
          if (/[A-Za-z_]/.test(text[i] ?? ""))
            fail("Format angka belum didukung.", line, i + 1);
          const value = Number(text.slice(start, i));
          if (!Number.isFinite(value))
            fail("Angka terlalu besar.", line, column);
          emit(TOKEN.NUMBER, value, line, column);
          continue;
        }
        if (/[A-Za-z_]/.test(ch)) {
          const start = i++;
          while (i < text.length && /[A-Za-z0-9_]/.test(text[i])) i++;
          const value = text.slice(start, i);
          emit(
            KEYWORDS.has(value) ? value : TOKEN.IDENTIFIER,
            value,
            line,
            column,
          );
          continue;
        }
        const pair = text.slice(i, i + 2);
        if (["==", "!=", ">=", "<="].includes(pair)) {
          emit(pair, pair, line, column);
          i += 2;
          continue;
        }
        if ("+-*/%=><():,;.[ ]{}".replaceAll(" ", "").includes(ch)) {
          emit(ch, ch, line, column);
          i++;
          continue;
        }
        fail(`Karakter tidak dikenal: ${JSON.stringify(ch)}.`, line, column);
      }
      emit(TOKEN.NEWLINE, null, line, text.length + 1);
    }
    while (depth-- > 0) emit(TOKEN.DEDENT, null, lines.length, 1);
    emit(TOKEN.EOF, null, lines.length, lines.at(-1).length + 1);
    return tokens;
  }
}
export const tokenize = (source, options) =>
  new Lexer(source, options).tokenize();
