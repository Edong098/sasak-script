import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  realpath,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { run, parse, tokenize, SasakError } from "../src/index.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const cli = join(root, "src", "cli", "cli.js");
const expected = {
  "untuk.lu": "0\n1\n3\n4\n",
  "hello.lu": "Halo, Sasak Script!\n",
  "persegi.lu": "Luas persegi:\n25\n",
  "kondisi.lu": "Dewasa\n",
  "perulangan.lu": "1\n2\n3\n4\n5\n",
  "fungsi.lu": "8\n",
  "belajar.lu": "Halo Ahmad\nSudah dewasa\n",
  "data.lu": "10\nAli\n",
  "oop.lu": "Halo Ahmad\nManusia\n",
  "modul.lu": "8\nContoh error\n",
  "async.lu": "8\n",
};
for (const [name, stdout] of Object.entries(expected)) {
  test(`integrasi CLI seluruh contoh: ${name}`, () => {
    const result = spawnSync(
      process.execPath,
      [cli, join(root, "examples", name)],
      { encoding: "utf8", cwd: tmpdir(), timeout: 5000 },
    );
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, stdout);
    assert.equal(result.stderr, "");
  });
}
test("path berisi spasi, CRLF dan impor relatif saat cwd berbeda", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "sasak dengan spasi "));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await writeFile(
    join(dir, "helper.lu"),
    "sugulang gaweq nilai():\r\n    sempuleq 7\r\n",
  );
  await writeFile(
    join(dir, "main.lu"),
    'temang "./helper.lu"\r\ngitaq(nilai())\r\n',
  );
  const result = spawnSync(process.execPath, [cli, join(dir, "main.lu")], {
    encoding: "utf8",
    cwd: tmpdir(),
    timeout: 5000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "7\n");
});
test("CLI error memiliki nama file, baris dan kolom", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "sasak-error-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const [name, source, diagnostic] of [
    ["runtime.lu", "pengaq a = 1\ngitaq(hilang)", ":2:7 RuntimeError"],
    ["syntax.lu", "gitaq(1)\n@", ":2:1 SyntaxError"],
  ]) {
    const file = join(dir, name);
    await writeFile(file, source);
    const result = spawnSync(process.execPath, [cli, file], {
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    // CLI menampilkan path canonical, termasuk ekspansi path pendek Windows.
    const canonicalFile = await realpath(file);
    assert.ok(
      result.stderr.includes(canonicalFile + diagnostic),
      result.stderr,
    );
    assert.doesNotMatch(result.stderr, /at .*\(/);
  }
});
test("diagnostik CLI memakai path canonical saat file melalui alias folder", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "sasak-alias-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const actual = join(dir, "actual");
  const alias = join(dir, "alias");
  await mkdir(actual);
  await writeFile(join(actual, "runtime.lu"), "pengaq a = 1\ngitaq(hilang)");
  // Junction Windows tidak memerlukan hak pembuatan symlink file.
  await symlink(
    actual,
    alias,
    process.platform === "win32" ? "junction" : "dir",
  );
  const file = join(alias, "runtime.lu");
  const canonicalFile = await realpath(file);
  assert.notEqual(file, canonicalFile);
  const result = spawnSync(process.execPath, [cli, file], {
    encoding: "utf8",
    timeout: 5000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.ok(
    result.stderr.includes(canonicalFile + ":2:7 RuntimeError"),
    result.stderr,
  );
  assert.doesNotMatch(result.stderr, /at .*\(/);
});

test("API publik, source kosong, unary plus dan immutable posisi", async () => {
  assert.equal(tokenize("")[0].type, "EOF");
  assert.deepEqual(parse("").body, []);
  const env = await run("pengaq a = +3");
  assert.equal(env.get("a"), 3);
  await assert.rejects(
    run("gitaq(x)", { file: "contoh.lu" }),
    (e) =>
      e instanceof SasakError &&
      e.line === 1 &&
      e.column === 7 &&
      e.file === "contoh.lu",
  );
});
test("builtin disimpan sebagai nilai dan evaluasi argumen berurutan", async () => {
  const lines = [];
  await run(
    "pengaq cetak = gitaq\npengaq n = 0\ngaweq naik():\n    n = n + 1\n    sempuleq n\ngaweq gabung(a, b):\n    sempuleq a * 10 + b\ncetak(gabung(naik(), naik()))",
    { output: (x) => lines.push(x) },
  );
  assert.deepEqual(lines, ["12"]);
});
test("kelas induk null ditolak dan super constructor hanya di constructor", async () => {
  await assert.rejects(
    run(
      "pengaq A = deq_araq\nbale B tunang A:\n    gaweq nilai():\n        sempuleq 1",
    ),
    /harus class/,
  );
  await assert.rejects(
    run(
      "bale A:\n    sandiang():\n        pengaq x = 1\nbale B tunang A:\n    gaweq f():\n        lokaq()\npengaq b = jariang B()\nb.f()",
    ),
    /constructor instance/,
  );
});
test("async yang gagal memiliki lokasi gitaq dan di-drain ketika utama gagal", async () => {
  await assert.rejects(
    run("liwatin gaweq f():\n    sempuleq 1\ngitaq(f())", { file: "async.lu" }),
    (e) => e.line === 3 && e.column === 1 && e.file === "async.lu",
  );
  const lines = [];
  await assert.rejects(
    run(
      'liwatin gaweq f():\n    gitaq("selesai")\nf()\npelewas "utama gagal"',
      { output: (x) => lines.push(x) },
    ),
    /utama gagal/,
  );
  const count = lines.length;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(lines.length, count);
  assert.deepEqual(lines, ["selesai"]);
});
test("module mengekspor class dan async, import utama sendiri ditolak", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "sasak-export-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await writeFile(
    join(dir, "lib.lu"),
    "sugulang bale A:\n    gaweq nilai():\n        sempuleq 4\nsugulang liwatin gaweq angka():\n    sempuleq 5",
  );
  const lines = [];
  await run(
    'temang "./lib.lu"\nliwatin gaweq utama():\n    gitaq(jariang A().nilai())\n    gitaq(anti angka())\nutama()',
    { file: join(dir, "main.lu"), output: (x) => lines.push(x) },
  );
  assert.deepEqual(lines, ["4", "5"]);
  const file = join(dir, "self.lu");
  const source = 'temang "./self.lu"';
  await writeFile(file, source);
  await assert.rejects(run(source, { file }), /melingkar/);
});
test("tidak memakai eksekusi dinamis JavaScript pada implementasi", async () => {
  for (const file of [
    "runtime/interpreter.js",
    "parser/parser.js",
    "lexer/lexer.js",
    "runtime/modules.js",
    "runtime/async.js",
  ]) {
    const source = await readFile(join(root, "src", file), "utf8");
    assert.doesNotMatch(source, /\beval\s*\(|\bnew\s+Function\s*\(/);
  }
});
