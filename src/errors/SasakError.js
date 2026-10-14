/** Kesalahan bahasa yang menyimpan lokasi source untuk CLI dan editor. */
export class SasakError extends Error {
  constructor(message, location = {}, kind = "SyntaxError") {
    super(message);
    this.name = kind;
    this.line = location.line ?? 1;
    this.column = location.column ?? 1;
    this.file = location.file ?? "<source>";
  }
  toString() {
    return `${this.file}:${this.line}:${this.column} ${this.name}: ${this.message}`;
  }
}
