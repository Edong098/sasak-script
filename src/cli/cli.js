#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { realpath } from "node:fs/promises";
import { ExecutionBudget } from "../runtime/budget.js";
import { readSource } from "../runtime/source.js";
import { resolve, extname } from "node:path";
import { run, SasakError } from "../index.js";

const { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
);
// Tampilkan karakter kontrol sebagai teks agar source tidak mengirim perintah terminal.
const terminalText = (text) =>
  text.replace(
    /[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,
    (ch) => `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
const args = process.argv.slice(2);
const help = `Sasak Script — Bahasa Lokal, Logika Global.

Penggunaan:
  sasak <file.lu>    Jalankan program Sasak Script
  sasak --help      Tampilkan bantuan
  sasak --version   Tampilkan versi
`;

try {
  if (
    args.length === 0 ||
    (args.length === 1 && ["--help", "-h"].includes(args[0]))
  ) {
    process.stdout.write(help);
  } else if (args.length === 1 && ["--version", "-v"].includes(args[0])) {
    process.stdout.write(`${version}\n`);
  } else if (
    args.length === 1 &&
    !args[0].startsWith("-") &&
    extname(args[0]) === ".lu"
  ) {
    let file = resolve(args[0]);
    const budget = new ExecutionBudget();
    let source;
    try {
      file = await realpath(file);
      source = await readSource(file, budget);
    } catch (error) {
      if (error instanceof SasakError) throw error;
      throw new SasakError(
        "File tidak dapat dibaca. Periksa path dan izin akses.",
        { file },
        "FileError",
      );
    }
    await run(source, {
      file,
      budget,
      output: (text) => process.stdout.write(`${terminalText(text)}\n`),
    });
  } else
    throw new SasakError(
      "Gunakan satu file .lu, --help, atau --version.",
      { file: "<cli>" },
      "ArgumentError",
    );
} catch (error) {
  process.stderr.write(
    `${terminalText(error instanceof SasakError ? error.toString() : `Kesalahan internal: ${error.message}`)}\n`,
  );
  process.exitCode = 1;
}
