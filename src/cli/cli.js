#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve, extname } from "node:path";
import { run, SasakError } from "../index.js";

const { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
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
    const file = resolve(args[0]);
    let source;
    try {
      source = readFileSync(file, "utf8");
    } catch {
      throw new SasakError(
        "File tidak dapat dibaca. Periksa path dan izin akses.",
        { file },
        "FileError",
      );
    }
    await run(source, { file });
  } else
    throw new SasakError(
      "Gunakan satu file .lu, --help, atau --version.",
      { file: "<cli>" },
      "ArgumentError",
    );
} catch (error) {
  process.stderr.write(
    `${error instanceof SasakError ? error.toString() : `Kesalahan internal: ${error.message}`}\n`,
  );
  process.exitCode = 1;
}
