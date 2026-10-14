#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);
const args = process.argv.slice(2);
const help = `Sasak Script — Bahasa Lokal, Logika Global.

Penggunaan:
  sasak --help       Tampilkan bantuan
  sasak --version    Tampilkan versi

Interpreter belum tersedia. File .lu belum dapat dieksekusi.
`;

if (args.length === 0 || (args.length === 1 && ['--help', '-h'].includes(args[0]))) {
  process.stdout.write(help);
} else if (args.length === 1 && ['--version', '-v'].includes(args[0])) {
  process.stdout.write(`${version}\n`);
} else {
  process.stderr.write('Argumen belum didukung. Interpreter belum tersedia; file .lu belum dapat dieksekusi. Gunakan --help.\n');
  process.exitCode = 1;
}
