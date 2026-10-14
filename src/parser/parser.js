import { node } from "../ast/nodes.js";
import { tokenize } from "../lexer/lexer.js";
import { SasakError } from "../errors/SasakError.js";

const PRECEDENCE = {
  atau: 1,
  dan: 2,
  "==": 3,
  "!=": 3,
  ">": 4,
  "<": 4,
  ">=": 4,
  "<=": 4,
  "+": 5,
  "-": 5,
  "*": 6,
  "/": 6,
  "%": 6,
};
export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
    this.loopDepth = 0;
    this.functionDepth = 0;
    this.blockDepth = 0;
    this.asyncContext = false;
  }
  peek() {
    return this.tokens[this.current];
  }
  at(type) {
    return this.peek().type === type;
  }
  take() {
    return this.tokens[this.current++];
  }
  match(type) {
    if (this.at(type)) return this.take();
    return null;
  }
  error(message, token = this.peek()) {
    throw new SasakError(message, token);
  }
  expect(type) {
    if (!this.at(type))
      this.error(`Diharapkan ${type}, ditemukan ${this.peek().type}.`);
    return this.take();
  }
  parse() {
    const start = this.peek();
    const body = [];
    while (!this.at("EOF")) body.push(this.statement());
    return node("Program", start, { body });
  }
  end() {
    if (!this.match("NEWLINE") && !this.at("EOF") && !this.at("DEDENT"))
      this.error("Statement harus diakhiri baris baru.");
  }
  statement() {
    const start = this.peek();
    if (this.match("temang")) {
      if (this.blockDepth)
        this.error("temang hanya boleh di tingkat modul.", start);
      const path = this.expect("STRING").value;
      this.end();
      return node("Import", start, { path });
    }
    if (this.match("sugulang")) {
      if (this.blockDepth)
        this.error("sugulang hanya boleh di tingkat modul.", start);
      const declaration = this.statement();
      if (!["Declaration", "Function", "Class"].includes(declaration.type))
        this.error(
          "Ekspor harus deklarasi variabel, fungsi, atau class.",
          start,
        );
      return node("Export", start, { declaration });
    }
    if (this.match("cobaq")) {
      const body = this.block();
      this.expect("bauang");
      const name = this.expect("IDENTIFIER").value;
      const handler = this.block();
      return node("Try", start, { body, name, handler });
    }
    if (this.match("pelewas")) {
      const value = this.expression();
      this.end();
      return node("Throw", start, { value });
    }
    if (this.match("bale")) return this.classDefinition(start);
    if (this.match("liwatin")) {
      this.expect("gaweq");
      return this.functionDefinition(start, null, true);
    }
    if (this.match("gaweq")) return this.functionDefinition(start);
    if (this.match("sempuleq")) {
      if (!this.functionDepth)
        this.error("sempuleq hanya boleh digunakan di dalam fungsi.", start);
      const value = this.at("NEWLINE")
        ? node("Literal", start, { value: null })
        : this.expression();
      this.end();
      return node("Return", start, { value });
    }
    if (this.match("untuk")) {
      this.expect("(");
      const initializer = this.simpleStatement();
      if (initializer.type !== "Declaration")
        this.error(
          "Header untuk harus dimulai dengan deklarasi pengaq.",
          start,
        );
      this.expect(";");
      const condition = this.expression();
      this.expect(";");
      const update = this.simpleStatement();
      if (update.type !== "Assignment")
        this.error("Pembaruan untuk harus berupa assignment.", start);
      this.expect(")");
      return node("For", start, {
        initializer,
        condition,
        update,
        body: this.loopBlock(),
      });
    }
    if (this.match("semasih")) {
      this.expect("(");
      const condition = this.expression();
      this.expect(")");
      return node("While", start, { condition, body: this.loopBlock() });
    }
    if (this.at("mengenteng") || this.at("lanjutkan")) {
      const keyword = this.take().type;
      if (!this.loopDepth)
        this.error(`${keyword} hanya boleh digunakan di dalam loop.`, start);
      this.end();
      return node(keyword === "mengenteng" ? "Break" : "Continue", start);
    }
    if (this.match("lamun")) {
      this.expect("(");
      const condition = this.expression();
      this.expect(")");
      const consequent = this.block();
      const alternate = this.match("deq") ? this.block() : [];
      return node("If", start, { condition, consequent, alternate });
    }
    const result = this.simpleStatement();
    this.end();
    return result;
  }
  simpleStatement() {
    const start = this.peek();
    let result;
    if (this.match("pengaq")) {
      const name = this.expect("IDENTIFIER").value;
      this.expect("=");
      result = node("Declaration", start, { name, value: this.expression() });
    } else {
      const expression = this.expression();
      if (this.match("=")) {
        if (!["Identifier", "Member"].includes(expression.type))
          this.error(
            "Target assignment harus variabel, index, atau property.",
            start,
          );
        result = node("Assignment", start, {
          target: expression,
          value: this.expression(),
        });
      } else result = node("ExpressionStatement", start, { expression });
    }
    return result;
  }
  loopBlock() {
    this.loopDepth++;
    try {
      return this.block();
    } finally {
      this.loopDepth--;
    }
  }
  classDefinition(start) {
    const name = this.expect("IDENTIFIER").value;
    const parent = this.match("tunang")
      ? this.expect("IDENTIFIER").value
      : null;
    this.expect(":");
    this.expect("NEWLINE");
    this.expect("INDENT");
    const methods = [];
    while (!this.at("DEDENT") && !this.at("EOF")) {
      const token = this.peek();
      const isStatic = Boolean(this.match("melengo"));
      const isAsync = Boolean(this.match("liwatin"));
      let method;
      if (!isStatic && !isAsync && this.match("sandiang"))
        method = this.functionDefinition(token, "sandiang");
      else {
        this.expect("gaweq");
        method = this.functionDefinition(token, null, isAsync);
      }
      if (
        methods.some((m) => m.name === method.name && m.isStatic === isStatic)
      )
        this.error("Method tidak boleh duplikat.", token);
      methods.push({ ...method, isStatic });
    }
    this.expect("DEDENT");
    return node("Class", start, { name, parent, methods });
  }
  functionDefinition(start, name = null, isAsync = false) {
    name ??= this.expect("IDENTIFIER").value;
    this.expect("(");
    const params = [];
    if (!this.at(")")) {
      do {
        const token = this.expect("IDENTIFIER");
        if (params.includes(token.value))
          this.error("Parameter tidak boleh duplikat.", token);
        params.push(token.value);
      } while (this.match(","));
    }
    this.expect(")");
    const previousLoop = this.loopDepth;
    const previousAsync = this.asyncContext;
    this.asyncContext = isAsync;
    this.loopDepth = 0;
    this.functionDepth++;
    const body = this.block();
    this.functionDepth--;
    this.loopDepth = previousLoop;
    this.asyncContext = previousAsync;
    return node("Function", start, { name, params, body, isAsync });
  }
  block() {
    this.expect(":");
    this.expect("NEWLINE");
    this.expect("INDENT");
    const body = [];
    this.blockDepth++;
    while (!this.at("DEDENT") && !this.at("EOF")) body.push(this.statement());
    this.expect("DEDENT");
    this.blockDepth--;
    return body;
  }
  expression(min = 0) {
    let left = this.unary();
    while (
      Object.hasOwn(PRECEDENCE, this.peek().type) &&
      PRECEDENCE[this.peek().type] >= min
    ) {
      const op = this.take();
      const right = this.expression(PRECEDENCE[op.type] + 1);
      left = node("Binary", op, { operator: op.type, left, right });
    }
    return left;
  }
  unary() {
    if (this.at("anti")) {
      const token = this.take();
      if (!this.asyncContext)
        this.error("anti hanya boleh di dalam fungsi liwatin.", token);
      return node("Await", token, { argument: this.unary() });
    }
    if (["-", "+", "bukan"].includes(this.peek().type)) {
      const op = this.take();
      return node("Unary", op, { operator: op.type, argument: this.unary() });
    }
    return this.postfix();
  }
  postfix() {
    let expr = this.primary();
    for (;;) {
      if (this.match("(")) {
        const args = this.expressionList(")");
        expr = node("Call", expr.location, { callee: expr, args });
      } else if (this.match("[")) {
        const property = this.expression();
        this.expect("]");
        expr = node("Member", expr.location, { object: expr, property });
      } else if (this.match(".")) {
        const property = this.expect("IDENTIFIER");
        expr = node("Member", expr.location, {
          object: expr,
          property: node("Literal", property, { value: property.value }),
        });
      } else break;
    }
    return expr;
  }
  expressionList(closing) {
    const expressions = [];
    if (!this.at(closing)) {
      do {
        expressions.push(this.expression());
      } while (this.match(","));
    }
    this.expect(closing);
    return expressions;
  }
  primary() {
    const token = this.take();
    if (["tetu", "salaq", "deq_araq"].includes(token.type))
      return node("Literal", token, {
        value: { tetu: true, salaq: false, deq_araq: null }[token.type],
      });
    if (["NUMBER", "STRING"].includes(token.type))
      return node("Literal", token, { value: token.value });
    if (["IDENTIFIER", "gitaq", "niki", "lokaq"].includes(token.type))
      return node("Identifier", token, { name: token.value });
    if (token.type === "jariang") {
      const klass = node("Identifier", this.peek(), {
        name: this.expect("IDENTIFIER").value,
      });
      this.expect("(");
      const args = this.expressionList(")");
      return node("New", token, { klass, args });
    }
    if (token.type === "[") {
      const elements = this.expressionList("]");
      return node("Array", token, { elements });
    }
    if (token.type === "{") {
      const entries = [];
      if (!this.at("}")) {
        do {
          const key = this.expect("STRING");
          this.expect(":");
          if (entries.some((entry) => entry.key === key.value))
            this.error("Key object duplikat.", key);
          entries.push({ key: key.value, value: this.expression() });
        } while (this.match(","));
      }
      this.expect("}");
      return node("Object", token, { entries });
    }
    if (token.type === "(") {
      const expr = this.expression();
      this.expect(")");
      return expr;
    }
    this.error(`Ekspresi tidak valid: ${token.type}.`, token);
  }
}
export const parse = (source, options) =>
  new Parser(tokenize(source, options)).parse();
