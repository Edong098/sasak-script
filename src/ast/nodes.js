/** Node AST adalah data biasa, dengan lokasi source untuk diagnostik runtime. */
export function node(type, location, fields = {}) {
  return { type, location: { line: location.line, column: location.column, file: location.file }, ...fields };
}
